# Iteración 42 · Cronómetros

**Épica:** 40 · Simulacro de examen
**Estado:** 🟢 **Cerrada el 2026-09-18**
**Depende de:** iteraciones 41 y 45.

> **2026-09-16:** recibe de la iteración 41 «una sola pestaña escribe el intento».

## Objetivo

Conectar los dos cronómetros al marcado de la 45: 30 segundos por pregunta con avance automático, y el tiempo transcurrido
del intento, calculados desde instantes guardados y no contando pulsos, y dejar un reloj controlable para probar un
intento completo sin esperarlo.

## Limitación conocida, transitoria hasta que cierre la 43

> **Escrita el 2026-09-18, por decisión del autor. No es un defecto: es el estado esperado de la página mientras la
> iteración 43 no exista.**
>
> **El cronómetro arranca aunque todavía no haya dónde marcar una alternativa.** El recorrido —la tarjeta de la
> pregunta, sus alternativas, «Siguiente» y «Omitir»— lo construye la iteración 43. La 42 dejó el motor con el enganche
> puesto: recibe `alternativaMarcada()` y la llama al vencer cada plazo, pero hoy se le pasa una función que devuelve
> siempre `null`, porque no hay tarjeta que leer.
>
> **Consecuencia, y es la correcta según la decisión 2:** no marcar nada significa omitir, así que un intento abierto y
> abandonado **se consume solo**, a una pregunta cada 30 segundos, hasta quedar con las 120 omitidas. Quien abra
> `simulacro.html` hoy, pulse «Comenzar el simulacro» y se vaya a almorzar, vuelve a un intento terminado y en cero.
>
> **Eso es lo que la regla manda, no un error que haya que arreglar aquí.** El simulacro mide bajo presión de tiempo, y
> el reloj no se detiene porque el estudiante deje de mirar (decisión 3). Lo que falta no es una regla distinta: es la
> pantalla donde responder, y esa es la 43.
>
> **Cuando la 43 enchufe el recorrido, esta limitación desaparece sola** y sin tocar
> `static/js/components/cronometros.js`: lo único que cambia es qué devuelve `alternativaMarcada()`, que se conecta con
> `conectarLaAlternativaMarcada()` desde `static/js/components/simulacro.js`.

## Historial de este archivo

- **2026-09-16 · reescrita dos veces.** El autor resolvió el tiempo sobrante, el segundo plano y qué cuenta al agotarse el
  tiempo. La lectura de alcance mostró que los guiones no pueden controlar el reloj hoy.
- **2026-09-18 · lectura de alcance y cinco decisiones.** La lectura comprobó las afirmaciones del archivo contra el
  código, encontró que la Parte 8 de ADR-035 ya explicaba lo que la decisión 4 daba por escribir, y enumeró doce huecos.
  El autor cerró la decisión 6 con cinco decisiones: urgencia a los **10 segundos**, arriendo de **5 s / 15 s**, el reloj
  como **asiento de módulo**, `transicion-de-carga.js` **fuera** del asiento, y la prueba nueva **dentro de
  `npm run verificar`**.
- **2026-09-18 · cerrada.** Los dos cronómetros cuentan desde instantes guardados, una sola pestaña escribe el intento, y
  entró la infraestructura de reloj controlable que heredan la 43 y la 44. **Cuatro defectos los encontraron las pruebas
  y no el razonamiento**, uno de ellos capaz de costarle un intento entero a un estudiante sin que se notara. El autor
  hizo su pasada de navegador el mismo día: **los siete criterios salieron bien, sin hallazgos**. Queda escrita una
  **limitación conocida y transitoria** —el intento avanza solo porque el recorrido es de la 43—, que se conserva a
  propósito hasta que la 43 cierre.

## Lo que hereda

- **Reglas del simulacro** (README de la épica).
- **Iteración 41:** el intento guardado al ocurrir, con su instante de inicio; la retoma tras una recarga.
- **Iteración 45:** la forma del cronómetro, el color de la urgencia y la guía visual.
- **Iteración 35:** `prepararDomFalso({ movimientoReducido: true })`; toda animación empieza y termina en reposo.
- **Lo que no existe:** `dom-falso.mjs` no controla `Date.now()`, no tiene `setInterval`, `requestAnimationFrame`,
  `performance.now()`, `document.hidden` ni `visibilitychange`. Y `Date.now()` real sostiene las mediciones de la 35 en
  `probar-filtrado.mjs`: reemplazarlo en todo el proceso las rompería.

