# Iteración 44 · Resumen de resultados

**Épica:** 40 · Simulacro de examen
**Estado:** 🔵 En curso · etapas A, B y C cerradas el 2026-09-22 (C a la espera de su commit) · quedan los nueve criterios de navegador del autor
**Depende de:** iteración 43, cerrada el 2026-09-21.

## Objetivo

Cerrar el intento con un resumen que diga si se aprobó el simulacro, qué módulos estudiar, y por qué era correcta cada
respuesta. Y abrir el simulacro al resto del sitio: es la última iteración de la épica.

## Contexto

Es la pantalla que justifica todo el simulacro. Un porcentaje aislado no sirve de nada; lo útil es «fallaste 9 de 17
preguntas del módulo 5».

## Historial de este archivo

- **2026-09-16 · reescrita dos veces.** El autor fijó el vocabulario del resultado, la forma de la revisión en el
  teléfono, que las justificaciones se piden en el resumen y que se conserva el último resultado. La lectura de alcance
  mostró que la justificación de la 34 no está exportada y que los anclajes de la guía no llevan el número del módulo.
- **2026-09-21 · auditada tras cerrar la 43, y decididas las pendientes.** La auditoría encontró que la decisión 3 pedía
  las justificaciones a un extremo que, por ADR-035, no las devuelve ni admite otro parámetro; que «pregunta corregida»
  no estaba definida; que la decisión 5 se podía leer contra ADR-035; que faltaba la herencia de la 43; que una tarea no
  tenía criterio, y que no había criterios de foco ni de teclado. El autor cerró las decisiones 6 y 7, tomó la 8, la 9 y
  la 10, y se corrigieron la 3 y la 5. Las decisiones de detalle que solo tiene sentido tomar con el código delante
  quedan escritas como pendientes de la etapa B, en vez de asumirlas.

## Lo que hereda

- **Reglas del simulacro** (README de la épica): omitida cuenta como incorrecta; se aprueba con 72 de 120.
- **Actualización de ADR-022:** solo «Aprobaste el simulacro» y «Reprobaste el simulacro» en el resultado.
- **Iteración 41 y ADR-035:** el intento guardado con sus 120 preguntas congeladas —con su correcta y **sin**
  justificaciones— y el extremo `/api/preguntas?ids=`, que no devuelve justificaciones y rechaza cualquier otro
  parámetro. ADR-035 fija además que **no se guarda ningún resultado aparte**: se recalcula desde el intento.
- **Iteración 45:** el marcado estático del resumen en `dibujarPantallaDelResumen()` de
  `static/js/components/simulacro-maqueta.js`, que se mira con `simulacro.html?maqueta=resumen` y `&reprobado=1`, y el
  significado de cada color.
- **Iteración 34:** `justificacionDibujada()`, `porqueDibujado()` y `tieneJustificacion()` en `cuestionario.js`, **sin
  exportar y acopladas** a `bancoCargado` y a los estados «respondida en la visita / restaurada».
- **Iteración 43:**
    - **«Intento terminado» es transitoria, y esta iteración la reemplaza por el resumen.** Hoy se dibuja por dos
      caminos —el enganche `alTerminarElIntento` y `dibujarElRecorrido()` cuando no queda pregunta—, así que el primero
      no se puede probar (anotado en `registro_log.md`).
    - **La tarjeta del reprobado de la maqueta dice «No alcanzaste el 60 %».** La decisión 1 de aquí ya dice que va
      «Reprobaste el simulacro».
    - **«Intento listo» se retiró** (decisión 8 de la 43), y con él la única pantalla que mostraba el reparto por
      módulo. El desglose de esta iteración lo devuelve.
    - **El vocabulario de ADR-022 ya se vigila con guion**: la sección 17 de `scripts/probar-identidad-visual.mjs` barre
      el
      `<main>` de `simulacro.html`, las pantallas dibujadas y los literales de `simulacro.js` y `simulacro-maqueta.js`.
    - **El teclado del intento sigue el patrón del grupo de radio** (decisión 11 de la 43): el resumen no debería
      enseñar otra forma de moverse.
    - **Las pruebas del recorrido viven en `scripts/probar-cronometros.mjs`**, con el reloj controlable, el intento
      sembrado y la recarga simulada; y `probar-escapado.mjs` ya le cuela una pregunta hostil al intento por `?ids=`
      (sección 5c).
- **La guía:** `index.html#modulos` está en el HTML estático. Los `<article id="modulo-${i}">` de
  `components/modules.js:203` usan la **posición** y no el número del módulo, los crea JavaScript y llegan cerrados.

## Decisiones tomadas

### 1 · El resultado

Del autor, 2026-09-16.

- **«Aprobaste el simulacro»** con 72 correctas o más; **«Reprobaste el simulacro»** con 71 o menos.
- **Las omitidas y las agotadas sin alternativa cuentan como incorrectas.**

La maqueta de la 45 dice «No alcanzaste el 60 %» en la tarjeta del reprobado: esta iteración la cambia a la frase de
arriba.

### 2 · La revisión en el teléfono

Del autor, 2026-09-16. **Agrupada por módulo, de peor a mejor desempeño.** En cada módulo, **las incorrectas y las
omitidas llegan abiertas** y **las correctas plegadas**, con un control para abrirlas. Cada pregunta muestra la
alternativa dada (o que se omitió), la correcta y la justificación.

### 3 · Las justificaciones se piden al llegar al resumen

