/**
 * El intento del simulacro: elegir, traer y decir que quedo listo.
 *
 * QUE HACE ESTE ARCHIVO, Y QUE NO
 *
 * Son las etapas B y C de la iteracion 41. Conecta «Comenzar el simulacro» con la
 * maquina que la iteracion deja montada: pide la lista de ids, elige las 120 en el
 * navegador, las viene a buscar, repone lo que falte, **las guarda congeladas** y
 * termina en un aviso **«Intento listo»** (decision 11). Al abrir la pagina con un
 * intento a medias, lo retoma desde lo guardado.
 *
 * **Todavia no dibuja ni una pregunta.** El recorrido —una pregunta a la vez, con
 * su reloj— es de las iteraciones 42 y 43, y adelantarlo aqui significaria escribir
 * dos veces el dibujo de una pregunta. Por eso el aviso dice cuantas trajo y de que
 * modulos, y **ningun texto del banco**: lo que se puede comprobar hoy es que el
 * intento se armo, no como se ve.
 *
 * QUE SE GUARDA, Y QUIEN LO GUARDA
 *
 * El formato y las claves viven en `servicios/intento-guardado.js`, no aqui: este
 * archivo no sabe cuantas claves son ni como se llaman. Lo que si decide aqui es
 * **cuando** —al armarse el intento, antes de dibujarlo— y **que se dice** si no se
 * pudo, que es el aviso de la decision 7.
 *
 * TODO SE PIDE AL PULSAR, Y BAJO UNA SOLA TRANSICION (decision 5)
 *
 * La presentacion no pide nada: es HTML, y mientras el estudiante lee las reglas no
 * sale ni una peticion. Al pulsar salen dos —el resumen y el extremo por ids— y las
 * dos van **debajo de la misma transicion**: `abrir()` se llama UNA vez, no una por
 * peticion. Si se llamara una por peticion, el estudiante veria dos transiciones
 * encadenadas con un parpadeo entre medio y el piso de 400 ms se contaria dos
 * veces.
 *
 * EL MODO DEGRADADO NO ES OTRO CAMINO
 *
 * `leerResumen()` y `leerPreguntasPorIds()` caen solas a la instantanea cuando la
 * capa de datos no responde, y devuelven la misma forma. El algoritmo recibe ids y
 * no sabe de donde salieron. Lo unico que cambia aqui es que se mira el sello del
 * respaldo para encender el aviso de ADR-008: **el respaldo nunca se sirve en
 * silencio.**
 *
 * PERO UN INTENTO NO MEZCLA BANCOS (correccion del 2026-09-17)
 *
 * Que cada peticion caiga por su cuenta sirve para el cuestionario, donde una
 * peticion trae una pantalla. Aqui son dos, y estan atadas: de la primera salen los
 * ids y la segunda los va a buscar. Si el resumen contesta desde D1 y la peticion de
 * preguntas cae a la copia, **los ids se eligieron sobre un banco y se piden a
 * otro**. Hoy los dos bancos coinciden y no se nota; el dia que no coincidan, los
 * elegidos —y los sobrantes de donde salen las reservas— apuntan a preguntas que la
 * copia no trae, y el intento termina en «No se pudo armar el simulacro» justo
 * cuando el respaldo tenia que salvarlo.
 *
 * La regla es una sola y esta escrita abajo, en `comenzarElIntento()`: **si alguna
 * mitad sale de la copia, el intento entero se vuelve a elegir desde la copia.**
 * Vale igual para la primera peticion y para una ronda de reserva que caiga a mitad
 * de camino. El algoritmo sigue sin enterarse de nada: lo unico que cambia es de
 * donde salen los ids que recibe.
 */
import { $, esc } from '../utils/dom.js';
import {
  leerPreguntasPorIds,
  leerPreguntasPorIdsDelRespaldo,
  leerResumen,
  leerResumenDelRespaldo,
} from '../servicios/datos.js';
import {
  FALTA_MODULO,
  MODULOS_DEL_EXAMEN,
  PREGUNTAS_DEL_INTENTO,
  SIN_CANDIDATOS,
  elegirIntento,
  reponerDelModulo,
} from '../servicios/eleccion-del-intento.js';
import {
  estadoDelGuardado,
  guardarAvance,
  guardarIntentoNuevo,
  leerIntentoGuardado,
  olvidarElIntento,
} from '../servicios/intento-guardado.js';
import { crearTransicionDeCarga } from './transicion-de-carga.js';
import { mostrarAvisoDeRespaldo } from './aviso-de-respaldo.js';
import { mostrarAvisoDeGuardado } from './aviso-de-guardado.js';

