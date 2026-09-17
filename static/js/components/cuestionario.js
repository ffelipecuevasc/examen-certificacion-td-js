/**
 * El cuestionario de practica.
 *
 * DE DONDE VIENEN LAS PREGUNTAS, Y POR QUE IMPORTA
 *
 * Desde la iteracion 22 vienen de D1, a traves de /api/preguntas. Hasta entonces
 * venian de un archivo del propio repositorio. El cambio parece de plomeria y no
 * lo es: el contenido paso a ser de **origen externo**, editable por cualquiera
 * que tenga acceso a la base, y el escapado dejo de ser higiene para convertirse
 * en una barrera de seguridad. Es lo que H-003 vio venir.
 *
 * La regla, sin excepciones: **todo texto que venga de la capa de datos pasa por
 * esc() antes de tocar innerHTML.** No hay ningun campo de confianza. El titulo
 * del modulo tampoco, y el nombre del icono menos que ninguno, porque va dentro
 * de un atributo.
 *
 * SE DIBUJA UN MODULO, NO EL BANCO (iteracion 31)
 *
 * Hasta el 2026-09-11 esta pagina pedia el banco entero y lo dibujaba de una vez.
 * Con 105 preguntas se sostenia; con 368 dejo de ser una opcion de diseno para
 * quien estudia desde el telefono con conexion modesta, que es parte del publico
 * descrito en vision.md. Ahora el estudiante elige un modulo y solo ese viaja.
 *
 * De ahi salen tres consecuencias que ordenan el resto del archivo:
 *
 *   1. La pagina arranca VACIA. No hay nada que dibujar hasta que haya eleccion,
 *      y el vacio se explica en vez de quedarse en blanco.
 *   2. Las barras del panel miden el MODULO, no el banco. `estado.total` es la
 *      cuenta del modulo dibujado.
 *   3. El control de modulo queda LIBRE en todo momento: se cambia cuando se
 *      quiera. El motivo esta en la iteracion 31 y sale de vision.md — forzar a
 *      terminar no produce constancia, produce abandono. Desde la iteracion 32
 *      ese control es el indice de components/indice-modulos.js, y se cambia de
 *      modulo por una sola puerta: pedirCambioDeModulo().
 *
 * LA MEMORIA DEL AVANCE (iteracion 33, ADR-034)
 *
 * Cambiar de modulo ya no pierde nada, y recargar tampoco: cada respuesta se guarda
 * en el navegador **al responderla**, y al volver al modulo se restaura. La 31 y la
 * 32 avisaban antes de perder el avance; ese aviso se retiro entero, porque ya no
 * hay nada que perder y un aviso que no protege de nada entrena a ignorar los
 * avisos.
 *
 * Lo que se guarda —id de la pregunta y texto de la alternativa elegida, nunca el
 * veredicto— y por que, esta en servicios/memoria.js y en ADR-034. Lo que le toca a
 * este archivo es la otra mitad, que es la que importa para el estudiante:
 *
 *   **el veredicto se recalcula contra el banco dibujado, cada vez.** Ver
 *   restaurarDesdeLaMemoria(). Si el banco cambio, manda el banco; si la
 *   alternativa que eligio ya no existe con ese texto, la pregunta vuelve a quedar
 *   sin responder. Se pierde una respuesta; no se afirma nada falso.
 *
 * LA TRANSICION DE CARGA (iteracion 35)
 *
 * Elegir un modulo ya no salta de una zona vacia a una llena: mientras la respuesta
 * viaja hay una transicion, con el logotipo quieto, un indicador sin porcentaje y
 * el texto que nombra el modulo. Dura **lo que tarda la carga de verdad**, con un
 * piso de 400 ms para que una respuesta instantanea no parpadee, y si se pasa de un
 * plazo claramente mayor que una carga sana lo dice.
 *
 * **No hay barra de progreso, y no es una omision.** La respuesta llega por partes
 * y sin cabecera de largo, asi que no hay porcentaje que calcular; y aunque lo
 * hubiera, el cuerpo baja en unos 8 ms dentro de una espera de ~400 ms. Esta escrito
 * con sus mediciones en la decision 1 de la iteracion 35.
 *
 * Todo lo que la transicion levanta vive en UN registro, y lo apaga quien lo creo y
 * nadie mas. El porque esta en components/transicion-de-carga.js, que es donde vive
 * desde la iteracion 41: el simulacro usa la misma transicion, y dos copias de lo
 * mismo divergen en silencio. Este archivo conserva la parte que es suya —que
 * modulo se pide, que textos lleva y que controles se desactivan— y nada mas.
 */
import { $, $$, esc, shuffle, icon, prefersReducedMotion } from '../utils/dom.js';
import { leerPreguntas } from '../servicios/datos.js';
import { crearTransicionDeCarga } from './transicion-de-carga.js';
import { mostrarAvisoDeRespaldo } from './aviso-de-respaldo.js';
import {
  borrarAvance,
  guardarRespuesta,
  leerAvance,
  respondidasEnLaVisita,
  sePuedeGuardar,
} from '../servicios/memoria.js';
import {
  avanceDelResumen,
  cargarConteos,
  conectarIndice,
  conteoDelResumen,
  fijarAvanceDibujado,
  marcarModuloActivo,
  pintarIndice,
} from './indice-modulos.js';

const estado = {
  respondidas: 0,
  correctas: 0,
  incorrectas: 0,
  total: 0,
  /** Modulo que se esta mostrando. null mientras no se haya elegido ninguno. */
  modulo: null,
};

/**
 * El modulo que se esta mostrando, ya agrupado.
 *
 * Se guarda para que reiniciar vuelva a dibujar sin pedir el modulo de nuevo: el
 * estudiante que reinicia quiere las mismas preguntas barajadas otra vez, no una
 * espera y la posibilidad de que la capa de datos se haya caido entre medio.
 */
let bancoCargado = null;

/**
 * De donde salio lo que se esta viendo, por fuente.
 *
 * Son dos peticiones distintas —el resumen de los siete conteos y las preguntas
 * del modulo— y cualquiera de las dos puede haber caido a la instantanea por su
 * cuenta. El aviso de ADR-008 tiene que aparecer si **alguna** de las dos lo hizo:
 * decirle al estudiante «esto viene de la base» cuando la mitad viene de la copia
 * seria mentir por omision.
 *
 * Cada campo guarda el sello del respaldo, o null si esa fuente contesto en vivo.
 */
const origen = { resumen: null, modulo: null };

/**
 * El contador de peticiones ya no vive aqui.
 *
 * Se fue con el registro de la transicion en la iteracion 41, decision 9, y no por
 * orden: el numero de peticion **es la identidad** del registro, y `cerrar()` lo
 * compara antes de apagar nada. Separarlos dejaria dos sitios obligados a avanzar
 * al mismo ritmo, y el dia que uno se olvidara el fallo no se veria. Se pide con
 * `transicion.abrir()`, que toma el numero y levanta el registro en el mismo acto.
 */

/**
 * Que modulo se esta pidiendo ahora mismo, o null si no se esta pidiendo ninguno.
 *
 * El contador de peticiones de la transicion sirve para descartar respuestas que
 * llegan tarde; esto sirve para algo distinto: **no salir a pedir dos veces lo
 * mismo**.
 *
 * El reintento de una carga fallida —que es de esta misma iteracion— abrio la
 * puerta sin querer: se permite volver a pedir el modulo que ya esta puesto cuando
 * `bancoCargado` es null, y eso tambien es cierto MIENTRAS carga. En una conexion
 * modesta, que es el publico de vision.md, la transicion dura lo suficiente como
 * para que el estudiante pulse otra vez creyendo que no registro el toque, y cada
 * toque son **12 a 17 KB comprimidos —45 a 66 KB sin comprimir— mas por la misma
 * pregunta** (medido el 2026-09-16 contra local y produccion, decision 1 de la
 * iteracion 35; la cifra que decia este comentario, «44 a 65 KB», no correspondia
 * a ninguna de las dos medidas).
 *
 * Con esto, pulsar durante la carga no hace nada. Y en cuanto la carga termina
 * —bien o mal— vuelve a null, asi que el reintento tras un fallo sigue disponible,
 * que es justo lo que no se puede perder.
 *
 * DESDE LA ITERACION 35 BAJA 400 ms MAS TARDE, y es a proposito: el piso de la
 * transicion se espera ANTES de bajarla, asi que mientras el piso corre la carga
 * todavia no ha terminado a la vista del estudiante y volver a pulsar sigue sin
 * pedir nada. El reintento tras un fallo aparece 400 ms despues que antes.
 */
let moduloCargando = null;

// ---------------------------------------------------------------------------
// La transicion de carga (iteracion 35; extraida a su modulo en la 41)
// ---------------------------------------------------------------------------

/**
 * Las dos constantes se vuelven a exportar desde aqui, y no es por comodidad.
 *
 * `scripts/probar-filtrado.mjs` las importa de ESTE archivo desde la iteracion 35,
 * y calcula con ellas los retrasos con que provoca el piso y el texto lento. Si
 * la extraccion las hubiera dejado solo en el modulo nuevo, esa prueba habria
 * dejado de compilar —o, peor, alguien habria copiado los numeros a mano y las
 * mediciones habrian seguido en verde midiendo contra un plazo viejo—.
 *
 * Quien las quiera de primera mano las tiene en components/transicion-de-carga.js.
 */
export {
  PISO_DE_LA_TRANSICION_MS,
  PLAZO_DE_CARGA_LENTA_MS,
} from './transicion-de-carga.js';

/**
 * La frase de la carga, escrita UNA vez.
 *
 * Aparece en dos sitios a la vez —el recuadro de la zona de preguntas y el mensaje
 * del panel izquierdo— y tienen que decir lo mismo, porque se leen al mismo tiempo.
 * Estuvieron escritos por separado desde la iteracion 35; aqui se juntan, que es lo
 * unico que garantiza que no se desfasen.
 *
 * En el recuadro el numero llega escapado, porque eso va a `innerHTML` y el
 * escapado lo hace la transicion; en el panel va por `textContent`, que no
 * interpreta marcado. El texto resultante es el mismo.
 */
const TITULO_DE_LA_CARGA = (modulo) => `Cargando el Módulo ${modulo}…`;

