# Iteración 36 · Orientación del estudiante en la portada

**Épica:** 30 · Cuestionario
**Estado:** ⚪ No iniciada
**Orden de trabajo:** se ejecuta **después de la 33 y antes de la 34** (decisión del
autor, 2026-09-15). No depende del código de la 33, la 34 ni la 35.

## Objetivo

Que `index.html` y la barra de navegación orienten a un estudiante que **no da por
supuestas las convenciones de la web**, que la portada deje de publicar una cifra
falsa, y que el texto secundario del sitio se pueda leer.

## Por qué existe esta iteración

Los arreglos que la componen parecen inconexos —un enlace, una animación, un número,
un texto junto a un bloque de código, un color— pero comparten una raíz:

**El sitio asume capacidades que su público no tiene.** `vision.md` describe a
estudiantes **principiantes**, para quienes esta puede ser su primera certificación
técnica, que estudian desde el teléfono tanto como desde el computador y que leen poco
y en diagonal. Que un logotipo lleve al inicio, que una flecha signifique «esto se
despliega», o que un bloque de código sea algo más que decoración, son convenciones
aprendidas: quien no las tiene, no las deduce. Y un texto gris tenue que se lee en un
monitor calibrado desaparece en un teléfono al sol con el brillo bajo.

**Y hay un defecto de implementación publicado hoy:** la portada dice que hay **21**
preguntas de práctica. Son 368 (`index.html:115`, `data-count="21"`, escrito a mano).

## Historial de este archivo

- **2026-09-15 · incorporada al repositorio.** Se redactó en otra sesión como
  «iteración 34» y el archivo nunca llegó al repositorio. Al incorporarla se ajustó el
  perfil del público a lo que dice `vision.md`, el contexto del examen se movió a
  `_planmaestro/00_producto/contexto-del-examen.md`, se reformuló un criterio no
  comprobable y se corrigieron las referencias a la 35. Decisiones 1 a 4 del autor.
- **2026-09-15 · ampliada tras el cierre de la 33.** El cierre midió `mutedink` en
  2,72:1 y 3,02:1. El autor decidió corregirlo aquí (decisión 5) y resolvió el
  disparador del efecto del logotipo (decisión 6).
- **2026-09-15 · revisada tras la lectura de alcance de Claude Code.** Confirmó las ocho
  afirmaciones de hecho y encontró quince huecos. Los más importantes: `mutedink` tiene
  **28 usos**, no dos, y el peor contraste real es **2,53:1**; la inyección al construir
  rompía la propiedad de ADR-010 de que el repositorio sea por sí solo una copia
  servible, y dependía de un ajuste del panel de Cloudflare que ningún archivo fija; el
  aviso de licencia no llegaba al sitio publicado. El autor tomó cuatro decisiones: **la
  decisión 4 se sustituye** por la 4 bis, y se agregan la 5 bis, la 7 y la 8. Los demás
  huecos se resolvieron en la redacción de los criterios.
- **2026-09-15 · corrección tras la implementación.** La cifra de la portada escribía
  cualquier número que le entregara la instantánea, también el del banco de juguete. Se
  agregó la protección del sello «nube» a la decisión 4 bis. La implementación de las
  decisiones 1 a 8 ya está commiteada (`ce8f606`).
- **2026-09-15 · rediseño del aviso de programación, por decisión del autor.** El aviso
  implementado —una tarjeta oscura titulada «Código de ejemplo · así se responde una
  parte del examen»— no destacaba sobre una página oscura. El autor definió su diseño
  (decisión 9) y eligió un ícono con animación infinita como excepción explícita a las
  decisiones 6 y 8 (decisión 10). Aportó además dos datos testimoniales nuevos: en los
  siete módulos el examen pide programar **o revisar código y señalar el error**, y el
  lenguaje de cada módulo.
- **2026-09-15 · ajustes tras implementar el aviso.** El autor ajustó el párrafo del
  aviso para incluir la revisión de código (decisión 9), pidió que el ícono acompañe el
  alto del titular y el subtítulo (decisión 11) y que vuelva un rótulo sobre los bloques
  de código, con un texto nuevo (decisión 12). Se excluye `alert-loop.svg` del generador
  de íconos, que había producido una clase CSS muerta.

