/**
 * El cuestionario de practica.
 *
 * DE DONDE VIENEN LAS PREGUNTAS, Y POR QUE IMPORTA
 *
 * Desde la iteracion 22 vienen de D1, a traves de /api/preguntas. Hasta entonces
 * venian de un archivo del propio repositorio. El cambio parece de plomeria y no
 * lo es: el contenido paso a ser de **origen externo**, editable por cualquiera
 * que tenga acceso a la base, y el escapado dejo de ser higiene para convertirse
 * en una barrera de seguridad. Es lo que H-003 vio venir.
 *
 * La regla, sin excepciones: **todo texto que venga de la capa de datos pasa por
 * esc() antes de tocar innerHTML.** No hay ningun campo de confianza. El titulo
 * del modulo tampoco, y el nombre del icono menos que ninguno, porque va dentro
 * de un atributo.
 *
 * SE DIBUJA UN MODULO, NO EL BANCO (iteracion 31)
 *
 * Hasta el 2026-09-11 esta pagina pedia el banco entero y lo dibujaba de una vez.
 * Con 105 preguntas se sostenia; con 368 dejo de ser una opcion de diseno para
 * quien estudia desde el telefono con conexion modesta, que es parte del publico
 * descrito en vision.md. Ahora el estudiante elige un modulo y solo ese viaja.
 *
 * De ahi salen tres consecuencias que ordenan el resto del archivo:
 *
 *   1. La pagina arranca VACIA. No hay nada que dibujar hasta que haya eleccion,
 *      y el vacio se explica en vez de quedarse en blanco.
 *   2. Las barras del panel miden el MODULO, no el banco. `estado.total` es la
 *      cuenta del modulo dibujado.
 *   3. El control de modulo queda LIBRE en todo momento: se cambia cuando se
 *      quiera. El motivo esta en la iteracion 31 y sale de vision.md — forzar a
 *      terminar no produce constancia, produce abandono. Desde la iteracion 32
 *      ese control es el indice de components/indice-modulos.js, y se cambia de
 *      modulo por una sola puerta: pedirCambioDeModulo().
 *
 * LA MEMORIA DEL AVANCE (iteracion 33, ADR-034)
 *
 * Cambiar de modulo ya no pierde nada, y recargar tampoco: cada respuesta se guarda
 * en el navegador **al responderla**, y al volver al modulo se restaura. La 31 y la
 * 32 avisaban antes de perder el avance; ese aviso se retiro entero, porque ya no
 * hay nada que perder y un aviso que no protege de nada entrena a ignorar los
 * avisos.
 *
 * Lo que se guarda —id de la pregunta y texto de la alternativa elegida, nunca el
 * veredicto— y por que, esta en servicios/memoria.js y en ADR-034. Lo que le toca a
 * este archivo es la otra mitad, que es la que importa para el estudiante:
 *
 *   **el veredicto se recalcula contra el banco dibujado, cada vez.** Ver
 *   restaurarDesdeLaMemoria(). Si el banco cambio, manda el banco; si la
 *   alternativa que eligio ya no existe con ese texto, la pregunta vuelve a quedar
 *   sin responder. Se pierde una respuesta; no se afirma nada falso.
 */
import { $, $$, esc, shuffle, icon, prefersReducedMotion } from '../utils/dom.js';
import { leerPreguntas } from '../servicios/datos.js';
import { borrarAvance, guardarRespuesta, leerAvance, sePuedeGuardar } from '../servicios/memoria.js';
import {
  avanceDelResumen,
  cargarConteos,
  conectarIndice,
  conteoDelResumen,
  fijarAvanceDibujado,
  marcarModuloActivo,
  pintarIndice,
} from './indice-modulos.js';

const estado = {
  respondidas: 0,
  correctas: 0,
  incorrectas: 0,
  total: 0,
  /** Modulo que se esta mostrando. null mientras no se haya elegido ninguno. */
  modulo: null,
};

/**
 * El modulo que se esta mostrando, ya agrupado.
 *
 * Se guarda para que reiniciar vuelva a dibujar sin pedir el modulo de nuevo: el
 * estudiante que reinicia quiere las mismas preguntas barajadas otra vez, no una
 * espera y la posibilidad de que la capa de datos se haya caido entre medio.
 */
let bancoCargado = null;

/**
 * De donde salio lo que se esta viendo, por fuente.
 *
 * Son dos peticiones distintas —el resumen de los siete conteos y las preguntas
 * del modulo— y cualquiera de las dos puede haber caido a la instantanea por su
 * cuenta. El aviso de ADR-008 tiene que aparecer si **alguna** de las dos lo hizo:
 * decirle al estudiante «esto viene de la base» cuando la mitad viene de la copia
 * seria mentir por omision.
 *
 * Cada campo guarda el sello del respaldo, o null si esa fuente contesto en vivo.
 */
const origen = { resumen: null, modulo: null };

/**
 * Cual es la peticion vigente.
 *
 * El indice esta libre, asi que el estudiante puede cambiar de modulo mientras el
 * anterior todavia viaja. Sin esto, una respuesta lenta del modulo 3 llegaria
 * despues de la del 5 y dibujaria el 3 sobre el 5, con el indice marcando el 5.
 * Cada llamada toma un numero y, al volver del await, se retira si ya no es la
 * ultima.
 */
let peticionVigente = 0;

/**
 * Que modulo se esta pidiendo ahora mismo, o null si no se esta pidiendo ninguno.
 *
 * `peticionVigente` sirve para descartar respuestas que llegan tarde; esto sirve
 * para algo distinto: **no salir a pedir dos veces lo mismo**.
 *
 * El reintento de una carga fallida —que es de esta misma iteracion— abrio la
 * puerta sin querer: se permite volver a pedir el modulo que ya esta puesto cuando
 * `bancoCargado` es null, y eso tambien es cierto MIENTRAS carga. En una conexion
 * modesta, que es el publico de vision.md, la barra tarda lo suficiente como para
 * que el estudiante pulse otra vez creyendo que no registro el toque, y cada toque
 * eran 44 a 65 KB mas por la misma pregunta.
 *
 * Con esto, pulsar durante la carga no hace nada. Y en cuanto la carga termina
 * —bien o mal— vuelve a null, asi que el reintento tras un fallo sigue disponible,
 * que es justo lo que no se puede perder.
 */
