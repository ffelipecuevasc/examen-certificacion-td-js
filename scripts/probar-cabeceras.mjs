/**
 * Comprueba las cabeceras de seguridad que sirve el sitio (iteracion 51).
 *
 * Por que existe este script:
 * `_headers` es un archivo que se puede escribir perfecto y no llegar nunca al
 * sitio. Pasa por tres caminos, y los tres son silenciosos:
 *
 *   1. No esta en LISTA_COPIA, asi que no llega a dist/ y Pages no lo ve.
 *   2. Llega, pero Pages no lo aplica a las respuestas de las funciones: la
 *      documentacion lo dice textual. Las cabeceras de /api/ las pone
 *      functions/api/_middleware.js, y esta prueba mira las dos mitades.
 *   3. Llega y se aplica, pero dice otra cosa que la que se decidio.
 *
 * Y mira, ademas, la otra mitad de la seguridad de la capa de datos: que ningun
 * extremo acepte escribir (ADR-009) y que ningun error cuente como esta hecho
 * por dentro —SQL, trazas, rutas de archivo—.
 *
 * EL DETECTOR DE FUGAS SE PRUEBA A SI MISMO ANTES DE MIRAR NADA
 *
 * Un detector que no encuentra nada da el mismo verde que uno que no sabe
 * buscar. Por eso, antes de revisar una sola respuesta real, se le da un cuerpo
 * de error fabricado con SQL, un mensaje del motor, una traza y una ruta de
 * archivo, y tiene que encontrar las cuatro. Si no, la prueba falla diciendo que
 * el detector esta ciego, que es un fallo del detector y no del sitio.
 *
 * Tambien se provoca, sin red, la excepcion de D1 que el servidor local no deja
 * provocar: se envuelve con `soloLectura()` —la misma de produccion— un
 * manejador que revienta con SQL en el mensaje, y se revisa lo que sale.
 *
 * Codigos de salida:
 *   0  EN PIE              todo lo que se miro esta bien
 *   1  FALLO               algo de lo que se miro esta mal
 *   2  NO SE PUDO PROBAR   no hay servidor local, o no contesta (no es un exito)
 *
 * Uso: `npm run datos:dev` en otra terminal, y luego `npm run probar:cabeceras`.
 * Primero el build, despues el servidor: construir con el servidor arriba lo
 * tumba (CLAUDE.md).
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');
const DIRECCION = process.env.DIRECCION_LOCAL ?? 'http://127.0.0.1:8788';
const ESPERA = 8000;

/**
 * FUNCIONES_A_REVISAR=<carpeta> prueba la seccion 2 contra una copia de functions/api/.
 * Es como se demuestra que la seccion falla cuando la capa filtra, sin tocar la real.
 */
const FUNCIONES = process.env.FUNCIONES_A_REVISAR ?? join(RAIZ, 'functions', 'api');

const EN_PIE = 0;
const FALLO = 1;
const SIN_VEREDICTO = 2;

const LINEA = '='.repeat(72);

/**
 * Las cabeceras que `_headers` tiene que declarar para todo el sitio.
 *
 * Son las del conjunto aprobado en la PARADA 1 de la iteracion 51. La politica de
 * contenido puede ir en modo informe o en modo obligatorio —el despliegue va
 * primero en informe (decision 2)—, y por eso se mira aparte.
 *
 * Lo que NO esta aqui, a proposito: `X-Content-Type-Options` y `Referrer-Policy`
 * las agrega Pages por su cuenta, y `Strict-Transport-Security` sobra porque todo
 * `.dev` esta precargado en HSTS. Ver la seccion 1 de la PARADA 1.
 */
const OBLIGATORIAS_EN_HEADERS = ['x-frame-options', 'permissions-policy', 'cross-origin-opener-policy'];

const CSP = 'content-security-policy';
const CSP_INFORME = 'content-security-policy-report-only';

/** Paginas y archivos estaticos que se piden. Sin `.html`: Pages redirige con 308. */
const ESTATICOS = ['/', '/cuestionario', '/simulacro', '/static/css/style.css', '/static/js/main.js'];

/** Extremos de la capa de datos. El ultimo no existe: lo contesta el middleware. */
const EXTREMOS = ['/api/estado', '/api/preguntas?resumen=1', '/api/no-existe'];

