# Iteración 33 · Memoria del avance

**Épica:** 30 · Cuestionario **Estado:** 🟢 Completada · 2026-09-15 **Depende de:** iteración 32 cerrada

## Objetivo

Que el cuestionario recuerde, módulo por módulo, lo que el estudiante respondió; que el índice muestre ese avance en los
siete módulos a la vez; y que ese recuerdo **nunca afirme algo que el banco ya no sostiene**.

## Contexto

Nadie responde 368 preguntas de una sentada. Sin memoria, cada visita empieza de cero y el banco grande se vuelve un
obstáculo en vez de una ventaja.

`vision.md` deja fuera las cuentas de usuario, así que la memoria vive en el navegador del estudiante. Eso tiene
consecuencias que hay que asumir y decir: no se comparte entre dispositivos y se pierde al limpiar los datos del
navegador.

## Historial de este archivo

- **2026-09-15 · reescrito al partir la antigua iteración 33.** Juntaba ocho frentes; se partió en 33 (esta), 34
  (justificación y repaso) y 35 (transición de carga). La orientación en la portada pasó a ser la 36. «Qué pasa si el
  banco cambia» y que «Reiniciar el módulo» borre lo guardado se quedaron aquí: el riesgo existe desde el primer día en
  que se guarda algo, y un botón de reinicio que no borra lo guardado mentiría.
- **2026-09-15 · revisado tras la lectura de alcance de Claude Code.** Encontró catorce huecos antes de construir. Las
  decisiones 6 a 14 de abajo salen de esa revisión, y todas las tomó el autor. Cuatro eran errores de redacción de este
  archivo: probar con
  `banco:actualizar` sobrescribía la instantánea versionada, el criterio de «barato» no podía fallar, una tarea ya
  estaba hecha y el criterio del formato viejo se cumplía solo.
- **2026-09-15 · tres correcciones tras la revisión del autor a la entrega.** El criterio del almacenamiento denegado
  nombraba la ventana privada de Safari como forma de provocarlo, y no sirve: desde Safari 11 el `localStorage` de las
  sesiones efímeras vive en memoria (WebKit 157010), así que ahí se lee y se escribe y la sonda no se dispara. Ahora
  nombra las dos formas que sí lo provocan. Se añade a «Lo que esta iteración no puede afirmar» el descuadre del índice
  ante una alternativa corregida, que el autor aceptó y declaró en ADR-034 en vez de resolverlo. Y se añade un criterio
  de navegador: que la cifra del índice se lea como avance y no como nota, que es lo único de la revisión que no se
  puede juzgar sin verlo en pantalla.

## Lo que hereda de la 32

- **El índice es el único control** para elegir módulo, marca el módulo **al pedirlo**
  y, al terminar de cargar, el sitio lleva el foco y el desplazamiento a la cabecera del módulo (ADR-032, actualización
  del 2026-09-15).
- **La puerta única `pedirCambioDeModulo()`** concentra hoy la guarda contra la doble petición, el reintento tras una
  carga fallida y el aviso de pérdida.
- **«Reiniciar el módulo» ya vuelve a la cabecera** y respeta `prefers-reduced-motion`. Se adelantó en la 32 y está
  anotado en sus notas: aquí no es pendiente.
- **`/api/preguntas?resumen=1`** (ADR-033): siete filas, unos 0,9 KB. En producción, el 2026-09-15, respondió con
  `filas_leidas: 1111`.

## Decisiones tomadas

### 1 · El aviso de pérdida se retira

Existía porque cambiar de módulo perdía lo respondido. Con memoria ya no pierde nada, y un aviso que no protege de nada
entrena a ignorar los avisos. **Se retira entero**, junto con lo que solo existía para él, incluidas sus pruebas en
`probar-filtrado.mjs`.

**ADR-032 recibe una actualización** que lo diga: la 33 retira el aviso, y lo demás de esa ADR —el índice como control
único— sigue vigente. Sin ella quedaría una ADR en presente describiendo algo que ya no existe.

### 2 · Un solo control de borrado: «Reiniciar el módulo»

**No hay un «borrar todo el avance».** Quien quiera empezar de cero lo hace módulo por módulo. Reiniciar borra la
pantalla **y** lo guardado de ese módulo, y no toca los otros seis. La idea de borrar todo queda anotada en
`registro_log.md` para evaluarla con el uso.

### 3 · Qué se guarda: la pregunta por su id, la alternativa elegida por su texto

Por cada módulo, y por cada pregunta respondida, se guarda **el id de la pregunta** y **el texto de la alternativa
elegida**. **Nunca se guarda el veredicto** —acertó o falló—: se recalcula contra el banco vigente cada vez que se
restaura.

**Por qué el id de la pregunta sí sirve.** ADR-020: ninguna pregunta se borra, se retira, así que su id es estable de
por vida (`decisiones.md:856-862`).

**Por qué el id de la alternativa no sirve.** `banco:actualizar` borra las cuatro alternativas y las vuelve a insertar
con ids nuevos (`scripts/administrar-banco.mjs:584-592`). Cualquier corrección, aunque sea una coma del enunciado,
dejaría huérfano todo lo guardado sobre esa pregunta.

**Por qué el texto.** Es la lección de la iteración 25: el texto es lo único que ningún reemplazo de filas puede
falsear.

**Consecuencia aceptada.** Si el autor corrige el texto de una alternativa que un estudiante había elegido, esa pregunta
vuelve a quedar sin responder. **Se pierde una respuesta; no se afirma nada falso.**

### 4 · Las cifras del índice son exactas sin abrir ningún módulo

`?resumen=1` pasa a traer también **los ids de las preguntas activas de cada módulo**, también en modo degradado desde
la instantánea. Así el índice cuenta, en los siete módulos, cuántas respuestas guardadas corresponden a preguntas que
siguen activas.

**Enmienda ADR-033**, no la sustituye: sigue siendo lectura, en el mismo extremo y por el mismo motivo. **ADR-009 no se
mueve.**

