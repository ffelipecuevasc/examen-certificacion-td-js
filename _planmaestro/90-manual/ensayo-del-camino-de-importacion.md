# Ensayo del camino de importación · H-025

Procedimiento para el terminal del autor. Lo corre **él**, no Claude Code: toca la cuenta
de Cloudflare y eso es ADR-015.

Va contra **`examen-td-js-pruebas`**. Ningún comando de este documento nombra la base
publicada, y eso es una condición del ensayo, no una precaución: si el ensayo necesitara
tocarla, no sería el ensayo correcto.

---

## Ya se corrió, y este es el resultado

**2026-09-09 · LA IMPORTACIÓN DE D1 ES ATÓMICA.** Corrido por el autor contra
`examen-td-js-pruebas`, sobre una base que ya tenía 10 preguntas y 40 alternativas.

```
01-antes    fb6908910e0ac450   10 preguntas · 40 alternativas
carga       NO SE APLICO · UNIQUE constraint failed: pregunta.enunciado
            revento en la 256 de 260, con 255 sentencias ya emitidas
02-despues  fb6908910e0ac450
diff        >>> IDENTICAS · cero lineas
03-final    fb6908910e0ac450 · >>> DEVUELTA A COMO ESTABA
```

No hubo que limpiar nada porque no entró nada. No hizo falta sembrar: pruebas ya tenía
contenido.

**El todo o nada queda comprobado por los dos caminos**, y las seis cargas del banco van
con eso sabido en vez de supuesto. Ver H-025 en `00_producto/auditoria_tecnica.md`.

Este documento se conserva para poder **repetir** el ensayo: si algún día cambia la
versión de wrangler, el esquema de pruebas o la forma en que la herramienta escribe, la
respuesta de arriba deja de valer y hay que volver a provocarla.

---

## Qué comprueba

Si el camino de importación de D1 es **todo o nada**.

La atomicidad estaba comprobada contra la base local con 312 sentencias y el fallo puesto
en la 256, pero **la base local nunca toma el camino de importación**: `--local --file`
siempre es `db.batch()` contra miniflare, y la importación es exclusiva de las escrituras
contra la nube, sin umbral de tamaño.

## Qué no comprueba

Se hace contra pruebas, que es otra base con el mismo esquema. Si algún día pruebas y la
base publicada dejaran de compartir esquema, este ensayo dejaría de decir nada sobre la
segunda.

## Las tres cosas que hacen que valga

1. **La sentencia que choca va al final**, no al principio. Un choque en las primeras
   sentencias no demuestra atomicidad: no había nada aplicado que deshacer.
2. **El veredicto sale del contenido de la base**, comparando el volcado de antes con el
   de después. No del mensaje de wrangler, que es la capa que ya mintió una vez (H-024).
3. **Antes de armar el lote se mira qué hay en pruebas.** Si está vacía, el choque no
   puede ocurrir contra nada: hay que sembrarla, y eso es el paso 3.

Las tres están puestas en los guiones, no encargadas a la memoria de quien lee.
`armar-lote-de-ensayo.mjs` se **niega** si la base no tiene preguntas, y pone la mala al
final sin ofrecer alternativa. `volcar-contenido.mjs` se **niega** a leer si el uuid no
calza.

---

## Antes de empezar

**Terminal: Git Bash, desde la raíz del repositorio.** No PowerShell. Aquí se comparan
archivos con `diff` y se define una variable de entorno por comando, y las dos cosas son
de bash. Además está H-011: en este equipo git no vive en el `PATH` de PowerShell.

```bash
ENSAYO=/tmp/ensayo-h025
mkdir -p "$ENSAYO"
```

**No redirijas la salida de `administrar-banco.mjs` con `>`.** Para guardarla se usa
`--registro=<archivo>`, que la escribe el propio guion. El motivo es H-026 y está al final
de este documento.

### El uuid contra el que se coteja, leído del archivo y no de memoria

```bash
grep -A 3 'env.preview.d1_databases' wrangler.toml
```

Tiene que decir:

