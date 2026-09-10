/**
 * Lee las aprobaciones del documento de revision y arma el encargo de carga.
 *
 *   node scripts/aplicar-justificaciones.mjs 2
 *
 * QUE PRODUCE
 *
 *   d1/encargos/modulo-0N.json              <- entra: la conversion pura, todo borrador
 *   d1/encargos/modulo-0N-para-cargar.json  <- sale: lo aprobado en activa, con su texto
 *
 * SON DOS ARCHIVOS A PROPOSITO. El primero es el producto de la conversion y es
 * lo que `comprobar-conversion.mjs` contrasta contra los archivos de origen: si
 * se le escribiera encima, el rastro de que la conversion fue fiel se perderia en
 * el mismo acto de completarla. El segundo es derivado y desechable: se puede
 * borrar y volver a producir en cualquier momento.
 *
 * LAS TRES COSAS QUE ESTE GUION TIENE QUE HACER BIEN
 *
 * 1. NEGARSE SI EL DOCUMENTO Y EL ENCARGO DEJARON DE COINCIDIR.
 *
 *    Una marca de aprobacion vale para UN par pregunta-justificacion concreto. Si
 *    despues de aprobarse cambio cualquiera de los dos, arrastrar la marca seria
 *    heredar un visto bueno que nadie dio sobre el texto que hay hoy. Aca se para
 *    y se dice cual, en vez de suponer. Se comprueban tres divergencias:
 *
 *      - la pregunta del documento contra la del encargo   (¿se reconvirtio?)
 *      - el texto del documento contra su propio sello     (¿se edito a mano?)
 *      - el texto del documento contra el JSON de origen   (¿cambio la fuente?)
 *
 *    Las tres paran. Ninguna se arregla adivinando: se arreglan regenerando el
 *    documento, que devuelve a cero las casillas de lo que cambio.
 *
 * 2. QUE VIAJE EL TEXTO APROBADO, Y NO OTRO.
 *
 *    La justificacion que queda en la base es, byte a byte, la que el autor leyo
 *    y marco en el documento. No se reconstruye desde el JSON, no se normaliza,
 *    no se recorta. El documento es lo que se aprobo y por eso es la fuente.
 *
 * 3. QUE SE PUEDA CORRER DOS VECES SIN HACER DANO.
 *
 *    La salida es funcion pura de las entradas, asi que la segunda corrida
 *    produce los mismos bytes. Cuando eso pasa se dice «SIN CAMBIOS» y no se
 *    reescribe el archivo. Correrlo de nuevo no es un error ni hace falta
 *    recordar si ya se corrio.
 *
 * LO QUE NO SE APRUEBA NO SE PIERDE: SE QUEDA EN BORRADOR
 *
 * Una pregunta sin marca se carga igual, con `justificacion: null` y
 * `estado: "borrador"`. El estudiante no la ve —la vista `pregunta_activa` la
 * filtra— y pasa a activa el dia que alguien escriba y apruebe su porque. Es el
 * estado que existe para esto, y es lo contrario de inventar el campo para que la
 * validacion pase.
 *
 * COMO SE LE HACE FALLAR (H-023)
 *
 * Sobre copias, nunca sobre los archivos de verdad:
 *
 *   node scripts/aplicar-justificaciones.mjs 2 --revision=<copia con una casilla desmarcada>
 *     -> esa pregunta sale en borrador y las demas en activa
 *
 *   node scripts/aplicar-justificaciones.mjs 2 --revision=<copia con un texto alterado>
 *     -> NO SE APLICO, porque el texto ya no corresponde a la marca
 *
 * Codigos de salida:
 *   0  HECHO / SIN CAMBIOS   el encargo de carga esta al dia
 *   1  NO SE APLICO          algo dejo de coincidir; no se escribio nada
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CUESTIONARIOS = join(RAIZ, '_planmaestro', '00_producto', 'cuestionarios');

const raya = '='.repeat(72);

function veredicto(titulo, lineas, codigo) {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
}

const noSeAplico = (motivo, detalle = []) =>
  veredicto(
    'NO SE APLICO',
    [motivo, ...(detalle.length ? ['', ...detalle] : []), '', 'No se escribio nada.'],
    1
  );

const sello = (texto) => createHash('sha256').update(texto).digest('hex').slice(0, 12);

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2);
const modulo = Number(argumentos.find((a) => /^\d+$/.test(a)));

if (!Number.isInteger(modulo) || modulo < 2 || modulo > 8) {
  noSeAplico('Falta el numero de modulo, y tiene que estar entre 2 y 8.');
}

const conRevision = argumentos.find((a) => a.startsWith('--revision='));
const conSalida = argumentos.find((a) => a.startsWith('--salida='));

const rutaEncargo = join(RAIZ, 'd1', 'encargos', `modulo-0${modulo}.json`);
const rutaRevision = conRevision
  ? resolve(RAIZ, conRevision.slice('--revision='.length))
  : join(CUESTIONARIOS, 'justificaciones', `modulo-0${modulo}-revision.md`);
const rutaTextos = join(CUESTIONARIOS, 'justificaciones', `modulo-0${modulo}.json`);
const rutaSalida = conSalida
  ? resolve(RAIZ, conSalida.slice('--salida='.length))
  : join(RAIZ, 'd1', 'encargos', `modulo-0${modulo}-para-cargar.json`);

for (const [que, ruta] of [['el encargo', rutaEncargo], ['el documento de revision', rutaRevision], ['el JSON de justificaciones', rutaTextos]]) {
  if (!existsSync(ruta)) noSeAplico(`No existe ${que}: ${ruta.replace(RAIZ, '.')}`);
}

const encargo = JSON.parse(readFileSync(rutaEncargo, 'utf8'));
const fuente = JSON.parse(readFileSync(rutaTextos, 'utf8'));
const textosJson = fuente.justificaciones ?? {};
const documento = readFileSync(rutaRevision, 'utf8');

// ---------------------------------------------------------------------------
// Leer el documento
//
// Se PARSEA el bloque en vez de volver a dibujarlo para compararlo. Dibujarlo de
// nuevo obligaria a repetir aqui el formateador del generador, y dos copias del
// mismo formateador acaban divergiendo en un espacio que nadie ve. Parseando, lo
// que se compara son los datos.
// ---------------------------------------------------------------------------

const INICIO = '<!-- justificacion:inicio -->';
const FIN = '<!-- justificacion:fin -->';

/** Deshace el escapado que el generador aplica solo para que el markdown se lea. */
const comoEstaEnElDato = (t) => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const bloques = new Map();

