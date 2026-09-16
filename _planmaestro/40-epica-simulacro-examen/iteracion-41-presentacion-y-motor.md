# Iteración 41 · Presentación, extremo y motor del intento

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** épica 30 cerrada. Decisiones E2 y E3 de la épica resueltas.

## Objetivo

Crear `simulacro.html` con su pantalla de presentación, un extremo que entrega las 120
preguntas de un intento ya elegidas, y la maquinaria que sostiene el intento en el
navegador, todavía sin cronómetros.

## Contexto

El simulacro comparte con `cuestionario.html` el encabezado, el pie y el favicon. Lo que
cambia es que aquí hay un antes y un después: la página no arranca respondiendo, arranca
explicando.

**Por qué un extremo nuevo.** Decidido por el autor el 2026-09-16. El cuestionario pide un
módulo a la vez (iteración 31) para no bajar el banco entero. El simulacro necesita
preguntas de todos los módulos. Pedir cada módulo por separado multiplicaría las esperas,
y usar la instantánea de 499 557 B bajaría el banco completo. Un extremo que devuelve solo
las 120 preguntas elegidas es el camino más liviano para el navegador.

## Historial de este archivo

- **2026-09-04 · anotadas** las preguntas hermanas.
- **2026-09-16 · reescrita.** El autor eligió el extremo nuevo. Se agregó lo que hereda de
  la épica 30, se marcaron como pendientes el reanclaje de las preguntas hermanas a los ids
  de D1 y la transición de carga, y se movió a la iteración 43 el texto definitivo de las
  reglas, que depende de decisiones de la 42 y la 43.

## Lo que hereda

- **ADR-008 · modo degradado:** si la capa de datos no responde, el sitio usa la
  instantánea versionada y lo avisa. El simulacro también tiene que funcionar así
  (decisión E3 de la épica).
- **ADR-022:** las respuestas correctas viajan al navegador. El extremo puede enviarlas.
- **Iteración 34:** la justificación se dibuja escapada y está probada con contenido
  hostil. El simulacro no la muestra hasta el resumen (44).
- **Iteración 35:** la transición de carga acompaña la carga real con un piso, sin
  porcentaje, con el latido `animate-latido` definido en `tailwind.config.cjs`, y declara
  que un indicador «dura lo que dura la carga y ni un milisegundo más».
- **Épica 50, pendiente registrado:** `?resumen=1` lee 1111 filas. Un extremo que elige al
  azar puede leer la tabla entera en cada intento.

## Decisiones tomadas

### 1 · Un extremo nuevo entrega el intento ya armado

Decidido por el autor el 2026-09-16. El servidor elige las preguntas, aplica el reparto
por módulo y excluye los pares hermanos. El navegador recibe el intento listo.

## Decisiones sin resolver

### 2 · El segundo extra en la transición de carga (la decide el autor)

El autor propuso el 2026-09-16 una animación que dure lo que tarde el extremo **o un
segundo extra**, para dar tiempo a que todo cargue.

**Choca con la iteración 35**, que dejó escrito que una espera fija miente y que el
indicador dura lo que dura la carga y nada más. Además, un segundo extra no da tiempo a
nada: el navegador dibuja cuando los datos llegaron, no antes ni después.

- **Reutilizar la transición de la 35** (recomendada): el latido acompaña la carga real con
  su piso, y al llegar el intento se muestra. Si la carga tarda más de lo normal, se dice.
- **Agregar el segundo extra**: exige enmendar el criterio «nadie espera de más» de la 35
  para esta página, con su motivo escrito.

**Pendiente.**

### 3 · Reparto por módulo y banco insuficiente (se propone con evidencia)

El reparto se define con los conteos reales por módulo del banco vigente, y se justifica
por escrito. Hay que decidir qué pasa si un módulo no alcanza su cuota: completar con otros
módulos, o entregar un intento más corto. **Pendiente**, con los conteos medidos a la vista.

### 4 · Dónde viven las preguntas hermanas (se propone tras la lectura de alcance)

La tabla de abajo cita archivos que ya no existen (`modulo-0X.json`,
`static/js/data/cuestionario.js`). Hay que reanclarla a los ids de D1 y decidir dónde vive
la lista: en la base, en el código del extremo o en un archivo versionado. El modo
degradado (E3) también tiene que respetarla. **Pendiente.**

### 5 · Cómo se protege un intento en curso (decisión E2 de la épica)

El aviso nativo del navegador al abandonar la página es poco confiable en teléfonos. Hay
que decidir si el intento sobrevive a una recarga o a que el teléfono cierre la pestaña, y
cómo, sabiendo que en el examen real no se puede volver atrás. **Pendiente.**

## Tareas

- [ ] Reanclar las preguntas hermanas a los ids de D1 (decisión 4).
- [ ] Crear `simulacro.html` con el encabezado, el pie y el favicon del resto del sitio,
  sobre fondo negro.
- [ ] Pantalla de presentación con un botón de inicio, que es lo único que arranca el
  intento. El texto definitivo de las reglas se cierra en la 43.
- [ ] Extremo que devuelve un intento de 120 preguntas con el reparto por módulo y sin
  pares hermanos.
- [ ] Motor del intento en el navegador: recibe el intento y sostiene su estado.
- [ ] Transición de carga según la decisión 2.
- [ ] Comportamiento en modo degradado según E3.
- [ ] Protección del intento en curso según E2.
- [ ] Enlazar el simulacro desde el menú, el pie y `index.html`.
- [ ] Documentar el extremo en una ADR nueva.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento.

