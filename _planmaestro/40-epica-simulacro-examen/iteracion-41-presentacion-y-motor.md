# Iteración 41 · Presentación, selección y protección del intento

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** épica 30 cerrada, y la actualización de ADR-022 escrita en `decisiones.md`.
**Siguiente en el orden de trabajo:** iteración 45.

## Objetivo

Crear `simulacro.html` con su pantalla de presentación, elegir en el navegador las 120 preguntas de un intento, traerlas
con un extremo de solo lectura, y guardar el intento para que sobreviva a una recarga, todavía sin cronómetros ni
recorrido.

## Contexto

La página no arranca respondiendo, arranca explicando. Esta iteración deja lista la maquinaria sobre la que la 42, la 43
y la 44 construyen: un intento elegido, cargado, guardado y protegido.

## Historial de este archivo

- **2026-09-04 · anotadas** las preguntas hermanas.
- **2026-09-16 · reescrita dos veces**, la segunda tras la lectura de alcance de la épica. El autor cambió la
  arquitectura: el navegador elige y el extremo solo sirve. Las preguntas hermanas quedaron ancladas a ids de D1.

## Lo que hereda

- **ADR-008 · modo degradado:** si la capa de datos no responde, se usa la instantánea y se avisa.
- **ADR-009:** el Worker público solo expone lectura. El extremo nuevo es de lectura y no la amplía.
- **ADR-022 con su actualización del 2026-09-16:** las respuestas correctas viajan al navegador; el vocabulario del
  resultado es el del README de la épica.
- **ADR-033:** `?resumen=1` entrega los ids activos de cada módulo. Hoy lee 1111 filas por petición (pendiente de la
  épica 50).
- **ADR-034 y su actualización del 2026-09-15:** el espacio `examen-td-js.simulacro.` está reservado; la versión va dentro
  del dato; un dato que no se entiende se ignora; se guarda al ocurrir, no al salir.
- **Iteración 35:** la transición de carga (`dibujarTransicion()`, `cargaEnCurso`, `abrirLaCarga()`, `cerrarLaCarga()`,
  `esperarElPiso()`, `decirQueEstaTardando()`) con su piso de 400 ms y su aviso de carga lenta. **Hoy está dentro de
  `cuestionario.js`, sin exportar, y `fijarControlesDelPanel()` está cableada a `#reiniciar` y `#repaso`.**
- **`utils/dom.js`:** `esc()`, `shuffle()` y `prefersReducedMotion()` se reutilizan tal cual.
- **Lo que no se hereda:** el sitio no usa hoy `beforeunload`, `pagehide`, `visibilitychange` ni `sessionStorage`. Todo
  lo del ciclo de vida de la página es nuevo.

## Decisiones tomadas

Todas del autor, 2026-09-16.

### 1 · El navegador elige; el extremo solo sirve

- El navegador parte de los ids por módulo de `?resumen=1`, elige y pide las elegidas a un extremo **de solo lectura que
  devuelve preguntas por id**, sin elegir ni repartir.
- En modo degradado, **el mismo código** elige desde la instantánea. No hay una segunda copia del algoritmo.
- **Las justificaciones no viajan con el intento** (se piden en la 44).
- Motivos: `vision.md:68-70` deja fuera de alcance un servidor que haga más que servir el banco; y el proyecto ya
  decidió no duplicar lógica entre el extremo y el respaldo (`generar-instantanea.mjs` importa las consultas de
  `preguntas.js` por eso).
- Se documenta en una **ADR nueva**, que incluye por qué este extremo **no puede cachearse nunca** (`cache-control:
  no-store`), para cuando la iteración 53 revise esa cabecera.

### 2 · Reparto parejo

**17 preguntas por módulo, y la número 120 en un módulo elegido al azar.** Cada módulo pesa lo mismo y el resumen compara
sin trampa. Conteos al 2026-09-16 (instantánea sellada el 2026-09-10): módulo 2: 52 · 3: 61 · 4: 61 · 5: 49 · 6: 52 ·
7: 48 · 8: 45. Todos alcanzan con holgura.

### 3 · Exclusión de preguntas hermanas en todo el intento

La exclusión es **global al intento**, no por módulo: un par cruza del módulo 2 al 3. La lista vive en un **archivo de
datos versionado dentro de `static/js/`**, que usan igual el camino normal y el degradado.

### 4 · Reservas hasta 120

Si la validación descarta alguna pregunta elegida, **se completa con reservas** respetando reparto y exclusión. Si aun
así no se reúnen 120, **el intento no empieza** y se explica por qué. Un intento siempre tiene 120 preguntas.

### 5 · El intento se guarda al ocurrir y se retoma

- Se guarda en el navegador, bajo `examen-td-js.simulacro.`, **al empezar y en cada cambio**, nunca al salir.
- Se guardan **las preguntas tal como llegaron**, no solo sus ids: una corrección del banco no cambia un intento empezado.
  Esto se aparta a propósito de la regla central de ADR-034 (recalcular contra el banco vigente), y la ADR nueva lo
  dice.
