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

## Decisiones de diseño · las dos, resueltas el 2026-09-09

Dos, y ninguna se resuelve empezando a cargar.

**Las dos las cerró Felipe Cuevas el 2026-09-09, antes de convertir nada.** El
planteamiento original de cada una se conserva íntegro y la resolución va después,
porque el planteamiento explica por qué había que elegir en vez de dejar que pasara.

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

> ### Resuelta · el rescate va antes del retiro, y el testigo tiene que seguir ahí
>
> **Decidido por Felipe Cuevas el 2026-09-09.**
>
> El criterio **no se cierra mostrando que la conversión marcó la pregunta**. Eso
> sólo demostraría que el convertidor hizo lo que su autor creía que hacía. Se
> cierra **consultando D1 y viendo `orden_fijo = 1`**, con
> `static/js/data/cuestionario.js` **todavía en el árbol**.
>
> **Motivo, y es el que manda:** si el archivo viejo ya no está, la comprobación
> perdió su testigo. Queda un `1` en una columna y ninguna forma de saber si
> corresponde a algo. La única copia de esa marca vive en el `.js`, así que
> mientras el `.js` exista la comprobación se puede repetir contra su origen, y en
> cuanto se retire deja de poder repetirse **para siempre**.
>
> **Orden obligado, y no es una preferencia de estilo:** cargar → consultar D1 →
> mostrar la evidencia → recién entonces retirar el `.js`. El retiro es el último
> paso de la iteración y ocurre después de que esta evidencia esté escrita.
>
> **Comprobado el 2026-09-09, antes de empezar:** la marca existe una sola vez en
> los dos bancos —`Módulo 2`, posición 11, «¿Qué comando de Git permite crear una
> nueva rama y cambiar a ella de manera simultánea?»— y el sitio **ya sabe
> honrarla**: `components/cuestionario.js` ordena por `orden` en vez de barajar
> cuando `orden_fijo === 1`. Rescatar el dato basta; no hay que escribir además el
> comportamiento.

**2. ¿En qué estado entra cada banco?** Las 368 no tienen justificación. Cargarlas
todas en `borrador` deja el sitio publicado sin contenido visible hasta que se
redacten 368 justificaciones, que es mucho trabajo. Las salidas no son equivalentes:

- Todo en `borrador`, y se van activando por módulo a medida que se redacta.
- Un subconjunto en `activa` con justificación escrita primero, y el resto en
  borrador.
- Redactar las 368 antes de cargar nada.

Quien decida esto lo documenta aquí con su motivo. Lo que **no** es una salida es
activar preguntas sin justificación: la propia herramienta lo impide, y hace bien.

> ### Resuelta · por módulo completo, uno a la vez
>
> **Decidido por Felipe Cuevas el 2026-09-09.** Se redactan las justificaciones de
> un módulo, se carga ese módulo en estado `activa`, y el resto espera. **No se
> cargan las 368 de una.**
>
> **Motivo:** es la única salida que hace recorrer el circuito entero —convertir,
> cargar, activar, ver en el sitio— **con un lote pequeño antes de repetirlo
> trescientas veces**. Si algo del formato o de la herramienta está mal, se
> descubre con 52 preguntas y no con 368. Y de paso el estudiante tiene material
> útil desde el primer módulo, en vez de esperar a que estén las 368.
>
> Nótese que **ninguna de las tres salidas que este archivo listaba era ésta**: las
> tres partían de cargar el banco entero y discutían en qué estado. La cuarta cambia
> el **tamaño del lote**, que era la variable que de verdad importaba.

### El primer lote es el módulo 2

**Elegido a propósito por Felipe Cuevas el 2026-09-09**, y conviene anotar las dos
razones porque no es un lote cualquiera:

- **La única pregunta con orden fijo de todo el proyecto está ahí**, en el banco
  viejo, posición 11. Empezando por el módulo 2 el rescate ocurre en el **primer
  lote** y no queda esperando al final, que es donde los rescates se olvidan.
- **Tiene material de los dos bancos**, así que ejercita las dos conversiones,
  incluida la traducción del índice numérico a letra — que es donde puede colarse
  un desplazamiento silencioso.

| | Origen | Preguntas |
|---|---|---|
| Banco nuevo | `_planmaestro/00_producto/cuestionarios/modulo-02.json` | 39 |
| Banco viejo | `static/js/data/cuestionario.js`, «Módulo 2» | 13 |
| | **Total del primer lote** | **52** |

*Las tres cifras contadas sobre los archivos el 2026-09-09, no de memoria.*

### Los siete módulos van en esta iteración

**Decidido por Felipe Cuevas el 2026-09-09.** La iteración 25 no se parte.

**Motivo:** los siete son **el mismo trabajo repetido**. Separarlos sólo por su
duración sería un corte administrativo y no uno de naturaleza, y este plan corta las
iteraciones por naturaleza — es lo mismo que justificó partir la 24 de la 25, donde
sí había dos trabajos distintos: infraestructura y contenido.

**Consecuencia sobre los criterios, que había que resolver y no ignorar:** los
criterios pasan a tener **dos niveles**. Los de lote se cierran módulo a módulo con
su evidencia; el agregado sólo lo cierra el último módulo. Un criterio que dice «las
368» y se mira siete veces no se cierra siete veces: se cierra una, al final.

### Se publica después de cada módulo

**Decidido por Felipe Cuevas el 2026-09-09**, resolviendo una inconsistencia de la
decisión anterior: el motivo de cargar por módulo incluía que **el estudiante tuviera
material desde el primer módulo**, y eso sólo se cumple si se publica cada vez.
Acumular siete módulos y publicar al final deja el beneficio sin cobrar.

Cada módulo se cierra con **el bloque completo de ADR-023**: instantánea desde la
nube, respaldo exportado en el mismo acto, `npm run verificar` en verde, push.

**Motivo de aceptar repetirlo siete veces, y es el que manda sobre la incomodidad:**
**ese bloque nunca se ha recorrido entero.** Está escrito en
`90-manual/administrar-el-banco.md` y marcado como **NO RECORRIDO** desde la
iteración 23, porque sus cuatro últimos pasos tocaban una producción que no existía.
La primera vez va a ser lenta y probablemente aparezcan problemas; **repetirla es lo
que lo convierte en procedimiento en vez de hipótesis.** Y si resulta insoportable,
después del segundo módulo lo sabremos con información real y cambiaremos de
estrategia — que es distinto de decidirlo ahora por anticipado.

## Avance por módulo

*Una fila por módulo. Existe para que el estado se vea de un vistazo y **ningún
módulo se dé por hecho porque «ya hicimos ese»**: una iteración larga pierde la
disciplina de cerrar con evidencia en cuanto nadie puede ver dónde va.*

| Módulo | Preguntas | Convertido | Comprobado | Justif. revisadas | Cargado | Publicado |
|---|---|---|---|---|---|---|
| 2 | 52 · 39 + 13 | 🟢 | 🟢 | 🟢 52 de 52 | 🟢 comprobado en D1 | 🟢 visto en el sitio |
| 3 | 61 · 50 + 11 | 🟢 | 🟢 | 🟢 61 de 61 | 🟢 comprobado en D1 | 🟢 visto en el sitio |
| 4 | 61 · 46 + 15 | 🟢 | 🟢 | 🟢 61 de 61 | 🟢 comprobado en D1 | 🟢 desplegado |
| 5 | 49 · 38 + 11 | 🟢 | 🟢 | 🟢 49 de 49 | 🟢 comprobado en D1 | 🟢 publicado |
| 6 | 52 · 38 + 14 | 🟢 | 🟢 | 🟢 52 de 52 | ⚪ | ⚪ |
| 7 | 48 · 38 + 10 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| 8 | 45 · 36 + 9 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| | **368 · 285 + 83** | | | | | |

**Estados:** ⚪ Sin empezar · 🔵 En curso · 🟢 Con evidencia

«Comprobado» es la comparación anclada en el texto de la correcta, contra los
archivos de origen. «Cargado» sólo se marca cuando **D1 confirma** la carga, no
cuando la herramienta dice que la aplicó (H-016).

## El procedimiento de un lote, de principio a fin

