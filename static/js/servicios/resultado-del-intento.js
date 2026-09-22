/**
 * El resultado de un intento terminado, calculado (iteracion 44, etapa B).
 *
 * CALCULO Y NADA MAS
 *
 * Sin DOM, sin red y sin almacen. Recibe el intento —la copia congelada y sus
 * respuestas— y devuelve numeros. Quien dibuja es `components/simulacro-maqueta.js`, y
 * quien decide cuando es `components/simulacro.js`. Separado asi, lo que se cuenta se
 * prueba sin dibujar nada, y un rojo dice que el numero esta mal antes de que alguien
 * lo pinte (`scripts/probar-resumen.mjs`).
 *
 * EL RESULTADO NO SE GUARDA (ADR-035, parte 7)
 *
 * Esto se llama cada vez que se muestra el resumen, desde el intento terminado que se
 * conserva. Guardar lo que devuelve seria una segunda fuente de verdad para un numero
 * que ya se deriva de la copia congelada y las respuestas, que estan guardadas las dos.
 *
 * SE CUENTA CON LO QUE EL ESTUDIANTE VIO (decision 4)
 *
 * La correcta sale de la copia congelada, no del banco vigente. Si una pregunta se
 * corrigio despues del intento, el resultado no cambia: lo que cambia es que la
 * revision lo avisa, y eso no se decide aqui.
 */

/** Cuantas correctas hacen falta para «Aprobaste el simulacro» (decision 1). */
export const CORRECTAS_PARA_APROBAR = 72;

/**
 * El estado de una pregunta terminada: correcta, incorrecta u omitida.
 *
 * LAS AGOTADAS NO TIENEN ESTADO PROPIO, y es la regla 4 de la epica: si se agoto el
 * tiempo con una alternativa marcada, **cuenta la marcada**; sin ninguna, queda
 * omitida (regla 6). El motor de los cronometros ya las anota asi —`respondida` con su
 * alternativa, u `omitida` con `null`—, y aqui se mira solo la alternativa. `agotada`
 * se conserva para que la revision pueda decir «se te acabo el tiempo», no para
 * contar.
 *
 * Una alternativa que no esta en la copia congelada cuenta como incorrecta y no como
 * omitida: el estudiante marco algo, y no se puede afirmar que no lo hizo.
 */
function estadoDe(pregunta, respuesta) {
  if (!respuesta || respuesta.alternativa_id === null || respuesta.alternativa_id === undefined) {
    return { estado: 'omitida', dada: null };
  }

  const dada = pregunta.alternativas.find((a) => a.id === respuesta.alternativa_id) ?? null;

  return { estado: dada?.es_correcta ? 'correcta' : 'incorrecta', dada };
}

/**
 * El desglose por modulo, de peor a mejor (decision 7).
 *
 * De peor a mejor **por porcentaje de correctas**; a igual porcentaje, primero el modulo
 * con **mas omitidas**; si sigue el empate, **por numero de modulo**.
 *
 * Por porcentaje y no por cantidad de errores porque un modulo trae 18 preguntas y los
 * demas 17: 7 errores en 18 no es lo mismo que 7 en 17, y ordenar por la cantidad los
 * dejaria empatados.
 *
 * LOS PORCENTAJES SE COMPARAN MULTIPLICANDO EN CRUZ, no dividiendo. `10/17` y `10/17`
 * salen iguales en coma flotante, pero no hay por que apostar a eso en un empate que
 * decide el orden: `a.correctas * b.total` contra `b.correctas * a.total` es exacto en
 * enteros.
 */
