/**
 * El intento del simulacro, guardado en el navegador (iteracion 41, etapa C).
 *
 * Unico lugar que escribe bajo `examen-td-js.simulacro.`. Los componentes no tocan
 * `localStorage` por su cuenta: piden por aca y reciben siempre la misma forma,
 * venga de un navegador que guarda o de uno que se niega. Es el mismo reparto de
 * papeles que `servicios/memoria.js` tiene para el cuestionario, y la sonda de
 * escritura se le pide a ese archivo en vez de escribir una segunda.
 *
 * DOS CLAVES, Y POR QUE DOS
 *
 *   examen-td-js.simulacro.preguntas    la copia congelada. Se escribe UNA vez.
 *   examen-td-js.simulacro.respuestas   todo lo que cambia. Se reescribe en cada
 *                                       respuesta.
 *
 * Medido el 2026-09-18 sobre intentos reales del banco de 368: la copia congelada
 * pesa **76,8 KiB** y la clave de respuestas llega a **12,7 KiB** con las 120
 * dentro. Un intento completo son 121 escrituras, y separadas suman **850 KiB**.
 * Con las preguntas dentro de la misma clave serian **10 056 KiB, 11,8 veces mas**,
 * y la escritura numero 120 costaria 91 556 bytes en vez de 12 996. `localStorage`
 * es sincrono y bloquea el hilo que dibuja: en un telefono modesto esa diferencia
 * se siente en cada respuesta. Por eso la decision 6 de la iteracion las separa, y
 * por eso el numero esta medido y no supuesto.
 *
 * Hay un tercer nombre **reservado y no escrito aqui**: `…simulacro.dueno`, el
 * arriendo de la pestana dueña de la iteracion 42. Va aparte porque se renueva cada
 * pocos segundos —dentro de `.respuestas` cada latido reescribiria 12,7 KiB— y
 * porque el evento `storage` dispara por clave: un oyente sobre una clave que
 * tambien cambia al responder no podria distinguir «la otra pestaña tomo el
 * intento» de «la otra pestaña respondio».
 *
 * LAS PREGUNTAS SE GUARDAN CONGELADAS, Y ESO SE APARTA DE ADR-034
 *
 * ADR-034 prohibe guardar el veredicto y prohibe anclar en el id de la alternativa,
 * porque el avance del cuestionario apunta al **banco vivo** y `banco:actualizar`
 * reinserta las cuatro alternativas con ids nuevos cada vez que se corrige una
 * pregunta. Aca no se apunta al banco vivo: se guarda **la pregunta entera tal como
 * llego**, con sus alternativas y cual era la correcta, y la respuesta apunta a esa
 * copia. Dentro de ella el id es exacto y nada lo puede reescribir.
 *
 * El motivo es la decision 6 de la iteracion 41: **el resultado se calcula con lo
 * que el estudiante vio**. Un intento que se corrigiera contra el banco de mañana
 * podria bajarle la nota a alguien por una correccion que ocurrio mientras
 * respondia. Lo que ADR-034 protege —no afirmar lo que el banco ya no sostiene— lo
 * resuelve la iteracion 44 por el otro lado: al pedir las justificaciones compara
 * con el banco vigente y **avisa** si una pregunta cambio desde el intento.
 *
 * EL RESULTADO NO SE GUARDA (decision del autor, 2026-09-18)
 *
 * No hay campo `resultado`. Las cuentas —correctas, incorrectas, omitidas— se
 * recalculan siempre desde la copia congelada y las respuestas, que ya estan las
 * dos aqui. Guardarlas seria una **segunda fuente de verdad** para un numero que ya
 * se puede derivar, y es exactamente lo que ADR-034 no admite: el dia que las dos
 * discreparan no habria forma de saber cual esta bien. La iteracion 44 conserva el
 * resumen conservando el intento terminado, no un numero aparte.
 */
import { almacenDelNavegador } from './memoria.js';