*Escrito el 2026-09-09, **antes de convertir el módulo 3 y a propósito**. Si se
escribiera después de convertirlo, saldría un procedimiento que describe el módulo 3 en
vez de uno que sirva del 4 al 8: escribirlo antes lo obliga a ser general, y el módulo 3
pasa a ser su primera prueba en vez de su molde.*

**Esto arregla el hallazgo de fondo del módulo 2: la rama más cara del procedimiento
—qué hacer cuando aparece una corrección— vivía en la memoria de quien lo había hecho.**
Se lee de principio a fin sin tener que saber nada que no esté aquí.

**Quién corre qué.** Los pasos 1 a 6 y el 8 los corre Claude Code contra la base local.
Los pasos 7, 9 y 10 tocan la cuenta de Cloudflare y **los corre Felipe Cuevas**
(ADR-015), desde su computador y habiendo revisado antes formato e integridad (ADR-026).

---

### 0 · Despertar la sesión de la nube · **(autor)** · *añadido el 2026-09-10*

```powershell
node node_modules/wrangler/bin/wrangler.js whoami
```

Tiene que responder con la cuenta. **Si falla**, la sesión está fría y se despierta
con el que abre el navegador:

```powershell
node node_modules/wrangler/bin/wrangler.js login
```

> **Por qué existe este paso.** La carga del módulo 3 murió con un fallo de
> autenticación **7403** en la **primera llamada de una terminal recién abierta**.
> Aquí se abre una terminal por carga y entre carga y carga pasan **días**, así que
> la sesión guardada llega fría a la primera llamada. El manual describía `login`
> como «una sola vez por equipo», y esa frase se escribió cuando la única pregunta
> era cómo autenticarse la primera vez.
>
> **Se usa `whoami` y no `login`** porque es de solo lectura, no abre el navegador y
> sirve además como pregunta: si contesta, la sesión está viva y se sigue.
>
> ### ⚠️ Corregido el 2026-09-10: este paso NO evita el 7403
>
> Se escribió arriba que convertía «un fallo a mitad de carga en un fallo antes de
> empezar». **La carga del módulo 5 lo desmintió:** se corrió `whoami`, respondió con
> la cuenta, y la llamada siguiente falló con **7403** igual. A la vez siguiente, sin
> cambiar nada, funcionó.
>
> **La hipótesis de la sesión fría queda refutada como causa suficiente**, y el 7403
> resultó ser **transitorio**. No se sabe su causa: propagación del token, límite de
> tasa o un problema pasajero del proveedor son candidatos, y **ninguno está
> comprobado**.
>
> **El paso se conserva y cambia su motivo:** ya no está para prevenir el 7403 —no lo
> previene— sino porque sigue siendo la forma barata de comprobar que **hay sesión**
> antes de empezar, y ese fallo distinto sí existe y sí lo caza. Cuesta un segundo.
>
> **Y si el 7403 aparece igual, no repitas la carga a ciegas:** el mensaje de
> `SIN VEREDICTO` imprime el comando exacto para mirar la base antes de decidir.
>
> **Esto no arregla H-019**, que es otra cosa y sigue abierta: el guion no supo leer
> ese error porque venía como sobre con `notes: [...]`. El 7403 fue amable porque
> falló **antes** de escribir; otro fallo de la nube daría el mismo `SIN VEREDICTO`
> con la carga quizá ya dentro. **Resolver el login tapa el síntoma sin arreglar el
> defecto**, y por eso queda anotado en la auditoría en vez de darse por cerrado.

### 1 · Convertir

```
node scripts/convertir-banco.mjs <N>
```

Sale `d1/encargos/modulo-0N.json`: las preguntas de los dos bancos en formato de
encargo, **todas en `borrador`, sin justificación y sin dificultad**. El encargo queda
**sellado** con la huella de sus cuatro orígenes (ADR-028).

### 2 · Comprobar la conversión

```
node scripts/comprobar-conversion.mjs <N>
```

Contrasta el encargo contra los archivos de origen sin compartir una línea con el
convertidor. Ancla en el texto de la correcta. **Si dice que no, no se sigue.**

### 3 · Redactar las justificaciones

Se escriben los textos en
`_planmaestro/00_producto/cuestionarios/justificaciones/modulo-0N.json`, marcando
**`[DUDA]`** dentro del texto donde no se dé algo por seguro. La convención está en el
propio archivo y no es adorno: **donde no aparece `[DUDA]`, se está afirmando.**

```
node scripts/redactar-justificaciones.mjs <N>
```

Arma `modulo-0N-revision.md`, con cada justificación al lado de su pregunta y sus cuatro
alternativas. Las preguntas con duda salen además listadas al principio.

### 4 · Revisar · **(autor)**

El autor edita el documento: marca lo que aprueba, corrige lo que no le sirve, deja sin
marcar lo que no acepta. Lo no aprobado no se pierde: se carga en `borrador`.

> ### ⚠️ Aquí nace la rama que se olvidaba, y por eso está dentro de la lista
>
> **Las `[DUDA]` no son sólo dudas del redactor. En el módulo 2, cinco de ellas
> resultaron ser enunciados malos** — una premisa falsa, dos respuestas correctas, un
> «exclusivamente» que el estándar no sostiene. Fueron **5 de 52, casi el 10%**.
>
> Cuando el autor aprueba una corrección de enunciado, se va al **paso C** de abajo y
> **se vuelve al paso 1**. No es opcional y no depende de acordarse: los pasos 5, 7 y 9
> se niegan solos si el origen se movió (ADR-028).

### 5 · Aplicar lo aprobado

```
node scripts/aplicar-justificaciones.mjs <N>
```

Sale `d1/encargos/modulo-0N-para-cargar.json`: lo aprobado en `activa` con su texto tal
cual se leyó, lo demás en `borrador`. **Coteja el sello de procedencia y se niega si un
origen se movió.**

### 6 · Ensayo local · **obligatorio, no es buena costumbre**

```
node scripts/ensayo-local.mjs <N>
```

Vacía el banco local, carga el lote con la herramienta de verdad, y le corre encima **el
mismo comprobador que después se corre contra producción, con el mismo comando salvo el
destino**. Al terminar reconstruye el banco de juguete desde `d1/ejemplo-banco.sql`.

**Es un ensayo general gratis del comando caro.** Si el encargo tiene algo mal, se
descubre donde equivocarse cuesta volver a correr un guion. **Si el ensayo falla, no se
pasa al 7.**

*En el módulo 2 esto se hizo, pero para probar la herramienta y no como paso. Lo que no
está escrito como paso se salta el día que hay prisa, que es justo cuando conviene
haberlo hecho.*

### 7 · Cargar en producción · **(autor)**

```powershell
$env:PERMITIR_REMOTO=1
node scripts/administrar-banco.mjs insertar d1/encargos/modulo-0N-para-cargar.json --base=examen-td-js-produccion --remote --registro=carga-modulo-0N.txt
```

Antes de correrlo, confirmar el uuid que anuncia la herramienta: producción es
`cff1686b-3b24-4892-9a10-4306684e0127` (H-015). La carga es **todo o nada**, comprobado
por los dos caminos de wrangler (H-025). **También coteja el sello de procedencia**: es
la última puerta antes de escribir.

### 8 · Comprobar la carga · **(autor)**

```powershell
$env:PERMITIR_REMOTO=1
node scripts/comprobar-carga.mjs <N> --base=examen-td-js-produccion --remote --registro=evidencia-modulo-0N.txt
```

Cierra cinco de los siete criterios de nivel 1 de una corrida. **Si dice
`NO CORRESPONDE`, no se sigue al 9:** una instantánea sacada de una base que no
corresponde a los orígenes propaga el error al archivo versionado.

### 9 · Respaldo e instantánea, en un solo paso · **(autor)**

```powershell
$env:PERMITIR_REMOTO=1
npm run datos:publicar -- --base=examen-td-js-produccion --remote --registro=publicacion-modulo-0N.txt
```

Es el bloque de ADR-023, entero. Las dos mitades se instalan juntas o no se instala
ninguna. El sello tiene que decir `"entorno": "nube"`.

### 10 · Publicar · **(autor)**

Los **tres** archivos generados van en el mismo commit, y `git push` a `main`.
Empujar es publicar.

| Archivo | Lo genera |
|---|---|
| `d1/respaldo-banco.sql` | el paso 9 |
| `static/js/data/instantanea-banco.js` | el paso 9 |
| `static/css/style.css` | el paso 4, al recompilar |

