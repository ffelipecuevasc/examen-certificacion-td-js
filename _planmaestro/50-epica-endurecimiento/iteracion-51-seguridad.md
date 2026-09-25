# Iteración 51 · Seguridad

**Épica:** 50 · Endurecimiento y observabilidad **Estado:** 🔵 En curso · desde 2026-09-23 **Depende de:** épicas 10, 20, 30 y 40

## Objetivo

Endurecer las cabeceras del sitio y su política de seguridad de contenido, y dejar visible el consumo del Worker de
lectura frente a los límites del plan gratuito.

## Contexto

Con la capa de datos en producción, la superficie de ataque ya no es la de un sitio estático. Los riesgos reales son
tres: la inyección de contenido a través del banco de preguntas, el consumo del Worker de lectura acercándose a los
límites del plan gratuito, y la exposición involuntaria de algún extremo de escritura, que ADR-009 prohíbe.

**El sitio no tiene dominio propio: vive en `examen-certificacion-td-js.pages.dev`.**
Esto importa más de lo que parece — varias protecciones del plan gratuito de Cloudflare, incluidas las reglas de tasa
del panel, viven en una **zona**, y una zona requiere un dominio propio apuntando a Cloudflare. Confirmado el 2026-09-22
contra la documentación oficial: el archivo de Wrangler para Pages Functions admite `vars`,
`d1_databases`, `durable_objects`, `hyperdrive`, `kv_namespaces`,
`queues.producers`, `r2_buckets`, `vectorize`, `services`,
`analytics_engine_datasets` y `ai`. **`ratelimits` no está en esa lista**: es exclusivo de Workers, y la capa de datos
de este proyecto son funciones de Pages (ADR-011). No asumas que otra protección de las que siguen abajo está disponible
sin comprobarlo primero — es el mismo patrón que ya salió una vez.

**Decisión del autor, 2026-09-22: no se construye ningún mecanismo que rechace peticiones.** En su lugar, esta iteración
se limita a **vigilar** el consumo frente a los límites del plan gratuito. Es más barato y más honesto que levantar un
limitador aproximado sobre un mecanismo (Workers) que este proyecto no usa.

La política de seguridad de contenido merece cuidado por dos motivos concretos, los dos verificados contra el código y
no supuestos:

- El sitio carga tipografías externas (`fonts.googleapis.com`, `fonts.gstatic.com`). La fuente de datos, en cambio, **no
  es externa**: ADR-011 la decidió de mismo origen, bajo `/api/`, sin CORS. `connect-src 'self'` basta; escribir la
  política pensando en un dominio ajeno la deja más laxa de lo necesario.
- **Una política estricta de `style-src` rompía una sola cosa, y no era la que se creía.** La primera versión de este
  contexto decía que las tres barras de `cuestionario.html` quedarían clavadas en 0 %, y el autor decidió el
  2026-09-22 permitir `'unsafe-inline'` por eso. **No era cierto**, y se midió en un navegador el 2026-09-23: las
  barras se pintan con `.style.width` desde `components/cuestionario.js:255-257`, es decir por CSSOM, y la
  política no gobierna el CSSOM. Con la política estricta obligatoria y el código sin tocar, las barras se movieron
  exactamente igual, píxel por píxel. Lo que la política sí bloquea son los atributos `style="…"` escritos en el
  marcado, y había dos casos: los tres `style="width:0%"` de `cuestionario.html` —inofensivos, porque el JS escribe
  el ancho real— y el `style="animation-delay:…"` que `components/transicion-de-carga.js` metía por `innerHTML`.
  **Ese sí se rompía en silencio:** los tres puntos de la carga dejaban de ir desfasados y latían juntos, sin un solo
  error visible. Con la premisa corregida, el autor cambió la decisión (PARADA 1, decisión 1): política estricta, sin
  `'unsafe-inline'`, y se corrigen los dos casos.

## Decisiones de la PARADA 1

Tomadas por el autor el **2026-09-23**.

