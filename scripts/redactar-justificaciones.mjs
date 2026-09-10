/**
 * Arma el documento de revision de justificaciones de un modulo (iteracion 25).
 *
 *   node scripts/redactar-justificaciones.mjs 2
 *
 * POR QUE ESTE DOCUMENTO EXISTE, Y POR QUE TIENE ESTA FORMA
 *
 * Las justificaciones no estan en ninguno de los dos bancos: hay que escribirlas.
 * Las redacta Claude Code y las revisa el autor, que no publica 52 explicaciones
 * sin leerlas.
 *
 * Y una justificacion NO SE PUEDE REVISAR SIN LA PREGUNTA AL LADO. Una lista de
 * 52 parrafos sueltos es irrevisable: no hay forma de saber si la explicacion es
 * correcta sin ver el enunciado, las cuatro alternativas y cual esta marcada. Por
 * eso cada bloque trae todo junto, aunque el archivo quede largo.
 *
 * EL RIESGO DE QUE LAS REDACTE UNA MAQUINA, DICHO ANTES DE QUE PASE
 *
 * Un borrador fluido es mas facil de aprobar sin leer que una pagina en blanco.
 * Es el mismo mecanismo que dejo pasar «Pendiente de redaccion» como
 * justificacion en el trabajo que hubo que descartar. La mitigacion es que las
 * dudas se marcan DENTRO del texto con **[DUDA]**, en vez de entregar 52 parrafos
 * igual de confiados, y que las preguntas con duda salen ademas listadas al
 * principio.
 *
 * QUE HACE EL AUTOR CON ESTE ARCHIVO
 *
 * Lo edita. Marca la casilla de cada bloque que aprueba, corrige el texto que no
 * le sirva, y deja sin marcar lo que no acepta. Despues, un segundo paso lo lee
 * de vuelta: lo aprobado entra como `activa` y lo demas se queda en `borrador`.
 * Sin marca no hay activacion, y eso no es un plan B: es la regla.
 *
 * LOS DELIMITADORES NO SON DECORACION
 *
 * El texto de cada justificacion va entre marcas HTML de comentario, para que se
 * pueda leer de vuelta sin ambiguedad aunque el autor escriba varios parrafos,
 * comillas o listas. Sin ellas habria que adivinar donde termina la justificacion
 * y empieza el resto del bloque, y adivinar es justo lo que este proyecto no hace
 * con el contenido del banco.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CUESTIONARIOS = join(RAIZ, '_planmaestro', '00_producto', 'cuestionarios');

const raya = '='.repeat(72);

function morir(motivo, detalle = []) {
  console.log(`\n${raya}\nNO SE GENERO\n${raya}`);
  console.log(motivo);
  for (const linea of detalle) console.log(linea);
  console.log('\ncodigo de salida: 1\n');
  process.exit(1);
}

const modulo = Number(process.argv.slice(2).find((a) => /^\d+$/.test(a)));

if (!Number.isInteger(modulo) || modulo < 2 || modulo > 8) {
  morir('Falta el numero de modulo, y tiene que estar entre 2 y 8.');
}

const rutaEncargo = join(RAIZ, 'd1', 'encargos', `modulo-0${modulo}.json`);
const rutaTextos = join(CUESTIONARIOS, 'justificaciones', `modulo-0${modulo}.json`);
const rutaSalida = join(CUESTIONARIOS, 'justificaciones', `modulo-0${modulo}-revision.md`);

if (!existsSync(rutaEncargo)) morir(`No existe el encargo. Corre antes: node scripts/convertir-banco.mjs ${modulo}`);
if (!existsSync(rutaTextos)) morir(`No existe ${rutaTextos.replace(RAIZ, '.')}.`);

const encargo = JSON.parse(readFileSync(rutaEncargo, 'utf8'));
const fuente = JSON.parse(readFileSync(rutaTextos, 'utf8'));
const textos = fuente.justificaciones ?? {};

// ---------------------------------------------------------------------------
// Ninguna pregunta sin texto pasa en silencio
// ---------------------------------------------------------------------------

const sinTexto = encargo.preguntas.filter((p) => {
  const t = textos[`${p.origen}#${p.numero_origen}`];
  return typeof t !== 'string' || t.trim().length === 0;
});

if (sinTexto.length > 0) {
  morir(`Faltan ${sinTexto.length} justificacion(es), y no se rellenan solas.`, [
    '',
    ...sinTexto.map((p) => `  - ${p.origen}#${p.numero_origen}: ${p.enunciado.slice(0, 60)}...`),
    '',
    'Una justificacion ausente se queda ausente y su pregunta se queda en',
    'borrador. Inventar el campo para que el documento salga completo es',
    'exactamente lo que costo descartar un trabajo entero en este proyecto.',
  ]);
}

const sobran = Object.keys(textos).filter(
  (clave) => !encargo.preguntas.some((p) => `${p.origen}#${p.numero_origen}` === clave)
);

if (sobran.length > 0) {
  morir(`Hay ${sobran.length} justificacion(es) que no corresponden a ninguna pregunta del lote.`, [
    '',
    ...sobran.map((c) => `  - ${c}`),
  ]);
}

// ---------------------------------------------------------------------------
// El documento
// ---------------------------------------------------------------------------

const conDuda = encargo.preguntas.filter((p) => textos[`${p.origen}#${p.numero_origen}`].includes('[DUDA]'));

const ref = (p) => (p.origen === 'json_2026' ? `m0${modulo}#${p.numero_origen}` : `M${modulo}-${p.numero_origen}`);

/**
 * Escapa los angulos que no estan dentro de comillas invertidas.
 *
 * Sin esto, `git branch -n <rama>` se renderiza como una etiqueta HTML
 * desconocida y DESAPARECE al previsualizar el markdown: las tres alternativas
 * de esa pregunta quedarian identicas en pantalla, que es la peor forma posible
 * de presentarle a alguien un texto que tiene que revisar.
 *
 * Se respetan los tramos entre comillas invertidas porque ahi el markdown ya
 * trata el contenido como literal, y escaparlos mostraria «&lt;select&gt;».
 *
 * Esto es SOLO para la vista. El encargo no se toca: el dato que se carga en D1
 * es el del archivo de origen, sin escapar, y quien lo escapa al dibujarlo en el
 * sitio es `esc()` en el navegador.
 */