## Decisiones tomadas

Todas del autor, 2026-09-16.

### 1 · El tiempo sobrante se pierde

Cada pregunta tiene 30 segundos. Avanzar antes solo acorta el intento. **El tiempo total nunca se agota antes que las
preguntas**, así que no es un límite: se muestra como **tiempo transcurrido**, y no existe «terminar por tiempo total».

### 2 · Al agotarse los 30 segundos

- **Con una alternativa marcada**, cuenta como respondida con esa alternativa.
- **Sin alternativa marcada**, queda omitida.
- En los dos casos se avanza sola a la siguiente, sin vuelta atrás.

### 3 · El reloj sigue corriendo fuera de la página

Si el estudiante sale de la página o bloquea el teléfono, **el tiempo sigue**. Al volver, el tiempo mostrado es el real, y
cada pregunta cuyo plazo se cumplió mientras tanto se resuelve con la regla 2 (cuenta la marcada o queda omitida). Lo mismo
al retomar tras una recarga.

### 4 · Una sola pestaña escribe el intento

Movida desde la iteración 41 el 2026-09-16. La pestaña que abre último **toma el intento**, y la otra **se bloquea con un
aviso**. Si la pestaña dueña se cierra, la otra **no puede quedar bloqueada para siempre**: el dueño se renueva con el tiempo
y vence. El mecanismo debe funcionar en navegadores móviles antiguos (el evento `storage` es universal; `BroadcastChannel` y
`navigator.locks` requieren Safari 15.4 o posterior).

> **Corregido el 2026-09-18.** Esta decisión se escribió el 2026-09-16 diciendo en futuro que «la ADR nueva explica por
> qué aquí se coordinan pestañas, cuando ADR-034 aceptó que el avance del cuestionario se pise». **Ya está escrita, y no
> es una ADR nueva**: es la **Parte 8 de ADR-035**, que la iteración 41 dejó fechada el 2026-09-18 en
> `_planmaestro/00_producto/decisiones.md:2703`, con el contraste contra ADR-034 en `:2711-2723` y el motivo de la clave
> aparte en `:2725-2730`. Lo que esa parte declaraba pendiente en `:2732-2734` —«el mecanismo —vencimiento, renovación,
> qué pasa al recuperar el intento— ni cómo se prueba»— es lo que esta iteración escribió, como **actualización fechada
> al final de la misma ADR-035** y no como ADR aparte.

### 5 · El tiempo se calcula desde instantes guardados

La cifra mostrada sale siempre de «ahora menos el instante guardado», nunca de contar pulsos de un temporizador, que se
atrasa en pestañas ocultas.

## Decisiones sin resolver

### 6 · Cómo se construye el reloj controlable (se propone tras la lectura de alcance)

Hace falta que el código del simulacro obtenga la hora de una fuente **inyectable**, y que el DOM falso ofrezca avance
manual del tiempo, temporizadores sobre ese reloj, `visibilitychange` disparable, `window.addEventListener`, y dos
almacenes que se vean entre sí con evento `storage` para simular dos pestañas, **sin tocar el `Date.now()` real** que usan
otros guiones. Es infraestructura que usan también la 43 y la 44. **Pendiente**, con la propuesta de la lectura.