for (const trozo of documento.split('<!-- pregunta: ').slice(1)) {
  const cabecera = trozo.slice(0, trozo.indexOf('-->'));
  const clave = cabecera.split('|')[0].trim();

  const desde = trozo.indexOf(INICIO);
  const hasta = trozo.indexOf(FIN);

  if (desde === -1 || hasta === -1) {
    noSeAplico(`El bloque de ${clave} no tiene las marcas de justificacion.`);
  }

  const cuerpo = trozo.slice(trozo.indexOf('-->') + 3, desde);
  const alternativas = [];
  let enunciado = null;

  for (const linea of cuerpo.split('\n')) {
    const alt = linea.match(/^- `\((.)\)` (.*)$/);

    if (alt) {
      const esCorrecta = alt[2].endsWith('**← correcta**');
      alternativas.push({
        letra: alt[1],
        texto: comoEstaEnElDato(esCorrecta ? alt[2].slice(0, -'  **← correcta**'.length) : alt[2]),
        es_correcta: esCorrecta,
      });
      continue;
    }

    const limpia = linea.trim();
    if (enunciado === null && limpia.length > 0 && !limpia.startsWith('>') && !limpia.startsWith('<!--')) {
      enunciado = comoEstaEnElDato(limpia);
    }
  }

  bloques.set(clave, {
    enunciado,
    alternativas,
    justificacion: trozo.slice(desde + INICIO.length, hasta).trim(),
    selloGenerado: (cabecera.match(/just:([0-9a-f]+)/) ?? [])[1] ?? null,
    aprobada: /^- \[x\] Aprobada/m.test(trozo.slice(hasta)),
  });
}

// ---------------------------------------------------------------------------
// 1. Negarse si algo dejo de coincidir
// ---------------------------------------------------------------------------

const divergencias = [];

