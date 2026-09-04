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

## Lo que cambio antes de empezar

El archivo de esta iteración se escribió cuando el banco eran 105 preguntas en
`static/js/data/cuestionario.js`. Hoy existen además **300 preguntas nuevas** en
siete JSON, escritas a mano y sin solapamiento de enunciados con las anteriores.

**Decisión del autor, 2026-09-04: el banco nuevo suma, no reemplaza.** Quedan 405
preguntas. Descartar 105 ya escritas y probadas sería caro. La consecuencia es que
el esquema tiene que recibir dos orígenes con formas distintas, y que hay que
revisar **solapamiento de contenido**, no solo enunciados idénticos: dos preguntas
distintas sobre exactamente lo mismo son un problema para el simulacro.

Merece una ADR propia; queda propuesta y sin escribir hasta que el autor lo decida.

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

- [ ] **Informe de hechos sobre los dos bancos, antes de diseñar nada.** Un script
      local lee los siete `_planmaestro/00_producto/cuestionarios/modulo-0N.json` y
      `static/js/data/cuestionario.js`, y reporta: si cada archivo se lee, cuántas
      preguntas hay por módulo y en total, huecos y repetidos en la numeración,
      campos de más y de menos, tipos inesperados, preguntas sin cuatro
      alternativas, correctas que apuntan a una letra inexistente, enunciados
      repetidos dentro y entre módulos, alternativas repetidas dentro de una
      pregunta, distribución de la letra correcta, cobertura de justificaciones, y
      candidatos a solapamiento de contenido entre los dos bancos. El esquema se
      diseña después del informe, no antes.
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
