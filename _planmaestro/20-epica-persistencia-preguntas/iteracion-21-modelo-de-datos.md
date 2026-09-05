# Iteración 21 · Modelo de datos del banco

**Épica:** 20 · Persistencia de preguntas
**Estado:** 🔵 En curso · los siete criterios cumplidos con evidencia; el cierre formal lo hace el autor
**Depende de:** épica 10 cerrada

## Objetivo

Definir cómo se estructura el banco de preguntas en D1 y dejar el esquema creado,
antes de escribir el código que lo consume.

## Contexto

Hoy las preguntas están en `static/js/data/cuestionario.js` con esta forma: grupos
por módulo, y dentro de cada grupo preguntas con enunciado, cuatro alternativas,
índice de la correcta y una marca `fijo`. El esquema nuevo debe cubrir eso sin
pérdida, y además lo que se necesitará más adelante: justificación, dificultad y
estado de revisión.

## Lo que cambio antes de empezar

El archivo de esta iteración se escribió cuando el banco eran 105 preguntas en
`static/js/data/cuestionario.js`. Hoy existen además **300 preguntas nuevas** en
siete JSON, escritas a mano y sin solapamiento de enunciados con las anteriores.

**Decisión del autor, 2026-09-04: el banco nuevo suma, no reemplaza.** Publicada
como **ADR-016**. Descartar 105 preguntas ya escritas y probadas sería caro. La
consecuencia es que el esquema tiene que recibir dos orígenes con formas distintas,
y que hubo que revisar **solapamiento de contenido**, no solo enunciados idénticos:
dos preguntas distintas sobre exactamente lo mismo son un problema para el
simulacro.

Esa revisión ya ocurrió. De las 405 se retiraron 37 por solapamiento real, con el
detalle en la iteración 24: **el esquema tiene que recibir 368 preguntas**, 285 del
banco nuevo y 83 del viejo. Las 37 retiradas siguen existiendo en
`cuestionarios/retiradas.json`, y qué se hace con ellas es exactamente la decisión
3 de esta iteración.

## Decisiones a cerrar

Ninguna es obvia. Resuélvelas con argumentos y documéntalas.

1. **Cómo se modelan las alternativas.** Cuatro columnas en la tabla de preguntas,
   o una tabla aparte con una fila por alternativa. La segunda es más limpia en
   términos relacionales; la primera es más simple de consultar y de administrar a
   mano. El público del proyecto es un bootcamp que enseña bases de datos
   relacionales: el esquema es material didáctico además de infraestructura.
2. **Cómo se identifica la respuesta correcta.** Sin usar una posición fija, porque
   ADR-006 obliga a barajar.

   **Decisión del autor, 2026-09-04, que deja esta pregunta casi cerrada:** el sesgo
   de la respuesta correcta —la `b` se lleva el 41,7 % del banco nuevo y el 47,6 %
   del viejo— **se corrige barajando, sin tocar el contenido de las preguntas**.
   Reescribir 405 preguntas para equilibrar posiciones sería trabajo enorme con
   riesgo de introducir errores, y el barajado ya neutraliza el efecto en pantalla.

   De ahí se sigue lo que el esquema tiene que cumplir: **si se baraja, la
   respuesta correcta no puede identificarse por su posición**. Guardar «la
   correcta es la segunda» deja de significar nada en cuanto el orden cambia en
   cada carga. La correcta tiene que estar atada a la alternativa, no al lugar.

   **Con una excepción que el esquema también debe soportar:** la pregunta con
   `fijo = true` —posición 13 del módulo 2, cuya alternativa (d) dice «Ambas B y C
   son correctas»— **no se baraja**, y ahí la correcta sí depende del orden. Los
   dos casos conviven en la misma tabla, así que el modelo tiene que resolver los
   dos sin ramas especiales en el código del navegador.
3. **Qué se hace con las preguntas retiradas.** Borrarlas rompería cualquier
   referencia guardada; marcarlas como retiradas obliga a filtrar en cada consulta.
