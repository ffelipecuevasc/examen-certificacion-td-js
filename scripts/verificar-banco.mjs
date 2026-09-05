/**
 * Corre d1/verificar-banco.sql y convierte sus filas en un fallo ruidoso.
 *
 * Por que hace falta un envoltorio:
 * La consulta devuelve cero filas cuando todo esta bien y una fila por problema
 * cuando no, pero para wrangler las dos cosas son un exito: devolver filas no es
 * un error. Sin esto, una carga con preguntas rotas terminaria con un `0` en
 * pantalla y nadie miraria la salida.
 *
 * Lo que comprueba la consulta es justo lo que el esquema NO puede exigir por su
 * cuenta: que las alternativas sean exactamente cuatro, que exista al menos una
 * correcta, que ninguna pregunta activa este sin justificacion y que ningun
 * modulo se quede sin preguntas activas. La frontera completa esta en
 * _planmaestro/90-manual/esquema-del-banco.md.
 *
 * Por que este archivo se reescribio (H-013):
 * La version anterior daba por buena cualquier salida de wrangler que se dejara
 * interpretar como JSON, y no miraba las filas por dentro. Cuando wrangler
 * fallaba —un flag mal escrito, una base sin declarar, una tabla que no existe—
 * el envoltorio no distinguia «el banco tiene problemas» de «no pude preguntarle
 * nada al banco», y anunciaba lo primero. Un guardian que grita lo mismo pase lo
 * que pase deja de leerse. De ahi las tres reglas de abajo.
 *
 *   1. Un fallo de wrangler NUNCA es un problema del banco. Sale por 2, rotulado
 *      NO SE PUDO VERIFICAR, y se muestra el comando y el texto tal cual, sin
 *      resumir. Wrangler escribe sus errores en la salida normal, no solo en la
 *      de error: hay que mirar las dos.
 *   2. La forma de la respuesta se comprueba entera antes de creersela: que sea
 *      un arreglo de bloques, que cada bloque traiga `results` como arreglo y que
 *      cada fila traiga las dos columnas que la consulta declara. Cualquier otra
 *      cosa es NO SE PUDO VERIFICAR, no un problema del banco.
 *   3. Se invoca el wrangler instalado en node_modules con el mismo node que
 *      corre este archivo, sin `shell` y sin `npx`. Sin shell no hay linea de
 *      comandos que armar ni comillas que se pierdan; sin npx no hay riesgo de
 *      que se descargue otra version si la dependencia falta.
 *
 * Codigos de salida:
 *   0  BANCO VERIFICADO      la consulta corrio y no devolvio ningun problema
 *   1  BANCO CON PROBLEMAS   la consulta corrio y devolvio problemas, listados
 *   2  NO SE PUDO VERIFICAR  no hay veredicto: nadie llego a mirar el banco
 *
 * El 2 no es un aprobado con reparos. Es la ausencia de respuesta.
 *
 * Uso: npm run datos:verificar-banco
 *      npm run datos:verificar-banco -- --remote        (lo ejecuta el autor)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_POR_OMISION = 'examen-td-js-produccion';

// Rutas ancladas al archivo, no al directorio desde el que se invoque. npm siempre
// situa el proceso en la raiz del paquete, pero este script tambien se corre a
// mano, y entonces `d1/verificar-banco.sql` dependeria de donde estuviera parado
// quien lo escribe.
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONSULTA = join(RAIZ, 'd1', 'verificar-banco.sql');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');

// Las dos columnas que declara cada SELECT de d1/verificar-banco.sql. Si un dia
// cambian ahi, tienen que cambiar aca: es la unica forma de que el envoltorio
// note que esta leyendo otra cosa, en vez de inventar un problema.
const COLUMNAS = ['comprobacion', 'detalle'];

const CUMPLE = 0;
const PROBLEMAS = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);

/** Anuncia el veredicto con el mismo formato siempre, para que se lea de un vistazo. */
const veredicto = (titulo, lineas, codigo) => {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const linea of lineas) console.log(linea);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
};

/**
 * Sale por 2 diciendo que no hubo veredicto.
 *
 * `detalle` son las lineas que explican por que. Siempre van acompanadas del
 * comando exacto: la mitad de los fallos de esta familia se ven solos al leerlo.
 */
const sinVeredicto = (motivo, detalle, comando) =>
  veredicto(
    'NO SE PUDO VERIFICAR  ***  ESTO NO ES UN APROBADO  ***',
    [
      motivo,
      '',
      'Nadie llego a mirar el banco, asi que no se sabe si cumple o no.',
      'Esto NO significa que el banco este bien, ni que este mal.',
      ...(comando ? ['', 'Comando ejecutado:', `  ${comando}`] : []),
      ...(detalle.length ? ['', ...detalle] : []),
    ],
    SIN_VEREDICTO
  );

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

