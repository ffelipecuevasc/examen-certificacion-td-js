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
 *
 * Para saber CUANTAS hay sin traerlas, esta `leerResumen()` mas abajo.
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
 * Las preguntas de una lista de ids (iteracion 41, decision 1).
 *
 * Es `/api/preguntas?ids=…`. Lo usa el simulacro despues de elegir en el navegador:
 * la eleccion sale de `servicios/eleccion-del-intento.js` y aqui solo se viene a
 * buscar lo elegido. **No vuelven las justificaciones**: durante un intento no se
 * corrige, y son el campo mas pesado del banco. Se piden en la iteracion 44.
 *
 * NO SE PIDE SI LA LISTA VIENE VACIA, y eso no es una optimizacion: el extremo
 * rechaza `?ids=` vacio con `PETICION_INVALIDA`, y salir a buscar un error conocido
 * gasta un viaje para volver con la respuesta que ya se sabia. Se devuelve la forma
 * de siempre, con `usar_respaldo` en false, porque esto es un error del sitio y no
 * de la capa: taparlo con el respaldo es exactamente lo que advierte la cabecera de
 * `functions/api/_comun.js`.
 *
 * Cae a la instantanea con las mismas reglas que las otras dos lecturas: solo el
 * fallo del SERVICIO cambia al respaldo, y cuando lo hace se dice.
 */
export async function leerPreguntasPorIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return {
      ok: false,
      codigo: 'PETICION_INVALIDA',
      mensaje: 'No se pidio ninguna pregunta.',
      usar_respaldo: false,
    };
  }

  const respuesta = await consultar(`/api/preguntas?ids=${ids.join(',')}`);

  if (respuesta.ok || !respuesta.usar_respaldo) return respuesta;

  return (await leerIdsDeLaInstantanea(ids)) ?? respuesta;
}

/**
 * Cuantas preguntas tiene cada modulo, sin traerse ninguna.
 *
 * Es `/api/preguntas?resumen=1`, autorizado por ADR-033 y enmendado por la
 * iteracion 33. Devuelve una fila por modulo con `modulo`, `modulo_titulo`,
 * `modulo_icono`, `preguntas` y `preguntas_ids` —los ids de las preguntas activas
 * de ese modulo, que es contra lo que el indice filtra el avance guardado—.
 *
 * Existe porque el indice del panel muestra los siete modulos a la vez y necesita
 * las siete cifras. La regla que trajo la iteracion 31 —«sin numero hasta que sea
 * cierto»— no se afloja: las cifras siguen saliendo de un dato y no del codigo, y
 * lo unico que cambia es que el dato llega antes. Escribir los siete numeros a
 * mano seria el «105 preguntas» que ya mintio el 2026-09-08.
 *
 * Cae a la instantanea con las mismas reglas que `leerPreguntas()`: solo el fallo
 * del SERVICIO cambia al respaldo, y cuando lo hace se dice.
 */
export async function leerResumen(modulo) {
  const ruta =
    modulo == null
      ? '/api/preguntas?resumen=1'
      : `/api/preguntas?modulo=${modulo}&resumen=1`;

  const respuesta = await consultar(ruta);

  if (respuesta.ok || !respuesta.usar_respaldo) return respuesta;

  return (await resumirLaInstantanea(modulo)) ?? respuesta;
}

/**
 * Carga la instantanea versionada del banco (ADR-008).
 *
 * Se importa a proposito de forma dinamica: el archivo trae el banco entero y no
 * tiene por que viajar en la carga normal de la pagina, que es la que ocurre
 * siempre. Aca se descarga solo el dia que hace falta.
 *
 * Devuelve null si no esta o no se puede leer, que NO es lo mismo que estar vacia:
 * quien llama tiene que poder quedarse con su error original en vez de inventar
 * una pagina vacia sin explicacion.
 */
async function cargarInstantanea() {
  let instantanea;

  try {
    instantanea = await import('../data/instantanea-banco.js');
  } catch {
    return null;
  }

  const todas = instantanea?.PREGUNTAS;
  const sello = instantanea?.SELLO;

  if (!Array.isArray(todas) || !sello) return null;

  return { todas, sello };
}

/**
 * Las preguntas, desde la instantanea.
 *
 * Devuelve la misma forma que `consultar()` para que ningun componente tenga que
 * saber de donde salieron, con una diferencia declarada: `meta.respaldo` trae el
 * sello del archivo —contra que base se genero y cuando—, y de ahi sale el aviso
 * al estudiante. **Si esto devolviera preguntas sin decir que son del respaldo, el
 * sitio mentiria en silencio**, que es justo lo que ADR-008 prohibe.
 */
