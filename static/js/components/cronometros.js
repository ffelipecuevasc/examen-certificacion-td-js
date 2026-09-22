/**
 * Los dos cronometros del simulacro (iteracion 42).
 *
 * QUE CUENTA CADA UNO
 *
 *   - **30 segundos por pregunta.** Al agotarse, la pregunta se resuelve sola con la
 *     regla de la decision 2 —cuenta la alternativa marcada, o queda omitida— y se
 *     pasa a la siguiente, sin vuelta atras.
 *   - **El tiempo transcurrido del intento.** Cuenta hacia arriba y no es un plazo:
 *     con el sobrante perdido (decision 1), 120 preguntas de 30 segundos no pueden
 *     agotarse antes que las preguntas, asi que «terminar por tiempo total» no existe
 *     como camino y no hay ninguna linea aqui que lo haga.
 *
 * LA REGLA QUE ORDENA TODO EL ARCHIVO (decision 5)
 *
 * **Ninguna cifra sale de contar pulsos.** Las dos se calculan restando: «ahora menos
 * el instante guardado». El temporizador de aqui abajo existe **solo para repintar**,
 * y si se atrasa —una pestana en segundo plano, un telefono bloqueado— lo unico que
 * pasa es que la pantalla se refresca tarde; el numero que escribe cuando por fin
 * corre sigue siendo el correcto, porque lo vuelve a restar.
 *
 * Es la diferencia entre un cronometro que se atrasa y uno que no, y se puede
 * provocar: `relojDeMentira().saltar(120000)` mueve el reloj sin vencer ni un
 * temporizador, que es exactamente lo que hace el navegador con una pestana oculta.
 * Un cronometro que contara pulsos sobrevive a `avanzar()` y se queda corto con
 * `saltar()`.
 *
 * UN SOLO TEMPORIZADOR, Y NO DOS
 *
 * Uno para repintar y otro para el plazo de la pregunta serian dos cosas que pueden
 * vencer en el mismo instante, y el orden entre ellas decidiria si la pantalla
 * alcanza a mostrar el cero. Aqui hay uno: cada vez que corre se pone al dia, pinta,
 * y se vuelve a citar para el primero de los dos instantes que importen —el proximo
 * borde de segundo o el plazo de la pregunta—.
 *
 * PONERSE AL DIA ES UN BUCLE, Y ESO CUBRE TRES CASOS CON UN SOLO CAMINO
 *
 * Volver de dos minutos en segundo plano, volver de una recarga, y el caso normal de
 * un plazo que vence, son el mismo calculo: mientras el plazo de la pregunta actual
 * ya haya pasado, resolverla y seguir con la siguiente. Cuatro preguntas agotadas
 * mientras el telefono estaba bloqueado se resuelven las cuatro, **en orden**, y cada
 * una con SU instante de vencimiento y no con el de ahora: la decision 3 dice que se
 * resuelven «con la regla 2», no que se amontonen en el momento de volver.
 *
 * LA URGENCIA (decision 1 del autor, 2026-09-18)
 *
 * A los **10 segundos restantes**, ni antes ni despues. La forma la fijo la
 * iteracion 45 y aqui no se reinventa: se le pasa `urgente` a
 * `dibujarFranjaDelIntento()` y esa funcion cambia la superficie entera de la franja
 * **y** pone el texto «quedan N segundos» en el sitio del avance. Son dos senales
 * ademas del color, que es lo que pide el criterio de que no dependa solo del color.
 *
 * EL MOVIMIENTO REDUCIDO
 *
 * No hay nada que apagar, y eso es el resultado de una decision de la 45, no un
 * descuido: la cifra la escribe JavaScript en cada latido y no hay ninguna animacion
 * CSS de 30 segundos. Una animacion asi, con movimiento reducido, se completaria en
 * el primer fotograma y dejaria el cronometro en cero desde el segundo cero. Lo que
 * este archivo comprueba es que **no declara movimiento en ningun caso**, y por eso
 * no pone ni consulta ninguna clase de animacion.
 *
 * LO QUE ESTE ARCHIVO NO HACE, Y ES DE LA ITERACION 43
 *
 * No dibuja la pregunta, no lee alternativas y no sabe como se marca una. Recibe
 * `alternativaMarcada()` y la llama cuando el plazo vence. Hoy la 42 se la pasa
 * devolviendo siempre `null` —sin recorrido no hay nada que marcar, y por la regla de
 * la decision 2 eso significa omitida—, y la 43 la conectara a la tarjeta de verdad
 * sin tocar una linea de aqui.
 */
