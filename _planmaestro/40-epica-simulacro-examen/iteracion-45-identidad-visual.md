# Iteración 45 · Dirección visual del simulacro

**Épica:** 40 · Simulacro de examen
**Estado:** 🟢 **Cerrada el 2026-09-18**
**Depende de:** iteración 41, cerrada el 2026-09-18.
**Orden de trabajo:** después de la 41 y antes de la 42. El número no cambia.

## Objetivo

Fijar cómo se ve el simulacro antes de construir el cronómetro, el recorrido y el resumen, y dejar el marcado de esas
pantallas listo para que la 42, la 43 y la 44 lo conecten sin rehacerlo.

## Contexto

El cuestionario debe sentirse acogedor; el simulacro debe sentirse serio, casi solemne. Es la diferencia entre estudiar y
rendir, y tiene que notarse al entrar, sin leer una palabra.

Lo que esta iteración decide condiciona a las otras tres: la 43 conecta la pantalla del intento entera, la 42 pone los dos
cronómetros dentro, y la 44 hereda la disposición del resumen.

## Historial de este archivo

- **2026-09-16 · reescrita dos veces**, la segunda con el inventario de colores y los contrastes medidos.
- **2026-09-18 · cerrada.** Se eligió «Sala de examen» entre tres tratamientos, se escribió la guía visual, se construyó
  el marcado estático del intento y del resumen, y entró `scripts/probar-identidad-visual.mjs` como octavo comprobador de
  `npm run verificar`. El autor hizo su pasada de navegador, pidió tres correcciones —«Siguiente» amarillo, la tarjeta del
  resultado rellena de color, y la advertencia repetida fuera de las pantallas—, las repasó y quedaron confirmadas. El
  criterio del presupuesto vertical se aflojó por decisión del autor, con el desplazamiento medido en su lugar.
- **2026-09-18 · lectura de alcance y decisiones.** La lectura midió el presupuesto vertical en 375 px, el peor caso del
  banco y el alto real del panel del cuestionario, y encontró que tres guiones leen el diseño con expresiones regulares
  atadas a clases. El autor cerró las seis decisiones. Se corrigió una afirmación falsa del archivo: **el error individual
  sí se tiñe de rojo** en el cuestionario, con dos colores fuera de la paleta.

## Lo que la lectura de alcance dejó medido

- **Presupuesto vertical a 375 px:** bajo el encabezado fijo quedan **603 px** en 375×667 y **748 px** en 375×812. La
  pregunta con sus cuatro alternativas, el botón, el avance y las separaciones ocupan **564 a 666 px** con la densidad de
  hoy.
- **Peor caso del banco** (instantánea del 2026-09-10): enunciado más largo 115 caracteres (pregunta 16); alternativa más
  larga 78 (alternativa 407). El peor caso de tarjeta completa son 384 caracteres: preguntas **94** (módulo 3) y **254**
  (módulo 6), con 514 px de alto a 375 px.
- **Ninguna pregunta trae bloques de código ni saltos de línea.** Sí hay código en línea y **tokens largos sin espacios**:
  111 preguntas con alguno de 16 o más caracteres, y un máximo de 40 (alternativa 122). Hoy nada declara `break-words` ni
  `overflow-x`, y nunca se comprobó.
- **`jsyellow` significa hoy nueve cosas** distintas en el sitio; tres de ellas —foco visible, «está cargando» y «estás
  viendo una copia»— aparecen dentro de la pantalla del intento.
- **`src/input.css` pinta la alternativa mal elegida con `#7a2e2e` y `#e8b4b4`**, dos colores fuera de los trece tokens.
- **Los dos avisos suman 460 a 500 px** con su forma actual.
- **El panel del cuestionario mide 1.340 a 1.366 px de alto natural**, sobre 636 disponibles en 1280×700. Es un cálculo,
  no una medición, y contradice dos veces a ADR-032: queda como comprobación del autor.
- **Faltan cuatro íconos:** tiempo, avanzar, omitir y omitida.
- **Ningún guion comprueba contraste hoy**, ni que una clase `i-*` exista en `icons.css`.

## Restricción de paleta