1. **Política estricta, sin `'unsafe-inline'`.** Se borran los tres `style="width:0%"` de `cuestionario.html` y el
   desfase de los puntos pasa a una clase. Con un pedido expreso: demostrar con evidencia real, contra el
   comportamiento de antes, que `components/cuestionario.js` y las tres barras siguen funcionando igual.
2. **Despliegue en dos pasos:** primero la política en modo informe (`Content-Security-Policy-Report-Only`), después
   obligatoria, cuando el autor confirme la consola limpia en producción.
3. **El conjunto de cabeceras de la sección 1 de la PARADA 1**, con sus omisiones: `X-Content-Type-Options` y
   `Referrer-Policy` no se repiten en `_headers` porque Pages ya las envía, y `Strict-Transport-Security` sobra
   porque todo `.dev` está precargado en HSTS.
4. **Vigilancia por el panel de Cloudflare más `90-manual/`**, no por un script con token.
5. **`/api/estado` se queda público tal cual.** Lo único interno que muestra es la ruta `d1/migraciones/` en
   `SIN_ESQUEMA`, y el repositorio es público. H-022 lo diseñó informativo a propósito.
6. **El enlace a `acerca-de.html` va en la franja inferior del pie, junto al copyright.**

## Tareas

- [x] Definir y aplicar las cabeceras de seguridad, incluida la política de seguridad de contenido:
  `connect-src 'self'`, `style-src` **sin** `'unsafe-inline'` más el dominio de la hoja de tipografías, y el resto
  ajustado a lo que el sitio realmente carga. _Etapa A: `_headers` en la raíz, en modo informe (decisión 2)._
- [x] Borrar los tres `style="width:0%"` de `cuestionario.html` y pasar el desfase de los puntos de
  `transicion-de-carga.js` a tres clases `[animation-delay:…]`. _Etapa A._
- [x] Verificar que la política no rompe las tipografías, los módulos ES ni las barras de progreso. _Etapa A: en un
  navegador, con la política obligatoria; ver las notas._
- [x] Poner las cabeceras de `/api/` desde `functions/api/_middleware.js`: `_headers` no se aplica a las respuestas de
  las funciones. _Etapa A._
- [x] `scripts/comprobar-csp.mjs`, `scripts/probar-respaldo.mjs` y `scripts/probar-cabeceras.mjs`, dentro de
  `npm run verificar`. _Etapa A._
- [x] Sumar `_headers` a `LISTA_COPIA` en `scripts/build-dist.mjs`. Pages lo lee solo en la raíz de lo publicado, y lo
  que no está en esa lista no llega a `dist/` sin que el build avise: las cabeceras quedarían escritas en el
  repositorio y ausentes del sitio.
- [x] Sumar `acerca-de.html` a `LISTA_COPIA` y a `PAGINAS` en `scripts/build-dist.mjs`, y a `PAGINAS` en
  `scripts/comprobar-copias.mjs`. **Hoy ninguno de los dos la nombra** (comprobado el 2026-09-23): no puede nombrarla
  antes de que exista, porque `LISTA_COPIA` trata cada entrada como obligatoria y el build se detendría. Entra en el
  mismo cambio que crea la página. _Etapa B, junto con `comprobar-csp.mjs`, `probar-cabeceras.mjs` y la sección de
  la advertencia retirada de `probar-identidad-visual.mjs`, que recorren las mismas páginas._
- [x] Investigar, antes de intentar activar nada, cuáles protecciones del plan gratuito siguen disponibles sin dominio
  propio (Bot Fight Mode, otras reglas del panel) y cuáles requieren una zona igual que el límite de tasa. Documentar
  cuáles se activan, cuáles no aplican y por qué. _Etapa C: `90-manual/vigilancia-del-consumo-y-protecciones.md`, sección 4. Solo aplica Access para las
  previsualizaciones, y el autor la aplazó el 2026-09-25._
- [x] Revisar que ninguna protección afecte al estudiante legítimo: nada que introduzca verificaciones intrusivas
  contradice el principio de cero fricción. _Etapa C: la única que aplica no cubre la dirección principal, y el manual
  trae la comprobación de las dos mitades._
