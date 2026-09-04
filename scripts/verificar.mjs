/**
 * Comprueba que el CSS versionado no se haya quedado atras respecto de su fuente.
 *
 * Por que existe este script:
 * Antes esto era una linea en package.json, `npm run build && git diff --exit-code
 * static/css/`. Se rompio en cuanto se ejecuto desde un terminal sin git en el PATH
 * (hallazgo H-011), y se rompio de la peor forma posible: a mitad de camino. La
 * construccion ya habia reescrito static/css/ cuando reventaba el `git diff`, asi
 * que quedaba un error de git en pantalla y ninguna comprobacion hecha. Quien
 * leyera por encima podia creer que habia verificado algo.
 *
 * Dos ideas ordenan lo que sigue:
 *
 * 1. La comprobacion central NO necesita git. Lo que importa es si el CSS
 *    corresponde a la fuente, y eso se sabe guardando el contenido, reconstruyendo
 *    y comparando. Funciona en cualquier terminal y en un clon recien bajado.
 * 2. Git es un extra que agrega un segundo dato: si ademas esta commiteado. Cuando
 *    no aparece, no se falla ni se calla: se dice que la comprobacion quedo a
 *    medias, y se sale con un codigo que nadie pueda confundir con un exito.
 *
 * Codigos de salida:
 *   0  VERIFICADO
 *   1  DESFASADO
 *   2  VERIFICACION PARCIAL   (no es un exito)
 *   3  no se pudo construir
 *
 * Uso: npm run verificar
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CARPETA_CSS = 'static/css';

const VERIFICADO = 0;
const DESFASADO = 1;
const PARCIAL = 2;
const SIN_CONSTRUIR = 3;

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/** Contenido actual de los .css, indexado por ruta. */
function leerCss() {
  if (!existsSync(CARPETA_CSS)) return new Map();

  return new Map(
    readdirSync(CARPETA_CSS)
      .filter((n) => n.endsWith('.css'))
      .map((n) => [join(CARPETA_CSS, n), readFileSync(join(CARPETA_CSS, n))])
  );
}

/**
 * Ejecuta `npm run build`.
 *
 * Se usa el npm que ya nos esta ejecutando (`npm_execpath`) en vez de buscar el
 * comando `npm` en el PATH. Es la misma precaucion que motiva todo este archivo:
 * no depender de como este configurado el terminal de quien lo corre.
 */
function construir() {
  const cliDeNpm = process.env.npm_execpath;

  const resultado = cliDeNpm
    ? spawnSync(process.execPath, [cliDeNpm, 'run', 'build'], { stdio: 'inherit' })
    : spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true });

  return resultado.status === 0;
}

/**
 * Busca git sin depender del PATH.
 *
 * Primero se prueba el PATH, que es lo normal. Si no esta —el caso de H-011: git
 * instalado, pero visible solo desde Git Bash— se prueban las ubicaciones
 * habituales, construidas a partir de las variables del sistema para que sirvan en
 * cualquier equipo y en cualquier disco, no solo en el del autor.
 *
 * Devuelve la ruta del ejecutable, o null si no aparece por ninguna via.
 */
function buscarGit() {
  const enElPath = spawnSync('git', ['--version'], { shell: true, encoding: 'utf8' });
  if (enElPath.status === 0) return 'git';

  const candidatas = [
    process.env.ProgramFiles && join(process.env.ProgramFiles, 'Git', 'cmd', 'git.exe'),
    process.env['ProgramFiles(x86)'] &&
      join(process.env['ProgramFiles(x86)'], 'Git', 'cmd', 'git.exe'),
    process.env.LOCALAPPDATA &&
      join(process.env.LOCALAPPDATA, 'Programs', 'Git', 'cmd', 'git.exe'),
    '/usr/bin/git',
    '/usr/local/bin/git',
    '/opt/homebrew/bin/git',
  ].filter(Boolean);

  for (const ruta of candidatas) {
    if (!existsSync(ruta)) continue;
    if (spawnSync(ruta, ['--version'], { encoding: 'utf8' }).status === 0) return ruta;
  }

  return null;
}

