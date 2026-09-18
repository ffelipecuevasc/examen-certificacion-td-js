/**
 * `npm run probar:identidad`: la dirección visual del simulacro, comprobada.
 *
 * POR QUE EXISTE ESTE GUION
 *
 * La lectura de alcance de la iteración 45 encontró que **ningún guion comprobaba el
 * contraste**, ni que una clase `i-*` existiera en `icons.css`. Las dos cosas se
 * habían revisado siempre a mano, y una revisión a mano de veinte contrastes es una
 * revisión que se hace entera la primera vez y por encima la cuarta. El hallazgo
 * preexistente de `#valor-incorrectas` —`text-ruby` a 14 px en negrita, 3,98:1— llevaba
 * meses escrito en el sitio sin que nada se quejara.
 *
 * QUE COMPRUEBA, Y SOBRE QUE
 *
 * Sobre el **marcado que las funciones dibujan de verdad**, no sobre el archivo
 * fuente: se llama a `dibujarPantallaDelIntento()` y a `dibujarPantallaDelResumen()` y
 * se mira lo que devuelven. Un guion que leyera el archivo con expresiones regulares
 * volvería a atar la prueba a cómo está escrito el código, que es justo lo que el
 * desacople de esta misma iteración quitó.
 *
 *   1. El fondo real de cada elemento, caminando el árbol: cada nodo hereda el
 *      `bg-*` del ancestro más cercano que declare uno, y la raíz es `ink` porque el
 *      `<body>` es `bg-ink`. **El fondo no está escrito a mano en ninguna parte.**
 *   2. El contraste de cada texto, borde e icono contra ese fondo, calculado con la
 *      fórmula de WCAG 2.x sobre los colores de `tailwind.config.cjs`.
 *   3. Que no entre ningún color fuera de los trece tokens.
 *   4. Que `ruby` no sea texto de tamaño normal.
 *   5. Que durante el intento no aparezcan `ruby` ni `esmeralda`, y que en el resumen
 *      no aparezca el cronómetro.
 *   6. Que el intento no declare ninguna animación, con un control positivo que sí la
 *      declara para que se sepa que la comprobación ve una cuando la hay.
 *   7. Que la franja quepa en los 72 px de la decisión 1, sumando sus clases.
 *   8. Cuánto mide la maqueta con el peor caso del banco, y cuánto hay que desplazar
 *      en 375×667 y en 375×812.
 *   9. Que el enunciado y las alternativas declaren el corte de palabras largas.
 *  10. Que toda clase `i-*` del sitio exista en `icons.css`.
 *  11. Que la pregunta de ejemplo siga siendo el peor caso del banco.
 *  12. Que el cuestionario no le pida a la transición compartida ningún aspecto: la
 *      piel del simulacro entra por parámetro y el borde por omisión sigue siendo el
 *      suyo.
 *
 * LO QUE NO PRUEBA, y conviene decirlo porque es la mitad que se olvida:
 *
 *   - **No pinta nada.** El alto sale de sumar las clases declaradas con un modelo de
 *     ancho de letra, no de un navegador. El error esperado es de ±5 %, y por eso el
 *     alto va a la lista de verificación del autor además de salir por aquí.
 *   - **No sabe si el significado declarado de cada color es el que el estudiante
 *     entiende.** Eso lo juzga la pasada del autor.
 *
 * Códigos de salida:
 *   0  todo en verde
 *   1  algo está mal
 *   2  no se pudo comprobar
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..');
const SITIO = join(RAIZ, 'static', 'js');

const CORRECTO = 0;
const ROTO = 1;
const SIN_VEREDICTO = 2;

const LINEA = '='.repeat(72);

const problemas = [];
const notas = [];

/** Anuncia un veredicto con el mismo formato siempre, para leerlo de un vistazo. */
function anunciar(titulo, lineas) {
  console.log(LINEA);
  console.log(titulo);
  console.log(LINEA);
  for (const linea of lineas) console.log(linea);
}

function terminar(codigo) {
  console.log(`\ncodigo de salida: ${codigo}\n`);
  process.exit(codigo);
}

// ---------------------------------------------------------------------------
// 1 · Los colores, sacados de tailwind.config.cjs
// ---------------------------------------------------------------------------
//
// Se leen del archivo de configuracion y no se copian aqui: una tabla de colores
// copiada es una tabla que el dia que la paleta cambie sigue midiendo la vieja y
// contesta que todo esta bien.

const require = createRequire(import.meta.url);

let TOKENS;
try {
  TOKENS = require(join(RAIZ, 'tailwind.config.cjs')).theme.extend.colors;
} catch (error) {
  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    '  No se pudo leer tailwind.config.cjs, que es de donde salen los colores.',
    `  Detalle: ${error.message}`,
  ]);
  terminar(SIN_VEREDICTO);
}

const aRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** Luminancia relativa de WCAG 2.x. */
function luminancia(hex) {
  const [r, g, b] = aRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste entre dos colores opacos. */
function contraste(frente, fondo) {
  const [alto, bajo] = [luminancia(frente), luminancia(fondo)].sort((a, b) => b - a);
  return (alto + 0.05) / (bajo + 0.05);
}

/**
 * Lo que hace `color/NN` en Tailwind: mezclar con lo que haya detras.
 *
 * Es la parte que una tabla escrita a mano se salta, y donde vivia el error: un
 * `jsyellow/40` no contrasta como `jsyellow`, contrasta como el gris oliva que sale
 * de mezclarlo con el negro de abajo.
 */
function mezclar(frente, fondo, alfa) {
  const f = aRgb(frente);
  const d = aRgb(fondo);

  return (
    '#' +
    f
      .map((v, i) => Math.round((v * alfa + d[i] * (1 - alfa)) * 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Lo que una clase `text-`, `bg-` o `border-` dice DESPUES del prefijo, o null si esa
 * clase no habla de color.
 *
 * HACE FALTA SEPARAR ESTO, y se descubrio provocandolo: la primera version de este
 * guion dio trece rojos contra el marcado correcto porque leia `border-b` y
 * `border-l-2` como colores y se quejaba de que «b» y «2» no estan en la paleta. Una
 * comprobacion que grita con el codigo bueno se aprende a ignorar, que es H-013.
 *
 * Lo que se descarta es lo que de verdad no es color: los anchos (`border-2`,
 * `border-l-2`, `border-b-0`), los lados a secas (`border-b`), y las alineaciones
 * (`text-left`). Lo que NO se descarta es un valor arbitrario tipo `text-[#7a2e2e]`:
 * ese es exactamente el caso que hay que cazar —`.quiz-option[data-state='wrong']`
 * pinta asi— y por eso se devuelve para que falle al no encontrarse en la paleta.
 */
function loQueNombra(clase) {
  const partes = clase.match(/^(?:text|bg|border(?:-[lrtbxy])?)-(.+)$/);
  if (!partes) return null;

  const resto = partes[1];

  if (/^\d+(\.\d+)?$/.test(resto)) return null;
  if (['b', 't', 'l', 'r', 'x', 'y'].includes(resto)) return null;
  if (['left', 'center', 'right', 'justify', 'start', 'end'].includes(resto)) return null;
  if (/^[lrtbxy]-\d/.test(resto)) return null;

  // Un valor arbitrario entre corchetes. Si es una MEDIDA -`text-[11px]`- no habla de
  // color; cualquier otra cosa si, y se devuelve para que falle al buscarla en la
  // paleta. Esta rama entro despues de provocar un rojo que salio VERDE:
  // `border-[#7a2e2e]` -uno de los dos colores de fuera que pinta
  // `.quiz-option[data-state='wrong']`- se colaba entero, porque la deteccion pedia
  // que despues del guion viniera una letra y ahi venia un corchete. El caso que mas
  // importaba era justo el que no se miraba.
  if (resto.startsWith('[')) {
    return /^\[[\d.]+(px|rem|em|%|vh|vw|ch)\]$/.test(resto) ? null : resto;
  }

  return resto;
}

/**
 * Resuelve una clase de color de Tailwind al hexadecimal que se ve encima del fondo.
 *
 * Devuelve null si la clase no nombra un color de la paleta, que es lo que delata un
 * color de fuera: ahi no hay nada que medir, hay algo que sacar.
 */
function resolver(clase, fondo) {
  const nombrado = loQueNombra(clase);
  if (nombrado === null) return null;

  const [nombre, alfa] = nombrado.split('/');

  const hex = TOKENS[nombre];
  if (!hex) return null;
  if (!alfa) return hex;

  return mezclar(hex, fondo, Number(alfa) / 100);
}

// ---------------------------------------------------------------------------
// 2 · Caminar el marcado para saber sobre que fondo esta cada cosa
// ---------------------------------------------------------------------------

const SIN_CIERRE = new Set(['img', 'br', 'hr', 'input', 'meta', 'link']);

/**
 * Recorre el HTML y devuelve un elemento por etiqueta, con el fondo que hereda.
 *
 * EL FONDO ES EL DEL ANCESTRO MAS CERCANO QUE DECLARE UNO, y la raiz es `ink` porque
 * el `<body>` del sitio es `bg-ink`. Es la misma regla que aplica el navegador, y es
 * la unica forma de que la tabla diga «sobre panel» porque el elemento esta dentro de
 * un `bg-panel`, y no porque alguien lo escribio.
 *
 * Y SE GUARDAN LOS DOS FONDOS, el propio y el del padre, porque un borde y un texto no
 * se miden contra el mismo sitio. El texto se ve encima del fondo de su elemento; el
 * borde esta en el limite, y lo que hay que poder distinguir es el elemento **de lo
 * que lo rodea**. Medir un borde contra su propio fondo da el resultado absurdo que la
 * primera version de este guion produjo: la franja en urgencia es `bg-jsyellow` con
 * `border-jsyellow`, y contra si misma daba 1,00:1 cuando contra la pagina —que es lo
 * que el ojo compara— da 15,53:1.
 */
function caminar(html, fondoRaiz = TOKENS.ink) {
  const elementos = [];
  const pila = [{ etiqueta: 'raiz', fondo: fondoRaiz }];

  const etiquetas = /<(\/?)([a-z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;

  for (const coincidencia of html.matchAll(etiquetas)) {
    const [, cierre, etiqueta, atributos] = coincidencia;

    if (cierre) {
      if (pila.length > 1) pila.pop();
      continue;
    }

    const clases = (atributos.match(/\sclass="([^"]*)"/)?.[1] ?? '').split(/\s+/).filter(Boolean);
    const papel = atributos.match(/\sdata-papel="([^"]*)"/)?.[1] ?? null;

    const fondoDelPadre = pila[pila.length - 1].fondo;

    // Se mira `bg-` y no `bg-` con variante: `hover:bg-` no es el fondo en reposo, y
    // el contraste se mide en reposo. La variante se comprueba aparte si algun dia
    // hace falta.
    const claseDeFondo = clases.find((c) => /^bg-[a-z0-9]/.test(c));
    const fondoPropio = claseDeFondo ? resolver(claseDeFondo, fondoDelPadre) : null;

    const fondo = fondoPropio ?? fondoDelPadre;

    elementos.push({ etiqueta, papel, clases, fondo, fondoDelPadre, claseDeFondo });

    if (!SIN_CIERRE.has(etiqueta.toLowerCase()) && !atributos.trimEnd().endsWith('/')) {
      pila.push({ etiqueta, fondo });
    }
  }

  return elementos;
}

// ---------------------------------------------------------------------------
// 3 · El tamano del texto, para saber que umbral le toca
// ---------------------------------------------------------------------------

const TAMANOS = {
  'text-xs': 12,
  'text-sm': 14,
  'text-base': 16,
  'text-lg': 18,
  'text-xl': 20,
  'text-2xl': 24,
  'text-3xl': 30,
  'text-4xl': 36,
  'text-5xl': 48,
  'text-6xl': 60,
};

const INTERLINEA = {
  'leading-none': 1,
  'leading-tight': 1.25,
  'leading-snug': 1.375,
  'leading-normal': 1.5,
  'leading-relaxed': 1.625,
};

const ESPACIO = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
};

/**
 * El umbral que le toca a un texto, en su tamano y su grosor (WCAG 1.4.3).
 *
 * «Texto grande» son 24 px, o 18,66 px si va en negrita. Por debajo de eso el umbral
 * es 4,5:1. Se calcula y no se supone: es exactamente la regla que el hallazgo de
 * `#valor-incorrectas` incumplia por medio punto.
 */
function umbralDeTexto(px, negrita) {
  return px >= 24 || (negrita && px >= 18.66) ? 3 : 4.5;
}

// ---------------------------------------------------------------------------
// 4 · Lo que se va a mirar
// ---------------------------------------------------------------------------

let maqueta;
let transicion;
try {
  maqueta = await import('../static/js/components/simulacro-maqueta.js');
  transicion = await import('../static/js/components/transicion-de-carga.js');
} catch (error) {
  anunciar('NO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***', [
    '  No se pudieron cargar los componentes de la maqueta.',
    `  Detalle: ${error.message}`,
  ]);
  terminar(SIN_VEREDICTO);
}

/**
 * Las pantallas que se miden, y por que son cuatro y no dos.
 *
 * Cada estado que cambia un color es una pantalla distinta a efectos de contraste, y
 * medir solo el estado de reposo es como no medir. Van:
 *
 *   intento            en reposo, sin nada marcado.
 *   intento marcado    con una alternativa elegida, que es el unico estado que el
 *                      estudiante puede producir durante el intento.
 *   intento urgente    los ultimos segundos, con la franja en `jsyellow` y el texto
 *                      en `ink`: la pantalla entera cambia de tinta.
 *   resumen            donde entran `ruby` y `esmeralda`.
 *
 * «intento marcado» entro despues de provocar un rojo: la comprobacion de que
 * `esmeralda` no se cuela en el intento solo se disparaba en la variante urgente,
 * porque era la unica que dibujaba una alternativa marcada. Media pantalla sin medir.
 */
/**
 * Los dos avisos de la decision 6, dibujados de verdad para poder medirlos.
 *
 * Necesitan un DOM porque escriben en un contenedor en vez de devolver una cadena, asi
 * que se les da el falso y se lee lo que dejaron. Van en la tabla con el resto: son
 * texto sobre `ink` como cualquier otro, y un aviso ilegible es peor que ninguno.
 */
const dominioDeLosAvisos = (await import('./dom-falso.mjs')).prepararDomFalso();

const avisos = await import('../static/js/components/aviso-de-respaldo.js');
const avisosDeGuardado = await import('../static/js/components/aviso-de-guardado.js');

avisos.mostrarAvisoDeRespaldo({
  sello: { generada_en: '2026-09-10T00:00:00.000Z' },
  loQueSeCargo: 'el simulacro',
  compacto: true,
});
const avisoDeRespaldoCompacto = dominioDeLosAvisos.html('#aviso-respaldo');

// Y el mismo aviso ENTERO, que es el que se ve en la presentacion y en el resumen. Las
// dos formas se miden, y no solo una: se descubrio provocando un rojo que salio verde
// —bajar el borde del aviso entero no se notaba, porque la tabla solo miraba el
// compacto—. Media pieza sin medir es media pieza sin proteger.
avisos.mostrarAvisoDeRespaldo({
  sello: { generada_en: '2026-09-10T00:00:00.000Z' },
  loQueSeCargo: 'el simulacro',
});
const avisoDeRespaldoEntero = dominioDeLosAvisos.html('#aviso-respaldo');

avisosDeGuardado.mostrarAvisoDeGuardado({ estado: 'fallo', compacto: true });
const avisoDeGuardadoCompacto = dominioDeLosAvisos.html('#aviso-guardado');

avisosDeGuardado.mostrarAvisoDeGuardado({ estado: 'sin_almacen' });
const avisoDeGuardadoEntero = dominioDeLosAvisos.html('#aviso-guardado');

const PANTALLAS = {
  intento: maqueta.dibujarPantallaDelIntento(),
  'aviso de respaldo compacto': avisoDeRespaldoCompacto,
  'aviso de respaldo entero': avisoDeRespaldoEntero,
  'aviso de guardado compacto': avisoDeGuardadoCompacto,
  'aviso de guardado entero': avisoDeGuardadoEntero,
  'intento marcado': maqueta.dibujarPantallaDelIntento({ marcada: 374 }),
  'intento urgente': maqueta.dibujarPantallaDelIntento({
    segundos: 5,
    urgente: true,
    marcada: 374,
  }),
  resumen: maqueta.dibujarPantallaDelResumen(),
};

// ---------------------------------------------------------------------------
// 5 · La tabla de contraste
// ---------------------------------------------------------------------------

/**
 * La unica excepcion, escrita entera y con fecha de caducidad propia.
 *
 * POR QUE EXISTE UNA. El aviso de ADR-008 lo dibuja un componente que **comparten el
 * cuestionario y el simulacro**. Su `border-jsyellow/40` da 2,96:1 sobre `ink`, cuatro
 * centesimas por debajo del 3:1, y subirlo aqui repintaria de paso el cuestionario,
 * que esta iteracion no toca. No incumple WCAG 1.4.11 porque ese criterio pide 3:1 a
 * lo que identifica un componente o su estado, y a este aviso lo identifican su texto
 * en `paper` -19,57:1- y su icono en `jsyellow` -15,53:1-: el borde es decoracion.
 *
 * POR QUE NO PUEDE PODRIRSE. La excepcion trae la razon que se midio el dia que se
 * escribio, y **solo vale para ese numero**. Si alguien cambia esa clase, la razon deja
 * de coincidir, la excepcion no se aplica y da rojo. Una lista de perdones que perdona
 * cualquier valor futuro es una lista que tapa el defecto siguiente.
 */
const EXCEPCIONES = [
  {
    clase: 'border-jsyellow/40',
    razonMedida: 2.96,
    porque:
      'el aviso de ADR-008 lo comparten las dos paginas; su borde es decoracion y no lo ' +
      'identifica (guia visual de la iteracion 45)',
  },
];

/** La excepcion que cubre esta medicion, si la razon sigue siendo la que se midio. */
const excepcionDe = (clase, razon) =>
  EXCEPCIONES.find((e) => e.clase === clase && Math.abs(e.razonMedida - razon) < 0.01) ?? null;

const filas = [];

for (const [nombre, html] of Object.entries(PANTALLAS)) {
  for (const el of caminar(html)) {
    const negrita = el.clases.includes('font-bold');
    const claseDeTamano = el.clases.find((c) => c in TAMANOS);
    const px = claseDeTamano ? TAMANOS[claseDeTamano] : 16;

    const esIcono = el.clases.includes('icon');

    for (const clase of el.clases) {
      if (clase in TAMANOS || clase in INTERLINEA) continue;
      if (loQueNombra(clase) === null) continue;

      const esFondo = clase.startsWith('bg-');
      const esBorde = clase.startsWith('border');
      const esTexto = clase.startsWith('text-');

      // El fondo no se mide contra si mismo, pero si tiene que ser un color de la
      // paleta: un `bg-[#123456]` es tan de fuera como un `text-[#123456]`.
      if (esFondo) {
        if (resolver(clase, el.fondoDelPadre) === null) {
          problemas.push(
            `en «${nombre}», la clase «${clase}» no nombra ninguno de los trece tokens de la paleta`
          );
        }
        continue;
      }

      if (!esTexto && !esBorde) continue;

      // Contra que se mide: el texto contra el fondo de su elemento, el borde contra
      // lo que rodea al elemento.
      const contraQue = esBorde ? el.fondoDelPadre : el.fondo;

      const color = resolver(clase, contraQue);

      if (!color) {
        problemas.push(
          `en «${nombre}», la clase «${clase}» no nombra ninguno de los trece tokens de la paleta`
        );
        continue;
      }

      const razon = contraste(color, contraQue);

      // Un icono es contenido no textual: 3:1 (WCAG 1.4.11). Un borde tambien. Un
      // texto depende de su tamano.
      const umbral = esBorde || esIcono ? 3 : umbralDeTexto(px, negrita);

      const excepcion = excepcionDe(clase, razon);

      filas.push({
        excepcion,
        pantalla: nombre,
        elemento: el.papel ?? `<${el.etiqueta}>`,
        clase,
        color,
        fondo: contraQue,
        deDondeSaleElFondo: esBorde
          ? 'lo que rodea al elemento'
          : (el.claseDeFondo ?? 'heredado del ancestro más cercano'),
        px: esBorde || esIcono ? '—' : `${px}${negrita ? ' negrita' : ''}`,
        razon,
        umbral,
        pasa: razon >= umbral || Boolean(excepcion),
      });
    }
  }
}

for (const f of filas.filter((f) => !f.pasa)) {
  problemas.push(
    `en «${f.pantalla}», ${f.elemento} con «${f.clase}» da ${f.razon.toFixed(2)}:1 sobre ` +
      `${f.fondo} y necesita ${f.umbral}:1`
  );
}

// Una excepcion que ya no cubre nada es una excepcion que sobra, y dejarla puesta
// ensena a que la lista crezca sin que nadie la revise.
for (const e of EXCEPCIONES) {
  if (!filas.some((f) => f.excepcion === e)) {
    problemas.push(
      `la excepcion de «${e.clase}» ya no cubre ninguna medicion: o el marcado cambio o la ` +
        'excepcion sobra, y en los dos casos hay que quitarla'
    );
  } else {
    notas.push(
      `Excepcion declarada: «${e.clase}» a ${e.razonMedida}:1, bajo el 3:1, porque ${e.porque}. ` +
        'Vale solo para esa razon: si cambia, vuelve a evaluarse.'
    );
  }
}

// ---------------------------------------------------------------------------
// 6 · `ruby` nunca como texto de tamano normal
// ---------------------------------------------------------------------------

const rubyComoTexto = filas.filter(
  (f) => f.clase === 'text-ruby' && f.px !== '—' && f.umbral === 4.5
);

if (rubyComoTexto.length > 0) {
  for (const f of rubyComoTexto) {
    problemas.push(
      `«${f.elemento}» de la pantalla «${f.pantalla}» usa ruby como texto de tamano normal (${f.px} px)`
    );
  }
}

// ---------------------------------------------------------------------------
// 7 · El intento y el resumen no comparten significados
// ---------------------------------------------------------------------------

for (const nombre of ['intento', 'intento marcado', 'intento urgente']) {
  for (const prohibido of ['ruby', 'esmeralda']) {
    if (PANTALLAS[nombre].includes(prohibido)) {
      problemas.push(
        `«${prohibido}» aparece en la pantalla del ${nombre}, y esos dos colores estan ` +
          'reservados al resumen (decision 3)'
      );
    }
  }
}

for (const marca of ['data-papel="cronometro"', 'i-clock']) {
  if (PANTALLAS.resumen.includes(marca)) {
    problemas.push(`el resumen dibuja «${marca}»: el cronometro no pertenece a esa pantalla`);
  }
}

// ---------------------------------------------------------------------------
// 8 · Nada se mueve, y la comprobacion sabe ver algo que se mueva
// ---------------------------------------------------------------------------

for (const [nombre, html] of Object.entries(PANTALLAS)) {
  if (/\banimate-[a-z]/.test(html)) {
    problemas.push(`la pantalla «${nombre}» declara una animacion, y la iteracion 45 no dibuja ninguna`);
  }

  if (html.includes('<animate')) {
    problemas.push(`la pantalla «${nombre}» trae SMIL dentro de un SVG, prohibido por la decision 2`);
  }
}

// EL CONTROL POSITIVO. Sin esto, «ninguna pantalla declara animacion» pasaria igual
// de verde con la comprobacion rota, y nadie lo sabria. La transicion de carga SI
// declara `animate-latido` con el DOM normal, asi que si la busqueda no la encuentra
// es que la busqueda no busca.
const domNormal = dominioDeLosAvisos;

const transicionDePrueba = transicion.crearTransicionDeCarga({
  contenedor: '#control-positivo',
  idDelMensaje: 'mensaje-de-prueba',
  idDelAvisoLento: 'lento-de-prueba',
  textos: { titulo: (d) => `Cargando ${d}`, detalle: 'detalle', lento: 'lento' },
});

transicionDePrueba.dibujar('el control positivo');
const htmlDeLaTransicion = domNormal.html('#control-positivo');

if (!/\banimate-[a-z]/.test(htmlDeLaTransicion)) {
  problemas.push(
    'el control positivo no declaro ninguna animacion: la comprobacion de «nada se mueve» ' +
      'no sabe ver una animacion aunque la haya, asi que su verde no vale nada'
  );
}

// ---------------------------------------------------------------------------
// 9 · La franja cabe en 72 px, sumando lo que declara
// ---------------------------------------------------------------------------

const franja = maqueta.dibujarFranjaDelIntento({
  segundos: 30,
  posicion: 12,
  total: 120,
  transcurrido: '06:12',
});

const elementosDeLaFranja = caminar(franja);
const interior = elementosDeLaFranja.find((el) => el.clases.some((c) => /^h-\d/.test(c)));

if (!interior) {
  problemas.push('la franja no declara ningun alto: no se puede comprobar que quepa en 72 px');
} else {
  const claseDeAlto = interior.clases.find((c) => /^h-\d/.test(c));
  const alto = ESPACIO[claseDeAlto.replace('h-', '')];

  const raiz = elementosDeLaFranja[0];
  const bordes = raiz.clases.filter((c) => /^border-b$/.test(c)).length;

  const total = alto + bordes;

  if (total !== maqueta.ALTO_DE_LA_FRANJA) {
    problemas.push(
      `la franja mide ${total} px por sus clases y ALTO_DE_LA_FRANJA dice ` +
        `${maqueta.ALTO_DE_LA_FRANJA}: la constante y el marcado se separaron`
    );
  }

  if (total > 72) {
    problemas.push(`la franja mide ${total} px y la decision 1 le da 72 como maximo`);
  }

  notas.push(
    `Franja: ${claseDeAlto} (${alto} px) + ${bordes} px de borde = ${total} px, ` +
      'dentro de los 56 a 72 px de la decision 1.'
  );
}

// ---------------------------------------------------------------------------
// 10 · El corte de palabras largas
// ---------------------------------------------------------------------------

const elementosDelIntento = caminar(PANTALLAS.intento);

for (const papel of ['enunciado', 'alternativa']) {
  const nodos = elementosDelIntento.filter((el) => el.papel === papel);

  if (nodos.length === 0) {
    problemas.push(`no hay ningun elemento con data-papel="${papel}" en la pantalla del intento`);
    continue;
  }

  for (const nodo of nodos) {
    if (!nodo.clases.some((c) => c === 'break-words' || c === 'break-all')) {
      problemas.push(
        `«${papel}» no declara el corte de palabras largas, y el banco trae un token de 40 ` +
          'caracteres sin espacios'
      );
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// 11 · Toda clase `i-*` del sitio existe en icons.css
// ---------------------------------------------------------------------------

const RUTA_ICONOS = join(RAIZ, 'static', 'css', 'icons.css');

if (!existsSync(RUTA_ICONOS)) {
  problemas.push('no existe static/css/icons.css: corre `npm run icons`');
} else {
  const css = readFileSync(RUTA_ICONOS, 'utf8');
  const declaradas = new Set([...css.matchAll(/\.i-([a-z0-9-]+)\s*\{/g)].map((m) => m[1]));

  const archivos = [
    join(RAIZ, 'index.html'),
    join(RAIZ, 'cuestionario.html'),
    join(RAIZ, 'simulacro.html'),
    ...[
      'components/simulacro-maqueta.js',
      'components/simulacro.js',
      'components/cuestionario.js',
      'components/transicion-de-carga.js',
      'components/aviso-de-respaldo.js',
      'components/aviso-de-guardado.js',
      'components/indice-modulos.js',
      'components/modules.js',
      'components/nav.js',
      'components/roadmap.js',
      'components/estado-datos.js',
    ].map((r) => join(SITIO, r)),
  ].filter(existsSync);

  const usadas = new Map();

  for (const archivo of archivos) {
    const texto = readFileSync(archivo, 'utf8');

    // Las dos formas de nombrar un icono en este sitio: la clase escrita en el HTML
    // y la llamada a `icon()` desde el JavaScript.
    for (const m of texto.matchAll(/class="icon i-([a-z0-9-]+)/g)) usadas.set(m[1], archivo);
    for (const m of texto.matchAll(/\bicon\(\s*'([a-z0-9-]+)'/g)) usadas.set(m[1], archivo);
  }

  for (const [nombre, archivo] of usadas) {
    if (!declaradas.has(nombre)) {
      problemas.push(
        `la clase «i-${nombre}», usada en ${archivo.replace(RAIZ, '').replace(/\\/g, '/')}, no existe en icons.css`
      );
    }
  }

  notas.push(
    `Iconos: ${usadas.size} clases i-* usadas en el sitio, las ${declaradas.size} de icons.css ` +
      'disponibles, y ninguna usada que falte.'
  );
}

// ---------------------------------------------------------------------------
// 12 · La pregunta de ejemplo sigue siendo el peor caso del banco
// ---------------------------------------------------------------------------

try {
  const { PREGUNTAS } = await import('../static/js/data/instantanea-banco.js');

  const pesoDe = (p) => p.enunciado.length + p.alternativas.reduce((s, a) => s + a.texto.length, 0);
  const peorPeso = Math.max(...PREGUNTAS.map(pesoDe));

  const ejemplo = maqueta.PREGUNTA_DE_EJEMPLO;
  const enElBanco = PREGUNTAS.find((p) => p.id === ejemplo.id);

  if (!enElBanco) {
    problemas.push(`la pregunta de ejemplo (${ejemplo.id}) ya no esta en el banco`);
  } else if (pesoDe(ejemplo) !== peorPeso) {
    problemas.push(
      `la pregunta de ejemplo (${ejemplo.id}) pesa ${pesoDe(ejemplo)} caracteres y el peor caso ` +
        `del banco pesa ${peorPeso}: la maqueta dejo de dibujar el peor caso`
    );
  } else {
    const empatados = PREGUNTAS.filter((p) => pesoDe(p) === peorPeso).map((p) => p.id);
    notas.push(
      `Peor caso: la maqueta dibuja la pregunta ${ejemplo.id}, de ${peorPeso} caracteres, ` +
        `empatada en el primer lugar del banco con ${empatados.join(' y ')}.`
    );
  }
} catch (error) {
  problemas.push(`no se pudo leer la instantanea para comprobar el peor caso: ${error.message}`);
}

// ---------------------------------------------------------------------------
// 13 · La transicion compartida: el cuestionario no pide ningun aspecto
// ---------------------------------------------------------------------------

const fuenteDelCuestionario = readFileSync(join(SITIO, 'components', 'cuestionario.js'), 'utf8');
const fuenteDelSimulacro = readFileSync(join(SITIO, 'components', 'simulacro.js'), 'utf8');

const ajustesDelCuestionario =
  fuenteDelCuestionario.match(/crearTransicionDeCarga\(\{[\s\S]*?\n\}\);/)?.[0] ?? '';

if (!ajustesDelCuestionario) {
  problemas.push('no se encontro la llamada a crearTransicionDeCarga() del cuestionario');
} else if (/\bborde\s*:/.test(ajustesDelCuestionario)) {
  problemas.push(
    'el cuestionario le pide un borde a la transicion compartida: su aspecto tiene que ser ' +
      'el de por omision, que es lo que garantiza que dibuje lo mismo que antes'
  );
}

if (!/\bborde\s*:\s*BORDE_DEL_SIMULACRO/.test(fuenteDelSimulacro)) {
  problemas.push(
    'el simulacro no le pasa su borde a la transicion compartida: estaria dibujando la ' +
      'transicion con el aspecto del cuestionario'
  );
}

if (transicion.BORDE_POR_OMISION !== 'border-panel3') {
  problemas.push(
    `el borde por omision de la transicion es «${transicion.BORDE_POR_OMISION}» y era ` +
      '«border-panel3»: al cambiarlo se repinto el cuestionario, que esta iteracion no toca'
  );
}

// Y lo que dibuja de verdad con la piel por omision lleva ese borde y no el del
// simulacro. Se mira el HTML, no el archivo: es lo que ve quien abre la pagina.
if (!htmlDeLaTransicion.includes(transicion.BORDE_POR_OMISION)) {
  problemas.push(
    'la transicion con la piel por omision no dibujo el borde por omision: el parametro ' +
      'dejo de gobernar lo que se ve'
  );
}

if (htmlDeLaTransicion.includes(maqueta.BORDE_DEL_SIMULACRO)) {
  problemas.push(
    'la transicion por omision dibujo el borde del simulacro: el cuestionario se repinto de paso'
  );
}

notas.push(
  `Transicion compartida: el cuestionario no pide aspecto y dibuja «${transicion.BORDE_POR_OMISION}»; ` +
    `el simulacro pide «${maqueta.BORDE_DEL_SIMULACRO}». Es la unica diferencia entre las dos.`
);

// ---------------------------------------------------------------------------
// 14 · El alto de la maqueta con el peor caso
// ---------------------------------------------------------------------------
//
// EL MODELO DE ANCHO, dicho antes de usarlo: las fuentes llegan de Google Fonts y no
// hay archivo local que medir, asi que el ancho de cada caracter se estima por clase
// con avances en «em» tipicos de Inter. El error esperado es de +-5 %. Lo exacto lo
// dice el navegador, y por eso el alto va tambien a la lista de verificacion.

const ANGOSTAS = new Set([...'iljtfr.,;:!¡?¿\'"`()[]{}|/\\ '.split('')]);
const ANCHAS = new Set([...'mwMW@'.split('')]);

const avance = (c) => {
  if (c === ' ') return 0.26;
  if (ANCHAS.has(c)) return 0.85;
  if (ANGOSTAS.has(c)) return 0.31;
  if (c >= '0' && c <= '9') return 0.6;
  if (c === c.toUpperCase() && c !== c.toLowerCase()) return 0.66;
  return 0.55;
};

const anchoDe = (texto, px) => [...texto].reduce((s, c) => s + avance(c), 0) * px;

/** Cuantas lineas ocupa un texto en un ancho dado, cortando por palabras. */
function lineasDe(texto, anchoCaja, px) {
  let lineas = 1;
  let actual = 0;

  for (const palabra of texto.split(' ')) {
    const ancho = anchoDe(palabra, px);

    if (ancho > anchoCaja) {
      if (actual > 0) {
        lineas += 1;
        actual = 0;
      }
      const trozos = Math.ceil(ancho / anchoCaja);
      lineas += trozos - 1;
      actual = ancho - (trozos - 1) * anchoCaja;
      continue;
    }

    const conEspacio = actual === 0 ? ancho : actual + anchoDe(' ', px) + ancho;

    if (conEspacio > anchoCaja) {
      lineas += 1;
      actual = ancho;
    } else {
      actual = conEspacio;
    }
  }

  return lineas;
}

/** El valor en px de la primera clase de una familia que el elemento declare. */
function valorDe(clases, prefijo, tabla, porOmision) {
  const clase = clases.find((c) => c.startsWith(prefijo) && (c.slice(prefijo.length) in tabla));
  return clase ? tabla[clase.slice(prefijo.length)] : porOmision;
}

const VIEWPORT = 375;
const ANCHO_DEL_CONTENIDO = VIEWPORT - 2 * ESPACIO[5]; // la seccion es px-5

const tarjeta = elementosDelIntento.find((el) => el.papel === 'tarjeta-de-la-pregunta');
const enunciado = elementosDelIntento.find((el) => el.papel === 'enunciado');
const alternativas = elementosDelIntento.filter((el) => el.papel === 'alternativa');
const numero = elementosDelIntento.find((el) => el.papel === 'numero-de-pregunta');
const lista = elementosDelIntento.find((el) => el.papel === 'alternativas');
const botones = elementosDelIntento.find((el) => el.papel === 'botones-del-intento');

if (!tarjeta || !enunciado || alternativas.length !== 4 || !numero || !lista || !botones) {
  problemas.push(
    'la pantalla del intento no trae sus piezas marcadas con data-papel: no se puede calcular el alto'
  );
} else {
  const padTarjeta = valorDe(tarjeta.clases, 'p-', ESPACIO, 0);
  const anchoTarjeta = ANCHO_DEL_CONTENIDO - 2 * padTarjeta - 2;

  const pxNumero = TAMANOS[numero.clases.find((c) => c in TAMANOS)] ?? 16;
  const altoNumero = Math.ceil(pxNumero * 1.333);

  const pxEnun = TAMANOS[enunciado.clases.find((c) => c in TAMANOS)] ?? 16;
  const interEnun = INTERLINEA[enunciado.clases.find((c) => c in INTERLINEA)] ?? 1.5;
  const lineasEnun = lineasDe(maqueta.PREGUNTA_DE_EJEMPLO.enunciado, anchoTarjeta, pxEnun);
  const altoEnun = Math.ceil(lineasEnun * pxEnun * interEnun);

  const unaAlt = alternativas[0];
  const padAltX = valorDe(unaAlt.clases, 'px-', ESPACIO, 0);
  const padAltY = valorDe(unaAlt.clases, 'py-', ESPACIO, 0);
  const gapAlt = valorDe(unaAlt.clases, 'gap-', ESPACIO, 0);
  const pxAlt = TAMANOS[unaAlt.clases.find((c) => c in TAMANOS)] ?? 16;
  const interAlt = INTERLINEA[unaAlt.clases.find((c) => c in INTERLINEA)] ?? 1.5;

  // La marca ocupa su sitio siempre: `w-5` mas el `gap-3` de la fila.
  const anchoAlt = anchoTarjeta - 2 * padAltX - 2 - ESPACIO[5] - gapAlt;

  const altosDeLasAlternativas = maqueta.PREGUNTA_DE_EJEMPLO.alternativas.map((a) => {
    const lineas = lineasDe(a.texto, anchoAlt, pxAlt);
    return { lineas, alto: Math.ceil(lineas * pxAlt * interAlt) + 2 * padAltY + 2 };
  });

  const gapLista = valorDe(lista.clases, 'gap-', ESPACIO, 0);
  const mtLista = valorDe(lista.clases, 'mt-', ESPACIO, 0);
  const mtEnun = valorDe(enunciado.clases, 'mt-', ESPACIO, 0);

  const altoDeLasAlternativas =
    altosDeLasAlternativas.reduce((s, a) => s + a.alto, 0) + 3 * gapLista;

  const altoDeLaTarjeta =
    2 * padTarjeta + 2 + altoNumero + mtEnun + altoEnun + mtLista + altoDeLasAlternativas;

  const unBoton = caminar(PANTALLAS.intento).find((el) => el.papel === 'siguiente');
  const padBotonY = valorDe(unBoton.clases, 'py-', ESPACIO, 0);
  const pxBoton = TAMANOS[unBoton.clases.find((c) => c in TAMANOS)] ?? 16;
  const altoDeLosBotones = Math.ceil(pxBoton * 1.5) + 2 * padBotonY;
  const mtBotones = valorDe(botones.clases, 'mt-', ESPACIO, 0);

  // Lo que la pantalla pide por debajo de la franja: el aire entre la franja y la
  // tarjeta, la tarjeta, la separacion y los botones.
  const AIRE_BAJO_LA_FRANJA = 24;
  const pedido = AIRE_BAJO_LA_FRANJA + altoDeLaTarjeta + mtBotones + altoDeLosBotones;

  const ENCABEZADO = ESPACIO[16];
  const arribaFijo = ENCABEZADO + maqueta.ALTO_DE_LA_FRANJA;

  const desplazamientos = [667, 812].map((alto) => ({
    alto,
    util: alto - arribaFijo,
    desplaza: Math.max(0, pedido - (alto - arribaFijo)),
  }));

  notas.push(
    `Alto de la maqueta con el peor caso (pregunta ${maqueta.PREGUNTA_DE_EJEMPLO.id}), a 375 px:\n` +
      `      contenido util            ${ANCHO_DEL_CONTENIDO} px de ancho (seccion px-5)\n` +
      `      numero de pregunta        ${altoNumero} px\n` +
      `      enunciado                 ${lineasEnun} lineas a ${pxEnun} px -> ${altoEnun} px\n` +
      `      alternativas              ${altosDeLasAlternativas.map((a) => a.lineas).join('+')} lineas a ${pxAlt} px -> ${altoDeLasAlternativas} px\n` +
      `      tarjeta entera            ${altoDeLaTarjeta} px\n` +
      `      botones                   ${altoDeLosBotones} px\n` +
      `      pide bajo la franja       ${pedido} px\n` +
      desplazamientos
        .map(
          (d) =>
            `      en 375x${d.alto}            ${d.util} px utiles -> ` +
            (d.desplaza === 0 ? 'entra entera' : `hay que desplazar ${d.desplaza} px`)
        )
        .join('\n')
  );

  // La alternativa con el token que no se puede cortar, que es el caso de ancho.
  const TOKEN = 'document.getElementById("nodo").click();';
  const lineasDelToken = lineasDe(TOKEN, anchoAlt, pxAlt);
  const anchoDelToken = anchoDe(TOKEN, pxAlt);

  notas.push(
    `Token de 40 caracteres sin espacios: mide ${Math.round(anchoDelToken)} px a ${pxAlt} px y la ` +
      `alternativa le da ${Math.round(anchoAlt)} px, asi que pide ${lineasDelToken} lineas. ` +
      'Sin `break-words` no cortaria y desbordaria a lo ancho; con el, corta.'
  );
}

// ---------------------------------------------------------------------------
// 15 · Veredicto
// ---------------------------------------------------------------------------

const anchoColumna = {
  pantalla: Math.max(...filas.map((f) => f.pantalla.length), 8),
  elemento: Math.max(...filas.map((f) => f.elemento.length), 8),
  clase: Math.max(...filas.map((f) => f.clase.length), 5),
};

console.log(`\n${LINEA}`);
console.log('CONTRASTE, CALCULADO SOBRE EL FONDO REAL DE CADA ELEMENTO');
console.log(LINEA);
console.log(
  `  ${'pantalla'.padEnd(anchoColumna.pantalla)}  ${'elemento'.padEnd(anchoColumna.elemento)}  ` +
    `${'clase'.padEnd(anchoColumna.clase)}  ${'tam.'.padEnd(11)} ${'fondo'.padEnd(9)} ` +
    `${'de donde'.padEnd(34)} ${'razon'.padStart(8)}  umbral`
);

for (const f of filas) {
  console.log(
    `  ${f.pantalla.padEnd(anchoColumna.pantalla)}  ${f.elemento.padEnd(anchoColumna.elemento)}  ` +
      `${f.clase.padEnd(anchoColumna.clase)}  ${String(f.px).padEnd(11)} ${f.fondo.padEnd(9)} ` +
      `${f.deDondeSaleElFondo.padEnd(34)} ${(f.razon.toFixed(2) + ':1').padStart(8)}  ${f.umbral}:1  ` +
      `${f.excepcion ? 'excepcion' : f.pasa ? 'ok' : 'NO'}`
  );
}

console.log(`\n  ${filas.length} mediciones, ${filas.filter((f) => !f.pasa).length} bajo su umbral, ` +
  `${filas.filter((f) => f.excepcion).length} con excepcion declarada.`);

if (problemas.length > 0) {
  anunciar(`IDENTIDAD VISUAL ROTA  ***  ${problemas.length}  ***`, [
    ...problemas.map((p) => `  ${p}`),
    '',
    'La direccion visual del simulacro no es la que la guia dice que es.',
  ]);
  terminar(ROTO);
}

anunciar('IDENTIDAD VISUAL EN PIE', [
  ...notas.map((n) => `  · ${n}`),
  '',
  'Lo que esto NO prueba, y comprueba el autor en un navegador: que el alto calculado',
  'sea el que el navegador pinta, y que el significado declarado de cada color sea el',
  'que el estudiante entiende.',
]);

terminar(CORRECTO);
