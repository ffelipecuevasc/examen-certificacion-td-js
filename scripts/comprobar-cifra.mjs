/**
 * Comprueba que la cifra de preguntas que publica la portada diga lo mismo que la
 * instantanea versionada.
 *
 *   node scripts/comprobar-cifra.mjs
 *   node scripts/comprobar-cifra.mjs --sabotaje=<cual>
 *
 * POR QUE EXISTE
 *
 * Porque la portada dijo **21** durante todo el llenado del banco, con 368 preguntas
 * dentro, y nadie lo noto. No fue un descuido puntual: el numero estaba escrito a
 * mano y **ninguna comprobacion tenia el deber de mirarlo**. `npm run verificar`
 * revisaba la barrera, el CSS, la instantanea contra el respaldo, el escapado y las
 * restricciones del esquema; lo que el estudiante lee en la primera pantalla, no.
 *
 * Esta es la mitad que vigila de la decision 4 bis de la iteracion 36. La otra
 * mitad —reescribir la cifra al regenerar la instantanea— vive en
 * scripts/cifra-portada.mjs y la llaman publicar-banco.mjs y generar-instantanea.mjs.
 *
 * CONTRA QUE SE COMPARA
 *
 * Contra `static/js/data/instantanea-banco.js`, no contra D1. Por el mismo motivo
 * que eligio comprobar-instantanea.mjs: asi corre **en local, sin credenciales y sin
 * red**, y puede vivir dentro de `npm run verificar` y correr siempre. Una
 * comprobacion que necesita la nube solo la puede correr el autor, y una
 * comprobacion que hay que acordarse de correr es la que no se corre.
 *
 * LO QUE ESTO NO DICE
 *
 * Que la cifra coincida con lo que hay HOY en produccion. La instantanea puede
 * haberse quedado atras, y entonces las dos estarian de acuerdo en un numero viejo.
 * Eso lo cubre el procedimiento de publicacion, no este guion.
 *
 * SE PRUEBA ROMPIENDOLO (H-023)
 *
 *   --sabotaje=desfasada   la portada dice otro numero que la instantanea
 *   --sabotaje=sin-marca   se le quitan las marcas data-cifra-banco a la portada
 *   --sabotaje=discrepan   las dos cifras de la portada dicen cosas distintas
 *   --sabotaje=sello-local la instantanea trae sello «local», con la cifra correcta
 *
 * Los cuatro se aplican **sobre la copia en memoria**: los tres primeros sobre el
 * HTML leido, el cuarto sobre el sello leido. Este guion no escribe en ningun
 * archivo, ni siquiera saboteado: no tiene ninguna llamada de escritura.
 *
 * Codigos de salida:
 *   0  COINCIDE
 *   1  NO COINCIDE      hay algo que arreglar antes de publicar
 *   2  SIN VEREDICTO    no se pudo comprobar. NO es un aprobado
 */
import { existsSync, readFileSync } from 'node:fs';

import {
  PORTADA,
  RAIZ,
  cifraDeLaInstantanea,
  cifrasEnHtml,
  formasReconocidas,
  selloPublicable,
} from './cifra-portada.mjs';

const COINCIDE = 0;
const NO_COINCIDE = 1;
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
    [
      motivo,
      ...(detalle.length ? ['', ...detalle] : []),
      '',
      'No se pudo comparar, que no es lo mismo que que coincidan.',
    ],
    SIN_VEREDICTO
  );

const argumentos = process.argv.slice(2);
const conSabotaje = argumentos.find((a) => a.startsWith('--sabotaje='));
const sabotaje = conSabotaje ? conSabotaje.slice('--sabotaje='.length) : null;
const SABOTAJES = ['desfasada', 'sin-marca', 'discrepan', 'sello-local'];

if (sabotaje && !SABOTAJES.includes(sabotaje)) {
  sinVeredicto(`No conozco el sabotaje «${sabotaje}».`, [`Los que hay: ${SABOTAJES.join(', ')}`]);
}

// ---------------------------------------------------------------------------
// Leer las dos partes
// ---------------------------------------------------------------------------

if (!existsSync(PORTADA)) sinVeredicto(`No existe ${PORTADA.replace(RAIZ, '.')}.`);

const instantanea = await cifraDeLaInstantanea();

if (instantanea.error) sinVeredicto(instantanea.error);

const enLaInstantanea = instantanea.cifra;
// `sello` es lo unico que un sabotaje toca de este lado, asi que es lo unico que
// se declara mutable. La cifra no se altera nunca: los sabotajes de la cifra van
// sobre el HTML.
let sello = instantanea.sello;

let html = readFileSync(PORTADA, 'utf8');

// --- El sabotaje, sobre la copia en memoria ---------------------------------
let queSeRompio = null;

if (sabotaje === 'desfasada') {
  html = html.replace(/(data-cifra-banco[^>]*\bdata-count=")(\d+)(")/, `$1${enLaInstantanea + 47}$3`);
  html = html.replace(/(<span data-cifra-banco\s*>)(\d+)(<\/span>)/, `$1${enLaInstantanea + 47}$3`);
  queSeRompio = `la portada dice ${enLaInstantanea + 47} y la instantanea trae ${enLaInstantanea}`;
}

