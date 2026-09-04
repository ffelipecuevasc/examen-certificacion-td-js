/**
 * Informe de hechos sobre los dos bancos de preguntas.
 *
 * Se ejecuta ANTES de disenar el esquema, a proposito: el esquema es una promesa
 * sobre los datos, y hacerla sin saber que contienen significa disenar dos veces.
 *
 * Lee dos origenes con formas distintas:
 *
 *   banco nuevo   _planmaestro/00_producto/cuestionarios/modulo-0N.json
 *                 [{ modulo, numero, enunciado, alternativas:[{letra,texto}], correcta }]
 *   banco viejo   static/js/data/cuestionario.js
 *                 [{ modulo, titulo, icono, preguntas:[{q, opciones:[], correcta, fijo}] }]
 *
 * No da recomendaciones ni interpreta: cuenta, compara y lista. Lo que encuentre se
 * discute despues, con el informe delante.
 *
 * Una advertencia sobre la ultima seccion: el solapamiento de contenido se detecta
 * por parecido de redaccion, no por significado. Sirve para acortar la lista que hay
 * que revisar a mano; no sirve para afirmar que no hay solapamiento. Su limite esta
 * explicado donde se imprime.
 *
 * Uso: npm run informe-banco
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const CARPETA_NUEVOS = '_planmaestro/00_producto/cuestionarios';
const BANCO_VIEJO = 'static/js/data/cuestionario.js';

// ---------------------------------------------------------------------------
// Auxiliares de texto
// ---------------------------------------------------------------------------

/** Minusculas, sin tildes, sin puntuacion, con espacios colapsados. */
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9<>/_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizacion suave: minusculas y espacios colapsados, nada mas.
 *
 * Se usa para detectar textos IDENTICOS. Conserva la puntuacion a proposito,
 * porque en las preguntas de sintaxis la puntuacion es el contenido: en
 * "{{ variable }}", "${ variable }" y "<%= variable %>" lo unico que cambia son
 * los simbolos, y la normalizacion agresiva las convertia a las tres en
 * "variable". Comprobado: las seis "alternativas repetidas" que aparecian con la
 * normalizacion agresiva eran preguntas de sintaxis, y ninguna estaba repetida.
 */
function normalizarSuave(texto) {
  return String(texto).toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Palabras de contenido: sin las vacias del castellano ni las de andamiaje. */
const VACIAS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'y', 'o', 'u',
  'en', 'que', 'cual', 'cuales', 'como', 'para', 'por', 'con', 'sin', 'se', 'su', 'sus', 'es',
  'son', 'ser', 'esta', 'este', 'esto', 'estos', 'estas', 'lo', 'le', 'les', 'mas', 'pero',
  'cuando', 'donde', 'quien', 'sobre', 'entre', 'desde', 'hasta', 'siguiente', 'siguientes',
  'cuál', 'qué', 'si', 'no', 'ha', 'han', 'hay', 'debe', 'puede', 'permite', 'siguiente',
]);

function palabras(texto) {
  return normalizar(texto).split(' ').filter((w) => w.length > 2 && !VACIAS.has(w));
}

function trigramas(texto) {
  const set = new Set();
  for (let i = 0; i < texto.length - 2; i++) set.add(texto.slice(i, i + 3));
  return set;
}

/** Coeficiente de Dice: 2·comunes / (total de uno + total del otro). */
function dice(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let comunes = 0;
  for (const t of a) if (b.has(t)) comunes++;
  return (2 * comunes) / (a.size + b.size);
}

/** Jaccard: comunes / union. */
function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let comunes = 0;
  for (const t of a) if (b.has(t)) comunes++;
  return comunes / (a.size + b.size - comunes);
}



const problemas = [];
const anota = (donde, texto) => problemas.push(`${donde}: ${texto}`);

const titulo = (t) => console.log(`\n${'='.repeat(74)}\n${t}\n${'='.repeat(74)}`);
const sub = (t) => console.log(`\n--- ${t} ---`);

// ---------------------------------------------------------------------------
// Lectura del banco nuevo
// ---------------------------------------------------------------------------

titulo('1 · LECTURA DE LOS ARCHIVOS');

