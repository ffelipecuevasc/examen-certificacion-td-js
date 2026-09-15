/**
 * La memoria del avance del estudiante (iteracion 33, ADR-034).
 *
 * Unico lugar del navegador que guarda algo. Los componentes no tocan
 * `localStorage` por su cuenta: piden por aca y reciben siempre la misma forma,
 * venga de un navegador que guarda o de uno que se niega.
 *
 * QUE SE GUARDA, Y QUE NO
 *
 * Por cada modulo, y por cada pregunta respondida: **el id de la pregunta** y **el
 * texto de la alternativa elegida**. Nada mas. En particular **no se guarda el
 * veredicto** —si acerto o fallo—: eso se recalcula contra el banco vigente cada
 * vez que se restaura, y por eso una correccion del banco no puede dejar en pie una
 * felicitacion sobre una respuesta que ya no es la correcta.
 *
 * POR QUE EL ID DE LA PREGUNTA SI, Y EL DE LA ALTERNATIVA NO
 *
 * ADR-020: ninguna pregunta se borra, se retira. Su id es estable de por vida.
 * Las alternativas no: `banco:actualizar` borra las cuatro y las vuelve a insertar
 * con ids nuevos cada vez que se corrige una pregunta, aunque el cambio sea una
 * coma del enunciado (ver scripts/administrar-banco.mjs). Guardar el id de la
 * alternativa dejaria huerfano todo lo guardado sobre esa pregunta a la primera
 * correccion.
 *
 * El texto no lo falsea ningun reemplazo de filas. Tiene su precio y esta asumido:
 * si el autor corrige el texto de la alternativa que un estudiante habia elegido,
 * esa respuesta deja de coincidir y la pregunta vuelve a quedar sin responder. **Se
 * pierde una respuesta; no se afirma nada falso.**
 *
 * EL AVANCE NO SALE DEL DISPOSITIVO
 *
 * Nada de lo que hay aca viaja: no hay `fetch`, ni cookies, ni identificador de
 * estudiante. Es lo que ADR-034 fija y lo que `vision.md` exige al dejar fuera las
 * cuentas de usuario. La consecuencia se asume y se dice en la pagina: el avance no
 * se comparte entre dispositivos y se pierde al limpiar los datos del navegador.
 *
 * UNA CLAVE POR MODULO
 *
 * Y no una sola con los siete dentro, por dos motivos. «Reiniciar el modulo» borra
 * lo suyo y no puede tocar los otros seis: con una clave por modulo eso es un
 * borrado, y con una clave unica seria leer-modificar-escribir, que es justo donde
 * dos pestanas abiertas se pisan. Y un dato corrupto se lleva por delante un modulo
 * en vez de los siete.
 */

/**
 * Version del formato. Va DENTRO del dato, no en el nombre de la clave.
 *
 * Lo guardado en el navegador de un estudiante sobrevive a cualquier despliegue: el
 * dia que el formato cambie, el sitio se va a encontrar datos viejos escritos por la
 * version anterior del sitio. Con la version dentro se reconocen y se ignoran; sin
 * ella se leerian mal, que es peor que no leerlos.
 */
const VERSION = 1;

/** Prefijo de las claves. Lleva el nombre del sitio porque el origen es compartido. */
const PREFIJO = 'examen-td-js.avance.modulo-';

/** Clave con la que se prueba si este navegador deja guardar. */
const CLAVE_DE_PRUEBA = 'examen-td-js.prueba-de-escritura';

const clave = (modulo) => `${PREFIJO}${modulo}`;

/**
 * El almacen, o null si este navegador no lo permite.
 *
 * Se averigua UNA vez y se recuerda. Hay tres formas distintas de que no se pueda
 * guardar, y las tres tienen que terminar igual —en null— porque para el estudiante
 * son la misma cosa:
 *
 *   1. No existe `localStorage`.
 *   2. Existe pero leerlo lanza. Pasa en Chrome con las cookies bloqueadas: el
 *      acceso a la propiedad lanza `SecurityError`, antes de llamar a nada.
 *   3. Existe, se deja leer, y lanza al ESCRIBIR. Es la ventana privada de Safari,
 *      que da cuota cero. Por eso la prueba escribe de verdad y no se conforma con
 *      encontrar el objeto: un almacen que se deja mirar y no deja guardar habria
 *      pasado por bueno, y el estudiante se enteraria al recargar.
 */
let almacenRecordado;

