/**
 * Comprueba que la conversion de un modulo no perdio ni altero nada (iteracion 25).
 *
 *   node scripts/comprobar-conversion.mjs 2
 *   node scripts/comprobar-conversion.mjs 2 --encargo=d1/encargos/modulo-02.json
 *
 * NO IMPORTA NI UNA LINEA DE convertir-banco.mjs, Y ESE ES EL PUNTO
 *
 * Un convertidor y su comprobador escritos por la misma mano desde el mismo
 * entendimiento comparten el mismo punto ciego: si el mapeo esta mal en los dos,
 * la comprobacion lo confirma en vez de delatarlo. Aca se vuelven a leer los
 * archivos de origen desde cero y se contrasta contra el encargo ya escrito.
 *
 * EL ANCLA ES EL TEXTO DE LA CORRECTA, NO SU LETRA NI SU INDICE
 *
 * Esta es la decision que sostiene todo el archivo. El criterio anterior de la
 * iteracion pedia «mostrar que el indice 0 quedo como letra a», y eso verifica la
 * REGLA de conversion sobre un ejemplo: si la regla esta mal, la comprobacion
 * tambien lo esta.
 *
 * El texto de la alternativa correcta es lo unico que la regla no puede falsear:
 *
 *   banco nuevo   la alternativa cuya `letra` es `correcta`  -> su texto
 *   banco viejo   `opciones[correcta]`                       -> ese texto
 *   encargo       la alternativa con `es_correcta` verdadero -> su texto
 *
 * Si los textos coinciden, la correcta no se desplazo, tenga o no razon el mapeo.
 * Un desplazamiento de una posicion cambia el texto y salta, siempre.
 *
 * LA HUELLA
 *
 * Ademas del ancla, cada pregunta se reduce a una huella calculada dos veces de
 * forma independiente —una desde el origen, otra desde el encargo—: enunciado, los
 * cuatro textos EN SU ORDEN ORIGINAL, y el texto de la correcta.
 *
 * Sin normalizar nada. Ni recortar espacios, ni unificar comillas, ni pasar a
 * minusculas. Cada normalizacion es un sitio donde se esconde un cambio
 * silencioso, y este comprobador existe para no tener ninguno.
 *
 * QUE CAZA
 *
 *   preguntas perdidas          una del origen que no esta en el encargo
 *   preguntas sobrantes         una del encargo que no esta en el origen
 *   texto alterado              un caracter distinto en enunciado o alternativa
 *   alternativas reordenadas    los cuatro textos, en su orden
 *   correcta desplazada         el ancla
 *   retiradas coladas           contra retiradas.json
 *   rastro de correcciones      contra correcciones-de-enunciado.json
 *   campos inventados           justificacion o dificultad con algo dentro
 *   orden_fijo perdido          contra el `fijo` del banco viejo
 *
 * ESTE COMPROBADOR SE PRUEBA ROMPIENDO COSAS
 *
 * `--sabotaje=<cual>` estropea el encargo en memoria a proposito y comprueba que
 * el veredicto sea negativo. Un comprobador que nunca ha dicho «no» no es un
 * comprobador. Los sabotajes son criterio de nivel 0 de la iteracion 25, y la
 * regla que los generaliza es H-023: toda comprobacion nueva hay que hacerla
 * fallar antes de creerle.
 *
 *   --sabotaje=desplazar    mueve una correcta una posicion
 *   --sabotaje=borrar       borra una pregunta
 *   --sabotaje=caracter     cambia un caracter de un enunciado
 *   --sabotaje=permutar     intercambia dos alternativas que NO son la correcta
 *   --sabotaje=correccion   anota una correccion que nunca se aplico al banco
 *
 * Codigos de salida:
 *   0  COMPROBADO      el encargo corresponde a los origenes
 *   1  NO CORRESPONDE  hay diferencias, y se listan todas
 *   2  SIN VEREDICTO   no se pudo comprobar. NO es un aprobado
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CUESTIONARIOS = join(RAIZ, '_planmaestro', '00_producto', 'cuestionarios');
const BANCO_VIEJO = join(RAIZ, 'static', 'js', 'data', 'cuestionario.js');

const raya = '='.repeat(72);

/**
 * Separador de las partes de la huella.
 *
 * Es el separador de unidades de ASCII, U+001F, elegido porque no aparece en
 * ningun texto del banco: si se usara un espacio o una barra, dos preguntas
 * distintas podrian producir la misma huella por concatenacion —un enunciado que
 * termina donde la alternativa empieza— y la comparacion daria por iguales dos
 * cosas que no lo son.
 *
 * Va como escape y no como el caracter literal: escrito literal vuelve este
 * archivo binario para git, grep y los diffs, y un guion que no se puede leer en
 * una revision no se revisa.
 */
