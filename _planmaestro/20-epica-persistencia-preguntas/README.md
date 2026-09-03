# Épica 20 · Persistencia de preguntas

**Estado:** ⚪ No iniciada
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
| 21 | Modelo de datos del banco | ⚪ No iniciada |
| 22 | Lectura, validación e instantánea | ⚪ No iniciada |
| 23 | Administración del contenido | ⚪ No iniciada |
| 24 | Migración y ampliación | ⚪ No iniciada |

## Lo que cambió respecto al plan anterior

La versión anterior de esta épica planteaba una hoja de cálculo de Google. ADR-007
la sustituye por D1. La ventaja que motivaba la hoja —editar sin tocar código— se
conserva, pero se traslada a la iteración 23: con una base de datos, esa comodidad
ya no viene incluida y hay que construirla deliberadamente. Es el principal costo
del cambio y conviene tenerlo presente.
