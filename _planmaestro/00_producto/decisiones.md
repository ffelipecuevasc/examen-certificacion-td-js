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