### Los provoca Claude Code

- [ ] **`simulacro.html` usa el mismo encabezado, pie y favicon** que el resto, y el fondo
  de la página es `ink`.
- [ ] **Nada del intento ocurre hasta pulsar el botón de inicio**: antes de pulsarlo no se
  pide el extremo.
- [ ] **Un intento trae exactamente 120 preguntas, sin repetidas**, comprobado sobre una
  muestra de intentos generados.
- [ ] **El reparto por módulo se cumple en cada intento de la muestra** y está documentado
  con los conteos del banco vigente.
- [ ] **Ningún intento de la muestra contiene dos preguntas del mismo par hermano**, ni dos
  del trío, con la lista ya anclada a ids.
- [ ] **Dos intentos no son idénticos**, y se informa cuántas preguntas comparten en
  promedio sobre la muestra.
- [ ] **Con un banco insuficiente para el reparto**, simulado interceptando la respuesta,
  el comportamiento es el decidido.
- [ ] **La respuesta del extremo no incluye preguntas inactivas ni descartadas.**
- [ ] **El extremo informa cuántas filas lee por intento**, para la épica 50.
- [ ] **En modo degradado, el intento se arma desde la instantánea** con las mismas reglas
  de reparto y hermanas, y el aviso de ADR-008 queda visible.
- [ ] **La transición de carga cumple la decisión 2**, medida desde el clic.
- [ ] **Una carga fallida del intento no deja la transición colgada** y muestra un mensaje
  útil.
- [ ] **Todo texto que venga del banco se dibuja escapado**: `probar:escapado` lo cubre en
  el simulacro.
- [ ] **El intento en curso se comporta según E2** al recargar, provocado en el guion.
- [ ] **El simulacro es alcanzable desde el menú, el pie y la portada.**

### Los comprueba el autor en el navegador

- [ ] **La presentación se entiende sin tecnicismos**, leída en el teléfono.
- [ ] **La transición de carga no se siente como una espera de más** con buena conexión, y
  acompaña con la red limitada.
- [ ] **Recargar o salir con un intento en curso** se comporta según E2, en escritorio y
  en teléfono.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0.**

## Preguntas hermanas

*Anotado el 2026-09-04, al revisar el solapamiento entre los dos bancos. Actualizado el
mismo día, tras aplicar los retiros de la iteración 24.*

> **⚠️ 2026-09-16 · esta tabla está desanclada.** Cita `modulo-0X.json` y posiciones de
> `static/js/data/cuestionario.js`, que ya no son la fuente del banco. La columna
> «Se rozan en» es la única forma fiable de encontrar cada pregunta en D1. Reanclarla es la
> primera tarea de esta iteración (decisión 4).

Diez pares que **no son duplicados**: cada pregunta evalúa algo distinto y por eso ninguna
se retiró. Pero se rozan tanto —dos caras del mismo tema, dos propiedades del mismo objeto,
una la pista de la otra— que sacarlas juntas en el mismo intento convierte una en la
respuesta de la otra.

| Par (cita original) | Posición vieja al 2026-09-04 | Se rozan en |
|---|---|---|
| m08#3 ↔ M8·2 | M8·1 | cómo nombrar un endpoint / cómo estructurar el de un recurso concreto |
| m05#38 ↔ M5·13 | M5·10 | objetivo de normalizar / objetivo de la 3FN, que es un caso del anterior |
| m05#33 ↔ M5·13 | M5·10 | dependencia transitiva / objetivo de la 3FN |
| m05#30 ↔ M5·12 | M5·9 | entidad fuerte / entidad débil: cada definición insinúa la otra |
| m02#26 ↔ M2·8 | M2·6 | evento `change` / evento `blur` |
| m07#12 ↔ M7·7 | M7·5 | `rows` / `rowCount`, dos propiedades del mismo objeto |
| m05#26 ↔ M5·11 | M5·8 | `DROP` / `TRUNCATE`, que a su vez se contrasta con `DELETE` |
| m05#16 ↔ M5·10 | M5·7 | qué ocurre al violar una llave foránea / qué restricción la impone |
| m02#25 ↔ M3·7 | M3·5 | `let` sobre `var` al iterar / iteradoras globales en ciclos anidados |
| m03#33 ↔ M3·13 | M3·10 | notación de corchetes / notación de punto |

**M5·13 aparece dos veces**, con `m05#38` y con `m05#33`: ahí no hay un par sino un trío,
y el motor no puede tratarlo como dos restricciones sueltas.

**Avisos sobre esta lista:**

1. Eran once. `m08#23 ↔ M8·11` desapareció al retirarse `M8·11` en la iteración 24.
2. Hay que comprobar que los veinte ids sigan activos en el banco vigente; si alguno se
   retiró, el par desaparece.
3. La lista sale de `npm run informe-banco`, que compara **redacción**, no significado.
   Cumplir el criterio garantiza que no salgan **estas** preguntas juntas, no que no salgan
   dos preguntas parecidas.

## Lo que esta iteración no puede afirmar

- **Que un intento no se pueda inspeccionar**: las respuestas viajan al navegador
  (ADR-022).
- **Que dos intentos seguidos no repitan preguntas**: sin historial de intentos, cada uno
  se elige sin saber del anterior.

## Notas de la iteración

_Pendiente._