// Sin argumentos se trabaja contra la base local de produccion. El entorno
// remoto lo pasa quien lo ejecute, a proposito: ver ADR-015.
//
//   npm run datos:verificar-banco
//   npm run datos:verificar-banco -- --base=examen-td-js-pruebas --remote
const argumentos = process.argv.slice(2);
const conBase = argumentos.find((a) => a.startsWith('--base='));
const base = conBase ? conBase.slice('--base='.length) : BASE_POR_OMISION;

const extra = argumentos.filter((a) => a !== conBase);
const destino = extra.some((a) => a === '--remote' || a === '--local') ? extra : ['--local', ...extra];

// ---------------------------------------------------------------------------
// El nombre de la base tiene que estar declarado en wrangler.toml (H-015)
//
// En remoto, wrangler NO usa wrangler.toml como limite: si el nombre no esta ahi,
// lo busca en la cuenta y lo encuentra igual. O sea que el archivo no acota nada y
// lo unico que decide contra que base se escribe es lo que se teclea. Una errata en
// el nombre no rebota contra nada.
//
// Aca se le devuelve ese papel de limite, al menos en los caminos que pasan por el
// proyecto: solo se aceptan los `database_name` declarados. Se lee con una
// expresion regular en vez de un analizador de TOML porque una dependencia nueva
// necesita ADR, y lo que hay que reconocer es una linea de forma fija.
//
// La salida explicita es PERMITIR_BASE_NO_DECLARADA=1, y su caso de uso legitimo
// esta escrito en 90-manual/esquema-del-banco.md: provocar el veredicto
// NO SE PUDO VERIFICAR con un nombre que no existe en la cuenta.
// ---------------------------------------------------------------------------

const CONFIGURACION = join(RAIZ, 'wrangler.toml');

if (process.env.PERMITIR_BASE_NO_DECLARADA !== '1') {
  let declaradas = [];

  try {
    declaradas = [...readFileSync(CONFIGURACION, 'utf8').matchAll(/^\s*database_name\s*=\s*"([^"]+)"/gm)].map(
      (m) => m[1]
    );
  } catch (error) {
    sinVeredicto(`No pude leer ${CONFIGURACION} para comprobar el nombre de la base: ${error.message}`, [], null);
  }

  if (declaradas.length === 0) {
    sinVeredicto(
      `No encontre ningun \`database_name\` en ${CONFIGURACION}.`,
      ['Sin esa lista no puedo comprobar que la base pedida sea una de las del proyecto.'],
      null
    );
  }

  if (!declaradas.includes(base)) {
    veredicto(
      'BASE NO DECLARADA  ***  H-015  ***',
      [
        `Pediste la base «${base}», que no esta declarada en wrangler.toml.`,
        '',
        `Declaradas: ${declaradas.join(', ')}`,
        '',
        'Wrangler la aceptaria igual en remoto —busca el nombre en la cuenta— y por',
        'eso este envoltorio se planta antes: una errata en el nombre no rebota',
        'contra ninguna otra cosa. Ver H-015.',
        '',
        'Si el nombre es el que querias y sabes lo que haces:',
        '',
        '  PowerShell:  $env:PERMITIR_BASE_NO_DECLARADA=1',
        '  Git Bash:    PERMITIR_BASE_NO_DECLARADA=1 npm run ...',
        '',
        'No se comprobo nada del banco.',
      ],
      SIN_VEREDICTO
    );
  }
}

// Capa 3 de la barrera de ADR-015 (H-014): este envoltorio es el camino
// documentado hacia la nube, asi que es por donde se cometen los errores normales.
// Se niega salvo que quien lo corre lo pida a proposito con una variable, que es
// justo lo que un andamiaje equivocado no hace.
if (destino.includes('--remote') && process.env.PERMITIR_REMOTO !== '1') {
  veredicto(
    'ME NIEGO A CORRER ESTO  ***  ADR-015  ***',
    [
      'Pediste --remote, que habla con la cuenta de Cloudflare.',
      '',
      'Claude Code no ejecuta wrangler contra la cuenta: los comandos remotos los',
      'escribe, y los ejecuta el autor en su terminal. Ver ADR-015 y H-014.',
      '',
      'Si eres el autor y esto es tu terminal, vuelve a lanzarlo asi:',
      '',
      '  PowerShell:  $env:PERMITIR_REMOTO=1; npm run datos:verificar-banco -- --remote',
      '  Git Bash:    PERMITIR_REMOTO=1 npm run datos:verificar-banco -- --remote',
      '',
      'No se comprobo nada del banco.',
    ],
    SIN_VEREDICTO
  );
}

