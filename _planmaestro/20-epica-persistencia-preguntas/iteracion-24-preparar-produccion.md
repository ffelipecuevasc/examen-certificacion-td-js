# Iteración 24 · Preparar producción

**Épica:** 20 · Persistencia de preguntas
**Estado:** 🟢 Completada · 2026-09-09 · lecturas de producción recorridas · **falta publicar**
**Depende de:** iteración 23 (cerrada el 2026-09-08, commits `48c32c7` y `8deaab1`)
**Continúa en:** iteración 25, que llena el banco

## Objetivo

Dejar la base de producción **lista para recibir el banco**: esquema aplicado, las
dos migraciones registradas, `prueba_tuberia` fuera, y las deudas técnicas
acumuladas saldadas. Al terminar, producción está vacía pero correcta, y lo único
que le falta es contenido.

## La frontera con la iteración 25

Se decidió el 2026-09-08 partir en dos lo que antes era una sola iteración, porque
juntaba dos trabajos de naturaleza distinta: uno de infraestructura, corto y
peligroso, y otro de contenido, largo y minucioso.

| Iteración 24 · esta | Iteración 25 |
|---|---|
| Esquema en pruebas y en producción | Conversión de los dos bancos al formato de encargo |
| Las dos migraciones, en orden y registradas | Carga de las 368 preguntas |
| Borrado de `prueba_tuberia` | Redacción de las justificaciones |
| Deudas técnicas acumuladas | Rescate de la marca de orden fijo |
| Respaldo antes de tocar producción | Instantánea desde la nube y retirada del banco viejo |

**Lo que esto significa para ADR-023:** el incumplimiento consciente declarado el
2026-09-08 **se subsana en la 25, no aquí**. Esta iteración no genera ninguna
instantánea: no habría nada que copiar. La declaración de incumplimiento se traslada
tal cual, con su fecha original intacta, al paso correspondiente de la 25.

## Decisión tomada · Sí se publica al final de la 24

**Decidido por Felipe Cuevas el 2026-09-08.** La iteración 24 termina publicando, y
el estudiante ve un cuestionario vacío hasta que la 25 cargue el banco.

**Motivo, y es el que manda sobre la incomodidad:** hoy el estudiante ve **ocho
preguntas de juguete presentadas como copia guardada**. Después verá **un
cuestionario vacío que dice «todavía sin contenido»**. La segunda situación es más
honesta aunque parezca peor: **no le ofrece material que no es suyo.** Ocho preguntas
de prueba con aviso amarillo siguen siendo ocho preguntas que alguien puede ponerse a
estudiar creyendo que preparan un examen.

**Consecuencias que se aceptan:**

- Las tres deudas técnicas del sitio —contador, `/api/estado`, `MODULE_TYPELESS`— se
  quedan **en esta iteración**, porque si se publica hay que publicar el sitio
  arreglado, no a medias.
- El respaldo de ADR-008 deja de activarse en cuanto exista el esquema. Eso no es un
  fallo: es que ya no hay caída que respaldar.
- La instantánea versionada sigue saliendo de la base local hasta la 25, como está
  declarado en el incumplimiento consciente de ADR-023, que vive allá.

**Lo que esta decisión regala, y no estaba previsto.** Publicar aquí permite
comprobar sobre el **sitio real** la **segunda forma de estar vacío** —con esquema y
tablas vacías—, que hasta ahora sólo se había provocado en local. La primera forma
—sin esquema, con el respaldo activo— la comprobó el autor sobre el sitio publicado
el 2026-09-08. Con esta iteración quedan comprobadas las dos, cada una sobre
producción y no sobre una base de juguete. Está añadido como criterio.

### El planteamiento anterior, conservado

*Lo que sigue es la decisión tal como estaba abierta, y se conserva porque explica
por qué había que elegir en vez de dejar que pasara.*

**¿Qué ve un estudiante entre la 24 y la 25?**

Hoy el sitio publicado sirve la instantánea de respaldo con su aviso amarillo,
porque producción no tiene esquema y `/api/preguntas` devuelve `FALLO_CONSULTA`.
**Al aplicar el esquema, eso se acaba**: el extremo pasa a responder `200` con
`datos: []` y `meta.vacio: true`, el respaldo deja de activarse, y el sitio dice
«todavía sin contenido».

