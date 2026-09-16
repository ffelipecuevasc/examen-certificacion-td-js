# Iteración 35 · Transición de carga

**Épica:** 30 · Cuestionario
**Estado:** ⚪ No iniciada · lista para la lectura de alcance
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

Desde la 32 hay dos piezas con las que esto tiene que convivir: el foco se aparca en el
mensaje «Cargando…» mientras llega la respuesta, y al terminar el sitio desplaza y lleva
el foco a la cabecera del módulo.

## Historial de este archivo

- **2026-09-15 · creada** al partir la antigua iteración 33, por decisión del autor.
- **2026-09-16 · actualizada antes de la lectura de alcance.** El archivo decía que no
  dependía de la 33 ni de la 34, y ya no es cierto. Se agregó lo que hereda de ellas y de
  la 36, se quitó una cifra de peso de la instantánea que no venía de una medición, se
  precisó la comprobación del progreso, y se declararon las decisiones de diseño que el
  archivo escondía (sección «Decisiones sin resolver»).

## Lo que hereda

**De la 32:**

- El índice de módulos es el único control para elegir módulo, a través de la puerta
  única `pedirCambioDeModulo()`.
- El foco se aparca en «Cargando…» mientras llega la respuesta, y al terminar va a la
  cabecera del módulo, con desplazamiento.
- **ADR-032: el panel fijo no crece ni una fila.** La transición vive en la zona de
  preguntas.
- **ADR-033: lo dibujado manda.** Durante la carga, lo que diga el índice no puede
  describir un módulo que todavía no está dibujado, ni uno que ya dejó de estarlo.

**De la 33:**

- El avance se guarda por módulo y se restaura al cargar (ADR-034, formato `v: 1`).
- Los cambios del banco, y en esta iteración también las demoras y las caídas, se
  provocan **interceptando la respuesta del extremo**, nunca con `banco:actualizar`,
  `banco:insertar`, `datos:instantanea` ni nada que regenere
  `static/js/data/instantanea-banco.js`.

**De la 34:**

- **Elegir otro módulo sale del repaso** sin preguntar, y **el mensaje con N en 0 se
  retira** al cambiar de módulo (decisiones 5 y 11).
- **La memoria de la visita** (actualización del 2026-09-16 de ADR-034) sobrevive al
  cambio de módulo.
- **La iteración 34 quitó de `responder()` la rama que sumaba respuestas sin identificar**,
  con una premisa: al cambiar de módulo, `mostrarModulo()` pone `bancoCargado` en null y
  reescribe el contenedor, así que no queda ninguna alternativa anterior que pulsar. **Una
  transición que deje las preguntas anteriores visibles y pulsables durante la carga
  rompería esa premisa.**
- Existen «Repasar mis errores (N)», «Volver al módulo completo» y «Ver por qué», que
  pueden pulsarse mientras un módulo carga.

**De la 36:**

- Paleta cerrada: no entran colores nuevos. Ya no hay dos niveles de gris para dar
  jerarquía.
- El logotipo hace su efecto `tada` una sola vez, y `alert-loop.svg` anima para siempre
  como excepción aceptada.

## Por qué no es una espera fija

Una espera fija miente en los dos sentidos. Con buena conexión hace esperar al estudiante
sin ningún motivo. Con mala conexión termina antes de que el módulo llegue, y la página
dice «listo» cuando no lo está. **El único tiempo honesto es el que la carga tarda de
verdad.**

El mínimo de unos 400 ms no contradice esto: no es una espera, es un piso. Solo actúa
cuando la respuesta llegó antes, para que la transición no se vea como un parpadeo, y
nunca alarga una carga que ya tardó más que eso.

## Decisiones sin resolver

### 1 · ¿Se puede medir el progreso de la descarga de un módulo? (se resuelve con evidencia)

Para dibujar una barra de progreso real, el navegador necesita saber cuánto pesa la
respuesta antes de terminar de recibirla. Una respuesta enviada por partes normalmente no
lo informa. **Y una respuesta comprimida puede informar un peso que no sirve**: la cabecera
de largo mide los bytes comprimidos, mientras que lo que el navegador entrega al leer ya
viene descomprimido, así que dividir uno por otro da un porcentaje falso. En cualquiera de
esos casos **no hay avance que medir**. Dibujar una barra que avanza igual sería inventar
un número, y este proyecto no muestra números que no salgan de un dato.

La comprobación debe medir también **cuánto pesa y cuánto tarda de verdad** la respuesta
de un módulo, local y en producción: si la carga típica dura menos que el piso, una barra
de progreso no tendría tiempo de mostrar nada.

- **Si la respuesta permite medir**, la barra acompaña la carga real.
- **Si no lo permite**, el criterio pasa a ser un indicador de «cargando» **sin porcentaje**
  y sin nada que sugiera cuánto falta.

Lo que se encuentre se anota aquí con su evidencia antes de construir nada.

### 2 · Qué pasa con el módulo anterior durante la carga (la decide el autor)

