# Iteración 43 · Recorrido de una pregunta a la vez

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 42

## Objetivo

Presentar las preguntas del intento de una en una, con avance manual, omisión y avance
automático según las reglas del examen real, sin revelar si una respuesta fue correcta
hasta el resumen.

## Contexto

Esta es la diferencia conceptual con `cuestionario.html`. Allí la corrección es inmediata
porque el objetivo es aprender. Aquí no se corrige durante el intento, porque el objetivo es
medir: saber que fallaste la pregunta 3 cambiaría tu ánimo en las 117 restantes, igual que
en el examen real.

## Historial de este archivo

- **2026-09-16 · reescrita.** El autor fijó las reglas del examen real para omitir. Se
  movió aquí el texto definitivo de las reglas de la presentación, que depende de las
  decisiones de la 42 y de esta iteración.

## Decisiones tomadas

### 1 · Se puede omitir, sin vuelta atrás, y la omitida cuenta como incorrecta

Decidido por el autor el 2026-09-16, para imitar el examen real:

- **El estudiante puede omitir una pregunta** y pasar a la siguiente.
- **Una pregunta omitida no se puede responder después**: el recorrido nunca vuelve atrás.
- **Una pregunta omitida cuenta como incorrecta** para el resultado. En la revisión del
  resumen (44) se distingue de una respondida mal, pero las dos restan igual.
- **Una pregunta cuyo tiempo se agota sin respuesta** tiene las mismas consecuencias que una
  omitida.

## Decisiones sin resolver

### 2 · Cambiar la alternativa antes de avanzar (la decide el autor)

¿Puede el estudiante cambiar la alternativa elegida mientras no haya avanzado, o la primera
que toca queda fija? Depende de cómo funciona el examen real. En el teléfono, un toque por
error es frecuente. **Pendiente.**

### 3 · Confirmación al omitir (la decide el autor)

Omitir es irreversible y cuenta como incorrecta. Un botón «Omitir» junto a «Siguiente», en
un teléfono, se puede tocar por error. ¿Se pide confirmación, se separan físicamente los
botones, o se omite con un solo toque como en el examen real? **Pendiente.**

### 4 · La barra de avance y el panel (la decide el autor, con la 45)

La tarea original la pone en el panel fijo. Si el simulacro reutiliza el panel del
cuestionario, hereda ADR-032: el panel no crece ni una fila. **Pendiente.**

## Tareas

- [ ] Mostrar una pregunta a la vez, con su número y el total.
- [ ] Botón para avanzar tras elegir una alternativa.
- [ ] Botón para omitir, según la decisión 3.
- [ ] Registrar cada respuesta sin revelar si fue correcta.
- [ ] Indicador de avance del intento, según la decisión 4.
- [ ] Navegación por teclado: elegir alternativa, avanzar y omitir sin ratón.
- [ ] Anunciar el cambio de pregunta a tecnologías de asistencia.
- [ ] Cerrar el texto de las reglas en la presentación (41): cuántas preguntas, cuánto
  dura, qué pasa con el tiempo sobrante, qué significa omitir y qué se necesita para
  aprobar el simulacro.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, con el reloj
controlado de los guiones.

### Los provoca Claude Code

- [ ] **Solo hay una pregunta en el HTML dibujado en cada momento.**
- [ ] **Avanzar tras responder registra la alternativa elegida** y respeta los cronómetros
  de la 42.
- [ ] **Omitir registra la pregunta como omitida**, cuenta como incorrecta para el
  resultado y no existe ningún camino para volver a ella: ni botón, ni teclado, ni
  historial del navegador.
- [ ] **Una pregunta agotada por tiempo queda registrada igual que una omitida.**
- [ ] **Durante el intento, el HTML dibujado no contiene ninguna marca de acierto o error**
  ni la justificación.
- [ ] **El indicador de posición coincide con la pregunta dibujada** en todo el recorrido.
- [ ] **Un intento completo de 120 preguntas se recorre de principio a fin** con el reloj
  controlado, mezclando respuestas, omisiones y agotamientos, y el registro final coincide
  con lo provocado.
- [ ] **La decisión 2 se cumple**, provocada.
- [ ] **El texto de las reglas en la presentación coincide con las decisiones** de la 42 y
  de esta iteración: se comprueba contra este archivo y el de la 42.
- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **Se entiende la diferencia entre avanzar y omitir**, y no se omite por error en el
  teléfono.
- [ ] **Un tramo del intento se realiza solo con teclado**, incluidos avanzar y omitir.
- [ ] **Al cambiar de pregunta, un lector de pantalla anuncia la nueva.**
- [ ] **Un intento real completo, de principio a fin**, sin errores de consola.
- [ ] **Las reglas de la presentación se entienden sin tecnicismos.**
- [ ] **`npm run verificar` termina en 0.**

## Notas de la iteración

_Pendiente._