let moduloCargando = null;

/** Actualiza las tres barras verticales y los contadores del panel izquierdo. */
function actualizarPanel() {
  const { respondidas, correctas, incorrectas, total } = estado;
  const pct = (valor) => (total === 0 ? 0 : Math.round((valor / total) * 100));

  // Horizontales desde la iteracion 32: crecen a lo ancho, no a lo alto.
  $('#barra-avance').style.width = `${pct(respondidas)}%`;
  $('#barra-incorrectas').style.width = `${pct(incorrectas)}%`;
  $('#barra-correctas').style.width = `${pct(correctas)}%`;

  $('#valor-avance').textContent = respondidas;
  $('#valor-incorrectas').textContent = incorrectas;
  $('#valor-correctas').textContent = correctas;

  // Cada barra lleva ahora su propio porcentaje al lado de su cifra. Es lo que la
  // vuelve legible sin color: la fila se explica sola.
  $('#pct-avance').textContent = `${pct(respondidas)}%`;
  $('#pct-incorrectas').textContent = `${pct(incorrectas)}%`;
  $('#pct-correctas').textContent = `${pct(correctas)}%`;

  $('#total-preguntas').textContent = total;

  const restantes = total - respondidas;

  // El primer caso no es cosmetico: con la pagina recien abierta no hay ninguna
  // «primera pregunta» que responder, y decirlo seria mandar al estudiante a
  // hacer algo que todavia no puede hacer.
  $('#mensaje-avance').textContent =
    estado.modulo === null
      ? 'Elige un módulo para comenzar.'
      : respondidas === 0
        ? 'Responde la primera pregunta para comenzar.'
        : restantes === 0
          ? `¡Terminaste el módulo! Acertaste ${correctas} de ${total}.`
          : `Te quedan ${restantes} preguntas por responder.`;

  // Y la fila del indice de este modulo cuenta lo mismo que estas barras, porque
  // es lo dibujado lo que manda mientras el modulo esta abierto (decision 9 de la
  // iteracion 33). Con nada cargado se olvida: las siete filas vuelven a contar
  // sobre el resumen. El indice solo se repinta si la cifra cambio de verdad.
  fijarAvanceDibujado(bancoCargado ? estado.modulo : null, respondidas, total);
}

/**
 * Lo que dice la pagina despues de responder.
 *
 * Sale de aqui y no de dos sitios porque hay dos caminos que llegan al mismo
 * estado: responder ahora, y restaurar lo respondido en otra visita. Si cada uno
 * escribiera su propia frase, el dia que una cambie el estudiante veria una cosa al
 * responder y otra al volver.
 */
const veredictoDibujado = (acerto) =>
  acerto
    ? `${icon('task-alt', 'text-base text-esmeralda mt-0.5')}<span>Correcto. Sigue así.</span>`
    : `${icon('lightbulb', 'text-base text-jsyellow mt-0.5')}<span>La alternativa correcta está marcada en amarillo.</span>`;

/**
 * La pregunta a la que pertenece un boton, y la alternativa que se pulso.
 *
 * Se resuelve contra `bancoCargado` y no contra el DOM a proposito: el texto que
 * hay que guardar es el del banco, sin escapar. Sacarlo del HTML obligaria a
 * desescaparlo, y ese viaje de ida y vuelta es justo donde se cuela un `&amp;` en
 * la memoria del estudiante para no volver a coincidir con nada nunca.
 *
 * Devuelve null si no se puede identificar, y quien llama sigue adelante sin
 * guardar: responder tiene que funcionar igual aunque la memoria no pueda anotarlo.
 */
function deDondeSalio(boton) {
  if (!bancoCargado) return null;

  const item = boton.closest?.('[data-pregunta]');
  const preguntaId = Number(String(item?.dataset?.pregunta ?? '').replace(/^q/, ''));
  const alternativaId = Number(boton.dataset?.alternativa);

  if (!Number.isInteger(preguntaId) || !Number.isInteger(alternativaId)) return null;

  for (const grupo of bancoCargado) {
    for (const pregunta of grupo.preguntas) {
      if (pregunta.id !== preguntaId) continue;
      const alternativa = pregunta.alternativas.find((a) => a.id === alternativaId);
      return alternativa ? { pregunta, alternativa } : null;
    }
  }

  return null;
}

/** Marca la alternativa elegida, revela la correcta y anota la respuesta. */
function responder(boton) {
  const item = boton.closest('[data-pregunta]');
  const acerto = boton.dataset.correct === 'true';

  $$('.quiz-option', item).forEach((opcion) => {
    opcion.disabled = true;
    const marca = opcion.querySelector('.quiz-mark');

    if (opcion.dataset.correct === 'true') {
      opcion.dataset.state = 'correct';
      marca.innerHTML = icon('check-circle');
      marca.classList.remove('opacity-0');
    } else if (opcion === boton) {
      opcion.dataset.state = 'wrong';
      marca.innerHTML = icon('cancel');
      marca.classList.remove('opacity-0');
    } else {
      opcion.dataset.state = 'dimmed';
    }
  });

  // La misma marca que deja el dibujo restaurado, para que las dos visitas se
  // vean iguales y para que se pueda comprobar cual se eligio.
  boton.dataset.elegida = 'true';

  const aviso = $('.quiz-feedback', item);
  aviso.classList.remove('hidden');
  aviso.innerHTML = veredictoDibujado(acerto);

  item.dataset.answered = 'true';
  estado.respondidas += 1;
  if (acerto) estado.correctas += 1;
  else estado.incorrectas += 1;

  // Se guarda AQUI, al responder, y no al cambiar de modulo ni al salir: cerrar la
  // pestana a mitad de un modulo no puede perder nada, y la memoria no puede
  // depender de que el estudiante salga por una puerta concreta.
  //
  // Se guarda el texto de la alternativa, nunca el veredicto: el veredicto se
  // vuelve a calcular al restaurar, contra el banco que este vigente ese dia.
  const origenDelClic = deDondeSalio(boton);
  if (origenDelClic) {
    guardarRespuesta(estado.modulo, origenDelClic.pregunta.id, origenDelClic.alternativa.texto);
  }

  actualizarPanel();
}

