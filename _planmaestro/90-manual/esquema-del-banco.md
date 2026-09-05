# Esquema del banco de preguntas en D1

Qué guarda cada tabla, qué exige la base por su cuenta y qué hay que comprobar
aparte. Escrito en la iteración 21.

Las decisiones que lo sostienen: **ADR-018** (alternativas en tabla aparte),
**ADR-019** (la correcta es una bandera, no una posición), **ADR-020** (las
retiradas se marcan, no se borran) y **ADR-021** (los módulos son una tabla).

Archivos:

| Archivo | Para qué |
|---|---|
| `d1/migraciones/001-banco-de-preguntas.sql` | Crea el esquema. Repetible |
| `d1/ejemplo-banco.sql` | Diez filas de ejemplo, con los casos difíciles |
| `d1/verificar-banco.sql` | Lo que la base no puede exigir sola |
| `scripts/verificar-banco.mjs` | Convierte esa consulta en un fallo ruidoso |

---

## Tabla `modulo`

Los siete módulos del plan formativo. Datos de referencia: se cargan con el
esquema y no cambian con el contenido.

| Campo | Tipo | Obligatorio | Ejemplo | Notas |
|---|---|---|---|---|
| `numero` | INTEGER | sí, llave primaria | `5` | `CHECK (numero BETWEEN 2 AND 8)`: el plan empieza en el 2 |
| `titulo` | TEXT | sí | `Fundamentos de Bases de Datos Relacionales` | |
| `icono` | TEXT | sí | `database` | Nombre de la clase `i-*`, sin el prefijo |

## Tabla `pregunta`

Una fila por pregunta, de cualquiera de los dos orígenes. **Ninguna fila se borra
nunca**, así que el `id` es estable para siempre.

| Campo | Tipo | Obligatorio | Ejemplo | Notas |
|---|---|---|---|---|
| `id` | INTEGER | sí, llave primaria | `42` | Estable de por vida. Es la referencia que se puede citar |
| `modulo` | INTEGER | sí | `5` | Llave foránea a `modulo.numero` |
| `origen` | TEXT | sí | `json_2026` | `json_2026` (los siete JSON) o `js_2026` (el banco viejo) |
| `numero_origen` | INTEGER | sí | `17` | El `numero` en el JSON, o la posición en el archivo viejo |
| `enunciado` | TEXT | sí, **único** | `¿Qué cláusula SQL…?` | Dos preguntas con el mismo enunciado son un error de carga |
| `justificacion` | TEXT | no | `HAVING filtra después de agrupar…` | Nulo mientras no se redacte |
| `dificultad` | TEXT | no | `media` | `baja`, `media` o `alta`. **Nulo significa sin clasificar**, no «media» |
| `orden_fijo` | INTEGER | sí, por omisión `0` | `1` | `1` = no se baraja. Hoy hay exactamente una así |
| `estado` | TEXT | sí, por omisión `borrador` | `activa` | `borrador`, `activa` o `retirada` |
| `motivo_retiro` | TEXT | solo si está retirada | `Solapamiento con la pregunta 5…` | Obligatorio si `estado = 'retirada'` |
| `retirada_en` | TEXT | no | `2026-09-04` | Fecha ISO |
| `reemplazada_por` | INTEGER | no | `5` | Llave foránea a otra `pregunta`. Responde «¿y esta por qué no está?» |
| `creada_en` | TEXT | sí, por omisión hoy | `2026-09-04` | |

**`dificultad` nace nula a propósito.** Nadie ha clasificado las 368 preguntas, y
poner `media` por omisión inventaría un dato que no existe. Nulo dice la verdad.

## Tabla `alternativa`

Cuatro filas por pregunta. Una fila por alternativa, no cuatro columnas: ADR-018.

| Campo | Tipo | Obligatorio | Ejemplo | Notas |
|---|---|---|---|---|
| `id` | INTEGER | sí, llave primaria | `168` | |
| `pregunta_id` | INTEGER | sí | `42` | Llave foránea a `pregunta.id`, con `ON DELETE CASCADE` |
| `letra` | TEXT | sí | `c` | Solo `a`, `b`, `c` o `d`. Única dentro de la pregunta |
| `orden` | INTEGER | sí | `3` | De 1 a 4. Único dentro de la pregunta. Es el orden original |
| `texto` | TEXT | sí | `CLÁUSULA HAVING` | |
| `es_correcta` | INTEGER | sí, por omisión `0` | `1` | Como mucho una por pregunta |