- [x] Dejar visible el consumo del Worker de lectura y de D1 frente a los límites del plan gratuito (H-008), con los
  números del límite escritos junto a la medición. _Etapa C: `90-manual/vigilancia-del-consumo-y-protecciones.md`, secciones 1 a 3._
- [x] Confirmar que un rechazo por consumo excesivo de la plataforma —un 429 nativo de Cloudflare, no construido por
  este proyecto— activa el mismo respaldo que cualquier otra falla: `SIN_RESPUESTA` en `datos.js`, instantánea con
  aviso. _Etapa A: `probar:respaldo`. La mitad de producción se reemplazó por esta evidencia el 2026-09-25 (ver el
  criterio del 429)._
- [x] Verificar que ningún extremo de escritura es alcanzable públicamente, según ADR-009. _Etapa A, en local._
- [x] Revisar que el Worker no filtre detalles internos en sus mensajes de error. _Etapa A._
- [x] Decidir y documentar si `/api/estado` sigue público tal cual —entorno, estado del esquema, conteo de preguntas
  activas— o si algo de eso se restringe. H-022 lo diseñó informativo a propósito; esta tarea es documentar la decisión,
  no cambiar el comportamiento salvo que el recorrido encuentre un motivo real. _Decidido: público tal cual
  (decisión 5)._
- [ ] Cerrar el hallazgo H-006 con `acerca-de.html` como entregable. Decisión del autor, 2026-09-23: **una sola página
  reúne todo**. Se enlaza **únicamente desde el pie** de las tres páginas, **nunca desde el menú del encabezado**, ni
  en escritorio ni en móvil. Decisión del autor, 2026-09-23, escrita como restricción y no como descripción: el
  encabezado ya tiene seis enlaces apretados cerca de los 768 px (iteración 44), y un séptimo ahí sería exactamente el
  deslizamiento silencioso que este proyecto persigue. La página reúne:
  - **La licencia del código: MIT.**
  - **La licencia del banco de preguntas: Creative Commons BY-NC-SA 4.0**, distinta de la del código. Motivo: las
    preguntas parten de material oficial público, pero la redacción de cada enunciado, las alternativas y sobre todo
    las 368 justificaciones son expresión propia del autor. Lo protegible no son los hechos, es cómo se explicaron. MIT
    permitiría revender el trabajo como propio con solo dejar un aviso que nadie lee; BY-NC-SA permite compartir y
    usar, con crédito, pero no revender ni republicar con fines comerciales.
  - **Las tres atribuciones de terceros**, con la cita completa de la fila de `acerca-de.html` en `registro_log.md`:
    animate.css bajo Hippocratic License 2.1, Material Line Icons (`line-md`) de Vjacheslav Trushkin, y Material
    Symbols de Google bajo Apache 2.0.
  - **La nota de privacidad.** Describe lo que el sitio hace hoy: el avance y el intento del simulacro se guardan en el
    almacenamiento del navegador (ADR-034, ADR-035) y no salen del dispositivo. Si la 52 agrega métricas, la actualiza
    ella.
- [x] Separar la licencia del código de la del contenido. Decisión del autor, 2026-09-23: `package.json` se queda con
  `"license": "MIT"`, porque ese campo habla del código y no del contenido, y `LICENSE.md` en la raíz aclara la
  división: el código bajo MIT y el banco de preguntas aparte bajo CC BY-NC-SA 4.0, con enlace a `acerca-de.html`
  para el detalle. Escrito el 2026-09-23, antes de la PARADA 1. **Su enlace apunta a una página que todavía no
  existe** hasta que esta iteración la publique.
- [x] Extender `scripts/comprobar-copias.mjs` para que vigile la restricción del enlace: `acerca-de.html` aparece en el
  pie de las tres páginas y **no aparece** en ninguno de los dos menús del encabezado. _Etapa B: prueba 8._
- [x] Cuando el autor publique `acerca-de.html`, escribir en su fila de `registro_log.md` que se cierra el período sin
  atribución visible de animate.css, aceptado el 2026-09-15 por la decisión 7 de la iteración 36. **No antes.**
  _Escrito el 2026-09-23 por decisión del autor, **condicionado únicamente a la publicación** en la etapa D: la página
  está terminada y lo único que falta es desplegarla._