/**
 * Agrupa la lista plana del extremo en secciones por modulo.
 *
 * Desde la iteracion 31 la lista trae un solo modulo y el resultado es un grupo
 * unico. La funcion se conserva agrupando igual, y no se simplifica a «un modulo,
 * una seccion», por un motivo concreto: si algun dia el extremo devolviera una
 * fila de otro modulo, dibujar dos secciones lo deja a la vista en vez de
 * mezclarlo dentro de la cabecera equivocada.
 */
function agruparPorModulo(preguntas) {
  const grupos = [];
  let actual = null;

  for (const pregunta of preguntas) {
    if (!actual || actual.numero !== pregunta.modulo) {
      actual = {
        numero: pregunta.modulo,
        titulo: pregunta.modulo_titulo,
        icono: pregunta.modulo_icono,
        preguntas: [],
      };
      grupos.push(actual);
    }
    actual.preguntas.push(pregunta);
  }

  return grupos;
}

/**
 * Dibuja una alternativa. Su texto viene de la base: se escapa siempre.
 *
 * `elegida` es la alternativa que el estudiante ya habia respondido en otra visita,
 * o null si la pregunta esta sin responder. Con ella, la alternativa sale ya
 * marcada: es asi como se restaura el avance, dibujandolo, y no simulando clics
 * despues de dibujar.
 *
 * `data-alternativa` lleva el id de la fila, que es lo unico que hace falta para
 * volver a encontrarla en el banco cargado al pulsarla. **El id no se guarda en la
 * memoria del estudiante** —cambia con cada correccion del banco, ver
 * servicios/memoria.js—: vive en el HTML y muere con el, que es un sitio donde
 * cambiar de id no le hace dano a nadie.
 */
function dibujarAlternativa(alternativa, elegida) {
  const esCorrecta = alternativa.es_correcta === 1;
  const esLaElegida = elegida !== null && alternativa.id === elegida.id;

  if (elegida === null) {
    return `
              <button type="button" class="quiz-option flex items-start gap-3 text-left w-full border border-panel3 rounded-lg px-4 py-3 text-sm text-paper/90 hover:border-jsyellow transition-colors"
                      data-correct="${esCorrecta}" data-alternativa="${esc(alternativa.id)}">
                <span class="quiz-mark text-lg opacity-0 shrink-0">${icon('check-circle')}</span>
                <span>${esc(alternativa.texto)}</span>
              </button>`;
  }

  // Las mismas tres marcas que deja responder(), y por el mismo orden: la correcta
  // siempre se revela, la elegida se senala si no lo era, y el resto se apaga.
  const estadoVisual = esCorrecta ? 'correct' : esLaElegida ? 'wrong' : 'dimmed';
  const marca = esCorrecta ? icon('check-circle') : esLaElegida ? icon('cancel') : '';
  const opacidad = estadoVisual === 'dimmed' ? 'opacity-0' : '';

  return `
              <button type="button" disabled class="quiz-option flex items-start gap-3 text-left w-full border border-panel3 rounded-lg px-4 py-3 text-sm text-paper/90 transition-colors"
                      data-correct="${esCorrecta}" data-alternativa="${esc(alternativa.id)}"
                      data-state="${estadoVisual}"${esLaElegida ? ' data-elegida="true"' : ''}>
                <span class="quiz-mark text-lg ${opacidad} shrink-0">${marca}</span>
                <span>${esc(alternativa.texto)}</span>
              </button>`;
}

/**
 * Dibuja una pregunta con sus alternativas.
 *
 * El barajado es de ADR-006, y la excepcion es `orden_fijo`: la pregunta cuya
 * alternativa (d) dice «Ambas B y C son correctas» pierde el sentido si se
 * mueven de sitio. Por ADR-019 la correcta va atada a la alternativa y no a su
 * posicion, asi que barajar no rompe nada y aca no hace falta ninguna rama
 * especial mas alla de decidir si se baraja o no.
 */
function dibujarPregunta(pregunta, numero, respondida) {
  const orden =
    pregunta.orden_fijo === 1
      ? pregunta.alternativas.slice().sort((a, b) => a.orden - b.orden)
      : shuffle(pregunta.alternativas);

  const elegida = respondida?.alternativa ?? null;
  const alternativas = orden.map((a) => dibujarAlternativa(a, elegida)).join('');

  // El barajado de ADR-006 y la memoria no se estorban: lo guardado es el TEXTO de
  // la alternativa, asi que da igual en que posicion le toque salir hoy.
  const veredicto = respondida
    ? `<p class="quiz-feedback mt-4 text-sm text-muted border-l-2 border-jsyellow pl-3 flex gap-2">${veredictoDibujado(respondida.acerto)}</p>`
    : '<p class="quiz-feedback hidden mt-4 text-sm text-muted border-l-2 border-jsyellow pl-3 flex gap-2"></p>';

  return `
          <li class="bg-panel border border-panel3 rounded-xl p-5 sm:p-6" data-pregunta="q${pregunta.id}"${respondida ? ' data-answered="true"' : ''}>
            <div class="flex items-baseline gap-3">
              <span class="font-mono text-xs text-mutedink shrink-0">${String(numero).padStart(2, '0')}</span>
              <p class="font-display font-bold text-paper leading-snug">${esc(pregunta.enunciado)}</p>
            </div>
            <div class="mt-4 grid gap-2">${alternativas}</div>
            ${veredicto}
          </li>`;
}

