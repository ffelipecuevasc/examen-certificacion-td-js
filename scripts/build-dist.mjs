/**
 * Arma dist/, el directorio que Cloudflare Pages publica.
 *
 * Por que existe este script:
 * Cloudflare Pages sube al sitio todo lo que encuentre en el directorio de salida.
 * Si ese directorio fuera la raiz del repositorio, se publicarian tambien la
 * planificacion (_planmaestro/), las instrucciones de Claude (CLAUDE.md), la fuente
 * de Tailwind y los scripts de construccion. Copiando a dist/ solo lo que el sitio
 * necesita, la regla se invierte: lo que no aparece en LISTA_COPIA no llega a
 * internet. Es una lista de admitidos, no una de excluidos, que es la forma segura
 * de plantearlo. Ver ADR-010.
 *
 * Se ejecuta al final de `npm run build`, despues de generar los CSS, porque copia
 * el resultado de esa generacion.
 *
 * Uso: node scripts/build-dist.mjs
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DESTINO = 'dist';

/**
 * El directorio que Cloudflare publica lo declara wrangler.toml, no este script.
 *
 * Son dos archivos distintos diciendo la misma cosa, y por eso pueden discrepar:
 * si alguien cambia uno y olvida el otro, la construccion armaria una carpeta que
 * el despliegue no mira, y el sitio quedaria publicado vacio mientras las
 * funciones siguen respondiendo. Comprobado a proposito: con el directorio
 * equivocado en el archivo, /cuestionario responde 404 y /api/estado responde 200.
 *
 * El sintoma es lo bastante confuso como para justificar esta comprobacion, que
 * detiene la construccion antes de que llegue a Cloudflare.
 *
 * La orden de construccion, en cambio, NO se puede fijar aca ni en wrangler.toml:
 * vive solo en el panel. Ver el procedimiento en _planmaestro/90-manual/.
 */
