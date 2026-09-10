# Iteración 25 · Módulo 8 · el banco queda completo, y una hipótesis se cae

**Épica:** 20 · Persistencia de preguntas · **Cerrado:** 2026-09-10

## Qué se entregó

Las **45 preguntas del módulo 8** —36 del banco nuevo y 9 del viejo— cargadas en
producción, comprobadas y publicadas. **El banco pasó de 323 a 368: está completo.**

Y con él, tres criterios de nivel 2 de la iteración, que solo el último lote podía
cerrar.

## Qué salió distinto de lo planeado

**Nada en la carga. Todo en la conclusión.**

Los siete lotes se comportaron igual y el octavo también: el conteo, el reparto por
origen, las diez retiradas ausentes y la predicción del CSS. Cuarto lote consecutivo sin
hallazgos nuevos.

Lo que se cayó fue una hipótesis que llevaba tres lotes en pie.

### La partición por tema de H-004 queda refutada

Desde el módulo 6 se venía anotando que la serie parecía partirse en dos: los módulos 2,
3 y 4 —front y JavaScript— rondando el **38-40 %** en la posición 2, y los módulos 5, 6 y
7 —datos, Node y acceso a datos— en **49, 48 y 56 %**. Se dejó escrito que el módulo 8,
del mismo bloque temático que el grupo alto, decidiría.

**Cayó en 38 %**, el valor más bajo de la serie junto al módulo 4. **La hipótesis se
escribió antes de conocer el dato y el dato la desmintió**, que es exactamente para lo
que se escribió así.

### Lo que sí se sostiene, y es más interesante que lo que se cayó

Con las 368 cargadas se pudo hacer la pregunta que antes no tenía datos suficientes:
**¿el sesgo depende del banco de origen?**

| Banco | n | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|---|
| `json_2026` | 285 | 17% | **43%** | 31% | 8% |
| `js_2026` | 83 | 17% | **46%** | 31% | 6% |
| **Las 368** | 368 | **17%** | **44%** | **31%** | **8%** |

**Dos bancos escritos por manos distintas, en momentos distintos, con la misma forma.**
Tres puntos de diferencia en la posición 2 y cifras casi idénticas en las otras tres.

Eso **descarta que el sesgo sea la costumbre de un redactor concreto**, y apunta a algo
compartido: el material del que ambos derivan —el examen real y los testimonios sobre
él—, o la tendencia general de quien escribe preguntas de alternativas a poner la
correcta en segundo lugar. **Con estos datos no se puede distinguir entre esas dos, y no
se afirma ninguna.**

La variación por módulo —de 38 % a 56 %— **es ruido alrededor de un 44 % común**, no dos
poblaciones. Con lotes de 45 a 61 preguntas, esa dispersión es lo esperable.

### La proyección del peso acertó

| Desde | Proyectaba |
|---|---|
| 223 preguntas | 489 kB |
| 275 preguntas | 491 kB |
| 323 preguntas | 490 kB |
| **Real con 368** | **488 kB** |

Tres proyecciones sucesivas, hechas con dos, tres y cuatro puntos de medición, cayendo
todas a menos de 3 kB del valor real. **El dato dejó de ser una incógnita hace tres
lotes**, y eso permitió que la decisión sobre qué hacer con medio mega se pudiera pensar
con tiempo en vez de descubrirse al final.

## Decisiones tomadas

Ninguna ADR nueva. Ninguna corrección: es el segundo lote —tras el módulo 3— que no
necesitó tocar el banco, y el primero **sin ninguna `[DUDA]`**.

Conviene anotar por qué, porque no es casualidad: el material del módulo 8 —REST, códigos
HTTP, JWT— son convenciones con nombre propio y respuesta única, sin sinónimos de motor
que puedan volver correcta a una segunda alternativa. Las tres correcciones de esa clase
—`m05#18`, `m06#15`, `m07#24`— salieron todas de módulos donde el temario tenía comandos
con alias.

## Hallazgos

Ninguno nuevo. **Cuarto lote consecutivo sin hallazgos.**

## Lo que cierra este lote, y lo que no

### Cerrado

- **Las 368 están en D1 y suman lo que deben.** 285 + 83, comprobado módulo por módulo
  **volviendo a correr las siete comprobaciones** con el banco ya completo, no sumando
  los siete cierres anteriores.
- **Las 37 retiradas no se cargaron.** 15 del banco nuevo y 22 del viejo, ninguna en la
  base.
- **La marca de orden fijo sobrevivió**, con `cuestionario.js` todavía en el árbol. **Es
  la línea que caduca**, y ahora que está escrita, el retiro del banco viejo puede
  ocurrir.

### Pendiente

- **El sitio aguanta el banco completo:** medido —488 kB— y falta mirar
  `cuestionario.html` sin degradación, **también en teléfono**.
- **El contador de la portada** debe decir 368 preguntas y 7 módulos.
- **`npm run verificar` en 0**, que hoy da 2 por el `escapado` en `AVISO`.

> ### El aviso del escapado ya no es una casilla en blanco cualquiera
>
> Lleva siete lotes en `AVISO` porque nadie levantó el servidor local, y en cada uno de
> ellos daba igual. **Ahora no.** Es el criterio de ADR-024, que la iteración 22 solo
> pudo verificar con diez filas de juguete. Con las 368 dentro, el banco trae:
>
> | | |
> |---|---|
> | Preguntas con comillas invertidas | **291** |
> | Con comillas dobles | **57** |
> | Con algo con forma de `<etiqueta>` | **16** |
>
> **Esas 16 son las que ponen a prueba el escapado de verdad**, porque son el caso que ya
> rompió la página una vez: un ejemplo que contenía `<div>` se interpretó como etiqueta
> real. Cerrarlo es levantar `npm run datos:dev` en otra terminal y correr
> `npm run probar:escapado`.

## Y lo que viene después

Con el banco completo, a la iteración 25 le queda su tramo final:

1. **Cerrar los tres criterios pendientes** de nivel 2.
2. **Retirar `static/js/data/cuestionario.js` y `scripts/build-cuestionario.py`**, que es
   el último paso y va **después** de que la evidencia del orden fijo esté escrita — como
   se decidió el 2026-09-09 y como quedó en este mismo documento.
3. **Decidir qué hacer con los 488 kB** de la instantánea, que enlaza con la salida de
   raíz de H-031: publicarla como `.json` la sacaría de los dos caminos por los que el
   banco participa hoy de la construcción.