Es decir: hoy el estudiante ve ocho preguntas de juguete con un aviso honesto;
después de esta iteración vería **un cuestionario vacío** hasta que la 25 cargue el
banco. Es peor para el estudiante, aunque sea más correcto por dentro.

Las salidas posibles no son equivalentes y hay que elegir una:

- **No publicar entre la 24 y la 25.** El esquema se aplica en producción pero
  `main` no se empuja hasta que la 25 termine. El sitio sigue sirviendo el respaldo
  mientras tanto. Requiere que la 24 no toque nada del sitio, sólo la base.
- **Publicar y aceptar el cuestionario vacío**, si la 25 va a ser corta.
- **Juntar 24 y 25 en el tiempo** aunque estén separadas en el plan: aplicar el
  esquema y cargar el banco en la misma sesión de trabajo.

Quien decida esto lo documenta aquí con su motivo. **No se resuelve aplicando el
esquema y viendo qué pasa.** — *Resuelto arriba el 2026-09-08: se publica.*

## Tareas

### Preparación de la nube

- [x] **Exportar el respaldo de producción antes de tocarla.** ADR-014. Hoy está
  vacía y el respaldo va a ser trivial, y ese es justamente el momento de
  practicar el procedimiento: cuando no hay nada que perder.
- [x] **Aplicar el esquema en `examen-td-js-pruebas` primero, y después en
  `examen-td-js-produccion`.** Las dos migraciones, `001` y luego `002`, en ese
  orden, en las dos bases. Lo ejecuta el autor por ADR-015.
- [x] **Comprobar que las dos migraciones quedaron registradas**, con
  `SELECT * FROM migracion;` en cada base. Dos filas, no una.
- [x] **Borrar `prueba_tuberia` de producción.** Deuda abierta desde la iteración
  12. Requiere un `DROP` escrito a mano.

> **Aviso heredado, escrito el 2026-09-05. Aplicar el esquema NO borra
> `prueba_tuberia`.** Comprobado: `001-banco-de-preguntas.sql` no la menciona en
> ninguna línea. Correr la migración y dar la tabla por retirada es el error que
> este aviso existe para evitar. Y **antes de escribir el `DROP` hay que confirmar
> contra qué base apunta**, comparando el uuid: pruebas es
> `c01df3c9-c2a1-4379-ab2e-249e933cece4`, producción es
> `cff1686b-3b24-4892-9a10-4306684e0127`. Por **H-015**, el nombre que se teclea es
> lo único que decide dónde cae el comando; `wrangler.toml` no acota nada en remoto,
> y el uuid es la única red que existe.
>
> **En la base de pruebas ya no está**: la retiró el vaciado del ensayo remoto del
> 2026-09-05. Lo pendiente es sólo producción.

> **Corrección heredada, dejada escrita en vez de borrada.** Documentos anteriores
> decían que `--env preview` «es obligatorio» para `examen-td-js-pruebas`. **En
> remoto no lo es**, y creerlo produjo H-015: wrangler busca el nombre en la cuenta
> y encuentra la base igual. En local sí es obligatorio, porque allá resuelve sólo
> desde `wrangler.toml`. Se sigue escribiendo por higiene, pero **no protege de
> nada**: no lo trates como una barrera.

> **Aviso heredado, escrito el 2026-09-08. El orden con la comprobación del modo
> degradado ya se cumplió.** Esa comprobación era anterior a aplicar el esquema y
> **se ejecutó sobre el sitio publicado el 2026-09-08**, con el resultado esperado:
> `/api/estado` en `200`, `/api/preguntas` en `503` con `FALLO_CONSULTA` y
> `usar_respaldo: true`, el aviso de ADR-008 con su fecha y ocho preguntas dibujadas.
> La ventana se aprovechó antes de cerrarla. Esta iteración es la que la cierra.

### Deudas técnicas acumuladas

- [x] **El contador de la portada del cuestionario.** Dice «105 preguntas · 7
  módulos» escrito a mano en `cuestionario.html` (línea 60) y en el
  `<meta description>` (línea 7). El 2026-09-08 la pantalla mostraba «105
  preguntas» arriba y «copia guardada en el sitio (8 preguntas)» en el pie, al
  mismo tiempo. **El número tiene que salir del dato que se muestra, o
  desaparecer.**
