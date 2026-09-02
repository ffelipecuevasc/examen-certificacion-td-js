import { $, esc } from '../utils/dom.js';
import { modulesData } from '../data/modules.js';

/** Dibuja el mapa del examen: una tarjeta por modulo evaluado. */
export function renderRoadmap() {
  const container = $('#roadmap');
  if (!container) return;

  container.innerHTML = modulesData
    .map(
      (m, i) => `
      <a href="#modulo-${i}" class="bg-panel hover:bg-panel2 transition-colors p-6 flex flex-col gap-2">
        <span class="font-mono text-[11px] text-mutedink">${esc(m.parte)}</span>
        <span class="font-display font-bold text-jsyellow text-sm">${esc(m.modulo)}</span>
        <span class="font-display font-semibold text-paper leading-snug text-sm">${esc(m.titulo)}</span>
      </a>`
    )
    .join('');
}