/**
 * Cuantas veces se sale a reponer antes de rendirse (decision 4).
 *
 * Reponer es pedir otra tanda al extremo, asi que cada ronda es un viaje mas con el
 * estudiante mirando la transicion. Tres es de sobra para lo que esto cubre —alguna
 * pregunta retirada entre el resumen y la peticion, alguna descartada por la
 * validacion— y a la vez es un tope: sin el, un banco alterado que descartara todo
 * lo que se pide dejaria la transicion girando para siempre, que es peor que decir
 * que no se pudo.
 */
const RONDAS_DE_RESERVA = 3;

/**
 * De donde salio cada mitad de lo que se cargo.
 *
 * Son dos peticiones y cualquiera de las dos puede haber caido a la copia por su
 * cuenta. Es lo mismo que hace `components/cuestionario.js` y por el mismo motivo:
 * el aviso tiene que aparecer si **alguna** lo hizo.
 */
const origen = { resumen: null, preguntas: null };

/**
 * El intento que se esta jugando ahora, en memoria.
 *
 * Es lo mismo que hay guardado, y existe por dos motivos. Uno: sin almacenamiento no
 * hay nada guardado, y el intento tiene que poder jugarse igual toda la visita —es
 * la decision 7, y es la misma idea que la «memoria de la visita» de ADR-034—. Dos:
 * releer 77 KiB del almacen en cada respuesta para agregarle una entrada seria
 * pagar un parseo entero por cada toque.
 *
 * `null` mientras no haya intento. No sobrevive a una recarga, y no tiene por que:
 * lo que sobrevive es lo guardado.
 */
let elIntento = null;

/**
 * Los dos bancos de los que puede salir un intento, cada uno con sus dos lecturas.
 *
 * Se nombran como pareja a proposito: lo que la correccion del 2026-09-17 protege es
 * justamente que las dos mitades salgan de la MISMA. Separarlas en cuatro funciones
 * sueltas es lo que permitio mezclarlas sin que se viera.
 *
 * `DESDE_LA_CAPA.preguntas` sigue cayendo sola a la copia si la capa no contesta:
 * eso no se toca, es ADR-008. Lo que se agrega es que despues de esa caida el
 * intento se rehace entero desde `DESDE_LA_COPIA`.
 */
const DESDE_LA_CAPA = { resumen: leerResumen, preguntas: leerPreguntasPorIds };
const DESDE_LA_COPIA = {
  resumen: leerResumenDelRespaldo,
  preguntas: leerPreguntasPorIdsDelRespaldo,
};

/**
 * Las preguntas salieron de la copia y el resumen no: los ids se eligieron sobre un
 * banco y se estan pidiendo a otro.
 *
 * El caso contrario —resumen de la copia, preguntas de la capa— no se pregunta
 * porque no puede ocurrir: `unIntentoDe()` le pide las preguntas a la copia en
 * cuanto el resumen vino de ahi.
 */
const seMezclaronLosBancos = () => Boolean(origen.preguntas) && !origen.resumen;

/**
 * Lo que devuelve `armarElIntento()` al detectar la mezcla.
 *
 * No trae `explicacion` a proposito: **no es un fracaso que se le cuente a nadie**,
 * es un aviso interno de que hay que rehacer el intento desde la copia. Si algun dia
 * se dibujara por descuido, la pantalla quedaria sin frase y se veria; con una frase
 * puesta, se veria un mensaje de error donde en realidad no hubo ninguno.
 */
const HAY_MEZCLA = { ok: false, mezcla: true };

/**
 * La transicion de esta pagina.
 *
 * `#zona-del-intento` es la parte de la pagina que se reescribe: la presentacion
 * entera. El `#aviso-respaldo` queda FUERA a proposito, un nivel mas arriba en el
 * HTML, porque si estuviera dentro la transicion lo borraria justo en el caso en
 * que hace falta.
 *
 * El unico control que se desactiva es «Comenzar»: es el unico que hace algo, y
 * pulsarlo dos veces pediria dos intentos.
 */
