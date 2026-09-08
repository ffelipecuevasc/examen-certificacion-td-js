# Iteración 24 · Migración del contenido y ampliación del banco

**Épica:** 20 · Persistencia de preguntas
**Estado:** ⚪ No iniciada
**Depende de:** iteración 23

## Objetivo

Llevar las 105 preguntas actuales a D1 sin perder información, ampliar el banco
hasta unas 300 y dotar a cada pregunta de su justificación.

## Contexto

El banco de origen tiene un sesgo conocido: en las 105 preguntas actuales, cerca de
la mitad de las respuestas correctas ocupan la segunda posición (ver H-004). El
barajado lo neutraliza en pantalla, pero conviene no arrastrarlo al ampliar.

La justificación es la carencia pedagógica más grande del producto: hoy el
estudiante sabe que falló, pero no por qué. Redactarlas es trabajo de contenido y
corresponde al autor; Claude Code aporta el andamiaje, la validación y la detección
de las que falten.

## Tareas

- [ ] **Crear el esquema en las dos bases de la nube, pruebas y producción.** Viene
      de la iteración 21, que lo dejó probado en local y **no ejecutó su paso 5**: se
      trasladó aquí a propósito el 2026-09-04, porque crear el esquema en producción
      sin contenido que meterle no aporta nada y sí abre una ventana en la que la base
      publicada tiene tablas vacías. Va primero, antes de cualquier carga. Lo ejecuta
      el autor, por ADR-015; los comandos están en `90-manual/esquema-del-banco.md`.
      Dos cosas que ya costaron una vez: **pruebas antes que producción**, y
      `--env preview` es obligatorio para `examen-td-js-pruebas`, que sólo está
      declarada bajo `[[env.preview.d1_databases]]`. Arrastra consigo el borrado de
      `prueba_tuberia` en ambas bases, anotado desde la iteración 12.

      > **Aviso pegado a este paso, escrito el 2026-09-05. Aplicar el esquema NO borra
      > `prueba_tuberia`.** Comprobado: `d1/migraciones/001-banco-de-preguntas.sql` no
      > la menciona en ninguna línea. Correr la migración y dar la tabla por retirada
      > es el error que este aviso existe para evitar. Hace falta un `DROP` escrito a
      > mano, y **antes de escribirlo hay que confirmar contra qué base apunta**, con
      > `npx wrangler d1 info <base>`, comparando el uuid: pruebas es
      > `c01df3c9-c2a1-4379-ab2e-249e933cece4` y producción es
      > `cff1686b-3b24-4892-9a10-4306684e0127`. Por **H-015**, el nombre que se teclea
      > es lo único que decide dónde cae el comando —`wrangler.toml` no acota nada en
      > remoto— y el uuid es la única red que existe. Si lo que se toca es producción,
      > el respaldo de `90-manual/respaldo-y-restauracion.md` va antes, no después.

      > **Segundo aviso pegado a este paso, escrito el 2026-09-08. El orden importa, y
      > es invertible sin darse cuenta: la comprobación del modo degradado va ANTES de
      > aplicar el esquema en producción.** Hay dos formas de que producción esté
      > «vacía» y dan resultados opuestos. **Sin esquema**, `/api/preguntas` lanza
      > `no such table: pregunta_activa`, la capa lo convierte en `FALLO_CONSULTA` con
      > `usar_respaldo: true`, y el sitio cambia a la instantánea y muestra el aviso:
      > eso es la prueba del modo degradado de ADR-008. **Con esquema y tablas vacías**,
      > el extremo responde `200` con `datos: []` y `meta.vacio: true` —correcto, porque
      > «no hay datos» no es un error (`functions/api/_comun.js`)—, el sitio dice
      > «todavía sin contenido» y **no hay aviso de respaldo que ver**. Aplicar el
      > esquema primero cierra la ventana, y la única prueba real del modo degradado
      > sobre el sitio publicado se pierde hasta la próxima caída de verdad, que nadie
      > elige cuándo ocurre. Comprobado el 2026-09-08 provocando las dos formas contra
      > una base local recién creada, no razonando sobre el código.
      >
      > **Qué tiene que verse exactamente, para no confundir lo correcto con un fallo.**
      > Sobre el sitio publicado con producción sin esquema:
      >
      > | Dónde | Qué debe decir |
      > |---|---|
      > | `/api/estado` | `200` · `ok: true` · `enlace_d1: "presente"`. Responde porque solo corre `SELECT 1`; que esté vivo **no** contradice lo de abajo |
      > | `/api/preguntas` | `503` · `codigo: "FALLO_CONSULTA"` · `usar_respaldo: true`. Si dice `SIN_ENLACE`, no es una base vacía: es el enlace a D1 sin aplicar, y eso es un fallo de configuración |
      > | Registro del despliegue | `no such table: pregunta_activa`. El SQL se queda ahí y no viaja al navegador |
      > | Arriba del banco en `cuestionario.html` | El aviso de ADR-008: «Estás viendo una copia guardada del banco de preguntas», con la fecha del sello |
      > | El cuestionario | **8 preguntas dibujadas**, las del banco de juguete |
      > | Línea del pie | «copia guardada en el sitio (**8** preguntas). Sin conexión con el servidor.» |
      >
      > **Son 8, no 9.** La instantánea que se publicó primero traía 9 por la pregunta
      > intrusa de la herramienta de Antigravity; se reconstruyó el 2026-09-08 y el sello
      > quedó en 8. Ver la fila de la iteración 22 en el registro. **Un 9 en la página ya
      > no es lo esperado: es la señal de que se publicó la instantánea vieja.**
      >
      > **En la base de pruebas ya no está**: la retiró el vaciado del ensayo remoto
      > del 2026-09-05. Lo que queda pendiente es **sólo producción**.
      >
      > Y una corrección al párrafo de arriba, que se dejó escrita en vez de borrada:
      > dice que `--env preview` «es obligatorio» para `examen-td-js-pruebas`. **En
      > remoto no lo es**, y creerlo fue justamente lo que produjo H-015: wrangler
      > busca el nombre en la cuenta y encuentra la base igual sin ese argumento. En
      > local sí es obligatorio, porque allá resuelve sólo desde `wrangler.toml`. Se
      > sigue escribiendo siempre, por higiene y para que el comando diga a qué
      > entorno pertenece, pero **no protege de nada**: no lo trates como una barrera.

      > **Dependencia heredada de la iteración 22, escrita el 2026-09-05. Al terminar
      > la carga hay que generar la instantánea, y recién ahí se cierra un criterio
      > que la 22 no pudo cerrar.**
      >
      > El criterio es «existe la instantánea versionada y su contenido coincide con lo
      > que hay en D1», y viene aplazado desde la iteración 22. **No se aplazó porque
      > la prueba fallara: se aplazó porque todavía no hay nada que copiar.** ADR-023
      > manda generarla desde la base de la nube, y la base de producción está vacía
      > justamente porque este paso —aplicar el esquema— no se ha ejecutado. Aunque el
      > generador funcionara perfecto, la consulta caería con `no such table: modulo`.
      > Comprobado en la primera ejecución real contra la nube, que es lo que destapó
      > H-019: lo que wrangler dijo fue exactamente eso.
      >
      > De modo que el orden es: esquema → carga del banco → **generar la instantánea
      > desde producción** → commit del archivo generado. Con `npm run datos:instantanea`
      > y el modo remoto, que lo ejecuta el autor por ADR-015.
      >
      > **Y no vale generarla desde `examen-td-js-pruebas` como sustituto.** Sería una
      > copia del banco de pruebas presentada como el respaldo del banco real, con el
      > sello diciendo que viene de la nube, que es el fallo silencioso que ADR-023
      > existe para evitar. El generador se niega a escribirla desde cualquier base que
      > no sea la del enlace principal de `wrangler.toml`; para probar contra pruebas
      > está `--ensayo`, que lee, valida, informa y no escribe nada.
      >
      > Mientras esto no ocurra, lo que hay versionado sale de la base **local** —el
      > banco de juguete— y `npm run build` lo avisa en cada construcción.
