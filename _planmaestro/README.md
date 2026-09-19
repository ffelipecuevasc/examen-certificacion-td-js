# Plan maestro

Planificación del proyecto. Esta carpeta **es parte del repositorio** y se versiona junto al código: la historia de las
decisiones vale tanto como el código que las implementa.

---

## Iteración activa

| Campo         | Valor                                                                                                                                              |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| **Iteración** | **42 · Cronómetros** — abierta el 2026-09-18                                                                                                       |
| **Épica**     | 40 - Simulacro de examen                                                                                                                           |
| **Estado**    | 🔵 En curso                                                                                                                                        |
| **Siguiente** | **Iteración 42 · Cronómetros.** La **41 y la 45 cerraron el 2026-09-18**: `simulacro.html` existe, elige y guarda un intento de 120 preguntas, y la dirección visual ya está fijada con el marcado estático del intento y del resumen construido. El orden de trabajo dentro de la épica 40, fijado por el autor el 2026-09-16, es **41 → 45 → 42 → 43 → 44**. Los números de las iteraciones no cambian. |

> **Antes de abrir la iteración 42.** El simulacro sigue **sin recorrido, sin cronómetros que cuenten, sin resumen
> calculado y sin enlazar desde ninguna parte**: los enlaces se agregan en la iteración 44, a propósito. Lo que hay hoy es
> la presentación, el botón «Comenzar el simulacro», la carga bajo una sola transición, el aviso «Intento listo» que
> sobrevive a una recarga, y el **marcado estático** del intento y del resumen que dejó la 45, que se mira con
> `simulacro.html?maqueta=intento` y `?maqueta=resumen`. La 42 escribe dentro de los huecos que ese marcado ya tiene
> marcados con `data-papel`; no tiene que dibujar la franja de nuevo.
>
> **La 41 dejó escrita ADR-035**, que reúne todo lo que el simulacro decidió: el navegador elige y el extremo solo
> sirve, la forma del extremo por ids con el límite de 100 parámetros ligados de D1, por qué ese extremo no se puede
> cachear nunca, el costo medido —3 902 filas leídas por intento—, la regla de no mezclar bancos de H-024, por qué las
> preguntas del intento se guardan congeladas apartándose de ADR-034, y por qué aquí sí se coordinan las pestañas.
>
> **Las cifras y las reglas del simulacro —120 preguntas, 30 segundos por pregunta, el sobrante perdido, omitida cuenta
> como incorrecta, 72 de 120 para aprobar— son decisiones de diseño del autor, no datos del examen real**, y viven en
> `40-epica-simulacro-examen/README.md`. No se cotejan contra `00_producto/contexto-del-examen.md`: ese documento
> describe el examen real —120 minutos, alternativas y programación mezcladas— y desde el 2026-09-16 dice
> explícitamente que el simulacro no toma de él ninguna cifra.

> Al arrancar la siguiente: rellenar este bloque con su archivo y su fecha de inicio, y
> poner la épica correspondiente en 🔵.

## Iteraciones completadas

| Iteración                              | Épica                       | Cierre     | Bitácora      |
|----------------------------------------|-----------------------------|------------|---------------|
| 11 - Publicación en Cloudflare Pages   | 10 - Plataforma Cloudflare  | 2026-09-03 | 🟢 Completada |
| 12 - Capa de datos y base D1           | 10 - Plataforma Cloudflare  | 2026-09-03 | 🟢 Completada |
| 13 - Entornos, secretos y procedim.    | 10 - Plataforma Cloudflare  | 2026-09-04 | 🟢 Completada |
| 21 - Modelo de datos del banco         | 20 - Persistencia preguntas | 2026-09-05 | 🟢 Completada |
| 22 - Lectura, validación e instantánea | 20 - Persistencia preguntas | 2026-09-08 | 🟢 Completada |
| 23 - Administración del contenido      | 20 - Persistencia preguntas | 2026-09-08 | 🟢 Completada |
| 24 - Preparar producción               | 20 - Persistencia preguntas | 2026-09-09 | 🟢 Completada |
| 25 - Llenar el banco                   | 20 - Persistencia preguntas | 2026-09-11 | 🟢 Completada |
| 31 - Selector de módulo                | 30 - Cuestionario           | 2026-09-11 | 🟢 Completada |
| 32 - Rediseño del panel fijo           | 30 - Cuestionario           | 2026-09-15 | 🟢 Completada |
| 33 - Memoria del avance                | 30 - Cuestionario           | 2026-09-15 | 🟢 Completada |
| 36 - Orientación en la portada         | 30 - Cuestionario           | 2026-09-15 | 🟢 Completada |
| 34 - Justificación y repaso            | 30 - Cuestionario           | 2026-09-16 | 🟢 Completada |
| 35 - Transición de carga               | 30 - Cuestionario           | 2026-09-16 | 🟢 Completada |
| 41 - Presentación, selección y protec. | 40 - Simulacro de examen    | 2026-09-18 | 🟢 Completada |
| 45 - Dirección visual del simulacro    | 40 - Simulacro de examen    | 2026-09-18 | 🟢 Completada |
| —                                      | —                           | —          | —             |

## Épicas

| #  | Épica                           | Estado         | Entrega                                                                     |
|----|---------------------------------|----------------|-----------------------------------------------------------------------------|
| 10 | Plataforma Cloudflare           | 🟢 Completada  | Sitio en Pages, capa de datos y dos bases D1 operativas                     |
| 20 | Persistencia de preguntas       | 🟢 Completada  | Banco de ~300 preguntas en D1, con administración e instantánea de respaldo |
| 30 | Cuestionario                    | 🟢 Completada  | `cuestionario.html` por módulo, con memoria del avance, justificación, repaso y transición de carga |
| 40 | Simulacro de examen             | 🔵 En curso    | `simulacro.html` cronometrado, 120 preguntas, resumen final                 |
| 50 | Endurecimiento y observabilidad | ⚪ No iniciada | Seguridad, caché y métricas sobre el sitio y la capa de datos               |

