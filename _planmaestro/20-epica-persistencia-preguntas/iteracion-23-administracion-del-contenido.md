# Iteración 23 · Administración del contenido

**Épica:** 20 · Persistencia de preguntas
**Estado:** ⚪ No iniciada
**Depende de:** iteración 22

## Objetivo

Resolver cómo el autor edita 300 preguntas sin tocar el repositorio ni escribir SQL
a mano, cumpliendo ADR-009: **sin ningún extremo de escritura expuesto al público**.

## Por qué esta iteración existe

Es el costo real del cambio de hoja de cálculo a base de datos. Una planilla trae
la edición incluida; una base de datos, no. Si esta iteración se salta, el proyecto
termina con un banco que solo puede modificarse escribiendo consultas, que es peor
que la situación de partida.

El escenario a resolver es concreto: el autor detecta una errata desde el teléfono,
en el metro, y quiere corregirla en un minuto.

## Decisión a cerrar

Hay al menos tres caminos, y ninguno es evidentemente mejor:

- **Importación desde archivo.** Se mantiene una fuente en texto o planilla y un
  comando la vuelca a D1. Simple de construir, pero conserva el ciclo de
  desarrollador que motivó todo este cambio.
- **Panel de administración protegido.** Una página aparte, autenticada, con
  escritura desde el navegador. Es lo más cómodo y lo que resuelve el escenario del
  metro, pero introduce autenticación y una superficie que hoy no existe.
- **Herramienta de línea de comandos.** Control total, cero superficie pública,
  pero solo utilizable desde el computador del autor.

Evalúa cada uno contra el escenario real de uso y contra ADR-009. Si eliges el
panel, la autenticación es parte del alcance de esta iteración, no un pendiente.

## Tareas

- [ ] Resolver el mecanismo de administración y documentarlo como ADR, con las
      alternativas descartadas.
- [ ] Implementar el mecanismo elegido.
- [ ] Si implica autenticación: que ninguna credencial quede en el repositorio y que
      el acceso no dependa de que la dirección sea secreta.
- [ ] Validar el contenido **antes** de escribirlo en la base, con las mismas reglas
      que la iteración 22 aplica al leer.
- [ ] Permitir carga por lotes: escribir 200 preguntas de a una no es viable.
- [ ] Registrar cuándo se modificó cada pregunta, para poder auditar cambios.
- [ ] Regenerar la instantánea de ADR-008 como parte del flujo de edición, o el
      respaldo quedará desfasado en silencio.
- [ ] Documentar el procedimiento en `90-manual/`, escrito para alguien que solo va
      a editar preguntas y no va a tocar el repositorio.

## Criterios de aceptación

- [ ] El autor puede corregir una pregunta existente y ver el cambio en el sitio sin
      publicar el repositorio.
- [ ] El autor puede cargar un lote de preguntas nuevas de una sola vez.
- [ ] Ningún extremo de escritura es accesible sin autorización: se demuestra
      intentando escribir sin credenciales y mostrando el rechazo.
- [ ] Un intento de cargar contenido inválido es rechazado antes de tocar la base, y
      el motivo se comunica de forma comprensible.
- [ ] La instantánea queda actualizada tras una edición, y se demuestra.
- [ ] Existe registro de la fecha de modificación de cada pregunta.
- [ ] La decisión está publicada como ADR con sus alternativas descartadas.
- [ ] El manual permite editar el banco a alguien sin conocimientos técnicos.

## Notas de la iteración

_Pendiente._