/**
 * La transicion de esta pagina, con lo que es suyo y no del mecanismo.
 *
 * Los cuatro ajustes son exactamente lo que la iteracion 35 tenia escrito dentro
 * del mecanismo y la 41 saco afuera: donde se dibuja, que dice, que controles se
 * apagan mientras dura y como se llaman sus dos nodos.
 *
 * `#mensaje-cuestionario` es el mismo id que usa `dibujarMensaje()`, y eso es
 * deliberado desde la iteracion 35: `irAlMensaje()` lleva el foco al recuadro sin
 * enterarse de cual de los dos lo dibujo.
 *
 * Los dos controles del panel se desactivan por la decision 6 de la 35. El indice
 * de modulos no esta en la lista a proposito: elegir otro modulo mientras uno carga
 * se sigue pudiendo, y es lo que el contador de peticiones resuelve bien.
 */
const transicion = crearTransicionDeCarga({
  contenedor: '#cuestionario',
  controles: ['#reiniciar', '#repaso'],
  idDelMensaje: 'mensaje-cuestionario',
  idDelAvisoLento: 'carga-lenta',
  textos: {
    titulo: TITULO_DE_LA_CARGA,
    detalle: 'Pidiendo sus preguntas al banco.',
    lento: 'Está tardando más de lo normal. La página sigue esperando la respuesta.',
  },
});

/**
 * El repaso abierto, o null si se esta viendo el modulo completo (iteracion 34).
 *
 *   ids          las preguntas que estaban falladas AL ENTRAR. Se congela ahi.
 *   respondidas  las que se volvieron a responder DENTRO de este repaso.
 *
 * POR QUE EL CONJUNTO SE CONGELA AL ENTRAR
 *
 * Porque si se recalculara solo, acertar una pregunta la haria desaparecer bajo el
 * dedo: el estudiante lee su justificacion en el telefono y el contenido salta. Las
 * decisiones 3 y 9 dicen las dos lo mismo desde los dos lados —la que se acierta y
 * la que se vuelve a fallar siguen a la vista hasta salir—, y congelar la lista es
 * la unica forma de cumplirlas sin excepciones.
 *
 * POR QUE `respondidas` ES UN CONJUNTO APARTE, Y NO BASTA LA MEMORIA DE LA VISITA
 *
 * Una pregunta fallada hace diez minutos ya esta en la memoria de la visita, y aun
 * asi el repaso tiene que dibujarla SIN MARCAR para poder reintentarla. Lo que
 * distingue «respondida antes» de «respondida aca dentro» es esto y nada mas.
 *
 * N, el numero del contador, NO sale de aca: se cuenta cada vez contra el banco y la
 * memoria (`falladasDe()`). Por eso volver a fallar no lo baja y acertar si.
 */
let repaso = null;

/** Actualiza las tres barras verticales y los contadores del panel izquierdo. */
function actualizarPanel() {
  const { respondidas, correctas, incorrectas, total } = estado;
  const pct = (valor) => (total === 0 ? 0 : Math.round((valor / total) * 100));

  // Horizontales desde la iteracion 32: crecen a lo ancho, no a lo alto.
  $('#barra-avance').style.width = `${pct(respondidas)}%`;
  $('#barra-incorrectas').style.width = `${pct(incorrectas)}%`;
  $('#barra-correctas').style.width = `${pct(correctas)}%`;

  $('#valor-avance').textContent = respondidas;
  $('#valor-incorrectas').textContent = incorrectas;
  $('#valor-correctas').textContent = correctas;

  // Cada barra lleva ahora su propio porcentaje al lado de su cifra. Es lo que la
  // vuelve legible sin color: la fila se explica sola.
  $('#pct-avance').textContent = `${pct(respondidas)}%`;
  $('#pct-incorrectas').textContent = `${pct(incorrectas)}%`;
  $('#pct-correctas').textContent = `${pct(correctas)}%`;

  $('#total-preguntas').textContent = total;

  const restantes = total - respondidas;

  // El primer caso no es cosmetico: con la pagina recien abierta no hay ninguna
  // «primera pregunta» que responder, y decirlo seria mandar al estudiante a
  // hacer algo que todavia no puede hacer.
  //
  // Y EL CASO DE LA CARGA VA PRIMERO (iteracion 35). Sin el, durante toda la
  // espera el panel decia «Responde la primera pregunta para comenzar.» mientras
  // la zona de preguntas decia que todavia estaba cargando: las dos mitades de la
  // pantalla contando cosas distintas del mismo momento, y una de ellas mandando a
  // hacer algo que no se puede hacer todavia. Es el mismo defecto que ADR-033 y
  // ADR-032 existen para impedir. No sale de una bandera propia: sale del mismo
  // registro del que sale todo lo demas de la transicion.
  const carga = transicion.enCurso();

  $('#mensaje-avance').textContent = carga
    ? TITULO_DE_LA_CARGA(carga.dato)
    : estado.modulo === null
      ? 'Elige un módulo para comenzar.'
      : respondidas === 0
        ? 'Responde la primera pregunta para comenzar.'
        : restantes === 0
          ? `¡Terminaste el módulo! Acertaste ${correctas} de ${total}.`
          : `Te quedan ${restantes} preguntas por responder.`;

  // Y la fila del indice de este modulo cuenta lo mismo que estas barras, porque
  // es lo dibujado lo que manda mientras el modulo esta abierto (decision 9 de la
  // iteracion 33). Con nada cargado se olvida: las siete filas vuelven a contar
  // sobre el resumen. El indice solo se repinta si la cifra cambio de verdad.
  fijarAvanceDibujado(bancoCargado ? estado.modulo : null, respondidas, total);

  // Los dos numeros del repaso salen de aca porque de aca salen todos: N cambia
  // exactamente cuando cambian las barras, y son la misma cuenta mirada de dos
  // maneras. Llevarlos por separado seria abrir la puerta a que digan cosas
  // distintas sobre el mismo modulo.
  const vigentes = vigentesDelModulo();
  actualizarContadorDeArriba(vigentes);
  actualizarBotonDelRepaso(vigentes);
}

/**
 * Lo que dice la pagina despues de responder.
 *
 * Sale de aqui y no de dos sitios porque hay dos caminos que llegan al mismo
 * estado: responder ahora, y restaurar lo respondido en otra visita. Si cada uno
 * escribiera su propia frase, el dia que una cambie el estudiante veria una cosa al
 * responder y otra al volver.
 */
const veredictoDibujado = (acerto) =>
  acerto
    ? `${icon('task-alt', 'text-base text-esmeralda mt-0.5')}<span>Correcto. Sigue así.</span>`
    : `${icon('lightbulb', 'text-base text-jsyellow mt-0.5')}<span>La alternativa correcta está marcada en amarillo.</span>`;

/**
 * Si esta pregunta trae algo que explicar.
 *
 * El esquema deja la columna nula (`d1/migraciones/001-banco-de-preguntas.sql`) y
 * quien vigila que ninguna activa se quede sin justificacion es
 * `d1/verificar-banco.sql`, no la validacion por fila del camino de lectura: una
 * pregunta SIN justificacion puede llegar al navegador. Hoy no llega ninguna —368 de
 * 368 la traen—, y por eso mismo la unica forma de saber que este caso se trata bien
 * es provocarlo.
 *
 * Se mira el dato y no el nodo dibujado. Preguntarle al DOM «¿hay un recuadro?»
 * responderia que si en el momento justo en que se acaba de dibujar vacio.
 */
const tieneJustificacion = (pregunta) =>
  typeof pregunta?.justificacion === 'string' && pregunta.justificacion.trim() !== '';

/**
 * El contenido del recuadro del porque. **Texto de la base: se escapa siempre.**
 *
 * Sale de aqui y no de dos sitios por el mismo motivo que `veredictoDibujado()`: hay
 * dos caminos que llegan al mismo recuadro —responder ahora, y pulsar «Ver por qué»
 * en una pregunta de otra visita— y si cada uno armara su propio HTML, el dia que
 * uno cambie el estudiante veria una cosa al responder y otra al desplegar.
 *
 * NI UN GRIS, Y NO ES CASUALIDAD
 *
 * La iteracion 36 dejo `mutedink` y `muted` a 1,19:1 entre si, asi que la jerarquia
 * ya no se puede expresar con dos grises (decision 5 bis de la 36). Este recuadro no
 * usa ninguno de los dos: se distingue por el fondo —`panel2` dentro de una tarjeta
 * `panel`—, por el borde y por el rotulo en amarillo y en negrita. Los dos textos van
 * en color principal sobre ese fondo: 13,01:1 el rotulo y 16,40:1 el cuerpo.
 */
const justificacionDibujada = (pregunta) => `
              <p class="font-display font-bold text-jsyellow text-[11px] uppercase tracking-widest">Por qué</p>
              <p class="mt-1.5 text-sm text-paper leading-relaxed">${esc(pregunta.justificacion)}</p>`;

/**
 * El recuadro del porque, en el estado que corresponda, o nada.
 *
 * Tres estados, y el cuarto es no dibujar nada:
 *
 *   - **sin responder**: el recuadro va vacio y oculto. Lo llena `responder()`.
 *   - **respondida en esta visita**: desplegado y lleno (decision 6).
 *   - **restaurada de otra visita**: «Ver por qué», y el recuadro vacio y oculto.
 *   - **sin justificacion**: no se dibuja ni el recuadro ni el boton. Ni hueco vacio
 *     ni un control que no despliegue nada.
 *
 * EL RECUADRO SE DIBUJA VACIO, TAMBIEN EN LAS RESTAURADAS
 *
 * Podria venir lleno y solo destaparse al pulsar. No viene, y es la misma razon por
 * la que existe «Ver por qué»: un modulo de 61 preguntas respondidas cargaria 61
 * justificaciones que nadie pidio leer. Se insertan cuando se piden, por el unico
 * camino que las inserta, que es el que se comprueba.
 */
