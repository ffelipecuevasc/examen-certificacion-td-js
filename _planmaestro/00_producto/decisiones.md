# Decisiones de arquitectura (ADR)

Registro de decisiones cerradas. **No revertir ninguna sin añadir una entrada nueva
que la sustituya explícitamente.** Claude Code debe leer este archivo al inicio de
cada iteración.

**Estados:** ✅ Aceptada · ⏸️ Propuesta · ❌ Sustituida · ✅ (parcial) Vigente salvo en
lo que otra ADR posterior sustituya explícitamente

---

## ADR-001 · Sitio estático sin backend propio

**Estado:** ❌ Sustituida por ADR-007 · **Fecha:** 2026-08-20

**Decisión original.** El sitio es estático. No hay servidor de aplicación, base de
datos ni proceso propio en ejecución.

**Motivo original.** El proyecto lo mantiene una sola persona junto a su trabajo
docente. Un backend implica costo, actualizaciones de seguridad y un punto de caída.

**Actualización · 2026-09-02.** Sustituida por ADR-007, que incorpora Cloudflare
Workers y D1 como capa de datos. Lo que sigue vigente de esta ADR es su motivo: la
carga de mantención debe permanecer mínima. Por eso ADR-007 acota el backend a
lectura de datos y exige que el sitio siga siendo utilizable si esa capa cae.

**Sigue vigente.** Las respuestas correctas que llegan al navegador son visibles
para quien inspeccione el código. ADR-007 abre la puerta a cambiar esto, pero
mientras no se decida lo contrario, se asume.

**Actualización · 2026-09-05.** Ya se decidió, y se decidió que no cambia: **ADR-022**
cierra esa puerta a propósito. Las respuestas correctas son visibles, van a seguir
siéndolo, y el simulacro no puede garantizar lo contrario.

---

## ADR-002 · Tailwind CSS compilado localmente, nunca por CDN

**Estado:** ✅ Aceptada · **Fecha:** 2026-08-28

**Decisión.** Tailwind v3 se compila localmente. El CSS resultante se versiona en el
repositorio. El script del CDN queda prohibido.

**Motivo.** El CDN descarga un compilador al navegador y genera el CSS en cada
visita, lo que bloquea el renderizado y provoca un parpadeo de estilos. El compilado
local entrega un archivo estático y cacheable, varias veces más liviano.

**Consecuencia.** Hay que recompilar antes de publicar. Las clases usadas dentro de
plantillas de JavaScript deben estar cubiertas por el `content` de la configuración,
o el purgado las elimina.

---

## ADR-003 · JavaScript nativo con módulos ES, sin framework ni bundler

**Estado:** ✅ Aceptada · **Fecha:** 2026-08-30

**Decisión.** El código del navegador es JavaScript ES6+ con módulos ES nativos.
Sin React, sin TypeScript, sin empaquetador.

**Motivo.** El sitio enseña JavaScript a principiantes. Que su propio código sea
legible por su público objetivo es un valor, no una limitación. Además elimina una
cadena de herramientas que habría que mantener.

**Consecuencia.** Las páginas deben servirse por HTTP; con `file://` los módulos no
cargan. Se asume la ausencia de reactividad automática: el DOM se actualiza a mano.

---

## ADR-004 · Los íconos se incrustan como data URI, no se cargan como archivo

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-02

**Decisión.** Los SVG de `static/resources/` se convierten a data URI dentro de
`static/css/icons.css` mediante `scripts/build-icons.mjs`. Se usan con la clase
`.icon .i-nombre`, que los pinta con máscara CSS y `currentColor`.

**Motivo.** Las máscaras que apuntan a un archivo `.svg` externo no se cargan cuando
la página se abre con `file://`, y el resultado es un ícono invisible sin ningún
error en consola. Incrustarlos elimina el problema en todos los contextos y ahorra
casi cuarenta peticiones.

**Consecuencia.** Al agregar un SVG hay que regenerar `icons.css`. Los archivos SVG
siguen siendo la fuente de verdad y se mantienen versionados.

---

## ADR-005 · El repositorio versiona los archivos generados

**Estado:** ❌ Sustituida por ADR-010 · **Fecha:** 2026-09-01

**Decisión.** `static/css/style.css` y `static/css/icons.css` se versionan, pese a
ser generados. `src/input.css` también se versiona: es código fuente.

**Motivo.** El despliegue elegido publica el repositorio tal cual, sin paso de
compilación. Si el CSS no está versionado, el sitio se publica sin estilos.

**Consecuencia.** Riesgo de publicar un compilado desactualizado. Se mitiga con una
comprobación previa a cada entrega. Si en el futuro se adopta un despliegue con
compilación propia, esta ADR debe sustituirse.

**Actualización · 2026-09-02.** Sustituida por ADR-010, que adopta exactamente ese
despliegue con compilación propia que la consecuencia anterior anticipaba. El
motivo de esta ADR —«el despliegue elegido publica el repositorio tal cual, sin paso
de compilación»— dejó de ser cierto, y con él se cae el razonamiento completo.

Conviene subrayar qué cambia y qué no, porque es fácil leerlo al revés: **la
práctica de versionar `style.css` e `icons.css` se mantiene**. Lo que se sustituye
es la razón para hacerlo. Ya no se versionan porque sean el artefacto que se
publica —no lo son, Cloudflare los regenera—, sino como copia servible de respaldo.
Ver ADR-010.

---

## ADR-006 · Las alternativas se barajan, salvo cuando se referencian por letra

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-02

**Decisión.** El orden de las alternativas se baraja en cada carga. Las preguntas
cuyas alternativas se refieren a otras por su letra («Ambas B y C son correctas»)
se marcan con `fijo` y conservan su orden original.

**Motivo.** En el banco inicial, la mitad de las respuestas correctas eran la
alternativa B. Sin barajar, el estudiante aprende la posición en vez de la materia.

**Consecuencia.** La marca de orden fijo es parte del esquema del banco de preguntas
y debe sobrevivir a la migración a D1 (iteraciones 21 y 24).


---

## ADR-007 · Cloudflare Workers y D1 como capa de datos

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-02 · **Sustituye a:** ADR-001

**Decisión.** El banco de preguntas se almacena en una base de datos **Cloudflare
D1**, expuesta al sitio mediante un **Worker** que sirve solo lectura. Las páginas
se publican en **Cloudflare Pages**, en el mismo dominio que el Worker.

**Motivo.** El banco crecerá a unas 300 preguntas y debe poder corregirse sin editar
código ni publicar el repositorio. Frente a la alternativa de una hoja de cálculo
externa, D1 mantiene el dato dentro de la misma plataforma que ya sirve el sitio:
sin dominios de terceros, sin CORS, sin permisos públicos sobre un documento ajeno,
y con consultas reales en vez de descargar el banco entero para filtrarlo.

**Consecuencia.** El proyecto deja de ser puramente estático y adquiere una
superficie que antes no tenía: un punto de caída, límites de uso del plan gratuito y
un canal por donde entra contenido de origen externo. Estas tres consecuencias se
tratan en ADR-008, en el hallazgo H-008 y en la iteración 22 respectivamente.

**Límite explícito.** El Worker sirve datos. No renderiza páginas, no gestiona
sesiones ni identifica estudiantes. Ampliar su rol requiere una ADR nueva.

**Actualización · 2026-09-05.** Esta ADR dejó abierta la pregunta de si el Worker
debía dejar de enviar la respuesta correcta al navegador durante el simulacro, y
validar del lado del servidor. **Esa pregunta quedó resuelta en contra por ADR-022**,
que decide que la instantánea de respaldo incluya las respuestas correctas y, con
ello, hace imposible ocultarlas. El pendiente no sigue abierto: está cerrado, y lo que
se pierde está escrito en ADR-022. Lo demás de esta ADR sigue vigente.

---

## ADR-008 · Instantánea local de respaldo del banco

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-02

**Decisión.** El repositorio versiona una **instantánea** del banco de preguntas,
generada desde D1. Si el Worker no responde, el sitio carga la instantánea y avisa
al estudiante de que puede no estar al día.

**Motivo.** `vision.md` promete que el formato funciona íntegramente en el navegador
y que ningún servicio externo es condición para que funcione. ADR-007 introduce una
dependencia que, sin respaldo, rompería esa promesa: un estudiante repasando la
noche antes del examen no puede quedarse ante una página vacía porque una base de
datos no respondió.

**Consecuencia.** La instantánea puede quedar desfasada respecto a D1. Se regenera
como parte del procedimiento de publicación, y el desfase se declara al estudiante
cuando se está usando el respaldo, nunca en silencio.

**Consecuencia deseada.** El sitio conserva la propiedad de seguir siendo útil por
sí solo, que es lo que ADR-001 protegía.

**Actualización · 2026-09-05.** Dos decisiones de la iteración 22 desarrollan esta ADR
en lo que dejaba sin decir: **ADR-022** fija que la instantánea incluye las respuestas
correctas —sin ellas el modo degradado no puede corregir— y **ADR-023** fija que se
genera desde la base de la nube y en el mismo acto que el respaldo de ADR-014.

---

## ADR-009 · La escritura en D1 no se expone al público

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-02

**Decisión.** El Worker público expone **únicamente lectura**. Toda operación que
modifique el banco ocurre por un canal separado, autenticado, y nunca desde el sitio
que usan los estudiantes.

**Motivo.** Un extremo de escritura accesible desde el navegador sería la única
puerta de entrada real a este proyecto. No existe razón de producto para tenerla: el
único que edita el banco es el autor.

**Consecuencia.** Editar el banco exige una herramienta aparte. Cómo funcione esa
herramienta se decide en la iteración 23, pero cualquier opción debe cumplir esta
ADR.
---

## ADR-010 · El despliegue compila, y publica solo `dist/`

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-02 · **Sustituye a:** ADR-005

**Decisión.** Cloudflare Pages ejecuta `npm run build` en cada publicación y sirve
únicamente el contenido del directorio `dist/`, que ese mismo comando arma. `dist/`
no se versiona. Los archivos generados `static/css/style.css` e `icons.css` **sí se
siguen versionando**, ahora por un motivo distinto al de ADR-005.

**Motivo.** Tres razones, en orden de peso.

1. **Cierra H-005 en su raíz.** El CSS que llega al estudiante se compila siempre
   desde la fuente de ese mismo commit. El síntoma que describía el hallazgo
   —publicar sin estilos y que nadie lo note— deja de ser posible en producción.
2. **Convierte la exclusión en una lista de admitidos.** Con la raíz como
   directorio de salida habría que acordarse de excluir `_planmaestro/`, `CLAUDE.md`
   y los scripts. Con `dist/`, lo que no se copia explícitamente no se publica: el
   olvido deja de por sí algo fuera en vez de dejarlo dentro. Es la única de las dos
   formas que falla hacia el lado seguro.
3. **La iteración 12 lo exige de todos modos.** La capa de datos irá como funciones
   del proyecto de Pages, y eso implica construcción. Adoptarla ahora evita
   reabrir el asunto dentro de una iteración.

El argumento que se barajaba en contra —«un fallo de construcción deja el sitio sin
publicar»— resultó ser falso en esta plataforma. En Pages cada despliegue es
inmutable y solo un despliegue construido con éxito llega a servirse; una
construcción que falla nunca reemplaza a la versión viva. El riesgo real no es que
el sitio caiga, sino que se quede congelado en la versión anterior mientras llega
el aviso de fallo.

**Por qué se siguen versionando los generados.** Porque el repositorio conserva así
la propiedad de ser, por sí solo, una copia completa y servible del sitio. Es la
misma idea que ADR-008 protege para el banco de preguntas, aplicada a los estilos:
que ninguna pieza remota sea condición para que el material exista. Y deja una
salida de emergencia si la construcción llegara a estorbar.

**Consecuencia.** La vuelta atrás ya no es gratis. Con la raíz como salida habría
bastado con vaciar la orden de construcción; con `dist/` hay que hacer dos cosas en
el panel —vaciar la orden **y** devolver el directorio de salida a `.`— porque sin
construcción no existe `dist/`. Sigue siendo una maniobra de dos ajustes y ningún
cambio en el repositorio, pero conviene tenerlo escrito antes de necesitarlo.

**Consecuencia.** Los generados del repositorio pueden quedar desfasados respecto a
la fuente. El desfase pasa a ser cosmético: ya no afecta a lo que ve un estudiante,
porque no es lo que se publica. Se detecta con `npm run verificar`, que reconstruye
y falla si `static/css/` quedó distinto.

**Consecuencia.** Aparece una pieza que hay que mantener: `scripts/build-dist.mjs`,
con la lista de lo que se publica. Añadir un tipo de recurso nuevo al sitio obliga a
revisarla. El script comprueba al terminar que ninguna referencia de las páginas
quedó sin destino, de modo que el olvido detiene la construcción en vez de llegar a
producción.

**Límite explícito.** `dist/` es material desechable: se borra y se rehace entero en
cada construcción. Nada debe escribirse ahí a mano, ni esperar sobrevivir allí.

---

## ADR-011 · La capa de datos son funciones del proyecto de Pages, en el mismo origen

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-03

**Decisión.** La capa de datos no es un Worker desplegado aparte: son funciones del
propio proyecto de Cloudflare Pages, escritas en `functions/` en la raíz del
repositorio y servidas bajo `/api/` en el mismo dominio que las páginas.

Junto con el lugar se cierra la forma. Tres cosas quedan fijadas acá y no se
reabren en la épica 20:

1. **Toda respuesta tiene la misma forma.** Correcta: `{ ok: true, datos, meta }`.
   Fallida: `{ ok: false, error: { codigo, mensaje, usar_respaldo } }`.
2. **«No hay datos» no es un error.** Una consulta sin filas responde 200 con
   `ok: true`, la lista vacía y `meta.vacio = true`. Solo un `ok: false` con
   `usar_respaldo: true` autoriza al sitio a cambiar a la instantánea de ADR-008.
3. **Los nombres cruzan el límite sin traducirse**, en `snake_case`, a los dos
   lados: `usar_respaldo` en la función y `usar_respaldo` en el navegador.

**Motivo.** El mismo origen elimina CORS por completo: no hay dominio adicional que
mantener, ni configuración de origen cruzado que revisar cada vez que se agregue un
extremo. La documentación de Cloudflare exige que `functions/` esté en la raíz del
proyecto y no dentro del directorio de salida; se cumple, y `scripts/build-dist.mjs`
detiene la construcción si alguna vez llegara a colarse ahí. De otro modo Pages
dejaría de compilarla y la serviría como archivo, o sea que el código de la capa de
datos quedaría descargable en texto plano desde el sitio.

El punto 2 existe porque confundir «vacío» con «caído» tiene una consecuencia
concreta y silenciosa: el día que el banco se borre por accidente, el sitio
serviría la instantánea sin decir nada y el error quedaría escondido detrás del
respaldo, que es exactamente lo que ADR-008 no quiere.

El punto 3 se decidió al ver que la capa respondía `usar_respaldo` y el navegador
exponía `usarRespaldo`. Hoy es un campo; en la épica 20 serían decenas de columnas
del banco traducidas una por una, con el riesgo de que un renombre olvidado
devuelva `undefined` sin ningún error a la vista. Las filas de D1 llegan con el
nombre de su columna y así se quedan. El código del navegador que no toca datos de
la capa sigue en `camelCase`.

**Consecuencia.** El despliegue del sitio y el de la capa de datos son el mismo
acto: un `git push` publica ambos, y una construcción fallida deja las dos cosas en
la versión anterior. No se pueden desplegar por separado.

**Consecuencia.** Las direcciones bajo `/api/` quedan reservadas. Un archivo
estático que se llamara igual no se serviría nunca.

**Límite explícito.** Estas funciones son de solo lectura (ADR-009). Rechazan todo
método que no sea `GET` o `HEAD` con `METODO_NO_PERMITIDO`, sin llegar a consultar
la base.

---

## ADR-012 · El enlace con D1 se declara en `wrangler.toml` versionado

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-03 · **Modifica:** la regla de
credenciales de `CLAUDE.md`

**Decisión.** El enlace entre el proyecto de Pages y la base D1 se declara en un
`wrangler.toml` versionado, con el nombre del enlace, el nombre de la base y su
`database_id`. No se configura a mano en el panel.

Esto **modifica la regla de `CLAUDE.md`** que prohibía todo identificador de base de
datos en el código versionado. La regla pasa a distinguir dos cosas que antes
trataba igual:

- **Una credencial da acceso.** Un token de API, una clave, una contraseña. No se
  versiona nunca, en ningún archivo, bajo ninguna circunstancia.
- **Un identificador solo nombra.** El `database_id` de D1 es un UUID que dice
  *cuál* base, no *quién* puede abrirla: sin un token de la cuenta no sirve de nada.

La excepción es **específica para el `database_id` de D1 en `wrangler.toml`**. No es
una licencia general para versionar cualquier cosa que parezca un identificador:
cualquier otro caso necesita su propia ADR.

**Motivo.** Cloudflare ya busca ese archivo en cada construcción —el registro de la
iteración 11 lo dice: buscó configuración de Wrangler y no la encontró—, así que
declararlo no fuerza nada, ocupa un lugar que la plataforma tenía previsto. A
cambio, el enlace deja de vivir solo en un panel al que este repositorio no puede
mirar: se revisa en un diff, se reconstruye desde un clon y se corrige con un commit
en vez de con una sesión de clics recordada de memoria.

**Consecuencia · el archivo manda sobre el panel.** Desde que existe, la
documentación de Cloudflare es explícita: *«your Wrangler file is the source of
truth (…) you will be able to see, but not edit, the same fields when you log into
the Cloudflare dashboard»*. Los enlaces y las variables de ejecución que estén
puestos en el panel dejan de aplicarse si no están en el archivo. Antes del primer
despliegue con él hay que comprobar que el archivo dice lo mismo que decía el panel.

**Consecuencia · el directorio de salida se declara acá, la orden de construcción
no.** `pages_build_output_dir = "dist"` vive en el archivo y manda. La orden
`npm run build` **no se puede declarar en él**: sigue siendo un ajuste del panel, y
no hay forma de fijarla desde el repositorio. Queda como el único punto de la
publicación que el control de versiones no cubre, y por eso está escrito en
`90-manual/`.

**Consecuencia.** Que el directorio se declare en dos lugares —`wrangler.toml` y
`scripts/build-dist.mjs`— abre la puerta a que discrepen, y el síntoma engaña: el
sitio se publica vacío mientras `/api/` sigue respondiendo con normalidad. El script
compara ambos valores y detiene la construcción si no coinciden.

**Consecuencia.** Los despliegues de vista previa heredan la base declarada mientras
no exista un bloque `[env.preview]` propio. Hoy es inofensivo, porque la capa es de
solo lectura; deja de serlo cuando haya contenido real. Es tarea de la iteración 13.

---

## ADR-013 · Wrangler como dependencia de desarrollo

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-03

**Decisión.** Se incorpora `wrangler`, la herramienta de línea de comandos de
Cloudflare, como **dependencia de desarrollo** con versión fijada. Es la primera
dependencia nueva desde que se fijó el stack, y la autoriza esta ADR, tal como exige
`CLAUDE.md`.

**Motivo.** Sin ella hay tres cosas que no se pueden hacer, y ninguna es una
comodidad:

1. **Ejecutar `functions/` en el equipo del autor.** Un servidor de archivos
   estáticos no ejecuta funciones. Sin wrangler, cada corrección de una coma sería
   un push contra producción, que es justo lo que `CLAUDE.md` prohíbe.
2. **Una base D1 local.** Es criterio de aceptación de la iteración 12.
3. **Migraciones repetibles y respaldos exportables.** Son tareas de las iteraciones
   21 y 13. La alternativa es pegar SQL a mano en una consola web: no versionable,
   no repetible, no auditable.

**Qué NO es.** No es una dependencia del sitio. Nada suyo llega al navegador de
ningún estudiante: lo que se publica sigue siendo HTML, Tailwind compilado y módulos
ES nativos. No compila el JavaScript del sitio, no empaqueta, no transpila.
**ADR-003 queda intacta.**

**Precisión.** La construcción de Cloudflare ejecuta `npm install`, que instala
también las dependencias de desarrollo —es la misma vía por la que llega
`tailwindcss`, que sí hace falta—. O sea que wrangler se descarga en la máquina de
construcción aunque `npm run build` no la mencione ni la ejecute. El costo es tiempo
de construcción, no superficie del sitio.

**Consecuencia.** `.wrangler/` guarda la base local y la sesión iniciada contra
Cloudflare: queda ignorado por git, junto con `.dev.vars`. El antecedente H-001
enseñó que en este repositorio el `.gitignore` merece revisarse antes y no después.

**Consecuencia.** Se va con la plataforma. Si algún día se abandona Cloudflare, esta
dependencia se desinstala y no deja rastro en el código del sitio.

---

## ADR-014 · Dos respaldos con papeles distintos: Time Travel y la exportación versionada

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-03

**Decisión.** La base D1 se protege con dos mecanismos que no compiten, porque
cubren pérdidas distintas.

1. **Time Travel es la recuperación inmediata ante un error propio.** Está siempre
   activo, no se configura ni se mantiene, y en el plan gratuito de este proyecto
   alcanza **7 días hacia atrás**, no 30. Los 30 días son del plan de pago, y es el
   límite que se asume mal con más frecuencia.