const SEP = '\u001f';

const COMPROBADO = 0;
const NO_CORRESPONDE = 1;
const SIN_VEREDICTO = 2;

function veredicto(titulo, lineas, codigo) {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
}

const sinVeredicto = (motivo, detalle = []) =>
  veredicto(
    'SIN VEREDICTO  ***  ESTO NO ES UN APROBADO  ***',
    [motivo, ...detalle, '', 'No se pudo comprobar. Eso no es lo mismo que estar bien.'],
    SIN_VEREDICTO
  );

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2);
const modulo = Number(argumentos.find((a) => /^\d+$/.test(a)));

if (!Number.isInteger(modulo) || modulo < 2 || modulo > 8) {
  sinVeredicto('Falta el numero de modulo, y tiene que estar entre 2 y 8.', [
    '',
    '  node scripts/comprobar-conversion.mjs 2',
  ]);
}

const conEncargo = argumentos.find((a) => a.startsWith('--encargo='));
const rutaEncargo = resolve(
  RAIZ,
  conEncargo ? conEncargo.slice('--encargo='.length) : `d1/encargos/modulo-0${modulo}.json`
);

const conSabotaje = argumentos.find((a) => a.startsWith('--sabotaje='));
const sabotaje = conSabotaje ? conSabotaje.slice('--sabotaje='.length) : null;
const SABOTAJES = ['desplazar', 'borrar', 'caracter', 'permutar', 'correccion'];

if (sabotaje && !SABOTAJES.includes(sabotaje)) {
  sinVeredicto(`Sabotaje desconocido: «${sabotaje}».`, ['', `Los hay: ${SABOTAJES.join(', ')}.`]);
}

// ---------------------------------------------------------------------------
// Leer los origenes, por cuenta propia
// ---------------------------------------------------------------------------

const rutaNuevo = join(CUESTIONARIOS, `modulo-0${modulo}.json`);

if (!existsSync(rutaNuevo)) sinVeredicto(`No existe «${rutaNuevo}».`);
if (!existsSync(rutaEncargo)) {
  sinVeredicto(`No existe el encargo «${rutaEncargo.replace(RAIZ, '.')}».`, [
    '',
    `Se genera con:  node scripts/convertir-banco.mjs ${modulo}`,
  ]);
}

let bancoNuevo;
let encargo;
let retiradas;

try {
  bancoNuevo = JSON.parse(readFileSync(rutaNuevo, 'utf8'));
} catch (error) {
  sinVeredicto(`«modulo-0${modulo}.json» no es JSON valido.`, ['', error.message]);
}

try {
  encargo = JSON.parse(readFileSync(rutaEncargo, 'utf8'));
} catch (error) {
  sinVeredicto('El encargo no es JSON valido.', ['', error.message]);
}

try {
  retiradas = JSON.parse(readFileSync(join(CUESTIONARIOS, 'retiradas.json'), 'utf8'));
} catch (error) {
  sinVeredicto('No se pudo leer retiradas.json.', ['', error.message]);
}

if (!Array.isArray(encargo?.preguntas)) {
  sinVeredicto('El encargo no trae una lista «preguntas».');
}

const { cuestionario } = await import(`file://${BANCO_VIEJO}`);
const grupoViejo = cuestionario.find((g) => Number(g.modulo.replace(/\D/g, '')) === modulo);

if (!grupoViejo) sinVeredicto(`El banco viejo no tiene grupo para el modulo ${modulo}.`);

// ---------------------------------------------------------------------------
// El sabotaje, si lo hay. Estropea SOLO la copia en memoria.
// ---------------------------------------------------------------------------

let preguntas = JSON.parse(JSON.stringify(encargo.preguntas));
let queSeRompio = null;