- [ ] Migrar las 105 preguntas actuales a D1, conservando módulo, alternativas,
      respuesta correcta y marca de orden fijo.
- [ ] Verificar la migración comparando lo que hay en D1 contra los datos actuales:
      ninguna pregunta perdida, ninguna respuesta correcta desplazada.
- [ ] Informar cuántas preguntas quedan sin justificación, agrupadas por módulo.
- [ ] Informar la distribución de la posición de la respuesta correcta por módulo,
      para que el autor equilibre al redactar las nuevas.
- [ ] Detectar preguntas duplicadas o casi idénticas.
- [ ] Aplicar los retiros por solapamiento aprobados por el autor (ver la sección
      «Retiros por solapamiento» más abajo). Ninguna pregunta se retira sin esa
      aprobación escrita.
- [ ] Corregir la pregunta superviviente del par `m07#21 ↔ M7·8`: hoy tiene dos
      respuestas correctas.
- [ ] Acompañar la ampliación hasta ~300: validar cada lote que el autor cargue e
      informar los problemas encontrados.
- [ ] **Generar la instantánea desde producción al terminar la carga**, y commitear
      el archivo. Cierra el criterio que la iteración 22 dejó aplazado. Lo ejecuta el
      autor, por ADR-023 y ADR-015.

      > **Incumplimiento consciente de ADR-023, declarado el 2026-09-08 por Felipe
      > Cuevas. Este paso es el que lo subsana, y por eso queda escrito aquí.**
      >
      > ADR-023 exige que la instantánea se genere **desde la base de la nube**. La que
      > se publica hoy con la iteración 22 salió de la **base local**: su sello lo dice
      > sin ambigüedad —`"entorno": "local"`, `"base": "examen-td-js-produccion"`,
      > generada el 2026-09-08— y `npm run build` lo avisa en cada compilación.
      >
      > **Motivo:** producción está vacía hasta esta iteración. No hay nube desde la
      > cual generar, así que la alternativa a incumplir era no publicar, y se decidió
      > publicar. Es una decisión tomada, no un olvido y no un pendiente que alguien
      > vaya a descubrir después.
      >
      > **Alcance de lo que se acepta:** mientras dure, el respaldo que ve un estudiante
      > si la capa de datos cae es el **banco de juguete**, no el banco real. El aviso
      > de ADR-008 aparece igual y dice la verdad —«copia guardada», con su fecha—, así
      > que el estudiante no queda engañado, pero sí queda con un banco que no le sirve.
      >
      > **Se subsana aquí y solo aquí.** Hasta que este paso se ejecute y su archivo se
      > commitee, ADR-023 sigue incumplida. No se marca esta casilla con una instantánea
      > generada en local: sería repetir el incumplimiento y borrar el rastro de que
      > alguna vez lo fue.
