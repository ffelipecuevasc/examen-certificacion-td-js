/**
 * Punto de entrada de la página del simulacro de examen.
 *
 * En la etapa C de la iteración 41 esta página arma un intento y lo guarda:
 * presenta las reglas, y al pulsar «Comenzar el simulacro» pide la lista de ids,
 * elige las 120 preguntas en el navegador, las trae, las guarda congeladas en el
 * navegador y avisa que el intento quedó listo. Al volver con un intento a medias,
 * lo retoma. Todavía no se responde: el recorrido con el reloj es de las
 * iteraciones 42 y 43.
 *
 * Lo que trae la copia del encabezado y del pie —el menú de teléfono y el año del
 * pie— se pone a andar acá igual que en las otras dos páginas: sin esto quedarían
 * muertos en esta y vivos en las demás.
 */
import { setupMobileMenu, setCurrentYear } from './components/nav.js';
import { conectarComienzo, retomarElIntento } from './components/simulacro.js';

setupMobileMenu();
setCurrentYear();
conectarComienzo();

// Se conecta primero y se retoma despues, a proposito: la retoma reescribe la zona
// del intento, y el boton que deja dibujado necesita que el oyente ya este puesto.
retomarElIntento();