Del autor, 2026-09-16. **Corregida el 2026-09-21:** decía que se piden «al extremo de la 41», y ese extremo no las
devuelve. Se piden **por los ids del intento, con el parámetro de la decisión 8**, y con la instantánea como respaldo si
la capa de datos falla. La justificación se dibuja con **una sola pieza extraída de la iteración 34**, que recibe la
pregunta y nada más; el cuestionario pasa a usar esa misma pieza.

### 4 · Si una pregunta se corrigió después del intento

Del autor, 2026-09-16, en la lectura de alcance de la 41. **El resultado se calcula con las preguntas tal como las vio
el estudiante.** Al pedir las justificaciones al banco vigente, el resumen compara: si una pregunta cambió desde el
intento, **la revisión muestra la versión corregida con un aviso** del tipo «Esta pregunta se corrigió después de tu
intento». Qué cuenta como cambio lo fija la decisión 9.

### 5 · Se conserva el último intento terminado

Del autor, 2026-09-16. **Corregida su redacción el 2026-09-21**, porque decía «el resumen queda en el navegador» y
ADR-035 fija que no se guarda ningún resultado aparte. Lo que se conserva es **el intento terminado**, y **el resumen se
recalcula desde él** cada vez que se muestra. Queda hasta que se empieza otro intento, que lo reemplaza. No hay
historial.

### 6 · Los enlaces a la guía van a `index.html#modulos`

Del autor, 2026-09-21. Ese destino está en el HTML estático de la portada y existe siempre. **La portada no se toca**:
el estudiante llega a la lista de los siete módulos y abre el suyo. La otra alternativa era cambiar `modules.js` para
dar a cada módulo un ancla con su número que lo abriera al llegar; se descartó para no extender la iteración a otra
épica. El resumen nombra el módulo en el desglose, así que el estudiante sabe cuál buscar.

### 7 · El desempate del desglose

Del autor, 2026-09-21, confirmando la propuesta: **de peor a mejor por porcentaje de correctas; a igual porcentaje,
primero el módulo con más omitidas; si sigue el empate, por número de módulo.** Se ordena por porcentaje y no por
cantidad de errores porque un módulo trae 18 preguntas y los demás 17.

### 8 · El extremo por ids sirve las justificaciones con `&con=justificacion`

Del autor, 2026-09-21. **Enmienda ADR-035** (escrita como actualización fechada al final de esa ADR).

- `/api/preguntas?ids=…&con=justificacion` devuelve **lo mismo que `?ids=…`** —las preguntas activas pedidas, con su
  versión vigente de enunciado, alternativas y correcta— **más la justificación** de cada una.
- `con` solo acepta el valor `justificacion`, y solo junto a `ids`. Cualquier otro valor, `con` sin `ids`, o `con` junto
  a
  `modulo` o `resumen`, se rechaza con `PETICION_INVALIDA`. Los límites de `ids` no cambian: 120 como máximo, troceados
  por dentro para respetar los 100 parámetros ligados de D1.
- `?ids=…` a secas **sigue sin justificaciones**: el intento sigue siendo liviano al empezar, que es lo que ADR-035
  buscaba.
- **Una sola petición** trae las dos cosas que el resumen necesita: la justificación y la versión vigente para comparar.
  Si la capa de datos falla, la instantánea tiene las dos.

### 9 · Qué cuenta como «pregunta corregida después del intento»

Del autor, 2026-09-21. **Cuenta si cambió algo que el estudiante leyó**, comparando la copia congelada con la versión
vigente:

- el enunciado;
- el texto de alguna alternativa;
- cuál es la correcta, **comparada por texto**;
- o que la pregunta ya no esté activa.

**No cuentan** los ids de las alternativas renovados sin tocar sus textos —es la regla de ADR-034 para el cuestionario—
ni el orden de las alternativas, que se barajan igual (ADR-006).

**La justificación no entra en la comparación**: la copia congelada no la guarda, y el resumen siempre muestra la
vigente.

**Una pregunta retirada** se muestra en su versión congelada, **con un aviso de que se retiró** después del intento y
sin justificación.

### 10 · Tres etapas, y quién hace cada cosa

Del autor, 2026-09-21; actualizado el 2026-09-22. La iteración va en tres etapas, cada una con su commit, y **una sola
pasada del autor en el navegador al final**, como la 41.

**Vuelve el reparto de trabajo de las épicas 20 y 30:** el autor dirige y autoriza, Claude ayuda a auditar y a decidir,
y **Claude Code implementa**. La disciplina no cambia con quién escribe: **cada prueba se escribe antes que su código y
se ve en rojo por el motivo correcto**, igual que en la tanda 2 de la 43.

- **A · Lo que el resumen necesita.** La pieza de la justificación extraída de la 34, y el extremo de la decisión 8.
  **A1 cerrado el 2026-09-22**, commiteado por separado de A2 y A3 para no perder el trabajo entre sesiones: el extremo
  gana
  `&con=justificacion`, con su prueba en `probar-filtrado.mjs` vista en rojo con seis problemas y en verde con 15 formas
  de pedir mal en vez de 10.
- **B · El resumen.** Resultado, desglose, tiempo, revisión, aviso de pregunta corregida, conservación y el reemplazo de
  «Intento terminado».
- **C · Abrir el simulacro al sitio.** Los enlaces al simulacro, los enlaces a la guía y el escapado de la revisión.

## Decisiones sin resolver

Se toman **al abrir la etapa B**, con el código delante. Cada una lleva una propuesta que no es decisión todavía.