if (sabotaje === 'desplazar') {
  // Mueve la marca de correcta una alternativa mas adelante, en circulo. Es el
  // fallo que este comprobador existe para cazar.
  const p = preguntas[0];
  const donde = p.alternativas.findIndex((a) => a.es_correcta === true || a.es_correcta === 1);
  p.alternativas[donde].es_correcta = false;
  p.alternativas[(donde + 1) % p.alternativas.length].es_correcta = true;
  queSeRompio = `la correcta de la pregunta 1 se movio de «${p.alternativas[donde].letra}» a la siguiente`;
}

if (sabotaje === 'borrar') {
  const fuera = preguntas.pop();
  queSeRompio = `se borro la ultima pregunta (${fuera.origen} n.o ${fuera.numero_origen})`;
}

if (sabotaje === 'caracter') {
  const p = preguntas[0];
  const antes = p.enunciado;
  // Cambia UN caracter. Si el comprobador normalizara algo, esto podria pasar
  // desapercibido, y por eso el sabotaje es de un solo caracter.
  p.enunciado = `${antes.slice(0, -1)}${antes.slice(-1) === '?' ? '.' : '?'}`;
  queSeRompio = 'se cambio un caracter del enunciado de la pregunta 1';
}

if (sabotaje === 'permutar') {
  const p = preguntas[0];

  // Se intercambian dos alternativas que NO son la correcta, a proposito. Si se
  // permutara la correcta, saltaria el ancla y este sabotaje no probaria nada
  // que el de «desplazar» no pruebe ya. Asi el unico que puede cazarlo es el
  // cotejo de los cuatro textos en su orden, que es lo que se quiere ejercitar.
  const incorrectas = p.alternativas.filter((a) => !(a.es_correcta === true || a.es_correcta === 1));
  const [a, b] = incorrectas;

  const guardado = a.texto;
  a.texto = b.texto;
  b.texto = guardado;
  queSeRompio =
    `se intercambiaron los textos de las alternativas «${a.letra}» y «${b.letra}» de la ` +
    'pregunta 1, NINGUNA de las cuales es la correcta';
}

// ---------------------------------------------------------------------------
// La huella. Se calcula igual desde los dos lados, pero de datos distintos.
// ---------------------------------------------------------------------------

/**
 * Reduce una pregunta a lo que no puede cambiar sin que sea otra pregunta.
 *
 * Sin normalizar NADA. El separador es un caracter que no aparece en el banco,
 * para que la union no pueda producir colisiones por concatenacion.
 */
const huella = (enunciado, textosEnOrden, textoDeLaCorrecta) =>
  [enunciado, ...textosEnOrden, `CORRECTA:${textoDeLaCorrecta}`].join(SEP);

/**
 * Muestra DONDE difieren dos textos, no solo que difieren.
 *
 * Cortar los dos por el mismo sitio deja informes en que las dos lineas se ven
 * identicas, porque la diferencia cae mas alla del corte. Pasa justo con el caso
 * mas facil de pasar por alto: un caracter cambiado al final de un enunciado
 * largo. Un informe que dice «no coincide» y ensena dos lineas iguales ensena a
 * no leer los informes, que es peor que no tenerlo.
 */
function aLaVista(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;

  const desde = Math.max(0, i - 30);
  const trozo = (s) =>
    `${desde > 0 ? '…' : ''}${s.slice(desde, i + 30)}${i + 30 < s.length ? '…' : ''}`;

  return (
    `      difieren en el caracter ${i + 1} (origen tiene ${a.length}, encargo ${b.length})\n` +
    `      origen:  «${trozo(a)}»\n` +
    `      encargo: «${trozo(b)}»`
  );
}

// --- Desde el origen -------------------------------------------------------

const esperadas = new Map();

for (const p of bancoNuevo) {
  const correcta = p.alternativas.find((a) => a.letra === p.correcta);

  if (!correcta) {
    sinVeredicto(
      `En modulo-0${modulo}.json, la pregunta numero ${p.numero} dice que la correcta ` +
        `es «${p.correcta}» y no hay alternativa con esa letra.`
    );
  }

  esperadas.set(`json_2026#${p.numero}`, {
    ref: `m0${modulo}#${p.numero}`,
    huella: huella(p.enunciado, p.alternativas.map((a) => a.texto), correcta.texto),
    orden_fijo: false,
    textoCorrecta: correcta.texto,
  });
}

grupoViejo.preguntas.forEach((p, i) => {
  esperadas.set(`js_2026#${i + 1}`, {
    ref: `M${modulo}-${i + 1}`,
    huella: huella(p.q, p.opciones, p.opciones[p.correcta]),
    orden_fijo: p.fijo === true,
    textoCorrecta: p.opciones[p.correcta],
  });
});

