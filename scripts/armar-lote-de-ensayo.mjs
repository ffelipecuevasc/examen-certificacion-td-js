/**
 * Arma el lote del ensayo de H-025: un encargo grande, valido entero, salvo la
 * ULTIMA pregunta, que choca contra una que ya esta en la base.
 *
 *   node scripts/armar-lote-de-ensayo.mjs --volcado=<archivo> --salida=<archivo>
 *
 * QUE ENSAYA ESE LOTE
 *
 * Si el camino de importacion de D1 es todo o nada. La atomicidad esta
 * comprobada contra la base local con 312 sentencias, pero la base local NUNCA
 * toma ese camino: es exclusivo de las escrituras contra la nube. Ver H-025.
 *
 * POR QUE LA MALA VA AL FINAL, Y NO ES UN DETALLE
 *
 * Un choque en las primeras sentencias no demuestra nada: no habia nada aplicado
 * que deshacer. La prueba es que reviente con el lote entero ya emitido delante.
 * Por eso la mala es la ultima y este guion no ofrece ponerla en otro sitio.
 *
 * LAS TRES GARANTIAS QUE PONE ESTE GUION, PARA QUE EL CHOQUE SEA UNO SOLO
 *
 *   1. Todos los enunciados salen con un prefijo de ensayo, asi que ninguno
 *      puede chocar por casualidad con lo que ya haya en la base.
 *   2. Todos los numero_origen se corren a partir de 901, asi que ninguna terna
 *      (origen, modulo, numero_origen) puede chocar tampoco. De paso, 901 es la
 *      marca que permite limpiar despues sin tocar nada mas.
 *   3. La ultima, y solo la ultima, se lleva un enunciado copiado del volcado,
 *      palabra por palabra.
 *
 * SI LA BASE ESTA VACIA, ESTE GUION SE NIEGA
 *
 * Sin una pregunta previa no hay contra que chocar, y el lote entraria entero:
 * el ensayo no ensayaria nada y la salida se veria bien. Que la siembra sea un
 * paso obligatorio del procedimiento y no un supuesto del lector es justo lo que
 * H-023 pide de una comprobacion.
 *
 * Codigos de salida:
 *   0  LOTE ARMADO
 *   1  NO SE ARMO       falta algo; no se escribio ningun archivo
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FUENTE_POR_OMISION = join('d1', 'encargos', 'modulo-02-para-cargar.json');

/** Desde donde se numeran las preguntas del ensayo. Es tambien su marca. */
const DESDE_NUMERO = 901;
const PREFIJO = '[ENSAYO H-025] ';

const raya = '='.repeat(72);

const veredicto = (titulo, lineas, codigo) => {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
};

const noSeArmo = (motivo, detalle = []) =>
  veredicto('NO SE ARMO', [motivo, ...(detalle.length ? ['', ...detalle] : []), '', 'No se escribio ningun archivo.'], 1);

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2);
const valorDe = (nombre) => {
  const encontrado = argumentos.find((a) => a.startsWith(`--${nombre}=`));
  return encontrado ? encontrado.slice(nombre.length + 3) : null;
};

const volcado = valorDe('volcado');
const salida = valorDe('salida');
const fuente = valorDe('fuente') ?? FUENTE_POR_OMISION;

if (!volcado || !salida) {
  noSeArmo('Faltan argumentos.', [
    'Uso:',
    '',
    '  node scripts/armar-lote-de-ensayo.mjs --volcado=<archivo> --salida=<archivo>',
    '',
    '--volcado  el volcado de ANTES, del que sale el enunciado con el que chocar.',
    '--salida   donde escribir el encargo.',
    `--fuente   de donde salen las preguntas validas (por omision ${FUENTE_POR_OMISION}).`,
  ]);
}

// ---------------------------------------------------------------------------
// El volcado de antes: de ahi sale el cebo y con el se comprueba el modulo
// ---------------------------------------------------------------------------

const rutaVolcado = resolve(process.cwd(), volcado);

if (!existsSync(rutaVolcado)) {
  noSeArmo(`No existe el volcado «${volcado}».`, ['Es el archivo del paso 2 del procedimiento.']);
}

const filas = readFileSync(rutaVolcado, 'utf8')
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => {
    const corte = l.indexOf('\t');
    return { tabla: l.slice(0, corte), fila: JSON.parse(l.slice(corte + 1)) };
  });

