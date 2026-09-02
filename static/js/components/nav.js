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
  const sections = ['mapa', 'modulos', 'repaso', 'consejos']
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

/** Escribe el ano actual en el pie de pagina. */
export function setCurrentYear() {
  const el = $('#year');
  if (el) el.textContent = String(new Date().getFullYear());
}
