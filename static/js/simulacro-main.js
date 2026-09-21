/**
 * Punto de entrada de la página del simulacro de examen.
 *
 * Presenta las reglas, y al pulsar «Comenzar el simulacro» pide la lista de ids,
 * elige las 120 preguntas en el navegador, las trae, las guarda congeladas y
 * **empieza el recorrido**: una pregunta a la vez, con sus 30 segundos corriendo en la
 * franja de arriba. Al volver con un intento a medias, lo retoma en la pregunta donde
 * iba. Lo que falta para cerrar la página es el resumen del final, que es de la
 * iteración 44.
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
import { conectarComienzo, conectarElRecorrido, retomarElIntento } from './components/simulacro.js';
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

    // `reprobado=1` muestra el otro estado de la tarjeta del resultado. Va por
    // parámetro y no como otra maqueta por el mismo motivo que `urgente`: es la MISMA
    // pantalla con otro dato, y separarlas en dos funciones dejaría que una se
    // despintara sin que se notara en la otra. Y es el estado donde el contraste
    // aprieta —`ink` sobre `ruby` da 4,41:1—, así que tiene que poder mirarse.
    const reprobado = parametros.get('reprobado') === '1';

    // `avisos=1` se lee ANTES de dibujar porque la columna del intento lo necesita:
    // con un aviso encendido encima, el margen negativo que compensa el relleno de la
    // sección se dibujaría sobre el aviso. Lo explica entero
    // `dibujarColumnaDelIntento()`; acá la maqueta tiene que enseñar lo mismo que hace
    // la página de verdad, o deja de servir para mirarlo.
    const conAvisos = parametros.get('avisos') === '1';

    zona.innerHTML =
      maqueta === 'intento'
        ? dibujarPantallaDelIntento(
            urgente
              ? { segundos: 5, urgente: true, marcada: 374, pegadaAlEncabezado: !conAvisos }
              : { pegadaAlEncabezado: !conAvisos }
          )
        : dibujarPantallaDelResumen({ aprobado: !reprobado });

    // `avisos=1` enciende los dos avisos, para poder mirar la decisión 6: **en una
    // línea mientras dura el intento, con su texto completo en la presentación y en
    // el resumen**. Van detrás de un parámetro y no puestos siempre por un motivo
    // que es medible: son estados excepcionales —la copia guardada y el almacén que
    // se llenó—, y dejarlos encendidos por omisión sumaría su alto al presupuesto
    // vertical que la decisión 1 reparte, con lo que el número calculado dejaría de
    // ser el de la pantalla normal.
    if (conAvisos) {
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

  // El recorrido de la iteración 43. Los dos oyentes viven sobre `#zona-del-intento`
  // y no se estorban: cada uno mira si el clic cayó en lo suyo y, si no, se aparta.
  // Van los dos por delegación porque la zona se reescribe entera en cada toque.
  conectarElRecorrido();

  // Se conecta primero y se retoma despues, a propósito: la retoma reescribe la zona
  // del intento, y lo que deja dibujado —la pregunta donde iba, con sus alternativas y
  // sus botones— necesita que los oyentes ya estén puestos.
  retomarElIntento();
}
