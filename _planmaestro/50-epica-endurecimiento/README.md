# Épica 50 · Endurecimiento y observabilidad

**Estado:** ⚪ No iniciada
**Depende de:** épicas 10, 20, 30 y 40

Épica de cierre del proyecto.

## Problema

La épica 10 dejó el sitio publicado y la capa de datos funcionando, pero sin
afinar: sin cabeceras de seguridad, sin política de caché, sin protección del Worker
frente al abuso y sin ninguna visibilidad del uso. El autor no sabe cuántos
estudiantes usan el material, desde dónde ni con qué dispositivos.

Con Workers y D1 en producción, esta épica pasa a cubrir algo que en el plan
anterior no existía: proteger una capa de datos que puede consumirse en exceso y que
tiene límites de uso en el plan gratuito.

## Resultado esperado

El sitio y su capa de datos endurecidos, usando solo funcionalidades del plan
gratuito, con métricas de tráfico que respeten el principio de cero fricción.

## Tensión con la visión

`vision.md` prohíbe analítica que rastree individuos y banners de consentimiento.
Esto no impide medir: existen formas de conocer el tráfico agregado sin identificar
personas ni requerir consentimiento. La iteración 43 debe elegir una que permita
mantener la promesa hecha al estudiante, y dejarlo por escrito.

## Alcance

- Cabeceras de seguridad y reglas de protección del plan gratuito.
- Protección del Worker de datos frente al consumo abusivo.
- Vigilancia de los límites de uso del plan gratuito (ver hallazgo H-008).
- Métricas de tráfico agregadas, sin rastreo de personas.
- Política de caché, tanto de los archivos del sitio como de las respuestas del
  Worker.

## Fuera de alcance

- Funcionalidades de pago.
- Ampliar el rol del Worker más allá de servir datos en lectura: lo prohíbe ADR-007.

## Iteraciones

| # | Iteración | Estado |
|---|---|---|
| 51 | Seguridad | ⚪ No iniciada |
| 52 | Métricas | ⚪ No iniciada |
| 53 | Caché y rendimiento | ⚪ No iniciada |

**Y una iteración final, todavía sin número ni alcance.** Anotada el 2026-09-22, al cerrar
la épica 40: va a hacer falta una iteración aquí para atender la **retroalimentación real
de estudiantes** que prueben el sitio publicado. **Qué contendría no se sabe y no se
inventa**: hasta hoy no hay ni una sola observación de uso real, así que escribir su
alcance ahora sería adivinarlo. Se anota para que la ausencia sea una decisión registrada
y no un olvido.

## Nota sobre el reparto de tareas

Buena parte de esta épica se configura en un panel web, no en el repositorio.
Claude Code no tiene acceso a esa consola. Su trabajo aquí es: preparar los archivos
de configuración que sí viven en el repositorio, redactar los procedimientos paso a
paso para que el autor los ejecute, y verificar el resultado desde fuera una vez
aplicados. Lo que se configure a mano debe quedar documentado en `90-manual/`, o se
perderá.
