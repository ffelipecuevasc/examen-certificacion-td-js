/**
 * El marcado estatico del intento y del resumen (iteracion 45).
 *
 * QUE ES ESTE ARCHIVO, Y QUE NO ES
 *
 * Es la **direccion visual del simulacro escrita en marcado**, para que la 42, la 43
 * y la 44 la conecten sin rehacerla. Aqui no se mueve nada: el cronometro no cuenta,
 * el recorrido no avanza y el resultado no se calcula. Lo que hay son funciones que
 * dibujan, y datos de ejemplo con los que llamarlas.
 *
 * **Se dibuja con funciones y no con HTML pegado en la pagina** por un motivo
 * concreto: lo que la 43 tiene que hacer para conectar el intento es llamar a
 * `dibujarPantallaDelIntento()` con la pregunta de verdad en vez de la de ejemplo. Si
 * la maqueta fuera HTML suelto, conectarla significaria volver a escribirla, que es
 * exactamente lo que esta iteracion existe para evitar.
 *
 * COMO SE MIRA
 *
 *   simulacro.html?maqueta=intento
 *   simulacro.html?maqueta=intento&urgente=1
 *   simulacro.html?maqueta=intento&avisos=1
 *   simulacro.html?maqueta=resumen
 *   simulacro.html?maqueta=resumen&reprobado=1
 *   simulacro.html?maqueta=resumen&avisos=1
 *
 * `avisos=1` enciende los dos avisos de la decision 6 -el de la copia guardada y el de
 * que el intento no se esta guardando-, compactos en el intento y enteros en el
 * resumen. Van detras de un parametro porque son estados excepcionales: encendidos por
 * omision sumarian su alto al presupuesto vertical y el numero calculado dejaria de ser
 * el de la pantalla normal.
 *
 * No hay enlace a ninguna de las tres, igual que no lo hay a la pagina: se llega
 * escribiendo la direccion. Los enlaces son de la iteracion 44 (decision 13).
 *
 * EL CONTENIDO DE EJEMPLO ES EL PEOR CASO DEL BANCO, NO UNA PREGUNTA MEDIA
 *
 * La **pregunta 94** -384 caracteres entre enunciado y alternativas, empatada con la
 * 254 en el primer lugar del banco- y, en la revision del resumen, la alternativa con
 * el **token de 40 caracteres sin espacios** de la pregunta 31. Una maqueta dibujada
 * con una pregunta corta se ve bien y no prueba nada: lo que hay que poder mirar es
 * si el peor caso cabe, se lee y se alcanza con el pulgar.
 *
 * LOS TEXTOS DE EJEMPLO SE ESCAPAN IGUAL
 *
 * Estan copiados de la instantanea y son, por lo tanto, contenido de origen externo:
 * pasan por `esc()` como cualquier otro. La regla del proyecto no tiene una excepcion
 * para «es solo una maqueta», y es justo donde se colaria.
 *
 * DE DONDE SALE CADA CLASE
 *
 * De la guia visual de
 * `_planmaestro/40-epica-simulacro-examen/iteracion-45-identidad-visual.md`. Si algo
 * de aqui no coincide con esa tabla, manda la tabla y esto es el error.
 */
import { esc, icon } from '../utils/dom.js';

/**
 * El alto de la franja fija, en pixeles, segun las clases que declara.
 *
 * Esta escrito aqui y no solo en la guia porque `probar-identidad-visual.mjs` compara
 * el tope de 72 px de la decision 1 **contra las clases del marcado**, no contra un
 * numero escrito en la prueba. Son `h-14` (56 px) mas el `border-b` de 1 px.
 */
export const ALTO_DE_LA_FRANJA = 57;

/**
 * El borde de todas las superficies del simulacro (decision 8).
 *
 * `muted` al 60 % da **3,12:1 sobre `ink` y 3,12:1 sobre `panel`**: es el unico valor
 * de la paleta cerrada que cruza el 3:1 de WCAG 1.4.11 en las dos superficies con un
 * solo token. `border-panel3`, que es lo que habia, daba 1,31:1 y 1,18:1.
 *
 * Se exporta porque lo usan tambien `components/simulacro.js` y el guion que comprueba
 * el contraste: un borde escrito cinco veces se despinta en cuatro.
 */
export const BORDE_DEL_SIMULACRO = 'border-muted/60';

