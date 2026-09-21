# Iteración 44 · Resumen de resultados

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada · en tres etapas (A, B y C), construida a mano con la prueba antes del código
**Depende de:** iteración 43, cerrada el 2026-09-21.

## Objetivo

Cerrar el intento con un resumen que diga si se aprobó el simulacro, qué módulos estudiar, y por qué era correcta cada
respuesta. Y abrir el simulacro al resto del sitio: es la última iteración de la épica.

## Contexto

Es la pantalla que justifica todo el simulacro. Un porcentaje aislado no sirve de nada; lo útil es «fallaste 9 de 17
preguntas del módulo 5».

## Historial de este archivo

- **2026-09-16 · reescrita dos veces.** El autor fijó el vocabulario del resultado, la forma de la revisión en el teléfono,
  que las justificaciones se piden en el resumen y que se conserva el último resultado. La lectura de alcance mostró que la
  justificación de la 34 no está exportada y que los anclajes de la guía no llevan el número del módulo.
- **2026-09-21 · auditada tras cerrar la 43, y decididas las pendientes.** La auditoría encontró que la decisión 3 pedía las
  justificaciones a un extremo que, por ADR-035, no las devuelve ni admite otro parámetro; que «pregunta corregida» no
  estaba definida; que la decisión 5 se podía leer contra ADR-035; que faltaba la herencia de la 43; que una tarea no tenía
  criterio, y que no había criterios de foco ni de teclado. El autor cerró las decisiones 6 y 7, tomó la 8, la 9 y la 10, y
  se corrigieron la 3 y la 5. Las decisiones de detalle que solo tiene sentido tomar con el código delante quedan escritas
  como pendientes de la etapa B, en vez de asumirlas.

## Lo que hereda

- **Reglas del simulacro** (README de la épica): omitida cuenta como incorrecta; se aprueba con 72 de 120.
- **Actualización de ADR-022:** solo «Aprobaste el simulacro» y «Reprobaste el simulacro» en el resultado.
- **Iteración 41 y ADR-035:** el intento guardado con sus 120 preguntas congeladas —con su correcta y **sin**
  justificaciones— y el extremo `/api/preguntas?ids=`, que no devuelve justificaciones y rechaza cualquier otro parámetro.
  ADR-035 fija además que **no se guarda ningún resultado aparte**: se recalcula desde el intento.
- **Iteración 45:** el marcado estático del resumen en `dibujarPantallaDelResumen()` de
  `static/js/components/simulacro-maqueta.js`, que se mira con `simulacro.html?maqueta=resumen` y `&reprobado=1`, y el
  significado de cada color.
- **Iteración 34:** `justificacionDibujada()`, `porqueDibujado()` y `tieneJustificacion()` en `cuestionario.js`,
  **sin exportar y acopladas** a `bancoCargado` y a los estados «respondida en la visita / restaurada».
- **Iteración 43:**
  - **«Intento terminado» es transitoria, y esta iteración la reemplaza por el resumen.** Hoy se dibuja por dos caminos
    —el enganche `alTerminarElIntento` y `dibujarElRecorrido()` cuando no queda pregunta—, así que el primero no se puede
    probar (anotado en `registro_log.md`).
  - **La tarjeta del reprobado de la maqueta dice «No alcanzaste el 60 %».** La decisión 1 de aquí ya dice que va
    «Reprobaste el simulacro».
  - **«Intento listo» se retiró** (decisión 8 de la 43), y con él la única pantalla que mostraba el reparto por módulo. El
    desglose de esta iteración lo devuelve.
  - **El vocabulario de ADR-022 ya se vigila con guion**: la sección 17 de `scripts/probar-identidad-visual.mjs` barre el
    `<main>` de `simulacro.html`, las pantallas dibujadas y los literales de `simulacro.js` y `simulacro-maqueta.js`.
  - **El teclado del intento sigue el patrón del grupo de radio** (decisión 11 de la 43): el resumen no debería enseñar
    otra forma de moverse.
  - **Las pruebas del recorrido viven en `scripts/probar-cronometros.mjs`**, con el reloj controlable, el intento sembrado
    y la recarga simulada; y `probar-escapado.mjs` ya le cuela una pregunta hostil al intento por `?ids=` (sección 5c).
- **La guía:** `index.html#modulos` está en el HTML estático. Los `<article id="modulo-${i}">` de
  `components/modules.js:203` usan la **posición** y no el número del módulo, los crea JavaScript y llegan cerrados.

## Decisiones tomadas

### 1 · El resultado

Del autor, 2026-09-16.

