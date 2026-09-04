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

**Hallazgo relacionado, no corregido aquí.** `scripts/verificar.mjs` tiene la misma
confusión, más leve, y queda anotada en el registro como «Sin asignar» por estar
fuera del alcance de la iteración 21. En la línea 237 hace `if (diff.status !== 0)
→ DESFASADO`. `git diff --exit-code` devuelve 0 sin diferencias y 1 con diferencias:
cualquier otro código es git fallando. Sólo se distingue el caso «no es un
repositorio», por texto del `stderr`. Comprobado con un repositorio de índice
corrupto: `git diff --exit-code` sale por **128** con `fatal: .git/index: index file
smaller than expected`, que no coincide con ese texto y por lo tanto se anunciaría
como `DESFASADO` —un problema del CSS— cuando el CSS no tiene nada que ver. El
arreglo es tratar `status > 1` como `VERIFICACION PARCIAL`, que ya existe en ese
archivo. En cambio, **el defecto de paso de argumentos no lo tiene**: sus dos usos de
`shell: true` llevan argumentos fijos, y la llamada a git —la única con una ruta
variable, que además puede contener espacios— va sin shell y con los argumentos en
arreglo, que es la forma correcta.
