/**
 * Comprueba que la instantanea versionada corresponda al respaldo versionado.
 *
 *   node scripts/comprobar-instantanea.mjs
 *   node scripts/comprobar-instantanea.mjs --sabotaje=<cual>
 *
 * POR QUE EXISTE (deuda abierta el 2026-09-08, cerrada el 2026-09-10)
 *
 * `static/js/data/instantanea-banco.js` es lo unico que ve el estudiante el dia
 * que la capa de datos cae. Hasta hoy **nada comprobaba que correspondiera al
 * banco del que dice salir**: `npm run verificar` miraba la barrera, el CSS y el
 * escapado, y ninguna de las tres la tocaba.
 *
 * Esa deuda se anoto a raiz de un caso real: la instantanea versionada trajo una
 * pregunta que no era del banco y bloqueo la publicacion un dia. Se cazo a mano,
 * comparando dos numeros que nadie estaba obligado a mirar.
 *
 * CONTRA QUE SE COMPARA, Y POR QUE CONTRA ESO
 *
 * Contra `d1/respaldo-banco.sql`. Los dos archivos son **dos copias del mismo
 * estado producidas en el mismo acto** por `publicar-banco.mjs` (ADR-023), asi
 * que tienen que decir lo mismo. Si dejan de decirlo, alguien regenero uno sin el
 * otro, o edito uno a mano.
 *
 * Se eligio esta comparacion y no una contra D1 por un motivo que decide: esta
 * corre **en local, sin credenciales y sin red**, asi que puede vivir dentro de
 * `npm run verificar` y correr en cada comprobacion. Una que necesitara la nube
 * solo la podria correr el autor, y una comprobacion que hay que acordarse de
 * correr es la que no se corre (ADR-030).
 *
 * LO QUE ESTO NO DICE
 *
 * Que la instantanea corresponda a lo que hay HOY en produccion. Los dos archivos
 * pueden estar de acuerdo entre si y los dos haberse quedado atras. Para eso esta
 * `comprobar-carga.mjs`, que si consulta D1 y lo corre el autor. Aqui se comprueba
 * la coherencia del par versionado, que es lo que se puede comprobar solo.
 *
 * SE PRUEBA ROMPIENDOLO (H-023)
 *
 *   --sabotaje=falta       quita una pregunta de la instantanea
 *   --sabotaje=texto       cambia un caracter de un enunciado
 *   --sabotaje=correcta    mueve la marca de correcta a otra alternativa
 *   --sabotaje=sello       pone el sello en «local»
 *   --sabotaje=cuenta      deja el sello diciendo un numero que no es
 *
 * Codigos de salida:
 *   0  CORRESPONDEN
 *   1  NO CORRESPONDEN   hay algo que arreglar antes de publicar
 *   2  SIN VEREDICTO     no se pudo comprobar. NO es un aprobado
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RESPALDO = join(RAIZ, 'd1', 'respaldo-banco.sql');
const INSTANTANEA = join(RAIZ, 'static', 'js', 'data', 'instantanea-banco.js');

const CORRESPONDEN = 0;
const NO_CORRESPONDEN = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);

function veredicto(titulo, lineas, codigo) {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const l of lineas) console.log(l);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
}

const sinVeredicto = (motivo, detalle = []) =>
  veredicto(
    'SIN VEREDICTO  ***  ESTO NO ES UN APROBADO  ***',
    [motivo, ...(detalle.length ? ['', ...detalle] : []), '', 'No se pudo comparar, que no es lo mismo que que esten de acuerdo.'],
    SIN_VEREDICTO
  );

const argumentos = process.argv.slice(2);
const conSabotaje = argumentos.find((a) => a.startsWith('--sabotaje='));
const sabotaje = conSabotaje ? conSabotaje.slice('--sabotaje='.length) : null;
const SABOTAJES = ['falta', 'texto', 'correcta', 'sello', 'cuenta'];

if (sabotaje && !SABOTAJES.includes(sabotaje)) {
  sinVeredicto(`No conozco el sabotaje «${sabotaje}».`, [`Los que hay: ${SABOTAJES.join(', ')}`]);
}

// ---------------------------------------------------------------------------
// Leer el respaldo, que es SQL
// ---------------------------------------------------------------------------

if (!existsSync(RESPALDO)) sinVeredicto(`No existe ${RESPALDO.replace(RAIZ, '.')}.`);
if (!existsSync(INSTANTANEA)) sinVeredicto(`No existe ${INSTANTANEA.replace(RAIZ, '.')}.`);

/**
 * Parte la lista de valores de un INSERT respetando las comillas de SQL.
 *
 * No se usa una expresion regular con `split(',')`: los enunciados del banco
 * traen comas dentro, y partir por comas los cortaria por la mitad. Y en SQL una
 * comilla dentro de una cadena se escribe duplicada, asi que hay que llevar la
 * cuenta de si se esta dentro o fuera.
 */
