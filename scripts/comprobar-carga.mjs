/**
 * Comprueba que lo que quedo EN D1 corresponde a los bancos de origen (iteracion 25).
 *
 *   node scripts/comprobar-carga.mjs 2 --base=examen-td-js-produccion
 *   node scripts/comprobar-carga.mjs 2 --base=... --registro=evidencia-m02.txt
 *
 * QUE LO SEPARA DE `comprobar-conversion.mjs`, QUE NO ES POCO
 *
 * Aquel contrasta el ENCARGO contra los archivos de origen: comprueba que el
 * convertidor no perdio ni altero nada. Este contrasta LA BASE contra los mismos
 * archivos: comprueba que lo cargado es lo que se quiso cargar.
 *
 * No son el mismo trabajo y uno no implica al otro. Entre el encargo y la base
 * hay una herramienta, un wrangler, dos caminos de escritura distintos y una red.
 * La iteracion 25 pide expresamente que los criterios se cierren «contra la base
 * y no contra el encargo», y H-016 dice por que: que la herramienta diga que
 * aplico algo no es que la base lo tenga. H-024 lo confirmo de la peor manera —
 * la herramienta dijo `SIN VEREDICTO` sobre una carga que habia entrado entera.
 *
 * EL ENCARGO NO SE LEE. NI UNA VEZ.
 *
 * A proposito, y es la decision que sostiene el archivo. Si este guion leyera el
 * encargo, comprobaria que la base coincide con el archivo intermedio, que es
 * justo el eslabon que ya tiene su propio comprobador. Los dos extremos que
 * importan son los ARCHIVOS DE ORIGEN y LA BASE, y en medio no se mira nada.
 *
 * Consecuencia buscada: si el encargo estuviera mal Y la carga fuera fiel al
 * encargo, este guion dice «no» igual. Ese es el punto.
 *
 * EL ANCLA ES EL TEXTO DE LA CORRECTA, NO SU LETRA NI SU INDICE
 *
 * Heredado de `comprobar-conversion.mjs`, por el mismo motivo: la letra y el
 * indice los escribe la regla de conversion, asi que no pueden juzgarla. El texto
 * de la alternativa correcta es lo unico que la regla no puede falsear.
 *
 *   banco nuevo  la alternativa cuya `letra` es `correcta`  -> su texto
 *   banco viejo  `opciones[correcta]`                       -> ese texto
 *   D1           la alternativa con `es_correcta = 1`       -> su texto
 *
 * LA HUELLA, SIN NORMALIZAR NADA
 *
 * Cada pregunta se reduce a enunciado + los cuatro textos EN SU ORDEN + el texto
 * de la correcta, calculado dos veces de datos distintos. Sin recortar espacios,
 * sin unificar comillas, sin bajar a minusculas: cada normalizacion es un sitio
 * donde se esconde un cambio silencioso.
 *
 * QUE CAZA
 *
 *   faltantes            una del origen que no llego a la base
 *   sobrantes            una en la base que no esta en el origen
 *   texto alterado       un caracter distinto en enunciado o alternativa
 *   alternativas movidas los cuatro textos, en su orden
 *   correcta desplazada  el ancla
 *   retiradas cargadas   contra retiradas.json
 *   justificacion falsa  activa sin justificacion, o con texto de relleno
 *   campos inventados    dificultad con algo dentro
 *   orden_fijo perdido   contra el `fijo` del banco viejo
 *   alternativas rotas   distintas de cuatro, o sin una correcta exacta
 *
 * Y ADEMAS INFORMA, sin juzgar: el reparto de la posicion de la correcta (H-004),
 * que la iteracion 25 pide informar y no corregir.
 *
 * ESTE COMPROBADOR SE PRUEBA ROMPIENDOLO (H-023)
 *
 * `--sabotaje=<cual>` estropea SOLO la copia en memoria de lo leido de la base y
 * exige que el veredicto salga negativo. Una comprobacion que nunca ha dicho «no»
 * no es una comprobacion, es una afirmacion con su forma.
 *
 *   --sabotaje=desplazar      mueve la correcta una posicion
 *   --sabotaje=faltante       borra una pregunta de la base leida
 *   --sabotaje=sobrante       inventa una pregunta que el origen no tiene
 *   --sabotaje=caracter       cambia UN caracter de un enunciado
 *   --sabotaje=permutar       intercambia dos alternativas que NO son la correcta
 *   --sabotaje=retirada       carga una retirada, como si se hubiera colado
 *   --sabotaje=justificacion  deja una activa sin justificacion
 *   --sabotaje=relleno        pone «Pendiente de redaccion» de justificacion
 *   --sabotaje=inventado      le pone dificultad a una pregunta
 *   --sabotaje=ordenfijo      apaga el orden_fijo de la pregunta que lo tiene
 *
 * NO ESCRIBE NADA EN LA BASE. Solo lee.
 *
 * Codigos de salida:
 *   0  CARGA COMPROBADA
 *   1  NO CORRESPONDE     la base y el origen difieren. Hay algo que arreglar
 *   2  SIN VEREDICTO      no se pudo comprobar. NO es un aprobado (H-013)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { avisoDeRetiro } from './procedencia.mjs';
import { abrirRegistro } from './registro-de-salida.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CUESTIONARIOS = join(RAIZ, '_planmaestro', '00_producto', 'cuestionarios');
const BANCO_VIEJO = join(RAIZ, 'static', 'js', 'data', 'cuestionario.js');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const CONFIGURACION = join(RAIZ, 'wrangler.toml');

/** Separador de la huella: un caracter que no aparece en el banco. */
const SEP = '\u001f';

const COMPROBADA = 0;
const NO_CORRESPONDE = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);

