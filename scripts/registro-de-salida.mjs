/**
 * `--registro=<archivo>`: que la salida la escriba el guion y no el terminal.
 *
 * POR QUE EXISTE ESTO (H-026)
 *
 * Redirigir con `>` depende del terminal, y el terminal no es del proyecto. En
 * Git Bash sobre Windows, un `node` lanzado a traves de winpty —el envoltorio que
 * hace que los programas interactivos se vean bien— se NIEGA a correr si su
 * salida no va a un terminal: responde «stdout is not a tty», codigo 1, y no
 * ejecuta nada. El archivo queda con una sola linea.
 *
 * Lo peligroso no es la molestia: es que el fallo es ruidoso en pantalla y
 * SILENCIOSO en el archivo. Quien lo abra despues puede leer esa unica linea
 * como «corrio y dijo poco».
 *
 * Es el mismo filo de H-011 —el mismo comando se comporta distinto segun desde
 * que terminal se lance— y la respuesta es la misma que se dio alli: el guion no
 * puede depender de como lo invocaron. Guardar la evidencia de una carga o de una
 * instantanea es medio proyecto, asi que la guarda el guion.
 *
 * EL REGISTRO TIENE PRINCIPIO Y FIN, A PROPOSITO
 *
 * Empieza con una cabecera —sello y argumentos— y termina con una linea de cierre
 * que nombra el veredicto y el codigo. **Un registro sin esa linea final esta
 * truncado**, y eso se ve al abrirlo. Es lo unico que distingue «termino» de «el
 * proceso murio a la mitad», que desde el archivo se ven igual.
 *
 * Y si el guion no llega a arrancar, el archivo NO existe, que es un fallo mucho
 * mas ruidoso que un archivo con una linea.
 */
import { appendFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Abre el registro si los argumentos lo piden, y desvia `console.log` hacia el.
 *
 * @param {string[]} argumentos   process.argv.slice(2)
 * @param {(mensaje: string, ruta: string) => never} alNoPoderAbrir
 *   Que hacer si el archivo no se puede escribir. Lo decide cada guion, porque
 *   cada uno tiene su vocabulario de veredictos. NO debe volver: quien pidio
 *   registro lo pidio para tener evidencia, y hacer el trabajo sin la evidencia
 *   que se pidio es peor que no hacerlo.
 * @returns {(titulo: string, codigo: number) => void} la funcion que lo cierra.
 */
export function abrirRegistro(argumentos, alNoPoderAbrir) {
  const conRegistro = argumentos.find((a) => a.startsWith('--registro='));

  if (!conRegistro) return () => {};

  const pedida = conRegistro.slice('--registro='.length);
  const ruta = resolve(process.cwd(), pedida);

  const cabecera = [
    '# Registro de una corrida del proyecto',
    `# ${new Date().toISOString()}`,
    `# argumentos: ${argumentos.join(' ')}`,
    '',
  ].join('\n');

  try {
    writeFileSync(ruta, `${cabecera}\n`, 'utf8');
  } catch (error) {
    alNoPoderAbrir(`No pude escribir «${pedida}»: ${error.message}`, ruta);
    // Si alNoPoderAbrir volviera, se para igual: seguir seria hacer el trabajo
    // sin el registro que se pidio.
    process.exit(1);
  }

  const original = console.log;
  let perdidas = 0;

  console.log = (...partes) => {
    const texto = partes.join(' ');
    original(texto);
    try {
      appendFileSync(ruta, `${texto}\n`, 'utf8');
    } catch {
      perdidas += 1;
    }
  };

  return (titulo, codigo) => {
    const aviso = perdidas
      ? `\n# ATENCION: ${perdidas} linea(s) no se pudieron escribir en este registro.\n`
      : '';
    // Del titulo se queda con la parte antes de los asteriscos: los adornos
    // sirven en pantalla y estorban en una linea que se va a buscar con grep.
    const limpio = String(titulo).split('***')[0].trim();

    try {
      appendFileSync(ruta, `${aviso}# fin del registro · ${limpio} · codigo ${codigo}\n`, 'utf8');
    } catch {
      original('\nAVISO: no pude cerrar el registro. Puede haber quedado incompleto.');
    }
  };
}