- **«Aprobaste el simulacro»** con 72 correctas o más; **«Reprobaste el simulacro»** con 71 o menos.
- **Las omitidas y las agotadas sin alternativa cuentan como incorrectas.**

La maqueta de la 45 dice «No alcanzaste el 60 %» en la tarjeta del reprobado: esta iteración la cambia a la frase de arriba.

### 2 · La revisión en el teléfono

Del autor, 2026-09-16. **Agrupada por módulo, de peor a mejor desempeño.** En cada módulo, **las incorrectas y las omitidas
llegan abiertas** y **las correctas plegadas**, con un control para abrirlas. Cada pregunta muestra la alternativa dada (o
que se omitió), la correcta y la justificación.

### 3 · Las justificaciones se piden al llegar al resumen

Del autor, 2026-09-16. **Corregida el 2026-09-21:** decía que se piden «al extremo de la 41», y ese extremo no las
devuelve. Se piden **por los ids del intento, con el parámetro de la decisión 8**, y con la instantánea como respaldo si la
capa de datos falla. La justificación se dibuja con **una sola pieza extraída de la iteración 34**, que recibe la pregunta y
nada más; el cuestionario pasa a usar esa misma pieza.

### 4 · Si una pregunta se corrigió después del intento

Del autor, 2026-09-16, en la lectura de alcance de la 41. **El resultado se calcula con las preguntas tal como las vio el
estudiante.** Al pedir las justificaciones al banco vigente, el resumen compara: si una pregunta cambió desde el intento,
**la revisión muestra la versión corregida con un aviso** del tipo «Esta pregunta se corrigió después de tu intento». Qué
cuenta como cambio lo fija la decisión 9.

### 5 · Se conserva el último intento terminado

Del autor, 2026-09-16. **Corregida su redacción el 2026-09-21**, porque decía «el resumen queda en el navegador» y ADR-035
fija que no se guarda ningún resultado aparte. Lo que se conserva es **el intento terminado**, y **el resumen se recalcula
desde él** cada vez que se muestra. Queda hasta que se empieza otro intento, que lo reemplaza. No hay historial.

### 6 · Los enlaces a la guía van a `index.html#modulos`

Del autor, 2026-09-21. Ese destino está en el HTML estático de la portada y existe siempre. **La portada no se toca**: el
estudiante llega a la lista de los siete módulos y abre el suyo. La otra alternativa era cambiar `modules.js` para dar a
cada módulo un ancla con su número que lo abriera al llegar; se descartó para no extender la iteración a otra épica. El
resumen nombra el módulo en el desglose, así que el estudiante sabe cuál buscar.

### 7 · El desempate del desglose

Del autor, 2026-09-21, confirmando la propuesta: **de peor a mejor por porcentaje de correctas; a igual porcentaje,
primero el módulo con más omitidas; si sigue el empate, por número de módulo.** Se ordena por porcentaje y no por
cantidad de errores porque un módulo trae 18 preguntas y los demás 17.

### 8 · El extremo por ids sirve las justificaciones con `&con=justificacion`

Del autor, 2026-09-21. **Enmienda ADR-035** (escrita como actualización fechada al final de esa ADR).

- `/api/preguntas?ids=…&con=justificacion` devuelve **lo mismo que `?ids=…`** —las preguntas activas pedidas, con su
  versión vigente de enunciado, alternativas y correcta— **más la justificación** de cada una.
- `con` solo acepta el valor `justificacion`, y solo junto a `ids`. Cualquier otro valor, `con` sin `ids`, o `con` junto a
  `modulo` o `resumen`, se rechaza con `PETICION_INVALIDA`. Los límites de `ids` no cambian: 120 como máximo, troceados
  por dentro para respetar los 100 parámetros ligados de D1.
- `?ids=…` a secas **sigue sin justificaciones**: el intento sigue siendo liviano al empezar, que es lo que ADR-035 buscaba.
- **Una sola petición** trae las dos cosas que el resumen necesita: la justificación y la versión vigente para comparar.
  Si la capa de datos falla, la instantánea tiene las dos.

### 9 · Qué cuenta como «pregunta corregida después del intento»

Del autor, 2026-09-21. **Cuenta si cambió algo que el estudiante leyó**, comparando la copia congelada con la versión
vigente:

- el enunciado;
- el texto de alguna alternativa;
- cuál es la correcta, **comparada por texto**;
- o que la pregunta ya no esté activa.

**No cuentan** los ids de las alternativas renovados sin tocar sus textos —es la regla de ADR-034 para el cuestionario— ni
el orden de las alternativas, que se barajan igual (ADR-006).

