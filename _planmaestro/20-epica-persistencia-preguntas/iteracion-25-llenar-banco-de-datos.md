# Iteración 25 · Llenar el banco

**Épica:** 20 · Persistencia de preguntas
**Estado:** ⚪ No iniciada
**Depende de:** iteración 24, que deja producción con esquema y vacía

## Objetivo

Llevar las 368 preguntas de los dos bancos a D1 sin perder ni inventar nada, dotar
de justificación a las que se publiquen, generar la instantánea desde la nube —lo
que subsana ADR-023— y retirar el banco viejo una vez confirmada la carga.

## De dónde sale el contenido, y cuánto es

Verificado el 2026-09-08 contando los archivos, no de memoria:

| Banco | Dónde vive | Formato | Preguntas |
|---|---|---|---|
| Nuevo | `_planmaestro/00_producto/cuestionarios/modulo-02.json` … `modulo-08.json` | `enunciado`, `alternativas` con letra, `correcta` como letra | 285 |
| Viejo | `static/js/data/cuestionario.js` | `q`, `opciones`, `correcta` como índice numérico, `fijo` | 83 |
| | | **Total a cargar** | **368** |

Las dos cifras son **posteriores** a los retiros por solapamiento del 2026-09-04:
el banco nuevo bajó de 300 a 285 y el viejo de 105 a 83. Las 37 retiradas están
íntegras en `retiradas.json` y **no se cargan**.

Comprobado además sobre las 285: ningún par `(modulo, numero)` repetido, ningún
enunciado duplicado, todas con exactamente cuatro alternativas y una letra correcta
válida.

**No es una migración que reemplaza: es una unión.** Los dos bancos suman. Esto se
decidió el 2026-09-04 y cambia el sentido de todo lo que sigue.

## El problema central de esta iteración

**Ninguno de los dos bancos tiene la forma que come la herramienta, y a los dos les
faltan campos que nadie ha escrito.**

El encargo que consume `banco:insertar` pide `origen`, `numero_origen`,
`justificacion`, `dificultad`, `estado`, `orden_fijo` y `es_correcta` por
alternativa. Esos nombres son las columnas del esquema desde la iteración 14, y
ADR-011 exige que coincidan. **Ninguno de los dos bancos los trae.**

De ahí salen dos trabajos distintos que conviene no confundir:

- **Conversión de forma.** Mecánica y verificable: pasar de `q`/`opciones`/índice a
  `enunciado`/`alternativas`/`es_correcta`. Un programa puede hacerla y otro puede
  comprobarla.
- **Contenido que no existe.** `justificacion` y `dificultad` no están en ninguna
  parte. **No se pueden convertir: hay que escribirlos.**

> ## ⚠️ La regla que define esta iteración
>
> **Ningún campo ausente se rellena para que la validación pase.**
>
> Esto ya ocurrió en este proyecto: un agente marcó las 39 preguntas del módulo 2
> como dificultad «difícil» sin que nadie las clasificara, y escribió «Pendiente de
> redacción» como justificación, con lo que pasaban los controles sin tener
> justificación de verdad. Ese trabajo se descartó entero por eso.
>
> La salida correcta no es inventar: es cargar en **`borrador`**, que es un estado
> legítimo y que el estudiante no ve. Una pregunta sin justificación se carga en
> borrador y espera. Pasa a `activa` cuando alguien escribe el porqué.

## Decisiones de diseño sin resolver

Dos, y ninguna se resuelve empezando a cargar.

**1. ¿Qué se hace con la marca de orden fijo?** Hay **exactamente una** pregunta con
`fijo: true` en los dos bancos: la del comando de Git que crea una rama y cambia a
ella, cuya alternativa (d) dice «Ambas B y C son correctas». Esa marca vive **sólo**
en `static/js/data/cuestionario.js`, y esta iteración retira ese archivo. Si se
retira antes de rescatarla, la información desaparece sin que nada avise y una
pregunta cuyas alternativas se refieren entre sí pasa a barajarse. **El rescate va
antes del retiro.**