- [x] Documentar toda la configuración manual en `90-manual/`. _Etapa C: `90-manual/vigilancia-del-consumo-y-protecciones.md` y
  `90-manual/cabeceras-y-politica-de-contenido.md`, que es el procedimiento de la etapa D._

## Criterios de aceptación

- [ ] Las cabeceras de seguridad están activas y se muestran las respuestas que lo confirman.
- [x] `dist/_headers` existe después de `npm run build`, y las cabeceras se leen en la respuesta de `wrangler pages dev`
  antes de publicar.
- [x] Con la política aplicada, las cuatro páginas —`index.html`, `cuestionario.html`, `simulacro.html` y
  `acerca-de.html`— funcionan sin errores de consola, incluidas las barras de progreso pintándose con normalidad.
  _Dado por bueno por el autor el 2026-09-23: las cuatro páginas, 0 mensajes con la política obligatoria (etapa B), y
  las barras sin diferencias en 7 pasos (etapa A); la etapa B no tocó `cuestionario.js` ni la política._
- [x] Las protecciones activadas están documentadas con su motivo, y las que no aplican sin dominio propio están
  nombradas como tales, no omitidas en silencio.
- [x] Un estudiante puede entrar y estudiar sin ninguna verificación intermedia. _Hoy no hay ninguna activada; si
  se activa Access, la sección 4 del manual comprueba que la dirección principal siga abierta._
- [ ] Existe una forma de ver, sin adivinar, cuánto del límite diario de peticiones y de lecturas de D1 se está
  consumiendo. _Escrito en `90-manual/vigilancia-del-consumo-y-protecciones.md`; falta que el autor confirme las rutas en el panel._
- [x] Está escrito, con números, cuál es el límite del plan gratuito y en qué punto conviene preocuparse (H-008).
- [x] Ningún mecanismo de esta iteración rechaza peticiones de un estudiante legítimo: la vigilancia informa, no
  bloquea.
- [x] Un 429 de la plataforma recibe el mismo trato que cualquier otra falla de la capa de datos: se enciende el
  respaldo, y no se muestra una página rota. **Se cumple con evidencia sintética, no con un apagón real.** La prueba 7
  de la etapa A (`probar:respaldo`) reemplaza `fetch` por respuestas fabricadas, y cualquier respuesta ajena al sobre
  propio enciende el respaldo: un 429 en HTML con la página del error 1027, un 429 en JSON ajeno, un 503, la red
  caída. Resultado: 11 de 11, y en rojo cuando se le devolvió la regresión de H-018.
  _**Criterio reescrito el 2026-09-25 por decisión del autor**, y no dejado sin cerrar. Decía «un 429 provocado
  (simulado o real)… lo ejecuta el autor contra el sitio publicado». Fabricar un 429 real exige agotar la cuota diaria
  de la cuenta, y eso deja sin servicio a los estudiantes reales hasta el reinicio, solo para probar algo que ya está
  probado. La regla no depende del cuerpo de la respuesta, así que tampoco la rompe un cambio en la página de error
  de Cloudflare. Detalle en `90-manual/cabeceras-y-politica-de-contenido.md`._
- [x] Un recorrido de los extremos del Worker confirma que ninguno permite escribir sin autorización.
- [x] Un error provocado en el Worker no revela estructura interna ni consultas.
- [x] La decisión sobre `/api/estado` está escrita, se cumpla o se cambie el comportamiento.
- [x] `acerca-de.html` existe, llega a `dist/`, se enlaza desde el pie de las tres páginas, y contiene la licencia MIT
  del código, la CC BY-NC-SA 4.0 del banco con su motivo, las tres atribuciones y la nota de privacidad.
- [x] `npm run verificar:copias` pasa con `acerca-de.html` en su `PAGINAS`: el pie con el enlace nuevo es idéntico en
  las cuatro páginas.
