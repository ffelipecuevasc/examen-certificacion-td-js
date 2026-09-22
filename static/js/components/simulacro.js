/**
 * El intento del simulacro: elegir, traer, guardar y recorrer.
 *
 * QUE HACE ESTE ARCHIVO, Y QUE NO
 *
 * Son las etapas B y C de la iteracion 41 mas el recorrido de la 43. Conecta
 * «Comenzar el simulacro» con la maquina que la 41 dejo montada: pide la lista de ids,
 * elige las 120 en el navegador, las viene a buscar, repone lo que falte y **las
 * guarda congeladas**. Desde la iteracion 43, al terminar de cargar **aparece la
 * primera pregunta** y el recorrido empieza. Al abrir la pagina con un intento a
 * medias, lo retoma en la pregunta donde iba.
 *
 * EL RECORRIDO ES DE ESTE ARCHIVO; EL RELOJ, DE `components/cronometros.js`; EL
 * MARCADO, DE `components/simulacro-maqueta.js`. Aqui no hay ni una clase escrita a
 * mano para la tarjeta ni una cuenta de segundos: se piden las piezas y se decide
 * cuando dibujarlas y que se escribe en el intento. El bloque «EL RECORRIDO» de mas
 * abajo lo explica entero.
 *
 * DURANTE EL INTENTO NO SE REVELA NADA. La copia congelada trae `es_correcta` de cada
 * alternativa —hace falta para el resumen de la 44—, y ni ese campo ni ninguna marca
 * de acierto llegan al HTML: la tarjeta dibuja el enunciado, las cuatro alternativas y
 * cual esta marcada, y nada mas.
 *
 * QUE SE GUARDA, Y QUIEN LO GUARDA
 *
 * El formato y las claves viven en `servicios/intento-guardado.js`, no aqui: este
 * archivo no sabe cuantas claves son ni como se llaman. Lo que si decide aqui es
 * **cuando** —al armarse el intento, antes de dibujarlo— y **que se dice** si no se
 * pudo, que es el aviso de la decision 7.
 *
 * TODO SE PIDE AL PULSAR, Y BAJO UNA SOLA TRANSICION (decision 5)
 *
 * La presentacion no pide nada: es HTML, y mientras el estudiante lee las reglas no
 * sale ni una peticion. Al pulsar salen dos —el resumen y el extremo por ids— y las
 * dos van **debajo de la misma transicion**: `abrir()` se llama UNA vez, no una por
 * peticion. Si se llamara una por peticion, el estudiante veria dos transiciones
 * encadenadas con un parpadeo entre medio y el piso de 400 ms se contaria dos
 * veces.
 *
 * EL MODO DEGRADADO NO ES OTRO CAMINO
 *
 * `leerResumen()` y `leerPreguntasPorIds()` caen solas a la instantanea cuando la
 * capa de datos no responde, y devuelven la misma forma. El algoritmo recibe ids y
 * no sabe de donde salieron. Lo unico que cambia aqui es que se mira el sello del
 * respaldo para encender el aviso de ADR-008: **el respaldo nunca se sirve en
 * silencio.**
 *
 * PERO UN INTENTO NO MEZCLA BANCOS (correccion del 2026-09-17)
 *
 * Que cada peticion caiga por su cuenta sirve para el cuestionario, donde una
 * peticion trae una pantalla. Aqui son dos, y estan atadas: de la primera salen los
 * ids y la segunda los va a buscar. Si el resumen contesta desde D1 y la peticion de
 * preguntas cae a la copia, **los ids se eligieron sobre un banco y se piden a
 * otro**. Hoy los dos bancos coinciden y no se nota; el dia que no coincidan, los
 * elegidos —y los sobrantes de donde salen las reservas— apuntan a preguntas que la
 * copia no trae, y el intento termina en «No se pudo armar el simulacro» justo
 * cuando el respaldo tenia que salvarlo.
 *
 * La regla es una sola y esta escrita abajo, en `comenzarElIntento()`: **si alguna
 * mitad sale de la copia, el intento entero se vuelve a elegir desde la copia.**
 * Vale igual para la primera peticion y para una ronda de reserva que caiga a mitad
 * de camino. El algoritmo sigue sin enterarse de nada: lo unico que cambia es de
 * donde salen los ids que recibe.
 */
import { $, esc } from '../utils/dom.js';
import {
  leerPreguntasPorIds,
  leerPreguntasPorIdsDelRespaldo,
  leerResumen,
  leerResumenDelRespaldo,
} from '../servicios/datos.js';
import {
  FALTA_MODULO,
  MODULOS_DEL_EXAMEN,
  PREGUNTAS_DEL_INTENTO,
  SIN_CANDIDATOS,
  elegirIntento,
  reponerDelModulo,
} from '../servicios/eleccion-del-intento.js';
import {
  estadoDelGuardado,
  guardarAvance,
  guardarIntentoNuevo,
  leerIntentoGuardado,
  olvidarElIntento,
} from '../servicios/intento-guardado.js';
import { reloj } from '../servicios/reloj.js';
import { crearDuenoDelIntento } from '../servicios/dueno-del-intento.js';
import { crearCronometros } from './cronometros.js';
import { crearTransicionDeCarga } from './transicion-de-carga.js';
import {
  BORDE_DEL_SIMULACRO,
  dibujarBotonesDelIntento,
  dibujarColumnaDelIntento,
  dibujarDentroDelModulo,
  dibujarPantallaDelResumen,
  dibujarRevisionDelIntento,
  dibujarTarjetaDeLaPregunta,
} from './simulacro-maqueta.js';
import { armarLaRevision, calcularResultado } from '../servicios/resultado-del-intento.js';
import { mostrarAvisoDeRespaldo } from './aviso-de-respaldo.js';
import { mostrarAvisoDeGuardado } from './aviso-de-guardado.js';

/**
 * Cuantas veces se sale a reponer antes de rendirse (decision 4).
 *
 * Reponer es pedir otra tanda al extremo, asi que cada ronda es un viaje mas con el
 * estudiante mirando la transicion. Tres es de sobra para lo que esto cubre —alguna
 * pregunta retirada entre el resumen y la peticion, alguna descartada por la
 * validacion— y a la vez es un tope: sin el, un banco alterado que descartara todo
 * lo que se pide dejaria la transicion girando para siempre, que es peor que decir
 * que no se pudo.
 */
const RONDAS_DE_RESERVA = 3;

/**
 * De donde salio cada mitad de lo que se cargo.
 *
 * Son dos peticiones y cualquiera de las dos puede haber caido a la copia por su
 * cuenta. Es lo mismo que hace `components/cuestionario.js` y por el mismo motivo:
 * el aviso tiene que aparecer si **alguna** lo hizo.
 */
const origen = { resumen: null, preguntas: null };

/**
 * El intento que se esta jugando ahora, en memoria.
 *
 * Es lo mismo que hay guardado, y existe por dos motivos. Uno: sin almacenamiento no
 * hay nada guardado, y el intento tiene que poder jugarse igual toda la visita —es
 * la decision 7, y es la misma idea que la «memoria de la visita» de ADR-034—. Dos:
 * releer 77 KiB del almacen en cada respuesta para agregarle una entrada seria
 * pagar un parseo entero por cada toque.
 *
 * `null` mientras no haya intento. No sobrevive a una recarga, y no tiene por que:
 * lo que sobrevive es lo guardado.
 */
let elIntento = null;

/**
 * Los dos cronometros del intento en curso, y el arriendo de esta pestana.
 *
 * Nulos mientras no haya intento. Viven aqui y no dentro de cada funcion porque hay
 * que poder pararlos desde otro sitio del que los encendio: «Empezar otro intento»
 * apaga los del intento viejo antes de armar el nuevo, y la pestana que pierde el
 * intento apaga los suyos sin haberlos arrancado ella.
 */
let losCronometros = null;
let elDueno = null;