function porqueDibujado(pregunta, respondida, enLaVisita) {
  if (!tieneJustificacion(pregunta)) return '';

  const id = `justificacion-q${esc(pregunta.id)}`;

  // `tabindex="-1"` para poder llevar el foco aca al desplegar: el boton que lo
  // tenia desaparece en ese mismo acto, y sin esto el foco caeria al body.
  // EL RIEL AMARILLO NO ES ADORNO. El fondo `panel2` dentro de una tarjeta `panel`
  // los separa a 1,08:1, o sea nada: en escala de grises el recuadro desapareceria y
  // la justificacion se leeria como un parrafo mas de la pregunta. El riel es lo que
  // lo delimita sin depender del color, y es el mismo que ya lleva el veredicto
  // —quedan uno debajo del otro, como una sola franja— porque son la misma cosa: lo
  // que la pagina responde despues de responder.
  const recuadro = (abierto) => `
            <div id="${id}" tabindex="-1" aria-live="polite"
                 class="quiz-justificacion${abierto ? '' : ' hidden'} mt-3 bg-panel2 border-l-2 border-jsyellow rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-jsyellow/40">${
                   abierto ? justificacionDibujada(pregunta) : ''
                 }</div>`;

  if (respondida && !enLaVisita) {
    return `
            <button type="button" class="quiz-ver-porque mt-3 inline-flex items-center gap-2 border border-jsyellow/40 text-jsyellow font-display font-bold text-xs px-3 py-2 rounded hover:border-jsyellow transition-colors"
                    aria-controls="${id}">
              ${icon('lightbulb', 'text-base')}<span>Ver por qué</span>
            </button>${recuadro(false)}`;
  }

  return recuadro(Boolean(respondida));
}

/**
 * La pregunta a la que pertenece un boton, y la alternativa que se pulso.
 *
 * Se resuelve contra `bancoCargado` y no contra el DOM a proposito: el texto que
 * hay que guardar es el del banco, sin escapar. Sacarlo del HTML obligaria a
 * desescaparlo, y ese viaje de ida y vuelta es justo donde se cuela un `&amp;` en
 * la memoria del estudiante para no volver a coincidir con nada nunca.
 *
 * Devuelve null si no se puede identificar, y quien llama sigue adelante sin
 * guardar: responder tiene que funcionar igual aunque la memoria no pueda anotarlo.
 */
function deDondeSalio(boton) {
  const pregunta = preguntaDeLaTarjeta(boton.closest?.('[data-pregunta]'));
  const alternativaId = Number(boton.dataset?.alternativa);

  if (!pregunta || !Number.isInteger(alternativaId)) return null;

  const alternativa = pregunta.alternativas.find((a) => a.id === alternativaId);
  return alternativa ? { pregunta, alternativa } : null;
}

/**
 * La pregunta del banco cargado a la que pertenece una tarjeta dibujada.
 *
 * Se resuelve contra `bancoCargado` y no contra el HTML, por lo mismo que
 * `deDondeSalio()`: lo dibujado esta escapado, y volver a leerlo de ahi obligaria a
 * desescaparlo para recuperar el texto original. La tarjeta solo aporta el id.
 */
function preguntaDeLaTarjeta(item) {
  if (!bancoCargado) return null;

  const preguntaId = Number(String(item?.dataset?.pregunta ?? '').replace(/^q/, ''));
  if (!Number.isInteger(preguntaId)) return null;

  for (const grupo of bancoCargado) {
    for (const pregunta of grupo.preguntas) {
      if (pregunta.id === preguntaId) return pregunta;
    }
  }

  return null;
}

/**
 * Despliega el porque de una pregunta restaurada, a peticion del estudiante.
 *
 * DOS COSAS DEL COMO, Y LAS DOS SON PARTE DE LA DECISION
 *
 * **El boton se esconde al desplegar.** Su texto es «Ver por qué» y no cambia
 * (decision 6 de la iteracion 34), asi que dejarlo puesto seria dejar un control que
 * ya no hace nada ofreciendo hacer lo que acaba de ocurrir.
 *
 * **Y por eso el foco tiene que irse a alguna parte.** Quien pulso con teclado tenia
 * el foco en ese boton; si desaparece sin mas, el foco cae al `body` y hay que
 * tabular desde el principio de la pagina. Va al recuadro, que es lo que se acaba de
 * abrir y lo que se queria leer. `preventScroll` por lo mismo que en
 * `irALaCabecera()`: enfocar desplaza por su cuenta y el recuadro ya esta a la vista.
 */
function desplegarElPorque(boton) {
  const item = boton.closest?.('[data-pregunta]');
  const pregunta = preguntaDeLaTarjeta(item);

  if (!pregunta || !tieneJustificacion(pregunta)) return;

  const porque = $('.quiz-justificacion', item);
  porque.innerHTML = justificacionDibujada(pregunta);
  porque.classList.remove('hidden');

  boton.classList.add('hidden');
  porque.focus?.({ preventScroll: true });
}

/** Marca la alternativa elegida, revela la correcta y anota la respuesta. */
function responder(boton) {
  const item = boton.closest('[data-pregunta]');
  const acerto = boton.dataset.correct === 'true';

  $$('.quiz-option', item).forEach((opcion) => {
    opcion.disabled = true;
    const marca = opcion.querySelector('.quiz-mark');

    if (opcion.dataset.correct === 'true') {
      opcion.dataset.state = 'correct';
      marca.innerHTML = icon('check-circle');
      marca.classList.remove('opacity-0');
    } else if (opcion === boton) {
      opcion.dataset.state = 'wrong';
      marca.innerHTML = icon('cancel');
      marca.classList.remove('opacity-0');
    } else {
      opcion.dataset.state = 'dimmed';
    }
  });

  // La misma marca que deja el dibujo restaurado, para que las dos visitas se
  // vean iguales y para que se pueda comprobar cual se eligio.
  boton.dataset.elegida = 'true';

  const aviso = $('.quiz-feedback', item);
  aviso.classList.remove('hidden');
  aviso.innerHTML = veredictoDibujado(acerto);

  item.dataset.answered = 'true';

  const origenDelClic = deDondeSalio(boton);

  // La justificacion aparece SIEMPRE al responder, se acierte o no (decision 2 de la
  // iteracion 34): explicar solo los errores le quitaria el porque a quien acerto
  // por descarte o por suerte.
  //
  // Se pregunta por el dato y no por el nodo: `porqueDibujado()` no dibuja recuadro
  // cuando la pregunta llega sin justificacion, y buscarlo en el DOM para decidir
  // haria depender la conducta de lo que se acaba de dibujar en vez del contenido.
  if (origenDelClic && tieneJustificacion(origenDelClic.pregunta)) {
    const porque = $('.quiz-justificacion', item);
    porque.innerHTML = justificacionDibujada(origenDelClic.pregunta);
    porque.classList.remove('hidden');
  }

  // Se guarda AQUI, al responder, y no al cambiar de modulo ni al salir: cerrar la
  // pestana a mitad de un modulo no puede perder nada, y la memoria no puede
  // depender de que el estudiante salga por una puerta concreta.
  //
  // Se guarda el texto de la alternativa, nunca el veredicto: el veredicto se
  // vuelve a calcular al restaurar, contra el banco que este vigente ese dia.
  if (origenDelClic) {
    guardarRespuesta(estado.modulo, origenDelClic.pregunta.id, origenDelClic.alternativa.texto);

    // Dentro del repaso, esta pregunta deja de dibujarse sin marcar. Sigue a la
    // vista con su veredicto y su justificacion hasta que el estudiante salga, se
    // haya acertado (decision 3) o vuelto a fallar (decision 9): en el telefono,
    // una pregunta que desaparece bajo el dedo se lleva el texto que se estaba
    // leyendo.
    if (repaso) repaso.respondidas.add(origenDelClic.pregunta.id);
  }

  // LAS TRES BARRAS SE RECUENTAN, NO SE SUMAN.
  //
  // Sumar de a uno estaba bien mientras responder fuera irrepetible. En el repaso no
  // lo es: la misma pregunta se responde por segunda vez, y `respondidas += 1` la
  // contaria dos veces —62 de 61— y dejaria su primer veredicto sumado para siempre
  // en la barra equivocada. Recontar contra la memoria y el banco da el mismo
  // resultado que repintar, que es de donde salen las barras al volver al modulo:
  // dos formas de llegar al mismo numero no pueden divergir si es el mismo calculo.
  //
  // Se recuenta SIEMPRE, tambien si `deDondeSalio()` no encontro nada. Hubo un rato
  // una rama que en ese caso sumaba a mano, y era un camino muerto: toda alternativa
  // dibujada lleva su `data-alternativa`, y su pregunta su `data-pregunta`, asi que
  // desde un navegador no se puede llegar ahi. Lo unico que sostenia esa rama era un
  // guion que fabricaba un boton sin esos atributos, o sea una prueba comprobando
  // una pantalla que no existe.
  recontarElModulo(vigentesDelModulo());

  // Responder es el unico de los cuatro caminos que dejan obsoleto el mensaje del
  // repaso que NO vuelve a dibujar. Si no se retirara aca, un «todavía no respondes
  // ninguna pregunta» se quedaria encima de una pregunta recien respondida.
  olvidarElAvisoDelRepaso();

  actualizarPanel();
}

/**
 * Agrupa la lista plana del extremo en secciones por modulo.
 *
 * Desde la iteracion 31 la lista trae un solo modulo y el resultado es un grupo
 * unico. La funcion se conserva agrupando igual, y no se simplifica a «un modulo,
 * una seccion», por un motivo concreto: si algun dia el extremo devolviera una
 * fila de otro modulo, dibujar dos secciones lo deja a la vista en vez de
 * mezclarlo dentro de la cabecera equivocada.
 */
function agruparPorModulo(preguntas) {
  const grupos = [];
  let actual = null;

  for (const pregunta of preguntas) {
    if (!actual || actual.numero !== pregunta.modulo) {
      actual = {
        numero: pregunta.modulo,
        titulo: pregunta.modulo_titulo,
        icono: pregunta.modulo_icono,
        preguntas: [],
      };
      grupos.push(actual);
    }
    actual.preguntas.push(pregunta);
  }

  return grupos;
}

/**
 * Dibuja una alternativa. Su texto viene de la base: se escapa siempre.
 *
 * `elegida` es la alternativa que el estudiante ya habia respondido en otra visita,
 * o null si la pregunta esta sin responder. Con ella, la alternativa sale ya
 * marcada: es asi como se restaura el avance, dibujandolo, y no simulando clics
 * despues de dibujar.
 *
 * `data-alternativa` lleva el id de la fila, que es lo unico que hace falta para
 * volver a encontrarla en el banco cargado al pulsarla. **El id no se guarda en la
 * memoria del estudiante** —cambia con cada correccion del banco, ver
 * servicios/memoria.js—: vive en el HTML y muere con el, que es un sitio donde
 * cambiar de id no le hace dano a nadie.
 */
