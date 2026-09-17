/**
 * GET /api/preguntas             — el banco completo
 * GET /api/preguntas?modulo=N    — solo un modulo
 * GET /api/preguntas?resumen=1   — cuantas preguntas tiene cada modulo, sin traerlas
 * GET /api/preguntas?ids=1,2,3   — exactamente esas, sin justificaciones
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
 * LA LISTA POR IDS, Y POR QUE TAMPOCO ES UN EXTREMO APARTE (iteracion 41)
 *
 * `?ids=…` devuelve exactamente las preguntas de esa lista. Lo pide el simulacro,
 * que elige sus 120 en el navegador —a partir de los ids de `?resumen=1`— y despues
 * las viene a buscar. Vive aqui por el mismo motivo que el resumen: es una pregunta
 * sobre las preguntas, y un extremo aparte tendria que repetir `SQL_PREGUNTAS`,
 * `sqlAlternativas()` y `validarPreguntas()`, que es exactamente lo que
 * `generar-instantanea.mjs` no hace desde la iteracion 22.
 *
 * Lo que se le pide a este parametro esta en `responderPorIds()` y en `leerIds()`,
 * cada cosa al lado de su motivo.
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

/**
 * Cuantos parametros ligados acepta D1 en una consulta. MEDIDO, no leido.
 *
 * Provocado el 2026-09-16 contra la base local, con una consulta de solo lectura
 * sobre `pregunta_activa`: con 100 responde; con 101 se cae, y lo dice asi:
 *
 *   D1_ERROR: variable number must be between ?1 and ?100 at offset 444: SQLITE_ERROR
 *
 * Por eso existe el troceo de `?ids`: un intento son 120 preguntas y 120 no cabe.
 * El numero esta escrito aqui una sola vez, con su mensaje al lado, para que quien
 * lo cambie tenga delante lo que pasa si se pasa.
 *
 * **Cambiar este numero no puede cambiar lo que el extremo devuelve.** Por eso las
 * preguntas se ordenan por id al final y no por trozo: el troceo es un detalle de
 * como se consulta, y no tiene por que asomar en la respuesta.
 */
export const MAXIMO_DE_PARAMETROS_D1 = 100;

/** Los `?1, ?2, …` de una lista ligada de `n` valores. */
const huecos = (n) => Array.from({ length: n }, (_, i) => `?${i + 1}`).join(',');

/**
 * El `WHERE` de las dos consultas del banco, segun con que se este filtrando.
 *
 * TRES FORMAS Y UN SOLO PARAMETRO, y el motivo de que sea uno solo es
 * `scripts/generar-instantanea.mjs`: llama `sqlAlternativas(false)` desde la
 * iteracion 22 y es el unico importador externo de estas consultas. Un segundo
 * parametro lo habria dejado funcionando igual hoy y habria puesto dos banderas
 * que se pueden contradecir —modulo y ids a la vez— esperando a que alguien las
 * pase juntas.
 *
 *   false / undefined  el banco entero          (lo que pide el generador)
 *   true               un modulo                `?modulo=N`
 *   un numero n        n ids ligados            `?ids=…`
 *
 * Un numero no se confunde con un booleano, asi que las llamadas de hoy siguen
 * diciendo exactamente lo que decian.
 *
 * @param {boolean|number} filtro
 * @param {string} [alias] Prefijo de la columna, para cuando la vista va unida.
 */
function donde(filtro, alias = '') {
  const columna = (nombre) => `${alias ? `${alias}.` : ''}${nombre}`;

  if (typeof filtro === 'number') return `WHERE ${columna('id')} IN (${huecos(filtro)})`;
  if (filtro) return `WHERE ${columna('modulo')} = ?1`;

  return '';
}