- [ ] Comprobar el comportamiento del sitio con el banco completo, incluida la
      instantánea de respaldo, que ahora pesa bastante más.
- [ ] Retirar `static/js/data/cuestionario.js` y `scripts/build-cuestionario.py` una
      vez confirmada la migración, dejando constancia en la bitácora.

- [ ] **Publicar. Va la última, y eso es parte de la tarea.** Heredado de la iteración
      22, que se cerró con esta condición escrita: **`git push` a `main` dispara la
      construcción y publica solo** —está en `90-manual/publicacion-en-cloudflare-pages.md`—
      así que empujar **es** publicar, y `main` no se toca hasta llegar aquí.

      El motivo es concreto, no una precaución genérica: desde la iteración 22 el
      cuestionario se sirve de D1, y **producción no tiene banco hasta que esta
      iteración lo cargue**. Publicar antes deja el sitio en modo degradado —la
      instantánea, con su aviso amarillo— y hoy esa instantánea trae el banco de
      juguete. El estudiante vería ocho preguntas de ejemplo presentadas como una copia
      guardada, sin que nada esté roto y sin que nadie se entere.

      Antes de empujar, en este orden:

      1. Esquema aplicado en producción y banco cargado (los pasos de arriba).
      2. `npm run datos:verificar-banco` contra producción, en verde.
      3. **Instantánea regenerada desde producción** y commiteada. Su sello tiene que
         decir `"entorno": "nube"` y el nombre de la base publicada; mientras diga
         `local`, `npm run build` lo avisa en cada construcción.
      4. `d1/respaldo-banco.sql` exportado **en el mismo acto** que la instantánea
         (ADR-023): un solo paso produce las dos cosas, o no produce ninguna.
      5. `npm run verificar` terminando en `VERIFICADO`.

      Si algo de esto no está, no se empuja: se anota qué falta y se empuja después.


