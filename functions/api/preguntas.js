/**
 * GET /api/preguntas           — el banco completo
 * GET /api/preguntas?modulo=N  — solo un modulo
 * GET /api/preguntas?resumen=1 — cuantas preguntas tiene cada modulo, sin traerlas
 *
 * Es el extremo que sustituye a static/js/data/cuestionario.js como fuente del
 * cuestionario. De aca en adelante el contenido viene de fuera del repositorio,
 * que es el cambio de naturaleza que anuncia la iteracion 22.
 *
 * LEE DE LA VISTA, NUNCA DE LAS TABLAS
 *
 * `pregunta_activa` ya trae el filtro por estado y el cruce con el modulo. Si
 * este archivo consultara `pregunta` directamente tendria que acordarse de
 * escribir `WHERE estado = 'activa'` en cada consulta, y el dia que a alguien se
 * le olvide el sitio publicaria borradores y preguntas retiradas. El filtro vive
 * en la vista justamente para que ninguna consulta pueda olvidarlo (ADR-020).
 *
 * Las alternativas no estan en la vista y se piden aparte, unidas por
 * `pregunta_id`. No hace falta filtrarlas por estado: solo se piden las de las
 * preguntas que la vista ya dejo pasar.
 *
 * POR QUE VIAJA `es_correcta`
 *
 * Porque ADR-022 lo decidio, y conviene que quede dicho aca para que nadie lo
 * tome por un descuido: la respuesta correcta viaja al navegador. Sin ella la
 * instantanea de respaldo no podria corregir, y un modo degradado que no corrige
 * no sirve de nada. La consecuencia asumida —que el simulacro no puede garantizar
 * que nadie las vea antes de responder— esta escrita en esa ADR.
 *
 * EL RESUMEN, Y POR QUE VIVE AQUI Y NO EN UN EXTREMO PROPIO (ADR-033)
 *
 * `?resumen=1` devuelve una fila por modulo con cuantas preguntas activas tiene
 * y **con los ids de esas preguntas**, pero ninguna pregunta. Existe porque el
 * indice de los siete modulos las muestra a la vez y necesita las siete cifras:
 * pedirlas trayendo el banco cuesta 371,8 KB y asi cuesta unos 2,4 KB. Los dos
 * numeros estan medidos contra el servidor local.
 *
 * LOS IDS, Y PARA QUE SIRVEN (iteracion 33, enmienda de ADR-033)
 *
 * Desde la iteracion 33 el navegador guarda el avance del estudiante por modulo,
 * anotando el id de cada pregunta respondida. Para decir cuanto lleva en los siete
 * modulos sin abrir ninguno hace falta saber **que ids siguen activos**: sin eso,
 * una pregunta retirada seguiria contando como avance y el indice mostraria una
 * cifra que el banco ya no sostiene.
 *
 * Los ids se traen en la MISMA consulta, con `group_concat`, y no en una segunda:
 * las filas que hay que leer son exactamente las mismas que ya se leen para
 * contarlas, asi que el conteo de filas leidas no sube. Una consulta aparte las
 * leeria dos veces para responder lo mismo.
 *
 * Vive en ESTE archivo, y no en un `/api/modulos`, porque lo que se pide es un
 * dato sobre las preguntas —cuantas hay por modulo— y no un catalogo de modulos.
 * Un extremo aparte tendria que contar lo mismo sobre la misma vista, y el dia
 * que las dos consultas divergieran el indice diria una cosa y el cuestionario
 * dibujaria otra sin que nada lo anunciara. Es el mismo motivo por el que
 * `scripts/generar-instantanea.mjs` importa las consultas de aqui en vez de tener
 * copia propia.
 *
 * LO QUE EL RESUMEN NO HACE, Y HAY QUE TENER PRESENTE
 *
 * Cuenta filas de la vista. NO pasa por `validarPreguntas()`, que es por fila y
 * puede descartar alguna. Si alguna vez descartara una, el resumen diria 61 y la
 * pagina dibujaria 60. Hoy el informe de validacion dice `descartadas: 0`, asi que
 * no ocurre, y ADR-033 dejo escrito como se cubre: **lo dibujado manda**, y
 * `scripts/probar-filtrado.mjs` compara las dos cuentas y da rojo si difieren.
 * Validar aqui las 368 para devolver siete numeros costaria exactamente lo que
 * este parametro existe para no gastar.
 *
 * NOMBRES
 *
 * Los campos conservan el nombre de su columna, en snake_case, de extremo a
 * extremo (ADR-011). No se traducen al entrar al navegador.
 */