/** Alternativas de las preguntas que la vista dejo pasar. */
export const sqlAlternativas = (filtro) => `
    SELECT a.pregunta_id, a.id, a.letra, a.orden, a.texto, a.es_correcta
    FROM alternativa a
    JOIN pregunta_activa v ON v.id = a.pregunta_id
    ${donde(filtro, 'v')}
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

/**
 * Cuantos ids como mucho acepta `?ids`.
 *
 * Es el tamano de un intento del simulacro, que es lo unico que pide por aqui. NO
 * es el limite de D1 —ese es `MAXIMO_DE_PARAMETROS_D1` y lo resuelve el troceo—:
 * es un tope de producto. Sin el, `?ids` seria una forma comoda de bajarse el
 * banco entero pidiendo los 368 ids de una, que es justo lo que `?resumen=1`
 * existe para no tener que hacer.
 */
const MAXIMO_DE_IDS = 120;

/**
 * Interpreta el parametro `ids`.
 *
 * Devuelve `null` si no vino, `{ error }` si vino y no sirve, o `{ ids }`.
 *
 * QUE SE RECHAZA, Y POR QUE TODO ESTO SE RECHAZA EN VEZ DE ARREGLARSE
 *
 * Vacio, no numerico, cero, negativo, con decimales, con una coma de mas, mas de
 * `MAXIMO_DE_IDS`, o **con ids repetidos**. Los seis son `PETICION_INVALIDA`.
 *
 * Los repetidos son el unico que da que pensar, asi que se dice: el contrato de
 * este extremo es «devuelvo exactamente las que me pediste», y un id repetido
 * vuelve ambiguo ese «exactamente» —¿viene dos veces?, ¿una?—. Ademas, quien pide
 * por aqui es el algoritmo de seleccion, y ese no puede pedir dos veces la misma
 * pregunta sin estar roto: tragarselo en silencio dejaria un intento de 119
 * preguntas distintas con toda la pinta de tener 120. Es la misma logica del
 * `resumen=si` de mas arriba: un parametro mal armado tiene que doler enseguida.
 *
 * Los ids que NO existen o estan retirados son otra cosa y no se rechazan: pedir
 * una pregunta que acaba de retirarse es normal —la lista de ids se pidio unos
 * segundos antes— y el `IN` sobre la vista las deja fuera sola. Quien pidio repone.
 *
 * `Number()` y no `parseInt()`, por lo mismo que `leerModulo()`: `parseInt('2abc')`
 * devuelve 2 y dejaria pasar basura como si fuera una peticion valida.
 */
function leerIds(url) {
  const crudo = url.searchParams.get('ids');
  if (crudo === null) return null;

  if (crudo === '') {
    return { error: 'El parametro ids no puede venir vacio.' };
  }

  const partes = crudo.split(',');

  if (partes.length > MAXIMO_DE_IDS) {
    return {
      error: `Se pidieron ${partes.length} ids y el maximo es ${MAXIMO_DE_IDS}.`,
    };
  }

  const ids = [];
  const vistos = new Set();

  for (const parte of partes) {
    const numero = Number(parte);

    if (!Number.isInteger(numero) || numero <= 0 || parte.trim() === '') {
      return {
        error: 'El parametro ids acepta enteros positivos separados por comas.',
      };
    }

    if (vistos.has(numero)) {
      return { error: `El id ${numero} viene repetido, y cada id se pide una vez.` };
    }

    vistos.add(numero);
    ids.push(numero);
  }

  return { ids };
}

/** Parte una lista en trozos de `tamano` como mucho. */
function trocear(lista, tamano) {
  const trozos = [];
  for (let i = 0; i < lista.length; i += tamano) trozos.push(lista.slice(i, i + tamano));
  return trozos;
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

/**
 * Las preguntas de una lista de ids (iteracion 41, decision 1).
 *
 * ESTE EXTREMO NO ELIGE NADA. No reparte por modulo, no excluye hermanas y no
 * repone lo que falta: eso lo hace el navegador, en
 * `static/js/servicios/eleccion-del-intento.js`. Aqui solo se sirve lo que se
 * pidio. La decision de que el navegador elija esta en la iteracion 41 y el motivo
 * corto es que el modo degradado tiene que elegir igual sin servidor: con la
 * eleccion aqui dentro, el dia de la caida no habria simulacro.
 *
 * NO SE PUEDE CACHEAR, NUNCA. Dos intentos piden listas distintas, asi que la URL
 * cambia en cada peticion y una cache solo acumularia respuestas de un solo uso.
 * Las cabeceras las pone `_comun.js`.
 *
 * SIN JUSTIFICACIONES. Un intento no las necesita —durante el simulacro no se
 * corrige— y son el campo mas pesado del banco. Se piden en la iteracion 44, al
 * revisar el resultado. Se quitan DESPUES de validar, no antes: `validarPreguntas()`
 * mira el enunciado, las alternativas y el titulo del modulo, y recortar el campo
 * antes la dejaria validando algo distinto de lo que hay en la base.
 *
 * EL TROCEO, Y POR QUE NO SE NOTA DESDE FUERA
 *
 * 120 ids no caben en una consulta: D1 admite 100 parametros ligados
 * (`MAXIMO_DE_PARAMETROS_D1`, medido). Se parte en trozos y las cuatro consultas
 * —dos de preguntas y dos de alternativas— viajan en un solo `batch`, o sea un
 * viaje. Medido el 2026-09-16 contra la base local con el banco real: 2912 filas
 * leidas para 120 ids, y las mismas 2912 con trozos de 60 o de 100, porque lo que
 * cuesta es la cantidad de trozos y no su tamano.
 */
async function responderPorIds(base, ids) {
  const trozos = trocear(ids, MAXIMO_DE_PARAMETROS_D1);

  const consultas = [
    ...trozos.map((trozo) =>
      base.prepare(`${SQL_PREGUNTAS} ${donde(trozo.length)}`).bind(...trozo)
    ),
    ...trozos.map((trozo) => base.prepare(sqlAlternativas(trozo.length)).bind(...trozo)),
  ];

  const respuestas = await base.batch(consultas);

  const crudasDePreguntas = respuestas.slice(0, trozos.length);
  const crudasDeAlternativas = respuestas.slice(trozos.length);

  const porPregunta = agruparAlternativas(
    crudasDeAlternativas.flatMap((r) => r.results ?? [])
  );

  // Se ordenan por id sobre el total y no trozo a trozo. Asi la respuesta no
  // depende del tamano del trozo: cambiar `MAXIMO_DE_PARAMETROS_D1` cambia cuantas
  // consultas salen y nada mas. En que orden se le presentan al estudiante lo
  // decide quien las dibuja, no este extremo.
  const armadas = crudasDePreguntas
    .flatMap((r) => r.results ?? [])
    .sort((a, b) => a.id - b.id)
    .map((fila) => ({ ...fila, alternativas: porPregunta.get(fila.id) ?? [] }));

  const { validas, informe } = validarPreguntas(armadas);

  const sinJustificacion = validas.map(({ justificacion, ...resto }) => resto);

  return respuestaOk(sinJustificacion, {
    ids_pedidos: ids.length,
    consultas: consultas.length,
    validacion: informe,
    filas_leidas: respuestas.reduce((suma, r) => suma + (r.meta?.rows_read ?? 0), 0),
  });
}

export const onRequest = soloLectura(async ({ base, request }) => {
  const url = new URL(request.url);
  const modulo = leerModulo(url);
  const resumen = leerResumen(url);
  const pedido = leerIds(url);

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

  if (pedido?.error) {
    return respuestaError('PETICION_INVALIDA', pedido.error);
  }

  const filtrandoPorModulo = modulo !== null;

  // `?ids` no se combina con nada, y eso NO es lo mismo que `?modulo=3&resumen=1`.
  //
  // Esa pareja es una pregunta coherente —cuantas tiene el modulo 3— y por eso se
  // contesta. `?ids=…&modulo=3` no lo es: la lista ya dice exactamente que se
  // quiere, y cruzarla con un filtro devolveria en silencio menos preguntas de las
  // pedidas. Quien la recibiera veria una lista corta sin saber si le faltan
  // porque se retiraron o porque el filtro se las comio, que son dos problemas muy
  // distintos y uno de los dos hay que reponerlo. `?ids=…&resumen=1` es contar una
  // lista que quien pregunta acaba de escribir.
  if (pedido && (filtrandoPorModulo || resumen)) {
    return respuestaError(
      'PETICION_INVALIDA',
      'El parametro ids no se combina con modulo ni con resumen.'
    );
  }

  if (pedido) return await responderPorIds(base, pedido.ids);

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
