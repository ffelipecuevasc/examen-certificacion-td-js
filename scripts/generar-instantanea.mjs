/**
 * Genera la instantanea de respaldo del banco de preguntas (ADR-008).
 *
 * QUE ES LA INSTANTANEA
 *
 * Una copia del banco versionada dentro del sitio, que el navegador carga cuando
 * la capa de datos no responde. Es lo que impide que un estudiante repasando la
 * noche antes del examen se quede frente a una pagina vacia porque una base de
 * datos no contesto.
 *
 * DE DONDE SE GENERA, Y POR QUE ESO IMPORTA TANTO
 *
 * **De la base de la nube, y la genera el autor** (ADR-023). Generada desde D1
 * local, la instantanea reflejaria la base de juguete del equipo de desarrollo
 * —diez filas de ejemplo— y el sitio publicaria eso como respaldo del banco real.
 * El fallo seria silencioso: archivo generado, todo verde, commit hecho, y el
 * error visible solo el dia de la caida.
 *
 * Tres cosas cuidan ese borde, y ninguna es acordarse:
 *
 *   1. Contra la base local, se NIEGA a pisar una instantanea que venga de la
 *      nube. Salida explicita: PERMITIR_INSTANTANEA_LOCAL=1.
 *   2. Solo ESCRIBE si la base consultada es la que el sitio publica, o sea la
 *      del enlace principal de wrangler.toml. La base de pruebas trae otro banco;
 *      una copia suya presentada como el respaldo real es exactamente el fallo
 *      que ADR-023 vino a evitar.
 *   3. Para probar contra cualquier otra base esta `--ensayo`, que lee, valida,
 *      informa y **no escribe nada**.
 *
 * EL SELLO NO ES DECORACION
 *
 * El archivo generado dice contra que base corrio y cuando (ADR-023). No es
 * metadato: es **la fuente del aviso** que el sitio le muestra al estudiante
 * cuando esta sirviendo el respaldo. Sin ese dato, la promesa de ADR-008 —avisar
 * de que la copia puede no estar al dia— no se apoya en nada.
 *
 * LAS CONSULTAS NO SE COPIAN, SE IMPORTAN
 *
 * Salen de functions/api/preguntas.js, que es el extremo real, y la validacion
 * sale de functions/api/_validacion.js, que es la misma que filtra lo que se
 * entrega en linea. Con copias propias, el respaldo empezaria a traer otra cosa
 * que el extremo el dia que una de las dos cambiara, y la diferencia solo se veria
 * el dia de la caida.
 *
 * COMO SE LEE LO QUE DICE WRANGLER (H-019)
 *
 * Con --json, wrangler imprime en la salida normal **un solo documento JSON**, y
 * cuando la consulta falla imprime ahi mismo un objeto de error:
 *
 *   { "error": { "text": "no such table: modulo: SQLITE_ERROR" } }
 *
 * De modo que hay dos formas legitimas de respuesta y las dos llegan por el mismo
 * sitio. La primera version de este guion buscaba el primer `[` de la salida para
 * empezar a interpretar; contra la nube, el objeto de error trae un `notes: [...]`
 * y ese `[` caia dentro del error. Resultado: un fallo de sintaxis en vez del
 * mensaje que explicaba todo. Ahora se interpreta la salida ENTERA, se reconoce
 * el sobre de error, y si no se entiende nada se muestra crudo lo que wrangler
 * dijo.
 *
 * Tres veredictos:
 *   0  INSTANTANEA GENERADA     (o ENSAYO CORRECTO, que no escribe)
 *   1  NO SE GENERO             hay algo que arreglar; el archivo anterior NO se toca
 *   2  NO SE PUDO GENERAR       nadie llego a preguntarle nada a la base
 *
 * Uso:
 *
 *   npm run datos:instantanea                       base local; para probar
 *   npm run datos:instantanea -- --ensayo           lee y NO escribe nada
 *
 * Contra la nube lo ejecuta el autor, nunca Claude Code (ADR-015):
 *
 *   PowerShell   $env:PERMITIR_REMOTO=1; npm run datos:instantanea -- --remote
 *   Git Bash     PERMITIR_REMOTO=1 npm run datos:instantanea -- --remote
 *
 * Y para probar contra otra base de la nube sin escribir nada, agregando
 * --base=<nombre> --ensayo a la misma linea.
 *
 * El procedimiento completo —editar, exportar d1/respaldo-banco.sql, regenerar,
 * publicar, todo en un solo bloque— lo escribe la iteracion 23 en el manual, por
 * ADR-023. Este encabezado es el comando, no el procedimiento.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { SQL_PREGUNTAS, sqlAlternativas } from '../functions/api/preguntas.js';
import { validarPreguntas } from '../functions/api/_validacion.js';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const CONFIGURACION = join(RAIZ, 'wrangler.toml');
const SALIDA = join(RAIZ, 'static', 'js', 'data', 'instantanea-banco.js');

const BASE_POR_OMISION = 'examen-td-js-produccion';

const GENERADA = 0;
const NO_GENERADA = 1;
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
    'NO SE PUDO GENERAR  ***  ESTO NO ES UN APROBADO  ***',
    [
      motivo,
      // El detalle va pegado al motivo y antes de la explicacion general: lo
      // primero que hay que poder leer es lo que dijo la herramienta, no el
      // parrafo de siempre. Es la mitad practica de H-019.
      ...(detalle.length ? ['', ...detalle] : []),
      '',
      'Nadie llego a leer el banco, asi que no hay instantanea nueva.',
      'La anterior, si existia, sigue como estaba.',
    ],
    SIN_VEREDICTO
  );

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2);
const conBase = argumentos.find((a) => a.startsWith('--base='));
const base = conBase ? conBase.slice('--base='.length) : BASE_POR_OMISION;

/**
 * El flag de wrangler que apunta a la nube. Escrito entero y a la vista: un flag
 * armado a pedazos seria justo el «comando escondido dentro de un archivo» que
 * H-014 describe, y lo que sostiene la barrera es poder leerlo.
 */