const preguntasEnLaBase = filas.filter((f) => f.tabla === 'pregunta').map((f) => f.fila);
const modulosEnLaBase = filas.filter((f) => f.tabla === 'modulo').map((f) => f.fila.numero);

if (preguntasEnLaBase.length === 0) {
  noSeArmo('Esa base no tiene ninguna pregunta, asi que no hay contra que chocar.', [
    'Sin una pregunta previa el lote entraria entero y el ensayo no ensayaria',
    'nada: la salida se veria bien y no habria demostrado la atomicidad.',
    '',
    'Siembra la base primero —es el paso 3 del procedimiento— y vuelve a hacer',
    'el volcado de antes.',
  ]);
}

/** El cebo: un enunciado que YA esta en la base, copiado palabra por palabra. */
const cebo = preguntasEnLaBase[0].enunciado;

if (typeof cebo !== 'string' || !cebo.trim()) {
  noSeArmo('La primera pregunta del volcado no trae un enunciado utilizable.');
}

// ---------------------------------------------------------------------------
// Las preguntas validas
// ---------------------------------------------------------------------------

const rutaFuente = resolve(RAIZ, fuente);

if (!existsSync(rutaFuente)) {
  noSeArmo(`No existe la fuente «${fuente}».`, ['Pasa otra con --fuente=<archivo>.']);
}

let encargo;

try {
  encargo = JSON.parse(readFileSync(rutaFuente, 'utf8'));
} catch (error) {
  noSeArmo(`«${fuente}» no es JSON valido: ${error.message}`);
}

if (!Array.isArray(encargo?.preguntas) || encargo.preguntas.length < 2) {
  noSeArmo(`«${fuente}» tiene que traer al menos dos preguntas en «preguntas».`);
}

const preguntas = encargo.preguntas.map((p, i) => ({
  ...p,
  numero_origen: DESDE_NUMERO + i,
  enunciado: `${PREFIJO}${p.enunciado}`,
}));

// La ultima, y solo la ultima.
preguntas[preguntas.length - 1].enunciado = cebo;

// El modulo tiene que existir en la base o el choque seria otro: una llave
// foranea en la PRIMERA sentencia, que es justo lo que este ensayo no prueba.
const modulosDelLote = [...new Set(preguntas.map((p) => p.modulo))];
const modulosQueFaltan = modulosDelLote.filter((m) => !modulosEnLaBase.includes(m));

if (modulosQueFaltan.length) {
  noSeArmo(`La base no tiene el modulo ${modulosQueFaltan.join(', ')}, y el lote lo usa.`, [
    'El lote reventaria por llave foranea en su PRIMERA sentencia, que es',
    'exactamente el choque que este ensayo no puede usar.',
    '',
    'Comprueba que la migracion 001 este aplicada en esa base: es la que llena',
    'la tabla modulo.',
  ]);
}

const rutaSalida = resolve(process.cwd(), salida);

try {
  writeFileSync(rutaSalida, `${JSON.stringify({ preguntas }, null, 1)}\n`, 'utf8');
} catch (error) {
  noSeArmo(`No pude escribir «${salida}»: ${error.message}`);
}

const sentencias = preguntas.reduce((n, p) => n + 1 + (p.alternativas?.length ?? 0), 0);
const sentenciaMala = sentencias - (preguntas.at(-1).alternativas?.length ?? 0);

veredicto(
  'LOTE ARMADO',
  [
    `Archivo:   ${salida}`,
    `Preguntas: ${preguntas.length}`,
    `Numeradas: ${DESDE_NUMERO} a ${DESDE_NUMERO + preguntas.length - 1}  ·  esa es la marca para limpiar despues`,
    '',
    `Sentencias que emitira: ${sentencias}`,
    `La que choca es la ${sentenciaMala}, o sea la pregunta ${preguntas.length} de ${preguntas.length}.`,
    '',
    'Con que choca: el enunciado de la ultima es una copia palabra por palabra de',
    'una que ya esta en la base, y el esquema prohibe repetir enunciado.',
    '',
    'El cebo, para que lo reconozcas en el mensaje de error:',
    `  ${cebo.length > 90 ? `${cebo.slice(0, 90)}…` : cebo}`,
    '',
    `Las otras ${preguntas.length - 1} llevan el prefijo «${PREFIJO.trim()}», asi que ninguna`,
    'puede chocar por casualidad. El choque tiene que ser uno solo y al final.',
  ],
  0
);