function paraLeer(texto) {
  return texto
    .split('`')
    .map((tramo, i) => (i % 2 === 0 ? tramo.replace(/</g, '&lt;').replace(/>/g, '&gt;') : tramo))
    .join('`');
}

/** Huella corta y estable de un texto. Sirve para saber si algo cambio. */
const sello = (texto) => createHash('sha256').update(texto).digest('hex').slice(0, 12);

/**
 * Lo que el autor ya reviso, rescatado del documento anterior.
 *
 * POR QUE ESTO EXISTE. El autor marca 52 casillas a mano. Regenerar el documento
 * y devolverlas todas a cero le haria repetir un trabajo que ya hizo, y peor:
 * ensenaria que las marcas no valen nada, con lo que la proxima revision seria
 * mas rapida y menos atenta.
 *
 * LA REGLA, Y ES UNA SOLA. Una aprobacion sobrevive mientras no cambie NI la
 * pregunta NI su justificacion. Si cambia cualquiera de las dos, la casilla
 * vuelve a cero, porque lo aprobado era ese par y ya no existe. Es lo que dijo el
 * autor de sus cinco dudas: «las aprobe con la duda dentro».
 */
const anterior = new Map();

if (existsSync(rutaSalida)) {
  const previo = readFileSync(rutaSalida, 'utf8');
  const bloques = previo.split('<!-- pregunta: ').slice(1);

  for (const bloque of bloques) {
    const cabecera = bloque.slice(0, bloque.indexOf('-->'));
    const clave = cabecera.split('|')[0].trim();

    const desde = bloque.indexOf('<!-- justificacion:inicio -->');
    const hasta = bloque.indexOf('<!-- justificacion:fin -->');
    if (desde === -1 || hasta === -1) continue;

    const texto = bloque.slice(desde + '<!-- justificacion:inicio -->'.length, hasta).trim();
    const trozo = bloque.slice(hasta);

    anterior.set(clave, {
      // El sello sirve para UNA sola cosa: saber si el autor escribio dentro del
      // documento. La preservacion de la casilla NO se apoya en el, sino en
      // comparar los textos, para que tambien funcione sobre un documento
      // generado antes de que los sellos existieran.
      just: (cabecera.match(/just:([0-9a-f]+)/) ?? [])[1] ?? null,
      texto,
      // El cuerpo de la pregunta tal como se dibujo: enunciado y alternativas.
      // Si cambia cualquiera de los dos, lo que el autor aprobo ya no existe.
      cuerpo: bloque.slice(bloque.indexOf('-->') + 3, desde).trim(),
      aprobada: /^- \[x\] Aprobada/m.test(trozo),
    });
  }
}

