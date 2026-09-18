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
    // Lo que quedo en la tarjeta de una pregunta JUSTO al responderla o al desplegar
    // su porque. No se puede leer del retrato: responder() y desplegarElPorque()
    // escriben en los nodos de esa tarjeta, y el retrato mira el HTML que dejo
    // `pintar()` en el contenedor, que es de antes. Las dos cosas son verdad y hay
    // que mirarlas por separado.
    alResponder: [],
    alDesplegar: [],
    // Lo que paso al pulsar una alternativa del modulo ANTERIOR (iteracion 35).
    // No se puede leer del retrato: el retrato mira el HTML del contenedor, y lo
    // que hay que vigilar aqui es lo que NO se movio —el panel, el almacen y la
    // memoria de la visita— alrededor de un clic concreto.
    alPulsarLoViejo: [],
    // Lo que se anoto en el intento del simulacro, con si quedo guardado.
    anotadas: [],
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
      almacen = almacenDeMentira({
        escrituraProhibida: encargo.almacen === 'escritura-lanza',
        cupo: encargo.cupo ?? Infinity,
      });
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

      // Retraso POR MODULO (iteracion 35). Es lo que permite pulsar algo mientras
      // otro modulo todavia viaja: sin esto, la carga local termina en unos 30 ms
      // y no hay ventana en la que provocar nada. El resumen no se retrasa nunca,
      // porque no es lo que se esta midiendo.
      const cual = String(ruta).match(/modulo=(\d+)/);
      const espera =
        cual && !String(ruta).includes('resumen') ? encargo.retrasos?.[cual[1]] : undefined;

      if (espera) await new Promise((listo) => setTimeout(listo, espera));

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

    // --- La pagina del simulacro (iteracion 41, etapa C) ---------------------
    //
    // Se monta aqui y no en un guion aparte a proposito. Lo que hace falta para
    // probar el intento guardado es exactamente lo que este archivo ya tiene: un
    // proceso por visita, el almacen persistido a un archivo —que es lo unico que
    // convierte «otra visita» en una recarga de verdad—, `almacenDeMentira` con sus
    // tres formas de negarse, y la intercepcion del banco. Copiarlo a otro guion
    // dejaria dos orquestadores que se quedan callados el dia que divergen.
    if (encargo.pagina === 'simulacro') {
      const simulacro = await import(
        pathToFileURL(join(raizDelSitio, 'components', 'simulacro.js')).href
      );

      const intentoGuardado = await import(
        pathToFileURL(join(raizDelSitio, 'servicios', 'intento-guardado.js')).href
      );

      // Lo mismo que hace static/js/simulacro-main.js al abrir la pagina, y en el
      // mismo orden. Si esa lista creciera y esta no, la visita estaria probando una
      // pagina a medio conectar.
      simulacro.conectarComienzo();
      simulacro.retomarElIntento();

      // Un retrato ANTES de dar ningun paso: es lo que se ve al abrir, y es donde se
      // mira si un intento guardado se retomo solo.
      salida.pasos.push(retratoDelSimulacro(dom, { tipo: 'al-abrir' }, simulacro));

      for (const paso of encargo.pasos) {
        await darElPasoDelSimulacro(paso, dom, simulacro, intentoGuardado, salida, { almacen });
        salida.pasos.push(retratoDelSimulacro(dom, paso, simulacro));
      }

      console.warn = warnReal;

      salida.almacen =
        almacen && typeof almacen !== 'function' ? Object.fromEntries(almacen.datos) : {};

      if (almacen && typeof almacen !== 'function') {
        writeFileSync(encargo.disco, JSON.stringify(salida.almacen, null, 2));
      }

      salida.final = retratoDelSimulacro(dom, { tipo: 'final' }, simulacro);
      writeFileSync(encargo.salida, JSON.stringify(salida, null, 2));
      return;
    }

    const cuestionario = await import(
      pathToFileURL(join(raizDelSitio, 'components', 'cuestionario.js')).href
    );

    // La MISMA instancia de memoria.js que usa el componente: misma URL, mismo
    // modulo, no una copia. Sirve para mirar desde fuera la memoria de la visita,
    // que es lo unico de las dos memorias que no deja rastro ni en el HTML ni en
    // el archivo que hace de disco.
    const memoria = await import(
      pathToFileURL(join(raizDelSitio, 'servicios', 'memoria.js')).href
    );

    // Lo mismo que hace static/js/cuestionario-main.js al abrir la pagina, y en el
    // mismo orden. Si algun dia esa lista creciera y esta no, la visita estaria
    // probando una pagina a medio conectar.
    await cuestionario.renderCuestionario();
    cuestionario.setupReinicio();
    cuestionario.setupRepaso();

    // --- Los pasos ------------------------------------------------------------
    for (const paso of encargo.pasos) {
      await darElPaso(paso, dom, cuestionario, salida, { almacen, memoria });
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

  // Una pregunta activa SIN justificacion. Hoy no existe ninguna —368 de 368 la
  // traen— pero puede existir: la columna es nula en el esquema
  // (d1/migraciones/001-banco-de-preguntas.sql) y quien vigila que ninguna activa se
  // quede sin ella es d1/verificar-banco.sql, no la validacion por fila del camino de
  // lectura. Se provocan las tres formas de «no hay texto» a la vez, porque las tres
  // llegan igual al navegador y una sola comprobacion tiene que cubrirlas.
  if (plan.tipo === 'sin-justificacion') {
    const vacias = { nula: null, ausente: undefined, espacios: '   ' };

    return {
      ...cuerpo,
      datos: cuerpo.datos.map((p) => {
        const como = plan.preguntas?.[p.id];
        if (como === undefined) return p;

        const { justificacion, ...sinElCampo } = p;
        return como === 'ausente' ? sinElCampo : { ...p, justificacion: vacias[como] };
      }),
    };
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

/**
 * Fabrica el boton de una alternativa dibujada y su tarjeta, como haria el HTML.
 *
 * Sale de aqui y no esta escrito dos veces porque lo usan dos pasos: `responder`,
 * que pulsa lo que esta a la vista, y `pulsar-lo-viejo`, que guarda la referencia
 * para pulsarla cuando ya NO lo esta. Si cada uno fabricara el suyo, el dia que
 * cambiara lo que `responder()` necesita leer del boton, uno de los dos se
 * quedaria atras y su prueba pasaria en verde sin tocar el codigo de verdad.
 *
 * `sufijo` separa los nodos del DOM falso: los del clic viejo no pueden ser los
 * mismos que los del modulo dibujado, o compartirian identidad y el clic «viejo»
 * estaria pulsando la tarjeta nueva.
 */
function fabricarAlternativa(dom, pregunta, elegida, sufijo = '') {
  const tarjeta = dom.nodo(`#tarjeta${sufijo}-q${pregunta}`);
  tarjeta.dataset.pregunta = `q${pregunta}`;

  const boton = dom.nodo(`#alternativa${sufijo}-${elegida.id}`);
  boton.disabled = false;
  boton.dataset.correct = String(elegida.correcta);
  boton.dataset.alternativa = String(elegida.id);
  boton.closest = (selector) => (selector === '[data-pregunta]' ? tarjeta : boton);

  return { tarjeta, boton };
}

/** Ejecuta un paso del encargo sobre el componente real. */
async function darElPaso(paso, dom, cuestionario, salida, { almacen, memoria } = {}) {
  // ------------------------------------------------------------------------
  // Pulsar una alternativa del modulo ANTERIOR (iteracion 35)
  //
  // Es la premisa de la iteracion 34 puesta a prueba en vez de razonada: al
  // cambiar de modulo, `mostrarModulo()` pone `bancoCargado` en null y reescribe
  // el contenedor, asi que no queda ninguna alternativa anterior que pulsar. Aqui
  // se guarda una referencia ANTES de cambiar y se pulsa despues, en los dos
  // momentos en que el estudiante podria llegar a hacerlo:
  //
  //   1 · MIENTRAS el modulo nuevo viaja. En el navegador ese boton ya esta
  //       desprendido del arbol y el clic ni siquiera llegaria al oyente del
  //       contenedor; aqui se fuerza a que llegue, que es MAS exigente.
  //   2 · Con el modulo nuevo YA dibujado. Ahi el boton sigue siendo de una
  //       pregunta que no es de este modulo, y es la otra mitad del criterio:
  //       ninguna respuesta se guarda en un modulo que no es el que la muestra.
  //
  // UN SOLO CAMINO, Y SE DICE: `conectarCuestionario()` delega en `#cuestionario`
  // y las alternativas se dibujan como `<button>` pelados, sin oyente propio (ver
  // `dibujarAlternativa()`). Asi que «pulsar la referencia vieja» y «pasar por el
  // oyente delegado» son lo mismo, y se dispara una vez por momento.
  // ------------------------------------------------------------------------
  if (paso.tipo === 'pulsar-lo-viejo') {
    const bloque = bloqueDePregunta(dom.html('#cuestionario'), paso.pregunta);
    const alternativas = alternativasDelBloque(bloque);
    const elegida = alternativas.find((a) => (paso.acertando ? a.correcta : !a.correcta));

    if (!elegida) {
      salida.errores.push(
        `no encontre una alternativa dibujada en la pregunta ${paso.pregunta} para guardarla ` +
          'como referencia vieja'
      );
      return;
    }

    // La referencia se toma AHORA, con el modulo viejo todavia a la vista.
    const { boton } = fabricarAlternativa(dom, paso.pregunta, elegida, '-vieja');

    const pulsar = () =>
      dom.disparar('#cuestionario', 'click', {
        target: { closest: (s) => (s === '.quiz-option' ? boton : null) },
      });

    const foto = (cuando, oyentes = null) => ({
      cuando,
      oyentes,
      panel: {
        respondidas: dom.texto('#valor-avance'),
        correctas: dom.texto('#valor-correctas'),
        incorrectas: dom.texto('#valor-incorrectas'),
        total: dom.texto('#total-preguntas'),
      },
      // El almacen entero, no solo la clave del modulo: el criterio dice «ninguna
      // clave», y mirar solo una no veria la respuesta que se cuela en la de al lado.
      almacen: almacen?.datos ? Object.fromEntries(almacen.datos) : null,
      enLaVisitaVieja: [...memoria.respondidasEnLaVisita(paso.moduloViejo)].sort(),
      enLaVisitaNueva: [...memoria.respondidasEnLaVisita(paso.modulo)].sort(),
    });

    // 1 · Se pide el otro modulo y NO se espera: lo que hay que provocar ocurre
    //     mientras viaja.
    dom.disparar('#indice-modulos', 'click', {
      target: {
        closest: (s) => (s === '[data-modulo]' ? { dataset: { modulo: String(paso.modulo) } } : null),
      },
    });

    await new Promise((listo) => setTimeout(listo, paso.durante ?? 600));

    salida.alPulsarLoViejo.push(foto('antes, con el modulo nuevo todavia cargando'));
    salida.alPulsarLoViejo.push(
      foto('despues, con el modulo nuevo todavia cargando', pulsar())
    );

    // 2 · Y otra vez con el modulo nuevo ya dibujado.
    await new Promise((listo) => setTimeout(listo, paso.espera ?? 3500));

    salida.alPulsarLoViejo.push(foto('antes, con el modulo nuevo ya dibujado'));
    salida.alPulsarLoViejo.push(foto('despues, con el modulo nuevo ya dibujado', pulsar()));
    return;
  }

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
      const { boton } = fabricarAlternativa(dom, encargo.pregunta, elegida);

      dom.disparar('#cuestionario', 'click', {
        target: { closest: (s) => (s === '.quiz-option' ? boton : null) },
      });

      salida.alResponder.push({
        pregunta: encargo.pregunta,
        acertando: Boolean(encargo.acertando),
        veredicto: dom.html(`#tarjeta-q${encargo.pregunta} > .quiz-feedback`),
        // Las alternativas que `responder()` deshabilito. Es el nodo real que toca
        // —el que sale de `$$('.quiz-option', item)`—, no el boton fabricado.
        bloqueada: dom.nodo(`#tarjeta-q${encargo.pregunta} >> .quiz-option`).disabled,
        ...enLaTarjeta(dom, encargo.pregunta),
      });
    }
    return;
  }

  // «Ver por qué» de una pregunta restaurada. El boton se fabrica igual que la
  // alternativa de mas arriba y por el mismo motivo: `desplegarElPorque()` recorre
  // hacia arriba buscando la tarjeta, y con un objeto pelado se cae en la primera
  // linea.
  if (paso.tipo === 'ver-porque') {
    const tarjeta = dom.nodo(`#tarjeta-q${paso.pregunta}`);
    tarjeta.dataset.pregunta = `q${paso.pregunta}`;

    const boton = dom.nodo(`#ver-porque-${paso.pregunta}`);
    boton.closest = (selector) => (selector === '[data-pregunta]' ? tarjeta : boton);

    const corrieron = dom.disparar('#cuestionario', 'click', {
      target: { closest: (s) => (s === '.quiz-ver-porque' ? boton : null) },
    });

    if (corrieron === 0) {
      salida.errores.push('el contenedor de preguntas no tiene ningun oyente de clic');
    }

    salida.alDesplegar.push({
      pregunta: paso.pregunta,
      botonOculto: boton.classList.contains('hidden'),
      focoEn: dom.enfocado(),
      ...enLaTarjeta(dom, paso.pregunta),
    });
    return;
  }

  // El boton del repaso, en cualquiera de sus dos papeles. Se dispara el MISMO
  // elemento en los dos casos, porque el sitio tiene un solo boton: si algun dia
  // fueran dos, este paso dejaria de poder salir del repaso y se veria enseguida.
  if (paso.tipo === 'repaso') {
    const corrieron = dom.disparar('#repaso', 'click', {});
    if (corrieron === 0) salida.errores.push('el boton del repaso no tiene ningun oyente');
    return;
  }

  if (paso.tipo === 'reiniciar') {
    dom.disparar('#reiniciar', 'click', {});
    return;
  }

  salida.errores.push(`no conozco el paso «${paso.tipo}»`);
}

