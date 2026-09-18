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
  módulos salga menos veces por estar en un módulo que elige después. *(Corrección del 2026-09-18, al abrir la etapa C:
  esta frase hablaba del orden en que se **elige**, y añadía que el orden de las preguntas dentro del intento «lo decide
  quien las dibuja». **Ya no**: lo fija el algoritmo. Ver la corrección fechada más abajo.)*
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

## Corrección fechada · 2026-09-18 · el orden del intento lo fija el algoritmo

**Decisión del autor**, tomada al aprobar el plan de la etapa C.

La decisión 3 decía que el sorteo del recorrido «no cambia el orden de las preguntas dentro del intento: eso lo decide
quien las dibuja». **Deja de ser así.** Las 120 se entregan **mezcladas, sin agrupar por módulo**, y el orden se fija al
elegir: se baraja el conjunto completo con la misma fuente de azar inyectada, **después** del reparto y de la exclusión de
hermanas, para que mezclar no pueda alterar ninguna de las dos.

**El motivo es de producto.** En el examen real las preguntas vienen en orden aleatorio, y **cambiar de tema de golpe es
parte de lo que el simulacro entrena**. Un intento ordenado por módulo entrena otra cosa —responder de corrido sobre un
tema que ya se tiene en la cabeza—, que es justo lo que el cuestionario ya hace.

**Qué cambia y qué no.**

- **Cambia** `elegirIntento()`, que devuelve `ids` barajados entre módulos en vez de agrupados del 2 al 8; y la reposición
  de reservas, que ahora trabaja sobre **ranuras**: lo que no vuelve deja su sitio vacío y la reserva entra en ese mismo
  sitio. Si las reservas se agregaran al final, un intento con nueve descartes traería las nueve reposiciones juntas al
  terminar, que es el agrupamiento que barajar viene a evitar.
- **No cambia** el formato guardado: el arreglo de la copia congelada ya era el orden del intento.
- **No cambia** el sorteo del recorrido de la decisión 3, que sigue existiendo por el par {25, 107} y sigue sin verse en
  ninguna parte. Son dos sorteos distintos: uno decide **en qué orden se elige** y el otro **en qué orden se responde**.

**Cómo se vigila.** Dos comprobaciones por intento, en `scripts/probar-filtrado.mjs` sobre la muestra de 200, y una más
sobre el intento retomado en `scripts/probar-memoria.mjs`:

- **cambios de módulo**, cuántas veces la pregunta siguiente es de otro módulo. Agrupado por módulo son exactamente 6, una
  por frontera; barajado, alrededor de 102. El mínimo exigido es 80.
- **la racha más larga** de preguntas seguidas del mismo módulo. Agrupado son 17 o 18; el tope exigido es 8.

Se vigilan las dos y no una: la primera caza el agrupamiento entero, la segunda caza un agrupamiento parcial que podría
dejar la primera por encima del umbral.

## Notas de la iteración

### 2026-09-18 · Etapa C: el intento guardado

**El formato, aprobado por el autor el 2026-09-18** tras el plan del paso 0, con dos cambios suyos: las 120 van
mezcladas (corrección fechada de más arriba) y **el resultado calculado no se guarda**.

**Dos claves, bajo `examen-td-js.simulacro.`:**

| Clave | Qué guarda | Cuándo se escribe | Peso medido |
|---|---|---|---|
| `…preguntas` | La copia congelada: las 120 tal como llegaron, con sus alternativas y su correcta, en el orden del intento | **Una vez**, al armarse | **78 623 B · 76,8 KiB** |
| `…respuestas` | Todo lo que cambia: `empezado_en`, `posicion`, `comenzada_en`, `terminado_en` y `respuestas[]` | En cada cambio | 158 B vacía · **12 996 B · 12,7 KiB** con las 120 |
| `…dueno` | *Reservada para la iteración 42.* No se escribe en esta iteración | — | — |

Un intento completo son 121 escrituras y **850,2 KiB**. Con las preguntas en la misma clave serían **10 056,4 KiB, 11,8
veces más**, y la escritura número 120 costaría 91 556 bytes en vez de 12 996. Medido, no supuesto: es lo que justifica
la separación de la decisión 6.