/**
 * La pregunta de ejemplo: la 94 del banco, tal como la trae la instantanea.
 *
 * Esta copiada a mano y no importada de `data/instantanea-banco.js` a proposito. Dos
 * motivos: la maqueta tiene que dibujar SIEMPRE el peor caso, y no el que le toque el
 * dia que el banco cambie; y traer los 368 registros del banco a una pagina para sacar
 * uno seria cargar el banco entero para dibujar 384 caracteres.
 *
 * `es_correcta` no se dibuja: durante el intento no se revela nada (decision 5). Esta
 * porque la 43 va a recibir la pregunta entera, y conviene que la forma del dato de
 * ejemplo sea la forma del dato de verdad.
 */
export const PREGUNTA_DE_EJEMPLO = {
  id: 94,
  modulo: 3,
  enunciado:
    'Al invocar `sort()` sin argumentos sobre el arreglo [10, 9, 100], ¿en qué orden queda y por qué?',
  alternativas: [
    {
      id: 373,
      texto: '[10, 100, 9], porque compara los elementos como texto y no como números.',
      es_correcta: 1,
    },
    {
      id: 374,
      texto: '[9, 10, 100], porque el método detecta el tipo numérico automáticamente.',
      es_correcta: 0,
    },
    {
      id: 375,
      texto: '[100, 10, 9], porque sin argumentos ordena de mayor a menor por omisión.',
      es_correcta: 0,
    },
    {
      id: 376,
      texto: '[10, 9, 100], porque sin función comparadora conserva el orden original.',
      es_correcta: 0,
    },
  ],
};

/**
 * La alternativa con el token mas largo del banco sin un solo espacio.
 *
 * 40 caracteres, de la pregunta 31. Es el caso que `break-words` existe para tapar, y
 * por eso entra en la revision del resumen: si algun dia se desborda a lo ancho en
 * 375 px, se ve aqui y no en el telefono de un estudiante.
 */
const TOKEN_MAS_LARGO = 'document.getElementById("nodo").click();';

/**
 * Lo que se ve arriba del todo mientras se responde.
 *
 * TRES DATOS Y NI UNO MAS, en una sola linea de 56 px: los segundos que quedan, el
 * avance, y el tiempo que llevas. Cabe en el tope de 72 px de la decision 1 con 15 px
 * de sobra, y **no cambia de alto nunca**: si creciera al entrar la urgencia,
 * empujaria la pregunta hacia abajo justo en el segundo en que el estudiante esta
 * decidiendo, que es el peor momento posible para mover el texto que esta leyendo.
 *
 * COMO SE DICE LA URGENCIA (decision 3), y son tres cosas a la vez:
 *
 *   1. **La franja cambia de superficie**: de `ink` a `jsyellow`, con el texto en
 *      `ink`. No es un matiz: la barra pasa de negra a amarilla entera, y en escala de
 *      grises pasa de casi negro a casi blanco. Es el unico cambio de superficie que
 *      la paleta permite y que se ve sin color: `panel2` sobre `ink` da 1,19:1 y
 *      `panel3` 1,31:1, o sea que no se distinguen del negro por si solos.
 *   2. **Aparece un texto**: «quedan 5 segundos». Ocupa el sitio del avance, que es el
 *      dato que menos falta hace durante esos cinco segundos y el unico que ademas
 *      esta escrito en la tarjeta de abajo.
 *   3. **La cifra sigue ahi**, y baja. Es lo que la decision 2 pide: una cifra escrita
 *      por JavaScript en cada latido, sin ninguna animacion CSS de 30 segundos que con
 *      movimiento reducido se completaria en el primer fotograma y dejaria el
 *      cronometro en cero desde el segundo cero.
 *
 * `data-papel` marca cada hueco para que la 42 escriba dentro sin buscar por clases.
 */