/**
 * Cual alternativa esta marcada en la pregunta que se esta respondiendo, y si el
 * estudiante ya dio el primer toque de «Omitir».
 *
 * LAS DOS SE BORRAN AL CAMBIAR DE PREGUNTA, y viven aqui —y no dentro del dibujo—
 * porque el dibujo se rehace entero en cada toque: guardarlas en el HTML significaria
 * leerlas de vuelta del HTML que uno mismo escribio.
 *
 * `laMarcada` es un **id de alternativa dentro de la copia congelada**, no un indice.
 * Es lo mismo que se anota en el intento guardado, asi que no hay traduccion en el
 * camino: lo que se marca es lo que se escribe.
 *
 * CUANTO DURA LA CONFIRMACION DE OMITIR (hueco 3 de la lectura de la 43).
 * **Propuesta de Claude Code, pendiente de confirmacion del autor**, no decision
 * cerrada: se retira al marcar una alternativa —eso si lo fijo el autor en la
 * decision 1— y ademas **al cambiar de pregunta**, que es automatico porque estas dos
 * variables se borran ahi. Y nada mas: **sin plazo propio**.
 *
 * El motivo es que un plazo aqui solo puede hacer dano. La confirmacion no puede durar
 * mas que su pregunta, porque la pregunta dura 30 segundos como maximo; y un plazo mas
 * corto retiraria la confirmacion **bajo el dedo** de alguien que ya decidio omitir y
 * esta bajando a pulsar, convirtiendo su segundo toque en un primer toque otra vez. En
 * una pantalla con el reloj encima, eso es peor que dejarla puesta los segundos que le
 * queden a la pregunta.
 */
let laMarcada = null;
let confirmandoOmitir = false;

/**
 * Como lee el motor de los cronometros cual alternativa esta marcada.
 *
 * Por omision, la de arriba: es el recorrido de verdad, conectado desde la iteracion
 * 43. Sigue entrando por esta costura y no leyendose directo para que
 * `scripts/probar-cronometros.mjs` pueda provocar «se agoto CON una alternativa
 * marcada» sin fingir un clic, que es como la 42 la probo antes de que existiera la
 * tarjeta.
 */
let laAlternativaMarcada = () => laMarcada;

/** Para que un guion pueda sustituir la lectura de la tarjeta sin tocar esto. */
export function conectarLaAlternativaMarcada(comoLeerla) {
  laAlternativaMarcada = comoLeerla;
}

/**
 * Los dos bancos de los que puede salir un intento, cada uno con sus dos lecturas.
 *
 * Se nombran como pareja a proposito: lo que la correccion del 2026-09-17 protege es
 * justamente que las dos mitades salgan de la MISMA. Separarlas en cuatro funciones
 * sueltas es lo que permitio mezclarlas sin que se viera.
 *
 * `DESDE_LA_CAPA.preguntas` sigue cayendo sola a la copia si la capa no contesta:
 * eso no se toca, es ADR-008. Lo que se agrega es que despues de esa caida el
 * intento se rehace entero desde `DESDE_LA_COPIA`.
 */
const DESDE_LA_CAPA = { resumen: leerResumen, preguntas: leerPreguntasPorIds };
const DESDE_LA_COPIA = {
  resumen: leerResumenDelRespaldo,
  preguntas: leerPreguntasPorIdsDelRespaldo,
};

/**
 * Las preguntas salieron de la copia y el resumen no: los ids se eligieron sobre un
 * banco y se estan pidiendo a otro.
 *
 * El caso contrario —resumen de la copia, preguntas de la capa— no se pregunta
 * porque no puede ocurrir: `unIntentoDe()` le pide las preguntas a la copia en
 * cuanto el resumen vino de ahi.
 */
const seMezclaronLosBancos = () => Boolean(origen.preguntas) && !origen.resumen;

/**
 * Lo que devuelve `armarElIntento()` al detectar la mezcla.
 *
 * No trae `explicacion` a proposito: **no es un fracaso que se le cuente a nadie**,
 * es un aviso interno de que hay que rehacer el intento desde la copia. Si algun dia
 * se dibujara por descuido, la pantalla quedaria sin frase y se veria; con una frase
 * puesta, se veria un mensaje de error donde en realidad no hubo ninguno.
 */
const HAY_MEZCLA = { ok: false, mezcla: true };

/**
 * La transicion de esta pagina.
 *
 * `#zona-del-intento` es la parte de la pagina que se reescribe: la presentacion
 * entera. El `#aviso-respaldo` queda FUERA a proposito, un nivel mas arriba en el
 * HTML, porque si estuviera dentro la transicion lo borraria justo en el caso en
 * que hace falta.
 *
 * El unico control que se desactiva es «Comenzar»: es el unico que hace algo, y
 * pulsarlo dos veces pediria dos intentos.
 */
const transicion = crearTransicionDeCarga({
  contenedor: '#zona-del-intento',
  controles: ['#comenzar-simulacro'],
  idDelMensaje: 'mensaje-simulacro',
  idDelAvisoLento: 'carga-lenta-simulacro',
  // La UNICA diferencia de aspecto entre la transicion de las dos paginas, y entra
  // por parametro justamente para que el cuestionario siga dibujando lo suyo: la
  // pieza es una sola y la comparten (decision 9 de la iteracion 41, decision 8 de
  // la 45).
  borde: BORDE_DEL_SIMULACRO,
  textos: {
    titulo: () => 'Preparando tu simulacro…',
    detalle: 'Eligiendo tus 120 preguntas y pidiéndolas al banco.',
    lento: 'Está tardando más de lo normal. La página sigue esperando la respuesta.',
  },
});

/**
 * Lleva el foco al recuadro que se acaba de dibujar.
 *
 * Es el mismo gesto que hace el cuestionario desde la iteracion 32: quien navega
 * con teclado o con lector de pantalla pulso un boton arriba y el resultado aparece
 * abajo; sin mover el foco, se queda en un boton que ya no existe.
 */
function irAlMensaje() {
  $('#mensaje-simulacro')?.focus();
}

/**
 * Un recuadro con un titulo y un cuerpo, en la zona del intento.
 *
 * Reusa el contrato de la transicion —mismo id, mismo `tabindex="-1"`, mismo
 * recuadro— para que el foco no dependa de cual de los dos dibujo. El cuerpo llega
 * como HTML ya armado por quien llama, y quien llama solo pone texto del sitio o
 * numeros: por aqui no pasa nada del banco.
 */
function dibujarRecuadro({ titulo, cuerpo }) {
  const zona = $('#zona-del-intento');
  if (!zona) return;

  // `data-papel` dice QUE ES cada nodo, no como se ve. Los guiones leen el HTML
  // dibujado por esta marca y no por sus clases: una prueba no puede dictar la
  // apariencia, porque entonces cambiar un tamano de letra da rojo sin que nada se
  // haya roto, y se aprende a editar la prueba hasta que pase. La iteracion 45
  // reescribe estas clases enteras; el papel del nodo sigue siendo el mismo.
  zona.innerHTML = `
      <div id="mensaje-simulacro" tabindex="-1" class="bg-panel border ${BORDE_DEL_SIMULACRO} rounded-xl p-8 focus:outline-none focus:ring-2 focus:ring-jsyellow/40">
        <p data-papel="titulo-del-recuadro" class="font-display font-bold text-xl text-paper">${titulo}</p>
        ${cuerpo}
      </div>`;

  irAlMensaje();
}

// ---------------------------------------------------------------------------
// EL RECORRIDO: UNA PREGUNTA A LA VEZ (iteracion 43, tanda 1)
// ---------------------------------------------------------------------------
//
// AQUI DEJO DE DIBUJARSE «INTENTO LISTO», y esa pantalla se retiro entera. La
// decision 11 de la iteracion 41 la creo diciendo textualmente «mientras no exista el
// recorrido (43)»: era el final provisional de la carga, con la cuenta por modulo y la
// frase «todavia no se puede responder». Existiendo el recorrido, dejarla puesta seria
// darle al estudiante un recuadro sin salida **con el reloj de su primera pregunta ya
// corriendo**, porque el cronometro arranca en el instante del clic.
//
// Lo que esa pantalla probaba —que el intento trae 120 repartidas entre los siete
// modulos— no se pierde: se comprueba sobre `preguntasDelIntento()`, que es el intento
// de verdad y no un resumen dibujado de el.
//
// LA POSICION SE DICE EN DOS SITIOS Y SALE DE UNO SOLO (hueco 12 de la lectura).
// La franja la escribe `components/cronometros.js` y la tarjeta la escribe esta
// funcion, por caminos que no se tocan. El unico hecho es `elIntento.posicion`, que a
// su vez sale de contar `respuestas` en `anotarEnElIntento()`; los dos indicadores le
// suman 1 para contarlas desde la primera y ninguno guarda un contador propio. Que no
// puedan discrepar lo afirma un guion que lee LAS DOS CIFRAS DEL HTML dibujado y las
// compara en todo el recorrido.

