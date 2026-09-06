# Épica 40 · Simulacro de examen

**Estado:** ⚪ No iniciada
**Depende de:** épica 20

La entrega más grande del proyecto.

## Problema

Estudiar sin reloj entrena el conocimiento pero no la gestión del tiempo, que es
donde muchos estudiantes pierden la certificación. El cuestionario permite pensar
indefinidamente; el examen real, no.

## Resultado esperado

`simulacro.html`: un intento cronometrado que reproduce las condiciones del examen.
120 preguntas del banco, una a la vez, 30 segundos cada una, 60 minutos en total, y
un resumen final que diga en qué módulos falló.

## Aritmética del simulacro

120 preguntas × 30 segundos = 3.600 segundos = 60 minutos. Los dos cronómetros son
coherentes entre sí: el total es la suma de los individuales. Esto importa para
decidir qué ocurre cuando el estudiante responde antes de tiempo, lo que se resuelve
en la iteración 42.

## Alcance

- Pantalla de presentación con las reglas y botón de inicio.
- Selección de 120 preguntas del banco, repartidas entre los siete módulos.
- Cronómetro total y cronómetro por pregunta, ambos visibles.
- Una pregunta a la vez, con avance automático al agotarse el tiempo y avance
  manual mediante botón.
- Resumen de resultados con desglose por módulo.
- Identidad visual propia, más impactante que la del cuestionario, dentro de la
  paleta del logotipo de JavaScript.

## Fuera de alcance

- Guardar el historial de intentos. Está en `registro_log.md` como idea futura.
- Cualquier forma de impedir que el estudiante inspeccione las respuestas: el sitio
  es estático y eso es una consecuencia asumida en ADR-001. **Confirmado y cerrado
  por ADR-022 el 2026-09-05:** la instantánea de respaldo incluye las respuestas
  correctas, así que esto ya no es una limitación que algún día se levante — es
  definitivo mientras exista el respaldo.

## Restricción de vocabulario, vinculante para toda la épica

*De ADR-022, 2026-09-05.* El simulacro es un **instrumento de estudio**, no un
instrumento de evaluación con validez: no puede garantizar que nadie haya visto las
respuestas antes de responder, porque viajan en un archivo versionado de un
repositorio público.

Eso **no** se le advierte al estudiante en pantalla. Se aplica como límite de lo que la
interfaz puede prometer:

> **Ninguna pantalla de esta épica llama a su resultado «puntaje oficial», «nota»,
> «calificación», «aprobado», «reprobado» ni ninguna fórmula que sugiera validez de
> certificación.** Sí puede decir cuántas acertó, en qué módulos falló y cuánto tardó.

Está escrito como una lista de palabras y no como un principio porque quien redacte esa
pantalla puede no haber leído la ADR, y un principio no lo detiene.

## Iteraciones

| # | Iteración | Estado |
|---|---|---|
| 41 | Presentación y motor del intento | ⚪ No iniciada |
| 42 | Cronómetros | ⚪ No iniciada |
| 43 | Recorrido de una pregunta a la vez | ⚪ No iniciada |
| 44 | Resumen de resultados | ⚪ No iniciada |
| 45 | Identidad visual del simulacro | ⚪ No iniciada |
