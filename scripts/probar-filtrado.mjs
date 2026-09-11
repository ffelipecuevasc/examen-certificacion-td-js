/**
 * Guardian del filtrado por modulo del cuestionario (iteracion 31).
 *
 * POR QUE EXISTE
 *
 * La pagina dejo de dibujar el banco entero y pasa a dibujar el modulo elegido.
 * Eso es una promesa nueva y bastante fuerte —«ves exactamente las preguntas de
 * ese modulo, ni una mas ni una menos»— y una promesa que nadie vuelve a probar
 * no es una promesa: es una suposicion.
 *
 * LO QUE SE MIRA, Y CONTRA QUE
 *
 * Se mira **lo que la pagina dibuja**, no lo que el extremo responde. Son cosas
 * distintas: el extremo puede devolver un modulo impecable y el componente
 * dibujar otro, o dibujarlo dos veces, o quedarse con el anterior puesto. Por eso
 * aqui se corre el componente real, se captura el HTML que escribe y se cuenta
 * sobre ese HTML.
 *
 * Y se compara contra **la base local**, preguntandole directo por wrangler, no
 * contra la respuesta del extremo ni contra numeros escritos a mano en este
 * archivo. Una prueba que compara la respuesta del extremo consigo misma no
 * comprueba nada, y una que lleva los numeros dentro deja de comprobar el dia que
 * el banco cambia, sin avisar.
 *
 * CUATRO VEREDICTOS
 *
 *   FILTRADO CORRECTO     0   se probo y cada modulo dibuja lo suyo
 *   FILTRADO ROTO         1   se probo y NO
 *   NO SE PUDO PROBAR     2   nadie llego a probar nada
 *   NO A ESCALA           3   se probo, pero con el banco de juguete
 *
 * El 2 no es un aprobado con reparos: es la regla de H-013. Y el 3 tampoco: con
 * diez preguntas de juguete repartidas en dos modulos, «cada modulo dibuja lo
 * suyo» se cumple sin que eso diga nada del banco real. Es el patron de H-023.
 *
 * NECESITA EL SERVIDOR LOCAL LEVANTADO Y EL BANCO REAL EN LA BASE LOCAL:
 *
 *   npm run datos:banco-local   (una vez)
 *   npm run datos:dev           (en otra terminal)
 *   npm run probar:filtrado
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { prepararDomFalso } from './dom-falso.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');
const SITIO = join(RAIZ, 'static', 'js');

const BASE_D1 = 'examen-td-js-produccion';
const DIRECCION = process.env.DIRECCION_LOCAL ?? 'http://127.0.0.1:8788';
const ESPERA_SONDEO = 8000;

const CORRECTO = 0;
const ROTO = 1;
const SIN_VEREDICTO = 2;
const NO_A_ESCALA = 3;

/** Mismo piso que scripts/probar-escapado.mjs, y por el mismo motivo. */
const PISO_DE_ESCALA = 100;

/** Cuantas veces se redibuja un modulo para ver si el barajado se mueve. */
const TIRADAS = 20;

/** Modulo que se usa para las pruebas que no necesitan uno en particular. */
const MODULO_DE_MUESTRA = 3;

/** Modulo con el que se prueba el modo degradado. */
const MODULO_DEGRADADO = 4;

const LINEA = '='.repeat(72);

class SinPoder extends Error {
  constructor(motivo, detalle) {
    super(motivo);
    this.detalle = detalle;
  }
}

const noSePudo = (motivo, detalle) => {
  throw new SinPoder(motivo, detalle);
};

/** Anuncia un veredicto con el mismo formato siempre, para leerlo de un vistazo. */
function anunciar(titulo, lineas) {
  console.log(LINEA);
  console.log(titulo);
  console.log(LINEA);
  for (const linea of lineas) console.log(linea);
}

/** Cierra el guion con su codigo, siempre por el mismo sitio. */
function terminar(codigo) {
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
}