**`letra` y `orden` son historia, no identidad.** La letra es la que traía el
origen y sirve para que alguien pueda reportar «la b está mal» y se encuentre. El
orden es el original. **Ninguna de las dos decide qué es correcto**: eso lo dice
`es_correcta`, y por eso barajar no rompe nada.

## Vista `pregunta_activa`

Lo único que leen las funciones de `functions/api/`. Trae la pregunta ya cruzada
con su módulo, y **sin los metadatos de retiro**.

```sql
SELECT id, modulo, modulo_titulo, modulo_icono,
       enunciado, justificacion, dificultad, orden_fijo
FROM pregunta_activa WHERE modulo = 5;
```

El filtro por estado vive en la definición de la vista. Ninguna consulta lo
escribe, así que ninguna puede olvidarlo.

---

## La frontera: qué garantiza la base y qué no

Esto es lo que más fácil se confunde, y por eso está en dos sitios: aquí y en la
cabecera de `d1/verificar-banco.sql`.

### Lo garantiza la base, siempre, sin que nadie corra nada

Comprobado provocando cada violación contra D1 local, no razonando sobre el
esquema. El mensaje es el que devuelve la base de verdad.

| Lo que se intentó | Lo que respondió la base |
|---|---|
| Una quinta alternativa, con letra `e` | `CHECK constraint failed: letra IN ('a', 'b', 'c', 'd')` |
| Repetir la letra `a` en la misma pregunta | `UNIQUE constraint failed: alternativa.pregunta_id, alternativa.letra` |
| Una quinta alternativa reusando un `orden` | `UNIQUE constraint failed: alternativa.pregunta_id, alternativa.orden` |
| Marcar una segunda alternativa correcta | `UNIQUE constraint failed: alternativa.pregunta_id` |
| Una pregunta en un módulo que no existe | `FOREIGN KEY constraint failed` |
| Retirar una pregunta sin decir por qué | `CHECK constraint failed: estado <> 'retirada' OR motivo_retiro IS NOT NULL` |
| Repetir un enunciado que ya existe | `UNIQUE constraint failed: pregunta.enunciado` |
| Cargar dos veces la misma pregunta del mismo origen | `UNIQUE constraint failed: pregunta.origen, pregunta.modulo, pregunta.numero_origen` |
| `es_correcta = 7` | `CHECK constraint failed: es_correcta IN (0, 1)` |

**El tope de cuatro alternativas sale de dos restricciones que se refuerzan.**
`CHECK` sobre `letra` más `UNIQUE (pregunta_id, letra)` dejan como mucho cuatro
filas, porque solo hay cuatro letras y cada una se usa una vez; y
`UNIQUE (pregunta_id, orden)` con `CHECK (orden BETWEEN 1 AND 4)` hace lo mismo por
otro camino. Ninguna de las dos hace falta para que la otra funcione, y tener las
dos no sobra: son dos formas distintas de decir lo mismo, y si alguien relaja una,
la otra aguanta.

**El `NOT NULL` de `letra` no es decorativo, sostiene la garantía.** Un `CHECK`
sobre `NULL` no da falso sino `NULL`, y SQLite deja pasar la fila; y `UNIQUE`
considera cada `NULL` distinto de los demás. Medido con la misma tabla sin
`NOT NULL`: se colaron **siete** alternativas en una sola pregunta.

**Las llaves foráneas están activas.** SQLite las trae desactivadas por omisión;
D1 no. Comprobado: insertar una pregunta en el módulo 9 la rechaza.

### NO lo garantiza la base, y por eso existe `verificar-banco`

| Qué falta comprobar | Por qué el esquema no puede |
|---|---|
| Que las alternativas sean **exactamente** cuatro | La base impide pasarse de cuatro, no quedarse en tres |
| Que exista **al menos una** correcta | El índice parcial impide que haya dos, no que haya cero |
| Que ninguna pregunta activa esté sin justificación | Es una regla del producto, no del modelo |
| Que ningún módulo se quede sin preguntas activas | Ídem |

