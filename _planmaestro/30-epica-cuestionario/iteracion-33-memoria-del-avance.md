# Iteración 33 · Memoria del avance

**Épica:** 30 · Cuestionario **Estado:** ⚪ No iniciada **Depende de:** iteración 32 cerrada

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

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no razonando sobre el código. Los que
provoca Claude Code prueban **la decisión del componente** sobre un almacén simulado; lo que hace de verdad el navegador
lo comprueba el autor.

### Los provoca Claude Code

**Memoria**

- [ ] **Lo respondido sobrevive a una recarga.** Se responde, se rehace el arranque con el almacén intacto y se vuelve
  al módulo: mismas preguntas respondidas, misma alternativa, y las tres barras dicen lo mismo que antes.
- [ ] **Se guarda al responder, no al salir.** Se responde y se rehace el arranque **sin cambiar de módulo**: todo sigue
  ahí.
- [ ] **Cambiar de módulo no pierde nada.** 3 → 5 → 3 desde el índice: todo sigue ahí.
- [ ] **Reiniciar borra solo lo suyo.** Con avance en el 3 y el 5, se reinicia el 3 y se rehace el arranque: el 3 está
  en cero y el 5 conserva todo.
- [ ] **Sin almacenamiento, el sitio sigue sirviendo.** Con un almacén que lanza al leer y al escribir, se elige módulo
  y se responde sin errores, y la página dice que el avance no se está guardando.
- [ ] **Un dato desconocido o corrupto se ignora.** Se siembra un dato con otra versión y otro que no se puede
  interpretar: el módulo arranca vacío, sin error ni aviso, y la siguiente respuesta queda guardada con el formato
  vigente.
- [ ] **El avance no sale del dispositivo.** Ninguna petición que haga el sitio durante las pruebas incluye datos del
  avance.

**El banco cambia** (todo interceptando la respuesta, decisión 12)

- [ ] **Una corrección no deja un veredicto falso.** Pregunta respondida cuya correcta cambió, con ids de alternativa
  nuevos: el veredicto sale del banco nuevo.
- [ ] **Ids de alternativa nuevos con el mismo texto no pierden la respuesta.** Solo cambian los ids: la respuesta se
  restaura igual.
- [ ] **Una corrección de texto no deja la respuesta colgando.** Cambia el texto de la alternativa elegida: la pregunta
  vuelve a quedar sin responder y ninguna barra la cuenta.
- [ ] **Una pregunta retirada deja de contar**, en el módulo y en el índice, sin error.

**Índice**

- [ ] **El índice es exacto en los siete módulos sin abrirlos.** Con una pregunta respondida que el resumen ya no trae,
  en un módulo cerrado, su fila deja de contarla.
- [ ] **Cada fila dice respondidas sobre total**, y su nombre accesible también.
- [ ] **Sin resumen ni instantánea, el índice no muestra avance**, y no muestra ninguna cifra sin filtrar.
- [ ] **Lo dibujado manda.** Con una pregunta que el resumen cuenta y el extremo descarta, la fila del módulo abierto
  cuenta sobre lo dibujado y
  `avisarSiElResumenNoCuadra()` lo informa.

**Aviso retirado y puerta**

- [ ] **El aviso de pérdida ya no existe.** Saltar con respuestas dentro cambia directo, y ningún archivo del sitio, del
  guion ni de las ADR lo menciona como vigente.
- [ ] **La puerta única sigue cazando.** Si el índice llama a `mostrarModulo()` saltándose la puerta, el guion da rojo
  por las guardas que se salta.

**Coste y banco**

- [ ] **`?resumen=1` sigue siendo barato.** Medido antes y después en la misma base local y en la misma ejecución:
  **como máximo 5 KB**, y **`filas_leidas` no aumenta**. Si no se puede cumplir, se detiene y se informa; el umbral no
  se relaja.
- [ ] **Una pregunta con dos alternativas de igual texto da rojo** en la comprobación nueva.
- [ ] **La instantánea versionada no cambió.** Al terminar, `static/js/data/instantanea-banco.js`
  no tiene diferencias.
- [ ] **El escapado sigue en pie.** `npm run probar:escapado` a escala.
- [ ] **Los guiones existentes siguen en verde**, con cada rojo nuevo provocado una vez.

### Los comprueba el autor en el navegador

- [ ] **La persistencia es real:** responder, recargar de verdad y volver conserva todo, en escritorio y en teléfono.
- [ ] **Con el almacenamiento denegado** (cookies bloqueadas en Chrome, o «Bloquear todas las cookies» en Safari), el sitio sirve y dice que no
  está guardando.
- [ ] **El estado vacío declara que el avance es local** y se lee sin buscarlo.
- [ ] **La cifra del índice se entiende como avance y no como nota en el primer uso.**
- [ ] **El índice con avance se entiende en escala de grises.**
- [ ] **La ventana de 700 px de alto** sigue permitiendo alcanzar todo el panel.
- [ ] **En teléfono**, el índice con avance no empuja el estado vacío fuera de alcance.
- [ ] **Con teclado**, reiniciar deja el foco en un lugar razonable.
- [ ] **Sin errores de consola** con cualquier módulo cargado y tras recargar.
- [ ] **`npm run verificar` termina en 0.**
- [ ] **Tras el push**, `?resumen=1` en producción: bytes y `filas_leidas` comparados con los 0,9 KB y las 1111 filas
  del 2026-09-15.

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

_Pendiente._