/**
 * Cual pestana escribe el intento (iteracion 42, decision 4).
 *
 * EL PROBLEMA, Y POR QUE AQUI SI Y EN EL CUESTIONARIO NO
 *
 * ADR-034 acepto expresamente que dos pestanas del cuestionario se pisen: «gana la
 * ultima que guarda», porque lo que se pierde es una respuesta suelta y se recupera
 * respondiendola otra vez. Aqui lo que se pierde es el intento entero. Dos pestanas
 * escribiendo `…respuestas` con posiciones distintas dejan un intento cuya posicion
 * no corresponde a sus respuestas, y en el simulacro **no se vuelve atras**: eso no
 * se recupera. Y no se nota hasta el resumen, o sea una hora despues. Esta escrito
 * en ADR-035, Parte 8.
 *
 * EL MECANISMO, CON LOS NUMEROS DEL AUTOR (2026-09-18)
 *
 *   - La pestana que abre **ultimo toma el intento**, siempre. No pide permiso: se
 *     anota como duena y la otra se entera.
 *   - La duena **renueva cada 5 segundos**.
 *   - Un arriendo sin renovar **vence a los 15 segundos**, o sea tras tres renovaciones
 *     perdidas. Es el margen que hace falta para que un telefono que estrangula los
 *     temporizadores de la pestana visible no se quite el intento a si mismo.
 *   - La pestana bloqueada **mira cada 5 segundos** si el arriendo vencio, y si vencio
 *     lo toma. Eso es lo que impide que cerrar la duena deje a la otra bloqueada para
 *     siempre.
 *
 * POR QUE `storage` Y NO `BroadcastChannel` NI `navigator.locks`
 *
 * Decision 4 de la iteracion: los dos ultimos piden Safari 15.4 o posterior, y el
 * simulacro tiene que funcionar en navegadores moviles antiguos. `storage` es
 * universal. Lo que cuesta es que `storage` no avisa a quien escribio —solo a las
 * otras pestanas—, asi que la duena **no puede enterarse por el evento de que sigue
 * siendo la duena**: lo sabe porque es ella quien escribe.
 *
 * POR QUE UNA CLAVE APARTE, Y NO UN CAMPO DENTRO DE `…respuestas`
 *
 * Dos motivos, los dos de ADR-035 Parte 8. El arriendo se renueva cada 5 segundos y
 * dentro de `…respuestas` cada latido reescribiria 12,7 KiB. Y `storage` dispara por
 * clave: un oyente sobre una clave que tambien cambia al responder no podria
 * distinguir «la otra pestana tomo el intento» de «la otra pestana respondio».
 *
 * SIN INTENTO GUARDADO NO HAY NADA QUE COORDINAR, Y NO SE ESCRIBE NADA
 *
 * Un navegador que no guarda —o uno en el que la copia congelada no cupo— no tiene
 * intento compartido que dos pestanas puedan estropear: cada una vive en su memoria y
 * se pierde al recargar, que es lo que el aviso de la iteracion 41 ya dice. Ahi esta
 * pestana se declara duena **en memoria, sin escribir la clave**, y no bloquea a
 * nadie. Bloquear seria quitarle el simulacro a alguien para proteger un dato que no
 * existe.
 *
 * Y no escribir tampoco es un detalle de limpieza. La regla de ADR-035 es que bajo
 * `examen-td-js.simulacro.` **nunca queda media cosa**: si la copia congelada no se
 * pudo guardar, no puede quedar ni una clave del simulacro en el almacen. Un arriendo
 * suelto sin intento detras es exactamente eso. Lo encontro
 * `scripts/probar-memoria.mjs` el 2026-09-18, en los dos casos que ya vigilaba: el
 * almacen sin sitio para los 76,8 KiB, y «Empezar otro intento» cuando el siguiente
 * no se puede armar.
 */
import { almacenDelNavegador } from './memoria.js';
import { reloj } from './reloj.js';

/** La tercera clave del simulacro, la que ADR-035 Parte 8 reservo. */
export const CLAVE_DUENO = 'examen-td-js.simulacro.dueno';

/** Cada cuanto la duena dice que sigue viva. */
export const RENUEVA_CADA_MS = 5000;

/** Cuanto aguanta un arriendo sin renovar antes de darse por vencido. */
export const VENCE_A_LOS_MS = 15000;

const VERSION = 1;

/**
 * Un nombre para esta pestana.
 *
 * No identifica a nadie ni sale del dispositivo: solo distingue «yo» de «la otra».
 * Sin `crypto.randomUUID()` por lo mismo que el id del intento: navegadores antiguos.
 */