/**
 * Que se escribio en el recuadro del porque de una tarjeta.
 *
 * Solo el contenido. Si el recuadro quedo visible u oculto NO se puede saber por
 * aca: el DOM falso arranca cada nodo sin clases, asi que un `classList.remove`
 * —que es lo que hacen los dos caminos que despliegan— no deja rastro. Lo que se
 * DIBUJO abierto o cerrado se lee del HTML del contenedor, en el retrato.
 */
function enLaTarjeta(dom, pregunta) {
  return { justificacion: dom.html(`#tarjeta-q${pregunta} > .quiz-justificacion`) };
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

/**
 * Como quedo DIBUJADO el porque de una pregunta.
 *
 * Tres estados que hay que poder distinguir, y el cuarto es que no haya nada:
 *
 *   recuadro   si existe el contenedor del porque
 *   abierto    si se dibujo desplegado (respondida en esta visita)
 *   boton      si se dibujo el control «Ver por qué» (restaurada de otra visita)
 *   texto      lo que dice, ya escapado, o '' si el recuadro vino vacio
 */
function porqueDelBloque(bloque) {
  const recuadro = bloque.match(
    /<div id="justificacion-q\d+"[^>]*class="quiz-justificacion(?<oculto> hidden)?[^"]*"[^>]*>(?<dentro>[\s\S]*?)<\/div>/
  );

  return {
    recuadro: Boolean(recuadro),
    abierto: Boolean(recuadro) && recuadro.groups.oculto === undefined,
    boton: /class="quiz-ver-porque/.test(bloque),
    texto: recuadro?.groups.dentro.match(/<p class="mt-1\.5[^"]*">([\s\S]*?)<\/p>/)?.[1] ?? '',
  };
}

/** Foto de lo que la pagina esta diciendo ahora mismo. */
function retrato(dom, paso) {
  const html = dom.html('#cuestionario');

  const respondidas = [...html.matchAll(/data-pregunta="q(\d+)" data-answered="true"/g)].map((m) => {
    const id = Number(m[1]);
    const elegida = alternativasDelBloque(bloqueDePregunta(html, id)).find((a) => a.elegida);
    return { id, elegida: elegida?.texto ?? null, estado: elegida?.estado ?? null };
  });

  const porques = Object.fromEntries(
    [...html.matchAll(/data-pregunta="q(\d+)"/g)].map((m) => [
      Number(m[1]),
      porqueDelBloque(bloqueDePregunta(html, Number(m[1]))),
    ])
  );

  // La cifra que la cabecera del modulo lleva a la derecha. En el repaso tiene que
  // seguir siendo la del MODULO: es la cabecera del modulo, y un numero mas chico
  // ahi seria un tercer contador contradiciendo a los otros dos.
  // Se ancla a las clases COMPLETAS de ese span: el numero de cada pregunta usa
  // tambien `text-mutedink shrink-0`, y un patron mas corto leeria «01» creyendo que
  // lee la cuenta del modulo.
  const cabecera = Number(
    html.match(/ml-auto font-mono text-\[11px\] text-mutedink shrink-0">(\d+)</)?.[1] ?? NaN
  );

  return {
    paso,
    porques,
    cabecera,
    // El tamano del HTML del contenedor, para poder afirmar que NO se reescribio.
    // Es lo unico que distingue «la pregunta sigue dibujada» de «la pregunta sigue
    // dibujada porque nadie volvio a dibujar»: sin esto, el criterio de que una
    // acertada siga a la vista se cumpliria solo, por omision.
    largoDelHtml: html.length,
    /** Si el estado vacio sigue ofreciendo su enlace al indice de modulos. */
    traeEnlaceAlIndice: html.includes('data-ir-al-indice'),
    /** Lo que dice el panel en palabras. Sirve para comprobar que NO dice otra cosa. */
    mensajeDelPanel: dom.texto('#mensaje-avance'),
    repaso: {
      boton: dom.texto('#repaso-rotulo'),
      contador: dom.html('#contador-banco'),
      // El mensaje se lee del HTML de la ZONA DE PREGUNTAS, que es donde la
      // decision 11 lo manda. Leerlo de un nodo suelto no distinguiria «esta en la
      // zona de preguntas» de «esta en el panel», que es justo lo que hay que
      // distinguir.
      aviso: html.match(/<p id="aviso-repaso"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '',
      // Y donde quedo respecto de la cabecera del modulo.
      avisoTrasLaCabecera:
        html.includes('id="aviso-repaso"') &&
        html.indexOf('</header>') < html.indexOf('id="aviso-repaso"') &&
        html.indexOf('id="aviso-repaso"') < html.indexOf('<ul class="mt-3'),
      // `responder()` no repinta, asi que retira el mensaje escondiendo su nodo.
      // Es lo unico que se puede mirar en ese camino.
      avisoOculto: dom.oculto('#aviso-repaso'),
      focoEnElAviso: dom.enfocado() === '#aviso-repaso',
    },
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

/**
 * Lo que se ve de la pagina del simulacro despues de un paso.
 *
 * Se mira **lo que el componente dibujo**, como en el resto de este archivo, y ademas
 * dos cosas que no estan en el HTML y que son justo las que hay que vigilar aqui: los
 * ids del intento en curso y cual era la correcta de cada pregunta. No estan
 * dibujadas porque la decision 11 prohibe dibujar texto del banco, asi que se piden
 * al componente —`preguntasDelIntento()` existe para esto—.
 */
function retratoDelSimulacro(dom, paso, simulacro) {
  const zona = dom.html('#zona-del-intento');
  const preguntas = simulacro.preguntasDelIntento();

  const correctaDe = (pregunta) =>
    pregunta.alternativas.find((a) => a.es_correcta === 1) ?? null;

  return {
    paso,
    // El titulo del recuadro: «Intento listo», «Intento retomado» o «No se pudo…».
    titulo: zona.match(/font-display font-bold text-xl text-paper">([^<]*)</)?.[1] ?? '',
    cuentasPorModulo: [...zona.matchAll(/text-jsyellow">(\d+)</g)].map((m) => Number(m[1])),
    tieneBoton: zona.includes('id="comenzar-simulacro"'),
    rotuloDelBoton: (
      zona.match(/id="comenzar-simulacro"[^>]*>([\s\S]*?)<\/button>/)?.[1] ?? ''
    )
      .replace(/<[^>]*>/g, '')
      .trim(),
    largoDelHtml: zona.length,
    enfocado: dom.enfocado(),
    // El intento que el componente tiene entre manos, en su orden.
    idsDelIntento: preguntas.map((p) => p.id),
    modulosDelIntento: preguntas.map((p) => p.modulo),
    // Con que se va a corregir: el id y el texto de la correcta de cada pregunta,
    // sacados de la copia que el componente tiene, no del banco. Es lo que delata que
    // alguien volvio a pedirle las preguntas al banco al retomar.
    correctasDelIntento: preguntas.map((p) => correctaDe(p)?.id ?? null),
    textosCorrectos: preguntas.map((p) => correctaDe(p)?.texto ?? null),
    avisoGuardado: {
      oculto: dom.oculto('#aviso-guardado'),
      html: dom.html('#aviso-guardado'),
    },
    avisoRespaldo: { oculto: dom.oculto('#aviso-respaldo') },
  };
}

/** Ejecuta un paso del encargo sobre la pagina del simulacro. */
async function darElPasoDelSimulacro(paso, dom, simulacro, intentoGuardado, salida, { almacen }) {
  // Pulsar «Comenzar el simulacro» o «Empezar otro intento». Se dispara el evento
  // sobre la zona, que es donde el componente puso su oyente, en vez de llamar a la
  // funcion: asi se prueba el camino que recorre el estudiante, botones nuevos
  // incluidos.
  if (paso.tipo === 'comenzar') {
    dom.disparar('#zona-del-intento', 'click', {
      target: { closest: (s) => (s === '#comenzar-simulacro' ? {} : null) },
    });

    // El oyente no es `async`, asi que hay que esperar a que la carga termine. El
    // piso de la transicion son 400 ms y la carga local unos 300: 1500 es holgado sin
    // ser una espera ciega larga.
    await new Promise((listo) => setTimeout(listo, paso.espera ?? 1500));
    return;
  }

  // Responder las siguientes N preguntas del intento, por la costura que la
  // iteracion 43 va a usar. Se elige SIEMPRE la alternativa que esta en la posicion
  // `paso.alternativa` (0 por defecto) de la copia congelada, para que lo anotado sea
  // predecible y se pueda comparar despues.
  if (paso.tipo === 'responder') {
    const preguntas = simulacro.preguntasDelIntento();
    const desde = paso.desde ?? 0;

    for (let i = 0; i < paso.cuantas; i += 1) {
      const pregunta = preguntas[desde + i];
      if (!pregunta) break;

      const cual = paso.alternativa ?? 0;
      const alternativa = pregunta.alternativas[cual] ?? pregunta.alternativas[0];
      const omitida = paso.omitir === true;

      const pudo = simulacro.anotarEnElIntento({
        pregunta_id: pregunta.id,
        alternativa_id: omitida ? null : alternativa.id,
        estado: omitida ? 'omitida' : 'respondida',
        agotada: Boolean(paso.agotada),
        resuelta_en: 1789000000000 + (desde + i) * 30000,
      });

      salida.anotadas.push({
        pregunta_id: pregunta.id,
        alternativa_id: omitida ? null : alternativa.id,
        guardada: pudo,
      });
    }

    return;
  }

  // El almacen se llena a mitad del intento. No es una bandera de arranque: el
  // estudiante empezo con sitio y se quedo sin el (decision 7).
  if (paso.tipo === 'llenar-el-almacen') {
    if (almacen && typeof almacen !== 'function') almacen.prohibirEscritura();
    return;
  }

  // Lo que el servicio de guardado devuelve al leer, sin pasar por la pantalla. Es la
  // otra mitad del criterio del dato corrupto: la pantalla no se rompe Y la lectura
  // dice que no hay nada que entender.
  if (paso.tipo === 'mirar-lo-guardado') {
    salida.loGuardado = intentoGuardado.leerIntentoGuardado();
    salida.estadoDelGuardado = intentoGuardado.estadoDelGuardado();
    return;
  }

  throw new Error(`paso del simulacro desconocido: ${paso.tipo}`);
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

/**
 * La justificacion de cada pregunta del modulo de prueba, tal como esta en la base.
 *
 * Se lee de la base y no de lo dibujado: lo dibujado esta escapado, y comparar lo
 * escapado contra si mismo no comprueba nada. El texto original es el unico patron
 * honesto contra el que mirar el HTML.
 */
const justificaciones = new Map(
  (consultar(`SELECT id, justificacion FROM pregunta_activa WHERE modulo = ${MODULO};`) ?? []).map(
    (f) => [f.id, f.justificacion]
  )
);

// Sin este corte, una consulta que no devuelve nada dejaria comparando el HTML
// contra `esc(undefined)` —la cadena «undefined»— y la seccion entera pasaria sin
// haber mirado ninguna justificacion.
if ([P1, P2, P3].some((id) => typeof justificaciones.get(id) !== 'string')) {
  noSePudo(
    'La base local no devolvio las justificaciones del modulo de prueba.',
    `Modulo ${MODULO}, preguntas ${P1}, ${P2} y ${P3}.`
  );
}

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
function visitar({
  disco,
  almacen = 'normal',
  pasos = [],
  intercepcion = null,
  sitio = null,
  caerLaRed = false,
  // Cuanto tarda la respuesta de cada modulo, en ms (iteracion 35). Sin retraso,
  // la carga local dura unos 30 ms y no hay ventana en la que pulsar nada.
  retrasos = null,
  // Que pagina abre la visita: 'cuestionario' (lo de siempre) o 'simulacro'
  // (iteracion 41, etapa C). El almacen, el disco y la intercepcion son los mismos.
  pagina = 'cuestionario',
  // Cuantos bytes caben en el almacen. Sin esto, Infinity (iteracion 41, etapa C).
  cupo = null,
}) {
  visitas += 1;

  const encargo = join(taller, `encargo-${visitas}.json`);
  const salida = join(taller, `salida-${visitas}.json`);

  writeFileSync(
    encargo,
    JSON.stringify({ disco, almacen, pasos, intercepcion, sitio, salida, caerLaRed, retrasos, pagina, cupo })
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
// 8 · La justificacion (iteracion 34)
// ===========================================================================

/**
 * Una pregunta del modulo cuya justificacion TRAE caracteres que escapar.
 *
 * Sin ella, «la forma cruda no aparece» se cumpliria sola: un texto sin `<`, `>`,
 * `"`, `'` ni `&` sale del escapado identico, y buscarlo seria buscar el mismo
 * texto dos veces. Es el patron de H-023, y por eso se elige a proposito y se dice
 * cuando no hay ninguna.
 */
const PELIGROSA = preguntasDelModulo.find((id) => {
  const j = justificaciones.get(id);
  return typeof j === 'string' && esc(j) !== j;
});

const discoJustificacion = discoNuevo('justificacion');

const conJustificacion = [
  { pregunta: P1, acertando: true },
  { pregunta: P2, acertando: false },
  ...(PELIGROSA !== undefined && ![P1, P2].includes(PELIGROSA)
    ? [{ pregunta: PELIGROSA, acertando: true }]
    : []),
];

// --- Visita J1: responder bien y mal, y mirar lo que aparecio ---------------
const vj1 = visitar({
  disco: discoJustificacion,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: conJustificacion },
  ],
});

for (const anotado of vj1.alResponder) {
  const suya = justificaciones.get(anotado.pregunta);
  const comoSale = esc(suya);

  if (!anotado.justificacion.includes(comoSale)) {
    problemas.push(
      `al responder la pregunta ${anotado.pregunta} ${anotado.acertando ? 'bien' : 'mal'} no ` +
        'aparecio su justificacion'
    );
  }

  // La de OTRA pregunta no. Un recuadro que muestra el porque equivocado ensena una
  // regla falsa con la cara de quien sabe, que es lo que ADR-034 existe para impedir.
  for (const [otra, texto] of justificaciones) {
    if (otra === anotado.pregunta || typeof texto !== 'string' || texto === '') continue;
    if (anotado.justificacion.includes(esc(texto))) {
      problemas.push(
        `el recuadro de la pregunta ${anotado.pregunta} trae la justificacion de la ${otra}`
      );
    }
  }

  // Y el texto de la base NO puede aparecer crudo. Solo se exige donde el escapado
  // cambia algo: si no cambia nada, el crudo y el escapado son la misma cadena.
  if (comoSale !== suya && anotado.justificacion.includes(suya)) {
    problemas.push(
      `la justificacion de la pregunta ${anotado.pregunta} se inserto CRUDA al responder`
    );
  }
}

if (vj1.alResponder.length !== conJustificacion.length) {
  problemas.push(
    `se respondieron ${conJustificacion.length} preguntas y solo ${vj1.alResponder.length} dejaron rastro`
  );
}

// Las dos, la acertada y la fallada (decision 2). Explicar solo los errores le
// quitaria el porque a quien acerto por descarte.
for (const acertando of [true, false]) {
  const caso = vj1.alResponder.find((a) => a.acertando === acertando);
  if (!caso || caso.justificacion === '') {
    problemas.push(
      `respondiendo ${acertando ? 'bien' : 'mal'} no aparecio ninguna justificacion`
    );
  }
}

// --- Visita J2: la misma pregunta, restaurada de otra visita ----------------
//
// El proceso es nuevo, asi que la memoria de la visita esta vacia y lo unico que
// queda de J1 es lo guardado en el disco. Es exactamente el estudiante que vuelve
// al dia siguiente.
const vj2 = visitar({
  disco: discoJustificacion,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'ver-porque', pregunta: P1 },
  ],
});

const restaurada = vj2.final.porques?.[P1];

if (!restaurada?.boton) {
  problemas.push(`una pregunta restaurada no ofrece «Ver por qué»: ${JSON.stringify(restaurada)}`);
}
if (restaurada?.abierto) {
  problemas.push(
    'una pregunta restaurada trae la justificacion desplegada: la pagina se alargaria con ' +
      'cincuenta justificaciones que nadie pidio leer'
  );
}
if (restaurada?.texto !== '') {
  problemas.push('el recuadro de una pregunta restaurada viene con texto antes de pedirlo');
}

const desplegada = vj2.alDesplegar[0];
const textoDeP1 = justificaciones.get(P1);

if (!desplegada?.justificacion.includes(esc(textoDeP1))) {
  problemas.push('«Ver por qué» no desplego la justificacion de esa pregunta');
}
if (esc(textoDeP1) !== textoDeP1 && desplegada?.justificacion.includes(textoDeP1)) {
  problemas.push('«Ver por qué» inserto la justificacion CRUDA');
}
if (!desplegada?.botonOculto) {
  problemas.push('tras desplegar, «Ver por qué» sigue ofreciendo hacer lo que ya hizo');
}
if (desplegada?.focoEn === 'body') {
  problemas.push(
    'tras desplegar el porque el foco cayo al body: quien navega con teclado tiene que ' +
      'volver a tabular desde el principio de la pagina'
  );
}

// --- Visita J3: preguntas que llegan SIN justificacion ----------------------
//
// Las tres formas de no traerla, a la vez, porque las tres llegan igual al
// navegador: nula, ausente del objeto, y solo espacios.
const vj3 = visitar({
  disco: discoJustificacion,
  intercepcion: {
    tipo: 'sin-justificacion',
    preguntas: { [P1]: 'nula', [P2]: 'ausente', [P3]: 'espacios' },
  },
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P3, acertando: true }] },
  ],
});

for (const [id, como] of [[P1, 'nula'], [P2, 'ausente'], [P3, 'espacios']]) {
  const sinPorque = vj3.final.porques?.[id];

  if (sinPorque?.recuadro) {
    problemas.push(`la pregunta ${id} llego con la justificacion ${como} y dibujo un recuadro vacio`);
  }
  if (sinPorque?.boton) {
    problemas.push(
      `la pregunta ${id} llego con la justificacion ${como} y ofrece un «Ver por qué» que no ` +
        'despliega nada'
    );
  }
}

if (vj3.alResponder[0]?.justificacion !== '') {
  problemas.push(
    'responder una pregunta sin justificacion escribio algo en el recuadro: ' +
      JSON.stringify(vj3.alResponder[0]?.justificacion)
  );
}

// Y las demas preguntas del modulo, que si la traen, la siguen mostrando. Sin esto
// «no dibujar nada» se cumpliria tambien no dibujando nunca nada.
const otraConPorque = preguntasDelModulo.find(
  (id) => ![P1, P2, P3].includes(id) && typeof justificaciones.get(id) === 'string'
);

if (otraConPorque !== undefined && vj3.final.porques?.[otraConPorque]?.recuadro !== true) {
  problemas.push(
    `con tres preguntas sin justificacion, la ${otraConPorque} perdio la suya: el trato del ` +
      'caso vacio se llevo por delante el caso normal'
  );
}

notas.push(
  `Justificacion: al responder aparece la de esa pregunta —bien y mal— y no la de otra; una ` +
    `restaurada ofrece «Ver por qué» y lo despliega sin dejar el foco en el body; y con la ` +
    `justificacion nula, ausente o en blanco no queda ni recuadro ni boton.` +
    (PELIGROSA === undefined
      ? ' NINGUNA justificacion de este modulo trae caracteres que escapar: el escapado lo prueba probar-escapado.'
      : ` La pregunta ${PELIGROSA} trae caracteres que escapar y no aparecio cruda por ninguno de los dos caminos.`)
);

// ===========================================================================
// 9 · La memoria de la visita (decision 7 de la iteracion 34)
// ===========================================================================

// --- Cambiar de modulo y volver NO cierra la visita -------------------------
//
// Se prueba con el almacenamiento DENEGADO a proposito. Con el almacen sano no se
// distinguiria de lo guardado: la pregunta seguiria respondida igual, y la prueba
// pasaria sin que existiera ninguna memoria de la visita.
const vm1 = visitar({
  disco: discoNuevo('visita-sin-almacen'),
  almacen: 'lectura-lanza',
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
    { tipo: 'elegir', modulo: OTRO_MODULO },
    { tipo: 'elegir', modulo: MODULO },
  ],
});

if (vm1.final.barras.respondidas !== '1') {
  problemas.push(
    'sin almacenamiento, cambiar de modulo y volver perdio lo respondido: el panel dice ' +
      `«${vm1.final.barras.respondidas}»`
  );
}
if (vm1.final.respondidas.length !== 1) {
  problemas.push(
    `sin almacenamiento, al volver al modulo se dibujaron ${vm1.final.respondidas.length} ` +
      'preguntas respondidas y se habia respondido 1'
  );
}
if (vm1.final.porques?.[P1]?.abierto !== true) {
  problemas.push(
    'tras cambiar de modulo y volver, la justificacion de lo respondido en la visita ya no esta ' +
      `desplegada: ${JSON.stringify(vm1.final.porques?.[P1])}`
  );
}
if (!vm1.final.porques?.[P1]?.texto.includes(esc(justificaciones.get(P1)))) {
  problemas.push('tras volver al modulo, el recuadro desplegado no trae la justificacion de esa pregunta');
}

// --- Y CON almacenamiento, la visita manda sobre lo guardado ----------------
//
// La otra mitad de la distincion: lo respondido hace un rato se dibuja desplegado
// aunque tambien este guardado, y lo respondido otro dia se dibuja con su boton.
// Sin las dos, «desplegada» podria significar simplemente «respondida».
const discoDosVisitas = discoNuevo('dos-visitas');

const vm2 = visitar({
  disco: discoDosVisitas,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
    { tipo: 'elegir', modulo: OTRO_MODULO },
    { tipo: 'elegir', modulo: MODULO },
  ],
});