**Cada entrada de `respuestas[]`:** `pregunta_id`, `alternativa_id` —el id **dentro de la copia congelada**, o `null` si
se omitió—, `estado`, `agotada` y `resuelta_en`. Los dos últimos son de la iteración 42.

**Lo que no está:** no hay campo `resultado`. Se recalcula desde la copia congelada y las respuestas, que ya están las
dos guardadas. Una segunda fuente de verdad para un número derivable es justo lo que ADR-034 no admite.

**Todo lo demás está en ADR-035**, que escribe esta etapa: por qué el navegador elige, la forma del extremo por ids con
el límite de 100 parámetros de D1, por qué ese extremo no se puede cachear nunca, el costo medido en filas leídas, la
regla de no mezclar bancos de H-024, por qué las preguntas se congelan apartándose de ADR-034 y cómo la 44 avisa de una
pregunta corregida, por qué el resultado no se guarda, y por qué aquí sí se coordinan las pestañas.

**Lo que se agregó al sitio.** `static/js/servicios/intento-guardado.js` (las claves, el formato y las lecturas),
`static/js/components/aviso-de-guardado.js` (los dos estados del aviso de la decisión 7), el hueco `#aviso-guardado` en
`simulacro.html`, y en `components/simulacro.js` el guardado al armar, la retoma al abrir y la costura
`anotarEnElIntento()` que la iteración 43 va a conectar al botón de avanzar. La sonda de escritura **no se duplicó**: se
exportó `almacenDelNavegador()` de `servicios/memoria.js`, porque la sonda es de toda la página y no del cuestionario.

**Lo que lo vigila.** `scripts/probar-memoria.mjs`, sección **12**, con el mismo orquestador de siempre —un proceso por
visita, el almacén persistido a un archivo— y un interruptor `pagina: 'simulacro'`. Nueve casos: el guardado al empezar,
que responder reescriba una sola clave, la retoma, el banco cambiado entre la carga y la recarga, cinco formas de dato
que no se entiende, tres formas de navegador sin almacenamiento, el almacén sin sitio para la copia congelada, el
almacén que se llena a mitad, y «Empezar otro intento» tanto cuando funciona como cuando falla.

**Dos huecos que aparecieron mutando y quedaron cerrados.**

- `almacenDeMentira()` solo sabía decir que no a **todas** las escrituras. Con eso no se podía provocar ni el almacén que
  se llena a mitad del intento —el caso que la decisión 7 nombra— ni el que tiene sitio para las respuestas y no para los
  76,8 KiB de la copia congelada, que es el único donde puede quedar **media copia** guardada. Ahora tiene
  `prohibirEscritura()` y un `cupo` en bytes.
- Nada probaba que «Empezar otro intento» **olvide el anterior antes de pedir nada**. Quitando esa llamada todo seguía en
  verde, y sin embargo el fallo es feo: la pantalla diciendo que no se pudo armar ninguno y, al recargar, un intento que
  ya se había dado por perdido.

**Una comprobación de la etapa B que daba rojo por un comentario.** La de «el algoritmo existe una sola vez» contaba
apariciones de `elegirIntento(` en el archivo, y un comentario nuevo que la nombraba la puso en rojo con el código
intacto. Ahora cuenta llamadas: quita los comentarios antes de contar. Un rojo que se dispara por un comentario enseña a
no creerle a la comprobación.

### Lista de verificación de navegador · etapa C

*Escrita el 2026-09-18. Cubre solo lo de esta etapa; la de la etapa B sigue valiendo entera.*

**Antes de empezar:** `npm run datos:dev` levantado, DevTools abierto en **Aplicación → Almacenamiento local →
`http://127.0.0.1:8788`**, y la **Consola** a la vista.