/** La pregunta que se esta respondiendo, o `null` si ya no queda ninguna. */
function laPreguntaEnCurso() {
  if (!elIntento) return null;
  return elIntento.preguntas[elIntento.posicion] ?? null;
}

/**
 * El numero de pregunta que se muestra: la posicion contada desde 1.
 *
 * Existe para que la tarjeta no escriba `+ 1` por su cuenta. Ver el bloque de arriba.
 */
const laPosicionQueSeMuestra = () => (elIntento ? elIntento.posicion + 1 : 0);

/**
 * Si hay algun aviso encendido encima de la zona del intento.
 *
 * Decide si la columna compensa el relleno de la seccion o no. El motivo entero —y el
 * solape que provoca no hacerlo— esta escrito en `dibujarColumnaDelIntento()`.
 *
 * Se mira lo ESCRITO y ademas la clase `hidden`, por lo mismo que lo mira
 * `probar-filtrado.mjs`: un nodo que nadie toco todavia no esta oculto para nadie,
 * pero tampoco tiene nada dentro.
 */
function hayAvisoALaVista() {
  const encendido = (selector) => {
    const nodo = $(selector);
    if (!nodo) return false;
    return nodo.innerHTML !== '' && !nodo.classList.contains('hidden');
  };

  return encendido('#aviso-respaldo') || encendido('#aviso-guardado');
}

/**
 * Dibuja la pregunta en curso con sus alternativas y sus dos botones.
 *
 * NO LLAMA A `dibujarPantallaDelIntento()`, y no es un detalle de estilo: esa funcion
 * devuelve **tambien la franja**, y la franja ya vive fuera de `#zona-del-intento` y
 * la escribe `components/cronometros.js` desde la iteracion 42. Llamarla dibujaria una
 * segunda franja fija encima de la que cuenta. Se usan las tres piezas de dentro.
 *
 * EL CAMBIO DE PREGUNTA SE ANUNCIA MOVIENDO EL FOCO (decision del autor, 2026-09-18,
 * hueco 8 de la lectura de la 43), a la tarjeta nueva, que por eso lleva
 * `tabindex="-1"`. Es el mismo gesto que `irAlMensaje()` hace aqui arriba desde la
 * iteracion 32.
 *
 * Y NO SE USA `aria-live` SOBRE LA TARJETA, que era la otra salida. Con el avance
 * automatico de la iteracion 42, la pregunta cambia sola cada 30 segundos durante una
 * hora: una region viva **interrumpiria la lectura del enunciado** cada vez, y encima
 * en el peor momento, porque el enunciado es justo lo que el estudiante esta oyendo
 * cuando se acaba el plazo. Es el mismo razonamiento por el que la franja no se
 * anuncia, escrito en `simulacro.html` junto a `#franja-del-simulacro`. El foco dice
 * lo mismo sin interrumpir: lleva a quien escucha al principio de la pregunta nueva.
 *
 * `enfocar` dice DONDE queda el foco, y cada valor tiene su motivo:
 *
 *   'pregunta'  la tarjeta. Es el cambio de pregunta.
 *   'marcada'   la alternativa que se acaba de marcar. Sin esto, marcar con teclado
 *               tiraria el foco al `body`: el redibujo destruye el boton pulsado.
 *   'omitir'    el boton de omitir tras el primer toque, para que el lector lea su
 *               `aria-describedby`, que es donde esta la confirmacion.
 */
function dibujarElRecorrido({ enfocar = 'pregunta' } = {}) {
  const zona = $('#zona-del-intento');
  if (!zona) return;

  const pregunta = laPreguntaEnCurso();

  // Sin pregunta que dibujar, el intento se acabo, y aqui aparece el resumen.
  //
  // ES EL UNICO CAMINO AL RESUMEN (decision B4 de la iteracion 44). Hasta la 44 habia
  // otro, un enganche del motor de los cronometros, y la pantalla final salia dos veces
  // seguidas. Se quedo este porque es el que cubre todos los casos: la 120 resuelta con
  // «Siguiente» o agotada —las dos pasan por `anotarEnElIntento()`, que llega aqui—, la
  // recarga de un intento terminado, el intento sin arriendo y el que no se guarda, donde
  // los cronometros no llegan a arrancar. `probar-resumen.mjs` (prueba 5) cuenta que la
  // zona se escriba UNA vez en cada uno.
  if (!pregunta) {
    dibujarElResumen();
    return;
  }

  const dentro =
      dibujarTarjetaDeLaPregunta({
        pregunta,
        posicion: laPosicionQueSeMuestra(),
        total: elIntento.preguntas.length,
        marcada: laMarcada,
      }) + dibujarBotonesDelIntento({ hayMarcada: laMarcada !== null, confirmandoOmitir });

  zona.innerHTML = dibujarColumnaDelIntento(dentro, {
    pegadaAlEncabezado: !hayAvisoALaVista(),
  });

  if (enfocar === 'marcada') $('[data-papel="alternativa"][data-marcada="true"]')?.focus();
  else if (enfocar === 'omitir') $('[data-papel="omitir"]')?.focus();
  else $('[data-papel="tarjeta-de-la-pregunta"]')?.focus();
}

/**
 * El resumen del intento terminado (iteracion 44). Reemplaza a la pantalla transitoria
 * que la 43 dejo con fecha de salida.
 *
 * SE RECALCULA CADA VEZ, NO SE GUARDA (ADR-035, parte 7; decision 5 de la 44). Lo que se
 * conserva es el intento terminado; el resultado sale de su copia congelada y sus
 * respuestas en cada llamada, sea al terminar o al recargar.
 *
 * LO PRIMERO ES APAGAR (decision B4). Terminado el intento no queda nada que contar ni
 * que proteger: se sueltan el arriendo y los cronometros. Un arriendo vivo sobre un
 * intento terminado dejaria otra pestana abierta en el resumen bloqueada con «Tu
 * simulacro sigue en la otra pestaña», que ya no es verdad.
 *
 * EL BOTON LLEVA EL ID DE «COMENZAR» porque hace lo mismo —armar un intento nuevo, que
 * reemplaza a este— y porque el oyente vive en la zona y no en el boton. Lo dibuja la
 * maqueta junto con el resto de la pantalla.
 */
function dibujarElResumen() {
  laMarcada = null;
  confirmandoOmitir = false;

  elDueno?.soltar();
  pararElIntento();

  const franja = $('#franja-del-simulacro');
  if (franja) franja.innerHTML = '';

  const zona = $('#zona-del-intento');
  if (!zona || !elIntento) return;

  const resultado = calcularResultado(elIntento);

  laRevision = null;
  zona.innerHTML = dibujarPantallaDelResumen({ resultado });

  // EL FOCO VA AL TITULO DEL RESULTADO (decision B2), con el mismo gesto que el cambio
  // de pregunta: quien tenia el foco en «Siguiente» o en la tarjeta de la 120 lo acaba
  // de perder con el redibujo, y sin esto caeria al `body`. Sin `aria-live`, por lo
  // mismo que la tarjeta: el foco ya lleva a quien escucha al principio de lo nuevo.
  $('#titulo-del-resultado')?.focus();

  // Y la revision se pide DESPUES de dibujar (decision 3): el resultado sale de la copia
  // congelada y no espera a la red; la revision necesita las justificaciones y la
  // version vigente, y mientras llegan dice que se esta cargando.
  pedirLaRevision(resultado);
}

/**
 * La revision que hay en pantalla: sus bloques por modulo, y en cuales estan abiertas
 * las correctas. `null` mientras no haya.
 *
 * Vive aqui y no en el HTML por lo mismo que `laMarcada`: abrir o plegar redibuja el
 * bloque, y guardar el estado en lo dibujado seria leerlo de vuelta de lo que uno mismo
 * escribio.
 */
let laRevision = null;

/**
 * Cuantas revisiones se han pedido. Una respuesta que llega cuando ya se pidio otra
 * —o cuando se empezo otro intento— se descarta.
 *
 * NO BASTA CON MIRAR `elIntento`: al pulsar «Empezar otro intento», `elIntento` sigue
 * siendo el viejo durante toda la carga del nuevo, que es justo cuando la respuesta
 * rezagada puede llegar. La cuenta se sube al empezar, y eso si la deja fuera.
 */
let peticionDeLaRevision = 0;

