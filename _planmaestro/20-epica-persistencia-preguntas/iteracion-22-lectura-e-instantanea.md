# Iteración 22 · Lectura, validación e instantánea

**Épica:** 20 · Persistencia de preguntas
**Estado:** ⚪ No iniciada
**Depende de:** iteración 21

## Objetivo

Que el banco llegue desde D1 hasta `cuestionario.html`, validado, y que el sitio
siga funcionando cuando la capa de datos no responda.

## Contexto de seguridad

Esto es lo más delicado de la épica. Hasta ahora, el contenido de las preguntas
venía de archivos del propio repositorio. Desde esta iteración viene de una base de
datos, y el escapado deja de ser higiene para convertirse en una barrera de
seguridad. Ver hallazgo H-003.

La regla es de doble filo: se valida al entrar a la base y se escapa al salir al
DOM. Confiar en solo uno de los dos lados es el error clásico.

## Tareas

- [ ] Implementar los extremos de lectura en el Worker: banco completo y consulta
      por módulo.
- [ ] Validar cada registro antes de entregarlo. Un registro inválido se descarta
      sin tumbar la respuesta completa.
- [ ] Producir un informe de validación legible: cuántos registros se leyeron,
      cuántos se descartaron y por qué motivo cada uno.
- [ ] Implementar la generación de la instantánea desde D1 hacia un archivo
      versionado, según ADR-008.
- [ ] Implementar el respaldo en el sitio: si el Worker no responde, se carga la
      instantánea y **se avisa al estudiante** de que puede no estar al día.
- [ ] Aplicar `esc()` a todo texto del banco antes de insertarlo en el DOM.
- [ ] Adaptar `cuestionario.html` para consumir el nuevo canal, sin cambiar todavía
      su diseño.
- [ ] Mantener `static/js/data/cuestionario.js` hasta que la iteración 24 confirme
      la migración completa.

## Criterios de aceptación

- [ ] `cuestionario.html` muestra las preguntas provenientes de D1.
- [ ] Un registro con un campo obligatorio vacío se descarta y aparece en el informe
      de validación con su motivo.
- [ ] Un registro cuya respuesta correcta no corresponde a ninguna alternativa se
      descarta y aparece en el informe.
- [ ] Existe la instantánea versionada y su contenido coincide con lo que hay en D1.
- [ ] Con el Worker caído, el sitio carga desde la instantánea y muestra el aviso: se
      demuestra provocando la caída.
- [ ] El aviso de respaldo es visible para el estudiante y no solo un mensaje de
      consola.
- [ ] Una pregunta cuyo enunciado contenga `<div>` se muestra como texto literal y
      no altera el diseño de la tarjeta.
- [ ] Una pregunta con orden fijo conserva el orden de sus alternativas tras varias
      recargas; una sin la marca lo cambia.
- [ ] Sin errores de consola al cargar la página servida por HTTP.

## Verificación

Los criterios del escapado y del respaldo se comprueban provocando la situación, no
razonando sobre el código.

## Notas de la iteración

_Pendiente._
