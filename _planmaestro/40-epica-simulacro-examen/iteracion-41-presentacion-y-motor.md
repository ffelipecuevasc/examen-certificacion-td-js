# Iteración 41 · Pantalla de presentación y motor del intento

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada

## Objetivo

Crear `simulacro.html` con su pantalla de presentación y la maquinaria que gobierna
un intento, todavía sin cronómetros.

## Contexto

El simulacro comparte con `cuestionario.html` la estructura partida a la mitad, el
encabezado, el pie y el favicon. Lo que cambia es que aquí hay un antes y un
después: la página no arranca respondiendo, arranca explicando.

## Tareas

- [ ] Crear `simulacro.html` reutilizando el encabezado, el pie y el favicon del
      resto del sitio.
- [ ] Estructura partida a la mitad: panel fijo a la izquierda, contenido a la
      derecha, siguiendo el patrón ya establecido.
- [ ] Pantalla de presentación con las reglas del simulacro en lenguaje directo:
      cuántas preguntas, cuánto dura, qué pasa al agotarse el tiempo, y que las
      respuestas no se pueden cambiar una vez avanzada la pregunta.
- [ ] Botón de inicio, que es lo único que arranca el intento.
- [ ] Motor del intento: seleccionar 120 preguntas del banco repartidas entre los
      siete módulos, y sostener el estado del intento.
- [ ] Definir el reparto por módulo y justificarlo. Si el banco no alcanza para el
      reparto ideal, el comportamiento debe estar definido.
- [ ] Impedir que un mismo intento saque las dos preguntas de un par hermano
      (ver «Preguntas hermanas» más abajo).
- [ ] Advertir antes de abandonar la página con un intento en curso.
- [ ] Enlazar el simulacro desde el menú, el pie y el `index.html`.

## Criterios de aceptación

- [ ] `simulacro.html` carga con el mismo encabezado, pie y favicon que el resto.
- [ ] La pantalla de presentación explica las reglas sin tecnicismos.
- [ ] Nada del intento ocurre hasta pulsar el botón de inicio.
- [ ] Un intento contiene exactamente 120 preguntas, sin repetidas.
- [ ] El reparto por módulo se cumple y está documentado.
- [ ] Dos intentos consecutivos no producen la misma selección.
- [ ] Con banco insuficiente para el reparto, el comportamiento es el documentado y
      se demuestra reduciendo el banco a propósito.
- [ ] Ningún intento contiene las dos preguntas de un mismo par hermano.
- [ ] Intentar salir con un intento en curso muestra una advertencia.
- [ ] El simulacro es alcanzable desde el menú, el pie y la portada.

## Preguntas hermanas

*Anotado el 2026-09-04, al revisar el solapamiento entre los dos bancos. Actualizado
el mismo día, tras aplicar los retiros de la iteración 24.*

Diez pares que **no son duplicados**: cada pregunta evalúa algo distinto y por eso
ninguna se retiró. Pero se rozan tanto —dos caras del mismo tema, dos propiedades
del mismo objeto, una la pista de la otra— que sacarlas juntas en el mismo intento
convierte una en la respuesta de la otra. El motor tiene que saber que existen.

`m0X#N` es la pregunta con `numero` N en `modulo-0X.json`, y ese número es estable.
`MX·N` es una posición dentro del módulo X de `static/js/data/cuestionario.js`, y
**las posiciones se movieron** al retirar 22 preguntas de ese banco. Por eso la
tabla trae las dos: la que se citó en la revisión original y la de hoy.

| Par (cita original) | Posición vieja hoy | Se rozan en |
|---|---|---|
| m08#3 ↔ M8·2 | M8·1 | cómo nombrar un endpoint / cómo estructurar el de un recurso concreto |
| m05#38 ↔ M5·13 | M5·10 | objetivo de normalizar / objetivo de la 3FN, que es un caso del anterior |
| m05#33 ↔ M5·13 | M5·10 | dependencia transitiva / objetivo de la 3FN |
| m05#30 ↔ M5·12 | M5·9 | entidad fuerte / entidad débil: cada definición insinúa la otra |
| m02#26 ↔ M2·8 | M2·6 | evento `change` / evento `blur` |
| m07#12 ↔ M7·7 | M7·5 | `rows` / `rowCount`, dos propiedades del mismo objeto |
| m05#26 ↔ M5·11 | M5·8 | `DROP` / `TRUNCATE`, que a su vez se contrasta con `DELETE` |
| m05#16 ↔ M5·10 | M5·7 | qué ocurre al violar una llave foránea / qué restricción la impone |
| m02#25 ↔ M3·7 | M3·5 | `let` sobre `var` al iterar / iteradoras globales en ciclos anidados |
| m03#33 ↔ M3·13 | M3·10 | notación de corchetes / notación de punto |

**M5·13 aparece dos veces**, con `m05#38` y con `m05#33`: ahí no hay un par sino un
trio, y el motor no puede tratarlo como dos restricciones sueltas.

**Tres avisos sobre esta lista:**

1. Eran once. `m08#23 ↔ M8·11` desapareció al retirarse `M8·11` en la iteración 24,
   por solapamiento real con `m08#24`.
2. **Las posiciones del banco viejo van a volver a moverse.** Ese banco no tiene
   identificadores: una pregunta es una posición dentro de una lista, y cualquier
   retiro futuro las corre otra vez. En cuanto la iteración 24 cargue las preguntas
   en D1 con identificador propio, **esta tabla debe reanclarse a esos
   identificadores** y dejar de citar posiciones. Hasta entonces, la columna
   «Se rozan en» es la forma fiable de encontrar cada pregunta.
3. La lista sale de los pares que detectó `npm run informe-banco`, que compara
   **redacción**, no significado. Dos preguntas hermanas escritas con vocabulario
   distinto no están aquí. Cumplir el criterio no garantiza que no salgan dos
   preguntas parecidas: garantiza que no salgan **estas**.

## Notas de la iteración

_Pendiente._