> **Resuelta el 2026-09-18**, con las cinco decisiones del autor y la propuesta de la lectura de alcance. Quedó así:
>
> - `static/js/servicios/reloj.js`: **asiento de módulo** —el patrón de `almacenDelNavegador()`, no un parámetro
>   inyectado en cada firma—, con `crearRelojDelNavegador()` por omisión y `usarReloj()` para los guiones.
> - `relojDeMentira()` en `scripts/dom-falso.mjs`, con **dos verbos**: `avanzar(ms)` vence los temporizadores a su hora
>   y `saltar(ms)` mueve el reloj sin vencer ninguno. `document` ganó `hidden` y `addEventListener`; `window` ganó
>   `addEventListener` y `dispararEnLaVentana()`.
> - `dosPestanas()` para dos almacenes sobre un solo disco, con el evento `storage` entregado **solo a la otra**.
> - **`transicion-de-carga.js` NO migra** (decisión 4 del autor): su piso de 400 ms se mide contra el reloj del mundo, y
>   es lo que `8f-2` y `10f` cronometran con `Date.now()` real.
> - La regla dura, comprobable con `grep` y comprobada por el propio guion: `dom-falso.mjs` **no asigna** `globalThis.Date`,
>   `Date.now` ni `performance`, y **no reemplaza** `window.setTimeout`/`clearTimeout`, que siguen siendo los de Node.
>
> **Una corrección sobre la propuesta original, y conviene decirla.** La lectura de alcance proponía aislar cada pestaña
> importando los módulos con `?pestana=a` y `?pestana=b`. **No funciona, y se comprobó construyéndolo:** el
> especificador solo aísla el módulo que se importa, no los que ese módulo importa por dentro, así que
> `components/simulacro.js?pestana=a` caía igual en la instancia compartida de `servicios/reloj.js`. El resultado era el
> peor posible: `usarReloj()` dejaba el reloj de mentira sentado en un módulo que no usaba nadie, y el sitio seguía
> leyendo `Date.now()` sin que nada se quejara. Se resolvió dando a **cada visita su propia copia de `static/js/`** —486
> KB, el precedente es `probar-memoria.mjs:1714`—, con lo que el aislamiento es total y una recarga simulada no hereda
> ni una variable de módulo de la anterior.

## Tareas

- [x] Construir el reloj controlable y las dos pestañas simuladas (decisión 6), y documentarlos para la 43 y la 44.
- [x] Una sola pestaña escribe el intento (decisión 4).
- [x] Cronómetro de 30 segundos por pregunta, con la forma de la 45.
- [x] Avance automático al agotarse, con la regla de la decisión 2.
- [x] Tiempo transcurrido del intento, visible todo el intento.
- [x] Resolución de preguntas agotadas en segundo plano y al retomar (decisión 3).
- [x] Señal de urgencia según la 45, que no dependa solo del color. **A los 10 segundos restantes** (decisión del autor, 2026-09-18).
- [x] Respetar `prefers-reduced-motion`.
- [x] Documentar las decisiones 1 a 5 en una ADR. **Como actualización fechada de ADR-035**, no como ADR nueva: la decisión 4 ya estaba en su Parte 8, y esa parte remitía el resto a esta iteración.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, con el reloj controlable.

> **El criterio del formato `H:MM:SS` se agregó el 2026-09-18**, y no estaba en la lista original. Lo detectó la
> lectura de alcance (hueco H-12): la decisión 4 de la iteración 45 fija `MM:SS` hasta la hora y `H:MM:SS` desde la
> hora, precisamente porque el reloj sigue corriendo fuera de la página y el caso de varias horas existe; pero ningún
> criterio de esta iteración lo comprobaba, ni por guion ni en el navegador.

### Los provoca Claude Code

Todos con `npm run probar:cronometros`, salvo donde se diga otra cosa. Cada cifra se lee **del HTML que el componente
escribió**, no de una variable del motor: una prueba que mirara su propio estado interno pasaría en verde con la franja
en blanco.

- [x] **El cronómetro de la pregunta muestra el tiempo correcto** en varios puntos simulados de una misma pregunta. —
  *Bloque 1.* `0 ms → 30 s · 1 000 → 29 · 15 000 → 15 · 25 000 → 5 · 29 500 → 1`.
- [x] **Al agotarse con una alternativa marcada**, queda registrada esa alternativa y se pasa a la siguiente. — *Bloque
  3.* Con la 5002 marcada quedó `{ estado: 'respondida', alternativa_id: 5002, agotada: true }` y la franja pasó a la
  siguiente.
- [x] **Al agotarse sin alternativa marcada**, queda omitida y se pasa a la siguiente. — *Bloque 3.* Quedó
  `{ estado: 'omitida', alternativa_id: null, agotada: true }`, posición 2, franja en `3/120`.
- [x] **Avanzar antes de tiempo no traspasa el sobrante**: la siguiente pregunta empieza con 30 segundos. — *Bloque 4.*
  Respondida la primera a los 5 s, la segunda empieza en 30 y vence a los 35 s del intento, o sea a **sus** 30.
  **Encontró un defecto y se arregló:** la franja se quedaba hasta un segundo mostrando lo que le restaba a la pregunta
  anterior —empezaba en 25—, porque nadie repintaba al responder. `anotarEnElIntento()` ahora pide un latido.
