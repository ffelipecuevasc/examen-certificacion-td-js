/**
 * El resumen del simulacro, provocado con intentos de resultado conocido (iteracion 44,
 * etapa B).
 *
 * QUE PRUEBA
 *
 * Todo lo que el estudiante ve al terminar la pregunta 120: el resultado y sus cifras,
 * el desglose por modulo con su orden y su desempate, el tiempo, la revision con sus
 * plegables y sus justificaciones, el aviso de pregunta corregida o retirada, la
 * conservacion del intento terminado, y que se llega por UN solo camino.
 *
 * POR QUE UN GUION APARTE Y NO MAS BLOQUES EN `probar-cronometros.mjs`
 *
 * Decision del autor, 2026-09-22: ese guion prueba el tiempo y el recorrido, y ya tiene
 * 2020 lineas. El resumen es otro tema. Toma de alla lo que sirve —el reloj controlable,
 * el intento sembrado, la recarga con un arbol aparte por visita— sin copiar el tema.
 *
 * POR QUE NO NECESITA `datos:dev`
 *
 * Como `probar-cronometros.mjs`: el intento se siembra en el almacen de mentira y se
 * retoma, que es el camino de una recarga, y la unica peticion del resumen —las
 * justificaciones— se intercepta. Las caidas y los cambios del banco se simulan
 * interceptando, nunca tocando la base. Por eso entra en `npm run verificar` como
 * decimo comprobador.
 *
 * LAS NOTAS SOLO SE IMPRIMEN SI EL BLOQUE PASO, y las que afirman algo lo afirman con
 * el valor medido dentro (H-023).
 *
 * LO QUE ESTO NO PRUEBA, y comprueba el autor en un navegador: que el resultado se
 * entienda a la primera, que la revision se recorra comoda en un telefono, y que un
 * lector de pantalla anuncie si un plegable esta abierto.
 */
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = fileURLToPath(new URL('.', import.meta.url));
const SITIO = join(AQUI, '..', 'static', 'js');

const problemas = [];
const notas = [];

/** Cuantas preguntas tiene un intento. Un intento con 119 no es corto: esta roto. */
const TOTAL = 120;

/**
 * Cada visita corre sobre SU PROPIA COPIA de `static/js/`, por el motivo que
 * `probar-cronometros.mjs` deja escrito: el especificador solo aisla el modulo que se
 * importa, no los que ese modulo importa por dentro, y dos visitas compartirian el
 * reloj, el almacen recordado y `elIntento`.
 */
const arbolesTemporales = [];

function arbolAparte(marca) {
  const carpeta = mkdtempSync(join(tmpdir(), `resumen-${marca}-`));
  cpSync(SITIO, carpeta, { recursive: true });
  arbolesTemporales.push(carpeta);
  return carpeta;
}

const { prepararDomFalso, almacenDeMentira, relojDeMentira } = await import(
  pathToFileURL(join(AQUI, 'dom-falso.mjs')).href
);

/** Importa un modulo del sitio sin arbol aparte, para las pruebas sin DOM. */
const delSitio = (ruta) => import(pathToFileURL(join(SITIO, ruta)).href);

/**
 * Importa o anota por que no se pudo. Un modulo que todavia no existe es un rojo con
 * nombre, no un guion que revienta: el motivo del rojo tiene que leerse.
 */
async function importarOAnotar(ruta, queEs) {
  try {
    return await delSitio(ruta);
  } catch (error) {
    problemas.push(`${queEs}: no se pudo importar static/js/${ruta} (${error.code ?? error.message})`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Intentos de juguete, de resultado conocido
// ---------------------------------------------------------------------------

/**
 * 120 preguntas, siete modulos, cuatro alternativas; la correcta es la primera.
 *
 * El modulo sale de `2 + (i % 7)`, asi que el modulo 2 trae 18 preguntas y los otros
 * seis 17: el mismo reparto que el simulacro de verdad, con la 120 en un modulo. Y las
 * posiciones de un mismo modulo quedan intercaladas con las de los demas, como en un
 * intento mezclado.
 */
function preguntasDeJuguete() {
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: 1000 + i,
    modulo: 2 + (i % 7),
    modulo_titulo: `Titulo del modulo ${2 + (i % 7)}`,
    enunciado: `Pregunta de juguete ${i + 1}`,
    alternativas: Array.from({ length: 4 }, (_, j) => ({
      id: 5000 + i * 4 + j,
      letra: 'abcd'[j],
      texto: `Alternativa ${j + 1} de la pregunta ${i + 1}`,
      es_correcta: j === 0,
    })),
  }));
}

/**
 * La respuesta a una pregunta segun una clave corta.
 *
 *   c   respondida bien                    i   respondida mal
 *   o   omitida con dos toques
 *   ac  agotada con la correcta marcada    ai  agotada con una incorrecta marcada
 *   ao  agotada sin nada marcado
 */
function respuestaSegun(pregunta, clave, resueltaEn) {
  const correcta = pregunta.alternativas.find((a) => a.es_correcta);
  const incorrecta = pregunta.alternativas.find((a) => !a.es_correcta);

  const tabla = {
    c: { alternativa_id: correcta.id, estado: 'respondida', agotada: false },
    i: { alternativa_id: incorrecta.id, estado: 'respondida', agotada: false },
    o: { alternativa_id: null, estado: 'omitida', agotada: false },
    ac: { alternativa_id: correcta.id, estado: 'respondida', agotada: true },
    ai: { alternativa_id: incorrecta.id, estado: 'respondida', agotada: true },
    ao: { alternativa_id: null, estado: 'omitida', agotada: true },
  };

  return { pregunta_id: pregunta.id, ...tabla[clave], resuelta_en: resueltaEn };
}

/**
 * Un intento terminado a partir de 120 claves, una por posicion.
 *
 * Los instantes van cada 20 segundos desde `empezadoEn`, y el ultimo es `terminadoEn`
 * si se da: asi el tiempo total queda fijado por la prueba y no por la cuenta.
 */
function intentoTerminado(claves, { empezadoEn = 1767225600000, terminadoEn } = {}) {
  const preguntas = preguntasDeJuguete();
  const final = terminadoEn ?? empezadoEn + TOTAL * 20000;

  const respuestas = preguntas.map((pregunta, i) =>
    respuestaSegun(pregunta, claves[i], i === TOTAL - 1 ? final : empezadoEn + (i + 1) * 20000)
  );

  return { preguntas, respuestas, empezado_en: empezadoEn, terminado_en: final };
}

/**
 * Reparte cuantas de cada clave por las 120 posiciones, en un orden que no las deja
 * agrupadas: se recorren con un paso coprimo con 120, asi que las correctas no quedan
 * todas al principio y un calculo que mirara solo las primeras se notaria.
 */
function clavesRepartidas(cuantas) {
  const bolsa = [];
  for (const [clave, n] of Object.entries(cuantas)) for (let k = 0; k < n; k += 1) bolsa.push(clave);

  if (bolsa.length !== TOTAL) throw new Error(`clavesRepartidas: ${bolsa.length} claves, no ${TOTAL}`);

  const claves = new Array(TOTAL);
  for (let k = 0; k < TOTAL; k += 1) claves[(k * 7) % TOTAL] = bolsa[k];
  return claves;
}

// ===========================================================================
// 1 · Las cifras cuadran, el umbral es exacto y las agotadas cuentan bien
// ===========================================================================
//
// Criterios de la etapa B: correctas + respondidas mal + omitidas = 120; 72 dicen
// «Aprobaste el simulacro» y 71 «Reprobaste el simulacro»; una agotada con alternativa
// marcada cuenta segun esa alternativa y una agotada sin alternativa, como omitida.
//
// Se prueba sobre el CALCULO, sin DOM: lo que se dibuja se prueba mas abajo, y un
// rojo aqui dice que el numero esta mal antes de que nadie lo pinte.

{
  const problemasAntes = problemas.length;
  const servicio = await importarOAnotar('servicios/resultado-del-intento.js', 'cifras');

  if (servicio) {
    const { calcularResultado } = servicio;

    const casos = [
      {
        nombre: '72 correctas, 30 mal, 18 omitidas',
        cuantas: { c: 72, i: 30, o: 18 },
        esperado: { correctas: 72, incorrectas: 30, omitidas: 18, aprobado: true },
      },
      {
        nombre: '71 correctas, 31 mal, 18 omitidas',
        cuantas: { c: 71, i: 31, o: 18 },
        esperado: { correctas: 71, incorrectas: 31, omitidas: 18, aprobado: false },
      },
      {
        nombre: 'agotadas mezcladas: 60+12 correctas, 20+10 mal, 10+8 omitidas',
        cuantas: { c: 60, ac: 12, i: 20, ai: 10, o: 10, ao: 8 },
        esperado: { correctas: 72, incorrectas: 30, omitidas: 18, aprobado: true },
      },
      {
        nombre: 'todo omitido',
        cuantas: { o: 60, ao: 60 },
        esperado: { correctas: 0, incorrectas: 0, omitidas: 120, aprobado: false },
      },
      {
        nombre: 'todo bien',
        cuantas: { c: 100, ac: 20 },
        esperado: { correctas: 120, incorrectas: 0, omitidas: 0, aprobado: true },
      },
    ];

    const medidos = [];

    for (const { nombre, cuantas, esperado } of casos) {
      const claves = clavesRepartidas(cuantas);
      const r = calcularResultado(intentoTerminado(claves));

      const suma = r.correctas + r.incorrectas + r.omitidas;
      medidos.push(`${nombre} → ${r.correctas}/${r.incorrectas}/${r.omitidas}, ${r.aprobado ? 'aprueba' : 'reprueba'}`);

      if (suma !== TOTAL || r.total !== TOTAL) {
        problemas.push(`cifras («${nombre}»): suman ${suma} y el total dice ${r.total}, no ${TOTAL}`);
      }

      for (const campo of ['correctas', 'incorrectas', 'omitidas', 'aprobado']) {
        if (r[campo] !== esperado[campo]) {
          problemas.push(`cifras («${nombre}»): ${campo} dio ${r[campo]} y tenia que dar ${esperado[campo]}`);
        }
      }

      // Y pregunta por pregunta, que es lo que la revision va a dibujar: cada clave
      // tiene que caer en su estado. Una agotada con la correcta marcada es correcta,
      // con una incorrecta es incorrecta, y sin nada es omitida.
      const estadoEsperado = { c: 'correcta', ac: 'correcta', i: 'incorrecta', ai: 'incorrecta', o: 'omitida', ao: 'omitida' };
      const malClasificadas = (r.porPregunta ?? []).filter((p, k) => p.estado !== estadoEsperado[claves[k]]);

      if ((r.porPregunta ?? []).length !== TOTAL || malClasificadas.length > 0) {
        problemas.push(
          `cifras («${nombre}»): ${malClasificadas.length} pregunta(s) en un estado que no es el de su ` +
            `respuesta, de ${(r.porPregunta ?? []).length} clasificadas`
        );
      }
    }

    // El borde exacto, dicho como el estudiante lo va a leer.
    if (servicio.CORRECTAS_PARA_APROBAR !== 72) {
      problemas.push(`cifras: el umbral exportado es ${servicio.CORRECTAS_PARA_APROBAR} y la decision 1 dice 72`);
    }

    if (problemas.length === problemasAntes) {
      notas.push(`Cifras: ${medidos.join('; ')}. Cada una suma 120 y cada pregunta cae en el estado de su respuesta.`);
    }
  }
}

