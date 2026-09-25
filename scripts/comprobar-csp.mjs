/**
 * Comprueba, sin navegador ni servidor, que la politica de seguridad de contenido
 * de `_headers` no bloquea nada de lo que el sitio carga (iteracion 51).
 *
 * Por que existe este script:
 * Una politica mal calibrada rompe el sitio EN SILENCIO. Medido el 2026-09-23 con la
 * politica estricta obligatoria sobre el codigo de entonces: las barras de progreso
 * seguian iguales —se pintan por CSSOM, y la politica no toca eso—, pero los tres
 * puntos de la transicion de carga dejaban de ir desfasados y latian juntos. Sin
 * un solo error que el estudiante pudiera ver, y con uno de consola que solo ve
 * quien la abre.
 *
 * Este comprobador existe para que eso lo diga un comando, con archivo y linea, y
 * no un navegador cuando ya esta publicado. Lee la politica de `_headers` —en el
 * modo que este, informe u obligatorio— y revisa:
 *
 *   - las paginas: scripts en linea, manejadores `on...=`, `javascript:`, atributos
 *     `style=` y bloques `<style>`, formularios, y cada origen externo de script,
 *     hoja de estilos, imagen o icono contra su directiva;
 *   - `static/js/`: `style=` y manejadores dentro de marcado armado con cadenas
 *     (lo que entra por innerHTML), `setAttribute('style')`, `eval`,
 *     `new Function`, y cada `fetch` a otro origen;
 *   - `static/css/`: cada `url(...)` contra `img-src` o `font-src`.
 *
 * Y revisa la politica misma contra lo decidido: sin 'unsafe-inline' ni en
 * script-src ni en style-src (decision 1 de la PARADA 1, 2026-09-23), object-src
 * y frame-ancestors en 'none', y connect-src y script-src con sus fuentes exactas: 'self'
 * (ADR-011) y el unico origen de Cloudflare Web Analytics que cada una necesita
 * (ADR-036). Ni uno mas: un origen agregado sin su ADR es un rojo.
 *
 * static/js/data/ NO se revisa, y es la misma regla de build-dist.mjs (H-031): esos
 * archivos guardan material citado. Un ejemplo de HTML con `style=` dentro de una
 * pregunta no es marcado del sitio: se escapa antes de insertarse.
 *
 * LO QUE NO VE, dicho para que no se lea como un agujero: el CSSOM. Asignar
 * `elemento.style.width` desde JavaScript no lo gobierna la politica, y por eso
 * este comprobador no lo marca. No es un olvido: es lo que hace que las barras
 * sigan funcionando con la politica estricta.
 *
 * Codigos de salida:
 *   0  COMPATIBLE      la politica cumple lo decidido y no bloquea nada del sitio
 *   1  INCOMPATIBLE    algo del sitio quedaria bloqueado, o la politica no cumple
 *   2  NO SE PUDO      falta una pagina o no se deja leer
 *
 * Uso: npm run verificar:csp
 * RAIZ_A_REVISAR=<carpeta> revisa una copia en vez del repositorio: es como se
 * demuestra que el comprobador falla cuando debe, sin tocar el sitio.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = process.env.RAIZ_A_REVISAR ?? join(AQUI, '..');

const COMPATIBLE = 0;
const INCOMPATIBLE = 1;
const NO_SE_PUDO = 2;

const LINEA = '='.repeat(72);

/** Las paginas del sitio. Las mismas de build-dist.mjs y comprobar-copias.mjs. */
const PAGINAS = ['index.html', 'cuestionario.html', 'simulacro.html', 'acerca-de.html'];

/** Material citado, no codigo del sitio (H-031). */
const DATOS = join('static', 'js', 'data');

const problemas = [];

function problema(archivo, linea, texto) {
  problemas.push({ archivo, linea, texto });
}

const numeroDeLinea = (texto, indice) => texto.slice(0, indice).split('\n').length;

// ---------------------------------------------------------------------------
// La politica
// ---------------------------------------------------------------------------

const rutaHeaders = join(RAIZ, '_headers');

if (!existsSync(rutaHeaders)) {
  console.log(`${LINEA}\nINCOMPATIBLE  ***  no existe _headers  ***\n${LINEA}`);
  console.log('Sin _headers no hay politica que revisar, y la iteracion 51 exige una.');
  process.exit(INCOMPATIBLE);
}

