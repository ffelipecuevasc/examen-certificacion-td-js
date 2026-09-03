# CLAUDE.md

Contexto permanente del proyecto. Claude Code lee este archivo al inicio de cada sesión. Debe mantenerse corto: si crece demasiado, deja de leerse con atención.

## Qué es este proyecto

Sitio web de estudio para el examen de certificación de **Talento Digital para Chile**, dirigido a estudiantes del bootcamp *Desarrollo de Aplicaciones Web
Fullstack JavaScript*. Autor y responsable: Felipe Cuevas (https://felipecuevas.dev).

Material de apoyo no oficial, elaborado a partir de la recopilación de fuentes oficiales, manuales oficiales y testimonios de alumnos que rindieron el examen 2026.

## Antes de tocar nada

1. Lee `_planmaestro/README.md` y ubica la **iteración activa**.
2. Lee el archivo de esa iteración y resume su alcance antes de escribir código.
3. Lee `_planmaestro/00_producto/decisiones.md`. Son decisiones cerradas: no se revierten sin una ADR nueva que las sustituya explícitamente.
4. Si algo que vas a hacer queda fuera del alcance de la iteración activa, **no lo implementes**: anótalo en `_planmaestro/00_producto/registro_log.md`, sección «Sin asignar».

## Stack (no cambiar sin ADR)

- HTML5 semántico, sin framework de componentes.
- **Tailwind CSS v3** compilado localmente. El CDN está prohibido.
- **JavaScript ES6+ nativo** con módulos ES (`<script type="module">`). Sin bundler, sin TypeScript, sin React.
- **Cloudflare Pages** para las páginas, **Workers** para la capa de datos y **D1** como base de datos del banco de preguntas.

El Worker sirve **solo lectura**. No renderiza páginas, no gestiona sesiones ni identifica estudiantes. Ampliar su rol requiere una ADR (ver ADR-007 y ADR-009).

## Arquitectura

```
index.html            Guía de estudio (mapa, módulos, consejos)
cuestionario.html     Práctica sin presión, banco completo
src/input.css         Fuente de Tailwind  ->  static/css/style.css
scripts/              Generadores (íconos, banco de preguntas)
static/css/           CSS compilado + icons.css generado
static/js/
  main.js             Entrada de index.html
  cuestionario-main.js Entrada de cuestionario.html
  components/         Un archivo por sección de la interfaz
  data/               Datos puros, sin lógica
  utils/dom.js        $, $$, esc, shuffle, icon, prefersReducedMotion
static/resources/     SVG fuente e imágenes
_planmaestro/         Planificación (ver su README)
```

La capa de datos se incorpora en la épica 10 y su ubicación exacta en el árbol se define ahí. Cuando exista, actualiza este bloque.

## Reglas de código

- **Escapar siempre.** Todo texto que provenga de `data/` y se inserte con `innerHTML` pasa por `esc()`. Omitirlo ya rompió la página una vez: un ejemplo que contenía `<div>` se interpretó como etiqueta real.
- **Íconos por clase, nunca por archivo.** Se usan `<span class="icon i-nombre">`. Las formas se generan como data URI en `static/css/icons.css`. Las máscaras CSS que apuntan a un `.svg` externo no cargan bajo `file://`.
- **Nada de almacenamiento del navegador sin que la iteración lo pida.**
- **El banco de preguntas es contenido de origen externo.** Se valida al escribir en D1 y se escapa al insertar en el DOM. Los dos lados, siempre.
- **Ninguna credencial ni identificador de base de datos en el código versionado.**
- **El sitio debe seguir siendo utilizable si la capa de datos no responde**, usando la instantánea versionada (ADR-008). Y debe **avisar** al estudiante cuando lo esté haciendo, nunca en silencio.
- **Sin dependencias nuevas** salvo que una ADR lo autorice.
- Comentarios y nombres de variables **en español**. Sin tildes en los nombres de archivos ni de identificadores.
- Los archivos generados no se editan a mano. Se edita su generador.

## Flujo de trabajo

- Tras cualquier cambio en `src/input.css`, en clases de Tailwind o en `static/resources/`, hay que recompilar. El CSS compilado **se versiona**.
- Las páginas usan módulos ES: se prueban con un servidor local, nunca abriendo el archivo con doble clic.
- **Claude Code no hace commits ni push.** El repositorio es público y el control de versiones lo lleva el autor.
- **Claude Code no toca producción.** El desarrollo ocurre contra el entorno de pruebas y una base D1 local. Lo que deba aplicarse en producción se documenta como procedimiento para que lo ejecute el autor.
- **Claude Code no tiene acceso al panel de Cloudflare.** Lo que se configure ahí se documenta en `_planmaestro/90-manual/`, o se pierde.

## Verificación antes de dar algo por terminado

No basta con decir «listo». Hay que recorrer los criterios de aceptación de la iteración uno por uno y mostrar la evidencia de cada uno: salida de comando, fragmento del archivo, resultado de la comprobación. Si un criterio no se cumple, se dice cuál y por qué.

Comprobaciones mínimas de cada entrega:

- El CSS compilado está al día respecto a las clases usadas.
- No hay clases `i-*` referenciadas que falten en `icons.css`.
- No hay imports rotos entre módulos ES.
- Las etiquetas HTML están balanceadas en las páginas tocadas.
- Ambas páginas cargan sin errores de consola servidas por HTTP.
- Si se tocó la capa de datos: el sitio sigue funcionando con el Worker caído, comprobado provocando la caída, no razonando sobre el código.

## Idioma

Todo en **español de Chile**: interfaz, documentación, comentarios y mensajes al usuario. Trato de «tú». Sin anglicismos innecesarios cuando existe término en español: «alternativa» y no «opción», «banco de preguntas» y no «pool».
