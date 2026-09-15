/**
 * Guardian de la memoria del avance (iteracion 33, ADR-034).
 *
 * POR QUE EXISTE
 *
 * El sitio pasa a recordar lo que el estudiante respondio. Eso es una promesa
 * nueva, y de las caras: si la memoria se equivoca, no falla hacia el vacio —falla
 * **afirmando algo**—. Un veredicto viejo sobre una pregunta corregida le ensena al
 * estudiante una regla falsa la semana antes del examen, y lo hace con la cara de
 * quien sabe. Por eso la promesa que se comprueba aqui no es «guarda», es:
 *
 *   **lo que se recuerda nunca afirma algo que el banco ya no sostiene.**
 *
 * COMO SE PRUEBA: UNA VISITA ES UN PROCESO
 *
 * Recargar la pagina no es volver a llamar a `renderCuestionario()`: es que todo el
 * codigo empiece de cero y lo unico que sobreviva sea lo guardado. Dentro de un solo
 * proceso de Node eso no se puede fingir —los modulos ES se evaluan una vez y sus
 * variables se quedan puestas—, y una prueba que finja la recarga probaria justo lo
 * que no es.
 *
 * Asi que **cada visita es un proceso hijo**, y el almacen vive en un archivo JSON
 * que las visitas se van pasando. El archivo hace de disco del navegador: lo que
 * una visita escribe, la siguiente lo encuentra, y nada mas cruza de una a otra.
 *
 * LOS CAMBIOS DEL BANCO SE INTERCEPTAN, NO SE ESCRIBEN (decision 12)
 *
 * `banco:actualizar` regenera la instantanea versionada en el mismo acto (regla 5 de
 * ADR-025), y correrlo aqui romperia el paso `instantanea` de `npm run verificar`,
 * que es criterio de esta misma iteracion. Se intercepta la respuesta del extremo, y
 * la simulacion reproduce el efecto REAL comprobado en scripts/administrar-banco.mjs:
 * **el id de la pregunta no cambia, y los ids de sus cuatro alternativas si**.
 *
 * LO QUE ESTO NO PRUEBA
 *
 * Que el navegador guarde de verdad. El almacen es de mentira y vive en un archivo:
 * prueba la DECISION del componente —que guarde al responder, que restaure, que
 * recalcule, que borre solo lo suyo—. Que Chrome persista al recargar, que un almacen
 * denegado de verdad lance —cookies bloqueadas, o «Bloquear todas las cookies» en
 * Safari—, y que lo guardado se vea en DevTools, lo comprueba el autor en un
 * navegador. Esta escrito en los criterios de la iteracion, repartido en dos
 * listas a proposito.
 *
 * CUATRO VEREDICTOS
 *
 *   MEMORIA CORRECTA     0   se probo y recuerda sin mentir
 *   MEMORIA ROTA         1   se probo y NO
 *   NO SE PUDO PROBAR    2   nadie llego a probar nada
 *   NO A ESCALA          3   se probo, pero con el banco de juguete
 *
 * NECESITA EL SERVIDOR LOCAL LEVANTADO Y EL BANCO REAL EN LA BASE LOCAL:
 *
 *   npm run datos:banco-local   (una vez)
 *   npm run datos:dev           (en otra terminal)
 *   npm run probar:memoria
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

/** Por debajo de esto el banco es de juguete y probar no dice nada (H-023). */
const PISO_DE_ESCALA = 100;

/** Los dos modulos con los que se trabaja. Dos, para poder probar que no se pisan. */
const MODULO = 3;
const OTRO_MODULO = 5;

const LINEA = '='.repeat(72);

// ---------------------------------------------------------------------------
// LA VISITA (el proceso hijo)
//
// Se reconoce por `--visita=<archivo>`. Monta el DOM falso, instala el almacen que
// le digan, importa los componentes REALES y ejecuta los pasos. Al terminar escribe
// lo que vio en el archivo de salida y se muere, que es lo que vuelve creible la
// siguiente visita: no le queda nada puesto.
// ---------------------------------------------------------------------------

const esVisita = process.argv.find((a) => a.startsWith('--visita='));

if (esVisita) {
  await correrLaVisita(esVisita.slice('--visita='.length));
  process.exit(0);
}

async function correrLaVisita(archivoDeEncargo) {
  const encargo = JSON.parse(readFileSync(archivoDeEncargo, 'utf8'));
  const salida = {
    peticiones: [],
    avisos: [],
    errores: [],
    pasos: [],
  };

  /** El lector del DOM falso. Vive aqui fuera para poder retratarlo pase lo que pase. */
  let dom = null;

  try {
    const { almacenDeMentira, prepararDomFalso } = await import(
      pathToFileURL(join(AQUI, 'dom-falso.mjs')).href
    );

    // --- El almacen, cargado desde el archivo que hace de disco ---------------
    const guardado = existsSync(encargo.disco)
      ? JSON.parse(readFileSync(encargo.disco, 'utf8'))
      : {};

    let almacen = null;

    if (encargo.almacen === 'normal' || encargo.almacen === 'escritura-lanza') {
      almacen = almacenDeMentira({ escrituraProhibida: encargo.almacen === 'escritura-lanza' });
      for (const [clave, valor] of Object.entries(guardado)) almacen.datos.set(clave, valor);
    }

    // Chrome con las cookies bloqueadas: leer la propiedad lanza, antes de llamar
    // a nada. Es el caso que mas facil se olvida, asi que se instala como getter.
    if (encargo.almacen === 'lectura-lanza') {
      almacen = () => {
        throw new Error('SecurityError de mentira: acceso al almacenamiento denegado');
      };
    }

    dom = prepararDomFalso({ almacen });

    // --- El fetch: el servidor real, salvo lo que esta visita intercepte -------
    const fetchReal = globalThis.fetch;

    globalThis.fetch = async (ruta, opciones) => {
      salida.peticiones.push({ ruta: String(ruta), cuerpo: opciones?.body ?? null });

      if (encargo.caerLaRed) throw new Error('caida provocada');

      const respuesta = await fetchReal(DIRECCION + ruta, opciones);

      if (!encargo.intercepcion) return respuesta;

      const texto = await respuesta.text();
      const cuerpo = JSON.parse(texto);
      const cambiado = intervenir(String(ruta), cuerpo, encargo.intercepcion);

      return new Response(JSON.stringify(cambiado), {
        status: respuesta.status,
        headers: { 'content-type': 'application/json' },
      });
    };

    // Los avisos de consola son evidencia: `avisarSiElResumenNoCuadra()` habla por
    // ahi, y el criterio de «lo dibujado manda» pide comprobar que hablo.
    const warnReal = console.warn;
    console.warn = (...partes) => {
      salida.avisos.push(partes.join(' '));
    };

    // --- Los componentes reales, desde donde diga el encargo -------------------
    //
    // `sitio` existe para un solo caso: el que no tiene instantanea. Ahi se importa
    // desde una copia del arbol a la que le falta el archivo, que es la unica forma
    // honesta de provocar «ni resumen ni instantanea» sin tocar el repositorio.
    const raizDelSitio = encargo.sitio ?? SITIO;

    const cuestionario = await import(
      pathToFileURL(join(raizDelSitio, 'components', 'cuestionario.js')).href
    );

    await cuestionario.renderCuestionario();
    cuestionario.setupReinicio();

    // --- Los pasos ------------------------------------------------------------
    for (const paso of encargo.pasos) {
      await darElPaso(paso, dom, cuestionario, salida);
      salida.pasos.push(retrato(dom, paso));
    }

    console.warn = warnReal;

    // --- Lo que queda en el disco al irse -------------------------------------
    salida.almacen = almacen && typeof almacen !== 'function'
      ? Object.fromEntries(almacen.datos)
      : {};

    if (almacen && typeof almacen !== 'function') {
      writeFileSync(encargo.disco, JSON.stringify(salida.almacen, null, 2));
    }

    salida.final = retrato(dom, { tipo: 'final' });
  } catch (error) {
    salida.errores.push(`${error.message}\n${error.stack}`);
  } finally {
    // El retrato se toma aunque algo haya fallado: quien lea el resultado tiene que
    // poder ver que quedo en pantalla, que suele ser la mitad de la explicacion.
    if (dom && salida.final === undefined) {
      try {
        salida.final = retrato(dom, { tipo: 'final-tras-error' });
      } catch {
        salida.final = null;
      }
    }
  }

  writeFileSync(encargo.salida, JSON.stringify(salida, null, 2));
}