// --- Desde el encargo ------------------------------------------------------

const problemas = [];
const vistas = new Set();

for (const [i, p] of preguntas.entries()) {
  const clave = `${p.origen}#${p.numero_origen}`;
  const donde = `pregunta ${i + 1} del encargo (${p.origen} n.o ${p.numero_origen})`;

  if (vistas.has(clave)) {
    problemas.push(`${donde}: repetida. Ya habia otra con la misma terna.`);
    continue;
  }
  vistas.add(clave);

  const esperada = esperadas.get(clave);

  if (!esperada) {
    problemas.push(`${donde}: SOBRA. No existe en el archivo de origen.`);
    continue;
  }

  if (p.modulo !== modulo) {
    problemas.push(`${donde}: dice modulo ${p.modulo} y deberia decir ${modulo}.`);
  }

  // El ancla. Se mira aparte del resto de la huella para poder decir en el
  // informe que lo que fallo fue la correcta y no otra cosa.
  const correctas = p.alternativas.filter((a) => a.es_correcta === true || a.es_correcta === 1);

  if (correctas.length !== 1) {
    problemas.push(`${donde}: tiene ${correctas.length} alternativas marcadas como correctas, y debe tener 1.`);
  } else if (correctas[0].texto !== esperada.textoCorrecta) {
    problemas.push(
      `${donde}: LA CORRECTA NO ES LA MISMA.\n` +
        `      origen  dice: «${esperada.textoCorrecta}»\n` +
        `      encargo dice: «${correctas[0].texto}»`
    );
  }

  const suHuella = huella(
    p.enunciado,
    [...p.alternativas].sort((a, b) => a.orden - b.orden).map((a) => a.texto),
    correctas.length === 1 ? correctas[0].texto : ''
  );

  if (suHuella !== esperada.huella) {
    // Se dice en que parte difiere, porque «la huella no coincide» no sirve para
    // ir a arreglar nada.
    const izq = esperada.huella.split(SEP);
    const der = suHuella.split(SEP);
    const partes = ['enunciado', 'alternativa 1', 'alternativa 2', 'alternativa 3', 'alternativa 4', 'correcta'];

    for (let k = 0; k < partes.length; k += 1) {
      if (izq[k] !== der[k]) {
        problemas.push(`${donde}: ${partes[k]} no coincide.\n${aLaVista(izq[k] ?? '', der[k] ?? '')}`);
      }
    }
  }

  const suOrdenFijo = p.orden_fijo === true || p.orden_fijo === 1;
  if (suOrdenFijo !== esperada.orden_fijo) {
    problemas.push(
      `${donde}: orden_fijo es «${suOrdenFijo}» y el origen dice «${esperada.orden_fijo}».`
    );
  }

  // Ningun campo inventado. Es la regla que define la iteracion, y se dice en
  // terminos del ESTADO para que valga sobre los dos encargos: el que sale de la
  // conversion, todo en borrador, y el que sale de aplicar las aprobaciones.
  //
  // La regla no es «no puede haber justificacion»: es que una justificacion solo
  // existe porque una persona la escribio y la aprobo. En borrador no la hay
  // todavia, y en activa tiene que haberla.
  const tieneJustificacion = typeof p.justificacion === 'string' && p.justificacion.trim().length > 0;

  if (p.estado === 'activa' && !tieneJustificacion) {
    problemas.push(`${donde}: esta activa y no trae justificacion. El estudiante la veria sin porque.`);
  }
  if (p.estado !== 'activa' && tieneJustificacion) {
    problemas.push(`${donde}: esta en «${p.estado}» y trae justificacion. Solo las activas la tienen.`);
  }
  if (p.dificultad !== null && p.dificultad !== undefined) {
    problemas.push(`${donde}: trae dificultad «${p.dificultad}», y nadie la asigno.`);
  }
}

// --- Lo que falta ----------------------------------------------------------

for (const [clave, esperada] of esperadas) {
  if (!vistas.has(clave)) {
    problemas.push(`FALTA ${esperada.ref} (${clave}): esta en el origen y no en el encargo.`);
  }
}

// --- Las retiradas no se colaron -------------------------------------------