## Criterios de aceptación

- [ ] **Los dos bancos están en D1 y suman lo que deben sumar.** No es una
      migración que reemplaza sino una unión: las 105 preguntas de
      `static/js/data/cuestionario.js` más las 300 de los siete JSON, 405 en total.
      La comparación automática contra ambos orígenes no arroja diferencias:
      ninguna pregunta perdida, ninguna respuesta correcta desplazada, ninguna
      duplicada por haber cargado un origen dos veces. *Reescrito el 2026-09-04:
      el criterio original hablaba de migrar las 105 originales, y describía una
      migración que dejó de existir cuando el autor decidió que el banco nuevo
      suma en vez de reemplazar.*
- [ ] **La única pregunta con orden fijo conserva su marca.** Es la **posición 13
      del módulo 2**, sobre el comando de Git que crea una rama y cambia a ella, y
      su alternativa (d) dice «Ambas B y C son correctas». Es la única de las 105
      con `fijo: true` y la única alternativa de los dos bancos que se refiere a
      otras por su letra. *Comprobado con `npm run informe-banco` el 2026-09-04:
      el criterio original era exacto en las dos cosas, en la posición y en la
      descripción.*

      **Riesgo concreto de esta iteración:** esa marca vive **solo** en
      `static/js/data/cuestionario.js`. Los siete JSON nuevos no traen el campo.
      Si se retira ese archivo antes de rescatarla —y retirarlo es una tarea de
      esta misma iteración— la información se pierde sin que nada avise, y una
      pregunta cuyas alternativas se refieren entre sí pasa a barajarse. El
      rescate va antes del retiro, no después.

      Dato a favor, comprobado por el autor: en las 300 preguntas nuevas no hay
      ninguna alternativa que se refiera a otra por letra ni del tipo «todas las
      anteriores». Todas se pueden barajar.
- [ ] Existe un informe de cobertura de justificaciones por módulo.
- [ ] Existe un informe de distribución de la respuesta correcta por módulo.
- [ ] El detector de duplicados corre y su resultado está documentado.
- [ ] El banco supera las 250 preguntas válidas y ninguna válida carece de
      justificación.
- [ ] `cuestionario.html` funciona con el banco completo sin degradación perceptible.
- [ ] **Existe la instantánea versionada y su contenido coincide con lo que hay en
      D1.** Criterio **heredado de la iteración 22**, que no pudo cerrarlo porque la
      base de producción todavía no tenía esquema: no había nada que copiar.
- [ ] La instantánea con el banco completo se genera correctamente y su peso está
      medido y documentado.

## Retiros por solapamiento

*Aprobado por el autor el 2026-09-04, sobre la revisión de los 82 pares candidatos
que produjo `npm run informe-banco --todos`. **Aplicado el mismo día.***

