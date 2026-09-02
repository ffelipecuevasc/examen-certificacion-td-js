/**
 * Utilidades compartidas por los componentes de la guia.
 */

/** Devuelve el primer elemento que coincide con el selector. */
export const $ = (selector, scope = document) => scope.querySelector(selector);

/** Devuelve un arreglo con todos los elementos que coinciden con el selector. */
export const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/**
 * Escapa caracteres con significado en HTML.
 * Es obligatorio usarla sobre cualquier texto que provenga de los archivos de datos
 * antes de insertarlo con innerHTML: sin esto, un ejemplo como `<div>` se
 * interpretaria como una etiqueta real y romperia la estructura de la pagina.
 */
export function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

/** Devuelve una copia desordenada del arreglo (algoritmo de Fisher-Yates). */
export function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Indica si la persona pidio reducir las animaciones en su sistema operativo. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