// ===========================================================================
// 2 · El desglose suma 120 y respeta el orden y el desempate de la decision 7
// ===========================================================================
//
// De peor a mejor por porcentaje de correctas; a igual porcentaje, primero el modulo
// con mas omitidas; si sigue el empate, por numero de modulo.
//
// EL INTENTO ESTA CONSTRUIDO PARA EMPATAR, y cada empate prueba una regla:
//
//   modulo 7   5 de 17 bien      29,4 %   el peor, sin discusion
//   modulo 4  10 de 17, 5 omit.  58,8 %   empata en % con 3, 5 y 6; gana por omitidas
//   modulo 3  10 de 17, 2 omit.  58,8 %   empata con 5 en % Y en omitidas: va por numero
//   modulo 5  10 de 17, 2 omit.  58,8 %
//   modulo 6  10 de 17, 1 omit.  58,8 %   7 errores
//   modulo 2  11 de 18, 0 omit.  61,1 %   TAMBIEN 7 errores: por cantidad empataria con 6
//   modulo 8  17 de 17           100 %    el mejor
//
// El par 6 / 2 es el que la decision 7 nombra: un modulo trae 18 y los demas 17, asi
// que ordenar por cantidad de errores los dejaria empatados, y por porcentaje no.

/** Las claves de un intento donde cada modulo recibe las suyas, en sus posiciones. */
function clavesPorModulo(porModulo) {
  const claves = new Array(TOTAL);
  const posiciones = new Map();

  for (let i = 0; i < TOTAL; i += 1) {
    const modulo = 2 + (i % 7);
    if (!posiciones.has(modulo)) posiciones.set(modulo, []);
    posiciones.get(modulo).push(i);
  }

  for (const [modulo, cuantas] of Object.entries(porModulo)) {
    const bolsa = [];
    for (const [clave, n] of Object.entries(cuantas)) for (let k = 0; k < n; k += 1) bolsa.push(clave);

    const suyas = posiciones.get(Number(modulo));
    if (bolsa.length !== suyas.length) {
      throw new Error(`clavesPorModulo: el modulo ${modulo} trae ${suyas.length} y se le dieron ${bolsa.length}`);
    }

    // Al reves que el orden de las posiciones, para que la primera del modulo no sea
    // siempre la misma clase de respuesta.
    suyas.forEach((posicion, k) => {
      claves[posicion] = bolsa[bolsa.length - 1 - k];
    });
  }

  return claves;
}

{
  const problemasAntes = problemas.length;
  const servicio = await importarOAnotar('servicios/resultado-del-intento.js', 'desglose');

  if (servicio) {
    const conEmpates = {
      2: { c: 11, i: 7 },
      3: { c: 10, i: 5, o: 2 },
      4: { c: 10, i: 2, o: 3, ao: 2 },
      5: { c: 10, i: 3, ai: 2, ao: 2 },
      6: { c: 10, i: 6, o: 1 },
      7: { c: 3, ac: 2, i: 10, o: 2 },
      8: { c: 17 },
    };

    const esperado = [
      { modulo: 7, total: 17, correctas: 5, incorrectas: 10, omitidas: 2 },
      { modulo: 4, total: 17, correctas: 10, incorrectas: 2, omitidas: 5 },
      { modulo: 3, total: 17, correctas: 10, incorrectas: 5, omitidas: 2 },
      { modulo: 5, total: 17, correctas: 10, incorrectas: 5, omitidas: 2 },
      { modulo: 6, total: 17, correctas: 10, incorrectas: 6, omitidas: 1 },
      { modulo: 2, total: 18, correctas: 11, incorrectas: 7, omitidas: 0 },
      { modulo: 8, total: 17, correctas: 17, incorrectas: 0, omitidas: 0 },
    ];

    const r = servicio.calcularResultado(intentoTerminado(clavesPorModulo(conEmpates)));
    const desglose = r.desglose ?? [];

    const orden = desglose.map((f) => f.modulo).join(', ');
    const ordenEsperado = esperado.map((f) => f.modulo).join(', ');

    if (orden !== ordenEsperado) {
      problemas.push(`desglose: el orden es [${orden}] y la decision 7 da [${ordenEsperado}]`);
    }

    for (const fila of esperado) {
      const medida = desglose.find((f) => f.modulo === fila.modulo);

      for (const campo of ['total', 'correctas', 'incorrectas', 'omitidas']) {
        if (medida?.[campo] !== fila[campo]) {
          problemas.push(
            `desglose: el modulo ${fila.modulo} dice ${medida?.[campo]} ${campo} y tenia ${fila[campo]}`
          );
        }
      }
    }

    const suma = (campo) => desglose.reduce((s, f) => s + (f[campo] ?? 0), 0);

    if (suma('total') !== TOTAL) problemas.push(`desglose: los modulos suman ${suma('total')} preguntas, no 120`);
    if (suma('correctas') !== r.correctas || suma('incorrectas') !== r.incorrectas || suma('omitidas') !== r.omitidas) {
      problemas.push('desglose: las cifras por modulo no suman las del resultado global');
    }

    // El titulo del modulo viaja con la fila: el resumen nombra el modulo (decision 6),
    // y sale de la copia congelada, no de una lista escrita en el componente.
    if (desglose.some((f) => f.modulo_titulo !== `Titulo del modulo ${f.modulo}`)) {
      problemas.push('desglose: alguna fila no trae el titulo de su modulo desde la copia congelada');
    }

    if (problemas.length === problemasAntes) {
      notas.push(
        `Desglose: orden [${orden}], que es el de la decision 7 — 4 antes que 3 por omitidas, 3 antes que 5 por ` +
          'numero, y 6 antes que 2 con los mismos 7 errores porque 10/17 es peor que 11/18. Suma 120.'
      );
    }
  }
}

// ===========================================================================
// 3 · El tiempo total y el promedio por pregunta (B1)
// ===========================================================================
//
// B1, decidida por el autor el 2026-09-22: el total es `terminado_en - empezado_en`, el
// promedio es el total dividido por 120, los dos con el formato de la franja, y una
// linea dice que cada pregunta tenia 30 segundos.
//
// Dos casos: 45 minutos justos —2 700 000 ms, promedio 22 500 ms, «00:22» porque la
// franja trunca el segundo— y los 60 minutos del intento entero agotado, que es el
// maximo que el sobrante perdido permite: «1:00:00» —la franja pasa a H:MM:SS desde la
// hora, y B1 manda el mismo formato— y «00:30».
//
// Aqui se mira el calculo y lo que dibuja la pieza del resumen con un resultado
// calculado. Que los instantes sean los que el reloj controlable dejo al terminar un
// intento jugado se mira en la prueba 5, sobre el recorrido.

const T0 = 1767225600000;

/** El texto de un nodo marcado con `data-papel`, leido del HTML dibujado. */
const textoDelPapel = (html, papel) =>
  html.match(new RegExp(`data-papel="${papel}"[^>]*>([^<]*)<`))?.[1]?.trim() ?? null;

{
  const problemasAntes = problemas.length;
  const servicio = await importarOAnotar('servicios/resultado-del-intento.js', 'tiempo');
  const maqueta = await importarOAnotar('components/simulacro-maqueta.js', 'tiempo');

  if (servicio && maqueta) {
    const casos = [
      { nombre: '45 minutos', terminadoEn: T0 + 2700000, total: 2700000, promedio: 22500, textos: ['45:00', '00:22'] },
      { nombre: '60 minutos', terminadoEn: T0 + 3600000, total: 3600000, promedio: 30000, textos: ['1:00:00', '00:30'] },
    ];

    const medidos = [];

    for (const caso of casos) {
      const intento = intentoTerminado(clavesRepartidas({ c: 72, i: 30, o: 18 }), {
        empezadoEn: T0,
        terminadoEn: caso.terminadoEn,
      });

      const r = servicio.calcularResultado(intento);

      if (r.tiempo?.total_ms !== caso.total || r.tiempo?.promedio_ms !== caso.promedio) {
        problemas.push(
          `tiempo («${caso.nombre}»): el calculo dio total ${r.tiempo?.total_ms} ms y promedio ` +
            `${r.tiempo?.promedio_ms} ms, y tenia que dar ${caso.total} y ${caso.promedio}`
        );
      }

      const html = maqueta.dibujarPantallaDelResumen({ resultado: r });
      const total = textoDelPapel(html, 'tiempo-total');
      const promedio = textoDelPapel(html, 'tiempo-promedio');

      if (total !== caso.textos[0] || promedio !== caso.textos[1]) {
        problemas.push(
          `tiempo («${caso.nombre}»): el resumen dibuja total «${total}» y promedio «${promedio}», ` +
            `y tenia que dibujar «${caso.textos[0]}» y «${caso.textos[1]}»`
        );
      }

      if (!/Cada pregunta tenía 30 segundos/.test(html)) {
        problemas.push(`tiempo («${caso.nombre}»): el resumen no dice que cada pregunta tenia 30 segundos (B1)`);
      }

      medidos.push(`${caso.nombre} → «${total}» y «${promedio}»`);
    }

    if (problemas.length === problemasAntes) {
      notas.push(`Tiempo: ${medidos.join('; ')}, con la linea de los 30 segundos por pregunta.`);
    }
  }
}

