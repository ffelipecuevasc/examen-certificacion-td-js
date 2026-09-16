/**
 * La cifra de preguntas que publica la portada: donde vive y quien la escribe.
 *
 * POR QUE ESTE ARCHIVO EXISTE
 *
 * La portada decia **21 preguntas de practica** cuando el banco tiene 368. El
 * numero estaba escrito a mano y nada lo vigilaba, asi que sobrevivio a la
 * iteracion 24, a la 25 y a todo el llenado del banco. Un numero escrito a mano
 * no se desfasa por descuido: se desfasa porque **nadie tiene el deber de
 * mirarlo**.
 *
 * LA DECISION 4 BIS DE LA ITERACION 36
 *
 * La primera version de la iteracion inyectaba la cifra al construir. Se descarto:
 * dejaba `index.html` versionado con un marcador —y ADR-010 conserva a proposito la
 * propiedad de que el repositorio sea por si solo una copia servible del sitio—, y
 * su garantia dependia de que el panel de Cloudflare siguiera ejecutando
 * `npm run build`, que es justo lo que ningun archivo del repositorio puede fijar
 * (`_planmaestro/90-manual/capa-de-datos-y-base-d1.md:54`).
 *
 * Lo que se hace en su lugar, y es lo que este archivo implementa:
 *
 *   1. **La cifra real vive escrita en `index.html`.** El repositorio sigue siendo
 *      servible tal cual, y da igual que comando corra el panel.
 *   2. **`npm run verificar` da rojo si no coincide** con la instantanea versionada
 *      (scripts/comprobar-cifra.mjs). Ahi esta el deber que faltaba.
 *   3. **El guion que regenera la instantanea la reescribe en el mismo acto**
 *      (scripts/publicar-banco.mjs y scripts/generar-instantanea.mjs), para que
 *      actualizarla no dependa de acordarse.
 *
 * COMO SE MARCA UNA CIFRA EN EL HTML
 *
 * Con el atributo **`data-cifra-banco`**. No se busca «el numero que hay despues de
 * la palabra preguntas» ni se confia en el orden de los `data-count`: la portada
 * tiene tres metricas numericas y solo una es el tamano del banco. El atributo dice
 * cual, y marcar una cifra nueva basta para que quede vigilada y se reescriba sola.
 *
 * Hay dos formas, porque las dos existen en la pagina:
 *
 *   atributo   <dd data-cifra-banco data-count="368">0</dd>
 *              La metrica del hero. El numero vive en data-count porque lo anima
 *              static/js/components/nav.js contando desde cero.
 *
 *   texto      <span data-cifra-banco>368</span> preguntas · 7 modulos
 *              La pildora de la llamada al cuestionario. Esta decia 105.
 *
 * NO SE INTERPRETA EL HTML CON UN ANALIZADOR. Son dos expresiones regulares
 * ancladas al atributo, sobre un archivo del propio repositorio que escribimos
 * nosotros. Meter una dependencia nueva para esto seria desproporcionado, y las
 * dependencias nuevas necesitan ADR.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const PORTADA = join(RAIZ, 'index.html');
export const INSTANTANEA = join(RAIZ, 'static', 'js', 'data', 'instantanea-banco.js');

/**
 * Las dos formas de marcar la cifra, cada una partida en tres para poder
 * reescribir solo el numero sin tocar el resto de la etiqueta.
 */
const FORMAS = [
  {
    nombre: 'atributo',
    ejemplo: '<dd data-cifra-banco data-count="368">',
    patron: /(data-cifra-banco[^>]*\bdata-count=")(\d+)(")/g,
  },
  {
    nombre: 'texto',
    ejemplo: '<span data-cifra-banco>368</span>',
    patron: /(<span data-cifra-banco\s*>)(\d+)(<\/span>)/g,
  },
];

/** Lo que dice hoy el HTML: una entrada por cifra marcada. */
export function cifrasEnHtml(html) {
  const encontradas = [];

  for (const forma of FORMAS) {
    // Las expresiones llevan /g y guardan estado entre usos. Se reinicia siempre.
    forma.patron.lastIndex = 0;
    for (const coincidencia of html.matchAll(forma.patron)) {
      const antes = html.slice(0, coincidencia.index);
      encontradas.push({
        forma: forma.nombre,
        valor: Number(coincidencia[2]),
        linea: antes.split('\n').length,
      });
    }
  }

  return encontradas.sort((a, b) => a.linea - b.linea);
}

/** El mismo HTML con todas las cifras marcadas puestas en `cifra`. */
export function reescribirCifra(html, cifra) {
  let salida = html;
  for (const forma of FORMAS) {
    forma.patron.lastIndex = 0;
    salida = salida.replace(forma.patron, (_, abre, __, cierra) => `${abre}${cifra}${cierra}`);
  }
  return salida;
}

/** Las formas reconocidas, para que los mensajes de error puedan mostrarlas. */
export const formasReconocidas = () => FORMAS.map((f) => `${f.nombre.padEnd(9)} ${f.ejemplo}`);

/**
 * Cuantas preguntas trae una instantanea.
 *
 * Manda **el largo de PREGUNTAS**, no `SELLO.preguntas`: el sello es lo que el
 * generador dijo que escribio, y el arreglo es lo que el estudiante va a recibir
 * de verdad el dia de la caida. Si los dos discrepan, quien lo caza es
 * scripts/comprobar-instantanea.mjs, que para eso compara contra el respaldo; aqui
 * se usa el que no puede mentir y se devuelven los dos para poder decirlo.
 */
