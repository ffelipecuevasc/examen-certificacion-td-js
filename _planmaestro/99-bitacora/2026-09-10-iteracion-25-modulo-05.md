# Iteración 25 · Módulo 5 · el lote que desmintió una mitigación

**Épica:** 20 · Persistencia de preguntas · **Cerrado:** 2026-09-10

## Qué se entregó

Las **49 preguntas del módulo 5** —38 del banco nuevo y 11 del viejo— cargadas en
producción, comprobadas contra los dos archivos de origen y publicadas. El banco pasó
de **174 a 223 preguntas**, y el sitio muestra cuatro módulos.

Con una corrección: **`m05#18`**, que tenía dos respuestas correctas.

## Qué salió distinto de lo planeado

**El paso 0 no evita el 7403, y eso desmiente lo que se escribió al añadirlo.**

Tras la carga del módulo 3 se agregó un paso 0 —`wrangler whoami`— con una hipótesis:
la sesión guardada se enfría entre carga y carga, y de ahí el **7403** de la primera
llamada. Se escribió que convertía «un fallo a mitad de carga en un fallo antes de
empezar».

En este lote se corrió el paso 0, **respondió con la cuenta**, y la llamada siguiente
falló con 7403 igual. A la vez siguiente, sin cambiar nada, funcionó.

| | |
|---|---|
| La sesión fría como causa suficiente | **refutada.** `whoami` la leyó y el 7403 llegó igual |
| El paso 0 como preventivo | **no funciona** |
| El 7403 | **transitorio**, y de causa desconocida |

**No se cambió una explicación cómoda por otra:** propagación del token, límite de tasa
o un problema pasajero del proveedor son candidatos, y ninguno está comprobado. Lo
único medido es que la sesión estaba viva.

**El paso 0 se conserva y cambia su motivo:** sigue siendo la forma barata de comprobar
que hay sesión antes de empezar, y ese fallo distinto sí existe y sí lo caza. Lo que se
corrigió es la expectativa escrita en el procedimiento.

**Y refuerza lo que H-019 ya decía:** el defecto de fondo —que el guion no sabe leer el
sobre de error con `notes: [...]`— sigue vivo, y ahora se sabe que el `SIN VEREDICTO`
va a seguir apareciendo. Dicho sin ironía: **menos mal**, porque era el único aviso de
que ese defecto existe.

**Lo que sí funcionó fue el mensaje corregido.** Al fallar, imprimió el comando exacto
para mirar la base, con el módulo sacado del sello del encargo y el permiso de ADR-015
incluido — justo lo que faltó en el módulo 3. **Se repitió la carga en vez de mirar**, y
no hubo daño: el conteo `174 → 223` es exactamente 49. Conviene anotar por qué no lo
hubo, que no es del todo suerte: el 7403 falló **antes** de escribir, y si hubiera
entrado a medias, el `UNIQUE (origen, modulo, numero_origen)` habría rechazado la
segunda pasada. **La red que sostuvo esto fue el esquema, no el procedimiento.**

**Una corrección, y de una clase que no estaba escrita.** `m05#18` preguntaba qué
comando asegura la persistencia tras un bloque DML, marcaba `COMMIT` —correcta— y
ofrecía `END TRANSACTION` como distractor. **En PostgreSQL, el motor del curso, `END` es
sinónimo de `COMMIT`**: el ítem tenía dos respuestas válidas y quien marcara esa no se
equivocaba. Reemplazada por `CHECKPOINT`, que existe, tienta justamente aquí porque
fuerza la escritura a disco —suena a «persistencia permanente»— y no confirma ninguna
transacción.

**La distinción que este caso obligó a fijar:** ADR-029 trata la alternativa
**correcta** que enseña una regla falsa, y ahí la salida es conservar y matizar. Aquí la
correcta era correcta y lo que fallaba era **un distractor que también lo era**. La
regla que aplica es la del retiro de `m07#21`: un ítem con dos respuestas correctas es
un error y se corrige; un distractor flojo no (ADR-017).

**El CSS no se movió.** Cuarenta y nueve justificaciones nuevas sobre SQL y `npm run
verificar` terminó en `VERIFICADO`: ninguna palabra del lote coincidió con una clase de
Tailwind. La primera cara de H-031 no se repitió, lo que confirma que depende del
vocabulario del módulo y no de que haya preguntas nuevas.

## Decisiones tomadas

Ninguna ADR nueva. Se aplicaron ADR-028 —que **se disparó sola** al tocar el origen y
obligó a reconvertir y recomprobar el módulo entero— y ADR-017 para decidir la
corrección.

## Hallazgos

| Código | Qué |
|---|---|
| **H-019** *(actualizado)* | El paso 0 no previene el 7403. La hipótesis de la sesión fría queda refutada como causa suficiente, y el 7403 resulta transitorio y de causa desconocida |

Sin hallazgos nuevos. Es el primer lote que no produce ninguno, y eso es en sí un dato
sobre el procedimiento.

## Queda pendiente

- **La causa del 7403.** Transitorio, reproducido dos veces, sin explicación.
- **H-019, el defecto** de lectura del sobre de error, que sigue abierto.
- **H-029**, en amarillo. No apareció en este lote.
- **El tercer camino de H-031**, con su condición escrita.
- **Las dos barreras leídas y no provocadas**, y el ensayo del manual de la 23.

> ### El peso de la instantánea deja de ser una incógnita
>
> | | |
> |---|---|
> | Hoy, con 223 preguntas | **297 kB** |
> | Proyectado con las 368 | **~489 kB** |
>
> Es lo que el criterio de nivel 2 —«el sitio aguanta el banco completo»— pedía medir en
> vez de suponer. **Medio mega es mucho para un archivo que el navegador solo carga
> cuando la capa de datos cae**, y conviene decidir antes del módulo 8 si se acepta, se
> comprime o se recorta.
>
> No es urgente y no se resuelve aquí. Lo que cambió es que ya no hay que adivinarlo.

## H-004 · cuarto dato, y el más extremo

| Lote | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|
| Módulo 2 · 52 | 23% | **40%** | 29% | 8% |
| Módulo 3 · 61 | 16% | **39%** | 30% | 15% |
| Módulo 4 · 61 | 18% | **38%** | 34% | 10% |
| Módulo 5 · 49 | 12% | **49%** | 35% | 4% |

**Cuatro lotes, y la posición 2 nunca baja del 38 %.** En éste llega al **49 %**: una de
cada dos preguntas tiene la correcta en el segundo lugar, y la posición 4 cae al 4 % —
dos preguntas de 49.

Con cuatro lotes **ya no es razonable llamarlo casualidad**. Lo que queda por ver en los
tres que faltan no es si hay sesgo, sino cuánto y si es parejo entre los dos bancos.