/**
 * El numero de modulo de una retirada, venga como venga.
 *
 * Los dos bancos lo escriben distinto dentro de retiradas.json: el nuevo pone
 * `2` y el viejo pone `"Modulo 2"`. Comparar contra el numero a secas dejaba
 * fuera las del banco viejo, y el informe decia «ninguna colada» habiendo mirado
 * un tercio de ellas. Es el fallo que este comprobador existe para no tener: una
 * comprobacion que mira menos de lo que dice, y que por eso siempre pasa.
 */
const moduloDe = (r) =>
  typeof r.modulo === 'number' ? r.modulo : Number(String(r.modulo).replace(/\D/g, ''));

const retiradasNuevo = (retiradas.banco_nuevo ?? []).filter((r) => moduloDe(r) === modulo);
const retiradasViejo = (retiradas.banco_viejo ?? []).filter((r) => moduloDe(r) === modulo);
const retiradasDelModulo = [...retiradasNuevo, ...retiradasViejo];

const enunciadosDelEncargo = new Set(preguntas.map((p) => p.enunciado));

for (const r of retiradasDelModulo) {
  // El banco nuevo guarda `enunciado`; el viejo guarda `q`. Si algun dia una
  // retirada no trajera ninguno de los dos, se dice, en vez de saltarsela: una
  // retirada que no se pudo comprobar no es una retirada comprobada.
  const enunciado = r.pregunta?.enunciado ?? r.pregunta?.q;

  if (!enunciado) {
    problemas.push(`Una retirada del modulo ${modulo} (${r.par}) no trae enunciado y no se pudo comprobar.`);
    continue;
  }

  if (enunciadosDelEncargo.has(enunciado)) {
    problemas.push(`SE COLO UNA RETIRADA: «${enunciado.slice(0, 70)}...» (${r.par}).`);
  }
}

// Los huecos de numeracion del banco nuevo tienen que ser exactamente los
// retirados. Es la comprobacion fuerte: no basta con que la retirada no este,
// tiene que faltar SU numero y ningun otro. Un hueco que nadie retiro es una
// pregunta perdida, y este proyecto ya perdio una vez la cuenta de lo que tenia.
const numerosPresentes = new Set(bancoNuevo.map((p) => p.numero));
const numerosRetirados = new Set(retiradasNuevo.map((r) => r.numero));
const mayor = Math.max(...numerosPresentes, ...numerosRetirados);

for (let n = 1; n <= mayor; n += 1) {
  if (!numerosPresentes.has(n) && !numerosRetirados.has(n)) {
    problemas.push(`HUECO SIN EXPLICAR: modulo-0${modulo}.json no tiene el numero ${n} y nadie lo retiro.`);
  }
  if (numerosPresentes.has(n) && numerosRetirados.has(n)) {
    problemas.push(`El numero ${n} figura retirado y sigue en modulo-0${modulo}.json.`);
  }
}

// ---------------------------------------------------------------------------
// El rastro de correcciones se contrasta contra el archivo de origen
//
// Desde la iteracion 25 se permite CORREGIR el texto de una pregunta, y cada
// correccion queda registrada en correcciones-de-enunciado.json con su texto
// original, el corregido y el motivo. Aca ese registro se verifica en vez de
// creerse: el original NO puede seguir apareciendo en el banco, y el corregido
// SI tiene que estar.
//
// Sin esto, el registro seria una promesa. Un registro que no se contrasta
// envejece hasta volverse ficcion: basta que alguien edite el banco sin anotarlo,
// o que anote una correccion que no llego a aplicar, para que el archivo pase a
// describir un pasado que no ocurrio. Y este archivo es lo unico que va a
// distinguir, dentro de seis meses, el testimonio original de una edicion propia.
// ---------------------------------------------------------------------------

const rutaCorrecciones = join(CUESTIONARIOS, 'correcciones-de-enunciado.json');
let correccionesDelModulo = [];

