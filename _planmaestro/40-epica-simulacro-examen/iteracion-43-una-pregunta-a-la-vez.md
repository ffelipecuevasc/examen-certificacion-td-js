# Iteración 43 · Recorrido de una pregunta a la vez

**Épica:** 40 · Simulacro de examen
**Estado:** 🔵 En curso · tanda 1 cerrada por guion, falta la pasada del autor · tanda 2 pendiente
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
- **2026-09-21 · tanda 1 cerrada por guion.** Seis bloques nuevos en `probar-cronometros.mjs` (13 a 18), cada criterio
  con su rojo por mutación. `probar:filtrado` se puso al día con la decisión 8 (decisión 10), y el bloque del simulacro
  de `probar:escapado` se adelantó desde la tanda 2 (decisión 9). Queda la pasada del autor en el navegador.

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

**Pendientes del texto provisional que dejó la etapa A de la 41** (anotados el 2026-09-16):

- **El párrafo de entrada dice que el simulacro practica «lo más difícil del día del examen».** Es una afirmación sobre el
  examen real sin fuente: se reescribe sin ella.
- **El aviso «Estas reglas son del simulacro, no del examen real» afirma que el examen dura 120 minutos y mezcla
  alternativas con programación.** El enlace a la fuente oficial de Talento Digital sigue pendiente. Antes de cerrar la 43,
  o se cita la fuente junto al dato, como en el aviso de la iteración 36, o el dato se presenta con su origen declarado.

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
ya cerrada por poco beneficio real de seguridad. El bloque se adelantó a la tanda 1 el 2026-09-21 (decisión 9).

### 8 · Tres decisiones de la tanda 2, cerradas por adopción

Del autor, 2026-09-20, adoptando lo que Claude Code implementó en su borrador:

- **Al terminar de cargar se muestra directamente la primera pregunta.** La pantalla «Intento listo» se retira: con el
  reloj corriendo desde el clic, una pantalla intermedia le quitaría segundos a la pregunta 1.
- **Durante el recorrido no existe «Empezar otro intento».** Solo aparece en la pantalla del final (decisión 5).
- **En consecuencia, un intento en curso no se puede abandonar desde la página.** Termina respondiendo, omitiendo o
  dejando que el reloj lo consuma.

Con esto, la tanda 2 queda en la accesibilidad fina de teclado y la comprobación automática del vocabulario de ADR-022.
El bloque de `probar:escapado` pasó a la tanda 1 (decisión 9).

### 9 · El escapado del simulacro se prueba en la tanda 1

Del autor, 2026-09-21. El bloque de `probar:escapado` para el simulacro se adelanta desde la tanda 2. Se había
postergado porque el simulacro no dibujaba ningún texto del banco (decisión 11 de la 41), y la tanda 1 hizo que dibuje
la pregunta en curso: el hueco lo abrió esta tanda, y en ella se cierra. La fila hostil se cuela interceptando la
respuesta de `?ids=`, y se revisan su enunciado y sus alternativas (decisión 7).

### 10 · La decisión 11 de la 41 queda reemplazada

Consecuencia de la decisión 8, registrada el 2026-09-21. «Intento listo no dibuja texto del banco» deja de ser una regla,
porque al terminar la carga se dibuja la primera pregunta. En `probar-filtrado.mjs`, el bloque 10g pasa a exigir que lo
dibujado sea **esa pregunta y solo esa**, y la cuenta por módulo se lee del intento armado, porque ya no la muestra
ninguna pantalla.

## Tareas

> **Reescritas el 2026-09-20 y marcadas el 2026-09-21.** Una tarea se marca hecha solo cuando su prueba existe y se vio
> en rojo por mutación. Entre paréntesis, el bloque de `probar-cronometros.mjs` que la prueba, salvo que se nombre otro
> guion.

### Tanda 1 · El recorrido funcionando

- [x] Mostrar una pregunta a la vez, con su número y el total, reutilizando `dibujarTarjetaDeLaPregunta()` y
  `dibujarBotonesDelIntento()` y **no** `dibujarPantallaDelIntento()`, que dibujaría una segunda franja. (13)
