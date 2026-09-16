# Iteración 35 · Transición de carga

**Épica:** 30 · Cuestionario
**Estado:** 🟢 Cerrada · 2026-09-16
**Depende de:** iteraciones 31, 32, 33, 34 y 36 cerradas. La transición convive con el
foco y el desplazamiento de la 32, con la memoria del avance de la 33, con el repaso, la
memoria de la visita y el mensaje con N en 0 de la 34, y con la paleta y las animaciones
de la 36.

## Objetivo

Que elegir un módulo no se sienta como un salto brusco de una zona vacía a una llena, sin
que el estudiante espere un milisegundo más de lo que tarda de verdad la carga.

## Contexto

_Creada el 2026-09-15 al partir la antigua iteración 33, por decisión del autor._ La tarea
venía escrita así: hoy la zona de preguntas pasa de vacía a llena de golpe y se siente
burdo; va una barra que refleje la **carga real**, con el logotipo de JavaScript encima, y
un mínimo visible de unos 400 ms para que no parpadee cuando la respuesta es instantánea.

Precisión de la lectura de alcance: hoy la zona no pasa de vacía a llena, sino por un
estado intermedio de texto («Cargando el Módulo N… / Pidiendo sus preguntas al banco.»),
sin movimiento, con dos reescrituras secas del contenedor.

Desde la 32 hay dos piezas con las que esto tiene que convivir: el foco se aparca en el
mensaje «Cargando…» mientras llega la respuesta, y al terminar el sitio desplaza y lleva
el foco a la cabecera del módulo.

## Historial de este archivo

- **2026-09-15 · creada** al partir la antigua iteración 33, por decisión del autor.
- **2026-09-16 · actualizada antes de la lectura de alcance.** El archivo decía que no
  dependía de la 33 ni de la 34, y ya no es cierto. Se agregó lo que hereda de ellas y de
  la 36, se quitó una cifra de peso de la instantánea que no venía de una medición, se
  precisó la comprobación del progreso, y se declararon las decisiones de diseño que el
  archivo escondía.
- **2026-09-16 · lectura de alcance y decisiones.** La lectura de Claude Code resolvió la
  decisión 1 con evidencia (no se puede medir el progreso), mostró que la decisión 4 no
  aplica, y encontró dos defectos existentes en los controles del panel durante la carga
  y una espera de hasta 8 s sin ninguna señal. El autor resolvió las decisiones 2, 3 y 5
  a 8. Se agregaron los criterios de convivencia que faltaban.
- **2026-09-16 · cerrada.** Construida, verificada y cerrada el mismo día. Los criterios de
  guion los cerró Claude Code con `probar-filtrado.mjs` (bloques 8f y 9c) y
  `probar-memoria.mjs` (sección 10c), con **trece sabotajes provocados: diez rojos y tres
  inertes**. Los de navegador los recorrió Felipe Cuevas en una pasada de catorce pasos, y
  `npm run verificar` terminó en 0 tras el commit. Con esta iteración **cierra la épica 30**.

## Lo que hereda

**De la 32:**

- El índice de módulos es el único control para elegir módulo, a través de la puerta
  única `pedirCambioDeModulo()`. Pulsar el módulo que ya está cargando no hace nada.
- El foco se aparca en «Cargando…» mientras llega la respuesta, y al terminar va a la
  cabecera del módulo, con desplazamiento.
- **ADR-032: el panel fijo no crece ni una fila.** La transición vive en la zona de
  preguntas.
- **ADR-033: lo dibujado manda.** Durante la carga, el índice no describe un módulo que no
  está dibujado. Hoy ya se cumple.
- `peticionVigente` descarta la respuesta que llega tarde, **y la carga que se retira sale
  sin bajar `moduloCargando`**: cualquier estado de la transición tiene que apagarlo la
  carga vigente, no la que se retira.

**De la 33:**

- El avance se guarda por módulo y se restaura al cargar (ADR-034, formato `v: 1`).
- Los cambios del banco, las demoras y las caídas se provocan **interceptando la respuesta
  del extremo**, nunca con `banco:actualizar`, `banco:insertar`, `datos:instantanea` ni
  nada que regenere `static/js/data/instantanea-banco.js`.

**De la 34:**

- **Elegir otro módulo sale del repaso** sin preguntar, y **el mensaje con N en 0 se
  retira** al cambiar de módulo (decisiones 5 y 11).
- **La memoria de la visita** (actualización del 2026-09-16 de ADR-034) sobrevive al
  cambio de módulo.
- **La 34 quitó de `responder()` la rama que sumaba respuestas sin identificar**, con una
  premisa: al cambiar de módulo, `mostrarModulo()` pone `bancoCargado` en null y reescribe
  el contenedor, así que no queda ninguna alternativa anterior que pulsar. La decisión 2 de
  esta iteración conserva esa premisa.

