# Iteración 24 · Migración del contenido y ampliación del banco

**Épica:** 20 · Persistencia de preguntas
**Estado:** ⚪ No iniciada
**Depende de:** iteración 23

## Objetivo

Llevar las 105 preguntas actuales a D1 sin perder información, ampliar el banco
hasta unas 300 y dotar a cada pregunta de su justificación.

## Contexto

El banco de origen tiene un sesgo conocido: en las 105 preguntas actuales, cerca de
la mitad de las respuestas correctas ocupan la segunda posición (ver H-004). El
barajado lo neutraliza en pantalla, pero conviene no arrastrarlo al ampliar.

La justificación es la carencia pedagógica más grande del producto: hoy el
estudiante sabe que falló, pero no por qué. Redactarlas es trabajo de contenido y
corresponde al autor; Claude Code aporta el andamiaje, la validación y la detección
de las que falten.

## Tareas

- [ ] Migrar las 105 preguntas actuales a D1, conservando módulo, alternativas,
      respuesta correcta y marca de orden fijo.
- [ ] Verificar la migración comparando lo que hay en D1 contra los datos actuales:
      ninguna pregunta perdida, ninguna respuesta correcta desplazada.
- [ ] Informar cuántas preguntas quedan sin justificación, agrupadas por módulo.
- [ ] Informar la distribución de la posición de la respuesta correcta por módulo,
      para que el autor equilibre al redactar las nuevas.
- [ ] Detectar preguntas duplicadas o casi idénticas.
- [ ] Acompañar la ampliación hasta ~300: validar cada lote que el autor cargue e
      informar los problemas encontrados.
- [ ] Comprobar el comportamiento del sitio con el banco completo, incluida la
      instantánea de respaldo, que ahora pesa bastante más.
- [ ] Retirar `static/js/data/cuestionario.js` y `scripts/build-cuestionario.py` una
      vez confirmada la migración, dejando constancia en la bitácora.

## Criterios de aceptación

- [ ] Las 105 preguntas originales están en D1 y la comparación automática contra
      los datos previos no arroja diferencias.
- [ ] La pregunta 13 del módulo 2, la de alternativas que se refieren por letra,
      conserva su marca de orden fijo.
- [ ] Existe un informe de cobertura de justificaciones por módulo.
- [ ] Existe un informe de distribución de la respuesta correcta por módulo.
- [ ] El detector de duplicados corre y su resultado está documentado.
- [ ] El banco supera las 250 preguntas válidas y ninguna válida carece de
      justificación.
- [ ] `cuestionario.html` funciona con el banco completo sin degradación perceptible.
- [ ] La instantánea con el banco completo se genera correctamente y su peso está
      medido y documentado.

## Notas de la iteración

_Pendiente._