**Se retira, no se reemplaza.** El banco quedó en **368 preguntas**: 285 del banco
nuevo y 83 del viejo, comprobado con `npm run informe-banco`. Los módulos quedan
disparejos —39/50/46/38/38/38/36 en el nuevo— y eso es aceptado a propósito:
cuadrar los números exigiría escribir 15 preguntas nuevas y no aporta nada al
reparto del simulacro.

**Nada se borró.** Las 37 preguntas retiradas están íntegras en
`_planmaestro/00_producto/cuestionarios/retiradas.json`, cada una con su origen, el
par del que salió y la razón del retiro. Se conservan por dos motivos: porque
**qué se hace con las preguntas retiradas es la decisión 3 de la iteración 21 y
todavía está abierta**, y porque una decisión editorial sobre 37 preguntas escritas
a mano merece poder revisarse.

**No se renumeró el banco nuevo.** El campo `numero` es el identificador con el que
todo el plan cita cada pregunta; renumerar rompería esas referencias en silencio.
La numeración queda con huecos legítimos, y `scripts/informe-banco.mjs` los lee
desde `retiradas.json` para distinguirlos de un hueco accidental.

`m0X#N` es la pregunta N de `modulo-0X.json`; `MX·N` es la posición N del módulo X
de `static/js/data/cuestionario.js`.

### Aprobados: 23 pares con razón concreta

| Par | Se retira | Por qué sobrevive la otra |
|---|---|---|
| m02#10 ↔ M2·2 | M2·2 | la nueva añade el ángulo de accesibilidad y el distractor `<div role="form">` |
| m02#15 ↔ M2·3 | M2·3 | las cuatro alternativas de la nueva son valores de `box-sizing` |
| m02#38 ↔ M2·14 | m02#38 | la nueva está inflada y sus distractores no son plausibles |
| m03#20 ↔ M3·8 | M3·8 | la correcta de la vieja es falsa: `do/while` sí evalúa la condición, solo que después |
| m04#6 ↔ M4·3 | m04#6 | la vieja compite contra pilares reales de POO |
| m04#24 ↔ M4·8 | m04#24 | la vieja incluye `stopImmediatePropagation()`, la confusión real |
| m04#33 ↔ M4·10 | m04#33 | la vieja evalúa un eslabón más: el problema y que las promesas lo resuelven |
| m04#46 ↔ M4·14 | m04#46 | la correcta de la vieja añade que `ok` queda en falso |
| m05#5 ↔ M5·4 | m05#5 | la vieja compite con cláusulas SQL que existen |
| m05#14 ↔ M5·8 | M5·8 | la nueva distingue el borrado fila a fila y registrado, y contrasta con `TRUNCATE` |
| m05#19 ↔ M5·7 | M5·7 | la nueva enumera los tres fenómenos y nombra el nivel Serializable |
| m05#25 ↔ M5·10 | m05#25 | la vieja nombra la integridad referencial y ofrece `PRIMARY KEY` |
| m06#9 ↔ M6·3 | M6·3 | la correcta de la nueva explica las dos mitades y nombra los callbacks |
| m06#23 ↔ M6·7 | m06#23 | la vieja evalúa el escapado automático y ofrece `{{{variable}}}` |
| m06#28 ↔ M6·10 | m06#28 | la vieja compite contra módulos que existen (`path`, `http`, `os`) |
| m07#1 ↔ M7·1 | M7·1 | la nueva sitúa la pregunta en `pg` con Node y nombra el costo de abrir conexiones |
| m07#37 ↔ M7·13 | m07#37 | la vieja nombra Sequelize y compite con los cuatro métodos reales |
| m08#4 ↔ M8·3 | m08#4 | la nueva nombra HATEOAS en el enunciado y luego pide su definición |
| m08#11 ↔ M8·7 | m08#11 | la correcta de la nueva son dos respuestas en una |
| m08#13 ↔ M8·6 | M8·6 | la vieja dice que 4xx indica «errores de sintaxis», que es falso |
| m08#15 ↔ M8·5 | M8·5 | la nueva evalúa además la idempotencia |
| m08#21 ↔ M8·9 | m08#21 | la vieja compite contra paquetes de Express que existen |
| m08#32 ↔ M8·12 | m08#32 | la vieja ofrece «Header, Body y Footer», el casi-acierto que separa al que sabe |

