/**
 * El ensayo local de un lote, contra la base de desarrollo (iteracion 25).
 *
 *   node scripts/ensayo-local.mjs 3
 *   node scripts/ensayo-local.mjs --provocar-h029=10
 *
 * QUE HACE, Y POR QUE ES UN PASO Y NO UNA BUENA COSTUMBRE
 *
 * Carga el lote de un modulo en la base LOCAL y le corre encima el mismo
 * comprobador que despues se corre contra produccion. Es un ensayo general
 * gratis del comando caro: si el encargo tiene algo mal, se descubre aqui, donde
 * equivocarse cuesta volver a correr un guion, y no alli, donde cuesta una carga
 * a medias en la base que leen los estudiantes.
 *
 * En el modulo 2 esto se hizo, pero se hizo para PROBAR la herramienta, no como
 * paso del procedimiento. La diferencia importa: lo que no esta escrito como paso
 * se salta el dia que hay prisa, y el dia que hay prisa es justo cuando conviene
 * haberlo hecho.
 *
 * LA BASE LOCAL SE DEJA COMO ESTABA, Y SE RECONSTRUYE EN VEZ DE COPIARSE
 *
 * Al terminar, el banco de juguete vuelve a su sitio **reconstruido desde
 * `d1/ejemplo-banco.sql`**, que es un archivo versionado y repetible. No se
 * restaura copiando los `.sqlite`, `-shm` y `-wal` por encima.
 *
 * Esa distincion es el motivo de que este guion exista y no sea solo un atajo:
 * restaurar copiando archivos es lo que se hizo a mano el 2026-09-09 y es la
 * hipotesis de H-029, el fallo intermitente del comprobador de restricciones.
 * Reconstruir desde SQL no puede dejar la base en un estado que el proceso
 * siguiente no espere, porque no toca el motor por debajo: le habla.
 *
 * NO HABLA CON LA NUBE. NUNCA. Es local por definicion y rechaza el destino
 * remoto sin mirar nada mas (ADR-027).
 *
 * EL MODO QUE PROVOCA H-029
 *
 * `--provocar-h029=<n>` corre el experimento que H-029 pedia y que hasta hoy
 * nadie habia corrido: restaura la base de las dos maneras, n veces cada una, y
 * corre `probar:restricciones` despues de cada restauracion contando los fallos.
 *
 *   copiando archivos   la forma sospechosa, la que se uso el 2026-09-09
 *   desde SQL           la forma de este guion
 *
 * Los dos resultados sirven y por eso vale la pena correrlo:
 *
 *   falla copiando y no desde SQL  -> la hipotesis era buena, y el arreglo ya esta
 *   no falla de ninguna forma      -> la hipotesis era mala, y hay que buscar otra
 *   falla de las dos formas        -> el problema no es la restauracion
 *
 * Lo que no sirve es dejarlo en amarillo otras cinco veces.
 *
 * Codigos de salida:
 *   0  ENSAYO CORRECTO      el lote entra en local y el comprobador lo bendice
 *   1  ENSAYO FALLIDO       hay algo que arreglar ANTES de tocar produccion
 *   2  SIN VEREDICTO        no se pudo ensayar. NO es un aprobado
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { abrirRegistro } from './registro-de-salida.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const ESTADO_D1 = join(RAIZ, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
const EJEMPLO = join(RAIZ, 'd1', 'ejemplo-banco.sql');

const BASE = 'examen-td-js-produccion';

const CORRECTO = 0;
const FALLIDO = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);
const argumentos = process.argv.slice(2);

let cerrarRegistro = () => {};

function veredicto(titulo, lineas, codigo) {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  cerrarRegistro(titulo, codigo);
  process.exit(codigo);
}

const sinVeredicto = (motivo, detalle = []) =>
  veredicto(
    'SIN VEREDICTO  ***  ESTO NO ES UN APROBADO  ***',
    [motivo, ...(detalle.length ? ['', ...detalle] : []), '', 'No se pudo ensayar, que no es lo mismo que que este bien.'],
    SIN_VEREDICTO
  );

cerrarRegistro = abrirRegistro(argumentos, (mensaje) => sinVeredicto(mensaje));

/** Local por definicion. No hay bandera que lo lleve a la nube (ADR-027). */
if (argumentos.some((a) => a.includes('remote'))) {
  sinVeredicto('Este guion es local por definicion y no habla con la nube.', [
    'El ensayo existe justamente para NO tocar produccion. Si lo que quieres es',
    'la corrida de verdad, esa es otra y la corre el autor:',
    '',
    '  node scripts/comprobar-carga.mjs <modulo> --base=... (con el permiso de ADR-015)',
  ]);
}

