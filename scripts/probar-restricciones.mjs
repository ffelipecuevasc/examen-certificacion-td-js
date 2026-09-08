/**
 * Guardian de las restricciones del esquema del banco.
 *
 * POR QUE EXISTE
 *
 * La iteracion 21 probo a mano las nueve restricciones contra la base de pruebas
 * en la nube: las nueve rechazaron su insercion, cada una con su mensaje. Esa
 * evidencia es real y el criterio quedo cumplido. Lo que NO quedo fue la forma de
 * repetirlo: las nueve se escribieron a mano y no sobrevivio ningun archivo, asi
 * que hoy habria que reescribirlas. Quedo anotado como deuda de reproducibilidad,
 * y esto la salda.
 *
 * No caben en un solo .sql, y ese es el motivo de que esto sea un guion: la
 * primera sentencia que falla aborta el archivo entero, asi que las nueve tienen
 * que lanzarse una por una. Que las nueve fallen es el aprobado; que una pase es
 * el fallo, porque significa que una restriccion del esquema se cayo.
 *
 * QUE HACE CON LA BASE
 *
 * Cinco de las nueve necesitan una pregunta a la que colgarle alternativas, y
 * ninguna del banco sirve: todas tienen sus cuatro letras usadas, asi que un
 * intento de meter una quinta chocaria contra la restriccion equivocada y la
 * prueba no probaria lo que dice probar. Por eso se crea una pregunta de
 * andamiaje con un id muy por encima de los reales, se usa, y se retira.
 *
 * La base tiene que quedar como estaba, y eso no se promete: se comprueba. Se le
 * saca un resumen criptografico al contenido de las dos tablas antes de empezar y
 * otro al terminar, y si no coinciden el veredicto es que no se pudo probar.
 *
 * SIEMPRE LOCAL
 *
 * Este guion ESCRIBE, aunque sea para que lo rechacen. No tiene modo remoto y no
 * lo va a tener: `--local` esta escrito fijo mas abajo (ADR-015).
 *
 * Codigos de salida:
 *   0  RESTRICCIONES EN PIE      las nueve rechazaron lo que tenian que rechazar
 *   1  RESTRICCION CAIDA         alguna dejo pasar lo que no debia
 *   2  NO SE PUDO PROBAR         no hay veredicto. NO es un aprobado
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const BASE = 'examen-td-js-produccion';

/** Id del andamiaje. Muy por encima de cualquier pregunta real, y se reconoce. */
const ANDAMIO = 9001;

const EN_PIE = 0;
const CAIDA = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);

const veredicto = (titulo, lineas, codigo) => {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
};

const sinVeredicto = (motivo, detalle = []) =>
  veredicto(
    'NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***',
    [motivo, ...(detalle.length ? ['', ...detalle] : []), '', 'Nadie comprobo las restricciones. No se sabe si estan o no.'],
    SIN_VEREDICTO
  );

if (!existsSync(WRANGLER)) {
  sinVeredicto('No encontre wrangler en node_modules. Corre `npm install`.');
}

