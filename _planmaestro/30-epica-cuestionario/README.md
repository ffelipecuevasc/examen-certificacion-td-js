# Épica 30 · Cuestionario

**Estado:** 🔵 En curso **Depende de:** épica 20, cerrada el 2026-09-10

## Problema

`cuestionario.html` funciona, pero fue construido para 105 preguntas dibujadas de una vez y sin memoria entre visitas.
El banco tiene hoy **368 preguntas**, así que mostrarlas juntas dejó de ser una opción de diseño. A eso se suman tres
carencias:
el avance se pierde al recargar, no hay forma de volver solo sobre lo fallado, y responder mal no enseña nada porque no
se explica el porqué.

## Resultado esperado

Una página de estudio a ritmo propio donde el estudiante elige qué módulo practicar, el sitio recuerda dónde quedó,
explica cada respuesta y permite repasar solo los errores.

## Alcance

- Elección de módulo, con la zona de preguntas vacía hasta que se elija uno.
- Barras de progreso en formato horizontal, ocupando todo el ancho del panel.
- Índice de módulos con avance individual.
- Persistencia del avance en el navegador.
- Justificación visible al responder.
- Modo repaso de errores, por módulo.
- Transición al cargar un módulo, fiel a la carga real.

## Fuera de alcance

- Cronómetros y presión de tiempo. Eso es la épica 40.
- Cambios en el origen de los datos. Eso quedó cerrado en la épica 20.
- Borrar todo el avance de una vez. Decidido por el autor el 2026-09-15: se borra módulo por módulo con «Reiniciar el
  módulo», y se evalúa con el uso.

## Iteraciones

| #  | Iteración                                | Estado                     |
|----|------------------------------------------|----------------------------|
| 31 | Selector de módulo                       | 🟢 Completada · 2026-09-11 |
| 32 | Rediseño del panel fijo                  | 🔵 En curso                |
| 33 | Memoria del avance                       | ⚪ No iniciada             |
| 34 | Justificación y repaso                   | ⚪ No iniciada             |
| 35 | Transición de carga                      | ⚪ No iniciada             |
| 36 | Orientación del estudiante en la portada | ⚪ No iniciada             |

**Reorganizado el 2026-09-15, por decisión del autor.** La antigua iteración 33 («Memoria del avance, justificaciones y
repaso») juntaba ocho frentes y se partió en tres: 33, 34 y 35. La orientación en la portada pasó de la 34 a la 36.
Ninguna de las iteraciones renumeradas estaba iniciada, así que ninguna bitácora ni ADR queda apuntando al vacío.