function directorioDeclaradoEnWrangler() {
  if (!existsSync('wrangler.toml')) return null;
  const encontrado = readFileSync('wrangler.toml', 'utf8')
    .match(/^\s*pages_build_output_dir\s*=\s*["']([^"']+)["']/m);
  return encontrado ? encontrado[1].replace(/^\.\//, '').replace(/\/$/, '') : null;
}

const declarado = directorioDeclaradoEnWrangler();

if (declarado !== null && declarado !== DESTINO) {
  console.error(`ERROR: wrangler.toml publica "${declarado}" y este script arma "${DESTINO}".`);
  console.error('Cloudflare publica lo que diga wrangler.toml, asi que el sitio saldria vacio.');
  console.error('Deja los dos valores iguales antes de seguir.');
  process.exit(1);
}

/**
 * Lo unico que se publica. Cualquier archivo del repositorio que no este aqui
 * dentro se queda fuera del sitio.
 *
 * static/resources/ viaja entero aunque los SVG sean material de origen del
 * generador de iconos: index.html y cuestionario.html enlazan js-logo.svg y
 * notebooklm-gemini-icon.svg directamente. Filtrarlos por nombre romperia el sitio
 * en silencio el dia que alguien enlace un tercero.
 */
const LISTA_COPIA = [
  'index.html',
  'cuestionario.html',
  'static',
];

/** Paginas cuyos enlaces locales se comprueban al terminar. */
const PAGINAS = ['index.html', 'cuestionario.html'];

// ---------------------------------------------------------------------------
// Copia
// ---------------------------------------------------------------------------

rmSync(DESTINO, { recursive: true, force: true });
mkdirSync(DESTINO, { recursive: true });

let copiados = 0;
for (const origen of LISTA_COPIA) {
  if (!existsSync(origen)) {
    console.error(`ERROR: falta ${origen}, que LISTA_COPIA declara obligatorio.`);
    process.exit(1);
  }
  cpSync(origen, join(DESTINO, origen), { recursive: true });
  copiados++;
}

// ---------------------------------------------------------------------------
// Comprobacion: la capa de datos no puede terminar dentro de dist/
// ---------------------------------------------------------------------------

/**
 * functions/ y wrangler.toml viven en la raiz del repositorio y ahi se quedan.
 * Cloudflare compila functions/ por su cuenta, aparte del directorio de salida; su
 * documentacion es explicita en que no debe estar dentro de el.
 *
 * Si alguno se colara en dist/ pasarian dos cosas, y la segunda es la grave: Pages
 * dejaria de tratar la carpeta como codigo y la serviria como archivo estatico, o
 * sea que el codigo de la capa de datos quedaria descargable en texto plano desde
 * el sitio.
 *
 * Hoy no puede ocurrir, porque LISTA_COPIA no los nombra. La comprobacion existe
 * para el dia en que alguien agregue una entrada a esa lista sin acordarse de esto.
 */
const PROHIBIDOS_EN_DESTINO = ['functions', 'wrangler.toml', '.dev.vars', '.wrangler'];

const colados = PROHIBIDOS_EN_DESTINO.filter((nombre) => existsSync(join(DESTINO, nombre)));

if (colados.length) {
  console.error(`ERROR: ${colados.length} entrada(s) que no deben publicarse llegaron a ${DESTINO}/:`);
  for (const c of colados) console.error(`  - ${c}`);
  console.error('Revisa LISTA_COPIA en este mismo archivo. La capa de datos va en la raiz, no en el directorio de salida.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Comprobacion: ningun enlace local de las paginas puede quedar sin destino
// ---------------------------------------------------------------------------

/** Resuelve una ruta relativa contra la pagina que la contiene. */
function resolver(desde, rel) {
  const base = desde.includes('/') ? desde.slice(0, desde.lastIndexOf('/')) : '';
  const pila = [];
  for (const parte of (base ? `${base}/${rel}` : rel).split('/')) {
    if (parte === '' || parte === '.') continue;
    if (parte === '..') pila.pop();
    else pila.push(parte);
  }
  return pila.join('/');
}

/**
 * Enlaces locales de un archivo.
 *
 * En un .html cuentan los atributos src/href. En un modulo ES solo cuentan los
 * import: los archivos de static/js/data/ guardan ejemplos de HTML como texto
 * —material didactico— y sus src/href apuntan a archivos imaginarios como
 * avatar.jpg. Tratarlos como referencias reales rompe la construccion sin motivo.
 * Es el mismo malentendido que describe H-003: contenido que contiene marcado no
 * es marcado.
 *
 * Consecuencia asumida: si algun dia una plantilla de JavaScript enlaza un recurso
 * propio, esta comprobacion no lo vera. Las paginas si se revisan enteras.
 */
function referencias(ruta, texto) {
  const crudas = ruta.endsWith('.html')
    ? [...texto.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1])
    : [...texto.matchAll(/import\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]/g)].map((m) => m[1]);

  return crudas
    .map((r) => r.split('#')[0].split('?')[0])
    .filter((r) => r && !/^(https?:|mailto:|data:|#)/.test(r));
}

const porRevisar = [...PAGINAS];
const revisados = new Set();
const rotos = [];
let comprobados = 0;

while (porRevisar.length) {
  const ruta = porRevisar.shift();
  if (revisados.has(ruta)) continue;
  revisados.add(ruta);

  const enDestino = join(DESTINO, ruta);
  if (!existsSync(enDestino) || !statSync(enDestino).isFile()) {
    rotos.push(ruta);
    continue;
  }
  comprobados++;

  // Solo se sigue el rastro dentro de archivos de texto que enlazan a otros.
  if (!/\.(html|js|mjs)$/.test(ruta)) continue;
  for (const ref of referencias(ruta, readFileSync(enDestino, 'utf8'))) {
    porRevisar.push(resolver(ruta, ref));
  }
}

if (rotos.length) {
  console.error(`ERROR: ${rotos.length} referencia(s) sin destino dentro de ${DESTINO}/:`);
  for (const r of rotos) console.error(`  - ${r}`);
  console.error('La construccion se detiene: publicar asi dejaria recursos rotos en el sitio.');
  process.exit(1);
}

console.log(`${copiados} entradas copiadas a ${DESTINO}/`);
console.log(`${comprobados} recursos enlazados, ninguno roto`);
console.log(`capa de datos fuera de ${DESTINO}/, como corresponde`);