/** Los que existen, que tienen que contestar 405 exacto a cualquier escritura. */
const EXTREMOS_REALES = ['/api/estado', '/api/preguntas'];
const METODOS_DE_ESCRITURA = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Lo que tiene que traer TODA respuesta de /api/, puesta por el middleware.
 *
 * Se escribe aqui y no se importa del middleware: si se importara, un valor
 * equivocado en el codigo pasaria la prueba por construccion.
 */
const API_NOSNIFF = 'nosniff';
const API_CSP_DIRECTIVAS = ["default-src 'none'", "frame-ancestors 'none'"];

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const problemas = [];
const notas = [];

function fallo(texto) {
  problemas.push(texto);
  console.log(`  FALLO  ${texto}`);
}

function bien(texto) {
  console.log(`  ok     ${texto}`);
}

function seccion(titulo) {
  console.log(`\n-- ${titulo}`);
}

function terminar(codigo) {
  process.exit(codigo);
}

/** Lee `_headers` y devuelve las cabeceras de la regla `/*`, con nombre en minuscula. */
function leerHeaders(ruta) {
  const reglas = new Map();
  let actual = null;

  for (const cruda of readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    if (!cruda.trim() || cruda.trim().startsWith('#')) continue;

    if (!/^\s/.test(cruda)) {
      actual = cruda.trim();
      reglas.set(actual, new Map());
      continue;
    }

    const separador = cruda.indexOf(':');
    if (!actual || separador === -1) continue;
    reglas.get(actual).set(cruda.slice(0, separador).trim().toLowerCase(), cruda.slice(separador + 1).trim());
  }

  return reglas.get('/*') ?? new Map();
}

const normalizar = (valor) => (valor ?? '').replace(/\s+/g, ' ').trim();

/**
 * Busca en un texto las cuatro clases de fuga. Devuelve los nombres encontrados.
 *
 * Mayusculas a proposito en el SQL: los mensajes del sitio estan en castellano y
 * «desde» o «seleccionar» no son fugas; `SELECT` y `FROM` escritos asi, si.
 */
function fugasEn(texto) {
  const clases = [
    ['SQL', /\b(SELECT|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE|DROP\s+TABLE|PRAGMA)\b/],
    ['mensaje del motor', /SQLITE_|D1_ERROR|\bsqlite\b/i],
    // Los dos saltos: el real y el `\n` literal con que viaja dentro de un JSON. Y
    // los marcos anonimos de V8, `at file:///...:238:11`, que no llevan parentesis.
    // Los dos casos se le escaparon a la primera version de este patron (2026-09-23).
    ['traza', /\bat\s+[\w.<>$]+\s+\(|(?:\\n|\n)\s+at\s/],
    ['ruta de archivo', /[\w.\\/-]+\.(m?js|ts|sql):\d+|functions[\\/]api[\\/]/],
  ];

  return clases.filter(([, patron]) => patron.test(texto)).map(([nombre]) => nombre);
}

/** El sobre de functions/api/_comun.js, y nada que se le parezca. */
function esNuestroSobre(cuerpo) {
  return (
    cuerpo?.ok === false &&
    typeof cuerpo?.error?.codigo === 'string' &&
    typeof cuerpo?.error?.usar_respaldo === 'boolean'
  );
}

async function pedir(ruta, opciones = {}) {
  return fetch(`${DIRECCION}${ruta}`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(ESPERA),
    ...opciones,
  });
}

/** Igual que en probar-escapado.mjs: distingue «no hay nadie» de «hay alguien mudo». */
async function hayAlguienEnElPuerto() {
  const { hostname, port } = new URL(DIRECCION);
  const { Socket } = await import('node:net');

  return new Promise((resolver) => {
    const socket = new Socket();
    const cerrar = (respuesta) => {
      socket.destroy();
      resolver(respuesta);
    };

    socket.setTimeout(2000);
    socket.once('connect', () => cerrar(true));
    socket.once('timeout', () => cerrar(false));
    socket.once('error', () => cerrar(false));
    socket.connect(Number(port), hostname);
  });
}

console.log(`${LINEA}\nCabeceras de seguridad, escritura y fugas (iteracion 51)\n${LINEA}`);

