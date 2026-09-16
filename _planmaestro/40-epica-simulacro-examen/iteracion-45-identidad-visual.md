# Iteración 45 · Identidad visual del simulacro

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteraciones 41 a 44, salvo que la decisión E4 de la épica adelante la
dirección visual antes de la 42.

## Objetivo

Dar al simulacro un carácter visual propio, más serio que el del cuestionario, sobre el
mismo fondo negro del sitio y dentro de su paleta.

## Contexto

El cuestionario debe sentirse acogedor; el simulacro debe sentirse serio, casi solemne. Es
la diferencia entre estudiar y rendir. Esa distinción tiene que notarse al entrar, sin leer
una palabra.

## Historial de este archivo

- **2026-09-16 · reescrita.** El autor fijó el fondo negro y confirmó el uso de `ruby` y
  `esmeralda`. Se verificaron los tokens en `tailwind.config.cjs` y se midieron sus
  contrastes, que limitan dónde se puede usar `ruby`.

## Restricción de paleta

Decidido por el autor el 2026-09-16:

- **El fondo de la página es negro (`ink`, #000000)**, igual que todo el sitio.
- **Amarillo mostaza, negro predominante y blanco en pequeñas dosis**, con los tokens
  existentes: `jsyellow`, `jsyellowdim`, `paper`, `panel`, `panel2`, `panel3`, `muted`,
  `mutedink`.
- **Se usan los colores funcionales `ruby` y `esmeralda`**, con sus variantes `rubydim` y
  `esmeraldadim`, ya definidos en `tailwind.config.cjs`.
- **No entran colores nuevos.** La diferencia con el cuestionario se logra con escala
  tipográfica, contraste, densidad, ritmo y uso del espacio.

**Contrastes medidos el 2026-09-16** (WCAG 2.x):

| Color | Sobre `ink` | Sobre `panel` | Sobre `panel2` | Uso posible |
|---|---|---|---|---|
| `ruby` #E0115F | 4,41:1 | 3,98:1 | 3,70:1 | No como texto normal. Sí texto grande, bordes e íconos (3:1) |
| `esmeralda` #10B981 | 8,28:1 | 7,46:1 | 6,94:1 | Texto normal y grande |
| `paper` sobre `rubydim` #7A1236 | 9,95:1 | — | — | Texto sobre fondo de error |
| `paper` sobre `esmeraldadim` #0A5C43 | 7,46:1 | — | — | Texto sobre fondo de acierto |

Además: `rubydim` sobre `ink` da 1,97:1 y `esmeraldadim` 2,62:1. Un fondo de esos colores
no se distingue del negro por sí solo; necesita borde, riel o forma.

**Herencia de la 36:** ya no hay dos niveles de gris para dar jerarquía (`muted` y
`mutedink` están a 1,19:1 entre sí).

## Decisiones sin resolver

### 1 · Cuándo se fija la dirección visual (decisión E4 de la épica)

Si el cronómetro de 30 segundos debe ser el elemento dominante, eso condiciona cómo se
construye en la 42. Fijar la dirección aquí, al final, obliga a rehacer marcado. **Pendiente.**

### 2 · Qué significa cada color funcional (la decide el autor, con la 42)

Si `ruby` es «error» en el resumen, usarlo también para «se acaba el tiempo» mezcla dos
mensajes. **Pendiente.**

## Tareas

- [ ] Definir el tratamiento visual que distingue al simulacro y justificarlo por escrito.
- [ ] Aplicarlo a la presentación, la transición de carga, el intento y el resumen.
- [ ] Dar al cronómetro de 30 segundos el peso visual dominante durante el intento.
- [ ] Revisar el contraste de todo texto y borde sobre su fondo real.
- [ ] Verificar el comportamiento en 375 px de ancho.
- [ ] Revisar la legibilidad con movimiento reducido.

## Criterios de aceptación

### Los provoca Claude Code

- [ ] **El fondo de las tres pantallas y de la transición es `ink`.**
- [ ] **El marcado dibujado no usa colores fuera de los tokens listados** en la restricción
  de paleta.
- [ ] **`ruby` no aparece como color de texto de tamaño normal** en ninguna pantalla.
- [ ] **Todo texto alcanza 4,5:1 (o 3:1 si es grande) y todo borde o ícono significativo
  3:1 sobre su fondo real**, con tabla de elemento, color, fondo, de dónde sale el fondo y
  razón.
- [ ] **Todo significado expresado con `ruby` o `esmeralda` tiene además texto o forma**
  que lo comunica sin color.
- [ ] **Con el movimiento reducido simulado, ninguna animación nueva declara movimiento.**
- [ ] **La decisión visual está justificada por escrito** en este archivo.
- [ ] **Los guiones del sitio siguen en verde.**

### Los comprueba el autor en el navegador

- [ ] **La página se reconoce como parte del sitio, pero se distingue del cuestionario al
  primer vistazo.**
- [ ] **El cronómetro por pregunta es lo que primero se ve durante el intento.**
- [ ] **Las pantallas mantienen coherencia entre sí.**
- [ ] **En 375 px de ancho, el intento es cómodo de usar**, con el pulgar.
- [ ] **En escala de grises**, aciertos, errores, omitidas y urgencia del cronómetro se
  distinguen.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0.**

## Notas de la iteración

_Pendiente._