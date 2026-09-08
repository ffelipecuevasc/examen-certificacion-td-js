/**
 * Administracion del banco de preguntas (ADR-025, iteracion 23).
 *
 * Es la herramienta con la que el autor edita el banco sin escribir SQL a mano y
 * sin publicar el repositorio. No hay panel y no hay extremo de escritura: la
 * capa de datos publicada sigue siendo de solo lectura (ADR-009).
 *
 *   node scripts/administrar-banco.mjs revisar     <archivo.json>
 *   node scripts/administrar-banco.mjs insertar    <archivo.json>
 *   node scripts/administrar-banco.mjs actualizar  <archivo.json>
 *
 * TODO O NADA, Y POR QUE NO HAY NINGUN «BEGIN» EN ESTE ARCHIVO
 *
 * Cada operacion se escribe a UN archivo .sql y se aplica de una sola vez. La
 * atomicidad la pone D1: `wrangler d1 execute --file` aplica el archivo como un
 * lote atomico, y si una sentencia falla no queda ninguna.
 *
 * Escribir `BEGIN` / `COMMIT` NO refuerza eso: lo rompe. D1 rechaza las
 * transacciones explicitas —«please use the state.storage.transaction() APIs
 * instead of the SQL BEGIN TRANSACTION»— y con ellas el lote entero no se aplica.
 * Comprobado el 2026-09-08 antes de escribir este archivo, y anotado en la
 * correccion de la regla 1 de ADR-025. Si alguna vez alguien «arregla» esto
 * agregando un BEGIN, rompe justo lo que creia asegurar.
 *
 * EL CODIGO DE SALIDA DE WRANGLER NO DECIDE NADA (H-016)
 *
 * En Windows wrangler se cae al terminar y devuelve codigos sin sentido, tambien
 * cuando el trabajo salio bien. Al leer eso da una lista vacia; al ESCRIBIR deja
 * al autor creyendo que su lote entro, y si a continuacion se regenera la
 * instantanea, se regenera desde una base que no cambio y el archivo versionado
 * confirma el error con toda la apariencia de una comprobacion.
 *
 * Por eso aca el veredicto sale de dos cosas, ninguna de las cuales es el codigo
 * de salida: lo que wrangler DIJO por sus dos salidas, y una segunda consulta a
 * la base preguntando si el cambio esta. Si las dos no coinciden, no hay
 * veredicto, que no es lo mismo que un fallo.
 *
 * LA VALIDACION ES LA DE LA LECTURA
 *
 * `validarParaEscritura()` vive en `functions/api/_validacion.js`, junto a la de
 * lectura y sobre las mismas primitivas. Aca no hay ni una regla de contenido
 * propia: si hubiera dos copias, el dia que una cambiara el banco tendria dos
 * definiciones de «pregunta valida».
 *
 * Codigos de salida:
 *   0  HECHO                 se aplico y la base lo confirma
 *   1  NO SE APLICO          algo estaba mal; la base quedo como estaba
 *   2  SIN VEREDICTO         no se pudo saber que paso. NO es un aprobado
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validarParaEscritura } from '../functions/api/_validacion.js';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const CONFIGURACION = join(RAIZ, 'wrangler.toml');
const GENERADOR = join(RAIZ, 'scripts', 'generar-instantanea.mjs');

const BASE_POR_OMISION = 'examen-td-js-produccion';

const HECHO = 0;
const NO_SE_APLICO = 1;
const SIN_VEREDICTO = 2;

const VERBOS = ['revisar', 'insertar', 'actualizar'];

const raya = '='.repeat(72);

const veredicto = (titulo, lineas, codigo) => {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
};

const noSeAplico = (motivo, detalle = []) =>
  veredicto(
    'NO SE APLICO',
    [motivo, ...(detalle.length ? ['', ...detalle] : []), '', 'La base quedo como estaba.'],
    NO_SE_APLICO
  );

const sinVeredicto = (motivo, detalle = []) =>
  veredicto(
    'SIN VEREDICTO  ***  ESTO NO ES UN APROBADO  ***',
    [
      motivo,
      ...(detalle.length ? ['', ...detalle] : []),
      '',
      'No se pudo saber si el cambio entro o no. Antes de repetir la operacion,',
      'mira la base: repetir a ciegas es como se cargan las cosas dos veces.',
    ],
    SIN_VEREDICTO
  );

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2);
const verbo = argumentos[0];
const archivo = argumentos.find((a, i) => i > 0 && !a.startsWith('--'));

if (!VERBOS.includes(verbo) || !archivo) {
  veredicto(
    'NO SE APLICO  ***  falta decir que hacer  ***',
    [
      'Uso:',
      '',
      '  node scripts/administrar-banco.mjs revisar     <archivo.json>',
      '  node scripts/administrar-banco.mjs insertar    <archivo.json>',
      '  node scripts/administrar-banco.mjs actualizar  <archivo.json>',
      '',
      'revisar    valida y no escribe nada. Muestra el SQL que emitiria.',
      'insertar   carga preguntas nuevas. Una colision aborta el lote entero.',
      'actualizar corrige preguntas que ya estan, y sella fecha_modificacion.',
      '',
      'Opciones:  --base=<nombre>   contra que base (por omision la local).',
    ],
    NO_SE_APLICO
  );
}

const conBase = argumentos.find((a) => a.startsWith('--base='));
const base = conBase ? conBase.slice('--base='.length) : BASE_POR_OMISION;

/**
 * El flag que apunta a la nube, escrito entero y a la vista. Un flag armado a
 * pedazos seria el «comando escondido dentro de un archivo» de H-014, y lo que
 * sostiene la barrera es poder leerlo de un vistazo.
 */
