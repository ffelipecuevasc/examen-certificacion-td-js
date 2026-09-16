/**
 * Genera static/css/icons.css a partir de los SVG de static/resources/.
 *
 * Por que existe este script:
 * Las mascaras CSS que apuntan a un archivo .svg externo no siempre se cargan
 * (el navegador las trata como recurso de otro origen al abrir el sitio con
 * file://, y quedan vacias). Incrustando cada SVG como data URI, el icono
 * viaja dentro del CSS y se muestra siempre, sin peticiones adicionales.
 *
 * Ademas normaliza fill="currentColor" a negro: en una mascara solo importa
 * el canal alfa, y el color visible lo aporta background-color en la clase .icon.
 *
 * Uso: npm run icons
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ORIGEN = 'static/resources';
const DESTINO = 'static/css/icons.css';

/**
 * SVG que viven en static/resources/ pero NO son iconos del sistema de iconos.
 *
 * POR QUE HACE FALTA UNA LISTA ASI
 *
 * Este generador convierte cada SVG en una **mascara CSS**, y una mascara
 * conserva UNICAMENTE la forma: se queda con el canal alfa y el color lo pone
 * despues `background-color` desde la clase `.icon`. Para los iconos del sitio eso
 * es exactamente lo que se quiere —heredan el color del texto—, pero para un SVG
 * que trae algo mas que forma es una perdida silenciosa.
 *
 * `alert-loop.svg` trae dos animaciones SMIL dentro (`<animate>`): el trazado
 * inicial del triangulo y el pulso indefinido del signo de exclamacion. Convertido
 * en mascara **las pierde las dos**, y pierde tambien su color. La clase
 * `.i-alert-loop` que salia de aqui era, por lo tanto, una trampa: un triangulo
 * quieto con el nombre del icono animado, esperando a que alguien lo usara creyendo
 * que era el otro. Nadie la usaba, y aun asi se generaba en cada `npm run icons`.
 *
 * Ese archivo se usa como imagen —`<img src="static/resources/alert-loop.svg">` en
 * el aviso de programacion de components/modules.js—, que es la unica forma de que
 * sus animaciones lleguen al estudiante.
 *
 * COMO SE AGREGA UNO NUEVO: si mañana entra otro SVG que haya que servir como
 * imagen —porque anima, porque trae varios colores, o porque es un logotipo—, se
 * escribe aqui su nombre de archivo y se dice por que. La regla es: si el SVG
 * pierde algo al quedarse solo con su silueta, no es un icono de este sistema.
 */
const NO_SON_ICONOS = new Set(['alert-loop.svg']);

/** Comprime el SVG y lo deja listo para incrustarse en una url(). */
function aDataUri(svg) {
  const limpio = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .replace(/currentColor/g, '#000')
    .trim();

  const codificado = encodeURIComponent(limpio)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${codificado}`;
}

const todos = readdirSync(ORIGEN)
  .filter((f) => f.endsWith('.svg'))
  .sort();

const archivos = todos.filter((f) => !NO_SON_ICONOS.has(f));
const excluidos = todos.filter((f) => NO_SON_ICONOS.has(f));

const reglas = archivos.map((archivo) => {
  const nombre = archivo.replace(/\.svg$/, '');
  const uri = aDataUri(readFileSync(join(ORIGEN, archivo), 'utf8'));
  return `.i-${nombre}{--icon:url("${uri}")}`;
});

const cabecera = `/* Generado por scripts/build-icons.mjs. No editar a mano. */\n`;

mkdirSync('static/css', { recursive: true });
writeFileSync(DESTINO, cabecera + reglas.join('\n') + '\n', 'utf8');

console.log(`${archivos.length} iconos escritos en ${DESTINO}`);

// Los excluidos se nombran en voz alta. Una exclusion callada es indistinguible de
// un archivo que el generador no vio, y la diferencia importa el dia que alguien
// busque por que su icono nuevo no aparece.
if (excluidos.length) {
  console.log(
    `${excluidos.length} excluido(s) por no ser iconos de mascara: ${excluidos.join(', ')}`
  );
  console.log('Se sirven como imagen. Ver NO_SON_ICONOS en este archivo.');
}
