# Iteración 22 · Lectura, validación e instantánea

**Épica:** 20 · Persistencia de preguntas **Estado:** 🟢 Completada · iniciada el 2026-09-05 · cerrada el 2026-09-05
**Depende de:** iteración 21

## Objetivo

Que el banco llegue desde D1 hasta `cuestionario.html`, validado, y que el sitio siga funcionando cuando la capa de
datos no responda.

## Contexto de seguridad

Esto es lo más delicado de la épica. Hasta ahora, el contenido de las preguntas venía de archivos del propio
repositorio. Desde esta iteración viene de una base de datos, y el escapado deja de ser higiene para convertirse en una
barrera de seguridad. Ver hallazgo H-003.

La regla es de doble filo: se valida al entrar a la base y se escapa al salir al DOM. Confiar en solo uno de los dos
lados es el error clásico.

## Tareas

- [x] Implementar los extremos de lectura en el Worker: banco completo y consulta por módulo.
- [x] Validar cada registro antes de entregarlo. Un registro inválido se descarta sin tumbar la respuesta completa.
- [x] Producir un informe de validación legible: cuántos registros se leyeron, cuántos se descartaron y por qué motivo
  cada uno.
- [x] Implementar la generación de la instantánea desde D1 hacia un archivo versionado, según ADR-008.
- [x] Implementar el respaldo en el sitio: si el Worker no responde, se carga la instantánea y **se avisa al
  estudiante** de que puede no estar al día.
- [x] Aplicar `esc()` a todo texto del banco antes de insertarlo en el DOM.
- [x] Adaptar `cuestionario.html` para consumir el nuevo canal, sin cambiar todavía su diseño.
- [x] Mantener `static/js/data/cuestionario.js` hasta que la iteración 24 confirme la migración completa.

### Tareas añadidas el 2026-09-05, al abrir la iteración

- [x] **Retirar `/api/prueba` junto con su tabla.** `functions/api/prueba.js`
  consultaba `prueba_tuberia`, y el ensayo remoto de la iteración 21 retiró esa tabla de la base de pruebas: contra
  vista previa el extremo ya fallaba.

      > **Corrección del 2026-09-05, escrita el mismo día que el error.** Al proponer
      > esta tarea se afirmó que retirarla «no rompe ninguna página» porque
      > `leerPrueba()` no lo llamaba ningún componente. **Era falso.**
      > `static/js/components/estado-datos.js` la importa y la usa para dibujar el
      > indicador del pie de `cuestionario.html`. La comprobación buscó la **ruta**
      > `/api/prueba` en el código del sitio, y el componente no nombra la ruta: nombra
      > la **función** que la envuelve. Es el mismo error de método de H-014 —una regla
      > que se comprueba mirando la línea de comandos y el comando estaba dentro de un
      > archivo—: se buscó la forma visible de la dependencia y no la dependencia.
      > Regla que deja: **al retirar algo, se busca por el nombre de lo que se retira y
      > por el de todo lo que lo envuelve**, no por la cadena literal.

      Retirados los tres: el extremo, la función del cliente y la tabla de la base de
      pruebas. El indicador del pie migró a `leerPreguntas()`, que es lo que de verdad
      quería contar. **En producción la tabla sigue existiendo**, y retirar el extremo
      es también lo que evita que alguien la crea viva.
- [x] **Que las filas de prueba traigan los caracteres que el banco real traerá**
  (ADR-024): un enunciado con `<div>` —ya está entre los criterios—, y además comillas invertidas, comillas dobles y una
  comilla simple. Con diez filas no se puede probar el volumen, pero los caracteres sí.
- [x] **Que el generador de la instantánea escriba dentro del archivo contra qué base corrió y cuándo** (ADR-023). Sin
  eso no hay forma de saber si está al día, y el aviso al estudiante de ADR-008 se queda sin el dato que lo sostiene.

## Criterios de aceptación

- [x] `cuestionario.html` muestra las preguntas provenientes de D1.
- [x] Un registro con un campo obligatorio vacío se descarta y aparece en el informe de validación con su motivo.
- [x] Un registro cuya respuesta correcta no corresponde a ninguna alternativa se descarta y aparece en el informe.
- [⏸️] Existe la instantánea versionada y su contenido coincide con lo que hay en D1. **APLAZADO a la iteración 24 el
  2026-09-05, por decisión del autor.** No es que la prueba falle: es que **todavía no hay nada que copiar**. ADR-023
  manda generarla desde la nube, y la base de producción está vacía porque el esquema no se ha aplicado allá — ese paso
  vive en la iteración 24. Anotado allá como dependencia explícita, pegada al paso del esquema y la carga.
- [x] Con el Worker caído, el sitio carga desde la instantánea y muestra el aviso: se demuestra provocando la caída.
- [x] El aviso de respaldo es visible para el estudiante y no solo un mensaje de consola.
- [x] Una pregunta cuyo enunciado contenga `<div>` se muestra como texto literal y no altera el diseño de la tarjeta.
- [x] Una pregunta con orden fijo conserva el orden de sus alternativas tras varias recargas; una sin la marca lo
  cambia.
- [x] Sin errores de consola al cargar la página servida por HTTP.
- [x] `/api/prueba` ya no existe, y ningún archivo del sitio lo menciona.

### Lo que esta iteración NO puede cerrar, y por qué

Anotado el 2026-09-05, al abrir la iteración, para que no se descubra al final:

- **«La instantánea coincide con lo que hay en D1» sólo lo puede cerrar el autor.**
  Por ADR-023 la instantánea se genera desde la nube, y por ADR-015 Claude Code no llega ahí. Claude Code comprueba que
  el generador funciona contra D1 local, que el archivo tiene la forma esperada y que el sitio lo consume; la
  correspondencia con la nube la comprueba el autor y su evidencia es suya.
- **El escapado no queda probado a escala** (ADR-024). Diez filas de juguete no ejercitan las 57 preguntas con comillas
  invertidas ni las 46 con comillas dobles que trae el banco real. Ese criterio lo hereda la iteración 24.

## Verificación

Los criterios del escapado y del respaldo se comprueban provocando la situación, no razonando sobre el código.

## Notas de la iteración

### Puntos 1 a 3, ejecutados el 2026-09-05

Orden acordado con el autor: extremos, validación, escapado, instantánea. Los tres primeros están hechos; el cuarto
queda pendiente.

#### 1 · Los extremos de lectura

`functions/api/preguntas.js`. `GET /api/preguntas` para el banco completo y
`?modulo=N` para uno solo. **Lee de `pregunta_activa`**, nunca de las tablas: el filtro por estado vive en la vista, así
que ninguna consulta puede olvidarlo. Las alternativas se piden aparte y se unen por `pregunta_id` contra la misma
vista, así que las de una pregunta en borrador o retirada no salen ni por accidente.

Comprobado contra la base local, con el servidor de Pages levantado:

| Petición                     | Resultado                                                                        |
|------------------------------|----------------------------------------------------------------------------------|
| `/api/preguntas`             | 8 preguntas, 4 alternativas cada una, `orden_fijo = 1` sólo en la 8              |
| `/api/preguntas?modulo=5`    | 1 pregunta, con `modulo_titulo` e `icono` puestos                                |
| `/api/preguntas?modulo=99`   | **400** `PETICION_INVALIDA`, `usar_respaldo: false`                              |
| `/api/preguntas?modulo=5abc` | **400**, igual. Se usa `Number()` y no `parseInt()`, que aceptaría `5abc` como 5 |
| `/api/prueba`                | **404** en JSON, `usar_respaldo: false`                                          |

Las 10 filas de la base son 8 en el extremo, y ésa es la prueba de que la vista filtra: las otras dos están en
`borrador` y `retirada`.

**Un código de error nuevo, `PETICION_INVALIDA`**, con `usar_respaldo: false`. Sin él,
`respuestaError()` cae por omisión en `FALLO_CONSULTA`, que activa el respaldo: un error del sitio quedaría escondido
detrás de la instantánea, que es justo contra lo que advierte la cabecera de `_comun.js`.

#### 2 · La validación y su informe

`functions/api/_validacion.js`. Comprueba exactamente lo que el esquema **no** puede exigir, que es la tabla de
`90-manual/esquema-del-banco.md`: cuatro alternativas exactas, una correcta exacta, y textos con algo que dibujar. No
repite lo que la base ya garantiza, porque comprobarlo aquí sólo daría impresión de cobertura.

Descarta la pregunta rota y sigue con las demás: una fila mala no puede costarle el banco entero al estudiante. Y no
descarta en silencio — el informe viaja en
`meta.validacion` y va **siempre**, también cuando está vacío, porque un informe que sólo aparece cuando hay problemas
enseña a no buscarlo.

Provocado de verdad, rompiendo tres filas de tres maneras distintas en la base local:

```
ok true | entregadas 5   (de 8 leídas)
{ "leidas": 8, "entregadas": 5, "descartadas": 3,
  "detalle": [
    { "id": 2, "modulo": 3, "motivos": ["ninguna alternativa marcada como correcta"] },
    { "id": 3, "modulo": 4, "motivos": ["1 alternativa(s) sin texto"] },
    { "id": 4, "modulo": 5, "motivos": ["tiene 3 alternativas y debe tener 4"] } ] }
```

La respuesta siguió siendo `ok: true` con las cinco sanas, que es el comportamiento buscado. Base devuelta a su estado
conocido después.

#### 3 · El escapado, y qué pasa hoy con un `<script>`

**La respuesta corta: se dibuja como texto y no pasa nada. Pero el `<script>` no es el peligro, y conviene entender por
qué antes de quedarse tranquilo.**

`<script>` insertado con `innerHTML` **no se ejecuta nunca**, lo escape uno o no: el analizador de HTML lo crea como
elemento pero el navegador no lo corre. Es la regla de la especificación, no una casualidad. De modo que si mañana
alguien quitara `esc()`
del enunciado, la prueba obvia —meter un `<script>` y ver si salta una alerta— diría que todo está bien. **Y estaría
mal.**

Lo que sí se ejecuta al insertarse con `innerHTML` son los atributos de evento:
`<img src=x onerror="...">` dispara de inmediato porque la imagen no carga, y
`<svg onload="...">` igual. Ése es el ataque real, y es el que nadie escribe cuando piensa «inyección». Por eso el
contenido hostil de prueba trae los cuatro casos y no sólo el famoso.

Lo comprobado, con contenido hostil cargado de verdad en la base local y corriendo el componente real contra la
respuesta real del extremo:

| Payload                                                | Dónde                                       | Cómo salió                                                                |
|--------------------------------------------------------|---------------------------------------------|---------------------------------------------------------------------------|
| A · `<script>window.__ejecuto_script = true;</script>` | enunciado                                   | `&lt;script&gt;…` — texto                                                 |
| B · `<img src=x onerror="…">`                          | alternativa a                               | `&lt;img src=x onerror=&quot;…` — texto                                   |
| C · `<svg onload="…">`                                 | alternativa b                               | `&lt;svg onload=&quot;…` — texto                                          |
| D · `" onmouseover="…" x="`                            | alternativa c                               | `&quot; onmouseover=&quot;…` — texto                                      |
| E · `devices" onload="…`                               | **ícono del módulo**, dentro de `class="…"` | `class="icon i-devices&quot; onload=&quot;…"` — sigue dentro del atributo |

Etiquetas presentes en el HTML generado: `button, div, header, li, p, section, span,
ul`. Ninguna ajena al componente.

**El payload E es el que más importa y el que casi se me pasa.** El ícono del módulo es el único dato de la base que se
dibuja **dentro de un atributo** y no como texto, y ahí el carácter peligroso no es `<` sino la comilla doble. Lo cubre
`icon()`, que escapa su argumento; pero lo cubre por una decisión que se tomó en otra iteración y por otro motivo, no
porque alguien lo hubiera pensado para este caso.

**Y la parte que responde a la objeción del autor.** «No puede pasar porque yo controlo el contenido» no es una
respuesta, y ahora menos: el contenido vive en una base que edita cualquiera que tenga acceso, y la iteración 23 va a
construir deliberadamente una herramienta para editarla. El escapado no protege del autor:
protege de que un día el canal de edición sea más ancho de lo que es hoy.

#### El guardián del escapado, y por qué se convirtió en guion

`scripts/probar-escapado.mjs`, con `npm run probar:escapado`. Carga
`d1/prueba-escapado.sql` en la base **local**, corre el componente real, comprueba, y retira el contenido hostil en un
`finally` para que la base quede limpia aunque la prueba falle.

Se hizo guion y no comprobación de una vez por la deuda que este proyecto ya tiene anotada con las nueve restricciones
de la iteración 21: **una prueba que no se puede repetir es evidencia que caduca.** Y porque ésta protege lo único del
proyecto que es una barrera de seguridad de verdad.

Tres veredictos, como todos los guardianes de aquí, y los tres provocados:

| Estado        | Cómo se provocó                                | Veredicto                                                                        | Código |
|---------------|------------------------------------------------|----------------------------------------------------------------------------------|--------|
| Sano          | contenido hostil cargado, escapado en su sitio | `ESCAPADO EN PIE`                                                                | 0      |
| Roto          | quitando `esc()` del enunciado a propósito     | `ESCAPADO ROTO *** 3 ***`, nombrando el enunciado y la etiqueta `script` intrusa | 1      |
| Sin veredicto | apuntando a un puerto sin servidor             | `NO SE PUDO PROBAR`, diciendo que levante `npm run datos:dev`                    | 2      |

**Dos defectos del propio guardián, encontrados al correrlo, no al escribirlo:**

1. **La primera versión buscaba `onerror=` en el HTML y gritaba con todo bien.** Dentro de un texto ya escapado esa
   cadena aparece igual, inofensiva. La comprobación correcta no es buscar el ataque en la salida: es comparar, por cada
   dato, que su forma **cruda** no esté y su forma **escapada** sí. La segunda mitad tampoco sobra —un escapado que
   además come texto rompe preguntas en vez de protegerlas— y sin ella pasaría por bueno.
2. **Con eso arreglado, dio `ESCAPADO ROTO` sobre un texto inocente.** El ícono
   `devices` no tiene ningún carácter que escapar, así que su forma cruda y su forma escapada son la misma, y «la cruda
   aparece en el HTML» era cierto y no significaba nada. Ahora esa regla sólo se aplica cuando el escapado cambia algo.
   Y se añadió la comprobación inversa: que **todos** los textos de prueba traigan algo que escapar, para que el día que
   el fixture se quede sin dientes la prueba lo diga en vez de pasar siempre.

#### El orden fijo, provocado

Seis renderizados reales del componente:

- **Pregunta 8**, `orden_fijo = 1`: **un solo orden** en las seis, con «Ambas B y C son correctas» siempre al final. Es
  la que perdería el sentido si se moviera.
- **Pregunta 1**, `orden_fijo = 0`: **cinco órdenes distintos** en seis tiradas.

Sin ninguna rama especial en el código más allá de decidir si se baraja: la correcta va atada a la alternativa y no a su
posición (ADR-019), así que barajar no rompe nada.

#### Un error mío, corregido

Al proponer el retiro de `/api/prueba` afirmé que no lo llamaba ningún componente. **Era falso**:
`static/js/components/estado-datos.js` lo usaba para el indicador del pie. Busqué la **ruta** `/api/prueba` en el código
del sitio, y el componente no nombra la ruta: nombra la función que la envuelve. Es el mismo error de método de H-014.
El indicador migró a `leerPreguntas()` y ahora cuenta preguntas, que es lo que siempre quiso contar. La corrección quedó
escrita junto a la tarea y en el registro.

#### Estado del CSS

`npm run verificar` da `DESFASADO`, y es correcto: el componente usa clases nuevas —las del mensaje de banco no
disponible— así que Tailwind regeneró `style.css`. Está **bien generado y sin commitear**, que es exactamente lo que
dice el veredicto. El commit lo hace el autor.

`npm run build` pasa: `16 recursos enlazados, ninguno roto`. Eran 17 y ahora son 16 porque
`static/js/data/cuestionario.js` dejó de estar en el grafo de importaciones. El archivo sigue existiendo, como pide la
tarea, hasta que la iteración 24 confirme la migración.