/**
 * Pide las justificaciones y la version vigente por los ids del intento, en UNA
 * peticion (decisiones 3 y 8), y dibuja la revision al llegar.
 *
 * Con la capa caida, `leerPreguntasPorIds()` cae sola a la copia y la trae con sus
 * justificaciones (etapa A2), y entonces se enciende el aviso de ADR-008: el respaldo
 * nunca se sirve en silencio. Si no contesta ni la copia, la revision se dibuja igual
 * desde la copia congelada, sin justificaciones y diciendolo: el estudiante tiene que
 * poder ver que respondio aunque no se le pueda explicar por que.
 */
async function pedirLaRevision(resultado) {
  const esta = (peticionDeLaRevision += 1);

  const ids = resultado.porPregunta.map(({ pregunta }) => pregunta.id);
  const respuesta = await leerPreguntasPorIds(ids, { conJustificacion: true });

  if (esta !== peticionDeLaRevision) return;

  const contenedor = $('#revision-del-intento');
  if (!contenedor) return;

  const desdeLaCopia = Boolean(respuesta.ok && respuesta.meta?.respaldo);

  mostrarAvisoDeRespaldo({
    sello: desdeLaCopia ? respuesta.meta.respaldo : null,
    loQueSeCargo: 'la revisión',
  });

  const vigentes = respuesta.ok ? new Map(respuesta.datos.map((p) => [p.id, p])) : null;

  laRevision = armarLaRevision(resultado, vigentes, { desdeLaCopia });

  contenedor.innerHTML = dibujarRevisionDelIntento({
    modulos: laRevision,
    nota: vigentes
      ? null
      : 'No se pudieron traer las explicaciones: no respondió el banco ni la copia guardada. Tu resultado no cambia; abajo está lo que respondiste.',
  });
}


/**
 * Abre o pliega las correctas de un modulo (decision B3).
 *
 * Redibuja SOLO ese bloque y devuelve el foco a su control: el redibujo destruye el
 * boton pulsado, y sin esto el foco de quien usa teclado caeria al `body`.
 */
function alternarLasCorrectas(modulo) {
  const bloque = laRevision?.find((b) => String(b.modulo) === String(modulo));
  if (!bloque || bloque.correctas.length === 0) return;

  bloque.correctasAbiertas = !bloque.correctasAbiertas;

  const nodo = $(`#revision-del-modulo-${bloque.modulo}`);
  if (!nodo) return;

  nodo.innerHTML = dibujarDentroDelModulo(bloque);
  $(`#plegar-correctas-${bloque.modulo}`)?.focus();
}

/**
 * Marca una alternativa, o cambia la que estaba marcada.
 *
 * NO REGISTRA NADA. Lo marcado vive en memoria hasta que se avanza o se agota el
 * plazo, que es la decision 1 del archivo de la iteracion: se puede cambiar de opinion
 * las veces que se quiera mientras la pregunta siga abierta, y lo que queda escrito es
 * la ultima.
 *
 * SOLO SE ACEPTA UNA ALTERNATIVA DE LA PREGUNTA EN CURSO, y esa guarda es la que
 * sostiene el «sin vuelta atras» contra un clic viejo. Un evento de clic guardado de
 * la pregunta 3 y vuelto a lanzar en la 4 trae el id de una alternativa que la 4 no
 * tiene: aqui no se encuentra y no pasa nada. Sin esta comprobacion, `laMarcada`
 * quedaria apuntando a una alternativa ajena y se escribiria en el intento como si
 * fuera la respuesta de la pregunta 4.
 */
function marcarLaAlternativa(cual) {
  const pregunta = laPreguntaEnCurso();
  if (!pregunta) return;

  const elegida = pregunta.alternativas.find((a) => String(a.id) === String(cual));
  if (!elegida) return;

  laMarcada = elegida.id;

  // Marcar retira la confirmacion de omitir (decision 1). Se retira aunque ya
  // estuviera retirada: es una linea, y preguntar antes seria mas codigo para el
  // mismo resultado.
  confirmandoOmitir = false;

  dibujarElRecorrido({ enfocar: 'marcada' });
}

/**
 * Cuanto se mueve la marca con cada flecha (decision 11 de la 43). Abajo y derecha
 * avanzan, arriba e izquierda retroceden, como en cualquier grupo de radio. Una tecla
 * que no esta aqui no es asunto del grupo.
 */
const PASOS_DE_LAS_FLECHAS = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

/**
 * Mueve la marca desde la alternativa que tiene el foco, dando la vuelta en los extremos.
 *
 * SE MUEVE DESDE LA ENFOCADA, NO DESDE LA MARCADA. Sin nada marcado, Tab deja el foco
 * en la primera (bloque 19), y la flecha abajo tiene que llevar a la segunda.
 *
 * Y SE BUSCA EN LA PREGUNTA EN CURSO. Si la alternativa de origen no es de esta
 * pregunta, es un evento viejo y no se mueve nada: es la misma guarda del clic.
 *
 * Marcar pasa por `marcarLaAlternativa()`, que retira la confirmacion de omitir y deja
 * el foco en la recien marcada. Nada se registra hasta avanzar o agotarse.
 */
function moverLaMarca(desde, paso) {
  const pregunta = laPreguntaEnCurso();
  if (!pregunta) return;

  const lista = pregunta.alternativas;
  const aqui = lista.findIndex((a) => String(a.id) === String(desde));
  if (aqui === -1) return;

  const destino = lista[(aqui + paso + lista.length) % lista.length];
  marcarLaAlternativa(destino.id);
}

/**
 * «Siguiente»: registra lo marcado y pasa a la pregunta siguiente.
 *
 * LA GUARDA DE `laMarcada === null` NO SOBRA AUNQUE EL BOTON ESTE `disabled`. El
 * oyente vive en la zona por delegacion, asi que llega igual todo clic que caiga
 * dentro; y el DOM falso de `scripts/dom-falso.mjs` ejecuta los oyentes **aunque el
 * nodo este deshabilitado**, que es justamente como se provoca desde un guion el
 * martilleo de teclado sobre un boton apagado. Un `disabled` es una comodidad del
 * navegador, no una regla del programa.
 */
function avanzarRegistrando() {
  if (!laPreguntaEnCurso()) return;
  if (laMarcada === null) return;

  resolverLaPreguntaEnCurso({ alternativa_id: laMarcada, estado: 'respondida' });
}

/**
 * «Omitir»: el primer toque pide confirmacion, el segundo omite (regla 5).
 *
 * Con una alternativa marcada no se omite, y por eso el boton esta apagado: la regla 5
 * de la epica dice que se omite **sin alternativa marcada**. La guarda de aqui es la
 * misma mitad comprobable que la de «Siguiente».
 */
function tocarOmitir() {
  if (!laPreguntaEnCurso()) return;
  if (laMarcada !== null) return;

  if (!confirmandoOmitir) {
    confirmandoOmitir = true;
    dibujarElRecorrido({ enfocar: 'omitir' });
    return;
  }

  resolverLaPreguntaEnCurso({ alternativa_id: null, estado: 'omitida' });
}

/**
 * Cierra la pregunta en curso y sigue. El unico camino que escribe desde la pantalla.
 *
 * `agotada: false` siempre: por aqui se pasa cuando el estudiante decide, y lo que se
 * resuelve solo al vencer el plazo entra por `components/cronometros.js`, que anota
 * `agotada: true` y el instante del vencimiento.
 */
function resolverLaPreguntaEnCurso({ alternativa_id, estado }) {
  const pregunta = laPreguntaEnCurso();
  if (!pregunta) return;

  anotarEnElIntento({ pregunta_id: pregunta.id, alternativa_id, estado, agotada: false });
}

/**
 * Ata el recorrido entero a `#zona-del-intento`, POR DELEGACION.
 *
 * Es la misma forma que `conectarComienzo()` de mas abajo y por un motivo mas fuerte:
 * aqui la zona se reescribe **en cada toque**, asi que un oyente por alternativa
 * moriria con el primer redibujo. Y es lo unico que un guion puede provocar: el DOM
 * falso devuelve `querySelectorAll: () => []`, o sea que atar los oyentes recorriendo
 * las alternativas con `$$()` dejaria el recorrido sin una sola prueba posible.
 *
 * El orden de las tres preguntas no es indiferente: la alternativa va primera porque
 * es el clic frecuente, y los dos botones se excluyen entre si.
 *
 * Desde la tanda 2 hay un segundo oyente, de teclado, para las flechas del grupo de
 * radio (decision 11). Espacio y Enter no lo necesitan: el boton los convierte en clic.
 */