/**
 * Cambia la respuesta del extremo para simular que el banco cambio.
 *
 * Cada simulacion reproduce un cambio real y su efecto real. La regla comun, y la
 * que mas importa: **los ids de las alternativas cambian siempre**, porque
 * `banco:actualizar` las borra y las reinserta. Una prueba que dejara los ids
 * quietos estaria probando un banco que no existe.
 */
function intervenir(ruta, cuerpo, plan) {
  const esResumen = ruta.includes('resumen=1');
  const idsNuevos = (pregunta) => ({
    ...pregunta,
    alternativas: pregunta.alternativas.map((a) => ({ ...a, id: a.id + 100000 })),
  });

  if (esResumen) {
    if (plan.tipo === 'resumen-sin-ids') {
      return { ...cuerpo, datos: cuerpo.datos.map(({ preguntas_ids, ...f }) => f) };
    }

    // Una pregunta retirada desaparece de las dos consultas, porque las dos leen de
    // la vista `pregunta_activa` (ADR-020). Si solo desapareciera de una, el banco
    // se estaria contradiciendo consigo mismo.
    if (plan.tipo === 'retirada') {
      return {
        ...cuerpo,
        datos: cuerpo.datos.map((f) =>
          f.modulo === plan.modulo
            ? {
                ...f,
                preguntas: f.preguntas - 1,
                preguntas_ids: f.preguntas_ids.filter((id) => id !== plan.pregunta),
              }
            : f
        ),
      };
    }

    return cuerpo;
  }

  if (!Array.isArray(cuerpo.datos)) return cuerpo;

  if (plan.tipo === 'ids-nuevos') {
    return { ...cuerpo, datos: cuerpo.datos.map(idsNuevos) };
  }

  if (plan.tipo === 'correcta-movida') {
    return {
      ...cuerpo,
      datos: cuerpo.datos.map((p) => {
        if (p.id !== plan.pregunta) return idsNuevos(p);

        const ahora = p.alternativas.findIndex((a) => a.es_correcta === 1);
        const despues = (ahora + 1) % p.alternativas.length;

        return idsNuevos({
          ...p,
          alternativas: p.alternativas.map((a, i) => ({
            ...a,
            es_correcta: i === despues ? 1 : 0,
          })),
        });
      }),
    };
  }

  if (plan.tipo === 'texto-cambiado') {
    return {
      ...cuerpo,
      datos: cuerpo.datos.map((p) => {
        if (p.id !== plan.pregunta) return idsNuevos(p);

        return idsNuevos({
          ...p,
          alternativas: p.alternativas.map((a) =>
            a.texto === plan.texto ? { ...a, texto: `${a.texto} (corregida)` } : a
          ),
        });
      }),
    };
  }

  // Retirada del banco: la pregunta ya no viaja. Desde el modulo se ve igual que
  // una descartada por la validacion; la diferencia esta en el resumen, de arriba.
  if (plan.tipo === 'retirada' || plan.tipo === 'descartada') {
    return { ...cuerpo, datos: cuerpo.datos.filter((p) => p.id !== plan.pregunta) };
  }

  return cuerpo;
}

/** Ejecuta un paso del encargo sobre el componente real. */
async function darElPaso(paso, dom, cuestionario, salida) {
  if (paso.tipo === 'elegir') {
    dom.disparar('#indice-modulos', 'click', {
      target: { closest: (s) => (s === '[data-modulo]' ? { dataset: { modulo: String(paso.modulo) } } : null) },
    });
    // El clic dispara una carga que no se puede esperar desde fuera: se le da
    // tiempo de sobra y se comprueba el resultado, no el reloj.
    await new Promise((listo) => setTimeout(listo, paso.espera ?? 2500));
    return;
  }

  if (paso.tipo === 'responder') {
    const html = dom.html('#cuestionario');

    for (const encargo of paso.cuales) {
      const bloque = bloqueDePregunta(html, encargo.pregunta);
      const alternativas = alternativasDelBloque(bloque);

      const elegida = alternativas.find((a) =>
        encargo.acertando ? a.correcta : !a.correcta
      );

      if (!elegida) {
        salida.errores.push(
          `no encontre una alternativa ${encargo.acertando ? 'correcta' : 'incorrecta'} ` +
            `dibujada en la pregunta ${encargo.pregunta}`
        );
        continue;
      }

      // El boton y su tarjeta son nodos del DOM falso, no objetos sueltos: responder()
      // recorre hacia arriba y hacia los lados —la tarjeta, las cuatro alternativas,
      // la marca, el parrafo del veredicto— y con objetos pelados se cae en la
      // primera linea. Lo unico que se fabrica es lo que el navegador tendria puesto
      // en el HTML: de que pregunta es la tarjeta y que alternativa se pulso.
      const tarjeta = dom.nodo(`#tarjeta-q${encargo.pregunta}`);
      tarjeta.dataset.pregunta = `q${encargo.pregunta}`;

      const boton = dom.nodo(`#alternativa-${elegida.id}`);
      boton.disabled = false;
      boton.dataset.correct = String(elegida.correcta);
      boton.dataset.alternativa = String(elegida.id);
      boton.closest = (selector) => (selector === '[data-pregunta]' ? tarjeta : boton);

      dom.disparar('#cuestionario', 'click', {
        target: { closest: (s) => (s === '.quiz-option' ? boton : null) },
      });
    }
    return;
  }

  if (paso.tipo === 'reiniciar') {
    dom.disparar('#reiniciar', 'click', {});
    return;
  }

  salida.errores.push(`no conozco el paso «${paso.tipo}»`);
}

