/**
 * El paso unico de ADR-023: respaldo e instantanea, o ninguno de los dos.
 *
 *   node scripts/publicar-banco.mjs --base=examen-td-js-produccion
 *   node scripts/publicar-banco.mjs --base=... --remote --registro=<archivo>
 *
 * POR QUE EXISTE, Y NO ES UNA COMODIDAD
 *
 * ADR-023 dice, literal: «Un solo paso produce las dos cosas, o no produce
 * ninguna». Hasta el 2026-09-09 eso no estaba implementado: eran DOS comandos
 * sueltos y un recordatorio impreso entre medio. Nada ataba las dos mitades.
 *
 * Y el fallo que la ADR predijo ya habia ocurrido, sin que nadie lo viera:
 * `d1/respaldo-banco.sql` contenia 527 bytes de `prueba_tuberia` —la tabla de
 * ensayo de la iteracion 12, del 2026-09-03— y NI UNA sola pregunta. El archivo
 * que ADR-014 llama «el respaldo del banco» no tenia banco dentro. Nadie lo
 * noto porque nada lo miraba.
 *
 * De ahi salen las dos cosas que hace este guion y que ninguno de los dos
 * comandos sueltos hacia:
 *
 *   1. Los dos archivos se escriben juntos o no se escribe ninguno.
 *   2. Se COMPRUEBA que el respaldo tenga banco dentro antes de instalarlo.
 *
 * TODO O NADA, Y COMO SE CONSIGUE CON DOS ARCHIVOS
 *
 * Las dos mitades se preparan en archivos temporales. Solo cuando las dos
 * salieron bien y pasaron sus comprobaciones se mueven a su sitio, una detras de
 * otra. Si algo falla antes de eso, los archivos de verdad NO SE TOCAN: siguen
 * exactamente como estaban, y se dice.
 *
 * No es atomico a nivel de sistema de archivos —son dos movimientos— pero la
 * ventana pasa de «los segundos que tarda la red» a «lo que tardan dos
 * renombrados», y todo lo que puede fallar de verdad —la red, wrangler, la
 * validacion del banco— falla antes de que se mueva nada.
 *
 * QUE COMPRUEBA ANTES DE INSTALAR NADA
 *
 *   respaldo con banco    el .sql trae la tabla `pregunta`, la `alternativa` y
 *                         al menos una fila de preguntas. Es la comprobacion que
 *                         faltaba, y la que habria cazado lo de `prueba_tuberia`
 *   sello del entorno     con --remote el sello TIENE que decir «nube». Si
 *                         dijera «local», no se instala: seria publicar el banco
 *                         de juguete como respaldo del real
 *   las dos se miran      el respaldo trae N preguntas y la instantanea publica M
 *                         activas. M > N es imposible y se rechaza
 *
 * NO ES UN COMPROBADOR DE CONTENIDO. Que el banco sea correcto lo dice
 * `comprobar-carga.mjs`, y se corre ANTES que esto.
 *
 * BARRERA PROPIA, POR ADR-027
 *
 * Este guion habla con la nube, asi que lleva su barrera de ADR-015 y su cotejo
 * de uuid, sin depender de que el enganche lo reconozca. Los dos estan
 * provocados.
 *
 * Codigos de salida:
 *   0  PUBLICADO         los dos archivos instalados, los dos comprobados
 *   1  NO SE PUBLICO     algo fallo. NINGUNO de los dos archivos se toco
 *   2  SIN VEREDICTO     no se pudo ni empezar. Tampoco se toco nada
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { abrirRegistro } from './registro-de-salida.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const CONFIGURACION = join(RAIZ, 'wrangler.toml');

const RESPALDO = join(RAIZ, 'd1', 'respaldo-banco.sql');
const INSTANTANEA = join(RAIZ, 'static', 'js', 'data', 'instantanea-banco.js');

const PUBLICADO = 0;
const NO_SE_PUBLICO = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);
const argumentos = process.argv.slice(2);

let cerrarRegistro = () => {};
let temporal = null;

/** Huellas de los dos archivos ANTES de tocar nada. Es lo que prueba el todo o nada. */
const huellaDe = (ruta) => {
  if (!existsSync(ruta)) return '(no existia)';
  return createHash('sha256').update(readFileSync(ruta)).digest('hex').slice(0, 16);
};

