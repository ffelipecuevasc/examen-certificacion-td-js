/**
 * Guardian del filtrado por modulo del cuestionario (iteraciones 31 y 32).
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
 * Desde la auditoria de la iteracion 32 comprueba tambien **donde queda el foco**.
 * Es lo unico del teclado que se puede saber sin navegador —a que elemento fue a
 * parar—, y alcanza para cazar el defecto que importa: que se caiga al `body`.
 * Cuando eso pasa, quien navega con teclado pierde su lugar y tiene que volver a
 * tabular desde la barra de navegacion, y no hay nada en pantalla que lo anuncie.
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
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { prepararDomFalso, relojDeMentira } from './dom-falso.mjs';

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

/**
 * Cuantas preguntas trae el intento de cada modulo, sin importar el orden.
 *
 * SE LEE DEL INTENTO ARMADO, NO DEL HTML, desde la iteracion 43. Hasta entonces el
 * recuadro «Intento listo» dibujaba una cuenta por modulo y esto la leia de ahi; la
 * decision 8 de la 43 retiro ese recuadro y ya no hay ninguna pantalla que la
 * muestre. El reparto sigue siendo lo que hay que vigilar, asi que se mira donde
 * esta: en las preguntas que `preguntasDelIntento()` devuelve.
 */
const cuentasDelIntento = (preguntas) => {
  const porModulo = new Map();
  for (const pregunta of preguntas) {
    porModulo.set(pregunta.modulo, (porModulo.get(pregunta.modulo) ?? 0) + 1);
  }
  return [...porModulo.values()];
};

/**
 * Si al terminar la carga quedo dibujada la primera pregunta de un intento de 120.
 *
 * Es lo que reemplaza a buscar «Intento listo»: desde la decision 8 de la 43, un
 * intento armado se nota en que su recorrido empezo.
 */
