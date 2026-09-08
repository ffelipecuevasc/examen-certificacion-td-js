# Iteración 23 · Administración del contenido

**Épica:** 20 · Persistencia de preguntas
**Estado:** 🟢 Completada · iniciada el 2026-09-08 · cerrada el 2026-09-08 · **un criterio abierto: el ensayo del manual**
**Depende de:** iteración 22 (cerrada el 2026-09-08, commit `4768abb`)
**Decisión de mecanismo y formato de entrada:** cerradas en ADR-025

## Objetivo

Construir la herramienta con la que el autor edita y carga preguntas sin escribir SQL a
mano y sin publicar el repositorio, cumpliendo ADR-009 —ningún extremo de escritura
expuesto al público— y sin abrir un solo camino hacia la base de la nube que no exija el
gesto explícito de ADR-015.

## Por qué esta iteración existe

Es el costo real del cambio de hoja de cálculo a base de datos. Una planilla trae la
edición incluida; una base de datos, no. Si esta iteración se salta, el proyecto termina
con un banco que sólo puede modificarse escribiendo consultas a mano, que es peor que la
situación de partida.

## La decisión de mecanismo ya está cerrada

**No se reabre.** ADR-025 fija que la administración es una **herramienta local de línea
de comandos**, sin panel y sin escritura publicada. Las dos alternativas —panel
autenticado y fuente en planilla volcada a D1— quedan descartadas por escrito, con su
motivo, en la propia ADR.

De esa decisión se siguen dos cambios respecto de cómo estaba planteada antes esta
iteración, y conviene tenerlos a la vista:

**El escenario del teléfono queda retirado.** La versión anterior de este archivo
justificaba la iteración con «el autor detecta una errata desde el teléfono, en el metro,
y quiere corregirla en un minuto». Ese escenario **lo retiró el autor el 2026-09-08**: el
trabajo sobre el proyecto ocurre siempre desde su computador. Queda anotado porque una
herramienta local no lo resuelve, y dejarlo escrito habría dejado viva una contradicción
entre el objetivo y el mecanismo.

**La autenticación sale del alcance.** Sin extremo publicado no hay nada que autenticar.
El criterio que pedía «intentar escribir sin credenciales y mostrar el rechazo» ya no
tiene objeto: no existe la puerta contra la que empujar. Se reemplaza por el criterio que
sí es comprobable en este diseño, y que está más abajo: que la herramienta no pueda
alcanzar producción por descuido.

## Origen del trabajo, y qué se conserva

El mecanismo se exploró primero con otro agente en la rama `antigravity`. **Se conserva
la idea; se descarta su código**, por los motivos que ADR-025 deja escritos. La rama
`antigravity` (`3f45da7`) **no se borra hasta que esta iteración esté rehecha y
verificada**: es la única copia de ese código como referencia.

De aquel trabajo se rescatan cuatro ideas, ya incorporadas a ADR-025: transacciones todo
o nada, `INSERT` estricto sin sobrescritura implícita, traducción de los errores de la
base a lenguaje legible, y regeneración de la instantánea dentro del mismo acto de
edición.

Su archivo `d1/migraciones/002-fecha-modificacion.sql` **no se rescata**. La migración
que añade la fecha de modificación se escribe desde cero en esta iteración. El motivo no
es de estilo: aquella se aplicó en la base local **sin registrarse en la tabla
`migracion`**, de modo que el esquema real y el libro de migraciones divergieron en
silencio. La columna existía y nada lo decía.

## Dependencia de la iteración 24, mantenida

Se mantiene el orden **23 y después 24**, por decisión del autor. La consecuencia se
escribe aquí para que no aparezca al final como un olvido.

**La herramienta se construye y se prueba contra las ocho filas de juguete.** El banco
real se carga en la iteración 24, así que todo lo que esta iteración demuestre —editar
una pregunta, cargar un lote, rechazar contenido inválido, deshacer un lote a medias— se
demuestra sobre el banco de ejemplo y contra la base local. Es el mismo riesgo asumido de
ADR-024: con ocho filas se prueba que el mecanismo existe, no que aguante 368.

**Y hay algo que directamente no se puede cerrar aquí:** el procedimiento en un solo
bloque que encarga ADR-023 —editar, exportar `d1/respaldo-banco.sql`, regenerar la
instantánea, publicar— **no se puede recorrer de punta a punta**, porque su último tramo
toca producción y producción no tiene ni esquema ni banco hasta la 24. El bloque se
escribe aquí; se **camina** allá.

