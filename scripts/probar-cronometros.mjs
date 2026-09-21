/**
 * Los dos cronometros del simulacro, provocados con el reloj controlable.
 *
 * Y DESDE LA ITERACION 43, EL RECORRIDO DE UNA PREGUNTA A LA VEZ (bloques 13 a 18):
 * marcar, cambiar, avanzar, omitir con dos toques, lo que el marcado nunca contiene,
 * y un intento completo de 120 con recarga y salto. Viven aqui y no en un guion
 * aparte por decision del autor del 2026-09-20: el recorrido y el reloj son
 * inseparables, y este guion ya tenia el reloj, el intento sembrado y la recarga.
 *
 * LAS NOTAS DE LOS BLOQUES 14 A 18 SOLO SE IMPRIMEN SI EL BLOQUE PASO. Son frases, no
 * cifras medidas, y una frase que afirma «coincidieron» sobre una corrida con 72
 * discrepancias es peor que ninguna (H-023).
 *
 * POR QUE ESTE GUION NO NECESITA `datos:dev`
 *
 * Porque no prueba de donde salen las preguntas —eso es de `probar-filtrado.mjs`—
 * sino que pasa con el TIEMPO una vez que el intento existe. El intento se arma
 * escribiendo la copia congelada directamente en el almacen de mentira y retomandolo,
 * que es el mismo camino que el sitio recorre al recargar. Sin red, sin banco, y sin
 * una sola peticion: por eso entra en `npm run verificar` como noveno comprobador,
 * donde los otros dos guiones de comportamiento no pueden estar.
 *
 * COMO SE PROVOCA EL TIEMPO
 *
 * Con `relojDeMentira()`, que solo avanza cuando este archivo se lo pide, y que
 * **no toca el reloj del proceso**: `Date.now()` sigue siendo el de verdad para todo
 * lo demas, y las mediciones de la transicion de carga de `8f-2` y `10f` no se
 * enteran de que este guion existe.
 *
 * Los dos verbos hacen cosas distintas y las dos hacen falta:
 *
 *   avanzar(ms)  el tiempo pasa y los temporizadores vencen a su hora.
 *   saltar(ms)   el tiempo pasa y NO vence nada: el telefono bloqueado.
 *
 * LO QUE ESTO NO PRUEBA, y comprueba el autor en un navegador: que el navegador de
 * verdad estrangule los temporizadores como los estrangula `saltar()`, que `storage`
 * se entregue entre dos pestanas de verdad y cuando, y que los dos cronometros se
 * entiendan mirandolos en un telefono.
 */
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = fileURLToPath(new URL('.', import.meta.url));
const SITIO = join(AQUI, '..', 'static', 'js');

/**
 * Cada visita corre sobre SU PROPIA COPIA de `static/js/`.
 *
 * POR QUE UNA COPIA, Y NO UN `?pestana=a` EN EL IMPORT
 *
 * Porque el especificador solo aisla el modulo que se importa, no los que ese modulo
 * importa por dentro. `components/simulacro.js?pestana=a` es una instancia nueva, pero
 * su `import '../servicios/reloj.js'` resuelve al especificador pelado y cae en la
 * instancia COMPARTIDA. Se probo, y el resultado es el peor posible: `usarReloj()`
 * dejaba el reloj de mentira sentado en un modulo que no usaba nadie, y el sitio
 * seguia leyendo `Date.now()`. Dos pestanas asi habrian compartido `elIntento`,
 * `almacenRecordado` y el asiento del reloj: una pestana con dos nombres.
 *
 * Con un arbol aparte por visita, Node resuelve cada import dentro de esa copia y el
 * aislamiento es total. Son 486 KB por visita y el guion entero tarda segundos. El
 * precedente es de `probar-memoria.mjs`, que ya importa el sitio desde una copia para
 * provocar el caso sin instantanea.
 *
 * Y de paso vuelve honesta la recarga: una visita nueva no hereda NI UNA variable de
 * modulo de la anterior, que es exactamente lo que pasa al recargar la pagina.
 */
const arbolesTemporales = [];

function arbolAparte(marca) {
  const carpeta = mkdtempSync(join(tmpdir(), `cronometros-${marca}-`));
  cpSync(SITIO, carpeta, { recursive: true });
  arbolesTemporales.push(carpeta);
  return carpeta;
}

const { prepararDomFalso, almacenDeMentira, relojDeMentira, dosPestanas } = await import(
  pathToFileURL(join(AQUI, 'dom-falso.mjs')).href
);

const problemas = [];
const notas = [];

/** Cuantas visitas se han montado. Da un especificador distinto a cada una. */
let visitas = 0;

const MS = 30000;
const TOTAL = 120;

/** Un intento de juguete: 120 preguntas con cuatro alternativas cada una. */
function preguntasDeJuguete() {
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: 1000 + i,
    modulo: 2 + (i % 7),
    enunciado: `Pregunta de juguete ${i + 1}`,
    alternativas: Array.from({ length: 4 }, (_, j) => ({
      id: 5000 + i * 4 + j,
      texto: `Alternativa ${j + 1}`,
      es_correcta: j === 0,
    })),
  }));
}

/**
 * Deja escrito en un almacen un intento que empezo en `empezadoEn`.
 *
 * Se escribe a mano y no llamando a `guardarIntentoNuevo()` a proposito: asi la
 * prueba puede fijar el instante de inicio donde quiera —hace dos minutos, hace una
 * hora— sin mover el reloj antes, que es lo que hace falta para provocar la recarga.
 */
function sembrarIntento(almacen, { empezadoEn, posicion = 0, comenzadaEn, respuestas = [] }) {
  const preguntas = preguntasDeJuguete();

  almacen.datos.set(
    'examen-td-js.simulacro.preguntas',
    JSON.stringify({ v: 1, intento_id: 'juguete-1', guardado_en: empezadoEn, preguntas })
  );

  almacen.datos.set(
    'examen-td-js.simulacro.respuestas',
    JSON.stringify({
      v: 1,
      intento_id: 'juguete-1',
      empezado_en: empezadoEn,
      posicion,
      comenzada_en: comenzadaEn ?? empezadoEn,
      terminado_en: null,
      respuestas,
    })
  );

  return preguntas;
}

/**
 * Monta una visita: reloj de mentira, DOM falso, y los modulos del sitio importados
 * con un especificador propio.
 *
 * El especificador distinto es obligatorio y no una precaucion: `servicios/reloj.js`,
 * `servicios/memoria.js` y `components/simulacro.js` guardan estado en variables de
 * modulo. Dos visitas que compartieran el import compartirian el reloj, el almacen
 * recordado y `elIntento`, y la segunda estaria mirando la primera.
 */
async function montarVisita({ almacen, desde, movimientoReducido = false, etiqueta } = {}) {
  const marca = etiqueta ?? `v${(visitas += 1)}`;
  const reloj = relojDeMentira({ desde: desde ?? 1767225600000 });
  const dom = prepararDomFalso({ almacen, movimientoReducido, reloj });

  const arbol = arbolAparte(marca);
  const cargar = (ruta) => import(pathToFileURL(join(arbol, ruta)).href);

  const modReloj = await cargar('servicios/reloj.js');
  modReloj.usarReloj(reloj);

  const simulacro = await cargar('components/simulacro.js');
  const cronometros = await cargar('components/cronometros.js');
  const dueno = await cargar('servicios/dueno-del-intento.js');

  return { marca, reloj, dom, simulacro, cronometros, dueno };
}

/** Lo que la franja dice ahora mismo, leido del HTML dibujado y no de una variable. */
function loQueDiceLaFranja(dom) {
  const html = dom.html('#franja-del-simulacro');

  const cifra = html.match(/data-papel="cronometro"[^>]*>(\d+)</);
  const transcurrido = html.match(/data-papel="transcurrido"[^>]*>([^<]*)</);
  const avance = html.match(/data-papel="avance-del-intento"[^>]*>([^<]*)</);
  const urgencia = html.match(/data-papel="aviso-de-urgencia"[^>]*>([^<]*)</);

  return {
    vacia: html === '',
    segundos: cifra ? Number(cifra[1]) : null,
    transcurrido: transcurrido ? transcurrido[1] : null,
    avance: avance ? avance[1] : null,
    aviso: urgencia ? urgencia[1] : null,
    urgente: html.includes('bg-jsyellow'),
    html,
  };
}

/** Las respuestas que quedaron guardadas en el almacen. */
function respuestasGuardadas(almacen) {
  const crudo = almacen.datos.get('examen-td-js.simulacro.respuestas');
  return crudo ? JSON.parse(crudo) : null;
}

/**
 * Pulsa un control del recorrido, por el camino que recorre el estudiante.
 *
 * Los oyentes de la 43 viven sobre `#zona-del-intento` POR DELEGACION, asi que se
 * dispara ahi y se le da al evento un `target` que sabe contestar `closest()`. Es el
 * mismo recurso que ya usan `probar-filtrado.mjs` y `probar-memoria.mjs` para pulsar
 * «Comenzar»: llamar a la funcion interna en vez de pulsar probaria la funcion y no
 * el camino, y un oyente desconectado seguiria dando verde.
 *
 * Devuelve cuantos oyentes corrieron: cero significa que la zona no tiene quien la
 * escuche, que es un fallo distinto de que el control no haga lo que debia.
 */
function pulsar(dom, papel, { alternativa } = {}) {
  const selector = `[data-papel="${papel}"]`;
  const nodo = {
    dataset: alternativa === undefined ? {} : { alternativa: String(alternativa) },
  };

  return dom.disparar('#zona-del-intento', 'click', {
    target: { closest: (s) => (s === selector ? nodo : null) },
  });
}

// ===========================================================================
// 1 · El cronometro de la pregunta, en varios puntos de la misma pregunta
// ===========================================================================

{
  const problemasAntes = problemas.length;
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0 });
  simulacro.retomarElIntento();

  const puntos = [];

  for (const [avance, esperado] of [[0, 30], [1000, 29], [15000, 15], [25000, 5], [29500, 1]]) {
    reloj.avanzar(avance - (reloj.ahora() - T0));
    puntos.push({ enMs: reloj.ahora() - T0, muestra: loQueDiceLaFranja(dom).segundos, esperado });
  }

  for (const punto of puntos) {
    if (punto.muestra !== punto.esperado) {
      problemas.push(
        `cronometro de la pregunta: a los ${punto.enMs} ms mostro ${punto.muestra} y tenia que mostrar ${punto.esperado}`
      );
    }
  }

  if (problemas.length === problemasAntes) notas.push(
    `Cronometro de la pregunta: ${puntos.map((p) => `${p.enMs} ms -> ${p.muestra} s`).join(' · ')}. ` +
      'Cada cifra se leyo del HTML dibujado, no de una variable.'
  );
}