**Tomadas por el autor el 2026-09-22, al abrir la etapa B**, las cuatro como estaban propuestas, con dos precisiones: B1 dice el límite en una línea («Cada pregunta tenía 30 segundos»), y B4 se decidió sabiendo que hoy la pantalla final se dibuja **dos veces** —el enganche del motor y el recorrido— y que un intento terminado retomado tomaba el arriendo. Detalle y evidencia en «Notas de la iteración · Etapa B».

### B1 · El tiempo promedio por pregunta

Propuesta: el tiempo transcurrido total, del comienzo del intento a la resolución de la 120, **dividido por 120**, en el
mismo formato que la franja. Con el sobrante perdido, el promedio nunca pasa de 30 segundos, y eso hay que decidir si se
dice o se deja implícito.

### B2 · Adónde va el foco al llegar al resumen

Propuesta: al título del resultado, con el mismo gesto que la decisión 4 de la 43 usa para el cambio de pregunta, y sin
región `aria-live`.

### B3 · Cómo se pliegan y se abren las correctas

Propuesta: un `<button>` por módulo con `aria-expanded` y `aria-controls`, que se opera con Enter y Espacio como
cualquier botón. Sin atajos de una tecla (decisión 11 de la 43).

### B4 · Cuál de los dos caminos a la pantalla final se conserva

Hoy «Intento terminado» se dibuja por `alTerminarElIntento` y por `dibujarElRecorrido()` sin pregunta. Al reemplazarla
por el resumen tiene que quedar **uno solo**, de modo que quitarlo dé rojo. La propuesta se hace mirando cuál de los dos
cubre también la recarga de un intento ya terminado.

## Tareas

### Etapa A · Lo que el resumen necesita

- [x] Extraer la pieza de la justificación de la 34, exportada, que reciba la pregunta y nada más, y hacer que el
  cuestionario la use sin cambiar lo que muestra.
- [x] Ampliar `/api/preguntas?ids=` con `&con=justificacion` (decisión 8).
- [x] Escribir la actualización fechada de ADR-035 en `decisiones.md` (decisión 8). Escrita el 2026-09-21, al preparar
  la iteración, antes de construir nada.
- [x] Un servicio en el navegador que pida las justificaciones y la versión vigente por los ids del intento, con la
  instantánea como respaldo.

### Etapa B · El resumen

- [x] Tomar las decisiones B1 a B4.
- [x] Resultado global: correctas, respondidas mal, omitidas, porcentaje y resultado del simulacro (decisión 1).
- [x] Desglose por módulo, ordenado de peor a mejor con el desempate de la decisión 7.
- [x] Tiempo transcurrido total y promedio por pregunta (B1).
- [x] Revisión agrupada por módulo (decisión 2), con los plegables de B3.
- [x] Aviso de pregunta corregida o retirada después del intento (decisiones 4 y 9).
- [x] Conservar el último intento terminado y recalcular el resumen desde él (decisión 5), con el botón para empezar
  otro.
- [x] Reemplazar «Intento terminado» por el resumen, por un solo camino (B4).
- [x] Cambiar la tarjeta del reprobado de la maqueta a «Reprobaste el simulacro» (decisión 1).
- [x] Llevar el foco al resumen al llegar (B2).
- [x] Agregar a las pantallas de la sección 17 de `probar-identidad-visual.mjs` el resumen dibujado con un intento de
  verdad, aprobado y reprobado, y no solo la maqueta.

### Etapa C · Abrir el simulacro al sitio

- [x] Enlazar el simulacro desde `index.html` (menú de escritorio y móvil, la sección `#repaso` y el pie) y desde
  `cuestionario.html` (menú de escritorio y móvil y pie), con la marca de página activa en `simulacro.html`. Las líneas
  exactas se comprueban al abrir la etapa.
- [x] Enlaces a la guía, a `index.html#modulos` (decisión 6).
- [x] Agregar a `probar:escapado` el bloque de la revisión: enunciado, alternativas y justificación.

## Criterios de aceptación

Cada uno se cierra con evidencia **provocada**, con intentos sembrados de resultado conocido y el reloj controlable de
la 42, y con su prueba vista en rojo por el motivo correcto antes de escribir el código.

### Etapa A · Se provocan con guion

- [x] **`?ids=…&con=justificacion` devuelve las mismas preguntas que `?ids=…`, más su justificación**, y `?ids=…` a
  secas sigue sin justificaciones.
- [x] **`con` con otro valor, `con` sin `ids`, y `con` junto a `modulo` o `resumen` se rechazan con
  `PETICION_INVALIDA`.**
- [x] **120 ids con justificación se sirven en una sola petición**, troceados por dentro como hasta ahora.
- [x] **Con la capa de datos caída**, simulado interceptando, el servicio del navegador devuelve justificaciones y
  versión vigente desde la instantánea.
- [x] **La justificación del cuestionario se dibuja con la pieza extraída**, y `probar:memoria`, `probar:filtrado` y
  `probar:escapado` siguen en verde sin cambios de comportamiento.

### Etapa B · Se provocan con guion

- [x] **Las cifras cuadran**: correctas + respondidas mal + omitidas = 120.
- [x] **El umbral es exacto en el borde**: 72 correctas dicen «Aprobaste el simulacro» y 71 «Reprobaste el simulacro».
- [x] **Una agotada con alternativa marcada** cuenta según esa alternativa; **una agotada sin alternativa**, como
  omitida.
- [x] **El desglose por módulo suma 120** y respeta el orden y el desempate de la decisión 7, provocado con intentos
  construidos para empatar en porcentaje y en omitidas.