// ===========================================================================
// 4 · Que cuenta como «pregunta corregida despues del intento» (decision 9)
// ===========================================================================
//
// Cuenta si cambio algo que el estudiante leyo: el enunciado, el texto de alguna
// alternativa, cual es la correcta comparada por texto, o que ya no este activa.
// NO cuentan los ids de las alternativas renovados sin tocar sus textos —la regla de
// ADR-034, y lo que `banco:actualizar` hace a la primera correccion— ni el orden de las
// alternativas, que se barajan igual (ADR-006). La justificacion no entra.
//
// Y un matiz decidido por el autor el 2026-09-22: «retirada» solo se afirma si la
// version vigente vino de la capa. Si vino de la copia, una pregunta que falta puede
// ser una que la copia todavia no tiene, y eso no es lo mismo.
//
// Cada caso se construye a partir de la copia congelada y la nota imprime lo que la
// funcion DEVOLVIO en cada uno, no lo que se esperaba.

{
  const problemasAntes = problemas.length;
  const servicio = await importarOAnotar('servicios/resultado-del-intento.js', 'comparacion');

  if (servicio && typeof servicio.compararConLaVigente !== 'function') {
    problemas.push('comparacion: servicios/resultado-del-intento.js no exporta compararConLaVigente()');
  }

  if (servicio && typeof servicio.compararConLaVigente === 'function') {
    const { compararConLaVigente } = servicio;
    const congelada = preguntasDeJuguete()[40];

    /** Una copia profunda de la congelada, con la justificacion que trae el banco. */
    const vigenteDe = (pregunta) => ({
      ...structuredClone(pregunta),
      justificacion: 'La justificacion del banco vigente.',
    });

    const renovarIds = (p) => {
      p.alternativas = p.alternativas.map((a, k) => ({ ...a, id: 90000 + k }));
      return p;
    };
    const invertirOrden = (p) => {
      p.alternativas = [...p.alternativas].reverse();
      return p;
    };

    const casos = [
      { nombre: 'identica', vigente: vigenteDe(congelada), esperado: 'igual' },
      { nombre: 'ids de alternativa renovados, textos intactos', vigente: renovarIds(vigenteDe(congelada)), esperado: 'igual' },
      { nombre: 'orden de alternativas cambiado', vigente: invertirOrden(vigenteDe(congelada)), esperado: 'igual' },
      {
        nombre: 'ids renovados + orden cambiado + otra justificacion',
        vigente: (() => {
          const p = invertirOrden(renovarIds(vigenteDe(congelada)));
          p.justificacion = 'Una justificacion reescrita entera.';
          return p;
        })(),
        esperado: 'igual',
      },
      {
        nombre: 'enunciado cambiado',
        vigente: (() => {
          const p = vigenteDe(congelada);
          p.enunciado = `${p.enunciado} (corregido)`;
          return p;
        })(),
        esperado: 'corregida',
      },
      {
        nombre: 'texto de una alternativa incorrecta distinto',
        vigente: (() => {
          const p = vigenteDe(congelada);
          p.alternativas[2].texto = `${p.alternativas[2].texto}.`;
          return p;
        })(),
        esperado: 'corregida',
      },
      {
        nombre: 'texto de la alternativa correcta distinto',
        vigente: (() => {
          const p = vigenteDe(congelada);
          p.alternativas[0].texto = 'Un texto nuevo para la correcta';
          return p;
        })(),
        esperado: 'corregida',
      },
      {
        nombre: 'correcta movida a otra alternativa, mismos textos',
        vigente: (() => {
          const p = vigenteDe(congelada);
          p.alternativas[0].es_correcta = false;
          p.alternativas[3].es_correcta = true;
          return p;
        })(),
        esperado: 'corregida',
      },
      {
        nombre: 'correcta movida, con ids renovados y orden cambiado',
        vigente: (() => {
          const p = invertirOrden(renovarIds(vigenteDe(congelada)));
          for (const a of p.alternativas) a.es_correcta = a.texto === congelada.alternativas[1].texto;
          return p;
        })(),
        esperado: 'corregida',
      },
      {
        // `es_correcta` llega como 1/0 desde D1 y como true/false en otros caminos. Es
        // el mismo dato, y no puede leerse como un cambio.
        nombre: 'es_correcta como 1/0 en vez de true/false',
        vigente: (() => {
          const p = vigenteDe(congelada);
          for (const a of p.alternativas) a.es_correcta = a.es_correcta ? 1 : 0;
          return p;
        })(),
        esperado: 'igual',
      },
      { nombre: 'ausente, desde la capa', vigente: undefined, opciones: { desdeLaCopia: false }, esperado: 'retirada' },
      { nombre: 'ausente, desde la copia', vigente: undefined, opciones: { desdeLaCopia: true }, esperado: 'desconocida' },
    ];

    const medidos = [];

    for (const { nombre, vigente, opciones, esperado } of casos) {
      let dio;
      try {
        dio = compararConLaVigente(congelada, vigente, opciones);
      } catch (error) {
        dio = `lanzo ${error.message}`;
      }

      medidos.push(`${nombre} → ${dio}`);

      if (dio !== esperado) {
        problemas.push(`comparacion («${nombre}»): dio «${dio}» y la decision 9 dice «${esperado}»`);
      }
    }

    // Y la copia congelada no se toco: comparar no puede escribir sobre lo que el
    // estudiante vio, que es de donde sale el resultado.
    if (JSON.stringify(congelada) !== JSON.stringify(preguntasDeJuguete()[40])) {
      problemas.push('comparacion: compararConLaVigente() modifico la copia congelada');
    }

    if (problemas.length === problemasAntes) {
      notas.push(`Comparacion (decision 9), lo que devolvio en cada caso: ${medidos.join('; ')}.`);
    }
  }
}

// ---------------------------------------------------------------------------
// El recorrido de verdad, para las pruebas 5 a 10
// ---------------------------------------------------------------------------

/**
 * Deja en un almacen un intento a punto de terminar —o terminado—, escrito a mano.
 *
 * `hechas` es cuantas preguntas ya estan resueltas, con las claves de `claves` y un
 * instante cada 20 segundos. Con 120 el intento esta terminado y `terminado_en` es el
 * instante de la ultima.
 */
function sembrar(almacen, { claves, hechas, empezadoEn = T0, comenzadaEn, terminadoEn, preguntas = preguntasDeJuguete(), intentoId = 'resumen-1' }) {
  const respuestas = preguntas.slice(0, hechas).map((pregunta, i) =>
    respuestaSegun(
      pregunta,
      claves[i],
      i === TOTAL - 1 && terminadoEn !== undefined ? terminadoEn : empezadoEn + (i + 1) * 20000
    )
  );

  almacen.datos.set(
    'examen-td-js.simulacro.preguntas',
    JSON.stringify({ v: 1, intento_id: intentoId, guardado_en: empezadoEn, preguntas })
  );

  almacen.datos.set(
    'examen-td-js.simulacro.respuestas',
    JSON.stringify({
      v: 1,
      intento_id: intentoId,
      empezado_en: empezadoEn,
      posicion: hechas,
      comenzada_en: comenzadaEn ?? respuestas.at(-1)?.resuelta_en ?? empezadoEn,
      terminado_en: hechas === TOTAL ? respuestas.at(-1).resuelta_en : null,
      respuestas,
    })
  );

  return preguntas;
}

/**
 * La capa de datos de mentira: contesta `?ids=…` con las preguntas que se le den.
 *
 * `vigentes` es el banco vigente, por id. Lo que no este ahi no vuelve, igual que el
 * extremo con una pregunta retirada. Anota cada ruta pedida, para poder contar.
 */
function capaDeMentira({ vigentes, pedidas = [], caida = false, retener = null } = {}) {
  return async (ruta) => {
    const texto = String(ruta);
    pedidas.push(texto);

    if (caida) throw new Error('capa caida a proposito');
    if (retener) await retener;

    const ids = (texto.match(/[?&]ids=([^&]*)/)?.[1] ?? '').split(',').filter(Boolean).map(Number);
    const conJustificacion = /[?&]con=justificacion(&|$)/.test(texto);

    const datos = ids
      .map((id) => vigentes.get(id))
      .filter(Boolean)
      .sort((a, b) => a.id - b.id)
      .map((p) => (conJustificacion ? p : (({ justificacion, ...resto }) => resto)(p)));

    return new Response(JSON.stringify({ ok: true, datos, meta: { origen: 'd1', vacio: datos.length === 0 } }), {
      headers: { 'content-type': 'application/json' },
    });
  };
}

/** El banco vigente de juguete: la copia congelada tal cual, con una justificacion por id. */
function bancoVigenteDe(preguntas) {
  return new Map(preguntas.map((p) => [p.id, { ...structuredClone(p), justificacion: `Por que de la pregunta ${p.id}.` }]));
}

let visitas = 0;

/**
 * Monta una visita: reloj de mentira, DOM falso, el sitio desde su propio arbol, y los
 * tres enganches que `simulacro-main.js` conecta, en su mismo orden.
 */
