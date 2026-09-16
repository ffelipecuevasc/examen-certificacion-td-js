# Iteración 34 · Justificación y repaso

**Épica:** 30 · Cuestionario
**Estado:** 🟢 Completada · 2026-09-16
**Depende de:** iteraciones 33 y 36 cerradas. El repaso lee el avance guardado de la
33, y la justificación se dibuja sobre la paleta que dejó la 36.

## Objetivo

Que responder enseñe algo —cada pregunta explica su porqué— y que el estudiante pueda
volver únicamente sobre lo que falló.

## Contexto

**Las justificaciones no las ha leído nadie más que el autor.** Las 368 preguntas activas
tienen la suya desde el cierre de la iteración 25, pero la pantalla que las muestra nunca
existió. **Esta es la primera vez que un estudiante las va a leer**, y un error de
redacción no lo va a descubrir ninguna comprobación antes que ellos.

## Historial de este archivo

- **2026-09-15 · creada** al partir la antigua iteración 33, por decisión del autor.
- **2026-09-16 · decisiones resueltas antes de arrancar.** El autor resolvió las cuatro
  decisiones que el archivo dejaba abiertas (decisiones 3 a 6). Se corrigieron dos
  criterios que pedían provocar cambios con `banco:actualizar` y en la base local, algo
  que la 33 prohibió porque sobrescribe la instantánea versionada, y se agregó lo que
  heredan de la 33 y la 36.
- **2026-09-16 · lectura de alcance y decisiones 7 a 10.** La lectura de alcance de
  Claude Code confirmó que hoy una pregunta respondida queda bloqueada, y encontró que
  el código no conserva lo respondido en la visita fuera del almacén ni del DOM. El
  autor resolvió las decisiones 7 a 10. Se corrigieron: «Repasar la materia» es un
  enlace y no un botón; la regla sobre la base, que prohibía sin querer la fila de
  prueba temporal de `probar-escapado.mjs`; la convivencia del repaso con ADR-033; y el
  criterio del escapado, que podía pasar sin dibujar ninguna justificación.
- **2026-09-16 · decisión 11, tras la etapa 2.** El mensaje con N en 0 hacía crecer el
  panel fijo en contra de ADR-032; el autor lo llevó a la zona de preguntas.
- **2026-09-16 · cerrada.** Se implementó en dos etapas —justificación y memoria de la
  visita primero, repaso después— más una tanda de correcciones. Los 24 criterios de
  guion quedaron cerrados por `probar-memoria.mjs`, `probar-escapado.mjs` y
  `probar-filtrado.mjs`, y los 9 de navegador por el autor en una pasada de 14 pasos el
  mismo día. **ADR-034 recibe una actualización** que declara la memoria de la visita;
  ni la decisión de guardar ni el formato `v: 1` se tocan.

## Lo que hereda

**De la 33:**

- **El avance guarda una sola respuesta por pregunta**: el id de la pregunta y el texto
  de la alternativa elegida. **Nunca el veredicto**, que se recalcula contra el banco
  vigente (ADR-034, formato `v: 1`).
- **Los cambios del banco se provocan interceptando la respuesta del extremo**, nunca
  con `banco:actualizar`, `banco:insertar`, `datos:instantanea` ni nada que regenere
  `static/js/data/instantanea-banco.js`.
- La puerta única `pedirCambioDeModulo()`, el foco a la cabecera al cargar un módulo, y
  «Reiniciar el módulo» borrando lo guardado de ese módulo.

**De la 36:**

- **Ya no hay dos niveles de gris para dar jerarquía.** `mutedink` y `muted` quedaron a
  1,19:1 entre sí. La justificación se distingue con peso de letra, color principal o
  un recuadro, no con un gris distinto.
- **`cuestionario.js` cambió** en el estado vacío y en el veredicto.

**Del panel actual:** en la fila de «Reiniciar el módulo» ya existe el **enlace**
«Repasar la materia», que lleva a la guía de estudio (`index.html#modulos`) y se ve casi
igual que un botón. El modo de esta iteración no puede llamarse igual (decisión 5), y el
control nuevo no debe confundirse con un enlace que saca de la página.

## Decisiones tomadas

### 1 · El repaso es por módulo

Decidido por el autor el 2026-09-15:

1. **Coherencia.** El índice elige un módulo, las barras miden un módulo y «Reiniciar»
   actúa sobre un módulo.
2. **Sesiones cortas desde el teléfono**, el público de `vision.md`.
3. **El peso.** Un repaso de los siete módulos se acerca a bajar el banco entero
   (371,8 KB), justo lo que la 31 dejó de hacer.