De ahí salen dos criterios con tramo pendiente:

| Criterio | Qué sí se cierra aquí | Qué queda dependiendo de la 24 |
|---|---|---|
| «El autor corrige una pregunta y el sitio muestra el cambio sin publicar el repositorio» | Que la herramienta escribe en la base y que el sitio lee el cambio sin ningún despliegue, comprobado contra la base local | Que ocurra sobre el **sitio publicado y el banco real** |
| «La instantánea queda actualizada tras una edición» | Que editar dispara la regeneración y que el archivo cambia, con su sello | Que la instantánea regenerada salga del **banco real y desde la nube**, como manda ADR-023 |

**Cómo se cierran sin trampa.** Con la evidencia que sí existe —el mecanismo, sobre el
banco de juguete— y con el tramo pendiente nombrado dentro de la propia casilla, igual
que se hizo en la 22.

**Lo que no vale**: dar por comprobado el bloque de ADR-023 porque esté escrito. Un
procedimiento que nadie ha recorrido entero es una hipótesis con formato de lista.

## Formato de entrada, cerrado el 2026-09-08

La herramienta recibe el trabajo en **archivos JSON**, por decisión del autor, ya
incorporada a ADR-025. El JSON es un **encargo que se consume**: se carga y deja de
importar. La base sigue siendo la única fuente de verdad, y para saber qué hay en el
banco se consulta la base o la exportación de `d1/respaldo-banco.sql`, nunca el archivo
con el que se cargó.

## Alcance

**Dentro:** la herramienta, su migración `002`, la validación previa a la escritura, la
traducción de errores, la regeneración de la instantánea, el manual, y la evidencia de
todo lo anterior.

**Fuera:** cualquier escritura contra la base de la nube; la carga del banco real; las
justificaciones; el borrado de `prueba_tuberia`. Todo eso es iteración 24.

## Tareas

- [x] Escribir `d1/migraciones/002-fecha-de-modificacion.sql` desde cero para la fecha
  de modificación, y que quede registrada en la tabla `migracion` al aplicarse.
- [x] Implementar la herramienta según ADR-025: `scripts/administrar-banco.mjs`, con
  `revisar`, `insertar` y `actualizar`.
- [x] Validar el contenido antes de escribirlo, reutilizando las reglas de
  `functions/api/_validacion.js` en vez de escribir unas nuevas.
- [x] Traducir los errores de la base a lenguaje legible.
- [x] Regenerar la instantánea dentro del mismo acto de edición.
- [x] Escribir el guion que reproduce las pruebas de restricciones,
  `scripts/probar-restricciones.mjs`, saldando la deuda abierta desde la iteración 21.
- [x] Documentar el procedimiento en `90-manual/administrar-el-banco.md`, escrito para
  alguien que sólo va a editar preguntas.
- [x] Escribir el bloque de ADR-023 completo, marcado como no recorrido.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no
razonando sobre el código. Todo lo de abajo se comprobó el 2026-09-08 contra la base D1
**local**, salvo los dos rechazos del modo remoto, que los provocó el autor en su
terminal y que no llegan a tocar ninguna base: se plantan antes.

- [x] **Corregir y ver.** Se corrigió el enunciado de la pregunta 11 con
  `banco:actualizar` y `/api/preguntas` pasó de «Que devuelve typeof null en
  JavaScript?» a «… (corregido con la herramienta)» sin publicar nada.
  *(Tramo pendiente: el sitio publicado y el banco real, iteración 24.)*
- [x] **Lote completo.** Un encargo de dos preguntas dejó la base en `10 -> 12`
  preguntas y `40 -> 48` alternativas, contadas antes y después.
- [x] **Todo o nada, demostrado con un fallo real.** Lote de tres con la del medio
  chocando contra `UNIQUE (enunciado)`. La base quedó con las mismas **60 filas** y el
  mismo resumen **`0df127ac28ca8bdb`**, comparando un volcado campo a campo de
  `pregunta` y `alternativa` antes y después. Ni las anteriores a la fila mala
  sobrevivieron. La comparación es sobre el contenido, no sobre el mensaje.
