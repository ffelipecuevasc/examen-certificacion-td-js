/**
 * Validacion de las preguntas antes de entregarlas al navegador.
 *
 * Esta es la mitad de entrada de la regla de doble filo de la iteracion 22: se
 * valida al salir de la base y se escapa al entrar al DOM. Ninguna de las dos
 * sustituye a la otra. El escapado vive en el navegador, en utils/dom.js.
 *
 * QUE COMPRUEBA Y QUE NO
 *
 * Comprueba exactamente lo que el esquema NO puede exigir por su cuenta, que esta
 * tabulado en 90-manual/esquema-del-banco.md:
 *
 *   - que las alternativas sean EXACTAMENTE cuatro (la base impide pasarse de
 *     cuatro, no impide quedarse en tres);
 *   - que haya EXACTAMENTE una correcta (el indice parcial impide que haya dos,
 *     no impide que haya cero);
 *   - que los textos que se van a dibujar traigan algo que dibujar.
 *
 * No repite lo que la base ya garantiza —la letra dentro de a-d, la unicidad del
 * enunciado, la llave foranea del modulo—, porque eso no puede llegar mal desde
 * D1 y comprobarlo aca solo daria la impresion de estar cubriendo algo.
 *
 * POR QUE DESCARTA EN VEZ DE FALLAR
 *
 * Una pregunta rota no puede tumbar la respuesta completa: el estudiante perderia
 * el banco entero por un registro. Se descarta la pregunta, se sigue con las
 * demas, y el descarte queda contado y explicado en el informe. Lo que NO se hace
 * es descartar en silencio: una lista que encoge sin decir por que es peor que un
 * error, porque nadie la mira.
 *
 * EL INFORME NO ES PARA EL ESTUDIANTE
 *
 * Viaja en meta.validacion y esta escrito para quien mantiene el banco. Nombra la
 * pregunta por su id, que es estable de por vida (ADR-020), asi que un motivo del
 * informe se puede ir a arreglar directo a la base.
 */

/** Alternativas que debe traer toda pregunta. Cuatro, ni tres ni cinco. */
const ALTERNATIVAS_ESPERADAS = 4;

/** Correctas que debe traer toda pregunta. Exactamente una. */
const CORRECTAS_ESPERADAS = 1;

/** Un texto sirve si es una cadena con algo que no sea espacio en blanco. */
function tieneTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

/**
 * Revisa una pregunta ya armada con sus alternativas.
 * @returns {string[]} Motivos por los que se descarta. Vacio si esta sana.
 */
function motivosDeDescarte(pregunta) {
  const motivos = [];

  if (!tieneTexto(pregunta.enunciado)) {
    motivos.push('enunciado vacio');
  }

  if (!tieneTexto(pregunta.modulo_titulo)) {
    motivos.push('el modulo no trae titulo');
  }

  const alternativas = pregunta.alternativas;

  if (alternativas.length !== ALTERNATIVAS_ESPERADAS) {
    motivos.push(`tiene ${alternativas.length} alternativas y debe tener ${ALTERNATIVAS_ESPERADAS}`);
  }

  const sinTexto = alternativas.filter((a) => !tieneTexto(a.texto)).length;
  if (sinTexto > 0) {
    motivos.push(`${sinTexto} alternativa(s) sin texto`);
  }

  const correctas = alternativas.filter((a) => a.es_correcta === 1);
  if (correctas.length !== CORRECTAS_ESPERADAS) {
    // Cero y dos son problemas distintos y conviene que el informe lo diga: cero
    // es una carga incompleta, dos seria el indice parcial roto, que no deberia
    // poder pasar. Si alguna vez aparece un 2 aca, el problema es mas grave que
    // esta pregunta.
    motivos.push(
      correctas.length === 0
        ? 'ninguna alternativa marcada como correcta'
        : `${correctas.length} alternativas marcadas como correctas`
    );
  }

  return motivos;
}

/**
 * Separa las preguntas sanas de las rotas y arma el informe.
 *
 * @param {object[]} preguntas Preguntas ya armadas con su lista de alternativas.
 * @returns {{ validas: object[], informe: object }}
 */
export function validarPreguntas(preguntas) {
  const validas = [];
  const descartadas = [];

  for (const pregunta of preguntas) {
    const motivos = motivosDeDescarte(pregunta);

    if (motivos.length === 0) {
      validas.push(pregunta);
      continue;
    }

    descartadas.push({
      id: pregunta.id,
      modulo: pregunta.modulo,
      motivos,
    });
  }

  return {
    validas,
    informe: {
      leidas: preguntas.length,
      entregadas: validas.length,
      descartadas: descartadas.length,
      // El detalle va siempre, incluso vacio: un informe que aparece solo cuando
      // hay problemas ensena a no buscarlo.
      detalle: descartadas,
    },
  };
}