Las épicas se ejecutan en orden: cada una depende de la anterior. La 10 va primera porque el banco de preguntas vive en
su infraestructura, y sin banco no hay cuestionario ni simulacro.

**Estados:** ⚪ No iniciada · 🔵 En curso · 🟢 Completada · 🔴 Bloqueada

---

## Cómo está organizada esta carpeta

```
_planmaestro/
├── README.md                        Este archivo. Estado general y reglas.
├── 00_producto/                     Documentos transversales, vivos durante todo el proyecto
│   ├── vision.md                    Para qué existe el proyecto. No se reescribe.
│   ├── decisiones.md                Registro de decisiones cerradas (ADR).
│   ├── registro_log.md              Qué falta. Fuente única de verdad del backlog.
│   ├── auditoria_tecnica.md         Hallazgos encontrados sobre la marcha.
│   └── glosario.md                  Términos del proyecto.
├── 10-epica-plataforma-cloudflare/  Una carpeta por épica
│   ├── README.md                    Alcance de la épica y sus iteraciones
│   └── iteracion-NN-nombre.md       Una iteración por archivo
├── 20-epica-persistencia-preguntas/
├── 30-epica-cuestionario/
├── 40-epica-simulacro-examen/
├── 50-epica-endurecimiento/
├── 90-manual/                       Documentación de uso dirigida a personas
└── 99-bitacora/                     Una entrada por iteración cerrada
```

**Numeración.** Las épicas van de diez en diez. Las iteraciones heredan la decena de su épica: la épica 10 contiene las
iteraciones 11, 12, 13; la épica 20 contiene 21, 22, 23. Así el número de una iteración dice de inmediato a qué épica
pertenece.

**Una vez que haya iteraciones cerradas, no se renumera**: las entradas de bitácora y las ADR quedarían apuntando al
vacío. Si hiciera falta intercalar una épica, se usa un número intermedio.

**Prefijos numéricos.** Fuerzan el orden alfabético del listado de archivos, de modo que la carpeta se lee en el mismo
orden en que se trabaja.

---

## Ciclo de trabajo por iteración

1. **Redactar el archivo de la iteración.** Se hace en Claude web, antes de empezar. Claude Code no crea archivos de
   iteración ni de épica.
2. **Actualizar el bloque «Iteración activa»** de este README.
3. **En Claude Code:** ejecutar `/clear` y pedirle que lea la iteración activa y **resuma su alcance antes de tocar
   nada**. Si el resumen no calza con lo que se espera, se corrige ahí, no después.
4. **Ejecutar las tareas**, marcando las casillas conforme se completan.
5. **Al terminar:** pedirle que recorra los criterios de aceptación **uno por uno con su evidencia**, no un simple
   «listo».
6. **Commit del código** en el repositorio público, por el usuario.
7. **Actualizar este README** y escribir la entrada de bitácora en `99-bitacora/`.

Una iteración se cierra cuando todos sus criterios de aceptación tienen evidencia. Si alguno no se cumple, se aplaza a
otra iteración y se anota en `registro_log.md`; no se cierra a medias.

---

## Reglas de edición dentro de esta carpeta

Estas reglas son para Claude Code. Existen porque la planificación pierde su valor si se reescribe sola: lo que aquí
queda escrito debe poder leerse dentro de seis meses y seguir explicando por qué el proyecto es como es.

### Puede hacer libremente

1. Marcar casillas y actualizar campos de estado en cualquier archivo.
2. Añadir secciones nuevas al archivo de la iteración activa: tareas surgidas sobre la marcha, resultados de
   verificación, hallazgos.
3. Añadir filas al backlog en `registro_log.md`, y actualizar el estado de las existentes.
4. Añadir ADR nuevas al final de `decisiones.md`, y añadir bloques de «Resultado» o «Actualización» al final de una ADR
   ya existente.
5. Crear archivos en `99-bitacora/` y en `90-manual/`.
6. Añadir términos al glosario.

### Debe pedir permiso antes

1. Reescribir la sección «Decisión» o «Motivo» de una ADR ya publicada.
2. Cualquier edición que elimine o sustituya más de cinco líneas ya escritas.

En ambos casos: muestra cómo quedaría, espera confirmación, y luego aplica.

### No puede hacer

1. Reescribir `vision.md`.
2. Crear archivos de iteración o de épica, ni carpetas de épica nuevas.
3. Cambiar el alcance de una iteración en curso para acomodar lo que ya escribió.
4. Borrar entradas de bitácora, ADR o filas del backlog. Lo que se descarta se marca como descartado, con su motivo; no
   se elimina.
5. Cerrar una iteración por su cuenta ni marcar una épica como completada.

---

## Convenciones

- **Fechas** en formato `AAAA-MM-DD`.
- **Nombres de archivo** en minúsculas, sin tildes ni eñes, separando con guiones.
- **Idioma:** español latino de Chile, en toda la documentación.
- Cuando un documento se refiera a un archivo del proyecto, se escribe su ruta completa desde la raíz del repositorio.
- **Mensajes de commit:** una línea, **máximo 200 caracteres**. El porqué va íntegro a `99-bitacora/` y a `00_producto/registro_log.md`, no al mensaje (ADR-030).
