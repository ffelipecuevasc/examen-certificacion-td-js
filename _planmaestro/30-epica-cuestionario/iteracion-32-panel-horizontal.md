# Iteración 32 · Rediseño del panel fijo

**Épica:** 30 · Cuestionario
**Estado:** 🟢 Completada · 2026-09-15

## Objetivo

Reorganizar la mitad izquierda de `cuestionario.html`: las tres barras de progreso
pasan de vertical a **horizontal**, ocupando todo el ancho disponible de su panel, y
el espacio liberado se aprovecha para orientar mejor al estudiante.

## Contexto

Las barras verticales funcionan, pero desperdician el ancho del panel y limitan la
información que cabe. En horizontal, cada barra puede llevar su etiqueta, su cifra y
su porcentaje en la misma línea, y queda espacio para un índice de módulos.

Se mantienen los colores actuales: amarillo para el avance, ruby para los errores y
esmeralda para los aciertos.

## Lo que cambió respecto de como se escribió esta iteración

_Reescrito el 2026-09-11, antes de arrancar, por decisión del autor. Este archivo se
redactó **antes que la iteración 31**, así que no sabía del selector de módulo ni del
filtrado, y daba por disponible un dato que no existe._

**El índice se parte en dos mitades.** Decía «un índice de los siete módulos con el avance
de cada uno». Eso no se puede cumplir todavía, y el motivo no es de implementación: **el
avance no se guarda hasta la iteración 33**, y cambiar de módulo lo pierde. En cualquier
instante, como mucho un módulo tiene avance —el que está en pantalla— y los otros seis
están en cero.

Y seis ceros no serían una omisión, serían una afirmación falsa: si el estudiante responde
20 preguntas del módulo 3 y salta al 5, el índice diría «Módulo 3 — 0 %». Eso no es «sin
empezar», es «lo perdiste», y la iteración 31 se tomó el trabajo de avisar antes justamente
para que esa pérdida no fuera silenciosa.

Así que esta iteración entrega el índice como **control y orientación** —los siete módulos,
su nombre, cuántas preguntas tiene cada uno, y saltar— y **la iteración 33 lo hereda y lo
llena con el avance real**, que es cuando tendrá de dónde sacarlo. Queda anotado en las dos.

**El índice reemplaza al selector.** Si el índice permite saltar y vive en el mismo panel,
hay dos controles para lo mismo a tres centímetros. El índice es el único, y es mejor
control: muestra los siete estados a la vez en vez de esconder seis. ADR-032 se actualizó
con esto — **el sitio no cambia, cambia la forma del control**, y hay que reponer a mano lo
que el `<select>` daba gratis.

**Los siete conteos entran por ADR-033.** La iteración 31 decidió «sin número hasta que sea
cierto», y funcionaba porque el selector muestra un módulo a la vez. Con los siete a la
vista, o están las siete cifras o hay una y seis huecos. Los conteos vienen de
`/api/preguntas?resumen=1`, que es trabajo **de esta iteración**.

## Tareas

- [x] Convertir las tres barras a formato horizontal, a todo el ancho del panel.
- [x] Conservar los colores y los íconos ya asociados a cada barra.
- [x] Implementar `?resumen=1` en `/api/preguntas` según ADR-033, con sus reglas: se
      compone con `?modulo=N`, y cualquier valor distinto de `1` es `PETICION_INVALIDA`.
- [x] Añadir el índice de los siete módulos, con su nombre y cuántas preguntas tiene
      cada uno, que sirva para saltar a ese módulo.
- [x] Retirar el selector de la iteración 31: el índice queda como control único.
- [x] Hacer que el salto desde el índice pase por **la misma puerta** que el aviso de
      pérdida de avance de la iteración 31. Si el índice cambia de módulo por su
      cuenta, el aviso se esquiva sin que nadie lo note.
- [x] Reponer a mano lo que el `<select>` daba gratis: `aria-current` en el módulo
      activo, orden de tabulación sensato y un nombre accesible por fila que diga el
      módulo y su cantidad.
- [x] Revisar el comportamiento del panel en pantallas de altura reducida: con más
      contenido, el panel fijo puede no caber.
- [x] Asegurar que la información no dependa solo del color: cada barra debe ser
      comprensible en escala de grises.
