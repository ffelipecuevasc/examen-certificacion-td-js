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
 */
import { $, esc, icon } from '../utils/dom.js';
import { consultarEstado, leerPreguntas } from '../servicios/datos.js';

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
  const banco = await leerPreguntas();

  // El respaldo se mira PRIMERO, y por eso se pide el banco antes de decidir
  // nada: cuando la capa de datos cae, `estado` viene con error y `banco` viene
  // con preguntas igual, salidas de la instantanea. Preguntar solo por el estado
  // haria decir «sin conexion» debajo de un cuestionario que se esta usando.
  const sello = banco.meta?.respaldo;

  if (sello) {
    mostrar(
      contenedor,
      'database',
      `Banco de preguntas: copia guardada en el sitio (${sello.preguntas} preguntas). Sin conexión con el servidor.`
    );
    return;
  }

  if (!estado.ok) {
    // Se distingue el fallo del servicio del error de peticion: solo el primero
    // justifica cambiar a la instantanea, y si se llego hasta aqui es que ni
    // siquiera la instantanea se pudo cargar.
    const texto = estado.usar_respaldo
      ? `Banco de preguntas: sin conexión, y la copia guardada tampoco cargó.`
      : `Banco de preguntas: ${estado.mensaje}`;
    mostrar(contenedor, 'database', texto);
    return;
  }

  if (!banco.ok) {
    mostrar(contenedor, 'database', 'Banco de preguntas: conectado, sin poder leer.');
    return;
  }

  // Una lista vacia es una respuesta correcta, no un fallo. Se dice tal cual.
  const texto = banco.vacio
    ? 'Banco de preguntas: conectado, todavía sin contenido.'
    : `Banco de preguntas: conectado (${banco.datos.length} preguntas).`;

  mostrar(contenedor, 'database', texto + sufijoDeEntorno(estado.datos?.entorno));
}