2. **La exportación a un archivo `.sql` es el respaldo oficial.** Vive versionada en
   el repositorio, en `d1/respaldo-banco.sql`, como **un solo archivo que se
   sobrescribe** en cada exportación.
3. **Se exporta después de cada cambio de contenido, no por calendario.**
4. **La restauración se ensaya contra la base de pruebas, nunca contra producción.**

**Motivo · por qué dos y no uno.** Time Travel vive *dentro* de D1: sirve para
deshacer un `DELETE` mal escrito diez minutos después, y no sirve para nada si se
pierde la base, la cuenta o el acceso a Cloudflare. La exportación es lo contrario:
no sirve para deshacer algo con cinco minutos de antigüedad, y es lo único que
sobrevive a perderlo todo. Tratarlos como alternativas lleva a elegir mal; tratarlos
como dos piezas con papeles distintos es lo que hace que el conjunto cubra.

Tres detalles del comportamiento de Time Travel que conviene tener escritos, porque
cambian cómo se usa:

- **La restauración es destructiva y sobrescribe la base en su lugar.** No crea una
  copia al lado. Es la razón por la que el punto 4 no es una precaución exagerada:
  «probar» una restauración contra producción *es* destruir producción.
- **Los marcadores anteriores sobreviven a una restauración**, así que una
  restauración equivocada se puede deshacer.
- **No hay nada que activar.** Ninguna tarea, ningún recordatorio, ninguna
  configuración que se pueda olvidar.

**Aviso sobre los 30 días.** La ayuda del propio comando —`wrangler d1 time-travel
restore --help`— dice «within the last 30 days», y `time-travel info` no menciona
plazo alguno. Ese texto es genérico: la herramienta no sabe en qué plan está la
cuenta. Los **7 días** de esta ADR salen de la documentación de límites de D1, que
distingue Workers Paid (30) de plan gratuito (7). Queda escrito para que nadie
«corrija» esta ADR con lo que dice la ayuda del comando.

**Motivo · por qué el archivo vive en el repositorio.** La objeción evidente es que
ADR-010 acababa de sacar del repositorio el contenido generado. No es lo que ADR-010
hizo: sacó `dist/`, que es el artefacto publicable y desechable, y en la misma
decisión mantuvo versionados `style.css` e `icons.css` con un argumento explícito
—que el repositorio conserve la propiedad de ser, por sí solo, una copia completa y
servible—. ADR-008 aplica esa misma idea al banco de preguntas. O sea que el
repositorio ya es, por decisión tomada dos veces, el lugar donde vive la copia de
respaldo de este proyecto. Esta ADR la continúa, no la contradice.

Las dos copias del banco no se sustituyen entre sí y conviene no confundirlas:

| | Para qué | Formato |
|---|---|---|
| Instantánea de ADR-008 | Que el **sitio** siga funcionando si la capa de datos cae | El que consume el navegador |
| `d1/respaldo-banco.sql` | Que la **base** se pueda reconstruir si se pierde | Volcado de esquema y datos |

Perder la cuenta de Cloudflare deja el sitio en pie gracias a la primera, y permite
rehacer la base gracias al segundo.

Lo demás pesa hacia el mismo lado: el banco no es secreto —las respuestas correctas
ya viajan al navegador, cosa que ADR-001 asume desde el principio—; un disco propio
es la única opción que falla sin avisar; y un servicio de almacenamiento aparte
sería una pieza más que mantener, justo lo que ADR-001 protege.

**Motivo · por qué un archivo sobrescrito y no una carpeta que crece.** Git ya es el
historial: cada exportación queda como un commit, con su fecha y su diff. Una
carpeta de respaldos fechados obliga a decidir cuándo podarla, y esa decisión se
posterga hasta que se toma mal. Como efecto secundario útil, el diff de cada
exportación muestra qué preguntas cambiaron entre una versión del banco y la
siguiente: revisión editorial que no cuesta nada.

**Motivo · por qué después de cada cambio y no por calendario.** Esta base no cambia
sola: solo cambia cuando el autor edita el banco. Un calendario produciría respaldos
idénticos entre sí durante semanas y, lo que es peor, daría sensación de cobertura
justo en el intervalo en que el cambio reciente todavía no está respaldado. Atar la
exportación a la edición hace que la ventana descubierta sea siempre corta, y que su
único ocupante sea Time Travel.

**Consecuencia.** La exportación deja de ser una tarea de mantención y pasa a ser
parte del procedimiento de editar el banco, que se define en la iteración 23. Si ese
procedimiento no la incluye, esta ADR queda incumplida aunque nadie lo note.

**Consecuencia.** Un respaldo que no se ha restaurado nunca no es un respaldo. La
restauración se ensaya contra `examen-td-js-pruebas`, que existe justamente para
poder romper algo sin consecuencias.

**Límite explícito.** Todo esto vale **mientras la base contenga solo el banco de
preguntas**. El día que guarde cualquier dato de una persona —el «modo docente» y el
«historial de intentos» ya están anotados como ideas—, un volcado en un repositorio
público deja de ser admisible y esta decisión se cae entera. No se parchea: se
sustituye por una ADR nueva.

**Riesgo asumido.** El formato de salida de `wrangler d1 export` no está garantizado
estable entre versiones de la herramienta. Un cambio de formato produciría un diff
enorme que no corresponde a ningún cambio de contenido. Si ocurre, se acota el
volcado o se normaliza antes de guardarlo; se sabrá en la primera exportación real.

---

## ADR-015 · Claude Code no ejecuta wrangler contra la cuenta de Cloudflare

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-03

**Decisión.** Claude Code puede ejecutar wrangler **solo en local**. La regla es
comprobable mirando el comando: todo lo que ejecute lleva `--local` explícito, y la
única excepción es `wrangler pages dev`, que es local por definición. Todo lo demás
—`--remote`, `d1 create`, `d1 delete`, `d1 export`, `d1 time-travel`,
`pages deploy`, `login`, `secret`— lo **escribe** Claude Code y lo **ejecuta** el
autor en su terminal.

La regla vive además en `CLAUDE.md`, que es donde se lee al empezar cada sesión.
Esta ADR guarda el motivo, que en `CLAUDE.md` no cabe.

**Motivo.** Al incorporar wrangler (ADR-013) e iniciar sesión con `wrangler login`,
**la herramienta quedó autorizada con permisos amplios sobre la cuenta**: crear y
borrar bases de datos, leer y escribir su contenido, desplegar el sitio. Esa
autorización no se puede acotar por comando ni distinguir quién teclea. Desde que
existe, cualquier proceso que corra en ese equipo actúa como el autor.

Eso cambia el significado de una regla que ya existía. «Claude Code no toca
producción» era, hasta la iteración 12, una descripción de la realidad: no había
manera de tocarla. Después de `wrangler login` pasó a ser una intención, y las
intenciones no protegen nada. Un `--remote` de más, un nombre de base equivocado en
un comando por lo demás correcto, y el daño ya ocurrió: `d1 execute --file` empieza
con un `DROP TABLE`, y `d1 time-travel restore` sobrescribe la base en su lugar.

La regla se escribe con un predicado —lleva `--local` o no lo lleva— justamente para
que se pueda verificar mirando, sin interpretar la intención de nadie.

**Alternativa descartada.** Crear un token de API acotado, de solo lectura, para uso
de Claude Code. Se descarta por tres razones: sigue siendo una credencial que hay
que crear, guardar y rotar, que es exactamente lo que la iteración 13 quiere
reducir; las operaciones peligrosas no son las de lectura, así que un token de
lectura no resolvería el problema que motiva esta ADR; y el trabajo diario no lo
necesita, porque `--local` y `pages dev` cubren el desarrollo completo. Se puede
reevaluar el día que haga falta automatizar lecturas remotas.

**Consecuencia.** El ciclo es más lento en todo lo que toque la nube: Claude Code
escribe el comando, el autor lo ejecuta y trae el resultado. Se asume a cambio de
que ninguna operación irreversible ocurra sin que una persona la haya leído antes.

**Consecuencia deseada.** Todo lo que se ejecutó contra la cuenta queda en un solo
historial, el del terminal del autor, en vez de repartido entre sesiones de una
herramienta. Cuando algo salga raro en la base, hay un único lugar donde mirar.

**Consecuencia.** Los procedimientos de `90-manual/` dejan de ser documentación de
respaldo y pasan a ser el camino normal de trabajo. Si están mal escritos, se nota
enseguida, que es la mejor forma de mantenerlos vivos.

---

### Enmienda · 2026-09-04 · la regla escrita no bastó, y dónde vive ahora la barrera

**Qué pasó.** Esta ADR falló en su primera prueba real. Claude Code ejecutó un
comando `--remote` que se autenticó y alcanzó la base de producción. No modificó
datos, por casualidad y no por diseño. Está documentado en **H-014**.

**Por qué falló el predicado de esta ADR.** «Todo lo que ejecute lleva `--local`
explícito» es comprobable **sólo si la línea de comandos es legible**. El comando
que se ejecutó fue `powershell -File correr.ps1`: ahí no aparece ningún `--remote`,
porque vive dentro del archivo, tres capas más abajo. Y lanzar un guion de apoyo es
el modo normal de trabajar en cuanto algo tiene más de dos pasos. El predicado sigue
siendo bueno **para auditar después**; no impide nada mientras ocurre.

**Qué se añade.** Una barrera técnica de cuatro capas, descrita y operada en
`90-manual/barrera-adr-015.md`. La que sostiene es la primera: el entorno de Claude
Code no tiene con qué autenticarse, porque `XDG_CONFIG_HOME` apunta a un directorio
sin sesión de wrangler. Las variables de entorno las heredan todos los procesos
descendientes, así que ninguna cantidad de guiones intermedios la esquiva — que es
exactamente el punto ciego del predicado.

**Dónde vive, y por qué no en el repositorio.** En los **ajustes de usuario** de
Claude Code, `~/.claude/settings.json`, no en `.claude/settings.json` del proyecto.
Dos motivos:

1. **Comprobado que no funciona desde el proyecto.** Se intentó primero ahí y el
   bloque `env` no llegaba al entorno ni tras reiniciar la sesión. Es plausible que
   Claude Code lo impida a propósito, y con buen criterio: inyectar variables de
   entorno en todos los subprocesos desde un archivo que viene dentro de un
   repositorio clonado es justo lo que no conviene permitir. Sea o no ése el motivo,
   el hecho está medido.
2. **La regla es sobre Claude Code, no sobre este repositorio**, así que corresponde
   que viva donde vive la configuración de la herramienta. El autor aceptó
   expresamente el efecto: aplica a todas sus sesiones de Claude Code, no sólo a las
   de este proyecto.

Lo que **sí** queda versionado en el repositorio es el enganche `PreToolUse` —capa
2— y los tres guiones (`barrera-remoto.mjs`, `verificar-barrera.mjs`, y la negativa
de `verificar-banco.mjs`). La barrera es, por tanto, mitad repositorio y mitad
equipo, y `npm run verificar` se detiene si falta cualquiera de las dos mitades.

**Consecuencia nueva.** La regla deja de depender de que quien la lee no se
equivoque. A cambio, **la barrera pasa a ser algo que puede caerse**, y por eso se
comprueba en cada `npm run verificar` con veredicto propio. Una barrera caída sin
avisar sería peor que no tenerla, porque se seguiría trabajando con la confianza que
daba.

**Lo que esta enmienda no cambia.** El predicado de `--local` sigue vigente y sigue
siendo la forma de auditar. Lo que cambia es que ya no es lo único.

**Límite explícito.** Esto no es una restricción sobre lo que Claude Code puede
*proponer*: escribe los comandos completos, con sus banderas y su orden. Lo que no
hace es apretar el gatillo.

---

## ADR-016 · El banco nuevo suma al existente: 405 preguntas de dos orígenes

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-04

**Decisión.** Las 300 preguntas nuevas **se suman** a las 105 que ya existían en
`static/js/data/cuestionario.js`. El banco queda en **405 preguntas** provenientes de
dos orígenes con formatos distintos, y el esquema de D1 tiene que recibir a los dos.
El banco viejo no se descarta.

**Motivo.** Los dos bancos cubren los mismos siete módulos, pero no se pisan:
comprobado con `npm run informe-banco`, **ningún enunciado se repite** entre ellos,
ni dentro de un mismo módulo. Son 105 preguntas escritas a mano, ya usadas por
estudiantes, y descartarlas para quedarse con 300 sería tirar trabajo hecho y
probado a cambio de nada. Sumarlas cuesta un esquema que acepte dos formas de
entrada, una sola vez.

**Consecuencia · dos formatos que hay que unificar al cargar.** No es solo que las
claves se llamen distinto:

| | banco viejo | banco nuevo |
|---|---|---|
| Identificador de módulo | texto, `"Módulo 2"` | entero, `2` |
| Enunciado | `q` | `enunciado` |
| Alternativas | `opciones`, lista de textos | `alternativas`, lista de `{letra, texto}` |
| Respuesta correcta | `correcta`, **índice** 0-3 | `correcta`, **letra** `"a"`-`"d"` |
| Orden fijo | `fijo` | no existe |
| Título e ícono del módulo | sí, por grupo | no |

Si el identificador de módulo no se unifica al cargar, el mismo módulo entra dos
veces. Y los dos campos que solo existen en un lado —la marca `fijo` y los metadatos
del módulo— se pierden en silencio si el esquema no les hace sitio.

**Consecuencia · hay solapamiento de contenido, aunque no de enunciados.** Que
ninguna pregunta esté repetida palabra por palabra no significa que no haya dos
preguntas sobre el mismo punto. La revisión de los 82 pares candidatos que produjo
el informe encontró coincidencias reales: mismo hecho evaluado con otra redacción.
Eso importa para el simulacro, donde dos preguntas equivalentes en la misma sesión
son una pregunta desperdiciada, y **se resuelve pregunta por pregunta con criterio
editorial**, no con un script. Es trabajo de la iteración 24.

**Consecuencia.** El total efectivo del banco será menor que 405 en la medida en que
el autor decida retirar una de cada par solapado. El número final se sabe recién
después de esa revisión.

**Alternativa descartada.** Reemplazar el banco viejo por el nuevo. Se descarta
porque el costo —perder 105 preguntas ya escritas y probadas— es inmediato y
seguro, mientras que el beneficio —un solo formato de entrada— se paga una vez y se
resuelve con código.

---

## ADR-017 · Los distractores evidentemente descartables se conservan: fidelidad al examen real

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-04

**Decisión.** Las alternativas incorrectas que se descartan sin saber la materia
—nombres de módulos, métodos o paquetes que no existen, respuestas absurdas—
**no se corrigen**. Se conservan como están, y las preguntas que se escriban en
adelante pueden tenerlas. Lo mismo vale para los enunciados que regalan parte de la
respuesta.

**Motivo.** Los testimonios de alumnos que rindieron el examen real de
certificación de Talento Digital coinciden en que ese examen trae bastantes
alternativas evidentemente descartables. Un banco de práctica con distractores
impecables entrenaría para un examen que no es el que van a rendir: el estudiante
llegaría acostumbrado a descartar solo por conocimiento, cuando en la prueba real
va a poder descartar también por forma, y no habría ensayado nunca esa segunda
habilidad. **La fidelidad al examen real pesa más que la calidad teórica del
ítem.**

**Esto no es un defecto que nadie alcanzó a arreglar. Es una elección.** El patrón
saltó a la vista al comparar los dos bancos: el viejo compite contra alternativas
que existen —`path`, `http`, `os`— y el nuevo inventa nombres que se caen solos
—`path-directory (pd)`, `os-architecture`, `hasMultiple()`, `containsMany()`—. La
reacción natural de quien lo vea es reescribirlos. **Quien llegue aquí con esa
intención, que se detenga: corregirlo empeora la simulación.**

**Dos casos concretos, para que se entienda el alcance.** En el par
`m08#1 ↔ M8·1` sobre el principio *stateless*, la pregunta nueva dice en el
enunciado «sin usar sesiones», que es media respuesta regalada, y la vieja no. Se
quedó la nueva **sin modificarla**, por esta misma razón: si el examen real también
da pistas en los enunciados, la nueva simula mejor esa realidad. Y en el par
`m06#28 ↔ M6·10` se retiró la nueva —la de los módulos inventados— pero no por
tener malos distractores: se retiró porque **una de las dos sobraba**, y entre dos
preguntas equivalentes se conservó la que discrimina mejor. Elegir entre duplicados
es otra cosa que corregir un ítem único.

**Consecuencia · lo que esta decisión NO cubre.** Un ítem con **dos respuestas
correctas** no es un distractor flojo: es un error, y se corrige. Ocurrió con
`m07#21`, sobre el comando que abre un bloque transaccional en PostgreSQL: su
alternativa (a) decía `START TRANSACTION`, que inicia una transacción igual que
`BEGIN`. Se reemplazó por `SET TRANSACTION`, que existe, se parece mucho y **no
abre nada**: fija las características de la transacción en curso y, sin un `BEGIN`
previo, emite una advertencia y no hace nada más. Sus otras dos alternativas
—`INIT` y `OPEN`— se dejaron flojas a propósito, que es justo lo que decide esta
ADR. La frontera es esa: **se corrige lo que está mal, no lo que está fácil.**

**Consecuencia · las herramientas no deben denunciarlo.** Ningún informe ni
validación del proyecto puede marcar un distractor evidente como problema. Si
alguna vez se automatiza una medida de calidad de ítems, esta ADR es la que dice
dónde poner el umbral.

**Consecuencia · la premisa es revisable, la decisión no se revierte sola.** Todo
esto se sostiene sobre cómo es hoy el examen real. Si el examen cambia, cambia la
premisa, y entonces se escribe una ADR nueva que sustituya a esta. Mientras tanto
se deja como está.

**Alternativa descartada.** Uniformar la calidad de los distractores de las 368
preguntas, tomando el banco viejo como patrón. Se descarta porque el costo es alto
—revisar y reescribir cientos de alternativas, con riesgo de introducir errores en
preguntas que hoy funcionan— y porque el resultado sería un banco **más difícil que
el examen que prepara**. Un simulacro que no se parece a la prueba mide otra cosa.

---

## ADR-018 · Las alternativas van en su propia tabla, no en cuatro columnas

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-04

**Decisión.** Las alternativas de cada pregunta se guardan en una tabla
`alternativa`, con una fila por alternativa y una llave foránea hacia `pregunta`.
No se usan cuatro columnas `alternativa_a … alternativa_d`.

**Motivo.** Cuatro columnas numeradas son un **grupo repetitivo**, que es
exactamente lo que la primera forma normal prohíbe y exactamente lo que el módulo 5
del plan formativo enseña. Este repositorio es público y el examen que prepara
pregunta por normalización: un esquema que la viola en su tabla principal enseña lo
contrario de lo que el sitio dice. Ese costo no lo paga el rendimiento, lo paga el
producto. Con 368 preguntas ninguna de las dos formas se nota al consultar.

**Motivo técnico, además del didáctico.** Dos cosas que el proyecto ya decidió
dependen de que la alternativa sea una fila:

- **Barajar (ADR-006).** Si la identidad de una alternativa es el nombre de su
  columna, barajarlas obliga a armar una lista en JavaScript arrastrando la letra a
  mano. Con filas, barajar es barajar filas.
- **El caso de orden fijo.** Necesita una columna `orden`. En el modelo de columnas
  el orden es implícito en los nombres, que es justo lo que impide tratar los dos
  casos con el mismo mecanismo.

**Consecuencia.** Toda lectura del banco lleva un `JOIN` y agrupa en el servidor, y
editar una pregunta a mano pasa de tocar una fila a tocar cinco. Lo segundo lo
resuelve el mecanismo de administración de la iteración 23.

**Consecuencia · la base puede exigir bastante más de lo que parece.** Con
`letra TEXT NOT NULL CHECK (letra IN ('a','b','c','d'))` y
`UNIQUE (pregunta_id, letra)`, **la propia base garantiza que ninguna pregunta pase
de cuatro alternativas**: solo hay cuatro letras posibles y cada una puede usarse
una vez. Comprobado ejecutando las violaciones, no razonando sobre ellas.

**El `NOT NULL` de `letra` sostiene esa garantía y no es decorativo.** Sin él, un
`CHECK` sobre `NULL` no da falso sino `NULL`, y SQLite deja pasar la fila; y
`UNIQUE` considera cada `NULL` distinto de los demás. Medido: con la misma tabla sin
`NOT NULL`, se colaron **siete** alternativas en una sola pregunta. Quien alguna vez
relaje esa columna abre la puerta sin darse cuenta.

**Alternativa descartada · una columna JSON con las cuatro alternativas.** Es la
peor de las tres para este proyecto: la base deja de poder validar nada —ni que sean
cuatro, ni que haya una correcta, ni que las letras no se repitan— y el ejemplo
didáctico pasa de «grupo repetitivo» a «aquí no usamos el modelo relacional».

---

## ADR-019 · La respuesta correcta es una bandera en la alternativa, con la unicidad forzada por un índice parcial

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-04

**Decisión.** La respuesta correcta se marca con `alternativa.es_correcta`, y que
haya como mucho una por pregunta lo garantiza un índice único parcial:

```sql
es_correcta INTEGER NOT NULL DEFAULT 0 CHECK (es_correcta IN (0, 1))

CREATE UNIQUE INDEX alternativa_una_correcta
   ON alternativa (pregunta_id) WHERE es_correcta = 1;
```

**Motivo.** ADR-006 obliga a barajar, y el sesgo de posición se corrige barajando
(decisión del autor, 2026-09-04). Guardar «la correcta es la segunda» deja de
significar nada cuando el orden cambia en cada carga: la corrección tiene que viajar
pegada a su alternativa. Con la bandera, barajar no la afecta, y no hace falta ni
una línea de código para conseguirlo.

**El índice parcial no es un detalle de rendimiento, es la restricción.** Hace que
la base **rechace** una segunda alternativa correcta. Vale la pena decir por qué
importa: el par `m07#21 ↔ M7·8` tenía dos respuestas correctas y estuvo así hasta
que una persona lo leyó. Esta restricción habría rechazado esa fila al cargarla.

**Alternativa descartada · `pregunta.alternativa_correcta_id` como llave foránea.**
Parece la opción más relacional y es peor. Crea una dependencia circular —insertar
la pregunta, luego las alternativas, luego volver a actualizar la pregunta—, que
complica las cargas por lotes y las migraciones repetibles; y una llave foránea
simple no impide apuntar a una alternativa **de otra pregunta**. Evitarlo exige una
llave compuesta y una columna redundante. La bandera con índice parcial consigue lo
mismo sin nada de eso.

**Consecuencia · `letra` y `orden` se conservan, pero son historia, no identidad.**
`letra` es la que traía el origen —derivada del índice 0-3 en el banco viejo— y
sirve para que un estudiante pueda reportar «la alternativa b está mal» y se
encuentre. `orden` es el orden original. Ninguna de las dos decide qué es correcto.

**Consecuencia · el orden fijo cuesta una rama, no cero.** `pregunta.orden_fijo`
decide si el navegador ordena por `orden` o baraja. Es una decisión en un solo
punto, la llamada a barajar, no un caso especial repartido por el código. Pero es
una rama, y llamarlo «sin ramas» sería falso.

**Consecuencia · habilita lo que ADR-007 dejó pendiente.** Con `es_correcta` en la
tabla de alternativas, el extremo del simulacro puede seleccionar las alternativas
**sin esa columna** y no enviar nunca la respuesta al navegador.

**Lo que esta decisión NO garantiza.** El índice asegura «como mucho una correcta».
«Al menos una» y «exactamente cuatro alternativas» quedan fuera del alcance del
esquema y son responsabilidad de la consulta de verificación. La frontera completa
está en `90-manual/esquema-del-banco.md`. Confundirla es el error previsible: la
base no lo comprueba todo, y hay que saber qué parte no.

---

## ADR-020 · Las preguntas retiradas se marcan y se ocultan tras una vista, no se borran

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-04

**Decisión.** `pregunta.estado` toma uno de tres valores —`borrador`, `activa`,
`retirada`— y ninguna fila se borra nunca. El filtro no se repite en cada consulta:
vive una sola vez, en una vista.

```sql
estado TEXT NOT NULL DEFAULT 'borrador'
       CHECK (estado IN ('borrador', 'activa', 'retirada'))

CREATE VIEW pregunta_activa AS SELECT ... FROM pregunta WHERE estado = 'activa';
```

**Motivo.** La objeción conocida —marcar obliga a filtrar en cada consulta— la
responde la vista: se filtra una vez, en su definición. Ninguna lectura de
`functions/api/` toca `pregunta` directamente; todas leen `pregunta_activa`. Una
consulta futura no puede olvidar el filtro porque no lo escribe.

Borrar las filas queda descartado por experiencia propia, no por teoría. Al aplicar
los retiros por solapamiento, retirar `M8·11` disolvió una tabla del plan y corrió
las posiciones de nueve preguntas más; incluso la pregunta de orden fijo pasó de la
posición 13 a la 11. **Con filas que nunca se borran, los identificadores son
estables para siempre** y ese problema no se repite.

**Consecuencia · se guarda por qué se fue cada una.** `motivo_retiro`,
`retirada_en` y `reemplazada_por` —llave foránea a otra pregunta— entran en la
tabla. `reemplazada_por` es la que más vale: convierte los 34 pares de la revisión
de solapamiento en un dato consultable. Dentro de un año, «¿por qué no está la
pregunta del módulo `fs`?» se responde con una consulta y no con arqueología.

**Consecuencia · la instantánea de respaldo se genera desde `pregunta_activa`.** Si
se generara desde `pregunta`, el sitio degradado (ADR-008) mostraría al estudiante
las preguntas que se decidió retirar.

**Consecuencia · `borrador` no es adorno.** Las 368 llegan sin justificación y hay
que redactarlas. `borrador` permite cargar una pregunta escrita pero no revisada sin
que aparezca en el cuestionario, que es como se va a trabajar de verdad.

**Consecuencia · lo que la base sí exige aquí.** Un `CHECK` obliga a que una
pregunta `retirada` tenga motivo, y a que una que no lo esté no arrastre metadatos
de retiro. Lo que la base **no** puede exigir es que cada pregunta tenga cuatro
alternativas y al menos una correcta: eso lo comprueba `d1/verificar-banco.sql`
después de cada carga, y falla ruidosamente.

**Alternativa descartada · una tabla `pregunta_retirada` aparte.** Deja las
consultas del banco limpias sin necesidad de vista, pero duplica el esquema entero,
obliga a mover filas entre tablas para retirar o reponer una pregunta —con cambio de
identificador incluido, que es justo lo que se quiere evitar— y rompe la llave
foránea `reemplazada_por`.

**Simplificación deliberada.** El estado de revisión y el de publicación son la
misma columna. Se pueden separar; no vale la complejidad hasta que exista el
mecanismo de administración de la iteración 23.

---

## ADR-021 · Los módulos son una tabla, y `pregunta.modulo` apunta a ella

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-04

**Decisión.** Existe una tabla `modulo(numero, titulo, icono)` con las siete filas
del plan formativo, y `pregunta.modulo` es una llave foránea hacia ella.

**Motivo.** El título y el ícono de cada módulo son datos del banco y hoy no están
en el banco: el origen viejo los trae por grupo, el nuevo solo trae el número, y en
el sitio viven en `static/js/data/`. Si el esquema no les hace sitio, se pierden al
migrar y el banco en D1 queda incompleto sin que nada avise.

**Motivo · resuelve el problema de los dos formatos.** El banco viejo identifica el
módulo como el texto `"Módulo 2"` y el nuevo como el entero `2`. Sin una tabla, esa
diferencia se resuelve con una convención que alguien puede olvidar, y el mismo
módulo entra dos veces. Con la llave foránea, **la base rechaza un módulo que no
exista** en vez de dejar entrar un duplicado: el error aparece al cargar, no meses
después al ver siete módulos convertidos en catorce.

**Consecuencia.** Los siete módulos se cargan antes que cualquier pregunta, en la
misma migración que crea el esquema. Son datos de referencia, no contenido variable:
`numero` es la llave primaria, con `CHECK (numero BETWEEN 2 AND 8)`, porque el plan
formativo empieza en el módulo 2.

**Consecuencia.** Los títulos y los íconos dejan de estar duplicados entre
`static/js/data/cuestionario.js` y `static/js/data/modules.js`. Cuál de los dos es
la fuente después de la migración lo resuelve la iteración 31, al consumir el banco
desde D1.

**Alternativa descartada · repetir título e ícono en cada pregunta.** Es una
dependencia transitiva de manual —el título depende del módulo, no de la pregunta— y
la 3FN existe precisamente para eso. Además de incorrecto sería incoherente: el
proyecto no puede evaluar la tercera forma normal en su banco de preguntas y
violarla en la tabla que lo guarda.

**Alternativa descartada · dejarlos en un archivo JavaScript del sitio.** Es lo que
pasa hoy, y funciona mientras el banco venga del mismo repositorio. Deja de
funcionar en cuanto el banco viene de D1: el sitio tendría que cruzar datos de dos
fuentes distintas para dibujar el nombre de un módulo.

---

## ADR-022 · La instantánea incluye las respuestas correctas, y con eso el simulacro deja de poder ocultarlas

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-05 · **Sustituye a:** el pendiente abierto
por ADR-007 sobre dejar de enviar la respuesta correcta al navegador durante el
simulacro

**Decisión.** La instantánea versionada de ADR-008 contiene el banco **completo**,
incluida la respuesta correcta de cada pregunta. Y, como parte de la misma decisión y
no como efecto colateral: **queda descartada** la idea —abierta por ADR-007 y anotada
desde entonces en el registro— de que el Worker deje de enviar la respuesta correcta
durante el simulacro y valide del lado del servidor. No se aplaza: se descarta, y esta
ADR sustituye ese pendiente.

**Motivo.** Un modo degradado que no puede corregir no sirve para nada. Sin la
respuesta correcta, la instantánea deja al estudiante leyendo preguntas sin saber si
acertó, que es exactamente el momento en que el respaldo tenía que salvarlo. El
público de este sitio estudia desde el teléfono y con conexión irregular: la caída no
es un escenario de laboratorio, es una tarde cualquiera.

**Motivo · por qué esto obliga a matar el pendiente de ADR-007, en vez de convivir con
él.** Si las respuestas viajan dentro de un archivo versionado en un repositorio
**público**, ocultarlas durante el simulacro es imposible: basta abrir el archivo. Un
servidor que se niegue a enviarlas mientras el repositorio las publica no protege
nada; añade complejidad, una validación remota en el camino crítico del simulacro, y
—lo peor— la impresión de que el simulacro es a prueba de trampa. Dos decisiones que
se contradicen y conviven son peores que una decisión costosa que se sabe tomada.
Mientras ese pendiente siguiera en pie, cualquiera podía leerlo dentro de seis meses y
creer que el problema estaba abierto cuando en realidad estaba resuelto en contra.

**Lo que se pierde, dicho con todas sus letras.** **El simulacro no puede garantizar
que nadie vea las respuestas antes de responder.** Cualquiera que abra el repositorio,
o las herramientas de desarrollo del navegador, tiene el banco entero con sus
correctas. No hay forma de arreglar eso sin romper el respaldo.

De ahí se sigue lo que el simulacro **es** y lo que **no es**:

- **Es** un instrumento de estudio: sirve para que el estudiante mida su preparación
  en condiciones parecidas a las del examen real, porque quien estudia no tiene
  motivo para hacerse trampa.
- **No es** un instrumento de evaluación con validez. Su puntaje no puede sustentar
  una nota, una certificación ni una decisión sobre nadie. Si algún día hiciera falta
  eso, esta decisión se cae entera y hay que sustituirla por una ADR nueva: no se
  parchea añadiendo validación de servidor, porque el archivo público seguiría ahí.

**Restricción sobre lo que el sitio puede prometer.** *Precisión del autor,
2026-09-05.* Lo anterior es una decisión **interna**: no se convierte en una
advertencia en pantalla ni en un descargo que el estudiante tenga que leer antes de
empezar. Se convierte en un **límite de vocabulario**, y ese límite es vinculante:

**La interfaz del simulacro no puede llamar a su resultado «puntaje oficial», «nota»,
«calificación», «aprobado/reprobado» ni ninguna fórmula que sugiera validez de
certificación.** Puede decir cuántas acertó, en qué módulos falló y cuánto tardó, que
es lo que de verdad sirve. No puede sugerir que ese número valga fuera de la pantalla
donde aparece.

Está escrito así, como una regla sobre las palabras y no como un principio, por un
motivo concreto: **la persona que redacte esa pantalla puede no haber leído esta ADR.**
Un principio general no la detiene; una lista de palabras prohibidas, sí. Es la misma
lógica por la que CLAUDE.md formula ADR-015 como «mira el comando, tiene que llevar
`--local`» en vez de «no toques producción».

**Consecuencia.** Queda como criterio de aceptación de la **épica 40**, anotado en su
README y en la iteración 44, que es la que redacta la pantalla de resultados. No basta
con que viva aquí: esta ADR se lee al empezar una iteración, y la pantalla se redacta
al final de otra.

**Consecuencia.** Se confirma y se cierra la línea que ADR-001 dejó abierta —«las
respuestas correctas que llegan al navegador son visibles para quien inspeccione el
código; ADR-007 abre la puerta a cambiar esto, pero mientras no se decida lo contrario,
se asume»—. Ya está decidido: se asume, y no se va a cambiar.

**Consecuencia.** La fila del registro «Evaluar si el Worker debe dejar de enviar la
respuesta correcta al navegador durante el simulacro, y validar del lado del servidor»
queda marcada como descartada, apuntando a esta ADR. No se borra.

**Consecuencia.** La iteración 41, al construir el motor del simulacro, no tiene que
diseñar ninguna defensa contra la inspección del banco. Es tiempo que no se gasta.

**Alternativa descartada · instantánea sin respuestas correctas.** Es la que protege
el simulacro, y es la que rompe el respaldo: el estudiante en modo degradado
respondería sin retroalimentación. Convierte el respaldo en un adorno que se puede
mostrar en una demostración y no sirve la noche antes del examen, que es cuando se
usa.

**Alternativa descartada · respuestas ofuscadas o con un resumen criptográfico en la
instantánea.** Da seguridad aparente y ninguna real: con cuatro alternativas por
pregunta, comprobar cuál corresponde a cada resumen es probar cuatro veces. Costaría
código, complicaría el diff del archivo versionado —que ADR-014 usa como revisión
editorial— y no detendría a nadie que se moleste diez minutos.

**Alternativa descartada · validar el simulacro en el servidor y renunciar al modo
degradado sólo ahí.** El simulacro sería el único punto del sitio que deja de
funcionar cuando cae la capa de datos. Contradice ADR-008 justo en la página más
larga y menos interrumpible del sitio: una caída a mitad de un intento de 60 minutos
lo perdería entero.

**Actualización del 2026-09-16 · vocabulario del resultado del simulacro.**
*Decisión del autor, tomada al cerrar las decisiones de diseño de la épica 40.* El
resumen del simulacro **sí dice si se aprobó**, con el umbral del propio simulacro:
**72 de 120 correctas (60 %)**, y **las omitidas cuentan como incorrectas**. Para
poder decirlo, la lista de palabras de más arriba se enmienda así, y sólo así:

**Permitidas, y únicamente con esta forma exacta:**

- «Aprobaste el simulacro»
- «Reprobaste el simulacro»

**Siguen prohibidas:** «aprobado» y «reprobado» sin «el simulacro», «nota», «puntaje
oficial», «calificación», «certificación», y cualquier fórmula que sugiera validez de
certificación.

**Por qué esto no contradice lo que dice esta misma ADR en `decisiones.md:977-978`**
—«Su puntaje no puede sustentar una nota, una certificación ni una decisión sobre
nadie»—. Lo que la frase permitida afirma es el resultado **del simulacro**, y las
reglas del simulacro —120 preguntas, 30 segundos cada una, el sobrante se pierde, una
omitida cuenta como incorrecta, 60 % para aprobar— son **decisiones de diseño del
autor**, escritas en el README de la épica 40. **No son las del examen real**, que
dura 120 minutos y mezcla alternativas con programación
(`00_producto/contexto-del-examen.md`). Y la frase lleva esa distinción **en su propia
forma**: lo que se aprueba o se reprueba es «el simulacro», nombrado dentro de la
frase, no algo que valga fuera de la pantalla donde aparece. Quien lee «Reprobaste el
simulacro» sabe exactamente qué reprobó.

**Por qué no es el caso de `:978-980`** —«Si algún día hiciera falta eso, esta decisión
se cae entera y hay que sustituirla por una ADR nueva»—. Ese párrafo se activa si al
simulacro le hiciera falta **validez**: que su resultado valiera ante alguien. Mostrar
que se aprobó **el simulacro** no le da validez de evaluación ni la reclama: sigue sin
sustentar una nota, una certificación ni una decisión sobre nadie, y sigue sin poder
garantizar que nadie haya visto las respuestas, que es lo que esta ADR dejó escrito
con todas sus letras. Por eso ADR-022 no se cae ni se sustituye: se enmienda su lista
de palabras, y todo lo demás queda en pie.

**Por qué la autorización también se escribe como lista mecánica.** Por el mismo motivo
de `:994-997`: **la persona que redacte esa pantalla puede no haber leído esta ADR.** Un
principio general no la detiene, y tampoco la guía. Por eso lo permitido son **dos
frases exactas** y no una regla del tipo «se puede hablar de aprobación si queda claro
que es del simulacro», que es precisamente la formulación que no detiene a nadie:
cualquiera cree que su redacción deja claro eso. Si hace falta una tercera frase, se
añade acá antes de escribirla en la pantalla.

**La «Consecuencia» de `:999-1002` pasa a apuntar a esta lista.** Para la **épica 40** y
para la **iteración 44** —la que redacta la pantalla de resultados—, el criterio de
aceptación es el vocabulario de esta actualización, no la lista de `:987-991` leída
sola. La fila que repite esa lista en `00_producto/registro_log.md:194` —la `:193` antes
de que se registrara ahí mismo la tanda de decisiones de la épica 40— queda marcada como
actualizada por este bloque, para que no queden dos listas vigentes que discrepen.

**Tercera frase autorizada · 2026-09-16 · la frase de la presentación.** *Decisión del
autor, tomada al abrir la etapa B de la iteración 41.* El párrafo anterior dice que si
hace falta una tercera frase se añade acá antes de escribirla en la pantalla. Hace
falta, y **no se hizo en ese orden**: la regla 08 de la presentación de `simulacro.html`
ya la escribió en la etapa A de la iteración 41, antes de que estuviera autorizada. Se
regulariza aquí, y se deja dicho el desorden en vez de taparlo, porque el valor de esta
lista está entero en que se consulte antes de redactar.

**Permitida, y únicamente con esta forma exacta:**

- «Se aprueba el simulacro con al menos el 60 %»

**Alcance de esta tercera frase, y de ninguna otra cosa:** vale **solo** para la pantalla
de presentación del simulacro y para el texto de reglas que la iteración 43 redacta
sobre ella. **No** vale para la pantalla de resultados de la iteración 44, que sigue
teniendo exactamente las dos frases de más arriba y ninguna más.

**Por qué esta forma y no otra.** Es impersonal —«se aprueba», no «apruebas»—, porque la
presentación explica una regla antes del intento y todavía no hay resultado de nadie; y
nombra «el simulacro» dentro de la frase, que es la misma condición que cumplen las dos
anteriores. El «60 %» es el umbral del propio simulacro, el mismo de esta actualización.
Lo que la acompaña en la regla 08 —«Son 72 correctas de 120. Es una exigencia elegida
para practicar, igual que todo lo demás de esta lista.»— no usa ninguna palabra de la
lista y no necesita autorización: se cita aquí para que quien compare la pantalla con
esta ADR no tenga que adivinar dónde termina lo autorizado.

**Siguen prohibidas** las mismas de siempre: «aprobado» y «reprobado» sin «el
simulacro», «nota», «puntaje oficial», «calificación», «certificación», y cualquier
fórmula que sugiera validez de certificación. Y sigue en pie la regla del párrafo
anterior: una cuarta frase se añade **acá antes** de escribirla en la pantalla.

**Cuarta excepción autorizada · 2026-09-22 · nombrar el examen real, con su nombre
correcto, fuera de la pantalla de resultados.** *Decisión del autor, tomada al cerrar
la etapa C de la iteración 44.* El barrido de la sección 17 impidió, con evidencia
real y no supuesta, que `simulacro.html` nombrara «el examen de certificación de
Talento Digital para Chile» dentro del aviso que distingue las reglas del simulacro
de las del examen real — el mismo nombre que el resto del sitio ya usa sin
restricción: en el título de esta misma página, en el meta description y en el pie
de las tres.

El guardián disparó correctamente según su propio alcance: barre el `<main>` completo
de `simulacro.html`, no sólo la pantalla de resultados que esta ADR nombraba
originalmente. Pero la palabra en sí nunca fue el problema. Lo que esta ADR prohíbe
es que **el resultado del simulacro** reclame validez de certificación — no que el
sitio nombre correctamente al examen real cuando lo está usando de contraste, que es
justamente lo que hace el aviso.

**Permitida, y únicamente con esta forma exacta, en cualquier parte de
`simulacro.html`:**

- «examen de certificación de Talento Digital para Chile», con mayúscula inicial
  solo cuando abre oración.

Es la misma forma que ya usan `index.html` y el pie de las tres páginas: no se
introduce un cuarto nombre para la misma cosa.

**Siguen prohibidas** todas las palabras de siempre, y cualquier otra combinación con
«certificación» que no sea exactamente esa frase — «te certifica», «tu
certificación», «certificación» sola sin el resto de la frase, o cualquier forma que
la vincule al resultado del simulacro en vez de al examen real.

---

## ADR-023 · La instantánea se genera desde la base de la nube, en el mismo acto que el respaldo de ADR-014

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-05 · **Complementa a:** ADR-008 y ADR-014

**Decisión.** La instantánea de ADR-008 se genera **desde la base de la nube**, no
desde la base D1 local. De ahí se siguen dos cosas que forman parte de la decisión:

1. **Sólo la genera el autor**, por ADR-015. Claude Code escribe el generador y lo
   prueba contra D1 local; la instantánea que se versiona la produce el autor
   ejecutando el comando en su terminal.