- [x] **Colisión sin sobrescritura, por sus dos ejes.** `UNIQUE (enunciado)` y la terna
  `(origen, modulo, numero_origen)`, cada uno con su mensaje traducido y distinto, y la
  pregunta existente sin modificar en los dos casos (mismo resumen).
- [x] **Contenido inválido rechazado antes de tocar la base.** Las tres a la vez y
  listadas juntas: activa sin justificación, dos alternativas correctas, y dificultad
  «imposible». La base quedó con el mismo resumen. Comprobado también el reverso, para
  que la regla no sea más estricta de lo acordado: borrador sin justificación y activa
  sin dificultad **se aceptan**, como permite el esquema.
- [x] **Las mismas reglas al leer y al escribir.** Se cambió `ALTERNATIVAS_ESPERADAS` de
  4 a 3 en `functions/api/_validacion.js` —un archivo, una línea— y los dos caminos se
  movieron a la vez con el **mismo texto**: `/api/preguntas` pasó de «entregadas 10,
  descartadas 0» a «entregadas 0, descartadas 10» con el motivo «tiene 4 alternativas y
  debe tener 3», y la herramienta rechazó con esa misma frase el encargo que antes
  aceptaba. Revertido, y comprobado que los dos vuelven.
- [x] **Errores traducidos.** Ante `UNIQUE constraint failed: pregunta.enunciado` la
  herramienta dice «Ya hay una pregunta en el banco con ese mismo enunciado, palabra por
  palabra…». El mensaje crudo **se muestra debajo, no se esconde**: el día que aparezca
  uno sin traducción, esconderlo dejaría al autor sin nada que buscar.
- [x] **La herramienta no alcanza producción por descuido.** Los tres rechazos
  provocados, ninguno escribió nada:
  - ✅ **Base no declarada (H-015).** `--base=examen-td-js-inventada` responde
    `NO SE APLICO · BASE NO DECLARADA`, lista las dos declaradas y no escribe nada.
    Provocado por Claude Code.
  - ✅ **Modo remoto sin permiso.** Responde `ME NIEGO A CORRER ESTO · ADR-015`,
    código 1. **Provocado por el autor el 2026-09-08.**
  - ✅ **Modo remoto sin nombrar la base.** Con el permiso puesto, responde
    `NOMBRA LA BASE`, código 1. **Provocado por el autor el 2026-09-08.**

  **Por qué los dos últimos los cerró el autor y no Claude Code, que es la parte
  interesante:** el enganche `PreToolUse` de ADR-015 ve el argumento de la nube en la
  línea de comandos y **frena el intento antes de que la herramienta llegue a
  ejecutarse**. Se podía esquivar metiendo el comando dentro de un archivo —el propio
  mensaje del enganche advierte que eso lo saltaría— y no se hizo, porque es
  exactamente lo que ADR-015 prohíbe. **Eso no es una limitación: es la defensa en
  capas funcionando.** La capa 2 detuvo al agente antes de llegar a la capa de la
  herramienta, que era justo la que se venía a comprobar. En el terminal del autor la
  barrera no aplica —trabaja contra la nube a propósito, por ADR-015—, así que ahí sí
  se pudo empujar contra la puerta de la herramienta, y aguantó.
- [x] **Wrangler de `node_modules`, no `npx`.** El guion resuelve
  `node_modules/wrangler/bin/wrangler.js` y lo lanza con el mismo `node`. Provocado
  escondiendo ese archivo: la herramienta paró con `SIN VEREDICTO · No encontre wrangler
  en node_modules`, en vez de irse a buscar otro. La única aparición de `npx` en el
  guion está dentro de un comentario.
- [x] **El éxito no se decide por el código de salida (H-016).** El veredicto sale de lo
  que wrangler dijo por sus dos salidas y de **volver a preguntarle a la base**: si
  wrangler anuncia éxito y el conteo no cuadra, la herramienta responde `SIN VEREDICTO`,
  que no es lo mismo que un fallo. *(Aquí se anotó un H-021 el 2026-09-08 y se retiró el
  mismo día: era una medición mal hecha —`$?` después de una tubería mide el último
  comando— y no un hallazgo. El motivo que queda en pie es H-016.)*
- [x] **Instantánea al día.** Tras corregir la pregunta 11, el sello pasó de
  `2026-09-08T20:53:14.683Z` a `2026-09-08T20:59:39.412Z` sin que nadie lo pidiera
  aparte. La herramienta avisa además de que esa copia salió de la base local y **no es
  la que se publica**. *(Tramo pendiente: desde la nube y con el banco real, ADR-023,
  iteración 24.)*
