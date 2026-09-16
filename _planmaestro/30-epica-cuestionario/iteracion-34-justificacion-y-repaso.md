# Iteración 34 · Justificación y repaso

**Épica:** 30 · Cuestionario
**Estado:** ⚪ No iniciada
**Depende de:** iteraciones 33 y 36 cerradas. El repaso lee el avance guardado de la
33, y la justificación se dibuja sobre la paleta que dejó la 36.

## Objetivo

Que responder enseñe algo —cada pregunta explica su porqué— y que el estudiante pueda
volver únicamente sobre lo que falló.

## Contexto

**Las justificaciones no las ha leído nadie más que el autor.** Las 368 preguntas activas
tienen la suya desde el cierre de la iteración 25, pero la pantalla que las muestra nunca
existió. **Esta es la primera vez que un estudiante las va a leer**, y un error de
redacción no lo va a descubrir ninguna comprobación antes que ellos.

## Historial de este archivo

- **2026-09-15 · creada** al partir la antigua iteración 33, por decisión del autor.
- **2026-09-16 · decisiones resueltas antes de arrancar.** El autor resolvió las cuatro
  decisiones que el archivo dejaba abiertas (decisiones 3 a 6). Se corrigieron dos
  criterios que pedían provocar cambios con `banco:actualizar` y en la base local, algo
  que la 33 prohibió porque sobrescribe la instantánea versionada, y se agregó lo que
  heredan de la 33 y la 36.

## Lo que hereda

**De la 33:**

- **El avance guarda una sola respuesta por pregunta**: el id de la pregunta y el texto
  de la alternativa elegida. **Nunca el veredicto**, que se recalcula contra el banco
  vigente (ADR-034, formato `v: 1`).
- **Los cambios del banco se provocan interceptando la respuesta del extremo**, nunca
  con `banco:actualizar` ni escribiendo en la base: ese comando regenera la instantánea
  versionada.
- La puerta única `pedirCambioDeModulo()`, el foco a la cabecera al cargar un módulo, y
  «Reiniciar el módulo» borrando lo guardado de ese módulo.

**De la 36:**

- **Ya no hay dos niveles de gris para dar jerarquía.** `mutedink` y `muted` quedaron a
  1,19:1 entre sí. La justificación se distingue con peso de letra, color principal o
  un recuadro, no con un gris distinto.
- **`cuestionario.js` cambió** en el estado vacío y en el veredicto.

**Del panel actual:** ya existe un botón **«Repasar la materia»**. El modo de esta
iteración no puede llamarse igual (decisión 5).

## Decisiones tomadas

### 1 · El repaso es por módulo

Decidido por el autor el 2026-09-15:

1. **Coherencia.** El índice elige un módulo, las barras miden un módulo y «Reiniciar»
   actúa sobre un módulo.
2. **Sesiones cortas desde el teléfono**, el público de `vision.md`.
3. **El peso.** Un repaso de los siete módulos se acerca a bajar el banco entero
   (371,8 KB), justo lo que la 31 dejó de hacer.

Un repaso general tiene su lugar natural en el simulacro de la épica 40.

### 2 · La justificación aparece al responder, se acierte o no

Explicar solo los errores le quitaría al estudiante el porqué de las que acertó por
descarte o por suerte.

### 3 · Acertar en el repaso reemplaza lo guardado

Decidido por el autor el 2026-09-16. Si en el repaso el estudiante acierta una pregunta
que había fallado, **la respuesta nueva reemplaza a la anterior**: la pregunta deja de
estar fallada y las barras del módulo lo reflejan.

**Motivos:** premia el estudio, que es el propósito del sitio, y **no cambia el formato de
lo guardado**. Conservar los dos intentos exigiría una versión nueva del formato, con
migración y enmienda de ADR-034.

**Consecuencias:**

- **En el repaso, cada pregunta fallada aparece sin marcar**, para poder intentarla de
  nuevo.
- **Si vuelve a fallarla**, la respuesta nueva también reemplaza a la anterior, y la
  pregunta sigue en el repaso.
- **Una pregunta acertada en el repaso sigue a la vista, con su justificación, hasta que
  el estudiante sale del repaso.** Si desapareciera al instante, el contenido saltaría
  bajo el dedo en el teléfono.
- **Se pierde la historia del primer intento.** Aceptado.

### 4 · Durante el repaso, las barras siguen midiendo el módulo completo

Decidido por el autor el 2026-09-16. **Las barras no cambian de significado según el
modo**: son lo más estable de la página, y la 31 ya corrigió una vez rótulos que decían
una cosa y medían otra. El repaso muestra **su propio contador**, del tipo «Te quedan N
preguntas falladas por repasar», que se actualiza al acertar.

### 5 · Cómo se entra y se sale del repaso

Decidido por el autor el 2026-09-16.

- **Entrar:** un botón junto a «Reiniciar el módulo» que dice **«Repasar mis errores
  (N)»**, con la cantidad de falladas a la vista. El nombre lo distingue de «Repasar la
  materia».
- **Con N en 0, el botón sigue visible**, y al pulsarlo muestra un mensaje útil: si no hay
  respuestas en el módulo, invita a empezar respondiendo; si todas están acertadas, dice
  que no hay errores que repasar.
- **Salir:** un botón «Volver al módulo completo».
- **Elegir otro módulo en el índice a mitad del repaso** sale del repaso y cambia de
  módulo, sin preguntar. Con la memoria de la 33 no se pierde nada.
- **«Reiniciar el módulo» a mitad del repaso** sale del repaso y reinicia.

### 6 · Las preguntas restauradas ofrecen «Ver por qué»

