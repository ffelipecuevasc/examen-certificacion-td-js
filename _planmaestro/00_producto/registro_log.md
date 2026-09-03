# Registro de trabajo pendiente

Fuente única de verdad sobre qué falta. Ordenado por prioridad dentro de cada épica.

**Cuando aparezca una idea fuera del alcance de la iteración activa, se añade aquí
—en «Sin asignar» o en la épica que corresponda— en vez de implementarla.**

**Estados:** ⚪ Pendiente · 🔵 En curso · 🟢 Hecha · ⏸️ Aplazada · ❌ Descartada

---

## Épica 10 · Plataforma Cloudflare

| Estado | Iteración | Tarea |
|---|---|---|
| 🔵 | 11 | Publicar el sitio en Cloudflare Pages sin regresiones |
| 🟢 | 11 | Decidir si el despliegue compila o publica el repositorio tal cual (ADR-010) |
| ⚪ | 12 | Crear la base D1 y el Worker de datos |
| ⚪ | 12 | Decidir el dominio del Worker respecto al sitio |
| ⚪ | 12 | Definir el formato de error del Worker, base del respaldo de ADR-008 |
| ⚪ | 12 | Desarrollo local contra una base D1 local |
| ⚪ | 13 | Separar entorno de pruebas y producción |
| ⚪ | 13 | Gestión de credenciales fuera del repositorio |
| ⚪ | 13 | Procedimiento de respaldo de la base, probado con una restauración |

## Épica 20 · Persistencia de preguntas

| Estado | Iteración | Tarea |
|---|---|---|
| ⚪ | 21 | Diseñar el esquema del banco en D1 |
| ⚪ | 21 | Decidir el modelado de las alternativas |
| ⚪ | 21 | Decidir el tratamiento de las preguntas retiradas |
| ⚪ | 21 | Migraciones versionadas y repetibles |
| ⚪ | 22 | Extremos de lectura en el Worker, con validación |
| ⚪ | 22 | Instantánea local de respaldo (ADR-008) |
| ⚪ | 22 | Aviso visible al estudiante cuando se usa el respaldo |
| ⚪ | 22 | Reforzar el escapado: el contenido pasa a ser de origen externo |
| ⚪ | 23 | Decidir el mecanismo de administración del contenido |
| ⚪ | 23 | Implementarlo cumpliendo ADR-009: sin escritura pública |
| ⚪ | 23 | Carga por lotes |
| ⚪ | 23 | Regenerar la instantánea al editar |
| ⚪ | 24 | Migrar las 105 preguntas actuales a D1 |
| ⚪ | 24 | Ampliar el banco hasta ~300 preguntas |
| ⚪ | 24 | Escribir la justificación de cada pregunta |

## Épica 30 · Cuestionario

| Estado | Iteración | Tarea |
|---|---|---|
| ⚪ | 31 | Consumir el banco completo desde la nueva fuente |
| ⚪ | 31 | Renderizado por módulo para no dibujar 300 preguntas de golpe |
| ⚪ | 32 | Barras de progreso en formato horizontal, a todo el ancho del panel |
| ⚪ | 32 | Índice de módulos con avance individual |
| ⚪ | 33 | Guardar el avance en el navegador y poder retomarlo |
| ⚪ | 33 | Modo repaso: reintentar solo las preguntas falladas |
| ⚪ | 33 | Mostrar la justificación al responder |

## Épica 40 · Simulacro de examen

| Estado | Iteración | Tarea |
|---|---|---|
| ⚪ | 41 | Pantalla de presentación con reglas y botón de inicio |
| ⚪ | 41 | Motor de sesión: selección de 120 preguntas y estado del intento |
| ⚪ | 42 | Cronómetro total de 60 minutos |
| ⚪ | 42 | Cronómetro de 30 segundos por pregunta, con avance automático |
| ⚪ | 43 | Una pregunta a la vez, con botón de avance manual |
| ⚪ | 44 | Resumen de resultados con desglose por módulo |
| ⚪ | 45 | Identidad visual propia del simulacro |