- [x] **El enlace a `acerca-de.html` existe en el pie de las tres páginas y NO existe en ninguno de los dos menús de
  encabezado, ni el de escritorio ni el móvil.** Lo comprueba `npm run verificar:copias`, y se demuestra provocándolo:
  con el enlace puesto en un menú, el comprobador falla y nombra la página y el menú.
- [x] El repositorio declara las dos licencias por separado, código y banco, de forma que nadie pueda leer la del código
  como si cubriera las preguntas.
- [x] La configuración manual está documentada con el detalle suficiente para reconstruirla.

## Notas de la iteración

### Etapa A · 2026-09-23 · cabeceras, política, middleware y sus pruebas

Siete pruebas, en el orden en que se hicieron fallar. Cada una se vio en rojo antes de darla por buena en verde.

| # | Prueba | Rojo | Verde |
|---|---|---|---|
| 1 | `probar:cabeceras` sin servidor | código **2**, «no se pudo probar», no 1 ni 0 | es el tercer veredicto: no se pone verde |
| 2 | `probar:cabeceras` sin `_headers` | faltan las cuatro cabeceras en las 5 URL estáticas | — |
| 3 | `_headers` escrito pero fuera de `LISTA_COPIA` | «dist/_headers no existe»: el archivo existía y el sitio no tenía ninguna | agregado a `LISTA_COPIA`: las 4, iguales, en las 5 URL |
| 4 | `verificar:csp` sobre el código de entonces | exactamente los 4 puntos: `cuestionario.html:119, 131, 143` y `transicion-de-carga.js:402` | tras corregirlos, COMPATIBLE en 3 páginas, 24 archivos de `static/js/` y el CSS |
| 4b | `verificar:csp` sobre copias temporales | 7 de 7 plantados (script en línea, `onclick`, script ajeno, `setAttribute('style')`, `style=` en marcado, `eval`, `fetch` ajeno) y 3 de 3 aflojamientos de la política | — |
| 5 | cabeceras de `/api/` | faltan en los 3 extremos: Pages no aplica `_headers` a las funciones | con el middleware, `nosniff` y `default-src 'none'; frame-ancestors 'none'` en los 3 |
| 6 | escritura y fugas | con una copia de `_comun.js` que devuelve la traza, la sección 2 falla | 12 escrituras rechazadas (405 en los extremos reales, 404 en el inexistente), 3 errores de lectura sin fugas |
| 7 | `probar:respaldo` | con una copia de `datos.js` que tiene de vuelta la regresión de H-018: 3 de 11 fallan, justo los 429 en JSON ajeno | 11 de 11 |

**La evidencia de la decisión 1, en un navegador.** Se hizo con un arnés que maneja el Chrome instalado por su
protocolo de depuración, **sin ninguna dependencia y fuera del repositorio**. El escenario: abrir `cuestionario.html`,
cargar el módulo 2 y responder cinco preguntas (bien, mal, bien, bien, mal), leyendo tras cada paso el `style.width` y
el ancho en píxeles de las tres barras y los contadores. También se registró el desfase calculado de los tres puntos
de carga.

| Corrida | Barras | Puntos | Violaciones |
|---|---|---|---|
| R1 · código de antes, sin política | 0 → 2 → 4 → 6 → 8 → 10 % | 0 s / 0,2 s / 0,4 s | 0 |
| R2 · código de antes, política estricta **obligatoria** | idénticas a R1 | **0 s / 0 s / 0 s** | 6 |
| R3 · código corregido, política estricta **obligatoria** | **idénticas a R1** | **0 s / 0,2 s / 0,4 s** | **0** |

R1 contra R3: **cero diferencias** en 7 pasos × 7 valores más los puntos. R1 contra R2 marca la diferencia de los
puntos, que es la prueba de que la comparación ve. `index.html` y `simulacro.html` cargaron también con la política
obligatoria: 0 violaciones y 0 mensajes de consola, con las tipografías de Google cargadas. El recorrido dinámico de un
intento del simulacro queda para la pasada de navegador del autor.

**Tres cosas que salieron al construir:**