export function dibujarFranjaDelIntento({
  segundos,
  posicion,
  total,
  transcurrido,
  urgente = false,
}) {
  const superficie = urgente
    ? 'bg-jsyellow border-b border-jsyellow'
    : `bg-ink border-b ${BORDE_DEL_SIMULACRO}`;

  const tinta = urgente ? 'text-ink' : 'text-jsyellow';
  const tintaSecundaria = urgente ? 'text-ink' : 'text-muted';

  // El sitio del medio: el avance en reposo, el aviso de urgencia cuando toca. Es un
  // solo hueco y no dos escondiendose, para que no exista ningun estado en que los dos
  // esten puestos a la vez.
  const enElMedio = urgente
    ? `<span data-papel="aviso-de-urgencia" class="font-display font-bold text-sm ${tintaSecundaria} truncate">quedan ${esc(segundos)} segundos</span>`
    : `<span data-papel="avance-del-intento" class="font-mono text-xs ${tintaSecundaria} truncate">${esc(posicion)}/${esc(total)}</span>`;

  return `
    <div data-papel="franja-del-intento" class="fixed top-16 inset-x-0 z-40 ${superficie}">
      <div class="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">

        <p class="flex items-baseline gap-1.5 shrink-0">
          ${icon('clock', `text-lg self-center ${tinta}`)}
          <span data-papel="cronometro" class="font-mono font-bold text-4xl leading-none tabular-nums ${tinta}">${esc(segundos)}</span>
          <span class="font-mono text-xs ${tintaSecundaria}">s</span>
        </p>

        ${enElMedio}

        <p class="flex items-center gap-1.5 shrink-0">
          ${icon('clock-total', `text-base ${tintaSecundaria}`)}
          <span data-papel="transcurrido" class="font-mono text-sm tabular-nums ${tintaSecundaria}">${esc(transcurrido)}</span>
        </p>

      </div>
    </div>`;
}

/**
 * Una alternativa del intento.
 *
 * NO ES `.quiz-option`, Y ESA ES LA DECISION 5. Las del cuestionario existen para
 * **revelar** -tienen estados `correct`, `wrong` y `dimmed`-, y durante el intento no
 * se revela nada: la unica diferencia que el estudiante puede ver es si la marco o no.
 * Ademas `.quiz-option[data-state='wrong']` pinta con `#7a2e2e` y `#e8b4b4`, dos
 * colores que no estan entre los trece tokens.
 *
 * Comparten forma, tamano y borde con las del cuestionario a proposito: son de la
 * misma familia, y eso es lo que hace que la pagina se reconozca como parte del sitio.
 *
 * MARCADA SE DICE CON TRES COSAS, Y NINGUNA ES EL AMARILLO. El borde pasa a `paper`,
 * el fondo a `panel2` y **aparece el icono**. El amarillo no participa porque en esta
 * pantalla `jsyellow` ya significa el tiempo, y un color que significa dos cosas es lo
 * que el criterio de la iteracion prohibe. El icono es ademas lo que la distingue en
 * escala de grises.
 *
 * `break-words` no es decorativo: 111 preguntas del banco traen un token de 16
 * caracteres o mas, el mayor tiene 40, y hasta hoy nada declaraba el corte.
 */
function dibujarAlternativaDelIntento(alternativa, marcada) {
  const piel = marcada
    ? 'border-paper bg-panel2'
    : `${BORDE_DEL_SIMULACRO} bg-panel hover:border-paper`;

  // La marca ocupa su sitio siempre, puesta o no: si apareciera solo al marcar, el
  // texto se correria a la derecha bajo el dedo que acaba de tocarlo.
  const marca = marcada
    ? icon('check-circle', 'text-xl text-paper shrink-0')
    : '<span class="w-5 shrink-0" aria-hidden="true"></span>';

  return `
          <li>
            <button type="button" data-papel="alternativa" data-alternativa="${esc(alternativa.id)}"${marcada ? ' data-marcada="true" aria-pressed="true"' : ' aria-pressed="false"'}
                    class="flex items-start gap-3 text-left w-full border ${piel} rounded-lg px-4 py-3.5 text-base text-paper leading-normal break-words transition-colors">
              ${marca}<span class="min-w-0">${esc(alternativa.texto)}</span>
            </button>
          </li>`;
}