- [x] Comprobar el modo degradado con el resumen: los siete conteos salen de la
      instantánea, con el aviso de ADR-008 visible **al abrir**, no al elegir.
- [x] Añadir a `scripts/probar-filtrado.mjs` la comparación del conteo del resumen
      contra el dibujado, que ADR-033 exige para que una discrepancia no sea silenciosa.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no
razonando sobre el código.

- [x] **Las tres barras son horizontales** y ocupan el ancho del panel.
- [x] **Cada barra muestra su etiqueta, su cifra absoluta y su porcentaje.**
- [x] **El índice muestra los siete módulos con su cantidad real de preguntas:** 52, 61,
      61, 49, 52, 48 y 45. Se comprueba sobre lo dibujado y contra la base, no contra la
      respuesta del extremo.
- [x] **El índice es el único control.** El selector ya no está, y desde el índice se
      llega a los siete módulos. Se recorren los siete.
- [x] **Saltar desde el índice avisa igual que avisaba el selector.** Se provocan los dos
      casos: saltar con preguntas respondidas, y saltar sin ninguna. Si el aviso se puede
      esquivar por este camino, el criterio falla.
- [x] **El índice dice cuál es el módulo activo**, y el teclado lo alcanza, lo recorre y
      puede saltar sin ratón.
- [x] **`?resumen=1` devuelve las siete filas y no devuelve preguntas.** Se comprueba
      también lo que pesa, comparado contra `/api/preguntas` sin filtrar.
- [x] **`?resumen=` con un valor distinto de `1` responde `PETICION_INVALIDA`**, no el
      banco entero. Se provoca.
- [x] **El conteo del resumen coincide con el dibujado, módulo a módulo**, y el guion da
      rojo si difieren. Se provoca la divergencia para comprobar que la detecta.
- [x] **El modo degradado trae los siete conteos** desde la instantánea, y el aviso de
      ADR-008 se ve **al abrir la página**, encima del estado vacío.
- [x] **En una ventana de 700 píxeles de alto, el panel sigue siendo usable**: se
      demuestra con captura o descripción del comportamiento.
- [x] **En pantallas bajo el punto de corte de escritorio, el panel se apila sin
      romperse**, y el índice cabe sin empujar el estado vacío fuera de alcance.
- [x] **Una captura en escala de grises** permite distinguir qué representa cada barra.
- [x] **El diseño mantiene la identidad del sitio:** no se introducen colores fuera de la
      paleta ya establecida.
- [x] **Sin errores de consola** con cualquier módulo cargado.
- [x] **`npm run verificar` termina en 0.**

## Verificación

Cada criterio con su evidencia y quién la produjo. `probar-filtrado.mjs` y
`probar-escapado.mjs` corren el componente real contra el extremo real y cuentan sobre el
HTML que se dibujó; lo que solo existe en un navegador lo comprobó el autor, en local y en
producción, el 2026-09-15.

**Los 16 criterios se reparten así: 9 los cerró el guion, 4 el autor en el navegador, y 3 los
dos.** El recuento se escribe aquí a propósito, porque la primera vez se informó mal: la fila
de las barras horizontales deletreaba sus dos autores en vez de decir «los dos», y quedó
contada en los dos montones a la vez —10 + 4 + 3 = 17 sobre 16 criterios—. La columna «Quién»
usa ahora tres valores y nada más, para que el recuento se pueda repetir sin interpretar nada.

Los tres criterios de la segunda tabla —los que añadió la auditoría— **no entran en esas
cifras**: no estaban en la lista de aceptación de esta iteración.

