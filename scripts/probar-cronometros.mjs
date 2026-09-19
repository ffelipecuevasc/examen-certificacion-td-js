/**
 * Los dos cronometros del simulacro, provocados con el reloj controlable.
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

// ===========================================================================
// 1 · El cronometro de la pregunta, en varios puntos de la misma pregunta
// ===========================================================================

{
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

  notas.push(
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
console.log('CRONOMETROS DEL SIMULACRO (iteracion 42)');
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
console.log('evento storage se entregue entre dos pestanas reales y cuando, y que los dos');
console.log('cronometros se entiendan mirandolos en un telefono.');
console.log('');
console.log('codigo de salida: 0');