// ---------------------------------------------------------------------------
// Hablar con la base local
// ---------------------------------------------------------------------------

function correr(comando, parametros, silencioso = true) {
  const r = spawnSync(comando, parametros, {
    cwd: RAIZ,
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
  });
  const salida = `${r.stdout ?? ''}${r.stderr ?? ''}`.replace(/\[[0-9;]*m/g, '');
  if (!silencioso && salida.trim()) console.log(salida.trim());
  return { codigo: r.status, salida };
}

const sql = (consulta) =>
  correr(process.execPath, [WRANGLER, 'd1', 'execute', BASE, '--local', `--command=${consulta}`, '--json']);

const archivoSql = (ruta) =>
  correr(process.execPath, [WRANGLER, 'd1', 'execute', BASE, '--local', `--file=${ruta}`]);

const guion = (nombre, args, silencioso = true) =>
  correr(process.execPath, [join(RAIZ, 'scripts', nombre), ...args], silencioso);

/** Cuantas preguntas hay ahora mismo. Devuelve null si no se pudo saber. */
function cuantasPreguntas() {
  const r = sql('SELECT COUNT(*) AS n FROM pregunta;');
  try {
    return Number(JSON.parse(r.salida.trim())[0].results[0].n);
  } catch {
    return null;
  }
}

/**
 * Deja el banco de juguete en su sitio, RECONSTRUIDO y no copiado.
 *
 * Vacia las dos tablas y vuelve a aplicar `d1/ejemplo-banco.sql`, que es
 * repetible por diseno: ids explicitos y `INSERT OR IGNORE`.
 */
function restaurarDesdeSql() {
  const vaciado = sql('DELETE FROM alternativa; DELETE FROM pregunta;');
  if (vaciado.codigo !== 0 && cuantasPreguntas() === null) return false;
  const puesto = archivoSql(EJEMPLO);
  return puesto.codigo === 0 || cuantasPreguntas() !== null;
}

// ---------------------------------------------------------------------------
// El experimento de H-029
// ---------------------------------------------------------------------------

const conProvocar = argumentos.find((a) => a.startsWith('--provocar-h029='));

if (conProvocar) {
  const vueltas = Number(conProvocar.slice('--provocar-h029='.length)) || 5;

  if (!existsSync(ESTADO_D1)) {
    sinVeredicto(`No encuentro el estado de la base local en ${ESTADO_D1.replace(RAIZ, '.')}.`);
  }

  console.log(`\nProvocando H-029 · ${vueltas} vueltas por cada forma de restaurar.\n`);
  console.log('Hipotesis a poner a prueba: el fallo intermitente del comprobador de');
  console.log('restricciones sale de restaurar la base copiando .sqlite/-shm/-wal.\n');

  // Copia de seguridad de todo el directorio, para dejarlo como estaba al final.
  const guardado = mkdtempSync(join(tmpdir(), 'ensayo-h029-'));
  for (const f of readdirSync(ESTADO_D1)) copyFileSync(join(ESTADO_D1, f), join(guardado, f));

  const restaurarCopiando = () => {
    for (const f of readdirSync(guardado)) copyFileSync(join(guardado, f), join(ESTADO_D1, f));
    return true;
  };

  const resultados = {};

  for (const [forma, restaurar] of [
    ['copiando archivos', restaurarCopiando],
    ['desde SQL', restaurarDesdeSql],
  ]) {
    let fallos = 0;
    const detalles = [];

    for (let i = 1; i <= vueltas; i += 1) {
      restaurar();
      const r = guion('probar-restricciones.mjs', []);
      const cayo = r.codigo !== 0 || /RESTRICCION CAIDA/.test(r.salida);
      if (cayo) {
        fallos += 1;
        const cual = r.salida.match(/^\s+- (.+)$/m)?.[1] ?? '(no dijo cual)';
        detalles.push(`vuelta ${i}: ${cual}`);
      }
      process.stdout.write(cayo ? 'X' : '.');
    }

    process.stdout.write('\n');
    resultados[forma] = { fallos, detalles };
  }

  // Se deja como estaba, y por la via buena.
  restaurarDesdeSql();

  try {
    rmSync(guardado, { recursive: true, force: true });
  } catch {
    // Un temporal que no se borra no cambia el resultado.
  }

  const copiando = resultados['copiando archivos'];
  const desdeSql = resultados['desde SQL'];

  const conclusion = (() => {
    if (copiando.fallos > 0 && desdeSql.fallos === 0) {
      return [
        'LA HIPOTESIS SE SOSTIENE. Restaurar copiando archivos produce el fallo y',
        'reconstruir desde SQL no. H-029 puede pasar a resuelto, y el arreglo es',
        'usar este guion en vez de copiar archivos a mano.',
      ];
    }
    if (copiando.fallos === 0 && desdeSql.fallos === 0) {
      return [
        'NO SE REPRODUJO DE NINGUNA DE LAS DOS FORMAS.',
        '',
        'La hipotesis NO queda confirmada, y tampoco descartada: no reproducir algo',
        `${vueltas} veces no prueba que no ocurra. H-029 sigue en amarillo, y ahora`,
        'con un intento de provocacion anotado, que es mas de lo que tenia.',
        '',
        'Si vuelve a aparecer, lo que hay que mirar es otra cosa.',
      ];
    }
    if (copiando.fallos > 0 && desdeSql.fallos > 0) {
      return [
        'FALLA DE LAS DOS FORMAS. El problema NO es como se restaura la base.',
        'La hipotesis de H-029 era mala y hay que buscar en otro sitio: lo mas',
        'probable es algo dentro del propio comprobador de restricciones.',
      ];
    }
    return [
      'FALLA RECONSTRUYENDO DESDE SQL Y NO COPIANDO, que es lo contrario de lo',
      'esperado. Eso no lo explica ninguna hipotesis escrita hasta ahora, y es el',
      'resultado mas interesante de los cuatro. Anotalo tal cual.',
    ];
  })();

  veredicto(
    'EXPERIMENTO DE H-029 TERMINADO',
    [
      `Vueltas por forma: ${vueltas}`,
      '',
      `  copiando .sqlite/-shm/-wal   ${copiando.fallos} fallo(s) de ${vueltas}`,
      ...copiando.detalles.map((d) => `      ${d}`),
      `  reconstruyendo desde SQL     ${desdeSql.fallos} fallo(s) de ${vueltas}`,
      ...desdeSql.detalles.map((d) => `      ${d}`),
      '',
      raya,
      ...conclusion,
      '',
      'La base local quedo reconstruida desde d1/ejemplo-banco.sql.',
    ],
    CORRECTO
  );
}

// ---------------------------------------------------------------------------
// El ensayo de un lote
// ---------------------------------------------------------------------------

const modulo = Number(argumentos.find((a) => /^\d+$/.test(a)));

if (!Number.isInteger(modulo) || modulo < 2 || modulo > 8) {
  sinVeredicto('Falta el numero de modulo, o no esta entre 2 y 8.', [
    'Uso:',
    '',
    '  node scripts/ensayo-local.mjs <modulo>',
    '  node scripts/ensayo-local.mjs --provocar-h029=<vueltas>',
  ]);
}

const encargo = join(RAIZ, 'd1', 'encargos', `modulo-0${modulo}-para-cargar.json`);

if (!existsSync(encargo)) {
  sinVeredicto(`No existe ${encargo.replace(RAIZ, '.')}.`, [
    'Se produce con:',
    '',
    `  node scripts/aplicar-justificaciones.mjs ${modulo}`,
  ]);
}

const cuantasEnElEncargo = (() => {
  try {
    return JSON.parse(readFileSync(encargo, 'utf8')).preguntas.length;
  } catch (error) {
    sinVeredicto(`El encargo no se puede leer: ${error.message}`);
  }
})();

console.log(`\nEnsayo local del modulo ${modulo} · ${cuantasEnElEncargo} preguntas\n`);

// --- 1. Dejar la base vacia, para que el lote sea lo unico que hay -----------

console.log('1 de 4 · vaciando el banco local…');
sql('DELETE FROM alternativa; DELETE FROM pregunta;');

const antes = cuantasPreguntas();

if (antes === null) {
  sinVeredicto('No pude consultar la base local.', [
    'Si dice «no such table», a la base local le falta el esquema:',
    '',
    '  npm run datos:migrar',
    '  npm run datos:migrar-002',
  ]);
}

if (antes !== 0) sinVeredicto(`La base local no quedo vacia: siguen ${antes} preguntas.`);

// --- 2. Cargar, con la herramienta de verdad --------------------------------

console.log('2 de 4 · cargando el lote con la herramienta de verdad…');
const carga = guion('administrar-banco.mjs', ['insertar', encargo]);

if (carga.codigo !== 0) {
  restaurarDesdeSql();
  veredicto(
    'ENSAYO FALLIDO  ***  el lote NO entra  ***',
    [
      'La carga fallo contra la base LOCAL, o sea que fallaria igual contra',
      'produccion. Mejor aqui.',
      '',
      ...carga.salida.trim().split('\n').slice(-25).map((l) => `  ${l}`),
      '',
      'La base local se dejo con el banco de juguete.',
    ],
    FALLIDO
  );
}

// --- 3. El mismo comprobador que se corre contra produccion -----------------

console.log('3 de 4 · comprobando la carga, con el comando de produccion…');
const comprobacion = guion('comprobar-carga.mjs', [String(modulo), `--base=${BASE}`]);

// --- 4. Devolver el banco de juguete, reconstruido --------------------------

console.log('4 de 4 · reconstruyendo el banco de juguete desde SQL…\n');
const restaurado = restaurarDesdeSql();

if (comprobacion.codigo !== 0) {
  veredicto(
    'ENSAYO FALLIDO  ***  arregla esto ANTES de tocar produccion  ***',
    [
      'El comprobador dijo que no sobre la base local. Contra produccion diria lo',
      'mismo, y alli el lote ya estaria dentro.',
      '',
      ...comprobacion.salida.trim().split('\n').slice(-40).map((l) => `  ${l}`),
      '',
      restaurado ? 'La base local quedo con el banco de juguete.' : 'OJO: no pude restaurar el banco de juguete.',
    ],
    FALLIDO
  );
}

veredicto(
  'ENSAYO CORRECTO  ***  el lote entra y el comprobador lo bendice  ***',
  [
    `Modulo:    ${modulo}`,
    `Encargo:   ${encargo.replace(RAIZ, '.')}`,
    `Preguntas: ${cuantasEnElEncargo}`,
    '',
    'Se cargo en la base LOCAL y se le corrio encima el mismo comprobador que se',
    'corre contra produccion, con el mismo comando salvo el destino.',
    '',
    restaurado
      ? 'La base local quedo con el banco de juguete, reconstruido desde SQL.'
      : 'OJO: no pude restaurar el banco de juguete. Mira la base antes de seguir.',
    '',
    raya,
    'LO QUE ESTO NO DICE: que la carga contra produccion vaya a salir bien. La',
    'base local no toma el camino de importacion de wrangler y la nube si (H-025).',
    'Lo que este ensayo descarta es que el problema este en el ENCARGO.',
    '',
    'Ahora si, el comando de produccion. Lo corre el autor (ADR-015).',
  ],
  CORRECTO
);
