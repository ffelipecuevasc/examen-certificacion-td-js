# Épica 30 · Cuestionario

**Estado:** 🟢 Cerrada · 2026-09-16 **Depende de:** épica 20, cerrada el 2026-09-10

## Problema

`cuestionario.html` funciona, pero fue construido para 105 preguntas dibujadas de una vez y sin memoria entre visitas.
El banco tiene hoy **368 preguntas**, así que mostrarlas juntas dejó de ser una opción de diseño. A eso se suman tres
carencias:
el avance se pierde al recargar, no hay forma de volver solo sobre lo fallado, y responder mal no enseña nada porque no
se explica el porqué.

## Resultado esperado

Una página de estudio a ritmo propio donde el estudiante elige qué módulo practicar, el sitio recuerda dónde quedó,
explica cada respuesta y permite repasar solo los errores.

**Desde el 2026-09-16 existe entero.** Se elige módulo en el
índice, el avance se guarda en el navegador, cada respuesta muestra su porqué y «Repasar mis errores (N)» deja en
pantalla solo las falladas de ese módulo. Y elegir un módulo ya no salta de una zona vacía a una llena: hay una
transición que dura lo que tarda la carga de verdad, y que avisa si se pasa de lo normal.

## Alcance

- Elección de módulo, con la zona de preguntas vacía hasta que se elija uno.
- Barras de progreso en formato horizontal, ocupando todo el ancho del panel.
- Índice de módulos con avance individual.
- Persistencia del avance en el navegador.
- Justificación visible al responder.
- Modo repaso de errores, por módulo.
- Transición al cargar un módulo, fiel a la carga real, con aviso cuando la carga tarda más de lo normal.
- Portada y navegación orientadas a quien no da por supuestas las convenciones de la web.

## Fuera de alcance

- Cronómetros y presión de tiempo. Eso es la épica 40.
- Cambios en el origen de los datos. Eso quedó cerrado en la épica 20.
- Borrar todo el avance de una vez. Decidido por el autor el 2026-09-15: se borra módulo por módulo con «Reiniciar el
  módulo», y se evalúa con el uso.

## Iteraciones

| #  | Iteración                                | Estado                     |
|----|------------------------------------------|----------------------------|
| 31 | Selector de módulo                       | 🟢 Completada · 2026-09-11 |
| 32 | Rediseño del panel fijo                  | 🟢 Completada · 2026-09-15 |
| 33 | Memoria del avance                       | 🟢 Completada · 2026-09-15 |
| 34 | [Justificación y repaso](iteracion-34-justificacion-y-repaso.md) | 🟢 Completada · 2026-09-16 |
| 35 | [Transición de carga](iteracion-35-transicion-de-carga.md) | 🟢 Completada · 2026-09-16 |
| 36 | [Orientación del estudiante en la portada](iteracion-36-orientacion-en-la-portada.md) | 🟢 Completada · 2026-09-15 |

**El título de la fila 34 estaba equivocado** y decía «Orientación del estudiante en la portada»,
que es el de la 36: quedó así al renumerar el 2026-09-15 y se corrige al cerrarla.

**Orden de trabajo: 33 → 36 → 34 → 35.** Decidido por el autor el **2026-09-15**, al cerrar la 33.
**Se cumplió entero: la 34 y la 35 cerraron el 2026-09-16, y con la 35 cerró la épica.**
La 36 se adelanta a la 34 y la 35 porque **la portada publica hoy una cifra falsa**, que es un
defecto a la vista de cualquiera que entre, y porque **la 36 no depende de la 33, la 34 ni la 35**:
toca `index.html`, no el cuestionario. Las otras dos siguen después, en su orden, y ninguna se
descarta.

**Reorganizado el 2026-09-15, por decisión del autor.** La antigua iteración 33 («Memoria del avance, justificaciones y
repaso») juntaba ocho frentes y se partió en tres: 33, 34 y 35. La orientación en la portada pasó de la 34 a la 36.
Ninguna de las iteraciones renumeradas estaba iniciada, así que ninguna ADR queda apuntando al
vacío. **Sí quedan citas antiguas a la numeración vieja, y no se reescriben:** la iteración 25
—líneas 462, 836 y 913— y tres bitácoras —`2026-09-10-cierre-epica-20.md`,
`2026-09-10-iteracion-25-modulo-03.md` y `2026-09-10-iteracion-25-modulo-04.md`— citan la
**justificación visible** como iteración 33. Eran ciertas el día que se escribieron, y las
bitácoras y las iteraciones cerradas son registro histórico: se leen para saber qué se sabía
entonces, no para saber dónde está hoy cada cosa. Por eso se dejan como están, y la corrección
vive acá: **la justificación visible es hoy la iteración 34.**

---

## Cierre de la épica · 2026-09-16

Las seis iteraciones cerradas, y con la 35 cierra la épica. Lo que entregó, en orden de
uso:

- **Selector de módulo (31).** La página dejó de dibujar el banco entero: arranca vacía y
  solo viaja el módulo que se elige. Con 368 preguntas, mostrarlas juntas había dejado de
  ser una opción de diseño.
- **Rediseño del panel fijo (32).** Barras horizontales a todo el ancho, e **índice de los
  siete módulos** con su avance individual, que pasó a ser el único control para elegir.
  Elegir un módulo deja al estudiante en su cabecera, con el foco y el desplazamiento.
- **Memoria del avance (33).** El avance se guarda en el navegador del estudiante, sin
  cuentas ni registro, una clave por módulo, y **el veredicto no se guarda: se recalcula
  contra el banco de hoy**. «Reiniciar el módulo» borra también lo guardado.
- **Orientación en la portada (36).** La portada dejó de publicar una cifra falsa, y se
  reordenó para quien no da por supuestas las convenciones de la web.
- **Justificación y repaso (34).** Cada respuesta muestra su porqué, se acierte o no, y
  «Repasar mis errores (N)» deja en pantalla solo las falladas de ese módulo.
- **Transición de carga (35).** Elegir un módulo ya no salta de una zona vacía a una llena:
  hay una transición que dura **lo que tarda la carga de verdad**, con un piso de 400 ms
  para que no parpadee, y que avisa si la carga se pasa de lo normal. **Sin barra de
  progreso, y no por omisión**: la respuesta llega por partes y sin cabecera de largo, así
  que no hay porcentaje honesto que mostrar.

El resultado esperado de la épica se cumple: una página de estudio a ritmo propio donde el
estudiante elige qué módulo practicar, el sitio recuerda dónde quedó, explica cada respuesta
y permite repasar solo los errores.

**Las tres ADR de la épica** —ADR-032, ADR-033 y ADR-034, con sus actualizaciones— siguen
vigentes y ninguna quedó sin efecto. La 35 no abrió ninguna nueva: no pide nada al extremo,
no cambia el formato guardado y no mueve el alcance de ADR-009.

**Lo que la épica no entregó, y está anotado:** «borrar todo el avance» de una vez, que el
autor decidió el 2026-09-15 evaluar con el uso; la coordinación entre dos pestañas del mismo
módulo, declarada como límite en ADR-034; y hacer la carga **más rápida**, que es trabajo de
la épica 50, iteración 53. Todo eso vive en `_planmaestro/00_producto/registro_log.md`.