- [x] **El tiempo total y el promedio por pregunta** salen de los instantes guardados según B1, y el reloj controlable
  los fija a valores conocidos.
- [x] **La revisión agrupa por módulo, en el orden del desglose**, con incorrectas y omitidas abiertas y correctas
  plegadas, y el control de plegado declara su estado según B3.
- [x] **Cada pregunta de la revisión muestra la alternativa dada o que se omitió, la correcta y la justificación de esa
  pregunta**, y no la de otra.
- [x] **Con una pregunta cambiada en el banco después del intento**, simulado interceptando, el resultado no cambia y la
  revisión muestra la versión corregida con el aviso. **Con los ids renovados y los textos intactos, no hay aviso.**
  **Con una pregunta retirada**, se muestra la versión congelada con el aviso de retiro (decisión 9).
- [x] **Tras simular una recarga en el resumen**, se muestra el mismo resultado, recalculado desde el intento y sin
  ningún resultado guardado aparte; **al empezar otro intento**, el anterior deja de estar guardado y la selección es
  nueva.
- [x] **Al resolverse la pregunta 120 se dibuja el resumen**, por un solo camino, y quitar ese camino da rojo (B4).
- [x] **Al llegar al resumen, el foco queda donde dice B2.**
- [x] **Vocabulario de ADR-022:** la sección 17 de `probar-identidad-visual.mjs`, con el resumen de verdad entre sus
  pantallas, sigue en verde, y el resultado usa exactamente una de las dos frases permitidas.
- [x] **`probar:cronometros` e `probar:identidad` siguen en verde.**

### Etapa C · Se provocan con guion

- [x] **El simulacro es alcanzable** desde el menú de escritorio, el menú móvil y el pie de las tres páginas y desde la
  sección `#repaso`, comprobado sobre el HTML, y **`comprobar-copias.mjs` sigue en verde**.
- [x] **Los enlaces a la guía apuntan a `index.html#modulos`, y ese `id` existe en el HTML estático de la portada.**
- [x] **`probar:escapado` cubre la revisión**: una pregunta hostil en el intento, con su justificación hostil, llega
  como texto en el enunciado, las alternativas y la justificación, sin etiquetas ajenas.
- [ ] **Los siete guiones, `build` y `verificar` terminan bien**, y `instantanea-banco.js` y `d1/respaldo-banco.sql`
  siguen sin cambios.

### Los comprueba el autor en el navegador, al final

- [ ] **El resultado se entiende a la primera.**
- [ ] **El desglose dice qué estudiar** sin tener que interpretar números.
- [ ] **La revisión se recorre cómodamente en el teléfono**, abriendo y plegando correctas.
- [ ] **La revisión se recorre con teclado**, y con lector de pantalla los plegables anuncian si están abiertos.
- [ ] **Los enlaces a la guía llevan a la lista de módulos de la portada.**
- [ ] **Los enlaces al simulacro funcionan** desde el menú, el pie y la portada, en escritorio y en teléfono.
- [ ] **Ninguna frase sugiere una certificación ni equipara el simulacro con el examen real**, leída en pantalla. Es la
  parte de ADR-022 que no se puede mecanizar.
- [ ] **Un intento real completo** termina en el resumen, **sin errores de consola**.
- [ ] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado.

## Lo que esta iteración no puede afirmar

- **Que aprobar el simulacro signifique aprobar el examen real.** El examen real mezcla programación, dura 120 minutos y
  no tiene las reglas del simulacro; y el simulacro no puede garantizar que no se hayan visto las respuestas (ADR-022).
- **Que el enlace a la guía lleve al módulo exacto.** Lleva a la lista de los siete (decisión 6).

## Notas de la iteración

### Etapa A · cerrada el 2026-09-22

A1 quedó commiteado aparte (`fd8716b`). A2 y A3 los implementó Claude Code el mismo día, con el diseño aprobado por
el autor antes de escribir código y **cada prueba vista en rojo por su motivo antes del código que la hace pasar**.

**A2 · `leerPreguntasPorIds(ids, { conJustificacion })`** en `static/js/servicios/datos.js`. Sin la opción, todo sigue
igual y `simulacro.js` no se tocó. Con ella, la ruta gana `&con=justificacion` y el respaldo
—`leerIdsDeLaInstantanea(ids, { conJustificacion })`— deja la justificación en vez de quitarla: con la opción, los dos
caminos la traen; sin ella, ninguno. `leerPreguntasPorIdsDelRespaldo()` **no se tocó**: H-024 es de elegir sobre un
banco y pedir a otro, y el resumen hace una sola petición. Si la etapa B necesita forzar la copia, se decide ahí.

- **Prueba:** bloque 10l de `scripts/probar-filtrado.mjs`, con los 120 ids del intento de muestra. (1) Con la capa
  arriba: **una** petición, contada interceptando, con `con=justificacion`, y lo mismo que el extremo crudo de 10a. (2)
  Con `fetch` rechazado: la copia con su sello, las pedidas que la copia tiene en orden de id, y cada justificación,
  enunciado y alternativas iguales a los de `instantanea-banco.js` **leído aparte** (H-023). (3) Control: sin la opción,
  ninguno de los dos caminos trae el campo.
- **Rojo, antes del código:** `FILTRADO ROTO *** 5 ***` — la petición salió sin `con=justificacion`; 120 de 120 sin
  justificación desde la capa; distinto del extremo crudo; 120 de 120 sin justificación desde la copia; 120 distintas
  del archivo. El control (3) no apareció entre los problemas: verde, como se esperaba.