function partirValores(linea) {
  const dentro = [];
  let actual = '';
  let enCadena = false;

  for (let i = 0; i < linea.length; i += 1) {
    const c = linea[i];

    if (enCadena) {
      if (c === "'" && linea[i + 1] === "'") { actual += "'"; i += 1; continue; }
      if (c === "'") { enCadena = false; continue; }
      actual += c;
      continue;
    }

    if (c === "'") { enCadena = true; continue; }
    if (c === ',') { dentro.push(actual.trim()); actual = ''; continue; }
    actual += c;
  }

  dentro.push(actual.trim());
  return dentro;
}

/** Las filas de un INSERT de una tabla, ya partidas en valores. */
function filasDe(sql, tabla) {
  const filas = [];
  const marca = `INSERT INTO "${tabla}" (`;

  for (const linea of sql.split('\n')) {
    if (!linea.startsWith(marca)) continue;
    const desde = linea.indexOf('VALUES(');
    if (desde === -1) continue;
    const cuerpo = linea.slice(desde + 'VALUES('.length, linea.lastIndexOf(')'));
    filas.push(partirValores(cuerpo));
  }

  return filas;
}

const sql = readFileSync(RESPALDO, 'utf8');

// El orden de las columnas se lee de la propia sentencia, no se supone: si una
// migracion futura agrega una columna, suponerlo desplazaria todo en silencio.
const cabecera = (tabla) => {
  const linea = sql.split('\n').find((l) => l.startsWith(`INSERT INTO "${tabla}" (`));
  if (!linea) return null;
  const crudo = linea.slice(linea.indexOf('(') + 1, linea.indexOf(') VALUES'));
  return crudo.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
};

const colPregunta = cabecera('pregunta');
const colAlternativa = cabecera('alternativa');

if (!colPregunta || !colAlternativa) {
  sinVeredicto('El respaldo no trae INSERT de «pregunta» y «alternativa».', [
    'O no es un respaldo del banco, o su formato cambio. Ver H-030.',
  ]);
}

const idx = (cols, nombre) => {
  const i = cols.indexOf(nombre);
  if (i === -1) sinVeredicto(`El respaldo no trae la columna «${nombre}».`);
  return i;
};

const pI = {
  id: idx(colPregunta, 'id'),
  enunciado: idx(colPregunta, 'enunciado'),
  estado: idx(colPregunta, 'estado'),
  modulo: idx(colPregunta, 'modulo'),
};
const aI = {
  pregunta_id: idx(colAlternativa, 'pregunta_id'),
  letra: idx(colAlternativa, 'letra'),
  orden: idx(colAlternativa, 'orden'),
  texto: idx(colAlternativa, 'texto'),
  es_correcta: idx(colAlternativa, 'es_correcta'),
};

const alternativasPorPregunta = new Map();
for (const f of filasDe(sql, 'alternativa')) {
  const id = Number(f[aI.pregunta_id]);
  if (!alternativasPorPregunta.has(id)) alternativasPorPregunta.set(id, []);
  alternativasPorPregunta.get(id).push({
    letra: f[aI.letra],
    orden: Number(f[aI.orden]),
    texto: f[aI.texto],
    es_correcta: Number(f[aI.es_correcta]) === 1,
  });
}