if (vm2.final.porques?.[P1]?.abierto !== true) {
  problemas.push(
    'con almacenamiento, lo respondido en esta visita dejo de estar desplegado tras repintar'
  );
}

const vm3 = visitar({ disco: discoDosVisitas, pasos: [{ tipo: 'elegir', modulo: MODULO }] });

if (vm3.final.porques?.[P1]?.boton !== true || vm3.final.porques?.[P1]?.abierto !== false) {
  problemas.push(
    'en una visita nueva, lo respondido antes no se dibuja como restaurado: la pagina no ' +
      `distingue «hace un rato» de «otro dia» (${JSON.stringify(vm3.final.porques?.[P1])})`
  );
}

// --- Reiniciar borra tambien la memoria de la visita ------------------------
//
// Sin almacenamiento, lo guardado no existe, asi que lo unico que reiniciar puede
// borrar es la memoria de la visita. Si no la borrara, el boton limpiaria la
// pantalla y las respuestas volverian en el siguiente repintado.
const vm4 = visitar({
  disco: discoNuevo('reinicio-sin-almacen'),
  almacen: 'lectura-lanza',
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }, { pregunta: P2, acertando: false }] },
    { tipo: 'reiniciar' },
  ],
});

if (vm4.final.barras.respondidas !== '0') {
  problemas.push(
    `sin almacenamiento, reiniciar dejo el panel en «${vm4.final.barras.respondidas}» respondidas`
  );
}
if (vm4.final.respondidas.length !== 0) {
  problemas.push(
    `sin almacenamiento, reiniciar dejo ${vm4.final.respondidas.length} preguntas dibujadas como ` +
      'respondidas: la memoria de la visita sobrevivio al borrado'
  );
}
if (Object.values(vm4.final.porques ?? {}).some((p) => p.abierto)) {
  problemas.push('sin almacenamiento, reiniciar dejo justificaciones desplegadas');
}

// Y reiniciar un modulo no puede llevarse la memoria de la visita del otro.
const vm5 = visitar({
  disco: discoNuevo('reinicio-no-toca-el-otro'),
  almacen: 'lectura-lanza',
  pasos: [
    { tipo: 'elegir', modulo: OTRO_MODULO },
    { tipo: 'responder', cuales: [{ pregunta: Q1, acertando: true }] },
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
    { tipo: 'reiniciar' },
    { tipo: 'elegir', modulo: OTRO_MODULO },
  ],
});

if (vm5.final.barras.respondidas !== '1') {
  problemas.push(
    `reiniciar el modulo ${MODULO} se llevo por delante la memoria de la visita del ` +
      `${OTRO_MODULO}: al volver dice «${vm5.final.barras.respondidas}» respondidas`
  );
}

notas.push(
  'Memoria de la visita: sin almacenamiento, cambiar de modulo y volver conserva lo respondido ' +
    'con su justificacion desplegada; en una visita nueva esa misma pregunta ofrece «Ver por qué»; ' +
    'y reiniciar la borra sin tocar la del otro modulo.'
);

// ===========================================================================
// 10 · El repaso (iteracion 34)
// ===========================================================================

/** La alternativa correcta de una pregunta, y una incorrecta, segun la base local. */
function alternativasDe(pregunta) {
  const filas = consultar(
    `SELECT texto, es_correcta FROM alternativa WHERE pregunta_id = ${pregunta} ORDER BY orden;`
  );

  return {
    correcta: filas?.find((f) => f.es_correcta === 1)?.texto,
    incorrectas: (filas ?? []).filter((f) => f.es_correcta !== 1).map((f) => f.texto),
  };
}

const altP1 = alternativasDe(P1);
const altP2 = alternativasDe(P2);

if (!altP1.correcta || altP1.incorrectas.length < 2 || !altP2.correcta) {
  noSePudo('La base local no devolvio las alternativas de las preguntas de prueba.');
}

const N_DEL_BOTON = (retratoVisto) => {
  const m = retratoVisto.repaso.boton.match(/\((\d+)\)/);
  return m ? Number(m[1]) : null;
};

const N_DEL_CONTADOR = (retratoVisto) => {
  const html = retratoVisto.repaso.contador;
  if (/No te queda ninguna fallada por repasar/.test(html)) return 0;
  return Number(html.match(/Te quedan? (\d+) pregunta/)?.[1] ?? NaN);
};

// --- La fila de controles, en el HTML versionado ---------------------------
//
// «La fila nunca pasa de tres controles» (decision 10) no es una conducta que se
// pueda provocar: es una propiedad del archivo. Se comprueba donde vive.
const filaDeBotones = readFileSync(join(RAIZ, 'cuestionario.html'), 'utf8')
  .match(/<div class="mt-6 flex flex-wrap gap-3">([\s\S]*?)<\/div>/)?.[1] ?? '';

const controlesDeLaFila = (filaDeBotones.match(/<(button|a)\b/g) ?? []).length;

if (controlesDeLaFila !== 3) {
  problemas.push(
    `la fila del panel tiene ${controlesDeLaFila} controles y la decision 10 fija tres: ` +
      'reiniciar, el del repaso, y el enlace a la materia'
  );
}
if ((filaDeBotones.match(/id="repaso"/g) ?? []).length !== 1) {
  problemas.push(
    'la fila no tiene exactamente un boton de repaso: si hubiera dos, el de entrar podria ' +
      'quedar visible durante el repaso'
  );
}

// --- Visita R1: el repaso sigue al banco nuevo -----------------------------
//
// P1 se responde BIEN y P2 MAL. Despues se intercepta moviendo la correcta de P1,
// que es lo que hace `banco:actualizar` al corregir una pregunta. Sin el banco
// nuevo el repaso traeria una sola pregunta; con el, dos.
const discoRepaso = discoNuevo('repaso');