// Si el autor escribio dentro del documento, el documento va por delante del
// JSON y regenerar borraria su trabajo. Se detiene y se dice cuales: sobrescribir
// en silencio el texto de quien esta revisando es la peor cosa que podria hacer
// esta herramienta.
const editadasEnElDocumento = [];

for (const [clave, viejo] of anterior) {
  if (viejo.just && sello(viejo.texto) !== viejo.just) editadasEnElDocumento.push(clave);
}

if (editadasEnElDocumento.length > 0) {
  morir(`${editadasEnElDocumento.length} justificacion(es) se editaron dentro del documento.`, [
    '',
    ...editadasEnElDocumento.map((c) => `  - ${c}`),
    '',
    'Ese texto es mas nuevo que el del JSON y regenerar lo perderia. Subelo antes',
    `a ${rutaTextos.replace(RAIZ, '.')}, o dime que lo adopte.`,
  ]);
}

let conservadas = 0;
let reabiertas = [];

const lineas = [];

lineas.push(`# Justificaciones del módulo ${modulo} · para revisar`);
lineas.push('');
lineas.push(`**Lote:** ${encargo.preguntas.length} preguntas · **Redactadas:** ${fuente.redactadas_en} por ${fuente.redactadas_por}`);
lineas.push('');
lineas.push('Las justificaciones no existen en ninguno de los dos bancos de origen: hay que');
lineas.push('escribirlas. Éstas son un **borrador para revisar**, no contenido aprobado.');
lineas.push('');
lineas.push('## Cómo se revisa esto');
lineas.push('');
lineas.push('1. **Empieza por la lista de dudas**, más abajo. Es corta y es donde está el valor.');
lineas.push('2. Recorre los bloques. En cada uno tienes el enunciado, las cuatro alternativas');
lineas.push('   con la correcta marcada `←`, y la justificación propuesta.');
lineas.push('3. **Marca la casilla** de la que apruebes. Corrige el texto que no te sirva:');
lineas.push('   escribe directamente entre las marcas `<!-- justificacion:inicio -->` y');
lineas.push('   `<!-- justificacion:fin -->`, que es lo que se lee de vuelta.');
lineas.push('4. Lo que quede **sin marcar se carga en `borrador`** y no lo ve ningún estudiante.');
lineas.push('   No es un castigo: es el estado que existe para esto.');
lineas.push('');
lineas.push('> **`**[DUDA]**` dentro de un texto marca lo que no doy por seguro.** Donde no');
lineas.push('> aparece, estoy afirmando. Va dentro y no en una nota aparte para que no se');
lineas.push('> pueda leer la justificación sin leer la duda: un borrador fluido es más fácil');
lineas.push('> de aprobar sin leer que una página en blanco, y ése es el riesgo de que las');
lineas.push('> redacte una máquina.');
lineas.push('');
lineas.push('---');
lineas.push('');
lineas.push(`## Las ${conDuda.length} con duda, primero`);
lineas.push('');

if (conDuda.length === 0) {
  lineas.push('Ninguna. **Eso debería darte más desconfianza que una lista larga**, no menos.');
} else {
  lineas.push('Ninguna de éstas es «la correcta está mal». Son enunciados flojos, matices de');
  lineas.push('contenido y una pregunta desactualizada. Van primero porque son las que');
  lineas.push('necesitan una decisión tuya y no sólo un visto bueno.');
  lineas.push('');
  for (const p of conDuda) {
    lineas.push(`- **${ref(p)}** · ${paraLeer(p.enunciado)}`);
  }
}

lineas.push('');
lineas.push('---');
lineas.push('');
lineas.push('## Los bloques');
lineas.push('');

