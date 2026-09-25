# Iteración 52 · Métricas

**Épica:** 50 · Endurecimiento y observabilidad
**Estado:** ⚪ No iniciada · su primera tarea se resolvió por adelantado el 2026-09-25 (ADR-036)
**Depende de:** épica 10

## Objetivo

Obtener visibilidad del uso del sitio sin romper la promesa de cero fricción ni
rastrear a ninguna persona.

## Contexto

El autor necesita saber si el material se usa, cuándo se usa —probablemente se
dispara antes de cada fecha de examen— y desde qué dispositivos, para priorizar. Lo
que **no** necesita es saber qué hizo cada estudiante.

`vision.md` es explícita: sin banner de consentimiento y sin analítica que rastree
individuos. Existen formas de medir tráfico agregado que no usan cookies ni
identificadores persistentes, y por tanto no requieren consentimiento. Elige una y
argumenta por qué cumple.

## Tareas

- [x] Elegir el mecanismo de métricas y justificar que no identifica personas ni
      exige consentimiento. _Resuelta el 2026-09-25, antes de que la iteración empezara: Cloudflare Web
      Analytics, que se encontró activo en producción. Ver las notas._
- [x] Documentarlo como ADR. _ADR-036, 2026-09-25._
- [ ] Aplicarlo a ambas páginas y al simulacro.
- [ ] Definir qué preguntas debe poder responder el autor con esas métricas.
- [ ] Añadir una nota de privacidad honesta y breve, acorde al tono del sitio.
- [ ] Documentar dónde se consultan las métricas y cómo se leen.

## Criterios de aceptación

- [ ] Las métricas registran visitas y se muestra evidencia de al menos una.
- [ ] No se instalan cookies ni identificadores persistentes: se demuestra
      inspeccionando el almacenamiento del navegador.
- [ ] El sitio sigue sin mostrar ningún banner de consentimiento.
- [ ] La ADR explica por qué el mecanismo elegido respeta la visión.
- [ ] Existe una nota de privacidad accesible desde el pie.
- [ ] Está documentado qué preguntas responde el panel de métricas.

## Notas de la iteración

### Antes de empezar · 2026-09-25 · el mecanismo ya estaba elegido, por la plataforma

**La primera tarea de esta iteración quedó resuelta antes de que la iteración empezara formalmente**, y no por
planificación: Cloudflare Web Analytics **ya estaba activo** en producción, inyectado por Cloudflare en cada página
publicada. Lo descubrió la política de contenido de la iteración 51, publicada en modo informe, cuando Chrome registró
que el beacon de `static.cloudflareinsights.com` violaba `script-src 'self'`. **Decisión del autor, 2026-09-25:** se
queda activo y se adopta como el mecanismo de esta iteración. Motivo: no usa cookies y coincide con `vision.md`.

**Lo que se hizo, y nada más:** ADR-036 lo documenta, con la comprobación hecha en un navegador limpio y no tomada del
proveedor: 0 cookies de cualquier dominio, 0 entradas en los cuatro almacenamientos del navegador, un `pageloadId`
distinto en cada carga, y un control positivo que demuestra que la inspección ve. La política de contenido de
`_headers` ganó los dos orígenes de Web Analytics, y la nota de privacidad de `acerca-de.html` lo nombra.

**Lo que sigue pendiente, para cuando le toque a esta iteración:**

- Definir qué preguntas debe responder el panel para el autor.
- Aplicarlo formalmente a las páginas y al simulacro. Hoy la plataforma lo inyecta en todas las páginas publicadas,
  pero nadie decidió todavía si eso es lo que se quiere, página por página.
- Documentar dónde se consultan las métricas y cómo se leen.
- Revisar la nota de privacidad cuando el resto esté decidido.

**Evidencia que ya existe y que esta iteración puede usar para sus criterios:** la inspección del almacenamiento de
ADR-036 (criterio de «no se instalan cookies ni identificadores persistentes»), y que el sitio sigue sin banner. Se
reúsa al cerrar, no se da por cerrada ahora.
