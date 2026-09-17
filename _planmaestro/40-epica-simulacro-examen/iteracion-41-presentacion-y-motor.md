# Iteración 41 · Presentación, selección y protección del intento

**Épica:** 40 · Simulacro de examen
**Estado:** 🔵 En curso · lectura de alcance hecha el 2026-09-16; decisiones cerradas; en tres etapas
**Depende de:** épica 30 cerrada (cumplido) y la actualización de ADR-022 escrita en `decisiones.md` (cumplido el
2026-09-16).
**Siguiente en el orden de trabajo:** iteración 45.

## Objetivo

Crear `simulacro.html` con su pantalla de presentación, elegir en el navegador las 120 preguntas de un intento, traerlas con
un extremo de solo lectura, y guardar el intento para que sobreviva a una recarga, todavía sin cronómetros ni recorrido.

## Contexto

La página no arranca respondiendo, arranca explicando. Esta iteración deja lista la maquinaria sobre la que la 42, la 43 y la
44 construyen: un intento elegido, cargado y guardado.

## Historial de este archivo

- **2026-09-04 · anotadas** las preguntas hermanas.
- **2026-09-16 · reescrita tres veces.** La segunda, tras la lectura de alcance de la épica: el navegador elige y el extremo
  solo sirve. La tercera, tras la lectura de alcance de esta iteración: el autor resolvió el encabezado y el pie, el corte en
  etapas, el paso de «una sola pestaña» a la iteración 42, qué pasa si se corrige una pregunta durante un intento, cuándo se
  pide la lista de ids y qué pasa si el almacenamiento se llena. Se agregaron las correcciones técnicas de la lectura.
- **2026-09-16 · decisiones del plan de la etapa B.** D1 acepta como máximo 100 parámetros ligados por consulta (provocado):
  el extremo trocea. El autor decidió rechazar ids repetidos, que la etapa B termine con un aviso «Intento listo» y que la
  prueba de escapado del simulacro pase a la 43, y que el código viva en las carpetas existentes. Los enlaces al simulacro
  pasan a la iteración 44, y el orden de los módulos al elegir se sortea en cada intento.

## Lo que hereda

- **ADR-008 · modo degradado** (`decisiones.md:163-190`; `servicios/datos.js:136-150`, `:197-214`).
- **ADR-009:** el Worker solo expone lectura; `soloLectura()` (`functions/api/_comun.js:152-180`) rechaza lo demás.
- **ADR-022 con su actualización del 2026-09-16:** las correctas viajan al navegador; vocabulario del resultado.
- **ADR-033:** `?resumen=1` entrega `preguntas_ids` por módulo (`preguntas.js:104-115`), también desde la instantánea
  (`datos.js:239-263`). Lee 1111 filas por petición.
- **ADR-034 y sus actualizaciones:** espacio `examen-td-js.simulacro.` (`decisiones.md:2299`); versión dentro del dato; un
  dato que no se entiende se ignora (`memoria.js:220-261`); se guarda al ocurrir; sonda de escritura global y
  `sePuedeGuardar()` (`memoria.js:143-172`).
- **Iteración 35 · transición de carga** en `cuestionario.js`, sin exportar: `dibujarTransicion()` `:914`, `cargaEnCurso`
  `:222`, `abrirLaCarga()` `:237`, `cerrarLaCarga()` `:260`, `esperarElPiso()` `:281`, `decirQueEstaTardando()` `:966`,
  `fijarControlesDelPanel()` `:1005` (cableada a `#reiniciar` y `#repaso`), `peticionVigente` `:129`. Las constantes
  `PISO_DE_LA_TRANSICION_MS` y `PLAZO_DE_CARGA_LENTA_MS` sí están exportadas y `probar-filtrado.mjs:1488` las importa desde
  ese archivo.
- **`utils/dom.js`:** `esc()`, `shuffle()`, `prefersReducedMotion()`.
- **Lo que no existe:** ni `beforeunload`, `pagehide`, `visibilitychange`, `sessionStorage`, `BroadcastChannel`,
  `navigator.locks` ni oyentes de `storage`.

## Decisiones tomadas

Todas del autor, 2026-09-16.

### 1 · El navegador elige; el extremo solo sirve

