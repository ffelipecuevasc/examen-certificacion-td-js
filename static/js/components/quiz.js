import { $, $$, esc, shuffle, icon } from '../utils/dom.js';
import { quizData } from '../data/quiz.js';

const state = { respondidas: 0, correctas: 0, total: 0 };

/** Actualiza la barra de avance y el marcador de aciertos. */
function updateProgress() {
  const { respondidas, correctas, total } = state;
  const porcentaje = total === 0 ? 0 : Math.round((respondidas / total) * 100);

  $('#progress-fill').style.width = `${porcentaje}%`;
  $('#progress-label').textContent = `${respondidas} / ${total} respondidas`;
  $('#score-value').textContent = String(correctas);
}

/** Marca la alternativa elegida, revela la correcta y muestra la explicacion. */
function answerQuestion(button) {
  const item = button.closest('[data-question]');
  const acerto = button.dataset.correct === 'true';

  $$('.quiz-option', item).forEach((option) => {
    option.disabled = true;
    const mark = option.querySelector('.quiz-mark');

    if (option.dataset.correct === 'true') {
      option.dataset.state = 'correct';
      mark.innerHTML = icon('check-circle');
      mark.classList.remove('opacity-0');
    } else if (option === button) {
      option.dataset.state = 'wrong';
      mark.innerHTML = icon('cancel');
      mark.classList.remove('opacity-0');
    } else {
      option.dataset.state = 'dimmed';
    }
  });

  $('.quiz-feedback', item).classList.remove('hidden');

  state.respondidas += 1;
  if (acerto) state.correctas += 1;
  updateProgress();
}

/** Dibuja las 21 preguntas agrupadas por modulo, con las alternativas barajadas. */
export function renderQuiz() {
  const container = $('#quiz');
  if (!container) return;

  let index = 0;

  container.innerHTML = quizData
    .map((grupo) => {
      const preguntas = grupo.preguntas
        .map((pregunta) => {
          const qid = `q${index++}`;
          const alternativas = shuffle(
            pregunta.opciones.map((texto, i) => ({ texto, correcta: i === pregunta.correcta }))
          )
            .map(
              (alternativa) => `
              <button type="button" class="quiz-option flex items-center gap-3 text-left w-full border border-panel3 rounded-lg px-4 py-3 text-sm text-paper/90 hover:border-jsyellow transition-colors"
                      data-q="${qid}" data-correct="${alternativa.correcta}">
                <span class="quiz-mark text-lg opacity-0">${icon('check-circle')}</span>
                <span>${esc(alternativa.texto)}</span>
              </button>`
            )
            .join('');

          return `
          <li class="bg-panel border border-panel3 rounded-xl p-5 sm:p-6" data-question="${qid}">
            <p class="font-display font-bold text-paper leading-snug">${esc(pregunta.q)}</p>
            <div class="mt-4 grid gap-2">${alternativas}</div>
            <p class="quiz-feedback hidden mt-4 text-sm text-muted border-l-2 border-jsyellow pl-3 flex gap-2">
              ${icon('lightbulb', 'text-base text-jsyellow mt-0.5')}<span>${esc(pregunta.explica)}</span>
            </p>
          </li>`;
        })
        .join('');

      return `
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="grid place-items-center w-9 h-9 rounded-lg bg-panel2 text-jsyellow shrink-0">${icon(grupo.icono, 'text-xl')}</span>
          <span class="font-display font-bold text-jsyellow text-sm">${esc(grupo.modulo)}</span>
          <span class="font-display font-semibold text-paper">${esc(grupo.titulo)}</span>
        </div>
        <ul class="grid gap-4">${preguntas}</ul>
      </div>`;
    })
    .join('');

  state.total = index;

  // El listener se registra una sola vez, aunque el quiz se vuelva a dibujar al reiniciar.
  if (!container.dataset.bound) {
    container.addEventListener('click', (event) => {
      const button = event.target.closest('.quiz-option');
      if (!button || button.disabled) return;
      answerQuestion(button);
    });
    container.dataset.bound = 'true';
  }

  updateProgress();
}

/** Conecta el boton que reinicia las respuestas del miniexamen. */
export function setupQuizReset() {
  const button = $('#reset-quiz');
  if (!button) return;

  button.addEventListener('click', () => {
    state.respondidas = 0;
    state.correctas = 0;
    renderQuiz();
    $('#repaso').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
