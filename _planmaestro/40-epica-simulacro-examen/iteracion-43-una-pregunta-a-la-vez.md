# Iteración 43 · Recorrido de una pregunta a la vez

**Épica:** 40 · Simulacro de examen
**Estado:** 🔵 En curso · tanda 1 de 2 · construida a mano sobre el borrador de Claude Code
**Depende de:** iteración 42.

## Objetivo

Conectar al marcado de la 45 el recorrido del intento: una pregunta a la vez, cambiar la alternativa antes de avanzar,
avanzar, omitir con confirmación y avance automático, sin vuelta atrás y sin revelar aciertos hasta el resumen.

## Contexto

Es la diferencia conceptual con `cuestionario.html`. Allí la corrección es inmediata porque el objetivo es aprender. Aquí
no se corrige durante el intento, porque el objetivo es medir: saber que fallaste la pregunta 3 cambiaría tu ánimo en las
117 restantes.

## Historial de este archivo

- **2026-09-16 · reescrita dos veces.** El autor resolvió cambiar la alternativa, la confirmación al omitir y que las
  reglas son del simulacro, no del examen real. La disposición del indicador de avance pasó a la 45.
- **2026-09-18 · decisiones del autor y corte en dos tandas.** La lectura de alcance de Claude Code dejó demasiadas
  decisiones de diseño sin fijar para una sola pasada auditable, y el autor partió la iteración en dos tandas: la 1 es el
  recorrido funcionando; la 2, la accesibilidad fina de teclado, el bloque nuevo de `probar:escapado` y la comprobación
  automática del vocabulario de ADR-022. Las decisiones 1 y 3 a 7 de abajo son de ese día.
- **2026-09-20 · cambio de método.** Claude Code alcanzó a escribir el código de la tanda 1 sin sus pruebas y sin
  commit. El autor decidió conservar ese borrador y adoptar lo que eligió, incluidas tres decisiones que eran de la
  tanda 2 (decisión 8). La tanda se termina a mano: cada prueba nueva se escribe sobre el código ya existente y se ve en
  rojo **rompiendo a propósito la línea que vigila**, porque una prueba que nace en verde no demuestra que mire nada.

## Decisiones tomadas

### 1 · Avanzar, cambiar y omitir

> **Corregida el 2026-09-18.** La versión del 2026-09-16 hablaba de **un solo botón que cambiaba de texto**: «Siguiente»
> con alternativa marcada y «Omitir» sin ella. Se cambió porque el marcado de la iteración 45 ya dibuja dos botones, y
> porque un botón que cambia de significado bajo el dedo invita a omitir creyendo que se avanza.

- **Dos botones siempre visibles, «Siguiente» y «Omitir».**
- **«Siguiente» está deshabilitado mientras no haya alternativa marcada**, y se habilita al marcar. Avanza y registra la
  marcada.
- **«Omitir» está deshabilitado cuando hay alternativa marcada**, por la regla 5 de la épica: se omite sin alternativa
  marcada.
- **La alternativa marcada se puede cambiar** mientras no se avance, y lo que se registra es la última.
- **«Omitir» pide un segundo toque**, en la misma pantalla y sin ventanas emergentes. El primer toque no omite.
  *Confirmado por el autor el 2026-09-20*, después de pesar omitir al primer toque: se conserva lo que Claude Code ya
  había construido.
- **La confirmación se retira al marcar una alternativa y al cambiar de pregunta, y no tiene plazo propio.** Propuesta
  de Claude Code, confirmada por el autor el 2026-09-20. Un plazo solo podría retirarla bajo el dedo de alguien que ya
  decidió omitir, y la pregunta misma dura como máximo 30 segundos.
- **Una omitida no se puede responder después**, y cuenta como incorrecta.
- **Nunca se vuelve atrás.**

### 2 · Las reglas en la presentación son las del simulacro

El texto definitivo de la presentación (41) explica las reglas del README de la épica **como reglas del simulacro**: 120
preguntas, 30 segundos cada una, el sobrante se pierde, se puede cambiar la alternativa antes de avanzar, cómo se omite y
qué cuesta, que el reloj sigue si se sale, y que se aprueba el simulacro con 72 correctas. **No dice que el examen real
funcione igual.** Usa el vocabulario de la actualización de ADR-022, incluida la frase de la presentación autorizada el
2026-09-16.

