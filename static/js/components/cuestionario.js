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
 * Y de la 3 sale la deuda que esta iteracion tiene que pagar en voz alta: el
 * avance no se guarda hasta la iteracion 33, asi que cambiar de modulo pierde lo
 * respondido. **Se avisa antes, nunca despues.** Eso es pedirConfirmacion().
 */
import { $, $$, esc, shuffle, icon } from '../utils/dom.js';
import { leerPreguntas } from '../servicios/datos.js';
import {
  cargarConteos,
  conectarIndice,
  conteoDelResumen,
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
 * Cual es la peticion vigente.
 *
 * El indice esta libre, asi que el estudiante puede cambiar de modulo mientras el
 * anterior todavia viaja. Sin esto, una respuesta lenta del modulo 3 llegaria
 * despues de la del 5 y dibujaria el 3 sobre el 5, con el indice marcando el 5.
 * Cada llamada toma un numero y, al volver del await, se retira si ya no es la
 * ultima.
 */
let peticionVigente = 0;

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
  $('#mensaje-avance').textContent =
    estado.modulo === null
      ? 'Elige un módulo para comenzar.'
      : respondidas === 0
        ? 'Responde la primera pregunta para comenzar.'
        : restantes === 0
          ? `¡Terminaste el módulo! Acertaste ${correctas} de ${total}.`
          : `Te quedan ${restantes} preguntas por responder.`;
}

/** Marca la alternativa elegida y revela la correcta. */
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

  const aviso = $('.quiz-feedback', item);
  aviso.classList.remove('hidden');
  aviso.innerHTML = acerto
    ? `${icon('task-alt', 'text-base text-esmeralda mt-0.5')}<span>Correcto. Sigue así.</span>`
    : `${icon('lightbulb', 'text-base text-jsyellow mt-0.5')}<span>La alternativa correcta está marcada en amarillo.</span>`;

  item.dataset.answered = 'true';
  estado.respondidas += 1;
  if (acerto) estado.correctas += 1;
  else estado.incorrectas += 1;
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