4. **Dónde viven el título y el ícono de cada módulo.** *Añadida por el autor el
   2026-09-04.* El banco viejo los trae por grupo y el nuevo solo trae el número,
   así que hoy viven en `static/js/data/`. Si el esquema no les hace sitio, se
   pierden al migrar sin que nada avise.

**Las cuatro quedaron cerradas el 2026-09-04**, con el detalle campo por campo en
`90-manual/esquema-del-banco.md`: ADR-018 (alternativas en tabla aparte), ADR-019
(la correcta es una bandera con índice único parcial), ADR-020 (las retiradas se
marcan y se ocultan tras una vista) y ADR-021 (los módulos son una tabla).

## Tareas

- [x] **Informe de hechos sobre los dos bancos, antes de diseñar nada.** Un script
      local lee los siete `_planmaestro/00_producto/cuestionarios/modulo-0N.json` y
      `static/js/data/cuestionario.js`, y reporta: si cada archivo se lee, cuántas
      preguntas hay por módulo y en total, huecos y repetidos en la numeración,
      campos de más y de menos, tipos inesperados, preguntas sin cuatro
      alternativas, correctas que apuntan a una letra inexistente, enunciados
      repetidos dentro y entre módulos, alternativas repetidas dentro de una
      pregunta, distribución de la letra correcta, cobertura de justificaciones, y
      candidatos a solapamiento de contenido entre los dos bancos. El esquema se
      diseña después del informe, no antes.
- [x] Revisar `static/js/data/cuestionario.js` y `scripts/build-cuestionario.py`, y
      resumir qué campos existen hoy.
- [x] Diseñar el esquema, cubriendo como mínimo: módulo, enunciado, alternativas,
      cuál es la correcta, justificación, orden fijo, dificultad y estado.
- [x] Resolver las decisiones anteriores y documentarlas como ADR. Fueron
      cuatro, no tres: el autor añadió dónde viven el título y el ícono del
      módulo. ADR-018, ADR-019, ADR-020 y ADR-021.
- [x] Escribir las migraciones que crean el esquema, versionadas en el repositorio.
- [x] Definir las restricciones que la propia base debe hacer cumplir: cuáles son
      responsabilidad del esquema y cuáles del código.
- [x] Definir los índices necesarios para las consultas previstas: banco completo
      por módulo, y selección aleatoria para el simulacro.
- [x] Cargar diez filas de ejemplo, incluyendo un caso de orden fijo.
- [x] Registrar los términos nuevos en `00_producto/glosario.md`.

## Criterios de aceptación

- [x] El esquema está documentado campo por campo, con tipo, obligatoriedad y
      ejemplo.
- [x] **El esquema cubre los dos orígenes sin pérdida de información.** No son
      cuatro campos: son dos formas distintas, y cada una trae algo que la otra no
      tiene. Del banco viejo (`static/js/data/cuestionario.js`): `modulo` como
      texto «Módulo N», `q`, `opciones` como lista de textos, `correcta` como
      **índice** 0-3, `fijo`, más el **título y el ícono del módulo** por grupo. Del
      banco nuevo (`cuestionarios/modulo-0N.json`): `modulo` como **entero**,
      `numero`, `enunciado`, `alternativas` como lista de `{letra, texto}`,
      `correcta` como **letra**. Ninguno de los dos trae justificación.

      Lo que hay que demostrar, campo por campo: que el identificador de módulo
      quedó unificado y **ningún módulo entra dos veces**; que el título y el ícono
      sobreviven aunque solo un origen los traiga; que la marca de orden fijo
      sobrevive aunque solo un origen la traiga; y que la correcta se identifica
      igual viniendo de un índice o de una letra. *Reescrito el 2026-09-04: el
      criterio original hablaba de «los cuatro campos que hoy existen», redactado
      cuando el banco nuevo no existía.*
- [x] Las migraciones corren sobre una base vacía y dejan el esquema listo.
- [x] Las migraciones están versionadas y son repetibles: correrlas dos veces no
      rompe nada.