- [x] **El tiempo transcurrido coincide con el reloj simulado** en todo el intento, y ningún camino termina el intento por
  tiempo total. — *Bloque 5.* `0 → 00:00 · 12 000 → 00:12 · 372 000 → 06:12`. Dos horas de intento sin responder
  terminan con las **120** resueltas por agotamiento de su propia pregunta, y el intento se cierra en el vencimiento de
  la 120 —60 minutos exactos— y no antes: cualquier instante anterior sería un final por tiempo total.
- [x] **Con un temporizador que se atrasa simulado**, las cifras mostradas siguen siendo las correctas. — *Bloque 6.*
  `saltar(7000)` mueve el reloj sin vencer ni un temporizador; la franja queda pintada con 30 —lo último que alcanzó a
  escribir— y el primer latido la corrige a **23 s y 00:07**. Un cronómetro que contara pulsos habría seguido en 30.
- [x] **Tras simular 2 minutos en segundo plano a mitad de una pregunta**, al volver el tiempo es el real y las preguntas
  cuyo plazo se cumplió quedaron resueltas con la regla 2, en orden. — *Bloque 7.* `ocultar()` + `saltar(120000)` +
  `mostrar()` a los 15 s de la pregunta 1: **4 agotadas**, con instantes `30 000 · 60 000 · 90 000 · 120 000` —cada una
  con **su** vencimiento y no todas con el del regreso—, y la franja en 15 s de la pregunta 5 con `02:15`.
- [x] **Tras simular una recarga después de 2 minutos**, el mismo resultado. — *Bloque 8.* DOM rehecho, módulos
  reimportados desde otra copia del árbol y el reloj arrancando donde quedó el anterior más dos minutos: mismas 4
  agotadas, mismos instantes, misma franja.
- [x] **Con dos pestañas simuladas**, la última toma el intento y la otra queda bloqueada con aviso; ninguna escritura de
  la bloqueada llega al almacén. — *Bloque 9.* La B abre y se lleva el intento; la A queda con «Tu simulacro sigue en la
  otra pestaña» y sin franja. Diez minutos con **los dos relojes avanzando a la par**: la dueña llegó a la pregunta 20
  con 140 escrituras y la bloqueada hizo **0**. Se mide **quién escribió** y no qué quedó escrito, porque el almacén es
  uno solo —el mismo origen—: comparar el contenido no distingue al autor de la escritura.
- [x] **Con la pestaña dueña cerrada**, simulado, la otra puede retomar el intento pasado el vencimiento. — *Bloque 10.*
  Cerrar la dueña se simula dejando de avanzar su reloj. A los 10 s la otra **sigue bloqueada** —el arriendo vence a los
  15— y a los 20 s lo retoma con su franja de vuelta. El número sale de `VENCE_A_LOS_MS`, no copiado a mano.
- [x] **El reloj controlable no altera las mediciones de la 35**: `probar:filtrado` en verde con sus tiempos. — Código
  0, y los tiempos dentro de la misma holgura de 700 ms que antes de tocar nada: `8f-2` instantánea **405** (antes 407),
  lenta **2 033** (antes 2 028), fallida **414** (antes 412); `10f` **407** (antes 406). Además, *bloque 12* lo
  comprueba **sobre el código** y no solo sobre la conducta: `dom-falso.mjs` no asigna `globalThis.Date`, `Date.now` ni
  `performance`, `window.setTimeout` sigue llamando al de Node, y adelantar una hora el reloj de mentira movió el
  `Date.now()` real **0 ms**.
- [x] **La urgencia se comunica sin color**: hay texto o forma que la expresa. — *Bloque 2.* **Lo que esta iteración
  aporta no es la forma —la cerró la 45 y la vigila `probar-identidad-visual.mjs`— sino el instante.** Con 11 s en
  pantalla la franja sigue en reposo y sin aviso; **a los 10 s exactos** cambia de superficie a `bg-jsyellow` *y*
  aparece «quedan 10 segundos» en el sitio del avance, que nunca están puestos los dos a la vez. Dos señales además del
  color, encendidas ni antes ni después del umbral del autor.
- [x] **Con el movimiento reducido simulado, el cronómetro no declara movimiento** y sigue mostrando el tiempo. —
  *Bloque 11.* Con `prefers-reduced-motion` simulado la franja no declara `animate-`, `animate__`, `motion-safe:` ni
  `transition-transform`, y sigue mostrando 9 s en urgencia.