Un repaso general tiene su lugar natural en el simulacro de la épica 40.

### 2 · La justificación aparece al responder, se acierte o no

Explicar solo los errores le quitaría al estudiante el porqué de las que acertó por
descarte o por suerte.

### 3 · Acertar en el repaso reemplaza lo guardado

Decidido por el autor el 2026-09-16. Si en el repaso el estudiante acierta una pregunta
que había fallado, **la respuesta nueva reemplaza a la anterior**: la pregunta deja de
estar fallada y las barras del módulo lo reflejan.

**Motivos:** premia el estudio, que es el propósito del sitio, y **no cambia el formato de
lo guardado**. Conservar los dos intentos exigiría una versión nueva del formato, con
migración y enmienda de ADR-034.

**Consecuencias:**

- **En el repaso, cada pregunta fallada aparece sin marcar**, para poder intentarla de
  nuevo.
- **Si vuelve a fallarla**, la respuesta nueva también reemplaza a la anterior, y la
  pregunta sigue en el repaso (ver decisión 9).
- **Una pregunta acertada en el repaso sigue a la vista, con su justificación, hasta que
  el estudiante sale del repaso.** Si desapareciera al instante, el contenido saltaría
  bajo el dedo en el teléfono.
- **Se pierde la historia del primer intento.** Aceptado.

### 4 · Durante el repaso, las barras siguen midiendo el módulo completo

Decidido por el autor el 2026-09-16. **Las barras no cambian de significado según el
modo**: son lo más estable de la página, y la 31 ya corrigió una vez rótulos que decían
una cosa y medían otra. El repaso muestra **su propio contador**, del tipo «Te quedan N
preguntas falladas por repasar», que se actualiza al acertar. Dónde se muestra lo fija
la decisión 8.

**Convivencia con ADR-033.** «Lo dibujado manda» describe el módulo completo. **Con el
repaso abierto, el índice y las barras cuentan sobre el módulo completo, no sobre las
preguntas dibujadas**, y el aviso de descuadre (`avisarSiElResumenNoCuadra()`) compara
contra el módulo completo: entrar o salir del repaso no debe dispararlo.

### 5 · Cómo se entra y se sale del repaso

Decidido por el autor el 2026-09-16.

- **Entrar:** un botón junto a «Reiniciar el módulo» que dice **«Repasar mis errores
  (N)»**, con la cantidad de falladas a la vista. El nombre lo distingue del enlace
  «Repasar la materia».
- **Con N en 0, el botón sigue visible**, y al pulsarlo muestra un mensaje útil: si no hay
  respuestas en el módulo, invita a empezar respondiendo; si todas están acertadas, dice
  que no hay errores que repasar.
- **Salir:** un botón «Volver al módulo completo», en el lugar del botón de entrada
  (decisión 10).
- **Elegir otro módulo en el índice a mitad del repaso** sale del repaso y cambia de
  módulo, sin preguntar. Con la memoria de la 33 y la de la visita (decisión 7) no se
  pierde nada.
- **«Reiniciar el módulo» a mitad del repaso** sale del repaso y reinicia.

### 6 · Las preguntas restauradas ofrecen «Ver por qué»

Decidido por el autor el 2026-09-16. **Una pregunta respondida en esta visita muestra su
justificación desplegada.** **Una pregunta restaurada de una visita anterior muestra un
control «Ver por qué»** que la despliega solo si el estudiante lo pide. Así la página no
se alarga con 50 justificaciones en el teléfono, y ninguna explicación queda fuera de
alcance.

### 7 · Memoria de la visita

Decidido por el autor el 2026-09-16, a partir de la lectura de alcance: hoy lo
respondido solo vive en el almacén del navegador y en el DOM, y cualquier repintado
—entrar o salir del repaso lo es— reconstruye desde el almacén.

- **Además de lo guardado en el navegador, la página mantiene en memoria lo respondido
  durante la visita.** El formato `v: 1` no cambia y ADR-034 no se enmienda.
- **Visita** = desde que se carga la página hasta que se recarga o se cierra. Cambiar de
  módulo no cierra la visita.
- Esta memoria es la fuente para: **el repaso sin almacenamiento**, **N exacto sin
  almacenamiento**, y **distinguir «respondida en la visita» de «restaurada»**
  (decisión 6), también después de cualquier repintado.
- **«Reiniciar el módulo» borra también la memoria de la visita de ese módulo.**

### 8 · Un solo contador arriba durante el repaso