// ===========================================================================
// 2 · La urgencia se enciende a los 10 segundos restantes, ni antes ni despues
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0 });
  simulacro.retomarElIntento();

  // 19,999 s: quedan 10,001 ms, o sea la cifra dice 11. Todavia NO.
  reloj.avanzar(19999);
  const justoAntes = loQueDiceLaFranja(dom);

  // 20,000 s: quedan exactamente 10 000 ms, la cifra dice 10. AHORA.
  reloj.avanzar(1);
  const justoAl = loQueDiceLaFranja(dom);

  if (justoAntes.urgente) {
    problemas.push(
      `urgencia: se encendio con ${justoAntes.segundos} segundos en pantalla, y el umbral del autor es 10`
    );
  }
  if (justoAntes.aviso !== null) {
    problemas.push('urgencia: el texto «quedan N segundos» aparecio antes del umbral');
  }
  if (!justoAl.urgente) {
    problemas.push(`urgencia: a los 10 segundos restantes NO se encendio (cifra ${justoAl.segundos})`);
  }
  if (justoAl.aviso !== 'quedan 10 segundos') {
    problemas.push(`urgencia: el texto dijo «${justoAl.aviso}» y tenia que decir «quedan 10 segundos»`);
  }
  if (justoAl.avance !== null) {
    problemas.push('urgencia: el avance y el aviso estuvieron puestos los dos a la vez');
  }

  // Y las dos senales que no son el color, que es lo que pide el criterio.
  const cambioDeSuperficie = !justoAntes.html.includes('bg-jsyellow') && justoAl.html.includes('bg-jsyellow');

  if (!cambioDeSuperficie) {
    problemas.push('urgencia: la franja no cambio de superficie al encenderse');
  }

  notas.push(
    `Urgencia: con 11 s en pantalla la franja sigue en reposo y sin aviso; a los 10 s exactos ` +
      `cambia de superficie a «bg-jsyellow» Y aparece «${justoAl.aviso}» en el sitio del avance. ` +
      'Dos senales ademas del color, y el alto de la franja no cambia.'
  );
}

// ===========================================================================
// 3 · Al agotarse: con alternativa marcada y sin ella
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0 });

  // La 43 conectara esto a la tarjeta. Aqui se enchufa a mano, que es la unica forma
  // de provocar «se agoto CON una alternativa marcada» sin que exista el recorrido.
  let marcada = 5002;
  simulacro.conectarLaAlternativaMarcada(() => marcada);

  simulacro.retomarElIntento();

  // Primera pregunta: se agota con la 5002 marcada.
  reloj.avanzar(MS);
  const trasLaPrimera = respuestasGuardadas(almacen);

  // Segunda: sin nada marcado.
  marcada = null;
  reloj.avanzar(MS);
  const trasLaSegunda = respuestasGuardadas(almacen);

  const primera = trasLaPrimera?.respuestas?.[0];
  const segunda = trasLaSegunda?.respuestas?.[1];

  if (!primera || primera.estado !== 'respondida' || primera.alternativa_id !== 5002) {
    problemas.push(
      `agotada con alternativa marcada: quedo ${JSON.stringify(primera)} y tenia que ser respondida con la 5002`
    );
  }
  if (!primera?.agotada) {
    problemas.push('agotada con alternativa marcada: no quedo marcada como agotada');
  }
  if (!segunda || segunda.estado !== 'omitida' || segunda.alternativa_id !== null) {
    problemas.push(
      `agotada sin alternativa marcada: quedo ${JSON.stringify(segunda)} y tenia que ser omitida`
    );
  }
  if (trasLaSegunda?.posicion !== 2) {
    problemas.push(`al agotarse dos preguntas la posicion quedo en ${trasLaSegunda?.posicion} y tenia que ser 2`);
  }

  const franja = loQueDiceLaFranja(dom);
  if (franja.avance !== '3/120') {
    problemas.push(`tras dos agotadas la franja dice «${franja.avance}» y tenia que decir «3/120»`);
  }

  notas.push(
    'Al agotarse: con la alternativa 5002 marcada quedo respondida con esa alternativa y con ' +
      '`agotada: true`; sin nada marcado quedo omitida con `alternativa_id: null`. Las dos avanzaron ' +
      'sola a la siguiente, y la franja paso a 3/120.'
  );
}

// ===========================================================================
// 4 · Avanzar antes de tiempo no traspasa el sobrante
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0 });
  simulacro.retomarElIntento();

  // A los 5 segundos se responde a mano, como hara la 43 al pulsar «Siguiente».
  reloj.avanzar(5000);
  simulacro.anotarEnElIntento({
    pregunta_id: 1000,
    alternativa_id: 5001,
    estado: 'respondida',
    agotada: false,
  });

  // La franja tiene que repintarse con la pregunta nueva, empezando de 30.
  reloj.avanzar(0);
  const alEmpezarLaSegunda = loQueDiceLaFranja(dom);

  if (alEmpezarLaSegunda.segundos !== 30) {
    problemas.push(
      `sobrante: tras responder en 5 s, la siguiente empezo con ${alEmpezarLaSegunda.segundos} y no con 30`
    );
  }

  // Y la segunda se agota 30 s despues de haber empezado, no 25.
  reloj.avanzar(29999);
  const casiAgotada = loQueDiceLaFranja(dom);
  reloj.avanzar(1);
  const guardado = respuestasGuardadas(almacen);

  if (casiAgotada.segundos !== 1) {
    problemas.push(`sobrante: a falta de 1 ms la segunda mostro ${casiAgotada.segundos} y no 1`);
  }
  if (guardado?.posicion !== 2) {
    problemas.push(`sobrante: la segunda no se agoto a sus propios 30 s (posicion ${guardado?.posicion})`);
  }

  const laSegunda = guardado?.respuestas?.[1];
  if (laSegunda?.resuelta_en !== T0 + 5000 + MS) {
    problemas.push(
      `sobrante: la segunda se resolvio en ${laSegunda?.resuelta_en} y su plazo era ${T0 + 5000 + MS}`
    );
  }

  notas.push(
    'Sobrante perdido: respondida la primera a los 5 s, la segunda empezo en 30 y se agoto a los 35 s ' +
      'del intento, o sea a sus propios 30. Los 25 s que sobraron no se traspasaron.'
  );
}

// ===========================================================================
// 5 · El tiempo transcurrido, y su formato MM:SS -> H:MM:SS
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro, cronometros } = await montarVisita({ almacen, desde: T0 });
  simulacro.retomarElIntento();

  const leidos = [];

  for (const avance of [0, 12000, 372000]) {
    reloj.avanzar(avance - (reloj.ahora() - T0));
    leidos.push({ enMs: reloj.ahora() - T0, texto: loQueDiceLaFranja(dom).transcurrido });
  }

  const esperados = ['00:00', '00:12', '06:12'];

  leidos.forEach((leido, i) => {
    if (leido.texto !== esperados[i]) {
      problemas.push(
        `transcurrido: a los ${leido.enMs} ms mostro «${leido.texto}» y tenia que mostrar «${esperados[i]}»`
      );
    }
  });

  // El formato de la hora, directo sobre la funcion: provocarlo en la franja exigiria
  // agotar 120 preguntas, y lo que se mide aqui es el formato y no el recorrido.
  const formatos = [
    [0, '00:00'],
    [59_000, '00:59'],
    [3_599_000, '59:59'],
    [3_600_000, '1:00:00'],
    [3_849_000, '1:04:09'],
    [86_400_000, '24:00:00'],
  ];

  for (const [ms, esperado] of formatos) {
    const dio = cronometros.formatearTranscurrido(ms);
    if (dio !== esperado) {
      problemas.push(`formato del transcurrido: ${ms} ms dio «${dio}» y tenia que dar «${esperado}»`);
    }
  }

  // Y ningun camino termina el intento por tiempo total: a las dos horas de un intento
  // sin responder, lo que lo termino fueron las 120 preguntas y no el reloj.
  const conAgotamientos = almacenDeMentira();
  sembrarIntento(conAgotamientos, { empezadoEn: T0 });
  const otra = await montarVisita({ almacen: conAgotamientos, desde: T0 });
  otra.simulacro.retomarElIntento();
  otra.reloj.avanzar(2 * 60 * 60 * 1000);

  const alFinal = respuestasGuardadas(conAgotamientos);
  const franjaAlFinal = loQueDiceLaFranja(otra.dom);

  if (alFinal?.posicion !== TOTAL) {
    problemas.push(`tras dos horas la posicion quedo en ${alFinal?.posicion} y tenia que ser ${TOTAL}`);
  }
  if (alFinal?.respuestas?.length !== TOTAL) {
    problemas.push(`tras dos horas quedaron ${alFinal?.respuestas?.length} respuestas y tenian que ser ${TOTAL}`);
  }
  // El intento SI termina, y esta bien: lo termino la pregunta 120, no el reloj. Lo que
  // esta iteracion afirma es que no existe ningun camino que lo corte ANTES por tiempo
  // total, y eso se mide en el instante en que quedo cerrado: el vencimiento de la 120
  // y ni un milisegundo antes. Con el sobrante perdido (decision 1) ese instante es
  // siempre 120 x 30 s, que es la duracion maxima teorica y no un plazo.
  const cerroEn = alFinal?.terminado_en;
  const elPlazoDeLa120 = T0 + TOTAL * MS;

  if (cerroEn !== elPlazoDeLa120) {
    problemas.push(
      `el intento se cerro en ${cerroEn} y tenia que cerrarse en ${elPlazoDeLa120}, el vencimiento ` +
        'de la pregunta 120: cualquier instante anterior seria un final por tiempo total'
    );
  }

  const porAgotamiento = (alFinal?.respuestas ?? []).filter((r) => r.agotada).length;

  if (porAgotamiento !== TOTAL) {
    problemas.push(
      `de las ${alFinal?.respuestas?.length} respuestas solo ${porAgotamiento} se resolvieron por ` +
        'agotamiento de su propia pregunta'
    );
  }
  if (!franjaAlFinal.vacia) {
    problemas.push('con las 120 resueltas la franja siguio dibujada');
  }

  notas.push(
    `Transcurrido: ${leidos.map((l) => `${l.enMs} ms -> ${l.texto}`).join(' · ')}, y el formato cruza a ` +
      'H:MM:SS justo en la hora (3 599 000 ms -> 59:59, 3 600 000 -> 1:00:00, 86 400 000 -> 24:00:00). ' +
      `Dos horas de intento sin responder terminan en ${alFinal?.posicion} preguntas resueltas por ` +
      `agotamiento de su propia pregunta, y el intento se cerro en el vencimiento de la 120 ` +
      `(${TOTAL * MS / 60000} minutos exactos) y no por ningun plazo total.`
  );
}