## Alcance

**Dentro:**

- la barra de navegación de `index.html` y `cuestionario.html`;
- la portada;
- **el color `mutedink` en todo el sitio**: su definición y la revisión de sus 28 usos,
  en las dos páginas y en los componentes que dibujan HTML (`cuestionario.js`,
  `indice-modulos.js`, `modules.js`, `roadmap.js`);
- **los énfasis que hoy dependen de la diferencia entre `mutedink` y `muted`** (decisión
  5 bis);
- la comprobación de la cifra de preguntas dentro de `npm run verificar`, y su escritura
  desde el guion que regenera la instantánea (decisión 4 bis);
- **el rediseño del aviso de programación** en las tarjetas de módulo (decisiones 9 y
  10), con el ícono `static/resources/alert-loop.svg`;
- **la actualización de `_planmaestro/00_producto/contexto-del-examen.md`** con los dos
  datos testimoniales nuevos.

**Fuera:** todo lo demás de `cuestionario.html`. La transición al cargar un módulo es la
35. `acerca-de.html` no es de esta iteración. **El color `muted` no se toca.** Cualquier
    otro color que no alcance el contraste se registra, no se corrige.

## Decisiones tomadas

### 1 · Se adelanta a la 34

La cifra falsa está publicada y la corrección no depende de la memoria, la
justificación ni el repaso. Se prefirió ejecutarla antes a renumerar por segunda vez en
un día.

### 2 · El efecto del logotipo se copia de animate.css

El efecto `tada` se escribe en `tailwind.config.cjs`, en su `extend`. **No se instala
ninguna dependencia:** se copian las líneas del efecto, no el paquete. Se toman de la
versión 4.1.1 publicada en cdnjs.

**El aviso de licencia va junto a las líneas copiadas**, en un comentario de
`tailwind.config.cjs`, y cita la **Hippocratic License 2.1** del archivo LICENSE vigente
del repositorio de animate.css. **Deja anotado además** que el encabezado del archivo
CSS 4.1.1 declara MIT: las dos fuentes no coinciden, y se cita la más exigente.

### 3 · El efecto del logotipo es solo de escritorio, y se declara

El logotipo del hero lleva `hidden lg:block`. **El estudiante que abre la portada desde
el teléfono no ve ni el logotipo ni su efecto**, y esta iteración no lo cambia.

### ~~4 · La cifra se inyecta al construir~~ · sustituida por la 4 bis

Se conserva tachada para que se entienda el cambio. Tenía tres problemas que encontró
la lectura de alcance: el archivo fuente quedaba con un marcador, rompiendo la
propiedad de ADR-010 de que el repositorio sea por sí solo una copia servible del
sitio; su garantía dependía de que el panel de Cloudflare siguiera ejecutando
`npm run build`, algo que ningún archivo del repositorio puede fijar
(`_planmaestro/90-manual/capa-de-datos-y-base-d1.md:54`); y provocar su falla podía
dejar `dist/` vacío, porque `scripts/build-dist.mjs` lo borra al empezar.

### 4 bis · La cifra real vive escrita en `index.html`, y `npm run verificar` la vigila

Decidido por el autor el 2026-09-15.

- **`index.html` versionado dice la cifra real.** Hoy, 368.
- **`npm run verificar` falla si esa cifra no coincide con la instantánea versionada.**
- **El guion que regenera la instantánea después de cada carga del banco también
  reescribe esa cifra**, en el mismo acto, para que la actualización no dependa de
  acordarse.

Conserva lo esencial de la decisión anterior —la cifra sale de la instantánea y no de
quien la escribe— y resuelve sus tres problemas: el repositorio sigue siendo servible,
no importa qué comando corra el panel porque la cifra ya viene en el archivo, y
provocar la falla es seguro. **No repite el defecto del 21:** ese número duró porque
nada lo vigilaba. Ahora una cifra desfasada deja la verificación en rojo antes de
publicar.

**Solo se escribe desde una instantánea con sello «nube»**, y `comprobar-cifra` da rojo
si el sello no lo es, aunque la cifra coincida. Es la protección de ADR-023 extendida a
la portada: una instantánea local es el banco de juguete, y su cifra no puede llegar a
la portada. Agregado el 2026-09-15 tras la implementación.