> **El CSS es el tercero y se descubrió tarde (H-031).** El texto del banco entra
> en la instantánea, la instantánea vive en `static/js/`, y ese directorio está
> dentro del `content` de Tailwind — así que **una justificación que mencione una
> palabra que Tailwind reconozca como clase agrega reglas al CSS del sitio**. Pasó
> con `.collapse()`, nombrado en una justificación del módulo 2 sobre jQuery: 80
> bytes nuevos en `style.css` sin que nadie tocara un estilo.
>
> No es un defecto y no hay nada que arreglar en el archivo: está bien generado y
> solo faltaba commitearlo. Lo que hay que recordar es que **son tres y no dos**,
> y por eso están en una tabla en vez de en una frase.

### 11 · Ver el módulo en el sitio · **(autor)**

Cuenta de preguntas, insignia, las preguntas del módulo visibles, y **ningún aviso
de respaldo** — si aparece, el sitio está leyendo la instantánea y no la capa de
datos.

> **Aquí NO se comprueba que la justificación aparezca al responder, y conviene
> saber por qué.** No está implementado: mostrarla es trabajo de la **épica 30,
> iteración 33**, y estaba en el registro como pendiente desde antes de esta
> iteración. *Corregido el 2026-09-10: hasta esa fecha este paso lo pedía, y no
> podía cumplirse.*
>
> **No es un defecto de la carga.** Si al mirar el sitio no ves la justificación,
> eso es lo esperado y no hay nada que arreglar.

---

### La rama de corrección · pasos A, B y C

*Se entra aquí desde el paso 4, y también desde cualquier punto posterior: una
corrección aprobada tarde sigue siendo una corrección aprobada.*

**A · Se detecta.** Casi siempre desde una `[DUDA]` del paso 3, al revisar. También
puede salir del paso 8, si el comprobador destapa algo, o de leer el sitio publicado.

**B · Se aprueba.** La propone Claude Code con su motivo; **la aprueba el autor**. Una
pregunta cuya correcta resulta no serlo vale más que veinte justificaciones.

**C · Se registra y se aplica al origen.** La entrada va a
`_planmaestro/00_producto/cuestionarios/correcciones-de-enunciado.json` con el texto
original, el corregido, el motivo, quién la propuso y quién la aprobó. Y **se aplica al
archivo de origen**, no al encargo: el encargo es derivado.

**Y se vuelve al paso 1.** El módulo entero, no la pregunta.

> **Por qué el módulo entero y no sólo la pregunta corregida.** Porque una corrección
> puede tocar el texto de la alternativa correcta, que es donde ancla el comprobador, y
> entonces la comprobación de todo el módulo se hizo contra un texto que ya no existe.
> Pasó en el módulo 2 con `m02#9`.
>
> **No hay que re-aprobar todo.** El documento de revisión conserva las aprobaciones
> cuya pregunta y justificación no cambiaron y devuelve a cero sólo las demás. En el
> módulo 2, cinco correcciones movieron cinco justificaciones y cuarenta y siete
> siguieron aprobadas.
>
> **Y si a alguien se le olvida volver al paso 1, no pasa nada malo:** los pasos 5, 7 y
> 9 cotejan el sello y se niegan. Eso es ADR-028 y es lo que convierte esta rama de una
> instrucción que hay que recordar en una que no se puede saltar.

---

### Lo que este procedimiento sigue sin poder decir

- **Que las justificaciones sean ciertas.** Que existan y no sean de relleno se
  comprueba; que sean verdad, no.
- **Que el banco no tenga duplicados por redacción distinta.** Son esperados y a veces
  deseables: el examen real repite el mismo hecho con redacciones distintas.
- **Que el sesgo de posición esté corregido.** H-004 se informa y no se arregla.


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

**Herramientas escritas el 2026-09-09, con el módulo 2 ya recorrido:**

| Guion | Qué hace |
|---|---|
| `scripts/convertir-banco.mjs` | Convierte un módulo de los dos bancos al formato de encargo. `justificacion` sale `NULL`, `dificultad` ausente y `estado` en `borrador`, en las 52 y sin excepción |
| `scripts/comprobar-conversion.mjs` | Contrasta el encargo contra los archivos de origen, **sin importar una sola línea del convertidor**. Ancla en el texto de la correcta. `--sabotaje=` lo rompe a propósito |
| `scripts/redactar-justificaciones.mjs` | Arma el documento de revisión, con la pregunta y sus cuatro alternativas al lado de cada justificación. Al regenerar **conserva las aprobaciones** cuya pregunta y justificación no cambiaron, y devuelve a cero las demás |
| `scripts/aplicar-justificaciones.mjs` | Lee las marcas del documento y arma el encargo de carga: lo aprobado en `activa` con su texto, lo demás en `borrador`. Se niega si el documento y el encargo dejaron de coincidir |

**Son dos encargos, y es a propósito:**

| Archivo | Qué es |
|---|---|
| `d1/encargos/modulo-0N.json` | La conversión pura, entera en `borrador`. Es lo que el comprobador contrasta contra los orígenes |
| `d1/encargos/modulo-0N-para-cargar.json` | El derivado que se carga. Se puede borrar y volver a producir |

Si se escribiera encima del primero, **el rastro de que la conversión fue fiel se perdería en el mismo acto de completarla**.

> **El comprobador tuvo su propio punto ciego, y apareció al usarlo.** La primera
> versión filtraba las retiradas con `r.modulo === modulo`, y en `retiradas.json`
> el banco nuevo escribe `2` mientras el viejo escribe `"Módulo 2"`. Informaba
> «ninguna colada» **habiendo mirado 1 de las 3** retiradas del módulo. Corregido
> normalizando el número, informando las retiradas por banco —`1 json_2026 +
> 2 js_2026`, donde un desbalance se ve— y añadiendo la comprobación fuerte: cada
> hueco de numeración de `modulo-0N.json` tiene que corresponder a una retirada, y
> ningún retirado puede seguir presente. Es el mismo patrón que H-022: una
> comprobación que mira menos de lo que dice y que por eso siempre pasa.

> **`numero_origen` del banco viejo es una posición, y eso obliga a congelar el
> archivo.** Anotado el 2026-09-09, antes de convertir.
>
> El banco nuevo trae `numero`, que es un identificador estable y por eso no se
> renumeró. **El banco viejo no trae ninguno**: lo único que distingue una pregunta
> de otra dentro de `static/js/data/cuestionario.js` es su posición en la lista.
>
> Este proyecto ya demostró que esa posición se mueve: la pregunta con `fijo` pasó
> de la posición 13 a la 11 cuando los retiros por solapamiento corrieron el índice.
> Usarla como `numero_origen` es guardar como identificador justo lo que el propio
> archivo dice que no sirve de identificador.
>
> **Se acepta porque no hay alternativa y porque deja de importar en cuanto se
> carga:** al cargar, el número queda congelado en D1, y el archivo se retira al
> final de esta iteración, así que nunca más va a poder moverse. Lo que queda
> grabado es «la posición que tenía el 2026-09-09».
>
> **La condición que esto impone, y es dura:** `static/js/data/cuestionario.js`
> **no se edita entre hoy y la carga.** Cualquier retoque —corregir una tilde,
> reordenar— desplaza posiciones ya escritas en el encargo y rompe la
> correspondencia sin que nada avise. Si hubiera que corregir algo del banco viejo,
> se corrige **en D1 después de cargar**, no en el archivo.

### Carga

- [ ] Cargar en producción con la herramienta de la iteración 23, por lotes.
- [ ] Comprobar que lo cargado coincide con los dos orígenes: ninguna pregunta
  perdida, ninguna correcta desplazada, ninguna duplicada por cargar un origen
  dos veces.
- [ ] Informar cuántas preguntas quedan sin justificación, agrupadas por módulo.
- [ ] Informar la distribución de la posición de la correcta por módulo (H-004).

**La herramienta que cierra estos criterios, escrita el 2026-09-09:**

| Guion | Qué hace |
|---|---|
| `scripts/comprobar-carga.mjs` | Contrasta **lo que quedó en D1** contra los dos bancos de origen, pregunta a pregunta. Ancla en el texto de la correcta. `--sabotaje=` lo rompe a propósito, con diez sabotajes |