const huellasAntes = { respaldo: huellaDe(RESPALDO), instantanea: huellaDe(INSTANTANEA) };

function limpiar() {
  if (!temporal) return;
  try {
    rmSync(temporal, { recursive: true, force: true });
  } catch {
    // Un temporal que no se pudo borrar no cambia el resultado del trabajo.
  }
}

function veredicto(titulo, lineas, codigo) {
  limpiar();
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  cerrarRegistro(titulo, codigo);
  process.exit(codigo);
}

/**
 * El final de todo camino que no publica.
 *
 * Comprueba que los dos archivos siguen como estaban y lo DICE con sus huellas,
 * en vez de prometerlo. Si alguna cambió, eso es peor que el fallo original y
 * tiene que gritar: significa que el todo o nada no se cumplio.
 */
const noSePublico = (motivo, detalle = [], codigo = NO_SE_PUBLICO) => {
  const ahora = { respaldo: huellaDe(RESPALDO), instantanea: huellaDe(INSTANTANEA) };
  const intactos =
    ahora.respaldo === huellasAntes.respaldo && ahora.instantanea === huellasAntes.instantanea;

  veredicto(
    intactos
      ? 'NO SE PUBLICO  ***  NO SE TOCO NINGUNO DE LOS DOS ARCHIVOS  ***'
      : 'NO SE PUBLICO  ***  Y ALGO SI CAMBIO  ***  ESTO ES UN FALLO DEL GUION  ***',
    [
      motivo,
      ...(detalle.length ? ['', ...detalle] : []),
      '',
      raya,
      'Estado de los dos archivos, por huella y no por promesa:',
      '',
      `  d1/respaldo-banco.sql                 ${huellasAntes.respaldo} -> ${ahora.respaldo}`,
      `  static/js/data/instantanea-banco.js   ${huellasAntes.instantanea} -> ${ahora.instantanea}`,
      '',
      ...(intactos
        ? ['Los dos siguen como estaban. No hay nada que limpiar ni que revertir.']
        : [
            '*** UNA DE LAS DOS CAMBIO Y NO DEBIA ***',
            '',
            'El todo o nada de ADR-023 no se cumplio. Antes de volver a intentarlo,',
            'mira que quedo en ese archivo: puede estar a medias.',
          ]),
    ],
    codigo
  );
};

cerrarRegistro = abrirRegistro(argumentos, (mensaje, ruta) =>
  veredicto(
    'SIN VEREDICTO  ***  NO PUDE ABRIR EL REGISTRO  ***',
    [mensaje, '', `Ruta: ${ruta}`, '', 'Pediste registro para tener evidencia. Sin el no corro.'],
    SIN_VEREDICTO
  )
);

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const valorDe = (nombre) => {
  const encontrado = argumentos.find((a) => a.startsWith(`--${nombre}=`));
  return encontrado ? encontrado.slice(nombre.length + 3) : null;
};

const base = valorDe('base');

/**
 * --base obligatorio, sin valor por omision.
 *
 * Este guion instala los dos archivos que el sitio publica. Que la base se sepa
 * por omision seria convertir un olvido en una publicacion.
 */
if (!base) {
  noSePublico(
    'Falta --base, y no tiene valor por omision a proposito.',
    [
      'Uso:',
      '',
      '  node scripts/publicar-banco.mjs --base=<nombre> [--remote] [--registro=<archivo>]',
      '',
      'Este guion instala los dos archivos que publica el sitio. Un valor por',
      'omision convertiria un olvido en una publicacion.',
    ],
    SIN_VEREDICTO
  );
}

const FLAG_REMOTO = '--remote';
const remoto = argumentos.includes(FLAG_REMOTO);
const destino = remoto ? FLAG_REMOTO : '--local';

const SABOTAJES = ['respaldo-sin-banco', 'respaldo-vacio', 'sello-local', 'instantanea-falla'];
const sabotaje = valorDe('sabotaje');