// ---------------------------------------------------------------------------
// 1 · El detector de fugas tiene que ver una fuga fabricada
// ---------------------------------------------------------------------------

seccion('1 · autoprueba del detector de fugas, con un cuerpo fabricado');

const FABRICADO = JSON.stringify({
  ok: false,
  error: {
    codigo: 'FALLO_CONSULTA',
    mensaje: 'D1_ERROR: no such column: modulo_x: SQLITE_ERROR',
    usar_respaldo: true,
    detalle:
      'SELECT id, enunciado FROM preguntas WHERE modulo = ?\n' +
      '    at consultarBanco (functions/api/preguntas.js:212:9)',
  },
});

const vistasEnElFabricado = fugasEn(FABRICADO);

if (vistasEnElFabricado.length === 4) {
  bien(`el detector encontro las cuatro fugas plantadas: ${vistasEnElFabricado.join(', ')}`);
} else {
  fallo(
    `DETECTOR CIEGO: en el cuerpo fabricado encontro ${vistasEnElFabricado.length} de 4 ` +
      `(${vistasEnElFabricado.join(', ') || 'ninguna'}). Sus verdes no significan nada hasta arreglarlo.`
  );
}

// La traza con la forma que de verdad tiene una de V8 serializada en JSON: marco
// anonimo, sin parentesis, y el salto como `\n` literal. La primera version del
// detector no la veia, y se descubrio justamente provocando una fuga de verdad.
const TRAZA_ANONIMA = JSON.stringify({ detalle: 'Error: algo\n    at file:///D:/sitio/functions/api/x.js:176:20' });

if (fugasEn(TRAZA_ANONIMA).includes('traza')) {
  bien('y reconoce una traza de V8 con marco anonimo, serializada en JSON');
} else {
  fallo('DETECTOR CIEGO: no reconoce una traza de V8 con marco anonimo serializada en JSON.');
}

// ---------------------------------------------------------------------------
// 2 · Una excepcion de D1 provocada, sin red
// ---------------------------------------------------------------------------

seccion('2 · una excepcion de D1 con SQL en el mensaje, pasada por soloLectura()');

{
  const { soloLectura } = await import(pathToFileURL(join(FUNCIONES, '_comun.js')).href);

  const revienta = soloLectura(async () => {
    throw new Error(
      'D1_ERROR: no such table: preguntas: SQLITE_ERROR (SELECT * FROM preguntas WHERE modulo = 2)'
    );
  });

  // soloLectura registra el error con console.error, que es lo correcto en
  // produccion y ruido aqui. Se silencia solo mientras dura la llamada.
  const errorOriginal = console.error;
  console.error = () => {};
  let respuesta;
  try {
    respuesta = await revienta({
      request: new Request('http://127.0.0.1/api/preguntas?modulo=2'),
      env: { BANCO: {} },
    });
  } finally {
    console.error = errorOriginal;
  }

  const texto = await respuesta.text();
  const cuerpo = JSON.parse(texto);
  const fugas = fugasEn(texto);

  if (respuesta.status === 503 && cuerpo?.error?.codigo === 'FALLO_CONSULTA') {
    bien('la excepcion salio como FALLO_CONSULTA, 503');
  } else {
    fallo(`la excepcion salio como ${respuesta.status} ${cuerpo?.error?.codigo ?? '(sin codigo)'}`);
  }

  if (fugas.length === 0) bien('el cuerpo no trae SQL, mensaje del motor, traza ni ruta');
  else fallo(`el cuerpo de FALLO_CONSULTA filtra: ${fugas.join(', ')}. Cuerpo: ${texto}`);
}

// ---------------------------------------------------------------------------
// 3 · Hay servidor
// ---------------------------------------------------------------------------

seccion(`3 · servidor local en ${DIRECCION}`);

