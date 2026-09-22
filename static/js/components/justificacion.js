/**
 * La justificacion de una pregunta: si hay algo que explicar, y como se dibuja.
 *
 * Extraida de `components/cuestionario.js` en la iteracion 44 (decision 3): el
 * resumen del simulacro dibuja la justificacion con ESTA pieza, y el cuestionario
 * tambien. Dos copias del mismo recuadro son dos recuadros que un dia dejan de
 * parecerse.
 *
 * RECIBE LA PREGUNTA Y NADA MAS
 *
 * No sabe del banco cargado, ni de si la pregunta se respondio en esta visita o se
 * restauro de otra, ni de que pagina la llama. Eso es de cada pagina: en el
 * cuestionario, `porqueDibujado()` y «Ver por qué» siguen alla, porque son propios
 * de el. Lo unico que viaja aqui es lo que ninguna de las dos puede dibujar distinto.
 *
 * `scripts/probar-escapado.mjs` (seccion 5a-2) exige que el HTML sea exactamente el
 * que el cuestionario dibujaba antes de moverla, y que el cuestionario no conserve
 * una copia propia.
 */

import { esc } from '../utils/dom.js';

/**
 * Si esta pregunta trae algo que explicar.
 *
 * El esquema deja la columna nula (`d1/migraciones/001-banco-de-preguntas.sql`) y
 * quien vigila que ninguna activa se quede sin justificacion es
 * `d1/verificar-banco.sql`, no la validacion por fila del camino de lectura: una
 * pregunta SIN justificacion puede llegar al navegador. Hoy no llega ninguna —368 de
 * 368 la traen—, y por eso mismo la unica forma de saber que este caso se trata bien
 * es provocarlo.
 *
 * Se mira el dato y no el nodo dibujado. Preguntarle al DOM «¿hay un recuadro?»
 * responderia que si en el momento justo en que se acaba de dibujar vacio.
 */
export const tieneJustificacion = (pregunta) =>
  typeof pregunta?.justificacion === 'string' && pregunta.justificacion.trim() !== '';

/**
 * El contenido del recuadro del porque. **Texto de la base: se escapa siempre.**
 *
 * Sale de aqui y no de varios sitios por el mismo motivo que `veredictoDibujado()` en
 * el cuestionario: hay mas de un camino que llega al mismo recuadro —en el
 * cuestionario, responder ahora y pulsar «Ver por qué» en una pregunta de otra
 * visita; y desde la iteracion 44, la revision del simulacro— y si cada uno armara su
 * propio HTML, el dia que uno cambie el estudiante veria una cosa en un lado y otra
 * en el otro.
 *
 * NI UN GRIS, Y NO ES CASUALIDAD
 *
 * La iteracion 36 dejo `mutedink` y `muted` a 1,19:1 entre si, asi que la jerarquia
 * ya no se puede expresar con dos grises (decision 5 bis de la 36). Este recuadro no
 * usa ninguno de los dos: se distingue por el fondo —`panel2` dentro de una tarjeta
 * `panel`—, por el borde y por el rotulo en amarillo y en negrita. Los dos textos van
 * en color principal sobre ese fondo: 13,01:1 el rotulo y 16,40:1 el cuerpo.
 */
export const justificacionDibujada = (pregunta) => `
              <p class="font-display font-bold text-jsyellow text-[11px] uppercase tracking-widest">Por qué</p>
              <p class="mt-1.5 text-sm text-paper leading-relaxed">${esc(pregunta.justificacion)}</p>`;