async function montarVisita({ almacen, desde, fetch: laCapa } = {}) {
  const marca = `v${(visitas += 1)}`;
  const reloj = relojDeMentira({ desde });
  const dom = prepararDomFalso({ almacen, reloj });

  if (laCapa) globalThis.fetch = laCapa;

  const arbol = arbolAparte(marca);
  const cargar = (ruta) => import(pathToFileURL(join(arbol, ruta)).href);

  (await cargar('servicios/reloj.js')).usarReloj(reloj);
  const simulacro = await cargar('components/simulacro.js');

  simulacro.conectarComienzo();
  simulacro.conectarElRecorrido();
  simulacro.retomarElIntento();

  return { reloj, dom, simulacro, cargar, arbol };
}

/** Pulsa un control del recorrido por delegacion, como `probar-cronometros.mjs`. */
function pulsar(dom, papel, datos = {}) {
  const selector = `[data-papel="${papel}"]`;
  const nodo = { dataset: Object.fromEntries(Object.entries(datos).map(([k, v]) => [k, String(v)])) };

  return dom.disparar('#zona-del-intento', 'click', {
    target: { closest: (s) => (s === selector ? nodo : null) },
  });
}

/** Deja correr las promesas pendientes: la revision llega por una peticion. */
async function esperarLaRed(veces = 20) {
  for (let k = 0; k < veces; k += 1) await new Promise((r) => setTimeout(r, 5));
}

/** Lo que el resultado global dice, leido del HTML dibujado. */
const loQueDiceElResultado = (html) => ({
  resumen: html.includes('data-papel="pantalla-del-resumen"'),
  terminado: html.includes('Intento terminado'),
  cifra: Number(textoDelPapel(html, 'cifra-del-resultado')),
  aprueba: html.includes('Aprobaste el simulacro'),
  reprueba: html.includes('Reprobaste el simulacro'),
  total: textoDelPapel(html, 'tiempo-total'),
  promedio: textoDelPapel(html, 'tiempo-promedio'),
});

// Las claves del recorrido: 72 bien, 30 mal y 18 omitidas repartidas, y la 120 cae en
// una correcta (`clavesRepartidas` pone la 18ª de la bolsa en la posicion 119). Asi,
// terminar marcando la correcta da 72 —el borde de arriba— y dejarla agotar sin marcar
// da 71, el de abajo: el umbral se prueba tambien sobre el recorrido.
const CLAVES_DEL_RECORRIDO = clavesRepartidas({ c: 72, i: 30, o: 18 });

// ===========================================================================
// 5 · Al resolverse la 120 se dibuja el resumen, por un solo camino (B4)
// ===========================================================================
//
// B4, decidida por el autor el 2026-09-22: se conserva `dibujarElRecorrido()` sin
// pregunta —cubre el final en vivo, la recarga, el intento sin arriendo y el que no se
// guarda— y `alTerminarElIntento` desaparece de `simulacro.js` y de `cronometros.js`.
//
// Se provoca por los tres caminos por los que se puede llegar: «Siguiente» sobre la 120,
// la 120 agotandose sola, y una recarga con el intento ya terminado. En los tres la zona
// se escribe UNA vez con el resumen, y nunca con «Intento terminado».
//
// Y el tiempo sale aqui de los instantes que dejo el reloj controlable: la 120 empezo a
// los 44:40 y se resuelve a los 45:00 justos.

{
  const problemasAntes = problemas.length;
  const medidos = [];
  const preguntas = preguntasDeJuguete();
  const vigentes = bancoVigenteDe(preguntas);

  // --- 5a · «Siguiente» sobre la 120, con la correcta marcada ----------------
  {
    const almacen = almacenDeMentira();
    sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 119, comenzadaEn: T0 + 2680000 });

    const { reloj, dom } = await montarVisita({ almacen, desde: T0 + 2690000, fetch: capaDeMentira({ vigentes }) });
    reloj.avanzar(10000);

    pulsar(dom, 'alternativa', { alternativa: preguntas[119].alternativas[0].id });

    const antes = dom.escrituras('#zona-del-intento');
    pulsar(dom, 'siguiente');
    const escrituras = dom.escrituras('#zona-del-intento') - antes;

    const dice = loQueDiceElResultado(dom.html('#zona-del-intento'));

    if (!dice.resumen || dice.terminado) {
      problemas.push(`un solo camino («Siguiente»): al resolver la 120 la zona no dibujo el resumen (${dice.terminado ? 'dibujo «Intento terminado»' : 'no hay pantalla-del-resumen'})`);
    }
    if (escrituras !== 1) {
      problemas.push(`un solo camino («Siguiente»): la zona se escribio ${escrituras} veces al resolver la 120, y es una`);
    }
    if (dice.cifra !== 72 || !dice.aprueba || dice.reprueba) {
      problemas.push(`un solo camino («Siguiente»): el resultado dice ${dice.cifra} y tenia que decir 72 con «Aprobaste el simulacro»`);
    }
    if (dice.total !== '45:00' || dice.promedio !== '00:22') {
      problemas.push(`un solo camino («Siguiente»): el tiempo dice «${dice.total}» y «${dice.promedio}», y el reloj dejo 45:00 y 00:22`);
    }

    medidos.push(`«Siguiente» → ${escrituras} escritura, ${dice.cifra} correctas, ${dice.total} / ${dice.promedio}`);
    await esperarLaRed();
  }

  // --- 5b · La 120 se agota sin nada marcado --------------------------------
  {
    const almacen = almacenDeMentira();
    sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 119, comenzadaEn: T0 + 2670000 });

    const { reloj, dom } = await montarVisita({ almacen, desde: T0 + 2690000, fetch: capaDeMentira({ vigentes }) });

    const antes = dom.escrituras('#zona-del-intento');
    reloj.avanzar(10000);
    const escrituras = dom.escrituras('#zona-del-intento') - antes;

    const dice = loQueDiceElResultado(dom.html('#zona-del-intento'));

    if (!dice.resumen || dice.terminado) {
      problemas.push(`un solo camino (agotada): al agotarse la 120 la zona no dibujo el resumen (${dice.terminado ? 'dibujo «Intento terminado»' : 'no hay pantalla-del-resumen'})`);
    }
    if (escrituras !== 1) {
      problemas.push(`un solo camino (agotada): la zona se escribio ${escrituras} veces al agotarse la 120, y es una`);
    }
    if (dice.cifra !== 71 || !dice.reprueba || dice.aprueba) {
      problemas.push(`un solo camino (agotada): el resultado dice ${dice.cifra} y tenia que decir 71 con «Reprobaste el simulacro»`);
    }
    if (dice.total !== '45:00') {
      problemas.push(`un solo camino (agotada): el tiempo total dice «${dice.total}» y la 120 vencio a los 45:00`);
    }
    if (dom.html('#franja-del-simulacro') !== '') {
      problemas.push('un solo camino (agotada): la franja del cronometro sigue escrita sobre el resumen');
    }
    if (reloj.pendientes() !== 0) {
      problemas.push(`un solo camino (agotada): quedaron ${reloj.pendientes()} temporizador(es) vivos con el intento terminado`);
    }

    medidos.push(`agotada → ${escrituras} escritura, ${dice.cifra} correctas, ${dice.total}`);
    await esperarLaRed();
  }

  // --- 5c · Recarga con el intento ya terminado ------------------------------
  {
    const almacen = almacenDeMentira();
    sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 120, terminadoEn: T0 + 2700000 });

    const { reloj, dom } = await montarVisita({ almacen, desde: T0 + 5000000, fetch: capaDeMentira({ vigentes }) });
    const dice = loQueDiceElResultado(dom.html('#zona-del-intento'));

    if (!dice.resumen || dice.terminado) {
      problemas.push('un solo camino (recarga): un intento terminado se retomo sin dibujar el resumen');
    }
    if (dom.escrituras('#zona-del-intento') !== 1) {
      problemas.push(`un solo camino (recarga): la zona se escribio ${dom.escrituras('#zona-del-intento')} veces al retomar, y es una`);
    }
    if (dice.total !== '45:00') {
      problemas.push(`un solo camino (recarga): el tiempo total dice «${dice.total}», y es el del intento (45:00), no el de ahora`);
    }

    // Un intento terminado no enciende ni cronometros ni arriendo (B4): no queda nada
    // que contar, y un arriendo bloquearia el resumen en otra pestana.
    if (reloj.pendientes() !== 0) {
      problemas.push(`un solo camino (recarga): retomar un intento terminado dejo ${reloj.pendientes()} temporizador(es) puestos`);
    }
    if (almacen.datos.has('examen-td-js.simulacro.dueno')) {
      problemas.push('un solo camino (recarga): retomar un intento terminado tomo el arriendo de la pestana');
    }

    medidos.push(`recarga → ${dom.escrituras('#zona-del-intento')} escritura, ${dice.total}, ${reloj.pendientes()} temporizadores`);
    await esperarLaRed();
  }

  // --- 5d · El otro camino ya no existe --------------------------------------
  for (const nombre of ['simulacro.js', 'cronometros.js']) {
    const fuente = readFileSync(join(SITIO, 'components', nombre), 'utf8');
    if (/alTerminarElIntento/.test(fuente)) {
      problemas.push(`un solo camino: components/${nombre} sigue nombrando alTerminarElIntento`);
    }
  }

  const simulacroFuente = readFileSync(join(SITIO, 'components', 'simulacro.js'), 'utf8');
  if (/Intento terminado/.test(simulacroFuente)) {
    problemas.push('un solo camino: components/simulacro.js sigue teniendo la pantalla «Intento terminado»');
  }

  if (problemas.length === problemasAntes) {
    notas.push(`Un solo camino (B4): ${medidos.join('; ')}. alTerminarElIntento y «Intento terminado» ya no existen.`);
  }
}

// ===========================================================================
// 6 · Al llegar al resumen, el foco queda en el titulo del resultado (B2)
// ===========================================================================
//
// B2, decidida por el autor el 2026-09-22: al titulo del resultado, con el mismo gesto
// que la decision 4 de la 43 usa para el cambio de pregunta, y sin `aria-live`. Quien
// navega con teclado o lector de pantalla tenia el foco en «Siguiente» o en la tarjeta
// de la 120; el redibujo los destruye, y sin mover el foco caeria al `body`.
//
// Se mira en los tres caminos, y otra vez despues de que llegue la revision: que la
// revision se complete no puede tirarle el foco a nadie.