const nuevas = [];
const archivos = existsSync(CARPETA_NUEVOS)
  ? readdirSync(CARPETA_NUEVOS).filter((n) => n.endsWith('.json')).sort()
  : [];

if (archivos.length === 0) anota('carpeta', `${CARPETA_NUEVOS} no tiene archivos .json`);

for (const archivo of archivos) {
  const ruta = join(CARPETA_NUEVOS, archivo);
  let crudo;

  try {
    crudo = readFileSync(ruta, 'utf8');
  } catch (error) {
    console.log(`  ${archivo.padEnd(18)} NO SE PUDO ABRIR: ${error.message}`);
    anota(archivo, 'no se pudo abrir');
    continue;
  }

  try {
    const datos = JSON.parse(crudo);
    if (!Array.isArray(datos)) {
      console.log(`  ${archivo.padEnd(18)} JSON valido, pero la raiz no es una lista`);
      anota(archivo, 'la raiz del archivo no es una lista');
      continue;
    }
    console.log(`  ${archivo.padEnd(18)} JSON valido    ${String(datos.length).padStart(3)} preguntas`);
    datos.forEach((p, i) => nuevas.push({ ...p, _archivo: archivo, _posicion: i + 1 }));
  } catch (error) {
    console.log(`  ${archivo.padEnd(18)} JSON INVALIDO: ${error.message}`);
    anota(archivo, `JSON invalido (${error.message})`);
  }
}

// ---------------------------------------------------------------------------
// Lectura del banco viejo
// ---------------------------------------------------------------------------

const viejas = [];
let gruposViejos = [];

try {
  const modulo = await import(pathToFileURL(BANCO_VIEJO).href);
  gruposViejos = modulo.cuestionario ?? [];
  const total = gruposViejos.reduce((n, g) => n + (g.preguntas?.length ?? 0), 0);
  console.log(`  ${BANCO_VIEJO.padEnd(30)} se importa    ${String(total).padStart(3)} preguntas`);

  for (const grupo of gruposViejos) {
    (grupo.preguntas ?? []).forEach((p, i) => {
      viejas.push({ ...p, _modulo: grupo.modulo, _posicion: i + 1 });
    });
  }
} catch (error) {
  console.log(`  ${BANCO_VIEJO} NO SE PUDO IMPORTAR: ${error.message}`);
  anota(BANCO_VIEJO, 'no se pudo importar');
}

// ---------------------------------------------------------------------------
// Recuento
// ---------------------------------------------------------------------------

titulo('2 · CUANTAS PREGUNTAS HAY');

const porModuloNuevo = new Map();
for (const p of nuevas) {
  const m = p.modulo ?? '(sin modulo)';
  porModuloNuevo.set(m, (porModuloNuevo.get(m) ?? 0) + 1);
}

sub('banco nuevo, por modulo');
for (const [m, n] of [...porModuloNuevo].sort()) console.log(`  modulo ${m}: ${n}`);
console.log(`  TOTAL: ${nuevas.length}`);

sub('banco viejo, por modulo');
for (const grupo of gruposViejos) {
  console.log(`  ${grupo.modulo}: ${grupo.preguntas?.length ?? 0}`);
}
console.log(`  TOTAL: ${viejas.length}`);
console.log(`\n  SUMA DE LOS DOS BANCOS: ${nuevas.length + viejas.length}`);

// ---------------------------------------------------------------------------
// Numeracion
// ---------------------------------------------------------------------------

titulo('3 · NUMERACION DEL BANCO NUEVO');

for (const [m] of [...porModuloNuevo].sort()) {
  const delModulo = nuevas.filter((p) => p.modulo === m);
  const numeros = delModulo.map((p) => p.numero);
  const repetidos = numeros.filter((n, i) => numeros.indexOf(n) !== i);
  const validos = numeros.filter((n) => Number.isInteger(n));
  const huecos = [];

  if (validos.length) {
    for (let n = Math.min(...validos); n <= Math.max(...validos); n++) {
      if (!validos.includes(n)) huecos.push(n);
    }
  }

  const partes = [];
  if (validos.length !== numeros.length) partes.push('hay numeros no enteros');
  if (repetidos.length) partes.push(`repetidos: ${[...new Set(repetidos)].join(', ')}`);
  if (huecos.length) partes.push(`huecos: ${huecos.join(', ')}`);

  const rango = validos.length ? `${Math.min(...validos)}-${Math.max(...validos)}` : 'sin numeros';
  console.log(`  modulo ${m}: ${rango} · ${partes.length ? partes.join(' · ') : 'correlativa, sin huecos ni repetidos'}`);
  for (const parte of partes) anota(`modulo ${m}`, parte);
}

