# Iteración 34 · Justificación y repaso

**Épica:** 30 · Cuestionario **Estado:** ⚪ No iniciada **Depende de:** iteración 33 cerrada. El repaso lee el avance
guardado, y sin él no hay qué repasar.

## Objetivo

Que responder enseñe algo —cada pregunta explica su porqué al responderla— y que el estudiante pueda volver únicamente
sobre lo que falló.

## Contexto

_Creada el 2026-09-15 al partir la antigua iteración 33, por decisión del autor._

**Las justificaciones no las ha leído nadie más que el autor.** Las 368 preguntas activas tienen la suya desde el cierre
de la iteración 25, pero la pantalla que las muestra nunca existió. `registro_log.md` lo dejó escrito: un error de
redacción no lo va a descubrir ningún estudiante ni ninguna comprobación hasta que esta iteración las ponga a la vista.
**Esta es la primera vez que un estudiante las va a leer.**

## Decisiones tomadas

### El repaso es por módulo

Decidido por el autor el 2026-09-15. Tres motivos:

1. **Coherencia con todo lo que ya existe.** El índice elige un módulo, las barras miden un módulo y «Reiniciar» actúa
   sobre un módulo. Un repaso global sería la única pieza de la página con otra unidad de medida.
2. **Sesiones cortas desde el teléfono**, que es el público de `vision.md`.
3. **El peso.** Un repaso de los siete módulos obligaría a traerse las falladas de todos, que se acerca a bajar el banco
   entero (371,8 KB): justo lo que la 31 decidió dejar de hacer.

Un repaso general, si alguna vez hace falta, tiene su lugar natural en el simulacro de la épica 40, que ya trabaja con
preguntas de todos los módulos.

### La justificación aparece al responder, se acierte o no

Venía decidido desde el planteamiento original. Explicar solo los errores le quitaría al estudiante el porqué de las que
acertó por descarte o por suerte.

## Decisiones sin resolver

**Se resuelven con el autor antes de arrancar, no durante la implementación.** Cada una cambia lo que el estudiante ve,
y ninguna tiene una respuesta obvia.

1. **Si se acierta en el repaso una pregunta fallada, ¿qué pasa con lo guardado?** Puede reemplazar la respuesta
   anterior —la pregunta deja de estar fallada y las barras del módulo cambian— o conservarse el primer intento. La
   primera recompensa el estudio; la segunda preserva la historia. No pueden convivir sin que las barras mientan en
   alguna de las dos lecturas.
2. **Durante el repaso, ¿qué miden las barras y el contador?** El módulo completo o el repaso en curso. Si miden el
   repaso, sus rótulos tienen que decirlo: la 31 ya corrigió una vez rótulos que medían una cosa y decían otra.
3. **¿Cómo se entra y se sale del repaso, y qué pasa si el estudiante elige otro módulo en el índice a mitad de un
   repaso?**
4. **Al restaurar preguntas ya respondidas, ¿se muestra su justificación** o solo al responder en ese momento? Con 50
   preguntas restauradas, mostrarlas todas cambia mucho el largo de la página en teléfono.

## Tareas

- [ ] Resolver con el autor las cuatro decisiones de arriba y anotarlas en este archivo.
- [ ] Mostrar la justificación de cada pregunta al responderla.
- [ ] Implementar el modo repaso del módulo: únicamente las preguntas falladas.
- [ ] Llevar el foco a un lugar razonable al entrar y al salir del repaso.
- [ ] Hacer que la justificación se pueda alcanzar y leer con teclado y lector de pantalla.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no razonando sobre el código.

### Los provoca Claude Code

- [ ] **Al responder aparece la justificación de esa pregunta**, y no la de otra. Se comprueba respondiendo bien y
  respondiendo mal, sobre el HTML dibujado.
- [ ] **Si una pregunta llegara sin justificación, no aparece un hueco vacío.** Se provoca en la base local.
- [ ] **El escapado cubre la justificación dibujada.** `npm run probar:escapado` a escala, con contenido hostil también
  en la justificación.
- [ ] **El repaso presenta exactamente las falladas del módulo, ni más ni menos**, según el banco vigente: se provoca
  con una fallada cuya correcta cambió con
  `banco:actualizar` y se comprueba que el repaso sigue al banco nuevo.
- [ ] **Con el repaso vacío, el mensaje es útil** y no un espacio en blanco.
- [ ] **El repaso funciona en modo degradado**, desde la instantánea y con el aviso de ADR-008 a la vista.

### Los comprueba el autor en el navegador

- [ ] **La justificación se lee bien en teléfono** con un módulo grande cargado.
- [ ] **Con teclado**, se responde, se llega a la justificación, se entra al repaso y se sale, sin que el foco caiga al
  inicio de la página.
- [ ] **Un lector de pantalla da a conocer la justificación** al responder, o la deja en el orden de lectura
  inmediatamente después de la pregunta.
- [ ] **Sin errores de consola** con cualquier módulo, dentro y fuera del repaso.
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que las justificaciones estén bien redactadas.** Se muestran como están en la base. Si al verlas en pantalla aparece
  un error, se corrige en el banco con el procedimiento de siempre, no aquí.
- Que exista un repaso de todos los módulos a la vez: queda descartado, ver arriba.

## Notas de la iteración

_Pendiente._