/** El bloque HTML de una pregunta, o '' si no se dibujo. */
function bloqueDePregunta(html, id) {
  const marca = `data-pregunta="q${id}"`;
  const desde = html.indexOf(marca);
  if (desde === -1) return '';

  const siguiente = html.indexOf('data-pregunta="q', desde + marca.length);
  return siguiente === -1 ? html.slice(desde) : html.slice(desde, siguiente);
}

/** Las alternativas dibujadas de un bloque, con su id, su texto y su estado. */
function alternativasDelBloque(bloque) {
  const botones = bloque.split('<button').slice(1);

  return botones.map((trozo) => ({
    id: Number(trozo.match(/data-alternativa="(\d+)"/)?.[1]),
    correcta: /data-correct="true"/.test(trozo),
    estado: trozo.match(/data-state="(\w+)"/)?.[1] ?? null,
    elegida: /data-elegida="true"/.test(trozo),
    texto: trozo.match(/<span>([^<]*)<\/span>/)?.[1] ?? '',
  }));
}

/** Foto de lo que la pagina esta diciendo ahora mismo. */
function retrato(dom, paso) {
  const html = dom.html('#cuestionario');

  const respondidas = [...html.matchAll(/data-pregunta="q(\d+)" data-answered="true"/g)].map((m) => {
    const id = Number(m[1]);
    const elegida = alternativasDelBloque(bloqueDePregunta(html, id)).find((a) => a.elegida);
    return { id, elegida: elegida?.texto ?? null, estado: elegida?.estado ?? null };
  });

  return {
    paso,
    barras: {
      respondidas: dom.texto('#valor-avance'),
      correctas: dom.texto('#valor-correctas'),
      incorrectas: dom.texto('#valor-incorrectas'),
    },
    total: dom.texto('#total-preguntas'),
    dibujadas: [...html.matchAll(/data-pregunta="q(\d+)"/g)].map((m) => Number(m[1])),
    respondidas,
    indice: filasDelIndice(dom.html('#indice-modulos')),
    avisoAlmacenamiento: {
      oculto: dom.oculto('#aviso-almacenamiento'),
      html: dom.html('#aviso-almacenamiento'),
    },
    avisoRespaldo: { oculto: dom.oculto('#aviso-respaldo') },
  };
}

/** Lo que dice cada fila del indice: su cifra y su nombre accesible. */
function filasDelIndice(html) {
  return [...html.matchAll(/data-modulo="(\d+)"[\s\S]*?aria-label="([^"]*)"[\s\S]*?text-mutedink[^>]*>([^<]*)</g)].map(
    (m) => ({ modulo: Number(m[1]), etiqueta: m[2], cifra: m[3] })
  );
}

// ---------------------------------------------------------------------------
// EL ORQUESTADOR (el proceso padre)
// ---------------------------------------------------------------------------

function anunciar(titulo, lineas) {
  console.log(`\n${LINEA}\n  ${titulo}\n${LINEA}\n`);
  for (const linea of lineas) console.log(`  ${linea}`);
  console.log('');
}

function terminar(codigo) {
  process.exitCode = codigo;
  process.exit(codigo);
}

const noSePudo = (motivo, detalle) => {
  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    motivo,
    ...(detalle ? ['', detalle] : []),
  ]);
  terminar(SIN_VEREDICTO);
};

/** Corre wrangler contra la base LOCAL. Siempre --local, por ADR-015. */
function consultar(sql) {
  const cli = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
  if (!existsSync(cli)) noSePudo('No encontre wrangler en node_modules. Corre `npm install`.');

  const resultado = spawnSync(
    process.execPath,
    [cli, 'd1', 'execute', BASE_D1, '--local', '--json', `--command=${sql}`],
    { cwd: RAIZ, encoding: 'utf8' }
  );

  const texto = `${resultado.stdout ?? ''}${resultado.stderr ?? ''}`;
  const desde = texto.indexOf('[');
  if (desde === -1) return null;

  try {
    return JSON.parse(texto.slice(desde))?.[0]?.results ?? null;
  } catch {
    return null;
  }
}

// --- Sondeo del servidor -----------------------------------------------------

try {
  const sondeo = await fetch(`${DIRECCION}/api/estado`, {
    signal: AbortSignal.timeout(ESPERA_SONDEO),
  });
  if (!sondeo.ok) noSePudo(`${DIRECCION}/api/estado respondio ${sondeo.status}.`);
} catch (error) {
  noSePudo(
    `No hay capa de datos en ${DIRECCION}.`,
    ['Levanta el servidor local en otra terminal:', '', '  npm run datos:dev', '', `Detalle: ${error.message}`].join('\n  ')
  );
}

// --- Lo que el banco dice que hay -------------------------------------------

const porModulo = consultar(
  'SELECT modulo, COUNT(*) AS cuantas FROM pregunta_activa GROUP BY modulo ORDER BY modulo;'
);

if (!porModulo?.length) {
  noSePudo(
    'La base local no devolvio ningun modulo con preguntas activas.',
    'Cargala con `npm run datos:banco-local`.'
  );
}

const totalDelBanco = porModulo.reduce((suma, f) => suma + f.cuantas, 0);
const cuantasTiene = (modulo) => porModulo.find((f) => f.modulo === modulo)?.cuantas;

const preguntasDelModulo = consultar(
  `SELECT id FROM pregunta_activa WHERE modulo = ${MODULO} ORDER BY id;`
)?.map((f) => f.id);

const preguntasDelOtro = consultar(
  `SELECT id FROM pregunta_activa WHERE modulo = ${OTRO_MODULO} ORDER BY id;`
)?.map((f) => f.id);

if (!preguntasDelModulo?.length || !preguntasDelOtro?.length) {
  noSePudo('La base local no devolvio los ids de las preguntas de los modulos de prueba.');
}

const [P1, P2, P3] = preguntasDelModulo;
const [Q1, Q2] = preguntasDelOtro;

// --- Utilidades del orquestador ---------------------------------------------

const taller = mkdtempSync(join(tmpdir(), 'memoria-'));
let visitas = 0;

// El mismo `esc()` del sitio, no una copia: lo dibujado viene escapado y quien
// compare tiene que escapar el otro lado. Dos versiones de esta funcion no fallarian
// al divergir, se quedarian calladas.
const { esc } = await import(pathToFileURL(join(SITIO, 'utils', 'dom.js')).href);

const problemas = [];
const notas = [];

/**
 * Abre la pagina en un proceso nuevo, con el disco que se le diga.
 *
 * Volver de aqui es lo mas parecido a cerrar el navegador: del proceso hijo no queda
 * nada mas que el archivo del disco y lo que conto de lo que vio.
 */