const argumentos = process.argv.slice(2);

/** Se abre antes que nada: un fallo temprano tambien es evidencia. */
let cerrarRegistro = () => {};

function veredicto(titulo, lineas, codigo) {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  cerrarRegistro(titulo, codigo);
  process.exit(codigo);
}

const sinVeredicto = (motivo, detalle = []) =>
  veredicto(
    'SIN VEREDICTO  ***  ESTO NO ES UN APROBADO  ***',
    [
      motivo,
      ...(detalle.length ? ['', ...detalle] : []),
      '',
      'No se pudo comprobar, que no es lo mismo que que este bien (H-013).',
      'No cierres ningun criterio con esta salida.',
    ],
    SIN_VEREDICTO
  );

cerrarRegistro = abrirRegistro(argumentos, (mensaje, ruta) =>
  veredicto(
    'SIN VEREDICTO  ***  NO PUDE ABRIR EL REGISTRO  ***',
    [mensaje, '', `Ruta: ${ruta}`, '', 'Pediste registro para tener evidencia. Sin el no corro.'],
    SIN_VEREDICTO
  )
);

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const valorDe = (nombre) => {
  const encontrado = argumentos.find((a) => a.startsWith(`--${nombre}=`));
  return encontrado ? encontrado.slice(nombre.length + 3) : null;
};

const modulo = Number(argumentos.find((a) => /^\d+$/.test(a)));
const base = valorDe('base');

const USO = [
  'Uso:',
  '',
  '  node scripts/comprobar-carga.mjs <modulo> --base=<nombre> [--registro=<archivo>]',
  '',
  'El modulo va entre 2 y 8.',
];

if (!Number.isInteger(modulo) || modulo < 2 || modulo > 8) {
  sinVeredicto('Falta el numero de modulo, o no esta entre 2 y 8.', USO);
}

/**
 * --base es obligatorio y NO tiene valor por omision.
 *
 * Mismo motivo que en `volcar-contenido.mjs`, y aca pesa mas todavia: la salida
 * de este guion es EVIDENCIA que se pega en el archivo de la iteracion. Una
 * evidencia que no dice contra que base se produjo no prueba nada, y un valor por
 * omision convertiria un olvido en una consulta a la base publicada.
 */
if (!base) {
  sinVeredicto('Falta --base, y no tiene valor por omision a proposito.', [
    ...USO,
    '',
    'La salida de este guion se usa como evidencia. Una evidencia que no nombra',
    'la base contra la que se produjo no prueba nada.',
  ]);
}

/** El flag que apunta a la nube, escrito entero y a la vista (H-014). */
const FLAG_REMOTO = '--remote';
const remoto = argumentos.includes(FLAG_REMOTO);
const destino = remoto ? FLAG_REMOTO : '--local';

const SABOTAJES = [
  'desplazar',
  'faltante',
  'sobrante',
  'caracter',
  'permutar',
  'retirada',
  'justificacion',
  'relleno',
  'inventado',
  'ordenfijo',
];

const sabotaje = valorDe('sabotaje');

if (sabotaje && !SABOTAJES.includes(sabotaje)) {
  sinVeredicto(`No conozco el sabotaje «${sabotaje}».`, ['', `Los que hay: ${SABOTAJES.join(', ')}`]);
}

if (sabotaje && remoto) {
  sinVeredicto('Un sabotaje contra la nube no tiene sentido.', [
    'El sabotaje estropea la copia en memoria para ver si el comprobador lo caza.',
    'Eso se ensaya contra la base local, que es donde se puede repetir sin costo.',
  ]);
}

// ---------------------------------------------------------------------------
// Los origenes, leidos por cuenta propia
// ---------------------------------------------------------------------------

const rutaNuevo = join(CUESTIONARIOS, `modulo-0${modulo}.json`);

if (!existsSync(rutaNuevo)) sinVeredicto(`No existe «${rutaNuevo.replace(RAIZ, '.')}».`);
if (!existsSync(BANCO_VIEJO)) {
  sinVeredicto('No se puede comprobar la carga: el banco viejo ya no existe.', [
    '',
    ...avisoDeRetiro('Comprobar una carga contra sus origenes'),
    '',
    'Que esta comprobacion ya no se pueda repetir es el precio del retiro, y se',
    'pago a sabiendas: la evidencia de que la carga correspondia a sus origenes',
    'esta escrita ocho veces en el archivo de la iteracion 25 y en los registros',
    'evidencia-*.txt, todas producidas con el archivo todavia en el arbol.',
  ]);
}

let bancoNuevo;
let retiradas;

try {
  bancoNuevo = JSON.parse(readFileSync(rutaNuevo, 'utf8'));
} catch (error) {
  sinVeredicto(`«modulo-0${modulo}.json» no es JSON valido.`, ['', error.message]);
}

try {
  retiradas = JSON.parse(readFileSync(join(CUESTIONARIOS, 'retiradas.json'), 'utf8'));
} catch (error) {
  sinVeredicto('No se pudo leer retiradas.json.', ['', error.message]);
}

const { cuestionario } = await import(`file://${BANCO_VIEJO}`);
const grupoViejo = cuestionario.find((g) => Number(g.modulo.replace(/\D/g, '')) === modulo);

if (!grupoViejo) sinVeredicto(`El banco viejo no tiene grupo para el modulo ${modulo}.`);

/**
 * Reduce una pregunta a lo que no puede cambiar sin que sea otra pregunta.
 * Sin normalizar NADA.
 */
const huella = (enunciado, textosEnOrden, textoDeLaCorrecta) =>
  [enunciado, ...textosEnOrden, `CORRECTA:${textoDeLaCorrecta}`].join(SEP);