> **Corrección de un dato heredado, comprobada el 2026-09-08.** Documentos
> anteriores sitúan esa pregunta en la **posición 13** del módulo 2. Hoy está en la
> **posición 11**: los retiros por solapamiento sacaron dos preguntas de ese módulo
> y las posiciones se corrieron. Es un ejemplo exacto de por qué una referencia
> posicional no sirve como identificador, y de por qué el banco nuevo no se
> renumeró.

**2. ¿En qué estado entra cada banco?** Las 368 no tienen justificación. Cargarlas
todas en `borrador` deja el sitio publicado sin contenido visible hasta que se
redacten 368 justificaciones, que es mucho trabajo. Las salidas no son equivalentes:

- Todo en `borrador`, y se van activando por módulo a medida que se redacta.
- Un subconjunto en `activa` con justificación escrita primero, y el resto en
  borrador.
- Redactar las 368 antes de cargar nada.

Quien decida esto lo documenta aquí con su motivo. Lo que **no** es una salida es
activar preguntas sin justificación: la propia herramienta lo impide, y hace bien.

## Tareas

### Conversión

- [ ] Convertir las 285 del banco nuevo al formato de encargo.
- [ ] Convertir las 83 del banco viejo, que tiene un formato distinto: `correcta` es
  un índice numérico, no una letra, y hay que traducirlo sin equivocarse de
  desplazamiento.
- [ ] Asignar `origen` según el banco de procedencia, respetando el `CHECK` del
  esquema: `json_2026` y `js_2026`.
- [ ] Rescatar la marca de orden fijo antes de retirar el banco viejo.
- [ ] Comprobar que la conversión no perdió ni alteró nada, contra los archivos de
  origen y no contra la intención.

### Carga

- [ ] Cargar en producción con la herramienta de la iteración 23, por lotes.
- [ ] Comprobar que lo cargado coincide con los dos orígenes: ninguna pregunta
  perdida, ninguna correcta desplazada, ninguna duplicada por cargar un origen
  dos veces.
- [ ] Informar cuántas preguntas quedan sin justificación, agrupadas por módulo.
- [ ] Informar la distribución de la posición de la correcta por módulo (H-004).

### Contenido

- [ ] Redactar las justificaciones de las preguntas que se vayan a activar.
- [ ] Revisar las preguntas que el trabajo de redacción marque como dudosas. Una
  pregunta cuya correcta resulta no serlo vale más que veinte justificaciones.

### Cierre

- [ ] **Generar la instantánea desde producción** y commitearla. Cierra el criterio
  heredado de la iteración 22 y subsana ADR-023.
- [ ] Exportar `d1/respaldo-banco.sql` **en el mismo acto** que la instantánea
  (ADR-023): un solo paso produce las dos cosas, o no produce ninguna.
- [ ] Medir el peso de la instantánea con el banco completo y comprobar que el sitio
  la aguanta.
- [ ] Retirar `static/js/data/cuestionario.js` y `scripts/build-cuestionario.py`,
  dejando constancia en la bitácora.
- [ ] Publicar, al final, con el banco cargado.

> ## Incumplimiento consciente de ADR-023, declarado el 2026-09-08 por Felipe Cuevas
>
> *Trasladado desde la iteración 24 el 2026-09-08, sin cambiar su fecha ni su
> sentido: la iteración se partió en dos y este paso quedó en la segunda mitad.*
>
> ADR-023 exige que la instantánea se genere **desde la base de la nube**. La que se
> publica hoy salió de la **base local**: su sello lo dice sin ambigüedad
> —`"entorno": "local"`, `"base": "examen-td-js-produccion"`, generada el
> 2026-09-08— y `npm run build` lo avisa en cada compilación.
>
> **Motivo:** producción está vacía hasta esta iteración. No hay nube desde la cual
> generar, así que la alternativa a incumplir era no publicar, y se decidió publicar.
> Es una decisión tomada, no un olvido y no un pendiente que alguien vaya a
> descubrir después.
>
> **Alcance de lo que se acepta:** mientras dure, el respaldo que ve un estudiante si
> la capa de datos cae es el **banco de juguete**, no el banco real. El aviso de
> ADR-008 aparece igual y dice la verdad —«copia guardada», con su fecha—, así que el
> estudiante no queda engañado, pero sí queda con un banco que no le sirve.
>
> **Se subsana aquí y sólo aquí.** Hasta que este paso se ejecute y su archivo se
> commitee, ADR-023 sigue incumplida. No se marca esta casilla con una instantánea
> generada en local: sería repetir el incumplimiento y borrar el rastro de que alguna
> vez lo fue.