const transicion = crearTransicionDeCarga({
  contenedor: '#zona-del-intento',
  controles: ['#comenzar-simulacro'],
  idDelMensaje: 'mensaje-simulacro',
  idDelAvisoLento: 'carga-lenta-simulacro',
  textos: {
    titulo: () => 'Preparando tu simulacro…',
    detalle: 'Eligiendo tus 120 preguntas y pidiéndolas al banco.',
    lento: 'Está tardando más de lo normal. La página sigue esperando la respuesta.',
  },
});

/**
 * Lleva el foco al recuadro que se acaba de dibujar.
 *
 * Es el mismo gesto que hace el cuestionario desde la iteracion 32: quien navega
 * con teclado o con lector de pantalla pulso un boton arriba y el resultado aparece
 * abajo; sin mover el foco, se queda en un boton que ya no existe.
 */
function irAlMensaje() {
  $('#mensaje-simulacro')?.focus();
}

/**
 * Un recuadro con un titulo y un cuerpo, en la zona del intento.
 *
 * Reusa el contrato de la transicion —mismo id, mismo `tabindex="-1"`, mismo
 * recuadro— para que el foco no dependa de cual de los dos dibujo. El cuerpo llega
 * como HTML ya armado por quien llama, y quien llama solo pone texto del sitio o
 * numeros: por aqui no pasa nada del banco.
 */
function dibujarRecuadro({ titulo, cuerpo }) {
  const zona = $('#zona-del-intento');
  if (!zona) return;

  // `data-papel` dice QUE ES cada nodo, no como se ve. Los guiones leen el HTML
  // dibujado por esta marca y no por sus clases: una prueba no puede dictar la
  // apariencia, porque entonces cambiar un tamano de letra da rojo sin que nada se
  // haya roto, y se aprende a editar la prueba hasta que pase. La iteracion 45
  // reescribe estas clases enteras; el papel del nodo sigue siendo el mismo.
  zona.innerHTML = `
      <div id="mensaje-simulacro" tabindex="-1" class="bg-panel border border-panel3 rounded-xl p-8 focus:outline-none focus:ring-2 focus:ring-jsyellow/40">
        <p data-papel="titulo-del-recuadro" class="font-display font-bold text-xl text-paper">${titulo}</p>
        ${cuerpo}
      </div>`;

  irAlMensaje();
}

/**
 * «Intento listo» (decision 11).
 *
 * DICE UN NUMERO QUE SALE DE CONTAR, no de la cuota que se pidio. Es la misma regla
 * de la iteracion 31 —«sin numero hasta que sea cierto»—: si una reserva no hubiera
 * alcanzado, escribir 17 porque 17 es lo que tocaba seria exactamente el «105
 * preguntas» que ya mintio una vez. Aqui se cuenta lo que llego.
 *
 * NO DIBUJA NI UNA PALABRA DEL BANCO. Ni enunciados, ni alternativas, ni los
 * titulos de los modulos —que tambien salen de la base—. Solo numeros de modulo y
 * cuentas. Cuando la 43 dibuje las preguntas de verdad, ahi entra `probar:escapado`
 * a vigilar ese HTML; hoy no hay nada que vigilar, y decirlo es mas honesto que
 * dibujar media pregunta para tener algo que probar.
 */
function dibujarIntentoListo(preguntas, { retomado = false } = {}) {
  const cuantasDe = (modulo) => preguntas.filter((p) => p.modulo === modulo).length;

  const filas = MODULOS_DEL_EXAMEN.map(
    (modulo) => `
          <li class="flex items-baseline justify-between gap-4 border-b border-panel3 py-2 last:border-b-0">
            <span class="font-display font-semibold text-paper text-sm">Módulo ${esc(modulo)}</span>
            <span data-cuenta-del-modulo="${esc(modulo)}" class="font-mono text-sm text-jsyellow">${esc(cuantasDe(modulo))}</span>
          </li>`
  ).join('');

  // El boton de abajo existe por una razon sencilla: sin recorrido todavia, un
  // intento retomado seria un callejon sin salida. Lleva el mismo id que «Comenzar»
  // porque hace lo mismo —armar un intento— y porque el oyente vive en la zona.
  const pie = retomado
    ? `
        <div class="mt-6">
          <button id="comenzar-simulacro" type="button" class="inline-flex items-center gap-2 border border-panel3 text-paper font-display font-bold text-sm px-5 py-3 rounded hover:border-jsyellow transition-colors">Empezar otro intento</button>
        </div>`
    : '';

  const entrada = retomado
    ? `Retomamos el intento que tenías a medias, con las mismas <strong class="font-semibold text-paper">${esc(preguntas.length)} preguntas</strong> y en el mismo orden. Todavía no se puede responder: el recorrido con el reloj llega en una versión próxima.`
    : `Se eligieron <strong class="font-semibold text-paper">${esc(preguntas.length)} preguntas</strong> y ya están cargadas. Todavía no se puede responder: el recorrido con el reloj llega en una versión próxima.`;

  dibujarRecuadro({
    titulo: retomado ? 'Intento retomado' : 'Intento listo',
    cuerpo: `
        <p class="mt-3 text-sm text-muted leading-relaxed">${entrada}</p>
        <ul class="mt-5">${filas}
        </ul>${pie}`,
  });
}

