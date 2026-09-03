# La capa de datos y las bases D1

Procedimiento completo, desde una cuenta vacía hasta la capa de datos respondiendo
en el sitio publicado. Escrito para poder repetirse sin contexto previo: si las
bases y el proyecto se borraran enteros, esto basta para reconstruirlos.

**Quién lo ejecuta:** el autor. Claude Code no tiene acceso al panel de Cloudflare y
no ejecuta comandos contra la cuenta (ADR-015): escribe los comandos, los ejecuta el
autor.

**De dónde salen las decisiones:** ADR-011 (la capa de datos son funciones del mismo
proyecto de Pages), ADR-012 (los enlaces se declaran en `wrangler.toml`), ADR-013
(wrangler como dependencia de desarrollo) y ADR-015 (quién ejecuta qué).

**Antes que esto:** el sitio tiene que estar publicado. Ver
[Publicar el sitio en Cloudflare Pages](publicacion-en-cloudflare-pages.md).
**Después de esto:** [Respaldo y restauración de la base](respaldo-y-restauracion.md).

---

## Las dos bases

| Base | Para qué | Quién la lee |
|---|---|---|
| `examen-td-js-produccion` | El sitio en vivo | La dirección pública |
| `examen-td-js-pruebas` | Ensayar sin consecuencias | Los despliegues de vista previa, o sea cualquier rama que no sea `main` |

Las dos están en **Western North America**. Ninguna de las dos se toca desde el
desarrollo local: en local se usa una tercera base, una copia en tu propio equipo
que wrangler crea sola y que se puede borrar sin consecuencias.

**Regla que evita el error caro:** cada comando nombra su base. En la línea de
comandos no existe un «entorno activo» implícito; si el nombre no está escrito, no
sabes contra qué estás trabajando.

---

## Cómo está repartida la configuración

Esto es lo primero que hay que entender, porque es lo que más confunde después:

| Qué | Dónde vive | Quién manda |
|---|---|---|
| Enlaces con las bases D1 | `wrangler.toml`, versionado | **El archivo** |
| Variable `ENTORNO` | `wrangler.toml`, versionado | **El archivo** |
| Directorio publicado (`dist`) | `wrangler.toml`, versionado | **El archivo** |
| Orden de construcción (`npm run build`) | Panel de Cloudflare | **El panel** |
| `NODE_VERSION` | Panel de Cloudflare (y `.nvmrc`) | **El panel** |
| Identificadores de las bases | `wrangler.toml`, versionado | — |
| Tokens y credenciales | En ninguna parte del repositorio | — |

Desde que `wrangler.toml` existe, Cloudflare lo trata como la fuente de verdad para
los enlaces y las variables de ejecución: en el panel se siguen viendo, pero ya no
se pueden editar. **La orden de construcción es la excepción**: no se puede declarar
en el archivo, sigue siendo un ajuste del panel y no hay forma de fijarla desde el
repositorio. Si alguien la borra ahí, ningún archivo de este repositorio lo impide.

---

## Paso 1 · Crear las bases

**La ruta oficial es la línea de comandos.** Es la que se puede copiar, pegar y
repetir idéntica para las dos bases, y la que deja constancia de qué se ejecutó. El
panel sirve para *mirar* lo que existe; para *crear*, se usa la herramienta.

```powershell
npx wrangler d1 create examen-td-js-produccion --location wnam
npx wrangler d1 create examen-td-js-pruebas --location wnam
```

`--location wnam` es Western North America. La región se elige al crear y **no se
cambia después**.

Cada comando imprime el **`database_id`** de la base recién creada, junto con un
bloque listo para pegar en `wrangler.toml`. Guarda los dos identificadores: son lo
que hace falta en el paso 2.

**Si prefieres el panel:** Cloudflare → **Storage & Databases** → **D1** → **Create
database**, con el nombre exacto y la región **Western North America**; el
identificador aparece en la pantalla de la base ya creada. Es equivalente, pero deja
menos rastro: no queda registro de qué se hizo ni cuándo. Úsalo si quieres ver la
interfaz, o si la herramienta no está disponible.

**El nombre se escribe en español y sin tilde:** `examen-td-js-produccion`, no
`production`. Es un tropiezo real, ocurrió la primera vez.

---

## Paso 2 · Declarar los enlaces en el repositorio

Abre `wrangler.toml`, en la raíz. Tiene que decir esto, con los identificadores del
paso 1:

```toml
name = "examen-certificacion-td-js"
compatibility_date = "2026-09-03"
pages_build_output_dir = "dist"

# Produccion y desarrollo local
[[d1_databases]]
binding = "BANCO"
database_name = "examen-td-js-produccion"
database_id = "el identificador de produccion"

[vars]
ENTORNO = "produccion"

# Solo despliegues de vista previa
[[env.preview.d1_databases]]
binding = "BANCO"
database_name = "examen-td-js-pruebas"
database_id = "el identificador de pruebas"

[env.preview.vars]
ENTORNO = "pruebas"
```

Cuatro cosas tienen que calzar exactamente, o el despliegue se conecta a otra parte:

- `name` con el nombre del proyecto de Pages.
- `database_name` y `database_id` con las bases del paso 1, cada una en su bloque.
- `binding` con el nombre que usa el código (`BANCO`). Es **el mismo en los dos
  entornos a propósito**: el código de `functions/` no sabe contra qué base corre, y
  no tiene por qué saberlo. Lo que cambia es a qué base apunta ese nombre.
- `ENTORNO` distinto en cada bloque. Es lo que permite que `/api/estado` diga dónde
  está.

**Cuidado con lo que no se hereda.** Los enlaces y las variables **no** se heredan
entre entornos: en cuanto un entorno declara uno, tiene que declararlos todos. Si
mañana se agrega una base nueva o un almacén, hay que agregarlo en los dos bloques,
o el entorno que no lo declare se queda sin él, y eso falla en tiempo de ejecución,
no al construir.

**Los identificadores se versionan a propósito.** No son credenciales: dicen cuál
base, no quién puede abrirla. La decisión y su límite están en ADR-012. Un token de
API, en cambio, no se escribe acá **nunca**.

---

## Paso 3 · Trabajar en local

Nada de esto toca la nube.

```powershell
npm install
npm run datos:esquema     # crea la tabla de juguete en la base LOCAL
npm run datos:dev         # construye el sitio y lo sirve con sus funciones
```

Al arrancar, el registro tiene que mostrar el enlace en modo local:

```
env.BANCO (examen-td-js-produccion)   D1 Database   local
```

Esa palabra, `local`, es la señal. El nombre que aparece al lado es el de
producción porque el desarrollo local usa la configuración de arriba del archivo,
pero **los datos son locales**: sin `--remote` no se toca la nube.

Con el servidor arriba, en `http://127.0.0.1:8788`:

```powershell
curl http://127.0.0.1:8788/api/estado
curl http://127.0.0.1:8788/api/prueba
```

`/api/estado` responde `"entorno": "local"`. Para comprobar que el dato viene de
verdad de la base y no del código, cámbialo y vuelve a consultar:

```powershell
npx wrangler d1 execute examen-td-js-produccion --local --command "UPDATE prueba_tuberia SET valor='probando' WHERE clave='saludo';"
```

---

## Paso 4 · Crear la tabla en las bases de la nube

Estos son los únicos comandos del procedimiento que escriben en la nube. Léelos
antes de ejecutarlos: **`d1/juguete.sql` empieza con un `DROP TABLE`.** Sobre la
tabla de juguete es inofensivo; el día que ese archivo contenga el banco de
preguntas, no lo será.

```powershell
npx wrangler login          # abre el navegador, una sola vez por equipo
npx wrangler d1 execute examen-td-js-produccion --remote --file=d1/juguete.sql
npx wrangler d1 execute examen-td-js-pruebas --remote --file=d1/juguete.sql
```

La diferencia entre `--local` y `--remote` es la diferencia entre tu equipo y la
nube. No hay ningún atajo de npm para la versión `--remote`, y es a propósito: el
comando largo obliga a leer lo que se está haciendo.

---

## Paso 5 · Publicar

```powershell
npm run verificar   # reconstruye y avisa si el CSS quedó desfasado
git push
```

El push a `main` publica producción. Un push a **cualquier otra rama** produce un
despliegue de vista previa, que lee la base de pruebas.

**Las direcciones de vista previa son públicas.** Cloudflare le da a cada
despliegue una dirección del tipo `<identificador>.examen-certificacion-td-js.pages.dev`,
y cualquiera que la tenga puede abrirla, sin contraseña. No expone nada nuevo —el
repositorio ya es público y la base de pruebas solo contiene material de juguete—,
pero conviene tenerlo dicho: lo que se suba a una rama queda visible para quien
conozca la dirección. Restringirlas es materia de la épica 50.

En el registro del despliegue, en el panel, tienen que aparecer las tres líneas del
build:

```
3 entradas copiadas a dist/
17 recursos enlazados, ninguno roto
capa de datos fuera de dist/, como corresponde
```