const FLAG_REMOTO = '--remote';
const remoto = argumentos.includes(FLAG_REMOTO);
const destino = remoto ? FLAG_REMOTO : '--local';

// ---------------------------------------------------------------------------
// Barrera de ADR-015. Es condicion de entrada, no un tramite del final.
//
// Escribir no es leer: una lectura contra la base equivocada devuelve datos que
// no sirven; una escritura contra la base equivocada la deja distinta. Por eso
// aca hay una vuelta mas que en el generador de la instantanea.
// ---------------------------------------------------------------------------

function basesDeclaradas() {
  let texto;
  try {
    texto = readFileSync(CONFIGURACION, 'utf8');
  } catch (error) {
    sinVeredicto(`No pude leer ${CONFIGURACION}: ${error.message}`);
  }
  return [...texto.matchAll(/^\s*database_name\s*=\s*"([^"]+)"/gm)].map((m) => m[1]);
}

const declaradas = basesDeclaradas();

if (process.env.PERMITIR_BASE_NO_DECLARADA !== '1' && !declaradas.includes(base)) {
  veredicto(
    'NO SE APLICO  ***  BASE NO DECLARADA  ***  H-015  ***',
    [
      `Pediste escribir en la base «${base}», que no esta declarada en wrangler.toml.`,
      '',
      `Declaradas: ${declaradas.join(', ') || '(ninguna)'}`,
      '',
      'En remoto wrangler no usa el archivo como limite: si el nombre no esta ahi,',
      'lo busca en la cuenta y lo encuentra igual. Este envoltorio le devuelve ese',
      'papel, porque una errata en el nombre no rebota contra ninguna otra cosa.',
      '',
      'Si sabes lo que haces: PERMITIR_BASE_NO_DECLARADA=1',
    ],
    NO_SE_APLICO
  );
}

if (remoto && process.env.PERMITIR_REMOTO !== '1') {
  veredicto(
    'NO SE APLICO  ***  ME NIEGO A CORRER ESTO  ***  ADR-015  ***',
    [
      `Pediste ${FLAG_REMOTO}, que ESCRIBE en la cuenta de Cloudflare.`,
      '',
      'Claude Code no ejecuta wrangler contra la cuenta: los comandos remotos los',
      'escribe, y los ejecuta el autor en su terminal. Ver ADR-015 y H-014.',
      '',
      'Si eres el autor y esto es tu terminal, define PERMITIR_REMOTO=1 antes de',
      'lanzarlo:',
      '',
      '  PowerShell:  $env:PERMITIR_REMOTO=1',
      '  Git Bash:    PERMITIR_REMOTO=1 npm run banco:insertar -- <archivo>',
      '',
      'No se escribio nada.',
    ],
    NO_SE_APLICO
  );
}