import { respuestaError, respuestaOk, soloLectura } from './_comun.js';
// El rango de modulos se importa, no se redefine: durante la iteracion 23 estuvo
// escrito en dos archivos, y dos definiciones del mismo rango no fallan al
// divergir, se quedan calladas.
import { MODULO_MAXIMO, MODULO_MINIMO, validarPreguntas } from './_validacion.js';

/**
 * Las dos consultas del banco, exportadas a proposito.
 *
 * Las importa scripts/generar-instantanea.mjs para producir la instantanea de
 * respaldo (ADR-008). Si el generador tuviera copia propia de estas consultas,
 * el dia que una cambie el respaldo empezaria a traer otra cosa que el extremo,
 * y la diferencia solo se veria el dia de la caida, que es el dia en que no se
 * puede arreglar. Pages ignora todo lo que no sea `onRequest*`, asi que
 * exportarlas no crea ninguna ruta nueva.
 */
export const SQL_PREGUNTAS = `
  SELECT id, modulo, modulo_titulo, modulo_icono,
         enunciado, justificacion, dificultad, orden_fijo
  FROM pregunta_activa
`;

/**
 * Cuantas preguntas activas tiene cada modulo, y cuales.
 *
 * Se agrupa por las tres columnas del modulo y no solo por el numero para que el
 * titulo y el icono viajen con la cuenta: quien dibuja el indice los necesita, y
 * pedirlos aparte seria una segunda consulta para el mismo renglon.
 *
 * `group_concat(id)` es la unica forma que tiene SQLite de sacar los ids de un
 * grupo sin repetir el recorrido. Va en la misma consulta a proposito: son las
 * mismas filas que ya se estaban leyendo para contarlas.
 *
 * Exportada como las otras dos, y por el mismo motivo: para que nadie tenga que
 * escribir una segunda version de esta cuenta en otro archivo.
 */
export const sqlResumen = (filtrandoPorModulo) => `
    SELECT modulo, modulo_titulo, modulo_icono,
           COUNT(*) AS preguntas,
           group_concat(id) AS preguntas_ids
    FROM pregunta_activa
    ${filtrandoPorModulo ? 'WHERE modulo = ?1' : ''}
    GROUP BY modulo, modulo_titulo, modulo_icono
    ORDER BY modulo
  `;

/**
 * Los ids de un grupo, ya en numeros y ordenados.
 *
 * `group_concat` devuelve una cadena separada por comas. Se parte aqui y no en el
 * navegador porque quien pide un resumen quiere ids, no una cadena que haya que
 * aprender a leer en dos archivos distintos. El nombre del campo no se traduce
 * (ADR-011): sale con el alias de su columna.
 *
 * El orden lo pone este lado. `group_concat` no promete ninguno, y dos peticiones
 * identicas que devuelvan la misma lista en distinto orden son ruido puro para
 * quien las compare, empezando por scripts/probar-filtrado.mjs.
 */
function idsDelGrupo(crudo) {
  if (typeof crudo !== 'string' || crudo === '') return [];

  return crudo
    .split(',')
    .map(Number)
    .filter(Number.isInteger)
    .sort((a, b) => a - b);
}

/** Alternativas de las preguntas que la vista dejo pasar. */
export const sqlAlternativas = (filtrandoPorModulo) => `
    SELECT a.pregunta_id, a.id, a.letra, a.orden, a.texto, a.es_correcta
    FROM alternativa a
    JOIN pregunta_activa v ON v.id = a.pregunta_id
    ${filtrandoPorModulo ? 'WHERE v.modulo = ?1' : ''}
    ORDER BY a.pregunta_id, a.orden
  `;

/**
 * Interpreta el parametro `modulo`.
 *
 * Devuelve el numero, `null` si no vino, o `false` si vino y no sirve. Los tres
 * casos son distintos: no pedir modulo es pedir el banco completo, y pedir uno
 * imposible es un error de la peticion, no de la base — por eso no activa el
 * respaldo.
 */
function leerModulo(url) {
  const crudo = url.searchParams.get('modulo');
  if (crudo === null) return null;

  // Number() en vez de parseInt() a proposito: parseInt('2abc') devuelve 2 y
  // dejaria pasar basura como si fuera una peticion valida.
  const numero = Number(crudo);

  const valido =
    Number.isInteger(numero) && numero >= MODULO_MINIMO && numero <= MODULO_MAXIMO;

  return valido ? numero : false;
}

