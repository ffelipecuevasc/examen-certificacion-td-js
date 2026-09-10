# Auditoría técnica

Registro de hallazgos encontrados mientras se trabaja. Claude Code añade entradas
aquí; no las borra. Un hallazgo resuelto se marca como resuelto, con la iteración
que lo cerró.

**Gravedad:**
- 🔴 **Bloqueante** — impide que el sitio funcione o que se pueda publicar.
- 🟠 **Mayor** — el sitio funciona, pero hay riesgo real de romperlo o daño a la
  experiencia de una parte del público.
- 🟡 **Menor** — deuda técnica, inconsistencia o mejora de mantenibilidad.

**Estado:** ⚪ Abierto · 🔵 En curso · 🟢 Resuelto · ⏸️ Aceptado (se convive con él)

## Formato de una entrada

```
### H-NNN · Título breve
**Gravedad:** 🔴/🟠/🟡 · **Estado:** ⚪ · **Detectado en:** iteración NN · **Fecha:** AAAA-MM-DD
**Síntoma.** Qué se observa.
**Causa.** Por qué ocurre.
**Impacto.** A quién afecta y cuánto.
**Propuesta.** Qué haría falta para cerrarlo.
```

---

## Hallazgos bloqueantes

### H-001 · `src/input.css` estaba excluido del control de versiones
**Gravedad:** 🔴 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-02

**Síntoma.** Al clonar el repositorio, `npm run build` fallaba.
**Causa.** Una regla del `.gitignore` excluía la fuente de Tailwind, invirtiendo el
criterio: se ignoraba el código fuente y se versionaba el resultado.
**Impacto.** Nadie podía recompilar los estilos desde un clon limpio, ni siquiera el
propio autor desde otro equipo.
**Propuesta.** Eliminar la regla. Resuelto.

### H-002 · Los íconos no se mostraban en ningún contexto
**Gravedad:** 🔴 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-02

**Síntoma.** Todos los íconos invisibles salvo el logotipo de JavaScript.
**Causa.** Las máscaras CSS apuntaban a archivos SVG externos, que no se cargan bajo
`file://`. El fallo es silencioso: no hay error en consola.
**Impacto.** La interfaz completa perdía sus señales visuales.
**Propuesta.** Incrustar los SVG como data URI. Ver ADR-004. Resuelto.

## Hallazgos mayores

### H-003 · Texto sin escapar al insertarse con `innerHTML`
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-01

**Síntoma.** Un ejemplo de código que mencionaba `<div>` destruía el diseño de la
tarjeta que lo contenía.
**Causa.** El texto de los datos se insertaba con `innerHTML` sin escapar, y el
navegador interpretaba las etiquetas del ejemplo como marcado real.
**Impacto.** Cualquier contenido futuro que mencione una etiqueta HTML rompe la
página. Es además la puerta de entrada de una inyección si el banco de preguntas
pasa a alimentarse de una fuente externa.
**Propuesta.** Función `esc()` aplicada a todo texto proveniente de datos. Resuelto,
pero **debe reforzarse en la iteración 22**: con el banco en D1, el contenido pasa a
ser de origen externo y el escapado deja de ser una precaución para volverse un
requisito de seguridad. La regla es de doble filo: validar al escribir en la base y
escapar al insertar en el DOM.

**Actualización del 2026-09-05 (iteración 22) · la protección del ícono pasó de
accidental a deliberada, y hay que dejarlo dicho.**

Al probar el escapado contra contenido hostil apareció un caso que el enunciado de este
hallazgo no cubría: el **nombre del ícono del módulo** es el único dato del banco que se
dibuja **dentro de un atributo HTML** (`class="icon i-…"`) y no como texto. Ahí el
carácter peligroso no es `<` sino la comilla doble, porque quien la controle cierra el
atributo y abre otro.

Lo cubre `icon()`, que escapa su argumento. **Pero lo cubría por una decisión tomada en
otra iteración y por otro motivo** —una precaución de presentación, de cuando los datos
venían del propio repositorio—, así que hasta ahora era una protección accidental: nadie
la había puesto ahí pensando en una inyección, y nadie la habría echado de menos al
quitarla.

Desde el 2026-09-05 ya no lo es. El guardián `scripts/probar-escapado.mjs` prueba ese
caso explícitamente, con el ícono envenenado en la base, y falla nombrándolo si el
escapado de `icon()` desaparece. **Queda escrito para que nadie toque `icon()` creyendo
que sólo afecta a la presentación: su escapado es parte de la barrera de seguridad**, y
el sitio de esa advertencia dirigida a personas es `90-manual/escapado-del-banco.md`.

### H-004 · Sesgo en la posición de la respuesta correcta
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-02

**Síntoma.** En el banco de 105 preguntas, 50 respuestas correctas eran la
alternativa B.
**Causa.** Los cuestionarios de origen se redactaron sin controlar la distribución.
**Impacto.** Pedagógico: el estudiante aprende a responder por posición.
**Propuesta.** Barajar en cada carga. Ver ADR-006. Resuelto, aunque la distribución
del banco de origen sigue sesgada y conviene equilibrarla al ampliarlo.

### H-005 · Riesgo de publicar con el CSS compilado desactualizado
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Cerrado en:** iteración 11 · **Fecha:** 2026-09-02

**Síntoma.** Si se agregan clases de Tailwind y no se recompila antes de publicar,
el sitio queda sin esos estilos.
**Causa.** El despliegue publica el repositorio tal cual. Ver ADR-005.
**Impacto.** Un estudiante puede encontrarse el sitio roto sin que el autor lo note.
**Propuesta.** Comprobación que recompile y verifique que no hay diferencias.

**Resolución · iteración 11.** ADR-010 traslada la compilación al despliegue:
Cloudflare Pages ejecuta `npm run build` y publica `dist/`, de modo que el CSS
servido se genera siempre desde la fuente del mismo commit. La causa desaparece —el
despliegue ya no publica el repositorio tal cual— y con ella el síntoma.

Queda un residuo menor y de otra naturaleza: la copia versionada de `static/css/`
puede desfasarse respecto a la fuente. Ya no afecta a lo que ve un estudiante,
porque no es lo que se publica. Se detecta con `npm run verificar`. La tarea de
convertir esa comprobación en automática sigue anotada en `registro_log.md`.

## Hallazgos menores

### H-006 · Atribución de terceros ausente
**Gravedad:** 🟡 · **Estado:** ⚪ Abierto

**Síntoma.** El repositorio no declara la licencia de los íconos ni del logotipo.
**Impacto.** Material Symbols se distribuye bajo Apache 2.0, que exige atribución.
El proyecto es público y educativo: corresponde predicar con el ejemplo.
**Propuesta.** Archivo de créditos y licencia propia del contenido.

### H-007 · El archivo generado de íconos se sirve completo en ambas páginas
**Gravedad:** 🟡 · **Estado:** ⏸️ Aceptado

**Síntoma.** `icons.css` incluye los cuarenta íconos aunque cada página use menos.
**Impacto.** Bajo. Se acepta mientras el volumen sea este; se revisa si crece.


---

## Hallazgos abiertos por la adopción de Workers y D1

### H-008 · Límites de uso del plan gratuito
**Gravedad:** 🟠 · **Estado:** ⚪ Abierto · **Fecha:** 2026-09-02

**Síntoma.** No hay ninguna vigilancia sobre cuánto consumo admite el plan gratuito
de Workers y D1, ni qué ocurre al alcanzarlo.
**Causa.** ADR-007 introduce servicios con cuota; el plan anterior no tenía ninguna.
**Impacto.** Un pico de uso —muy probable la semana previa a una fecha de examen, que
es justo cuando el material más importa— podría dejar el sitio sin datos. El
respaldo de ADR-008 mitiga el efecto, pero no evita el problema.
**Propuesta.** Medir el consumo real en la iteración 53, cachear las respuestas del
Worker y definir por escrito qué hacer si la cuota se agota.

### H-009 · Nueva superficie de escritura
**Gravedad:** 🟠 · **Estado:** ⚪ Abierto · **Fecha:** 2026-09-02

**Síntoma.** El proyecto pasa a tener, por primera vez, un camino capaz de modificar
datos.
**Causa.** El banco de preguntas deja de ser un archivo del repositorio.
**Impacto.** Hasta ahora, lo peor que podía pasarle al sitio era verse mal. Ahora
existe la posibilidad de que su contenido sea alterado por un tercero.
**Propuesta.** ADR-009 prohíbe exponer escritura al público. La iteración 23 define
el mecanismo de administración y la 51 verifica que no quedó ningún extremo abierto.

### H-010 · La comodidad de edición dejó de venir incluida
**Gravedad:** 🟡 · **Estado:** ⚪ Abierto · **Fecha:** 2026-09-02

**Síntoma.** El motivo original para sacar las preguntas del código era poder
corregirlas sin ciclo de desarrollador. Una hoja de cálculo traía esa comodidad de
fábrica; una base de datos no.
**Causa.** Consecuencia directa de ADR-007.
**Impacto.** Si la iteración 23 se salta o se resuelve a medias, el proyecto termina
con un banco que solo puede editarse escribiendo consultas: peor que el punto de
partida.
**Propuesta.** Tratar la iteración 23 como parte indispensable de la épica 20, no
como un extra.

### H-011 · `npm run verificar` falla a la mitad según desde qué terminal se ejecute
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-03

**Síntoma.** Ejecutado desde PowerShell, `npm run verificar` termina con «git no se
reconoce como un comando interno o externo».
**Causa.** El script es `npm run build && git diff --exit-code static/css/`. En el
equipo del autor, git está instalado en `C:\Program Files\Git\cmd\git.exe` pero **no
en el PATH de PowerShell**: solo Git Bash lo tiene. npm lanza los scripts heredando
el entorno del terminal, así que el mismo comando funciona en un terminal y falla en
el otro.
**Impacto.** El fallo es a mitad de camino y por eso engaña: la construcción corre
entera y reescribe `static/css/` **antes** de que reviente el `git diff`. Quien mire
el final ve un error de git; quien mire que el CSS se reconstruyó puede creer que
verificó. Ninguna de las dos lecturas es correcta: la comprobación que da nombre al
script no llegó a ejecutarse nunca. Y el manual de `90-manual/` indica ejecutarlo,
con lo que el procedimiento documentado falla al seguirlo desde PowerShell.
**Hallazgo relacionado.** `npm run cuestionario` invoca `python3`, que en este equipo
resuelve al alias de Microsoft Store: un ejecutable de 0 bytes que devuelve el
código 9009 sin hacer nada. El intérprete real es `python` (Anaconda). Es el mismo
problema con otra herramienta.
**Propuesta.** Convertir `verificar` en un script de Node que localice git por su
cuenta, que nunca haga la mitad del trabajo en silencio y que diga con todas sus
letras cuándo **no pudo** verificar. Arreglar el PATH del equipo es la solución de
fondo, pero el script tiene que ser robusto igual: el proyecto no puede depender de
la configuración de un terminal.

**Resultado · 2026-09-04.** Resuelto. `verificar` pasó a ser `scripts/verificar.mjs`,
que guarda el CSS, construye, compara y solo después busca git —en el PATH y, si no
está, en las ubicaciones habituales derivadas de las variables del sistema—. La
comprobación central ya no depende de git ni del terminal. Termina siempre con un
veredicto explicito: `VERIFICADO` (0), `DESFASADO` (1) o `VERIFICACION PARCIAL` (2),
este último rotulado «ESTO NO ES UN EXITO» y con código de salida distinto de cero.
Los tres se provocaron de verdad antes de darlo por bueno. `npm run cuestionario`
pasó de `python3` a `python`, con el intérprete esperado anotado en la cabecera del
script.

### H-012 · `verificar` da falsa alarma en un clon recien bajado
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-04

**Síntoma.** En un clon limpio, `npm run verificar` responde `DESFASADO` sobre
`static/css/icons.css` aunque nadie haya tocado nada.
**Causa.** `core.autocrlf=true` y el repositorio no tiene `.gitattributes`: al clonar,
los archivos se escriben con CRLF, y el generador produce LF. La comprobación nueva
compara **bytes**, así que ve una diferencia donde solo hay saltos de línea distintos.
Comprobado: normalizando los finales de línea, los dos archivos son idénticos; sin
normalizar difieren en 41 bytes, todos CR.
**Impacto.** Es una regresión del arreglo de H-011. El `git diff` anterior no tenía
este problema porque git normaliza los saltos de línea al comparar; la comprobación
por bytes ganó independencia del terminal y perdió esa normalización. Y el daño de una
falsa alarma es peor que el de un aviso omitido: enseña a desconfiar del único
mecanismo que avisa de verdad cuando el CSS sí está desactualizado.
**Propuesta.** Dos cosas, en este orden. Primero, que `verificar` compare ignorando
los finales de línea: son tres líneas y elimina la falsa alarma sin perder nada, porque
un cambio real de CSS nunca consiste solo en CR. Segundo, añadir el `.gitattributes`
que ya estaba anotado en el registro desde la iteración 11, fijando los generados a
LF: ataca la causa en vez del síntoma.

**Resultado · 2026-09-04.** Resuelto por los dos lados.

*El síntoma:* `scripts/verificar.mjs` compara ignorando los finales de línea. Un
archivo que solo cambia en CR ya no cuenta como desfase; se dice en el veredicto
`VERIFICADO`, con su nota, en vez de callarlo. Comprobado con el caso exacto del
clon: `icons.css` convertido a CRLF, 41 CR, antes daba `DESFASADO` y ahora da
`VERIFICADO` con la nota. Y comprobado también que un cambio real de contenido
sigue dando `DESFASADO`.

*La causa:* `.gitattributes` con `* text=auto eol=lf`. Ensayado en un clon
desechable: tras aplicarlo y refrescar el árbol, `icons.css` pasa de 41 CR a 0, y
regenerarlo produce un archivo idéntico. El clon deja de dar falsa alarma en su
raíz, no solo en el mensaje.

**Corrección a lo que suponiamos.** Se esperaba que hiciera falta un commit de
renormalización masiva. **No hace falta:** el historial ya estaba en LF. Medido
sobre los objetos guardados, no sobre el disco: `icons.css` en el historial tiene 0
bytes CR y 41 LF; en el disco, tras el checkout, 41 CR y 41 LF. `core.autocrlf=true`
venía normalizando al guardar todo este tiempo. Lo que estaba mal no era lo
guardado sino lo que el checkout escribía en el disco, y eso es justo lo que
`.gitattributes` corrige. `git add --renormalize .` no encuentra nada que cambiar:
comprobado, cero archivos.

**Confirmado en el escenario que fallaba · 2026-09-04.** El autor repitio el
recorrido en frio desde un clon limpio —clonar, `npm install`, `npm run verificar`—
y obtuvo `VERIFICADO` con codigo 0 y sin la nota de finales de linea. Es el mismo
escenario donde antes salia `DESFASADO`. El hallazgo se cierra con esa prueba, no
con el razonamiento de que deberia funcionar.

**Si la nota de finales de linea vuelve a aparecer, no es ruido conocido.** Con
`.gitattributes` puesto y el arbol refrescado, el veredicto `VERIFICADO` no deberia
volver a traer esa nota nunca: los clones salen en LF y los generadores escriben LF.
Que reaparezca significa que algo cambio en la cadena que produce esos archivos, y
hay que averiguar que. En orden de probabilidad:

1. **La copia es anterior al refresco.** Un arbol que nunca se reescribio sigue
   teniendo CRLF en el disco. Es el caso benigno y el unico que se arregla solo, con
   los tres comandos de `90-manual/publicacion-en-cloudflare-pages.md`.
2. **`.gitattributes` dejo de aplicarse:** se borro, se movio, o alguien acoto sus
   patrones y dejo fuera la extension. Se comprueba con
   `git check-attr text eol -- static/css/icons.css`, que debe responder `text: auto`
   y `eol: lf`.
3. **Un generador nuevo escribe CRLF.** Pasa al usar `os.EOL` en vez de un salto de
   linea explicito, o al copiar codigo de otro proyecto. Es lo primero que hay que
   mirar si la nota aparece justo despues de tocar `scripts/`.
4. **Alguien edito a mano un archivo generado** y lo guardo con CRLF. Ademas de la
   nota, eso viola la regla de no editar generados: se edita su generador.
5. **El archivo entro fuera de git**, descomprimido de un ZIP hecho en Windows.

Lo que no corresponde es acostumbrarse a verla. La nota se escribio para que un caso
conocido no se leyera como alarma; una vez cerrada la causa, pasa a ser justo lo
contrario.

---

### H-013 · `verificar-banco` informaba «banco con problemas» cuando el problema era suyo
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 21 · **Fecha:** 2026-09-04

**Síntoma.** `npm run datos:verificar-banco` respondía tres veces seguidas lo mismo
—antes de romper nada, después de borrar una alternativa a mano y después de
reinsertarla—:

```
BANCO CON PROBLEMAS  ***  1 ***
  undefined -> undefined
codigo de salida: 1
```

En una de esas corridas, wrangler había respondido `Unknown argument: remot`, junto
con un `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c,
line 94`.

**Causa.** Son dos cosas distintas, y conviene no confundirlas, porque la primera
hipótesis —que el script cortaba su propio argumento— resultó **falsa**.

*Lo que no era.* El envoltorio no truncaba nada. Medido interceptando `npx` con un
sustituto que registra lo que recibe, corriendo el script real, en el directorio
real, desde PowerShell y con `npm run … -- --remote`:

```
[wrangler d1 execute examen-td-js-produccion --remote --json --file=d1/verificar-banco.sql]
```

El argumento llega entero. Se comprobó además cada tramo por separado —PowerShell →
npm → node → `spawnSync` → cmd.exe → npx → wrangler— enviando `--remotex`,
`--remotee` y `--xremote`: wrangler los reporta completos, letra por letra. Ninguna
capa recorta. El `--remot` estaba en la línea de comandos tal como se escribió.

