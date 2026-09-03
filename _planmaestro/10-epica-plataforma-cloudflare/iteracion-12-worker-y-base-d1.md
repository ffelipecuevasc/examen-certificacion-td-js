# Iteración 12 · Worker de datos y base D1

**Épica:** 10 · Plataforma Cloudflare
**Estado:** 🔵 En curso · implementación terminada, falta la verificación en la dirección pública
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

- [x] Crear la base D1 y dejar constancia de su identificador en la configuración
      del repositorio, no en un lugar suelto.
- [x] Crear el Worker de datos con un extremo mínimo de comprobación de estado.
- [x] Crear una tabla de prueba y un extremo que la consulte, para verificar que la
      conexión Worker–D1 funciona de verdad.
- [x] Resolver cómo se sirve el Worker respecto al sitio y documentarlo como ADR.
- [x] Verificar que las páginas pueden consumir el Worker sin errores de origen
      cruzado.
- [x] Dejar funcionando el desarrollo local contra una base D1 local, para no
      depender de la nube al programar.
- [x] Definir el formato de las respuestas de error del Worker, para que el sitio
      pueda distinguir «no hay datos» de «el servicio falló». Esta distinción es la
      que hará funcionar el respaldo de ADR-008.
- [x] Documentar el procedimiento completo en `90-manual/`.

## Criterios de aceptación

- [ ] El extremo de comprobación de estado responde correctamente desde la
      dirección pública, y se muestra la respuesta.
- [x] El extremo de prueba devuelve datos leídos realmente desde D1, no fijos en el
      código: se demuestra modificando un registro y viendo el cambio.
- [ ] Una página del sitio consume el Worker sin errores de consola ni de origen
      cruzado. · *Verificado en local por el autor; falta en la dirección pública.*
- [x] El desarrollo local funciona contra una base D1 local, sin tocar producción.
- [x] El formato de error está documentado y un fallo provocado produce una
      respuesta de esa forma.
- [x] La decisión sobre el dominio del Worker está publicada como ADR.
- [x] El procedimiento en `90-manual/` permite reconstruir base y Worker desde cero.
- [ ] Ningún identificador ni credencial queda escrito en el código versionado. · *Su
      primera mitad la sustituyó ADR-012; ver la nota al final.*

## Notas de la iteración

### Fuera de alcance

- La transformación y carga del banco real de preguntas. Los cuestionarios de los
  siete módulos se están transformando en paralelo a un formato estructurado, pero
  ese resultado pertenece a la épica 20: el esquema se diseña en la iteración 21 y
  la carga ocurre en la 24. Aquí la tubería se prueba con una tabla de juguete.

## Resultados de la verificación · 2026-09-03

Todo lo de abajo se comprobó contra `wrangler pages dev` con una base D1 **local**.
No se tocó producción ni el panel. Lo que exige la dirección pública queda
pendiente y está listado al final.

### Decisiones cerradas durante la iteración

- **ADR-011** · La capa de datos son funciones del proyecto de Pages, en el mismo
  origen. Cierra la decisión que la iteración pedía resolver, y además fija el
  formato de respuesta, la regla de que «no hay datos» no es un error, y la
  convención de nombres en el límite.
- **ADR-012** · El enlace con D1 se declara en `wrangler.toml` versionado. Modifica
  la regla de credenciales de `CLAUDE.md`, distinguiendo credencial de
  identificador.
- **ADR-013** · Wrangler como dependencia de desarrollo. Primera dependencia nueva
  desde que se fijó el stack.

### Lo que se construyó

| Archivo | Qué es |
|---|---|
| `wrangler.toml` | Enlace `BANCO` → `examen-td-js-produccion`, y `pages_build_output_dir` |
| `functions/api/_comun.js` | Formato de respuesta, códigos de error, envoltura de solo lectura |
| `functions/api/estado.js` | `GET /api/estado` |
| `functions/api/prueba.js` | `GET /api/prueba` |
| `functions/api/_middleware.js` | Todo lo que sale de `/api/` es JSON, incluso las direcciones que no existen |
| `d1/juguete.sql` | Tabla de juguete |
| `static/js/servicios/datos.js` | Único punto del navegador que habla con `/api/` |
| `static/js/components/estado-datos.js` | Indicador en el pie del cuestionario |
| `scripts/build-dist.mjs` | Dos comprobaciones nuevas: la capa de datos fuera de `dist/`, y el directorio declarado en `wrangler.toml` igual al que arma el script |

