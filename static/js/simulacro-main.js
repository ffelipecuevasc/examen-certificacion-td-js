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
 *
 * LAS DOS MAQUETAS DE LA ITERACIÓN 45
 *
 * `?maqueta=intento` y `?maqueta=resumen` dibujan el marcado estático de esas dos
 * pantallas y **no arman ningún intento**: no se conecta el botón, no se retoma nada
 * y no sale ni una petición. Es la dirección visual puesta donde se puede mirar, con
 * el peor caso del banco como contenido.
 *
 * Es una rama y no una página aparte por dos motivos. Una página cuarta habría
 * duplicado por cuarta vez el encabezado y el pie, que `comprobar-copias.mjs` vigila
 * justamente porque escribirlos a mano tres veces ya fue demasiado. Y la maqueta
 * tiene que verse **dentro de esta página**, bajo este encabezado fijo, porque el
 * presupuesto vertical que la decisión 1 reparte se cuenta desde ahí.
 *
 * La rama **corta antes de conectar nada**, y eso importa: si conectara el botón y
 * después dibujara la maqueta encima, quedaría un oyente vivo sobre una pantalla que
 * no es la suya.
 */
import { setupMobileMenu, setCurrentYear } from './components/nav.js';
import { conectarComienzo, retomarElIntento } from './components/simulacro.js';
import { dibujarPantallaDelIntento, dibujarPantallaDelResumen } from './components/simulacro-maqueta.js';
import { mostrarAvisoDeRespaldo } from './components/aviso-de-respaldo.js';
import { mostrarAvisoDeGuardado } from './components/aviso-de-guardado.js';

setupMobileMenu();
setCurrentYear();

/**
 * Cuál maqueta se pidió en la dirección, o null si no se pidió ninguna.
 *
 * Se lee con `URLSearchParams` y se compara contra una lista cerrada: lo que venga
 * escrito ahí lo escribe quien quiera, así que no se usa para nada que no sea elegir
 * entre dos ramas conocidas. Nada de esto llega al DOM.
 */
function laMaquetaPedida() {
  const busqueda = globalThis.location?.search;
  if (!busqueda) return null;

  const pedida = new URLSearchParams(busqueda).get('maqueta');

  return pedida === 'intento' || pedida === 'resumen' ? pedida : null;
}

const maqueta = laMaquetaPedida();

if (maqueta) {
  const zona = document.querySelector('#zona-del-intento');

  if (zona) {
    const parametros = new URLSearchParams(globalThis.location.search);

    // `urgente=1` muestra el estado de los últimos segundos (decisión 3). Va aparte
    // y no como una tercera maqueta porque es la MISMA pantalla en otro momento: si
    // fuera otra función se podrían despintar una de la otra sin que se notara.
    const urgente = parametros.get('urgente') === '1';

    zona.innerHTML =
      maqueta === 'intento'
        ? dibujarPantallaDelIntento(urgente ? { segundos: 5, urgente: true, marcada: 374 } : {})
        : dibujarPantallaDelResumen();

    // `avisos=1` enciende los dos avisos, para poder mirar la decisión 6: **en una
    // línea mientras dura el intento, con su texto completo en la presentación y en
    // el resumen**. Van detrás de un parámetro y no puestos siempre por un motivo
    // que es medible: son estados excepcionales —la copia guardada y el almacén que
    // se llenó—, y dejarlos encendidos por omisión sumaría su alto al presupuesto
    // vertical que la decisión 1 reparte, con lo que el número calculado dejaría de
    // ser el de la pantalla normal.
    if (parametros.get('avisos') === '1') {
      const compacto = maqueta === 'intento';

      mostrarAvisoDeRespaldo({
        sello: { generada_en: '2026-09-10T00:00:00.000Z' },
        loQueSeCargo: 'el simulacro',
        compacto,
      });

      mostrarAvisoDeGuardado({ estado: 'fallo', compacto });
    }
  }
} else {
  conectarComienzo();

  // Se conecta primero y se retoma despues, a proposito: la retoma reescribe la zona
  // del intento, y el boton que deja dibujado necesita que el oyente ya este puesto.
  retomarElIntento();
}
