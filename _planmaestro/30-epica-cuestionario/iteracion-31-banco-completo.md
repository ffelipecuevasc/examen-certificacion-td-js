# Iteración 31 · Banco completo y renderizado por módulo

**Épica:** 30 · Cuestionario
**Estado:** ⚪ No iniciada
**Depende de:** épica 20 cerrada

## Objetivo

Que `cuestionario.html` muestre las ~300 preguntas del banco sin que la página se
sienta pesada al abrirse.

## Contexto

Hoy la página dibuja las 105 preguntas de una sola vez al cargar. Con el triple de
contenido, ese enfoque castiga sobre todo a quien estudia desde el teléfono con
conexión modesta, que es parte del público objetivo descrito en `vision.md`.

## Tareas

- [ ] Consumir el banco completo desde la fuente definida en la épica 20.
- [ ] Evitar dibujar todas las preguntas de una vez. La estrategia queda a tu
      criterio: renderizado por módulo, carga diferida al desplazarse, o la que
      consideres mejor. Justifica la elegida.
- [ ] Mantener el agrupamiento por módulo y las cabeceras fijas ya existentes.
- [ ] Mantener el barajado de alternativas y el respeto por la marca de orden fijo.
- [ ] Verificar que el escapado sigue aplicándose a todo el contenido del banco.

## Criterios de aceptación

- [ ] Las preguntas visibles en la página coinciden en número con las válidas del
      banco.
- [ ] La página queda utilizable en menos de dos segundos en una conexión lenta
      simulada, y se muestra la medición.
- [ ] Al desplazarse por los siete módulos, todas las preguntas terminan
      disponibles.
- [ ] La estrategia de renderizado elegida está justificada por escrito.
- [ ] Sin errores de consola con el banco completo.
- [ ] La navegación con teclado alcanza las preguntas que se incorporan después de
      la carga inicial.

## Notas de la iteración

_Pendiente._
