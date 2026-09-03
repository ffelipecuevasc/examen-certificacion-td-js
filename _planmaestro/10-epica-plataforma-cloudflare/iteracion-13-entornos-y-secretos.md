# Iteración 13 · Entornos, secretos y procedimientos

**Épica:** 10 · Plataforma Cloudflare
**Estado:** ⚪ No iniciada
**Depende de:** iteración 12

## Objetivo

Separar pruebas de producción y dejar establecido cómo se manejan las credenciales,
antes de que exista contenido real que perder.

## Contexto

El momento de resolver esto es ahora, con una tabla de juguete. Una vez que D1
contenga 300 preguntas escritas a mano, equivocarse de entorno deja de ser un
inconveniente y pasa a ser una pérdida de trabajo.

## Tareas

- [ ] Separar el entorno de pruebas del de producción, con bases D1 distintas.
- [ ] Documentar cómo se sabe, sin ambigüedad, contra qué entorno se está
      trabajando.
- [ ] Establecer dónde viven las credenciales y confirmar que ninguna queda en el
      repositorio.
- [ ] Revisar el `.gitignore` para cubrir los archivos de credenciales de la
      herramienta de Cloudflare. Hay antecedente: ver hallazgo H-001.
- [ ] Definir el procedimiento de respaldo de la base: cada cuánto, dónde queda y
      cómo se restaura.
- [ ] Probar la restauración de un respaldo. Un respaldo que no se ha restaurado
      nunca no es un respaldo.
- [ ] Documentar el procedimiento de publicación completo en `90-manual/`.

## Criterios de aceptación

- [ ] Existen dos entornos con bases separadas, y se demuestra que un cambio en
      pruebas no aparece en producción.
- [ ] Está documentado cómo distinguir el entorno activo.
- [ ] Una revisión del repositorio no encuentra credenciales ni identificadores
      sensibles versionados.
- [ ] El `.gitignore` cubre los archivos de credenciales, y se verifica que un
      archivo de ese tipo efectivamente queda ignorado.
- [ ] El procedimiento de respaldo está documentado.
- [ ] Se ha restaurado un respaldo con éxito al menos una vez, con evidencia.
- [ ] El manual de publicación permite a alguien sin contexto previo publicar una
      actualización.

## Notas de la iteración

_Pendiente._