**Descartada · mostrar lo guardado y corregirlo al abrir el módulo.** Tras un cambio del banco el índice mostraría una
cifra falsa hasta abrir ese módulo. Contradice la regla que el proyecto sostiene desde la 24: ningún número que no salga
de un dato.

### 5 · ADR-034: la decisión de guardar, y el formato

ADR-034 (libre, comprobado) tiene **dos partes**:

1. **La decisión de guardar en el navegador**, con su motivo y sus límites: el avance **nunca sale del dispositivo**
   —ninguna petición al Worker lo lleva—, no hay cookies ni rastreo. Es coherente con `vision.md`, que excluye cuentas y
   analítica que rastree individuos. Es un cambio de naturaleza del sitio comparable al de ADR-007 y ADR-008, y por eso
   no puede vivir solo en un archivo de iteración.
2. **El formato**: qué se guarda, bajo qué nombre, con qué versión, y la conducta ante un dato desconocido (decisión
   13).

### 6 · Cada fila del índice muestra respondidas sobre total, y nada más

Es la consecuencia honesta de las decisiones 3 y 4: sin veredicto guardado y con el resumen trayendo solo ids, el índice
**no puede** saber aciertos ni fallos de un módulo cerrado sin traerse su banco, que es lo que `?resumen=1` existe para
evitar. Aciertos y fallos se ven en las barras, al abrir el módulo. **No se resuelve trayendo más datos.**

### 7 · Sin resumen ni instantánea, el índice no muestra avance

Si no llegan ids activos contra los cuales filtrar, el índice no muestra avance, igual que hoy no muestra cantidades en
ese caso. **Nunca muestra cifras sin filtrar**: sería exactamente la alternativa descartada en la decisión 4.

### 8 · En modo degradado, el índice cuenta sobre la instantánea, y se acepta

Toda la página trabaja entonces sobre la instantánea: el índice cuenta sobre los mismos ids que usaría el módulo al
abrirse, así que no contradice lo que se ve. El aviso de ADR-008 ya declara el desfase. No se agrega ningún mecanismo.

### 9 · Lo dibujado manda también para el avance

Extiende la regla de ADR-033. Mientras un módulo está abierto, **su fila del índice cuenta el avance sobre las preguntas
dibujadas**, no sobre los ids del resumen. Si las dos cuentas difieren, `avisarSiElResumenNoCuadra()` lo informa también
para el avance.

### 10 · El panel fijo no crece fuera de sus filas

ADR-032 contabilizó el coste vertical del índice y mantuvo el criterio de la ventana de 700 px. Por eso:

- **El avance va dentro de cada fila del índice**, junto a la cantidad.
- **«El avance vive solo en este dispositivo» va en el estado vacío** de la zona de preguntas: es lo primero que se ve
  en cada visita, porque la página arranca vacía.
- **«El avance no se está guardando» va en la zona de preguntas**, como el aviso de ADR-008.

### 11 · La puerta única se conserva, con otro motivo

`pedirCambioDeModulo()` sigue siendo la única puerta. Su motivo ya no es el aviso: es que concentra la guarda contra la
doble petición, el reintento tras una carga fallida y el foco a la cabecera. Un segundo camino se saltaría las tres en
silencio. Su documentación se reescribe con este motivo.

**Y el avance se guarda al responder, no al cambiar de módulo.** La memoria no depende de pasar por ninguna puerta:
cerrar la pestaña a mitad de un módulo no pierde nada.

### 12 · Los cambios del banco se provocan interceptando la respuesta, nunca con `banco:actualizar`

`banco:actualizar` regenera la instantánea versionada en el mismo acto (`scripts/administrar-banco.mjs:799-812`, regla 5
de ADR-025), y eso rompería el paso
`instantanea` de `npm run verificar`, que es criterio de esta misma iteración.

Los cambios del banco se simulan **interceptando la respuesta del extremo**, como se provocó la carga fallida de H3 en
la 32. La simulación reproduce **exactamente** el efecto comprobado de `banco:actualizar`: mismo id de pregunta, ids de
alternativa nuevos. La base local y la instantánea no se tocan.

### 13 · Un dato guardado desconocido o corrupto se ignora

Un dato con una versión desconocida, o que no se puede interpretar, **se ignora**: el módulo arranca vacío, la página no
falla ni avisa, y la próxima respuesta lo reemplaza con el formato vigente. No hay que avisar porque hoy no existe
versión anterior que perder: esta es la primera. El día que el formato cambie, la ADR que lo cambie decide si hay
migración.

### 14 · Que ninguna pregunta tenga dos alternativas con el mismo texto pasa a comprobarse

Hoy se cumple (0 de 368, comprobado). Pero la memoria pasa a depender de esa propiedad, y una propiedad de la que algo
depende no puede quedar sin vigilancia. Se agrega como comprobación a lo que ya revisa el banco. **No como restricción
del esquema**, que exigiría una migración en producción.

## Lo que queda a criterio de quien implemente

El mecanismo de almacenamiento del navegador, los nombres de las claves, cómo se dibuja «respondidas sobre total» en la
fila, dónde exactamente vive la comprobación de la decisión 14, y cómo se intercepta la respuesta en el guion. Con una
condición: la cifra del índice se entiende sin color, y el nombre accesible de la fila la dice, porque bajo
`lg` el título del módulo se esconde.

## Tareas

- [x] Guardar cada respuesta al responderla, y restaurar al volver al módulo, con las preguntas respondidas dibujadas
  como respondidas y las tres barras al día.
- [x] Recalcular cada veredicto contra el banco vigente al restaurar.
- [x] Ampliar `?resumen=1` con los ids de las preguntas activas por módulo, también en modo degradado desde la
  instantánea, y enmendar ADR-033.
