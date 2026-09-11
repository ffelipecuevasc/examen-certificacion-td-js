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
import { prepararDomFalso } from './dom-falso.mjs';

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

const dom = prepararDomFalso();

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

    // La justificacion viaja desde la base aunque no se dibuje, asi que lo que
    // SI se le puede exigir es que no aparezca cruda.
    if (typeof p.justificacion === 'string' && p.justificacion !== '') {
      justificacionesVistas += 1;
      const escapada = esc(p.justificacion);
      if (escapada !== p.justificacion && html.includes(p.justificacion)) {
        problemasDelBanco.push(`pregunta ${p.id} · justificacion: su forma CRUDA aparece en el HTML`);
      }
      if (html.includes(escapada)) justificacionesDibujadas += 1;
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
  // O NINGUNA justificacion se dibuja —porque la iteracion 33 todavia no las
  // muestra— o se dibujan TODAS. Un intermedio significa que algunas se estan
  // perdiendo por el camino, y ese si seria el fallo.
  //
  // Escrito asi para que no caduque: el dia que la epica 30 las muestre, esta
  // misma linea pasa a exigir que aparezcan las 368, sin que nadie tenga que
  // acordarse de venir a quitar una exclusion.
  if (justificacionesDibujadas !== 0 && justificacionesDibujadas !== justificacionesVistas) {
    problemasDelBanco.push(
      `de ${justificacionesVistas} justificaciones, ${justificacionesDibujadas} aparecen en el HTML ` +
        'y el resto no: o se dibujan todas o ninguna, y un intermedio es texto perdido'
    );
  }

  if (delBanco.length > 0 && conCaracteresPeligrosos === 0) {
    problemasDelBanco.push(
      `las ${textosRevisados} porciones de texto del banco real no traen ni un caracter ` +
        'que escapar: esta comprobacion dejo de comprobar algo'
    );
  }

  for (const p of problemasDelBanco) problemas.push(p);

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
      `Etiquetas en el HTML: ${presentes.sort().join(', ')}`,
      'Ninguna ajena al componente.',
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
