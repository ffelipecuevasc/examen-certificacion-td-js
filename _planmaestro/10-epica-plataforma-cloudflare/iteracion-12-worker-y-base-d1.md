# Iteración 12 · Worker de datos y base D1

**Épica:** 10 · Plataforma Cloudflare
**Estado:** ⚪ No iniciada
**Depende de:** iteración 11

## Objetivo

Levantar la tubería completa entre el navegador y la base de datos: una base D1
creada, un Worker que la consulta y una página del sitio que recibe la respuesta.
Todavía **sin el banco de preguntas real**.

## Contexto

Es deliberado que esta iteración no toque el contenido. Si se mezcla el montaje de
la infraestructura con el diseño del esquema de datos, cuando algo falle no se
sabrá si el problema está en la conexión o en el modelo. Aquí se prueba la tubería
con una tabla mínima de juguete; el esquema real es la épica 20.

## Decisión a cerrar

**Cómo se sirve el Worker respecto al sitio.** Si el Worker responde bajo el mismo
dominio que las páginas, no hay CORS que resolver ni dominio adicional que
mantener. Si responde en un dominio propio, la separación es más limpia pero
aparece la configuración de origen cruzado. Elige y documenta como ADR.

### Ya decidido antes de empezar · anotado en la iteración 11

**La capa de datos va como funciones del propio proyecto de Pages, no como un Worker
desplegado aparte.** Es la única forma de mantener el mismo origen sin dominio
propio, y evita CORS por completo. La decisión de arriba se cierra, entonces, sobre
*cómo* se organizan esas funciones, no sobre *si* van dentro del proyecto: eso ya
está resuelto y no se reabre.

Dos datos comprobados en la iteración 11 que condicionan el montaje:

- El directorio `functions/` va en la **raíz del repositorio**, no dentro de
  `dist/`. La documentación de Cloudflare es explícita: *«Make sure that the
  `/functions` directory is at the root of your Pages project (and not in the static
  root, such as `/dist`)»*. Pages lo compila aparte y no lo sirve como archivo
  estático.
- Si hiciera falta acotar qué rutas invocan a las funciones, el archivo `_routes.json`
  sí va en el directorio de salida, o sea dentro de `dist/`, lo que obliga a
  añadirlo a `LISTA_COPIA` en `scripts/build-dist.mjs`.

El despliegue ya ejecuta `npm run build` desde la iteración 11 (ADR-010), así que la
construcción que estas funciones necesitan está puesta.

## Tareas

- [ ] Crear la base D1 y dejar constancia de su identificador en la configuración
      del repositorio, no en un lugar suelto.
- [ ] Crear el Worker de datos con un extremo mínimo de comprobación de estado.
- [ ] Crear una tabla de prueba y un extremo que la consulte, para verificar que la
      conexión Worker–D1 funciona de verdad.
- [ ] Resolver cómo se sirve el Worker respecto al sitio y documentarlo como ADR.
- [ ] Verificar que las páginas pueden consumir el Worker sin errores de origen
      cruzado.
- [ ] Dejar funcionando el desarrollo local contra una base D1 local, para no
      depender de la nube al programar.
- [ ] Definir el formato de las respuestas de error del Worker, para que el sitio
      pueda distinguir «no hay datos» de «el servicio falló». Esta distinción es la
      que hará funcionar el respaldo de ADR-008.
- [ ] Documentar el procedimiento completo en `90-manual/`.

## Criterios de aceptación

- [ ] El extremo de comprobación de estado responde correctamente desde la
      dirección pública, y se muestra la respuesta.
- [ ] El extremo de prueba devuelve datos leídos realmente desde D1, no fijos en el
      código: se demuestra modificando un registro y viendo el cambio.
- [ ] Una página del sitio consume el Worker sin errores de consola ni de origen
      cruzado.
- [ ] El desarrollo local funciona contra una base D1 local, sin tocar producción.
- [ ] El formato de error está documentado y un fallo provocado produce una
      respuesta de esa forma.
- [ ] La decisión sobre el dominio del Worker está publicada como ADR.
- [ ] El procedimiento en `90-manual/` permite reconstruir base y Worker desde cero.
- [ ] Ningún identificador ni credencial queda escrito en el código versionado.

## Notas de la iteración

_Pendiente._