#### El guardián dentro de `npm run verificar`, y por qué hizo falta un coordinador

`npm run verificar` era `verificar-barrera && verificar`. Con el guardián del escapado como tercer paso, el `&&` deja de
servir por dos motivos, y los dos empujan al mismo error:

1. **Corta en el primer código distinto de cero.** Un aviso —«no se pudo probar»— impediría correr lo que venía después,
   como si fuera un fallo.
2. **El código final es el del último que alcanzó a correr.** Con tres comprobadores y tres clases de resultado, ese
   número deja de significar nada.

Ahora `npm run verificar` es `scripts/verificar-todo.mjs`, que lanza los tres, traduce sus códigos con una tabla y da
**un** veredicto:

| Clase   | Qué significa                                                       | Código final                  |
|---------|---------------------------------------------------------------------|-------------------------------|
| `OK`    | Se comprobó y está bien                                             | —                             |
| `AVISO` | La comprobación **no se pudo hacer**. No se sabe si está bien o mal | 2 · `VERIFICACION INCOMPLETA` |
| `FALLO` | Algo está mal y hay que arreglarlo                                  | 1 · `VERIFICACION FALLIDA`    |

La barrera de ADR-015 sigue siendo la primera y la única que **corta**: si está caída, desde ese terminal se llega a la
cuenta de Cloudflare y nada de lo que venía después merece correrse. Las otras dos corren siempre, aunque la anterior
haya fallado —son independientes, y parar en la primera escondería el estado de las demás—. Eso ya es una mejora sobre
el `&&`, que dejaba el escapado sin comprobar cada vez que el CSS estaba desfasado.

Y un código que la tabla no reconozca se trata como **fallo**, diciendo que era inesperado. Un envoltorio que no
entiende la respuesta no puede dar nada por bueno: es la regla de H-013.

**Los tres estados, provocados de verdad el 2026-09-05:**

| Estado                      | Cómo se provocó                            | Línea del resumen                                                                                  | Código        |
|-----------------------------|--------------------------------------------|----------------------------------------------------------------------------------------------------|---------------|
| Con servidor, todo bien     | `npm run datos:dev` levantado              | `escapado   OK     el escapado aguanto el contenido hostil`                                        | 0 en ese paso |
| Con servidor, escapado roto | quitando `esc()` del enunciado a propósito | `escapado   FALLO  ESCAPADO ROTO: un texto de la base se interpreta como marcado`                  | 1             |
| Sin servidor                | matando el servidor local                  | `escapado   AVISO  NO SE PUDO PROBAR. Para cerrarlo: npm run datos:dev en otra terminal y repetir` | 2             |

En las tres corridas el paso de CSS dio `FALLO · DESFASADO`, que es correcto y no tiene que ver con el escapado: el CSS
está bien generado y **sin commitear**, y el commit lo hace el autor. Por eso el veredicto global salió
`VERIFICACION FALLIDA · 1` también en el caso sin servidor.

Para comprobar que el aviso **por sí solo** no se cuenta como fallo se corrió el coordinador con el paso de CSS
sustituido por uno que sale 0 —un ensayo, fuera del repositorio, sobre los otros dos pasos reales—:

```
VERIFICACION INCOMPLETA  ***  ESTO NO ES UN EXITO  ***
  barrera    OK     la barrera de ADR-015 esta en pie, o no aplica en este terminal
  css        OK     el CSS corresponde a su fuente y coincide con lo commiteado
  escapado   AVISO  NO SE PUDO PROBAR. Para cerrarlo: `npm run datos:dev` ...

Ninguna comprobacion encontro nada mal. Lo que hay es una que no se
pudo hacer, y eso no es un aprobado: es una casilla en blanco.

codigo de salida: 2
```

**El veredicto global `VERIFICADO · 0` es el único que no se ha visto todavía**, y no por un defecto: exige que el CSS
esté commiteado, y eso le toca al autor.

#### H-017 · el guardián dejaba el veneno dentro de la base

Encontrado al ir a mirar el estado de la base local antes de preparar la pasada de navegador del autor: **la pregunta
hostil 900 y el ícono envenenado del módulo 2 seguían dentro**, de la corrida en que se provocó el veredicto «no se pudo
probar».

`process.exit()` no ejecuta los `finally`. La limpieza estaba en un `finally` y la salida sin veredicto era un
`process.exit(2)` dentro del `try`, después de cargar el contenido hostil. Resuelto por tres lados —sondear el servidor
antes de ensuciar, lanzar en vez de salir, y **comprobar** la limpieza en vez de suponerla, con un cuarto veredicto
`BASE SUCIA`—. El detalle y las reglas que deja están en la auditoría, H-017.

Importa aquí por el momento: la pasada de navegador del autor habría mostrado una pregunta de ataque y un ícono roto, y
habría hecho dudar del sitio, que estaba bien. La base quedó comprobada limpia —10 preguntas, sin la 900, ícono
`devices`— antes de entregar las instrucciones de esa pasada.

#### El corolario del `<script>`, escrito donde se va a leer

La parte más útil del punto 3 —que la prueba intuitiva, meter un `<script>` y ver si salta una alerta, **diría que todo
está bien aunque alguien hubiera quitado el escapado**— no puede vivir sólo en estas notas. Es exactamente lo que
alguien va a intentar el día que dude.

