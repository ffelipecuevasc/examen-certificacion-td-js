/**
 * Validacion de las preguntas: la que sale al navegador y la que entra a la base.
 *
 * Este archivo tiene DOS mitades, y estan juntas a proposito (iteracion 23,
 * ADR-025):
 *
 *   validarPreguntas()       lo que se LEE, camino al navegador. Descarta la
 *                            pregunta rota y entrega las demas.
 *   validarParaEscritura()   lo que se ESCRIBE, antes de tocar la base. Si algo
 *                            esta mal no se escribe nada.
 *
 * Las dos se apoyan en `motivosDeContenido()`, que es la definicion unica de que
 * es una pregunta valida. Si esto viviera en dos archivos, el dia que uno cambie
 * el banco tendria dos definiciones de «valida» y ninguna forma de enterarse.
 *
 * Lo que sigue describe la mitad de lectura, que es la que nacio primero.
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
 * Las reglas de contenido, que valen igual al leer y al escribir.
 *
 * Estan aparte por el criterio de la iteracion 23: quien escribe y quien lee no
 * pueden discrepar sobre que es una pregunta valida. Si esto se duplicara, el dia
 * que una de las dos copias cambie el banco tendria dos definiciones de «valida»
 * y ninguna forma de notarlo. Cambiar una regla aca se ve en los dos caminos, y
 * eso se comprueba provocandolo, no leyendo este comentario.
 *
 * @returns {string[]} Motivos. Vacio si el contenido esta sano.
 */