- El navegador parte de los `preguntas_ids` de `?resumen=1`, elige y pide las elegidas a un **extremo de solo lectura por
  id** (`?ids=…`), que no elige, no reparte ni excluye, y reutiliza `SQL_PREGUNTAS`, `sqlAlternativas()` y
  `validarPreguntas()` sin copiarlas y sin romper a `generar-instantanea.mjs`, su único importador externo.
- En modo degradado, el mismo código elige desde la instantánea. **El algoritmo no sabe de qué camino vienen los ids.**
- **Las justificaciones no viajan con el intento** (se piden en la 44).
- Motivos: `vision.md:68-70` y el precedente de `generar-instantanea.mjs` de no duplicar lógica.
- **Forma del extremo:** `?ids=` con un máximo de 120; mal formados, **repetidos**, o combinados con `?modulo` o
  `?resumen` → `PETICION_INVALIDA`; inexistentes o retirados no vuelven. D1 admite **100 parámetros ligados por consulta**
  (provocado el 2026-09-16), así que el extremo trocea por dentro en un solo `batch`.
- Se documenta en una **ADR nueva**, que incluye: por qué el extremo no puede cachearse nunca; por qué aquí las preguntas se
  guardan congeladas (decisión 6), apartándose de ADR-034; la forma del extremo; y el costo medido en filas leídas.

### 2 · Reparto parejo

**17 por módulo y la número 120 en un módulo elegido al azar.** Conteos al 2026-09-16: módulo 2: 52 · 3: 61 · 4: 61 · 5: 49
· 6: 52 · 7: 48 · 8: 45.

### 3 · Exclusión de preguntas hermanas en todo el intento

- La tabla se colapsa en **grupos**: ocho pares y un trío. Un intento trae como máximo una pregunta de cada grupo.
- La exclusión es **global**: se arrastra un conjunto de prohibidos mientras se elige, así el par 25 ↔ 107 (módulos 2 y 3) no
  obliga a deshacer elecciones.
- **El orden en que se recorren los módulos se sortea en cada intento**, para que ninguna pregunta de un grupo que cruza
  módulos salga menos veces por estar en un módulo que elige después.
- La lista vive en **`static/js/data/`**, como archivo de datos importado por el único módulo del algoritmo.
- Con el banco actual, el módulo más apretado conserva 44 elegibles para una cuota máxima de 18.

### 4 · Reservas hasta 120

Si una pregunta pedida no vuelve o la validación la descarta, se repone **del mismo módulo con la misma regla de exclusión**.
Si un módulo se queda sin candidatos, **el intento no empieza** y se explica por qué. Un intento siempre tiene 120 preguntas.

### 5 · Todo se pide al pulsar «Comenzar»

La presentación **no pide nada**. Al pulsar, **una sola transición** cubre la lista de ids y las preguntas elegidas. En modo
degradado, la instantánea se descarga después del clic, bajo esa misma transición.

### 6 · El intento se guarda al ocurrir, con lo que el estudiante vio

- Se guarda en el navegador, bajo `examen-td-js.simulacro.`, al empezar y en cada cambio, nunca al salir.
- **Se guardan las preguntas tal como llegaron**, con sus alternativas y cuál era la correcta.
- **El resultado se calcula con lo que el estudiante vio.** Si una pregunta se corrigió después, la revisión de la 44 lo
  avisa (ver la 44).
- **El formato se diseña ahora con los campos que usarán la 42, la 43 y la 44** (instantes, posición, alternativa marcada,
  respuestas, omitidas, resultado conservado), para no cambiar de versión a mitad de épica.
- **Las preguntas y las respuestas van en claves separadas**: las preguntas se escriben una vez; las respuestas, en cada
  cambio. No se reescriben 79 KB por respuesta.
- Al volver con un intento en curso, se retoma. (Cómo cuenta el tiempo al volver es de la 42.)

### 7 · Sin almacenamiento, o si se llena

- **Sin almacenamiento al empezar**, el intento funciona durante la visita y se avisa que no sobrevive a una recarga.
- **Si una escritura falla a mitad del intento** (por ejemplo, almacenamiento lleno), aparece un aviso del tipo «Tu intento
  ya no se está guardando: si recargas la página, se pierde», y el intento sigue.

### 8 · Encabezado y pie: tercera copia vigilada