if (sabotaje === 'sin-marca') {
  html = html.replace(/data-cifra-banco\s*/g, '');
  queSeRompio = 'se le quitaron a la portada todas las marcas data-cifra-banco';
}

if (sabotaje === 'discrepan') {
  html = html.replace(/(<span data-cifra-banco\s*>)(\d+)(<\/span>)/, `$1${enLaInstantanea - 3}$3`);
  queSeRompio = 'las dos cifras marcadas de la portada dicen numeros distintos';
}

if (sabotaje === 'sello-local') {
  // La portada NO se toca: la cifra sigue coincidiendo. Lo unico que cambia es de
  // donde dice venir la instantanea. Es el caso que este sabotaje existe para
  // cazar, y el que antes pasaba en verde.
  sello = { ...sello, entorno: 'local' };
  queSeRompio = `el sello quedo diciendo «local» con la cifra correcta (${enLaInstantanea}) en la portada`;
}

// ---------------------------------------------------------------------------
// Comparar
// ---------------------------------------------------------------------------

const marcadas = cifrasEnHtml(html);
const problemas = [];

if (marcadas.length === 0) {
  problemas.push(
    'index.html no tiene ninguna cifra marcada con data-cifra-banco, asi que nada',
    'vigila lo que publica la portada. Formas reconocidas:',
    ...formasReconocidas().map((f) => `    ${f}`)
  );
}

for (const m of marcadas) {
  if (m.valor !== enLaInstantanea) {
    problemas.push(
      `index.html:${m.linea} (forma «${m.forma}») dice ${m.valor} y la instantanea trae ${enLaInstantanea}`
    );
  }
}

const distintas = new Set(marcadas.map((m) => m.valor));
if (distintas.size > 1) {
  problemas.push(
    `las cifras marcadas de index.html no dicen lo mismo entre si: ${[...distintas].join(', ')}`
  );
}

/**
 * LA CIFRA PUBLICADA SOLO PUEDE VENIR DE LA NUBE.
 *
 * Se comprueba aunque el numero coincida, y ese «aunque» es el punto entero:
 * cuando alguien regenera la instantanea contra la base LOCAL, la portada y la
 * instantanea quedan de acuerdo —las dos dicen diez— y la comparacion de arriba
 * no tiene nada que objetar. Lo que esta mal no es que discrepen, es que las dos
 * digan lo mismo y lo que dicen sea el banco de juguete.
 *
 * `comprobar-instantanea.mjs` ya cazaba ese estado, por el sello y por la
 * comparacion contra d1/respaldo-banco.sql. Esto no reemplaza aquello: pone el
 * aviso tambien donde el problema se ve publicado, para que quien lea la linea
 * «cifra» de `npm run verificar` no la encuentre en verde mientras la portada
 * anuncia diez preguntas.
 */
if (!selloPublicable(sello)) {
  problemas.push(
    `EL SELLO DICE «${sello?.entorno ?? '(ninguno)'}»: la cifra de la portada tiene que salir de una ` +
      'instantanea de la nube, no del banco de juguete (ADR-023). La cifra coincide, pero coincide con lo que no es.'
  );
}

// El sello no decide la cifra —manda el largo de PREGUNTAS— pero si discrepa hay que verlo.
if (sello && sello.preguntas !== enLaInstantanea) {
  problemas.push(
    `el SELLO de la instantanea dice ${sello.preguntas} y su arreglo PREGUNTAS trae ${enLaInstantanea}`
  );
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

const resumen = [
  'Portada:     index.html',
  'Instantanea: static/js/data/instantanea-banco.js',
  '',
  `  preguntas en la instantanea   ${String(enLaInstantanea).padStart(4)}`,
  ...(sello ? [`  sello                         entorno «${sello.entorno}» · generada ${sello.generada_en}`] : []),
  ...marcadas.map(
    (m) => `  index.html:${String(m.linea).padEnd(4)} (${m.forma.padEnd(8)})  ${String(m.valor).padStart(4)}`
  ),
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
      '',
      'El sabotaje se aplico sobre la copia en memoria. No se escribio ningun archivo.',
    ],
    cazado ? COINCIDE : NO_COINCIDE
  );
}

if (problemas.length) {
  veredicto(
    'NO COINCIDE  ***  la portada publica una cifra que no es la del banco  ***',
    [
      ...resumen,
      '',
      raya,
      `${problemas.length} problema(s):`,
      '',
      ...problemas.map((p) => `  ${p}`),
      '',
      'Esta es exactamente la falla que la iteracion 36 vino a cerrar: la portada',
      'decia 21 con 368 preguntas en el banco. Para arreglarlo, sin editar a mano:',
      '',
      '  npm run datos:cifra',
      '',
      'que lee la instantanea versionada y deja la portada diciendo lo mismo.',
    ],
    NO_COINCIDE
  );
}

veredicto(
  'COINCIDE  ***  la portada publica la cifra del banco  ***',
  [
    ...resumen,
    '',
    raya,
    `Las ${marcadas.length} cifras marcadas de la portada dicen ${enLaInstantanea}, que es lo que trae`,
    'la instantanea versionada.',
    '',
    'Lo que esto NO dice: que la instantanea este al dia con D1. Las dos pueden',
    'estar de acuerdo en un numero viejo. Eso lo cubre el procedimiento de',
    'publicacion, no esta comprobacion.',
  ],
  COINCIDE
);