**De la 36:**

- Paleta cerrada: no entran colores nuevos. Ya no hay dos niveles de gris para dar
  jerarquía.
- El `tada` del logotipo vive solo en `index.html`. **`cuestionario.html` no tiene hoy
  ninguna animación de fotogramas clave.** El movimiento visual se apaga con
  `prefers-reduced-motion` en un solo sitio, `src/input.css`, que recorta duraciones a
  0,01 ms: toda animación nueva tiene que empezar y terminar en reposo. El desplazamiento
  se apaga en JavaScript, consultando `prefersReducedMotion()`.

## Por qué no es una espera fija

Una espera fija miente en los dos sentidos. Con buena conexión hace esperar al estudiante
sin ningún motivo. Con mala conexión termina antes de que el módulo llegue, y la página
dice «listo» cuando no lo está. **El único tiempo honesto es el que la carga tarda de
verdad.**

El mínimo de unos 400 ms no contradice esto: no es una espera, es un piso. Solo actúa
cuando la respuesta llegó antes, para que la transición no se vea como un parpadeo, y
nunca alarga una carga que ya tardó más que eso.

## Decisiones tomadas

### 1 · El progreso de la descarga no se puede medir: indicador sin porcentaje

Resuelta con evidencia el 2026-09-16, en la lectura de alcance de Claude Code. Mediciones
con `curl` desde Chile (punto de presencia de São Paulo), con la cabecera
`accept-encoding` de un navegador.

**No hay largo que medir.** `/api/preguntas?modulo=N` responde sin cabecera de largo, por
partes (`Transfer-Encoding: chunked`), comprimida con gzip en local y br en producción,
para el módulo más grande (3) y el más chico (8). Con `accept-encoding: identity` sí
aparece el largo (66 432 y 45 040 bytes), pero una página no puede pedir eso: esa cabecera
está prohibida para el código de la página por la especificación de Fetch. La instantánea
se carga con `import()` dinámico (`datos.js:182`), que no expone ningún flujo observable.

**Y aunque se pudiera, no habría nada que mostrar.**

| Origen | Módulo | Comprimido | Descomprimido | Duración total | Tiempo del cuerpo |
|---|---|---|---|---|---|
| Local | 3 | 17 146 B (gzip) | 66 432 B | 0,027–0,033 s | ~8 ms |
| Local | 8 | 11 790 B (gzip) | 45 040 B | 0,021–0,029 s | — |
| Producción | 3 | 17 432 B (br) | 66 432 B | 0,358–0,411 s | ~8 ms |
| Producción | 8 | 12 095 B (br) | 45 040 B | 0,345–0,371 s | — |

En producción, casi toda la espera es el viaje de ida y la consulta a D1, donde no hay
avance. Una barra pasaría casi todo el tiempo en 0 % y saltaría a 100 % al final, lo que
parece un cuelgue.

**La instantánea:** 499 557 B en disco; 96 290 B en br desde producción; 0,179–0,231 s de
red en producción; 13,5 ms de interpretación medida en Node.

**Consecuencia:** va un **indicador de «cargando» sin porcentaje** y sin nada que sugiera
cuánto falta. **Es una renuncia, no una equivalencia**: la tarea original pedía una barra,
y `vision.md` pide material visual. Se elige el camino menos informativo porque es el
único honesto.

**Origen del principio.** «Ningún número es mejor que un número falso» viene de la
iteración 24 (`iteracion-24-preparar-produccion.md:232`); «sin número hasta que sea
cierto», de la decisión del autor del 2026-09-11 en la iteración 31
(`iteracion-31-selector-de-modulo.md:162`).

**Límite de la evidencia:** son mediciones desde una buena conexión. En un teléfono con
datos móviles cambia la escala, no la forma: el cuerpo sigue pesando 12 a 17 KB. La
comprobación con red limitada queda en la pasada del autor.

### 2 · Mientras carga, la zona de preguntas se vacía, como hoy

Decidido por el autor el 2026-09-16. En producción la carga dura unos 400 ms; nadie
alcanza a extrañar el módulo anterior. **Se conserva intacta la premisa de la 34**: al
cambiar de módulo no queda ninguna alternativa anterior en pantalla ni forma de resolverla
contra el banco.

### 3 · Logotipo quieto, indicador simple y texto

Decidido por el autor el 2026-09-16. La transición muestra **el logotipo de JavaScript
quieto**, **un indicador de carga sin porcentaje** y **el texto que nombra el módulo que
viene** («Cargando el Módulo N…»), que es además lo que anuncia el foco a un lector de
pantalla. El logotipo es decorativo y no se anima.

### 4 · Volver a un módulo ya cargado: no aplica