// ===========================================================================
// 6 · Un temporizador que se atrasa no descuadra las cifras
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0 });
  simulacro.retomarElIntento();

  // El reloj se mueve 7 segundos SIN que venza ni un temporizador. Es lo que hace el
  // navegador cuando estrangula una pestana: un cronometro que contara pulsos se
  // quedaria en 30 y este tiene que decir 23.
  reloj.saltar(7000);
  const antesDeLatir = loQueDiceLaFranja(dom);
  reloj.avanzar(0);
  const despuesDeLatir = loQueDiceLaFranja(dom);

  if (despuesDeLatir.segundos !== 23) {
    problemas.push(
      `temporizador atrasado: tras 7 s sin latidos la cifra quedo en ${despuesDeLatir.segundos} y tenia que ser 23`
    );
  }
  if (despuesDeLatir.transcurrido !== '00:07') {
    problemas.push(
      `temporizador atrasado: el transcurrido quedo en «${despuesDeLatir.transcurrido}» y tenia que ser «00:07»`
    );
  }

  notas.push(
    `Temporizador atrasado: 7 s de reloj sin un solo latido dejan la franja pintada con ` +
      `${antesDeLatir.segundos} s —lo ultimo que alcanzo a escribir—, y el primer latido la corrige a ` +
      `${despuesDeLatir.segundos} s y ${despuesDeLatir.transcurrido}. La cifra sale de restar instantes, no de contar pulsos.`
  );
}

// ===========================================================================
// 7 · Dos minutos en segundo plano, a mitad de una pregunta
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0 });
  simulacro.retomarElIntento();

  // A mitad de la primera pregunta, la pagina se va.
  reloj.avanzar(15000);
  reloj.ocultar();

  // Dos minutos sin que corra un solo temporizador.
  reloj.saltar(120000);
  reloj.mostrar();

  const guardado = respuestasGuardadas(almacen);
  const franja = loQueDiceLaFranja(dom);

  // 15 s de la primera + 120 s = 135 s. La primera se agoto a los 30, la segunda a los
  // 60, la tercera a los 90, la cuarta a los 120; la quinta lleva 15 s corriendo.
  if (guardado?.posicion !== 4) {
    problemas.push(`segundo plano: quedaron ${guardado?.posicion} preguntas resueltas y tenian que ser 4`);
  }

  const instantes = (guardado?.respuestas ?? []).map((r) => r.resuelta_en - T0);
  const esperados = [30000, 60000, 90000, 120000];

  if (JSON.stringify(instantes) !== JSON.stringify(esperados)) {
    problemas.push(
      `segundo plano: las agotadas quedaron con instantes ${JSON.stringify(instantes)} y tenian que ser ` +
        `${JSON.stringify(esperados)} —cada una con SU vencimiento, no todas con el del regreso—`
    );
  }

  if (!(guardado?.respuestas ?? []).every((r) => r.estado === 'omitida' && r.agotada)) {
    problemas.push('segundo plano: alguna de las agotadas no quedo omitida por agotamiento');
  }

  if (franja.segundos !== 15) {
    problemas.push(`segundo plano: al volver la franja mostro ${franja.segundos} s y tenia que mostrar 15`);
  }
  if (franja.transcurrido !== '02:15') {
    problemas.push(`segundo plano: al volver el transcurrido decia «${franja.transcurrido}» y tenia que ser «02:15»`);
  }

  notas.push(
    `Segundo plano: 2 minutos ocultos a mitad de la pregunta 1 dejaron 4 preguntas resueltas por ` +
      `agotamiento, en orden y cada una con su propio vencimiento (${instantes.join(', ')} ms), y al ` +
      `volver la franja marcaba ${franja.segundos} s de la pregunta 5 con ${franja.transcurrido} transcurridos.`
  );
}

// ===========================================================================
// 8 · Una recarga dos minutos despues, con el reloj arrancando donde quedo
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  // Visita 1: se abre el intento y se mira 15 segundos.
  const primera = await montarVisita({ almacen, desde: T0 });
  primera.simulacro.retomarElIntento();
  primera.reloj.avanzar(15000);
  primera.cronometros; // el intento quedo guardado con lo que llevaba

  const instanteAlCerrar = primera.reloj.ahora();

  // Visita 2: otro DOM, otros modulos, y el reloj arranca DOS MINUTOS DESPUES de donde
  // quedo el anterior. Eso es una recarga tras dos minutos con la pestana cerrada.
  const segunda = await montarVisita({ almacen, desde: instanteAlCerrar + 120000 });
  segunda.simulacro.retomarElIntento();

  const guardado = respuestasGuardadas(almacen);
  const franja = loQueDiceLaFranja(segunda.dom);

  if (guardado?.posicion !== 4) {
    problemas.push(`recarga: quedaron ${guardado?.posicion} preguntas resueltas y tenian que ser 4`);
  }

  const instantes = (guardado?.respuestas ?? []).map((r) => r.resuelta_en - T0);

  if (JSON.stringify(instantes) !== JSON.stringify([30000, 60000, 90000, 120000])) {
    problemas.push(`recarga: las agotadas quedaron con instantes ${JSON.stringify(instantes)}`);
  }
  if (franja.segundos !== 15) {
    problemas.push(`recarga: la franja mostro ${franja.segundos} s y tenia que mostrar 15`);
  }
  if (franja.transcurrido !== '02:15') {
    problemas.push(`recarga: el transcurrido decia «${franja.transcurrido}» y tenia que ser «02:15»`);
  }

  notas.push(
    'Recarga tras 2 minutos: el mismo resultado que el segundo plano —4 agotadas en orden, la 5 con ' +
      `${franja.segundos} s y ${franja.transcurrido} transcurridos—, con el DOM rehecho, los modulos ` +
      'reimportados y el reloj arrancando donde el anterior lo dejo mas los dos minutos.'
  );
}

// ===========================================================================
// 9 · Dos pestanas: la ultima toma el intento y la otra se bloquea
// ===========================================================================

{
  const pestanas = dosPestanas();
  const T0 = 1767225600000;
  sembrarIntento(pestanas.a, { empezadoEn: T0 });

  // La A abre primero.
  const a = await montarVisita({ almacen: pestanas.a, desde: T0, etiqueta: 'pa' });
  pestanas.atar(pestanas.a, a.dom);
  a.dom.activar();
  a.simulacro.retomarElIntento();

  const aEraDuena = !loQueDiceLaFranja(a.dom).vacia;

  // La B abre despues. La que abre ultimo gana.
  const b = await montarVisita({ almacen: pestanas.b, desde: T0, etiqueta: 'pb' });
  pestanas.atar(pestanas.b, b.dom);
  b.dom.activar();
  b.simulacro.retomarElIntento();

  const avisoEnA = a.dom.html('#zona-del-intento');
  const franjaDeA = loQueDiceLaFranja(a.dom);
  const franjaDeB = loQueDiceLaFranja(b.dom);

  if (!aEraDuena) {
    problemas.push('dos pestanas: la A no llego a tener el intento antes de que abriera la B');
  }
  if (!avisoEnA.includes('Tu simulacro sigue en la otra pestaña')) {
    problemas.push('dos pestanas: la A no quedo bloqueada con un aviso al abrir la B');
  }
  if (!franjaDeA.vacia) {
    problemas.push('dos pestanas: la A se quedo con la franja dibujada despues de perder el intento');
  }
  if (franjaDeB.vacia) {
    problemas.push('dos pestanas: la B no tomo el intento');
  }

  // Y ninguna escritura de la bloqueada llega al almacen. La A tenia el intento en la
  // pregunta 1; si siguiera contando, a los 30 s escribiria una respuesta.
  //
  // LAS DOS AVANZAN A LA PAR, Y ESO ES TODO EL PUNTO. Dos pestanas del mismo navegador
  // comparten un solo reloj de pared; adelantar solo el de la A seria simular que la B
  // se congelo, y entonces la A retomaria el intento a los 15 segundos —que es lo
  // correcto, y lo que prueba el bloque siguiente— en vez de quedarse bloqueada. Se
  // avanzan los dos de a 5 segundos, que es el latido del arriendo, y antes de cada
  // avance se activa el DOM de esa pestana para que sus temporizadores corran sobre su
  // propio documento, como en el navegador.
  // SE MIRA QUIEN ESCRIBIO, NO QUE QUEDO ESCRITO. Las dos pestanas comparten un solo
  // almacen —es el mismo origen, como en el navegador—, asi que comparar el contenido
  // no distingue quien lo puso: la duena escribe ahi mismo y el contenido cambia igual.
  // Lo que si distingue es `entregas`, que anota de que pestana salio cada cambio.
  const desdeAqui = pestanas.entregas.length;
  const antes = respuestasGuardadas(pestanas.a);

  for (let paso = 0; paso < 120; paso += 1) {
    b.dom.activar();
    b.reloj.avanzar(5000);
    a.dom.activar();
    a.reloj.avanzar(5000);
  }

  const despues = respuestasGuardadas(pestanas.a);
  const loQueEscribioLaBloqueada = pestanas.entregas.slice(desdeAqui).filter((e) => e.de === 'a');
  const loQueEscribioLaDuena = pestanas.entregas.slice(desdeAqui).filter((e) => e.de === 'b');

  if (loQueEscribioLaBloqueada.length !== 0) {
    problemas.push(
      `dos pestanas: la bloqueada escribio ${loQueEscribioLaBloqueada.length} vez/veces en el almacen ` +
        `(claves: ${[...new Set(loQueEscribioLaBloqueada.map((e) => e.clave))].join(', ')})`
    );
  }

  // Y la duena si conto: sin esto, lo de arriba pasaria en verde porque el reloj no
  // corrio, que es la forma mas facil de que una prueba no pruebe nada.
  if ((despues?.posicion ?? 0) < 19) {
    problemas.push(
      `dos pestanas: la duena solo avanzo a la pregunta ${despues?.posicion} en 10 minutos, ` +
        'asi que el reloj no corrio y la prueba de la bloqueada no probo nada'
    );
  }
  if (loQueEscribioLaDuena.length === 0) {
    problemas.push('dos pestanas: la duena no escribio nada en 10 minutos');
  }

  // Y el evento nunca se entrego a quien escribio.
  const aSiMisma = pestanas.entregas.filter((e) => e.de === e.a);

  if (aSiMisma.length !== 0) {
    problemas.push(`dos pestanas: se entregaron ${aSiMisma.length} eventos «storage» a quien los provoco`);
  }

  notas.push(
    `Dos pestanas: la A tenia el intento, la B abrio y se lo llevo, y la A quedo con el aviso «Tu ` +
      `simulacro sigue en la otra pestaña» y sin franja. Diez minutos con los dos relojes avanzando a ` +
      `la par: la duena llego a la pregunta ${despues?.posicion} con ${loQueEscribioLaDuena.length} ` +
      `escrituras, y la bloqueada hizo ${loQueEscribioLaBloqueada.length}. Se mira quien escribio y no ` +
      `que quedo escrito, porque el almacen es uno solo. De las ${pestanas.entregas.length} entregas del ` +
      'evento `storage`, cero fueron a quien escribio.'
  );
}