```
[[env.preview.d1_databases]]
binding = "BANCO"
database_name = "examen-td-js-pruebas"
database_id = "c01df3c9-c2a1-4379-ab2e-249e933cece4"
```

**Ese uuid es el testigo.** El nombre es lo que uno escribe; el uuid es contra lo que se
termina hablando. Contra la nube wrangler no usa `wrangler.toml` como límite: busca el
nombre en la cuenta y se queda con lo que encuentre (H-015). Comprobado en su código:
cuando el nombre no está en la configuración cargada, consulta la API de la cuenta por ese
nombre. Así que el uuid que devuelve **es el de la cuenta**, y por eso cotejarlo sirve.

**Cómo se coteja en cada paso:**

- Los pasos que usan `volcar-contenido.mjs` lo cotejan **solos**, antes de leer, y se
  plantan si no calza. No hay que mirar nada.
- Los pasos que llaman a wrangler directamente imprimen la línea
  `🌀 Executing on remote database examen-td-js-pruebas (c01df3c9-…)`. **Hay que leerla
  antes de seguir.**
- Los comandos con `--json` **no imprimen esa línea**: con `--json` wrangler baja su nivel
  de registro. Por eso el guion de volcado hace el cotejo en una consulta aparte, sin
  `--json`, antes de la lectura de verdad.

---

## Paso 1 · Qué hay hoy en la base de pruebas

```bash
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-pruebas --remote \
  --command="SELECT (SELECT COUNT(*) FROM migracion) AS migraciones, (SELECT COUNT(*) FROM modulo) AS modulos, (SELECT COUNT(*) FROM pregunta) AS preguntas, (SELECT COUNT(*) FROM alternativa) AS alternativas;"
```

Va sin `--json` a propósito: es el primer sitio donde aparece el uuid.

**Qué esperar.** La línea del uuid y una tabla de cuatro números.

- `migraciones` tiene que ser **2**. Si es 1, falta la `002`.
- `modulos` tiene que ser **7**. Si es 0, la migración `001` no llegó a correr entera: es
  ella la que llena esa tabla, y sin módulos el lote reventaría por llave foránea en su
  primera sentencia, que es el choque que este ensayo no puede usar.
- `preguntas` es el número que decide si hace falta el paso 3.

Si algo de esto no cuadra, **para acá**.

---

## Paso 2 · Volcado de cómo la encontraste

```bash
PERMITIR_REMOTO=1 node scripts/volcar-contenido.mjs \
  --base=examen-td-js-pruebas --remote --salida="$ENSAYO/00-encontrada.txt"
```

Este archivo dice cómo hay que dejarla al final. **No se pisa nunca.**

**Qué esperar.**

```
========================================================================
VOLCADO HECHO
========================================================================
Base:      examen-td-js-pruebas (nube)
uuid:      c01df3c9-c2a1-4379-ab2e-249e933cece4  ·  cotejado contra wrangler.toml antes de leer
Archivo:   /tmp/ensayo-h025/00-encontrada.txt

modulos:      7
preguntas:    <lo que haya>
alternativas: <lo que haya>

RESUMEN: <dieciséis caracteres>

codigo de salida: 0
```

Si responde `SIN VOLCADO`, **no es una base vacía**: es que no se pudo leer. El propio
veredicto lo dice con esas palabras.

---

## Paso 3 · Sembrar, sólo si el paso 1 dijo `preguntas = 0`

Sin una pregunta previa no hay contra qué chocar: el lote entraría entero, la salida se
vería bien y el ensayo no habría ensayado nada.

Se siembra con el banco de ejemplo que ya está versionado, que trae diez preguntas reales
y es repetible —va todo con `INSERT OR IGNORE`—:

```bash
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-pruebas --remote \
  --file=d1/ejemplo-banco.sql
```

**Qué esperar.** Como es un `--file` contra la nube, wrangler avisa y **pregunta**:

```
▲ [WARNING] ⚠️ This process may take some time, during which your D1 database will be unavailable to serve queries.
  Ok to proceed? (y/n)
```

Responde `y`. Después imprime la línea del uuid —**cotéjala**— y la salida del camino de
importación:

```
Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
🌀 Starting import...
🌀 Processed N queries.
🚣 Executed N queries in X.XXms (A rows read, B rows written)
```

Esa nota gris es la promesa del proveedor que este ensayo vino a comprobar.

**Si sembraste, apunta que lo hiciste.** El paso 10 tiene que quitar la siembra.

---

## Paso 4 · Volcado del punto de partida · SIEMPRE, hayas sembrado o no

```bash
PERMITIR_REMOTO=1 node scripts/volcar-contenido.mjs \
  --base=examen-td-js-pruebas --remote --salida="$ENSAYO/01-antes.txt"
```

**Este paso no es opcional y no depende del paso 3.** Es el punto de partida contra el que
se compara todo, y es la mitad del veredicto: sin él, el paso 9 no tiene contra qué restar.

Si sembraste, es distinto del `00-encontrada.txt` porque el contenido cambió. Si no
sembraste, va a dar el mismo resumen, y eso también sirve: dos lecturas seguidas que
coinciden dicen que el instrumento es estable.

*(En la primera versión de este documento este volcado estaba escrito dentro del bloque
del paso 3 y se leía como opcional. Lo era en apariencia y no en realidad; el autor se lo
saltó por eso. Corregido el 2026-09-09.)*

---

## Paso 5 · Armar el lote, con la mala al final

```bash
node scripts/armar-lote-de-ensayo.mjs \
  --volcado="$ENSAYO/01-antes.txt" --salida="$ENSAYO/lote.json"
```

No toca la red ni la base: lee el volcado y escribe un archivo.

**Qué esperar** (comprobado corriéndolo):

```
========================================================================
LOTE ARMADO
========================================================================
Preguntas: 52
Numeradas: 901 a 952  ·  esa es la marca para limpiar despues

Sentencias que emitira: 260
La que choca es la 256, o sea la pregunta 52 de 52.
```

Las 51 primeras llevan el prefijo `[ENSAYO H-025]` en el enunciado y van numeradas desde
901, así que **no pueden chocar por casualidad** ni por enunciado ni por la terna. El
choque tiene que ser uno solo y al final. Si el guion responde `NO SE ARMO`, léelo: está
diciendo que el ensayo no serviría.

---

## Paso 6 · Revisar sin escribir

```bash
node scripts/administrar-banco.mjs revisar "$ENSAYO/lote.json" \
  --base=examen-td-js-pruebas --registro="$ENSAYO/06-revisar.txt"
```

Sin permiso remoto y sin el flag de la nube: `revisar` valida y **no consulta la base**,
así que no toca la red.

**Qué esperar:** `REVISADO  ***  NO SE ESCRIBIO NADA  ***`, código 0, y el aviso de que
revisar no comprueba colisiones, que es justamente lo que vamos a provocar. El SQL
completo queda en el registro.

---

## Paso 7 · La carga que tiene que fallar

```bash
PERMITIR_REMOTO=1 node scripts/administrar-banco.mjs insertar "$ENSAYO/lote.json" \
  --base=examen-td-js-pruebas --remote --registro="$ENSAYO/07-carga.txt"
```

**`--registro`, no `>`.** Es el primer registro que va a existir de cómo se ve un fallo por
el camino de importación, y se quiere entero.

**Qué esperar** —esto ya se observó el 2026-09-09, así que no es predicción—:

```
NO SE APLICO  ***  la base rechazo el lote  ***
Ya hay una pregunta en el banco con ese mismo enunciado, palabra por palabra. ...
  X [ERROR] UNIQUE constraint failed: pregunta.enunciado: SQLITE_CONSTRAINT ...
codigo de salida: 1
```

El error de la nube **sí trae el texto de SQLite**, así que la traducción al castellano
funciona igual por este camino que por el local.

Si respondiera **`HECHO`**, el lote habría entrado entero, y eso sólo puede pasar si el
enunciado con el que chocamos ya no estaba. Sería un fallo del ensayo, no de D1.