Resuelta por la lectura de alcance: la capa de datos no guarda módulos (`datos.js:124-135`)
y el extremo manda `cache-control: no-store`, así que toda elección de módulo tiene carga.
La única excepción es la instantánea, que `import()` memoriza desde la segunda caída; ese
caso se trata como cualquier otra carga.

### 5 · El piso de 400 ms se cuenta desde el clic y se aplica a todo final

Decidido por el autor el 2026-09-16. **El piso se cuenta desde que el estudiante elige el
módulo**, y se aplica igual a cualquier final de la carga vigente: módulo dibujado, módulo
vacío, error o caída a la instantánea. Una sola regla. Nunca alarga una carga que ya tardó
más que el piso.

### 6 · «Reiniciar el módulo» y «Repasar mis errores (N)» quedan desactivados durante la carga

Decidido por el autor el 2026-09-16, a partir de dos defectos existentes que encontró la
lectura de alcance:

- «Reiniciar el módulo» durante la carga no hace nada, sin avisar
  (`cuestionario.js:1552`).
- «Repasar mis errores (N)» durante la carga borra el «Cargando…», muestra «Elige un
  módulo…» cuando el estudiante acaba de elegir uno, y deja ese mensaje encima del módulo
  cuando llega.

**Mientras carga un módulo, los dos controles se ven y se anuncian como no disponibles**, y
vuelven a estar disponibles en cualquier final de la carga vigente. El índice sigue
permitiendo elegir otro módulo.

### 7 · Si la carga tarda más de lo normal, se dice

Decidido por el autor el 2026-09-16. Antes de caer a la instantánea el sitio puede esperar
hasta 8 s (`datos.js:29`), con la pantalla idéntica a una carga normal. **Si la carga pasa
de un plazo claramente mayor que una carga normal, aparece un texto adicional del tipo
«Está tardando más de lo normal…»**, sin números, sin cuenta regresiva y sin prometer
cuánto falta. Desaparece en cualquier final.

### 8 · El movimiento reducido se simula en las pruebas

Decidido por el autor el 2026-09-16. El DOM falso de los guiones puede simular
`prefers-reduced-motion` activado. Lo que no se puede probar desde Node —que de verdad no
se vea movimiento— sigue siendo del autor.

## Lo que queda a criterio de quien implemente

La forma visual del indicador (sin porcentaje, dentro de la paleta, empezando y terminando
en reposo); el plazo exacto del texto de la decisión 7, justificado contra las mediciones
de la decisión 1 y menor que la espera máxima; la redacción final de ese texto dentro de
las condiciones de la decisión 7; qué hacen las barras del panel durante la carga, sin
hacer crecer el panel ni contradecir la zona de preguntas; en qué momento aparece el aviso
de ADR-008 respecto del final de la transición; y el mecanismo con que la carga se da a
conocer a un lector de pantalla.

## Tareas

- [x] Comprobar, contra el extremo local y contra producción, si la respuesta de
  `/api/preguntas?modulo=N` permite medir el progreso de la descarga, con su peso y su
  duración, y anotar la evidencia en este archivo. Hecho el 2026-09-16 (decisión 1).
- [x] Resolver con el autor las decisiones abiertas y anotarlas. Hecho el 2026-09-16.
- [x] Construir la transición de las decisiones 1, 3 y 5.
- [x] Desactivar los controles del panel durante la carga (decisión 6).
- [x] Mostrar el texto de carga lenta (decisión 7).
- [x] Hacer que conviva con el foco aparcado en «Cargando…», el desplazamiento a la
  cabecera, el repaso, el mensaje con N en 0 y la memoria de la visita.
- [x] Respetar `prefers-reduced-motion`, y permitir simularlo en el DOM falso (decisión 8).
- [x] Permitir en los guiones retrasar cada módulo con un plazo distinto, para provocar
  dos cargas que llegan en desorden.
- [x] Corregir la cifra «44 a 65 KB» de los comentarios de `cuestionario.js`, que no
  coincide con lo medido.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no razonando
sobre el código. Las demoras, las caídas y los cambios del banco se simulan interceptando
la respuesta del extremo.

### Los provoca Claude Code

**La carga**

- [x] **La decisión de medir o no medir está tomada con evidencia**, local y en producción,
  con peso y duración de la respuesta, y anotada en este archivo antes de construir.
  Evidencia: lectura de alcance de Claude Code, 2026-09-16, sección 2(a); decisión 1.
- [x] **La transición acompaña la carga real, no un tiempo inventado.** Con una respuesta
  lenta, el indicador sigue hasta que el módulo llega; con una instantánea, dura el piso y
  termina.
  **Evidencia:** `probar-filtrado.mjs:1635-1718` (bloque 8f-2). Con la respuesta retrasada
  2000 ms la transición duró **2028-2039 ms**; con la respuesta instantánea, **405-406 ms**,
  que es el piso. El sobrecosto de la lenta son las decenas de ms de la consulta local: el
  piso no alarga lo que ya tardó más que él · **Claude Code**
