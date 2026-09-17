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

/**
 * Devuelve una copia desordenada del arreglo (algoritmo de Fisher-Yates).
 *
 * LA FUENTE DE AZAR ENTRA POR PARAMETRO desde la iteracion 41, decision 10, y el
 * valor por defecto deja intactas las llamadas del cuestionario, que no lo pasan.
 *
 * El motivo es que la muestra de 200 intentos del simulacro tiene que ser
 * REPETIBLE: con `Math.random` escrito aqui dentro, una muestra que diera rojo no
 * se podria volver a correr igual para mirar que paso, y un rojo que no se puede
 * reproducir no se arregla, se discute. Quien prueba le pasa una fuente con
 * semilla; el sitio no le pasa nada y se queda con `Math.random`.
 *
 * @param {Array} array
 * @param {() => number} [azar] Devuelve un numero en [0, 1).
 */
export function shuffle(array, azar = Math.random) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Indica si la persona pidio reducir las animaciones en su sistema operativo. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Devuelve el markup de un icono.
 * Las formas se generan en static/css/icons.css a partir de static/resources/
 * mediante `npm run icons`, y se pintan con mascaras CSS: el icono toma el
 * color del texto del contenedor.
 * @param {string} name  Nombre del archivo sin extension, por ejemplo 'database'.
 * @param {string} extra Clases de Tailwind adicionales, por ejemplo 'text-xl text-jsyellow'.
 */
export function icon(name, extra = '') {
  return `<span class="icon i-${esc(name)} ${esc(extra)}" aria-hidden="true"></span>`;
}
