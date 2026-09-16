# Iteración 42 · Cronómetros

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteraciones 41 y 45.

> **2026-09-16:** recibe de la iteración 41 «una sola pestaña escribe el intento».

## Objetivo

Conectar los dos cronómetros al marcado de la 45: 30 segundos por pregunta con avance automático, y el tiempo transcurrido
del intento, calculados desde instantes guardados y no contando pulsos, y dejar un reloj controlable para probar un
intento completo sin esperarlo.

## Historial de este archivo

- **2026-09-16 · reescrita dos veces.** El autor resolvió el tiempo sobrante, el segundo plano y qué cuenta al agotarse el
  tiempo. La lectura de alcance mostró que los guiones no pueden controlar el reloj hoy.

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
`navigator.locks` requieren Safari 15.4 o posterior). La ADR nueva explica por qué aquí se coordinan pestañas, cuando
ADR-034 aceptó que el avance del cuestionario se pise.

### 5 · El tiempo se calcula desde instantes guardados

La cifra mostrada sale siempre de «ahora menos el instante guardado», nunca de contar pulsos de un temporizador, que se
atrasa en pestañas ocultas.

## Decisiones sin resolver

### 6 · Cómo se construye el reloj controlable (se propone tras la lectura de alcance)

Hace falta que el código del simulacro obtenga la hora de una fuente **inyectable**, y que el DOM falso ofrezca avance
manual del tiempo, temporizadores sobre ese reloj, `visibilitychange` disparable, `window.addEventListener`, y dos
almacenes que se vean entre sí con evento `storage` para simular dos pestañas, **sin tocar el `Date.now()` real** que usan
otros guiones. Es infraestructura que usan también la 43 y la 44. **Pendiente**, con la propuesta de la lectura.

## Tareas

- [ ] Construir el reloj controlable y las dos pestañas simuladas (decisión 6), y documentarlos para la 43 y la 44.
- [ ] Una sola pestaña escribe el intento (decisión 4).
- [ ] Cronómetro de 30 segundos por pregunta, con la forma de la 45.
- [ ] Avance automático al agotarse, con la regla de la decisión 2.
- [ ] Tiempo transcurrido del intento, visible todo el intento.
- [ ] Resolución de preguntas agotadas en segundo plano y al retomar (decisión 3).
- [ ] Señal de urgencia según la 45, que no dependa solo del color.
- [ ] Respetar `prefers-reduced-motion`.
- [ ] Documentar las decisiones 1 a 5 en una ADR.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, con el reloj controlable.

### Los provoca Claude Code

- [ ] **El cronómetro de la pregunta muestra el tiempo correcto** en varios puntos simulados de una misma pregunta.
- [ ] **Al agotarse con una alternativa marcada**, queda registrada esa alternativa y se pasa a la siguiente.
- [ ] **Al agotarse sin alternativa marcada**, queda omitida y se pasa a la siguiente.
- [ ] **Avanzar antes de tiempo no traspasa el sobrante**: la siguiente pregunta empieza con 30 segundos.
- [ ] **El tiempo transcurrido coincide con el reloj simulado** en todo el intento, y ningún camino termina el intento por
  tiempo total.
- [ ] **Con un temporizador que se atrasa simulado**, las cifras mostradas siguen siendo las correctas.
- [ ] **Tras simular 2 minutos en segundo plano a mitad de una pregunta**, al volver el tiempo es el real y las preguntas
  cuyo plazo se cumplió quedaron resueltas con la regla 2, en orden.
- [ ] **Tras simular una recarga después de 2 minutos**, el mismo resultado.
- [ ] **Con dos pestañas simuladas**, la última toma el intento y la otra queda bloqueada con aviso; ninguna escritura de
  la bloqueada llega al almacén.
- [ ] **Con la pestaña dueña cerrada**, simulado, la otra puede retomar el intento pasado el vencimiento.
- [ ] **El reloj controlable no altera las mediciones de la 35**: `probar:filtrado` en verde con sus tiempos.
- [ ] **La urgencia se comunica sin color**: hay texto o forma que la expresa.
- [ ] **Con el movimiento reducido simulado, el cronómetro no declara movimiento** y sigue mostrando el tiempo.
- [ ] **Contraste de todo texto y borde nuevo** según la guía de la 45, con tabla.
- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **Los dos cronómetros se entienden a la primera**, en teléfono.
- [ ] **Bloquear el teléfono un par de minutos a mitad de una pregunta** deja el tiempo real al volver, con las preguntas
  agotadas resueltas.
- [ ] **Cambiar de pestaña un par de minutos** da el mismo resultado.
- [ ] **Abrir el simulacro en una segunda pestaña** bloquea la primera con un aviso claro, y cerrar la dueña no deja la otra
  bloqueada para siempre.
- [ ] **Con movimiento reducido activado**, el cronómetro sigue siendo comprensible.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado.

## Lo que esta iteración no puede afirmar

- **Que el estudiante no manipule el reloj** del dispositivo: el sitio es estático.

## Notas de la iteración

_Pendiente._