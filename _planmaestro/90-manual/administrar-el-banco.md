# Cómo editar el banco de preguntas

Este manual es para corregir, agregar y retirar preguntas. No hace falta saber
programar ni entender cómo está hecho el sitio. Sí hace falta tener el proyecto
descargado en el computador, porque la edición ocurre ahí y en ningún otro lado
(ADR-025).

**Lo que vas a hacer siempre es lo mismo:** escribir un archivo con las preguntas,
revisarlo sin tocar nada, y recién entonces cargarlo.

---

## Antes que nada: el archivo no es el banco

Esto es lo que más confunde, así que va primero y con todas sus letras.

**El archivo con el que cargas preguntas es un encargo, no una copia del banco.** Se
carga una vez y deja de importar. Después de cargarlo puedes borrarlo y no pierdes
nada.

**Un archivo que ya cargaste NO dice lo que hay hoy en el banco.** Entre medio pudo
haber correcciones que no pasaron por ese archivo. Si lo abres seis meses después
para saber cómo quedó una pregunta, te va a mentir con toda tranquilidad: te va a
mostrar el texto que tenía el día que lo escribiste.

**Dónde se consulta el estado real, entonces:**

| Quiero saber… | Dónde lo miro |
|---|---|
| Qué preguntas hay ahora mismo | La base. El comando está más abajo, en «Mirar qué hay en el banco» |
| Cómo se ve una pregunta en el sitio | El sitio, en `cuestionario.html` |
| Cómo estaba el banco en una fecha | El respaldo `d1/respaldo-banco.sql`, que sale de la base (ADR-014) |

La base es la única fuente de verdad. El archivo JSON no, el sitio tampoco, y la
copia de respaldo del sitio (`static/js/data/instantanea-banco.js`) menos todavía:
esa es una foto, y puede tener horas o días.

---

## Lo que necesitas una sola vez

Abre un terminal en la carpeta del proyecto y corre:

```
npm install
npm run datos:migrar
npm run datos:migrar-002
```

Los dos últimos preparan la base de tu computador. Si ya los corriste antes, el
segundo va a responder `duplicate column name: fecha_modificacion`, y eso está bien:
significa que ya estaba puesto. No rompe nada.

---

## Paso 1 · Escribir el encargo

Copia `d1/ejemplo-encargo.json` y edítalo. Un encargo se ve así:

```json
{
  "preguntas": [
    {
      "modulo": 3,
      "origen": "json_2026",
      "numero_origen": 41,
      "enunciado": "¿Qué devuelve typeof null?",
      "justificacion": "Es el error histórico de JavaScript: typeof null da 'object'.",
      "dificultad": "media",
      "orden_fijo": false,
      "estado": "activa",
      "alternativas": [
        { "letra": "a", "orden": 1, "texto": "null",      "es_correcta": false },
        { "letra": "b", "orden": 2, "texto": "object",    "es_correcta": true  },
        { "letra": "c", "orden": 3, "texto": "undefined", "es_correcta": false },
        { "letra": "d", "orden": 4, "texto": "number",    "es_correcta": false }
      ]
    }
  ]
}
```

Qué significa cada cosa:

| Campo | Qué poner |
|---|---|
| `modulo` | Un número del 2 al 8 |
| `origen` | `json_2026` o `js_2026`, según de qué banco venga |
| `numero_origen` | El número que tenía la pregunta en ese banco |
| `enunciado` | La pregunta. **No puede repetirse con ninguna otra del banco** |
| `justificacion` | Por qué la correcta es la correcta. **Obligatoria si el estado es `activa`** |
| `dificultad` | `baja`, `media` o `alta`. También puedes no ponerla |
| `orden_fijo` | `true` solo si las alternativas no se pueden barajar (por ejemplo, si una dice «todas las anteriores») |
| `estado` | `borrador` mientras la trabajas, `activa` cuando se publica, `retirada` para sacarla |
| `alternativas` | **Exactamente cuatro**, con las letras `a`, `b`, `c`, `d` y los órdenes 1, 2, 3, 4. **Exactamente una** con `es_correcta: true` |

Tres reglas que la herramienta te va a hacer cumplir, así que mejor saberlas antes:

- **Cuatro alternativas, ni tres ni cinco.**
- **Una sola correcta.** Ni cero ni dos.
- **Si la pregunta está activa, tiene que traer justificación.** En borrador o
  retirada puede faltar.

---

## Paso 2 · Revisar sin tocar nada

```
npm run banco:revisar -- mi-encargo.json
```

Esto **no escribe nada**. Te dice si el archivo tiene problemas, y te los dice
todos juntos, no de a uno. Si algo está mal se ve así:

```
NO SE APLICO  ***  2 pregunta(s) con problemas  ***

Nada de esto llego a la base: se revisa antes de escribir.

Pregunta 1 del archivo (modulo 6, json_2026 n.o 930):
  - una pregunta activa tiene que traer justificacion

Pregunta 2 del archivo (modulo 6, json_2026 n.o 931):
  - 2 alternativas marcadas como correctas
```