- [x] Marcar y cambiar la alternativa sin registrarla hasta avanzar o agotarse. (14)
- [x] Dos botones según la decisión 1, con la confirmación de «Omitir» y su retiro. (14 y 16)
- [x] Registrar cada resultado (respondida con su alternativa u omitida) en el intento guardado, sin revelar si fue
  correcta. (15, 17 y 18)
- [x] Redibujar la pregunta cuando el cronómetro resuelve una por agotamiento. (16 y 18)
- [x] Pasar `alTerminarElIntento` a los cronómetros y dibujar la pantalla transitoria de la decisión 5. La pantalla está
  probada (18); que el enganche esté conectado no se puede probar (ver las notas).
- [x] Ir directo a la primera pregunta al terminar la carga, y retomar en la pregunta donde iba (decisión 8). (13 y 18;
  `probar-filtrado.mjs` 10g)
- [x] Anunciar el cambio de pregunta moviendo el foco (decisión 4). (15)
- [x] Alternativas como grupo de radio (decisión 3), con `probar:identidad` en verde después. (17)
- [ ] Revisar el margen negativo de la columna del intento con los dos avisos encendidos. Lo cierra la pasada del autor.
- [x] Corregir la frase del `README.md` del plan maestro que manda llamar a `dibujarPantallaDelIntento()`.
- [x] Corregir el comentario de `probar-memoria.mjs` que decía haber anotado en `registro_log.md` el abandono de un
  intento a medias.
- [x] Poner `probar-filtrado.mjs` al día con la decisión 8 (decisión 10).
- [x] Agregar a `probar:escapado` el bloque del simulacro (decisión 9): la fila hostil se cuela interceptando `?ids=` y
  se revisan su enunciado y sus alternativas en el dibujo real. (`probar-escapado.mjs` 5c)

### Tanda 2 · Sin decisiones tomadas, no empezar sin que el autor la pida

- [ ] Navegación por teclado fina: elegir y cambiar alternativa, avanzar y omitir sin ratón.
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

Entre paréntesis, el bloque de `probar-cronometros.mjs` que lo prueba, salvo que se nombre otro guion. Todos se vieron
en rojo por mutación.

- [x] **Solo hay una pregunta en el HTML dibujado en cada momento.** (13)
- [x] **Al terminar la carga, lo dibujado es la primera pregunta del intento**, sin recuadro intermedio. (13;
  `probar-filtrado.mjs` 10g)
- [x] **«Siguiente» sale deshabilitado sin alternativa marcada y habilitado con ella; «Omitir», al revés.** (14)
- [x] **Cambiar la alternativa antes de avanzar** deja registrada solo la última marcada. (14)
- [x] **Avanzar con alternativa marcada** la registra y dibuja la siguiente pregunta. (15)
- [x] **Un solo toque de «Omitir» no omite**; el segundo sí, y la pregunta queda omitida. (16)
- [x] **Marcar una alternativa tras el primer toque de «Omitir»** retira la confirmación, y **cambiar de pregunta**
  también, incluso cuando la cambia el reloj. (16)
- [x] **Sin vuelta atrás, como invariante:** la posición solo sube, y de a uno, y ninguna entrada de las respuestas
  cambia después de escrita. Resiste el clic viejo (14 y 18), el martilleo de los botones apagados (15), la recarga a
  mitad y el salto de 90 segundos (18), y el barrido del HTML dibujado en busca de un camino atrás (18).
- [x] **Durante el intento, ningún HTML dibujado contiene `es_correcta`, marca de acierto o error, ni la justificación.**
  (17)
- [x] **El número de la tarjeta y el de la franja coinciden en todo el recorrido**, y la comprobación da rojo si se los
  hace discrepar. (13 y 18)
- [x] **Al cambiar de pregunta, el foco queda en la tarjeta nueva.** (15)
- [x] **Las alternativas se dibujan como `radiogroup` con `aria-checked`**, y ninguna conserva `aria-pressed`. (17)
- [x] **Durante el recorrido no hay ningún control con el id de «Comenzar»** (decisión 8). (17)
- [x] **Al resolverse la pregunta 120 se dibuja «Intento terminado»**, con «Empezar otro intento». (18)
- [x] **Un intento completo de 120 preguntas se recorre con el reloj controlable**, mezclando respuestas, cambios de
  alternativa, omisiones, agotamientos con y sin alternativa marcada, una recarga a mitad y un salto de 90 segundos, y el
  registro final coincide con lo provocado. (18)
