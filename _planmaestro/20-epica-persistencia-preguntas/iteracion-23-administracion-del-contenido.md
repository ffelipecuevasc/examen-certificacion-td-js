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

## Dependencia de la iteración 24, anotada el 2026-09-05 antes de empezar

Se mantiene el orden **23 y después 24**, por decisión del autor. La consecuencia se
escribe aquí para que no aparezca al final como un olvido.

**La herramienta de administración se construye y se prueba contra diez filas de
juguete.** El banco real se carga en la iteración 24, así que todo lo que esta
iteración demuestre —editar una pregunta, cargar un lote, rechazar contenido
inválido, registrar la fecha de modificación— se demuestra sobre un banco de ejemplo
y contra la base local o la de pruebas. Es el mismo riesgo asumido que ADR-024 dejó
escrito para la iteración 22, y vale igual aquí: con diez filas se prueba que el
mecanismo existe, no que aguante el banco real.

**Y hay una cosa que directamente no se puede cerrar en esta iteración:** el
procedimiento en un solo bloque que encarga ADR-023 —editar, exportar
`d1/respaldo-banco.sql`, regenerar la instantánea, publicar— **no se puede recorrer de
punta a punta**, porque su último tramo toca producción y producción no tiene ni
esquema ni banco hasta la 24. El bloque se escribe aquí; se **camina** allá.

De ahí sale una dependencia explícita sobre dos criterios de esta iteración:

| Criterio | Qué sí se cierra aquí | Qué queda dependiendo de la 24 |
|---|---|---|
| «El autor puede corregir una pregunta y ver el cambio en el sitio sin publicar el repositorio» | Que el mecanismo escribe en la base y que el sitio lee el cambio sin ningún despliegue, comprobado contra la base local o la de pruebas | Que ocurra sobre el **sitio publicado y el banco real**. Hoy `main` está retenido y producción está vacía |
| «La instantánea queda actualizada tras una edición, y se demuestra» | Que editar dispara la regeneración y que el archivo cambia, con su sello | Que la instantánea regenerada sea la del **banco real**, generada desde producción. Es el mismo criterio que la iteración 22 ya aplazó a la 24 |

**Cómo se cierra sin trampa.** Los dos criterios se marcan en esta iteración con la
evidencia que sí existe —el mecanismo, sobre el banco de juguete— y con el tramo
pendiente nombrado en la propia casilla, igual que se hizo en la 22. El recorrido
completo del procedimiento es la última tarea de la iteración 24, junto con la
publicación.

**Lo que no vale**: dar por comprobado el bloque de ADR-023 porque esté escrito. Un
procedimiento que nadie ha recorrido entero es una hipótesis con formato de lista, y
esta es exactamente la ADR que se advirtió a sí misma que quedaría incumplida sin que
nadie lo notara.

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
