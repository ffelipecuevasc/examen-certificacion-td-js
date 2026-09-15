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
| 32 | Rediseño del panel fijo                  | 🟢 Completada · 2026-09-15 |
| 33 | Memoria del avance                       | 🟢 Completada · 2026-09-15 |
| 34 | Justificación y repaso                   | ⚪ No iniciada             |
| 35 | Transición de carga                      | ⚪ No iniciada             |
| 36 | [Orientación del estudiante en la portada](iteracion-36-orientacion-en-la-portada.md) | ⚪ No iniciada |

**Orden de trabajo: 33 → 36 → 34 → 35.** Decidido por el autor el **2026-09-15**, al cerrar la 33.
La 36 se adelanta a la 34 y la 35 porque **la portada publica hoy una cifra falsa**, que es un
defecto a la vista de cualquiera que entre, y porque **la 36 no depende de la 33, la 34 ni la 35**:
toca `index.html`, no el cuestionario. Las otras dos siguen después, en su orden, y ninguna se
descarta.

**Reorganizado el 2026-09-15, por decisión del autor.** La antigua iteración 33 («Memoria del avance, justificaciones y
repaso») juntaba ocho frentes y se partió en tres: 33, 34 y 35. La orientación en la portada pasó de la 34 a la 36.
Ninguna de las iteraciones renumeradas estaba iniciada, así que ninguna ADR queda apuntando al
vacío. **Sí quedan citas antiguas a la numeración vieja, y no se reescriben:** la iteración 25
—líneas 462, 836 y 913— y tres bitácoras —`2026-09-10-cierre-epica-20.md`,
`2026-09-10-iteracion-25-modulo-03.md` y `2026-09-10-iteracion-25-modulo-04.md`— citan la
**justificación visible** como iteración 33. Eran ciertas el día que se escribieron, y las
bitácoras y las iteraciones cerradas son registro histórico: se leen para saber qué se sabía
entonces, no para saber dónde está hoy cada cosa. Por eso se dejan como están, y la corrección
vive acá: **la justificación visible es hoy la iteración 34.**