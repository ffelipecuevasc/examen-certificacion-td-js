# Iteración 45 · Dirección visual del simulacro

**Épica:** 40 · Simulacro de examen
**Estado:** 🔵 En curso · lectura de alcance hecha el 2026-09-18; decisiones cerradas
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

## Tareas

- [ ] **Antes de rediseñar nada:** desacoplar de las clases las comprobaciones que leen el marcado con expresiones
  regulares (`probar-memoria.mjs:774-775`, `probar-filtrado.mjs:2637, 2811, 2897, 3120`) y la constante de 668 caracteres
  del aviso de respaldo (`probar-filtrado.mjs:3030-3041`). Regla: **una prueba no dicta cómo se ve algo.**
- [ ] Proponer al autor dos o tres tratamientos visuales dentro de las decisiones 1 a 8, y anotar el elegido, justificado.
- [ ] Escribir en este archivo la **guía visual del simulacro**: qué clases y tamaños usa cada elemento, qué significa cada
  color en el intento y en el resumen, y qué borde usa cada superficie.
- [ ] Agregar los cuatro íconos que faltan, con su atribución en la deuda ya registrada.
- [ ] Construir el **marcado estático** de la pantalla del intento —franja, cronómetro, transcurrido, avance, número de
  pregunta y total, enunciado, cuatro alternativas, avanzar y omitir, avisos compactos— con el **peor caso del banco**
  como contenido de ejemplo.
- [ ] Construir el **marcado estático del resumen**: resultado, desglose por módulo y revisión con sus tres estados
  (correcta, respondida mal, omitida).
- [ ] Aplicar la dirección a la presentación y a la transición de carga. **La transición es compartida con el
  cuestionario**: si cambia su aspecto, se hace con un parámetro, y el cuestionario sigue dibujando exactamente lo mismo.
- [ ] Corregir de paso el texto de la presentación que la 43 dejó pendiente, ya que ese bloque se reescribe: el párrafo de
  entrada no afirma nada del examen real sin fuente, y el dato de los 120 minutos lleva su origen.
- [ ] Declarar `break-words` o equivalente donde pueda caer un token largo sin espacios.

## Criterios de aceptación

### Los provoca Claude Code

- [ ] **La dirección visual elegida está justificada por escrito** en este archivo, con la guía visual completa.
- [ ] **El fondo de la presentación, la transición, el intento y el resumen es `ink`.**
- [ ] **El marcado dibujado no usa colores fuera de los trece tokens**, ni siquiera heredados de `.quiz-option`.
- [ ] **`ruby` no aparece como color de texto de tamaño normal** en ninguna pantalla del simulacro.
- [ ] **Durante el intento no aparecen `ruby` ni `esmeralda`**, y en el resumen no aparece el cronómetro: se comprueba
  sobre el marcado de las dos pantallas.
- [ ] **Todo texto alcanza 4,5:1 (o 3:1 si es grande) y todo borde o ícono significativo 3:1 sobre su fondo real**, con
  tabla calculada y no escrita a mano.
- [ ] **Todo significado expresado con color trae además texto o ícono**, incluidas las tres marcas del resumen.
- [ ] **El cronómetro no declara ninguna animación** ni contiene `<animate>`, y con el movimiento reducido simulado la
  pantalla del intento no declara movimiento; con el DOM normal, el control positivo que corresponda sí lo declara.
- [ ] **La franja cabe en 72 px o menos** según las clases declaradas, y la maqueta del intento con el peor caso del banco
  no supera el presupuesto de 603 px: se informa el cálculo elemento por elemento.
- [ ] **El marcado estático del intento y del resumen existe** con las piezas que piden la 42, la 43 y la 44.
- [ ] **El peor caso del banco es el contenido de ejemplo** de la maqueta: pregunta 94 o 254.
- [ ] **Los contenedores del enunciado y de las alternativas declaran el corte de palabras largas.**
- [ ] **El cuestionario dibuja exactamente lo mismo que antes** durante la carga y en su tarjeta de pregunta, comprobado
  byte a byte.
- [ ] **Toda clase `i-*` usada existe en `icons.css`**, comprobado por guion.
- [ ] **Los guiones del sitio siguen en verde** tras desacoplarlos de las clases, y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **La página se reconoce como parte del sitio, pero se distingue del cuestionario al primer vistazo.**
- [ ] **El cronómetro es lo primero que se ve** en la maqueta del intento, en teléfono y en computador.
- [ ] **Las cuatro pantallas mantienen coherencia entre sí.**
- [ ] **En 375 px la maqueta del intento es cómoda con el pulgar**, con «Siguiente» y «Omitir» alcanzables sin
  confundirse, y la franja no tapa la pregunta al desplazar.
- [ ] **La alternativa más larga con un token de 40 caracteres no desborda** a lo ancho en 375 px.
- [ ] **En escala de grises** se distinguen aciertos, errores, omitidas y la urgencia del cronómetro.
- [ ] **El panel del cuestionario a 1280 × 700:** se comprueba si alcanza hasta «Reiniciar el módulo», porque el cálculo
  de la lectura de alcance dice que no y ADR-032 afirma dos veces que sí. El resultado se registra.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado.

## Lo que esta iteración no puede afirmar

- **Que el cronómetro funcione:** aquí solo se dibuja. Lo conecta la 42.
- **Que el significado declarado de cada color sea el que el estudiante entiende.** Eso lo juzga la pasada del autor.

## Notas de la iteración

_Pendiente._