- Al volver a la página con un intento en curso, se retoma. (Cómo cuenta el tiempo al volver es de la 42.)
- Si no hay almacenamiento, el intento funciona durante la visita y se avisa que no sobrevive a una recarga, con el
  patrón del aviso del cuestionario.

### 6 · Una sola pestaña escribe el intento

La pestaña que abre último **toma el intento**, y la otra **se bloquea con un aviso** («Este intento continúa en otra
pestaña» o similar). Nunca hay dos pestañas escribiendo el mismo intento.

### 7 · La transición de carga es la de la iteración 35

Mientras llegan las preguntas se muestra la transición de la 35 con su piso y su aviso de carga lenta. Sin espera
adicional. Para usarla fuera del cuestionario hay que **extraerla** a un módulo propio, con los controles a desactivar
como parámetro.

## Decisiones sin resolver

### 8 · Encabezado y pie (la decide el autor tras la lectura de alcance)

Hoy el encabezado y el pie son **HTML copiado a mano** en `index.html` y `cuestionario.html`, y las dos copias ya
difieren en 14 de 32 líneas. El simulacro puede ser una tercera copia o motivar extraerlos a una pieza única, lo que toca
las otras dos páginas. **Pendiente**, con el costo de cada camino medido en la lectura.

## Tareas

- [ ] Escribir la ADR nueva de la decisión 1, con las decisiones 4 y 5 como consecuencias.
- [ ] Extraer la transición de carga de la 35 a un módulo reutilizable, sin cambiar lo que ve el cuestionario.
- [ ] Crear el archivo de datos de preguntas hermanas con los ids de la tabla de abajo.
- [ ] Crear el extremo de solo lectura que devuelve preguntas por id, con la validación existente.
- [ ] Crear el algoritmo de selección con reparto, exclusión y reservas, usado por los dos caminos.
- [ ] Crear `simulacro.html` sobre fondo `ink`, con encabezado, pie y favicon según la decisión 8.
- [ ] Pantalla de presentación con un botón de inicio, que es lo único que arranca el intento. El texto de las reglas es
  provisional: se cierra en la 43.
- [ ] Guardar y retomar el intento (decisión 5) y bloquear la segunda pestaña (decisión 6).
- [ ] Registrar `simulacro.html` en `scripts/build-dist.mjs` (listas de `:64-70`), para que llegue a `dist/`.
- [ ] Enlazar el simulacro desde el menú de escritorio y móvil y el pie de las dos páginas, y desde `index.html`.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento.

### Los provoca Claude Code

**Selección**

- [ ] **Sobre una muestra de al menos 200 intentos generados**, cada intento trae exactamente 120 preguntas, sin
  repetidas, y todas activas.
- [ ] **Cada intento de la muestra cumple el reparto**: 17 por módulo y un módulo con 18. Se informa cuántas veces le tocó
  el extra a cada módulo.
- [ ] **Ningún intento de la muestra contiene dos preguntas de un mismo par hermano**, incluido el par que cruza de módulo
  (25 ↔ 107) y el trío (205, 210, 222).
- [ ] **Se informa cuántas preguntas comparten en promedio dos intentos** de la muestra, junto al valor esperado por azar
  (unas 39). Un promedio muy por encima del esperado es rojo.
- [ ] **Con el modo degradado provocado**, el intento se elige desde la instantánea con el mismo código, y el aviso de
  ADR-008 queda visible.
- [ ] **El algoritmo existe una sola vez**: el camino normal y el degradado importan la misma función.
- [ ] **Con una pregunta elegida descartada por la validación**, simulado interceptando la respuesta, el intento se
  completa con reservas y sigue teniendo 120.
- [ ] **Con descartes que impiden reunir 120**, simulado interceptando, el intento no empieza y la pantalla lo explica.

**Extremo**

- [ ] **El extremo devuelve exactamente las preguntas pedidas por id**, sin justificaciones, con el mismo contrato y
  validación que `?modulo=N`.
- [ ] **El extremo rechaza lo que no es lectura** y una lista de ids mal formada, con los errores de `_comun.js`.
- [ ] **Se informan las filas leídas por intento** (resumen + extremo), para la épica 50.
- [ ] **La respuesta lleva `cache-control: no-store`.**

**Carga y guardado**

- [ ] **Nada del intento ocurre hasta pulsar el botón de inicio**: antes no se pide el extremo ni se escribe nada.
- [ ] **La transición de carga es la de la 35**, medida desde el clic: `max(carga, 400 ms)`, con el aviso de carga lenta a
  su plazo.
- [ ] **El cuestionario sigue igual** tras extraer la transición: `probar:filtrado` en verde, con sus mediciones.
- [ ] **El intento queda guardado bajo `examen-td-js.simulacro.`** apenas empieza, con versión dentro del dato y las
  preguntas completas.
