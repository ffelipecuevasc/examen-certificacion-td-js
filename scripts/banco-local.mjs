/**
 * Deja la base LOCAL con el banco real, volcando el respaldo versionado.
 *
 *   npm run datos:banco-local
 *
 * POR QUE EXISTE
 *
 * `d1/respaldo-banco.sql` es un volcado completo: trae `CREATE TABLE` sin
 * `IF NOT EXISTS`, asi que sobre una base que ya tiene tablas se cae con
 * «table migracion already exists». Hay que vaciar primero, y vaciar son cuatro
 * DROP que no caben dentro de un `--file`.
 *
 * Se escribio como guion y no como dos comandos encadenados en `package.json`
 * por una razon practica: los DROP llevan comillas dentro de comillas dentro de
 * JSON, y una linea asi se copia mal. Aqui se leen.
 *
 * PARA QUE SIRVE TENER EL BANCO REAL EN LOCAL
 *
 * Para que `npm run verificar` compruebe el escapado a escala (ADR-024) y no
 * sobre las diez preguntas de juguete. Con el banco de juguete esa comprobacion
 * da verde revisando 10 filas, que es el patron de H-023.
 *
 * BARRERA DE ADR-015 (ADR-027)
 *
 * Este guion llama a wrangler, asi que le toca barrera. La suya es de otra clase
 * que la de los demas: no comprueba un terminal ni una variable de entorno, sino
 * que **no hay forma de pedirle la nube**. La bandera de base local esta escrita
 * aqui dentro, no llega por argumento, y el guion se niega a correr si recibe
 * cualquier argumento. Una barrera que no se puede rodear no necesita
 * comprobarse en cada arranque: se comprueba mirando estas veinte lineas.
 *
 * Codigos de salida:
 *   0  el banco real quedo en la base local
 *   1  algo fallo
 *   2  se le pasaron argumentos, que es justamente lo que no acepta
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RESPALDO = join(RAIZ, 'd1', 'respaldo-banco.sql');
const WRANGLER = join(RAIZ, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
const BASE = 'examen-td-js-produccion';
const SOLO_LOCAL = '--local';

if (process.argv.length > 2) {
  console.error(
    '\nEste guion no acepta argumentos, a proposito.\n\n' +
      'Si aceptara alguno, alguien podria pasarle una bandera que apunte a la nube y\n' +
      'volcar el respaldo sobre produccion. No hay forma de pedirle otra base que la\n' +
      'local (ADR-015).\n'
  );
  process.exit(2);
}

if (!existsSync(RESPALDO)) {
  console.error('\nNo existe d1/respaldo-banco.sql, que es lo unico que este guion vuelca.\n');
  process.exit(1);
}

/** Corre wrangler con la bandera de base local puesta aqui, nunca recibida. */
function wrangler(...argumentos) {
  // Se llama al wrangler.js con node y no a `npx`, porque en Windows Node se
  // niega a lanzar un `.cmd` sin `shell: true` (EINVAL), y `shell: true` volveria
  // a meter las comillas de los DROP por el interprete del sistema.
  return spawnSync(
    process.execPath,
    [WRANGLER, 'd1', 'execute', BASE, SOLO_LOCAL, ...argumentos],
    { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', cwd: RAIZ }
  );
}

/**
 * Que hay que borrar antes de volcar, deducido DEL PROPIO RESPALDO.
 *
 * No es una lista escrita a mano, a proposito. Una lista a mano se queda corta
 * en cuanto una migracion agrega una tabla o una vista: el volcado la creara y
 * el borrado no la habra quitado, y el error aparecera recien ahi. Leyendo los
 * `CREATE` del respaldo se borra exactamente lo que el respaldo va a crear,
 * cualquiera que sea.
 *
 * Ya paso una vez, mientras se escribia este guion: la lista decia cuatro tablas
 * y el respaldo tambien creaba la vista `pregunta_activa` y tres indices.
 *
 * El orden importa: se borra en orden inverso al de creacion, porque las vistas
 * y los indices cuelgan de las tablas.
 */
function queCreaElRespaldo(sql) {
  const objetos = [];
  const patron =
    /^CREATE\s+(?:UNIQUE\s+)?(TABLE|VIEW|INDEX|TRIGGER)\s+(?:IF NOT EXISTS\s+)?([A-Za-z_][A-Za-z0-9_]*)/i;

  for (const linea of sql.split('\n')) {
    const encaje = patron.exec(linea);
    if (encaje) objetos.push({ clase: encaje[1].toUpperCase(), nombre: encaje[2] });
  }

  return objetos.reverse();
}

const sqlDelRespaldo = readFileSync(RESPALDO, 'utf8');
const aBorrar = queCreaElRespaldo(sqlDelRespaldo);

if (aBorrar.length === 0) {
  console.error('\nEl respaldo no trae ni un CREATE. O no es un respaldo, o su formato cambio.\n');
  process.exit(1);
}

console.log(`\nVaciando la base local: ${aBorrar.length} objetos que el respaldo va a recrear.`);
const vaciado = wrangler(
  `--command=${aBorrar.map((o) => `DROP ${o.clase} IF EXISTS ${o.nombre};`).join(' ')}`
);

if (vaciado.status !== 0) {
  console.error(`\nNo se pudo vaciar la base local.\n${vaciado.stderr ?? ''}`);
  process.exit(1);
}

console.log('Volcando d1/respaldo-banco.sql…');
const volcado = wrangler('--file=d1/respaldo-banco.sql');

if (volcado.status !== 0) {
  console.error(`\nNo se pudo volcar el respaldo.\n${volcado.stderr ?? ''}`);
  process.exit(1);
}

const cuenta = wrangler('--command=SELECT COUNT(*) AS n FROM pregunta;', '--json');
const numero = /"n"\s*:\s*(\d+)/.exec(cuenta.stdout ?? '')?.[1] ?? '?';

console.log(
  `\nLa base LOCAL tiene ahora ${numero} preguntas, del respaldo versionado.\n\n` +
    'Esto NO toco la nube: la bandera de base local esta escrita dentro del guion.\n' +
    'Para volver al banco de juguete: `npm run datos:migrar`, `datos:migrar-002` y\n' +
    '`npm run datos:ejemplo`.\n'
);