Decidido por el autor el 2026-09-16. El contador de preguntas de arriba cuenta lo
dibujado; en el repaso habría dicho «6 preguntas» con las barras en 61. **Mientras dura
el repaso, el contador del repaso reemplaza al contador del módulo en su mismo lugar.**
Queda un solo contador visible. Al salir, vuelve el contador del módulo con su cifra
completa.

### 9 · Fallar otra vez dentro del repaso

Decidido por el autor el 2026-09-16. **La pregunta queda bloqueada, con su
justificación, y sigue a la vista hasta salir del repaso.** N no baja. Al volver a entrar
al repaso aparece de nuevo sin marcar. No existe un control «Intentar de nuevo».

### 10 · Durante el repaso, «Volver al módulo completo» ocupa el lugar del botón de entrada

Decidido por el autor el 2026-09-16. **Mientras dura el repaso, «Repasar mis errores
(N)» no se muestra, y en su lugar aparece «Volver al módulo completo».** La fila nunca
pasa de tres controles (con «Reiniciar el módulo» y el enlace «Repasar la materia»).
Reintentar una fallada cuesta salir y volver a entrar.

### 11 · El mensaje con N en 0 aparece en la zona de preguntas

Decidido por el autor el 2026-09-16, tras la etapa 2: el mensaje junto al botón hacía
crecer el panel fijo, y ADR-032 dice que el panel no crece ni una fila.

- **Al pulsar «Repasar mis errores (0)», el mensaje aparece en la zona de preguntas,
  bajo la cabecera del módulo**, y la vista y el foco van hasta ahí, igual que al entrar
  al repaso. **El panel no crece en ningún caso.**
- **Sin módulo cargado**, el mensaje invita a elegir un módulo y aparece también en la
  zona de preguntas.
- **El mensaje no queda a la vista cuando ya no describe la situación**: al responder,
  cambiar de módulo, reiniciar o entrar al repaso.
- ADR-032 no se enmienda.

## Lo que queda a criterio de quien implemente

El diseño visual de la justificación (con las condiciones heredadas de la 36), el texto
del contador del repaso cuando llega a cero con preguntas aún a la vista, cómo se anuncia
la justificación a un lector de pantalla, y el mecanismo de intercepción en los guiones.
El texto de los botones y del control «Ver por qué» es el de las decisiones 5, 6 y 10.

## Tareas

- [x] Resolver con el autor las cuatro decisiones abiertas y anotarlas en este archivo.
  Hecho el 2026-09-16 (decisiones 3 a 6).
- [x] Lectura de alcance y resolución de sus huecos. Hecho el 2026-09-16 (decisiones 7
  a 10).
- [x] Mantener la memoria de la visita (decisión 7).
- [x] Mostrar la justificación al responder, y «Ver por qué» en las preguntas restauradas.
- [x] Implementar el modo repaso del módulo con sus botones, su contador y sus mensajes.
- [x] Hacer que acertar en el repaso reemplace lo guardado sin cambiar el formato.
- [x] Llevar el foco a un lugar razonable al entrar y al salir del repaso, y al desplegar
  «Ver por qué».
- [x] Hacer que la justificación se pueda alcanzar y leer con teclado y lector de
  pantalla.
- [x] Hacer que `probar:escapado` dibuje justificaciones con contenido hostil.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento. **Ningún
criterio se provoca con `banco:actualizar`, `banco:insertar`, `datos:instantanea` ni
nada que regenere `static/js/data/instantanea-banco.js`**: los cambios del banco se
simulan interceptando la respuesta del extremo, como en la 33. La fila de prueba
temporal que `probar-escapado.mjs` carga y retira en la base local sí está permitida.

### Los provoca Claude Code

**Justificación**

- [x] **Al responder aparece la justificación de esa pregunta, y no la de otra**,
  respondiendo bien y respondiendo mal, sobre el HTML dibujado.
  **Evidencia:** `probar-memoria.mjs:1494-1533` — para cada respuesta compara contra `esc()` de su propia justificación y recorre las 61 del módulo exigiendo que no aparezca la de ninguna otra. Se responden tres: acertando, fallando, y una con caracteres que escapar · **Claude Code**
- [x] **Una pregunta restaurada muestra «Ver por qué» y no la justificación desplegada**;
  al activarlo aparece la justificación correcta.
  **Evidencia:** `probar-memoria.mjs:1555-1597` — visita nueva sobre el mismo disco: `{recuadro:true, abierto:false, boton:true, texto:""}`, y tras el paso `ver-porque` el recuadro trae la justificación de esa pregunta, el botón queda oculto y el foco no cae al `body` · **Claude Code**
