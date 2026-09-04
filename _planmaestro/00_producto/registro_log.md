# Registro de trabajo pendiente

Fuente única de verdad sobre qué falta. Ordenado por prioridad dentro de cada épica.

**Cuando aparezca una idea fuera del alcance de la iteración activa, se añade aquí
—en «Sin asignar» o en la épica que corresponda— en vez de implementarla.**

**Estados:** ⚪ Pendiente · 🔵 En curso · 🟢 Hecha · ⏸️ Aplazada · ❌ Descartada

---

## Épica 10 · Plataforma Cloudflare

| Estado | Iteración | Tarea                                                                        |
|---|---|------------------------------------------------------------------------------|
| 🟢 | 11 | Desconectar GitHub Pages, que era el despliegue anterior                     |
| 🟢 | 11 | Publicar el sitio en Cloudflare Pages sin regresiones                        |
| 🟢 | 11 | Decidir si el despliegue compila o publica el repositorio tal cual (ADR-010) |
| 🟢 | 12 | Crear la base D1 y la capa de datos                                          |
| 🟢 | 12 | Decidir el dominio del Worker (ADR-011)                                      |
| 🟢 | 12 | Definir el formato de error del Worker, base del respaldo de ADR-008         |
| 🟢 | 12 | Desarrollo local contra una base D1 local                                    |
| 🟢 | 12 | Verificar la capa de datos en la dirección pública, tras el primer despliegue con `wrangler.toml` |
| 🟢 | 13 | El manual documenta la creación de la base **por el panel** (su paso 1), pero la base de pruebas se creó por línea de comandos con `wrangler d1 create`, ruta que el manual no menciona. Decidir cuál es la ruta oficial y reescribir el paso 1 en consecuencia; si conviven las dos, decir cuándo se usa cada una |
| 🟢 | 13 | El manual `90-manual/capa-de-datos-y-base-d1.md` está escrito para una base única: su paso 1 fija `examen-td-js-produccion` y todos sus comandos nombran esa base. Con dos entornos tiene que cubrir ambas y dejar claro cuál se está tocando en cada comando. **No se corrige hasta que el ensayo del manual traiga los huecos reales** |
| 🟢 | 13 | Declarar `[env.preview]` con base propia. Verificado en un despliegue de vista previa real: leyó la base de pruebas |
| 🟢 | 13 | Separar entorno de pruebas y producción. Demostrado consultando ambas bases en el mismo instante durante el ensayo de restauración |
| 🟢 | 13 | Gestión de credenciales fuera del repositorio                                |
| 🟢 | 13 | Procedimiento de respaldo en `90-manual/respaldo-y-restauracion.md`, con la restauración ensayada contra pruebas destruyendo un dato real |

| 🟢 | 13 | **H-011** · `npm run verificar` dependía del terminal y fallaba a mitad de camino. Reescrito como `scripts/verificar.mjs`, con tres veredictos y sin depender de git para la comprobación central |
| 🟢 | 13 | Que el manual permita publicar desde un clon sin preguntarle nada al autor. Cerrado al resolver H-011: los manuales explican los tres veredictos y ya no dependen de qué terminal use quien los siga |

## Épica 20 · Persistencia de preguntas