/** Dibuja la seccion de un modulo, con lo respondido ya puesto. */
function dibujarGrupo(grupo, vigentes) {
  const preguntas = grupo.preguntas
    .map((pregunta, i) => dibujarPregunta(pregunta, i + 1, vigentes.get(pregunta.id)))
    .join('');

  return `
      <section class="scroll-mt-24" id="grupo-modulo-${esc(grupo.numero)}">
        <header id="cabecera-modulo-${esc(grupo.numero)}" tabindex="-1" class="sticky top-16 z-10 -mx-1 px-1 py-3 bg-ink/95 backdrop-blur flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-jsyellow/40 rounded">
          <span class="grid place-items-center w-9 h-9 rounded-lg bg-panel2 text-jsyellow shrink-0">${icon(grupo.icono, 'text-xl')}</span>
          <span class="font-display font-bold text-jsyellow text-sm shrink-0">Módulo ${esc(grupo.numero)}</span>
          <span class="font-display font-semibold text-paper text-sm truncate">${esc(grupo.titulo)}</span>
          <span class="ml-auto font-mono text-[11px] text-mutedink shrink-0">${grupo.preguntas.length}</span>
        </header>
        <ul class="mt-3 grid gap-4">${preguntas}</ul>
      </section>`;
}

/**
 * Fecha legible en espanol, o null si no hay ninguna que leer.
 *
 * Devolver null y no una cadena vacia es a proposito: quien llama tiene que poder
 * decir «no se sabe de cuando es» en vez de dejar la frase a medias.
 */
function fechaLegible(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha);
}

/**
 * Aviso de que lo que se esta viendo sale de la instantanea y no de la base.
 *
 * ADR-008 lo pide con todas sus letras: el sitio sigue funcionando cuando la capa
 * de datos cae, y **avisa**, nunca en silencio. Por eso el aviso va arriba del
 * banco y no en el pie: el estudiante tiene que saberlo antes de estudiar, no
 * despues.
 *
 * La fecha sale del sello del archivo generado, que es lo que ADR-023 obliga a
 * escribir dentro. Sin ese dato el aviso no podria decir de cuando es la copia, y
 * un «puede no estar al dia» sin fecha no le sirve a nadie para decidir si
 * confiar o no.
 */
function mostrarAvisoRespaldo() {
  const contenedor = $('#aviso-respaldo');
  if (!contenedor) return;

  // Basta con que UNA de las dos fuentes venga de la copia. Ver `origen`.
  const sello = origen.resumen ?? origen.modulo;

  if (!sello) {
    contenedor.innerHTML = '';
    contenedor.classList.add('hidden');
    return;
  }

  const fecha = fechaLegible(sello.generada_en);

  const cuando = fecha
    ? `Es la copia del ${esc(fecha)}.`
    : 'La copia no trae fecha, asi que no se sabe de cuando es.';

  contenedor.innerHTML = `
      <div class="flex items-start gap-3 border border-jsyellow/40 bg-jsyellow/5 rounded-xl px-5 py-4">
        ${icon('database', 'text-xl text-jsyellow shrink-0 mt-0.5')}
        <div>
          <p class="font-display font-bold text-paper text-sm">Estás viendo una copia guardada del banco de preguntas.</p>
          <p class="mt-1 text-sm text-muted">No se pudo conectar con el servidor, así que el cuestionario se cargó desde la copia incluida en el sitio. Puedes practicar con normalidad, pero puede que falten preguntas nuevas o correcciones recientes. ${cuando}</p>
        </div>
      </div>`;

  contenedor.classList.remove('hidden');
}

/**
 * Aviso de que este navegador no deja guardar el avance.
 *
 * Va en la zona de preguntas, al lado del aviso de ADR-008 y por el mismo motivo:
 * el panel de la izquierda ya esta contabilizado al milimetro desde ADR-032 —la
 * ventana de 700 px de alto tiene que seguir alcanzando todo—, y un aviso que solo
 * aparece en un caso raro no puede empujar el indice fuera de pantalla para los
 * demas. Aca no le quita sitio a nada mientras no exista.
 *
 * Y se dice, no se calla. El sitio sigue sirviendo sin memoria —se elige modulo, se
 * responde, se corrige— y lo unico que se pierde es el recuerdo entre visitas. Pero
 * un estudiante que responde treinta preguntas y las pierde al recargar, sin que
 * nadie se lo hubiera advertido, tiene todo el derecho a pensar que el sitio esta
 * roto. Es el mismo argumento de ADR-008: degradar si, en silencio no.
 */
function mostrarAvisoAlmacenamiento() {
  const contenedor = $('#aviso-almacenamiento');
  if (!contenedor) return;

  if (sePuedeGuardar()) {
    contenedor.innerHTML = '';
    contenedor.classList.add('hidden');
    return;
  }

  contenedor.innerHTML = `
      <div class="flex items-start gap-3 border border-panel3 bg-panel rounded-xl px-5 py-4">
        ${icon('restart-alt', 'text-xl text-jsyellow shrink-0 mt-0.5')}
        <div>
          <p class="font-display font-bold text-paper text-sm">Tu avance no se está guardando.</p>
          <p class="mt-1 text-sm text-muted">Este navegador no permite guardar datos del sitio: puede ser el bloqueo de cookies o que el almacenamiento esté lleno. Puedes practicar igual y las respuestas se corrigen como siempre, pero al recargar la página el módulo va a empezar de cero.</p>
        </div>
      </div>`;

  contenedor.classList.remove('hidden');
}

/**
 * Mensaje a pantalla completa cuando no hay preguntas que dibujar.
 *
 * `pie` es marcado escrito aqui dentro, no dato: es el unico parametro que NO se
 * escapa, y por eso lleva ese nombre y no «detalle2». Quien lo use con algo que
 * venga de la capa de datos rompe la regla del archivo.
 */
function dibujarMensaje(contenedor, nombreIcono, titulo, detalle, pie = '') {
  contenedor.innerHTML = `
      <div id="mensaje-cuestionario" tabindex="-1" class="bg-panel border border-panel3 rounded-xl p-8 text-center focus:outline-none focus:ring-2 focus:ring-jsyellow/40">
        <span class="grid place-items-center w-12 h-12 mx-auto rounded-lg bg-panel2 text-jsyellow">${icon(nombreIcono, 'text-2xl')}</span>
        <p class="mt-4 font-display font-bold text-paper">${esc(titulo)}</p>
        <p class="mt-2 text-sm text-muted">${esc(detalle)}</p>
        ${pie}
      </div>`;
}