`simulacro.html` lleva su **propia copia** del encabezado y el pie, en HTML. Se agrega una **comprobación automática** que
compara las tres copias y da rojo si difieren fuera de las **diferencias permitidas**, escritas en la propia comprobación:
destino del logotipo y de los enlaces (ancla o `index.html#ancla`), la marca de la página activa, comentarios, y el nodo
`#estado-datos` del cuestionario.

### 9 · La transición de carga es la de la iteración 35, extraída

Se extrae a un módulo propio que recibe como parámetros el contenedor, los textos, los selectores de los controles a
desactivar y los ids de sus nodos, y **se lleva el contador de peticiones con el registro** (no pueden separarse). El
cuestionario la usa igual que hoy. Las dos constantes siguen importables desde donde las importa `probar-filtrado.mjs`.

### 10 · El algoritmo es una función con su azar inyectado

Recibe los ids por módulo, la lista de hermanas y la **fuente de azar**. Así la muestra de 200 intentos es repetible, y
`probar-escapado.mjs` puede colar la pregunta hostil interceptando la respuesta del extremo.

### 11 · Al terminar la carga, «Intento listo»

Mientras no exista el recorrido (43), la etapa B termina con un aviso **«Intento listo»** que dice cuántas preguntas trajo
y de qué módulos, **sin dibujar texto del banco**. La prueba de escapado del simulacro se escribe en la 43, contra el dibujo
real de las preguntas.

### 12 · Código en las carpetas existentes

El algoritmo va en `static/js/servicios/`, las hermanas en `static/js/data/`, los componentes en `static/js/components/`.
No se crea una carpeta propia del simulacro.

### 13 · Los enlaces al simulacro se agregan en la iteración 44

Hasta tener recorrido y resumen, el simulacro no se enlaza desde ninguna parte: un estudiante que entrara desde el menú no
podría hacer nada después de «Comenzar».

### 14 · «Una sola pestaña» pasa a la iteración 42

La coordinación entre pestañas necesita un vencimiento por tiempo (si la pestaña dueña se cierra, la otra no puede quedar
bloqueada para siempre) y la misma infraestructura del DOM falso que el reloj controlable. **No es parte de esta iteración.**

## Etapas

Cada etapa cierra con su evidencia antes de empezar la siguiente.

- **Etapa A · la página.** `simulacro.html` sobre `ink` con la tercera copia vigilada, la presentación con su botón (todavía
  sin conectar), el registro en `build-dist.mjs`, y la extracción de la transición con el cuestionario intacto. **Los enlaces
  desde menús, pie y portada no se agregan en esta etapa**, para no enlazar una página a medias.
- **Etapa B · elegir y traer.** Archivo de hermanas, algoritmo, extremo por ids, modo degradado con su aviso, y botón
  conectado con la transición hasta «Intento listo».
- **Etapa C · guardar y retomar.** Formato del intento, guardado, retoma, dato corrupto, sin almacenamiento, almacenamiento
  lleno y la ADR nueva.

## Tareas

- [ ] **A ·** Crear `simulacro.html` sobre `ink` con encabezado y pie copiados (decisión 8) y la presentación con su botón.
- [ ] **A ·** Crear la comprobación de las tres copias del encabezado y el pie.
- [ ] **A ·** Agregar `simulacro.html` a `LISTA_COPIA` y a `PAGINAS` en `scripts/build-dist.mjs:63-70`.
- [ ] **A ·** Extraer la transición de carga (decisión 9).
- [ ] **B ·** Crear el archivo de datos de hermanas con los grupos de la tabla.
- [ ] **B ·** Crear el algoritmo de selección (decisiones 2, 3, 4 y 10).
- [ ] **B ·** Provocar primero el límite de parámetros ligados de D1 con 120 ids, y crear el extremo por ids.
- [ ] **B ·** Conectar el botón: lista de ids, elección y carga bajo una sola transición (decisión 5), con modo degradado.
- [ ] **B ·** Extraer el aviso de modo degradado del cuestionario a un componente, sin cambiar lo que dibuja.
- [ ] **B ·** Agregar los archivos nuevos a `DONDE_BARRER` de `probar-filtrado.mjs`.
- [ ] **C ·** Diseñar el formato del intento (decisión 6) y guardarlo, retomarlo e ignorar datos ininteligibles.
- [ ] **C ·** Avisos sin almacenamiento y con almacenamiento lleno (decisión 7).
- [ ] **C ·** Escribir la ADR nueva.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, salvo donde se indica.

