/**
 * De donde saca la hora el simulacro (iteracion 42).
 *
 * POR QUE EXISTE
 *
 * El simulacro mide tiempo: 30 segundos por pregunta, el tiempo transcurrido del
 * intento, y el arriendo de la pestana dueña. Un intento completo dura una hora, y
 * ninguna de esas tres cosas se puede comprobar desde un guion si el codigo llama a
 * `Date.now()` directamente: probar el agotamiento de la pregunta 118 costaria
 * cincuenta y nueve minutos de espera real.
 *
 * Este archivo es el unico sitio del simulacro que sabe que hora es. Todo lo demas
 * le pregunta. Un guion puede cambiar la fuente por una de mentira, adelantarla a
 * mano, y con eso jugar un intento entero en milisegundos.
 *
 * LO QUE **NO** PASA POR AQUI, Y ES A PROPOSITO
 *
 * `components/transicion-de-carga.js` se queda con `Date.now()` y `window.setTimeout`
 * de verdad. No es un olvido: el piso de 400 ms de la transicion existe para que el
 * estudiante no vea un parpadeo, y eso se mide contra el reloj del mundo. Los bloques
 * `8f-2` y `10f` de `scripts/probar-filtrado.mjs` cronometran esa espera con
 * `Date.now()` real y una holgura de 700 ms; con la transicion colgada de un reloj
 * que un guion puede adelantar, esas mediciones dejarian de medir nada y pasarian en
 * verde sin probar el parpadeo. Decision del autor del 2026-09-18.
 *
 * EL ASIENTO ES DE MODULO, NO UN PARAMETRO
 *
 * Decision del autor del 2026-09-18. El mismo patron que `almacenDelNavegador()` en
 * `servicios/memoria.js`: una variable de modulo que se resuelve la primera vez y se
 * recuerda. La alternativa era inyectar el reloj como parametro, que es lo que
 * ADR-035 Parte 1 hace con la fuente de azar; ahi funciona porque el azar lo consume
 * **una** funcion. El reloj lo consumen la franja de la 42, el recorrido de la 43 y
 * el resumen de la 44, y enhebrar un argumento mas por todas sus firmas seria ruido
 * en cada una de ellas.
 *
 * EL PRECIO DE ESA ELECCION, ESCRITO PARA QUE NO SORPRENDA
 *
 * Una variable de modulo es una por modulo cargado. Dos pestañas simuladas dentro
 * del mismo proceso de Node comparten este archivo si lo importan con el mismo
 * especificador, y entonces comparten reloj: seria una pestaña con dos nombres. Los
 * guiones que simulan dos pestañas importan con `?pestana=a` y `?pestana=b`, que es
 * el mismo recurso que `probar-filtrado.mjs` ya usa con `?medicion=1`.
 */

/**
 * El reloj del navegador de verdad.
 *
 * Cinco cosas, que son todas las que el simulacro necesita saber del tiempo:
 * que hora es, avisame dentro de N, olvida ese aviso, ¿esta oculta la pagina?, y
 * avisame cuando eso cambie.
 *
 * `window.setTimeout` y no el `setTimeout` suelto, por lo mismo que el resto del
 * sitio: es lo que el DOM falso puede ofrecer sin tocar los temporizadores del
 * proceso.
 */
export function crearRelojDelNavegador() {
  return {
    ahora: () => Date.now(),
    alCabo: (ms, quehacer) => globalThis.window.setTimeout(quehacer, ms),
    cancelar: (pase) => globalThis.window.clearTimeout(pase),
    /**
     * Si la pagina esta en segundo plano.
     *
     * `document.hidden` no existe en navegadores muy viejos, y ahi `undefined`
     * significa «no lo se». Se contesta `false`, que es lo unico seguro: dar por
     * oculta una pagina que se esta mirando pararia el cronometro delante del
     * estudiante. La decision 3 de la iteracion 42 es que el tiempo corre igual, asi
     * que equivocarse hacia «visible» no cambia ninguna cuenta: lo que se pierde es
     * la oportunidad de ponerse al dia antes, no la cuenta.
     */
    oculta: () => globalThis.document?.hidden === true,
    alCambiarLaVisibilidad(quehacer) {
      globalThis.document?.addEventListener?.('visibilitychange', quehacer);
    },
  };
}

/**
 * El asiento. `undefined` mientras nadie lo pidio; un reloj en cuanto alguien lo pide.
 */
let elReloj;

/** El reloj que rige este simulacro. */
export function reloj() {
  if (elReloj === undefined) elReloj = crearRelojDelNavegador();
  return elReloj;
}

/**
 * Cambia el reloj. **Lo llaman los guiones, nunca el sitio.**
 *
 * No hay ninguna guarda que lo impida desde el navegador, y no la hay a proposito:
 * una guarda de ese tipo se comprueba mirando el codigo igual que esta linea, y
 * ademas habria que mantenerla. Lo que sostiene la regla es que ningun archivo de
 * `static/js/` importa esta funcion, y eso se comprueba con un `grep`.
 *
 * Pasarle `undefined` devuelve el asiento a su estado inicial, y el proximo
 * `reloj()` vuelve a construir el del navegador.
 */
export function usarReloj(otro) {
  elReloj = otro;
}