/**
 * El estado vacio con el que arranca la pagina.
 *
 * Lleva un enlace al indice, y no es un adorno: en telefono las dos columnas se
 * apilan y este mensaje queda por debajo del panel entero, de modo que «elige un
 * modulo arriba» manda a desplazarse a ciegas. El enlace cierra esa distancia. En
 * escritorio sobra, porque el indice esta a la vista en la mitad izquierda, y no
 * molesta.
 *
 * Y AQUI SE DICE QUE EL AVANCE ES DE ESTE DISPOSITIVO (iteracion 33)
 *
 * Porque este mensaje es lo primero que se ve en cada visita —la pagina arranca
 * vacia y se queda asi hasta que el estudiante elige—, y porque el panel de la
 * izquierda no tiene sitio que regalar (ADR-032, la ventana de 700 px). Se dice
 * antes de que el estudiante invierta media hora de respuestas, no despues de
 * perderlas: el avance no viaja a ninguna parte, y eso tiene una cara buena —nadie
 * lo ve, no hay cuenta ni registro— y una mala —no esta en el telefono si se
 * respondio en el computador, y se va con los datos del navegador—. Las dos se
 * dicen en la misma frase, que es lo honesto.
 */
function mostrarEstadoVacio(contenedor) {
  dibujarMensaje(
    contenedor,
    'quiz',
    'Elige un módulo para empezar.',
    'En el panel está el índice con los siete módulos del examen. Cuando elijas uno, sus preguntas aparecen acá.',
    `<p class="mt-4 text-sm text-mutedink max-w-prose mx-auto">
         Tu avance se guarda <strong class="text-muted">solo en este dispositivo</strong>: no se envía a ningún servidor y no hace falta crear ninguna cuenta. Por lo mismo, no lo vas a encontrar en otro equipo ni si borras los datos del navegador.
       </p>
       <a href="#indice-modulos" data-ir-al-indice
          class="mt-5 inline-flex items-center gap-2 border border-panel3 text-paper font-display font-bold text-xs px-4 py-2.5 rounded hover:border-jsyellow transition-colors">
         ${icon('layers', 'text-base text-jsyellow')}Ir al índice de módulos
       </a>`
  );
}

/**
 * Cruza lo guardado con el banco dibujado, y recalcula cada veredicto.
 *
 * **Es el punto donde la memoria no puede mentir**, y por eso esta escrito aparte y
 * no repartido por el dibujo. Tres cosas ocurren aqui, y las tres son la iteracion
 * 33 entera:
 *
 *   1. **Una pregunta que ya no esta dibujada no cuenta.** Si se retiro del banco,
 *      o si la validacion por fila la descarto, no aparece en `grupos` y su
 *      respuesta guardada se ignora sin mas. No se borra de la memoria: puede haber
 *      desaparecido solo hoy —un modo degradado sobre una instantanea vieja, una
 *      carga a medias— y borrarla seria castigar al estudiante por un problema del
 *      banco.
 *
 *   2. **Una alternativa cuyo texto cambio deja la pregunta sin responder.** Es la
 *      consecuencia asumida de anclar en el texto: se pierde una respuesta, y no se
 *      afirma nada falso. La pregunta vuelve a estar contestable.
 *
 *   3. **El veredicto sale de `es_correcta` del banco de hoy**, nunca de lo
 *      guardado, porque lo guardado no lo trae. Si el autor corrigio cual era la
 *      correcta, el estudiante ve el veredicto nuevo.
 */
function restaurarDesdeLaMemoria(grupos, guardadas) {
  const vigentes = new Map();

  for (const grupo of grupos) {
    for (const pregunta of grupo.preguntas) {
      const texto = guardadas.get(pregunta.id);
      if (texto === undefined) continue;

      const alternativa = pregunta.alternativas.find((a) => a.texto === texto);
      if (!alternativa) continue;

      vigentes.set(pregunta.id, { alternativa, acerto: alternativa.es_correcta === 1 });
    }
  }

  return vigentes;
}

/**
 * Dibuja el modulo que ya esta cargado en memoria, con lo respondido restaurado.
 *
 * Las tres barras salen de aqui y no de un contador que se vaya sumando: se cuentan
 * sobre lo que se acaba de dibujar. Asi «lo dibujado manda» no es una intencion,
 * sino la unica forma que tiene el codigo de contar.
 */
function pintar() {
  const contenedor = $('#cuestionario');
  if (!contenedor || !bancoCargado) return;

  const vigentes = restaurarDesdeLaMemoria(bancoCargado, leerAvance(estado.modulo));

  contenedor.innerHTML = bancoCargado.map((grupo) => dibujarGrupo(grupo, vigentes)).join('');

  estado.total = bancoCargado.reduce((suma, grupo) => suma + grupo.preguntas.length, 0);
  estado.respondidas = vigentes.size;
  estado.correctas = [...vigentes.values()].filter((r) => r.acerto).length;
  estado.incorrectas = estado.respondidas - estado.correctas;

  actualizarPanel();
}

/**
 * Escribe el contador de la portada con lo que DE VERDAD se dibujo.
 *
 * Estuvo escrito a mano en el HTML —«105 preguntas · 7 modulos»— y el 2026-09-08
 * la pantalla mostraba «105 preguntas» arriba y «copia guardada en el sitio (8
 * preguntas)» en el pie, al mismo tiempo. Un numero que no sale del dato que
 * acompana es un numero que va a mentir tarde o temprano, y este mintio.
 *
 * Se llama en todos los finales de mostrarModulo(), tambien en los que no dibujan
 * preguntas, y en el estado vacio: si no hay nada que contar, el contador se
 * esconde. **Ningun numero es mejor que un numero falso.**
 *
 * Desde la iteracion 31 cuenta un modulo y no el banco, asi que dice tambien cual:
 * «52 preguntas · módulo 2». Sin esa segunda mitad el mismo numero podria leerse
 * como el tamano del banco entero, que es la confusion que este contador existe
 * para evitar.
 */