// Vuelta extra, solo para escribir en la nube: el nombre tiene que venir dicho a
// proposito. Con el valor por omision, un `--remote` suelto escribiria en
// produccion sin que nadie la haya nombrado.
if (remoto && !conBase) {
  veredicto(
    'NO SE APLICO  ***  NOMBRA LA BASE  ***',
    [
      'Para escribir en la nube hay que decir en cual, con --base=<nombre>.',
      '',
      `Sin eso se usaria «${BASE_POR_OMISION}», que es produccion, sin que nadie la`,
      'haya escrito. Leer con el valor por omision es comodo; escribir con el',
      'valor por omision es como se corrompe una base sin darse cuenta.',
    ],
    NO_SE_APLICO
  );
}

// ---------------------------------------------------------------------------
// Hablar con wrangler
//
// Siempre con el mismo node y con el wrangler de node_modules (H-013): `npx`
// puede traerse otro y no se sabria cual corrio. Sin `shell`, y los argumentos en
// un arreglo, para que no haya linea de comandos que armar ni que esconder.
// ---------------------------------------------------------------------------

if (!existsSync(WRANGLER)) {
  sinVeredicto('No encontre wrangler en node_modules. Corre `npm install`.');
}

/** Le quita a la salida los codigos de color, que estorban al buscar en ella. */
const sinColores = (texto) => texto.replace(/\[[0-9;]*m/g, '');

function wrangler(parametros) {
  const resultado = spawnSync(process.execPath, [WRANGLER, 'd1', 'execute', base, destino, ...parametros], {
    cwd: RAIZ,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

  if (resultado.error) {
    sinVeredicto(`No pude lanzar wrangler: ${resultado.error.message}`);
  }

  // Las dos salidas juntas, a proposito: wrangler reparte entre ellas segun el
  // caso y no conviene depender de cual eligio.
  return sinColores(`${resultado.stdout ?? ''}${resultado.stderr ?? ''}`);
}

/** Una consulta de lectura que devuelve filas ya interpretadas. */
function consultar(sql) {
  const salida = wrangler([`--command=${sql}`, '--json']);
  const corte = salida.indexOf('[');

  if (corte === -1) {
    sinVeredicto('No pude leer la base: wrangler no devolvio JSON.', crudo(salida));
  }

  try {
    return JSON.parse(salida.slice(corte))[0].results;
  } catch (error) {
    sinVeredicto(`No pude interpretar lo que devolvio la base: ${error.message}`, crudo(salida));
  }
}

const crudo = (salida) =>
  salida.trim() ? ['Lo que dijo wrangler:', ...salida.trim().split('\n').map((l) => `  ${l}`)] : ['(wrangler no dijo nada)'];

// ---------------------------------------------------------------------------
// Traduccion de los errores de la base
//
// El autor no tiene por que leer «UNIQUE constraint failed: alternativa.
// pregunta_id, alternativa.letra» para entender que puso dos veces la letra b.
// Es parte de la herramienta, no un adorno (ADR-025).
//
// El mensaje crudo NO se tira: se muestra debajo, porque el dia que aparezca uno
// que esta tabla no cubra, esconderlo dejaria al autor sin nada que buscar.
// ---------------------------------------------------------------------------

const TRADUCCIONES = [
  [/UNIQUE constraint failed: pregunta\.enunciado/i,
   'Ya hay una pregunta en el banco con ese mismo enunciado, palabra por palabra. El esquema lo prohibe a proposito: dos preguntas iguales son un error de carga, no contenido nuevo.'],
  [/UNIQUE constraint failed: pregunta\.origen, pregunta\.modulo, pregunta\.numero_origen/i,
   'Ese origen, modulo y numero ya estan cargados. Es la senal de que este lote ya se cargo antes, entero o en parte. Si lo que quieres es corregir la pregunta que ya esta, la operacion es «actualizar», no «insertar».'],
  [/UNIQUE constraint failed: alternativa\.pregunta_id, alternativa\.letra/i,
   'Una pregunta trae dos alternativas con la misma letra.'],
  [/UNIQUE constraint failed: alternativa\.pregunta_id, alternativa\.orden/i,
   'Una pregunta trae dos alternativas con el mismo orden.'],
  [/UNIQUE constraint failed: alternativa\.pregunta_id/i,
   'Una pregunta trae mas de una alternativa marcada como correcta. Solo puede haber una (ADR-019).'],
  [/FOREIGN KEY constraint failed/i,
   'El modulo al que apunta alguna pregunta no existe en la tabla modulo. Los modulos van del 2 al 8.'],
  [/CHECK constraint failed: letra/i, 'Alguna alternativa trae una letra que no es a, b, c ni d.'],
  [/CHECK constraint failed: orden/i, 'Alguna alternativa trae un orden fuera de 1 a 4.'],
  [/CHECK constraint failed: dificultad/i, 'Alguna pregunta trae una dificultad que no es baja, media ni alta.'],
  [/CHECK constraint failed: estado/i, 'Alguna pregunta trae un estado que no es borrador, activa ni retirada.'],
  [/CHECK constraint failed: es_correcta/i, 'es_correcta solo admite verdadero o falso.'],
  [/CHECK constraint failed: orden_fijo/i, 'orden_fijo solo admite verdadero o falso.'],
  [/CHECK constraint failed: origen/i, 'El origen solo admite json_2026 o js_2026.'],
  [/CHECK constraint failed: numero/i, 'El numero de modulo tiene que estar entre 2 y 8.'],
  [/CHECK constraint failed: pregunta/i,
   'Una pregunta retirada tiene que decir por que lo esta, y una que no lo esta no puede traer datos de retiro.'],
  [/NOT NULL constraint failed: ([\w.]+)/i, (m) => `Falta un dato obligatorio: ${m[1]}.`],
  [/no such table: (\w+)/i, (m) => `La tabla «${m[1]}» no existe en esta base. Falta aplicar las migraciones de d1/migraciones/.`],
  [/no such column: (\w+)/i, (m) => `La columna «${m[1]}» no existe en esta base. Puede que falte aplicar la migracion 002.`],
  [/BEGIN TRANSACTION|SAVEPOINT/i,
   'Alguien metio una transaccion explicita en el SQL. D1 no las admite y el lote entero se rechaza. La atomicidad ya la pone D1 sola.'],
];

function traducir(salida) {
  for (const [patron, texto] of TRADUCCIONES) {
    const encontrado = salida.match(patron);
    if (encontrado) return typeof texto === 'function' ? texto(encontrado) : texto;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Leer y normalizar el encargo
// ---------------------------------------------------------------------------

const rutaArchivo = resolve(process.cwd(), archivo);

if (!existsSync(rutaArchivo)) {
  noSeAplico(`No existe el archivo «${archivo}».`);
}

let encargo;

try {
  encargo = JSON.parse(readFileSync(rutaArchivo, 'utf8'));
} catch (error) {
  noSeAplico(`«${archivo}» no es JSON valido.`, [
    error.message,
    '',
    'Los dos errores de siempre: una coma de mas antes de un cierre, o una',
    'comilla sin cerrar. El mensaje de arriba dice en que posicion.',
  ]);
}

if (!Array.isArray(encargo?.preguntas) || encargo.preguntas.length === 0) {
  noSeAplico(`«${archivo}» no trae preguntas.`, [
    'Se espera un objeto con una lista llamada «preguntas»:',
    '',
    '  { "preguntas": [ { ... }, { ... } ] }',
  ]);
}

/**
 * Deja el JSON con la misma forma que tiene una pregunta al salir de la base.
 *
 * Importa mas de lo que parece: la validacion compartida compara `es_correcta`
 * contra 1, porque eso es lo que devuelve D1. Si la escritura le pasara `true`,
 * la misma regla diria cosas distintas en cada camino, que es exactamente lo que
 * tener un solo validador venia a evitar.
 */
const aBandera = (valor) => (valor === true || valor === 1 ? 1 : valor === false || valor === 0 ? 0 : valor);

const preguntas = encargo.preguntas.map((p) => ({
  ...p,
  orden_fijo: p.orden_fijo === undefined ? undefined : aBandera(p.orden_fijo),
  alternativas: Array.isArray(p.alternativas)
    ? p.alternativas.map((a) => ({ ...a, es_correcta: aBandera(a.es_correcta) }))
    : p.alternativas,
}));

// ---------------------------------------------------------------------------
// Validar antes de tocar nada
// ---------------------------------------------------------------------------

const { ok, problemas } = validarParaEscritura(preguntas);

if (!ok) {
  const lineas = [];
  for (const problema of problemas) {
    lineas.push(`Pregunta ${problema.posicion} del archivo (${problema.referencia}):`);
    for (const motivo of problema.motivos) lineas.push(`  - ${motivo}`);
    lineas.push('');
  }

  veredicto(
    `NO SE APLICO  ***  ${problemas.length} pregunta(s) con problemas  ***`,
    [
      'Nada de esto llego a la base: se revisa antes de escribir.',
      '',
      ...lineas,
      'Se listan todas juntas a proposito. La base las rechazaria de a una.',
    ],
    NO_SE_APLICO
  );
}

// ---------------------------------------------------------------------------
// Armar el SQL
// ---------------------------------------------------------------------------

/** Escapa para SQL. La comilla simple se duplica; es la unica que importa. */
const texto = (valor) => (ausenteValor(valor) ? 'NULL' : `'${String(valor).replace(/'/g, "''")}'`);
const numero = (valor) => (ausenteValor(valor) ? 'NULL' : String(Number(valor)));
const ausenteValor = (valor) => valor === undefined || valor === null;

/** La terna que identifica una pregunta sin depender del id. */
const terna = (p) => `origen = ${texto(p.origen)} AND modulo = ${numero(p.modulo)} AND numero_origen = ${numero(p.numero_origen)}`;

function sqlInsertar(lista) {
  const sentencias = [];

  for (const p of lista) {
    sentencias.push(
      `INSERT INTO pregunta (modulo, origen, numero_origen, enunciado, justificacion, dificultad, orden_fijo, estado)\n` +
        `  VALUES (${numero(p.modulo)}, ${texto(p.origen)}, ${numero(p.numero_origen)}, ${texto(p.enunciado)}, ` +
        `${texto(p.justificacion)}, ${texto(p.dificultad)}, ${numero(p.orden_fijo ?? 0)}, ${texto(p.estado ?? 'borrador')});`
    );

    for (const a of p.alternativas) {
      // El id de la pregunta se busca por su terna en vez de usar
      // last_insert_rowid(): dice en el propio SQL a que pregunta pertenece cada
      // alternativa, y no depende del orden en que se apliquen las sentencias.
      sentencias.push(
        `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta)\n` +
          `  VALUES ((SELECT id FROM pregunta WHERE ${terna(p)}), ${texto(a.letra)}, ${numero(a.orden)}, ` +
          `${texto(a.texto)}, ${numero(a.es_correcta)});`
      );
    }
  }

  return sentencias.join('\n');
}

function sqlActualizar(lista) {
  const sentencias = [];

  for (const p of lista) {
    sentencias.push(
      `UPDATE pregunta SET\n` +
        `    enunciado = ${texto(p.enunciado)},\n` +
        `    justificacion = ${texto(p.justificacion)},\n` +
        `    dificultad = ${texto(p.dificultad)},\n` +
        `    orden_fijo = ${numero(p.orden_fijo ?? 0)},\n` +
        `    estado = ${texto(p.estado ?? 'borrador')},\n` +
        `    fecha_modificacion = datetime('now')\n` +
        `  WHERE id = ${numero(p.id_resuelto)};`
    );

    // Las alternativas se reemplazan enteras porque el encargo trae las cuatro.
    // Cambian de id, y eso no importa: lo que ADR-020 promete estable de por vida
    // es el id de la PREGUNTA, que es al que apunta reemplazada_por.
    sentencias.push(`DELETE FROM alternativa WHERE pregunta_id = ${numero(p.id_resuelto)};`);

    for (const a of p.alternativas) {
      sentencias.push(
        `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta)\n` +
          `  VALUES (${numero(p.id_resuelto)}, ${texto(a.letra)}, ${numero(a.orden)}, ${texto(a.texto)}, ${numero(a.es_correcta)});`
      );
    }
  }

  return sentencias.join('\n');
}

// ---------------------------------------------------------------------------
// Actualizar: resolver a que fila apunta cada pregunta, ANTES de escribir
//
// Un UPDATE que no encuentra su fila no es un error para SQLite: afecta a cero
// filas y termina bien. Seria el fallo mas silencioso de toda la herramienta —el
// autor corrige una errata, la base dice «listo» y no cambio nada—, asi que el
// objetivo se resuelve antes y se planta si no aparece.
// ---------------------------------------------------------------------------

if (verbo === 'actualizar') {
  for (const p of preguntas) {
    const porId = !ausenteValor(p.id);
    const porTerna = !ausenteValor(p.origen) && !ausenteValor(p.modulo) && !ausenteValor(p.numero_origen);

    // Se comprueba ANTES de consultar: con las dos formas ausentes no hay nada
    // que preguntarle a la base, y una consulta armada a medias podria encontrar
    // por casualidad una fila que no era la que se queria tocar.
    if (!porId && !porTerna) {
      noSeAplico(
        'Una pregunta del archivo no dice a cual apunta.',
        [
          'Para actualizar hace falta una de las dos formas, y solo una:',
          '',
          '  "id": 3',
          '  o bien  "origen", "modulo" y "numero_origen"',
        ]
      );
    }

    const filas = consultar(
      porId
        ? `SELECT id FROM pregunta WHERE id = ${numero(p.id)};`
        : `SELECT id FROM pregunta WHERE ${terna(p)};`
    );

    if (filas.length === 0) {
      noSeAplico(
        porId
          ? `No hay ninguna pregunta con id ${p.id}.`
          : `No hay ninguna pregunta con origen ${p.origen}, modulo ${p.modulo}, numero ${p.numero_origen}.`,
        [
          'Actualizar exige que la pregunta ya este. Si es nueva, la operacion es',
          '«insertar».',
          '',
          'Nada de este lote se aplico.',
        ]
      );
    }

    if (!porId && !porTerna) {
      noSeAplico('Una pregunta no dice a cual apunta: hace falta «id» o la terna origen + modulo + numero_origen.');
    }

    p.id_resuelto = filas[0].id;
  }
}

const sql = verbo === 'actualizar' ? sqlActualizar(preguntas) : sqlInsertar(preguntas);

// ---------------------------------------------------------------------------
// revisar: hasta aca y no mas
// ---------------------------------------------------------------------------

if (verbo === 'revisar') {
  veredicto(
    'REVISADO  ***  NO SE ESCRIBIO NADA  ***',
    [
      `Archivo:   ${archivo}`,
      `Preguntas: ${preguntas.length}`,
      `Base:      ${base} (${remoto ? 'nube' : 'local'})`,
      '',
      'Las preguntas pasan la validacion. Esto es lo que se aplicaria:',
      '',
      ...sql.split('\n').map((l) => `  ${l}`),
      '',
      'Revisar no comprueba las colisiones: eso solo lo sabe la base, y para',
      'saberlo habria que escribir. Un lote que pasa por aqui todavia puede',
      'chocar con un enunciado repetido.',
    ],
    HECHO
  );
}

// ---------------------------------------------------------------------------
// Cuantas filas hay antes, para poder confirmar despues
// ---------------------------------------------------------------------------

const antes = consultar('SELECT COUNT(*) AS preguntas FROM pregunta;')[0].preguntas;

// ---------------------------------------------------------------------------
// Aplicar
// ---------------------------------------------------------------------------

const carpeta = mkdtempSync(join(tmpdir(), 'banco-'));
const archivoSql = join(carpeta, `${verbo}.sql`);

writeFileSync(archivoSql, `${sql}\n`, 'utf8');

const salida = wrangler([`--file=${archivoSql}`]);

rmSync(carpeta, { recursive: true, force: true });

// Aca esta el corazon de H-016: NO se mira `resultado.status`. Se mira lo que
// wrangler dijo, y despues se le pregunta a la base.
const dijoError = /\[ERROR\]|✘|SQLITE_/i.test(salida);
const dijoExito = /commands? executed successfully/i.test(salida);

if (dijoError) {
  const legible = traducir(salida);

  veredicto(
    'NO SE APLICO  ***  la base rechazo el lote  ***',
    [
      legible ?? 'La base rechazo el lote y este guion no supo traducir el motivo.',
      '',
      'Todo o nada: no entro ninguna de las preguntas del lote, ni las que venian',
      'antes de la que fallo.',
      '',
      ...crudo(salida),
    ],
    NO_SE_APLICO
  );
}

if (!dijoExito) {
  sinVeredicto('Wrangler no dijo que hubiera aplicado nada, pero tampoco dio un error.', crudo(salida));
}

// ---------------------------------------------------------------------------
// Preguntarle a la base, que es la unica que sabe
// ---------------------------------------------------------------------------

const despues = consultar('SELECT COUNT(*) AS preguntas FROM pregunta;')[0].preguntas;
const esperado = verbo === 'insertar' ? antes + preguntas.length : antes;

if (despues !== esperado) {
  sinVeredicto(
    `Wrangler dijo que aplico el lote, pero la base no cuadra: esperaba ${esperado} preguntas y hay ${despues}.`,
    ['Antes del lote habia ' + antes + '.', '', ...crudo(salida)]
  );
}

if (verbo === 'actualizar') {
  for (const p of preguntas) {
    const fila = consultar(`SELECT enunciado, fecha_modificacion FROM pregunta WHERE id = ${numero(p.id_resuelto)};`)[0];

    if (fila?.enunciado !== p.enunciado) {
      sinVeredicto(`Wrangler dijo que aplico, pero la pregunta ${p.id_resuelto} no tiene el enunciado nuevo.`, crudo(salida));
    }
    if (ausenteValor(fila?.fecha_modificacion)) {
      sinVeredicto(`La pregunta ${p.id_resuelto} quedo sin fecha de modificacion. Puede faltar la migracion 002.`, crudo(salida));
    }
  }
}

// ---------------------------------------------------------------------------
// La instantanea, dentro del mismo acto (regla 5 de ADR-025)
//
// Va aqui y no como paso aparte porque un paso aparte se olvida, y el respaldo
// desfasado no se nota hasta el dia que la capa de datos cae, que es el peor dia
// para descubrirlo.
// ---------------------------------------------------------------------------

const regeneracion = spawnSync(process.execPath, [GENERADOR, `--base=${base}`, ...(remoto ? [FLAG_REMOTO] : [])], {
  cwd: RAIZ,
  encoding: 'utf8',
});

const salidaGenerador = sinColores(`${regeneracion.stdout ?? ''}${regeneracion.stderr ?? ''}`);
const instantaneaHecha = /INSTANTANEA GENERADA/i.test(salidaGenerador);

veredicto(
  'HECHO',
  [
    `Operacion: ${verbo}`,
    `Archivo:   ${archivo}`,
    `Preguntas: ${preguntas.length}`,
    `Base:      ${base} (${remoto ? 'nube' : 'local'})`,
    `Total en la base: ${antes} -> ${despues}`,
    '',
    'Confirmado preguntandole a la base despues de escribir, no por el codigo de',
    'salida de wrangler, que en Windows no es testigo fiable (H-016).',
    '',
    instantaneaHecha
      ? 'Instantanea regenerada en el mismo acto (ADR-025, regla 5).'
      : 'AVISO: la instantanea NO se regenero. El respaldo del sitio quedo desfasado.',
    ...(instantaneaHecha
      ? []
      : ['', ...salidaGenerador.trim().split('\n').map((l) => `  ${l}`)]),
    ...(instantaneaHecha && !remoto
      ? [
          '',
          'OJO: esa instantanea salio de la base LOCAL, o sea del banco de juguete.',
          'Sirve para probar; NO es la que se publica. La versionada se genera desde',
          'la nube y la corre el autor (ADR-023). No la commitees sin mirar su sello.',
        ]
      : []),
  ],
  HECHO
);