- [x] **Nadie espera de más.** Medido desde el clic, el tiempo hasta ver el módulo es el
  mayor entre lo que tarda la carga y el piso, y no más. Se mide e informa para una
  respuesta instantánea, una lenta y una fallida inmediata.
  **Evidencia:** `probar-filtrado.mjs:1644-1668` (`medir()`), con holgura de 700 ms y rojo por
  los dos lados. Medido desde el clic, en tres corridas:

  | Final | Lo que tarda la carga | Esperado | Medido |
  |---|---|---|---|
  | Respuesta instantánea (módulo 3, local) | ~30 ms | 400 ms, manda el piso | **405-406 ms** |
  | Respuesta lenta (módulo 4, retraso 2000 ms) | 2000 ms | 2000 ms, manda la carga | **2028-2039 ms** |
  | Fallida inmediata (módulo 7, `usar_respaldo: false`) | ~0 ms | 400 ms, manda el piso | **407-411 ms** |

  · **Claude Code**
- [x] **El piso se aplica igual a todo final**: módulo dibujado, módulo vacío, error y
  caída a la instantánea.
  **Evidencia:** una sola llamada a `esperarElPiso()` en `cuestionario.js:1709`, antes de
  repartirse en los tres finales: «una sola regla» no se puede cumplir escribiéndola tres
  veces. Provocado en el final dibujado (405-406 ms) y en el de error (407-411 ms), y el
  degradado lo atraviesa por el mismo sitio. Rojo provocado quitando la espera: la
  instantánea cayó a **29 ms** y la fallida a **0 ms**, «la transición parpadea» · **Claude Code**
- [x] **La transición muestra el logotipo quieto, un indicador sin porcentaje y el texto
  que nombra el módulo**, y ningún número de avance.
  **Evidencia:** `probar-filtrado.mjs:1532-1560` (bloque 8f-1). Exige `js-logo.svg`,
  `animate-latido` y «Cargando el Módulo 6…», y **da rojo si el HTML trae `%`,
  `progressbar` o `aria-valuenow`** (`:1560-1569`). El dibujo vive en
  `cuestionario.js:914-955`. Rojo provocado metiendo un «40%» en el detalle · **Claude Code**
- [x] **El camino más lento funciona:** en modo degradado, la transición acompaña la carga
  entera, el texto de carga lenta aparece si se pasa el plazo, y el aviso de ADR-008 queda
  visible al final.
  **Evidencia:** `probar-filtrado.mjs:1890-1988` (bloques 9 y 9b), con el `fetch` caído: el
  módulo 4 dibujó sus 61 preguntas desde la instantánea con el aviso de ADR-008 a la vista, y
  abrir la página con la capa caída deja el aviso **antes** de elegir nada. El bloque 9c
  vuelve a cargar desde la instantánea con la transición dibujada. El texto de carga lenta y
  su plazo se cierran en el criterio siguiente · **Claude Code**
- [x] **El texto de carga lenta aparece solo cuando corresponde**: no aparece en una carga
  normal, aparece al pasar el plazo, y desaparece en cualquier final.
  **Evidencia:** los cuatro momentos, provocados. No aparece en carga sana
  (`probar-filtrado.mjs:1621-1626`); no aparece antes del plazo contado desde el clic del
  **módulo vigente** (`:1773-1779`); aparece pasado el plazo (`:1790-1795`); y no sobrevive al
  final (`:1827-1829`). Entra **sin reescribir el contenedor y sin mover el foco**
  (`:1796-1805`), por su propio nodo `#carga-lenta` (`cuestionario.js:966-978`). Rojo
  provocado haciéndolo reescribir `#cuestionario` · **Claude Code**
- [x] **Una carga fallida no deja la transición colgada**: termina y da paso al mensaje de
  error, con el foco en ese mensaje.
  **Evidencia:** `probar-filtrado.mjs:1700-1712`: con el rechazo `usar_respaldo: false` —el
  único que no cae a la instantánea— queda el mensaje «No se pudo cargar el módulo.», el foco
  en `#mensaje-cuestionario` y los dos controles del panel de vuelta. Rojo provocado dejando
  `cerrarLaCarga()` sin efecto: 12 problemas, cuatro de ellos por controles colgados · **Claude Code**

**La convivencia**

