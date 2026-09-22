/**
 * Guardian del escapado del banco de preguntas.
 *
 * POR QUE EXISTE
 *
 * Desde la iteracion 22 el contenido del cuestionario viene de D1 y no del
 * repositorio. Eso significa que lo escribe quien tenga acceso a la base, y que
 * el escapado dejo de ser higiene para volverse una barrera de seguridad (H-003).
 * Una barrera que nadie vuelve a probar no es una barrera: es una suposicion.
 *
 * Este guion carga contenido hostil de verdad en la base D1 LOCAL, corre el
 * codigo real del componente contra la respuesta real del extremo, comprueba el
 * HTML resultante, y deja la base como estaba.
 *
 * COMO SE PRUEBA, Y POR QUE NO COMO PARECE
 *
 * Buscar «onerror=» en el HTML NO sirve: dentro de un texto ya escapado esa
 * cadena aparece igual, como texto inofensivo, y la prueba grita cuando todo esta
 * bien. Se comprobo, y fue el primer intento de este mismo guion.
 *
 * La comprobacion correcta son dos afirmaciones por cada dato que salio de la
 * base:
 *
 *   1. su forma CRUDA no aparece en el HTML   -> ningun caracter se colo
 *   2. su forma ESCAPADA si aparece           -> el texto llego entero al lector
 *
 * La segunda no es un adorno: un escapado que ademas borra texto rompe preguntas
 * en vez de protegerlas, y sin esa comprobacion pasaria por bueno.
 *
 * Y una tercera, independiente de las anteriores: que en el HTML no exista
 * ninguna etiqueta que el componente no emita.
 *
 * CUATRO VEREDICTOS
 *
 *   ESCAPADO EN PIE       0   se probo y aguanto
 *   ESCAPADO ROTO         1   se probo y NO aguanto
 *   NO SE PUDO PROBAR     2   nadie llego a probar nada
 *   BASE SUCIA            3   la prueba termino y el contenido hostil quedo dentro
 *
 * El 2 no es un aprobado con reparos. Es la regla que dejo H-013.
 *
 * El 3 se anadio con H-017, y aunque habla de la prueba y no del sitio es el mas
 * urgente de los cuatro: una base local con la fila 900 dentro le dibuja al autor
 * una pregunta hostil y un icono roto la proxima vez que abra el navegador, y
 * nada se lo anuncia.
 *
 * EL ORDEN DE LOS PASOS ES PARTE DE LA PRUEBA
 *
 * Primero se sondea el servidor y solo despues se carga el contenido hostil. Al
 * reves —como estaba hasta el 2026-09-05— quedarse sin servidor dejaba la base
 * envenenada, porque el `finally` que la limpiaba nunca llegaba a correr. H-017.
 *
 * NECESITA EL SERVIDOR LOCAL LEVANTADO:
 *
 *   npm run datos:dev        (en otra terminal)
 *   npm run probar:escapado
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { almacenDeMentira, prepararDomFalso, relojDeMentira } from './dom-falso.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');
const SITIO = join(RAIZ, 'static', 'js');

const BASE_D1 = 'examen-td-js-produccion';
const DIRECCION = process.env.DIRECCION_LOCAL ?? 'http://127.0.0.1:8788';
const ID_HOSTIL = 900;
const MODULO_HOSTIL = 2;
const ICONO_LIMPIO = 'devices';
const ESPERA_SONDEO = 8000;

const EN_PIE = 0;
const ROTO = 1;
const SIN_VEREDICTO = 2;
const BASE_SUCIA = 3;
const NO_A_ESCALA = 4;

/**
 * Cuantas preguntas tiene que traer la base local para que la revision del banco
 * valga como «a escala» (ADR-024).
 *
 * El numero no sale de una formula: sale de que el banco de juguete trae 10 y el
 * real trae 368. Cualquier corte entre medio separa los dos casos. Se pone en 100
 * para que siga separandolos aunque el banco real encoja.
 *
 * POR QUE HAY UN PISO Y NO SOLO UN CONTADOR IMPRESO
 *
 * Hasta el 2026-09-10 esta seccion revisaba «lo que la base local tuviera dentro»
 * y daba verde igual. Con el banco real da verde diciendo la verdad; con el de
 * juguete daba verde revisando 10 filas y diciendolo en una linea que nadie mira.
 * Eso es el patron de H-023: la comprobacion deja de comprobar y no lo dice en el
 * veredicto, que es la unica parte que se lee.
 */
const PISO_DE_ESCALA = 100;

const LINEA = '='.repeat(72);

/**
 * Corta la prueba sin veredicto.
 *
 * Se LANZA, no se sale. Hasta el 2026-09-05 esto llamaba a `process.exit(2)`
 * desde dentro del `try`, y `process.exit()` no ejecuta los `finally`: el
 * contenido hostil se quedaba dentro de la base. Ver H-017.
 */
class SinVeredicto extends Error {
  constructor(motivo, detalle) {
    super(motivo);
    this.detalle = detalle;
  }
}

const sinVeredicto = (motivo, detalle) => {
  throw new SinVeredicto(motivo, detalle);
};

/**
 * Corre wrangler contra la base LOCAL y devuelve lo que dijo.
 *
 * Siempre --local y sin shell, por ADR-015: el argumento viaja en el arreglo y
 * no hay linea de comandos que armar ni que esconder.
 *
 * Devuelve el texto de las dos salidas y no el codigo de salida, porque en
 * Windows wrangler se cae al terminar y devuelve un codigo sin sentido (H-016).
 * Se mira lo que dijo, no como termino.
 */
function wrangler(parametros) {
  const cli = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
  if (!existsSync(cli)) {
    sinVeredicto('No encontre wrangler en node_modules. Corre `npm install`.');
  }

  const resultado = spawnSync(
    process.execPath,
    [cli, 'd1', 'execute', BASE_D1, '--local', ...parametros],
    { cwd: RAIZ, encoding: 'utf8' }
  );

  return `${resultado.stdout ?? ''}${resultado.stderr ?? ''}`;
}

/** Aplica un .sql. Sin veredicto si wrangler no dice que lo aplico. */
function aplicarSql(archivoSql) {
  const salida = wrangler([`--file=${archivoSql}`]);

  if (!/command[s]? executed successfully/i.test(salida)) {
    sinVeredicto(`wrangler no aplico ${archivoSql}.`, salida.trim());
  }

  return salida;
}