> **Publicar va la última, y eso es parte de la tarea.** `git push` a `main` dispara
> la construcción y publica solo, así que empujar **es** publicar. Antes de empujar,
> en este orden: banco cargado, `npm run datos:verificar-banco` en verde, instantánea
> regenerada desde producción con sello `"entorno": "nube"`, respaldo exportado en el
> mismo acto, y `npm run verificar` terminando en `VERIFICADO`. Si algo de esto no
> está, no se empuja: se anota qué falta y se empuja después.

## Criterios de aceptación

- [ ] **Las 368 están en D1 y suman lo que deben sumar.** Se compara lo cargado
  contra los dos orígenes y no hay diferencias. Se muestra el conteo por módulo
  y por origen.
- [ ] **Ninguna respuesta correcta se desplazó.** Se comprueba pregunta a pregunta
  contra el archivo de origen, no por muestreo. En el banco viejo, donde
  `correcta` es un índice, se muestra explícitamente que el índice 0 quedó como
  letra `a`.
- [ ] **Ningún campo se inventó.** Se demuestra que toda pregunta cargada sin
  justificación quedó en `borrador`, y que ninguna trae una justificación de
  relleno ni una dificultad que nadie asignó. Se muestra el conteo de
  `justificacion IS NULL` y de `dificultad IS NULL`.
- [ ] **Ninguna pregunta `activa` carece de justificación.** Se comprueba contra la
  base.
- [ ] **La marca de orden fijo sobrevivió.** La pregunta del comando de Git tiene
  `orden_fijo = 1` en D1, y se muestra **antes** de retirar el banco viejo.
- [ ] **Las 37 retiradas no se cargaron.** Se comprueba contra `retiradas.json`.
- [ ] **Existe la instantánea versionada y coincide con lo que hay en D1.** Criterio
  heredado de la iteración 22. Su sello dice `"entorno": "nube"`.
- [ ] **El respaldo y la instantánea salieron del mismo acto**, y van en el mismo
  commit.
- [ ] **El sitio aguanta el banco completo.** Se mide el peso de la instantánea y se
  comprueba `cuestionario.html` sin degradación perceptible, también en teléfono.
- [ ] **El contador de la portada dice la verdad** con el banco real cargado. Si la
  iteración 24 lo arregló, aquí se comprueba con 368 en vez de con 8.
- [ ] **`npm run verificar` termina en 0** con sus comprobaciones en OK.

## Lo que esta iteración no puede afirmar

- **Que el banco no tenga duplicados.** Los 82 pares candidatos salieron de
  **parecido de redacción**, no de entender el contenido. Dos preguntas sobre el
  mismo punto escritas con vocabulario distinto no están en esa lista y nadie las ha
  visto. **368 no significa «sin duplicados»**: significa «sin los duplicados que el
  parecido de redacción alcanzó a detectar».
- **Que las justificaciones sean correctas.** Que existan y que sean ciertas son dos
  cosas distintas, y sólo la primera se puede comprobar con un programa.
- **Que el sesgo de posición esté corregido.** H-004 se informa, no se arregla: el
  barajado lo neutraliza en pantalla.

## Retiros por solapamiento

