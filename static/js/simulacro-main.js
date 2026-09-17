/**
 * Punto de entrada de la página del simulacro de examen.
 *
 * En la etapa B de la iteración 41 esta página ya arma un intento: presenta las
 * reglas, y al pulsar «Comenzar el simulacro» pide la lista de ids, elige las 120
 * preguntas en el navegador, las trae y avisa que el intento quedó listo. Todavía
 * no se responde —el recorrido con el reloj es de las iteraciones 42 y 43— y
 * todavía no se guarda nada, que es la etapa C.
 *
 * Lo que trae la copia del encabezado y del pie —el menú de teléfono y el año del
 * pie— se pone a andar acá igual que en las otras dos páginas: sin esto quedarían
 * muertos en esta y vivos en las demás.
 */
import { setupMobileMenu, setCurrentYear } from './components/nav.js';
import { conectarComienzo } from './components/simulacro.js';

setupMobileMenu();
setCurrentYear();
conectarComienzo();