Arregla el archivo y vuelve a revisar hasta que diga `REVISADO`.

**Lo que revisar no puede ver:** si el enunciado choca con otro que ya está en el
banco. Eso solo lo sabe la base, y para saberlo hay que intentar escribir. Un
archivo que pasa la revisión todavía puede rebotar en el paso siguiente.

---

## Paso 3 · Cargar

Para preguntas **nuevas**:

```
npm run banco:insertar -- mi-encargo.json
```

Para corregir preguntas **que ya están**:

```
npm run banco:actualizar -- mi-encargo.json
```

Son dos comandos distintos a propósito. `insertar` nunca pisa una pregunta
existente: si choca con una, se detiene y te lo dice. Así, cargar dos veces el
mismo archivo por accidente no te sobrescribe nada.

Cuando sale bien:

```
HECHO
Operacion: insertar
Preguntas: 2
Total en la base: 10 -> 12
```

### Si sale mal, no queda nada a medias

**Es todo o nada.** Si una pregunta del archivo falla, no entra ninguna, ni
siquiera las que venían antes en la lista. La base queda exactamente como estaba.
No tienes que limpiar nada ni averiguar cuántas alcanzaron a entrar: no entró
ninguna.

Los rebotes más comunes:

| Lo que dice | Qué pasó |
|---|---|
| «Ya hay una pregunta en el banco con ese mismo enunciado» | Dos preguntas no pueden tener el mismo texto. Busca la que ya está |
| «Ese origen, modulo y numero ya estan cargados» | Este encargo ya se cargó antes. Si querías corregir, usa `banco:actualizar` |
| «Una pregunta trae dos alternativas con la misma letra» | Revisa las letras: van `a`, `b`, `c`, `d`, una vez cada una |
| «Una pregunta trae mas de una alternativa marcada como correcta» | Solo una puede llevar `es_correcta: true` |

Debajo del mensaje en castellano sale también lo que dijo la base, en inglés y con
su jerga. No es para ti: está ahí por si aparece un caso que la herramienta todavía
no sabe traducir.

---

## Corregir una pregunta que ya está

En el encargo, di **cuál** es. Hay dos formas y tienes que usar una sola:

```json
{ "id": 3, "enunciado": "...", ... }
```

o bien, si no sabes el id:

```json
{ "origen": "json_2026", "modulo": 3, "numero_origen": 41, "enunciado": "...", ... }
```

El resto del encargo va completo, con sus cuatro alternativas, aunque solo cambies
una coma del enunciado: la pregunta se reemplaza entera.

Si la pregunta no existe, la herramienta se detiene y te lo dice. **No la crea
por su cuenta**, y no se queda callada: una corrección que no encuentra a quién
corregir es un error, no un trabajo hecho.

---

## Mirar qué hay en el banco

Esto es lo que hay que usar cuando quieras saber el estado real, en vez de abrir un
archivo viejo.

```
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --local --command="SELECT id, modulo, estado, substr(enunciado,1,60) FROM pregunta ORDER BY id;"
```

Para ver una sola pregunta con todo y sus alternativas:

```
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --local --command="SELECT * FROM pregunta WHERE id = 3;"
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --local --command="SELECT letra, orden, texto, es_correcta FROM alternativa WHERE pregunta_id = 3 ORDER BY orden;"
```

---

## Lo que la herramienta hace sola y conviene que sepas

**Regenera la copia de respaldo del sitio.** Cada vez que cargas o corriges algo,
vuelve a escribir `static/js/data/instantanea-banco.js`, que es lo que el sitio le
muestra al estudiante cuando la base no responde. Va en el mismo acto porque si
fuera un paso aparte se olvidaría, y un respaldo desfasado no se nota hasta el día
que la base se cae, que es el peor día para descubrirlo.

**Y te avisa de que esa copia no es publicable.** Cuando trabajas contra tu
computador, la copia que se genera sale del banco de juguete, no del real. La
herramienta te lo dice cada vez:

```
OJO: esa instantanea salio de la base LOCAL, o sea del banco de juguete.
Sirve para probar; NO es la que se publica.
```

**Deja fecha de modificación.** Cada pregunta que corriges queda marcada con la
fecha y la hora. Las que no tocas quedan sin marca, y eso también significa algo:
que nadie las ha corregido desde que se cargaron.

---

## Lo que esta herramienta no hace

- **No escribe en el sitio publicado.** Todo lo de este manual ocurre contra la base
  de tu computador. Publicar es otra cosa, y está en
  [Publicación en Cloudflare Pages](publicacion-en-cloudflare-pages.md).
- **No borra preguntas.** Una pregunta no se borra nunca: se pone en estado
  `retirada`, con su motivo. El id se conserva para siempre (ADR-020).