- [x] Hacer que cada fila del índice muestre respondidas sobre total.
- [x] Retirar el aviso de pérdida, sus pruebas y lo que existía solo para él, y actualizar ADR-032.
- [x] Reescribir la documentación de la puerta única con su motivo vigente.
- [x] Hacer que «Reiniciar el módulo» borre también lo guardado de ese módulo.
- [x] Decir en el estado vacío que el avance vive solo en ese dispositivo.
- [x] Hacer que el sitio siga funcionando, y lo diga, si el navegador no permite guardar.
- [x] Escribir ADR-034 con sus dos partes.
- [x] Agregar la comprobación de alternativas con texto repetido y provocar su rojo.
- [x] Anotar en `registro_log.md` «borrar todo el avance» como idea a evaluar con el uso. Hecho en el cierre de la 32
  (`registro_log.md:169`).
- [ ] Dar una transición al cargar un módulo. Hoy la zona de preguntas pasa de
    vacía a llena de golpe y se siente burdo. Va una barra que refleje la
    **carga real**, con el logotipo de JavaScript encima, y un mínimo visible
    de unos 400 ms para que no parpadee cuando la respuesta es instantánea.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no razonando sobre el código. Los que
provoca Claude Code prueban **la decisión del componente** sobre un almacén simulado; lo que hace de verdad el navegador
lo comprueba el autor.

### Los provoca Claude Code

**Memoria**

- [x] **Lo respondido sobrevive a una recarga.** Se responde, se rehace el arranque con el almacén intacto y se vuelve
  al módulo: mismas preguntas respondidas, misma alternativa, y las tres barras dicen lo mismo que antes.
- [x] **Se guarda al responder, no al salir.** Se responde y se rehace el arranque **sin cambiar de módulo**: todo sigue
  ahí.
- [x] **Cambiar de módulo no pierde nada.** 3 → 5 → 3 desde el índice: todo sigue ahí.
- [x] **Reiniciar borra solo lo suyo.** Con avance en el 3 y el 5, se reinicia el 3 y se rehace el arranque: el 3 está
  en cero y el 5 conserva todo.
- [x] **Sin almacenamiento, el sitio sigue sirviendo.** Con un almacén que lanza al leer y al escribir, se elige módulo
  y se responde sin errores, y la página dice que el avance no se está guardando.
- [x] **Un dato desconocido o corrupto se ignora.** Se siembra un dato con otra versión y otro que no se puede
  interpretar: el módulo arranca vacío, sin error ni aviso, y la siguiente respuesta queda guardada con el formato
  vigente.
- [x] **El avance no sale del dispositivo.** Ninguna petición que haga el sitio durante las pruebas incluye datos del
  avance.
- [ ] **La transición refleja la carga real, no un tiempo inventado.** Se
  demuestra con una respuesta lenta y con una instantánea: en la primera la
  barra acompaña, en la segunda hay un destello breve y no una espera.
- [ ] **Nadie espera de más.** El tiempo entre elegir un módulo y verlo no crece
  respecto de lo que tarda la consulta más el mínimo visible.

**El banco cambia** (todo interceptando la respuesta, decisión 12)

- [x] **Una corrección no deja un veredicto falso.** Pregunta respondida cuya correcta cambió, con ids de alternativa
  nuevos: el veredicto sale del banco nuevo.
- [x] **Ids de alternativa nuevos con el mismo texto no pierden la respuesta.** Solo cambian los ids: la respuesta se
  restaura igual.
- [x] **Una corrección de texto no deja la respuesta colgando.** Cambia el texto de la alternativa elegida: la pregunta
  vuelve a quedar sin responder y ninguna barra la cuenta.
- [x] **Una pregunta retirada deja de contar**, en el módulo y en el índice, sin error.

**Índice**

- [x] **El índice es exacto en los siete módulos sin abrirlos.** Con una pregunta respondida que el resumen ya no trae,
  en un módulo cerrado, su fila deja de contarla.
- [x] **Cada fila dice respondidas sobre total**, y su nombre accesible también.
- [x] **Sin resumen ni instantánea, el índice no muestra avance**, y no muestra ninguna cifra sin filtrar.
- [x] **Lo dibujado manda.** Con una pregunta que el resumen cuenta y el extremo descarta, la fila del módulo abierto
  cuenta sobre lo dibujado y
  `avisarSiElResumenNoCuadra()` lo informa.

**Aviso retirado y puerta**

- [x] **El aviso de pérdida ya no existe.** Saltar con respuestas dentro cambia directo, y ningún archivo del sitio, del
  guion ni de las ADR lo menciona como vigente.
- [x] **La puerta única sigue cazando.** Si el índice llama a `mostrarModulo()` saltándose la puerta, el guion da rojo
  por las guardas que se salta.

**Coste y banco**

- [x] **`?resumen=1` sigue siendo barato.** Medido antes y después en la misma base local y en la misma ejecución:
  **como máximo 5 KB**, y **`filas_leidas` no aumenta**. Si no se puede cumplir, se detiene y se informa; el umbral no
  se relaja.
- [x] **Una pregunta con dos alternativas de igual texto da rojo** en la comprobación nueva.
- [x] **La instantánea versionada no cambió.** Al terminar, `static/js/data/instantanea-banco.js`
  no tiene diferencias.
- [x] **El escapado sigue en pie.** `npm run probar:escapado` a escala.
- [x] **Los guiones existentes siguen en verde**, con cada rojo nuevo provocado una vez.

### Los comprueba el autor en el navegador

- [x] **La persistencia es real:** responder, recargar de verdad y volver conserva todo, en escritorio y en teléfono.
- [x] **Con el almacenamiento denegado** (cookies bloqueadas en Chrome, o «Bloquear todas las cookies» en Safari), el sitio sirve y dice que no
  está guardando.
- [x] **El estado vacío declara que el avance es local** y se lee sin buscarlo.
- [x] **La cifra del índice se entiende como avance y no como nota en el primer uso.**
- [x] **El índice con avance se entiende en escala de grises.**
- [x] **La ventana de 700 px de alto** sigue permitiendo alcanzar todo el panel.
- [x] **En teléfono**, el índice con avance no empuja el estado vacío fuera de alcance.
- [x] **Con teclado**, reiniciar deja el foco en un lugar razonable.
- [x] **Sin errores de consola** con cualquier módulo cargado y tras recargar.
- [x] **`npm run verificar` termina en 0.**
- [x] **Tras el push**, `?resumen=1` en producción: bytes y `filas_leidas` comparados con los 0,9 KB y las 1111 filas
  del 2026-09-15.