function visitar({ disco, almacen = 'normal', pasos = [], intercepcion = null, sitio = null, caerLaRed = false }) {
  visitas += 1;

  const encargo = join(taller, `encargo-${visitas}.json`);
  const salida = join(taller, `salida-${visitas}.json`);

  writeFileSync(
    encargo,
    JSON.stringify({ disco, almacen, pasos, intercepcion, sitio, salida, caerLaRed })
  );

  const corrida = spawnSync(process.execPath, [join(AQUI, 'probar-memoria.mjs'), `--visita=${encargo}`], {
    cwd: RAIZ,
    encoding: 'utf8',
    env: { ...process.env, DIRECCION_LOCAL: DIRECCION },
  });

  if (!existsSync(salida)) {
    noSePudo(
      'Una visita no dejo resultado: el proceso hijo se cayo antes de escribirlo.',
      `${corrida.stdout ?? ''}${corrida.stderr ?? ''}`.slice(0, 1500)
    );
  }

  const vista = JSON.parse(readFileSync(salida, 'utf8'));

  // Una visita que lanza es la pagina rompiendose en la cara del estudiante, y deja
  // a todo lo que venga detras sin pasos que mirar. Se cierra en rojo aqui mismo, con
  // el error a la vista, en vez de seguir y caerse mas adelante leyendo un paso que
  // no existe: un guardian que termina con un volcado de pila no da veredicto.
  if (vista.errores.length > 0) {
    problemas.push(
      `la visita ${visitas} termino con error: ${vista.errores[0].split('\n').slice(0, 2).join(' | ')}`
    );
    veredictoRoto();
  }

  return vista;
}

/** Un disco vacio, listo para una historia nueva. */
function discoNuevo(nombre) {
  const ruta = join(taller, `${nombre}.json`);
  writeFileSync(ruta, '{}');
  return ruta;
}

const leerDisco = (ruta) => JSON.parse(readFileSync(ruta, 'utf8'));
const claveDe = (modulo) => `examen-td-js.avance.modulo-${modulo}`;
const filaDe = (retratoVisto, modulo) => retratoVisto.indice.find((f) => f.modulo === modulo);

/**
 * Cierra en rojo aqui mismo, sin seguir.
 *
 * Hay fallos que dejan a las comprobaciones que vienen detras sin nada sobre lo que
 * trabajar —si no se guardo ninguna respuesta, no hay ninguna que corregir para
 * probar que el banco cambio—. Seguir daria una lista de errores derivados que tapan
 * el unico que importa. Y caerse con un volcado de pila seria peor: un guardian que
 * se cae no da veredicto, y H-013 dice que eso NO es un aprobado.
 */
function veredictoRoto() {
  rmSync(taller, { recursive: true, force: true });

  anunciar('MEMORIA ROTA  ***  el avance esta mintiendo  ***', [
    ...problemas.map((p, i) => `${String(i + 1).padStart(2)}. ${p}`),
    '',
    `Servidor:  ${DIRECCION}`,
    `Banco:     ${totalDelBanco} preguntas activas en ${porModulo.length} modulos`,
    `Visitas:   ${visitas} procesos`,
    ...(notas.length > 0 ? ['', ...notas.map((n) => `· ${n}`)] : []),
  ]);

  terminar(ROTO);
}

// ===========================================================================
// 1 · La escala. Con el banco de juguete esto no dice nada (H-023).
// ===========================================================================

const aEscala = totalDelBanco >= PISO_DE_ESCALA;

// ===========================================================================
// 2 · Memoria: guardar al responder, sobrevivir a la visita, no pisar otros
// ===========================================================================

const disco = discoNuevo('historia');

// --- Visita 1: responder dos preguntas del modulo, una bien y una mal --------
//
// Y NO cambiar de modulo antes de irse. Es la mitad del criterio «se guarda al
// responder, no al salir»: si el guardado viviera en el cambio de modulo, esta
// visita no dejaria nada escrito.
const v1 = visitar({
  disco,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }, { pregunta: P2, acertando: false }] },
  ],
});

const trasResponder = v1.final;

if (trasResponder.barras.respondidas !== '2') {
  problemas.push(
    `tras responder dos preguntas el panel dice «${trasResponder.barras.respondidas}» respondidas`
  );
}
if (trasResponder.barras.correctas !== '1' || trasResponder.barras.incorrectas !== '1') {
  problemas.push(
    `tras responder una bien y una mal las barras dicen ${trasResponder.barras.correctas} correctas ` +
      `y ${trasResponder.barras.incorrectas} incorrectas`
  );
}

const enElDisco = leerDisco(disco);
const anotado = enElDisco[claveDe(MODULO)] ? JSON.parse(enElDisco[claveDe(MODULO)]) : null;

if (!anotado) {
  problemas.push(
    'responder no dejo nada guardado: el avance solo existiria mientras la pagina este abierta'
  );
} else {
  if (anotado.v !== 1) problemas.push(`lo guardado no lleva la version del formato: ${JSON.stringify(anotado.v)}`);
  if (anotado.modulo !== MODULO) problemas.push('lo guardado no dice de que modulo es');
  if (Object.keys(anotado.respuestas ?? {}).length !== 2) {
    problemas.push(`se guardaron ${Object.keys(anotado.respuestas ?? {}).length} respuestas y se respondieron 2`);
  }

  // El veredicto NO se guarda. Es la regla que sostiene toda la iteracion: si
  // estuviera ahi, una correccion del banco no podria desmentirlo.
  const crudo = JSON.stringify(anotado);
  for (const palabra of ['acerto', 'correcta', 'es_correcta', 'veredicto', 'true', 'false']) {
    if (crudo.includes(`"${palabra}"`) || crudo.includes(`:${palabra}`)) {
      problemas.push(
        `lo guardado trae «${palabra}»: el veredicto no se guarda, se recalcula contra el banco`
      );
    }
  }

  const textos = Object.values(anotado.respuestas ?? {});
  if (textos.some((t) => typeof t !== 'string' || t.length === 0)) {
    problemas.push('lo guardado no es el texto de la alternativa elegida');
  }
}

// --- Visita 2: la pagina se abre de cero y tiene que acordarse ---------------
const v2 = visitar({
  disco,
  pasos: [{ tipo: 'elegir', modulo: MODULO }],
});

const trasRecargar = v2.final;

if (trasRecargar.barras.respondidas !== trasResponder.barras.respondidas ||
    trasRecargar.barras.correctas !== trasResponder.barras.correctas ||
    trasRecargar.barras.incorrectas !== trasResponder.barras.incorrectas) {
  problemas.push(
    `tras rehacer el arranque las barras dicen ${JSON.stringify(trasRecargar.barras)} y antes decian ` +
      `${JSON.stringify(trasResponder.barras)}`
  );
}

