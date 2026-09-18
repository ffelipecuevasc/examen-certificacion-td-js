# Épica 40 · Simulacro de examen

**Estado:** 🔵 En curso · **iteraciones 41 y 45 cerradas el 2026-09-18**; lo siguiente en el orden de trabajo es la **42**
**Depende de:** épica 20 (banco en D1) y épica 30 cerrada (capa de datos con modo degradado, escapado, justificación
dibujada, transición de carga, memoria en el navegador y guiones de prueba con intercepción).

La entrega más grande del proyecto.

## Historial de este archivo

- **2026-09-16 · primera reescritura**, tras cerrar la épica 30.
- **2026-09-18 · cerrada la iteración 45**, la dirección visual. Se eligió el tratamiento «Sala de examen» entre tres, se
  escribió la guía visual del simulacro, se construyó el marcado estático del intento y del resumen con el peor caso del
  banco, y entró `scripts/probar-identidad-visual.mjs` como **octavo comprobador** de `npm run verificar`: hasta ese día
  ninguna comprobación miraba el contraste ni que una clase `i-*` existiera en `icons.css`. El autor pidió tres
  correcciones tras su pasada de navegador y quedaron aplicadas.
- **2026-09-18 · cerrada la iteración 41**, en sus tres etapas. Durante ella se escribió **ADR-035**, se corrigió la
  decisión 3 de la 41 —el orden de las preguntas del intento lo fija el algoritmo, no quien las dibuja— y se cazó
  **H-024**: un intento podía elegir sobre D1 y pedir a la instantánea.
- **2026-09-16 · segunda reescritura**, tras la lectura de alcance de la épica completa hecha por Claude Code. Esa
  lectura mostró que las cifras del simulacro no tenían fuente escrita, que `contexto-del-examen.md` dice otra
  duración, que un extremo que elige preguntas choca con `vision.md` y obliga a duplicar lógica en el modo degradado,
  y reancló las preguntas hermanas a ids de D1. El autor resolvió en cinco rondas las decisiones que quedaban abiertas.
  Se corrigieron además tres afirmaciones erróneas de la primera reescritura: el título «reglas del examen real», la
  cita a ADR-001 (sustituida) y la supuesta desaparición de `modulo-0X.json`.

## Qué entregó la iteración 41

**Cerrada el 2026-09-18, en sus tres etapas.** `simulacro.html` existe, con su presentación, su copia vigilada del
encabezado y el pie, y un intento de 120 preguntas que el navegador elige, viene a buscar por id y guarda congelado en
el propio navegador, retomándolo tras una recarga. Todo lo que decide se escribió en **ADR-035**.

**Lo que todavía NO hace, y conviene tenerlo presente al leer lo de abajo:** no se puede responder —el recorrido es la
iteración 43 y los cronómetros la 42—, no hay resumen de resultados —la 44— y **la página no está enlazada desde
ninguna parte**: los enlaces desde los menús, el pie y la portada se agregan en la **iteración 44**, a propósito, para
no llevar a nadie a una pantalla donde después de «Comenzar» no hay nada que hacer.

**Lo siguiente en el orden de trabajo es la iteración 42**, los cronómetros. La **45 cerró el 2026-09-18** y dejó la
dirección visual fijada y el marcado estático construido: la 42 conecta el cronómetro de 30 segundos dentro de la franja
que la 45 dibujó, escribiendo en los huecos que ya tienen su `data-papel`.

## Problema

Estudiar sin reloj entrena el conocimiento pero no la gestión del tiempo, que es donde muchos estudiantes pierden la
certificación. El cuestionario permite pensar indefinidamente; el examen real, no.

## Lo que sabemos del examen real

Según el autor, a partir de información oficial y pública de Talento Digital para Chile (**enlace pendiente de
citar**), el examen dura **120 minutos en total**, y en ese tiempo las preguntas de alternativas y las de programación
**vienen mezcladas en orden aleatorio**, de modo parecido al examen PCEP del Python Institute. Se documenta en
`_planmaestro/00_producto/contexto-del-examen.md`.