const FLAG_REMOTO = '--remote';
const remoto = argumentos.includes(FLAG_REMOTO);
const ensayo = argumentos.includes('--ensayo');
const destino = remoto ? FLAG_REMOTO : '--local';

// ---------------------------------------------------------------------------
// Que bases declara el proyecto
//
// El enlace principal —el bloque [[d1_databases]] de la raiz, antes de cualquier
// [env.*]— es la base que el sitio publica. Las de los entornos son otras, y una
// copia suya no puede pasar por el respaldo del banco real.
// ---------------------------------------------------------------------------

function declaraciones() {
  let texto;

  try {
    texto = readFileSync(CONFIGURACION, 'utf8');
  } catch (error) {
    sinVeredicto(`No pude leer ${CONFIGURACION}: ${error.message}`);
  }

  const nombre = /^\s*database_name\s*=\s*"([^"]+)"/gm;
  const todas = [...texto.matchAll(nombre)].map((m) => m[1]);

  const corte = texto.search(/^\s*\[\s*env\./m);
  const principal = (corte === -1 ? texto : texto.slice(0, corte)).match(nombre)?.[0];

  return {
    todas,
    publicada: principal ? principal.match(/"([^"]+)"/)[1] : null,
  };
}

const { todas: basesDeclaradas, publicada: basePublicada } = declaraciones();

// ---------------------------------------------------------------------------
// El nombre de la base tiene que estar declarado en wrangler.toml (H-015)
//
// En remoto wrangler no usa el archivo como limite: si el nombre no esta ahi, lo
// busca en la cuenta y lo encuentra igual. Aca se le devuelve ese papel.
// ---------------------------------------------------------------------------