- [x] **Si una pregunta llegara sin justificación, no aparece un hueco vacío** ni un
  «Ver por qué» que no despliega nada. Provocado interceptando la respuesta.
  **Evidencia:** plan de intercepción `sin-justificacion` (`probar-memoria.mjs:329-349`) con las tres formas —`null`, campo ausente y solo espacios—, comprobado en `:1606-1637`: ni recuadro ni botón en las tres, responder no escribe nada, y las demás preguntas conservan la suya · **Claude Code**
- [x] **El escapado cubre la justificación dibujada**, desplegada y tras «Ver por qué»:
  `npm run probar:escapado` a escala, con contenido hostil en la justificación de la
  fila de prueba y la justificación sumada a los textos revisados. **El guion dibuja
  justificaciones de verdad** (respondiendo o sembrando el almacén), y la guarda «todas
  o ninguna» no puede pasar con cero justificaciones dibujadas.
  **Evidencia:** `npm run probar:escapado` en `ESCAPADO EN PIE`: «las 368 de 368 se dibujaron RESPONDIENDO las preguntas, una por una, y ninguna apareció cruda. Y la de la fila hostil se desplegó pulsando "Ver por qué"». El Payload F vive en `d1/prueba-escapado.sql:33`; la guarda que ya no admite el cero está en `probar-escapado.mjs:632-648` · **Claude Code**
- [x] **Ningún texto de la justificación usa un gris que dependa de la diferencia entre
  `mutedink` y `muted`**, y todo su texto alcanza al menos 4,5:1 sobre su fondo:
  tabla con elemento, color, fondo y razón.
  **Evidencia:** la justificación no usa **ningún** gris. Rótulo `jsyellow` sobre `bg-panel2` = **13,01:1**; cuerpo `paper` sobre `bg-panel2` = **16,40:1**; riel `jsyellow` sobre la tarjeta `bg-panel` = **14,00:1**; texto de «Ver por qué» `jsyellow` sobre `bg-panel` = **14,00:1**; su borde `jsyellow/40` = **3,12:1**, contra el umbral 3:1 de WCAG 1.4.11. El recuadro se dibuja en `cuestionario.js:296` · **Claude Code**

**Memoria de la visita**

- [x] **Tras salir del repaso, las preguntas acertadas dentro de él muestran la
  justificación desplegada**, y tras recargar la página esas mismas muestran «Ver por
  qué».
  **Evidencia:** `probar-memoria.mjs:2065-2073` (`abierto === true` al salir del repaso) y `:2088-2096` (visita nueva sobre el mismo disco: `boton === true`, `abierto === false`) · **Claude Code**
- [x] **Cambiar de módulo y volver no cierra la visita:** lo respondido antes del cambio
  sigue mostrando la justificación desplegada.
  **Evidencia:** `probar-memoria.mjs:1660-1690`, con el almacenamiento denegado (`lectura-lanza`): los pasos 3 → 5 → 3 conservan la respuesta, la pregunta se dibuja respondida y su justificación sigue desplegada con su texto. `:1714-1723` comprueba la otra mitad: en una visita nueva esa misma pregunta ofrece «Ver por qué» · **Claude Code**
- [x] **«Reiniciar el módulo» deja N en 0 también sin almacenamiento.**
  **Evidencia:** `probar-memoria.mjs:2450-2465`: dos falladas dejan el botón en «(2)» y tras reiniciar dice «(0)», sin almacenamiento, o sea borrando la memoria de la visita (`memoria.js:315-317`) · **Claude Code**

**Repaso**

- [x] **El repaso presenta exactamente las falladas del módulo, ni más ni menos, según
  el banco vigente.** Provocado interceptando la respuesta con una pregunta cuya
  correcta cambió: el repaso sigue al banco nuevo.
  **Evidencia:** `probar-memoria.mjs:1875` — sin interceptar hay 1 fallada (`:1854`, botón «(1)»); con `correcta-movida` sobre la 53 el botón pasa a «(2)» y el repaso dibuja exactamente `[53, 54]`, sin marcar · **Claude Code**
- [x] **El botón dice «Repasar mis errores (N)» con N exacto**, y N cambia al acertar.
  **Evidencia:** `probar-memoria.mjs:1854`, `:1862`, `:2048` (tras salir: «(1)» habiendo entrado con 2 y acertado 1) y `:1970` (el contador del repaso pasa de 1 a 0 al acertar dentro) · **Claude Code**
- [x] **Con N en 0 aparecen los dos mensajes útiles**, el de módulo sin respuestas y el de
  todo acertado, cada uno en su caso, en la zona de preguntas y no en el panel.
  **Evidencia:** `probar-memoria.mjs:2167` módulo sin responder → «Todavía no respondes…»; `:2332` todo acertado → «No tienes errores que repasar…»; `:2339` comprueba que no sean el mismo texto. Los dos se leen del HTML de `#cuestionario`, no de un nodo suelto (retrato en `:697-707`), y `:2187` comprueba que queden entre la cabecera y las preguntas · **Claude Code**