encargo.preguntas.forEach((p, i) => {
  const clave = `${p.origen}#${p.numero_origen}`;
  const numero = String(i + 1).padStart(2, '0');

  lineas.push(`### ${numero} · ${ref(p)}${p.orden_fijo ? ' · ⚠️ ORDEN FIJO' : ''}`);
  lineas.push('');
  // El cuerpo se arma aparte para poder compararlo con el del documento
  // anterior antes de decidir si la aprobacion sigue en pie.
  const cuerpo = [];
  cuerpo.push('');
  cuerpo.push(paraLeer(p.enunciado));
  cuerpo.push('');

  for (const a of [...p.alternativas].sort((x, y) => x.orden - y.orden)) {
    cuerpo.push(`- \`(${a.letra})\` ${paraLeer(a.texto)}${a.es_correcta ? '  **← correcta**' : ''}`);
  }

  cuerpo.push('');

  if (p.orden_fijo) {
    cuerpo.push('> **Esta pregunta no se baraja.** Su alternativa correcta nombra a las otras');
    cuerpo.push('> por su letra, así que mover las alternativas de sitio la deja sin sentido.');
    cuerpo.push('> Es la única del proyecto entero con esta marca.');
    cuerpo.push('');
  }

  const viejo = anterior.get(clave);
  const mismaPregunta = viejo?.cuerpo === cuerpo.join('\n').trim();
  const mismaJustificacion = viejo?.texto === textos[clave].trim();
  const sigueAprobada = Boolean(viejo?.aprobada && mismaPregunta && mismaJustificacion);

  if (viejo?.aprobada && sigueAprobada) conservadas += 1;
  if (viejo?.aprobada && !sigueAprobada) {
    const porque = [!mismaPregunta && 'cambio la pregunta', !mismaJustificacion && 'cambio la justificacion']
      .filter(Boolean)
      .join(' y ');
    reabiertas.push(`${ref(p)} · ${porque}`);
  }

  lineas.push(`<!-- pregunta: ${clave} | just:${sello(textos[clave].trim())} -->`);
  lineas.push(...cuerpo);

  lineas.push('<!-- justificacion:inicio -->');
  lineas.push(textos[clave]);
  lineas.push('<!-- justificacion:fin -->');
  lineas.push('');
  lineas.push(`- [${sigueAprobada ? 'x' : ' '}] Aprobada`);
  lineas.push('');
});

lineas.push('---');
lineas.push('');
lineas.push('## Lo que este documento no puede decidir');
lineas.push('');
lineas.push('- **Si las justificaciones son ciertas.** Que existan se comprueba con un');
lineas.push('  programa; que sean correctas no. Por eso las lees tú.');
lineas.push('- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería');
lineas.push('  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.');
lineas.push('  Si la quieres, es una pasada editorial aparte.');
lineas.push('');

mkdirSync(dirname(rutaSalida), { recursive: true });
writeFileSync(rutaSalida, `${lineas.join('\n')}\n`, 'utf8');

console.log(`\n${raya}\nDOCUMENTO DE REVISION GENERADO\n${raya}`);
console.log(`Modulo:    ${modulo}`);
console.log(`Salida:    ${rutaSalida.replace(RAIZ, '.')}`);
console.log('');
console.log(`  preguntas del lote     ${String(encargo.preguntas.length).padStart(3)}`);
console.log(`  justificaciones        ${String(encargo.preguntas.length).padStart(3)}   una por pregunta, ninguna vacia`);
console.log(`  con **[DUDA]**         ${String(conDuda.length).padStart(3)}   listadas al principio del documento`);
console.log(`  aprobadas                ${String(conservadas).padStart(3)}   conservadas: ni la pregunta ni la justificacion cambiaron`);
console.log(`  SIN APROBAR              ${String(encargo.preguntas.length - conservadas).padStart(3)}   estas NO se pueden cargar como activa`);

// Se listan las que quedan sin marca, no solo las que esta corrida reabrio. Una
// que se reabrio en una corrida anterior sigue necesitando revision, y contar
// solo las de hoy la haria desaparecer del informe teniendo el trabajo pendiente.
for (const p of encargo.preguntas) {
  const v = anterior.get(`${p.origen}#${p.numero_origen}`);
  const sigue = v?.aprobada && v.texto === textos[`${p.origen}#${p.numero_origen}`].trim();
  if (!sigue) console.log(`                           ${ref(p)}`);
}

if (reabiertas.length > 0) {
  console.log('');
  console.log('  Reabiertas en esta corrida:');
  for (const r of reabiertas) console.log(`    ${r}`);
}
console.log('');
console.log('NADA de esto esta cargado ni aprobado. El documento es para leer.');
console.log('');
console.log('codigo de salida: 0\n');