- [x] **Salir y volver a entrar retoma en la pregunta donde iba**, con las mismas 120 en el mismo orden. (18;
  `probar-memoria.mjs`, «Retoma»)
- [x] **`probar:identidad` sigue en verde** con el marcado de radio y los estados deshabilitados.
- [x] **El texto del banco que dibuja el simulacro llega escapado:** el enunciado y las alternativas de la fila hostil,
  colada por `?ids=`, llegan como texto y sin etiquetas ajenas (decisión 9). (`probar-escapado.mjs` 5c)
- [x] **`probar:cronometros`, `probar:filtrado`, `probar:memoria`, `probar:identidad`, `probar:escapado`, `build` y
  `verificar` terminan bien**, y `instantanea-banco.js` y `d1/respaldo-banco.sql` siguen sin cambios.

### Tanda 1 · Los comprueba el autor en un navegador

- [ ] **Con los dos avisos encendidos, la columna del intento no se dibuja encima de ellos**, en 375 px y en escritorio.
- [ ] **Se entiende la diferencia entre avanzar y omitir**, y no se omite por error con el pulgar.
- [ ] **Con un lector de pantalla, el cambio de pregunta lee el enunciado nuevo** sin que la franja lo interrumpa.
- [ ] **El botón «atrás» del navegador no lleva a una pregunta anterior** ni rompe el intento (decisión 6).
- [ ] **Un intento real completo, de principio a fin**, llega a «Intento terminado» sin errores de consola.

### No-regresión, ya cerrados en otras iteraciones

- **El indicador de la franja** lo cierra `probar-cronometros.mjs` desde la iteración 42. Aquí solo se exige que no se
  rompa.
- **El párrafo de entrada y el origen del dato de los 120 minutos** los cerró la iteración 45. Aquí solo se exige que no
  se rompan.

### Tanda 2

- [ ] Los criterios de teclado y del vocabulario de ADR-022 se escriben cuando el autor tome sus decisiones.

## Notas de la iteración

_Escritas el 2026-09-21, al cerrar por guion la tanda 1._

### Hallazgos de las pruebas

- **Dos pruebas miraban un detalle ajeno a lo que decían mirar.** El clic viejo del bloque 14 comparaba contra un valor
  escrito a mano y se contagiaba del rojo anterior, y el mismo bloque buscaba dos atributos pegados, así que un atributo
  nuevo entre medio lo tumbaba. Las dos se corrigieron: la primera compara con lo dibujado justo antes del clic, y la
  segunda lee la etiqueta entera.
- **Las notas de los bloques 14 a 18 afirmaban sin medir.** El rojo 1 del bloque 18 imprimió «los dos indicadores
  coincidieron» junto a 72 discrepancias. Desde entonces esas notas solo se imprimen si su bloque pasó (H-023).
- **`alTerminarElIntento` no se puede probar.** «Intento terminado» se dibuja por dos caminos: ese enganche y
  `dibujarElRecorrido()` cuando no queda pregunta. Quitar el primero no pone nada en rojo. Está conectado, pero no
  demostrado.
- **`probar-filtrado.mjs` usa un reloj quieto en su bloque 10.** Desde la 43 un plazo vencido reescribe la zona de la
  pregunta, y con el reloj real un intento de un bloque podría pintar sobre el DOM de otro. Es preventivo: el problema no
  llegó a verse.
- **Con la decisión 8 se pierde la cuenta por módulo que mostraba «Intento listo».** El estudiante ya no ve cuántas
  preguntas trae de cada módulo antes de empezar. El reparto se sigue probando sobre el intento armado, y el resumen de
  la 44 es el lugar natural para mostrarlo.

### Sobre el método

- **El borrador de Claude Code no traía ninguna prueba del recorrido.** Cada una se escribió después sobre código ya
  existente, y se vio en rojo rompiendo a mano la línea que vigila.
- **El formateo del IDE reescribió `simulacro.js` entero**, de 2 a 4 espacios y sin espacios dentro de las llaves, en un
  commit que parecía de siete líneas. Se devolvió en un commit solo de formato, y el autor dejó de usar `Ctrl + Alt + L`
  en este repositorio.
- **«Martillear el teclado» se probó martillando los botones apagados.** El teclado de verdad es de la tanda 2.