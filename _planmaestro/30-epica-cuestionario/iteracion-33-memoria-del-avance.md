# Iteración 33 · Memoria del avance

**Épica:** 30 · Cuestionario **Estado:** ⚪ No iniciada **Depende de:** iteración 32 cerrada

## Objetivo

Que el cuestionario recuerde, módulo por módulo, lo que el estudiante respondió; que el índice muestre ese avance en los
siete módulos a la vez; y que ese recuerdo **nunca afirme algo que el banco ya no sostiene**.

## Contexto

Nadie responde 368 preguntas de una sentada. Sin memoria, cada visita empieza de cero y el banco grande se vuelve un
obstáculo en vez de una ventaja.

`vision.md` deja fuera las cuentas de usuario, así que la memoria vive en el navegador del estudiante. Eso tiene
consecuencias que hay que asumir y decir: no se comparte entre dispositivos y se pierde al limpiar los datos del
navegador.

## Lo que cambió respecto de como se escribió esta iteración

_Reescrito el 2026-09-15 por decisión del autor._

La iteración original juntaba ocho frentes: memoria, índice con avance, aviso de pérdida, justificación, repaso, borrar
el avance, cambios del banco y una transición de carga. La 32 tenía la mitad y necesitó una ronda de corrección. **Se
partió en tres:**

| #  | Iteración              | Qué se lleva                              |
|----|------------------------|-------------------------------------------|
| 33 | Memoria del avance     | Esta                                      |
| 34 | Justificación y repaso | La justificación visible y el modo repaso |
| 35 | Transición de carga    | El indicador al cargar un módulo          |

La orientación en la portada, que era la 34, pasa a ser la **36**.

**Dos cosas que a primera vista iban a la 34 se quedan aquí, y no es un descuido:**

- **Qué pasa si el banco cambia.** El riesgo existe desde el primer día en que se guarda algo, no desde que existe el
  repaso. Publicar la memoria sin resolverlo bastaría para que una corrección del banco le dijera a un estudiante
  «acertaste» sobre una respuesta que ya no es la correcta.
- **Que «Reiniciar el módulo» borre lo guardado.** Es el único control de borrado que va a existir. Si esta iteración
  guarda y el botón solo limpia la pantalla, el estudiante reinicia, recarga y le vuelve todo: un botón que miente.

## Lo que hereda de la 32

- **El índice es el único control** para elegir módulo, marca el módulo **al pedirlo**
  y, al terminar de cargar, el sitio lleva el foco y el desplazamiento a la cabecera del módulo (ADR-032, actualización
  del 2026-09-15).
- **«Reiniciar el módulo» ya vuelve a la cabecera** y respeta `prefers-reduced-motion`. Se adelantó en la 32 y está
  anotado en sus notas: aquí no es pendiente.
- **`/api/preguntas?resumen=1`** (ADR-033): siete filas, unos 0,9 KB. En producción, el 2026-09-15, respondió con
  `filas_leidas: 1111`.

## Decisiones tomadas

### 1 · El aviso de pérdida se retira

Decidido por el autor el 2026-09-15. Existía porque cambiar de módulo perdía lo respondido. Con memoria ya no pierde
nada, y un aviso que no protege de nada entrena a ignorar los avisos, que es el mismo argumento con que la 31 decidió no
mostrarlo cuando no hay nada que perder. **Se retira entero**, junto con lo que solo existía para él.

### 2 · Un solo control de borrado: «Reiniciar el módulo»

Decidido por el autor el 2026-09-15. **No hay un «borrar todo el avance».** Quien quiera empezar de cero lo hace módulo
por módulo. Reiniciar borra la pantalla **y** lo guardado de ese módulo, y no toca los otros seis.

Si el uso muestra que los estudiantes necesitan borrar todo de una vez, se evalúa después: queda anotado en
`registro_log.md`, no se adelanta.

### 3 · Qué se guarda: la pregunta por su id, la alternativa elegida por su texto

Por cada módulo, y por cada pregunta respondida, se guarda **el id de la pregunta** y **el texto de la alternativa
elegida**. **Nunca se guarda el veredicto** —acertó o falló—: se recalcula contra el banco vigente cada vez que se
restaura.

**Por qué el id de la pregunta sí sirve.** ADR-020: ninguna pregunta se borra, se retira, así que su id es estable de
por vida.

**Por qué el id de la alternativa no sirve, aunque viaja al navegador.** Comprobado en
`scripts/administrar-banco.mjs`: `banco:actualizar` **borra las cuatro alternativas y las vuelve a insertar**, y el
propio comentario lo dice —«cambian de id, y eso no importa»—. Para el banco no importa. Para la memoria sería fatal:
cualquier corrección, aunque sea una coma del enunciado, dejaría huérfano todo lo guardado sobre esa pregunta.

**Por qué el texto.** Es la lección de la iteración 25, cuando se comprobó la carga anclando en el texto de la correcta
y no en su letra ni en su índice: el texto es lo único que ninguna regla de conversión, ni ningún reemplazo de filas,
puede falsear.

**Consecuencia aceptada.** Si el autor corrige el texto de una alternativa que un estudiante había elegido, esa
respuesta deja de coincidir con nada y la pregunta vuelve a quedar sin responder. **Se pierde una respuesta; no se
afirma nada falso.** Entre las dos fallas posibles, esta es la que el proyecto elige.

### 4 · Las cifras del índice son exactas sin abrir ningún módulo

Decidido por el autor el 2026-09-15: alternativa (a). `?resumen=1` pasa a traer también **los ids de las preguntas
activas de cada módulo**. Así el índice cuenta, en los siete módulos, cuántas respuestas guardadas corresponden a
preguntas que siguen activas, sin traerse ninguna pregunta.