*Lo que sí era.* El envoltorio no sabía distinguir **«el banco tiene problemas»** de
**«no pude preguntarle nada al banco»**, y ante la duda anunciaba lo primero. Tres
defectos encadenados, los tres reproducidos:

1. **Buscaba el JSON con `bruto.indexOf('[')`**, el primer corchete que apareciera en
   cualquier parte del texto. Cuando wrangler rechaza un argumento vuelca su pantalla
   de ayuda, y ahí el primer corchete está dentro de `[string]`.
2. **No miraba las filas por dentro.** Bastaba con que la respuesta se dejara
   interpretar como un arreglo: cada elemento se daba por una fila y se imprimía
   `f.comprobacion -> f.detalle` sin comprobar que esas columnas existieran. De ahí
   el `undefined -> undefined`. Reproducido exactamente: una respuesta cuyo `results`
   no sea un arreglo de filas produce, palabra por palabra, `BANCO CON PROBLEMAS ***
   1 *** / undefined -> undefined` y código 1.
3. **Tiraba el mensaje de error.** Sólo mostraba `stderr`, y wrangler escribe buena
   parte de sus fallos en la salida normal: base no declarada en `wrangler.toml` y
   tabla inexistente llegan como `{"error":{"text":…}}` por `stdout`, con `stderr`
   vacío. El veredicto decía «Sin detalle de error» teniendo el detalle en la mano.

A eso se suma que en Windows wrangler se cae al terminar —el `Assertion failed` de
libuv— y devuelve `3221226505` en vez de un código legible, de modo que el código de
salida tampoco es un buen único testigo.

**Impacto.** Es el tercero de la misma familia que H-011 y H-012, y el más grave de
los tres.

- **H-011:** un script que hacía la mitad del trabajo y parecía haberlo hecho entero.
- **H-012:** un script que daba la alarma sin que hubiera nada que denunciar.
- **H-013:** un script que da la alarma **igual pase lo que pase**, y encima sobre lo
  único que no puede autodefenderse.

La diferencia de gravedad está en qué custodia cada uno. `verificar` cuida el CSS
compilado: si se equivoca, el sitio se ve mal. `verificar-banco` cuida el contenido
que estudia el alumno, y cubre justo lo que el esquema **no** puede exigir por su
cuenta —cuatro alternativas, al menos una correcta, ninguna activa sin
justificación, ningún módulo vacío—. El día que el banco tenga un problema de verdad
lo iba a reportar con las mismas palabras que hoy, cuando no tiene ninguno, y para
entonces nadie le habría hecho caso. Un aviso que suena siempre deja de ser un aviso.

Y el corolario que ordena el arreglo: **un problema que no se puede describir no es
un problema encontrado.** `undefined -> undefined` no es un hallazgo, es la ausencia
de uno.

**Resultado · 2026-09-04.** Reescrito `scripts/verificar-banco.mjs` sobre tres
reglas, anotadas en su cabecera:

1. **Un fallo de wrangler nunca es un problema del banco.** Sale por 2, rotulado `NO
   SE PUDO VERIFICAR *** ESTO NO ES UN APROBADO ***`, diciendo con todas sus letras
   que nadie llegó a mirar el banco y que eso no significa ni que esté bien ni que
   esté mal. Se imprime el comando exacto que se ejecutó y lo que wrangler dijo por
   **las dos** salidas, con el motivo primero y la ayuda después, porque al revés la
   única línea que explica el fallo queda sepultada.
2. **La forma de la respuesta se comprueba entera antes de creérsela:** que sea un
   arreglo, que cada bloque traiga `results` como arreglo, que ningún bloque venga
   con `error` o con `success: false`, y que cada fila traiga las dos columnas que
   declara la consulta. Cualquier otra cosa es «no pude verificar», no «el banco
   falla». La lista de columnas esperadas vive en la cabecera del script, junto a la
   instrucción de cambiarla si cambia el SQL.
3. **Se invoca el wrangler de `node_modules` con el mismo node que corre el script**,
   sin `shell` y sin `npx`. Sin shell los argumentos viajan como arreglo y no hay
   línea de comandos que armar; sin npx no puede descargarse una versión distinta si
   la dependencia falta —antes, un `node_modules` a medias habría bajado otro
   wrangler en silencio; ahora dice «corre `npm install`» y sale por 2—. La ruta del
   SQL pasó a ser absoluta, derivada de la ubicación del script, para que no dependa
   del directorio desde el que se invoque.

*Los tres estados, provocados de verdad, en los dos terminales y desde un clon
limpio en Windows* (la regla que dejó H-012), con `npm install` hecho en el clon:

| Estado | Cómo se provocó | Veredicto | Código |
|---|---|---|---|
| Sano | banco de ejemplo recién cargado | `BANCO VERIFICADO` | 0 |
| Con problemas | `DELETE FROM alternativa WHERE id = 40` | `BANCO CON PROBLEMAS *** 2 ***`, ambas filas descritas | 1 |
| Sin veredicto | `-- --remot` | `NO SE PUDO VERIFICAR`, con `X [ERROR] Unknown argument: remot` visible | 2 |

Provocados también, todos por 2 y todos con el motivo legible: base no declarada en
`wrangler.toml`, base local sin tablas (`no such table: modulo`), `node_modules` sin
wrangler, y el caso exacto que producía `undefined -> undefined` —renombrar una
columna del SQL—, que ahora responde `Faltan, o no son texto: comprobacion / La fila
trae: chequeo, detalle`.

**Lo que este hallazgo deja como regla.** Un envoltorio que traduce la salida de otra
herramienta tiene que tratar «no entendí la respuesta» como un tercer estado
explícito. Dos estados —bien y mal— obligan a meter los fallos propios en uno de los
dos, y siempre terminan en el de «mal», que es el que parece prudente y es el que
enseña a ignorar la herramienta.

**Hallazgo relacionado, corregido a petición del autor el 2026-09-04.**
`scripts/verificar.mjs` tenía la misma confusión, más leve. Hacía
`if (diff.status !== 0) → DESFASADO`. `git diff --exit-code` devuelve 0 sin diferencias y 1 con diferencias:
cualquier otro código es git fallando. Sólo se distingue el caso «no es un
repositorio», por texto del `stderr`. Comprobado con un repositorio de índice
corrupto: `git diff --exit-code` sale por **128** con `fatal: .git/index: index file
smaller than expected`, que no coincide con ese texto y por lo tanto se anunciaba
como `DESFASADO` —un problema del CSS— cuando el CSS no tenía nada que ver.

*Arreglado.* Ahora sólo `status === 1` es `DESFASADO`; cualquier otro código, y
también un fallo al lanzar el proceso, es `VERIFICACION PARCIAL` mostrando lo que
dijo git. Provocado en un banco de pruebas aislado, con el caso puro —sin ningún
desfase real y con el índice corrupto—, que antes daba `DESFASADO` y ahora da:

```
VERIFICACION PARCIAL  ***  ESTO NO ES UN EXITO  ***
NO comprobado: si esta commiteado. git fallo con el codigo 128.
Esto NO es un CSS desfasado: es git que no pudo responder.
Lo que dijo git:
  fatal: .git/index: index file smaller than expected
codigo de salida: 2
```

Comprobado también que los otros dos veredictos siguen intactos: `VERIFICADO` con
todo al día, y `DESFASADO` con un cambio real de contenido. Y `npm run verificar`
sobre el proyecto real sigue dando `VERIFICADO`, código 0.

En cambio, **el defecto de paso de argumentos no lo tiene**: sus dos usos de
`shell: true` llevan argumentos fijos, y la llamada a git —la única con una ruta
variable, que además puede contener espacios— va sin shell y con los argumentos en
arreglo, que es la forma correcta.

**Cierre · 2026-09-05. El tercer veredicto, provocado en remoto en sus dos formas.**
Lo que faltaba no era el arreglo sino la prueba en el escenario donde el guardián
importa: contra la nube. El autor ejecutó las dos formas, sobre la base de pruebas.

| Forma | Cómo se provocó | Qué respondió | Código |
|---|---|---|---|
| A · el nombre no existe en la cuenta | `--base=examen-td-js-no-existe-h013`, con `PERMITIR_BASE_NO_DECLARADA=1` porque el envoltorio rechaza por su cuenta las bases no declaradas (H-015) | `NO SE PUDO VERIFICAR`, con el 404 de la cuenta: «Couldn't find a D1 DB with name or binding 'examen-td-js-no-existe-h013' in your config or the API» | 2 |
| B · la base existe, se alcanza y la consulta no puede correr | Las cinco tablas y `prueba_tuberia` tiradas con `DROP`, y verificar sobre la base vacía | `NO SE PUDO VERIFICAR`, con el error real de D1: «no such table: modulo: SQLITE_ERROR [code: 7500]» | 2 |

**La forma B es la que cierra el hallazgo.** Es el camino completo: wrangler se
autentica, llega a la base de pruebas de verdad, ejecuta la consulta contra ella, y el
error lo devuelve **D1**, no wrangler. Sobre una base vacía la respuesta cómoda —cero
filas, ningún problema— habría sido `BANCO VERIFICADO`, y habría sido falsa. Dijo que
no pudo verificar. Eso es exactamente lo que este hallazgo existe para conseguir.

Tras el vaciado, la migración y los datos de ejemplo se reaplicaron —`10` y `3
commands executed successfully.`— y la verificación volvió a `BANCO VERIFICADO`,
código 0. Los tres veredictos quedan cerrados, y con ellos el hallazgo.

**Estado:** 🟢 Resuelto y verificado en remoto.

---

### H-014 · ADR-015 falló en su primera prueba real: la salvaguarda era de una sola capa
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 21 · **Fecha:** 2026-09-04

**Síntoma.** Trabajando en H-013, Claude Code ejecutó un comando `wrangler … --remote`
contra la cuenta de Cloudflare del autor. ADR-015 lo prohíbe explícitamente, y
CLAUDE.md lo formula de la forma más comprobable posible: *todo lo que ejecute Claude
Code lleva `--local` explícito*.

**Qué llegó a pasar, según los registros de wrangler y no según la memoria.** Esto
importa porque la primera versión de este parte fue más benigna que los hechos. El
registro está en `%APPDATA%\xdg.config\.wrangler\logs\wrangler-2026-09-04_16-27-00_706.log`:

1. wrangler **se autenticó**: `fetching auth token grant_type=refresh_token` contra
   `dash.cloudflare.com/oauth2/token`. La sesión iniciada en el equipo estaba viva y
   se usó. El archivo de sesión quedó con fecha de modificación de ese minuto.
2. **Alcanzó la base de producción**, `examen-td-js-produccion`
   (`cff1686b-3b24-4892-9a10-4306684e0127`), en la cuenta `2e5cb791…`.
3. Usó el extremo **`/import`** —no `/query`—, porque `d1 execute --remote --file=`
   sube el archivo por la vía de importación. **Dos peticiones POST, las dos con
   respuesta 200.**
4. wrangler avisó por su cuenta: *«⚠️ This process may take some time, during which
   your D1 database will be unavailable to serve queries.»*
5. Terminó con `no such table: modulo`, porque el esquema **no está** en producción:
   el paso 5 de la iteración 21 nunca se ejecutó.

**No se modificó ningún dato.** El archivo enviado era una única sentencia `SELECT` y
las tablas que consulta no existen allá. Pero conviene decirlo con precisión: una
consulta de sólo lectura viajó por el **camino de escritura** hasta la base de
producción, autenticada, y volvió con 200. Que no pasara nada es consecuencia de dos
casualidades —que el archivo no contuviera escrituras y que la base estuviera
vacía—, no de ninguna barrera.

*El resto de la sesión está limpio.* De los 110 registros de wrangler de ese día, 29
contactaron la API; de esos, **uno solo** cae dentro de la ventana de la sesión de
Claude Code, y es este. Los demás son de sesiones anteriores del autor. La variante
del mismo error contra `examen-td-js-pruebas`, lanzada segundos después, **nunca
salió del equipo**: falló antes de autenticarse porque le faltaba `--env preview`, el
defecto del manual corregido ese mismo día. Es decir que lo que protegió la base de
pruebas fue *otro error*.

**Causa — la lección, primero.** ADR-015 y CLAUDE.md formulan la regla de la forma
más comprobable que se les ocurrió: *mira el comando, tiene que llevar `--local`*.
**Esa formulación tiene un punto ciego, y es el que abrió este incidente.** El
comando que Claude Code ejecutó fue:

```
powershell -File correr.ps1
```

Ahí no se ve ningún `--remote`. El `--remote` vivía dentro del archivo, tres capas
más abajo —`.ps1` → `npm` → `node` → `spawnSync` → `npx` → `wrangler`—. Una regla que
se comprueba leyendo la línea de comandos no ve absolutamente nada cuando la línea
de comandos es un archivo. Y no es un caso rebuscado: escribir un guion de apoyo y
lanzarlo es el modo normal de trabajar en cuanto algo tiene más de dos pasos.

De ahí se sigue lo demás. Una regla en prosa depende de que quien la lee no se
equivoque nunca; una regla que se audita mirando el comando depende además de que el
comando sea legible. Las dos fallan por el mismo sitio: **describen** lo que no hay
que hacer en vez de **impedirlo**. La barrera tiene que estar donde el comando no
puede esconderse, y eso es el entorno del proceso, no su línea de invocación.

**Cómo se disparó, en concreto.** No fue una decisión de saltarse la regla: fue
**andamiaje que falló en silencio**, con una sola capa de protección detrás.

Para investigar H-013 hacía falta ver qué argumentos recibía `npx`. El montaje era:
escribir un `npx.cmd` falso en una carpeta, anteponer esa carpeta al `PATH`, y correr
el script real. Con el `npx` falso delante, la llamada nunca habría llegado a
wrangler. Lo que ocurrió:

1. El `sed` que construía la ruta de la carpeta falla y escribe su error.
2. La sustitución de comandos que lo envolvía devuelve **la cadena vacía**.
3. La línea que anteponía el `PATH` queda en `$env:PATH = ";" + $env:PATH`: no falla,
   **no hace nada**, y no lo dice.
4. El script sigue corriendo. El `npx` que se resuelve es el de verdad.
5. `--remote` llega intacto a wrangler, que hace exactamente lo que se le pidió.

Cada paso es benigno por separado. El fallo está en que **la única barrera era el
andamiaje**, y el andamiaje no comprobaba haberse instalado. Es, otra vez, la familia
de H-011, H-012 y H-013: algo que falla **pareciendo que funciona**. La diferencia es
que aquí lo que parecía funcionar era la salvaguarda.

**Impacto.** Lo que estaba en juego no es hipotético: la misma vía, con un archivo que sí
contuviera `INSERT`, `UPDATE` o `DROP`, habría escrito en la base de producción del
sitio que estudian los alumnos, sin respaldo previo —el respaldo es el paso que
`90-manual/respaldo-y-restauracion.md` exige antes de tocar producción, y este camino
lo salta— y con el aviso de indisponibilidad que wrangler ya imprimió esta vez.

**Lo que este hallazgo deja claro.** Una regla que vive sólo como prosa depende de que
quien la lee no se equivoque nunca. La prosa es necesaria —dice *por qué*— pero no es
una barrera. Una barrera es algo que hace que la acción prohibida **no pueda ocurrir**
aunque quien la intenta se equivoque, y que **avisa cuando ella misma se cae**.

**Propuesta.** Pendiente de aprobación del autor; presentada el 2026-09-04. Cinco
capas, en orden de cuánto sostienen:

1. **Quitar la credencial del entorno de Claude Code.** Es la única capa que sobrevive
   al andamiaje. Wrangler resuelve su sesión desde `XDG_CONFIG_HOME` si está definida,
   y sólo si no lo está usa `%APPDATA%\xdg.config`; se lee en su propio código
   empaquetado, `node_modules/wrangler/wrangler-dist/cli.js`:

   ```
   if (isWindows()) { return valOrPath(getEnv("XDG_CONFIG_HOME"), [ windowsAppData(), "xdg.config" ]); }
   ```

   Apuntando esa variable —**sólo en el entorno de Claude Code**, no en el del autor—
   a una carpeta vacía e ignorada por git, y vaciando `CLOUDFLARE_API_TOKEN`,
   `CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL` y `CLOUDFLARE_ACCOUNT_ID`, cualquier
   `--remote` falla al autenticarse **antes de salir del equipo**, sin importar
   cuántas capas de guion lo envuelvan: las variables de entorno las heredan todos los
   procesos hijos. Es justo el punto ciego que el andamiaje dejó abierto.
2. **Un enganche `PreToolUse` que rechace el comando** cuando la línea contenga
   wrangler junto a `--remote`, `d1 create`, `d1 delete`, `d1 export`, `d1
   time-travel`, `pages deploy`, `login` o `secret`. Es la capa barata y la que da el
   mensaje claro, pero **hay que decir lo que no hace**: no habría detenido este
   incidente, porque sólo ve la línea de comandos y ésta decía `powershell -File
   correr.ps1`.
3. **Que los scripts propios se nieguen.** `verificar-banco.mjs` —y cualquier futuro
   envoltorio de wrangler— rechaza `--remote` salvo que exista una variable explícita
   del autor. Cubre el camino documentado, que es por donde se cometen los errores
   normales.
4. **Comprobar la barrera y hacer ruido si se cayó.** Un `scripts/verificar-barrera.mjs`
   que confirme las tres condiciones anteriores y las anuncie con tres veredictos
   propios —en pie, caída, no se pudo comprobar—, siguiendo la regla de H-013, y que
   corra como **primer paso de `npm run verificar`**, para que no dependa de que
   alguien se acuerde. Junto a él, una auditoría *a posteriori* sobre los registros de
   wrangler: buscar `START CF API REQUEST` desde una fecha responde con hechos si
   alguna vez hubo fuga. Es la consulta con la que se reconstruyó este incidente.