const vr0 = visitar({
  disco: discoRepaso,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }, { pregunta: P2, acertando: false }] },
  ],
});

if (N_DEL_BOTON(vr0.final) !== 1) {
  problemas.push(
    `con una fallada el boton dice «${vr0.final.repaso.boton}» y tendria que decir «(1)»`
  );
}

const vr1 = visitar({
  disco: discoRepaso,
  intercepcion: { tipo: 'correcta-movida', pregunta: P1 },
  pasos: [{ tipo: 'elegir', modulo: MODULO }, { tipo: 'repaso' }],
});

if (N_DEL_BOTON(vr1.pasos[0]) !== 2) {
  problemas.push(
    `con la correcta de ${P1} movida, el boton dice «${vr1.pasos[0].repaso.boton}» y esa ` +
      'pregunta paso a estar fallada: tendria que decir «(2)»'
  );
}

const enElRepaso = vr1.final.dibujadas;

if (enElRepaso.length !== 2 || !enElRepaso.includes(P1) || !enElRepaso.includes(P2)) {
  problemas.push(
    `el repaso dibujo ${JSON.stringify(enElRepaso)} y las falladas segun el banco de hoy son ` +
      `${P1} y ${P2}: ni mas ni menos`
  );
}

// Y sin marcar, las dos, para poder intentarlas de nuevo (decision 3).
if (vr1.final.respondidas.length !== 0) {
  problemas.push(
    `el repaso dibujo ${vr1.final.respondidas.length} preguntas ya marcadas: no se podrian reintentar`
  );
}
if (Object.values(vr1.final.porques).some((p) => p.abierto || p.boton)) {
  problemas.push('el repaso dibujo el porque de una pregunta que presenta sin marcar');
}

// --- Las barras miden el modulo, el contador mide el repaso (decision 4) ----
if (vr1.final.total !== String(cuantasTiene(MODULO))) {
  problemas.push(
    `en el repaso las barras dicen que el modulo tiene ${vr1.final.total} preguntas y tiene ` +
      `${cuantasTiene(MODULO)}: las barras no cambian de significado segun el modo`
  );
}
if (vr1.final.barras.respondidas !== '2') {
  problemas.push(
    `en el repaso las barras dicen «${vr1.final.barras.respondidas}» respondidas y el modulo ` +
      'lleva 2: miden el modulo completo, no lo dibujado'
  );
}
if (vr1.final.cabecera !== cuantasTiene(MODULO)) {
  problemas.push(
    `en el repaso la cabecera del modulo dice ${vr1.final.cabecera} y el modulo tiene ` +
      `${cuantasTiene(MODULO)}: seria un tercer contador contradiciendo a los otros dos`
  );
}
if (N_DEL_CONTADOR(vr1.final) !== 2) {
  problemas.push(
    `el contador de arriba dice «${vr1.final.repaso.contador}» y quedan 2 falladas por repasar`
  );
}

// Un solo contador arriba (decision 8): el del modulo desaparece de su sitio.
if (/módulo/.test(vr1.final.repaso.contador)) {
  problemas.push(
    'durante el repaso el contador de arriba sigue siendo el del modulo: habria dos cifras ' +
      `distintas del mismo sitio (${vr1.final.repaso.contador})`
  );
}

// Y el boton cambio de papel (decision 10).
if (vr1.final.repaso.boton !== 'Volver al módulo completo') {
  problemas.push(
    `durante el repaso el boton dice «${vr1.final.repaso.boton}»: «Repasar mis errores» no ` +
      'puede seguir ofreciendo entrar a donde ya se entro'
  );
}

// Entrar no dispara el aviso de descuadre (decision 4).
const descuadres = (v) => v.avisos.filter((a) => /El indice (dice|contaba)/.test(a));

if (descuadres(vr1).length > 0) {
  problemas.push(
    `entrar al repaso disparo el aviso de descuadre: ${JSON.stringify(descuadres(vr1))}`
  );
}

// --- Visita R2: acertar reemplaza lo guardado, y la acertada sigue a la vista
const discoAcertar = discoNuevo('repaso-acertar');

const vr2 = visitar({
  disco: discoAcertar,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }, { pregunta: P2, acertando: true }] },
    { tipo: 'repaso' },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
  ],
});

const antesDeAcertar = vr2.pasos[2];
const despuesDeAcertar = vr2.pasos[3];

if (N_DEL_CONTADOR(antesDeAcertar) !== 1 || N_DEL_CONTADOR(despuesDeAcertar) !== 0) {
  problemas.push(
    `acertar en el repaso no movio el contador: antes «${antesDeAcertar.repaso.contador}», ` +
      `despues «${despuesDeAcertar.repaso.contador}»`
  );
}

// Las barras SI se mueven, y siguen midiendo el modulo entero.
if (despuesDeAcertar.barras.respondidas !== '2' || despuesDeAcertar.total !== String(cuantasTiene(MODULO))) {
  problemas.push(
    `tras acertar en el repaso las barras dicen ${despuesDeAcertar.barras.respondidas} de ` +
      `${despuesDeAcertar.total}: la respuesta se conto dos veces o el total cambio`
  );
}
if (despuesDeAcertar.barras.correctas !== '2' || despuesDeAcertar.barras.incorrectas !== '0') {
  problemas.push(
    `tras acertar una fallada las barras dicen ${despuesDeAcertar.barras.correctas} correctas y ` +
      `${despuesDeAcertar.barras.incorrectas} incorrectas, y tendrian que decir 2 y 0`
  );
}

// La acertada SIGUE A LA VISTA (decision 3).
if (!despuesDeAcertar.dibujadas.includes(P1)) {
  problemas.push(
    'la pregunta acertada desaparecio del repaso al acertarla: en el telefono el contenido ' +
      'saltaria bajo el dedo'
  );
}

// Y sigue a la vista POR DISENO, no por casualidad: responder dentro del repaso no
// vuelve a dibujar la lista. Sin esta linea, la comprobacion de arriba se cumpliria
// sola —nadie repinto, asi que nada pudo desaparecer— y una version que recalculara
// el conjunto en cada dibujo pasaria en verde hasta que alguien repintara.
if (despuesDeAcertar.largoDelHtml !== antesDeAcertar.largoDelHtml) {
  problemas.push(
    'responder dentro del repaso volvio a dibujar la lista: la pregunta que se esta leyendo ' +
      'salta bajo el dedo, y el conjunto congelado deja de ser lo unico que la sostiene'
  );
}

// Lo guardado se REEMPLAZO, sin cambiar el formato (decision 3).
const anotadoTrasAcertar = JSON.parse(leerDisco(discoAcertar)[claveDe(MODULO)] ?? '{}');

if (anotadoTrasAcertar.v !== 1) {
  problemas.push(`acertar en el repaso cambio la version del formato: ${JSON.stringify(anotadoTrasAcertar.v)}`);
}
if (anotadoTrasAcertar.respuestas?.[P1] !== altP1.correcta) {
  problemas.push(
    `acertar en el repaso no reemplazo lo guardado: la clave del modulo trae ` +
      `${JSON.stringify(anotadoTrasAcertar.respuestas?.[P1])}`
  );
}
if (Object.keys(anotadoTrasAcertar.respuestas ?? {}).length !== 2) {
  problemas.push(
    `tras acertar en el repaso hay ${Object.keys(anotadoTrasAcertar.respuestas ?? {}).length} ` +
      'respuestas guardadas y se respondieron 2 preguntas: la nueva se sumo en vez de reemplazar'
  );
}
for (const palabra of ['acerto', 'veredicto', 'es_correcta']) {
  if (JSON.stringify(anotadoTrasAcertar).includes(`"${palabra}"`)) {
    problemas.push(`acertar en el repaso guardo «${palabra}»: el veredicto no se guarda`);
  }
}

// --- Visita R3: salir, y las acertadas quedan desplegadas -------------------
const discoSalir = discoNuevo('repaso-salir');

// Se entra con DOS falladas y se arregla una. Con una sola, al volver a entrar no
// quedaria ninguna y el repaso ni siquiera se abriria: la prueba pasaria sin haber
// mirado si la acertada desaparecio de la lista. Ese es el patron de H-023.
const vr3 = visitar({
  disco: discoSalir,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }, { pregunta: P2, acertando: false }] },
    { tipo: 'repaso' },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
    { tipo: 'repaso' },
    { tipo: 'repaso' },
  ],
});

const trasSalir = vr3.pasos[4];
const trasVolverAEntrar = vr3.pasos[5];

if (trasSalir.dibujadas.length !== cuantasTiene(MODULO)) {
  problemas.push(
    `al salir del repaso se dibujaron ${trasSalir.dibujadas.length} preguntas y el modulo tiene ` +
      `${cuantasTiene(MODULO)}`
  );
}
if (trasSalir.repaso.boton !== 'Repasar mis errores (1)') {
  problemas.push(
    `al salir del repaso el boton dice «${trasSalir.repaso.boton}»: se entro con 2 falladas y se ` +
      'acerto 1'
  );
}
if (!/preguntas · módulo/.test(trasSalir.repaso.contador)) {
  problemas.push(
    `al salir del repaso el contador de arriba no volvio al del modulo: «${trasSalir.repaso.contador}»`
  );
}
if (!trasSalir.repaso.contador.includes(String(cuantasTiene(MODULO)))) {
  problemas.push(
    `al salir del repaso el contador no trae la cifra completa del modulo: ` +
      `«${trasSalir.repaso.contador}»`
  );
}

// La acertada DENTRO del repaso queda con su justificacion desplegada al salir.
if (trasSalir.porques[P1]?.abierto !== true) {
  problemas.push(
    'tras salir del repaso, la pregunta acertada dentro de el no muestra su justificacion ' +
      `desplegada: ${JSON.stringify(trasSalir.porques[P1])}`
  );
}

// Y al volver a entrar ya no esta: dejo de estar fallada. La otra si.
if (trasVolverAEntrar.dibujadas.includes(P1)) {
  problemas.push('al volver a entrar al repaso, la pregunta ya acertada sigue apareciendo');
}
if (trasVolverAEntrar.dibujadas.length !== 1 || !trasVolverAEntrar.dibujadas.includes(P2)) {
  problemas.push(
    `al volver a entrar, el repaso dibujo ${JSON.stringify(trasVolverAEntrar.dibujadas)} y la ` +
      `unica que sigue fallada es la ${P2}`
  );
}

// Y TRAS RECARGAR, esa misma pregunta ofrece «Ver por qué».
//
// Es la otra mitad del criterio, y la que prueba que lo de la visita es de la
// visita: el proceso es nuevo, lo unico que queda es el disco, y ahi no hay ninguna
// marca de cuando se respondio.
const vr3b = visitar({ disco: discoSalir, pasos: [{ tipo: 'elegir', modulo: MODULO }] });

if (vr3b.final.porques[P1]?.boton !== true || vr3b.final.porques[P1]?.abierto !== false) {
  problemas.push(
    'tras recargar, la pregunta acertada dentro del repaso sigue con la justificacion ' +
      `desplegada en vez de ofrecer «Ver por qué»: ${JSON.stringify(vr3b.final.porques[P1])}`
  );
}

// --- Visita R4: volver a fallar (decision 9) -------------------------------
const discoFallar = discoNuevo('repaso-fallar');

const vr4 = visitar({
  disco: discoFallar,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }] },
    { tipo: 'repaso' },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }] },
    { tipo: 'repaso' },
    { tipo: 'repaso' },
  ],
});

const trasVolverAFallar = vr4.pasos[3];

if (N_DEL_CONTADOR(vr4.pasos[2]) !== 1 || N_DEL_CONTADOR(trasVolverAFallar) !== 1) {
  problemas.push(
    `volver a fallar movio el contador: antes «${vr4.pasos[2].repaso.contador}», despues ` +
      `«${trasVolverAFallar.repaso.contador}»`
  );
}
if (!trasVolverAFallar.dibujadas.includes(P1)) {
  problemas.push('la pregunta vuelta a fallar desaparecio del repaso');
}

// Queda BLOQUEADA: no hay «intentar de nuevo» dentro del mismo repaso.
const alVolverAFallar = vr4.alResponder.at(-1);

if (alVolverAFallar?.bloqueada !== true) {
  problemas.push(
    'tras volver a fallar dentro del repaso la pregunta quedo contestable otra vez: reintentar ' +
      'cuesta salir y volver a entrar (decision 9)'
  );
}
if (alVolverAFallar?.justificacion === '') {
  problemas.push('volver a fallar dentro del repaso no mostro la justificacion');
}

// Y la respuesta NUEVA quedo guardada.
const anotadoTrasFallar = JSON.parse(leerDisco(discoFallar)[claveDe(MODULO)] ?? '{}');

if (!altP1.incorrectas.includes(anotadoTrasFallar.respuestas?.[P1])) {
  problemas.push(
    `volver a fallar no guardo la respuesta nueva: la clave trae ` +
      `${JSON.stringify(anotadoTrasFallar.respuestas?.[P1])}`
  );
}

// Al volver a entrar, aparece de nuevo SIN MARCAR.
const reentrada = vr4.pasos[5];

if (!reentrada.dibujadas.includes(P1)) {
  problemas.push('al volver a entrar al repaso, la pregunta vuelta a fallar no aparece');
}
if (reentrada.respondidas.some((r) => r.id === P1)) {
  problemas.push(
    'al volver a entrar al repaso, la pregunta vuelta a fallar aparece marcada: no se podria ' +
      'intentar de nuevo'
  );
}

// --- Visita R5: con N en 0 y el modulo sin responder -----------------------
const vr5 = visitar({
  disco: discoNuevo('repaso-sin-respuestas'),
  pasos: [{ tipo: 'elegir', modulo: MODULO }, { tipo: 'repaso' }],
});

