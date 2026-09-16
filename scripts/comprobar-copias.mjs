/**
 * Guardian de las tres copias del encabezado, el pie y el favicon (iteracion 41,
 * decision 8).
 *
 * POR QUE EXISTE
 *
 * El sitio no tiene plantillas: es HTML escrito a mano, sin bundler y sin motor de
 * componentes (ADR del stack, en CLAUDE.md). Con dos paginas eso se sostenia
 * mirando. Con la tercera deja de sostenerse, y el fallo que produce es el peor de
 * todos: **silencioso**. Nadie ve que el pie de una pagina quedo con un enlace
 * viejo hasta que alguien lo pulsa, porque ninguna prueba tiene el deber de
 * mirarlo. Es exactamente lo que le paso a la cifra de la portada antes de que la
 * iteracion 36 pusiera a `comprobar-cifra.mjs` a vigilarla.
 *
 * QUE COMPARA, Y CONTRA QUE
 *
 * Tres bloques de cada pagina, tal como estan escritos en el archivo:
 *
 *   favicon     la linea <link rel="icon" ...>
 *   encabezado  todo lo que hay entre <header ...> y </header>
 *   pie         todo lo que hay entre <footer ...> y </footer>
 *
 * No hay una copia «maestra»: se comparan **todas contra todas**. Una maestra
 * obligaria a elegir cual de las tres manda, y la respuesta correcta es que ninguna
 * manda: las tres tienen que decir lo mismo.
 *
 * LAS DIFERENCIAS PERMITIDAS, QUE VIVEN AQUI Y EN NINGUN OTRO SITIO
 *
 * La decision 8 las enumera y esta comprobacion las aplica antes de comparar. Cada
 * una se normaliza a una forma canonica, de modo que las tres copias terminan
 * escritas igual si la unica diferencia entre ellas era una de estas cuatro:
 *
 *   1. EL DESTINO DEL LOGOTIPO Y DE LOS ENLACES. En la portada las secciones son
 *      anclas (`#mapa`); desde las otras dos paginas hay que salir a la portada
 *      primero (`index.html#mapa`). Y `index.html` a secas es el mismo sitio que
 *      `#inicio`. Se normaliza todo a `index.html#ancla`.
 *
 *   2. LA MARCA DE LA PAGINA ACTIVA. El enlace de la pagina en la que uno esta se
 *      pinta distinto: `active text-paper` en el menu grande y `text-jsyellow` en
 *      el de telefono, frente al `hover:text-paper` de los demas. Se normaliza
 *      quitando esos tres tokens, y SOLO de las clases `nav-link` y `mobile-link`:
 *      en cualquier otro elemento del encabezado o del pie, un `text-paper` que
 *      sobre o que falte sigue siendo un rojo.
 *
 *   3. LOS COMENTARIOS. Cada pagina explica lo suyo, y el simulacro ademas explica
 *      por que lleva copia. Se quitan antes de comparar.
 *
 *   4. EL NODO `#estado-datos` DEL CUESTIONARIO. Es donde
 *      components/estado-datos.js escribe de donde vienen las preguntas, y solo
 *      existe en la pagina que las pide. Se quita entero, con su etiqueta.
 *
 * Y una quinta que no es una decision sino una precaucion: **el espacio en blanco
 * se colapsa**. Reindentar un bloque no cambia lo que la pagina dice, y un rojo por
 * un espacio de mas ensena a ignorar esta comprobacion, que es el efecto de H-013.
 *
 * LO QUE ESTO NO PRUEBA. Que las tres copias se VEAN iguales: eso depende del CSS
 * compilado y del navegador, y lo comprueba el autor abriendo las tres paginas.
 * Aqui se compara el marcado, que es la mitad que se puede comprobar sin navegador
 * y la unica que se desfasa sola.
 *
 * Codigos de salida:
 *   0  COPIAS IGUALES    las tres dicen lo mismo, salvo lo permitido
 *   1  COPIAS DISTINTAS  alguna difiere en algo que no esta permitido
 *   2  NO SE PUDO COMPARAR  falta una pagina, o no trae alguno de los bloques
 *
 * Uso: node scripts/comprobar-copias.mjs   (o `npm run verificar:copias`)
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');

const IGUALES = 0;
const DISTINTAS = 1;
const SIN_VEREDICTO = 2;

const LINEA = '='.repeat(72);

/** Las tres paginas del sitio. Si aparece una cuarta, va aqui y nada mas. */
const PAGINAS = ['index.html', 'cuestionario.html', 'simulacro.html'];

// ---------------------------------------------------------------------------
// Sacar los bloques
// ---------------------------------------------------------------------------

/**
 * Los tres bloques comparables de una pagina.
 *
 * Se recortan con expresiones regulares y se dice: no se analiza el HTML, se mira.
 * Alcanza porque las tres paginas tienen **un solo** `<header>` y **un solo**
 * `<footer>`, y eso mismo se comprueba mas abajo: si algun dia hubiera dos, el
 * recorte dejaria de significar lo que dice y la comprobacion avisa en vez de
 * comparar cualquier cosa.
 */
function bloquesDe(html) {
  const encabezados = [...html.matchAll(/<header\b[\s\S]*?<\/header>/g)].map((m) => m[0]);
  const pies = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map((m) => m[0]);
  const favicons = [...html.matchAll(/<link\s+rel="icon"[^>]*>/g)].map((m) => m[0]);

  return { encabezados, pies, favicons };
}

// ---------------------------------------------------------------------------
// Las diferencias permitidas
// ---------------------------------------------------------------------------