**No es el mismo trabajo que `comprobar-conversion.mjs`, y por eso son dos guiones.**
Aquel contrasta el **encargo** contra los archivos de origen: comprueba que el
convertidor no perdió nada. Este contrasta **la base** contra los mismos archivos:
comprueba que lo cargado es lo que se quiso cargar. Entre uno y otro hay una
herramienta, un wrangler, dos caminos de escritura y una red — y H-024 demostró
que ese tramo puede mentir.

**El encargo no se lee. Ni una vez.** A propósito: si este guion leyera el encargo
comprobaría que la base coincide con el archivo intermedio, que es justo el eslabón
que ya tiene su propio comprobador. Los dos extremos que importan son **los archivos
de origen** y **la base**, y en medio no se mira nada. Consecuencia buscada: si el
encargo estuviera mal y la carga fuera fiel al encargo, este guion dice «no» igual.

**Qué informa de una sola corrida**, que es lo que cierra cinco de los siete
criterios de nivel 1: conteo por origen contra los dos archivos, cotejo de la huella
pregunta a pregunta —enunciado, los cuatro textos en su orden y el texto de la
correcta, sin normalizar nada—, `justificacion IS NULL` y `dificultad IS NULL`
sobre la base, activas sin justificación o con justificación de relleno, retiradas
coladas, `orden_fijo` contra el `fijo` del banco viejo, y el reparto de la posición
de la correcta (H-004).

> ### Los diez sabotajes, y por qué uno de ellos no bastaba
>
> Cada sabotaje **nombra la comprobación que exige ver saltar**, y no le vale que
> salte cualquiera. Un sabotaje dispara varias a la vez —colar una retirada también
> la vuelve sobrante— y conformarse con «hubo problemas» deja aprobada una
> comprobación que nunca se ejercitó, escondida detrás de una vecina que sí funciona.
> Es la trampa de H-023 un piso más arriba: lo que siempre pasa sería el propio
> sabotaje.
>
> Comprobado el 2026-09-09 que el requisito estricto **puede fallar**: cambiándole a
> un sabotaje el texto exigido por uno imposible, el veredicto pasa a `SABOTAJE NO
> CAZADO` con código 1, teniendo el problema real delante.

> ### Lo que los sabotajes destaparon, que era el punto de escribirlos
>
> **H-027, y es de los graves.** La comprobación de retiradas **no miraba nada**:
> leía `r.enunciado ?? r.q` sobre la entrada de `retiradas.json`, donde el texto no
> está —vive anidado en `r.pregunta`—, así que obtenía `undefined` siempre e
> informaba «ninguna en la base» pasara lo que pasara. Es la **cuarta vez** de este
> patrón en el proyecto, y la primera en que la regla de H-023 lo destapa en vez de
> sólo describirlo: el sabotaje reventó con `TypeError` sobre ese mismo `undefined`.
>
> **Y su reverso.** El detector de justificaciones de relleno marcó **ocho
> justificaciones legítimas** del módulo 2, porque con la bandera `i` el patrón
> `TODO` cazaba la palabra española «todo». Una comprobación que nunca puede decir
> «no» y una que dice «no» con material bueno son el mismo error.
>
> **H-028**, de paso: `administrar-banco.mjs insertar` estaba **roto en el árbol**
> —`abrirRegistro is not defined`, el arreglo de H-026 sin su `import`—. La
> herramienta con la que se cargan los seis módulos que faltan no funcionaba, y se
> habría descubierto en medio de la carga del módulo 3.

**Lo probado el 2026-09-09, contra la base local y no contra producción.** Se vació
la base local, se cargaron las 52 del módulo 2 con `administrar-banco.mjs insertar`,
se corrió el comprobador —`CARGA COMPROBADA`, código 0—, se corrieron los diez
sabotajes —los diez cazados por la comprobación que corresponde—, se provocaron los
cuatro rechazos (sin `--base`, base no declarada, módulo fuera de rango, sabotaje
inexistente) y el de la barrera de ADR-015, y **se devolvió la base local a como
estaba**. La corrida contra producción la hace el autor.

### Para cerrar el módulo 2 · lo que corre el autor

*Escrito el 2026-09-09. Los cinco pasos van en este orden y el orden importa: el
retiro del banco viejo ocurre **después** de que la evidencia del paso 1 esté
escrita, nunca antes (decisión del orden fijo).*

Todos estos comandos hablan con la cuenta de Cloudflare, así que **los ejecuta
Felipe Cuevas en su terminal** (ADR-015). Claude Code los escribe y trabaja con la
salida.

**1. Producir la evidencia de los criterios de nivel 1.** Una sola corrida los
cierra del primero al quinto, más la marca de orden fijo de nivel 2.

```powershell
$env:PERMITIR_REMOTO=1
node scripts/comprobar-carga.mjs 2 --base=examen-td-js-produccion --remote --registro=evidencia-modulo-02.txt
```

Antes de que consulte nada, el guion **coteja el uuid** que anuncia wrangler contra
el de `wrangler.toml`: producción es `cff1686b-3b24-4892-9a10-4306684e0127`. Si no
calzan, no lee (H-015).

Lo que tiene que decir, y si dice otra cosa **no se sigue**:

```
CARGA COMPROBADA  ***  la base corresponde a los dos origenes  ***
  json_2026   base  39   origen  39   calzan
  js_2026     base  13   origen  13   calzan
  justificacion IS NULL   0
  dificultad IS NULL     52   de 52
  orden_fijo = 1   id <n>   «¿Qué comando de Git permite crear una nueva rama…»
  Testigo: .\static\js\data\cuestionario.js SIGUE en el arbol
codigo de salida: 0
```

El archivo `evidencia-modulo-02.txt` es lo que se pega en este documento. **Si le
falta la línea `# fin del registro`, está truncado** y no vale como evidencia.

> **De paso, esto cierra H-026.** Es la primera corrida con `--registro` desde el
> terminal donde apareció `stdout is not a tty`. Si el archivo trae su cabecera y su
> línea de cierre, la propiedad que faltaba comprobar deja de ser razonamiento.

**2. El paso único de ADR-023: respaldo e instantánea, o ninguno de los dos.**

```powershell
$env:PERMITIR_REMOTO=1
npm run datos:publicar -- --base=examen-td-js-produccion --remote --registro=publicacion-modulo-02.txt
```

*Escrito el 2026-09-09, y es nuevo.* Hasta hoy esto eran **dos comandos sueltos** con
un recordatorio impreso entre medio, y ADR-023 dice literalmente «un solo paso produce
las dos cosas, o no produce ninguna». Ahora lo es de verdad: las dos mitades se
preparan aparte y **sólo se instalan si las dos salieron bien**. Si algo falla, los dos
archivos quedan exactamente como estaban, y el guion lo demuestra con sus huellas en
vez de prometerlo.

Antes de instalar nada comprueba tres cosas que ningún comando anterior comprobaba:

- **Que el respaldo tenga banco dentro** — la tabla `pregunta`, la `alternativa` y al
  menos una fila. Es la comprobación que faltaba, y la que habría cazado que
  `d1/respaldo-banco.sql` llevara desde el 2026-09-03 conteniendo `prueba_tuberia` y
  ninguna pregunta.
- **Que el sello diga `nube`.** Si dijera `local`, no instala nada. Es tu condición y
  está puesta como condición, no como aviso.
- **Que las dos mitades cuadren.** El respaldo trae N preguntas de todos los estados y
  la instantánea publica M activas: si M > N, salieron de momentos distintos y se
  rechaza.

Lo que tiene que decir:

```
PUBLICADO  ***  los dos archivos, del mismo acto  ***
Sello      entorno «nube» · generada <fecha>
  d1/respaldo-banco.sql                  <tamaño>   52 preguntas
  static/js/data/instantanea-banco.js    <tamaño>   52 activas
El sello dice «nube», asi que esta instantanea SI se publica.
codigo de salida: 0
```

> **Si dice `NO SE PUBLICO`, no hay nada que limpiar.** El guion informa las huellas de
> los dos archivos antes y después: si son iguales, no se tocó nada y se puede volver a
> intentar sin más. Si alguna cambió, eso sale rotulado como **fallo del guion**, y
> entonces sí hay que mirar qué quedó a medias antes de reintentar.