/** La politica de la regla `/*`, en el modo que venga. */
function leerPolitica(texto) {
  let enTodas = false;
  const encontradas = [];

  for (const cruda of texto.split(/\r?\n/)) {
    if (!cruda.trim() || cruda.trim().startsWith('#')) continue;
    if (!/^\s/.test(cruda)) {
      enTodas = cruda.trim() === '/*';
      continue;
    }
    const m = cruda.match(/^\s+(Content-Security-Policy(?:-Report-Only)?)\s*:\s*(.+)$/i);
    if (enTodas && m) encontradas.push({ nombre: m[1], valor: m[2] });
  }

  return encontradas;
}

const politicas = leerPolitica(readFileSync(rutaHeaders, 'utf8'));

if (politicas.length !== 1) {
  console.log(`${LINEA}\nINCOMPATIBLE  ***  _headers declara ${politicas.length} politicas para /*  ***\n${LINEA}`);
  console.log('Tiene que haber exactamente una: Content-Security-Policy o su version -Report-Only.');
  process.exit(INCOMPATIBLE);
}

const { nombre: modo, valor } = politicas[0];

/** directiva -> lista de fuentes */
const directivas = new Map(
  valor
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const [nombre, ...fuentes] = d.split(/\s+/);
      return [nombre.toLowerCase(), fuentes];
    })
);

const fuentesDe = (directiva) => directivas.get(directiva) ?? directivas.get('default-src') ?? null;

/**
 * ¿Permite `directiva` cargar `url`? Solo entiende lo que esta politica usa:
 * 'self', 'none', esquemas como data: y origenes https completos.
 */
function permite(directiva, url) {
  const fuentes = fuentesDe(directiva);
  if (!fuentes) return true; // sin directiva ni default-src no hay restriccion
  if (fuentes.includes("'none'")) return false;

  if (url.startsWith('data:')) return fuentes.includes('data:');
  if (!/^[a-z]+:/i.test(url) || url.startsWith('//127.0.0.1')) return fuentes.includes("'self'");

  let origen;
  try {
    origen = new URL(url).origin;
  } catch {
    return false;
  }
  return fuentes.some((f) => f === origen || f === `${origen}/` || f === new URL(origen).protocol);
}

// Lo decidido sobre la politica misma.
const fuenteDeLaPolitica = '_headers';

/**
 * Las fuentes exactas de las dos directivas que hablan con otros origenes.
 *
 * 'self' es la capa de datos, del mismo origen (ADR-011). Los dos origenes de
 * Cloudflare son los de Web Analytics, que la plataforma inyecta en produccion
 * (ADR-036): el beacon se carga desde static.cloudflareinsights.com y envia sus
 * mediciones a cloudflareinsights.com, sin el static. Se comparan como conjunto:
 * el orden no importa, y una fuente de mas o de menos es un rojo.
 */
const FUENTES_EXACTAS = {
  'script-src': ["'self'", 'https://static.cloudflareinsights.com'],
  'connect-src': ["'self'", 'https://cloudflareinsights.com'],
};

const sonExactamente = (fuentes, esperadas) =>
  Array.isArray(fuentes) && fuentes.length === esperadas.length && esperadas.every((e) => fuentes.includes(e));

const politicaDecidida = [
  ['script-src', (f) => f && !f.includes("'unsafe-inline'") && !f.includes("'unsafe-eval'") && !f.includes('*'),
    "script-src tiene que existir y no llevar 'unsafe-inline', 'unsafe-eval' ni *"],
  ['style-src', (f) => f && !f.includes("'unsafe-inline'"),
    "style-src tiene que existir y no llevar 'unsafe-inline' (decision 1 de la PARADA 1, 2026-09-23)"],
  ['object-src', (f) => f?.length === 1 && f[0] === "'none'", "object-src tiene que ser 'none'"],
  ['frame-ancestors', (f) => f?.length === 1 && f[0] === "'none'", "frame-ancestors tiene que ser 'none'"],
  ['base-uri', (f) => Boolean(f), 'base-uri tiene que existir'],
  ['connect-src', (f) => sonExactamente(f, FUENTES_EXACTAS['connect-src']),
    `connect-src tiene que ser exactamente ${FUENTES_EXACTAS['connect-src'].join(' ')}: la capa de datos (ADR-011) y el envio de Web Analytics (ADR-036)`],
  ['script-src', (f) => sonExactamente(f, FUENTES_EXACTAS['script-src']),
    `script-src tiene que ser exactamente ${FUENTES_EXACTAS['script-src'].join(' ')}: los modulos del sitio y el beacon de Web Analytics (ADR-036)`],
];