/**
 * El intento no pudo empezar, y la pantalla lo explica (decision 4).
 *
 * SE DICE POR QUE, Y SIN TECNICISMOS. El estudiante no tiene que saber que existe un
 * banco de preguntas por modulo ni que hay preguntas hermanas: lo que necesita saber
 * es que no fue culpa suya, que no hay nada que arreglar de su lado y que puede
 * volver a intentarlo. El codigo del motivo no se imprime.
 *
 * Y NO SE EMPIEZA A MEDIAS. Un intento de 113 preguntas seria peor que ninguno: el
 * 60 % de aprobacion esta calculado sobre 120, asi que el resultado que diera no
 * significaria nada y nada en la pantalla lo diria.
 */
function dibujarNoSePudo(explicacion) {
  dibujarRecuadro({
    titulo: 'No se pudo armar el simulacro',
    cuerpo: `
        <p class="mt-3 text-sm text-muted leading-relaxed">${explicacion}</p>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button id="comenzar-simulacro" type="button" class="inline-flex items-center gap-2 bg-jsyellow text-ink font-display font-bold text-sm px-6 py-3 rounded hover:bg-jsyellowdim transition-colors">Volver a intentarlo</button>
          <a href="cuestionario.html" class="inline-flex items-center gap-2 border border-panel3 text-paper font-display font-bold text-sm px-5 py-3 rounded hover:border-jsyellow transition-colors">Practicar sin reloj</a>
        </div>`,
  });
}

/**
 * Trae las preguntas de una lista de ids y las deja indexadas por id.
 *
 * Devuelve `null` si la peticion fallo del todo —ni base ni copia—, que es distinto
 * de que volvieran menos de las pedidas. Lo primero es que no hay de donde sacar
 * nada; lo segundo es lo que las reservas existen para tapar.
 */
async function traer(ids, pedir) {
  const respuesta = await pedir(ids);
  if (!respuesta.ok) return null;

  // Cualquiera de las dos peticiones puede caer a la copia por su cuenta, asi que se
  // anota el sello de esta sin pisar el de la otra.
  origen.preguntas = respuesta.meta?.respaldo ?? origen.preguntas;

  return new Map((respuesta.datos ?? []).map((pregunta) => [pregunta.id, pregunta]));
}

/**
 * Arma el intento entero: elegir, traer y reponer hasta 120.
 *
 * Devuelve `{ ok: true, preguntas }` con las 120 preguntas enteras y **en el orden
 * del intento**, o `{ ok: false, explicacion }` con la frase que va a leer el
 * estudiante. Devuelve las preguntas y no sus ids porque a partir de la etapa C hay
 * que guardarlas congeladas: volver a pedirlas para guardarlas seria un viaje mas
 * para traer lo que ya se tenia en la mano.
 *
 * `pedir` es de donde se traen las preguntas —la capa o la copia—, y entra por
 * parametro por el mismo motivo por el que el azar entra por parametro en el
 * algoritmo: asi esta funcion no tiene que saber cual de los dos bancos le toco, y
 * quien la llama no puede equivocarse a medias. Ver la regla del mismo banco en la
 * cabecera del archivo.
 *
 * EL ORDEN DEL INTENTO SE RESPETA AL REPONER. Las 120 llegan ya barajadas entre
 * modulos desde `elegirIntento()`, y esta funcion trabaja sobre **ranuras**: lo que
 * no vuelve deja su sitio vacio y la reserva entra en ese mismo sitio. Ver el bucle.
 */