| Estado | Iteración | Tarea |
|---|---|---|
| ⚪ | 21 | **El sesgo de la respuesta correcta se corrige barajando, no reescribiendo preguntas** (decisión del autor, 2026-09-04). Consecuencia para el esquema: la correcta no puede identificarse por posición, salvo en la única pregunta con `fijo = true`, que no se baraja. Cierra casi por completo la decisión 2 de esta iteración |
| 🟢 | 21 | **El banco nuevo suma, no reemplaza: 405 preguntas.** Publicado como **ADR-016**, con los dos formatos tabulados y las consecuencias de unificarlos |
| ⚪ | 21 | **Ubicacion definitiva del banco.** Hoy los siete `modulo-0N.json` estan en `_planmaestro/00_producto/cuestionarios/`, que es temporal. Al proponer la definitiva hay que **comprobar de forma explicita que esa carpeta no termine copiada a `dist/`**: un archivo con las respuestas correctas servido al navegador deja el simulacro sin sentido. Hoy es seguro porque `LISTA_COPIA` no nombra `_planmaestro/`, pero eso deja de ser cierto en cuanto el banco se mueva |
| ⚪ | 21 | **El informe de la IA que genero los cuestionarios no sirve como fuente unica.** `modulo-02.json` no era JSON valido —faltaba la comilla de apertura del enunciado de la pregunta 3— y el informe no lo detecto. El script de verificacion tiene que revisar todo de nuevo desde cero, empezando por lo mas basico: que cada archivo se pueda leer |
| ⚪ | 21 | Ensayar el manual entero, desde su paso 1, al crear la base del banco de preguntas. **Cierra el criterio 7 de la iteración 12, aplazado explícitamente hasta acá**: el procedimiento describe pasos que sí ocurrieron, pero nunca se ha seguido de principio a fin sobre una base que todavía no existe. La iteración 21 crea una, así que el ensayo ocurre solo |
| ⚪ | 21 | Borrar `prueba_tuberia` de **las dos bases de la nube**, produccion y pruebas. La crearon las iteraciones 12 y 13 para probar la tubería y sigue ahí: la primera migración del esquema real tiene que retirarla de ambas |
| 🟢 | 21 | Diseñar el esquema del banco en D1. Migración en `d1/migraciones/001-banco-de-preguntas.sql`, documentado campo por campo en `90-manual/esquema-del-banco.md` |
| 🟢 | 21 | Decidir el modelado de las alternativas. **ADR-018**: tabla aparte |
| 🟢 | 21 | Decidir el tratamiento de las preguntas retiradas. **ADR-020**: se marcan y se ocultan tras una vista, nunca se borran |
| 🟢 | 21 | Migraciones versionadas y repetibles. Comprobado corriendo la migración dos veces contra D1 local: 10 sentencias, sin error ni duplicados |
| 🟢 | 21 | Decidir cómo se identifica la respuesta correcta sin depender de la posición. **ADR-019**: bandera `es_correcta` en la alternativa, con la unicidad forzada por un índice único parcial |
| 🟢 | 21 | Decidir dónde viven el título y el ícono de cada módulo (decisión añadida por el autor). **ADR-021**: tabla `modulo` con llave foránea desde `pregunta` |
| 🔵 | 21 | Consulta de verificación de lo que el esquema no puede exigir: `d1/verificar-banco.sql` con `scripts/verificar-banco.mjs`. **La consulta y el envoltorio están listos y probados; los criterios que dependen de ellos no se cierran todavía.** El envoltorio venía dando un veredicto que no significaba nada (**H-013**) y lo que se probó en su momento se probó con él roto. Se cierran cuando el autor repita el paso 4 de la iteración 21 sobre una base local recién reconstruida |
| 🟢 | 21 | **H-013** · `verificar-banco` anunciaba `BANCO CON PROBLEMAS / undefined -> undefined` pasara lo que pasara: no distinguía «el banco falla» de «no pude preguntarle nada al banco». Reescrito con tres veredictos —`BANCO VERIFICADO` (0), `BANCO CON PROBLEMAS` (1), `NO SE PUDO VERIFICAR` (2)—, comprobando la forma de la respuesta fila por fila y mostrando lo que dijo wrangler por las dos salidas. Sin `shell` y sin `npx`. Los tres estados provocados de verdad, en PowerShell y en Git Bash, desde un clon limpio en Windows |
| ⚪ | 21 | **Cargar las 368 preguntas.** El esquema está listo y probado con diez filas; la carga completa desde los siete JSON y el `.js` es trabajo de la iteración 24 |
| ⚪ | 22 | Extremos de lectura en el Worker, con validación |
| ⚪ | 22 | Instantánea local de respaldo (ADR-008) |
| ⚪ | 22 | Aviso visible al estudiante cuando se usa el respaldo |
| ⚪ | 22 | Reforzar el escapado: el contenido pasa a ser de origen externo |
| ⚪ | 23 | Decidir el mecanismo de administración del contenido |
| ⚪ | 23 | Implementarlo cumpliendo ADR-009: sin escritura pública |
| ⚪ | 23 | Carga por lotes |
| ⚪ | 23 | Regenerar la instantánea al editar |
| ⚪ | 24 | **Aplicar la migración 001 en las dos bases de la nube, pruebas y producción.** Era el paso 5 de la iteración 21 y **no se ejecutó**: queda aquí, junto a la carga del banco, porque crear el esquema en producción sin contenido que meterle no aporta nada y sí abre una ventana en la que la base publicada tiene tablas vacías. Los comandos están escritos en `90-manual/esquema-del-banco.md` y los ejecuta el autor. Arrastra consigo el borrado de `prueba_tuberia` en ambas bases |
| ⚪ | 24 | Transformar los cuestionarios de los siete módulos a un formato estructurado y verificado, previo al esquema |
| ⚪ | 24 | Cargar el banco transformado en D1, una vez definido el esquema de la iteración 21 |
| ⚪ | 24 | Escribir la justificación de cada pregunta |
| 🟢 | 24 | **Los distractores evidentemente descartables del banco nuevo se conservan a propósito. No es un defecto: es fidelidad al examen real** (decisión del autor, 2026-09-04). Al comparar los dos bancos apareció un patrón: el viejo compite contra alternativas que existen —`path`, `http`, `os`— y el nuevo inventa nombres que se descartan sin saber la materia —`path-directory (pd)`, `os-architecture`, `hasMultiple()`—. La tentación evidente es reescribirlos. **No se hace.** Los testimonios de alumnos que rindieron el examen real de certificación de Talento Digital coinciden en que ese examen trae bastantes alternativas evidentemente descartables. Un banco de práctica con distractores impecables entrena para un examen que no es el que van a rendir. La fidelidad al examen real pesa más que la calidad teórica del ítem. **Quien lea esto en el futuro y lo tome por una lista de errores, que se detenga: corregirlo empeora la simulación.** Si algún día cambia el examen real, cambia la premisa y entonces se revisa; mientras tanto se deja como está. **No cubre los ítems con dos respuestas correctas**, que sí son errores: ver el par `m07#21 ↔ M7·8` en la iteración 24. **Publicado como ADR-017** |
| 🟢 | 24 | **Retiros por solapamiento aplicados: el banco quedó en 368.** 34 pares más el cuarteto de atomicidad, 37 preguntas retiradas —15 del banco nuevo y 22 del viejo—, aprobadas una por una por el autor el 2026-09-04. Nada se borró: están en `cuestionarios/retiradas.json` con su origen y su razón. **El banco nuevo no se renumeró**, porque `numero` es la referencia que usa todo el plan. Lista operativa en la iteración 24 |
| ⚪ | 24 | **`scripts/build-cuestionario.py` no se puede ejecutar: su entrada ya no existe.** Lee de `/mnt/user-data/uploads`, el directorio de subida de una sesión de Claude web, y los markdown de origen nunca entraron al repositorio. Consecuencia: `static/js/data/cuestionario.js` es un archivo generado que hoy es la **única copia** de su propio contenido, y hubo que editarlo a mano para aplicar los retiros. Esta iteración retira los dos archivos, con lo que el problema se cierra solo; si por lo que sea sobrevivieran, hay que decidir qué pasa con un generador sin entrada |
| ⚪ | 24 | **Advertencia sobre los números de solapamiento: retirar 37 preguntas no deja el banco sin duplicados.** Los 82 pares candidatos que produjo `npm run informe-banco` salieron de **parecido de redacción** —trigramas compartidos y palabras en común—, no de entender el contenido. Dos preguntas sobre el mismo punto escritas con vocabulario distinto **no aparecen en esa lista, y nadie las ha visto**: ni el script, ni el autor, ni Claude Code. Quien lea más adelante «el banco quedó en 368 preguntas sin duplicados» tiene que leer «368 preguntas sin los duplicados que el parecido de redacción alcanzó a detectar». Cerrar el hueco de verdad exige una revisión por tema, pregunta por pregunta, que hoy no está planificada ni presupuestada |

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
| ⚪ | 41 | **Diez pares de preguntas hermanas que el motor no debería sacar en el mismo intento.** No son duplicados —cada una evalúa algo distinto y por eso ninguna se retira— pero se rozan tanto que verlas seguidas le regala la respuesta al estudiante. Eran once; uno se disolvió al retirarse `M8·11`. **Las posiciones del banco viejo se movieron con los retiros y volverán a moverse**: la tabla hay que reanclarla a los identificadores de D1 en cuanto existan. Lista completa en la iteración 41, sección «Preguntas hermanas» |
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
| ⚪ | Iteración 12 | Cloudflare Pages responde **308** a `/cuestionario.html` y redirige a `/cuestionario`: quita la extensión por su cuenta. No rompe nada, porque el navegador sigue la redirección, pero todos los enlaces internos del sitio pagan un salto de más. Decidir si los enlaces pasan a escribirse sin extensión |
| ⚪ | Iteración 12 | La orden de construcción (`npm run build`) no se puede declarar en `wrangler.toml`: es el único ajuste de la publicación que el repositorio no cubre y que vive solo en el panel. Si alguien la vacía ahí, ningún archivo del repositorio lo impide. Evaluar si una comprobación posterior al despliegue puede detectarlo |
| 🟢 | — | **H-012** · Falsa alarma en un clon recien bajado. Resuelto por los dos lados: la comparación ignora los finales de línea, y `.gitattributes` hace que el checkout escriba LF. No hizo falta renormalizar: el historial ya estaba en LF |
| ⚪ | Auditoría | **`scripts/verificar.mjs` confunde «git falló» con «el CSS está desfasado», igual que H-013 pero más leve.** La línea 237 hace `if (diff.status !== 0) → DESFASADO`, y `git diff --exit-code` sólo usa 0 y 1 para «sin diferencias» y «con diferencias»: cualquier otro código es git fallando. Sólo se distingue el caso «no es un repositorio», y por texto del `stderr`. Comprobado con un repositorio de índice corrupto: sale por **128** con `fatal: .git/index: index file smaller than expected`, que no coincide con ese texto y se anunciaría como `DESFASADO`. El arreglo es tratar `status > 1` como `VERIFICACION PARCIAL`, que ese archivo ya tiene. No se hizo en la iteración 21 por quedar fuera de su alcance. **El defecto de paso de argumentos no lo tiene**: revisado en la misma pasada |
| ⚪ | Sin asignar | **Un envoltorio que traduce la salida de otra herramienta necesita un tercer veredicto: «no entendí la respuesta».** Regla que deja H-013. Con sólo dos estados —bien y mal— los fallos propios del envoltorio terminan contados como hallazgos, siempre del lado de «mal», que es el que parece prudente y es el que enseña a ignorar la herramienta. Aplica a `verificar`, a `verificar-banco` y a cualquiera que venga |
| ⚪ | Sin asignar | **Cualquier reemplazo futuro de `verificar` se prueba desde un clon limpio en Windows antes de darse por bueno.** Extendido por H-013 a **todo script que envuelva a otra herramienta**, y con un requisito añadido: provocar de verdad los tres veredictos, incluido el de fallo, no sólo el bueno. La versión vieja dependía del terminal —git en el PATH, H-011— y la nueva dependía de la codificación del disco —CRLF del checkout, H-012—. Son dos fallos de naturaleza distinta y el clon limpio en Windows es el único escenario donde ambos aparecen: en la carpeta de trabajo del autor los dos pasan inadvertidos |
| ⚪ | Sin asignar | **Las marcas de criterios no se editan a mano sin revisar qué más arrastra el cambio.** El criterio 7 de la iteración 12 se marcó aplazado, y una reversión posterior lo devolvió a `[x]` sin que nadie lo notara: el archivo decía una cosa y su bitácora la contraria. Antes de tocar una marca hay que mirar qué otros archivos la citan —bitácora, registro, ADR— y dejarlos de acuerdo |
| 🟢 | — | `.gitattributes` que fije los finales de línea a LF. Hecho al resolver H-012, y con más alcance del previsto: `* text=auto eol=lf`, no solo los CSS. Texto original de la anotación: `.gitattributes` que fije los finales de línea de `static/css/*.css` a LF. Con `core.autocrlf=true`, tras un checkout el archivo queda con CRLF y el generador lo reescribe con LF: `git status` marca los CSS como modificados aunque el contenido sea idéntico. Es ruido cosmético —`git diff` sale vacío y `npm run verificar` no da falsa alarma— pero enseña a ignorar avisos de git, que es justo lo que no conviene |
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