/**
 * Version del formato. Va DENTRO del dato, no en el nombre de la clave.
 *
 * Mismo motivo que en `memoria.js`: con la version en la clave, el sitio nuevo no
 * veria el dato viejo y lo dejaria ahi para siempre sin poder decidir nada sobre el.
 */
const VERSION = 1;

/** El tramo de funcionalidad de la convencion de ADR-034. */
const PREFIJO = 'examen-td-js.simulacro.';

const CLAVE_PREGUNTAS = `${PREFIJO}preguntas`;
const CLAVE_RESPUESTAS = `${PREFIJO}respuestas`;

/** Cuantas preguntas tiene un intento. Un intento con 119 no es corto: esta roto. */
const PREGUNTAS_DEL_INTENTO = 120;

/**
 * En que estado esta el guardado de ESTE intento.
 *
 *   'guardando'    la ultima escritura funciono
 *   'sin_almacen'  no hay donde guardar, o la copia congelada no se pudo escribir.
 *                  No se intenta ninguna escritura mas en todo el intento.
 *   'fallo'        una escritura de respuestas fallo despues de un comienzo bueno.
 *                  Se sigue intentando: la clave se reescribe entera, asi que una
 *                  escritura posterior que funcione deja lo guardado al dia otra vez.
 */
let estado = 'guardando';

export const estadoDelGuardado = () => estado;

/**
 * Un identificador para atar las dos claves entre si.
 *
 * No es secreto, no identifica a nadie y no sale del dispositivo: lo unico que hace
 * es permitir comprobar que la copia congelada y las respuestas son del MISMO
 * intento. Sin `crypto.randomUUID()` a proposito: la iteracion 42 pide funcionar en
 * navegadores moviles antiguos, y esto no necesita calidad criptografica.
 */
const nuevoIdDeIntento = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Escribe una clave. Devuelve si se pudo.
 *
 * Toda escritura del simulacro pasa por aqui, para que el `try` este escrito una
 * sola vez y para que no quede ninguna que se olvide de tenerlo: `localStorage`
 * lanza al llenarse, y una escritura sin guarda rompe la pagina a mitad de un
 * intento de 120 preguntas.
 */
function escribir(donde, clave, dato) {
  try {
    donde.setItem(clave, JSON.stringify(dato));
    return true;
  } catch {
    return false;
  }
}

/** Borra una clave sin hacer ruido. Lo que se pedia era olvidar. */
function borrar(donde, clave) {
  try {
    donde.removeItem(clave);
  } catch {
    // Nada que hacer ni que decir.
  }
}

/**
 * Guarda un intento recien armado: la copia congelada y el estado inicial.
 *
 * Devuelve si quedo guardado. Un `false` **no** impide jugar el intento: el
 * simulacro sigue funcionando toda la visita, y lo unico que se pierde es que
 * sobreviva a una recarga. Lo que no puede pasar es que se pierda en silencio, y de
 * eso se encarga quien llama mirando `estadoDelGuardado()`.
 *
 * NUNCA MEDIA COPIA. Si la copia congelada no se puede escribir, no se escriben las
 * respuestas tampoco —ni esta ni ninguna de las 120 siguientes—, y si las
 * respuestas fallan despues de que las preguntas hayan entrado, se borra lo que ya
 * habia quedado. Un almacen con respuestas y sin preguntas es exactamente el dato
 * que `leerIntentoGuardado()` va a descartar al recargar: escribirlo seria gastar la
 * cuota que falta en fabricar basura.
 */
export function guardarIntentoNuevo(preguntas, empezadoEn = Date.now()) {
  const donde = almacenDelNavegador();

  if (!donde) {
    estado = 'sin_almacen';
    return false;
  }

  const intentoId = nuevoIdDeIntento();

  const cabe = escribir(donde, CLAVE_PREGUNTAS, {
    v: VERSION,
    intento_id: intentoId,
    guardado_en: Date.now(),
    preguntas,
  });

  if (!cabe) {
    estado = 'sin_almacen';
    return false;
  }

  const inicial = escribir(donde, CLAVE_RESPUESTAS, {
    v: VERSION,
    intento_id: intentoId,
    empezado_en: empezadoEn,
    posicion: 0,
    comenzada_en: empezadoEn,
    terminado_en: null,
    respuestas: [],
  });

  if (!inicial) {
    borrar(donde, CLAVE_PREGUNTAS);
    estado = 'sin_almacen';
    return false;
  }

  estado = 'guardando';
  return true;
}