async function armarElIntento(idsPorModulo, pedir) {
  const eleccion = elegirIntento({ idsPorModulo });

  // Los dos motivos se separan porque al estudiante le dicen cosas distintas: uno es
  // «el banco contesto incompleto» y el otro «el banco contesto y no alcanza». La
  // rama final no es defensiva de adorno: si algun dia apareciera un motivo nuevo y
  // esto siguiera de largo, se pediria `eleccion.ids` sin que exista.
  if (!eleccion.ok) {
    if (eleccion.motivo === FALTA_MODULO) {
      return {
        ok: false,
        explicacion: `El banco no entregó preguntas del módulo ${esc(eleccion.modulo)}, así que no se puede armar un simulacro completo. Vuelve a intentarlo en un rato.`,
      };
    }

    return {
      ok: false,
      explicacion:
        eleccion.motivo === SIN_CANDIDATOS
          ? `Ahora mismo no hay suficientes preguntas disponibles en el módulo ${esc(eleccion.modulo)} para armar un simulacro completo de ${esc(PREGUNTAS_DEL_INTENTO)} preguntas. Vuelve a intentarlo en un rato.`
          : 'No se pudo armar un simulacro completo con las preguntas disponibles. Vuelve a intentarlo en un rato.',
    };
  }

  const traidas = await traer(eleccion.ids, pedir);

  // Se corta AQUI y no al final. Seguir seria gastar las tres rondas de reserva
  // —tres viajes mas, con el estudiante mirando la transicion— reponiendo sobre
  // ids que ya se sabe que salieron del banco equivocado, para tirar el resultado
  // igual. Provocado el 2026-09-17: cortando al final, las tres rondas se gastaban
  // enteras antes de rehacer el intento.
  if (seMezclaronLosBancos()) return HAY_MEZCLA;

  if (!traidas) {
    return {
      ok: false,
      explicacion:
        'No se pudieron traer las preguntas del simulacro. Revisa tu conexión y vuelve a intentarlo.',
    };
  }

  // LAS 120 RANURAS, EN EL ORDEN DEL INTENTO.
  //
  // `eleccion.ids` ya viene barajado entre modulos, y ese es el orden en que el
  // estudiante va a responder. Reponer no lo puede alterar: una pregunta que no
  // volvio deja su ranura vacia, y la reserva **entra en esa misma ranura**. Si las
  // reservas se agregaran al final, un intento con nueve descartes traeria las nueve
  // reposiciones juntas al terminar, que es justo el agrupamiento que barajar viene a
  // evitar.
  const moduloDe = new Map();
  for (const modulo of MODULOS_DEL_EXAMEN) {
    for (const id of eleccion.porModulo[modulo]) moduloDe.set(id, modulo);
  }

  const ranuras = eleccion.ids.map((id) => ({
    modulo: moduloDe.get(id),
    pregunta: traidas.get(id) ?? null,
  }));

  // Las rondas de reposicion. En el camino sano no entra ninguna: no hay ranuras
  // vacias y el bucle termina en la primera vuelta.
  for (let ronda = 0; ronda < RONDAS_DE_RESERVA; ronda += 1) {
    const vacias = ranuras.filter((ranura) => ranura.pregunta === null);
    if (vacias.length === 0) break;

    // Se pide POR MODULO y no en monton porque lo que hay que reponer es la CUOTA de
    // cada modulo, no el total: reponer seis preguntas de donde sea dejaria 120 en
    // total y 14 de un modulo. Los ids de todas las reservas de una ronda si viajan
    // juntos, en una sola peticion.
    const pedidos = [];

    for (const modulo of MODULOS_DEL_EXAMEN) {
      const suyas = vacias.filter((ranura) => ranura.modulo === modulo);
      if (suyas.length === 0) continue;

      const repuestos = reponerDelModulo(eleccion.reservas, modulo, suyas.length);
      repuestos.forEach((id, i) => pedidos.push({ ranura: suyas[i], id }));
    }

    if (pedidos.length === 0) break;

    const masTraidas = await traer(pedidos.map((p) => p.id), pedir);

    // Una ronda de reserva que cae a la copia mezcla igual que la primera peticion:
    // las 111 que ya llegaron son de D1 y estas nueve serian de la copia. Misma
    // regla, mismo corte.
    if (seMezclaronLosBancos()) return HAY_MEZCLA;

    if (!masTraidas) break;

    for (const { ranura, id } of pedidos) {
      const pregunta = masTraidas.get(id);
      if (pregunta) ranura.pregunta = pregunta;
    }
  }

  const preguntas = ranuras
    .filter((ranura) => ranura.pregunta !== null)
    .map((ranura) => ranura.pregunta);

  if (preguntas.length < PREGUNTAS_DEL_INTENTO) {
    return {
      ok: false,
      explicacion: `Solo se pudieron reunir ${esc(preguntas.length)} preguntas de las ${esc(PREGUNTAS_DEL_INTENTO)} que necesita un simulacro, así que no tiene sentido empezarlo a medias. Vuelve a intentarlo en un rato.`,
    };
  }

  return { ok: true, preguntas };
}