## Verificación

Cada criterio con su evidencia y quién la produjo. `probar-memoria.mjs`, `probar-filtrado.mjs` y
`probar-escapado.mjs` corren el componente real contra el extremo real y cuentan sobre el HTML que
se dibujó, con el almacenamiento simulado en un archivo; lo que solo existe en un navegador lo
comprobó el autor el **2026-09-15**, en local, en producción y en iPhone con Safari, en una pasada
de 15 pasos con 10 capturas.

**Los 33 criterios se reparten así: 14 los cerró el guion, 10 el autor en el navegador, y 9 los
dos.** 14 + 10 + 9 = 33. El recuento se escribe aquí y se repite a propósito, porque en el cierre
de la 32 no sumaba: una fila deletreaba sus dos autores en vez de decir «los dos» y quedó contada
en dos montones a la vez. La columna «Quién» usa tres valores y nada más.

**Todas las observaciones del autor tienen captura salvo una**, y se dice en su celda: la consola
limpia en local (paso 10) la confirmó sin captura.

### Memoria

| Criterio | Evidencia | Quién |
|---|---|---|
| Lo respondido sobrevive a una recarga | `Memoria: dos respuestas del modulo 3 sobrevivieron a rehacer el arranque, con la misma alternativa marcada y las tres barras diciendo lo mismo`. Y la recarga de verdad, paso 2 de la pasada: 11/8/3 (18 %, 13 %, 5 %) antes y después de recargar, con la pregunta 01 restaurada en «V8 Engine». Con captura | los dos |
| Se guarda al responder, no al salir | El guion rehace el arranque **sin cambiar de módulo** y lo guardado ya está en el disco. Es además una guarda que corta: «responder no dejo nada guardado» cierra en rojo ahí mismo, y no se disparó en ninguna de las 17 visitas | Claude Code · guion |
| Cambiar de módulo no pierde nada | `Cambio de modulo con respuestas dentro: paso directo, sin preguntar, y al volver al modulo 3 estaban las dos respuestas`. Paso 4 de la pasada: 3 → 5 directo, y la fila del 3 conserva 11/61. Con captura | los dos |
| Reiniciar borra solo lo suyo | `Reinicio: borro lo guardado del modulo 3 —comprobado en el disco y al volver a abrir— y dejo intactas las dos respuestas del 5`. Paso 8 de la pasada: tras recargar, el 3 sigue en cero y el 5 intacto. Con captura | los dos |
| Sin almacenamiento, el sitio sigue sirviendo | `Sin almacenamiento —lectura denegada y escritura denegada—: se elige modulo, se responde, no hay error, y la pagina dice que el avance no se esta guardando`. Pasos 9 y 15 de la pasada: Chrome con los datos del sitio bloqueados, y Safari de iPhone con «Bloquear todas las cookies»; las dos con el aviso y pudiendo responder. Con captura | los dos |
| Un dato desconocido o corrupto se ignora | `Formato: un dato con version 99 y otro que no es JSON se ignoran sin aviso ni error, y la siguiente respuesta los reemplaza con la version 1` | Claude Code · guion |
| El avance no sale del dispositivo | `El avance no viaja: en 13 visitas, las unicas rutas pedidas fueron /api/preguntas?modulo=3, /api/preguntas?modulo=5, /api/preguntas?resumen=1, todas sin cuerpo`. Paso 3 de la pasada, en el panel de red: las únicas peticiones fueron `preguntas?resumen=1`, `estado` y `preguntas?modulo=3`, **ninguna al responder**. Con captura | los dos |

### El banco cambia

| Criterio | Evidencia | Quién |
|---|---|---|
| Una corrección no deja un veredicto falso | `Correccion del banco: con la correcta movida de alternativa y los ids de las cuatro renovados, la pregunta 53 paso de acierto a fallo. El veredicto salio del banco nuevo` | Claude Code · guion |
| Ids de alternativa nuevos con el mismo texto no pierden la respuesta | `Ids de alternativa renovados sin tocar los textos: la respuesta se restauro igual` | Claude Code · guion |
| Una corrección de texto no deja la respuesta colgando | `Correccion de texto en la alternativa elegida: la pregunta volvio a quedar sin responder y ninguna barra la cuenta. Se pierde una respuesta; no se afirma nada falso` | Claude Code · guion |
| Una pregunta retirada deja de contar | `Pregunta retirada: dejo de dibujarse, dejo de contar en las barras y la fila del indice bajo a 0/60, sin ningun error` | Claude Code · guion |

### Índice

| Criterio | Evidencia | Quién |
|---|---|---|
| El índice es exacto en los siete módulos sin abrirlos | El módulo cerrado cuenta sobre los `preguntas_ids` del resumen: con la pregunta retirada, su fila bajó a 0/60 sin abrirlo. **Con el límite que el autor aceptó y que esta iteración declara** —ver «Lo que esta iteración no puede afirmar»—: el descuadre por un texto de alternativa corregido no lo ve el índice hasta que se abre el módulo | Claude Code · guion |
| Cada fila dice respondidas sobre total, y su nombre accesible también | `Indice: cada fila dice respondidas/total —«2/61» el abierto, «2/49» uno cerrado— y su nombre accesible lo dice entero`. Paso 1 de la pasada: 0/52, 0/61, 0/61 y 0/49 con el almacenamiento vacío; paso 4: 11/61. Con captura | los dos |
| Sin resumen ni instantánea, el índice no muestra avance | `Sin ids: la fila se queda con el total a secas. Sin resumen ni instantanea: sin cifra y sin avance, pero con las siete filas dibujadas y utilizables` | Claude Code · guion |
| Lo dibujado manda | `Lo dibujado manda: con una pregunta descartada por el extremo, la fila conto 0/60 y la consola lo dijo dos veces, por la cantidad y por el avance` | Claude Code · guion |

### Aviso retirado y puerta