- **Verde:** `probar:filtrado` en 0, con la nota «hace UNA peticion con con=justificacion y trae lo mismo que el extremo
  crudo; con la capa caida, 120 desde la copia, cada una con la justificacion del archivo».

**A3 · `static/js/components/justificacion.js`.** `tieneJustificacion()` y `justificacionDibujada()` se movieron tal
cual, con sus comentarios, y solo importan `esc`. `cuestionario.js` las importa y ya no las define; `porqueDibujado()`,
`desplegarElPorque()`, el camino de `responder()` y «Ver por qué» se quedaron en el cuestionario.

- **Prueba:** sección 5a-2 de `scripts/probar-escapado.mjs`, que corre en `verificar`: el módulo existe y exporta las
  dos; `tieneJustificacion()` con siete casos (nulo, sin campo, vacía, solo espacios, un número, texto de verdad);
  `justificacionDibujada()` **idéntica a una copia fija del HTML** tomada del cuestionario antes de moverla —antes de
  escribir la prueba se comprobó, con la plantilla leída del archivo, que la copia coincidía byte a byte—, y con la
  justificación hostil de `d1/prueba-escapado.sql` solo en su forma escapada; y `cuestionario.js` la importa de
  `./justificacion.js` sin conservar una definición propia.
- **Rojo, antes del código:** `ESCAPADO ROTO *** 3 ***` — `ERR_MODULE_NOT_FOUND` al importar el módulo, el
  cuestionario no lo importa, y conserva su propia definición.
- **Verde:** `probar:escapado` en 0.

**Al cierre**, con `npm run datos:dev` levantado —build primero, servidor después; el primer servidor se detuvo, se
comprobó el puerto 8788 libre y se levantó uno nuevo—: `probar:filtrado` 0, `probar:escapado` 0, `probar:memoria` 0 y
`npm run verificar` 0, con sus nueve comprobadores en OK. `probar:memoria` dio una vez código 2 («La base local no
devolvió las alternativas de las preguntas de prueba») y en verde al repetirlo sin cambios; está anotado en
«Sin asignar» de `registro_log.md`. Su nota sigue diciendo «120 preguntas congeladas con su correcta y sin
justificaciones»: el intento no cambió. `instantanea-banco.js` y `d1/respaldo-banco.sql` sin cambios.

### Etapa B · cerrada el 2026-09-22

El autor aprobó el diseño y las once pruebas antes de escribir código: **B1 a B4 tal como se propusieron**, un guion
nuevo `scripts/probar-resumen.mjs` como décimo comprobador de `verificar`, y dos precisiones —la pregunta corregida
conserva lo que el estudiante vivió y muestra la vigente aparte; «retirada» solo se afirma si la respuesta vino de la
capa—. Cada prueba se escribió antes que su código, en el orden aprobado.

**Las piezas.**

- `static/js/servicios/resultado-del-intento.js`, nuevo. Cálculo puro, sin DOM ni red: `calcularResultado()` —cifras,
  porcentaje, `aprobado` con `CORRECTAS_PARA_APROBAR = 72`, desglose ordenado, tiempo—, `compararConLaVigente()`
  —decisión 9— y `armarLaRevision()`.
- `components/simulacro-maqueta.js`: `dibujarPantallaDelResumen()` recibe el resultado de verdad —sin él dibuja el
  ejemplo, que ahora dice «Reprobaste el simulacro»—, más `dibujarRevisionDelIntento()` y `dibujarDentroDelModulo()`.
  La justificación se dibuja con `components/justificacion.js`. `formatearTranscurrido()` se mudó aquí desde
  `cronometros.js` —que la reexporta— porque el resumen la necesita y el motor ya importa la maqueta: importarla al
  revés cerraba un ciclo.
- `components/simulacro.js`: `dibujarElResumen()` reemplaza a «Intento terminado»; `pedirLaRevision()` pide
  `leerPreguntasPorIds(ids, { conJustificacion: true })` al llegar; `alternarLasCorrectas()` atiende el plegable por la
  misma delegación del recorrido. `elIntento.terminado_en` vive también en memoria.
- `components/cronometros.js`: sin el enganche del final.

**Las once pruebas, con su rojo antes del código.**

1. **Cifras** — rojo: `ERR_MODULE_NOT_FOUND` del servicio. Verde: cinco intentos —72/30/18 aprueba, 71/31/18
   reprueba, agotadas mezcladas 60+12 / 20+10 / 10+8 da 72/30/18, todo omitido, todo bien—; cada uno suma 120 y cada
   pregunta cae en el estado de su respuesta.
2. **Desglose** — rojo: 31 problemas, sin desglose. Verde: orden `[7, 4, 3, 5, 6, 2, 8]` sobre un intento construido
   para empatar: 4 antes que 3 por omitidas, 3 antes que 5 por número, y 6 antes que 2 con los mismos 7 errores porque
   10/17 es peor que 11/18.
3. **Tiempo (B1)** — rojo: seis problemas, sin tiempo ni línea de los 30 s. Verde: «45:00» y «00:22»; «1:00:00» y
   «00:30». **Corrección de la prueba antes de implementar**: esperaba «60:00», y con el formato de la franja —el que B1
   manda— una hora exacta se escribe «1:00:00».