const esperadas = new Map();

for (const p of bancoNuevo) {
  const correcta = p.alternativas.find((a) => a.letra === p.correcta);

  if (!correcta) {
    sinVeredicto(
      `En modulo-0${modulo}.json, la pregunta numero ${p.numero} dice que la correcta es ` +
        `«${p.correcta}» y no hay alternativa con esa letra.`
    );
  }

  esperadas.set(`json_2026#${p.numero}`, {
    ref: `m0${modulo}#${p.numero}`,
    enunciado: p.enunciado,
    textos: p.alternativas.map((a) => a.texto),
    textoCorrecta: correcta.texto,
    huella: huella(p.enunciado, p.alternativas.map((a) => a.texto), correcta.texto),
    orden_fijo: false,
  });
}

grupoViejo.preguntas.forEach((p, i) => {
  esperadas.set(`js_2026#${i + 1}`, {
    ref: `M${modulo}-${i + 1}`,
    enunciado: p.q,
    textos: p.opciones,
    textoCorrecta: p.opciones[p.correcta],
    huella: huella(p.q, p.opciones, p.opciones[p.correcta]),
    orden_fijo: p.fijo === true,
  });
});

// ---------------------------------------------------------------------------
// Barrera de ADR-015 y cotejo de la base
// ---------------------------------------------------------------------------

let configuracion;

try {
  configuracion = readFileSync(CONFIGURACION, 'utf8');
} catch (error) {
  sinVeredicto(`No pude leer ${CONFIGURACION}: ${error.message}`);
}

const declaradas = [...configuracion.matchAll(/^\s*database_name\s*=\s*"([^"]+)"/gm)].map((m) => m[1]);

if (process.env.PERMITIR_BASE_NO_DECLARADA !== '1' && !declaradas.includes(base)) {
  veredicto(
    'SIN VEREDICTO  ***  BASE NO DECLARADA  ***  H-015  ***',
    [
      `Pediste leer la base «${base}», que no esta declarada en wrangler.toml.`,
      '',
      `Declaradas: ${declaradas.join(', ') || '(ninguna)'}`,
      '',
      'Si sabes lo que haces: PERMITIR_BASE_NO_DECLARADA=1',
    ],
    SIN_VEREDICTO
  );
}