// ---------------------------------------------------------------------------
// Forma de cada objeto
// ---------------------------------------------------------------------------

titulo('4 · CAMPOS Y TIPOS · BANCO NUEVO');

const ESPERADOS = ['modulo', 'numero', 'enunciado', 'alternativas', 'correcta'];
const sobrantes = new Map();
let faltantes = 0;
let tiposMalos = 0;

for (const p of nuevas) {
  const donde = `${p._archivo} #${p.numero ?? p._posicion}`;
  const claves = Object.keys(p).filter((k) => !k.startsWith('_'));

  for (const esperado of ESPERADOS) {
    if (!claves.includes(esperado)) {
      anota(donde, `le falta el campo "${esperado}"`);
      faltantes++;
    }
  }
  for (const clave of claves) {
    if (!ESPERADOS.includes(clave)) sobrantes.set(clave, (sobrantes.get(clave) ?? 0) + 1);
  }

  if (p.modulo !== undefined && !Number.isInteger(p.modulo)) {
    anota(donde, `"modulo" no es entero (${typeof p.modulo})`);
    tiposMalos++;
  }
  if (p.numero !== undefined && !Number.isInteger(p.numero)) {
    anota(donde, `"numero" no es entero (${typeof p.numero})`);
    tiposMalos++;
  }
  if (typeof p.enunciado !== 'string' || p.enunciado.trim() === '') {
    anota(donde, '"enunciado" no es texto, o esta vacio');
    tiposMalos++;
  }
  if (typeof p.correcta !== 'string') {
    anota(donde, '"correcta" no es texto');
    tiposMalos++;
  }
  if (!Array.isArray(p.alternativas)) {
    anota(donde, '"alternativas" no es una lista');
    tiposMalos++;
  } else {
    for (const a of p.alternativas) {
      if (typeof a?.letra !== 'string' || typeof a?.texto !== 'string') {
        anota(donde, 'una alternativa no tiene letra y texto de tipo texto');
        tiposMalos++;
      }
    }
  }
}

console.log(`  campos obligatorios ausentes: ${faltantes}`);
console.log(`  valores con tipo inesperado : ${tiposMalos}`);
console.log(`  campos de mas               : ${sobrantes.size === 0 ? 'ninguno' : [...sobrantes].map(([k, n]) => `${k} (${n})`).join(', ')}`);
console.log(`  campos esperados            : ${ESPERADOS.join(', ')}`);

sub('campos del banco viejo, para comparar');
const clavesViejas = new Set();
for (const p of viejas) Object.keys(p).forEach((k) => !k.startsWith('_') && clavesViejas.add(k));
console.log(`  ${[...clavesViejas].join(', ')}`);
console.log(`  preguntas con fijo=true: ${viejas.filter((p) => p.fijo === true).length}`);
for (const p of viejas.filter((x) => x.fijo === true)) {
  console.log(`    - ${p._modulo}, posicion ${p._posicion}: ${p.q.slice(0, 70)}...`);
}

// ---------------------------------------------------------------------------
// Alternativas y respuesta correcta
// ---------------------------------------------------------------------------

titulo('5 · ALTERNATIVAS Y RESPUESTA CORRECTA');

let sinCuatro = 0;
let correctaFuera = 0;
let altRepetidas = 0;

for (const p of nuevas) {
  const donde = `${p._archivo} #${p.numero ?? p._posicion}`;
  const alts = Array.isArray(p.alternativas) ? p.alternativas : [];

  if (alts.length !== 4) {
    anota(donde, `tiene ${alts.length} alternativas, no 4`);
    sinCuatro++;
  }

  const letras = alts.map((a) => a?.letra);
  if (!letras.includes(p.correcta)) {
    anota(donde, `"correcta" vale "${p.correcta}" y no existe entre las letras [${letras.join(', ')}]`);
    correctaFuera++;
  }

  const letrasRepetidas = letras.filter((l, i) => letras.indexOf(l) !== i);
  if (letrasRepetidas.length) {
    anota(donde, `letras repetidas: ${[...new Set(letrasRepetidas)].join(', ')}`);
  }

  const textos = alts.map((a) => normalizarSuave(a?.texto ?? ''));
  const repes = [...new Set(textos.filter((t, i) => textos.indexOf(t) !== i))];
  if (repes.length) {
    anota(donde, `alternativas repetidas entre si: "${repes[0].slice(0, 70)}"`);
    altRepetidas++;
  }
}

