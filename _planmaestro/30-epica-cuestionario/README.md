# Épica 30 · Cuestionario

**Estado:** ⚪ No iniciada
**Depende de:** épica 20

## Problema

`cuestionario.html` funciona, pero fue construido para 105 preguntas dibujadas de
una vez y sin memoria entre visitas. Con un banco de 300 preguntas, tres carencias
se vuelven serias: el avance se pierde al recargar, no hay forma de volver solo
sobre lo fallado, y responder mal no enseña nada porque no se explica el porqué.

## Resultado esperado

Una página de estudio a ritmo propio que muestre el banco completo, recuerde dónde
quedó el estudiante, explique cada respuesta y permita repasar solo los errores.

## Alcance

- Consumo del banco completo, con renderizado que no penalice la carga.
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
| 31 | Banco completo y renderizado por módulo | ⚪ No iniciada |
| 32 | Rediseño del panel fijo | ⚪ No iniciada |
| 33 | Memoria del avance, justificaciones y repaso | ⚪ No iniciada |
