# Épica 40 · Simulacro de examen

**Estado:** ⚪ No iniciada · archivos reescritos el 2026-09-16, con decisiones pendientes
**Depende de:** épica 20 (banco en D1) y épica 30 cerrada (capa de datos con modo
degradado, escapado, justificación dibujada, patrón del panel, memoria en el navegador y
guiones de prueba con intercepción).

La entrega más grande del proyecto.

## Problema

Estudiar sin reloj entrena el conocimiento pero no la gestión del tiempo, que es donde
muchos estudiantes pierden la certificación. El cuestionario permite pensar
indefinidamente; el examen real, no.

## Resultado esperado

`simulacro.html`: un intento cronometrado **lo más parecido posible al examen real en su
parte de alternativas**. 120 preguntas del banco, una a la vez, 30 segundos cada una, 60
minutos en total, con las reglas del examen real para omitir y aprobar, y un resumen final
que diga si se aprobó el simulacro y en qué módulos se falló.

**Lo que no reproduce.** Según el contexto recogido en la iteración 36
(`_planmaestro/00_producto/contexto-del-examen.md`), en el examen real también se
programa. El simulacro entrena la parte de alternativas, no el examen completo, y ninguna
pantalla debe decir lo contrario.

**Pendiente de verificar antes de la iteración 41:** que las cifras 120 preguntas,
30 segundos, 60 minutos y 60 % de aprobación coincidan con `contexto-del-examen.md`.

## Reglas del examen real que el simulacro imita

Decididas por el autor el 2026-09-16:

1. **Se puede omitir una pregunta**, pero una pregunta omitida **no se puede volver a
   responder**: no hay vuelta atrás.
2. **Una pregunta omitida cuenta como incorrecta**, igual que una respondida mal.
3. **Se aprueba con al menos el 60 % de respuestas correctas** sobre el total del
   intento. Con 120 preguntas, 72 correctas.

## Aritmética del simulacro

120 preguntas × 30 segundos = 3.600 segundos = 60 minutos. La relación entre los dos
cronómetros depende de qué pasa con el tiempo sobrante, que decide la iteración 42.

## Alcance

- Pantalla de presentación con las reglas y botón de inicio.
- Un extremo nuevo que devuelve las 120 preguntas ya elegidas, repartidas entre los
  módulos, sin pares hermanos.
- Transición de carga mientras llega el intento.
- Cronómetro total y cronómetro por pregunta, ambos visibles.
- Una pregunta a la vez, con avance automático al agotarse el tiempo, avance manual y
  omisión con las reglas del examen real.
- Resumen de resultados con aprobación del simulacro, desglose por módulo y revisión.
- Identidad visual propia, sobre fondo negro, dentro de la paleta del sitio.

## Fuera de alcance

- Guardar el historial de intentos. Está en `registro_log.md` como idea futura.
- Cualquier forma de impedir que el estudiante inspeccione las respuestas: el sitio es
  estático y eso es una consecuencia asumida en ADR-001. **Confirmado por ADR-022 el
  2026-09-05:** la instantánea de respaldo incluye las respuestas correctas, así que es
  definitivo mientras exista el respaldo.
- La parte de programación del examen real.

## ⚠️ Choque abierto con ADR-022 · debe resolverse antes de la iteración 44

ADR-022 (2026-09-05) estableció que el simulacro es un **instrumento de estudio**, no de
evaluación con validez, porque no puede garantizar que nadie haya visto las respuestas
antes de responder. De ahí salió una restricción de vocabulario, vinculante para toda la
épica:

> Ninguna pantalla de esta épica llama a su resultado «puntaje oficial», «nota»,
> «calificación», «aprobado», «reprobado» ni ninguna fórmula que sugiera validez de
> certificación.

**El autor decidió el 2026-09-16 que el resumen diga si se aprobó o reprobó el
simulacro**, con el criterio del 60 % del examen real. Esa decisión **contradice
literalmente ADR-022**. Antes de construir la iteración 44 hay que enmendar ADR-022 con
una actualización fechada que diga:

- qué palabras pasan a estar permitidas y con qué forma (por ejemplo, «aprobaste el
  simulacro» y no «aprobado» a secas);
- qué palabras siguen prohibidas (candidatas: «puntaje oficial», «calificación»,
  «certificado», «certificación», «nota»);
- por qué el motivo original —las respuestas son públicas— no se ve afectado: el
  resultado imita el criterio del examen real, pero no certifica nada.

**Hasta que esa enmienda exista, rige ADR-022 tal como está.**

## Decisiones pendientes que cruzan la épica

Se resuelven antes de abrir la iteración donde se indica. Ninguna se asume en los
archivos de iteración.

| # | Decisión | Antes de |
|---|---|---|
| E1 | Enmienda de ADR-022 para permitir aprobado y reprobado del simulacro | 44 |
| E2 | Qué pasa con un intento en curso si se recarga la página o el teléfono cierra la pestaña | 41 |
| E3 | Cómo elige las preguntas el modo degradado (ADR-008) sin duplicar la lógica del extremo | 41 |
| E4 | Si la dirección visual (45) se fija antes de construir el cronómetro (42), para no rehacer marcado | 42 |
| E5 | Tratamiento del tiempo sobrante y relación entre los dos cronómetros | 42 |

## Iteraciones

| # | Iteración | Estado |
|---|---|---|
| 41 | Presentación, extremo y motor del intento | ⚪ No iniciada |
| 42 | Cronómetros | ⚪ No iniciada |
| 43 | Recorrido de una pregunta a la vez | ⚪ No iniciada |
| 44 | Resumen de resultados | ⚪ No iniciada |
| 45 | Identidad visual del simulacro | ⚪ No iniciada |

## Forma de los criterios en toda la épica

Como en la épica 30: cada criterio es una afirmación comprobable, se cierra **provocando**
el comportamiento, y se reparte entre los que prueba Claude Code con guion y los que
comprueba el autor en el navegador. Los cambios del banco, las demoras y las caídas se
simulan interceptando la respuesta del extremo, nunca con `banco:actualizar`,
`banco:insertar`, `datos:instantanea` ni nada que regenere
`static/js/data/instantanea-banco.js`. El tiempo se simula con un reloj controlado en los
guiones: ningún criterio de guion exige esperar 60 minutos reales.