4. **Comparación (decisión 9)** — rojo: `compararConLaVigente()` no existía. Verde, con lo que la función devolvió en
   cada caso: idéntica → igual; ids de alternativa renovados → igual; orden cambiado → igual; ids + orden + otra
   justificación → igual; enunciado cambiado → corregida; texto de una alternativa incorrecta distinto → corregida;
   texto de la correcta distinto → corregida; correcta movida con los mismos textos → corregida; correcta movida con
   ids renovados y orden cambiado → corregida; `es_correcta` como 1/0 → igual; ausente desde la capa → retirada;
   ausente desde la copia → desconocida. **Dos sabotajes** sobre la implementación: comparar por id y en orden da rojo
   en los ids renovados, en el orden cambiado y en el texto distinto; quitar la comparación de textos da rojo en el
   texto distinto. Los dos revertidos.
5. **Un solo camino (B4)** — rojo, y es lo que mostró la lectura del código: la zona se escribía **2 veces** al resolver
   la 120 por «Siguiente», al agotarse y al recargar; quedaba un temporizador vivo y el arriendo tomado sobre un intento
   terminado. Verde: una escritura en cada camino, 72 por «Siguiente» (Aprobaste) y 71 agotada sin marcar (Reprobaste),
   45:00 y 00:22 dejados por el reloj controlable, 0 temporizadores al recargar, ningún arriendo. **Quitar el camino da
   rojo**: con la llamada de `dibujarElRecorrido()` comentada, los tres caminos fallan; revertido.
6. **Foco (B2)** — rojo: el foco quedaba en la alternativa, en la tarjeta o en el `body`. Verde: `#titulo-del-resultado`
   en los tres caminos, y ahí sigue al completarse la revisión. Sin `aria-live`.
7. **Revisión (decisión 2, B3)** — rojo: sin revisión ni petición. **Un error de la prueba**, visto en el primer verde a
   medias: cortaba el bloque de cada módulo en su propio `data-papel` y lo dejaba vacío; se corrigió la lectura, no el
   código. Verde: bloques en `[7, 4, 3, 5, 6, 2, 8]`, 120 filas, cada una con lo dado, la correcta y **su**
   justificación; incorrectas y omitidas abiertas, correctas plegadas con `aria-expanded` y `aria-controls`; el control
   del módulo 3 abre, pliega y deja el foco en sí mismo; una sola petición, con las 120 y `con=justificacion`. **Dos
   sabotajes**: darle a cada fila la justificación de la siguiente da rojo en las 120; abrir también las correctas da
   rojo en los siete módulos. Revertidos.
8. **Banco cambiado** — rojo: ningún aviso. **Otro error de la prueba**, corregido antes de implementar: exigía que la
   10ª quedara «correcta», y en ese intento se respondió mal; ahora exige el estado congelado, sea cual sea. Verde:
   resultado 72, igual que sin cambios; avisos en la 1002 y la 1009 (corregida) y la 1023 (retirada); la 1016, con ids
   renovados y orden al revés, sin aviso; la corregida muestra lo que se vio y la versión vigente aparte, y la retirada
   se muestra congelada y sin justificación.
9. **Capa caída** — **esta NO se vio en rojo antes de su código**: pasó a la primera, porque lo escrito para la 7 y la 8
   ya cubría la copia y el caso sin respaldo. Se dice así y no se presenta como rojo. Para que quede probado que sabe
   fallar, **tres sabotajes**: tratar la copia como capa da rojo —la que falta pasa a «retirada» y se apaga el aviso de
   ADR-008—; no encender el aviso da rojo; quitar la nota del caso sin copia da rojo. Revertidos. Verde: 120 filas
   desde la copia, 119 con la justificación del archivo de la instantánea leído aparte, la que la copia no tiene dice
   que falta su explicación y no que se retiró, y el aviso a la vista; sin capa ni copia, el resultado sigue en 72 y
   las 120 se dibujan desde la copia congelada, sin justificaciones y con su nota.
10. **Conservación** — rojo: el resumen no tenía el botón para empezar otro. Con el botón, rojo de la carrera: la
    revisión del intento anterior llegaba tarde, se escribía y cambiaba el aviso de respaldo del nuevo. Verde: recargar
    da la misma huella («72 | 45:00 | …»), el almacén solo tiene `preguntas` y `respuestas`, sin campo de resultado;
    «Empezar otro intento» deja un `intento_id` nuevo con 120 preguntas y 0 respuestas; la revisión rezagada se
    descarta. La guarda es una cuenta de peticiones que sube al empezar: `elIntento` sigue siendo el viejo durante toda
    la carga del nuevo, así que mirarlo no alcanzaba.
11. **Vocabulario (sección 17)** — rojo: el servicio no exportaba `armarLaRevision()` y no había resumen de verdad que
    barrer. **Un hallazgo al ponerla en verde**: con texto real del banco, el barrido encontró «nota» —las preguntas 7 y
    92 dicen «una nota al margen» y «Se nota al comparar»—. La sección 17 ya dice que el texto del banco no se barre,
    así que el barrido usa las mismas pantallas con el texto del banco neutralizado; el contraste se sigue midiendo con
    el real. **La tarjeta del reprobado ya decía «Reprobaste el simulacro»** desde la prueba 3, cuando se reescribió la
    pantalla, así que esa comprobación no se vio fallar por sí sola: un **sabotaje** que devuelve «No alcanzaste el
    60 %» da rojo en la maqueta y en el resumen de verdad. Revertido. Verde: 2 717 mediciones de contraste, ninguna bajo
    su umbral; 11 pantallas barridas, cada resumen con una sola de las dos frases, la que le toca.