2. **Se genera en el mismo procedimiento y en el mismo momento que la exportación de
   `d1/respaldo-banco.sql`**, atado al mismo disparador que ADR-014 ya fijó: **después
   de cada cambio de contenido, nunca por calendario.** Un solo paso produce las dos
   cosas, o no produce ninguna.

**Motivo · por qué desde la nube.** La instantánea es lo que ve el estudiante cuando
la capa de datos cae. Generada desde D1 local reflejaría la base de juguete del
equipo del autor —hoy, diez filas de ejemplo— y el sitio publicaría eso como respaldo
del banco real. El fallo sería **silencioso**: todo verde, archivo generado, commit
hecho, y el error visible sólo el día de la caída, que es precisamente el día en que
no se puede arreglar. Es la familia de H-011, H-012 y H-013: algo que falla pareciendo
que funciona.

**Motivo · por qué atada al respaldo y no como paso aparte.** Las dos copias salen del
mismo dato, en el mismo instante, y se quedan atrás por el mismo motivo: alguien editó
el banco y no volvió a correr nada. Separarlas es garantizar que una de las dos se
quede atrás, y sería la instantánea: **el respaldo duele cuando se pierde la base, un
evento raro pero ruidoso; la instantánea duele cuando cae el Worker, un evento raro y
mudo**, que el autor puede no ver nunca aunque le esté pasando a los estudiantes. La
que menos se nota es la que más necesita ir amarrada a la otra.

**Consecuencia.** El generador tiene que **dejar escrito dentro del archivo generado
contra qué base corrió y cuándo**. Sin eso no hay forma de saber si la instantánea
está al día, y la promesa de ADR-008 —avisar al estudiante de que el respaldo puede
estar desfasado— se queda sin el dato que la sostiene. *Ratificada expresamente por el
autor el 2026-09-05, con ese mismo argumento: sin ese dato, el aviso de desfase no se
apoya en nada.* Es decir que el sello no es metadato decorativo, es **la fuente del
aviso**: lo que la página le muestra al estudiante sale de ahí.

**Consecuencia.** Claude Code **no puede verificar** que la instantánea versionada
corresponda a la base de la nube. Puede comprobar que el generador funciona, que el
archivo tiene la forma esperada y que el sitio lo consume bien; la correspondencia con
la nube la comprueba el autor. Un criterio de aceptación que diga «coincide con lo que
hay en D1» sólo puede cerrarlo él.

**Consecuencia.** El procedimiento único —editar, exportar, regenerar, publicar— se
escribe en el manual como **un solo bloque**, y le toca a la iteración 23, que es
donde se define cómo se edita el banco. Vale aquí la misma advertencia que ADR-014 se
hizo a sí misma: si ese procedimiento no las junta, esta ADR queda incumplida aunque
nadie lo note.

**Alternativa descartada · generar desde D1 local.** Es la barata: no pasa por
ADR-015, la puede correr Claude Code, y cerraría el criterio sin depender de nadie.
Produce una instantánea de la base de juguete y no avisa de ello. Justamente por
barata es la que se habría adoptado sin pensarlo, y por eso queda escrito que se
descartó.

**Alternativa descartada · generarla automáticamente en el despliegue.** Exigiría
credenciales de escritura sobre el repositorio dentro del proceso de publicación y un
commit automático, ampliando la superficie que ADR-015 acaba de cerrar. Además ataría
la instantánea al calendario de publicaciones en vez de al cambio de contenido, que es
exactamente lo que ADR-014 rechazó con argumento propio.

**Alternativa descartada · regenerarla por calendario o por recordatorio.** Mismo
motivo que ADR-014 ya dio: produce archivos idénticos durante semanas y da sensación
de cobertura justo en la ventana en que el cambio reciente todavía no está reflejado.

---

**Actualización · 2026-09-09 · el «un solo paso» pasó a existir, y hasta hoy no existía**

*Añadida al cerrar el módulo 2 de la iteración 25. No cambia la decisión: registra que
la decisión no estaba implementada, y qué se hizo.*

Esta ADR decía desde el 2026-09-05 que «un solo paso produce las dos cosas, o no
produce ninguna». **Eso nunca se implementó.** La realidad eran dos comandos sueltos y
un recordatorio impreso entre medio por `generar-instantanea.mjs`. Nada ataba las dos
mitades y nada fallaba si se corría una sin la otra.

**El fallo que esta ADR predijo ya había ocurrido.** El 2026-09-09 se descubrió que
`d1/respaldo-banco.sql` contenía 527 bytes de `prueba_tuberia` —la tabla de ensayo de
la iteración 12, exportada el 2026-09-03— y **ninguna pregunta**. Seis días versionado
como «el respaldo del banco» sin tener banco dentro, y nadie lo vio porque nada lo
miraba.

El texto de arriba se equivocó sólo en cuál de las dos se quedaría atrás: **apostaba a
la instantánea**, por ser la muda. Se quedó atrás el respaldo. El argumento era
correcto y la predicción concreta no; lo que importa es que la separación produjo
exactamente el efecto anunciado.

**Qué se hizo.** `scripts/publicar-banco.mjs`, y `npm run datos:publicar` como su
puerta. Prepara las dos mitades en archivos temporales y **sólo las instala si las dos
salieron bien**; si algo falla, los dos archivos quedan intactos y lo demuestra con sus
huellas. Comprueba además, antes de instalar, que el respaldo **tenga banco dentro** —
la comprobación cuya ausencia dejó pasar lo de `prueba_tuberia`—, que el sello diga
`nube` cuando se pidió la nube, y que la instantánea no publique más preguntas de las
que el respaldo contiene. Provocados sus cuatro sabotajes y sus tres rechazos contra la
base local el 2026-09-09.

**Lo que esto cambia para quien lea la ADR dentro de seis meses:** el procedimiento del
manual pasó de seis pasos a cinco, y los dos que había que acordarse de encadenar son
ahora uno que no se puede partir. La regla que queda escrita, y que vale más allá de
esta ADR: **un procedimiento que pide acordarse de dos cosas produce una.** Escribir la
advertencia se siente como haber resuelto el problema; lo que lo resuelve es que el
segundo paso no pueda no ocurrir.

**Actualización · 2026-09-15.** La protección del sello **se extiende a la cifra que la
portada publica** (iteración 36, decisión 4 bis). Hasta hoy el sello defendía la
instantánea y el respaldo; no defendía lo que el estudiante lee en la primera pantalla.

Desde ahora, **`scripts/cifra-portada.mjs` se niega a escribir la cifra si el sello de la
instantánea no dice `nube`**, y **`scripts/comprobar-cifra.mjs` da rojo si la instantánea
versionada no lo trae, aunque el número coincida** — ese «aunque» es el punto entero, y se
explica abajo.

**El hueco que cierra.** Alguien corre el generador contra la base local para probar el
modo degradado, que es un camino legítimo y documentado (`PERMITIR_INSTANTANEA_LOCAL=1`).
La instantánea queda con las diez filas de juguete y la cifra de la portada se reescribía
con ese número. Portada e instantánea quedaban **de acuerdo en un número falso**, así que
la comparación entre las dos no tenía nada que objetar.

**Lo que no era.** No era un fallo silencioso: `comprobar-instantanea.mjs` ya denunciaba
ese estado por el sello y por la comparación contra `d1/respaldo-banco.sql`, y
`npm run verificar` ya daba rojo por el paso `instantanea`. Lo que fallaba es que **la
línea que hablaba de la portada decía OK**, y quien leyera solo esa línea se quedaba
tranquilo mientras la portada anunciaba diez preguntas. La comprobación se puso donde el
problema se ve publicado, no donde ya se veía.

**Cómo responde cada punto de llamada a la negativa**, que es donde está el criterio:
`publicar-banco.mjs` **falla entero**, porque llegar ahí con otro sello es una
contradicción y seguir dejaría la instantánea nueva versionada con la portada anunciando
el banco anterior —el «a medias» que esta ADR existe para impedir—;
`generar-instantanea.mjs` **sigue y avisa**, porque es el único sitio donde un sello que
no dice `nube` es un resultado buscado, y ahí la portada conserva la cifra del banco
publicado, que sigue siendo la verdadera.

---

## ADR-024 · La iteración 22 se verifica con las diez filas de juguete, y el escapado no queda probado a escala hasta la 24

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-05

**Decisión.** La iteración 22 se implementa y se verifica contra las **diez filas de
ejemplo** de `d1/ejemplo-banco.sql`. **No se adelanta la carga de las 368 preguntas**,
que sigue siendo trabajo de la iteración 24.

**Motivo.** Son dos superficies distintas y cada una falla por su cuenta: la 22 es
leer, validar, escapar y sobrevivir a la caída; la 24 es transformar y cargar. Si se
mezclan y algo falla, el primer trabajo es averiguar cuál de las dos fue, y ese trabajo
se paga entero antes de poder arreglar nada. Con diez filas conocidas de memoria,
cualquier diferencia entre lo que hay en la base y lo que aparece en pantalla se ve a
simple vista.

**Riesgo asumido, y es el punto de esta ADR.** **Diez filas no ejercitan ni el volumen
ni los caracteres del banco real.** El banco que llegará en la 24 trae preguntas con
comillas invertidas y con comillas dobles en abundancia:

| Corte medido | Con comillas invertidas | Con comillas dobles escapadas |
|---|---|---|
| Banco nuevo, 285 activas | 57 | 35 |
| Banco viejo, 83 activas | 0 | 11 |
| **Las 368 que se van a cargar** | **57** | **46** |

El autor las cifró en 58 y 37. **Las dos cuentas son correctas y no se contradicen**:
las suyas salen de las 300 del banco nuevo **antes** de los retiros por solapamiento, y
las de la tabla salen de las 285 que quedaron activas más las 83 del banco viejo.
*Zanjado por el autor el 2026-09-05: el corte válido es el de la tabla*, porque el
riesgo lo corren las **368 que se van a cargar**, no las que se retiraron. Y en
cualquiera de los dos cortes son decenas de preguntas, no dos.

Y ese riesgo cae justo sobre lo más delicado de la épica: en esta iteración el
escapado **deja de ser higiene y pasa a ser una barrera de seguridad**, porque el
contenido empieza a venir de fuera del repositorio (H-003, y el «contexto de
seguridad» de la propia iteración 22). Con diez filas se prueba que el mecanismo
existe; no se prueba que aguante el banco real.

**Consecuencia.** **El escapado no queda probado a escala hasta la iteración 24.** Esa
iteración hereda un criterio de aceptación que no nació suyo: con las 368 cargadas, la
página se recorre entera buscando texto que se haya salido de su tarjeta o roto el
diseño. Queda anotado en el registro para que no se pierda entre la carga y la
justificación.

**Consecuencia.** Como el volumen no se puede probar todavía, **al menos los
caracteres sí**: las filas de prueba de la 22 tienen que incluir a propósito un
enunciado con `<div>` —criterio que la iteración ya tenía—, y además comillas
invertidas, comillas dobles y una comilla simple. Que el caso exista aunque la escala
no.

**Consecuencia.** La 22 tampoco puede decir nada sobre el rendimiento: si dibujar 368
preguntas de golpe es un problema, se descubrirá en la 24 o en la 31, no aquí. La
iteración 31 ya tiene anotado el renderizado por módulo justamente por eso.

**Alternativa descartada · adelantar la carga de las 368 a la 22.** Cerraría el riesgo
de una vez, y a cambio junta las dos superficies que esta ADR separa. Además la carga
depende de decisiones que la 24 todavía no ha tomado —transformación, justificaciones,
ubicación definitiva de los JSON— y adelantarla obligaría a tomarlas a medias.

**Alternativa descartada · generar filas sintéticas con caracteres raros a escala.**
Es la salida barata para cerrar el riesgo antes: 400 filas inventadas con comillas de
todo tipo prueban el escapado sin esperar a la 24. Se descarta **para esta iteración**
porque el dato real llega en dos iteraciones y el trabajo se tiraría; pero queda
escrito como la salida disponible **si la 24 se retrasa** y el sitio fuera a publicarse
antes con el banco real cargado a mano.

## ADR-025 · La administración del banco es una herramienta local de línea de comandos, sin panel

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-08 · **Cumple:** ADR-009 · **Sujeta a:** ADR-015

**Decisión.** El banco de preguntas se edita con una **herramienta de línea de comandos
que corre en el computador del autor**. No hay panel de administración, no hay página
autenticada y **no se expone ningún extremo de escritura en el Worker**: la capa de
datos publicada sigue siendo de sólo lectura, como manda ADR-009.

La herramienta se apoya en cuatro reglas que forman parte de la decisión, no del
detalle de implementación:

1. **Todo o nada.** Cada operación se aplica entera o no se aplica. Si algo falla a
   mitad de un lote, la base queda como estaba. No existe el estado a medias.

   > **Corrección del 2026-09-08, comprobada contra D1 antes de implementar nada.** La
   > primera redacción de esta regla decía «se ejecuta como una transacción única», y eso
   > invita a escribir `BEGIN` / `COMMIT`. **No se debe.** D1 rechaza las transacciones
   > explícitas: ante un `BEGIN` responde *«To execute a transaction, please use the
   > state.storage.transaction() … APIs instead of the SQL BEGIN TRANSACTION or SAVEPOINT
   > statements»*, y el lote entero no se aplica.
   >
   > **El efecto que esta regla pide se obtiene solo, y precisamente por no escribirlo:**
   > `wrangler d1 execute --file=<archivo>` aplica el archivo **como un lote atómico**.
   > Provocado el 2026-09-08 sobre una tabla de juguete: con la base sembrada con dos
   > filas, un lote de tres —dos válidas y una que viola un `UNIQUE`— dejó la base con las
   > dos filas originales. Las dos válidas **se insertaron y se revirtieron**; no fue un
   > aborto previo a empezar.
   >
   > De modo que la forma correcta es **una operación, un archivo `.sql`, sin `BEGIN` ni
   > `COMMIT`**. Quien añada un `BEGIN` creyendo que refuerza la regla la rompe.
   >
   > Sigue en pie el límite: esto está comprobado **en local**. Que D1 se comporte igual en
   > remoto es de la iteración 24, y lo comprueba el autor.
2. **`INSERT` estricto, sin sobrescritura implícita.** Una colisión de identificador
   aborta el lote entero en vez de actualizar en silencio. Actualizar es una operación
   distinta, que se pide a propósito.
3. **La entrada es JSON, y es un encargo, no una fuente.** La herramienta recibe el
   trabajo en archivos JSON, que se pueden revisar antes de cargarlos y volver a correr
   igual. **La base sigue siendo la única fuente de verdad**: el JSON se consume y deja
   de importar. No se mantiene sincronizado con la base ni se consulta para saber qué
   hay en el banco. Es la diferencia con la planilla que esta misma ADR descarta más
   abajo, y conviene no confundirlas.
4. **La validación es la misma que la de lectura.** Se reutilizan las reglas de
   `functions/api/_validacion.js`, de modo que quien escribe y quien lee no puedan
   discrepar sobre qué es una pregunta válida. El contenido inválido se rechaza
   **antes** de tocar la base.
5. **La instantánea se regenera dentro del mismo acto.** Editar el banco y dejar el
   respaldo de ADR-008 desfasado no puede ser dos pasos, porque el segundo se olvida.

**Motivo · por qué local y no panel.** El escenario que originalmente justificaba el
panel —corregir una errata desde el teléfono— **queda descartado por decisión del autor
el 2026-09-08**: el trabajo sobre el proyecto ocurre siempre desde su computador. Sin
ese escenario, el panel paga autenticación, gestión de identidad y una superficie de
escritura nueva a cambio de una comodidad que nadie va a usar.

**Motivo · por qué una herramienta y no SQL a mano.** Escribir consultas directamente
deja el trabajo entero en manos de la atención del autor: un identificador repetido, una
restricción rota, una alternativa correcta duplicada. Las reglas que ADR-018, ADR-019 y
ADR-021 dejaron en el esquema existen precisamente porque ese error es esperable, y una
herramienta puede comprobarlas antes en vez de dejar que las descubra la base a mitad de
camino.

**Consecuencia · el contenido sólo se edita desde el computador del autor.** Es el costo
aceptado. No hay forma de corregir el banco desde otro equipo sin clonar el repositorio
y tener las credenciales de la cuenta de Cloudflare.

**Consecuencia · un JSON cargado no dice lo que hay en la base.** Si alguien conserva el
archivo con el que cargó un lote y lo lee después para saber cómo quedó el banco, se va a
equivocar: entremedio pudo haber correcciones que no pasaron por ese archivo. Para saber
qué hay en la base se consulta la base, o la exportación de `d1/respaldo-banco.sql` que
sale de ella (ADR-014).

**Consecuencia · la barrera de ADR-015 es condición de entrada, no trabajo posterior.**
La herramienta habla con wrangler, así que hereda entera la restricción: usa el wrangler
de `node_modules` y no `npx` (lección de H-013), trabaja contra la base local por
omisión, y cualquier camino hacia la nube exige el gesto explícito que ADR-015 definió.
Una herramienta de escritura que pueda alcanzar producción por descuido es peor que no
tener herramienta.

**Consecuencia · los errores de la base se traducen antes de mostrarse.** El autor no
tiene por qué leer `UNIQUE constraint failed: alternativa.pregunta_id, alternativa.letra`
para entender que puso dos veces la misma letra. La traducción es parte de la
herramienta, no un adorno.

**Lo que esta ADR no da por probado.** Que la transacción todo o nada **funcione** a
través de wrangler contra D1 es una afirmación que hay que **provocar**, no describir:
interrumpir un lote a mitad y comprobar que la base quedó como antes. Mientras esa
evidencia no exista, la regla 1 es una intención. Vale lo mismo que ADR-024 dejó escrito
para el escapado: el mecanismo se demuestra sobre el banco de juguete, y aguantar el
banco real es cosa de la iteración 24.

**Actualización · 2026-09-08.** Esa evidencia ya existe **en local**, y está resumida en
la corrección de la regla 1: el lote a medias revirtió. Lo que sigue sin probarse es el
mismo comportamiento **en remoto**, que es de la iteración 24.

**Consecuencia · el éxito se decide leyendo lo que wrangler dijo y volviendo a preguntarle
a la base, no por cómo terminó el proceso.** El motivo es **H-016**, que ya está
catalogado: en Windows wrangler se cae al terminar y devuelve códigos sin sentido, así que
su código de salida no es un testigo fiable. Vale igual al escribir, y ahí duele más: una
lectura que se cree exitosa devuelve una lista vacía y el respaldo de ADR-008 la cubre;
una **escritura** que se cree exitosa deja al autor creyendo que su lote entró, y si la
herramienta regenera la instantánea a continuación, la regenera desde una base que no
cambió y el archivo versionado confirma el error con apariencia de comprobación. Es
criterio de aceptación de la iteración 23.

**Alternativa descartada · panel de administración protegido.** Una página aparte,
autenticada con Cloudflare Access, con escritura desde el navegador. Se descarta porque
su única ventaja real era el escenario móvil que el autor retiró, y a cambio traía
gestión de identidad, una superficie de escritura publicada y la obligación de defenderla
para siempre. Queda escrita como la salida disponible **si algún día la edición tiene que
ocurrir fuera del computador del autor**, que hoy no es el caso.

**Alternativa descartada · mantener una fuente en planilla y volcarla a D1.** Conserva la
comodidad de edición que la migración a base de datos quitó, pero deja dos copias del
banco pudiendo discrepar y devuelve el ciclo de desarrollador que toda la épica 20 existe
para eliminar. Además reintroduce el problema que ADR-023 acaba de cerrar: una fuente de
verdad que no es la base, y un archivo que se queda atrás sin que nadie se entere.

**Origen.** El mecanismo se exploró primero con otro agente en la rama `antigravity`
(2026-09-06). **Se conserva la idea; se descarta su código**, por saltarse la barrera de
ADR-015, usar `npx wrangler` y determinar el éxito de una forma que no aguanta el fallo
de wrangler en Windows (H-013, H-016). Su archivo
`d1/migraciones/002-fecha-modificacion.sql` **no se rescata**: la migración que registra
la fecha de modificación se escribe desde cero en la iteración 23, y se registra en la
tabla `migracion`, cosa que aquella no hizo.

## ADR-026 · Toda carga del banco la ejecuta el autor desde su computador, revisada antes

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-09 · **Complementa a:** ADR-015 y ADR-025

**Decisión.** Es una **regla de trabajo declarada por Felipe Cuevas**, no una
suposición sobre cómo suelen pasar las cosas, y por eso queda escrita aquí:

1. **Toda carga de cuestionarios la hace el autor desde su computador.**
2. **Antes de cargar, el autor revisa el formato y la integridad de los archivos.**
3. **No hay cargas automáticas.** Ningún proceso programado, ningún disparador de
   publicación, ninguna tarea del sistema de construcción escribe en el banco.
4. **No hay cargas desde otro equipo.**

**Motivo, y es lo que la distingue de una costumbre.** El proyecto ya tiene escrito
—ADR-015, ADR-025— *quién puede* hablar con la cuenta de Cloudflare y *con qué
herramienta* se edita el banco. Lo que no estaba escrito es **cómo trabaja de hecho el
autor**, y esa diferencia importa al razonar sobre riesgos: una amenaza que sólo se
materializa con una carga automática, o con una carga lanzada desde una máquina que
nadie mira, **no aplica a este proyecto** — pero no aplicaba por costumbre, que es
como se dejan de cumplir las cosas.

