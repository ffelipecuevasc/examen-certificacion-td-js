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

/**
 * Contra que entorno esta hablando esta respuesta.
 *
 * El nombre sale de la variable ENTORNO, declarada por separado en cada entorno
 * dentro de wrangler.toml: `produccion` arriba, `pruebas` en el bloque de vista
 * previa. El caso local no puede salir de ahi, porque el desarrollo local usa la
 * configuracion de arriba con una base D1 local; se reconoce por el dominio de la
 * peticion, que es el unico dato que lo distingue sin lugar a dudas.
 */
function nombreDelEntorno(request, env) {
  const dominio = new URL(request.url).hostname;
  if (dominio === 'localhost' || dominio === '127.0.0.1' || dominio === '[::1]') {
    return 'local';
  }
  return env?.ENTORNO ?? 'desconocido';
}

export const onRequest = soloLectura(async ({ base, request, env }) => {
  // Consulta deliberadamente trivial: no depende de ninguna tabla, asi que
  // distingue «la base no contesta» de «la tabla no existe».
  const { results } = await base.prepare('SELECT 1 AS vivo').all();

  return respuestaOk({
    servicio: 'capa de datos',
    entorno: nombreDelEntorno(request, env),
    enlace_d1: 'presente',
    consulta_d1: results?.[0]?.vivo === 1 ? 'correcta' : 'inesperada',
  });
});