// Solo las activas: es lo que la instantanea publica, porque sale de la vista
// `pregunta_activa`. Comparar contra todas acusaria en falso en cuanto una
// pregunta pase a borrador o a retirada, que es un estado legitimo.
const delRespaldo = new Map();
for (const f of filasDe(sql, 'pregunta')) {
  if (f[pI.estado] !== 'activa') continue;
  const id = Number(f[pI.id]);
  delRespaldo.set(id, {
    id,
    modulo: Number(f[pI.modulo]),
    enunciado: f[pI.enunciado],
    alternativas: (alternativasPorPregunta.get(id) ?? []).sort((x, y) => x.orden - y.orden),
  });
}

// ---------------------------------------------------------------------------
// Leer la instantanea
// ---------------------------------------------------------------------------

let SELLO;
let PREGUNTAS;

try {
  const modulo = await import(`${pathToFileURL(INSTANTANEA).href}?t=${Date.now()}`);
  SELLO = modulo.SELLO;
  PREGUNTAS = modulo.PREGUNTAS;
} catch (error) {
  sinVeredicto(`La instantanea no se puede importar: ${error.message}`);
}

if (!SELLO) sinVeredicto('La instantanea no trae SELLO.');
if (!Array.isArray(PREGUNTAS)) sinVeredicto('La instantanea no trae una lista PREGUNTAS.');

// --- El sabotaje, sobre la copia en memoria ---------------------------------

let queSeRompio = null;
let sello = { ...SELLO };
let preguntas = JSON.parse(JSON.stringify(PREGUNTAS));

if (sabotaje === 'falta') {
  const fuera = preguntas.pop();
  queSeRompio = `se quito de la instantanea la pregunta id ${fuera.id}`;
}
if (sabotaje === 'texto') {
  const p = preguntas[0];
  const antes = p.enunciado;
  p.enunciado = `${antes.slice(0, -1)}${antes.slice(-1) === '?' ? '.' : '?'}`;
  queSeRompio = `se cambio un caracter del enunciado de la pregunta id ${p.id}`;
}
if (sabotaje === 'correcta') {
  const p = preguntas[0];
  const donde = p.alternativas.findIndex((a) => a.es_correcta);
  p.alternativas[donde].es_correcta = false;
  p.alternativas[(donde + 1) % p.alternativas.length].es_correcta = true;
  queSeRompio = `se movio la correcta de la pregunta id ${p.id} una posicion`;
}
if (sabotaje === 'sello') {
  sello = { ...sello, entorno: 'local' };
  queSeRompio = 'el sello quedo diciendo «local»';
}
if (sabotaje === 'cuenta') {
  sello = { ...sello, preguntas: sello.preguntas + 1 };
  queSeRompio = `el sello dice ${sello.preguntas} preguntas y la lista trae ${preguntas.length}`;
}

// ---------------------------------------------------------------------------
// Comparar
// ---------------------------------------------------------------------------

const problemas = [];

if (sello.entorno !== 'nube') {
  problemas.push(
    `EL SELLO DICE «${sello.entorno}»: esta instantanea no salio de la nube, asi que es el ` +
      'banco de juguete y no se publica (ADR-023).'
  );
}

if (Number(sello.preguntas) !== preguntas.length) {
  problemas.push(
    `EL SELLO NO CUADRA CONSIGO MISMO: dice ${sello.preguntas} preguntas y la lista trae ` +
      `${preguntas.length}.`
  );
}

if (preguntas.length !== delRespaldo.size) {
  problemas.push(
    `CUENTAS DISTINTAS: la instantanea trae ${preguntas.length} preguntas activas y el respaldo ` +
      `${delRespaldo.size}.`
  );
}

const vistas = new Set();