**Consecuencia:** el examen real no tiene un bloque separado de alternativas ni, hasta donde sabemos, un límite de
tiempo por pregunta. El simulacro no reproduce el examen: **entrena una parte de él** —responder alternativas bajo
presión de tiempo— con reglas propias.

## Resultado esperado

`simulacro.html`: un intento cronometrado de 120 preguntas de alternativas, una a la vez, con reglas de tiempo,
omisión y aprobación **diseñadas para entrenar**, y un resumen final que dice si se aprobó el simulacro y en qué
módulos se falló.

**Ninguna pantalla afirma que el examen real funcione igual.** La presentación explica las reglas del simulacro como
reglas del simulacro.

## Reglas del simulacro (decisiones de diseño del autor, 2026-09-16)

No vienen del examen real: son decisiones para entrenar.

1. **120 preguntas**, repartidas parejo: **17 por módulo** y la número 120 en un módulo elegido al azar. Y se
   entregan **mezcladas entre módulos**, no agrupadas: el intento no va 17 de bases de datos seguidas y después 17 de
   asincronía. *(Decisión del autor del 2026-09-18, al aprobar el plan de la etapa C de la iteración 41. El motivo:
   en el examen real las preguntas vienen en orden aleatorio, y cambiar de tema de golpe es parte de lo que el
   simulacro entrena. Un intento ordenado por módulo entrena otra cosa —responder de corrido sobre un tema que ya se
   tiene en la cabeza—, que es lo que el cuestionario ya hace.)*
2. **30 segundos por pregunta.** El tiempo sobrante **se pierde**: avanzar antes solo acorta el intento.
3. **El tiempo total no es un límite**: con el sobrante perdido nunca puede agotarse antes que las preguntas. Se
   muestra como tiempo transcurrido.
4. **La alternativa se puede cambiar mientras no se avance.** Si se agota el tiempo con una alternativa marcada,
   **cuenta la marcada**.
5. **Se puede omitir** una pregunta sin alternativa marcada, con un segundo toque de confirmación. **Una omitida no se
   puede volver a responder**: el recorrido nunca vuelve atrás.
6. **Una pregunta agotada sin alternativa marcada** se registra como omitida.
7. **Omitida cuenta como incorrecta.** En la revisión se distingue de una respondida mal.
8. **Se aprueba el simulacro con al menos el 60 %**: 72 correctas de 120.
9. **El reloj sigue corriendo** si se sale de la página o se bloquea el teléfono. Las preguntas agotadas mientras
   tanto quedan omitidas.

## Arquitectura (decisiones del autor, 2026-09-16)

- **El navegador elige las preguntas.** Parte de los ids por módulo que ya entrega `?resumen=1` (ADR-033), aplica el
  reparto, excluye las preguntas hermanas en todo el intento y **baraja las 120 entre módulos** —al final, después
  del reparto y de la exclusión, para que mezclar no pueda alterar ninguna de las dos—. **Hay una sola copia del
  algoritmo**, en `static/js/`. *(El barajado es decisión del autor del 2026-09-18: en el examen real las preguntas
  vienen en orden aleatorio. Ver la regla 1.)*
- **Un extremo de solo lectura sirve las preguntas por id.** No elige, no reparte, no excluye: `vision.md` queda
  intacto y ADR-009 no cambia.
- **En modo degradado (ADR-008)** el mismo algoritmo elige desde la instantánea.
- **Si la validación descarta alguna, se completa con reservas hasta 120.** Si aun así no alcanza, el intento no
  empieza y se explica por qué.
- **Las justificaciones no viajan con el intento**: el resumen las pide por los mismos ids, con la instantánea como
  respaldo.
