/**
 * El aviso de que este intento no se esta guardando (iteracion 41, decision 7).
 *
 * POR QUE SE DICE, Y NO SE CALLA
 *
 * Es el mismo argumento de ADR-008 y el mismo de ADR-034: **degradar si, en silencio
 * no.** El simulacro sigue funcionando sin almacenamiento —se arma el intento, se
 * responde, se corrige al final—, y lo unico que se pierde es que sobreviva a una
 * recarga. Pero un estudiante que responde noventa preguntas de un intento de 120 y
 * las pierde al recargar, sin que nadie se lo hubiera advertido, tiene todo el
 * derecho a pensar que el sitio esta roto. Aqui pesa mas que en el cuestionario: alla
 * se pierde un modulo que se puede rehacer en ratos sueltos, aca se pierde una hora
 * de examen que no se puede rehacer a medias.
 *
 * DOS ESTADOS, Y DICEN COSAS DISTINTAS
 *
 *   'sin_almacen'  no hay donde guardar desde el principio —cookies bloqueadas, o el
 *                  almacen ya estaba lleno—. Se sabe ANTES de empezar, asi que el
 *                  aviso es una advertencia: esto no va a sobrevivir a una recarga.
 *   'fallo'        se estaba guardando y una escritura fallo a mitad. Se sabe
 *                  DESPUES, asi que el aviso es una noticia: lo que hay guardado
 *                  quedo viejo, y recargar pierde lo de despues.
 *
 * Son dos frases distintas porque el estudiante puede hacer cosas distintas con
 * ellas: con la primera sabe, antes de invertir una hora, que no debe recargar; con
 * la segunda sabe que ya no puede confiar en lo guardado.
 *
 * POR QUE NO SE EXTRAJO DEL CUESTIONARIO
 *
 * `components/cuestionario.js` tiene su propio aviso de almacenamiento, y el aviso de
 * ADR-008 se extrajo a un componente compartido en la etapa B por el argumento de que
 * dos copias que divergen se quedan calladas. Aca se decidio no compartirlo, y
 * conviene dejar dicho por que: los textos **no son el mismo texto** —uno habla del
 * modulo y de empezar de cero, el otro de un intento de 120 preguntas que se pierde
 * entero— y este tiene un segundo estado que el cuestionario no tiene. Una pieza
 * compartida tendria que recibir el titulo, el cuerpo y el estado por parametro, o
 * sea todo lo que dibuja: lo compartido seria el recuadro, que son cuatro clases de
 * Tailwind. Lo que si se comparte, y es lo que importaba, es **la sonda**: la de
 * `servicios/memoria.js`, una sola para toda la pagina.
 */
import { $, icon } from '../utils/dom.js';

/**
 * Dibuja el aviso, o lo apaga si no hay nada que avisar.
 *
 * @param {object} ajustes
 * @param {string} [ajustes.contenedor] Selector del hueco. Existe vacio y oculto en
 *        el HTML de la pagina, con `role="status"`, porque una region viva tiene que
 *        existir antes de que su contenido cambie para que el lector de pantalla la
 *        anuncie. Y vive FUERA de la zona que la transicion reescribe: dentro, el
 *        propio acto de cargar lo borraria.
 * @param {string} ajustes.estado 'guardando', 'sin_almacen' o 'fallo'. Viene de
 *        `servicios/intento-guardado.js`, que es quien sabe como fue la ultima
 *        escritura. Este componente no lo averigua por su cuenta: si lo hiciera
 *        habria dos sitios decidiendo lo mismo.
 *
 * No hay ni un dato del banco en este archivo, asi que no hay nada que escapar. La
 * regla del proyecto sigue en pie: el dia que alguien meta aqui texto que venga de
 * `data/` o de la capa, pasa por `esc()`.
 */
export function mostrarAvisoDeGuardado({ contenedor = '#aviso-guardado', estado }) {
  const zona = $(contenedor);
  if (!zona) return;

  if (estado !== 'sin_almacen' && estado !== 'fallo') {
    zona.innerHTML = '';
    zona.classList.add('hidden');
    return;
  }

  const titulo =
    estado === 'sin_almacen'
      ? 'Tu intento no se está guardando.'
      : 'Tu intento ya no se está guardando.';

  const cuerpo =
    estado === 'sin_almacen'
      ? 'Este navegador no permite guardar datos del sitio: puede ser el bloqueo de cookies o que el almacenamiento esté lleno. Puedes rendir el simulacro igual, pero si recargas la página el intento se pierde y hay que empezar otro.'
      : 'El navegador dejó de aceptar lo que se guarda, lo más probable es que el almacenamiento se haya llenado. El simulacro sigue funcionando y puedes terminarlo, pero si recargas la página se pierde.';

  zona.innerHTML = `
      <div class="flex items-start gap-3 border border-panel3 bg-panel rounded-xl px-5 py-4">
        ${icon('restart-alt', 'text-xl text-jsyellow shrink-0 mt-0.5')}
        <div>
          <p class="font-display font-bold text-paper text-sm">${titulo}</p>
          <p class="mt-1 text-sm text-muted">${cuerpo}</p>
        </div>
      </div>`;

  zona.classList.remove('hidden');
}