/**
 * Corre wrangler contra la base LOCAL y devuelve lo que dijo.
 *
 * Siempre --local y sin shell, por ADR-015: el argumento viaja en el arreglo y no
 * hay linea de comandos que armar ni que esconder. Se mira lo que dijo y no como
 * termino, porque en Windows wrangler se cae al salir y devuelve un codigo sin
 * sentido (H-016).
 */
function wrangler(parametros) {
  const cli = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
  if (!existsSync(cli)) {
    noSePudo('No encontre wrangler en node_modules. Corre `npm install`.');
  }

  const resultado = spawnSync(
    process.execPath,
    [cli, 'd1', 'execute', BASE_D1, '--local', ...parametros],
    { cwd: RAIZ, encoding: 'utf8' }
  );

  return `${resultado.stdout ?? ''}${resultado.stderr ?? ''}`;
}

/**
 * Consulta la base local y devuelve las filas.
 *
 * Con --command y no con --file: para leer se usa la puerta de lectura, que es la
 * regla que dejo la iteracion 21 al descubrir que --file viaja por el extremo de
 * escritura.
 *
 * Devuelve null si no se pudo entender la respuesta, que NO es lo mismo que una
 * respuesta vacia: quien llama tiene que distinguirlo.
 */
function consultar(sql) {
  const salida = wrangler(['--json', `--command=${sql}`]);
  const desde = salida.indexOf('[');
  if (desde === -1) return null;

  try {
    return JSON.parse(salida.slice(desde))?.[0]?.results ?? null;
  } catch {
    return null;
  }
}

/** Los ids que el HTML dibujado trae, en el orden en que salieron. */
const idsDibujados = (html) =>
  [...html.matchAll(/data-pregunta="q(\d+)"/g)].map((m) => Number(m[1]));

/** El bloque de una pregunta dentro del HTML dibujado, o '' si no esta. */
function bloqueDePregunta(html, id) {
  const marca = `data-pregunta="q${id}"`;
  const desde = html.indexOf(marca);
  if (desde === -1) return '';

  const siguiente = html.indexOf('data-pregunta="q', desde + marca.length);
  return siguiente === -1 ? html.slice(desde) : html.slice(desde, siguiente);
}

/**
 * Los textos de las alternativas de un bloque, en el orden en que se dibujaron.
 *
 * Vienen ya escapados, que es como estan en el HTML: quien compare tiene que
 * escapar el otro lado, no desescapar este.
 */
const alternativasDibujadas = (bloque) =>
  [...bloque.matchAll(/<span>([^<]*)<\/span>\s*<\/button>/g)].map((m) => m[1]);

// ---------------------------------------------------------------------------
// 1 · Sondear el servidor local
// ---------------------------------------------------------------------------

const fetchReal = globalThis.fetch;

async function hayAlguienEnElPuerto() {
  const { hostname, port } = new URL(DIRECCION);
  const { Socket } = await import('node:net');

  return new Promise((resolver) => {
    const socket = new Socket();
    const cerrar = (respuesta) => {
      socket.destroy();
      resolver(respuesta);
    };

    socket.setTimeout(2000);
    socket.once('connect', () => cerrar(true));
    socket.once('timeout', () => cerrar(false));
    socket.once('error', () => cerrar(false));
    socket.connect(Number(port), hostname);
  });
}

try {
  const sondeo = await fetchReal(`${DIRECCION}/api/estado`, {
    signal: AbortSignal.timeout(ESPERA_SONDEO),
  });

  if (!sondeo.ok) {
    anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
      `${DIRECCION}/api/estado respondio ${sondeo.status}.`,
      '',
      'Hay un servidor levantado, pero no esta sirviendo la capa de datos.',
    ]);
    terminar(SIN_VEREDICTO);
  }
} catch (error) {
  const alguien = await hayAlguienEnElPuerto();

  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    ...(alguien
      ? [
          `HAY alguien escuchando en ${DIRECCION}, pero no contesta.`,
          '',
          'Esto NO se arregla levantando el servidor: el puerto ya esta tomado.',
          'Lo normal es un wrangler de una sesion anterior que quedo vivo. Matalo',
          'por su padre, no por el workerd que escucha.',
        ]
      : [
          `No hay nadie escuchando en ${DIRECCION}.`,
          '',
          'Levanta el servidor local en otra terminal y vuelve a correrlo:',
          '',
          '  npm run datos:dev',
          '  npm run probar:filtrado',
        ]),
    '',
    `Detalle: ${error.message}`,
    '',
    'Nadie llego a probar el filtrado, asi que no se sabe si funciona.',
  ]);
  terminar(SIN_VEREDICTO);
}