Y la señal de que la capa de datos viajó: **`Found Functions directory at
/functions. Uploading.`** seguido de **`Compiled Worker successfully`**. Si en su
lugar aparece que no encontró directorio de funciones, el sitio se publicó sin capa
de datos.

---

## Paso 6 · Verificar lo publicado

Sobre `https://examen-certificacion-td-js.pages.dev`:

- [x] `/api/estado` responde **200** con `"ok": true` y `"enlace_d1": "presente"`.
- [x] `/api/prueba` responde **200** con las dos filas de la tabla de juguete.
- [x] Cambia un valor con el comando del paso 4 (con `--remote`) y vuelve a pedir
      `/api/prueba`: tiene que aparecer el valor nuevo. Eso demuestra que el dato
      viene de la base y no del código.
- [x] `/cuestionario` carga, la consola del navegador no muestra ningún error, y en
      el pie aparece la línea «Banco de preguntas: conectado (2 registros de
      prueba).»
- [x] En la pestaña **Red**, las peticiones a `/api/` salen hacia el mismo dominio
      del sitio. Si aparece otro dominio, algo se configuró mal: no debería haber
      ninguno.
- [x] `/api/no-existe` responde **404** en JSON, no la portada del sitio.
- [ ] `/api/estado` responde `"entorno": "produccion"`.

Sobre la dirección de una vista previa, la que Cloudflare da al desplegar una rama:

- [x] `/api/prueba` devuelve los datos de la base de pruebas, no los de producción.
      La forma más rápida de distinguirlas es tener un valor distinto en cada una.
- [ ] `/api/estado` responde `"entorno": "pruebas"`.
- [ ] En el pie del cuestionario aparece «· Entorno: pruebas.»

Las tres casillas sin marcar dependen de la variable `ENTORNO`, que se añadió
después de la última verificación: se comprueban en el próximo despliegue.

---

## Contra qué entorno estás trabajando

El error caro de esta configuración no es equivocarse de comando: es acertar el
comando contra la base equivocada. Hay una señal en cada lugar donde se trabaja, y
ninguna obliga a abrir el panel de Cloudflare.

**En el navegador.** `/api/estado` responde el campo `entorno`: `produccion`,
`pruebas` o `local`. Y el pie del cuestionario muestra el entorno **cuando no es
producción**, así que una vista previa se delata sola, sin que nadie tenga que
acordarse de mirar.

**En la terminal.** No existe un entorno activo: cada comando nombra su base, y sin
`--remote` toca tu copia local y nada más. Si el nombre de la base no está escrito
en el comando, no sabes contra qué estás trabajando. Al levantar el servidor local,
la tabla de enlaces dice `local` en la columna de modo.

**En el registro de despliegue.** Cada despliegue dice de qué rama sale. `main` es
producción; cualquier otra rama es una vista previa y lee la base de pruebas. Si un
despliegue de rama dijera `"entorno": "produccion"` al consultarlo, el bloque
`[env.preview]` no se aplicó.

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

**`Couldn't find DB` o algo parecido al ejecutar un comando de D1.** El nombre de la
base se escribe en español y sin tilde: `examen-td-js-produccion`, no `production`.
Es un tropiezo real, ocurrió al aplicar el esquema por primera vez.

**Una vista previa muestra datos de producción.** Falta el bloque
`[[env.preview.d1_databases]]` en `wrangler.toml`, o el push se hizo desde una rama
cuyo `wrangler.toml` todavía no lo tenía. Compruébalo con `/api/estado`: si responde
`"entorno": "produccion"` en una dirección de vista previa, es eso.

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

**El sitio funciona pero el pie dice «sin conexión».** Es el comportamiento esperado
cuando el sitio se sirve sin las funciones, por ejemplo con `npm run serve:dist`. El
sitio tiene que seguir siendo usable así, y decirlo.

---

## Reconstruir todo desde cero

En orden, sin saltarse ninguno: paso 1 (crear las dos bases), paso 2 (pegar los
identificadores y hacer commit), paso 4 (crear las tablas en la nube), paso 5
(publicar), paso 6 (verificar). El paso 3 es opcional, pero conviene: si algo va a
fallar, es más barato descubrirlo en tu equipo.

Y después, el respaldo:
[Respaldo y restauración de la base](respaldo-y-restauracion.md).

---

## Lo que este procedimiento todavía no cubre

- **El banco real de preguntas.** La tabla de este documento es de juguete. El
  esquema es la iteración 21 y la carga la 24.
- **Caché, métricas y límites de uso.** Es la épica 50.