| Criterio | Evidencia | Quién |
|---|---|---|
| El aviso de pérdida ya no existe | El guion salta con respuestas dentro y el cambio pasa directo, sin diálogo; ningún archivo del sitio, de los guiones ni de las ADR lo menciona como vigente, y ADR-032 quedó actualizada. Paso 4 de la pasada: 3 → 5 sin aviso. Con captura | los dos |
| La puerta única sigue cazando | `Doble toque: 3 pulsaciones sobre el modulo 5 mientras cargaba salieron a pedirlo 1 vez, y quedo dibujado entero`, y `Carga fallida: … volver a pulsarlo reintenta —la guarda del doble toque no estorba al reintento—` | Claude Code · guion |

### Coste y banco

| Criterio | Evidencia | Quién |
|---|---|---|
| `?resumen=1` sigue siendo barato | Medido antes y después en la misma ejecución y sobre la misma base local: **929 → 2419 bytes** (techo 5 KB) y **`filas_leidas` 1111 sin cambio**, con el mismo plan de consulta. Paso 12 de la pasada, en producción: `filas_leidas` **1111**, `origen: d1`, ids presentes. Con captura. **Lo que no se comparó, y se dice:** el criterio pedía contrastar los bytes contra «0,9 KB», cifra anterior a los ids y sustituida durante esta iteración por los 2419; en producción el navegador informó **1,4 kB transferidos, comprimidos**, y el tamaño sin comprimir no quedó capturado. Lo que sí se comprobó es que el contenido es el mismo: siete rangos contiguos 1-52, 53-113, 114-174, 175-223, 224-275, 276-323 y 324-368, que coinciden con las siete cantidades y suman 368 | los dos |
| Una pregunta con dos alternativas de igual texto da rojo | `comprobar-instantanea.mjs` la comprueba en cada `npm run verificar`, y el rojo se provocó con `--sabotaje=repetida`. Hoy 0 de 368 | Claude Code · guion |
| La instantánea versionada no cambió | `static/js/data/instantanea-banco.js` sin diferencias al terminar. La decisión 12 existe por esto: los cambios del banco se provocan interceptando la respuesta, nunca con `banco:actualizar` | Claude Code · guion |
| El escapado sigue en pie | `npm run probar:escapado` a escala contra las 368, código 0, y la base local devuelta a su estado limpio, comprobado y no prometido | Claude Code · guion |
| Los guiones existentes siguen en verde | `probar:filtrado`, `probar:memoria` y `probar:escapado` en 0, con cada rojo nuevo provocado una vez — con las dos excepciones que se explican en «Los rojos provocados» | Claude Code · guion |

### Los comprueba el autor en el navegador

| Criterio | Evidencia | Quién |
|---|---|---|
| La persistencia es real, en escritorio y en teléfono | Paso 2: 5 respuestas → barras 5/3/2 (8 %, 5 %, 3 %), luego 11/8/3 (18 %, 13 %, 5 %); tras recargar de verdad y volver, las mismas cifras y la pregunta 01 restaurada con «V8 Engine». Paso 7: iPhone SE, avance conservado tras recargar. Paso 13: lo mismo en producción. Con captura | autor |
| Con el almacenamiento denegado, el sitio sirve y lo dice | Paso 9: Chrome con los datos del sitio bloqueados muestra «Tu avance no se está guardando», se puede responder y no hay errores. Paso 15: iPhone con «Bloquear todas las cookies», aparece el aviso y se puede responder. Con captura | autor |
| El estado vacío declara que el avance es local, y se lee sin buscarlo | Paso 1: la frase está entre el mensaje y el botón, **sin desplazarse**, con el almacenamiento vacío al empezar. Con captura | autor |
| La cifra del índice se entiende como avance y no como nota en el primer uso | Paso 1: con el índice en 0/52, 0/61, 0/61 y 0/49, la impresión de «0/61» en el primer uso se entiende como avance y no como nota. Con captura. Es el criterio que el autor añadió al revisar la entrega, y es el que cierra el hallazgo D3 | autor |
| El índice con avance se entiende en escala de grises | Paso 5: el módulo activo se distingue por su borde, las cifras son legibles y las barras se identifican por rótulo e ícono. Con captura | autor |
| La ventana de 700 px de alto sigue permitiendo alcanzar todo el panel | Paso 6: a 1280 × 700 el panel se desplaza por dentro hasta «Reiniciar el módulo», «Repasar la materia» y los enlaces de NotebookLM. Con captura | autor |
| En teléfono, el índice con avance no empuja el estado vacío fuera de alcance | Paso 7: iPhone SE emulado, estado vacío alcanzable con el índice lleno. Con captura | autor |
| Con teclado, reiniciar deja el foco en un lugar razonable | Paso 8: barras a 0 y foco con anillo visible en la cabecera del módulo. Con captura | autor |
| Sin errores de consola con cualquier módulo cargado y tras recargar | Paso 10: consola limpia en local con tres módulos y una recarga — **confirmado por el autor, sin captura**. Paso 13: consola limpia en producción, con captura | autor |
| `npm run verificar` termina en 0 | En el terminal del autor: `VERIFICADO`, las cinco comprobaciones en OK, código 0. Reproducido también acá, con una salvedad que se anota: la primera corrida dio `RESTRICCION CAIDA` en la llave foránea del módulo y la segunda salió en verde sin tocar nada (ver las notas y la fila nueva del registro) | los dos |
| Tras el push, `?resumen=1` en producción | Paso 12, con captura. La comparación completa —lo que se contrastó y lo que no— está en la fila del coste, más arriba | autor |

### Las tareas

Las 12 tareas se reparten aparte de los criterios, y no entran en las cifras de arriba: **7 las
cerró el guion y 5 los dos.** 7 + 5 = 12.

