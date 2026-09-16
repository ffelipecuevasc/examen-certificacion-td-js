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
  // segundo camino a mostrarModulo()— sale, y son 44 a 65 KB por la misma pregunta
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
  // 44 a 65 KB por la misma pregunta.
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