| Criterio | Evidencia | Quién |
|---|---|---|
| Las tres barras son horizontales y ocupan el ancho del panel | Punto 6 de la pasada: EXITOSO. El guion cubre la otra mitad: los tres `style.width` siguen al porcentaje y ninguno usa `height` | los dos |
| Cada barra muestra su etiqueta, su cifra absoluta y su porcentaje | `Barras: tras responder 3 de 61, cada una dice su cifra y su porcentaje —5 % respondidas y correctas, 0 % incorrectas—, y el ancho de cada una los acompaña` | Claude Code · guion |
| El índice muestra los siete módulos con su cantidad real | `Dibujado por modulo: 2=52, 3=61, 4=61, 5=49, 6=52, 7=48, 8=45`, contado sobre el HTML y comparado contra la base consultada aparte por wrangler | Claude Code · guion |
| El índice es el único control | `Control libre: 3→61, 5→49, 3→61 sin recargar`. El `<select>` ya no existe en el HTML servido, comprobado sobre la respuesta del servidor | Claude Code · guion |
| Saltar desde el índice avisa igual que avisaba el selector | `Aviso de perdida, provocado DESDE EL INDICE: sin respuestas no aparece y el cambio pasa directo; con 1 respuesta aparece`. Rojo provocado desactivando la condición: 7 problemas | Claude Code · guion |
| El índice dice cuál es el módulo activo, y el teclado lo alcanza y lo recorre | El guion comprueba `aria-current` en uno y solo uno, y que la barra izquierda esté pintada en una fila y transparente en las otras seis. El recorrido con teclado, punto 9 de la pasada: EXITOSO en local y en producción | los dos |
| `?resumen=1` devuelve las siete filas y no devuelve preguntas | `Resumen: 7 modulos en 0,9 KB, frente a 371,8 KB del banco entero (410 veces menos)`, y ninguna fila trae `enunciado` ni `alternativas` | Claude Code · guion |
| Un valor distinto de `1` responde `PETICION_INVALIDA` | Provocado con `resumen=true` y `resumen=0`: **400**, `usar_respaldo: false` en los dos | Claude Code · guion |
| El conteo del resumen coincide con el dibujado, módulo a módulo | Comparado en los siete. Rojo provocado poniendo `COUNT(*) + 1` en el extremo: 20 problemas, incluidos los siete «promete 53 y se dibujaron 52» | Claude Code · guion |
| El modo degradado trae los siete conteos, con el aviso de ADR-008 al abrir | `Modo degradado al ABRIR: el aviso de ADR-008 se ve antes de elegir nada, con el estado vacío debajo y los 7 conteos del índice contados sobre la copia` | Claude Code · guion |
| En una ventana de 700 px de alto el panel sigue siendo usable | Punto 7 de la pasada: EXITOSO | autor |
| Bajo el punto de corte el panel se apila sin romperse | Puntos 4 y 5 de la pasada: teléfono 390 × 844 y apilado bajo `lg`, EXITOSO. El guion cubre el punto de corte del título: falla si vuelve a ser `xl` | los dos |
| Una captura en escala de grises distingue qué representa cada barra | Punto 8 de la pasada: EXITOSO, con captura tomada, y cubriendo además el módulo activo | autor |
| El diseño mantiene la identidad del sitio | Los trece colores usados en el panel, el índice y el componente salen de la paleta de `tailwind.config.cjs`; cero literales hexadecimales y cero valores arbitrarios de color | Claude Code · guion |
| Sin errores de consola con cualquier módulo cargado | Punto 1 de la pasada: los siete módulos, en local y en producción, EXITOSO | autor |
| `npm run verificar` termina en 0 | Salida completa del autor tras el commit: `VERIFICADO`, las cinco comprobaciones en OK, código 0 | autor |

### Los tres criterios que la auditoría añadió, y no estaban en la lista original

| Criterio | Evidencia | Quién |
|---|---|---|
| Ningún camino deja el foco en `<body>`, y tras cargar un módulo el foco está en su cabecera | `Foco: elegir y confirmar dejan en la cabecera del modulo; cancelar devuelve a su fila del indice; y repintar el indice conserva la fila que lo tenia. Ninguno cae al body`. Rojo provocado quitando el desplazamiento y el foco: los cuatro «el foco quedó en body». Y los puntos 2, 3 y 9 de la pasada: EXITOSO | los dos |
| Tras una carga fallida las dos mitades hablan del mismo módulo, y pulsarlo reintenta | `Carga fallida: el indice y la zona derecha hablan del modulo 2, el foco queda en el mensaje que lo explica, y volver a pulsarlo reintenta`. Rojo provocado revirtiendo el arreglo: 2 problemas | Claude Code · guion |
| Pulsar un módulo que ya está cargando no lanza una segunda petición | `Doble toque: 3 pulsaciones sobre el modulo 5 mientras cargaba salieron a pedirlo 1 vez`. Rojo provocado quitando la guarda: `salio a pedirlo 3 veces` | Claude Code · guion |