function dibujarAlternativa(alternativa, elegida) {
  const esCorrecta = alternativa.es_correcta === 1;
  const esLaElegida = elegida !== null && alternativa.id === elegida.id;

  if (elegida === null) {
    return `
              <button type="button" class="quiz-option flex items-start gap-3 text-left w-full border border-panel3 rounded-lg px-4 py-3 text-sm text-paper/90 hover:border-jsyellow transition-colors"
                      data-correct="${esCorrecta}" data-alternativa="${esc(alternativa.id)}">
                <span class="quiz-mark text-lg opacity-0 shrink-0">${icon('check-circle')}</span>
                <span>${esc(alternativa.texto)}</span>
              </button>`;
  }

  // Las mismas tres marcas que deja responder(), y por el mismo orden: la correcta
  // siempre se revela, la elegida se senala si no lo era, y el resto se apaga.
  const estadoVisual = esCorrecta ? 'correct' : esLaElegida ? 'wrong' : 'dimmed';
  const marca = esCorrecta ? icon('check-circle') : esLaElegida ? icon('cancel') : '';
  const opacidad = estadoVisual === 'dimmed' ? 'opacity-0' : '';

  return `
              <button type="button" disabled class="quiz-option flex items-start gap-3 text-left w-full border border-panel3 rounded-lg px-4 py-3 text-sm text-paper/90 transition-colors"
                      data-correct="${esCorrecta}" data-alternativa="${esc(alternativa.id)}"
                      data-state="${estadoVisual}"${esLaElegida ? ' data-elegida="true"' : ''}>
                <span class="quiz-mark text-lg ${opacidad} shrink-0">${marca}</span>
                <span>${esc(alternativa.texto)}</span>
              </button>`;
}

/**
 * Dibuja una pregunta con sus alternativas.
 *
 * El barajado es de ADR-006, y la excepcion es `orden_fijo`: la pregunta cuya
 * alternativa (d) dice «Ambas B y C son correctas» pierde el sentido si se
 * mueven de sitio. Por ADR-019 la correcta va atada a la alternativa y no a su
 * posicion, asi que barajar no rompe nada y aca no hace falta ninguna rama
 * especial mas alla de decidir si se baraja o no.
 */
function dibujarPregunta(pregunta, numero, respondida, enLaVisita) {
  const orden =
    pregunta.orden_fijo === 1
      ? pregunta.alternativas.slice().sort((a, b) => a.orden - b.orden)
      : shuffle(pregunta.alternativas);

  const elegida = respondida?.alternativa ?? null;
  const alternativas = orden.map((a) => dibujarAlternativa(a, elegida)).join('');

  // El barajado de ADR-006 y la memoria no se estorban: lo guardado es el TEXTO de
  // la alternativa, asi que da igual en que posicion le toque salir hoy.
  const veredicto = respondida
    ? `<p class="quiz-feedback mt-4 text-sm text-muted border-l-2 border-jsyellow pl-3 flex gap-2">${veredictoDibujado(respondida.acerto)}</p>`
    : '<p class="quiz-feedback hidden mt-4 text-sm text-muted border-l-2 border-jsyellow pl-3 flex gap-2"></p>';

  return `
          <li class="bg-panel border border-panel3 rounded-xl p-5 sm:p-6" data-pregunta="q${pregunta.id}"${respondida ? ' data-answered="true"' : ''}>
            <div class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-mutedink shrink-0">${String(numero).padStart(2, '0')}</span>
              <p class="font-display font-bold text-paper leading-snug">${esc(pregunta.enunciado)}</p>
            </div>
            <div class="mt-4 grid gap-2">${alternativas}</div>
            ${veredicto}${porqueDibujado(pregunta, respondida, enLaVisita)}
          </li>`;
}

/**
 * Dibuja la seccion de un modulo, con lo respondido ya puesto.
 *
 * `respondida` y `enLaVisita` llegan como funciones y no como Map y Set, porque en el
 * repaso la respuesta a las dos preguntas cambia: una pregunta respondida hace diez
 * minutos se dibuja SIN MARCAR ahi dentro, para poder reintentarla. Quien decide eso
 * es `pintar()`; aca solo se dibuja lo que diga.
 *
 * `aDibujar` puede ser menos que `grupo.preguntas` —en el repaso lo es—, pero la
 * cabecera sigue contando el MODULO: es la cabecera del modulo, no la de la lista, y
 * un «6» bajo el titulo del Modulo 3 se leeria como el tamano del modulo. El numero
 * del repaso vive arriba, en su contador (decision 8).
 */
function dibujarGrupo(grupo, aDibujar, respondida, enLaVisita) {
  const preguntas = aDibujar
    .map((pregunta, i) => dibujarPregunta(pregunta, i + 1, respondida(pregunta), enLaVisita(pregunta)))
    .join('');

  return `
      <section class="scroll-mt-24" id="grupo-modulo-${esc(grupo.numero)}">
        <header id="cabecera-modulo-${esc(grupo.numero)}" tabindex="-1" class="sticky top-16 z-10 -mx-1 px-1 py-3 bg-ink/95 backdrop-blur flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-jsyellow/40 rounded">
          <span class="grid place-items-center w-9 h-9 rounded-lg bg-panel2 text-jsyellow shrink-0">${icon(grupo.icono, 'text-xl')}</span>
          <span class="font-display font-bold text-jsyellow text-sm shrink-0">Módulo ${esc(grupo.numero)}</span>
          <span class="font-display font-semibold text-paper text-sm truncate">${esc(grupo.titulo)}</span>
          <span class="ml-auto font-mono text-[11px] text-mutedink shrink-0">${grupo.preguntas.length}</span>
        </header>${grupo.numero === estado.modulo ? avisoDelRepasoDibujado() : ''}
        <ul class="mt-3 grid gap-4">${preguntas}</ul>
      </section>`;
}

/**
 * Aviso de que lo que se esta viendo sale de la instantanea y no de la base.
 *
 * El aviso entero —la frase, la fecha, el recuadro— se fue a
 * `components/aviso-de-respaldo.js` en la iteracion 41, etapa B, porque el simulacro
 * necesita el mismo. Lo que queda aqui es lo unico que de verdad es del
 * cuestionario: **cual de sus dos fuentes cayo a la copia**, y como se nombra la
 * pagina dentro de la frase.
 *
 * Basta con que UNA de las dos venga de la copia. Ver `origen`.
 */
function mostrarAvisoRespaldo() {
  mostrarAvisoDeRespaldo({
    sello: origen.resumen ?? origen.modulo,
    loQueSeCargo: 'el cuestionario',
  });
}

/**
 * Aviso de que este navegador no deja guardar el avance.
 *
 * Va en la zona de preguntas, al lado del aviso de ADR-008 y por el mismo motivo:
 * el panel de la izquierda ya esta contabilizado al milimetro desde ADR-032 —la
 * ventana de 700 px de alto tiene que seguir alcanzando todo—, y un aviso que solo
 * aparece en un caso raro no puede empujar el indice fuera de pantalla para los
 * demas. Aca no le quita sitio a nada mientras no exista.
 *
 * Y se dice, no se calla. El sitio sigue sirviendo sin memoria —se elige modulo, se
 * responde, se corrige— y lo unico que se pierde es el recuerdo entre visitas. Pero
 * un estudiante que responde treinta preguntas y las pierde al recargar, sin que
 * nadie se lo hubiera advertido, tiene todo el derecho a pensar que el sitio esta
 * roto. Es el mismo argumento de ADR-008: degradar si, en silencio no.
 */
function mostrarAvisoAlmacenamiento() {
  const contenedor = $('#aviso-almacenamiento');
  if (!contenedor) return;

  if (sePuedeGuardar()) {
    contenedor.innerHTML = '';
    contenedor.classList.add('hidden');
    return;
  }

  contenedor.innerHTML = `
      <div class="flex items-start gap-3 border border-panel3 bg-panel rounded-xl px-5 py-4">
        ${icon('restart-alt', 'text-xl text-jsyellow shrink-0 mt-0.5')}
        <div>
          <p class="font-display font-bold text-paper text-sm">Tu avance no se está guardando.</p>
          <p class="mt-1 text-sm text-muted">Este navegador no permite guardar datos del sitio: puede ser el bloqueo de cookies o que el almacenamiento esté lleno. Puedes practicar igual y las respuestas se corrigen como siempre, pero al recargar la página el módulo va a empezar de cero.</p>
        </div>
      </div>`;

  contenedor.classList.remove('hidden');
}

/**
 * Mensaje a pantalla completa cuando no hay preguntas que dibujar.
 *
 * `pie` es marcado escrito aqui dentro, no dato: es el unico parametro que NO se
 * escapa, y por eso lleva ese nombre y no «detalle2». Quien lo use con algo que
 * venga de la capa de datos rompe la regla del archivo.
 */
function dibujarMensaje(contenedor, nombreIcono, titulo, detalle, pie = '', encabezado = '') {
  contenedor.innerHTML = `${encabezado}
      <div id="mensaje-cuestionario" tabindex="-1" class="bg-panel border border-panel3 rounded-xl p-8 text-center focus:outline-none focus:ring-2 focus:ring-jsyellow/40">
        <span class="grid place-items-center w-12 h-12 mx-auto rounded-lg bg-panel2 text-jsyellow">${icon(nombreIcono, 'text-2xl')}</span>
        <p class="mt-4 font-display font-bold text-paper">${esc(titulo)}</p>
        <p class="mt-2 text-sm text-muted">${esc(detalle)}</p>
        ${pie}
      </div>`;
}

/**
 * El estado vacio con el que arranca la pagina.
 *
 * Lleva un enlace al indice, y no es un adorno: en telefono las dos columnas se
 * apilan y este mensaje queda por debajo del panel entero, de modo que «elige un
 * modulo arriba» manda a desplazarse a ciegas. El enlace cierra esa distancia. En
 * escritorio sobra, porque el indice esta a la vista en la mitad izquierda, y no
 * molesta.
 *
 * Y AQUI SE DICE QUE EL AVANCE ES DE ESTE DISPOSITIVO (iteracion 33)
 *
 * Porque este mensaje es lo primero que se ve en cada visita —la pagina arranca
 * vacia y se queda asi hasta que el estudiante elige—, y porque el panel de la
 * izquierda no tiene sitio que regalar (ADR-032, la ventana de 700 px). Se dice
 * antes de que el estudiante invierta media hora de respuestas, no despues de
 * perderlas: el avance no viaja a ninguna parte, y eso tiene una cara buena —nadie
 * lo ve, no hay cuenta ni registro— y una mala —no esta en el telefono si se
 * respondio en el computador, y se va con los datos del navegador—. Las dos se
 * dicen en la misma frase, que es lo honesto.
 */