/**
 * Reescribe SOLO la clave de respuestas, con el avance de ahora.
 *
 * Es lo que la iteracion 43 va a llamar en cada respuesta, en cada omitida y en cada
 * avance, y lo que la 42 va a llamar cuando se agoten los 30 segundos. La copia
 * congelada **no se toca**: ese es todo el punto de que sean dos claves.
 *
 * @param {object} avance
 * @param {number} avance.posicion      indice dentro de la copia congelada
 * @param {number} avance.comenzada_en  instante en que empezo la pregunta actual
 * @param {number|null} avance.terminado_en  instante del final del intento
 * @param {object[]} avance.respuestas  una entrada por pregunta ya resuelta
 */
export function guardarAvance(avance) {
  if (estado === 'sin_almacen') return false;

  const donde = almacenDelNavegador();
  if (!donde) {
    estado = 'sin_almacen';
    return false;
  }

  const guardado = leerClave(donde, CLAVE_RESPUESTAS);
  if (!guardado) {
    // Alguien borro las claves por debajo —otra pestaña, o el propio navegador al
    // hacer sitio—. No se inventa un intento nuevo desde aqui: sin la copia
    // congelada al lado, lo que se escribiera seria media copia.
    estado = 'sin_almacen';
    return false;
  }

  const pudo = escribir(donde, CLAVE_RESPUESTAS, {
    ...guardado,
    posicion: avance.posicion,
    comenzada_en: avance.comenzada_en,
    terminado_en: avance.terminado_en ?? null,
    respuestas: avance.respuestas,
  });

  // El estado refleja la ULTIMA escritura, no la peor de todas. La clave se reescribe
  // entera, asi que una escritura que funciona deja lo guardado al dia y el aviso
  // deja de ser cierto. Dejarlo puesto para siempre seria avisar de algo que ya no
  // pasa, y un aviso que no se apaga nunca se aprende a ignorar (H-012).
  estado = pudo ? 'guardando' : 'fallo';
  return pudo;
}

/**
 * Olvida el intento guardado. Las dos claves, o ninguna.
 *
 * Lo usa «Empezar otro intento» antes de armar el siguiente, para que entre los dos
 * no exista ni un instante en que el almacen tenga la copia congelada de uno y las
 * respuestas del otro.
 */
export function olvidarElIntento() {
  const donde = almacenDelNavegador();
  if (!donde) return;

  borrar(donde, CLAVE_PREGUNTAS);
  borrar(donde, CLAVE_RESPUESTAS);
  estado = 'guardando';
}

/** Lee una clave y la devuelve interpretada, o null si no se puede entender. */
function leerClave(donde, clave) {
  let crudo;

  try {
    crudo = donde.getItem(clave);
  } catch {
    return null;
  }

  if (!crudo) return null;

  try {
    return JSON.parse(crudo);
  } catch {
    return null;
  }
}

/** Si el dato es un objeto de esta version. Se mira ANTES que cualquier campo. */
const esDeEstaVersion = (dato) =>
  Boolean(dato) && typeof dato === 'object' && !Array.isArray(dato) && dato.v === VERSION;

/** Una pregunta de la copia congelada tiene lo que hace falta para dibujarla. */
const pareceUnaPregunta = (p) =>
  Boolean(p) &&
  Number.isInteger(p.id) &&
  Number.isInteger(p.modulo) &&
  typeof p.enunciado === 'string' &&
  Array.isArray(p.alternativas) &&
  p.alternativas.length > 0 &&
  p.alternativas.every((a) => a && Number.isInteger(a.id) && typeof a.texto === 'string');