Escrita, pasa a ser una condición que se puede citar y contra la que se puede
contrastar. Sin escribir, cada vez que alguien evaluara una barrera tendría que volver
a suponerlo, y una suposición repetida termina dándose por garantizada.

**Consecuencia sobre las barreras.** Las capas de la barrera de ADR-015 se dimensionan
sabiendo esto: **el modelo de amenaza no incluye un proceso desatendido escribiendo en
producción**. Incluye lo contrario, que es lo que de verdad ha pasado en este proyecto:
un comando que va a la base equivocada porque el nombre tecleado fue lo único que
decidió el destino (H-015), o un agente que ejecuta contra la nube lo que debía
escribir para que lo ejecutara el autor (H-014).

**Consecuencia sobre la revisión previa.** El punto 2 es parte de la decisión, no un
consejo. La revisión de formato e integridad **antes** de cargar es lo que sostiene que
la carga sea de una sola pasada y sin red: si el encargo llega revisado, el todo o nada
de la carga es una garantía; si llega sin revisar, el todo o nada sólo garantiza que el
error entre entero o no entre.

**Lo que esta ADR no dice.** No dice que el contenido sea correcto: dice que alguien lo
miró antes. Que una justificación sea cierta, o que una alternativa marcada como
correcta lo sea, siguen sin poder comprobarse con un programa, y eso está dicho donde
corresponde.

---

## ADR-027 · Todo guion que hable con la nube lleva su propia barrera de ADR-015, y se comprueba provocándola

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-09 · **Refuerza a:** ADR-015 · **Se apoya en:** H-014, H-023

**Decisión.** **Sin excepción:** cada guion del proyecto capaz de hablar con la cuenta
de Cloudflare implementa **su propia** barrera de ADR-015 —rechazar el destino remoto
salvo que `PERMITIR_REMOTO=1` esté puesto— y esa barrera **se comprueba provocándola**,
no leyéndola. Un guion cuya barrera nunca ha rechazado nada no tiene barrera
comprobada, por la regla de H-023.

**El patrón del enganche NO se amplía para cubrir los guiones nuevos.** Decidido así
por el autor el 2026-09-09, y el motivo es el que manda: **el patrón del enganche
siempre va a ir por detrás de los guiones nuevos.** Es una lista de nombres y de
banderas que alguien tiene que acordarse de actualizar cada vez que aparece un guion, y
el día que se olvide no avisa nadie. Perseguirlo daría una sensación de cobertura que
la lista no puede sostener.

**La regla es lo que hace que cada guion se defienda solo.** Un guion que nace con su
barrera está cubierto desde su primera línea, sin depender de que nadie recuerde
añadirlo a ninguna lista. La cobertura crece con los guiones en vez de quedarse atrás.

**Estado real de la capa 2, medido el 2026-09-09, y es peor de lo que se creía.** Se
midió dándole al enganche las líneas de comando reales, una por una, en vez de razonar
sobre su patrón. De **seis** formas de invocación que hablan con la nube, la capa 2
bloquea **dos**:

| Línea de comandos | ¿La bloquea la capa 2? |
|---|---|
| `npm run datos:instantanea -- <bandera remota>` | **sí**, por el prefijo `datos:` |
| la herramienta de Cloudflare invocada directo (`d1 export`) | **sí**, por su nombre |
| `node scripts/administrar-banco.mjs insertar … <bandera remota>` | **NO** |
| `node scripts/generar-instantanea.mjs <bandera remota>` | **NO** |
| `node scripts/volcar-contenido.mjs … <bandera remota>` | **NO** |
| `node scripts/comprobar-carga.mjs … <bandera remota>` | **NO** |

**Lo que esto corrige, y conviene decirlo sin suavizarlo.** Se había anotado que la
capa 2 no veía los dos guiones nuevos. La medición dice otra cosa: **tampoco ve
`administrar-banco.mjs`, que es la herramienta de escritura** —la que carga el banco en
producción—, ni `generar-instantanea.mjs` cuando se lo invoca con `node` en vez de por
el guion de npm. El mismo guion pasa o no pasa **según cómo se lo escriba**, que es el
filo de H-011 otra vez.

**Y esto refuerza la decisión en vez de contradecirla.** Si la lista ya se había quedado
atrás con los guiones que existían antes de hoy, perseguirla con los nuevos no la iba a
poner al día: la iba a dejar atrás más despacio. La regla que escala es la otra.

**Los cuatro guiones tienen su barrera propia**, que es la capa que de verdad los
cubre a los cuatro:

| Guion | Barrera propia | Cómo consta |
|---|---|---|
| `scripts/comprobar-carga.mjs` | sí | **provocada** el 2026-09-09 |
| `scripts/volcar-contenido.mjs` | sí | **provocada** el 2026-09-09 |
| `scripts/administrar-banco.mjs` | sí, línea 246 | **leída, no provocada** |
| `scripts/generar-instantanea.mjs` | sí, línea 203, rotulada «capa 3» | **leída, no provocada** |

Las dos últimas dicen «leída» a propósito, y por la regla de H-023 **eso no cuenta como
comprobado**. No las provocó Claude Code porque provocar la barrera de la herramienta de
escritura exige lanzarla con la bandera remota puesta, que es exactamente la forma del
acto que ADR-015 le prohíbe: si la barrera fuera lo que se cree, no pasa nada, y si no
lo fuera, el daño sería el que la ADR existe para evitar. **No se apuesta sobre eso.**
Las provoca el autor, en un segundo, y quedan cerradas.

**Esto no es un defecto de la capa 2: es su naturaleza, y ya estaba escrita.** El
propio encabezado del enganche dice que sólo ve la línea de comandos y que **es la capa
barata, no la que sostiene**. Se anota aquí porque una limitación escrita dentro del
archivo que la tiene no la ve quien lee la lista de barreras y cuenta tres.

**Consecuencia práctica, para el guion siguiente.** Un guion nuevo que hable con la
nube no está terminado hasta que:

1. Rechaza el destino remoto sin `PERMITIR_REMOTO=1`, **provocado**.
2. Coteja el uuid contra `wrangler.toml` antes de tocar nada, **provocado**, porque el
   nombre es lo que uno escribe y el uuid es contra lo que se termina hablando (H-015).
3. Deja dicho en su encabezado que lo remoto lo ejecuta el autor.

**Lo que sigue sin cambiar.** La capa que de verdad sostiene sigue siendo la 1: el
entorno sin credenciales. Esta ADR añade una capa por guion, no reemplaza aquélla, y
sobre todo **no convierte la capa 2 en algo que no es**.

---

## ADR-028 · Una corrección aprobada obliga a reconvertir y recomprobar el módulo entero

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-09 · **Complementa a:** ADR-017 · **Se apoya en:** H-030

**Decisión.** Cuando se aprueba una corrección al texto de una pregunta de los bancos
de origen, **el módulo entero se reconvierte y se vuelve a comprobar**. Aparezca cuando
aparezca: también después de que el autor haya aprobado el documento de justificaciones,
y también si aparece con el lote listo para cargar.

**No hay punto de corte.** No existe un momento a partir del cual salga más barato
cargar algo que sabemos malo.

**Motivo, y es el que manda.** El costo de reconvertir es que un guion vuelva a correr.
El costo de publicar un enunciado con premisa falsa **lo paga un estudiante
leyéndolo** — y lo paga estudiando para una certificación, que es justo cuando menos
puede permitirse aprender algo falso. Los dos costos no son comparables, así que no hay
nada que ponderar.

**La condición que esta decisión se pone a sí misma.** La reconversión tiene que ser
**automática y comprobada**, no un gesto manual que se pueda olvidar. Una regla que
depende de que alguien se acuerde es una regla que se cumple hasta el día que hay prisa,
y ese es exactamente el día en que se carga el módulo.

**Cómo se cumple esa condición.** `scripts/procedencia.mjs`. Al convertir, el encargo
queda **sellado** con la huella de los cuatro orígenes de los que salió:

| Origen | Qué se sella |
|---|---|
| `modulo-0N.json` | el archivo entero |
| `static/js/data/cuestionario.js` | **sólo el grupo de ese módulo** |
| `retiradas.json` | **sólo las entradas de ese módulo** |
| `correcciones-de-enunciado.json` | **sólo las entradas de ese módulo** |

Y **tres pasos distintos cotejan ese sello contra los archivos de hoy y se niegan a
seguir si algo se movió**: `comprobar-conversion.mjs`, que no puede bendecir una
conversión cuyo origen ya no está; `aplicar-justificaciones.mjs`, que produce el archivo
que se carga; y `administrar-banco.mjs`, que es el que escribe y por tanto la última
puerta antes de la nube.

**Por qué se acota por módulo y no por archivo entero.** Una corrección aprobada para el
módulo 5 no tiene por qué invalidar el encargo del 3. Si lo invalidara, la primera
reacción de cualquiera sería aprender a ignorar el aviso, y un aviso que se ignora es
peor que no tenerlo. Acotarlo no es una optimización: es lo que hace que la comprobación
sirva.

**Motivo de fondo · es H-030 un eslabón más arriba.** Allí un archivo existía, tenía
fecha, pesaba 527 bytes y no era el banco; pasó por respaldo durante seis días porque
nadie lo abrió. **Un encargo que ya no corresponde a su origen es el mismo problema:**
está bien formado, pasó su comprobación, y la pasó contra un archivo que ya no es el que
hay. En los dos casos el archivo se parece lo suficiente a estar bien como para que
nadie lo mire.

**Consecuencia sobre el trabajo, dicha para que no sorprenda.** Reconvertir **no**
obliga a re-aprobar las 61 justificaciones. `redactar-justificaciones.mjs` conserva las
aprobaciones cuya pregunta y justificación no cambiaron y devuelve a cero sólo las
demás. En el módulo 2, cinco correcciones movieron cinco justificaciones y las otras
cuarenta y siete siguieron aprobadas.

**Consecuencia sobre el orden del procedimiento.** Como una corrección puede aparecer
tarde, el procedimiento del lote **no es una lista recta**: tiene una rama que vuelve
atrás, y esa rama está escrita dentro de la lista y no como nota al pie. Vivía en la
memoria de quien había hecho el módulo 2, que es donde no puede vivir.

**Escape, y por qué existe.** Los tres pasos aceptan `--sin-cotejo`. Existe porque una
regla sin escape se termina esquivando por fuera —editando el sello a mano, que no deja
rastro— y porque los encargos escritos a mano no llevan sello y tienen que seguir
funcionando. No está por omisión y quien lo use lo ve escrito en la salida.

---

## ADR-029 · Una alternativa imprecisa pero fiel al examen se conserva; solo se corrige la que enseña una regla falsa

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-10 · **Extiende:** ADR-017 · **Sujeta a:** ADR-028

**Decisión.** Establecida por Felipe Cuevas el 2026-09-10, al resolver las cuatro dudas
del módulo 3. **Es una regla del proyecto, no la respuesta a un caso.**

**El examen real de Talento Digital afirma cosas de forma tajante.** Por eso una
alternativa **imprecisa pero fiel al examen se conserva**, y el lugar donde se dice la
verdad completa es **la justificación**.

**Solo se corrige el texto cuando la alternativa correcta enseña una regla falsa que el
alumno va a aplicar mal en otra pregunta.** Eso no es imprecisión de lenguaje: es
contenido equivocado.

### La línea, dicha de modo que se pueda aplicar

| | Qué se hace |
|---|---|
| La alternativa dice algo **más tajante de lo que es**, y sigue apuntando al hecho correcto | **Se conserva.** El matiz va en la justificación |
| La alternativa **afirma una regla que es falsa**, aunque el resultado que da sea correcto | **Se corrige.** El texto, no la justificación |

La pregunta que decide no es «¿está bien dicho?» sino **«¿qué se lleva el alumno si
memoriza esta alternativa?»**. Si se lleva el hecho correcto con una redacción dura, se
conserva: así viene el examen. Si se lleva una regla que le va a fallar en la pregunta
siguiente, se corrige.

### Los casos que fijaron la regla

**Corregidas · enseñaban una regla falsa:**

- **`m02#30`** · El enunciado decía que «el motor del DOM reconoce automáticamente» el
  atajo de jQuery. El motor no reconoce nada: `$` es una variable corriente que declara
  la biblioteca. La respuesta marcada era correcta y **la premisa era falsa**.
- **`m03#10`** · La alternativa correcta explicaba `[] == false` por «coerción implícita
  de tipos hacia **booleanos**». `==` no convierte a booleano: convierte a **número**.
  El resultado que afirmaba era correcto y el motivo, falso. Un alumno que memorizara
  esa regla la aplicaría mal de inmediato, porque `[] == false` da `true` mientras
  `[] ? 1 : 2` da `1` — como condición, el arreglo vacío es verdadero. Corregida a
  «hacia números».

**Conservadas · imprecisas y fieles, con el matiz en la justificación:**

- **`m03#6`** · «El hilo se detiene» ante un error de sintaxis. Está dicho más fuerte de
  lo que es. **Se conserva porque el examen real usa ese mismo lenguaje.** La
  justificación precisa que no se ejecuta ese script mientras la página, los demás
  scripts y los manejadores siguen funcionando.
- **`m03#32`** · «Descartadas por el recolector de basura». La justificación advierte la
  excepción: si un closure las capturó, siguen vivas. **Es justo lo que una
  justificación buena debe adelantar**, porque el alumno va a ver closures poco después.
- **`m03#17`** · Huecos frente a `undefined`. La justificación dice «se leen como
  `undefined`» en vez de «se rellenan con `undefined`», **sin abrir el tema de los
  huecos**: la distinción es cierta y a un principiante todavía no le sirve.

### Por qué esto extiende ADR-017 y no la repite

ADR-017 decidió conservar **los distractores** evidentemente descartables, para que el
estudiante ensaye también el descarte por forma. Esta ADR se ocupa de la otra mitad del
ítem: **la alternativa correcta**, que es la única que el alumno se va a llevar
aprendida. Conservar un distractor flojo no le enseña nada falso; conservar una correcta
que afirma una regla falsa, sí. Por eso la fidelidad al examen manda en un caso y cede
en el otro, y por eso hacía falta escribirlo aparte.

### La justificación deja de ser un accesorio

De aquí se sigue algo que conviene dejar dicho: **cuando se conserva una alternativa
imprecisa, la justificación es el único sitio donde el estudiante puede encontrar la
verdad completa.** No es un adorno ni un resumen: es la mitad del ítem que corrige a la
otra. Una pregunta conservada bajo esta regla **sin** su matiz escrito es peor que
haberla corregido.

### Consecuencia operativa

Una corrección aprobada bajo esta regla dispara **ADR-028** sin excepciones: se
reconvierte y se recomprueba el módulo entero. Corregir una **alternativa correcta**
mueve además el texto en que ancla el comprobador de conversión, así que la reconversión
no es una formalidad — es lo que impide que el módulo quede comprobado contra un texto
que ya no existe.

---

## ADR-030 · Los mensajes de commit no pasan de 200 caracteres; el porqué vive en la bitácora y el registro

**Estado:** ✅ Aceptada · **Fecha:** 2026-09-10 · **Afecta a:** el flujo de trabajo de CLAUDE.md

**Decisión.** Establecida por Felipe Cuevas el 2026-09-10, después del commit del
módulo 3, que ocupaba treinta líneas.

Un mensaje de commit **no pasa de 200 caracteres**: una línea que diga qué se hizo, y
basta.

**El porqué se va íntegro a `99-bitacora/` y a `00_producto/registro_log.md`.** No se
resume ni se recorta: **cambia de sitio**.

**Motivo.** Ese contexto es lo que ha hecho utilizable este proyecto y no se pierde.
Pero el mensaje de commit es el peor sitio donde guardarlo:

- **No se puede corregir.** Un `git commit --amend` sobre algo ya empujado reescribe
  la historia; un error en la bitácora se arregla editando un archivo.
- **No se puede enlazar ni buscar bien.** La bitácora y el registro se leen enteros,
  se referencian por número de ADR o de hallazgo, y se navegan.
- **No se lee.** Un mensaje de treinta líneas se colapsa en cualquier vista de
  historial, y lo que queda visible es la primera línea de todos modos.

**La prueba de que la regla funciona, y es la parte que importa: si un commit corto
deja algo sin explicar, es señal de que falta escribirlo allá.** El mensaje corto no
esconde el contexto — lo delata cuando no está escrito donde corresponde. Es un
detector, no una pérdida.

**Lo que esto NO autoriza.** No autoriza escribir menos. La cantidad de contexto que
este proyecto produce por lote —hallazgos, decisiones, evidencia, lo que salió
distinto— sigue siendo la misma y sigue siendo obligatoria. Cambia dónde se escribe,
y solamente eso.

**Forma del mensaje.** La que ya venía usando el proyecto, ahora acotada:

```
Plan Trabajo - Iteracion NN: <qué se hizo>.
```

**Consecuencia sobre la bitácora.** Hasta hoy tenía **una entrada por iteración
cerrada**. La iteración 25 dura siete lotes y su contexto no puede esperar al
séptimo, así que admite además **una entrada por lote**, con el nombre
`AAAA-MM-DD-iteracion-NN-modulo-MM.md`. Queda anotado en
`99-bitacora/README.md`.

---

## ADR-031 · El banco fuente se queda en `_planmaestro/00_producto/cuestionarios/`

**Fecha:** 2026-09-10 · **Estado:** aceptada · **Decide:** Felipe Cuevas

### Contexto

Desde la iteración 21 los siete `modulo-0N.json` viven en
`_planmaestro/00_producto/cuestionarios/`, y la fila que los puso ahí lo declaró
**temporal**, con una ubicación definitiva por decidir. La fila llevaba abierta cinco
iteraciones y arrastraba una advertencia concreta: **al moverlos hay que comprobar de
forma explícita que la carpeta destino no termine copiada a `dist/`**, porque son
archivos con las respuestas correctas y servirlos al navegador deja el simulacro sin
sentido.

Hoy es seguro por una razón estructural y no por cuidado: `build-dist.mjs` copia una
lista blanca, `LISTA_COPIA`, y esa lista no nombra `_planmaestro/`. Nada dentro de
`_planmaestro/` puede llegar a `dist/` sin que alguien edite esa lista a propósito.

### Decisión

**No se mueven.** La ubicación temporal pasa a ser la definitiva.

### Por qué

1. **El riesgo que motivaba el traslado ya está cubierto donde estaba.** Mover era una
   forma de proteger los archivos de `dist/`; desde `_planmaestro/` ya están protegidos
   por la lista blanca, que es una barrera más fuerte que una convención de carpetas.

2. **Mover rompería las siete huellas de procedencia sin ganar nada.** Los sellos de
   ADR-028 fijan la ruta de cada fuente junto a su SHA-256. Cambiar la ruta invalida los
   siete encargos del banco ya cargado: habría que regenerarlos para que volvieran a
   cotejar, y ese trabajo compraría prolijidad, no seguridad.

3. **El banco fuente es material de planificación, no material del sitio.** Está junto a
   las justificaciones, las retiradas y las correcciones de enunciado, que son de la
   misma naturaleza. Sacarlo de ahí lo separaría de los archivos con los que siempre se
   lee junto.

### Consecuencias

- La fila de la iteración 21 se cierra como **decidida**, no como pendiente.
- La advertencia sobre `dist/` **no desaparece**: se traslada a esta ADR. Si alguna vez
  se mueve el banco, o se agrega `_planmaestro/` a `LISTA_COPIA`, hay que comprobar
  explícitamente que las respuestas correctas no queden servidas al navegador. Esa
  comprobación no existe hoy porque hoy no hace falta.
- Las rutas selladas en los siete encargos quedan firmes, y **su coincidencia sigue
  siendo demostrable**, que es lo que el retiro del banco viejo acaba de demostrar.

---

## ADR-032 · El selector de módulo vive en el panel fijo, sobre las barras de avance

**Fecha:** 2026-09-11 · **Estado:** aceptada · **Decide:** Felipe Cuevas

### Contexto

La iteración 31 convierte `cuestionario.html` en una página que dibuja **un módulo a la
vez** en lugar del banco entero. El archivo de la iteración cerró dos decisiones —se filtra
por módulo, y el selector queda libre en todo momento— y dejó una abierta a propósito:
**dónde vive el selector**.

La página tiene dos zonas. A la izquierda, un panel con la explicación, las barras de
progreso y los botones; es `lg:sticky` con su propio desplazamiento. A la derecha, las
preguntas. Ese reparto se mantiene y no está en discusión. Pero el selector puede ir en
cualquiera de las dos, y no da lo mismo: en `lg:` la izquierda acompaña a la orientación y
queda visible al desplazarse, mientras que la derecha encabeza lo que controla y es lo
primero que se mira al llegar. Y en teléfono, donde las dos zonas se apilan en el orden del
documento —izquierda primero—, la elección cambia qué aparece antes en pantalla.

### Decisión

El selector va en **el panel fijo, después del párrafo de presentación y antes de las tres
barras de avance**. El bloque que avisa de la pérdida de respuestas va pegado a él, en el
mismo sitio.

