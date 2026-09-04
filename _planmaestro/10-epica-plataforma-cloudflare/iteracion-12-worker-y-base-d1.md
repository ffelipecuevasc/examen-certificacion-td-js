# Iteración 12 · Worker de datos y base D1

**Épica:** 10 · Plataforma Cloudflare
**Estado:** 🟢 Completada · **Cerrada:** 2026-09-03
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

- [x] El extremo de comprobación de estado responde correctamente desde la
      dirección pública, y se muestra la respuesta.
- [x] El extremo de prueba devuelve datos leídos realmente desde D1, no fijos en el
      código: se demuestra modificando un registro y viendo el cambio.
- [x] Una página del sitio consume el Worker sin errores de consola ni de origen
      cruzado.
- [x] El desarrollo local funciona contra una base D1 local, sin tocar producción.
- [x] El formato de error está documentado y un fallo provocado produce una
      respuesta de esa forma.
- [x] La decisión sobre el dominio del Worker está publicada como ADR.
- [ ] El procedimiento en `90-manual/` permite reconstruir base y Worker desde cero.
      · *Falta solo el ensayo completo. Los pasos 4, 5 y 6 se ejecutaron siguiendo el
      documento, y los pasos 1 y 2 quedaron escritos tal como ocurrieron —el 2 lo validó
      un error real, un nombre de base mal escrito—. Lo que no se ha hecho nunca es
      seguirlo de principio a fin sobre una base que todavía no existe. **Aplazado
      explícitamente a la iteración 21**, que crea la base del banco de preguntas y por
      lo tanto obliga a recorrerlo desde su paso 1. Anotado en `registro_log.md`.*
- [x] Ningún identificador ni credencial queda escrito en el código versionado. · *Su
      primera mitad la sustituyó ADR-012 durante esta iteración; ver la nota al final.*

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

### Verificación en la dirección pública · 2026-09-03 · hecha por el autor

El primer despliegue con `wrangler.toml` presente confirmó lo que faltaba.

**Registro de construcción.** Cloudflare encontró el archivo y leyó
`pages_build_output_dir: dist`. Después:

```
Found Functions directory at /functions. Uploading.
Compiled Worker successfully
```

La línea de la iteración 11 sobre la ausencia del directorio de funciones ya no
aparece. Las tres líneas del build salieron completas —3 entradas, 17 recursos,
capa de datos fuera de `dist/`— y la construcción corrió con `nodejs@22.16.0`, o
sea que declarar el archivo no desplazó la variable del panel.

**Extremos, sobre la dirección pública.**

```
/api/estado     → "enlace_d1": "presente"
/api/prueba     → ok: true, con las dos filas
/api/no-existe  → NO_ENCONTRADO en JSON, no la portada del sitio
```

**El dato viene de D1.** Tras un `UPDATE` remoto contra la tabla de juguete:

```json
{"ok":true,"datos":[{"clave":"saludo","valor":"Verificado por Felipe el 3 de septiembre",
"actualizado_en":"2026-09-03"}, … ],"meta":{"origen":"d1","vacio":false,"filas_leidas":2}}
```

**El sitio publicado.** `/cuestionario` con la consola sin errores, la línea del pie
con los dos registros de prueba, y en la pestaña Red la petición a `/api/estado`
saliendo hacia el mismo dominio: sin origen cruzado, como estaba previsto en
ADR-011.

### Qué salió distinto de lo planeado

**La decisión sobre dónde declarar el enlace se dio vuelta durante la iteración.**
La recomendación inicial fue configurarlo en el panel, para no tocar la regla de
credenciales de `CLAUDE.md`. El argumento que la revirtió salió del registro de
despliegue de la iteración 11: Cloudflare ya buscaba un archivo de configuración de
Wrangler y anotaba que no lo encontraba. No había nada que forzar. De ahí salió
ADR-012, y con ella la distinción entre credencial e identificador.

**El formato de error creció más de lo previsto, y valió la pena.** La tarea pedía
distinguir «no hay datos» de «el servicio falló». Al implementarlo aparecieron
cinco situaciones distintas, no dos, y dos de ellas no autorizan a usar el
respaldo: una dirección mal escrita y un método rechazado. Están todas provocadas
de verdad, no razonadas.

**El middleware hubo que corregirlo.** La primera versión detectaba las direcciones
inexistentes mirando el código 404. En local resultó que el servidor de archivos no
responde 404 a una dirección desconocida: devuelve la portada con un 200. Se pasó a
mirar el tipo de contenido. El error habría llegado a producción sin la prueba.

**El nombre de la base se escribe sin tilde y en español.** Al aplicar el esquema en
producción, `production` en vez de `produccion` costó un intento fallido. Quedó
anotado en el manual.

**La tabla local se puede perder.** Levantar dos servidores de desarrollo a la vez
sobre el mismo estado reinició la base local y la tabla desapareció. Es material
desechable y se rehace con `npm run datos:esquema`, pero conviene saberlo antes de
perder diez minutos diagnosticando.

### Deuda que esta iteración deja abierta

- **`prueba_tuberia` quedó creada en la base de producción.** Es una tabla de
  juguete viviendo en la base real. Hay que borrarla cuando el banco ocupe su
  lugar; anotado en el registro para la iteración 21, que es donde se escribe la
  primera migración del esquema real.
- **Las vistas previas leen la base de producción**, porque no existe un bloque
  `[env.preview]`. Inofensivo mientras la capa sea de solo lectura y el contenido
  sea de juguete. Iteración 13.
- **`/cuestionario.html` responde 308** hacia `/cuestionario`. Viene de la iteración
  11; los enlaces internos pagan un salto de más.
- **La orden de construcción no se puede declarar en `wrangler.toml`.** Es el único
  ajuste de la publicación que el repositorio no cubre.

### Convención de nombres en el límite · resuelta

`snake_case` de extremo a extremo, sin traducir al cruzar hacia el navegador.
Escrita en dos lugares para que la épica 20 no la reabra: el punto 3 de **ADR-011**
y la regla correspondiente en `CLAUDE.md`. Aplicada ya a `usar_respaldo`, que era el
único campo que discrepaba.

### Nota sobre el último criterio de aceptación

El criterio dice: «Ningún identificador ni credencial queda escrito en el código
versionado». Su primera mitad fue **sustituida por ADR-012** durante esta misma
iteración: el `database_id` de D1 se versiona a propósito en `wrangler.toml`.

La segunda mitad se cumple sin matices: no hay ninguna credencial en el
repositorio, y `.wrangler/` y `.dev.vars` quedaron ignorados por git.

El criterio se marca cumplido con esa salvedad escrita, por decisión del autor al
cerrar la iteración. Es el único de los ocho que no se cumple tal como estaba
redactado el día que se escribió.