console.log(`  banco nuevo · preguntas sin exactamente 4 alternativas : ${sinCuatro}`);
console.log(`  banco nuevo · correctas que apuntan a letra inexistente: ${correctaFuera}`);
console.log(`  banco nuevo · preguntas con alternativas repetidas     : ${altRepetidas}`);

let sinCuatroV = 0;
let correctaFueraV = 0;
let altRepetidasV = 0;

for (const p of viejas) {
  const donde = `${p._modulo} pos ${p._posicion}`;
  const ops = Array.isArray(p.opciones) ? p.opciones : [];
  if (ops.length !== 4) {
    anota(donde, `tiene ${ops.length} alternativas, no 4`);
    sinCuatroV++;
  }
  if (!Number.isInteger(p.correcta) || p.correcta < 0 || p.correcta >= ops.length) {
    anota(donde, `"correcta" vale ${p.correcta} y esta fuera de rango`);
    correctaFueraV++;
  }
  const textos = ops.map((o) => normalizarSuave(o));
  const repesV = [...new Set(textos.filter((t, i) => textos.indexOf(t) !== i))];
  if (repesV.length) {
    anota(donde, `alternativas repetidas entre si: "${repesV[0].slice(0, 70)}"`);
    altRepetidasV++;
  }
}

console.log(`  banco viejo · preguntas sin exactamente 4 alternativas : ${sinCuatroV}`);
console.log(`  banco viejo · correctas fuera de rango                 : ${correctaFueraV}`);
console.log(`  banco viejo · preguntas con alternativas repetidas     : ${altRepetidasV}`);

titulo('5b · ALTERNATIVAS QUE SE REFIEREN A OTRAS (ADR-006)');

console.log(`
  ADR-006: las alternativas se barajan, salvo cuando una se refiere a otra por su
  letra. Esas llevan la marca "fijo" y conservan su orden. Barajar una de ellas la
  vuelve incoherente, asi que detectarlas no es cosmetico.

  Se busca por patron: menciones a otras letras ("ambas b y c"), y las formulas
  "todas las anteriores" y "ninguna de las anteriores".
`);

const PATRONES = [
  /(?:ambas|solo|s[oó]lo) [a-d](?:[ ,.;)]|$)/i,
  /[a-d] y [a-d] (?:son|es)/i,
  /(?:la|las|opci[oó]n|opciones|alternativa|alternativas) [a-d] y [a-d]/i,
  /todas las anteriores/i,
  /ninguna de las anteriores/i,
  /todas son correctas/i,
];

const sospechosas = [];

for (const p of nuevas) {
  for (const a of p.alternativas ?? []) {
    if (PATRONES.some((re) => re.test(a?.texto ?? ''))) {
      sospechosas.push([`nuevo ${p._archivo} #${p.numero}`, a.texto]);
    }
  }
}
for (const p of viejas) {
  for (const o of p.opciones ?? []) {
    if (PATRONES.some((re) => re.test(o))) {
      sospechosas.push([`viejo ${p._modulo} pos ${p._posicion}${p.fijo ? ' [marcada fijo]' : ' [SIN MARCAR]'}`, o]);
    }
  }
}

if (sospechosas.length === 0) {
  console.log('  ninguna alternativa se refiere a otra, en ninguno de los dos bancos.');
} else {
  for (const [donde, texto] of sospechosas) {
    console.log(`  ${donde}`);
    console.log(`     "${texto}"`);
    if (donde.includes('SIN MARCAR') || donde.startsWith('nuevo')) {
      anota(donde, 'una alternativa se refiere a otras y la pregunta no esta marcada como de orden fijo');
    }
  }
}

