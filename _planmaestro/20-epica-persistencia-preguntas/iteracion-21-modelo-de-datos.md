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

**Decisión del autor, 2026-09-04: el banco nuevo suma, no reemplaza.** Publicada
como **ADR-016**. Descartar 105 preguntas ya escritas y probadas sería caro. La
consecuencia es que el esquema tiene que recibir dos orígenes con formas distintas,
y que hubo que revisar **solapamiento de contenido**, no solo enunciados idénticos:
dos preguntas distintas sobre exactamente lo mismo son un problema para el
simulacro.

Esa revisión ya ocurrió. De las 405 se retiraron 37 por solapamiento real, con el
detalle en la iteración 24: **el esquema tiene que recibir 368 preguntas**, 285 del
banco nuevo y 83 del viejo. Las 37 retiradas siguen existiendo en
`cuestionarios/retiradas.json`, y qué se hace con ellas es exactamente la decisión
3 de esta iteración.

## Decisiones a cerrar

Ninguna es obvia. Resuélvelas con argumentos y documéntalas.

1. **Cómo se modelan las alternativas.** Cuatro columnas en la tabla de preguntas,
   o una tabla aparte con una fila por alternativa. La segunda es más limpia en
   términos relacionales; la primera es más simple de consultar y de administrar a
   mano. El público del proyecto es un bootcamp que enseña bases de datos
   relacionales: el esquema es material didáctico además de infraestructura.
2. **Cómo se identifica la respuesta correcta.** Sin usar una posición fija, porque
   ADR-006 obliga a barajar.

   **Decisión del autor, 2026-09-04, que deja esta pregunta casi cerrada:** el sesgo
   de la respuesta correcta —la `b` se lleva el 41,7 % del banco nuevo y el 47,6 %
   del viejo— **se corrige barajando, sin tocar el contenido de las preguntas**.
   Reescribir 405 preguntas para equilibrar posiciones sería trabajo enorme con
   riesgo de introducir errores, y el barajado ya neutraliza el efecto en pantalla.

   De ahí se sigue lo que el esquema tiene que cumplir: **si se baraja, la
   respuesta correcta no puede identificarse por su posición**. Guardar «la
   correcta es la segunda» deja de significar nada en cuanto el orden cambia en
   cada carga. La correcta tiene que estar atada a la alternativa, no al lugar.

   **Con una excepción que el esquema también debe soportar:** la pregunta con
   `fijo = true` —posición 13 del módulo 2, cuya alternativa (d) dice «Ambas B y C
   son correctas»— **no se baraja**, y ahí la correcta sí depende del orden. Los
   dos casos conviven en la misma tabla, así que el modelo tiene que resolver los
   dos sin ramas especiales en el código del navegador.
3. **Qué se hace con las preguntas retiradas.** Borrarlas rompería cualquier
   referencia guardada; marcarlas como retiradas obliga a filtrar en cada consulta.
4. **Dónde viven el título y el ícono de cada módulo.** *Añadida por el autor el
   2026-09-04.* El banco viejo los trae por grupo y el nuevo solo trae el número,
   así que hoy viven en `static/js/data/`. Si el esquema no les hace sitio, se
   pierden al migrar sin que nada avise.

**Las cuatro quedaron cerradas el 2026-09-04**, con el detalle campo por campo en
`90-manual/esquema-del-banco.md`: ADR-018 (alternativas en tabla aparte), ADR-019
(la correcta es una bandera con índice único parcial), ADR-020 (las retiradas se
marcan y se ocultan tras una vista) y ADR-021 (los módulos son una tabla).

## Tareas

- [x] **Informe de hechos sobre los dos bancos, antes de diseñar nada.** Un script
      local lee los siete `_planmaestro/00_producto/cuestionarios/modulo-0N.json` y
      `static/js/data/cuestionario.js`, y reporta: si cada archivo se lee, cuántas
      preguntas hay por módulo y en total, huecos y repetidos en la numeración,
      campos de más y de menos, tipos inesperados, preguntas sin cuatro
      alternativas, correctas que apuntan a una letra inexistente, enunciados
      repetidos dentro y entre módulos, alternativas repetidas dentro de una
      pregunta, distribución de la letra correcta, cobertura de justificaciones, y
      candidatos a solapamiento de contenido entre los dos bancos. El esquema se
      diseña después del informe, no antes.
- [x] Revisar `static/js/data/cuestionario.js` y `scripts/build-cuestionario.py`, y
      resumir qué campos existen hoy.
- [x] Diseñar el esquema, cubriendo como mínimo: módulo, enunciado, alternativas,
      cuál es la correcta, justificación, orden fijo, dificultad y estado.
- [x] Resolver las decisiones anteriores y documentarlas como ADR. Fueron
      cuatro, no tres: el autor añadió dónde viven el título y el ícono del
      módulo. ADR-018, ADR-019, ADR-020 y ADR-021.
- [x] Escribir las migraciones que crean el esquema, versionadas en el repositorio.
- [x] Definir las restricciones que la propia base debe hacer cumplir: cuáles son
      responsabilidad del esquema y cuáles del código.