- [x] **Mostrar el mensaje con N en 0 no hace crecer el panel** (ADR-032), también sin
  módulo cargado, y el mensaje desaparece al responder, cambiar de módulo, reiniciar o
  entrar al repaso.
  **Evidencia:** `probar-memoria.mjs:2213-2239` recorta el panel fijo de `cuestionario.html` y exige que no contenga ningún `id="aviso-…"`; hoy el archivo no trae ninguno. Sin módulo cargado: `:2305` y `:2313`. El mensaje se retira en `:2250` (responder, el único camino que no repinta), `:2255` (entrar al repaso), `:2269` (cambiar de módulo) y `:2288` (reiniciar) · **Claude Code**
- [x] **Acertar en el repaso reemplaza lo guardado:** la clave del módulo trae la
  alternativa nueva, sin veredicto, con el mismo formato `v: 1`.
  **Evidencia:** `probar-memoria.mjs:2001-2020`: la clave del módulo trae el texto de la alternativa correcta, `v === 1`, siguen siendo **2** respuestas y no 3, y ni «acerto» ni «veredicto» ni «es_correcta» aparecen en lo guardado · **Claude Code**
- [x] **Una acertada sigue a la vista hasta salir del repaso**, y al volver a entrar ya no
  está.
  **Evidencia:** `probar-memoria.mjs:1980` (sigue dibujada), `:1991` (**responder dentro del repaso no repinta la lista**, sin lo cual el criterio se cumpliría por omisión) y `:2074-2085` (al reentrar no está, y solo queda la otra fallada) · **Claude Code**
- [x] **Volver a fallar deja la pregunta bloqueada en el repaso** con la respuesta nueva
  guardada, N no baja, y al volver a entrar aparece sin marcar.
  **Evidencia:** `probar-memoria.mjs:2117` (N no se movió, 1 → 1), `:2130` (las alternativas quedaron `disabled`), `:2134` (apareció su justificación), `:2143` (la respuesta nueva quedó guardada) y `:2152` (al reentrar aparece sin marcar) · **Claude Code**
- [x] **Durante el repaso, las barras miden el módulo completo** y el contador de arriba
  mide el repaso: provocado acertando una fallada y leyendo las dos cifras.
  **Evidencia:** `probar-memoria.mjs:1893` (total 61 dentro del repaso), `:1899` (respondidas del módulo), `:1911` (contador «Te quedan 2…») y `:1987` (tras acertar: barras 2/61 con 2 correctas y 0 incorrectas, contador 0) · **Claude Code**
- [x] **Durante el repaso hay un solo contador arriba**, y al salir vuelve el del módulo
  con su cifra completa.
  **Evidencia:** `probar-memoria.mjs:1918` (el del módulo desaparece de su sitio) y `:2055` / `:2060` (al salir vuelve con «61 preguntas · módulo 3»). `:1905` comprueba además que la **cabecera del módulo** siga diciendo 61, para que no haya un tercer número · **Claude Code**
- [x] **Durante el repaso no se muestra «Repasar mis errores (N)»** y en su lugar está
  «Volver al módulo completo»; la fila tiene como máximo tres controles.
  **Evidencia:** `probar-memoria.mjs:1926` (durante el repaso el botón dice «Volver al módulo completo») y `:1826` / `:1832`, que cuentan los controles en `cuestionario.html` —tres— y exigen que haya **un solo** botón de repaso · **Claude Code**
- [x] **Entrar y salir del repaso no produce el aviso de descuadre** del resumen.
  **Evidencia:** `probar-memoria.mjs:1936` sobre el `console.warn` capturado al entrar, y `:2399` en las dos salidas involuntarias. Se sostiene porque `recontarElModulo()` cuenta siempre sobre `bancoCargado`, no sobre lo dibujado (`cuestionario.js:846-851`) · **Claude Code**
- [x] **Elegir otro módulo en el índice o reiniciar a mitad del repaso sale del repaso**,
  sin aviso y sin perder nada.
  **Evidencia:** `probar-memoria.mjs:2363`, `:2368` y `:2375` (al volver, lo respondido sigue) para el índice; `:2389`, `:2394` y `:2400` para reiniciar · **Claude Code**