## Lo que esta iteración no puede afirmar

- **Que el índice muestre el avance de cada módulo.** No lo muestra: no hay avance que
  mostrar hasta que exista memoria. Es la iteración 33, que hereda este índice y lo llena.
- Que el estudiante recupere lo respondido al volver a un módulo. Sigue perdiéndose, y por
  eso el aviso de la iteración 31 sigue siendo necesario y tiene que cubrir también el
  salto desde el índice.
- Que responder mal enseñe algo. La justificación visible era de la 33 cuando esto se
  escribió; tras la reorganización del 2026-09-15 es de la **34**.

## Notas de la iteración

_Escritas al cerrar, el 2026-09-15._

### Qué se construyó

El panel dejó de ser una columna de tres barras verticales y pasó a ser lo que gobierna la
página. Las barras son horizontales, a todo el ancho, y cada una lleva su etiqueta, su cifra
y su porcentaje en la misma fila. El `<select>` de la iteración 31 desapareció: en su lugar
hay un **índice de los siete módulos**, que es ahora el único control para elegir qué
practicar, y que muestra los siete estados a la vez en lugar de esconder seis.

Para que el índice pudiera decir cuántas preguntas tiene cada módulo **sin traerse el banco**
entró `?resumen=1` en `/api/preguntas`, autorizado por **ADR-033**. La regla que dejó la
iteración 31 —«sin número hasta que sea cierto»— no se aflojó: las cifras siguen saliendo de
un dato y no del código, y lo único que cambió es que el dato llega antes de elegir.

### Lo que encontró la auditoría, y que no estaba planeado

Con el código ya escrito y commiteado, una revisión encontró cuatro defectos que habrían
hecho fallar los criterios de navegador. Los cuatro se reprodujeron antes de tocarlos.

| # | Qué estaba mal | Cómo se arregló | Rojo provocado |
|---|---|---|---|
| **H1** | `pintarIndice()` reescribía el `innerHTML` de la lista y destruía el botón enfocado. Pasaba al cargar un módulo, al llegar los conteos y al confirmar el aviso: el foco caía al `<body>` y quien navega con teclado tenía que volver a tabular desde la barra de navegación | El repintado salva el foco y lo repone **solo si estaba dentro del índice**; reponerlo siempre se lo robaría a quien estuviera en otra parte | `repintar el indice —lo que pasa cuando llegan los conteos— tiro el foco al body` |
| **H2** | El comentario prometía que el módulo activo se distinguía «por borde, fondo y peso de letra», y las tres diferencias eran de color. En escala de grises quedaban tres tonos parecidos | Todas las filas reservan una barra izquierda de 4 px y solo la activa la pinta. Es una diferencia de **forma**, y ninguna fila se mueve al cambiar de módulo | `las filas del indice no reservan la barra izquierda` |
| **H3** | `estado.modulo` se fijaba al pedir y el índice se marcaba al terminar. Con una carga fallida, la zona derecha decía «no se pudo cargar el Módulo 5» y el índice marcaba el 3. Y pulsar el mismo módulo no reintentaba: el único camino de vuelta era recargar | El índice marca **al pedir**, salga bien o mal, y la puerta permite reintentar cuando no hay nada cargado | `el indice marca «5»: las dos mitades de la pantalla dicen modulos distintos` y `pulsar el modulo 2 dibujo 0 y tenia que reintentar y dibujar 52` |
| **H4** | El título del módulo estaba oculto hasta `xl` mientras la lista pasaba a una columna en `lg`: entre 1024 y 1280 px había una columna ancha mostrando solo «Módulo 3» | El título aparece en `lg`, el mismo punto de corte que `lg:grid-cols-1`. Los dos tienen que moverse juntos | `el titulo del modulo se esconde hasta xl, y la lista es de una columna desde lg` |