function mostrarContador(grupos) {
  const contenedor = $('#contador-banco');
  if (!contenedor) return;

  const preguntas = grupos
    ? grupos.reduce((suma, grupo) => suma + grupo.preguntas.length, 0)
    : 0;

  if (preguntas === 0) {
    contenedor.innerHTML = '';
    contenedor.classList.add('hidden');
    contenedor.classList.remove('inline-flex');
    return;
  }

  const contar = (cantidad, singular, plural) =>
    `${cantidad} ${cantidad === 1 ? singular : plural}`;

  // Los modulos se cuentan de los datos, no del indice: si alguna vez llegara
  // una fila de otro modulo, el contador lo diria en vez de taparlo.
  const cual =
    grupos.length === 1
      ? `módulo ${grupos[0].numero}`
      : contar(grupos.length, 'módulo', 'módulos');

  contenedor.innerHTML =
    `${icon('quiz', 'text-base')}<span>${esc(contar(preguntas, 'pregunta', 'preguntas'))} · ${esc(cual)}</span>`;

  contenedor.classList.remove('hidden');
  contenedor.classList.add('inline-flex');
}

/**
 * Deja al estudiante en la cabecera del modulo recien cargado.
 *
 * POR QUE HACE FALTA, Y NO BASTA CON DIBUJAR
 *
 * Hasta la iteracion 32 esto no existia: se elegia un modulo y la pagina lo
 * dibujaba sin moverse. Eso funciona solo si las preguntas ya estan a la vista, y
 * no lo estan en ninguna de las dos formas en que se usa el sitio:
 *
 *   - En telefono las dos columnas se apilan y las preguntas quedan pantalla y
 *     media por debajo del indice. Elegir un modulo no mostraba nada: habia que
 *     adivinar que tocaba desplazarse.
 *   - En escritorio el panel es pegajoso, asi que se puede elegir un modulo con
 *     la pagina ya desplazada. La zona derecha se reescribe entera y el
 *     desplazamiento se queda donde estaba: el estudiante aterriza a mitad de un
 *     modulo que acaba de empezar.
 *
 * Decision del autor, 2026-09-11. Se aplica igual venga el cambio directo del
 * indice o del boton «Cambiar de módulo» del aviso, porque el problema es el
 * mismo por los dos caminos.
 *
 * DOS COSAS DEL COMO
 *
 * `prefers-reduced-motion` manda sobre el desplazamiento suave. Y el foco se pide
 * con `preventScroll`, porque enfocar desplaza por su cuenta y esa segunda
 * sacudida pelearia con la primera.
 *
 * Devuelve false si la cabecera no esta —carga fallida o modulo vacio—, para que
 * quien llama lleve el foco a otra parte en vez de a un sitio que no existe.
 */
function irALaCabecera(numero) {
  // La primera condicion es la que manda, y no la busqueda en el DOM: si no hay
  // modulo cargado no hay cabecera dibujada, se mire donde se mire. Preguntarselo
  // al estado y no al arbol tambien es lo que permite comprobarlo desde Node.
  if (!bancoCargado) return false;

  const seccion = $(`#grupo-modulo-${numero}`);
  const cabecera = $(`#cabecera-modulo-${numero}`);

  if (!seccion || !cabecera) return false;

  seccion.scrollIntoView?.({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });

  cabecera.focus?.({ preventScroll: true });
  return true;
}

/**
 * Lleva el foco al mensaje que explica por que no hay preguntas.
 *
 * Es el otro final de irALaCabecera(): cuando la carga falla o el modulo viene
 * vacio no hay ninguna cabecera a la que ir, y dejar el foco donde estaba —o
 * peor, en el body— deja a quien navega con teclado sin saber que paso. El
 * mensaje si lo explica, asi que el foco va ahi.
 */
function irAlMensaje() {
  $('#mensaje-cuestionario')?.focus?.({ preventScroll: true });
}

// ---------------------------------------------------------------------------
// La puerta unica hacia el cambio de modulo
// ---------------------------------------------------------------------------

/**
 * **La unica puerta por la que se cambia de modulo.**
 *
 * Todo lo que quiera cambiar de modulo pasa por aqui, y eso no es una preferencia
 * de estilo.
 *
 * SU MOTIVO CAMBIO EN LA ITERACION 33, Y LA PUERTA SE QUEDA
 *
 * Hasta la 32, lo que vivia dentro era el aviso de perdida de avance: cambiar de
 * modulo costaba lo respondido, y un segundo camino a `mostrarModulo()` habria
 * perdido el avance del estudiante sin decir nada. Ese aviso se retiro, porque con
 * memoria ya no se pierde nada.
 *
 * La puerta no se retira con el, porque concentra otras tres guardas, y las tres se
 * saltarian **en silencio**, que es la peor forma de romperse:
 *
 *   1. **La doble peticion.** Pulsar el mismo modulo mientras carga no vuelve a
 *      pedirlo. Sin esto, cada toque impaciente son 44 a 65 KB mas por lo mismo, en
 *      una conexion modesta, que es el publico de vision.md.
 *   2. **El reintento tras una carga fallida.** Volver a pulsar el modulo que ya
 *      esta puesto NO hace nada, salvo que no haya quedado puesto. Esa excepcion es
 *      el unico camino de vuelta cuando la capa de datos falla, y sin ella habria
 *      que recargar la pagina.
 *   3. **El viaje a la cabecera.** `mostrarModulo()` deja al estudiante en la
 *      cabecera del modulo, con el foco y el desplazamiento (ADR-032). Un camino
 *      que dibujara por su cuenta dejaria a quien navega con teclado sin saber que
 *      paso.
 *
 * Por eso `mostrarModulo()` es de esta casa y el indice no la conoce: avisa por
 * `conectarIndice()` y quien decide es esta funcion.
 *
 * **Y la memoria no depende de esta puerta.** El avance se guarda al responder, no
 * al salir del modulo: cerrar la pestana a mitad de un modulo no pierde nada. Si la
 * memoria dependiera de pasar por aqui, este seria otra vez el archivo con una sola
 * salida buena y cinco malas.
 */