> **Cerrados por la iteración 45 el 2026-09-18.** Los dos pendientes de abajo ya están resueltos en `simulacro.html`: el
> párrafo de entrada compara con el cuestionario de práctica en vez de afirmar algo del examen real, y el dato de los
> 120 minutos lleva su origen. Se conservan escritos como historia.

### 3 · Las alternativas son un grupo de radio

Del autor, 2026-09-18. Las alternativas pasan a `role="radiogroup"`, cada una con `role="radio"` y `aria-checked`, en
lugar de los botones de alternancia con `aria-pressed` que dejó la iteración 45. **Toca marcado de la 45**: se elige una
sola entre cuatro, y eso es un radio, no cuatro interruptores independientes.

### 4 · El cambio de pregunta se anuncia moviendo el foco

Del autor, 2026-09-18. El foco pasa a la tarjeta de la pregunta nueva, con el mismo gesto que `irAlMensaje()`. **No se
usa `aria-live` sobre la tarjeta:** con el avance automático cada 30 segundos, una región viva interrumpiría la lectura
del enunciado durante toda la hora, justo cuando el estudiante lo está escuchando.

### 5 · Pantalla «Intento terminado», transitoria

Del autor, 2026-09-18. Al resolverse la pregunta 120 se muestra una pantalla de espera que dice que el intento terminó y
ofrece «Empezar otro intento». **Es transitoria hasta que la iteración 44 traiga el resumen**, y está marcada así en el
código, con fecha, igual que la limitación que dejó escrita la 42.

### 6 · No se toca la API de historia del navegador

Del autor, 2026-09-18. «Atrás» sale de `simulacro.html` entera, y al volver a entrar se retoma el intento donde iba. Eso
es lo correcto: no hay nada que interceptar. Lo que se exige es que **ningún camino lleve a una pregunta anterior**, no
que se bloquee el botón del navegador.

### 7 · `probar:escapado` revisa el enunciado y las alternativas, no el ícono

Del autor, 2026-09-18. La tarjeta de la 45 no dibuja ningún ícono de módulo, y agregarlo tocaría una dirección visual
ya cerrada por poco beneficio real de seguridad. El bloque sigue siendo de la tanda 2.

### 8 · Tres decisiones de la tanda 2, cerradas por adopción

Del autor, 2026-09-20, adoptando lo que Claude Code implementó en su borrador:

- **Al terminar de cargar se muestra directamente la primera pregunta.** La pantalla «Intento listo» se retira: con el
  reloj corriendo desde el clic, una pantalla intermedia le quitaría segundos a la pregunta 1.
- **Durante el recorrido no existe «Empezar otro intento».** Solo aparece en la pantalla del final (decisión 5).
- **En consecuencia, un intento en curso no se puede abandonar desde la página.** Termina respondiendo, omitiendo o
  dejando que el reloj lo consuma.

Con esto, la tanda 2 queda en la accesibilidad fina de teclado, el bloque de `probar:escapado` y la comprobación
automática del vocabulario de ADR-022.

**Pendientes del texto provisional que dejó la etapa A de la 41** (anotados el 2026-09-16):

- **El párrafo de entrada dice que el simulacro practica «lo más difícil del día del examen».** Es una afirmación sobre el
  examen real sin fuente: se reescribe sin ella.
- **El aviso «Estas reglas son del simulacro, no del examen real» afirma que el examen dura 120 minutos y mezcla
  alternativas con programación.** El enlace a la fuente oficial de Talento Digital sigue pendiente. Antes de cerrar la 43,
  o se cita la fuente junto al dato, como en el aviso de la iteración 36, o el dato se presenta con su origen declarado.

## Tareas

> **Reescritas el 2026-09-20.** El código de las tareas de la tanda 1 ya existe en el borrador de Claude Code; **ninguna
> se marca hecha hasta que su prueba exista y se haya visto en rojo por mutación.** La versión anterior pedía «impedir
> volver atrás, también con el botón atrás del navegador» y «cerrar el texto de las reglas»: la primera cambió con la
> decisión 6 y la segunda la cerró la iteración 45.

### Tanda 1 · El recorrido funcionando

- [ ] Mostrar una pregunta a la vez, con su número y el total, reutilizando `dibujarTarjetaDeLaPregunta()` y
  `dibujarBotonesDelIntento()` y **no** `dibujarPantallaDelIntento()`, que dibujaría una segunda franja.
