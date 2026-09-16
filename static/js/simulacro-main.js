/**
 * Punto de entrada de la página del simulacro de examen.
 *
 * En la etapa A de la iteración 41 esta página solo presenta las reglas: no pide
 * preguntas, no guarda nada y el botón «Comenzar el simulacro» todavía no está
 * conectado. Lo único que hay que poner a andar es lo que trae la copia del
 * encabezado y del pie —el menú de teléfono y el año del pie—, que sin esto
 * quedarían muertos en esta página y vivos en las otras dos.
 *
 * La etapa B suma acá la carga del intento; la etapa C, el guardado.
 */
import { setupMobileMenu, setCurrentYear } from './components/nav.js';

setupMobileMenu();
setCurrentYear();