### Por qué

1. **Un control no puede ir después de lo que gobierna.** Al filtrar por módulo, las tres
   barras dejan de medir el banco y pasan a medir el módulo elegido: `estado.total` deja de
   ser 368 y pasa a ser 61, 49 o 45. Las barras, el porcentaje y «Preguntas del módulo» son
   consecuencia directa del selector. Ponerlo debajo obliga a leer los números antes de
   saber de qué son.

2. **En escritorio, el panel es pegajoso y la zona derecha no.** Un módulo de 61 preguntas
   mide varias pantallas. Con el selector en la zona derecha se iría con ellas, y cambiar de
   módulo exigiría volver arriba del todo. Eso contradice la decisión de la iteración 31 de
   **dejar el selector libre en todo momento**: un control libre pero inalcanzable está
   bloqueado en la práctica.

3. **En teléfono, esta columna se apila primero.** Con el selector en la zona derecha
   quedaría por debajo del panel entero —título, párrafo, tres barras, caja de avance, dos
   botones y dos enlaces—: la primera acción de la página, enterrada bajo pantalla y media.
   El público de `vision.md` estudia desde el teléfono, en sesiones cortas e interrumpidas.

### Lo que se pierde, y cómo se compensa

El argumento a favor de la zona derecha es real: allí el selector encabezaría exactamente lo
que controla. Se paga con dos cosas:

- El estado vacío de la zona derecha **no se limita a decir «elige un módulo»**: lleva un
  enlace `#selector-modulo` que además mueve el foco al selector. En escritorio es
  redundante; en teléfono es lo que cierra la distancia entre el mensaje y el control que lo
  resuelve.
- La cabecera de módulo se conserva sobre las preguntas, de modo que la zona derecha sigue
  diciendo qué se está mirando sin depender de que el panel esté a la vista.

### Consecuencias

- El rótulo «Avance total» pasa a «Avance del módulo», y «Reiniciar cuestionario» a
  «Reiniciar el módulo». Medían el banco y ahora miden un módulo: dejarlos habría sido dejar
  dos rótulos mintiendo, que es el mismo defecto que ya corrigió el contador de la portada.
- La iteración 32, que trae el índice de módulos con avance individual, hereda este sitio:
  el índice vive junto al selector, no enfrente de él.
- Si alguna vez el panel dejara de ser pegajoso, el motivo 2 caduca y esta ADR hay que
  revisarla.

### Actualización · 2026-09-11 · el control cambia de forma, no de sitio

La iteración 32 reemplaza el `<select>` por un **índice de los siete módulos**, que pasa a ser
el único control para elegir qué practicar. Se anota aquí porque esta ADR describía el control
además del sitio, y la mitad que describía el control queda sustituida.

**Lo que NO cambia: el sitio.** Los tres motivos de arriba se sostienen enteros —el control
sigue gobernando las barras que vienen debajo, el panel sigue siendo pegajoso mientras la zona
derecha no lo es, y en teléfono esta columna se sigue apilando primero—. El índice hereda ese
sitio.

**Lo que cambia, y lo que hay que reponer a mano.** El `<select>` se eligió por dos ventajas
concretas que el índice no trae gratis:

- **Coste vertical.** Un desplegable ocupa una fila; siete filas suman unos 300 px en un panel
  que ya es largo. Por eso el índice va como lista en escritorio y como rejilla compacta en
  teléfono, y por eso la iteración 32 mantiene el criterio de la ventana de 700 px de alto.
- **Semántica de formulario.** El `<select>` daba teclado, foco y lectura de pantalla sin
  programar nada. El índice tiene que dar `aria-current` en el módulo activo, orden de
  tabulación sensato y un nombre accesible por fila que diga módulo y cantidad.

**Y una puerta que no se puede dejar abierta.** El aviso de pérdida de avance de la iteración
31 está atado al `change` del selector. Al saltar desde el índice, ese salto tiene que pasar
por la **misma** puerta: si el índice cambia de módulo por su cuenta, el aviso se esquiva sin
que nadie lo note. `probar-filtrado.mjs` tiene que pasar a provocar el cambio desde el índice,
porque mientras siguiera disparando el selector no vería nada de esto.

### Actualización · 2026-09-11 · elegir un módulo deja al estudiante en su cabecera

**Decisión del autor.** Cuando un módulo termina de cargar, el estudiante queda en la cabecera
de ese módulo: se desplaza hasta ahí y el foco va ahí. Se aplica igual venga el cambio directo
del índice —sin respuestas que perder— o del botón «Cambiar de módulo» del aviso. «Quedarme
acá» devuelve el foco a la fila del módulo actual en el índice.

**Por qué.** Hasta ahora elegir un módulo lo dibujaba sin mover la página, y eso solo funciona
si las preguntas ya están a la vista. No lo están en ninguno de los dos usos reales del sitio:

- En **teléfono** las dos columnas se apilan y las preguntas quedan pantalla y media por
  debajo del índice. Elegir un módulo no mostraba nada; había que adivinar que tocaba
  desplazarse.
- En **escritorio** el panel es pegajoso, así que se puede elegir con la página ya desplazada.
  La zona derecha se reescribe entera y el desplazamiento se queda donde estaba: el estudiante
  aterriza **a mitad** de un módulo que acaba de empezar.

**Esto modifica la compensación que esta ADR describía.** El enlace «Ir al índice de módulos»
del estado vacío se justificaba como la mitad de un viaje que el estudiante tenía que completar
a mano: bajaba al índice, elegía, y volvía a subir por su cuenta. Ahora **la vuelta la hace el
sitio**. El enlace se conserva —sigue resolviendo la ida, que es real: el mensaje está debajo
del panel y hay que llegar al control—, pero deja de ser la única compensación del sitio
elegido para el índice, y pasa a ser la mitad de una ida y vuelta completa.

**Dos detalles del cómo, que son parte de la decisión y no del código.** El desplazamiento
suave respeta `prefers-reduced-motion`, y el foco se pide con `preventScroll` para que enfocar
no produzca una segunda sacudida que pelee con la primera.

**Y los dos finales sin preguntas se tratan aparte.** Si la carga falla o el módulo viene
vacío no hay ninguna cabecera a la que ir: el foco va al mensaje que explica lo que pasó.
Desplazarse a una cabecera inexistente, o dejar el foco donde estaba, deja a quien navega con
teclado sin saber qué ocurrió.

### Actualización · 2026-09-15 · el aviso de pérdida se retira, y la puerta se queda

La iteración 33 le da memoria al cuestionario (ADR-034). Esta actualización se escribe porque,
sin ella, esta ADR quedaría describiendo en presente un mecanismo que ya no existe.

**Lo que se retira: el aviso de pérdida de avance.** Y con él, todo lo que existía solo para
sostenerlo: su contenedor en `cuestionario.html`, sus dos botones, el paso de confirmación en
`cuestionario.js` y el bloque que lo probaba en `scripts/probar-filtrado.mjs`. Existía porque
cambiar de módulo costaba lo respondido. Con memoria ya no cuesta nada, y **un aviso que no
protege de nada entrena a ignorar los avisos** —que es el mismo argumento con el que la
iteración 31 decidió no mostrarlo cuando no había nada que perder—. Cambiar de módulo pasa
directo, siempre.

Queda sin efecto, por lo tanto, el párrafo «una puerta que no se puede dejar abierta» de la
actualización del 2026-09-11, en la parte en que ata el aviso al cambio de módulo y le pide a
`probar-filtrado.mjs` que lo provoque desde el índice.

**Lo que NO se retira: la puerta única.** `pedirCambioDeModulo()` sigue siendo el único camino
para cambiar de módulo. Lo que cambia es su motivo, y hay que dejarlo escrito porque el motivo
viejo se fue con el aviso. Hoy concentra tres guardas, y las tres se saltarían **en silencio**:

1. **La doble petición.** Pulsar el mismo módulo mientras carga no vuelve a pedirlo.
2. **El reintento tras una carga fallida.** Volver a pulsar el módulo que ya está puesto no hace
   nada, salvo que no haya quedado puesto; esa excepción es el único camino de vuelta cuando la
   capa de datos falla.
3. **El viaje a la cabecera**, con el foco y el desplazamiento, que es lo que decidió la
   actualización anterior de esta misma ADR.

`scripts/probar-filtrado.mjs` pasa a comprobarlo midiendo: dos pulsaciones seguidas del mismo
módulo desde el índice salen a la red **una** vez; llamando a `mostrarModulo()` por fuera,
**dos**. Si algún día las dos cifras se igualaran, la prueba lo dice, porque entonces habría
dejado de distinguir una cosa de la otra.

**Y la memoria no depende de esta puerta.** El avance se guarda al responder, no al salir del
módulo: cerrar la pestaña a mitad de un módulo no pierde nada. Que la memoria dependiera de
pasar por un sitio concreto sería reponer, en otra forma, el problema que esta puerta existe
para no tener.

**El sitio del control no se mueve**, y los tres motivos de esta ADR siguen enteros. Lo que sí
se anota, porque toca el coste vertical que esta ADR contabilizó: el avance de cada módulo se
dibuja **dentro de su fila** del índice, junto a la cantidad —«12/61»—, y los dos textos nuevos
de la iteración 33 —que el avance vive solo en este dispositivo, y que no se está guardando—
viven en la **zona de preguntas**, no en el panel. El panel no crece ni una fila, y la ventana
de 700 px de alto sigue alcanzando hasta el botón de reiniciar.

### Actualización · 2026-09-18 · la ventana de 700 px NO alcanza el botón de reiniciar

*Medición confirmada por el autor con captura de pantalla real, al cerrar la iteración 45.*

**La afirmación de esta ADR es falsa, y lo era desde que se escribió.** Esta ADR dice dos
veces que en una ventana de 700 px de alto el panel llega hasta «Reiniciar el módulo» sin que
haya que desplazarse: una en la actualización del 2026-09-11 —«por eso la iteración 32 mantiene
el criterio de la ventana de 700 px de alto»— y otra, con todas sus letras, al final de la
actualización del 2026-09-15 —«la ventana de 700 px de alto sigue alcanzando hasta el botón de
reiniciar»—. **No alcanza.**

**Lo que se midió, a 1280 × 700, en la parte superior de la página y sin desplazar:**

- El **índice de los siete módulos se corta a la mitad de la fila del Módulo 6.**
- Quedan fuera de los 700 px, y hay que desplazarse para verlos: **las tres barras de
  progreso**, el botón **«Reiniciar el módulo»** y los **enlaces de NotebookLM**.
- El panel mide entre **1.340 y 1.366 px** de alto natural contra **636 px** disponibles bajo
  el encabezado fijo. Sobra más del doble de lo que cabe.

**De dónde salió.** El cálculo lo hizo la lectura de alcance de la **iteración 45** el
2026-09-18, sumando el alto declarado de cada bloque del panel, y contradecía a esta ADR. Por
eso la 45 lo puso como punto 11 de su lista de verificación en el navegador —**no** como un
criterio de aprobar o fallar, sino como la medición que decidía cuál de los dos tenía razón— y
dejó el resultado anotado en `registro_log.md` mientras faltaba. La captura del autor lo
resolvió: **tenía razón el cálculo.**

**Esto NO pide arreglar nada.** No es un encargo de achicar el panel, de reordenarlo ni de
tocar el diseño. Lo único que hace esta actualización es **dejar registrada la afirmación
corregida**, para que nadie vuelva a apoyarse en ella. Si más adelante se decide acortar el
panel, será **una decisión de diseño aparte**, con su propia ADR o su propia iteración.

**Qué queda en pie de esta ADR, que es casi todo.** El sitio del control no se mueve: los tres
motivos de la decisión original —un control no puede ir después de lo que gobierna, el panel es
pegajoso mientras la zona derecha no lo es, y en teléfono esta columna se apila primero— no
dependen de que el panel quepa en 700 px. Lo que se cae es **el argumento del coste vertical**
tal como estaba escrito: la frase «el panel no crece ni una fila, y la ventana de 700 px de
alto sigue alcanzando hasta el botón de reiniciar» se sostenía sobre una premisa que nadie
había medido. «El panel no crece ni una fila» sigue siendo cierto y sigue siendo una buena
regla; lo falso era la conclusión que se le colgaba.

**Y la lección, que vale más que el dato.** Esta afirmación sobrevivió a dos actualizaciones de
su propia ADR y a tres iteraciones, repetida cada vez con más confianza, **sin que nadie la
midiera ni una sola vez**. Es el mismo patrón del contador de la portada —«21 preguntas de
práctica» con 368 en el banco— y del `text-ruby` de `#valor-incorrectas`: lo que no tiene quien
lo compruebe se degrada en silencio, y repetirlo no lo vuelve verdadero.

---

## ADR-033 · `/api/preguntas?resumen=1`: los siete conteos por módulo, sin traerse el banco

**Fecha:** 2026-09-11 · **Estado:** aceptada · **Decide:** Felipe Cuevas

### Contexto

La iteración 32 trae un **índice de los siete módulos** que reemplaza al selector de la 31
como único control para elegir qué practicar. Ese índice muestra los siete a la vez, y cada
uno con cuántas preguntas tiene.

La iteración 31 había decidido **«sin número hasta que sea cierto»**: el selector no promete
cifras y cada módulo estrena la suya cuando se dibuja. Esa regla funcionaba porque el
selector muestra un módulo a la vez, así que cada cifra aparecía en el momento en que se
volvía verdadera. **Con los siete a la vista deja de funcionar:** o están las siete cifras, o
hay una y seis huecos que van rellenándose a medida que el estudiante pasea.

Hoy el navegador no tiene de dónde sacarlas. `/api/preguntas` trae preguntas completas —371,8
KB, medidos contra el servidor local—, `/api/estado` sólo el total del banco, y la
instantánea son 500 KB que no se cargan para contar. La cuarta opción, escribir los siete
números en el código, es literalmente el «105 preguntas» que ya mintió el 2026-09-08.

### Decisión

`/api/preguntas` acepta **`?resumen=1`**. En vez de las preguntas, devuelve una fila por
módulo con su título, su ícono y **cuántas preguntas activas tiene**, contadas sobre
`pregunta_activa` con un `COUNT(*) ... GROUP BY modulo`.

Sigue siendo **solo lectura**, sobre la misma vista, y no abre ninguna ruta nueva.

Reglas de la interfaz, escritas porque son la parte que se olvida:

- **`resumen` y `modulo` se componen.** `?modulo=3&resumen=1` devuelve la fila del módulo 3.
  Es una pregunta coherente y negarse a contestarla costaría más código que contestarla.
- **Sólo vale el valor `1`.** Ausente significa «no». Cualquier otro valor —`0`, `true`,
  `verdadero`— es `PETICION_INVALIDA`, no «no». Tratar en silencio un `resumen=true` como
  apagado le devolvería al que pidió 0,9 KB el banco entero de 371,8 KB, que es exactamente
  el fallo que esta ADR existe para evitar.
- **Los nombres no se traducen** (ADR-011): `modulo`, `modulo_titulo`, `modulo_icono` y
  `preguntas`, en snake_case, igual que en el resto de la capa.

### Por qué este camino y no los otros dos

1. **Un archivo generado con los siete conteos duplica un dato que D1 ya tiene.** Sería cierto
   hasta la próxima carga del banco y después mentiría **en silencio**, que es el modo de
   fallo más caro de los tres. El conteo vive donde viven las preguntas o no vive.
2. **El coste es despreciable frente a traerse el banco.** Medido contra el servidor local una
   vez construido: **0,9 KB las siete filas, frente a 371,8 KB el banco entero. 410 veces
   menos.** Al escribir esta ADR se estimó en 0,2 KB extrapolando de `/api/estado`, que
   devuelve un objeto y no siete filas con título e ícono; la diferencia no cambia la
   decisión, y se corrige acá para que el número que queda escrito sea el medido.
3. **El filtro por estado sigue viviendo en la vista.** Al contar sobre `pregunta_activa` y no
   sobre `pregunta`, ninguna consulta puede olvidarse de excluir borradores y retiradas
   (ADR-020). Es el mismo motivo por el que el extremo ya leía de ahí.
4. **Y arregla hacia atrás el selector de la 31 sin romper su regla.** Las cifras siguen
   saliendo de un dato y no del código; lo único que cambia es que el dato llega antes.

### Por qué en el mismo extremo y no en un `/api/modulos` nuevo

Porque lo que se pide **es un dato sobre las preguntas** —cuántas hay por módulo—, no un
catálogo de módulos. Un extremo aparte tendría que contar lo mismo, sobre la misma vista, y
el día que las dos consultas divergieran el índice diría una cosa y el cuestionario dibujaría
otra, sin que nada lo anunciara. Es el mismo razonamiento por el que
`scripts/generar-instantanea.mjs` importa las consultas de `functions/api/preguntas.js` en vez
de tener copia propia.

### Consecuencias

- **Se amplía la superficie de la capa de datos**, que ADR-007 abrió y ADR-009 acotó. Esta ADR
  es la autorización explícita que esas dos exigen. El Worker sigue sin escribir, sin
  renderizar páginas y sin identificar estudiantes: el alcance de ADR-009 no se mueve.

- **El modo degradado carga la instantánea al abrir la página, no al elegir módulo.** Si la
  capa de datos no contesta, los siete conteos tienen que salir del respaldo, y eso son 500 KB
  en la carga inicial. Se acepta: es el camino degradado, y el estudiante va a necesitar ese
  archivo igual en cuanto elija.

  **Tiene un efecto secundario que mejora las cosas:** el aviso de ADR-008 pasa a aparecer al
  abrir la página, encima del estado vacío, en vez de esperar a la primera elección. El
  estudiante se entera de que está viendo una copia **antes** de ponerse a estudiar, que es lo
  que ADR-008 pide con todas sus letras y lo que hasta ahora ocurría un paso más tarde.

- **El conteo no pasa por la validación por fila, y eso puede desalinearse.** `/api/preguntas`
  valida cada pregunta y puede descartar alguna; `?resumen=1` cuenta filas de la vista. Si
  alguna vez se descartara una, **el índice prometería 61 y la página dibujaría 60**. Hoy el
  informe de validación dice `descartadas: 0`, así que no ocurre.

  No se tapa igualando los números por las malas. Se hace dos cosas: **lo dibujado manda**
  —la cabecera del módulo y el contador de la portada siguen contando sobre el HTML— y
  `scripts/probar-filtrado.mjs` compara el conteo del resumen contra el dibujado y **da rojo
  si difieren**. Una discrepancia silenciosa se convierte así en un veredicto.

- **`scripts/probar-filtrado.mjs` gana una comprobación**: que los siete conteos del resumen
  coincidan con los de la base consultada aparte por wrangler, y con lo que se dibuja.

### Actualización · 2026-09-15 · el resumen trae también los ids, y «lo dibujado manda» vale también para el avance

La iteración 33 le da memoria al cuestionario, y con eso el índice tiene que decir cuánto lleva
el estudiante en los siete módulos **sin abrir ninguno**. Esta ADR se enmienda en dos puntos.
No se sustituye: sigue siendo lectura, sobre la misma vista, en el mismo extremo y por el mismo
motivo. **ADR-009 no se mueve.**

**1 · La fila gana `preguntas_ids`.** Los ids de las preguntas activas de ese módulo, en la
misma consulta, con `group_concat(id)`. Son necesarios porque el avance se guarda por id de
pregunta (ADR-034) y contarlo sin saber qué ids siguen activos haría que una pregunta retirada
sumara avance para siempre. Ese es justo el número falso que esta ADR existe para no tener.

**Van en la misma consulta y no en una segunda** porque son exactamente las filas que ya se
leen para contarlas. Una consulta aparte las leería dos veces para responder lo mismo.

**Y los trae también la forma compuesta.** `?modulo=3&resumen=1` devuelve la fila del módulo 3
**con sus `preguntas_ids`**, igual que la forma sin filtro devuelve las siete con los suyos. No
es un añadido: es lo que la regla de composición de esta ADR ya exigía. `resumen` decide *qué
forma* tiene la respuesta y `modulo` decide *sobre qué filas* se calcula; si al componerlos la
fila perdiera los ids, `resumen` significaría una cosa solo y otra cosa acompañado, que es
exactamente la incoherencia que esta ADR cerró al negarse a tratar `resumen=true` como «no».
En el código es la misma `sqlResumen()` con un `WHERE modulo = ?1` añadido —una sola
definición de la cuenta, como manda esta ADR—, así que la coherencia no depende de acordarse:
no hay dos sitios donde pudiera divergir.

**El coste, medido el 2026-09-15 contra la base local, antes y después en la misma ejecución:**

| | bytes | `filas_leidas` |
|---|---|---|
| Sin los ids | 929 | 1111 |
| Con los ids | 2419 | 1111 |
| El banco entero, para comparar | 380 688 | 4783 |

Las filas leídas **no suben**, y no es casualidad: el plan de las dos consultas es el mismo
—`SEARCH p USING COVERING INDEX pregunta_por_estado_y_modulo`—, porque el índice que ya se
recorría trae el id consigo. `scripts/probar-filtrado.mjs` compara los dos planes en cada
corrida, y además impone un techo de **5 KB** a la respuesta. Si algún día los ids la pasaran,
da rojo antes de que nadie lo note en la factura de datos del estudiante.

