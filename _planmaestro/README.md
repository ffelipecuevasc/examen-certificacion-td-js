# Plan maestro

Planificación del proyecto. Esta carpeta **es parte del repositorio** y se versiona junto al código: la historia de las decisiones vale tanto como el código que las implementa.

---

## Iteración activa

| Campo | Valor                                                             |
|---|-------------------------------------------------------------------|
| **Iteración** | `12-worker-y-base-d1.md`                                          |
| **Épica** | 10 · Plataforma Cloudflare                                        |
| **Estado** | 🔵 En curso                                                       |
| **Archivo** | `10-epica-plataforma-cloudflare/iteracion-12-worker-y-base-d1.md` |
| **Iniciada** | 2026-09-03                                                        |

## Iteraciones completadas

**🟢 Completada** | _Iteración 11: Publicación en Cloudflare Pages (`iteracion-11-publicacion-en-pages.md`)_

| Iteración                            | Épica                      | Cierre     | Bitácora |
|--------------------------------------|----------------------------|------------|---|
| 11 - Publicación en Cloudflare Pages | 10 - Plataforma Cloudflare | 2026-09-03 | 🟢 Completada |
| —                                    | —                          | —          | — |

## Épicas

| # | Épica | Estado | Entrega |
|---|---|---|---|
| 10 | Plataforma Cloudflare | 🟢 Completada | Sitio en Pages, Worker y base D1 operativos |
| 20 | Persistencia de preguntas | 🔵 En curso | Banco de ~300 preguntas en D1, con administración e instantánea de respaldo |
| 30 | Cuestionario | ⚪ No iniciada | `cuestionario.html` con el banco completo y barras horizontales |
| 40 | Simulacro de examen | ⚪ No iniciada | `simulacro.html` cronometrado, 120 preguntas, resumen final |
| 50 | Endurecimiento y observabilidad | ⚪ No iniciada | Seguridad, caché y métricas sobre el sitio y la capa de datos |

Las épicas se ejecutan en orden: cada una depende de la anterior. La 10 va primera porque el banco de preguntas vive en su infraestructura, y sin banco no hay cuestionario ni simulacro.

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

**Numeración.** Las épicas van de diez en diez. Las iteraciones heredan la decena de su épica: la épica 10 contiene las iteraciones 11, 12, 13; la épica 20 contiene 21, 22, 23. Así el número de una iteración dice de inmediato a qué épica pertenece.

**Una vez que haya iteraciones cerradas, no se renumera**: las entradas de bitácora y las ADR quedarían apuntando al vacío. Si hiciera falta intercalar una épica, se usa un número intermedio.

**Prefijos numéricos.** Fuerzan el orden alfabético del listado de archivos, de modo que la carpeta se lee en el mismo orden en que se trabaja.

---

## Ciclo de trabajo por iteración

1. **Redactar el archivo de la iteración.** Se hace en Claude web, antes de empezar. Claude Code no crea archivos de iteración ni de épica.
2. **Actualizar el bloque «Iteración activa»** de este README.
3. **En Claude Code:** ejecutar `/clear` y pedirle que lea la iteración activa y **resuma su alcance antes de tocar nada**. Si el resumen no calza con lo que se espera, se corrige ahí, no después.
4. **Ejecutar las tareas**, marcando las casillas conforme se completan.
5. **Al terminar:** pedirle que recorra los criterios de aceptación **uno por uno con su evidencia**, no un simple «listo».
6. **Commit del código** en el repositorio público, por el usuario.
7. **Actualizar este README** y escribir la entrada de bitácora en `99-bitacora/`.

Una iteración se cierra cuando todos sus criterios de aceptación tienen evidencia. Si alguno no se cumple, se aplaza a otra iteración y se anota en `registro_log.md`; no se cierra a medias.

---

## Reglas de edición dentro de esta carpeta

Estas reglas son para Claude Code. Existen porque la planificación pierde su valor si se reescribe sola: lo que aquí queda escrito debe poder leerse dentro de seis meses y seguir explicando por qué el proyecto es como es.

### Puede hacer libremente

1. Marcar casillas y actualizar campos de estado en cualquier archivo.
2. Añadir secciones nuevas al archivo de la iteración activa: tareas surgidas sobre la marcha, resultados de verificación, hallazgos.
3. Añadir filas al backlog en `registro_log.md`, y actualizar el estado de las existentes.
4. Añadir ADR nuevas al final de `decisiones.md`, y añadir bloques de «Resultado» o «Actualización» al final de una ADR ya existente.
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
4. Borrar entradas de bitácora, ADR o filas del backlog. Lo que se descarta se marca
   como descartado, con su motivo; no se elimina.
5. Cerrar una iteración por su cuenta ni marcar una épica como completada.

---

## Convenciones

- **Fechas** en formato `AAAA-MM-DD`.
- **Nombres de archivo** en minúsculas, sin tildes ni eñes, separando con guiones.
- **Idioma:** español de Chile, en toda la documentación.
- Cuando un documento se refiera a un archivo del proyecto, se escribe su ruta completa desde la raíz del repositorio.