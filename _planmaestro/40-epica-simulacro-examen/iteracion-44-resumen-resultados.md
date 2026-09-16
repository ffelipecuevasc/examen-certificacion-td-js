# Iteración 44 · Resumen de resultados

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 43.

## Objetivo

Cerrar el intento con un resumen que diga si se aprobó el simulacro, qué módulos estudiar, y por qué era correcta cada
respuesta.

## Contexto

Es la pantalla que justifica todo el simulacro. Un porcentaje aislado no sirve de nada; lo útil es «fallaste 9 de 17
preguntas del módulo 5, vuelve a normalización».

## Historial de este archivo

- **2026-09-16 · reescrita dos veces.** El autor fijó el vocabulario del resultado, la forma de la revisión en el teléfono,
  que las justificaciones se piden en el resumen y que se conserva el último resultado. La lectura de alcance mostró que la
  justificación de la 34 no está exportada y que los anclajes de la guía no llevan el número del módulo.

## Lo que hereda

- **Reglas del simulacro** (README de la épica): omitida cuenta como incorrecta; se aprueba con 72 de 120.
- **Actualización de ADR-022:** solo «Aprobaste el simulacro» y «Reprobaste el simulacro».
- **Iteración 41:** el intento guardado con sus preguntas; siempre 120.
- **Iteración 45:** el marcado estático del resumen y el significado de cada color.
- **Iteración 34:** `justificacionDibujada()`, `porqueDibujado()` y `tieneJustificacion()` en `cuestionario.js`,
  **sin exportar y acopladas** a `bancoCargado` y a los estados «respondida en la visita / restaurada».
- **La guía:** `components/modules.js:203` crea `<article id="modulo-${i}">` con `i` = posición, no número de módulo
  (`#modulo-0` es el módulo 2); los crea JavaScript, no están en `index.html`, y el acordeón llega cerrado.
  `index.html#modulos` sí está en el HTML.

## Decisiones tomadas

Todas del autor, 2026-09-16.

### 1 · El resultado

- **«Aprobaste el simulacro»** con 72 correctas o más; **«Reprobaste el simulacro»** con 71 o menos.
- **Las omitidas y las agotadas sin alternativa cuentan como incorrectas.**

### 2 · La revisión en el teléfono

**Agrupada por módulo, de peor a mejor desempeño.** En cada módulo, **las incorrectas y las omitidas llegan abiertas** y
**las correctas plegadas**, con un control para abrirlas. Cada pregunta muestra la alternativa dada (o que se omitió), la
correcta y la justificación.

### 3 · Las justificaciones se piden al llegar al resumen

Se piden por los ids del intento al extremo de la 41, con la instantánea como respaldo si falla. La justificación se dibuja
con **una sola pieza extraída de la iteración 34**, que recibe la pregunta y nada más; el cuestionario pasa a usar esa misma
pieza.

### 4 · Si una pregunta se corrigió después del intento

Decidido por el autor el 2026-09-16, en la lectura de alcance de la 41. **El resultado se calcula con las preguntas tal como
las vio el estudiante.** Al pedir las justificaciones al banco vigente, el resumen compara: si una pregunta cambió desde el
intento, **la revisión muestra la versión corregida con un aviso** del tipo «Esta pregunta se corrigió después de tu intento».
Nadie aprende una regla que la corrección desmintió.

### 5 · Se conserva el último resultado

El resumen queda en el navegador hasta que se empieza otro intento, que lo reemplaza. No hay historial.

## Decisiones sin resolver

### 6 · Los enlaces a la guía (la decide el autor tras la lectura de alcance)

Enlazar a `#modulo-N` no funciona tal como está la portada. Caminos posibles: enlazar a `index.html#modulos`, que siempre
existe; o cambiar la portada para que cada módulo tenga un ancla con su número y se abra al llegar, lo que toca
`modules.js`. **Pendiente.**

### 7 · El desempate del desglose (propuesta a confirmar)

Propuesta: de peor a mejor por porcentaje de correctas; a igual porcentaje, primero el módulo con más omitidas; si sigue el
empate, por número de módulo. **Pendiente de confirmar** en la lectura de alcance.

## Tareas

- [ ] Extraer la pieza de la justificación de la 34 y hacer que el cuestionario la use, sin cambiar lo que muestra.
- [ ] Resultado global: correctas, respondidas mal, omitidas, porcentaje y resultado del simulacro.
- [ ] Desglose por módulo, ordenado de peor a mejor (decisión 7).
- [ ] Tiempo transcurrido total y promedio por pregunta.
- [ ] Revisión agrupada por módulo (decisión 2).
- [ ] Pedir las justificaciones con respaldo (decisión 3).
- [ ] Enlaces a la guía (decisión 6).
- [ ] Aviso de pregunta corregida después del intento (decisión 4).
- [ ] Conservar el último resultado (decisión 5) y botón para rendir otro intento.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, con intentos simulados de resultado conocido y
el reloj controlable de la 42.

### Los provoca Claude Code

- [ ] **Las cifras cuadran**: correctas + respondidas mal + omitidas = 120.
- [ ] **El umbral es exacto en el borde**: 72 correctas dicen «Aprobaste el simulacro» y 71 «Reprobaste el simulacro».
- [ ] **Una agotada con alternativa marcada** cuenta según esa alternativa; **una agotada sin alternativa**, como omitida.
- [ ] **El desglose por módulo suma 120** y respeta el orden y el desempate de la decisión 7.
- [ ] **La revisión agrupa por módulo, en el orden del desglose**, con incorrectas y omitidas abiertas y correctas plegadas.
- [ ] **Cada pregunta de la revisión muestra la alternativa dada o que se omitió, la correcta y la justificación correcta.**
- [ ] **Con una pregunta cambiada en el banco después del intento**, simulado interceptando, el resultado no cambia y la
  revisión muestra la versión corregida con el aviso.
- [ ] **Con el extremo caído al pedir las justificaciones**, simulado interceptando, salen de la instantánea.
- [ ] **La justificación se dibuja con la pieza extraída** en el resumen y en el cuestionario: `probar:memoria` y
  `probar:filtrado` siguen en verde sin cambios de comportamiento.
- [ ] **El texto dibujado del resumen no contiene ninguna palabra prohibida** por la actualización de ADR-022, y el resultado
  usa exactamente una de las dos frases permitidas.
- [ ] **Los enlaces a la guía llevan a un destino que existe una vez dibujada la portada**, según la decisión 6.
- [ ] **Tras simular una recarga en el resumen**, se muestra el mismo resultado; **al empezar otro intento**, el anterior
  deja de estar guardado.
- [ ] **Rendir otro intento pide una selección nueva** y no reutiliza la anterior.
- [ ] **`probar:escapado` cubre la revisión**, con un bloque nuevo para el simulacro.
- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **El resultado se entiende a la primera.**
- [ ] **El desglose dice qué estudiar** sin tener que interpretar números.
- [ ] **La revisión se recorre cómodamente en el teléfono**, abriendo y plegando correctas.
- [ ] **Los enlaces a la guía llevan donde prometen.**
- [ ] **Ninguna frase sugiere una certificación ni equipara el simulacro con el examen real**, leída en pantalla.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado.

## Lo que esta iteración no puede afirmar

- **Que aprobar el simulacro signifique aprobar el examen real.** El examen real mezcla programación, dura 120 minutos y no
  tiene las reglas del simulacro; y el simulacro no puede garantizar que no se hayan visto las respuestas (ADR-022).

## Notas de la iteración

_Pendiente._