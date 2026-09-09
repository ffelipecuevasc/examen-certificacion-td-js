/**
 * Validacion de las preguntas que salen de la base camino al navegador.
 *
 * ESTE ARCHIVO VIAJA AL WORKER PUBLICADO. LO QUE ENTRE AQUI, SE PUBLICA.
 *
 * Por eso solo vive aqui el camino de LECTURA. Las reglas que unicamente
 * importan al escribir —rango de modulo, origen, estado, justificacion
 * obligatoria en las activas, dificultad, letras y ordenes— viven en
 * `scripts/validacion-de-escritura.mjs`, que corre en el computador del autor y
 * no se publica nunca.
 *
 * LA DEFINICION COMPARTIDA, Y POR QUE VIVE DE ESTE LADO
 *
 * `motivosDeContenido()` se exporta, y es la definicion UNICA de que es una
 * pregunta valida: cuatro alternativas, exactamente una correcta, textos con algo
 * dentro. El camino de escritura la importa desde aqui en vez de tener su propia
 * copia (ADR-025, regla 4). Si hubiera dos copias, el dia que una cambiara el
 * banco tendria dos definiciones de «valida» y ninguna forma de enterarse.
 *
 * Vive de este lado, y no del de escritura, porque este es el que no puede
 * faltar: el sitio se publica sin `scripts/`, y sin esta funcion no habria nada
 * que validar antes de entregarle preguntas a un estudiante.
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

/**
 * Los modulos que existen en el plan formativo. Igual que el CHECK del esquema.
 *
 * Se exportan, y hay UNA sola definicion en todo el proyecto a proposito. Estuvo
 * repetida —aqui y en `preguntas.js`— durante la iteracion 23, y dos definiciones
 * del mismo rango son de la familia de problemas que este proyecto persigue: no
 * fallan al divergir, se quedan calladas. El dia que el plan formativo sume un
 * modulo, este es el unico numero que hay que mover.
 */
export const MODULO_MINIMO = 2;
export const MODULO_MAXIMO = 8;

/** Un texto sirve si es una cadena con algo que no sea espacio en blanco. */
function tieneTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

/**
 * Las reglas de contenido, que valen igual al leer y al escribir.
 *
 * EXPORTADA A PROPOSITO. Es el punto de union entre los dos caminos: la usa
 * `validarPreguntas()` aqui abajo, y la importa `scripts/validacion-de-escritura.mjs`
 * desde fuera. Quien escribe y quien lee no pueden discrepar sobre que es una
 * pregunta valida, y la unica forma de garantizarlo es que no haya dos copias.
 *
 * Cambiar una regla aca se ve en los dos caminos, y eso se comprueba
 * provocandolo, no leyendo este comentario.
 *
 * @returns {string[]} Motivos. Vacio si el contenido esta sano.
 */
export function motivosDeContenido(pregunta) {
  const motivos = [];

  if (!tieneTexto(pregunta.enunciado)) {
    motivos.push('enunciado vacio');
  }

  const alternativas = pregunta.alternativas;

  // Leyendo desde D1 siempre llega una lista, aunque venga vacia. Escribiendo
  // llega lo que traiga el JSON, que puede no traer nada. Sin esta guarda, una
  // pregunta sin el campo revienta la validacion en vez de ser rechazada por
  // ella, y un error de contenido se disfrazaria de error de la herramienta.
  if (!Array.isArray(alternativas)) {
    motivos.push('no trae lista de alternativas');
    return motivos;
  }

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
 * Revisa una pregunta que viene de la base, camino al navegador.
 *
 * Es el contenido comun mas lo unico que solo existe al leer: el titulo del
 * modulo, que no esta en `pregunta` sino que lo trae el cruce de la vista
 * `pregunta_activa` (ADR-021). Al escribir no se manda, se deduce del numero de
 * modulo, asi que exigirlo alli no tendria sentido.
 *
 * @returns {string[]} Motivos por los que se descarta. Vacio si esta sana.
 */
function motivosDeDescarte(pregunta) {
  const motivos = motivosDeContenido(pregunta);

  if (!tieneTexto(pregunta.modulo_titulo)) {
    motivos.push('el modulo no trae titulo');
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