if (process.env.PERMITIR_BASE_NO_DECLARADA !== '1' && !basesDeclaradas.includes(base)) {
  veredicto(
    'BASE NO DECLARADA  ***  H-015  ***',
    [
      `Pediste la base «${base}», que no esta declarada en wrangler.toml.`,
      '',
      `Declaradas: ${basesDeclaradas.join(', ') || '(ninguna)'}`,
      '',
      'Wrangler la aceptaria igual en remoto, asi que este envoltorio se planta',
      'antes: una errata en el nombre no rebota contra ninguna otra cosa.',
      '',
      'Si sabes lo que haces: PERMITIR_BASE_NO_DECLARADA=1',
    ],
    SIN_VEREDICTO
  );
}

// ---------------------------------------------------------------------------
// Capa 3 de la barrera de ADR-015: el camino documentado hacia la nube
// ---------------------------------------------------------------------------

if (remoto && process.env.PERMITIR_REMOTO !== '1') {
  veredicto(
    'ME NIEGO A CORRER ESTO  ***  ADR-015  ***',
    [
      `Pediste ${FLAG_REMOTO}, que habla con la cuenta de Cloudflare.`,
      '',
      'Claude Code no ejecuta wrangler contra la cuenta: los comandos remotos los',
      'escribe, y los ejecuta el autor en su terminal. Ver ADR-015 y H-014.',
      '',
      'Si eres el autor y esto es tu terminal, define PERMITIR_REMOTO=1 antes de',
      'lanzarlo:',
      '',
      '  PowerShell:  $env:PERMITIR_REMOTO=1',
      '  Git Bash:    PERMITIR_REMOTO=1 npm run datos:instantanea -- ...',
      '',
      'No se genero ninguna instantanea.',
    ],
    SIN_VEREDICTO
  );
}

// ---------------------------------------------------------------------------
// Solo se ESCRIBE la instantanea de la base que el sitio publica
//
// La base de pruebas de la nube tiene su propio banco, distinto del real.
// Generar desde ahi y versionar el resultado seria publicar una copia de otra
// cosa como respaldo del banco, y con el sello diciendo «nube», que es lo que
// desactivaria todos los demas avisos. Para eso esta --ensayo.
// ---------------------------------------------------------------------------

if (!ensayo && basePublicada && base !== basePublicada) {
  veredicto(
    'NO SE GENERO  ***  ESA BASE NO ES LA QUE PUBLICA EL SITIO  ***',
    [
      `Pediste generar desde «${base}».`,
      `La base del enlace principal de wrangler.toml es «${basePublicada}».`,
      '',
      'El banco de esa otra base no es el que el sitio sirve, asi que una copia',
      'suya no puede quedar versionada como respaldo: seria el fallo silencioso',
      'de ADR-023 con el sello diciendo que viene de la nube.',
      '',
      'Si lo que quieres es PROBAR el generador contra esa base, agrega --ensayo:',
      'lee, valida, informa y no escribe nada.',
    ],
    NO_GENERADA
  );
}

if (!ensayo && !basePublicada) {
  sinVeredicto(
    'No encontre ningun `database_name` en el enlace principal de wrangler.toml.',
    ['Sin saber cual es la base que publica el sitio no puedo comprobar que la', 'instantanea salga de ella.']
  );
}

// ---------------------------------------------------------------------------
// Una instantanea local NO puede pisar una de la nube
//
// Es el fallo silencioso que ADR-023 describe, y el unico camino real por el que
// puede ocurrir: alguien prueba el generador en local, el archivo queda con las
// diez filas de juguete, y se commitea sin que nada chille. Aqui chilla.
// ---------------------------------------------------------------------------

/** Sello de la instantanea que ya existe en disco, o null si no hay ninguna. */
async function selloAnterior() {
  if (!existsSync(SALIDA)) return null;

  try {
    const modulo = await import(`${pathToFileURL(SALIDA).href}?t=${Date.now()}`);
    return modulo?.SELLO ?? null;
  } catch {
    // Un archivo ilegible no se protege a si mismo: se deja pisar.
    return null;
  }
}

const anterior = ensayo ? null : await selloAnterior();

