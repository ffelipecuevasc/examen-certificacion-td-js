# Iteración 25 · Módulo 6 · el lote en que H-031 se pudo predecir

**Épica:** 20 · Persistencia de preguntas · **Cerrado:** 2026-09-10

## Qué se entregó

Las **52 preguntas del módulo 6** —38 del banco nuevo y 14 del viejo— cargadas en
producción, comprobadas contra los dos archivos de origen y publicadas. El banco pasó
de **223 a 275 preguntas**, y el sitio muestra cinco módulos.

Con una corrección: **`m06#15`**, que tenía dos respuestas correctas.

Quedan **93 preguntas** en dos lotes: el módulo 7 con 48 y el módulo 8 con 45.

## Qué salió distinto de lo planeado

**Nada salió mal, y por segunda vez seguida el lote no produjo ningún hallazgo nuevo.**
Eso es en sí el dato: el procedimiento de once pasos lleva dos módulos comportándose
como un procedimiento y no como una hipótesis.

Lo que sí cambió es **cómo se trata H-031**.

### La primera predicción, y se cumplió

El módulo 6 habla de `express.static()`, de operaciones *blocking* y de tablas —
palabras que son nombres de clases de Tailwind—. En vez de esperar a ver si el CSS se
movía, se comprobó antes: las 52 justificaciones se pasaron por Tailwind **con una
configuración aparte, en el scratchpad y sin tocar el proyecto**.

Emitieron **una sola clase**: `.static`, salida de `express.static()`. Y esa clase **ya
estaba** en el CSS publicado, porque el sitio la usa.

Se anunció por escrito, antes de cargar, que el CSS no se movería y que el lote iría con
**dos** archivos generados en vez de tres. **`npm run verificar` respondió
`VERIFICADO`.**

**En el módulo 4 este mismo fenómeno rompió el despliegue** y se descubrió leyendo el
error de Cloudflare. Aquí se supo antes de tocar producción, con un comando que tarda un
segundo. Es la diferencia entre un hallazgo y un dato.

### Una corrección, y la duda se resolvió corriéndola

`m06#15` preguntaba qué comando de npm abre el asistente interactivo, marcaba
`npm init` —correcta— y ofrecía `npm create` como distractor. Se marcó con `[DUDA]`
porque la documentación lista `create` como alias de `init`, **pero no estaba claro si
sin argumentos abría el mismo cuestionario**.

**Se corrió en una carpeta desechable en vez de deducirlo:**

```
This utility will walk you through creating a package.json file.
See `npm help init` for definitive documentation…
package name: (npmtest)
```

Palabra por palabra lo que imprime `npm init`. El ítem tenía dos respuestas correctas.

**Reemplazo: `npm init -y`**, que es real, está **a un guion de distancia** de la
respuesta correcta y es incorrecta por la razón exacta que la pregunta evalúa — el `-y`
acepta todos los valores por omisión y **no abre el asistente**.

Es la misma clase que `m05#18`: **no es ADR-029** —la correcta era correcta— sino un
**distractor que también lo era**. Aplica la regla del retiro de `m07#21`: un ítem con
dos respuestas correctas es un error y se corrige; un distractor flojo no (ADR-017).

## Decisiones tomadas

Ninguna ADR nueva. Se aplicaron ADR-028 —que **se disparó sola** al tocar el origen— y
ADR-017 para decidir la corrección.

## Hallazgos

Ninguno nuevo. Segundo lote consecutivo sin hallazgos.

## Queda pendiente

- **La causa del 7403**, transitorio y sin explicación. No apareció en este lote.
- **H-019, el defecto** de lectura del sobre de error.
- **H-029**, en amarillo. Tampoco apareció.
- **El tercer camino de H-031**, con su condición escrita.
- **Las dos barreras leídas y no provocadas**, y el ensayo del manual de la 23.

> ### El peso de la instantánea ya tiene dos puntos de medición
>
> | Desde | Proyección con 368 |
> |---|---|
> | 223 preguntas · 297 kB | 489 kB |
> | 275 preguntas · 367 kB | **491 kB** |
>
> El incremento medido es de **1 389 bytes por pregunta**, y las dos proyecciones caen a
> 2 kB una de otra. **Deja de ser una estimación de un solo punto:** con las 368, cerca
> de **490 kB**.
>
> Sigue valiendo lo del módulo 5: medio mega es mucho para un archivo que el navegador
> **solo carga cuando la capa de datos cae**. Quedan 93 preguntas; conviene decidir
> antes del módulo 8 si se acepta, se comprime o se recorta.

## H-004 · quinto dato, y aparece una forma en la serie

| Lote | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|
| Módulo 2 · 52 | 23% | **40%** | 29% | 8% |
| Módulo 3 · 61 | 16% | **39%** | 30% | 15% |
| Módulo 4 · 61 | 18% | **38%** | 34% | 10% |
| Módulo 5 · 49 | 12% | **49%** | 35% | 4% |
| Módulo 6 · 52 | 17% | **48%** | 31% | 4% |

**Cinco lotes y la posición 2 nunca baja del 38 %.** Y la serie se parte en dos grupos
que conviene mirar antes de sacar una conclusión única:

- **Módulos 2, 3 y 4** — front y JavaScript: **40, 39, 38 %**.
- **Módulos 5 y 6** — bases de datos y Node: **49, 48 %**, con la posición 4 en **4 %**
  en los dos.

**No se afirma que sean dos poblaciones distintas.** Dos lotes no lo establecen, y el
corte coincide con un cambio de tema que puede no significar nada. Se anota porque
**quedan exactamente dos módulos** —el 7 y el 8, los dos de Node y API— y van a caer del
lado que decide si el grupo alto era el tema o la casualidad.