// ---------------------------------------------------------------------------
// 2 · Lo que el BANCO dice que hay. Es contra esto que se compara el dibujo.
// ---------------------------------------------------------------------------

let codigo = CORRECTO;
const problemas = [];
const notas = [];

try {
  const porModulo = consultar(
    'SELECT modulo, COUNT(*) AS cuantas FROM pregunta_activa GROUP BY modulo ORDER BY modulo;'
  );

  if (!porModulo || porModulo.length === 0) {
    noSePudo(
      'La base local no devolvio ningun modulo con preguntas activas.',
      'Cargala con `npm run datos:banco-local`, o aplica las migraciones si esta recien hecha.'
    );
  }

  const filasIds = consultar('SELECT id, modulo FROM pregunta_activa ORDER BY modulo, id;');
  if (!filasIds) noSePudo('La base local no devolvio los ids de las preguntas activas.');

  /** modulo -> Set de ids que le pertenecen, segun la base. */
  const idsDelBanco = new Map();
  for (const fila of filasIds) {
    if (!idsDelBanco.has(fila.modulo)) idsDelBanco.set(fila.modulo, new Set());
    idsDelBanco.get(fila.modulo).add(fila.id);
  }

  const modulos = porModulo.map((f) => f.modulo);
  const totalDelBanco = porModulo.reduce((suma, f) => suma + f.cuantas, 0);

  // ------------------------------------------------------------------------
  // 3 · DOM falso, fetch apuntando al servidor local, y el componente real
  // ------------------------------------------------------------------------

  const dom = prepararDomFalso();
  globalThis.fetch = (ruta, opciones) => fetchReal(DIRECCION + ruta, opciones);

  const { mostrarModulo, renderCuestionario } = await import(
    pathToFileURL(join(SITIO, 'components', 'cuestionario.js')).href
  );
  const { esc } = await import(pathToFileURL(join(SITIO, 'utils', 'dom.js')).href);

  // ------------------------------------------------------------------------
  // 4 · El estado vacio. Va PRIMERO, porque es el unico momento en que todavia
  //     no se ha dibujado ningun modulo y se puede comprobar que no hay ninguno.
  // ------------------------------------------------------------------------

  renderCuestionario();

  const vacio = dom.html('#cuestionario');
  const idsEnVacio = idsDibujados(vacio);

  if (idsEnVacio.length !== 0) {
    problemas.push(
      `el estado vacio dibujo ${idsEnVacio.length} preguntas, y no tenia que dibujar ninguna`
    );
  }
  if (!vacio.includes('Elige un módulo para empezar')) {
    problemas.push('el estado vacio no dice que hay que elegir un modulo');
  }
  if (!vacio.includes('data-ir-al-selector')) {
    problemas.push('el estado vacio no lleva el enlace al selector');
  }
  if (!dom.oculto('#contador-banco') || dom.html('#contador-banco') !== '') {
    problemas.push('el contador de la portada no esta escondido con la pagina vacia');
  }
  if (dom.texto('#total-preguntas') !== '0') {
    problemas.push(
      `con la pagina vacia el panel dice «${dom.texto('#total-preguntas')}» preguntas, y son 0`
    );
  }
  if (dom.texto('#mensaje-avance') !== 'Elige un módulo para comenzar.') {
    problemas.push(
      `con la pagina vacia el panel dice «${dom.texto('#mensaje-avance')}», que no manda a elegir`
    );
  }

  notas.push(`Estado vacio: 0 preguntas dibujadas, contador escondido, panel en 0.`);

  // ------------------------------------------------------------------------
  // 5 · El selector trae los siete modulos, y NINGUNA cifra todavia
  // ------------------------------------------------------------------------

  const selectorVacio = dom.html('#selector-modulo');
  const valores = [...selectorVacio.matchAll(/<option value="(\d*)"/g)].map((m) => m[1]);

  if (valores[0] !== '') {
    problemas.push('el selector no arranca con la alternativa vacia «Elige un módulo…»');
  }

  const ofrecidos = valores.slice(1).map(Number);
  if (ofrecidos.join(',') !== '2,3,4,5,6,7,8') {
    problemas.push(`el selector ofrece «${ofrecidos.join(', ')}» y tenia que ofrecer del 2 al 8`);
  }

  if (/preguntas<\/option>/.test(selectorVacio)) {
    problemas.push(
      'el selector promete cifras antes de haber pedido ningun modulo: ese numero no puede ' +
        'salir de ningun dato, que es el «105 preguntas» del 2026-09-08'
    );
  }

  notas.push(`Selector: ${ofrecidos.length} modulos ofrecidos, sin cifras antes de elegir.`);

  // ------------------------------------------------------------------------
  // 6 · Cada modulo dibuja exactamente lo suyo
  // ------------------------------------------------------------------------

  const dibujadoPorModulo = new Map();

  for (const fila of porModulo) {
    await mostrarModulo(fila.modulo);

    const html = dom.html('#cuestionario');
    const ids = idsDibujados(html);
    dibujadoPorModulo.set(fila.modulo, ids.length);

    if (ids.length !== fila.cuantas) {
      problemas.push(
        `modulo ${fila.modulo}: se dibujaron ${ids.length} preguntas y la base tiene ${fila.cuantas}`
      );
    }

    // Ninguna ajena, comprobado sobre el contenido dibujado.
    const suyos = idsDelBanco.get(fila.modulo) ?? new Set();
    const intrusas = ids.filter((id) => !suyos.has(id));
    if (intrusas.length > 0) {
      problemas.push(
        `modulo ${fila.modulo}: se colaron ${intrusas.length} preguntas de otro modulo ` +
          `(ids ${intrusas.slice(0, 8).join(', ')})`
      );
    }

    // Repetidas: el mismo id dos veces cuenta bien y se ve mal.
    if (new Set(ids).size !== ids.length) {
      problemas.push(`modulo ${fila.modulo}: hay preguntas dibujadas mas de una vez`);
    }

    // Una sola cabecera de modulo, y que sea la de este.
    const cabeceras = [...html.matchAll(/Módulo (\d+)<\/span>/g)].map((m) => Number(m[1]));
    if (cabeceras.length !== 1 || cabeceras[0] !== fila.modulo) {
      problemas.push(
        `modulo ${fila.modulo}: se dibujaron las cabeceras «${cabeceras.join(', ')}» y tenia ` +
          'que haber una sola, la suya'
      );
    }

    // El contador de la portada, comprobado contra lo dibujado y no contra la
    // respuesta del extremo.
    const contador = dom.html('#contador-banco');
    const dice = contador.match(/>(\d+) preguntas · módulo (\d+)</);

    if (!dice) {
      problemas.push(`modulo ${fila.modulo}: el contador de la portada no dice lo que muestra`);
    } else {
      if (Number(dice[1]) !== ids.length) {
        problemas.push(
          `modulo ${fila.modulo}: el contador dice ${dice[1]} preguntas y se dibujaron ${ids.length}`
        );
      }
      if (Number(dice[2]) !== fila.modulo) {
        problemas.push(
          `modulo ${fila.modulo}: el contador dice que es el modulo ${dice[2]}`
        );
      }
    }

    // El panel mide el modulo, no el banco.
    if (dom.texto('#total-preguntas') !== String(ids.length)) {
      problemas.push(
        `modulo ${fila.modulo}: el panel dice «${dom.texto('#total-preguntas')}» y se dibujaron ${ids.length}`
      );
    }

    // Y el selector, ya con la cifra aprendida de lo dibujado.
    const rotulo = new RegExp(`Módulo ${fila.modulo} · [^<]*· ${ids.length} preguntas`);
    if (!rotulo.test(dom.html('#selector-modulo'))) {
      problemas.push(
        `modulo ${fila.modulo}: despues de dibujarlo, el selector no muestra sus ${ids.length} preguntas`
      );
    }
  }

  notas.push(
    `Dibujado por modulo: ${[...dibujadoPorModulo].map(([m, c]) => `${m}=${c}`).join(', ')} ` +
      `(total ${totalDelBanco} en la base).`
  );

  // ------------------------------------------------------------------------
  // 7 · El selector sigue libre despues de elegir
  // ------------------------------------------------------------------------

  const recorrido = [MODULO_DE_MUESTRA, 5, MODULO_DE_MUESTRA];
  const vistos = [];

  for (const numero of recorrido) {
    await mostrarModulo(numero);
    const ids = idsDibujados(dom.html('#cuestionario'));
    const esperadas = porModulo.find((f) => f.modulo === numero)?.cuantas;

    vistos.push(`${numero}→${ids.length}`);

    if (ids.length !== esperadas) {
      problemas.push(
        `al recorrer ${recorrido.join(' → ')}, el modulo ${numero} dibujo ${ids.length} ` +
          `preguntas en vez de ${esperadas}`
      );
    }
    if (dom.nodo('#selector-modulo').value !== String(numero)) {
      problemas.push(
        `al recorrer ${recorrido.join(' → ')}, el selector quedo en ` +
          `«${dom.nodo('#selector-modulo').value}» y el modulo dibujado es el ${numero}`
      );
    }
  }

  notas.push(`Selector libre: ${vistos.join(', ')} sin recargar.`);

  // ------------------------------------------------------------------------
  // 8 · La marca de orden fijo se respeta, y el barajado se mueve
  // ------------------------------------------------------------------------

  const fijas = consultar(
    "SELECT id, modulo FROM pregunta WHERE orden_fijo = 1 AND estado = 'activa' ORDER BY id;"
  );

  if (!fijas || fijas.length === 0) {
    // No se afirma que se respete lo que no existe. Tampoco es un fallo del
    // filtrado: es que no hay nada que comprobar, y se dice.
    notas.push('Orden fijo: la base local no tiene ninguna pregunta marcada. No se comprobo.');
  } else {
    for (const fija of fijas) {
      const orden = consultar(
        `SELECT texto FROM alternativa WHERE pregunta_id = ${fija.id} ORDER BY orden;`
      );

      if (!orden || orden.length === 0) {
        problemas.push(`la pregunta ${fija.id}, de orden fijo, no tiene alternativas en la base`);
        continue;
      }

      const esperado = orden.map((a) => esc(a.texto)).join(' | ');
      const salidas = new Set();

      // Una sola pregunta que no baraja podria estar «quieta» porque el barajado
      // entero se rompio. Por eso en la misma tirada se vigila otra pregunta del
      // mismo modulo, que SI tiene que moverse.
      let testigo = null;
      const salidasTestigo = new Set();

      for (let i = 0; i < TIRADAS; i += 1) {
        await mostrarModulo(fija.modulo);
        const html = dom.html('#cuestionario');

        salidas.add(alternativasDibujadas(bloqueDePregunta(html, fija.id)).join(' | '));

        const otros = idsDibujados(html).filter((id) => id !== fija.id);
        testigo ??= otros[0];
        if (testigo !== undefined) {
          salidasTestigo.add(alternativasDibujadas(bloqueDePregunta(html, testigo)).join(' | '));
        }
      }

      if (salidas.size !== 1) {
        problemas.push(
          `la pregunta ${fija.id} es de orden fijo y sus alternativas salieron en ` +
            `${salidas.size} ordenes distintos en ${TIRADAS} cargas`
        );
      } else if (![...salidas][0] || [...salidas][0] !== esperado) {
        problemas.push(
          `la pregunta ${fija.id} mantiene un orden estable, pero no el de la base:\n` +
            `      base:     ${esperado}\n` +
            `      dibujado: ${[...salidas][0]}`
        );
      }

      if (testigo !== undefined && salidasTestigo.size < 2) {
        problemas.push(
          `en ${TIRADAS} cargas, la pregunta ${testigo} —que SI debe barajarse— salio ` +
            'siempre igual: el barajado de ADR-006 no se esta aplicando'
        );
      }

      notas.push(
        `Orden fijo: la pregunta ${fija.id} (modulo ${fija.modulo}) salio siempre igual en ` +
          `${TIRADAS} cargas, y la ${testigo} vario ${salidasTestigo.size} veces.`
      );
    }
  }

  // ------------------------------------------------------------------------
  // 8b · El aviso antes de perder el avance
  //
  // LO QUE ESTA SECCION PRUEBA, Y LO QUE NO
  //
  // Prueba la DECISION: con respuestas dentro, cambiar de modulo no se ejecuta y
  // el aviso aparece diciendo cuantas se pierden; sin respuestas, el cambio pasa
  // directo y el aviso no aparece. Y prueba el orden que importa —que el selector
  // vuelva a su sitio ANTES de preguntar—, porque si se preguntara primero habria
  // un rato en que la pantalla dice un modulo y las preguntas son de otro.
  //
  // NO prueba que el aviso se VEA, ni que el foco caiga donde debe. Eso necesita
  // un navegador y se comprueba abriendo la pagina.
  // ------------------------------------------------------------------------

  const selector = dom.nodo('#selector-modulo');

  /** Deja el componente en un modulo, esperando a que termine de dibujarlo. */
  const asentar = async (numero) => {
    await mostrarModulo(numero);
  };

  /** Simula que el estudiante respondio una pregunta del modulo dibujado. */
  const responderUna = () => {
    const boton = dom.nodo('#un-boton-de-alternativa');
    boton.disabled = false;
    boton.dataset.correct = 'true';

    return dom.disparar('#cuestionario', 'click', {
      target: { closest: (s) => (s === '.quiz-option' ? boton : null) },
    });
  };

  /** Simula que el estudiante elige otra alternativa del selector. */
  const elegirEnElSelector = (numero) => {
    selector.value = String(numero);
    return dom.disparar('#selector-modulo', 'change');
  };

  if (selector.oyentes.get('change') === undefined) {
    problemas.push('el componente no se ato al selector: ningun cambio de modulo llegaria');
  }

  // --- caso A: sin nada respondido, NO avisa -------------------------------
  await asentar(MODULO_DE_MUESTRA);
  elegirEnElSelector(5);

  const avisoSinNadaQuePerder = dom.html('#aviso-cambio-modulo');
  if (avisoSinNadaQuePerder !== '' || !dom.oculto('#aviso-cambio-modulo')) {
    problemas.push(
      'cambiar de modulo SIN nada respondido saco el aviso igual: avisar cuando no hay ' +
        'nada que perder entrena a ignorar los avisos'
    );
  }

  // El cambio ademas tiene que haber ocurrido de verdad.
  await new Promise((listo) => setTimeout(listo, 1500));
  if (idsDibujados(dom.html('#cuestionario')).length !==
      porModulo.find((f) => f.modulo === 5)?.cuantas) {
    problemas.push('sin nada respondido, el cambio de modulo no llego a dibujarse');
  }

  // --- caso B: con algo respondido, SI avisa y NO cambia --------------------
  await asentar(MODULO_DE_MUESTRA);
  const oyentesDelClic = responderUna();

  if (oyentesDelClic === 0) {
    problemas.push('el componente no se ato a la zona de preguntas: responder no haria nada');
  }
  if (dom.texto('#valor-avance') !== '1') {
    problemas.push(
      `tras responder una pregunta el panel dice «${dom.texto('#valor-avance')}» respondidas`
    );
  }

  const idsAntes = idsDibujados(dom.html('#cuestionario')).join(',');
  elegirEnElSelector(6);

  const aviso = dom.html('#aviso-cambio-modulo');

  if (dom.oculto('#aviso-cambio-modulo') || aviso === '') {
    problemas.push(
      'cambiar de modulo con 1 respuesta dentro NO avisó: se perderia en silencio, que es ' +
        'lo que esta iteracion existe para impedir'
    );
  }
  if (!aviso.includes('1 respuesta')) {
    problemas.push('el aviso no dice cuantas respuestas se van a perder');
  }
  if (!aviso.includes(`¿Cambiar al Módulo 6?`)) {
    problemas.push('el aviso no dice a que modulo se iba a cambiar');
  }
  if (selector.value !== String(MODULO_DE_MUESTRA)) {
    problemas.push(
      `el selector quedo en «${selector.value}» mientras el aviso preguntaba: tiene que ` +
        'volver al modulo actual ANTES de preguntar'
    );
  }
  if (idsDibujados(dom.html('#cuestionario')).join(',') !== idsAntes) {
    problemas.push('el aviso aparecio DESPUES de redibujar: el avance ya estaba perdido');
  }

  // --- caso C: «Quedarme acá» deja todo como estaba ------------------------
  dom.disparar('#aviso-cambio-modulo', 'click', {
    target: { closest: (s) => (s === '[data-cancelar-cambio]' ? {} : null) },
  });

  if (!dom.oculto('#aviso-cambio-modulo') || dom.html('#aviso-cambio-modulo') !== '') {
    problemas.push('«Quedarme acá» no retiro el aviso');
  }
  if (selector.value !== String(MODULO_DE_MUESTRA)) {
    problemas.push('«Quedarme acá» movio el selector');
  }
  if (dom.texto('#valor-avance') !== '1') {
    problemas.push('«Quedarme acá» perdio la respuesta igual');
  }

  // --- caso D: «Cambiar de módulo» si cambia, y recien ahi se pierde --------
  dom.disparar('#aviso-cambio-modulo', 'click', {
    target: {
      closest: (s) =>
        s === '[data-confirmar-cambio]' ? { dataset: { confirmarCambio: '6' } } : null,
    },
  });

  await new Promise((listo) => setTimeout(listo, 1500));

  const tras = idsDibujados(dom.html('#cuestionario'));
  if (tras.length !== porModulo.find((f) => f.modulo === 6)?.cuantas) {
    problemas.push(
      `tras confirmar el cambio se dibujaron ${tras.length} preguntas y el modulo 6 tiene ` +
        `${porModulo.find((f) => f.modulo === 6)?.cuantas}`
    );
  }
  if (dom.texto('#valor-avance') !== '0') {
    problemas.push('tras confirmar el cambio, el panel no partio de cero');
  }
  if (!dom.oculto('#aviso-cambio-modulo')) {
    problemas.push('el aviso siguio en pantalla despues de cambiar');
  }

  notas.push(
    'Aviso de perdida: sin respuestas no aparece y el cambio pasa directo; con 1 respuesta ' +
      'aparece, el selector vuelve solo y las preguntas no se tocan.'
  );
  notas.push(
    '«Quedarme acá» conserva la respuesta; «Cambiar de módulo» cambia y recien ahi el panel ' +
      'vuelve a cero.'
  );

  // ------------------------------------------------------------------------
  // 9 · El modo degradado filtra igual (ADR-008)
  //
  // Se provoca la caida de verdad: se deja el fetch inservible, que es lo que ve
  // el navegador cuando no hay red o la capa de datos no contesta. Va al final
  // porque a partir de aqui el servidor deja de usarse.
  // ------------------------------------------------------------------------

  const instantanea = await import(
    pathToFileURL(join(SITIO, 'data', 'instantanea-banco.js')).href
  );

  const enLaInstantanea = instantanea.PREGUNTAS.filter(
    (p) => p.modulo === MODULO_DEGRADADO
  ).length;

  globalThis.fetch = () => Promise.reject(new Error('caida provocada'));

  await mostrarModulo(MODULO_DEGRADADO);

  const htmlCaido = dom.html('#cuestionario');
  const idsCaido = idsDibujados(htmlCaido);
  const ajenasCaido = idsCaido.filter((id) => {
    const p = instantanea.PREGUNTAS.find((q) => q.id === id);
    return !p || p.modulo !== MODULO_DEGRADADO;
  });

  if (idsCaido.length !== enLaInstantanea) {
    problemas.push(
      `con la capa de datos caida, el modulo ${MODULO_DEGRADADO} dibujo ${idsCaido.length} ` +
        `preguntas y la instantanea tiene ${enLaInstantanea}`
    );
  }
  if (ajenasCaido.length > 0) {
    problemas.push(
      `con la capa de datos caida se colaron ${ajenasCaido.length} preguntas de otro modulo`
    );
  }
  if (dom.oculto('#aviso-respaldo')) {
    problemas.push(
      'con la capa de datos caida el sitio sirvio la copia SIN avisar, que es lo que ADR-008 prohibe'
    );
  }
  if (!dom.html('#aviso-respaldo').includes('copia guardada')) {
    problemas.push('el aviso de respaldo no dice que lo que se ve es una copia guardada');
  }

  notas.push(
    `Modo degradado: con el fetch caido, el modulo ${MODULO_DEGRADADO} dibujo ` +
      `${idsCaido.length} preguntas desde la instantanea, con el aviso de ADR-008 a la vista.`
  );

  // ------------------------------------------------------------------------
  // 10 · Veredicto
  // ------------------------------------------------------------------------

  if (problemas.length > 0) {
    codigo = ROTO;
    anunciar(`FILTRADO ROTO  ***  ${problemas.length}  ***`, [
      ...problemas.map((p) => `  ${p}`),
      '',
      'La pagina no esta dibujando lo que dice estar dibujando.',
    ]);
  } else if (totalDelBanco < PISO_DE_ESCALA) {
    codigo = NO_A_ESCALA;
    anunciar('MECANISMO EN PIE, PERO NO A ESCALA  ***  ESTO NO ES UN APROBADO  ***', [
      'Cada modulo dibujo exactamente lo suyo y ninguna pregunta se colo.',
      '',
      `Pero la base local trae ${totalDelBanco} preguntas en ${modulos.length} modulo(s), y con`,
      `menos de ${PISO_DE_ESCALA} esto revisa el banco de juguete: «cada modulo dibuja lo suyo»`,
      'se cumple solo, y no dice nada del banco real.',
      '',
      'Carga el respaldo versionado en la base local y repite:',
      '',
      '  npm run datos:banco-local',
      '  npm run probar:filtrado',
    ]);
  } else {
    anunciar('FILTRADO CORRECTO', [
      ...notas.map((n) => `  ${n}`),
      '',
      'Todo lo anterior se conto sobre el HTML que el componente escribio, no sobre',
      'la respuesta del extremo, y se comparo contra la base local consultada aparte.',
      '',
      'Del aviso al cambiar de modulo se probo la DECISION —cuando aparece, que dice,',
      'y que el selector vuelva antes de preguntar—, disparando los eventos que el',
      'componente registro.',
      '',
      'Lo que esto NO prueba: nada de lo que solo existe en un navegador. Que el aviso',
      'se VEA, que el foco caiga donde debe, que el teclado lo alcance y como se apila',
      'en telefono no se comprueban con un DOM falso: hay que abrir la pagina.',
    ]);
  }
} catch (error) {
  if (!(error instanceof SinPoder)) throw error;

  codigo = SIN_VEREDICTO;
  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    error.message,
    ...(error.detalle ? ['', error.detalle] : []),
    '',
    'Nadie llego a probar el filtrado, asi que no se sabe si funciona.',
    'Esto NO significa que este bien, ni que este mal.',
  ]);
}

terminar(codigo);
