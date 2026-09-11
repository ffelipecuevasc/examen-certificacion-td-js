# Iteración 31 · Selector de módulo

**Épica:** 30 · Cuestionario
**Estado:** 🔵 En curso · comenzada el 2026-09-11
**Depende de:** épica 20, cerrada el 2026-09-10 con las 368 preguntas en producción

## Objetivo

Que el estudiante elija qué módulo quiere practicar y que `cuestionario.html` le
muestre sólo las preguntas de ese módulo.

## Por qué cambia el planteamiento original

Esta iteración se escribió cuando el banco tenía 105 preguntas y la página las
dibujaba todas de una vez. Hoy son **368**, y mostrarlas juntas dejó de ser una
opción de diseño: es inviable para quien estudia desde el teléfono con conexión
modesta, que es parte del público descrito en `vision.md`.

El planteamiento anterior dejaba abierta la estrategia de renderizado —por módulo,
carga diferida al desplazarse, u otra—. **Esa decisión está tomada: se filtra por
módulo**, por decisión del autor el 2026-09-10. No es sólo una forma de aligerar la
página: responde a cómo estudia el público, que llega con un módulo en mente porque
así está organizado el plan formativo.

## La decisión de comportamiento, tomada y con su motivo

**El selector queda libre en todo momento.** El estudiante cambia de módulo cuando
quiera, sin terminar el que empezó.

Se evaluó bloquearlo tras la primera elección, para obligar a terminar el módulo, y
**se descartó el 2026-09-10**. El motivo está en `vision.md`: el público estudia «a
deshora, con conexiones variables y en sesiones cortas e interrumpidas», y el
objetivo es practicar «a ritmo propio». Bloquear el selector deja al estudiante con
dos salidas —seguir en un módulo que no quería, o reiniciar y perder todo— y la
tercera que va a elegir de verdad es cerrar la página. **Forzar no produce
constancia: produce abandono.**

Lo que sí se busca —que el estudiante termine lo que empieza— se consigue
mostrándole su avance, no quitándole el control. El índice de módulos con avance
individual de la iteración 32 hace ese trabajo.

## La consecuencia que esta iteración tiene que resolver

**El avance no se guarda hasta la iteración 33.** Por decisión del autor, esa
iteración no se adelanta. Así que hoy, con el selector libre, **cambiar de módulo
pierde lo respondido**.

Eso no se puede dejar implícito. La iteración tiene que resolver que el estudiante
sepa lo que va a perder **antes** de perderlo, no después. Cómo se le dice queda a
criterio de quien implemente; lo que no vale es que se pierda en silencio.

## La decisión de diseño sin resolver

**¿Dónde vive el selector?** La página tiene dos zonas: a la izquierda la
explicación y las barras de progreso, a la derecha las preguntas. Ese reparto se
mantiene y no está en discusión.

Pero el selector puede ir en cualquiera de las dos, y no es lo mismo: en la zona
izquierda acompaña a la orientación y queda visible al desplazarse; en la derecha
encabeza lo que controla y es lo primero que se ve al llegar. Y en teléfono, donde
las zonas se apilan, la elección cambia qué aparece primero en pantalla.

Quien la tome la documenta con su motivo. **No se resuelve poniéndolo donde quepa.**

## Alcance

**Dentro:** el selector, el filtrado por módulo, el estado vacío inicial, el aviso
al cambiar de módulo con preguntas respondidas, y el contador de la portada
reflejando lo que se muestra.

**Fuera:** guardar el avance entre visitas (iteración 33), el índice de módulos con
avance individual (iteración 32), la justificación visible al responder (iteración
33), y cualquier cambio en el origen de los datos (cerrado en la épica 20).

## Tareas

- [x] Añadir el selector de módulo, con los siete módulos y el número de preguntas
  de cada uno.
- [x] Pedir a la capa de datos sólo el módulo elegido. El extremo `/api/preguntas`
  ya acepta `?modulo=N` desde la iteración 22: no hay que construirlo.
- [x] Mostrar el estado vacío inicial mientras no haya módulo elegido, con un
  mensaje que diga qué hacer.
- [x] Avisar antes de perder lo respondido al cambiar de módulo.
- [x] Mantener el barajado de alternativas y el respeto por `orden_fijo`.
- [x] Mantener el escapado sobre todo el contenido que se dibuje.
- [x] Hacer que el contador de la portada diga lo que se está mostrando, no el total
  del banco.
- [x] Resolver y documentar dónde vive el selector.
- [x] Comprobar que el modo degradado sigue funcionando: con la capa de datos caída,
  el respaldo de ADR-008 tiene que poder filtrarse por módulo igual.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no