### 5 · `mutedink` se corrige en su definición, hasta 4,5:1 sobre todos sus fondos

**Se corrige una sola vez, donde se define el color** (`tailwind.config.cjs:18`),
hasta alcanzar **al menos 4,5:1 sobre cada fondo donde se usa como texto**, incluidos
los dos peores medidos: **`bg-panel2`** (hoy 2,53:1) y **la fila activa del índice**,
`bg-jsyellow/10` sobre negro (hoy 2,61:1). La lectura de alcance estimó que hace falta
llegar cerca de `#8A8876`.

**El nombre de la clase no cambia en ningún uso.** Renombrarla o reemplazarla por otra
rompería `scripts/probar-memoria.mjs:424`, que la busca por su nombre literal.

**El motivo del autor:** el público estudia desde el teléfono, a menudo con luz exterior
y brillo bajo, que es justo cuando un contraste bajo se vuelve ilegible.

### 5 bis · `muted` no se toca; los énfasis se hacen con peso de letra o con el color principal

Decidido por el autor el 2026-09-15. Con `mutedink` cerca de `#8A8876`, queda a un paso
de `muted` (`#9C9A85`, 6,65:1). Donde hoy un tramo se destaca **solo** por pasar de
`mutedink` a `muted` —el caso conocido es «solo en este dispositivo» en el estado vacío
del cuestionario—, **el énfasis pasa a expresarse con peso de letra o con el color de
texto principal**.

Se descartó subir también `muted`: ya cumple con holgura, se usa en todo el sitio, y
moverlo cambiaría la identidad visual entera para arreglar un énfasis. Expresar el
énfasis con peso de letra además funciona sin color, la misma regla que se aplicó al
índice en la 32.

### 6 · El efecto del logotipo ocurre una sola vez, al cargar la portada

Con un breve retraso para que la vista alcance a llegar, y **sin repetirse**. Convive con
`animate-floaty`, que sigue igual.

**Descartadas:** al pasar el ratón —el logotipo no es un enlace y casi nadie lo haría a
propósito—; cada cierto tiempo —un movimiento que se repite compite con la lectura—; y
las dos a la vez.

### 7 · El sitio publicado queda sin atribución visible de animate.css hasta que exista `acerca-de.html`

Decidido por el autor el 2026-09-15. El comentario de la decisión 2 no llega al sitio
publicado: `tailwind.config.cjs` no se copia a `dist/` y sus comentarios no sobreviven a
la compilación. **Se acepta ese período sin atribución visible, y se declara.** La fila
de `acerca-de.html` en `registro_log.md` tiene que decir que, hasta que la página exista,
el sitio publicado usa el efecto sin atribución visible.

### 8 · Las tarjetas se mueven una sola vez; lo que se lee siempre son las palabras

Decidido por el autor el 2026-09-15, con la misma regla de la decisión 6. **El texto que
dice que la tarjeta se despliega está siempre visible** mientras está cerrada, y el
movimiento que atrae la vista **ocurre una sola vez**, cuando la tarjeta aparece en
pantalla. Siete tarjetas latiendo a la vez serían exactamente lo que la decisión 6
descartó.

### 9 · El aviso de programación, con el diseño que definió el autor

Decidido por el autor el 2026-09-15. **Sustituye** al aviso implementado, que era una
tarjeta oscura con el titular «Código de ejemplo · así se responde una parte del
examen». Sobre una página oscura no destacaba, y un aviso que el estudiante no ve no
cumple su función.

**Fondo amarillo** (`jsyellow`), para que la tarjeta sea lo primero que se vea al abrir
un módulo.

**Titular**, en un tamaño claramente mayor que el actual:

> En el examen real deberás programar

acompañado del ícono `static/resources/alert-loop.svg` (decisión 10).

**Subtítulo**, distinto en cada módulo:

> En el Módulo N te tocará programar en L

| Módulo | Lenguaje (L) |
|---|---|
| 2 | HTML5 y CSS3 |
| 3 | JavaScript |
| 4 | JavaScript |
| 5 | SQL |
| 6 | Node.js con Express |
| 7 | Node.js con SQL |
| 8 | Node.js con Express |