- **`wrangler pages dev` sí aplica `_headers`.** La documentación no lo dice. Se comprobó en la prueba 3: la prueba de
  red mide en local lo mismo que Pages va a servir.
- **En modo informe, Chrome sí escribe las violaciones en la consola, pero como mensajes de nivel _info_, no como
  errores rojos:** «Applying inline style violates the following Content Security Policy directive…». Esto importa en
  el paso 1 del despliegue: **una consola filtrada a errores da un falso limpio.** «Limpia» ahí significa que no aparece
  ningún mensaje «…violates the following Content Security Policy…» en ningún nivel.
- **El detector de fugas tenía un punto ciego, y lo encontró su propia demostración.** No reconocía una traza de V8
  con marco anónimo serializada en JSON (`\n    at file:///…:176:20`). Se corrigió el patrón y la autoprueba ahora
  incluye esa forma.

**Un incidente del arnés, registrado porque toca una regla de CLAUDE.md.** El guion que reiniciaba el servidor local
—fuera del repositorio— leyó un `servidor.pid` vacío como PID 0 y ejecutó `taskkill /T` sobre ese árbol, que es el
del sistema. Windows rechazó los seis procesos del árbol (0, 4, 72, 128, 548 y 2684) y **no se terminó ninguno**: los
seis son el árbol completo de PID 0, y los seis aparecen rechazados. El guion quedó corregido: solo detiene un PID que
sea un entero positivo y cuyo proceso sea el `cmd.exe` que lanzó él mismo.

**Lo que queda pendiente del lado del autor:** `static/css/style.css` cambió —tres reglas nuevas, ninguna quitada— y
`npm run verificar` marca `css` como DESFASADO hasta el commit.

### Etapa B · 2026-09-23 · `acerca-de.html`, su enlace y la prueba 8

La prueba 8 se escribió antes que la página, y se vio en rojo por su propia causa.

| # | Caso | Resultado | Código |
|---|---|---|---|
| 8 · rojo | `verificar:copias` con `acerca-de.html` en `PAGINAS`, sin página ni enlace | las 3 páginas sin el enlace en la franja inferior del pie, y «falta acerca-de.html» | **1** |
| 8 · intermedio | con el enlace en las 3 páginas y la página todavía sin escribir | «falta acerca-de.html: no hay con que comparar» | **2**, no 0 |
| 8 · verde | con la página y el enlace | 6 parejas iguales por bloque; el enlace está en las 4 franjas y falta en los 8 menús y en el resto del encabezado | **0** |
| 8a | plantado en el menú de escritorio de `cuestionario.html` | nombra la página y «el menú de escritorio», más las 3 parejas distintas | 1 |
| 8b | plantado en el menú móvil de `index.html` | nombra la página y «el menú móvil» | 1 |
| 8c | plantado en **los dos menús de las cuatro páginas** | las copias siguen iguales entre sí, y aun así salen los **8** rojos, uno por página y por menú | 1 |
| 8d | plantado en el encabezado de `simulacro.html`, fuera de los menús | «el encabezado, fuera de los dos menús» | 1 |
| 8e | **quitado del pie de las cuatro** | las copias siguen iguales, y salen las 4 franjas sin el enlace | 1 |
| 8f | citado en un comentario dentro del menú | no es un enlace, y sigue verde | 0 |

8c y 8e son los que justifican la comprobación: en los dos, la comparación de copias da verde, porque las cuatro dicen
lo mismo. Solo la exigencia de presencia en un lugar y de ausencia en el otro los caza. Los casos se corrieron sobre
copias temporales de las cuatro páginas y del guion, fuera del repositorio.

**El build también lo vigila, por el otro lado.** Con `acerca-de.html` quitada de `LISTA_COPIA` y de `PAGINAS` en
una copia de `build-dist.mjs`, el build se detiene: «1 referencia(s) sin destino dentro de dist/: acerca-de.html».
El enlace del pie la vuelve una referencia de las otras tres páginas. Con la lista real: «6 entradas copiadas»,
«36 recursos enlazados, ninguno roto».

