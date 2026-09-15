/**
 * El indice de los siete modulos del panel del cuestionario.
 *
 * QUE ES
 *
 * El **unico** control para elegir que modulo practicar. Reemplaza al `<select>`
 * de la iteracion 31: dos formas de elegir en el mismo panel, a tres centimetros,
 * es una de mas, y esta es mejor porque muestra los siete estados a la vez en vez
 * de esconder seis. ADR-032 se actualizo con eso; el sitio no cambio, cambio la
 * forma del control.
 *
 * LO QUE HUBO QUE REPONER A MANO
 *
 * El `<select>` daba gratis el teclado, el foco, la lectura de pantalla y el
 * «cual esta elegido». Una lista de botones no da nada de eso sola:
 *
 *   - cada fila es un `<button>`, asi que el tabulador la alcanza y Enter la
 *     activa, sin codigo de teclado propio;
 *   - el modulo activo lleva `aria-current="true"`, que es lo que hace que un
 *     lector de pantalla diga cual es, y ademas se distingue por borde y peso de
 *     letra, no solo por color;
 *   - cada fila lleva `aria-label` con el modulo, su titulo y su cantidad,
 *     porque en pantallas angostas el titulo se esconde para que quepan dos
 *     columnas y sin la etiqueta la fila se anunciaria como «Modulo 3, 61»;
 *   - y el foco se salva a mano en cada repintado, porque reescribir el
 *     `innerHTML` de la lista destruye el boton que lo tenia. Ver pintarIndice().
 *
 * DE DONDE SALEN LAS CIFRAS
 *
 * De `/api/preguntas?resumen=1` (ADR-033), que cuenta en la base y pesa 0,9 KB
 * frente a los 371,8 KB de traerse el banco. **Nunca del codigo.** La regla que
 * dejo la iteracion 31 sigue en pie —ningun numero que no salga de un dato— y lo
 * unico que cambio es que ahora el dato llega antes de elegir, no despues.
 *
 * Si el resumen no llega, las filas se dibujan igual, sin cifra: los nombres de
 * los siete modulos viven en data/modules.js y no dependen de la red. Un indice
 * sin numeros sigue sirviendo para elegir; un indice con numeros inventados, no.
 *
 * LO QUE ESTE ARCHIVO NO HACE
 *
 * No cambia de modulo. Avisa a quien lo monto, con `alElegir(numero)`, y ese es
 * el unico camino: el aviso de perdida de avance de la iteracion 31 vive del otro
 * lado, y si este componente cargara el modulo por su cuenta lo estaria
 * esquivando sin que nadie se enterara.
 */
import { $, esc, icon } from '../utils/dom.js';
import { leerResumen } from '../servicios/datos.js';
import { modulesData } from '../data/modules.js';

/** numero de modulo -> cuantas preguntas tiene, segun el dato. */
const conteos = new Map();

/** El modulo que se esta mostrando, o null si todavia no hay ninguno. */
let activo = null;

/** A quien avisarle cuando el estudiante elige. Lo pone conectarIndice(). */
let alElegir = null;

/** Texto de la cantidad, o cadena vacia mientras no se sepa. */
function cifra(numero) {
  const cuantas = conteos.get(numero);
  return cuantas === undefined ? '' : String(cuantas);
}

/** Nombre que oye quien no ve la fila. Dice siempre lo mismo que la fila muestra. */
function nombreAccesible(modulo) {
  const cuantas = conteos.get(modulo.numero);
  const cantidad =
    cuantas === undefined
      ? ''
      : `, ${cuantas} ${cuantas === 1 ? 'pregunta' : 'preguntas'}`;

  return `Módulo ${modulo.numero}: ${modulo.titulo}${cantidad}`;
}

/** Dibuja una fila del indice. */
function dibujarFila(modulo) {
  const esActivo = modulo.numero === activo;

  // El activo se distingue por una BARRA a su izquierda, ademas de por color.
  //
  // Antes este comentario decia «borde, fondo y peso de letra» y el codigo no
  // hacia nada de eso: las tres diferencias eran de color —borde amarillo, fondo
  // amarillo al 10 %, texto mas claro—. En escala de grises quedaban tres tonos
  // parecidos, y quien no distingue el amarillo no podia saber en que modulo
  // estaba. Encontrado en la auditoria de la iteracion 32.
  //
  // La barra es de FORMA, no de color: las filas inactivas reservan los mismos 4 px
  // y los dejan transparentes, asi que ninguna se mueve al cambiar de modulo y la
  // diferencia se ve igual sin un solo color. El amarillo acompana, no informa solo.
  const aspecto = esActivo
    ? 'border-jsyellow border-l-jsyellow bg-jsyellow/10 text-paper'
    : 'border-panel3 border-l-transparent text-muted hover:border-jsyellow hover:text-paper';

  // El titulo aparece en `lg` y no en `xl`, porque la lista pasa a una sola columna
  // en `lg` (ver `lg:grid-cols-1` en cuestionario.html) y desde ahi la fila es ancha
  // y el titulo cabe. Con `xl` quedaba escondido en toda la franja de 1024 a 1280 px:
  // una columna ancha mostrando solo «Módulo 3». Los dos puntos de corte tienen que
  // moverse juntos. Encontrado en la auditoria de la iteracion 32.

  return `
        <li>
          <button type="button" data-modulo="${esc(modulo.numero)}"
                  ${esActivo ? 'aria-current="true"' : ''}
                  aria-label="${esc(nombreAccesible(modulo))}"
                  class="w-full flex items-center gap-2 border border-l-4 ${aspecto} rounded-lg px-3 py-2.5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-jsyellow/40">
            <span class="grid place-items-center w-7 h-7 rounded bg-panel2 text-jsyellow shrink-0">${icon(modulo.icono, 'text-base')}</span>
            <span class="font-display font-bold text-xs shrink-0">Módulo ${esc(modulo.numero)}</span>
            <span class="hidden lg:inline font-sans text-xs truncate">${esc(modulo.titulo)}</span>
            <span class="ml-auto font-mono text-[11px] text-mutedink shrink-0">${esc(cifra(modulo.numero))}</span>
          </button>
        </li>`;
}