### Los provoca Claude Code

**Etapa A · la página**

- [ ] **`simulacro.html` usa `ink` de fondo** y su encabezado, pie y favicon son copia de los de las otras páginas.
- [ ] **La comprobación de las copias da rojo** al introducir en una copia una diferencia no permitida, y verde con las
  diferencias permitidas.
- [ ] **`npm run build` copia `simulacro.html` a `dist/`** y comprueba sus enlaces sin recursos rotos.
- [ ] **La transición extraída se usa en el cuestionario** y `probar:filtrado` sigue en verde con sus mediciones y sus rojos
  de la 35 (H-1, piso, texto lento, movimiento reducido).
- [ ] **El cuestionario no cambia lo que dibuja** durante la carga: el HTML de la transición es el mismo antes y después de
  la extracción.

**Etapa B · elegir y traer**

- [ ] **Con 120 ids en una sola petición**, el extremo responde bien; si D1 limita los parámetros por debajo de eso, se
  informa el límite medido y cómo se resolvió.
- [ ] **El extremo devuelve exactamente las preguntas pedidas**, sin justificaciones, con el contrato de `_comun.js`; los ids
  inexistentes o retirados no vuelven, y los repetidos se tratan según la ADR.
- [ ] **Rechaza una lista mal formada** con `PETICION_INVALIDA`, y lo que no es lectura por `soloLectura()`.
- [ ] **`generar-instantanea.mjs` sigue funcionando** sin cambios de comportamiento.
- [ ] **Sobre 200 intentos con azar fijado**, cada intento trae 120 preguntas distintas y activas, con 17 por módulo y un
  módulo con 18; se informa cuántas veces le tocó el extra a cada módulo.
- [ ] **Ningún intento de la muestra trae dos preguntas de un mismo grupo**, incluidos el par 25 ↔ 107 y el trío 205, 210,
  222.
- [ ] **El solapamiento promedio entre intentos es como mucho 42 preguntas** (esperado 38,9); más es rojo.
- [ ] **Con un id de hermana retirado del resumen**, simulado interceptando, el algoritmo sigue funcionando.
- [ ] **Con preguntas descartadas o que no vuelven**, simulado interceptando, el intento se completa con reservas del mismo
  módulo hasta 120.
- [ ] **Con descartes que impiden reunir 120**, el intento no empieza y la pantalla lo explica.
- [ ] **Antes de pulsar «Comenzar» no sale ninguna petición**; al pulsar salen la del resumen y la del extremo, bajo una sola
  transición medida como `max(carga, 400 ms)` desde el clic.
- [ ] **En modo degradado**, provocado, el intento se elige desde la instantánea y el aviso de ADR-008 queda visible.
- [ ] **El algoritmo existe una sola vez**: el camino normal y el degradado importan la misma función (se comprueba leyendo
  los imports; es el único criterio que no se provoca).
- [ ] **Al terminar la carga aparece «Intento listo»** con la cantidad por módulo, y el HTML dibujado no contiene texto del
  banco.
- [ ] **El orden de los módulos varía entre intentos de la muestra**, y las preguntas 25 y 107 salen con frecuencias
  compatibles con el azar.
- [ ] **El aviso de modo degradado extraído dibuja en el cuestionario lo mismo que antes**, comprobado byte a byte.
- [ ] **Se informan las filas leídas** por el resumen y el extremo en un intento. Si el entorno local no las reporta, se
  deja dicho y la medición pasa a la pasada del autor.

**Etapa C · guardar y retomar**

- [ ] **Al empezar, el intento queda guardado** bajo `examen-td-js.simulacro.` con versión dentro del dato, preguntas y
  respuestas en claves separadas, y los campos previstos para la 42, la 43 y la 44.
- [ ] **Un cambio de respuesta reescribe solo su clave**, no la de las preguntas.
- [ ] **Simulando una recarga**, el intento se retoma con las mismas 120 preguntas en el mismo orden.
- [ ] **Con el banco cambiado entre la carga y la recarga**, simulado interceptando, el intento retomado conserva las
  preguntas como llegaron.
