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

/**
 * El aviso que dice que en el examen hay que PROGRAMAR, no solo reconocer.
 *
 * POR QUE ES AMARILLO (decision 9 de la iteracion 36)
 *
 * La version anterior era una tarjeta oscura con barra amarilla y el titular
 * «Código de ejemplo · así se responde una parte del examen». Sobre una pagina
 * oscura no destacaba: quedaba como un parrafo mas dentro del acordeon, y un
 * aviso que el estudiante no ve no cumple ninguna funcion. El autor lo rediseno
 * con fondo `jsyellow` para que sea lo primero que se ve al abrir un modulo.
 *
 * EL FONDO AMARILLO OBLIGA A DAR VUELTA TODOS LOS COLORES. Ninguno de los grises
 * del sitio sirve encima: `paper` da 1,26:1, `muted` 2,11:1 y `mutedink` 2,51:1.
 * Todo el texto pasa a tonos oscuros —`ink`, `panel2`, `panel3`—, que sobre el
 * amarillo dan entre 11,81:1 y 15,53:1. El enfasis se sigue expresando con peso
 * de letra, no con color, que es la regla de la decision 5 bis.
 *
 * EL SUBTITULO NO ESTA ESCRITO AQUI. Sale de `numero` y `lenguaje` de cada modulo
 * (static/js/data/modules.js). Siete frases escritas a mano serian siete
 * oportunidades de que una quede diciendo el lenguaje de otro modulo.
 *
 * SE DIBUJA EN LOS SIETE MODULOS, TENGAN O NO EJERCICIOS DE EJEMPLO. Antes vivia
 * dentro del `if` de los ejercicios, y hoy eso no se nota porque los siete tienen.
 * Pero lo que el aviso afirma —que en ese modulo hay que programar— es cierto por
 * el testimonio, no por que nosotros tengamos un ejemplo a mano: si manana un
 * modulo se queda sin bloque de codigo, el aviso tiene que seguir ahi.
 *
 * EL ORIGEN VA PEGADO AL DATO, no en una nota al pie. `vision.md` exige declarar
 * que el material es no oficial, y esto es de lo mas especifico que afirma el
 * sitio sobre como es el examen: sale del testimonio de estudiantes que lo
 * rindieron el 2026, recogido en
 * _planmaestro/00_producto/contexto-del-examen.md, no de Talento Digital.
 *
 * EL ICONO ES UNA IMAGEN, NO UNA CLASE `i-*` (decision 10). Sus animaciones viven
 * dentro del SVG y hay que conservarlas, y el sistema de iconos del sitio las
 * perderia: convierte cada SVG en una mascara CSS, que solo guarda la forma. Por
 * eso este va con `<img>` y por eso su trazo queda negro —`currentColor` sin CSS
 * que lo herede—, que sobre amarillo es justo lo que conviene. NO se le pone
 * color desde el CSS: no lo tomaria.
 *
 * Y ES DECORATIVO: `alt=""`. El titular que va al lado ya dice lo que significa,
 * asi que describirlo otra vez solo obligaria a un lector de pantalla a oir dos
 * veces lo mismo.
 */
function avisoDeProgramacion(m) {
  return `
            <div class="mt-7 mb-10 rounded-xl bg-jsyellow p-5 sm:p-6">
              <div class="flex items-start gap-3">
                <img src="static/resources/alert-loop.svg" alt="" class="w-8 h-8 shrink-0">
                <div class="min-w-0">
                  <p class="font-display font-bold text-xl sm:text-2xl text-ink leading-snug">En el examen real deberás programar</p>
                  <p class="mt-1 font-display font-semibold text-sm sm:text-base text-ink">En el Módulo ${esc(m.numero)} te tocará programar en ${esc(m.lenguaje)}</p>
                </div>
              </div>
              <p class="mt-4 text-sm text-panel2 leading-relaxed">
                En el examen, ejercicios como estos se responden escribiendo el código en un cuadro de texto vacío, o revisando código y señalando el error:
                <strong class="font-semibold text-ink">sin autocompletado, sin marcado de errores y sin poder ejecutarlo</strong>.
                Practícalos escribiéndolos de memoria, no solo leyéndolos.
              </p>
              <p class="mt-3 font-mono text-[11px] text-panel3 leading-relaxed">
                Esto sale del testimonio de estudiantes que rindieron el examen 2026. No es información oficial de Talento Digital para Chile.
              </p>
            </div>`;
}

/**
 * Hace que cada tarjeta se mueva UNA VEZ, cuando aparece en pantalla.
 *
 * Decision 8 de la iteracion 36, que hereda el motivo de la 6: un movimiento que
 * se repite compite con el texto que el estudiante intenta leer, y siete tarjetas
 * latiendo a la vez serian exactamente eso. Se mueve al asomar, se desconecta, y
 * no vuelve a moverse mientras la pagina siga abierta.
 *
 * LO QUE SE LEE SIEMPRE SON LAS PALABRAS. La pildora «Ver temas y código» esta
 * visible desde el primer momento, sin depender de que esto corra: si no hay
 * IntersectionObserver, si el JavaScript falla o si la persona pidio menos
 * movimiento, la tarjeta sigue diciendo con palabras que se despliega. El
 * movimiento solo atrae la vista hacia lo que ya estaba escrito.
 *
 * El movimiento no se apaga aqui cuando hay `prefers-reduced-motion`: lo apaga la
 * regla de src/input.css, que recorta la duracion de cualquier animacion a
 * 0,01 ms. Se deja en un solo sitio a proposito, que es donde ya vive para
 * `animate-floaty`.
 */
function avisarQueSeDespliegan() {
  const pistas = $$('.pista-desplegar');
  if (pistas.length === 0) return;

  if (typeof IntersectionObserver !== 'function') return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('animate-asomar');
        // Una sola vez: se deja de mirar apenas se movio.
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.6 }
  );

  pistas.forEach((pista) => observador.observe(pista));
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
          <span class="flex items-center gap-2 shrink-0">
            <span class="pista-desplegar inline-flex items-center gap-1.5 rounded-full border border-panel3 bg-panel2 px-3 py-1 font-mono text-[11px] text-muted">Ver temas y código</span>
            ${icon('expand-more', 'chevron text-2xl text-jsyellow')}
          </span>
        </button>
        <div id="panel-${i}" class="accordion-panel">
          <div class="px-5 sm:px-6 pb-7 border-t border-panel3 pt-6">
            <p class="font-mono text-[11px] text-mutedink mb-3 flex items-center gap-2">${icon('history-edu', 'text-base')}Temas evaluados</p>
            <ul class="flex flex-col gap-2">${temas}</ul>
            ${avisoDeProgramacion(m)}
            ${ejercicios}
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

  avisarQueSeDespliegan();

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