**3. Verificar y medir.**

```powershell
npm run datos:verificar-banco
npm run verificar
Get-Item static/js/data/instantanea-banco.js | Select-Object Length
```

Las dos primeras terminan en verde; la tercera da el peso de la instantánea con 52
preguntas dentro, que es el dato con el que se proyecta cuánto pesará con 368.

**4. Publicar.** `git push` a `main` dispara la construcción, así que **empujar es
publicar**. Los dos archivos generados van en el **mismo commit**: son las dos copias
del mismo estado y separarlas es cómo se desincronizan.

Después de que publique, queda el séptimo criterio de nivel 1: **ver el módulo 2 en
el sitio publicado**, con su contador y sus preguntas.

> **Si el paso 1 dice `NO CORRESPONDE`, no se sigue al 2.** Lo que hay que arreglar
> está en la base, y una instantánea sacada de una base que no corresponde a los
> orígenes propaga el error al archivo versionado, que es donde más caro sale
> descubrirlo. El guion no escribe nada en la base: se puede volver a correr las
> veces que haga falta.

### Evidencia del lote · módulo 2 · 2026-09-09

**Corrida por Felipe Cuevas contra producción**, con `scripts/comprobar-carga.mjs`.
Salida, literal:

```
CARGA COMPROBADA, codigo 0
uuid cff1686b-3b24-4892-9a10-4306684e0127, es produccion
json_2026 39 = 39 · js_2026 13 = 13 · total 52
activas 52 · borradores 0 · retiradas 0
justificacion IS NULL 0 · dificultad IS NULL 52 de 52
las 3 retiradas del modulo, ninguna en la base
orden_fijo = 1 en la id 50, con cuestionario.js todavia en el arbol
H-004: 23% / 40% / 29% / 8%
```

**Qué cierra esta salida, criterio por criterio.** No es un «listo»: cada línea de
arriba cierra uno, y los dos que no cierra se dicen abajo.

| Criterio de nivel 1 | Qué lo cierra |
|---|---|
| El lote entero está en D1 y suma lo que debe | `json_2026 39 = 39 · js_2026 13 = 13`, **por origen y no por el total**, que es donde se escondería la pérdida de un banco entero |
| Ninguna respuesta correcta se desplazó | el veredicto `CARGA COMPROBADA` sobre las 52, anclado en **el texto** de la correcta, pregunta a pregunta y sin muestreo |
| Ningún campo se inventó | `justificacion IS NULL 0 · dificultad IS NULL 52 de 52` |
| Ninguna `activa` carece de justificación | `activas 52` con `justificacion IS NULL 0`, contado **sobre la base** |
| Las retiradas de ese módulo no se cargaron | `las 3 retiradas del modulo, ninguna en la base` |

**Y del nivel 2, la que caduca:** `orden_fijo = 1 en la id 50, con cuestionario.js
todavia en el arbol`. Esa segunda mitad es la que da valor a la primera. El retiro del
`.js` ocurre después de que esto esté escrito, y ya lo está.

**Los dos que esta salida NO cierra**, y no se marcan:

- ~~La instantánea y el respaldo del mismo acto (ADR-023).~~ **Cerrado el 2026-09-09**, ver abajo.
- ~~El módulo se ve en el sitio publicado.~~ **Cerrado el 2026-09-09**, ver abajo.

> **El uuid es parte de la evidencia, no un adorno.** `cff1686b-3b24-4892-9a10-4306684e0127`
> es producción, cotejado contra `wrangler.toml` **antes** de leer nada. Sin esa línea, la
> salida diría que algo cuadra sin decir dónde: contra la nube el nombre tecleado no
> decide la base, y ese es H-015 entero.

#### Lo que dice el reparto de la correcta, y lo que todavía no

`H-004: 23% / 40% / 29% / 8%` sobre las 52 del lote.

**La posición 2 concentra el doble que la 4** —40% contra 8%, cinco veces en realidad—,
y con un reparto parejo cada una tendría 25%. Es un sesgo visible a simple vista.

**Lo que no se puede decir todavía, y por eso queda anotado en vez de concluido:** con
un solo módulo no hay forma de distinguir un **sesgo del material** de una **casualidad
de estas 52**. Un lote de 52 admite desviaciones así por azar sin que nada esté torcido.

**Con los siete módulos se va a poder ver.** Si el patrón se repite lote tras lote, es
del material y se sabrá con qué fuerza; si baila, eran estas 52. Por eso el reparto se
informa en **cada** módulo y no sólo al final: la serie es el dato, no el promedio.

**Lo que no cambia en ningún caso:** H-004 se informa y no se corrige. El barajado lo
neutraliza en pantalla, y reordenar las alternativas del banco para cuadrar un
histograma sería falsear el material de origen.

### El lote del módulo 2 quedó cerrado · 2026-09-09 · commit `b64f1b3`

**Los siete criterios de nivel 1, con evidencia.** Los cinco primeros los cerró la
corrida de `comprobar-carga.mjs` contra producción, más arriba. Los dos que faltaban
los cerró Felipe Cuevas mirando el sitio publicado y el repositorio:

**En el sitio publicado**, comprobados los cinco puntos:

- 52 preguntas reales del módulo 2.
- La insignia diciendo **52 preguntas · 1 módulo** — el contador que la iteración 24
  arregló, ahora con banco real y no con las 8 de juguete.
- ~~La justificación apareciendo al responder.~~ **Retirado el 2026-09-10: esto no
  se pudo comprobar porque no existe.** Mostrar la justificación al responder es
  trabajo de la épica 30, iteración 33, y el registro ya lo tenía como pendiente
  cuando se escribió esta lista. El punto estaba mal puesto, no mal mirado.
- **La pregunta del comando de Git sin barajar sus alternativas.** El `orden_fijo` que
  se rescató del banco viejo no sólo llegó a D1: se está honrando en pantalla.
- **Ningún aviso de respaldo**, o sea que el sitio está leyendo la capa de datos y no
  la instantánea.

**En el repositorio:**

| | |
|---|---|
| Sello de la instantánea | `"entorno": "nube"`, 52 preguntas |
| `d1/respaldo-banco.sql` | 68 kB, **52 `INSERT INTO pregunta`** |

> **ADR-023 y ADR-014 dejan de estar incumplidas.** El incumplimiento consciente que se
> declaró el 2026-09-08 —la instantánea publicada salía de la base local, o sea del
> banco de juguete— queda subsanado aquí, que es el único sitio donde podía subsanarse.
> Y el respaldo pasa a tener banco dentro por primera vez desde que el banco existe:
> hasta el 2026-09-09 el archivo versionado contenía `prueba_tuberia` (H-030).

### Lo que costó el primer lote

*Escrito al cerrarlo, porque es el dato que importa para los seis que vienen y porque
dentro de un mes nadie se va a acordar.*

52 preguntas cargadas. Eso fue lo de menos. Lo que el lote produjo de verdad:

| | |
|---|---|
| Hallazgos nuevos | **H-024, H-025, H-027, H-028, H-029** — y además **H-026** y **H-030**, que salieron del mismo lote |
| Patrón generalizado | **H-023**, que reunió tres comprobaciones que no podían decir «no» y dejó la regla que destapó casi todo lo demás |
| Decisiones cerradas | **ADR-026** y **ADR-027** |
| Herramientas escritas | siete guiones, incluida **una de publicación que no existía** |
| Procedimientos | el bloque de **ADR-023 recorrido entero por primera vez** |

**Tres de esos hallazgos eran herramientas rotas que nadie había usado todavía:**
`administrar-banco.mjs` no arrancaba (H-028), la comprobación de retiradas no miraba
nada (H-027), y el respaldo versionado no tenía banco dentro (H-030). **Ninguno se
habría descubierto cargando las 368 de una vez** — se habrían descubierto igual, pero
en medio de la carga grande, que es donde salen caros.

Y el bloque de ADR-023 no sólo se recorrió: **se descubrió que su promesa central no
estaba implementada.** «Un solo paso produce las dos cosas» eran dos comandos sueltos y
un recordatorio impreso. Eso es exactamente lo que un procedimiento no recorrido
esconde, y es la razón por la que se decidió recorrerlo módulo a módulo.