Confirmado por el autor el 2026-09-15, a partir del testimonio de sus estudiantes: el
examen pide programar en **los siete módulos**. El lenguaje es **un dato de cada
módulo**, no un texto escrito siete veces: el número y el lenguaje del subtítulo salen
de ahí.

**La nota testimonial se conserva** con su texto de `ce8f606`. **El párrafo se ajustó**
por decisión del autor, con el dato de que el examen también pide revisar código y
señalar el error. Texto aprobado:

> En el examen, ejercicios como estos se responden escribiendo el código en un cuadro de
> texto vacío, o revisando código y señalando el error: **sin autocompletado, sin
> marcado de errores y sin poder ejecutarlo**. Practícalos escribiéndolos de memoria, no
> solo leyéndolos.

**La tarjeta respira:** su separación con el título que viene después es claramente
mayor que la actual, para que se lea como una advertencia aparte y no como parte del
contenido que sigue.

**Consecuencias que se resuelven en la implementación:**

- **Todo el texto de la tarjeta pasa a tonos oscuros**, con al menos 4,5:1 sobre el
  amarillo. Los grises actuales, `mutedink` incluido, y el blanco del énfasis serían
  ilegibles sobre ese fondo. El énfasis se sigue expresando con peso de letra.
- **El ícono se carga como imagen**, así que no hereda el color del CSS: su trazo
  (`currentColor`) queda en negro. Sobre amarillo es lo que conviene. Nadie debe intentar
  colorearlo desde el CSS.
- **El ícono es decorativo** (`alt=""`): el titular ya dice lo que significa.
- **La repetición en siete tarjetas** es ahora más visible. La mitiga que el subtítulo
  cambie en cada una: con «Abrir todos» se leen siete advertencias distintas, no siete
  copias.

### 10 · El ícono del aviso anima para siempre: única excepción al movimiento de una vez

Decidido por el autor el 2026-09-15. El SVG trae dos animaciones propias: **un dibujo
inicial** —el triángulo se traza y aparece el signo de exclamación—, que ocurre una vez,
y **un pulso en el signo de exclamación que se repite indefinidamente**. El autor decidió
usarlo **tal cual**, como la única excepción a la regla de las decisiones 6 y 8.

**El archivo no se modifica.** Se usa el que dejó el autor, con su comentario de
licencia (Material Line Icons, de Vjacheslav Trushkin) dentro.

**Consecuencias aceptadas y declaradas:**

- **Es la única animación del sitio que no respeta `prefers-reduced-motion`.** Está
  escrita dentro del SVG (SMIL), y la regla de `src/input.css` es CSS: no la alcanza. Un
  estudiante que pidió a su sistema menos movimiento seguirá viendo el pulso.
- **No es la única animación infinita del sitio:** `animate-floaty` del logotipo también
  lo es. Sí es la única que no se detiene con movimiento reducido.
- **No ofrece forma de detenerlo.** Un movimiento que empieza solo, dura más de cinco
  segundos y convive con otro contenido pide, según WCAG 2.2.2 (nivel A), un mecanismo
  para pausarlo. Este no lo tiene.
- **El dibujo inicial puede ocurrir sin que nadie lo vea:** si la imagen se carga con la
  tarjeta cerrada, al abrirla el triángulo ya estará dibujado. El pulso sí se verá.

### 11 · El ícono del aviso acompaña el alto del titular y el subtítulo, salvo en teléfono

Decidido por el autor el 2026-09-15. **En pantallas anchas, el ícono tiene el mismo alto
que el bloque del titular y el subtítulo juntos**, a su izquierda. **En teléfono conserva
un tamaño fijo**, parecido al de escritorio, y no crece cuando el titular se parte en
varias líneas: un ícono que crece con el texto le quita ancho al titular, que es lo que
hay que leer.

### 12 · Vuelve un rótulo sobre los bloques de código

Decidido por el autor el 2026-09-15. El rediseño de la decisión 9 dejó los bloques de
código sin nada que dijera qué son. Se agrega un rótulo **entre el aviso y el primer
bloque**, con el mismo estilo que «Temas evaluados». **No reemplaza al aviso: se suma.**
Su texto es el que figure en la implementación, elegido por el autor al enviar el prompt.

