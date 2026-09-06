import { validarPreguntas } from "../../functions/api/_validacion.js";

/**
 * Validador estricto para el JSON de carga del banco de preguntas.
 * Falla asimetricamente: cualquier anomalia aborta el proceso, sin importar si
 * es una propiedad extra o un tipo de dato equivocado.
 */

const CAMPOS_PERMITIDOS_PREGUNTA = new Set([
  "modulo", "origen", "numero_origen", "enunciado", "justificacion",
  "dificultad", "orden_fijo", "estado", "alternativas"
]);

const CAMPOS_PERMITIDOS_ALTERNATIVA = new Set([
  "letra", "orden", "texto", "es_correcta"
]);

function validarPropiedadesDesconocidas(objeto, permitidos, contexto) {
  const claves = Object.keys(objeto);
  for (const clave of claves) {
    if (!permitidos.has(clave)) {
      throw new Error(`Campo desconocido "${clave}" en ${contexto}`);
    }
  }
}

function validarEstructura(pregunta, index) {
  if (!pregunta || typeof pregunta !== "object") {
    throw new Error(`Pregunta en el indice ${index} no es un objeto JSON valido.`);
  }

  validarPropiedadesDesconocidas(pregunta, CAMPOS_PERMITIDOS_PREGUNTA, `pregunta indice ${index}`);

  if (typeof pregunta.modulo !== "number" || pregunta.modulo < 2 || pregunta.modulo > 8) {
    throw new Error(`Pregunta ${index}: "modulo" debe ser un numero entre 2 y 8.`);
  }
  if (typeof pregunta.origen !== "string") {
    throw new Error(`Pregunta ${index}: "origen" debe ser string.`);
  }
  if (typeof pregunta.numero_origen !== "number") {
    throw new Error(`Pregunta ${index}: "numero_origen" debe ser numero.`);
  }
  if (typeof pregunta.enunciado !== "string" || pregunta.enunciado.trim() === "") {
    throw new Error(`Pregunta ${index}: "enunciado" no puede estar vacio.`);
  }
  if (pregunta.justificacion !== undefined && pregunta.justificacion !== null && typeof pregunta.justificacion !== "string") {
    throw new Error(`Pregunta ${index}: "justificacion" debe ser nulo o string.`);
  }
  if (pregunta.dificultad !== undefined && pregunta.dificultad !== null && !["baja", "media", "alta"].includes(pregunta.dificultad)) {
    throw new Error(`Pregunta ${index}: "dificultad" debe ser "baja", "media", "alta" o null.`);
  }
  if (pregunta.orden_fijo !== undefined && ![0, 1].includes(pregunta.orden_fijo)) {
    throw new Error(`Pregunta ${index}: "orden_fijo" debe ser 0 o 1.`);
  }
  if (pregunta.estado !== undefined && !["borrador", "activa", "retirada"].includes(pregunta.estado)) {
    throw new Error(`Pregunta ${index}: "estado" debe ser "borrador", "activa" o "retirada".`);
  }

  if (!Array.isArray(pregunta.alternativas)) {
    throw new Error(`Pregunta ${index}: "alternativas" debe ser un arreglo.`);
  }

  pregunta.alternativas.forEach((alt, aIdx) => {
    if (!alt || typeof alt !== "object") {
      throw new Error(`Pregunta ${index}, alternativa ${aIdx}: debe ser un objeto.`);
    }
    validarPropiedadesDesconocidas(alt, CAMPOS_PERMITIDOS_ALTERNATIVA, `pregunta ${index}, alternativa ${aIdx}`);

    if (typeof alt.letra !== "string" || !["a", "b", "c", "d"].includes(alt.letra)) {
      throw new Error(`Pregunta ${index}, alternativa ${aIdx}: "letra" debe ser a,b,c o d.`);
    }
    if (typeof alt.orden !== "number" || alt.orden < 1 || alt.orden > 4) {
      throw new Error(`Pregunta ${index}, alternativa ${aIdx}: "orden" debe ser entre 1 y 4.`);
    }
    if (typeof alt.texto !== "string" || alt.texto.trim() === "") {
      throw new Error(`Pregunta ${index}, alternativa ${aIdx}: "texto" no puede estar vacio.`);
    }
    if (![0, 1].includes(alt.es_correcta)) {
      throw new Error(`Pregunta ${index}, alternativa ${aIdx}: "es_correcta" debe ser 0 o 1.`);
    }
  });
}

/**
 * Valida un array de preguntas contra el esquema esperado y las reglas de negocio, 
 * arrojando un error si encuentra anomalias.
 * 
 * @param {object[]} lote Array de preguntas JSON
 */
export function assertLoteValido(lote) {
  if (!Array.isArray(lote)) {
    throw new Error("El lote debe ser un arreglo de objetos JSON.");
  }

  if (lote.length === 0) {
    throw new Error("El lote esta vacio.");
  }

  // 1. Validacion estructural bloqueante
  lote.forEach((pregunta, index) => {
    validarEstructura(pregunta, index);
  });

  // 2. Validacion de negocio
  // _validacion.js asume un objeto que ya viene de la bd (con modulo_titulo).
  // Para reciclarlas, armaremos pseudo-objetos simulando la salida DB temporalmente
  const pseudoBDBatch = lote.map(p => ({
    ...p,
    modulo_titulo: "Titulo Simulado", // No importa aqui, la BD lo llena con el JOIN de modulo
  }));

  const resultado = validarPreguntas(pseudoBDBatch);
  if (resultado.informe.descartadas > 0) {
    const errorPrimerDescarte = resultado.informe.detalle[0];
    throw new Error(`Fallo regla de negocio en lote: Modulo ${errorPrimerDescarte.modulo}, motivos: ${errorPrimerDescarte.motivos.join(", ")}`);
  }
}

