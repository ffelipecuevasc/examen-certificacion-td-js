# Iteración 42 · Cronómetros

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 41. Decisiones E4 y E5 de la épica resueltas.

## Objetivo

Implementar los dos cronómetros —el total de 60 minutos y el de 30 segundos por
pregunta— con avance automático al agotarse este último, sin que el tiempo mostrado
dependa de la precisión del temporizador del navegador.

## Historial de este archivo

- **2026-09-16 · reescrita.** Se precisó la relación entre los dos cronómetros según qué
  pase con el tiempo sobrante, se agregó el bloqueo del teléfono como caso principal de
  segundo plano, se aclaró qué ocurre con una pregunta sin responder al agotarse su tiempo
  (reglas del examen real), y se agregaron las condiciones de color que impone la paleta.

## Lo que hereda

- **Reglas del examen real** (README de la épica): una pregunta omitida no se puede volver
  a responder y cuenta como incorrecta.
- **Iteración 35:** el movimiento se apaga con `prefers-reduced-motion` desde
  `src/input.css`; toda animación empieza y termina en reposo. El DOM falso de los guiones
  puede simular el movimiento reducido (decisión 8 de la 35).
- **Paleta** (`tailwind.config.cjs`): existen `ruby` (#E0115F) y `rubydim`, `esmeralda` y
  `esmeraldadim`. **`ruby` sobre `ink` da 4,41:1 y sobre `panel` 3,98:1**: no alcanza 4,5:1
  para texto normal. Solo sirve para texto grande (3:1), bordes, íconos o como fondo
  `rubydim` con texto `paper` (9,95:1).

## Decisiones sin resolver

### 1 · El tiempo sobrante y la relación entre los cronómetros (decisión E5 de la épica)

Si el estudiante responde en 10 segundos, ¿qué pasa con los 20 restantes? La elección
cambia qué significa cada cronómetro:

- **Si el sobrante se pierde**, cada pregunta tiene sus 30 segundos y avanzar antes solo
  acorta el intento. El total nunca puede agotarse antes de terminar las preguntas: **el
  cronómetro de 60 minutos pasa a ser informativo, no un límite**, y el criterio «al
  agotarse los 60 minutos el intento termina» no puede ocurrir.
- **Si el sobrante se acumula**, hay que decidir en qué se usa: el tope de 30 segundos por
  pregunta impide gastarlo. O el tope por pregunta se alarga con lo acumulado, o el total
  es el único límite real y los 30 segundos son una referencia.

**Lo que decide es cómo funciona el examen real.** Hay que contrastarlo con
`_planmaestro/00_producto/contexto-del-examen.md` antes de elegir. **Pendiente.**

### 2 · El cronómetro en segundo plano (la decide el autor)

Si el estudiante cambia de pestaña **o bloquea el teléfono**, que es el caso real del
público, ¿el tiempo sigue corriendo? Lo más parecido al examen real es que sí. El tiempo se
calcula siempre desde un instante de inicio guardado, no contando pulsos del temporizador,
que se ralentiza en pestañas ocultas. **Pendiente.**

### 3 · El color de la urgencia (la decide el autor, antes o con la 45)

`ruby` significa «error» en el resumen (44). Usarlo también para «se acaba el tiempo»
puede confundir. Además no alcanza 4,5:1 como texto normal. **Pendiente**, con E4.

## Tareas

- [ ] Cronómetro total, visible durante todo el intento.
- [ ] Cronómetro de 30 segundos por pregunta, llamativo.
- [ ] Avance automático a la siguiente pregunta al agotarse su tiempo.
- [ ] Señal clara cuando el tiempo de la pregunta se acaba, que no dependa solo del color.
- [ ] Resolver y documentar en una ADR el tiempo sobrante (decisión 1).
- [ ] Resolver y documentar en una ADR el segundo plano (decisión 2).
- [ ] Fin del intento según la decisión 1.
- [ ] Respetar `prefers-reduced-motion`.
- [ ] Un reloj controlable en los guiones, para probar un intento completo sin esperar el
  tiempo real.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, con el reloj
controlado de los guiones.

### Los provoca Claude Code

- [ ] **Los dos cronómetros avanzan de forma coherente** con la regla de la decisión 1,
  comprobado en varios puntos de un intento simulado.
- [ ] **Al agotarse el tiempo de una pregunta, se pasa sola a la siguiente** y la anterior
  queda registrada como sin responder, con las consecuencias de una omisión: no se puede
  volver a ella y cuenta como incorrecta.
- [ ] **El final del intento ocurre según la decisión 1** y lleva al resumen.
- [ ] **El tiempo mostrado se calcula desde el instante de inicio**: simulando un
  temporizador que se atrasa, la cifra mostrada sigue siendo la correcta.
- [ ] **Tras simular un minuto en segundo plano**, el tiempo al volver es el que dice la
  decisión 2, y si una o varias preguntas se agotaron en ese lapso, quedan registradas como
  sin responder.
- [ ] **La cuenta regresiva se entiende sin color**: hay texto o forma que la comunica.
- [ ] **Con el movimiento reducido simulado, el cronómetro no declara movimiento** y sigue
  mostrando el tiempo.
- [ ] **Todo texto y borde del cronómetro alcanza su umbral de contraste**, con tabla de
  elemento, color, fondo real y razón.
- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **Los dos cronómetros se entienden a la primera**, en teléfono.
- [ ] **Bloquear el teléfono un minuto a mitad de una pregunta** deja el tiempo correcto
  según la decisión 2.
- [ ] **Cambiar de pestaña un minuto** da el mismo resultado.
- [ ] **Con movimiento reducido activado**, el cronómetro sigue siendo comprensible.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que el estudiante no manipule el reloj** del dispositivo: el sitio es estático.

## Notas de la iteración

_Pendiente._