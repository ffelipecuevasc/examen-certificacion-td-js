/**
 * Vuelca el CONTENIDO del banco a un archivo de texto, para poder compararlo.
 *
 *   node scripts/volcar-contenido.mjs --base=<nombre> --salida=<archivo>
 *
 * PARA QUE SIRVE
 *
 * Para responder «que hay en la base» sin creerle a nadie. Dos volcados con el
 * mismo resumen son la misma base, fila por fila y columna por columna. Es el
 * instrumento del ensayo de H-025: el veredicto del todo o nada sale de comparar
 * el volcado de antes con el de despues, NO del mensaje de wrangler, que ya
 * mintio una vez (H-024).
 *
 * NO ESCRIBE NADA EN LA BASE. Solo lee.
 *
 * POR QUE --base ES OBLIGATORIO Y NO TIENE VALOR POR OMISION
 *
 * Los otros guiones del proyecto se apoyan en la base publicada cuando nadie dice
 * cual. Aca eso seria un error: este guion existe para ensayar contra la base de
 * pruebas, y un valor por omision convertiria un olvido en una consulta a
 * produccion. Sin --base no corre.
 *
 * EL UUID SE COTEJA ANTES DE LEER, Y ES UNA CONDICION, NO UN AVISO
 *
 * El nombre de la base es lo que uno escribe; el uuid es contra lo que se termina
 * hablando. Contra la nube wrangler no usa wrangler.toml como limite: busca el
 * nombre en la cuenta (H-015). Asi que antes de la consulta de verdad va una
 * consulta trivial SIN --json —que es la unica forma de que wrangler imprima la
 * linea con el uuid— y se compara con el declarado en wrangler.toml. Si no
 * calzan, no se lee nada.
 *
 * Con --json wrangler baja su nivel de registro y esa linea desaparece. Por eso
 * el cotejo va aparte y no se puede sacar de la misma llamada.
 *
 * COMO SE LEE LO QUE DICE WRANGLER (H-019)
 *
 * Se interpreta la salida ENTERA, no desde el primer corchete: el sobre de error
 * de wrangler trae un `notes: [...]` y buscar el primer `[` cae dentro del error,
 * convirtiendo un mensaje que lo explicaba todo en un fallo de sintaxis.
 *
 * SE PIDE `SELECT *` A PROPOSITO
 *
 * Asi el volcado recoge las columnas que la base tenga, sin que este guion tenga
 * que saber cuales son. Si manana hay una migracion 003, el volcado la incluye
 * sin tocar este archivo, y una columna nueva no pasa desapercibida en la
 * comparacion.
 *
 * Codigos de salida:
 *   0  VOLCADO HECHO
 *   2  SIN VOLCADO       no se pudo leer la base. NO es un volcado vacio
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const CONFIGURACION = join(RAIZ, 'wrangler.toml');

const HECHO = 0;
const SIN_VOLCADO = 2;

const raya = '='.repeat(72);

const veredicto = (titulo, lineas, codigo) => {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
};

const sinVolcado = (motivo, detalle = []) =>
  veredicto(
    'SIN VOLCADO  ***  ESTO NO ES UNA BASE VACIA  ***',
    [
      motivo,
      ...(detalle.length ? ['', ...detalle] : []),
      '',
      'No se pudo leer la base, que no es lo mismo que que no tenga nada.',
      'No uses este resultado como punto de comparacion.',
    ],
    SIN_VOLCADO
  );

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2);
const valorDe = (nombre) => {
  const encontrado = argumentos.find((a) => a.startsWith(`--${nombre}=`));
  return encontrado ? encontrado.slice(nombre.length + 3) : null;
};

const base = valorDe('base');
const salida = valorDe('salida');

if (!base || !salida) {
  veredicto(
    'SIN VOLCADO  ***  falta decir que base y donde  ***',
    [
      'Uso:',
      '',
      '  node scripts/volcar-contenido.mjs --base=<nombre> --salida=<archivo>',
      '',
      'Las dos son obligatorias. --base no tiene valor por omision a proposito:',
      'este guion se usa para ensayar contra otras bases, y un valor por omision',
      'convertiria un olvido en una consulta a la base publicada.',
      '',
      'Contra la nube hay que agregar el flag correspondiente y el permiso de',
      'ADR-015, igual que en los demas guiones.',
    ],
    SIN_VOLCADO
  );
}

/** El flag que apunta a la nube, escrito entero y a la vista (H-014). */
const FLAG_REMOTO = '--remote';
const remoto = argumentos.includes(FLAG_REMOTO);
const destino = remoto ? FLAG_REMOTO : '--local';