Las dos primeras se podrían forzar con disparadores. **No se usan**: el proyecto no
tiene ninguno, son difíciles de leer, y una comprobación que corre después de cada
carga y falla ruidosamente cubre el mismo riesgo sin esconder lógica en la base.

```
npm run datos:verificar-banco
```

Se corre **después de cada carga**. Responde una de tres cosas, y las tres son
distintas entre sí. Distinguirlas es el punto: confundir las dos últimas fue el
hallazgo H-013.

| Veredicto | Código | Qué significa |
|---|---|---|
| `BANCO VERIFICADO` | 0 | La consulta corrió y no encontró nada |
| `BANCO CON PROBLEMAS` | 1 | La consulta corrió y encontró esto, descrito uno por línea |
| `NO SE PUDO VERIFICAR` | 2 | **Nadie llegó a mirar el banco.** No se sabe si cumple |

**El 2 no es un aprobado con reparos.** Es la ausencia de respuesta: wrangler no
completó la consulta, o contestó algo que el envoltorio no reconoce. No dice que el
banco esté bien ni que esté mal; dice que la pregunta no llegó a hacerse. Tratarlo
como un pase es exactamente el error que costó H-013.

Un `BANCO CON PROBLEMAS` real, borrando una alternativa y vaciando una
justificación:

```
BANCO CON PROBLEMAS  ***  3 ***
  activa sin justificacion -> pregunta 3 (modulo 4)
  alternativas distintas de cuatro -> pregunta 1 (modulo 2, json_2026 #1): tiene 3
  sin ninguna alternativa correcta -> pregunta 1 (modulo 2, json_2026 #1)

codigo de salida: 1
```

Un `NO SE PUDO VERIFICAR`, aquí por escribir mal un argumento. Se imprime el comando
completo y lo que dijo wrangler, con el motivo primero:

```
NO SE PUDO VERIFICAR  ***  ESTO NO ES UN APROBADO  ***
wrangler termino con el codigo 3221226505, asi que no completo la consulta.

Nadie llego a mirar el banco, asi que no se sabe si cumple o no.
Esto NO significa que el banco este bien, ni que este mal.

Comando ejecutado:
  … node.exe … wrangler.js d1 execute examen-td-js-produccion --local --remot --json …

Lo que fallo, segun wrangler:
  X [ERROR] Unknown argument: remot

codigo de salida: 2
```

Los motivos que aparecen en la práctica, todos con su texto a la vista:

| Lo que dice | Qué pasó |
|---|---|
| `Unknown argument: …` | Un argumento mal escrito. Se ve en la línea del comando |
| `Couldn't find a D1 DB with the name or binding …` | La base no está declarada en `wrangler.toml`. `examen-td-js-pruebas` sólo existe bajo `env.preview`: para llegar a ella hace falta `--env preview` |
| `no such table: modulo` | La base existe pero está vacía: falta correr la migración. En remoto llega como `no such table: modulo: SQLITE_ERROR [code: 7500]`, y lo devuelve **D1**, no wrangler |
| `Couldn't find a D1 DB with name or binding … in your config or the API` | **En remoto**, y no es lo mismo que la fila anterior: wrangler se autenticó, preguntó a la cuenta por ese nombre y recibió un 404. Ese nombre no existe en la cuenta. Ojo con la diferencia de redacción: la de arriba dice «with **the** name» y es la de local |
| `No encontre wrangler en node_modules` | Falta `npm install` |
| `Una fila … no trae las columnas que declara la consulta` | Cambió `d1/verificar-banco.sql` y no se actualizó la lista `COLUMNAS` en la cabecera del script |

En Windows, wrangler se cae al terminar —`Assertion failed … src\win\async.c, line
94`, un fallo suyo, no del proyecto— y devuelve `3221226505` en vez de un código
legible. **Sale a menudo**: apareció en dos de las tres corridas del ensayo remoto
del 2026-09-05. Está registrado como **H-016** para que nadie lo lea como un problema
del banco. Por eso el envoltorio no se fía sólo del código de salida y también
comprueba la forma de la respuesta: **si ves ese aviso, mira el veredicto, no el
código.**