if (!remoto && anterior?.entorno === 'nube' && process.env.PERMITIR_INSTANTANEA_LOCAL !== '1') {
  veredicto(
    'ME NIEGO A PISAR LA INSTANTANEA  ***  ADR-023  ***',
    [
      'La instantanea que hay en disco se genero desde la NUBE:',
      '',
      `  base       ${anterior.base}`,
      `  generada   ${anterior.generada_en}`,
      `  preguntas  ${anterior.preguntas}`,
      '',
      'Estas corriendo el generador contra la base LOCAL, que tiene el banco de',
      'juguete. Escribirla dejaria el sitio publicando diez filas de ejemplo como',
      'respaldo del banco real, y no se notaria hasta el dia de la caida.',
      '',
      'Si de verdad quieres una instantanea local —para probar el generador o el',
      'modo degradado— pidelo a proposito:',
      '',
      '  PowerShell:  $env:PERMITIR_INSTANTANEA_LOCAL=1; npm run datos:instantanea',
      '  Git Bash:    PERMITIR_INSTANTANEA_LOCAL=1 npm run datos:instantanea',
      '',
      'Y acuerdate de regenerarla desde la nube antes de publicar.',
    ],
    NO_GENERADA
  );
}

// ---------------------------------------------------------------------------
// Consultar la base
//
// Las dos consultas viajan juntas en un solo --command: asi las dos miran el
// mismo instante de la base. Con --command y no con --file, que es el camino de
// escritura (regla de la iteracion 21).
// ---------------------------------------------------------------------------

if (!existsSync(WRANGLER)) {
  sinVeredicto('No encontre wrangler en node_modules. Corre `npm install`.');
}

const consulta = `${SQL_PREGUNTAS} ORDER BY modulo, id;\n${sqlAlternativas(false)};`;

const parametros = ['d1', 'execute', base, destino, '--json', `--command=${consulta}`];
const comando = [
  'node',
  'node_modules/wrangler/bin/wrangler.js',
  ...parametros.map((p) => (p.startsWith('--command=') ? '--command=<las dos consultas>' : p)),
].join(' ');

const resultado = spawnSync(process.execPath, [WRANGLER, ...parametros], { encoding: 'utf8' });

const salida = `${resultado.stdout ?? ''}`;
const errores = `${resultado.stderr ?? ''}`;

/** Lo que wrangler dijo, por donde sea que lo haya dicho. Para mostrarlo crudo. */
const crudo = () => {
  const partes = [];
  if (salida.trim()) partes.push('Salida normal:', ...salida.trim().split('\n').map((l) => `  ${l}`));
  if (errores.trim()) partes.push('Salida de error:', ...errores.trim().split('\n').map((l) => `  ${l}`));
  return partes.length ? partes : ['(wrangler no dijo nada por ninguna de las dos salidas)'];
};

if (resultado.error) {
  sinVeredicto(`No pude lanzar wrangler: ${resultado.error.message}`, ['Comando:', `  ${comando}`]);
}

// Se interpreta la salida ENTERA, no desde el primer corchete. Con --json
// wrangler baja su propio nivel de registro, asi que la salida normal trae un
// unico documento y nada mas. Ver H-019.
let respuesta;

try {
  respuesta = JSON.parse(salida.trim());
} catch (error) {
  sinVeredicto(`No pude interpretar la respuesta de wrangler: ${error.message}`, [
    'Comando:',
    `  ${comando}`,
    '',
    ...crudo(),
  ]);
}

// El sobre de error de wrangler. Es la forma legitima que toma cualquier fallo de
// la consulta —una tabla que no existe, la base vacia, un error de la API— y su
// texto es lo unico que explica que paso. Ocultarlo detras de un mensaje propio
// es el error de H-013, y con este guion se cometio de verdad (H-019).
if (respuesta?.error) {
  const notas = Array.isArray(respuesta.error.notes)
    ? respuesta.error.notes.map((n) => `  ${n?.text ?? JSON.stringify(n)}`)
    : [];

  sinVeredicto('Wrangler no pudo ejecutar la consulta. Lo que dijo, tal cual:', [
    `  ${respuesta.error.text ?? JSON.stringify(respuesta.error)}`,
    ...notas,
    '',
    'Comando:',
    `  ${comando}`,
    '',
    'Si dice «no such table», esa base todavia no tiene el esquema del banco.',
  ]);
}