if (!/Todavía no respondes/.test(vr5.final.repaso.aviso)) {
  problemas.push(
    `con el modulo sin responder, el boton del repaso respondio «${vr5.final.repaso.aviso}»`
  );
}
if (vr5.final.dibujadas.length !== cuantasTiene(MODULO)) {
  problemas.push('con N en 0 el repaso se abrio igual y dejo la pantalla sin preguntas que repasar');
}
if (vr5.final.repaso.boton !== 'Repasar mis errores (0)') {
  problemas.push(
    `con N en 0 el boton dice «${vr5.final.repaso.boton}»: tiene que seguir visible y decir (0)`
  );
}
if (vr5.final.repaso.avisoOculto) {
  problemas.push('el mensaje del repaso se escribio pero quedo oculto');
}

// Y donde va: bajo la cabecera del modulo, con la vista y el foco ahi (decision 11).
if (!vr5.final.repaso.avisoTrasLaCabecera) {
  problemas.push(
    'el mensaje con N en 0 no quedo entre la cabecera del modulo y las preguntas'
  );
}
if (!vr5.final.repaso.focoEnElAviso) {
  problemas.push(
    `tras pulsar «Repasar mis errores (0)» el foco quedo en «${vr5.final.paso.tipo}»/` +
      `«${vr5.final.repaso.focoEnElAviso}»: el mensaje esta en la otra columna y en telefono ` +
      'queda pantalla y media por debajo del boton que se acaba de pulsar'
  );
}

// --- El panel NO crece (decision 11, ADR-032) ------------------------------
//
// No es una conducta que se pueda provocar: es una propiedad del archivo. Si el
// mensaje tuviera su elemento dentro del panel, el panel crece al mostrarlo, y la
// ventana de 700 px de alto deja de alcanzar hasta «Reiniciar el módulo». Se
// comprueba donde vive, igual que la fila de tres controles.
const htmlDeLaPagina = readFileSync(join(RAIZ, 'cuestionario.html'), 'utf8');

const panelFijo = htmlDeLaPagina.slice(
  htmlDeLaPagina.indexOf('============ PANEL FIJO ============'),
  htmlDeLaPagina.indexOf('============ CUESTIONARIO ============')
);

if (panelFijo === '' || !panelFijo.includes('id="reiniciar"')) {
  noSePudo('No pude recortar el panel fijo de cuestionario.html para comprobarlo.');
}

const avisosEnElPanel = panelFijo.match(/id="aviso-[a-z-]+"/g) ?? [];

if (avisosEnElPanel.length > 0) {
  problemas.push(
    `el panel fijo trae ${avisosEnElPanel.join(', ')}: los avisos viven en la zona de ` +
      'preguntas, porque ADR-032 contabilizo el alto del panel al milimetro y mostrar uno ' +
      'aca lo hace crecer'
  );
}

// Y el mensaje tampoco se coló en el texto del panel por otro camino.
if (vr5.final.mensajeDelPanel.includes('Todavía no respondes')) {
  problemas.push('el mensaje con N en 0 se escribio en el panel en vez de la zona de preguntas');
}

// --- Visita R5x: el mensaje no queda a la vista cuando ya no describe nada --
//
// Los cuatro caminos de la decision 11. Tres repintan y se lo llevan por delante;
// responder NO repinta, y es el unico que podria dejarlo colgado encima de una
// pregunta recien respondida.
const vr5x = visitar({
  disco: discoNuevo('repaso-aviso-obsoleto'),
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'repaso' },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }] },
    { tipo: 'repaso' },
  ],
});

if (vr5x.pasos[1].repaso.aviso === '') {
  problemas.push('el mensaje con N en 0 no llego a dibujarse');
}
if (!vr5x.pasos[2].repaso.avisoOculto) {
  problemas.push(
    'responder dejo a la vista el mensaje que decia que no habias respondido nada: responder ' +
      'no repinta, asi que el mensaje hay que retirarlo a mano'
  );
}
if (vr5x.pasos[3].repaso.aviso !== '') {
  problemas.push('entrar al repaso dejo puesto el mensaje que decia que no habia nada que repasar');
}

const vr5y = visitar({
  disco: discoNuevo('repaso-aviso-cambio'),
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'repaso' },
    { tipo: 'elegir', modulo: OTRO_MODULO },
  ],
});

if (vr5y.final.repaso.aviso !== '') {
  problemas.push(
    `cambiar de modulo dejo puesto un mensaje del modulo anterior: «${vr5y.final.repaso.aviso}»`
  );
}

const vr5z = visitar({
  disco: discoNuevo('repaso-aviso-reinicio'),
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
    { tipo: 'repaso' },
    { tipo: 'reiniciar' },
  ],
});

if (vr5z.pasos[2].repaso.aviso === '') {
  problemas.push('con todo acertado el mensaje no llego a dibujarse');
}
if (vr5z.final.repaso.aviso !== '') {
  problemas.push(
    `reiniciar dejo puesto el mensaje que decia que habias acertado todo: ` +
      `«${vr5z.final.repaso.aviso}»`
  );
}

// --- Visita R5w: sin ningun modulo cargado ---------------------------------
//
// El tercer caso, que la decision 5 no preveia y la 11 si: pulsar el boton nada mas
// abrir la pagina. Tambien en la zona de preguntas, y sin llevarse por delante el
// estado vacio, que es donde vive el enlace al indice que justamente hace falta.
const vr5w = visitar({
  disco: discoNuevo('repaso-sin-modulo'),
  pasos: [{ tipo: 'repaso' }],
});

if (!/Elige un módulo/.test(vr5w.final.repaso.aviso)) {
  problemas.push(
    `sin ningun modulo cargado, el boton del repaso respondio «${vr5w.final.repaso.aviso}»`
  );
}
if (!vr5w.final.repaso.focoEnElAviso) {
  problemas.push('sin modulo cargado, el mensaje del repaso no se llevo el foco');
}
if (!vr5w.final.traeEnlaceAlIndice) {
  problemas.push(
    'el mensaje sin modulo cargado se llevo por delante el estado vacio: el enlace al indice ' +
      'es justo lo que el estudiante necesita en ese momento'
  );
}

// --- Visita R5b: con N en 0 y todo acertado --------------------------------
//
// El otro mensaje, que no puede ser el mismo: «no has respondido nada» manda a
// responder y «no fallaste ninguna» no pide nada. Un solo texto para los dos seria
// verdadero en ambos e inutil en ambos.
const vr5b = visitar({
  disco: discoNuevo('repaso-todo-acertado'),
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }, { pregunta: P2, acertando: true }] },
    { tipo: 'repaso' },
  ],
});

if (!/No tienes errores que repasar/.test(vr5b.final.repaso.aviso)) {
  problemas.push(
    `con todo acertado, el boton del repaso respondio «${vr5b.final.repaso.aviso}»`
  );
}
if (vr5b.final.repaso.aviso === vr5.final.repaso.aviso) {
  problemas.push(
    'los dos casos de N en 0 dan el mismo mensaje: «no has respondido nada» y «no fallaste ' +
      'ninguna» llevan a cosas distintas'
  );
}
if (vr5b.final.dibujadas.length !== cuantasTiene(MODULO)) {
  problemas.push('con todo acertado el repaso se abrio igual');
}

// --- Visita R6: salir por el indice y por reiniciar ------------------------
const vr6 = visitar({
  disco: discoNuevo('repaso-salidas'),
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }] },
    { tipo: 'repaso' },
    { tipo: 'elegir', modulo: OTRO_MODULO },
    { tipo: 'elegir', modulo: MODULO },
  ],
});

const trasCambiarDeModulo = vr6.pasos[3];

if (trasCambiarDeModulo.dibujadas.length !== cuantasTiene(OTRO_MODULO)) {
  problemas.push(
    `elegir otro modulo a mitad del repaso dibujo ${trasCambiarDeModulo.dibujadas.length} ` +
      `preguntas y el modulo ${OTRO_MODULO} tiene ${cuantasTiene(OTRO_MODULO)}: no salio del repaso`
  );
}
if (trasCambiarDeModulo.repaso.boton === 'Volver al módulo completo') {
  problemas.push('elegir otro modulo a mitad del repaso dejo el boton diciendo que se sigue dentro');
}
if (vr6.final.barras.respondidas !== '1') {
  problemas.push(
    `salir del repaso cambiando de modulo perdio lo respondido: al volver dice ` +
      `«${vr6.final.barras.respondidas}»`
  );
}

const vr7 = visitar({
  disco: discoNuevo('repaso-reinicio'),
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }] },
    { tipo: 'repaso' },
    { tipo: 'reiniciar' },
  ],
});

if (vr7.final.dibujadas.length !== cuantasTiene(MODULO)) {
  problemas.push(
    `reiniciar a mitad del repaso dibujo ${vr7.final.dibujadas.length} preguntas: no salio del repaso`
  );
}
if (vr7.final.repaso.boton !== 'Repasar mis errores (0)') {
  problemas.push(
    `reiniciar a mitad del repaso dejo el boton en «${vr7.final.repaso.boton}»`
  );
}
if (vr7.final.barras.respondidas !== '0') {
  problemas.push('reiniciar a mitad del repaso no reinicio');
}

// Ninguna de las dos salidas avisa ni pregunta, y ninguna descuadra el indice.
for (const [nombre, visita] of [['cambiar de modulo', vr6], ['reiniciar', vr7]]) {
  if (descuadres(visita).length > 0) {
    problemas.push(`salir del repaso por ${nombre} disparo el aviso de descuadre`);
  }
}

// --- Visita R8: sin almacenamiento -----------------------------------------
//
// Todo lo del repaso tiene que salir de la memoria de la visita: no hay otra cosa.
const vr8 = visitar({
  disco: discoNuevo('repaso-sin-almacen'),
  almacen: 'lectura-lanza',
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }, { pregunta: P2, acertando: true }] },
    { tipo: 'repaso' },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
  ],
});

if (N_DEL_BOTON(vr8.pasos[1]) !== 1) {
  problemas.push(
    `sin almacenamiento el boton dice «${vr8.pasos[1].repaso.boton}» y hay 1 fallada`
  );
}
if (vr8.pasos[2].dibujadas.length !== 1 || !vr8.pasos[2].dibujadas.includes(P1)) {
  problemas.push(
    `sin almacenamiento el repaso dibujo ${JSON.stringify(vr8.pasos[2].dibujadas)} y la unica ` +
      `fallada es la ${P1}`
  );
}
if (N_DEL_CONTADOR(vr8.pasos[2]) !== 1 || N_DEL_CONTADOR(vr8.pasos[3]) !== 0) {
  problemas.push(
    `sin almacenamiento el contador del repaso no siguio: «${vr8.pasos[2].repaso.contador}» -> ` +
      `«${vr8.pasos[3].repaso.contador}»`
  );
}
if (vr8.final.avisoAlmacenamiento.oculto) {
  problemas.push('con el repaso abierto y sin almacenamiento, la pagina dejo de decir que no guarda');
}

// --- Visita R9: reiniciar deja N en 0, tambien sin almacenamiento ----------
const vr9 = visitar({
  disco: discoNuevo('repaso-reinicio-sin-almacen'),
  almacen: 'lectura-lanza',
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }, { pregunta: P2, acertando: false }] },
    { tipo: 'reiniciar' },
  ],
});

if (N_DEL_BOTON(vr9.pasos[1]) !== 2) {
  problemas.push(
    `sin almacenamiento, dos falladas dejaron el boton en «${vr9.pasos[1].repaso.boton}»`
  );
}
if (N_DEL_BOTON(vr9.final) !== 0) {
  problemas.push(
    `sin almacenamiento, reiniciar dejo el boton en «${vr9.final.repaso.boton}» y tendria que ` +
      'decir «(0)»: la memoria de la visita sobrevivio al borrado'
  );
}

// --- Visita R10: modo degradado --------------------------------------------
//
// Con el fetch caido todo sale de la instantanea, y el repaso tiene que funcionar
// igual, con el aviso de ADR-008 a la vista.
const vr10 = visitar({
  disco: discoNuevo('repaso-degradado'),
  caerLaRed: true,
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: false }] },
    { tipo: 'repaso' },
  ],
});

if (vr10.final.avisoRespaldo.oculto) {
  problemas.push('en modo degradado el repaso funciona pero el aviso de ADR-008 no esta a la vista');
}
if (vr10.final.dibujadas.length !== 1 || !vr10.final.dibujadas.includes(P1)) {
  problemas.push(
    `en modo degradado el repaso dibujo ${JSON.stringify(vr10.final.dibujadas)} y la unica ` +
      `fallada es la ${P1}`
  );
}
if (N_DEL_CONTADOR(vr10.final) !== 1) {
  problemas.push(
    `en modo degradado el contador del repaso dice «${vr10.final.repaso.contador}»`
  );
}

notas.push(
  `Repaso: con la correcta de ${P1} movida por la interceptacion, el repaso trajo las 2 falladas ` +
    'segun el banco de hoy, sin marcar; acertar una reemplazo lo guardado —misma clave, formato ' +
    'v: 1, sin veredicto—, bajo el contador y no las barras, y la acertada siguio a la vista hasta ' +
    'salir; volver a fallar la dejo bloqueada con su justificacion, sin bajar el contador, y ' +
    'reaparecio sin marcar al reentrar.'
);

notas.push(
  'Repaso, los bordes: con N en 0 salen los dos mensajes —modulo sin responder y todo acertado— y ' +
    'el repaso no se abre; elegir otro modulo o reiniciar salen sin preguntar y sin perder nada; ' +
    'funciona sin almacenamiento y en modo degradado con el aviso de ADR-008; la fila se queda en ' +
    '3 controles; y ninguna entrada ni salida disparo el aviso de descuadre del resumen.'
);

