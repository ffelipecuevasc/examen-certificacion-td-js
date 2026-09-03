/**
 * Indicador del estado de la capa de datos, en el pie del cuestionario.
 *
 * En esta iteracion el sitio todavia no depende de D1 para nada: el banco sigue
 * viniendo de static/js/data/. Este indicador existe para que la tuberia se pueda
 * comprobar desde el propio sitio —que es un criterio de la iteracion 12— y para
 * dejar puesto el sitio donde la iteracion 22 va a mostrar el aviso de que se
 * esta usando la instantanea de respaldo (ADR-008).
 *
 * Discreto a proposito: al estudiante no le sirve de nada saber que hay una base
 * de datos detras. Lo que si le va a servir, cuando llegue el momento, es que le
 * digan que lo que esta viendo puede no estar al dia.
 */
import { $, esc, icon } from '../utils/dom.js';
import { consultarEstado, leerPrueba } from '../servicios/datos.js';

/** Pinta una linea de estado en el pie. */
function mostrar(contenedor, nombreIcono, texto) {
  contenedor.innerHTML = `${icon(nombreIcono, 'text-sm')}<span>${esc(texto)}</span>`;
  // Se descubre recien ahora: hasta que hay algo que decir, la linea no ocupa
  // espacio en el pie.
  contenedor.classList.remove('hidden');
  contenedor.classList.add('inline-flex');
}

export async function renderEstadoDatos() {
  const contenedor = $('#estado-datos');
  if (!contenedor) return;

  const estado = await consultarEstado();

  if (!estado.ok) {
    // Se distingue el fallo del servicio del error de peticion: solo el primero
    // justificara cambiar a la instantanea de respaldo.
    const texto = estado.usar_respaldo
      ? `Banco de preguntas: sin conexión. Estás viendo el material incluido en el sitio.`
      : `Banco de preguntas: ${estado.mensaje}`;
    mostrar(contenedor, 'database', texto);
    return;
  }

  const prueba = await leerPrueba();

  if (!prueba.ok) {
    mostrar(contenedor, 'database', 'Banco de preguntas: conectado, sin poder leer.');
    return;
  }

  // Una lista vacia es una respuesta correcta, no un fallo. Se dice tal cual.
  const texto = prueba.vacio
    ? 'Banco de preguntas: conectado, todavía sin contenido.'
    : `Banco de preguntas: conectado (${prueba.datos.length} registros de prueba).`;

  mostrar(contenedor, 'database', texto);
}
