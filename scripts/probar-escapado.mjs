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
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

/** DOM falso, solo para capturar el HTML que el componente escribe. */
function prepararDomFalso(capturado) {
  const elemento = (selector) => ({
    dataset: {},
    style: {},
    classList: { add() {}, remove() {}, contains: () => false },
    set innerHTML(valor) {
      if (selector === '#cuestionario') capturado.html = valor;
      this._html = valor;
    },
    get innerHTML() {
      return this._html ?? '';
    },
    set textContent(v) {
      this._t = v;
    },
    get textContent() {
      return this._t ?? '';
    },
    addEventListener() {},
    querySelector: (s) => elemento(s),
    querySelectorAll: () => [],
    closest: () => null,
  });

  globalThis.document = { querySelector: elemento, querySelectorAll: () => [] };
  globalThis.window = { matchMedia: () => ({ matches: false }) };
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
  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    `No hay nadie escuchando en ${DIRECCION}.`,
    '',
    'Levanta el servidor local en otra terminal y vuelve a correrlo:',
    '',
    '  npm run datos:dev',
    '  npm run probar:escapado',
    '',
    `Detalle: ${error.message}`,
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

const capturado = { html: '' };
prepararDomFalso(capturado);

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
  globalThis.fetch = (ruta, opciones) => fetchReal(DIRECCION + ruta, opciones);

  const { renderCuestionario } = await import(
    pathToFileURL(join(SITIO, 'components', 'cuestionario.js')).href
  );
  const { esc } = await import(pathToFileURL(join(SITIO, 'utils', 'dom.js')).href);

  await renderCuestionario();
  const html = capturado.html;

  if (!html) {
    sinVeredicto('El componente no escribio ningun HTML.');
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

  const PROPIAS = new Set(['section', 'header', 'ul', 'li', 'div', 'p', 'span', 'button']);
  const presentes = [
    ...new Set([...html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g)].map((m) => m[1].toLowerCase())),
  ];
  const intrusas = presentes.filter((etiqueta) => !PROPIAS.has(etiqueta));

  if (intrusas.length > 0) {
    problemas.push(`etiquetas que el componente no emite: ${intrusas.join(', ')}`);
  }

  if (problemas.length === 0) {
    anunciar('ESCAPADO EN PIE', [
      `Se cargaron ${textos.length} textos hostiles en la base local y ninguno`,
      'llego al HTML como marcado: todos llegaron como texto, enteros.',
      '',
      `Etiquetas en el HTML: ${presentes.sort().join(', ')}`,
      'Ninguna ajena al componente.',
      '',
      'Recuerda lo que esto NO prueba: que el banco real no traiga',
      'sorpresas. Diez filas de juguete no son 368 (ADR-024).',
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