export function conectarElRecorrido() {
  const zona = $('#zona-del-intento');
  if (!zona) return;

  zona.addEventListener('click', (evento) => {
    const alternativa = evento.target.closest?.('[data-papel="alternativa"]');

    if (alternativa) {
      marcarLaAlternativa(alternativa.dataset?.alternativa);
      return;
    }

    if (evento.target.closest?.('[data-papel="siguiente"]')) {
      avanzarRegistrando();
      return;
    }

    if (evento.target.closest?.('[data-papel="omitir"]')) {
      tocarOmitir();
      return;
    }

    // Y en el resumen, el control de las correctas de cada modulo (decision B3). Vive en
    // el mismo oyente por lo mismo que los otros: la zona se reescribe entera.
    const plegable = evento.target.closest?.('[data-papel="plegar-correctas"]');
    if (plegable) alternarLasCorrectas(plegable.dataset?.modulo);
  });

  // LAS FLECHAS DEL GRUPO DE RADIO (decision 11 de la 43). Por delegacion, igual que
  // el clic y por el mismo motivo: la zona se reescribe en cada marca. Solo se atienden
  // las cuatro flechas con el foco en una alternativa; todo lo demas se deja pasar sin
  // tocarlo, y Espacio y Enter los convierte en clic el propio boton.
  zona.addEventListener('keydown', (evento) => {
    const desde = evento.target.closest?.('[data-papel="alternativa"]');
    if (!desde) return;

    const paso = PASOS_DE_LAS_FLECHAS[evento.key];
    if (paso === undefined) return;

    // Se ataja aunque despues no se mueva nada: la flecha cayo dentro del grupo, y
    // dejarla pasar desplazaria la pagina.
    evento.preventDefault?.();
    moverLaMarca(desde.dataset?.alternativa, paso);
  });
}

/**
 * El intento no pudo empezar, y la pantalla lo explica (decision 4).
 *
 * SE DICE POR QUE, Y SIN TECNICISMOS. El estudiante no tiene que saber que existe un
 * banco de preguntas por modulo ni que hay preguntas hermanas: lo que necesita saber
 * es que no fue culpa suya, que no hay nada que arreglar de su lado y que puede
 * volver a intentarlo. El codigo del motivo no se imprime.
 *
 * Y NO SE EMPIEZA A MEDIAS. Un intento de 113 preguntas seria peor que ninguno: el
 * 60 % de aprobacion esta calculado sobre 120, asi que el resultado que diera no
 * significaria nada y nada en la pantalla lo diria.
 */
function dibujarNoSePudo(explicacion) {
  dibujarRecuadro({
    titulo: 'No se pudo armar el simulacro',
    cuerpo: `
        <p class="mt-3 text-sm text-muted leading-relaxed">${explicacion}</p>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button id="comenzar-simulacro" type="button" class="inline-flex items-center gap-2 bg-jsyellow text-ink font-display font-bold text-sm px-6 py-3 rounded hover:bg-jsyellowdim transition-colors">Volver a intentarlo</button>
          <a href="cuestionario.html" class="inline-flex items-center gap-2 border ${BORDE_DEL_SIMULACRO} text-paper font-display font-bold text-sm px-5 py-3 rounded hover:border-jsyellow transition-colors">Practicar sin reloj</a>
        </div>`,
  });
}

/**
 * Trae las preguntas de una lista de ids y las deja indexadas por id.
 *
 * Devuelve `null` si la peticion fallo del todo —ni base ni copia—, que es distinto
 * de que volvieran menos de las pedidas. Lo primero es que no hay de donde sacar
 * nada; lo segundo es lo que las reservas existen para tapar.
 */
async function traer(ids, pedir) {
  const respuesta = await pedir(ids);
  if (!respuesta.ok) return null;

  // Cualquiera de las dos peticiones puede caer a la copia por su cuenta, asi que se
  // anota el sello de esta sin pisar el de la otra.
  origen.preguntas = respuesta.meta?.respaldo ?? origen.preguntas;

  return new Map((respuesta.datos ?? []).map((pregunta) => [pregunta.id, pregunta]));
}

/**
 * Arma el intento entero: elegir, traer y reponer hasta 120.
 *
 * Devuelve `{ ok: true, preguntas }` con las 120 preguntas enteras y **en el orden
 * del intento**, o `{ ok: false, explicacion }` con la frase que va a leer el
 * estudiante. Devuelve las preguntas y no sus ids porque a partir de la etapa C hay
 * que guardarlas congeladas: volver a pedirlas para guardarlas seria un viaje mas
 * para traer lo que ya se tenia en la mano.
 *
 * `pedir` es de donde se traen las preguntas —la capa o la copia—, y entra por
 * parametro por el mismo motivo por el que el azar entra por parametro en el
 * algoritmo: asi esta funcion no tiene que saber cual de los dos bancos le toco, y
 * quien la llama no puede equivocarse a medias. Ver la regla del mismo banco en la
 * cabecera del archivo.
 *
 * EL ORDEN DEL INTENTO SE RESPETA AL REPONER. Las 120 llegan ya barajadas entre
 * modulos desde `elegirIntento()`, y esta funcion trabaja sobre **ranuras**: lo que
 * no vuelve deja su sitio vacio y la reserva entra en ese mismo sitio. Ver el bucle.
 */
async function armarElIntento(idsPorModulo, pedir) {
  const eleccion = elegirIntento({ idsPorModulo });

  // Los dos motivos se separan porque al estudiante le dicen cosas distintas: uno es
  // «el banco contesto incompleto» y el otro «el banco contesto y no alcanza». La
  // rama final no es defensiva de adorno: si algun dia apareciera un motivo nuevo y
  // esto siguiera de largo, se pediria `eleccion.ids` sin que exista.
  if (!eleccion.ok) {
    if (eleccion.motivo === FALTA_MODULO) {
      return {
        ok: false,
        explicacion: `El banco no entregó preguntas del módulo ${esc(eleccion.modulo)}, así que no se puede armar un simulacro completo. Vuelve a intentarlo en un rato.`,
      };
    }

    return {
      ok: false,
      explicacion:
          eleccion.motivo === SIN_CANDIDATOS
              ? `Ahora mismo no hay suficientes preguntas disponibles en el módulo ${esc(eleccion.modulo)} para armar un simulacro completo de ${esc(PREGUNTAS_DEL_INTENTO)} preguntas. Vuelve a intentarlo en un rato.`
              : 'No se pudo armar un simulacro completo con las preguntas disponibles. Vuelve a intentarlo en un rato.',
    };
  }

  const traidas = await traer(eleccion.ids, pedir);

  // Se corta AQUI y no al final. Seguir seria gastar las tres rondas de reserva
  // —tres viajes mas, con el estudiante mirando la transicion— reponiendo sobre
  // ids que ya se sabe que salieron del banco equivocado, para tirar el resultado
  // igual. Provocado el 2026-09-17: cortando al final, las tres rondas se gastaban
  // enteras antes de rehacer el intento.
  if (seMezclaronLosBancos()) return HAY_MEZCLA;

  if (!traidas) {
    return {
      ok: false,
      explicacion:
          'No se pudieron traer las preguntas del simulacro. Revisa tu conexión y vuelve a intentarlo.',
    };
  }

  // LAS 120 RANURAS, EN EL ORDEN DEL INTENTO.
  //
  // `eleccion.ids` ya viene barajado entre modulos, y ese es el orden en que el
  // estudiante va a responder. Reponer no lo puede alterar: una pregunta que no
  // volvio deja su ranura vacia, y la reserva **entra en esa misma ranura**. Si las
  // reservas se agregaran al final, un intento con nueve descartes traeria las nueve
  // reposiciones juntas al terminar, que es justo el agrupamiento que barajar viene a
  // evitar.
  const moduloDe = new Map();
  for (const modulo of MODULOS_DEL_EXAMEN) {
    for (const id of eleccion.porModulo[modulo]) moduloDe.set(id, modulo);
  }

  const ranuras = eleccion.ids.map((id) => ({
    modulo: moduloDe.get(id),
    pregunta: traidas.get(id) ?? null,
  }));

  // Las rondas de reposicion. En el camino sano no entra ninguna: no hay ranuras
  // vacias y el bucle termina en la primera vuelta.
  for (let ronda = 0; ronda < RONDAS_DE_RESERVA; ronda += 1) {
    const vacias = ranuras.filter((ranura) => ranura.pregunta === null);
    if (vacias.length === 0) break;

    // Se pide POR MODULO y no en monton porque lo que hay que reponer es la CUOTA de
    // cada modulo, no el total: reponer seis preguntas de donde sea dejaria 120 en
    // total y 14 de un modulo. Los ids de todas las reservas de una ronda si viajan
    // juntos, en una sola peticion.
    const pedidos = [];

    for (const modulo of MODULOS_DEL_EXAMEN) {
      const suyas = vacias.filter((ranura) => ranura.modulo === modulo);
      if (suyas.length === 0) continue;

      const repuestos = reponerDelModulo(eleccion.reservas, modulo, suyas.length);
      repuestos.forEach((id, i) => pedidos.push({ ranura: suyas[i], id }));
    }

    if (pedidos.length === 0) break;

    const masTraidas = await traer(pedidos.map((p) => p.id), pedir);

    // Una ronda de reserva que cae a la copia mezcla igual que la primera peticion:
    // las 111 que ya llegaron son de D1 y estas nueve serian de la copia. Misma
    // regla, mismo corte.
    if (seMezclaronLosBancos()) return HAY_MEZCLA;

    if (!masTraidas) break;

    for (const { ranura, id } of pedidos) {
      const pregunta = masTraidas.get(id);
      if (pregunta) ranura.pregunta = pregunta;
    }
  }

  const preguntas = ranuras
      .filter((ranura) => ranura.pregunta !== null)
      .map((ranura) => ranura.pregunta);

  if (preguntas.length < PREGUNTAS_DEL_INTENTO) {
    return {
      ok: false,
      explicacion: `Solo se pudieron reunir ${esc(preguntas.length)} preguntas de las ${esc(PREGUNTAS_DEL_INTENTO)} que necesita un simulacro, así que no tiene sentido empezarlo a medias. Vuelve a intentarlo en un rato.`,
    };
  }

  return { ok: true, preguntas };
}