- [x] Definir los índices necesarios para las consultas previstas: banco completo
      por módulo, y selección aleatoria para el simulacro.
- [ ] Cargar diez filas de ejemplo, incluyendo un caso de orden fijo.
- [ ] Registrar los términos nuevos en `00_producto/glosario.md`.

## Criterios de aceptación

- [ ] El esquema está documentado campo por campo, con tipo, obligatoriedad y
      ejemplo.
- [ ] **El esquema cubre los dos orígenes sin pérdida de información.** No son
      cuatro campos: son dos formas distintas, y cada una trae algo que la otra no
      tiene. Del banco viejo (`static/js/data/cuestionario.js`): `modulo` como
      texto «Módulo N», `q`, `opciones` como lista de textos, `correcta` como
      **índice** 0-3, `fijo`, más el **título y el ícono del módulo** por grupo. Del
      banco nuevo (`cuestionarios/modulo-0N.json`): `modulo` como **entero**,
      `numero`, `enunciado`, `alternativas` como lista de `{letra, texto}`,
      `correcta` como **letra**. Ninguno de los dos trae justificación.

      Lo que hay que demostrar, campo por campo: que el identificador de módulo
      quedó unificado y **ningún módulo entra dos veces**; que el título y el ícono
      sobreviven aunque solo un origen los traiga; que la marca de orden fijo
      sobrevive aunque solo un origen la traiga; y que la correcta se identifica
      igual viniendo de un índice o de una letra. *Reescrito el 2026-09-04: el
      criterio original hablaba de «los cuatro campos que hoy existen», redactado
      cuando el banco nuevo no existía.*
- [ ] Las migraciones corren sobre una base vacía y dejan el esquema listo.
- [ ] Las migraciones están versionadas y son repetibles: correrlas dos veces no
      rompe nada.
- [ ] Una fila que viole una restricción es rechazada por la base, y se demuestra
      intentando insertarla.
- [ ] Las diez filas de ejemplo están cargadas y son consultables.
- [ ] Las tres decisiones están publicadas como ADR, cada una con la alternativa
      descartada y su motivo.

## Notas de la iteración

### Recorrido del 2026-09-04: pasos 1 a 4

El autor ejecutó los pasos 1 a 4 contra la base D1 **local** y se detuvo antes del 5.
Lo que quedó comprobado:

- **La migración es repetible.** Aplicada dos veces: 10 sentencias las dos veces, sin
  error y sin duplicar nada.
- **Los conteos cuadran:** 7 módulos, 10 preguntas, 8 activas, 40 alternativas.
- **Las nueve restricciones rechazaron su inserción**, cada una con el mensaje
  previsto: `CHECK` de letra, `UNIQUE` de letra, `UNIQUE` de orden, `UNIQUE` de
  `pregunta_id` sobre la segunda correcta, llave foránea, `CHECK` de estado y motivo
  de retiro, `UNIQUE` de enunciado, `UNIQUE` de origen + módulo + número de origen, y
  `CHECK` de `es_correcta`.

### Los criterios que dependen de la consulta de verificación quedan abiertos

`scripts/verificar-banco.mjs` estaba roto durante todo ese recorrido: daba
`BANCO CON PROBLEMAS *** 1 *** / undefined -> undefined` las tres veces que se
corrió —antes de romper nada, después de borrar una alternativa y después de
reinsertarla—, o sea el mismo veredicto para tres estados distintos de la base. Es
el hallazgo **H-013**, y está resuelto en la auditoría técnica, con el script
reescrito y sus tres veredictos provocados de verdad desde un clon limpio en
Windows.

Pero **el arreglo del script no cierra los criterios**. Lo que se probó el 2026-09-04
se probó con el guardián averiado y sobre una base que las propias pruebas
ensuciaron: el paso 4 borró una alternativa y la repuso a mano. Los criterios que se
apoyan en la consulta de verificación siguen **sin marcar**, y se cierran cuando el
autor repita el paso 4 **desde una base local reconstruida**, no antes. El
procedimiento de reconstrucción está en `90-manual/esquema-del-banco.md`, sección
«Devolver la base local a un estado conocido».

Ninguna casilla de «Criterios de aceptación» se tocó en esta pasada, a propósito.

### El paso 5 no se ejecutó, y se traslada a la iteración 24

Aplicar la migración en las bases de la nube —pruebas y producción— **no ocurrió**.
Queda para la iteración 24, junto con la carga del banco, y así está anotado en el
registro. El motivo es que crear el esquema en producción sin contenido que meterle
no aporta nada y sí abre una ventana en la que la base publicada tiene tablas
vacías. Arrastra consigo el borrado de `prueba_tuberia` en ambas bases, que ya estaba
anotado para esta iteración.

Al escribir el procedimiento apareció un defecto en el manual que habría reventado
justo en ese paso: los comandos para `examen-td-js-pruebas` omitían `--env preview`,
y esa base sólo está declarada bajo `[[env.preview.d1_databases]]`. Sin el
argumento, wrangler responde que la base no existe. Corregido en
`90-manual/esquema-del-banco.md` y comprobado contra la base local.