**Origen de esos ejercicios, según el autor:** los transcribió una estudiante que rindió
el examen, al terminarlo, para ayudar a quienes venían después, y otros estudiantes que
también lo rindieron los corroboraron. Se registra en `contexto-del-examen.md`, sin
nombres.

### Sobre «Inicio» junto al logotipo, frente a ADR-032

ADR-032 quitó el `<select>` del cuestionario porque dos controles **visibles y
equivalentes** a tres centímetros son uno de más. Aquí la situación es otra: el enlace
del logotipo **no se reconoce como enlace** para este público, así que no hay dos
controles visibles, hay uno escondido. «Inicio» es la forma visible. En `index.html`
lleva al comienzo de la propia portada; en `cuestionario.html`, a la portada.

## Lo que queda a criterio de quien implemente

Los textos exactos, los íconos, el valor del retraso del efecto, el tono concreto de
`mutedink`, cómo se detecta que una tarjeta aparece en pantalla, y dónde vive la
comprobación de la cifra dentro de `npm run verificar`, el tono oscuro del texto sobre
amarillo, el tamaño del titular, la separación exacta de la tarjeta y dónde vive el dato
del lenguaje de cada módulo. Con las condiciones de las decisiones de arriba.

## Contexto que condiciona la tarea de los bloques de código

Está en `_planmaestro/00_producto/contexto-del-examen.md`. Una parte del examen consiste
en **resolver enunciados programando** en un área de texto sin autocompletado, sin
marcado de errores y sin ejecutar. Los bloques de «Código de ejemplo» de la portada
**tienen ese formato**. Según el testimonio recogido el 2026-09-15, en los siete módulos
el examen pide programar **o revisar código y señalar el error**, y cada módulo tiene su
lenguaje (tabla de la decisión 9). Ese contexto es **testimonio de estudiantes**, no
información de Talento Digital, y lo que diga la portada tiene que declararlo.

## Tareas

- [ ] Añadir «Inicio» a la barra de las dos páginas, conservando el enlace del logotipo y
  del título.
- [ ] Copiar el efecto `tada` con su aviso de licencia (decisión 2), una vez al cargar
  (decisión 6).
- [ ] Escribir la cifra real en `index.html`, agregar su comprobación a
  `npm run verificar` y hacer que el guion que regenera la instantánea la reescriba
  (decisión 4 bis).
- [ ] Hacer evidente que las tarjetas de «Qué entra en cada módulo» se despliegan
  (decisión 8).
- [ ] Marcar los bloques de código como formato real de una parte del examen, declarando
  el origen testimonial. *(Implementado en `ce8f606` con el diseño anterior.)*
- [ ] Rediseñar el aviso de programación con el diseño del autor (decisión 9) y el ícono
  sin modificar (decisión 10).
- [ ] Agregar a `contexto-del-examen.md` los dos datos testimoniales del 2026-09-15.
- [ ] Sumar el ícono de line-md a la fila de atribuciones pendientes de `acerca-de.html`
  en `registro_log.md`.
- [ ] Ajustar el tamaño del ícono (decisión 11).
- [ ] Agregar el rótulo sobre los bloques de código (decisión 12) y registrar el origen de
  los ejercicios en `contexto-del-examen.md`.
- [ ] Excluir `alert-loop.svg` del generador de íconos.
- [ ] Registrar para la épica 50 que el build no verifica los recursos referenciados
  desde JavaScript.
- [ ] Corregir `mutedink` en su definición y revisar sus 28 usos (decisión 5).
- [ ] Rehacer los énfasis que dependían de la diferencia entre `mutedink` y `muted`
  (decisión 5 bis).
- [ ] Anotar el origen de las otras tres métricas y si pueden desfasarse.
- [ ] Actualizar la fila de `acerca-de.html` en `registro_log.md` (decisión 7).
- [ ] Corregir el comentario de `scripts/verificar-todo.mjs:2`, que dice «cuatro
  comprobadores» y son cinco.

## Criterios de aceptación

### Los provoca Claude Code

**Navegación y efecto**