/**
 * Un intento completo pedido a UN solo banco: su resumen y sus preguntas.
 *
 * Deja anotado en `origen` de donde salio cada mitad, que es lo que despues mira la
 * regla del mismo banco y lo que enciende el aviso de ADR-008.
 *
 * SI EL RESUMEN YA VINO DE LA COPIA, LAS PREGUNTAS NO SE LE PIDEN A LA CAPA.
 *
 * Es la misma regla mirada desde el otro lado, y ahorra ademas un viaje: la capa
 * acaba de no contestar el resumen, asi que pedirle las preguntas es gastar la
 * espera del estudiante en un servicio que ya se sabe caido —y, si contestara,
 * seria justo la mezcla al reves: ids elegidos sobre la copia pedidos a D1—.
 */
async function unIntentoDe(fuente) {
  origen.resumen = null;
  origen.preguntas = null;

  const resumen = await fuente.resumen();
  origen.resumen = resumen.meta?.respaldo ?? null;

  if (!resumen.ok) {
    return {
      ok: false,
      explicacion:
        'No se pudo consultar el banco de preguntas. Revisa tu conexión y vuelve a intentarlo.',
    };
  }

  const pedir = origen.resumen ? DESDE_LA_COPIA.preguntas : fuente.preguntas;

  return armarElIntento(
    Object.fromEntries(
      (resumen.datos ?? []).map((fila) => [fila.modulo, fila.preguntas_ids ?? []])
    ),
    pedir
  );
}

/**
 * Lo que pasa al pulsar «Comenzar el simulacro».
 *
 * Se exporta para que `scripts/probar-filtrado.mjs` pueda provocarlo sin fingir un
 * clic: lo que se prueba es lo que hace el boton, y un guion que reimplementara
 * estos pasos estaria probando su propia copia.
 *
 * EL ORDEN DE LAS GUARDAS ES EL DE LA ITERACION 35, y no es decorativo:
 *
 *   1. se toma el numero de peticion y se abre el registro, en un solo acto;
 *   2. se dibuja la transicion;
 *   3. se pide;
 *   4. si las dos mitades no salieron del mismo banco, se vuelve a pedir entero a
 *      la copia (la regla del mismo banco, en la cabecera del archivo);
 *   5. **antes de dibujar**, se comprueba que esta sigue siendo la ultima peticion;
 *   6. se espera el piso de 400 ms;
 *   7. se vuelve a comprobar, porque durante el piso pudo pulsarse otra vez;
 *   8. se cierra y se dibuja.
 *
 * Los pasos 5 y 7 son H-1 entero: sin ellos, una respuesta lenta apagaria la
 * transicion de una carga posterior y dibujaria encima de ella.
 *
 * EL PASO 4 VA DENTRO DE LA MISMA TRANSICION, y no es un detalle: es la segunda
 * mitad de la misma carga, no una carga nueva. `abrir()` se sigue llamando UNA vez,
 * el piso de 400 ms se sigue midiendo desde el clic una sola vez, y el estudiante
 * ve una transicion y no dos encadenadas.
 */
