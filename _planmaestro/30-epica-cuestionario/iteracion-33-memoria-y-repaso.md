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

## Lo que esta iteración hereda de la 32

_Anotado el 2026-09-11, al reescribir la iteración 32._

La iteración 32 construye el **índice de los siete módulos**, pero sólo como control y
orientación: nombre, cuántas preguntas tiene cada uno, y saltar. **No muestra el avance de
cada módulo, y no es un olvido:** hasta esta iteración no hay avance que mostrar. Sin
memoria, como mucho un módulo tiene respuestas —el que está en pantalla— y los otros seis
están en cero; pintar esos seis ceros diría «sin empezar» donde la verdad es «se perdió».

**Esa mitad que falta es trabajo de acá.** Con el avance guardado, el índice de la 32 pasa a
mostrar cuánto lleva el estudiante en cada módulo, y recién entonces hace el trabajo que la
iteración 31 le encargó: que el estudiante termine lo que empieza porque ve lo que lleva, no
porque se le quite el control.

Consecuencias concretas para el diseño de la memoria:

- **El avance se guarda por módulo, no en un solo montón.** Si se guardara agregado, el
  índice no podría decir cuánto lleva cada uno, que es justamente para lo que existe.
- **El índice pasa a ser un lector del avance guardado**, y tiene que reflejar también lo que
  se borra: el control de «borrar el avance» de esta iteración lo deja en cero a la vista.
- **El aviso de pérdida de la iteración 31 cambia de sentido acá.** Hoy avisa porque cambiar
  de módulo pierde lo respondido. Con memoria, cambiar deja de perder nada, así que ese aviso
  o se retira o pasa a decir otra cosa. **No se puede quedar como está diciendo que se va a
  perder algo que ya no se pierde**, y eso hay que resolverlo en esta iteración.

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
