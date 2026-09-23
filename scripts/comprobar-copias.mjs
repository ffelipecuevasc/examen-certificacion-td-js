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
 *      anclas (`#mapa`); desde las demas paginas hay que salir a la portada
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

/**
 * Las paginas del sitio. Si aparece otra, va aqui y nada mas.
 *
 * `acerca-de.html` es la cuarta desde la iteracion 51, y lleva la misma copia del
 * encabezado y del pie que las otras tres: no tiene enlace propio en el menu, asi
 * que ninguno de sus enlaces del encabezado lleva la marca de pagina activa.
 */
const PAGINAS = ['index.html', 'cuestionario.html', 'simulacro.html', 'acerca-de.html'];

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
 * Los tokens con los que un enlace del menu dice «esta es la pagina en la que estas».
 *
 * Los tres primeros son los de la iteracion 41: el enlace normal va en `hover:text-paper`
 * y el de la pagina actual en `active text-paper`, o en `text-jsyellow` en el menu de
 * telefono.
 *
 * LOS CUATRO ULTIMOS SON DE LA ITERACION 44 (decision del autor, 2026-09-22). El enlace
 * del simulacro es una pastilla amarilla en las tres paginas —fondo `jsyellow` y texto
 * `ink` siempre—, asi que su marca de activa no puede ser un color de texto: es un
 * subrayado negro bajo la palabra, que solo lleva `simulacro.html`.
 *
 * QUE SE NORMALICE NO BASTA, Y ESA ES LA MITAD IMPORTANTE. Quitar estos tokens antes de
 * comparar hace que las tres copias sean iguales; si nadie mirara nada mas, **borrar el
 * subrayado de `simulacro.html` pasaria en verde**, porque la comparacion dejaria de ver
 * justo lo unico que distingue a esa pagina. Por eso, mas abajo, hay una comprobacion que
 * exige que la marca ESTE donde corresponde y no este donde no.
 */
const MARCAS_DE_ACTIVA = [
  'active',
  'text-paper',
  'hover:text-paper',
  'text-jsyellow',
  'underline',
  'decoration-ink',
  'decoration-2',
  'underline-offset-2',
];

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
      .filter((clase) => clase && !MARCAS_DE_ACTIVA.includes(clase))
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
    // Los bloques SIN normalizar, para la comprobacion de alcance de mas abajo: ahi no
    // se comparan copias entre si, se mira si un destino concreto esta donde tiene que
    // estar, y para eso el `href` tiene que leerse tal como esta escrito.
    encabezadoCrudo: encabezados[0],
    pieCrudo: pies[0],
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
// El simulacro es alcanzable (iteracion 44, etapa C)
// ---------------------------------------------------------------------------
//
// POR QUE ESTA COMPROBACION NO SOBRA, TENIENDO LA DE ARRIBA. La de arriba compara las
// tres copias entre si: caza que el enlace este en dos paginas y falte en la tercera,
// pero **no** que falte en las tres. Hasta la iteracion 44 el simulacro no estaba
// enlazado desde ninguna parte a proposito —terminaba sin resumen—, y esa ausencia era
// invisible para una comprobacion de igualdad. Esto exige la presencia.
//
// SE MIRA POR ZONA Y NO POR PAGINA ENTERA. Que `simulacro.html` aparezca en algun lugar
// del archivo no dice nada: el estudiante llega por el menu de escritorio, por el de
// telefono o por el pie, y son tres sitios distintos del marcado. Un enlace en uno solo
// deja a los otros dos sin salida.

const ZONAS = [
  {
    nombre: 'el menú de escritorio',
    de: (bloques) => bloques.encabezadoCrudo.match(/<nav aria-label="Navegación principal"[\s\S]*?<\/nav>/)?.[0],
  },
  {
    nombre: 'el menú móvil',
    de: (bloques) => bloques.encabezadoCrudo.match(/<nav id="mobile-menu"[\s\S]*?<\/nav>/)?.[0],
  },
  {
    nombre: 'el pie',
    de: (bloques) => bloques.pieCrudo.match(/<nav aria-label="Secciones de la guía"[\s\S]*?<\/nav>/)?.[0],
  },
];

let alcances = 0;

for (const pagina of comparables) {
  const bloques = recortados.get(pagina);

  for (const zona of ZONAS) {
    const trozo = zona.de(bloques);

    if (trozo === undefined) {
      avisos.push(`${pagina}: no se encontró ${zona.nombre}, así que no se pudo mirar si lleva al simulacro`);
      continue;
    }

    if (!/href="simulacro\.html"/.test(trozo)) {
      problemas.push(`${pagina}: ${zona.nombre} no lleva al simulacro (falta un href="simulacro.html")`);
    } else {
      alcances += 1;
    }
  }
}