---

## Índices

Dos consultas previstas, y las dos filtran igual, así que **un solo índice sirve
para ambas**.

| Consulta | Índice | Plan real |
|---|---|---|
| Banco completo por módulo | `pregunta_por_estado_y_modulo` | `SEARCH p USING INDEX pregunta_por_estado_y_modulo (estado=? AND modulo=?)` |
| Selección para el simulacro | el mismo | `SEARCH p USING COVERING INDEX …` + `USE TEMP B-TREE FOR ORDER BY` |

Dos cosas que conviene saber y que se ven en el plan, no se suponen:

- **El orden aleatorio no se puede indexar.** `ORDER BY RANDOM()` obliga a un árbol
  temporal sobre el conjunto ya filtrado. Con 368 preguntas no es un problema, y
  ningún índice lo mejora.
- **No hay índice sobre `alternativa (pregunta_id)` a propósito.** Los `UNIQUE` de
  esa tabla ya crean índices con `pregunta_id` a la izquierda, y el `JOIN` los
  usa: el plan muestra `SEARCH a USING INDEX sqlite_autoindex_alternativa_2
  (pregunta_id=?)`. Un índice más sería peso muerto que hay que mantener en cada
  escritura.

---

## Aplicar el esquema

En local, todo con `--local`:

```
npm run datos:migrar            # crea el esquema; correrlo dos veces no rompe nada
npm run datos:ejemplo           # carga las diez filas de ejemplo
npm run datos:verificar-banco   # comprueba lo que el esquema no puede
```

### Devolver la base local a un estado conocido

Probar restricciones deja rastro: borrar una alternativa para ver si la comprobación
la detecta, reinsertarla a mano, cargar una fila de prueba. Después de eso la base
local ya no es la de nadie, y **repetir las pruebas sobre ella no demuestra nada**:
un `BANCO VERIFICADO` puede venir de que el arreglo funciona o de que la fila que
faltaba se repuso mal y da la casualidad de que cumple.

Se tira y se rehace. Son tres comandos, todos locales, y no tocan nada de la nube:

```
# PowerShell
Remove-Item -Recurse -Force .wrangler\state\v3\d1
npm run datos:migrar
npm run datos:ejemplo
npm run datos:verificar-banco
```

```
# Git Bash
rm -rf .wrangler/state/v3/d1
npm run datos:migrar
npm run datos:ejemplo
npm run datos:verificar-banco
```

Se borra sólo `d1`, no `.wrangler/` entera: ahí también vive la sesión iniciada de
wrangler, y borrarla obliga a volver a autenticarse sin ninguna necesidad. La
carpeta está en `.gitignore`, así que no hay nada versionado que perder.

Debe quedar así, y conviene comprobarlo en vez de suponerlo:

```
npx wrangler d1 execute examen-td-js-produccion --local --json --command="SELECT (SELECT COUNT(*) FROM modulo) modulos, (SELECT COUNT(*) FROM pregunta) preguntas, (SELECT COUNT(*) FROM pregunta WHERE estado='activa') activas, (SELECT COUNT(*) FROM alternativa) alternativas;"
```

```
modulos 7 · preguntas 10 · activas 8 · alternativas 40
```

`datos:migrar` informa **10 sentencias** y `datos:ejemplo` **3**. Las dos son
repetibles, así que correrlas sobre una base que ya las tiene tampoco rompe nada;
lo que no es repetible es lo que se haya hecho a mano entremedio, y por eso se
borra el archivo en vez de confiar en el `INSERT OR IGNORE`.

### Lo mismo, sobre la base de pruebas local

`examen-td-js-pruebas` también existe en local, en su propio archivo, y es la base
donde conviene ensayar antes de tocar nada de la nube. Todo igual, con **`--env
preview` en cada comando**, porque esa base sólo está declarada bajo ese entorno:

```
rm -rf .wrangler/state/v3/d1        # o Remove-Item -Recurse -Force en PowerShell
npx wrangler d1 execute examen-td-js-pruebas --local --env preview --file=d1/migraciones/001-banco-de-preguntas.sql
npx wrangler d1 execute examen-td-js-pruebas --local --env preview --file=d1/ejemplo-banco.sql
npm run datos:verificar-banco -- --base=examen-td-js-pruebas --local --env preview
```