Decidido por el autor el 2026-09-16. **Una pregunta respondida en esta visita muestra su
justificación desplegada.** **Una pregunta restaurada de una visita anterior muestra un
control «Ver por qué»** que la despliega solo si el estudiante lo pide. Así la página no
se alarga con 50 justificaciones en el teléfono, y ninguna explicación queda fuera de
alcance.

## Lo que queda a criterio de quien implemente

El diseño visual de la justificación (con las condiciones heredadas de la 36), dónde
exactamente se ubica el contador del repaso, cómo se anuncia la justificación a un lector
de pantalla, y el mecanismo de intercepción en los guiones. El texto de los botones y del
control «Ver por qué» es el de las decisiones 5 y 6.

## Tareas

- [x] Resolver con el autor las cuatro decisiones abiertas y anotarlas en este archivo.
  Hecho el 2026-09-16 (decisiones 3 a 6).
- [ ] Mostrar la justificación al responder, y «Ver por qué» en las preguntas restauradas.
- [ ] Implementar el modo repaso del módulo con sus botones, su contador y sus mensajes.
- [ ] Hacer que acertar en el repaso reemplace lo guardado sin cambiar el formato.
- [ ] Llevar el foco a un lugar razonable al entrar y al salir del repaso, y al desplegar
  «Ver por qué».
- [ ] Hacer que la justificación se pueda alcanzar y leer con teclado y lector de
  pantalla.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento. **Ningún
criterio se provoca con `banco:actualizar` ni escribiendo en la base**: los cambios del
banco se simulan interceptando la respuesta del extremo, como en la 33.

### Los provoca Claude Code

**Justificación**

- [ ] **Al responder aparece la justificación de esa pregunta, y no la de otra**,
  respondiendo bien y respondiendo mal, sobre el HTML dibujado.
- [ ] **Una pregunta restaurada muestra «Ver por qué» y no la justificación desplegada**;
  al activarlo aparece la justificación correcta.
- [ ] **Si una pregunta llegara sin justificación, no aparece un hueco vacío** ni un
  «Ver por qué» que no despliega nada. Provocado interceptando la respuesta.
- [ ] **El escapado cubre la justificación dibujada**, desplegada y tras «Ver por qué»:
  `npm run probar:escapado` a escala, con contenido hostil en la justificación.
- [ ] **Ningún texto de la justificación usa un gris que dependa de la diferencia entre
  `mutedink` y `muted`**, y todo su texto alcanza al menos 4,5:1 sobre su fondo:
  tabla con elemento, color, fondo y razón.

**Repaso**

- [ ] **El repaso presenta exactamente las falladas del módulo, ni más ni menos, según
  el banco vigente.** Provocado interceptando la respuesta con una pregunta cuya
  correcta cambió: el repaso sigue al banco nuevo.
- [ ] **El botón dice «Repasar mis errores (N)» con N exacto**, y N cambia al acertar.
- [ ] **Con N en 0 aparecen los dos mensajes útiles**, el de módulo sin respuestas y el de
  todo acertado, cada uno en su caso.
- [ ] **Acertar en el repaso reemplaza lo guardado:** la clave del módulo trae la
  alternativa nueva, sin veredicto, con el mismo formato `v: 1`.
- [ ] **Una acertada sigue a la vista hasta salir del repaso**, y al volver a entrar ya no
  está.
- [ ] **Volver a fallar deja la pregunta en el repaso** con la respuesta nueva guardada.
- [ ] **Durante el repaso, las barras miden el módulo completo** y el contador mide el
  repaso: provocado acertando una fallada y leyendo las dos cifras.
- [ ] **Elegir otro módulo en el índice o reiniciar a mitad del repaso sale del repaso**,
  sin aviso y sin perder nada.
- [ ] **El repaso funciona en modo degradado**, desde la instantánea y con el aviso de
  ADR-008 a la vista.
- [ ] **El repaso funciona sin almacenamiento**, con lo respondido en la visita.

**Verificación**

- [ ] **`npm run probar:filtrado`, `npm run probar:memoria` y `npm run probar:escapado`
  siguen en verde**, con cada rojo nuevo provocado una vez.
- [ ] **`static/js/data/instantanea-banco.js` sin cambios** al terminar.

### Los comprueba el autor en el navegador

- [ ] **La justificación se lee bien en teléfono** con un módulo grande cargado, y se
  distingue del enunciado y las alternativas.
- [ ] **«Ver por qué» se entiende** en una pregunta restaurada, sin explicación previa.
- [ ] **«Repasar mis errores (N)» no se confunde con «Repasar la materia».**
- [ ] **El repaso de principio a fin:** entrar, acertar una, fallar otra, ver que la
  acertada sigue a la vista, salir y volver a entrar.
- [ ] **Con teclado**, se responde, se llega a la justificación, se abre «Ver por qué», se
  entra al repaso y se sale, sin que el foco caiga al inicio de la página.
- [ ] **Un lector de pantalla da a conocer la justificación** al responder, o la deja en
  el orden de lectura inmediatamente después de la pregunta.
- [ ] **En escala de grises**, la justificación y los botones del repaso se distinguen.
- [ ] **Sin errores de consola** con cualquier módulo, dentro y fuera del repaso.
- [ ] **`npm run verificar` termina en 0** tras el commit.

## Lo que esta iteración no puede afirmar

- **Que las justificaciones estén bien redactadas.** Se muestran como están en la base.
  Si aparece un error, se corrige en el banco con el procedimiento de siempre.
- **Que se conserve la historia de los intentos.** Acertar en el repaso reemplaza el
  primer intento (decisión 3).
- Que exista un repaso de todos los módulos a la vez: queda descartado (decisión 1).

## Notas de la iteración

_Pendiente._