- [x] **El punto ciego de `/api/estado`.** `functions/api/estado.js` hace
  `SELECT 1 AS vivo` y concluye `consulta_d1: "correcta"`. Esa consulta pasa
  igual con la base sin esquema: el 2026-09-08, `/api/estado` informaba que todo
  estaba bien mientras `/api/preguntas` devolvía `503`. **Una comprobación que no
  puede fallar no comprueba nada.**
- [x] **`MODULE_TYPELESS_PACKAGE_JSON`.** Aparece ya en tres caminos distintos: el
  generador de la instantánea, el guardián del escapado y
  `scripts/administrar-banco.mjs`. Cada guion nuevo que importe código del sitio
  suma uno. Ver H-020.
- [~] **Ejecutor de migraciones. Aplazado a propósito, no olvidado.** Esta iteración
  aplicó exactamente dos migraciones, a mano y con el autor mirando cada salida.
  Escribir un ejecutor nuevo para estrenarlo en la única operación irreversible de la
  épica habría metido una herramienta sin probar en el peor momento posible. Se
  decide cuando haya una tercera migración; sigue anotado en el registro.

### Cierre

- [x] **Dejar constancia del estado en que queda producción**, para que la 25 empiece
  sabiendo qué encontró: tablas creadas, filas en `migracion`, tablas vacías,
  `prueba_tuberia` ausente.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no
razonando sobre él. Los de la nube los ejecutó el autor por ADR-015, el 2026-09-09.

- [x] **El esquema está en las dos bases de la nube, y coincide con lo que declaran
  las migraciones.** Listado completo de producción el 2026-09-09, pidiendo también
  vistas e índices y no sólo tablas:

  ```
  index │ alternativa_una_correcta
  index │ pregunta_por_estado_y_modulo
  index │ pregunta_reemplazos
  table │ alternativa
  table │ migracion
  table │ modulo
  table │ pregunta
  view  │ pregunta_activa
  ```

  **Ocho objetos, y son exactamente los ocho que declara `001-banco-de-preguntas.sql`:**
  cuatro tablas, tres índices y la vista. Ni uno de más ni uno de menos.

  *El primer listado se había pedido con `type='table'` y dejaba fuera la vista y los
  índices. Se repitió sin ese filtro, porque «las tablas están» no es lo mismo que «el
  esquema está»: la vista `pregunta_activa` es de la que come el sitio entero, y
  darla por presente sin verla habría sido justo la clase de suposición que esta
  iteración vino a cerrar.*
- [x] **Las dos migraciones están registradas en las dos bases.** Salida literal:

  ```
  produccion                                   pruebas
  001-banco-de-preguntas    | 2026-09-09       001-banco-de-preguntas    | 2026-09-05
  002-fecha-de-modificacion | 2026-09-09       002-fecha-de-modificacion | 2026-09-09
  ```

  **La fecha `2026-09-05` de pruebas no es un error: es la prueba de que la `001` es
  repetible.** Ya estaba aplicada desde el ensayo de la iteración 21, y volver a
  correrla no duplicó nada ni pisó la fecha —`INSERT OR IGNORE`—. Lo confirma su
  propia salida: `10 queries, 7 rows read, 0 rows written`. **Cero filas escritas.**
  En producción, donde no estaba, la misma migración escribió 27.
- [x] **La columna `fecha_modificacion` existe de verdad**, comprobada contra el
  esquema real con `pragma_table_info('pregunta')` en las dos bases, y no contra el
  libro de migraciones. Es la comprobación que faltó en la rama `antigravity`.
- [x] **`prueba_tuberia` ya no está en producción.** Antes: `_cf_KV`,
  `prueba_tuberia`. Después del `DROP`: `_cf_KV`, `alternativa`, `migracion`,
  `modulo`, `pregunta`. Deuda abierta desde la iteración 12, cerrada.
- [x] **Se confirmó el uuid antes de cada comando contra producción.** `d1 info`
  devolvió `cff1686b-3b24-4892-9a10-4306684e0127`, y **cada** ejecución remota
  imprimió esa misma cadena en su propia línea `Executing on remote database`. El
  cotejo está en la salida, no en la intención.