Olvidar `--env preview` es el error más fácil de cometer aquí, y ya no pasa
inadvertido: el veredicto es `NO SE PUDO VERIFICAR` con el motivo a la vista,
`Couldn't find a D1 DB with the name or binding 'examen-td-js-pruebas'`. Antes del
arreglo de H-013 eso mismo salía como `BANCO CON PROBLEMAS`.

Una advertencia sobre `--persist-to`, por si se usa para no tocar la base de
trabajo: la ruta que se le pase tiene que ser **corta**. Wrangler cuelga debajo de
ella `v3/d1/miniflare-D1DatabaseObject/<hash>.sqlite`, y en una carpeta temporal
de nombre largo se pasa del límite de ruta de Windows. El síntoma es
`SQLITE_CANTOPEN`, que no menciona la longitud por ningún lado.

### `--command` para leer, `--file` sólo para escribir

Contra una base **remota**, `wrangler d1 execute --file=` no ejecuta el archivo: lo
**sube por el extremo de importación**, que es el camino de escritura. Por eso
wrangler imprime, antes de empezar:

```
▲ [WARNING] ⚠️ This process may take some time, during which your D1 database
will be unavailable to serve queries.
```

Ese aviso no es decorativo, y aparece igual aunque el archivo contenga una sola
consulta de lectura. Se comprobó en los registros de wrangler: un `SELECT` enviado
con `--file --remote` produjo dos `POST .../d1/database/<id>/import`, ambos con
respuesta 200. Con `--command` la misma consulta va por `.../query`, que es el
extremo de lectura.

| Qué quieres hacer | Cómo |
|---|---|
| Leer: contar, comprobar, mirar filas | `--command="SELECT …"` |
| Escribir: migración, carga del banco, corrección masiva | `--file=…` |

En local da igual —no hay servicio que dejar sin atender— pero conviene usar la misma
forma en los dos sitios, para que el comando que se ensaya sea el que se ejecuta.

`scripts/verificar-banco.mjs` ya está corregido: manda su consulta con `--command`.
Antes usaba `--file`, con lo que cada verificación contra la nube habría entrado por
la puerta de escritura. Descubierto al reconstruir el incidente de **H-014**.

### En la nube

Los ejecuta el autor, por ADR-015. Los comandos son los mismos cambiando `--local`
por `--remote` y, para el entorno de pruebas, el nombre de la base:

```
# Pruebas primero, siempre
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --file=d1/migraciones/001-banco-de-preguntas.sql
npm run datos:verificar-banco -- --base=examen-td-js-pruebas --remote --env preview

# Y sólo después producción
npx wrangler d1 execute examen-td-js-produccion --remote --file=d1/migraciones/001-banco-de-preguntas.sql
npm run datos:verificar-banco -- --remote
```

**`--env preview` hace falta en local, y no hace falta en remoto.** La diferencia es
real y conviene entenderla, porque de confundirla salió un error de esta misma
página.

- **En local**, wrangler resuelve la base **sólo** desde `wrangler.toml`, y
  `examen-td-js-pruebas` está declarada bajo `[[env.preview.d1_databases]]`. Sin
  `--env preview` responde `Couldn't find a D1 DB with the name or binding
  'examen-td-js-pruebas' in your wrangler.toml file`, aunque la base local exista.
- **En remoto**, si el nombre no está en el bloque de entorno cargado, wrangler lo
  **busca por nombre en la cuenta** con `GET /accounts/<id>/d1/database/<nombre>` y
  la encuentra igual. El argumento sobra. Ver **H-015**.

> **Corrección · 2026-09-04.** Esta página llegó a decir que `--env preview` «no es
> opcional para la base de pruebas», y que su ausencia en las líneas remotas era un
> defecto. **No lo era.** La comprobación que respaldaba esa afirmación se hizo
> contra la base **local**, donde sí falla, y se generalizó al caso remoto sin
> probarlo; el autor ejecutó el ensayo remoto y las órdenes funcionaron sin el
> argumento. Se deja escrito en vez de borrado, porque el error de método —probar en
> local y concluir sobre remoto— es más útil recordarlo que taparlo. Los comandos de
> más abajo lo llevan igualmente: no estorba, deja explícito contra qué entorno se
> trabaja, y es obligatorio si algún día se corre lo mismo en local.