// La consulta se envia como texto con `--command`, no con `--file`.
//
// No es un detalle de estilo. Contra una base remota, `wrangler d1 execute --file=`
// sube el archivo por el extremo de IMPORTACION —el camino de escritura— y wrangler
// avisa de que la base puede quedar sin servir consultas mientras dura. Para una
// consulta que solo lee, eso es tomar la puerta equivocada. `--command` va por el
// extremo de consulta. Se descubrio al reconstruir el incidente de H-014, cuyo
// registro muestra dos POST contra `/import` para ejecutar un unico SELECT.
//
// Los argumentos viajan como arreglo y sin shell, asi que el texto de la consulta
// —con sus saltos de linea y sus comillas— llega intacto.
let consulta;

try {
  consulta = readFileSync(CONSULTA, 'utf8');
} catch (error) {
  sinVeredicto(`No pude leer la consulta en ${CONSULTA}: ${error.message}`, [], null);
}

const parametros = ['d1', 'execute', base, ...destino, '--json', `--command=${consulta}`];

// Solo para mostrarlo cuando algo falle. No se ejecuta: los argumentos van como
// arreglo, nunca como texto. La consulta entera se resume: son dos mil caracteres
// que taparian el resto, y lo que hay que poder leer de un vistazo son los flags.
const comando = [process.execPath, WRANGLER, ...parametros]
  .map((t) => (t.startsWith('--command=') ? `--command=<${CONSULTA}>` : t))
  .map((t) => (/\s/.test(t) ? `"${t}"` : t))
  .join(' ');

// ---------------------------------------------------------------------------
// Ejecucion
// ---------------------------------------------------------------------------

if (!existsSync(CONSULTA)) {
  sinVeredicto(`No encontre la consulta en ${CONSULTA}.`, [], null);
}

if (!existsSync(WRANGLER)) {
  sinVeredicto(
    'No encontre wrangler en node_modules.',
    ['Corre `npm install` en la raiz del proyecto y vuelve a intentarlo.'],
    null
  );
}

// Sin `shell`. Los argumentos viajan como arreglo hasta el proceso hijo, sin pasar
// por cmd.exe: no hay concatenacion, ni comillas, ni escapes que perder.
const resultado = spawnSync(process.execPath, [WRANGLER, ...parametros], { encoding: 'utf8' });

const salida = `${resultado.stdout ?? ''}`;
const errores = `${resultado.stderr ?? ''}`;

/**
 * Lo que wrangler haya dicho, por donde sea que lo haya dicho.
 *
 * El orden importa. Cuando wrangler rechaza un argumento escribe el motivo en la
 * salida de error y vuelca la pantalla de ayuda entera en la salida normal: si se
 * imprimen en ese orden, la unica linea que explica el fallo queda sepultada bajo
 * cuarenta de ayuda. Por eso el motivo va primero y cada bloque va recortado.
 */
