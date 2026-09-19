# Guía de Certificación — Bootcamp FullStack JavaScript

Recurso de estudio para las y los estudiantes del Bootcamp Desarrollador(a) FullStack JavaScript, pensado como apoyo para preparar el examen de certificación de **Talento Digital para Chile**.

## Objetivo

Este repositorio no reemplaza las clases ni el material oficial del programa: su función es ordenar en un solo lugar los siete módulos que evalúa el examen —del 2 al 8 del plan formativo— para que cada estudiante sepa con precisión qué debe repasar y cómo practicarlo antes de rendir la prueba.

## Cómo usarlo

1. **Revisa el mapa del examen** y el orden de los módulos evaluados.
2. **Abre cada módulo** para ver sus temas y el código de ejemplo.
3. **Practica en el cuestionario** (`cuestionario.html`): eliges un módulo en el índice y respondes sus preguntas a tu ritmo. Mientras el módulo se carga verás una transición que dura **lo que tarde de verdad**, y si la conexión está lenta te avisa que está tardando más de lo normal en vez de dejarte esperando en silencio. Cada respuesta se corrige al instante y **muestra su justificación**, se acierte o no, para que la practiques entendiendo el porqué y no memorizando posiciones —las alternativas se barajan en cada carga—.
4. **Vuelve sobre lo que fallaste** con «Repasar mis errores», que deja en pantalla solo las preguntas falladas **de ese módulo** para intentarlas de nuevo.
5. **Sigue practicando** en los cuadernos de NotebookLM enlazados en la página.

Tu avance se guarda **en tu propio navegador**, sin cuentas ni registro: no se comparte entre dispositivos y se pierde si borras los datos del sitio. Si el navegador no permite guardar, el cuestionario funciona igual y te lo dice.

> **El simulacro de examen todavía no se puede usar.** El archivo `simulacro.html` ya está en el repositorio, arma un intento de 120 preguntas y sus dos cronómetros ya cuentan, pero **todavía no se puede responder** —le faltan el recorrido de una pregunta a la vez y el resumen de resultados— y por eso **no está enlazado desde ninguna parte del sitio**. Los enlaces se agregan cuando esté completo. Hasta entonces, lo que hay para practicar es el cuestionario.

## Estructura del proyecto

```
├── index.html              Markup del sitio (sin CSS ni JS embebido)
├── package.json            Scripts de compilación
├── tailwind.config.cjs     Paleta, tipografías y rutas de contenido. `.cjs` porque el proyecto declara `"type": "module"` (H-020)
├── src/
│   └── input.css           Fuente de Tailwind (no se publica)
└── static/
    ├── css/style.css       CSS compilado que consume el navegador
    ├── js/
    │   ├── main.js         Punto de entrada
    │   ├── data/           Contenido de módulos y preguntas
    │   ├── components/     Lógica de cada sección
    │   └── utils/          Helpers compartidos
    └── resources/          Imágenes y otros recursos
```

Las preguntas del cuestionario **ya no viven en este repositorio**: están en una base D1 y se sirven desde `functions/api/`, con una instantánea versionada en `static/js/data/instantanea-banco.js` que el sitio usa si la capa de datos no responde. Se editan con la herramienta de línea de comandos descrita en `_planmaestro/90-manual/administrar-el-banco.md`, no tocando código.

> **El resto de este README quedó desfasado** en la épica 20 y está pendiente de rehacerse: el árbol de `static/` de aquí arriba y la sección de publicación describen el sitio anterior a la base D1. Anotado en `_planmaestro/00_producto/registro_log.md`, sin asignar.

## Desarrollo local

```bash
npm install     # instala Tailwind CSS v3
npm run dev     # recompila el CSS mientras editas
npm run serve   # levanta un servidor local
```

El sitio usa módulos ES, por lo que **debe abrirse mediante un servidor local**. Al abrir `index.html` con doble clic, el navegador bloquea las importaciones.

## Publicación en Cloudflare

El CSS compilado se versiona en el repositorio, así que el despliegue es directo:

```bash
npm run build   # genera static/css/style.css minificado
git add .
git commit -m "Actualiza la guía"
git push
```

La actualización de la rama `main` dispara la construcción en Cloudflare y el comando de construcción de Cloudflare Pages `npm run build` arma `dist/` que termina siendo la carpeta publicada.

> Recuerda ejecutar `npm run build` cada vez que cambies estilos o agregues clases de Tailwind, ya que el CSS publicado se genera en tu equipo.

## Para quién es

Estudiantes del Bootcamp Desarrollador(a) FullStack JavaScript que rendirán la certificación de Talento Digital para Chile, y cualquier persona que quiera repasar estos contenidos de forma autodirigida.

## Instructor

Material preparado por **Felipe Cuevas**, instructor del bootcamp.
[felipecuevas.dev](https://felipecuevas.dev)

---

Material de apoyo no oficial, elaborado a partir del testimonio de alumnos que ya rindieron el examen 2026.
