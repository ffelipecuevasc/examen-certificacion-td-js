# Iteración 25 · Módulo 7 · el penúltimo lote, y el primero sin ninguna sorpresa

**Épica:** 20 · Persistencia de preguntas · **Cerrado:** 2026-09-10

## Qué se entregó

Las **48 preguntas del módulo 7** —38 del banco nuevo y 10 del viejo— cargadas en
producción, comprobadas contra los dos archivos de origen y publicadas. El banco pasó
de **275 a 323 preguntas**, y el sitio muestra seis módulos.

Con una corrección: **`m07#24`**, el tercer y último ítem con dos respuestas correctas.

**Queda un solo lote:** el módulo 8, con 45 preguntas —36 del banco nuevo y 9 del
viejo—. Con él se cierran las 368.

## Qué salió distinto de lo planeado

**Nada, y es la primera vez que se puede decir así de limpio.** Todo lo que se anunció
antes de cargar se cumplió: el conteo, el reparto por origen, las siete retiradas
ausentes, el reparto de H-004 y el peso de la instantánea. Es el tercer lote seguido
sin hallazgos nuevos.

### La predicción del CSS acertó por segunda vez

Antes de cargar se pasó por Tailwind el texto completo del lote —enunciados,
alternativas y las 48 justificaciones— y no emitió **ninguna** clase. Se anunció por
escrito que el lote iría con **dos** archivos generados en vez de tres, y
`npm run verificar` respondió `VERIFICADO`.

**Con dos aciertos seguidos, H-031 deja de ser una sorpresa y pasa a ser un dato que se
consulta.** En el módulo 4 el mismo fenómeno rompió el despliegue; en el 6 se predijo
por primera vez; aquí se confirmó que la predicción es repetible.

### La tercera corrección de la misma clase, y era la última

`m07#24` preguntaba qué comando confirma los cambios de una transacción, marcaba
`COMMIT` —correcta— y ofrecía **`END TRANSACTION`**: en PostgreSQL, que es el motor de
todo este módulo, `END` es sinónimo de `COMMIT`. **Es literalmente el mismo distractor
que tenía `m05#18`.**

**Se rastreó el banco entero antes de corregir** —los siete archivos del banco nuevo y
el banco viejo completo— buscando distractores que fueran sinónimos válidos:
`END TRANSACTION`, `START TRANSACTION`, `npm create`. **Éste era el último.** Los otros
dos ya estaban corregidos y `m07#21` llevaba aplicada su corrección del 2026-09-04.

**El reemplazo no fue el mismo que en `m05#18`, y esa decisión merece quedar escrita.**
Se descartó reusar `CHECKPOINT` porque las dos preguntas son casi la misma —ambas
preguntan por `COMMIT`— y `m05#18` había quedado con `SAVEPOINT / COMMIT / CHECKPOINT /
FLUSH PRIVILEGES`. Ponerlo aquí habría dejado **tres de cuatro alternativas idénticas**
entre dos ítems del banco. Los duplicados por redacción distinta son deseables —decisión
del 2026-09-09— pero **dos ítems con las mismas alternativas ya no son dos preguntas**.

Se eligió **`RELEASE SAVEPOINT`**: real en PostgreSQL, no confirma nada —elimina un
punto de guardado y deja la transacción abierta—, y hace juego con la alternativa (a),
que es `SAVEPOINT`. Tienta a quien conoce los savepoints a medias.

## Decisiones tomadas

Ninguna ADR nueva. Se aplicaron ADR-028 —que **se disparó sola** al tocar el origen— y
ADR-017 para decidir la corrección.

**Las tres correcciones de esta clase quedan como un grupo con nombre propio:**
`m05#18`, `m06#15` y `m07#24`. Ninguna es ADR-029 —en las tres la alternativa correcta
era correcta— sino **un distractor que también lo era**. La regla que aplica es la del
retiro de `m07#21`: un ítem con dos respuestas correctas es un error y se corrige; un
distractor flojo no.

## Hallazgos

Ninguno nuevo. Tercer lote consecutivo sin hallazgos.

## Queda pendiente

- **La causa del 7403**, transitorio y sin explicación. No apareció.
- **H-019, el defecto** de lectura del sobre de error.
- **H-029**, en amarillo desde el módulo 5. No ha vuelto a aparecer.
- **El tercer camino de H-031**, con su condición escrita.
- **Las dos barreras leídas y no provocadas**, y el ensayo del manual de la 23.

> ### El peso de la instantánea, con tres puntos y una decisión que vence
>
> | Preguntas | Peso |
> |---|---|
> | 223 | 297 kB |
> | 275 | 367 kB |
> | 323 | **430 kB** |
>
> Los incrementos medidos —**1 389** y **1 341 bytes por pregunta**— son consistentes.
> **Proyección con las 368: 490 kB**, la misma cifra que salía con dos puntos.
>
> **Quedan 45 preguntas y el archivo va a rondar el medio mega.** Sigue valiendo lo
> dicho desde el módulo 5: es mucho para algo que el navegador **solo carga cuando la
> capa de datos cae**. **El módulo 8 es la última oportunidad de decidir** —aceptarlo,
> comprimirlo o recortarlo— antes de que el banco esté completo.

## H-004 · sexto dato, el más extremo, y una partición que se sostiene

| Lote | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|
| Módulo 2 · 52 | 23% | **40%** | 29% | 8% |
| Módulo 3 · 61 | 16% | **39%** | 30% | 15% |
| Módulo 4 · 61 | 18% | **38%** | 34% | 10% |
| Módulo 5 · 49 | 12% | **49%** | 35% | 4% |
| Módulo 6 · 52 | 17% | **48%** | 31% | 4% |
| Módulo 7 · 48 | 17% | **56%** | 23% | 4% |

**Más de la mitad de las preguntas del módulo 7 tienen su correcta en el segundo
lugar.** Y la forma anotada en el módulo 6 se sostiene y se acentúa:

- **Módulos 2, 3 y 4** — front y JavaScript: **40, 39, 38 %**, bajando.
- **Módulos 5, 6 y 7** — bases de datos, Node y acceso a datos: **49, 48, 56 %**.

La posición 4 acompaña: **4 % en los tres** del grupo alto, contra 8-15 % en el bajo.

**Seis lotes, y el corte ya no depende de dos puntos.** Queda el módulo 8, que
pertenece al mismo bloque temático que el grupo alto: si cae ahí, la partición queda
establecida; si cae en el bajo, hay que buscar una explicación que no sea el tema.