- [ ] **Simulando una recarga**, el intento se retoma con las mismas 120 preguntas en el mismo orden.
- [ ] **Con el banco cambiado entre la carga y la recarga**, simulado interceptando, el intento retomado conserva las
  preguntas como llegaron.
- [ ] **Un dato guardado corrupto o de otra versión se ignora** sin romper la página.
- [ ] **Con dos pestañas simuladas**, la última toma el intento y la otra queda bloqueada con aviso; ninguna escritura de
  la bloqueada llega al almacén.
- [ ] **Sin almacenamiento**, el intento empieza y se muestra el aviso de que no sobrevive a una recarga.

**Página**

- [ ] **Todo texto que venga del banco se dibuja escapado**: se agrega a `probar:escapado` un bloque para el simulacro.
- [ ] **`simulacro.html` llega a `dist/`**: `npm run build` lo lista y no informa recursos rotos.
- [ ] **El simulacro es alcanzable** desde el menú de escritorio, el menú móvil y el pie de las dos páginas, y desde la
  portada: se comprueba sobre el HTML.
- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **La presentación se entiende sin tecnicismos**, leída en el teléfono.
- [ ] **La transición de carga se siente igual que en el cuestionario**, con buena conexión y con la red limitada.
- [ ] **Recargar a mitad del intento lo retoma**, en escritorio y en teléfono.
- [ ] **Abrir el simulacro en una segunda pestaña** bloquea la primera con un aviso claro.
- [ ] **Los enlaces al simulacro** funcionan desde el menú, el pie y la portada, en escritorio y en teléfono.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0**, con `npm run datos:dev` levantado.

## Preguntas hermanas

*Anotadas el 2026-09-04. Ancladas a ids de D1 el 2026-09-16 en la lectura de alcance de la épica, con
`origen`/`modulo`/`numero_origen` contra `d1/respaldo-banco.sql`; los veinte enunciados coinciden con su descripción.*

Diez relaciones que **no son duplicados**: cada pregunta evalúa algo distinto. Pero se rozan tanto que sacarlas juntas
en el mismo intento convierte una en la respuesta de la otra.

| Par (cita original) | Se rozan en | id A | id B | Módulos |
|---|---|---|---|---|
| m08#3 ↔ M8·2 | cómo nombrar un endpoint / cómo estructurar el de un recurso | 326 | 360 | 8 / 8 |
| m05#38 ↔ M5·13 | objetivo de normalizar / objetivo de la 3FN | 210 | 222 | 5 / 5 |
| m05#33 ↔ M5·13 | dependencia transitiva / objetivo de la 3FN | 205 | 222 | 5 / 5 |
| m05#30 ↔ M5·12 | entidad fuerte / entidad débil | 202 | 221 | 5 / 5 |
| m02#26 ↔ M2·8 | evento `change` / evento `blur` | 26 | 45 | 2 / 2 |
| m07#12 ↔ M7·7 | `rows` / `rowCount` | 287 | 318 | 7 / 7 |
| m05#26 ↔ M5·11 | `DROP` / `TRUNCATE`, contrastados con `DELETE` | 198 | 220 | 5 / 5 |
| m05#16 ↔ M5·10 | violar una llave foránea / qué restricción la impone | 189 | 219 | 5 / 5 |
| m02#25 ↔ M3·7 | `let` sobre `var` al iterar / iteradoras globales anidadas | 25 | 107 | **2 / 3** |
| m03#33 ↔ M3·13 | notación de corchetes / notación de punto | 85 | 112 | 3 / 3 |

**Lo que el motor tiene que saber:**

1. **Son 19 preguntas, no 20.** El id 222 está en dos filas: **205, 210 y 222 forman un trío**, del que un intento puede
   traer como máximo una.
2. **El par 25 ↔ 107 cruza módulos**: una exclusión aplicada dentro de cada módulo no lo ve.
3. **El módulo 5 aporta 9 de sus 49 preguntas** a la lista. Aun así alcanza para su cuota.
4. La lista sale de `npm run informe-banco`, que compara **redacción**, no significado. Cumplir el criterio garantiza que
   no salgan **estas** juntas, no que no salgan dos parecidas.
5. Si una de estas preguntas se retira del banco, su fila deja de aplicar; el archivo de datos debe tolerarlo.

Las citas `m0X#N` remiten a `_planmaestro/00_producto/cuestionarios/modulo-0X.json`, conservados por ADR-031.

## Lo que esta iteración no puede afirmar

- **Que un intento no se pueda inspeccionar**: las respuestas viajan al navegador (ADR-022).
- **Que dos intentos seguidos no repitan preguntas**: sin historial, cada uno se elige sin saber del anterior.
- **Que un intento sobreviva a borrar los datos del navegador** o a cambiar de dispositivo.

## Notas de la iteración

_Pendiente._