- [x] **El repaso funciona en modo degradado**, desde la instantánea y con el aviso de
  ADR-008 a la vista.
  **Evidencia:** `probar-memoria.mjs:2480` (aviso a la vista), `:2485` (dibuja solo la fallada) y `:2491` (contador correcto), con `caerLaRed` · **Claude Code**
- [x] **El repaso funciona sin almacenamiento**, desde la memoria de la visita, con N
  exacto.
  **Evidencia:** `probar-memoria.mjs:2423` (botón «(1)»), `:2429` (dibuja solo la fallada), `:2435` (contador 1 → 0 al acertar) y `:2442` (el aviso de «no se está guardando» sigue puesto) · **Claude Code**

**Verificación**

- [x] **`npm run probar:filtrado`, `npm run probar:memoria` y `npm run probar:escapado`
  siguen en verde**, con cada rojo nuevo provocado una vez.
  **Evidencia:** `MEMORIA CORRECTA` (42 visitas), `FILTRADO CORRECTO` y `ESCAPADO EN PIE`, los tres en código 0. **21 rojos provocados y devueltos a verde**, con los dos inertes anotados en las notas · **Claude Code**
- [x] **`static/js/data/instantanea-banco.js` sin cambios** al terminar.
  **Evidencia:** `git diff --stat` vacío sobre ese archivo y sobre `d1/respaldo-banco.sql`. No se ejecutó `banco:actualizar`, `banco:insertar` ni `datos:instantanea` · **Claude Code**

### Los comprueba el autor en el navegador

- [x] **La justificación se lee bien en teléfono** con un módulo grande cargado, y se
  distingue del enunciado y las alternativas.
  **Evidencia:** iPhone SE emulado, módulo 3 con sus 61 preguntas: el recuadro con franja amarilla se distingue del enunciado y de las alternativas, sin scroll horizontal. El paso 2 confirmó además que el veredicto se sigue leyendo como lo principal frente a la justificación · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 1)
- [x] **«Ver por qué» se entiende** en una pregunta restaurada, sin explicación previa.
  **Evidencia:** tras recargar, las preguntas restauradas ofrecen el botón; al pulsarlo se abre la explicación y el botón desaparece. El paso 4 aceptó que varias justificaciones abiertas a la vez no se puedan volver a cerrar · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 3)
- [x] **«Repasar mis errores (N)» no se confunde con el enlace «Repasar la materia».**
  **Evidencia:** en la fila de tres controles, el del repaso se distingue por su borde y su texto amarillos y por llevar un número · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 5)
- [x] **El repaso de principio a fin:** entrar, acertar una, fallar otra, ver que la
  acertada sigue a la vista, salir y volver a entrar.
  **Evidencia:** entrar con 3 falladas sin marcar, acertar una —baja a 2 y la pregunta sigue ahí—, fallar otra —no baja—, salir y volver a entrar con 2. El paso 7 cubrió los tres casos con N en 0 y el paso 8 las dos salidas involuntarias · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 6)
- [x] **Con teclado**, se responde, se llega a la justificación, se abre «Ver por qué», se
  entra al repaso y se sale, sin que el foco caiga al inicio de la página.
  **Evidencia:** recorrido completo solo con Tab, Shift+Tab y Enter, con el anillo visible y sin que el foco caiga al `body` en ningún momento · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 9)
- [x] **Un lector de pantalla da a conocer la justificación** al responder, o la deja en
  el orden de lectura inmediatamente después de la pregunta.
  **Evidencia:** lector de pantalla: primero el veredicto y después la explicación, sin tener que ir a buscarla · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 10)
- [x] **En escala de grises**, la justificación y los botones del repaso se distinguen.
  **Evidencia:** con «Achromatopsia» emulada, la franja izquierda sigue delimitando el recuadro y el botón del repaso se distingue de sus dos vecinos · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 11)
- [x] **Sin errores de consola** con cualquier módulo, dentro y fuera del repaso.
  **Evidencia:** tres módulos entrando y saliendo del repaso, más modo degradado y almacenamiento denegado. En degradado, `net::ERR_BLOCKED_BY_CLIENT` y los avisos propios del modo degradado son esperables y no cuentan como falla · **Felipe Cuevas, 2026-09-16, pasada de navegador** (pasos 12 y 13)
- [x] **`npm run verificar` termina en 0** tras el commit.
  **Evidencia:** `VERIFICADO`, con los seis pasos en OK · **Felipe Cuevas, 2026-09-16, pasada de navegador** (paso 14)

## Lo que esta iteración no puede afirmar

- **Que las justificaciones estén bien redactadas.** Se muestran como están en la base.
  Si aparece un error, se corrige en el banco con el procedimiento de siempre.
