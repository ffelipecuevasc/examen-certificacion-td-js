# Iteración 25 · Módulo 4 · el lote en que el banco rompió el sitio

**Épica:** 20 · Persistencia de preguntas · **Cerrado:** 2026-09-10

## Qué se entregó

Las **61 preguntas del módulo 4** —46 del banco nuevo y 15 del viejo— cargadas en
producción, comprobadas contra los dos archivos de origen y publicadas. El banco pasó
de **113 a 174 preguntas**, y el sitio muestra tres módulos.

Es el segundo lote que corre sobre el procedimiento de once pasos, y el primero que lo
recorre entero sin escribir nada nuevo para poder recorrerlo.

## Qué salió distinto de lo planeado

**El banco cargó bien y el sitio no se pudo construir.** La carga entró entera —113 →
174—, la comprobación calzó contra los dos orígenes y el paso único publicó respaldo e
instantánea con sello `nube`. Y entonces el despliegue de Cloudflare falló:

```
ERROR: 1 referencia(s) sin destino dentro de dist/:
  - static/js/data/archivo.js
```

**No existe ninguna pregunta sobre `archivo.js`.** El culpable era una justificación de
este mismo lote, la de `m04#19`, sobre cómo se importa un módulo exportado por defecto:
contenía `import Modulo from './archivo.js'`, y el verificador de enlaces de
`build-dist.mjs` lo tomó por una referencia real.

**Conviene separar las dos cosas, porque se ven juntas y no lo son:** el banco en
producción y los dos archivos generados estuvieron correctos desde el primer intento.
Lo que faltaba era que el sitio pudiera **construirse** con ese banco dentro.

**El guion ya sabía media verdad.** Su propio comentario decía que los ejemplos de HTML
guardados en el banco —`avatar.jpg`— no son enlaces, y por eso en un `.js` sólo miraba
los `import`. Lo que no vio es que el banco también trae ejemplos de **JavaScript**, y
ahí la defensa se volvió el problema.

**El arreglo no fue afinar el patrón, y esa decisión es lo que vale.** Se consideró
anclar el `import` a principio de línea; arregla el caso de hoy y no el problema.
Quedan cuatro módulos y unas 250 preguntas sobre código, donde van a aparecer
`require()`, `fetch()`, rutas con `../`, `.mjs`, `.json` y `await import('./x.js')` —
que es una expresión y puede ir a mitad de línea con todo derecho. **Lo que no depende
de la forma del texto es dónde vive:** un archivo de `static/js/data/` no enlaza a
nada, cite lo que cite.

**Y un intento fallido enseñó el límite del arreglo.** Al provocar la protección nueva
—que impide que la regla esconda un enlace roto de verdad— el primer intento la metió
en `cuestionario.js` y la construcción pasó igual: **nada importa ese archivo**, así
que el recorrido nunca llega a él. La protección cubre los archivos de datos que
alguien importa, no la carpeta entera. Quedó escrito para que nadie lo suponga más
ancho.

**Tres justificaciones aprobadas venían con `[DUDA]` dentro, y nada lo impedía.** Las
decisiones del autor fueron «conservar», pero conservar la pregunta no es conservar la
marca: el texto que rodea a un `[DUDA]` le habla al revisor —«quería que lo decidieras
tú»— y es exactamente el que se carga en `justificacion`. En el módulo 3 se quitaron a
mano y salió bien: **funcionó por memoria y no por método**. Ahora hay una puerta.

## Decisiones tomadas

Ninguna ADR nueva. Se aplicaron las que ya existían, y dos merecen anotarse porque
funcionaron sin que nadie las recordara:

- **ADR-029** decidió los tres casos dudosos: `m04#38`, `M4-12` y `m04#41` **se
  conservan**, y el matiz pasa a la justificación. Ninguna corrección en este lote, y
  por lo tanto ADR-028 no se disparó.
- **ADR-030** estrenó su forma: el commit del lote ocupó **145 caracteres**, y todo el
  porqué vive aquí y en el registro.

## Hallazgos

| Código | Qué |
|---|---|
| **H-031** *(segunda cara)* | El banco rompió la construcción. Arreglado por regla estructural y no por lista de excepciones. Provocado en los dos sentidos: `build` fallaba y pasa, y la protección nueva dispara |
| **H-031** *(tercer camino)* | Buscado a propósito: `build-dist.mjs` lee el sello de la instantánea con un `match` **no global**, que se queda con la primera coincidencia. Hoy acierta **porque `SELLO` se escribe antes que `PREGUNTAS`**, no porque el guion sepa cuál es cuál |
| **H-032** | Nada impedía que una marca de duda se publicara como justificación. Cerrado en `aplicar-justificaciones.mjs`, y provocado — al tercer intento, porque los dos primeros saltaban por otras comprobaciones |

### Lo de fondo, que es lo que hay que llevarse de este lote

**El banco participa de la construcción por tres caminos**, y los tres tienen la misma
raíz: la instantánea se publica como un módulo `.js` dentro del árbol que las
herramientas tratan como código. Cae en el `content` de Tailwind y en el filtro del
verificador **porque termina en `.js`**, no porque alguien decidiera que fuera código.

La salida de raíz —**publicarla como `.json`**— está escrita en la auditoría y no se
hizo: obligaría a cargarla con `fetch` en vez de con un import dinámico, y ése es el
camino que **sólo corre el día que la capa de datos cae**. Merece su propia iteración.

**La pregunta para cada herramienta nueva que toque el sitio: ¿esto va a leer
`static/js/data/`?** Si la respuesta es sí, va a leer el banco, y el banco habla de
programación.

## Queda pendiente

- **El tercer camino de H-031**, anotado con su condición: mientras `SELLO` vaya antes
  que `PREGUNTAS`, es correcto. El día que eso cambie, deja de serlo sin avisar.
- **H-019, el defecto** —no el disparador—, y **H-029**, en amarillo con dos
  apariciones y una hipótesis muerta.
- **Las dos barreras leídas y no provocadas**, y el ensayo del manual de la 23.
- **La justificación no se ve al responder**: no es un defecto, es la iteración 33. Y
  con ella la consecuencia que sube el precio de revisar mal — hasta la épica 30 **las
  justificaciones no las lee nadie más que el autor**.

## H-004 · tercer dato de la serie

| Lote | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|
| Módulo 2 · 52 | 23% | **40%** | 29% | 8% |
| Módulo 3 · 61 | 16% | **39%** | 30% | 15% |
| Módulo 4 · 61 | 18% | **38%** | 34% | 10% |

**40, 39, 38.** Tres lotes independientes, de dos bancos escritos por manos distintas y
en momentos distintos, y la posición 2 clavada cerca del 40 % contra el 25 % de un
reparto parejo. La posición 4 es su espejo: siempre la más baja.

Los tres números están **medidos en producción**, no calculados sobre el encargo — la
distinción importa para una serie que se va a citar después. Faltan cuatro módulos, y
la expectativa ya se invirtió: hoy lo razonable es suponer sesgo del material.
