/**
 * Cliente de la capa de datos.
 *
 * Unico lugar del navegador que habla con /api/. Los componentes no llaman a
 * fetch por su cuenta: piden por aca y reciben siempre la misma forma de
 * respuesta, venga de donde venga el problema.
 *
 * Las funciones viven en el mismo dominio que las paginas, asi que las rutas son
 * relativas y no hay origen cruzado que resolver (ADR-011).
 *
 * Lo que devuelve, siempre con esta forma:
 *
 *   { ok: true,  datos, meta, vacio }
 *   { ok: false, codigo, mensaje, usar_respaldo }
 *
 * Los nombres de los campos son los mismos a los dos lados del limite, en
 * snake_case, y no se traducen al entrar al navegador. La razon esta en ADR-011:
 * las filas de D1 llegan con el nombre de su columna, y renombrarlas campo por
 * campo seria trabajo puro sobre las decenas de columnas del banco de preguntas.
 * El codigo del navegador que no toca datos de la capa sigue en camelCase.
 *
 * `usar_respaldo` es la senal que la iteracion 22 va a usar para cargar la
 * instantanea versionada y avisarle al estudiante (ADR-008). Vale true cuando el
 * servicio fallo, y false cuando el servicio contesto bien: una lista vacia llega
 * como ok = true con vacio = true, y eso NO es motivo para cambiar al respaldo.
 */

/** Corta la espera para que una funcion colgada no deje la pagina esperando. */
const ESPERA_MAXIMA_MS = 8000;

/** Error que no viene del servicio sino de no haber podido llegar hasta el. */
const SIN_RESPUESTA = {
  codigo: 'SIN_RESPUESTA',
  mensaje: 'No se pudo contactar la capa de datos.',
  usar_respaldo: true,
};

/**
 * Consulta un extremo de la capa de datos.
 * @param {string} ruta Por ejemplo '/api/estado'.
 */
export async function consultar(ruta) {
  let respuesta;

  try {
    respuesta = await fetch(ruta, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    });
  } catch {
    // Sin red, servidor caido o espera agotada. Nunca llegamos al servicio.
    return { ok: false, ...SIN_RESPUESTA };
  }

  // Si lo que contesto no es JSON, lo que hay al otro lado no es la capa de datos:
  // pasa al servir el sitio con un servidor de archivos estaticos, que responde el
  // 404 en HTML. Intentar interpretarlo como JSON solo agregaria un error de
  // consola encima del problema real.
  const tipo = respuesta.headers.get('content-type') ?? '';
  if (!tipo.includes('application/json')) {
    return { ok: false, ...SIN_RESPUESTA };
  }

  let cuerpo;
  try {
    cuerpo = await respuesta.json();
  } catch {
    return { ok: false, ...SIN_RESPUESTA };
  }

  if (cuerpo?.ok) {
    return {
      ok: true,
      datos: cuerpo.datos,
      meta: cuerpo.meta ?? {},
      vacio: Boolean(cuerpo.meta?.vacio),
    };
  }

  // Que sea JSON no significa que sea NUESTRO JSON.
  //
  // Encontrado provocando la caida con `npm run serve:dist` el 2026-09-05: ese
  // servidor mira la cabecera `accept` y responde su 404 en JSON,
  // `{"error":{"code":"not_found"}}`. Eso pasa el filtro de content-type de mas
  // arriba, y la version anterior de esta funcion leia `usar_respaldo` de un sobre
  // ajeno que no lo trae: salia `false`, el sitio no cambiaba a la instantanea, y
  // el estudiante se quedaba con la pagina vacia justo el dia que el respaldo
  // existia para salvarlo. Ver H-018.
  //
  // La regla: si el sobre no es el de functions/api/_comun.js, no llegamos a la
  // capa de datos. Da igual quien haya contestado —un servidor estatico, un
  // proxy, la pagina de error de la plataforma—: de ahi no se puede deducir nada
  // sobre el servicio, y la respuesta segura es la del respaldo.
  const nuestroSobre =
    cuerpo?.ok === false &&
    typeof cuerpo?.error?.codigo === 'string' &&
    typeof cuerpo?.error?.usar_respaldo === 'boolean';

  if (!nuestroSobre) return { ok: false, ...SIN_RESPUESTA };

  return {
    ok: false,
    codigo: cuerpo.error.codigo,
    mensaje: cuerpo.error.mensaje ?? SIN_RESPUESTA.mensaje,
    usar_respaldo: cuerpo.error.usar_respaldo,
  };
}

/** Comprobacion de estado. */
export const consultarEstado = () => consultar('/api/estado');

/**
 * Lectura del banco de preguntas.
 *
 * Sin argumento trae el banco completo; con un numero de modulo trae solo ese.
 * Las preguntas llegan con sus alternativas dentro y con los nombres de columna
 * sin traducir (ADR-011).
 *
 * Sustituye a leerPrueba(), que consultaba la tabla de juguete prueba_tuberia y
 * se retiro junto con ella en la iteracion 22.
 */
export async function leerPreguntas(modulo) {
  const ruta = modulo == null ? '/api/preguntas' : `/api/preguntas?modulo=${modulo}`;
  const respuesta = await consultar(ruta);

  // Solo el fallo del SERVICIO cambia a la instantanea. Un banco vacio llega con
  // ok = true y no la toca; una peticion invalida llega con usar_respaldo = false
  // y tampoco, porque esconder un error del sitio detras del respaldo es
  // exactamente lo que advierte la cabecera de functions/api/_comun.js.
  if (respuesta.ok || !respuesta.usar_respaldo) return respuesta;

  return (await leerDesdeInstantanea(modulo)) ?? respuesta;
}

/**
 * Carga la instantanea versionada del banco (ADR-008).
 *
 * Se importa a proposito de forma dinamica: el archivo trae el banco entero y no
 * tiene por que viajar en la carga normal de la pagina, que es la que ocurre
 * siempre. Aca se descarga solo el dia que hace falta.
 *
 * Devuelve la misma forma que `consultar()` para que ningun componente tenga que
 * saber de donde salieron las preguntas, con una diferencia declarada:
 * `meta.respaldo` trae el sello del archivo —contra que base se genero y cuando—,
 * y de ahi sale el aviso al estudiante. **Si esto devolviera preguntas sin decir
 * que son del respaldo, el sitio mentiria en silencio**, que es justo lo que
 * ADR-008 prohibe.
 *
 * Devuelve null si la instantanea no esta o no se puede cargar: entonces quien
 * llama se queda con el error original, que es la verdad —no hay banco— en vez de
 * una pagina vacia sin explicacion.
 */
async function leerDesdeInstantanea(modulo) {
  let instantanea;

  try {
    instantanea = await import('../data/instantanea-banco.js');
  } catch {
    return null;
  }

  const todas = instantanea?.PREGUNTAS;
  const sello = instantanea?.SELLO;

  if (!Array.isArray(todas) || !sello) return null;

  const datos = modulo == null ? todas : todas.filter((p) => p.modulo === modulo);

  return {
    ok: true,
    datos,
    meta: { origen: 'instantanea', respaldo: sello, vacio: datos.length === 0 },
    vacio: datos.length === 0,
  };
}