razonando sobre el código.

- [x] **El estado vacío aparece y dice qué hacer.** Al abrir la página sin elegir
  nada, la zona derecha está vacía con su mensaje. Se muestra.
- [x] **Cada módulo muestra exactamente sus preguntas.** Se recorren los siete y el
  número dibujado coincide con el del banco: 52, 61, 61, 49, 52, 48 y 45. Se
  cuenta sobre la página, no sobre la respuesta del extremo.
- [x] **Ninguna pregunta de otro módulo se cuela.** Se comprueba sobre el contenido
  dibujado.
- [x] **El selector sigue libre después de elegir.** Se cambia de módulo sin
  reiniciar y funciona. Si el selector quedara bloqueado, el criterio falla.
- [ ] **El aviso aparece antes de perder algo, y no aparece cuando no hay nada que
  perder.** Se provocan los dos casos: cambiar de módulo con preguntas
  respondidas, y cambiar sin haber respondido ninguna.
- [x] **El contador dice la verdad sobre lo que se muestra.** Se cambia de módulo y
  el contador lo acompaña. Es el criterio que la iteración 24 dejó comprobado
  con 8 preguntas y que aquí se comprueba con el banco real.
- [x] **La marca de orden fijo se respeta.** La pregunta del comando de Git, en el
  módulo 2, no baraja sus alternativas. Se recarga varias veces y se muestra que
  mantiene el orden.
- [x] **El escapado sigue en pie con el banco real.** `npm run probar:escapado` pasa
  a escala, con las 368 y sin caer al aviso de «no a escala».
- [x] **El modo degradado filtra igual.** Con la capa de datos caída, se elige un
  módulo y se muestran sus preguntas desde el respaldo, con el aviso de ADR-008
  visible.
- [ ] **La página es utilizable en teléfono.** Se prueba en un ancho de teléfono con
  un módulo grande cargado, y se describe el comportamiento del apilado.
- [ ] **El teclado alcanza el selector y las preguntas** que aparecen después de
  elegir.
- [ ] **Sin errores de consola** con cualquier módulo cargado.
- [x] **La decisión de dónde vive el selector está documentada** con su motivo.
- [ ] **`npm run verificar` termina en 0** con sus cinco comprobaciones en OK.

## Lo que esta iteración no puede afirmar

- Que el avance se conserve. No se conserva: es la iteración 33, y por eso existe el
  aviso.
- Que el estudiante sepa cuánto lleva en cada módulo. Eso es el índice de la 32.
- Que responder mal enseñe algo. La justificación visible es de la 33.

## Notas de la iteración

_Escritas el 2026-09-11, con la iteración todavía abierta: faltan cinco criterios._

### Lo que se construyó

- **El selector vive en el panel fijo, sobre las barras.** Decidido y documentado en
  **ADR-032**, con sus tres motivos: gobierna las barras que vienen justo debajo, el
  panel es pegajoso y la zona derecha no, y en teléfono esta columna se apila
  primero. Es un `<select>` y no siete botones: en teléfono abre el selector nativo,
  no suma 300 px a un panel ya largo, y el teclado lo alcanza sin que haya que
  programar nada.
- **`mostrarModulo(numero)`** es ahora el único camino por el que aparecen preguntas.
  `renderCuestionario()` ya no pide nada: deja la página vacía esperando una elección.
- **El aviso de pérdida no es un `window.confirm()`.** Sale en el idioma del
  navegador, con aspecto de error del sistema, y el navegador puede suprimirlo. Es un
  bloque propio, pegado al selector. Y **el selector se devuelve a su sitio antes de
  preguntar**: si el estudiante ignora el aviso, recarga o se va, no pierde nada.

### La decisión que hubo que tomar sobre los números del selector

La tarea pedía el selector «con el número de preguntas de cada uno». Antes de pedir un
módulo, el navegador **no sabe** cuántas tiene: `/api/preguntas` trae preguntas
completas, `/api/estado` sólo el total, y la instantánea son 500 KB que no se cargan
para contar. Escribirlos a mano es exactamente el «105 preguntas» que ya mintió el
2026-09-08.

Decisión del autor, el 2026-09-11: **sin número hasta que sea cierto.** El selector
lista los siete sin cifra, y cada módulo estrena la suya en cuanto se dibuja, contada
sobre las preguntas dibujadas. Se descartó añadir un `?resumen=1` al extremo: está
fuera del alcance de la iteración. **La iteración 32 va a necesitar los siete conteos
por adelantado** para el índice con avance individual, y ahí habrá que volver sobre
esto.