/**
 * La fila de un modulo, o null si no esta dibujada.
 *
 * Se exporta porque el cuestionario la necesita para devolver el foco al indice
 * cuando el estudiante cancela un cambio de modulo.
 */
export function filaDelModulo(numero) {
  return $('#indice-modulos')?.querySelector?.(`[data-modulo="${numero}"]`) ?? null;
}

/**
 * Redibuja el indice entero, sin tirar el foco.
 *
 * POR QUE HAY QUE SALVAR EL FOCO A MANO
 *
 * Reescribir `innerHTML` destruye los botones que habia dentro, y con ellos el que
 * tuviera el foco: el navegador lo deja caer en `<body>`. Quien navega con teclado
 * pierde su lugar y tiene que volver a tabular desde la barra de navegacion.
 *
 * No es hipotetico: esta funcion se llama sola cuando LLEGAN LOS CONTEOS, que es
 * justo el rato en que el estudiante puede estar recorriendo el indice con el
 * tabulador. Encontrado en la auditoria de la iteracion 32.
 *
 * Se repone solo si el foco estaba DENTRO del indice. Reponerlo siempre seria
 * robarselo a quien estuviera en otra parte de la pagina, que es el defecto
 * contrario y se nota mas.
 */
export function pintarIndice() {
  const contenedor = $('#indice-modulos');
  if (!contenedor) return;

  const teniaElFoco = document.activeElement?.dataset?.modulo;

  contenedor.innerHTML = modulesData.map(dibujarFila).join('');

  if (teniaElFoco !== undefined) filaDelModulo(teniaElFoco)?.focus?.();
}

/**
 * Marca cual es el modulo que la pagina esta mostrando o intentando mostrar.
 *
 * SE LLAMA AL PEDIR EL MODULO, NO AL TERMINAR DE CARGARLO
 *
 * Es al reves de como se hizo al principio, y el motivo esta en la auditoria de la
 * iteracion 32: marcando solo al final, una carga fallida dejaba `estado.modulo`
 * apuntando al modulo nuevo y el indice marcando el anterior. La zona derecha decia
 * «no se pudo cargar el Módulo 5» y el indice decia que el activo era el 3, y no
 * habia forma de saber cual creer.
 *
 * La regla de ahora: **el indice marca lo que la pagina esta intentando**, salga
 * bien o mal. Las dos mitades cuentan siempre la misma historia.
 *
 * Esto NO adelanta la marca al pulsar una fila. Pulsar no pide nada: pasa por
 * `pedirCambioDeModulo()`, que puede detenerse a preguntar si hay respuestas que
 * perder. Mientras ese aviso pregunta no se ha pedido nada, asi que aqui no se ha
 * llamado y el indice sigue marcando el modulo en el que el estudiante esta.
 */
export function marcarModuloActivo(numero) {
  activo = numero;
  pintarIndice();
}

/**
 * Pide las cifras y las pone en las filas.
 *
 * Devuelve el sello del respaldo si esto vino de la instantanea, y null si vino de
 * la base. Quien llama lo necesita para avisarle al estudiante (ADR-008): con esto
 * el aviso aparece **al abrir la pagina**, y no al elegir el primer modulo, que es
 * un paso mas tarde.
 */
export async function cargarConteos() {
  const respuesta = await leerResumen();

  if (!respuesta.ok) {
    // Sin cifras, pero con indice: los nombres no dependen de la red. No se
    // inventa ningun numero ni se deja la pagina sin control para elegir.
    pintarIndice();
    return null;
  }

  for (const fila of respuesta.datos) {
    if (Number.isInteger(fila?.modulo)) conteos.set(fila.modulo, fila.preguntas);
  }

  pintarIndice();
  return respuesta.meta?.respaldo ?? null;
}

/**
 * Cuantas preguntas dice el resumen que tiene un modulo, o undefined.
 *
 * Lo usa el cuestionario para comparar contra lo que de verdad dibujo. ADR-033
 * deja escrito por que hace falta: el resumen cuenta filas de la vista y
 * `/api/preguntas` valida por fila, asi que una pregunta descartada haria que el
 * indice prometiera 61 y la pagina dibujara 60.
 */
export const conteoDelResumen = (numero) => conteos.get(numero);

/** Conecta el indice. Se ata una sola vez, aunque el contenido se redibuje. */
export function conectarIndice(manejador) {
  const contenedor = $('#indice-modulos');
  if (!contenedor) return;

  alElegir = manejador;

  if (contenedor.dataset.bound) return;

  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-modulo]');
    if (!boton) return;

    const numero = Number(boton.dataset.modulo);
    if (!Number.isInteger(numero)) return;

    alElegir?.(numero);
  });

  contenedor.dataset.bound = 'true';
}
