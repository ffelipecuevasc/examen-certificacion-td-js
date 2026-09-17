/**
 * El intento del simulacro: elegir, traer y decir que quedo listo.
 *
 * QUE HACE ESTE ARCHIVO, Y QUE NO
 *
 * Es la etapa B de la iteracion 41. Conecta «Comenzar el simulacro» con la maquina
 * que la iteracion deja montada: pide la lista de ids, elige las 120 en el
 * navegador, las viene a buscar, repone lo que falte, y termina en un aviso
 * **«Intento listo»** (decision 11).
 *
 * **Todavia no dibuja ni una pregunta.** El recorrido —una pregunta a la vez, con
 * su reloj— es de las iteraciones 42 y 43, y adelantarlo aqui significaria escribir
 * dos veces el dibujo de una pregunta. Por eso el aviso dice cuantas trajo y de que
 * modulos, y **ningun texto del banco**: lo que se puede comprobar hoy es que el
 * intento se armo, no como se ve.
 *
 * Tampoco guarda nada. Eso es la etapa C.
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
import { crearTransicionDeCarga } from './transicion-de-carga.js';
import { mostrarAvisoDeRespaldo } from './aviso-de-respaldo.js';

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

  zona.innerHTML = `
      <div id="mensaje-simulacro" tabindex="-1" class="bg-panel border border-panel3 rounded-xl p-8 focus:outline-none focus:ring-2 focus:ring-jsyellow/40">
        <p class="font-display font-bold text-xl text-paper">${titulo}</p>
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
function dibujarIntentoListo(porModulo) {
  const total = MODULOS_DEL_EXAMEN.reduce(
    (suma, modulo) => suma + (porModulo[modulo]?.length ?? 0),
    0
  );

  const filas = MODULOS_DEL_EXAMEN.map(
    (modulo) => `
          <li class="flex items-baseline justify-between gap-4 border-b border-panel3 py-2 last:border-b-0">
            <span class="font-display font-semibold text-paper text-sm">Módulo ${esc(modulo)}</span>
            <span class="font-mono text-sm text-jsyellow">${esc(porModulo[modulo]?.length ?? 0)}</span>
          </li>`
  ).join('');

  dibujarRecuadro({
    titulo: 'Intento listo',
    cuerpo: `
        <p class="mt-3 text-sm text-muted leading-relaxed">Se eligieron <strong class="font-semibold text-paper">${esc(total)} preguntas</strong> y ya están cargadas. Todavía no se puede responder: el recorrido con el reloj llega en una versión próxima.</p>
        <ul class="mt-5">${filas}
        </ul>`,
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
 * Devuelve `{ ok: true, porModulo }` con las preguntas que llegaron, o
 * `{ ok: false, explicacion }` con la frase que va a leer el estudiante.
 *
 * `pedir` es de donde se traen las preguntas —la capa o la copia—, y entra por
 * parametro por el mismo motivo por el que el azar entra por parametro en el
 * algoritmo: asi esta funcion no tiene que saber cual de los dos bancos le toco, y
 * quien la llama no puede equivocarse a medias. Ver la regla del mismo banco en la
 * cabecera del archivo.
 *
 * POR QUE LAS RESERVAS SE PIDEN POR MODULO Y NO EN MONTON
 *
 * Porque lo que hay que reponer es la CUOTA de cada modulo, no el total. Reponer
 * seis preguntas de donde sea dejaria 120 en total y 14 de un modulo, y el reparto
 * parejo es parte de lo que el intento promete. Los ids de todas las reservas de una
 * ronda si viajan juntos: son una sola peticion.
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

  const porModulo = {};
  for (const modulo of MODULOS_DEL_EXAMEN) {
    porModulo[modulo] = eleccion.porModulo[modulo].filter((id) => traidas.has(id));
  }

  // Las rondas de reposicion. En el camino sano no entra ninguna: `faltan` es cero
  // en los siete modulos y el bucle termina en la primera vuelta.
  for (let ronda = 0; ronda < RONDAS_DE_RESERVA; ronda += 1) {
    const repuestos = [];

    for (const modulo of MODULOS_DEL_EXAMEN) {
      const faltan = eleccion.porModulo[modulo].length - porModulo[modulo].length;
      if (faltan <= 0) continue;

      for (const id of reponerDelModulo(eleccion.reservas, modulo, faltan)) {
        repuestos.push({ id, modulo });
      }
    }

    if (repuestos.length === 0) break;

    const masTraidas = await traer(repuestos.map((r) => r.id), pedir);

    // Una ronda de reserva que cae a la copia mezcla igual que la primera peticion:
    // las 111 que ya llegaron son de D1 y estas nueve serian de la copia. Misma
    // regla, mismo corte.
    if (seMezclaronLosBancos()) return HAY_MEZCLA;

    if (!masTraidas) break;

    for (const { id, modulo } of repuestos) {
      if (masTraidas.has(id)) porModulo[modulo].push(id);
    }
  }

  const total = MODULOS_DEL_EXAMEN.reduce((suma, m) => suma + porModulo[m].length, 0);

  if (total < PREGUNTAS_DEL_INTENTO) {
    return {
      ok: false,
      explicacion: `Solo se pudieron reunir ${esc(total)} preguntas de las ${esc(PREGUNTAS_DEL_INTENTO)} que necesita un simulacro, así que no tiene sentido empezarlo a medias. Vuelve a intentarlo en un rato.`,
    };
  }

  return { ok: true, porModulo };
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

  // El aviso del respaldo se enciende ANTES de dibujar el resultado, para que quien
  // lea la pantalla de arriba abajo se entere de que esto sale de una copia antes de
  // leer lo que la copia dio.
  mostrarAvisoDeRespaldo({
    sello: origen.resumen ?? origen.preguntas,
    loQueSeCargo: 'el simulacro',
  });

  if (resultado.ok) dibujarIntentoListo(resultado.porModulo);
  else dibujarNoSePudo(resultado.explicacion);
}

/**
 * Conecta el boton.
 *
 * El oyente va en la zona y no en el boton, y es a proposito: «Volver a intentarlo»
 * es un boton NUEVO, dibujado despues de un fracaso, con el mismo id. Un oyente
 * puesto sobre el boton original se habria ido con el al reescribirse la zona, y el
 * reintento seria un boton que miente.
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