try {
  await pedir('/');
  bien('contesta');
} catch (error) {
  const alguien = await hayAlguienEnElPuerto();

  console.log(`\n${LINEA}\nNO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***\n${LINEA}`);
  if (alguien) {
    console.log(`HAY alguien escuchando en ${DIRECCION}, pero no contesta.`);
    console.log('Levantar otro servidor no lo arregla: el puerto ya esta tomado.');
    console.log('Lo normal es un wrangler de una sesion anterior; matalo por su padre:');
    console.log('');
    console.log('  Get-NetTCPConnection -LocalPort 8788 | Select-Object OwningProcess');
    console.log(`  Get-CimInstance Win32_Process -Filter "Name='workerd.exe'" |`);
    console.log('    Select-Object ProcessId, ParentProcessId');
    console.log('  Stop-Process -Id <el ParentProcessId> -Force');
  } else {
    console.log(`No hay nadie escuchando en ${DIRECCION}.`);
    console.log('');
    console.log('  npm run datos:dev          (en otra terminal: construye y levanta)');
    console.log('  npm run probar:cabeceras');
  }
  console.log('');
  console.log(`Detalle: ${error.message}`);
  console.log('');
  console.log('Las secciones 1 y 2 no necesitan red y ya corrieron: ' +
    (problemas.length ? `${problemas.length} fallo(s) arriba.` : 'las dos en verde.'));
  console.log('Lo que falta —las cabeceras, la escritura y las fugas por red— nadie lo probo.');
  // Un fallo sin red sigue siendo un fallo: no se esconde detras del aviso.
  terminar(problemas.length ? FALLO : SIN_VEREDICTO);
}

// ---------------------------------------------------------------------------
// 4 · _headers llego a dist/
// ---------------------------------------------------------------------------

seccion('4 · _headers en el directorio publicado');

const HEADERS_FUENTE = join(RAIZ, '_headers');
const HEADERS_PUBLICADO = join(RAIZ, 'dist', '_headers');

let declaradas = new Map();

if (!existsSync(HEADERS_FUENTE)) {
  fallo('no existe _headers en la raiz del repositorio');
} else {
  declaradas = leerHeaders(HEADERS_FUENTE);
  bien(`_headers existe y declara ${declaradas.size} cabecera(s) para /*`);

  for (const nombre of OBLIGATORIAS_EN_HEADERS) {
    if (!declaradas.has(nombre)) fallo(`_headers no declara ${nombre}`);
  }

  const politicas = [CSP, CSP_INFORME].filter((n) => declaradas.has(n));
  if (politicas.length === 0) fallo('_headers no declara ninguna politica de contenido');
  if (politicas.length === 2) fallo('_headers declara la politica en los dos modos a la vez: elige uno');
}

if (!existsSync(HEADERS_PUBLICADO)) {
  fallo(
    'dist/_headers no existe: Pages no va a ver ninguna cabecera. ' +
      '¿Esta _headers en LISTA_COPIA de scripts/build-dist.mjs? ¿Se construyo despues de agregarlo?'
  );
} else if (existsSync(HEADERS_FUENTE) && readFileSync(HEADERS_PUBLICADO, 'utf8') !== readFileSync(HEADERS_FUENTE, 'utf8')) {
  fallo('dist/_headers no es igual a _headers: falta volver a construir');
} else {
  bien('dist/_headers existe y es igual a la fuente');
}

// ---------------------------------------------------------------------------
// 5 · Lo que _headers declara llega a las respuestas estaticas
// ---------------------------------------------------------------------------

seccion('5 · cabeceras en las respuestas estaticas');

for (const ruta of ESTATICOS) {
  const respuesta = await pedir(ruta);
  const faltan = [];
  const distintas = [];

  if (respuesta.status !== 200) {
    fallo(`${ruta} respondio ${respuesta.status}; se esperaba 200`);
    continue;
  }

  for (const [nombre, valor] of declaradas) {
    const recibido = respuesta.headers.get(nombre);
    if (recibido === null) faltan.push(nombre);
    else if (normalizar(recibido) !== normalizar(valor)) distintas.push(nombre);
  }

  if (declaradas.size === 0) faltan.push('(todas: no hay _headers que comparar)');

  for (const obligatoria of OBLIGATORIAS_EN_HEADERS) {
    if (!declaradas.has(obligatoria) && respuesta.headers.get(obligatoria) === null) faltan.push(obligatoria);
  }

  if (respuesta.headers.get(CSP) === null && respuesta.headers.get(CSP_INFORME) === null) {
    if (!faltan.some((f) => f.startsWith('content-security-policy'))) faltan.push('content-security-policy');
  }

  if (faltan.length || distintas.length) {
    fallo(
      `${ruta}: ` +
        [faltan.length ? `faltan ${faltan.join(', ')}` : '', distintas.length ? `distintas de _headers: ${distintas.join(', ')}` : '']
          .filter(Boolean)
          .join('; ')
    );
  } else {
    bien(`${ruta}: las ${declaradas.size} de _headers, iguales`);
  }
}