- [x] **El tiempo transcurrido cambia de `MM:SS` a `H:MM:SS` al cruzar la hora**, provocado con el reloj controlable. —
  *Bloque 5.* `3 599 000 ms → 59:59`, `3 600 000 → 1:00:00`, `3 849 000 → 1:04:09`, `86 400 000 → 24:00:00`. Criterio
  nuevo de esta iteración.
- [x] **Contraste de todo texto y borde nuevo** según la guía de la 45, con tabla. — **La tabla va vacía, y es el
  resultado correcto.** Esta iteración no introdujo ni un texto ni un borde nuevo: la franja la dibuja
  `dibujarFranjaDelIntento()` de la 45, sin tocar una clase, y el aviso de la pestaña bloqueada reutiliza el recuadro de
  la 41 con `text-muted` sobre `panel`, ya medido. `probar-identidad-visual.mjs` sigue en OK dentro de `verificar`, con
  sus mismas mediciones. No se inventó contraste que medir donde no lo hay.
- [x] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios. — Las seis salidas están más
  abajo, en «Verificación de cierre». `git diff --stat` no nombra `static/js/data/instantanea-banco.js` ni
  `d1/respaldo-banco.sql`.

### Los comprueba el autor en el navegador

> **Antes de empezar: la pasada hay que hacerla sin pausas largas, y conviene saber por qué.**
>
> - **Qué hacer:** ten decidido el recorrido antes de pulsar «Comenzar el simulacro», y hazlo de corrido. Las dos
>   comprobaciones que sí piden esperar —bloquear el teléfono y cambiar de pestaña— son de **un par de minutos**, que es
>   lo que piden sus criterios; para cualquier pausa más larga, deja el intento, vuelve y pulsa «Empezar otro intento».
> - **Qué deberías ver:** el intento avanza solo, a una pregunta cada 30 segundos, estés mirando o no. Tras una pausa de
>   dos minutos vuelves cuatro preguntas más adelante, y eso **es el comportamiento correcto** (decisión 3): es
>   exactamente lo que el criterio de bloquear el teléfono va a comprobar.
> - **Qué cuenta como falla:** que al volver el tiempo **no** sea el real, que las preguntas vencidas **no** hayan
>   quedado resueltas, o que queden resueltas fuera de orden. Que el intento haya avanzado **no** es la falla.
> - **Lo que no hay que confundir con un defecto:** que un intento abandonado media hora quede con las 120 omitidas. Es
>   la limitación conocida de más arriba —sin la 43 no hay dónde marcar, y no marcar es omitir—, y por eso una pausa
>   larga a mitad de la pasada gasta el intento y obliga a empezar otro.

Todos comprobados por **Felipe Cuevas el 2026-09-18**. La pasada salió **exitosa en los siete puntos, sin hallazgos**:
no hubo correcciones que pedir ni puntos que repetir.

- [x] **Los dos cronómetros se entienden a la primera**, en teléfono. — *Felipe Cuevas, 2026-09-18.*
- [x] **Bloquear el teléfono un par de minutos a mitad de una pregunta** deja el tiempo real al volver, con las preguntas
  agotadas resueltas. — *Felipe Cuevas, 2026-09-18.* Es el criterio que confirma en un navegador de verdad lo que el
  guion provoca con `saltar()`: que el estrangulamiento real de los temporizadores se comporte como el simulado.
- [x] **Cambiar de pestaña un par de minutos** da el mismo resultado. — *Felipe Cuevas, 2026-09-18.*
- [x] **Abrir el simulacro en una segunda pestaña** bloquea la primera con un aviso claro, y cerrar la dueña no deja la otra
  bloqueada para siempre. — *Felipe Cuevas, 2026-09-18.* Confirma en un navegador las dos mitades que el guion prueba por
  separado: la entrega real del evento `storage` entre pestañas, y el vencimiento del arriendo a los 15 segundos.
- [x] **Con movimiento reducido activado**, el cronómetro sigue siendo comprensible. — *Felipe Cuevas, 2026-09-18.*
- [x] **Sin errores de consola.** — *Felipe Cuevas, 2026-09-18.*
- [x] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado. — *Felipe Cuevas, 2026-09-18*, y
  confirmado por Claude Code en la pasada final: **VERIFICADO, código 0**, las nueve comprobaciones en OK.

## Lo que esta iteración no puede afirmar