if (existsSync(rutaCorrecciones)) {
  let registro;

  try {
    registro = JSON.parse(readFileSync(rutaCorrecciones, 'utf8'));
  } catch (error) {
    sinVeredicto('correcciones-de-enunciado.json no es JSON valido.', ['', error.message]);
  }

  correccionesDelModulo = (registro.correcciones ?? []).filter((c) => c.modulo === modulo);

  // El quinto sabotaje, por H-023: la comprobacion del rastro tambien hay que
  // hacerla fallar antes de creerle. Se altera una entrada del registro en
  // memoria, simulando que alguien anoto una correccion que nunca se aplico.
  if (sabotaje === 'correccion' && correccionesDelModulo.length > 0) {
    const victima = { ...correccionesDelModulo[0] };
    victima.corregido = `${victima.corregido} ESTO NO ESTA EN EL BANCO`;
    correccionesDelModulo = [victima, ...correccionesDelModulo.slice(1)];
    queSeRompio =
      `se altero la entrada ${victima.ref} del registro de correcciones, como si ` +
      'alguien hubiera anotado un texto que nunca aplico al banco';
  }

  if (sabotaje === 'correccion' && correccionesDelModulo.length === 0) {
    sinVeredicto(`No hay correcciones registradas para el modulo ${modulo}: no hay nada que sabotear.`);
  }

  // El banco tal como esta HOY en disco, aplanado a un solo texto. Se busca sobre
  // el archivo de origen y no sobre el encargo a proposito: lo que se verifica es
  // que la correccion se aplico en la fuente, no que sobrevivio la conversion.
  const bancoEnTexto = JSON.stringify(bancoNuevo);
  const viejoEnTexto = JSON.stringify(grupoViejo);

  for (const c of correccionesDelModulo) {
    const donde = c.origen === 'js_2026' ? viejoEnTexto : bancoEnTexto;
    const enJson = (s) => JSON.stringify(s).slice(1, -1);

    if (donde.includes(enJson(c.original))) {
      problemas.push(
        `CORRECCION NO APLICADA: ${c.ref} figura corregida en el registro y su texto ORIGINAL ` +
          `sigue en el archivo de origen.\n      «${c.original.slice(0, 80)}»`
      );
    }

    if (!donde.includes(enJson(c.corregido))) {
      problemas.push(
        `CORRECCION AUSENTE: ${c.ref} figura en el registro y su texto CORREGIDO no aparece ` +
          `en el archivo de origen.\n      «${c.corregido.slice(0, 80)}»`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

const resumen = [
  `Modulo:    ${modulo}`,
  `Encargo:   ${rutaEncargo.replace(RAIZ, '.')}`,
  '',
  `  esperadas del origen   ${String(esperadas.size).padStart(3)}   (${bancoNuevo.length} json_2026 + ${grupoViejo.preguntas.length} js_2026)`,
  `  presentes en encargo   ${String(preguntas.length).padStart(3)}`,
  `  retiradas del modulo   ${String(retiradasDelModulo.length).padStart(3)}   (${retiradasNuevo.length} json_2026 + ${retiradasViejo.length} js_2026)`,
  `  huecos de numeracion         todos corresponden a una retirada`,
  `  correcciones registradas ${String(correccionesDelModulo.length).padStart(3)}   contrastadas contra el archivo de origen`,
];

if (sabotaje) {
  const titulo = problemas.length
    ? `SABOTAJE CAZADO  ·  ${sabotaje}`
    : `SABOTAJE NO CAZADO  ***  EL COMPROBADOR NO SIRVE  ***  ${sabotaje}`;

  veredicto(
    titulo,
    [
      `Se rompio a proposito: ${queSeRompio}.`,
      '',
      ...(problemas.length
        ? ['El comprobador lo dijo:', '', ...problemas.map((p) => `  - ${p}`)]
        : ['El comprobador NO dijo nada. Un comprobador que no caza esto no sirve', 'para sostener ningun criterio.']),
      '',
      'El encargo en disco no se toco: el sabotaje ocurre solo en memoria.',
    ],
    // Cazarlo es el exito. No cazarlo es el fallo.
    problemas.length ? COMPROBADO : NO_CORRESPONDE
  );
}

if (problemas.length) {
  veredicto(
    `NO CORRESPONDE  ***  ${problemas.length} diferencia(s)  ***`,
    [...resumen, '', ...problemas.map((p) => `  - ${p}`)],
    NO_CORRESPONDE
  );
}

veredicto(
  'COMPROBADO',
  [
    ...resumen,
    '',
    'Las preguntas del encargo corresponden una a una con las de los archivos de',
    'origen: mismo enunciado, mismas cuatro alternativas en el mismo orden, y la',
    'correcta anclada en su TEXTO y no en su letra ni en su indice.',
    '',
    'Lo que esto NO prueba: que lo cargado en D1 sea esto. Eso se comprueba',
    'despues de cargar, releyendo la base.',
  ],
  COMPROBADO
);