/** Dibuja una alternativa. Su texto viene de la base: se escapa siempre. */
function dibujarAlternativa(alternativa) {
  return `
              <button type="button" class="quiz-option flex items-start gap-3 text-left w-full border border-panel3 rounded-lg px-4 py-3 text-sm text-paper/90 hover:border-jsyellow transition-colors"
                      data-correct="${alternativa.es_correcta === 1}">
                <span class="quiz-mark text-lg opacity-0 shrink-0">${icon('check-circle')}</span>
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
function dibujarPregunta(pregunta, numero) {
  const orden =
    pregunta.orden_fijo === 1
      ? pregunta.alternativas.slice().sort((a, b) => a.orden - b.orden)
      : shuffle(pregunta.alternativas);

  const alternativas = orden.map(dibujarAlternativa).join('');

  return `
          <li class="bg-panel border border-panel3 rounded-xl p-5 sm:p-6" data-pregunta="q${pregunta.id}">
            <div class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-mutedink shrink-0">${String(numero).padStart(2, '0')}</span>
              <p class="font-display font-bold text-paper leading-snug">${esc(pregunta.enunciado)}</p>
            </div>
            <div class="mt-4 grid gap-2">${alternativas}</div>
            <p class="quiz-feedback hidden mt-4 text-sm text-muted border-l-2 border-jsyellow pl-3 flex gap-2"></p>
          </li>`;
}

/** Dibuja la seccion de un modulo. */
function dibujarGrupo(grupo) {
  const preguntas = grupo.preguntas
    .map((pregunta, i) => dibujarPregunta(pregunta, i + 1))
    .join('');

  return `
      <section class="scroll-mt-24" id="grupo-modulo-${esc(grupo.numero)}">
        <header class="sticky top-16 z-10 -mx-1 px-1 py-3 bg-ink/95 backdrop-blur flex items-center gap-3">
          <span class="grid place-items-center w-9 h-9 rounded-lg bg-panel2 text-jsyellow shrink-0">${icon(grupo.icono, 'text-xl')}</span>
          <span class="font-display font-bold text-jsyellow text-sm shrink-0">Módulo ${esc(grupo.numero)}</span>
          <span class="font-display font-semibold text-paper text-sm truncate">${esc(grupo.titulo)}</span>
          <span class="ml-auto font-mono text-[11px] text-mutedink shrink-0">${grupo.preguntas.length}</span>
        </header>
        <ul class="mt-3 grid gap-4">${preguntas}</ul>
      </section>`;
}

/**
 * Fecha legible en espanol, o null si no hay ninguna que leer.
 *
 * Devolver null y no una cadena vacia es a proposito: quien llama tiene que poder
 * decir «no se sabe de cuando es» en vez de dejar la frase a medias.
 */
function fechaLegible(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha);
}

/**
 * Aviso de que lo que se esta viendo sale de la instantanea y no de la base.
 *
 * ADR-008 lo pide con todas sus letras: el sitio sigue funcionando cuando la capa
 * de datos cae, y **avisa**, nunca en silencio. Por eso el aviso va arriba del
 * banco y no en el pie: el estudiante tiene que saberlo antes de estudiar, no
 * despues.
 *
 * La fecha sale del sello del archivo generado, que es lo que ADR-023 obliga a
 * escribir dentro. Sin ese dato el aviso no podria decir de cuando es la copia, y
 * un «puede no estar al dia» sin fecha no le sirve a nadie para decidir si
 * confiar o no.
 */
function mostrarAvisoRespaldo() {
  const contenedor = $('#aviso-respaldo');
  if (!contenedor) return;

  // Basta con que UNA de las dos fuentes venga de la copia. Ver `origen`.
  const sello = origen.resumen ?? origen.modulo;

  if (!sello) {
    contenedor.innerHTML = '';
    contenedor.classList.add('hidden');
    return;
  }

  const fecha = fechaLegible(sello.generada_en);

  const cuando = fecha
    ? `Es la copia del ${esc(fecha)}.`
    : 'La copia no trae fecha, asi que no se sabe de cuando es.';

  contenedor.innerHTML = `
      <div class="flex items-start gap-3 border border-jsyellow/40 bg-jsyellow/5 rounded-xl px-5 py-4">
        ${icon('database', 'text-xl text-jsyellow shrink-0 mt-0.5')}
        <div>
          <p class="font-display font-bold text-paper text-sm">Estás viendo una copia guardada del banco de preguntas.</p>
          <p class="mt-1 text-sm text-muted">No se pudo conectar con el servidor, así que el cuestionario se cargó desde la copia incluida en el sitio. Puedes practicar con normalidad, pero puede que falten preguntas nuevas o correcciones recientes. ${cuando}</p>
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
function dibujarMensaje(contenedor, nombreIcono, titulo, detalle, pie = '') {
  contenedor.innerHTML = `
      <div class="bg-panel border border-panel3 rounded-xl p-8 text-center">
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
 */
function mostrarEstadoVacio(contenedor) {
  dibujarMensaje(
    contenedor,
    'quiz',
    'Elige un módulo para empezar.',
    'En el panel está el índice con los siete módulos del examen. Cuando elijas uno, sus preguntas aparecen acá.',
    `<a href="#indice-modulos" data-ir-al-indice
          class="mt-5 inline-flex items-center gap-2 border border-panel3 text-paper font-display font-bold text-xs px-4 py-2.5 rounded hover:border-jsyellow transition-colors">
         ${icon('layers', 'text-base text-jsyellow')}Ir al índice de módulos
       </a>`
  );
}

/** Dibuja el modulo que ya esta cargado en memoria. */
function pintar() {
  const contenedor = $('#cuestionario');
  if (!contenedor || !bancoCargado) return;

  contenedor.innerHTML = bancoCargado.map(dibujarGrupo).join('');
  estado.total = bancoCargado.reduce((suma, grupo) => suma + grupo.preguntas.length, 0);

  actualizarPanel();
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

// ---------------------------------------------------------------------------
// La puerta unica hacia el cambio de modulo
// ---------------------------------------------------------------------------

/** Esconde el aviso de cambio de modulo y lo deja vacio. */
function ocultarAvisoCambio() {
  const contenedor = $('#aviso-cambio-modulo');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  contenedor.classList.add('hidden');
}

/**
 * Pregunta antes de que el estudiante pierda lo que lleva respondido.
 *
 * POR QUE NO ES UN window.confirm()
 *
 * Porque es un dialogo del navegador: sale en el idioma del navegador, con
 * aspecto de error del sistema, y el navegador puede decidir suprimirlo. Un aviso
 * que el navegador puede callar no sirve para lo unico que tiene que hacer.
 *
 * QUE CAMBIO AL PASAR DEL SELECTOR AL INDICE (iteracion 32)
 *
 * Con el `<select>` habia que **deshacer** el cambio antes de preguntar: el
 * navegador ya habia movido la seleccion y, mientras el aviso esperaba, la
 * pantalla decia un modulo y las preguntas eran de otro.
 *
 * Con el indice ese problema desaparece de raiz, y conviene entender por que: un
 * boton no cambia ningun estado al pulsarlo. El indice marca el modulo activo
 * **cuando el modulo se carga**, no cuando se pide, asi que mientras este aviso
 * pregunta, el indice sigue senialando —correctamente— el modulo en el que el
 * estudiante todavia esta. La propiedad que antes habia que reponer a mano ahora
 * es estructural. Se sigue comprobando igual, porque una propiedad estructural
 * tambien se puede romper editando.
 *
 * No atrapa el foco y no es un modal: como nada se ha movido todavia, el resto de
 * la pagina puede seguir usandose sin que nada se pierda por descuido.
 */
function pedirConfirmacion(destino) {
  const contenedor = $('#aviso-cambio-modulo');
  if (!contenedor) return;

  const cuantas = estado.respondidas;
  const respuestas = cuantas === 1 ? '1 respuesta' : `${cuantas} respuestas`;

  contenedor.innerHTML = `
      <div class="border border-jsyellow/40 bg-jsyellow/5 rounded-xl px-4 py-4">
        <p id="aviso-cambio-titulo" class="font-display font-bold text-paper text-sm">¿Cambiar al Módulo ${esc(destino)}?</p>
        <p class="mt-1 text-sm text-muted">Vas a perder las ${esc(respuestas)} del Módulo ${esc(estado.modulo)}. El avance todavía no se guarda: eso llega más adelante.</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button type="button" data-confirmar-cambio="${esc(destino)}"
                  class="inline-flex items-center gap-2 bg-jsyellow text-ink font-display font-bold text-xs px-4 py-2.5 rounded hover:bg-jsyellowdim transition-colors">
            ${icon('swap-horiz', 'text-base')}Cambiar de módulo
          </button>
          <button type="button" data-cancelar-cambio
                  class="inline-flex items-center gap-2 border border-panel3 text-muted font-display font-bold text-xs px-4 py-2.5 rounded hover:border-jsyellow hover:text-paper transition-colors">
            Quedarme acá
          </button>
        </div>
      </div>`;

  contenedor.classList.remove('hidden');

  // El foco va al boton que cambia, no al que cancela: el estudiante llego aqui
  // pidiendo cambiar, y la tecla Enter tiene que hacer lo que pidio.
  $('[data-confirmar-cambio]', contenedor)?.focus?.();
}

/**
 * **La unica puerta por la que se cambia de modulo.**
 *
 * Todo lo que quiera cambiar de modulo pasa por aqui, y eso no es una preferencia
 * de estilo: el aviso de perdida de avance de la iteracion 31 vive dentro. Un
 * segundo camino que llame a `mostrarModulo()` directo lo esquivaria, y lo
 * esquivaria **en silencio** —el estudiante perderia lo respondido sin que nada se
 * lo hubiera dicho—, que es exactamente lo que esa iteracion existe para impedir.
 *
 * Por eso `mostrarModulo()` es de esta casa y el indice no la conoce: avisa por
 * `conectarIndice()` y quien decide es esta funcion.
 */
function pedirCambioDeModulo(numero) {
  if (numero === estado.modulo) return;

  if (estado.respondidas === 0) {
    ocultarAvisoCambio();
    mostrarModulo(numero);
    return;
  }

  pedirConfirmacion(numero);
}

/** Conecta los dos botones del aviso de cambio. */
function conectarAvisoCambio() {
  const aviso = $('#aviso-cambio-modulo');
  if (!aviso || aviso.dataset.bound) return;

  aviso.addEventListener('click', (evento) => {
    const confirmar = evento.target.closest('[data-confirmar-cambio]');
    if (confirmar) {
      ocultarAvisoCambio();
      mostrarModulo(Number(confirmar.dataset.confirmarCambio));
      return;
    }

    if (evento.target.closest('[data-cancelar-cambio]')) {
      ocultarAvisoCambio();
      $('#indice-modulos')?.querySelector?.('[aria-current]')?.focus?.();
    }
  });

  aviso.dataset.bound = 'true';
}

/**
 * Conecta la zona de preguntas: responder, y el enlace del estado vacio.
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

  const miPeticion = (peticionVigente += 1);

  estado.modulo = numero;
  estado.respondidas = 0;
  estado.correctas = 0;
  estado.incorrectas = 0;
  estado.total = 0;
  bancoCargado = null;

  conectarCuestionario(contenedor);
  mostrarContador(null);
  actualizarPanel();

  dibujarMensaje(
    contenedor,
    'database',
    `Cargando el Módulo ${numero}…`,
    'Pidiendo sus preguntas al banco.'
  );

  const respuesta = await leerPreguntas(numero);

  // Si mientras tanto se pidio otro modulo, esta respuesta ya no es la que la
  // pantalla esta esperando y dibujarla la dejaria mintiendo.
  if (miPeticion !== peticionVigente) return;

  // Antes de dibujar nada: si esto viene del respaldo, que se vea. Va primero
  // para que el aviso aparezca tambien cuando el modulo venga vacio y la pagina
  // termine en un mensaje en vez de en preguntas.
  origen.modulo = respuesta.meta?.respaldo ?? null;
  mostrarAvisoRespaldo();

  if (!respuesta.ok) {
    mostrarContador(null);
    dibujarMensaje(contenedor, 'database', 'No se pudo cargar el módulo.', respuesta.mensaje);
    actualizarPanel();
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
    return;
  }

  bancoCargado = agruparPorModulo(respuesta.datos);
  mostrarContador(bancoCargado);

  // El indice marca el modulo activo AHORA, cuando ya esta dibujado, y no cuando
  // se pidio: mientras el aviso de perdida pregunta, tiene que seguir senialando
  // el modulo en el que el estudiante esta de verdad.
  marcarModuloActivo(numero);

  pintar();
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
  if (prometidas === dibujadas) return;

  console.warn(
    `El indice dice que el modulo ${numero} tiene ${prometidas} preguntas y se ` +
      `dibujaron ${dibujadas}. Manda lo dibujado. Ver ADR-033.`
  );
}

/**
 * Deja la pagina lista y vacia, esperando una eleccion.
 *
 * No pide ninguna PREGUNTA: hasta que el estudiante elija un modulo no hay ninguna
 * que pedir, y ese fue el cambio de fondo de la iteracion 31 —antes esta funcion
 * se traia el banco entero, 371,8 KB—.
 *
 * Lo unico que pide es el resumen de los siete conteos, que son 0,9 KB (ADR-033).
 * El indice se dibuja antes de que llegue, con los nombres de data/modules.js, asi
 * que la pagina es utilizable aunque el resumen tarde o no llegue nunca: lo unico
 * que faltaria son las cifras, y faltar es mejor que inventarlas.
 */
export async function renderCuestionario() {
  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  pintarIndice();
  conectarIndice(pedirCambioDeModulo);
  conectarAvisoCambio();
  conectarCuestionario(contenedor);

  mostrarContador(null);
  mostrarEstadoVacio(contenedor);
  actualizarPanel();

  // El resumen puede caer a la instantanea por su cuenta. Si lo hace, el aviso de
  // ADR-008 aparece AQUI, al abrir la pagina, y no al elegir el primer modulo: el
  // estudiante se entera de que esta viendo una copia antes de ponerse a estudiar,
  // que es lo que esa ADR pide con todas sus letras.
  origen.resumen = await cargarConteos();
  mostrarAvisoRespaldo();
}

/** Conecta el botón que reinicia las respuestas del módulo que se está viendo. */
export function setupReinicio() {
  const boton = $('#reiniciar');
  if (!boton) return;

  boton.addEventListener('click', () => {
    // Sin modulo cargado no hay nada que reiniciar, y volver a dibujar el estado
    // vacio encima de si mismo solo desplazaria la pagina sin motivo.
    if (!bancoCargado) return;

    estado.respondidas = 0;
    estado.correctas = 0;
    estado.incorrectas = 0;
    ocultarAvisoCambio();
    pintar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