### Aprobado: el cuarteto de atomicidad

`m07#22`, `m05#17`, `M5·1` y `M7·10` preguntan las cuatro lo mismo —qué propiedad
ACID es la atomicidad— con las mismas cuatro alternativas. **No es un problema de
clasificación:** cada banco, por su cuenta, puso una en el módulo 5 y otra en el 7.
Que el detector las emparejara cruzadas es un accidente del umbral de parecido.

**Queda `m05#17`, en el módulo 5.** Se retiran `m07#22`, `M5·1` y `M7·10`. `m05#17`
describe el caso de fallo concreto en vez de repetir la definición de manual, y el
módulo 5 es su sitio porque ninguna de las dos del módulo 7 pregunta nada específico
de Node ni de PostgreSQL. Lo transaccional propio del módulo 7 ya lo cubre el par
`BEGIN`.

### Aprobado: 11 empates, resueltos por el autor

Las dos preguntas eran equivalentes en calidad. El autor las revisó una por una y
**en las once se quedó con la nueva**, por consistencia de formato. Se retiraron
las once viejas:

`M3·1` · `M3·2` · `M3·14` · `M5·14` · `M7·3` · `M7·8` · `M7·12` · `M8·1` ·
`M8·4` · `M8·8` · `M8·11`

Dos de esos empates dejaron cola:

- **`m08#24 ↔ M8·11`.** Al retirarse `M8·11`, el par hermano `m08#23 ↔ M8·11` de
  la iteración 41 desapareció: esa lista bajó de once a diez.
- **`m07#21 ↔ M7·8`.** Sobrevivió `m07#21`, y arrastraba un error de contenido:
  `START TRANSACTION` abre un bloque transaccional en PostgreSQL igual que `BEGIN`,
  así que la pregunta tenía dos respuestas correctas. **Corregido:** la alternativa
  (a) pasó a `SET TRANSACTION`, que existe, se parece y no abre nada —fija las
  características de la transacción en curso—. `INIT` y `OPEN` se dejaron como
  estaban, por ADR-017. Un ítem con dos respuestas correctas es un error y se
  corrige; un distractor flojo no.

### El banco viejo se editó a mano, y no había alternativa

`static/js/data/cuestionario.js` es un archivo generado, y la regla del proyecto
dice que los generados no se editan a mano sino a través de su generador. Aquí no
se pudo cumplir: `scripts/build-cuestionario.py` lee su entrada de
`/mnt/user-data/uploads`, una carpeta que **no existe en este equipo** —era el
directorio de subida de una sesión de Claude web—. Los markdown de origen no están
en el repositorio, así que el generador no se puede ejecutar y el `.js` es hoy la
única copia del banco viejo.

Se editó el `.js` directamente, respetando su formato exacto (misma cabecera, mismo
`json.dumps` con `indent=2`), y el archivo está versionado, así que el estado
anterior se recupera del historial. Esta iteración retira de todos modos el `.js` y
el `.py` una vez migrado el banco, con lo que el problema se cierra solo.

### El límite de todo lo anterior

Los 82 pares salieron de **parecido de redacción**, no de entender el contenido. Dos
preguntas sobre el mismo punto escritas con vocabulario distinto no están en la
lista y nadie las ha visto. **368 no significa «sin duplicados»**: significa «sin los
duplicados que el parecido de redacción alcanzó a detectar».

## Notas de la iteración

_Pendiente._
