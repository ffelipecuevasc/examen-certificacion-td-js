# Guía de Certificación — Bootcamp FullStack JavaScript

Recurso de estudio para las y los estudiantes del Bootcamp Desarrollador(a) FullStack JavaScript, pensado como apoyo para preparar el examen de certificación de **Talento Digital para Chile**.

## Objetivo

Este repositorio no reemplaza las clases ni el material oficial del programa: su función es ordenar en un solo lugar los siete módulos que evalúa el examen —del 2 al 8 del plan formativo— para que cada estudiante sepa con precisión qué debe repasar y cómo practicarlo antes de rendir la prueba.

## Cómo usarlo

1. **Revisa el mapa del examen** y el orden de los módulos evaluados.
2. **Abre cada módulo** para ver sus temas y el código de ejemplo.
3. **Responde el miniexamen**: 21 preguntas con alternativas y explicación inmediata.
4. **Sigue practicando** en los cuadernos de NotebookLM enlazados en la página.

## Estructura del proyecto

```
├── index.html              Markup del sitio (sin CSS ni JS embebido)
├── package.json            Scripts de compilación
├── tailwind.config.js      Paleta, tipografías y rutas de contenido
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

Para agregar o editar preguntas del miniexamen basta con modificar `static/js/data/quiz.js`.

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