**Enmienda ADR-033**, no la sustituye: sigue siendo lectura, sigue en el mismo extremo y por el mismo motivo. **ADR-009
no se mueve.**

**Descartada · (b) mostrar lo guardado y corregirlo al abrir el módulo.** Más simple, pero tras un cambio del banco el
índice mostraría una cifra falsa hasta que el estudiante abriera ese módulo. Contradice la regla que el proyecto
sostiene desde la 24:
ningún número que no salga de un dato.

### 5 · El formato queda en una ADR, con versión dentro del dato

Una ADR nueva —ADR-034, si ese número sigue libre— documenta qué se guarda, bajo qué nombre y con qué versión. Lo
guardado en el navegador de un estudiante sobrevive a cualquier despliegue: el día que el formato cambie, el sitio tiene
que reconocer una versión vieja en vez de leerla mal.

## Lo que queda a criterio de quien implemente

El mecanismo de almacenamiento del navegador, los nombres de las claves y cómo se dibuja el avance en cada fila del
índice. Con dos condiciones: la cifra del índice se entiende sin color, y el nombre accesible de la fila la dice, porque
bajo `lg` el título del módulo se esconde.

## Tareas

- [ ] Guardar las respuestas por módulo y restaurarlas al volver a ese módulo, con las preguntas respondidas dibujadas
  como respondidas y las tres barras al día.
- [ ] Recalcular cada veredicto contra el banco vigente al restaurar.
- [ ] Ampliar `?resumen=1` con los ids de las preguntas activas por módulo, también en el modo degradado desde la
  instantánea, y enmendar ADR-033.
- [ ] Hacer que el índice muestre el avance de los siete módulos a partir de lo guardado y de esos ids.
- [ ] Retirar el aviso de pérdida y lo que existía solo para él.
- [ ] Hacer que «Reiniciar el módulo» borre también lo guardado de ese módulo.
- [ ] Explicar en la propia página que el avance vive solo en ese dispositivo.
- [ ] Hacer que el sitio siga funcionando, y lo diga, si el navegador no permite guardar.
- [ ] Documentar el formato en la ADR nueva.
- [ ] Anotar en `registro_log.md` el «borrar todo el avance» como idea a evaluar con el uso, no como pendiente.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no razonando sobre el código.

### Los provoca Claude Code

- [ ] **Lo respondido sobrevive a una recarga.** Se responden preguntas de un módulo, se recarga, se vuelve a ese
  módulo: las mismas preguntas aparecen respondidas, con la misma alternativa, y las tres barras dicen lo mismo que
  antes de recargar.
- [ ] **Cambiar de módulo no pierde nada.** Se responde en el 3, se salta al 5 y se vuelve al 3: todo sigue ahí.
- [ ] **El aviso de pérdida ya no existe.** Saltar con respuestas dentro cambia de módulo directo, y ningún archivo del
  sitio ni del guion lo sigue mencionando como vigente.
- [ ] **Una corrección del banco no deja un veredicto falso.** En la base local se cambia la alternativa correcta de una
  pregunta ya respondida, con `banco:actualizar`: al restaurar, el veredicto sale del banco nuevo, no del guardado.
- [ ] **Una corrección de texto no deja la respuesta colgando de nada.** Se cambia el texto de la alternativa elegida:
  la pregunta vuelve a quedar sin responder, y ninguna barra la sigue contando.
- [ ] **Una pregunta retirada deja de contar**, en el módulo y en el índice, sin error.
- [ ] **El índice es exacto en los siete módulos sin abrirlos.** Tras provocar una pregunta retirada en un módulo que no
  está abierto, su fila del índice ya no la cuenta.
- [ ] **`?resumen=1` sigue siendo barato.** Se miden bytes y `filas_leidas` antes y después de agregar los ids, y se
  informan las dos cifras.
- [ ] **Reiniciar borra solo lo suyo.** Se reinicia el 3 con respuestas guardadas en el 3 y en el 5, se recarga: el 3
  está en cero y el 5 conserva todo.
- [ ] **Sin almacenamiento, el sitio sigue sirviendo.** Con el almacenamiento del navegador inutilizado, se puede elegir
  módulo y responder, sin errores, y la página dice que el avance no se está guardando.
- [ ] **Un formato de otra versión no se lee mal.** Se deja guardado un dato con una versión distinta: el sitio no lo
  interpreta como vigente, y el comportamiento está escrito en la ADR.
- [ ] **El escapado sigue en pie.** `npm run probar:escapado` a escala.

### Los comprueba el autor en el navegador

- [ ] **La página declara que el avance es local a ese dispositivo**, en un lugar donde se lee sin buscarlo.
- [ ] **El índice muestra el avance de cada módulo** y se entiende en escala de grises.
- [ ] **En teléfono**, responder, recargar y volver conserva todo, y el índice con avance no empuja el estado vacío
  fuera de alcance.
- [ ] **Con teclado**, reiniciar deja el foco en un lugar razonable.
- [ ] **Sin errores de consola** con cualquier módulo cargado y tras recargar.
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que el avance se comparta entre dispositivos**, ni que sobreviva a limpiar los datos del navegador. Es la
  consecuencia asumida de no tener cuentas.
- **Que dos pestañas abiertas a la vez no se pisen.** Se asume que gana la última que guarda.
- **Que en modo degradado el veredicto coincida con el de la base.** Se recalcula contra la instantánea, que puede estar
  desfasada; el aviso de ADR-008 ya lo declara.
- Que responder mal enseñe algo: la justificación es de la 34.
- Que se pueda repasar solo lo fallado: el repaso es de la 34.

## Notas de la iteración

_Pendiente._