> ### Este costo era el de la primera vez
>
> **No es la estimación del módulo 3.** Casi todo lo que se pagó aquí fue construir lo
> que no existía: los guiones de conversión y comprobación, el paso único de
> publicación, las dos ADR, y el recorrido inicial de un procedimiento que llevaba
> desde la iteración 23 marcado como **NO RECORRIDO**. Nada de eso se vuelve a pagar.
>
> **El módulo 3 es la prueba de si el procedimiento sirve.** Es la primera vez que
> todas las piezas existen antes de empezar, así que mide lo que el módulo 2 no podía
> medir: cuánto cuesta un lote cuando ya hay herramienta.
>
> **El criterio es simple, y conviene dejarlo escrito antes de saber el resultado:
> si el módulo 3 sale sin sorpresas, el procedimiento sirve** y los cuatro que siguen
> son repetición. Si vuelven a aparecer hallazgos del calibre de H-027 o H-028 —una
> comprobación que no comprobaba, una herramienta que no arrancaba—, entonces lo que
> falla no es el material sino el procedimiento, y hay que arreglarlo **antes** de
> repetirlo cuatro veces más.

### Evidencia del lote · módulo 3 · 2026-09-10

**Corrida por Felipe Cuevas contra producción.** Los siete criterios de nivel 1,
cerrados:

| Criterio | Qué lo cierra |
|---|---|
| El lote entero está en D1 y suma lo que debe | la carga entró entera, **52 → 113**, y la comprobación calza **50 `json_2026` + 11 `js_2026` = 61** contra los dos archivos de origen |
| Ninguna respuesta correcta se desplazó | `CARGA COMPROBADA` sobre las 61, anclado en el texto de la correcta, pregunta a pregunta |
| Ningún campo se inventó | `dificultad IS NULL` en las 61 |
| Ninguna `activa` carece de justificación | las 61 activas con su justificación, contadas sobre la base |
| Las retiradas de ese módulo no se cargaron | las **cuatro** retiradas del módulo, ninguna en la base |
| La instantánea y el respaldo salieron del mismo acto | el paso único publicó los dos con sello **`"entorno": "nube"`** y **113 preguntas cada uno** |
| El módulo se ve en el sitio publicado | comprobado tras el despliegue: preguntas visibles, insignia **113 preguntas · 2 módulos**, ningún aviso de respaldo, y `m03#10` diciendo «hacia números». **La justificación al responder no entra en este criterio**: no existe todavía (épica 30, iteración 33) |

**El módulo 3 no tiene `orden_fijo`**: la única pregunta con esa marca en todo el
proyecto está en el módulo 2 y quedó cerrada allí.

> **Este lote fue la primera prueba del procedimiento**, y esa era su razón de ser.
> Lo que apareció no fueron hallazgos del calibre de H-027 o H-028 —una comprobación
> que no comprobaba, una herramienta que no arrancaba— sino **dos cosas de otra
> naturaleza**: una sesión de nube que se enfría (H-019, disparador) y un CSS que
> creció por una palabra escrita dentro de una justificación (H-031). Ninguna de las
> dos puso en riesgo el banco, y las dos se cierran con un paso más en la lista.
>
> **El criterio que se había escrito antes de saber el resultado era: si el módulo 3
> sale sin sorpresas, el procedimiento sirve.** Salió con dos sorpresas menores y
> ninguna del tipo que obliga a rehacer nada. El procedimiento sirve, y los cinco que
> quedan van con dos pasos más de los que tenía el módulo 2: el 0 y la tercera fila
> del 10.

#### H-004 · segundo dato de la serie

| Lote | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|
| Módulo 2 · 52 preguntas | 23% | **40%** | 29% | 8% |
| Módulo 3 · 61 preguntas | 16% | **39%** | 30% | 15% |

**Dos lotes independientes con casi el mismo número en la posición 2 empieza a
parecer sesgo del material y no casualidad.** Con un reparto parejo cada posición
tendría 25%; la segunda concentra cerca del 40% en los dos, y son bancos escritos por
manos distintas en momentos distintos.

**Todavía no se afirma.** Dos puntos hacen una recta y cualquier par de puntos la
hace: **faltan cinco módulos**. Lo que sí cambió es la expectativa — hasta el módulo 2
lo razonable era suponer casualidad; desde el 3 lo razonable es suponer sesgo y
esperar que los siguientes lo desmientan.

**Y no cambia qué se hace con él.** H-004 se informa y no se corrige: el barajado lo
neutraliza en pantalla, y reordenar las alternativas del banco para cuadrar un
histograma sería falsear el material de origen. Lo que la serie va a permitir, si el
patrón se sostiene, es **decirlo** — que un banco de práctica advierta que su material
de origen tiene sesgo de posición es información útil para quien estudia con él.

### Evidencia del lote · módulo 4 · 2026-09-10

**Corrida por Felipe Cuevas contra producción.** Seis de los siete criterios de nivel 1
cerrados; el séptimo espera el despliegue.

| Criterio | Qué lo cierra |
|---|---|
| El lote entero está en D1 y suma lo que debe | la carga entró entera, **113 → 174**, y la comprobación calza **46 `json_2026` + 15 `js_2026` = 61** contra los dos archivos |
| Ninguna respuesta correcta se desplazó | `CARGA COMPROBADA` sobre las 61, anclado en el texto de la correcta, pregunta a pregunta |
| Ningún campo se inventó | `dificultad IS NULL` en las 61 |
| Ninguna `activa` carece de justificación | 61 activas, `justificacion IS NULL 0` |
| Las retiradas de ese módulo no se cargaron | las **4** del módulo —`4 json_2026 + 0 js_2026`— ninguna en la base |
| La instantánea y el respaldo salieron del mismo acto | sello **`"entorno": "nube"`**, **174 preguntas** en los dos, huellas informadas antes y después |
| El módulo se ve en el sitio publicado | **cerrado el 2026-09-10** con el arreglo de H-031 empujado: `bc55513` construyó sin errores —«17 recursos enlazados, ninguno roto»— y `Success: Your site was deployed!` |

**El reparto de retiradas quedó a la vista, y por eso se informa por banco:** `4 + 0`,
el inverso exacto del módulo 3, que fue `0 + 4`. Es lo que la corrección de H-023 vino
a permitir — un desbalance así, en el total, no se vería.

**Sin `orden_fijo`**, como corresponde: la única marca del proyecto sigue siendo la del
módulo 2.

> **Resuelto el 2026-09-10.** Empujado el arreglo, la construcción de Cloudflare pasó
> limpia sobre el commit `bc55513` y el sitio se desplegó. **Y el propio registro del
> despliegue corrobora que la instantánea nueva llegó:** «Uploaded 2 files (54 already
> uploaded)» — exactamente los dos artefactos generados que habían cambiado, la
> instantánea y `style.css`. El respaldo no aparece porque no se publica: no está en
> `LISTA_COPIA`, y ahí no debe estar.
>
> Lo que ese registro **no** prueba por sí solo es lo que se ve en pantalla —la
> insignia diciendo 174 y 4 módulos, y que no aparezca el aviso de respaldo—. Eso
> depende de la capa de datos, que ya está comprobada aparte con las 174 en D1.
> **El despliegue falló, y no por la carga.** El banco estaba bien cargado y bien
> publicado; lo que se rompió fue la **construcción del sitio**, porque una
> justificación de este lote —`m04#19`, sobre importar un módulo por defecto— contenía
> `import Modulo from './archivo.js'` y el verificador de enlaces la tomó por una
> referencia real. Es la **segunda cara de H-031**, y está en la auditoría con su
> arreglo, sus provocaciones y un tercer camino que se buscó a propósito.
>
> **Conviene que quede separado:** el banco en producción y los dos archivos generados
> estaban correctos desde el primer intento. Lo que faltaba era que el sitio pudiera
> construirse con ese banco dentro.

#### H-004 · tercer dato, medido

| Lote | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|
| Módulo 2 · 52 | 23% | **40%** | 29% | 8% |
| Módulo 3 · 61 | 16% | **39%** | 30% | 15% |
| Módulo 4 · 61 | 18% | **38%** | 34% | 10% |

**40, 39, 38.** Tres lotes independientes, de dos bancos escritos por manos distintas y
en momentos distintos, y la posición 2 clavada cerca del **40 %** contra el 25 % de un
reparto parejo. La posición 4 es su espejo: 8, 15 y 10, siempre la más baja.