// Lo que se compara NO es el retrato de la visita anterior, sino lo que quedo
// guardado. Al responder en vivo, el componente marca los nodos que ya estan en la
// pagina y no reescribe el HTML —igual que en el navegador—, asi que el HTML de esa
// primera visita no dice nada de lo respondido. Lo que tiene que coincidir es lo
// dibujado ahora con lo que el estudiante eligio, y eso esta en el disco.
const guardadas = new Map(
  Object.entries(anotado?.respuestas ?? {}).map(([id, texto]) => [Number(id), texto])
);

const respondidasAhora = new Map(trasRecargar.respondidas.map((r) => [r.id, r.elegida]));

if (respondidasAhora.size !== guardadas.size) {
  problemas.push(
    `tras rehacer el arranque quedaron ${respondidasAhora.size} preguntas dibujadas como ` +
      `respondidas y se habian guardado ${guardadas.size}`
  );
}

for (const [id, texto] of guardadas) {
  if (!respondidasAhora.has(id)) {
    problemas.push(`la pregunta ${id} estaba respondida y tras rehacer el arranque no lo esta`);
  } else if (respondidasAhora.get(id) !== esc(texto)) {
    problemas.push(
      `la pregunta ${id} volvio con otra alternativa marcada:\n      se eligio: «${esc(texto)}»` +
        `\n      se dibujo: «${respondidasAhora.get(id)}»`
    );
  }
}

// Y el veredicto de cada una tiene que ser el que sostiene el banco de hoy: la que
// se acerto, dibujada como acierto; la que se fallo, como fallo.
const estados = trasRecargar.respondidas.map((r) => r.estado).sort();
if (estados.join(',') !== 'correct,wrong') {
  problemas.push(
    `tras restaurar, las dos respuestas quedaron dibujadas como «${estados.join(', ')}» y una se ` +
      'acerto y la otra se fallo'
  );
}

notas.push(
  `Memoria: dos respuestas del modulo ${MODULO} sobrevivieron a rehacer el arranque, con la ` +
    'misma alternativa marcada y las tres barras diciendo lo mismo.'
);

// --- Visita 3: cambiar de modulo y volver no pierde nada ---------------------
const v3 = visitar({
  disco,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'elegir', modulo: OTRO_MODULO },
    { tipo: 'responder', cuales: [{ pregunta: Q1, acertando: true }, { pregunta: Q2, acertando: true }] },
    { tipo: 'elegir', modulo: MODULO },
  ],
});

const alVolver = v3.final;

if (alVolver.barras.respondidas !== '2') {
  problemas.push(
    `tras ir al modulo ${OTRO_MODULO} y volver al ${MODULO}, el panel dice ` +
      `«${alVolver.barras.respondidas}» respondidas y eran 2`
  );
}
if (alVolver.respondidas.length !== 2) {
  problemas.push(
    `tras volver al modulo ${MODULO} quedaron ${alVolver.respondidas.length} preguntas dibujadas como respondidas`
  );
}

// Y el salto tiene que haber sido DIRECTO: sin aviso de perdida de por medio. El
// paso siguiente dibujo el otro modulo, asi que si hubiera habido una puerta que
// preguntara, las preguntas del otro modulo no estarian.
const enElOtro = v3.pasos[2];
if (!enElOtro || enElOtro.barras.respondidas !== '2') {
  problemas.push(
    'cambiar de modulo con respuestas dentro no llego a dibujar el otro modulo: quedo algo ' +
      'preguntando por el medio, y el aviso de perdida estaba retirado'
  );
}

notas.push(
  `Cambio de modulo con respuestas dentro: paso directo, sin preguntar, y al volver al ` +
    `modulo ${MODULO} estaban las dos respuestas.`
);

// ===========================================================================
// 3 · Reiniciar borra lo suyo, y nada mas
// ===========================================================================

const v4 = visitar({
  disco,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'reiniciar' },
  ],
});

const trasReiniciar = v4.final;

if (trasReiniciar.barras.respondidas !== '0') {
  problemas.push(`reiniciar dejo el panel diciendo «${trasReiniciar.barras.respondidas}» respondidas`);
}

const discoTrasReiniciar = leerDisco(disco);

if (discoTrasReiniciar[claveDe(MODULO)] !== undefined) {
  problemas.push(
    `reiniciar limpio la pantalla pero dejo lo guardado del modulo ${MODULO}: al recargar ` +
      'volveria todo, que es un boton que miente'
  );
}
if (discoTrasReiniciar[claveDe(OTRO_MODULO)] === undefined) {
  problemas.push(
    `reiniciar el modulo ${MODULO} borro tambien el ${OTRO_MODULO}: cada reinicio es de su modulo`
  );
}

// Y comprobado abriendo de nuevo, que es donde el estudiante lo notaria.
const v5 = visitar({
  disco,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'elegir', modulo: OTRO_MODULO },
  ],
});

if (v5.pasos[0].barras.respondidas !== '0') {
  problemas.push(
    `tras reiniciar y volver a abrir, el modulo ${MODULO} dice ${v5.pasos[0].barras.respondidas} respondidas`
  );
}
if (v5.final.barras.respondidas !== '2') {
  problemas.push(
    `tras reiniciar el modulo ${MODULO}, el ${OTRO_MODULO} perdio su avance: dice ` +
      `${v5.final.barras.respondidas} y eran 2`
  );
}

notas.push(
  `Reinicio: borro lo guardado del modulo ${MODULO} —comprobado en el disco y al volver a ` +
    `abrir— y dejo intactas las dos respuestas del ${OTRO_MODULO}.`
);

// ===========================================================================
// 4 · Sin almacenamiento, el sitio sigue sirviendo y lo dice
// ===========================================================================