for (const p of encargo.preguntas) {
  const clave = `${p.origen}#${p.numero_origen}`;
  const bloque = bloques.get(clave);

  if (!bloque) {
    divergencias.push(`${clave}: esta en el encargo y no en el documento de revision.`);
    continue;
  }

  // ¿Cambio la pregunta? Comparacion estructural contra el encargo.
  if (bloque.enunciado !== p.enunciado) {
    divergencias.push(
      `${clave}: el ENUNCIADO del documento ya no es el del encargo.\n` +
        `      documento: «${(bloque.enunciado ?? '').slice(0, 76)}»\n` +
        `      encargo:   «${p.enunciado.slice(0, 76)}»`
    );
  }

  const delEncargo = [...p.alternativas].sort((a, b) => a.orden - b.orden);

  if (bloque.alternativas.length !== delEncargo.length) {
    divergencias.push(`${clave}: el documento tiene ${bloque.alternativas.length} alternativas y el encargo ${delEncargo.length}.`);
  } else {
    delEncargo.forEach((a, i) => {
      const b = bloque.alternativas[i];
      const correctaEnEncargo = a.es_correcta === true || a.es_correcta === 1;

      if (b.letra !== a.letra || b.texto !== a.texto) {
        divergencias.push(
          `${clave}: la alternativa ${i + 1} del documento ya no es la del encargo.\n` +
            `      documento: «${b.texto.slice(0, 70)}»\n` +
            `      encargo:   «${a.texto.slice(0, 70)}»`
        );
      } else if (b.es_correcta !== correctaEnEncargo) {
        divergencias.push(`${clave}: la alternativa «${a.letra}» esta marcada correcta en uno y no en el otro.`);
      }
    });
  }

  // ¿Se edito el texto dentro del documento despues de generarlo?
  if (bloque.selloGenerado && sello(bloque.justificacion) !== bloque.selloGenerado) {
    divergencias.push(
      `${clave}: la JUSTIFICACION se edito dentro del documento despues de generarlo.\n` +
        '      La marca de aprobacion, si la hay, se dio sobre otro texto.'
    );
  }

  // ¿Cambio el JSON de origen sin regenerar el documento?
  const enJson = (textosJson[clave] ?? '').trim();

  if (enJson !== bloque.justificacion) {
    divergencias.push(
      `${clave}: la justificacion del JSON ya no es la del documento.\n` +
        '      El JSON cambio sin regenerar el documento, o al reves.'
    );
  }
}

for (const clave of bloques.keys()) {
  if (!encargo.preguntas.some((p) => `${p.origen}#${p.numero_origen}` === clave)) {
    divergencias.push(`${clave}: esta en el documento de revision y no en el encargo.`);
  }
}

if (divergencias.length > 0) {
  noSeAplico(`${divergencias.length} divergencia(s) entre el documento de revision y el encargo.`, [
    ...divergencias.map((d) => `  - ${d}`),
    '',
    'Una marca de aprobacion vale para UN par pregunta-justificacion. Si cualquiera',
    'de los dos cambio, arrastrarla seria heredar un visto bueno que nadie dio sobre',
    'el texto que hay hoy.',
    '',
    'Se arregla regenerando el documento, que devuelve a cero la casilla de lo que',
    'cambio y deja intactas las demas:',
    '',
    `  node scripts/redactar-justificaciones.mjs ${modulo}`,
  ]);
}

// ---------------------------------------------------------------------------
// 2. Que viaje el texto aprobado, y no otro
// ---------------------------------------------------------------------------

const activas = [];
const borradores = [];

const preguntas = encargo.preguntas.map((p) => {
  const bloque = bloques.get(`${p.origen}#${p.numero_origen}`);

  if (!bloque.aprobada) {
    borradores.push(p);
    // Se deja tal como salio de la conversion. Ni justificacion a medias ni
    // dificultad inventada: en borrador, ausente es la respuesta correcta.
    return { ...p, justificacion: null, estado: 'borrador' };
  }

  activas.push(p);

  return {
    ...p,
    // El texto del DOCUMENTO, que es el que se leyo y se marco. No el del JSON,
    // aunque en este punto ya se comprobo que son el mismo: si algun dia dejaran
    // de serlo, el que vale es el que alguien aprobo con los ojos.
    justificacion: bloque.justificacion,
    estado: 'activa',
  };
});

// ---------------------------------------------------------------------------
// 3. Repetible sin hacer dano
// ---------------------------------------------------------------------------

const contenido = `${JSON.stringify({ preguntas }, null, 2)}\n`;
const yaEstaba = existsSync(rutaSalida) && readFileSync(rutaSalida, 'utf8') === contenido;

if (!yaEstaba) {
  mkdirSync(dirname(rutaSalida), { recursive: true });
  writeFileSync(rutaSalida, contenido, 'utf8');
}

const resumen = [
  `Modulo:      ${modulo}`,
  `Documento:   ${rutaRevision.replace(RAIZ, '.')}`,
  `Salida:      ${rutaSalida.replace(RAIZ, '.')}`,
  '',
  `  aprobadas -> activa     ${String(activas.length).padStart(3)}   todas con su justificacion`,
  `  sin marca -> borrador   ${String(borradores.length).padStart(3)}   sin justificacion, y el estudiante no las ve`,
  `  TOTAL                   ${String(preguntas.length).padStart(3)}`,
];

if (borradores.length > 0) {
  resumen.push('');
  resumen.push('  Se quedan en borrador:');
  for (const p of borradores) {
    resumen.push(`    ${p.origen}#${p.numero_origen} · ${p.enunciado.slice(0, 58)}...`);
  }
}

veredicto(
  yaEstaba ? 'SIN CAMBIOS  ·  el encargo de carga ya estaba al dia' : 'HECHO',
  [
    ...resumen,
    '',
    ...(yaEstaba
      ? ['El archivo no se reescribio porque habria quedado identico.']
      : ['Escrito. Todavia no hay nada en la base: esto es un archivo.']),
  ],
  0
);