**En un navegador**, con el mismo tipo de arnés de la etapa A (Chrome instalado, por su protocolo de depuración, sin
dependencias y fuera del repositorio) y la política **obligatoria** reescrita en la respuesta: las cuatro páginas
cargaron con **0 mensajes** de consola, de excepción o de registro, en todos los niveles. El arnés sabe ver: con un
`style="…"` sembrado en `acerca-de.html`, registró la violación como error de seguridad. En 375 px, `acerca-de.html`
abre y cierra el menú de teléfono, escribe el año del pie, carga las tres tipografías, pinta sus cinco íconos por
máscara y no se desborda a lo ancho.

**Un hallazgo al escribir la página, que no se resolvió en ella.** La fila de `registro_log.md` pedía recorrer lo que el
sitio usa antes de escribir las atribuciones, y el recorrido encontró más orígenes que los tres anotados: 39 íconos de
Material Symbols (no 44), más tres de SVG Logos, uno de Huge Icons y el logotipo de NotebookLM sin aviso. **Decisión
del autor, 2026-09-23:** la página sale con las tres pedidas, y el resto va a «Sin asignar», con la licencia de cada
origen por comprobar.

**Seguimiento el mismo día, por decisión del autor: los orígenes nuevos se investigan y entran ahora**, sin abrir un
segundo vacío fechado como el de animate.css. Cada licencia se leyó en su fuente:

| Origen | Archivos | Licencia, y dónde se leyó | Resultado |
|---|---|---|---|
| SVG Logos, de Gil Barbara | `js-logo.svg`, `github-icon.svg`, `linkedin-icon.svg` | **CC0 1.0 Universal**, en el `LICENSE.txt` que el propio aviso enlaza; la cláusula 4.a y el README dejan las marcas a sus dueños | entra en la página |
| Huge Icons, de Hugeicons | `web-internet-icon.svg` | **MIT, «Copyright (c) 2025 Hugeicons»**, en `github.com/hugeicons/hugeicons/LICENSE.md`. El aviso del SVG decía «undefined» porque Iconify declara MIT sin dirección; el SVG es idéntico a `hugeicons:internet`, y `InternetIcon` está en el catálogo gratuito (los Pro tienen otra licencia) | entra, y el aviso del SVG pasa a llevar esa dirección |
| Logotipo de NotebookLM | `notebooklm-gemini-icon.svg` | **ninguna conocida**: el archivo no trae aviso, su commit (`107694d`) no dice de dónde salió, y las directrices de marca de Google piden aprobación previa sin publicar una licencia abierta | **no entra**: queda en «Sin asignar» para que decida el autor |

De paso, la fila de line-md dejó de decir «su licencia»: su `license.txt` es el texto MIT con «Copyright 2020
Vjacheslav Trushkin».

**Lo que queda del lado del autor:** `static/css/style.css` cambió por las clases nuevas de la página, así que
`npm run verificar` marca `css` como DESFASADO hasta el commit. El período sin atribución visible de animate.css sigue
abierto hasta que `acerca-de.html` se publique, y H-006 se cierra con esa publicación.

### Etapa C · 2026-09-23 · vigilancia del consumo, protecciones y manual

**Cada límite y cada comportamiento se leyó en la documentación oficial de Cloudflare el mismo día**, en su versión
Markdown, y el manual nombra la página de cada uno. Tres datos que cambian la lectura de H-008:

- **Solo las peticiones a `/api/` cuentan.** Las páginas y los archivos estáticos son gratis e ilimitados en Pages.
- **Los límites son de la cuenta.** Las 100 000 peticiones y las 5 millones de filas diarias se comparten con
  cualquier otro proyecto de la cuenta y con la base de pruebas.
- **Desde el 1 de septiembre de 2026, D1 gratuito falla al pasar su límite**, y el correo de Cloudflare llega al
  alcanzarlo, no antes. El sitio cae entonces a la instantánea con aviso: `FALLO_CONSULTA` con `usar_respaldo`, que
  ya es un control de `probar:respaldo`.

