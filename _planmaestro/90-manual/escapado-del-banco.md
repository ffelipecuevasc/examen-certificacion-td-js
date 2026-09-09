# El escapado del banco de preguntas

Desde la iteración 22 las preguntas vienen de la base D1 y no de un archivo del
repositorio. Ese cambio parece de plomería y no lo es: el contenido pasó a ser de
**origen externo**, editable por cualquiera que tenga acceso a la base, y el escapado
dejó de ser higiene para convertirse en la única barrera de seguridad real que tiene
este sitio.

Este documento explica cómo se comprueba que esa barrera sigue en pie, y —sobre todo—
**por qué la forma obvia de comprobarlo miente**.

---

## Lo primero, porque es lo que vas a intentar

Si un día dudas de si el escapado está funcionando, lo natural es meter un `<script>`
en una pregunta, abrir la página y ver si salta una alerta. No salta.

**Y eso no prueba nada.**

Un `<script>` insertado con `innerHTML` **no se ejecuta nunca**, esté escapado o no.
No es suerte ni es mérito del escapado: es la regla del estándar de HTML. El
analizador crea el elemento y el navegador no lo corre.

O sea: si mañana alguien quitara el escapado del enunciado, esa prueba seguiría
diciendo que todo está bien. Diría «no pasó nada» exactamente igual que cuando todo
está correcto, y te irías tranquilo con la barrera caída.

> **La prueba intuitiva no distingue el sitio protegido del sitio desprotegido.**
> Es la peor propiedad que puede tener una prueba: da el mismo resultado en los dos
> casos que necesitas separar.

## Cuál es el ataque de verdad

Lo que **sí** se ejecuta al insertarse con `innerHTML` son los **atributos de
evento**, y por eso el contenido hostil de prueba los trae:

| | Qué es | Por qué está |
|---|---|---|
| A | `<script>…</script>` | El famoso. **No es peligroso** por `innerHTML`. Está para que el guardián demuestre que lo detecta igual, no porque haga daño |
| B | `<img src=x onerror="…">` | **Éste sí se ejecuta**, de inmediato: la imagen no carga y dispara el `onerror` |
| C | `<svg onload="…">` | Igual que el anterior, por si algún día se filtran etiquetas por lista en vez de escapar |
| D | `" onmouseover="…" x="` | No abre ninguna etiqueta: **rompe el atributo desde dentro**. Aquí el carácter peligroso es la comilla doble, no el `<` |
| E | El ícono del módulo | El único dato de la base que se dibuja **dentro de un atributo** y no como texto |

B y C son los que nadie escribe cuando piensa «inyección», y son los que importan.

## El caso E, que merece párrafo propio

El nombre del ícono del módulo viaja dentro de `class="icon i-…"`. Es el único dato
del banco que termina **dentro de un atributo HTML**, y ahí el escapado de texto no
alcanza: lo que hay que cubrir es la comilla doble, porque quien la controle puede
cerrar el atributo y abrir otro.

Lo cubre la función `icon()`, que escapa su argumento. **Pero lo cubría por una
decisión tomada en otra iteración y por otro motivo** —era una precaución de
presentación, no una defensa pensada para este caso—, así que la protección era
accidental.

Desde la iteración 22 ya no lo es: el guardián prueba ese caso explícitamente, y si
alguien quita el escapado de `icon()` la prueba falla nombrando el ícono.

> **No toques `icon()` creyendo que sólo afecta a cómo se ve algo.** Su escapado es
> parte de la barrera de seguridad. Está anotado también en la auditoría, en H-003.

---

## Cómo se comprueba de verdad

Hay un guardián que carga contenido hostil **real** en la base D1 **local**, corre el
código real del cuestionario contra la respuesta real de la capa de datos, revisa el
HTML que sale, y después retira el contenido hostil y comprueba que la base quedó
limpia.

Necesita el servidor local levantado. Son dos terminales:

```
# terminal 1 — deja esto corriendo
npm run datos:dev

# terminal 2
npm run probar:escapado
```

También corre solo, como tercer paso de:

```
npm run verificar
```

### Qué comprueba, y por qué así

Buscar el ataque en el HTML de salida **no sirve**: dentro de un texto ya escapado,
la cadena `onerror=` aparece igual, como texto inofensivo. La prueba gritaría con
todo bien. (Pasó: fue el primer intento del propio guardián.)

Lo que se comprueba, por cada dato que salió de la base, son dos cosas:

1. Que su forma **cruda** no aparezca en el HTML → no se coló ningún carácter.
2. Que su forma **escapada** sí aparezca → el texto llegó entero al estudiante.

La segunda no sobra: un escapado que además se come texto rompe preguntas en vez de
protegerlas, y sin esa mitad pasaría por bueno.

Y una tercera, aparte: que en el HTML no exista **ninguna etiqueta** que el
componente no emita.

---

## Los cuatro veredictos

| Veredicto | Código | Qué significa | Qué hacer |
|---|---|---|---|
| `ESCAPADO EN PIE` | 0 | Se probó y aguantó | Nada |
| `ESCAPADO ROTO` | 1 | Se probó y **no** aguantó. Nombra qué texto se coló | Arreglarlo antes que cualquier otra cosa |
| `NO SE PUDO PROBAR` | 2 | Nadie llegó a probar nada. Casi siempre: falta levantar el servidor local | Levantar `npm run datos:dev` y repetir |
| `BASE SUCIA` | 3 | La prueba terminó y el contenido hostil **quedó dentro** de la base local | Retirarlo a mano, ver abajo |

**El 2 no es un aprobado con reparos.** Es una casilla en blanco: no dice que el
escapado esté bien ni que esté mal, dice que nadie lo miró. Por eso se ve distinto de
un fallo y devuelve otro código.

**El 3 habla de la prueba y no del sitio, y aun así es el más urgente.** Una base
local con la fila 900 dentro te dibuja una pregunta hostil y un ícono roto la próxima
vez que abras el navegador, y nada te lo anuncia. Si sale, retíralo:

```
node node_modules/wrangler/bin/wrangler.js d1 execute examen-td-js-produccion --local --file=d1/prueba-escapado-limpiar.sql
```

En condiciones normales no aparece: el guardián limpia solo y **comprueba** que quedó
limpio, en vez de darlo por hecho.

---

## Lo que esta prueba NO cubre

- **La escala.** Son diez filas de juguete. El banco real trae 57 preguntas con
  comillas invertidas y 46 con comillas dobles, y eso no se ejercita aquí. Queda para
  la iteración 24 (ADR-024).
- **La base de la nube.** El guardián corre siempre contra la base **local**. Nunca
  escribe contenido hostil en producción ni en vista previa, y no debe hacerlo.
- **Lo que se escribe.** Ésta es la mitad de salida de la regla. La otra mitad —validar
  al escribir en la base— vive en el esquema y en la validación de la capa de datos.
