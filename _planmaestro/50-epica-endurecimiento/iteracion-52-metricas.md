# Iteración 52 · Métricas

**Épica:** 50 · Endurecimiento y observabilidad
**Estado:** ⚪ No iniciada
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

- [ ] Elegir el mecanismo de métricas y justificar que no identifica personas ni
      exige consentimiento.
- [ ] Documentarlo como ADR.
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

_Pendiente._