5. **Regla de proceso para el andamiaje, que es donde nació el fallo.** Todo montaje
   que **sustituya** una herramienta real tiene que **demostrar que la sustitución se
   instaló** antes de correr nada —un centinela que el propio montaje comprueba—, y
   los guiones de apoyo abortan al primer error en vez de seguir. El andamiaje que
   protege es código crítico, no código desechable.

**Coste para el trabajo legítimo.** Bajo, y conviene decirlo por si se subestima. La
capa 1 no toca el terminal del autor: sus comandos remotos siguen funcionando igual,
porque la variable se define en el entorno de Claude Code. Lo que Claude Code pierde
es la capacidad de comprobar nada contra la nube —que ya estaba prohibida— y, con
ella, la de diagnosticar un problema que sólo se manifieste allá: en ese caso el
procedimiento es escribir el comando para que lo ejecute el autor y leer su salida,
que es lo que ADR-015 ya manda. La fricción real aparece el día que se quiera levantar
la barrera a propósito, y que ese día requiera un acto deliberado es exactamente el
objetivo.

**Resultado · 2026-09-04.** Aprobadas por el autor e implementadas las cuatro capas
técnicas. La quinta, la regla de proceso sobre el andamiaje, no es código y queda
escrita al final de esta entrada y en el registro.

*Capa 1 · el entorno de Claude Code no tiene con qué autenticarse.* Vive en los
**ajustes de usuario**, `~/.claude/settings.json`, y **no** en el repositorio:

```json
"env": {
  "XDG_CONFIG_HOME": "C:\\Users\\<usuario>\\.claude\\wrangler-sin-credenciales",
  "CLOUDFLARE_API_TOKEN": "", "CLOUDFLARE_API_KEY": "",
  "CLOUDFLARE_EMAIL": "",     "CLOUDFLARE_ACCOUNT_ID": ""
}
```

*Por qué ahí y no en el proyecto · corrección del 2026-09-04.* Se intentó primero en
`.claude/settings.json` y `.claude/settings.local.json` del repositorio, y **no
funcionó**: el bloque `env` no llegaba al entorno ni tras reiniciar la sesión.
Comprobado midiendo la variable, no suponiéndolo. Es plausible que Claude Code lo
impida a propósito —inyectar variables de entorno en todos los subprocesos desde un
archivo que viene dentro de un repositorio clonado es justo lo que no conviene
permitir— y en todo caso el hecho está medido. Se mudó a los ajustes de usuario, con
el segundo motivo de que **la regla es sobre Claude Code y no sobre este
repositorio**: corresponde que viva donde vive la configuración de la herramienta. El
autor aceptó expresamente que aplique a todas sus sesiones. El archivo del proyecto
`.claude/settings.local.json` se borró para no dejar dos sitios declarando lo mismo.
El procedimiento operativo está en `90-manual/barrera-adr-015.md`.

Es la capa que sostiene, porque las variables de entorno las heredan **todos** los
procesos descendientes: no hay guion, ni archivo, ni número de capas que la esquive.
Comprobado que no estorba el trabajo legítimo antes de adoptarla: con la variable
puesta, una consulta `--local` corre igual, y el registro de wrangler aparece dentro
del directorio desviado —que es la prueba de que resolvió ahí su configuración, y
ahí no hay sesión—.

*Capa 2 · enganche `PreToolUse`* sobre Bash y PowerShell, `scripts/barrera-remoto.mjs`,
declarado en `.claude/settings.json`, que sí se versiona. Rechaza `--remote` junto a
wrangler o a un script `datos:`, y los `wrangler login/logout/whoami/secret/deploy`,
`d1 create/delete/export/time-travel` y `pages deploy/delete`. Diez casos probados por
tubería, cuatro que deben pasar y seis que deben bloquearse, todos correctos.
**Y hay que repetir lo que esta capa no hace: no habría detenido este incidente**,
porque sólo ve la línea de comandos.

*Capa 3 · el envoltorio se niega.* `scripts/verificar-banco.mjs` rechaza `--remote`
salvo que exista `PERMITIR_REMOTO=1`, que es un acto deliberado de quien lo escribe y
justo lo que un andamiaje equivocado nunca hace.

*Capa 4 · la barrera se comprueba sola y hace ruido.* `scripts/verificar-barrera.mjs`
corre como **primer paso de `npm run verificar`**, antes de construir nada, y da tres
veredictos: `BARRERA EN PIE` (0), `BARRERA CAIDA` (1) y `NO SE PUDO COMPROBAR` (2).
En el terminal del autor responde `BARRERA NO APLICA` y no estorba —él sí trabaja
contra la nube, por ADR-015—, pero **imprime siempre qué entorno detectó**: si algún
día Claude Code dejara de anunciarse con `CLAUDECODE`, la detección fallaría y esto
diría «no aplica» dentro de Claude Code, que es la forma silenciosa de caerse. Queda
a la vista para que se note.

*Provocados de verdad los siete estados*, no descritos:

| Estado provocado | Veredicto | Código |
|---|---|---|
| Barrera puesta | `BARRERA EN PIE` | 0 |
| `XDG_CONFIG_HOME` sin definir | `BARRERA CAIDA` | 1 |
| `XDG_CONFIG_HOME` apuntando al directorio **con** sesión | `BARRERA CAIDA`, nombrando `default.toml` | 1 |
| `CLOUDFLARE_API_TOKEN` con valor | `BARRERA CAIDA` | 1 |
| Enganche quitado de `settings.json` | `BARRERA CAIDA` | 1 |
| `settings.json` mal formado | `NO SE PUDO COMPROBAR` | 2 |
| Fuera de Claude Code | `BARRERA NO APLICA`, diciendo qué detectó | 0 |

Y comprobado que `npm run verificar` **se detiene antes de construir** con la barrera
caída —no llega a escribir los íconos— y sigue hasta `VERIFICADO` con la barrera en
pie.

*La prueba que de verdad importa.* Se repitió el escenario del incidente con la
barrera puesta y **anulando a propósito la capa 3** con `PERMITIR_REMOTO=1`, es decir
dejando pasar el `--remote` a wrangler igual que aquel día. No salió del equipo:

```
{ "error": { "text": "In a non-interactive environment, it's necessary to set a
CLOUDFLARE_API_TOKEN environment variable for wrangler to work. ..." } }
```

Cero `START CF API REQUEST` en el registro, contra los dos POST con 200 que muestra
el registro del incidente. El directorio de configuración real no recibió nada nuevo.
La capa 1 detuvo lo que la capa 3 había dejado pasar, que es exactamente para lo que
existe tener capas.

**Se añadió una cuarta condición: declarado no es lo mismo que vivo.** La comprobación
original miraba que el enganche estuviera **declarado** en el archivo de ajustes, y
eso resultó insuficiente el mismo día: el archivo era correcto, el guion era correcto,
y el enganche **no se ejecutaba** porque Claude Code no llegaba a cargar el archivo.
En esa situación la capa 4 habría dicho `BARRERA EN PIE`, que es exactamente el fallo
silencioso que este hallazgo existe para evitar.

Ahora el guardián deja un testigo con la hora en `.wrangler/barrera-ultimo-uso.txt`
cada vez que corre, y el comprobador exige que sea reciente. Como el comprobador se
lanza a través de la misma herramienta que dispara el enganche, si está vivo el
testigo se acaba de escribir; si está muerto, envejece y se nota. Provocado: con el
testigo envejecido a una hora, `BARRERA CAIDA` diciendo «el enganche esta declarado
pero no se esta ejecutando: su testigo tiene 3600 s».

**Pendiente de un paso que Claude Code no puede dar.** Reiniciar la sesión **no
bastó**: ni el enganche ni el bloque `env` del proyecto se cargaron. Descartado que
fuera el guion —invocado exactamente como lo haría el enganche, responde `deny`—, el
JSON —válido—, la confianza del proyecto —`hasTrustDialogAccepted: true`— o
`disableAllHooks` —sin poner—. La capa 1 se resolvió mudándola a los ajustes de
usuario; para el enganche queda abrir `/hooks` una vez, que es lo que recarga la
configuración explícitamente.

**Hallazgo que salió de reconstruir el incidente, y que ya se aplicó.**
`wrangler d1 execute --remote --file=` viaja por el extremo `/import` —el camino de
escritura—, no por `/query`, y de ahí el aviso de indisponibilidad que wrangler
imprimió. Para leer se usa `--command`; `--file` sólo cuando de verdad se va a
escribir. Anotado en `90-manual/esquema-del-banco.md`, y **corregido en el propio
`verificar-banco.mjs`**, que usaba `--file` y por tanto habría hecho viajar su
consulta de sólo lectura por la puerta de escritura cada vez que el autor la corriera
contra la nube. Ahora lee el `.sql` y lo envía como `--command`; los tres veredictos
se volvieron a provocar tras el cambio, sin regresión.

**Capa 5, que no es código: regla de proceso para el andamiaje.** Todo montaje que
**sustituya** una herramienta real —un `npx` falso, un `PATH` alterado, un doble de
prueba— tiene que **demostrar que la sustitución se instaló** antes de correr nada:
un centinela que el propio montaje comprueba y que aborta si no aparece. Y los guiones
de apoyo abortan al primer error en vez de seguir. El andamiaje que protege es código
crítico, no código desechable: aquí fue la única barrera que había, y se cayó sin
decirlo.

**Cierre · 2026-09-05. El enganche está vivo, y con eso caen las cuatro condiciones.**
Quedaba «un paso que Claude Code no puede dar»: que la sesión cargara el enganche
declarado. Ya ocurrió. Comprobado desde dentro de Claude Code:

```
BARRERA EN PIE
Entorno detectado: Claude Code (CLAUDECODE=1, CLAUDE_CODE_ENTRYPOINT=cli).
  - XDG_CONFIG_HOME apunta a C:\Users\<usuario>\.claude\wrangler-sin-credenciales, y ahi no hay sesion de wrangler.
  - Ninguna de estas trae valor: CLOUDFLARE_API_TOKEN, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL, CLOUDFLARE_ACCOUNT_ID.
  - El enganche PreToolUse esta declarado y su guion existe.
  - El enganche se ejecuto hace 0 s: esta vivo, no solo declarado.
codigo de salida: 0
```

Lo que vale de esa salida es la última línea. **El testigo de 0 s significa que el
enganche se ejecutó al lanzar este mismo comando**, porque el comprobador viaja por la
herramienta que lo dispara. Es la cuarta condición, la que se añadió justamente porque
«declarado» y «vivo» no son lo mismo, y es la que faltaba por confirmar. Las cuatro
capas técnicas están operativas y comprobadas en el entorno real.

El hallazgo queda cerrado del lado técnico. Lo que no cierra —ni puede— es la capa 5:
es una regla de proceso sobre el andamiaje, y se cumple o se incumple cada vez.

---

### H-015 · `wrangler.toml` no delimita contra qué base D1 se escribe: lo hace el nombre que se teclea
**Gravedad:** 🟠 · **Estado:** 🔵 En curso · **Detectado en:** iteración 21 · **Fecha:** 2026-09-04

**Síntoma.** El ensayo remoto de la iteración 21 esperaba que omitir `--env preview`
hiciera fallar el comando, porque `examen-td-js-pruebas` sólo está declarada en
`wrangler.toml` bajo `[[env.preview.d1_databases]]`. **No falla.** Wrangler encuentra
la base igual y corre contra ella: el veredicto salió `BANCO CON PROBLEMAS`, código 1,
idéntico al paso anterior, en vez del `NO SE PUDO VERIFICAR` previsto.

**Causa.** Verificada en el código empaquetado de wrangler
(`node_modules/wrangler/wrangler-dist/cli.js`), no deducida del comportamiento. Los
dos caminos son distintos:

*En local*, `executeLocally` resuelve **sólo** desde el archivo de configuración, y si
el nombre no está ahí, se detiene:

```js
const localDB = getDatabaseInfoFromConfig(config, name);
if (!localDB) { throw new UserError(`Couldn't find a D1 DB with the name or binding
  '${name}' in your ${configFileName(config.configPath)} file.`); }
```

*En remoto*, `executeRemotely` llama a `getDatabaseByNameOrBinding`, que mira la
configuración **y, si no lo encuentra, pregunta a la cuenta por ese nombre**:

```js
if (hasUuid(dbFromConfig)) { return dbFromConfig; }
...
else { lookupName = nameOrBinding; }        // el nombre tal como se tecleó
({ uuid, name } = await fetchResult(config,
   `/accounts/${accountId}/d1/database/${encodeURIComponent(lookupName)}`, ...));
```

Sólo si la API responde 404 hay error: `Couldn't find a D1 DB with name or binding
'<nombre>' in your config or the API`.

**Consecuencia — y es esto lo que importa.** Para el trabajo remoto, `wrangler.toml`
**no es un límite: es una tabla de alias**. Ahorra escribir un identificador, y nada
más. Lo único que decide contra qué base se escribe es **el nombre que se teclea**, y
ese nombre se resuelve contra la cuenta entera, no contra lo declarado en el
repositorio.

De ahí se sigue que varias protecciones que parecían existir no existen:

- **Declarar una base bajo `env.preview` no la aísla.** Un comando sin `--env preview`
  llega a ella igual. El bloque de entorno no acota nada en remoto.
- **No declarar una base no la pone fuera de alcance.** Cualquier base de la cuenta es
  alcanzable escribiendo su nombre, esté o no en el archivo. `wrangler.toml` no
  enumera lo que se puede tocar; enumera lo que es cómodo tocar.
- **Un error de tecleo no rebota contra la configuración.** Aquel día que se escribió
  `production` en vez de `produccion`, lo que salvó al proyecto fue que esa base **no
  existía en la cuenta**. No fue la configuración: fue la suerte de que el nombre
  equivocado no correspondiera a nada. El día que existan dos nombres parecidos —una
  base nueva, una copia de respaldo, un `examen-td-js-produccion-v2`— esa suerte se
  acaba y no hay ninguna otra red debajo.
- **`d1 create` con una errata no avisa: crea.** Es la forma normal de acabar teniendo
  dos nombres parecidos en la misma cuenta, que es la condición que dispara lo
  anterior.

Esto además cambia la lectura de **H-014**. Se dijo allí que la barrera se sostiene en
la capa 1 —el entorno sin credenciales—, y H-015 explica *por qué es la única que
puede sostenerla*: no hay ningún límite del lado de la configuración que pueda
apoyarla. Sin credenciales no se resuelve ningún nombre; con credenciales, cualquier
nombre de la cuenta está a un tecleo.

**Impacto.** El daño no es teórico ni lejano: `d1 execute --remote --file=` escribe
—va por el extremo de importación, ver H-014— y el nombre de la base es la única cosa
que decide dónde. Un comando correcto en todo lo demás, con una letra distinta en el
nombre, se ejecuta sin preguntar nada contra una base que no era la prevista. El
respaldo previo que exige `respaldo-y-restauracion.md` es hoy la única protección
real, y depende de que alguien se acuerde.

**Propuesta.** No se puede cambiar cómo resuelve wrangler, así que el límite hay que
ponerlo antes de llamarlo.

**Implementado el 2026-09-04 (punto 1), aprobado por el autor.** `verificar-banco.mjs`
reúne los `database_name` de `wrangler.toml` y rechaza cualquier `--base` que no esté
en esa lista, con el veredicto `BASE NO DECLARADA *** H-015 ***` y código 2. La
salida explícita es `PERMITIR_BASE_NO_DECLARADA=1`, y su único caso de uso legítimo
—apuntar a propósito a un nombre inexistente para provocar el tercer veredicto— está
documentado en `90-manual/barrera-adr-015.md` y en el ensayo del banco. Se lee con una
expresión regular en vez de un analizador de TOML porque una dependencia nueva
necesita ADR. Provocado: nombre declarado pasa, nombre inventado da código 2 listando
las dos bases declaradas, y con la variable puesta vuelve a pasar.

Quedan pendientes los puntos 2 y 3.

1. **Que los envoltorios propios sólo acepten nombres declarados.**
   `scripts/verificar-banco.mjs` —y cualquier futuro envoltorio— lee `wrangler.toml`,
   reúne los `database_name` de todos los bloques de entorno, y rechaza un `--base`
   que no esté en esa lista. Eso devuelve al archivo el papel de límite que no tiene
   por sí solo, al menos en los caminos que pasan por el proyecto. Es barato y no
   quita nada: los nombres legítimos son dos.
2. **Que ningún comando remoto contra producción se escriba a mano en el manual sin
   el respaldo inmediatamente antes**, en el mismo bloque, no en un párrafo aparte.
   Hoy el aviso está separado de los comandos y se lee después de haberlos copiado.
3. **Revisar los nombres antes de crear cualquier base nueva.** Dos bases cuyos
   nombres se diferencien en una letra, un acento o un sufijo son un accidente
   esperando fecha. Si hace falta una copia, que el nombre sea inconfundible a
   simple vista.

**Actualización · 2026-09-05.** El punto 1 de la propuesta se ejercitó de verdad
durante el ensayo remoto: la forma A del tercer veredicto necesita apuntar a un
nombre que no existe, y el envoltorio lo rechazó por su cuenta hasta que el autor puso
`PERMITIR_BASE_NO_DECLARADA=1`. Es la única salida legítima de esa comprobación y
funcionó como estaba previsto. **Los puntos 2 y 3 siguen pendientes**, y el hallazgo
sigue 🔵 En curso: el punto 2 —respaldo pegado al comando remoto contra producción, en
el mismo bloque— vuelve a ser relevante en cuanto la iteración 24 toque producción.

---