Queda escrita en `90-manual/escapado-del-banco.md`, junto al procedimiento de la prueba que sí sirve, los cuatro
veredictos y qué hacer con cada uno. Ahí está también la advertencia del ícono: **`icon()` no es presentación, es parte
de la barrera**.

#### Lo que falta, y qué necesita de quién

**Punto 4, la instantánea**, entero: el generador con su sello de base y fecha (ADR-023), el respaldo en el sitio y el
aviso visible al estudiante.

Y tres criterios que **Claude Code no puede cerrar**:

| Criterio                                        | Quién y cómo                                                                                                                                                           |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cuestionario.html` muestra las preguntas de D1 | **El autor**, abriendo la página servida por HTTP. Está comprobado que el componente produce el HTML correcto desde el extremo real, pero no que el navegador lo pinte |
| Sin errores de consola servida por HTTP         | **El autor**, misma pasada                                                                                                                                             |
| La instantánea coincide con lo que hay en D1    | **El autor**, por ADR-023: se genera desde la nube y ADR-015 no me deja llegar ahí                                                                                     |

### Punto 4 · la instantánea, ejecutado el 2026-09-05

Arrancado después de que el autor confirmara la pasada de navegador, para no apilar dos cosas sin confirmar.

#### El generador

`scripts/generar-instantanea.mjs`, con `npm run datos:instantanea`. Consulta la base, arma las preguntas con sus
alternativas, las pasa por la validación y escribe
`static/js/data/instantanea-banco.js`.

**Dos cosas no se copiaron, se importaron.** Las consultas salen de
`functions/api/preguntas.js` —que hubo que exportarlas, y quedó dicho ahí por qué— y la validación de
`functions/api/_validacion.js`. Con copias propias, el respaldo empezaría a traer otra cosa que el extremo el día que
una de las dos cambiara, y la diferencia sólo se vería el día de la caída. Pages ignora todo lo que no sea `onRequest*`,
así que exportarlas no crea ninguna ruta nueva.

**El sello, que es lo que ADR-023 obliga a escribir dentro:**

```js
export const SELLO = {
    "base": "examen-td-js-produccion",
    "entorno": "local",
    "generada_en": "2026-09-05T11:01:45.130Z",
    "preguntas": 8,
    "descartadas": 0
};
```

No es metadato: **de ahí sale, literalmente, la fecha que el aviso le muestra al estudiante.** Sin sello, el aviso diría
«puede no estar al día» sin poder decir de cuándo es la copia, que es el dato con el que uno decide si confiar o no.

**Tres veredictos, los tres provocados:**

| Estado                 | Cómo se provocó                                  | Veredicto                                                | Código |
|------------------------|--------------------------------------------------|----------------------------------------------------------|--------|
| Generada               | base local con las 8 activas                     | `INSTANTANEA GENERADA`, 8 preguntas                      | 0      |
| Banco sin preguntas    | `UPDATE pregunta SET estado='borrador'` en local | `NO SE GENERO *** EL BANCO NO TRAJO NI UNA PREGUNTA ***` | 1      |
| Pisaría una de la nube | marcando el sello anterior como `nube`           | `ME NIEGO A PISAR LA INSTANTANEA *** ADR-023 ***`        | 1      |

En el segundo caso se comprobó por hash que **el archivo anterior no se tocó**
(`6c5f0f9e…` antes y después): una copia desactualizada sirve, una copia vacía no. El día que el banco se vacíe por
accidente, el generador no puede ser quien convierta ese accidente en un respaldo vacío publicado.

El tercero es el fallo silencioso que ADR-023 describe, y el único camino real por el que puede ocurrir: alguien prueba
el generador en local y commitea el resultado. La salida explícita es `PERMITIR_INSTANTANEA_LOCAL=1`, ejercitada
también.

Y las dos guardas heredadas de la iteración 21 están puestas: el nombre de la base tiene que estar declarado en
`wrangler.toml` (H-015) y el modo remoto se niega salvo
`PERMITIR_REMOTO=1` (capa 3 de ADR-015).

**Un tercer aviso, en la construcción.** `npm run build` mira el sello de la instantánea que va a publicar y, si no
viene de la nube, lo dice a gritos. No detiene la construcción a propósito: en desarrollo la instantánea local es la
normal y fallar ahí dejaría el proyecto sin poder construirse.

#### El respaldo en el sitio

`leerPreguntas()` cambió de una línea a una decisión: si el servicio falló **y** el error trae `usar_respaldo`, carga
`static/js/data/instantanea-banco.js` con un `import()`
dinámico y devuelve la misma forma de siempre, con una diferencia declarada:
`meta.respaldo` trae el sello. Ningún componente tiene que saber de dónde salieron las preguntas, pero el que quiera
avisar tiene con qué.

El import es dinámico a propósito: el archivo trae el banco entero y no tiene por qué viajar en la carga normal de la
página, que es la que ocurre siempre.

**Y por eso `build-dist.mjs` ahora sigue los `import()` además de los `import`.** El comprobador de enlaces sólo miraba
los estáticos, así que la ruta de la instantánea —la única que se carga así— no se comprobaba. Es el camino que corre
únicamente el día que la capa de datos cae, o sea el día en que una errata en la ruta ya no se puede arreglar:
si no se comprueba en la construcción, no se comprueba en ninguna parte. Los recursos enlazados pasaron de 16 a 17, y el
17 es la instantánea.

#### El aviso, y dónde va

Va **arriba del banco**, en `#aviso-respaldo`, no en el pie. El pie es discreto por diseño y un aviso discreto no cumple
lo que pide el criterio —«visible para el estudiante y no sólo un mensaje de consola»—: se lee después de estudiar, o no
se lee. El archivo `estado-datos.js` esperaba alojarlo y quedó dicho ahí por qué no fue así.