function pedirCambioDeModulo(numero) {
  // Volver a pulsar el modulo que ya esta puesto no hace nada... salvo que no haya
  // quedado puesto. Si la carga fallo o el modulo vino vacio, `estado.modulo` ya
  // apunta a el y `bancoCargado` sigue en null: entonces pulsarlo es un reintento,
  // y era lo unico que el estudiante podia hacer. Sin esa segunda condicion, el
  // unico camino de vuelta era recargar la pagina. Encontrado en la auditoria de
  // la iteracion 32.
  //
  // Pero «no hay nada cargado» tambien es cierto MIENTRAS carga, y ahi pulsar otra
  // vez no es un reintento: es la misma peticion dos veces. Por eso la tercera
  // condicion. Ver `moduloCargando`.
  if (numero === estado.modulo && (bancoCargado || moduloCargando === numero)) return;

  mostrarModulo(numero);
}

/**
 * Conecta la zona de preguntas: responder, y el enlace del estado vacio.
 *
 * Se delega en el contenedor y se ata una sola vez, porque su contenido se
 * reescribe entero cada vez que cambia el modulo y los oyentes de los botones se
 * irian con el.
 */
function conectarCuestionario(contenedor) {
  if (contenedor.dataset.bound) return;

  contenedor.addEventListener('click', (evento) => {
    const irAlIndice = evento.target.closest('[data-ir-al-indice]');
    if (irAlIndice) {
      // El salto por ancla ya desplaza; el foco se mueve a mano para que el
      // teclado y el lector de pantalla lleguen al mismo sitio que el ojo. Va a
      // la primera fila del indice, que es la primera decision que hay que tomar.
      $('#indice-modulos')?.querySelector?.('[data-modulo]')?.focus?.();
      return;
    }

    const boton = evento.target.closest('.quiz-option');
    if (!boton || boton.disabled) return;
    responder(boton);
  });

  contenedor.dataset.bound = 'true';
}

// ---------------------------------------------------------------------------
// Cargar y dibujar un modulo
// ---------------------------------------------------------------------------

/**
 * Pide un modulo a la capa de datos y lo dibuja.
 *
 * Es el unico camino por el que aparecen preguntas en la pagina, y esta exportada
 * a proposito: scripts/probar-escapado.mjs y scripts/probar-filtrado.mjs corren
 * este mismo codigo contra el extremo real y miran el HTML que deja.
 *
 * Los finales posibles se tratan distinto a proposito, y la diferencia es la misma
 * que explica functions/api/_comun.js: una lista vacia es una respuesta correcta y
 * no un fallo, asi que no dispara el respaldo ni se anuncia como error.
 */
export async function mostrarModulo(numero) {
  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  const miPeticion = (peticionVigente += 1);
  moduloCargando = numero;

  estado.modulo = numero;
  estado.respondidas = 0;
  estado.correctas = 0;
  estado.incorrectas = 0;
  estado.total = 0;
  bancoCargado = null;

  conectarCuestionario(contenedor);
  mostrarContador(null);
  actualizarPanel();

  dibujarMensaje(
    contenedor,
    'database',
    `Cargando el Módulo ${numero}…`,
    'Pidiendo sus preguntas al banco.'
  );

  // El indice marca el modulo pedido YA, antes de saber si va a llegar.
  //
  // Hasta la auditoria de la iteracion 32 esto ocurria solo al final, y solo si la
  // carga salia bien: con una carga fallida, `estado.modulo` apuntaba al modulo
  // nuevo y el indice seguia marcando el anterior. La pantalla contaba dos cosas
  // distintas —la zona derecha decia «no se pudo cargar el Módulo 5» y el indice
  // decia que el activo era el 3— y no habia forma de saber cual creer.
  //
  // El aviso de perdida no se ve afectado: cuando pregunta, todavia no se ha
  // llamado a esta funcion, asi que el indice sigue marcando el modulo de verdad.
  marcarModuloActivo(numero);

  // Y el foco se aparca en ese mensaje mientras se espera. Si venimos del boton
  // «Cambiar de módulo», el boton que lo tenia acaba de ser destruido y el foco
  // estaria en el body durante toda la consulta.
  irAlMensaje();

  const respuesta = await leerPreguntas(numero);

  // Si mientras tanto se pidio otro modulo, esta respuesta ya no es la que la
  // pantalla esta esperando y dibujarla la dejaria mintiendo. Se sale SIN bajar la
  // bandera: la carga que sigue viva es la otra, y es suya.
  if (miPeticion !== peticionVigente) return;

  // De aqui en adelante esta carga es la vigente y ya termino de viajar, salga
  // bien o mal. Bajar la bandera aqui —y no en cada final— es lo que garantiza que
  // el reintento quede disponible tambien cuando la carga falla.
  moduloCargando = null;

  // Antes de dibujar nada: si esto viene del respaldo, que se vea. Va primero
  // para que el aviso aparezca tambien cuando el modulo venga vacio y la pagina
  // termine en un mensaje en vez de en preguntas.
  origen.modulo = respuesta.meta?.respaldo ?? null;
  mostrarAvisoRespaldo();

  // Los dos finales sin preguntas terminan igual: el foco va al mensaje que
  // explica lo que paso. No hay ninguna cabecera a la que ir, y desplazarse a una
  // que no existe o dejar el foco en el body serian las dos formas de que quien
  // navega con teclado se quede sin saber que ocurrio.
  if (!respuesta.ok) {
    mostrarContador(null);
    dibujarMensaje(
      contenedor,
      'database',
      'No se pudo cargar el módulo.',
      `${respuesta.mensaje} Puedes volver a elegirlo en el índice para reintentar.`
    );
    actualizarPanel();
    irAlMensaje();
    return;
  }

  if (respuesta.vacio) {
    mostrarContador(null);
    dibujarMensaje(
      contenedor,
      'database',
      `El Módulo ${numero} todavía no tiene preguntas.`,
      'El banco está conectado, pero este módulo está vacío. Prueba con otro.'
    );
    actualizarPanel();
    irAlMensaje();
    return;
  }

  bancoCargado = agruparPorModulo(respuesta.datos);
  mostrarContador(bancoCargado);

  // El indice ya quedo marcando este modulo antes de la consulta. Se repinta para
  // que la fila recoja la cifra que el resumen haya aprendido entre medio.
  marcarModuloActivo(numero);

  pintar();

  // Y recien ahora, con las preguntas dibujadas, se lleva al estudiante hasta
  // ellas. Antes de `pintar()` la cabecera no existe todavia.
  irALaCabecera(numero);

  avisarSiElResumenNoCuadra(numero);
}