/**
 * Un intento completo pedido a UN solo banco: su resumen y sus preguntas.
 *
 * Deja anotado en `origen` de donde salio cada mitad, que es lo que despues mira la
 * regla del mismo banco y lo que enciende el aviso de ADR-008.
 *
 * SI EL RESUMEN YA VINO DE LA COPIA, LAS PREGUNTAS NO SE LE PIDEN A LA CAPA.
 *
 * Es la misma regla mirada desde el otro lado, y ahorra ademas un viaje: la capa
 * acaba de no contestar el resumen, asi que pedirle las preguntas es gastar la
 * espera del estudiante en un servicio que ya se sabe caido —y, si contestara,
 * seria justo la mezcla al reves: ids elegidos sobre la copia pedidos a D1—.
 */
async function unIntentoDe(fuente) {
  origen.resumen = null;
  origen.preguntas = null;

  const resumen = await fuente.resumen();
  origen.resumen = resumen.meta?.respaldo ?? null;

  if (!resumen.ok) {
    return {
      ok: false,
      explicacion:
          'No se pudo consultar el banco de preguntas. Revisa tu conexión y vuelve a intentarlo.',
    };
  }

  const pedir = origen.resumen ? DESDE_LA_COPIA.preguntas : fuente.preguntas;

  return armarElIntento(
      Object.fromEntries(
          (resumen.datos ?? []).map((fila) => [fila.modulo, fila.preguntas_ids ?? []])
      ),
      pedir
  );
}

/**
 * Lo que pasa al pulsar «Comenzar el simulacro».
 *
 * Se exporta para que `scripts/probar-filtrado.mjs` pueda provocarlo sin fingir un
 * clic: lo que se prueba es lo que hace el boton, y un guion que reimplementara
 * estos pasos estaria probando su propia copia.
 *
 * EL ORDEN DE LAS GUARDAS ES EL DE LA ITERACION 35, y no es decorativo:
 *
 *   1. se toma el numero de peticion y se abre el registro, en un solo acto;
 *   2. se dibuja la transicion;
 *   3. se pide;
 *   4. si las dos mitades no salieron del mismo banco, se vuelve a pedir entero a
 *      la copia (la regla del mismo banco, en la cabecera del archivo);
 *   5. **antes de dibujar**, se comprueba que esta sigue siendo la ultima peticion;
 *   6. se espera el piso de 400 ms;
 *   7. se vuelve a comprobar, porque durante el piso pudo pulsarse otra vez;
 *   8. se cierra y se dibuja.
 *
 * Los pasos 5 y 7 son H-1 entero: sin ellos, una respuesta lenta apagaria la
 * transicion de una carga posterior y dibujaria encima de ella.
 *
 * EL PASO 4 VA DENTRO DE LA MISMA TRANSICION, y no es un detalle: es la segunda
 * mitad de la misma carga, no una carga nueva. `abrir()` se sigue llamando UNA vez,
 * el piso de 400 ms se sigue midiendo desde el clic una sola vez, y el estudiante
 * ve una transicion y no dos encadenadas.
 */
export async function comenzarElIntento() {
  // Pulsar durante la carga no hace nada. `disabled` ya lo impide en el navegador;
  // esta guarda es la mitad que se puede provocar desde un guion, porque el DOM
  // falso ejecuta los oyentes aunque el nodo este deshabilitado.
  if (transicion.enCurso()) return;

  // El instante del clic, no el de despues de la carga. Es lo que la iteracion 42 va
  // a usar como origen del tiempo transcurrido, y tomarlo al terminar de cargar le
  // regalaria al estudiante los segundos que tardo el banco en contestar.
  const empezadoEn = reloj().ahora();

  // Lo primero: apagar el intento anterior. «Empezar otro intento» llega por aqui, y
  // un cronometro del intento viejo que siguiera vivo escribiria respuestas sobre el
  // nuevo en cuanto venciera su plazo.
  //
  // Y se suelta el arriendo ANTES de apagar, porque apagar tira el objeto que sabe si
  // era nuestro. Va junto a `olvidarElIntento()` de aqui abajo y por el mismo motivo:
  // si el intento siguiente no se puede armar, lo que no puede quedar es una clave del
  // simulacro suelta en el almacen sin ningun intento detras.
  elDueno?.soltar();
  pararElIntento();

  // Y la revision del resumen anterior, si seguia viajando, queda descartada: sube la
  // cuenta de peticiones y su respuesta ya no es la ultima. `elIntento` no sirve para
  // saberlo, porque sigue siendo el viejo durante toda la carga del nuevo.
  peticionDeLaRevision += 1;
  laRevision = null;

  // Y se olvida lo guardado ANTES de pedir nada. Si el estudiante pulsa «Empezar otro
  // intento» y la carga falla, lo que no puede quedar es el intento anterior en el
  // almacen y la pantalla diciendo que no se pudo armar ninguno: al recargar volveria
  // uno que la pantalla ya habia dado por perdido.
  olvidarElIntento();

  const miPeticion = transicion.abrir('el intento');
  transicion.dibujar('');

  // Primera pasada, contra la capa de datos.
  let resultado = await unIntentoDe(DESDE_LA_CAPA);

  // LA REGLA DEL MISMO BANCO.
  //
  // `armarElIntento()` corto al ver que las preguntas venian de la copia y el
  // resumen no: los ids se eligieron sobre D1 y se pidieron a la instantanea. Da
  // igual en que momento se detecto —en la primera peticion o en una ronda de
  // reserva a mitad de camino—: la marca es la misma y se atiende igual.
  //
  // Lo que se hace NO es completar lo que falta: es **volver a elegir el intento
  // entero** desde la copia. Completar dejaria dentro las preguntas que ya habian
  // llegado de D1, y un intento con dos bancos adentro es exactamente lo que esto
  // existe para impedir. Elegir de nuevo cuesta una eleccion mas —trabajo de
  // milisegundos, sin red— y devuelve un intento entero de un solo origen.
  if (resultado.mezcla) {
    resultado = await unIntentoDe(DESDE_LA_COPIA);
  }

  if (!transicion.esLaUltima(miPeticion)) {
    transicion.cerrar(miPeticion);
    return;
  }

  await transicion.esperarElPiso();

  if (!transicion.esLaUltima(miPeticion)) {
    transicion.cerrar(miPeticion);
    return;
  }

  transicion.cerrar(miPeticion);

  // SE GUARDA ANTES DE DIBUJAR, y ese orden importa. El aviso de que el intento no se
  // esta guardando tiene que poder salir junto con la primera pregunta y no un
  // instante despues: quien lee la pantalla de arriba abajo se entera de que esto no
  // sobrevive a una recarga antes de ponerse a responder, que es cuando sirve saberlo.
  // Y desde la 43 hay un segundo motivo para que el aviso este puesto ANTES de
  // dibujar: la columna del intento mira si hay un aviso encendido para decidir si
  // compensa el relleno de la seccion o no (ver `hayAvisoALaVista()`).
  //
  // Se guarda al OCURRIR y no al salir (decision 6): no hay `beforeunload` ni
  // `pagehide` en este sitio, y la memoria de un intento de una hora no puede depender
  // de que el estudiante salga por una puerta concreta.
  if (resultado.ok) {
    // La pregunta 1 empieza sin nada marcado y sin confirmacion pendiente. Se borran
    // aqui y no solo al cambiar de pregunta porque «Empezar otro intento» llega por
    // esta funcion: lo que quedara marcado del intento anterior se marcaria sobre la
    // primera pregunta del nuevo.
    laMarcada = null;
    confirmandoOmitir = false;

    elIntento = {
      preguntas: resultado.preguntas,
      respuestas: [],
      posicion: 0,
      // El intento y su primera pregunta empiezan en el mismo instante: el del clic.
      empezado_en: empezadoEn,
      comenzada_en: empezadoEn,
      terminado_en: null,
    };

    guardarIntentoNuevo(resultado.preguntas, empezadoEn);
  }

  // El aviso del respaldo se enciende ANTES de dibujar el resultado, para que quien
  // lea la pantalla de arriba abajo se entere de que esto sale de una copia antes de
  // leer lo que la copia dio.
  mostrarAvisoDeRespaldo({
    sello: origen.resumen ?? origen.preguntas,
    loQueSeCargo: 'el simulacro',
  });

  mostrarAvisoDeGuardado({ estado: estadoDelGuardado() });

  // Y aqui aparece la primera pregunta, no un aviso de que el intento quedo listo. El
  // recuadro «Intento listo» de la decision 11 de la 41 era el final provisional de
  // esta carga «mientras no exista el recorrido (43)», y el recorrido ya existe.
  if (resultado.ok) dibujarElRecorrido();
  else dibujarNoSePudo(resultado.explicacion);

  // Y el reloj empieza a correr. Despues de dibujar, para que la franja se pinte sobre
  // una pantalla que ya existe; el instante de origen es el del clic y no el de ahora,
  // asi que lo que tardo la carga ya esta descontado y no se regala.
  //
  // El intento se juega igual aunque no se haya podido guardar (decision 7 de la 41);
  // lo que cambia es que entonces no hay arriendo que escribir.
  if (resultado.ok) {
    ponerEnMarchaElIntento({ hayIntentoGuardado: estadoDelGuardado() === 'guardando' });
  }
}

