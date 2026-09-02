import { $, $$, esc, shuffle, icon } from '../utils/dom.js';
import { cuestionario } from '../data/cuestionario.js';

const estado = { respondidas: 0, correctas: 0, incorrectas: 0, total: 0 };

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

/** Dibuja las 105 preguntas agrupadas por módulo. */
export function renderCuestionario() {
  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  let indice = 0;

  contenedor.innerHTML = cuestionario
    .map((grupo) => {
      const preguntas = grupo.preguntas
        .map((pregunta, numero) => {
          const qid = `q${indice++}`;

          const pares = pregunta.opciones.map((texto, i) => ({
            texto,
            correcta: i === pregunta.correcta,
          }));
          const alternativas = (pregunta.fijo ? pares : shuffle(pares))
            .map(
              (alternativa) => `
              <button type="button" class="quiz-option flex items-start gap-3 text-left w-full border border-panel3 rounded-lg px-4 py-3 text-sm text-paper/90 hover:border-jsyellow transition-colors"
                      data-correct="${alternativa.correcta}">
                <span class="quiz-mark text-lg opacity-0 shrink-0">${icon('check-circle')}</span>
                <span>${esc(alternativa.texto)}</span>
              </button>`
            )
            .join('');

          return `
          <li class="bg-panel border border-panel3 rounded-xl p-5 sm:p-6" data-pregunta="${qid}">
            <div class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-mutedink shrink-0">${String(numero + 1).padStart(2, '0')}</span>
              <p class="font-display font-bold text-paper leading-snug">${esc(pregunta.q)}</p>
            </div>
            <div class="mt-4 grid gap-2">${alternativas}</div>
            <p class="quiz-feedback hidden mt-4 text-sm text-muted border-l-2 border-jsyellow pl-3 flex gap-2"></p>
          </li>`;
        })
        .join('');

      return `
      <section class="scroll-mt-24" id="grupo-${esc(grupo.modulo.replace(/\s+/g, '-').toLowerCase())}">
        <header class="sticky top-16 z-10 -mx-1 px-1 py-3 bg-ink/95 backdrop-blur flex items-center gap-3">
          <span class="grid place-items-center w-9 h-9 rounded-lg bg-panel2 text-jsyellow shrink-0">${icon(grupo.icono, 'text-xl')}</span>
          <span class="font-display font-bold text-jsyellow text-sm shrink-0">${esc(grupo.modulo)}</span>
          <span class="font-display font-semibold text-paper text-sm truncate">${esc(grupo.titulo)}</span>
          <span class="ml-auto font-mono text-[11px] text-mutedink shrink-0">${grupo.preguntas.length}</span>
        </header>
        <ul class="mt-3 grid gap-4">${preguntas}</ul>
      </section>`;
    })
    .join('');

  estado.total = indice;

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

/** Conecta el botón que reinicia todas las respuestas. */
export function setupReinicio() {
  const boton = $('#reiniciar');
  if (!boton) return;

  boton.addEventListener('click', () => {
    estado.respondidas = 0;
    estado.correctas = 0;
    estado.incorrectas = 0;
    renderCuestionario();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
