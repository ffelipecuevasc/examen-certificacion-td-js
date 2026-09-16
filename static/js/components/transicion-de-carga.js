/**
 * La transicion que acompana una carga (iteracion 35, extraida en la 41).
 *
 * DE DONDE SALE ESTE ARCHIVO
 *
 * Nacio dentro de components/cuestionario.js en la iteracion 35 y salio de ahi en
 * la 41, decision 9, porque el simulacro necesita la misma transicion y dos copias
 * de lo mismo no fallan cuando divergen: se quedan calladas, y la que se quede
 * atras empieza a dibujar otra pantalla que la que existe. Es el mismo motivo por
 * el que scripts/dom-falso.mjs es un archivo aparte.
 *
 * **La extraccion no cambio ni una decision de la iteracion 35.** Lo que se movio
 * se movio entero, comentarios incluidos: lo que aqui abajo explica por que algo es
 * como es, lo explicaba ya cuando vivia en el cuestionario. Lo unico nuevo es que
 * los cuatro datos que eran del cuestionario —el contenedor, los textos, los
 * controles que se desactivan y los ids de los nodos— ahora entran por parametro.
 *
 * QUE ES UNA TRANSICION, AQUI DENTRO
 *
 * Tres piezas y ni una mas: **el logotipo de JavaScript quieto**, **un indicador
 * sin porcentaje** y **el texto que nombra lo que viene**. Encima de eso, cuatro
 * conductas que no se pueden separar de ese dibujo y por eso viven en el mismo
 * archivo:
 *
 *   1. un **piso** de 400 ms desde el clic, para que una respuesta instantanea no
 *      se vea como un parpadeo;
 *   2. un **texto de carga lenta** pasado un plazo claramente mayor que una carga
 *      sana;
 *   3. los **controles que se desactivan** mientras dura;
 *   4. el **contador de peticiones**, que es lo que permite descartar una respuesta
 *      que llega tarde.
 *
 * EL CONTADOR DE PETICIONES VIAJA CON EL REGISTRO, Y NO PUEDE SEPARARSE
 *
 * Es la parte de la decision 9 que mas facil se rompe, asi que se dice aqui. El
 * numero de peticion **es la identidad** del registro: `cerrar()` compara ese
 * numero antes de apagar nada, y esa comparacion es toda la defensa contra H-1 —la
 * respuesta vieja que apaga la transicion de la carga vigente—. Si el contador se
 * quedara en el componente y el registro aqui, habria dos sitios que tendrian que
 * acordarse de avanzar al mismo ritmo, y el dia que uno se olvide el fallo no se
 * ve: la pantalla queda mintiendo, sin error de consola.
 *
 * Por eso `abrir()` **toma el numero y levanta el registro en el mismo acto**, y lo
 * devuelve. No hay forma de pedir uno sin lo otro.
 *
 * COMO SE USA
 *
 *   const transicion = crearTransicionDeCarga({ ... });
 *
 *   const miPeticion = transicion.abrir(numero);   // toma el numero y abre
 *   transicion.dibujar(numero);
 *   const respuesta = await loQueSea();
 *   if (!transicion.esLaUltima(miPeticion)) { transicion.cerrar(miPeticion); return; }
 *   await transicion.esperarElPiso();
 *   if (!transicion.esLaUltima(miPeticion)) { transicion.cerrar(miPeticion); return; }
 *   transicion.cerrar(miPeticion);
 *
 * Cada instancia lleva su propio contador y su propio registro: dos paginas
 * distintas no se pisan aunque importen el mismo archivo.
 */
import { $, esc, icon, prefersReducedMotion } from '../utils/dom.js';

/**
 * Lo que dura como minimo la transicion, contado desde el clic (decision 5).
 *
 * NO ES UNA ESPERA, ES UN PISO. Solo actua cuando la respuesta llego antes, para
 * que la transicion no se vea como un parpadeo, y **nunca alarga una carga que ya
 * tardo mas que esto**. Se aplica igual a todos los finales —dibujado, vacio,
 * error y caida a la instantanea—: una sola regla.
 */
export const PISO_DE_LA_TRANSICION_MS = 400;

