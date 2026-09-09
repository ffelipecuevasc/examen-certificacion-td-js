/**
 * GET /api/estado — comprobacion de estado de la capa de datos.
 *
 * POR QUE ESTE ARCHIVO SE REESCRIBIO (iteracion 24, H-022)
 *
 * La version anterior preguntaba `SELECT 1 AS vivo` y con eso concluia
 * `consulta_d1: "correcta"`. Esa consulta **no puede fallar por el motivo que
 * importa**: pasa igual con la base sin esquema. El 2026-09-08, contra el sitio
 * publicado, informaba que todo estaba bien mientras `/api/preguntas` devolvia 503.
 *
 * Y habia algo peor, que aparecio el 2026-09-09 con el esquema ya aplicado y el
 * banco en cero: `/api/preguntas` respondia `vacio: true` y este extremo respondia
 * `vacio: false`, **en el mismo minuto y en la misma direccion**. No era solo que
 * no supiera fallar: afirmaba algo falso, en el unico sitio al que uno acude para
 * saber que pasa. El `vacio` salia de `respuestaOk()`, que lo calculaba sobre un
 * objeto y daba `false` siempre. Arreglado alli: ese campo ya solo aparece cuando
 * lo que se entrega es una lista.
 *
 * LAS DOS PREGUNTAS, Y POR QUE SON DOS
 *
 *   SELECT 1                              ¿contesta D1?
 *   SELECT COUNT(*) FROM pregunta_activa  ¿existe el esquema, y cuanto hay?
 *
 * La primera se conserva a proposito, aunque parezca redundante: es la unica que
 * distingue «la base no contesta» de «la base contesta pero le falta el esquema».
 * Reemplazarla por la segunda habria ganado el fallo y perdido la distincion.
 *
 * LOS ESTADOS QUE SABE DISTINGUIR
 *
 *   200 ok=true                    D1 contesta, el esquema esta, y dice cuantas
 *                                  preguntas activas hay. Cero es una respuesta
 *                                  valida y se dice con todas sus letras.
 *   503 codigo=SIN_ENLACE          la funcion corre, pero no hay base enlazada
 *   503 codigo=SIN_ESQUEMA         la base contesta, pero le falta el esquema
 *   503 codigo=FALLO_CONSULTA      la base no contesta
 *
 * Si no responde nada de eso, el problema esta antes: functions/ no se desplego, o
 * lo que contesta es el servidor de archivos estaticos.
 *
 * LA REGLA QUE ORDENA ESTE ARCHIVO
 *
 * Un diagnostico que nunca ha dado un resultado negativo no esta comprobado. Los
 * tres estados de fallo se provocan, no se describen.
 */
import { respuestaError, respuestaOk, soloLectura } from './_comun.js';

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

/** Reconoce el error de D1 cuando la tabla o la vista no existen. */
const faltaElEsquema = (error) => /no such table/i.test(String(error?.message ?? error));

export const onRequest = soloLectura(async ({ base, request, env }) => {
  // 1. ¿Contesta la base? Consulta deliberadamente trivial: no depende de ninguna
  //    tabla, asi que si esta falla el problema es de la base y no del esquema.
  //    Si revienta, `soloLectura` la convierte en FALLO_CONSULTA.
  const vivo = await base.prepare('SELECT 1 AS vivo').all();

  if (vivo.results?.[0]?.vivo !== 1) {
    return respuestaError('FALLO_CONSULTA', 'La base contesto algo que no se esperaba.');
  }

  // 2. ¿Esta el esquema, y cuanto hay dentro? Se pregunta por la MISMA vista de la
  //    que come el sitio, no por una tabla cualquiera: comprobar algo distinto de
  //    lo que se usa es como no comprobar nada.
  let activas;

  try {
    const banco = await base.prepare('SELECT COUNT(*) AS activas FROM pregunta_activa').all();
    activas = banco.results?.[0]?.activas ?? 0;
  } catch (error) {
    if (faltaElEsquema(error)) {
      return respuestaError(
        'SIN_ESQUEMA',
        'Falta aplicar las migraciones de d1/migraciones/ en esta base.'
      );
    }
    throw error;
  }

  return respuestaOk({
    servicio: 'capa de datos',
    entorno: nombreDelEntorno(request, env),
    enlace_d1: 'presente',
    base_responde: true,
    esquema: 'presente',
    preguntas_activas: activas,
    // Se dice explicitamente y con nombre propio. Es el dato que este extremo
    // afirmaba al reves durante un dia entero (H-022), asi que ahora sale de
    // contar la vista y no de deducirlo de la forma de la respuesta.
    banco_vacio: activas === 0,
  });
});