// ===========================================================================
// 10 · Con la duena cerrada, la otra retoma pasado el vencimiento
// ===========================================================================

{
  const pestanas = dosPestanas();
  const T0 = 1767225600000;
  sembrarIntento(pestanas.a, { empezadoEn: T0 });

  const a = await montarVisita({ almacen: pestanas.a, desde: T0, etiqueta: 'ca' });
  pestanas.atar(pestanas.a, a.dom);
  a.dom.activar();
  a.simulacro.retomarElIntento();

  const b = await montarVisita({ almacen: pestanas.b, desde: T0, etiqueta: 'cb' });
  pestanas.atar(pestanas.b, b.dom);
  b.dom.activar();
  b.simulacro.retomarElIntento();

  // La A esta bloqueada. Ahora se cierra la B, que es la duena.
  //
  // CERRAR UNA PESTANA SE SIMULA DEJANDO DE AVANZAR SU RELOJ, y no hace falta nada mas:
  // una pestana cerrada no corre temporizadores, asi que deja de renovar el arriendo.
  // Es justo lo contrario del bloque anterior, donde los dos relojes avanzaban a la par
  // porque las dos pestanas seguian vivas.
  const { VENCE_A_LOS_MS } = a.dueno;

  const bloqueadaAntes = a.dom.html('#zona-del-intento').includes('Tu simulacro sigue en la otra pestaña');

  // A los 10 s la A todavia no puede: el arriendo vence a los 15.
  a.reloj.avanzar(10000);
  const alosDiez = a.dom.html('#zona-del-intento').includes('Tu simulacro sigue en la otra pestaña');

  // A los 20 s ya vencio, y el latido de la A lo toma.
  a.reloj.avanzar(10000);
  const alosVeinte = a.dom.html('#zona-del-intento').includes('Tu simulacro sigue en la otra pestaña');
  const franjaDeA = loQueDiceLaFranja(a.dom);

  if (!bloqueadaAntes) {
    problemas.push('vencimiento: la A no estaba bloqueada antes de cerrar la duena');
  }
  if (!alosDiez) {
    problemas.push(
      `vencimiento: la A retomo el intento a los 10 s, antes de los ${VENCE_A_LOS_MS} ms del vencimiento`
    );
  }
  if (alosVeinte) {
    problemas.push('vencimiento: pasados 20 s sin renovar, la A seguia bloqueada para siempre');
  }
  if (franjaDeA.vacia) {
    problemas.push('vencimiento: la A retomo el intento pero no volvio a dibujar la franja');
  }

  notas.push(
    `Vencimiento del arriendo: con la duena cerrada, la bloqueada sigue bloqueada a los 10 s —el ` +
      `arriendo vence a los ${VENCE_A_LOS_MS / 1000}— y retoma el intento a los 20, con su franja de ` +
      'vuelta. Cerrar la duena no deja a la otra bloqueada para siempre. El numero sale de la constante ' +
      'del modulo, no copiado a mano: el dia que el autor lo cambie, esta prueba lo sigue.'
  );
}

// ===========================================================================
// 11 · Movimiento reducido: el cronometro no declara movimiento
// ===========================================================================

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({
    almacen,
    desde: T0,
    movimientoReducido: true,
  });

  simulacro.retomarElIntento();
  reloj.avanzar(21000);

  const franja = loQueDiceLaFranja(dom);

  // Las clases de movimiento del sitio. `transition-colors` no es una de ellas: es un
  // cambio de color, no un desplazamiento, y la regla de src/input.css la recorta.
  const movimiento = ['animate-', 'animate__', 'motion-safe:', 'transition-transform'];
  const declaradas = movimiento.filter((clase) => franja.html.includes(clase));

  if (declaradas.length !== 0) {
    problemas.push(
      `movimiento reducido: la franja declaro ${declaradas.join(', ')} con el movimiento reducido pedido`
    );
  }
  if (franja.segundos !== 9) {
    problemas.push(
      `movimiento reducido: la franja dejo de mostrar el tiempo (mostro ${franja.segundos} y tenia que ser 9)`
    );
  }
  if (!franja.urgente) {
    problemas.push('movimiento reducido: la urgencia no se encendio');
  }

  notas.push(
    `Movimiento reducido: con «prefers-reduced-motion» simulado la franja no declara ninguna clase de ` +
      `animacion y sigue mostrando el tiempo (${franja.segundos} s, en urgencia). La cifra la escribe ` +
      'JavaScript en cada latido, asi que no hay ninguna animacion de 30 segundos que recortar.'
  );
}

// ===========================================================================
// 12 · El reloj de mentira no toca el del proceso
// ===========================================================================

{
  const { readFileSync } = await import('node:fs');
  const fuente = readFileSync(join(AQUI, 'dom-falso.mjs'), 'utf8');

  // Se mira el codigo y no solo la conducta: la conducta de HOY puede ser correcta y
  // que manana alguien instale el reloj de mentira en `globalThis` sin darse cuenta de
  // lo que rompe. Esta es la regla que la iteracion 42 se comprometio a dejar
  // comprobable con un grep.
  const prohibidas = [
    /globalThis\.Date\s*=/,
    /globalThis\.performance\s*=/,
    /\bDate\.now\s*=/,
    /\bperformance\.now\s*=/,
  ];

  for (const prohibida of prohibidas) {
    if (prohibida.test(fuente)) {
      problemas.push(`dom-falso.mjs asigna ${prohibida} y tiene prohibido tocar el reloj del proceso`);
    }
  }

  // Y los temporizadores de la ventana falsa siguen siendo los de Node.
  const reloj = relojDeMentira({ desde: 0 });
  prepararDomFalso({ reloj });

  if (globalThis.window.setTimeout !== globalThis.setTimeout) {
    // Envueltos en una lambda, que es como estaban antes de la 42: lo que importa es
    // que la lambda llame al de Node y no al del reloj de mentira.
    let llamoAlDeNode = false;
    const original = globalThis.setTimeout;
    globalThis.setTimeout = (...a) => {
      llamoAlDeNode = true;
      return original(...a);
    };

    const pase = globalThis.window.setTimeout(() => {}, 10000);
    globalThis.window.clearTimeout(pase);
    globalThis.setTimeout = original;

    if (!llamoAlDeNode) {
      problemas.push('window.setTimeout del DOM falso dejo de llamar al setTimeout de Node');
    }
  }

  const antesDelSalto = Date.now();
  reloj.avanzar(60 * 60 * 1000);
  const despuesDelSalto = Date.now();

  if (despuesDelSalto - antesDelSalto > 1000) {
    problemas.push('adelantar el reloj de mentira una hora movio el reloj del proceso');
  }

  notas.push(
    'El reloj del proceso, intacto: dom-falso.mjs no asigna Date, Date.now ni performance —comprobado ' +
      'sobre su codigo, no solo sobre su conducta—, window.setTimeout sigue llamando al de Node, y ' +
      `adelantar una hora el reloj de mentira movio el Date.now() real ${despuesDelSalto - antesDelSalto} ms.`
  );
}

// ===========================================================================
// 13 · Al retomar se dibuja UNA pregunta, la primera, y los dos indicadores
//      dicen lo mismo (iteracion 43)
// ===========================================================================
//
// El primer cimiento del recorrido. Antes de la 43, retomar dibujaba el recuadro
// «Intento listo» y ninguna pregunta; ahora lleva directo a la pregunta donde iba
// (decision 8). Se cuenta sobre el HTML realmente dibujado y no sobre una variable:
// dos tarjetas superpuestas o un numero que discrepa solo se ven ahi.

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  sembrarIntento(almacen, { empezadoEn: T0 });

  const { dom, simulacro } = await montarVisita({ almacen, desde: T0, etiqueta: 'r1' });
  simulacro.retomarElIntento();

  const html = dom.html('#zona-del-intento');

  /** Cuantas veces aparece un trozo en el HTML. */
  const cuantas = (trozo) => html.split(trozo).length - 1;

  const tarjetas = cuantas('data-papel="tarjeta-de-la-pregunta"');
  const enunciados = cuantas('data-papel="enunciado"');
  const alternativas = cuantas('data-papel="alternativa"');
  const franja = loQueDiceLaFranja(dom);

  // El numero que dice la tarjeta, leido del HTML igual que el de la franja.
  const numeroDeLaTarjeta = html.match(/Pregunta (\d+) de (\d+)/);

  if (tarjetas !== 1) {
    problemas.push(`al retomar quedaron ${tarjetas} tarjetas de pregunta dibujadas y tenia que ser 1`);
  }
  if (enunciados !== 1) {
    problemas.push(`al retomar quedaron ${enunciados} enunciados dibujados y tenia que ser 1`);
  }
  if (alternativas !== 4) {
    problemas.push(`la pregunta dibujada trae ${alternativas} alternativas y tenia que traer 4`);
  }
  if (!html.includes('Pregunta de juguete 1')) {
    problemas.push('al retomar en la posicion 0 no se dibujo el enunciado de la primera pregunta');
  }
  if (html.includes('Intento listo')) {
    problemas.push('al retomar aparecio «Intento listo» en vez de la pregunta (decision 8)');
  }

  // LOS DOS INDICADORES, QUE SE CALCULAN POR CAMINOS DISTINTOS: el de la franja lo
  // escribe el cronometro en cada latido, y el de la tarjeta lo escribe el recorrido
  // al redibujar. Que coincidan no se puede dar por supuesto; se mira.
  if (`${numeroDeLaTarjeta?.[1]}/${numeroDeLaTarjeta?.[2]}` !== franja.avance) {
    problemas.push(
        `los dos indicadores discrepan: la tarjeta dice «${numeroDeLaTarjeta?.[0]}» y la franja «${franja.avance}»`
    );
  }
  if (franja.avance !== '1/120') {
    problemas.push(`al retomar en la posicion 0 la franja dice «${franja.avance}» y tenia que decir «1/120»`);
  }

  notas.push(
      `Al retomar: una sola tarjeta con un enunciado y ${alternativas} alternativas, la primera pregunta ` +
      `del intento, sin pantalla intermedia, y los dos indicadores de posicion diciendo «${franja.avance}» ` +
      'por caminos distintos —el del cronometro y el del recorrido—.'
  );
}