/** Una entrada de respuesta. `alternativa_id` es null si la pregunta se omitio. */
const pareceUnaRespuesta = (r) =>
  Boolean(r) &&
  Number.isInteger(r.pregunta_id) &&
  (r.alternativa_id === null || Number.isInteger(r.alternativa_id)) &&
  (r.estado === 'respondida' || r.estado === 'omitida') &&
  typeof r.agotada === 'boolean' &&
  Number.isInteger(r.resuelta_en);

/**
 * El intento guardado, o null si no hay ninguno que se pueda entender.
 *
 * EL ORDEN DE LAS COMPROBACIONES NO ES DECORATIVO
 *
 * Es el mismo de `memoria.js:leerLoGuardado()`, con un paso mas al final:
 *
 *   1. ¿hay almacen? (la sonda de ADR-034);
 *   2. `getItem` y `JSON.parse`, cada uno con su `try`;
 *   3. **la version primero**, antes de mirar ningun campo: un dato de otra version
 *      puede tener cualquier forma, y mirarle los campos con las reglas de esta es
 *      leerlo mal;
 *   4. la forma;
 *   5. **la comprobacion cruzada**: las dos claves tienen que traer el mismo
 *      `intento_id`. Son un solo intento repartido en dos, y media copia congelada
 *      con las respuestas de otro intento es la peor de las lecturas posibles.
 *
 * SE DESCARTA EL INTENTO ENTERO, NO ENTRADA POR ENTRADA. `memoria.js` descarta una
 * respuesta y conserva el resto, y ahi esta bien: una respuesta menos es una
 * respuesta menos. Aca una entrada mal formada rompe la correspondencia entre
 * `respuestas[i]` y `preguntas[i]`, y con ella la posicion pasa a mentir. Es la
 * misma regla que las reservas de la decision 4: un intento de 119 no es un intento
 * corto, es un intento roto.
 *
 * Y SE IGNORA EN SILENCIO, como manda ADR-034: hoy no existe ninguna version
 * anterior que perder —esta es la primera— y un aviso sobre un formato interno no le
 * dice nada a quien esta estudiando. Ademas, decir «tenias un intento y lo perdimos»
 * seria afirmar algo que justamente no se pudo leer.
 */
export function leerIntentoGuardado() {
  const donde = almacenDelNavegador();
  if (!donde) return null;

  const guardadas = leerClave(donde, CLAVE_PREGUNTAS);
  const avance = leerClave(donde, CLAVE_RESPUESTAS);

  if (!esDeEstaVersion(guardadas) || !esDeEstaVersion(avance)) return null;

  // La comprobacion cruzada. Va antes que la forma a proposito: si son de intentos
  // distintos, revisarles los campos es trabajo sobre algo que ya se va a descartar.
  if (
    typeof guardadas.intento_id !== 'string' ||
    guardadas.intento_id !== avance.intento_id
  ) {
    return null;
  }

  const preguntas = guardadas.preguntas;

  if (
    !Array.isArray(preguntas) ||
    preguntas.length !== PREGUNTAS_DEL_INTENTO ||
    !preguntas.every(pareceUnaPregunta)
  ) {
    return null;
  }

  const respuestas = avance.respuestas;

  if (!Array.isArray(respuestas) || !respuestas.every(pareceUnaRespuesta)) return null;

  // La posicion tiene que caer dentro del intento. Una posicion de 200 en un intento
  // de 120 no es un numero raro: es un dato que no se puede usar para dibujar nada.
  if (
    !Number.isInteger(avance.posicion) ||
    avance.posicion < 0 ||
    avance.posicion > PREGUNTAS_DEL_INTENTO ||
    respuestas.length > PREGUNTAS_DEL_INTENTO
  ) {
    return null;
  }

  if (!Number.isInteger(avance.empezado_en) || !Number.isInteger(avance.comenzada_en)) {
    return null;
  }

  return {
    intento_id: guardadas.intento_id,
    preguntas,
    respuestas,
    empezado_en: avance.empezado_en,
    posicion: avance.posicion,
    comenzada_en: avance.comenzada_en,
    terminado_en: avance.terminado_en ?? null,
  };
}