/**
 * La tarjeta de la pregunta: numero, enunciado y cuatro alternativas.
 *
 * LA ESCALA ES LO QUE SEPARA ESTA PANTALLA DEL CUESTIONARIO. El enunciado va a 20 px
 * en negrita contra los 16 de alla, y las alternativas a 16 px contra 14. No es
 * capricho: aqui se lee una sola pregunta con el reloj encima, y alla se leen sesenta
 * con calma. La densidad acompana -`p-6` contra `p-5`, `py-3.5` contra `py-3`,
 * `gap-2.5` contra `gap-2`-, que es lo que hace que se vea distinto antes de leer una
 * palabra.
 *
 * EL NUMERO VA ARRIBA DEL ENUNCIADO Y NO A SU COSTADO. En el cuestionario va al lado
 * porque hay sesenta y hace de indice; aqui hay una, y lo que el numero dice -«12 de
 * 120»- es avance, no identidad. Puesto al costado, robaria ancho al enunciado justo
 * en 375 px, que es donde no sobra.
 */
export function dibujarTarjetaDeLaPregunta({ pregunta, posicion, total, marcada = null }) {
  const alternativas = pregunta.alternativas
    .map((a) => dibujarAlternativaDelIntento(a, marcada === a.id))
    .join('');

  return `
      <article data-papel="tarjeta-de-la-pregunta" class="bg-panel border ${BORDE_DEL_SIMULACRO} rounded-xl p-6">

        <p data-papel="numero-de-pregunta" class="font-mono text-xs text-muted">Pregunta ${esc(posicion)} de ${esc(total)} · Módulo ${esc(pregunta.modulo)}</p>

        <h2 data-papel="enunciado" class="mt-3 font-display font-bold text-xl text-paper leading-snug break-words">${esc(pregunta.enunciado)}</h2>

        <ul data-papel="alternativas" class="mt-5 grid gap-2.5">${alternativas}
        </ul>

      </article>`;
}

/**
 * Los dos botones del pie del intento.
 *
 * «SIGUIENTE» ES AMARILLO, COMO EL BOTON PRINCIPAL DE TODO EL SITIO (correccion del
 * autor, 2026-09-18). La primera version lo puso en `paper` para que en esta pantalla
 * el amarillo significara solo el tiempo; el autor decidio lo contrario tras verlo en
 * el navegador, y con razon: un boton principal que en esta pagina se pinta distinto
 * que en las otras dos rompe la costumbre del sitio para resolver un problema que la
 * franja ya resuelve sola.
 *
 * **En el intento, `jsyellow` significa el tiempo Y la accion.** La urgencia no se
 * distingue por ser el unico amarillo de la pantalla -no lo es-, sino porque **cambia
 * la superficie entera de la franja** y **aparece su texto**. Un boton amarillo de
 * 16 px al pie no se confunde con una barra amarilla de ancho completo pegada al
 * encabezado que dice «quedan 5 segundos» con una cifra de 36 px al lado.
 *
 * «OMITIR» conserva el fondo oscuro y **pasa su borde y su icono a `jsyellow`**: es el
 * secundario de la pareja, y se lee como tal sin dejar de pertenecer a la misma
 * familia. Su texto se queda en `paper` -19,57:1 sobre `ink`-, que es lo que lo hace
 * legible; el amarillo del borde da 15,53:1 y el del icono lo mismo.
 *
 * «OMITIR» PIDE UN SEGUNDO TOQUE (regla 5 del simulacro), y eso lo conecta la 43. Lo
 * que la maqueta deja puesto es el sitio y el icono; el texto de confirmacion lo
 * escribe esa iteracion.
 */
export function dibujarBotonesDelIntento() {
  return `
      <div data-papel="botones-del-intento" class="mt-6 flex items-center gap-3">
        <button type="button" data-papel="siguiente" class="inline-flex items-center justify-center gap-2 grow bg-jsyellow text-ink font-display font-bold text-base px-6 py-4 rounded hover:bg-jsyellowdim transition-colors">Siguiente${icon('next', 'text-xl')}</button>
        <button type="button" data-papel="omitir" class="inline-flex items-center justify-center gap-2 shrink-0 border border-jsyellow text-paper font-display font-bold text-base px-5 py-4 rounded hover:bg-panel2 transition-colors">${icon('skip', 'text-xl text-jsyellow')}Omitir</button>
      </div>`;
}