/**
 * Interpreta el parametro `resumen`.
 *
 * Devuelve true si vino y sirve, false si no vino, y `null` si vino y no sirve.
 *
 * SOLO VALE EL VALOR `1`, y eso es a proposito (ADR-033). Un `resumen=true` o un
 * `resumen=si` no se tratan como «no»: se rechazan. Tratarlos en silencio como
 * apagado le devolveria el banco entero —371,8 KB— a quien pidio 0,9 KB, que es
 * exactamente el gasto que este parametro existe para evitar. Un parametro mal
 * escrito tiene que doler enseguida y no en la factura de datos del estudiante.
 */
function leerResumen(url) {
  const crudo = url.searchParams.get('resumen');
  if (crudo === null) return false;
  if (crudo === '1') return true;
  return null;
}

/** Agrupa las alternativas por pregunta, en un solo recorrido. */
function agruparAlternativas(filas) {
  const porPregunta = new Map();

  for (const fila of filas) {
    const lista = porPregunta.get(fila.pregunta_id);
    const alternativa = {
      id: fila.id,
      letra: fila.letra,
      orden: fila.orden,
      texto: fila.texto,
      es_correcta: fila.es_correcta,
    };

    if (lista) lista.push(alternativa);
    else porPregunta.set(fila.pregunta_id, [alternativa]);
  }

  return porPregunta;
}

export const onRequest = soloLectura(async ({ base, request }) => {
  const url = new URL(request.url);
  const modulo = leerModulo(url);
  const resumen = leerResumen(url);

  if (modulo === false) {
    return respuestaError(
      'PETICION_INVALIDA',
      `El modulo debe ser un entero entre ${MODULO_MINIMO} y ${MODULO_MAXIMO}.`
    );
  }

  if (resumen === null) {
    return respuestaError(
      'PETICION_INVALIDA',
      'El parametro resumen solo acepta el valor 1. Omitelo para pedir las preguntas.'
    );
  }

  const filtrandoPorModulo = modulo !== null;

  // El resumen se compone con el filtro: `?modulo=3&resumen=1` es la cuenta del
  // modulo 3, que es una pregunta coherente y negarse a contestarla costaria mas
  // codigo que contestarla (ADR-033).
  if (resumen) {
    const consulta = filtrandoPorModulo
      ? base.prepare(sqlResumen(true)).bind(modulo)
      : base.prepare(sqlResumen(false));

    const filas = await consulta.all();

    // Los ids salen de la cadena de `group_concat` y entran como lista. El resto
    // de la fila viaja tal cual, con el nombre de su columna.
    const datos = (filas.results ?? []).map(({ preguntas_ids, ...fila }) => ({
      ...fila,
      preguntas_ids: idsDelGrupo(preguntas_ids),
    }));

    return respuestaOk(datos, {
      modulo: filtrandoPorModulo ? modulo : 'todos',
      resumen: true,
      filas_leidas: filas.meta?.rows_read ?? 0,
    });
  }

  const consultaPreguntas = filtrandoPorModulo
    ? base.prepare(`${SQL_PREGUNTAS} WHERE modulo = ?1 ORDER BY id`).bind(modulo)
    : base.prepare(`${SQL_PREGUNTAS} ORDER BY modulo, id`);

  // Las alternativas se piden con el mismo filtro, por la vista, para no traerse
  // el banco entero cuando se pidio un solo modulo.
  const consultaAlternativas = filtrandoPorModulo
    ? base.prepare(sqlAlternativas(true)).bind(modulo)
    : base.prepare(sqlAlternativas(false));

  const [preguntasCrudas, alternativasCrudas] = await base.batch([
    consultaPreguntas,
    consultaAlternativas,
  ]);

  const porPregunta = agruparAlternativas(alternativasCrudas.results ?? []);

  const armadas = (preguntasCrudas.results ?? []).map((fila) => ({
    ...fila,
    alternativas: porPregunta.get(fila.id) ?? [],
  }));

  const { validas, informe } = validarPreguntas(armadas);

  return respuestaOk(validas, {
    modulo: filtrandoPorModulo ? modulo : 'todos',
    validacion: informe,
    filas_leidas:
      (preguntasCrudas.meta?.rows_read ?? 0) + (alternativasCrudas.meta?.rows_read ?? 0),
  });
});