function desglosar(porPregunta) {
  const porModulo = new Map();

  for (const { pregunta, estado } of porPregunta) {
    if (!porModulo.has(pregunta.modulo)) {
      porModulo.set(pregunta.modulo, {
        modulo: pregunta.modulo,
        modulo_titulo: pregunta.modulo_titulo ?? null,
        total: 0,
        correctas: 0,
        incorrectas: 0,
        omitidas: 0,
      });
    }

    const fila = porModulo.get(pregunta.modulo);
    fila.total += 1;
    if (estado === 'correcta') fila.correctas += 1;
    else if (estado === 'incorrecta') fila.incorrectas += 1;
    else fila.omitidas += 1;
  }

  return [...porModulo.values()].sort(
    (a, b) =>
      a.correctas * b.total - b.correctas * a.total ||
      b.omitidas - a.omitidas ||
      a.modulo - b.modulo
  );
}

/**
 * Si una pregunta cambio desde el intento (decision 9).
 *
 * Devuelve una de cuatro palabras:
 *
 *   'igual'        el estudiante leeria hoy exactamente lo que leyo.
 *   'corregida'    cambio el enunciado, el texto de alguna alternativa, o cual es la
 *                  correcta. La revision muestra la version vigente con un aviso.
 *   'retirada'     la capa de datos no la devolvio: ya no esta activa.
 *   'desconocida'  no vino, pero la respuesta salio de la copia guardada. Puede ser
 *                  una pregunta que la copia todavia no tiene, y afirmar que se retiro
 *                  seria inventarlo (decision del autor, 2026-09-22).
 *
 * LO QUE NO CUENTA, Y ES LA MITAD DE LA REGLA
 *
 * **Los ids de las alternativas.** `banco:actualizar` borra las cuatro y las reinserta
 * con ids nuevos a la primera correccion, toque lo que toque; comparar por id avisaria
 * de una correccion en preguntas que nadie cambio. Es la regla de ADR-034 para el
 * cuestionario. **El orden de las alternativas**, que se barajan igual (ADR-006). **La
 * justificacion**, que la copia congelada no guarda y que el resumen muestra siempre
 * la vigente.
 *
 * Por eso las alternativas se comparan como un conjunto de textos ordenado, y la
 * correcta por su texto. `es_correcta` llega como 1/0 desde D1 y como booleano por
 * otros caminos: se lee con `Boolean()` y no con `===`.
 *
 * No toca ninguna de las dos preguntas.
 */
export function compararConLaVigente(congelada, vigente, { desdeLaCopia = false } = {}) {
  if (!vigente) return desdeLaCopia ? 'desconocida' : 'retirada';

  const textos = (pregunta) =>
    JSON.stringify((pregunta.alternativas ?? []).map((a) => a.texto).sort());

  const laCorrecta = (pregunta) =>
    (pregunta.alternativas ?? []).find((a) => Boolean(a.es_correcta))?.texto ?? null;

  const igual =
    congelada.enunciado === vigente.enunciado &&
    textos(congelada) === textos(vigente) &&
    laCorrecta(congelada) === laCorrecta(vigente);

  return igual ? 'igual' : 'corregida';
}

/**
 * El tiempo del intento (decision B1).
 *
 * Del comienzo —el instante del clic en «Comenzar»— a la resolucion de la ultima, y el
 * promedio es ese total dividido por la cantidad de preguntas. Los dos salen de
 * instantes guardados, nunca de sumar pulsos: es la regla 4 del tiempo de ADR-035.
 *
 * `null` si falta alguno de los dos instantes. No se inventa un tiempo: un intento sin
 * `terminado_en` no esta terminado, y dibujarle un total seria afirmar algo que no
 * ocurrio.
 */
function tiempoDe({ empezado_en, terminado_en }, total) {
  if (!Number.isFinite(empezado_en) || !Number.isFinite(terminado_en) || total === 0) return null;

  const totalMs = Math.max(0, terminado_en - empezado_en);
  return { total_ms: totalMs, promedio_ms: totalMs / total };
}

/**
 * El resultado entero de un intento terminado.
 *
 * @param {object} intento
 * @param {object[]} intento.preguntas   la copia congelada, en el orden del intento
 * @param {object[]} intento.respuestas  una por pregunta, en el mismo orden
 * @param {number} intento.empezado_en   instante del clic en «Comenzar»
 * @param {number} intento.terminado_en  instante en que quedo resuelta la ultima
 */
