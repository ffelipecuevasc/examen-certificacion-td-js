# Iteración 43 · Recorrido de una pregunta a la vez

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 42

## Objetivo

Presentar las 120 preguntas de una en una, con avance manual además del automático,
y sin revelar si la respuesta fue correcta hasta el final.

## Contexto

Esta es la diferencia conceptual con `cuestionario.html`. Allí la corrección es
inmediata porque el objetivo es aprender. Aquí no se corrige durante el intento,
porque el objetivo es medir: saber que fallaste la pregunta 3 cambiaría tu ánimo en
las 117 restantes, igual que en el examen real.

## Tareas

- [ ] Mostrar una pregunta a la vez, con su número y el total.
- [ ] Botón de avance para quien responde antes del tiempo.
- [ ] Registrar la respuesta sin revelar si fue correcta.
- [ ] Barra de avance del intento en el panel fijo.
- [ ] Decidir si se permite dejar una pregunta sin responder y avanzar, y
      documentarlo.
- [ ] Navegación por teclado: elegir alternativa y avanzar sin usar el ratón.
- [ ] Anunciar el cambio de pregunta a tecnologías de asistencia.

## Criterios de aceptación

- [ ] Solo hay una pregunta visible en cada momento.
- [ ] El botón de avance funciona y respeta los cronómetros según la iteración 42.
- [ ] Durante el intento no se revela en ningún momento si una respuesta fue
      correcta.
- [ ] El indicador de posición refleja la pregunta real.
- [ ] Un intento completo de 120 preguntas puede recorrerse de principio a fin sin
      errores de consola.
- [ ] El intento completo puede realizarse solo con teclado.
- [ ] Al cambiar de pregunta, un lector de pantalla anuncia la nueva.

## Notas de la iteración

_Pendiente._