function motivosDeContenido(pregunta) {
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

// ---------------------------------------------------------------------------
// La mitad de escritura (iteracion 23, ADR-025)
//
// POR QUE ESTA MITAD REPITE COSAS QUE LA BASE YA COMPRUEBA
//
// La cabecera de este archivo dice que al leer no se repite lo que el esquema ya
// garantiza, porque eso no puede llegar mal desde D1. Al ESCRIBIR es al reves, y
// es el punto entero de ADR-025: el contenido viene de un archivo escrito a mano,
// donde todo puede llegar mal. Comprobarlo antes convierte «la base rechazo el
// lote en la fila 31» en «tu archivo tiene tres problemas, aqui estan los tres».
//
// La diferencia practica: la base rechaza de a uno y aborta; esto rechaza todo
// junto y no toca nada. Un lote de 40 preguntas con cuatro erratas se arregla en
// una pasada en vez de en cuatro.
//
// LO QUE NO SE DUPLICA
//
// Las reglas de contenido —cuatro alternativas, una correcta, textos con algo
// dentro— NO se reescriben aca: se llama a `motivosDeContenido()`, que es la
// misma funcion que usa la lectura. Ese es el criterio de la iteracion 23.
// ---------------------------------------------------------------------------

/** Modulos que admite el plan formativo. El CHECK del esquema dice lo mismo. */
const MODULO_MINIMO = 2;
const MODULO_MAXIMO = 8;

/** Origenes declarados por ADR-016. */
const ORIGENES = ['json_2026', 'js_2026'];

/** Estados de ADR-020. */
const ESTADOS = ['borrador', 'activa', 'retirada'];

/** Dificultades admitidas. Ausente tambien vale: el esquema la deja NULL. */
const DIFICULTADES = ['baja', 'media', 'alta'];

/** Las cuatro letras, en su orden. */
const LETRAS = ['a', 'b', 'c', 'd'];

/** Un entero de verdad, no una cadena que se le parezca. */
function esEntero(valor) {
  return Number.isInteger(valor);
}

/** Ausente es `undefined` o `null`. La cadena vacia NO es ausente: es un error. */
function ausente(valor) {
  return valor === undefined || valor === null;
}

/**
 * Motivos por los que una pregunta no se puede escribir en la base.
 *
 * @param {object} pregunta Ya normalizada: es_correcta y orden_fijo en 1/0.
 * @returns {string[]}
 */
function motivosDeEscritura(pregunta) {
  const motivos = motivosDeContenido(pregunta);

  if (!esEntero(pregunta.modulo) || pregunta.modulo < MODULO_MINIMO || pregunta.modulo > MODULO_MAXIMO) {
    motivos.push(`el modulo debe ser un entero entre ${MODULO_MINIMO} y ${MODULO_MAXIMO}, y llego «${pregunta.modulo}»`);
  }

  if (!ORIGENES.includes(pregunta.origen)) {
    motivos.push(`el origen debe ser uno de ${ORIGENES.join(' o ')}, y llego «${pregunta.origen}»`);
  }

  if (!esEntero(pregunta.numero_origen)) {
    motivos.push(`numero_origen debe ser un entero, y llego «${pregunta.numero_origen}»`);
  }

  const estado = ausente(pregunta.estado) ? 'borrador' : pregunta.estado;
  if (!ESTADOS.includes(estado)) {
    motivos.push(`el estado debe ser uno de ${ESTADOS.join(', ')}, y llego «${pregunta.estado}»`);
  }

  // La justificacion es obligatoria solo en «activa», que es lo unico que ve el
  // estudiante. El esquema la deja NULL a proposito, y el banco de ejemplo tiene
  // dos preguntas sin ella: la 9, retirada, y la 10, borrador. Exigirla siempre
  // dejaria esas dos sin poder cargarse con esta herramienta.
  if (estado === 'activa' && !tieneTexto(pregunta.justificacion)) {
    motivos.push('una pregunta activa tiene que traer justificacion');
  }

  // Ausente vale; presente y rara, no. Es el CHECK del esquema, dicho antes.
  if (!ausente(pregunta.dificultad) && !DIFICULTADES.includes(pregunta.dificultad)) {
    motivos.push(`la dificultad debe ser ${DIFICULTADES.join(', ')} o venir ausente, y llego «${pregunta.dificultad}»`);
  }

  if (!ausente(pregunta.orden_fijo) && pregunta.orden_fijo !== 0 && pregunta.orden_fijo !== 1) {
    motivos.push(`orden_fijo debe ser verdadero o falso, y llego «${pregunta.orden_fijo}»`);
  }

  // Los metadatos de retiro tienen su propio CHECK en el esquema, y es de los que
  // mas cuesta leer cuando salta desde la base.
  if (estado === 'retirada' && !tieneTexto(pregunta.motivo_retiro)) {
    motivos.push('una pregunta retirada tiene que decir por que se retiro');
  }
  if (estado !== 'retirada' && (!ausente(pregunta.motivo_retiro) || !ausente(pregunta.retirada_en) || !ausente(pregunta.reemplazada_por))) {
    motivos.push(`solo una pregunta retirada puede traer motivo_retiro, retirada_en o reemplazada_por, y esta esta «${estado}»`);
  }

  // Letras y ordenes: el esquema los cubre con dos UNIQUE y dos CHECK, que al
  // saltar hablan de indices. Aca se dice en castellano y se dicen los cuatro
  // problemas juntos.
  if (Array.isArray(pregunta.alternativas)) {
    const letras = pregunta.alternativas.map((a) => a.letra);
    const ordenes = pregunta.alternativas.map((a) => a.orden);

    if (letras.some((l) => !LETRAS.includes(l))) {
      motivos.push(`las letras deben ser ${LETRAS.join(', ')}, y llegaron «${letras.join(', ')}»`);
    } else if (new Set(letras).size !== letras.length) {
      motivos.push(`hay letras repetidas: «${letras.join(', ')}»`);
    }

    if (ordenes.some((o) => !esEntero(o) || o < 1 || o > LETRAS.length)) {
      motivos.push(`los ordenes deben ser enteros entre 1 y ${LETRAS.length}, y llegaron «${ordenes.join(', ')}»`);
    } else if (new Set(ordenes).size !== ordenes.length) {
      motivos.push(`hay ordenes repetidos: «${ordenes.join(', ')}»`);
    }
  }

  return motivos;
}

/**
 * Revisa un lote entero antes de escribir una sola fila.
 *
 * No descarta: si algo esta mal, no se escribe NADA. Es la diferencia con la
 * lectura, y sale de la regla 1 de ADR-025. Descartar la pregunta mala y cargar
 * las otras dejaria un lote a medias, que es justo el estado que no debe existir.
 *
 * @param {object[]} preguntas Ya normalizadas.
 * @returns {{ ok: boolean, problemas: object[] }}
 */
export function validarParaEscritura(preguntas) {
  const problemas = [];

  preguntas.forEach((pregunta, indice) => {
    const motivos = motivosDeEscritura(pregunta);
    if (motivos.length === 0) return;

    problemas.push({
      // Se nombra por su posicion en el archivo Y por su terna, porque al cargar
      // todavia no hay id: el id lo pone la base. Sin la posicion, en un lote de
      // 40 no se sabe cual arreglar.
      posicion: indice + 1,
      referencia: `modulo ${pregunta.modulo}, ${pregunta.origen} n.o ${pregunta.numero_origen}`,
      motivos,
    });
  });

  return { ok: problemas.length === 0, problemas };
}
