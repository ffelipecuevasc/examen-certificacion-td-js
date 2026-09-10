/**
 * Convierte un modulo de los dos bancos de origen al formato de encargo (iteracion 25).
 *
 *   node scripts/convertir-banco.mjs 2
 *   node scripts/convertir-banco.mjs 2 --salida=d1/encargos/modulo-02.json
 *
 * ESTE GUION NO COMPRUEBA NADA, Y ES A PROPOSITO
 *
 * La comprobacion vive en `scripts/comprobar-conversion.mjs`, que NO importa una
 * sola linea de este archivo. Si compartieran codigo compartirian el punto ciego:
 * un convertidor y su comprobador escritos por la misma mano desde el mismo
 * entendimiento se confirman el uno al otro en vez de contrastarse.
 *
 * Por eso aca no hay ni una funcion exportada. Lo unico que cruza de un lado al
 * otro es el archivo de encargo, que es el producto, y los archivos de origen,
 * que el comprobador vuelve a leer por su cuenta.
 *
 * LO QUE ESTE GUION NO ESCRIBE
 *
 * `justificacion` sale NULL y `dificultad` sale ausente, SIEMPRE. No existen en
 * ninguno de los dos bancos, asi que no se pueden convertir: hay que escribirlas.
 * Rellenarlas para que la validacion pase es exactamente lo que costo descartar un
 * trabajo entero en este proyecto —39 preguntas marcadas «dificil» sin que nadie
 * las clasificara, y «Pendiente de redaccion» como justificacion—, y por eso la
 * regla de la iteracion 25 empieza diciendo que ningun campo ausente se rellena.
 *
 * En consecuencia el encargo sale entero en `estado: "borrador"`. Las
 * justificaciones se redactan aparte, las revisa el autor, y un segundo paso las
 * inyecta y pasa a `activa` solo las revisadas.
 *
 * LAS DOS CONVERSIONES
 *
 *   Banco nuevo (json_2026)   `correcta` es una LETRA      -> es_correcta en esa letra
 *   Banco viejo (js_2026)     `correcta` es un INDICE 0-3  -> letra por posicion
 *
 * La segunda es donde puede colarse un desplazamiento silencioso, y por eso el
 * comprobador no verifica la regla: verifica el TEXTO de la correcta.
 *
 * NUMERO_ORIGEN DEL BANCO VIEJO
 *
 * Es la POSICION en la lista, porque ese archivo no tiene ningun identificador
 * propio. Es un dato que este proyecto ya vio moverse —la pregunta con `fijo` paso
 * de la posicion 13 a la 11 cuando los retiros corrieron el indice—, asi que
 * `static/js/data/cuestionario.js` no se edita entre la conversion y la carga.
 * Esta escrito en el archivo de la iteracion, no solo aca.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { huellaDeOrigenes } from './procedencia.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CUESTIONARIOS = join(RAIZ, '_planmaestro', '00_producto', 'cuestionarios');
const BANCO_VIEJO = join(RAIZ, 'static', 'js', 'data', 'cuestionario.js');

/** Las cuatro letras, en su orden. El indice del banco viejo se traduce por aca. */
const LETRAS = ['a', 'b', 'c', 'd'];

const raya = '='.repeat(72);

function morir(motivo, detalle = []) {
  console.log(`\n${raya}\nNO SE CONVIRTIO\n${raya}`);
  console.log(motivo);
  for (const linea of detalle) console.log(linea);
  console.log('\ncodigo de salida: 1\n');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2);
const modulo = Number(argumentos.find((a) => /^\d+$/.test(a)));

if (!Number.isInteger(modulo) || modulo < 2 || modulo > 8) {
  morir('Falta el numero de modulo, y tiene que estar entre 2 y 8.', [
    '',
    '  node scripts/convertir-banco.mjs 2',
  ]);
}

const conSalida = argumentos.find((a) => a.startsWith('--salida='));
const salida = resolve(
  RAIZ,
  conSalida ? conSalida.slice('--salida='.length) : `d1/encargos/modulo-0${modulo}.json`
);

// ---------------------------------------------------------------------------
// Banco nuevo: json_2026
// ---------------------------------------------------------------------------

const rutaNuevo = join(CUESTIONARIOS, `modulo-0${modulo}.json`);

if (!existsSync(rutaNuevo)) morir(`No existe «${rutaNuevo}».`);

let bancoNuevo;

try {
  bancoNuevo = JSON.parse(readFileSync(rutaNuevo, 'utf8'));
} catch (error) {
  morir(`«modulo-0${modulo}.json» no es JSON valido.`, ['', error.message]);
}