> Estás viendo una copia guardada del banco de preguntas.
> No se pudo conectar con el servidor, así que el cuestionario se cargó desde la copia
> incluida en el sitio. Puedes practicar con normalidad, pero puede que falten preguntas
> nuevas o correcciones recientes. **Es la copia del 5 de septiembre de 2026.**

El pie dice lo mismo en corto: `Banco de preguntas: copia guardada en el sitio (8
preguntas). Sin conexión con el servidor.` Si alguna vez se contradicen, manda el de arriba.

#### La caída, provocada tres veces

Corriendo el componente real —el mismo `renderCuestionario()` de la página— contra tres situaciones distintas:

| Situación               | Cómo se provocó                        | Preguntas                      | Aviso             |
|-------------------------|----------------------------------------|--------------------------------|-------------------|
| Sitio sin capa de datos | `npm run serve:dist` en el puerto 3000 | **8**, 32 alternativas         | **sí**, con fecha |
| Nadie escuchando        | apuntando a un puerto muerto           | **8**, 32 alternativas         | **sí**            |
| Capa de datos viva      | `npm run datos:dev`                    | 8, 32 alternativas             | **no**            |
| Banco conectado y vacío | las 8 preguntas puestas en `borrador`  | 0, con «todavía sin contenido» | **no**            |

La cuarta fila es la que evita el peor final posible: **un banco vacío no activa el respaldo.** El extremo contestó bien
y lo que dijo es que no hay preguntas; si la instantánea entrara ahí, el día que el banco se vacíe por accidente el
sitio serviría la copia y nadie se enteraría del error. Es la regla de la cabecera de `_comun.js`, ahora comprobada.

#### H-018 · el respaldo no se activaba, y sólo se vio al provocar la caída

La primera provocación **falló**: cero preguntas, sin aviso. El respaldo estaba generado, el sitio lo tenía a mano, y no
se usó.

`npm run serve:dist` mira la cabecera `accept` y responde su 404 **en JSON**. Eso pasa el filtro de `content-type` del
cliente —cuyo comentario nombra este mismo escenario— y entonces se leía `usar_respaldo` de un sobre ajeno que no lo
trae: `Boolean(undefined)`
es `false`, así que el sitio concluía «esto no es un fallo del servicio» y se quedaba sin banco y sin respaldo.

Lo afinado es de dónde salía ese `false`: no de un error, sino de un valor **ausente**
convertido a booleano. La expresión se lee como una precaución y estaba al revés. Arreglado reconociendo el sobre propio
por sus tres marcas antes de leerlo por dentro; cualquier otro sobre significa que no llegamos a la capa de datos, y eso
ya tenía nombre. Detalle y reglas en la auditoría, H-018.

**El defecto venía de la iteración 12 y ninguna lectura lo había visto.** Lo encontró el criterio que exige provocar la
caída en vez de razonar sobre el código.

### Actualización del estado, 2026-09-05 tras el punto 4

Sustituye a la tabla «Lo que falta, y qué necesita de quién» de más arriba, que se escribió antes de que existiera la
instantánea. Se deja aquella escrita, no borrada.

**Hecho desde entonces:** el generador con su sello, el respaldo en el sitio y el aviso visible. Ya no falta ningún
punto de las tareas.

**Lo que sigue necesitando al autor, y por qué:**

| Criterio                                           | Quién y cómo                                                                                                                                                                                                                                                                                                          |
|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| La instantánea coincide con lo que hay en D1       | **El autor**, por ADR-023: se genera desde la nube y ADR-015 no me deja llegar ahí. La que hay versionada ahora sale de la base **local**, o sea del banco de juguete, y su sello lo dice: `"entorno": "local"`. **Hay que regenerarla desde la nube antes de publicar**, y `npm run build` avisa mientras no se haga |
| El aviso de respaldo es visible para el estudiante | **El autor**, mirándolo. Está comprobado que se dibuja arriba del banco con su texto y su fecha, y que no es un mensaje de consola; que se vea bien en pantalla es otra cosa                                                                                                                                          |
| Sin errores de consola servida por HTTP            | **El autor**, otra vez: la página cambió después de su pasada anterior. Son los mismos pasos, más el modo degradado                                                                                                                                                                                                   |

**Sobre el comando remoto.** No está escrito en el manual todavía a propósito: ADR-023 manda que el procedimiento
—editar, exportar `d1/respaldo-banco.sql`, regenerar la instantánea, publicar— se escriba **como un solo bloque**, y eso
le toca a la iteración

23. Escribir aquí media receta sería garantizar que alguien la siga sin la otra mitad. El comando exacto está en la
    cabecera de `scripts/generar-instantanea.mjs`, y el propio guion lo recuerda cada vez que genera desde la nube.

### La primera ejecución contra la nube, 2026-09-05

La corrió el autor y **falló**. Dos cosas salieron de ahí, y son de naturaleza distinta:
una es un defecto del generador, la otra es que el criterio no se puede cerrar todavía.

#### H-019 · el generador tapaba el error de wrangler con un fallo propio

