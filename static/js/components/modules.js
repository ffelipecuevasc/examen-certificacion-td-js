import { $, $$, esc } from '../utils/dom.js';
import { modulesData } from '../data/modules.js';

/** Abre o cierra un modulo del acordeon. */
function setModuleOpen(button, open) {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', String(open));
  button.parentElement.classList.toggle('is-open', open);
  panel.classList.toggle('is-open', open);
}

/** Genera el bloque de codigo de un ejercicio, con su boton de copiado. */
function codeBlock(ejercicio, codeId) {
  return `
    <div class="mt-3 rounded-lg overflow-hidden border border-panel3">
      <div class="flex items-center justify-between bg-panel2 px-4 py-2">
        <span class="font-mono text-[11px] text-muted">${esc(ejercicio.lang)}</span>
        <button type="button" class="code-copy-btn font-mono text-[11px] text-muted hover:text-jsyellow transition-colors" data-target="${codeId}">Copiar</button>
      </div>
      <pre class="bg-ink px-4 py-4 overflow-x-auto"><code id="${codeId}" class="font-mono text-[12.5px] leading-6 text-paper/90">${esc(ejercicio.code)}</code></pre>
    </div>`;
}

/** Dibuja el acordeon con los temas y ejemplos de cada modulo. */
export function renderModules() {
  const container = $('#modules-list');
  if (!container) return;

  container.innerHTML = modulesData
    .map((m, i) => {
      const temas = m.temas
        .map(
          (t) =>
            `<li class="flex gap-3 text-sm text-muted leading-relaxed"><span class="text-jsyellow shrink-0">·</span><span>${esc(t)}</span></li>`
        )
        .join('');

      const ejercicios = (m.ejercicios || [])
        .map(
          (ej, j) => `
          <div class="${j > 0 ? 'mt-6' : ''}">
            <p class="font-sans font-semibold text-sm text-paper">${esc(ej.titulo)}</p>
            <p class="text-sm text-muted mt-1">${esc(ej.detalle)}</p>
            ${codeBlock(ej, `code-${i}-${j}`)}
          </div>`
        )
        .join('');

      return `
      <article id="modulo-${i}" class="scroll-mt-24 bg-panel border border-panel3 rounded-xl overflow-hidden">
        <button type="button" class="module-toggle w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left" aria-expanded="false" aria-controls="panel-${i}">
          <div class="flex items-center gap-4 min-w-0">
            <span class="font-display font-bold text-jsyellow text-sm shrink-0 w-20">${esc(m.modulo)}</span>
            <div class="min-w-0">
              <h3 class="font-display font-bold text-base sm:text-lg text-paper leading-snug">${esc(m.titulo)}</h3>
              <p class="text-xs text-mutedink font-mono mt-1">${esc(m.parte)} · ${esc(m.resumen)}</p>
            </div>
          </div>
          <svg class="chevron w-5 h-5 text-jsyellow shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div id="panel-${i}" class="accordion-panel">
          <div class="px-5 sm:px-6 pb-7 border-t border-panel3 pt-6">
            <p class="font-mono text-[11px] text-mutedink mb-3">Temas evaluados</p>
            <ul class="flex flex-col gap-2">${temas}</ul>
            ${ejercicios ? `<p class="font-mono text-[11px] text-mutedink mt-7 mb-2">Código de ejemplo</p>${ejercicios}` : ''}
          </div>
        </div>
      </article>`;
    })
    .join('');

  $$('.module-toggle').forEach((button) => {
    button.addEventListener('click', () =>
      setModuleOpen(button, button.getAttribute('aria-expanded') !== 'true')
    );
  });

  container.addEventListener('click', async (event) => {
    const button = event.target.closest('.code-copy-btn');
    if (!button) return;

    const codeEl = document.getElementById(button.dataset.target);
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(codeEl.textContent);
      button.textContent = 'Copiado';
    } catch (error) {
      button.textContent = 'No se pudo copiar';
    }
    setTimeout(() => {
      button.textContent = original;
    }, 1500);
  });
}

/** Conecta el boton que abre y cierra todos los modulos a la vez. */
export function setupToggleAll() {
  const button = $('#toggle-all');
  if (!button) return;

  button.addEventListener('click', () => {
    const shouldOpen = button.textContent.trim() === 'Abrir todos';
    $$('.module-toggle').forEach((toggle) => setModuleOpen(toggle, shouldOpen));
    button.textContent = shouldOpen ? 'Cerrar todos' : 'Abrir todos';
  });
}
