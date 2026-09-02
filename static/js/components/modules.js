import { $, $$, esc, icon } from '../utils/dom.js';
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
        <button type="button" class="code-copy-btn font-mono text-[11px] text-muted hover:text-jsyellow transition-colors inline-flex items-center gap-1.5" data-target="${codeId}">
          ${icon('content-copy', 'text-sm')}<span class="copy-label">Copiar</span>
        </button>
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
            <span class="grid place-items-center w-11 h-11 rounded-lg bg-panel2 text-jsyellow shrink-0">${icon(m.icono, 'text-2xl')}</span>
            <span class="font-display font-bold text-jsyellow text-sm shrink-0 w-20 hidden sm:block">${esc(m.modulo)}</span>
            <div class="min-w-0">
              <h3 class="font-display font-bold text-base sm:text-lg text-paper leading-snug">${esc(m.titulo)}</h3>
              <p class="text-xs text-mutedink font-mono mt-1">${esc(m.parte)} · ${esc(m.resumen)}</p>
            </div>
          </div>
          ${icon('expand-more', 'chevron text-2xl text-jsyellow')}
        </button>
        <div id="panel-${i}" class="accordion-panel">
          <div class="px-5 sm:px-6 pb-7 border-t border-panel3 pt-6">
            <p class="font-mono text-[11px] text-mutedink mb-3 flex items-center gap-2">${icon('history-edu', 'text-base')}Temas evaluados</p>
            <ul class="flex flex-col gap-2">${temas}</ul>
            ${ejercicios ? `<p class="font-mono text-[11px] text-mutedink mt-7 mb-2 flex items-center gap-2">${icon('commit', 'text-base')}Código de ejemplo</p>${ejercicios}` : ''}
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
    const label = button.querySelector('.copy-label');
    const original = label.textContent;
    try {
      await navigator.clipboard.writeText(codeEl.textContent);
      label.textContent = 'Copiado';
    } catch (error) {
      label.textContent = 'No se pudo copiar';
    }
    setTimeout(() => {
      label.textContent = original;
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