function mostrarEstadoVacio(contenedor) {
  dibujarMensaje(
    contenedor,
    'quiz',
    'Elige un módulo para empezar.',
    'En el panel está el índice con los siete módulos del examen. Cuando elijas uno, sus preguntas aparecen acá.',
    // El enfasis de «solo en este dispositivo» ya no se apoya en el salto de
    // `mutedink` a `muted` (decision 5 bis de la iteracion 36). Con `mutedink`
    // corregido a #8E8C7A los dos grises quedaron a 1,19:1 entre si, y esa
    // diferencia dejo de verse: era el unico enfasis del sitio que dependia solo
    // de ella. Pasa a peso de letra y color principal, que ademas funciona sin
    // color, igual que las barras de la iteracion 32.
    `<p class="mt-4 text-sm text-mutedink max-w-prose mx-auto">
         Tu avance se guarda <strong class="font-semibold text-paper">solo en este dispositivo</strong>: no se envía a ningún servidor y no hace falta crear ninguna cuenta. Por lo mismo, no lo vas a encontrar en otro equipo ni si borras los datos del navegador.
       </p>
       <a href="#indice-modulos" data-ir-al-indice
          class="mt-5 inline-flex items-center gap-2 border border-panel3 text-paper font-display font-bold text-xs px-4 py-2.5 rounded hover:border-jsyellow transition-colors">
         ${icon('layers', 'text-base text-jsyellow')}Ir al índice de módulos
       </a>`,
    // Sin modulo cargado no hay cabecera bajo la cual poner nada, y el estado vacio
    // es todo lo que hay en esta zona. El mensaje va ENCIMA de el y no en su lugar:
    // lo que el estudiante necesita justo entonces es el enlace al indice que el
    // estado vacio ya trae, y reemplazarlo se lo quitaria.
    avisoDelRepasoDibujado()
  );
}

/**
 * Cruza lo guardado con el banco dibujado, y recalcula cada veredicto.
 *
 * **Es el punto donde la memoria no puede mentir**, y por eso esta escrito aparte y
 * no repartido por el dibujo. Tres cosas ocurren aqui, y las tres son la iteracion
 * 33 entera:
 *
 *   1. **Una pregunta que ya no esta dibujada no cuenta.** Si se retiro del banco,
 *      o si la validacion por fila la descarto, no aparece en `grupos` y su
 *      respuesta guardada se ignora sin mas. No se borra de la memoria: puede haber
 *      desaparecido solo hoy —un modo degradado sobre una instantanea vieja, una
 *      carga a medias— y borrarla seria castigar al estudiante por un problema del
 *      banco.
 *
 *   2. **Una alternativa cuyo texto cambio deja la pregunta sin responder.** Es la
 *      consecuencia asumida de anclar en el texto: se pierde una respuesta, y no se
 *      afirma nada falso. La pregunta vuelve a estar contestable.
 *
 *   3. **El veredicto sale de `es_correcta` del banco de hoy**, nunca de lo
 *      guardado, porque lo guardado no lo trae. Si el autor corrigio cual era la
 *      correcta, el estudiante ve el veredicto nuevo.
 */
function restaurarDesdeLaMemoria(grupos, guardadas) {
  const vigentes = new Map();

  for (const grupo of grupos) {
    for (const pregunta of grupo.preguntas) {
      const texto = guardadas.get(pregunta.id);
      if (texto === undefined) continue;

      const alternativa = pregunta.alternativas.find((a) => a.texto === texto);
      if (!alternativa) continue;

      vigentes.set(pregunta.id, { alternativa, acerto: alternativa.es_correcta === 1 });
    }
  }

  return vigentes;
}

/** Lo respondido del modulo cargado, ya cruzado con el banco que se dibujo hoy. */
function vigentesDelModulo() {
  return restaurarDesdeLaMemoria(bancoCargado ?? [], leerAvance(estado.modulo));
}

/**
 * Cuantas de esas preguntas estan FALLADAS hoy.
 *
 * `acerto === false` y no `!acerto`: una pregunta sin responder no esta en el Map, y
 * `!undefined` la contaria como fallada. Serian 61 errores en un modulo en blanco.
 *
 * Se cuenta cada vez, contra el banco y la memoria, y no se lleva un contador aparte.
 * De ahi salen solas las decisiones 3 y 9: acertar baja N porque la pregunta deja de
 * estar fallada, y volver a fallar no lo baja porque sigue estandolo.
 */
const falladasDe = (ids, vigentes) => [...ids].filter((id) => vigentes.get(id)?.acerto === false);

/**
 * Las falladas del modulo cargado, en el orden en que se dibujan.
 *
 * El orden importa: es el que va a tener el repaso, y recorrer `bancoCargado` es lo
 * que lo mantiene igual al del modulo completo. Sacarlas del Map las devolveria en
 * orden de respuesta, que es el orden en que el estudiante se equivoco.
 */
function falladasDelModulo(vigentes) {
  const todas = [];

  for (const grupo of bancoCargado ?? []) {
    for (const pregunta of grupo.preguntas) todas.push(pregunta.id);
  }

  // Pasa por `falladasDe()` y no repite la condicion. Estuvo escrita dos veces
  // durante un rato y se vio enseguida por que no sirve: romper una de las dos
  // dejaba la otra tapando el fallo, y la prueba que tenia que cazarlo pasaba en
  // verde. Una regla, un sitio.
  return falladasDe(todas, vigentes);
}

/**
 * Las tres barras, contadas sobre EL MODULO COMPLETO.
 *
 * Tambien durante el repaso, y es la decision 4: las barras no cambian de
 * significado segun el modo. Por eso se cuenta contra `bancoCargado` —el modulo
 * entero, este dibujado o no— y nunca contra lo que hay en pantalla. La 31 ya
 * corrigio una vez rotulos que decian una cosa y median otra.
 *
 * Y es tambien lo que hace que entrar o salir del repaso no dispare
 * `avisarSiElResumenNoCuadra()`: `estado.total` sigue siendo el del modulo, que es
 * contra lo que el resumen se compara.
 */
function recontarElModulo(vigentes) {
  estado.total = (bancoCargado ?? []).reduce((suma, grupo) => suma + grupo.preguntas.length, 0);
  estado.respondidas = vigentes.size;
  estado.correctas = [...vigentes.values()].filter((r) => r.acerto).length;
  estado.incorrectas = estado.respondidas - estado.correctas;
}

/**
 * Dibuja el modulo que ya esta cargado en memoria, con lo respondido restaurado.
 *
 * Las tres barras salen de aqui y no de un contador que se vaya sumando: se cuentan
 * sobre lo que se acaba de dibujar. Asi «lo dibujado manda» no es una intencion,
 * sino la unica forma que tiene el codigo de contar.
 */
function pintar() {
  const contenedor = $('#cuestionario');
  if (!contenedor || !bancoCargado) return;

  const vigentes = vigentesDelModulo();

  // Lo respondido en esta visita se pregunta aca, en cada repintado, y no se lleva
  // en una variable de este archivo: repintar es exactamente el momento en que la
  // pantalla se reconstruye desde cero, y una copia local seria una segunda verdad
  // que se puede quedar atras.
  const deLaVisita = respondidasEnLaVisita(estado.modulo);

  // En el repaso se dibujan SOLO las preguntas con las que se entro, y las que
  // todavia no se han reintentado salen sin marcar: esa es toda la diferencia entre
  // los dos modos, y cabe en estas dos funciones.
  const respondida = (p) =>
    repaso && !repaso.respondidas.has(p.id) ? undefined : vigentes.get(p.id);

  const enLaVisita = (p) => (repaso ? repaso.respondidas.has(p.id) : deLaVisita.has(p.id));

  contenedor.innerHTML = bancoCargado
    .map((grupo) => {
      const aDibujar = repaso
        ? grupo.preguntas.filter((p) => repaso.ids.has(p.id))
        : grupo.preguntas;

      return aDibujar.length === 0 ? '' : dibujarGrupo(grupo, aDibujar, respondida, enLaVisita);
    })
    .join('');

  recontarElModulo(vigentes);

  // El contador de arriba y el rotulo del boton los pone `actualizarPanel()`, que
  // es quien tiene las cifras al dia. No se repiten aca.
  actualizarPanel();
}

/**
 * El unico control del repaso, en sus dos papeles (decisiones 5 y 10).
 *
 * Fuera del repaso dice «Repasar mis errores (N)», con N a la vista; dentro dice
 * «Volver al módulo completo». **Es el mismo boton**, y eso no es una economia de
 * codigo: es lo que hace imposible que el de entrar se quede visible durante el
 * repaso, y lo que mantiene la fila en tres controles pase lo que pase.
 *
 * El rotulo y el icono se escriben en dos nodos distintos y no con un innerHTML del
 * boton entero, porque el foco puede estar puesto ahi: reescribir el boton lo
 * destruiria, y quien lo acaba de pulsar con teclado se quedaria sin foco.
 *
 * **Con N en cero el boton NO se esconde ni se deshabilita** (decision 5). Esconderlo
 * dejaria al estudiante sin saber que el repaso existe justo en el momento en que
 * todavia no ha respondido nada, que es cuando mas falta hace saberlo.
 */
function actualizarBotonDelRepaso(vigentes = vigentesDelModulo()) {
  const rotulo = $('#repaso-rotulo');
  const icono = $('#repaso-icono');
  if (!rotulo || !icono) return;

  if (repaso) {
    rotulo.textContent = 'Volver al módulo completo';
    icono.innerHTML = icon('swap-horiz', 'text-base');
    return;
  }

  rotulo.textContent = `Repasar mis errores (${falladasDelModulo(vigentes).length})`;
  icono.innerHTML = icon('cancel', 'text-base');
}