/**
 * Cuanto se espera antes de decir que la carga esta tardando mas de lo normal
 * (decision 7).
 *
 * DE DONDE SALE ESTE NUMERO, que es lo unico que lo justifica:
 *
 *   - Una carga sana en produccion tarda **0,345 a 0,411 s** (decision 1, medido
 *     el 2026-09-16). Esto son mas de **seis veces** eso, asi que un modulo que
 *     llega bien no lo alcanza nunca, ni siquiera desde un telefono con datos
 *     moviles, donde lo que sube es el viaje de ida y no el cuerpo, que sigue
 *     pesando 12 a 17 KB.
 *   - La espera maxima antes de caer a la instantanea son **8 s**
 *     (servicios/datos.js). Esto es menos de un tercio, asi que quedan mas de 5 s
 *     de explicacion antes de que el sitio cambie al respaldo en vez de un
 *     silencio entero.
 *   - Y esta muy por encima del piso de 400 ms, asi que los dos nunca se cruzan:
 *     ninguna carga que termine en el piso alcanza a ver este texto.
 *
 * Se exporta para que los guiones calculen sus retrasos a partir de la MISMA
 * constante. Con un numero copiado a mano, el dia que este cambiara las pruebas
 * seguirian midiendo contra el viejo y pasarian en verde sin probar nada.
 *
 * `components/cuestionario.js` la vuelve a exportar, y no por comodidad: es de
 * donde la importa scripts/probar-filtrado.mjs desde la iteracion 35.
 */
export const PLAZO_DE_CARGA_LENTA_MS = 2500;

/**
 * Arma una transicion sobre un contenedor, con sus textos y sus controles.
 *
 * @param {object} ajustes
 * @param {string} ajustes.contenedor      Selector de la zona que se reescribe.
 * @param {string[]} [ajustes.controles]   Selectores de los controles a desactivar
 *                                         mientras dura. Vacio es legitimo: una
 *                                         pantalla puede no tener ninguno.
 * @param {string} ajustes.idDelMensaje    Id del recuadro. Es el nodo que recibe el
 *                                         foco, asi que quien llama lo necesita
 *                                         para poder ir a el.
 * @param {string} ajustes.idDelAvisoLento Id del hueco del texto de carga lenta.
 * @param {object} ajustes.textos
 * @param {(dato: string) => string} ajustes.textos.titulo
 *        Arma la primera linea. **Recibe el dato YA ESCAPADO**: el escapado se hace
 *        aqui dentro y no se delega, porque esto termina en `innerHTML` y una regla
 *        que hay que acordarse de cumplir en cada sitio que llame se rompe sola. Lo
 *        que pone quien llama son las palabras, no la seguridad.
 * @param {string} ajustes.textos.detalle  Segunda linea, fija.
 * @param {string} ajustes.textos.lento    La frase del texto de carga lenta.
 * @param {string} [ajustes.textos.iconoLento] Icono de esa frase.
 *
 * Los tres textos son literales escritos en el codigo del sitio, no datos de la
 * capa: van a `innerHTML` tal cual, igual que iban cuando estaban escritos dentro
 * del componente. El unico que viene de fuera es `dato`, y ese se escapa.
 */