**La frase «Todo o nada: no entró ninguna…» que imprime la herramienta no es evidencia.**
Está escrita en el guion. La evidencia son los dos pasos siguientes.

---

## Paso 8 · Volcado de después

```bash
PERMITIR_REMOTO=1 node scripts/volcar-contenido.mjs \
  --base=examen-td-js-pruebas --remote --salida="$ENSAYO/02-despues.txt"
```

---

## Paso 9 · El veredicto

```bash
diff "$ENSAYO/01-antes.txt" "$ENSAYO/02-despues.txt" && echo ">>> IDENTICAS"
```

Esto es lo único que decide.

| Lo que dice `diff` | Qué significa |
|---|---|
| `>>> IDENTICAS`, sin salida | **La importación es atómica.** Es lo que salió el 2026-09-09 |
| Aparecen líneas `>` | **La importación no es atómica.** Cambia la forma de cargar: hay que partir los lotes o preparar un deshacer antes de cada carga. Y hay que limpiar lo que quedó |

Para ver de un vistazo cuánto se coló, si se coló:

```bash
diff "$ENSAYO/01-antes.txt" "$ENSAYO/02-despues.txt" | grep -c '^>'
```

---

## Paso 10 · Dejar la base como la encontraste

**Si el paso 9 dijo `IDENTICAS` y no sembraste en el paso 3:** no hay nada que hacer. Salta
al cotejo final.

**Si quedaron filas del lote** (el paso 9 mostró líneas `>`):

```bash
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-pruebas --remote \
  --command="DELETE FROM alternativa WHERE pregunta_id IN (SELECT id FROM pregunta WHERE numero_origen >= 901); DELETE FROM pregunta WHERE numero_origen >= 901;"
```

Por eso el lote se numeró desde 901: es la marca que permite borrar exactamente lo del
ensayo sin tocar nada más.

**Si sembraste en el paso 3**, quita también la siembra. El banco de ejemplo usa los ids
1 a 10:

```bash
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-pruebas --remote \
  --command="DELETE FROM alternativa WHERE pregunta_id <= 10; DELETE FROM pregunta WHERE id <= 10;"
```

Los módulos **no se tocan**: no los pusimos nosotros, vienen de la migración `001`.

### El cotejo final, que es el que cierra

```bash
PERMITIR_REMOTO=1 node scripts/volcar-contenido.mjs \
  --base=examen-td-js-pruebas --remote --salida="$ENSAYO/03-final.txt"

diff "$ENSAYO/00-encontrada.txt" "$ENSAYO/03-final.txt" && echo ">>> DEVUELTA A COMO ESTABA"
```

Mismo resumen que el paso 2 = la base quedó como la encontraste. **Comprobado, no
prometido.**

---

## Por qué `--registro` y no `>` · H-026

Redirigir depende del terminal, y el terminal no es del proyecto.

En Git Bash sobre Windows, un `node` lanzado a través de **winpty** —el envoltorio que se
usa para que los programas interactivos se vean bien— se niega a correr si su salida no va
a un terminal. Responde `stdout is not a tty`, con código 1, y **no ejecuta nada**. El
archivo queda con una sola línea. Quien lo abra después puede leerlo como «la carga corrió
y dijo poco», que es lo peligroso: el fallo es ruidoso en pantalla y silencioso en el
archivo.

Ocurrió durante este ensayo, el 2026-09-09.

`--registro=<archivo>` lo esquiva por diseño: la salida la escribe el propio guion, y ya no
hay redirección que winpty pueda objetar. Además:

- El registro **empieza con una cabecera** —fecha y argumentos— y **termina con una línea
  de cierre** que nombra el veredicto. Un registro sin esa línea final está truncado, y eso
  se ve al abrirlo.
- Si el guion no llega a arrancar, el archivo **no existe**, que es un fallo mucho más
  ruidoso que un archivo con una línea.
- Si `--registro` apunta a algo que no se puede escribir, el guion **no hace nada**:
  responde `NO SE APLICO · no pude abrir el registro`. Quien pidió registro lo pidió para
  tener evidencia, y correr una carga sin la evidencia que se pidió es peor que no
  correrla.