/**
 * Consulta la base local y devuelve las filas.
 *
 * Con --command y no con --file: para leer se usa la puerta de lectura, que es
 * la regla que dejo la iteracion 21 al descubrir que --file viaja por el extremo
 * de escritura.
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

// ---------------------------------------------------------------------------
// 1 · Sondear el servidor ANTES de tocar la base
//
// Si no hay servidor no hay nada que probar, y lo que importa de hacerlo aqui es
// que en ese caso todavia no se ha cargado nada hostil: no hay veneno que
// retirar ni base que pueda quedar sucia. H-017.
// ---------------------------------------------------------------------------

const fetchReal = globalThis.fetch;
const CONSULTA = `${DIRECCION}/api/preguntas?modulo=${MODULO_HOSTIL}`;

/**
 * Pregunta si hay alguien aceptando conexiones en el puerto, sin pedirle nada.
 *
 * POR QUE HACE FALTA, ademas del sondeo HTTP
 *
 * «No contesta» tiene dos causas que se arreglan de forma distinta, y hasta el
 * 2026-09-11 este guion las trataba igual: decia «no hay nadie escuchando» en
 * los dos casos.
 *
 *   - No hay nadie      -> falta levantar el servidor. Se arregla levantandolo.
 *   - Hay alguien mudo  -> el puerto esta tomado por un proceso que acepta la
 *                          conexion y no responde. Levantar otro servidor NO lo
 *                          arregla: el nuevo no puede tomar el puerto, y quien
 *                          contesta —o deja de contestar— sigue siendo el viejo.
 *
 * El segundo caso ocurrio de verdad: un `wrangler` huerfano de una sesion
 * anterior seguia vivo, y cada vez que se mataba su `workerd` el padre lo
 * reponia y volvia a tomar el 8788. El mensaje mandaba a levantar el servidor,
 * que era justamente lo que no servia.
 *
 * Distinguirlos es barato: se abre un socket y se mira si conecta.
 */
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
  const sondeo = await fetchReal(CONSULTA, { signal: AbortSignal.timeout(ESPERA_SONDEO) });

  if (!sondeo.ok) {
    anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
      `${CONSULTA} respondio ${sondeo.status}.`,
      '',
      'Hay un servidor levantado, pero no esta sirviendo la capa de datos.',
      '',
      'No se cargo ningun contenido hostil: la base local esta intacta.',
    ]);
    terminar(SIN_VEREDICTO);
  }
} catch (error) {
  // Antes de decir «no hay nadie», comprobarlo. Son dos fallos distintos y el
  // consejo de uno no sirve para el otro.
  const alguien = await hayAlguienEnElPuerto();

  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    ...(alguien
      ? [
          `HAY alguien escuchando en ${DIRECCION}, pero no contesta.`,
          '',
          'Esto NO se arregla levantando el servidor: el puerto ya esta tomado,',
          'y quien lo tiene es un proceso que acepta la conexion y se queda mudo.',
          'Lo normal es un wrangler de una sesion anterior que quedo vivo.',
          '',
          'Mira quien lo tiene y matalo POR SU PADRE, no por el que escucha:',
          'si matas solo al workerd, el wrangler que lo lanzo lo repone y vuelve',
          'a tomar el puerto.',
          '',
          '  Get-NetTCPConnection -LocalPort 8788 | Select-Object OwningProcess',
          `  Get-CimInstance Win32_Process -Filter "Name='workerd.exe'" |`,
          '    Select-Object ProcessId, ParentProcessId',
          '  Stop-Process -Id <el ParentProcessId> -Force',
          '',
          `Detalle: ${error.message}`,
        ]
      : [
          `No hay nadie escuchando en ${DIRECCION}.`,
          '',
          'Levanta el servidor local en otra terminal y vuelve a correrlo:',
          '',
          '  npm run datos:dev',
          '  npm run probar:escapado',
          '',
          `Detalle: ${error.message}`,
        ]),
    '',
    'No se cargo ningun contenido hostil: la base local esta intacta.',
    'Y esto NO significa que el escapado este bien, ni que este mal: significa',
    'que nadie lo probo.',
  ]);
  terminar(SIN_VEREDICTO);
}

// ---------------------------------------------------------------------------
// 2 · Cargar el contenido hostil
// ---------------------------------------------------------------------------

/**
 * Un almacen de mentira, para que la fila hostil llegue RESTAURADA.
 *
 * Hasta la iteracion 34 este guion corria sin `localStorage`, y eso bastaba porque
 * la justificacion no se dibujaba. Ahora se dibuja por dos caminos y cada uno hay
 * que provocarlo:
 *
 *   - **restaurada** -> «Ver por qué», que inserta el texto al pulsarlo. Para eso
 *     hace falta que el sitio encuentre una respuesta guardada, y para eso hace
 *     falta un almacen.
 *   - **respondida ahora** -> la inserta `responder()`. Se provoca respondiendo.
 *
 * Se siembra mas abajo, en cuanto se sabe que texto tiene la alternativa: el objeto
 * es el mismo, asi que instalarlo vacio aqui y llenarlo despues es legitimo.
 */
const almacen = almacenDeMentira();
const dom = prepararDomFalso({ almacen });

const claveDelModulo = (modulo) => `examen-td-js.avance.modulo-${modulo}`;

let codigo = EN_PIE;
let cargado = false;