| # | Qué hacer | Qué deberías ver | Qué cuenta como falla |
|---|---|---|---|
| 1 | Abrir `simulacro.html` y pulsar «Comenzar el simulacro» | Al terminar la carga, «Intento listo» con los siete módulos. En Almacenamiento local aparecen **dos** claves: `examen-td-js.simulacro.preguntas` y `…respuestas` | Que no aparezca alguna de las dos, o que aparezca alguna clave más del simulacro |
| 2 | Abrir el valor de `…preguntas` | Empieza por `{"v":1,"intento_id":"…"` y trae 120 preguntas con sus alternativas y su `es_correcta`. Pesa alrededor de **77 KiB** | Que no traiga `v`, que traiga menos de 120, o que traiga `justificacion` |
| 3 | Abrir el valor de `…respuestas` | Mismo `intento_id` que la otra, `posicion: 0`, `respuestas: []`, y los campos `empezado_en`, `comenzada_en` y `terminado_en` | Que el `intento_id` no coincida, o que aparezca un campo `resultado` |
| 4 | **Recargar la página** (F5) | Sale **«Intento retomado»** con las mismas cuentas por módulo, y un botón «Empezar otro intento». En la pestaña **Red**, **ninguna** petición a `/api/` | Que vuelva la presentación, que las cuentas cambien, o que salga cualquier petición a `/api/` |
| 5 | Recargar dos veces más | Siempre «Intento retomado», siempre las mismas cuentas | Que alguna vez cambien |
| 6 | **Dato corrupto.** En Almacenamiento local, editar `…respuestas` y cambiar `"v":1` por `"v":99`. Recargar | Vuelve la **presentación**, como si no hubiera intento. **Sin errores en la consola** y sin ningún aviso en pantalla | Cualquier error de consola, una página en blanco, o un aviso hablando del formato |
| 7 | **La otra mitad.** Deshacer lo anterior, y ahora borrar solo la clave `…preguntas`. Recargar | Lo mismo: la presentación, en silencio | Que retome un intento con respuestas y sin preguntas |
| 8 | **`intento_id` cruzado.** Volver a empezar un intento, y luego editar `…respuestas` cambiando su `intento_id` por cualquier otro texto. Recargar | Lo mismo: la presentación, en silencio | Que retome |
| 9 | **Sin almacenamiento.** Chrome → candado de la barra → *Configuración del sitio* → **Cookies y datos del sitio: Bloquear**. Recargar y pulsar «Comenzar» | El intento se arma igual, con sus 120, y arriba sale el aviso **«Tu intento no se está guardando.»**, que dice que al recargar el intento se pierde | Que el intento no se arme, o que no salga el aviso |
| 10 | Con el bloqueo puesto, recargar | Vuelve la presentación —no hay nada guardado— y no hay ningún error | Un error de consola |
| 11 | Quitar el bloqueo, recargar y empezar otro intento | El aviso **desaparece** y las dos claves vuelven a escribirse | Que el aviso siga puesto |
| 12 | **Almacenamiento lleno.** Con un intento en curso, abrir la Consola y llenar el almacén: `try { let b = 'x'.repeat(1024*1024); for (let i = 0; i < 10; i++) localStorage.setItem('relleno-'+i, b); } catch (e) { console.log('lleno:', e.name); }` | La consola dice `lleno: QuotaExceededError`. *(El aviso «Tu intento ya no se está guardando» aparece al intentar guardar la respuesta siguiente, y eso no se puede provocar hasta la iteración 43, que conecta el recorrido. Lo que se comprueba aquí es que el navegador de verdad lanza el error que el guion simula.)* | Que no lance nada: entonces el almacén no se llenó y el caso no se probó |
| 13 | Limpiar: en la Consola, `for (let i = 0; i < 10; i++) localStorage.removeItem('relleno-'+i)`. Recargar | «Intento retomado», con su intento intacto | Que el intento se haya perdido |
| 14 | **En el teléfono**, o en la vista responsive: empezar un intento y recargar | «Intento retomado» y los avisos legibles, sin desbordes | Texto cortado o desbordado a lo ancho |
| 15 | **Pulsar «Empezar otro intento»** | Arranca la transición y sale «Intento listo» con un reparto nuevo. En Almacenamiento local, el `intento_id` de las dos claves **cambió** y `respuestas` volvió a `[]` | Que conserve el `intento_id` anterior, o que herede respuestas |
| 16 | Toda la pasada | **Sin errores de consola**, y `npm run verificar` termina en 0 | Cualquier error |

