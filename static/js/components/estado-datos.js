/**
 * Indicador del estado de la capa de datos, en el pie del cuestionario.
 *
 * Nacio en la iteracion 12 para comprobar la tuberia contra la tabla de juguete
 * prueba_tuberia. En la iteracion 22 esa tabla y su extremo se retiraron, asi que
 * ahora cuenta lo que de verdad importa: cuantas preguntas trajo el banco.
 *
 * DONDE QUEDO EL AVISO DEL RESPALDO, Y POR QUE NO AQUI
 *
 * Este archivo se escribio esperando alojar el aviso de la instantanea (ADR-008).
 * No es aqui: el aviso de verdad va **arriba del banco**, en #aviso-respaldo, que
 * lo dibuja el componente del cuestionario. El pie es discreto a proposito, y un
 * aviso discreto no cumple lo que pide ADR-008 —«visible para el estudiante, no
 * solo un mensaje de consola»—: se lee despues de estudiar, o no se lee.
 *
 * Lo que si queda aqui es la linea de estado, que ahora tambien sabe decir cuando
 * las preguntas salieron de la copia y no de la base. Las dos cosas tienen que
 * decir lo mismo: si alguna vez se contradicen, la que manda es la de arriba.
 *
 * Discreto a proposito: al estudiante no le sirve de nada saber que hay una base
 * de datos detras. Lo que si le va a servir, cuando llegue el momento, es que le
 * digan que lo que esta viendo puede no estar al dia.
 *
 * POR QUE YA NO PIDE EL BANCO (iteracion 31)
 *
 * Hasta el 2026-09-11 esta linea llamaba a `leerPreguntas()` **solo para contar**
 * cuantas preguntas habia. Con el banco de juguete costaba nada; con el banco real
 * eran 371,8 KB descargados en cada carga de la pagina, medidos contra el servidor
 * local. Estaba anotado en el registro desde el 2026-09-05 como una peticion
 * duplicada sin consecuencias visibles.
 *
 * Con el filtrado por modulo dejo de ser una duplicacion inofensiva y paso a ser lo
 * contrario de lo que la pagina promete: el cuestionario arranca vacio, sin pedir
 * nada, para no descargarle el banco entero a quien estudia desde el telefono con
 * conexion modesta... y el pie lo descargaba igual, antes de que el estudiante
 * tocara nada.
 *
 * El numero sale ahora de `/api/estado`, que ya lo cuenta en la base —`preguntas_activas`,
 * de la misma vista de la que come el sitio— y pesa 0,2 KB. Se pide una sola cosa,
 * una sola vez.
 *
 * LO QUE ESTA LINEA DEJO DE PODER AFIRMAR, Y DONDE SE DICE AHORA
 *
 * Ya no sabe si la instantanea de respaldo cargo, porque ya no la carga. Antes lo
 * decia —«la copia guardada tampoco cargo»— y era cierto. Ahora, cuando la capa de
 * datos no contesta, esta linea dice **solo eso**: que no hay conexion. Lo que pase
 * con la copia lo dice la zona de preguntas, que es donde el estudiante lo necesita
 * y donde ADR-008 lo exige: o el aviso de la copia, o el mensaje de que el modulo no
 * se pudo cargar. Prometer aqui abajo una copia que a lo mejor no carga seria
 * exactamente la clase de afirmacion que este pie no puede sostener.
 */
import { $, esc, icon } from '../utils/dom.js';
import { consultarEstado } from '../servicios/datos.js';

/** Pinta una linea de estado en el pie. */
function mostrar(contenedor, nombreIcono, texto) {
  contenedor.innerHTML = `${icon(nombreIcono, 'text-sm')}<span>${esc(texto)}</span>`;
  // Se descubre recien ahora: hasta que hay algo que decir, la linea no ocupa
  // espacio en el pie.
  contenedor.classList.remove('hidden');
  contenedor.classList.add('inline-flex');
}

/**
 * Anuncia el entorno cuando NO es produccion.
 *
 * En produccion se calla: al estudiante no le aporta nada. En una vista previa o
 * en local, en cambio, es la diferencia entre revisar lo que crees que estas
 * revisando y revisar otra cosa. La regla es que el aviso aparezca solo, sin que
 * nadie tenga que acordarse de mirarlo.
 */
function sufijoDeEntorno(entorno) {
  if (!entorno || entorno === 'produccion') return '';
  return ` · Entorno: ${entorno}.`;
}

export async function renderEstadoDatos() {
  const contenedor = $('#estado-datos');
  if (!contenedor) return;

  const estado = await consultarEstado();

  if (!estado.ok) {
    // Se distingue el fallo del servicio del error de peticion. En el primer caso
    // no se dice nada de la copia: ver la cabecera de este archivo.
    const texto = estado.usar_respaldo
      ? 'Banco de preguntas: sin conexión con el servidor.'
      : `Banco de preguntas: ${estado.mensaje}`;
    mostrar(contenedor, 'database', texto);
    return;
  }

  // El numero es el del BANCO, no el del modulo que se este mirando. Son dos cosas
  // distintas y cada una tiene su sitio: el contador de la portada dice lo que hay
  // dibujado, y esta linea dice lo que hay en la base.
  const activas = estado.datos?.preguntas_activas ?? 0;

  // Un banco vacio es una respuesta correcta, no un fallo. Se dice tal cual.
  const texto =
    activas === 0
      ? 'Banco de preguntas: conectado, todavía sin contenido.'
      : `Banco de preguntas: conectado (${activas} preguntas).`;

  mostrar(contenedor, 'database', texto + sufijoDeEntorno(estado.datos?.entorno));
}
