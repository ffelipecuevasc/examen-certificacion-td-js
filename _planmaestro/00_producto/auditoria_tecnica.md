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