### Lista de verificación de navegador · etapa B

*Actualizada el 2026-09-17 con la corrección de H-024. Se escribe acá —y no solo en la conversación—
porque la pasada anterior tuvo que reconstruirse de memoria para poder corregir un paso.*

**Antes de empezar:** `npm run datos:dev` levantado en otra terminal, DevTools abierto en la pestaña
**Red** con «Conservar registro» marcado, y la **Consola** a la vista.

1. **Abrir `http://127.0.0.1:8788/simulacro.html`.** El encabezado, el pie y el favicon se ven
   iguales que en `index.html` y `cuestionario.html`. El fondo es `ink`.
2. **Sin tocar nada, mirar la pestaña Red.** No sale **ninguna** petición a `/api/`. La presentación
   se lee entera: la píldora «120 preguntas · 30 segundos cada una», las nueve tarjetas de reglas, y
   los dos botones del final.
3. **Pulsar «Comenzar el simulacro».** Aparece la transición de carga: el logotipo, «Preparando tu
   simulacro…» y el hueco del texto lento. El botón queda deshabilitado mientras dura.
4. **En Red salen exactamente dos peticiones:** `/api/preguntas?resumen=1` y
   `/api/preguntas?ids=…`. La segunda lleva 120 ids separados por coma, sin ninguno repetido.
5. **Al terminar aparece «Intento listo»** con los siete módulos y sus cifras. Suman **120**: 17 en
   seis módulos y 18 en uno. El foco queda en el recuadro, no en el `body` —pulsar Tab sigue dentro
   de la página, no vuelve a la barra de navegación—.
6. **«Intento listo» no dibuja texto del banco.** Ni un enunciado, ni una alternativa, ni el título
   de un módulo: solo el número del módulo y su cuenta.
7. **Cronometrar desde el clic.** Nunca por debajo de ~0,4 s. Repetir con la red limitada
   (DevTools → Red → «Slow 4G»): la transición se siente igual que la del cuestionario, y pasados
   ~2,5 s aparece el texto de que está tardando, sin mover el foco.
8. **Pulsar «Comenzar» dos veces seguidas, rápido.** Sale **una sola** tanda de peticiones y se ve
   **una sola** transición: la segunda pulsación no hace nada.
9. **Bloquear solo `*ids=*` y recargar.** En Red → clic derecho sobre la petición de ids →
   «Bloquear URL de la solicitud», con el patrón `*ids=*`; `*resumen=1*` **se deja pasar**. Al
   pulsar «Comenzar» tiene que verse:
   - el `?resumen=1` en **200**, servido por D1;
   - **una sola** petición a `?ids=` y fallida (bloqueada). **No cuatro**: antes de la corrección de
     H-024 salían cuatro, porque se gastaban las tres rondas de reserva sobre ids del banco
     equivocado;
   - arriba, el aviso amarillo de ADR-008: «Estás viendo una copia guardada del banco de
     preguntas… el simulacro se cargó desde la copia incluida en el sitio…», con su fecha;
   - debajo, **«Intento listo» con 120 preguntas**, repartidas 17 en seis módulos y 18 en uno;
   - **no** aparece «No se pudo armar el simulacro»;
   - la consola, limpia.

   Es el intento reelegido entero sobre la instantánea: resumen y preguntas del mismo banco.
10. **Bloquear todo `*/api/*` y recargar.** Mismo resultado —aviso de ADR-008 y 120 preguntas—, y
    en Red **ninguna** petición a `?ids=`: con el resumen ya caído a la copia, las preguntas no se
    le piden a un servicio que acaba de no contestar.
11. **Quitar los bloqueos y recargar.** Al pulsar «Comenzar», el aviso amarillo **no** aparece: la
    página que se recupera deja de decir que está caída.