**Consecuencia en otro guion.** El bloque 18 de `probar-cronometros.mjs` exigía «Intento terminado» al resolver la 120;
ahora exige el resumen. Es el efecto directo de B4, no un cambio de criterio.

**Al cierre**, con `npm run datos:dev` levantado —el servidor anterior se detuvo, se comprobó el 8788 libre y se levantó
uno nuevo, que recompiló `static/css/style.css` con las clases nuevas—: `probar:resumen` 0, `probar:cronometros` 0,
`probar:identidad` 0, `probar:filtrado` 0 y `probar:memoria` 0. **`npm run verificar` termina en 1**, con los otros nueve
en OK y `css` en **DESFASADO**: «el CSS corresponde a su fuente, pero difiere de lo que hay commiteado». Es `style.css`
recompilado y todavía sin commit; se resuelve con el commit de la etapa. Repetido tras reiniciar el servidor: mismo
resultado. `instantanea-banco.js` y `d1/respaldo-banco.sql` sin cambios.

**Una caída del servidor, sin investigar.** Al terminar `probar:memoria` —ya en 0—, `wrangler pages dev` se cayó con un
`[ERROR]` vacío desde `ProxyController`. Las pruebas no se vieron afectadas: habrían dado código 2. Anotado en «Sin
asignar», junto a H-029.

**Lo que queda para el navegador del autor**: que el resultado se entienda, que la revisión se recorra en el teléfono y
con teclado, que los plegables se anuncien con lector de pantalla, y un intento real hasta el resumen sin errores de
consola.

### Etapa C · cerrada el 2026-09-22

El autor aprobó dos decisiones de forma antes de escribir nada: **«Simulacro» va justo después de «Cuestionario»** en los
dos menús —las dos formas de practicar, juntas, de menos a más exigente— y **el simulacro tiene tarjeta propia en
`#repaso`**, no un segundo botón dentro de la amarilla, porque esa tarjeta ya es un mensaje completo sobre el
cuestionario y aparte se pueden decir las reglas del simulacro.

**Dónde quedó cada enlace.**

- **Menú de escritorio y menú móvil de las tres páginas**, tras «Cuestionario». En `simulacro.html` lleva la marca de
  página activa —`nav-link active text-paper` y `mobile-link text-jsyellow`—, que es la misma que usa el cuestionario en
  la suya y que `comprobar-copias.mjs` ya normalizaba.
- **Pie de las tres páginas**, un quinto `<li>`: «Simulacro cronometrado».
- **`index.html`, sección `#repaso`**: tarjeta propia bajo la amarilla y antes de NotebookLM, con las reglas —120
  preguntas, 30 segundos cada una, sin volver atrás— y el enlace «Ir al simulacro cronometrado».
- **Resumen**: un solo enlace a `index.html#modulos` al final del desglose, que es donde se lee en qué módulo se falló.
  No uno por fila: serían siete al mismo destino en media pantalla de teléfono.

**Las cuatro pruebas, con su rojo antes del código.**

1. **El simulacro es alcanzable**, sección nueva de `comprobar-copias.mjs`. Mira **por zona** —menú de escritorio, menú
   móvil y pie de cada página, más `#repaso` de la portada— y que `<section id="modulos">` siga en el HTML estático.
   Existe porque la comparación de copias caza que el enlace falte en **una** página, pero no que falte en las **tres**,
   que era el estado hasta esta etapa. Rojo: los siete sitios de menú y pie, más `#repaso`.
2. **La provocación pedida por el autor**, con el enlace **solo en `index.html`**: `comprobar-copias.mjs` dio
   `COPIAS DISTINTAS *** 10 ***`, y **cuatro de esos diez son diferencias entre copias** —encabezado de `index.html`
   contra el de `cuestionario.html` y el de `simulacro.html`, y lo mismo en el pie—, cada una señalando el carácter
   exacto y el trozo donde empieza la diferencia. Queda probado con evidencia, y no supuesto, que una omisión en una de
   las tres se caza sola.
3. **El resumen lleva a la guía**, en `probar-resumen.mjs`, sobre el resumen **dibujado** de un intento terminado. Rojo:
   cero enlaces en el desglose. Verde: exactamente uno, a `index.html#modulos`, y una sola vez en toda la pantalla.
4. **`probar:escapado` cubre la revisión** (bloque 5d). El intento hostil que ya armaba 5c se lleva hasta el final
   resolviendo sus 120 con los tres estados, y la justificación hostil se cuela por `&con=justificacion`, que es la única
   petición que la trae. **El primer rojo fue el que el autor pidió confirmar**: código 2, «No se llegó a dibujar la
   revisión del resumen», y no texto crudo. Con el intento llevado al final, verde. **Sabotaje** para comprobar que la
   parte nueva muerde: quitarle el `esc()` a la justificación da rojo por su forma cruda, por la escapada ausente y por
   una etiqueta `img` colada en la revisión. Revertido.

**Al cierre**, con `npm run datos:dev` levantado: `probar:escapado` 0, `probar:resumen` 0, `probar:filtrado` 0,
`probar:memoria` 0 y `verificar:copias` 0, con la nota «10 sitios llevan a simulacro.html». **`npm run verificar`
termina en 1** con nueve comprobadores en OK y `css` en DESFASADO —el `style.css` recompilado a la espera del commit—.
`instantanea-banco.js` y `d1/respaldo-banco.sql` sin cambios.