{
  const problemasAntes = problemas.length;
  const preguntas = preguntasDeJuguete();
  const vigentes = bancoVigenteDe(preguntas);
  const medidos = [];

  const caminos = [
    {
      nombre: '«Siguiente»',
      preparar: (almacen) => sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 119, comenzadaEn: T0 + 2680000 }),
      desde: T0 + 2690000,
      jugar: ({ dom }) => {
        pulsar(dom, 'alternativa', { alternativa: preguntas[119].alternativas[0].id });
        pulsar(dom, 'siguiente');
      },
    },
    {
      nombre: 'agotada',
      preparar: (almacen) => sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 119, comenzadaEn: T0 + 2670000 }),
      desde: T0 + 2690000,
      jugar: ({ reloj }) => reloj.avanzar(10000),
    },
    {
      nombre: 'recarga',
      preparar: (almacen) => sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 120, terminadoEn: T0 + 2700000 }),
      desde: T0 + 5000000,
      jugar: () => {},
    },
  ];

  for (const camino of caminos) {
    const almacen = almacenDeMentira();
    camino.preparar(almacen);

    const visita = await montarVisita({ almacen, desde: camino.desde, fetch: capaDeMentira({ vigentes }) });
    camino.jugar(visita);

    const alLlegar = visita.dom.enfocado();
    await esperarLaRed();
    const despues = visita.dom.enfocado();

    if (alLlegar !== '#titulo-del-resultado') {
      problemas.push(`foco (${camino.nombre}): al llegar al resumen quedo en «${alLlegar}» y B2 lo lleva al titulo del resultado`);
    }
    if (despues !== alLlegar) {
      problemas.push(`foco (${camino.nombre}): al completarse la revision el foco se movio de «${alLlegar}» a «${despues}»`);
    }

    medidos.push(`${camino.nombre} → ${alLlegar}`);
  }

  // Y el titulo puede recibirlo: sin `tabindex="-1"`, un `h2` no toma el foco en el
  // navegador aunque el DOM falso diga que si.
  const html = (await delSitio('components/simulacro-maqueta.js')).dibujarPantallaDelResumen({
    resultado: (await delSitio('servicios/resultado-del-intento.js')).calcularResultado(
      intentoTerminado(CLAVES_DEL_RECORRIDO)
    ),
  });

  if (!/<h2 id="titulo-del-resultado"[^>]*tabindex="-1"/.test(html)) {
    problemas.push('foco: el titulo del resultado no lleva tabindex="-1", y un h2 sin el no toma el foco');
  }
  if (/aria-live/.test(html)) {
    problemas.push('foco: el resumen trae aria-live, y B2 dice que se anuncia moviendo el foco y sin region viva');
  }

  if (problemas.length === problemasAntes) {
    notas.push(`Foco (B2): ${medidos.join('; ')}, y ahi sigue despues de llegar la revision. Sin aria-live.`);
  }
}

// ---------------------------------------------------------------------------
// Leer la revision dibujada
// ---------------------------------------------------------------------------

/**
 * El bloque de un modulo de la revision, tal como esta dibujado ahora.
 *
 * Si el bloque se redibujo solo —al abrir o plegar sus correctas— lo que vale es lo
 * suyo; si no, se corta del HTML de la revision entera. Es lo mismo que veria el
 * navegador: el bloque es un elemento dentro de la revision.
 */
function bloqueDelModulo(dom, modulo) {
  if (dom.escrituras(`#revision-del-modulo-${modulo}`) > 0) return dom.html(`#revision-del-modulo-${modulo}`);

  const html = dom.html('#revision-del-intento');
  const desde = html.indexOf(`id="revision-del-modulo-${modulo}"`);
  if (desde === -1) return '';

  // Hasta la seccion SIGUIENTE. No se busca su `data-papel`: el de esta misma seccion va
  // justo detras de su id, y cortar ahi dejaba el bloque vacio (visto en el primer rojo).
  const siguiente = html.indexOf('<section id="revision-del-modulo-', desde + 1);
  return html.slice(desde, siguiente === -1 ? undefined : siguiente);
}

/** Las filas de pregunta de un trozo de HTML: su id, su estado y su HTML. */
function filasDe(html) {
  return html
    .split('<li data-papel="fila-de-la-revision"')
    .slice(1)
    .map((trozo) => ({
      id: Number(trozo.match(/data-pregunta="(\d+)"/)?.[1]),
      estado: trozo.match(/data-estado="([a-z]+)"/)?.[1],
      html: trozo,
    }));
}

/** Lo que hay dentro de una lista marcada con `data-papel`, hasta su cierre. */
function listaDe(html, papel) {
  const desde = html.indexOf(`data-papel="${papel}"`);
  if (desde === -1) return null;
  const hasta = html.indexOf('</ul>', desde);
  return { apertura: html.slice(html.lastIndexOf('<', desde), html.indexOf('>', desde) + 1), dentro: html.slice(desde, hasta) };
}

// ===========================================================================
// 7 · La revision agrupa por modulo, en el orden del desglose, con sus plegables
// ===========================================================================
//
// Decision 2: agrupada por modulo, de peor a mejor; en cada modulo las incorrectas y
// las omitidas llegan abiertas y las correctas plegadas, con un control para abrirlas.
// Cada pregunta muestra la alternativa dada —o que se omitio—, la correcta y la
// justificacion. B3: el control es un `<button>` con `aria-expanded` y `aria-controls`.
//
// EL INTENTO ES EL DE LOS EMPATES DE LA PRUEBA 2, asi que el orden esperado de los
// bloques es [7, 4, 3, 5, 6, 2, 8], y el modulo 8 viene sin un solo error.
//
// CADA PREGUNTA TRAE UNA JUSTIFICACION DISTINTA —«Por que de la pregunta <id>»— para
// que un cruce se vea: si la fila de la 1003 dijera el porque de la 1010, ninguna
// comprobacion de «hay una justificacion» lo notaria.

