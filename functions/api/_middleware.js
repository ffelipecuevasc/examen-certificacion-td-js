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
 *
 * Desde la iteracion 51 tiene una segunda tarea: poner las cabeceras de seguridad
 * de /api/. `_headers` no sirve aqui —Pages no lo aplica a las respuestas de las
 * funciones, y la documentacion lo dice textual—, y este es el unico punto por el
 * que pasan TODAS: las de cada extremo y la que se arma abajo para una ruta que
 * no existe. Solo se agregan cabeceras; el rol de solo lectura no cambia (ADR-007).
 */
import { respuestaError } from './_comun.js';

/**
 * Lo que toda respuesta de /api/ lleva.
 *
 * nosniff, para que nadie interprete el JSON como otra cosa. Y una politica que
 * no permite cargar nada ni ser enmarcada: un JSON no necesita ninguna de las
 * dos, y si alguien abre una respuesta de la capa en el navegador, no ejecuta
 * nada de lo que viniera dentro.
 */
const CABECERAS_DE_SEGURIDAD = {
  'x-content-type-options': 'nosniff',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
};

function conCabecerasDeSeguridad(respuesta) {
  // Se copia en vez de tocarla: la que devuelve contexto.next() puede venir con
  // las cabeceras inmutables.
  const copia = new Response(respuesta.body, respuesta);
  for (const [nombre, valor] of Object.entries(CABECERAS_DE_SEGURIDAD)) copia.headers.set(nombre, valor);
  return copia;
}

export async function onRequest(contexto) {
  return conCabecerasDeSeguridad(await responder(contexto));
}

async function responder(contexto) {
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