export async function cifraDeLaInstantanea(archivo = INSTANTANEA) {
  if (!existsSync(archivo)) {
    return { error: `No existe ${archivo.replace(RAIZ, '.')}.` };
  }

  let modulo;
  try {
    modulo = await import(`${pathToFileURL(archivo).href}?t=${Date.now()}`);
  } catch (error) {
    return { error: `No pude leer la instantanea: ${error.message}` };
  }

  if (!Array.isArray(modulo?.PREGUNTAS)) {
    return { error: 'La instantanea no exporta PREGUNTAS como arreglo.' };
  }

  return { cifra: modulo.PREGUNTAS.length, sello: modulo.SELLO ?? null };
}

/**
 * El unico sello con el que la portada se deja escribir.
 *
 * ES LA PROTECCION DE ADR-023, EXTENDIDA A LA PORTADA. La instantanea ya estaba
 * defendida por dos lados: `generar-instantanea.mjs` se niega a pisar una
 * instantanea de la nube con una local, y `comprobar-instantanea.mjs` da rojo si
 * el sello no dice «nube». La portada no tenia ninguna de las dos, y por ahi se
 * colaba esto:
 *
 *   alguien corre el generador contra la base LOCAL para probar el modo degradado
 *   —con PERMITIR_INSTANTANEA_LOCAL=1, que es un camino legitimo—, la instantanea
 *   queda con las diez filas de juguete, y la portada se reescribia con esa cifra.
 *
 * El numero publicado pasaba a ser el del banco de juguete. No era un agujero
 * silencioso —`comprobar-instantanea` gritaba por el sello y por la comparacion
 * contra el respaldo— pero el grito venia del vecino: nada defendia la cifra
 * misma, y quien mirara solo la linea `cifra` de `npm run verificar` la veia en
 * verde, porque portada e instantanea coincidian en un numero falso.
 *
 * Con esta puerta, la cifra de la portada solo puede salir de una instantanea que
 * de verdad venga del banco publicado.
 */
export const ENTORNO_PUBLICABLE = 'nube';

/** Si de esta instantanea se puede sacar una cifra para publicar. */
export const selloPublicable = (sello) => sello?.entorno === ENTORNO_PUBLICABLE;

/** El porque y el como salir, para que cada guion lo cuente a su manera. */
export function motivoDelRechazo(sello) {
  const dice = sello?.entorno ? `«${sello.entorno}»` : '(sin sello)';

  return [
    `EL SELLO DE LA INSTANTANEA DICE ${dice}, y la portada solo publica cifras de «${ENTORNO_PUBLICABLE}».`,
    '',
    'Una instantanea que no salio de la nube es el banco de juguete: diez filas de',
    'ejemplo. Escribir su cifra dejaria la portada anunciando ese numero como si',
    'fuera el banco real, y el error solo se veria publicado.',
    '',
    'Es la misma proteccion de ADR-023 que ya defiende la instantanea, puesta',
    'tambien sobre la portada.',
    '',
    'Si estabas probando el modo degradado en local, esto es lo correcto y no hay',
    'nada que arreglar: la portada se queda con la cifra del banco publicado.',
    'Cuando vuelvas a generar la instantanea desde la nube, la cifra se escribe',
    'sola. Para reponerla a mano:',
    '',
    '  npm run datos:cifra',
  ];
}

/**
 * Deja la portada diciendo `cifra`. Devuelve que paso, sin imprimir nada:
 * quien llama decide como contarlo.
 *
 * Recibe la instantanea entera —`{ cifra, sello }`, tal como la devuelve
 * `cifraDeLaInstantanea`— y no el numero suelto, a proposito: el sello es
 * condicion para escribir, asi que quien pida la escritura tiene que haber
 * mirado de donde sale el numero. Con la firma anterior se podia pasar un
 * entero sin mas, y eso es justo lo que dejaba entrar la cifra del juguete.
 *
 * `archivo` existe para poder demostrar esto sobre una copia temporal. Escribir
 * sobre el `index.html` versionado desde una prueba seria exactamente lo que la
 * regla 4 de la iteracion prohibe.
 */
export function escribirCifraEnPortada({ cifra, sello }, archivo = PORTADA) {
  if (!selloPublicable(sello)) {
    return { ok: false, negada: true, sello, motivo: motivoDelRechazo(sello) };
  }

  if (!existsSync(archivo)) {
    return { ok: false, motivo: [`No existe ${archivo.replace(RAIZ, '.')}.`] };
  }

  const antes = readFileSync(archivo, 'utf8');
  const marcadas = cifrasEnHtml(antes);

  if (marcadas.length === 0) {
    return {
      ok: false,
      motivo: ['No encontre ninguna cifra marcada con data-cifra-banco.'],
    };
  }

  const despues = reescribirCifra(antes, cifra);
  const cambiadas = marcadas.filter((m) => m.valor !== cifra);

  if (despues !== antes) writeFileSync(archivo, despues, 'utf8');

  return { ok: true, marcadas, cambiadas, cambio: despues !== antes };
}