const loQueDijo = () => {
  const TOPE = 24;

  const sangrar = (etiqueta, texto) => {
    if (!texto.trim()) return [];

    // Los codigos de color de la consola sobran en un informe y estorban al leerlo.
    const limpio = texto.replace(/\u001b\[[0-9;]*m/g, '').trimEnd().split('\n');
    const visibles = limpio.slice(0, TOPE).map((l) => `  ${l}`);
    const sobran = limpio.length - TOPE;

    return [etiqueta, ...visibles, ...(sobran > 0 ? [`  (... ${sobran} lineas mas)`] : [])];
  };

  const partes = [...sangrar('Lo que fallo, segun wrangler:', errores), ...sangrar('Salida de wrangler:', salida)];

  return partes.length ? partes : ['wrangler no dijo nada por ninguna de las dos salidas.'];
};

if (resultado.error) {
  sinVeredicto(`No pude lanzar wrangler: ${resultado.error.message}`, loQueDijo(), comando);
}

if (resultado.status !== 0) {
  sinVeredicto(
    `wrangler termino con el codigo ${resultado.status}, asi que no completo la consulta.`,
    loQueDijo(),
    comando
  );
}

// ---------------------------------------------------------------------------
// Lectura de la respuesta
//
// Wrangler antepone texto a su JSON segun el caso, asi que hay que localizarlo.
// Buscar el primer `[` que aparezca en cualquier parte del texto es lo que hacia
// la version vieja, y era justo el error: en una pantalla de ayuda el primer
// corchete esta dentro de `[string]`. El JSON de wrangler empieza en columna
// cero, y por eso se busca por linea.
// ---------------------------------------------------------------------------

const lineas = salida.split('\n');
const primera = lineas.findIndex((l) => l === '[' || l === '{' || /^[[{]["{[]/.test(l));

if (primera === -1) {
  sinVeredicto('La salida de wrangler no contiene ninguna respuesta en JSON.', loQueDijo(), comando);
}

let documento;
try {
  documento = JSON.parse(lineas.slice(primera).join('\n'));
} catch (error) {
  sinVeredicto(
    'La respuesta de wrangler no se pudo interpretar como JSON.',
    [error.message, '', ...loQueDijo()],
    comando
  );
}

// Un fallo de D1 llega como objeto con `error`, no como arreglo. Es un fallo de la
// consulta, no del banco.
if (!Array.isArray(documento) && documento !== null && typeof documento === 'object' && documento.error) {
  const texto = documento.error.text ?? JSON.stringify(documento.error);
  sinVeredicto(`D1 rechazo la consulta: ${texto}`, [], comando);
}

if (!Array.isArray(documento)) {
  sinVeredicto(
    'Esperaba un arreglo de resultados y wrangler devolvio otra cosa.',
    [`Recibi: ${documento === null ? 'null' : typeof documento}`, '', ...loQueDijo()],
    comando
  );
}

if (documento.length === 0) {
  sinVeredicto('wrangler devolvio un arreglo vacio: la consulta no llego a ejecutarse.', loQueDijo(), comando);
}

// ---------------------------------------------------------------------------
// Comprobacion de la forma, bloque por bloque y fila por fila
//
// Esto es el corazon del arreglo de H-013. Una fila que no traiga las columnas
// esperadas no es un problema del banco: es una respuesta que no entiendo, y
// entonces no tengo veredicto. La version vieja la imprimia como problema, con
// los dos campos en `undefined`, que es exactamente un problema que no se puede
// describir.
// ---------------------------------------------------------------------------

const filas = [];

for (const [indice, bloque] of documento.entries()) {
  const donde = `bloque ${indice + 1} de ${documento.length}`;

  if (bloque === null || typeof bloque !== 'object' || Array.isArray(bloque)) {
    sinVeredicto(`El ${donde} de la respuesta no es un objeto.`, loQueDijo(), comando);
  }

  if (bloque.error) {
    const texto = bloque.error.text ?? JSON.stringify(bloque.error);
    sinVeredicto(`D1 rechazo la consulta en el ${donde}: ${texto}`, [], comando);
  }

  if (bloque.success === false) {
    sinVeredicto(`D1 marco el ${donde} como fallido.`, loQueDijo(), comando);
  }

  if (!Array.isArray(bloque.results)) {
    sinVeredicto(
      `El ${donde} no trae sus filas en \`results\` como arreglo.`,
      [
        `\`results\` es: ${bloque.results === undefined ? 'no viene' : typeof bloque.results}`,
        '',
        ...loQueDijo(),
      ],
      comando
    );
  }

  for (const fila of bloque.results) {
    if (fila === null || typeof fila !== 'object' || Array.isArray(fila)) {
      sinVeredicto(`Una fila del ${donde} no es un objeto.`, loQueDijo(), comando);
    }

    const faltantes = COLUMNAS.filter((c) => typeof fila[c] !== 'string');

    if (faltantes.length) {
      sinVeredicto(
        `Una fila del ${donde} no trae las columnas que declara la consulta.`,
        [
          `Faltan, o no son texto: ${faltantes.join(', ')}`,
          `La fila trae: ${Object.keys(fila).join(', ') || '(ninguna columna)'}`,
          '',
          'Si d1/verificar-banco.sql cambio de columnas, hay que cambiar tambien',
          'la lista COLUMNAS en la cabecera de este archivo.',
        ],
        comando
      );
    }

    filas.push(fila);
  }
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

if (filas.length === 0) {
  veredicto(
    'BANCO VERIFICADO',
    [
      'Todas las preguntas tienen cuatro alternativas y una correcta.',
      'Ninguna pregunta activa esta sin justificacion.',
      'Ningun modulo se quedo sin preguntas activas.',
      '',
      'Recuerda que esto NO comprueba lo que ya garantiza el esquema: eso la',
      'base lo impide sola, en cada insercion.',
    ],
    CUMPLE
  );
}

veredicto(
  `BANCO CON PROBLEMAS  ***  ${filas.length} ***`,
  filas.map((f) => `  ${f.comprobacion} -> ${f.detalle}`),
  PROBLEMAS
);