- [x] **El respaldo de producción se exportó antes de tocarla.**
  `d1/respaldo-banco.sql`, 527 bytes, 9 líneas, con el `CREATE TABLE` de
  `prueba_tuberia` y sus dos filas. **Hoy es la única copia que queda de esa tabla**,
  y eso es exactamente lo que hacía que el `DROP` posterior fuera seguro. Se practicó
  el procedimiento de ADR-014 cuando no había nada que perder, que era el momento.
- [x] **El contador de la portada ya no puede mentir.** Estaba escrito a mano —«105
  preguntas · 7 módulos»— en `cuestionario.html`, y el número lo pone ahora el
  componente con lo que de verdad dibujó. Provocado en cuatro estados corriendo el
  componente real contra el extremo real:

  | Banco | Contador |
  |---|---|
  | 8 preguntas en 7 módulos | «8 preguntas · 7 módulos» |
  | se retiran las del módulo 8 | «7 preguntas · 6 módulos» |
  | un `UPDATE` que la base rechaza | **no se mueve**, porque nada cambió |
  | cero activas | **desaparece**, oculto y vacío |

  Los dos números siguen al dato, no sólo uno. Y cuando no hay nada que contar no
  aparece: **ningún número es mejor que un número falso.** Del `<meta description>`
  se quitó el número en vez de hacerlo dinámico: es HTML estático que se sirve antes
  de que corra nada, y ponerle un número al construir crearía una segunda fuente que
  vuelve a poder desfasarse.
- [x] **`/api/estado` sabe fallar.** Con la base sin esquema pasó de responder
  `200 · consulta_d1 "correcta"` a responder **`503 · SIN_ESQUEMA`**. Provocado
  borrando el estado de la D1 local, no razonado.
- [x] **`/api/estado` dice la verdad sobre si el banco está vacío.** Los tres estados
  provocados, y los dos extremos coinciden en los tres:

  | Estado de la base | `/api/preguntas` | `/api/estado` |
  |---|---|---|
  | Sin esquema | `503` `FALLO_CONSULTA` | `503` `SIN_ESQUEMA` |
  | Con esquema, banco en 0 | `200` `vacio: true` | `200` `preguntas_activas: 0` · `banco_vacio: true` |
  | Con esquema, banco con 8 | `200` `vacio: false` | `200` `preguntas_activas: 8` · `banco_vacio: false` |

  `banco_vacio` **cambia de valor**, que es lo que lo separa de la constante
  disfrazada que había antes. Ver H-022.
- [x] **`MODULE_TYPELESS_PACKAGE_JSON` no aparece** en ninguno de los tres caminos:
  el generador de la instantánea, el guardián del escapado y la herramienta de
  administración devuelven **cero** ocurrencias. Arreglado declarando
  `"type": "module"` y renombrando `tailwind.config.js` a `tailwind.config.cjs`.

  **Lo que hacía falta comprobar era que no rompiera nada, y se comprobó:** el CSS
  compilado quedó **byte a byte idéntico** (`0bb489dca2eedfb544533a3d3dff04aa` antes
  y después), lo que prueba que Tailwind encontró su configuración `.cjs` —si no,
  habría compilado con la paleta por omisión y el archivo sería otro—; `functions/`
  compila; las dos páginas y los doce módulos ES se sirven en `200`.

  **Lo que no se puede comprobar desde aquí:** que la construcción de Cloudflare
  Pages haga lo mismo que la local. Eso sólo lo prueba el despliegue, y por eso va
  antes de dar la iteración por cerrada.
