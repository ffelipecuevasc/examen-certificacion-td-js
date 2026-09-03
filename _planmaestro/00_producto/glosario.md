# Glosario

Términos que aparecen en la documentación y en el código. Sirve para que las
conversaciones con Claude Code sean precisas: cuando se dice «banco», hay una sola
cosa que puede significar.

## Del método de trabajo

**Épica.** Entrega grande con valor propio para el estudiante. Agrupa varias
iteraciones. Tiene una carpeta en `_planmaestro/`.

**Iteración.** Unidad de trabajo acotada, con criterios de aceptación verificables.
Equivale a un sprint. Un archivo por iteración.

**Criterio de aceptación.** Afirmación comprobable que debe ser verdadera para
cerrar una iteración. No es una tarea: es el resultado observable de una tarea.

**Evidencia.** Prueba concreta de que un criterio se cumple: salida de un comando,
fragmento de archivo, resultado de una comprobación. Decir «listo» no es evidencia.

**ADR.** Registro de una decisión de arquitectura, en `decisiones.md`. Cerrada:
solo se revierte con otra ADR posterior que la sustituya.

**Bitácora.** Relato breve de lo ocurrido en una iteración cerrada, en
`99-bitacora/`. Incluye lo que salió distinto de lo planeado.

**Hallazgo.** Problema detectado sobre la marcha, registrado en
`auditoria_tecnica.md`. Se registra aunque se arregle de inmediato.

## Del dominio del producto

**Módulo.** Una de las diez unidades del plan formativo del bootcamp. Los módulos 2
al 8 son los evaluados; el 1, el 9 y el 10 no entran al examen.

**Parte.** Cada uno de los siete bloques en que se divide el examen. La parte 1
corresponde al módulo 2, y así sucesivamente.

**Banco de preguntas.** Conjunto completo de preguntas disponibles. Es la fuente; no
es lo que se muestra.

**Cuestionario.** Práctica sin límite de tiempo con el banco completo, en
`cuestionario.html`. El estudiante avanza a su ritmo.

**Simulacro.** Intento cronometrado que reproduce las condiciones del examen, en
`simulacro.html`. Selecciona un subconjunto del banco.

**Intento.** Una ejecución completa de un simulacro, desde el inicio hasta el
resumen de resultados.

**Alternativa.** Cada una de las cuatro respuestas posibles de una pregunta. No se
le llama «opción».

**Justificación.** Explicación de por qué la alternativa correcta lo es. Se muestra
al responder.

**Orden fijo.** Marca de una pregunta cuyas alternativas no deben barajarse, porque
se refieren entre sí por su letra.

## De la plataforma

**Pages.** Servicio de Cloudflare que publica las páginas del sitio.

**Worker.** Proceso que corre en la red de Cloudflare y responde peticiones. En este
proyecto sirve **solo lectura** del banco de preguntas. No renderiza páginas ni
gestiona sesiones (ADR-007).

**D1.** Base de datos relacional de Cloudflare donde vive el banco de preguntas.

**Extremo.** Cada dirección que el Worker atiende. Se prefiere a «endpoint».

**Instantánea.** Copia del banco de preguntas generada desde D1 y versionada en el
repositorio. Es lo que el sitio usa cuando el Worker no responde (ADR-008). Puede
estar desfasada, y cuando se usa se le avisa al estudiante.

**Capa de datos.** El conjunto Worker más D1. Se usa cuando da lo mismo cuál de los
dos se está nombrando.

**Migración.** Archivo versionado que modifica el esquema de D1. No confundir con la
«migración del contenido» de la iteración 24, que traslada las preguntas.

## Técnicos del proyecto

**Generado.** Archivo producido por un script y no editado a mano. Hoy:
`static/css/style.css` y `static/css/icons.css`.

**Generador.** Script que produce un archivo generado, en `scripts/`. Para cambiar
un generado, se edita su generador.

**Escapar.** Convertir los caracteres con significado en HTML antes de insertar
texto en la página, mediante `esc()`. Obligatorio para todo texto que venga de datos.

**Clase de ícono.** Clase `i-nombre` que aporta la forma de un ícono, combinada con
la clase `icon` que aporta el mecanismo. Ambas son necesarias.

**Panel fijo.** Mitad izquierda de `cuestionario.html`, que permanece a la vista
mientras la mitad derecha se desplaza.
