/**
 * Punto de entrada de la página del cuestionario de práctica.
 */
import { renderCuestionario, setupReinicio } from './components/cuestionario.js';
import { setupMobileMenu, setCurrentYear } from './components/nav.js';
import { renderEstadoDatos } from './components/estado-datos.js';

renderCuestionario();
setupReinicio();
setupMobileMenu();
setCurrentYear();
renderEstadoDatos();