/** Anuncia el veredicto con el mismo formato siempre, para que se lea de un vistazo. */
function veredicto(titulo, lineas, codigo) {
  const raya = '='.repeat(72);
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
}

// ---------------------------------------------------------------------------
// 1 · Guardar el estado antes de tocar nada
// ---------------------------------------------------------------------------

const antes = leerCss();

if (antes.size === 0) {
  console.log(`Aviso: ${CARPETA_CSS} no tiene archivos .css todavia.`);
}

// ---------------------------------------------------------------------------
// 2 · Construir
// ---------------------------------------------------------------------------

if (!construir()) {
  veredicto(
    'NO SE PUDO CONSTRUIR',
    [
      'La construccion fallo, asi que no hay nada que comparar.',
      'Revisa el error de arriba: es anterior a cualquier comprobacion de CSS.',
    ],
    SIN_CONSTRUIR
  );
}

// ---------------------------------------------------------------------------
// 3 · Comparar. Esta parte no necesita git.
// ---------------------------------------------------------------------------

const despues = leerCss();
const cambiados = [];

for (const [ruta, contenido] of despues) {
  const previo = antes.get(ruta);
  if (!previo || !previo.equals(contenido)) cambiados.push(ruta);
}

if (cambiados.length) {
  veredicto(
    'DESFASADO',
    [
      'El CSS versionado no correspondia a su fuente. Se acaba de reconstruir:',
      ...cambiados.map((r) => `  - ${r}`),
      '',
      'Revisa el cambio y commitealo. Si el diff sale enorme sin que hayas tocado',
      'los estilos, sospecha de los finales de linea antes que del contenido.',
    ],
    DESFASADO
  );
}

// ---------------------------------------------------------------------------
// 4 · Extra: ¿ademas esta commiteado? Para esto si hace falta git.
// ---------------------------------------------------------------------------

const git = buscarGit();

if (!git) {
  veredicto(
    'VERIFICACION PARCIAL  ***  ESTO NO ES UN EXITO  ***',
    [
      'Comprobado : el CSS corresponde a su fuente.',
      'NO comprobado: si esta commiteado. No encontre git por ninguna via.',
      '',
      'Falta la mitad de la comprobacion. No des esto por verificado.',
      'Instala git, o agregalo al PATH de este terminal, y vuelve a ejecutarlo.',
    ],
    PARCIAL
  );
}

const diff = spawnSync(git, ['diff', '--exit-code', '--', CARPETA_CSS], {
  encoding: 'utf8',
});

// Sin repositorio no hay nada con que comparar: pasa en una copia descargada como
// ZIP. No es un fallo del proyecto, pero tampoco es una verificacion completa.
const sinRepositorio =
  diff.status !== 0 && /not a git repository/i.test(`${diff.stderr ?? ''}`);

if (sinRepositorio) {
  veredicto(
    'VERIFICACION PARCIAL  ***  ESTO NO ES UN EXITO  ***',
    [
      'Comprobado : el CSS corresponde a su fuente.',
      'NO comprobado: si esta commiteado. Esta carpeta no es un repositorio git.',
      '',
      'Falta la mitad de la comprobacion. No des esto por verificado.',
    ],
    PARCIAL
  );
}

if (diff.status !== 0) {
  veredicto(
    'DESFASADO',
    [
      'El CSS corresponde a su fuente, pero difiere de lo que hay commiteado.',
      'O sea: esta bien generado y todavia sin guardar en el repositorio.',
      '',
      'Revisa `git diff static/css/` y commitea.',
    ],
    DESFASADO
  );
}

veredicto(
  'VERIFICADO',
  [
    'El CSS corresponde a su fuente y coincide con lo commiteado.',
    `git usado: ${git}`,
  ],
  VERIFICADO
);