import { $ } from '../utils/dom.js';
import { reloj } from '../servicios/reloj.js';
import { dibujarFranjaDelIntento, formatearTranscurrido } from './simulacro-maqueta.js';

/** Lo que dura una pregunta. La regla 2 del README de la epica 40. */
export const MS_POR_PREGUNTA = 30000;

/** A cuanto restante se enciende la franja. Decision del autor, 2026-09-18. */
export const URGENCIA_MS = 10000;

// `formatearTranscurrido()` vive en components/simulacro-maqueta.js desde la iteracion 44:
// la usan la franja y el resumen, y la maqueta es quien decide como se escribe cada cifra.
// Se vuelve a exportar desde aqui para quien ya la importaba de este archivo.
export { formatearTranscurrido };

/**
 * Los segundos que se muestran, redondeando hacia arriba.
 *
 * Hacia arriba y no hacia abajo para que el primer instante de la pregunta diga 30 y
 * no 29, y para que el ultimo segundo se vea entero. El cero aparece solo en el
 * instante exacto del vencimiento, y dura lo que tarda el avance.
 */
const segundosQueQuedan = (restanteMs) => Math.max(0, Math.ceil(restanteMs / 1000));

/**
 * Pone en marcha los dos cronometros sobre un intento ya armado.
 *
 * @param {object} enganches
 * @param {() => object} enganches.estado  `{ empezado_en, comenzada_en, posicion, total }`
 * @param {() => (number|null)} enganches.alternativaMarcada  cual esta marcada ahora
 * @param {(paso: object) => void} enganches.resolverLaPregunta  la anota y avanza
 *
 * AL TERMINAR EL INTENTO, EL MOTOR SOLO SE APAGA Y VACIA LA FRANJA. Hasta la iteracion 44
 * tenia un enganche para «ya no quedan preguntas» que dibujaba la pantalla final; y la misma
 * pantalla la dibujaba tambien el recorrido al no encontrar pregunta, asi que salia dos
 * veces. La decision B4 de la 44 dejo un solo camino, el del recorrido, porque es el que
 * cubre ademas la recarga de un intento terminado y el intento sin arriendo, donde este
 * motor no llega a arrancar.
 */