- **Que se conserve la historia de los intentos.** Acertar en el repaso reemplaza el
  primer intento (decisión 3).
- Que exista un repaso de todos los módulos a la vez: queda descartado (decisión 1).
- **Que lo respondido sin almacenamiento sobreviva a una recarga.** La memoria de la
  visita termina con ella (decisión 7).
- **Que dos pestañas del mismo módulo queden de acuerdo cuando una reinicia.**
  Comprobado en el código y provocado con dos instancias del módulo sobre un mismo
  almacén: `laVisita` es una variable de módulo, o sea **una por carga de la página**
  (`static/js/servicios/memoria.js:104`), y no hay ningún oyente de `storage` en
  `static/js/`. Así que si la pestaña A pulsa «Reiniciar el módulo», `borrarAvance()`
  borra la clave compartida y **solo la memoria de la visita de A**
  (`memoria.js:315-317`). La pestaña B no se entera: sigue mostrando lo que ya tenía
  dibujado hasta que se recargue, y en su próximo repintado `leerAvance()`
  (`memoria.js:197-201`) le devuelve **lo que ella misma respondió en su visita**, no
  lo que solo había restaurado del almacén. En la prueba, con A habiendo respondido la
  53 y B la 54, tras reiniciar en A la pestaña B repinta con la 54 puesta.
  **Es la misma limitación que ADR-034 ya asumía** —«dos pestañas abiertas se pisan,
  gana la última que guarda»—, ahora también en el borrado y de forma asimétrica. No se
  agrega ningún mecanismo: coordinar pestañas cuesta más que lo que evita.

## Notas de la iteración

### Lo que quedó a criterio de quien implementa, y cómo se resolvió

**El recuadro del porqué se dibuja vacío en las preguntas restauradas**, y lo llenan los
dos caminos que lo despliegan: responder, y pulsar «Ver por qué». La alternativa era
dibujarlo lleno y solo destaparlo, y se descartó por el mismo motivo por el que existe
«Ver por qué» (decisión 6): un módulo de 61 preguntas respondidas cargaría 61
justificaciones que nadie pidió leer. Tiene una consecuencia que conviene saber: la
justificación de una restaurada **no está en el HTML** hasta que se pulsa.

**«Ver por qué» se esconde al usarse y el foco va al recuadro.** Su texto es fijo por la
decisión 6, así que dejarlo puesto sería un control ofreciendo hacer lo que acaba de
ocurrir; y como desaparece, el foco tenía que ir a alguna parte o caería al `body`.
**No se puede volver a plegar**, y eso se probó a propósito en el paso 4 de la pasada de
navegador, con varias abiertas en el teléfono: el autor lo aceptó. Si algún día molesta,
volverlo plegable obliga a cambiar el texto del control, que hoy está fijado.

**Al entrar y al salir del repaso, el foco y el desplazamiento van a la cabecera del
módulo**, igual que al elegir un módulo en el índice: la zona de preguntas se reescribe
entera y quien pulsó con teclado se quedaría mirando el panel sin saber que la lista
cambió.

**El contador del repaso en cero dice «No te queda ninguna fallada por repasar»**, y no
que el repaso terminó, porque lo que hay en pantalla sigue ahí hasta que el estudiante
decida salir.

**Se agregó un tercer caso que las decisiones no preveían:** pulsar «Repasar mis errores
(0)» **sin ningún módulo cargado**, nada más abrir la página. Responde «Elige un módulo
en el índice…», también en la zona de preguntas, y **encima** del estado vacío en vez de
en su lugar: reemplazarlo le quitaría al estudiante el enlace al índice, que es justo lo
que necesita en ese momento. La decisión 11 lo recogió después.

**La cabecera del módulo sigue diciendo la cuenta completa durante el repaso** —61, no 6—.
La decisión 8 habla del contador de arriba; la cifra de la cabecera es un tercer número,
y se decidió que siga describiendo lo que su título nombra. El guion lo comprueba.

**El mensaje con N en 0 reusa el recuadro de la justificación** —fondo `panel2` y riel
amarillo— y se centra con `scrollIntoView({ block: 'center' })`, no `'start'` como la
cabecera: es una línea, y centrarlo lo deja a la vista con la cabecera encima.

**No se agregó ningún ícono.** El botón del repaso usa `i-cancel`, el mismo que marca una
alternativa errada, y «Volver al módulo completo» usa `i-swap-horiz`. `static/resources/`
no se tocó.

### Un efecto que conviene tener escrito