try {
  aplicarSql(join(RAIZ, 'd1', 'prueba-escapado.sql'));
  cargado = true;

  // --- 3 · pedir el banco al extremo real ---------------------------------
  let crudo;
  try {
    const respuesta = await fetchReal(CONSULTA, { signal: AbortSignal.timeout(ESPERA_SONDEO) });
    crudo = await respuesta.json();
  } catch (error) {
    sinVeredicto(`Se cayo la consulta a ${CONSULTA}.`, error.message);
  }

  if (!crudo?.ok) {
    sinVeredicto('El extremo no devolvio un banco.', JSON.stringify(crudo, null, 2));
  }

  const hostil = crudo.datos.find((p) => p.id === ID_HOSTIL);
  if (!hostil) {
    sinVeredicto(
      `La fila hostil ${ID_HOSTIL} no llego desde el extremo.`,
      'Se cargo en la base local, pero el extremo no la devolvio: puede que el servidor este apuntando a otra base.'
    );
  }

  // --- 4 · correr el componente real --------------------------------------
  //
  // Se pide EL MODULO de la fila hostil, y no el banco entero, porque desde la
  // iteracion 31 la pagina dibuja un modulo a la vez: `renderCuestionario()` ya no
  // dibuja preguntas, deja el estado vacio esperando una eleccion. Llamarla aqui
  // capturaria un HTML sin preguntas y esta prueba daria verde sin haber mirado
  // nada, que es el patron de H-023.
  globalThis.fetch = (ruta, opciones) => fetchReal(DIRECCION + ruta, opciones);

  const { mostrarModulo } = await import(
    pathToFileURL(join(SITIO, 'components', 'cuestionario.js')).href
  );
  const { esc } = await import(pathToFileURL(join(SITIO, 'utils', 'dom.js')).href);

  // La fila hostil llega RESTAURADA: se siembra una respuesta suya en el almacen,
  // con el texto de su primera alternativa, que es lo que el sitio guarda (ADR-034).
  // Asi la pregunta 900 se dibuja con «Ver por qué» y su justificacion detras.
  almacen.datos.set(
    claveDelModulo(MODULO_HOSTIL),
    JSON.stringify({
      v: 1,
      modulo: MODULO_HOSTIL,
      respuestas: { [ID_HOSTIL]: hostil.alternativas[0].texto },
    })
  );

  await mostrarModulo(MODULO_HOSTIL);
  const html = dom.html('#cuestionario');

  if (!html) {
    sinVeredicto('El componente no escribio ningun HTML.');
  }

  if (!html.includes('data-pregunta=')) {
    sinVeredicto(
      `El componente dibujo algo, pero ninguna pregunta del modulo ${MODULO_HOSTIL}.`,
      html.slice(0, 400)
    );
  }

  // --- 5 · comprobar ------------------------------------------------------
  const textos = [
    ['enunciado de la pregunta', hostil.enunciado],
    ...hostil.alternativas.map((a) => [`alternativa ${a.letra}`, a.texto]),
    ['icono del modulo, que va dentro de un atributo', hostil.modulo_icono],
  ];

  const problemas = [];

  for (const [nombre, texto] of textos) {
    const escapado = esc(texto);

    // Solo tiene sentido exigir que la forma cruda esté ausente cuando el
    // escapado la cambia. Un texto sin caracteres especiales sale identico, y
    // buscarlo daria una alarma sobre un texto que nunca fue peligroso.
    // Encontrado corriendo este guion: el icono 'devices' la disparaba.
    if (escapado !== texto && html.includes(texto)) {
      problemas.push(`${nombre}: su forma CRUDA aparece en el HTML, sin escapar`);
    }
    if (!html.includes(escapado)) {
      problemas.push(`${nombre}: su forma escapada NO aparece, asi que se perdio texto`);
    }
  }

  // Sin esto, un fixture que dejara de traer caracteres peligrosos volveria la
  // prueba en un trámite que siempre pasa. Que el ataque exista es parte de lo
  // que hay que comprobar.
  const conCarga = textos.filter(([, texto]) => esc(texto) !== texto).length;
  if (conCarga < textos.length) {
    problemas.push(
      `${textos.length - conCarga} de los ${textos.length} textos de prueba no traen ningun ` +
        'caracter que escapar: d1/prueba-escapado.sql dejo de ser un ataque'
    );
  }

  // --- 5a · LA JUSTIFICACION, POR SUS DOS CAMINOS (iteracion 34) ----------
  //
  // La justificacion no se dibuja con el resto de la tarjeta: aparece al responder,
  // o detras de «Ver por qué» si la pregunta viene de otra visita. Los dos caminos
  // insertan HTML y los dos hay que provocarlos, porque un escapado que este en uno
  // y falte en el otro deja media puerta abierta.
  //
  // La fila hostil esta sembrada como restaurada, asi que este es el camino de
  // «Ver por qué». El de responder se prueba a escala, mas abajo, sobre las 368.

  if (esc(hostil.justificacion) === hostil.justificacion) {
    problemas.push(
      'la justificacion de la fila de prueba no trae ningun caracter que escapar: ' +
        'd1/prueba-escapado.sql dejo de atacar por ese lado'
    );
  }

  // Antes de pulsar nada, el recuadro tiene que estar vacio. Si el texto ya
  // estuviera dibujado, «Ver por qué» no probaria ninguna insercion: solo destaparia
  // algo que ya paso por el escapado del dibujo.
  if (html.includes(esc(hostil.justificacion)) || html.includes(hostil.justificacion)) {
    problemas.push(
      'la justificacion de una pregunta restaurada ya venia dibujada antes de pulsar ' +
        '«Ver por qué»: el camino que inserta no se estaria probando'
    );
  }

  if (!html.includes('quiz-ver-porque')) {
    sinVeredicto(
      `La pregunta ${ID_HOSTIL} se dibujo sin «Ver por qué», asi que no hay como desplegar su ` +
        'justificacion.',
      'Se sembro una respuesta suya en el almacen; puede que el sitio no la haya restaurado.'
    );
  }

  // El boton se fabrica con lo que el navegador tendria puesto: de que pregunta es
  // la tarjeta de la que cuelga. `desplegarElPorque()` recorre hacia arriba para
  // encontrarla, y con un objeto pelado se caeria en la primera linea.
  const tarjetaHostil = dom.nodo(`#tarjeta-q${ID_HOSTIL}`);
  tarjetaHostil.dataset.pregunta = `q${ID_HOSTIL}`;

  const botonPorque = dom.nodo(`#ver-porque-${ID_HOSTIL}`);
  botonPorque.closest = (selector) =>
    selector === '[data-pregunta]' ? tarjetaHostil : botonPorque;

  dom.disparar('#cuestionario', 'click', {
    target: { closest: (s) => (s === '.quiz-ver-porque' ? botonPorque : null) },
  });

  const desplegado = dom.html(`#tarjeta-q${ID_HOSTIL} > .quiz-justificacion`);

  if (desplegado === '') {
    sinVeredicto(
      '«Ver por qué» no inserto nada en la pregunta hostil.',
      'Sin insercion no hay escapado que comprobar por este camino.'
    );
  }
  if (desplegado.includes(hostil.justificacion)) {
    problemas.push('justificacion tras «Ver por qué»: su forma CRUDA se inserto, sin escapar');
  }
  if (!desplegado.includes(esc(hostil.justificacion))) {
    problemas.push('justificacion tras «Ver por qué»: su forma escapada NO aparece, se perdio texto');
  }

  // --- 5a-2 · LA PIEZA EXTRAIDA (iteracion 44, etapa A3) ------------------
  //
  // El resumen del simulacro dibuja la justificacion con la MISMA pieza que el
  // cuestionario (decision 3 de la 44), y esa pieza recibe la pregunta y nada mas.
  // Se prueba aqui, y no en un guion aparte, porque lo que la pieza hace de peligroso
  // es insertar texto del banco, y este es el guion que corre en `verificar`.
  //
  // Cuatro cosas, y la tercera es la que importa en una extraccion:
  //
  //   1. el modulo existe y exporta las dos funciones;
  //   2. `tieneJustificacion()` distingue lo que hay que explicar de lo que no;
  //   3. `justificacionDibujada()` escribe EXACTAMENTE el HTML que escribia dentro
  //      del cuestionario, copiado de ahi antes de moverla. Que la funcion movida
  //      «funcione» no alcanza: tiene que dibujar lo mismo;
  //   4. el cuestionario la importa y no conserva una copia propia. Dos copias es
  //      justo lo que la decision 3 existe para impedir.

  let pieza = null;

  try {
    pieza = await import(pathToFileURL(join(SITIO, 'components', 'justificacion.js')).href);
  } catch (error) {
    problemas.push(
      `no se pudo importar static/js/components/justificacion.js: ${error.code ?? error.message}`
    );
  }

  if (pieza) {
    const { tieneJustificacion, justificacionDibujada } = pieza;

    if (typeof tieneJustificacion !== 'function' || typeof justificacionDibujada !== 'function') {
      problemas.push('components/justificacion.js no exporta tieneJustificacion y justificacionDibujada');
    } else {
      const casos = [
        [null, false, 'null'],
        [{}, false, 'una pregunta sin el campo'],
        [{ justificacion: null }, false, 'justificacion nula'],
        [{ justificacion: '' }, false, 'justificacion vacia'],
        [{ justificacion: '   \n ' }, false, 'justificacion solo con espacios'],
        [{ justificacion: 42 }, false, 'justificacion que no es texto'],
        [{ justificacion: 'Porque map devuelve un arreglo nuevo.' }, true, 'justificacion de verdad'],
      ];

      for (const [pregunta, esperado, queEs] of casos) {
        if (tieneJustificacion(pregunta) !== esperado) {
          problemas.push(`tieneJustificacion() con ${queEs} dio ${!esperado} y tenia que dar ${esperado}`);
        }
      }

      // Copiado de `justificacionDibujada()` de cuestionario.js tal como estaba el
      // 2026-09-22, antes de moverla, con sus saltos y su sangria.
      const COMO_SE_DIBUJABA =
        '\n              <p class="font-display font-bold text-jsyellow text-[11px] uppercase ' +
        'tracking-widest">Por qué</p>\n              <p class="mt-1.5 text-sm text-paper ' +
        'leading-relaxed">Porque map devuelve un arreglo nuevo.</p>';

      const dibujada = justificacionDibujada({ justificacion: 'Porque map devuelve un arreglo nuevo.' });

      if (dibujada !== COMO_SE_DIBUJABA) {
        problemas.push(
          'justificacionDibujada() ya no escribe el mismo HTML que escribia dentro del cuestionario'
        );
      }

      const dibujadaHostil = justificacionDibujada(hostil);

      if (dibujadaHostil.includes(hostil.justificacion)) {
        problemas.push('justificacionDibujada(): la justificacion hostil salio CRUDA, sin escapar');
      }
      if (!dibujadaHostil.includes(esc(hostil.justificacion))) {
        problemas.push('justificacionDibujada(): la justificacion hostil no salio escapada y entera');
      }
    }
  }

  const fuenteDelCuestionario = readFileSync(join(SITIO, 'components', 'cuestionario.js'), 'utf8');

  const laImporta =
    /import\s*\{[^}]*\btieneJustificacion\b[^}]*\bjustificacionDibujada\b[^}]*\}\s*from\s*'\.\/justificacion\.js'/.test(
      fuenteDelCuestionario
    ) ||
    /import\s*\{[^}]*\bjustificacionDibujada\b[^}]*\btieneJustificacion\b[^}]*\}\s*from\s*'\.\/justificacion\.js'/.test(
      fuenteDelCuestionario
    );

  const laDefine = /(const|let|var|function)\s+(tieneJustificacion|justificacionDibujada)\b/.test(
    fuenteDelCuestionario
  );

  if (!laImporta) {
    problemas.push('cuestionario.js no importa tieneJustificacion y justificacionDibujada de ./justificacion.js');
  }
  if (laDefine) {
    problemas.push('cuestionario.js conserva su propia definicion de la pieza de la justificacion');
  }

  // --- 5b · EL BANCO REAL, A ESCALA (ADR-024) -----------------------------
  //
  // Hasta el 2026-09-10 este guion comprobaba una sola fila: la hostil, cargada
  // por el propio guion. Eso verifica el MECANISMO de escapado, y ADR-024 acepto
  // ese alcance «hasta que hubiera banco real».
  //
  // Ya lo hay. Y lo que ADR-024 pedia era otra cosa: recorrer la pagina entera
  // buscando texto salido de su tarjeta, con las 368 dentro. El banco real trae
  // comillas invertidas, comillas dobles y ejemplos con forma de <etiqueta> —ese
  // ultimo es el caso que ya rompio la pagina una vez, cuando un ejemplo que
  // contenia <div> se interpreto como etiqueta real—.
  //
  // Se aplican las MISMAS dos afirmaciones que a la fila hostil, a cada texto de
  // cada pregunta que el extremo devolvio. No es una comprobacion nueva: es la
  // misma, sobre todo el material en vez de sobre una fila.
  // Se pide el banco ENTERO, sin filtrar por modulo.
  //
  // `crudo` viene de `/api/preguntas?modulo=N`, porque la fila hostil vive en un
  // modulo concreto. Reusarlo aqui dejaria la comprobacion mirando un solo modulo
  // y anunciando que reviso «el banco real»: 52 de 368. Es el patron de H-023
  // —una comprobacion que dice mas de lo que mira— y por eso se pide aparte.
  //
  // DESDE LA ITERACION 31 HAY QUE DIBUJAR SIETE VECES
  //
  // La pagina ya no dibuja el banco de una vez: dibuja el modulo elegido. Asi que
  // la lista de las 368 se sigue pidiendo entera —es contra ella que se comprueba
  // que no falte texto—, pero el HTML contra el que se compara cada pregunta es el
  // de SU modulo, dibujado recorriendo los siete. Comparar las 368 contra el HTML
  // de un solo modulo gritaria «se perdio texto» en las 316 que no se dibujaron,
  // y seria la prueba mintiendo, no la pagina.
  let todo;
  try {
    const respuesta = await fetchReal(`${DIRECCION}/api/preguntas`, {
      signal: AbortSignal.timeout(ESPERA_SONDEO),
    });
    todo = await respuesta.json();
  } catch (error) {
    sinVeredicto(`Se cayo la consulta al banco entero.`, error.message);
  }

  if (!todo?.ok) sinVeredicto('El extremo no devolvio el banco entero.', JSON.stringify(todo, null, 2));

  const delBanco = todo.datos.filter((p) => p.id !== ID_HOSTIL);

  // Se recorren los modulos que el banco dice tener, no los siete escritos a mano:
  // si el banco llegara sin alguno, la prueba lo acompana en vez de exigir uno que
  // no existe.
  const modulosDelBanco = [...new Set(todo.datos.map((p) => p.modulo))].sort((a, b) => a - b);
  const htmlPorModulo = new Map();

  // Y AQUI SE RESPONDE, que es el segundo camino por el que la justificacion entra
  // al HTML. Hasta la iteracion 34 esta parte solo dibujaba: las 368 preguntas
  // salian sin responder, ninguna justificacion se insertaba, y la comprobacion de
  // mas abajo pasaba sin haber mirado una sola. Eso es H-023 —una prueba que dice
  // mas de lo que mira— y por eso ahora se responden todas.
  //
  // Se vacia el almacen primero: la fila hostil quedo sembrada como respondida, y
  // una pregunta ya respondida no se puede volver a responder.
  almacen.datos.clear();

  const justificacionPorPregunta = new Map();

  /** Pulsa una alternativa de una pregunta, como haria el estudiante. */
  function responderla(pregunta) {
    const alternativa = pregunta.alternativas?.[0];
    if (!alternativa) return;

    const tarjeta = dom.nodo(`#tarjeta-q${pregunta.id}`);
    tarjeta.dataset.pregunta = `q${pregunta.id}`;

    const boton = dom.nodo(`#alternativa-${alternativa.id}`);
    boton.disabled = false;
    boton.dataset.correct = String(alternativa.es_correcta === 1);
    boton.dataset.alternativa = String(alternativa.id);
    boton.closest = (selector) => (selector === '[data-pregunta]' ? tarjeta : boton);

    dom.disparar('#cuestionario', 'click', {
      target: { closest: (s) => (s === '.quiz-option' ? boton : null) },
    });

    justificacionPorPregunta.set(
      pregunta.id,
      dom.html(`#tarjeta-q${pregunta.id} > .quiz-justificacion`)
    );
  }

  for (const numero of modulosDelBanco) {
    await mostrarModulo(numero);
    const dibujado = dom.html('#cuestionario');

    if (!dibujado || !dibujado.includes('data-pregunta=')) {
      sinVeredicto(
        `El componente no dibujo ninguna pregunta del modulo ${numero}.`,
        String(dibujado).slice(0, 400)
      );
    }

    htmlPorModulo.set(numero, dibujado);

    for (const pregunta of todo.datos) {
      if (pregunta.modulo === numero) responderla(pregunta);
    }
  }

  let textosRevisados = 0;
  let justificacionesVistas = 0;
  let justificacionesDibujadas = 0;
  let conCaracteresPeligrosos = 0;
  const problemasDelBanco = [];

  for (const p of delBanco) {
    // El HTML de SU modulo, que es donde esta pregunta se dibuja.
    const html = htmlPorModulo.get(p.modulo) ?? '';

    // Lo que el componente DIBUJA hoy. La justificacion no esta aqui a
    // proposito: no se muestra todavia —es trabajo de la epica 30, iteracion
    // 33—, asi que exigir que su forma escapada aparezca en el HTML seria
    // exigir que se dibuje algo que nadie implemento. Se revisa aparte, mas
    // abajo, de una forma que no caduca.
    const suyos = [
      [`pregunta ${p.id} · enunciado`, p.enunciado],
      ...p.alternativas.map((a) => [`pregunta ${p.id} · alternativa ${a.letra}`, a.texto]),
      [`pregunta ${p.id} · icono del modulo`, p.modulo_icono],
    ];

    // La justificacion se mira en SU recuadro, que es donde la insertan los dos
    // caminos que la dibujan, y no en el HTML del modulo: el dibujo del modulo la
    // deja vacia a proposito y buscarla ahi daria «se perdio texto» en las 368.
    const suRecuadro = justificacionPorPregunta.get(p.id) ?? '';

    if (typeof p.justificacion === 'string' && p.justificacion !== '') {
      justificacionesVistas += 1;
      const escapada = esc(p.justificacion);

      if (escapada !== p.justificacion && suRecuadro.includes(p.justificacion)) {
        problemasDelBanco.push(`pregunta ${p.id} · justificacion: su forma CRUDA aparece en el HTML`);
      }
      // Y tampoco puede colarse cruda en el HTML del modulo, que es el otro sitio
      // donde podria acabar si algun dia se dibujara con el resto de la tarjeta.
      if (escapada !== p.justificacion && html.includes(p.justificacion)) {
        problemasDelBanco.push(
          `pregunta ${p.id} · justificacion: su forma CRUDA aparece en el HTML del modulo`
        );
      }
      if (suRecuadro.includes(escapada)) justificacionesDibujadas += 1;
    }

    for (const [nombre, texto] of suyos) {
      if (typeof texto !== 'string' || texto === '') continue;
      textosRevisados += 1;
      const escapado = esc(texto);
      if (escapado !== texto) conCaracteresPeligrosos += 1;

      if (escapado !== texto && html.includes(texto)) {
        problemasDelBanco.push(`${nombre}: su forma CRUDA aparece en el HTML, sin escapar`);
      }
      if (!html.includes(escapado)) {
        problemasDelBanco.push(`${nombre}: su forma escapada NO aparece, asi que se perdio texto`);
      }
    }
  }

  // Que el banco real traiga de verdad algo que escapar es parte de lo que hay
  // que comprobar. Un banco sin un solo caracter peligroso volveria esta seccion
  // un tramite que siempre pasa, que es el patron de H-023.
  // SE DIBUJAN TODAS. Ni una menos, y el cero ya no vale.
  //
  // Hasta la iteracion 34 esta guarda decia «todas o ninguna», porque la pantalla
  // que muestra las justificaciones no existia y exigir que aparecieran habria sido
  // exigir que se dibujara algo que nadie implemento. Ya existe, y este guion
  // responde las 368 para provocarlo: si ahora saliera cero, no significaria «no
  // toca todavia», significaria que el recuadro dejo de llenarse y que esta seccion
  // entera esta pasando sin mirar nada. Es la diferencia entre una exclusion con
  // fecha y una prueba que siempre aprueba.
  if (justificacionesVistas === 0) {
    problemasDelBanco.push(
      'ninguna de las preguntas del banco trae justificacion: no hay nada que escapar por ese lado'
    );
  } else if (justificacionesDibujadas !== justificacionesVistas) {
    problemasDelBanco.push(
      `de ${justificacionesVistas} justificaciones, ${justificacionesDibujadas} aparecen escapadas ` +
        'en su recuadro y el resto no: o se dibujan todas, o hay texto perdiendose'
    );
  }

  if (delBanco.length > 0 && conCaracteresPeligrosos === 0) {
    problemasDelBanco.push(
      `las ${textosRevisados} porciones de texto del banco real no traen ni un caracter ` +
        'que escapar: esta comprobacion dejo de comprobar algo'
    );
  }

  for (const p of problemasDelBanco) problemas.push(p);

  // --- 5c · EL SIMULACRO (iteracion 43, adelantado de la tanda 2) ---------
  //
  // Hasta la 43 el simulacro no dibujaba ningun texto del banco (decision 11 de la
  // 41), y aqui no habia nada que mirar. Desde la 43 dibuja la pregunta en curso, y
  // el autor decidio el 2026-09-20 adelantar esta prueba a la tanda 1: el hueco lo
  // abrio esta tanda, y en ella se cierra. Por la decision 7 de la 43 se revisan el
  // enunciado y las alternativas; la tarjeta no dibuja el icono del modulo.
  //
  // LA FILA HOSTIL SE CUELA POR INTERCEPCION. El intento se elige al azar entre las
  // preguntas del banco y la 900 casi nunca saldria, asi que a la respuesta de
  // `?ids=` se le reemplazan los textos de TODAS las preguntas por los de la fila
  // hostil, conservando sus ids y su forma. La primera que se dibuje, sea cual sea,
  // trae el ataque. `esc` y `problemas` son los de la seccion 5, en este mismo ambito.

  const domSimulacro = prepararDomFalso();

  // Un reloj quieto, como en `probar-filtrado.mjs`: el intento arranca sus
  // cronometros, y ninguno tiene por que vencer mientras se mira lo dibujado.
  const { usarReloj } = await import(pathToFileURL(join(SITIO, 'servicios', 'reloj.js')).href);
  usarReloj(relojDeMentira());

  let respuestasEnvenenadas = 0;

  globalThis.fetch = async (ruta, opciones) => {
    const respuesta = await fetchReal(DIRECCION + ruta, opciones);
    if (!String(ruta).includes('ids=')) return respuesta;

    const cuerpo = await respuesta.json();

    // Con `&con=justificacion` —la peticion que hace el resumen al llegar (decision 8)—
    // se envenena TAMBIEN la justificacion. Es la unica peticion que la trae, y durante
    // el intento no se dibuja nunca: sin esto, el texto mas largo del banco llegaria al
    // HTML de la revision sin que ninguna prueba lo hubiera atacado.
    const conJustificacion = /[?&]con=justificacion(&|$)/.test(String(ruta));

    cuerpo.datos = (cuerpo.datos ?? []).map((pregunta) => ({
      ...pregunta,
      enunciado: hostil.enunciado,
      alternativas: pregunta.alternativas.map((alternativa, k) => ({
        ...alternativa,
        texto: hostil.alternativas[k % hostil.alternativas.length].texto,
      })),
      ...(conJustificacion ? { justificacion: hostil.justificacion } : {}),
    }));
    respuestasEnvenenadas += 1;

    return new Response(JSON.stringify(cuerpo), {
      status: respuesta.status,
      headers: { 'content-type': 'application/json' },
    });
  };

  const { anotarEnElIntento, conectarComienzo, comenzarElIntento, preguntasDelIntento } = await import(
      pathToFileURL(join(SITIO, 'components', 'simulacro.js')).href
      );

  conectarComienzo();
  await comenzarElIntento();

  const htmlSimulacro = domSimulacro.html('#zona-del-intento');

  // Sin ataque colado o sin pregunta dibujada, esto no probaria nada: no aprueba,
  // dice que no pudo (H-013).
  if (respuestasEnvenenadas === 0) {
    sinVeredicto('El simulacro no pidio preguntas por ids: no hubo donde colar la fila hostil.');
  }
  if (!htmlSimulacro.includes('data-papel="tarjeta-de-la-pregunta"')) {
    sinVeredicto('El simulacro no llego a dibujar ninguna pregunta.', htmlSimulacro.slice(0, 400));
  }

  const textosDelSimulacro = [
    ['simulacro, enunciado', hostil.enunciado],
    ...hostil.alternativas.map((a) => [`simulacro, alternativa ${a.letra}`, a.texto]),
  ];

  for (const [nombre, texto] of textosDelSimulacro) {
    const escapado = esc(texto);

    if (escapado !== texto && htmlSimulacro.includes(texto)) {
      problemas.push(`${nombre}: su forma CRUDA aparece en el HTML, sin escapar`);
    }
    if (!htmlSimulacro.includes(escapado)) {
      problemas.push(`${nombre}: su forma escapada NO aparece, asi que se perdio texto`);
    }
  }

  // Las etiquetas que la zona del intento emite de verdad, sacadas del marcado de
  // `simulacro-maqueta.js`. Cualquier otra solo puede venir de un texto colado.
  const PROPIAS_DEL_SIMULACRO = new Set([
    'section', 'div', 'article', 'p', 'h2', 'ul', 'li', 'button', 'span',
  ]);
  const presentesEnElSimulacro = [
    ...new Set(
        [...htmlSimulacro.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g)].map((m) => m[1].toLowerCase())
    ),
  ];
  const intrusasEnElSimulacro = presentesEnElSimulacro.filter(
      (etiqueta) => !PROPIAS_DEL_SIMULACRO.has(etiqueta)
  );

  if (intrusasEnElSimulacro.length > 0) {
    problemas.push(
        `simulacro: etiquetas que la tarjeta no emite: ${intrusasEnElSimulacro.join(', ')}`
    );
  }

  // --- 5d · LA REVISION DEL RESUMEN (iteracion 44, etapa C) ---------------
  //
  // La revision es el OTRO sitio del simulacro donde entra texto del banco, y entra por
  // partida triple: el enunciado, la alternativa que se marco y la correcta, y la
  // justificacion, que durante el intento no se dibuja nunca. Hasta la iteracion 44 esa
  // pantalla no existia; ahora existe y hay que atacarla igual.
  //
  // COMO SE LLEGA: se termina el intento que 5c acaba de armar —el de las preguntas ya
  // envenenadas— resolviendo sus 120, la mitad marcando una alternativa y la otra mitad
  // omitiendo, para que la revision tenga los tres estados. La justificacion se cuela en
  // la respuesta de `&con=justificacion`, que es la peticion que el resumen hace al
  // llegar y la unica que puede traerla.

  const delIntento = preguntasDelIntento();

  if (delIntento.length === 0) {
    sinVeredicto('El intento del simulacro quedo vacio: no hay nada que llevar hasta el resumen.');
  }

  // Los tres estados, para que la revision los dibuje todos: respondida, omitida y
  // agotada. `anotarEnElIntento()` es el unico sitio por el que pasa toda pregunta
  // resuelta, asi que esto recorre el mismo camino que los botones y el cronometro.
  for (let i = 0; i < delIntento.length; i += 1) {
    const pregunta = delIntento[i];

    anotarEnElIntento({
      pregunta_id: pregunta.id,
      alternativa_id: i % 2 === 0 ? pregunta.alternativas[0].id : null,
      estado: i % 2 === 0 ? 'respondida' : 'omitida',
      agotada: i % 4 === 3,
    });
  }

  // La revision llega por una peticion: hay que dejarla volver.
  for (let k = 0; k < 40; k += 1) await new Promise((r) => setTimeout(r, 10));

  const htmlRevision = domSimulacro.html('#revision-del-intento');

  if (htmlRevision === '') {
    sinVeredicto(
        'No se llego a dibujar la revision del resumen, asi que no hay donde mirar el escapado.',
        domSimulacro.html('#zona-del-intento').slice(0, 400)
    );
  }

  const textosDeLaRevision = [
    ['revision, enunciado', hostil.enunciado],
    ...hostil.alternativas.map((a) => [`revision, alternativa ${a.letra}`, a.texto]),
    ['revision, justificacion', hostil.justificacion],
  ];

  for (const [nombre, texto] of textosDeLaRevision) {
    const escapado = esc(texto);

    if (escapado !== texto && htmlRevision.includes(texto)) {
      problemas.push(`${nombre}: su forma CRUDA aparece en el HTML, sin escapar`);
    }
    if (!htmlRevision.includes(escapado)) {
      problemas.push(`${nombre}: su forma escapada NO aparece, asi que se perdio texto`);
    }
  }

  // Y las etiquetas: las que la revision emite de verdad, y ninguna mas.
  const PROPIAS_DE_LA_REVISION = new Set(['section', 'h3', 'ul', 'li', 'p', 'span', 'button', 'div']);
  const presentesEnLaRevision = [
    ...new Set(
        [...htmlRevision.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g)].map((m) => m[1].toLowerCase())
    ),
  ];
  const intrusasEnLaRevision = presentesEnLaRevision.filter(
      (etiqueta) => !PROPIAS_DE_LA_REVISION.has(etiqueta)
  );

  if (intrusasEnLaRevision.length > 0) {
    problemas.push(`revision: etiquetas que no emite: ${intrusasEnLaRevision.join(', ')}`);
  }

  // La busqueda de etiquetas ajenas mira los SIETE modulos dibujados, no uno: una
  // etiqueta colada en el modulo 6 no aparece en el HTML del 2.
  const PROPIAS = new Set(['section', 'header', 'ul', 'li', 'div', 'p', 'span', 'button']);
  const todoElHtml = [html, ...htmlPorModulo.values()].join('');
  const presentes = [
    ...new Set(
      [...todoElHtml.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g)].map((m) => m[1].toLowerCase())
    ),
  ];
  const intrusas = presentes.filter((etiqueta) => !PROPIAS.has(etiqueta));

  if (intrusas.length > 0) {
    problemas.push(`etiquetas que el componente no emite: ${intrusas.join(', ')}`);
  }

  if (problemas.length === 0 && delBanco.length < PISO_DE_ESCALA) {
    codigo = NO_A_ESCALA;
    anunciar('MECANISMO EN PIE, PERO NO A ESCALA  ***  ESTO NO CIERRA ADR-024  ***', [
      `Se cargaron ${textos.length} textos hostiles y ninguno llego al HTML como`,
      'marcado. El mecanismo de escapado funciona.',
      '',
      `Pero la base local trae ${delBanco.length} preguntas, y ADR-024 pide probarlo`,
      `sobre el banco real. Con menos de ${PISO_DE_ESCALA} esto revisa el banco de`,
      'juguete, que no trae los ejemplos con forma de <etiqueta> que ya rompieron',
      'la pagina una vez.',
      '',
      'Para probarlo de verdad, carga el respaldo versionado en la base local:',
      '',
      '  npm run datos:banco-local',
      '',
      'No necesita nube ni credenciales: d1/respaldo-banco.sql esta versionado.',
    ]);
  } else if (problemas.length === 0) {
    anunciar('ESCAPADO EN PIE', [
      `Se cargaron ${textos.length} textos hostiles en la base local y ninguno`,
      'llego al HTML como marcado: todos llegaron como texto, enteros.',
      '',
      `Y ademas se reviso EL BANCO REAL: ${delBanco.length} preguntas, ${textosRevisados}`,
      `porciones de texto, de las cuales ${conCaracteresPeligrosos} traian algun caracter`,
      'que escapar. Ninguna aparecio cruda en el HTML y ninguna se perdio.',
      '',
      `Cada pregunta se comparo contra el HTML de SU modulo: se dibujaron los`,
      `modulos ${modulosDelBanco.join(', ')}, uno por uno, como los dibuja la pagina.`,
      '',
      `LA JUSTIFICACION, por sus dos caminos (iteracion 34): las ${justificacionesDibujadas}`,
      `de ${justificacionesVistas} se dibujaron RESPONDIENDO las preguntas, una por una, y`,
      'ninguna aparecio cruda. Y la de la fila hostil se desplego pulsando «Ver por qué»',
      'sobre una pregunta restaurada del almacen: tampoco aparecio cruda, y su texto',
      'llego entero.',
      '',
      'LA PIEZA EXTRAIDA (iteracion 44): components/justificacion.js dibuja el mismo',
      'HTML que dibujaba dentro del cuestionario, escapa la justificacion hostil, y el',
      'cuestionario la importa sin conservar una copia propia.',
      '',
      `Etiquetas en el HTML: ${presentes.sort().join(', ')}`,
      'Ninguna ajena al componente.',
      '',
      'EL SIMULACRO (iteracion 43): los textos de la fila hostil se colaron en el',
      'intento interceptando `?ids=`, y la primera pregunta dibujada los trajo como',
      `texto, enteros. Etiquetas en su HTML: ${presentesEnElSimulacro.sort().join(', ')}.`,
      '',
      'LA REVISION DEL RESUMEN (iteracion 44): ese mismo intento se llevo hasta el final,',
      'resolviendo sus 120 con los tres estados, y la justificacion hostil se colo por',
      '`&con=justificacion`, que es la unica peticion que la trae. El enunciado, las cuatro',
      'alternativas y la justificacion llegaron a la revision como texto, enteros.',
      `Etiquetas en su HTML: ${presentesEnLaRevision.sort().join(', ')}.`,
      '',
      'Lo que esto NO prueba: que el banco que hay en PRODUCCION sea el que',
      'se acaba de revisar. Esta prueba corre contra la base LOCAL, y solo vale',
      'para el contenido que ella tenga dentro en este momento.',
    ]);
  } else {
    codigo = ROTO;
    anunciar(`ESCAPADO ROTO  ***  ${problemas.length}  ***`, [
      ...problemas.map((p) => `  ${p}`),
      '',
      'Un texto de la base se esta interpretando como marcado.',
    ]);
  }
} catch (error) {
  if (!(error instanceof SinVeredicto)) throw error;

  codigo = SIN_VEREDICTO;
  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    error.message,
    ...(error.detalle ? ['', error.detalle] : []),
    '',
    'Nadie llego a probar el escapado, asi que no se sabe si aguanta.',
    'Esto NO significa que este bien, ni que este mal.',
  ]);
} finally {
  // --- 6 · dejar la base como estaba, pase lo que pase --------------------
  //
  // Y comprobarlo, en vez de darlo por hecho. Que el archivo de limpieza se haya
  // lanzado no es lo mismo que la base este limpia, y la distancia entre esas
  // dos cosas es una pregunta hostil dibujandose en el navegador del autor sin
  // que nada se lo anuncie.
  if (cargado) {
    let filas = null;

    try {
      aplicarSql(join(RAIZ, 'd1', 'prueba-escapado-limpiar.sql'));
      filas = consultar(
        `SELECT (SELECT COUNT(*) FROM pregunta WHERE id = ${ID_HOSTIL}) AS filas, ` +
          `(SELECT COUNT(*) FROM alternativa WHERE pregunta_id = ${ID_HOSTIL}) AS alternativas, ` +
          `(SELECT icono FROM modulo WHERE numero = ${MODULO_HOSTIL}) AS icono;`
      );
    } catch (error) {
      if (!(error instanceof SinVeredicto)) throw error;
      filas = null;
    }

    const estado = filas?.[0];

    if (!estado) {
      // No se pudo preguntar, asi que no hay respuesta. No se afirma que la base
      // este sucia —seria el error de H-013 al reves— pero tampoco que este
      // limpia.
      codigo = Math.max(codigo, SIN_VEREDICTO);
      console.log('');
      anunciar('LA LIMPIEZA NO SE PUDO COMPROBAR', [
        'Se lanzo d1/prueba-escapado-limpiar.sql, pero no pude leer la base para',
        'confirmar que quedo limpia. Compruebalo a mano antes de abrir el sitio:',
        '',
        '  node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --local ' +
          `--command="SELECT * FROM pregunta WHERE id = ${ID_HOSTIL};"`,
      ]);
    } else if (
      estado.filas > 0 ||
      estado.alternativas > 0 ||
      estado.icono !== ICONO_LIMPIO
    ) {
      codigo = BASE_SUCIA;
      console.log('');
      anunciar('BASE SUCIA  ***  EL CONTENIDO HOSTIL SIGUE DENTRO  ***', [
        `  pregunta ${ID_HOSTIL}: ${estado.filas} fila(s)`,
        `  sus alternativas: ${estado.alternativas}`,
        `  icono del modulo ${MODULO_HOSTIL}: ${JSON.stringify(estado.icono)}, y deberia ser "${ICONO_LIMPIO}"`,
        '',
        'La base local quedo con contenido de ataque dentro. Si abres el sitio',
        'ahora vas a ver la pregunta hostil y el icono roto, y nada te lo avisa.',
        '',
        'Retiralo a mano:',
        '',
        '  node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --local ' +
          '--file=d1/prueba-escapado-limpiar.sql',
      ]);
    } else {
      console.log('\nBase local devuelta a su estado limpio, y comprobado.');
    }
  }
}

terminar(codigo);