// La forma se comprueba entera antes de creersela. Es la regla 2 de H-013: si la
// respuesta no es la que se esperaba, no se inventa un resultado con ella.
const COLUMNAS_PREGUNTA = [
  'id',
  'modulo',
  'modulo_titulo',
  'modulo_icono',
  'enunciado',
  'justificacion',
  'dificultad',
  'orden_fijo',
];
const COLUMNAS_ALTERNATIVA = ['pregunta_id', 'id', 'letra', 'orden', 'texto', 'es_correcta'];

if (!Array.isArray(respuesta) || respuesta.length !== 2) {
  sinVeredicto(
    `Esperaba dos bloques de resultados —preguntas y alternativas— y llego ${
      Array.isArray(respuesta) ? `un arreglo de ${respuesta.length}` : 'otra cosa'
    }.`,
    ['Comando:', `  ${comando}`, '', ...crudo()]
  );
}

const filasDe = (bloque, nombre, columnas) => {
  const filas = bloque?.results;
  if (!Array.isArray(filas)) {
    sinVeredicto(`El bloque de ${nombre} no trae \`results\` como arreglo.`, ['', ...crudo()]);
  }
  for (const fila of filas) {
    const faltan = columnas.filter((c) => !(c in fila));
    if (faltan.length) {
      sinVeredicto(`Una fila de ${nombre} no trae las columnas ${faltan.join(', ')}.`, [
        'La consulta y este guion dejaron de estar de acuerdo.',
      ]);
    }
  }
  return filas;
};

const filasPreguntas = filasDe(respuesta[0], 'preguntas', COLUMNAS_PREGUNTA);
const filasAlternativas = filasDe(respuesta[1], 'alternativas', COLUMNAS_ALTERNATIVA);

// ---------------------------------------------------------------------------
// Armar, validar
// ---------------------------------------------------------------------------

const porPregunta = new Map();

for (const fila of filasAlternativas) {
  const alternativa = {
    id: fila.id,
    letra: fila.letra,
    orden: fila.orden,
    texto: fila.texto,
    es_correcta: fila.es_correcta,
  };
  const lista = porPregunta.get(fila.pregunta_id);
  if (lista) lista.push(alternativa);
  else porPregunta.set(fila.pregunta_id, [alternativa]);
}

const armadas = filasPreguntas.map((fila) => ({
  ...fila,
  alternativas: porPregunta.get(fila.id) ?? [],
}));

const { validas, informe } = validarPreguntas(armadas);

const detalleDescartes = informe.detalle.map((d) => `  - pregunta ${d.id}: ${d.motivos.join('; ')}`);

// Una instantanea vacia es peor que no tener instantanea: el dia de la caida el
// sitio mostraria «todavia no hay preguntas» con toda naturalidad, y nadie sabria
// que lo que fallo fue el respaldo. No se escribe, y la anterior se queda.
if (validas.length === 0) {
  veredicto(
    'NO SE GENERO  ***  EL BANCO NO TRAJO NI UNA PREGUNTA  ***',
    [
      `Base consultada: ${base} (${remoto ? 'nube' : 'local'})`,
      `Leidas: ${informe.leidas} · descartadas por la validacion: ${informe.descartadas}`,
      ...detalleDescartes,
      '',
      'No se escribio nada. La instantanea anterior, si existia, sigue como estaba:',
      'una copia desactualizada sirve, una copia vacia no.',
    ],
    NO_GENERADA
  );
}

// ---------------------------------------------------------------------------
// Ensayo: hasta aqui se leyo y se valido todo, y no se escribe nada
// ---------------------------------------------------------------------------