// La portada, ademas, ofrece el simulacro en la seccion donde invita a practicar.
const portada = existsSync(join(RAIZ, 'index.html')) ? readFileSync(join(RAIZ, 'index.html'), 'utf8') : '';
const repaso = portada.match(/<section id="repaso"[\s\S]*?<\/section>/)?.[0];

if (!repaso) {
  avisos.push('index.html: no se encontró la sección #repaso, así que no se pudo mirar si ofrece el simulacro');
} else if (!/href="simulacro\.html"/.test(repaso)) {
  problemas.push('index.html: la sección #repaso invita a practicar y no ofrece el simulacro');
} else {
  alcances += 1;
}

// Y el destino de los enlaces a la guia del resumen (decision 6) tiene que existir en el
// HTML ESTATICO de la portada. Si algun dia lo dibujara JavaScript, un enlace desde otra
// pagina llegaria a un ancla que no existe todavia cuando el navegador la busca.
if (portada && !/<section id="modulos"/.test(portada)) {
  problemas.push('index.html: no existe <section id="modulos">, que es adonde apuntan los enlaces a la guía (decisión 6)');
}

// LA MARCA DE PAGINA ACTIVA DEL SIMULACRO, QUE LA NORMALIZACION ACABA DE ESCONDER
// (iteracion 44, decision del autor del 2026-09-22).
//
// El enlace del simulacro es una pastilla amarilla igual en las tres paginas, y lo unico
// que distingue a `simulacro.html` es el subrayado negro. Ese token esta en
// `MARCAS_DE_ACTIVA`, asi que la comparacion de copias **no lo ve**: sin esto, borrarlo
// dejaria las tres copias iguales y el comprobador en verde, que es el falso verde que
// H-023 describe. Aqui se exige al reves: que la marca este en el simulacro y no este en
// las demas.

const MARCA_DEL_SUBRAYADO = 'underline';

const problemasAntesDeLaMarca = problemas.length;
let marcas = 0;

for (const pagina of comparables) {
  const bloques = recortados.get(pagina);

  for (const zona of ZONAS.slice(0, 2)) {
    const trozo = zona.de(bloques);
    if (trozo === undefined) continue;

    const enlace = trozo.match(/<a[^>]*href="simulacro\.html"[^>]*>/)?.[0];
    if (!enlace) continue;

    const subrayado = new RegExp(`class="[^"]*\\b${MARCA_DEL_SUBRAYADO}\\b[^"]*"`).test(enlace);
    const esSuPagina = pagina === 'simulacro.html';

    if (esSuPagina && !subrayado) {
      problemas.push(
        `${pagina}: el enlace del simulacro en ${zona.nombre} no lleva el subrayado que marca la página actual, ` +
          'y es la única diferencia que lo distingue de las demás copias'
      );
    } else if (!esSuPagina && subrayado) {
      problemas.push(
        `${pagina}: el enlace del simulacro en ${zona.nombre} lleva el subrayado de página actual, y esta no es ` +
          'la página del simulacro'
      );
    } else {
      marcas += 1;
    }
  }
}

// La nota solo si el bloque paso entero: «4 enlaces comprobados» impreso junto a dos
// problemas de este mismo bloque afirma mas de lo que se midio, que es H-023.
if (marcas > 0 && problemas.length === problemasAntesDeLaMarca) {
  notas.push(
    `marca de página activa del simulacro: ${marcas} enlace(s) comprobados —con subrayado en simulacro.html y sin ` +
      'él en las demás—, que es lo que la normalización esconde al comparar las copias.'
  );
}

// ---------------------------------------------------------------------------
// Acerca de: solo desde el pie (iteracion 51, decision 6)
// ---------------------------------------------------------------------------
//
// ESTO ES UNA RESTRICCION, NO UNA DESCRIPCION. El autor decidio el 2026-09-23 que
// `acerca-de.html` se enlaza unicamente desde la franja inferior del pie, junto al
// copyright, y nunca desde el encabezado: los seis enlaces del menu ya van apretados
// cerca de los 768 px (iteracion 44), y un septimo ahi seria justo el deslizamiento
// silencioso que esta comprobacion existe para cazar.
//
// POR QUE HACEN FALTA LAS DOS MITADES. La comparacion de copias de arriba no alcanza:
// si alguien pone el enlace en el menu de LAS CUATRO paginas, las copias siguen
// iguales entre si y la comparacion pasa en verde. Y si alguien lo quita del pie de
// las cuatro, lo mismo. Por eso se exige la presencia en un sitio y la ausencia en el
// otro, pagina por pagina.
//
// Se miran los bloques sin comentarios: un comentario que explique el enlace puede
// citar su `href` sin que eso sea un enlace.