- [ ] **«Inicio» está en la barra de las dos páginas**, sobre `dist/`: en `index.html`
  lleva al comienzo de la portada, en `cuestionario.html` lleva a la portada.
- [ ] **El logotipo y el título conservan su enlace** en las dos páginas.
- [ ] **No se instaló ninguna dependencia.** Diff de `package.json` y
  `package-lock.json` sin paquetes nuevos.
- [ ] **Las líneas copiadas llevan su aviso**: origen (animate.css 4.1.1), copyright,
  Hippocratic License 2.1, y la nota de que el encabezado del CSS 4.1.1 declara MIT.
- [ ] **El efecto del logotipo declara una sola iteración** en la utilidad nueva del CSS
  generado. La evidencia sale de la declaración de esa utilidad, no de la regla
  general de `prefers-reduced-motion`, que ya fuerza una iteración para todo.
- [ ] **El movimiento de las tarjetas también declara una sola iteración**, con la misma
  evidencia.

**La cifra**

- [ ] **`index.html` versionado dice 368**, y `dist/index.html` también.
- [ ] **`npm run verificar` da rojo si la cifra no coincide con la instantánea.**
  Provocado de forma segura —sin dejar modificado ningún archivo versionado al
  terminar—, con el mensaje exacto del rojo.
- [ ] **El guion que regenera la instantánea reescribe la cifra.** Demostrado **sin
  ejecutarlo contra los archivos versionados** —sobre copias temporales o con su
  propia opción de ensayo—, porque regenerar la instantánea desde aquí está vedado.
- [ ] **Al terminar, `static/js/data/instantanea-banco.js` no tiene cambios**, y el diff
  de `index.html` contiene solo lo que esta iteración pretende.

**Contraste**

- [ ] **Tabla de los 28 usos de `mutedink`**: archivo y línea, elemento, fondo, razón
  antes y después. **Todo uso como texto alcanza al menos 4,5:1.**
- [ ] **El punto de 8 × 8 px de `index.html:146`**, que no es texto, se mide contra 3:1
  (componente no textual) y lo alcanza.
- [ ] **La cabecera pegajosa** (`cuestionario.js:381`), cuyo fondo es semitransparente
  con desenfoque, se mide sobre su fondo liso, y la tabla declara esa limitación.
- [ ] **La clase `text-mutedink` sigue con el mismo nombre** en todos sus usos.
- [ ] **Ningún énfasis depende ya solo de la diferencia entre `mutedink` y `muted`.** Se
  listan los casos encontrados y cómo quedó cada uno.
- [ ] **`muted` no cambió.** Diff de `tailwind.config.cjs` limitado a `mutedink` y al
  efecto nuevo.

**Aviso de programación**

- [ ] **Las siete tarjetas muestran el titular y su subtítulo exacto**, comprobado sobre
  el HTML dibujado: «En el examen real deberás programar» y «En el Módulo N te tocará
  programar en L», con los siete pares de la tabla de la decisión 9, sin un solo
  carácter distinto.
- [ ] **Número y lenguaje salen del dato de cada módulo.** Provocado: se cambia el
  lenguaje de un módulo en una copia en memoria y el subtítulo dibujado cambia con él.
- [ ] **La nota testimonial conserva su texto de `ce8f606`, y el párrafo dice exactamente
  el texto aprobado** de la decisión 9.
- [ ] **Cada texto de la tarjeta alcanza al menos 4,5:1 sobre `jsyellow`**: tabla con
  elemento, color, fondo y razón.
- [ ] **`static/resources/alert-loop.svg` no fue modificado por la implementación**:
  trae su comentario de licencia y sus animaciones tal como lo dejó el autor.
- [ ] **El ícono es decorativo** (`alt=""`) en las siete tarjetas.
- [ ] **La separación inferior de la tarjeta aumentó**: se informa en píxeles antes y
  después.
- [ ] **En pantallas anchas, el alto del ícono coincide con el del bloque del titular y el
  subtítulo**, con los píxeles de los dos. **En teléfono, el ícono no crece** cuando el
  titular se parte: se informa su tamaño en los dos anchos.
- [ ] **El rótulo aparece en las siete tarjetas**, entre el aviso y el primer bloque, con
  el mismo estilo que «Temas evaluados», y su texto exacto.