- [x] Una fila que viole una restricción es rechazada por la base, y se demuestra
      intentando insertarla.
- [x] Las diez filas de ejemplo están cargadas y son consultables.
- [x] Las tres decisiones están publicadas como ADR, cada una con la alternativa
      descartada y su motivo.

## Notas de la iteración

### Recorrido del 2026-09-04: pasos 1 a 4

El autor ejecutó los pasos 1 a 4 contra la base D1 **local** y se detuvo antes del 5.
Lo que quedó comprobado:

- **La migración es repetible.** Aplicada dos veces: 10 sentencias las dos veces, sin
  error y sin duplicar nada.
- **Los conteos cuadran:** 7 módulos, 10 preguntas, 8 activas, 40 alternativas.
- **Las nueve restricciones rechazaron su inserción**, cada una con el mensaje
  previsto: `CHECK` de letra, `UNIQUE` de letra, `UNIQUE` de orden, `UNIQUE` de
  `pregunta_id` sobre la segunda correcta, llave foránea, `CHECK` de estado y motivo
  de retiro, `UNIQUE` de enunciado, `UNIQUE` de origen + módulo + número de origen, y
  `CHECK` de `es_correcta`. Se probaron **contra la base de pruebas en la nube**, no
  sólo en local. **El criterio de restricciones está cumplido con evidencia real.**

  Lo que falta ahí no es evidencia sino **reproducibilidad**: las nueve se
  escribieron a mano y no quedó ningún archivo en `d1/` que permita repetirlas. No
  caben en un solo `.sql` —la primera que falla aborta el resto—, así que hace falta
  un guion que las lance una por una y compruebe que **todas** fallaron. Anotado en
  el registro como «Sin asignar», y conviene no confundirlo con un criterio
  pendiente: es deuda de mantenimiento.

### Los criterios que dependen de la consulta de verificación quedan abiertos

`scripts/verificar-banco.mjs` estaba roto durante todo ese recorrido: daba
`BANCO CON PROBLEMAS *** 1 *** / undefined -> undefined` las tres veces que se
corrió —antes de romper nada, después de borrar una alternativa y después de
reinsertarla—, o sea el mismo veredicto para tres estados distintos de la base. Es
el hallazgo **H-013**, y está resuelto en la auditoría técnica, con el script
reescrito y sus tres veredictos provocados de verdad desde un clon limpio en
Windows.

Pero **el arreglo del script no cierra los criterios**. Lo que se probó el 2026-09-04
se probó con el guardián averiado y sobre una base que las propias pruebas
ensuciaron: el paso 4 borró una alternativa y la repuso a mano. Los criterios que se
apoyan en la consulta de verificación siguen **sin marcar**, y se cierran cuando el
autor repita el paso 4 **desde una base local reconstruida**, no antes. El
procedimiento de reconstrucción está en `90-manual/esquema-del-banco.md`, sección
«Devolver la base local a un estado conocido».

Ninguna casilla de «Criterios de aceptación» se tocó en esta pasada, a propósito.

**Ensayo remoto, 2026-09-04.** El autor lo ejecutó contra la base de pruebas en la
nube, que es el escenario donde importa: el salto de local a remoto es justo donde
falló H-014.

| Veredicto | Resultado |
|---|---|
| 1 · `BANCO VERIFICADO`, código 0 | ✅ Exacto. Carga previa de 10 y 3 sentencias, conteos 7 · 10 · 8 · 40 |
| 2 · `BANCO CON PROBLEMAS *** 4 ***`, código 1 | ✅ Exacto, con las cuatro comprobaciones descritas de verdad |
| 3 · `NO SE PUDO VERIFICAR`, código 2 | ❌ **No se provocó ese día.** El comando previsto corrió igual y devolvió lo mismo que el veredicto 2. **Provocado el 2026-09-05 en sus dos formas**: ver la sección «Cierre del ensayo remoto» al final de este archivo |