Fíjate también en que la verificación va **después de cada base**, no una sola vez
al final. Si se corre sólo al final, un fallo en pruebas queda tapado por el
resultado de producción.

**Antes de tocar producción, respaldo.** El procedimiento está en
`respaldo-y-restauracion.md`, y la migración no lo sustituye: es repetible, pero
repetible no es reversible.

**`PERMITIR_REMOTO=1` hace falta para `npm run datos:verificar-banco -- --remote`.**
El envoltorio se niega a hablar con la nube salvo que se le pida a propósito: es la
capa 3 de la barrera de ADR-015, puesta tras H-014. Los `npx wrangler` directos no la
tienen —los escribe y los ejecuta el autor a conciencia—, pero el envoltorio sí,
porque es el camino documentado y por tanto el que se ejecuta por inercia.

### Ensayo completo sobre la base de pruebas en la nube

Sirve para ver los tres veredictos en el escenario real, que es donde importan: el
salto de local a remoto es justo donde falló H-014. **Sólo sobre pruebas.** Todo
lleva `--env preview`.

```powershell
# 0 · el permiso explícito, una vez por terminal
$env:PERMITIR_REMOTO=1

# 1 · esquema y datos de ejemplo (aquí --file es correcto: se va a escribir)
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --file=d1/migraciones/001-banco-de-preguntas.sql
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --file=d1/ejemplo-banco.sql

# 2 · conteos, con --command porque sólo lee
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --command="SELECT (SELECT COUNT(*) FROM modulo) modulos, (SELECT COUNT(*) FROM pregunta) preguntas, (SELECT COUNT(*) FROM pregunta WHERE estado='activa') activas, (SELECT COUNT(*) FROM alternativa) alternativas;"

# 3 · VEREDICTO 1: BANCO VERIFICADO, código 0
npm run datos:verificar-banco -- --base=examen-td-js-pruebas --remote --env preview

# 4 · romper tres cosas de tipos distintos
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --command="DELETE FROM alternativa WHERE id = 40;"
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --command="UPDATE pregunta SET justificacion = '' WHERE id = 3;"
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --command="UPDATE pregunta SET estado = 'borrador' WHERE modulo = 8 AND estado = 'activa';"

# 5 · VEREDICTO 2: BANCO CON PROBLEMAS, 4 filas descritas, código 1
npm run datos:verificar-banco -- --base=examen-td-js-pruebas --remote --env preview

# 6 · VEREDICTO 3, forma A: un nombre de base que no existe en la cuenta.
#     Hace falta la segunda variable: el envoltorio rechaza por su cuenta cualquier
#     --base que no esté declarada en wrangler.toml (H-015), y este nombre no lo está
#     a propósito. Es el único caso legítimo para esa salida.
$env:PERMITIR_BASE_NO_DECLARADA=1
npm run datos:verificar-banco -- --base=examen-td-js-no-existe-h013 --remote
Remove-Item Env:\PERMITIR_BASE_NO_DECLARADA
```

Si te olvidas de esa variable, el veredicto es `BASE NO DECLARADA *** H-015 ***`,
código 2, con las bases declaradas listadas. También es un no-veredicto correcto —no
se comprobó nada— pero no es el que buscas aquí: ese se detiene **antes** de salir del
equipo, y la forma A quiere que el 404 lo dé la cuenta.

El **veredicto 3, forma B** —la más completa— va junto con la limpieza, en la sección
siguiente: se vacía la base y se verifica antes de repoblarla.

> **Corrección · 2026-09-04.** El paso 6 decía antes «se omite `--env preview` a
> propósito», y **no funciona**: contra la nube, wrangler encuentra
> `examen-td-js-pruebas` por su nombre en la cuenta aunque no esté en el bloque de
> entorno cargado, así que corre igual y devuelve `BANCO CON PROBLEMAS`, código 1. El
> autor lo ejecutó y salió exactamente igual que el paso 5. La prueba que respaldaba
> ese paso se había hecho en **local**, donde omitir el argumento sí falla porque
> allá no hay cuenta a la que preguntar. Es la misma confusión que la corrección de
> más arriba, y de ahí salió **H-015**.