/**
 * Deja un bloque en su forma canonica, aplicando las cuatro diferencias permitidas.
 *
 * El orden importa: los comentarios se van primero, porque dentro de un comentario
 * puede haber un `href` o una clase de ejemplo que no tiene por que cuadrar con
 * nada.
 */
function normalizar(bloque) {
  let t = bloque;

  // 3 · Comentarios.
  t = t.replace(/<!--[\s\S]*?-->/g, '');

  // 4 · El nodo del estado de la capa de datos, que solo tiene el cuestionario.
  t = t.replace(/<p\s+id="estado-datos"[\s\S]*?<\/p>/g, '');

  // 1 · El destino de los enlaces. `index.html` a secas es `#inicio`.
  t = t.replace(/href="index\.html"/g, 'href="index.html#inicio"');
  t = t.replace(/href="#([a-z0-9-]+)"/g, 'href="index.html#$1"');

  // 2 · La marca de la pagina activa, y solo en los enlaces del menu.
  t = t.replace(/class="(nav-link|mobile-link)([^"]*)"/g, (_, tipo, resto) => {
    const limpio = resto
      .split(/\s+/)
      .filter((clase) => clase && !['active', 'text-paper', 'hover:text-paper', 'text-jsyellow'].includes(clase))
      .join(' ');
    return `class="${tipo}${limpio ? ` ${limpio}` : ''}"`;
  });

  // Precaucion · el espacio en blanco no dice nada.
  return t.replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Comparar
// ---------------------------------------------------------------------------

/** La primera diferencia entre dos textos, con su contexto. Para poder arreglarla. */
function primeraDiferencia(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;

  const desde = Math.max(0, i - 60);
  return {
    posicion: i,
    aqui: a.slice(desde, i + 80),
    alla: b.slice(desde, i + 80),
  };
}

const problemas = [];
const avisos = [];
const notas = [];

const recortados = new Map();

for (const pagina of PAGINAS) {
  const ruta = join(RAIZ, pagina);

  if (!existsSync(ruta)) {
    avisos.push(`falta ${pagina}: no hay con que comparar`);
    continue;
  }

  const { encabezados, pies, favicons } = bloquesDe(readFileSync(ruta, 'utf8'));

  // Un bloque de mas no es lo mismo que uno de menos, y ninguno de los dos se puede
  // comparar: en el primer caso no se sabe cual es el bueno.
  for (const [nombre, encontrados] of [
    ['encabezado', encabezados],
    ['pie', pies],
    ['favicon', favicons],
  ]) {
    if (encontrados.length !== 1) {
      avisos.push(`${pagina} trae ${encontrados.length} ${nombre}(s), y tiene que traer 1`);
    }
  }

  if (encabezados.length !== 1 || pies.length !== 1 || favicons.length !== 1) continue;

  recortados.set(pagina, {
    favicon: normalizar(favicons[0]),
    encabezado: normalizar(encabezados[0]),
    pie: normalizar(pies[0]),
  });
}

const comparables = [...recortados.keys()];

if (comparables.length < 2) {
  avisos.push('quedan menos de dos paginas comparables: no hay comparacion que hacer');
}

for (const bloque of ['favicon', 'encabezado', 'pie']) {
  let iguales = 0;

  for (let i = 0; i < comparables.length; i++) {
    for (let j = i + 1; j < comparables.length; j++) {
      const unaPagina = comparables[i];
      const otraPagina = comparables[j];
      const uno = recortados.get(unaPagina)[bloque];
      const otro = recortados.get(otraPagina)[bloque];

      if (uno === otro) {
        iguales++;
        continue;
      }

      const d = primeraDiferencia(uno, otro);

      problemas.push(
        `el ${bloque} de ${unaPagina} y el de ${otraPagina} difieren en algo que no esta ` +
          `permitido (caracter ${d.posicion} del bloque normalizado):\n` +
          `      ${unaPagina}: …${d.aqui}…\n` +
          `      ${otraPagina}: …${d.alla}…`
      );
    }
  }

  if (iguales > 0) {
    notas.push(
      `${bloque}: ${iguales} pareja(s) de copias comparadas y todas dicen lo mismo, con las ` +
        'cuatro diferencias permitidas aplicadas.'
    );
  }
}

// ---------------------------------------------------------------------------
// Veredicto
// ---------------------------------------------------------------------------

const codigo = problemas.length ? DISTINTAS : avisos.length ? SIN_VEREDICTO : IGUALES;

const titulo = problemas.length
  ? `COPIAS DISTINTAS  ***  ${problemas.length}  ***`
  : avisos.length
    ? 'NO SE PUDO COMPARAR  ***  ESTO NO ES UN EXITO  ***'
    : 'COPIAS IGUALES';

console.log(`\n${LINEA}\n${titulo}\n${LINEA}`);

for (const p of problemas) console.log(`  · ${p}`);
for (const a of avisos) console.log(`  · ${a}`);
for (const n of notas) console.log(`  ${n}`);

if (problemas.length) {
  console.log('');
  console.log('Las tres paginas llevan su propia copia del encabezado y del pie, porque el');
  console.log('sitio no usa plantillas (decision 8 de la iteracion 41). Si el cambio de arriba');
  console.log('es intencional, hay que hacerlo en LAS TRES. Si es una diferencia legitima que');
  console.log('esta comprobacion todavia no conoce, se agrega a `normalizar()` en este mismo');
  console.log('archivo, con su motivo escrito: la lista de permitidas no vive en ningun otro');
  console.log('sitio.');
}

console.log(`\nPaginas comparadas: ${comparables.join(', ') || 'ninguna'}`);
console.log(`\ncodigo de salida: ${codigo}\n`);

process.exit(codigo);