### Evidencia

**Los cinco códigos de error, provocados de verdad:**

```
sin bloque [[d1_databases]]   → 503 SIN_ENLACE            usar_respaldo: true
DROP TABLE prueba_tuberia     → 503 FALLO_CONSULTA        usar_respaldo: true
servidor apagado              →     SIN_RESPUESTA         usar_respaldo: true
GET /api/no-existe            → 404 NO_ENCONTRADO         usar_respaldo: false
POST /api/prueba              → 405 METODO_NO_PERMITIDO   usar_respaldo: false
DELETE FROM prueba_tuberia    → 200 ok:true, datos:[], meta.vacio:true
```

La última línea es la que importa para ADR-008: una tabla vacía responde correcto,
no falla, y por lo tanto no autoriza a cambiar a la instantánea de respaldo.

**El dato viene de D1, no del código.** Mismo extremo, antes y después de un
`UPDATE` contra la base local:

```
antes:   ['La tuberia hasta D1 funciona.', 'Cambia este valor para comprobar…']
después: ['Valor cambiado a mano el 2026-09-03 a las 12:55', 'Cambia este valor…']
```

**Desarrollo local contra base local.** El registro de arranque lo dice:

```
env.BANCO (examen-td-js-produccion)   D1 Database   local
```

**El navegador consume la capa sin errores** (comprobado por el autor sobre
`http://127.0.0.1:8788/cuestionario`): consola limpia, la línea del pie con los dos
registros de prueba, y `/api/estado` y `/api/prueba` respondiendo 200 en la pestaña
Red.

**La capa de datos no llega a `dist/`:**

```
3 entradas copiadas a dist/
17 recursos enlazados, ninguno roto
capa de datos fuera de dist/, como corresponde
$ ls -a dist  →  cuestionario.html  index.html  static
```

**El directorio publicado lo decide `wrangler.toml`.** Comprobado poniendo un
directorio equivocado en el archivo y levantando el servidor sin argumentos:

```
GET /cuestionario  -> 404      (el sitio desaparece)
GET /api/estado    -> 200      (las funciones siguen vivas)
```

El síntoma engaña, y por eso `npm run build` ahora compara ambos valores y se
detiene:

```
ERROR: wrangler.toml publica "publico" y este script arma "dist".
Cloudflare publica lo que diga wrangler.toml, asi que el sitio saldria vacio.
```

### Hallazgos anotados en el registro, no resueltos acá

- Cloudflare responde **308** a `/cuestionario.html` y redirige a `/cuestionario`.
  Viene de la iteración 11, no de esta.
- La **orden de construcción** no se puede declarar en `wrangler.toml`. Es el único
  ajuste de la publicación que el repositorio no cubre.
- Los despliegues de vista previa heredan la base de producción mientras no exista
  `[env.preview]`. Es la iteración 13.

### Qué falta para poder cerrar la iteración

La iteración **queda abierta**. Falta el primer despliegue con `wrangler.toml`
presente, que solo puede hacer el autor, y estas comprobaciones sobre él:

1. En el registro de construcción, la compilación de `functions/`. En la iteración
   11 ese registro decía que no encontró directorio de funciones; esa línea tiene
   que haber desaparecido.
2. `https://examen-certificacion-td-js.pages.dev/api/estado` responde 200 con
   `"enlace_d1": "presente"`.
3. `/api/prueba` devuelve las filas de la tabla de juguete, después de haberla
   creado en la base de la nube con el paso 4 del manual.
4. Un `UPDATE` con `--remote` cambia lo que devuelve `/api/prueba`.
5. `/cuestionario` en la dirección pública, con la consola limpia y la línea del pie.
6. El sitio y las funciones responden desde el mismo dominio, sin origen cruzado.

El procedimiento completo está en
`_planmaestro/90-manual/capa-de-datos-y-base-d1.md`.

### Nota sobre el último criterio de aceptación

El criterio dice: «Ningún identificador ni credencial queda escrito en el código
versionado». Su primera mitad fue **sustituida por ADR-012** durante esta misma
iteración: el `database_id` de D1 se versiona a propósito en `wrangler.toml`.

La segunda mitad se cumple sin matices: no hay ninguna credencial en el
repositorio, y `.wrangler/` y `.dev.vars` quedaron ignorados por git.

Se deja el criterio sin marcar: replantearlo es decisión del autor, no de quien
ejecutó la iteración.
