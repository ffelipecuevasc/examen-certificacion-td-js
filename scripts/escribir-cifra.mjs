/**
 * Deja la portada diciendo la cifra de preguntas que trae la instantanea versionada.
 *
 *   npm run datos:cifra                          escribe en index.html
 *   npm run datos:cifra -- --ensayo              dice que haria y NO escribe nada
 *   npm run datos:cifra -- --portada=<ruta>      trabaja sobre otro archivo
 *   npm run datos:cifra -- --instantanea=<ruta>  lee de otra instantanea
 *
 * QUE HACE, Y QUE NO
 *
 * **Lee** `static/js/data/instantanea-banco.js` y **escribe** el numero en las
 * cifras de `index.html` marcadas con `data-cifra-banco`. No consulta D1, no
 * necesita red ni credenciales, y **no regenera la instantanea**: la lee tal como
 * esta versionada.
 *
 * QUIEN LO LLAMA SOLO
 *
 * Normalmente nadie lo escribe a mano. Lo llaman, en el mismo acto en que la
 * instantanea cambia:
 *
 *   scripts/publicar-banco.mjs       el paso unico de ADR-023
 *   scripts/generar-instantanea.mjs  cuando escribe la instantanea canonica
 *
 * Existe suelto para dos casos: reparar la portada si alguien la edito a mano, y
 * poder demostrar la reescritura sobre copias temporales sin tocar nada versionado.
 * Para eso estan `--portada=` y `--instantanea=`: con los dos se puede provocar
 * que una instantanea distinta produzca una cifra distinta, que es como se
 * comprueba que la cifra SIGUE al banco en vez de estar escrita al lado. La
 * iteracion 36 lo exige, y prohibe expresamente demostrarlo tocando los archivos
 * versionados.
 *
 * Codigos de salida:
 *   0  HECHO            la portada quedo diciendo la cifra (o ya la decia)
 *   1  NO SE ESCRIBIO   falta la marca, o la portada no se deja escribir
 *   2  SIN VEREDICTO    no se pudo leer la instantanea
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  INSTANTANEA,
  PORTADA,
  RAIZ,
  cifraDeLaInstantanea,
  cifrasEnHtml,
  escribirCifraEnPortada,
  formasReconocidas,
} from './cifra-portada.mjs';

const HECHO = 0;
const NO_ESCRITA = 1;
const SIN_VEREDICTO = 2;

const raya = '='.repeat(72);

function veredicto(titulo, lineas, codigo) {
  console.log(`\n${raya}\n${titulo}\n${raya}`);
  for (const l of lineas) console.log(l);
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
}

const argumentos = process.argv.slice(2);
const ensayo = argumentos.includes('--ensayo');
const conPortada = argumentos.find((a) => a.startsWith('--portada='));
const portada = conPortada ? conPortada.slice('--portada='.length) : PORTADA;

const conInstantanea = argumentos.find((a) => a.startsWith('--instantanea='));
const instantanea = conInstantanea ? resolve(conInstantanea.slice('--instantanea='.length)) : INSTANTANEA;

const { cifra, sello, error } = await cifraDeLaInstantanea(instantanea);

if (error) {
  veredicto(
    'SIN VEREDICTO  ***  ESTO NO ES UN APROBADO  ***',
    [error, '', 'Sin instantanea no hay cifra que escribir. La portada queda como estaba.'],
    SIN_VEREDICTO
  );
}

const relativa = portada.startsWith(RAIZ) ? portada.replace(RAIZ, '.').replace(/\\/g, '/') : portada;

/**
 * El ensayo mira y cuenta, y no llama a la funcion que escribe.
 *
 * No es «escribir y deshacer»: es no escribir. Un ensayo que escribiera y
 * restaurara dejaria una ventana en la que el archivo versionado esta cambiado, y
 * si el proceso muere ahi dentro, cambiado se queda.
 */
function ensayar(archivo, valor) {
  if (!existsSync(archivo)) {
    return { ok: false, motivo: `No existe ${archivo.replace(RAIZ, '.')}.` };
  }

  const marcadas = cifrasEnHtml(readFileSync(archivo, 'utf8'));

  if (marcadas.length === 0) {
    return { ok: false, motivo: 'No encontre ninguna cifra marcada con data-cifra-banco.' };
  }

  const cambiadas = marcadas.filter((m) => m.valor !== valor);
  return { ok: true, marcadas, cambiadas, cambio: cambiadas.length > 0 };
}

const resultado = ensayo ? ensayar(portada, cifra) : escribirCifraEnPortada(cifra, portada);

if (!resultado.ok) {
  veredicto(
    'NO SE ESCRIBIO  ***  la portada no tiene donde recibir la cifra  ***',
    [resultado.motivo, '', 'Formas reconocidas:', ...formasReconocidas().map((f) => `  ${f}`)],
    NO_ESCRITA
  );
}

const titulo = ensayo
  ? resultado.cambio
    ? 'ENSAYO  ***  habria reescrito la portada. NO SE ESCRIBIO NADA  ***'
    : 'ENSAYO  ***  ya estaba al dia. NO SE ESCRIBIO NADA  ***'
  : resultado.cambio
    ? 'HECHO  ***  la portada quedo al dia  ***'
    : 'HECHO  ***  ya estaba al dia  ***';

veredicto(
  titulo,
  [
    `Portada      ${relativa}`,
    `Instantanea  ${instantanea.replace(RAIZ, '.').replace(/\\/g, '/')}`,
    `             ${cifra} preguntas${sello ? ` · sello «${sello.entorno}» · ${sello.generada_en}` : ''}`,
    '',
    ...(resultado.cambiadas.length
      ? [
          `Cifras ${ensayo ? 'que se reescribirian' : 'reescritas'}: ${resultado.cambiadas.length}`,
          ...resultado.cambiadas.map((m) => `  linea ${m.linea} (${m.forma}): ${m.valor} -> ${cifra}`),
        ]
      : [`Las ${resultado.marcadas.length} cifras marcadas ya decian ${cifra}. No se toco el archivo.`]),
  ],
  HECHO
);