/**
 * La pantalla del intento entera: franja fija arriba y la pregunta debajo.
 *
 * LA CUENTA VERTICAL, QUE ES LO UNICO DELICADO DE ESTA FUNCION
 *
 * La franja es `fixed`, asi que **no ocupa sitio en el flujo**: sin compensarla, la
 * primera linea de la pregunta nace debajo de ella y tapada. Y la seccion que envuelve
 * todo esto trae `py-14` (56 px) y `sm:py-20` (80 px), que existen para que la
 * presentacion respire bajo el encabezado y aqui sobran enteros, porque quien manda el
 * aire de esta pantalla es la franja.
 *
 * Por eso son dos cosas y no una:
 *
 *   `-mt-14 sm:-mt-20`  devuelve el relleno de la seccion, que aqui no corresponde.
 *   `pt-[81px]`         57 px de franja mas 24 px de aire.
 *
 * Con eso la tarjeta empieza a **145 px** del borde de la ventana: 64 del encabezado
 * fijo, 57 de la franja y 24 de aire. Si se quitara el `-mt-`, empezaria a 201 px y se
 * perderian 56 px del presupuesto vertical sin que nada los ocupara.
 */
export function dibujarPantallaDelIntento({
  pregunta = PREGUNTA_DE_EJEMPLO,
  posicion = 12,
  total = 120,
  transcurrido = '06:12',
  segundos = 30,
  urgente = false,
  marcada = null,
} = {}) {
  return `${dibujarFranjaDelIntento({ segundos, posicion, total, transcurrido, urgente })}
    <div data-papel="columna-del-intento" class="-mt-14 sm:-mt-20 pt-[81px]">${dibujarTarjetaDeLaPregunta({ pregunta, posicion, total, marcada })}${dibujarBotonesDelIntento()}
    </div>`;
}

// ---------------------------------------------------------------------------
// El resumen
// ---------------------------------------------------------------------------

/**
 * Los tres estados de una pregunta terminada, con su color, su icono y su palabra.
 *
 * LAS TRES COSAS JUNTAS, SIEMPRE. Quien no distingue el verde del rojo tiene el icono;
 * quien no ve el icono tiene la palabra. Es el criterio «todo significado expresado
 * con color trae ademas texto o icono», y esta escrito en una sola tabla para que no
 * se pueda cumplir en dos sitios y olvidar en el tercero.
 *
 * `ruby` NO APARECE COMO TEXTO DE TAMANO NORMAL en ninguna fila: da 3,98:1 sobre
 * `panel`, por debajo del 4,5:1. Donde se usa es como **icono y borde** -3:1 basta- y
 * como **texto grande en negrita**, donde el umbral tambien es 3:1.
 */
export const ESTADOS_DE_LA_REVISION = {
  correcta: {
    icono: 'check-circle',
    color: 'text-esmeralda',
    borde: 'border-esmeralda',
    palabra: 'Correcta',
  },
  incorrecta: {
    icono: 'cancel',
    color: 'text-ruby',
    borde: 'border-ruby',
    palabra: 'Incorrecta',
  },
  omitida: {
    icono: 'skip',
    color: 'text-muted',
    borde: 'border-muted',
    palabra: 'Omitida',
  },
};

/**
 * Una fila del desglose por modulo.
 *
 * Las tres cifras van con su icono y no con tres colores a secas: la fila tiene que
 * poder leerse en escala de grises, y tres numeros seguidos sin marca son tres
 * numeros.
 */
function dibujarFilaDelModulo({ modulo, correctas, incorrectas, omitidas }) {
  const celda = (estado, valor) => {
    const { icono, color, palabra } = ESTADOS_DE_LA_REVISION[estado];

    return `
              <span class="flex items-center gap-1"><span class="sr-only">${esc(palabra)}: </span>${icon(icono, `text-base ${color}`)}<span class="font-mono text-sm text-paper tabular-nums">${esc(valor)}</span></span>`;
  };

  return `
          <li data-papel="fila-del-modulo" class="flex items-center justify-between gap-4 border-b ${BORDE_DEL_SIMULACRO} py-3 last:border-b-0">
            <span class="font-display font-semibold text-sm text-paper shrink-0">Módulo ${esc(modulo)}</span>
            <span class="flex items-center gap-4">${celda('correcta', correctas)}${celda('incorrecta', incorrectas)}${celda('omitida', omitidas)}
            </span>
          </li>`;
}