**Pulsar «Repasar mis errores (0)» o entrar al repaso vuelve a dibujar la lista, y eso
cierra todas las justificaciones que estuvieran abiertas con «Ver por qué».** No es un
defecto: es la consecuencia directa de que el recuadro se dibuje vacío y de que
`pintar()` reconstruya la zona desde cero. Lo respondido no se pierde —eso lo sostienen
el almacén y la memoria de la visita—, pero las explicaciones que el estudiante había
desplegado a mano vuelven a su botón.

### El contraste que se corrigió sobre la marcha

**El borde del botón del repaso subió de `jsyellow/40` a `jsyellow/50`.** Medido, `/40`
sobre `ink` da **2,96:1**, justo bajo el 3:1 que WCAG 1.4.11 pide para el contorno de un
control; `/50` da **4,18:1**. Se cambió solo el botón nuevo. Sus dos vecinos quedaron
como estaban —el contador del panel en `jsyellow/40` (2,96:1) y «Reiniciar el módulo» en
`panel3` (1,31:1)—: vienen de iteraciones cerradas, se identifican por su texto, y
tocarlos habría cambiado la identidad del panel entero por algo fuera de alcance. Anotado
en `registro_log.md`.

### Hallazgos de proceso

**Dos rojos provocados salieron inertes, y los dos destaparon algo real.** Es el hallazgo
más útil de la iteración, porque un rojo que no dispara es una prueba que estaba pasando
sin mirar nada:

- **El rojo J** —contar como fallada una pregunta sin responder— no disparó porque la
  regla «está fallada» estaba escrita **dos veces**, en `falladasDe()` y dentro de
  `falladasDelModulo()`. Romper una dejaba la otra tapando el fallo. Se unificó: hoy
  `falladasDelModulo()` pasa por `falladasDe()`, y con eso el rojo dispara.
- **El rojo K** —el conjunto del repaso recalculado en cada dibujo— tampoco disparó,
  porque «la acertada sigue a la vista» se cumplía **por omisión**: nada repinta al
  responder, así que nada podía desaparecer. Se agregó la comprobación de que responder
  dentro del repaso **no reescribe** la zona de preguntas, y con ella el rojo dispara por
  los dos lados.

**Un camino muerto en `responder()`, y el rojo que lo cerró.** La etapa 2 dejó una rama
que sumaba las barras a mano cuando el clic no se podía resolver contra el banco. Se
revisó puerta por puerta y **ningún navegador puede llegar ahí**: toda alternativa
dibujada lleva su `data-alternativa` y su tarjeta su `data-pregunta`. Lo único que
sostenía esa rama era `probar-filtrado.mjs`, que fabricaba un botón pelado, o sea una
prueba comprobando una pantalla que no existe. Se quitó la rama y se arregló el guion
para que pulse lo que pulsa el estudiante. El **rojo AC** —dibujar una alternativa sin su
`data-alternativa`— lo confirma: antes pasaba en verde, ahora da 13 problemas.

**Dos premisas de `probar-filtrado.mjs` dejaron de ser ciertas con la memoria de la
visita**, y estaban escritas como motivo en el código:

- «Este guion corre sin almacenamiento, así que aquí no hay nada respondido» sostenía que
  el índice dijera «0/N». Sin almacenamiento **también** se recuerda, para eso existe la
  decisión 7. Lo que sostiene el cero es el orden —esa comprobación va primero—, y así
  quedó escrito. El bloque de modo degradado pasó a esperar lo que el guion respondió de
  verdad, llevando la cuenta en vez de suponerla.
- El bloque de las barras empezaba de cero sin pedirlo. Ahora **reinicia primero**, por el
  camino del estudiante, y de paso el guion ata `setupReinicio()` y `setupRepaso()` al
  arrancar, como hace `cuestionario-main.js`: antes corría sobre una página a medio
  conectar.

**`probar-escapado.mjs` ahora responde las 368 preguntas.** Hasta esta iteración solo
dibujaba, y como la justificación aparece al responder, la comprobación del escapado
habría pasado sin mirar una sola. Además siembra el almacén para provocar el camino de
«Ver por qué» sobre la fila hostil, y la guarda «todas o ninguna» dejó de admitir el cero.

**El servidor local se cayó a mitad de una corrida, y el guion cerró bien.**
`probar:escapado` terminó en **código 2 — NO SE PUDO PROBAR**, que es lo correcto por
H-013: nadie probó nada, y eso no es un aprobado. Se comprobó la base local antes de
seguir —`pregunta 900: 0`, 368 activas, ícono del módulo 2 en `devices`—: el guion murió
en el sondeo, **antes** de cargar contenido hostil, que es exactamente el orden que H-017
dejó escrito. Se relanzó el servidor y la corrida cerró en 0.