export function crearTransicionDeCarga({
  contenedor,
  controles = [],
  idDelMensaje,
  idDelAvisoLento,
  textos,
}) {
  const { titulo, detalle, lento, iconoLento = 'history-edu' } = textos;

  /**
   * Cual es la peticion vigente.
   *
   * Quien usa esta transicion suele dejar libre el control que la dispara, asi que
   * puede pedirse algo nuevo mientras lo anterior todavia viaja. Sin esto, una
   * respuesta lenta del modulo 3 llegaria despues de la del 5 y dibujaria el 3
   * sobre el 5, con el indice marcando el 5. Cada llamada toma un numero y, al
   * volver del await, se retira si ya no es la ultima.
   */
  let peticionVigente = 0;

  /**
   * La carga viva, o null si no hay ninguna.
   *
   * **ES UN REGISTRO Y NO CUATRO BANDERAS, Y ESA ES TODA LA DEFENSA CONTRA H-1.**
   *
   * `mostrarModulo()` tiene cuatro salidas —el descarte de la respuesta que llega
   * tarde, el error, el modulo vacio y el final que dibuja—. Con cuatro banderas
   * sueltas eso serian dieciseis sitios donde acordarse de apagar, y basta olvidar
   * uno para que la transicion quede colgada o se apague la del modulo equivocado.
   * Con un registro son dos funciones: `abrir()` y `cerrar()`.
   *
   * Lleva dentro todo lo que hay que deshacer:
   *
   *   peticion    el numero de `peticionVigente` que lo creo. Es la identidad.
   *   dato        que se esta pidiendo.
   *   desde       cuando se pulso. De aqui sale el piso.
   *   avisoLento  el temporizador del texto de la decision 7.
   *
   * **Y lo que decide quien puede apagar es el DATO, no el sitio desde donde se
   * llama.** `cerrar()` la llaman las cuatro salidas, la del descarte incluida, y
   * esa no hace nada porque su numero de peticion ya no es el del registro:
   * `abrir()` lo reemplazo cuando el estudiante eligio el segundo modulo. Se hizo
   * asi, y no «desde la salida del descarte no se llama», porque una regla que
   * depende de acordarse de NO llamar a algo se rompe la primera vez que alguien
   * agregue una quinta salida.
   */
  let cargaEnCurso = null;

  /** Si esta carga sigue siendo la que la pantalla esta esperando. */
  const esLaCargaVigente = (miPeticion) => cargaEnCurso?.peticion === miPeticion;

  /**
   * Dice que la carga esta tardando mas de lo normal (decision 7).
   *
   * SIN NUMEROS, SIN CUENTA REGRESIVA Y SIN PROMETER CUANTO FALTA. Lo unico que se
   * sabe es que ya paso mas tiempo del que tarda una carga sana; cuanto queda no lo
   * sabe nadie, y decirlo seria el mismo numero inventado que la decision 1 descarto.
   *
   * TRES COSAS DEL COMO, Y LAS TRES SON PARTE DE LA DECISION:
   *
   * **1 · Vuelve a comprobar la identidad antes de escribir.** Es la tercera puerta
   * hacia el estado vivo, ademas de las cuatro salidas de `mostrarModulo()`: un
   * temporizador armado para una carga que ya se abandono escribiria encima de la
   * carga siguiente. `abrir()` ya lo cancela al reemplazar el registro; esta guarda
   * es el cinturon del tirante, y es la que el rojo secundario rompe.
   *
   * **2 · No reescribe el contenedor.** Escribe dentro del hueco del aviso lento,
   * que ya existe vacio desde `dibujar()`. Reescribir la zona entera destruiria el
   * recuadro, que es el nodo que tiene el foco: quien navega con teclado lo
   * perderia a mitad de la espera, y el lector de pantalla volveria a anunciar la
   * carga entera. Por eso tambien **no se toca el foco aqui**: el estudiante sigue
   * donde estaba.
   *
   * **3 · Es su propia region viva, y no anuncia la carga otra vez.** `role="status"`
   * sobre un nodo que solo contiene esta frase hace que el lector lea la frase nueva
   * —que es informacion que antes no existia— y nada mas. El titulo no se repite,
   * porque ese nodo no se toca.
   */
  function decirQueEstaTardando(miPeticion) {
    if (!esLaCargaVigente(miPeticion)) return;

    const aviso = $(`#${idDelAvisoLento}`);
    if (!aviso) return;

    aviso.innerHTML = `
          <span class="inline-flex items-start gap-2 text-left">${icon(iconoLento, 'text-base text-jsyellow shrink-0 mt-0.5')}<span>${lento}</span></span>`;

    aviso.classList.remove('hidden');
  }

  /**
   * Deja disponibles o no disponibles los controles que se le pasaron (decision 6).
   *
   * POR QUE SE DESACTIVAN, que son dos defectos reales y no una precaucion:
   *
   *   - «Reiniciar el módulo» durante la carga **no hacia nada**, sin avisar: sale
   *     por `if (!bancoCargado) return`, y durante la carga eso es cierto. Un control
   *     que se pulsa y no produce nada es el mismo «boton que miente» con el que
   *     ADR-034 justifico que reiniciar borre tambien lo guardado.
   *   - «Repasar mis errores (N)» durante la carga **borraba el «Cargando…»** y ponia
   *     «Elige un módulo en el índice…» justo despues de que el estudiante eligiera
   *     uno, y ese mensaje se quedaba encima del modulo al llegar.
   *
   * SE DESACTIVAN POR LOS DOS LADOS, y no es redundante:
   *
   *   - `disabled` es la mitad que ve y oye el estudiante. Es el atributo nativo, asi
   *     que el navegador lo anuncia como no disponible y lo saca del tabulador sin
   *     que haya que programar nada. No se le agrega `aria-disabled`: sobre un boton
   *     realmente deshabilitado es repetir lo que el navegador ya dice.
   *   - La guarda dentro del oyente es la mitad que se puede provocar desde un guion.
   *     `dom.disparar()` del DOM falso ejecuta los oyentes AUNQUE el nodo este
   *     `disabled`, porque no es un navegador: sin la guarda, «pulsarlos no cambia
   *     nada» no se podria comprobar sin creerselo. Esa mitad vive en quien registra
   *     el oyente, y mira `enCurso()`.
   *
   * Lo que NO se pasa por aqui tambien importa: el indice de modulos se queda
   * libre, y elegir otro mientras uno carga se sigue pudiendo. Es justamente lo que
   * el contador de peticiones existe para resolver bien.
   */
  function fijarControles(disponibles) {
    for (const selector of controles) {
      const boton = $(selector);
      if (!boton) continue;

      boton.disabled = !disponibles;

      // El atenuado va por clase y no por color nuevo: la paleta esta cerrada
      // (iteracion 36) y `opacity` no agrega ningun tono, solo baja el que ya hay.
      if (disponibles) boton.classList.remove('opacity-50', 'cursor-not-allowed');
      else boton.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }

  return {
    /**
     * Toma el numero de peticion y levanta el registro, en el mismo acto.
     *
     * Es el UNICO sitio que crea un registro y el UNICO que avanza el contador. Si
     * habia uno anterior lo cancela antes de reemplazarlo —su temporizador
     * incluido—, de modo que nunca hay dos vivos y ningun temporizador huerfano
     * puede escribir encima de la carga siguiente.
     *
     * Devuelve el numero de esta peticion, que es lo que hay que guardar para
     * cerrarla despues.
     */
    abrir(dato) {
      const miPeticion = (peticionVigente += 1);

      if (cargaEnCurso) window.clearTimeout(cargaEnCurso.avisoLento);

      cargaEnCurso = {
        peticion: miPeticion,
        dato,
        desde: Date.now(),
        avisoLento: null,
      };

      cargaEnCurso.avisoLento = window.setTimeout(
        () => decirQueEstaTardando(miPeticion),
        PLAZO_DE_CARGA_LENTA_MS
      );

      fijarControles(false);

      return miPeticion;
    },

    /**
     * Apaga el registro, si es el de quien llama. Devuelve si hizo algo.
     *
     * La guarda de la primera linea es H-1 entero. Ver `cargaEnCurso`.
     */
    cerrar(miPeticion) {
      if (!esLaCargaVigente(miPeticion)) return false;

      window.clearTimeout(cargaEnCurso.avisoLento);
      cargaEnCurso = null;
      fijarControles(true);

      return true;
    },

    /** Si esta peticion sigue siendo la ultima que se pidio. */
    esLaUltima: (miPeticion) => miPeticion === peticionVigente,

    /**
     * La carga viva, o null. Lo miran el panel y los oyentes de los controles.
     *
     * Devuelve una copia y no el registro: el temporizador y el numero de peticion
     * son asuntos de aqui dentro, y un componente que pudiera cancelar el uno o
     * cambiar el otro volveria a abrir la puerta que `cerrar()` cierra.
     */
    enCurso: () => (cargaEnCurso ? { dato: cargaEnCurso.dato, desde: cargaEnCurso.desde } : null),

    /**
     * Espera lo que le falte al piso, o nada si ya se cumplio.
     *
     * EL RELOJ ES EL DEL ULTIMO CLIC, y con dos modulos seguidos eso importa. Si se
     * conservara el reloj del primero, el segundo se dibujaria a los 400 ms del clic
     * del PRIMERO —o sea antes de cumplir los suyos— y el piso quedaria por debajo de
     * 400 ms justo para el modulo que el estudiante esta mirando, que es el parpadeo
     * que el piso existe para evitar. Cada `abrir()` vuelve a poner el reloj en
     * cero, asi que el techo es siempre 400 ms desde el ultimo clic, se pulse una vez
     * o seis.
     */
    async esperarElPiso() {
      if (!cargaEnCurso) return;

      const falta = PISO_DE_LA_TRANSICION_MS - (Date.now() - cargaEnCurso.desde);
      if (falta <= 0) return;

      await new Promise((listo) => window.setTimeout(listo, falta));
    },

    /**
     * Dibuja la transicion en el contenedor (decision 3).
     *
     * NINGUN NUMERO, Y ESO ES LA DECISION 1. No hay porcentaje, ni cuenta regresiva,
     * ni «faltan N preguntas». La respuesta llega por partes y sin cabecera de largo,
     * asi que el navegador no sabe cuanto pesa hasta que termina; dibujar una barra
     * que avanza igual seria inventar un numero, y este proyecto no muestra numeros
     * que no salgan de un dato —«ningun numero es mejor que un numero falso», de la
     * iteracion 24, y «sin numero hasta que sea cierto», de la 31—.
     *
     * SE REUSA EL MISMO CONTRATO QUE `dibujarMensaje()`: el `id` y el `tabindex="-1"`
     * son los mismos, de modo que `irAlMensaje()` sigue funcionando sin enterarse y el
     * foco aparcado de la iteracion 32 no cambia de sitio. Por eso el id entra por
     * parametro: es el punto de encuentro entre esta transicion y la pagina que la usa.
     *
     * EL LOGOTIPO NO SE ANIMA. La tarea original lo pedia encima de una barra; la
     * decision 3 lo deja quieto. Va con `alt` vacio porque es decorativo: lo que hay
     * que leer es el texto de al lado, y un lector de pantalla que anunciara
     * «logotipo de JavaScript» antes de «Cargando el Módulo 3» pondria el adorno
     * delante del dato.
     *
     * EL RECUADRO DEL TEXTO LENTO SE DIBUJA VACIO Y OCULTO, y no se inserta despues.
     * Son dos cosas distintas y las dos importan: una region viva tiene que EXISTIR
     * antes de que su contenido cambie para que el lector de pantalla la anuncie —es
     * lo mismo que hacen `#aviso-respaldo` y `#aviso-almacenamiento` en el HTML—, y
     * tenerlo ya puesto es lo que permite que el texto lento entre **sin reescribir el
     * contenedor**, que es lo que destruiria el nodo con el foco.
     */
    dibujar(dato) {
      const zona = $(contenedor);
      if (!zona) return;

      // Con movimiento reducido no se declara la animacion, en vez de declararla y
      // confiar en que alguien la apague. La regla de src/input.css la apagaria igual
      // —recorta la duracion a 0,01 ms—, y se deja puesta: son dos mitades del mismo
      // trato, y esta es la unica que se puede comprobar sin un navegador (decision 8).
      const latido = prefersReducedMotion() ? '' : ' animate-latido';

      // Los tres puntos salen desfasados para que se lean como una secuencia y no como
      // un parpadeo unico. El desfase va en el atributo `style` y no en una clase
      // porque son tres valores de uso unico: inventar tres utilidades para esto
      // dejaria tres reglas en el CSS que no vuelve a usar nadie.
      const punto = (retraso) => `
            <span class="w-2 h-2 rounded-full bg-jsyellow${latido}" style="animation-delay:${retraso}ms"></span>`;

      zona.innerHTML = `
      <div id="${idDelMensaje}" tabindex="-1" class="bg-panel border border-panel3 rounded-xl p-8 text-center focus:outline-none focus:ring-2 focus:ring-jsyellow/40">
        <img src="static/resources/js-logo.svg" alt="" class="w-12 h-12 mx-auto rounded-lg">
        <p class="mt-4 font-display font-bold text-paper">${titulo(esc(dato))}</p>
        <p class="mt-2 text-sm text-muted">${detalle}</p>
        <span class="mt-5 flex items-center justify-center gap-2" aria-hidden="true">${punto(0)}${punto(200)}${punto(400)}
        </span>
        <div id="${idDelAvisoLento}" class="hidden mt-5 text-sm text-paper" role="status" aria-live="polite"></div>
      </div>`;
    },
  };
}