### Un arreglo que no estaba en la lista de tareas, y por qué se hizo igual

`renderEstadoDatos()` —la línea del pie— llamaba a `leerPreguntas()` **sólo para
contar**. Estaba anotado en el registro desde el 2026-09-05 como una petición
duplicada sin consecuencias.

Con el filtrado por módulo dejó de ser inofensiva y pasó a ser lo contrario de lo que
la página promete: el cuestionario arranca vacío para no descargarle el banco entero a
nadie, y el pie lo descargaba igual antes de que el estudiante tocara nada. **Medido
contra el servidor local: 371,8 KB al abrir, con la pantalla vacía.**

Sin esto, la tarea «pedir a la capa de datos sólo el módulo elegido» quedaba sin
cumplir. El número sale ahora de `preguntas_activas`, que `/api/estado` ya cuenta en la
misma vista:

| Momento | Antes | Ahora |
|---|---|---|
| Abrir la página, sin elegir nada | 371,8 KB | **0,2 KB** |
| Abrir + módulo 8 + módulo 3 | 371,8 KB | **109,1 KB** |

**Lo que el pie dejó de poder afirmar:** si la copia de respaldo cargó, porque ya no la
carga. Antes lo decía y era cierto. Ahora, sin conexión, dice sólo que no hay conexión;
lo que pase con la copia lo dice la zona de preguntas, que es donde ADR-008 lo exige.

### Cómo se produjo la evidencia

`scripts/probar-filtrado.mjs`, nuevo, y `npm run probar:filtrado`. Corre el componente
real contra el extremo real, captura el HTML que escribe y **cuenta sobre ese HTML**,
no sobre la respuesta del extremo. Lo esperado lo pregunta aparte a la base local por
wrangler, nunca al extremo: una prueba que compara la respuesta del extremo consigo
misma no comprueba nada.

Cuatro veredictos, con `NO A ESCALA` para que no pueda dar verde sobre el banco de
juguete. **Provocado en rojo dos veces**, que es lo que lo vuelve una comprobación:

- quitándole el filtro a `leerPreguntas()` → `FILTRADO ROTO`, 30 problemas, código 1,
  incluido el modo degradado;
- desactivando la condición del aviso → `FILTRADO ROTO`, 7 problemas, código 1,
  señalando además que el selector se había movido antes de preguntar.

El DOM falso salió de `probar-escapado.mjs` a `scripts/dom-falso.mjs`, porque ahora lo
usan dos guiones y dos copias no fallan al divergir, se quedan calladas. Aprendió a
disparar los oyentes que el componente registró: sin eso no hay forma de provocar desde
Node una decisión que toma el estudiante.

### Lo que hubo que tocar de `probar-escapado.mjs`

Llamaba a `renderCuestionario()` y esperaba preguntas. Con la página arrancando vacía
habría capturado HTML sin preguntas y **habría dado verde sin mirar nada** —el patrón
de H-023—. Ahora dibuja el módulo de la fila hostil, y para el banco a escala recorre
los siete módulos comparando cada pregunta contra el HTML del suyo. Sigue revisando las
368: `368 preguntas, 2208 porciones de texto, 184 con algún carácter que escapar`.

### Lo que no se pudo cerrar, y por qué

**No hay navegador disponible en esta sesión.** Los cinco criterios sin marcar son
exactamente los que no se pueden provocar desde Node, y no se marcan razonando sobre el
código:

- **El aviso, visto.** Su *decisión* sí quedó provocada en los dos casos —aparece con
  respuestas dentro, no aparece sin ellas, dice cuántas se pierden, el selector vuelve
  solo y las preguntas no se tocan—. Lo que falta es confirmar que se **ve**.
- **Teléfono, teclado y consola.** Nada de eso existe fuera de un navegador.
- **`npm run verificar` en 0.** Da 1, y por un solo motivo: `css` responde
  `DESFASADO · El CSS corresponde a su fuente, pero difiere de lo que hay commiteado`.
  El CSS está bien generado; falta el commit, que no lo hace Claude Code (ADR-030).
  Las otras cuatro están en OK.

### Hallazgo abierto

**H-035** · los títulos de los módulos 3, 4 y 8 están sin tildes en D1, desde el seed de
la migración 001. El sitio los muestra así. Era menor mientras la cabecera del módulo
separaba secciones; ahora es el rótulo principal de lo que se estudia **y queda junto al
selector, que sí las lleva**. Se arregla con una migración `003` que corre el autor.