/**
 * Una pregunta de la revision, con su estado.
 *
 * LA PALABRA VA EN `paper` Y NO EN EL COLOR DEL ESTADO, y esto se descubrio midiendo.
 * Escrita en su color, la de «Incorrecta» habria quedado en `text-ruby` a 14 px en
 * negrita: **3,98:1 sobre `panel`**, por debajo del 4,5:1 que pide un texto de tamano
 * normal, y sin llegar a los 18,66 px que la dejarian pasar como texto grande. Las
 * otras dos si pasaban —`esmeralda` 7,46:1 y `muted` 6,65:1—, y ahi estaba la trampa:
 * dos de tres en verde es exactamente como se cuela la tercera.
 *
 * Asi que el color lo llevan **el icono y el borde**, donde el umbral es 3:1 y los
 * tres lo cruzan, y la palabra lo lleva `paper`, a 17,64:1. El estado se sigue
 * diciendo de tres formas —color, forma y palabra—; lo que cambia es cual de las tres
 * carga con el texto.
 */
function dibujarFilaDeLaRevision({ posicion, enunciado, estado, tuRespuesta }) {
  const { icono, color, borde, palabra } = ESTADOS_DE_LA_REVISION[estado];

  return `
          <li data-papel="fila-de-la-revision" data-estado="${esc(estado)}" class="bg-panel border-l-2 ${borde} rounded-r-lg px-4 py-3">
            <p class="flex flex-wrap items-center gap-x-2">
              ${icon(icono, `text-base shrink-0 ${color}`)}<span class="font-display font-bold text-sm text-paper">${esc(palabra)}</span><span class="font-mono text-xs text-muted">· pregunta ${esc(posicion)}</span>
            </p>
            <p class="mt-1.5 text-sm text-paper leading-snug break-words">${esc(enunciado)}</p>
            <p class="mt-1 text-xs text-muted break-words">${esc(tuRespuesta)}</p>
          </li>`;
}

/**
 * La pantalla del resumen: resultado, desglose por modulo y revision.
 *
 * AQUI NO HAY CRONOMETRO, y es un criterio de la iteracion, no un olvido: el
 * cronometro pertenece al intento, y dejarlo puesto en una pantalla donde ya no corre
 * el tiempo seria un numero que no significa nada.
 *
 * Y AQUI SI ENTRAN `ruby` Y `esmeralda`, que durante el intento estaban prohibidos.
 * Esa es toda la separacion: en el intento el color habla del tiempo, en el resumen
 * habla del resultado, y ninguno de los dos habla de las dos cosas.
 *
 * LAS CIFRAS DE EJEMPLO SUMAN 120 y el 60 % justo -72 correctas, 39 incorrectas, 9
 * omitidas-, porque una maqueta cuyos numeros no cuadran ensena a no mirarlos.
 *
 * LA TARJETA DEL RESULTADO VA RELLENA DE COLOR (correccion del autor, 2026-09-18).
 * Era oscura como el resto y no llamaba la atencion, que en la pantalla donde se
 * entrega el resultado es justo lo contrario de lo que hace falta. `esmeralda` si se
 * aprobo, `ruby` si no, y todo lo de dentro en `ink`.
 *
 * Y ESO OBLIGO A MOVER UN PARRAFO, por una razon medida y no por gusto. `ink` sobre
 * `esmeralda` da **8,28:1** y cumple a cualquier tamano; `ink` sobre `ruby` da
 * **4,41:1**, que cumple el 3:1 del texto grande y de lo no textual pero **no el 4,5:1
 * del texto normal**. Dentro de la tarjeta, por lo tanto, no puede quedar ni un texto
 * chico: el rotulo, la cifra, el «de 120» y el veredicto pasan todos a 20 px o mas en
 * negrita -o a 48 px la cifra-, que es el umbral de 3:1. Y **la frase explicativa, que
 * es un parrafo y no puede ir en 20 px en negrita sin quedar ridicula, sale de la
 * tarjeta** y se queda justo debajo, sobre `ink`, donde `muted` da 7,37:1. No se
 * invento ningun color ni se salio de los trece tokens: se movio el unico elemento que
 * no cabia.
 *
 * LA TARJETA PIERDE SU BORDE, y no es un olvido ni una excepcion a la decision 8: un
 * borde existe para separar una superficie de lo que la rodea, y `esmeralda` sobre
 * `ink` da 8,28:1 y `ruby` 4,41:1, los dos muy por encima del 3:1 que WCAG 1.4.11
 * pide. La separacion la hace el relleno; agregarle un borde gris encima seria
 * decorar, no distinguir.
 */
