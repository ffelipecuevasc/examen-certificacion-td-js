/**
 * Se ejecuta antes que cualquier extremo de /api/.
 *
 * Su unica tarea es que una ruta inexistente bajo /api/ no responda la pagina 404
 * del sitio, en HTML, sino el mismo formato de error que todo lo demas. Sin esto,
 * un error de escritura en una direccion le llegaria al navegador como una pagina
 * web, el cliente no podria interpretarla, y el sitio concluiria que la capa de
 * datos se cayo cuando en realidad la direccion estaba mal escrita. Son dos
 * problemas distintos y llevan a dos reacciones distintas: uno se arregla
 * corrigiendo el codigo, el otro cambiando a la instantanea de respaldo.
 */
import { respuestaError } from './_comun.js';

export async function onRequest(contexto) {
  const respuesta = await contexto.next();

  // Bajo /api/ solo existe JSON: todo lo que sale de estas funciones lo es. Si lo
  // que vuelve no es JSON, entonces ninguna funcion se hizo cargo y la peticion
  // cayo al servidor de archivos estaticos.
  //
  // Se mira el tipo de contenido y no el codigo 404 porque el servidor de
  // archivos no siempre responde 404: comprobado en local, devuelve la portada
  // con un 200 para cualquier direccion que no reconoce. Mirar solo el codigo
  // dejaba pasar el HTML.
  const tipo = respuesta.headers.get('content-type') ?? '';
  if (!tipo.includes('application/json')) return respuestaError('NO_ENCONTRADO');

  return respuesta;
}
