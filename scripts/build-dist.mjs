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
 * La carpeta cuyos archivos son DATOS y no codigo.
 *
 * POR QUE ESTO ES UNA REGLA Y NO UNA EXCEPCION (H-031)
 *
 * `static/js/data/` guarda el banco de preguntas escrito como modulo ES. Lo que
 * hay dentro de esos archivos es **material citado**: enunciados, alternativas y
 * justificaciones sobre programacion. Que ese material contenga algo con forma de
 * ruta no lo convierte en una referencia, igual que un libro sobre cartografia no
 * lleva a ninguna parte.
 *
 * La version anterior de este archivo ya sabia la mitad: sabia que los ejemplos de
 * HTML guardados como texto —`avatar.jpg`— no son enlaces, y por eso en un `.js`
 * solo miraba los `import`. **Lo que no vio es que el banco tambien contiene
 * ejemplos de JavaScript.** El 2026-09-10 una justificacion del modulo 4 sobre
 * modulos ES —`import Modulo from './archivo.js'`— rompio la construccion, y el
 * despliegue del lote fallo.
 *
 * POR QUE NO SE ARREGLA AFINANDO EL PATRON
 *
 * Se penso exigir que el `import` estuviera al principio de linea, que es donde
 * esta un import de verdad. Arregla el caso de hoy y no el problema: quedan cuatro
 * modulos y unas 250 preguntas, muchas sobre codigo, y ahi van a aparecer
 * `require('./modulo')`, `fetch('/api/datos.json')`, rutas con `../`, extensiones
 * `.mjs` y `.json`, y `await import('./x.js')` — que es una expresion y puede ir
 * a mitad de linea con todo derecho. Cada uno pediria su parche, y una lista de
 * excepciones se rompe en el modulo siguiente.
 *
 * Lo que no depende de la forma del texto es **donde vive**. Un archivo de datos
 * no enlaza a nada, cualquiera sea lo que cite. Esa es la regla.
 *
 * LO QUE SIGUE COMPROBANDOSE, PARA QUE NO SE LEA COMO UN AGUJERO
 *
 * Que el archivo de datos EXISTA se comprueba igual: el recorrido llega hasta el
 * desde quien lo importa —incluida la instantanea, que solo se carga con un
 * import dinamico— y falla si no esta. Lo unico que deja de hacerse es seguir
 * rastros hacia AFUERA de el, que es lo que nunca debio hacerse.
 *
 * Y para que la regla no pueda esconder un fallo de verdad, mas abajo se
 * comprueba que estos archivos no traigan imports reales. Si algun dia los
 * traen, dejaron de ser datos y esto hay que repensarlo.
 */
const DATOS = 'static/js/data/';

/**
 * La primera linea de un archivo de datos que parezca un import de verdad.
 *
 * Un import real es una SENTENCIA y empieza la linea; el material citado del banco
 * viaja dentro de cadenas JSON, siempre precedido en su linea por la clave que lo
 * contiene. Por eso el ancla a principio de linea distingue a uno del otro aqui,
 * aunque no sirviera para el caso general.
 *
 * Es una heuristica y se dice: no analiza el archivo, lo mira. Su unico trabajo es
 * avisar si esta carpeta deja de contener solo datos.
 */