for (const [directiva, cumple, texto] of politicaDecidida) {
  if (!cumple(directivas.get(directiva))) problema(fuenteDeLaPolitica, null, texto);
}

const estiloEnLineaPermitido = (fuentesDe('style-src') ?? []).includes("'unsafe-inline'");

// ---------------------------------------------------------------------------
// Las paginas
// ---------------------------------------------------------------------------

let ilegibles = 0;

for (const pagina of PAGINAS) {
  const ruta = join(RAIZ, pagina);
  if (!existsSync(ruta)) {
    console.log(`  no se pudo leer ${pagina}`);
    ilegibles++;
    continue;
  }
  const html = readFileSync(ruta, 'utf8');

  for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
    const src = m[1].match(/\bsrc="([^"]*)"/i)?.[1];
    const linea = numeroDeLinea(html, m.index);
    if (!src) problema(pagina, linea, 'script en linea: la politica no lo deja ejecutar');
    else if (!permite('script-src', src)) problema(pagina, linea, `script de ${src}, que script-src no permite`);
  }

  for (const m of html.matchAll(/<link\b([^>]*)>/gi)) {
    const rel = m[1].match(/\brel="([^"]*)"/i)?.[1] ?? '';
    const href = m[1].match(/\bhref="([^"]*)"/i)?.[1];
    if (!href) continue;
    const directiva = /\bstylesheet\b/.test(rel) ? 'style-src' : /\bicon\b/.test(rel) ? 'img-src' : null;
    if (directiva && !permite(directiva, href)) {
      problema(pagina, numeroDeLinea(html, m.index), `${rel} de ${href}, que ${directiva} no permite`);
    }
  }

  for (const m of html.matchAll(/<img\b[^>]*\bsrc="([^"]*)"/gi)) {
    if (!permite('img-src', m[1])) problema(pagina, numeroDeLinea(html, m.index), `imagen de ${m[1]}, que img-src no permite`);
  }

  for (const m of html.matchAll(/<[a-z][^>]*\s(on[a-z]+)=/gi)) {
    problema(pagina, numeroDeLinea(html, m.index), `manejador en linea ${m[1]}=: la politica no lo deja ejecutar`);
  }

  for (const m of html.matchAll(/(href|src)="javascript:/gi)) {
    problema(pagina, numeroDeLinea(html, m.index), 'enlace javascript:: la politica no lo deja ejecutar');
  }

  if (!estiloEnLineaPermitido) {
    for (const m of html.matchAll(/<[a-z][^>]*\sstyle="([^"]*)"/gi)) {
      problema(pagina, numeroDeLinea(html, m.index), `atributo style="${m[1]}": style-src no lo deja aplicar`);
    }
    for (const m of html.matchAll(/<style\b/gi)) {
      problema(pagina, numeroDeLinea(html, m.index), 'bloque <style>: style-src no lo deja aplicar');
    }
  }

  for (const m of html.matchAll(/<(object|embed|form)\b/gi)) {
    problema(pagina, numeroDeLinea(html, m.index), `<${m[1]}>: la politica no lo permite (object-src / form-action)`);
  }

  // Las tipografias: la hoja de Google trae las fuentes desde gstatic.
  if (/href="https:\/\/fonts\.googleapis\.com\/css/.test(html) && !permite('font-src', 'https://fonts.gstatic.com/x.woff2')) {
    problema(pagina, null, 'carga la hoja de Google Fonts, pero font-src no permite https://fonts.gstatic.com');
  }
}

// ---------------------------------------------------------------------------
// El JavaScript del sitio
// ---------------------------------------------------------------------------

/** Borra los comentarios conservando los saltos de linea, para no mover los numeros. */
function sinComentarios(codigo) {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/(^|[\s;{}(),])\/\/[^\n]*/g, (c, antes) => antes + ' '.repeat(c.length - antes.length));
}

function archivosJs(carpeta) {
  const salida = [];
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) {
      if (relative(RAIZ, ruta) !== DATOS) salida.push(...archivosJs(ruta));
    } else if (entrada.name.endsWith('.js')) {
      salida.push(ruta);
    }
  }
  return salida;
}