**Ya cuesta llamarlo casualidad.** Faltan cuatro módulos y la expectativa quedó
invertida: hoy lo razonable es suponer sesgo del material y esperar que los que vienen
lo confirmen, no lo contrario.

**Estos tres números están medidos en producción**, no calculados sobre el encargo. La
distinción importa para una serie que se va a citar después.

### Evidencia del lote · módulo 5 · 2026-09-10

**Corrida por Felipe Cuevas contra producción.** Los siete criterios de nivel 1,
cerrados.

| Criterio | Qué lo cierra |
|---|---|
| El lote entero está en D1 y suma lo que debe | **174 → 223**, y **38 `json_2026` + 11 `js_2026` = 49** contra los dos archivos |
| Ninguna respuesta correcta se desplazó | `CARGA COMPROBADA` sobre las 49, anclado en el texto de la correcta |
| Ningún campo se inventó | `dificultad IS NULL` en las 49 |
| Ninguna `activa` carece de justificación | 49 activas, `justificacion IS NULL 0` |
| Las retiradas de ese módulo no se cargaron | las **6** —`2 json_2026 + 4 js_2026`— ninguna en la base |
| La instantánea y el respaldo salieron del mismo acto | sello **`"entorno": "nube"`**, **223 preguntas** en los dos |
| El módulo se ve en el sitio publicado | publicado por el autor |

**Primer lote con retiradas repartidas en los dos bancos** —`2 + 4`—, después del `0+4`
del módulo 3 y el `4+0` del 4. El informe por banco existe justamente para que eso se
vea.

**La corrección de `m05#18` llegó hasta el final:** la alternativa (c) dice
`CHECKPOINT`, y `correcciones registradas 1` quedó contrastado contra el archivo de
origen en la recomprobación.

#### El peso de la instantánea, que es un criterio de nivel 2

| | |
|---|---|
| Hoy, con 223 preguntas | **297 kB** |
| Proyectado con las 368 | **~489 kB** |

Es el dato que el criterio «el sitio aguanta el banco completo» pedía medir en vez de
suponer. Medio mega es mucho para un archivo que el navegador solo carga **cuando la
capa de datos cae**, y conviene decidir antes del módulo 8 si se acepta, se comprime o
se recorta. **No es urgente y no se resuelve aquí**, pero ya no es una incógnita.

#### H-004 · cuarto dato, y el más extremo

| Lote | pos. 1 | **pos. 2** | pos. 3 | pos. 4 |
|---|---|---|---|---|
| Módulo 2 · 52 | 23% | **40%** | 29% | 8% |
| Módulo 3 · 61 | 16% | **39%** | 30% | 15% |
| Módulo 4 · 61 | 18% | **38%** | 34% | 10% |
| Módulo 5 · 49 | 12% | **49%** | 35% | 4% |

**Cuatro lotes, y la posición 2 nunca baja del 38 %.** En éste llega al **49 %**: una de
cada dos preguntas tiene su respuesta correcta en el segundo lugar. La posición 4 cae al
**4 %** — dos preguntas de 49.

**Con cuatro lotes ya no es razonable llamarlo casualidad.** Faltan tres módulos y lo
que queda por ver no es si hay sesgo, sino cuánto y si es parejo entre bancos.

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

*Reescritos en dos niveles el 2026-09-09, al decidir que los siete módulos van en
esta iteración. **Un criterio que dice «las 368» y se mira siete veces no se cierra
siete veces:** se cierra una, al final. Mezclar los dos niveles en una sola lista es
lo que hace que una iteración larga termine dando módulos por hechos.*

### Nivel 1 · Por lote · se cierran módulo a módulo, con su evidencia

Cada módulo repite estos siete. La evidencia se produce provocando, y se anota en la
tabla de avance.

- [x] **El lote entero está en D1 y suma lo que debe.** Conteo por origen contra los
  dos archivos: `json_2026` y `js_2026` por separado, porque un error que pierda un
  banco completo se esconde en el total.
- [x] **Ninguna respuesta correcta se desplazó**, comprobado **anclando en el texto
  de la alternativa correcta** y no en su letra ni en su índice. Para cada pregunta:
  el texto que el origen marca como correcto es el texto que en D1 tiene
  `es_correcta = 1`. Pregunta a pregunta, no por muestreo.

  > **Este criterio reemplaza al anterior, no lo complementa.** Decía: «se muestra
  > explícitamente que el índice 0 quedó como letra `a`». Eso verifica la **regla de
  > conversión** sobre un ejemplo, y un convertidor y su comprobador escritos por la
  > misma mano comparten el mismo punto ciego: si el mapeo está mal en los dos, la
  > comprobación lo confirma en vez de delatarlo. **El texto de la correcta es lo
  > único que la regla de conversión no puede falsear.** Dejar los dos criterios
  > daría a entender que el débil aporta algo.
- [x] **Ningún campo se inventó.** Ninguna pregunta del lote trae justificación de
  relleno, y `dificultad` es `NULL` en todas. Se muestra el conteo de
  `justificacion IS NULL` y de `dificultad IS NULL` sobre el lote.
- [x] **Ninguna pregunta `activa` carece de justificación**, comprobado contra la
  base y no contra el encargo. Lo no revisado quedó en `borrador`.
- [x] **Las retiradas de ese módulo no se cargaron**, comprobado contra
  `retiradas.json`.
- [x] **La instantánea y el respaldo salieron del mismo acto**, con sello
  `"entorno": "nube"`, y van en el mismo commit. Es el bloque de ADR-023, entero.
- [x] **El módulo se ve en el sitio publicado**, con su contador y sus preguntas.

### Nivel 2 · Agregado final · sólo lo cierra el último módulo

- [ ] **Las 368 están en D1 y suman lo que deben sumar.** Conteo por módulo y por
  origen contra los dos bancos, sin diferencias.
- [ ] **Las 37 retiradas no se cargaron**, comprobado contra `retiradas.json` entero.
- [x] **La marca de orden fijo sobrevivió.** La pregunta del comando de Git tiene
  `orden_fijo = 1` en D1, mostrado **con `static/js/data/cuestionario.js` todavía en
  el árbol**. Se cierra en el lote del módulo 2 y tiene que **seguir cierto** al
  final; el retiro del `.js` ocurre después de esta evidencia y no antes.
- [ ] **El sitio aguanta el banco completo.** Se mide el peso de la instantánea y se
  comprueba `cuestionario.html` sin degradación perceptible, también en teléfono.
- [ ] **El contador de la portada dice la verdad** con el banco real cargado. La
  iteración 24 lo arregló y lo comprobó con 8; aquí se comprueba con 368.
- [ ] **`npm run verificar` termina en 0** con sus comprobaciones en OK.

### Nivel 0 · Del comprobador, antes de confiar en él

- [x] **El comprobador dijo «no» en los cinco sabotajes**: una correcta desplazada
  una posición, una pregunta borrada, un carácter cambiado en un enunciado, dos
  alternativas intercambiadas **que no eran la correcta** —para que sólo pudiera
  cazarlo el cotejo de orden y no el ancla— y una corrección anotada en el registro
  que nunca se aplicó al banco. **Un comprobador que nunca ha dicho «no» no es un
  comprobador**, y este es el que sostiene todos los criterios de nivel 1.

## Lo que esta iteración no puede afirmar

- **Que el banco no tenga duplicados** — y desde el 2026-09-09, **eso ya no es una
  limitación.** Ver la decisión de abajo: un par que pregunta el mismo hecho con dos
  redacciones distintas es **fidelidad al examen**, no un defecto. Los 82 pares
  candidatos salieron de parecido de redacción y no de entender el contenido, así que
  hay duplicados que nadie ha visto. **368 no significa «sin duplicados», y ya no
  pretende significarlo.**
- **Que las justificaciones sean correctas.** Que existan y que sean ciertas son dos
  cosas distintas, y sólo la primera se puede comprobar con un programa.
- **Que el sesgo de posición esté corregido.** H-004 se informa, no se arregla: el
  barajado lo neutraliza en pantalla.

## Los duplicados por redacción distinta son esperados, y a veces deseables

**Decidido por Felipe Cuevas el 2026-09-09**, a raíz de un par concreto encontrado al
revisar el primer lote:

| | Pregunta | Respuesta |
|---|---|---|
| `m02#18` | «¿Cuántas fracciones equitativas articulan como límite la arquitectura del grid de Bootstrap?» | 12 columnas |
| `M2-4` | «¿En cuántas columnas iguales se divide por defecto una fila?» | En 12 columnas flexibles |

Mismo hecho, misma respuesta, redacción distinta. Sobrevivieron a los retiros del
2026-09-04 justamente porque el detector medía parecido de redacción.

**Las dos se cargan.** **Motivo, y cambia un supuesto del proyecto entero:** los
alumnos que rindieron la certificación de Talento Digital dan testimonio de que **el
examen real repite el mismo hecho con redacciones distintas**. Un par así no es un
defecto del banco: es que el banco se parece al examen para el que prepara. Un banco
depurado de repeticiones sería un banco menos fiel.

**Lo que esto invalida.** Hasta hoy, «368 no significa sin duplicados» estaba escrito
como una **limitación que alguien debería cerrar algún día**. Ya no lo es: pasa a ser
una **característica declarada**. El párrafo de arriba se reescribió por eso, y no por
matizarlo.

> ### Deuda abierta · los 37 retiros se decidieron bajo el supuesto contrario
>
> **Anotada el 2026-09-09. No se resuelve ahora.**
>
> Los 37 retiros del 2026-09-04 —23 pares con razón concreta, el cuarteto de
> atomicidad y 11 empates— se aprobaron dando por sentado que **un duplicado es un
> defecto**. Ese supuesto acaba de cambiar.
>
> **Alguno de esos 37 podría haber sido un duplicado legítimo**, retirado por una
> razón que hoy no lo justificaría. Los 11 empates son los más sospechosos: se
> resolvieron «por consistencia de formato» entre dos preguntas de calidad
> equivalente, que es exactamente el caso en que hoy se conservarían las dos.
>
> **No se revisa en esta iteración, y eso es deliberado:** reabrir 37 decisiones
> editoriales a mitad de una carga por lotes mezcla dos trabajos distintos y pone en
> riesgo el que está en curso. Nada se perdió: `retiradas.json` las tiene íntegras,
> con su par y su razón, que es para lo que se conservó.

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

## Ensayo del camino de importación

### Resultado · 2026-09-09 · la importación de D1 es atómica

Corrido por el autor contra `examen-td-js-pruebas`, sobre una base que ya tenía 10
preguntas y 40 alternativas. Salida literal:

```
01-antes    fb6908910e0ac450   10 preguntas · 40 alternativas
carga       NO SE APLICO · UNIQUE constraint failed: pregunta.enunciado
            revento en la 256 de 260, con 255 sentencias ya emitidas
02-despues  fb6908910e0ac450
diff        >>> IDENTICAS · cero lineas
03-final    fb6908910e0ac450 · >>> DEVUELTA A COMO ESTABA
```

**255 sentencias emitidas antes del choque, y ninguna sobrevivió.** No hubo que limpiar
nada porque no entró nada. No hizo falta sembrar.

Con esto **el todo o nada queda comprobado por los dos caminos**, y las seis cargas que
quedan van con eso sabido en vez de supuesto. El detalle completo —incluidas las dos
incógnitas que se resolvieron de paso y qué cambia en los criterios de la iteración 23—
está en el bloque «Resultado» de H-025, en `00_producto/auditoria_tecnica.md`.

Dos cosas salieron del ensayo y no estaban previstas:

- **H-026**, que es un hallazgo con arreglo: la salida de una carga no se podía guardar en
  un archivo. Resuelto con `--registro=<archivo>`. Las seis cargas lo usan.
- **El defecto de H-019 en `administrar-banco.mjs` no se manifestó**, y queda anotado como
  **no observado, no como inexistente**. Nadie lo provocó.

**Por qué existe esta sección.** H-024 destapó que wrangler tiene dos caminos de
escritura. La actualización de ese mismo hallazgo corrigió cuál es el eje que los separa:
no es el tamaño del lote, es **el destino**. Contra la base local siempre es `db.batch()`;
contra la nube siempre es la importación, aunque el lote sea de una pregunta. De ahí sale
H-025: los criterios de la iteración 23 que dependen de wrangler se cerraron sobre el
camino local, y las seis cargas que quedan van por el otro.

**Qué se comprobó el 2026-09-09 y qué no.** Lo comprobable en local está en la tabla de
H-025: la atomicidad aguanta 312 sentencias con el fallo puesto en la sentencia 256, y
también en la forma peligrosa de `actualizar`, que borra alternativas antes de
reinsertarlas. Lo que no se puede comprobar desde aquí es el camino de importación, y no
por falta de ganas: **la base local no lo toma nunca.**

**Qué falta, entonces.** Hacer que la importación falle a media carga y mirar el
contenido de la base, no el mensaje de la herramienta.

### El ensayo, para el terminal del autor

**El procedimiento completo, comando a comando y con la salida esperada de cada paso, está
en `90-manual/ensayo-del-camino-de-importacion.md`.** Lo de abajo es el resumen de por qué
tiene la forma que tiene; para correrlo, se usa el manual.

Lo corre el autor: Claude Code no ejecuta wrangler contra la cuenta (ADR-015). Va contra
la base de **pruebas**, `examen-td-js-pruebas`, nunca contra producción. Toma unos veinte
minutos.

Sus dos instrumentos se escribieron y se probaron el 2026-09-09 contra la base local,
haciéndolos fallar antes de creerles, por la regla de H-023:

- `scripts/volcar-contenido.mjs` vuelca el contenido a un archivo comparable. Exige
  `--base` sin valor por omisión, y **coteja el uuid contra `wrangler.toml` antes de
  leer**, en una consulta aparte y sin `--json`, que es la única forma de que wrangler
  imprima esa línea. Provocados sus cuatro rechazos.
- `scripts/armar-lote-de-ensayo.mjs` arma el encargo con la mala **al final** y se niega
  si la base no tiene preguntas contra las que chocar o le falta el módulo del lote.

**Antes de empezar**, la base de pruebas tiene que tener esquema —las dos migraciones— y
al menos un puñado de preguntas dentro, porque parte de lo que se comprueba es que el
contenido que ya estaba **no se toca**. Una base vacía no sirve para eso.

1. **Volcado de contenido, antes.** Consultar las trece columnas de `pregunta` y las seis
   de `alternativa`, ordenadas por id, y guardar la salida en un archivo. No basta con
   `COUNT(*)`: un lote a medias puede dejar el mismo número de preguntas y alternativas
   distintas.
2. **Preparar un encargo grande con una mala al final.** Cuarenta o más preguntas, todas
   válidas menos la última, cuyo enunciado se copia **palabra por palabra** de una que ya
   esté en la base de pruebas. Así el choque contra `UNIQUE (enunciado)` cae en la
   penúltima sentencia del archivo, con todo el lote ya emitido delante.
3. **Lanzar la carga** con la herramienta, contra pruebas y con el permiso de ADR-015
   puesto. Guardar la salida completa.
4. **Volcado de contenido, después**, exactamente igual que el del paso 1.
5. **Comparar los dos archivos.** Es esto lo que decide, y sólo esto.

**Qué se aprende de cada resultado.**

| Lo que dice la comparación | Qué significa |
|---|---|
| Los dos volcados idénticos | La importación es atómica. La atomicidad queda comprobada **por los dos caminos**, y las seis cargas van sin red pero con respaldo |
| Aparecen filas del lote | La importación **no** es atómica. Cambia la forma de cargar: hay que partir los lotes o preparar un deshacer antes de cada carga |

**Qué mirar además, de paso, porque también depende del camino.** Si el mensaje de error
que devuelve la importación trae o no el texto `UNIQUE constraint failed:
pregunta.enunciado`. Si lo trae, la traducción de la herramienta funciona igual en los
dos caminos. Si no lo trae, la herramienta va a responder «no supo traducir el motivo» y
mostrar el crudo —que es honesto, pero es peor—, y la tabla de traducciones necesita una
entrada más.

**Lo que este ensayo no cubre, dicho para que no se confunda:** se hace contra pruebas,
que es otra base con el mismo esquema. Si algún día producción y pruebas dejaran de
compartir esquema, el ensayo dejaría de decir nada sobre producción.

## Notas de la iteración

_Pendiente._