// ===========================================================================
// 14 · Marcar, cambiar de alternativa y los dos botones (iteracion 43)
// ===========================================================================
//
// Lo que se mira aqui es el HTML dibujado y el almacen, no las variables del modulo.
// La decision 1 dice que marcar NO registra: lo que cuenta es lo ultimo marcado al
// avanzar o al agotarse, asi que una marca que llegara al almacen antes de tiempo
// dejaria escrita una respuesta que el estudiante todavia podia cambiar.

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  const preguntas = sembrarIntento(almacen, { empezadoEn: T0 });

  const { dom, simulacro } = await montarVisita({ almacen, desde: T0, etiqueta: 'm1' });
  simulacro.conectarElRecorrido();
  simulacro.retomarElIntento();

  const primera = preguntas[0];
  const segunda = preguntas[1];

  const html = () => dom.html('#zona-del-intento');
  const cuantas = (trozo) => html().split(trozo).length - 1;

  // Que alternativa esta marcada, leida de la etiqueta entera y no de dos atributos
  // pegados: si el marcado agrega un atributo entre medio, esta lectura sigue viendo
  // lo mismo. Se descubrio con el rojo 2 del bloque 17, que metio `data-correcta`
  // entre `data-alternativa` y `data-marcada` y tumbo este bloque por arrastre.
  const laMarcadaDibujada = () => {
    const boton = html().match(/<button[^>]*data-marcada="true"[^>]*>/)?.[0] ?? '';
    return boton.match(/data-alternativa="([^"]*)"/)?.[1] ?? null;
  };

  // Sin nada marcado: «Siguiente» apagado, «Omitir» encendido, ninguna alternativa
  // con `aria-checked="true"`.
  const sinMarcar = {
    siguienteApagado: html().includes('data-papel="siguiente" disabled'),
    omitirApagado: html().includes('data-papel="omitir" disabled'),
    marcadas: cuantas('aria-checked="true"'),
  };

  const oyentes = pulsar(dom, 'alternativa', { alternativa: primera.alternativas[1].id });

  const trasMarcar = {
    siguienteApagado: html().includes('data-papel="siguiente" disabled'),
    omitirApagado: html().includes('data-papel="omitir" disabled'),
    marcadas: cuantas('data-marcada="true"'),
    esLaSegunda: laMarcadaDibujada() === String(primera.alternativas[1].id),
    // El foco vuelve a la alternativa marcada. Reescribir la zona tira el nodo que lo
    // tenia, asi que sin reponerlo un estudiante con teclado queda en el `body`.
    foco: dom.nodo('[data-papel="alternativa"][data-marcada="true"]').focos,
  };

  // Cambiar de alternativa dentro de la misma pregunta.
  pulsar(dom, 'alternativa', { alternativa: primera.alternativas[3].id });

  const trasCambiar = {
    marcadas: cuantas('data-marcada="true"'),
    esLaCuarta: laMarcadaDibujada() === String(primera.alternativas[3].id),
  };

  // UNA ALTERNATIVA QUE NO ES DE ESTA PREGUNTA NO MARCA NADA. Es el clic viejo: un
  // evento que se reenvia despues de que la pregunta ya cambio. Si marcara, la
  // respuesta que se registre al avanzar seria de otra pregunta.
  pulsar(dom, 'alternativa', { alternativa: segunda.alternativas[0].id });

  // Se compara contra lo que habia JUSTO ANTES del clic ajeno, y no contra un valor
  // escrito a mano: asi esta comprobacion no se contagia de lo que haya pasado antes
  // en el bloque. Un clic que no es de esta pregunta no debe mover ni un caracter.
  const antesDeLaAjena = html();

  pulsar(dom, 'alternativa', { alternativa: segunda.alternativas[0].id });

  const trasLaAjena = {
    igual: html() === antesDeLaAjena,
    marcadas: cuantas('data-marcada="true"'),
  };

  // Y NADA DE ESTO SE ESCRIBIO. Tres marcas y un clic ajeno, y el intento guardado
  // sigue igual que al sembrarlo.
  const guardado = respuestasGuardadas(almacen);

  if (oyentes === 0) {
    problemas.push('marcar: la zona del intento no tiene ningun oyente de clic');
  }
  if (!sinMarcar.siguienteApagado) {
    problemas.push('marcar: sin alternativa marcada, «Siguiente» quedo habilitado');
  }
  if (sinMarcar.omitirApagado) {
    problemas.push('marcar: sin alternativa marcada, «Omitir» quedo deshabilitado');
  }
  if (sinMarcar.marcadas !== 0) {
    problemas.push(`marcar: al retomar habia ${sinMarcar.marcadas} alternativas marcadas y tenian que ser 0`);
  }
  if (trasMarcar.siguienteApagado) {
    problemas.push('marcar: con una alternativa marcada, «Siguiente» siguio deshabilitado');
  }
  if (!trasMarcar.omitirApagado) {
    problemas.push('marcar: con una alternativa marcada, «Omitir» siguio habilitado (regla 5 de la epica)');
  }
  if (trasMarcar.marcadas !== 1 || !trasMarcar.esLaSegunda) {
    problemas.push(
        `marcar: quedaron ${trasMarcar.marcadas} marcadas y la pulsada no era la que quedo marcada`
    );
  }
  if (trasMarcar.foco === 0) {
    problemas.push('marcar: tras redibujar, el foco no volvio a la alternativa marcada');
  }
  if (trasCambiar.marcadas !== 1 || !trasCambiar.esLaCuarta) {
    problemas.push(
        `cambiar: quedaron ${trasCambiar.marcadas} marcadas y la ultima pulsada no era la marcada`
    );
  }
  if (!trasLaAjena.igual || trasLaAjena.marcadas !== 1) {
    problemas.push(
        'clic viejo: una alternativa de otra pregunta cambio lo dibujado en la pregunta en curso'
    );
  }
  if ((guardado?.respuestas ?? []).length !== 0 || guardado?.posicion !== 0) {
    problemas.push(
        `marcar: marcar escribio en el almacen (${(guardado?.respuestas ?? []).length} respuesta(s), ` +
        `posicion ${guardado?.posicion}) y no tenia que escribir nada`
    );
  }

  notas.push(
      'Marcar y cambiar: sin nada marcado «Siguiente» sale apagado y «Omitir» encendido; al marcar se ' +
      'invierten y queda UNA sola alternativa con `data-marcada`, con el foco puesto en ella; cambiarla ' +
      'deja solo la ultima; una alternativa de otra pregunta no toca nada; y el almacen sigue con 0 ' +
      'respuestas en la posicion 0, porque marcar no registra.'
  );
}

// ===========================================================================
// 15 · Avanzar registra, dibuja la siguiente y no reescribe lo anterior
//      (iteracion 43)
// ===========================================================================
//
// Aqui se cruza la frontera: hasta el bloque 14 nada se escribia. «Siguiente» es lo
// que convierte una marca en una respuesta guardada, y una vez escrita no vuelve a
// cambiar —es la mitad de la invariante de la iteracion: la posicion solo sube, de a
// uno, y ninguna entrada cambia despues de escrita—.

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  const preguntas = sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0, etiqueta: 'av' });
  simulacro.conectarElRecorrido();
  simulacro.retomarElIntento();

  const html = () => dom.html('#zona-del-intento');
  const cuantas = (trozo) => html().split(trozo).length - 1;

  const laElegida = preguntas[0].alternativas[2];

  // Se responde a los 8 s, para que el instante guardado se pueda distinguir de T0 y
  // de los 30 s del agotamiento: una respuesta escrita con el instante equivocado
  // pasaria desapercibida si todo ocurriera en el mismo milisegundo.
  reloj.avanzar(8000);
  pulsar(dom, 'alternativa', { alternativa: laElegida.id });
  pulsar(dom, 'siguiente');

  const trasAvanzar = respuestasGuardadas(almacen);
  const laEscrita = trasAvanzar?.respuestas?.[0];

  const pantalla = {
    esLaSegunda: html().includes('Pregunta de juguete 2'),
    quedaLaPrimera: html().includes('Pregunta de juguete 1'),
    marcadas: cuantas('data-marcada="true"'),
    siguienteApagado: html().includes('data-papel="siguiente" disabled'),
    omitirApagado: html().includes('data-papel="omitir" disabled'),
    numero: html().match(/Pregunta (\d+) de (\d+)/)?.[0],
    avance: loQueDiceLaFranja(dom).avance,
    // El foco se mueve a la tarjeta nueva: es como se anuncia el cambio de pregunta
    // (decision 4), en vez de una region `aria-live` que interrumpiria la lectura.
    foco: dom.nodo('[data-papel="tarjeta-de-la-pregunta"]').focos,
  };

  // «Siguiente» sin nada marcado no hace nada. Es la segunda embestida: martillear el
  // boton apagado. En el DOM falso no existe el apagado del navegador, asi que el
  // clic llega igual que si alguien lo forzara desde la consola.
  pulsar(dom, 'siguiente');
  pulsar(dom, 'siguiente');

  const trasMartillear = respuestasGuardadas(almacen);

  // Y se responde la segunda, para comprobar que la primera no se toco.
  pulsar(dom, 'alternativa', { alternativa: preguntas[1].alternativas[0].id });
  pulsar(dom, 'siguiente');

  const alFinal = respuestasGuardadas(almacen);

  if (!laEscrita || laEscrita.pregunta_id !== preguntas[0].id) {
    problemas.push(`avanzar: quedo escrito ${JSON.stringify(laEscrita)} y no la pregunta en curso`);
  }
  if (laEscrita?.alternativa_id !== laElegida.id || laEscrita?.estado !== 'respondida') {
    problemas.push(
        `avanzar: se registro ${JSON.stringify(laEscrita)} y tenia que ser respondida con la ${laElegida.id}`
    );
  }
  if (laEscrita?.agotada !== false || laEscrita?.resuelta_en !== T0 + 8000) {
    problemas.push(
        `avanzar: la respuesta quedo con agotada=${laEscrita?.agotada} y resuelta_en=${laEscrita?.resuelta_en}`
    );
  }
  if (trasAvanzar?.posicion !== 1) {
    problemas.push(`avanzar: la posicion quedo en ${trasAvanzar?.posicion} y tenia que ser 1`);
  }
  if (!pantalla.esLaSegunda || pantalla.quedaLaPrimera) {
    problemas.push('avanzar: tras responder no se dibujo la segunda pregunta sola');
  }
  if (pantalla.marcadas !== 0) {
    problemas.push(`avanzar: la pregunta nueva salio con ${pantalla.marcadas} alternativas ya marcadas`);
  }
  if (!pantalla.siguienteApagado || pantalla.omitirApagado) {
    problemas.push('avanzar: la pregunta nueva no salio con «Siguiente» apagado y «Omitir» encendido');
  }
  if (pantalla.numero !== 'Pregunta 2 de 120' || pantalla.avance !== '2/120') {
    problemas.push(
        `avanzar: los indicadores quedaron en «${pantalla.numero}» y «${pantalla.avance}»`
    );
  }
  if (pantalla.foco === 0) {
    problemas.push('avanzar: el foco no se movio a la tarjeta de la pregunta nueva (decision 4)');
  }
  if ((trasMartillear?.respuestas ?? []).length !== 1 || trasMartillear?.posicion !== 1) {
    problemas.push(
        `avanzar: martillear «Siguiente» sin alternativa marcada escribio ` +
        `${(trasMartillear?.respuestas ?? []).length} respuesta(s) y dejo la posicion en ${trasMartillear?.posicion}`
    );
  }
  if (JSON.stringify(alFinal?.respuestas?.[0]) !== JSON.stringify(laEscrita)) {
    problemas.push(
        `invariante: la respuesta ya escrita cambio, de ${JSON.stringify(laEscrita)} a ` +
        `${JSON.stringify(alFinal?.respuestas?.[0])}`
    );
  }
  if (alFinal?.posicion !== 2) {
    problemas.push(`avanzar: tras dos respuestas la posicion quedo en ${alFinal?.posicion} y tenia que ser 2`);
  }

  notas.push(
      'Avanzar: marcar y pulsar «Siguiente» a los 8 s dejo UNA respuesta escrita —respondida, con su ' +
      'alternativa, agotada=false y su instante— y dibujo la pregunta 2 sola, limpia, con los botones ' +
      'de vuelta a su estado inicial, los dos indicadores en 2/120 y el foco en la tarjeta nueva. ' +
      'Martillear «Siguiente» sin marcar no escribio nada, y responder la segunda no toco la primera.'
  );
}

