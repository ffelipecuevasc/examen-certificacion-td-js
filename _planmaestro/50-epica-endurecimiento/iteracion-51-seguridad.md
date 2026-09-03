# Iteración 51 · Seguridad

**Épica:** 50 · Endurecimiento y observabilidad
**Estado:** ⚪ No iniciada
**Depende de:** épica 10

## Objetivo

Aplicar la protección que ofrece el plan gratuito de Cloudflare y endurecer las
cabeceras del sitio.

## Contexto

Con la capa de datos en producción, la superficie de ataque ya no es la de un sitio
estático. Los riesgos reales son tres: la inyección de contenido a través del banco
de preguntas, el consumo abusivo del Worker de lectura —que puede agotar los límites
del plan gratuito y dejar sin servicio a los estudiantes— y la exposición
involuntaria de algún extremo de escritura, que ADR-009 prohíbe.

La política de seguridad de contenido merece cuidado: el sitio carga tipografías
externas y, según lo decidido en la épica 10, puede consultar una fuente de datos
externa. Una política mal calibrada rompe el sitio en silencio.

## Tareas

- [ ] Definir y aplicar las cabeceras de seguridad, incluida una política de
      seguridad de contenido ajustada a lo que el sitio realmente carga.
- [ ] Verificar que la política no rompe las tipografías, los módulos ES ni el
      acceso a la fuente de datos.
- [ ] Activar las protecciones pertinentes del plan gratuito y documentar cuáles y
      por qué.
- [ ] Revisar que ninguna protección afecte al estudiante legítimo: nada que
      introduzca verificaciones intrusivas contradice el principio de cero fricción.
- [ ] Aplicar límites de tasa al Worker de lectura, calibrados para no estorbar a un
      estudiante real.
- [ ] Verificar que ningún extremo de escritura es alcanzable públicamente, según
      ADR-009.
- [ ] Revisar que el Worker no filtre detalles internos en sus mensajes de error.
- [ ] Cerrar el hallazgo H-006 añadiendo licencia propia y atribución de terceros.
- [ ] Documentar toda la configuración manual en `90-manual/`.

## Criterios de aceptación

- [ ] Las cabeceras de seguridad están activas y se muestran las respuestas que lo
      confirman.
- [ ] Con la política aplicada, ambas páginas funcionan sin errores de consola.
- [ ] Las protecciones activadas están documentadas con su motivo.
- [ ] Un estudiante puede entrar y estudiar sin ninguna verificación intermedia.
- [ ] El límite de tasa rechaza un consumo abusivo simulado y no afecta a un uso
      normal: se demuestran ambos casos.
- [ ] Un recorrido de los extremos del Worker confirma que ninguno permite escribir
      sin autorización.
- [ ] Un error provocado en el Worker no revela estructura interna ni consultas.
- [ ] El repositorio declara su licencia y atribuye a los terceros que usa.
- [ ] La configuración manual está documentada con el detalle suficiente para
      reconstruirla.

## Notas de la iteración

_Pendiente._