// ---------------------------------------------------------------------------
// Enunciados repetidos
// ---------------------------------------------------------------------------

titulo('6 · ENUNCIADOS REPETIDOS (texto identico tras normalizar)');

const vistos = new Map();
for (const p of nuevas) {
  const clave = normalizarSuave(p.enunciado ?? '');
  if (!vistos.has(clave)) vistos.set(clave, []);
  vistos.get(clave).push(`${p._archivo} #${p.numero ?? p._posicion}`);
}
for (const p of viejas) {
  const clave = normalizarSuave(p.q ?? '');
  if (!vistos.has(clave)) vistos.set(clave, []);
  vistos.get(clave).push(`viejo ${p._modulo} pos ${p._posicion}`);
}

const duplicados = [...vistos.entries()].filter(([, d]) => d.length > 1);
if (duplicados.length === 0) {
  console.log('  ninguno, ni dentro de un modulo ni entre modulos ni entre bancos');
} else {
  for (const [clave, donde] of duplicados) {
    console.log(`  ${donde.join('  ==  ')}`);
    console.log(`     "${clave.slice(0, 90)}..."`);
    anota('enunciado repetido', donde.join(' == '));
  }
}

// ---------------------------------------------------------------------------
// Distribucion de la letra correcta
// ---------------------------------------------------------------------------

titulo('7 · DISTRIBUCION DE LA RESPUESTA CORRECTA');

sub('banco nuevo, por modulo');
const LETRAS = ['a', 'b', 'c', 'd'];
const totalNuevo = Object.fromEntries(LETRAS.map((l) => [l, 0]));

for (const [m] of [...porModuloNuevo].sort()) {
  const delModulo = nuevas.filter((p) => p.modulo === m);
  const cuenta = Object.fromEntries(LETRAS.map((l) => [l, 0]));
  for (const p of delModulo) {
    if (cuenta[p.correcta] !== undefined) cuenta[p.correcta]++;
    if (totalNuevo[p.correcta] !== undefined) totalNuevo[p.correcta]++;
  }
  console.log(`  modulo ${m}: ${LETRAS.map((l) => `${l}=${String(cuenta[l]).padStart(2)}`).join('  ')}   (${delModulo.length})`);
}
console.log(`  TOTAL   : ${LETRAS.map((l) => `${l}=${String(totalNuevo[l]).padStart(2)}`).join('  ')}   (${nuevas.length})`);
console.log(`  reparto ideal si estuviera equilibrado: ${(nuevas.length / 4).toFixed(1)} por letra`);

sub('banco viejo, por modulo (posicion 0-3, equivale a las letras a-d)');
const totalViejo = [0, 0, 0, 0];
for (const grupo of gruposViejos) {
  const cuenta = [0, 0, 0, 0];
  for (const p of grupo.preguntas ?? []) {
    if (cuenta[p.correcta] !== undefined) cuenta[p.correcta]++;
    if (totalViejo[p.correcta] !== undefined) totalViejo[p.correcta]++;
  }
  console.log(`  ${grupo.modulo}: ${cuenta.map((n, i) => `${LETRAS[i]}=${String(n).padStart(2)}`).join('  ')}   (${grupo.preguntas?.length ?? 0})`);
}
console.log(`  TOTAL    : ${totalViejo.map((n, i) => `${LETRAS[i]}=${String(n).padStart(2)}`).join('  ')}   (${viejas.length})`);

// ---------------------------------------------------------------------------
// Justificaciones
// ---------------------------------------------------------------------------

titulo('8 · JUSTIFICACIONES');

const conJust = nuevas.filter((p) => typeof p.justificacion === 'string' && p.justificacion.trim());
const conJustV = viejas.filter((p) => typeof p.justificacion === 'string' && p.justificacion.trim());
console.log(`  banco nuevo: ${conJust.length} de ${nuevas.length} tienen justificacion`);
console.log(`  banco viejo: ${conJustV.length} de ${viejas.length} tienen justificacion`);
console.log(`  FALTAN     : ${nuevas.length + viejas.length - conJust.length - conJustV.length}`);

// ---------------------------------------------------------------------------
// Solapamiento de contenido entre bancos
// ---------------------------------------------------------------------------

titulo('9 · CANDIDATOS A SOLAPAMIENTO ENTRE LOS DOS BANCOS');