- [x] **Fecha de modificación.** Tras la corrección, sólo la pregunta 11 quedó con
  `fecha_modificacion = 2026-09-08 20:59:30`, y las otras once con `NULL`. La tabla
  `migracion` contiene las dos: `001-banco-de-preguntas` y `002-fecha-de-modificacion`.
- [x] **Las restricciones se vuelven a probar solas.** Las nueve rechazadas, cada una
  con su mensaje propio, y la base devuelta a su estado —`antes c955a2e298a09426 ·
  despues c955a2e298a09426`, comprobado y no prometido—. Provocado también el caso
  contrario: saboteada una prueba para que la base la aceptara, el guion respondió
  `RESTRICCION CAIDA · 1 de 9`, código 1, y limpió igual. Salda la deuda de la 21.
- [x] **`npm run verificar` sigue en cero**, ahora con **cuatro** comprobaciones en OK:
  barrera, css, escapado y restricciones. Provocado también el aviso: sin esquema en la
  base local, `restricciones` responde código 2 y el veredicto global es
  `VERIFICACION INCOMPLETA`, que no es un aprobado.
- [x] **El JSON no se confunde con la fuente.** El manual lo dice en su primera sección,
  antes que nada: un archivo ya cargado no refleja el estado del banco, y la tabla de
  «dónde se consulta el estado real» manda a la base, al sitio y al respaldo, nunca al
  archivo.
- [ ] **El manual sirve.** Escrito, **no ensayado por alguien que no lo escribió**. El
  criterio pide recorrerlo al pie de la letra sin usar conocimiento que no esté en él, y
  eso sólo puede hacerlo el autor.

## Lo que esta iteración no puede afirmar

- Que la herramienta aguante 368 preguntas. Ocho filas prueban que el mecanismo existe.
- Que el todo o nada se comporte igual **en la nube**. Está provocado en local; en
  remoto es de la iteración 24.
- Que el procedimiento de ADR-023 funcione de punta a punta. Su último tramo es de la 24.
- Que el escapado aguante el banco real (ADR-024, heredado por la 24).

## Notas de la iteración

### El mecanismo del todo o nada no era el que la ADR suponía

ADR-025 decía «cada operación se ejecuta como una transacción única», y eso invita a
escribir `BEGIN` / `COMMIT`. **D1 los rechaza**: responde que hay que usar
`state.storage.transaction()` y no aplica nada del archivo. Lo que sí funciona es no
escribirlos: `wrangler d1 execute --file` aplica el archivo **como un lote atómico** por
su cuenta. Corregido en la ADR antes de implementar, porque quien la leyera iba a añadir
un `BEGIN` creyendo que reforzaba la regla, y la habría roto.

### Un hallazgo abierto y retirado el mismo día

Se anotó **H-021** —«wrangler devuelve código 0 con un `[ERROR]` dentro»— y era falso: el
0 lo devolvía `tail`, porque `$?` después de una tubería mide el último comando. Wrangler
devuelve 1 en error y 0 en éxito. Retirado en los cinco sitios donde se había escrito, y
conservado como hallazgo retirado en vez de borrado: este proyecto lleva cuatro hallazgos
girando en torno a códigos de salida (H-011, H-013, H-016 y este), y el filo nuevo es que
**una medición mal hecha produce un hallazgo con toda la apariencia de estar comprobado**.

### La barrera se defendió de quien venía a comprobarla

El intento de provocar el rechazo del modo remoto no llegó a la herramienta: el enganche
`PreToolUse` de ADR-015 frenó el comando antes. Es la capa 2 de H-014 haciendo su
trabajo, y deja el criterio abierto hasta que lo corra el autor. Se documenta así en vez
de esquivarlo metiendo el comando dentro de un archivo, que es justo lo que el propio
enganche advierte que lo saltaría.

### Lo que quedó anotado para más adelante

- Un **ejecutor de migraciones** que lea la tabla `migracion` y aplique sólo lo
  pendiente. Hoy son dos comandos y la `002` no es repetible. Pospuesto por el autor.
- Que en la iteración 24 el esquema de la nube lleva **dos** migraciones, en orden, y
  que hay que **comprobar que las dos queden registradas**.
