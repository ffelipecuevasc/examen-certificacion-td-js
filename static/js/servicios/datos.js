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

  return {
    ok: false,
    codigo: cuerpo?.error?.codigo ?? SIN_RESPUESTA.codigo,
    mensaje: cuerpo?.error?.mensaje ?? SIN_RESPUESTA.mensaje,
    usar_respaldo: Boolean(cuerpo?.error?.usar_respaldo),
  };
}

/** Comprobacion de estado. */
export const consultarEstado = () => consultar('/api/estado');

/** Lectura de la tabla de juguete. Desaparece con la epica 20. */
export const leerPrueba = () => consultar('/api/prueba');