El tercero falló porque el procedimiento lo provocaba omitiendo `--env preview`, y eso
no produce ningún error contra la nube: ver **H-015**. Reescrito con dos formas que sí
lo provocan —un nombre de base inexistente en la cuenta, y la base de pruebas vaciada,
que es la más completa porque el error lo devuelve D1— y **queda pendiente de
ejecutarse**. Los criterios que dependen de la consulta de verificación siguen sin
cerrarse hasta entonces.

### El paso 5 no se ejecutó, y se traslada a la iteración 24

Aplicar la migración en las bases de la nube —pruebas y producción— **no ocurrió**.
Queda para la iteración 24, junto con la carga del banco, y así está anotado en el
registro. El motivo es que crear el esquema en producción sin contenido que meterle
no aporta nada y sí abre una ventana en la que la base publicada tiene tablas
vacías. Arrastra consigo el borrado de `prueba_tuberia` en ambas bases, que ya estaba
anotado para esta iteración.

Al escribir el procedimiento se creyó encontrar un defecto en el manual: que los
comandos para `examen-td-js-pruebas` omitían `--env preview`, y que sin ese argumento
wrangler no encuentra la base. **No era un defecto.** Eso ocurre en local, donde
wrangler resuelve sólo desde `wrangler.toml`; en remoto busca el nombre en la cuenta
y la encuentra igual. La comprobación se hizo en local y se generalizó a remoto sin
probarlo. El autor lo descubrió al ejecutar el ensayo remoto. Corregido en el manual
—dejando la corrección escrita, no borrada— y convertido en **H-015**, porque detrás
hay algo más grande que un argumento de más: `wrangler.toml` no delimita contra qué
base se escribe.

### Lo que se cruzó por el camino: H-014

Investigando H-013, Claude Code ejecutó un `wrangler --remote` contra la cuenta del
autor. ADR-015 lo prohíbe. El comando se autenticó, alcanzó la base de **producción**
por el extremo de importación y volvió con 200; no modificó nada porque era un
`SELECT` y allá no hay tablas, pero eso fue casualidad y no diseño. Quedó como
**H-014**, con la barrera técnica de cuatro capas ya implementada y sus siete estados
provocados.

Dos cosas de ese incidente afectan a esta iteración y no a la auditoría:

1. **`wrangler d1 execute --remote --file=` escribe por el extremo de importación**,
   no por el de consulta, y wrangler avisa de que la base puede quedar sin servir
   consultas mientras dura. Para leer se usa `--command`. `verificar-banco.mjs`
   usaba `--file`, así que se corrigió: cada verificación del autor contra la nube
   habría entrado por la puerta de escritura. La regla está en el manual.
2. **El paso 4 conviene repetirlo también contra la base de pruebas en la nube**, no
   sólo en local: el salto de local a remoto es exactamente donde falló H-014, y es
   el escenario donde los tres veredictos importan de verdad. El procedimiento
   completo, con lo que debe verse en cada paso y cómo dejar la base limpia después,
   está en `90-manual/esquema-del-banco.md`, sección «Ensayo completo sobre la base
   de pruebas en la nube».

### Cierre del ensayo remoto, 2026-09-05: el tercer veredicto en sus dos formas

El autor ejecutó las dos formas que quedaban pendientes, contra la base de pruebas
**en la nube**. Con esto los tres veredictos de `verificar-banco` quedan provocados
en el escenario donde importan, y **H-013 se cierra con evidencia remota**.

| Forma | Cómo se provocó | Veredicto | Código |
|---|---|---|---|
| A · el nombre no existe en la cuenta | `--base=examen-td-js-no-existe-h013`, con `PERMITIR_BASE_NO_DECLARADA=1` | `NO SE PUDO VERIFICAR`, con el 404 de la cuenta: «Couldn't find a D1 DB with name or binding 'examen-td-js-no-existe-h013' in your config or the API» | 2 |
| B · la base existe, se alcanza, y la consulta no puede correr | `DROP` de las cinco tablas y de `prueba_tuberia`, y verificar sobre la base vacía | `NO SE PUDO VERIFICAR`, con el error real de D1: «no such table: modulo: SQLITE_ERROR [code: 7500]» | 2 |

