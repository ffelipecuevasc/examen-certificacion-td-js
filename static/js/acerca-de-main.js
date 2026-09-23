/**
 * Punto de entrada de la página «Acerca de».
 *
 * La página es texto fijo: no pide nada a la capa de datos ni guarda nada. Lo único
 * que trae vivo es la copia del encabezado y del pie —el menú de teléfono y el año
 * del pie—, y se pone a andar acá igual que en las otras tres páginas: sin esto
 * quedarían muertos en esta y vivos en las demás.
 */
import { setupMobileMenu, setCurrentYear } from './components/nav.js';

setupMobileMenu();
setCurrentYear();