- [x] **La segunda forma de estar vacío, comprobada sobre el sitio publicado.**
  Comprobada por el autor el 2026-09-09, **sin publicar nada**: el Worker lee D1 en
  vivo, así que aplicar el esquema cambió el sitio solo.

  ```
  /api/preguntas  200 · datos [] · meta.vacio TRUE · filas_leidas 1
                  validacion: leidas 0, entregadas 0, descartadas 0
  /api/estado     200 · enlace_d1 «presente» · consulta_d1 «correcta»
                  meta.vacio FALSE          <- la contradiccion, H-022
  cuestionario    «Todavia no hay preguntas cargadas. El banco esta
                  conectado pero vacio.»
  ```

  **Comprobado en las dos direcciones**, con resultado idéntico: el alias del
  despliegue `2934ad82.examen-certificacion-td-js.pages.dev` y la canónica
  `examen-certificacion-td-js.pages.dev`. Se repitió en la canónica a propósito:
  **un alias puede quedar apuntando a un despliegue viejo, y una evidencia tomada
  sólo del alias no prueba qué está sirviendo el sitio.**

  Con esto y con la primera forma —sin esquema, `503`, respaldo activo, comprobada
  el 2026-09-08—, **el modo degradado queda comprobado en sus dos extremos contra
  producción**, que es más de lo que esta iteración se propuso.
- [x] **`npm run verificar` termina en 0** con las cuatro comprobaciones en OK:
  barrera, css, escapado y restricciones.
- [x] **El estado de producción queda escrito** y coincide con lo que devuelve la
  base al consultarla. Cotejado el 2026-09-09, con el uuid confirmado otra vez antes
  de leer:

  ```
  modulos │ preguntas │ activas │ alternativas
  7       │ 0         │ 0       │ 0
  ```

  Y una corroboración que llegó sin buscarla: `d1 info` informa ahora
  **`num_tables: 4`**, cuando antes de las migraciones informaba **`1`** —la única
  tabla era `prueba_tuberia`—. El número cuadra con las cuatro tablas del esquema y
  con que la vieja ya no está. La base pasó de 20.5 kB a 61.4 kB.

  La tabla de «Estado en que queda producción», más abajo, se escribió **antes** de
  esta lectura y no hubo que corregirla.

## Lo que queda por hacer, y quién

**Recorrido el 2026-09-09.** Los tres comandos los ejecutó el autor y su salida
literal está abajo, en la constancia. Se dejan escritos porque son los mismos que
la iteración 25 va a querer repetir para ver qué cambió al cargar el banco.

**Del autor**, tres comandos de lectura contra producción:

```powershell
node node_modules/wrangler/bin/wrangler.js d1 info examen-td-js-produccion
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --remote --command="SELECT type, name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' AND name <> '_cf_KV' ORDER BY type, name;"
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --remote --command="SELECT (SELECT COUNT(*) FROM modulo) modulos, (SELECT COUNT(*) FROM pregunta) preguntas, (SELECT COUNT(*) FROM pregunta_activa) activas, (SELECT COUNT(*) FROM alternativa) alternativas;"
```

El primero es el cotejo del uuid, otra vez. El segundo lista **también las vistas y
los índices**, que es lo que faltó: tienen que salir las cuatro tablas, la vista
`pregunta_activa` y los índices `pregunta_por_estado_y_modulo`,
`pregunta_reemplazos` y `alternativa_una_correcta`. El tercero confirma el estado en
que queda: 7 módulos, 0 preguntas, 0 activas, 0 alternativas.

**Y después, publicar**, que es la decisión tomada arriba y lo único que queda
abierto de esta iteración. La lista de comprobación del push está al final.

## Estado en que queda producción

*Para que la iteración 25 empiece sabiendo qué encontró.*

| Qué | Estado al cerrar la 24 |
|---|---|
| Base | `examen-td-js-produccion` · `cff1686b-3b24-4892-9a10-4306684e0127` |
| Migraciones | `001-banco-de-preguntas` y `002-fecha-de-modificacion`, las dos el 2026-09-09 |
| Tablas | `alternativa`, `migracion`, `modulo`, `pregunta` |
| `prueba_tuberia` | **Borrada.** Su única copia es `d1/respaldo-banco.sql` |
| Contenido | **Cero preguntas.** Los 7 módulos de referencia, que los crea la `001` |
| Qué ve el estudiante | «Todavía no hay preguntas cargadas. El banco está conectado pero vacío» |
| Respaldo de ADR-008 | **No se activa**, y es correcto: ya no hay caída que respaldar |
| Instantánea versionada | Sigue saliendo de la base local. Se subsana en la 25 |

### Constancia · la salida literal del 2026-09-09

*Las tres lecturas, tal como las devolvió la base. La tabla de arriba se había
escrito **antes** de pedirlas y no hubo que corregir ninguna fila.*

