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
- [ ] Intentar salir con un intento en curso muestra una advertencia.
- [ ] El simulacro es alcanzable desde el menú, el pie y la portada.

## Notas de la iteración

_Pendiente._
