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
 * concreto: lo que la 43 hace para conectar el intento es llamar a
 * `dibujarTarjetaDeLaPregunta()` y `dibujarBotonesDelIntento()` con la pregunta de
 * verdad en vez de la de ejemplo. Si la maqueta fuera HTML suelto, conectarla
 * significaria volver a escribirla, que es exactamente lo que esta iteracion existe
 * para evitar.
 *
 * `dibujarPantallaDelIntento()` NO la usa el recorrido, y solo la llama la rama de la
 * maqueta en `simulacro-main.js`: devuelve tambien la franja, que en la pagina de
 * verdad vive fuera de `#zona-del-intento` y la escribe el cronometro. Llamarla desde
 * el recorrido dibujaria una segunda franja superpuesta (corregido en la 43).
 *
 * Lo que la 43 llama son las tres piezas de dentro —`dibujarTarjetaDeLaPregunta()`,
 * `dibujarBotonesDelIntento()` y `dibujarColumnaDelIntento()`—, que es para lo que
 * estan sueltas. `dibujarPantallaDelIntento()` se queda como lo que siempre fue: **la
 * pantalla entera para mirarla**, que usan `?maqueta=intento` y la tabla de contraste
 * de `probar-identidad-visual.mjs`.
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
 * EL ICONO ES `check-circle` Y NO SIGNIFICA «CORRECTA». Va en `text-paper`, el mismo
 * color que el texto de la alternativa, y el unico sitio donde ese icono significa
 * acierto es el resumen, donde va en `text-esmeralda`. Durante el intento no hay ni un
 * `esmeralda` ni un `ruby` dibujado, y eso es lo que el guion comprueba: no la forma
 * del icono, que aqui solo dice «esta es la que marcaste».
 *
 * `break-words` no es decorativo: 111 preguntas del banco traen un token de 16
 * caracteres o mas, el mayor tiene 40, y hasta hoy nada declaraba el corte.
 *
 * ES UN BOTON DE RADIO, Y NO UN INTERRUPTOR (decision del autor, 2026-09-18, hueco 7
 * de la lectura de la 43). La iteracion 45 las dejo con `aria-pressed`, que es lo que
 * le corresponde a un boton que se queda hundido y se puede soltar. Aqui no: las
 * cuatro son **una sola eleccion entre cuatro**, marcar una desmarca la anterior y no
 * existe el estado «ninguna marcada» una vez que se marco algo. Eso es un grupo de
 * radio, y decirlo con `aria-pressed` obligaba a quien usa lector de pantalla a
 * deducir la exclusion escuchando cuatro botones sueltos.
 *
 * Por eso `role="radio"` con `aria-checked`, dentro del `role="radiogroup"` de la
 * lista. Los `<li>` pasan a `role="none"`: un `radiogroup` solo admite `radio` entre
 * sus hijos, y un `listitem` en medio rompe la relacion que el lector anuncia.
 *
 * Y ES UNA SOLA PARADA DEL TABULADOR (decision 11 de la 43). `parada` dice cual de las
 * cuatro recibe el Tab: `tabindex="0"` en esa y `"-1"` en las demas, que siguen siendo
 * enfocables por programa. Sin esto eran cuatro paradas, y el grupo de radio que el
 * lector anuncia no se comportaba como tal.
 */