**1 · `d1 info` — el cotejo del uuid, otra vez.**

```
BANCO              cff1686b-3b24-4892-9a10-4306684e0127
name               examen-td-js-produccion
created_at         2026-09-03T12:29:53.334Z
num_tables         4
database_size      61.4 kB
read_queries_24h   32     write_queries_24h   3
rows_read_24h      179    rows_written_24h    32
```

`num_tables: 4` es la corroboración que ya estaba anotada: antes de las migraciones
decía `1`, y esa única tabla era `prueba_tuberia`.

**Y hay una segunda corroboración que no se había pedido: `write_queries_24h: 3`.**
Contra producción se ejecutaron en las últimas 24 horas exactamente tres operaciones
de escritura, y son las tres que esta iteración declara —la migración `001`, la `002`
y el `DROP TABLE`—. **No hay una cuarta.** Eso vale como comprobación de que nada más
escribió en producción mientras se trabajaba, que es justo el tipo de cosa que en la
iteración 22 se descubrió tarde y por casualidad: la `id 11` que la herramienta de
Antigravity dejó en la base local nadie la vio entrar. El contador no lo habría
impedido, pero la habría delatado el mismo día.

**2 · El esquema completo, sin filtrar por `type='table'`.**

```
index │ alternativa_una_correcta
index │ pregunta_por_estado_y_modulo
index │ pregunta_reemplazos
table │ alternativa
table │ migracion
table │ modulo
table │ pregunta
view  │ pregunta_activa
```

Ocho objetos: cuatro tablas, tres índices y la vista. Son exactamente los ocho que
declara `001-banco-de-preguntas.sql`, ni uno de más ni uno de menos. **La vista
`pregunta_activa` está**, y es la que importa: es de la que come el sitio entero y de
la que cuenta `/api/estado` desde esta misma iteración.

**3 · El contenido.**

```
modulos │ preguntas │ activas │ alternativas
7       │ 0         │ 0       │ 0
```

Siete módulos de referencia, que los crea la `001`. Cero preguntas, cero activas,
cero alternativas. **Producción está vacía y correcta**, que es literalmente el
objetivo de esta iteración.

### Qué significa esto para la iteración 25

*Lo que la 25 puede dar por cierto sin volver a comprobarlo, y lo que no.*

| Puede dar por cierto | No puede |
|---|---|
| El esquema está completo, vista e índices incluidos | Que siga estándolo si alguien tocó la base entremedio: `d1 info` de nuevo, es un comando |
| `prueba_tuberia` no existe | — |
| Las dos migraciones están registradas | Que una tercera no haga falta: eso se mira en `d1/migraciones/` |
| El contenido arranca en 0 · 0 · 0 con 7 módulos | — |
| Las restricciones del esquema rechazan lo que deben (probado en local y a mano en la nube) | Que el banco real pase esas restricciones. Eso lo dirá la carga |

Y una advertencia que la 25 hereda: **el respaldo de ADR-008 ya no se activa.** Desde
que existe el esquema, `/api/preguntas` responde `200` con la lista vacía en vez de
`503`. Si durante la carga algo sale mal, el sitio **no** va a caer al respaldo: va a
mostrar lo que haya en la base, bien o mal. La red que tapaba los errores se retiró en
esta iteración, y se retiró a propósito.

## Lo que esta iteración no puede afirmar

- Que el banco esté cargado. No lo estará: es la iteración 25.
- Que ADR-023 esté cumplida. Se subsana en la 25, y hasta entonces la instantánea
  publicada sigue saliendo de la base local, como está declarado.
- Que el sitio sirva contenido real. Después de esta iteración, producción tiene
  esquema y cero preguntas.

## Lista de comprobación del push

*Pedida por el registro: «anotada como última tarea de la iteración 24, con la lista
de lo que tiene que estar antes de empujar». Aquí está, y con la mitad de después,
porque hay cosas que sólo se ven en el sitio publicado.*

**Por qué esta iteración necesita lista propia y no le basta el manual.**
`90-manual/publicacion-en-cloudflare-pages.md` cubre el push de siempre. Esta entrega
trae dos cambios que **el manual no cubre porque nunca habían pasado**: se tocó el
sistema de construcción —`"type": "module"` y `tailwind.config.cjs`— y se sacó un
número escrito a mano del HTML estático. Los dos fallan de una manera que la
verificación local no puede ver.