// ===========================================================================
// 16 · Omitir pide dos toques, y la confirmacion se retira al marcar y al
//      cambiar de pregunta (iteracion 43)
// ===========================================================================
//
// El hueco del texto de confirmacion se dibuja SIEMPRE, vacio o lleno, para que
// aparecer no mueva nada bajo el dedo (`probar:identidad` lo mide en los tres
// estados). Por eso aqui se lee su TEXTO y no se pregunta si el elemento existe:
// preguntar por el elemento daria verde siempre.

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  const preguntas = sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0, etiqueta: 'om' });
  simulacro.conectarElRecorrido();
  simulacro.retomarElIntento();

  const html = () => dom.html('#zona-del-intento');

  /** El texto del hueco de confirmacion, o '' si esta vacio. */
  const confirmacion = () =>
      (html().match(/data-papel="confirmacion-de-omitir"[^>]*>([^<]*)<\/p>/)?.[1] ?? '').trim();

  const cuantasEscritas = () => (respuestasGuardadas(almacen)?.respuestas ?? []).length;

  // --- Pregunta 1: un toque no omite, el segundo si -------------------------

  const alEmpezar = confirmacion();

  pulsar(dom, 'omitir');

  const trasUnToque = {
    texto: confirmacion(),
    escritas: cuantasEscritas(),
    sigueLaPrimera: html().includes('Pregunta de juguete 1'),
    // La zona se reescribe al pedir la confirmacion. Sin devolver el foco a
    // «Omitir», quien usa teclado no podria dar el segundo toque sin volver a
    // tabular desde el principio de la pagina.
    foco: dom.nodo('[data-papel="omitir"]').focos,
  };

  pulsar(dom, 'omitir');

  const trasDosToques = respuestasGuardadas(almacen);
  const laOmitida = trasDosToques?.respuestas?.[0];

  const enLaSegunda = {
    esLaSegunda: html().includes('Pregunta de juguete 2'),
    texto: confirmacion(),
  };

  // --- Pregunta 2: marcar retira la confirmacion -----------------------------

  pulsar(dom, 'omitir');
  const antesDeMarcar = confirmacion();

  pulsar(dom, 'alternativa', { alternativa: preguntas[1].alternativas[0].id });
  const trasMarcar = confirmacion();

  // Con algo marcado «Omitir» esta apagado. Forzarlo dos veces no omite nada.
  pulsar(dom, 'omitir');
  pulsar(dom, 'omitir');
  const escritasTrasForzar = cuantasEscritas();

  // --- Pregunta 3: la confirmacion no sobrevive a que el reloj cambie de pregunta

  pulsar(dom, 'siguiente');
  pulsar(dom, 'omitir');
  const enLaTercera = confirmacion();

  // La tercera empezo al responder la segunda, sin mover el reloj: se agota a los 30 s.
  reloj.avanzar(MS);

  const trasAgotarse = {
    esLaCuarta: html().includes('Pregunta de juguete 4'),
    texto: confirmacion(),
    escritas: cuantasEscritas(),
    laTercera: respuestasGuardadas(almacen)?.respuestas?.[2],
  };

  // LO QUE DE VERDAD IMPORTA: en la cuarta, UN toque vuelve a no omitir. Si la
  // confirmacion hubiera sobrevivido por dentro aunque no se viera, este toque
  // omitiria la cuarta pregunta sin haberlo pedido dos veces.
  pulsar(dom, 'omitir');
  const escritasTrasUnToqueEnLaCuarta = cuantasEscritas();

  if (alEmpezar !== '') {
    problemas.push(`omitir: al retomar, el hueco de confirmacion ya decia «${alEmpezar}»`);
  }
  if (!trasUnToque.texto.includes('otra vez')) {
    problemas.push('omitir: tras el primer toque no aparecio el texto de confirmacion');
  }
  if (trasUnToque.escritas !== 0 || !trasUnToque.sigueLaPrimera) {
    problemas.push('omitir: UN solo toque omitio la pregunta, sin pedir confirmacion');
  }
  if (trasUnToque.foco === 0) {
    problemas.push('omitir: tras el primer toque el foco no volvio a «Omitir»');
  }
  if (
      laOmitida?.pregunta_id !== preguntas[0].id ||
      laOmitida?.alternativa_id !== null ||
      laOmitida?.estado !== 'omitida' ||
      laOmitida?.agotada !== false
  ) {
    problemas.push(`omitir: el segundo toque registro ${JSON.stringify(laOmitida)} y no una omitida`);
  }
  if (trasDosToques?.posicion !== 1 || !enLaSegunda.esLaSegunda) {
    problemas.push('omitir: tras el segundo toque no se paso a la pregunta 2');
  }
  if (enLaSegunda.texto !== '') {
    problemas.push('omitir: la confirmacion paso a la pregunta siguiente');
  }
  if (!antesDeMarcar.includes('otra vez')) {
    problemas.push('omitir: en la pregunta 2 el primer toque no pidio confirmacion');
  }
  if (trasMarcar !== '') {
    problemas.push('omitir: marcar una alternativa no retiro la confirmacion');
  }
  if (escritasTrasForzar !== 1) {
    problemas.push(
        `omitir: forzar «Omitir» con una alternativa marcada dejo ${escritasTrasForzar} respuestas y tenia que dejar 1`
    );
  }
  if (!enLaTercera.includes('otra vez')) {
    problemas.push('omitir: en la pregunta 3 el primer toque no pidio confirmacion');
  }
  if (!trasAgotarse.esLaCuarta || trasAgotarse.escritas !== 3) {
    problemas.push('omitir: al agotarse la tercera no se paso a la cuarta con 3 respuestas escritas');
  }
  if (trasAgotarse.laTercera?.estado !== 'omitida' || trasAgotarse.laTercera?.agotada !== true) {
    problemas.push(
        `omitir: la tercera se agoto sin nada marcado y quedo ${JSON.stringify(trasAgotarse.laTercera)}`
    );
  }
  if (trasAgotarse.texto !== '') {
    problemas.push('omitir: la confirmacion sobrevivio a que el reloj cambiara de pregunta');
  }
  if (escritasTrasUnToqueEnLaCuarta !== 3) {
    problemas.push(
        'omitir: la confirmacion sobrevivio POR DENTRO al cambio de pregunta: un solo toque omitio la cuarta'
    );
  }

  notas.push(
      'Omitir: el primer toque no omite, escribe «Toca Omitir otra vez» en su hueco y devuelve el foco ' +
      'al boton; el segundo registra la omitida (sin alternativa, agotada=false) y pasa a la 2 con el ' +
      'hueco vacio. Marcar retira la confirmacion, y forzar «Omitir» con algo marcado no escribe nada. ' +
      'Cuando el reloj agota una pregunta con la confirmacion pedida, la siguiente empieza de cero: un ' +
      'solo toque vuelve a no omitir.'
  );
}