const carpetaJs = join(RAIZ, 'static', 'js');
const js = existsSync(carpetaJs) ? archivosJs(carpetaJs) : [];
if (!js.length) {
  console.log('  no se encontro JavaScript en static/js/');
  ilegibles++;
}

const REGLAS_JS = [
  [/\sstyle=["'$]/g, () => !estiloEnLineaPermitido, 'atributo style= dentro de marcado armado con cadenas: style-src no lo deja aplicar'],
  [/setAttribute\(\s*['"]style['"]/g, () => !estiloEnLineaPermitido, "setAttribute('style'): style-src no lo deja aplicar"],
  [/<[a-z][^<>]*\son[a-z]+=["'$]/g, () => true, 'manejador on...= dentro de marcado: la politica no lo deja ejecutar'],
  [/<script\b/g, () => true, '<script> dentro de marcado: la politica no lo deja ejecutar'],
  [/\beval\s*\(|\bnew\s+Function\s*\(/g, () => true, 'eval o new Function: script-src no los permite'],
  [/javascript:/g, () => true, 'javascript:: la politica no lo deja ejecutar'],
];

for (const ruta of js) {
  const archivo = relative(RAIZ, ruta).replaceAll('\\', '/');
  const codigo = sinComentarios(readFileSync(ruta, 'utf8'));

  for (const [patron, aplica, texto] of REGLAS_JS) {
    if (!aplica()) continue;
    for (const m of codigo.matchAll(patron)) problema(archivo, numeroDeLinea(codigo, m.index), texto);
  }

  for (const m of codigo.matchAll(/\bfetch\(\s*['"`](https?:\/\/[^'"`/]+)/g)) {
    if (!permite('connect-src', m[1])) problema(archivo, numeroDeLinea(codigo, m.index), `fetch a ${m[1]}, que connect-src no permite`);
  }

  for (const m of codigo.matchAll(/<img\b[^>]*\bsrc=["'](https?:\/\/[^"']+)/g)) {
    if (!permite('img-src', m[1])) problema(archivo, numeroDeLinea(codigo, m.index), `imagen de ${m[1]}, que img-src no permite`);
  }
}

// ---------------------------------------------------------------------------
// El CSS compilado
// ---------------------------------------------------------------------------

const carpetaCss = join(RAIZ, 'static', 'css');
for (const nombre of existsSync(carpetaCss) ? readdirSync(carpetaCss).filter((n) => n.endsWith('.css')) : []) {
  const css = readFileSync(join(carpetaCss, nombre), 'utf8');
  const vistos = new Set();

  for (const m of css.matchAll(/url\(\s*["']?([^"')\s]+)/g)) {
    const url = m[1];
    const clase = url.startsWith('data:') ? 'data:' : /^https?:/.test(url) ? new URL(url).origin : "'self'";
    if (vistos.has(clase)) continue;
    vistos.add(clase);
    if (!permite('img-src', url) && !permite('font-src', url)) {
      problema(`static/css/${nombre}`, numeroDeLinea(css, m.index), `url(${clase}...), que ni img-src ni font-src permiten`);
    }
  }
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

console.log(`${LINEA}\nPolitica de contenido contra lo que el sitio carga (iteracion 51)\n${LINEA}`);
console.log(`  politica: ${modo}${modo.endsWith('Report-Only') ? '   (MODO INFORME: avisa, no bloquea)' : ''}`);
console.log(`  revisado: ${PAGINAS.length - ilegibles} pagina(s), ${js.length} archivo(s) de static/js (sin data/), static/css/`);

if (problemas.length) {
  console.log(`\n${LINEA}\nINCOMPATIBLE  ***  ${problemas.length}  ***\n${LINEA}`);
  for (const p of problemas) console.log(`  ${p.archivo}${p.linea ? `:${p.linea}` : ''}  ${p.texto}`);
  console.log('');
  process.exit(INCOMPATIBLE);
}

if (ilegibles) {
  console.log(`\n${LINEA}\nNO SE PUDO COMPROBAR  ***  ESTO NO ES UN APROBADO  ***\n${LINEA}\n`);
  process.exit(NO_SE_PUDO);
}

console.log(`\n${LINEA}\nCOMPATIBLE\n${LINEA}\n`);
process.exit(COMPATIBLE);