Qué debe salir en cada paso:

| Paso | Qué debes ver |
|---|---|
| 1 | `10 commands executed successfully.` y luego `3 commands executed successfully.` |
| 2 | `modulos 7 · preguntas 10 · activas 8 · alternativas 40` |
| 3 | `BANCO VERIFICADO`, código **0** |
| 5 | `BANCO CON PROBLEMAS *** 4 ***`, con las cuatro comprobaciones nombradas: `activa sin justificacion`, `alternativas distintas de cuatro`, `modulo sin preguntas activas`, `sin ninguna alternativa correcta`. Código **1** |
| 6 | `NO SE PUDO VERIFICAR`, con `Couldn't find a D1 DB with name or binding 'examen-td-js-no-existe-h013' in your config or the API`. Código **2** |

El paso 6 es el que más conviene mirar. Falla **en la cuenta**, no en el archivo de
configuración: wrangler se autentica, pregunta por ese nombre, recibe un 404 y se
detiene. Es el veredicto que antes de H-013 salía como `BANCO CON PROBLEMAS`, y la
diferencia entre un guardián que sirve y uno que no.

### Dejar pruebas en un estado conocido, y el veredicto 3 en su forma completa

Los datos de ejemplo quedaron rotos a propósito. Se tira todo y se rehace, que es más
corto y más fiable que deshacer los tres cambios. Y entre medio cabe la mejor prueba
del tercer veredicto, que es una base **real y alcanzable** cuya consulta falla:

> ## ⛔ El comando `a` es el más peligroso de este proyecto
>
> Hace `DROP` de cinco tablas y de `prueba_tuberia` en una sola línea, contra una
> base **remota**, sin confirmación y sin vuelta atrás.
>
> **Y el nombre de la base es lo único que decide dónde cae.** Por **H-015**, wrangler
> no usa `wrangler.toml` como límite en remoto: busca el nombre en la cuenta y lo
> encuentra. Si escribes `produccion` donde dice `pruebas`, **nada te detiene**. No
> hay configuración que te salve, no hay confirmación que te pregunte, y el banco de
> preguntas del sitio deja de existir.
>
> **Antes de ejecutarlo, confirma contra qué base estás apuntando:**
>
> ```powershell
> npx wrangler d1 info examen-td-js-pruebas --env preview
> ```
>
> Es de sólo lectura. Comprueba que el `uuid` que imprime sea
> **`c01df3c9-c2a1-4379-ab2e-249e933cece4`**, que es el de pruebas según
> `wrangler.toml`. Si sale `cff1686b-3b24-4892-9a10-4306684e0127`, **estás apuntando a
> producción: detente.** Comparar el uuid es la única red que existe, porque el
> nombre no lo es.
>
> Y si lo que vas a tocar fuera producción alguna vez: el respaldo de
> `respaldo-y-restauracion.md` va **antes**, no después.

```powershell
# a · vaciar la base de pruebas — LEE EL AVISO DE ARRIBA ANTES DE PEGAR ESTO
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --command="DROP VIEW IF EXISTS pregunta_activa; DROP TABLE IF EXISTS alternativa; DROP TABLE IF EXISTS pregunta; DROP TABLE IF EXISTS modulo; DROP TABLE IF EXISTS migracion; DROP TABLE IF EXISTS prueba_tuberia;"

# b · VEREDICTO 3, forma B: la base existe, se alcanza, y la consulta no puede correr
npm run datos:verificar-banco -- --base=examen-td-js-pruebas --remote --env preview

# c · repoblar y dejarla como estaba
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --file=d1/migraciones/001-banco-de-preguntas.sql
npx wrangler d1 execute examen-td-js-pruebas --remote --env preview --file=d1/ejemplo-banco.sql
npm run datos:verificar-banco -- --base=examen-td-js-pruebas --remote --env preview
```