Lo que se vio: `No pude interpretar la respuesta de wrangler: Unexpected non-whitespace
character after JSON at position 99 (line 5 column 6)`. Falló bien —no escribió nada y dejó intacta la instantánea
anterior— pero dijo lo que no era.

**La primera hipótesis, del autor, era que wrangler devuelve un documento JSON por consulta y el generador los
interpretaba como uno solo. Comprobada, y no es eso:**
wrangler tiene una sola impresión, `JSON.stringify(response, null, 2)` en
`wrangler-dist/cli.js:223739`, compartida por el camino local y el remoto; y en local, con las mismas dos consultas,
llega un arreglo con dos bloques. Queda escrito porque la hipótesis era razonable y habría llevado a escribir un
interpretador de varios documentos que no hacía falta, dejando el defecto real dentro.

Lo que sí pasa: con `--json`, wrangler contesta de **dos formas** por la misma salida —el arreglo de resultados si la
consulta funciona, y un objeto de error si no—. El generador conocía sólo la primera, y para encontrarla arrancaba a
interpretar **desde el primer
`[`** de la salida. El error remoto llega como `APIError`, que trae `notes`, que es un arreglo: ese `[` era el primero,
así que se interpretaba el interior del error y reventaba en la coma siguiente. Reproducido con un sobre igual al que
arma `cli.js:223743`, con **la misma línea y la misma columna** que reportó el autor.

Arreglado: se interpreta la salida entera, se reconoce el sobre de error y se muestra su texto y sus notas **antes** del
párrafo de siempre, y si no se entiende nada se muestra crudo lo que wrangler dijo. Reproducido de punta a punta
borrando la vista
`pregunta_activa` de la base local:

```
Wrangler no pudo ejecutar la consulta. Lo que dijo, tal cual:

  no such table: pregunta_activa: SQLITE_ERROR
  …
Si dice «no such table», esa base todavia no tiene el esquema del banco.
```

Vista repuesta desde la migración después, y comprobado que vuelve a devolver las 8 activas.

**La lección no es «las pruebas locales no podían ver un defecto remoto».** Este defecto era reproducible en local desde
el primer día: basta con que la consulta falle. El generador se entregó con «tres veredictos provocados» y los tres eran
situaciones que inventé yo —banco vacío, instantánea que se pisaría—. **El fallo que la herramienta puede entregar no lo
probé ni una vez.** Está escrito así en H-019.

#### Dos guardas nuevas, de la misma corrida

Para poder probar contra la nube sin contaminar el repositorio:

- **`--ensayo`**: lee, valida, informa y **no escribe nada**. Es lo que se corre contra
  `examen-td-js-pruebas`.
- **El generador sólo escribe desde la base del enlace principal de `wrangler.toml`**, o sea la que el sitio publica.
  Una copia del banco de pruebas versionada como respaldo, con el sello diciendo «nube», desactivaría todos los demás
  avisos de golpe. Provocado:
  `NO SE GENERO *** ESA BASE NO ES LA QUE PUBLICA EL SITIO ***`, código 1, sin llegar a consultar.

#### El arreglo, comprobado contra la nube

Lo ejecutó el autor el 2026-09-05 contra `examen-td-js-pruebas` —la única base de la nube con datos— en modo ensayo, y
con el mismo resultado en PowerShell y en Git Bash:

```
ENSAYO CORRECTO  ***  NO SE ESCRIBIO NADA  ***
Base consultada  examen-td-js-pruebas (nube)
Preguntas listas 8
Alternativas     32
Descartadas por la validacion: ninguna
```

Con eso queda comprobado, **por el camino remoto real y no por uno simulado**, que la respuesta de wrangler se
interpreta bien, que las preguntas se arman con sus alternativas y que pasan la validación del extremo. Y que `--ensayo`
cumple lo que dice:
el archivo versionado no se tocó.

Lo que esto **no** cierra es el criterio de la instantánea, y no por un defecto: es el banco de pruebas, no el real.
Sigue abajo.

#### El criterio de la instantánea queda aplazado a la iteración 24

**Y el motivo no es que la prueba falle: es que todavía no hay nada que copiar.**

ADR-023 manda generar la instantánea **desde la base de la nube**. La base de producción está **vacía**, porque el
esquema no se ha aplicado allá: ese paso se trasladó a la iteración 24 el 2026-09-04, a propósito, porque crear el
esquema en producción sin contenido que meterle no aporta nada. De modo que aunque el JSON se interpretara perfecto —y
ahora se interpreta— la consulta caería con `no such table: modulo`. Que es, literalmente, lo que dijo.

Decisión del autor, 2026-09-05: **el criterio «existe la instantánea versionada y su contenido coincide con lo que hay
en D1» se aplaza a la iteración 24**, anotado allá como dependencia explícita pegada al paso donde se aplica el esquema
y se carga el banco. El orden queda: esquema → carga → generar la instantánea desde producción → commit.

**No se genera desde pruebas como sustituto**, por decisión expresa del autor y porque es el fallo silencioso que
ADR-023 vino a evitar. El generador ahora se niega por su cuenta.

## Cierre

**Cerrada el 2026-09-05 por el autor.**

El banco llega desde D1 hasta `cuestionario.html`, validado y escapado, y el sitio sigue funcionando cuando la capa de
datos no responde: carga la instantánea versionada y **se lo dice al estudiante**, arriba del banco y con la fecha de la
copia.