12. **La caída de verdad.** Detener `npm run datos:dev` (Ctrl+C) y pulsar «Comenzar»: modo
    degradado, con su aviso y sus 120. Volver a levantarlo, recargar y reintentar: vuelve a salir
    de D1.
13. **Movimiento reducido.** Con el sistema en «reducir movimiento» (o DevTools →
    *Rendering* → `prefers-reduced-motion: reduce`), la transición sigue diciendo que está cargando
    y conserva el logotipo, pero sin latido.
14. **En el teléfono**, o en la vista responsive: la presentación se lee sin desbordes, el botón se
    alcanza con el pulgar, y «Intento listo» no desborda a lo ancho.
15. **Toda la pasada, sin errores de consola**, y `npm run verificar` termina en 0.


### 2026-09-17 · H-024: un intento no mezcla bancos

Corrección sobre la etapa B ya commiteada, pedida por el autor tras leer el paso 9 de la lista de
navegador.

**El agujero.** `?resumen=1` y `?ids=` caen al respaldo **cada una por su cuenta** (ADR-008, y para
el cuestionario está bien: una petición, una pantalla). Aquí son dos peticiones **atadas**: de la
primera salen los ids y la segunda los va a buscar. Si el resumen contesta desde D1 y las preguntas
caen a la copia, los ids se eligieron sobre un banco y se piden a otro. Hoy los dos bancos coinciden
y no se nota.

**Provocado, sin tocar el código.** Se le agregaron al resumen de D1 **60 ids del módulo 5 que la
instantánea no tiene** —lo que verá el navegador el día que el banco crezca y la copia se quede
atrás— y se tumbó `?ids=`. Resultado: el intento gastó **sus tres rondas de reserva** sobre ids del
banco equivocado y terminó en «No se pudo armar el simulacro» con **118 de 120**. Por el camino de
las reservas —primera tanda desde D1, ronda de reserva caída a la copia— el resultado fue el mismo,
y en otras corridas algo peor: el intento **sí se armaba**, con dos bancos adentro y sin que nada lo
dijera.

**La corrección.** Una sola regla: **si alguna mitad sale de la copia, el intento entero se vuelve a
elegir desde la copia.** Vale igual para la primera petición y para una ronda de reserva que caiga a
mitad de camino, y se corta apenas se detecta en vez de gastar las rondas sobre ids que ya se sabe
que salieron del banco equivocado. Su reverso también: si el resumen ya vino de la copia, las
preguntas se le piden a la copia y no a un servicio que acaba de no contestar.

Lo que **no** cambió: el algoritmo sigue siendo una sola función que no sabe de dónde vienen los
ids (`elegirIntento()` se sigue llamando una vez), la transición sigue siendo una sola medida desde
el clic, y el aviso de ADR-008 sigue a la vista.

**Dónde vive.** `static/js/servicios/datos.js` gana dos lecturas que no pasan por la capa
—`leerResumenDelRespaldo()` y `leerPreguntasPorIdsDelRespaldo()`—, y `static/js/components/simulacro.js`
la regla, en `unIntentoDe()` y en `comenzarElIntento()`.

**Lo que lo vigila.** `scripts/probar-filtrado.mjs`, sección **10k**, en tres casos: el resumen de D1
con el extremo caído, la caída a mitad de las reservas, y que elegir sobre la copia dé un intento
legítimo —120 preguntas que la copia tiene, con el reparto y sin dos hermanas juntas—. La señal que
da el rojo es **cuántas rondas de reserva se gastan**: si el intento se reeligió sobre los ids de la
copia, todo lo que se pide existe en la copia y no hace falta reponer ni una vez. Con la corrección
revertida, los tres casos dan rojo.

De paso, **10h** pasa a contar a qué se sale en modo degradado: sin esa comprobación, quitar el
reverso de la regla dejaba todo en verde.

**Inerte que queda abierto.** `RONDAS_DE_RESERVA` puede bajar de 3 a 1 sin que ninguna comprobación
se entere. Anotado en `_planmaestro/00_producto/registro_log.md`, «Sin asignar»: es del caso 10d de
la etapa B, no de esta corrección.