Las dos las ejecutó **el autor**, que es la única vía posible: ADR-015 impide a
Claude Code tocar la cuenta.

**La forma B es la que zanja el asunto.** Sobre una base vacía y alcanzable el
envoltorio podría haber dicho `BANCO VERIFICADO` —cero filas, cero problemas—, que es
justo la respuesta cómoda y falsa que H-013 vino a impedir. Dijo que no pudo
verificar, y el motivo se lo dio D1, no wrangler.

Alrededor de esas dos formas, el resto del procedimiento salió como estaba escrito:

- `d1 info` antes del vaciado: uuid `c01df3c9-…`, el de pruebas. La comprobación que
  el manual exige por H-015 —el nombre no delimita nada, el uuid sí— se hizo y
  confirmó el destino **antes** de destruir nada.
- Vaciado: `6 commands executed successfully.`
- Repoblado: `10` y luego `3 commands executed successfully.`, y `BANCO VERIFICADO`
  con código **0**.

Ese repoblado vale además como prueba del criterio de la base vacía: la migración
corrió sobre una base a la que se le acababan de tirar todas las tablas.

### Un fallo de wrangler en Windows que no es un problema del proyecto

El `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c` de
wrangler apareció en **dos de las tres corridas** del ensayo, y en una de ellas el
proceso devolvió `3221226505` en vez de un código legible. Es un fallo de wrangler al
terminar en Windows, ajeno a este proyecto, y va a seguir apareciendo.

**El guardián lo manejó bien porque no se fía sólo del código de salida**: interpreta
lo que wrangler dijo y comprueba la forma de la respuesta antes de creérsela, así que
un proceso que se cae al terminar no le cambia el veredicto. Es exactamente la razón
por la que se escribió así en H-013.

Queda registrado como **H-016** para que nadie lo confunda con un defecto del banco,
del esquema o de los guiones.

### Los siete criterios, uno por uno, con su evidencia

Se distingue lo verificado por el autor de lo verificado por Claude Code, porque no
son la misma cosa: **toda la evidencia remota es del autor, sin excepción**, y todo lo
que hizo Claude Code fue contra la base local.

| # | Criterio | Evidencia | Verificado por |
|---|---|---|---|
| 1 | Esquema documentado campo por campo | `90-manual/esquema-del-banco.md`: tres tablas y una vista, cada campo con Tipo · Obligatorio · Ejemplo · Notas | Claude Code, leyendo el documento |
| 2 | Cubre los dos orígenes sin pérdida | El desglose de abajo, consultando la base local | Claude Code, en local |
| 3 | Las migraciones corren sobre una base vacía | Paso `c` del ensayo remoto, sobre la base recién vaciada: `10 commands executed successfully.` y luego `3` | El autor, en la nube |
| 4 | Migraciones versionadas y repetibles | `d1/migraciones/001-banco-de-preguntas.sql` versionado. Aplicada dos veces en local (10 sentencias las dos veces) y dos veces en pruebas remotas —sobre base con contenido y sobre base vacía—, sin error ni duplicados | El autor, en local (2026-09-04) y en la nube |
| 5 | Una fila que viole una restricción es rechazada | Las nueve restricciones probadas contra la base de pruebas en la nube el 2026-09-04, cada una con su mensaje previsto. **Cumplido con evidencia real; lo que falta es reproducibilidad**, y eso es deuda, no criterio | El autor, en la nube |
| 6 | Las diez filas cargadas y consultables | Remoto: `modulos 7 · preguntas 10 · activas 8 · alternativas 40` y `BANCO VERIFICADO` código 0 tras el repoblado. Local, comprobado hoy: los mismos conteos, más `fijas 1` y `vista_activa 8` | El autor (remoto) y Claude Code (local) |
| 7 | Las decisiones publicadas como ADR | ADR-018, ADR-019, ADR-020 y ADR-021, cada una con su alternativa descartada y su motivo. **Fueron cuatro, no tres**: el autor añadió la de dónde viven título e ícono | Claude Code, leyendo `decisiones.md` |

