/**
 * Punto de entrada de la guia de certificacion.
 * Se carga con <script type="module">, por lo que se ejecuta en modo estricto
 * y de forma diferida: el DOM ya esta disponible cuando corre este archivo.
 */
import { renderRoadmap } from './components/roadmap.js';
import { renderModules, setupToggleAll } from './components/modules.js';
import { renderQuiz, setupQuizReset } from './components/quiz.js';
import { setupMobileMenu, setupScrollSpy, animateCounters, setCurrentYear } from './components/nav.js';

function init() {
  renderRoadmap();
  renderModules();
  setupToggleAll();
  renderQuiz();
  setupQuizReset();
  setupMobileMenu();
  setupScrollSpy();
  animateCounters();
  setCurrentYear();
}

init();