// ===========================================================================
// 10c · Durante la carga no se puede responder el modulo anterior (iteracion 35)
//
// Es la premisa de la iteracion 34, provocada en vez de razonada. La 34 quito de
// `responder()` la rama que sumaba respuestas sin identificar apoyandose en que al
// cambiar de modulo no queda ninguna alternativa anterior que pulsar; la 35 puso
// una transicion justo en ese hueco, asi que hay que comprobar que la premisa
// sigue en pie y no solo suponerlo.
//
// Se pulsa una alternativa del modulo viejo en los DOS momentos en que alguien
// podria llegar a hacerlo —con el nuevo cargando y con el nuevo ya dibujado— y las
// tres memorias tienen que quedar donde estaban: el panel, el almacen entero y la
// memoria de la visita.
// ===========================================================================

const discoLoViejo = discoNuevo('pulsar-lo-viejo');

const vv1 = visitar({
  disco: discoLoViejo,
  // El modulo nuevo tarda, que es lo que abre la ventana. El viejo no se retrasa:
  // tiene que estar dibujado antes de que empiece lo que se quiere provocar.
  retrasos: { [OTRO_MODULO]: 2500 },
  pasos: [
    { tipo: 'elegir', modulo: MODULO },
    { tipo: 'responder', cuales: [{ pregunta: P1, acertando: true }] },
    {
      tipo: 'pulsar-lo-viejo',
      pregunta: P2,
      acertando: false,
      moduloViejo: MODULO,
      modulo: OTRO_MODULO,
      durante: 800,
      espera: 3500,
    },
  ],
});

const [antesCargando, despuesCargando, antesDibujado, despuesDibujado] = vv1.alPulsarLoViejo;

if (vv1.alPulsarLoViejo.length !== 4) {
  problemas.push(
    `el paso de pulsar lo viejo dejo ${vv1.alPulsarLoViejo.length} fotos y tenian que ser 4: ` +
      'la comprobacion no llego a provocar nada'
  );
  veredictoRoto();
}

// LO PRIMERO: que el clic haya llegado de verdad al oyente. Sin esto, todo lo de
// abajo pasaria en verde por no haber ocurrido nada, que es la peor forma de que
// una prueba este en verde.
for (const foto of [despuesCargando, despuesDibujado]) {
  if (foto.oyentes !== 1) {
    problemas.push(
      `el clic sobre la alternativa vieja (${foto.cuando}) corrio ${foto.oyentes} oyentes: ` +
        'la comprobacion no esta pulsando nada'
    );
  }
}

const mismoPanel = (a, b) => JSON.stringify(a.panel) === JSON.stringify(b.panel);
const mismoAlmacen = (a, b) => JSON.stringify(a.almacen) === JSON.stringify(b.almacen);
const mismaVisita = (a, b) =>
  JSON.stringify([a.enLaVisitaVieja, a.enLaVisitaNueva]) ===
  JSON.stringify([b.enLaVisitaVieja, b.enLaVisitaNueva]);

for (const [antes, despues] of [
  [antesCargando, despuesCargando],
  [antesDibujado, despuesDibujado],
]) {
  if (!mismoPanel(antes, despues)) {
    problemas.push(
      `pulsar una alternativa del modulo ${MODULO} (${despues.cuando}) movio el panel: ` +
        `${JSON.stringify(antes.panel)} paso a ${JSON.stringify(despues.panel)}`
    );
  }
  if (!mismoAlmacen(antes, despues)) {
    problemas.push(
      `pulsar una alternativa del modulo ${MODULO} (${despues.cuando}) escribio en el almacen: ` +
        `${JSON.stringify(antes.almacen)} paso a ${JSON.stringify(despues.almacen)}`
    );
  }
  if (!mismaVisita(antes, despues)) {
    problemas.push(
      `pulsar una alternativa del modulo ${MODULO} (${despues.cuando}) escribio en la memoria ` +
        `de la visita: ${JSON.stringify([antes.enLaVisitaVieja, antes.enLaVisitaNueva])} paso a ` +
        `${JSON.stringify([despues.enLaVisitaVieja, despues.enLaVisitaNueva])}`
    );
  }
}

// Y la pregunta que se pulso nunca entro en ninguna de las dos memorias, ni en la
// del modulo que la muestra ni en la del que no.
for (const foto of vv1.alPulsarLoViejo) {
  if (foto.enLaVisitaVieja.includes(P2)) {
    problemas.push(
      `la pregunta ${P2} quedo anotada en la memoria de la visita del modulo ${MODULO} sin ` +
        `haberse respondido (${foto.cuando})`
    );
  }
  if (foto.enLaVisitaNueva.length !== 0) {
    problemas.push(
      `la memoria de la visita del modulo ${OTRO_MODULO} trae ${foto.enLaVisitaNueva.length} ` +
        `respuestas sin que se haya respondido ninguna suya (${foto.cuando})`
    );
  }
}

// El almacen, visto desde el disco: la unica respuesta guardada es la que SI se
// respondio, la P1 del modulo viejo, y el modulo nuevo no estreno clave.
const discoTrasLoViejo = leerDisco(discoLoViejo);
const guardadoViejo = discoTrasLoViejo[claveDe(MODULO)]
  ? JSON.parse(discoTrasLoViejo[claveDe(MODULO)])
  : null;

if (Object.keys(guardadoViejo?.respuestas ?? {}).length !== 1) {
  problemas.push(
    `el modulo ${MODULO} quedo con ${Object.keys(guardadoViejo?.respuestas ?? {}).length} ` +
      'respuestas guardadas y solo se respondio 1'
  );
}
if (guardadoViejo?.respuestas?.[P2] !== undefined) {
  problemas.push(
    `la pregunta ${P2}, pulsada cuando su modulo ya no estaba a la vista, quedo guardada`
  );
}
if (discoTrasLoViejo[claveDe(OTRO_MODULO)] !== undefined) {
  problemas.push(
    `el modulo ${OTRO_MODULO} estreno clave en el almacen sin que se respondiera ninguna ` +
      'pregunta suya: una respuesta se guardo en un modulo que no es el que la muestra'
  );
}

// Y el modulo nuevo termino dibujado, con el avance que le toca: ninguno.
if (vv1.final.dibujadas.length !== cuantasTiene(OTRO_MODULO)) {
  problemas.push(
    `tras pulsar lo viejo, el modulo ${OTRO_MODULO} dibujo ${vv1.final.dibujadas.length} ` +
      `preguntas y tiene ${cuantasTiene(OTRO_MODULO)}`
  );
}
if (vv1.final.respondidas.length !== 0) {
  problemas.push(
    `el modulo ${OTRO_MODULO} aparecio con ${vv1.final.respondidas.length} preguntas ` +
      'respondidas, y no se respondio ninguna suya'
  );
}

notas.push(
  `Modulo anterior durante la carga: con el modulo ${OTRO_MODULO} viajando y despues ya ` +
    `dibujado, se pulso una alternativa del ${MODULO} guardada antes de cambiar. El clic llego ` +
    'al oyente las dos veces y no movio nada: ni el panel, ni una sola clave del almacen, ni la ' +
    `memoria de la visita. El ${OTRO_MODULO} quedo dibujado entero y sin avance, y el ${MODULO} ` +
    'conserva su unica respuesta de verdad.'
);

// ===========================================================================
// 11 · El avance no sale del dispositivo
// ===========================================================================

const todasLasVisitas = [
  v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v14,
  vj1, vj2, vj3, vm1, vm2, vm3, vm4, vm5,
  vr0, vr1, vr2, vr3, vr3b, vr4, vr5, vr5b, vr5w, vr5x, vr5y, vr5z, vr6, vr7, vr8, vr9, vr10,
  vv1,
];
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
// 12 · El intento del simulacro (iteracion 41, etapa C)
//
// Otra pagina y otro formato, pero exactamente la misma pregunta que las once
// secciones de arriba: **¿lo que se guarda dice la verdad al volver?**
//
// Lo que cambia respecto del cuestionario, y por que hay que probarlo aparte:
//
//   1. **Las preguntas se guardan congeladas.** ADR-034 recalcula el veredicto
//      contra el banco vigente; aqui el intento se corrige con lo que el estudiante
//      vio (decision 6 de la iteracion 41). Son reglas opuestas, y la de aqui solo
//      se puede comprobar cambiando el banco entre una visita y la otra.
//   2. **Son dos claves atadas.** Media copia congelada con las respuestas de otro
//      intento es la peor lectura posible, y la unica forma de verlo es plantarla.
//   3. **El intento no se puede jugar a medias.** Un intento de 119 no es corto, es
//      roto: donde el cuestionario descarta una respuesta, aqui se descarta todo.
// ===========================================================================

/** Un disco con lo que se le plante dentro, para poder provocar datos rotos. */
function discoCon(nombre, contenido) {
  const ruta = join(taller, `${nombre}.json`);
  writeFileSync(ruta, JSON.stringify(contenido, null, 2));
  return ruta;
}

const CLAVE_PREGUNTAS = 'examen-td-js.simulacro.preguntas';
const CLAVE_RESPUESTAS = 'examen-td-js.simulacro.respuestas';

/**
 * Interpreta una clave del disco, o cierra en rojo diciendo cual falta.
 *
 * NO se usa `JSON.parse` a pelo. Se descubrio provocandolo el 2026-09-18: con la
 * retoma mutada para volver a pedirle las preguntas al banco, la clave no estaba y el
 * guardian termino con un volcado de pila en vez de un veredicto. Un guardian que se
 * cae no da veredicto, y H-013 dice que eso NO es un aprobado: el mutante tiene que
 * salir por la puerta de los rojos, con su frase, no por la de los errores.
 */
function claveDelDisco(guardado, clave, cuando) {
  const crudo = guardado[clave];

  if (typeof crudo !== 'string') {
    problemas.push(`${cuando}: no quedo la clave ${clave} en el almacen`);
    veredictoRoto();
  }

  try {
    return JSON.parse(crudo);
  } catch {
    problemas.push(`${cuando}: la clave ${clave} quedo con algo que no es JSON`);
    veredictoRoto();
  }

  return null;
}

const discoSimulacro = discoNuevo('simulacro');

// --- 12a · Al empezar, el intento queda guardado --------------------------

const s1 = visitar({
  disco: discoSimulacro,
  pagina: 'simulacro',
  pasos: [{ tipo: 'comenzar' }],
});

if (s1.final.titulo !== 'Intento listo') {
  problemas.push(
    `al pulsar «Comenzar» el simulacro no armo el intento: dijo «${s1.final.titulo}»`
  );
  veredictoRoto();
}

const guardadoTrasEmpezar = leerDisco(discoSimulacro);

if (!guardadoTrasEmpezar[CLAVE_PREGUNTAS] || !guardadoTrasEmpezar[CLAVE_RESPUESTAS]) {
  problemas.push(
    'al empezar el intento no quedaron las DOS claves bajo examen-td-js.simulacro.: ' +
      `hay ${Object.keys(guardadoTrasEmpezar).join(', ') || 'ninguna'}`
  );
  veredictoRoto();
}

// Ninguna otra clave. El simulacro no puede escribir fuera de su tramo: es lo que la
// convencion de la actualizacion de ADR-034 existe para garantizar, y lo que impide
// que «Reiniciar el modulo» del cuestionario le borre algo.
const clavesAjenas = Object.keys(guardadoTrasEmpezar).filter(
  (clave) => !clave.startsWith('examen-td-js.simulacro.')
);

if (clavesAjenas.length > 0) {
  problemas.push(
    `el simulacro escribio fuera de su tramo de claves: ${clavesAjenas.join(', ')}`
  );
}

const preguntasGuardadas = claveDelDisco(guardadoTrasEmpezar, CLAVE_PREGUNTAS, 'al empezar el intento');
const respuestasGuardadas = claveDelDisco(guardadoTrasEmpezar, CLAVE_RESPUESTAS, 'al empezar el intento');

if (preguntasGuardadas.v !== 1 || respuestasGuardadas.v !== 1) {
  problemas.push(
    'el intento guardado no lleva la version DENTRO del dato: ' +
      `preguntas v=${preguntasGuardadas.v}, respuestas v=${respuestasGuardadas.v}`
  );
}

if (
  typeof preguntasGuardadas.intento_id !== 'string' ||
  preguntasGuardadas.intento_id !== respuestasGuardadas.intento_id
) {
  problemas.push('las dos claves del intento no traen el mismo intento_id');
}

if (!Array.isArray(preguntasGuardadas.preguntas) || preguntasGuardadas.preguntas.length !== 120) {
  problemas.push(
    `la copia congelada no trae 120 preguntas: trae ${preguntasGuardadas.preguntas?.length}`
  );
}

// Las preguntas se guardan ENTERAS: con sus alternativas y con cual era la correcta.
// Sin eso el intento no se puede corregir sin volver a pedirle el banco a nadie, que
// es justo lo que la decision 6 impide.
const sinCorrecta = (preguntasGuardadas.preguntas ?? []).filter(
  (p) =>
    !Array.isArray(p.alternativas) ||
    p.alternativas.length !== 4 ||
    p.alternativas.filter((a) => a.es_correcta === 1).length !== 1
);

if (sinCorrecta.length > 0) {
  problemas.push(
    `${sinCorrecta.length} pregunta(s) de la copia congelada no traen sus 4 alternativas con 1 correcta`
  );
}

// Y NO traen justificacion: no viajan con el intento (decision 1), las pide la 44.
const conJustificacionGuardada = (preguntasGuardadas.preguntas ?? []).filter(
  (p) => 'justificacion' in p
);

if (conJustificacionGuardada.length > 0) {
  problemas.push(
    `la copia congelada guardo ${conJustificacionGuardada.length} justificacion(es), y el intento no las lleva`
  );
}