/**
 * Lo que responde el boton del repaso cuando no hay nada que repasar, o null.
 *
 * NO VIVE EN EL PANEL, Y ESE ES EL PUNTO (decision 11 de la iteracion 34)
 *
 * Estuvo un rato pegado al boton que lo produce, que es donde uno lo pondria sin
 * pensarlo. Hacia crecer el panel fijo, y ADR-032 contabilizo su coste vertical al
 * milimetro: la ventana de 700 px de alto tiene que seguir alcanzando hasta
 * «Reiniciar el módulo». Es el mismo motivo por el que los dos avisos de la
 * iteracion 33 —el respaldo y el almacenamiento— viven en la zona de preguntas.
 *
 * Se guarda como texto y no como nodo porque la zona de preguntas se reescribe
 * entera en cada dibujo: el nodo no sobrevive, el texto si, y `pintar()` lo vuelve
 * a poner donde corresponde.
 */
let avisoDelRepaso = null;

/**
 * El mensaje, listo para insertar, o nada si no hay ninguno.
 *
 * Lleva el mismo recuadro con riel amarillo que la justificacion, por lo mismo: el
 * fondo `panel2` dentro de esta columna no se distingue por si solo, y el riel lo
 * delimita sin depender del color. `tabindex="-1"` para poder llevarle el foco.
 */
const avisoDelRepasoDibujado = () =>
  avisoDelRepaso === null
    ? ''
    : `
        <p id="aviso-repaso" tabindex="-1" role="status"
           class="mt-3 bg-panel2 border-l-2 border-jsyellow rounded-r-lg px-4 py-3 text-sm text-paper font-semibold focus:outline-none focus:ring-2 focus:ring-jsyellow/40">${esc(avisoDelRepaso)}</p>`;

/**
 * Deja el mensaje puesto en la zona de preguntas y lleva la vista y el foco ahi.
 *
 * Con modulo cargado va **bajo la cabecera del modulo**; sin modulo cargado, en el
 * estado vacio, que es lo unico que hay en esa zona. En los dos casos se dibuja
 * volviendo a dibujar, y no tocando un nodo suelto: asi el mensaje no puede quedar
 * en un sitio que el siguiente dibujo no conozca.
 *
 * El viaje es el mismo que al entrar al repaso, y por el mismo motivo: el mensaje
 * esta en la otra columna, y en telefono queda pantalla y media por debajo del
 * boton que lo produjo. Pulsar y que no pase nada visible es peor que no responder.
 */
function mostrarAvisoDelRepaso(texto) {
  avisoDelRepaso = texto;

  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  if (bancoCargado) pintar();
  else mostrarEstadoVacio(contenedor);

  const aviso = $('#aviso-repaso');
  if (!aviso) return;

  // El nodo se acaba de dibujar visible. Quitarle `hidden` es inofensivo en el
  // navegador y necesario para que un mensaje anterior, escondido por
  // `olvidarElAvisoDelRepaso()`, no se quede escondido al volver a mostrarse.
  aviso.classList.remove('hidden');

  aviso.scrollIntoView?.({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'center',
  });
  aviso.focus?.({ preventScroll: true });
}

/**
 * Retira el mensaje en cuanto deja de describir la situacion (decision 11).
 *
 * Lo llaman los cuatro caminos que la cambian: responder, cambiar de modulo,
 * reiniciar y entrar al repaso. Tres de ellos vuelven a dibujar y se lo llevarian
 * por delante igual; **responder no**, y es justo el que dejaria en pantalla un
 * «todavía no respondes ninguna pregunta» encima de una pregunta recien
 * respondida. Por eso se esconde el nodo ademas de olvidar el texto.
 */
function olvidarElAvisoDelRepaso() {
  if (avisoDelRepaso === null) return;

  avisoDelRepaso = null;
  $('#aviso-repaso')?.classList.add('hidden');
}

/**
 * Entra al repaso, o explica por que no hay a que entrar.
 *
 * LOS DOS MENSAJES SON DISTINTOS A PROPOSITO (decision 5)
 *
 * «No has respondido nada» y «no fallaste ninguna» llevan a cosas distintas: el
 * primero manda a responder, el segundo felicita y no pide nada. Un solo mensaje
 * para los dos —«no hay errores que repasar»— seria verdadero en los dos casos y
 * util en ninguno, porque el estudiante que no ha respondido nada creeria que ya
 * termino.
 */
function entrarAlRepaso() {
  if (!bancoCargado) {
    mostrarAvisoDelRepaso('Elige un módulo en el índice y responde algunas preguntas para poder repasar.');
    return;
  }

  const vigentes = vigentesDelModulo();
  const falladas = falladasDelModulo(vigentes);

  if (falladas.length === 0) {
    mostrarAvisoDelRepaso(
      vigentes.size === 0
        ? 'Todavía no respondes ninguna pregunta de este módulo. Responde algunas y vuelve acá.'
        : 'No tienes errores que repasar: acertaste todas las que llevas respondidas.'
    );
    return;
  }

  // Entrar es una de las cuatro cosas que dejan obsoleto el mensaje: si estaba
  // puesto, decia que no habia nada que repasar.
  olvidarElAvisoDelRepaso();

  repaso = { ids: new Set(falladas), respondidas: new Set() };
  pintar();

  // El foco y el desplazamiento van a la cabecera del modulo, igual que al elegirlo
  // en el indice: la zona de preguntas se acaba de reescribir entera, y quien pulso
  // con teclado se quedaria mirando el panel sin saber que la lista cambio.
  irALaCabecera(estado.modulo);
}

/** Vuelve al modulo completo. Nada de lo respondido se pierde: solo cambia que se dibuja. */
function salirDelRepaso() {
  repaso = null;
  pintar();
  irALaCabecera(estado.modulo);
}

/**
 * Deja el repaso, si estaba abierto, sin dibujar nada.
 *
 * Lo llaman los dos caminos que sacan del repaso sin que el estudiante lo pida
 * —elegir otro modulo en el indice, y reiniciar— porque los dos van a repintar por
 * su cuenta enseguida. **Sin aviso y sin preguntar** (decision 5): con la memoria de
 * la 33 y la de la visita no se pierde nada, y un aviso que no protege de nada
 * entrena a ignorar los avisos, que es lo que ya hizo retirar el de la 31.
 */
function cerrarElRepaso() {
  repaso = null;
}

/**
 * El contador de arriba: el del modulo, o el del repaso mientras dure.
 *
 * **Uno solo, en el mismo sitio** (decision 8). El contador del modulo cuenta lo
 * dibujado, asi que en el repaso habria dicho «6 preguntas» con las barras en 61.
 * Dejar los dos habria puesto en pantalla dos numeros verdaderos que se contradicen
 * a simple vista, que es peor que uno falso: el falso se corrige.
 */
function actualizarContadorDeArriba(vigentes = vigentesDelModulo()) {
  const contenedor = $('#contador-banco');
  if (!contenedor) return;

  if (!repaso) {
    mostrarContador(bancoCargado);
    return;
  }

  const cuantas = falladasDe(repaso.ids, vigentes).length;

  // El texto con N en cero, con preguntas todavia a la vista, queda a criterio de
  // quien implementa. Dice que no queda ninguna y no que el repaso termino, porque
  // lo que hay en pantalla sigue ahi hasta que el estudiante decida salir.
  const dice =
    cuantas === 0
      ? 'No te queda ninguna fallada por repasar'
      : cuantas === 1
        ? 'Te queda 1 pregunta fallada por repasar'
        : `Te quedan ${cuantas} preguntas falladas por repasar`;

  contenedor.innerHTML = `${icon('cancel', 'text-base')}<span>${esc(dice)}</span>`;
  contenedor.classList.remove('hidden');
  contenedor.classList.add('inline-flex');
}

/**
 * Escribe el contador de la portada con lo que DE VERDAD se dibujo.
 *
 * Estuvo escrito a mano en el HTML —«105 preguntas · 7 modulos»— y el 2026-09-08
 * la pantalla mostraba «105 preguntas» arriba y «copia guardada en el sitio (8
 * preguntas)» en el pie, al mismo tiempo. Un numero que no sale del dato que
 * acompana es un numero que va a mentir tarde o temprano, y este mintio.
 *
 * Se llama en todos los finales de mostrarModulo(), tambien en los que no dibujan
 * preguntas, y en el estado vacio: si no hay nada que contar, el contador se
 * esconde. **Ningun numero es mejor que un numero falso.**
 *
 * Desde la iteracion 31 cuenta un modulo y no el banco, asi que dice tambien cual:
 * «52 preguntas · módulo 2». Sin esa segunda mitad el mismo numero podria leerse
 * como el tamano del banco entero, que es la confusion que este contador existe
 * para evitar.
 */
function mostrarContador(grupos) {
  const contenedor = $('#contador-banco');
  if (!contenedor) return;

  const preguntas = grupos
    ? grupos.reduce((suma, grupo) => suma + grupo.preguntas.length, 0)
    : 0;

  if (preguntas === 0) {
    contenedor.innerHTML = '';
    contenedor.classList.add('hidden');
    contenedor.classList.remove('inline-flex');
    return;
  }

  const contar = (cantidad, singular, plural) =>
    `${cantidad} ${cantidad === 1 ? singular : plural}`;

  // Los modulos se cuentan de los datos, no del indice: si alguna vez llegara
  // una fila de otro modulo, el contador lo diria en vez de taparlo.
  const cual =
    grupos.length === 1
      ? `módulo ${grupos[0].numero}`
      : contar(grupos.length, 'módulo', 'módulos');

  contenedor.innerHTML =
    `${icon('quiz', 'text-base')}<span>${esc(contar(preguntas, 'pregunta', 'preguntas'))} · ${esc(cual)}</span>`;

  contenedor.classList.remove('hidden');
  contenedor.classList.add('inline-flex');
}