- [ ] **`static/css/icons.css` ya no trae `.i-alert-loop`**, y el generador explica en un
  comentario por qué excluye ese archivo.

**Movimiento reducido y verificación**

- [ ] **Las animaciones nuevas quedan cubiertas por la regla de `prefers-reduced-motion`**
  de `src/input.css`, comprobado en el CSS generado. **Excepción declarada:** el ícono
  del aviso (decisión 10), cuyas animaciones viven dentro del SVG.
- [ ] **Las otras tres métricas tienen origen anotado** en las notas: «7 módulos» y
  «JWT» salen de `static/js/data/modules.js`, escritos a mano; «2 formatos» sale del
  contexto del examen, testimonial. Se dice cuáles pueden desfasarse.
- [ ] **`npm run verificar` termina en 0** con sus cinco comprobaciones y la nueva.
- [ ] **`probar:filtrado`, `probar:memoria` y `probar:escapado` siguen en verde.**

### Los comprueba el autor en el navegador

- [ ] **Desde `cuestionario.html`, «Inicio» lleva a la portada**, en escritorio y en
  teléfono.
- [ ] **El efecto del logotipo se nota en escritorio**, ocurre una vez al cargar y no se
  repite.
- [ ] **Una tarjeta cerrada dice con palabras que se despliega**, se mueve una sola vez
  al aparecer, y se entiende también en teléfono.
- [ ] **Al abrir una tarjeta, el aviso amarillo es lo primero que llama la atención**, en
  escritorio y en teléfono.
- [ ] **El titular se lee claramente más grande que antes**, con el ícono a la vista y
  pulsando.
- [ ] **Hay espacio suficiente entre la tarjeta y el título que la sigue.**
- [ ] **En escala de grises, la tarjeta sigue destacando** sobre la página y su texto se
  lee.
- [ ] **El subtítulo de cada módulo corresponde a su lenguaje**, revisado en al menos dos
  tarjetas.
- [ ] **La nota del origen testimonial sigue visible y legible** sobre el amarillo.
- [ ] **El ícono se ve del alto del titular y el subtítulo en escritorio**, y en teléfono
  no aplasta el titular.
- [ ] **El rótulo deja claro qué son los bloques de código.**
- [ ] **Con «Abrir todos», la página sigue siendo usable** pese a los siete avisos amarillos
  y las siete notas testimoniales iguales. Se anota la impresión.
- [ ] **El texto que usaba `mutedink` se lee bien en las dos páginas** y el sitio conserva
  su identidad visual.
- [ ] **Las dos filas del índice de módulos se leen**, la inactiva y la activa, que es el
  peor fondo del sitio.
- [ ] **«Solo en este dispositivo» sigue destacado** en el estado vacío del cuestionario.
- [ ] **La portada se ve bien en teléfono** con todo lo añadido.
- [ ] **Con `prefers-reduced-motion` emulado, no se percibe movimiento** en las
  animaciones nuevas, **salvo el ícono del aviso**, que sigue animando por decisión
  (decisión 10).
- [ ] **Sin errores de consola** en las dos páginas.
- [ ] **Tras el push, la portada publicada dice 368.**

## Lo que esta iteración no puede afirmar

- **Que el estudiante entienda mejor el examen.** Lo dirá el uso.
- **Que el efecto del logotipo llegue al teléfono.** No llega (decisión 3).
- **Que la cifra coincida con D1 en todo momento.** Dice lo que dice la instantánea, que
  entre una recarga del banco y su commit puede ir detrás.
- **Que el formato del examen descrito sea el oficial.** Es testimonio de estudiantes.
- **Que el sitio publicado atribuya animate.css.** No lo hace hasta que exista
  `acerca-de.html` (decisión 7).
- **Que el sitio entero cumpla WCAG AA.** Se corrige un color medido; los demás no se
  auditan aquí.
- **Que el ícono del aviso respete `prefers-reduced-motion` o cumpla WCAG 2.2.2.** No lo
  hace, por decisión (decisión 10).
- **Que el lenguaje indicado por módulo sea exacto.** Es testimonio de estudiantes.

## Notas de la iteración

_Pendiente._