export async function comenzarElIntento() {
  // Pulsar durante la carga no hace nada. `disabled` ya lo impide en el navegador;
  // esta guarda es la mitad que se puede provocar desde un guion, porque el DOM
  // falso ejecuta los oyentes aunque el nodo este deshabilitado.
  if (transicion.enCurso()) return;

  // El instante del clic, no el de despues de la carga. Es lo que la iteracion 42 va
  // a usar como origen del tiempo transcurrido, y tomarlo al terminar de cargar le
  // regalaria al estudiante los segundos que tardo el banco en contestar.
  const empezadoEn = Date.now();

  // Y se olvida lo guardado ANTES de pedir nada. Si el estudiante pulsa «Empezar otro
  // intento» y la carga falla, lo que no puede quedar es el intento anterior en el
  // almacen y la pantalla diciendo que no se pudo armar ninguno: al recargar volveria
  // uno que la pantalla ya habia dado por perdido.
  olvidarElIntento();

  const miPeticion = transicion.abrir('el intento');
  transicion.dibujar('');

  // Primera pasada, contra la capa de datos.
  let resultado = await unIntentoDe(DESDE_LA_CAPA);

  // LA REGLA DEL MISMO BANCO.
  //
  // `armarElIntento()` corto al ver que las preguntas venian de la copia y el
  // resumen no: los ids se eligieron sobre D1 y se pidieron a la instantanea. Da
  // igual en que momento se detecto —en la primera peticion o en una ronda de
  // reserva a mitad de camino—: la marca es la misma y se atiende igual.
  //
  // Lo que se hace NO es completar lo que falta: es **volver a elegir el intento
  // entero** desde la copia. Completar dejaria dentro las preguntas que ya habian
  // llegado de D1, y un intento con dos bancos adentro es exactamente lo que esto
  // existe para impedir. Elegir de nuevo cuesta una eleccion mas —trabajo de
  // milisegundos, sin red— y devuelve un intento entero de un solo origen.
  if (resultado.mezcla) {
    resultado = await unIntentoDe(DESDE_LA_COPIA);
  }

  if (!transicion.esLaUltima(miPeticion)) {
    transicion.cerrar(miPeticion);
    return;
  }

  await transicion.esperarElPiso();

  if (!transicion.esLaUltima(miPeticion)) {
    transicion.cerrar(miPeticion);
    return;
  }

  transicion.cerrar(miPeticion);

  // SE GUARDA ANTES DE DIBUJAR, y ese orden importa. El aviso de que el intento no se
  // esta guardando tiene que poder salir junto con «Intento listo» y no un instante
  // despues: quien lee la pantalla de arriba abajo se entera de que esto no sobrevive
  // a una recarga antes de ponerse a responder, que es cuando todavia sirve saberlo.
  //
  // Se guarda al OCURRIR y no al salir (decision 6): no hay `beforeunload` ni
  // `pagehide` en este sitio, y la memoria de un intento de una hora no puede depender
  // de que el estudiante salga por una puerta concreta.
  if (resultado.ok) {
    elIntento = {
      preguntas: resultado.preguntas,
      respuestas: [],
      posicion: 0,
      comenzada_en: empezadoEn,
    };

    guardarIntentoNuevo(resultado.preguntas, empezadoEn);
  }

  // El aviso del respaldo se enciende ANTES de dibujar el resultado, para que quien
  // lea la pantalla de arriba abajo se entere de que esto sale de una copia antes de
  // leer lo que la copia dio.
  mostrarAvisoDeRespaldo({
    sello: origen.resumen ?? origen.preguntas,
    loQueSeCargo: 'el simulacro',
  });

  mostrarAvisoDeGuardado({ estado: estadoDelGuardado() });

  if (resultado.ok) dibujarIntentoListo(resultado.preguntas);
  else dibujarNoSePudo(resultado.explicacion);
}

/**
 * Las preguntas del intento que se esta jugando, en su orden.
 *
 * Se exporta por el mismo motivo que `comenzarElIntento()`: para que
 * `scripts/probar-memoria.mjs` pueda anotar respuestas sobre el intento REAL sin
 * reimplementar el recorrido que todavia no existe. Devuelve una copia del arreglo
 * para que nadie de fuera pueda reordenarlo.
 */
export const preguntasDelIntento = () => (elIntento ? [...elIntento.preguntas] : []);