const uuidDeclarado = (() => {
  const bloques = configuracion.split(/^\s*\[\[/m);
  for (const bloque of bloques) {
    if (!new RegExp(`database_name\\s*=\\s*"${base}"`).test(bloque)) continue;
    return bloque.match(/^\s*database_id\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  }
  return null;
})();

if (!uuidDeclarado) sinVeredicto(`wrangler.toml declara «${base}» pero no le veo un database_id.`);

if (remoto && process.env.PERMITIR_REMOTO !== '1') {
  veredicto(
    'SIN VEREDICTO  ***  ME NIEGO A CORRER ESTO  ***  ADR-015  ***',
    [
      `Pediste ${FLAG_REMOTO}, que habla con la cuenta de Cloudflare.`,
      '',
      'Claude Code no ejecuta wrangler contra la cuenta: los comandos remotos los',
      'escribe, y los ejecuta el autor en su terminal. Ver ADR-015 y H-014.',
      '',
      'Si eres el autor y esto es tu terminal, define PERMITIR_REMOTO=1 antes de',
      'lanzarlo:',
      '',
      '  PowerShell:  $env:PERMITIR_REMOTO=1',
      '',
      'Leer no es escribir, pero la barrera es la misma: quien decide contra que',
      'cuenta se habla es el autor, no el agente.',
    ],
    SIN_VEREDICTO
  );
}

if (!existsSync(WRANGLER)) sinVeredicto('No encontre wrangler en node_modules. Corre `npm install`.');

const sinColores = (texto) => texto.replace(/\[[0-9;]*m/g, '');

function wrangler(parametros) {
  const resultado = spawnSync(
    process.execPath,
    [WRANGLER, 'd1', 'execute', base, destino, ...parametros],
    { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }
  );

  if (resultado.error) sinVeredicto(`No pude lanzar wrangler: ${resultado.error.message}`);

  return {
    normal: sinColores(resultado.stdout ?? ''),
    errores: sinColores(resultado.stderr ?? ''),
  };
}

const crudo = ({ normal, errores }) => {
  const partes = [];
  if (normal.trim()) partes.push('Salida normal:', ...normal.trim().split('\n').map((l) => `  ${l}`));
  if (errores.trim()) partes.push('Salida de error:', ...errores.trim().split('\n').map((l) => `  ${l}`));
  return partes.length ? partes : ['(wrangler no dijo nada por ninguna de las dos salidas)'];
};

/**
 * Cotejo del uuid ANTES de leer, y es condicion, no aviso.
 *
 * Va sin --json a proposito: con --json wrangler baja su nivel de registro y la
 * linea que nombra el uuid desaparece. Contra la nube wrangler no usa
 * wrangler.toml como limite, busca el nombre en la cuenta (H-015).
 */
const cotejo = wrangler(['--command=SELECT 1 AS cotejo;']);
const uuidVisto =
  `${cotejo.normal}${cotejo.errores}`.match(/database\s+\S+\s+\(([0-9a-fA-F-]{36})\)/)?.[1] ?? null;

if (!uuidVisto) {
  sinVeredicto('Wrangler no dijo contra que uuid iba a hablar, asi que no pude cotejarlo.', [
    `Esperaba ver «${uuidDeclarado}», el que wrangler.toml le da a «${base}».`,
    '',
    ...crudo(cotejo),
  ]);
}

if (uuidVisto.toLowerCase() !== uuidDeclarado.toLowerCase()) {
  veredicto(
    'SIN VEREDICTO  ***  EL UUID NO CALZA  ***  NO SE LEYO NADA  ***',
    [
      `Pediste la base «${base}».`,
      '',
      `  wrangler.toml dice:  ${uuidDeclarado}`,
      `  wrangler habla con:  ${uuidVisto}`,
      '',
      'Son bases distintas. No sigas hasta entender por que difieren.',
    ],
    SIN_VEREDICTO
  );
}

// ---------------------------------------------------------------------------
// Leer la base
// ---------------------------------------------------------------------------

const CONSULTAS = [
  'SELECT id, modulo, origen, numero_origen, enunciado, justificacion, dificultad, ' +
    `orden_fijo, estado FROM pregunta WHERE modulo = ${modulo} ORDER BY id;`,
  'SELECT a.pregunta_id, a.letra, a.orden, a.texto, a.es_correcta FROM alternativa a ' +
    `JOIN pregunta p ON p.id = a.pregunta_id WHERE p.modulo = ${modulo} ` +
    'ORDER BY a.pregunta_id, a.orden;',
];

const lectura = wrangler([`--command=${CONSULTAS.join('\n')}`, '--json']);

let respuesta;

try {
  respuesta = JSON.parse(lectura.normal.trim());
} catch (error) {
  sinVeredicto(`No pude interpretar la respuesta de wrangler: ${error.message}`, crudo(lectura));
}

if (respuesta?.error) {
  const notas = Array.isArray(respuesta.error.notes)
    ? respuesta.error.notes.map((n) => `  ${n?.text ?? JSON.stringify(n)}`)
    : [];

  sinVeredicto('Wrangler no pudo ejecutar la consulta. Lo que dijo, tal cual:', [
    `  ${respuesta.error.text ?? JSON.stringify(respuesta.error)}`,
    ...notas,
    '',
    'Si dice «no such table», esa base todavia no tiene el esquema del banco.',
    'Si dice «no such column», puede faltarle una migracion.',
  ]);
}

if (!Array.isArray(respuesta) || respuesta.length !== CONSULTAS.length) {
  sinVeredicto(
    `Esperaba ${CONSULTAS.length} bloques de resultados y llego ${
      Array.isArray(respuesta) ? `un arreglo de ${respuesta.length}` : 'otra cosa'
    }.`,
    crudo(lectura)
  );
}

/** Lo leido de la base, en una sola forma. A partir de aca no se vuelve a consultar. */
let enLaBase = (() => {
  const filas = respuesta[0]?.results ?? [];
  const alternativas = respuesta[1]?.results ?? [];
  const porPregunta = new Map();

  for (const a of alternativas) {
    if (!porPregunta.has(a.pregunta_id)) porPregunta.set(a.pregunta_id, []);
    porPregunta.get(a.pregunta_id).push({
      letra: a.letra,
      orden: Number(a.orden),
      texto: a.texto,
      es_correcta: Number(a.es_correcta) === 1,
    });
  }

  return filas.map((p) => ({
    id: p.id,
    origen: p.origen,
    numero_origen: Number(p.numero_origen),
    enunciado: p.enunciado,
    justificacion: p.justificacion,
    dificultad: p.dificultad,
    orden_fijo: Number(p.orden_fijo) === 1,
    estado: p.estado,
    alternativas: (porPregunta.get(p.id) ?? []).sort((x, y) => x.orden - y.orden),
  }));
})();

if (enLaBase.length === 0) {
  veredicto(
    'NO CORRESPONDE  ***  LA BASE NO TIENE NADA DE ESTE MODULO  ***',
    [
      `La base «${base}» no tiene ninguna pregunta del modulo ${modulo}.`,
      `El origen espera ${esperadas.size}.`,
      '',
      'O la carga no se hizo, o se hizo contra otra base.',
    ],
    NO_CORRESPONDE
  );
}

// ---------------------------------------------------------------------------
// El sabotaje, si lo hay. Estropea SOLO la copia en memoria de lo leido.
// ---------------------------------------------------------------------------

let queSeRompio = null;

if (sabotaje) {
  enLaBase = JSON.parse(JSON.stringify(enLaBase));
  const primera = enLaBase[0];

  if (sabotaje === 'desplazar') {
    const donde = primera.alternativas.findIndex((a) => a.es_correcta);
    primera.alternativas[donde].es_correcta = false;
    primera.alternativas[(donde + 1) % primera.alternativas.length].es_correcta = true;
    queSeRompio = `la correcta de la pregunta id ${primera.id} se movio una posicion`;
  }

  if (sabotaje === 'faltante') {
    const fuera = enLaBase.pop();
    queSeRompio = `se borro de lo leido la pregunta ${fuera.origen} n.o ${fuera.numero_origen}`;
  }

  if (sabotaje === 'sobrante') {
    // Una pregunta que el origen no tiene. Es como se ve una carga repetida con
    // otro numero_origen, o una fila escrita a mano en la base.
    enLaBase.push({
      ...JSON.parse(JSON.stringify(primera)),
      id: -1,
      numero_origen: 999,
      enunciado: 'Pregunta que no existe en ningun banco de origen.',
    });
    queSeRompio = 'se agrego una pregunta que el origen no tiene';
  }

  if (sabotaje === 'caracter') {
    const antes = primera.enunciado;
    primera.enunciado = `${antes.slice(0, -1)}${antes.slice(-1) === '?' ? '.' : '?'}`;
    queSeRompio = `se cambio un caracter del enunciado de la pregunta id ${primera.id}`;
  }

  if (sabotaje === 'permutar') {
    // Se intercambian dos que NO son la correcta, a proposito: si se permutara la
    // correcta saltaria el ancla y esto no probaria nada que «desplazar» no pruebe
    // ya. Asi el unico que puede cazarlo es el cotejo de los cuatro textos en su
    // orden, que es lo que se quiere ejercitar.
    const [x, y] = primera.alternativas.filter((a) => !a.es_correcta);
    const guardado = x.texto;
    x.texto = y.texto;
    y.texto = guardado;
    queSeRompio =
      `se intercambiaron los textos de «${x.letra}» y «${y.letra}» de la pregunta id ` +
      `${primera.id}, NINGUNA de las cuales es la correcta`;
  }

  if (sabotaje === 'retirada') {
    const moduloDeRetirada = (r) =>
      Number(typeof r.modulo === 'string' ? r.modulo.replace(/\D/g, '') : r.modulo);

    const candidata = [...(retiradas.banco_nuevo ?? []), ...(retiradas.banco_viejo ?? [])].find(
      (r) => moduloDeRetirada(r) === modulo
    );

    if (!candidata) {
      sinVeredicto(`No hay retiradas del modulo ${modulo}: no hay nada que sabotear.`);
    }

    // El texto vive anidado en `pregunta`, no en la entrada. Leerlo mal es lo que
    // tenia la comprobacion de retiradas mirando `undefined`.
    const suEnunciado = candidata.pregunta?.enunciado ?? candidata.pregunta?.q;

    if (!suEnunciado) {
      sinVeredicto('La retirada elegida para el sabotaje no trae texto donde lo busco.');
    }

    enLaBase.push({
      ...JSON.parse(JSON.stringify(primera)),
      id: -2,
      numero_origen: 998,
      enunciado: suEnunciado,
    });
    queSeRompio = `se colo en la base una pregunta retirada: «${suEnunciado.slice(0, 60)}…»`;
  }

  if (sabotaje === 'justificacion') {
    const activa = enLaBase.find((p) => p.estado === 'activa');
    if (!activa) sinVeredicto('No hay ninguna pregunta activa: no hay nada que sabotear.');
    activa.justificacion = null;
    queSeRompio = `la pregunta activa id ${activa.id} se quedo sin justificacion`;
  }

  if (sabotaje === 'relleno') {
    const activa = enLaBase.find((p) => p.estado === 'activa');
    if (!activa) sinVeredicto('No hay ninguna pregunta activa: no hay nada que sabotear.');
    activa.justificacion = 'Pendiente de redaccion';
    queSeRompio = `la pregunta activa id ${activa.id} quedo con justificacion de relleno`;
  }

  if (sabotaje === 'inventado') {
    primera.dificultad = 'alta';
    queSeRompio = `se le invento la dificultad «alta» a la pregunta id ${primera.id}`;
  }

  if (sabotaje === 'ordenfijo') {
    const conMarca = enLaBase.find((p) => p.orden_fijo);
    if (!conMarca) sinVeredicto(`Ninguna pregunta del modulo ${modulo} tiene orden_fijo: nada que sabotear.`);
    conMarca.orden_fijo = false;
    queSeRompio = `se apago el orden_fijo de la pregunta id ${conMarca.id}`;
  }
}

// ---------------------------------------------------------------------------
// Cotejo
// ---------------------------------------------------------------------------

const problemas = [];
const vistas = new Set();

/** Muestra DONDE difieren dos textos, no solo que difieren. */
function aLaVista(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;

  const desde = Math.max(0, i - 30);
  const trozo = (s) =>
    `${desde > 0 ? '…' : ''}${s.slice(desde, i + 30)}${i + 30 < s.length ? '…' : ''}`;

  return (
    `      difieren en el caracter ${i + 1} (origen tiene ${a.length}, base ${b.length})\n` +
    `      origen: «${trozo(a)}»\n` +
    `      base:   «${trozo(b)}»`
  );
}

/**
 * Textos que delatan una justificacion escrita para pasar la validacion.
 *
 * VA ANCLADA AL PRINCIPIO, Y ESO NO ES UN DETALLE
 *
 * La primera version buscaba las palabras en cualquier parte del texto, y con la
 * bandera `i` el patron `TODO` cazaba la palabra española «todo». Marco ocho
 * justificaciones legitimas del modulo 2 —«va todo lo que describe el
 * documento»— como si fueran relleno. Un detector que grita con material bueno
 * ensena a ignorarlo, que es como se cuela el malo.
 *
 * Un relleno no CONTIENE «pendiente»: EMPIEZA por ahi, porque no es una frase
 * sobre la pregunta sino una nota sobre el trabajo que falta.
 */
const RELLENO = /^\s*(pendiente|por\s+redactar|por\s+escribir|sin\s+justificaci|todo\b|tbd|n\/a|[-–—.]+\s*$)/i;

/**
 * Largo por debajo del cual una justificacion no explica nada.
 *
 * Medido sobre el modulo 2 el 2026-09-09, no elegido a ojo: la justificacion mas
 * corta de las 52 tiene 128 caracteres, y «Pendiente de redaccion» tiene 22. En
 * medio hay sitio de sobra, asi que 60 no puede rozar una escrita de verdad.
 */
const LARGO_MINIMO = 60;

const RECUENTO = {
  json_2026: 0,
  js_2026: 0,
  activas: 0,
  borradores: 0,
  retiradasEnBase: 0,
  sinJustificacion: 0,
  sinDificultad: 0,
};

/** Reparto de la posicion de la correcta (H-004). Se informa, no se juzga. */
const posicionDeLaCorrecta = { 1: 0, 2: 0, 3: 0, 4: 0 };

for (const p of enLaBase) {
  const clave = `${p.origen}#${p.numero_origen}`;
  const donde = `${p.origen} n.o ${p.numero_origen} (id ${p.id})`;

  RECUENTO[p.origen] = (RECUENTO[p.origen] ?? 0) + 1;
  if (p.estado === 'activa') RECUENTO.activas += 1;
  if (p.estado === 'borrador') RECUENTO.borradores += 1;
  if (p.estado === 'retirada') RECUENTO.retiradasEnBase += 1;
  if (p.justificacion === null || p.justificacion === undefined) RECUENTO.sinJustificacion += 1;
  if (p.dificultad === null || p.dificultad === undefined) RECUENTO.sinDificultad += 1;

  if (vistas.has(clave)) {
    problemas.push(`DUPLICADA: ${donde} aparece mas de una vez en la base.`);
    continue;
  }
  vistas.add(clave);

  const esperada = esperadas.get(clave);

  if (!esperada) {
    problemas.push(
      `SOBRANTE: ${donde} esta en la base y el origen no la tiene.\n      «${String(p.enunciado).slice(0, 80)}»`
    );
    continue;
  }

  // --- Las cuatro alternativas, y una sola correcta -------------------------

  if (p.alternativas.length !== 4) {
    problemas.push(`ALTERNATIVAS: ${esperada.ref} tiene ${p.alternativas.length} alternativas en la base, no 4.`);
    continue;
  }

  const correctas = p.alternativas.filter((a) => a.es_correcta);

  if (correctas.length !== 1) {
    problemas.push(`CORRECTA: ${esperada.ref} tiene ${correctas.length} alternativas marcadas correctas, no 1.`);
    continue;
  }

  const ordenes = p.alternativas.map((a) => a.orden).join(',');
  if (ordenes !== '1,2,3,4') {
    problemas.push(`ORDEN: ${esperada.ref} tiene los ordenes «${ordenes}» y esperaba «1,2,3,4».`);
    continue;
  }

  posicionDeLaCorrecta[correctas[0].orden] += 1;

  // --- La huella, calculada del lado de la base ----------------------------

  const textos = p.alternativas.map((a) => a.texto);
  const suHuella = huella(p.enunciado, textos, correctas[0].texto);

  if (suHuella !== esperada.huella) {
    // Se dice QUE difiere, no solo que la huella no calza. Un informe que dice
    // «no coincide» y no ensena donde ensena a no leer los informes.
    const detalles = [];

    if (p.enunciado !== esperada.enunciado) {
      detalles.push(`    enunciado:\n${aLaVista(esperada.enunciado, p.enunciado)}`);
    }

    esperada.textos.forEach((esperado, i) => {
      if (textos[i] !== esperado) {
        detalles.push(
          `    alternativa en posicion ${i + 1} («${p.alternativas[i].letra}»):\n${aLaVista(esperado, textos[i] ?? '')}`
        );
      }
    });

    if (correctas[0].texto !== esperada.textoCorrecta) {
      detalles.push(
        '    LA CORRECTA NO ES LA MISMA — es esto lo que el ancla existe para cazar:\n' +
          `      origen marca: «${esperada.textoCorrecta}»\n` +
          `      base marca:   «${correctas[0].texto}»`
      );
    }

    problemas.push(`NO COINCIDE: ${esperada.ref} (${donde})\n${detalles.join('\n')}`);
    continue;
  }

  // --- Orden fijo ----------------------------------------------------------

  if (p.orden_fijo !== esperada.orden_fijo) {
    problemas.push(
      `ORDEN FIJO: ${esperada.ref} deberia tener orden_fijo = ${esperada.orden_fijo ? 1 : 0} y ` +
        `la base dice ${p.orden_fijo ? 1 : 0}.`
    );
  }

  // --- Justificacion, contra la base y no contra el encargo -----------------

  if (p.estado === 'activa') {
    const texto = `${p.justificacion ?? ''}`.trim();

    if (!texto) {
      problemas.push(`ACTIVA SIN JUSTIFICACION: ${esperada.ref} (${donde}) esta activa y no tiene justificacion.`);
    } else if (RELLENO.test(texto)) {
      problemas.push(
        `JUSTIFICACION DE RELLENO: ${esperada.ref} (${donde}) esta activa con un texto que empieza ` +
          `como una nota sobre el trabajo que falta, no como una explicacion.\n      «${texto.slice(0, 90)}»`
      );
    } else if (texto.length < LARGO_MINIMO) {
      problemas.push(
        `JUSTIFICACION DEMASIADO CORTA: ${esperada.ref} (${donde}) tiene ${texto.length} caracteres ` +
          `y ninguna escrita de verdad baja de ${LARGO_MINIMO}.\n      «${texto}»`
      );
    }
  }

  // --- Campos que nadie escribio ------------------------------------------

  if (p.dificultad !== null && p.dificultad !== undefined) {
    problemas.push(
      `CAMPO INVENTADO: ${esperada.ref} (${donde}) trae dificultad «${p.dificultad}» y nadie la clasifico.`
    );
  }
}

// --- Lo que falta ----------------------------------------------------------

for (const [clave, esperada] of esperadas) {
  if (vistas.has(clave)) continue;
  problemas.push(
    `FALTANTE: ${esperada.ref} (${clave}) esta en el origen y no llego a la base.\n` +
      `      «${esperada.enunciado.slice(0, 80)}»`
  );
}

// --- Justificaciones repetidas, que es la otra cara del relleno -------------

const porJustificacion = new Map();

for (const p of enLaBase) {
  const texto = `${p.justificacion ?? ''}`.trim();
  if (!texto) continue;
  porJustificacion.set(texto, (porJustificacion.get(texto) ?? 0) + 1);
}

for (const [texto, veces] of porJustificacion) {
  if (veces < 2) continue;
  problemas.push(
    `JUSTIFICACION REPETIDA: ${veces} preguntas comparten la misma justificacion, palabra por ` +
      `palabra.\n      «${texto.slice(0, 90)}»`
  );
}

// --- Las retiradas no se cargaron ------------------------------------------
//
// DONDE VIVE EL TEXTO, Y POR QUE ESTO ESTUVO ROTO
//
// Una entrada de `retiradas.json` NO trae el enunciado arriba: trae la pregunta
// original entera anidada en `pregunta`, y dentro va `enunciado` si viene del
// banco nuevo y `q` si viene del viejo. La primera version de este bloque leia
// `r.enunciado ?? r.q` sobre la entrada y no sobre `r.pregunta`, asi que obtenia
// `undefined` SIEMPRE, no comparaba nada, y por eso informaba «ninguna en la
// base» pasara lo que pasara.
//
// Es H-023 por tercera vez en esta iteracion, y aparecio por la unica via por la
// que estas cosas aparecen: al escribir el sabotaje que la obliga a decir «no».
// Sin ese sabotaje, este bloque habria pasado a produccion diciendo que si.
//
// EL NUMERO SIRVE PARA UN BANCO Y PARA EL OTRO NO
//
// Del banco nuevo se coteja tambien la identidad, porque `numero` es estable y
// el banco no se renumero: si un `numero` retirado aparece cargado, es un error.
//
// Del banco viejo NO se puede: su campo es `posicion_original`, la posicion que
// la pregunta tenia ANTES de los retiros del 2026-09-04, mientras que el
// `numero_origen` cargado es la posicion de HOY, ya corrida. Cotejar una contra
// otra emparejaria preguntas distintas y acusaria en falso — es el mismo
// desplazamiento que movio la pregunta del orden fijo de la posicion 13 a la 11.
// Del banco viejo se coteja el texto, que no se corrio.

const moduloDe = (r) => Number(typeof r.modulo === 'string' ? r.modulo.replace(/\D/g, '') : r.modulo);

/** El enunciado de una retirada, este en el banco que este. */
const enunciadoDeRetirada = (r) => r.pregunta?.enunciado ?? r.pregunta?.q ?? null;

const retiradasNuevo = (retiradas.banco_nuevo ?? []).filter((r) => moduloDe(r) === modulo);
const retiradasViejo = (retiradas.banco_viejo ?? []).filter((r) => moduloDe(r) === modulo);
const retiradasDelModulo = [...retiradasNuevo, ...retiradasViejo];

const enunciadosEnBase = new Map(enLaBase.map((p) => [p.enunciado, p]));

for (const r of retiradasDelModulo) {
  const suEnunciado = enunciadoDeRetirada(r);

  if (!suEnunciado) {
    // Que una entrada no tenga texto no se calla: es lo que hizo invisible el
    // fallo de arriba. Si el formato del archivo cambia, se dice.
    problemas.push(
      `RETIRADA ILEGIBLE: una entrada de retiradas.json del modulo ${modulo} no trae ` +
        'texto donde este guion lo busca (pregunta.enunciado o pregunta.q). Sin texto ' +
        'no se puede comprobar que no se haya cargado, y eso NO es un aprobado.'
    );
    continue;
  }

  const enBase = enunciadosEnBase.get(suEnunciado);

  if (enBase) {
    problemas.push(
      `RETIRADA CARGADA: una pregunta retirada el 2026-09-04 esta en la base (id ${enBase.id}).\n` +
        `      «${suEnunciado.slice(0, 80)}»`
    );
  }
}

for (const r of retiradasNuevo) {
  const cargada = enLaBase.find((p) => p.origen === 'json_2026' && p.numero_origen === r.numero);
  if (!cargada) continue;
  problemas.push(
    `RETIRADA CARGADA POR SU NUMERO: m0${modulo}#${r.numero} figura retirada y hay una ` +
      `json_2026 con ese numero_origen en la base (id ${cargada.id}).`
  );
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

const conteoEsperado = {
  json_2026: bancoNuevo.length,
  js_2026: grupoViejo.preguntas.length,
};

const cifra = (n) => String(n).padStart(3);

const resumen = [
  `Modulo:   ${modulo}`,
  `Base:     ${base}   (${uuidVisto})`,
  `Destino:  ${destino}`,
  '',
  'Conteo por origen, contra los dos archivos de origen:',
  '',
  `  json_2026   base ${cifra(RECUENTO.json_2026)}   origen ${cifra(conteoEsperado.json_2026)}   ` +
    `${RECUENTO.json_2026 === conteoEsperado.json_2026 ? 'calzan' : '*** NO CALZAN ***'}`,
  `  js_2026     base ${cifra(RECUENTO.js_2026)}   origen ${cifra(conteoEsperado.js_2026)}   ` +
    `${RECUENTO.js_2026 === conteoEsperado.js_2026 ? 'calzan' : '*** NO CALZAN ***'}`,
  `  total       base ${cifra(enLaBase.length)}   origen ${cifra(esperadas.size)}`,
  '',
  'Estado de lo cargado:',
  '',
  `  activas               ${cifra(RECUENTO.activas)}`,
  `  borradores            ${cifra(RECUENTO.borradores)}`,
  `  retiradas             ${cifra(RECUENTO.retiradasEnBase)}`,
  '',
  'Campos que nadie escribio, contados sobre la base:',
  '',
  `  justificacion IS NULL ${cifra(RECUENTO.sinJustificacion)}`,
  `  dificultad IS NULL    ${cifra(RECUENTO.sinDificultad)}   de ${enLaBase.length}`,
  '',
  `Retiradas del modulo    ${cifra(retiradasDelModulo.length)}   ` +
    `(${retiradasNuevo.length} json_2026 + ${retiradasViejo.length} js_2026), ninguna en la base`,
  '',
  'Reparto de la posicion de la correcta (H-004, se informa y no se corrige):',
  '',
  ...[1, 2, 3, 4].map((pos) => {
    const n = posicionDeLaCorrecta[pos];
    const total = Object.values(posicionDeLaCorrecta).reduce((a, b) => a + b, 0) || 1;
    const porciento = Math.round((n * 100) / total);
    return `  posicion ${pos}   ${cifra(n)}   ${'#'.repeat(Math.round(porciento / 2))} ${porciento}%`;
  }),
];

const marcaDeOrdenFijo = enLaBase.filter((p) => p.orden_fijo);

if (marcaDeOrdenFijo.length || [...esperadas.values()].some((e) => e.orden_fijo)) {
  resumen.push(
    '',
    'Orden fijo (criterio de nivel 2 de la iteracion 25):',
    '',
    ...(marcaDeOrdenFijo.length
      ? marcaDeOrdenFijo.map((p) => `  orden_fijo = 1   id ${p.id}   «${p.enunciado.slice(0, 60)}…»`)
      : ['  ninguna pregunta con orden_fijo = 1 en la base']),
    '',
    `  Testigo: ${BANCO_VIEJO.replace(RAIZ, '.')} ${existsSync(BANCO_VIEJO) ? 'SIGUE en el arbol' : 'YA NO ESTA'}`
  );
}

if (sabotaje) {
  /**
   * Que comprobacion tiene que ser la que lo cace. NO basta con que salte
   * cualquiera.
   *
   * Un sabotaje suele disparar varias a la vez —colar una retirada tambien la
   * vuelve sobrante— y quedarse con «hubo problemas» deja aprobada una
   * comprobacion que nunca se ejercito, escondida detras de una vecina que si
   * funciona. Es la misma trampa que H-023 describe, un piso mas arriba: aca la
   * que siempre pasa seria el propio sabotaje.
   *
   * Por eso cada uno nombra el texto que EXIGE ver. `desplazar` exige el ancla y
   * no un «no coincide» cualquiera, y `permutar` exige el cotejo de los cuatro
   * textos en su orden, que es lo unico que puede cazarlo.
   */
  const DEBE_DECIR = {
    desplazar: 'LA CORRECTA NO ES LA MISMA',
    faltante: 'FALTANTE:',
    sobrante: 'SOBRANTE:',
    caracter: 'enunciado:',
    permutar: 'alternativa en posicion',
    retirada: 'RETIRADA CARGADA:',
    justificacion: 'ACTIVA SIN JUSTIFICACION:',
    relleno: 'JUSTIFICACION DE RELLENO:',
    inventado: 'CAMPO INVENTADO:',
    ordenfijo: 'ORDEN FIJO:',
  };

  const exigido = DEBE_DECIR[sabotaje];
  const loDijo = problemas.some((p) => p.includes(exigido));

  const titulo = loDijo
    ? 'SABOTAJE CAZADO  ***  por la comprobacion que corresponde  ***'
    : 'SABOTAJE NO CAZADO  ***  EL COMPROBADOR NO SIRVE  ***';

  veredicto(
    titulo,
    [
      `Sabotaje:      --sabotaje=${sabotaje}`,
      `Que se rompio: ${queSeRompio}`,
      `Debe decir:    «${exigido}»`,
      '',
      ...(loDijo
        ? [`El comprobador informo ${problemas.length} problema(s), y entre ellos el exigido:`]
        : problemas.length
          ? [
              `El comprobador informo ${problemas.length} problema(s), pero NINGUNO es el exigido.`,
              '',
              'Saltaron otras comprobaciones, no la que este sabotaje viene a ejercitar.',
              'Eso deja esa comprobacion sin probar, escondida detras de una vecina que si',
              'funciona. No cuenta como cazado.',
              '',
              'Lo que informo:',
            ]
          : [
              'El comprobador NO se dio cuenta de nada, y eso lo invalida entero: una',
              'comprobacion que no puede decir «no» no es una comprobacion, es una',
              'afirmacion con su forma (H-023). Arreglalo antes de volver a usarlo.',
            ]),
      '',
      ...problemas.map((p) => `  ${p}`),
    ],
    loDijo ? COMPROBADA : NO_CORRESPONDE
  );
}

if (problemas.length) {
  veredicto(
    'NO CORRESPONDE  ***  LA BASE Y EL ORIGEN DIFIEREN  ***',
    [
      ...resumen,
      '',
      raya,
      `${problemas.length} problema(s):`,
      '',
      ...problemas.map((p) => `  ${p}`),
      '',
      'No cierres ningun criterio de la iteracion 25 con esto.',
    ],
    NO_CORRESPONDE
  );
}

veredicto(
  'CARGA COMPROBADA  ***  la base corresponde a los dos origenes  ***',
  [
    ...resumen,
    '',
    raya,
    'Comprobado pregunta a pregunta, no por muestreo:',
    '',
    `  ${esperadas.size} preguntas del origen, ${esperadas.size} encontradas en la base`,
    '  enunciado, los cuatro textos EN SU ORDEN y el texto de la correcta',
    '  sin normalizar nada: ni espacios, ni comillas, ni mayusculas',
    '',
    'Lo que esto NO dice, y conviene no confundirlo:',
    '',
    '  que las justificaciones sean CIERTAS. Solo que existen y no son de relleno.',
    '  que el banco no tenga duplicados por redaccion distinta. Son esperados.',
  ],
  COMPROBADA
);
