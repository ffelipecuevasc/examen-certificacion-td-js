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
 *
 * DOS MEMORIAS, NO UNA (decision 7 de la iteracion 34)
 *
 * Ademas de lo guardado en el navegador, este archivo mantiene **lo respondido
 * durante la visita**, en memoria y nada mas. No es un almacen de respaldo: responde
 * dos preguntas que el otro no puede responder.
 *
 *   1. **Sin almacenamiento, el sitio se queda sin memoria a mitad de la visita.**
 *      Hasta la iteracion 33 lo respondido vivia solo en el DOM, y cualquier
 *      repintado —`pintar()` reconstruye desde lo guardado— lo borraba. Con el
 *      almacen denegado eso significa responder diez preguntas y perderlas al
 *      volver de otro modulo.
 *   2. **Lo guardado no sabe de visitas.** «Respondida hace un rato» y «respondida
 *      la semana pasada» son el mismo dato ahi dentro, y la iteracion 34 las dibuja
 *      distinto: la primera muestra su justificacion desplegada y la segunda ofrece
 *      «Ver por que» (decision 6). Sin esta memoria, la distincion se perderia en el
 *      primer repintado.
 *
 * VISITA = desde que se carga la pagina hasta que se recarga o se cierra. Cambiar de
 * modulo NO la cierra: por eso vive en el modulo y no dentro de ningun componente
 * que se redibuje.
 *
 * **El formato guardado no cambia, y ADR-034 no se enmienda.** Esto no se escribe en
 * ninguna parte, no sobrevive a una recarga, y no se promete que lo haga.
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

/**
 * Clave con la que se prueba si este navegador deja guardar.
 *
 * Se escribe y se borra en cada carga de la pagina, una sola vez, ANTES de que
 * haya nada del estudiante en juego. El valor es un `'1'` fijo: la sonda no
 * guarda nada suyo, y lo que escribe deja de existir en la linea siguiente.
 */
const CLAVE_DE_PRUEBA = 'examen-td-js.prueba-de-escritura';

const clave = (modulo) => `${PREFIJO}${modulo}`;

/**
 * Lo respondido durante esta visita: modulo -> (id de pregunta -> texto elegido).
 *
 * Vive en el modulo, asi que dura lo que dure la carga de la pagina y ni un
 * milisegundo mas. Recargar la borra, y eso es lo correcto: lo que tiene que
 * sobrevivir a una recarga es lo guardado, que ya tiene su sitio.
 *
 * Guarda exactamente lo mismo que el almacen —id y texto— y NO el veredicto, por el
 * mismo motivo: un veredicto anotado sobrevive a la correccion que lo desmiente.
 */
const laVisita = new Map();

/** Lo de la visita para un modulo, creandolo si es la primera respuesta. */
function visitaDe(modulo) {
  if (!laVisita.has(modulo)) laVisita.set(modulo, new Map());
  return laVisita.get(modulo);
}

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
 *   3. Existe, se deja leer, y lanza al ESCRIBIR. Es el almacen que esta ahi pero
 *      no acepta escrituras: lleno —`QuotaExceededError`—, o una configuracion que
 *      deniega el guardado a este origen sin quitar el objeto de en medio, como
 *      «Bloquear todas las cookies» en Safari.
 *
 * POR QUE LA SONDA ESCRIBE DE VERDAD, Y SE CONSERVA
 *
 * Porque el caso 3 no se ve de ninguna otra forma. Encontrar el objeto y leerlo no
 * distingue un almacen sano de uno que no admite una sola escritura mas, y esa
 * diferencia solo aparece al intentarla: sin sonda, el sitio daria por bueno el
 * almacen, prometeria memoria y el estudiante se enteraria al recargar, que es
 * justo el fallo silencioso que ADR-034 no admite.
 *
 * Lo que la sonda NO detecta, y conviene no atribuirle: la ventana privada. Desde
 * Safari 11 el `localStorage` de las sesiones efimeras vive en memoria (WebKit
 * 157010), asi que en navegacion privada —Safari, Chrome o Firefox— se lee y se
 * escribe con normalidad; lo que no hace es sobrevivir al cierre de la ventana.
 * Para la sonda ese navegador SI guarda, y es correcto que lo diga: mientras la
 * ventana siga abierta, el avance se recuerda de verdad.
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
 * Lo respondido de un modulo: id de pregunta -> texto de la alternativa elegida.
 *
 * Devuelve siempre un Map, vacio si no hay nada que leer. Quien llama no tiene que
 * distinguir «no hay avance» de «no se puede leer»: en los dos casos el modulo
 * arranca en blanco, que es exactamente lo mismo que ve el estudiante.
 *
 * JUNTA LAS DOS MEMORIAS, Y LA DE LA VISITA MANDA
 *
 * Primero lo guardado en el navegador y encima lo respondido en esta visita. El
 * orden no es indiferente: si el estudiante volvio a responder una pregunta hoy,
 * la respuesta de hoy es la que vale. Y sin almacenamiento, la de la visita es la
 * unica que hay, que es lo que permite que responder siga sirviendo de algo en un
 * navegador que no deja guardar.
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
  const leidas = leerLoGuardado(modulo);

  for (const [id, texto] of visitaDe(modulo)) leidas.set(id, texto);

  return leidas;
}

/**
 * Los ids que el estudiante respondio EN ESTA VISITA, en este modulo.
 *
 * Es lo que separa «respondida hace un rato» de «respondida otro dia», y esa
 * diferencia se dibuja: la primera muestra su justificacion desplegada y la segunda
 * ofrece «Ver por que» (decision 6 de la iteracion 34).
 *
 * Se devuelve una copia para que quien la mire no pueda cambiarla: la unica forma de
 * entrar en esta memoria es respondiendo.
 */
export function respondidasEnLaVisita(modulo) {
  return new Set(visitaDe(modulo).keys());
}

/** Lo que hay en el almacen del navegador, sin lo de la visita. */
function leerLoGuardado(modulo) {
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
 * Devuelve si se pudo GUARDAR. Quien llama no tiene que hacer nada con el `false`
 * mas que no mentir sobre el: la pagina ya dice que no se esta guardando.
 *
 * **Lo de la visita se anota siempre, incluso cuando devuelve `false`.** Son dos
 * memorias con dos promesas distintas: la del navegador promete sobrevivir a la
 * recarga y puede negarse; la de la visita promete durar lo que dure la pagina y no
 * se niega nunca. Un navegador que no deja guardar no tiene por que dejar al
 * estudiante sin lo que acaba de responder mientras sigue ahi.
 */
export function guardarRespuesta(modulo, preguntaId, texto) {
  // Primero la visita, y a proposito: es la que no puede fallar, y el `return` de
  // mas abajo se va sin anotar nada si se deja para el final.
  visitaDe(modulo).set(preguntaId, texto);

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
 *
 * **Borra las dos memorias** (decision 7 de la iteracion 34). Si dejara viva la de
 * la visita, reiniciar un modulo sin almacenamiento no borraria nada en absoluto, y
 * con almacenamiento las respuestas volverian al primer repintado. El mismo boton
 * que miente, por el otro lado.
 */
export function borrarAvance(modulo) {
  laVisita.delete(modulo);

  const donde = almacen();
  if (!donde) return;

  try {
    donde.removeItem(clave(modulo));
  } catch {
    // Nada que hacer ni que decir: lo que se pedia era olvidar.
  }
}