const empezoElRecorrido = (html) =>
    html.includes('data-papel="tarjeta-de-la-pregunta"') && html.includes('Pregunta 1 de 120');

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
  // 2b · El extremo del resumen (ADR-033), antes de montar nada
  //
  // Se comprueba contra el extremo REAL y contra la base consultada aparte. Es la
  // unica parte de este guion que mira la respuesta del extremo y no el dibujo, y
  // es correcto que lo haga: lo que se esta comprobando aqui ES el extremo.
  // ------------------------------------------------------------------------

  const pedir = async (ruta) => {
    const res = await fetchReal(`${DIRECCION}${ruta}`, {
      signal: AbortSignal.timeout(ESPERA_SONDEO),
    });
    const texto = await res.text();

    let cuerpo = null;
    try {
      cuerpo = JSON.parse(texto);
    } catch {
      cuerpo = null;
    }

    return { estado: res.status, bytes: Buffer.byteLength(texto), cuerpo };
  };

  const resumen = await pedir('/api/preguntas?resumen=1');

  if (resumen.estado !== 200 || !resumen.cuerpo?.ok) {
    noSePudo(
      '/api/preguntas?resumen=1 no contesto un resumen.',
      JSON.stringify(resumen.cuerpo, null, 2)?.slice(0, 600)
    );
  }

  /** modulo -> cuantas dice el resumen que hay. */
  const delResumen = new Map(
    (resumen.cuerpo.datos ?? []).map((f) => [f.modulo, f.preguntas])
  );

  if (delResumen.size !== porModulo.length) {
    problemas.push(
      `?resumen=1 devolvio ${delResumen.size} modulos y la base tiene ${porModulo.length}`
    );
  }

  for (const fila of porModulo) {
    if (delResumen.get(fila.modulo) !== fila.cuantas) {
      problemas.push(
        `?resumen=1 dice que el modulo ${fila.modulo} tiene ` +
          `${delResumen.get(fila.modulo)} preguntas y la base tiene ${fila.cuantas}`
      );
    }
  }

  // Un resumen que devolviera preguntas no seria un resumen: seria el banco con
  // otro nombre, y el gasto que este parametro existe para evitar.
  if ((resumen.cuerpo.datos ?? []).some((f) => f.alternativas || f.enunciado)) {
    problemas.push('?resumen=1 devolvio preguntas, no solo el conteo por modulo');
  }
  if (resumen.cuerpo.meta?.resumen !== true) {
    problemas.push('?resumen=1 no se declara como resumen en meta');
  }

  // Y que pese lo que dice pesar. Sin esto, el parametro podria «funcionar»
  // devolviendo lo mismo de siempre y nadie se enteraria hasta ver la factura de
  // datos del estudiante.
  const banco = await pedir('/api/preguntas');
  const proporcion = banco.bytes / resumen.bytes;

  if (proporcion < 50) {
    problemas.push(
      `?resumen=1 pesa ${(resumen.bytes / 1024).toFixed(1)} KB y el banco entero ` +
        `${(banco.bytes / 1024).toFixed(1)} KB: solo ${proporcion.toFixed(0)} veces menos, ` +
        'y no esta ahorrando lo que dice ahorrar'
    );
  }

  // Componerse con el filtro: una fila, la suya.
  const unModulo = await pedir(`/api/preguntas?modulo=${MODULO_DE_MUESTRA}&resumen=1`);
  const suya = unModulo.cuerpo?.datos ?? [];

  if (suya.length !== 1 || suya[0]?.modulo !== MODULO_DE_MUESTRA) {
    problemas.push(
      `?modulo=${MODULO_DE_MUESTRA}&resumen=1 devolvio ${suya.length} filas en vez de la suya`
    );
  }

  // Un valor distinto de 1 se rechaza, no se trata como «no». Tratarlo como «no»
  // le devolveria el banco entero a quien pidio el resumen, que es el gasto que
  // ADR-033 existe para evitar. Se provocan los dos casos que mas se escriben solos.
  for (const valor of ['true', '0']) {
    const malo = await pedir(`/api/preguntas?resumen=${valor}`);

    if (malo.estado !== 400 || malo.cuerpo?.error?.codigo !== 'PETICION_INVALIDA') {
      problemas.push(
        `?resumen=${valor} respondio ${malo.estado} y tenia que ser 400 PETICION_INVALIDA`
      );
    }
    if (malo.cuerpo?.error?.usar_respaldo !== false) {
      problemas.push(
        `?resumen=${valor} pide cambiar al respaldo, y es un error de la peticion, no de la base`
      );
    }
  }

  // ------------------------------------------------------------------------
  // 2c · Los ids del resumen (iteracion 33, enmienda de ADR-033)
  //
  // El resumen pasa a traer los ids de las preguntas activas de cada modulo, que es
  // contra lo que el indice filtra el avance guardado. Si estos ids no fueran
  // exactamente los de la base, el indice contaria avance sobre preguntas que el
  // banco ya no tiene, que es justo lo que la memoria existe para no hacer.
  // ------------------------------------------------------------------------

  for (const fila of resumen.cuerpo.datos ?? []) {
    const suyos = fila.preguntas_ids;

    if (!Array.isArray(suyos)) {
      problemas.push(`?resumen=1 no trae los ids del modulo ${fila.modulo}`);
      continue;
    }

    const enLaBase = [...(idsDelBanco.get(fila.modulo) ?? [])].sort((a, b) => a - b);

    if (suyos.join(',') !== enLaBase.join(',')) {
      problemas.push(
        `los ids del modulo ${fila.modulo} no son los de la base:\n` +
          `      resumen: ${suyos.length} ids\n      base:    ${enLaBase.length} ids`
      );
    }
    if (suyos.length !== fila.preguntas) {
      problemas.push(
        `el modulo ${fila.modulo} dice tener ${fila.preguntas} preguntas y trae ${suyos.length} ids`
      );
    }
    if (suyos.some((id) => !Number.isInteger(id))) {
      problemas.push(`los ids del modulo ${fila.modulo} no son numeros: llegaron sin convertir`);
    }
  }

  // ------------------------------------------------------------------------
  // 2d · Y que traerlos siga siendo barato. ANTES Y DESPUES, EN ESTA MISMA
  //      EJECUCION Y SOBRE ESTA MISMA BASE.
  //
  // «Antes» es la respuesta sin los ids, reconstruida desde la respuesta de ahora.
  // No es una estimacion: comprobado el 2026-09-15 contra el extremo anterior, la
  // reconstruccion da 929 bytes, que es exactamente lo que ese extremo devolvia.
  //
  // Para las filas leidas se comparan los PLANES de las dos consultas. La de antes
  // se deriva quitandole el `group_concat` a la de ahora —no se copia a mano, que
  // seria una segunda version de la consulta esperando a divergir—, y si los dos
  // planes coinciden, la de ahora recorre exactamente las mismas filas. Es la unica
  // forma de medir las filas de la consulta vieja sin dejar su codigo en el sitio.
  //
  // El umbral es de la iteracion 33 y no se relaja: 5 KB, y las filas no suben.
  // ------------------------------------------------------------------------

  const TECHO_DEL_RESUMEN = 5 * 1024;

  const bytesDespues = resumen.bytes;
  const bytesAntes = Buffer.byteLength(
    JSON.stringify({
      ...resumen.cuerpo,
      datos: (resumen.cuerpo.datos ?? []).map(({ preguntas_ids, ...fila }) => fila),
    })
  );

  const filasDespues = resumen.cuerpo.meta?.filas_leidas;
  const filasDelBanco = banco.cuerpo?.meta?.filas_leidas;

  if (bytesDespues > TECHO_DEL_RESUMEN) {
    problemas.push(
      `?resumen=1 pesa ${bytesDespues} bytes y el techo son ${TECHO_DEL_RESUMEN}: los ids salieron ` +
        'mas caros de lo que la iteracion 33 acepta'
    );
  }

  const { sqlResumen } = await import(
    pathToFileURL(join(RAIZ, 'functions', 'api', 'preguntas.js')).href
  );

  const consultaDeAhora = sqlResumen(false);
  const consultaDeAntes = consultaDeAhora.replace(/,\s*\n\s*group_concat\(id\) AS preguntas_ids/, '');

  if (consultaDeAntes === consultaDeAhora) {
    problemas.push(
      'no pude derivar la consulta de antes quitandole los ids a la de ahora: la comparacion de ' +
        'planes estaria comparando la consulta consigo misma y no diria nada'
    );
  }

  const plan = (sql) =>
    (consultar(`EXPLAIN QUERY PLAN ${sql.trim().replace(/;$/, '')};`) ?? [])
      .map((f) => f.detail)
      .join(' | ');

  const planAntes = plan(consultaDeAntes);
  const planAhora = plan(consultaDeAhora);

  if (planAntes === '' || planAhora === '') {
    problemas.push('no pude leer el plan de las consultas del resumen para comparar filas leidas');
  } else if (planAntes !== planAhora) {
    problemas.push(
      `agregar los ids cambio el plan de la consulta, asi que puede estar leyendo mas filas:\n` +
        `      antes: ${planAntes}\n      ahora: ${planAhora}`
    );
  }

  if (!Number.isInteger(filasDespues) || !Number.isInteger(filasDelBanco)) {
    problemas.push('la capa de datos no informo filas_leidas: no se puede medir si el resumen subio');
  } else if (filasDespues >= filasDelBanco) {
    problemas.push(
      `?resumen=1 leyo ${filasDespues} filas y el banco entero ${filasDelBanco}: el resumen dejo ` +
        'de ser barato en filas'
    );
  }

  notas.push(
    `Resumen: ${delResumen.size} modulos en ${(resumen.bytes / 1024).toFixed(1)} KB, ` +
      `frente a ${(banco.bytes / 1024).toFixed(1)} KB del banco entero ` +
      `(${proporcion.toFixed(0)} veces menos). Valores invalidos rechazados con 400.`
  );
  notas.push(
    `Coste de los ids, medido en esta ejecucion: ${bytesAntes} bytes antes y ${bytesDespues} ` +
      `despues (techo ${TECHO_DEL_RESUMEN}). filas_leidas ${filasDespues}, con el mismo plan de ` +
      `consulta que sin los ids, frente a ${filasDelBanco} del banco entero.`
  );

  // ------------------------------------------------------------------------
  // 3 · DOM falso, fetch apuntando al servidor local, y el componente real
  // ------------------------------------------------------------------------

  const dom = prepararDomFalso();
  globalThis.fetch = (ruta, opciones) => fetchReal(DIRECCION + ruta, opciones);

  const { mostrarModulo, renderCuestionario, setupReinicio, setupRepaso } = await import(
    pathToFileURL(join(SITIO, 'components', 'cuestionario.js')).href
  );
  const { pintarIndice } = await import(
    pathToFileURL(join(SITIO, 'components', 'indice-modulos.js')).href
  );
  const { esc } = await import(pathToFileURL(join(SITIO, 'utils', 'dom.js')).href);

  // ------------------------------------------------------------------------
  // 4 · El estado vacio. Va PRIMERO, porque es el unico momento en que todavia
  //     no se ha dibujado ningun modulo y se puede comprobar que no hay ninguno.
  // ------------------------------------------------------------------------

  // Se espera, porque desde la iteracion 32 esta funcion pide el resumen de los
  // siete conteos antes de terminar. Sin el await, las comprobaciones del indice
  // mirarian un indice todavia sin cifras y dirian que faltan.
  await renderCuestionario();

  // Lo mismo que hace static/js/cuestionario-main.js al abrir la pagina. Hasta la
  // iteracion 34 este guion no ataba estos dos, asi que corria sobre una pagina a
  // medio conectar: los botones del panel no respondian a nada.
  setupReinicio();
  setupRepaso();

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
  if (!vacio.includes('data-ir-al-indice')) {
    problemas.push('el estado vacio no lleva el enlace al indice de modulos');
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
  // 5 · El indice trae los siete modulos, con sus cifras, y ninguno marcado
  //
  // La iteracion 31 comprobaba aqui lo contrario —que NO hubiera cifras antes de
  // elegir—, porque entonces no habia de donde sacarlas y cualquier numero habria
  // sido inventado. Con `?resumen=1` (ADR-033) ya hay dato, asi que ahora tienen
  // que estar las siete y tienen que ser las de la base. La regla no cambio: sigue
  // sin haber ningun numero que no salga de un dato.
  // ------------------------------------------------------------------------

  const indiceVacio = dom.html('#indice-modulos');
  const ofrecidos = [...indiceVacio.matchAll(/data-modulo="(\d+)"/g)].map((m) => Number(m[1]));

  if (ofrecidos.join(',') !== '2,3,4,5,6,7,8') {
    problemas.push(`el indice ofrece «${ofrecidos.join(', ')}» y tenia que ofrecer del 2 al 8`);
  }

  // Nada marcado como activo: no se ha elegido ningun modulo todavia.
  if (indiceVacio.includes('aria-current')) {
    problemas.push('el indice marca un modulo activo cuando todavia no se ha elegido ninguno');
  }

  // Las siete cifras, contra la base consultada aparte.
  //
  // Desde la iteracion 33 la fila dice «respondidas/total». Aqui todavia no se ha
  // respondido nada —esta comprobacion va primero a proposito—, asi que las siete
  // tienen que decir «0/N». Que el cero se mueva se prueba en
  // scripts/probar-memoria.mjs.
  //
  // El motivo escrito hasta la iteracion 34 era otro y era falso: «este guion corre
  // sin almacenamiento». Sin almacenamiento tambien se recuerda, porque la memoria
  // de la visita existe justo para eso (decision 7 de la 34). Lo que sostiene el
  // cero es el orden, no la falta de almacen.
  for (const fila of porModulo) {
    const enElIndice = new RegExp(
      `data-modulo="${fila.modulo}"[\\s\\S]*?>\\s*0/${fila.cuantas}\\s*<`
    );
    if (!enElIndice.test(indiceVacio)) {
      problemas.push(
        `el indice no muestra «0/${fila.cuantas}» en el modulo ${fila.modulo} al abrir`
      );
    }
  }

  // Y que el nombre accesible diga lo mismo que la fila muestra: en pantallas
  // angostas el titulo se esconde, asi que sin esto la fila se anunciaria como
  // «Modulo 3, 61» y no se sabria que es.
  const conEtiqueta = [...indiceVacio.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);
  if (conEtiqueta.length !== ofrecidos.length) {
    problemas.push(
      `${ofrecidos.length - conEtiqueta.length} filas del indice no tienen nombre accesible`
    );
  }
  if (!conEtiqueta.every((e) => /M.dulo \d+: .+\d+ pregunta/.test(e))) {
    problemas.push('algun nombre accesible del indice no dice el modulo, su titulo y su cantidad');
  }

  // El titulo tiene que aparecer en el mismo punto de corte en que la lista pasa a
  // una columna. Estuvo en `xl` mientras la lista pasaba a una columna en `lg`, asi
  // que entre 1024 y 1280 px habia una columna ancha mostrando solo «Módulo 3».
  if (/hidden xl:inline/.test(indiceVacio)) {
    problemas.push(
      'el titulo del modulo se esconde hasta xl, y la lista es de una columna desde lg: ' +
        'entre 1024 y 1280 px queda una fila ancha sin titulo'
    );
  }
  if (!/hidden lg:inline/.test(indiceVacio)) {
    problemas.push('el titulo del modulo no aparece en lg, que es donde la fila se ensancha');
  }

  // Y el modulo activo tiene que distinguirse por algo que no sea color. Aqui se
  // comprueba que la diferencia estructural exista —la barra de 4 px a la
  // izquierda, presente en todas las filas y solo pintada en la activa—; que se
  // vea en escala de grises lo comprueba el autor con una captura.
  if (!/border-l-4/.test(indiceVacio)) {
    problemas.push(
      'las filas del indice no reservan la barra izquierda: sin ella el activo solo se ' +
        'distingue por color'
    );
  }

  notas.push(
    `Indice: ${ofrecidos.length} modulos, con sus siete cifras desde ?resumen=1, ` +
      'ninguno marcado antes de elegir, titulo visible desde lg y barra de 4 px reservada.'
  );

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

    // El indice marca este modulo y ningun otro.
    const indice = dom.html('#indice-modulos');
    const marcados = [
      ...indice.matchAll(/data-modulo="(\d+)"[^>]*aria-current/g),
    ].map((m) => Number(m[1]));

    if (marcados.length !== 1 || marcados[0] !== fila.modulo) {
      problemas.push(
        `modulo ${fila.modulo}: el indice marca «${marcados.join(', ') || 'ninguno'}» como activo`
      );
    }

    // La barra izquierda pintada aparece una vez y solo una: en el activo.
    const conBarra = (indice.match(/border-l-jsyellow/g) ?? []).length;
    const sinBarra = (indice.match(/border-l-transparent/g) ?? []).length;

    if (conBarra !== 1 || sinBarra !== ofrecidos.length - 1) {
      problemas.push(
        `modulo ${fila.modulo}: ${conBarra} filas con la barra pintada y ${sinBarra} sin ella, ` +
          `y tenian que ser 1 y ${ofrecidos.length - 1}`
      );
    }

    // Y la cuenta que el indice prometio es la que se dibujo. Es la comprobacion
    // que ADR-033 exige: el resumen cuenta filas de la vista y /api/preguntas
    // valida por fila, asi que una pregunta descartada haria que el indice
    // prometiera 61 y la pagina dibujara 60. Una discrepancia silenciosa se
    // convierte aqui en un veredicto.
    const prometidas = delResumen.get(fila.modulo);
    if (prometidas !== ids.length) {
      problemas.push(
        `modulo ${fila.modulo}: ?resumen=1 promete ${prometidas} preguntas y se dibujaron ${ids.length}`
      );
    }
  }

  notas.push(
    `Dibujado por modulo: ${[...dibujadoPorModulo].map(([m, c]) => `${m}=${c}`).join(', ')} ` +
      `(total ${totalDelBanco} en la base).`
  );

  // ------------------------------------------------------------------------
  // 7 · El control sigue libre despues de elegir
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
    if (!new RegExp(`data-modulo="${numero}"[^>]*aria-current`).test(dom.html('#indice-modulos'))) {
      problemas.push(
        `al recorrer ${recorrido.join(' → ')}, el indice no quedo marcando el modulo ${numero}`
      );
    }
  }

  notas.push(`Control libre: ${vistos.join(', ')} sin recargar.`);

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
  // 8b · El cambio de modulo: sin aviso, y por una sola puerta
  //
  // QUE SE FUE DE AQUI, Y POR QUE
  //
  // Esta seccion probaba el aviso de perdida de avance de las iteraciones 31 y 32:
  // cuando aparecia, que decia, y que apareciera ANTES de pedir el modulo. La
  // iteracion 33 lo retiro entero, porque con memoria cambiar de modulo ya no cuesta
  // nada y un aviso que no protege de nada entrena a ignorar los avisos. Probar que
  // ya no aparece es probar que el cambio pasa directo, que es el caso A.
  //
  // QUE SE QUEDA, Y ES LO QUE SOSTIENE EL RESTO
  //
  //   A. Que el cambio pase DIRECTO, con respuestas dentro y sin ellas. Si algo se
  //      quedara preguntando por el medio, el modulo nuevo no se dibujaria.
  //   B. Que la puerta unica siga siendo unica. Su motivo cambio —ya no guarda el
  //      aviso, sino la guarda contra la doble peticion y el reintento tras una
  //      carga fallida— pero el defecto que evita es el mismo: un segundo camino a
  //      mostrarModulo() se las salta EN SILENCIO.
  //   C. Que no quede ni un resto del aviso en el sitio ni en los guiones. Un
  //      identificador huerfano es una funcion que nadie llama hasta que alguien la
  //      llama.
  //
  // Lo que la memoria recuerda se prueba aparte, en scripts/probar-memoria.mjs: para
  // eso hay que abrir la pagina varias veces, y eso no se puede fingir dentro de un
  // solo proceso.
  // ------------------------------------------------------------------------
  /**
   * Las preguntas que este guion respondio desde el ultimo dibujo.
   *
   * Hace falta desde la iteracion 34: `responder()` no vuelve a dibujar, asi que el
   * HTML del contenedor sigue mostrando como sin responder una pregunta que ya se
   * respondio. Sin esta lista, `responderUna()` pulsaria tres veces la misma.
   */
  let yaRespondidas = new Set();

  /**
   * Cuantas preguntas respondio este guion en cada modulo, en toda la corrida.
   *
   * Tambien es de la iteracion 34, y por el mismo motivo. Antes responder no dejaba
   * rastro y el indice podia darse por sentado en «0/N» de principio a fin. Ahora la
   * memoria de la visita conserva lo respondido **aunque no haya almacenamiento**
   * —para eso existe—, asi que lo que el indice tiene que decir depende de lo que
   * este guion haya ido respondiendo. Se lleva la cuenta en vez de suponerla.
   */
  const respondidasPorModulo = new Map();

  /** Deja el componente en un modulo, esperando a que termine de dibujarlo. */
  const asentar = async (numero) => {
    await mostrarModulo(numero);
    yaRespondidas = new Set();
  };

  /** Que modulo esta marcando el indice ahora mismo, o null. */
  const marcadoEnElIndice = () => {
    const m = dom.html('#indice-modulos').match(/data-modulo="(\d+)"[^>]*aria-current/);
    return m ? Number(m[1]) : null;
  };

  /**
   * Responde una pregunta del modulo dibujado, eligiendo su alternativa correcta.
   *
   * SE FABRICA EL BOTON QUE EL NAVEGADOR TENDRIA, Y ESO CAMBIO EN LA ITERACION 34
   *
   * Antes este ayudante creaba un boton pelado, sin `data-alternativa` y sin una
   * tarjeta de la que colgar. `responder()` no lograba identificar la pregunta y las
   * barras se sumaban a mano por una rama que existia solo para este caso. La rama
   * se quito —ningun navegador puede llegar ahi: toda alternativa dibujada lleva su
   * id y su tarjeta su `data-pregunta`—, asi que lo que se pulsa aca tiene que ser
   * lo que se pulsa alla. Los dos ids salen del HTML que el componente acaba de
   * dibujar, no de un numero inventado.
   *
   * **Sigue eligiendo la correcta**, que es lo que sostiene la asimetria 3/3/0 de
   * las barras: si las tres esperaran el mismo numero, una que copiara el valor de
   * otra pasaria sin que nadie lo notara.
   */
  const responderUna = () => {
    const html = dom.html('#cuestionario');

    const preguntaId = idsDibujados(html).find(
      (id) => !yaRespondidas.has(id) && !bloqueDePregunta(html, id).includes('data-answered="true"')
    );

    if (preguntaId === undefined) {
      problemas.push('no quedaba ninguna pregunta sin responder en el modulo dibujado');
      return 0;
    }

    const alternativaId = Number(
      bloqueDePregunta(html, preguntaId).match(/data-correct="true" data-alternativa="(\d+)"/)?.[1]
    );

    if (!Number.isInteger(alternativaId)) {
      problemas.push(
        `la pregunta ${preguntaId} se dibujo sin una alternativa correcta que se pueda pulsar`
      );
      return 0;
    }

    yaRespondidas.add(preguntaId);

    const moduloDibujado = Number(html.match(/id="grupo-modulo-(\d+)"/)?.[1]);
    if (Number.isInteger(moduloDibujado)) {
      respondidasPorModulo.set(moduloDibujado, (respondidasPorModulo.get(moduloDibujado) ?? 0) + 1);
    }

    const tarjeta = dom.nodo(`#tarjeta-q${preguntaId}`);
    tarjeta.dataset.pregunta = `q${preguntaId}`;

    const boton = dom.nodo(`#alternativa-${alternativaId}`);
    boton.disabled = false;
    boton.dataset.correct = 'true';
    boton.dataset.alternativa = String(alternativaId);
    boton.closest = (selector) => (selector === '[data-pregunta]' ? tarjeta : boton);

    return dom.disparar('#cuestionario', 'click', {
      target: { closest: (s) => (s === '.quiz-option' ? boton : null) },
    });
  };

  /** Simula que el estudiante pulsa una fila del indice. */
  const elegirEnElIndice = (numero) => {
    const fila = { dataset: { modulo: String(numero) } };
    yaRespondidas = new Set();

    return dom.disparar('#indice-modulos', 'click', {
      target: { closest: (s) => (s === '[data-modulo]' ? fila : null) },
    });
  };

  if (dom.nodo('#indice-modulos').oyentes.get('click') === undefined) {
    problemas.push('el componente no se ato al indice: ningun cambio de modulo llegaria');
  }

  /** Cuantas preguntas dice la base que tiene un modulo. */
  const cuantasTiene = (numero) => porModulo.find((f) => f.modulo === numero)?.cuantas;

  // --- caso A: el cambio pasa directo, con respuestas dentro y sin ellas ----

  await asentar(MODULO_DE_MUESTRA);
  elegirEnElIndice(5);
  await new Promise((listo) => setTimeout(listo, 1500));

  if (idsDibujados(dom.html('#cuestionario')).length !== cuantasTiene(5)) {
    problemas.push('sin nada respondido, el cambio de modulo no llego a dibujarse');
  }

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

  elegirEnElIndice(6);
  await new Promise((listo) => setTimeout(listo, 1500));

  const trasElSalto = idsDibujados(dom.html('#cuestionario'));

  if (trasElSalto.length !== cuantasTiene(6)) {
    problemas.push(
      `con 1 respuesta dentro, saltar al modulo 6 dibujo ${trasElSalto.length} preguntas y tiene ` +
        `${cuantasTiene(6)}: algo se quedo preguntando por el medio, y el aviso de perdida esta ` +
        'retirado desde la iteracion 33'
    );
  }
  if (marcadoEnElIndice() !== 6) {
    problemas.push(
      `tras saltar con respuestas dentro, el indice marca el modulo «${marcadoEnElIndice()}»`
    );
  }

  notas.push(
    'Cambio de modulo con 1 respuesta dentro: paso directo al modulo 6, sin preguntar nada. El ' +
      'aviso de perdida ya no existe.'
  );

  // --- caso B: la puerta unica sigue cazando --------------------------------
  //
  // Se pide el mismo modulo dos veces seguidas, sin esperar a que llegue la primera.
  // Por la puerta, la segunda no sale a la red. Saltandosela —que es lo que haria un
  // segundo camino a mostrarModulo()— sale, y son 12 a 17 KB comprimidos por la
  // misma pregunta
  // en una conexion modesta, que es el publico de vision.md.

  const contarPeticiones = () => {
    const anterior = globalThis.fetch;
    let cuantas = 0;

    globalThis.fetch = (ruta, opciones) => {
      if (String(ruta).includes('/api/preguntas?modulo=')) cuantas += 1;
      return anterior(ruta, opciones);
    };

    return () => {
      globalThis.fetch = anterior;
      return cuantas;
    };
  };

  await asentar(MODULO_DE_MUESTRA);

  let cerrarCuenta = contarPeticiones();
  elegirEnElIndice(2);
  elegirEnElIndice(2);
  await new Promise((listo) => setTimeout(listo, 1500));
  const porLaPuerta = cerrarCuenta();

  await asentar(MODULO_DE_MUESTRA);

  cerrarCuenta = contarPeticiones();
  mostrarModulo(4);
  mostrarModulo(4);
  await new Promise((listo) => setTimeout(listo, 1500));
  const saltandosela = cerrarCuenta();

  if (porLaPuerta !== 1) {
    problemas.push(
      `pulsar dos veces el mismo modulo en el indice lo pidio ${porLaPuerta} veces: la guarda ` +
        'contra la doble peticion no esta en la puerta, o la puerta dejo de ser el unico camino'
    );
  }
  if (saltandosela <= porLaPuerta) {
    problemas.push(
      `saltarse la puerta cuesta lo mismo que pasar por ella (${saltandosela} contra ` +
        `${porLaPuerta} peticiones): esta prueba ya no distingue una cosa de la otra, asi que ` +
        'dejo de vigilar que la puerta sea unica'
    );
  }

  notas.push(
    `Puerta unica: dos pulsaciones seguidas del mismo modulo salieron a la red ${porLaPuerta} vez; ` +
      `llamando a mostrarModulo() por fuera, ${saltandosela}. La guarda vive en la puerta.`
  );

  // --- caso C: no queda ni un resto del aviso -------------------------------
  //
  // Se buscan los identificadores que SOLO existian para el aviso. Se buscan esos y
  // no la palabra «aviso», porque las ADR y las bitacoras lo siguen nombrando —y
  // deben: son registro historico de por que estuvo y por que se fue—. Lo que no
  // puede quedar es el mecanismo.
  //
  // Este archivo queda fuera del barrido por un motivo evidente: es el que lleva la
  // lista. Nombrarlos aqui es lo contrario de tenerlos vivos.

  const RESTOS_DEL_AVISO = [
    'aviso-cambio-modulo',
    'confirmar-cambio',
    'cancelar-cambio',
    'pedirConfirmacion',
    'Quedarme acá',
    'El avance todavía no se guarda',
  ];

  const DONDE_BARRER = [
    join(RAIZ, 'cuestionario.html'),
    join(RAIZ, 'index.html'),
    join(SITIO, 'components', 'cuestionario.js'),
    join(SITIO, 'components', 'indice-modulos.js'),
    join(SITIO, 'components', 'estado-datos.js'),
    join(SITIO, 'cuestionario-main.js'),
    join(SITIO, 'main.js'),
    join(SITIO, 'servicios', 'datos.js'),
    join(SITIO, 'servicios', 'memoria.js'),
    join(RAIZ, 'simulacro.html'),
    join(SITIO, 'components', 'simulacro.js'),
    join(SITIO, 'components', 'transicion-de-carga.js'),
    join(SITIO, 'components', 'aviso-de-respaldo.js'),
    join(SITIO, 'servicios', 'eleccion-del-intento.js'),
    join(SITIO, 'data', 'hermanas.js'),
    join(SITIO, 'simulacro-main.js'),
    join(AQUI, 'probar-escapado.mjs'),
    join(AQUI, 'probar-memoria.mjs'),
    join(AQUI, 'dom-falso.mjs'),
  ];

  for (const archivo of DONDE_BARRER) {
    if (!existsSync(archivo)) continue;

    const contenido = readFileSync(archivo, 'utf8');

    for (const resto of RESTOS_DEL_AVISO) {
      if (contenido.includes(resto)) {
        problemas.push(
          `queda un resto del aviso de perdida: «${resto}» sigue en ` +
            `${archivo.replace(RAIZ, '').replace(/^[\\/]/, '')}`
        );
      }
    }
  }

  notas.push(
    `Aviso retirado: ninguno de sus ${RESTOS_DEL_AVISO.length} identificadores queda en las dos ` +
      `paginas, los componentes ni los guiones (${DONDE_BARRER.length} archivos barridos).`
  );

  // ------------------------------------------------------------------------
  // 8c · Las tres barras dicen su cifra y su porcentaje, y cuadran entre si
  //
  // Es la mitad del criterio de la iteracion 32 que se puede provocar sin
  // navegador: que cada barra lleve su cifra absoluta y su porcentaje, y que los
  // dos correspondan a lo que se respondio. Que se VEAN horizontales y a todo el
  // ancho es la otra mitad, y esa se mira en la pagina.
  //
  // Se responde de verdad, una por una, en vez de escribir los numeros a mano: un
  // panel que cuadra con cifras inventadas no prueba nada.
  // ------------------------------------------------------------------------

  await asentar(MODULO_DE_MUESTRA);

  // Se reinicia antes de contar, y es nuevo desde la iteracion 34. Antes de ella
  // responder no dejaba rastro, asi que este bloque siempre empezaba de cero sin
  // pedirlo. Ahora la memoria de la visita conserva lo que se respondio mas arriba
  // en este mismo guion, y contar 3 sobre lo que ya habia daria 4. Se limpia por el
  // camino del estudiante —el boton de reiniciar— y no tocando la memoria por
  // dentro, que es lo que este guion existe para no hacer.
  dom.disparar("#reiniciar", "click", {});
  yaRespondidas = new Set();
  respondidasPorModulo.set(MODULO_DE_MUESTRA, 0);

  if (dom.texto('#valor-avance') !== '0') {
    problemas.push(
      `reiniciar no dejo el modulo en cero antes de contar las barras: dice ` +
        `«${dom.texto('#valor-avance')}»`
    );
  }

  const delModulo = porModulo.find((f) => f.modulo === MODULO_DE_MUESTRA)?.cuantas ?? 0;
  const CUANTAS_RESPONDER = 3;

  for (let i = 0; i < CUANTAS_RESPONDER; i += 1) responderUna();

  const porcentaje = (valor) => (delModulo === 0 ? 0 : Math.round((valor / delModulo) * 100));

  // `responderUna()` marca la alternativa como correcta, asi que las tres van a
  // «correctas» y ninguna a «incorrectas». Se escribe con esa asimetria a
  // proposito: si las tres barras esperaran el mismo numero, una que copiara el
  // valor de otra pasaria la prueba sin que nadie lo notara.
  const barras = [
    ['respondidas', '#valor-avance', '#pct-avance', CUANTAS_RESPONDER],
    ['correctas', '#valor-correctas', '#pct-correctas', CUANTAS_RESPONDER],
    ['incorrectas', '#valor-incorrectas', '#pct-incorrectas', 0],
  ];

  for (const [nombre, idValor, idPct, esperado] of barras) {
    if (dom.texto(idValor) !== String(esperado)) {
      problemas.push(
        `la barra de ${nombre} dice «${dom.texto(idValor)}» y tenian que ser ${esperado}`
      );
    }

    const esperadoPct = `${porcentaje(esperado)}%`;
    if (dom.texto(idPct) !== esperadoPct) {
      problemas.push(
        `la barra de ${nombre} dice «${dom.texto(idPct)}» de porcentaje y su cifra da ${esperadoPct}`
      );
    }
  }

  // Y el ancho de cada barra sigue a su porcentaje. Son horizontales desde la
  // iteracion 32, asi que lo que crece es el ancho y no el alto: si alguien las
  // devolviera a `height`, se quedarian quietas en cero y el panel seguiria
  // diciendo los numeros correctos al lado. Es un fallo que solo se ve mirando,
  // y por eso se comprueba aqui.
  const anchos = {
    '#barra-avance': `${porcentaje(CUANTAS_RESPONDER)}%`,
    '#barra-correctas': `${porcentaje(CUANTAS_RESPONDER)}%`,
    '#barra-incorrectas': `${porcentaje(0)}%`,
  };

  for (const [id, esperado] of Object.entries(anchos)) {
    const estilo = dom.nodo(id).style;

    if (estilo.height !== undefined) {
      problemas.push(
        `${id} sigue creciendo a lo alto: las barras son horizontales desde la iteracion 32`
      );
    }
    if (estilo.width !== esperado) {
      problemas.push(`${id} quedo con un ancho de «${estilo.width}» y su cifra da ${esperado}`);
    }
  }

  notas.push(
    `Barras: tras responder ${CUANTAS_RESPONDER} de ${delModulo}, cada una dice su cifra y su ` +
      `porcentaje —${porcentaje(CUANTAS_RESPONDER)}% respondidas y correctas, 0% incorrectas—, ` +
      'y el ancho de cada una los acompana.'
  );

  // ------------------------------------------------------------------------
  // 8d · Donde queda el foco, camino por camino
  //
  // El defecto que esto caza es de los que no se ven: el foco se cae al `body` y
  // la pantalla queda igual de bonita. Solo lo nota quien navega con teclado, y lo
  // nota teniendo que volver a tabular desde la barra de navegacion.
  //
  // Tres caminos lo provocaban a la vez —cargar un modulo, confirmar el aviso, y
  // la llegada de los conteos—, porque los tres reescriben el `innerHTML` de algo
  // que podia tener el foco dentro.
  //
  // Con el aviso retirado en la iteracion 33 quedan dos, y el que se fue no se
  // reemplaza por nada: cambiar de modulo con respuestas dentro es ahora el mismo
  // camino que cambiarlo sin ellas. Que siga terminando en la cabecera del modulo
  // nuevo se comprueba igual, porque es la parte que no cambio.
  // ------------------------------------------------------------------------

  // --- elegir un modulo sin nada respondido --------------------------------
  await asentar(5);
  elegirEnElIndice(6);
  await new Promise((listo) => setTimeout(listo, 1500));

  if (dom.enfocado() === 'body') {
    problemas.push('elegir un modulo sin respuestas dejo el foco en el body');
  }
  if (dom.enfocado() !== '#cabecera-modulo-6') {
    problemas.push(
      `tras cargar el modulo 6 el foco quedo en «${dom.enfocado()}» y tenia que quedar en ` +
        'su cabecera: en telefono las preguntas estan pantalla y media mas abajo'
    );
  }

  // --- elegir otro modulo CON respuestas dentro ------------------------------
  //
  // Antes este camino pasaba por el aviso y habia que confirmarlo. Ahora es directo,
  // y el foco tiene que terminar en el mismo sitio: la cabecera del modulo nuevo. Si
  // quedara en el body, quien navega con teclado se quedaria sin saber que su
  // eleccion se cumplio.
  responderUna();
  elegirEnElIndice(7);
  await new Promise((listo) => setTimeout(listo, 1500));

  if (dom.enfocado() === 'body') {
    problemas.push('cambiar de modulo con respuestas dentro dejo el foco en el body');
  }
  if (dom.enfocado() !== '#cabecera-modulo-7') {
    problemas.push(
      `tras cambiar al modulo 7 con respuestas dentro, el foco quedo en «${dom.enfocado()}»`
    );
  }

  // --- la llegada tardia de los conteos -------------------------------------
  //
  // El estudiante esta recorriendo el indice con el tabulador cuando llega el
  // resumen y la lista se repinta entera. Se simula poniendo el foco en una fila
  // —con su `data-modulo`, como lo lleva el boton de verdad— y repintando.
  const filaTres = dom.nodo('#indice-modulos > [data-modulo="3"]');
  filaTres.dataset.modulo = '3';
  filaTres.focus();

  pintarIndice();

  if (dom.enfocado() === 'body') {
    problemas.push(
      'repintar el indice —lo que pasa cuando llegan los conteos— tiro el foco al body'
    );
  }
  if (!dom.enfocado().includes('data-modulo="3"')) {
    problemas.push(
      `tras repintar el indice el foco quedo en «${dom.enfocado()}» en vez de volver a su fila`
    );
  }

  notas.push(
    'Foco: elegir un modulo deja en su cabecera, con respuestas dentro y sin ellas, y repintar ' +
      'el indice conserva la fila que lo tenia. Ninguno cae al body.'
  );

  // ------------------------------------------------------------------------
  // 8d-bis · Pulsar dos veces mientras carga NO pide dos veces
  //
  // El reintento tras una carga fallida abrio esta puerta sin querer: «no hay nada
  // cargado» tambien es cierto mientras carga. En una conexion modesta el
  // estudiante pulsa otra vez creyendo que no registro el toque, y cada toque son
  // 12 a 17 KB comprimidos —45 a 66 KB sin comprimir— por la misma pregunta,
  // medido el 2026-09-16 (decision 1 de la iteracion 35).
  //
  // Se provoca de verdad: se retrasa la respuesta del modulo y se pulsa tres veces
  // seguidas, contando cuantas peticiones salen.
  // ------------------------------------------------------------------------

  const MODULO_DOBLE = 5;
  const RETRASO_MS = 700;

  await asentar(7);

  let peticionesDelModulo = 0;
  const fetchSinRetraso = globalThis.fetch;

  globalThis.fetch = (ruta, opciones) => {
    const texto = String(ruta);

    if (texto.includes(`modulo=${MODULO_DOBLE}`) && !texto.includes('resumen')) {
      peticionesDelModulo += 1;
      return new Promise((listo) => {
        setTimeout(() => listo(fetchSinRetraso(ruta, opciones)), RETRASO_MS);
      });
    }

    return fetchSinRetraso(ruta, opciones);
  };

  // Tres toques seguidos, como los daria alguien que cree que no paso nada.
  elegirEnElIndice(MODULO_DOBLE);
  elegirEnElIndice(MODULO_DOBLE);
  elegirEnElIndice(MODULO_DOBLE);

  await new Promise((listo) => setTimeout(listo, RETRASO_MS + 1500));
  globalThis.fetch = fetchSinRetraso;

  if (peticionesDelModulo !== 1) {
    problemas.push(
      `pulsar 3 veces el modulo ${MODULO_DOBLE} mientras cargaba salio a pedirlo ` +
        `${peticionesDelModulo} veces: cada una son decenas de KB por lo mismo`
    );
  }

  const trasLosTresToques = idsDibujados(dom.html('#cuestionario'));
  const esperadasDelDoble = porModulo.find((f) => f.modulo === MODULO_DOBLE)?.cuantas ?? 0;

  if (trasLosTresToques.length !== esperadasDelDoble) {
    problemas.push(
      `tras pulsar 3 veces el modulo ${MODULO_DOBLE} quedaron ${trasLosTresToques.length} ` +
        `preguntas dibujadas y tenian que ser ${esperadasDelDoble}`
    );
  }

  notas.push(
    `Doble toque: 3 pulsaciones sobre el modulo ${MODULO_DOBLE} mientras cargaba salieron a ` +
      `pedirlo ${peticionesDelModulo} vez, y quedo dibujado entero.`
  );

  // ------------------------------------------------------------------------
  // 8e · Una carga fallida deja las dos mitades hablando del mismo modulo
  //
  // Se provoca de verdad, haciendo que la capa de datos rechace la peticion de un
  // modulo concreto. Se elige un rechazo con `usar_respaldo: false` a proposito:
  // es el unico fallo que NO cae a la instantanea, asi que es el que deja al
  // estudiante sin preguntas y con un mensaje.
  // ------------------------------------------------------------------------

  const MODULO_QUE_FALLA = 2;
  const fetchDelServidor = globalThis.fetch;

  globalThis.fetch = (ruta, opciones) => {
    if (String(ruta).includes(`modulo=${MODULO_QUE_FALLA}`) && !String(ruta).includes('resumen')) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            ok: false,
            error: {
              codigo: 'PETICION_INVALIDA',
              mensaje: 'Rechazo provocado por la prueba.',
              usar_respaldo: false,
            },
          }),
          { status: 400, headers: { 'content-type': 'application/json' } }
        )
      );
    }
    return fetchDelServidor(ruta, opciones);
  };

  await asentar(MODULO_QUE_FALLA);

  const trasFallar = dom.html('#cuestionario');

  if (!trasFallar.includes('No se pudo cargar el módulo')) {
    problemas.push('una carga rechazada no dijo que no se pudo cargar');
  }
  if (idsDibujados(trasFallar).length !== 0) {
    problemas.push('una carga rechazada dejo preguntas dibujadas');
  }

  // Las dos mitades tienen que hablar del mismo modulo. Antes de la auditoria, la
  // zona derecha decia «no se pudo cargar el Módulo 2» y el indice seguia marcando
  // el anterior.
  if (marcadoEnElIndice() !== MODULO_QUE_FALLA) {
    problemas.push(
      `tras fallar la carga del modulo ${MODULO_QUE_FALLA}, el indice marca ` +
        `«${marcadoEnElIndice()}»: las dos mitades de la pantalla dicen modulos distintos`
    );
  }

  // Y el foco en el mensaje, no en una cabecera que no existe ni en el body.
  if (dom.enfocado() === 'body') {
    problemas.push('una carga rechazada dejo el foco en el body');
  }
  if (dom.enfocado() !== '#mensaje-cuestionario') {
    problemas.push(
      `tras una carga rechazada el foco quedo en «${dom.enfocado()}» en vez de en el mensaje ` +
        'que explica lo que paso'
    );
  }
  if (dom.enfocado().includes('cabecera-modulo')) {
    problemas.push('tras una carga rechazada se fue a una cabecera que no existe');
  }

  // Pulsar el mismo modulo reintenta. Antes no hacia nada —`numero === estado.modulo`
  // cortaba— y el unico camino de vuelta era recargar la pagina.
  globalThis.fetch = fetchDelServidor;
  elegirEnElIndice(MODULO_QUE_FALLA);
  await new Promise((listo) => setTimeout(listo, 1500));

  const trasReintentar = idsDibujados(dom.html('#cuestionario'));
  const esperadasTrasReintentar =
    porModulo.find((f) => f.modulo === MODULO_QUE_FALLA)?.cuantas ?? 0;

  if (trasReintentar.length !== esperadasTrasReintentar) {
    problemas.push(
      `pulsar el modulo ${MODULO_QUE_FALLA} despues de que fallara dibujo ` +
        `${trasReintentar.length} preguntas y tenia que reintentar y dibujar ` +
        `${esperadasTrasReintentar}`
    );
  }

  notas.push(
    `Carga fallida: el indice y la zona derecha hablan del modulo ${MODULO_QUE_FALLA}, el foco ` +
      'queda en el mensaje que lo explica, y volver a pulsarlo reintenta —la guarda del doble ' +
      'toque no estorba al reintento—.'
  );

  // ------------------------------------------------------------------------
  // 8f · La transicion de carga (iteracion 35)
  //
  // Todo lo de aqui abajo se provoca retrasando la respuesta del extremo, nunca
  // tocando la base. El retraso es POR MODULO y los plazos salen de
  // PLAZO_DE_CARGA_LENTA_MS, la misma constante que usa el componente: con un
  // numero copiado a mano, el dia que el plazo cambiara estas pruebas seguirian
  // midiendo contra el viejo y pasarian en verde sin probar nada.
  // ------------------------------------------------------------------------

  const { PISO_DE_LA_TRANSICION_MS: PISO, PLAZO_DE_CARGA_LENTA_MS: PLAZO } = await import(
    pathToFileURL(join(SITIO, 'components', 'cuestionario.js')).href
  );

  /** Espera. Se usa tanto aqui abajo que escribirla entera cada vez solo hace ruido. */
  const esperar = (ms) => new Promise((listo) => setTimeout(listo, ms));

  /**
   * Retrasa la respuesta de cada modulo lo que diga el mapa, y devuelve como
   * deshacerlo.
   *
   * ES POR MODULO Y NO UN PLAZO UNICO, y esa es toda la diferencia con el
   * mecanismo que ya habia en 8d-bis: con un solo plazo las respuestas llegan en
   * el mismo orden en que se pidieron, y el caso que hay que cazar —la del primero
   * llegando despues que la del segundo— no se puede provocar.
   *
   * El resumen nunca se retrasa: no es lo que se esta midiendo, y retrasarlo solo
   * agregaria ruido al reloj.
   */
  function retrasarPorModulo(plazos) {
    const anterior = globalThis.fetch;

    globalThis.fetch = (ruta, opciones) => {
      const texto = String(ruta);
      const cual = texto.match(/modulo=(\d+)/);
      const espera = cual && !texto.includes('resumen') ? plazos[Number(cual[1])] : undefined;

      if (!espera) return anterior(ruta, opciones);

      return new Promise((listo) => {
        setTimeout(() => listo(anterior(ruta, opciones)), espera);
      });
    };

    return () => {
      globalThis.fetch = anterior;
    };
  }

  /** Cuantas veces aparece algo dentro de un texto. */
  const cuantasVeces = (texto, aguja) => texto.split(aguja).length - 1;

  const fetchLimpio = globalThis.fetch;

  // --- 8f-1 · Que dibuja la transicion, y que NO dibuja --------------------

  const MODULO_TRANSICION = 6;
  const deshacerTransicion = retrasarPorModulo({ [MODULO_TRANSICION]: 900 });

  const escriturasAntes = dom.escrituras('#cuestionario');
  elegirEnElIndice(MODULO_TRANSICION);

  await esperar(300);

  const enTransicion = dom.html('#cuestionario');

  if (!enTransicion.includes('js-logo.svg')) {
    problemas.push('la transicion no muestra el logotipo de JavaScript (decision 3)');
  }
  if (!enTransicion.includes('animate-latido')) {
    problemas.push('la transicion no declara ningun indicador de carga (decision 3)');
  }
  if (!enTransicion.includes(`Cargando el Módulo ${MODULO_TRANSICION}…`)) {
    problemas.push('la transicion no nombra el modulo que viene (decision 3)');
  }
  if (!enTransicion.includes('id="carga-lenta"')) {
    problemas.push('la transicion no deja puesto el hueco del texto de carga lenta');
  }

  // Ningun numero de avance. Se busca lo que un porcentaje dejaria en el HTML: el
  // signo, y los dos atributos con que se dibuja una barra de progreso de verdad.
  // Es la decision 1 escrita como prueba y no como intencion.
  for (const rastro of ['%', 'progressbar', 'aria-valuenow']) {
    if (enTransicion.includes(rastro)) {
      problemas.push(
        `la transicion trae «${rastro}» en el HTML: la decision 1 dice que no hay porcentaje ` +
          'ni nada que sugiera cuanto falta'
      );
    }
  }

  const escriturasDeLaTransicion = dom.escrituras('#cuestionario') - escriturasAntes;

  if (escriturasDeLaTransicion !== 1) {
    problemas.push(
      `dibujar la transicion reescribio la zona de preguntas ${escriturasDeLaTransicion} ` +
        'veces, y tiene que ser 1'
    );
  }
  if (dom.enfocado() !== '#mensaje-cuestionario') {
    problemas.push(
      `durante la carga el foco esta en «${dom.enfocado()}» y tiene que estar en el mensaje`
    );
  }
  if (dom.nodo('#reiniciar').disabled !== true) {
    problemas.push('durante la carga «Reiniciar el módulo» sigue disponible (decision 6)');
  }
  if (dom.nodo('#repaso').disabled !== true) {
    problemas.push('durante la carga «Repasar mis errores» sigue disponible (decision 6)');
  }
  if (!dom.nodo('#reiniciar').classList.contains('opacity-50')) {
    problemas.push('«Reiniciar el módulo» no se ve atenuado durante la carga');
  }
  if (!dom.nodo('#repaso').classList.contains('opacity-50')) {
    problemas.push('«Repasar mis errores» no se ve atenuado durante la carga');
  }
  if (dom.texto('#mensaje-avance') !== `Cargando el Módulo ${MODULO_TRANSICION}…`) {
    problemas.push(
      `durante la carga el panel dice «${dom.texto('#mensaje-avance')}»: no puede invitar a ` +
        'responder mientras la zona de preguntas dice que esta cargando'
    );
  }

  // Y pulsarlos no hace nada. `dom.disparar()` ejecuta los oyentes AUNQUE el nodo
  // este `disabled`, porque no es un navegador: si la guarda no estuviera tambien
  // dentro del oyente, esto lo destaparia.
  const htmlAntesDePulsar = dom.html('#cuestionario');
  dom.disparar('#reiniciar', 'click', {});
  dom.disparar('#repaso', 'click', {});

  if (dom.html('#cuestionario') !== htmlAntesDePulsar) {
    problemas.push('pulsar los controles del panel durante la carga cambio la zona de preguntas');
  }

  await esperar(900 + PISO + 700);
  deshacerTransicion();

  if (idsDibujados(dom.html('#cuestionario')).length !== cuantasTiene(MODULO_TRANSICION)) {
    problemas.push(`la transicion del modulo ${MODULO_TRANSICION} no termino dibujandolo`);
  }
  if (dom.nodo('#reiniciar').disabled !== false || dom.nodo('#repaso').disabled !== false) {
    problemas.push('al terminar la carga los controles del panel siguieron desactivados');
  }
  if (dom.html('#carga-lenta') !== '') {
    problemas.push(
      'una carga normal mostro el texto de «esta tardando»: el plazo de la decision 7 no ' +
        'puede alcanzarse en una carga sana'
    );
  }

  notas.push(
    `Transicion: logotipo quieto, indicador sin porcentaje y «Cargando el Módulo ` +
      `${MODULO_TRANSICION}…», con ${escriturasDeLaTransicion} sola reescritura de la zona, el ` +
      'foco en el mensaje y los dos controles del panel desactivados. Sin «%», sin progressbar ' +
      'y sin aria-valuenow.'
  );

  // --- 8f-2 · Nadie espera de mas -----------------------------------------
  //
  // Tres finales, medidos DESDE EL CLIC: instantanea, lenta y fallida inmediata.
  // La regla de la decision 5 es una sola —el mayor entre lo que tarda la carga y
  // el piso, y no mas—, asi que se comprueba con la misma formula las tres veces.

  const HOLGURA_MS = 700;
  const tiempos = [];

  const medir = async (numero, etiqueta, esperado) => {
    const desde = Date.now();
    await mostrarModulo(numero);
    const duro = Date.now() - desde;

    tiempos.push({ etiqueta, duro, esperado });

    if (duro < esperado - 60) {
      problemas.push(
        `${etiqueta}: del clic a ver el modulo pasaron ${duro} ms, por debajo del piso de ` +
          `${esperado} ms: la transicion parpadea`
      );
    }
    if (duro > esperado + HOLGURA_MS) {
      problemas.push(
        `${etiqueta}: del clic a ver el modulo pasaron ${duro} ms y lo esperado era ` +
          `~${esperado} ms: alguien espera de mas`
      );
    }
  };

  await medir(MODULO_DE_MUESTRA, 'Respuesta instantanea', PISO);

  const RETRASO_LENTO = PLAZO - 500;
  const deshacerLento = retrasarPorModulo({ [MODULO_DEGRADADO]: RETRASO_LENTO });
  await medir(MODULO_DEGRADADO, 'Respuesta lenta', RETRASO_LENTO);
  deshacerLento();

  // La fallida inmediata usa el rechazo con `usar_respaldo: false`, que es el unico
  // que NO cae a la instantanea: resuelve al instante, asi que lo unico que puede
  // explicar la espera es el piso. Es la decision 5 aplicada al final de error.
  const MODULO_FALLA_YA = 7;
  const fetchAntesDeFallar = globalThis.fetch;

  globalThis.fetch = (ruta, opciones) => {
    if (String(ruta).includes(`modulo=${MODULO_FALLA_YA}`) && !String(ruta).includes('resumen')) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            ok: false,
            error: {
              codigo: 'PETICION_INVALIDA',
              mensaje: 'Fallo provocado por la prueba.',
              usar_respaldo: false,
            },
          }),
          { status: 400, headers: { 'content-type': 'application/json' } }
        )
      );
    }
    return fetchAntesDeFallar(ruta, opciones);
  };

  await medir(MODULO_FALLA_YA, 'Fallida inmediata', PISO);
  globalThis.fetch = fetchAntesDeFallar;

  if (!dom.html('#cuestionario').includes('No se pudo cargar el módulo')) {
    problemas.push(
      'la carga fallida no dio paso al mensaje de error: la transicion quedo colgada'
    );
  }
  if (dom.enfocado() !== '#mensaje-cuestionario') {
    problemas.push(
      `tras una carga fallida el foco quedo en «${dom.enfocado()}» y tenia que ir al mensaje`
    );
  }
  if (dom.nodo('#reiniciar').disabled !== false || dom.nodo('#repaso').disabled !== false) {
    problemas.push('tras una carga fallida los controles del panel siguieron desactivados');
  }

  notas.push(
    'Nadie espera de mas (desde el clic, ms): ' +
      tiempos.map((t) => `${t.etiqueta} ${t.duro}, esperado ~${t.esperado}`).join(' · ') +
      `. Piso ${PISO} ms, holgura ${HOLGURA_MS} ms.`
  );

  // --- 8f-3 · Una respuesta vieja no apaga ni duplica la transicion --------
  //
  // ESTE ES EL MONTAJE DE H-1. Dos cargas, y la del primero llega MIENTRAS la del
  // segundo sigue viva. Los plazos salen del plazo del texto lento para que el
  // temporizador abandonado —el que armo la carga del primer modulo— alcance a
  // dispararse dentro de esa ventana: si no se hubiera cancelado al reemplazar el
  // registro, escribiria encima de la carga vigente.
  //
  //   t = 0        clic en el primero
  //   t = 0,2·P    clic en el segundo; la carga del primero queda descartada
  //   t = 0,5·P    llega la respuesta del primero, y se descarta
  //   t = 1,0·P    aqui se dispararia el temporizador abandonado del primero
  //   t = 1,1·P    MUESTREO: el segundo sigue cargando y su plazo (1,2·P) no llega
  //   t = 1,2·P    se cumple el plazo del segundo: su texto lento SI aparece
  //   t = 1,7·P    llega la respuesta del segundo

  const PRIMERO = 3;
  const SEGUNDO = 8;

  const deshacerEncimadas = retrasarPorModulo({
    [PRIMERO]: Math.round(PLAZO * 0.5),
    [SEGUNDO]: Math.round(PLAZO * 1.5),
  });

  const escriturasAntesDeEncimar = dom.escrituras('#cuestionario');

  elegirEnElIndice(PRIMERO);
  await esperar(Math.round(PLAZO * 0.2));
  elegirEnElIndice(SEGUNDO);

  // Hasta el muestreo, contado desde el clic del segundo.
  await esperar(Math.round(PLAZO * 0.9));

  const enMuestreo = dom.html('#cuestionario');
  const transicionesALaVez = cuantasVeces(enMuestreo, 'id="mensaje-cuestionario"');

  if (!enMuestreo.includes(`Cargando el Módulo ${SEGUNDO}…`)) {
    problemas.push(
      `con la respuesta del modulo ${PRIMERO} ya descartada, la zona de preguntas dejo de ` +
        `mostrar la transicion del modulo ${SEGUNDO}: una respuesta vieja apago la vigente`
    );
  }
  if (transicionesALaVez !== 1) {
    problemas.push(
      `hay ${transicionesALaVez} transiciones a la vez en la zona de preguntas: quedo duplicada`
    );
  }
  if (dom.nodo('#reiniciar').disabled !== true || dom.nodo('#repaso').disabled !== true) {
    problemas.push(
      `la respuesta descartada del modulo ${PRIMERO} reactivo los controles del panel mientras ` +
        `el modulo ${SEGUNDO} seguia cargando`
    );
  }
  if (dom.html('#carga-lenta') !== '') {
    problemas.push(
      'el texto de «esta tardando» aparecio antes de cumplirse el plazo contado desde el clic ' +
        `del modulo vigente (${SEGUNDO}): lo escribio un temporizador abandonado`
    );
  }
  if (dom.enfocado() !== '#mensaje-cuestionario') {
    problemas.push(`con una respuesta vieja descartada el foco se fue a «${dom.enfocado()}»`);
  }

  // Ahora si se cumple el plazo del segundo. El texto lento tiene que aparecer SIN
  // mover el foco y SIN reescribir la zona de preguntas: si entrara reescribiendo
  // el contenedor destruiria el nodo que tiene el foco y el lector de pantalla
  // volveria a anunciar la carga entera.
  const escriturasAntesDelLento = dom.escrituras('#cuestionario');
  await esperar(Math.round(PLAZO * 0.3));

  if (!dom.html('#carga-lenta').includes('tardando más de lo normal')) {
    problemas.push(
      `pasado el plazo de ${PLAZO} ms la pagina no dijo que la carga estaba tardando (decision 7)`
    );
  }
  if (dom.escrituras('#cuestionario') !== escriturasAntesDelLento) {
    problemas.push(
      'el texto de «esta tardando» reescribio la zona de preguntas: eso destruye el nodo con ' +
        'el foco y hace que la carga se anuncie una segunda vez'
    );
  }
  if (dom.enfocado() !== '#mensaje-cuestionario') {
    problemas.push(`el texto de «esta tardando» movio el foco a «${dom.enfocado()}»`);
  }
  if (dom.html('#carga-lenta').includes('%')) {
    problemas.push('el texto de «esta tardando» trae un numero: la decision 7 no lo permite');
  }

  // Y el final: manda el ultimo elegido.
  await esperar(Math.round(PLAZO * 0.6) + PISO + 900);
  deshacerEncimadas();

  const trasEncimarlas = idsDibujados(dom.html('#cuestionario'));
  const escriturasEncimadas = dom.escrituras('#cuestionario') - escriturasAntesDeEncimar;

  if (trasEncimarlas.length !== cuantasTiene(SEGUNDO)) {
    problemas.push(
      `con dos cargas encimadas quedaron ${trasEncimarlas.length} preguntas dibujadas, y el ` +
        `ultimo elegido, el modulo ${SEGUNDO}, tiene ${cuantasTiene(SEGUNDO)}`
    );
  }
  if (marcadoEnElIndice() !== SEGUNDO) {
    problemas.push(
      `con dos cargas encimadas el indice quedo marcando el modulo ${marcadoEnElIndice()}, y el ` +
        `ultimo elegido fue el ${SEGUNDO}`
    );
  }
  if (dom.html('#cuestionario').includes('tardando más de lo normal')) {
    problemas.push('el texto de «esta tardando» sobrevivio al final de la carga');
  }
  if (dom.nodo('#reiniciar').disabled !== false || dom.nodo('#repaso').disabled !== false) {
    problemas.push('al terminar la carga vigente los controles del panel quedaron colgados');
  }

  notas.push(
    `Dos cargas encimadas (modulos ${PRIMERO} y ${SEGUNDO}, retrasos ` +
      `${Math.round(PLAZO * 0.5)} y ${Math.round(PLAZO * 1.5)} ms, sacados del plazo de ` +
      `${PLAZO} ms): la respuesta descartada no apago ni duplico la transicion del ` +
      `${SEGUNDO} —1 transicion a la vez, controles aun desactivados—, el texto lento aparecio ` +
      'recien a su plazo sin mover el foco ni reescribir la zona, y quedo dibujado el ' +
      `${SEGUNDO}. Reescrituras de la zona en las dos cargas: ${escriturasEncimadas}.`
  );

  // --- 8f-4 · La del primero llega DESPUES que la del segundo --------------
  //
  // El otro orden, que es el que da nombre al criterio: aqui la respuesta del
  // primero llega cuando el segundo ya esta dibujado.

  const deshacerDesorden = retrasarPorModulo({
    [PRIMERO]: Math.round(PLAZO * 1.2),
    [SEGUNDO]: Math.round(PLAZO * 0.4),
  });

  elegirEnElIndice(PRIMERO);
  await esperar(Math.round(PLAZO * 0.2));
  elegirEnElIndice(SEGUNDO);

  // Hasta despues de que llegue la del primero, que es la que no puede mandar.
  await esperar(Math.round(PLAZO * 1.2) + PISO + 900);
  deshacerDesorden();

  const trasLaTardia = idsDibujados(dom.html('#cuestionario'));

  if (trasLaTardia.length !== cuantasTiene(SEGUNDO)) {
    problemas.push(
      `con la respuesta del modulo ${PRIMERO} llegando despues que la del ${SEGUNDO}, quedaron ` +
        `${trasLaTardia.length} preguntas dibujadas y el dibujado tenia que ser el ${SEGUNDO}`
    );
  }
  if (marcadoEnElIndice() !== SEGUNDO) {
    problemas.push(
      `con la respuesta tardia del modulo ${PRIMERO} el indice quedo marcando ` +
        `${marcadoEnElIndice()}`
    );
  }
  if (dom.nodo('#reiniciar').disabled !== false || dom.nodo('#repaso').disabled !== false) {
    problemas.push(
      `la respuesta tardia del modulo ${PRIMERO} dejo los controles del panel desactivados`
    );
  }

  notas.push(
    `Desorden: la respuesta del modulo ${PRIMERO} llego despues que la del ${SEGUNDO} y no ` +
      `mando. Quedo dibujado el ${SEGUNDO}, el indice lo marca, y los controles volvieron a ` +
      'estar disponibles.'
  );

  globalThis.fetch = fetchLimpio;

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

  // --- 9b · y el aviso al ABRIR la pagina, no al elegir --------------------
  //
  // Es la consecuencia que ADR-033 declara: como los siete conteos tambien caen a
  // la instantanea, el estudiante se entera de que esta viendo una copia antes de
  // ponerse a estudiar, y no un paso mas tarde. Se provoca abriendo la pagina
  // entera con el fetch ya caido.

  await renderCuestionario();

  const alAbrir = dom.html('#cuestionario');

  if (dom.oculto('#aviso-respaldo')) {
    problemas.push(
      'con la capa de datos caida, abrir la pagina no avisa de que los conteos salen de ' +
        'la copia: el aviso llegaria recien al elegir un modulo'
    );
  }
  if (idsDibujados(alAbrir).length !== 0) {
    problemas.push('al abrir la pagina con la capa caida se dibujaron preguntas sin elegir nada');
  }
  if (!alAbrir.includes('Elige un módulo para empezar')) {
    problemas.push('con la capa caida, el estado vacio dejo de explicarse');
  }

  // Y los siete conteos del indice, ahora contados sobre la instantanea.
  const indiceCaido = dom.html('#indice-modulos');
  const enLaCopia = new Map();
  for (const pregunta of instantanea.PREGUNTAS) {
    enLaCopia.set(pregunta.modulo, (enLaCopia.get(pregunta.modulo) ?? 0) + 1);
  }

  // La cifra esperada NO es «0» desde la iteracion 34: la memoria de la visita
  // conserva lo que este guion fue respondiendo, y sigue viva aunque `renderCuestionario()`
  // se vuelva a llamar —eso simula abrir la pagina, no recargarla, y una visita solo
  // termina al recargar—. Que el avance sobreviva a una recarga de verdad se prueba
  // en scripts/probar-memoria.mjs, que abre un proceso nuevo por visita.
  for (const [numero, cuantas] of enLaCopia) {
    const respondidas = respondidasPorModulo.get(numero) ?? 0;
    const enElIndice = new RegExp(
      `data-modulo="${numero}"[\\s\\S]*?>\\s*${respondidas}/${cuantas}\\s*<`
    );
    if (!enElIndice.test(indiceCaido)) {
      problemas.push(
        `con la capa caida, el indice no muestra «${respondidas}/${cuantas}» en el modulo ${numero}`
      );
    }
  }

  notas.push(
    `Modo degradado al ABRIR: el aviso de ADR-008 se ve antes de elegir nada, con el ` +
      `estado vacio debajo y los ${enLaCopia.size} conteos del indice contados sobre la copia.`
  );

  // --- 9c · Movimiento reducido simulado (decision 8) ---------------------
  //
  // Va al final porque prepara un DOM falso NUEVO, y a partir de aqui el anterior
  // queda obsoleto. El fetch sigue caido, asi que la carga sale de la instantanea,
  // que ya esta importada: termina enseguida y hay que mirar durante el piso.
  //
  // LO QUE PRUEBA: que el componente **no declare** movimiento cuando el sistema
  // pide menos. Lo que no se ve moverse es cosa del navegador y de la regla de
  // src/input.css, que es la otra mitad del trato y la que de verdad apaga.
  //
  // Y ES FALSABLE PORQUE HAY CONTROL POSITIVO: 8f-1 ya exigio que con el DOM
  // normal la transicion SI traiga `animate-latido`. Sin esa mitad, esta pasaria
  // en verde tambien el dia que la clase desapareciera para todos.

  const domSinMovimiento = prepararDomFalso({ movimientoReducido: true });

  const cargaSinMovimiento = mostrarModulo(MODULO_DEGRADADO);
  await esperar(150);

  const htmlSinMovimiento = domSinMovimiento.html('#cuestionario');

  if (htmlSinMovimiento.includes('animate-latido')) {
    problemas.push(
      'con `prefers-reduced-motion` simulado la transicion sigue declarando la animacion ' +
        'del indicador (decision 8)'
    );
  }
  if (!htmlSinMovimiento.includes(`Cargando el Módulo ${MODULO_DEGRADADO}…`)) {
    problemas.push(
      'con el movimiento reducido la pagina dejo de decir que esta cargando: quitar el ' +
        'movimiento no puede quitar la informacion'
    );
  }
  if (!htmlSinMovimiento.includes('js-logo.svg')) {
    problemas.push('con el movimiento reducido la transicion perdio el logotipo');
  }

  await cargaSinMovimiento;

  if (idsDibujados(domSinMovimiento.html('#cuestionario')).length === 0) {
    problemas.push(
      `con el movimiento reducido el modulo ${MODULO_DEGRADADO} no llego a dibujarse`
    );
  }

  notas.push(
    'Movimiento reducido simulado: la transicion no declara `animate-latido`, conserva el ' +
      'logotipo y sigue diciendo que esta cargando. Con el DOM normal (8f-1) si lo declara, ' +
      'asi que la comprobacion puede fallar.'
  );

  // ------------------------------------------------------------------------
  // 10 · El simulacro elige y trae (iteracion 41, etapa B)
  //
  // Va al final y con su propio DOM falso, porque a partir de aqui lo que se
  // prueba es otra pagina. El fetch se devuelve al servidor local: la seccion 9
  // lo dejo caido a proposito y aqui hace falta vivo.
  //
  // QUE SE PRUEBA AQUI Y QUE NO
  //
  // Desde la iteracion 43 el simulacro dibuja UNA pregunta al terminar la carga, pero
  // lo que este bloque prueba sigue siendo la maquina de elegir: si reparte bien, si
  // excluye lo que dice excluir y si se niega a empezar cuando no puede cumplir lo que
  // promete. El recorrido se prueba en `probar-cronometros.mjs`.
  // ------------------------------------------------------------------------

  globalThis.fetch = fetchLimpio;

  // UN RELOJ QUIETO PARA TODOS LOS INTENTOS DE ESTE BLOQUE (iteracion 43). Cada
  // intento que se arma aqui arranca sus cronometros, y desde la 43 un plazo vencido
  // REESCRIBE la zona de la pregunta —la del DOM que este activo en ese momento, que
  // puede ser el de otro bloque—. Con el reloj real, un intento de 10d podria pintar
  // su pregunta sobre lo que 10k esta mirando si entre los dos pasan 30 s. Todas las
  // instancias de `simulacro.js` de este guion comparten `servicios/reloj.js` (es la
  // trampa que encontro la 42), asi que un solo reloj de mentira que nunca avanza
  // basta para que ninguno venza. La transicion de carga NO usa este reloj, a
  // proposito, asi que la medicion de 10f sigue siendo de pared.
  const { usarReloj } = await import(pathToFileURL(join(SITIO, 'servicios', 'reloj.js')).href);
  usarReloj(relojDeMentira());

  const {
    MODULOS_DEL_EXAMEN,
    PREGUNTAS_DEL_INTENTO,
    PREGUNTAS_POR_MODULO,
    elegirIntento,
  } = await import(pathToFileURL(join(SITIO, 'servicios', 'eleccion-del-intento.js')).href);

  const { GRUPOS_DE_HERMANAS } = await import(
    pathToFileURL(join(SITIO, 'data', 'hermanas.js')).href
  );

  /**
   * Una fuente de azar con semilla, para que la muestra sea repetible.
   *
   * Es `mulberry32`, treinta y dos bits, escrito aqui y no en el sitio: el sitio no
   * necesita un azar repetible, esta prueba si. Si el algoritmo llamara a
   * `Math.random` por dentro —como llamaba `shuffle()` antes de la iteracion 41—,
   * una muestra que diera rojo no se podria volver a correr igual, y un rojo
   * irrepetible no se arregla: se discute.
   */
  const azarConSemilla = (semilla) => {
    let estado = semilla >>> 0;
    return () => {
      estado = (estado + 0x6d2b79f5) >>> 0;
      let t = estado;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /** Cuantos intentos trae la muestra. Lo fija el criterio de la iteracion 41. */
  const INTENTOS_DE_LA_MUESTRA = 200;

  /** La semilla. Cualquiera sirve; lo que importa es que sea SIEMPRE la misma. */
  const SEMILLA = 20260916;

  /** El solapamiento promedio que el criterio deja pasar. Mas es rojo. */
  const SOLAPAMIENTO_MAXIMO = 42;

  // --- 10a · El extremo por ids ------------------------------------------
  //
  // Se le habla directo, sin pasar por el navegador: lo que se prueba es el
  // contrato del extremo, y meterlo detras del componente solo escondería cual de
  // los dos fallo.

  const pedirCrudo = async (ruta, opciones) => {
    const respuesta = await fetchReal(`${DIRECCION}${ruta}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(ESPERA_SONDEO),
      ...opciones,
    });
    return { estado: respuesta.status, cuerpo: await respuesta.json() };
  };

  const resumenParaIds = await pedirCrudo('/api/preguntas?resumen=1');

  if (!resumenParaIds.cuerpo?.ok) {
    noSePudo(
      'El resumen no contesto, asi que no hay ids con los que armar un intento.',
      JSON.stringify(resumenParaIds.cuerpo, null, 2)
    );
  }

  const idsPorModulo = Object.fromEntries(
    resumenParaIds.cuerpo.datos.map((fila) => [fila.modulo, fila.preguntas_ids])
  );

  const filasDelResumen = resumenParaIds.cuerpo.meta?.filas_leidas ?? 0;

  // El intento de muestra con el que se interroga al extremo. Se elige con la misma
  // funcion del sitio, no con una lista escrita a mano: pedir 120 ids inventados
  // probaria el extremo contra algo que el simulacro nunca le va a pedir.
  const intentoDeMuestra = elegirIntento({
    idsPorModulo,
    azar: azarConSemilla(SEMILLA),
  });

  if (!intentoDeMuestra.ok) {
    noSePudo(
      'Con la base local no se pudo elegir ni un intento, asi que no hay nada que pedirle al extremo.',
      JSON.stringify(intentoDeMuestra)
    );
  }

  const porIds = await pedirCrudo(
    `/api/preguntas?ids=${intentoDeMuestra.ids.join(',')}`
  );

  if (!porIds.cuerpo?.ok) {
    problemas.push(
      `el extremo rechazo una lista de ${intentoDeMuestra.ids.length} ids validos: ` +
        `${porIds.cuerpo?.error?.codigo ?? '(sin codigo)'}`
    );
  } else {
    const devueltos = porIds.cuerpo.datos.map((p) => p.id).sort((a, b) => a - b);
    const pedidos = [...intentoDeMuestra.ids].sort((a, b) => a - b);

    if (JSON.stringify(devueltos) !== JSON.stringify(pedidos)) {
      problemas.push(
        `el extremo no devolvio exactamente las ${pedidos.length} preguntas pedidas: ` +
          `volvieron ${devueltos.length}`
      );
    }

    const conJustificacion = porIds.cuerpo.datos.filter((p) => 'justificacion' in p);
    if (conJustificacion.length > 0) {
      problemas.push(
        `el extremo por ids devolvio ${conJustificacion.length} justificacion(es), y el ` +
          'intento no las lleva (decision 1)'
      );
    }

    const malArmadas = porIds.cuerpo.datos.filter(
      (p) =>
        p.alternativas?.length !== 4 ||
        p.alternativas.filter((a) => a.es_correcta === 1).length !== 1
    );
    if (malArmadas.length > 0) {
      problemas.push(
        `${malArmadas.length} pregunta(s) del extremo por ids no traen 4 alternativas con 1 correcta`
      );
    }

    if (porIds.cuerpo.meta?.origen !== 'd1') {
      problemas.push('el extremo por ids no viene con el contrato de _comun.js');
    }
  }

  const filasDelExtremo = porIds.cuerpo?.meta?.filas_leidas ?? 0;
  const consultasDelExtremo = porIds.cuerpo?.meta?.consultas ?? 0;

  // Las filas leidas se COMPRUEBAN, no solo se imprimen.
  //
  // El numero se informa para la epica 50, y un numero que solo se imprime es un
  // numero que nadie mira. El piso sale de lo que la respuesta ya trae en la mano:
  // 120 preguntas mas sus 480 alternativas son 600 filas que hubo que leer si o si,
  // asi que cualquier cifra por debajo esta contando de menos.
  //
  // Se descubrio provocandolo: sumando el `rows_read` de UN trozo en vez de los
  // cuatro, el extremo informaba 468 y lo demas seguia en verde. Una medicion que se
  // equivoca a la baja es peor que no medir, porque la epica 50 decidiria sobre ella.
  const filasQueHuboQueLeer =
    (porIds.cuerpo?.datos?.length ?? 0) +
    (porIds.cuerpo?.datos ?? []).reduce((suma, p) => suma + (p.alternativas?.length ?? 0), 0);

  if (filasDelExtremo < filasQueHuboQueLeer) {
    problemas.push(
      `el extremo por ids informa ${filasDelExtremo} filas leidas y devolvio ` +
        `${filasQueHuboQueLeer} filas: esta contando de menos (¿un solo trozo?)`
    );
  }

  // Un id que no existe no vuelve, y no rompe la peticion.
  const conFantasma = await pedirCrudo(
    `/api/preguntas?ids=${intentoDeMuestra.ids[0]},999999,${intentoDeMuestra.ids[1]}`
  );

  if (!conFantasma.cuerpo?.ok || conFantasma.cuerpo.datos.length !== 2) {
    problemas.push(
      'un id inexistente no se ignoro: se pidieron 3 ids, uno inventado, y no volvieron 2 preguntas'
    );
  }

  // `&con=justificacion`: las MISMAS preguntas que `?ids=`, mas su justificacion
  // (iteracion 44, decision 8). Se compara contra la respuesta sin `con` que ya se
  // tiene en la mano: si lo unico distinto no es la justificacion, el parametro
  // cambio algo mas que lo que promete.
  const conJustificacion = await pedirCrudo(
      `/api/preguntas?ids=${intentoDeMuestra.ids.join(',')}&con=justificacion`
  );

  if (!conJustificacion.cuerpo?.ok) {
    problemas.push(
        `?ids=…&con=justificacion fue rechazado: ` +
        `${conJustificacion.cuerpo?.error?.codigo ?? '(sin codigo)'}`
    );
  } else {
    const datosCon = conJustificacion.cuerpo.datos;
    const sinSuJustificacion = datosCon.filter(
        (p) => typeof p.justificacion !== 'string' || p.justificacion.trim() === ''
    );

    if (sinSuJustificacion.length > 0) {
      problemas.push(
          `?ids=…&con=justificacion devolvio ${sinSuJustificacion.length} de ${datosCon.length} ` +
          'pregunta(s) sin su justificacion'
      );
    }

    const loDemas = JSON.stringify(datosCon.map(({ justificacion, ...resto }) => resto));
    if (loDemas !== JSON.stringify(porIds.cuerpo?.datos ?? [])) {
      problemas.push(
          '?ids=…&con=justificacion cambio algo mas que la justificacion respecto de ?ids=…'
      );
    }

    if (conJustificacion.cuerpo.meta?.consultas !== consultasDelExtremo) {
      problemas.push(
          `?ids=…&con=justificacion uso ${conJustificacion.cuerpo.meta?.consultas} consultas ` +
          `y ?ids=… ${consultasDelExtremo}: pedir la justificacion no deberia cambiar el troceo`
      );
    }
  }

  // Los rechazos. Cada uno es una forma distinta de escribir mal la lista, y las
  // seis tienen que doler igual: `PETICION_INVALIDA`, no una respuesta a medias.
  const rechazosEsperados = [
    ['?ids=', 'lista vacia'],
    ['?ids=25,abc', 'un id que no es numero'],
    ['?ids=25,,26', 'una coma de mas'],
    ['?ids=2.5', 'un id con decimales'],
    ['?ids=-3', 'un id negativo'],
    ['?ids=0', 'el id cero'],
    ['?ids=25,107,25', 'un id repetido'],
    [`?ids=${Array.from({ length: 121 }, (_, i) => i + 1).join(',')}`, '121 ids'],
    ['?ids=25&modulo=2', 'ids junto a modulo'],
    ['?ids=25&resumen=1', 'ids junto a resumen'],
    // `con` (iteracion 44, decision 8; actualizacion de ADR-035 del 2026-09-21): un
    // solo valor, y solo junto a `ids`. Todo lo demas duele igual que un id mal escrito.
    ['?ids=25&con=otra', 'con con un valor que no es justificacion'],
    ['?ids=25&con=', 'con vacio'],
    ['?con=justificacion', 'con sin ids'],
    ['?modulo=2&con=justificacion', 'con junto a modulo, sin ids'],
    ['?resumen=1&con=justificacion', 'con junto a resumen, sin ids'],
  ];

  for (const [consulta, queEs] of rechazosEsperados) {
    const { cuerpo } = await pedirCrudo(`/api/preguntas${consulta}`);
    if (cuerpo?.error?.codigo !== 'PETICION_INVALIDA') {
      problemas.push(
        `el extremo acepto ${queEs} en vez de rechazarlo con PETICION_INVALIDA ` +
          `(dijo ${cuerpo?.error?.codigo ?? 'que si'})`
      );
    }
  }

  // Y lo que no es lectura lo para `soloLectura()`, antes de mirar el parametro.
  const noEsLectura = await pedirCrudo('/api/preguntas?ids=25', { method: 'POST' });
  if (noEsLectura.cuerpo?.error?.codigo !== 'METODO_NO_PERMITIDO') {
    problemas.push('un POST al extremo por ids no lo paro soloLectura() (ADR-009)');
  }

  notas.push(
    `Extremo por ids: ${intentoDeMuestra.ids.length} ids en UNA peticion, resueltos en ` +
      `${consultasDelExtremo} consultas de un solo batch —D1 admite 100 parametros ligados y ` +
      `120 no cabe—, devolviendo exactamente las pedidas, sin justificaciones; y con ` +
      '`&con=justificacion`, las mismas preguntas mas su justificacion. ' +
      `${rechazosEsperados.length} formas de pedir mal rechazadas con PETICION_INVALIDA y el ` +
      'POST parado por soloLectura().'
  );

  notas.push(
    `Filas leidas en un intento: ${filasDelResumen} el resumen + ${filasDelExtremo} el extremo ` +
      `= ${filasDelResumen + filasDelExtremo}. Medido en local, que SI las reporta. Queda para ` +
      'la epica 50: la vista entra por el indice de estado y no por la clave primaria.'
  );

  // --- 10b · La muestra de 200 intentos -----------------------------------

  const azarDeLaMuestra = azarConSemilla(SEMILLA);
  const muestra = [];

  for (let i = 0; i < INTENTOS_DE_LA_MUESTRA; i += 1) {
    muestra.push(elegirIntento({ idsPorModulo, azar: azarDeLaMuestra }));
  }

  const fallidos = muestra.filter((intento) => !intento.ok).length;
  if (fallidos > 0) {
    problemas.push(
      `${fallidos} de los ${INTENTOS_DE_LA_MUESTRA} intentos de la muestra no se pudieron elegir`
    );
  }

  const activos = new Set(Object.values(idsPorModulo).flat());
  const extraPorModulo = new Map(MODULOS_DEL_EXAMEN.map((m) => [m, 0]));
  const vecesQueSalio = new Map();
  const ordenesDistintos = new Set();
  let dosDelMismoGrupo = 0;
  let repartoMalo = 0;
  let repetidasODeBaja = 0;
  let dosAntesQueTres = 0;

  // El intento se entrega MEZCLADO (decision del autor, 2026-09-18).
  //
  // COMO SE MIDE «no agrupado», que es lo que hay que poder afirmar. Dos numeros por
  // intento, y los dos delatan el agrupamiento de inmediato:
  //
  //   cambios de modulo   cuantas veces la pregunta siguiente es de otro modulo.
  //                       Agrupado por modulo son exactamente 6, una por frontera.
  //                       Barajado, alrededor de 119 x 6/7 = 102.
  //   racha mas larga     cuantas seguidas del mismo modulo. Agrupado son 17 o 18.
  //
  // Se vigilan los dos y no uno: el primero caza el agrupamiento entero, el segundo
  // caza un agrupamiento parcial —por ejemplo, barajar dentro de cada mitad— que
  // podria dejar el primero por encima del umbral.
  const CAMBIOS_MINIMOS = 80;
  const RACHA_MAXIMA = 8;

  let sinMezclar = 0;
  let conRacha = 0;
  let sumaDeCambios = 0;
  let laRachaMasLarga = 0;
  const moduloDeId = new Map();
  for (const [modulo, ids] of Object.entries(idsPorModulo)) {
    for (const id of ids) moduloDeId.set(id, Number(modulo));
  }

  for (const intento of muestra) {
    if (!intento.ok) continue;

    // 120 preguntas distintas y todas activas.
    if (
      intento.ids.length !== PREGUNTAS_DEL_INTENTO ||
      new Set(intento.ids).size !== PREGUNTAS_DEL_INTENTO ||
      intento.ids.some((id) => !activos.has(id))
    ) {
      repetidasODeBaja += 1;
    }

    // 17 en seis modulos y 18 en uno.
    const cuotas = MODULOS_DEL_EXAMEN.map((m) => intento.porModulo[m].length);
    const conDieciocho = cuotas.filter((c) => c === PREGUNTAS_POR_MODULO + 1);
    const conDiecisiete = cuotas.filter((c) => c === PREGUNTAS_POR_MODULO);

    if (conDieciocho.length !== 1 || conDiecisiete.length !== 6) {
      repartoMalo += 1;
    }

    extraPorModulo.set(intento.moduloDelExtra, extraPorModulo.get(intento.moduloDelExtra) + 1);

    // Ni dos de un mismo grupo, en todo el intento.
    const elegidos = new Set(intento.ids);
    for (const grupo of GRUPOS_DE_HERMANAS) {
      if (grupo.filter((id) => elegidos.has(id)).length > 1) dosDelMismoGrupo += 1;
    }

    for (const id of intento.ids) {
      vecesQueSalio.set(id, (vecesQueSalio.get(id) ?? 0) + 1);
    }

    ordenesDistintos.add(intento.orden.join(','));
    if (intento.orden.indexOf(2) < intento.orden.indexOf(3)) dosAntesQueTres += 1;

    // Los modulos en el orden en que el estudiante los va a ver.
    const modulos = intento.ids.map((id) => moduloDeId.get(id));

    let cambios = 0;
    let racha = 1;
    let maxRacha = 1;

    for (let i = 1; i < modulos.length; i += 1) {
      if (modulos[i] !== modulos[i - 1]) {
        cambios += 1;
        racha = 1;
      } else {
        racha += 1;
        if (racha > maxRacha) maxRacha = racha;
      }
    }

    sumaDeCambios += cambios;
    if (maxRacha > laRachaMasLarga) laRachaMasLarga = maxRacha;
    if (cambios < CAMBIOS_MINIMOS) sinMezclar += 1;
    if (maxRacha > RACHA_MAXIMA) conRacha += 1;
  }

  if (sinMezclar > 0) {
    problemas.push(
      `${sinMezclar} intento(s) de la muestra entregan las preguntas agrupadas por modulo: ` +
        `menos de ${CAMBIOS_MINIMOS} cambios de modulo en las ${PREGUNTAS_DEL_INTENTO}`
    );
  }

  if (conRacha > 0) {
    problemas.push(
      `${conRacha} intento(s) de la muestra traen mas de ${RACHA_MAXIMA} preguntas seguidas del ` +
        `mismo modulo (la racha mas larga fue de ${laRachaMasLarga})`
    );
  }

  if (repetidasODeBaja > 0) {
    problemas.push(
      `${repetidasODeBaja} intento(s) de la muestra no traen ${PREGUNTAS_DEL_INTENTO} preguntas ` +
        'distintas y activas'
    );
  }

  if (repartoMalo > 0) {
    problemas.push(
      `${repartoMalo} intento(s) de la muestra no reparten ${PREGUNTAS_POR_MODULO} por modulo ` +
        'con uno en 18'
    );
  }

  if (dosDelMismoGrupo > 0) {
    problemas.push(
      `${dosDelMismoGrupo} vez(ces) un intento trajo dos preguntas del mismo grupo de hermanas`
    );
  }

  // Los dos grupos que el criterio nombra, anclados aqui.
  //
  // SIN ESTO LA COMPROBACION DE ARRIBA SE ENGANA SOLA, y se descubrio provocandolo:
  // el bucle recorre `GRUPOS_DE_HERMANAS`, o sea el MISMO archivo que se quiere
  // vigilar. Escrito el trio {205, 210, 222} como el par {205, 210}, un intento con
  // la 210 y la 222 juntas pasa en verde, porque para el archivo roto no son
  // hermanas. Una prueba que saca su verdad del archivo que prueba no prueba nada:
  // es H-023 otra vez.
  //
  // La verdad de estos dos grupos vive en la tabla de la iteracion 41 y se copia
  // aqui a mano, a proposito. El resto de la lista puede crecer —el informe compara
  // redaccion y no significado, asi que va a crecer— y por eso no se ancla entera:
  // lo que se ancla es lo que el criterio nombra con nombre y apellido.
  const GRUPOS_QUE_EL_CRITERIO_NOMBRA = [
    [25, 107], // el unico que cruza modulos: por el la exclusion es global
    [205, 210, 222], // el unico trio: por el la lista son grupos y no pares
  ];

  for (const esperado of GRUPOS_QUE_EL_CRITERIO_NOMBRA) {
    const estaEntero = GRUPOS_DE_HERMANAS.some(
      (grupo) =>
        grupo.length === esperado.length && esperado.every((id) => grupo.includes(id))
    );

    if (!estaEntero) {
      problemas.push(
        `el grupo de hermanas {${esperado.join(', ')}} no esta entero en data/hermanas.js`
      );
    }
  }

  const sinExtraNunca = [...extraPorModulo].filter(([, veces]) => veces === 0);
  if (sinExtraNunca.length > 0) {
    problemas.push(
      `a ${sinExtraNunca.length} modulo(s) no les toco nunca la pregunta 120 en ` +
        `${INTENTOS_DE_LA_MUESTRA} intentos: el sorteo del extra no esta repartiendo`
    );
  }

  // El solapamiento promedio entre pares de intentos.
  //
  // Se comparan TODOS los pares y no una muestra de pares: son 19 900 comparaciones
  // de conjuntos de 120, que es trabajo de milisegundos, y un promedio sobre un
  // subconjunto elegido al azar seria un numero mas dificil de defender que de
  // calcular.
  const conjuntos = muestra.filter((i) => i.ok).map((i) => new Set(i.ids));
  let sumaDeSolapamientos = 0;
  let pares = 0;

  for (let i = 0; i < conjuntos.length; i += 1) {
    for (let j = i + 1; j < conjuntos.length; j += 1) {
      let comunes = 0;
      for (const id of conjuntos[i]) if (conjuntos[j].has(id)) comunes += 1;
      sumaDeSolapamientos += comunes;
      pares += 1;
    }
  }

  const solapamientoPromedio = pares > 0 ? sumaDeSolapamientos / pares : 0;

  if (solapamientoPromedio > SOLAPAMIENTO_MAXIMO) {
    problemas.push(
      `el solapamiento promedio entre intentos es ${solapamientoPromedio.toFixed(1)} preguntas, ` +
        `por encima del maximo de ${SOLAPAMIENTO_MAXIMO}`
    );
  }

  // El orden de los modulos se sortea (decision 3).
  //
  // ESTA ES LA COMPROBACION CRUDA DEL SESGO, y es la que un orden fijo rompe de
  // inmediato: con el recorrido del 2 al 8, el modulo 2 va antes que el 3 en el
  // 100 % de los intentos y aqui tiene que ir en la mitad. La frecuencia con que
  // salen la 25 y la 107 —las dos caras del unico grupo que cruza modulos— se
  // informa al lado, porque es la consecuencia que el sorteo existe para evitar.
  const mitad = INTENTOS_DE_LA_MUESTRA / 2;
  const desvio = Math.abs(dosAntesQueTres - mitad) / mitad;

  if (desvio > 0.3) {
    problemas.push(
      `el modulo 2 se recorrio antes que el 3 en ${dosAntesQueTres} de ${INTENTOS_DE_LA_MUESTRA} ` +
        'intentos: el orden de los modulos no se esta sorteando'
    );
  }

  if (ordenesDistintos.size < 20) {
    problemas.push(
      `la muestra solo produjo ${ordenesDistintos.size} orden(es) distinto(s) de modulos`
    );
  }

  const veces25 = vecesQueSalio.get(25) ?? 0;
  const veces107 = vecesQueSalio.get(107) ?? 0;

  notas.push(
    `Muestra de ${INTENTOS_DE_LA_MUESTRA} intentos con semilla ${SEMILLA}: todos con ` +
      `${PREGUNTAS_DEL_INTENTO} preguntas distintas y activas, ${PREGUNTAS_POR_MODULO} por modulo ` +
      'y uno en 18. Extra por modulo: ' +
      [...extraPorModulo].map(([m, v]) => `${m}:${v}`).join(' · ') +
      '.'
  );

  notas.push(
    `Intento mezclado: los ${INTENTOS_DE_LA_MUESTRA} entregan las 120 barajadas entre modulos, con ` +
      `${(sumaDeCambios / INTENTOS_DE_LA_MUESTRA).toFixed(1)} cambios de modulo de media —agrupado ` +
      `por modulo serian 6, el minimo exigido es ${CAMBIOS_MINIMOS}— y una racha maxima de ` +
      `${laRachaMasLarga} seguidas del mismo modulo (tope ${RACHA_MAXIMA}).`
  );

  notas.push(
    `Hermanas: ninguna pareja de los ${GRUPOS_DE_HERMANAS.length} grupos aparecio junta en ` +
      `ninguno de los ${INTENTOS_DE_LA_MUESTRA} intentos, el trio {205, 210, 222} y el par ` +
      '{25, 107} incluidos.'
  );

  notas.push(
    `Solapamiento promedio entre los ${pares} pares de intentos: ` +
      `${solapamientoPromedio.toFixed(1)} preguntas (esperado 38,9; maximo ${SOLAPAMIENTO_MAXIMO}).`
  );

  notas.push(
    `Orden de modulos sorteado: ${ordenesDistintos.size} ordenes distintos, y el modulo 2 fue ` +
      `antes que el 3 en ${dosAntesQueTres} de ${INTENTOS_DE_LA_MUESTRA}. La 25 salio ` +
      `${veces25} veces y la 107, ${veces107}.`
  );

  // --- 10c · Con una hermana retirada del resumen -------------------------
  //
  // Un id retirado deja de aparecer en `preguntas_ids` y su grupo tendria que
  // volverse inerte solo, sin codigo que lo contemple. Se provoca quitando la 107
  // de la lista que se le pasa al algoritmo, que es exactamente lo que veria el
  // navegador el dia que esa pregunta se retire.

  const sinLa107 = {
    ...idsPorModulo,
    3: idsPorModulo[3].filter((id) => id !== 107),
  };

  const azarSinHermana = azarConSemilla(SEMILLA);
  let intentosSinLa107 = 0;
  let conLa25 = 0;

  for (let i = 0; i < 50; i += 1) {
    const intento = elegirIntento({ idsPorModulo: sinLa107, azar: azarSinHermana });
    if (!intento.ok) continue;

    intentosSinLa107 += 1;
    if (intento.ids.includes(107)) {
      problemas.push('con la 107 retirada del resumen, el algoritmo la eligio igual');
    }
    if (intento.ids.includes(25)) conLa25 += 1;
  }

  if (intentosSinLa107 !== 50) {
    problemas.push(
      `con la 107 retirada, solo ${intentosSinLa107} de 50 intentos se pudieron elegir`
    );
  }

  notas.push(
    `Hermana retirada: con la 107 fuera del resumen, los 50 intentos se eligieron igual y la 25 ` +
      `salio en ${conLa25} de ellos, ya sin nadie que la prohiba.`
  );

  // --- 10d · Reservas: preguntas que no vuelven ---------------------------
  //
  // Se interceptan las respuestas del extremo y se les quitan preguntas, que es lo
  // que pasa de verdad cuando una se retira entre el resumen y la peticion o la
  // validacion la descarta. El sitio tiene que reponer del MISMO modulo hasta 120.

  const domSimulacro = prepararDomFalso();

  const { conectarComienzo, comenzarElIntento, preguntasDelIntento } = await import(
    pathToFileURL(join(SITIO, 'components', 'simulacro.js')).href
  );

  conectarComienzo();

  /**
   * Deja pasar las peticiones al servidor, quitandole preguntas a la respuesta.
   *
   * `cuantasQuitar` se descuenta: solo la PRIMERA tanda pierde preguntas, para que
   * la reposicion tenga de donde sacarlas. Un recorte que se repitiera en cada
   * ronda seria el caso 10e, que es otro.
   */
  const interceptarQuitando = (cuantasQuitar) => {
    let porQuitar = cuantasQuitar;

    return async (ruta, opciones) => {
      const respuesta = await fetchLimpio(ruta, opciones);
      if (!ruta.includes('ids=') || porQuitar === 0) return respuesta;

      const cuerpo = await respuesta.json();
      const quitadas = Math.min(porQuitar, cuerpo.datos.length);
      porQuitar -= quitadas;
      cuerpo.datos = cuerpo.datos.slice(quitadas);

      return new Response(JSON.stringify(cuerpo), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };
  };

  const PREGUNTAS_QUE_NO_VUELVEN = 9;

  globalThis.fetch = interceptarQuitando(PREGUNTAS_QUE_NO_VUELVEN);
  await comenzarElIntento();

  const conReservas = domSimulacro.html('#zona-del-intento');

  if (!empezoElRecorrido(conReservas)) {
    problemas.push(
      `con ${PREGUNTAS_QUE_NO_VUELVEN} preguntas que no vuelven, el intento no se completo con reservas`
    );
  }

  const cuentasConReservas = cuentasDelIntento(preguntasDelIntento());

  if (cuentasConReservas.length !== MODULOS_DEL_EXAMEN.length) {
    problemas.push('el intento armado no trae preguntas de los siete modulos');
  } else if (cuentasConReservas.reduce((a, b) => a + b, 0) !== PREGUNTAS_DEL_INTENTO) {
    problemas.push(
      `tras reponer, el intento quedo con ${cuentasConReservas.reduce((a, b) => a + b, 0)} ` +
        `preguntas y no con ${PREGUNTAS_DEL_INTENTO}`
    );
  } else if (cuentasConReservas.filter((c) => c === PREGUNTAS_POR_MODULO + 1).length !== 1) {
    problemas.push('tras reponer, el reparto por modulo dejo de ser 17 con uno en 18');
  }

  notas.push(
    `Reservas: con ${PREGUNTAS_QUE_NO_VUELVEN} preguntas descartadas por intercepcion, el intento ` +
      `se completo igual hasta ${PREGUNTAS_DEL_INTENTO}, reponiendo del mismo modulo y ` +
      'conservando el reparto.'
  );

  // --- 10e · Cuando no se pueden reunir 120 -------------------------------
  //
  // Ahora el recorte NO se agota: cada tanda pierde preguntas, asi que las reservas
  // no alcanzan. El intento no puede empezar, y la pantalla tiene que decirlo. Un
  // intento de 113 preguntas seria peor que ninguno.

  globalThis.fetch = async (ruta, opciones) => {
    const respuesta = await fetchLimpio(ruta, opciones);
    if (!ruta.includes('ids=')) return respuesta;

    const cuerpo = await respuesta.json();
    cuerpo.datos = cuerpo.datos.slice(30);

    return new Response(JSON.stringify(cuerpo), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  await comenzarElIntento();

  const noSePudoHtml = domSimulacro.html('#zona-del-intento');

  if (empezoElRecorrido(noSePudoHtml)) {
    problemas.push('con descartes que impiden reunir 120, el recorrido empezo igual');
  }
  if (!noSePudoHtml.includes('No se pudo armar el simulacro')) {
    problemas.push('con descartes que impiden reunir 120, la pantalla no lo explico');
  }
  if (!noSePudoHtml.includes('id="comenzar-simulacro"')) {
    problemas.push('tras no poder empezar, no quedo forma de volver a intentarlo');
  }

  // Y el reintento funciona: el oyente esta sobre la zona, no sobre el boton, asi
  // que sobrevive a que la zona se reescriba. Con el fetch ya sano, esta vez sale.
  globalThis.fetch = fetchLimpio;

  const corrieron = domSimulacro.disparar('#zona-del-intento', 'click', {
    target: { closest: (s) => (s === '#comenzar-simulacro' ? {} : null) },
  });

  if (corrieron === 0) {
    problemas.push('el boton de reintentar no tiene quien lo escuche');
  }

  await esperar(PISO + 900);

  if (!empezoElRecorrido(domSimulacro.html('#zona-del-intento'))) {
    problemas.push('el reintento tras un fracaso no llego a armar el intento');
  }

  notas.push(
    'Intento imposible: con cada tanda recortada, el simulacro NO empieza, explica por que y deja ' +
      'un boton para reintentar que de verdad reintenta (el oyente vive en la zona, no en el boton).'
  );

  // --- 10f · Una sola transicion, medida desde el clic --------------------
  //
  // Antes de pulsar no sale ni una peticion: la presentacion es HTML. Al pulsar
  // salen dos —el resumen y el extremo— y las dos van debajo de la MISMA
  // transicion, asi que lo que se mide desde el clic es `max(carga, 400 ms)` una
  // vez y no dos veces 400 ms encadenados.

  const domMedido = prepararDomFalso();
  const rutasPedidas = [];

  globalThis.fetch = (ruta, opciones) => {
    rutasPedidas.push(ruta);
    return fetchLimpio(ruta, opciones);
  };

  const {
    conectarComienzo: conectarMedido,
    comenzarElIntento: comenzarMedido,
    preguntasDelIntento: preguntasMedido,
  } =
    await import(
      `${pathToFileURL(join(SITIO, 'components', 'simulacro.js')).href}?medicion=1`
    );

  conectarMedido();

  if (rutasPedidas.length !== 0) {
    problemas.push(
      `la presentacion del simulacro pidio ${rutasPedidas.length} cosa(s) antes de pulsar «Comenzar»`
    );
  }

  const desdeElClic = Date.now();
  const cargaDelIntento = comenzarMedido();

  // Durante la carga, la transicion. Es la misma del cuestionario, con sus mismas
  // tres piezas, y por eso se comprueban las tres: si alguna faltara, la
  // extraccion de la decision 9 habria dejado el simulacro con media transicion.
  await esperar(120);
  const duranteLaCarga = domMedido.html('#zona-del-intento');

  if (!duranteLaCarga.includes('Preparando tu simulacro…')) {
    problemas.push('al pulsar «Comenzar» no aparecio la transicion de carga');
  }
  if (!duranteLaCarga.includes('js-logo.svg')) {
    problemas.push('la transicion del simulacro no trae el logotipo');
  }
  if (!duranteLaCarga.includes('id="carga-lenta-simulacro"')) {
    problemas.push('la transicion del simulacro no dejo puesto el hueco del texto lento');
  }

  await cargaDelIntento;
  const duroElIntento = Date.now() - desdeElClic;

  if (rutasPedidas.length !== 2) {
    problemas.push(
      `al pulsar «Comenzar» salieron ${rutasPedidas.length} peticiones y tenian que ser 2`
    );
  }
  if (!rutasPedidas.some((r) => r.includes('resumen=1'))) {
    problemas.push('al pulsar «Comenzar» no salio la peticion del resumen');
  }
  if (!rutasPedidas.some((r) => r.includes('ids='))) {
    problemas.push('al pulsar «Comenzar» no salio la peticion del extremo por ids');
  }
  if (duroElIntento < PISO) {
    problemas.push(
      `la transicion del simulacro duro ${duroElIntento} ms desde el clic, por debajo del piso de ${PISO} ms`
    );
  }

  // Y la zona se reescribio dos veces y no tres: transicion y resultado. Una
  // tercera escritura seria una segunda transicion encadenada.
  const escriturasDeLaZona = domMedido.escrituras('#zona-del-intento');
  if (escriturasDeLaZona !== 2) {
    problemas.push(
      `la zona del intento se reescribio ${escriturasDeLaZona} veces: con una sola transicion ` +
        'tienen que ser 2 (la transicion y el resultado)'
    );
  }

  notas.push(
    `Transicion del simulacro: 0 peticiones antes del clic, ${rutasPedidas.length} despues ` +
      `(resumen + ids), bajo UNA sola transicion —${escriturasDeLaZona} escrituras de la zona— y ` +
      `${duroElIntento} ms desde el clic, con el piso en ${PISO} ms.`
  );

  // --- 10g · Lo dibujado es la primera pregunta, y solo ella ---------------
  //
  // Hasta la 43 esto era «Intento listo no dibuja texto del banco» (decision 11 de
  // la 41), y era lo que dejaba a `probar:escapado` sin nada que vigilar en esta
  // pagina. La decision 8 de la 43 lo reemplazo: al terminar la carga se dibuja la
  // primera pregunta, que ES texto del banco. Lo que se exige ahora es que sea esa y
  // solo esa: su enunciado y sus alternativas, y ninguno de los textos de las otras
  // 119. Se compara contra el texto ESCAPADO, que es como aparece en el HTML.
  // `esc` es el mismo que importa la seccion 3 (linea 529), en este mismo ambito.

  const listoHtml = domMedido.html('#zona-del-intento');
  const delIntento = preguntasMedido();
  const textosDe = (p) => [p.enunciado, ...(p.alternativas ?? []).map((a) => a.texto)];
  const suyos = delIntento[0] ? textosDe(delIntento[0]) : [];

  if (!empezoElRecorrido(listoHtml)) {
    problemas.push('la carga del simulacro no termino en la primera pregunta del intento');
  }

  // Sin intento no hay contra que comparar, y eso no puede dar verde callado (H-023).
  if (delIntento.length === 0) {
    problemas.push('no se pudo comprobar lo dibujado: el intento medido no trae preguntas');
  }

  const cuentasDelMedido = cuentasDelIntento(delIntento);
  if (cuentasDelMedido.reduce((a, b) => a + b, 0) !== PREGUNTAS_DEL_INTENTO) {
    problemas.push(
        `el intento armado trae ${cuentasDelMedido.reduce((a, b) => a + b, 0)} preguntas y no ` +
        PREGUNTAS_DEL_INTENTO
    );
  }

  const faltan = suyos.filter((texto) => !listoHtml.includes(esc(texto)));
  if (faltan.length > 0) {
    problemas.push(
        `la primera pregunta se dibujo sin ${faltan.length} de sus ${suyos.length} textos`
    );
  }

  // Los textos cortos o compartidos se descartan: «true» o «Ninguna de las anteriores»
  // pueden ser alternativas de la primera Y de otra, y no serian una fuga.
  const coladas = delIntento
      .slice(1)
      .flatMap(textosDe)
      .filter((texto) => typeof texto === 'string' && texto.length > 12 && !suyos.includes(texto))
      .filter((texto) => listoHtml.includes(esc(texto)) || listoHtml.includes(texto));

  if (coladas.length > 0) {
    problemas.push(
        `ademas de la primera pregunta se dibujaron ${coladas.length} texto(s) de otras preguntas del intento`
    );
  }

  notas.push(
      `Al terminar la carga: se dibuja la primera pregunta del intento con sus ${suyos.length} textos, ` +
      `y ninguno de los de las otras ${Math.max(delIntento.length - 1, 0)} (decision 8 de la 43, que ` +
      'reemplaza a la 11 de la 41).'
  );

  // --- 10h · Modo degradado: se elige desde la instantanea -----------------
  //
  // Se provoca la caida de verdad, como en la seccion 9: el fetch inservible. El
  // resumen y el extremo caen los dos a la copia, el algoritmo elige igual —no sabe
  // de donde vienen los ids— y el aviso de ADR-008 tiene que quedar VISIBLE. Un
  // respaldo servido en silencio es lo unico que esa ADR prohibe sin matices.

  const domDegradado = prepararDomFalso();

  const {
    conectarComienzo: conectarDegradado,
    comenzarElIntento: comenzarDegradado,
    preguntasDelIntento: preguntasDegradado,
  } =
    await import(
      `${pathToFileURL(join(SITIO, 'components', 'simulacro.js')).href}?degradado=1`
    );

  conectarDegradado();

  // Se cuenta a que se sale, no solo que caiga: con el resumen ya caido a la copia,
  // pedirle las preguntas a la capa seria gastar la espera del estudiante en un
  // servicio que acaba de no contestar, y —si contestara— seria la mezcla al reves,
  // ids elegidos sobre la copia pedidos a D1. Se descubrio que faltaba mutando el
  // sitio el 2026-09-17: quitando esa guarda, todo lo demas seguia en verde.
  const rutasDelDegradado = [];

  globalThis.fetch = (ruta) => {
    rutasDelDegradado.push(String(ruta));
    return Promise.reject(new Error('caida provocada'));
  };

  await comenzarDegradado();

  if (rutasDelDegradado.some((ruta) => ruta.includes('ids='))) {
    problemas.push(
      'con el resumen ya caido a la copia, el simulacro salio igual a pedirle las preguntas a la ' +
        'capa de datos: los ids se eligieron sobre la copia y se pidieron a otro banco'
    );
  }

  const degradadoHtml = domDegradado.html('#zona-del-intento');

  if (!empezoElRecorrido(degradadoHtml)) {
    problemas.push('con la capa de datos caida, el simulacro no pudo armar el intento');
  }

  const cuentasDegradadas = cuentasDelIntento(preguntasDegradado());

  if (cuentasDegradadas.reduce((a, b) => a + b, 0) !== PREGUNTAS_DEL_INTENTO) {
    problemas.push(
      `en modo degradado el intento quedo con ${cuentasDegradadas.reduce((a, b) => a + b, 0)} ` +
        `preguntas y no con ${PREGUNTAS_DEL_INTENTO}`
    );
  }

  const avisoDelSimulacro = domDegradado.html('#aviso-respaldo');

  // SE MIRA LO ESCRITO, NO LA CLASE, y se descubrio provocandolo: el DOM falso no
  // arranca con las clases que trae el HTML, asi que un nodo que nadie toco no esta
  // `hidden` para el. Preguntar solo por `oculto()` daba verde con el aviso
  // apagado del todo, que es exactamente el caso que hay que cazar. `oculto()` sigue
  // sirviendo para el caso contrario —cuando el componente apaga un aviso que
  // sobraba— y por eso se pregunta ademas, no en vez de.
  if (avisoDelSimulacro === '') {
    problemas.push(
      'en modo degradado el simulacro no escribio el aviso de ADR-008: estaria sirviendo la copia ' +
        'en silencio'
    );
  }

  if (domDegradado.oculto('#aviso-respaldo')) {
    problemas.push('en modo degradado el simulacro dejo el aviso de ADR-008 escondido');
  }

  if (!avisoDelSimulacro.includes('copia guardada del banco de preguntas')) {
    problemas.push('el aviso de respaldo del simulacro no dice que se esta viendo una copia');
  }

  if (!avisoDelSimulacro.includes('el simulacro se cargó desde la copia')) {
    problemas.push('el aviso de respaldo del simulacro no nombra al simulacro');
  }

  notas.push(
    `Modo degradado del simulacro: con el fetch caido, las ${PREGUNTAS_DEL_INTENTO} preguntas se ` +
      'eligieron y se armaron desde la instantanea, y el aviso de ADR-008 quedo visible nombrando ' +
      `al simulacro. Salio ${rutasDelDegradado.length} vez al resumen y ninguna al extremo por ` +
      'ids: con el resumen ya caido, las preguntas se le piden a la copia y no a un servicio que ' +
      'acaba de no contestar.'
  );

  // --- 10i · El algoritmo existe una sola vez -----------------------------
  //
  // Es el unico criterio de la etapa que no se provoca, porque lo que afirma es una
  // ausencia: que NO haya una segunda copia del algoritmo para el camino degradado.
  // Se comprueba leyendo quien importa que.

  const fuenteDelSimulacro = readFileSync(
    join(SITIO, 'components', 'simulacro.js'),
    'utf8'
  );

  const importaElAlgoritmo = /from '\.\.\/servicios\/eleccion-del-intento\.js'/.test(
    fuenteDelSimulacro
  );

  if (!importaElAlgoritmo) {
    problemas.push('el simulacro no importa el algoritmo de servicios/eleccion-del-intento.js');
  }

  // Se cuentan LLAMADAS, no menciones. Se descubrio el 2026-09-18, en la etapa C:
  // un comentario que explicaba de donde vienen las preguntas escribio
  // «elegirIntento()» y esta comprobacion dio rojo con el codigo intacto. Un rojo
  // que se dispara por un comentario ensena a no creerle a la comprobacion, que es
  // peor que no tenerla. Los comentarios se quitan antes de contar, y con eso lo que
  // queda es codigo.
  const sinComentarios = fuenteDelSimulacro
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  const vecesQueSeElige = (sinComentarios.match(/elegirIntento\(/g) ?? []).length;

  if (vecesQueSeElige !== 1) {
    problemas.push(
      `el simulacro llama a elegirIntento() ${vecesQueSeElige} veces: el camino normal y el ` +
        'degradado tienen que pasar por la misma'
    );
  }

  // Y la capa de datos NO sabe elegir. Es donde se bifurcan los dos caminos —vivo y
  // degradado—, asi que es el sitio donde una segunda copia del algoritmo se
  // colaria sin que nadie la viera. Se comprueba por sus imports y no por sus
  // palabras: los comentarios del archivo hablan de la eleccion, y tienen que poder
  // seguir hablando de ella.
  const fuenteDeDatos = readFileSync(join(SITIO, 'servicios', 'datos.js'), 'utf8');

  if (/from\s+'[^']*(eleccion-del-intento|hermanas)/.test(fuenteDeDatos)) {
    problemas.push(
      'servicios/datos.js importa el algoritmo o la lista de hermanas: el camino degradado no ' +
        'puede elegir por su cuenta'
    );
  }

  // Y quien importa el algoritmo es uno solo en todo el sitio.
  const importadores = [
    join(SITIO, 'main.js'),
    join(SITIO, 'cuestionario-main.js'),
    join(SITIO, 'simulacro-main.js'),
    join(SITIO, 'components', 'simulacro.js'),
    join(SITIO, 'components', 'cuestionario.js'),
    join(SITIO, 'servicios', 'datos.js'),
  ].filter(
    (archivo) =>
      existsSync(archivo) && /from\s+'[^']*eleccion-del-intento/.test(readFileSync(archivo, 'utf8'))
  );

  if (importadores.length !== 1) {
    problemas.push(
      `el algoritmo lo importan ${importadores.length} archivos del sitio, y tiene que importarlo uno`
    );
  }

  notas.push(
    'Un solo algoritmo: components/simulacro.js es el unico archivo del sitio que importa ' +
      'elegirIntento(), y la llama una vez; el camino degradado cambia de donde salen los ids, no ' +
      'quien elige. servicios/datos.js no importa ni el algoritmo ni las hermanas.'
  );

  // --- 10j · El aviso extraido dibuja lo mismo en las dos paginas ---------
  //
  // El aviso salio de components/cuestionario.js en la iteracion 41, etapa B, para
  // que el simulacro no tuviera una segunda copia. Lo que hay que vigilar de una
  // extraccion asi no es que el HTML sea EL DE AQUEL DIA: es que las dos paginas
  // sigan diciendo lo mismo. Dos copias no fallan cuando divergen, se quedan
  // calladas, y en un aviso de ADR-008 eso es lo peor que puede pasar.
  //
  // HASTA LA ITERACION 45 ESTO SE COMPARABA CONTRA 668 CARACTERES ESCRITOS AQUI,
  // clases incluidas, o sea que este guion era el dueno del aspecto del aviso:
  // repintarlo daba rojo sin que nada se hubiera roto, y la salida comoda era editar
  // la prueba hasta que pasara, que es como se aprende a no creerle. Lo que aquel
  // literal protegia -«la extraccion no cambio ni un caracter»- ya no se puede
  // romper hoy: el codigo de antes de la extraccion no existe, y aquella comparacion
  // quedo hecha y escrita en la bitacora de la 41.
  //
  // Se comparan los dos HTML que dibujaron LAS DOS PAGINAS de verdad, cada una con
  // su caida provocada -el cuestionario en 9b, el simulacro en 10h-, y no dos
  // llamadas preparadas aqui: lo que hay que proteger es lo que ve quien abre la
  // pagina.

  const avisoDelCuestionario = dom.html('#aviso-respaldo');

  // La UNICA diferencia que la extraccion dejo entrar por parametro. Se sustituye en
  // el del cuestionario y el resultado tiene que ser, caracter por caracter, el del
  // simulacro: cualquier otra diferencia -una clase, un espacio, una palabra- sale
  // aqui. Y si la sustitucion no cambiara nada, la diferencia permitida habria
  // desaparecido y la comparacion de abajo pasaria sin comparar nada, asi que
  // tambien se comprueba que cambie.
  const comoLoDiriaElSimulacro = avisoDelCuestionario.replace(
    'el cuestionario se cargó',
    'el simulacro se cargó'
  );

  if (comoLoDiriaElSimulacro === avisoDelCuestionario) {
    problemas.push(
      'el aviso del cuestionario ya no nombra lo que se cargo: la unica diferencia permitida ' +
        'entre las dos paginas dejo de existir, y compararlas dejo de probar nada'
    );
  }

  if (avisoDelSimulacro !== comoLoDiriaElSimulacro) {
    problemas.push(
      'el aviso de respaldo dejo de ser el mismo en las dos paginas: cambiando solo como se ' +
        'nombra lo que se cargo, el HTML del simulacro y el del cuestionario ya no coinciden ' +
        'byte a byte'
    );
  }

  // Que las dos digan lo mismo no basta: las dos podrian haberse quedado en blanco a
  // la vez. Lo que ADR-008 pide del contenido se mira aparte y por lo que se lee, no
  // por como se pinta. Que diga de cuando es la copia es la mitad que sirve para
  // decidir si confiar; el icono se exige por que EXISTA, sin decir cual, que es
  // asunto de la identidad visual y no de este guion.
  for (const [deQuien, aviso] of [
    ['del cuestionario', avisoDelCuestionario],
    ['del simulacro', avisoDelSimulacro],
  ]) {
    if (!/Es la copia del \d+ de \S+ de \d{4}\./.test(aviso)) {
      problemas.push(`el aviso de respaldo ${deQuien} no dice de cuando es la copia`);
    }

    if (!/class="icon i-[a-z0-9-]+/.test(aviso)) {
      problemas.push(`el aviso de respaldo ${deQuien} se quedo sin icono`);
    }
  }

  notas.push(
    `Aviso de respaldo extraido: las dos paginas dibujan los mismos ${avisoDelCuestionario.length} ` +
      'caracteres cambiando solo como se nombra lo que se cargo, y las dos dicen de cuando es la ' +
      'copia y la acompanan de un icono.'
  );

  // --- 10k · Un intento no mezcla bancos (correccion del 2026-09-17) ------
  //
  // EL CASO QUE ESTO VIGILA
  //
  // Son dos peticiones atadas: de `?resumen=1` salen los ids y `?ids=` los va a
  // buscar. Cada una cae al respaldo por su cuenta, asi que se puede llegar a que el
  // resumen conteste desde D1 y las preguntas salgan de la copia: **los ids se
  // eligieron sobre un banco y se piden a otro.**
  //
  // Hoy los dos bancos coinciden y no se nota. Por eso el caso se provoca haciendo
  // que dejen de coincidir: se le agregan al resumen de D1 ids que la copia no
  // tiene, que es exactamente lo que vera el navegador el dia que el banco crezca y
  // la instantanea se quede atras. Sin la correccion, medido el 2026-09-17, el
  // intento gastaba sus tres rondas de reserva sobre ids del banco equivocado y
  // terminaba en «No se pudo armar el simulacro» con 118 preguntas, justo cuando el
  // respaldo tenia que salvarlo.
  //
  // COMO SE COMPRUEBA QUE NO MEZCLA, SIN VER LOS IDS
  //
  // Por las rondas de reserva, que son visibles desde aqui: si el intento se vuelve
  // a elegir sobre los ids de la copia, **todo lo que se pide existe en la copia** y
  // no hace falta reponer ni una vez. Una sola peticion al extremo, y 120 preguntas
  // con su reparto. Con los bancos mezclados eso no puede pasar: lo que se pidio
  // sobre D1 no esta entero en la copia y hay que salir a reponer.

  /** Cuantas preguntas de D1 no tiene la copia, y en que modulo. */
  const MODULO_QUE_CRECIO = 5;
  const FANTASMAS = 60;
  const PRIMER_FANTASMA = 900001;

  /**
   * El azar DEL SITIO, fijado mientras dura esta seccion.
   *
   * `elegirIntento()` y `shuffle()` resuelven su `azar = Math.random` en cada
   * llamada, asi que reemplazarlo aqui hace repetible lo que el componente elige sin
   * tocar ni una linea del sitio ni pedirle un parametro que en la pagina no tiene.
   * Se devuelve al terminar: una prueba que deja el azar del proceso trucado le
   * cambia el suelo a lo que corra despues.
   */
  const azarDeVerdad = Math.random;
  Math.random = azarConSemilla(SEMILLA);

  /**
   * El resumen de D1, con ids que la copia no tiene metidos en un modulo.
   *
   * Se pide de verdad y se le agregan los fantasmas encima: escribir un resumen
   * entero a mano seria probar el simulacro contra un banco inventado.
   */
  const resumenConFantasmas = async (ruta, opciones) => {
    const respuesta = await fetchLimpio(ruta, opciones);
    const cuerpo = await respuesta.json();

    for (const fila of cuerpo.datos ?? []) {
      if (fila.modulo !== MODULO_QUE_CRECIO) continue;
      for (let i = 0; i < FANTASMAS; i += 1) fila.preguntas_ids.push(PRIMER_FANTASMA + i);
      fila.preguntas = fila.preguntas_ids.length;
    }

    return new Response(JSON.stringify(cuerpo), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  /**
   * Las tres cosas que un intento bien armado tiene que cumplir, miradas en el HTML y en el intento armado
   *
   * Se comparte entre los dos casos a proposito: son la misma promesa, y escrita dos
   * veces se arregla en una sola el dia que cambie.
   */
  const revisarElIntento = (html, preguntas, deQuien) => {
    if (!empezoElRecorrido(html)) {
      problemas.push(`${deQuien}: el intento no se armo`);
      return;
    }

    const cuentas = cuentasDelIntento(preguntas);
    const total = cuentas.reduce((a, b) => a + b, 0);

    if (total !== PREGUNTAS_DEL_INTENTO) {
      problemas.push(
        `${deQuien}: el intento quedo con ${total} preguntas y no con ${PREGUNTAS_DEL_INTENTO}`
      );
    }

    if (
      cuentas.filter((c) => c === PREGUNTAS_POR_MODULO + 1).length !== 1 ||
      cuentas.filter((c) => c === PREGUNTAS_POR_MODULO).length !== 6
    ) {
      problemas.push(
        `${deQuien}: el reparto dejo de ser ${PREGUNTAS_POR_MODULO} por modulo con uno en 18`
      );
    }
  };

  /** Que el aviso de ADR-008 quedo escrito y a la vista. */
  const revisarElAviso = (unDom, deQuien) => {
    if (unDom.html('#aviso-respaldo') === '' || unDom.oculto('#aviso-respaldo')) {
      problemas.push(
        `${deQuien}: el intento salio de la copia y el aviso de ADR-008 no quedo a la vista`
      );
    }
  };

  // --- 10k-1 · El resumen contesta desde D1 y `?ids=` se cae --------------

  const domMezcla = prepararDomFalso();
  let peticionesDeIds = 0;

  globalThis.fetch = async (ruta, opciones) => {
    const texto = String(ruta);

    if (texto.includes('resumen=1')) return resumenConFantasmas(texto, opciones);

    if (texto.includes('ids=')) {
      peticionesDeIds += 1;
      throw new Error('caida provocada del extremo por ids');
    }

    return fetchLimpio(texto, opciones);
  };

  const {
    conectarComienzo: conectarMezcla,
    comenzarElIntento: comenzarMezcla,
    preguntasDelIntento: preguntasMezcla,
  } =
    await import(
      `${pathToFileURL(join(SITIO, 'components', 'simulacro.js')).href}?mezcla=1`
    );

  conectarMezcla();
  await comenzarMezcla();

  const mezclaHtml = domMezcla.html('#zona-del-intento');

  revisarElIntento(mezclaHtml, preguntasMezcla(), 'Con el resumen de D1 y el extremo caido');
  revisarElAviso(domMezcla, 'Con el resumen de D1 y el extremo caido');

  // LA COMPROBACION QUE DA EL ROJO. Una sola peticion: la que cayo. Despues de ella
  // el intento se vuelve a elegir sobre los ids de la copia, y la copia los tiene
  // todos, asi que no hay nada que reponer. Sin la correccion, aqui salian cuatro.
  if (peticionesDeIds !== 1) {
    problemas.push(
      `tras caer al respaldo, el simulacro salio ${peticionesDeIds} vez(ces) al extremo por ids: ` +
        'con el intento reelegido sobre la copia no hace falta reponer ninguna vez'
    );
  }

  notas.push(
    `Mismo banco (resumen de D1 + extremo caido): con ${FANTASMAS} ids del modulo ` +
      `${MODULO_QUE_CRECIO} que la copia no tiene, el intento se volvio a elegir entero desde la ` +
      `copia —${peticionesDeIds} peticion al extremo, 0 rondas de reserva— y quedo con ` +
      `${PREGUNTAS_DEL_INTENTO} preguntas y el aviso de ADR-008 a la vista.`
  );

  // --- 10k-2 · La capa se cae a mitad de las reservas ---------------------
  //
  // El mismo riesgo por el otro camino: la primera tanda sale de D1 —los fantasmas
  // no vuelven, asi que el intento queda corto— y la capa se cae justo en la ronda
  // de reserva. Sin la correccion, esas reservas salian de la copia y el intento
  // terminaba con dos bancos adentro, o sin poder empezar.

  const domReservas = prepararDomFalso();
  let peticionesDeReserva = 0;
  let servidasPorLaCapa = 0;

  globalThis.fetch = async (ruta, opciones) => {
    const texto = String(ruta);

    if (texto.includes('resumen=1')) return resumenConFantasmas(texto, opciones);

    if (texto.includes('ids=')) {
      peticionesDeReserva += 1;

      if (peticionesDeReserva === 1) {
        const respuesta = await fetchLimpio(texto, opciones);
        servidasPorLaCapa = (await respuesta.clone().json())?.datos?.length ?? 0;
        return respuesta;
      }

      throw new Error('caida provocada a mitad de las reservas');
    }

    return fetchLimpio(texto, opciones);
  };

  const {
    conectarComienzo: conectarReservas,
    comenzarElIntento: comenzarReservas,
    preguntasDelIntento: preguntasReservas,
  } =
    await import(
      `${pathToFileURL(join(SITIO, 'components', 'simulacro.js')).href}?reservas=1`
    );

  conectarReservas();
  await comenzarReservas();

  const reservasHtml = domReservas.html('#zona-del-intento');

  if (servidasPorLaCapa >= PREGUNTAS_DEL_INTENTO) {
    problemas.push(
      'no se pudo provocar la caida a mitad de las reservas: la primera tanda ya trajo las ' +
        `${PREGUNTAS_DEL_INTENTO}, asi que no hubo ronda de reserva que hacer caer`
    );
  }

  revisarElIntento(reservasHtml, preguntasReservas(), 'Con la capa caida a mitad de las reservas');
  revisarElAviso(domReservas, 'Con la capa caida a mitad de las reservas');

  // Dos: la que salio bien contra D1 y la que cayo. Despues de esa, el intento se
  // rehace entero sobre la copia y no vuelve a salir. Sin la correccion, cuatro.
  if (peticionesDeReserva !== 2) {
    problemas.push(
      `con la capa caida a mitad de las reservas, el simulacro salio ${peticionesDeReserva} ` +
        'vez(ces) al extremo por ids, y tenian que ser 2: la que funciono y la que cayo'
    );
  }

  notas.push(
    `Mismo banco (caida a mitad de las reservas): D1 sirvio ${servidasPorLaCapa} de ` +
      `${PREGUNTAS_DEL_INTENTO} en la primera tanda y la ronda de reserva cayo; el intento se ` +
      `rehizo entero desde la copia en ${peticionesDeReserva} peticiones y quedo con ` +
      `${PREGUNTAS_DEL_INTENTO} preguntas.`
  );

  // --- 10k-3 · Elegir sobre la copia da un intento legitimo ---------------
  //
  // Lo de arriba comprueba que el intento se rehace; esto comprueba que lo que sale
  // de rehacerlo vale. Se eligen 50 intentos sobre los ids que la copia declara y se
  // les exige lo mismo que a los de D1: 120 preguntas, todas presentes en la copia,
  // el reparto, y ni dos hermanas juntas.
  //
  // Los ids de la copia se piden por la puerta nueva —`leerResumenDelRespaldo()`— y
  // se cotejan contra el archivo de la instantanea leido aparte. Una prueba que
  // sacara los ids de la misma funcion que prueba no probaria nada (H-023).

  const { leerResumenDelRespaldo } = await import(
    pathToFileURL(join(SITIO, 'servicios', 'datos.js')).href
  );

  const resumenDeLaCopia = await leerResumenDelRespaldo();

  const idsPorModuloDeLaCopia = Object.fromEntries(
    (resumenDeLaCopia.datos ?? []).map((fila) => [fila.modulo, fila.preguntas_ids])
  );

  if (!resumenDeLaCopia.ok || !resumenDeLaCopia.meta?.respaldo) {
    problemas.push(
      'leerResumenDelRespaldo() no entrego el resumen de la copia con su sello: sin sello, un ' +
        'intento servido desde la copia no encenderia el aviso de ADR-008'
    );
  }

  for (const modulo of MODULOS_DEL_EXAMEN) {
    const enElArchivo = instantanea.PREGUNTAS.filter((p) => p.modulo === modulo).length;
    const enElResumen = idsPorModuloDeLaCopia[modulo]?.length ?? 0;

    if (enElArchivo !== enElResumen) {
      problemas.push(
        `el resumen de la copia dice ${enElResumen} ids en el modulo ${modulo} y la instantanea ` +
          `trae ${enElArchivo} preguntas`
      );
    }
  }

  const azarDeLaCopia = azarConSemilla(SEMILLA);
  const idsQueLaCopiaTiene = new Set(instantanea.PREGUNTAS.map((p) => p.id));

  let intentosDeLaCopia = 0;
  let fueraDeLaCopia = 0;
  let repartoMaloEnLaCopia = 0;
  let hermanasJuntasEnLaCopia = 0;

  for (let i = 0; i < 50; i += 1) {
    const intento = elegirIntento({
      idsPorModulo: idsPorModuloDeLaCopia,
      azar: azarDeLaCopia,
    });

    if (!intento.ok) continue;
    intentosDeLaCopia += 1;

    if (
      intento.ids.length !== PREGUNTAS_DEL_INTENTO ||
      intento.ids.some((id) => !idsQueLaCopiaTiene.has(id))
    ) {
      fueraDeLaCopia += 1;
    }

    const cuotas = MODULOS_DEL_EXAMEN.map((m) => intento.porModulo[m].length);
    if (
      cuotas.filter((c) => c === PREGUNTAS_POR_MODULO + 1).length !== 1 ||
      cuotas.filter((c) => c === PREGUNTAS_POR_MODULO).length !== 6
    ) {
      repartoMaloEnLaCopia += 1;
    }

    const elegidos = new Set(intento.ids);
    for (const grupo of GRUPOS_DE_HERMANAS) {
      if (grupo.filter((id) => elegidos.has(id)).length > 1) hermanasJuntasEnLaCopia += 1;
    }
  }

  if (intentosDeLaCopia !== 50) {
    problemas.push(
      `sobre los ids de la copia solo se pudieron elegir ${intentosDeLaCopia} de 50 intentos: ` +
        'el camino al que cae el simulacro cuando la capa no responde no puede fallar'
    );
  }

  if (fueraDeLaCopia > 0) {
    problemas.push(
      `${fueraDeLaCopia} intento(s) elegidos sobre la copia piden preguntas que la copia no tiene`
    );
  }

  if (repartoMaloEnLaCopia > 0) {
    problemas.push(
      `${repartoMaloEnLaCopia} intento(s) elegidos sobre la copia no reparten ` +
        `${PREGUNTAS_POR_MODULO} por modulo con uno en 18`
    );
  }

  if (hermanasJuntasEnLaCopia > 0) {
    problemas.push(
      `${hermanasJuntasEnLaCopia} vez(ces) un intento elegido sobre la copia trajo dos preguntas ` +
        'del mismo grupo de hermanas'
    );
  }

  notas.push(
    `Intentos elegidos sobre la copia: los ${intentosDeLaCopia} traen ` +
      `${PREGUNTAS_DEL_INTENTO} preguntas que la instantanea tiene, con el reparto y sin dos ` +
      'hermanas juntas. El resumen de la copia coincide modulo a modulo con el archivo.'
  );

  Math.random = azarDeVerdad;
  globalThis.fetch = fetchLimpio;

  // ------------------------------------------------------------------------
  // 11 · Veredicto
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
      'Del cambio de modulo se probo la DECISION —que pase directo con respuestas',
      'dentro, y que la puerta unica siga cazando la doble peticion—, disparando los',
      'eventos que el componente registro DESDE EL INDICE, que es el unico camino por',
      'el que hoy se cambia de modulo. Lo que la memoria recuerda se prueba aparte, en',
      'scripts/probar-memoria.mjs.',
      '',
      'Del foco se probo A QUE ELEMENTO va a parar en cada camino, que es lo unico',
      'que se puede saber sin navegador, y alcanza para cazar el defecto que importa:',
      'que se caiga al body.',
      '',
      'Lo que esto NO prueba: nada de lo que solo existe en un navegador. Que el aviso',
      'se VEA, que el anillo del foco se pinte, que el tabulador recorra el indice en',
      'un orden razonable, que el desplazamiento llegue donde se ve, y como se apila',
      'en telefono. Eso se comprueba abriendo la pagina.',
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