| Tarea | Evidencia | Quién |
|---|---|---|
| Guardar cada respuesta y restaurar al volver | `static/js/servicios/memoria.js` más los casos 1 a 4 de `probar-memoria.mjs`; paso 2 de la pasada | los dos |
| Recalcular cada veredicto contra el banco vigente | Casos 6a a 6d de `probar-memoria.mjs`: la pregunta 53 pasó de acierto a fallo con el banco nuevo | Claude Code · guion |
| Ampliar `?resumen=1` con los ids, también desde la instantánea, y enmendar ADR-033 | `sqlResumen()` con `group_concat(id)`, `resumirLaInstantanea()`, y la actualización de ADR-033 del 2026-09-15 | Claude Code · guion |
| Cada fila del índice muestra respondidas sobre total | `probar-filtrado.mjs` y `probar-memoria.mjs` cuentan sobre el HTML; pasos 1 y 4 de la pasada | los dos |
| Retirar el aviso de pérdida y lo que existía solo para él, y actualizar ADR-032 | El guion salta sin diálogo, no queda ninguna cita vigente, y ADR-032 lleva su bloque de actualización | Claude Code · guion |
| Reescribir la documentación de la puerta única con su motivo vigente | Decisión 11: la puerta ya no existe para avisar, existe para que no salgan dos peticiones y para que el foco no se caiga | Claude Code · guion |
| «Reiniciar el módulo» borra también lo guardado | Caso 4 de `probar-memoria.mjs`, comprobado en el disco; paso 8 de la pasada, con teclado | los dos |
| Decir en el estado vacío que el avance vive solo en ese dispositivo | `mostrarEstadoVacio()`; paso 1 de la pasada, con captura | los dos |
| El sitio sigue funcionando, y lo dice, si el navegador no permite guardar | Caso 5 de `probar-memoria.mjs`; pasos 9 y 15 de la pasada | los dos |
| Escribir ADR-034 con sus dos partes | `decisiones.md`, ADR-034, más el bloque de actualización del 2026-09-15 con la sonda, la convención de claves y el límite aceptado | Claude Code · guion |
| Comprobación de alternativas con texto repetido, y su rojo | `comprobar-instantanea.mjs`, con `--sabotaje=repetida` | Claude Code · guion |
| Anotar «borrar todo el avance» en `registro_log.md` | Hecho en el cierre de la 32, `registro_log.md:169` | Claude Code · guion |

## Lo que esta iteración no puede afirmar

- **Que el avance se comparta entre dispositivos**, ni que sobreviva a limpiar los datos del navegador. Es la
  consecuencia asumida de no tener cuentas.
- **Que dos pestañas abiertas a la vez no se pisen.** Se asume que gana la última que guarda.
- **Que en modo degradado coincidan con la base** el veredicto o el conteo del índice. Los dos se calculan contra la
  instantánea, que puede estar desfasada; el aviso de ADR-008 ya lo declara.
- **Que el índice deje de contar en el acto una respuesta cuyo texto de alternativa el autor corrigió.** Mientras el
  módulo esté cerrado, su fila la sigue contando; el conteo se corrige solo al abrirlo. Aceptado y declarado en la
  actualización de ADR-034: notarlo antes exigiría que el resumen trajera los textos de las alternativas, que es el
  peso que ADR-033 existe para no traer.
- **Que el camino real de `banco:actualizar` se haya ejercitado.** Se simula su efecto, comprobado en el código; no se
  ejecuta.
- Que responder mal enseñe algo: la justificación es de la 34.
- Que se pueda repasar solo lo fallado: el repaso es de la 34.

## Notas de la iteración

### Qué se construyó, decisión por decisión

**1 · El aviso de pérdida se retiró.** Existía desde la 31 porque cambiar de módulo costaba lo
respondido. Con memoria no cuesta nada, así que el aviso pasó de proteger a estorbar: un diálogo
que pregunta si aceptas perder algo que no vas a perder. Se fue él, sus pruebas y lo que existía
solo para él, y ADR-032 quedó actualizada.

**2 · Un solo control de borrado.** «Reiniciar el módulo» borra también lo guardado de ese módulo.
Si solo limpiara la pantalla, el estudiante reiniciaría, recargaría y le volvería todo: un botón
que miente. No hay «borrar todo el avance», y su ausencia está registrada como decisión, no como
olvido.

**3 · Qué se guarda.** El id de la pregunta y el **texto** de la alternativa elegida. El id de la
pregunta es estable de por vida (ADR-020); el de la alternativa no, porque `banco:actualizar` borra
las cuatro y las reinserta con ids nuevos aunque lo corregido sea una coma. **El veredicto no se
guarda**: se recalcula contra el banco vigente cada vez que se restaura. Es la decisión central de
ADR-034 — un veredicto guardado sobrevive a la corrección que lo desmiente y le enseña al
estudiante una regla falsa con la cara de quien sabe.

**4 · El índice es exacto sin abrir ningún módulo.** De ahí los `preguntas_ids` en `?resumen=1`:
contar el avance sin saber qué ids siguen activos haría que una pregunta retirada sumara avance
para siempre.

**5 · ADR-034**, con sus dos partes: la decisión de guardar —un cambio de naturaleza del sitio,
comparable al de ADR-007, porque hasta hoy el sitio no recordaba nada de nadie— y el formato, que
hay que fijar porque lo guardado sobrevive a los despliegues. Una clave por módulo, con la versión
**dentro** del dato.

**6 · Cada fila del índice muestra respondidas sobre total**, y nada más. Sin porcentaje y sin
color: la cifra se entiende en escala de grises, y el nombre accesible la dice entera porque bajo
`lg` el título del módulo se esconde.

**7 · Sin resumen ni instantánea, el índice no muestra avance** y no muestra ninguna cifra a
medias. Prefiere callar antes que decir un número que no puede sostener.

**8 · En modo degradado el índice cuenta sobre la instantánea**, que puede estar desfasada. Se
acepta: si la capa de datos no responde, el módulo que se abra también sale de la copia, así que
el índice y lo dibujado cuentan sobre lo mismo, y el desfase ya lo declara el aviso de ADR-008.

