/**
 * Elige las 120 preguntas de un intento del simulacro (iteracion 41, etapa B).
 *
 * QUE HACE, Y SOBRE TODO QUE NO HACE
 *
 * Recibe los ids de las preguntas activas de cada modulo y devuelve cuales entran
 * al intento. **No pide nada, no dibuja nada y no guarda nada.** No importa
 * `servicios/datos.js`, y ni siquiera sabe que existe un extremo.
 *
 * Eso es la decision 1 de la iteracion: **el navegador elige y el extremo solo
 * sirve**. Y tiene una consecuencia que vale la pena decir en voz alta: como los
 * ids entran por parametro, este archivo **no sabe si vienen de D1 o de la
 * instantanea de respaldo**. El camino normal y el degradado son el mismo camino
 * hasta aqui, asi que no pueden divergir. No hay dos algoritmos que mantener al
 * dia; hay uno, y el modo degradado lo usa igual.
 *
 * EL AZAR ENTRA POR PARAMETRO (decision 10)
 *
 * Con `Math.random` escrito aqui dentro, la muestra de 200 intentos con la que se
 * comprueban el reparto, la exclusion y el solapamiento no se podria volver a
 * correr igual, y un rojo que no se puede reproducir no se arregla: se discute. El
 * sitio no pasa nada y se queda con `Math.random`; los guiones pasan una fuente
 * con semilla.
 *
 * LAS TRES REGLAS, EN ORDEN DE CUAL MANDA
 *
 *   1. **120 preguntas, siempre.** Un intento con 119 no es un intento corto: es
 *      un intento roto, porque el 60 % de aprobacion esta calculado sobre 120. Si
 *      no se pueden reunir, el intento NO empieza y se dice por que (decision 4).
 *   2. **17 por modulo y una mas en un modulo sorteado** (decision 2). Los siete
 *      modulos entran al examen y ninguno vale mas que otro; el sobrante de
 *      120 / 7 no se le puede regalar siempre al mismo.
 *   3. **Una sola pregunta por grupo de hermanas, en todo el intento** (decision 3).
 *
 * POR QUE LA EXCLUSION ES GLOBAL Y NO POR MODULO
 *
 * Por el par {25, 107}, que cruza los modulos 2 y 3. Con un conjunto de prohibidos
 * por modulo, elegir la 25 en el 2 no impediria elegir la 107 en el 3, y el intento
 * traeria las dos. Con un conjunto unico que se arrastra durante toda la eleccion,
 * cuando le toca al modulo 3 la 107 ya esta prohibida. No hace falta deshacer
 * ninguna eleccion, que es lo caro de resolver esto al reves.
 *
 * POR QUE EL ORDEN DE LOS MODULOS SE SORTEA
 *
 * Es la otra mitad de lo mismo, y es menos evidente. Con un recorrido fijo del 2 al
 * 8, la 25 —modulo 2— se elige antes de que nadie mire el modulo 3: cada vez que
 * sale la 25 queda prohibida la 107, y la 107 no puede prohibir nunca a la 25,
 * porque cuando le toca al modulo 3 el 2 ya paso. El resultado es que la 25 sale
 * bastante mas veces que la 107 a lo largo de muchos intentos, sin que nada lo
 * anuncie: el sesgo no rompe ninguna regla, solo hace mas probable estudiar una
 * cara de la distincion que la otra. Sorteando el orden, cada una gana la carrera
 * la mitad de las veces.
 *
 * El sorteo del orden **no cambia el orden de las preguntas dentro del intento**:
 * eso lo decide quien las dibuja, y hoy nadie las dibuja todavia.
 */
import { shuffle } from '../utils/dom.js';
import { GRUPOS_DE_HERMANAS, indiceDeHermanas } from '../data/hermanas.js';

/** Cuantas preguntas trae un intento. El 60 % de aprobacion cuenta sobre esto. */
export const PREGUNTAS_DEL_INTENTO = 120;

/** La cuota base de cada modulo. 120 / 7 = 17, y sobra una. */
export const PREGUNTAS_POR_MODULO = 17;

/**
 * Los modulos que entran al examen, en orden.
 *
 * No se importan de `data/modules.js` a proposito: ese archivo describe la guia de
 * estudio del sitio y podria crecer con un modulo que no entre al examen. Lo que
 * manda aqui es el mismo rango que valida la capa de datos —`MODULO_MINIMO` y
 * `MODULO_MAXIMO` de `functions/api/_validacion.js`—, que no se puede importar
 * desde el navegador porque vive del lado del servidor.
 */
export const MODULOS_DEL_EXAMEN = [2, 3, 4, 5, 6, 7, 8];

/**
 * Por que el intento no pudo empezar. Son los dos unicos motivos.
 *
 * Se devuelven como codigo y no como frase: quien dibuja escribe la frase, y una
 * frase que viajara desde aqui terminaria escrita en dos sitios el dia que alguien
 * la cambie en uno solo.
 */
export const FALTA_MODULO = 'falta_modulo';
export const SIN_CANDIDATOS = 'sin_candidatos';