export function calcularResultado({ preguntas, respuestas, empezado_en, terminado_en }) {
  const porPregunta = preguntas.map((pregunta, i) => {
    const respuesta = respuestas[i] ?? null;
    const { estado, dada } = estadoDe(pregunta, respuesta);

    return {
      posicion: i + 1,
      pregunta,
      respuesta,
      estado,
      dada,
      correcta: pregunta.alternativas.find((a) => a.es_correcta) ?? null,
    };
  });

  const cuantas = (estado) => porPregunta.filter((p) => p.estado === estado).length;

  const correctas = cuantas('correcta');

  return {
    total: preguntas.length,
    correctas,
    incorrectas: cuantas('incorrecta'),
    omitidas: cuantas('omitida'),
    porcentaje: preguntas.length === 0 ? 0 : Math.floor((correctas * 100) / preguntas.length),
    aprobado: correctas >= CORRECTAS_PARA_APROBAR,
    desglose: desglosar(porPregunta),
    tiempo: tiempoDe({ empezado_en, terminado_en }, preguntas.length),
    porPregunta,
  };
}

/**
 * Los bloques de la revision, en el orden del desglose (decision 2).
 *
 * En cada modulo, las preguntas van en el orden del intento: es el orden en que el
 * estudiante las vivio, y el numero de pregunta que se muestra lo confirma.
 *
 * TODO LO QUE SE DIBUJA COMO «LO QUE HICISTE» SALE DE LA COPIA CONGELADA —el enunciado,
 * la alternativa dada, la correcta—, porque el resultado se calculo con eso (decision 4).
 * Del banco vigente sale la justificacion.
 *
 * Vive en este servicio y no en `components/simulacro.js` porque es dato y no dibujo, y
 * porque `probar-identidad-visual.mjs` necesita armar la revision de verdad sin DOM para
 * medir su contraste y barrer su vocabulario.
 *
 * `vigentes` es un `Map` de id a pregunta del banco vigente, o `null` si no contesto ni la
 * copia: entonces no se compara nada y no se afirma ningun cambio.
 */
export function armarLaRevision(resultado, vigentes, { desdeLaCopia }) {
  return resultado.desglose.map(({ modulo, modulo_titulo }) => {
    const filas = resultado.porPregunta
      .filter(({ pregunta }) => pregunta.modulo === modulo)
      .map(({ posicion, pregunta, respuesta, estado, dada, correcta }) => {
        const vigente = vigentes?.get(pregunta.id);

        // Sin respuesta del banco no hay con que comparar, y no se afirma nada: ni
        // «corregida» ni «retirada». Lo dice la nota de la revision entera.
        const comparacion = vigentes ? compararConLaVigente(pregunta, vigente, { desdeLaCopia }) : 'igual';

        return {
          posicion,
          pregunta_id: pregunta.id,
          enunciado: pregunta.enunciado,
          estado,
          agotada: Boolean(respuesta?.agotada),
          dada: dada?.texto ?? null,
          correcta: correcta?.texto ?? null,
          aviso: comparacion === 'igual' ? null : comparacion,
          vigente:
            comparacion === 'corregida'
              ? {
                  enunciado: vigente.enunciado,
                  correcta: vigente.alternativas.find((a) => Boolean(a.es_correcta))?.texto ?? null,
                }
              : null,
          // La justificacion es SIEMPRE la vigente (decision 9): la copia congelada no la
          // guarda. Una retirada o una que la copia no tiene no traen ninguna.
          conJustificacion: vigente ?? null,
        };
      });

    return {
      modulo,
      modulo_titulo,
      abiertas: filas.filter((f) => f.estado !== 'correcta'),
      correctas: filas.filter((f) => f.estado === 'correcta'),
      correctasAbiertas: false,
    };
  });
}
