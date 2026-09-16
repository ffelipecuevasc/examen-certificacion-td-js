# Iteración 45 · Dirección visual del simulacro

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 41.
**Orden de trabajo:** se hace **después de la 41 y antes de la 42** (decisión del autor, 2026-09-16). El número no cambia.

## Objetivo

Fijar cómo se ve el simulacro antes de construir el cronómetro, el recorrido y el resumen, y dejar el marcado de esas
pantallas listo para que la 42, la 43 y la 44 lo conecten sin rehacerlo.

## Contexto

El cuestionario debe sentirse acogedor; el simulacro debe sentirse serio, casi solemne. Es la diferencia entre estudiar y
rendir, y tiene que notarse al entrar, sin leer una palabra.

Se adelantó porque el cronómetro de 30 segundos debe ser lo más llamativo de la pantalla: decidirlo al final habría
obligado a rehacer el marcado de la 42 y la 43.

## Historial de este archivo

- **2026-09-16 · reescrita dos veces.** El autor fijó el fondo negro, confirmó `ruby` y `esmeralda`, y adelantó la
  iteración antes de la 42. La segunda reescritura incorpora la lectura de alcance: dónde se usa hoy cada color y qué
  significa.

## Restricción de paleta

Decidido por el autor el 2026-09-16:

- **Fondo de la página `ink` (#000000)**, igual que todo el sitio.
- **Amarillo mostaza, negro predominante y blanco en pequeñas dosis**, con los tokens existentes: `jsyellow`,
  `jsyellowdim`, `paper`, `panel`, `panel2`, `panel3`, `muted`, `mutedink`.
- **Se usan `ruby` y `esmeralda`**, con `rubydim` y `esmeraldadim`, ya definidos en `tailwind.config.cjs:19-22`.
- **No entran colores nuevos.** La diferencia con el cuestionario se logra con escala tipográfica, contraste, densidad,
  ritmo y uso del espacio.

**Contrastes medidos el 2026-09-16** (WCAG 2.x), recalculados en la lectura de alcance:

| Color | Sobre `ink` | Sobre `panel` | Sobre `panel2` | Uso posible |
|---|---|---|---|---|
| `ruby` #E0115F | 4,41:1 | 3,98:1 | 3,70:1 | No como texto normal. Sí texto grande (≥ 24 px, o ≥ 18,66 px en negrita), bordes e íconos |
| `esmeralda` #10B981 | 8,28:1 | 7,46:1 | 6,94:1 | Texto normal y grande |
| `paper` sobre `rubydim` #7A1236 | 9,95:1 | — | — | Texto sobre fondo de error |
| `paper` sobre `esmeraldadim` #0A5C43 | 7,46:1 | — | — | Texto sobre fondo de acierto |

`rubydim` sobre `ink` da 1,97:1 y `esmeraldadim` 2,62:1: esos fondos no se distinguen del negro por sí solos y necesitan
borde, riel o forma. `muted` y `mutedink` están a 1,19:1 entre sí: no sirven para dar jerarquía.

## Lo que significan hoy los colores en el sitio

Según la lectura de alcance del 2026-09-16:

- **`ruby` y `esmeralda`** solo se usan en el panel del cuestionario, en el contador agregado de incorrectas y correctas
  (`cuestionario.html:123-141`), y `esmeralda` en el veredicto «Correcto. Sigue así.» (`cuestionario.js:385`).
- **El error individual no se tiñe de rojo**: una pregunta fallada muestra `jsyellow`, un ícono de bombilla y «La
  alternativa correcta está marcada en amarillo» (`cuestionario.js:386`).
- **`jsyellow`** es a la vez el color de marca y el de «mira la correcta».

**Hallazgo preexistente, fuera de esta épica:** `#valor-incorrectas` se declara en `cuestionario.html:125` con
`class="ml-auto font-display font-bold text-sm text-ruby"` sobre `panel`, que
da 3,98:1 con 14 px en negrita, bajo el 4,5:1 exigido. Se registra en `registro_log.md`; esta iteración no lo corrige.

*Cita corregida el 2026-09-16, a pedido del autor: antes decía `text-ruby text-sm font-bold`, que resume bien los
colores y el tamaño pero no es lo que está escrito en el archivo. El hallazgo y sus cifras no cambian.*

## Decisiones sin resolver

Se resuelven con el autor **tras la lectura de alcance de esta iteración**, con bocetos a la vista.

### 1 · La disposición de la pantalla del intento

¿El simulacro usa un panel fijo como el cuestionario, o una sola columna centrada? Si hay panel, hereda ADR-032 (el panel
no crece ni una fila). Incluye dónde va el indicador de avance del intento. **Pendiente.**

### 2 · El cronómetro de 30 segundos

Su forma (cifra, anillo, barra que se vacía), su tamaño y cómo comunica la urgencia sin depender solo del color y sin
animación con movimiento reducido. **Pendiente.**

### 3 · El color de la urgencia y el significado de cada color

`jsyellow` ya significa marca y «mira la correcta»; `ruby` significa «incorrectas» en el contador. Hay que decidir qué
color dice «se acaba el tiempo», y qué significan `ruby`, `esmeralda` y `jsyellow` en el resultado y la revisión de la 44,
sin que un color diga dos cosas. **Pendiente.**

## Tareas

- [ ] Proponer al autor la dirección visual con dos o tres alternativas y sus bocetos, y anotar la elegida en este
  archivo, justificada.
- [ ] Aplicarla a la presentación y a la transición de carga que dejó la 41.
- [ ] Construir el **marcado estático** del intento (pregunta, alternativas, cronómetros, indicador de avance, «Siguiente» y
  «Omitir») y del resumen (resultado, desglose por módulo, revisión), con datos de ejemplo y sin lógica, para que la 42, la
  43 y la 44 lo conecten.
- [ ] Escribir en este archivo la **guía visual del simulacro**: qué clases y tamaños usa cada elemento y qué significa
  cada color. La 42, la 43 y la 44 la siguen.
- [ ] Revisar el contraste de todo texto y borde sobre su fondo real.

## Criterios de aceptación

### Los provoca Claude Code

- [ ] **La dirección visual elegida está justificada por escrito** en este archivo, con la guía visual del simulacro.
- [ ] **El fondo de la presentación, la transición, el intento y el resumen es `ink`.**
- [ ] **El marcado dibujado no usa colores fuera de los tokens listados** en la restricción de paleta.
- [ ] **`ruby` no aparece como color de texto de tamaño normal** en ninguna pantalla del simulacro.
- [ ] **Ningún color significa dos cosas** en el simulacro: se comprueba contra la tabla de significados de la guía.
- [ ] **Todo texto alcanza 4,5:1 (o 3:1 si es grande) y todo borde o ícono significativo 3:1 sobre su fondo real**, con
  tabla de elemento, color, fondo, de dónde sale el fondo y razón.
- [ ] **Todo significado expresado con color tiene además texto o forma** que lo comunica sin color.
- [ ] **Con el movimiento reducido simulado, ninguna animación nueva declara movimiento.**
- [ ] **El marcado estático del intento y del resumen existe** y la guía visual lo describe elemento por elemento.
- [ ] **Si hay panel fijo, no crece** con ningún estado del intento.
- [ ] **Los guiones del sitio siguen en verde.**

### Los comprueba el autor en el navegador

- [ ] **La página se reconoce como parte del sitio, pero se distingue del cuestionario al primer vistazo.**
- [ ] **En la maqueta del intento, el cronómetro por pregunta es lo primero que se ve.**
- [ ] **Las pantallas mantienen coherencia entre sí.**
- [ ] **En 375 px de ancho, la maqueta del intento es cómoda con el pulgar**, con «Siguiente» y «Omitir» alcanzables sin
  confundirse.
- [ ] **En escala de grises**, aciertos, errores, omitidas y urgencia del cronómetro se distinguen.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado.

## Notas de la iteración

_Pendiente._