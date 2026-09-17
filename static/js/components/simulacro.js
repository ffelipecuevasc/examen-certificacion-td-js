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
 */
import { $, esc } from '../utils/dom.js';
import { leerPreguntasPorIds, leerResumen } from '../servicios/datos.js';
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
async function traer(ids) {
  const respuesta = await leerPreguntasPorIds(ids);
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
 * POR QUE LAS RESERVAS SE PIDEN POR MODULO Y NO EN MONTON
 *
 * Porque lo que hay que reponer es la CUOTA de cada modulo, no el total. Reponer
 * seis preguntas de donde sea dejaria 120 en total y 14 de un modulo, y el reparto
 * parejo es parte de lo que el intento promete. Los ids de todas las reservas de una
 * ronda si viajan juntos: son una sola peticion.
 */
async function armarElIntento(idsPorModulo) {
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

  const traidas = await traer(eleccion.ids);
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

    const masTraidas = await traer(repuestos.map((r) => r.id));
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
 *   4. **antes de dibujar**, se comprueba que esta sigue siendo la ultima peticion;
 *   5. se espera el piso de 400 ms;
 *   6. se vuelve a comprobar, porque durante el piso pudo pulsarse otra vez;
 *   7. se cierra y se dibuja.
 *
 * Los pasos 4 y 6 son H-1 entero: sin ellos, una respuesta lenta apagaria la
 * transicion de una carga posterior y dibujaria encima de ella.
 */
export async function comenzarElIntento() {
  // Pulsar durante la carga no hace nada. `disabled` ya lo impide en el navegador;
  // esta guarda es la mitad que se puede provocar desde un guion, porque el DOM
  // falso ejecuta los oyentes aunque el nodo este deshabilitado.
  if (transicion.enCurso()) return;

  const miPeticion = transicion.abrir('el intento');
  transicion.dibujar('');

  const resumen = await leerResumen();
  origen.resumen = resumen.meta?.respaldo ?? null;
  origen.preguntas = null;

  const resultado = resumen.ok
    ? await armarElIntento(
        Object.fromEntries(
          (resumen.datos ?? []).map((fila) => [fila.modulo, fila.preguntas_ids ?? []])
        )
      )
    : {
        ok: false,
        explicacion:
          'No se pudo consultar el banco de preguntas. Revisa tu conexión y vuelve a intentarlo.',
      };

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
