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
| `no such table: modulo` | La base existe pero está vacía: falta correr la migración |
| `No encontre wrangler en node_modules` | Falta `npm install` |
| `Una fila … no trae las columnas que declara la consulta` | Cambió `d1/verificar-banco.sql` y no se actualizó la lista `COLUMNAS` en la cabecera del script |

En Windows, wrangler se cae al terminar —`Assertion failed … src\win\async.c, line
94`, un fallo suyo, no del proyecto— y devuelve `3221226505` en vez de un código
legible. Por eso el envoltorio no se fía sólo del código de salida y también
comprueba la forma de la respuesta.

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

Una advertencia sobre `--persist-to`, por si se usa para no tocar la base de
trabajo: la ruta que se le pase tiene que ser **corta**. Wrangler cuelga debajo de
ella `v3/d1/miniflare-D1DatabaseObject/<hash>.sqlite`, y en una carpeta temporal
de nombre largo se pasa del límite de ruta de Windows. El síntoma es
`SQLITE_CANTOPEN`, que no menciona la longitud por ningún lado.

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

**`--env preview` no es opcional para la base de pruebas.** `examen-td-js-pruebas`
está declarada en `wrangler.toml` bajo `[[env.preview.d1_databases]]`, y wrangler
sólo mira el bloque del entorno seleccionado. Sin ese argumento responde
`Couldn't find a D1 DB with the name or binding 'examen-td-js-pruebas' in your
wrangler.toml file`, que suena a que la base no existe cuando lo que pasa es que se
está mirando el entorno equivocado. Comprobado contra la base local: sin `--env
preview` falla, con él responde. *Corregido el 2026-09-04: la versión anterior de
esta página omitía el argumento en las dos líneas de pruebas.*

Fíjate también en que la verificación va **después de cada base**, no una sola vez
al final. Si se corre sólo al final, un fallo en pruebas queda tapado por el
resultado de producción.

**Antes de tocar producción, respaldo.** El procedimiento está en
`respaldo-y-restauracion.md`, y la migración no lo sustituye: es repetible, pero
repetible no es reversible.