/**
 * Deja al estudiante en la cabecera del modulo recien cargado.
 *
 * POR QUE HACE FALTA, Y NO BASTA CON DIBUJAR
 *
 * Hasta la iteracion 32 esto no existia: se elegia un modulo y la pagina lo
 * dibujaba sin moverse. Eso funciona solo si las preguntas ya estan a la vista, y
 * no lo estan en ninguna de las dos formas en que se usa el sitio:
 *
 *   - En telefono las dos columnas se apilan y las preguntas quedan pantalla y
 *     media por debajo del indice. Elegir un modulo no mostraba nada: habia que
 *     adivinar que tocaba desplazarse.
 *   - En escritorio el panel es pegajoso, asi que se puede elegir un modulo con
 *     la pagina ya desplazada. La zona derecha se reescribe entera y el
 *     desplazamiento se queda donde estaba: el estudiante aterriza a mitad de un
 *     modulo que acaba de empezar.
 *
 * Decision del autor, 2026-09-11. Se aplica igual venga el cambio directo del
 * indice o del boton «Cambiar de módulo» del aviso, porque el problema es el
 * mismo por los dos caminos.
 *
 * DOS COSAS DEL COMO
 *
 * `prefers-reduced-motion` manda sobre el desplazamiento suave. Y el foco se pide
 * con `preventScroll`, porque enfocar desplaza por su cuenta y esa segunda
 * sacudida pelearia con la primera.
 *
 * Devuelve false si la cabecera no esta —carga fallida o modulo vacio—, para que
 * quien llama lleve el foco a otra parte en vez de a un sitio que no existe.
 */
function irALaCabecera(numero) {
  // La primera condicion es la que manda, y no la busqueda en el DOM: si no hay
  // modulo cargado no hay cabecera dibujada, se mire donde se mire. Preguntarselo
  // al estado y no al arbol tambien es lo que permite comprobarlo desde Node.
  if (!bancoCargado) return false;

  const seccion = $(`#grupo-modulo-${numero}`);
  const cabecera = $(`#cabecera-modulo-${numero}`);

  if (!seccion || !cabecera) return false;

  seccion.scrollIntoView?.({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });

  cabecera.focus?.({ preventScroll: true });
  return true;
}

/**
 * Lleva el foco al mensaje que explica por que no hay preguntas.
 *
 * Es el otro final de irALaCabecera(): cuando la carga falla o el modulo viene
 * vacio no hay ninguna cabecera a la que ir, y dejar el foco donde estaba —o
 * peor, en el body— deja a quien navega con teclado sin saber que paso. El
 * mensaje si lo explica, asi que el foco va ahi.
 */
function irAlMensaje() {
  $('#mensaje-cuestionario')?.focus?.({ preventScroll: true });
}

// ---------------------------------------------------------------------------
// La puerta unica hacia el cambio de modulo
// ---------------------------------------------------------------------------

/**
 * **La unica puerta por la que se cambia de modulo.**
 *
 * Todo lo que quiera cambiar de modulo pasa por aqui, y eso no es una preferencia
 * de estilo.
 *
 * SU MOTIVO CAMBIO EN LA ITERACION 33, Y LA PUERTA SE QUEDA
 *
 * Hasta la 32, lo que vivia dentro era el aviso de perdida de avance: cambiar de
 * modulo costaba lo respondido, y un segundo camino a `mostrarModulo()` habria
 * perdido el avance del estudiante sin decir nada. Ese aviso se retiro, porque con
 * memoria ya no se pierde nada.
 *
 * La puerta no se retira con el, porque concentra otras tres guardas, y las tres se
 * saltarian **en silencio**, que es la peor forma de romperse:
 *
 *   1. **La doble peticion.** Pulsar el mismo modulo mientras carga no vuelve a
 *      pedirlo. Sin esto, cada toque impaciente son 12 a 17 KB comprimidos —45 a
 *      66 KB sin comprimir— mas por lo mismo, en
 *      una conexion modesta, que es el publico de vision.md.
 *   2. **El reintento tras una carga fallida.** Volver a pulsar el modulo que ya
 *      esta puesto NO hace nada, salvo que no haya quedado puesto. Esa excepcion es
 *      el unico camino de vuelta cuando la capa de datos falla, y sin ella habria
 *      que recargar la pagina.
 *   3. **El viaje a la cabecera.** `mostrarModulo()` deja al estudiante en la
 *      cabecera del modulo, con el foco y el desplazamiento (ADR-032). Un camino
 *      que dibujara por su cuenta dejaria a quien navega con teclado sin saber que
 *      paso.
 *
 * Por eso `mostrarModulo()` es de esta casa y el indice no la conoce: avisa por
 * `conectarIndice()` y quien decide es esta funcion.
 *
 * **Y la memoria no depende de esta puerta.** El avance se guarda al responder, no
 * al salir del modulo: cerrar la pestana a mitad de un modulo no pierde nada. Si la
 * memoria dependiera de pasar por aqui, este seria otra vez el archivo con una sola
 * salida buena y cinco malas.
 */
function pedirCambioDeModulo(numero) {
  // Volver a pulsar el modulo que ya esta puesto no hace nada... salvo que no haya
  // quedado puesto. Si la carga fallo o el modulo vino vacio, `estado.modulo` ya
  // apunta a el y `bancoCargado` sigue en null: entonces pulsarlo es un reintento,
  // y era lo unico que el estudiante podia hacer. Sin esa segunda condicion, el
  // unico camino de vuelta era recargar la pagina. Encontrado en la auditoria de
  // la iteracion 32.
  //
  // Pero «no hay nada cargado» tambien es cierto MIENTRAS carga, y ahi pulsar otra
  // vez no es un reintento: es la misma peticion dos veces. Por eso la tercera
  // condicion. Ver `moduloCargando`.
  if (numero === estado.modulo && (bancoCargado || moduloCargando === numero)) return;

  mostrarModulo(numero);
}

/**
 * Conecta la zona de preguntas: responder, desplegar el porque, y el enlace del
 * estado vacio.
 *
 * Se delega en el contenedor y se ata una sola vez, porque su contenido se
 * reescribe entero cada vez que cambia el modulo y los oyentes de los botones se
 * irian con el.
 */
function conectarCuestionario(contenedor) {
  if (contenedor.dataset.bound) return;

  contenedor.addEventListener('click', (evento) => {
    const irAlIndice = evento.target.closest('[data-ir-al-indice]');
    if (irAlIndice) {
      // El salto por ancla ya desplaza; el foco se mueve a mano para que el
      // teclado y el lector de pantalla lleguen al mismo sitio que el ojo. Va a
      // la primera fila del indice, que es la primera decision que hay que tomar.
      $('#indice-modulos')?.querySelector?.('[data-modulo]')?.focus?.();
      return;
    }

    const verPorQue = evento.target.closest('.quiz-ver-porque');
    if (verPorQue) {
      desplegarElPorque(verPorQue);
      return;
    }

    const boton = evento.target.closest('.quiz-option');
    if (!boton || boton.disabled) return;
    responder(boton);
  });

  contenedor.dataset.bound = 'true';
}

// ---------------------------------------------------------------------------
// Cargar y dibujar un modulo
// ---------------------------------------------------------------------------

/**
 * Pide un modulo a la capa de datos y lo dibuja.
 *
 * Es el unico camino por el que aparecen preguntas en la pagina, y esta exportada
 * a proposito: scripts/probar-escapado.mjs y scripts/probar-filtrado.mjs corren
 * este mismo codigo contra el extremo real y miran el HTML que deja.
 *
 * Los finales posibles se tratan distinto a proposito, y la diferencia es la misma
 * que explica functions/api/_comun.js: una lista vacia es una respuesta correcta y
 * no un fallo, asi que no dispara el respaldo ni se anuncia como error.
 */