**Dos tropiezos del entorno, ninguno del código.** El primero: al levantar el servidor, wrangler dijo `Ready on
http://127.0.0.1:8788` y todo colgaba igual —el `workerd` zombi que describe `CLAUDE.md`—; se detuvo ese grupo, se
comprobó el puerto libre y se levantó uno limpio. El segundo: en la primera corrida de `verificar`, `escapado` salió como
AVISO porque `wrangler d1 execute --local` falló con `fetch failed` al aplicar `d1/prueba-escapado.sql`; repetido sin
tocar nada, OK. Encaja con la familia de H-029 y está anotado ahí, no como hallazgo nuevo.

### Etapa C · segunda tanda, 2026-09-22 · la pastilla del menú

Decisión del autor, con el diseño ya en pantalla: **el enlace «Simulacro» del menú es una pastilla amarilla persistente**
—`bg-jsyellow text-ink`, con la forma y el `hover:bg-jsyellowdim` de los botones del sitio, del tamaño de un ítem de
menú— en las tres páginas, en escritorio y en móvil. El pie no se toca. **La marca de página actual, solo en
`simulacro.html`, es un subrayado negro** bajo la palabra: con el texto siempre negro sobre amarillo, el
`hover:text-paper` de los demás enlaces no aplica y un color de texto no puede distinguir nada.

- **`src/input.css`** gana una regla: `.nav-link.pastilla::after { content: none; }`. La barra amarilla que `.nav-link`
  dibuja al pasar el ratón quedaría amarillo sobre amarillo, y en `simulacro.html` estaría puesta siempre por `.active`.
- **`mobile-link` se conserva** en la pastilla del menú de teléfono: `components/nav.js` la usa para cerrar el menú al
  tocar. `self-start` evita que la pastilla se estire de lado a lado en la columna del menú.

**La comprobación, y el falso verde que evita.** `comprobar-copias.mjs` normaliza los tokens de la página activa antes de
comparar, así que ahora también esconde el subrayado. Eso solo no basta: **escondido el token, borrarlo pasaría en
verde**, que es H-023 otra vez. Por eso el guion gana una comprobación que exige lo contrario: que el subrayado **esté**
en los dos menús de `simulacro.html` y **no esté** en los de las otras dos.

**Rojo visto antes del código, y la provocación que pidió el autor.** Primero, con la pastilla sin escribir: los dos
menús de `simulacro.html` sin subrayado. Después, ya con el diseño puesto, se quitó el subrayado **a propósito**: la
comparación de copias siguió diciendo «las tres dicen lo mismo» —la normalización lo esconde— y el rojo salió por la
comprobación nueva, por diferencia real: «el enlace del simulacro en el menú de escritorio no lleva el subrayado que
marca la página actual». Restaurado. De paso se corrigió que su nota se imprimía aunque el bloque hubiera fallado.

**Al cierre:** `verificar:copias` 0 —con «6 enlaces comprobados» y «10 sitios llevan a simulacro.html»—,
`probar:filtrado` 0, `probar:escapado` 0. **`npm run verificar` termina en 1 por dos cosas**: `css` DESFASADO, que se
cierra con el commit, y **`identidad` ROTA por el texto nuevo del aviso**, que no es de esta tanda y se explica abajo.

**Dos incidentes del entorno.** `node_modules/tailwindcss` desapareció a mitad de la sesión —el build anterior había
funcionado— y el build falló con `MODULE_NOT_FOUND`; se repuso con `npm install`, sin tocar `package.json` ni
`package-lock.json`, y quedó en 3.4.19. Y en la primera corrida de `verificar`, `restricciones` dio `RESTRICCION CAIDA ·
CHECK de es_correcta`: se corrió el diagnóstico de H-029 antes de suponer nada —el `CHECK (es_correcta IN (0, 1))` está
en la base, y el comprobador suelto dio 0— y al repetir `verificar` salió OK. Tercera aparición de la misma familia.

### Lo que bloquea el cierre y necesita decisión del autor

**El texto nuevo del aviso de `simulacro.html` usa «Certificación» y «certificación»**, y esa palabra está en la lista de
ADR-022 que barre la sección 17 de `probar-identidad-visual.mjs` sobre el `<main>` de esa página. El texto es del autor y
**no se tocó**. Las dos salidas, y la elige él:

1. **Reescribir esas dos frases** evitando la palabra —por ejemplo «Examen Oficial de Talento Digital para Chile»—. No
   cambia ninguna decisión y deja el guardián intacto.
2. **Enmendar ADR-022 con una actualización fechada** que autorice nombrar el examen real con su nombre propio, y afinar
   el barrido para que admita **esa forma exacta** y ninguna otra, igual que se hizo con las dos frases del resultado. Es
   una decisión de producto: la palabra prohibida existe para que ninguna pantalla sugiera que este simulacro certifica
   algo.

Mientras no se resuelva, `probar:identidad` y `npm run verificar` quedan en rojo por ese motivo, y el criterio de
navegador sobre ADR-022 sigue sin marcar.

**Queda pendiente de la pasada del autor en el navegador**, sin marcar: los nueve criterios del bloque final. En
particular el de **ADR-022** —que ninguna frase sugiera que aprobar el simulacro equivale a aprobar el examen real—, que
el propio archivo declara no mecanizable. Y una anotación de esta etapa: **el menú de escritorio pasó de cinco a seis
enlaces**, así que conviene mirarlo cerca de 768 px; si aprieta, la salida barata es bajar `gap-7` a `gap-6` en los tres
encabezados.