- [x] **Elegir otro módulo mientras uno carga termina dibujando el último elegido**, también
  cuando la respuesta del primero llega después que la del segundo, y la transición no
  queda duplicada ni colgada. Provocado con retrasos distintos por módulo.
  **Evidencia:** dos montajes con `retrasarPorModulo()` (`probar-filtrado.mjs:1507-1530`),
  con los plazos sacados de `PLAZO_DE_CARGA_LENTA_MS` y no escritos a mano. **8f-3**
  (`:1720-1841`): con los módulos 3 y 8 retrasados 1250 y 3750 ms, la respuesta descartada del
  3 llega **mientras** el 8 sigue vivo, y en el muestreo hay **1 sola** transición, la del 8,
  con los dos controles aún desactivados. **8f-4** (`:1843-1888`): con 3000 y 1000 ms, la del
  3 llega **después** que la del 8 y no manda. En los dos queda dibujado el 8 y el índice lo
  marca. Rojo principal provocado quitando la guarda por identidad de `cerrarLaCarga()`: la
  respuesta vieja reactivó los controles y canceló el temporizador del vigente · **Claude Code**
- [x] **Durante la carga, «Reiniciar el módulo» y «Repasar mis errores (N)» están
  desactivados y se anuncian como no disponibles**; pulsarlos no cambia nada; y vuelven a
  estar disponibles en cada final de la carga vigente, incluido el caso de una respuesta
  vieja descartada.
  **Evidencia:** `probar-filtrado.mjs:1582-1593` (`disabled` y `opacity-50` en los dos) y
  `:1604-1610` (se disparan los dos y el HTML de la zona no cambia). Vuelven en los **cuatro**
  finales: normal (`:1618`), fallido (`:1710`), con dos cargas encimadas (`:1830`) y tras la
  respuesta tardía (`:1875`). El código está en `cuestionario.js:1005-1017`, con la guarda
  también dentro de cada oyente, porque `dom.disparar()` corre los oyentes aunque el nodo esté
  `disabled`. Rojo provocado dejando de desactivarlos: 3 problemas · **Claude Code**
- [x] **Durante la carga no se puede responder ninguna pregunta del módulo anterior**, y
  ninguna respuesta se guarda en un módulo que no es el que la muestra.
  **Evidencia:** `probar-memoria.mjs`, sección **10c** (`:2644-2795`), con el paso
  `pulsar-lo-viejo` (`:414-482`). Se guarda la referencia de una alternativa del módulo 3 con
  el 3 a la vista, se pide el 5 con la respuesta retrasada 2500 ms, y se pulsa esa referencia
  **dos veces**: con el 5 viajando y con el 5 ya dibujado. El clic llega al oyente las dos
  veces —se exige `oyentes === 1` (`:2690-2700`), para que la prueba no pase por no haber
  ocurrido nada— y no mueve nada: ni el panel, ni **una sola clave** del almacén, ni la memoria
  de la visita. El 5 queda dibujado entero y sin avance. **Rojo A**, no poner `bancoCargado` en
  null: 7 problemas, y la pregunta 54 —del módulo 3— quedó guardada bajo
  `examen-td-js.avance.modulo-5`. **Rojo C**, las dos guardas de pertenencia de
  `deDondeSalio()` rotas a la vez: 5 problemas, y la pregunta 175 —del módulo 5— quedó
  guardada sin haberse respondido · **Claude Code**
- [x] **Durante la carga, el panel no invita a responder**: `#mensaje-avance` no dice
  «Responde la primera pregunta para comenzar.» mientras la zona dice que está cargando.
  **Evidencia:** `probar-filtrado.mjs:1594-1600`: durante la carga el panel dice exactamente
  «Cargando el Módulo 6…». Sale del mismo registro que el resto de la transición, no de una
  bandera aparte (`cuestionario.js`, `actualizarPanel()`) · **Claude Code**
- [x] **Elegir un módulo desde el repaso, o con el mensaje con N en 0 a la vista**, sale del
  repaso y retira el mensaje igual que antes de esta iteración.
  **Evidencia:** sin cambios respecto de la 34 —`cerrarElRepaso()` y `olvidarElAvisoDelRepaso()`
  siguen antes del `await`—, y el renglón «Repaso, los bordes» de `probar-memoria.mjs` sigue
  en verde con las 43 visitas · **Claude Code**
- [x] **Durante la carga, el índice no describe un módulo que no está dibujado** (ADR-033).
  **Evidencia:** ya se cumplía antes de esta iteración y se conserva: con `bancoCargado` en null,
  `actualizarPanel()` pasa `null` a `fijarAvanceDibujado()` y la fila vuelve a contar sobre el
  resumen. `probar-filtrado.mjs` sigue en verde en «Dibujado por modulo» y en el bloque del
  índice · **Claude Code**
- [x] **El panel fijo no crece** durante la transición (ADR-032): no se añaden nodos al
  panel.
  **Evidencia:** `cuestionario.html` no aparece en el `git diff --stat` de la iteración: no se
  le añadió ni un nodo. Todo lo nuevo —transición, indicador y texto de carga lenta— vive
  dentro de `#cuestionario`, en la zona de preguntas · **Claude Code**