**Nueve criterios con evidencia y uno aplazado.** El aplazado es «la instantánea coincide con lo que hay en D1», y se va
a la iteración 24 por un motivo que no es un
fallo:
ADR-023 manda generarla desde la nube y **producción todavía no tiene esquema**, así que no hay nada que copiar. Queda
anotado allá como dependencia explícita, pegada al paso donde se aplica el esquema y se carga el banco.

### Los diez criterios, con su evidencia y quién la produjo

La columna **quién** no es un trámite. Hay cosas que este proyecto sólo puede dar por comprobadas si las mira una
persona —lo que se ve en pantalla y lo que aparece en la consola del navegador— y hay otras que sólo se comprueban
provocando la situación. Mezclarlas es lo que produce criterios cerrados por inferencia.

| # | Criterio | Evidencia | Quién |
|---|---|---|---|
| 1 | `cuestionario.html` muestra las preguntas de D1 | El componente arma el HTML correcto contra el extremo real: 8 preguntas, 32 alternativas, agrupadas en 7 módulos. Que el navegador lo **pinte** es otra afirmación, y ésa la cerró la pasada del autor | **Los dos** · yo el HTML, el autor la pantalla |
| 2 | Un registro con campo obligatorio vacío se descarta y aparece en el informe | Provocado rompiendo tres filas de tres maneras distintas en la base local: `leidas 8 · entregadas 5 · descartadas 3`, con `1 alternativa(s) sin texto` en la pregunta 3. Base devuelta a su estado después | Claude Code |
| 3 | Un registro sin respuesta correcta válida se descarta y aparece en el informe | Misma corrida: `ninguna alternativa marcada como correcta` en la pregunta 2, y la respuesta siguió siendo `ok: true` con las cinco sanas | Claude Code |
| 4 | La instantánea coincide con lo que hay en D1 | **Aplazado a la iteración 24.** No hay evidencia porque no hay nada que copiar: producción no tiene esquema | — |
| 5 | Con el Worker caído el sitio carga desde la instantánea y muestra el aviso | Provocado **cuatro veces** con el componente real: sitio servido sin capa de datos (`serve:dist`), puerto muerto, capa de datos viva —sin falso positivo— y banco conectado y vacío, que **no** activa el respaldo. En los dos primeros: 8 preguntas, 32 alternativas y el aviso con su fecha | **Los dos** · yo las cuatro provocaciones, el autor la de `serve:dist` en el navegador |
| 6 | El aviso de respaldo es visible para el estudiante, no sólo un mensaje de consola | Yo aporté lo estructural: se dibuja en `#aviso-respaldo`, **arriba del banco**, con su texto y la fecha del sello, y no es una llamada a la consola. **Que se vea bien en pantalla sólo lo puede decir quien mira la pantalla** | **El autor** |
| 7 | Un enunciado con `<div>` se muestra como texto literal y no rompe la tarjeta | El guardián del escapado lo comprueba en cada corrida: la forma cruda no aparece y la escapada sí, `&lt;div&gt;`. Y ninguna etiqueta ajena al componente en el HTML resultante | Claude Code |
| 8 | Una pregunta con orden fijo conserva el orden; una sin la marca lo cambia | Seis renderizados reales: la pregunta 8 (`orden_fijo = 1`) dio **un solo orden**, con «Ambas B y C son correctas» siempre al final; la pregunta 1 dio **cinco órdenes distintos** en seis tiradas | Claude Code |
| 9 | Sin errores de consola al cargar la página servida por HTTP | Yo comprobé lo que se puede comprobar sin navegador: los 12 recursos que pide la página y los tres extremos responden 200, incluido el favicon, así que no debía haber 404 ni módulos rotos. **Eso es una predicción, no la consola.** La consola la ve el autor | **El autor** |
| 10 | `/api/prueba` ya no existe y ningún archivo del sitio lo menciona | Retirados el extremo, la función que lo envolvía y la tabla de la base de pruebas; el extremo responde **404 en JSON** con `usar_respaldo: false`. La búsqueda se rehízo por el nombre de la función y no sólo por la ruta, que es lo que había fallado | Claude Code |

**Seis criterios los cerré yo provocando la situación, dos los cerró el autor mirando la pantalla, dos son de los dos, y
uno queda aplazado.** Los dos que son sólo del autor son exactamente los dos que necesitan ojos: si me los hubiera
atribuido, habrían quedado cerrados por inferencia sobre el HTML, que es justo el error que esta tabla existe para no
cometer.

**Cuatro hallazgos, los cuatro encontrados provocando situaciones y no leyendo código:**

|       | Qué era                                                                                                                    |
|-------|----------------------------------------------------------------------------------------------------------------------------|
| H-017 | El guardián del escapado dejaba el contenido hostil dentro de la base local: `process.exit()` no ejecuta los `finally`     |
| H-018 | El respaldo no se activaba si el que contestaba devolvía un error en JSON ajeno. Venía de la iteración 12                  |
| H-019 | El generador tapaba el error de wrangler con un fallo de sintaxis propio, y el mensaje perdido era el diagnóstico completo |
| H-020 | `package.json` no declara `"type": "module"`. Menor y abierto                                                              |

**Lo que este cierre NO autoriza: publicar.** `git push` a `main` dispara la construcción y publica solo, y desde esta
iteración el cuestionario se sirve de D1. Con producción sin banco, el sitio publicado quedaría en modo degradado
sirviendo el banco de juguete: ocho preguntas de ejemplo presentadas como copia guardada, sin que nada esté roto y sin
que nadie se entere. **`main` no se toca hasta el último paso de la iteración 24**, que existe para eso y lo dice.