// ===========================================================================
// 17 · Lo que el marcado del intento es, y lo que nunca contiene
//      (iteracion 43)
// ===========================================================================
//
// Se recorren cinco estados de la misma pantalla y en CADA uno se barre el HTML
// entero. Un dato que se cuela solo en un estado raro —pidiendo confirmacion, justo
// despues de agotarse— es exactamente el que una comprobacion de un solo estado no ve.

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  const preguntas = sembrarIntento(almacen, { empezadoEn: T0 });

  // La copia congelada trae `es_correcta` desde siempre. Se le agrega ademas una
  // justificacion con una marca inconfundible, para poder buscarla en lo dibujado: la
  // del banco real no se reconoceria a simple vista entre el resto del texto.
  const SECRETO = 'JUSTIFICACION-QUE-NO-SE-DIBUJA';
  const guardadas = JSON.parse(almacen.datos.get('examen-td-js.simulacro.preguntas'));
  guardadas.preguntas = guardadas.preguntas.map((p) => ({
    ...p,
    justificacion: `${SECRETO} ${p.id}`,
  }));
  almacen.datos.set('examen-td-js.simulacro.preguntas', JSON.stringify(guardadas));

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0, etiqueta: 'mk' });
  simulacro.conectarElRecorrido();
  simulacro.retomarElIntento();

  const estados = [];
  const fotografiar = (nombre) => estados.push({ nombre, html: dom.html('#zona-del-intento') });

  fotografiar('recien retomada');
  pulsar(dom, 'alternativa', { alternativa: preguntas[0].alternativas[1].id });
  fotografiar('con una alternativa marcada');
  pulsar(dom, 'siguiente');
  fotografiar('tras avanzar');
  pulsar(dom, 'omitir');
  fotografiar('pidiendo confirmacion de omitir');
  reloj.avanzar(MS);
  fotografiar('tras agotarse una pregunta');

  // Lo que no puede aparecer en ningun estado del intento. `correct` atrapa
  // `es_correcta`, `data-correcta`, `correcta`, `incorrecta` y los estados `correct`
  // del cuestionario; los dos colores son los que la guia visual reserva al acierto
  // y al error en el resumen.
  const prohibidos = [
    ['correct', 'una marca de acierto'],
    [SECRETO, 'la justificacion'],
    ['esmeralda', 'el color del acierto'],
    ['ruby', 'el color del error'],
    ['comenzar-simulacro', 'un control para rearmar el intento (decision 8)'],
  ];

  // Si la copia con la justificacion agregada no se hubiera podido retomar, todo lo de
  // abajo daria verde sobre una pantalla vacia. Se descarta ese caso primero.
  if (!estados[0].html.includes('data-papel="tarjeta-de-la-pregunta"')) {
    problemas.push('marcado: el intento con justificaciones no se retomo, y el barrido no miraria nada');
  }

  for (const { nombre, html } of estados) {
    const enMinusculas = html.toLowerCase();
    const cuantas = (trozo) => html.split(trozo).length - 1;

    for (const [trozo, que] of prohibidos) {
      if (enMinusculas.includes(trozo.toLowerCase())) {
        problemas.push(`marcado (${nombre}): lo dibujado contiene ${que} («${trozo}»)`);
      }
    }

    const grupos = cuantas('role="radiogroup"');
    const radios = cuantas('role="radio"');
    const estadosDeRadio = cuantas('aria-checked=');

    if (grupos !== 1 || radios !== 4 || estadosDeRadio !== 4) {
      problemas.push(
          `marcado (${nombre}): las alternativas no son un grupo de radio ` +
          `(radiogroup ${grupos}, radio ${radios}, aria-checked ${estadosDeRadio})`
      );
    }
    if (html.includes('aria-pressed')) {
      problemas.push(`marcado (${nombre}): quedo un aria-pressed de los botones de alternancia de la 45`);
    }
    if (
        !html.includes('aria-labelledby="enunciado-de-la-pregunta"') ||
        !html.includes('id="enunciado-de-la-pregunta"')
    ) {
      problemas.push(`marcado (${nombre}): el grupo de radio no dice de que pregunta es`);
    }
  }

  const conMarcada = estados.find((e) => e.nombre === 'con una alternativa marcada');
  if (conMarcada.html.split('aria-checked="true"').length - 1 !== 1) {
    problemas.push('marcado: con una alternativa marcada no hay exactamente un aria-checked="true"');
  }

  notas.push(
      `Marcado: en ${estados.length} estados del intento (${estados.map((e) => e.nombre).join(', ')}) ` +
      'lo dibujado no contiene ninguna marca de acierto, ni la justificacion sembrada, ni los colores ' +
      'del resultado, ni un boton con el id de «Comenzar»; y las alternativas son siempre un ' +
      'radiogroup con 4 radio y su aria-checked, sin aria-pressed, atado al enunciado.'
  );
}

// ===========================================================================
// 18 · Un intento completo de 120 preguntas, con recarga a mitad y un salto
//      de 90 segundos (iteracion 43)
// ===========================================================================
//
// El bloque que junta todo. Se juega un intento entero con el reloj controlable,
// repitiendo cinco maneras de resolver una pregunta —cambiar y avanzar, omitir con
// dos toques, agotarse con algo marcado, agotarse sin nada, marcar y avanzar—, y se
// le mete en medio una recarga con una alternativa marcada y un salto de 90 s sin
// latidos. Despues de CADA accion se comprueba la invariante de la iteracion: la
// posicion solo sube, de a uno, y ninguna entrada cambia despues de escrita. Y se
// barre lo dibujado buscando cualquier camino hacia una pregunta anterior.
//
// Los bloques 13 a 17 prueban cada pieza en las primeras preguntas; este es el unico
// que llega a la 120, y por eso el unico que veria un defecto que aparece tarde.