function importDeVerdad(texto) {
  for (const [i, linea] of texto.split('\n').entries()) {
    if (/^\s*import\s*[('"{*a-zA-Z_$]/.test(linea)) return { numero: i + 1, linea: linea.trim() };
    if (/^\s*export\s+[^=]*\bfrom\b/.test(linea)) return { numero: i + 1, linea: linea.trim() };
  }
  return null;
}

/**
 * Enlaces locales de un archivo.
 *
 * En un .html cuentan los atributos src/href. En un modulo ES solo cuentan los
 * import. Los archivos de `static/js/data/` no pasan por aqui: ver DATOS.
 */
function referencias(ruta, texto) {
  const crudas = ruta.endsWith('.html')
    ? [...texto.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1])
    : [
        // Import normal: `import x from './y.js'` o `import './y.js'`.
        ...texto.matchAll(/import\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]/g),
        // Import dinamico: `await import('./y.js')`. Se sigue desde la iteracion
        // 22 por la instantanea de respaldo, que solo se carga asi. Es el camino
        // que corre unicamente el dia que la capa de datos cae, o sea el dia en
        // que una errata en la ruta no se puede arreglar: si no se comprueba
        // aqui, no se comprueba en ninguna parte.
        ...texto.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
      ].map((m) => m[1]);

  return crudas
    .map((r) => r.split('#')[0].split('?')[0])
    .filter((r) => r && !/^(https?:|mailto:|data:|#)/.test(r));
}

const porRevisar = [...PAGINAS];
const revisados = new Set();
const rotos = [];
const datosConCodigo = [];
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

  const texto = readFileSync(enDestino, 'utf8');

  // Un archivo de datos no enlaza a nada: su contenido es material citado. Se
  // comprueba que siga siendo datos, y no se le siguen rastros hacia afuera.
  if (ruta.startsWith(DATOS)) {
    const real = importDeVerdad(texto);
    if (real) datosConCodigo.push({ ruta, ...real });
    continue;
  }

  for (const ref of referencias(ruta, texto)) {
    porRevisar.push(resolver(ruta, ref));
  }
}

if (datosConCodigo.length) {
  console.error(`ERROR: ${DATOS} tiene ${datosConCodigo.length} archivo(s) con imports de verdad:`);
  for (const d of datosConCodigo) console.error(`  - ${d.ruta}:${d.numero}  ${d.linea.slice(0, 70)}`);
  console.error('');
  console.error('Esa carpeta se trata como DATOS: no se le siguen referencias, porque lo que');
  console.error('contiene es material citado del banco de preguntas. Si ahora trae codigo que');
  console.error('enlaza de verdad, esa regla dejo de valer y hay que repensarla — no basta con');
  console.error('borrar esta comprobacion, que es lo unico que impide que la regla esconda un');
  console.error('enlace roto. Ver H-031.');
  process.exit(1);
}

if (rotos.length) {
  console.error(`ERROR: ${rotos.length} referencia(s) sin destino dentro de ${DESTINO}/:`);
  for (const r of rotos) console.error(`  - ${r}`);
  console.error('La construccion se detiene: publicar asi dejaria recursos rotos en el sitio.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Aviso: de donde salio la instantanea que se va a publicar
//
// La instantanea es lo que ve el estudiante cuando la capa de datos cae. Generada
// desde D1 local trae el banco de juguete, y publicarla asi es el fallo silencioso
// que describe ADR-023: todo verde, archivo generado, y el error visible solo el
// dia de la caida.
//
// No detiene la construccion a proposito: en desarrollo la instantanea local es la
// normal, y fallar aqui dejaria el proyecto sin poder construirse. Lo que hace es
// no dejar que pase inadvertido.
// ---------------------------------------------------------------------------

const INSTANTANEA = join(DESTINO, 'static', 'js', 'data', 'instantanea-banco.js');

if (existsSync(INSTANTANEA)) {
  const sello = readFileSync(INSTANTANEA, 'utf8').match(/"entorno":\s*"([^"]+)"/);

  if (!sello) {
    console.warn('AVISO: la instantanea no dice contra que base se genero (ADR-023).');
  } else if (sello[1] !== 'nube') {
    console.warn('');
    console.warn('  AVISO  la instantanea del banco se genero desde la base LOCAL.');
    console.warn('         Publicada asi, el respaldo del sitio es el banco de juguete.');
    console.warn('         Regenerala contra la nube antes de publicar: el comando esta');
    console.warn('         en la cabecera de scripts/generar-instantanea.mjs. Ver ADR-023.');
    console.warn('');
  }
}

console.log(`${copiados} entradas copiadas a ${DESTINO}/`);
console.log(`${comprobados} recursos enlazados, ninguno roto`);
console.log(`capa de datos fuera de ${DESTINO}/, como corresponde`);
