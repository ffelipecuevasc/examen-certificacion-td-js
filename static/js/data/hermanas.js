/**
 * Preguntas hermanas del banco: las que se rozan tanto que no deberian caer en el
 * mismo intento del simulacro.
 *
 * QUE ES UNA HERMANA, Y QUE NO ES
 *
 * Dos preguntas son hermanas cuando preguntan por los dos lados de la misma
 * distincion: `DROP` frente a `TRUNCATE`, entidad fuerte frente a entidad debil,
 * `rows` frente a `rowCount`. Responder una regala la otra, o la contradice; en un
 * intento de 120 preguntas eso es un regalo o una trampa, y ninguna de las dos
 * cosas mide nada.
 *
 * NO son preguntas duplicadas. Las duplicadas se retiran del banco, y eso es
 * trabajo de contenido. Estas son preguntas legitimas las dos, que sencillamente no
 * se pueden mirar juntas.
 *
 * DE DONDE SALE LA LISTA, Y POR QUE ESO IMPORTA
 *
 * De `npm run informe-banco`, anotada el 2026-09-04 y anclada a ids de D1 el
 * 2026-09-16. La tabla completa, con la cita original de cada par, el enunciado por
 * el que se rozan y el `numero_origen` real de cada uno, vive en
 * `_planmaestro/40-epica-simulacro-examen/iteracion-41-presentacion-y-motor.md`.
 *
 * **El informe compara redaccion y no significado.** O sea: esta lista puede tener
 * de menos, nunca se dio por completa, y encontrar un par nuevo no es un fallo de
 * este archivo sino su forma normal de crecer. Se agrega el grupo aqui y ya.
 *
 * POR QUE GRUPOS Y NO PARES
 *
 * Porque la 222 se roza con la 205 y con la 210 por separado, y las tres juntas
 * forman un trio: si esto fueran pares, un intento podria traer la 205 y la 210
 * —que no figuran como par entre si— y quedarse con dos preguntas sobre lo mismo.
 * Un grupo dice lo que de verdad hace falta: **de aqui dentro entra una sola**.
 *
 * UN GRUPO CON UN ID RETIRADO SE VUELVE INERTE SOLO
 *
 * Los ids retirados dejan de aparecer en `preguntas_ids` del resumen, asi que el
 * algoritmo nunca los elige y su grupo deja de prohibir nada sin que haya que
 * tocar este archivo. Por eso los ids no se borran de aqui cuando una pregunta se
 * retira: si vuelve a activarse, su grupo vuelve a valer.
 *
 * EL GRUPO QUE CRUZA MODULOS ES EL QUE MANDA EN EL DISENO
 *
 * {25, 107} vive en los modulos 2 y 3. Por el se decidieron dos cosas del
 * algoritmo: que la exclusion sea global —un solo conjunto de prohibidos para todo
 * el intento, en vez de uno por modulo— y que el orden en que se recorren los
 * modulos se sortee en cada intento. Con orden fijo, la que estuviera en el modulo
 * que elige despues saldria menos veces, y nadie lo notaria.
 *
 * Son 19 preguntas en nueve grupos. Del banco de 368, el modulo 5 aporta 9 de sus
 * 49, que es el mas apretado y aun asi le deja 44 elegibles para una cuota maxima
 * de 18.
 */

/**
 * Los grupos, cada uno con los ids de D1 de sus preguntas.
 *
 * El orden de los grupos y el de los ids dentro de cada grupo no significan nada:
 * el algoritmo los usa como conjuntos. Estan escritos de menor a mayor para que
 * una diferencia se vea en el diff.
 */
export const GRUPOS_DE_HERMANAS = [
  [25, 107], //  `let` sobre `var` al iterar  /  iteradoras globales anidadas   (2 y 3)
  [26, 45], //   evento `change`             /  evento `blur`                  (2)
  [85, 112], //  notacion de corchetes       /  notacion de punto              (3)
  [189, 219], // violar una llave foranea    /  que restriccion la impone      (5)
  [198, 220], // `DROP`                      /  `TRUNCATE`, contra `DELETE`    (5)
  [202, 221], // entidad fuerte              /  entidad debil                  (5)
  [205, 210, 222], // dependencia transitiva / normalizar / objetivo de la 3FN (5)
  [287, 318], // `rows`                      /  `rowCount`                     (7)
  [326, 360], // como nombrar un endpoint    /  como estructurar el de un recurso (8)
];

/**
 * Indice de id a los ids que quedan prohibidos al elegirlo, el suyo incluido.
 *
 * Se construye una vez y no en cada consulta: el algoritmo pregunta por cada id
 * que mira, y son cientos por intento.
 *
 * Devuelve el grupo ENTERO, con el id preguntado dentro, y eso es a proposito:
 * quien elige un id tiene que prohibir el grupo completo en un solo gesto, sin
 * acordarse de anadir aparte el que acaba de tomar. Una regla que hay que cumplir
 * en dos pasos se cumple a medias el dia que alguien agregue un tercer camino.
 */
export function indiceDeHermanas(grupos = GRUPOS_DE_HERMANAS) {
  const indice = new Map();

  for (const grupo of grupos) {
    for (const id of grupo) indice.set(id, grupo);
  }

  return indice;
}