const ENLACE_ACERCA_DE = /href="acerca-de\.html"/;

const sinComentarios = (texto) => texto.replace(/<!--[\s\S]*?-->/g, '');

/** El parrafo del copyright: el que lleva el `<span id="year">`. */
const FRANJA_INFERIOR = {
  nombre: 'la franja inferior del pie',
  de: (bloques) =>
    sinComentarios(bloques.pieCrudo).match(/<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?id="year"[\s\S]*?<\/p>/)?.[0],
};

const problemasAntesDeAcercaDe = problemas.length;
let franjasConElEnlace = 0;
let menusSinElEnlace = 0;

for (const pagina of comparables) {
  const bloques = recortados.get(pagina);

  const franja = FRANJA_INFERIOR.de(bloques);

  if (franja === undefined) {
    avisos.push(`${pagina}: no se encontró ${FRANJA_INFERIOR.nombre} (el párrafo del copyright), así que no se pudo mirar si enlaza a acerca-de.html`);
  } else if (!ENLACE_ACERCA_DE.test(franja)) {
    problemas.push(`${pagina}: ${FRANJA_INFERIOR.nombre} no enlaza a acerca-de.html junto al copyright (falta un href="acerca-de.html")`);
  } else {
    franjasConElEnlace += 1;
  }

  for (const zona of ZONAS.slice(0, 2)) {
    const trozo = zona.de(bloques);
    if (trozo === undefined) continue;

    if (ENLACE_ACERCA_DE.test(sinComentarios(trozo))) {
      problemas.push(
        `${pagina}: ${zona.nombre} enlaza a acerca-de.html, y esa página se enlaza solo desde el pie ` +
          '(decisión 6 de la iteración 51)'
      );
    } else {
      menusSinElEnlace += 1;
    }
  }

  // Y el resto del encabezado, fuera de los dos menus: el logotipo, el boton del menu
  // de telefono o lo que se agregue mañana. «Solo desde el pie» no deja rincones.
  let restoDelEncabezado = sinComentarios(bloques.encabezadoCrudo);
  for (const zona of ZONAS.slice(0, 2)) {
    const trozo = zona.de(bloques);
    if (trozo !== undefined) restoDelEncabezado = restoDelEncabezado.replace(sinComentarios(trozo), '');
  }

  if (ENLACE_ACERCA_DE.test(restoDelEncabezado)) {
    problemas.push(
      `${pagina}: el encabezado, fuera de los dos menús, enlaza a acerca-de.html, y esa página se enlaza ` +
        'solo desde el pie (decisión 6 de la iteración 51)'
    );
  }
}

// La nota solo si el bloque paso entero, por la misma razon que la de la marca activa.
if (franjasConElEnlace > 0 && problemas.length === problemasAntesDeAcercaDe) {
  notas.push(
    `acerca de: enlazada desde la franja inferior del pie en ${franjasConElEnlace} página(s), y ausente de ` +
      `los ${menusSinElEnlace} menús del encabezado y del resto del encabezado, como pide la decisión 6 de la iteración 51.`
  );
}

if (alcances > 0) {
  notas.push(
    `alcance del simulacro: ${alcances} sitio(s) llevan a simulacro.html —los tres menús y pies de las ` +
      'páginas comparadas, más la sección #repaso de la portada—, y `index.html#modulos` existe en el HTML estático.'
  );
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
  console.log('Cada pagina lleva su propia copia del encabezado y del pie, porque el sitio');
  console.log('no usa plantillas (decision 8 de la iteracion 41). Si el cambio de arriba es');
  console.log('intencional, hay que hacerlo en TODAS. Si es una diferencia legitima que');
  console.log('esta comprobacion todavia no conoce, se agrega a `normalizar()` en este mismo');
  console.log('archivo, con su motivo escrito: la lista de permitidas no vive en ningun otro');
  console.log('sitio.');
}

console.log(`\nPaginas comparadas: ${comparables.join(', ') || 'ninguna'}`);
console.log(`\ncodigo de salida: ${codigo}\n`);

process.exit(codigo);
