# Iteración 35 · Transición de carga

**Épica:** 30 · Cuestionario
**Estado:** 🔵 En curso · lectura de alcance hecha, decisiones 1 a 8 resueltas
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
- [ ] Construir la transición de las decisiones 1, 3 y 5.
- [ ] Desactivar los controles del panel durante la carga (decisión 6).
- [ ] Mostrar el texto de carga lenta (decisión 7).
- [ ] Hacer que conviva con el foco aparcado en «Cargando…», el desplazamiento a la
  cabecera, el repaso, el mensaje con N en 0 y la memoria de la visita.
- [ ] Respetar `prefers-reduced-motion`, y permitir simularlo en el DOM falso (decisión 8).
- [ ] Permitir en los guiones retrasar cada módulo con un plazo distinto, para provocar
  dos cargas que llegan en desorden.
- [ ] Corregir la cifra «44 a 65 KB» de los comentarios de `cuestionario.js`, que no
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
- [ ] **La transición acompaña la carga real, no un tiempo inventado.** Con una respuesta
  lenta, el indicador sigue hasta que el módulo llega; con una instantánea, dura el piso y
  termina.
- [ ] **Nadie espera de más.** Medido desde el clic, el tiempo hasta ver el módulo es el
  mayor entre lo que tarda la carga y el piso, y no más. Se mide e informa para una
  respuesta instantánea, una lenta y una fallida inmediata.
- [ ] **El piso se aplica igual a todo final**: módulo dibujado, módulo vacío, error y
  caída a la instantánea.
- [ ] **La transición muestra el logotipo quieto, un indicador sin porcentaje y el texto
  que nombra el módulo**, y ningún número de avance.
- [ ] **El camino más lento funciona:** en modo degradado, la transición acompaña la carga
  entera, el texto de carga lenta aparece si se pasa el plazo, y el aviso de ADR-008 queda
  visible al final.
- [ ] **El texto de carga lenta aparece solo cuando corresponde**: no aparece en una carga
  normal, aparece al pasar el plazo, y desaparece en cualquier final.
- [ ] **Una carga fallida no deja la transición colgada**: termina y da paso al mensaje de
  error, con el foco en ese mensaje.

**La convivencia**

- [ ] **Elegir otro módulo mientras uno carga termina dibujando el último elegido**, también
  cuando la respuesta del primero llega después que la del segundo, y la transición no
  queda duplicada ni colgada. Provocado con retrasos distintos por módulo.
- [ ] **Durante la carga, «Reiniciar el módulo» y «Repasar mis errores (N)» están
  desactivados y se anuncian como no disponibles**; pulsarlos no cambia nada; y vuelven a
  estar disponibles en cada final de la carga vigente, incluido el caso de una respuesta
  vieja descartada.
- [ ] **Durante la carga no se puede responder ninguna pregunta del módulo anterior**, y
  ninguna respuesta se guarda en un módulo que no es el que la muestra.
- [ ] **Durante la carga, el panel no invita a responder**: `#mensaje-avance` no dice
  «Responde la primera pregunta para comenzar.» mientras la zona dice que está cargando.
- [ ] **Elegir un módulo desde el repaso, o con el mensaje con N en 0 a la vista**, sale del
  repaso y retira el mensaje igual que antes de esta iteración.
- [ ] **Durante la carga, el índice no describe un módulo que no está dibujado** (ADR-033).
- [ ] **El panel fijo no crece** durante la transición (ADR-032): no se añaden nodos al
  panel.
- [ ] **Con el movimiento reducido simulado, la transición no declara movimiento** y sigue
  diciendo que está cargando.
- [ ] **Durante la espera, el contenedor no se reescribe más de lo necesario** para que la
  carga se anuncie una sola vez: se informa cuántas veces se reescribe.
- [ ] **No entran colores fuera de la paleta** en el marcado de la transición.
- [ ] **`npm run probar:filtrado`, `npm run probar:memoria` y `npm run probar:escapado`
  siguen en verde**, con cada rojo nuevo provocado una vez, y `instantanea-banco.js` sin
  cambios.

### Los comprueba el autor en el navegador

- [ ] **Con buena conexión no se nota espera**, y con la red limitada en DevTools la
  transición acompaña hasta el final.
- [ ] **Con la red muy lenta o el extremo bloqueado**, aparece el texto de carga lenta y se
  entiende que la página sigue viva.
- [ ] **Con `prefers-reduced-motion` activado**, la transición no anima, y la página sigue
  diciendo que está cargando.
- [ ] **Un lector de pantalla da a conocer que está cargando** una sola vez, sin repetirlo a
  cada paso.
- [ ] **El aterrizaje en la cabecera sigue ocurriendo** después de la transición, en
  escritorio y en teléfono.
- [ ] **Cambiar de módulo varias veces seguidas, rápido, desde el teléfono** no deja nada
  raro a la vista, y los controles desactivados no parpadean de forma molesta.
- [ ] **El panel sigue alcanzando hasta «Reiniciar el módulo» en una ventana de 1280 × 700.**
- [ ] **La identidad visual se mantiene.**
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que la carga sea más rápida.** Esta iteración cambia cómo se ve la espera, no cuánto
  dura. Hacerla más corta es trabajo de la épica 50, iteración 53.
- **Que el estudiante sepa cuánto falta.** No hay dato honesto para decirlo (decisión 1).

## Notas de la iteración

_Pendiente._