// Los campos previstos para las tres iteraciones que vienen. Se comprueban por
// nombre y no «que haya algo»: la decision 6 los fija AHORA para no tener que subir
// de version a mitad de epica, y un campo que falte se descubre en la 42 o en la 43,
// con intentos de estudiantes reales ya guardados.
const CAMPOS_PREVISTOS = {
  empezado_en: 'iteracion 42 · tiempo transcurrido',
  posicion: 'iteracion 43 · que pregunta esta en pantalla',
  comenzada_en: 'iteracion 42 · los 30 segundos de la pregunta',
  terminado_en: 'iteraciones 42 y 44 · el final del intento',
  respuestas: 'iteracion 43 · lo respondido y lo omitido',
};

for (const [campo, para] of Object.entries(CAMPOS_PREVISTOS)) {
  if (!(campo in respuestasGuardadas)) {
    problemas.push(`al intento guardado le falta el campo «${campo}» (${para})`);
  }
}

// Y el que NO tiene que estar (decision del autor, 2026-09-18): el resultado no se
// guarda. Se recalcula desde la copia congelada y las respuestas, que ya estan las
// dos ahi. Una segunda fuente de verdad para un numero derivable es lo que ADR-034
// no admite.
if ('resultado' in respuestasGuardadas) {
  problemas.push(
    'el intento guardado trae un campo «resultado»: el resultado se recalcula, no se guarda'
  );
}

if (respuestasGuardadas.posicion !== 0 || respuestasGuardadas.respuestas.length !== 0) {
  problemas.push(
    `al empezar, el intento guardado no arranca en blanco: posicion ${respuestasGuardadas.posicion}, ` +
      `${respuestasGuardadas.respuestas.length} respuesta(s)`
  );
}

// Con almacenamiento sano no hay nada que avisar.
if (s1.final.avisoGuardado.html !== '' || !s1.final.avisoGuardado.oculto) {
  problemas.push(
    'con almacenamiento sano, el simulacro dibujo el aviso de que no se esta guardando'
  );
}

const pesoPreguntas = guardadoTrasEmpezar[CLAVE_PREGUNTAS].length;
const pesoRespuestasVacia = guardadoTrasEmpezar[CLAVE_RESPUESTAS].length;

notas.push(
  `Intento guardado al empezar: dos claves bajo examen-td-js.simulacro., version 1 dentro del ` +
    `dato, mismo intento_id en las dos, 120 preguntas congeladas con su correcta y sin ` +
    `justificaciones, los ${Object.keys(CAMPOS_PREVISTOS).length} campos previstos para la 42, la ` +
    `43 y la 44, y ningun campo «resultado». Pesan ${pesoPreguntas} y ${pesoRespuestasVacia} bytes.`
);

// --- 12b · Un cambio de respuesta reescribe SOLO su clave -----------------

const s2 = visitar({
  disco: discoSimulacro,
  pagina: 'simulacro',
  pasos: [{ tipo: 'responder', cuantas: 3 }],
});

const trasResponderTres = leerDisco(discoSimulacro);

// Byte a byte. Es la unica forma de distinguir «la clave dice lo mismo» de «la clave
// no se toco»: si se reescribiera con el mismo contenido, el estudiante pagaria 77
// KiB por respuesta y nada en el dato lo delataria.
if (trasResponderTres[CLAVE_PREGUNTAS] !== guardadoTrasEmpezar[CLAVE_PREGUNTAS]) {
  problemas.push(
    'responder reescribio la clave de las preguntas: tiene que reescribirse SOLO la de respuestas'
  );
}

const respuestasTrasTres = claveDelDisco(trasResponderTres, CLAVE_RESPUESTAS, 'tras responder 3');

if (respuestasTrasTres.posicion !== 3 || respuestasTrasTres.respuestas.length !== 3) {
  problemas.push(
    `tras responder 3, el intento guardado dice posicion ${respuestasTrasTres.posicion} y ` +
      `${respuestasTrasTres.respuestas.length} respuesta(s)`
  );
}

const CAMPOS_DE_UNA_RESPUESTA = ['pregunta_id', 'alternativa_id', 'estado', 'agotada', 'resuelta_en'];

for (const campo of CAMPOS_DE_UNA_RESPUESTA) {
  if (respuestasTrasTres.respuestas.some((r) => !(campo in r))) {
    problemas.push(`a alguna respuesta guardada le falta el campo «${campo}»`);
  }
}

// Lo anotado es lo guardado, y en el mismo orden: las tres primeras preguntas del
// intento, con la alternativa que se eligio.
const anotadasEsperadas = s2.anotadas.map((a) => [a.pregunta_id, a.alternativa_id]);
const anotadasGuardadas = respuestasTrasTres.respuestas.map((r) => [r.pregunta_id, r.alternativa_id]);

if (JSON.stringify(anotadasEsperadas) !== JSON.stringify(anotadasGuardadas)) {
  problemas.push('lo guardado no coincide con lo que se anoto, o esta en otro orden');
}

if (s2.anotadas.some((a) => !a.guardada)) {
  problemas.push('alguna respuesta no se pudo guardar con el almacenamiento sano');
}

notas.push(
  `Un cambio reescribe una sola clave: tras 3 respuestas, la de preguntas quedo byte a byte ` +
    `identica (${pesoPreguntas} bytes) y la de respuestas paso de ${pesoRespuestasVacia} a ` +
    `${trasResponderTres[CLAVE_RESPUESTAS].length} bytes, con posicion 3 y los ` +
    `${CAMPOS_DE_UNA_RESPUESTA.length} campos de cada entrada.`
);

// --- 12c · Simulando una recarga, el intento se retoma --------------------

const s3 = visitar({ disco: discoSimulacro, pagina: 'simulacro', pasos: [] });

const alAbrir = s3.pasos[0];

if (alAbrir.titulo !== 'Intento retomado') {
  problemas.push(
    `al volver con un intento a medias, la pagina no lo retomo: dijo «${alAbrir.titulo}»`
  );
  veredictoRoto();
}

// LAS MISMAS 120, EN EL MISMO ORDEN. Se compara la secuencia entera y no el conjunto:
// dos intentos con las mismas preguntas en distinto orden son intentos distintos en
// cuanto la iteracion 43 empiece a recorrerlos por posicion.
if (JSON.stringify(alAbrir.idsDelIntento) !== JSON.stringify(s1.final.idsDelIntento)) {
  const mismoConjunto =
    JSON.stringify([...alAbrir.idsDelIntento].sort((a, b) => a - b)) ===
    JSON.stringify([...s1.final.idsDelIntento].sort((a, b) => a - b));

  problemas.push(
    mismoConjunto
      ? 'el intento retomado trae las mismas 120 preguntas pero EN OTRO ORDEN'
      : 'el intento retomado no trae las mismas 120 preguntas'
  );
}

// Y no sale ni una peticion: se lee del almacen, no del banco.
if (s3.peticiones.length !== 0) {
  problemas.push(
    `retomar el intento salio a la red ${s3.peticiones.length} vez(ces): tiene que salir de lo guardado`
  );
}

// El orden guardado sigue siendo un orden MEZCLADO (decision del autor, 2026-09-18).
// Sin esto, un retomado que reordenara por modulo pasaria las dos comprobaciones de
// arriba el dia que el guardado tambien lo hiciera.
const cambiosDeModulo = alAbrir.modulosDelIntento.filter(
  (m, i) => i > 0 && m !== alAbrir.modulosDelIntento[i - 1]
).length;

if (cambiosDeModulo < 80) {
  problemas.push(
    `el intento retomado viene agrupado por modulo: solo ${cambiosDeModulo} cambios de modulo en 120`
  );
}

if (alAbrir.rotuloDelBoton !== 'Empezar otro intento') {
  problemas.push(
    `tras retomar no hay forma de empezar otro intento: el boton dice «${alAbrir.rotuloDelBoton}»`
  );
}

notas.push(
  `Retoma: al volver, la pagina dijo «Intento retomado» con las mismas 120 preguntas en el mismo ` +
    `orden —${cambiosDeModulo} cambios de modulo, o sea mezclado—, sin salir a la red ni una vez, ` +
    'y con un boton para empezar otro.'
);

// --- 12d · Con el banco cambiado entre la carga y la recarga --------------
//
// Se corrige una pregunta DEL INTENTO en el banco: se le mueve la correcta de
// alternativa, se le cambia el texto de una y se le renuevan los ids de las cuatro,
// que es lo que hace `banco:actualizar` de verdad. El intento retomado tiene que
// seguir trayendo la version que el estudiante vio.

const unaDelIntento = preguntasGuardadas.preguntas[0];
const textoQueSeCorrige = unaDelIntento.alternativas[0].texto;

const s4 = visitar({
  disco: discoSimulacro,
  pagina: 'simulacro',
  pasos: [{ tipo: 'mirar-lo-guardado' }],
  intercepcion: { tipo: 'correcta-movida', pregunta: unaDelIntento.id, texto: textoQueSeCorrige },
});

const alAbrirConBancoCambiado = s4.pasos[0];

if (
  JSON.stringify(alAbrirConBancoCambiado.correctasDelIntento) !==
  JSON.stringify(s1.final.correctasDelIntento)
) {
  problemas.push(
    'con el banco corregido entre la carga y la recarga, el intento retomado cambio de correctas: ' +
      'se esta corrigiendo con el banco de hoy y no con lo que el estudiante vio'
  );
}

if (
  JSON.stringify(alAbrirConBancoCambiado.textosCorrectos) !==
  JSON.stringify(s1.final.textosCorrectos)
) {
  problemas.push('el intento retomado cambio el texto de alguna alternativa correcta');
}

// LA PRUEBA DE QUE NO SE VOLVIO A PEDIR. Es la mitad que de verdad cierra el caso:
// si no salio ni una peticion, no hay forma de que el banco corregido haya entrado.
if (s4.peticiones.length !== 0) {
  problemas.push(
    `con el banco cambiado, la retoma salio a la red ${s4.peticiones.length} vez(ces)`
  );
}

notas.push(
  `Banco cambiado entre la carga y la recarga: con la correcta de la pregunta ${unaDelIntento.id} ` +
    'movida de alternativa y los ids de las cuatro renovados por intercepcion, el intento retomado ' +
    'conservo las 120 correctas y sus textos, y no salio a la red ni una vez.'
);

// --- 12e · Un dato corrupto o de otra version se ignora -------------------
//
// Cuatro formas de que lo guardado no se pueda entender, y las cuatro terminan igual:
// la pagina se queda en su presentacion, no lanza, y `leerIntentoGuardado()` dice que
// no hay nada. Se descarta el intento ENTERO y no entrada por entrada, porque una
// entrada rota desalinea `respuestas[i]` de `preguntas[i]` y con eso la posicion pasa
// a mentir.

const conVersionVieja = {
  [CLAVE_PREGUNTAS]: JSON.stringify({ ...preguntasGuardadas, v: 99 }),
  [CLAVE_RESPUESTAS]: JSON.stringify({ ...respuestasGuardadas, v: 99 }),
};

const conJsonRoto = {
  [CLAVE_PREGUNTAS]: guardadoTrasEmpezar[CLAVE_PREGUNTAS].slice(0, 4000),
  [CLAVE_RESPUESTAS]: guardadoTrasEmpezar[CLAVE_RESPUESTAS],
};

const conIdCruzado = {
  [CLAVE_PREGUNTAS]: guardadoTrasEmpezar[CLAVE_PREGUNTAS],
  [CLAVE_RESPUESTAS]: JSON.stringify({ ...respuestasGuardadas, intento_id: 'otro-intento' }),
};

const conEntradaRota = {
  [CLAVE_PREGUNTAS]: guardadoTrasEmpezar[CLAVE_PREGUNTAS],
  [CLAVE_RESPUESTAS]: JSON.stringify({
    ...respuestasGuardadas,
    posicion: 2,
    respuestas: [
      { pregunta_id: preguntasGuardadas.preguntas[0].id, alternativa_id: 1, estado: 'respondida', agotada: false, resuelta_en: 1789000000000 },
      { pregunta_id: 'no soy un id', alternativa_id: 1, estado: 'respondida', agotada: false, resuelta_en: 1789000000000 },
    ],
  }),
};

// Y una quinta: media copia. Solo la clave de respuestas, sin las preguntas.
const soloLaMitad = { [CLAVE_RESPUESTAS]: guardadoTrasEmpezar[CLAVE_RESPUESTAS] };

const datosRotos = [
  ['version 99', conVersionVieja],
  ['JSON truncado', conJsonRoto],
  ['intento_id cruzado', conIdCruzado],
  ['una entrada de respuesta rota', conEntradaRota],
  ['media copia: respuestas sin preguntas', soloLaMitad],
];

const visitasRotas = [];

for (const [comoEsta, contenido] of datosRotos) {
  const visita = visitar({
    disco: discoCon(`simulacro-roto-${visitasRotas.length}`, contenido),
    pagina: 'simulacro',
    pasos: [{ tipo: 'mirar-lo-guardado' }],
  });

  visitasRotas.push(visita);

  if (visita.pasos[0].titulo !== '') {
    problemas.push(
      `con ${comoEsta}, la pagina dibujo un intento en vez de quedarse en la presentacion: ` +
        `«${visita.pasos[0].titulo}»`
    );
  }

  if (visita.loGuardado !== null) {
    problemas.push(`con ${comoEsta}, leerIntentoGuardado() devolvio algo en vez de null`);
  }

  // Y en silencio, como manda ADR-034: ni aviso en pantalla ni ruido en la consola.
  if (visita.pasos[0].avisoGuardado.html !== '' || visita.avisos.length > 0) {
    problemas.push(`con ${comoEsta}, la pagina avisó de un formato interno al estudiante`);
  }
}

notas.push(
  `Dato que no se entiende: las ${datosRotos.length} formas —${datosRotos.map(([c]) => c).join(', ')}— ` +
    'se ignoran en silencio, la presentacion queda intacta y no hay error de consola.'
);

// --- 12f · Sin almacenamiento, el intento empieza y se avisa --------------