function dibujarAlternativaDelIntento(alternativa, marcada, parada) {
  const piel = marcada
    ? 'border-paper bg-panel2'
    : `${BORDE_DEL_SIMULACRO} bg-panel hover:border-paper`;

  // La marca ocupa su sitio siempre, puesta o no: si apareciera solo al marcar, el
  // texto se correria a la derecha bajo el dedo que acaba de tocarlo.
  const marca = marcada
    ? icon('check-circle', 'text-xl text-paper shrink-0')
    : '<span class="w-5 shrink-0" aria-hidden="true"></span>';

  return `
          <li role="none">
            <button type="button" role="radio" tabindex="${parada ? '0' : '-1'}" data-papel="alternativa" data-alternativa="${esc(alternativa.id)}"${marcada ? ' data-marcada="true" aria-checked="true"' : ' aria-checked="false"'}
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
 *
 * LA TARJETA LLEVA `tabindex="-1"`, Y NO ES DECORACION (decision del autor, 2026-09-18,
 * hueco 8 de la lectura de la 43). Es el asidero al que la iteracion 43 lleva el foco
 * cada vez que cambia la pregunta, que es COMO se anuncia el cambio. El motivo de
 * elegir el foco y no una region viva esta escrito entero en
 * `components/simulacro.js`, junto a la funcion que lo hace.
 *
 * `ID_DEL_ENUNCIADO` existe porque el `radiogroup` de las alternativas tiene que decir
 * de que pregunta es. Sin `aria-labelledby`, un lector de pantalla anuncia «grupo de
 * botones de radio» a secas y el enunciado queda arriba, suelto.
 */
export const ID_DEL_ENUNCIADO = 'enunciado-de-la-pregunta';

/** El hueco reservado del texto de confirmacion de «Omitir». Ver los botones. */
export const ID_DE_LA_CONFIRMACION = 'confirmacion-de-omitir';

export function dibujarTarjetaDeLaPregunta({ pregunta, posicion, total, marcada = null }) {
  // LA PARADA DEL TABULADOR ES UNA SOLA (decision 11 de la 43): la marcada o, si no
  // hay, la primera. Se pregunta si la marcada es DE ESTA pregunta y no solo si hay
  // una: un id que no esta aqui no puede quedarse con la parada.
  const hayMarcada = pregunta.alternativas.some((a) => a.id === marcada);

  const alternativas = pregunta.alternativas
      .map((a, i) =>
          dibujarAlternativaDelIntento(a, marcada === a.id, hayMarcada ? marcada === a.id : i === 0)
      )
      .join('');

  return `
      <article data-papel="tarjeta-de-la-pregunta" tabindex="-1" class="bg-panel border ${BORDE_DEL_SIMULACRO} rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-jsyellow/40">

        <p data-papel="numero-de-pregunta" class="font-mono text-xs text-muted">Pregunta ${esc(posicion)} de ${esc(total)} · Módulo ${esc(pregunta.modulo)}</p>

        <h2 id="${ID_DEL_ENUNCIADO}" data-papel="enunciado" class="mt-3 font-display font-bold text-xl text-paper leading-snug break-words">${esc(pregunta.enunciado)}</h2>

        <ul data-papel="alternativas" role="radiogroup" aria-labelledby="${ID_DEL_ENUNCIADO}" class="mt-5 grid gap-2.5">${alternativas}
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
 *
 * ---------------------------------------------------------------------------
 * LOS DOS BOTONES ESTAN SIEMPRE, Y SE APAGAN (decision del autor, 2026-09-18)
 * ---------------------------------------------------------------------------
 *
 * La decision 1 del archivo de la 43 —escrita el 2026-09-16, ANTES de que existiera
 * este marcado— describia **un solo boton que cambiaba de texto**: «Siguiente» con una
 * alternativa marcada, «Omitir» sin ella. El marcado de la 45 dibujo dos, y el autor
 * resolvio el 2026-09-18 que mandan los dos: la decision vieja quedo corregida en su
 * archivo, con constancia de lo que decia antes.
 *
 * Y se apagan en vez de desaparecer:
 *
 *   «Siguiente» deshabilitado mientras no haya alternativa marcada. Avanzar sin nada
 *   marcado no es avanzar: es omitir, y omitir tiene su propio boton y su confirmacion.
 *
 *   «Omitir» deshabilitado en cuanto hay una marcada, por la regla 5 de la epica: se
 *   omite **sin alternativa marcada**. Con una marcada no queda nada que saltarse.
 *
 * NINGUNO CAMBIA DE TEXTO NI DE ANCHO. Un boton que se renombra bajo el dedo es como
 * se pulsa lo que no se queria pulsar, y un boton que crece al confirmar mueve el otro.
 *
 * DONDE VA EL TEXTO DE LA CONFIRMACION (hueco 2 de la lectura de la 43). En una linea
 * propia **debajo** de los dos botones, con su alto reservado SIEMPRE, este o no la
 * confirmacion puesta. Reservarlo es lo que hace que aparecer no empuje el pie ni
 * desplace la tarjeta: el hueco ya estaba ahi, vacio. La otra salida —meter el texto
 * dentro del boton— es justo la que cambia el ancho bajo el dedo.
 *
 * El boton la nombra con `aria-describedby`, asi que cuando la 43 devuelve el foco a
 * «Omitir» tras el primer toque, el lector de pantalla lee el boton y su descripcion.
 *
 * LOS ESTADOS APAGADOS SE PINTAN CON VARIANTES `disabled:`, que la tabla de contraste
 * de `probar-identidad-visual.mjs` no mira: solo lee la clase en reposo. No es un
 * descuido de ese guion. WCAG 1.4.3 exime expresamente a los componentes inactivos, y
 * lo que si se comprueba —que el estado apagado se diga ademas del color— lo garantiza
 * el propio `disabled`, que el navegador anuncia y que impide el foco.
 */
export function dibujarBotonesDelIntento({
  hayMarcada = false,
  confirmandoOmitir = false,
} = {}) {
  const apagarSiguiente = hayMarcada ? '' : ' disabled';
  const apagarOmitir = hayMarcada ? ' disabled' : '';

  // Dos lineas a 375 px, una sola desde ahi hacia arriba. El hueco de abajo reserva
  // las dos SIEMPRE, asi que ni aparecer ni retirarse mueve un pixel de lo que hay
  // alrededor. Por eso la frase es corta: lo que cuesta una omitida ya lo dice la
  // regla 7 de la presentacion, y repetirlo aqui pediria una tercera linea reservada.
  const confirmacion = confirmandoOmitir
    ? 'Toca «Omitir» otra vez para saltarte esta pregunta.'
    : '';

  return `
      <div data-papel="botones-del-intento" class="mt-6 flex items-center gap-3">
        <button type="button" data-papel="siguiente"${apagarSiguiente} class="group inline-flex items-center justify-center gap-2 grow bg-jsyellow text-ink font-display font-bold text-base px-6 py-4 rounded hover:bg-jsyellowdim transition-colors disabled:bg-panel2 disabled:text-mutedink disabled:hover:bg-panel2 disabled:cursor-not-allowed">Siguiente${icon('next', 'text-xl')}</button>
        <button type="button" data-papel="omitir"${apagarOmitir} aria-describedby="${ID_DE_LA_CONFIRMACION}" class="group inline-flex items-center justify-center gap-2 shrink-0 border border-jsyellow text-paper font-display font-bold text-base px-5 py-4 rounded hover:bg-panel2 transition-colors disabled:border-muted/60 disabled:text-mutedink disabled:hover:bg-transparent disabled:cursor-not-allowed">${icon('skip', 'text-xl text-jsyellow group-disabled:text-mutedink')}Omitir</button>
      </div>
      <p id="${ID_DE_LA_CONFIRMACION}" data-papel="confirmacion-de-omitir" class="mt-3 min-h-[2.75rem] text-sm text-muted leading-normal break-words">${esc(confirmacion)}</p>`;
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
 *
 * Y POR ESO EL MARGEN NEGATIVO ES CONDICIONAL (hallazgo 16 de la lectura de la 43,
 * provocado el 2026-09-18). Los dos avisos de la decision 6 viven **encima** de
 * `#zona-del-intento` y dentro de la misma seccion. El margen negativo del primer hijo
 * de la zona colapsa hacia arriba y se lleva por delante el `mb-8` del aviso de abajo
 * —32 px— y **24 px del aviso mismo**: la tarjeta se dibuja encima del texto que avisa
 * de que el intento no se esta guardando. En la 45 ese estado solo se veia escribiendo
 * `?maqueta=intento&avisos=1`; en la 43, con el recorrido dibujado de verdad, pasa a
 * ser el estado normal de cualquiera cuyo almacen no acepte escrituras.
 *
 * Con un aviso encendido, entonces, la columna **no compensa nada**: el relleno de la
 * seccion vuelve a hacer su trabajo, el aviso se lee entero y la tarjeta baja lo que
 * mide el aviso. Se pierden los 56 px del presupuesto vertical, y esa es exactamente
 * la decision: 56 px de desplazamiento valen menos que un aviso tapado.
 *
 * LO QUE ESTO NO ARREGLA, y queda anotado: con un aviso encendido, el aviso nace a
 * 120 px del borde de la ventana y la franja fija termina en 121. O sea que el aviso
 * queda pegado al canto de la franja, sin aire. Viene del marcado de la 45 —los avisos
 * son hermanos de `#zona-del-intento` y esta funcion no los alcanza— y se resuelve
 * dandole aire a los avisos, no a la columna.
 */
export function dibujarColumnaDelIntento(dentro, { pegadaAlEncabezado = true } = {}) {
  const compensacion = pegadaAlEncabezado ? '-mt-14 sm:-mt-20 pt-[81px]' : 'pt-6';

  return `
    <div data-papel="columna-del-intento" class="${compensacion}">${dentro}
    </div>`;
}

export function dibujarPantallaDelIntento({
  pregunta = PREGUNTA_DE_EJEMPLO,
  posicion = 12,
  total = 120,
  transcurrido = '06:12',
  segundos = 30,
  urgente = false,
  marcada = null,
  confirmandoOmitir = false,
  pegadaAlEncabezado = true,
} = {}) {
  const dentro =
    dibujarTarjetaDeLaPregunta({ pregunta, posicion, total, marcada }) +
    dibujarBotonesDelIntento({ hayMarcada: marcada !== null, confirmandoOmitir });

  return `${dibujarFranjaDelIntento({ segundos, posicion, total, transcurrido, urgente })}${dibujarColumnaDelIntento(dentro, { pegadaAlEncabezado })}`;
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
    ? 'Son 72 correctas de 120, justo el mínimo del 60 %.'
    : 'Son 61 correctas de 120. El mínimo es 72, que es el 60 %.';

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
