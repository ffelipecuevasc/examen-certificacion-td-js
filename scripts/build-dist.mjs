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