- **No inventa contenido.** Si una justificación falta, te lo dice; no la rellena.

---

## El procedimiento completo, de la corrección a la publicación

> ## ⚠️ NO RECORRIDO
>
> **Este bloque está escrito y nadie lo ha caminado entero.** Sus cuatro primeros
> pasos sí están comprobados, uno por uno, contra la base local. El último tramo
> —los pasos 5 y 6— toca **producción**, y producción no tiene ni esquema ni banco
> hasta la iteración 24. Se camina allá, y hasta entonces esto es una hipótesis con
> formato de lista.
>
> Está escrito igual porque ADR-023 lo exige en un solo bloque: si la exportación
> del respaldo y la regeneración de la copia viven en dos procedimientos distintos,
> uno de los dos se va a quedar atrás sin que nadie lo note, y va a ser la copia,
> porque el respaldo duele de forma ruidosa y la copia de forma muda.

Este es el procedimiento que junta editar, respaldar, regenerar y publicar
(ADR-023 y ADR-014). Los pasos marcados **(autor)** los ejecuta Felipe Cuevas en su
terminal: tocan la cuenta de Cloudflare, y por ADR-015 nadie más los corre.

1. **Corregir contra la base local.** Los pasos 1 a 3 de este manual.
   ✅ *Comprobado.*

2. **Mirar el resultado en el sitio local.** `npm run datos:dev` y abrir
   `cuestionario.html`. El cambio tiene que verse sin haber publicado nada.
   ✅ *Comprobado.*

3. **Aplicar el mismo encargo contra la nube. (autor)**
   ```
   $env:PERMITIR_REMOTO=1
   node scripts/administrar-banco.mjs actualizar mi-encargo.json --base=examen-td-js-produccion --remote
   ```
   Antes de correrlo, confirmar el uuid que la herramienta anuncia: producción es
   `cff1686b-3b24-4892-9a10-4306684e0127`. **Sin ese cotejo, el nombre tecleado es
   lo único que decide dónde cae el comando (H-015).**
   ⚠️ *No recorrido: producción está vacía hasta la iteración 24.*

4. **Respaldo e instantánea, en un solo paso. (autor)** ADR-023 y ADR-014.
   ```
   $env:PERMITIR_REMOTO=1
   npm run datos:publicar -- --base=examen-td-js-produccion --remote
   ```
   **Este paso reemplazó a dos.** Hasta el 2026-09-09 eran dos comandos sueltos —una
   exportación y una regeneración— con un recordatorio impreso entre medio, y nada
   ataba las dos mitades. ADR-023 pedía «un solo paso produce las dos cosas, o no
   produce ninguna»; ahora lo es.

   Las dos mitades se preparan en archivos temporales y **sólo se instalan si las dos
   salieron bien**. Si algo falla, `d1/respaldo-banco.sql` y
   `static/js/data/instantanea-banco.js` quedan exactamente como estaban, y el guion
   lo demuestra imprimiendo sus huellas antes y después.

   Comprueba tres cosas antes de instalar nada: que el respaldo **tenga banco dentro**
   —tabla `pregunta`, tabla `alternativa`, al menos una fila—, que el sello diga
   `"entorno": "nube"`, y que la instantánea no publique más preguntas de las que el
   respaldo contiene.
   ✅ *Provocados sus cuatro rechazos contra la base local el 2026-09-09, comprobando
   en los cuatro que ninguno de los dos archivos se tocó.*
   ⚠️ *No recorrido contra producción.*

5. **Commitear los dos archivos generados y publicar. (autor)**
   `d1/respaldo-banco.sql` y `static/js/data/instantanea-banco.js` van en el mismo
   commit: son las dos copias del mismo estado, y separarlas es cómo se desincronizan.
   ⚠️ *No recorrido.*

> ### Por qué este bloque dejó de ser una lista de buenas intenciones
>
> *Anotado el 2026-09-09.* Los pasos 4 y 5 de la versión anterior pedían al lector que
> se acordara de correr dos comandos seguidos. **El fallo que eso permite ya había
> ocurrido, y llevaba seis días sin que nadie lo viera:** `d1/respaldo-banco.sql`
> contenía 527 bytes de `prueba_tuberia` —la tabla de ensayo de la iteración 12— y
> **ninguna pregunta**. El archivo que ADR-014 llama «el respaldo del banco» no tenía
> banco dentro.
>
> No se descubrió por el procedimiento: se descubrió abriendo el archivo. Por eso el
> paso único no sólo junta las dos mitades, sino que **mira lo que exportó** antes de
> instalarlo. Un archivo que existe no es un respaldo.

**Lo que no vale:** dar este bloque por comprobado porque esté escrito. Un
procedimiento que nadie ha recorrido entero es una hipótesis con formato de lista, y
esta es exactamente la ADR que se advirtió a sí misma que quedaría incumplida sin
que nadie lo notara.
