# Iteración 33 · Memoria del avance, justificaciones y repaso

**Épica:** 30 · Cuestionario
**Estado:** ⚪ No iniciada

## Objetivo

Que el cuestionario recuerde dónde quedó el estudiante, explique cada respuesta y
permita volver solo sobre lo fallado.

## Contexto

Nadie responde 300 preguntas de una sentada. Sin memoria, cada visita empieza de
cero y el banco grande se vuelve un obstáculo en vez de una ventaja.

`vision.md` prohíbe registro y cuentas de usuario, así que la memoria vive en el
navegador del estudiante. Eso tiene consecuencias que hay que asumir y comunicar: no
se comparte entre dispositivos y se pierde al limpiar los datos del navegador.

## Tareas

- [ ] Guardar el avance en el navegador y restaurarlo al volver.
- [ ] Ofrecer una forma clara de borrar el avance, sin esconderla.
- [ ] Explicar al estudiante, en la propia página, que el avance vive solo en ese
      dispositivo.
- [ ] Mostrar la justificación de la pregunta al responder.
- [ ] Implementar el modo repaso: reintentar únicamente las preguntas falladas.
- [ ] Definir qué ocurre con el avance guardado si el banco cambia y una pregunta
      guardada ya no existe.
- [ ] Llevar el foco al lugar correcto al reiniciar o cambiar de modo.

## Criterios de aceptación

- [ ] Tras responder varias preguntas y recargar, el avance y las tres barras se
      conservan.
- [ ] Existe un control visible para borrar el avance, y funciona.
- [ ] La página declara que el avance es local a ese dispositivo.
- [ ] Al responder, aparece la justificación de esa pregunta.
- [ ] El modo repaso presenta exactamente las preguntas falladas, ni más ni menos.
- [ ] Con el modo repaso vacío, el mensaje que se muestra es útil y no un espacio en
      blanco.
- [ ] Si una pregunta guardada desaparece del banco, la restauración no falla y el
      comportamiento está documentado.
- [ ] Al reiniciar, el foco queda en un lugar razonable para quien navega con
      teclado.

## Notas de la iteración

_Pendiente._