**Y una quinta, que abrió el arreglo de H3.** Permitir el reintento cuando no hay nada
cargado también es cierto **mientras carga**. En una conexión modesta —el público de
`vision.md`— la espera basta para que el estudiante pulse otra vez creyendo que no registró
el toque, y cada toque eran 44 a 65 KB más por la misma pregunta. Se añadió una bandera
`moduloCargando`, separada de `peticionVigente` porque resuelven cosas distintas: aquélla
descarta respuestas tardías, ésta impide salir a pedir. Se baja justo después del guardia de
respuesta tardía y no en cada final, que es lo que mantiene vivo el reintento cuando la carga
falla. Rojo provocado retrasando la respuesta 700 ms y pulsando tres veces:
`salio a pedirlo 3 veces`.

### La decisión del autor: elegir un módulo deja al estudiante en su cabecera

Tomada el 2026-09-11. Al terminar de cargar, la página se desplaza a la cabecera del módulo
y el foco va ahí, venga el cambio directo del índice o del botón «Cambiar de módulo».
«Quedarme acá» devuelve el foco a la fila del módulo actual.

El motivo es que dibujar sin moverse solo funciona si las preguntas ya están a la vista, y no
lo están en ninguno de los dos usos reales: en **teléfono** quedan pantalla y media por debajo
del índice, y en **escritorio** el panel es pegajoso, así que se puede elegir con la página ya
desplazada y aterrizar a mitad del módulo nuevo.

Dos detalles que son parte de la decisión y no del código: el desplazamiento suave respeta
`prefers-reduced-motion`, y el foco se pide con `preventScroll` para que enfocar no produzca
una segunda sacudida. Y si la carga falla o el módulo viene vacío no hay cabecera a la que ir:
el foco va al mensaje que explica lo que pasó.

**ADR-032 se actualizó dos veces** durante esta iteración, y ninguna toca su decisión
original —el control sigue viviendo en el panel fijo, sobre las barras—: la primera porque
cambió la forma del control, y la segunda porque **cambió su compensación**. El enlace «Ir al
índice de módulos» del estado vacío se justificaba como la mitad de un viaje que el estudiante
completaba a mano; ahora la vuelta la hace el sitio, y el enlace pasa a resolver solo la ida.

### Lo medido

| | Antes de la 31 | Tras la 31 | Tras la 32 |
|---|---|---|---|
| Abrir la página, sin elegir nada | 371,8 KB | 0,2 KB, sin cifras | **1,1 KB, con las siete** |
| El resumen frente al banco entero | — | — | **0,9 KB contra 371,8 KB: 410 veces menos** |

Y un dato que salió de producción, no del servidor local: el 2026-09-15 `?resumen=1` informó
**`filas_leidas: 1111`**. Es mucho más de lo que pesa la respuesta, porque contar por módulo
recorre la vista entera. No es un problema hoy y **se anotó como vigilancia** en el registro,
junto a H-008: esa consulta se ejecuta en cada apertura de `cuestionario.html`, y desde el
2026-09-01 D1 corta las consultas del plan gratuito que superan el límite diario de filas
leídas.

### Lo que hereda la 33

El índice está construido pero **medio vacío a propósito**: muestra el nombre y la cantidad
de cada módulo, y ningún avance. No es un olvido —hasta que exista memoria, como mucho un
módulo tiene respuestas y los otros seis están en cero, y pintar esos ceros diría «sin
empezar» donde la verdad es «se perdió»—. La 33 lo llena, y con eso el índice pasa a hacer el
trabajo que la iteración 31 le encargó: que el estudiante termine lo que empieza porque ve lo
que lleva, no porque se le quite el control.

Dos consecuencias concretas para el diseño de la memoria, ya anotadas allá: el avance se
guarda **por módulo** y no agregado, y **el aviso de pérdida de la 31 caduca** en cuanto haya
memoria, porque cambiar de módulo dejará de perder nada.

### Adelantado de la 33

**«Reiniciar el módulo» vuelve a la cabecera del módulo en vez de a la portada, y respeta
`prefers-reduced-motion`.** Salió al implementar el desplazamiento y el foco de esta
iteración: la llamada ya existía, mandaba al tope de la página —donde está la portada, no el
módulo— e ignoraba la preferencia de movimiento reducido aunque el sitio ya tuviera
`prefersReducedMotion()` en `utils/dom.js`. Es el criterio «al reiniciar, el foco queda en un
lugar razonable para quien navega con teclado» de la iteración 33, resuelto antes de tiempo
porque el arreglo era la misma línea que ya se estaba tocando.