function almacen() {
  if (almacenRecordado !== undefined) return almacenRecordado;

  try {
    const candidato = globalThis.localStorage;
    if (!candidato) {
      almacenRecordado = null;
      return almacenRecordado;
    }

    candidato.setItem(CLAVE_DE_PRUEBA, '1');
    candidato.removeItem(CLAVE_DE_PRUEBA);

    almacenRecordado = candidato;
  } catch {
    almacenRecordado = null;
  }

  return almacenRecordado;
}

/**
 * Si este navegador deja guardar el avance.
 *
 * Lo pregunta la pagina para decirlo en pantalla. Que no se pueda guardar **no**
 * impide estudiar: el cuestionario funciona igual y lo unico que se pierde es el
 * recuerdo entre visitas. Lo que no puede pasar es que se pierda en silencio.
 */
export const sePuedeGuardar = () => almacen() !== null;

/**
 * Lo guardado de un modulo: id de pregunta -> texto de la alternativa elegida.
 *
 * Devuelve siempre un Map, vacio si no hay nada que leer. Quien llama no tiene que
 * distinguir «no hay avance» de «no se puede leer»: en los dos casos el modulo
 * arranca en blanco, que es exactamente lo mismo que ve el estudiante.
 *
 * UN DATO QUE NO SE ENTIENDE SE IGNORA, Y NO SE AVISA
 *
 * Version desconocida, JSON roto, forma inesperada: se ignora y el modulo arranca
 * vacio. No se avisa porque hoy no hay ninguna version anterior que perder —esta es
 * la primera— y porque un aviso sobre un formato interno no le dice nada a quien
 * esta estudiando. El dia que el formato cambie, la ADR que lo cambie decide si hay
 * migracion. Esta escrito en ADR-034.
 */
export function leerAvance(modulo) {
  const vacio = new Map();
  const donde = almacen();
  if (!donde) return vacio;

  let crudo;
  try {
    crudo = donde.getItem(clave(modulo));
  } catch {
    return vacio;
  }

  if (!crudo) return vacio;

  let dato;
  try {
    dato = JSON.parse(crudo);
  } catch {
    return vacio;
  }

  // La version primero: un dato de otra version puede tener cualquier forma, y
  // mirarle los campos antes de comprobarla seria leerlo con las reglas de esta.
  if (!dato || dato.v !== VERSION) return vacio;

  // Y que el dato sea el del modulo que se pidio. Si no lo es, la clave y el
  // contenido se contradicen y no hay forma de saber cual de los dos esta bien.
  if (dato.modulo !== modulo) return vacio;

  const respuestas = dato.respuestas;
  if (!respuestas || typeof respuestas !== 'object' || Array.isArray(respuestas)) return vacio;

  const leidas = new Map();

  for (const [id, texto] of Object.entries(respuestas)) {
    const numero = Number(id);
    // Un id que no es entero o un texto que no es cadena no vienen de este sitio.
    // Se descarta la entrada, no el modulo entero: lo demas sigue siendo legible.
    if (!Number.isInteger(numero) || typeof texto !== 'string') continue;
    leidas.set(numero, texto);
  }

  return leidas;
}

/**
 * Guarda una respuesta, al responderla.
 *
 * Se guarda **al responder** y no al cambiar de modulo ni al cerrar: cerrar la
 * pestana a mitad de un modulo no puede perder nada, y la memoria no puede depender
 * de que el estudiante salga por una puerta concreta.
 *
 * Devuelve si se pudo. Quien llama no tiene que hacer nada con el `false` mas que
 * no mentir sobre el: la pagina ya dice que no se esta guardando.
 */
export function guardarRespuesta(modulo, preguntaId, texto) {
  const donde = almacen();
  if (!donde) return false;

  const respuestas = Object.fromEntries(leerAvance(modulo));
  respuestas[preguntaId] = texto;

  try {
    donde.setItem(clave(modulo), JSON.stringify({ v: VERSION, modulo, respuestas }));
    return true;
  } catch {
    // Cuota llena, o un navegador que dejo de permitirlo a mitad de sesion. No se
    // rompe nada: la respuesta esta dibujada y el estudiante sigue estudiando.
    return false;
  }
}

/**
 * Borra lo guardado de UN modulo, y solo de ese.
 *
 * Es lo que hace «Reiniciar el modulo», que es el unico control de borrado que
 * existe (decision 2 de la iteracion 33). Si este borrado no ocurriera, el boton
 * limpiaria la pantalla y el avance volveria a aparecer en la siguiente visita: un
 * boton que miente.
 */
export function borrarAvance(modulo) {
  const donde = almacen();
  if (!donde) return;

  try {
    donde.removeItem(clave(modulo));
  } catch {
    // Nada que hacer ni que decir: lo que se pedia era olvidar.
  }
}