export function crearCronometros({
  estado,
  alternativaMarcada = () => null,
  resolverLaPregunta,
}) {
  let pase = null;
  let andando = false;

  /**
   * Si ya estamos dentro de un latido.
   *
   * `resolverLaPregunta()` avisa a quien llama de que la pregunta cambio, y quien
   * llama repinta pidiendo otro latido. Eso es lo correcto cuando la respuesta viene
   * de fuera —la 43 pulsando «Siguiente»—, y seria una recursion de 120 niveles
   * cuando viene de aqui adentro, que es justo lo que pasa al ponerse al dia tras dos
   * minutos en segundo plano.
   */
  let dentroDeUnLatido = false;

  const franja = () => $('#franja-del-simulacro');

  /**
   * Resuelve todas las preguntas cuyo plazo ya paso.
   *
   * Devuelve cuantas resolvio. Cero es el caso normal de un latido cualquiera.
   */
  const ponerseAlDia = () => {
    let resueltas = 0;

    for (;;) {
      const ahora = estado();
      if (ahora.posicion >= ahora.total) break;

      const plazo = ahora.comenzada_en + MS_POR_PREGUNTA;
      if (reloj().ahora() < plazo) break;

      const marcada = alternativaMarcada();

      // El instante que se anota es EL DEL VENCIMIENTO, no el de ahora. Si se anotara
      // el de ahora, las cuatro preguntas que se agotaron mientras el telefono estaba
      // bloqueado quedarian las cuatro con el mismo instante —el del regreso—, y el
      // intento diria que se respondieron todas a la vez.
      resolverLaPregunta({
        posicion: ahora.posicion,
        alternativa_id: marcada,
        estado: marcada === null ? 'omitida' : 'respondida',
        agotada: true,
        resuelta_en: plazo,
      });

      resueltas += 1;

      // Una guarda contra un `resolverLaPregunta` que no avance: sin esto, un fallo
      // del llamador se convertiria en un bucle infinito que cuelga la pestana, que es
      // bastante peor que el fallo original.
      if (estado().posicion <= ahora.posicion) break;
    }

    return resueltas;
  };

  /** Escribe la franja con las cifras de este instante. */
  const pintar = () => {
    const donde = franja();
    if (!donde) return;

    const ahora = estado();

    if (ahora.posicion >= ahora.total) {
      donde.innerHTML = '';
      return;
    }

    const restante = Math.max(0, ahora.comenzada_en + MS_POR_PREGUNTA - reloj().ahora());
    const segundos = segundosQueQuedan(restante);

    donde.innerHTML = dibujarFranjaDelIntento({
      segundos,
      posicion: ahora.posicion + 1,
      total: ahora.total,
      transcurrido: formatearTranscurrido(reloj().ahora() - ahora.empezado_en),
      urgente: restante <= URGENCIA_MS,
    });
  };

  /**
   * Cuando hay que volver a mirar: el primero entre el proximo borde de segundo y el
   * plazo de la pregunta.
   *
   * El borde se calcula desde el comienzo de la pregunta y no desde ahora, para que la
   * cifra cambie siempre en el mismo instante del segundo y no vaya derivando.
   */
  const cuandoVolver = () => {
    const ahora = estado();
    const desdeElComienzo = reloj().ahora() - ahora.comenzada_en;
    const hastaElBorde = 1000 - (((desdeElComienzo % 1000) + 1000) % 1000);
    const hastaElPlazo = ahora.comenzada_en + MS_POR_PREGUNTA - reloj().ahora();

    return Math.max(1, Math.min(hastaElBorde, hastaElPlazo));
  };

  const latir = () => {
    if (!andando || dentroDeUnLatido) return;

    dentroDeUnLatido = true;
    try {
      latirDeVerdad();
    } finally {
      dentroDeUnLatido = false;
    }
  };

  const latirDeVerdad = () => {
    ponerseAlDia();

    if (estado().posicion >= estado().total) {
      pintar();
      detener();
      return;
    }

    pintar();

    // Por lo mismo que en el arriendo: `resolverLaPregunta()` pudo apagar todo esto
    // desde dentro, y citarse igual dejaria un cronometro vivo sin intento detras.
    if (andando) pase = reloj().alCabo(cuandoVolver(), latir);
  };

  function detener() {
    andando = false;
    if (pase !== null) reloj().cancelar(pase);
    pase = null;
  }

  return {
    /**
     * Arranca. Lo primero que hace es ponerse al dia, y eso cubre la recarga: un
     * intento guardado hace dos minutos vuelve con sus preguntas agotadas ya
     * resueltas, antes de pintar nada.
     */
    arrancar() {
      andando = true;

      // Volver de segundo plano no espera al proximo latido: el navegador puede haber
      // estrangulado el temporizador media hora. Se atiende el evento y se pone al dia
      // en el acto, que es lo que hace que el tiempo mostrado al volver sea el real.
      reloj().alCambiarLaVisibilidad(() => {
        if (!andando || reloj().oculta()) return;
        latir();
      });

      latir();
    },
    detener,
    /** Para poder pedir un repintado desde fuera, cuando la 43 cambie de pregunta. */
    latir,
    /** Lo que se esta mostrando ahora, sin leer HTML. Para las pruebas. */
    loQueMuestra() {
      const ahora = estado();
      const restante = Math.max(0, ahora.comenzada_en + MS_POR_PREGUNTA - reloj().ahora());

      return {
        segundos: segundosQueQuedan(restante),
        transcurrido: formatearTranscurrido(reloj().ahora() - ahora.empezado_en),
        urgente: restante <= URGENCIA_MS,
        posicion: ahora.posicion,
      };
    },
  };
}