if (sabotaje && !SABOTAJES.includes(sabotaje)) {
  noSePublico(`No conozco el sabotaje «${sabotaje}».`, [`Los que hay: ${SABOTAJES.join(', ')}`], SIN_VEREDICTO);
}

if (sabotaje && remoto) {
  noSePublico(
    'Un sabotaje contra la nube no tiene sentido.',
    ['Se ensaya contra la base local, que es donde se puede repetir sin costo.'],
    SIN_VEREDICTO
  );
}

// ---------------------------------------------------------------------------
// Barrera de ADR-015 y cotejo de la base (ADR-027)
// ---------------------------------------------------------------------------

let configuracion;

try {
  configuracion = readFileSync(CONFIGURACION, 'utf8');
} catch (error) {
  noSePublico(`No pude leer ${CONFIGURACION}: ${error.message}`, [], SIN_VEREDICTO);
}

const declaradas = [...configuracion.matchAll(/^\s*database_name\s*=\s*"([^"]+)"/gm)].map((m) => m[1]);

if (process.env.PERMITIR_BASE_NO_DECLARADA !== '1' && !declaradas.includes(base)) {
  noSePublico(
    `Pediste la base «${base}», que no esta declarada en wrangler.toml.`,
    [`Declaradas: ${declaradas.join(', ') || '(ninguna)'}`, '', 'H-015. Si sabes lo que haces: PERMITIR_BASE_NO_DECLARADA=1'],
    SIN_VEREDICTO
  );
}

