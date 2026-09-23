# Iteración 53 · Caché y rendimiento

**Épica:** 50 · Endurecimiento y observabilidad
**Estado:** ⚪ No iniciada
**Depende de:** épicas 10, 20, 30 y 40

## Objetivo

Aprovechar la red de Cloudflare para que el sitio cargue rápido, sin que un
estudiante quede atrapado con una versión antigua tras una actualización.

## Contexto

Hoy Pages ya sirve los estáticos con `public, max-age=0, must-revalidate` más
ETag: un estudiante con el CSS antiguo en caché siempre revalida y recibe el
nuevo. El riesgo del planteamiento original —un archivo cambia de contenido
conservando su nombre y deja a alguien con una versión rota— **no existe hoy**,
y sólo aparecería si se alargara la caché sin antes poner huella en el nombre.

**Decisión del autor, 2026-09-22: por ahora la caché de los archivos generados
se queda como está.** No se alarga el `max-age`, así que tampoco hace falta
poner huella en los nombres todavía. Queda anotado como trabajo futuro, para
cuando se persiga esa ganancia de velocidad.

Con la capa de datos aparece un segundo frente: cachear las respuestas del
Worker reduce el consumo de D1 y acelera la carga, pero una corrección del
autor tardaría en verse. Hay que decidir cuánto desfase es aceptable y cómo
forzar la renovación tras una edición.

## Tareas

- [ ] Definir la política de caché de cada tipo de recurso.
- [ ] Dejar escrito, con las cabeceras reales del sitio publicado como evidencia, que los archivos generados siguen con
      `max-age=0, must-revalidate` y ETag, y que alargar esa caché exige antes poner huella en el nombre (decisión del
      autor, 2026-09-22).
- [ ] Auto-hospedar las tipografías y eliminar la dependencia externa.
- [ ] Reescribir la política de seguridad de contenido que dejó la 51 al auto-hospedar las tipografías: salen
      `fonts.googleapis.com` de `style-src` y `fonts.gstatic.com` de `font-src`. Va en este orden por decisión del
      autor (51 → 53 → 52).
- [ ] Medir el rendimiento antes y después, y dejar constancia.
- [ ] Revisar H-007 con los números reales, porque ya cumplió su propia condición de reapertura: se aceptó con «se
      revisa si crece», y creció de 40 a 44 íconos y a 29 KB (29 326 bytes el 2026-09-23), servidos completos en cada
      página. Tarea ligera: decidir si sigue siendo aceptable y dejar escrita la decisión en `auditoria_tecnica.md`
      —aceptarlo de nuevo con la cifra nueva, o hacer algo al respecto—. No hay una respuesta supuesta de antemano.
- [ ] Definir la política de caché de las respuestas del Worker y cómo se invalida
      tras editar el banco.
- [ ] Medir el consumo de D1 con la caché activa, para contrastarlo con los límites
      del plan gratuito (hallazgo H-008).
- [ ] Añadir la página 404 con la identidad del sitio. **No es cosmética:** sin un `404.html` en la raíz de lo publicado,
      Pages asume aplicación de página única y responde la portada con 200 a cualquier ruta inexistente. Es lo que
      permite distinguir un enlace roto de uno vivo y que una respuesta equivocada no quede cacheada. Ver la fila del
      `/favicon.ico` en `registro_log.md`, que decide además si se sirve un favicon de verdad.
- [ ] Sumar `404.html` a `LISTA_COPIA` y a `PAGINAS` en `scripts/build-dist.mjs`, y a `PAGINAS` en
      `scripts/comprobar-copias.mjs` si lleva el encabezado y el pie compartidos. Lo que no está en `LISTA_COPIA` no
      llega a `dist/`, y el build no avisa.

## Criterios de aceptación

- [ ] La política de caché está documentada por tipo de recurso.
- [ ] Se muestran las cabeceras de caché que sirve el sitio publicado para los archivos generados, y coinciden con la
      política documentada.
- [ ] Las tipografías se sirven desde el propio sitio y no hay peticiones a dominios
      externos para cargarlas.
- [ ] Se muestran las mediciones de rendimiento antes y después.
- [ ] La página 404 existe, mantiene la identidad y ofrece volver al inicio.
- [ ] Una ruta inventada responde 404, no 200 con la portada: se muestra la respuesta de dos o tres rutas distintas.
- [ ] `404.html` está en `dist/` después de `npm run build`, y quitarla de `LISTA_COPIA` hace que la prueba anterior
      falle.
- [ ] Con las tipografías auto-hospedadas, la política de seguridad de contenido ya no nombra dominios de Google, y las
      cuatro páginas —las tres de estudio y `acerca-de.html`, que entra en la 51— cargan sin errores de consola.
- [ ] La decisión sobre H-007 está escrita en `auditoria_tecnica.md` con la cifra medida, sea aceptarlo o cambiarlo.
- [ ] La caché del Worker está configurada y su desfase máximo está documentado.
- [ ] Tras editar una pregunta, el cambio llega al sitio dentro del plazo declarado:
      se demuestra con la prueba.
- [ ] Se muestra la medición del consumo de D1 antes y después de activar la caché.

## Notas de la iteración

_Pendiente._
