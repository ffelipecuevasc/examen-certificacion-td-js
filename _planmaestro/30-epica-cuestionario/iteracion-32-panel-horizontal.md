# Iteración 32 · Rediseño del panel fijo

**Épica:** 30 · Cuestionario
**Estado:** 🔵 En curso · comenzada el 2026-09-11

## Objetivo

Reorganizar la mitad izquierda de `cuestionario.html`: las tres barras de progreso
pasan de vertical a **horizontal**, ocupando todo el ancho disponible de su panel, y
el espacio liberado se aprovecha para orientar mejor al estudiante.

## Contexto

Las barras verticales funcionan, pero desperdician el ancho del panel y limitan la
información que cabe. En horizontal, cada barra puede llevar su etiqueta, su cifra y
su porcentaje en la misma línea, y queda espacio para un índice de módulos.

Se mantienen los colores actuales: amarillo para el avance, ruby para los errores y
esmeralda para los aciertos.

## Lo que cambió respecto de como se escribió esta iteración

_Reescrito el 2026-09-11, antes de arrancar, por decisión del autor. Este archivo se
redactó **antes que la iteración 31**, así que no sabía del selector de módulo ni del
filtrado, y daba por disponible un dato que no existe._

**El índice se parte en dos mitades.** Decía «un índice de los siete módulos con el avance
de cada uno». Eso no se puede cumplir todavía, y el motivo no es de implementación: **el
avance no se guarda hasta la iteración 33**, y cambiar de módulo lo pierde. En cualquier
instante, como mucho un módulo tiene avance —el que está en pantalla— y los otros seis
están en cero.

Y seis ceros no serían una omisión, serían una afirmación falsa: si el estudiante responde
20 preguntas del módulo 3 y salta al 5, el índice diría «Módulo 3 — 0 %». Eso no es «sin
empezar», es «lo perdiste», y la iteración 31 se tomó el trabajo de avisar antes justamente
para que esa pérdida no fuera silenciosa.

Así que esta iteración entrega el índice como **control y orientación** —los siete módulos,
su nombre, cuántas preguntas tiene cada uno, y saltar— y **la iteración 33 lo hereda y lo
llena con el avance real**, que es cuando tendrá de dónde sacarlo. Queda anotado en las dos.

**El índice reemplaza al selector.** Si el índice permite saltar y vive en el mismo panel,
hay dos controles para lo mismo a tres centímetros. El índice es el único, y es mejor
control: muestra los siete estados a la vez en vez de esconder seis. ADR-032 se actualizó
con esto — **el sitio no cambia, cambia la forma del control**, y hay que reponer a mano lo
que el `<select>` daba gratis.

**Los siete conteos entran por ADR-033.** La iteración 31 decidió «sin número hasta que sea
cierto», y funcionaba porque el selector muestra un módulo a la vez. Con los siete a la
vista, o están las siete cifras o hay una y seis huecos. Los conteos vienen de
`/api/preguntas?resumen=1`, que es trabajo **de esta iteración**.

## Tareas

- [x] Convertir las tres barras a formato horizontal, a todo el ancho del panel.
- [x] Conservar los colores y los íconos ya asociados a cada barra.
- [x] Implementar `?resumen=1` en `/api/preguntas` según ADR-033, con sus reglas: se
      compone con `?modulo=N`, y cualquier valor distinto de `1` es `PETICION_INVALIDA`.
- [x] Añadir el índice de los siete módulos, con su nombre y cuántas preguntas tiene
      cada uno, que sirva para saltar a ese módulo.
- [x] Retirar el selector de la iteración 31: el índice queda como control único.
- [x] Hacer que el salto desde el índice pase por **la misma puerta** que el aviso de
      pérdida de avance de la iteración 31. Si el índice cambia de módulo por su
      cuenta, el aviso se esquiva sin que nadie lo note.
- [x] Reponer a mano lo que el `<select>` daba gratis: `aria-current` en el módulo
      activo, orden de tabulación sensato y un nombre accesible por fila que diga el
      módulo y su cantidad.
- [ ] Revisar el comportamiento del panel en pantallas de altura reducida: con más
      contenido, el panel fijo puede no caber.
- [x] Asegurar que la información no dependa solo del color: cada barra debe ser
      comprensible en escala de grises.
- [x] Comprobar el modo degradado con el resumen: los siete conteos salen de la
      instantánea, con el aviso de ADR-008 visible **al abrir**, no al elegir.
- [x] Añadir a `scripts/probar-filtrado.mjs` la comparación del conteo del resumen
      contra el dibujado, que ADR-033 exige para que una discrepancia no sea silenciosa.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no
razonando sobre el código.

- [ ] **Las tres barras son horizontales** y ocupan el ancho del panel.
- [x] **Cada barra muestra su etiqueta, su cifra absoluta y su porcentaje.**
- [x] **El índice muestra los siete módulos con su cantidad real de preguntas:** 52, 61,
      61, 49, 52, 48 y 45. Se comprueba sobre lo dibujado y contra la base, no contra la
      respuesta del extremo.
- [x] **El índice es el único control.** El selector ya no está, y desde el índice se
      llega a los siete módulos. Se recorren los siete.
- [x] **Saltar desde el índice avisa igual que avisaba el selector.** Se provocan los dos
      casos: saltar con preguntas respondidas, y saltar sin ninguna. Si el aviso se puede
      esquivar por este camino, el criterio falla.
- [ ] **El índice dice cuál es el módulo activo**, y el teclado lo alcanza, lo recorre y
      puede saltar sin ratón.
- [x] **`?resumen=1` devuelve las siete filas y no devuelve preguntas.** Se comprueba
      también lo que pesa, comparado contra `/api/preguntas` sin filtrar.
- [x] **`?resumen=` con un valor distinto de `1` responde `PETICION_INVALIDA`**, no el
      banco entero. Se provoca.
- [x] **El conteo del resumen coincide con el dibujado, módulo a módulo**, y el guion da
      rojo si difieren. Se provoca la divergencia para comprobar que la detecta.
- [x] **El modo degradado trae los siete conteos** desde la instantánea, y el aviso de
      ADR-008 se ve **al abrir la página**, encima del estado vacío.
- [ ] **En una ventana de 700 píxeles de alto, el panel sigue siendo usable**: se
      demuestra con captura o descripción del comportamiento.
- [ ] **En pantallas bajo el punto de corte de escritorio, el panel se apila sin
      romperse**, y el índice cabe sin empujar el estado vacío fuera de alcance.
- [ ] **Una captura en escala de grises** permite distinguir qué representa cada barra.
- [x] **El diseño mantiene la identidad del sitio:** no se introducen colores fuera de la
      paleta ya establecida.
- [ ] **Sin errores de consola** con cualquier módulo cargado.
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que el índice muestre el avance de cada módulo.** No lo muestra: no hay avance que
  mostrar hasta que exista memoria. Es la iteración 33, que hereda este índice y lo llena.
- Que el estudiante recupere lo respondido al volver a un módulo. Sigue perdiéndose, y por
  eso el aviso de la iteración 31 sigue siendo necesario y tiene que cubrir también el
  salto desde el índice.
- Que responder mal enseñe algo. La justificación visible es de la 33.

## Notas de la iteración

_Pendiente._