{
  const problemasAntes = problemas.length;
  const preguntas = preguntasDeJuguete();
  const vigentes = bancoVigenteDe(preguntas);
  const pedidas = [];

  const claves = clavesPorModulo({
    2: { c: 11, i: 7 },
    3: { c: 10, i: 5, o: 2 },
    4: { c: 10, i: 2, o: 3, ao: 2 },
    5: { c: 10, i: 3, ai: 2, ao: 2 },
    6: { c: 10, i: 6, o: 1 },
    7: { c: 3, ac: 2, i: 10, o: 2 },
    8: { c: 17 },
  });

  const almacen = almacenDeMentira();
  sembrar(almacen, { claves, hechas: 120, terminadoEn: T0 + 2700000 });

  const { dom } = await montarVisita({ almacen, desde: T0 + 5000000, fetch: capaDeMentira({ vigentes, pedidas }) });

  // Antes de que llegue la respuesta, la revision dice que esta cargando y no dibuja
  // ninguna pregunta: el resultado no espera a la red, la revision si.
  if (!dom.html('#zona-del-intento').includes('data-papel="revision-cargando"')) {
    problemas.push('revision: antes de llegar las justificaciones no dice que se esta cargando');
  }

  await esperarLaRed();

  const revision = dom.html('#revision-del-intento');
  const ordenDibujado = [...revision.matchAll(/id="revision-del-modulo-(\d+)"/g)].map((m) => Number(m[1]));

  if (ordenDibujado.join(',') !== '7,4,3,5,6,2,8') {
    problemas.push(`revision: los bloques van en [${ordenDibujado.join(', ')}] y el desglose dice [7, 4, 3, 5, 6, 2, 8]`);
  }

  // UNA peticion, con las 120 y con `con=justificacion` (decision 3 y 8).
  const deRevision = pedidas.filter((r) => /con=justificacion/.test(r));
  const idsPedidos = (deRevision[0]?.match(/ids=([^&]*)/)?.[1] ?? '').split(',').filter(Boolean);

  if (pedidas.length !== 1 || deRevision.length !== 1 || idsPedidos.length !== TOTAL) {
    problemas.push(
      `revision: se hicieron ${pedidas.length} peticion(es), ${deRevision.length} con con=justificacion y ` +
        `${idsPedidos.length} ids; tenia que ser UNA, con las 120`
    );
  }

  // Modulo por modulo: que va abierto, que va plegado, y que dice cada fila.
  let filasRevisadas = 0;

  for (const modulo of [2, 3, 4, 5, 6, 7, 8]) {
    const bloque = bloqueDelModulo(dom, modulo);
    const posiciones = preguntas.map((p, i) => i).filter((i) => preguntas[i].modulo === modulo);
    const estadoDe = (i) => ({ c: 'correcta', ac: 'correcta', i: 'incorrecta', ai: 'incorrecta', o: 'omitida', ao: 'omitida' })[claves[i]];

    const esperadasAbiertas = posiciones.filter((i) => estadoDe(i) !== 'correcta').map((i) => preguntas[i].id);
    const esperadasPlegadas = posiciones.filter((i) => estadoDe(i) === 'correcta').map((i) => preguntas[i].id);

    const abiertas = listaDe(bloque, 'revision-abiertas');
    const plegadas = listaDe(bloque, 'revision-correctas');

    const idsAbiertas = filasDe(abiertas?.dentro ?? '').map((f) => f.id);
    const idsPlegadas = filasDe(plegadas?.dentro ?? '').map((f) => f.id);

    if (idsAbiertas.join(',') !== esperadasAbiertas.join(',')) {
      problemas.push(
        `revision (modulo ${modulo}): abiertas [${idsAbiertas.join(', ')}], y tenian que ser sus incorrectas y ` +
          `omitidas en el orden del intento [${esperadasAbiertas.join(', ')}]`
      );
    }
    if (idsPlegadas.join(',') !== esperadasPlegadas.join(',')) {
      problemas.push(`revision (modulo ${modulo}): plegadas [${idsPlegadas.join(', ')}], y tenian que ser sus correctas [${esperadasPlegadas.join(', ')}]`);
    }

    // B3: el control declara su estado y apunta a una lista que existe.
    const boton = bloque.match(/<button[^>]*data-papel="plegar-correctas"[^>]*>/)?.[0] ?? '';

    if (esperadasPlegadas.length > 0) {
      if (!/aria-expanded="false"/.test(boton)) {
        problemas.push(`revision (modulo ${modulo}): el control de las correctas no declara aria-expanded="false" estando plegado`);
      }
      const apunta = boton.match(/aria-controls="([^"]+)"/)?.[1];
      if (!apunta || !plegadas?.apertura.includes(`id="${apunta}"`)) {
        problemas.push(`revision (modulo ${modulo}): aria-controls «${apunta}» no es el id de la lista de correctas`);
      }
      if (!/\bhidden\b/.test(plegadas?.apertura ?? '')) {
        problemas.push(`revision (modulo ${modulo}): las correctas no llegan plegadas`);
      }
      if (!/<button type="button"|<button[^>]*type="button"/.test(boton)) {
        problemas.push(`revision (modulo ${modulo}): el control de las correctas no es un <button type="button">`);
      }
    }

    // Cada fila: lo que se dio, la correcta, y SU justificacion.
    for (const fila of [...filasDe(abiertas?.dentro ?? ''), ...filasDe(plegadas?.dentro ?? '')]) {
      filasRevisadas += 1;

      const i = preguntas.findIndex((p) => p.id === fila.id);
      const pregunta = preguntas[i];
      const correcta = pregunta.alternativas[0].texto;
      const clave = claves[i];

      if (fila.estado !== estadoDe(i)) {
        problemas.push(`revision (pregunta ${fila.id}): dice «${fila.estado}» y su respuesta es ${estadoDe(i)}`);
      }

      const loDado = {
        c: `Marcaste: ${correcta}`,
        ac: `Marcaste: ${correcta}`,
        i: `Marcaste: ${pregunta.alternativas[1].texto}`,
        ai: `Marcaste: ${pregunta.alternativas[1].texto}`,
        o: 'La omitiste.',
        ao: 'Se te acabó el tiempo sin marcar ninguna.',
      }[clave];

      if (!fila.html.includes(loDado)) {
        problemas.push(`revision (pregunta ${fila.id}, ${clave}): no dice «${loDado}»`);
      }
      if (estadoDe(i) !== 'correcta' && !fila.html.includes(`La correcta: ${correcta}`)) {
        problemas.push(`revision (pregunta ${fila.id}): no dice cual era la correcta`);
      }

      const porques = [...fila.html.matchAll(/Por que de la pregunta (\d+)\./g)].map((m) => Number(m[1]));
      if (porques.length !== 1 || porques[0] !== fila.id) {
        problemas.push(`revision (pregunta ${fila.id}): trae la justificacion de [${porques.join(', ')}] y tenia que traer la suya`);
      }
    }
  }

  if (filasRevisadas !== TOTAL) {
    problemas.push(`revision: se dibujaron ${filasRevisadas} filas de pregunta, y el intento tiene ${TOTAL}`);
  }

  // B3 en uso: abrir las correctas del modulo 3, y volver a plegarlas.
  const abrir = pulsar(dom, 'plegar-correctas', { modulo: 3 });
  const abierto = dom.html('#revision-del-modulo-3');

  if (abrir === 0) problemas.push('revision: nadie escucha el control de las correctas');
  if (!/aria-expanded="true"/.test(abierto) || /data-papel="revision-correctas"[^>]*\bhidden\b|\bhidden\b[^>]*data-papel="revision-correctas"/.test(abierto)) {
    problemas.push('revision: al pulsar el control del modulo 3, las correctas no se abrieron o aria-expanded no dice "true"');
  }
  if (dom.enfocado() !== '#plegar-correctas-3') {
    problemas.push(`revision: tras abrir las correctas el foco quedo en «${dom.enfocado()}» y no en su control`);
  }

  pulsar(dom, 'plegar-correctas', { modulo: 3 });
  const plegado = dom.html('#revision-del-modulo-3');

  if (!/aria-expanded="false"/.test(plegado) || !/\bhidden\b/.test(listaDe(plegado, 'revision-correctas')?.apertura ?? '')) {
    problemas.push('revision: al volver a pulsar, las correctas del modulo 3 no se plegaron');
  }

  // Y abrir uno no toca los otros: el 5 sigue plegado.
  if (dom.escrituras('#revision-del-modulo-5') > 0) {
    problemas.push('revision: abrir las correctas del modulo 3 redibujo tambien el modulo 5');
  }

  if (problemas.length === problemasAntes) {
    notas.push(
      `Revision: bloques en [${ordenDibujado.join(', ')}], ${filasRevisadas} filas, cada una con lo dado, la ` +
        'correcta y SU justificacion; incorrectas y omitidas abiertas, correctas plegadas con aria-expanded y ' +
        'aria-controls, y el control del modulo 3 abre, pliega y deja el foco en si mismo. Una sola peticion, con ' +
        `las ${idsPedidos.length} y con=justificacion.`
    );
  }
}

// ===========================================================================
// 8 · Con el banco cambiado despues del intento, el resultado no cambia y se avisa
// ===========================================================================
//
// Decisiones 4 y 9, y el detalle del autor del 2026-09-22: la pregunta corregida
// CONSERVA LO QUE EL ESTUDIANTE VIVIO —su estado, «Marcaste» con el texto que vio— y
// muestra la version vigente APARTE, con el aviso. La retirada se muestra congelada, con
// su aviso y sin justificacion.
//
// Se simula interceptando la respuesta del extremo, nunca tocando la base. Cuatro
// preguntas del intento cambian en el banco vigente:
//
//   la 3ª   enunciado corregido                          → aviso
//   la 10ª  correcta movida a otra alternativa           → aviso
//   la 17ª  ids de las cuatro renovados y orden al reves → SIN aviso
//   la 24ª  retirada: el extremo ya no la devuelve       → aviso de retiro

{
  const problemasAntes = problemas.length;
  const preguntas = preguntasDeJuguete();
  const vigentes = bancoVigenteDe(preguntas);

  const corregida = preguntas[2];
  const conOtraCorrecta = preguntas[9];
  const renovada = preguntas[16];
  const retirada = preguntas[23];

  vigentes.get(corregida.id).enunciado = 'Enunciado corregido en el banco vigente';

  for (const a of vigentes.get(conOtraCorrecta.id).alternativas) a.es_correcta = a.letra === 'c';

  const laRenovada = vigentes.get(renovada.id);
  laRenovada.alternativas = laRenovada.alternativas.map((a, k) => ({ ...a, id: 77000 + k })).reverse();

  vigentes.delete(retirada.id);

  const almacen = almacenDeMentira();
  sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 120, terminadoEn: T0 + 2700000 });

  const { dom } = await montarVisita({ almacen, desde: T0 + 5000000, fetch: capaDeMentira({ vigentes }) });
  await esperarLaRed();

  const zona = dom.html('#zona-del-intento');
  const filas = new Map(filasDe(dom.html('#revision-del-intento')).map((f) => [f.id, f]));

  // El resultado es el de lo que el estudiante vio: 72, como sin cambios.
  const cifra = Number(textoDelPapel(zona, 'cifra-del-resultado'));
  if (cifra !== 72) {
    problemas.push(`banco cambiado: el resultado dice ${cifra} y es 72 con o sin correcciones (decision 4)`);
  }

  const avisoDe = (fila) =>
    fila?.html.includes('data-papel="aviso-corregida"')
      ? 'corregida'
      : fila?.html.includes('data-papel="aviso-retirada"')
        ? 'retirada'
        : null;

  const conAviso = [...filas.values()].filter((f) => avisoDe(f) !== null);

  const esperados = new Map([
    [corregida.id, 'corregida'],
    [conOtraCorrecta.id, 'corregida'],
    [retirada.id, 'retirada'],
  ]);

  for (const [id, aviso] of esperados) {
    if (avisoDe(filas.get(id)) !== aviso) {
      problemas.push(`banco cambiado (pregunta ${id}): tenia que llevar el aviso «${aviso}» y lleva «${avisoDe(filas.get(id))}»`);
    }
  }

  if (avisoDe(filas.get(renovada.id)) !== null) {
    problemas.push(`banco cambiado: la pregunta ${renovada.id} solo renovo ids y cambio de orden, y lleva aviso`);
  }
  if (conAviso.length !== esperados.size) {
    problemas.push(`banco cambiado: ${conAviso.length} filas llevan aviso y tenian que ser ${esperados.size}`);
  }

  // La corregida conserva lo vivido y muestra la vigente aparte.
  const filaCorregida = filas.get(corregida.id)?.html ?? '';
  if (!filaCorregida.includes(corregida.enunciado) || !filaCorregida.includes('Enunciado corregido en el banco vigente')) {
    problemas.push('banco cambiado: la corregida no muestra a la vez el enunciado que se vio y el corregido');
  }
  if (!/data-papel="version-vigente"[\s\S]*Enunciado corregido en el banco vigente/.test(filaCorregida)) {
    problemas.push('banco cambiado: el enunciado corregido no va dentro de la version vigente, aparte');
  }
  if (!filaCorregida.includes(`Por que de la pregunta ${corregida.id}.`)) {
    problemas.push('banco cambiado: la corregida no trae la justificacion vigente');
  }

  // La de la correcta movida: «Marcaste» con lo que se vio, y la correcta de hoy aparte.
  const filaMovida = filas.get(conOtraCorrecta.id)?.html ?? '';
  const correctaDeHoy = conOtraCorrecta.alternativas[2].texto;
  if (!/data-papel="version-vigente"[\s\S]*La correcta hoy: /.test(filaMovida) || !filaMovida.includes(`La correcta hoy: ${correctaDeHoy}`)) {
    problemas.push('banco cambiado: la de la correcta movida no dice cual es la correcta hoy');
  }
  // Su estado es el que se calculo con lo que se vio. En este intento la 10ª se respondio
  // MAL (`CLAVES_DEL_RECORRIDO[9]` es «i»), y mover la correcta en el banco no la vuelve
  // correcta ni la deja de contar: sigue incorrecta.
  const estadoCongelado = { c: 'correcta', i: 'incorrecta', o: 'omitida' }[CLAVES_DEL_RECORRIDO[9]];
  if (filas.get(conOtraCorrecta.id)?.estado !== estadoCongelado) {
    problemas.push(
      `banco cambiado: la de la correcta movida dice «${filas.get(conOtraCorrecta.id)?.estado}» y con lo que se vio es «${estadoCongelado}»`
    );
  }

  // La retirada: congelada, con su aviso, y sin justificacion.
  const filaRetirada = filas.get(retirada.id)?.html ?? '';
  if (!filaRetirada.includes(retirada.enunciado) || filaRetirada.includes('data-papel="justificacion"')) {
    problemas.push('banco cambiado: la retirada no se muestra congelada y sin justificacion');
  }

  // Y la renovada, sin aviso, trae su justificacion como cualquier otra.
  if (!(filas.get(renovada.id)?.html ?? '').includes(`Por que de la pregunta ${renovada.id}.`)) {
    problemas.push('banco cambiado: la pregunta de ids renovados perdio su justificacion');
  }

  if (problemas.length === problemasAntes) {
    notas.push(
      `Banco cambiado: resultado ${cifra}, igual que sin cambios; avisos en ${conAviso.map((f) => `${f.id} (${avisoDe(f)})`).join(', ')}; ` +
        `la ${renovada.id}, con ids renovados y el orden al reves, sin aviso. La corregida muestra lo que se vio y la version ` +
        'vigente aparte; la retirada, congelada y sin justificacion.'
    );
  }
}