const nuevoNombreDePestana = () =>
  `p-${reloj().ahora().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** Lee el arriendo guardado, o null si no hay o no se entiende. */
function leerElArriendo(donde) {
  let crudo;

  try {
    crudo = donde.getItem(CLAVE_DUENO);
  } catch {
    return null;
  }

  if (!crudo) return null;

  let dato;

  try {
    dato = JSON.parse(crudo);
  } catch {
    return null;
  }

  if (!dato || dato.v !== VERSION) return null;
  if (typeof dato.pestana !== 'string' || !Number.isInteger(dato.visto_en)) return null;

  return dato;
}

/**
 * Coordina esta pestana con las demas.
 *
 * @param {object} avisos
 * @param {() => void} avisos.alPerderElIntento  otra pestana lo tomo: bloquearse
 * @param {() => void} avisos.alRecuperarElIntento  el arriendo de la otra vencio
 */
export function crearDuenoDelIntento({ alPerderElIntento, alRecuperarElIntento } = {}) {
  const yo = nuevoNombreDePestana();

  let soyDueno = false;
  let pase = null;
  let andando = false;

  const donde = almacenDelNavegador();

  /** Escribe el arriendo a mi nombre. Devuelve si se pudo. */
  const anotarme = () => {
    try {
      donde.setItem(
        CLAVE_DUENO,
        JSON.stringify({ v: VERSION, pestana: yo, visto_en: reloj().ahora() })
      );
      return true;
    } catch {
      // El almacen se lleno o se nego. No se bloquea a nadie por eso: es el mismo
      // criterio que «sin almacen no hay nada que coordinar», y el aviso de que el
      // intento no se esta guardando ya lo dice la iteracion 41 por su cuenta.
      return false;
    }
  };

  /** Si el arriendo que hay guardado esta vencido o es mio. */
  const puedoTomarlo = () => {
    const arriendo = leerElArriendo(donde);
    if (!arriendo) return true;
    if (arriendo.pestana === yo) return true;

    return reloj().ahora() - arriendo.visto_en >= VENCE_A_LOS_MS;
  };

  /**
   * El latido. Hace dos cosas distintas segun de que lado este.
   *
   * De duena: renovar. De bloqueada: mirar si el arriendo vencio, y tomarlo si si.
   * Es un solo temporizador y no dos porque el estado cambia de uno a otro y dos
   * temporizadores que se encienden y se apagan solos son dos sitios donde dejarse
   * uno colgado.
   */
  const latir = () => {
    if (!andando) return;

    if (soyDueno) {
      const arriendo = leerElArriendo(donde);

      // Alguien me lo quito mientras tanto y el evento `storage` no llego —o esta
      // pestana estaba en segundo plano—. Se comprueba al renovar, que es el unico
      // momento en que se puede saber sin que nadie avise.
      if (arriendo && arriendo.pestana !== yo) {
        soyDueno = false;
        alPerderElIntento?.();
      } else {
        anotarme();
      }
    } else if (puedoTomarlo()) {
      soyDueno = anotarme();
      if (soyDueno) alRecuperarElIntento?.();
    }

    // Se comprueba otra vez, y no es redundante: `alPerderElIntento` y
    // `alRecuperarElIntento` pueden haber llamado a `detener()` mientras corrian, y
    // citarse igual dejaria un temporizador vivo de un arriendo ya apagado.
    if (andando) pase = reloj().alCabo(RENUEVA_CADA_MS, latir);
  };

  /** La otra pestana escribio la clave del dueno. */
  const alLlegarElEvento = (evento) => {
    if (!andando || evento?.key !== CLAVE_DUENO) return;

    const arriendo = leerElArriendo(donde);

    // Se borro la clave: la otra pestana solto el intento al cerrarse limpiamente.
    // Se toma enseguida, sin esperar los 15 segundos.
    if (!arriendo) {
      if (!soyDueno && puedoTomarlo()) {
        soyDueno = anotarme();
        if (soyDueno) alRecuperarElIntento?.();
      }
      return;
    }

    if (arriendo.pestana === yo) return;

    // Hay otra duena, y acaba de anotarse. La ultima que abre gana, asi que esta se
    // bloquea. Que el evento llegue significa que fue OTRA quien escribio: el
    // navegador no se lo entrega a quien lo provoco, y el almacen de mentira tampoco.
    if (soyDueno) {
      soyDueno = false;
      alPerderElIntento?.();
    }
  };

  return {
    /**
     * Toma el intento. La que abre ultimo gana, asi que esto no pregunta.
     *
     * `hayIntentoGuardado` dice si hay algo que proteger. En `false` —no hay almacen,
     * o la copia congelada no cupo— se declara duena en memoria y **no escribe nada**:
     * ni la clave, ni el oyente, ni el latido.
     */
    tomar({ hayIntentoGuardado = true } = {}) {
      andando = true;

      if (!donde || !hayIntentoGuardado) {
        soyDueno = true;
        return true;
      }

      soyDueno = anotarme();

      globalThis.window?.addEventListener?.('storage', alLlegarElEvento);
      pase = reloj().alCabo(RENUEVA_CADA_MS, latir);

      return soyDueno;
    },
    /**
     * Suelta el intento y borra la clave, si es mia.
     *
     * Lo llama quien abandona el intento a proposito —«Empezar otro intento»—, junto
     * con `olvidarElIntento()`. **Solo borra si soy la duena**: borrar el arriendo de
     * la OTRA pestana seria exactamente el destrozo que todo esto evita.
     */
    soltar() {
      if (!soyDueno || !donde) return;

      soyDueno = false;

      try {
        donde.removeItem(CLAVE_DUENO);
      } catch {
        // Un almacen que no deja borrar deja una clave suelta y nada mas: la proxima
        // pestana que abra la va a pisar igual, porque la ultima que abre gana.
      }
    },
    /** Si esta pestana es la que puede escribir. */
    soyElDueno: () => soyDueno,
    /** El nombre de esta pestana. Para poder afirmarlo desde una prueba. */
    nombre: () => yo,
    /**
     * Deja de coordinar. No borra la clave a proposito: quien llama a esto es la
     * pestana que se bloqueo, y borrar el arriendo de la OTRA seria justo el
     * destrozo que todo esto existe para evitar.
     */
    detener() {
      andando = false;
      if (pase !== null) reloj().cancelar(pase);
      pase = null;
    },
  };
}