**9 · «Lo dibujado manda» se extendió al avance.** Si una pregunta respondida es de las que el
resumen cuenta y el extremo descarta, el índice diría 12 y las barras 11. Mientras el módulo esté
abierto, su fila cuenta sobre lo dibujado, y `avisarSiElResumenNoCuadra()` lo deja dicho en la
consola — ahora dos veces, por la cantidad y por el avance.

**10 · El panel fijo no creció.** El aviso de almacenamiento denegado vive en la zona derecha, no
en el panel: ese panel está contabilizado al milímetro desde ADR-032 y la ventana de 700 px tiene
que seguir alcanzando hasta «Reiniciar el módulo». Comprobado en el paso 6 de la pasada.

**11 · La puerta única se conservó, con otro motivo.** Ya no existe para avisar de la pérdida.
Existe para que pulsar dos veces no lance dos peticiones y para que el foco no se caiga al `body`.
La documentación se reescribió: una guarda cuyo motivo escrito ya no es cierto se quita en la
siguiente limpieza, por buena que sea.

**12 · Los cambios del banco se provocaron interceptando la respuesta**, nunca con
`banco:actualizar`. Con la herramienta real, la prueba habría reescrito la instantánea versionada,
que es un archivo del repositorio.

**13 · Un dato guardado desconocido o corrupto se ignora, en silencio.** No se avisa porque hoy no
existe ninguna versión anterior que perder —esta es la primera— y porque un aviso sobre un formato
interno no le dice nada a quien está estudiando.

**14 · Que ninguna pregunta tenga dos alternativas con el mismo texto pasó a comprobarse.** Si las
tuviera, no habría forma de saber cuál eligió el estudiante y se restauraría siempre la primera,
con su veredicto puesto. Hoy se cumple, 0 de 368, pero dejó de ser una casualidad afortunada para
ser una propiedad vigilada, porque ahora algo depende de ella.

### Lo medido

**`?resumen=1`, antes y después de los ids, en la misma ejecución y sobre la misma base local:**

| | bytes | `filas_leidas` |
|---|---|---|
| Sin los ids | 929 | 1111 |
| Con los ids | 2419 | 1111 |
| El banco entero, para comparar | 380 688 | 4783 |

**Las filas leídas no suben, y no es casualidad:** el plan de las dos consultas es el mismo
—`SEARCH p USING COVERING INDEX pregunta_por_estado_y_modulo`—, porque el índice que ya se recorría
trae el id consigo. El techo de 5 KB de esta iteración quedó impuesto en `probar-filtrado.mjs`.

**Confirmado en producción** el 2026-09-15, paso 12 de la pasada: `filas_leidas` **1111**, idéntico
a lo medido en local, `origen: d1` e ids presentes, con los siete rangos contiguos 1-52, 53-113,
114-174, 175-223, 224-275, 276-323 y 324-368 sumando 368. El navegador informó **1,4 kB
transferidos, comprimidos**; el tamaño sin comprimir no quedó capturado, así que lo que se comparó
es el contenido y las filas, no los bytes en crudo.

### Los rojos provocados

Cada comprobación nueva se vio dar rojo una vez, porque una que nunca ha fallado no es una
comprobación sino una casilla. Dos casos merecen quedar escritos.

**El falso verde del dato de otra versión, detectado y corregido.** La prueba de «un dato con
versión desconocida se ignora» sembraba un dato `v: 99` con un texto de alternativa **inventado**.
Daba verde, y no probaba nada: con un texto que no existe en el banco, la pregunta habría quedado
sin responder **por el otro motivo** —el texto no coincide con ninguna alternativa—, así que quitar
la comprobación de versión no habría cambiado el resultado. El guardián habría dado verde sobre un
sitio que lee datos de versiones que no entiende. Corregido sembrando el dato `v: 99` con un texto
que **sí existe hoy** entre las alternativas de esa pregunta, leído de la base en la misma
ejecución: ahora la única razón por la que el módulo puede arrancar vacío es la versión.

**El rojo que no se pudo fabricar: la comparación de planes.** Para demostrar que los ids no suben
las filas leídas se comparan los planes de la consulta de antes y la de ahora, derivando la primera
de la segunda quitándole el `group_concat` —no copiándola a mano, que sería una segunda versión de
la consulta esperando a divergir—. **Ese rojo no se provocó**, y el motivo es que no se puede
fabricar sin mentir: forzar planes distintos exige cambiar la consulta real del sitio o falsear la
derivada, y las dos cosas comprobarían que el guion sabe detectar una consulta que nadie va a
escribir. Lo que sí se comprobó es lo contrario y es lo que importa: que la derivación **no sea un
no-op**, con una guarda que da rojo si la consulta de antes sale idéntica a la de ahora, porque en
ese caso la comparación estaría comparando la consulta consigo misma y no diría nada.

**Las guardas que cortan, y por qué no se caen solas.** Hay fallos que dejan sin nada a todo lo que
viene detrás: si no se guardó ninguna respuesta, no hay ninguna que corregir para probar los cuatro
casos de «el banco cambia». Seguir daría una lista de errores derivados que tapan el único que
importa. Esos puntos llaman a `veredictoRoto()`, que limpia el taller, anuncia `MEMORIA ROTA` y
sale con su código. **Lo que no hacen es caerse con un volcado de pila**, y es deliberado: un
guardián que se cae no da veredicto, y **H-013** dice que eso no es un aprobado. Lo mismo con una
visita que termina con error — es la página rompiéndose en la cara del estudiante, y se cierra en
rojo ahí mismo con el error a la vista, en vez de seguir y caerse más adelante leyendo un paso que
no existe.

### La corrección de hecho sobre Safari

El archivo de esta iteración pedía provocar el almacenamiento denegado con **la ventana privada de
Safari**, y la documentación de la sonda repetía esa causa. **Es falso, y el error venía de la
redacción de la iteración, no de la implementación**: el código nunca detectó ventanas privadas,
detecta escrituras que fallan, y eso siguió siendo correcto todo el tiempo.