export function dibujarPantallaDelResumen({ aprobado = true } = {}) {
  const modulos = [
    { modulo: 2, correctas: 11, incorrectas: 5, omitidas: 1 },
    { modulo: 3, correctas: 10, incorrectas: 6, omitidas: 2 },
    { modulo: 4, correctas: 11, incorrectas: 5, omitidas: 1 },
    { modulo: 5, correctas: 10, incorrectas: 6, omitidas: 1 },
    { modulo: 6, correctas: 10, incorrectas: 5, omitidas: 2 },
    { modulo: 7, correctas: 10, incorrectas: 6, omitidas: 1 },
    { modulo: 8, correctas: 10, incorrectas: 6, omitidas: 1 },
  ];

  const filas = modulos.map(dibujarFilaDelModulo).join('');

  // Los dos estados de la tarjeta del resultado. El reprobado no es una variante
  // decorativa: es la mitad de los casos, y es donde el contraste aprieta.
  const superficie = aprobado ? 'bg-esmeralda' : 'bg-ruby';
  const correctas = aprobado ? 72 : 61;
  const iconoDelVeredicto = aprobado ? 'check-circle' : 'cancel';
  const veredicto = aprobado ? 'Aprobaste el simulacro' : 'No alcanzaste el 60 %';

  const explicacion = aprobado
    ? 'Son 72 correctas de 120, el 60 % justo. Para aprobar el simulacro hacen falta 72.'
    : 'Son 61 correctas de 120. Para aprobar el simulacro hacen falta 72, que es el 60 %.';

  const revision = [
    {
      posicion: 12,
      enunciado: PREGUNTA_DE_EJEMPLO.enunciado,
      estado: 'correcta',
      tuRespuesta: `Marcaste: ${PREGUNTA_DE_EJEMPLO.alternativas[0].texto}`,
    },
    {
      posicion: 13,
      enunciado: '¿Cuál de estas formas dispara un clic sobre un nodo que ya existe?',
      estado: 'incorrecta',
      tuRespuesta: `Marcaste: ${TOKEN_MAS_LARGO}`,
    },
    {
      posicion: 14,
      enunciado:
        'Al modularizar la persistencia en archivos planos, ¿cuál es una buena práctica de diseño de código?',
      estado: 'omitida',
      tuRespuesta: 'No alcanzaste a responderla.',
    },
  ]
    .map(dibujarFilaDeLaRevision)
    .join('');

  return `
    <div data-papel="pantalla-del-resumen">

      <section data-papel="resultado" class="${superficie} rounded-xl p-6 text-center">
        <h2 class="font-display font-bold text-xl text-ink">Resultado del simulacro</h2>
        <p class="mt-2 flex items-baseline justify-center gap-2">
          <span data-papel="cifra-del-resultado" class="font-display font-bold text-5xl text-ink tabular-nums">${esc(correctas)}</span><span class="font-display font-bold text-xl text-ink">de 120</span>
        </p>
        <p data-papel="veredicto" class="mt-3 inline-flex items-center gap-2 border border-ink rounded-full px-4 py-2">
          ${icon(iconoDelVeredicto, 'text-xl text-ink')}<span class="font-display font-bold text-xl text-ink">${veredicto}</span>
        </p>
      </section>

      <p data-papel="explicacion-del-resultado" class="mt-4 text-sm text-muted leading-relaxed">${explicacion}</p>

      <section data-papel="desglose" class="mt-6 bg-panel border ${BORDE_DEL_SIMULACRO} rounded-xl p-6">
        <h2 class="font-display font-bold text-xl text-paper">Cómo te fue en cada módulo</h2>
        <p class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
          <span class="flex items-center gap-1">${icon('check-circle', 'text-sm text-esmeralda')}correctas</span><span class="flex items-center gap-1">${icon('cancel', 'text-sm text-ruby')}incorrectas</span><span class="flex items-center gap-1">${icon('skip', 'text-sm text-muted')}omitidas</span>
        </p>
        <ul class="mt-4">${filas}
        </ul>
      </section>

      <section data-papel="revision" class="mt-6">
        <h2 class="font-display font-bold text-xl text-paper">Revisa lo que respondiste</h2>
        <ul class="mt-4 grid gap-3">${revision}
        </ul>
      </section>

    </div>`;
}