for (const modo of ['lectura-lanza', 'escritura-lanza']) {
  const sinMemoria = visitar({
    disco: discoNuevo(`sin-memoria-${modo}`),
    almacen: modo,
    pasos: [
      { tipo: 'elegir', modulo: MODULO },
      { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
    ],
  });

  if (sinMemoria.errores.length > 0) {
    problemas.push(`con el almacenamiento denegado (${modo}) la pagina se cayo`);
  }
  if (sinMemoria.final.dibujadas.length !== cuantasTiene(MODULO)) {
    problemas.push(
      `con el almacenamiento denegado (${modo}) el modulo ${MODULO} dibujo ` +
        `${sinMemoria.final.dibujadas.length} preguntas y tiene ${cuantasTiene(MODULO)}`
    );
  }
  if (sinMemoria.final.barras.respondidas !== '1') {
    problemas.push(
      `con el almacenamiento denegado (${modo}) responder no marco la respuesta: el panel dice ` +
        `«${sinMemoria.final.barras.respondidas}»`
    );
  }
  if (sinMemoria.final.avisoAlmacenamiento.oculto) {
    problemas.push(
      `con el almacenamiento denegado (${modo}) la pagina no lo dice: el estudiante responderia ` +
        'treinta preguntas y las perderia al recargar sin que nadie se lo hubiera advertido'
    );
  }
  if (!sinMemoria.final.avisoAlmacenamiento.html.includes('no se está guardando')) {
    problemas.push(`el aviso de almacenamiento denegado (${modo}) no dice que no se esta guardando`);
  }
}

// Y con almacenamiento el aviso NO aparece. Avisar cuando no pasa nada es el mismo
// defecto que hizo retirar el aviso de perdida.
if (!v2.final.avisoAlmacenamiento.oculto) {
  problemas.push('el aviso de «no se está guardando» aparece aunque el navegador si guarde');
}

notas.push(
  'Sin almacenamiento —lectura denegada y escritura denegada—: se elige modulo, se responde, ' +
    'no hay error, y la pagina dice que el avance no se esta guardando.'
);

// ===========================================================================
// 5 · Un dato desconocido o corrupto se ignora
// ===========================================================================

// El dato de otra version lleva un texto que SI existe hoy entre las alternativas de
// esa pregunta. Con uno inventado la prueba no diria nada: el texto no coincidiria
// con ninguna alternativa y la pregunta quedaria sin responder por el otro motivo,
// asi que quitar la comprobacion de version no cambiaria el resultado y el guardian
// daria verde sobre un sitio que lee datos de versiones que no entiende.
const textoDeHoy = consultar(
  `SELECT texto FROM alternativa WHERE pregunta_id = ${P1} ORDER BY orden LIMIT 1;`
)?.[0]?.texto;

if (typeof textoDeHoy !== 'string') {
  noSePudo(`No pude leer el texto de una alternativa de la pregunta ${P1} en la base local.`);
}

const discoRaro = discoNuevo('raro');
writeFileSync(
  discoRaro,
  JSON.stringify({
    [claveDe(MODULO)]: JSON.stringify({ v: 99, modulo: MODULO, respuestas: { [P1]: textoDeHoy } }),
    [claveDe(OTRO_MODULO)]: '{esto no es json',
  })
);

const v6 = visitar({
  disco: discoRaro,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'elegir', modulo: OTRO_MODULO },
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
  ],
});

if (v6.errores.length > 0) {
  problemas.push('un dato guardado de otra version o corrupto hizo fallar la pagina');
}
if (v6.pasos[0].barras.respondidas !== '0') {
  problemas.push(
    `un dato guardado con version desconocida se leyo igual: el modulo ${MODULO} arranco con ` +
      `${v6.pasos[0].barras.respondidas} respondidas`
  );
}
if (v6.pasos[1].barras.respondidas !== '0') {
  problemas.push(
    `un dato guardado corrupto se leyo igual: el modulo ${OTRO_MODULO} arranco con ` +
      `${v6.pasos[1].barras.respondidas} respondidas`
  );
}
if (!v6.pasos[0].avisoAlmacenamiento.oculto) {
  problemas.push('un dato de otra version saco un aviso: se ignora en silencio y se sigue');
}

const trasEscribirEncima = leerDisco(discoRaro);
const reescrito = trasEscribirEncima[claveDe(MODULO)] ? JSON.parse(trasEscribirEncima[claveDe(MODULO)]) : null;

if (reescrito?.v !== 1) {
  problemas.push('tras ignorar un dato viejo, la respuesta nueva no quedo con el formato vigente');
}
if (Object.keys(reescrito?.respuestas ?? {}).length !== 1) {
  problemas.push('tras ignorar un dato viejo, la respuesta nueva no reemplazo lo que habia');
}

notas.push(
  'Formato: un dato con version 99 y otro que no es JSON se ignoran sin aviso ni error, y la ' +
    'siguiente respuesta los reemplaza con la version 1.'
);

// ===========================================================================
// 6 · El banco cambia (interceptando la respuesta, decision 12)
// ===========================================================================

/** Deja un disco con UNA respuesta conocida del modulo, y devuelve su texto. */
function discoConUnaRespuesta(nombre, acertando) {
  const suyo = discoNuevo(nombre);

  const visita = visitar({
    disco: suyo,
    pasos: [
      { tipo: 'elegir', modulo: MODULO },
      { tipo: 'responder', cuales: [{ pregunta: P1, acertando }] },
    ],
  });

  const crudo = leerDisco(suyo)[claveDe(MODULO)];

  if (crudo === undefined) {
    problemas.push(
      'responder no dejo nada guardado, asi que ninguno de los casos de «el banco cambia» se ' +
        'puede provocar: no hay ninguna respuesta guardada que corregir'
    );
    veredictoRoto();
  }

  const guardado = JSON.parse(crudo);
  const texto = guardado.respuestas?.[P1];

  if (typeof texto !== 'string') {
    problemas.push(
      `lo guardado del modulo ${MODULO} no trae el texto de la pregunta ${P1}: ${crudo.slice(0, 120)}`
    );
    veredictoRoto();
  }

  return { disco: suyo, texto, visita };
}

// --- 6a · La correcta cambio: el veredicto sale del banco nuevo --------------
//
// El estudiante habia ACERTADO. Se mueve la correcta a otra alternativa, con ids
// nuevos como hace banco:actualizar. Su respuesta sigue siendo la misma, pero ya
// no es la correcta: tiene que pasar a incorrecta.
const acertada = discoConUnaRespuesta('correcta-movida', true);

if (acertada.visita.final.barras.correctas !== '1') {
  problemas.push('la respuesta de partida no quedo como acierto, y el caso se prueba sobre eso');
}

const v7 = visitar({
  disco: acertada.disco,
  intercepcion: { tipo: 'correcta-movida', pregunta: P1 },
  pasos: [{ tipo: 'elegir', modulo: MODULO }],
});

if (v7.final.barras.respondidas !== '1') {
  problemas.push(
    `tras mover la correcta, la pregunta ${P1} dejo de contar como respondida: el texto elegido ` +
      'sigue existiendo, asi que la respuesta se conserva'
  );
}
if (v7.final.barras.correctas !== '0' || v7.final.barras.incorrectas !== '1') {
  problemas.push(
    `tras mover la correcta en el banco, las barras siguen diciendo ${v7.final.barras.correctas} ` +
      'correctas: el veredicto se guardo en vez de recalcularse, y el sitio esta felicitando al ' +
      'estudiante por una respuesta que ya no es la correcta'
  );
}

const marcada = v7.final.respondidas.find((r) => r.id === P1);
if (marcada && marcada.estado !== 'wrong') {
  problemas.push(
    `tras mover la correcta, la alternativa elegida quedo dibujada como «${marcada.estado}»`
  );
}

notas.push(
  `Correccion del banco: con la correcta movida de alternativa y los ids de las cuatro ` +
    `renovados, la pregunta ${P1} paso de acierto a fallo. El veredicto salio del banco nuevo.`
);

// --- 6b · Solo cambian los ids: la respuesta se restaura igual ---------------
//
// Es el caso corriente: el autor corrige una coma del enunciado y las cuatro
// alternativas cambian de id sin cambiar de texto. Si la memoria estuviera anclada
// en el id, aqui se perderia TODO lo respondido de esa pregunta.
const v8 = visitar({
  disco: acertada.disco,
  intercepcion: { tipo: 'ids-nuevos' },
  pasos: [{ tipo: 'elegir', modulo: MODULO }],
});