- [ ] Marcar y cambiar la alternativa sin registrarla hasta avanzar o agotarse.
- [ ] Dos botones según la decisión 1, con la confirmación de «Omitir» y su retiro.
- [ ] Registrar cada resultado (respondida con su alternativa u omitida) en el intento guardado, sin revelar si fue
  correcta.
- [ ] Redibujar la pregunta cuando el cronómetro resuelve una por agotamiento.
- [ ] Pasar `alTerminarElIntento` a los cronómetros y dibujar la pantalla transitoria de la decisión 5.
- [ ] Ir directo a la primera pregunta al terminar la carga, y retomar en la pregunta donde iba (decisión 8).
- [ ] Anunciar el cambio de pregunta moviendo el foco (decisión 4).
- [ ] Alternativas como grupo de radio (decisión 3), con `probar:identidad` en verde después.
- [ ] Revisar el margen negativo de la columna del intento con los dos avisos encendidos, que en esta iteración pasa a ser
  un estado real.
- [ ] Corregir la frase del `README.md` del plan maestro que manda llamar a `dibujarPantallaDelIntento()`.
- [ ] Corregir el comentario de `probar-memoria.mjs` que dice haber anotado en `registro_log.md` el abandono de un
  intento a medias: esa anotación no existe, y la decisión 8 la vuelve innecesaria.

### Tanda 2 · Sin decisiones tomadas, no empezar sin que el autor la pida

- [ ] Navegación por teclado fina: elegir y cambiar alternativa, avanzar y omitir sin ratón.
- [ ] Agregar a `probar:escapado` el bloque del simulacro (decisión 7): la pregunta hostil se cuela interceptando la
  petición `?ids=` y se revisan su enunciado y sus alternativas en el dibujo real.
- [ ] Comprobación automática del vocabulario de ADR-022 en los textos del simulacro.

## Criterios de aceptación

> **Reescritos el 2026-09-20.** Cada criterio de guion se cierra con evidencia **provocada**, con el reloj controlable
> de la 42, y además con su rojo: se rompe a propósito la línea que el criterio vigila, se ve fallar por el motivo
> correcto, y se restaura. Un criterio sin su rojo no está cerrado.
>
> **Dónde viven las pruebas del recorrido (decidido por el autor el 2026-09-20):** en `scripts/probar-cronometros.mjs`,
> ampliándolo. Ya tiene el reloj controlable, el intento sembrado, una copia aislada del sitio por visita y la recarga
> simulada, no necesita servidor y corre dentro de `npm run verificar`.

### Tanda 1 · Se provocan con guion

- [ ] **Solo hay una pregunta en el HTML dibujado en cada momento.**
- [ ] **Al terminar la carga, lo dibujado es la primera pregunta del intento**, sin recuadro intermedio.
- [ ] **«Siguiente» sale deshabilitado sin alternativa marcada y habilitado con ella; «Omitir», al revés.**
- [ ] **Cambiar la alternativa antes de avanzar** deja registrada solo la última marcada.
- [ ] **Avanzar con alternativa marcada** la registra y dibuja la siguiente pregunta.
- [ ] **Un solo toque de «Omitir» no omite**; el segundo sí, y la pregunta queda omitida.
- [ ] **Marcar una alternativa tras el primer toque de «Omitir»** retira la confirmación, y **cambiar de pregunta**
  también.
- [ ] **Sin vuelta atrás, como invariante:** la posición solo sube, y de a uno, y ninguna entrada de las respuestas
  cambia después de escrita. Se sostiene contra cinco embestidas: reenviar un clic de una pregunta anterior, martillear
  los botones deshabilitados, recargar a mitad, saltar 90 segundos con el reloj, y barrer el HTML realmente dibujado en
  busca de cualquier control que lleve a una pregunta anterior.
- [ ] **Durante el intento, ningún HTML dibujado contiene `es_correcta`, marca de acierto o error, ni la justificación.**
- [ ] **El número de la tarjeta y el de la franja coinciden en todo el recorrido**, leídos los dos del HTML dibujado, y
  la comprobación da rojo si se los hace discrepar.
