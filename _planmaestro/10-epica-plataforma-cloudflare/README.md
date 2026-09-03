# Épica 10 · Plataforma Cloudflare

**Estado:** 🔵 En curso
**Bloquea a:** todas las demás épicas

## Por qué esta épica va primera

En la versión anterior del plan, Cloudflare era la épica de cierre: se construía
todo y al final se publicaba. Con ADR-007, la plataforma pasa a ser el **cimiento**:
el banco de preguntas vive en D1, y sin D1 no hay banco, sin banco no hay
cuestionario y sin cuestionario no hay simulacro.

El endurecimiento —seguridad, métricas, caché— sigue siendo la épica de cierre, la
50. Lo que se adelanta es la infraestructura, no su afinamiento.

## Resultado esperado

El sitio servido desde Cloudflare Pages, con un Worker y una base D1 operativos en
el mismo dominio, y el procedimiento documentado para reconstruirlo desde cero.

## Alcance

- Publicación del sitio en Cloudflare Pages.
- Base de datos D1 creada, con entornos separados para pruebas y producción.
- Worker de datos desplegado y accesible desde el sitio sin CORS.
- Gestión de credenciales y secretos.
- Procedimientos documentados en `90-manual/`.

## Fuera de alcance

- El esquema del banco y su contenido. Eso es la épica 20.
- Cabeceras de seguridad, métricas y caché. Eso es la épica 50.
- Cualquier lógica en el Worker más allá de responder que está vivo. La iteración 12
  levanta la tubería; los datos vienen después.

## Iteraciones

| # | Iteración | Estado |
|---|---|---|
| 11 | Publicación en Pages | 🟢 Completada |
| 12 | Capa de datos y base D1 | ⚪ No iniciada |
| 13 | Entornos, secretos y procedimientos | ⚪ No iniciada |

## Reparto de tareas

Buena parte de esta épica se configura en el panel de Cloudflare, al que Claude Code
no tiene acceso. Su trabajo aquí es preparar los archivos de configuración que sí
viven en el repositorio, redactar los procedimientos paso a paso para que los
ejecute el autor, y verificar el resultado desde fuera una vez aplicados.