export async function mostrarModulo(numero) {
  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  // El registro de la transicion se levanta ANTES de todo lo demas, y con el se
  // estampa el reloj del piso: la decision 5 lo cuenta desde el clic, y esta linea
  // corre en el mismo turno que el clic del indice. Tambien toma el numero de esta
  // peticion, desactiva los dos controles del panel y arma el temporizador del
  // texto lento. Desde la iteracion 41 el numero y el registro salen del mismo
  // acto: no hay forma de pedir uno sin el otro.
  const miPeticion = transicion.abrir(numero);

  moduloCargando = numero;

  // Elegir un modulo deja obsoleto el mensaje del repaso: hablaba del modulo anterior.
  olvidarElAvisoDelRepaso();

  // Elegir un modulo a mitad del repaso sale del repaso, sin preguntar (decision 5).
  // Va aca arriba y no en el indice: `mostrarModulo()` es el unico sitio por el que
  // se cambia de modulo, asi que el repaso no puede sobrevivir a un cambio por
  // ninguna ruta, ni siquiera por una que se escriba manana.
  cerrarElRepaso();

  estado.modulo = numero;
  estado.respondidas = 0;
  estado.correctas = 0;
  estado.incorrectas = 0;
  estado.total = 0;
  bancoCargado = null;

  conectarCuestionario(contenedor);
  mostrarContador(null);
  actualizarPanel();

  // Y aqui se dibuja la transicion, que hasta la iteracion 35 era un mensaje de
  // texto seco. Es UNA sola escritura del contenedor durante toda la espera: el
  // texto lento que pueda venir despues entra en su propio nodo, sin reescribir
  // esto, para no destruir el nodo que en dos lineas mas va a tener el foco.
  transicion.dibujar(numero);

  // El indice marca el modulo pedido YA, antes de saber si va a llegar.
  //
  // Hasta la auditoria de la iteracion 32 esto ocurria solo al final, y solo si la
  // carga salia bien: con una carga fallida, `estado.modulo` apuntaba al modulo
  // nuevo y el indice seguia marcando el anterior. La pantalla contaba dos cosas
  // distintas —la zona derecha decia «no se pudo cargar el Módulo 5» y el indice
  // decia que el activo era el 3— y no habia forma de saber cual creer.
  //
  // El aviso de perdida no se ve afectado: cuando pregunta, todavia no se ha
  // llamado a esta funcion, asi que el indice sigue marcando el modulo de verdad.
  marcarModuloActivo(numero);

  // Y el foco se aparca en ese mensaje mientras se espera. Si venimos del boton
  // «Cambiar de módulo», el boton que lo tenia acaba de ser destruido y el foco
  // estaria en el body durante toda la consulta.
  irAlMensaje();

  const respuesta = await leerPreguntas(numero);

  // Si mientras tanto se pidio otro modulo, esta respuesta ya no es la que la
  // pantalla esta esperando y dibujarla la dejaria mintiendo. Se sale SIN bajar la
  // bandera: la carga que sigue viva es la otra, y es suya.
  //
  // `transicion.cerrar()` se llama igual, y **no hace nada**, porque el registro ya no
  // es de esta peticion. Se llama a proposito: lo que impide que una respuesta
  // vieja apague la transicion del modulo vigente es la guarda por identidad, no
  // el que alguien se acuerde de no llamar aqui. Ver `cargaEnCurso` en
  // components/transicion-de-carga.js.
  if (!transicion.esLaUltima(miPeticion)) {
    transicion.cerrar(miPeticion);
    return;
  }

  // EL PISO, EN UN SOLO SITIO Y PARA LOS CUATRO FINALES (decision 5). Va aqui
  // arriba, antes de repartirse en modulo dibujado, vacio o error, porque «una
  // sola regla» no se puede cumplir escribiendola tres veces.
  await transicion.esperarElPiso();

  // Y hay que volver a preguntar, porque el piso es un `await`: durante esos
  // 400 ms el estudiante pudo elegir otro modulo. Sin esta segunda comprobacion,
  // una carga ya descartada seguiria adelante y dibujaria encima de la vigente.
  if (!transicion.esLaUltima(miPeticion)) {
    transicion.cerrar(miPeticion);
    return;
  }

  // De aqui en adelante esta carga es la vigente y ya termino de viajar, salga
  // bien o mal. Bajar la bandera aqui —y no en cada final— es lo que garantiza que
  // el reintento quede disponible tambien cuando la carga falla.
  moduloCargando = null;

  // Y se apaga la transicion: se cancela el temporizador del texto lento y los dos
  // controles del panel vuelven a estar disponibles. El dibujo de la transicion no
  // hace falta borrarlo, porque los tres finales de mas abajo reescriben el
  // contenedor entero: por construccion no puede quedar colgado.
  transicion.cerrar(miPeticion);

  // Antes de dibujar nada: si esto viene del respaldo, que se vea. Va primero
  // para que el aviso aparezca tambien cuando el modulo venga vacio y la pagina
  // termine en un mensaje en vez de en preguntas.
  origen.modulo = respuesta.meta?.respaldo ?? null;
  mostrarAvisoRespaldo();

  // Los dos finales sin preguntas terminan igual: el foco va al mensaje que
  // explica lo que paso. No hay ninguna cabecera a la que ir, y desplazarse a una
  // que no existe o dejar el foco en el body serian las dos formas de que quien
  // navega con teclado se quede sin saber que ocurrio.
  if (!respuesta.ok) {
    mostrarContador(null);
    dibujarMensaje(
      contenedor,
      'database',
      'No se pudo cargar el módulo.',
      `${respuesta.mensaje} Puedes volver a elegirlo en el índice para reintentar.`
    );
    actualizarPanel();
    irAlMensaje();
    return;
  }

  if (respuesta.vacio) {
    mostrarContador(null);
    dibujarMensaje(
      contenedor,
      'database',
      `El Módulo ${numero} todavía no tiene preguntas.`,
      'El banco está conectado, pero este módulo está vacío. Prueba con otro.'
    );
    actualizarPanel();
    irAlMensaje();
    return;
  }

  bancoCargado = agruparPorModulo(respuesta.datos);
  mostrarContador(bancoCargado);

  // El indice ya quedo marcando este modulo antes de la consulta. Se repinta para
  // que la fila recoja la cifra que el resumen haya aprendido entre medio.
  marcarModuloActivo(numero);

  pintar();

  // Y recien ahora, con las preguntas dibujadas, se lleva al estudiante hasta
  // ellas. Antes de `pintar()` la cabecera no existe todavia.
  irALaCabecera(numero);

  avisarSiElResumenNoCuadra(numero);
}

/**
 * Deja constancia si el indice prometio una cantidad y se dibujo otra.
 *
 * ADR-033 lo anticipa: `?resumen=1` cuenta filas de `pregunta_activa` y
 * `/api/preguntas` valida por fila y puede descartar alguna. Si eso pasara, el
 * indice diria 61 y la pagina dibujaria 60.
 *
 * Aqui no se corrige el numero del indice ni se esconde la diferencia: **lo
 * dibujado manda** y ya es lo que muestran el contador y la cabecera. Lo que se
 * hace es dejarlo dicho en la consola, para que quien mire encuentre el motivo en
 * vez de un descuadre sin explicacion. Y `scripts/probar-filtrado.mjs` lo
 * convierte en un veredicto rojo, que es donde de verdad se caza.
 */
function avisarSiElResumenNoCuadra(numero) {
  const prometidas = conteoDelResumen(numero);
  if (prometidas === undefined) return;

  const dibujadas = estado.total;

  if (prometidas !== dibujadas) {
    console.warn(
      `El indice dice que el modulo ${numero} tiene ${prometidas} preguntas y se ` +
        `dibujaron ${dibujadas}. Manda lo dibujado. Ver ADR-033.`
    );
  }

  // Y lo mismo para el avance (decision 9 de la iteracion 33). Es la otra mitad del
  // mismo descuadre: si una pregunta que el resumen cuenta no llego a dibujarse, y
  // el estudiante la tenia respondida, la cuenta del resumen diria 12 y las barras
  // dirian 11. La fila del indice ya muestra lo dibujado; esto deja dicho por que,
  // para que quien mire la consola encuentre el motivo y no un descuadre a secas.
  const avancePrometido = avanceDelResumen(numero);
  if (avancePrometido !== undefined && avancePrometido !== estado.respondidas) {
    console.warn(
      `El indice contaba ${avancePrometido} respuestas guardadas del modulo ${numero} y se ` +
        `restauraron ${estado.respondidas}. Manda lo dibujado. Ver ADR-033.`
    );
  }
}

/**
 * Deja la pagina lista y vacia, esperando una eleccion.
 *
 * No pide ninguna PREGUNTA: hasta que el estudiante elija un modulo no hay ninguna
 * que pedir, y ese fue el cambio de fondo de la iteracion 31 —antes esta funcion
 * se traia el banco entero, 371,8 KB—.
 *
 * Lo unico que pide es el resumen de los siete conteos y sus ids, que son unos
 * 2,4 KB (ADR-033). El indice se dibuja antes de que llegue, con los nombres de
 * data/modules.js, asi que la pagina es utilizable aunque el resumen tarde o no
 * llegue nunca: lo unico que faltaria son las cifras, y faltar es mejor que
 * inventarlas.
 */
export async function renderCuestionario() {
  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  pintarIndice();
  conectarIndice(pedirCambioDeModulo);
  conectarCuestionario(contenedor);

  mostrarContador(null);
  mostrarEstadoVacio(contenedor);
  mostrarAvisoAlmacenamiento();
  actualizarPanel();

  // El resumen puede caer a la instantanea por su cuenta. Si lo hace, el aviso de
  // ADR-008 aparece AQUI, al abrir la pagina, y no al elegir el primer modulo: el
  // estudiante se entera de que esta viendo una copia antes de ponerse a estudiar,
  // que es lo que esa ADR pide con todas sus letras.
  origen.resumen = await cargarConteos();
  mostrarAvisoRespaldo();
}

/**
 * Conecta el botón que reinicia las respuestas del módulo que se está viendo.
 *
 * **Borra tambien lo guardado de ese modulo**, y es el unico control de borrado que
 * existe (decision 2 de la iteracion 33). Si solo limpiara la pantalla, el
 * estudiante reiniciaria, recargaria, y le volveria todo: un boton que miente.
 *
 * Y borra **solo lo suyo**. Los otros seis modulos no se tocan: quien quiera
 * empezar de cero del todo lo hace modulo por modulo. No hay «borrar todo el
 * avance», y su ausencia es una decision anotada, no un olvido.
 *
 * El orden importa: primero se olvida, despues se dibuja. `pintar()` cuenta las
 * barras sobre lo que restaura de la memoria, asi que dibujar antes de borrar
 * repondria en pantalla justo lo que se acaba de pedir olvidar.
 */
export function setupReinicio() {
  const boton = $('#reiniciar');
  if (!boton) return;

  boton.addEventListener('click', () => {
    // Mientras un modulo carga, este control esta desactivado (decision 6 de la
    // iteracion 35). La guarda va ademas del `disabled`, y no en su lugar: es la
    // mitad que un guion puede provocar. Ver `fijarControles()` en
    // components/transicion-de-carga.js.
    if (transicion.enCurso()) return;

    // Sin modulo cargado no hay nada que reiniciar, y volver a dibujar el estado
    // vacio encima de si mismo solo desplazaria la pagina sin motivo.
    if (!bancoCargado) return;

    olvidarElAvisoDelRepaso();

    // Reiniciar a mitad del repaso sale del repaso y reinicia (decision 5). Primero
    // se sale: `pintar()` dibujaria el subconjunto congelado de un repaso cuyas
    // preguntas acaban de dejar de estar respondidas.
    cerrarElRepaso();

    borrarAvance(estado.modulo);
    pintar();

    // Reiniciar deja al estudiante donde empieza el modulo, no arriba del todo:
    // arriba del todo esta la portada, y desde ahi hay que volver a bajar. Y el
    // desplazamiento suave respeta `prefers-reduced-motion`, que hasta la
    // iteracion 32 esta llamada ignoraba aunque el sitio ya tuviera la utilidad.
    if (!irALaCabecera(estado.modulo)) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });
}

/**
 * Conecta el boton del repaso (iteracion 34).
 *
 * Un solo oyente para los dos papeles del boton, porque es un solo boton: cual de
 * los dos corre lo decide `repaso`, que es el mismo estado que decide el rotulo. Si
 * fueran dos oyentes sobre dos elementos, habria que acordarse de esconder uno.
 *
 * Se llama una vez al arrancar la pagina, y deja el rotulo puesto con la cifra que
 * corresponda —«Repasar mis errores (0)» con la pagina recien abierta—, para que el
 * boton no aparezca a medio escribir mientras no se elige modulo.
 */
export function setupRepaso() {
  const boton = $('#repaso');
  if (!boton) return;

  boton.addEventListener('click', () => {
    // Igual que «Reiniciar el módulo» (decision 6). Este era el peor de los dos:
    // pulsado durante la carga borraba el «Cargando…», ponia «Elige un módulo en
    // el índice…» recien elegido uno, y dejaba ese mensaje encima del modulo al
    // llegar. Ahora no llega a correr.
    if (transicion.enCurso()) return;

    if (repaso) salirDelRepaso();
    else entrarAlRepaso();
  });

  actualizarBotonDelRepaso();
}