// ---------------------------------------------------------------------------
// Lo que declara wrangler.toml
// ---------------------------------------------------------------------------

let configuracion;

try {
  configuracion = readFileSync(CONFIGURACION, 'utf8');
} catch (error) {
  sinVolcado(`No pude leer ${CONFIGURACION}: ${error.message}`);
}

const declaradas = [...configuracion.matchAll(/^\s*database_name\s*=\s*"([^"]+)"/gm)].map((m) => m[1]);

if (process.env.PERMITIR_BASE_NO_DECLARADA !== '1' && !declaradas.includes(base)) {
  veredicto(
    'SIN VOLCADO  ***  BASE NO DECLARADA  ***  H-015  ***',
    [
      `Pediste leer la base «${base}», que no esta declarada en wrangler.toml.`,
      '',
      `Declaradas: ${declaradas.join(', ') || '(ninguna)'}`,
      '',
      'Si sabes lo que haces: PERMITIR_BASE_NO_DECLARADA=1',
    ],
    SIN_VOLCADO
  );
}

/** El uuid que wrangler.toml le asigna a ese nombre. Es contra lo que se coteja. */
const uuidDeclarado = (() => {
  const bloques = configuracion.split(/^\s*\[\[/m);
  for (const bloque of bloques) {
    if (!new RegExp(`database_name\\s*=\\s*"${base}"`).test(bloque)) continue;
    return bloque.match(/^\s*database_id\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  }
  return null;
})();

if (!uuidDeclarado) {
  sinVolcado(`wrangler.toml declara «${base}» pero no le veo un database_id.`);
}

// ---------------------------------------------------------------------------
// Barrera de ADR-015
// ---------------------------------------------------------------------------

if (remoto && process.env.PERMITIR_REMOTO !== '1') {
  veredicto(
    'SIN VOLCADO  ***  ME NIEGO A CORRER ESTO  ***  ADR-015  ***',
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
      '  Git Bash:    PERMITIR_REMOTO=1 node scripts/volcar-contenido.mjs ...',
      '',
      'Leer no es escribir, pero la barrera es la misma: quien decide contra que',
      'cuenta se habla es el autor, no el agente.',
    ],
    SIN_VOLCADO
  );
}

// ---------------------------------------------------------------------------
// Hablar con wrangler
// ---------------------------------------------------------------------------

if (!existsSync(WRANGLER)) {
  sinVolcado('No encontre wrangler en node_modules. Corre `npm install`.');
}

const sinColores = (texto) => texto.replace(/\[[0-9;]*m/g, '').replace(/\[[0-9;]*m/g, '');

function wrangler(parametros) {
  const resultado = spawnSync(process.execPath, [WRANGLER, 'd1', 'execute', base, destino, ...parametros], {
    cwd: RAIZ,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });

  if (resultado.error) {
    sinVolcado(`No pude lanzar wrangler: ${resultado.error.message}`);
  }

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

// ---------------------------------------------------------------------------
// Cotejo del uuid, ANTES de leer nada
//
// Va sin --json a proposito: es la unica forma de que wrangler imprima contra que
// uuid esta hablando. Con --json esa linea no existe.
// ---------------------------------------------------------------------------

const cotejo = wrangler(['--command=SELECT 1 AS cotejo;']);
const textoCotejo = `${cotejo.normal}${cotejo.errores}`;
const uuidVisto = textoCotejo.match(/database\s+\S+\s+\(([0-9a-fA-F-]{36})\)/)?.[1] ?? null;

if (!uuidVisto) {
  sinVolcado(
    'Wrangler no dijo contra que uuid iba a hablar, asi que no pude cotejarlo.',
    [
      `Esperaba ver «${uuidDeclarado}», el que wrangler.toml le da a «${base}».`,
      '',
      'Sin ese cotejo no se lee: el nombre es lo que uno escribe, el uuid es',
      'contra lo que se termina hablando.',
      '',
      ...crudo(cotejo),
    ]
  );
}

if (uuidVisto.toLowerCase() !== uuidDeclarado.toLowerCase()) {
  veredicto(
    'SIN VOLCADO  ***  EL UUID NO CALZA  ***  NO SE LEYO NADA  ***',
    [
      `Pediste la base «${base}».`,
      '',
      `  wrangler.toml dice:  ${uuidDeclarado}`,
      `  wrangler habla con:  ${uuidVisto}`,
      '',
      'Son bases distintas. Para el nombre esta bien, pero el nombre no es la',
      'base: contra la nube wrangler busca el nombre en la cuenta y se queda con',
      'lo que encuentre (H-015).',
      '',
      'No sigas hasta entender por que difieren.',
    ],
    SIN_VOLCADO
  );
}

// ---------------------------------------------------------------------------
// El volcado
// ---------------------------------------------------------------------------

const CONSULTAS = [
  ['modulo', 'SELECT * FROM modulo ORDER BY numero;'],
  ['pregunta', 'SELECT * FROM pregunta ORDER BY id;'],
  ['alternativa', 'SELECT * FROM alternativa ORDER BY pregunta_id, letra;'],
];

const lectura = wrangler([`--command=${CONSULTAS.map(([, sql]) => sql).join('\n')}`, '--json']);

let respuesta;

try {
  respuesta = JSON.parse(lectura.normal.trim());
} catch (error) {
  sinVolcado(`No pude interpretar la respuesta de wrangler: ${error.message}`, crudo(lectura));
}

if (respuesta?.error) {
  const notas = Array.isArray(respuesta.error.notes)
    ? respuesta.error.notes.map((n) => `  ${n?.text ?? JSON.stringify(n)}`)
    : [];

  sinVolcado('Wrangler no pudo ejecutar la consulta. Lo que dijo, tal cual:', [
    `  ${respuesta.error.text ?? JSON.stringify(respuesta.error)}`,
    ...notas,
    '',
    'Si dice «no such table», esa base todavia no tiene el esquema del banco.',
    'Si dice «no such column», puede faltarle una migracion.',
  ]);
}

if (!Array.isArray(respuesta) || respuesta.length !== CONSULTAS.length) {
  sinVolcado(
    `Esperaba ${CONSULTAS.length} bloques de resultados y llego ${
      Array.isArray(respuesta) ? `un arreglo de ${respuesta.length}` : 'otra cosa'
    }.`,
    crudo(lectura)
  );
}

/** Una fila, con sus claves ordenadas, para que el texto no dependa del orden. */
const aLinea = (tabla, fila) => {
  const ordenada = {};
  for (const clave of Object.keys(fila).sort()) ordenada[clave] = fila[clave];
  return `${tabla}\t${JSON.stringify(ordenada)}`;
};

const lineas = [];
const conteos = {};

CONSULTAS.forEach(([tabla], indice) => {
  const filas = respuesta[indice]?.results ?? [];
  conteos[tabla] = filas.length;
  for (const fila of filas) lineas.push(aLinea(tabla, fila));
});

const cuerpo = lineas.join('\n');
const resumen = createHash('sha256').update(cuerpo, 'utf8').digest('hex').slice(0, 16);

const rutaSalida = resolve(process.cwd(), salida);

try {
  writeFileSync(rutaSalida, `${cuerpo}\n`, 'utf8');
} catch (error) {
  sinVolcado(`No pude escribir «${salida}»: ${error.message}`);
}

const porOrigen = {};
for (const linea of lineas) {
  if (!linea.startsWith('pregunta\t')) continue;
  const origen = JSON.parse(linea.slice('pregunta\t'.length)).origen;
  porOrigen[origen] = (porOrigen[origen] ?? 0) + 1;
}

veredicto(
  'VOLCADO HECHO',
  [
    `Base:      ${base} (${remoto ? 'nube' : 'local'})`,
    `uuid:      ${uuidVisto}  ·  cotejado contra wrangler.toml antes de leer`,
    `Archivo:   ${salida}`,
    '',
    `modulos:      ${conteos.modulo}`,
    `preguntas:    ${conteos.pregunta}`,
    `alternativas: ${conteos.alternativa}`,
    `por origen:   ${Object.entries(porOrigen).map(([o, n]) => `${o}=${n}`).join(' · ') || '(ninguna)'}`,
    '',
    `RESUMEN: ${resumen}`,
    '',
    'Dos volcados con el mismo resumen son la misma base. El resumen es del',
    'contenido, no del mensaje de ninguna herramienta.',
  ],
  HECHO
);