const modo = declaradas.has(CSP) ? 'OBLIGATORIO' : declaradas.has(CSP_INFORME) ? 'INFORME' : null;
if (modo === 'INFORME') {
  notas.push(
    'La politica de contenido esta en MODO INFORME: el navegador avisa de lo que bloquearia, pero no bloquea. ' +
      'Es el primer paso del despliegue (decision 2 de la PARADA 1), no el estado final.'
  );
}

// ---------------------------------------------------------------------------
// 6 · Las respuestas de /api/ traen sus propias cabeceras
// ---------------------------------------------------------------------------

seccion('6 · cabeceras en las respuestas de /api/ (las pone el middleware, no _headers)');

for (const ruta of EXTREMOS) {
  const respuesta = await pedir(ruta, { headers: { accept: 'application/json' } });
  const faltan = [];

  if (respuesta.headers.get('x-content-type-options') !== API_NOSNIFF) faltan.push('x-content-type-options: nosniff');

  const politica = normalizar(respuesta.headers.get(CSP));
  for (const directiva of API_CSP_DIRECTIVAS) {
    if (!politica.split(';').map((d) => d.trim()).includes(directiva)) faltan.push(`CSP con ${directiva}`);
  }

  if (faltan.length) fallo(`${ruta} (${respuesta.status}): falta ${faltan.join(', ')}`);
  else bien(`${ruta} (${respuesta.status}): nosniff y CSP ${API_CSP_DIRECTIVAS.join('; ')}`);
}

// ---------------------------------------------------------------------------
// 7 · Nadie escribe, y ningun error cuenta como esta hecho por dentro
// ---------------------------------------------------------------------------

seccion('7 · metodos de escritura contra cada extremo');

async function revisarError(etiqueta, respuesta, estadoEsperado) {
  const texto = await respuesta.text();
  let cuerpo = null;
  try {
    cuerpo = JSON.parse(texto);
  } catch {
    // Queda en null y cae en el control del sobre.
  }

  const detalles = [];
  if (estadoEsperado !== undefined && respuesta.status !== estadoEsperado) {
    detalles.push(`respondio ${respuesta.status}, se esperaba ${estadoEsperado}`);
  }
  if (respuesta.status < 400) detalles.push(`respondio ${respuesta.status}: ACEPTO la peticion`);
  if (!esNuestroSobre(cuerpo)) detalles.push('no es el sobre de error de la capa de datos');

  const fugas = fugasEn(texto);
  if (fugas.length) detalles.push(`filtra ${fugas.join(', ')}`);

  if (detalles.length) fallo(`${etiqueta}: ${detalles.join('; ')}`);
  else bien(`${etiqueta}: ${respuesta.status} ${cuerpo.error.codigo}, sin fugas`);
}

for (const ruta of [...EXTREMOS_REALES, '/api/no-existe']) {
  for (const metodo of METODOS_DE_ESCRITURA) {
    const respuesta = await pedir(ruta, {
      method: metodo,
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ id: 1, enunciado: 'escritura de prueba' }),
    });
    await revisarError(`${metodo.padEnd(6)} ${ruta}`, respuesta, EXTREMOS_REALES.includes(ruta) ? 405 : undefined);
  }
}

seccion('8 · errores de lectura provocados');

for (const ruta of ['/api/no-existe', '/api/preguntas?modulo=abc', '/api/preguntas?ids=1,x,3']) {
  const respuesta = await pedir(ruta, { headers: { accept: 'application/json' } });
  await revisarError(`GET    ${ruta}`, respuesta);
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

console.log(`\n${LINEA}`);
if (problemas.length) {
  console.log(`FALLO  ***  ${problemas.length}  ***`);
  console.log(LINEA);
  for (const p of problemas) console.log(`  - ${p}`);
} else {
  console.log(`EN PIE${modo ? `  (politica de contenido en modo ${modo})` : ''}`);
  console.log(LINEA);
}
for (const n of notas) console.log(`\nNota: ${n}`);
console.log('');
terminar(problemas.length ? FALLO : EN_PIE);