const sinColores = (texto) => texto.replace(/\[[0-9;]*m/g, '');

/**
 * Corre una sentencia contra la base LOCAL. `--local` va escrito aqui, fijo.
 *
 * Devuelve lo que dijo por sus dos salidas, no como termino: el codigo de salida
 * de wrangler no es testigo fiable en Windows (H-016).
 */
function wrangler(parametros) {
  const resultado = spawnSync(process.execPath, [WRANGLER, 'd1', 'execute', BASE, '--local', ...parametros], {
    cwd: RAIZ,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

  if (resultado.error) sinVeredicto(`No pude lanzar wrangler: ${resultado.error.message}`);

  return sinColores(`${resultado.stdout ?? ''}${resultado.stderr ?? ''}`);
}

const ejecutar = (sql) => wrangler([`--command=${sql}`]);

/**
 * Si la base local no tiene el esquema, esto no es un fallo de las restricciones:
 * es que no se pudo probar. La distincion es la de H-013 y la misma que aplica el
 * guardian del escapado, y aqui vale igual: gritar «restriccion caida» porque
 * falta correr las migraciones ensena a ignorar el veredicto.
 */
function sinEsquema(salida) {
  if (!/no such table/i.test(salida)) return;

  sinVeredicto('La base local no tiene el esquema del banco.', [
    'Aplica las migraciones y vuelve a correrlo:',
    '',
    '  npm run datos:migrar',
    '  npm run datos:migrar-002',
    '  npm run datos:ejemplo',
    '',
    'No se probo ninguna restriccion. Esto NO significa que esten bien ni que',
    'esten mal: significa que nadie las probo.',
  ]);
}

function consultar(sql) {
  const salida = wrangler([`--command=${sql}`, '--json']);
  const corte = salida.indexOf('[');
  sinEsquema(salida);
  if (corte === -1) sinVeredicto('No pude leer la base: wrangler no devolvio JSON.', [salida.trim()]);
  try {
    return JSON.parse(salida.slice(corte))[0].results;
  } catch (error) {
    sinVeredicto(`No pude interpretar lo que devolvio la base: ${error.message}`, [salida.trim()]);
  }
}

/** Resumen del contenido de las dos tablas, para comparar antes y despues. */
function huella() {
  const filas = consultar(
    "SELECT 'P|'||id||'|'||enunciado AS f FROM pregunta " +
      "UNION ALL SELECT 'A|'||id||'|'||pregunta_id||'|'||letra||'|'||orden||'|'||es_correcta FROM alternativa ORDER BY f;"
  ).map((x) => x.f);

  return { filas: filas.length, hash: createHash('sha256').update(filas.join('\n')).digest('hex').slice(0, 16) };
}

/** Una sentencia se considera rechazada si la base dijo que fallo. */
const rechazada = (salida) => /\[ERROR\]|SQLITE_/i.test(salida);

/** El pedazo del mensaje que identifica a la restriccion que tenia que saltar. */
const motivo = (salida) => sinColores(salida).match(/(UNIQUE constraint failed: [\w.,\s]+|CHECK constraint failed: [\w]+|FOREIGN KEY constraint failed)/i)?.[0] ?? '(sin mensaje reconocible)';

// ---------------------------------------------------------------------------
// Las nueve. Cada una es UNA sentencia que la base tiene que rechazar.
//
// El orden es el de la iteracion 21, para que se puedan cotejar con la evidencia
// de entonces sin tener que emparejarlas de memoria.
// ---------------------------------------------------------------------------

const PRUEBAS = [
  {
    nombre: 'CHECK de letra',
    espera: 'CHECK constraint failed',
    sql: `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (${ANDAMIO}, 'z', 2, 'letra que no existe', 0);`,
  },
  {
    nombre: 'UNIQUE de letra por pregunta',
    espera: 'UNIQUE constraint failed',
    sql: `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (${ANDAMIO}, 'a', 2, 'la letra a otra vez', 0);`,
  },
  {
    nombre: 'UNIQUE de orden por pregunta',
    espera: 'UNIQUE constraint failed',
    sql: `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (${ANDAMIO}, 'b', 1, 'el orden 1 otra vez', 0);`,
  },
  {
    nombre: 'Indice parcial: una sola correcta por pregunta',
    espera: 'UNIQUE constraint failed',
    sql: `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (${ANDAMIO}, 'c', 3, 'una segunda correcta', 1);`,
  },
  {
    nombre: 'Llave foranea del modulo',
    espera: 'FOREIGN KEY constraint failed',
    sql: `INSERT INTO pregunta (id, modulo, origen, numero_origen, enunciado, estado) VALUES (${ANDAMIO + 1}, 99, 'json_2026', 9902, 'modulo que no existe en la tabla modulo', 'borrador');`,
  },
  {
    nombre: 'CHECK de estado y motivo de retiro',
    espera: 'CHECK constraint failed',
    sql: `INSERT INTO pregunta (id, modulo, origen, numero_origen, enunciado, estado) VALUES (${ANDAMIO + 2}, 3, 'json_2026', 9903, 'retirada sin decir por que', 'retirada');`,
  },
  {
    nombre: 'UNIQUE de enunciado',
    espera: 'UNIQUE constraint failed',
    sql: `INSERT INTO pregunta (id, modulo, origen, numero_origen, enunciado, estado) SELECT ${ANDAMIO + 3}, 3, 'json_2026', 9904, enunciado, 'borrador' FROM pregunta WHERE id = ${ANDAMIO};`,
  },
  {
    nombre: 'UNIQUE de origen + modulo + numero de origen',
    espera: 'UNIQUE constraint failed',
    sql: `INSERT INTO pregunta (id, modulo, origen, numero_origen, enunciado, estado) VALUES (${ANDAMIO + 4}, 3, 'json_2026', 9901, 'terna repetida, enunciado distinto', 'borrador');`,
  },
  {
    nombre: 'CHECK de es_correcta',
    espera: 'CHECK constraint failed',
    sql: `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (${ANDAMIO}, 'd', 4, 'es_correcta fuera de 0 y 1', 5);`,
  },
];

// ---------------------------------------------------------------------------

console.log(`\n${raya}\nPROBANDO LAS RESTRICCIONES DEL ESQUEMA\n${raya}`);

const antes = huella();
console.log(`Base antes:  ${antes.filas} filas, huella ${antes.hash}`);

// Andamiaje: una pregunta con UNA sola alternativa, correcta y en la letra a.
const montaje = ejecutar(
  `INSERT INTO pregunta (id, modulo, origen, numero_origen, enunciado, justificacion, dificultad, orden_fijo, estado) ` +
    `VALUES (${ANDAMIO}, 3, 'json_2026', 9901, 'Andamiaje de scripts/probar-restricciones.mjs. Si esta fila quedo en la base, el guion no termino de limpiar.', NULL, NULL, 0, 'borrador'); ` +
    `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (${ANDAMIO}, 'a', 1, 'la unica correcta del andamiaje', 1);`
);

if (rechazada(montaje)) {
  sinEsquema(montaje);
  sinVeredicto('No pude montar el andamiaje.', [
    montaje.trim(),
    '',
    `Si la pregunta ${ANDAMIO} ya esta en la base, la dejo una corrida anterior que no limpio.`,
  ]);
}

const resultados = [];

for (const prueba of PRUEBAS) {
  const salida = ejecutar(prueba.sql);
  const paso = rechazada(salida);
  resultados.push({ ...prueba, paso, dijo: paso ? motivo(salida) : '(la base la ACEPTO)' });
}

// Desmontaje. Va antes del veredicto para que la base quede limpia incluso si el
// veredicto es malo: dejar andamiaje tirado por haber fallado seria acumular dos
// problemas donde habia uno.
ejecutar(`DELETE FROM alternativa WHERE pregunta_id = ${ANDAMIO}; DELETE FROM pregunta WHERE id >= ${ANDAMIO};`);

const despues = huella();

console.log(`Base despues: ${despues.filas} filas, huella ${despues.hash}\n`);

for (const r of resultados) {
  console.log(`  ${r.paso ? 'RECHAZADA' : '  ACEPTADA'}  ${r.nombre}`);
  console.log(`             ${r.dijo}`);
}

const caidas = resultados.filter((r) => !r.paso);
const limpia = antes.hash === despues.hash;

if (!limpia) {
  sinVeredicto('La base NO quedo como estaba: el andamiaje no se retiro del todo.', [
    `Antes:   ${antes.filas} filas, huella ${antes.hash}`,
    `Despues: ${despues.filas} filas, huella ${despues.hash}`,
    '',
    `Revisa a mano si quedaron filas con id >= ${ANDAMIO}.`,
  ]);
}

if (caidas.length > 0) {
  veredicto(
    `RESTRICCION CAIDA  ***  ${caidas.length} de ${PRUEBAS.length} dejaron pasar lo que no debian  ***`,
    [
      'El esquema deberia haber rechazado esto y no lo hizo:',
      '',
      ...caidas.map((c) => `  - ${c.nombre}`),
      '',
      'Una restriccion que no rechaza no es una restriccion. Mira d1/migraciones/',
      'y compara con 90-manual/esquema-del-banco.md.',
      '',
      'La base quedo limpia: el andamiaje se retiro.',
    ],
    CAIDA
  );
}

veredicto(
  'RESTRICCIONES EN PIE',
  [
    `Las ${PRUEBAS.length} restricciones rechazaron su insercion, cada una con su mensaje.`,
    '',
    'La base quedo como se encontro, comprobado por huella y no prometido:',
    `  antes ${antes.hash}  ·  despues ${despues.hash}`,
    '',
    'Recuerda lo que esto NO prueba: se corrio contra la base LOCAL. La iteracion',
    '21 ya las probo contra la nube a mano; esto es lo que faltaba, que era poder',
    'repetirlas.',
  ],
  EN_PIE
);