**El consumo se midió, no se dedujo:** un arnés fuera del repositorio recorrió en Chrome visitas reales contra el
servidor local con las 368 preguntas, y anotó cada petición a `/api/` con el `filas_leidas` de su respuesta.

| Visita | Peticiones | Filas |
|---|---|---|
| portada, «Acerca de» | 0 | 0 |
| abrir el cuestionario | 2 | 1111 (+ `/api/estado`, sin dato) |
| los siete módulos | 7 | 4073 |
| un simulacro completo, hasta su revisión | 3 | 6693 |
| **sesión completa** | **12** | **11 877** |

La base local reproduce la de producción: `?resumen=1` da 1111 filas en las dos. **Las filas de D1 se agotan unas
veinte veces antes que las peticiones:** caben unas 420 sesiones completas por día contra unas 8300 por peticiones.
Los umbrales de atención (50 %) y de acción (80 %) quedaron escritos en el manual como propuesta.

**Protecciones:** Bot Fight Mode y las reglas del WAF (de tasa y personalizadas) se configuran en una zona, y sin
dominio propio no hay zona. Bot Fight Mode, además, chocaría con la política estricta, porque su detección inyecta
un script en línea. La protección DDoS de capa 7 no se configura desde aquí. **La única que aplica es Access para las
previsualizaciones:** cada despliegue queda público para siempre en `<hash>.examen-certificacion-td-js.pages.dev`, y
la política cubre esas direcciones sin tocar la principal. El autor la aplazó el 2026-09-25 (ver el cierre de la
etapa, abajo), y el manual trae cómo activarla y comprobar las dos mitades cuando se decida.

**Un aviso operativo, repetido dos veces en esta sesión:** detener la tarea de fondo que lanzó `wrangler pages dev`
no detiene el `node` de Wrangler ni su `workerd`, y el puerto 8788 queda tomado. Las dos veces se comprobó que el
proceso era el lanzado en la sesión (su línea de comandos y su hora de inicio), se detuvo su árbol y se comprobó el
puerto libre, como permite CLAUDE.md.

**Lo que queda del lado del autor:** confirmar en el panel las rutas de la sección 3 del manual con una primera
lectura real de producción, decidir Access, ejecutar la etapa D y acordar cómo provocar el 429 en producción.

### Cierre de la etapa C · 2026-09-25 · tres decisiones del autor

1. **El logotipo de NotebookLM se conserva, como uso nominativo.** `acerca-de.html` le da su propia fila en «Lo que es de
   terceros»: es una marca de Google, no se usa bajo una licencia citable —Google exige aprobación previa para su marca
   y este sitio no la tiene—, se usa solo para identificar el producto al que lleva el enlace, y no indica patrocinio.
   La introducción de la sección dejó de decir que todo lo de terceros tiene licencia. La fila de «Sin asignar» se cerró.
2. **Access para las previsualizaciones no se activa por ahora.** Es un aplazamiento, no un no: activarla cambia el
   flujo de trabajo del autor, porque ver cualquier previsualización futura pediría sesión iniciada. Queda en «Sin
   asignar», con los despliegues viejos públicos aceptados a sabiendas, y el manual la deja lista para cuando se decida.
3. **El criterio del 429 en producción cambió de forma:** se cumple con la evidencia sintética de la prueba 7 de la
   etapa A, no con un apagón real que dejaría sin servicio a los estudiantes. Reescrito arriba, con el motivo.

**Verificado al cerrar:** el manual dice que las 00:00 UTC son las 21:00 en Chile con horario de verano (UTC−3) y las
20:00 con el de invierno (UTC−4), que es lo correcto; lo confirmó el autor contra fuentes independientes. En la PARADA 1
se había dicho con verano e invierno invertidos, y esa versión no quedó escrita en ningún archivo del repositorio.

**La etapa C queda cerrada.** Queda la D, que es del autor: confirmar las rutas del panel con una lectura real, desplegar,
comprobar las cabeceras en producción, revisar la consola en modo informe en las cuatro páginas, pasar la política a
obligatoria y publicar `acerca-de.html`, que cierra el período de animate.css y H-006.