/**
 * Las preguntas del intento que se esta jugando, en su orden.
 *
 * Se exporta por el mismo motivo que `comenzarElIntento()`: para que
 * los guiones puedan mirar el intento REAL —`probar-memoria.mjs` anota sobre el, y
 * `probar-filtrado.mjs` cuenta su reparto por modulo—. Devuelve una copia del arreglo
 * para que nadie de fuera pueda reordenarlo.
 */
export const preguntasDelIntento = () => (elIntento ? [...elIntento.preguntas] : []);

/**
 * Anota una pregunta ya resuelta y la guarda.
 *
 * ES EL UNICO SITIO POR EL QUE PASA TODA PREGUNTA RESUELTA. La llaman los dos
 * botones del recorrido de la 43 —«Siguiente» y el segundo toque de «Omitir»— y el
 * agotamiento de los 30 segundos de la 42, de ahi `agotada`. Tambien la llaman los
 * guiones, para provocar una escritura a mitad del intento sobre el codigo de verdad.
 *
 * @param {object} entrada
 * @param {number} entrada.pregunta_id     el id de la pregunta resuelta
 * @param {number|null} entrada.alternativa_id  la alternativa elegida DENTRO de la
 *        copia congelada, o null si se omitio
 * @param {'respondida'|'omitida'} entrada.estado
 * @param {boolean} entrada.agotada        si se resolvio porque se acabo el tiempo
 * @param {number} [entrada.resuelta_en]   instante en que quedo resuelta
 *
 * Devuelve si quedo GUARDADA. Un `false` no deshace nada: la respuesta queda anotada
 * en memoria y el intento sigue, que es la decision 7. Lo unico que cambia es que se
 * dice, y eso lo hace el aviso de aqui abajo.
 */
export function anotarEnElIntento(entrada) {
  if (!elIntento) return false;

  // UN INTENTO COMPLETO NO ADMITE UNA RESPUESTA MAS, y la guarda no es teorica: se
  // llego a ella. Con el avance automatico de la iteracion 42, una respuesta que
  // entrara despues de la 120 dejaria `respuestas` mas larga que `preguntas`, y eso es
  // exactamente lo que `leerIntentoGuardado()` descarta al recargar —«un intento de
  // 121 no es un intento largo, es un intento roto»—. O sea que la respuesta 121 no
  // se pierde sola: se lleva por delante el intento entero.
  if (elIntento.respuestas.length >= elIntento.preguntas.length) return false;

  const resueltaEn = entrada.resuelta_en ?? reloj().ahora();

  elIntento.respuestas.push({
    pregunta_id: entrada.pregunta_id,
    alternativa_id: entrada.alternativa_id ?? null,
    estado: entrada.estado,
    agotada: Boolean(entrada.agotada),
    resuelta_en: resueltaEn,
  });

  // La posicion sale de contar lo resuelto, no de un contador aparte. Con dos
  // numeros que dicen lo mismo, el dia que se desincronicen no habria forma de saber
  // cual manda —es el mismo motivo por el que el resultado no se guarda—.
  elIntento.posicion = elIntento.respuestas.length;

  // Y la siguiente pregunta empieza cuando termina esta. El instante es de la 42;
  // acá se deja puesto para que lo guardado sea coherente desde el primer dia.
  elIntento.comenzada_en = resueltaEn;

  // El final del intento es el instante en que quedo resuelta la ultima. Vive tambien
  // en memoria y no solo en el almacen desde la iteracion 44: el tiempo total del
  // resumen sale de aqui (B1), y un intento que no se pudo guardar tiene que poder
  // mostrarlo igual.
  elIntento.terminado_en =
      elIntento.posicion === elIntento.preguntas.length ? resueltaEn : null;

  const pudo = guardarAvance({
    posicion: elIntento.posicion,
    comenzada_en: elIntento.comenzada_en,
    terminado_en: elIntento.terminado_en,
    respuestas: elIntento.respuestas,
  });

  mostrarAvisoDeGuardado({ estado: estadoDelGuardado() });

  // Y la franja se repinta EN EL ACTO, con la pregunta nueva y sus 30 segundos
  // enteros. Sin esto la cifra se queda hasta un segundo mostrando lo que le quedaba
  // a la pregunta anterior —se vio: responder a los 5 s dejaba la siguiente
  // empezando en 25—, y de paso el cronometro se vuelve a citar para el plazo nuevo
  // en vez de seguir esperando el viejo.
  //
  // El motor ignora esta llamada cuando viene de su propio bucle de ponerse al dia:
  // ahi ya esta latiendo, y volver a entrar serian 120 niveles de recursion.
  losCronometros?.latir();

  // Y LA TARJETA SE REDIBUJA AQUI, en el unico sitio por el que pasa toda pregunta
  // resuelta. Era la costura que faltaba: hasta hoy, al vencer el plazo se repintaba
  // la franja y nadie repintaba la pregunta, asi que la pantalla se quedaba con el
  // enunciado anterior mientras el cronometro ya contaba el siguiente.
  //
  // Se borra lo marcado ANTES de dibujar: la pregunta nueva empieza limpia, y la
  // confirmacion de omitir no sobrevive al cambio de pregunta (ver `laMarcada`).
  //
  // SE REDIBUJA UNA VEZ POR PREGUNTA RESUELTA, tambien cuando el motor resuelve
  // cuatro seguidas al volver de segundo plano: son cuatro escrituras de la zona en
  // el mismo instante, todas menos la ultima invisibles. No se agrupan porque
  // agruparlas exigiria que este archivo supiera que el motor esta en mitad de un
  // bucle, y el tope es el propio intento: 120 escrituras como maximo en la vida de
  // una pagina, no un bucle sin fondo.
  laMarcada = null;
  confirmandoOmitir = false;

  dibujarElRecorrido();

  return pudo;
}