if (ensayo) {
  veredicto(
    'ENSAYO CORRECTO  ***  NO SE ESCRIBIO NADA  ***',
    [
      `Base consultada  ${base} (${remoto ? 'nube' : 'local'})`,
      `Preguntas listas ${validas.length}`,
      `Alternativas     ${validas.reduce((n, p) => n + p.alternativas.length, 0)}`,
      ...(informe.descartadas
        ? [`Descartadas por la validacion: ${informe.descartadas}`, ...detalleDescartes]
        : ['Descartadas por la validacion: ninguna']),
      '',
      'Se leyo la base, se armaron las preguntas con sus alternativas y pasaron por',
      'la misma validacion que el extremo. El archivo versionado NO se toco.',
    ],
    GENERADA
  );
}

// ---------------------------------------------------------------------------
// Escribir
// ---------------------------------------------------------------------------

const sello = {
  base,
  entorno: remoto ? 'nube' : 'local',
  generada_en: new Date().toISOString(),
  preguntas: validas.length,
  descartadas: informe.descartadas,
};

/**
 * JSON incrustado en un modulo ES.
 *
 * U+2028 y U+2029 son legales dentro de una cadena JSON y hasta ES2019 no lo eran
 * dentro de una cadena de JavaScript. Se escapan para que un salto de linea
 * exotico en una pregunta no rompa el archivo en un navegador viejo.
 */
const comoJs = (valor) =>
  JSON.stringify(valor, null, 2).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const contenido = `/**
 * INSTANTANEA DEL BANCO DE PREGUNTAS · ARCHIVO GENERADO, NO SE EDITA A MANO.
 *
 * Lo escribe scripts/generar-instantanea.mjs. Para cambiarlo, se cambia el banco
 * en D1 y se vuelve a generar; editarlo aqui produce un respaldo que no
 * corresponde a ninguna base y nadie se entera.
 *
 * Es el respaldo de ADR-008: el navegador lo carga cuando la capa de datos no
 * responde, y el sitio avisa al estudiante de que puede no estar al dia. Ese
 * aviso sale del SELLO de abajo.
 *
 * Trae las respuestas correctas a proposito (ADR-022): un modo degradado que no
 * puede corregir no sirve de nada.
 */

/** Contra que base se genero, y cuando. La fuente del aviso al estudiante. */
export const SELLO = ${comoJs(sello)};

/** El banco, con la misma forma que devuelve /api/preguntas. */
export const PREGUNTAS = ${comoJs(validas)};
`;

writeFileSync(SALIDA, contenido, 'utf8');

const relativo = SALIDA.slice(RAIZ.length + 1).replace(/\\/g, '/');

veredicto(
  'INSTANTANEA GENERADA',
  [
    `Archivo   ${relativo}`,
    `Base      ${sello.base} (${sello.entorno})`,
    `Generada  ${sello.generada_en}`,
    `Preguntas ${sello.preguntas}`,
    ...(informe.descartadas
      ? [
          `Descartadas por la validacion: ${informe.descartadas}`,
          ...detalleDescartes,
          '',
          'Las descartadas NO estan en la instantanea, igual que no salen por el',
          'extremo. Si no deberian faltar, arregla el banco y vuelve a generar.',
        ]
      : []),
    ...(remoto
      ? [
          '',
          'ADR-023: la instantanea y el respaldo de ADR-014 salen del mismo dato y',
          'en el mismo acto. Si vienes de editar el banco, exporta tambien',
          'd1/respaldo-banco.sql antes de publicar. Un solo paso produce las dos',
          'cosas, o no produce ninguna.',
        ]
      : [
          '',
          'OJO: esta instantanea sale de la base LOCAL, o sea del banco de juguete.',
          'Sirve para probar el modo degradado, NO para publicar. La que se versiona',
          'se genera desde la nube y la corre el autor (ADR-023).',
        ]),
  ],
  GENERADA
);