*Aprobado por el autor el 2026-09-04, sobre la revisión de los 82 pares candidatos
que produjo `npm run informe-banco --todos`. **Aplicado el mismo día.***

**Se retira, no se reemplaza.** El banco quedó en **368 preguntas**: 285 del banco
nuevo y 83 del viejo, comprobado con `npm run informe-banco`. Los módulos quedan
disparejos —39/50/46/38/38/38/36 en el nuevo— y eso es aceptado a propósito:
cuadrar los números exigiría escribir 15 preguntas nuevas y no aporta nada al
reparto del simulacro.

**Nada se borró.** Las 37 preguntas retiradas están íntegras en
`_planmaestro/00_producto/cuestionarios/retiradas.json`, cada una con su origen, el
par del que salió y la razón del retiro. Se conservan por dos motivos: porque
**qué se hace con las preguntas retiradas es la decisión 3 de la iteración 21 y
todavía está abierta**, y porque una decisión editorial sobre 37 preguntas escritas
a mano merece poder revisarse.

**No se renumeró el banco nuevo.** El campo `numero` es el identificador con el que
todo el plan cita cada pregunta; renumerar rompería esas referencias en silencio.
La numeración queda con huecos legítimos, y `scripts/informe-banco.mjs` los lee
desde `retiradas.json` para distinguirlos de un hueco accidental.

`m0X#N` es la pregunta N de `modulo-0X.json`; `MX·N` es la posición N del módulo X
de `static/js/data/cuestionario.js`.

### Aprobados: 23 pares con razón concreta

| Par | Se retira | Por qué sobrevive la otra |
|---|---|---|
| m02#10 ↔ M2·2 | M2·2 | la nueva añade el ángulo de accesibilidad y el distractor `<div role="form">` |
| m02#15 ↔ M2·3 | M2·3 | las cuatro alternativas de la nueva son valores de `box-sizing` |
| m02#38 ↔ M2·14 | m02#38 | la nueva está inflada y sus distractores no son plausibles |
| m03#20 ↔ M3·8 | M3·8 | la correcta de la vieja es falsa: `do/while` sí evalúa la condición, solo que después |
| m04#6 ↔ M4·3 | m04#6 | la vieja compite contra pilares reales de POO |
| m04#24 ↔ M4·8 | m04#24 | la vieja incluye `stopImmediatePropagation()`, la confusión real |
| m04#33 ↔ M4·10 | m04#33 | la vieja evalúa un eslabón más: el problema y que las promesas lo resuelven |
| m04#46 ↔ M4·14 | m04#46 | la correcta de la vieja añade que `ok` queda en falso |
| m05#5 ↔ M5·4 | m05#5 | la vieja compite con cláusulas SQL que existen |
| m05#14 ↔ M5·8 | M5·8 | la nueva distingue el borrado fila a fila y registrado, y contrasta con `TRUNCATE` |
| m05#19 ↔ M5·7 | M5·7 | la nueva enumera los tres fenómenos y nombra el nivel Serializable |
| m05#25 ↔ M5·10 | m05#25 | la vieja nombra la integridad referencial y ofrece `PRIMARY KEY` |
| m06#9 ↔ M6·3 | M6·3 | la correcta de la nueva explica las dos mitades y nombra los callbacks |
| m06#23 ↔ M6·7 | m06#23 | la vieja evalúa el escapado automático y ofrece `{{{variable}}}` |
| m06#28 ↔ M6·10 | m06#28 | la vieja compite contra módulos que existen (`path`, `http`, `os`) |
| m07#1 ↔ M7·1 | M7·1 | la nueva sitúa la pregunta en `pg` con Node y nombra el costo de abrir conexiones |
| m07#37 ↔ M7·13 | m07#37 | la vieja nombra Sequelize y compite con los cuatro métodos reales |
| m08#4 ↔ M8·3 | m08#4 | la nueva nombra HATEOAS en el enunciado y luego pide su definición |
| m08#11 ↔ M8·7 | m08#11 | la correcta de la nueva son dos respuestas en una |
| m08#13 ↔ M8·6 | M8·6 | la vieja dice que 4xx indica «errores de sintaxis», que es falso |
| m08#15 ↔ M8·5 | M8·5 | la nueva evalúa además la idempotencia |
| m08#21 ↔ M8·9 | m08#21 | la vieja compite contra paquetes de Express que existen |
| m08#32 ↔ M8·12 | m08#32 | la vieja ofrece «Header, Body y Footer», el casi-acierto que separa al que sabe |