if (v8.final.barras.respondidas !== '1') {
  problemas.push(
    'con los ids de las alternativas renovados y los textos intactos, la respuesta se perdio: ' +
      'la memoria esta anclada en el id de la alternativa y no en su texto'
  );
}
const marcadaConIdsNuevos = v8.final.respondidas.find((r) => r.id === P1)?.elegida;

if (marcadaConIdsNuevos !== esc(acertada.texto)) {
  problemas.push(
    `con los ids renovados, la alternativa marcada no es la que se eligio:\n      se eligio: ` +
      `«${esc(acertada.texto)}»\n      se dibujo: «${marcadaConIdsNuevos}»`
  );
}
if (v8.final.barras.correctas !== '1') {
  problemas.push('con los ids renovados, la respuesta acertada dejo de contar como acierto');
}

notas.push('Ids de alternativa renovados sin tocar los textos: la respuesta se restauro igual.');

// --- 6c · El texto cambio: la pregunta vuelve a estar sin responder ----------
const v9 = visitar({
  disco: acertada.disco,
  intercepcion: { tipo: 'texto-cambiado', pregunta: P1, texto: acertada.texto },
  pasos: [{ tipo: 'elegir', modulo: MODULO }],
});

if (v9.final.barras.respondidas !== '0') {
  problemas.push(
    `tras corregir el texto de la alternativa elegida, la pregunta ${P1} sigue contando como ` +
      `respondida (${v9.final.barras.respondidas}): estaria colgando de un texto que ya no existe`
  );
}
if (v9.final.barras.correctas !== '0' || v9.final.barras.incorrectas !== '0') {
  problemas.push('tras corregir el texto elegido, alguna barra sigue contando esa respuesta');
}
if (v9.final.respondidas.length !== 0) {
  problemas.push('tras corregir el texto elegido, la pregunta quedo dibujada como respondida igual');
}

notas.push(
  'Correccion de texto en la alternativa elegida: la pregunta volvio a quedar sin responder y ' +
    'ninguna barra la cuenta. Se pierde una respuesta; no se afirma nada falso.'
);

// --- 6d · Una pregunta retirada deja de contar -------------------------------
const v10 = visitar({
  disco: acertada.disco,
  intercepcion: { tipo: 'retirada', pregunta: P1, modulo: MODULO },
  pasos: [{ tipo: 'elegir', modulo: MODULO }],
});

if (v10.errores.length > 0) {
  problemas.push('una pregunta respondida y luego retirada hizo fallar la pagina');
}
if (v10.final.dibujadas.includes(P1)) {
  problemas.push(`la pregunta retirada ${P1} se dibujo igual`);
}
if (v10.final.barras.respondidas !== '0') {
  problemas.push(
    `una pregunta retirada sigue contando como respondida: el panel dice ${v10.final.barras.respondidas}`
  );
}
if (filaDe(v10.final, MODULO)?.cifra !== `0/${cuantasTiene(MODULO) - 1}`) {
  problemas.push(
    `tras retirar una pregunta respondida, la fila del modulo ${MODULO} dice ` +
      `«${filaDe(v10.final, MODULO)?.cifra}» y tenia que decir «0/${cuantasTiene(MODULO) - 1}»`
  );
}

notas.push(
  `Pregunta retirada: dejo de dibujarse, dejo de contar en las barras y la fila del indice bajo ` +
    `a 0/${cuantasTiene(MODULO) - 1}, sin ningun error.`
);

// ===========================================================================
// 7 · El indice
// ===========================================================================

// --- 7a · Exacto en los siete modulos SIN abrirlos ---------------------------
//
// El modulo que se abre es OTRO. La fila del modulo con la pregunta retirada tiene
// que estar al dia igual, porque se cuenta contra los ids del resumen y no contra
// lo que se haya dibujado.
const v11 = visitar({
  disco: acertada.disco,
  intercepcion: { tipo: 'retirada', pregunta: P1, modulo: MODULO },
  pasos: [{ tipo: 'elegir', modulo: OTRO_MODULO }],
});

const filaCerrada = filaDe(v11.final, MODULO);

if (filaCerrada?.cifra !== `0/${cuantasTiene(MODULO) - 1}`) {
  problemas.push(
    `con el modulo ${MODULO} cerrado y una de sus preguntas respondidas retirada, su fila dice ` +
      `«${filaCerrada?.cifra}» en vez de «0/${cuantasTiene(MODULO) - 1}»: el indice esta contando ` +
      'avance sobre preguntas que el banco ya no tiene'
  );
}

// --- 7b · Cada fila dice respondidas sobre total, y su etiqueta tambien -------
const filaAbierta = filaDe(v3.final, MODULO);
const filaDelOtro = filaDe(v3.final, OTRO_MODULO);

if (filaAbierta?.cifra !== `2/${cuantasTiene(MODULO)}`) {
  problemas.push(
    `la fila del modulo abierto dice «${filaAbierta?.cifra}» y tenia que decir ` +
      `«2/${cuantasTiene(MODULO)}»`
  );
}
if (filaDelOtro?.cifra !== `2/${cuantasTiene(OTRO_MODULO)}`) {
  problemas.push(
    `la fila de un modulo cerrado con avance dice «${filaDelOtro?.cifra}» y tenia que decir ` +
      `«2/${cuantasTiene(OTRO_MODULO)}»`
  );
}
if (!filaAbierta?.etiqueta.includes(`2 de ${cuantasTiene(MODULO)} preguntas respondidas`)) {
  problemas.push(
    `el nombre accesible de la fila no dice el avance: «${filaAbierta?.etiqueta}». Bajo lg el ` +
      'titulo se esconde y «2 barra 61» no significa nada leido en voz alta'
  );
}
if (!filaAbierta?.etiqueta.startsWith(`Módulo ${MODULO}:`)) {
  problemas.push(`el nombre accesible de la fila perdio el modulo: «${filaAbierta?.etiqueta}»`);
}

notas.push(
  `Indice: cada fila dice respondidas/total —«${filaAbierta?.cifra}» el abierto, ` +
    `«${filaDelOtro?.cifra}» uno cerrado— y su nombre accesible lo dice entero.`
);

// --- 7c · Sin ids con que filtrar, no hay avance ni cifras sin filtrar --------
const v12 = visitar({
  disco: acertada.disco,
  intercepcion: { tipo: 'resumen-sin-ids' },
  pasos: [],
});

const filaSinIds = filaDe(v12.final, MODULO);

if (filaSinIds?.cifra?.includes('/')) {
  problemas.push(
    `sin ids en el resumen, la fila del modulo ${MODULO} muestra avance igual: ` +
      `«${filaSinIds.cifra}». Es una cifra que el banco no sostiene`
  );
}
if (filaSinIds?.cifra !== String(cuantasTiene(MODULO))) {
  problemas.push(
    `sin ids en el resumen la fila tenia que quedarse con el total a secas y dice ` +
      `«${filaSinIds?.cifra}»`
  );
}