console.log(`
  COMO SE DETECTA, Y HASTA DONDE LLEGA
  Esto compara REDACCION, no significado. Para cada par de preguntas de bancos
  distintos se calculan tres senales sobre el enunciado normalizado:

    - parecido de trigramas: cuanto se parecen las cadenas, letra a letra
    - palabras en comun    : proporcion de palabras de contenido compartidas
    - terminos tecnicos    : terminos poco frecuentes en el banco compartidos
                             por ambas (git, box-sizing, <fieldset>, useState...)

  Los pares que se listan abajo superaron algun umbral. Es una lista PARA REVISAR
  A MANO, no un veredicto:

    - Puede sobrar: dos preguntas sin relacion que comparten jerga aparecen altas.
    - Puede faltar: dos preguntas sobre lo mismo escritas con palabras distintas
      —"cual es la diferencia entre fetch y pull" contra "que hace git pull"—
      pueden no aparecer aqui.

  O sea: sirve para acortar la revision, NO para afirmar que no hay solapamiento.
  Esa afirmacion solo la puede hacer una persona leyendo.
`);

const frecuencia = new Map();
const todosLosTextos = [
  ...nuevas.map((p) => p.enunciado ?? ''),
  ...viejas.map((p) => p.q ?? ''),
];
for (const texto of todosLosTextos) {
  for (const palabra of new Set(palabras(texto))) {
    frecuencia.set(palabra, (frecuencia.get(palabra) ?? 0) + 1);
  }
}

const preparadas = (lista, obtenerTexto, etiqueta) =>
  lista.map((p) => {
    const texto = obtenerTexto(p);
    const pals = new Set(palabras(texto));
    return {
      etiqueta: etiqueta(p),
      texto,
      pals,
      tri: trigramas(normalizar(texto)),
      tecnicos: new Set([...pals].filter((w) => (frecuencia.get(w) ?? 0) <= 3 && w.length >= 4)),
    };
  });

const A = preparadas(nuevas, (p) => p.enunciado ?? '', (p) => `nuevo ${p._archivo} #${p.numero ?? p._posicion}`);
const B = preparadas(viejas, (p) => p.q ?? '', (p) => `viejo ${p._modulo} pos ${p._posicion}`);

const pares = [];
for (const a of A) {
  for (const b of B) {
    const tri = dice(a.tri, b.tri);
    const pal = jaccard(a.pals, b.pals);
    const tec = [...a.tecnicos].filter((t) => b.tecnicos.has(t));
    if (tri >= 0.45 || pal >= 0.4 || tec.length >= 2) {
      pares.push({ a, b, tri, pal, tec });
    }
  }
}

pares.sort((x, y) => y.tri + y.pal - (x.tri + x.pal));

console.log(`  pares comparados: ${A.length} x ${B.length} = ${A.length * B.length}`);
console.log(`  pares que superan algun umbral: ${pares.length}\n`);

const TODOS = process.argv.includes('--todos');
const aListar = TODOS ? pares : pares.slice(0, 25);

for (const { a, b, tri, pal, tec } of aListar) {
  console.log(`  [trigramas ${tri.toFixed(2)} · palabras ${pal.toFixed(2)}${tec.length ? ` · comparten: ${tec.slice(0, 4).join(', ')}` : ''}]`);
  console.log(`    ${a.etiqueta}`);
  console.log(`      ${a.texto.slice(0, 100)}`);
  console.log(`    ${b.etiqueta}`);
  console.log(`      ${b.texto.slice(0, 100)}\n`);
}
if (!TODOS && pares.length > 25) {
  console.log(`  ...y ${pares.length - 25} pares mas. Para verlos todos:`);
  console.log('    npm run informe-banco -- --todos');
}

// ---------------------------------------------------------------------------
// Resumen
// ---------------------------------------------------------------------------

titulo('10 · RESUMEN DE PROBLEMAS');

if (problemas.length === 0) {
  console.log('  ninguno de los comprobados automaticamente.');
} else {
  for (const p of problemas) console.log(`  - ${p}`);
}
console.log(`\n  total de problemas: ${problemas.length}`);
console.log(`  (la seccion 9 no cuenta como problema: son candidatos a revisar)\n`);