const uuidDeclarado = (() => {
  const bloques = configuracion.split(/^\s*\[\[/m);
  for (const bloque of bloques) {
    if (!new RegExp(`database_name\\s*=\\s*"${base}"`).test(bloque)) continue;
    return bloque.match(/^\s*database_id\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  }
  return null;
})();

if (!uuidDeclarado) {
  noSePublico(`wrangler.toml declara «${base}» pero no le veo un database_id.`, [], SIN_VEREDICTO);
}

if (remoto && process.env.PERMITIR_REMOTO !== '1') {
  veredicto(
    'SIN VEREDICTO  ***  ME NIEGO A CORRER ESTO  ***  ADR-015  ***',
    [
      `Pediste ${FLAG_REMOTO}, que habla con la cuenta de Cloudflare.`,
      '',
      'Claude Code no ejecuta wrangler contra la cuenta: los comandos remotos los',
      'escribe, y los ejecuta el autor en su terminal. Ver ADR-015, ADR-027 y H-014.',
      '',
      'Si eres el autor y esto es tu terminal:',
      '',
      '  PowerShell:  $env:PERMITIR_REMOTO=1',
      '',
      'No se toco ninguno de los dos archivos.',
    ],
    SIN_VEREDICTO
  );
}

if (!existsSync(WRANGLER)) {
  noSePublico('No encontre wrangler en node_modules. Corre `npm install`.', [], SIN_VEREDICTO);
}

const sinColores = (texto) => texto.replace(/\[[0-9;]*m/g, '');

function wrangler(parametros) {
  const resultado = spawnSync(process.execPath, [WRANGLER, ...parametros], {
    cwd: RAIZ,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });

  if (resultado.error) noSePublico(`No pude lanzar wrangler: ${resultado.error.message}`, [], SIN_VEREDICTO);

  return {
    normal: sinColores(resultado.stdout ?? ''),
    errores: sinColores(resultado.stderr ?? ''),
    codigo: resultado.status,
  };
}

const crudo = (r) => {
  const partes = [];
  if (r.normal.trim()) partes.push('Salida normal:', ...r.normal.trim().split('\n').map((l) => `  ${l}`));
  if (r.errores.trim()) partes.push('Salida de error:', ...r.errores.trim().split('\n').map((l) => `  ${l}`));
  return partes.length ? partes : ['(wrangler no dijo nada por ninguna de las dos salidas)'];
};

/** Cotejo del uuid antes de tocar nada. Sin --json, que es la unica forma de verlo. */
const cotejo = wrangler(['d1', 'execute', base, destino, '--command=SELECT 1 AS cotejo;']);
const uuidVisto =
  `${cotejo.normal}${cotejo.errores}`.match(/database\s+\S+\s+\(([0-9a-fA-F-]{36})\)/)?.[1] ?? null;

if (!uuidVisto) {
  noSePublico('Wrangler no dijo contra que uuid iba a hablar, asi que no pude cotejarlo.', [
    `Esperaba ver «${uuidDeclarado}», el que wrangler.toml le da a «${base}».`,
    '',
    ...crudo(cotejo),
  ], SIN_VEREDICTO);
}

if (uuidVisto.toLowerCase() !== uuidDeclarado.toLowerCase()) {
  noSePublico('El uuid no calza con el que declara wrangler.toml.', [
    `  wrangler.toml dice:  ${uuidDeclarado}`,
    `  wrangler habla con:  ${uuidVisto}`,
    '',
    'Son bases distintas. No sigas hasta entender por que difieren (H-015).',
  ], SIN_VEREDICTO);
}

// ---------------------------------------------------------------------------
// Mitad 1 · el respaldo, a un temporal
// ---------------------------------------------------------------------------

temporal = mkdtempSync(join(tmpdir(), 'publicar-banco-'));
const respaldoTemporal = join(temporal, 'respaldo-banco.sql');
const instantaneaTemporal = join(temporal, 'instantanea-banco.js');

console.log(`\nPaso 1 de 2 · exportando el respaldo de «${base}» (${destino})…`);

const exportacion = wrangler(['d1', 'export', base, destino, `--output=${respaldoTemporal}`]);

if (!existsSync(respaldoTemporal)) {
  noSePublico('La exportacion no dejo ningun archivo.', [
    ...crudo(exportacion),
    '',
    'Sin respaldo no hay instantanea: el paso es uno solo (ADR-023).',
  ]);
}

let sql = readFileSync(respaldoTemporal, 'utf8');

// --- Los sabotajes de la mitad 1, sobre el temporal y nunca sobre el de verdad
let queSeRompio = null;

if (sabotaje === 'respaldo-sin-banco') {
  sql = 'PRAGMA defer_foreign_keys=TRUE;\nCREATE TABLE prueba_tuberia (id INTEGER PRIMARY KEY);\n';
  queSeRompio = 'el respaldo quedo sin banco dentro, como el que estaba versionado hasta hoy';
}

if (sabotaje === 'respaldo-vacio') {
  sql = '';
  queSeRompio = 'el respaldo quedo vacio';
}

/**
 * Comprobar que el respaldo tenga banco dentro.
 *
 * ESTA ES LA COMPROBACION QUE FALTABA. `d1/respaldo-banco.sql` llevaba desde el
 * 2026-09-03 conteniendo `prueba_tuberia` y ni una pregunta, y paso por respaldo
 * del banco porque nadie lo miro. Un archivo existe; que sea lo que dice ser es
 * otra cosa.
 */
const tieneTabla = (nombre) => new RegExp(`CREATE TABLE\\s+"?${nombre}"?`, 'i').test(sql);
const filasDe = (nombre) =>
  (sql.match(new RegExp(`INSERT INTO\\s+"?${nombre}"?`, 'gi')) || []).length;

const preguntasEnRespaldo = filasDe('pregunta');

if (!sql.trim()) {
  noSePublico('El respaldo salio vacio.', [
    'Un archivo de cero bytes no es un respaldo, es un archivo de cero bytes.',
    ...crudo(exportacion),
  ]);
}

if (!tieneTabla('pregunta') || !tieneTabla('alternativa')) {
  noSePublico('EL RESPALDO NO TRAE EL BANCO DENTRO.', [
    `  tabla pregunta:     ${tieneTabla('pregunta') ? 'si' : 'NO'}`,
    `  tabla alternativa:  ${tieneTabla('alternativa') ? 'si' : 'NO'}`,
    `  tamano:             ${sql.length} caracteres`,
    '',
    'Esto es exactamente lo que estuvo versionado como «respaldo del banco» desde',
    'el 2026-09-03 hasta el 2026-09-09: un volcado de otra tabla. Un archivo que',
    'existe no es un respaldo; serlo es otra cosa, y es lo que se comprueba aqui.',
    '',
    'Mira contra que base exportaste.',
  ]);
}

if (preguntasEnRespaldo === 0) {
  noSePublico('El respaldo trae el esquema del banco pero NINGUNA pregunta.', [
    'Puede ser correcto si la base esta de verdad vacia, y entonces no hay nada',
    'que publicar todavia. Si esperabas preguntas, mira contra que base exportaste.',
  ]);
}

console.log(`  respaldo con banco dentro · ${preguntasEnRespaldo} preguntas · ${sql.length} caracteres`);

// ---------------------------------------------------------------------------
// Mitad 2 · la instantanea, a otro temporal
// ---------------------------------------------------------------------------

console.log(`\nPaso 2 de 2 · regenerando la instantanea desde «${base}» (${destino})…`);

const argumentosInstantanea = [
  join(RAIZ, 'scripts', 'generar-instantanea.mjs'),
  `--base=${base}`,
  `--salida=${instantaneaTemporal}`,
  ...(remoto ? [FLAG_REMOTO] : []),
];

if (sabotaje === 'instantanea-falla') {
  // Se le pide una base que no existe: la mitad 2 falla despues de que la 1 ya
  // salio bien, que es justo el caso que el todo o nada tiene que cubrir.
  argumentosInstantanea[1] = '--base=base-que-no-existe';
  queSeRompio = 'la instantanea fallo DESPUES de que el respaldo ya habia salido bien';
}

/**
 * El entorno se pasa TAL CUAL, y eso es una decision.
 *
 * Se penso inyectar `PERMITIR_INSTANTANEA_LOCAL=1` para que este guion pudiera
 * probarse en local sin tropezar. Seria apagar desde aca la proteccion que impide
 * pisar una instantanea de la NUBE con una LOCAL — justo la que existe para que
 * el sitio no publique el banco de juguete. Un guion que desactiva en silencio la
 * barrera de otro es peor que el problema que resolvia.
 *
 * Si hace falta, lo pide quien llama, a proposito y en su terminal.
 */
const generacion = spawnSync(process.execPath, argumentosInstantanea, {
  cwd: RAIZ,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

const salidaGeneracion = `${sinColores(generacion.stdout ?? '')}${sinColores(generacion.stderr ?? '')}`;

if (!existsSync(instantaneaTemporal)) {
  noSePublico('El generador de la instantanea no dejo ningun archivo.', [
    ...salidaGeneracion.trim().split('\n').map((l) => `  ${l}`),
    '',
    'El respaldo SI se habia exportado bien, y por eso no se instala tampoco el',
    'respaldo: es un paso solo, y a medias no vale (ADR-023).',
  ]);
}

// --- El sello, que es la condicion que no se negocia -------------------------

let sello;

try {
  const modulo = await import(`${pathToFileURL(instantaneaTemporal).href}?t=${Date.now()}`);
  sello = modulo?.SELLO ?? null;
} catch (error) {
  noSePublico(`La instantanea recien generada no se puede leer: ${error.message}`);
}

if (!sello) noSePublico('La instantanea recien generada no trae SELLO, y el sello es lo que sostiene el aviso de ADR-008.');

if (sabotaje === 'sello-local') {
  sello = { ...sello, entorno: 'local' };
  queSeRompio = 'el sello decia «local» habiendose pedido la nube';
}

/**
 * Con --remote el sello TIENE que decir «nube».
 *
 * Es la condicion que el autor puso por escrito el 2026-09-09 y no se negocia:
 * una instantanea con sello «local» es el banco de juguete, y publicarla
 * repetiria el incumplimiento de ADR-023 borrando ademas el rastro de que alguna
 * vez lo fue.
 *
 * POR QUE «SE PIDIO LA NUBE» ES UNA VARIABLE APARTE DE «SE HABLA CON LA NUBE»
 *
 * La primera version condicionaba esto a `remoto` a secas, y con eso la
 * comprobacion resultaba IMPOSIBLE de ejercitar: exige `--remote`, y los
 * sabotajes estan prohibidos con `--remote` justamente para no tocar la cuenta.
 * Quedaba una comprobacion que no podia decir «no» nunca, escrita dentro del
 * guion que existe para que ADR-023 deje de ser una promesa. H-023 otra vez, y
 * en el peor sitio posible.
 *
 * Separadas, el sabotaje puede pedir que se exija el sello de nube sin que nadie
 * hable con la nube, que es lo unico que hacia falta.
 */
const exigeSelloNube = remoto || sabotaje === 'sello-local';

if (exigeSelloNube && sello.entorno !== 'nube') {
  noSePublico(`Pediste la nube y el sello dice «${sello.entorno}».`, [
    'Una instantanea con sello «local» es el banco de juguete. Publicarla dejaria',
    'al estudiante con diez filas de ejemplo el dia que caiga la capa de datos, y',
    'el aviso de ADR-008 diciendo que hay copia.',
    '',
    'No se instala ninguno de los dos archivos.',
  ]);
}

// --- Las dos mitades se miran entre si ---------------------------------------

const activasEnInstantanea = Number(sello.preguntas ?? 0);

if (activasEnInstantanea > preguntasEnRespaldo) {
  noSePublico('La instantanea publica mas preguntas de las que el respaldo contiene.', [
    `  respaldo      ${preguntasEnRespaldo} preguntas (todos los estados)`,
    `  instantanea   ${activasEnInstantanea} activas`,
    '',
    'Es imposible: las activas son un subconjunto. Las dos mitades no salieron del',
    'mismo estado de la base, y publicarlas juntas seria publicar dos fotos de',
    'momentos distintos como si fueran una.',
  ]);
}

// ---------------------------------------------------------------------------
// Si hubo sabotaje, aqui se acaba: no se instala nada
// ---------------------------------------------------------------------------

if (sabotaje) {
  veredicto(
    'SABOTAJE NO CAZADO  ***  EL GUION NO SIRVE  ***',
    [
      `Sabotaje:      --sabotaje=${sabotaje}`,
      `Que se rompio: ${queSeRompio}`,
      '',
      'El guion llego hasta el final SIN detenerse, y tenia que haberse detenido.',
      'Una comprobacion que no puede decir «no» no es una comprobacion (H-023).',
      '',
      'No se instalo nada, pero eso es porque este bloque lo impide, no porque el',
      'guion se haya dado cuenta.',
    ],
    NO_SE_PUBLICO
  );
}

// ---------------------------------------------------------------------------
// Instalar los dos, ahora si
// ---------------------------------------------------------------------------

try {
  copyFileSync(respaldoTemporal, RESPALDO);
  copyFileSync(instantaneaTemporal, INSTANTANEA);
} catch (error) {
  noSePublico(`Fallo al instalar los archivos: ${error.message}`, [
    'Mira el estado de las huellas de abajo: si una cambio y la otra no, quedaron',
    'desparejas y hay que arreglarlo a mano antes de commitear.',
  ]);
}

const tamano = (ruta) => `${(statSync(ruta).size / 1024).toFixed(1)} kB`;

veredicto(
  'PUBLICADO  ***  los dos archivos, del mismo acto  ***',
  [
    `Base       ${base} (${uuidVisto})`,
    `Destino    ${destino}`,
    `Sello      entorno «${sello.entorno}» · generada ${sello.generada_en}`,
    '',
    'Los dos archivos, instalados juntos:',
    '',
    `  d1/respaldo-banco.sql                 ${tamano(RESPALDO).padStart(9)}   ${preguntasEnRespaldo} preguntas`,
    `  static/js/data/instantanea-banco.js   ${tamano(INSTANTANEA).padStart(9)}   ${activasEnInstantanea} activas`,
    '',
    `  huella del respaldo      ${huellasAntes.respaldo} -> ${huellaDe(RESPALDO)}`,
    `  huella de la instantanea ${huellasAntes.instantanea} -> ${huellaDe(INSTANTANEA)}`,
    '',
    raya,
    'LOS DOS VAN EN EL MISMO COMMIT. Son dos copias del mismo estado, y separarlas',
    'es como se desincronizan (ADR-023).',
    '',
    ...(remoto
      ? ['El sello dice «nube», asi que esta instantanea SI se publica.']
      : [
          'OJO: destino local. Esta instantanea sale del banco de juguete y NO se',
          'publica. Sirve para probar este guion, no para commitear.',
        ]),
  ],
  PUBLICADO
);