- [ ] **Al cambiar de pregunta, el foco queda en la tarjeta nueva.**
- [ ] **Las alternativas se dibujan como `radiogroup` con `aria-checked`**, y ninguna conserva `aria-pressed`.
- [ ] **Durante el recorrido no hay ningún control con el id de «Comenzar»** (decisión 8).
- [ ] **Al resolverse la pregunta 120 se dibuja «Intento terminado»**, con «Empezar otro intento».
- [ ] **Un intento completo de 120 preguntas se recorre con el reloj controlable**, mezclando respuestas, cambios de
  alternativa, omisiones, agotamientos con y sin alternativa marcada y una recarga a mitad, y el registro final coincide
  con lo provocado.
- [ ] **Salir y volver a entrar retoma en la pregunta donde iba**, con las mismas 120 en el mismo orden.
- [ ] **`probar:identidad` sigue en verde** con el marcado de radio y los estados deshabilitados.
- [ ] **`probar:cronometros`, `probar:filtrado`, `probar:memoria`, `probar:identidad`, `probar:escapado`, `build` y
  `verificar` terminan bien**, y `instantanea-banco.js` y `d1/respaldo-banco.sql` siguen sin cambios.

### Tanda 1 · Los comprueba el autor en un navegador

- [ ] **Con los dos avisos encendidos, la columna del intento no se dibuja encima de ellos**, en 375 px y en escritorio.
- [ ] **Con un lector de pantalla, el cambio de pregunta lee el enunciado nuevo** sin que la franja lo interrumpa.
- [ ] **Sin errores de consola** durante un recorrido de varias preguntas.

### No-regresión, ya cerrados en otras iteraciones

- **El indicador de la franja** lo cierra `probar-cronometros.mjs` desde la iteración 42. Aquí solo se exige que no se
  rompa.
- **El párrafo de entrada y el origen del dato de los 120 minutos** los cerró la iteración 45. Aquí solo se exige que no
  se rompan.

### Tanda 2

- [ ] Los criterios de teclado, del bloque de `probar:escapado` y del vocabulario de ADR-022 se escriben cuando el autor
  tome sus decisiones.

### Los provoca Claude Code

- [ ] **Solo hay una pregunta en el HTML dibujado en cada momento.**
- [ ] **`probar:escapado` cubre el texto del banco dibujado en el simulacro**: enunciado, alternativas e ícono del módulo
  de la pregunta hostil, colada por intercepción, llegan como texto.
- [ ] **Cambiar la alternativa antes de avanzar** deja registrada solo la última marcada.
- [ ] **Avanzar con alternativa marcada** la registra y dibuja la siguiente pregunta.
- [ ] **Un solo toque de «Omitir» no omite**; el segundo sí, y la pregunta queda omitida.
- [ ] **Marcar una alternativa tras el primer toque de «Omitir»** retira la confirmación.
- [ ] **Una omitida no tiene ningún camino de vuelta** en el código: ningún control dibujado ni atajo de teclado lleva a una
  pregunta anterior.
- [ ] **Durante el intento, el HTML dibujado no contiene ninguna marca de acierto o error** ni la justificación.
- [ ] **El indicador de posición coincide con la pregunta dibujada** en todo el recorrido.
- [ ] **Un intento completo de 120 preguntas se recorre con el reloj controlable**, mezclando respuestas, cambios de
  alternativa, omisiones, agotamientos con y sin alternativa marcada y una recarga a mitad, y el registro final coincide con
  lo provocado.
- [ ] **El párrafo de entrada no afirma nada del examen real sin fuente**, y el dato de los 120 minutos lleva su origen.
- [ ] **El texto de las reglas en la presentación coincide con el README de la épica** y no contiene «examen real»
  presentado como equivalente, ni palabras prohibidas por ADR-022.
- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **Se entiende la diferencia entre avanzar y omitir**, y no se omite por error en el teléfono.
- [ ] **El botón «atrás» del navegador no lleva a una pregunta anterior** ni rompe el intento.
- [ ] **Un tramo del intento se realiza solo con teclado**, incluidos cambiar, avanzar y omitir.
- [ ] **Al cambiar de pregunta, un lector de pantalla anuncia la nueva.**
- [ ] **Un intento real completo, de principio a fin**, sin errores de consola.
- [ ] **Las reglas de la presentación se entienden sin tecnicismos.**
- [ ] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado.

## Notas de la iteración

_Pendiente._