- **Que el estudiante no manipule el reloj** del dispositivo: el sitio es estático.
- **Que un intento abandonado no se consuma solo.** Hoy se consume, y está escrito arriba como limitación conocida: sin
  el recorrido de la 43 no hay dónde marcar, y por la decisión 2 no marcar es omitir. Desaparece al cerrar la 43.

## Notas de la iteración

### 2026-09-18 · construida

**Cinco decisiones del autor** cerraron lo que la lectura de alcance dejó abierto: urgencia a los **10 segundos**
restantes; arriendo renovado cada **5 s** y vencido a los **15 s**; el reloj como **asiento de módulo**;
`transicion-de-carga.js` **fuera** del asiento; y la prueba nueva **dentro de `npm run verificar`**.

#### Lo que se construyó

| Archivo | Qué es |
|---|---|
| `static/js/servicios/reloj.js` | **Nuevo.** El asiento: `crearRelojDelNavegador()`, `reloj()` y `usarReloj()` |
| `static/js/servicios/dueno-del-intento.js` | **Nuevo.** El arriendo de la pestaña, bajo `…simulacro.dueno` |
| `static/js/components/cronometros.js` | **Nuevo.** El motor de los dos relojes, y el formato del transcurrido |
| `scripts/probar-cronometros.mjs` | **Nuevo.** 12 bloques, noveno comprobador de `verificar` |
| `scripts/dom-falso.mjs` | `relojDeMentira()`, `dosPestanas()`, `document.hidden`, los dos `addEventListener` |
| `static/js/components/simulacro.js` | Enciende y apaga el intento; `empezado_en` al retomar; guardas |
| `static/js/servicios/intento-guardado.js` | Las cuatro lecturas de hora pasan por el asiento |
| `simulacro.html` | `#franja-del-simulacro`, vacía y fuera de `#zona-del-intento` |
| `scripts/probar-memoria.mjs` | Sus visitas del simulacro corren con el reloj **parado** |

**La franja va fuera de `#zona-del-intento`**, por el mismo motivo que los dos avisos de la 41: la transición de carga
reescribe esa zona entera, y una franja que viviera dentro se borraría sola al armar el intento. Y **sin `aria-live`**:
un cronómetro que se anuncia cada segundo deja al lector de pantalla hablando encima del enunciado durante una hora.

#### La limitación transitoria, y por qué se deja así

El recorrido es de la 43, así que todavía no hay tarjeta donde marcar una alternativa: el motor recibe
`alternativaMarcada()` y la 42 se la pasa devolviendo siempre `null`. Por la decisión 2, no marcar es omitir, así que
**un intento abandonado se consume solo** hasta quedar con las 120 omitidas.

**El autor decidió el 2026-09-18 dejarlo así**, y el motivo es que no hay nada que arreglar: el reloj no se detiene
porque el estudiante deje de mirar (decisión 3), y lo que falta no es una regla distinta sino la pantalla donde
responder. Queda escrito arriba como **limitación conocida con fecha**, en su propia sección y en «Lo que esta
iteración no puede afirmar», para que entre hoy y el cierre de la 43 nadie lo lea como un defecto. Desaparece sola al
enchufar el recorrido, cambiando qué devuelve `alternativaMarcada()` vía `conectarLaAlternativaMarcada()`, sin tocar
`components/cronometros.js`.

#### Cuatro defectos que las pruebas encontraron, y no el razonamiento

1. **La franja se quedaba hasta un segundo con la cifra de la pregunta anterior.** Al responder, nadie repintaba:
   responder a los 5 s dejaba la siguiente empezando en **25** y no en 30. `anotarEnElIntento()` pide ahora un latido,
   que además vuelve a citar el cronómetro para el plazo nuevo. Con una guarda de reentrada en el motor, porque si no
   ponerse al día tras dos minutos ocultos eran 120 niveles de recursión.
2. **`anotarEnElIntento()` admitía una respuesta 121.** Con el avance automático, `respuestas` podía quedar más larga
   que `preguntas`, y eso es justo lo que `leerIntentoGuardado()` descarta al recargar: la respuesta de más no se
   perdía sola, **se llevaba el intento entero**. Se vio como «posición 122» en `probar-memoria`.
3. **El arriendo se escribía aunque no hubiera intento que proteger.** Lo cazó `probar-memoria` en los dos casos que ya
   vigilaba —el almacén sin sitio para los 76,8 KiB, y «Empezar otro intento» cuando el siguiente no se puede armar—:
   quedaba un `…dueno` suelto, contra la regla de que bajo `examen-td-js.simulacro.` **nunca queda media cosa**. Ahora
   `tomar()` recibe si hay intento guardado, y sin él se declara dueña **en memoria y sin escribir nada**; y
   «Empezar otro intento» suelta la clave junto a `olvidarElIntento()`.