/**
 * Anota una pregunta ya resuelta y la guarda.
 *
 * ES LA COSTURA QUE LA ITERACION 43 VA A USAR. Hoy no hay recorrido, asi que nadie
 * la llama desde la pantalla; existe porque el guardado es de esta etapa y sin ella
 * no habria forma de provocar una escritura a mitad del intento sobre el codigo de
 * verdad. La 43 le conectara el boton de avanzar y el de omitir, y la 42 el
 * agotamiento de los 30 segundos —de ahi `agotada`—.
 *
 * @param {object} entrada
 * @param {number} entrada.pregunta_id     el id de la pregunta resuelta
 * @param {number|null} entrada.alternativa_id  la alternativa elegida DENTRO de la
 *        copia congelada, o null si se omitio
 * @param {'respondida'|'omitida'} entrada.estado
 * @param {boolean} entrada.agotada        si se resolvio porque se acabo el tiempo
 * @param {number} [entrada.resuelta_en]   instante en que quedo resuelta
 *
 * Devuelve si quedo GUARDADA. Un `false` no deshace nada: la respuesta queda anotada
 * en memoria y el intento sigue, que es la decision 7. Lo unico que cambia es que se
 * dice, y eso lo hace el aviso de aqui abajo.
 */
export function anotarEnElIntento(entrada) {
  if (!elIntento) return false;

  const resueltaEn = entrada.resuelta_en ?? Date.now();

  elIntento.respuestas.push({
    pregunta_id: entrada.pregunta_id,
    alternativa_id: entrada.alternativa_id ?? null,
    estado: entrada.estado,
    agotada: Boolean(entrada.agotada),
    resuelta_en: resueltaEn,
  });

  // La posicion sale de contar lo resuelto, no de un contador aparte. Con dos
  // numeros que dicen lo mismo, el dia que se desincronicen no habria forma de saber
  // cual manda —es el mismo motivo por el que el resultado no se guarda—.
  elIntento.posicion = elIntento.respuestas.length;

  // Y la siguiente pregunta empieza cuando termina esta. El instante es de la 42;
  // acá se deja puesto para que lo guardado sea coherente desde el primer dia.
  elIntento.comenzada_en = resueltaEn;

  const pudo = guardarAvance({
    posicion: elIntento.posicion,
    comenzada_en: elIntento.comenzada_en,
    terminado_en:
      elIntento.posicion === elIntento.preguntas.length ? resueltaEn : null,
    respuestas: elIntento.respuestas,
  });

  mostrarAvisoDeGuardado({ estado: estadoDelGuardado() });

  return pudo;
}

/**
 * Al abrir la pagina: si hay un intento guardado, se retoma.
 *
 * NO SALE NI UNA PETICION. Se lee del almacen del navegador y nada mas, asi que la
 * regla de la decision 5 —«la presentacion no pide nada»— sigue intacta: quien abre
 * la pagina con un intento a medias no gasta ni un viaje a la red, y quien la abre
 * sin intento tampoco.
 *
 * Y NO SE VUELVE A ELEGIR NADA. Las preguntas salen de la copia congelada, en el
 * mismo orden en que se guardaron. Volver a pedirlas por id al banco seria
 * exactamente lo que la decision 6 prohibe: el resultado se calcula con lo que el
 * estudiante vio, y una pregunta corregida entre la carga y la recarga le cambiaria
 * el intento por debajo.
 *
 * Si no hay intento, o si lo que hay no se entiende, esta funcion no hace nada y la
 * presentacion se queda como estaba. En silencio, como manda ADR-034.
 */
export function retomarElIntento() {
  const guardado = leerIntentoGuardado();
  if (!guardado) return;

  elIntento = {
    preguntas: guardado.preguntas,
    respuestas: guardado.respuestas,
    posicion: guardado.posicion,
    comenzada_en: guardado.comenzada_en,
  };

  dibujarIntentoListo(guardado.preguntas, { retomado: true });

  // El aviso se recalcula al retomar y no se hereda: el navegador pudo llenarse
  // entre una visita y la otra, y el estado de la visita anterior no se guarda en
  // ninguna parte —ni debe—.
  mostrarAvisoDeGuardado({ estado: estadoDelGuardado() });
}

/**
 * Conecta el boton.
 *
 * El oyente va en la zona y no en el boton, y es a proposito: «Volver a intentarlo»
 * y «Empezar otro intento» son botones NUEVOS, dibujados despues, con el mismo id.
 * Un oyente puesto sobre el boton original se habria ido con el al reescribirse la
 * zona, y los dos serian botones que mienten.
 */
export function conectarComienzo() {
  const zona = $('#zona-del-intento');
  if (!zona) return;

  zona.addEventListener('click', (evento) => {
    const boton = evento.target.closest?.('#comenzar-simulacro');
    if (!boton) return;

    comenzarElIntento();
  });
}