- **Fondo `ink` (#000000)**, igual que todo el sitio.
- **Los trece tokens de `tailwind.config.cjs`** y nada más: `ink`, `panel`, `panel2`, `panel3`, `jsyellow`,
  `jsyellowdim`, `paper`, `muted`, `mutedink`, `ruby`, `rubydim`, `esmeralda`, `esmeraldadim`.
- La diferencia con el cuestionario se logra con escala tipográfica, contraste, densidad, ritmo y uso del espacio.

**Contrastes medidos** (WCAG 2.x), confirmados en la lectura de alcance:

| Color | Sobre `ink` | Sobre `panel` | Sobre `panel2` | Uso posible |
|---|---|---|---|---|
| `ruby` #E0115F | 4,41:1 | 3,98:1 | 3,70:1 | No como texto normal. Sí texto grande (≥ 24 px, o ≥ 18,66 px en negrita), bordes e íconos |
| `esmeralda` #10B981 | 8,28:1 | 7,46:1 | 6,94:1 | Texto normal y grande |
| `paper` sobre `rubydim` #7A1236 | 9,95:1 | — | — | Texto sobre fondo de error |
| `paper` sobre `esmeraldadim` #0A5C43 | 7,46:1 | — | — | Texto sobre fondo de acierto |
| `jsyellow` sobre `ink` | 15,53:1 | 14,00:1 | 13,01:1 | Texto y no textual, a cualquier tamaño |

`rubydim` sobre `ink` da 1,97:1 y `esmeraldadim` 2,62:1: como fondo de un bloque se distinguen por su contenido, no solos.
`muted` y `mutedink` están a 1,19:1 entre sí y no sirven para dar jerarquía.

## Decisiones tomadas

Todas del autor, 2026-09-18.

### 1 · Una franja fija bajo el encabezado

La pantalla del intento es **una sola columna** con **una franja fija** justo bajo el encabezado, que lleva el cronómetro
de la pregunta, el tiempo transcurrido y el indicador de avance. No hay panel fijo, así que ADR-032 no aplica al
simulacro.

- La franja cabe en **56 a 72 px**, para dejar al menos 530 px a la pregunta en 375×667, que cubre el peor caso medido.
- Entre el encabezado y la franja no se ocupan más de 136 px de alto permanentes.
- No toca el encabezado ni el pie, así que `comprobar-copias.mjs` no se ve afectado.

### 2 · El cronómetro es una cifra grande que baja

Una cifra de 30 a 0, escrita por JavaScript en cada latido. **Ninguna animación CSS de 30 segundos**: con
`prefers-reduced-motion` se completaría en el primer fotograma y el cronómetro mostraría cero desde el segundo cero, y el
criterio pasaría en verde con el cronómetro mintiendo. **Nada de SMIL dentro de un SVG**, por el precedente de
`alert-loop.svg`.

### 3 · La urgencia se dice en amarillo, con superficie y texto

- El cronómetro usa `jsyellow`. **Durante el intento no aparecen `ruby` ni `esmeralda`**, que quedan reservados al
  resumen: así ningún color significa dos cosas en la misma pantalla.
- Al acercarse el final, **la franja cambia de superficie** y **aparece un texto** del tipo «quedan 5 segundos». El color
  no es el único portador del aviso.
- El cambio de superficie no depende de una animación; si lleva transición, funciona igual recortada.

### 4 · El tiempo transcurrido se escribe `MM:SS`, y `H:MM:SS` desde la hora

El reloj sigue corriendo fuera de la página (regla 9), así que el caso de varias horas existe y no puede descolocar la
franja.

### 5 · Las alternativas del intento son propias

No reutilizan `.quiz-option` ni sus estados `correct`, `wrong` y `dimmed`: esos existen para revelar, y durante el intento
no se revela nada. Además `wrong` usa dos colores fuera de la paleta. Comparten forma, tamaño y borde con las del
cuestionario, para que se vean de la misma familia.

### 6 · Los avisos van compactos durante el intento

El aviso de copia guardada (ADR-008) y el de guardado (decisión 7 de la 41) se muestran **en una línea** mientras dura el
intento, y con su texto completo en la presentación y en el resumen. Se sigue avisando siempre; lo que cambia es el
espacio que ocupan.

### 7 · El alcance del criterio de los colores

«Ningún color significa dos cosas» se aplica **a la pantalla del intento y a la del resumen**, no a todo el sitio:
`jsyellow` ya significa nueve cosas y tres aparecen en el intento (foco, carga y aviso de copia). La guía visual escribe
qué significa cada color en esas dos pantallas.

### 8 · Los bordes bajo 3:1 se resuelven aquí

`border-panel3` da 1,31:1 sobre `ink` y 1,18:1 sobre `panel`, y `registro_log.md` dice que esta iteración es el sitio
para resolverlo. La guía visual decide qué borde usa cada superficie del simulacro y deja escrito si el resto del sitio
se alinea después o se queda como está.

### 9 · La advertencia de que el sitio no acredita va solo en el pie

**Decisión del autor, 2026-09-18**, tomada *después* de su pasada de navegador, a diferencia de las ocho anteriores.

La frase «Practicar acá no acredita nada ante Talento Digital para Chile» —y sus formas equivalentes— estaba en el pie de
las tres páginas **y además** en el cuerpo del cuestionario, en el del simulacro y en la tarjeta del resultado. Repetida,
daba a entender que el sitio no sirve para practicar: **una lectora ajena al proyecto preguntó exactamente eso** al ver
los avisos.

Queda **solo en el pie** de las tres páginas, y más adelante en `acerca-de.html`.

**Esto no toca ADR-022.** Esa ADR prohíbe las palabras que *prometen* validez —«nota», «puntaje oficial»,
«calificación»— y dice expresamente que el motivo de esa restricción **no se le advierte al estudiante en pantalla**.
Quitar la advertencia va en la dirección de esa ADR, no contra ella. Las palabras prohibidas siguen sin aparecer.

**Lo que no se tocó, y es la distinción que importa:** la línea de `components/modules.js` que dice «Esto sale del
testimonio de estudiantes que rindieron el examen 2026. No es información oficial de Talento Digital para Chile». **Eso
no es una advertencia sobre el sitio: es la fuente de una afirmación sobre el examen real**, y las iteraciones 36, 43 y
45 exigen que toda afirmación sobre el examen real lleve su origen escrito al lado. Quitarla dejaría una afirmación sin
fuente, que es justo lo que la 43 pidió arreglar. Por el mismo motivo se queda la línea de procedencia de los 120 minutos
que esta iteración agregó a la presentación.

`scripts/probar-identidad-visual.mjs` vigila las dos mitades: que ninguna de las cinco formas vuelva al cuerpo de las
tres páginas, a los once componentes ni a las nueve pantallas dibujadas, **y que las tres sigan teniéndola en el pie**.

**Confirmado por el autor el 2026-09-18.** Las dos frases de arriba —la de `components/modules.js:107` y su hermana sobre
el origen de los 120 minutos en la presentación del simulacro— **se quedan tal como están**, por decisión de Felipe
Cuevas. Hasta esa confirmación esto constaba como un juicio de Claude Code pendiente de revisión: el argumento técnico
estaba escrito, pero la decisión de mantenerlas no se había tomado. Ahora sí, y el autor la hace suya con el mismo
razonamiento: son la fuente de un dato sobre el examen real, no una advertencia repetida sobre el sitio, y sacarlas
dejaría esos datos sin origen declarado, contra lo que exigen las iteraciones 36, 43 y 45. El argumento no cambia; lo que
cambia es de quién es la decisión.

---

## Dirección visual elegida · «Sala de examen»

Elegida por el autor el 2026-09-18 entre tres tratamientos propuestos. Los otros dos fueron **«Continuidad»** —la misma
escala del cuestionario, que cabía entera sin desplazar pero apenas se distinguía de la práctica— y **«Contrarreloj»**
—una cifra de 60 px en una franja de 120 px, que ganaba en dramatismo y perdía 120 px de un presupuesto de 603.

**Por qué esta.** La diferencia entre estudiar y rendir tiene que notarse antes de leer una palabra, y lo que la produce
aquí es la **escala**: el enunciado sube de 16 px a 20 px en negrita y las alternativas de 14 px a 16 px. No es un ajuste
fino, es un salto que se ve de reojo. La densidad acompaña —`p-6` contra `p-5`, `py-3.5` contra `py-3`, `gap-2.5` contra
`gap-2`— y con eso una sola pregunta ocupa la pantalla entera, que es exactamente lo que ocurre cuando se rinde.

**Lo que costó, dicho de frente.** Con el peor caso del banco la pantalla no cabe: hay que desplazar **204 px en
375×667** y **59 px en 375×812**. El autor aflojó el criterio a sabiendas el 2026-09-18: lo exigible es que la franja
quepa en 72 px y que las cuatro alternativas y los dos botones se alcancen cómodamente, no que todo entre sin mover el
dedo. Un tratamiento que cupiera entero exigía volver a la escala del cuestionario, y entonces no habría dirección visual
que fijar.

**Lo que se tomó de los otros dos.** De «Continuidad», el borde `muted/60` para todas las superficies —es el único valor
de la paleta cerrada que cruza el 3:1 sobre `ink` y sobre `panel` con un solo token—. De «Contrarreloj», la idea de que
la franja no compite con la pregunta: se quedó en 57 px, no en 120.

---

## Guía visual del simulacro

La siguen la 42, la 43 y la 44. **Si el marcado y esta tabla no coinciden, manda la tabla.** Todas las razones de
contraste las calcula `scripts/probar-identidad-visual.mjs` sobre el fondo real de cada elemento, caminando el árbol; no
hay ni un número escrito a mano en esa comprobación.

### Qué significa cada color

**En la pantalla del intento.** Solo tres colores portan significado; el resto es superficie y texto.

| Color | Qué dice | Cómo se dice además sin color |
|---|---|---|
| `jsyellow` | **El tiempo y la acción.** La cifra del cronómetro, la franja entera en urgencia, «Siguiente» y el borde e ícono de «Omitir» | La cifra baja; en urgencia aparece «quedan N segundos»; los botones dicen lo que hacen |
| `paper` | **Lo que ya elegiste.** El borde de la alternativa marcada, y el texto de «Omitir» | La alternativa marcada gana el ícono `i-check-circle` |
| `muted` | **Lo secundario.** Avance, tiempo transcurrido, número de pregunta y bordes en reposo | — |

**`jsyellow` significa dos cosas en el intento, y es una decisión del autor del 2026-09-18, no un descuido.** La primera
versión pintó «Siguiente» en `paper` justamente para que el amarillo significara solo el tiempo; al verlo en el navegador
el autor decidió lo contrario, y el argumento es mejor: un botón principal que en esta página se pinta distinto que en las
otras dos rompe la costumbre del sitio para resolver un problema que la franja ya resuelve sola.

**La urgencia no se distingue por ser el único amarillo de la pantalla —no lo es—, sino por dos cosas que ningún botón
tiene:** la franja **cambia su superficie entera** a `bg-jsyellow` de ancho completo y fija bajo el encabezado, y
**aparece su texto**, «quedan N segundos», junto a una cifra de 36 px. Un botón de 16 px en el flujo del documento no se
confunde con eso. Lo comprueba un guion: si alguien quitara el texto de urgencia o el cambio de superficie, o si la cifra
bajara de 24 px, da rojo.

`ruby` y `esmeralda` **no aparecen en el intento** (decisión 3). Comprobado por guion sobre las tres variantes de la
pantalla —reposo, con alternativa marcada y urgencia—.

`jsyellow` sigue significando además tres cosas heredadas del sitio que pueden aparecer sobre esta pantalla: el anillo de
foco, el latido de la transición de carga y el aviso de ADR-008. La decisión 7 lo acepta explícitamente: el criterio se
aplica a lo que esta iteración dibuja, no a lo que el sitio arrastra.

**En la pantalla del resumen.** Aquí sí entran los dos colores reservados, y el cronómetro no existe.

| Color | Qué dice | Ícono que lo acompaña | Palabra |
|---|---|---|---|
| `esmeralda` | Correcta, y el resultado aprobado | `i-check-circle` | «Correcta» / «Aprobaste el simulacro» |
| `ruby` | Incorrecta | `i-cancel` | «Incorrecta» |
| `muted` | Omitida | `i-skip` | «Omitida» |

**Las palabras de estado van en `paper`, no en el color del estado**, y esto salió de medir: «Incorrecta» en `text-ruby` a
14 px en negrita da **3,98:1 sobre `panel`**, bajo el 4,5:1 de un texto normal y sin llegar a los 18,66 px que la
dejarían pasar como texto grande. Las otras dos pasaban —`esmeralda` 7,46:1 y `muted` 6,65:1—, que es justo como se cuela
la tercera. El color lo llevan el ícono y el borde, donde el umbral es 3:1 y los tres lo cruzan.

`jsyellow` no aparece en el resumen.

### Qué borde usa cada superficie (decisión 8)

**`border-muted/60` en todas las superficies del simulacro.** Da **3,12:1 sobre `ink`** y **3,12:1 sobre `panel`**: es el
único valor de la paleta cerrada que cruza el 3:1 de WCAG 1.4.11 en las dos superficies con un solo token. Lo que había,
`border-panel3`, daba 1,31:1 y 1,18:1.

| Superficie | Borde | Sobre | Razón |
|---|---|---|---|
| Franja del intento, en reposo | `border-b border-muted/60` | `ink` | 3,12:1 |
| Franja del intento, en urgencia | `border-b border-jsyellow` | `ink` | 15,53:1 |
| Tarjeta de la pregunta | `border border-muted/60` | `ink` | 3,12:1 |
| Alternativa sin marcar | `border border-muted/60` | `panel` | 3,12:1 |
| Alternativa marcada | `border border-paper` | `panel` | 17,64:1 |
| «Omitir» | `border border-muted/60` | `ink` | 3,12:1 |
| Recuadro de la transición de carga | `border border-muted/60` | `ink` | 3,12:1 |
| «Intento listo» y «No se pudo…» | `border border-muted/60` | `ink` | 3,12:1 |
| Fila del desglose por módulo | `border-b border-muted/60` | `panel` | 3,12:1 |
| Fila de la revisión | `border-l-2` del color del estado | `ink` | 8,28 / 3,98 / 7,37:1 |
| Aviso de guardado | `border border-muted/60` | `ink` | 3,12:1 |
| Recuadro «estas reglas son del simulacro» | `border border-jsyellow/60` | `panel` | 4,23:1 |

**Dos excepciones, y las dos con su motivo escrito.**

1. **El aviso de ADR-008 se queda en `border-jsyellow/40`, 2,96:1.** Lo comparten el cuestionario y el simulacro:
   repintarlo aquí repintaría el cuestionario, que esta iteración no toca. No incumple 1.4.11 porque el aviso no es un
   control y no se identifica por su borde, sino por su texto en `paper` —19,57:1— y su ícono en `jsyellow` —15,53:1—.
2. **El encabezado y el pie se quedan en `border-panel3`.** La decisión 1 dice que la franja no los toca, y
   `comprobar-copias.mjs` exige que las tres páginas digan lo mismo: cambiarlos aquí obligaría a cambiarlos en las tres.

**El resto del sitio no se alinea ahora.** La fila de `registro_log.md` que esperaba esta decisión queda abierta con el
valor ya fijado: `muted/60` es el borde que el sitio adopta cuando alguien decida hacer esa pasada. Hacerla dentro de esta
iteración habría significado repintar el panel del cuestionario, la portada y el pie —o sea, cambiar la identidad visual
de las tres páginas— para cerrar una deuda que viene de las iteraciones 31 y 32.

### Elemento por elemento

**La franja fija del intento.** Alto total **57 px** (`h-14` + `border-b`), dentro de los 56 a 72 de la decisión 1. Con el
encabezado fijo son **121 px permanentes**, bajo los 136 que esa decisión permite.

| Elemento | `data-papel` | Clases | Tamaño |
|---|---|---|---|
| Contenedor | `franja-del-intento` | `fixed top-16 inset-x-0 z-40 bg-ink border-b border-muted/60` | — |
| Fila interior | — | `max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4` | 56 px |
| Ícono del reloj | — | `icon i-clock text-lg text-jsyellow` | 18 px |
| Cifra del cronómetro | `cronometro` | `font-mono font-bold text-4xl leading-none tabular-nums text-jsyellow` | 36 px |
| Unidad «s» | — | `font-mono text-xs text-muted` | 12 px |
| Avance | `avance-del-intento` | `font-mono text-xs text-muted truncate` | 12 px |
| Ícono del reloj total | — | `icon i-clock-total text-base text-muted` | 16 px |
| Tiempo transcurrido | `transcurrido` | `font-mono text-sm tabular-nums text-muted` | 14 px |

**En urgencia** cambian tres cosas y ninguna sola basta: el contenedor pasa a `bg-jsyellow border-b border-jsyellow`,
toda la tinta pasa a `text-ink`, y el hueco del avance lo ocupa `aviso-de-urgencia` con «quedan N segundos» en
`font-display font-bold text-sm text-ink`. **El alto no cambia**: si creciera, empujaría la pregunta justo en el segundo
en que se está decidiendo.

**La tarjeta de la pregunta.**

| Elemento | `data-papel` | Clases | Tamaño |
|---|---|---|---|
| Tarjeta | `tarjeta-de-la-pregunta` | `bg-panel border border-muted/60 rounded-xl p-6` | — |
| Número y módulo | `numero-de-pregunta` | `font-mono text-xs text-muted` | 12 px |
| Enunciado | `enunciado` | `mt-3 font-display font-bold text-xl text-paper leading-snug break-words` | 20 px |
| Lista | `alternativas` | `mt-5 grid gap-2.5` | — |
| Alternativa | `alternativa` | `border border-muted/60 bg-panel rounded-lg px-4 py-3.5 text-base text-paper leading-normal break-words` | 16 px |
| Alternativa marcada | `alternativa` | `border-paper bg-panel2`, más `icon i-check-circle text-xl text-paper` | 16 px |

La marca ocupa su sitio siempre (`w-5`), puesta o no: si apareciera solo al marcar, el texto se correría a la derecha bajo
el dedo que acaba de tocarlo.

**Los dos botones.**

| Elemento | `data-papel` | Clases | Tamaño |
|---|---|---|---|
| «Siguiente» | `siguiente` | `grow bg-jsyellow text-ink font-display font-bold text-base px-6 py-4 rounded hover:bg-jsyellowdim` con `icon i-next text-xl` | 16 px |
| «Omitir» | `omitir` | `shrink-0 border border-jsyellow text-paper font-display font-bold text-base px-5 py-4 rounded hover:bg-panel2` con `icon i-skip text-xl text-jsyellow` | 16 px |

**«Siguiente» es amarillo, como el botón principal del resto del sitio** (corrección del autor, 2026-09-18). `ink` sobre
`jsyellow` da 15,53:1. **«Omitir» conserva el fondo oscuro** y pasa su borde y su ícono a `jsyellow` —15,53:1 sobre
`ink`—, con el texto en `paper` a 19,57:1: es el secundario de la pareja sin dejar de ser de la misma familia.

**La tarjeta del resultado va rellena de color** (corrección del autor, 2026-09-18). Era oscura como el resto y no
llamaba la atención, que en la pantalla donde se entrega el resultado es lo contrario de lo que hace falta.

| Elemento | `data-papel` | Clases | Tamaño |
|---|---|---|---|
| Tarjeta, aprobado | `resultado` | `bg-esmeralda rounded-xl p-6 text-center` | — |
| Tarjeta, reprobado | `resultado` | `bg-ruby rounded-xl p-6 text-center` | — |
| Rótulo | — | `font-display font-bold text-xl text-ink` | 20 px negrita |
| Cifra | `cifra-del-resultado` | `font-display font-bold text-5xl text-ink tabular-nums` | 48 px |
| «de 120» | — | `font-display font-bold text-xl text-ink` | 20 px negrita |
| Veredicto | `veredicto` | `border border-ink rounded-full px-4 py-2`, texto `font-display font-bold text-xl text-ink`, ícono `text-xl text-ink` | 20 px negrita |
| Explicación | `explicacion-del-resultado` | `mt-4 text-sm text-muted leading-relaxed`, **fuera de la tarjeta** | 14 px |

**Por qué la explicación quedó fuera de la tarjeta, y es una restricción medida y no una preferencia.** `ink` sobre
`esmeralda` da **8,28:1** y cumple a cualquier tamaño; `ink` sobre `ruby` da **4,41:1**, que cumple el 3:1 del texto
grande y de lo no textual, pero **no el 4,5:1 del texto normal**. Dentro de la tarjeta, por lo tanto, no cabe ni un texto
chico: el rótulo, la cifra, el «de 120» y el veredicto están todos a 20 px en negrita o más —el umbral de texto grande es
18,66 px en negrita—, y así los dos estados cumplen. La frase explicativa es un párrafo y no podía subir a 20 px en
negrita sin quedar ridícula, así que **se movió justo debajo de la tarjeta**, sobre `ink`, donde `muted` da 7,37:1. No se
inventó ningún color ni se salió de los trece tokens: se movió el único elemento que no cabía.

**La tarjeta perdió su borde**, y no es un olvido ni una excepción a la decisión 8: un borde existe para separar una
superficie de lo que la rodea, y `esmeralda` sobre `ink` da 8,28:1 y `ruby` 4,41:1, los dos muy por encima del 3:1 de
WCAG 1.4.11. La separación la hace el relleno.

**El resto del resumen no cambió.** Desglose con una fila por módulo, `border-b border-muted/60 py-3`, y las tres cifras
en `font-mono text-sm text-paper` cada una con su ícono de color. Revisión con `bg-panel border-l-2` del color del estado,
la palabra en `font-display font-bold text-sm text-paper` y el ícono en el color del estado.

### Los cuatro íconos

Los cuatro son **Material Symbols Light, de Google, bajo Apache 2.0**, la misma fuente y la misma licencia que los otros
cuarenta de `static/resources/`. El crédito viaja dentro de cada SVG. **La atribución pendiente de `acerca-de.html` no
crece con esto**: Material Symbols ya estaba en esa lista.

| Clase | Archivo | Dónde va |
|---|---|---|
| `i-clock` | `clock.svg` | El cronómetro de 30 s de la franja |
| `i-clock-total` | `clock-total.svg` | El tiempo transcurrido. Forma distinta del anterior a propósito: dos relojes iguales se confunden |
| `i-next` | `next.svg` | «Siguiente» |
| `i-skip` | `skip.svg` | «Omitir», y las omitidas del desglose y de la revisión |

### El presupuesto vertical, calculado

Con el peor caso del banco —**pregunta 94**, 384 caracteres, empatada con la 254— a 375 px de ancho. Lo calcula
`probar-identidad-visual.mjs` leyendo las clases del marcado; el modelo de ancho de letra tiene un error esperado de ±5 %,
así que el número exacto lo confirma el navegador.

| | px |
|---|---|
| Ancho útil del contenido (sección `px-5`) | 335 |
| Número de pregunta | 16 |
| Enunciado, 4 líneas a 20 px | 110 |
| Alternativas, 3+3+3+3 líneas a 16 px | 438 |
| **Tarjeta entera** | **646** |
| Botones | 56 |
| **Pide bajo la franja** (24 de aire + tarjeta + 24 + botones) | **750** |
| Útiles en 375×667 (667 − 64 de encabezado − 57 de franja) | 546 → **desplazar 204** |
| Útiles en 375×812 | 691 → **desplazar 59** |

La alternativa con el token de 40 caracteres sin espacios mide **309 px** a 16 px y la caja le da **219 px**: sin
`break-words` desbordaría a lo ancho; con él, ocupa dos líneas.

---

## Tareas

- [x] **Antes de rediseñar nada:** desacoplar de las clases las comprobaciones que leen el marcado con expresiones
  regulares (`probar-memoria.mjs:774-775`, `probar-filtrado.mjs:2637, 2811, 2897, 3120`) y la constante de 668 caracteres
  del aviso de respaldo (`probar-filtrado.mjs:3030-3041`). Regla: **una prueba no dicta cómo se ve algo.** — *Claude
  Code.* Siete comprobaciones desacopladas con `data-papel` y `data-cuenta-del-modulo`; la constante se sustituyó por la
  comparación en vivo entre las dos páginas.
- [x] Proponer al autor dos o tres tratamientos visuales dentro de las decisiones 1 a 8, y anotar el elegido, justificado.
  — *Claude Code.* Tres tratamientos con su cálculo de alto a 375 px; el autor eligió «Sala de examen».
- [x] Escribir en este archivo la **guía visual del simulacro**: qué clases y tamaños usa cada elemento, qué significa cada
  color en el intento y en el resumen, y qué borde usa cada superficie. — *Claude Code.* Sección «Guía visual del
  simulacro».
- [x] Agregar los cuatro íconos que faltan, con su atribución en la deuda ya registrada. — *Claude Code.* `i-clock`,
  `i-clock-total`, `i-next` e `i-skip`; la deuda de `acerca-de.html` sigue en tres atribuciones y no en cuatro.
- [x] Construir el **marcado estático** de la pantalla del intento —franja, cronómetro, transcurrido, avance, número de
  pregunta y total, enunciado, cuatro alternativas, avanzar y omitir, avisos compactos— con el **peor caso del banco**
  como contenido de ejemplo. — *Claude Code.* `static/js/components/simulacro-maqueta.js`.
- [x] Construir el **marcado estático del resumen**: resultado, desglose por módulo y revisión con sus tres estados
  (correcta, respondida mal, omitida). — *Claude Code.* Mismo archivo, con los dos estados de la tarjeta del resultado.
- [x] Aplicar la dirección a la presentación y a la transición de carga. **La transición es compartida con el
  cuestionario**: si cambia su aspecto, se hace con un parámetro, y el cuestionario sigue dibujando exactamente lo mismo.
  — *Claude Code.* `crearTransicionDeCarga({ borde })` con `BORDE_POR_OMISION = 'border-panel3'`.
- [x] Corregir de paso el texto de la presentación que la 43 dejó pendiente, ya que ese bloque se reescribe: el párrafo de
  entrada no afirma nada del examen real sin fuente, y el dato de los 120 minutos lleva su origen. — *Claude Code.* Los
  dos pendientes de la 43, cerrados.
- [x] Declarar `break-words` o equivalente donde pueda caer un token largo sin espacios. — *Claude Code.* En el enunciado,
  en las alternativas y en las tres filas de la revisión.

## Criterios de aceptación

### Los provoca Claude Code

Todos verificados por **Claude Code** en la pasada final del **2026-09-18**, con el servidor local levantado.

- [x] **La dirección visual elegida está justificada por escrito** en este archivo, con la guía visual completa. —
  Secciones «Dirección visual elegida · Sala de examen» y «Guía visual del simulacro».
- [x] **El fondo de la presentación, la transición, el intento y el resumen es `ink`.** — `probar:identidad` resuelve el
  fondo caminando el árbol: la raíz de las cuatro es `#000000`.
- [x] **El marcado dibujado no usa colores fuera de los trece tokens**, ni siquiera heredados de `.quiz-option`. — 258
  mediciones, todas resuelven a un token. Las alternativas del intento son propias (decisión 5).
- [x] **`ruby` no aparece como color de texto de tamaño normal** en ninguna pantalla del simulacro. — Aparece como ícono,
  como borde y como **fondo** de la tarjeta reprobada; nunca como texto bajo umbral.
- [x] **Durante el intento no aparecen `ruby` ni `esmeralda`**, y en el resumen no aparece el cronómetro: se comprueba
  sobre el marcado de las dos pantallas. — Comprobado sobre las tres variantes del intento: reposo, con alternativa
  marcada y urgencia.
- [x] **Todo texto alcanza 4,5:1 (o 3:1 si es grande) y todo borde o ícono significativo 3:1 sobre su fondo real**, con
  tabla calculada y no escrita a mano. — **258 mediciones, 0 bajo su umbral**, 2 con la excepción declarada del aviso
  compartido de ADR-008.
- [x] **Todo significado expresado con color trae además texto o ícono**, incluidas las tres marcas del resumen. —
  `ESTADOS_DE_LA_REVISION` es una tabla única: color, ícono y palabra, los tres siempre.
- [x] **El cronómetro no declara ninguna animación** ni contiene `<animate>`, y con el movimiento reducido simulado la
  pantalla del intento no declara movimiento; con el DOM normal, el control positivo que corresponda sí lo declara. —
  Ninguna de las nueve pantallas trae `animate-*`; el control positivo declara `animate-latido`.
- [x] **La franja cabe en 72 px o menos** según las clases declaradas, **y las cuatro alternativas y los dos botones se
  alcanzan cómodamente aunque haya que desplazar**: se informa el cálculo elemento por elemento y cuánto se desplaza. —
  Franja de **57 px** (`h-14` + `border-b`). Con el peor caso del banco la pantalla pide 750 px bajo la franja: **204 px
  de desplazamiento en 375×667 y 59 px en 375×812**.

  > *Criterio corregido el 2026-09-18 por decisión del autor.* Antes decía «y la maqueta del intento con el peor caso del
  > banco no supera el presupuesto de 603 px». El autor lo aflojó al elegir el tratamiento: un tratamiento que cupiera
  > entero obligaba a volver a la escala del cuestionario, y entonces no había dirección visual que fijar. Lo exigible
  > pasa a ser que la franja quepa en 72 px y que las alternativas y los botones se alcancen cómodamente. El
  > desplazamiento queda medido, no escondido.

- [x] **El marcado estático del intento y del resumen existe** con las piezas que piden la 42, la 43 y la 44. —
  `simulacro-maqueta.js`, con funciones que la 43 conecta pasándoles la pregunta de verdad.
- [x] **El peor caso del banco es el contenido de ejemplo** de la maqueta: pregunta 94 o 254. — Pregunta 94, 384
  caracteres, empatada con la 254. Un guion lo comprueba contra la instantánea.
- [x] **Los contenedores del enunciado y de las alternativas declaran el corte de palabras largas.** — `break-words`,
  comprobado por `data-papel`.
- [x] **El cuestionario dibuja exactamente lo mismo que antes** durante la carga y en su tarjeta de pregunta, comprobado
  byte a byte. — El cuestionario no le pide aspecto a la transición compartida y dibuja `border-panel3`; el simulacro pide
  `border-muted/60`. Es la única diferencia entre las dos.
- [x] **Toda clase `i-*` usada existe en `icons.css`**, comprobado por guion. — 38 usadas, 44 disponibles, ninguna
  faltante.
- [x] **Los guiones del sitio siguen en verde** tras desacoplarlos de las clases, y `instantanea-banco.js` sin cambios. —
  `probar:identidad`, `probar:filtrado`, `probar:memoria` y `probar:escapado` en 0; `git diff --stat` vacío sobre
  `instantanea-banco.js` y `d1/respaldo-banco.sql`.

### Los comprueba el autor en el navegador

Todos comprobados por **Felipe Cuevas el 2026-09-18**. La pasada salió **exitosa en los 12 puntos** de la lista, y tras
las tres correcciones de ese mismo día repitió los puntos **A, B y C** de la lista de repetición, también sin hallazgos.

- [x] **La página se reconoce como parte del sitio, pero se distingue del cuestionario al primer vistazo.** — *Felipe
  Cuevas, 2026-09-18, punto 1.*
- [x] **El cronómetro es lo primero que se ve** en la maqueta del intento, en teléfono y en computador. — *Felipe Cuevas,
  2026-09-18, punto 2.*
- [x] **Las cuatro pantallas mantienen coherencia entre sí.** — *Felipe Cuevas, 2026-09-18, punto 8.*
- [x] **En 375 px la maqueta del intento es cómoda con el pulgar**, con «Siguiente» y «Omitir» alcanzables sin
  confundirse, y la franja no tapa la pregunta al desplazar. — *Felipe Cuevas, 2026-09-18, puntos 3 y 4*, y repetido en el
  **punto A** tras la corrección de los botones.
- [x] **La alternativa más larga con un token de 40 caracteres no desborda** a lo ancho en 375 px. — *Felipe Cuevas,
  2026-09-18, punto 5.*
- [x] **En escala de grises** se distinguen aciertos, errores, omitidas y la urgencia del cronómetro. — *Felipe Cuevas,
  2026-09-18, puntos 6 y 7.*
- [x] **El panel del cuestionario a 1280 × 700:** se comprueba si alcanza hasta «Reiniciar el módulo», porque el cálculo
  de la lectura de alcance dice que no y ADR-032 afirma dos veces que sí. El resultado se registra. — *Felipe Cuevas,
  2026-09-18, punto 11.* **La medición se hizo; el resultado todavía no está escrito aquí**, y hasta que lo esté no se
  puede decidir cuál de los dos tiene razón. Ver «Lo que queda abierto».
- [x] **Sin errores de consola.** — *Felipe Cuevas, 2026-09-18, punto 10.*
- [x] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado. — *Felipe Cuevas, 2026-09-18, punto 10*, y
  confirmado por Claude Code en la pasada final con el CSS ya commiteado: **VERIFICADO, código 0**, las ocho
  comprobaciones en OK.

## Lo que esta iteración no puede afirmar

- **Que el cronómetro funcione:** aquí solo se dibuja. Lo conecta la 42.
- **Que el significado declarado de cada color sea el que el estudiante entiende.** Eso lo juzga la pasada del autor.

## Lo que queda abierto al cerrar

- **El resultado de la medición del panel del cuestionario a 1280 × 700.** El autor la hizo el 2026-09-18 dentro de su
  pasada, y la pasada salió exitosa; pero ese punto **no es de aprobar o fallar**, es una medición cuyo número decide si
  ADR-032 dice algo falso o si el cálculo de la lectura de alcance está mal. Falta escribir aquí qué se vio. Según cómo
  salga: si el botón «Reiniciar el módulo» **no** se alcanza, hay que abrir una ADR que corrija a ADR-032, que lo afirma
  dos veces; si **sí** se alcanza, hay que decir por qué el cálculo —1.340 a 1.366 px de alto natural sobre 636
  disponibles— se equivocó. Anotado en `registro_log.md`.
- **El borde `muted/60` en el resto del sitio.** Esta iteración lo fijó y lo aplicó a todas las superficies del simulacro;
  el panel del cuestionario, la portada y las tres copias del encabezado y del pie siguen en `border-panel3`. La fila de
  `registro_log.md` queda abierta con el valor ya decidido: quien haga esa pasada no elige borde, solo lo aplica.

## Lo que hay que repetir en el navegador tras las correcciones del 2026-09-18

La pasada del autor salió exitosa en los 12 puntos **antes** de las tres correcciones. Estos tres puntos cambiaron y hay
que volver a mirarlos; los demás no se tocaron.

### A · Los dos botones del intento

- **Qué hacer:** abre `?maqueta=intento` y `?maqueta=intento&urgente=1` en 375 px, y alterna entre las dos.
- **Qué deberías ver:** «Siguiente» amarillo relleno con el texto en negro, como el botón principal de la portada y del
  cuestionario; «Omitir» oscuro con el borde y el ícono amarillos y el texto claro. Y la franja en urgencia, que también
  es amarilla, se sigue leyendo como otra cosa: ocupa el ancho completo, va pegada al encabezado, lleva la cifra de 36 px
  y dice «quedan 5 segundos».
- **Qué cuenta como falla:** que a primera vista la franja en urgencia parezca un botón más, o que «Omitir» se lea como
  el control principal en vez de «Siguiente».

### B · La tarjeta del resultado, en sus dos estados

- **Qué hacer:** abre `?maqueta=resumen` y `?maqueta=resumen&reprobado=1` en 375 px y en 1280 px.
- **Qué deberías ver:** la tarjeta rellena de verde en el primero y de rojo en el segundo, con el rótulo, la cifra, el
  «de 120» y el veredicto en negro dentro de ella, y la frase explicativa **debajo** de la tarjeta, en gris sobre el
  fondo negro de la página. El resto del resumen igual que antes.
- **Qué cuenta como falla:** que algún texto dentro de la tarjeta roja cueste leerse, que la explicación haya quedado
  dentro de la tarjeta, o que la tarjeta no destaque sobre el resto de la pantalla.

### C · Ninguna advertencia repetida quedó en pantalla

- **Qué hacer:** recorre `index.html`, `cuestionario.html`, `simulacro.html` y las dos maquetas, mirando solo el cuerpo
  de cada página.
- **Qué deberías ver:** la advertencia de que el sitio no acredita **solo en el pie**, una vez por página. En el
  cuestionario, el párrafo de entrada termina en «entiende el porqué». En el simulacro ya no hay descargo bajo el botón.
  En el resumen, la explicación del resultado no la menciona.
- **Qué cuenta como falla:** encontrarla dos veces en la misma página, o no encontrarla en el pie de alguna.

---

## Lista de verificación en el navegador

Con `npm run datos:dev` levantado, en `http://127.0.0.1:8788`. Las tres direcciones se escriben a mano: no hay enlace a
ninguna, igual que no lo hay a la página (los enlaces son de la iteración 44).

    simulacro.html?maqueta=intento
    simulacro.html?maqueta=intento&urgente=1
    simulacro.html?maqueta=intento&avisos=1
    simulacro.html?maqueta=resumen
    simulacro.html?maqueta=resumen&reprobado=1
    simulacro.html?maqueta=resumen&avisos=1

`avisos=1` enciende los dos avisos de la decisión 6. Van detrás de un parámetro porque son estados excepcionales:
encendidos por omisión sumarían su alto al presupuesto vertical y el número calculado dejaría de ser el de la pantalla
normal.

### 1 · Se reconoce como el sitio, y no es el cuestionario

- **Qué hacer:** abre `cuestionario.html` y `simulacro.html?maqueta=intento` en dos pestañas y alterna entre ellas sin
  leer el texto.
- **Qué deberías ver:** el mismo negro, la misma tipografía y el mismo amarillo; y una sola pregunta grande contra una
  lista de sesenta pequeñas.
- **Qué cuenta como falla:** que haya que leer para saber en cuál estás, o que el simulacro parezca de otro sitio.

### 2 · El cronómetro es lo primero que se ve

- **Qué hacer:** abre `?maqueta=intento` en teléfono (375 px) y en computador (1280 px). Mira la pantalla medio segundo y
  cierra los ojos.
- **Qué deberías ver:** el «30» amarillo de 36 px arriba a la izquierda, antes que cualquier otra cosa.
- **Qué cuenta como falla:** que lo primero sea el enunciado, el botón «Siguiente» o el encabezado.

### 3 · La franja no tapa la pregunta al desplazar

- **Qué hacer:** en 375×667, desplaza hasta el final de la maqueta del intento y vuelve arriba.
- **Qué deberías ver:** la franja siempre visible bajo el encabezado, y el texto pasando por debajo sin que ninguna línea
  quede escondida detrás de ella al detenerse.
- **Qué cuenta como falla:** que la primera línea del enunciado nazca tapada, o que la franja se desplace con la página.

### 4 · Las cuatro alternativas y los dos botones se alcanzan con el pulgar

- **Qué hacer:** en 375×667, con el peor caso ya cargado, recorre la pantalla con el pulgar hasta pulsar «Omitir».
- **Qué deberías ver:** hay que desplazar —unos 204 px, un gesto— y los dos botones quedan separados lo suficiente para
  no confundirlos. «Siguiente» ocupa el ancho sobrante y «Omitir» es el estrecho de la derecha.
- **Qué cuenta como falla:** que haga falta más de un gesto de desplazamiento, que los botones queden pegados, o que al
  pulsar uno se toque el otro.

### 5 · La alternativa con el token de 40 caracteres no desborda

- **Qué hacer:** abre `?maqueta=resumen` en 375 px y busca la fila roja de la revisión, la de «pregunta 13». Su respuesta
  es `document.getElementById("nodo").click();`, el token más largo del banco sin un solo espacio.
- **Qué deberías ver:** el token partido en dos líneas dentro de su caja.
- **Qué cuenta como falla:** que aparezca una barra de desplazamiento horizontal en la página, que el texto se salga de
  la tarjeta, o que la tarjeta se ensanche más allá de los 335 px de contenido.

### 6 · La urgencia se distingue, y en escala de grises también

- **Qué hacer:** abre `?maqueta=intento` y `?maqueta=intento&urgente=1` en dos pestañas y alterna. Repite con el filtro de
  escala de grises de DevTools (Rendering → Emulate vision deficiencies → Achromatopsia).
- **Qué deberías ver:** en color, la franja pasa de negra a amarilla entera con la tinta en negro y «quedan 5 segundos» en
  el sitio del avance. En gris, pasa de casi negra a casi blanca.
- **Qué cuenta como falla:** que en escala de grises las dos franjas se parezcan, o que la franja cambie de alto y empuje
  la pregunta.

### 7 · Aciertos, errores y omitidas se distinguen en escala de grises

- **Qué hacer:** `?maqueta=resumen` con el mismo filtro de escala de grises.
- **Qué deberías ver:** tres siluetas distintas —el círculo con tilde, la equis en círculo, el círculo con la barra— y
  las tres palabras «Correcta», «Incorrecta» y «Omitida».
- **Qué cuenta como falla:** que dos estados queden indistinguibles sin leer.

### 8 · Las cuatro pantallas son coherentes entre sí

- **Qué hacer:** recorre en orden la presentación (`simulacro.html`), la transición (pulsa «Comenzar el simulacro»), el
  intento (`?maqueta=intento`) y el resumen (`?maqueta=resumen`).
- **Qué deberías ver:** el mismo borde gris en todas las superficies, el mismo fondo negro, la misma familia de tarjeta.
- **Qué cuenta como falla:** una pantalla con bordes de otro color o de otro grosor que las demás.

### 9 · El movimiento reducido no deja nada moviéndose

- **Qué hacer:** activa «Emulate CSS prefers-reduced-motion: reduce» en DevTools y recorre las tres maquetas.
- **Qué deberías ver:** nada se mueve en ninguna de las tres. La transición de carga sigue mostrando sus tres puntos,
  quietos.
- **Qué cuenta como falla:** cualquier cosa que lata, gire o se desplace sola dentro de las maquetas.

### 10 · Sin errores de consola

- **Qué hacer:** abre la consola y recorre las tres maquetas y la presentación, pulsando «Comenzar el simulacro».
- **Qué deberías ver:** ni un error ni una advertencia nueva.
- **Qué cuenta como falla:** cualquier mensaje rojo o amarillo que no estuviera antes.

### 11 · El panel del cuestionario a 1280 × 700, que el cálculo desmiente

- **Qué hacer:** abre `cuestionario.html` con la ventana en exactamente 1280 × 700, elige un módulo y **sin desplazar la
  página**, mira hasta dónde llega el panel de la derecha.
- **Qué deberías ver:** según ADR-032, el panel entero, hasta «Reiniciar el módulo» incluido. Según el cálculo de la
  lectura de alcance del 2026-09-18, el panel pide **1.340 a 1.366 px** de alto natural sobre **636 disponibles**, así que
  el botón debería quedar fuera por más de 700 px.
- **Qué cuenta como falla:** esto no es una falla de la iteración 45 en ninguno de los dos resultados; es la medición que
  decide cuál de los dos tiene razón. **Anota lo que veas**: si el botón no se alcanza, ADR-032 afirma dos veces algo
  falso y hay que abrir una ADR que la corrija; si se alcanza, el cálculo de la lectura de alcance está mal y hay que
  decir por qué. En los dos casos, el resultado se registra en `registro_log.md`.

### 12 · Los avisos compactos dicen lo mismo en una línea (decisión 6)

- **Qué hacer:** abre `?maqueta=intento&avisos=1` y `?maqueta=resumen&avisos=1` en 375 px, y compáralos.
- **Qué deberías ver:** en el intento, dos líneas de una sola altura sobre la franja —«Estás viendo una copia guardada
  del banco. Es la copia del 10 de septiembre de 2026.» y «Tu intento ya no se está guardando.»—, cada una con su ícono.
  En el resumen, los dos avisos enteros, con su explicación.
- **Qué cuenta como falla:** que el aviso compacto ocupe dos líneas de texto, que pierda la fecha de la copia, o que en
  alguno de los dos deje de avisarse algo que antes se avisaba.

### 13 · El cuestionario no cambió

- **Qué hacer:** abre `cuestionario.html`, elige un módulo y mira la transición de carga y una tarjeta de pregunta.
- **Qué deberías ver:** exactamente lo de siempre, con su borde `panel3`, no el borde gris del simulacro.
- **Qué cuenta como falla:** cualquier diferencia respecto de antes de esta iteración.

## Notas de la iteración

- **Se eligió «Sala de examen» entre tres tratamientos, y lo que la eligió fue la escala.** Los otros dos fueron
  «Continuidad» —la misma escala del cuestionario, que cabía entera sin desplazar y apenas se distinguía de la práctica— y
  «Contrarreloj» —una cifra de 60 px en una franja de 120 px, que ganaba en dramatismo y se comía 120 px de un presupuesto
  de 603—. La diferencia entre estudiar y rendir tiene que notarse antes de leer una palabra, y aquí la produce el salto
  de 16 px a 20 px en negrita en el enunciado y de 14 px a 16 px en las alternativas, con la densidad acompañando. Costó
  que el peor caso del banco no quepa: hay que desplazar 204 px en 375×667. El autor aflojó el criterio a sabiendas, y el
  desplazamiento quedó medido.

- **El desacople de las pruebas y las clases fue lo primero, y tenía que serlo.** Siete comprobaciones de
  `probar-memoria.mjs` y `probar-filtrado.mjs` leían el marcado por sus clases de Tailwind —`text-jsyellow">`,
  `font-display font-bold text-xl text-paper`— y una constante de 668 caracteres del aviso de respaldo lo fijaba entero,
  clases incluidas. O sea que las pruebas eran las dueñas del aspecto: repintar daba siete rojos sin que nada se hubiera
  roto, y la salida cómoda era editar la prueba hasta que pasara, que es como se aprende a no creerle. Ahora leen
  `data-papel` y `data-cuenta-del-modulo`, y el aviso se compara **entre las dos páginas en vivo** en vez de contra un
  literal. **La prueba del desacople es una mutación inerte:** repintar a la vez el título, la cuenta por módulo, el
  recuadro del aviso y su ícono deja los tres guiones en verde, mientras que las siete mutaciones semánticas siguen dando
  rojo cada una con su mensaje. Antes, ese mismo repintado daba siete rojos.

- **El borde del simulacro es `muted/60`, y el resto del sitio no se alinea todavía.** Da 3,12:1 sobre `ink` y 3,12:1
  sobre `panel`: es el único valor de la paleta cerrada que cruza el 3:1 de WCAG 1.4.11 en las dos superficies con un solo
  token, contra los 1,31:1 y 1,18:1 de `border-panel3`. Se aplicó a **todas** las superficies del simulacro. El panel del
  cuestionario, la portada y las tres copias del encabezado y del pie **se quedan como estaban**: cambiarlos habría
  repintado la identidad visual de las tres páginas dentro de una iteración cuyo alcance es el simulacro. La fila de
  `registro_log.md` queda abierta con el valor ya decidido, así que quien haga esa pasada no elige borde, solo lo aplica.

- **La maqueta se mira con un parámetro, no con una cuarta página.** `?maqueta=intento` y `?maqueta=resumen`. Una página
  más habría duplicado por cuarta vez el encabezado y el pie —que `comprobar-copias.mjs` vigila justamente porque tres
  copias a mano ya fueron demasiado—, y la maqueta tiene que verse **bajo este encabezado fijo**, porque el presupuesto
  vertical de la decisión 1 se cuenta desde ahí. La rama corta antes de conectar nada: no se arma intento, no se registra
  ningún oyente y no sale ni una petición.

- **El marcado son funciones, no HTML pegado en la página.** Lo que la 43 tiene que hacer para conectar el intento es
  llamar a `dibujarPantallaDelIntento()` con la pregunta de verdad en vez de la de ejemplo. Con HTML suelto, conectarlo
  habría significado volver a escribirlo, que es lo que esta iteración existe para evitar.

- **La pregunta de ejemplo está copiada a mano y no importada de la instantánea**, y hay un guion que comprueba que siga
  siendo el peor caso. Importarla tendría dos problemas: la maqueta dibujaría el peor caso *del día*, que puede dejar de
  serlo, y traería el banco entero a una página para sacar 384 caracteres.

- **Entró un comprobador nuevo, `probar-identidad-visual.mjs`, y corre dentro de `npm run verificar`.** Hasta hoy
  **ninguna comprobación miraba el contraste** ni que una clase `i-*` existiera en `icons.css`: el `text-ruby` a 14 px de
  `#valor-incorrectas` llevaba meses publicado sin que nada se quejara. Camina el árbol del marcado para saber sobre qué
  fondo está cada elemento, así que la tabla dice «sobre `panel`» porque el elemento está dentro de un `bg-panel`, no
  porque alguien lo escribió.

- **Dos errores del comprobador salieron de provocarle rojos, y los dos importan.** El primero: leía `border-b` y
  `border-l-2` como colores y daba trece rojos contra el marcado correcto —una comprobación que grita con el código bueno
  se aprende a ignorar, que es H-013—. El segundo, peor: `border-[#7a2e2e]` **pasaba en verde**, porque la detección pedía
  una letra después del guion y ahí venía un corchete. Ese es exactamente uno de los dos colores de fuera de la paleta que
  pinta `.quiz-option[data-state='wrong']`, o sea el caso que más importaba era el único que no se miraba.

- **La palabra de estado de la revisión va en `paper` y no en el color del estado**, y eso también salió de medir:
  «Incorrecta» en `text-ruby` a 14 px en negrita da 3,98:1 sobre un umbral de 4,5. Las otras dos pasaban, que es como se
  cuela la tercera.

- **El aviso de ADR-008 no se repintó a propósito.** Lo comparten las dos páginas, así que su `border-jsyellow/40` de
  2,96:1 se queda: cambiarlo habría repintado el cuestionario. Queda escrito en la guía visual, con el motivo por el que
  no incumple 1.4.11.

- **La transición de carga cambió de aspecto por parámetro.** `crearTransicionDeCarga({ borde })`, con
  `BORDE_POR_OMISION = 'border-panel3'` exportado. El cuestionario no pide nada y sigue dibujando lo suyo; el simulacro
  pide el borde de la decisión 8. Hay un guion que comprueba las tres mitades: que el cuestionario no pida aspecto, que el
  simulacro sí, y que el borde por omisión no haya cambiado.

- **Los dos pendientes del texto de la presentación se cerraron**, y eran de la iteración 43: el párrafo de entrada ya no
  afirma nada del examen real —compara con el cuestionario de práctica, que es algo que este sitio sí sabe— y el dato de
  los 120 minutos lleva su origen escrito debajo, con la misma forma que el aviso de programación de la iteración 36.

- **Tres correcciones del autor el 2026-09-18, después de su pasada de navegador**, que salió exitosa en los 12 puntos.
  **Una:** «Siguiente» vuelve a ser amarillo como el botón principal del resto del sitio, y «Omitir» pasa su borde y su
  ícono a `jsyellow`. Con eso `jsyellow` significa en el intento **el tiempo y la acción**, y la urgencia se distingue
  porque cambia la superficie entera de la franja y aparece su texto, no por ser el único amarillo. **Dos:** la tarjeta
  del resultado pasa a fondo `esmeralda` o `ruby`, con todo lo de dentro en `ink`. **Tres:** la advertencia repetida sale
  de las pantallas y queda solo en el pie (decisión 9).

- **La tarjeta de color obligó a mover un párrafo, y el número lo decidió.** `ink` sobre `ruby` da 4,41:1: cumple el 3:1
  del texto grande y **no** el 4,5:1 del normal. Todo lo que quedó dentro de la tarjeta está a 20 px en negrita o más;
  la frase explicativa, que es un párrafo y no podía subir de tamaño sin quedar ridícula, salió fuera de la tarjeta a
  `muted` sobre `ink`, 7,37:1. Sin inventar colores y sin salir de los trece tokens. El guion lo caza: devolver el rótulo
  a 12 px da `da 4.41:1 sobre #E0115F y necesita 4.5:1`.

- **Lo que esta iteración no puede afirmar sigue siendo lo que decía:** que el cronómetro funcione —aquí solo se dibuja,
  lo conecta la 42— y que el significado declarado de cada color sea el que el estudiante entiende.