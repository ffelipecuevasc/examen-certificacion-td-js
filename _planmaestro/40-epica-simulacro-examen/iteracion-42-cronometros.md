# Iteración 42 · Cronómetros

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 41

## Objetivo

Implementar los dos cronómetros: el total de 60 minutos y el de 30 segundos por
pregunta, con avance automático al agotarse este último.

## Decisiones que esta iteración debe cerrar

Hay dos preguntas de diseño sin respuesta previa. Resuélvelas y déjalas anotadas
como ADR:

1. **El tiempo sobrante.** Si el estudiante responde en 10 segundos, ¿los 20
   restantes se pierden o se acumulan al total? Ambas opciones son defendibles;
   la elegida cambia por completo la sensación del simulacro.
2. **El cronómetro en segundo plano.** Si el estudiante cambia de pestaña, ¿el
   tiempo sigue corriendo? Conviene además no confiar solo en el temporizador del
   navegador, que se ralentiza en pestañas ocultas.

## Tareas

- [ ] Cronómetro total de 60 minutos, visible durante todo el intento.
- [ ] Cronómetro de 30 segundos por pregunta, llamativo e interactivo.
- [ ] Avance automático a la siguiente pregunta al agotarse los 30 segundos.
- [ ] Señal visual clara cuando el tiempo de la pregunta se acaba.
- [ ] Resolver el tratamiento del tiempo sobrante y documentarlo como ADR.
- [ ] Resolver el comportamiento en segundo plano y documentarlo como ADR.
- [ ] Fin del intento al agotarse el tiempo total, aunque queden preguntas.
- [ ] Respetar la preferencia de movimiento reducido en las animaciones del
      cronómetro.

## Criterios de aceptación

- [ ] Ambos cronómetros son visibles y avanzan de forma coherente entre sí.
- [ ] Al agotarse los 30 segundos, se pasa solo a la siguiente pregunta y la
      anterior queda registrada como no respondida.
- [ ] Al agotarse los 60 minutos, el intento termina y lleva al resumen.
- [ ] El tratamiento del tiempo sobrante está implementado y documentado en una ADR.
- [ ] Tras dejar la pestaña en segundo plano un minuto, el tiempo mostrado al volver
      es correcto según la ADR, y se demuestra.
- [ ] La cuenta regresiva es perceptible sin depender solo del color.
- [ ] Con movimiento reducido activado, el cronómetro sigue siendo comprensible sin
      animaciones.

## Notas de la iteración

_Pendiente._
