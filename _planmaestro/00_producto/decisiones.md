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