// Y sin resumen NI instantanea: ni cifra, ni avance. Se prueba importando el sitio
// desde una copia a la que le falta la instantanea, que es la unica forma honesta
// de provocarlo sin tocar el repositorio.
const sitioSinInstantanea = join(taller, 'sitio-pelado');
cpSync(SITIO, sitioSinInstantanea, { recursive: true });
rmSync(join(sitioSinInstantanea, 'data', 'instantanea-banco.js'));

const v13 = visitar({
  disco: acertada.disco,
  sitio: sitioSinInstantanea,
  caerLaRed: true,
  pasos: [],
});

const filaAOscuras = filaDe(v13.final, MODULO);

if (filaAOscuras === undefined) {
  problemas.push('sin resumen ni instantanea el indice no se dibujo: la pagina se quedo sin control');
}
if (filaAOscuras?.cifra !== '') {
  problemas.push(
    `sin resumen ni instantanea la fila del modulo ${MODULO} muestra «${filaAOscuras?.cifra}»: ` +
      'no hay dato del que pueda salir'
  );
}

notas.push(
  'Sin ids: la fila se queda con el total a secas. Sin resumen ni instantanea: sin cifra y sin ' +
    'avance, pero con las siete filas dibujadas y utilizables.'
);

// --- 7d · Lo dibujado manda tambien para el avance ---------------------------
//
// El resumen cuenta una pregunta que el extremo del modulo no devuelve. Es lo que
// pasaria si `validarPreguntas()` descartara una fila. La fila del modulo abierto
// tiene que contar sobre lo dibujado, y avisarSiElResumenNoCuadra() tiene que
// decirlo por consola en vez de dejar un descuadre sin explicacion.
const v14 = visitar({
  disco: acertada.disco,
  intercepcion: { tipo: 'descartada', pregunta: P1 },
  pasos: [{ tipo: 'elegir', modulo: MODULO }],
});

const filaDescuadrada = filaDe(v14.final, MODULO);

if (filaDescuadrada?.cifra !== `0/${cuantasTiene(MODULO) - 1}`) {
  problemas.push(
    `con una pregunta que el resumen cuenta y el extremo descarta, la fila del modulo abierto ` +
      `dice «${filaDescuadrada?.cifra}» en vez de contar sobre lo dibujado ` +
      `(«0/${cuantasTiene(MODULO) - 1}»)`
  );
}
if (!v14.avisos.some((a) => a.includes('Manda lo dibujado') && a.includes('preguntas'))) {
  problemas.push('el descuadre de cantidades no se informo por consola');
}
if (!v14.avisos.some((a) => a.includes('respuestas guardadas'))) {
  problemas.push(
    'el descuadre del AVANCE no se informo por consola: el indice contaba una respuesta que no ' +
      'se dibujo y nadie dijo por que'
  );
}

notas.push(
  `Lo dibujado manda: con una pregunta descartada por el extremo, la fila conto ` +
    `${filaDescuadrada?.cifra} y la consola lo dijo dos veces, por la cantidad y por el avance.`
);

// ===========================================================================
// 8 · El avance no sale del dispositivo
// ===========================================================================

const todasLasVisitas = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v14];
const rutasVistas = new Set();

for (const visita of todasLasVisitas) {
  for (const peticion of visita.peticiones) {
    rutasVistas.add(peticion.ruta);

    if (peticion.cuerpo !== null) {
      problemas.push(`una peticion llevaba cuerpo: ${peticion.ruta}`);
    }
    if (!/^\/api\/(preguntas|estado)(\?(modulo=\d+&?)?(resumen=1)?)?$/.test(peticion.ruta)) {
      problemas.push(
        `una peticion no tiene la forma de las dos que el sitio hace: «${peticion.ruta}». El ` +
          'avance no puede viajar a ninguna parte'
      );
    }
  }
}

// Y que ningun texto guardado aparezca en ninguna ruta, que es la forma en que se
// escaparia sin cuerpo.
const textosGuardados = Object.values(leerDisco(disco))
  .flatMap((v) => Object.values(JSON.parse(v).respuestas ?? {}));

for (const ruta of rutasVistas) {
  for (const texto of textosGuardados) {
    if (ruta.includes(encodeURIComponent(texto.slice(0, 12))) || ruta.includes(texto.slice(0, 12))) {
      problemas.push(`una peticion llevaba una respuesta del estudiante en la ruta: «${ruta}»`);
    }
  }
}

notas.push(
  `El avance no viaja: en ${todasLasVisitas.length} visitas, las unicas rutas pedidas fueron ` +
    `${[...rutasVistas].sort().join(', ')}, todas sin cuerpo.`
);

// ===========================================================================
// Veredicto
// ===========================================================================

rmSync(taller, { recursive: true, force: true });

const resumenFinal = [
  `Servidor:  ${DIRECCION}`,
  `Banco:     ${totalDelBanco} preguntas activas en ${porModulo.length} modulos`,
  `Modulos:   ${MODULO} (${cuantasTiene(MODULO)} preguntas) y ${OTRO_MODULO} (${cuantasTiene(OTRO_MODULO)})`,
  `Visitas:   ${visitas} procesos, cada uno con la pagina abriendose de cero`,
  '',
  ...notas.map((n) => `· ${n}`),
];

if (problemas.length > 0) {
  anunciar('MEMORIA ROTA  ***  el avance esta mintiendo  ***', [
    ...problemas.map((p, i) => `${String(i + 1).padStart(2)}. ${p}`),
    '',
    ...resumenFinal,
  ]);
  terminar(ROTO);
}

if (!aEscala) {
  anunciar('NO A ESCALA  ***  ESTO NO ES UN APROBADO  ***', [
    `El banco local tiene ${totalDelBanco} preguntas, y el piso son ${PISO_DE_ESCALA}.`,
    '',
    'Todo dio verde, pero con un banco de juguete eso no dice nada del banco real.',
    'Carga el banco con `npm run datos:banco-local` y vuelve a correrlo.',
  ]);
  terminar(NO_A_ESCALA);
}

anunciar('MEMORIA CORRECTA', [
  'El avance se guarda al responder, sobrevive a que la pagina se abra de cero, no se',
  'pisa entre modulos, se borra solo el que se pide, y NUNCA afirma algo que el banco',
  'ya no sostiene: el veredicto se recalcula contra lo que el extremo devuelve hoy.',
  '',
  ...resumenFinal,
  '',
  'Lo que esto NO prueba, y comprueba el autor en un navegador: que el navegador de',
  'verdad persista al recargar, que un almacen denegado de verdad lance como este',
  'almacen de mentira, y que lo guardado se vea donde se dice en DevTools.',
]);

terminar(CORRECTO);