**La justificación no entra en la comparación**: la copia congelada no la guarda, y el resumen siempre muestra la vigente.

**Una pregunta retirada** se muestra en su versión congelada, **con un aviso de que se retiró** después del intento y sin
justificación.

### 10 · Tres etapas, a mano

Del autor, 2026-09-21. La iteración va en tres etapas, cada una con su commit, y **una sola pasada del autor en el
navegador al final**, como la 41. Se construye **a mano, guiada paso a paso**, con la disciplina de la tanda 2 de la 43:
**cada prueba se escribe antes que su código y se ve en rojo por el motivo correcto**.

- **A · Lo que el resumen necesita.** La pieza de la justificación extraída de la 34, y el extremo de la decisión 8.
- **B · El resumen.** Resultado, desglose, tiempo, revisión, aviso de pregunta corregida, conservación y el reemplazo de
  «Intento terminado».
- **C · Abrir el simulacro al sitio.** Los enlaces al simulacro, los enlaces a la guía y el escapado de la revisión.

## Decisiones sin resolver

Se toman **al abrir la etapa B**, con el código delante. Cada una lleva una propuesta que no es decisión todavía.

### B1 · El tiempo promedio por pregunta

Propuesta: el tiempo transcurrido total, del comienzo del intento a la resolución de la 120, **dividido por 120**, en el
mismo formato que la franja. Con el sobrante perdido, el promedio nunca pasa de 30 segundos, y eso hay que decidir si se
dice o se deja implícito.

### B2 · Adónde va el foco al llegar al resumen

Propuesta: al título del resultado, con el mismo gesto que la decisión 4 de la 43 usa para el cambio de pregunta, y sin
región `aria-live`.

### B3 · Cómo se pliegan y se abren las correctas

Propuesta: un `<button>` por módulo con `aria-expanded` y `aria-controls`, que se opera con Enter y Espacio como cualquier
botón. Sin atajos de una tecla (decisión 11 de la 43).

### B4 · Cuál de los dos caminos a la pantalla final se conserva

Hoy «Intento terminado» se dibuja por `alTerminarElIntento` y por `dibujarElRecorrido()` sin pregunta. Al reemplazarla por
el resumen tiene que quedar **uno solo**, de modo que quitarlo dé rojo. La propuesta se hace mirando cuál de los dos
cubre también la recarga de un intento ya terminado.

## Tareas

### Etapa A · Lo que el resumen necesita

- [ ] Extraer la pieza de la justificación de la 34, exportada, que reciba la pregunta y nada más, y hacer que el
  cuestionario la use sin cambiar lo que muestra.
- [ ] Ampliar `/api/preguntas?ids=` con `&con=justificacion` (decisión 8).
- [x] Escribir la actualización fechada de ADR-035 en `decisiones.md` (decisión 8). Escrita el 2026-09-21, al preparar
  la iteración, antes de construir nada.
- [ ] Un servicio en el navegador que pida las justificaciones y la versión vigente por los ids del intento, con la
  instantánea como respaldo.

### Etapa B · El resumen

- [ ] Tomar las decisiones B1 a B4.
- [ ] Resultado global: correctas, respondidas mal, omitidas, porcentaje y resultado del simulacro (decisión 1).
- [ ] Desglose por módulo, ordenado de peor a mejor con el desempate de la decisión 7.
- [ ] Tiempo transcurrido total y promedio por pregunta (B1).
- [ ] Revisión agrupada por módulo (decisión 2), con los plegables de B3.
- [ ] Aviso de pregunta corregida o retirada después del intento (decisiones 4 y 9).
- [ ] Conservar el último intento terminado y recalcular el resumen desde él (decisión 5), con el botón para empezar otro.
- [ ] Reemplazar «Intento terminado» por el resumen, por un solo camino (B4).
- [ ] Cambiar la tarjeta del reprobado de la maqueta a «Reprobaste el simulacro» (decisión 1).
- [ ] Llevar el foco al resumen al llegar (B2).
- [ ] Agregar a las pantallas de la sección 17 de `probar-identidad-visual.mjs` el resumen dibujado con un intento de
  verdad, aprobado y reprobado, y no solo la maqueta.

### Etapa C · Abrir el simulacro al sitio

- [ ] Enlazar el simulacro desde `index.html` (menú de escritorio y móvil, la sección `#repaso` y el pie) y desde
  `cuestionario.html` (menú de escritorio y móvil y pie), con la marca de página activa en `simulacro.html`. Las líneas
  exactas se comprueban al abrir la etapa.
