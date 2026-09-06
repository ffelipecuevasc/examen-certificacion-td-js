# Iteración 44 · Resumen de resultados

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 43

## Objetivo

Cerrar el intento con un resumen que no solo dé una nota, sino que diga qué
estudiar.

## Contexto

Es la pantalla que justifica todo el simulacro. Un porcentaje aislado no sirve de
nada; lo útil es «fallaste 7 de 17 preguntas del módulo 7, vuelve a transacciones y
Sequelize».

## Tareas

- [ ] Resultado global: aciertos, errores, sin responder y porcentaje.
- [ ] Desglose por módulo, ordenado de peor a mejor desempeño.
- [ ] Tiempo empleado, total y promedio por pregunta.
- [ ] Revisión pregunta a pregunta con la respuesta dada, la correcta y la
      justificación.
- [ ] Enlaces desde cada módulo débil hacia su sección en `index.html`.
- [ ] Botón para rendir otro intento.
- [ ] Decidir si el resumen se puede conservar o compartir, y documentarlo.

## Criterios de aceptación

- [ ] Las cifras del resumen cuadran: aciertos más errores más sin responder es
      igual a 120.
- [ ] El desglose por módulo suma el total y está ordenado por desempeño.
- [ ] La revisión muestra, para cada pregunta, qué respondió el estudiante, cuál era
      la correcta y por qué.
- [ ] Las preguntas sin responder aparecen distinguidas de las falladas.
- [ ] Cada módulo del desglose enlaza a su sección correspondiente en la guía.
- [ ] Rendir otro intento produce una selección distinta.
- [ ] Un intento en que se agota el tiempo total llega igualmente a un resumen
      coherente.
- [ ] **Ninguna palabra de esta pantalla sugiere validez de certificación.** De
      **ADR-022**: no aparece «puntaje oficial», «nota», «calificación», «aprobado» ni
      «reprobado». Sí aparecen los aciertos, el desglose por módulo y el tiempo. Se
      comprueba leyendo el texto de la pantalla, no el código. **El motivo no se
      escribe en pantalla**: es una decisión interna —el simulacro no puede garantizar
      que nadie haya visto las respuestas antes de responder— y el estudiante no tiene
      por qué cargar con un descargo antes de estudiar. Lo que la decisión produce es
      este límite de vocabulario, y nada más.

## Notas de la iteración

_Pendiente._
