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

const archivos = readdirSync(ORIGEN)
  .filter((f) => f.endsWith('.svg'))
  .sort();

const reglas = archivos.map((archivo) => {
  const nombre = archivo.replace(/\.svg$/, '');
  const uri = aDataUri(readFileSync(join(ORIGEN, archivo), 'utf8'));
  return `.i-${nombre}{--icon:url("${uri}")}`;
});

const cabecera = `/* Generado por scripts/build-icons.mjs. No editar a mano. */\n`;

mkdirSync('static/css', { recursive: true });
writeFileSync(DESTINO, cabecera + reglas.join('\n') + '\n', 'utf8');

console.log(`${archivos.length} iconos escritos en ${DESTINO}`);