- [x] **Con el movimiento reducido simulado, la transición no declara movimiento** y sigue
  diciendo que está cargando.
  **Evidencia:** `probar-filtrado.mjs:1994-2041` (bloque 9c), con
  `prepararDomFalso({ movimientoReducido: true })` (decisión 8). La transición no declara
  `animate-latido`, conserva el logotipo y sigue diciendo «Cargando el Módulo 4…». **Tiene
  control positivo**: 8f-1 exige que con el DOM normal sí lo declare, así que la comprobación
  puede fallar. Rojo provocado declarando la animación siempre · **Claude Code**
- [x] **Durante la espera, el contenedor no se reescribe más de lo necesario** para que la
  carga se anuncie una sola vez: se informa cuántas veces se reescribe.
  **Evidencia:** contador nuevo en `dom-falso.mjs`, leído con `dom.escrituras()`. **Una sola**
  reescritura en la carga simple (`probar-filtrado.mjs:1571-1576`) y **tres** con dos cargas
  encimadas: una transición por clic más el dibujo final. El archivo pedía informar; se informa
  y además se exige el 1 en la carga simple, por ser el mínimo alcanzable · **Claude Code**
- [x] **No entran colores fuera de la paleta** en el marcado de la transición.
  **Evidencia:** los únicos colores del marcado nuevo son `paper`, `muted`, `jsyellow`, `panel`
  y `panel3`, todos de la paleta cerrada de la 36; el atenuado de los controles es
  `opacity-50`, que no agrega ningún tono. Contrastes medidos sobre su fondo real: título
  **17,64:1**, detalle **6,65:1**, texto de carga lenta **17,64:1**, su ícono **14,00:1** y los
  puntos del indicador **14,00:1**. Los dos controles atenuados se tratan en las notas · **Claude Code**
- [x] **`npm run probar:filtrado`, `npm run probar:memoria` y `npm run probar:escapado`
  siguen en verde**, con cada rojo nuevo provocado una vez, y `instantanea-banco.js` sin
  cambios.
  **Evidencia:** `FILTRADO CORRECTO`, `MEMORIA CORRECTA` (43 visitas) y `ESCAPADO EN PIE`, los
  tres en código 0. **Trece sabotajes provocados: diez rojos y tres inertes**, cada uno
  aplicado y revertido. `git diff --stat` vacío sobre `static/js/data/instantanea-banco.js` y
  `d1/respaldo-banco.sql` · **Claude Code**

### Los comprueba el autor en el navegador

- [x] **Con buena conexión no se nota espera**, y con la red limitada en DevTools la
  transición acompaña hasta el final.
  **Pasos 1 y 2** de la lista de navegador: elegir un módulo con la red normal, y repetirlo
  con «3G lento» · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **Con la red muy lenta o el extremo bloqueado**, aparece el texto de carga lenta y se
  entiende que la página sigue viva.
  **Pasos 3 y 4**: con «3G lento», y bloqueando `preguntas?modulo=…` con «Bloquear URL de
  solicitud», hasta ver el texto y después el aviso de la copia guardada · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **Con `prefers-reduced-motion` activado**, la transición no anima, y la página sigue
  diciendo que está cargando.
  **Paso 7**: emulando `prefers-reduced-motion: reduce` desde DevTools. Los puntos quedan
  quietos y bien visibles, no apagados ni a medio desvanecer · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **Un lector de pantalla da a conocer que está cargando** una sola vez, sin repetirlo a
  cada paso.
  **Paso 8**, con el Narrador de Windows: anuncia la carga una vez, y pasado el plazo dice
  solo la frase nueva del texto lento, sin repetir la anterior. Con esto queda confirmada la
  interpretación de la región viva propia, descrita en las notas · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **El aterrizaje en la cabecera sigue ocurriendo** después de la transición, en
  escritorio y en teléfono.
  **Paso 9**: eligiendo otro módulo con la página a media altura, en escritorio y en vista de
  teléfono · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **Cambiar de módulo varias veces seguidas, rápido, desde el teléfono** no deja nada
  raro a la vista, y los controles desactivados no parpadean de forma molesta.
  **Paso 10**: cuatro o cinco toques rápidos con «3G lento». Queda dibujado el último, y los
  controles se apagan al primer toque y se encienden una sola vez, al final · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **El panel sigue alcanzando hasta «Reiniciar el módulo» en una ventana de 1280 × 700.**
  **Paso 11**, con dimensiones personalizadas de 1280 × 700. ADR-032 sigue en pie · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **La identidad visual se mantiene.**
  **Paso 12**: en la transición solo hay amarillo de JavaScript, blanco hueso, el gris de
  siempre y los fondos oscuros del sitio · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **Sin errores de consola.**
  **Paso 13**: consola en blanco con la red normal, recorriendo varios módulos. Las líneas
  `net::ERR_*` sobre `/api/preguntas` que aparecen al bloquear o frenar la red son el fallo
  que se está provocando, y no cuentan · **Felipe Cuevas, 2026-09-16, pasada de navegador**
