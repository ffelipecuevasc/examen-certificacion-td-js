/**
 * GET /api/estado — comprobacion de estado de la capa de datos.
 *
 * No se limita a responder «vivo»: pregunta a D1 para que la respuesta distinga
 * los tres estados que se confunden entre si cuando algo falla.
 *
 *   200 ok=true                        la funcion corre y D1 contesta
 *   503 codigo=SIN_ENLACE              la funcion corre, pero no hay base enlazada
 *   503 codigo=FALLO_CONSULTA          hay enlace, pero la base no contesta
 *
 * Si no responde nada de eso, entonces el problema esta antes: functions/ no se
 * desplego, o lo que esta contestando es el servidor de archivos estaticos.
 */
import { respuestaOk, soloLectura } from './_comun.js';

export const onRequest = soloLectura(async ({ base }) => {
  // Consulta deliberadamente trivial: no depende de ninguna tabla, asi que
  // distingue «la base no contesta» de «la tabla no existe».
  const { results } = await base.prepare('SELECT 1 AS vivo').all();

  return respuestaOk({
    servicio: 'capa de datos',
    enlace_d1: 'presente',
    consulta_d1: results?.[0]?.vivo === 1 ? 'correcta' : 'inesperada',
  });
});
