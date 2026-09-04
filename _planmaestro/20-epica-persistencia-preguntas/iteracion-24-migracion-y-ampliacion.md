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

- [ ] **Los dos bancos están en D1 y suman lo que deben sumar.** No es una
      migración que reemplaza sino una unión: las 105 preguntas de
      `static/js/data/cuestionario.js` más las 300 de los siete JSON, 405 en total.
      La comparación automática contra ambos orígenes no arroja diferencias:
      ninguna pregunta perdida, ninguna respuesta correcta desplazada, ninguna
      duplicada por haber cargado un origen dos veces. *Reescrito el 2026-09-04:
      el criterio original hablaba de migrar las 105 originales, y describía una
      migración que dejó de existir cuando el autor decidió que el banco nuevo
      suma en vez de reemplazar.*
- [ ] **La única pregunta con orden fijo conserva su marca.** Es la **posición 13
      del módulo 2**, sobre el comando de Git que crea una rama y cambia a ella, y
      su alternativa (d) dice «Ambas B y C son correctas». Es la única de las 105
      con `fijo: true` y la única alternativa de los dos bancos que se refiere a
      otras por su letra. *Comprobado con `npm run informe-banco` el 2026-09-04:
      el criterio original era exacto en las dos cosas, en la posición y en la
      descripción.*

      **Riesgo concreto de esta iteración:** esa marca vive **solo** en
      `static/js/data/cuestionario.js`. Los siete JSON nuevos no traen el campo.
      Si se retira ese archivo antes de rescatarla —y retirarlo es una tarea de
      esta misma iteración— la información se pierde sin que nada avise, y una
      pregunta cuyas alternativas se refieren entre sí pasa a barajarse. El
      rescate va antes del retiro, no después.

      Dato a favor, comprobado por el autor: en las 300 preguntas nuevas no hay
      ninguna alternativa que se refiera a otra por letra ni del tipo «todas las
      anteriores». Todas se pueden barajar.
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