- [x] **`npm run verificar` termina en 0.**
  **Paso 14**, tras el commit: los seis comprobadores en OK —barrera, css, instantánea, cifra,
  escapado y restricciones—. Antes del commit daba 1 por el CSS recompilado y sin versionar,
  que es lo previsto · **Felipe Cuevas, 2026-09-16, pasada de navegador**

## Lo que esta iteración no puede afirmar

- **Que la carga sea más rápida.** Esta iteración cambia cómo se ve la espera, no cuánto
  dura. Hacerla más corta es trabajo de la épica 50, iteración 53.
- **Que el estudiante sepa cuánto falta.** No hay dato honesto para decirlo (decisión 1).

## Notas de la iteración

### La opacidad de los controles desactivados: decisión del autor

Mientras un módulo carga, los dos controles del panel se atenúan con `opacity-50`. Eso
baja su contraste: «Reiniciar el módulo» queda en **5,02:1** y «Repasar mis errores» en
**4,18:1** sobre `bg-ink`, frente a 19,57:1 y 15,53:1 sin atenuar. El 4,18:1 está por
debajo del 4,5:1 que exigiría WCAG 1.4.3.

**Decidido por el autor el 2026-09-16: se mantiene.** WCAG 1.4.3 exime expresamente los
componentes de interfaz inactivos, y el autor se apoya en esa exención. Queda escrito para
que la próxima vez que alguien mida ese contraste encuentre el porqué y no un descuido.

### Siete interpretaciones de quien implementó, aceptadas por el autor

El archivo dejó explícitamente a criterio de quien implementara la forma del indicador, el
plazo del texto lento, su redacción, qué hacen las barras y el mecanismo de anuncio. Estas
son las decisiones que se tomaron ahí, y las tres que salieron de leer las precisiones al
pie de la letra:

1. **El texto de carga lenta tiene región viva propia.** `#carga-lenta` lleva
   `role="status"` y `aria-live="polite"`, y nada más lo lleva. La precisión pedía que no
   provocara un segundo anuncio de la carga, y no lo hace: el nodo del mensaje no se toca,
   así que el lector no repite «Cargando el Módulo N…» y solo lee la frase nueva. La
   alternativa —no ponerle región viva— dejaba a quien usa lector de pantalla sin enterarse
   nunca de que la carga se atascó. Confirmado en el paso 8 de la pasada.
2. **`disabled` nativo, sin `aria-disabled`.** Sobre un botón realmente deshabilitado,
   `aria-disabled` repite lo que el navegador ya anuncia. Se comprobó que el foco nunca está
   en esos botones cuando se desactivan —viene del índice y se va al mensaje—, así que
   deshabilitarlos no tira el foco al `body`.
3. **Una sola reescritura en la carga simple, exigida y no solo informada.** El criterio
   pedía informar cuántas veces se reescribe el contenedor. Se informa —**1** en la carga
   simple y **3** con dos cargas encimadas, que es una transición por clic más el dibujo
   final— y además se exige el 1, por ser el mínimo alcanzable.
4. **La trampa de `%` en el HTML de la transición.** `probar-filtrado.mjs` da rojo si
   aparece un `%`, un `progressbar` o un `aria-valuenow` en el marcado de la transición. Es
   la decisión 1 escrita como prueba, y tiene un coste que conviene saber: **ningún texto
   futuro de esa pantalla puede llevar un porcentaje literal.**
5. **El panel repite el texto de la zona.** Durante la carga, `#mensaje-avance` dice
   «Cargando el Módulo N…», lo mismo que la tarjeta. Es repetición en pantalla, y se aceptó
   porque cumple que las dos mitades cuenten la misma historia: antes el panel invitaba a
   responder mientras la zona decía que estaba cargando.
6. **El reintento tras un fallo aparece 400 ms más tarde.** El piso se espera **antes** de
   bajar `moduloCargando`, así que mientras corre, volver a pulsar el mismo módulo sigue sin
   pedir nada. Es coherente con la decisión 5 —la carga no ha terminado a la vista del
   estudiante— y está anotado en el comentario de `moduloCargando`.
7. **El plazo del texto lento son 2500 ms**, y sale de las mediciones de la decisión 1. Es
   más de **seis veces** la carga sana medida en producción (0,345–0,411 s), así que un
   módulo que llega bien no lo alcanza ni desde un teléfono con datos móviles —lo que sube
   ahí es el viaje de ida, no el cuerpo, que sigue pesando 12 a 17 KB—; y es **menos de un
   tercio** de los 8 s de espera máxima de `servicios/datos.js`, así que quedan más de 5 s de
   explicación antes de que el sitio cambie al respaldo. Queda muy por encima del piso de
   400 ms, de modo que los dos nunca se cruzan.