for (const p of preguntas) {
  const enElRespaldo = delRespaldo.get(Number(p.id));
  vistas.add(Number(p.id));

  if (!enElRespaldo) {
    problemas.push(`SOBRA: la pregunta id ${p.id} esta en la instantanea y no entre las activas del respaldo.`);
    continue;
  }

  if (p.enunciado !== enElRespaldo.enunciado) {
    problemas.push(
      `ENUNCIADO DISTINTO en la id ${p.id}:\n      respaldo:    «${enElRespaldo.enunciado.slice(0, 70)}»` +
        `\n      instantanea: «${String(p.enunciado).slice(0, 70)}»`
    );
    continue;
  }

  const suyas = [...(p.alternativas ?? [])].sort((x, y) => (x.orden ?? 0) - (y.orden ?? 0));

  if (suyas.length !== enElRespaldo.alternativas.length) {
    problemas.push(
      `ALTERNATIVAS: la id ${p.id} trae ${suyas.length} en la instantanea y ` +
        `${enElRespaldo.alternativas.length} en el respaldo.`
    );
    continue;
  }

  for (const [i, a] of suyas.entries()) {
    const b = enElRespaldo.alternativas[i];
    if (a.texto !== b.texto) {
      problemas.push(
        `TEXTO DE ALTERNATIVA en la id ${p.id}, posicion ${i + 1}:\n      respaldo:    «${b.texto.slice(0, 60)}»` +
          `\n      instantanea: «${String(a.texto).slice(0, 60)}»`
      );
    }
    if (Boolean(a.es_correcta) !== b.es_correcta) {
      problemas.push(
        `LA CORRECTA NO ES LA MISMA en la id ${p.id}, posicion ${i + 1} (letra ${b.letra}): ` +
          `respaldo dice ${b.es_correcta ? 'si' : 'no'} y la instantanea ${a.es_correcta ? 'si' : 'no'}.`
      );
    }
  }
}

for (const [id] of delRespaldo) {
  if (vistas.has(id)) continue;
  problemas.push(`FALTA: la pregunta id ${id} esta activa en el respaldo y no en la instantanea.`);
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

const resumen = [
  `Respaldo:    d1/respaldo-banco.sql`,
  `Instantanea: static/js/data/instantanea-banco.js`,
  '',
  `  sello              entorno «${sello.entorno}» · generada ${sello.generada_en}`,
  `  activas en el respaldo   ${String(delRespaldo.size).padStart(3)}`,
  `  en la instantanea        ${String(preguntas.length).padStart(3)}`,
];

if (sabotaje) {
  const cazado = problemas.length > 0;
  veredicto(
    cazado
      ? 'SABOTAJE CAZADO  ***  el comprobador dijo «no»  ***'
      : 'SABOTAJE NO CAZADO  ***  EL COMPROBADOR NO SIRVE  ***',
    [
      `Sabotaje:      --sabotaje=${sabotaje}`,
      `Que se rompio: ${queSeRompio}`,
      '',
      ...(cazado
        ? [`Informo ${problemas.length} problema(s):`, '', ...problemas.map((p) => `  ${p}`)]
        : [
            'No se dio cuenta, y eso lo invalida entero: una comprobacion que no puede',
            'decir «no» no es una comprobacion (H-023).',
          ]),
    ],
    cazado ? CORRESPONDEN : NO_CORRESPONDEN
  );
}

if (problemas.length) {
  veredicto(
    'NO CORRESPONDEN  ***  la instantanea y el respaldo dicen cosas distintas  ***',
    [
      ...resumen,
      '',
      raya,
      `${problemas.length} problema(s):`,
      '',
      ...problemas.slice(0, 30).map((p) => `  ${p}`),
      ...(problemas.length > 30 ? ['', `  … y ${problemas.length - 30} mas.`] : []),
      '',
      'Los dos salen del mismo acto (ADR-023), asi que discrepar significa que alguien',
      'regenero uno sin el otro, o edito uno a mano. Vuelve a correr:',
      '',
      '  npm run datos:publicar -- --base=<la base> --remote',
    ],
    NO_CORRESPONDEN
  );
}

veredicto(
  'CORRESPONDEN  ***  la instantanea dice lo mismo que el respaldo  ***',
  [
    ...resumen,
    '',
    raya,
    'Comparado pregunta a pregunta, no por conteo:',
    '',
    '  el enunciado de cada una',
    '  sus alternativas, en su orden, texto a texto',
    '  cual esta marcada como correcta',
    '',
    'Lo que esto NO dice: que este par corresponda a lo que hay HOY en produccion.',
    'Los dos pueden estar de acuerdo y los dos haberse quedado atras. Eso lo dice',
    '`comprobar-carga.mjs`, que consulta D1 y lo corre el autor.',
  ],
  CORRESPONDEN
);