### Aprobado: el cuarteto de atomicidad

`m07#22`, `m05#17`, `M5·1` y `M7·10` preguntan las cuatro lo mismo —qué propiedad
ACID es la atomicidad— con las mismas cuatro alternativas. **No es un problema de
clasificación:** cada banco, por su cuenta, puso una en el módulo 5 y otra en el 7.
Que el detector las emparejara cruzadas es un accidente del umbral de parecido.

**Queda `m05#17`, en el módulo 5.** Se retiran `m07#22`, `M5·1` y `M7·10`. `m05#17`
describe el caso de fallo concreto en vez de repetir la definición de manual, y el
módulo 5 es su sitio porque ninguna de las dos del módulo 7 pregunta nada específico
de Node ni de PostgreSQL. Lo transaccional propio del módulo 7 ya lo cubre el par
`BEGIN`.

### Aprobado: 11 empates, resueltos por el autor

Las dos preguntas eran equivalentes en calidad. El autor las revisó una por una y
**en las once se quedó con la nueva**, por consistencia de formato. Se retiraron
las once viejas:

`M3·1` · `M3·2` · `M3·14` · `M5·14` · `M7·3` · `M7·8` · `M7·12` · `M8·1` ·
`M8·4` · `M8·8` · `M8·11`

Dos de esos empates dejaron cola:

- **`m08#24 ↔ M8·11`.** Al retirarse `M8·11`, el par hermano `m08#23 ↔ M8·11` de
  la iteración 41 desapareció: esa lista bajó de once a diez.
- **`m07#21 ↔ M7·8`.** Sobrevivió `m07#21`, y arrastraba un error de contenido:
  `START TRANSACTION` abre un bloque transaccional en PostgreSQL igual que `BEGIN`,
  así que la pregunta tenía dos respuestas correctas. **Corregido:** la alternativa
  (a) pasó a `SET TRANSACTION`, que existe, se parece y no abre nada —fija las
  características de la transacción en curso—. `INIT` y `OPEN` se dejaron como
  estaban, por ADR-017. Un ítem con dos respuestas correctas es un error y se
  corrige; un distractor flojo no.

### El banco viejo se editó a mano, y no había alternativa

`static/js/data/cuestionario.js` es un archivo generado, y la regla del proyecto
dice que los generados no se editan a mano sino a través de su generador. Aquí no
se pudo cumplir: `scripts/build-cuestionario.py` lee su entrada de
`/mnt/user-data/uploads`, una carpeta que **no existe en este equipo** —era el
directorio de subida de una sesión de Claude web—. Los markdown de origen no están
en el repositorio, así que el generador no se puede ejecutar y el `.js` es hoy la
única copia del banco viejo.

Se editó el `.js` directamente, respetando su formato exacto (misma cabecera, mismo
`json.dumps` con `indent=2`), y el archivo está versionado, así que el estado
anterior se recupera del historial. Esta iteración retira de todos modos el `.js` y
el `.py` una vez migrado el banco, con lo que el problema se cierra solo.

### El límite de todo lo anterior

Los 82 pares salieron de **parecido de redacción**, no de entender el contenido. Dos
preguntas sobre el mismo punto escritas con vocabulario distinto no están en la
lista y nadie las ha visto. **368 no significa «sin duplicados»**: significa «sin los
duplicados que el parecido de redacción alcanzó a detectar».

## Notas de la iteración

_Pendiente._