- **El intento se guarda en el navegador al ocurrir** (patrón de la iteración 33, bajo el espacio
  `examen-td-js.simulacro.` que reservó ADR-034), **con sus preguntas tal como llegaron**. **El resultado se calcula con lo
  que el estudiante vio**; si una pregunta se corrigió después, la revisión lo avisa. Al volver, se retoma con el tiempo real.
- **Todo se pide al pulsar «Comenzar»**; la presentación no pide nada.
- **Si el almacenamiento falla a mitad del intento**, se avisa en pantalla y el intento sigue.
- **Una sola pestaña escribe el intento**: la que abre último lo toma, y la otra se bloquea con un aviso. Se construye en la
  iteración 42, porque necesita un vencimiento por tiempo y la infraestructura del reloj.
- **El último intento terminado se conserva** en el navegador hasta que se empieza otro, y **el resumen se recalcula
  desde él**: no se guarda ningún resultado aparte. No hay historial. *(Corregido el 2026-09-18, en el paso 0 de la
  etapa C de la iteración 41: esta línea decía «el último resultado se conserva», y sonaba a que había un resultado
  guardado. El autor decidió que no lo hubiera, porque se deriva de la copia congelada y las respuestas, que ya están
  las dos guardadas.)*

## Vocabulario del resultado · actualización de ADR-022

*Decidido por el autor el 2026-09-16.* ADR-022 prohibía «aprobado» y «reprobado» porque el simulacro no puede
certificar nada. Se enmienda con una actualización fechada:

- **Permitidas, y solo con esta forma exacta:** «Aprobaste el simulacro» y «Reprobaste el simulacro».
- **Siguen prohibidas:** «aprobado» y «reprobado» sin «el simulacro», «nota», «puntaje oficial», «calificación»,
  «certificación» y cualquier fórmula que sugiera validez de certificación.

**Escrita el 2026-09-16** al final de ADR-022 en `decisiones.md`, con la fila que repetía la lista en `registro_log.md`
marcada como actualizada.

## Fuera de alcance

- Guardar el historial de intentos. Solo se conserva el último resultado. Está en `registro_log.md` como idea futura.
- Cualquier forma de impedir que el estudiante inspeccione las respuestas: el sitio es estático y la instantánea
  incluye las respuestas correctas (ADR-022). Es definitivo mientras exista el respaldo.
- La parte de programación del examen real.
- Mezclar alternativas y programación como en el examen real.

## Orden de trabajo

Decidido por el autor el 2026-09-16: **41 → 45 → 42 → 43 → 44.** La 45 fija la dirección visual antes de construir el
cronómetro, para no rehacer marcado. Los números no cambian.

| # | Iteración | Estado |
|---|---|---|
| 41 | Presentación, selección y protección del intento | 🟢 Cerrada el 2026-09-18 · en tres etapas |
| 45 | Dirección visual del simulacro | 🟢 Cerrada el 2026-09-18 |
| 42 | Cronómetros | ⚪ No iniciada · **es la siguiente** |
| 43 | Recorrido de una pregunta a la vez | ⚪ No iniciada |
| 44 | Resumen de resultados | ⚪ No iniciada |

## Forma de los criterios en toda la épica

Como en la épica 30: cada criterio es una afirmación comprobable, se cierra **provocando** el comportamiento, y se
reparte entre los que prueba Claude Code con guion y los que comprueba el autor en el navegador. Los cambios del banco,
las demoras y las caídas se simulan interceptando la respuesta del extremo, nunca con `banco:actualizar`,
`banco:insertar`, `datos:instantanea` ni nada que regenere `static/js/data/instantanea-banco.js`.

- **El tiempo se simula** con un reloj controlable que construye la iteración 42. Hasta entonces no existe: ningún
  criterio de la 41 lo usa.
- **`npm run verificar` exige `npm run datos:dev` levantado** en otra terminal. Sin servidor da código 2 («no se pudo
  probar»), que no es un aprobado.
- **`npm run verificar` no corre `probar:filtrado` ni `probar:memoria`** (pendiente de la épica 50): sus salidas se
  informan aparte en cada reporte.