### Antes de empujar

| # | Qué | Cómo se comprueba | Qué significa que falle |
|---|---|---|---|
| 1 | `npm run verificar` dice **`VERIFICADO`** y sale con **0** | Con `npm run datos:dev` levantado en otra terminal | Con el servidor abajo sale `VERIFICACION INCOMPLETA` y código **2**. **No es un aprobado**: el escapado queda como casilla en blanco |
| 2 | El renombrado viaja como **renombrado**, no como archivo nuevo | `git status --short` muestra `R  tailwind.config.js -> tailwind.config.cjs`, y `git ls-files \| grep -i tailwind` devuelve **sólo** el `.cjs` | Si el `.js` viejo siguiera versionado junto al `.cjs`, Tailwind encontraría el de siempre y el aviso volvería. Peor: todo se vería bien |
| 3 | El CSS compilado está al día y commiteado | Lo cubre la comprobación `css` del punto 1 | El sitio publicado se construye de la fuente, pero el repositorio quedaría mintiendo |
| 4 | `functions/` **no** está dentro de `dist/` | Lo comprueba `npm run build` y se detiene solo | Servido desde `dist/`, el código de la capa de datos se descarga en vez de ejecutarse |
| 5 | No queda nada sin commitear | `git status --short` vacío | Publicar es empujar: lo que no esté commiteado, no se publica, y el sitio queda a medias sin avisar |

### Después de publicar

*Las cuatro primeras son las que **sólo** se ven allá. Ninguna la puede cerrar la
verificación local.*

| # | Qué mirar | Bien | Mal, y qué significa |
|---|---|---|---|
| 1 | **La paleta.** Es la prueba de que la construcción de Pages encontró `tailwind.config.cjs` | Fondo negro, texto crema, acentos amarillos | **Página blanca con texto negro y sin amarillo.** `bg-ink`, `text-paper` y `text-jsyellow` son colores del proyecto: si Tailwind no halla su configuración no existen, y el navegador los ignora. Es feo y por eso es una buena prueba: **no se puede pasar por alto** |
| 2 | **La insignia del contador**, arriba a la izquierda del panel | **No aparece.** Con cero activas se esconde: ningún número es mejor que un número falso | **Si dice «105 preguntas · 7 módulos», el arreglo no llegó al despliegue.** Ese texto ya no existe en el HTML: verlo significa caché, un despliegue viejo, o que se está mirando un alias que no es |
| 3 | **El mensaje del cuestionario** | «Todavía no hay preguntas cargadas. El banco está conectado pero vacío.» | Si sale «No se pudo cargar el banco de preguntas», el sitio no está hablando con D1 y hay que mirar `/api/estado` |
| 4 | **El aviso amarillo de respaldo (ADR-008)** | **No está.** Con esquema aplicado ya no hay caída que respaldar | Si aparece, con sus ocho preguntas de juguete, es que `/api/preguntas` devolvió `503` y hay que ir al punto 6 |
| 5 | `/api/preguntas` | `200` · `datos: []` · `meta.vacio: true` | — |
| 6 | `/api/estado` | `200` · `preguntas_activas: 0` · `banco_vacio: true` · **y sin `meta.vacio`** | Si reaparece `meta.vacio`, volvió H-022 y los dos extremos vuelven a contradecirse |
| 7 | La consola del navegador | Sin errores en las dos páginas | — |

**Y las siete, en las dos direcciones:** el alias del despliegue y la canónica
`examen-certificacion-td-js.pages.dev`. **Un alias puede quedar apuntando a un
despliegue viejo**, así que una evidencia tomada sólo del alias no prueba qué está
sirviendo el sitio. El 2026-09-09 se comprobó así a propósito y por eso la evidencia
del modo degradado vale.

### Lo que ninguna de estas comprobaciones puede decir

Que la iteración 25 vaya a poder cargar el banco. Esta lista cierra la 24: deja
constancia de que producción quedó vacía y correcta, y de que el sitio publicado lo
refleja sin mentir en ningún número.

## Notas de la iteración

