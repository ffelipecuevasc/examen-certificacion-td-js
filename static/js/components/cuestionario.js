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
 */
import { $, $$, esc, shuffle, icon } from '../utils/dom.js';
import { leerPreguntas } from '../servicios/datos.js';

const estado = { respondidas: 0, correctas: 0, incorrectas: 0, total: 0 };

/**
 * El banco que se esta mostrando, ya agrupado por modulo.
 *
 * Se guarda para que reiniciar vuelva a dibujar sin pedir el banco de nuevo: el
 * estudiante que reinicia quiere las mismas preguntas barajadas otra vez, no una
 * espera y la posibilidad de que la capa de datos se haya caido entre medio.
 */
let bancoCargado = null;

/** Actualiza las tres barras verticales y los contadores del panel izquierdo. */
function actualizarPanel() {
  const { respondidas, correctas, incorrectas, total } = estado;
  const pct = (valor) => (total === 0 ? 0 : Math.round((valor / total) * 100));

  $('#barra-avance').style.height = `${pct(respondidas)}%`;
  $('#barra-incorrectas').style.height = `${pct(incorrectas)}%`;
  $('#barra-correctas').style.height = `${pct(correctas)}%`;

  $('#valor-avance').textContent = respondidas;
  $('#valor-incorrectas').textContent = incorrectas;
  $('#valor-correctas').textContent = correctas;

  $('#pct-avance').textContent = `${pct(respondidas)}%`;
  $('#total-preguntas').textContent = total;

  const restantes = total - respondidas;
  $('#mensaje-avance').textContent =
    respondidas === 0
      ? 'Responde la primera pregunta para comenzar.'
      : restantes === 0
        ? `¡Terminaste! Acertaste ${correctas} de ${total}.`
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
 * El extremo devuelve las preguntas ordenadas por modulo y por id, con el titulo
 * y el icono del modulo repetidos en cada fila (vienen de la vista, que ya cruzo
 * la tabla `modulo`). Aca se doblan en secciones, que es como las dibuja la
 * pagina.
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
function mostrarAvisoRespaldo(sello) {
  const contenedor = $('#aviso-respaldo');
  if (!contenedor) return;

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

/** Mensaje a pantalla completa cuando no hay preguntas que dibujar. */
function dibujarMensaje(contenedor, nombreIcono, titulo, detalle) {
  contenedor.innerHTML = `
      <div class="bg-panel border border-panel3 rounded-xl p-8 text-center">
        <span class="grid place-items-center w-12 h-12 mx-auto rounded-lg bg-panel2 text-jsyellow">${icon(nombreIcono, 'text-2xl')}</span>
        <p class="mt-4 font-display font-bold text-paper">${esc(titulo)}</p>
        <p class="mt-2 text-sm text-muted">${esc(detalle)}</p>
      </div>`;
}

/** Dibuja el banco que ya esta cargado en memoria. */
function pintar() {
  const contenedor = $('#cuestionario');
  if (!contenedor || !bancoCargado) return;

  contenedor.innerHTML = bancoCargado.map(dibujarGrupo).join('');
  estado.total = bancoCargado.reduce((suma, grupo) => suma + grupo.preguntas.length, 0);

  if (!contenedor.dataset.bound) {
    contenedor.addEventListener('click', (evento) => {
      const boton = evento.target.closest('.quiz-option');
      if (!boton || boton.disabled) return;
      responder(boton);
    });
    contenedor.dataset.bound = 'true';
  }

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
 * Se llama en los tres finales de renderCuestionario(), tambien en los dos que no
 * dibujan preguntas: si no hay nada que contar, el contador se esconde. **Ningun
 * numero es mejor que un numero falso.**
 *
 * Los modulos se cuentan igual que las preguntas, de los datos. Eran «7» fijos, y
 * el banco puede llegar sin alguno.
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

  const modulos = grupos.length;
  const contar = (cantidad, singular, plural) =>
    `${cantidad} ${cantidad === 1 ? singular : plural}`;

  contenedor.innerHTML =
    `${icon('quiz', 'text-base')}<span>${esc(contar(preguntas, 'pregunta', 'preguntas'))} · ` +
    `${esc(contar(modulos, 'módulo', 'módulos'))}</span>`;

  contenedor.classList.remove('hidden');
  contenedor.classList.add('inline-flex');
}

/**
 * Pide el banco y lo dibuja.
 *
 * Los tres finales posibles se tratan distinto a proposito, y la diferencia es
 * la misma que explica functions/api/_comun.js: una lista vacia es una respuesta
 * correcta y no un fallo, asi que no dispara el respaldo ni se anuncia como
 * error.
 */
export async function renderCuestionario() {
  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  const respuesta = await leerPreguntas();

  // Antes de dibujar nada: si esto viene del respaldo, que se vea. Va primero
  // para que el aviso aparezca tambien cuando el banco venga vacio y la pagina
  // termine en un mensaje en vez de en preguntas.
  mostrarAvisoRespaldo(respuesta.meta?.respaldo);

  if (!respuesta.ok) {
    mostrarContador(null);
    dibujarMensaje(
      contenedor,
      'database',
      'No se pudo cargar el banco de preguntas.',
      respuesta.mensaje
    );
    return;
  }

  if (respuesta.vacio) {
    mostrarContador(null);
    dibujarMensaje(
      contenedor,
      'database',
      'Todavía no hay preguntas cargadas.',
      'El banco está conectado pero vacío.'
    );
    return;
  }

  bancoCargado = agruparPorModulo(respuesta.datos);
  mostrarContador(bancoCargado);
  pintar();
}

/** Conecta el botón que reinicia todas las respuestas. */
export function setupReinicio() {
  const boton = $('#reiniciar');
  if (!boton) return;

  boton.addEventListener('click', () => {
    estado.respondidas = 0;
    estado.correctas = 0;
    estado.incorrectas = 0;
    pintar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
