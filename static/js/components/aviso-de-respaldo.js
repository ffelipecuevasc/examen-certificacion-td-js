/**
 * El aviso de que lo que se esta viendo sale de la copia y no de la base (ADR-008).
 *
 * DE DONDE SALE ESTE ARCHIVO
 *
 * Nacio dentro de components/cuestionario.js en la iteracion 22 y salio de ahi en la
 * 41, etapa B, por el mismo motivo por el que salio la transicion de carga
 * (decision 9): el simulacro necesita el mismo aviso, y dos copias de lo mismo no
 * fallan cuando divergen, se quedan calladas. La que se quede atras seguiria
 * avisando de una manera distinta en una pagina y no en la otra, que en un aviso de
 * ADR-008 es lo peor que puede pasar: el sitio no puede servir el respaldo en
 * silencio.
 *
 * **La extraccion no cambio ni una palabra del aviso.** Lo unico que entra por
 * parametro es el nombre de lo que se cargo —«el cuestionario», «el simulacro»—,
 * que antes estaba escrito dentro de la frase. Pasandole «el cuestionario», el HTML
 * que sale es identico al que salia, y `probar:filtrado` lo comprueba byte a byte.
 *
 * POR QUE EL AVISO VA ARRIBA DEL CONTENIDO Y NO EN EL PIE
 *
 * ADR-008 lo pide con todas sus letras: el sitio sigue funcionando cuando la capa de
 * datos cae, y **avisa**, nunca en silencio. El estudiante tiene que saberlo antes
 * de estudiar, no despues.
 *
 * LA FECHA NO ES UN ADORNO
 *
 * Sale del sello del archivo generado, que es lo que ADR-023 obliga a escribir
 * dentro. Un «puede no estar al dia» sin fecha no le sirve a nadie para decidir si
 * confiar o no: con la fecha, quien sabe que el banco se corrigio ayer sabe que le
 * falta esa correccion.
 */
import { $, esc, icon } from '../utils/dom.js';

/**
 * Fecha legible en espanol, o null si no hay ninguna que leer.
 *
 * Devolver null y no una cadena vacia es a proposito: quien llama tiene que poder
 * decir «no se sabe de cuando es» en vez de dejar la frase a medias.
 */
function fechaLegible(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha);
}

/**
 * Dibuja el aviso, o lo apaga si no hay nada que avisar.
 *
 * @param {object} ajustes
 * @param {string} [ajustes.contenedor] Selector del hueco del aviso. Existe vacio y
 *        oculto en el HTML de la pagina, con `role="status"`, porque una region viva
 *        tiene que existir antes de que su contenido cambie para que el lector de
 *        pantalla la anuncie.
 * @param {object|null} ajustes.sello El sello del respaldo, o null si la fuente
 *        contesto en vivo. Con null el aviso se apaga, y eso tambien es parte del
 *        trabajo: una pagina que se recupera tiene que dejar de decir que esta caida.
 * @param {string} ajustes.loQueSeCargo Como se nombra en la frase lo que se cargo.
 *        Va con su articulo: «el cuestionario», «el simulacro».
 *
 * @param {boolean} [ajustes.compacto] Lo mete en UNA LINEA (decision 6 de la
 *        iteracion 45). Se usa solo mientras dura el intento del simulacro, donde el
 *        recuadro entero se come una franja del presupuesto vertical con el
 *        estudiante contra el reloj. **No se deja de avisar**: lo que cambia es el
 *        espacio, no si se avisa. La linea corta conserva las dos mitades que
 *        sirven para decidir —que lo que se ve es una copia, y de cuando es—, y
 *        deja fuera la explicacion. La presentacion y el resumen lo muestran entero.
 *
 * **ESTE AVISO NO CAMBIA DE COLOR NI DE BORDE EN LA ITERACION 45, y es a proposito.**
 * Lo comparten el cuestionario y el simulacro, asi que repintarlo aqui repintaria de
 * paso el cuestionario, que esta iteracion no toca. Su `border-jsyellow/40` da
 * 2,96:1 sobre `ink`, por debajo del 3:1 de WCAG 1.4.11, y no lo incumple: el aviso
 * no es un control y no se identifica por su borde, sino por su texto en `paper`
 * —19,57:1— y por su icono en `jsyellow` —15,53:1—. Queda escrito en la guia visual.
 *
 * `loQueSeCargo` es texto del sitio, no dato de la capa, asi que va a `innerHTML`
 * tal cual, igual que iba cuando estaba escrito dentro de la frase. El unico dato
 * que viene de fuera es la fecha del sello, y esa se escapa.
 */
export function mostrarAvisoDeRespaldo({
  contenedor = '#aviso-respaldo',
  sello,
  loQueSeCargo,
  compacto = false,
}) {
  const zona = $(contenedor);
  if (!zona) return;

  if (!sello) {
    zona.innerHTML = '';
    zona.classList.add('hidden');
    return;
  }

  const fecha = fechaLegible(sello.generada_en);

  const cuando = fecha
    ? `Es la copia del ${esc(fecha)}.`
    : 'La copia no trae fecha, asi que no se sabe de cuando es.';

  if (compacto) {
    zona.innerHTML = `
      <p class="flex items-center gap-2 border border-jsyellow/40 bg-jsyellow/5 rounded-lg px-3 py-2 text-xs text-paper">
        ${icon('database', 'text-base text-jsyellow shrink-0')}<span>Estás viendo una copia guardada del banco. ${cuando}</span>
      </p>`;

    zona.classList.remove('hidden');
    return;
  }

  zona.innerHTML = `
      <div class="flex items-start gap-3 border border-jsyellow/40 bg-jsyellow/5 rounded-xl px-5 py-4">
        ${icon('database', 'text-xl text-jsyellow shrink-0 mt-0.5')}
        <div>
          <p class="font-display font-bold text-paper text-sm">Estás viendo una copia guardada del banco de preguntas.</p>
          <p class="mt-1 text-sm text-muted">No se pudo conectar con el servidor, así que ${loQueSeCargo} se cargó desde la copia incluida en el sitio. Puedes practicar con normalidad, pero puede que falten preguntas nuevas o correcciones recientes. ${cuando}</p>
        </div>
      </div>`;

  zona.classList.remove('hidden');
}
