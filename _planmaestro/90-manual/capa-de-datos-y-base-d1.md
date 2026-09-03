# La capa de datos y la base D1

Procedimiento completo, desde una cuenta vacía hasta la capa de datos respondiendo
en el sitio publicado. Escrito para poder repetirse sin contexto previo: si la base
y el proyecto se borraran enteros, esto basta para reconstruirlos.

**Quién lo ejecuta:** el autor. Claude Code no tiene acceso al panel de Cloudflare y
no toca producción.

**De dónde salen las decisiones:** ADR-011 (la capa de datos son funciones del mismo
proyecto de Pages), ADR-012 (el enlace se declara en `wrangler.toml`) y ADR-013
(wrangler como dependencia de desarrollo).

**Antes que esto:** el sitio tiene que estar publicado. Ver
[Publicar el sitio en Cloudflare Pages](publicacion-en-cloudflare-pages.md).

---

## Cómo está repartida la configuración

Esto es lo primero que hay que entender, porque es lo que más confunde después:

| Qué | Dónde vive | Quién manda |
|---|---|---|
| Enlace con la base D1 | `wrangler.toml`, versionado | **El archivo** |
| Directorio publicado (`dist`) | `wrangler.toml`, versionado | **El archivo** |
| Orden de construcción (`npm run build`) | Panel de Cloudflare | **El panel** |
| `NODE_VERSION` | Panel de Cloudflare (y `.nvmrc`) | **El panel** |
| Identificador de la base | `wrangler.toml`, versionado | — |
| Tokens y credenciales | En ninguna parte del repositorio | — |

Desde que `wrangler.toml` existe, Cloudflare lo trata como la fuente de verdad para
los enlaces y las variables de ejecución: en el panel se siguen viendo, pero ya no
se pueden editar. **La orden de construcción es la excepción**: no se puede declarar
en el archivo, sigue siendo un ajuste del panel y no hay forma de fijarla desde el
repositorio. Si alguien la borra ahí, ningún archivo de este repositorio lo impide.

---

## Paso 1 · Crear la base D1

1. Panel de Cloudflare → **Storage & Databases** → **D1** → **Create database**.
2. Nombre: `examen-td-js-produccion`. Región: **Western North America**.
3. Al terminar, la pantalla de la base muestra su **Database ID**. Cópialo.

El nombre importa: aparece tal cual en `wrangler.toml` y en los comandos. La región
se elige una vez y no se cambia después.

---

## Paso 2 · Declarar el enlace en el repositorio

Abre `wrangler.toml`, en la raíz, y comprueba que dice esto:

```toml
name = "examen-certificacion-td-js"
compatibility_date = "2026-09-03"
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "BANCO"
database_name = "examen-td-js-produccion"
database_id = "el identificador que copiaste en el paso 1"
```

Tres cosas tienen que calzar exactamente, o el despliegue se conecta a otra parte:

- `name` con el nombre del proyecto de Pages.
- `database_name` y `database_id` con la base del paso 1.
- `binding` con el nombre que usa el código (`BANCO`). Cambiarlo obliga a cambiar
  también `functions/api/_comun.js`.

**El identificador se versiona a propósito.** No es una credencial: dice cuál base,
no quién puede abrirla. La decisión y su límite están en ADR-012. Un token de API,
en cambio, no se escribe acá **nunca**.

---

## Paso 3 · Trabajar en local, contra una base local

Nada de esto toca la nube.

```bash
npm install
npm run datos:esquema     # crea la tabla de juguete en la base LOCAL
npm run datos:dev         # construye el sitio y lo sirve con sus funciones
```

Al arrancar, el registro tiene que mostrar el enlace en modo local:

```
env.BANCO (examen-td-js-produccion)   D1 Database   local
```

Esa palabra, `local`, es la señal de que estás trabajando contra tu propia copia y
no contra la base de la nube. Si dijera otra cosa, detente y revisa.

Con el servidor arriba, en `http://127.0.0.1:8788`:

```bash
curl http://127.0.0.1:8788/api/estado
curl http://127.0.0.1:8788/api/prueba
```

Para comprobar que el dato viene de verdad de la base y no del código, cámbialo y
vuelve a consultar:

```bash
npx wrangler d1 execute examen-td-js-produccion --local \
  --command "UPDATE prueba_tuberia SET valor='probando' WHERE clave='saludo';"
```

---

## Paso 4 · Crear la tabla en la base de la nube

Este es el único paso de todo el procedimiento que escribe en producción. Hazlo una
sola vez, y léelo antes de ejecutarlo: **`d1/juguete.sql` empieza con un
`DROP TABLE`.** Sobre la tabla de juguete es inofensivo; el día que ese archivo
contenga el banco de preguntas, no lo será.

```bash
npx wrangler login          # abre el navegador, una sola vez por equipo
npx wrangler d1 execute examen-td-js-produccion --remote --file=d1/juguete.sql
```

La diferencia entre `--local` y `--remote` es la diferencia entre tu equipo y la
base real. No hay ningún atajo de npm para la versión `--remote`, y es a propósito:
el comando largo obliga a leer lo que se está haciendo.

---

## Paso 5 · Publicar

```bash
npm run verificar   # reconstruye y avisa si el CSS quedó desfasado
git push
```

El push dispara la construcción. En el registro del despliegue, en el panel, tienen
que aparecer las tres líneas del build:

```
3 entradas copiadas a dist/
17 recursos enlazados, ninguno roto
capa de datos fuera de dist/, como corresponde
```

Y una diferencia respecto de todos los despliegues anteriores a esta iteración:
**donde antes decía que no encontró un directorio de funciones, ahora tiene que
aparecer la compilación de `functions/`.** Si esa línea sigue diciendo que no hay
funciones, el despliegue publicó el sitio sin capa de datos.

---

## Paso 6 · Verificar lo publicado

Sobre `https://examen-certificacion-td-js.pages.dev`:

- [ ] `/api/estado` responde **200** con `"ok": true` y `"enlace_d1": "presente"`.
- [ ] `/api/prueba` responde **200** con las dos filas de la tabla de juguete.
- [ ] Cambia un valor con el comando del paso 4 (con `--remote`) y vuelve a pedir
      `/api/prueba`: tiene que aparecer el valor nuevo. Eso demuestra que el dato
      viene de la base y no del código.
- [ ] `/cuestionario` carga, la consola del navegador no muestra ningún error, y en
      el pie aparece la línea «Banco de preguntas: conectado (2 registros de
      prueba).»
- [ ] En la pestaña **Red**, las peticiones a `/api/` salen hacia el mismo dominio
      del sitio. Si aparece otro dominio, algo se configuró mal: no debería haber
      ninguno.
- [ ] `/api/no-existe` responde **404** en JSON, no la portada del sitio.

---

## Cómo se leen las respuestas

Toda respuesta tiene la misma forma. Correcta:

```json
{ "ok": true, "datos": [ ... ], "meta": { "origen": "d1", "vacio": false } }
```

Fallida:

```json
{ "ok": false, "error": { "codigo": "...", "mensaje": "...", "usar_respaldo": true } }
```

| Código | HTTP | Qué pasó | Qué hacer |
|---|---|---|---|
| `SIN_ENLACE` | 503 | Las funciones corren, pero no hay base enlazada | Revisar `wrangler.toml` y volver a desplegar |
| `FALLO_CONSULTA` | 503 | Hay enlace, la base no contestó la consulta | Revisar que la tabla exista (paso 4) |
| `SIN_RESPUESTA` | — | No se llegó al servicio. Lo pone el navegador | Revisar que el despliegue incluyera `functions/` |
| `NO_ENCONTRADO` | 404 | La dirección no existe | Revisar cómo está escrita |
| `METODO_NO_PERMITIDO` | 405 | Se intentó algo que no era lectura | Es lo correcto: la capa es de solo lectura (ADR-009) |

**Una lista vacía no es un error.** Si la consulta no encuentra filas, la respuesta
es `ok: true` con `datos: []` y `meta.vacio: true`. Solo un `ok: false` con
`usar_respaldo: true` autoriza al sitio a mostrar la instantánea de respaldo. La
distinción es deliberada: si se confundieran, un banco borrado por accidente
quedaría tapado por el respaldo y nadie se enteraría.

---

## Si algo sale mal

**`Couldn't find DB` o algo parecido al ejecutar un comando de D1.** El nombre de
la base se escribe en español y sin tilde: `examen-td-js-produccion`, no
`production`. Es un tropiezo real, ocurrió al aplicar el esquema por primera vez.

**El sitio se publicó vacío, pero `/api/` responde.** Discrepan el directorio
declarado en `wrangler.toml` y el que arma `scripts/build-dist.mjs`. Cloudflare
publica lo que diga el archivo. `npm run build` detecta el caso y se detiene antes,
así que si llegó a publicarse, el push se hizo sin construir en local.

**El despliegue publica pero la capa de datos no responde.** Mira el registro del
despliegue: si no aparece la compilación de `functions/`, es que la carpeta no
estaba en la raíz del repositorio. Dentro de `dist/` no sirve.

**`/api/estado` responde `SIN_ENLACE`.** El despliegue no vio el enlace. Comprueba
que `wrangler.toml` esté en la raíz, versionado, y que el `database_id` sea el de la
base que existe hoy. Una base borrada y vuelta a crear tiene un identificador nuevo.

**La tabla local desapareció.** Pasa si corren dos servidores de desarrollo a la vez
sobre el mismo estado local. Se arregla con `npm run datos:esquema`; la base local
es material desechable y nunca contiene nada que no se pueda rehacer.

**El sitio funciona pero el pie dice «sin conexión».** Es el comportamiento
esperado cuando el sitio se sirve sin las funciones, por ejemplo con
`npm run serve:dist`. El sitio tiene que seguir siendo usable así, y decirlo.

---

## Reconstruir todo desde cero

En orden, sin saltarse ninguno: paso 1 (crear la base), paso 2 (pegar el
identificador y hacer commit), paso 4 (crear la tabla en la nube), paso 5
(publicar), paso 6 (verificar). El paso 3 es opcional, pero conviene: si algo va a
fallar, es más barato descubrirlo en tu equipo.

---

## Lo que este procedimiento todavía no cubre

- **Entornos separados.** Hoy hay una sola base, y los despliegues de vista previa
  la comparten con producción. Es la iteración 13.
- **Respaldos y restauración.** También la iteración 13.
- **El banco real de preguntas.** La tabla de este documento es de juguete. El
  esquema es la iteración 21 y la carga la 24.
- **Caché, métricas y límites de uso.** Es la épica 50.