- [ ] Enlaces a la guía, a `index.html#modulos` (decisión 6).
- [ ] Agregar a `probar:escapado` el bloque de la revisión: enunciado, alternativas y justificación.

## Criterios de aceptación

Cada uno se cierra con evidencia **provocada**, con intentos sembrados de resultado conocido y el reloj controlable de la
42, y con su prueba vista en rojo por el motivo correcto antes de escribir el código.

### Etapa A · Se provocan con guion

- [ ] **`?ids=…&con=justificacion` devuelve las mismas preguntas que `?ids=…`, más su justificación**, y `?ids=…` a secas
  sigue sin justificaciones.
- [ ] **`con` con otro valor, `con` sin `ids`, y `con` junto a `modulo` o `resumen` se rechazan con `PETICION_INVALIDA`.**
- [ ] **120 ids con justificación se sirven en una sola petición**, troceados por dentro como hasta ahora.
- [ ] **Con la capa de datos caída**, simulado interceptando, el servicio del navegador devuelve justificaciones y versión
  vigente desde la instantánea.
- [ ] **La justificación del cuestionario se dibuja con la pieza extraída**, y `probar:memoria`, `probar:filtrado` y
  `probar:escapado` siguen en verde sin cambios de comportamiento.

### Etapa B · Se provocan con guion

- [ ] **Las cifras cuadran**: correctas + respondidas mal + omitidas = 120.
- [ ] **El umbral es exacto en el borde**: 72 correctas dicen «Aprobaste el simulacro» y 71 «Reprobaste el simulacro».
- [ ] **Una agotada con alternativa marcada** cuenta según esa alternativa; **una agotada sin alternativa**, como omitida.
- [ ] **El desglose por módulo suma 120** y respeta el orden y el desempate de la decisión 7, provocado con intentos
  construidos para empatar en porcentaje y en omitidas.
- [ ] **El tiempo total y el promedio por pregunta** salen de los instantes guardados según B1, y el reloj controlable
  los fija a valores conocidos.
- [ ] **La revisión agrupa por módulo, en el orden del desglose**, con incorrectas y omitidas abiertas y correctas
  plegadas, y el control de plegado declara su estado según B3.
- [ ] **Cada pregunta de la revisión muestra la alternativa dada o que se omitió, la correcta y la justificación de esa
  pregunta**, y no la de otra.
- [ ] **Con una pregunta cambiada en el banco después del intento**, simulado interceptando, el resultado no cambia y la
  revisión muestra la versión corregida con el aviso. **Con los ids renovados y los textos intactos, no hay aviso.** **Con
  una pregunta retirada**, se muestra la versión congelada con el aviso de retiro (decisión 9).
- [ ] **Tras simular una recarga en el resumen**, se muestra el mismo resultado, recalculado desde el intento y sin ningún
  resultado guardado aparte; **al empezar otro intento**, el anterior deja de estar guardado y la selección es nueva.
- [ ] **Al resolverse la pregunta 120 se dibuja el resumen**, por un solo camino, y quitar ese camino da rojo (B4).
- [ ] **Al llegar al resumen, el foco queda donde dice B2.**
- [ ] **Vocabulario de ADR-022:** la sección 17 de `probar-identidad-visual.mjs`, con el resumen de verdad entre sus
  pantallas, sigue en verde, y el resultado usa exactamente una de las dos frases permitidas.
- [ ] **`probar:cronometros` e `probar:identidad` siguen en verde.**

### Etapa C · Se provocan con guion

- [ ] **El simulacro es alcanzable** desde el menú de escritorio, el menú móvil y el pie de las tres páginas y desde la
  sección `#repaso`, comprobado sobre el HTML, y **`comprobar-copias.mjs` sigue en verde**.
- [ ] **Los enlaces a la guía apuntan a `index.html#modulos`, y ese `id` existe en el HTML estático de la portada.**
- [ ] **`probar:escapado` cubre la revisión**: una pregunta hostil en el intento, con su justificación hostil, llega como
  texto en el enunciado, las alternativas y la justificación, sin etiquetas ajenas.
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

- **Que aprobar el simulacro signifique aprobar el examen real.** El examen real mezcla programación, dura 120 minutos y no
  tiene las reglas del simulacro; y el simulacro no puede garantizar que no se hayan visto las respuestas (ADR-022).
- **Que el enlace a la guía lleve al módulo exacto.** Lleva a la lista de los siete (decisión 6).

## Notas de la iteración

_Pendiente._