async function leerDesdeInstantanea(modulo) {
  const copia = await cargarInstantanea();
  if (!copia) return null;

  const datos = modulo == null ? copia.todas : copia.todas.filter((p) => p.modulo === modulo);

  return {
    ok: true,
    datos,
    meta: { origen: 'instantanea', respaldo: copia.sello, vacio: datos.length === 0 },
    vacio: datos.length === 0,
  };
}

/**
 * Las preguntas de una lista de ids, desde la instantanea.
 *
 * SE COMPORTA COMO EL EXTREMO, y eso es lo unico que importa aqui: los ids que no
 * estan en la copia **no vuelven**, igual que los que no estan en la base. Quien
 * pidio repone con sus reservas sin tener que saber de donde salieron las que si
 * volvieron. Es lo que permite que el simulacro tenga un solo camino.
 *
 * Y se quitan las justificaciones, como las quita el extremo. La instantanea las
 * trae —ADR-008 las necesita para corregir en el cuestionario—, asi que dejarlas
 * pasar aqui haria que el intento pesara distinto segun el camino, y que la
 * iteracion 44 pudiera creer que ya las tiene cuando por el camino normal no las
 * tendria. Dos caminos que devuelven cosas distintas es justo lo que el modo
 * degradado no se puede permitir.
 *
 * El orden es por id, como el del extremo, y por el mismo motivo: que la respuesta
 * no dependa de en que orden estaba escrito el archivo.
 */
async function leerIdsDeLaInstantanea(ids) {
  const copia = await cargarInstantanea();
  if (!copia) return null;

  const pedidos = new Set(ids);

  const datos = copia.todas
    .filter((pregunta) => pedidos.has(pregunta.id))
    .sort((a, b) => a.id - b.id)
    .map(({ justificacion, ...resto }) => resto);

  return {
    ok: true,
    datos,
    meta: {
      origen: 'instantanea',
      respaldo: copia.sello,
      ids_pedidos: ids.length,
      vacio: datos.length === 0,
    },
    vacio: datos.length === 0,
  };
}

/**
 * El resumen, contado sobre la instantanea.
 *
 * Cuesta cargar el archivo entero para devolver siete numeros, y se acepta a
 * sabiendas (ADR-033): es el camino degradado, y el estudiante va a necesitar ese
 * archivo igual en cuanto elija un modulo. A cambio, el aviso de ADR-008 aparece al
 * ABRIR la pagina y no al elegir, que es antes y es mejor.
 *
 * Se cuenta recorriendo las preguntas y no se lee del sello: el sello trae el total
 * del banco, no el reparto por modulo, y deducirlo de ahi seria inventarlo.
 *
 * LOS IDS TAMBIEN EN MODO DEGRADADO (iteracion 33)
 *
 * La fila trae `preguntas_ids` igual que la del extremo, y por el mismo motivo: sin
 * ellos el indice no podria decir cuanto lleva el estudiante en los siete modulos.
 * Salen de la misma lista que ya se esta recorriendo, asi que no cuestan una
 * segunda pasada.
 *
 * Son los ids de la COPIA, que puede estar desfasada respecto de la base. Se acepta
 * a sabiendas: toda la pagina trabaja entonces sobre la instantanea —el modulo que
 * se abra saldra de ahi tambien—, asi que el indice y lo dibujado cuentan sobre lo
 * mismo y no se contradicen. El desfase ya lo declara el aviso de ADR-008.
 */
async function resumirLaInstantanea(modulo) {
  const copia = await cargarInstantanea();
  if (!copia) return null;

  const porModulo = new Map();

  for (const pregunta of copia.todas) {
    if (modulo != null && pregunta.modulo !== modulo) continue;

    const fila = porModulo.get(pregunta.modulo);

    if (fila) {
      fila.preguntas += 1;
      fila.preguntas_ids.push(pregunta.id);
    } else
      porModulo.set(pregunta.modulo, {
        modulo: pregunta.modulo,
        modulo_titulo: pregunta.modulo_titulo,
        modulo_icono: pregunta.modulo_icono,
        preguntas: 1,
        preguntas_ids: [pregunta.id],
      });
  }

  const datos = [...porModulo.values()].sort((a, b) => a.modulo - b.modulo);

  return {
    ok: true,
    datos,
    meta: { origen: 'instantanea', respaldo: copia.sello, resumen: true, vacio: datos.length === 0 },
    vacio: datos.length === 0,
  };
}