## Épica 50 · Endurecimiento y observabilidad

| Estado | Iteración | Tarea |
|---|---|---|
| ⚪ | 51 | Cabeceras de seguridad y reglas de protección |
| ⚪ | 51 | Límites de tasa en el Worker de lectura |
| ⚪ | 51 | Verificar que no hay escritura alcanzable públicamente |
| ⚪ | 52 | Métricas de tráfico sin rastreo de personas |
| ⚪ | 53 | Política de caché del sitio y de las respuestas del Worker |
| ⚪ | 53 | Vigilancia de los límites de uso del plan gratuito |

---

## Sin asignar

Tareas necesarias que todavía no pertenecen a ninguna iteración. Se rescatan cuando
se planifique la iteración que las incluya.

| Estado | Origen | Tarea |
|---|---|---|
| ⚪ | Auditoría | Archivo de licencia propia y atribución de terceros (Material Symbols es Apache 2.0 y exige atribución) |
| ⚪ | Auditoría | Metadatos para compartir en redes: imagen y descripción |
| ⚪ | Auditoría | Página 404 con la identidad del sitio |
| ⚪ | Auditoría | Auto-hospedar las tipografías y eliminar la dependencia externa |
| ⚪ | Auditoría | Semántica de formulario en las alternativas, para lectores de pantalla |
| ⚪ | Auditoría | Anunciar los cambios de estado a tecnologías de asistencia |
| ⚪ | Auditoría | No comunicar solo por color en las barras de progreso |
| ⚪ | Auditoría | Manejo del foco al reiniciar un cuestionario |
| ⚪ | Auditoría | Estilos de impresión del temario |
| ⚪ | Auditoría | Plantilla de issue para que los alumnos reporten preguntas erróneas |
| ⚪ | Auditoría | Comprobación automática de que el CSS compilado está al día |
| ⚪ | ADR-007 | Evaluar si el Worker debe dejar de enviar la respuesta correcta al navegador durante el simulacro, y validar del lado del servidor |
| ⚪ | ADR-007 | Definir qué ocurre con el proyecto si se agotan los límites del plan gratuito |
| ⚪ | Iteración 11 | `.gitattributes` que fije los finales de línea de `static/css/*.css` a LF. Con `core.autocrlf=true`, tras un checkout el archivo queda con CRLF y el generador lo reescribe con LF: `git status` marca los CSS como modificados aunque el contenido sea idéntico. Es ruido cosmético —`git diff` sale vacío y `npm run verificar` no da falsa alarma— pero enseña a ignorar avisos de git, que es justo lo que no conviene |
| ⚪ | Iteración 11 | La tabla «Documentos previstos» de `90-manual/README.md` cita iteraciones 41, 42 y 43 para asuntos de Cloudflare. Son números de la planificación anterior, de cuando Cloudflare era la épica de cierre; con ADR-007 pasó a ser la épica 10. Corregirlos |

---

## Épicas sin implementar

Ideas para más adelante. No están planificadas y no tienen carpeta. Al promoverse a
épica se les asigna número y se les crea carpeta desde Claude web.

- **Fichas de repaso.** Convertir las preguntas del banco en tarjetas de memoria con
  repetición espaciada.
- **Diagnóstico inicial.** Un cuestionario corto que estime el nivel del estudiante
  y le recomiende por qué módulos empezar.
- **Historial de intentos.** Guardar los simulacros rendidos y mostrar la evolución
  del puntaje en el tiempo.
- **Glosario interactivo.** Términos del temario explicados, enlazados desde las
  justificaciones de las preguntas.
- **Modo docente.** Vista que agregue estadísticas de las preguntas más falladas,
  para orientar las clases. Con D1 esto pasa a ser viable de verdad, pero requiere
  resolver cómo recolectar datos sin romper el principio de cero fricción ni
  identificar a ningún estudiante.
- **Contenido por módulo.** Apuntes propios de cada módulo, no solo el listado de
  temas evaluados.
- **Instalable como aplicación.** Que el sitio se pueda instalar y funcione sin
  conexión.