| Paso | Qué debes ver |
|---|---|
| a | `6 commands executed successfully.` |
| b | `NO SE PUDO VERIFICAR`, con `no such table: modulo`. Código **2** |
| c | `10` y `3 commands executed successfully.`, y luego `BANCO VERIFICADO`, código **0** |

**El paso b es la prueba que más vale de las dos.** La forma A falla al resolver el
nombre, antes de tocar ninguna base; la forma B se autentica, llega a la base de
pruebas de verdad, ejecuta la consulta contra ella y **es D1 quien responde el
error**. Es el camino completo, y es donde el envoltorio tiene que distinguir «no
pude preguntar» de «el banco falla». Que responda `NO SE PUDO VERIFICAR` sobre una
base vacía —y no `BANCO VERIFICADO`, que sería lo cómodo y lo falso— es exactamente
lo que H-013 vino a arreglar.

Una tercera forma, quitar wrangler de `node_modules`, **no sirve para esto**: falla
antes de salir del equipo, así que no prueba nada del camino remoto.

**Sobre por qué esos `DROP` no están versionados, y la incoherencia que hubo.** Se
argumentó que un `.sql` con esos `DROP` es un arma cargada que un día alguien apunta a
producción cambiando una palabra — y acto seguido se entregó la misma línea para
copiar y pegar, sin más aviso que un párrafo en otra sección. **La incoherencia era
real y la señaló el autor.** No versionarlo reduce el riesgo de que se ejecute por
inercia desde un `npm run`, pero no reduce en nada el riesgo de teclear mal el nombre,
que es el que de verdad importa. De ahí el aviso pegado al comando y la comprobación
del uuid con `d1 info`, que es lo único que ataca ese riesgo. Si algún día se
versiona, que sea con una decisión escrita.

De paso retira `prueba_tuberia`, que quedó de las iteraciones 12 y 13 y estaba anotada
para borrarse. **Ejecutar el paso `a` salda esa deuda en la base de pruebas. En
producción sigue pendiente**, y le toca a la iteración 24 junto con la creación del
esquema.

Si en vez de repoblarla prefieres dejarla vacía, corre sólo el primer comando: la
verificación dirá entonces `NO SE PUDO VERIFICAR` con `no such table: modulo`, que es
correcto —no hay banco que mirar— y no un aprobado.

### El ensayo se ejecutó: lo que salió, el 2026-09-05

No es un procedimiento sobre el papel. El autor lo recorrió entero contra la base de
pruebas en la nube y salió como está escrito arriba:

| Paso | Lo que se vio |
|---|---|
| Forma A del veredicto 3 | `NO SE PUDO VERIFICAR`, código **2**, con el 404 de la cuenta: «Couldn't find a D1 DB with name or binding 'examen-td-js-no-existe-h013' in your config or the API» |
| `d1 info` antes del vaciado | uuid `c01df3c9-…`. Confirmado que apuntaba a **pruebas** antes de ejecutar los `DROP` |
| a · vaciado | `6 commands executed successfully.` |
| b · Forma B del veredicto 3 | `NO SE PUDO VERIFICAR`, código **2**, con el error de D1: «no such table: modulo: SQLITE_ERROR [code: 7500]». **Sobre una base vacía no dijo `BANCO VERIFICADO`**, que era el riesgo |
| c · repoblado | `10` y `3 commands executed successfully.`, y `BANCO VERIFICADO`, código **0** |

Dos cosas que este ensayo dejó zanjadas:

- **`prueba_tuberia` ya no está en la base de pruebas.** La retiró el paso `a`. **En
  producción sigue ahí**, y conviene saber que **la migración 001 no la borra**: el
  `.sql` no la menciona. Aplicar el esquema en producción no salda esa deuda; hay que
  escribir el `DROP` a mano, con la comprobación de uuid de más arriba.
- **El aviso del comando `a` funcionó como debía.** La comprobación del uuid con
  `d1 info` se hizo antes de destruir nada, y confirmó el destino. Es la única red que
  existe contra el error de tecleo del nombre (H-015), y por eso está pegada al
  comando y no en otra sección.

Y una que conviene esperar: **wrangler se cayó al terminar en dos de las tres
corridas**, con el `Assertion failed` de Windows. No afectó a ningún veredicto. Es
H-016, no es de este proyecto, y va a seguir saliendo.
