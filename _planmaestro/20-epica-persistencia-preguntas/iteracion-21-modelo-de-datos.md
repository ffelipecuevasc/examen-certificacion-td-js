# Iteración 21 · Modelo de datos del banco

**Épica:** 20 · Persistencia de preguntas
**Estado:** ⚪ No iniciada
**Depende de:** épica 10 cerrada

## Objetivo

Definir cómo se estructura el banco de preguntas en D1 y dejar el esquema creado,
antes de escribir el código que lo consume.

## Contexto

Hoy las preguntas están en `static/js/data/cuestionario.js` con esta forma: grupos
por módulo, y dentro de cada grupo preguntas con enunciado, cuatro alternativas,
índice de la correcta y una marca `fijo`. El esquema nuevo debe cubrir eso sin
pérdida, y además lo que se necesitará más adelante: justificación, dificultad y
estado de revisión.

## Decisiones a cerrar

Ninguna es obvia. Resuélvelas con argumentos y documéntalas.

1. **Cómo se modelan las alternativas.** Cuatro columnas en la tabla de preguntas,
   o una tabla aparte con una fila por alternativa. La segunda es más limpia en
   términos relacionales; la primera es más simple de consultar y de administrar a
   mano. El público del proyecto es un bootcamp que enseña bases de datos
   relacionales: el esquema es material didáctico además de infraestructura.
2. **Cómo se identifica la respuesta correcta.** Sin usar una posición fija, porque
   ADR-006 obliga a barajar.
3. **Qué se hace con las preguntas retiradas.** Borrarlas rompería cualquier
   referencia guardada; marcarlas como retiradas obliga a filtrar en cada consulta.

## Tareas

- [ ] Revisar `static/js/data/cuestionario.js` y `scripts/build-cuestionario.py`, y
      resumir qué campos existen hoy.
- [ ] Diseñar el esquema, cubriendo como mínimo: módulo, enunciado, alternativas,
      cuál es la correcta, justificación, orden fijo, dificultad y estado.
- [ ] Resolver las tres decisiones anteriores y documentarlas como ADR.
- [ ] Escribir las migraciones que crean el esquema, versionadas en el repositorio.
- [ ] Definir las restricciones que la propia base debe hacer cumplir: cuáles son
      responsabilidad del esquema y cuáles del código.
- [ ] Definir los índices necesarios para las consultas previstas: banco completo
      por módulo, y selección aleatoria para el simulacro.
- [ ] Cargar diez filas de ejemplo, incluyendo un caso de orden fijo.
- [ ] Registrar los términos nuevos en `00_producto/glosario.md`.

## Criterios de aceptación

- [ ] El esquema está documentado campo por campo, con tipo, obligatoriedad y
      ejemplo.
- [ ] El esquema cubre los cuatro campos que hoy existen, sin pérdida de
      información, incluida la marca de orden fijo.
- [ ] Las migraciones corren sobre una base vacía y dejan el esquema listo.
- [ ] Las migraciones están versionadas y son repetibles: correrlas dos veces no
      rompe nada.
- [ ] Una fila que viole una restricción es rechazada por la base, y se demuestra
      intentando insertarla.
- [ ] Las diez filas de ejemplo están cargadas y son consultables.
- [ ] Las tres decisiones están publicadas como ADR, cada una con la alternativa
      descartada y su motivo.

## Notas de la iteración

_Pendiente._