- [ ] **Un dato guardado corrupto o de otra versión se ignora** sin romper la página.
- [ ] **Sin almacenamiento**, el intento empieza y se avisa que no sobrevive a una recarga.
- [ ] **Con una escritura que falla a mitad del intento**, simulada, aparece el aviso de la decisión 7 y el intento sigue.

**Todas las etapas**

- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **A ·** La presentación se entiende sin tecnicismos, leída en el teléfono, y el encabezado y el pie se ven igual que en
  las otras páginas.
- [ ] **B ·** Al pulsar «Comenzar», la transición se siente igual que en el cuestionario, con buena conexión y con la red
  limitada.
- [ ] **B ·** Si el entorno local no reporta filas leídas, se miden contra producción con una petición de lectura.
- [ ] **C ·** Recargar a mitad del intento lo retoma, en escritorio y en teléfono.
- [ ] **Cada etapa ·** Sin errores de consola.
- [ ] **Cada etapa ·** `npm run verificar` termina en 0, con `npm run datos:dev` levantado.

## Preguntas hermanas

*Anotadas el 2026-09-04. Ancladas a ids de D1 el 2026-09-16: las citas `m0X#N` coinciden con `numero_origen` del banco
`json_2026`; las citas `MX·N` del banco `js_2026` están desplazadas por retiros, y se agrega su `numero_origen` real. Lo que
ancla cada fila es el id y el enunciado, comprobados en la lectura de alcance.*

| Par (cita original) | `numero_origen` real en js_2026 | Se rozan en | id A | id B | Módulos |
|---|---|---|---|---|---|
| m08#3 ↔ M8·2 | 1 | cómo nombrar un endpoint / cómo estructurar el de un recurso | 326 | 360 | 8 / 8 |
| m05#38 ↔ M5·13 | 10 | objetivo de normalizar / objetivo de la 3FN | 210 | 222 | 5 / 5 |
| m05#33 ↔ M5·13 | 10 | dependencia transitiva / objetivo de la 3FN | 205 | 222 | 5 / 5 |
| m05#30 ↔ M5·12 | 9 | entidad fuerte / entidad débil | 202 | 221 | 5 / 5 |
| m02#26 ↔ M2·8 | 6 | evento `change` / evento `blur` | 26 | 45 | 2 / 2 |
| m07#12 ↔ M7·7 | 5 | `rows` / `rowCount` | 287 | 318 | 7 / 7 |
| m05#26 ↔ M5·11 | 8 | `DROP` / `TRUNCATE`, contrastados con `DELETE` | 198 | 220 | 5 / 5 |
| m05#16 ↔ M5·10 | 7 | violar una llave foránea / qué restricción la impone | 189 | 219 | 5 / 5 |
| m02#25 ↔ M3·7 | 5 | `let` sobre `var` al iterar / iteradoras globales anidadas | 25 | 107 | **2 / 3** |
| m03#33 ↔ M3·13 | 10 | notación de corchetes / notación de punto | 85 | 112 | 3 / 3 |

**Grupos para el algoritmo:** {326, 360} · {205, 210, 222} · {202, 221} · {26, 45} · {287, 318} · {198, 220} · {189, 219} ·
{25, 107} · {85, 112}. Son 19 preguntas en nueve grupos.

**Avisos:** la exclusión es global por el par 25 ↔ 107; el módulo 5 aporta 9 de sus 49 preguntas; la lista sale de
`npm run informe-banco`, que compara redacción y no significado; un id retirado deja de aparecer en `preguntas_ids` y su
grupo se vuelve inerte solo. Las citas `m0X#N` remiten a `_planmaestro/00_producto/cuestionarios/modulo-0X.json` (ADR-031).

## Lo que esta iteración no puede afirmar

- **Que un intento no se pueda inspeccionar**: las respuestas viajan al navegador (ADR-022).
- **Que dos intentos seguidos no repitan preguntas**: sin historial, cada uno se elige sin saber del anterior.
- **Que un intento sobreviva a borrar los datos del navegador** o a cambiar de dispositivo.
- **Que dos pestañas no se pisen**: se resuelve en la iteración 42.
- **Que pedir 120 preguntas por id lea pocas filas**: la vista `pregunta_activa` entra por el índice de estado y no por la
  clave primaria. Se mide y queda para la épica 50.

## Notas de la iteración

_Pendiente._