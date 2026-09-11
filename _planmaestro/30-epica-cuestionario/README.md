# Épica 30 · Cuestionario

**Estado:** 🔵 En curso
**Depende de:** épica 20, cerrada el 2026-09-10

## Problema

`cuestionario.html` funciona, pero fue construido para 105 preguntas dibujadas de
una vez y sin memoria entre visitas. El banco tiene hoy **368 preguntas**, así que
mostrarlas juntas dejó de ser una opción de diseño. A eso se suman tres carencias:
el avance se pierde al recargar, no hay forma de volver solo sobre lo fallado, y
responder mal no enseña nada porque no se explica el porqué.

## Resultado esperado

Una página de estudio a ritmo propio donde el estudiante elige qué módulo practicar,
el sitio recuerda dónde quedó, explica cada respuesta y permite repasar solo los
errores.

## Alcance

- Selector de módulo, con la zona de preguntas vacía hasta que se elija uno.
- Barras de progreso en formato horizontal, ocupando todo el ancho del panel.
- Índice de módulos con avance individual.
- Persistencia del avance en el navegador.
- Justificación visible al responder.
- Modo repaso de errores.

## Fuera de alcance

- Cronómetros y presión de tiempo. Eso es la épica 40.
- Cambios en el origen de los datos. Eso quedó cerrado en la épica 20.

## Iteraciones

| # | Iteración | Estado |
|---|---|---|
| 31 | Selector de módulo | 🟢 Completada · 2026-09-11 |
| 32 | Rediseño del panel fijo | 🔵 En curso |
| 33 | Memoria del avance, justificaciones y repaso | ⚪ No iniciada |