{
  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  const preguntas = sembrarIntento(almacen, { empezadoEn: T0 });
  const preguntasSembradas = almacen.datos.get('examen-td-js.simulacro.preguntas');

  // `v` es la visita en curso. Se reemplaza al recargar, y todo lo de abajo la lee en
  // el momento, asi que despues de la recarga se mira la pagina nueva.
  let v = await montarVisita({ almacen, desde: T0, etiqueta: 'i1' });
  v.simulacro.conectarElRecorrido();
  v.simulacro.retomarElIntento();

  const html = () => v.dom.html('#zona-del-intento');
  const guardado = () => respuestasGuardadas(almacen);
  const agotar = () => v.reloj.avanzar(guardado().comenzada_en + MS - v.reloj.ahora());

  /** Lo que el guion hizo, para compararlo al final con lo que quedo escrito. */
  const esperado = [];
  const anotar = (i, alternativa_id, estado, agotada) =>
      esperado.push({ pregunta_id: preguntas[i].id, alternativa_id, estado, agotada });

  const fallas = { invariante: [], indicadores: [], barrido: [], clicViejo: [] };
  let anterior = guardado();

  /** Se llama despues de cada accion. No corta: junta, y al final se informa. */
  const revisar = (paso) => {
    const actual = guardado();
    const antes = anterior?.respuestas ?? [];
    const despues = actual?.respuestas ?? [];

    if ((actual?.posicion ?? 0) < (anterior?.posicion ?? 0)) {
      fallas.invariante.push(`${paso}: la posicion bajo de ${anterior?.posicion} a ${actual?.posicion}`);
    }

    const cambiada = antes.findIndex((r, k) => JSON.stringify(despues[k]) !== JSON.stringify(r));
    if (cambiada !== -1) {
      fallas.invariante.push(`${paso}: cambio la respuesta ${cambiada + 1}, que ya estaba escrita`);
    }

    // DE A UNO: cada entrada es de la pregunta que le toca, sin saltos ni repeticiones.
    const fueraDeOrden = despues.findIndex((r, k) => r.pregunta_id !== preguntas[k].id);
    if (fueraDeOrden !== -1) {
      fallas.invariante.push(
          `${paso}: la respuesta ${fueraDeOrden + 1} es de la pregunta ${despues[fueraDeOrden].pregunta_id}`
      );
    }

    anterior = actual;

    const dibujado = html();
    if (!dibujado.includes('data-papel="tarjeta-de-la-pregunta"')) return;

    const numero = dibujado.match(/Pregunta (\d+) de (\d+)/);
    const franja = loQueDiceLaFranja(v.dom).avance;

    if (`${numero?.[1]}/${numero?.[2]}` !== franja) {
      fallas.indicadores.push(`${paso}: la tarjeta dice «${numero?.[0]}» y la franja «${franja}»`);
    }
    if (Number(numero?.[1]) !== (actual?.posicion ?? 0) + 1) {
      fallas.indicadores.push(
          `${paso}: la tarjeta dice ${numero?.[1]} con la posicion guardada en ${actual?.posicion}`
      );
    }

    // EL BARRIDO ESTRUCTURAL: lo unico pulsable son las 4 alternativas y los 2 botones.
    // Un enlace, un septimo boton o un texto de vuelta atras serian un camino hacia una
    // pregunta anterior, lo usen o no lo usen hoy.
    const botones = dibujado.split('<button').length - 1;
    if (botones !== 6 || dibujado.includes('<a ') || /anterior|atr[aá]s|volver/i.test(dibujado)) {
      fallas.barrido.push(`${paso}: ${botones} botones, o un enlace o un texto de vuelta atras`);
    }
  };

  /** Una embestida: el clic de una pregunta ya resuelta, reenviado despues. */
  const clicViejo = (k) => {
    const antes = html();
    pulsar(v.dom, 'alternativa', { alternativa: preguntas[k].alternativas[0].id });
    if (html() !== antes) {
      fallas.clicViejo.push(`un clic de la pregunta ${k + 1} cambio lo dibujado despues`);
    }
  };

  let recarga = null;
  let salto = null;
  let i = 0;

  while (i < TOTAL) {
    // --- Recarga a mitad de la pregunta 61, con una alternativa marcada -------
    if (i === 60 && !recarga) {
      v.reloj.avanzar(2000);
      pulsar(v.dom, 'alternativa', { alternativa: preguntas[60].alternativas[1].id });
      const respuestasAntes = JSON.stringify(guardado().respuestas);

      v = await montarVisita({ almacen, desde: v.reloj.ahora(), etiqueta: 'i2' });
      v.simulacro.conectarElRecorrido();
      v.simulacro.retomarElIntento();

      recarga = {
        tarjeta: html().match(/Pregunta (\d+) de (\d+)/)?.[0],
        esLa61: html().includes('Pregunta de juguete 61'),
        marcadas: html().split('data-marcada="true"').length - 1,
        mismasPreguntas: almacen.datos.get('examen-td-js.simulacro.preguntas') === preguntasSembradas,
        mismasRespuestas: JSON.stringify(guardado().respuestas) === respuestasAntes,
      };
      revisar('recarga');
    }

    // --- Salto de 90 s sin un solo latido, al empezar la pregunta 91 -----------
    if (i === 90) {
      const empezo = guardado().comenzada_en;
      v.reloj.saltar(90000);
      v.reloj.avanzar(0);

      for (let k = 90; k < 93; k += 1) anotar(k, null, 'omitida', true);

      salto = {
        instantes: guardado().respuestas.slice(90, 93).map((r) => r.resuelta_en - empezo),
        tarjeta: html().match(/Pregunta (\d+) de (\d+)/)?.[0],
      };
      revisar('salto de 90 s');
      clicViejo(92);
      i = 93;
      continue;
    }

    const alt = preguntas[i].alternativas;
    v.reloj.avanzar(2000);

    switch (i % 5) {
      case 0: // marcar, cambiar de idea y avanzar
        pulsar(v.dom, 'alternativa', { alternativa: alt[1].id });
        revisar(`pregunta ${i + 1}, marcada`);
        pulsar(v.dom, 'alternativa', { alternativa: alt[2].id });
        revisar(`pregunta ${i + 1}, cambiada`);
        pulsar(v.dom, 'siguiente');
        anotar(i, alt[2].id, 'respondida', false);
        break;
      case 1: // omitir con dos toques
        pulsar(v.dom, 'omitir');
        revisar(`pregunta ${i + 1}, primer toque de omitir`);
        pulsar(v.dom, 'omitir');
        anotar(i, null, 'omitida', false);
        break;
      case 2: // marcar y dejar que se agote
        pulsar(v.dom, 'alternativa', { alternativa: alt[3].id });
        revisar(`pregunta ${i + 1}, marcada`);
        agotar();
        anotar(i, alt[3].id, 'respondida', true);
        break;
      case 3: // no hacer nada y dejar que se agote
        agotar();
        anotar(i, null, 'omitida', true);
        break;
      default: // marcar y avanzar
        pulsar(v.dom, 'alternativa', { alternativa: alt[0].id });
        pulsar(v.dom, 'siguiente');
        anotar(i, alt[0].id, 'respondida', false);
    }

    revisar(`pregunta ${i + 1}, resuelta`);
    clicViejo(i);
    i += 1;
  }

  // --- El final ----------------------------------------------------------------

  const final = guardado();
  const pantallaFinal = html();

  // Despues del final no hay nada que pulsar ni nada que se agote.
  pulsar(v.dom, 'alternativa', { alternativa: preguntas[119].alternativas[0].id });
  pulsar(v.dom, 'siguiente');
  pulsar(v.dom, 'omitir');
  pulsar(v.dom, 'omitir');
  v.reloj.avanzar(10 * MS);
  const trasElFinal = guardado();

  const escrito = (final?.respuestas ?? []).map(({ pregunta_id, alternativa_id, estado, agotada }) => ({
    pregunta_id,
    alternativa_id,
    estado,
    agotada,
  }));
  const primeraDistinta = esperado.findIndex((e, k) => JSON.stringify(escrito[k]) !== JSON.stringify(e));
  const instantes = (final?.respuestas ?? []).map((r) => r.resuelta_en);
  const retrocede = instantes.findIndex((t, k) => k > 0 && t < instantes[k - 1]);

  if (escrito.length !== TOTAL || final?.posicion !== TOTAL) {
    problemas.push(
        `intento completo: quedaron ${escrito.length} respuestas y la posicion en ${final?.posicion}; ` +
        `tenian que ser ${TOTAL}`
    );
  }
  if (primeraDistinta !== -1) {
    problemas.push(
        `intento completo: la respuesta ${primeraDistinta + 1} quedo ${JSON.stringify(escrito[primeraDistinta])} ` +
        `y el guion hizo ${JSON.stringify(esperado[primeraDistinta])}`
    );
  }
  if (retrocede !== -1) {
    problemas.push(`intento completo: la respuesta ${retrocede + 1} tiene un instante anterior al de la ${retrocede}`);
  }
  if (!final?.terminado_en) {
    problemas.push('intento completo: el intento no quedo marcado como terminado');
  }
  if (!pantallaFinal.includes('Intento terminado') || pantallaFinal.includes('data-papel="tarjeta-de-la-pregunta"')) {
    problemas.push('intento completo: al resolver la 120 no se dibujo «Intento terminado» (decision 5)');
  }
  if (JSON.stringify(trasElFinal) !== JSON.stringify(final)) {
    problemas.push('intento completo: despues del final, pulsar o dejar correr el reloj cambio lo guardado');
  }
  if (recarga?.tarjeta !== 'Pregunta 61 de 120' || !recarga?.esLa61) {
    problemas.push(`recarga: al volver se dibujo «${recarga?.tarjeta}» y no la pregunta 61`);
  }
  if (recarga?.marcadas !== 0) {
    problemas.push('recarga: la alternativa marcada y no registrada sobrevivio a la recarga');
  }
  if (!recarga?.mismasPreguntas || !recarga?.mismasRespuestas) {
    problemas.push('recarga: cambiaron las preguntas guardadas o lo ya respondido');
  }
  if (JSON.stringify(salto?.instantes) !== JSON.stringify([30000, 60000, 90000]) || salto?.tarjeta !== 'Pregunta 94 de 120') {
    problemas.push(
        `salto de 90 s: se resolvieron con instantes ${JSON.stringify(salto?.instantes)} y quedo «${salto?.tarjeta}»`
    );
  }
  for (const [tipo, lista] of Object.entries(fallas)) {
    if (lista.length > 0) {
      problemas.push(`intento completo, ${tipo}: ${lista.length} falla(s); la primera: ${lista[0]}`);
    }
  }

  const cuenta = (condicion) => escrito.filter(condicion).length;

  notas.push(
      `Intento completo: ${escrito.length} preguntas con el reloj controlable —` +
      `${cuenta((r) => r.estado === 'respondida' && !r.agotada)} respondidas avanzando, ` +
      `${cuenta((r) => r.estado === 'respondida' && r.agotada)} agotadas con algo marcado, ` +
      `${cuenta((r) => r.estado === 'omitida' && !r.agotada)} omitidas con dos toques y ` +
      `${cuenta((r) => r.estado === 'omitida' && r.agotada)} agotadas sin nada—, con una recarga a mitad ` +
      'de la 61 que perdio la marca sin registrar nada y un salto de 90 s que resolvio la 91, la 92 y la ' +
      '93 cada una en su vencimiento. Despues de cada accion la posicion solo subio, de a uno, ninguna ' +
      'entrada cambio, los dos indicadores coincidieron, un clic viejo no movio nada y lo dibujado no ' +
      'tuvo ningun camino atras. El registro final coincide con lo provocado, y al terminar se dibujo ' +
      '«Intento terminado».'
  );
}

// ===========================================================================
// 19 · Una sola parada de tabulador en el grupo (iteracion 43, tanda 2)
// ===========================================================================
//
// Decision 11, punto 1. Un grupo de radio es UNA parada del tabulador: Tab entra a la
// alternativa marcada o, si no hay, a la primera, y el siguiente Tab sale del grupo.
// Eso se escribe en el marcado con `tabindex`: "0" en la que recibe el Tab y "-1" en
// las otras tres, que siguen siendo enfocables por programa (las flechas del bloque
// 20 las alcanzan). Se lee la etiqueta ENTERA de cada alternativa, no dos atributos
// pegados, por lo que enseno el bloque 14.
//
// Se revisa en seis estados de la pantalla, porque la parada cambia de dueno: pasa a
// la marcada al marcar, sigue a la marcada al cambiar, y vuelve a la primera en cada
// pregunta nueva, llegue por «Siguiente» o por el reloj.

{
  const problemasAntes = problemas.length;

  const almacen = almacenDeMentira();
  const T0 = 1767225600000;
  const preguntas = sembrarIntento(almacen, { empezadoEn: T0 });

  const { reloj, dom, simulacro } = await montarVisita({ almacen, desde: T0, etiqueta: 'tb' });
  simulacro.conectarElRecorrido();
  simulacro.retomarElIntento();

  const html = () => dom.html('#zona-del-intento');

  /** Cada alternativa dibujada, con su id y el tabindex que trae su etiqueta. */
  const paradas = () =>
      [...html().matchAll(/<button[^>]*data-papel="alternativa"[^>]*>/g)].map(([etiqueta]) => ({
        id: etiqueta.match(/data-alternativa="([^"]*)"/)?.[1],
        tabindex: etiqueta.match(/tabindex="([^"]*)"/)?.[1] ?? null,
      }));

  const revisados = [];

  const revisar = (estado, laQueDebe) => {
    revisados.push(estado);
    const lista = paradas();
    const enCero = lista.filter((a) => a.tabindex === '0');
    const fuera = lista.filter((a) => a.tabindex === '-1');

    if (lista.length !== 4 || enCero.length !== 1 || fuera.length !== 3) {
      problemas.push(
          `tabulador (${estado}): ${enCero.length} alternativa(s) con tabindex="0" y ` +
          `${fuera.length} con "-1", de ${lista.length}; tenian que ser 1 y 3`
      );
      return;
    }
    if (enCero[0].id !== String(laQueDebe)) {
      problemas.push(
          `tabulador (${estado}): la parada del grupo es la ${enCero[0].id} y tenia que ser la ${laQueDebe}`
      );
    }
  };

  const primera = preguntas[0].alternativas;
  const segunda = preguntas[1].alternativas;
  const tercera = preguntas[2].alternativas;

  revisar('recien retomada, sin marcar', primera[0].id);

  pulsar(dom, 'alternativa', { alternativa: primera[2].id });
  revisar('con la tercera marcada', primera[2].id);

  pulsar(dom, 'alternativa', { alternativa: primera[3].id });
  revisar('tras cambiar a la cuarta', primera[3].id);

  pulsar(dom, 'siguiente');
  revisar('en la pregunta siguiente', segunda[0].id);

  pulsar(dom, 'omitir');
  revisar('pidiendo confirmacion de omitir', segunda[0].id);

  // La segunda empezo al avanzar, sin mover el reloj: se agota a los 30 s.
  reloj.avanzar(MS);
  revisar('tras agotarse la pregunta', tercera[0].id);

  if (problemas.length === problemasAntes) {
    notas.push(
        `Tabulador: en ${revisados.length} estados (${revisados.join(', ')}) el grupo tiene una sola ` +
        'parada —tabindex="0" en la marcada o, sin marcar, en la primera— y las otras tres en "-1".'
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
console.log('CRONOMETROS Y RECORRIDO DEL SIMULACRO (iteraciones 42 y 43)');
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

console.log('Lo que esto NO prueba, y comprueba el autor en un navegador: que el navegador');
console.log('de verdad estrangule los temporizadores como los estrangula saltar(), que el');
console.log('evento storage se entregue entre dos pestanas reales y cuando, que los dos');
console.log('cronometros se entiendan mirandolos en un telefono, que un lector de pantalla');
console.log('lea el enunciado nuevo al moverse el foco, y que los toques reales en un');
console.log('telefono caigan donde el dedo apunta.');
console.log('');
console.log('codigo de salida: 0');
