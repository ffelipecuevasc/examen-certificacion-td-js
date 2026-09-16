import { $, $$, prefersReducedMotion } from '../utils/dom.js';

/** Abre y cierra el menu en pantallas pequenas. */
export function setupMobileMenu() {
  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('hidden', isOpen);
    toggle.querySelector('.menu-icon-open')?.classList.toggle('hidden', !isOpen);
    toggle.querySelector('.menu-icon-close')?.classList.toggle('hidden', isOpen);
  });

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.add('hidden');
    toggle.querySelector('.menu-icon-open')?.classList.remove('hidden');
    toggle.querySelector('.menu-icon-close')?.classList.add('hidden');
  };

  $$('.mobile-link', menu).forEach((link) => link.addEventListener('click', closeMenu));
}

/** Resalta en el menu la seccion que la persona esta leyendo. */
export function setupScrollSpy() {
  const links = $$('.nav-link');
  const sections = ['inicio', 'mapa', 'modulos', 'repaso', 'consejos']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/** Anima los contadores del hero, respetando la preferencia de movimiento reducido. */
export function animateCounters() {
  const reduce = prefersReducedMotion();

  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);

    if (reduce) {
      el.textContent = String(target);
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.round(target / 24));
    const timer = setInterval(() => {
      current = Math.min(target, current + step);
      el.textContent = String(current);
      if (current >= target) clearInterval(timer);
    }, 45);
  });
}

/**
 * El logotipo del hero saluda UNA VEZ, poco despues de cargar.
 *
 * Decision 6 de la iteracion 36. El motivo de que sea una sola vez es el mismo por
 * el que se descarto repetirlo cada cierto tiempo: un movimiento que vuelve compite
 * con el texto que el estudiante esta tratando de leer. Y el motivo de que no sea
 * al pasar el raton es que el logotipo no es un enlace ni un boton, asi que casi
 * nadie lo haria a proposito y el efecto quedaria escondido.
 *
 * EL RETRASO NO ES UN NUMERO AL AZAR. Sin el, el efecto ocurre mientras la pagina
 * todavia se esta pintando y la vista de la persona aun no llega al logotipo: se
 * gasta el movimiento en un momento en que nadie lo mira. 700 ms alcanzan para que
 * el hero este quieto y la mirada haya aterrizado.
 *
 * LA CLASE SE AGREGA, NO SE QUITA. `animate-tada` declara una sola iteracion, asi
 * que la animacion corre una vez y se queda inerte. No hace falta limpiarla, y
 * dejarla puesta ademas documenta en el DOM que esto ya ocurrio.
 *
 * Con `prefers-reduced-motion` no se apaga aqui: lo apaga la regla de
 * src/input.css, que recorta la duracion de cualquier animacion a 0,01 ms. El
 * efecto empieza y termina en `scale3d(1, 1, 1)`, de modo que recortarlo equivale
 * a no haberlo corrido: no deja el logotipo torcido ni de otro tamano.
 */
export function animarLogotipo() {
  const logo = $('#logo-hero');
  if (!logo) return;

  window.setTimeout(() => logo.classList.add('animate-tada'), 700);
}

/** Escribe el ano actual en el pie de pagina. */
export function setCurrentYear() {
  const el = $('#year');
  if (el) el.textContent = String(new Date().getFullYear());
}
