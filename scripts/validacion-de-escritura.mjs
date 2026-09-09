/**
 * Validacion de las preguntas ANTES de escribirlas en la base (ADR-025, iteracion 23).
 *
 * POR QUE ESTE ARCHIVO VIVE EN scripts/ Y NO EN functions/
 *
 * `functions/` la compila Cloudflare y viaja al Worker publicado. `scripts/` no:
 * corre en el computador del autor y no se publica nunca. Estas reglas solo las
 * usa la herramienta local de administracion, asi que el camino publicado no
 * tiene por que cargarlas ni el lector del codigo tiene por que encontrarselas
 * mientras revisa lo que sirve preguntas a un estudiante.
 *
 * Estuvieron dentro de `functions/api/_validacion.js` durante la iteracion 23, y
 * se sacaron despues. El empaquetador de Cloudflare las descartaba igual, asi que
 * el motivo del corte no es el peso: es que un archivo del camino publicado
 * contaba una historia que no era la suya.
 *
 * LO QUE NO SE DUPLICA
 *
 * Las reglas de contenido —cuatro alternativas, exactamente una correcta, textos
 * con algo dentro— NO se reescriben aca: se importa `motivosDeContenido()`, que
 * es la definicion unica y vive del lado de la lectura. Ese es el criterio de la
 * iteracion 23, y se comprueba provocandolo: cambiar una regla alla se tiene que
 * ver en los dos caminos.
 *
 * POR QUE ESTA MITAD SI REPITE COSAS QUE LA BASE YA COMPRUEBA
 *
 * La cabecera de `_validacion.js` dice que al leer no se repite lo que el esquema
 * ya garantiza, porque eso no puede llegar mal desde D1. Al ESCRIBIR es al reves,
 * y es el punto entero de ADR-025: el contenido viene de un archivo escrito a
 * mano, donde todo puede llegar mal. Comprobarlo antes convierte «la base rechazo
 * el lote en la fila 31» en «tu archivo tiene tres problemas, aqui estan los tres».
 *
 * La diferencia practica: la base rechaza de a uno y aborta; esto rechaza todo
 * junto y no toca nada. Un lote de 40 preguntas con cuatro erratas se arregla en
 * una pasada en vez de en cuatro.
 */
import {
  MODULO_MAXIMO,
  MODULO_MINIMO,
  motivosDeContenido,
} from '../functions/api/_validacion.js';

/** Origenes declarados por ADR-016. */
const ORIGENES = ['json_2026', 'js_2026'];

/** Estados de ADR-020. */
const ESTADOS = ['borrador', 'activa', 'retirada'];

/** Dificultades admitidas. Ausente tambien vale: el esquema la deja NULL. */
const DIFICULTADES = ['baja', 'media', 'alta'];

/** Las cuatro letras, en su orden. */
const LETRAS = ['a', 'b', 'c', 'd'];

/** Un texto sirve si es una cadena con algo que no sea espacio en blanco. */
function tieneTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

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