Hoy la zona se vacía de inmediato. Una transición podría vaciarla, o dejar el módulo
anterior a la vista hasta que llegue el nuevo. Lo segundo choca con la premisa de la 34
descrita arriba si las preguntas anteriores siguen pulsables. **Pendiente.**

### 3 · El logotipo de JavaScript en la transición (la decide el autor)

La tarea original lo pide encima de la barra. No está en ningún criterio, y hay que
decidir si se mantiene y cómo convive con el `tada` único de la 36 y con
`prefers-reduced-motion`. **Pendiente.**

### 4 · Volver a un módulo ya cargado en la visita (la decide el autor, tras la lectura de alcance)

Si el sitio ya tiene ese módulo en memoria y no lo vuelve a pedir, no hay carga que
acompañar. Hay que decidir si hay transición, y cuál. Depende de lo que haga hoy la capa de
datos. **Pendiente.**

### 5 · El piso de 400 ms en la carga fallida y en el modo degradado (la decide el autor)

No está dicho si el piso se aplica también cuando la carga falla o cae a la instantánea.
**Pendiente.**

## Tareas

- [ ] Comprobar, contra el extremo local y contra producción, si la respuesta de
  `/api/preguntas?modulo=N` permite medir el progreso de la descarga, con su peso y su
  duración, y anotar la evidencia en este archivo.
- [ ] Resolver con el autor las decisiones 2 a 5 y anotarlas en este archivo.
- [ ] Construir la transición según lo que digan esa comprobación y esas decisiones.
- [ ] Hacer que conviva con el foco aparcado en «Cargando…» y con el desplazamiento a la
  cabecera de la 32.
- [ ] Hacer que conviva con el repaso, el mensaje con N en 0 y la memoria de la visita de
  la 34.
- [ ] Respetar `prefers-reduced-motion`.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no razonando
sobre el código. Las demoras, las caídas y los cambios del banco se simulan interceptando
la respuesta del extremo.

### Los provoca Claude Code

**La carga**

- [ ] **La decisión de medir o no medir está tomada con evidencia**, local y en producción,
  con peso y duración de la respuesta, y anotada en este archivo antes de construir.
- [ ] **La transición refleja la carga real, no un tiempo inventado.** Se demuestra con una
  respuesta lenta y con una instantánea: en la primera la transición acompaña hasta que el
  módulo llega; en la segunda hay un destello breve y no una espera.
- [ ] **Nadie espera de más.** El tiempo entre elegir un módulo y verlo no crece respecto de
  lo que tarda la consulta más el mínimo visible. Se mide y se informa.
- [ ] **El camino más lento funciona:** en modo degradado, cargando desde la instantánea, la
  transición acompaña la carga entera y el aviso de ADR-008 sigue visible. El peso de la
  instantánea se informa medido.
- [ ] **Una carga fallida no deja la transición colgada**: termina y da paso al mensaje de
  error, con el foco donde la 32 lo dejó.

**La convivencia**

- [ ] **Durante la carga no se puede responder ninguna pregunta del módulo anterior**, y
  ninguna respuesta se guarda en un módulo que no es el que la muestra.
- [ ] **Elegir otro módulo mientras uno carga termina dibujando el último elegido**, nunca
  uno anterior que llegó tarde, y la transición no queda duplicada ni colgada.
- [ ] **«Reiniciar el módulo», «Repasar mis errores (N)» y «Ver por qué» pulsados durante
  la carga** no dejan la página en un estado incoherente: se informa qué hace cada uno.
- [ ] **Elegir un módulo desde el repaso, o con el mensaje con N en 0 a la vista**, sale del
  repaso y retira el mensaje igual que antes de esta iteración.
- [ ] **Durante la carga, el índice no describe un módulo que no está dibujado** (ADR-033).
- [ ] **El panel fijo no crece** durante la transición (ADR-032).
- [ ] **`npm run probar:filtrado`, `npm run probar:memoria` y `npm run probar:escapado`
  siguen en verde**, con cada rojo nuevo provocado una vez, y `instantanea-banco.js` sin
  cambios.

### Los comprueba el autor en el navegador

- [ ] **Con buena conexión no se nota espera**, y con la red limitada en DevTools la
  transición acompaña hasta el final.
- [ ] **Con `prefers-reduced-motion` activado**, la transición no anima, y la página sigue
  diciendo que está cargando.
- [ ] **Un lector de pantalla da a conocer que está cargando** una sola vez, sin repetirlo a
  cada paso.
- [ ] **El aterrizaje en la cabecera sigue ocurriendo** después de la transición, en
  escritorio y en teléfono.
- [ ] **Cambiar de módulo varias veces seguidas, rápido, desde el teléfono** no deja nada
  raro a la vista.
- [ ] **La identidad visual se mantiene:** no entran colores fuera de la paleta.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que la carga sea más rápida.** Esta iteración cambia cómo se ve la espera, no cuánto
  dura. Hacerla más corta es trabajo de la épica 50, iteración 53.

## Notas de la iteración

_Pendiente._