**2 · «Lo dibujado manda» se extiende al avance.** Esta ADR ya decía que si el resumen contara
61 y la página dibujara 60, mandaría lo dibujado. Con memoria aparece la otra mitad del mismo
descuadre: si una pregunta **respondida** es de las que el resumen cuenta y el extremo descarta,
el índice diría 12 respuestas y las barras 11.

La regla es la misma. **Mientras un módulo está abierto, su fila del índice cuenta el avance
sobre las preguntas dibujadas**, no sobre los ids del resumen, y `avisarSiElResumenNoCuadra()`
deja dicho en la consola que hubo descuadre —ahora dos veces: por la cantidad y por el avance—.
Las dos mitades de la pantalla no pueden decir cosas distintas, y menos sobre lo que el
estudiante cree llevar hecho.

**3 · Y en modo degradado, los ids salen de la instantánea.** `resumirLaInstantanea()` los
arma recorriendo la copia, que es la misma lista que ya recorría para contar. Pueden estar
desfasados respecto de la base, y se acepta a sabiendas: si la capa de datos no responde, el
módulo que se abra también sale de la copia, así que el índice y lo dibujado cuentan sobre lo
mismo. El desfase ya lo declara el aviso de ADR-008.

---

## ADR-034 · El avance del estudiante se guarda en su navegador, y nunca afirma lo que el banco ya no sostiene

**Fecha:** 2026-09-15 · **Estado:** aceptada · **Decide:** Felipe Cuevas

### Contexto

El banco tiene 368 preguntas. Nadie las responde de una sentada, y el público de `vision.md`
estudia «a deshora, en sesiones cortas e interrumpidas». Sin memoria, cada visita empieza de
cero y el banco grande —que es la mejor propiedad del sitio— se vuelve un obstáculo: cuanto más
crece, menos se avanza.

`vision.md` deja fuera las cuentas de usuario, así que no hay dónde guardar el avance salvo en
el propio navegador del estudiante.

Esta ADR tiene **dos partes**. La primera es la decisión de guardar, que es un cambio de
naturaleza del sitio comparable al de ADR-007: hasta hoy el sitio no recordaba nada de nadie.
La segunda es el formato, que hay que fijar porque lo guardado sobrevive a los despliegues.

---

### Parte 1 · La decisión de guardar

**Decisión.** El sitio guarda el avance del estudiante **en el almacenamiento local de su
navegador**, sin pedirle nada y sin identificarlo.

**Los límites, que son parte de la decisión:**

- **El avance nunca sale del dispositivo.** Ninguna petición al Worker lo lleva: la capa de
  datos sigue siendo de solo lectura y sigue sin saber quién pregunta (ADR-009). Se comprueba,
  no se promete: `scripts/probar-memoria.mjs` mira todas las peticiones de todas sus visitas y
  da rojo si alguna lleva cuerpo o si alguna respuesta guardada aparece en una ruta.
- **No hay cuentas, ni correo, ni inicio de sesión, ni cookies, ni analítica.** Nada de lo que
  `vision.md` pone fuera de alcance entra por esta puerta. Guardar en el navegador es
  precisamente lo que permite tener memoria **sin** tener cuentas.
- **No hay banner de consentimiento**, y no es un olvido. `vision.md` lo prohíbe expresamente, y
  aquí no hace falta: no se rastrea a nadie, no se comparte nada con terceros y lo guardado es
  lo que el propio estudiante acaba de responder, en su propio equipo. Lo que sí hay es una
  frase que lo dice, en el estado vacío, donde se lee sin buscarla.

**Motivo.** Es el único mecanismo que cumple las dos cosas a la vez: recordar el avance y no
identificar a nadie. Cualquier alternativa que sincronice entre dispositivos exige saber quién
es el estudiante, y eso contradice el principio de cero fricción que `vision.md` declara.

**Consecuencias, y se dicen en la página:**

- El avance **no se comparte entre dispositivos**. Quien responde en el computador no lo
  encuentra en el teléfono.
- **Se pierde al limpiar los datos del navegador**, y no hay copia en ninguna parte.
- **Si el navegador no permite guardar** —cookies bloqueadas, o el almacén lleno— el
  sitio sigue sirviendo: se elige módulo, se responde y se corrige igual. Lo único que se pierde
  es el recuerdo entre visitas, **y se avisa**. Es la misma regla de ADR-008: degradar sí, en
  silencio no.
- **Dos pestañas abiertas a la vez se pisan.** Gana la última que guarda. Se asume: el caso es
  raro y la alternativa —coordinar pestañas— cuesta más que lo que evita.

**Alternativa descartada · no guardar nada.** Es lo que había, y es lo que vuelve inútil un
banco de 368 preguntas para quien estudia en ratos sueltos.

**Alternativa descartada · guardar en el servidor.** Exige identificar al estudiante. Está
fuera de alcance por `vision.md` y ampliaría el papel del Worker, que ADR-009 acota.

---

### Parte 2 · El formato

**Decisión.** Una clave por módulo, con la versión del formato **dentro del dato**:

```
  clave:  examen-td-js.avance.modulo-3
  valor:  {"v":1,"modulo":3,"respuestas":{"53":"V8 Engine","54":"Bloquea todas las animaciones."}}
```

**Qué se guarda: el id de la pregunta y el texto de la alternativa elegida.**

- **El id de la pregunta sí sirve.** ADR-020: ninguna pregunta se borra, se retira. Su id es
  estable de por vida.
- **El id de la alternativa no sirve.** `banco:actualizar` borra las cuatro alternativas de la
  pregunta y las vuelve a insertar con ids nuevos, aunque lo corregido sea una coma del
  enunciado (`scripts/administrar-banco.mjs`). Anclar ahí dejaría huérfano todo lo respondido de
  esa pregunta a la primera corrección.
- **El texto es lo único que ningún reemplazo de filas puede falsear.** Es la lección de la
  iteración 25, que ancló la comprobación de la carga en el texto de la correcta y no en su
  letra ni en su posición.

**Y el veredicto NO se guarda.** Ni «acertó» ni «falló». Se recalcula contra el banco vigente
cada vez que se restaura. **Es la decisión central de esta ADR:** un veredicto guardado es una
afirmación que sobrevive a la corrección que la desmiente, y le enseñaría al estudiante una
regla falsa con la cara de quien sabe.

**Una clave por módulo, y no una sola con los siete dentro.** «Reiniciar el módulo» borra lo
suyo y no puede tocar los otros seis: con una clave por módulo eso es un borrado, y con una
clave única sería leer-modificar-escribir, que es justo donde dos pestañas se pisan. Y un dato
corrupto se lleva por delante un módulo en vez de los siete.

**Un dato que no se entiende se ignora, en silencio.** Versión desconocida, JSON roto, forma
inesperada: el módulo arranca vacío, la página no falla ni avisa, y la siguiente respuesta lo
reemplaza con el formato vigente. **No se avisa porque hoy no existe versión anterior que
perder** —esta es la primera— y porque un aviso sobre un formato interno no le dice nada a quien
está estudiando. El día que el formato cambie, la ADR que lo cambie decide si hay migración, y
esa decisión se toma sabiendo qué se estaría migrando.

**La versión va dentro del dato y no en el nombre de la clave** para que un dato viejo se pueda
**leer y reconocer** antes de decidir qué hacer con él. Con la versión en la clave, el sitio
nuevo no vería el dato viejo: lo dejaría ahí para siempre, ocupando sitio y sin que nadie
pudiera decidir nada sobre él.

### Lo que esta ADR le exige al banco

Que **ninguna pregunta tenga dos alternativas con el mismo texto**. Si las tuviera, no habría
forma de saber cuál eligió el estudiante, y se restauraría siempre la primera —con su veredicto
puesto—, que es la clase de mentira que esta ADR existe para evitar.

Hoy se cumple: 0 de 368. Pero pasa de ser una casualidad afortunada a ser una propiedad
vigilada, porque ahora algo depende de ella: `scripts/comprobar-instantanea.mjs` la comprueba en
cada `npm run verificar`, y se prueba rompiéndola con `--sabotaje=repetida`.

**No se convierte en restricción del esquema**, que sería lo más fuerte, porque exigiría una
migración contra las dos bases de la nube. Queda anotado: si alguna vez hay una migración por
otro motivo, este `UNIQUE (pregunta_id, texto)` se sube con ella.

### Consecuencias

- **El aviso de pérdida de avance de las iteraciones 31 y 32 se retira** (ver la actualización
  de ADR-032). Existía porque cambiar de módulo costaba lo respondido; con memoria ya no cuesta
  nada.
- **«Reiniciar el módulo» borra también lo guardado de ese módulo.** Es el único control de
  borrado que existe. Si solo limpiara la pantalla, el estudiante reiniciaría, recargaría y le
  volvería todo: un botón que miente.
- **No hay «borrar todo el avance».** Se borra módulo por módulo. La idea queda anotada en
  `registro_log.md` para evaluarla con el uso, no como pendiente.
- **Lo que el sitio puede afirmar sobre el avance queda acotado:** que está en este dispositivo
  y que el veredicto sale del banco de hoy. Nada más. En modo degradado sale de la instantánea,
  que puede estar desfasada, y eso ya lo declara el aviso de ADR-008.

### Actualización · 2026-09-15 · la sonda de escritura, el nombre de las claves, y el descuadre que se acepta

Tres puntos que la revisión de la iteración 33 dejó abiertos. Ninguno cambia la decisión ni el
formato: uno corrige el motivo escrito de un mecanismo que se conserva, otro fija una convención
para que la épica 40 no choque, y el tercero declara un límite en vez de dejarlo implícito.

**1 · La sonda de escritura se conserva, y su justificación se corrige.**

`static/js/servicios/memoria.js` no se conforma con encontrar `localStorage`: **escribe la clave
`examen-td-js.prueba-de-escritura` con un `'1'` y la borra en la línea siguiente**, una sola vez
por carga de la página y antes de que haya nada del estudiante en juego. No guarda ningún dato
suyo y no deja nada detrás.

**Qué detecta de verdad:** un almacén que **existe y se deja leer, pero no acepta escrituras**.
Son dos casos reales —el almacén **lleno**, que responde `QuotaExceededError`, y las
configuraciones que **deniegan el guardado a este origen** sin quitar el objeto de en medio,
como «Bloquear todas las cookies» en Safari— y ninguno de los dos se ve mirando si el objeto
está ahí. Sin la sonda, el sitio daría por bueno ese almacén, prometería memoria, y el
estudiante se enteraría al recargar: el fallo silencioso que esta ADR no admite. **Por eso se
conserva.**

**Qué NO detecta, y es lo que estaba mal escrito.** La ventana privada. Se documentaba como el
caso 3 —«Safari da cuota cero»— y eso dejó de ser cierto hace años: **desde Safari 11, WebKit
hace que el `localStorage` de las sesiones efímeras viva en memoria** (WebKit 157010), así que
en navegación privada —Safari, Chrome o Firefox— **se lee y se escribe con normalidad**; lo que
no hace es sobrevivir al cierre de la ventana. El comportamiento «deja leer y falla al
escribir» era de Safari 10. Para la sonda, una ventana privada de hoy **sí guarda**, y eso es
correcto: mientras esa ventana siga abierta, el avance se recuerda de verdad. La consecuencia
de más arriba —«si el navegador no permite guardar»— y el aviso de la página quedan corregidos
en consecuencia: las causas que nombran son el bloqueo de cookies y el almacén lleno, no la
navegación privada.

**2 · Los nombres de las claves llevan prefijo por funcionalidad: `examen-td-js.<funcionalidad>.`**

El origen es **uno solo para todo el sitio**: lo que escriba `simulacro.html` en la épica 40 va
a convivir en el mismo almacén que lo que escribe `cuestionario.html` hoy, y ninguna de las dos
páginas puede enumerar las claves de la otra para saber cuáles no pisar. La convención lo
resuelve sin coordinación:

```
  examen-td-js.avance.modulo-3          el avance del cuestionario (esta ADR)
  examen-td-js.prueba-de-escritura      la sonda; sin funcionalidad, es de toda la página
  examen-td-js.<funcionalidad>.<lo que sea>   lo que venga
```

El primer tramo es el sitio, porque el origen puede compartirse. El segundo es **la
funcionalidad, y es el que evita el choque**: el simulacro de la épica 40 guarda bajo el suyo
—`examen-td-js.simulacro.`— y no hay forma de que su estado colisione con el del cuestionario,
ni de que «reiniciar el módulo» le borre nada. La versión del formato **no entra en el nombre**:
sigue dentro del dato, por el motivo ya escrito más arriba.

**3 · Un descuadre que se acepta y se declara: el índice cuenta una respuesta corregida hasta
que se abre su módulo.**

Cuando el autor corrige el texto de una alternativa que un estudiante había elegido, esa
respuesta deja de coincidir y la pregunta vuelve a quedar sin responder —ya está escrito arriba
y se asume—. **Lo que se declara acá es cuándo se entera cada mitad de la pantalla.** El módulo
abierto se entera enseguida: dibuja sus preguntas con sus alternativas, no encuentra el texto
guardado y la pregunta queda en blanco. **El índice no.** Mientras ese módulo esté cerrado, su
fila sigue contando esa respuesta, y el conteo se corrige solo cuando el estudiante lo abre.

**Se acepta. No se agrega ningún mecanismo.** El índice cuenta cruzando lo guardado contra los
`preguntas_ids` del resumen (ADR-033), y **los ids son todo lo que el resumen trae**. Para
notar que un texto guardado ya no corresponde a ninguna alternativa vigente haría falta
comparar textos, y eso obligaría a que **el resumen trajera los textos de las alternativas de
las 368 preguntas: exactamente el peso que ADR-033 existe para no traer.** Pagar 371,8 KB en
cada apertura de la página para adelantar la corrección de un conteo que se corrige solo al
abrir el módulo es el peor cambio de los dos.

El error, además, es **acotado y a la baja**: dura lo que tarde el estudiante en abrir ese
módulo, afecta a las preguntas que el autor haya corregido, y **nunca afirma un veredicto
falso** —el veredicto no se guarda, se recalcula contra el banco vigente—. Es una cifra de
avance momentáneamente optimista, no una regla equivocada enseñada con cara de quien sabe, que
es lo que esta ADR existe para impedir. Sigue valiendo «lo dibujado manda» de ADR-033: en
cuanto el módulo se abre, mandan sus preguntas.

### Actualización · 2026-09-16 · memoria de la visita

La iteración 34 añade una segunda memoria al cuestionario. Esta actualización se escribe porque
esta ADR describía **una sola**, y a partir de hoy hay dos con promesas distintas. **La decisión
original no cambia y el formato `v: 1` tampoco**: lo que se guarda en el navegador se guarda
exactamente igual, con las mismas claves y los mismos campos.

**Qué se agrega: la memoria de la visita.** Además del almacén del navegador, la página mantiene
en memoria lo que el estudiante respondió **durante esta visita**. Vive desde que se carga la
página hasta que se recarga o se cierra, y **cambiar de módulo no la cierra**. No se escribe en
ninguna parte, no sobrevive a una recarga, y no se promete que lo haga.

**Para qué existe, que son tres cosas y ninguna es «por si acaso»:**

1. **El repaso funciona sin almacenamiento.** Con las cookies bloqueadas no hay nada guardado
   contra lo que cruzar, y el repaso —que es todo el punto de la iteración 34— se quedaría sin
   preguntas que ofrecer.
2. **N es exacto sin almacenamiento.** El botón «Repasar mis errores (N)» cuenta las falladas del
   módulo; sin esta memoria diría siempre cero en un navegador que no guarda.
3. **Distinguir «respondida en la visita» de «restaurada».** Lo guardado no sabe de visitas:
   «respondida hace un rato» y «respondida la semana pasada» son el mismo dato ahí dentro. La
   iteración 34 las dibuja distinto —la primera muestra su justificación desplegada y la segunda
   ofrece «Ver por qué»— y sin esta memoria la distinción se perdería en el primer repintado,
   porque `pintar()` reconstruye desde cero.

**Cómo se combinan las dos**, y está escrito en un solo archivo a propósito
(`static/js/servicios/memoria.js`):

- **`leerAvance()`** (`memoria.js:197-201`) lee primero lo guardado y **encima** lo de la visita.
  El orden no es indiferente: si el estudiante volvió a responder una pregunta hoy, la respuesta
  de hoy es la que vale. Sin almacenamiento, la de la visita es la única que hay.
- **`guardarRespuesta()`** (`memoria.js:281-286`) anota **primero** en la visita y después intenta
  el almacén. Devuelve si se pudo guardar, pero la visita queda anotada aunque devuelva `false`:
  son dos promesas distintas, y la del almacén puede negarse.
- **`borrarAvance()`** (`memoria.js:315-317`) borra **las dos**. Si dejara viva la de la visita,
  «Reiniciar el módulo» no borraría nada en un navegador sin almacenamiento, y con almacenamiento
  las respuestas volverían al primer repintado: el mismo botón que miente, por el otro lado.
- **`respondidasEnLaVisita()`** (`memoria.js:215-217`) devuelve solo los ids de esta visita, que es
  lo que el componente usa para elegir cómo dibujar cada pregunta.

**Lo que esto cambia para el estudiante sin almacenamiento.** Antes, con las cookies bloqueadas, lo
respondido vivía únicamente en la pantalla y cualquier repintado se lo llevaba: volver de otro
módulo bastaba para perderlo. **Ahora el sitio recuerda durante toda la visita**, se puede cambiar
de módulo y volver, y el repaso funciona. Lo que se pierde al recargar sigue perdiéndose, **y eso
es lo esperado, no un defecto**: es exactamente lo que el aviso de la página anuncia —«al recargar
la página el módulo va a empezar de cero»— y lo que la consecuencia de más arriba llamaba «el
recuerdo entre visitas».

**De dónde sale.** Es la decisión 7 de
[`_planmaestro/30-epica-cuestionario/iteracion-34-justificacion-y-repaso.md`](../30-epica-cuestionario/iteracion-34-justificacion-y-repaso.md),
tomada por el autor el 2026-09-16 tras la lectura de alcance: el código no conservaba lo respondido
fuera del almacén ni del DOM, y tres criterios de esa iteración dependían de que lo conservara.

**Lo que esta actualización no resuelve, y ya estaba asumido.** Dos pestañas abiertas se siguen
pisando, y ahora además de forma asimétrica: ver la limitación declarada en la iteración 34.

---

## ADR-035 · El intento del simulacro: el navegador elige, el extremo sirve por id, y lo elegido se congela

**Fecha:** 2026-09-18 · **Estado:** ✅ Aceptada · **Decide:** Felipe Cuevas

### Contexto

El simulacro necesita 120 preguntas de un banco de 368, repartidas parejo entre los
siete módulos, sin dos preguntas hermanas y sin repetir. Y necesita que el intento
sobreviva a una recarga en mitad de una hora de examen.

Esas dos cosas se podrían haber resuelto en el Worker: un extremo `/api/simulacro`
que eligiera y devolviera el intento armado, y una tabla en D1 con los intentos en
curso. **No se hizo, y esta ADR explica por qué**, junto con las cinco decisiones que
se derivan de ello. Todas las tomó el autor entre el 2026-09-16 y el 2026-09-18, y se
escriben juntas porque se sostienen unas a otras: quitar una deja a las demás sin
motivo.

---

### Parte 1 · El navegador elige; el extremo solo sirve

**Decisión.** El navegador parte de los `preguntas_ids` que ya entrega
`?resumen=1` (ADR-033), **elige ahí mismo** las 120 —reparto, exclusión de hermanas,
reservas y orden— y le pide al extremo únicamente **las preguntas de una lista de
ids**. El extremo no elige, no reparte, no excluye y no sabe qué es un simulacro.

**Motivo.** `vision.md:68-70` promete que el formato funciona íntegramente en el
navegador y que ningún servicio externo es condición para que funcione. Un extremo
que eligiera sería **la única parte del simulacro imposible de degradar**: con la
capa de datos caída no habría intento, justo en la página más larga y menos
interrumpible del sitio. Eligiendo en el navegador, el modo degradado de ADR-008 usa
**la misma función** sobre la instantánea, y no hay dos algoritmos que mantener al
día. `scripts/probar-filtrado.mjs` lo comprueba por sus imports: un solo archivo del
sitio importa `elegirIntento()` y la llama una vez.

**Motivo segundo.** ADR-009 acota el Worker a lectura. Elegir es una decisión de
producto —cuántas por módulo, qué preguntas no pueden salir juntas— y meterla en la
capa de datos la convertiría en algo que hay que desplegar para corregir una regla
del examen.

**Consecuencia.** El algoritmo vive en `static/js/servicios/eleccion-del-intento.js`,
recibe los ids por módulo, la lista de hermanas y **la fuente de azar**, y no importa
`servicios/datos.js`. Con el azar inyectado, la muestra de 200 intentos con la que se
comprueban el reparto, la exclusión y el solapamiento es repetible: un rojo que no se
puede volver a correr no se arregla, se discute.

---

### Parte 2 · La forma del extremo por ids, y los 100 parámetros de D1

**Decisión.** `/api/preguntas?ids=25,107,205,…`