/**
 * Al abrir la pagina: si hay un intento guardado, se retoma.
 *
 * NO SALE NI UNA PETICION. Se lee del almacen del navegador y nada mas, asi que la
 * regla de la decision 5 —«la presentacion no pide nada»— sigue intacta: quien abre
 * la pagina con un intento a medias no gasta ni un viaje a la red, y quien la abre
 * sin intento tampoco.
 *
 * Y NO SE VUELVE A ELEGIR NADA. Las preguntas salen de la copia congelada, en el
 * mismo orden en que se guardaron. Volver a pedirlas por id al banco seria
 * exactamente lo que la decision 6 prohibe: el resultado se calcula con lo que el
 * estudiante vio, y una pregunta corregida entre la carga y la recarga le cambiaria
 * el intento por debajo.
 *
 * Si no hay intento, o si lo que hay no se entiende, esta funcion no hace nada y la
 * presentacion se queda como estaba. En silencio, como manda ADR-034.
 */
export function retomarElIntento() {
  const guardado = leerIntentoGuardado();
  if (!guardado) return;

  // Lo marcado NO se guarda y NO se retoma, y es a proposito: una alternativa marcada
  // y no registrada es una intencion a medias, y el tiempo siguio corriendo mientras
  // la pagina no estaba. Volver con ella marcada seria prometer que la eleccion se
  // conservo cuando lo que puede haber pasado es que la pregunta entera se agotara.
  laMarcada = null;
  confirmandoOmitir = false;

  elIntento = {
    preguntas: guardado.preguntas,
    respuestas: guardado.respuestas,
    posicion: guardado.posicion,
    // `empezado_en` se retoma desde la iteracion 42, y antes se descartaba. Es el
    // origen del tiempo transcurrido: sin el, al volver de una recarga el intento
    // sabia cuando empezo la pregunta actual pero no cuando empezo el intento, y la
    // cifra de la derecha de la franja no se podia calcular con la regla de la
    // decision 5 —«ahora menos el instante guardado»—. `leerIntentoGuardado()` ya lo
    // devolvia y lo validaba; lo que faltaba era recogerlo.
    empezado_en: guardado.empezado_en,
    comenzada_en: guardado.comenzada_en,
    terminado_en: guardado.terminado_en,
  };

  // El aviso se recalcula al retomar y no se hereda: el navegador pudo llenarse
  // entre una visita y la otra, y el estado de la visita anterior no se guarda en
  // ninguna parte —ni debe—.
  //
  // VA ANTES DE DIBUJAR, como en la carga y por los dos mismos motivos: se lee primero
  // lo que va a pasar con lo que respondas, y la columna del intento necesita saber si
  // hay un aviso encendido para no dibujarse encima.
  mostrarAvisoDeGuardado({ estado: estadoDelGuardado() });

  // Se retoma DONDE IBA: la pregunta que marca la posicion guardada, no la primera y
  // no un aviso. Si el intento ya estaba terminado, `dibujarElRecorrido()` lo detecta
  // y dibuja el resumen, recalculado desde lo guardado (decision 5).
  dibujarElRecorrido();

  // UN INTENTO TERMINADO NO SE PONE EN MARCHA (decision B4). No queda pregunta que
  // cronometrar, y tomar el arriendo bloquearia el resumen en otra pestana que lo
  // estuviera mirando.
  if (elIntento.posicion >= elIntento.preguntas.length) return;

  // Y el reloj sigue donde estaba. Lo primero que hacen los cronometros al arrancar es
  // ponerse al dia, asi que un intento que estuvo dos minutos cerrado vuelve con sus
  // preguntas agotadas ya resueltas (decision 3).
  //
  // Aqui `hayIntentoGuardado` es que si por definicion: se acaba de leer del almacen.
  ponerEnMarchaElIntento({ hayIntentoGuardado: true });
}

/**
 * Pone en marcha el intento: los dos cronometros y el arriendo de la pestana.
 *
 * Se llama en los dos sitios donde aparece un intento jugable —al armarlo y al
 * retomarlo tras una recarga— y no dentro de uno solo de ellos, porque un intento
 * retomado tiene exactamente el mismo reloj corriendo que uno recien armado: la
 * decision 3 dice que el tiempo sigue, y retomar sin arrancar el cronometro seria
 * regalarle al estudiante todo el rato que estuvo fuera.
 *
 * EL ORDEN IMPORTA: PRIMERO EL ARRIENDO, DESPUES LOS CRONOMETROS. Si los cronometros
 * arrancaran antes, una pestana que va a quedar bloqueada alcanzaria a ponerse al dia
 * y a escribir en el almacen las preguntas agotadas mientras no miraba, que es
 * justamente la escritura que la decision 4 existe para impedir.
 */
function ponerEnMarchaElIntento({ hayIntentoGuardado } = {}) {
  pararElIntento();

  elDueno = crearDuenoDelIntento({
    alPerderElIntento: bloquearEstaPestana,
    alRecuperarElIntento: () => {
      // El arriendo de la otra vencio. Se retoma lo guardado —que es de ella, y por
      // eso hay que volver a leerlo— y se sigue desde ahi.
      retomarElIntento();
    },
  });

  // Si el intento no se pudo guardar, no hay nada que dos pestanas puedan estropear y
  // no se escribe el arriendo: bajo `examen-td-js.simulacro.` nunca queda media cosa.
  elDueno.tomar({ hayIntentoGuardado });

  if (!elDueno.soyElDueno()) return;

  losCronometros = crearCronometros({
    estado: () => ({
      empezado_en: elIntento.empezado_en,
      comenzada_en: elIntento.comenzada_en,
      posicion: elIntento.posicion,
      total: elIntento.preguntas.length,
    }),
    alternativaMarcada: () => laAlternativaMarcada(),
    resolverLaPregunta: ({ posicion, alternativa_id, estado, agotada, resuelta_en }) => {
      anotarEnElIntento({
        pregunta_id: elIntento.preguntas[posicion].id,
        alternativa_id,
        estado,
        agotada,
        resuelta_en,
      });
    },
    // Sin enganche para el final: al no quedar preguntas el motor vacia la franja y se
    // para, y el resumen lo dibuja `dibujarElRecorrido()`, que es el unico camino (B4).
  });

  losCronometros.arrancar();
}

/** Apaga lo que estuviera corriendo. Vale llamarlo sin que haya nada encendido. */
function pararElIntento() {
  losCronometros?.detener();
  losCronometros = null;

  elDueno?.detener();
  elDueno = null;
}

/**
 * Otra pestana tomo el intento, y esta se bloquea (decision 4).
 *
 * LO PRIMERO ES PARAR, Y DESPUES DIBUJAR. Mientras los cronometros de esta pestana
 * sigan vivos, cada plazo que venza escribe una respuesta en el almacen que la OTRA
 * pestana esta usando, y dos pestanas escribiendo `…respuestas` con posiciones
 * distintas es el destrozo entero que esto evita. El aviso puede esperar un
 * milisegundo; la escritura no.
 *
 * Y NO SE BORRA NADA. Esta pestana deja de tocar el almacen, pero lo que hay guardado
 * es del intento que la otra esta jugando.
 */
function bloquearEstaPestana() {
  losCronometros?.detener();
  losCronometros = null;

  const franja = $('#franja-del-simulacro');
  if (franja) franja.innerHTML = '';

  dibujarRecuadro({
    titulo: 'Tu simulacro sigue en la otra pestaña',
    cuerpo: `
        <p class="mt-3 text-sm text-muted leading-relaxed">Abriste el simulacro en otra pestaña y el intento se fue con ella, para que las dos no se pisen. Esta pestaña ya no está contando ni guardando nada.</p>
        <p class="mt-3 text-sm text-muted leading-relaxed">Sigue en la otra pestaña. Si la cerraste, espera unos segundos y esta retoma el intento sola.</p>`,
  });
}

/**
 * Conecta el boton.
 *
 * El oyente va en la zona y no en el boton, y es a proposito: «Volver a intentarlo»
 * y «Empezar otro intento» son botones NUEVOS, dibujados despues, con el mismo id.
 * Un oyente puesto sobre el boton original se habria ido con el al reescribirse la
 * zona, y los dos serian botones que mienten.
 */
export function conectarComienzo() {
  const zona = $('#zona-del-intento');
  if (!zona) return;

  zona.addEventListener('click', (evento) => {
    const boton = evento.target.closest?.('#comenzar-simulacro');
    if (!boton) return;

    comenzarElIntento();
  });
}