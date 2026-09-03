/**
 * Piezas compartidas por los extremos de la capa de datos.
 *
 * Este archivo no exporta ningun manejador de peticiones, asi que Pages no lo
 * publica como ruta: es solo un modulo del que tiran los demas.
 *
 * Aca vive el contrato de respuesta, que es la pieza que hace posible el respaldo
 * de ADR-008. La regla es una sola y conviene tenerla presente antes de agregar
 * cualquier extremo nuevo:
 *
 *   «no hay datos» NO es un error.
 *
 * Una consulta que devuelve cero filas es una respuesta correcta: ok = true, la
 * lista vacia y meta.vacio = true. El sitio muestra «no hay preguntas» y no toca
 * la instantanea de respaldo, porque el servicio contesto bien y lo que dijo es
 * que no hay nada. Solo cuando ok = false y el error trae usar_respaldo = true el
 * sitio debe cambiar a la instantanea y avisarle al estudiante.
 *
 * Confundir las dos cosas tiene una consecuencia concreta: el dia que el banco se
 * vacie por accidente, el sitio serviria la instantanea sin decir nada y el error
 * quedaria escondido detras del respaldo.
 */

/** Nombre del enlace a D1. Tiene que calzar con el de wrangler.toml. */
const ENLACE_D1 = 'BANCO';

/**
 * Codigos de error de la capa de datos.
 *
 * `usar_respaldo` es lo que el sitio consulta para decidir si carga la
 * instantanea versionada (ADR-008). Vale true solo cuando el fallo es del
 * servicio, nunca cuando el problema es la peticion.
 */
export const ERRORES = {
  SIN_ENLACE: {
    estado: 503,
    usar_respaldo: true,
    mensaje: 'La base de datos no está conectada al sitio.',
  },
  FALLO_CONSULTA: {
    estado: 503,
    usar_respaldo: true,
    mensaje: 'La base de datos no respondió a la consulta.',
  },
  NO_ENCONTRADO: {
    estado: 404,
    usar_respaldo: false,
    mensaje: 'El recurso solicitado no existe.',
  },
  METODO_NO_PERMITIDO: {
    estado: 405,
    usar_respaldo: false,
    mensaje: 'La capa de datos es de solo lectura.',
  },
};

/** Cabeceras comunes a toda respuesta. */
function cabeceras() {
  return {
    'content-type': 'application/json; charset=utf-8',
    // Sin cache mientras se monta la tuberia: si una respuesta quedara guardada,
    // la comprobacion de que el dato viene de verdad de D1 dejaria de probar nada.
    // La politica de cache definitiva es la iteracion 53.
    'cache-control': 'no-store',
  };
}

/** Respuesta correcta. `datos` puede venir vacio, y eso tambien es correcto. */
export function respuestaOk(datos, meta = {}) {
  const vacio = Array.isArray(datos) ? datos.length === 0 : datos == null;

  return new Response(
    JSON.stringify({
      ok: true,
      datos,
      meta: { origen: 'd1', vacio, generado_en: new Date().toISOString(), ...meta },
    }),
    { status: 200, headers: cabeceras() }
  );
}

/**
 * Respuesta de error.
 * @param {keyof ERRORES} codigo
 * @param {string} [detalle] Texto tecnico para el registro. Nunca contiene datos
 *                           de la consulta ni nada de la configuracion.
 */
export function respuestaError(codigo, detalle) {
  const definicion = ERRORES[codigo] ?? ERRORES.FALLO_CONSULTA;

  return new Response(
    JSON.stringify({
      ok: false,
      error: {
        codigo,
        mensaje: definicion.mensaje,
        usar_respaldo: definicion.usar_respaldo,
        ...(detalle ? { detalle } : {}),
      },
      meta: { generado_en: new Date().toISOString() },
    }),
    { status: definicion.estado, headers: cabeceras() }
  );
}

/**
 * Devuelve la base enlazada, o null si el enlace no existe.
 *
 * El enlace falta cuando wrangler.toml no se aplico, cuando el identificador
 * apunta a una base borrada o cuando se esta sirviendo el sitio con un servidor
 * estatico cualquiera. Distinguirlo de un fallo de consulta importa: el primero
 * es un error de configuracion y el segundo es la base caida.
 */
export function obtenerBase(env) {
  return env?.[ENLACE_D1] ?? null;
}

/**
 * Envuelve un manejador de lectura.
 *
 * Se encarga de tres cosas que se repetirian en cada extremo: rechazar todo lo
 * que no sea lectura (ADR-009), comprobar el enlace antes de consultar, y
 * convertir cualquier excepcion de D1 en el formato de error en vez de dejar
 * escapar la pagina de error de la plataforma, que no seria JSON y romperia al
 * sitio justo cuando mas falta le hace entender que fallo.
 */
export function soloLectura(manejador) {
  return async (contexto) => {
    const { request, env } = contexto;

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return respuestaError('METODO_NO_PERMITIDO');
    }

    const base = obtenerBase(env);
    if (!base) return respuestaError('SIN_ENLACE');

    try {
      return await manejador({ ...contexto, base });
    } catch (error) {
      // El mensaje de D1 se registra, pero no se le entrega al navegador tal cual:
      // suele traer el SQL completo.
      console.error('Fallo de consulta en D1:', error);
      return respuestaError('FALLO_CONSULTA', 'Revisa el registro del despliegue.');
    }
  };
}