### Un solo registro por petición, que es la respuesta a H-1

La lectura de alcance dejó H-1 como el defecto más caro de descubrir tarde: `mostrarModulo()`
tiene **cuatro salidas** —el descarte de la respuesta que llega tarde, el error, el módulo
vacío y el final que dibuja— y la del descarte sale **sin bajar `moduloCargando`**, a
propósito. Con cuatro estados nuevos y cuatro salidas serían dieciséis sitios donde acordarse
de apagar, y basta olvidar uno para que la transición quede colgada o se apague la del módulo
equivocado.

La transición no se construyó con banderas sueltas sino con **un registro único**,
`cargaEnCurso`, estampado con el número de petición que lo creó. `abrirLaCarga()` es el único
sitio que lo crea, y cancela el anterior antes de reemplazarlo. `cerrarLaCarga()` lo apaga, y
**lo primero que hace es comparar la identidad**: la llaman las cuatro salidas, la del
descarte incluida, y esa no hace nada porque su número ya no es el del registro.

**Lo que decide quién puede apagar es el dato, no el sitio desde donde se llama.** Se hizo
así, y no «desde la salida del descarte no se llama», porque una regla que depende de
acordarse de NO llamar a algo se rompe la primera vez que alguien agregue una quinta salida.
El sabotaje que lo comprueba es exactamente quitar esa comparación.

### Tres rojos inertes, y lo que destaparon

Es el mismo patrón que la iteración 34 encontró dos veces, y volvió a aparecer aquí: **un
rojo que no dispara es una prueba que estaba pasando sin mirar nada**. Esta vez el motivo no
fue una prueba floja, sino dos mecanismos con **guardas independientes, cada una suficiente
por sí sola**:

- **El temporizador del texto lento.** Romper solo la cancelación del temporizador saliente
  en `abrirLaCarga()` no dispara nada, porque `decirQueEstaTardando()` vuelve a comprobar la
  identidad antes de escribir. Romper solo esa comprobación tampoco dispara, porque el
  temporizador ya fue cancelado. **El sabotaje válido rompe las dos**, y entonces el texto
  lento aparece antes de cumplirse el plazo del módulo vigente, escrito por un temporizador
  abandonado.
- **La pertenencia en `deDondeSalio()`.** Romper solo la comprobación de que la pregunta esté
  en el banco cargado no dispara: la alternativa pulsada tampoco aparece entre las de la
  pregunta que se devuelve, y `find` la descarta igual. **El sabotaje válido rompe las dos**,
  y entonces un clic obsoleto guarda una respuesta para una pregunta que nadie respondió.

Ninguna de las dos parejas es redundante desde el punto de vista de la prueba —si se borran
las dos, el defecto vuelve—, pero tampoco hay una sola que sea «la que protege». Queda escrito
en los comentarios de las dos funciones para que nadie retire una creyendo que la otra es la
importante.

### Una limitación del DOM falso, declarada

En el navegador, reescribir `#cuestionario` destruye `#mensaje-cuestionario` y el foco cae al
`body`. **En el DOM falso no**: ese nodo se registra al primer nivel y su `padre` queda en
`null`, así que `foco.dentroDe()` no lo alcanza. Por eso el rojo que hace al texto lento
reescribir el contenedor **se sostuvo por el contador de reescrituras**, no por la caída del
foco. El contador es la parte que sostiene el criterio desde Node; que el foco caiga de verdad
sigue siendo del navegador, y lo cubrió el paso 8 de la pasada.

### Dos notas de proceso

**`probar:filtrado` creció unos 16 segundos**, casi todos del montaje de las dos cargas
encimadas. No son lentitud: son esperas deliberadas, y sus plazos salen de
`PLAZO_DE_CARGA_LENTA_MS`, la misma constante que usa el componente, para que el día que el
plazo cambie las pruebas no sigan midiendo contra el viejo.

**Y hubo que limpiar cuatro servidores locales acumulados.** Se encontraron cuatro
`workerd.exe` de este proyecto escuchando a la vez en el puerto 8788, restos de lanzamientos
de sesiones anteriores. Peleaban por el SQLite local y hacían fallar `probar:memoria` con «La
base local no devolvió los ids…», que es un «no se pudo probar» y no un rojo. Se cerraron por
su **proceso padre** —que es lo que el propio mensaje de error de `probar-filtrado.mjs`
recomienda, y no matando el `workerd` que escucha—, y con uno solo levantado las tres corridas
siguientes salieron limpias a la primera.


_Pendiente._