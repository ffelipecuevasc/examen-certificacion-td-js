/**
 * GET /api/preguntas          — el banco completo
 * GET /api/preguntas?modulo=N — solo un modulo
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
  const modulo = leerModulo(new URL(request.url));

  if (modulo === false) {
    return respuestaError(
      'PETICION_INVALIDA',
      `El modulo debe ser un entero entre ${MODULO_MINIMO} y ${MODULO_MAXIMO}.`
    );
  }

  const filtrandoPorModulo = modulo !== null;

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