- Máximo **120 ids**. Más, o una lista mal formada —vacía, con algo que no es número,
  con decimales, negativos, el cero, una coma de más, **ids repetidos**— o combinada
  con `?modulo` o `?resumen`, se rechaza con `PETICION_INVALIDA`.
- Los ids **inexistentes o retirados no vuelven**, y eso no es un error: es lo que
  las reservas del intento existen para tapar.
- No devuelve justificaciones. Son el campo más pesado del banco y durante el intento
  no se corrige; las pide la iteración 44 al llegar al resumen.
- Reutiliza `SQL_PREGUNTAS`, `sqlAlternativas()` y `validarPreguntas()` sin copiarlas,
  y sin romper a `generar-instantanea.mjs`, su único importador externo.

**El límite de D1, provocado antes de escribir el extremo.** **D1 acepta como máximo
100 parámetros ligados por consulta.** Se provocó el 2026-09-16 pidiendo 120: la
consulta falla. El extremo **trocea por dentro** —cuatro consultas de a 30 dentro de
un solo `batch`— y quien lo llama no se entera: sigue siendo una petición con 120
ids. Está medido y no supuesto porque el número no aparece en la documentación de D1
con ese nombre, y el día que cambie lo va a decir un rojo y no una sorpresa en
producción.

**Los ids repetidos se rechazan en vez de deduplicarse.** Deduplicar sería adivinar:
una lista con un id dos veces es un error de quien la arma, y devolver 119 preguntas
para 120 ids pedidos dejaría al navegador reponiendo una pregunta que sí existía.

---

### Parte 3 · Este extremo no se puede cachear nunca

**Decisión.** `/api/preguntas?ids=…` **no lleva caché de ningún tipo** —ni cabecera,
ni Cache API, ni caché de borde— y cuando la épica 50 introduzca caché para las otras
lecturas, esta queda explícitamente fuera.

**Motivo.** Los otros dos extremos tienen un espacio de respuestas diminuto y estable:
`?resumen=1` es una respuesta, `?modulo=N` son siete. Este tiene **un número
astronómico**: cada intento pide una combinación distinta de 120 ids entre 368, y dos
estudiantes no piden nunca la misma. Una caché sobre eso no acierta jamás —cada
petición es una entrada nueva— y a cambio llena el almacenamiento de entradas que no
se van a volver a leer. Es el peor caso posible para una caché: coste completo,
beneficio cero.

**Motivo segundo, y es el que importa.** Aunque acertara, no debe. Una respuesta
cacheada es una foto del banco en el momento en que se guardó, y el banco se corrige.
Un intento servido desde una caché de ayer traería preguntas que el autor ya arregló,
sin que nada lo dijera. El respaldo de ADR-008 también está desfasado, pero **lo
declara con un aviso en pantalla**; una caché de borde no tiene forma de declararlo.

**Consecuencia.** Queda anotado para la épica 50, que es la que introduce caché.

---

### Parte 4 · Lo que cuesta un intento, medido

Medido el 2026-09-17 contra la base local, que sí reporta `rows_read`:

| Petición | Filas leídas |
|---|---|
| `?resumen=1` | 1 111 |
| `?ids=` con 120 ids | 2 791 |
| **Total de un intento** | **3 902** |

Para comparar: traerse el banco entero son 4 783 filas y 371,8 KB. El resumen son 2,4
KB y el intento 120 preguntas.

**No es una cifra buena, y se dice.** La vista `pregunta_activa` entra por el índice
de estado y no por la clave primaria, así que pedir 120 preguntas por id lee bastante
más que 120 filas. **Se acepta a sabiendas y queda para la épica 50**, que es la que
mira el coste de la capa de datos. Lo que esta ADR fija es que el número **está
medido**: cualquier optimización futura tiene contra qué compararse.

---

### Parte 5 · Un intento no mezcla bancos (H-024)

**Decisión.** Las dos peticiones de un intento —el resumen y las preguntas— tienen
que salir del **mismo banco**. Si alguna mitad cae al respaldo de ADR-008, **el
intento entero se vuelve a elegir desde el respaldo**.

**Motivo.** `servicios/datos.js` hace que cada lectura caiga al respaldo por su
cuenta, y para el cuestionario está bien: una petición, una pantalla. Aquí son dos
peticiones **atadas** —de la primera salen los ids y la segunda los va a buscar— y se
podía llegar a que el resumen contestara desde D1 y las preguntas salieran de la
copia. Los ids se habrían elegido sobre un banco y pedido a otro.

**Provocado el 2026-09-17**, agregándole al resumen de D1 sesenta ids del módulo 5
que la instantánea no tiene —lo que verá el navegador el día que el banco crezca y la
copia se quede atrás— y tumbando `?ids=`: el intento gastó sus tres rondas de reserva
sobre ids del banco equivocado y terminó en «No se pudo armar el simulacro» con 118
de 120, **justo cuando el respaldo tenía que salvarlo**. Por el camino de las
reservas el resultado fue peor: el intento sí se armaba, con dos bancos adentro y sin
que nada lo dijera.

**Consecuencias.**

- La regla se atiende **apenas se detecta** y no al final: seguir sería gastar tres
  viajes más reponiendo sobre ids que ya se sabe que salieron del banco equivocado.
- Su reverso también vale: si el resumen ya vino de la copia, las preguntas se le
  piden a la copia y no a un servicio que acaba de no contestar.
- El algoritmo **sigue sin enterarse**: lo único que cambia es de dónde salen los ids
  que recibe.
- El aviso de ADR-008 sigue a la vista, y la transición sigue siendo una sola medida
  desde el clic.

---

### Parte 6 · Las preguntas del intento se guardan congeladas

**Decisión.** Al armarse el intento, las 120 preguntas se guardan en el navegador
**tal como llegaron**, con sus alternativas y con cuál era la correcta, bajo
`examen-td-js.simulacro.preguntas`. El intento se corrige contra esa copia, **no
contra el banco vigente**. Y la respuesta del estudiante apunta a esa copia por el
**id de la alternativa**.

**Esto se aparta de la decisión central de ADR-034**, y conviene decirlo con todas sus
letras. ADR-034 manda lo contrario para el cuestionario: no guardar el veredicto,
recalcularlo contra el banco de hoy, y **no anclar en el id de la alternativa** porque
`banco:actualizar` borra las cuatro y las reinserta con ids nuevos a la primera
corrección.

**Por qué aquí es al revés.** Lo que ADR-034 protege es que el sitio no le enseñe al
estudiante una regla que la corrección desmintió. En el cuestionario eso se consigue
recalculando, porque el cuestionario **es** una herramienta de aprendizaje y el
veredicto de ayer no vale nada. El simulacro **mide**: un intento de una hora que se
corrigiera contra el banco de mañana podría bajarle el resultado a alguien por una
corrección que ocurrió mientras respondía, y ninguna pantalla podría explicárselo. El
resultado tiene que ser el de lo que el estudiante vio.

Y una vez congelada la copia, **el id de la alternativa deja de ser frágil**: no
apunta a D1, apunta a un arreglo que vive en el navegador del estudiante y que ningún
`banco:actualizar` puede reescribir. Es exacto incluso si dos alternativas
compartieran texto, y pesa 3 104 bytes menos repartidos en las 120 reescrituras.

**Cómo se cubre lo que ADR-034 protegía.** Lo resuelve la iteración 44 por el otro
lado: al pedir las justificaciones al banco vigente, el resumen compara con la copia
congelada y, **si una pregunta cambió desde el intento, la revisión muestra la versión
corregida con un aviso** del tipo «Esta pregunta se corrigió después de tu intento».
El resultado no cambia —es el de lo que el estudiante vio— y nadie aprende una regla
que la corrección desmintió. Las dos mitades de ADR-034 se conservan, una en cada
sitio.

**El formato, en dos claves.**

```
  examen-td-js.simulacro.preguntas    la copia congelada. Se escribe UNA vez.
  examen-td-js.simulacro.respuestas   todo lo que cambia. Se reescribe en cada
                                      respuesta.
```

La versión va **dentro del dato** (`v: 1`), como en ADR-034 y por el mismo motivo. Las
dos claves llevan el mismo `intento_id`, y **si no coinciden se descarta el intento
entero**: son un solo intento repartido en dos, y media copia congelada con las
respuestas de otra es la peor lectura posible. Se descarta el intento entero y no
entrada por entrada —al revés que en el cuestionario— porque una entrada rota
desalinea las respuestas de las preguntas y con eso la posición pasa a mentir: un
intento de 119 no es un intento corto, es un intento roto.

**Por qué dos claves y no una, medido el 2026-09-18** sobre intentos reales del banco
de 368:

| | Bytes |
|---|---|
| `…preguntas` | 78 623 · **76,8 KiB**, escrita 1 vez |
| `…respuestas` vacía | 158 |
| `…respuestas` con las 120 | 12 996 · **12,7 KiB** |
| Un intento completo (121 escrituras) | **850,2 KiB** |
| Lo mismo con una sola clave | **10 056,4 KiB · 11,8 veces más** |

`localStorage` es síncrono y bloquea el hilo que dibuja. Con una sola clave, la
escritura número 120 costaría 91 556 bytes en vez de 12 996, y en un teléfono modesto
eso se siente en cada respuesta.

---

### Parte 7 · El resultado no se guarda

**Decisión del autor, 2026-09-18.** El intento **no guarda** las cuentas del
resultado —correctas, incorrectas, omitidas—. Se recalculan desde la copia congelada
y las respuestas cada vez que hagan falta.

**Motivo.** Es el argumento de ADR-034 aplicado a lo único donde todavía podía
colarse: **una segunda fuente de verdad para un número que ya se puede derivar**. Los
dos ingredientes están guardados; guardar además el resultado abre la posibilidad de
que un día discrepen, y entonces no habría forma de saber cuál de los dos manda.

**Consecuencia.** La iteración 44 conserva el resumen conservando **el intento
terminado** —sus preguntas, sus respuestas y su `terminado_en`—, no un número aparte.
El resumen se vuelve a calcular al dibujarlo, y da siempre lo mismo porque la copia
congelada no cambia.

---

### Parte 8 · Por qué aquí sí se coordinan las pestañas

**Decisión.** El simulacro **coordina dos pestañas**: la que abre último toma el
intento y la otra se bloquea con un aviso, con un vencimiento por tiempo para que
cerrar la dueña no deje a la otra bloqueada para siempre. Lo construye la iteración
42; lo que se fija aquí es **que se hace**, y bajo su propia clave —
`examen-td-js.simulacro.dueno`—, aparte de las dos del intento.

**Por qué es distinto del cuestionario.** ADR-034 aceptó expresamente que dos
pestañas del cuestionario se pisen: «gana la última que guarda… el caso es raro y la
alternativa cuesta más que lo que evita». Eso era cierto **ahí**, y por dos razones
que aquí no se cumplen:

1. **Lo que se pisa es distinto.** En el cuestionario, dos pestañas pisándose cuestan
   una respuesta suelta, recuperable respondiéndola otra vez. Aquí cuestan **el
   intento entero**: dos pestañas escribiendo `…respuestas` con posiciones distintas
   dejan un intento cuya posición no corresponde a sus respuestas, y eso no se
   recupera respondiendo de nuevo, porque en el simulacro **no se vuelve atrás**.
2. **El error es invisible hasta el final.** El cuestionario corrige al responder, así
   que una respuesta perdida se ve enseguida. El simulacro no corrige hasta el
   resumen: el estudiante descubriría el destrozo después de una hora.

**La clave del dueño va aparte de las dos del intento**, y es una decisión de forma
con dos motivos concretos: el arriendo se renueva cada pocos segundos y dentro de
`…respuestas` cada latido reescribiría 12,7 KiB; y la coordinación se apoya en el
evento `storage`, que dispara por clave, así que un oyente sobre una clave que también
cambia al responder no podría distinguir «la otra pestaña tomó el intento» de «la otra
pestaña respondió».

**Lo que esta parte no decide** es el mecanismo —vencimiento, renovación, qué pasa al
recuperar el intento— ni cómo se prueba. Es de la iteración 42, que necesita además un
reloj controlable.

---

### Actualización · 2026-09-18 · el mecanismo del arriendo, y las reglas del tiempo

*Escrita al abrir la iteración 42. Cierra lo que la Parte 8 dejó pendiente en su propio
texto —«el mecanismo —vencimiento, renovación, qué pasa al recuperar el intento— ni cómo se
prueba»— y recoge las cuatro reglas del tiempo que hasta hoy solo vivían en
`_planmaestro/40-epica-simulacro-examen/README.md` y en `registro_log.md`. **No sustituye
ninguna decisión anterior**: la Parte 8 sigue vigente entera, y esto es su continuación.*

---

#### El arriendo de la pestaña dueña

**Números del autor, 2026-09-18.** La clave es la que la Parte 8 reservó,
`examen-td-js.simulacro.dueno`, y guarda `{ v, pestana, visto_en }`.

| | |
|---|---|
| **Quién lo toma** | La pestaña que abre **último**, siempre y sin preguntar |
| **Renovación** | cada **5 segundos** |
| **Vencimiento** | **15 segundos** sin renovar, o sea tres renovaciones perdidas |
| **La bloqueada** | mira cada **5 segundos** si venció, y si venció lo toma |

**Por qué 15 y no 6.** El margen de tres latidos perdidos no es holgura por si acaso: un
navegador móvil estrangula los temporizadores de una pestaña incluso visible, y con un
vencimiento de un solo latido la pestaña dueña podría quitarse el intento **a sí misma** por
haberse dormido seis segundos. Lo que el vencimiento tiene que distinguir es «cerrada» de
«lenta», y 15 segundos lo distingue.

**Qué pasa al recuperar el intento.** La pestaña que estaba bloqueada y ve el arriendo
vencido **lo toma y vuelve a leer lo guardado**, no lo que tenía en memoria. Es importante:
mientras estuvo bloqueada, la otra pestaña siguió respondiendo, y el intento que hay en el
almacén ya no es el que esta pestaña recordaba. Retomar desde memoria le devolvería al
estudiante un intento viejo y le borraría lo que hizo en la otra pestaña, que es exactamente
el destrozo que toda la Parte 8 existe para impedir.

**Lo primero que hace la bloqueada es dejar de contar.** Antes de dibujar el aviso, apaga sus
cronómetros. Mientras sigan vivos, cada plazo que venza escribe una respuesta sobre el intento
que la **otra** pestaña está jugando. El aviso puede esperar un milisegundo; la escritura no.
Y **no borra nada**: lo que hay guardado es del intento de la otra.

**El almacén que se niega no bloquea a nadie.** Si no hay `localStorage`, o si escribir el
arriendo falla, esta pestaña se declara dueña y no coordina. Un navegador que no guarda no
tiene intento compartido que dos pestañas puedan estropear: cada una vive en su memoria y se
pierde al recargar, que es lo que el aviso de la iteración 41 ya dice. Bloquear ahí sería
quitarle el simulacro a alguien para proteger un dato que no existe.

---

#### Las cuatro reglas del tiempo

Las tomó el autor el 2026-09-16 y estaban escritas en el README de la épica 40 (reglas 2, 3, 4
y 9) y en `registro_log.md`. Se recogen aquí porque son decisiones de producto que el código
implementa, y un ADR es donde se busca el porqué seis meses después.

**1 · El sobrante se pierde.** Cada pregunta tiene 30 segundos y avanzar antes solo acorta el
intento. De ahí se sigue lo que la fila de `registro_log.md` de la iteración 42 ya corrigió el
2026-09-16: **no existe un cronómetro total de 60 minutos**. Con el sobrante perdido, 120
preguntas de 30 segundos no pueden agotarse antes que las preguntas, así que el total no es un
plazo sino **tiempo transcurrido**, y **«terminar por tiempo total» no existe como camino**.
Los 60 minutos son la duración máxima teórica, no un límite.

**2 · Al agotarse los 30 segundos.** Con una alternativa marcada, cuenta como respondida con
esa alternativa; sin ninguna, queda omitida. En los dos casos se avanza sola y no se vuelve
atrás.

**3 · El reloj sigue corriendo fuera de la página.** Salir, bloquear el teléfono o recargar no
lo detiene. Al volver, el tiempo mostrado es el real y **cada pregunta cuyo plazo venció
mientras tanto se resuelve con la regla 2, en orden y cada una con SU instante de
vencimiento**, no todas con el del regreso. Un intento que volviera con cuatro preguntas
resueltas en el mismo milisegundo estaría mintiendo sobre cuándo ocurrieron.

**4 · El tiempo se calcula desde instantes guardados.** «Ahora menos el instante guardado»,
nunca sumando pulsos de un temporizador. Un temporizador en pestaña oculta se atrasa, y un
cronómetro que contara pulsos se quedaría corto justo en el caso que la regla 3 describe. El
temporizador del simulacro existe **solo para repintar**: si se atrasa, la pantalla se refresca
tarde y el número que escribe cuando por fin corre sigue siendo el correcto.

---

#### Cómo se prueba, que es la otra mitad que la Parte 8 dejó abierta

**Con un reloj inyectable, y sin tocar el `Date.now()` del proceso.** El simulacro pide la hora
a `static/js/servicios/reloj.js`, un asiento de módulo del mismo patrón que
`almacenDelNavegador()` en `servicios/memoria.js` (decisión del autor, 2026-09-18). En el
navegador ese asiento devuelve el reloj de verdad; un guion lo cambia por uno de mentira y
juega un intento de una hora en milisegundos.

**`components/transicion-de-carga.js` queda fuera del asiento, y es deliberado.** Su piso de
400 ms existe para que el estudiante no vea un parpadeo, y eso se mide contra el reloj del
mundo. Los bloques `8f-2` (iteración 35) y `10f` (iteración 41) de
`scripts/probar-filtrado.mjs` lo cronometran con `Date.now()` real y una holgura de 700 ms;
colgarlo de un reloj que otra prueba adelanta los dejaría pasando en verde sin medir nada.

**Dos verbos, porque son dos casos distintos.** `avanzar(ms)` deja vencer los temporizadores a
su hora; `saltar(ms)` mueve el reloj **sin vencer ninguno**, que es lo que hace el navegador
con una pestaña oculta. Solo el segundo distingue un cronómetro que resta instantes de uno que
cuenta pulsos: el que cuenta pulsos sobrevive a `avanzar()` y se queda corto con `saltar()`.

**Y dos pestañas de mentira que se ven por `storage`**, con la regla que es fácil equivocar
escrita donde se implementa: **el evento nunca llega a quien escribió**. Si llegara a las dos,
una pestaña reaccionaría a la renovación de su propio arriendo y se bloquearía sola, y una
implementación con ese defecto pasaría la prueba en verde.

**Corre en `npm run verificar`,** como noveno comprobador
(`scripts/probar-cronometros.mjs`), porque no necesita servidor: arma el intento escribiéndolo
en el almacén de mentira y lo retoma, que es el mismo camino de una recarga. `probar:filtrado`
y `probar:memoria` siguen fuera, que es donde la épica 40 los dejó, y por la razón de siempre:
esos sí piden `datos:dev`.

---

### Lo que esta ADR no puede afirmar

- **Que un intento no se pueda inspeccionar.** Las respuestas correctas viajan al
  navegador y están en el repositorio público (ADR-022). Congelarlas en el
  almacenamiento local no cambia nada: ya estaban a la vista.
- **Que un intento sobreviva a borrar los datos del navegador**, o a cambiar de
  dispositivo. Es la misma consecuencia que ADR-034 ya declara para el avance.
- **Que dos intentos seguidos no repitan preguntas.** No hay historial: cada intento
  se elige sin saber del anterior.

---

### Actualización · 2026-09-21 · el extremo por ids sirve también las justificaciones, si se le piden

*Decisión del autor, tomada al preparar la iteración 44.* Esta ADR dice que `?ids=` **no devuelve justificaciones** —son
el campo más pesado del banco y durante el intento no se corrige— y que las pide la 44 al llegar al resumen. **Lo que no
decía es cómo**, y con la regla de más arriba no había forma: combinar `?ids=` con cualquier otro parámetro se rechaza
con `PETICION_INVALIDA`.

**Se amplía, sin cambiar lo que ya existe:**

- `/api/preguntas?ids=…&con=justificacion` devuelve **lo mismo que `?ids=…`** más la justificación de cada pregunta.
- `con` solo acepta el valor `justificacion`, y solo junto a `ids`. Cualquier otro valor, `con` sin `ids`, o `con` junto a
  `modulo` o `resumen`, sigue siendo `PETICION_INVALIDA`. Es la **única** combinación nueva que se permite.
- `?ids=…` a secas **sigue sin justificaciones**, así que el intento pesa lo mismo al empezar: el motivo original de esta
  ADR queda en pie.
- Los límites de `ids` no cambian: 120 como máximo, troceados por dentro por los 100 parámetros ligados de D1.

**Por qué una petición y no dos.** El resumen necesita dos cosas del banco vigente: la justificación, y la versión actual
de cada pregunta para compararla con la copia congelada (la actualización de más arriba, «Cómo se cubre lo que ADR-034
protegía»). `?ids=` ya trae la segunda; sumarle la primera con un parámetro deja todo en **una sola petición, un solo
extremo y una sola validación**. Un extremo aparte habría obligado a dos peticiones por resumen y a una forma nueva de
pedir mal que validar desde cero.

**Se construye en la etapa A de la iteración 44**, con su prueba antes que su código.