const desdeNuevo = bancoNuevo.map((p, i) => {
  // La correcta viene como letra. Se comprueba que esa letra exista entre las
  // alternativas en vez de darlo por hecho: si el archivo dijera «e», o una letra
  // que no esta, la pregunta saldria sin ninguna correcta y la validacion de
  // escritura lo diria despues, lejos de la causa.
  const tieneLaLetra = p.alternativas.some((a) => a.letra === p.correcta);

  if (!tieneLaLetra) {
    morir(
      `La pregunta ${i + 1} de modulo-0${modulo}.json dice que la correcta es la ` +
        `letra «${p.correcta}», y no hay ninguna alternativa con esa letra.`
    );
  }

  return {
    modulo: p.modulo,
    origen: 'json_2026',
    numero_origen: p.numero,
    enunciado: p.enunciado,
    justificacion: null,
    orden_fijo: false,
    estado: 'borrador',
    alternativas: p.alternativas.map((a, j) => ({
      letra: a.letra,
      orden: j + 1,
      texto: a.texto,
      es_correcta: a.letra === p.correcta,
    })),
  };
});

// ---------------------------------------------------------------------------
// Banco viejo: js_2026
// ---------------------------------------------------------------------------

const { cuestionario } = await import(`file://${BANCO_VIEJO}`);

const grupo = cuestionario.find((g) => Number(g.modulo.replace(/\D/g, '')) === modulo);

if (!grupo) morir(`El banco viejo no tiene ningun grupo para el modulo ${modulo}.`);

const desdeViejo = grupo.preguntas.map((p, i) => {
  // El indice tiene que ser un entero dentro de las cuatro alternativas. Un
  // indice fuera de rango daria una pregunta sin correcta, en silencio.
  if (!Number.isInteger(p.correcta) || p.correcta < 0 || p.correcta >= p.opciones.length) {
    morir(
      `La pregunta ${i + 1} del modulo ${modulo} del banco viejo trae ` +
        `correcta = ${p.correcta}, que no es un indice valido de sus ${p.opciones.length} opciones.`
    );
  }

  return {
    modulo,
    origen: 'js_2026',
    // La POSICION, que es lo unico que ese archivo tiene. Ver la cabecera.
    numero_origen: i + 1,
    enunciado: p.q,
    justificacion: null,
    orden_fijo: p.fijo === true,
    estado: 'borrador',
    alternativas: p.opciones.map((texto, j) => ({
      letra: LETRAS[j],
      orden: j + 1,
      texto,
      es_correcta: j === p.correcta,
    })),
  };
});

// ---------------------------------------------------------------------------
// Escribir el encargo
// ---------------------------------------------------------------------------

const preguntas = [...desdeNuevo, ...desdeViejo];

/**
 * El sello de procedencia (ADR-028).
 *
 * Deja escrito en el encargo de que version de los cuatro origenes salio. Los
 * pasos siguientes lo cotejan contra los archivos de hoy y se niegan a seguir si
 * alguno se movio — que es lo que convierte «hay que acordarse de reconvertir»
 * en «no se puede seguir sin reconvertir».
 */
const procedencia = await huellaDeOrigenes(modulo, RAIZ);

mkdirSync(dirname(salida), { recursive: true });
writeFileSync(salida, `${JSON.stringify({ procedencia, preguntas }, null, 2)}\n`, 'utf8');

const conOrdenFijo = preguntas.filter((p) => p.orden_fijo);

console.log(`\n${raya}\nCONVERTIDO\n${raya}`);
console.log(`Modulo:    ${modulo}`);
console.log(`Salida:    ${salida.replace(RAIZ, '.')}`);
console.log('');
console.log(`  json_2026  ${String(desdeNuevo.length).padStart(3)} preguntas`);
console.log(`  js_2026    ${String(desdeViejo.length).padStart(3)} preguntas`);
console.log(`  TOTAL      ${String(preguntas.length).padStart(3)} preguntas`);
console.log('');
console.log(`  justificacion  NULL en las ${preguntas.length}, sin excepcion`);
console.log(`  dificultad     ausente en las ${preguntas.length}, sin excepcion`);
console.log(`  estado         borrador en las ${preguntas.length}, sin excepcion`);
console.log(`  orden_fijo     ${conOrdenFijo.length} pregunta(s)`);

for (const p of conOrdenFijo) {
  console.log(`                 ${p.origen} n.o ${p.numero_origen}: ${p.enunciado.slice(0, 52)}...`);
}

console.log('');
console.log('Esto NO esta comprobado todavia. Lo comprueba, leyendo los archivos de');
console.log('origen por su cuenta y sin compartir una linea con este guion:');
console.log('');
console.log(`  node scripts/comprobar-conversion.mjs ${modulo}`);
console.log('');
console.log('codigo de salida: 0\n');
