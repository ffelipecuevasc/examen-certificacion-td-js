# Iteración 43 · Recorrido de una pregunta a la vez

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
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

## Decisiones tomadas

Todas del autor, 2026-09-16.

### 1 · Avanzar, cambiar y omitir

- **La alternativa marcada se puede cambiar** mientras no se avance.
- **Con una alternativa marcada, el botón avanza** y la registra.
- **Sin alternativa marcada, el botón dice «Omitir» y pide un segundo toque** («¿Omitir? Toca de nuevo» o similar), en la
  misma pantalla y sin ventanas emergentes. El primer toque no omite.
- **Si se marca una alternativa después del primer toque de «Omitir»**, la confirmación se retira.
- **Una omitida no se puede responder después**, y cuenta como incorrecta.
- **Nunca se vuelve atrás.**

### 2 · Las reglas en la presentación son las del simulacro

El texto definitivo de la presentación (41) explica las reglas del README de la épica **como reglas del simulacro**: 120
preguntas, 30 segundos cada una, el sobrante se pierde, se puede cambiar la alternativa antes de avanzar, cómo se omite y
qué cuesta, que el reloj sigue si se sale, y que se aprueba el simulacro con 72 correctas. **No dice que el examen real
funcione igual.** Usa el vocabulario de la actualización de ADR-022.

## Tareas

- [ ] Mostrar una pregunta a la vez, con su número y el total, según la 45.
- [ ] Marcar y cambiar la alternativa sin registrarla hasta avanzar o agotarse.
- [ ] Botón que avanza o pide confirmación para omitir, según haya alternativa marcada.
- [ ] Registrar cada resultado (respondida con su alternativa u omitida) en el intento guardado, sin revelar si fue
  correcta.
- [ ] Indicador de avance del intento, según la 45.
- [ ] Navegación por teclado: elegir y cambiar alternativa, avanzar y omitir sin ratón.
- [ ] Anunciar el cambio de pregunta a tecnologías de asistencia.
- [ ] Impedir volver atrás, también con el botón «atrás» del navegador.
- [ ] Cerrar el texto de las reglas en la presentación (decisión 2).

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, con el reloj controlable de la 42.

### Los provoca Claude Code

- [ ] **Solo hay una pregunta en el HTML dibujado en cada momento.**
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