El comportamiento «deja leer y falla al escribir» era de **Safari 10**. Desde **Safari 11**, WebKit
hace que el `localStorage` de las sesiones efímeras viva en memoria (WebKit 157010): en navegación
privada se lee y se escribe con normalidad, y lo que no hace es sobrevivir al cierre de la ventana.
**Comprobado en el aparato**, paso 14 de la pasada: iPhone, Safari, ventana privada, **sin aviso y
con el avance conservado mientras la ventana sigue abierta** — exactamente lo que predice el
comportamiento corregido, y lo contrario de lo que decía el archivo.

La corrección alcanzó a siete sitios en cinco archivos: `memoria.js`, `cuestionario.html`, el texto
visible de `cuestionario.js`, ADR-034 y los dos guiones que simulaban el caso (`dom-falso.mjs`
llamaba a su almacén «ventana privada de mentira» y lanzaba «cuota cero»). Las causas que sí lo
provocan son **el almacén lleno** y **el bloqueo de cookies**, y así quedaron escritas. El paso 15
las provocó de verdad en el aparato, con «Bloquear todas las cookies».

### Las tres decisiones del autor sobre los hallazgos de la revisión

**D1 · El descuadre del índice se acepta y se declara.** Tras corregirse el texto de una alternativa
elegida, el índice sigue contando esa respuesta en un módulo cerrado hasta que se abre, donde se
corrige sola. **No se agrega mecanismo.** El índice cuenta cruzando lo guardado contra los
`preguntas_ids`, y los ids son todo lo que el resumen trae; notar el descuadre antes exigiría
comparar textos, o sea que el resumen trajera los textos de las alternativas de las 368 preguntas,
que es exactamente el peso que ADR-033 existe para no traer. El error es acotado, a la baja, dura
lo que tarde el estudiante en abrir ese módulo, y **nunca afirma un veredicto falso**.

**D2 · La sonda de almacenamiento se conserva, con su justificación corregida.** Detecta un almacén
que existe y se deja leer pero **no acepta escrituras** —lleno, o denegado a este origen—, que es
algo que no se ve de ninguna otra forma: encontrar el objeto y leerlo no distingue un almacén sano
de uno que no admite una escritura más. Escribe y borra `examen-td-js.prueba-de-escritura` en cada
carga, una vez, antes de que haya nada del estudiante en juego. Lo que **no** detecta es la ventana
privada, y ahora está escrito.

**D3 · «0/61» se queda como está, y lo juzgó el autor en el navegador.** El hallazgo era que la
cifra pudiera leerse como nota en vez de como avance. Se convirtió en criterio de navegador y el
paso 1 de la pasada lo cerró: con el índice en 0/52, 0/61, 0/61 y 0/49 se entiende como avance.
Si alguna vez se lee mal, se resuelve con un rótulo y sin sumar filas al panel.

### Una aclaración sobre la regla 1 de este archivo

La regla de no tocar el banco con `banco:actualizar` —decisión 12— se refiere a **los comandos del
banco y a la instantánea versionada**, que son archivos del repositorio y no se pueden reescribir
desde una prueba. **No se refiere a `probar:escapado`**, que sí escribe en la base local a
propósito: carga contenido hostil a escala, lo retira, y **comprueba con una consulta que la base
quedó como la encontró**, no lo promete. `probar-restricciones.mjs` hace lo mismo y lo demuestra
por huella criptográfica del contenido, antes y después. La diferencia entre los dos casos es que
uno deja rastro versionado y el otro no deja rastro ninguno, y está comprobado.

### El rojo intermitente de restricciones, y H-034 confirmado en vivo

**La primera corrida de `npm run verificar` de este cierre dio `VERIFICACION FALLIDA · 1`**, con
`restricciones → RESTRICCION CAIDA: Llave foranea del modulo`. No es un esquema roto: la llave está
declarada, `PRAGMA foreign_keys` informó `1`, no hay ningún módulo 99 en la base, y el mismo INSERT
lanzado a mano respondió `FOREIGN KEY constraint failed`. Reejecutado solo, y después `verificar`
entero, salió `VERIFICADO` con las nueve rechazando y la huella de la base idéntica antes y después.
Es intermitencia de varios procesos contra el mismo archivo D1 local, con `datos:dev` levantado al
lado, y encaja con **H-029** y **H-034**. **Lo grave no es el rojo falso: es que la prueba no puede
distinguirlo de uno verdadero** —«la restricción no rechazó» y «no pude preguntárselo a la base en
condiciones» salen por el mismo código 1—, que es la regla del tercer veredicto de H-013 otra vez.
Anotado en el registro, sin asignar.

**Y H-034 se confirmó en vivo al apagar el servidor local.** Matar el proceso de la tarea dejó el
árbol vivo sirviendo en 8788: hubo que bajar el `node` padre y sus dos `workerd` hijos a mano para
que el puerto quedara libre. Es exactamente lo que esa ficha describe, y esta vez ocurrió sin
buscarlo.

### Lo que hereda la siguiente iteración

- **La 36 va antes que la 34 y la 35**, por decisión del autor del 2026-09-15: la portada publica
  una cifra falsa, y la 36 no depende de ninguna de las tres.
- **El índice con avance ya está lleno**, que era lo que la 32 dejó a medias a propósito. La 34
  hereda un índice que dice cuánto lleva el estudiante en los siete módulos.
- **La memoria es el cimiento del repaso de errores.** Hoy se guarda la alternativa elegida y el
  veredicto se recalcula; el modo repaso de la 34 sale de ahí sin guardar nada nuevo, porque
  «fallada» se deduce del banco vigente y no de un dato guardado que pueda envejecer.
- **La convención de nombres de claves está fijada** —`examen-td-js.<funcionalidad>.`— para que el
  simulacro de la épica 40 no choque con el cuestionario.
- **`?resumen=1` tiene techo de 5 KB y un plan vigilado.** Quien quiera sumarle un campo se va a
  encontrar con el guion antes que con la factura de datos del estudiante.
- **Queda abierto** el consumo de filas leídas del resumen en producción (1111 por apertura de
  página), ya anotado en la épica 50, y el hueco de que `verificar` no corra `probar:memoria` ni
  `probar:filtrado`.