// ===========================================================================
// 9 · Con la capa caida, la revision sale de la copia, y lo dice
// ===========================================================================
//
// ADR-008 y la etapa A2: con la capa caida, `leerPreguntasPorIds(ids, {
// conJustificacion: true })` cae a la instantanea y trae las justificaciones. El resumen
// enciende entonces el aviso de la copia guardada, porque el respaldo no se sirve en
// silencio.
//
// EL INTENTO ES DE PREGUNTAS DE VERDAD, las primeras 119 de la instantanea, y la 120 es
// una que la copia NO tiene. Esa es la que prueba el detalle del autor del 2026-09-22:
// viniendo de la copia, que falte no es «retirada», es «desconocida».
//
// Las justificaciones se comparan con el archivo de la instantanea importado aparte, no
// con lo que devolvio el servicio (H-023).
//
// Y 9b, el peor caso: sin capa y sin copia. La revision se dibuja igual desde la copia
// congelada, sin justificaciones y con una nota, y no afirma ningun cambio.

{
  const problemasAntes = problemas.length;
  const { PREGUNTAS: delArchivo } = await delSitio('data/instantanea-banco.js');
  const { esc } = await delSitio('utils/dom.js');

  const reales = delArchivo.slice(0, 119).map(({ justificacion, ...resto }) => structuredClone(resto));
  const queLaCopiaNoTiene = {
    ...structuredClone(reales[0]),
    id: 999999,
    enunciado: 'Una pregunta que la copia guardada no tiene',
    alternativas: reales[0].alternativas.map((a, k) => ({ ...a, id: 999000 + k })),
  };
  const preguntasReales = [...reales, queLaCopiaNoTiene];

  // --- 9a · Solo la capa caida ---------------------------------------------
  {
    const almacen = almacenDeMentira();
    sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 120, terminadoEn: T0 + 2700000, preguntas: preguntasReales });

    const caida = () => Promise.reject(new Error('capa caida a proposito'));
    const { dom } = await montarVisita({ almacen, desde: T0 + 5000000, fetch: caida });
    await esperarLaRed(60);

    const filas = new Map(filasDe(dom.html('#revision-del-intento')).map((f) => [f.id, f]));

    if (filas.size !== TOTAL) {
      problemas.push(`capa caida: la revision dibujo ${filas.size} filas y el intento tiene ${TOTAL}`);
    }

    const sinSuPorque = reales.filter((p) => {
      const esperado = delArchivo.find((q) => q.id === p.id).justificacion;
      const html = filas.get(p.id)?.html ?? '';
      return !html.includes(esc(esperado));
    });

    if (sinSuPorque.length > 0) {
      problemas.push(
        `capa caida: ${sinSuPorque.length} de ${reales.length} filas no traen la justificacion que tiene el archivo ` +
          `de la instantanea (la primera, la ${sinSuPorque[0].id})`
      );
    }

    const laQueFalta = filas.get(queLaCopiaNoTiene.id)?.html ?? '';
    if (!laQueFalta.includes('data-papel="aviso-sin-explicacion"') || laQueFalta.includes('data-papel="aviso-retirada"')) {
      problemas.push('capa caida: la pregunta que la copia no tiene no dice que falta su explicacion, o dice que se retiro');
    }

    const conAvisoDeCambio = [...filas.values()].filter((f) => /data-papel="aviso-(corregida|retirada)"/.test(f.html));
    if (conAvisoDeCambio.length > 0) {
      problemas.push(`capa caida: ${conAvisoDeCambio.length} filas afirman un cambio que la copia no puede sostener`);
    }

    if (dom.oculto('#aviso-respaldo') || !dom.html('#aviso-respaldo').includes('copia guardada')) {
      problemas.push('capa caida: la revision salio de la copia y el aviso de ADR-008 no quedo a la vista');
    }

    if (problemas.length === problemasAntes) {
      notas.push(
        `Capa caida: ${filas.size} filas desde la copia, ${reales.length - sinSuPorque.length} con la justificacion del ` +
          'archivo leido aparte; la que la copia no tiene dice que falta su explicacion y no que se retiro; aviso de ADR-008 a la vista.'
      );
    }
  }

  // --- 9b · Ni capa ni copia -----------------------------------------------
  {
    const problemasAntesDe9b = problemas.length;
    const almacen = almacenDeMentira();
    sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 120, terminadoEn: T0 + 2700000, preguntas: preguntasReales });

    // La copia desaparece del arbol de ESTA visita antes de que nadie la pida: la
    // instantanea se importa recien al caer, asi que borrarla aqui es quitarla.
    const reloj = relojDeMentira({ desde: T0 + 5000000 });
    const dom = prepararDomFalso({ almacen, reloj });
    globalThis.fetch = () => Promise.reject(new Error('capa caida a proposito'));

    const arbol = arbolAparte(`v${(visitas += 1)}`);
    rmSync(join(arbol, 'data', 'instantanea-banco.js'));

    const cargar = (ruta) => import(pathToFileURL(join(arbol, ruta)).href);
    (await cargar('servicios/reloj.js')).usarReloj(reloj);
    const simulacro = await cargar('components/simulacro.js');
    simulacro.conectarComienzo();
    simulacro.conectarElRecorrido();
    simulacro.retomarElIntento();
    await esperarLaRed(60);

    const revision = dom.html('#revision-del-intento');
    const filas = filasDe(revision);

    if (!revision.includes('data-papel="nota-de-la-revision"')) {
      problemas.push('ni capa ni copia: la revision no dice que no se pudieron traer las explicaciones');
    }
    if (filas.length !== TOTAL) {
      problemas.push(`ni capa ni copia: la revision dibujo ${filas.length} filas desde la copia congelada, y son ${TOTAL}`);
    }
    if (filas.some((f) => /data-papel="(justificacion|aviso-corregida|aviso-retirada|aviso-sin-explicacion)"/.test(f.html))) {
      problemas.push('ni capa ni copia: alguna fila trae una justificacion o afirma un cambio sin tener de donde');
    }
    if (Number(textoDelPapel(dom.html('#zona-del-intento'), 'cifra-del-resultado')) !== 72) {
      problemas.push('ni capa ni copia: el resultado dejo de ser 72, y no depende de la red');
    }

    if (problemas.length === problemasAntesDe9b) {
      notas.push(`Ni capa ni copia: el resultado sigue en 72 y la revision dibuja las ${filas.length} desde la copia congelada, sin justificaciones, sin afirmar cambios y con su nota.`);
    }
  }
}

// ===========================================================================
// 10 · Se conserva el intento terminado, y empezar otro lo reemplaza
// ===========================================================================
//
// Decision 5 y ADR-035, parte 7: lo que se conserva es el INTENTO TERMINADO, y el
// resumen se recalcula desde el cada vez. Ningun resultado se guarda aparte. Queda hasta
// que se empieza otro intento, que lo reemplaza.
//
//   10a  terminar, recargar: el mismo resultado, y en el almacen solo las dos claves
//        del intento, sin ningun campo de resultado.
//   10b  «Empezar otro intento» desde el resumen: el anterior deja de estar guardado y
//        la seleccion es nueva.
//   10c  pulsarlo MIENTRAS viaja la revision: la respuesta rezagada no escribe sobre el
//        intento nuevo.
//
// Para armar el intento nuevo sin servidor, la capa se deja caida: el simulacro elige
// desde la instantanea, que es el camino degradado de siempre.

/** Espera de verdad lo que dura la transicion de carga: su piso son 400 ms reales. */
const esperarLaTransicion = () => new Promise((r) => setTimeout(r, 1200));

/** Pulsa «Empezar otro intento», que lleva el id de «Comenzar» (decision 5). */
const pulsarEmpezarOtro = (dom) =>
  dom.disparar('#zona-del-intento', 'click', {
    target: { closest: (s) => (s === '#comenzar-simulacro' ? {} : null) },
  });

/** Lo que el resumen dice, en una linea comparable entre dos visitas. */
const huellaDelResumen = (dom) => {
  const zona = dom.html('#zona-del-intento');
  const filas = [...zona.matchAll(/data-papel="fila-del-modulo" data-modulo="(\d+)"[\s\S]*?<\/li>/g)]
    .map((m) => `${m[1]}:${[...m[0].matchAll(/tabular-nums">(\d+)</g)].map((n) => n[1]).join('/')}`)
    .join(' ');
  return `${textoDelPapel(zona, 'cifra-del-resultado')} | ${textoDelPapel(zona, 'tiempo-total')} | ${filas}`;
};