/**
 * Elige el intento.
 *
 * @param {object} ajustes
 * @param {Record<number, number[]>} ajustes.idsPorModulo
 *        Los ids activos de cada modulo. Salen de `preguntas_ids` del resumen,
 *        venga de D1 o de la instantanea.
 * @param {number[][]} [ajustes.grupos] Los grupos de hermanas.
 * @param {() => number} [ajustes.azar] Fuente de azar en [0, 1).
 *
 * Devuelve, si se pudo:
 *
 *   ok               true
 *   ids              los 120, agrupados por modulo en orden del 2 al 8
 *   porModulo        { 2: [...], ..., 8: [...] } con la cuota de cada uno
 *   moduloDelExtra   a quien le toco la pregunta 120
 *   orden            en que orden se recorrieron los modulos este intento
 *   reservas         lo que hace falta para reponer despues (ver `reponerDelModulo`)
 *
 * Y si no se pudo:
 *
 *   ok               false
 *   motivo           FALTA_MODULO o SIN_CANDIDATOS
 *   modulo           cual
 *   faltaban         cuantas le faltaron para su cuota (solo con SIN_CANDIDATOS)
 */
export function elegirIntento({
  idsPorModulo,
  grupos = GRUPOS_DE_HERMANAS,
  azar = Math.random,
}) {
  // 1 · Estan los siete, y cada uno trae ids.
  //
  // Se comprueba antes de sortear nada. Un modulo que no vino no es un modulo con
  // pocas preguntas: es una respuesta incompleta, y empezar a elegir sobre ella
  // daria un intento de 103 preguntas con toda la pinta de estar bien.
  for (const modulo of MODULOS_DEL_EXAMEN) {
    const ids = idsPorModulo?.[modulo];
    if (!Array.isArray(ids) || ids.length === 0) {
      return { ok: false, motivo: FALTA_MODULO, modulo };
    }
  }

  // 2 · A quien le toca la pregunta 120.
  //
  // Se sortea sobre la lista FIJA de modulos y no sobre el orden barajado del paso
  // siguiente: si saliera del recorrido, el extra le tocaria siempre al que quedo
  // primero, que es un sesgo escondido dentro de otro sorteo.
  const moduloDelExtra =
    MODULOS_DEL_EXAMEN[Math.floor(azar() * MODULOS_DEL_EXAMEN.length)];

  // 3 · En que orden se recorren los modulos este intento. Ver la cabecera.
  const orden = shuffle(MODULOS_DEL_EXAMEN, azar);

  // 4 · El conjunto de prohibidos, uno solo para todo el intento.
  const hermanas = indiceDeHermanas(grupos);
  const prohibidos = new Set();

  const porModulo = {};
  const sobrantes = {};

  for (const modulo of orden) {
    const cuota = PREGUNTAS_POR_MODULO + (modulo === moduloDelExtra ? 1 : 0);
    const barajados = shuffle(idsPorModulo[modulo], azar);

    const elegidos = [];
    const noElegidos = [];

    for (const id of barajados) {
      if (elegidos.length === cuota || prohibidos.has(id)) {
        noElegidos.push(id);
        continue;
      }

      elegidos.push(id);

      // Se prohibe el GRUPO ENTERO, no el id. `indiceDeHermanas()` devuelve el
      // grupo con el id preguntado dentro justamente para que esto sea un solo
      // gesto: prohibir el id por un lado y sus hermanas por otro se cumple a
      // medias el dia que alguien agregue otro camino de eleccion.
      for (const hermana of hermanas.get(id) ?? [id]) prohibidos.add(hermana);
    }

    if (elegidos.length < cuota) {
      return {
        ok: false,
        motivo: SIN_CANDIDATOS,
        modulo,
        faltaban: cuota - elegidos.length,
      };
    }

    porModulo[modulo] = elegidos;

    // Los no elegidos se guardan EN EL ORDEN BARAJADO, incluidos los que se
    // saltaron por prohibidos. Reponer vuelve a filtrar contra el conjunto, que
    // para entonces puede haber crecido: guardarlos ya filtrados obligaria a
    // rebarajar al reponer, y con eso la muestra dejaria de ser repetible.
    sobrantes[modulo] = noElegidos;
  }

  // Se devuelven agrupados del 2 al 8 y no en el orden barajado: el recorrido es un
  // detalle de COMO se eligio, y dos intentos con las mismas preguntas se verian
  // distintos solo por eso.
  const ids = MODULOS_DEL_EXAMEN.flatMap((modulo) => porModulo[modulo]);

  return {
    ok: true,
    ids,
    porModulo,
    moduloDelExtra,
    orden,
    reservas: { sobrantes, prohibidos, hermanas },
  };
}

/**
 * Saca de la reserva de un modulo hasta `cuantas` preguntas mas (decision 4).
 *
 * Se llama cuando una pregunta pedida no volvio o la validacion la descarto: se
 * repone **del mismo modulo y con la misma regla de exclusion**, porque el reparto
 * parejo es parte de lo que el intento promete, y taparlo con una pregunta de otro
 * modulo dejaria 16 de uno y 18 de otro sin que nada lo dijera.
 *
 * **Muta la reserva**, a proposito: lo que sale deja de estar disponible y su grupo
 * queda prohibido para las reposiciones siguientes. Devolver una reserva nueva
 * dejaria dos vivas y abriria la puerta a reponer dos veces el mismo id.
 *
 * Devuelve lo que pudo, que puede ser menos de lo pedido —o nada—. Quien llama
 * decide si con eso alcanza; aqui no se sabe cuantas faltan en total.
 */
export function reponerDelModulo(reservas, modulo, cuantas) {
  const disponibles = reservas.sobrantes[modulo] ?? [];
  const repuestos = [];

  while (repuestos.length < cuantas && disponibles.length > 0) {
    const id = disponibles.shift();
    if (reservas.prohibidos.has(id)) continue;

    repuestos.push(id);
    for (const hermana of reservas.hermanas.get(id) ?? [id]) {
      reservas.prohibidos.add(hermana);
    }
  }

  return repuestos;
}