**Criterio 2, campo por campo**, con la base local consultada hoy:

- *El identificador de módulo quedó unificado y ningún módulo entra dos veces.*
  `SELECT numero, titulo, icono FROM modulo` devuelve **siete filas**, del 2 al 8, sin
  repetidos. `numero` es la llave primaria, así que la base no admitiría un duplicado
  aunque la carga lo intentara. El banco viejo traía «Módulo N» como texto y el nuevo
  un entero: en la tabla hay un solo entero.
- *El título y el ícono sobreviven aunque solo un origen los traiga.* Viven en la
  tabla `modulo`, no en la pregunta: `Fundamentos de Bases de Datos Relacionales` ·
  `database` para el 5, y así los siete. Las preguntas del banco nuevo, que nunca los
  trajeron, los reciben igual por la llave foránea.
- *La marca de orden fijo sobrevive aunque solo un origen la traiga.* La pregunta
  `id = 8`, origen `js_2026`, número de origen 11, tiene `orden_fijo = 1`. Es la única
  de las diez, y es la del enunciado cuya alternativa (d) nombra a las otras.
- *La correcta se identifica igual viniendo de un índice o de una letra.* Con la misma
  consulta para las diez, sin mirar el origen:
  `SELECT letra FROM alternativa WHERE pregunta_id = ? AND es_correcta = 1`. Devuelve
  `a`, `b`, `b`, `b`, `c`, `b`, `c`, `d`, … mezclando `json_2026` y `js_2026`. Ninguna
  consulta del proyecto necesita saber de qué banco vino la pregunta para saber cuál
  es la respuesta, que era el punto de ADR-019.

### La barrera de H-014, comprobada hoy, y el enganche por fin vivo

`node scripts/verificar-barrera.mjs` dentro de Claude Code, hoy:

```
BARRERA EN PIE
Entorno detectado: Claude Code (CLAUDECODE=1, CLAUDE_CODE_ENTRYPOINT=cli).
  - XDG_CONFIG_HOME apunta a C:\Users\<usuario>\.claude\wrangler-sin-credenciales, y ahi no hay sesion de wrangler.
  - Ninguna de estas trae valor: CLOUDFLARE_API_TOKEN, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL, CLOUDFLARE_ACCOUNT_ID.
  - El enganche PreToolUse esta declarado y su guion existe.
  - El enganche se ejecuto hace 0 s: esta vivo, no solo declarado.
codigo de salida: 0
```

Las cuatro condiciones en verde. **La cuarta es la novedad.** El 2026-09-04 quedó
pendiente «un paso que Claude Code no puede dar»: que la sesión cargara el enganche.
El testigo de **0 s** dice que el enganche se ejecutó al lanzar este mismo comando, o
sea que está vivo y no sólo declarado. Ese pendiente queda cerrado, y con él **H-014**.

### Lo que queda vivo al cerrar la iteración

Tres deudas, y ninguna es un criterio pendiente. Están anotadas en el registro:

1. **`prueba_tuberia` sigue en producción.** El ensayo remoto la retiró de pruebas. En
   producción sigue ahí, y **la migración 001 no la borra**: comprobado, el `.sql` no
   la menciona. Quien la retire tendrá que escribir el `DROP` a mano, con el mismo
   cuidado de nombre y de uuid que exige H-015.
2. **El esquema no está aplicado en producción.** Era el paso 5 y no se ejecutó, por
   decisión razonada: crear tablas vacías en la base que sirve al sitio no aporta nada
   y sí abre una ventana mala. Va en la iteración 24, junto con la carga del banco.
3. **Las nueve pruebas de restricciones no son reproducibles.** La evidencia existe y
   el criterio está cumplido; lo que falta es un guion que las relance una por una y
   compruebe que **todas** fallaron. No caben en un solo `.sql` porque la primera que
   falla aborta el resto.