{
  const problemasAntes = problemas.length;
  const preguntas = preguntasDeJuguete();
  const vigentes = bancoVigenteDe(preguntas);
  const medidos = [];

  // --- 10a · Terminar y recargar -------------------------------------------
  const almacen = almacenDeMentira();
  sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 119, comenzadaEn: T0 + 2680000 });

  const primera = await montarVisita({ almacen, desde: T0 + 2690000, fetch: capaDeMentira({ vigentes }) });
  primera.reloj.avanzar(10000);
  pulsar(primera.dom, 'alternativa', { alternativa: preguntas[119].alternativas[0].id });
  pulsar(primera.dom, 'siguiente');
  await esperarLaRed();

  const alTerminar = huellaDelResumen(primera.dom);
  const clavesAlTerminar = [...almacen.datos.keys()].sort();

  const segunda = await montarVisita({ almacen, desde: T0 + 9000000, fetch: capaDeMentira({ vigentes }) });
  await esperarLaRed();

  const alRecargar = huellaDelResumen(segunda.dom);

  if (alRecargar !== alTerminar) {
    problemas.push(`conservacion: al recargar el resumen dice «${alRecargar}» y al terminar decia «${alTerminar}»`);
  }

  const esperadas = ['examen-td-js.simulacro.preguntas', 'examen-td-js.simulacro.respuestas'];
  if (clavesAlTerminar.join(',') !== esperadas.join(',')) {
    problemas.push(`conservacion: al terminar el almacen tiene [${clavesAlTerminar.join(', ')}] y tenia que tener solo las dos del intento`);
  }

  const guardado = JSON.parse(almacen.datos.get('examen-td-js.simulacro.respuestas') ?? '{}');
  if (/resultado|correctas|aprobado/.test(JSON.stringify(Object.keys(guardado)))) {
    problemas.push(`conservacion: lo guardado trae un campo de resultado (${Object.keys(guardado).join(', ')}), y el resultado no se guarda`);
  }
  if (guardado.posicion !== TOTAL || !Number.isFinite(guardado.terminado_en)) {
    problemas.push('conservacion: el intento terminado no quedo guardado con su posicion 120 y su terminado_en');
  }

  medidos.push(`recarga → «${alRecargar}», claves [${clavesAlTerminar.map((c) => c.split('.').pop()).join(', ')}]`);

  // --- 10b · «Empezar otro intento» ----------------------------------------
  if (!segunda.dom.html('#zona-del-intento').includes('id="comenzar-simulacro"')) {
    problemas.push('conservacion: el resumen no tiene el boton para empezar otro intento');
  } else {
    globalThis.fetch = () => Promise.reject(new Error('capa caida a proposito'));

    pulsarEmpezarOtro(segunda.dom);
    await esperarLaTransicion();

    const copia = JSON.parse(almacen.datos.get('examen-td-js.simulacro.preguntas') ?? '{}');
    const avance = JSON.parse(almacen.datos.get('examen-td-js.simulacro.respuestas') ?? '{}');
    const idsNuevos = new Set((copia.preguntas ?? []).map((p) => p.id));
    const repetidas = preguntas.filter((p) => idsNuevos.has(p.id)).length;

    if (!copia.intento_id || copia.intento_id === 'resumen-1') {
      problemas.push(`conservacion: tras empezar otro, el intento guardado sigue siendo «${copia.intento_id}»`);
    }
    if ((copia.preguntas ?? []).length !== TOTAL || repetidas > 0) {
      problemas.push(`conservacion: el intento nuevo trae ${(copia.preguntas ?? []).length} preguntas, ${repetidas} del anterior`);
    }
    if ((avance.respuestas ?? []).length !== 0 || avance.posicion !== 0 || avance.terminado_en !== null) {
      problemas.push('conservacion: el intento nuevo hereda respuestas, posicion o final del anterior');
    }
    if (!segunda.dom.html('#zona-del-intento').includes('data-papel="tarjeta-de-la-pregunta"')) {
      problemas.push('conservacion: tras empezar otro intento no se dibujo su primera pregunta');
    }

    medidos.push(`otro intento → «${copia.intento_id}», ${idsNuevos.size} preguntas nuevas, ${(avance.respuestas ?? []).length} respuestas`);
    segunda.reloj.saltar(0);
  }

  // --- 10c · Empezar otro con la revision en viaje -------------------------
  {
    const almacenC = almacenDeMentira();
    sembrar(almacenC, { claves: CLAVES_DEL_RECORRIDO, hechas: 120, terminadoEn: T0 + 2700000 });

    let soltar;
    const retenida = new Promise((r) => {
      soltar = r;
    });

    const revisionRetenida = capaDeMentira({ vigentes, retener: retenida });
    const laCapa = (ruta, opciones) =>
      /con=justificacion/.test(String(ruta)) ? revisionRetenida(ruta, opciones) : Promise.reject(new Error('caida'));

    const visita = await montarVisita({ almacen: almacenC, desde: T0 + 5000000, fetch: laCapa });

    if (!visita.dom.html('#zona-del-intento').includes('id="comenzar-simulacro"')) {
      problemas.push('carrera: el resumen no tiene el boton para empezar otro intento');
    } else {
      pulsarEmpezarOtro(visita.dom);
      await esperarLaTransicion();

      const escriturasAntes = visita.dom.escrituras('#revision-del-intento');
      const avisoAntes = visita.dom.html('#aviso-respaldo');

      soltar();
      await esperarLaRed(40);

      if (visita.dom.escrituras('#revision-del-intento') !== escriturasAntes) {
        problemas.push('carrera: la revision del intento anterior llego tarde y se escribio igual, con otro intento en pantalla');
      }
      if (visita.dom.html('#aviso-respaldo') !== avisoAntes) {
        problemas.push('carrera: la revision rezagada cambio el aviso de respaldo del intento nuevo');
      }
      if (!visita.dom.html('#zona-del-intento').includes('data-papel="tarjeta-de-la-pregunta"')) {
        problemas.push('carrera: con la revision rezagada, la zona dejo de mostrar la pregunta del intento nuevo');
      }

      medidos.push('revision rezagada → descartada');
    }
  }

  if (problemas.length === problemasAntes) {
    notas.push(`Conservacion: ${medidos.join('; ')}. Ningun resultado guardado aparte.`);
  }
}

// ===========================================================================
// 11 · El resumen lleva a la guía (decisión 6, etapa C)
// ===========================================================================
//
// Decision 6: los enlaces a la guia van a `index.html#modulos`, que existe en el HTML
// estatico de la portada y lista los siete modulos. El resumen nombra el modulo en el
// desglose, asi que el estudiante sabe cual buscar al llegar.
//
// UNO SOLO, Y EN EL DESGLOSE. Es donde se lee en que modulo se falló. Siete enlaces —uno
// por fila— serian siete veces el mismo destino en media pantalla de telefono.
//
// Se mira sobre el resumen DIBUJADO de un intento terminado, no sobre la maqueta: lo que
// tiene que llevar a la guia es la pantalla que el estudiante ve.

{
  const problemasAntes = problemas.length;
  const preguntas = preguntasDeJuguete();
  const vigentes = bancoVigenteDe(preguntas);

  const almacen = almacenDeMentira();
  sembrar(almacen, { claves: CLAVES_DEL_RECORRIDO, hechas: 120, terminadoEn: T0 + 2700000 });

  const { dom } = await montarVisita({ almacen, desde: T0 + 5000000, fetch: capaDeMentira({ vigentes }) });
  await esperarLaRed();

  const zona = dom.html('#zona-del-intento');
  const desglose = zona.match(/<section data-papel="desglose"[\s\S]*?<\/section>/)?.[0] ?? '';

  const enTodoElResumen = [...zona.matchAll(/href="([^"]*#modulos)"/g)].map((m) => m[1]);
  const enElDesglose = [...desglose.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);

  if (enElDesglose.length !== 1 || enElDesglose[0] !== 'index.html#modulos') {
    problemas.push(
      `enlace a la guia: el desglose trae ${enElDesglose.length} enlace(s) [${enElDesglose.join(', ')}], y la ` +
        'decision 6 pide uno solo a index.html#modulos'
    );
  }

  if (enTodoElResumen.length !== 1) {
    problemas.push(`enlace a la guia: el resumen entero trae ${enTodoElResumen.length} enlaces a #modulos, y es uno`);
  }

  // Y el destino existe en el HTML estatico de la portada, no lo dibuja JavaScript.
  const portada = readFileSync(join(SITIO, '..', '..', 'index.html'), 'utf8');
  if (!/<section id="modulos"/.test(portada)) {
    problemas.push('enlace a la guia: index.html no trae <section id="modulos"> en su HTML estatico');
  }

  if (problemas.length === problemasAntes) {
    notas.push(
      `Enlace a la guia: el desglose del resumen dibujado lleva a «${enElDesglose[0]}», una sola vez en toda la ` +
        'pantalla, y esa sección existe en el HTML estático de la portada.'
    );
  }
}

// ===========================================================================
// El veredicto
// ===========================================================================

for (const carpeta of arbolesTemporales) {
  try {
    rmSync(carpeta, { recursive: true, force: true });
  } catch {
    // Una copia que no se deja borrar no invalida nada de lo que se midio sobre ella.
  }
}

console.log('');
console.log('RESUMEN DEL SIMULACRO (iteracion 44)');
console.log('');

for (const nota of notas) console.log(`  · ${nota}`);

console.log('');

if (problemas.length > 0) {
  console.log(`  ${problemas.length} problema(s):`);
  for (const problema of problemas) console.log(`    - ${problema}`);
  console.log('');
  console.log('codigo de salida: 1');
  process.exit(1);
}

console.log('Lo que esto NO prueba, y comprueba el autor en un navegador: que el resultado');
console.log('se entienda a la primera, que la revision se recorra comoda en un telefono, y');
console.log('que un lector de pantalla anuncie si un plegable esta abierto.');
console.log('');
console.log('codigo de salida: 0');
