/**
 * Capa 4 de la barrera de ADR-015: comprobar que la barrera sigue en pie, y
 * hacer ruido si no.
 *
 * Por que existe (H-014):
 * La barrera protege de un error que no se comete a proposito, asi que nadie va a
 * acordarse de revisarla. Una barrera que se cae en silencio es peor que no
 * tenerla: se sigue trabajando con la confianza que daba. Por eso este archivo
 * corre como PRIMER paso de `npm run verificar`, antes de construir nada.
 *
 * Lo que comprueba, y solo cuando corre dentro de Claude Code:
 *   1. `XDG_CONFIG_HOME` apunta a un directorio propio, y ahi NO hay sesion de
 *      wrangler. Es la capa que sostiene: la heredan todos los procesos hijos, asi
 *      que sobrevive a cualquier andamiaje.
 *   2. Ninguna variable `CLOUDFLARE_*` trae una credencial.
 *   3. El enganche `PreToolUse` esta declarado y su guion existe.
 *   4. Y se esta EJECUTANDO de verdad, no solo declarado: deja un testigo con la
 *      hora cada vez que corre, y aqui se comprueba que sea reciente.
 *
 * En el terminal del autor la barrera NO aplica —el trabaja contra la nube a
 * proposito, por ADR-015— y entonces esto dice NO APLICA y no estorba. Pero
 * imprime siempre que entorno detecto: si algun dia Claude Code deja de anunciarse
 * con `CLAUDECODE`, la deteccion fallaria y esto pasaria a decir NO APLICA dentro
 * de Claude Code, que es justo la forma silenciosa de caerse. Escrito a la vista
 * para que se note.
 *
 * Codigos de salida:
 *   0  BARRERA EN PIE, o NO APLICA en el terminal del autor
 *   1  BARRERA CAIDA        falta alguna condicion, listada
 *   2  NO SE PUDO COMPROBAR no hay veredicto
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AJUSTES = join(RAIZ, '.claude', 'settings.json');
const GUARDIAN = join(RAIZ, 'scripts', 'barrera-remoto.mjs');

// Donde wrangler guarda su sesion, relativo al directorio de configuracion. Se lee
// de su propio codigo: en Windows el directorio es XDG_CONFIG_HOME si esta
// definida, y si no `%APPDATA%\xdg.config`.
const SESION = join('.wrangler', 'config', 'default.toml');

const CREDENCIALES = [
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_API_KEY',
  'CLOUDFLARE_EMAIL',
  'CLOUDFLARE_ACCOUNT_ID',
];

const EN_PIE = 0;
const CAIDA = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);

const veredicto = (titulo, lineas, codigo) => {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
};

// ---------------------------------------------------------------------------
// Que entorno es este
// ---------------------------------------------------------------------------

const enClaudeCode = process.env.CLAUDECODE === '1' || Boolean(process.env.CLAUDE_CODE_ENTRYPOINT);

const comoSeDetecto = enClaudeCode
  ? `Entorno detectado: Claude Code (CLAUDECODE=${process.env.CLAUDECODE ?? 'sin valor'}, CLAUDE_CODE_ENTRYPOINT=${process.env.CLAUDE_CODE_ENTRYPOINT ?? 'sin valor'}).`
  : 'Entorno detectado: terminal normal. No hay marcadores de Claude Code.';

if (!enClaudeCode) {
  veredicto(
    'BARRERA NO APLICA',
    [
      comoSeDetecto,
      '',
      'La barrera de ADR-015 solo restringe al entorno de Claude Code. Este',
      'terminal es el del autor, que si puede hablar con la cuenta de Cloudflare.',
      '',
      'Si estas leyendo esto DENTRO de Claude Code, la barrera se cayo de la peor',
      'forma posible: dejo de reconocer su propio entorno. Ver H-014.',
    ],
    EN_PIE
  );
}

// ---------------------------------------------------------------------------
// Condicion 1 · el entorno no tiene credenciales de wrangler
// ---------------------------------------------------------------------------

const fallos = [];
const comprobado = [];

const config = process.env.XDG_CONFIG_HOME;

if (!config) {
  fallos.push([
    'XDG_CONFIG_HOME no esta definida.',
    '  Sin ella wrangler lee la sesion de %APPDATA%\\xdg.config, que SI la tiene.',
    '  Se define en los ajustes de USUARIO de Claude Code, ~/.claude/settings.json,',
    '  en el bloque "env". No en los del proyecto: desde ahi no se aplica.',
    '  El texto exacto esta en 90-manual/esquema-del-banco.md.',
  ]);
} else if (!isAbsolute(config)) {
  fallos.push([
    `XDG_CONFIG_HOME no es una ruta absoluta: ${config}`,
    '  wrangler la usa tal cual, asi que una ruta relativa apunta a un sitio',
    '  distinto segun desde donde se lance el proceso.',
  ]);
} else {
  let sesion;

  try {
    sesion = existsSync(join(config, SESION));
  } catch (error) {
    veredicto(
      'NO SE PUDO COMPROBAR',
      [comoSeDetecto, '', `No pude mirar dentro de ${config}:`, `  ${error.message}`],
      SIN_VEREDICTO
    );
  }

  if (sesion) {
    fallos.push([
      `XDG_CONFIG_HOME apunta a un directorio CON sesion de wrangler: ${config}`,
      `  Existe ${SESION}. Desde aca se puede autenticar contra la cuenta.`,
    ]);
  } else {
    comprobado.push(`XDG_CONFIG_HOME apunta a ${config}, y ahi no hay sesion de wrangler.`);
  }
}

// ---------------------------------------------------------------------------
// Condicion 2 · ninguna variable de credencial trae valor
// ---------------------------------------------------------------------------

const conValor = CREDENCIALES.filter((v) => `${process.env[v] ?? ''}`.trim() !== '');

if (conValor.length) {
  fallos.push([
    `Hay credenciales en el entorno: ${conValor.join(', ')}`,
    '  wrangler las prefiere a la sesion en disco, asi que la condicion 1 no basta.',
  ]);
} else {
  comprobado.push(`Ninguna de estas trae valor: ${CREDENCIALES.join(', ')}.`);
}

// ---------------------------------------------------------------------------
// Condicion 3 · el enganche esta declarado y su guion existe
// ---------------------------------------------------------------------------

if (!existsSync(GUARDIAN)) {
  fallos.push([
    'Falta scripts/barrera-remoto.mjs, el guion del enganche.',
    '  El enganche declarado sin guion no rechaza nada.',
  ]);
} else if (!existsSync(AJUSTES)) {
  fallos.push([
    'Falta .claude/settings.json, donde se declara el enganche PreToolUse.',
  ]);
} else {
  let declarado = false;

  try {
    const ajustes = JSON.parse(readFileSync(AJUSTES, 'utf8'));
    declarado = (ajustes?.hooks?.PreToolUse ?? []).some((entrada) =>
      (entrada?.hooks ?? []).some((h) => `${h?.command ?? ''}`.includes('barrera-remoto.mjs'))
    );
  } catch (error) {
    veredicto(
      'NO SE PUDO COMPROBAR',
      [
        comoSeDetecto,
        '',
        'No pude leer .claude/settings.json:',
        `  ${error.message}`,
        '',
        'Ojo: un settings.json mal formado deja sin efecto TODOS sus ajustes,',
        'incluido el enganche. Arreglar el JSON es lo primero.',
      ],
      SIN_VEREDICTO
    );
  }

  if (!declarado) {
    fallos.push([
      '.claude/settings.json no declara el enganche PreToolUse de barrera-remoto.mjs.',
    ]);
  } else {
    comprobado.push('El enganche PreToolUse esta declarado y su guion existe.');
  }
}

// ---------------------------------------------------------------------------
// Condicion 4 · el enganche no solo esta declarado: se esta ejecutando
//
// Declarado y vivo no son lo mismo. Un enganche escrito en un archivo que Claude
// Code no llega a cargar no rechaza nada, y hasta el 2026-09-04 esta comprobacion
// decia «en pie» en esa situacion. Paso de verdad: el archivo estaba bien, el
// guion estaba bien, y el enganche no se ejecutaba.
//
// El guardian deja un testigo con la hora cada vez que corre. Este comprobador se
// lanza a traves de la misma herramienta que dispara el enganche, asi que si esta
// vivo el testigo se acaba de escribir. Si no, envejece.
// ---------------------------------------------------------------------------

const TESTIGO = join(RAIZ, '.wrangler', 'barrera-ultimo-uso.txt');
const FRESCURA_SEGUNDOS = 300;

if (!existsSync(TESTIGO)) {
  fallos.push([
    'El enganche no se ha ejecutado ni una vez: no hay testigo.',
    `  Deberia estar en ${TESTIGO}.`,
    '  Declararlo no basta; Claude Code tiene que llegar a cargarlo. Abre /hooks',
    '  una vez para que recargue la configuracion, o reinicia la sesion.',
  ]);
} else {
  let edad;

  try {
    edad = (Date.now() - statSync(TESTIGO).mtimeMs) / 1000;
  } catch (error) {
    veredicto(
      'NO SE PUDO COMPROBAR',
      [comoSeDetecto, '', `No pude leer el testigo del enganche: ${error.message}`],
      SIN_VEREDICTO
    );
  }

  if (edad > FRESCURA_SEGUNDOS) {
    fallos.push([
      `El enganche esta declarado pero no se esta ejecutando: su testigo tiene ${Math.round(edad)} s.`,
      `  Como esta comprobacion corre a traves de la herramienta que lo dispara, el`,
      `  testigo deberia ser de hace segundos. Que no lo sea significa que el`,
      `  enganche no llego a cargarse, aunque el archivo lo declare.`,
    ]);
  } else {
    comprobado.push(`El enganche se ejecuto hace ${Math.round(edad)} s: esta vivo, no solo declarado.`);
  }
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

if (fallos.length) {
  veredicto(
    `BARRERA CAIDA  ***  ${fallos.length} de 4 condiciones sin cumplir  ***`,
    [
      comoSeDetecto,
      '',
      'Desde este entorno se puede llegar a la cuenta de Cloudflare. Eso es lo que',
      'la barrera existe para impedir, y ahora mismo no lo impide.',
      '',
      ...fallos.flatMap((f, i) => [`${i + 1}. ${f[0]}`, ...f.slice(1), '']),
      'Detalle en la auditoria tecnica, H-014.',
      'No sigas trabajando contra datos hasta reponerla.',
    ],
    CAIDA
  );
}

veredicto(
  'BARRERA EN PIE',
  [
    comoSeDetecto,
    '',
    ...comprobado.map((c) => `  - ${c}`),
    '',
    'Recuerda lo que esto NO garantiza: el enganche solo mira la linea de',
    'comandos, y un comando escondido dentro de un archivo no se ve ahi. Lo que',
    'de verdad sostiene es el entorno sin credenciales.',
  ],
  EN_PIE
);