/**
 * Deja constancia si el indice prometio una cantidad y se dibujo otra.
 *
 * ADR-033 lo anticipa: `?resumen=1` cuenta filas de `pregunta_activa` y
 * `/api/preguntas` valida por fila y puede descartar alguna. Si eso pasara, el
 * indice diria 61 y la pagina dibujaria 60.
 *
 * Aqui no se corrige el numero del indice ni se esconde la diferencia: **lo
 * dibujado manda** y ya es lo que muestran el contador y la cabecera. Lo que se
 * hace es dejarlo dicho en la consola, para que quien mire encuentre el motivo en
 * vez de un descuadre sin explicacion. Y `scripts/probar-filtrado.mjs` lo
 * convierte en un veredicto rojo, que es donde de verdad se caza.
 */
function avisarSiElResumenNoCuadra(numero) {
  const prometidas = conteoDelResumen(numero);
  if (prometidas === undefined) return;

  const dibujadas = estado.total;

  if (prometidas !== dibujadas) {
    console.warn(
      `El indice dice que el modulo ${numero} tiene ${prometidas} preguntas y se ` +
        `dibujaron ${dibujadas}. Manda lo dibujado. Ver ADR-033.`
    );
  }

  // Y lo mismo para el avance (decision 9 de la iteracion 33). Es la otra mitad del
  // mismo descuadre: si una pregunta que el resumen cuenta no llego a dibujarse, y
  // el estudiante la tenia respondida, la cuenta del resumen diria 12 y las barras
  // dirian 11. La fila del indice ya muestra lo dibujado; esto deja dicho por que,
  // para que quien mire la consola encuentre el motivo y no un descuadre a secas.
  const avancePrometido = avanceDelResumen(numero);
  if (avancePrometido !== undefined && avancePrometido !== estado.respondidas) {
    console.warn(
      `El indice contaba ${avancePrometido} respuestas guardadas del modulo ${numero} y se ` +
        `restauraron ${estado.respondidas}. Manda lo dibujado. Ver ADR-033.`
    );
  }
}

/**
 * Deja la pagina lista y vacia, esperando una eleccion.
 *
 * No pide ninguna PREGUNTA: hasta que el estudiante elija un modulo no hay ninguna
 * que pedir, y ese fue el cambio de fondo de la iteracion 31 —antes esta funcion
 * se traia el banco entero, 371,8 KB—.
 *
 * Lo unico que pide es el resumen de los siete conteos y sus ids, que son unos
 * 2,4 KB (ADR-033). El indice se dibuja antes de que llegue, con los nombres de
 * data/modules.js, asi que la pagina es utilizable aunque el resumen tarde o no
 * llegue nunca: lo unico que faltaria son las cifras, y faltar es mejor que
 * inventarlas.
 */
export async function renderCuestionario() {
  const contenedor = $('#cuestionario');
  if (!contenedor) return;

  pintarIndice();
  conectarIndice(pedirCambioDeModulo);
  conectarCuestionario(contenedor);

  mostrarContador(null);
  mostrarEstadoVacio(contenedor);
  mostrarAvisoAlmacenamiento();
  actualizarPanel();

  // El resumen puede caer a la instantanea por su cuenta. Si lo hace, el aviso de
  // ADR-008 aparece AQUI, al abrir la pagina, y no al elegir el primer modulo: el
  // estudiante se entera de que esta viendo una copia antes de ponerse a estudiar,
  // que es lo que esa ADR pide con todas sus letras.
  origen.resumen = await cargarConteos();
  mostrarAvisoRespaldo();
}

/**
 * Conecta el botón que reinicia las respuestas del módulo que se está viendo.
 *
 * **Borra tambien lo guardado de ese modulo**, y es el unico control de borrado que
 * existe (decision 2 de la iteracion 33). Si solo limpiara la pantalla, el
 * estudiante reiniciaria, recargaria, y le volveria todo: un boton que miente.
 *
 * Y borra **solo lo suyo**. Los otros seis modulos no se tocan: quien quiera
 * empezar de cero del todo lo hace modulo por modulo. No hay «borrar todo el
 * avance», y su ausencia es una decision anotada, no un olvido.
 *
 * El orden importa: primero se olvida, despues se dibuja. `pintar()` cuenta las
 * barras sobre lo que restaura de la memoria, asi que dibujar antes de borrar
 * repondria en pantalla justo lo que se acaba de pedir olvidar.
 */
export function setupReinicio() {
  const boton = $('#reiniciar');
  if (!boton) return;

  boton.addEventListener('click', () => {
    // Sin modulo cargado no hay nada que reiniciar, y volver a dibujar el estado
    // vacio encima de si mismo solo desplazaria la pagina sin motivo.
    if (!bancoCargado) return;

    borrarAvance(estado.modulo);
    pintar();

    // Reiniciar deja al estudiante donde empieza el modulo, no arriba del todo:
    // arriba del todo esta la portada, y desde ahi hay que volver a bajar. Y el
    // desplazamiento suave respeta `prefers-reduced-motion`, que hasta la
    // iteracion 32 esta llamada ignoraba aunque el sitio ya tuviera la utilidad.
    if (!irALaCabecera(estado.modulo)) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });
}