4. **`probar-memoria.mjs` corría contra el reloj de verdad.** Desde que el simulacro avanza solo, sus visitas —46
   procesos, unos cuarenta segundos— competían contra el cronómetro: un intento creado en una visita y retomado diez
   después ya tenía preguntas vencidas. Sus visitas del simulacro corren ahora con un reloj de mentira **parado**, que
   es lo que devuelve esas pruebas a su asunto, la memoria. Que el plazo sí venza cuando debe lo prueba
   `probar-cronometros.mjs`, que para eso lo adelanta a propósito.

#### Una corrección a la propuesta de la lectura de alcance

La sección 4 proponía aislar cada pestaña importando con `?pestana=a` y `?pestana=b`. **No funciona.** El
especificador solo aísla el módulo que se importa, no los que ese módulo importa por dentro: `simulacro.js?pestana=a`
caía igual en la instancia compartida de `servicios/reloj.js`, así que `usarReloj()` dejaba el reloj de mentira sentado
en un módulo que no usaba nadie y el sitio seguía leyendo `Date.now()` sin que nada se quejara. Se resolvió dando a
cada visita **su propia copia de `static/js/`** —486 KB, precedente en `probar-memoria.mjs:1714`—, con lo que el
aislamiento es total y una recarga simulada no hereda ni una variable de módulo.

### Verificación de cierre · 2026-09-18

Las seis salidas, con `npm run datos:dev` levantado:

| Comando | Código | Qué dijo |
|---|---|---|
| `npm run build` | **0** | 44 iconos · 4 entradas a `dist/` · 32 recursos enlazados, ninguno roto · capa de datos fuera de `dist/` |
| `npm run probar:cronometros` | **0** | los 12 bloques |
| `npm run probar:filtrado` | **0** | `8f-2`: instantánea **411**, lenta **2 042**, fallida **409** · `10f`: **406**. Piso 400, holgura 700 |
| `npm run probar:memoria` | **0** | MEMORIA CORRECTA |
| `npm run probar:identidad` | **0** | **258 mediciones, 0 bajo su umbral**, 2 con excepción declarada |
| `npm run probar:escapado` | **0** | el escapado aguantó el contenido hostil |
| `npm run verificar` | **0** | **VERIFICADO**, las nueve en OK |

**Los tiempos de `8f-2` y `10f`, antes y después de tocar nada**, que es lo que el criterio del reloj controlable pide:

| | Antes | Después |
|---|---|---|
| `8f-2` respuesta instantánea | 407 ms | 411 ms |
| `8f-2` respuesta lenta | 2 028 ms | 2 042 ms |
| `8f-2` fallida inmediata | 412 ms | 409 ms |
| `10f` transición del simulacro | 406 ms | 406 ms |

Todos dentro de la misma holgura de 700 ms de siempre, contra el mismo piso de 400.

**`git diff --stat`:** 12 archivos tocados y 4 nuevos. **No aparecen** `static/js/data/instantanea-banco.js` ni
`d1/respaldo-banco.sql`. Tampoco `static/css/style.css`: esta iteración no introdujo ni una clase de Tailwind nueva
—la franja la dibuja el marcado de la 45—, y por eso `verificar:css` sigue en OK.

**Una nota de operación, que el 2026-09-18 pasó a ser regla.** `npm run build` reescribe `dist/`, que es lo que
`wrangler pages dev` está sirviendo, y eso **tumba el servidor**. Pasó dos veces durante esta iteración, y la segunda
dejó un `probar:escapado` en código 2 que no era un fallo del escapado: el síntoma despista, porque un «no se pudo
probar» se lee como un fallo de lo que se estaba probando. El orden que funciona es **build primero, servidor
después**; si hay que reconstruir, se levanta el servidor de nuevo antes de repetir las pruebas que usan la red.

**Por decisión del autor ya no es una nota, es regla del ciclo de trabajo:** está escrita en `CLAUDE.md`, en «Flujo de
trabajo», que es donde se lee antes de empezar, y el detalle operativo quedó junto a `npm run datos:dev` en
`_planmaestro/90-manual/capa-de-datos-y-base-d1.md`.