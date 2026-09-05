# Épica 20 · Persistencia de preguntas

**Estado:** 🔵 En curso
**Depende de:** épica 10

## Problema

Las 105 preguntas viven dentro de `static/js/data/cuestionario.js`, generado desde
markdown. Ampliar el banco a 300 por esa vía significa editar markdown, correr un
script y publicar el repositorio. Cada corrección de una tilde exige un ciclo
completo de desarrollador, y el autor no siempre está frente al repositorio cuando
detecta un error.

## Resultado esperado

El banco de preguntas vive en **Cloudflare D1** y el sitio lo consume a través del
Worker de datos. Corregir o agregar preguntas no requiere publicar el repositorio.
Si la capa de datos no responde, el estudiante igual puede estudiar con la
instantánea versionada.

## Alcance

- Modelo de datos del banco en D1.
- Extremos de lectura en el Worker, con validación.
- Instantánea local de respaldo y su generación (ADR-008).
- Herramienta de administración del contenido, sin escritura pública (ADR-009).
- Migración de las 105 preguntas actuales y ampliación hasta ~300.
- Justificación escrita para cada pregunta.

## Fuera de alcance

- Cambios visuales en `cuestionario.html`. Eso es la épica 30.
- El simulacro. Eso es la épica 40.
- Montar la infraestructura. Eso quedó cerrado en la épica 10.

## Iteraciones

| # | Iteración | Estado |
|---|---|---|
| 21 | Modelo de datos del banco | 🔵 Criterios cumplidos, cierre formal pendiente |
| 22 | Lectura, validación e instantánea | ⚪ No iniciada |
| 23 | Administración del contenido | ⚪ No iniciada |
| 24 | Migración y ampliación | ⚪ No iniciada |

## Lo que cambió respecto al plan anterior

La versión anterior de esta épica planteaba una hoja de cálculo de Google. ADR-007
la sustituye por D1. La ventaja que motivaba la hoja —editar sin tocar código— se
conserva, pero se traslada a la iteración 23: con una base de datos, esa comodidad
ya no viene incluida y hay que construirla deliberadamente. Es el principal costo
del cambio y conviene tenerlo presente.

## Estado de la épica, al 2026-09-05

La **iteración 21** tiene sus siete criterios de aceptación cumplidos con evidencia,
la última de ella producida por el ensayo remoto contra la base de pruebas del
2026-09-05, que cerró los tres veredictos de `verificar-banco`. El cierre formal lo
hace el autor.

Lo que la iteración 21 deja hecho y que las siguientes dan por sentado:

- El esquema del banco existe, versionado en `d1/migraciones/001-banco-de-preguntas.sql`
  y documentado campo por campo en `90-manual/esquema-del-banco.md`.
- Los dos orígenes caben en él sin pérdida: la columna `origen` distingue `json_2026`
  de `js_2026`, y la correcta se identifica igual viniendo de una letra o de un
  índice (ADR-019).
- La vista `pregunta_activa` es lo único que leerá `functions/api/`. El filtro por
  estado vive ahí, así que ninguna consulta puede olvidarlo. **La iteración 22 lee de
  la vista, no de las tablas.**
- Hay un guardián con tres veredictos, `verificar-banco`, probado en local y en la
  nube.

Lo que **no** deja hecho, y que hay que tener presente al planificar:

- **El esquema no está aplicado en producción**, y `prueba_tuberia` sigue ahí. Va en
  la iteración 24, y la migración 001 **no** borra esa tabla: hace falta un `DROP`
  escrito a mano.
- **El banco real no está cargado.** Hay diez filas de ejemplo. Las 368 preguntas se
  cargan en la iteración 24, así que la iteración 22 trabajará contra un banco de
  juguete.
- **Ninguna pregunta tiene justificación escrita.** La columna existe y admite nulo a
  propósito.
