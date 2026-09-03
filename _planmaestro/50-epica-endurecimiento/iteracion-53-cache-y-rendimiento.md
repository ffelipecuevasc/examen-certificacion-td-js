# Iteración 53 · Caché y rendimiento

**Épica:** 50 · Endurecimiento y observabilidad
**Estado:** ⚪ No iniciada
**Depende de:** épica 10

## Objetivo

Aprovechar la red de Cloudflare para que el sitio cargue rápido, sin que un
estudiante quede atrapado con una versión antigua tras una actualización.

## Contexto

Es un riesgo concreto. Los archivos generados cambian de contenido conservando su
nombre. Un estudiante con el CSS antiguo en caché y el HTML nuevo puede ver el sitio
roto, sin saber por qué ni cómo arreglarlo.

Con la capa de datos aparece un segundo frente: cachear las respuestas del Worker
reduce el consumo de D1 y acelera la carga, pero una corrección del autor tardaría
en verse. Hay que decidir cuánto desfase es aceptable y cómo forzar la renovación
tras una edición.

## Tareas

- [ ] Definir la política de caché de cada tipo de recurso.
- [ ] Resolver el problema del archivo generado que cambia sin cambiar de nombre.
- [ ] Cerrar el hallazgo H-005 con una comprobación previa a publicar que verifique
      que el CSS compilado está al día.
- [ ] Auto-hospedar las tipografías y eliminar la dependencia externa.
- [ ] Medir el rendimiento antes y después, y dejar constancia.
- [ ] Revisar el peso de `icons.css` en cada página, según el hallazgo H-007.
- [ ] Definir la política de caché de las respuestas del Worker y cómo se invalida
      tras editar el banco.
- [ ] Medir el consumo de D1 con la caché activa, para contrastarlo con los límites
      del plan gratuito (hallazgo H-008).
- [ ] Añadir la página 404 con la identidad del sitio.

## Criterios de aceptación

- [ ] La política de caché está documentada por tipo de recurso.
- [ ] Tras publicar un cambio de estilos, un navegador con la versión anterior en
      caché recibe la nueva: se demuestra con la prueba.
- [ ] Existe una comprobación que detecta el CSS desactualizado antes de publicar, y
      falla si lo está.
- [ ] Las tipografías se sirven desde el propio sitio y no hay peticiones a dominios
      externos para cargarlas.
- [ ] Se muestran las mediciones de rendimiento antes y después.
- [ ] La página 404 existe, mantiene la identidad y ofrece volver al inicio.
- [ ] La caché del Worker está configurada y su desfase máximo está documentado.
- [ ] Tras editar una pregunta, el cambio llega al sitio dentro del plazo declarado:
      se demuestra con la prueba.
- [ ] Se muestra la medición del consumo de D1 antes y después de activar la caché.

## Notas de la iteración

_Pendiente._