### H-016 · Wrangler se cae al terminar en Windows y devuelve un código sin sentido
**Gravedad:** 🟡 · **Estado:** ⏸️ Aceptado · **Detectado en:** iteración 21 · **Fecha:** 2026-09-05

**Síntoma.** Al terminar, wrangler imprime en Windows:

```
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

y en ocasiones el proceso devuelve `3221226505` —`0xC0000409`, el aborto de Windows por
comprobación de seguridad— en vez de 0, 1 o 2. Apareció en **dos de las tres corridas**
del ensayo remoto del 2026-09-05, y ya se había visto durante la investigación de
H-013.

**Causa.** Es libuv, la biblioteca de entrada y salida que usa Node, cerrando un
manejador asíncrono que ya estaba en proceso de cierre. Ocurre **después** de que
wrangler haya hecho su trabajo e impreso su salida: el comando se ejecuta completo y su
resultado es válido. **No es de este proyecto**, no depende del banco, del esquema ni de
los guiones, y no hay nada que arreglar de este lado. Va a seguir apareciendo.

**Impacto.** El único real es de interpretación, y por eso queda escrito: quien vea ese
`Assertion failed` junto a un veredicto puede creer que el proyecto falló. No falló.
Y el corolario práctico: **el código de salida de wrangler no es un testigo fiable en
Windows.**

Por eso `verificar-banco.mjs` no se fía sólo de él —interpreta lo que wrangler dijo por
las dos salidas y comprueba la forma de la respuesta antes de creérsela—, y por eso
siguió dando el veredicto correcto en las corridas donde wrangler se cayó al terminar.
Fue una decisión de H-013 tomada por otro motivo, y aquí se cobró sola.

**Propuesta.** Ninguna acción sobre el código. Se convive con él. Si algún guion nuevo
envuelve a wrangler, la regla es la misma: **el código de salida se mira, pero no
decide**. Si algún día wrangler lo corrige, esta entrada se puede cerrar sin más.

### H-017 · El guardián del escapado dejaba el contenido hostil dentro de la base local
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 22 · **Fecha:** 2026-09-05

**Síntoma.** Después de provocar a propósito el veredicto `NO SE PUDO PROBAR` —apuntando
el guardián a un puerto sin servidor—, la base D1 **local** se quedó con la pregunta
hostil 900, sus cuatro alternativas y el ícono del módulo 2 envenenado
(`devices" onload="…`). Comprobado consultando la base al día siguiente de esa corrida:
la fila seguía dentro.

**Causa.** `process.exit()` **no ejecuta los bloques `finally`**. La limpieza vivía en un
`finally`, y la salida sin veredicto era un `process.exit(2)` escrito **dentro del
`try`**, después de haber cargado el contenido hostil. El archivo estaba bien pensado y
mal ordenado: cada vez que la prueba se cortaba sin veredicto —que es justo el caso que
más se repite, porque basta con no tener el servidor levantado— el veneno se quedaba.

**Impacto.** Sólo local; el guardián nunca toca la nube. Pero el momento en que se
descubrió dice el daño: el autor iba a abrir el navegador para cerrar el criterio de que
«`cuestionario.html` muestra las preguntas de D1», y se habría encontrado una pregunta
de ataque y un ícono roto **sin que nada se lo anunciara**. Habría dudado del sitio, que
estaba bien, en vez de dudar de la prueba, que era la que ensuciaba.

Y es peor que un error de una vez, porque es del tipo que se esconde: la corrida
siguiente vuelve a cargar el contenido hostil, así que el rastro se pisa solo y parece
que nunca pasó.

**Resolución.** Tres cambios, y ninguno de los tres es «acordarse de limpiar»:

1. **El sondeo del servidor va antes de cargar nada.** Si no hay con qué probar, no se
   ensucia la base: no hay veneno que retirar y el veredicto 2 es inofensivo por
   construcción, no por cuidado.
2. **`sinVeredicto()` lanza, no sale.** El `process.exit()` quedó fuera de todo `try`,
   en un único sitio al final del guion, así que el `finally` siempre corre.
3. **La limpieza se comprueba, no se supone.** Después de aplicar el `.sql` de limpieza,
   el guardián consulta la base y confirma que la fila 900, sus alternativas y el ícono
   quedaron como estaban. Si no, hay un cuarto veredicto —`BASE SUCIA`, código 3— que lo
   dice a gritos y explica cómo retirarlo a mano. Y si no se pudo **preguntar**, dice eso
   y no afirma que esté limpia: es la distinción de H-013 aplicada a su propia limpieza.

**Reglas que deja.**

- **Un `finally` no garantiza nada si en el mismo bloque hay un `process.exit()`.** Vale
  para cualquier guion futuro de este proyecto que tenga que deshacer lo que hizo.
- **Limpiar no es lo mismo que estar limpio.** Lo primero es haber lanzado un comando; lo
  segundo es un hecho sobre la base, y se comprueba preguntándole a la base. Es la misma
  diferencia entre «enganche declarado» y «enganche vivo» que costó un día en H-014.
- **Una prueba que ensucia el entorno tiene que dejar peor rastro que el que borra.** Si
  el fallo de la prueba se disfraza de fallo del sitio, la prueba pasa a costar más de lo
  que protege.

### H-018 · El respaldo no se activaba si el que contestaba devolvía un error en JSON ajeno
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 22 · **Fecha:** 2026-09-05

**Síntoma.** Provocando la caída de la capa de datos con `npm run serve:dist` —el sitio
servido como archivos estáticos, sin funciones—, el cuestionario **no cargó la
instantánea**: dibujó cero preguntas, sin aviso de respaldo, y el pie dijo «No se pudo
contactar la capa de datos». O sea: el respaldo existía, estaba bien generado, el sitio
lo tenía a mano, y no se usó.

**Causa.** El cliente daba por hecho que todo JSON que llegara de `/api/` era **su** JSON.
`servicios/datos.js` filtraba por `content-type` —esa parte estaba bien y su comentario
nombra este mismo escenario— y después leía `usar_respaldo` del cuerpo:

```js
usar_respaldo: Boolean(cuerpo?.error?.usar_respaldo)
```

`serve` mira la cabecera `accept` y responde su 404 en JSON:
`{"error":{"code":"not_found","message":"..."}}`. Ese sobre pasa el filtro de
`content-type`, trae un `error` que no es el nuestro, y no trae `usar_respaldo`.
`Boolean(undefined)` es `false`, así que el sitio concluía **«esto no es un fallo del
servicio»** y se quedaba sin banco y sin respaldo.

Lo afinado del caso es de dónde salía el `false`: no de un error, sino de un valor
ausente convertido a booleano. La expresión se lee como una precaución —«si no lo dice,
no lo asumas»— y en este sentido la precaución estaba al revés.

**Impacto.** El modo degradado de ADR-008 no se activaba ante cualquier intermediario
que conteste JSON sin seguir el contrato de `functions/api/_comun.js`: un servidor de
archivos estáticos, un proxy, la página de error de una plataforma. Es la promesa
central de ADR-008 —que el estudiante no se quede ante una página vacía— fallando
exactamente el día que tenía que cumplirse. Y fallando en silencio: en el camino feliz
todo funciona igual, así que sin provocar la caída no se ve nunca.

**Resolución.** Un sobre que no es el nuestro significa que **no llegamos a la capa de
datos**, y eso ya tenía nombre: `SIN_RESPUESTA`, con `usar_respaldo: true`. Se reconoce
el sobre propio por sus tres marcas —`ok: false`, un `codigo` de texto y un
`usar_respaldo` booleano— y cualquier otra cosa cae en el respaldo. Sólo se lee
`usar_respaldo` de quien lo declara.

**Reglas que deja.**

- **Reconocer el sobre antes de leerlo por dentro.** Vale para todo lo que llegue de
  fuera: comprobar la forma completa antes de creérsela es la regla 2 de H-013, y aquí
  se cobró en el cliente en vez de en un guion.
- **Un valor ausente no es un `false`.** `Boolean(x?.y)` mezcla «dijo que no» con «no
  dijo nada», y son decisiones distintas. Cuando la diferencia decide si se activa un
  respaldo, hay que separarlas a mano.
- **Lo encontró provocar la caída, no leer el código.** El criterio de la iteración 22
  decía «se demuestra provocando la caída» justamente por esto, y el defecto llevaba
  escrito desde la iteración 12 sin que ninguna lectura lo viera.

### H-019 · El generador tapaba el error de wrangler con un fallo de sintaxis propio
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 22 · **Fecha:** 2026-09-05

**Síntoma.** Primera ejecución del generador contra la nube, por el autor, idéntica en
PowerShell y en Git Bash:

```
NO SE PUDO GENERAR *** ESTO NO ES UN APROBADO ***
No pude interpretar la respuesta de wrangler: Unexpected non-whitespace character
after JSON at position 99 (line 5 column 6)
```

**Lo que se pensó primero, y por qué no era eso.** La primera lectura —del autor, y
razonable— fue que el generador manda dos consultas en un solo comando y wrangler
devuelve un documento JSON por cada una, uno detrás de otro. **Comprobado, y no es así:**

- En el código de wrangler hay **una sola** impresión, `logger.log(JSON.stringify(response, null, 2))`
  (`wrangler-dist/cli.js:223739`), y la comparten el camino local y el remoto: `executeSql`
  devuelve un valor y el que manda a imprimir es el mismo para los dos.
- Comprobado también en local con las mismas dos consultas del generador: llega **un
  arreglo con dos bloques**, no dos documentos.

Queda escrito porque la hipótesis era plausible y habría llevado a escribir un
interpretador de varios documentos que no hacía falta, dejando el defecto real dentro.

**Causa.** Con `--json`, wrangler tiene **dos formas legítimas de respuesta y las dos
salen por la salida normal**: el arreglo de resultados cuando la consulta funciona, y un
objeto de error cuando no. Lo segundo, reproducido en local:

```
$ wrangler d1 execute … --local --json --command="SELECT id FROM tabla_que_no_existe;"
{
  "error": {
    "text": "no such table: tabla_que_no_existe: SQLITE_ERROR"
  }
}
```

El generador conocía sólo la primera forma. Y para encontrarla hacía algo que parecía
prudente y no lo era: **empezar a interpretar desde el primer `[` de la salida.** Contra
la nube el fallo llega como `APIError`, que además de `text` trae `notes`, que es un
**arreglo**; ese `[` es el primero de la salida, así que el interpretador arrancaba
dentro del error, se comía el arreglo de notas y reventaba en la coma siguiente.
Reproducido con un sobre de `APIError` armado igual que el de `cli.js:223743`:

```
primer [ en la posicion 111 -> cae dentro de notes
ERROR: Unexpected non-whitespace character after JSON at position 77 (line 5 column 6)
```

**La misma línea y la misma columna que reportó el autor.** La posición difiere sólo
porque el texto de la nota no es idéntico.

**Impacto.** Ninguno sobre los datos: el guion falló bien —no escribió nada y dejó
intacta la instantánea anterior—. El daño fue de otro tipo y es el que importa: **el
mensaje que explicaba todo se perdió.** Lo que wrangler había dicho era `no such table:
…`, es decir «esa base no tiene el esquema», que es exactamente el diagnóstico; lo que
llegó a la pantalla fue un error de sintaxis sobre un carácter en la posición 99. Es la
familia de H-013 —un envoltorio que anuncia su propio fallo como si fuera del sistema—
cometida otra vez, en un envoltorio nuevo, después de haberla catalogado.

**Resolución.**

1. **Se interpreta la salida entera**, no desde el primer corchete. Con `--json`
   wrangler baja su propio nivel de registro, así que la salida normal trae un único
   documento y nada más: buscar dónde empieza era resolver un problema que no existía.
2. **Se reconoce el sobre de error** y se muestra su `text` y todas sus `notes` como lo
   primero de la pantalla, antes del párrafo de siempre. Con una pista añadida: si dice
   «no such table», esa base todavía no tiene el esquema.
3. **Si no se entiende nada, se muestra crudo lo que wrangler dijo** por las dos salidas.
   Antes, en ese camino sólo se veía el mensaje de la excepción.

Reproducido de punta a punta borrando la vista `pregunta_activa` de la base local:
`no such table: pregunta_activa: SQLITE_ERROR`, con su pista. Vista repuesta después
desde la migración, y comprobado que vuelve a devolver las 8 activas.

**Reglas que deja.**

- **Un envoltorio tiene que conocer todas las formas en que su herramienta puede
  contestar, y la forma del error es una de ellas.** Se conocía la buena y se dio por
  hecho que no había otra.
- **No se empieza a interpretar «desde donde parezca que empieza».** Buscar el primer
  corchete es adivinar; si la respuesta viene de una herramienta que documenta su
  formato, se interpreta entera o no se interpreta.
- **Y la que más cuesta: se prueban los fallos que la herramienta puede entregar, no
  sólo los que uno inventa.** El generador se entregó con «tres veredictos provocados»,
  y los tres eran situaciones inventadas por mí —banco vacío, instantánea que se
  pisaría—. **La consulta que falla no la probé ni una vez, y era reproducible en local
  desde el primer día.** No fue que las pruebas locales no pudieran ver esto: fue que no
  se hicieron.

### H-020 · `package.json` no declara `"type": "module"`, y Node reinterpreta cada módulo del sitio
**Gravedad:** 🟡 · **Estado:** ⚪ Abierto · **Detectado en:** iteración 22 · **Fecha:** 2026-09-05

**Síntoma.** Todo guion de Node que importa código del sitio imprime, antes de su
salida real:

```
(node:21288) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///…/functions/api/preguntas.js
is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to …\package.json
```

Aparece en las dos corridas del generador contra la nube, en PowerShell y en Git Bash,
y también en el guardián del escapado.

**Causa.** El proyecto escribe **módulos ES** en todas partes: las páginas los cargan con
`<script type="module">`, los guiones usan `import`, y la capa de datos también. Pero
`package.json` no lo declara, así que para Node cada archivo `.js` es CommonJS **hasta
que se demuestre lo contrario**: intenta interpretarlo como tal, falla, detecta sintaxis
de módulo y lo vuelve a interpretar. El aviso es Node diciendo que hizo el trabajo dos
veces.

Es una **inconsistencia entre lo que el proyecto es y lo que declara ser**: se decidió
JavaScript ES6+ con módulos ES como stack (CLAUDE.md, y sin ADR que lo contradiga), y el
archivo que anuncia el paquete sigue sin decirlo.

**Impacto.** Ninguno sobre el sitio: el navegador no mira `package.json`, y Cloudflare
compila `functions/` por su cuenta. Sólo afecta a los guiones que corren en Node —el
guardián del escapado y el generador de la instantánea— y el costo directo es una
segunda pasada de análisis por archivo importado, que es despreciable.

**El impacto real es otro, y es el que justifica anotarlo:** es un aviso que sale
**siempre**, encima de la salida de dos guardianes cuyo valor depende de que su salida se
lea. Este proyecto ya tiene catalogado ese daño —H-012, y la regla de que un aviso que
aparece en cada corrida enseña a ignorar los avisos—. Un veredicto importante escondido
detrás de cuatro líneas de ruido rutinario es exactamente la forma en que se dejan de
leer los veredictos.

**Propuesta.** Adoptar en la declaración lo que ya se practica en el código:

1. Añadir `"type": "module"` a `package.json`.
2. Renombrar `tailwind.config.js` a **`tailwind.config.cjs`**. Es el **único** archivo
   CommonJS del proyecto —comprobado el 2026-09-05 buscando `module.exports` y `require(`
   en la raíz y en `scripts/`— y bajo `"type": "module"` dejaría de cargarse. Tailwind
   3.4 descubre `tailwind.config.cjs` por su cuenta, y ningún comando del proyecto lo
   nombra con `--config`: sólo lo menciona `README.md`, en el árbol de archivos, que hay
   que actualizar en la misma pasada.
3. Los `scripts/*.mjs` no se tocan: la extensión ya declara lo que son.

**Cómo se comprueba que quedó bien.** `npm run build`, `npm run verificar` y
`npm run probar:escapado` corren sin el aviso y con los mismos veredictos que antes. Si
Tailwind no encontrara su configuración, el CSS saldría sin la paleta del proyecto y
`verificar` lo vería como un desfase: el fallo sería ruidoso, no silencioso.

**Por qué no se hizo al detectarlo.** Queda fuera del alcance de la iteración 22 —toca la
construcción, no la persistencia de preguntas— y el autor pidió expresamente no tocarlo
en esa iteración. Anotado también en el registro.

### H-021 · RETIRADO · No era un hallazgo, era una medición mal hecha
**Gravedad:** — · **Estado:** ❌ Retirado el mismo día · **Detectado en:** iteración 23 · **Fecha:** 2026-09-08

**Lo que se afirmó, y es falso.** Que `wrangler d1 execute` terminaba con **código de
salida 0** llevando un `[ERROR]` dentro de su salida, sin haber aplicado nada.

**Por qué se afirmó.** La medición fue así:

```
node .../wrangler.js d1 execute ... --file=... 2>&1 | tail -12
echo "codigo de salida de wrangler: $?"
```

`$?` después de una tubería devuelve el código del **último** comando de la tubería. Lo
que se midió fue `tail`, que efectivamente termina en 0 casi siempre. Wrangler nunca dijo 0.

**Lo que hace wrangler de verdad**, medido sin tubería, capturando el código directo:

| Caso | Código |
|---|---|
| `BEGIN TRANSACTION` rechazado por D1 | **1** |
| `UNIQUE constraint failed` | **1** |
| Consulta correcta | **0** |

Es el comportamiento correcto y esperable. No hay nada que arreglar ni que documentar
como defecto.

**Por qué queda escrito en vez de borrado.** La trampa es real y es del tipo que este
proyecto ya persigue: **H-011**, **H-013** y **H-016** giran los tres alrededor de códigos
de salida mal interpretados. Este suma un cuarto filo que no estaba anotado: **`$?` no
mide lo que uno cree cuando hay una tubería de por medio**, y una medición mal hecha
produce un hallazgo con toda la apariencia de estar comprobado —con su salida pegada, su
fecha y su número— que después se cita como si fuera cierto. Se detectó porque al
reproducirlo para la evidencia de la iteración 23 el número no volvió a salir.

**Lo que NO cambia.** `scripts/administrar-banco.mjs` sigue sin fiarse del código de
salida de wrangler: interpreta lo que dijo y vuelve a preguntarle a la base. Eso lo
justifica **H-016**, que está comprobado por el autor contra la nube y no depende de esta
retirada.

### H-022 · Los dos extremos se contradijeron sobre el mismo hecho, y el que mentía era el de diagnóstico
**Gravedad:** 🔴 · **Estado:** 🟢 Cerrado · **Detectado en:** iteración 24 · **Fecha:** 2026-09-09

**Síntoma.** Con el esquema recién aplicado en producción y el banco todavía en cero,
sobre el sitio publicado y en el mismo minuto:

```
/api/preguntas   200 · datos [] · meta.vacio TRUE  · filas_leidas 1
/api/estado      200 · consulta_d1 «correcta»      · meta.vacio FALSE
```

Comprobado en las **dos direcciones**: el alias del despliegue
`2934ad82.examen-certificacion-td-js.pages.dev` y la canónica
`examen-certificacion-td-js.pages.dev`, con resultado idéntico. Se repitió en la
canónica a propósito, porque un alias puede quedar apuntando a un despliegue viejo y
una evidencia tomada sólo del alias no prueba qué está sirviendo el sitio.

**Causa.** `respuestaOk()` calculaba `meta.vacio` así:

```js
const vacio = Array.isArray(datos) ? datos.length === 0 : datos == null;
```

`/api/estado` entrega un **objeto**, no una lista. Un objeto no es un arreglo y no es
nulo, así que esa expresión daba **`false` siempre**, pasara lo que pasara con el
banco. El campo no medía nada y aun así se leía como una medición.

**Por qué es más grave que el punto ciego que ya estaba anotado.** El punto ciego
—`SELECT 1` no puede fallar— hacía que `/api/estado` **callara** un problema. Esto
hacía que lo **negara**. Y lo negaba en el único extremo al que alguien acude
justamente cuando sospecha que algo anda mal: un diagnóstico que calla es inútil, uno
que afirma lo contrario de la verdad es peor que no tenerlo, porque quien lo consulta
se va tranquilo.

**Corrección.** Dos cambios, ninguno cosmético:

1. `functions/api/_comun.js` · **`meta.vacio` sólo aparece cuando `datos` es una
   lista.** Se quita el campo en vez de darle otro valor: un extremo que no entrega
   una lista no tiene por qué opinar sobre listas.
2. `functions/api/estado.js` · reescrito. Pregunta dos cosas —`SELECT 1` para saber
   si D1 contesta, y `SELECT COUNT(*) FROM pregunta_activa` para saber si el esquema
   está y cuánto hay—, y responde con `preguntas_activas` y `banco_vacio` **contados
   de la misma vista de la que come el sitio**. La primera consulta se conserva
   aunque parezca redundante: es la única que distingue «la base no contesta» de «la
   base contesta pero le falta el esquema». Se añadió el código `SIN_ESQUEMA` para
   ese segundo caso.

**Comprobado provocando los tres estados**, contra la base local, el 2026-09-09:

| Estado de la base | `/api/preguntas` | `/api/estado` |
|---|---|---|
| Sin esquema | `503` `FALLO_CONSULTA` | `503` **`SIN_ESQUEMA`** (antes: `200` «correcta») |
| Con esquema, banco en 0 | `200` `vacio: true` | `200` `preguntas_activas: 0`, **`banco_vacio: true`** (antes: `vacio: false`) |
| Con esquema, banco con 8 | `200` `vacio: false` | `200` `preguntas_activas: 8`, **`banco_vacio: false`** |

Los dos extremos coinciden en los tres. Y `banco_vacio` cambia de valor, que es lo
que lo separa de una constante disfrazada.

**La lección, que es de método y no de este extremo.** Un campo calculado a partir de
la **forma** del dato en vez de su **contenido** puede quedar clavado en un valor sin
que nada avise. Este llevaba desde la iteración 12 diciendo `false` y nadie lo miró,
porque hasta que hubo un banco vacío de verdad, `false` era la respuesta correcta por
casualidad.

### H-023 · PATRON · Tres comprobaciones que nunca habian dicho «no» resultaron no poder decirlo
**Gravedad:** 🔴 · **Estado:** 🟢 Regla adoptada · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09

**Esto no es un hallazgo suelto: es el tercero del mismo patrón**, y por eso se anota
como patrón. Anotarlo otra vez como incidente aislado sería perder justamente lo que
tienen en común.

**Los tres casos.**

| Cuándo | La comprobación | Por qué no podía fallar |
|---|---|---|
| Iteración 24 · H-022 | `meta.vacio` en `/api/estado` | Se calculaba sobre la **forma** del dato —`Array.isArray(datos)`— y ese extremo entrega un objeto. Daba `false` **siempre**, desde la iteración 12 |
| Iteración 23 | Las nueve restricciones del esquema | Estaban declaradas en el SQL y **nadie les había hecho rechazar nada**. Se creía en ellas por leerlas |
| Iteración 25 · éste | El filtro de retiradas del comprobador de conversión | `r.modulo === modulo`, y `retiradas.json` escribe `2` en el banco nuevo y `"Módulo 2"` en el viejo. Miraba **1 de 3** e informaba «ninguna colada» |

**Lo que los tres comparten, y es lo único que importa.** Ninguno fallaba. Los tres
llevaban tiempo diciendo que sí, y en los tres casos ese «sí» no era el resultado de
una comprobación: era el **único resultado que la comprobación podía dar**. Una
comprobación que siempre pasa y una comprobación que no existe se ven idénticas desde
afuera, y la que siempre pasa es peor, porque además tranquiliza.

**El caso de esta iteración, en detalle.** El comprobador de conversión informaba
`retiradas del modulo 1 · comprobadas, ninguna colada`. El módulo 2 tiene **tres**
retiradas: una del banco nuevo y dos del viejo. Las del banco viejo no sólo escriben
el módulo distinto —`"Módulo 2"` en vez de `2`—, **tampoco traen `numero`**: se
identifican por `posicion_original`. El filtro las descartaba a las tres sin decir
nada, porque descartar no es fallar.

Se detectó **al leer el número**, no al correr una prueba: 1 no cuadraba con lo que la
sección de retiros del archivo de la iteración decía del módulo 2.

**Corregido:** el número de módulo se normaliza venga como venga, el informe declara
las retiradas **por banco** —`1 json_2026 + 2 js_2026`, donde un desbalance se ve— y
se añadió la comprobación fuerte: cada hueco de numeración de `modulo-0N.json` tiene
que corresponder a una retirada, y ningún número retirado puede seguir presente.

## La regla que sale de esto

> **Toda comprobación nueva hay que hacerla fallar antes de creerle.**

No «probarla»: **hacerla fallar**. Verla decir «no» al menos una vez, provocándolo. Si
no se puede provocar que diga «no», no es una comprobación: es una afirmación con
forma de comprobación.

Es la generalización de lo que la iteración 25 ya adoptó como criterio de nivel 0 para
el comprobador de conversión —los cuatro sabotajes— y de lo que la iteración 23 hizo
con `probar-restricciones.mjs`. Lo que cambia aquí es que **deja de ser una buena
práctica de dos guiones concretos y pasa a ser regla del proyecto**.

**Su consecuencia incómoda, dicha para que no sorprenda:** escribir la comprobación
cuesta menos que escribir su fallo. La tentación va a ser dar por buena la que
«claramente funciona», y los tres casos de arriba claramente funcionaban.

### H-024 · El texto de wrangler podía vetar a la base, y la base era la única que sabía
**Gravedad:** 🔴 · **Estado:** 🟢 Cerrado · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09

**Síntoma.** La primera carga real del banco —52 preguntas del módulo 2 en producción—
terminó en `SIN VEREDICTO`, código 2, con este mensaje:

```
Wrangler no dijo que hubiera aplicado nada, pero tampoco dio un error.
```

**Y había aplicado.** En la misma salida, dos líneas más abajo, wrangler decía
`Executed 260 queries in 20.70ms (728 rows read, 884 rows written)`, `"success": true`
y `changed_db: true`. Los cotejos posteriores contra la base lo confirmaron: 39
`json_2026` y 13 `js_2026`, las 52 en `activa`.

**Causa inmediata: wrangler tiene dos caminos de escritura y el guion conocía uno.**

| Camino | Cuándo | Qué imprime |
|---|---|---|
| Archivo chico | Lotes pequeños | `Executed 3 commands executed successfully.` |
| Importación | Archivos grandes | `Starting import…` · `Processed 260 queries.` · `Executed 260 queries…` |

El patrón era `/commands? executed successfully/i`. El camino de importación dice
**«queries»**, nunca «commands», y nunca «executed successfully».

**Por qué nunca había salido.** La herramienta se construyó y se verificó en la
iteración 23 contra lotes de 3 a 10 preguntas de juguete. **Todos tomaron el camino de
archivo chico.** El camino de importación no se había ejecutado ni una vez hasta la
primera carga de verdad. No es que la prueba fallara: es que esa rama nunca se corrió.

**Causa de fondo, que es la que importa.** El patrón corto era el defecto pequeño. El
grande era **dónde estaba puesto**:

```js
if (!dijoExito) {
  sinVeredicto('Wrangler no dijo que hubiera aplicado nada...');
}

// ...la consulta a la base venía DESPUES, y no se alcanzaba nunca
const despues = consultar('SELECT COUNT(*) AS preguntas FROM pregunta;');
```

La cabecera del propio archivo declaraba que el veredicto salía de dos fuentes —lo que
wrangler dijo **y** una consulta a la base—. La implementación convertía la primera en
**portón** de la segunda: cuando el texto no se reconocía, el guion **se declaraba
incapaz sin haberle preguntado a la única fuente que podía responderle.**

Es el mismo error de forma que H-019, donde el generador conocía una sola de las dos
respuestas de wrangler; pero con un agravante propio, porque aquí existía un testigo
autoritativo —la base— y el diseño lo dejaba fuera de alcance precisamente en el caso
en que hacía falta.

**Corrección.** Dos cambios, y el segundo es el que vale:

1. El patrón reconoce los dos caminos: `Executed \d+ (?:commands?|queries)`.
2. **La consulta a la base se hace SIEMPRE.** El texto pasó de condición a señal: si no
   se reconoce pero la base cuadra, el veredicto es `HECHO` y se informa que el patrón
   se quedó corto. Se añadió además un `NO SE APLICO` explícito para el caso de que la
   base no haya cambiado nada, que antes se confundía con los demás.

**Comprobado provocando los tres casos contra la D1 local**, que toma el mismo camino
de importación, el 2026-09-09:

| Provocado | Antes | Ahora |
|---|---|---|
| 52 preguntas sobre base vacía | `SIN VEREDICTO` | `HECHO` · `0 -> 52` |
| El mismo lote otra vez | `NO SE APLICO` | `NO SE APLICO` · enunciado repetido, base intacta en 52 |
| Patrón forzado a no reconocer nada | `SIN VEREDICTO` | `HECHO` + «no reconocí el texto, pero la base cuadra y manda ella» |

La tercera fila es la que prueba el arreglo de fondo, y se produjo **rompiendo el
patrón a propósito** en una copia del guion, por la regla de H-023.

**La lección, y no es sobre wrangler.** Un guion que consulta dos fuentes tiene que
dejar que la **más autoritativa** hable siempre. Poner la débil como condición de la
fuerte convierte «no supe leer» en «no se puede saber», que son cosas distintas y la
segunda es falsa. Aquí la base estaba a una consulta de distancia, sabía la respuesta,
y no se le preguntó.

**Actualización del 2026-09-09 · los dos caminos no se separan por tamaño sino por
destino, y una de las frases de arriba está mal.**

Al ir a comprobar la atomicidad por el camino de importación resultó que la línea
«comprobado provocando los tres casos contra la D1 local, **que toma el mismo camino de
importación**» es **falsa**, y con ella los encabezados de la tabla de caminos.

Lo que hace wrangler 4.128.0, leído en su código y **provocado después**:

| Comando | Camino | Qué imprime |
|---|---|---|
| `--local --file` | `db.batch()` contra miniflare, **siempre** | `N commands executed successfully.` |
| el mismo con el flag de la nube | API de importación de D1, **siempre** | `Starting import` · `Processed N queries` · `Executed N queries…` |

**No hay umbral de tamaño en ninguno de los dos.** `executeRemotely` entra en la
importación con un `if (input.file)` que no mira cuánto pesa el archivo; `executeLocally`
no tiene esa rama siquiera. Provocado el 2026-09-09 con archivos de **260 y de 2000
sentencias** contra la base local: los dos respondieron `commands executed successfully`,
ninguno dijo `queries`.

**Qué cambia esto de lo ya escrito, y qué no.** El diagnóstico de fondo de H-024 queda
entero: el patrón corto era real, el portón era real, y la tercera fila de su tabla
—romper el patrón a propósito— probó el arreglo estructural sin depender de ningún
camino. Lo que cambia es la explicación de **por qué nunca había salido**: no fue porque
los lotes de la iteración 23 fueran chicos, sino porque **todos fueron locales**. La
herramienta escribe siempre a un archivo, así que la primera escritura contra la nube que
hiciera —de una pregunta o de cincuenta— iba a tomar la importación igual.

Y deja una consecuencia que pesa más que la corrección: **el camino de importación no se
puede ensayar contra la base local.** Ver H-025.

### H-025 · La atomicidad está comprobada en un camino, y el otro no se puede ensayar en local
**Gravedad:** 🟠 · **Estado:** 🟢 Cerrado · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09 · **Cerrado el:** 2026-09-09

**Síntoma.** Los criterios de la iteración 23 que dependen de cómo se comporta wrangler
se cerraron contra la base **local**, o sea contra `db.batch()`. Las seis cargas que
quedan van contra la nube, o sea contra la **importación**, y ahí «todo o nada» no está
provocado ni una vez.

**Lo que sí quedó comprobado el 2026-09-09**, contra la base local, con lotes grandes,
comparando el **contenido** campo a campo antes y después —volcado de las trece columnas
de `pregunta` y las seis de `alternativa`, ordenado y resumido— y no el mensaje de la
herramienta:

| Provocado | Sentencias | Dónde revienta | Base antes | Base después |
|---|---|---|---|---|
| `insertar` 52 preguntas, la **26** choca contra `UNIQUE (enunciado)` | 260 | 126 de 260 | `d97744cee214202c` · 10 preg / 40 alt | **idéntica** |
| `insertar` 52, la que choca es la **última** | 260 | 256 de 260 | `d97744cee214202c` | **idéntica** |
| `actualizar` 52, choca la 26; cada una borra sus alternativas antes de reinsertarlas | 312 | 151 de 312, con 25 `DELETE` ya emitidos delante | `7c2544c0055084c3` · 62 preg / 248 alt | **idéntica** |
| `insertar` 52 **sin sabotear**, de control | 260 | — | `d97744cee214202c` | **distinta**: 260 filas nuevas, 0 perdidas |

La cuarta fila está puesta a propósito, por la regla de H-023: el cotejo tenía que decir
«distinto» al menos una vez antes de que sus tres «idéntica» valieran algo.

**Qué sube esto respecto de la iteración 23.** Allá el todo o nada se demostró con un
lote de tres, o sea unas quince sentencias, y con la mala **al medio**. Ahora está
demostrado con 312 sentencias y con la mala **al final**, que era el hueco real: un
choque en las primeras sentencias no demuestra atomicidad, porque no había nada que
deshacer. Y cubre la forma peligrosa —el `DELETE` seguido de `INSERT` de `actualizar`—,
donde una aplicación parcial no dejaría filas de más sino preguntas **sin ninguna
alternativa**, que es un daño bastante más difícil de ver.

**Lo que sigue sin estar comprobado, y no se puede comprobar desde aquí.** Que la
importación deshaga un lote a medias. El único testigo disponible hoy es una frase que
imprime el propio wrangler antes de subir el archivo:

> Note: if the execution fails to complete, your DB will return to its original state
> and you can safely retry.

Es una promesa del proveedor, no una comprobación. Por la regla de H-023 no cuenta:
nadie la ha hecho decir «no».

**Los otros criterios de la 23, separados por si el camino los toca o no.**

| Criterio de la 23 | ¿Depende del camino? | Estado real |
|---|---|---|
| Todo o nada | **Sí** | Local con 312 sentencias ✅ · importación ⚪ |
| Colisión sin sobrescritura · Errores traducidos | **Sí** | La tabla de traducciones busca el texto de SQLite (`UNIQUE constraint failed: pregunta.enunciado`). En la importación el mensaje llega desde el servidor de D1 en `response.errors`, y **nadie lo ha visto**. Si no trae ese texto, la herramienta cae en «no supo traducir el motivo» y muestra el crudo: se degrada con honestidad, pero se degrada |
| Lote completo | Sí | **Ya cerrado en la importación** por el propio incidente de H-024: 52 entraron y la base las contó |
| El éxito no lo decide el código de salida (H-016) | Ya no | Desde el arreglo de H-024 decide el conteo de la base, que es la misma consulta en los dos caminos |
| Instantánea al día | Sí, pero por el lado de **lectura** | Es el tramo que ADR-023 dejó pendiente y que toca ahora |
| Validación previa · barrera de ADR-015 · wrangler de `node_modules` · el JSON no es la fuente | No | Todo eso ocurre **antes** de que wrangler arranque |
| Las restricciones se prueban solas | No | Son restricciones del esquema, y el esquema es el mismo en las dos bases |

**Impacto.** Quedan seis cargas de 40 a 60 preguntas por el camino no ensayado. Si la
importación no fuera atómica, el modo de fallo sería un lote a medias en la nube. La
herramienta lo **detectaría** —el conteo no cuadraría y respondería `SIN VEREDICTO`—,
pero detectar no es reparar, y averiguar a mano cuál entró y cuál no es exactamente el
trabajo que ADR-025 venía a evitar.

**Propuesta.** Un ensayo contra la base de **pruebas** de la nube, nunca la publicada, que
lo corre el autor porque Claude Code no ejecuta wrangler contra la cuenta (ADR-015).
Escrito paso a paso, con la salida esperada de cada comando, en
`90-manual/ensayo-del-camino-de-importacion.md`. Sus dos instrumentos —
`scripts/volcar-contenido.mjs` y `scripts/armar-lote-de-ensayo.mjs`— se probaron contra la
base local el 2026-09-09, incluidos sus rechazos: base no declarada, uuid que no calza
—provocado rompiendo una copia del guion—, base sin preguntas contra la que chocar, y base
sin módulos.

**Un dato de costo que apareció de paso.** `actualizar` resuelve el id de cada pregunta
con una consulta propia **antes** de escribir, y cada consulta levanta un proceso de
wrangler. Con 52 preguntas eso son 52 arranques: **148 segundos en local**, medidos. En
la nube cada uno es además un viaje de red. No afecta a las seis cargas que vienen,
porque son `insertar` y ese verbo no resuelve nada, pero una corrección masiva por
`actualizar` va a doler. Anotado en `registro_log.md`, sin asignar.

**Resultado · 2026-09-09 · LA IMPORTACIÓN DE D1 ES ATÓMICA.**

Ensayo corrido por el autor contra `examen-td-js-pruebas`, sobre una base que ya tenía
contenido —10 preguntas y 40 alternativas—, con el procedimiento de
`90-manual/ensayo-del-camino-de-importacion.md`. Salida literal:

```
01-antes    fb6908910e0ac450   10 preguntas · 40 alternativas
carga       NO SE APLICO · UNIQUE constraint failed: pregunta.enunciado
            revento en la 256 de 260, con 255 sentencias ya emitidas
02-despues  fb6908910e0ac450
diff        >>> IDENTICAS · cero lineas
03-final    fb6908910e0ac450 · >>> DEVUELTA A COMO ESTABA
```

No hubo que limpiar nada porque no entró nada. No hizo falta sembrar.

**255 sentencias emitidas antes del choque, y ninguna sobrevivió.** El veredicto sale de
comparar el contenido de la base antes y después, no del mensaje de la herramienta, que
es la capa que ya mintió una vez (H-024). La nota gris que imprime wrangler —«your DB
will return to its original state»— dejó de ser una promesa del proveedor y pasó a ser
una comprobación.

**Dos incógnitas más, resueltas de paso.**

1. **La traducción funciona igual por el camino de importación.** El error que devuelve la
   nube **sí trae** el texto de SQLite, así que la herramienta lo tradujo al castellano en
   vez de caer en «no supo traducir el motivo». Era el primero de los tres desenlaces
   previstos, y es el bueno: la tabla de traducciones no necesita entradas nuevas.
2. **El defecto de H-019 en `administrar-banco.mjs` NO se manifestó.** No apareció «No
   pude interpretar lo que devolvio la base». Queda anotado como **no observado, no como
   inexistente**: el guion sigue buscando el primer `[` de la salida, que es el defecto
   que `generar-instantanea.mjs` ya corrigió, y en este ensayo simplemente no salió. No se
   provocó. La distinción importa porque es exactamente el filo de H-023: una comprobación
   que no dijo «no» no es lo mismo que una que no puede decirlo, y aquí ni siquiera hubo
   comprobación.

**Qué cambia esto en los criterios de la iteración 23.** La tabla de más arriba —«los
otros criterios de la 23, separados por si el camino los toca o no»— queda así después del
ensayo:

| Criterio de la 23 | Antes del ensayo | Después |
|---|---|---|
| Todo o nada | Local con 312 sentencias ✅ · importación ⚪ | ✅ **por los dos caminos**, y en la importación con 255 sentencias emitidas delante del choque |
| Colisión sin sobrescritura · Errores traducidos | El mensaje de la importación no lo había visto nadie | ✅ trae el texto de SQLite y se traduce igual |
| Lote completo | ✅ por el incidente de H-024 | Sin cambio |
| El resto | No dependían del camino | Sin cambio |

Ninguno de esos criterios estaba mal cerrado en la 23: estaban cerrados sobre la evidencia
que existía entonces. Lo que cambia es que ahora la evidencia cubre los dos caminos, y eso
queda dicho aquí en vez de suponerse.

### H-026 · La salida de una carga no se podía guardar en un archivo, y el archivo mentía
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09

**Síntoma.** Redirigiendo la salida de `administrar-banco.mjs` a un archivo, el archivo
queda con **una sola línea**:

```
node scripts/administrar-banco.mjs revisar ... > archivo.txt 2>&1
→ stdout is not a tty
```

Lo mismo canalizando a `grep`. Y no es sólo la salida: **el guion no llega a ejecutarse**.
Comprobado por el autor durante el ensayo de H-025, con el volcado posterior confirmando
que la base seguía en `fb6908910e0ac450`.

**Causa, y no es la que parecía.** El guion no tiene nada que ver. Comprobado el
2026-09-09 corriendo el mismo comando redirigido desde otro terminal: escribió **537
líneas** y devolvió código 0. Todo lo que imprime pasa por `console.log`, que no consulta
si hay terminal al otro lado.

El mensaje es de **winpty**, el envoltorio que Git Bash usa en Windows para que los
programas interactivos se vean bien. Provocado aparte para dejarlo demostrado y no
deducido:

```
winpty node -e "console.log('esto tendria que llegar al archivo')" > archivo.txt 2>&1
→ codigo 1, y el archivo contiene una sola linea: "stdin is not a tty"
```

Winpty se planta **antes** de lanzar el proceso. Por eso no se ejecutó nada.

Es el mismo filo de **H-011**: el mismo comando se comporta distinto según desde qué
terminal se lance. Y es la cuarta vez que este proyecto confunde el mensajero con el
mensaje —H-011, H-013, H-016, H-019—, esta vez con el agravante de que la atribución
inicial apuntaba al guion, que era inocente.

**Impacto, que es real aunque la causa fuera otra.** Capturar evidencia es medio proyecto,
y hasta hoy la salida de una carga **no se podía guardar en un archivo de forma fiable**.
Cualquier registro automático era imposible. Y el modo de fallo es de los malos: ruidoso
en pantalla, **silencioso en el archivo**. Quien abra después un archivo de una línea puede
leerlo como «la carga corrió y dijo poco».

**Resolución.** `--registro=<archivo>` en `administrar-banco.mjs`. La salida la escribe el
propio guion, así que deja de depender de cómo lo invocaron —que es la lección de H-011:
el proyecto no puede depender de la configuración de un terminal—. Tres propiedades, y las
tres son contra el fallo silencioso:

- El registro **empieza con cabecera** —fecha y argumentos— y **termina con una línea de
  cierre** que nombra el veredicto y el código. Un registro sin esa línea está truncado, y
  se ve al abrirlo.
- Si el guion no arranca, el archivo **no existe**. Un archivo ausente es más ruidoso que
  uno de una línea.
- Si el registro no se puede abrir, **no se hace nada**: `NO SE APLICO · no pude abrir el
  registro`, código 1. Quien pidió registro lo pidió para tener evidencia, y correr una
  carga sin la evidencia pedida es peor que no correrla. Provocado apuntando `--registro`
  a una carpeta, y comprobado que la base no se tocó.

Probado el 2026-09-09 en los tres casos: un `revisar` (542 líneas, cierre `REVISADO ·
codigo 0`), una carga fallida con la salida mandada a `/dev/null` —el registro la recogió
igual, con el `UNIQUE constraint failed` y el cierre `NO SE APLICO · codigo 1`—, y el
rechazo del registro imposible de abrir.

**Lo que queda pendiente, dicho para que no se dé por hecho.** Que `--registro` funcione
bajo winpty **no está provocado**: no se pudo reproducir el escenario de winpty desde el
terminal en que se hizo el arreglo. El razonamiento es que sin redirección winpty no tiene
nada que objetar, pero es razonamiento, no evidencia. Lo cierra el autor la primera vez
que lo use en su terminal.

---

### H-027 · PATRON, cuarta vez · La comprobación de retiradas miraba un campo que no existe

**Gravedad:** 🔴 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09

**Síntoma.** Ninguno. Ese es el problema, y es exactamente el de H-023.

`scripts/comprobar-carga.mjs` —el comprobador que contrasta lo cargado en D1 contra los
bancos de origen— informaba «retiradas del módulo 3, ninguna en la base» en todas sus
corridas. La cifra era correcta y la conclusión no medía nada.

**Causa.** Una entrada de `retiradas.json` **no trae el enunciado en el primer nivel**:
trae la pregunta original entera anidada bajo `pregunta`, y dentro va `enunciado` si viene
del banco nuevo y `q` si viene del viejo. El bloque leía `r.enunciado ?? r.q` sobre la
entrada, no sobre `r.pregunta`, así que obtenía `undefined` **siempre**, salía por el
`continue` de guarda y no comparaba ni una vez.

```
r.enunciado          → undefined     (el texto está en r.pregunta.enunciado)
r.q                  → undefined     (el del banco viejo, en r.pregunta.q)
```

**Cómo apareció.** Escribiendo el sabotaje `--sabotaje=retirada`, que cuela una retirada
en lo leído de la base y exige que el comprobador lo cace. El sabotaje reventó con
`TypeError: Cannot read properties of undefined`, y ese `undefined` era el mismo que la
comprobación de verdad venía tragándose en silencio.

**Es la cuarta vez en este proyecto**, después de las tres de H-023, y la primera en que
la regla adoptada allí —*hacer fallar toda comprobación nueva antes de creerle*— es lo
que la destapa. La comprobación nunca había dicho «no» porque **no podía**; el sabotaje
existe para obligarla, y al obligarla se rompió.

**Corregido**, con dos cosas y no una:

- Se lee `r.pregunta?.enunciado ?? r.pregunta?.q`.
- Una entrada **sin texto donde se lo busca ya no se salta en silencio**: se informa como
  `RETIRADA ILEGIBLE` y cuenta como problema. Si el formato del archivo cambia otra vez,
  la comprobación lo dice en vez de degradarse a nada. Saltarse lo que no se entiende es
  lo que convirtió este bloque en decoración.

**Lo que se descubrió de paso, y obligó a acotar el cotejo.** Se pensó reforzar la
comprobación cotejando también la identidad numérica de cada retirada. **Sirve para el
banco nuevo y no para el viejo:** el nuevo guarda `numero`, que es estable y nunca se
renumeró; el viejo guarda `posicion_original`, que es la posición **anterior** a los
retiros del 2026-09-04, mientras que el `numero_origen` cargado es la posición de hoy, ya
corrida. Cotejar una contra otra habría emparejado preguntas distintas y **acusado en
falso**. Es el mismo desplazamiento que movió la pregunta del orden fijo de la posición 13
a la 11. El cotejo por número quedó sólo para `json_2026`, y dicho por qué en el código.

### La otra cara del mismo defecto, encontrada en el mismo acto

El detector de justificaciones de relleno del mismo guion marcó **ocho justificaciones
legítimas** del módulo 2 como si fueran de relleno. Causa: buscaba las palabras en
cualquier parte del texto y, con la bandera `i`, el patrón `TODO` cazaba la palabra
española **«todo»** —«va todo lo que describe el documento»—.

Los dos defectos son la misma clase de error: **una comprobación que no mide lo que dice
medir.** Una nunca podía decir «no»; la otra decía «no» con material bueno. La segunda es
menos grave y no es inofensiva: un detector que grita con material bueno enseña a
ignorarlo, y así es como pasa el malo.

**Corregido** anclando el patrón al principio del texto —un relleno no *contiene*
«pendiente», *empieza* por ahí, porque no es una frase sobre la pregunta sino una nota
sobre el trabajo que falta— y añadiendo un largo mínimo **medido, no elegido a ojo**: la
justificación más corta de las 52 del módulo 2 tiene 128 caracteres y «Pendiente de
redacción» tiene 22, así que el umbral de 60 no puede rozar una escrita de verdad.

---

### H-028 · El cargador del banco estaba roto en el árbol, y sólo se notaba al usarlo

**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09

**Síntoma.** `node scripts/administrar-banco.mjs insertar <encargo>` no cargaba nada:

```
ReferenceError: abrirRegistro is not defined
    at scripts/administrar-banco.mjs:162
```

**Causa.** El arreglo de H-026 añadió la llamada a `abrirRegistro(...)` y **no añadió su
`import`**. El módulo `scripts/registro-de-salida.mjs` existía y estaba bien; nadie lo
importaba.

**Por qué no se había notado.** Las tres pruebas de H-026 se hicieron sobre `revisar` y
sobre una carga fallida, todas **antes** de que el archivo quedara en su forma final; entre
medio no se volvió a lanzar un `insertar`. El módulo 2 ya estaba cargado, así que nada
volvió a llamar al cargador hasta hoy.

**Impacto.** La herramienta con la que se cargan los seis módulos que faltan estaba
inservible en el árbol de trabajo. Se habría descubierto en el primer intento de cargar el
módulo 3 —el fallo es inmediato y ruidoso, y no toca la base—, pero en medio del
procedimiento de una carga contra producción y no antes.

**Corregido** añadiendo el import. Comprobado cargando las 52 del módulo 2 contra la base
local: `Total en la base: 0 -> 52`, código 0.

**Lección de método.** Un error de referencia en un módulo ES no aparece hasta que se
ejecuta esa línea, y ninguna comprobación del proyecto lanza los verbos de escritura de
`administrar-banco.mjs`. `npm run verificar` mira la barrera, el CSS y el escapado: ninguna
de las tres carga nada. Un guion que sólo se prueba cuando se usa de verdad se rompe en el
peor momento posible.

---

### H-029 · El comprobador de restricciones falló una vez y no se ha vuelto a reproducir

**Gravedad:** 🟠 · **Estado:** 🟡 **Visto una vez, no reproducido, hipótesis sin
confirmar** · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09

**Esto no es un hallazgo resuelto, y no se cierra hasta que alguien lo provoque.** Se
anota con ese estado a propósito, por decisión del autor el 2026-09-09: **un fallo
intermitente en el comprobador de restricciones es de los que vuelven**, y anotarlo
como incidente resuelto sería enterrar la única pista que hay.

**Qué se vio, una vez.** `npm run verificar` informó:

```
RESTRICCION CAIDA  ***  1 de 9 dejaron pasar lo que no debian  ***
  - Indice parcial: una sola correcta por pregunta
```

**Qué se comprobó inmediatamente después, y contradice lo anterior.** El índice existe
en la base local, con su definición correcta:

```
alternativa_una_correcta
CREATE UNIQUE INDEX alternativa_una_correcta
  ON alternativa (pregunta_id) WHERE es_correcta = 1
```

Y `npm run probar:restricciones` por separado dio **las nueve en pie**, con la huella
de la base idéntica antes y después (`7f997037cc020f34`). La corrida completa siguiente
de `npm run verificar` también dio `restricciones OK`. **No se ha vuelto a reproducir.**

**Hipótesis sin confirmar.** Ocurrió justo después de restaurar los archivos
`.sqlite`, `-shm` y `-wal` de la base local copiándolos por encima, para devolver la
base al estado anterior a una prueba. Copiar un `-wal` a nivel de archivo puede dejar
la base en un estado momentáneamente inconsistente con lo que el proceso siguiente
espera leer. **Es una hipótesis: no está provocada, y mientras no lo esté no explica
nada.**

**Por qué importa aunque no se reproduzca.** Este comprobador es de los que sostienen
el resto: `probar:restricciones` es lo que convirtió las nueve restricciones del
esquema de «creídas por leerlas» a «comprobadas», y esa historia está escrita en H-023
como uno de los tres casos del patrón. **Un comprobador que puede dar un falso «caída»
enseña a desconfiar de él, y desconfiar de él es volver al punto de partida.** El modo
de fallo contrario —un falso «en pie»— sería mucho peor y nada dice todavía que sea
imposible.

**Qué haría falta para cerrarlo.** Provocarlo: restaurar la base local por copia de
archivos con el `-wal` incluido y correr el comprobador inmediatamente después,
repetidas veces, a ver si el fallo vuelve. Si vuelve, el arreglo probablemente sea que
el comprobador no dependa de un estado que se puede restaurar por fuera. Si no vuelve,
queda anotado como visto una vez y sin explicar, que es más honesto que cerrarlo.


#### Resultado del intento de provocación · 2026-09-09

**Se intentó provocar, y no se reprodujo. La hipótesis no queda confirmada ni
descartada, y el hallazgo sigue en amarillo — pero ya no en amarillo vacío.**

Corrido con `node scripts/ensayo-local.mjs --provocar-h029=8`, que restaura la base de
las dos maneras y corre `probar:restricciones` después de cada restauración:

```
copiando .sqlite/-shm/-wal   0 fallo(s) de 8
reconstruyendo desde SQL     0 fallo(s) de 8
```

**Ocho vueltas no prueban que no ocurra.** Un fallo que apareció una vez en decenas de
corridas no tiene por qué caer dentro de dieciséis intentos. Lo que este resultado sí
hace es dejar la hipótesis del `-wal` **sin apoyo empírico**: era razonable y sigue
siéndolo, pero hoy no tiene nada detrás salvo la coincidencia temporal.

#### Una hipótesis alternativa, comprobada y descartada

Al matar el experimento por tiempo quedó el andamiaje de `probar-restricciones` en la
base —la pregunta `9001`, con su alternativa correcta—. Pareció la explicación obvia:
una corrida anterior que no limpió, y la siguiente encontrándose el terreno ocupado.

**Se corrió el comprobador con esa fila puesta, a propósito, para verlo.** No es eso:

```
No pude montar el andamiaje.
X [ERROR] UNIQUE constraint failed: pregunta.id
Si la pregunta 9001 ya esta en la base, la dejo una corrida anterior que no limpio.
Nadie comprobo las restricciones. No se sabe si estan o no.
codigo de salida: 2
```

Responde `SIN VEREDICTO`, que es **la respuesta correcta** y además la que el propio
enunciado del andamiaje anticipa. El fallo observado el 2026-09-09 fue otra cosa:
`RESTRICCION CAIDA`, código 1, nombrando el índice parcial.

**Descartar esto vale más que parecer.** Era la explicación más cómoda y habría cerrado
el hallazgo en falso.

#### Qué estado hay que buscar si vuelve, dicho con precisión

Vale la pena dejarlo escrito ahora, mientras el razonamiento está fresco, porque la
próxima vez que aparezca va a ser en medio de otra cosa.

El caso que falló inserta `(9001, 'c', 3, 'una segunda correcta', 1)` y espera que el
índice parcial lo rechace. **Sólo puede pasar si, en ese instante, ninguna otra
alternativa de la 9001 tenía `es_correcta = 1`.** Y el andamiaje inserta precisamente
una, `(9001, 'a', 1, …, 1)`.

Se sigue que en el momento del fallo se daba **una de estas tres**, y ninguna otra:

1. La alternativa `'a'` del andamiaje no estaba, **pese a que el montaje no protestó**.
2. Estaba, pero con `es_correcta` distinto de 1.
3. **El índice `alternativa_una_correcta` no existía en ese momento**, aunque existiera
   al mirarlo después.

La tercera es la que mejor encaja con una base restaurada por copia de archivos: un
`-wal` copiado a medias puede dejar visible una tabla y no un índice creado en la misma
transacción. **Es también la más difícil de provocar a voluntad**, que es probablemente
por qué dieciséis intentos no la tocaron.

**Si vuelve a salir, lo primero que hay que mirar —antes de tocar nada— es si el índice
está**, con `SELECT name FROM sqlite_master WHERE type='index'`. Esa consulta distingue
la tercera de las otras dos, y es la única que deja de poder hacerse en cuanto alguien
«arregla» la base.

#### Y el disparador sospechoso ya no está en el procedimiento

Independientemente de si la hipótesis era buena, **restaurar la base copiando archivos
dejó de ser parte de cómo se trabaja**: `scripts/ensayo-local.mjs` reconstruye el banco
de juguete desde `d1/ejemplo-banco.sql`. Si el `-wal` era la causa, el procedimiento ya
no la produce; si no lo era, no se ha perdido nada.

**Eso no cierra el hallazgo.** Cerrarlo exigiría explicar el fallo, no dejar de rozarlo.



#### Volvió · 2026-09-10 · y la hipótesis que teníamos quedó muerta

**Segunda aparición**, en `npm run verificar`, con el mismo mensaje:
`RESTRICCION CAIDA · Indice parcial: una sola correcta por pregunta`.

**Se corrió el diagnóstico escrito para este momento, antes de tocar nada.** Era la
única consulta que deja de poder hacerse en cuanto alguien «arregla» la base:

```
SELECT name FROM sqlite_master WHERE type='index'
  -> alternativa_una_correcta        EL INDICE ESTABA
  -> pregunta_por_estado_y_modulo
  -> pregunta_reemplazos

SELECT ... FROM pregunta WHERE id >= 9000
  -> (sin filas)                     NO HABIA ANDAMIAJE RESIDUAL
```

Y acto seguido, `npm run probar:restricciones` suelto: **las nueve en pie**, con la
huella de la base idéntica antes y después. La corrida siguiente de
`npm run verificar` completo: **también en pie**.

**Qué queda refutado, que es lo que esta vuelta aporta:**

| Hipótesis | Estado |
|---|---|
| Restaurar copiando `.sqlite`/`-shm`/`-wal` | **REFUTADA.** Esta vez **no hubo ninguna copia de archivos**. La última manipulación de la base local había sido una reconstrucción desde SQL, hecha por `ensayo-local.mjs`. El fallo no necesita el disparador que le habíamos atribuido |
| Andamiaje dejado por una corrida anterior | **REFUTADA**, ya lo estaba: produce `SIN VEREDICTO` código 2, y además esta vez no había ninguna fila `9000+` |
| El índice no existía en ese momento | **Sin apoyo.** Existía al mirarlo. *Con la salvedad honesta de que se miró después de que el comprobador limpiara lo suyo, así que no prueba que estuviera visible durante* |

**Las tres hipótesis escritas en la primera vuelta están hoy sin apoyo, y una está
muerta.** Eso es progreso, aunque no lo parezca: se dejó de buscar donde no estaba.

#### Lo único que las dos apariciones comparten

**Las dos ocurrieron dentro de `npm run verificar`. Ninguna suelta.** Son dos casos y
dos no son una serie, pero es el primer rasgo común que aparece y conviene anotarlo
antes de olvidarlo.

Lo que **no** lo explica: `verificar-todo.mjs` corre sus cuatro comprobaciones **en
serie**, con `spawnSync` dentro de un `for`. No hay concurrencia entre ellas, así que
la explicación fácil —dos procesos tocando la base local a la vez— queda descartada
por lectura del código.

#### Una hipótesis nueva, con evidencia de esta misma sesión y sin provocar

**Wrangler se cae al terminar, en Windows.** No es una sospecha: está escrito desde
H-016 y se vio otra vez el 2026-09-10, en la salida de una carga:

```
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

Un proceso que revienta al salir **puede no cerrar limpiamente la base local**, y con
ella su `-wal`. El proceso siguiente que la abra podría leer una vista donde falte lo
último que se escribió — por ejemplo, la alternativa correcta del andamiaje que el
comprobador acaba de insertar. Si esa fila no está visible, el índice parcial **no
tiene nada contra qué chocar** y deja pasar la segunda correcta: exactamente el fallo
que se ve.

Encaja con las tres cosas que hacían raro el caso: que sea intermitente, que se
arregle al repetir, y que el índice esté cuando se lo mira después.

**Es una hipótesis y no está provocada.** Se anota con su evidencia —el `Assertion
failed` es real y observado— y sin darla por buena. Provocarla exigiría forzar una
salida sucia de wrangler entre el montaje del andamiaje y la comprobación, y no está
claro que se pueda hacer a voluntad.

#### Lo que sigue siendo cierto y conviene no perder de vista

**El modo de fallo observado es un falso «caída», no un falso «en pie».** El
comprobador acusa de más, no de menos. La versión peligrosa —que diga «restricciones
en pie» cuando no lo están— **no se ha observado nunca**, y nada de lo aprendido
hasta ahora sugiere que sea posible por esta vía: si el andamiaje no está visible, lo
que falla es la comprobación, no la restricción.

**Sigue en amarillo.** Dos apariciones, tres hipótesis sin apoyo, una muerta, una
nueva sin provocar, y un rasgo común anotado. No se cierra: cerrarlo exigiría
explicar el fallo.


---

### H-030 · El respaldo del banco no tenía banco dentro, y el «un solo paso» de ADR-023 no existía

**Gravedad:** 🔴 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 25 · **Fecha:** 2026-09-09

**Son dos hallazgos y van juntos porque el segundo explica al primero.**

**Lo que se encontró.** `d1/respaldo-banco.sql`, el archivo que ADR-014 designa como
el respaldo del banco y que está versionado, contenía esto y nada más:

```sql
PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE prueba_tuberia ( id INTEGER PRIMARY KEY, clave TEXT NOT NULL UNIQUE, … );
INSERT INTO "prueba_tuberia" VALUES(1,'saludo','Verificado por Felipe el 3 de septiembre',…);
INSERT INTO "prueba_tuberia" VALUES(2,'entorno','Cambia este valor para comprobar …',…);
```

527 bytes. Es la tabla de ensayo de tubería de la **iteración 12**, exportada el
**2026-09-03**. **No menciona `pregunta` ni `alternativa` ni una sola vez**: no es un
respaldo desactualizado, es el volcado de otra cosa.

**Cuánto llevaba así.** Desde el 2026-09-03. El banco existe en producción desde el
2026-09-09. Es decir que ADR-014 **nunca se ha cumplido para el banco**, y nadie lo
notó en seis días de trabajo intenso sobre esa misma base.

**Por qué nadie lo notó.** Porque nada lo miraba. Es la hermana de la deuda ya anotada
en la iteración 24 —«nada comprueba que la instantánea y el banco no hayan
divergido»—, sólo que peor: allí el archivo estaba desfasado, aquí **no tenía relación
con el banco**. Un archivo existe, tiene fecha y pesa algo, y eso se parece lo
suficiente a estar bien como para que nadie lo abra.

**Y ahora la causa, que es el segundo hallazgo.** ADR-023 dice, literal: «**Un solo
paso produce las dos cosas, o no produce ninguna**». Eso **no estaba implementado**. La
realidad eran dos comandos sueltos —una exportación y una regeneración— y, entre
medio, un **recordatorio impreso** por `generar-instantanea.mjs` sugiriendo que
exportaras también el respaldo. Nada ataba las dos mitades: nada fallaba si corrías
una y no la otra.

La propia ADR había predicho el desenlace con precisión —«separarlas es garantizar que
una de las dos se quede atrás»— y se equivocó sólo en cuál: **apostaba a que se
quedaría atrás la instantánea**, por ser la muda. Se quedó atrás el respaldo.

**Corregido**, y no con un recordatorio más:
`scripts/publicar-banco.mjs` hace las dos mitades en una corrida. Prepara cada una en
un archivo temporal y **sólo instala si las dos salieron bien**; si algo falla, los dos
archivos de verdad quedan intactos, y lo demuestra imprimiendo sus huellas antes y
después en vez de prometerlo.

Y comprueba, antes de instalar nada, lo que ningún comando comprobaba:

| Comprobación | Qué caza |
|---|---|
| el respaldo trae tabla `pregunta`, tabla `alternativa` y al menos una fila | exactamente lo de `prueba_tuberia` |
| con destino remoto, el sello dice `nube` | publicar el banco de juguete como respaldo del real |
| la instantánea no publica más preguntas de las que el respaldo contiene | dos mitades sacadas de momentos distintos |

**Provocado el 2026-09-09** contra la base local, en sus cuatro sabotajes —respaldo sin
banco, respaldo vacío, sello local, y la segunda mitad fallando **después** de que la
primera ya había salido bien—: los cuatro rechazados, y en los cuatro **comprobado por
huella que ninguno de los dos archivos se tocó**. Provocados además sus tres rechazos
de entrada (sin `--base`, base no declarada, barrera de ADR-015).

**Comprobado también que no se rompió lo que ya protegía.** Para que el guion pudiera
preparar la instantánea aparte hubo que añadir `--salida=` a `generar-instantanea.mjs`,
y eso ponía en riesgo su protección de «no pisar una instantánea de la NUBE con una
LOCAL»: si el generador mirara el archivo temporal, no habría nada anterior que
proteger y **la protección se habría apagado sola justo al enrutarla**. Se separó el
archivo canónico del de escritura, y se provocó: con el sello canónico puesto en
`nube`, una corrida local responde `ME NIEGO A PISAR LA INSTANTANEA` y el paso único
informa que no tocó nada.

**Lección de método, y es la de siempre en este proyecto con una vuelta más.** Un
procedimiento escrito que pide acordarse de dos cosas es un procedimiento que produce
una. La ADR lo sabía —lo dice en su propio texto— y aun así se implementó como dos
pasos, porque **escribir la advertencia se siente como haber resuelto el problema**.
Lo que lo resuelve es que el segundo paso no pueda no ocurrir.

#### Y un sabotaje que no podía cazar nada, en el mismo guion

Escribiendo los cuatro sabotajes apareció el patrón de H-023 por quinta vez, esta vez
**dentro de la herramienta escrita para que ADR-023 dejara de ser una promesa**.

El sabotaje `sello-local` comprueba que se rechace una instantánea con sello `local`
cuando se pidió la nube. La condición estaba escrita como `if (remoto && …)`, y **los
sabotajes están prohibidos con destino remoto** —a propósito, para no tocar la cuenta—.
Resultado: una comprobación imposible de ejercitar, que habría quedado marcada como
probada sin haberlo estado nunca.

**Corregido** separando «se pidió el sello de la nube» de «se habla con la nube»: son
dos cosas distintas y sólo la segunda toca la cuenta. Con eso el sabotaje la ejercita
sin que nadie salga a la red.

---

### H-031 · El texto del banco compila CSS, y nadie lo sabía

**Gravedad:** 🟡 · **Estado:** 🟢 Entendido y documentado · **Detectado en:** iteración 25 · **Fecha:** 2026-09-10

**Síntoma.** Después de cargar el módulo 3, `npm run verificar` respondió
`DESFASADO` sobre `static/css/style.css`. **Nadie había tocado los estilos en esa
tanda:** ni `src/input.css`, ni una clase de Tailwind, ni un recurso de
`static/resources/`.

**Qué cambió, medido y no supuesto.** No son finales de línea. Es contenido, y son
exactamente **80 caracteres**:

```
commiteado  18 077 caracteres
en disco    18 157 caracteres

primer carácter distinto: posición 7743
  commiteado  …{visibility:visible}.fixed{position:fixed}…
  en disco    …{visibility:visible}.collapse{visibility:collapse}.fixed{position:fixed}…
```

Apareció una regla que no estaba: `.collapse{visibility:collapse}`.

**De dónde salió, y es lo que hay que entender.** `tailwind.config.cjs` declara:

```js
content: ['./*.html', './static/js/**/*.js']
```

Y **`static/js/data/instantanea-banco.js` está dentro de ese glob.** La instantánea
es el banco de preguntas: enunciados, alternativas y justificaciones, escritos como
un archivo `.js`. Tailwind no distingue código de contenido —busca cadenas que
parezcan nombres de clase— así que **escanea el texto de las preguntas**.

La palabra apareció en una justificación del módulo 2, sobre jQuery:

> «…`.slideUp()` lo colapsa por altura en vez de por opacidad, y **`.collapse()`**
> no es de jQuery sino de Bootstrap.»

Tailwind vio `collapse`, lo reconoció como una de sus clases de utilidad y emitió su
regla. **El CSS del sitio creció por una frase sobre Bootstrap escrita dentro de una
justificación.**

**Por qué se notó ahora y no antes.** La secuencia es exacta y conviene dejarla:

1. `b64f1b3` commiteó la instantánea nueva —la del módulo 2, ya con esa
   justificación dentro—.
2. **No recompiló el CSS**, porque `publicar-banco.mjs` regenera la instantánea y el
   respaldo, y el CSS no es asunto suyo.
3. La primera corrida de `npm run verificar` posterior sí recompiló, la regla nueva
   apareció, y el archivo dejó de coincidir con lo commiteado.

Es decir que el desfase **entró el 2026-09-09 y se hizo visible el 10**, que es como
se comportan los desfases: no avisan cuando nacen.

**Esto no es un defecto y no hay nada que arreglar en el archivo.** El CSS de disco
está bien generado: recompilarlo produce exactamente los mismos 18 157 bytes. El
veredicto lo dice con precisión —«el CSS corresponde a su fuente, pero difiere de lo
que hay commiteado»— y se cierra commiteándolo.

**Lo que sí hay que arreglar es el procedimiento, y es barato.** El paso 10 del
procedimiento de un lote listaba **dos** archivos generados para el commit —el
respaldo y la instantánea—. Son **tres**: `static/css/style.css` también puede
cambiar en cada carga, y de hecho va a cambiar cada vez que una justificación nueva
contenga una palabra que Tailwind reconozca como clase. Quedan cinco módulos y unas
trescientas justificaciones por escribir, así que va a volver a pasar.

**Lo que este hallazgo obliga a saber, y no es obvio:** el banco de preguntas es
**entrada del sistema de construcción del CSS**, no solo dato que se muestra. Ya
estaba escrito que es contenido de origen externo que hay que escapar al pintarlo;
ahora además hay que saber que su texto alimenta a Tailwind. Un banco con una
pregunta sobre, digamos, la clase `hidden` de Bootstrap, agrega reglas al CSS del
sitio sin que nadie escriba una línea de estilos.

**Descartado como salida: sacar la instantánea del glob.** Se pensó y no se hace. El
glob existe para que Tailwind vea las clases que usan los componentes de
`static/js/`, y la instantánea vive ahí porque el navegador la importa como módulo.
Excluirla exigiría moverla o afinar el glob, y las dos cosas tocan el camino
publicado por un problema que cuesta 80 bytes. **Se documenta y se commitea**, que
es proporcional.


#### Segunda cara · 2026-09-10 · el banco rompió la construcción, y el despliegue falló

**El módulo 4 se cargó y se publicó bien, y el despliegue de Cloudflare falló:**

```
ERROR: 1 referencia(s) sin destino dentro de dist/:
  - static/js/data/archivo.js
La construccion se detiene: publicar asi dejaria recursos rotos en el sitio.
```

**No existe ninguna pregunta sobre `archivo.js`. El culpable es una justificación**, la
de `m04#19`, sobre cómo se importa un módulo exportado por defecto:

> …se importa sin llaves y con el nombre que uno quiera: `import Modulo from './archivo.js'`.

El verificador de enlaces de `build-dist.mjs` buscaba `import … from '…'` con una
expresión regular sobre el texto completo del archivo, y esa expresión **no distingue
una sentencia de una cadena**. Encontró la del ejemplo, la tomó por una referencia
real, fue a buscar `static/js/data/archivo.js`, no lo halló, y detuvo la construcción.

**El guion ya conocía media verdad.** Su propio comentario decía que los archivos de
`static/js/data/` guardan ejemplos de HTML —`avatar.jpg`— y que tratarlos como enlaces
rompe la construcción sin motivo; por eso en un `.js` sólo miraba los `import`. **Lo
que no vio es que el banco también contiene ejemplos de JavaScript**, y que ahí la
defensa se convertía en el problema.

#### Por qué el arreglo no es afinar el patrón

Se consideró exigir que el `import` estuviera **al principio de línea**, que es donde
está una sentencia de verdad. Arregla el caso de hoy y no el problema.

Quedan cuatro módulos y unas 250 preguntas, muchas sobre código. Lo que viene:
`require('./modulo')`, `fetch('/api/datos.json')`, rutas con `../`, extensiones `.mjs`
y `.json`, y `await import('./x.js')` — **que es una expresión y puede ir a mitad de
línea con todo derecho**, así que el ancla ni siquiera lo cubriría. Cada caso pediría
su parche, y una lista de excepciones se rompe en el módulo siguiente.

**Lo que no depende de la forma del texto es dónde vive.** Un archivo de
`static/js/data/` no enlaza a nada, cite lo que cite. Ésa es la regla que se
implementó, y es estructural: no enumera qué formas ignorar, sino qué archivos son
datos.

**Lo que se sigue comprobando**, para que no se lea como un agujero: que el archivo de
datos **exista** se comprueba igual, porque el recorrido llega hasta él desde quien lo
importa —la instantánea, por su import dinámico— y falla si no está. Lo único que dejó
de hacerse es seguir rastros **hacia afuera** de él, que es lo que nunca debió hacerse.

**Y la regla no puede esconder un fallo real:** si un archivo de `static/js/data/`
llegara a traer un import de verdad, la construcción se detiene y lo dice. Dejaría de
ser un archivo de datos, y entonces la regla habría que repensarla.

**Provocado el 2026-09-10, en los dos sentidos:**

| | |
|---|---|
| Antes del arreglo | `npm run build` → `codigo=1`, el mismo error del despliegue |
| Después | `npm run build` → `codigo=0`, «17 recursos enlazados, ninguno roto» |
| La protección nueva | un `import algo from './no-existe.js'` metido en la instantánea → `codigo=1`, nombrando archivo y línea |

**Y el primer intento de provocar la protección falló, lo que destapó su límite.** Se
metió el import en `static/js/data/cuestionario.js` y la construcción pasó igual:
**nada importa ese archivo**, así que el recorrido nunca llega a él y la comprobación
no lo mira. La protección cubre los archivos de datos **que alguien importa**, no la
carpeta entera. Hoy eso alcanza —la instantánea es la que importa y sí se visita— pero
está dicho para que nadie lo suponga más ancho de lo que es.

#### El tercer camino, que sí existe y hoy funciona por casualidad

*Buscado a propósito el 2026-09-10, a pedido del autor.*

`build-dist.mjs` lee la instantánea una segunda vez, para avisar si el sello no dice
`nube` — el aviso que sostiene ADR-023:

```js
const sello = readFileSync(INSTANTANEA, 'utf8').match(/"entorno":\s*"([^"]+)"/);
```

**Ese `match` no es global: se queda con la PRIMERA coincidencia del archivo.** Hoy la
primera es el sello de verdad, porque el generador escribe `export const SELLO` en la
línea 17 y `export const PREGUNTAS` en la 26. **Funciona por el orden en que se
escriben las dos constantes, no porque el guion sepa cuál es cuál.**

Si ese orden se invirtiera alguna vez —o si el formato del archivo cambiara— una
pregunta cuyo texto contuviera `"entorno": "nube"` bastaría para que una instantánea
generada en local pasara por generada en la nube. El aviso diría que todo está bien y
el sitio publicaría el banco de juguete como respaldo, que es exactamente el fallo
silencioso que ADR-023 existe para impedir.

**No se arregla hoy**, porque no está roto y el arreglo toca el generador. Queda
anotado con su condición: **mientras `SELLO` se escriba antes que `PREGUNTAS`, esto es
correcto; el día que eso cambie, deja de serlo sin avisar.**

**Descartados tras mirarlos**, para que la lista sirva de algo: `build-icons.mjs` lee
los SVG de un directorio y no escanea texto; `verificar.mjs` compara el CSS, que es
aguas abajo del mismo camino de Tailwind; `verificar-banco.mjs` valida contenido y no
construye; y `probar-escapado.mjs` es de ejecución, no de construcción.

#### Lo de fondo, que es lo que hay que llevarse

**El banco participa de la construcción, y ya van tres caminos:**

| Camino | Qué hace con el texto del banco |
|---|---|
| Tailwind | lo escanea buscando nombres de clase, y emite CSS |
| Verificador de enlaces | lo escaneaba buscando referencias, y detenía la construcción |
| Lectura del sello | lo lee con una expresión regular que sólo el orden salva |

**Los tres tienen la misma raíz: el banco se publica como un módulo `.js` dentro del
árbol que las herramientas tratan como código.** `static/js/data/instantanea-banco.js`
cae dentro del `content` de Tailwind (`static/js/**/*.js`) y dentro del filtro del
verificador (`/\.(html|js|mjs)$/`) porque **termina en `.js`**, no porque alguien
decidiera que fuera código.

**La salida de raíz, dicha y no implementada:** publicar la instantánea como `.json` en
vez de `.js`. Deja de casar con los dos filtros de una vez, sin listas ni excepciones,
y ningún camino futuro que busque «archivos de código» la encontraría. **El costo es
real y por eso no se hace aquí:** habría que cargarla con `fetch` en vez de con un
import dinámico, y ese es el camino que **sólo corre el día que la capa de datos cae**
— o sea el que más caro sale romper y el más difícil de probar. Cambiarlo merece su
propia iteración y su propia comprobación, no un arreglo al paso.

**Y la pregunta que conviene hacerse en cada herramienta nueva que toque el sitio:**
¿esto va a leer `static/js/data/`? Si la respuesta es sí, va a leer el banco, y el
banco dice cosas sobre programación.


---

### H-019 · Actualización del 2026-09-10 · el disparador y el defecto son dos cosas distintas

*El hallazgo original sigue abierto. Esta actualización separa lo que en la carga
del módulo 3 se vio junto, porque confundirlos llevaría a dar por resuelto lo que no
lo está.*

#### El disparador de esta vez: la sesión de wrangler se enfría

La carga del módulo 3 respondió `SIN VEREDICTO` en la **primera llamada de una
terminal recién abierta**, con un fallo de autenticación **7403** de Cloudflare.
Repetida, entró sin problemas.

**La hipótesis del autor, y encaja con cómo se trabaja aquí:** se abre una terminal
por carga y entre carga y carga pasan **días**, así que la sesión guardada de
wrangler llega fría a la primera llamada.

**El comando existe y ya estaba en el proyecto**, en
`90-manual/capa-de-datos-y-base-d1.md`, paso 4:

```
node node_modules/wrangler/bin/wrangler.js login
```

Y ahí está descrito como **«una sola vez por equipo»** — que es exactamente el
supuesto que el 7403 contradice. Esa frase se escribió cuando la única pregunta era
cómo autenticarse la primera vez; nadie había vuelto días después.

**Lo que se agrega al procedimiento es un paso 0**, y el comando **no es `login`**:

```
node node_modules/wrangler/bin/wrangler.js whoami
```

`whoami` es de solo lectura, no abre el navegador, y responde en un segundo con la
cuenta o con el fallo. **Sirve como despertador y además como pregunta:** si contesta
la cuenta, la sesión está viva y se sigue; si falla, ahí sí se corre `login`, que es
el que abre el navegador. Ponerlo antes de tocar nada convierte un fallo a mitad de
carga en un fallo antes de empezar, que es el mismo error saliendo barato.

**Los dos los ejecuta el autor.** La capa 2 de la barrera de ADR-015 rechaza
`wrangler login|logout|whoami|secret|deploy` explícitamente, y hace bien.

#### El defecto sigue vivo, y el login no lo toca

**El guion no supo leer la respuesta cuando vino como sobre de error con
`notes: [...]`.** Eso no lo arregla autenticarse.

**Por qué importa, y es el punto entero:** el 7403 fue **amable**, porque falló
**antes de escribir**. Cualquier otro fallo de la nube —un límite de tasa, una caída,
una red cortada a mitad de la importación— produce **el mismo `SIN VEREDICTO`**, y en
esos casos **sí puede ser que la carga haya entrado**. El guion respondería igual en
los dos escenarios, que es justamente lo que un veredicto no debe hacer: parecerse a
sí mismo cuando la situación cambió.

**Resolver el login TAPA EL SÍNTOMA sin arreglar el defecto.** Después del paso 0, el
7403 va a dejar de aparecer, y con él va a dejar de aparecer el aviso de que este
defecto existe. Queda escrito aquí para que la próxima vez que salga un
`SIN VEREDICTO` nadie lo lea como «otra vez la sesión fría».

**Anotado, no resuelto.** No se arregla en la iteración 25 por decisión del autor el
2026-09-10.

#### Lo que sí se arregló ahora, porque era barato

El mensaje de `SIN VEREDICTO` decía «mira la base antes de repetir» y **no decía
cómo**. En la carga del módulo 3 el autor no tenía el comando a mano en ese momento y
**repitió a ciegas; salió bien por suerte y no por método**.

Ahora el guion imprime el comando exacto, con el módulo del encargo y la base contra
la que se estaba hablando:

```
Como mirar la base, sin repetir nada:

  node scripts/comprobar-carga.mjs 3 --base=examen-td-js-produccion

Ese guion NO escribe: contrasta lo que hay en la base contra los archivos de
origen y dice si el lote entro entero, a medias o no entro.
```

Provocado el 2026-09-10 contra una base sin declarar, comprobando que el número de
módulo salga del sello del encargo y no de una suposición.

**La lección, que vale más allá de este mensaje: un mensaje que pide algo sin decir
cómo hacerlo se desobedece.** Y no por descuido — se desobedece porque obedecerlo
cuesta más que arriesgarse, justo en el momento en que uno está nervioso porque algo
acaba de fallar. Escribir el comando cuesta cuatro líneas y cambia esa cuenta.


#### El paso 0 NO previene el 7403 · comprobado el 2026-09-10, en la carga del módulo 5

**Esto refuta lo que se escribió al añadir el paso 0**, y conviene que quede dicho con
esas palabras y no suavizado.

El paso 0 se agregó tras la carga del módulo 3 con una hipótesis: la sesión guardada de
wrangler se enfría entre carga y carga, y por eso la primera llamada de una terminal
nueva devolvía **7403**. La mitigación era correr `whoami` antes de tocar nada, para
despertarla y de paso comprobarla.

**En la carga del módulo 5 se corrió el paso 0, respondió bien, y el 7403 apareció
igual, en la llamada siguiente:**

```
node ... wrangler.js whoami
👋 You are logged in with an OAuth Token, associated with the email …
│ Felipe Cuevas │ 2e5cb791ea3bd6de0da1b019c4389b3a │
   ↓ (la siguiente llamada, en la misma terminal)
"text": "The given account is not valid or is not authorized to access
         this service [code: 7403]"
```

**La sesión estaba viva** —`whoami` la leyó y la imprimió— y aun así la petición a D1
fue rechazada por «cuenta no autorizada». Y a la vez siguiente, sin cambiar nada más,
la misma carga funcionó.

**Qué queda establecido:**

| | |
|---|---|
| La hipótesis de la sesión fría | **refutada como causa suficiente.** `whoami` funcionó y el 7403 llegó igual |
| El paso 0 como preventivo | **no funciona.** No evita el 7403 |
| El 7403 | **transitorio.** Reintentar, sin cambiar nada, lo resolvió las dos veces |

**Qué NO queda establecido, para no cambiar una explicación cómoda por otra:** no se
sabe la causa. Un 7403 transitorio en la API de Cloudflare admite varias —propagación
del token, límite de tasa, un problema pasajero del lado del proveedor— y **ninguna se
ha comprobado**. Lo único medido es que la sesión estaba viva.

#### Qué hacer con el paso 0

**No se retira, y el motivo cambió.** Ya no está ahí como preventivo del 7403 —no lo
previene— sino porque **sigue siendo la forma barata de comprobar que hay sesión antes
de empezar**, y ese fallo distinto sí existe y sí lo caza. Lo que hay que corregir es la
expectativa escrita en el procedimiento: pasa de «evita el 7403» a «comprueba que haya
sesión, y no evita el 7403».

**Y esto refuerza lo que ya decía el hallazgo:** el defecto de fondo sigue siendo que el
guion **no sabe leer el sobre de error con `notes: [...]`**. Se creyó que el paso 0
haría desaparecer el síntoma; no lo hace, así que el `SIN VEREDICTO` va a seguir
apareciendo. Menos mal, dicho sin ironía: era el único aviso de que el defecto existe.

#### Lo que sí funcionó, y era nuevo

El mensaje corregido hizo su trabajo. Al fallar, imprimió el comando exacto:

```
Como mirar la base, sin repetir nada:

  $env:PERMITIR_REMOTO=1
  node scripts/comprobar-carga.mjs 5 --base=examen-td-js-produccion --remote
```

con el módulo sacado del sello del encargo y el permiso de ADR-015 incluido, que es
justo lo que faltaba en el módulo 3.

**Se repitió la carga en vez de mirar la base**, y esta vez tampoco hubo daño: el
conteo `174 → 223` es exactamente 49, así que no entró nada dos veces. Conviene anotar
por qué no lo hubo, que no es suerte del todo — el 7403 falló **antes** de escribir, y
si hubiera entrado a medias, el `UNIQUE (origen, modulo, numero_origen)` habría
rechazado la segunda pasada. **La red que sostuvo esto es el esquema, no el
procedimiento.**


---

### H-032 · Nada impedía que una marca de duda se publicara como justificación

**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Detectado en:** iteración 25 · **Fecha:** 2026-09-10

**Síntoma.** Ninguno todavía, y ése es el punto: **no había fallado nunca porque hasta
hoy lo evitó una persona acordándose.**

Una justificación marcada con `**[DUDA]**` no es contenido para el estudiante: es una
nota para el revisor, y el texto que la rodea le habla a él —«conviene que sepas»,
«quería que lo decidieras tú»—. Ese mismo texto es el que se carga en la columna
`justificacion` de D1 y el que la **épica 30** va a mostrar en pantalla.

**Hasta el 2026-09-10, si una justificación aprobada traía `[DUDA]` dentro, se cargaba
tal cual.** Nada en la cadena lo miraba: ni `aplicar-justificaciones.mjs`, ni
`validacion-de-escritura.mjs`, ni `motivosDeContenido()`.

**Cómo se evitó las dos veces anteriores.** A mano. En el módulo 3 las cuatro marcas se
quitaron al reescribir las justificaciones, y se comprobó contándolas —«`[DUDA]` que
quedan: 0»—. Funcionó, y funcionó **por memoria y no por método**, que es la forma
exacta en que este proyecto ya se ha equivocado: es lo mismo que decía H-030 sobre un
procedimiento que pide acordarse de dos cosas.

**Cómo apareció.** Al ir a aplicar las justificaciones del módulo 4 con las tres
`[DUDA]` **conservadas por decisión del autor**. Conservar la pregunta no significa
conservar la marca: la marca tenía que desaparecer igual, porque lo que se decidió es
que el matiz pase a ser **contenido útil para el estudiante**. Al reescribirlas se hizo
visible que nada obligaba a hacerlo.

**Corregido.** `aplicar-justificaciones.mjs` se niega a producir el encargo de carga si
alguna justificación **aprobada** trae `[DUDA]` dentro. No lo degrada a borrador en
silencio: se para y nombra cuáles. Una duda resuelta se reescribe, y reescribirla es
trabajo de quien la redactó, no del guion.

**Provocado el 2026-09-10, y costó dos intentos que vale la pena anotar:**

1. El primero metió la marca **en el párrafo de instrucciones** del documento, que
   menciona el marcador en su propia prosa. No probó nada: el sabotaje no tocó ninguna
   justificación.
2. El segundo la metió en un bloque real **editando el documento a mano**, y saltó
   antes la comprobación de divergencia —el texto ya no correspondía a su sello—. Eso
   demuestra que ese camino ya estaba cubierto, pero **tampoco ejercitó la puerta
   nueva**.
3. El tercero la metió **en el JSON de origen** y regeneró el documento, que es el
   camino legítimo y el único por el que una marca puede llegar aprobada. Ahí sí: `NO
   SE APLICO · 1 justificacion(es) aprobada(s) todavia traen [DUDA] dentro`, y no se
   escribió ningún archivo.

**Los dos primeros intentos son parte del hallazgo y no un tropiezo que ocultar.** Un
sabotaje que salta por otra comprobación deja la nueva sin probar y la haría pasar por
comprobada — es exactamente lo que el requisito estricto de `comprobar-carga.mjs`
existe para impedir, y aquí se vio en vivo.

**Lo que esto NO cubre, dicho para que no se confíe de más.** La marca es una
convención de forma. Un texto que exprese la misma duda **sin escribir `[DUDA]`** pasa
la puerta sin problema. Lo que se cierra es el olvido mecánico, que era el riesgo real;
la duda encubierta la sigue teniendo que ver una persona al revisar.

**Coste anotado.** Provocar el caso 3 obligó a meter la marca en el JSON real y
regenerar el documento, y eso **devolvió a cero la aprobación de `m04#1`** aunque su
texto volviera a ser byte a byte el mismo. La aprobación no se restauró a mano: una
marca significa «una persona miró este texto», y restaurarla desde el guion la
convertiría en otra cosa. Se pidió de nuevo, diciendo por qué.