const sinAlmacen = [
  // 'ninguno' no es 'normal' ni ninguno de los dos que lanzan, asi que el DOM falso
  // se queda sin `localStorage`. Pasar `undefined` NO serviria: el valor por defecto
  // de `visitar()` es 'normal', y la visita habria corrido con un almacen sano
  // diciendo que probaba el caso sin almacen. Se descubrio provocandolo el 2026-09-18.
  ['sin localStorage', 'ninguno'],
  ['con la lectura denegada (Chrome con las cookies bloqueadas)', 'lectura-lanza'],
  ['con la escritura denegada (Safari «bloquear todas las cookies»)', 'escritura-lanza'],
];

const visitasSinAlmacen = [];

for (const [comoEs, cual] of sinAlmacen) {
  const visita = visitar({
    disco: discoCon(`simulacro-sin-almacen-${visitasSinAlmacen.length}`, {}),
    pagina: 'simulacro',
    almacen: cual,
    pasos: [{ tipo: 'comenzar' }, { tipo: 'responder', cuantas: 2 }],
  });

  visitasSinAlmacen.push(visita);

  // El intento EMPIEZA igual. Es la mitad que se olvida: avisar y no dejar estudiar
  // seria peor que no avisar.
  if (visita.pasos[1].titulo !== 'Intento listo') {
    problemas.push(
      `${comoEs}, el simulacro no pudo armar el intento: dijo «${visita.pasos[1].titulo}»`
    );
    continue;
  }

  if (visita.pasos[1].cuentasPorModulo.reduce((a, b) => a + b, 0) !== 120) {
    problemas.push(`${comoEs}, el intento no quedo con 120 preguntas`);
  }

  // Y SE AVISA. Se mira lo escrito ademas de la clase, por lo que se descubrio en la
  // etapa B: el DOM falso no arranca con las clases del HTML, asi que preguntar solo
  // por `oculto()` daria verde con el aviso apagado del todo.
  if (visita.final.avisoGuardado.html === '' || visita.final.avisoGuardado.oculto) {
    problemas.push(`${comoEs}, el simulacro no avisó de que el intento no se esta guardando`);
  } else if (!visita.final.avisoGuardado.html.includes('Tu intento no se está guardando.')) {
    problemas.push(`${comoEs}, el aviso no dice que el intento no se esta guardando`);
  } else if (!visita.final.avisoGuardado.html.includes('si recargas la página el intento se pierde')) {
    problemas.push(`${comoEs}, el aviso no dice que al recargar se pierde el intento`);
  }

  // Responder sigue funcionando toda la visita, aunque no se guarde nada.
  if (visita.anotadas.length !== 2) {
    problemas.push(`${comoEs}, no se pudo responder: el intento tiene que jugarse igual`);
  }

  if (visita.anotadas.some((a) => a.guardada)) {
    problemas.push(`${comoEs}, alguna respuesta dijo que se habia guardado`);
  }

  // Y NUNCA MEDIA COPIA: con la escritura denegada no puede quedar la clave de
  // respuestas sin la de preguntas.
  const quedo = Object.keys(visita.almacen ?? {});
  if (quedo.includes(CLAVE_RESPUESTAS) && !quedo.includes(CLAVE_PREGUNTAS)) {
    problemas.push(`${comoEs}, quedo media copia guardada: respuestas sin preguntas`);
  }
}

notas.push(
  `Sin almacenamiento: en las ${sinAlmacen.length} formas de negarse —sin localStorage, lectura ` +
    'denegada y escritura denegada— el intento se armo con 120 preguntas, se pudo responder, no ' +
    'quedo media copia guardada, y el aviso dijo que al recargar se pierde.'
);

// --- 12f-bis · El almacen tiene sitio para las respuestas y no para las preguntas ---
//
// Es el unico caso donde puede quedar MEDIA COPIA guardada, y por eso existe aparte:
// con el almacen que dice que no a todo, la clave de respuestas tampoco entraria y la
// regla se cumpliria sola. Con cupo, la copia congelada de 76,8 KiB no cabe y las
// respuestas de 12,7 KiB si. Si el sitio siguiera escribiendo respuestas despues de
// que la copia congelada no entrara, al recargar quedaria un intento con respuestas y
// sin preguntas: el peor dato posible, y el que la comprobacion cruzada tiene que
// descartar entero.

const discoJusto = discoNuevo('simulacro-cupo-justo');

const s7 = visitar({
  disco: discoJusto,
  pagina: 'simulacro',
  almacen: 'normal',
  cupo: 20000,
  pasos: [{ tipo: 'comenzar' }, { tipo: 'responder', cuantas: 2 }],
});

if (s7.pasos[1].titulo !== 'Intento listo') {
  problemas.push(
    `con el almacen sin sitio para la copia congelada, el intento no se armo: «${s7.pasos[1].titulo}»`
  );
}

const quedoConCupoJusto = Object.keys(leerDisco(discoJusto));

if (quedoConCupoJusto.length > 0) {
  problemas.push(
    'con el almacen sin sitio para la copia congelada quedo algo guardado: ' +
      `${quedoConCupoJusto.join(', ')}. Nunca media copia`
  );
}

if (s7.anotadas.some((a) => a.guardada)) {
  problemas.push(
    'con la copia congelada fuera del almacen, alguna respuesta dijo que se habia guardado'
  );
}

if (s7.final.avisoGuardado.html === '' || s7.final.avisoGuardado.oculto) {
  problemas.push(
    'con el almacen sin sitio para la copia congelada, no se avisó de que no se esta guardando'
  );
}

notas.push(
  'Nunca media copia: con un almacen de 20 000 bytes —sitio para las respuestas, no para los ' +
    '78 KiB de la copia congelada— el intento se armo y se pudo responder, no quedo NI UNA clave ' +
    'guardada, y el aviso salio.'
);

// --- 12g · Una escritura que falla a mitad del intento --------------------
//
// El caso mas realista de todos y el que no se podia provocar hasta esta etapa: el
// estudiante empieza con sitio y el almacen se llena a mitad. Se responde, se llena,
// se responde otra vez.

const discoQueSeLlena = discoNuevo('simulacro-se-llena');

const s5 = visitar({
  disco: discoQueSeLlena,
  pagina: 'simulacro',
  pasos: [
    { tipo: 'comenzar' },
    { tipo: 'responder', cuantas: 2 },
    { tipo: 'llenar-el-almacen' },
    { tipo: 'responder', cuantas: 2, desde: 2 },
  ],
});

const antesDeLlenarse = s5.anotadas.slice(0, 2);
const despuesDeLlenarse = s5.anotadas.slice(2);

if (antesDeLlenarse.some((a) => !a.guardada)) {
  problemas.push('con el almacen sano, alguna de las dos primeras respuestas no se guardo');
}

if (despuesDeLlenarse.some((a) => a.guardada)) {
  problemas.push('con el almacen lleno, alguna respuesta dijo que se habia guardado igual');
}

// EL INTENTO SIGUE. Es la mitad de la decision 7 que importa mas: se avisa y se
// sigue, no se avisa y se para.
if (s5.final.titulo !== 'Intento listo') {
  problemas.push(
    `al llenarse el almacen a mitad, el intento dejo de estar en pie: «${s5.final.titulo}»`
  );
}

if (s5.anotadas.length !== 4) {
  problemas.push('al llenarse el almacen a mitad, no se pudieron seguir anotando respuestas');
}

// Y SE DICE, con la otra frase: esta no es «no se esta guardando» sino «ya no».
if (s5.final.avisoGuardado.html === '' || s5.final.avisoGuardado.oculto) {
  problemas.push('al llenarse el almacen a mitad del intento, no aparecio ningun aviso');
} else if (!s5.final.avisoGuardado.html.includes('Tu intento ya no se está guardando.')) {
  problemas.push(
    'el aviso del almacen lleno no dice que el intento YA NO se esta guardando: ' +
      `dijo «${s5.final.avisoGuardado.html.match(/text-sm">([^<]*)</)?.[1] ?? ''}»`
  );
}

// Antes de llenarse no habia aviso: si estuviera puesto desde el principio, la
// comprobacion de arriba se cumpliria sola.
if (s5.pasos[2].avisoGuardado.html !== '') {
  problemas.push('el aviso del almacen lleno ya estaba puesto antes de llenarse');
}

// Lo que alcanzo a guardarse sigue ahi: dos respuestas, no cero y no cuatro.
const loQueQuedo = claveDelDisco(leerDisco(discoQueSeLlena), CLAVE_RESPUESTAS, 'tras llenarse el almacen');

if (loQueQuedo.respuestas.length !== 2) {
  problemas.push(
    `tras llenarse el almacen quedaron ${loQueQuedo.respuestas.length} respuestas guardadas y ` +
      'tenian que quedar las 2 que alcanzaron a escribirse'
  );
}

notas.push(
  'Almacen lleno a mitad del intento: las 2 primeras respuestas quedaron guardadas, las 2 de ' +
    'despues no, el intento siguio en pie y se pudo seguir respondiendo, y el aviso cambio a «Tu ' +
    'intento ya no se está guardando» sin haber estado puesto antes.'
);

// --- 12h · «Empezar otro intento» reemplaza el anterior -------------------

const s6 = visitar({
  disco: discoSimulacro,
  pagina: 'simulacro',
  pasos: [{ tipo: 'comenzar' }],
});

const nuevoGuardado = leerDisco(discoSimulacro);
const nuevasPreguntas = claveDelDisco(nuevoGuardado, CLAVE_PREGUNTAS, 'tras empezar otro intento');
const nuevasRespuestas = claveDelDisco(nuevoGuardado, CLAVE_RESPUESTAS, 'tras empezar otro intento');

if (s6.pasos[0].titulo !== 'Intento retomado') {
  problemas.push('la visita que empieza otro intento no partio de uno retomado');
}

if (s6.final.titulo !== 'Intento listo') {
  problemas.push(`«Empezar otro intento» no armo uno nuevo: dijo «${s6.final.titulo}»`);
}

if (nuevasPreguntas.intento_id === preguntasGuardadas.intento_id) {
  problemas.push('«Empezar otro intento» conservo el intento_id del anterior');
}

if (nuevasPreguntas.intento_id !== nuevasRespuestas.intento_id) {
  problemas.push('tras empezar otro intento, las dos claves quedaron con intento_id distinto');
}

if (nuevasRespuestas.respuestas.length !== 0 || nuevasRespuestas.posicion !== 0) {
  problemas.push('el intento nuevo heredó las respuestas del anterior');
}

notas.push(
  'Empezar otro intento: reemplaza las dos claves con un intento_id nuevo y sin heredar ninguna ' +
    'de las 3 respuestas del anterior.'
);

// --- 12h-bis · Empezar otro intento que NO se puede armar -----------------
//
// El caso que obliga a olvidar lo guardado ANTES de pedir nada, y no despues: el
// estudiante tiene un intento a medias, pulsa «Empezar otro intento», y la carga
// falla. Si el anterior siguiera en el almacen, la pantalla estaria diciendo que no
// se pudo armar ninguno mientras al recargar vuelve uno que ya se dio por perdido.
//
// Para que la carga falle de verdad hace falta que no haya NI capa NI copia: con el
// fetch caido a secas, el resumen baja a la instantanea y el intento se arma igual.
// Se usa el mismo arbol pelado que la seccion 8, por el mismo motivo.

const s8 = visitar({
  disco: discoSimulacro,
  pagina: 'simulacro',
  sitio: sitioSinInstantanea,
  caerLaRed: true,
  pasos: [{ tipo: 'comenzar' }],
});

if (s8.pasos[0].titulo !== 'Intento retomado') {
  problemas.push('la visita que falla al empezar otro intento no partio de uno retomado');
}

if (!s8.final.titulo.startsWith('No se pudo')) {
  problemas.push(
    `sin capa ni copia, el simulacro dijo «${s8.final.titulo}» en vez de explicar que no se pudo`
  );
}

const trasFallarElNuevo = Object.keys(leerDisco(discoSimulacro));

if (trasFallarElNuevo.length > 0) {
  problemas.push(
    'tras fallar «Empezar otro intento», el anterior sigue guardado: al recargar volveria un ' +
      `intento que la pantalla ya dio por perdido (${trasFallarElNuevo.join(', ')})`
  );
}

// Y al volver a abrir, la presentacion: no hay nada que retomar.
const s9 = visitar({ disco: discoSimulacro, pagina: 'simulacro', pasos: [] });

if (s9.pasos[0].titulo !== '') {
  problemas.push(
    `tras fallar «Empezar otro intento», al recargar volvio un intento: «${s9.pasos[0].titulo}»`
  );
}

notas.push(
  'Empezar otro intento que falla: sin capa ni copia, la pantalla explica que no se pudo, el ' +
    'almacen queda vacio, y al recargar sale la presentacion y no el intento viejo.'
);

// --- 12i · El intento tampoco sale del dispositivo ------------------------

const visitasDelSimulacro = [s1, s2, s3, s4, s5, s6, s7, s8, s9, ...visitasRotas, ...visitasSinAlmacen];

for (const visita of visitasDelSimulacro) {
  for (const peticion of visita.peticiones) {
    if (peticion.cuerpo !== null) {
      problemas.push(`una peticion del simulacro llevaba cuerpo: ${peticion.ruta}`);
    }
    if (!/^\/api\/preguntas\?(resumen=1|ids=[\d,]+)$/.test(peticion.ruta)) {
      problemas.push(
        `una peticion del simulacro no tiene la forma de las dos que la pagina hace: «${peticion.ruta}»`
      );
    }
  }
}

notas.push(
  `El intento no viaja: en las ${visitasDelSimulacro.length} visitas del simulacro las unicas rutas ` +
    'pedidas fueron /api/preguntas?resumen=1 y /api/preguntas?ids=…, todas sin cuerpo.'
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
