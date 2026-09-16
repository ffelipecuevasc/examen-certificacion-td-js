# Iteración 36 · Orientación del estudiante en la portada

**Épica:** 30 · Cuestionario
**Estado:** 🟢 Completada · 2026-09-15
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

**Su texto, elegido por el autor el 2026-09-15:**

> Código de ejercicios que podrían salir en tu examen

**«Podrían» y no «salen», a propósito.** Estos ejercicios son fieles a los que cayeron en el
examen de 2026, pero no son una promesa de lo que caerá en el próximo, y el sitio no puede
afirmar lo que no sabe. El condicional es la diferencia entre orientar y prometer.

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

- [x] Añadir «Inicio» a la barra de las dos páginas, conservando el enlace del logotipo y
  del título.
- [x] Copiar el efecto `tada` con su aviso de licencia (decisión 2), una vez al cargar
  (decisión 6).
- [x] Escribir la cifra real en `index.html`, agregar su comprobación a
  `npm run verificar` y hacer que el guion que regenera la instantánea la reescriba
  (decisión 4 bis).
- [x] Hacer evidente que las tarjetas de «Qué entra en cada módulo» se despliegan
  (decisión 8).
- [x] ~~Marcar los bloques de código como formato real de una parte del examen, declarando
  el origen testimonial.~~ **Sustituida.** Se implementó en `ce8f606` con el diseño anterior
  —una tarjeta oscura titulada «Código de ejemplo · así se responde una parte del examen»— y
  ese diseño **ya no existe**: las decisiones 9 a 12 lo reemplazaron entero. Lo que hoy cumple
  su propósito es el aviso amarillo más el rótulo de la decisión 12, no lo que esta tarea
  describía. Se marca por eso, no porque el diseño viejo siga en pie.
- [x] Rediseñar el aviso de programación con el diseño del autor (decisión 9) y el ícono
  sin modificar (decisión 10).
- [x] Agregar a `contexto-del-examen.md` los dos datos testimoniales del 2026-09-15.
- [x] Sumar el ícono de line-md a la fila de atribuciones pendientes de `acerca-de.html`
  en `registro_log.md`.
- [x] Ajustar el tamaño del ícono (decisión 11).
- [x] Agregar el rótulo sobre los bloques de código (decisión 12) y registrar el origen de
  los ejercicios en `contexto-del-examen.md`.
- [x] Excluir `alert-loop.svg` del generador de íconos.
- [x] Registrar para la épica 50 que el build no verifica los recursos referenciados
  desde JavaScript.
- [x] Corregir `mutedink` en su definición y revisar sus 28 usos (decisión 5).
- [x] Rehacer los énfasis que dependían de la diferencia entre `mutedink` y `muted`
  (decisión 5 bis).
- [x] Anotar el origen de las otras tres métricas y si pueden desfasarse.
- [x] Actualizar la fila de `acerca-de.html` en `registro_log.md` (decisión 7).
- [x] Corregir el comentario de `scripts/verificar-todo.mjs:2`, que dice «cuatro
  comprobadores» y son cinco.

## Criterios de aceptación

### Los provoca Claude Code

**Navegación y efecto**

- [x] **«Inicio» está en la barra de las dos páginas**, sobre `dist/`: en `index.html`
  lleva al comienzo de la portada, en `cuestionario.html` lleva a la portada.
- [x] **El logotipo y el título conservan su enlace** en las dos páginas.
- [x] **No se instaló ninguna dependencia.** Diff de `package.json` y
  `package-lock.json` sin paquetes nuevos.
- [x] **Las líneas copiadas llevan su aviso**: origen (animate.css 4.1.1), copyright,
  Hippocratic License 2.1, y la nota de que el encabezado del CSS 4.1.1 declara MIT.
- [x] **El efecto del logotipo declara una sola iteración** en la utilidad nueva del CSS
  generado. La evidencia sale de la declaración de esa utilidad, no de la regla
  general de `prefers-reduced-motion`, que ya fuerza una iteración para todo.
- [x] **El movimiento de las tarjetas también declara una sola iteración**, con la misma
  evidencia.

**La cifra**

- [x] **`index.html` versionado dice 368**, y `dist/index.html` también.
- [x] **`npm run verificar` da rojo si la cifra no coincide con la instantánea.**
  Provocado de forma segura —sin dejar modificado ningún archivo versionado al
  terminar—, con el mensaje exacto del rojo.
- [x] **El guion que regenera la instantánea reescribe la cifra.** Demostrado **sin
  ejecutarlo contra los archivos versionados** —sobre copias temporales o con su
  propia opción de ensayo—, porque regenerar la instantánea desde aquí está vedado.
- [x] **Al terminar, `static/js/data/instantanea-banco.js` no tiene cambios**, y el diff
  de `index.html` contiene solo lo que esta iteración pretende.

**Contraste**

- [x] **Tabla de los 28 usos de `mutedink`**: archivo y línea, elemento, fondo, razón
  antes y después. **Todo uso como texto alcanza al menos 4,5:1.**
- [x] **El punto de 8 × 8 px de `index.html:146`**, que no es texto, se mide contra 3:1
  (componente no textual) y lo alcanza.
- [x] **La cabecera pegajosa** (`cuestionario.js:381`), cuyo fondo es semitransparente
  con desenfoque, se mide sobre su fondo liso, y la tabla declara esa limitación.
- [x] **La clase `text-mutedink` sigue con el mismo nombre** en todos sus usos.
- [x] **Ningún énfasis depende ya solo de la diferencia entre `mutedink` y `muted`.** Se
  listan los casos encontrados y cómo quedó cada uno.
- [x] **`muted` no cambió.** Diff de `tailwind.config.cjs` limitado a `mutedink` y al
  efecto nuevo.

**Aviso de programación**

- [x] **Las siete tarjetas muestran el titular y su subtítulo exacto**, comprobado sobre
  el HTML dibujado: «En el examen real deberás programar» y «En el Módulo N te tocará
  programar en L», con los siete pares de la tabla de la decisión 9, sin un solo
  carácter distinto.
- [x] **Número y lenguaje salen del dato de cada módulo.** Provocado: se cambia el
  lenguaje de un módulo en una copia en memoria y el subtítulo dibujado cambia con él.
- [x] **La nota testimonial conserva su texto de `ce8f606`, y el párrafo dice exactamente
  el texto aprobado** de la decisión 9.
- [x] **Cada texto de la tarjeta alcanza al menos 4,5:1 sobre `jsyellow`**: tabla con
  elemento, color, fondo y razón.
- [x] **`static/resources/alert-loop.svg` no fue modificado por la implementación**:
  trae su comentario de licencia y sus animaciones tal como lo dejó el autor.
- [x] **El ícono es decorativo** (`alt=""`) en las siete tarjetas.
- [x] **La separación inferior de la tarjeta aumentó**: se informa en píxeles antes y
  después.
- [x] **En pantallas anchas, el alto del ícono coincide con el del bloque del titular y el
  subtítulo**, con los píxeles de los dos. **En teléfono, el ícono no crece** cuando el
  titular se parte: se informa su tamaño en los dos anchos.
- [x] **El rótulo aparece en las siete tarjetas**, entre el aviso y el primer bloque, con
  el mismo estilo que «Temas evaluados», y su texto exacto.
- [x] **`static/css/icons.css` ya no trae `.i-alert-loop`**, y el generador explica en un
  comentario por qué excluye ese archivo.

**Movimiento reducido y verificación**

- [x] **Las animaciones nuevas quedan cubiertas por la regla de `prefers-reduced-motion`**
  de `src/input.css`, comprobado en el CSS generado. **Excepción declarada:** el ícono
  del aviso (decisión 10), cuyas animaciones viven dentro del SVG.
- [x] **Las otras tres métricas tienen origen anotado** en las notas: «7 módulos» y
  «JWT» salen de `static/js/data/modules.js`, escritos a mano; «2 formatos» sale del
  contexto del examen, testimonial. Se dice cuáles pueden desfasarse.
- [x] **`npm run verificar` termina en 0** con sus cinco comprobaciones y la nueva.
- [x] **`probar:filtrado`, `probar:memoria` y `probar:escapado` siguen en verde.**

### Los comprueba el autor en el navegador

- [x] **Desde `cuestionario.html`, «Inicio» lleva a la portada**, en escritorio y en
  teléfono.
- [x] **El efecto del logotipo se nota en escritorio**, ocurre una vez al cargar y no se
  repite.
- [x] **Una tarjeta cerrada dice con palabras que se despliega**, se mueve una sola vez
  al aparecer, y se entiende también en teléfono.
- [x] **Al abrir una tarjeta, el aviso amarillo es lo primero que llama la atención**, en
  escritorio y en teléfono.
- [x] **El titular se lee claramente más grande que antes**, con el ícono a la vista y
  pulsando.
- [x] **Hay espacio suficiente entre la tarjeta y el título que la sigue.**
- [x] **En escala de grises, la tarjeta sigue destacando** sobre la página y su texto se
  lee.
- [x] **El subtítulo de cada módulo corresponde a su lenguaje**, revisado en al menos dos
  tarjetas.
- [x] **La nota del origen testimonial sigue visible y legible** sobre el amarillo.
- [x] **El ícono se ve del alto del titular y el subtítulo en escritorio**, y en teléfono
  no aplasta el titular.
- [x] **El rótulo deja claro qué son los bloques de código.**
- [x] **Con «Abrir todos», la página sigue siendo usable** pese a los siete avisos amarillos
  y las siete notas testimoniales iguales. Se anota la impresión.
- [x] **El texto que usaba `mutedink` se lee bien en las dos páginas** y el sitio conserva
  su identidad visual.
- [x] **Las dos filas del índice de módulos se leen**, la inactiva y la activa, que es el
  peor fondo del sitio.
- [x] **«Solo en este dispositivo» sigue destacado** en el estado vacío del cuestionario.
- [x] **La portada se ve bien en teléfono** con todo lo añadido.
- [x] **Con `prefers-reduced-motion` emulado, no se percibe movimiento** en las
  animaciones nuevas, **salvo el ícono del aviso**, que sigue animando por decisión
  (decisión 10).
- [x] **Sin errores de consola** en las dos páginas.
- [x] **Tras el push, la portada publicada dice 368.**

## Verificación

Cada criterio con su evidencia y quién la produjo. Lo que se puede provocar desde un guion lo
provocó Claude Code sobre el HTML que dibuja `renderModules()` contra el DOM falso del proyecto, o
calculando sobre el CSS compilado; lo que solo existe en un navegador lo comprobó el autor el
**2026-09-15**, en local con `npm run datos:dev` y en producción tras el push, recorriendo los 20
pasos de la lista de verificación.

**Los 49 criterios se reparten así: 24 los cerró el guion o el cálculo, 19 el autor en el
navegador, y 6 los dos.** 24 + 19 + 6 = 49. Las 17 tareas van aparte y no entran en esa cuenta.
La columna «Quién» usa tres valores y nada más, que es la lección que dejó el cierre de la 32.

**Ninguna observación del autor tiene captura, y es deliberado:** su confirmación es la evidencia,
y así queda escrita. Se dice en cada celda que le corresponde.

**De la decisión 4 original no quedó ningún criterio que marcar.** Al sustituirla por la 4 bis se
retiraron también sus criterios —el de inyectar la cifra al construir y el de mostrar qué comando
construye lo que publica Cloudflare—, así que no hay ninguna casilla huérfana de aquella decisión.
Lo único que sobrevive de ella es su encabezado tachado, a propósito, para que se entienda el
cambio.

### Navegación y efecto

| Criterio | Evidencia | Quién |
|---|---|---|
| «Inicio» está en la barra de las dos páginas, sobre `dist/` | `dist/index.html:38` y `:53` con `href="#inicio"`; `dist/cuestionario.html:35` y `:50` con `href="index.html"`. En escritorio y en el menú móvil de las dos | Claude Code · guion |
| El logotipo y el título conservan su enlace | `dist/index.html:27` → `#inicio`; `dist/cuestionario.html:27` → `index.html`. El enlace se sumó, no se reemplazó | Claude Code · guion |
| No se instaló ninguna dependencia | `package-lock.json` sin cambios (`git diff --quiet`, código 0). El diff de `package.json` son cuatro líneas, todas guiones propios. `devDependencies` sigue en `tailwindcss` y `wrangler` | Claude Code · guion |
| Las líneas copiadas llevan su aviso | `tailwind.config.cjs:34-59`: origen (animate.css 4.1.1 en cdnjs, con URL), copyright «Animate.css Copyright 2021 Daniel Eden», Hippocratic License 2.1 con enlace al LICENSE, y la nota de que el encabezado del CSS 4.1.1 declara MIT, explicando que se cita la más exigente | Claude Code · guion |
| El efecto del logotipo declara una sola iteración | En el CSS generado: `.animate-tada{animation:tada 1s ease-in-out 1}`. El `1` sale de la utilidad (`tailwind.config.cjs:98`), no de la regla de movimiento reducido. Comparación: `.animate-floaty{…infinite}` | Claude Code · guion |
| El movimiento de las tarjetas también declara una sola iteración | `.animate-asomar{animation:asomar 1.1s ease-in-out 1}`, misma evidencia | Claude Code · guion |

### La cifra

| Criterio | Evidencia | Quién |
|---|---|---|
| `index.html` versionado dice 368, y `dist/index.html` también | Las dos cifras marcadas con `data-cifra-banco` en los dos archivos: `data-count="368"` y `<span data-cifra-banco>368</span>` | Claude Code · guion |
| `npm run verificar` da rojo si la cifra no coincide | **Provocado** poniendo `index.html` en 299 dentro de una trampa de reposición: `cifra FALLO CIFRA FALSA: index.html anuncia un numero de preguntas que no es el del banco`, y el detalle `index.html:154 (forma «atributo») dice 299 y la instantanea trae 368`. Repuesto en el `trap EXIT` y comprobado. Más tres sabotajes en memoria que no tocan ningún archivo: `desfasada`, `sin-marca`, `discrepan`, los tres cazados | Claude Code · guion |
| El guion que regenera la instantánea reescribe la cifra | Demostrado **sobre copias temporales**, nunca contra lo versionado: con una instantánea de juguete de 12 preguntas, `linea 154 (atributo): 368 -> 12` y `linea 214 (texto): 368 -> 12`, mientras el `index.html` versionado siguió en 368. Los puntos de llamada reales son `publicar-banco.mjs:558` y `generar-instantanea.mjs:591`, que no se ejecutaron porque regenerar la instantánea desde aquí está vedado | Claude Code · guion |
| Al terminar, `static/js/data/instantanea-banco.js` no tiene cambios | `git diff --quiet` devuelve 0 y el archivo no aparece en `git status`, en las cuatro entregas de la iteración. El diff de `index.html` son cinco bloques: «Inicio» ×2, el envoltorio del logotipo, el comentario de origen de las métricas y las dos cifras | Claude Code · guion |

### Contraste

| Criterio | Evidencia | Quién |
|---|---|---|
| Tabla de los 28 usos de `mutedink` | 28 usos y 29 mediciones —`indice-modulos.js:200` se dibuja sobre dos fondos—, con archivo, línea, elemento, fondo y razón antes y después. **Todos sobre 4,5:1**; el peor real pasó de **2,53:1** a **5,18:1** (`bg-panel2`). La tabla completa está en las notas | Claude Code · cálculo |
| El punto de 8 × 8 px se mide contra 3:1 y lo alcanza | `index.html:185`, `bg-mutedink` sobre `bg-panel`: **2,72 → 5,57:1**, contra el umbral de 3:1 de WCAG 1.4.11 para componentes no textuales. Antes no alcanzaba ni ese umbral más laxo | Claude Code · cálculo |
| La cabecera pegajosa se mide sobre su fondo liso, y se declara la limitación | `cuestionario.js:381`, `bg-ink/95` con `backdrop-blur` compuesto sobre `bg-panel` = `#010100`: **3,00 → 6,15:1**. La limitación queda declarada en la tabla: el fondo real no existe como color único porque debajo pasa el contenido al desplazar, y lo medido es el caso liso | Claude Code · cálculo |
| La clase `text-mutedink` sigue con el mismo nombre | Los 28 usos conservan la clase; no se renombró ninguno. La prueba indirecta es que `probar:memoria` sigue verde: `probar-memoria.mjs:424` localiza las filas del índice por ese nombre literal y siguió leyendo «2/61» y «2/49» | Claude Code · guion |
| Ningún énfasis depende ya solo de la diferencia entre `mutedink` y `muted` | Se buscaron los dos colores conviviendo en el mismo texto en las dos páginas y en los cuatro componentes que dibujan HTML. **Hay exactamente uno**, el previsto: `cuestionario.js:534`, «solo en este dispositivo», que pasó de `<strong class="text-muted">` a `<strong class="font-semibold text-paper">`. Paso 16 de la pasada: sigue destacado. **Confirmado por el autor, sin captura** | los dos |
| `muted` no cambió | El diff de `tailwind.config.cjs` son dos hunks y nada más: la línea de `mutedink` (`-'#5C5A4A'` / `+'#8E8C7A'`) y el bloque del efecto nuevo. `.text-muted{color:rgb(156 154 133)}` = `#9C9A85`, igual que antes | Claude Code · guion |

### Aviso de programación

| Criterio | Evidencia | Quién |
|---|---|---|
| Las siete tarjetas muestran el titular y su subtítulo exacto | Sobre el HTML dibujado: «En el examen real deberás programar» ×7, y los siete pares de la tabla de la decisión 9 —2 HTML5 y CSS3, 3 JavaScript, 4 JavaScript, 5 SQL, 6 Node.js con Express, 7 Node.js con SQL, 8 Node.js con Express— sin un carácter distinto | Claude Code · guion |
| Número y lenguaje salen del dato de cada módulo | **Provocado**: se cambió `lenguaje` del módulo 7 en una copia en memoria y el subtítulo dibujado pasó a «…programar en COBOL sobre pergamino», el viejo desapareció y los otros seis no se movieron. `grep "te tocará programar"` devuelve **una sola** aparición en todo el repositorio, y es la plantilla | Claude Code · guion |
| La nota testimonial conserva su texto de `ce8f606`, y el párrafo dice el texto aprobado | La nota, comparada con `git show ce8f606`, es idéntica carácter a carácter. El párrafo dice el texto aprobado de la decisión 9, con «o revisando código y señalando el error» y el énfasis en negrita sobre «sin autocompletado, sin marcado de errores y sin poder ejecutarlo» | Claude Code · guion |
| Cada texto de la tarjeta alcanza al menos 4,5:1 sobre `jsyellow` | Titular y subtítulo `text-ink` **15,53:1**; párrafo `text-panel2` **13,01:1**; énfasis `text-ink` **15,53:1**; nota `text-panel3` **11,81:1**. Comprobado además sobre el HTML dibujado que ningún gris claro se coló dentro del aviso (0 de `text-paper`, `text-muted`, `text-mutedink`). Pasos 12 y 10 de la pasada: la nota se lee sobre el amarillo, y en escala de grises la tarjeta sigue destacando. **Confirmado por el autor, sin captura** | los dos |
| `alert-loop.svg` no fue modificado | `git diff --quiet` devuelve 0 y no aparece en `git status`. Conserva su comentario `Icon from Material Line Icons by Vjacheslav Trushkin` y sus tres `<animate>`, con los dos `repeatCount="indefinite"`. Llega a `dist/` idéntico (`diff -q` sin diferencias) | Claude Code · guion |
| El ícono es decorativo en las siete tarjetas | `<img src="static/resources/alert-loop.svg" alt="">` ×7 sobre el HTML dibujado, y ninguna con `alt` con texto | Claude Code · guion |
| La separación inferior de la tarjeta aumentó | De **8 px** (`mb-2`, `.mb-2{margin-bottom:.5rem}`) a **40 px** (`mb-10`, `.mb-10{margin-bottom:2.5rem}`). Lo que sigue no lleva margen superior (`modules.js:148`), así que los 40 px son la separación real, sin colapso. Paso 13 de la pasada: hay espacio suficiente. **Confirmado por el autor, sin captura** | los dos |
| En pantallas anchas el alto del ícono coincide con el del bloque; en teléfono no crece | **Calculado sobre el CSS compilado, no medido en un navegador**, resolviendo la cascada por desplazamiento de byte (`.sm\:text-2xl` en 18632 gana a `.leading-snug` en 14746): bloque = 32 + 4 + 24 = **60 px**, e ícono = 60 px porque `self-stretch` + `sm:h-full` no llevan ninguna medida propia. En teléfono el ícono queda en **32 × 32 px** fijos (`w-8 h-8`) con 211 px de ancho para el texto. **El autor lo confirmó en el navegador**, en pantalla ancha (paso 6), a **375 px** (paso 7) y a **700 px de ancho** con los módulos de subtítulo largo, donde se ve proporcionado — la franja que el cálculo no podía cubrir. **Sin captura** | los dos |
| El rótulo aparece en las siete tarjetas, entre el aviso y el primer bloque | «Código de ejercicios que podrían salir en tu examen» ×7, con las mismas clases literales que «Temas evaluados» (14 párrafos con ese juego de clases: 7 y 7). El orden se comprobó por posición en cada módulo: aviso < rótulo < primer bloque, en los siete | Claude Code · guion |
| `static/css/icons.css` ya no trae `.i-alert-loop` | De **41** reglas `.i-*` a **40**; `diff` de las dos listas ordenadas devuelve una sola línea, `< .i-alert-loop`. El generador lo dice en voz alta al correr —«1 excluido(s) por no ser iconos de mascara: alert-loop.svg»— y lo explica en `build-icons.mjs:21-48`: una máscara conserva solo el canal alfa, así que un SVG animado pierde sus animaciones y su color, y la clase resultante era una trampa | Claude Code · guion |

### Movimiento reducido y verificación

| Criterio | Evidencia | Quién |
|---|---|---|
| Las animaciones nuevas quedan cubiertas por `prefers-reduced-motion` | En el CSS generado, el selector universal las alcanza: `@media (prefers-reduced-motion:reduce){…*,:after,:before{animation-duration:.01ms!important;animation-iteration-count:1!important…}}`. Las dos empiezan y terminan en la posición de reposo, así que recortarlas equivale a no haberlas corrido. Paso 18 de la pasada: no se percibe movimiento, la píldora queda en su sitio y el logotipo derecho. **Excepción declarada y comprobada:** el ícono del aviso sigue latiendo, por la decisión 10. **Confirmado por el autor, sin captura** | los dos |
| Las otras tres métricas tienen origen anotado | La tabla está en las notas y, además, junto a las métricas mismas en `index.html:123-140`, que es donde se va a leer el día que una se desfase: «7 módulos» y «JWT» de `modules.js`, escritos a mano y desfasables; «2 formatos» del contexto del examen, testimonial | Claude Code · guion |
| `npm run verificar` termina en 0 con sus cinco comprobaciones y la nueva | **En el terminal del autor, tras el commit: `VERIFICADO`, código 0, las seis en OK** — barrera, css, instantanea, cifra, escapado, restricciones. **Confirmado por el autor, sin captura.** Acá dio código 1 en cada entrega, y siempre por lo mismo: `css FALLO DESFASADO`, que el propio comprobador distingue —«El CSS corresponde a su fuente, pero difiere de lo que hay commiteado»—. No es un desfase real: es que Claude Code no commitea | los dos |
| `probar:filtrado`, `probar:memoria` y `probar:escapado` siguen en verde | `FILTRADO CORRECTO`, `MEMORIA CORRECTA` y `ESCAPADO EN PIE`, los tres en código 0, en las cuatro entregas de la iteración | Claude Code · guion |

### Los comprueba el autor en el navegador

Los 19 los recorrió el autor el 2026-09-15 con `npm run datos:dev` en `http://127.0.0.1:8788`, y
el último en producción tras el push. **Los 20 pasos de la lista resultaron en «Debes ver».
Confirmado por el autor, sin capturas.**

| Criterio | Evidencia | Quién |
|---|---|---|
| Desde `cuestionario.html`, «Inicio» lleva a la portada, en escritorio y en teléfono | Paso 1: lleva a la portada desde arriba, y también desde el menú de tres rayitas. Sin captura | autor |
| El efecto del logotipo se nota en escritorio, ocurre una vez y no se repite | Paso 2: se agita a los ~0,7 s, sigue flotando después, y no vuelve a agitarse con la página abierta. Sin captura | autor |
| Una tarjeta cerrada dice con palabras que se despliega, se mueve una vez, y se entiende en teléfono | Paso 3: la píldora «Ver temas y código» legible sin tocar nada, y el saltito una sola vez al asomar. Sin captura | autor |
| Al abrir una tarjeta, el aviso amarillo es lo primero que llama la atención | Paso 4, en escritorio y en teléfono. Sin captura | autor |
| El titular se lee claramente más grande que antes, con el ícono a la vista y pulsando | Paso 5. Sin captura | autor |
| Hay espacio suficiente entre la tarjeta y el título que la sigue | Paso 13, los 40 px. Sin captura | autor |
| En escala de grises, la tarjeta sigue destacando y su texto se lee | Paso 10, con «Emulate vision deficiency: achromatopsia»: destaca por brillo, no por color. Sin captura | autor |
| El subtítulo de cada módulo corresponde a su lenguaje | Paso 11, revisado en más de dos tarjetas. Sin captura | autor |
| La nota del origen testimonial sigue visible y legible sobre el amarillo | Paso 12. Sin captura | autor |
| El ícono se ve del alto del titular y el subtítulo en escritorio, y en teléfono no aplasta el titular | Pasos 6 y 7, más la comprobación a **700 px de ancho** con los módulos de subtítulo largo, donde se ve proporcionado. Sin captura | autor |
| El rótulo deja claro qué son los bloques de código | Paso 8: se ve igual que «Temas evaluados» y va debajo del recuadro amarillo. Sin captura | autor |
| Con «Abrir todos», la página sigue siendo usable | Paso 9: **la página sigue siendo usable con los siete avisos amarillos y las siete notas testimoniales iguales.** Es la impresión que el criterio pedía anotar, y con ella queda cerrado el riesgo que las notas dejaron abierto. Sin captura | autor |
| El texto que usaba `mutedink` se lee bien en las dos páginas, y el sitio conserva su identidad | Paso 14, incluida la prueba con el brillo bajo. Sin captura | autor |
| Las dos filas del índice de módulos se leen, la inactiva y la activa | Paso 15: la fila activa sobre `bg-jsyellow/10`, que era el peor fondo del sitio con 2,61:1 y quedó en 5,34:1. Sin captura | autor |
| «Solo en este dispositivo» sigue destacado en el estado vacío | Paso 16: en negrita y más claro que el resto, ya sin depender del salto de color. Sin captura | autor |
| La portada se ve bien en teléfono con todo lo añadido | Paso 17, iPhone SE emulado: nada desbordado, métricas en dos columnas, el recuadro entero, el logotipo grande ausente por la decisión 3. Sin captura | autor |
| Con `prefers-reduced-motion` emulado, no se percibe movimiento, salvo el ícono del aviso | Paso 18: el logotipo no se agita ni flota, las tarjetas no saltan, nada queda corrido ni torcido; el ícono del aviso sigue latiendo, como manda la decisión 10. Sin captura | autor |
| Sin errores de consola en las dos páginas | Paso 19, en las dos páginas y tras elegir módulo y responder. Sin captura | autor |
| Tras el push, la portada publicada dice 368 | Paso 20, **en producción**: 368 en los dos lugares de la portada, más el aviso amarillo y el rótulo al abrir un módulo. Sin captura | autor |

### Las tareas

Las 17 tareas se reparten aparte de los criterios y no entran en las cifras de arriba: **9 las
cerró el guion y 8 los dos.** 9 + 8 = 17.

| Tarea | Evidencia | Quién |
|---|---|---|
| Añadir «Inicio» a la barra de las dos páginas | Sobre `dist/`, y paso 1 de la pasada | los dos |
| Copiar el efecto `tada` con su aviso de licencia, una vez al cargar | `tailwind.config.cjs:34-72` y `:98`; `nav.js:96-101` con 700 ms de retraso | Claude Code · guion |
| Escribir la cifra real, comprobarla en `verificar` y hacer que el guion la reescriba | `index.html:154` y `:214`; `comprobar-cifra.mjs` en `verificar-todo.mjs:113`; `cifra-portada.mjs` llamada desde `publicar-banco.mjs:558` y `generar-instantanea.mjs:591`. Paso 20 de la pasada, en producción | los dos |
| Hacer evidente que las tarjetas se despliegan | La píldora «Ver temas y código» siempre visible y `avisarQueSeDespliegan()` con `unobserve`; paso 3 de la pasada | los dos |
| ~~Marcar los bloques de código como formato real de una parte del examen~~ · **sustituida** | Se implementó en `ce8f606` con el diseño anterior, que las decisiones 9 a 12 reemplazaron entero. Su propósito lo cumplen hoy el aviso amarillo y el rótulo, no lo que la tarea describía | Claude Code · guion |
| Rediseñar el aviso con el diseño del autor y el ícono sin modificar | `modules.js:26-118`, `avisoDeProgramacion(m)`; pasos 4, 5, 10 y 12 de la pasada | los dos |
| Agregar a `contexto-del-examen.md` los dos datos testimoniales | Secciones fechadas del 2026-09-15: programar en los siete módulos —escribir **o** revisar y señalar el error— y la tabla de lenguajes | Claude Code · guion |
| Sumar el ícono de line-md a la fila de atribuciones pendientes | `registro_log.md`, fila de `acerca-de.html`: dos atribuciones, con la diferencia de que line-md sí viaja dentro del SVG publicado | Claude Code · guion |
| Ajustar el tamaño del ícono | `modules.js:74-76`, envoltorio `self-start sm:self-stretch` e imagen `w-8 h-8 sm:w-auto sm:h-full`; pasos 6 y 7 de la pasada, más los 700 px | los dos |
| Agregar el rótulo y registrar el origen de los ejercicios | `modules.js:120-125` y `:196`; `contexto-del-examen.md`, sección del origen; paso 8 de la pasada | los dos |
| Excluir `alert-loop.svg` del generador de íconos | `build-icons.mjs:21-48` y `:63-67`; de 41 reglas a 40 | Claude Code · guion |
| Registrar para la épica 50 que el build no verifica los recursos del JavaScript | `registro_log.md`, épica 50, iteración 52 | Claude Code · guion |
| Corregir `mutedink` en su definición y revisar sus 28 usos | `tailwind.config.cjs:18`, un solo cambio; la tabla de los 28 usos; pasos 14 y 15 de la pasada | los dos |
| Rehacer los énfasis que dependían de la diferencia con `muted` | `cuestionario.js:534`, el único caso encontrado; paso 16 de la pasada | los dos |
| Anotar el origen de las otras tres métricas | `index.html:123-140` y la tabla de las notas | Claude Code · guion |
| Actualizar la fila de `acerca-de.html` en `registro_log.md` | Dice que el efecto ya está en producción sin atribución visible, y por qué el comentario no llega al sitio | Claude Code · guion |
| Corregir el comentario de `verificar-todo.mjs:2` | Decía «cuatro comprobadores» cuando eran cinco; hoy dice **seis** en sus cuatro referencias (líneas 2, 48, 53 y 74), que es lo que el guion ejecuta de verdad | Claude Code · guion |

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

### Qué se construyó, decisión por decisión

**1 · Se adelantó a la 34.** La portada publicaba una cifra falsa, y eso está a la vista de
cualquiera que entre. Ninguna tarea de la 36 dependía del código de la 33, la 34 ni la 35, así que
adelantarla no costó nada; renumerar por segunda vez en el mismo día, sí.

**2 · El efecto `tada`, copiado y no instalado.** Las llaves están en `tailwind.config.cjs:60-72`,
tomadas de animate.css 4.1.1 en cdnjs, en solo lectura. `package-lock.json` no cambió. **Las dos
fuentes de la licencia no coinciden y se citó la más exigente:** el `LICENSE` vigente del
repositorio de animate.css dice **Hippocratic License 2.1** (Daniel Eden, 2021) y el encabezado del
propio archivo CSS 4.1.1 todavía declara **MIT**. El aviso cita la Hippocratic y deja anotada la
discrepancia, porque quien vaya a copiar esas líneas se va a topar con el banner MIT y hay que
decirle cuál manda.

**3 · Solo escritorio, y declarado.** `hidden lg:block` viajó al envoltorio nuevo del logotipo, así
que bajo `lg` no se muestra ni el logotipo ni su efecto. Quien abre la portada desde el teléfono no
ve ninguno de los dos, y esta iteración no lo cambió.

**4 bis · La cifra vive escrita y `verificar` la vigila.** Ver el apartado siguiente, que es donde
está lo que merece explicarse.

**5 · `mutedink`, corregido una sola vez.** `tailwind.config.cjs:18`, de `#5C5A4A` a `#8E8C7A`. Un
solo cambio para 28 usos. El nombre de la clase no se tocó en ninguno, porque
`probar-memoria.mjs:424` la busca por su nombre literal y renombrarla habría roto el guion que
comprueba la memoria, por un color.

**5 bis · El énfasis, rehecho con peso de letra.** Ver el apartado del contraste.

**6 · El logotipo saluda una vez, a los 700 ms.** Sin el retraso, el efecto ocurre mientras la
página todavía se pinta y la vista no ha llegado: se gasta el movimiento cuando nadie mira. Y
convive con `animate-floaty` porque están en **elementos distintos** — `animation` es una propiedad
sola, y dos clases de Tailwind sobre el mismo elemento no se suman, se pisan. De ahí el envoltorio
de `index.html:108-122`, que no es decorativo.

**7 · Sin atribución visible, a sabiendas.** Ver «Las excepciones y los límites aceptados».

**8 · Las tarjetas se mueven una vez, y lo que se lee siempre son las palabras.** La píldora «Ver
temas y código» está visible desde el primer momento **sin depender de que corra ningún
JavaScript**: si falla el guion o no hay `IntersectionObserver`, la tarjeta sigue diciendo con
palabras que se despliega. El movimiento solo atrae la vista hacia lo que ya estaba escrito, ocurre
al asomar y se desconecta con `unobserve`.

**9 a 12 · El aviso de programación.** Ver su apartado.

### Por qué la decisión 4 se sustituyó por la 4 bis, y qué hace el sello «nube»

La decisión 4 original inyectaba la cifra al construir. La lectura de alcance le encontró tres
problemas y el autor la sustituyó:

1. **Dejaba `index.html` versionado con un marcador**, rompiendo la propiedad que ADR-010 conserva
   a propósito: que el repositorio sea por sí solo una copia completa y servible del sitio.
2. **Su garantía dependía de un ajuste del panel de Cloudflare.** La orden de construcción no se
   puede fijar desde ningún archivo del repositorio (`90-manual/capa-de-datos-y-base-d1.md:54`), así
   que «la cifra se inyecta en el build» descansaba sobre algo que nadie puede comprobar desde acá.
3. **Provocar su falla podía dejar `dist/` vacío**, porque `build-dist.mjs` lo borra al empezar.

La 4 bis conserva lo esencial —la cifra sale de la instantánea, no de quien la escribe— y resuelve
los tres: la cifra real vive escrita en `index.html`, `comprobar-cifra.mjs` da rojo si se desfasa, y
el guion que regenera la instantánea la reescribe en el mismo acto para que no dependa de acordarse.

**La corrección del sello «nube», y la parte donde me equivoqué.** Al entregar la implementación
anoté un hallazgo: si alguien corría el generador contra la base local para probar el modo
degradado, la portada quedaba con la cifra del banco de juguete y `comprobar-cifra` daba verde,
porque portada e instantánea coincidían en un número falso.

**La mitad alarmista de ese hallazgo era falsa, y conviene que quede escrito.** Dije que se
commitearía «sin que nada chille». Chillaba: `comprobar-instantanea.mjs:288` ya traía la
comprobación del sello desde la iteración 22 —`EL SELLO DICE «local»: esta instantanea no salio de
la nube`—, y además la comparación pregunta a pregunta contra `d1/respaldo-banco.sql` habría
denunciado las 358 preguntas que faltaban. `npm run verificar` **ya daba rojo** por el paso
`instantanea`. Provocado con `--sabotaje=sello` y `--sabotaje=falta` para comprobarlo antes de
implementar nada.

**Lo que sí era un hueco real, y es lo que se cerró:** nada defendía la cifra misma. `cifra-portada.mjs`
escribía cualquier número que le entregaran sin preguntar de dónde venía, y la línea `cifra` del
resumen de seis líneas decía **OK** mientras la portada anunciaba diez preguntas. El estado era
detectable, pero el aviso venía del vecino y la línea que hablaba de la portada mentía.

Ahora la cifra solo se escribe desde una instantánea con sello «nube», y `comprobar-cifra` da rojo
si no lo trae **aunque el número coincida**. Los tres puntos de llamada respetan la negativa de
forma distinta, y la diferencia está razonada en el código: `publicar-banco.mjs` **falla entero**
—llegar ahí con otro sello es una contradicción, y seguir dejaría la instantánea nueva con la
portada anunciando el banco anterior—; `generar-instantanea.mjs` **sigue y avisa**, porque es el
único sitio donde un sello local es un resultado legítimo y buscado, y ahí la portada conserva la
cifra del banco publicado, que es la verdadera.

### La segunda cifra falsa, y el barrido

La iteración nombraba el `data-count="21"`. Al implementarla apareció **otra**: `index.html` decía
**«105 preguntas · 7 módulos»** en la píldora de la llamada al cuestionario. También falsa, del
mismo origen —escrita a mano— y con el mismo destino: quedó marcada con `data-cifra-banco` y
vigilada por el mismo comprobador. Las dos dicen hoy 368.

Después se barrió `index.html`, `cuestionario.html`, `static/js/components/` y `static/js/data/`
buscando toda afirmación sobre cuántas preguntas, módulos o alternativas hay. Resultado:

| Dónde | Qué dice | ¿Verdadero hoy? | ¿Puede desfasarse? |
|---|---|---|---|
| `index.html:74` | «7 módulos.» (titular del hero) | Sí, `modules.js` tiene 7 | **Sí.** A mano, sin vigilancia |
| `index.html:154` | `data-cifra-banco data-count="368"` | Sí | **No en silencio.** Vigilada |
| `index.html:214` | `<span data-cifra-banco>368</span> preguntas · **7 módulos**` | Sí las dos | El 368 no en silencio; **el «7 módulos» de la misma línea sí** |
| `cuestionario.js:527` | «el índice con los **siete módulos** del examen» | Sí | **Sí.** A mano |
| `modules.js:17` | «**6 preguntas** de selección múltiple + **2 ejercicios** de código» (módulo 2) | No verificable: describe el examen, no el banco | **Sí**, y nadie se enteraría |

**Solo se corrigieron las que afirman la cantidad de preguntas en `index.html`.** Las dos últimas
filas quedaron registradas en `registro_log.md`, sin tocar.

**El origen de las cuatro métricas del hero** quedó anotado en `index.html:123-140`, junto a las
métricas y no solo en la planificación, porque el día que una se desfase hay que poder saber a qué
archivo ir:

| Métrica | De dónde sale | ¿Puede desfasarse? |
|---|---|---|
| 7 módulos | `static/js/data/modules.js`, 7 entradas. Escrito a mano | **Sí**, si cambian los módulos evaluados |
| 368 preguntas | `static/js/data/instantanea-banco.js`. No se escribe a mano | **No en silencio:** `verificar` da rojo |
| 2 formatos | `contexto-del-examen.md`. **Testimonio de estudiantes** | **Sí**, si el examen cambia o aparece información oficial |
| JWT | `modules.js`, último tema del módulo 8. Escrito a mano | **Sí** |

### El contraste

`mutedink` pasó de **`#5C5A4A`** a **`#8E8C7A`**, una sola línea, y con eso los **28 usos** quedaron
sobre 4,5:1. El peor caso real no era ninguno de los dos que midió el cierre de la 33: era
**2,53:1** (texto sobre `bg-panel2`, en las tarjetas de NotebookLM y en el hover del mapa), y quedó
en **5,18:1**. El segundo peor era la fila **activa** del índice de módulos, `bg-jsyellow/10` sobre
negro, con 2,61:1 → 5,34:1.

Un uso no era texto y se midió contra su propio umbral: el punto de 8 × 8 px de `index.html:185`,
contra el 3:1 de WCAG 1.4.11 para componentes no textuales. Antes daba 2,72 y no alcanzaba ni ese.

**La consecuencia que obligó a la decisión 5 bis:** con `#8E8C7A`, `mutedink` y `muted` (`#9C9A85`)
quedan a **1,19:1** entre sí, o sea prácticamente indistinguibles. El único énfasis del sitio que
dependía de ese salto —«solo en este dispositivo», en el estado vacío del cuestionario— se rehízo
con peso de letra y color principal (`font-semibold text-paper`). Se buscaron más casos en las dos
páginas y en los cuatro componentes que dibujan HTML: **no hay ninguno más**. `muted` no se tocó.

### El aviso de programación (decisiones 9 a 12)

**Por qué se rediseñó.** La versión de `ce8f606` era una tarjeta oscura con barra amarilla titulada
«Código de ejemplo · así se responde una parte del examen». Sobre una página oscura no destacaba:
quedaba como un párrafo más dentro del acordeón, y un aviso que el estudiante no ve no cumple
ninguna función.

**El fondo amarillo obligó a dar vuelta todos los colores.** Ninguno de los grises del sitio sirve
encima:

| Elemento | Color | Sobre `jsyellow` |
|---|---|---|
| Titular «En el examen real deberás programar» | `text-ink` `#000000` | **15,53:1** |
| Subtítulo «En el Módulo N te tocará programar en L» | `text-ink` `#000000` | **15,53:1** |
| Párrafo explicativo | `text-panel2` `#1B1910` | **13,01:1** |
| Énfasis «sin autocompletado…» | `text-ink` + `font-semibold` | **15,53:1** |
| Nota testimonial | `text-panel3` `#25220F` | **11,81:1** |
| *(descartados)* `paper` / `muted` / `mutedink` | | 1,26 · 2,11 · **2,51:1** |

**El párrafo se ajustó por un dato nuevo.** El testimonio del 2026-09-15 aportó que el examen no
solo pide escribir código: también pide **revisar código y señalar el error**. El párrafo lo
incorpora, con el mismo énfasis en negrita de antes. Es el único texto del aviso que no conserva su
redacción de `ce8f606`; la nota testimonial sí, carácter a carácter.

**El subtítulo no está escrito siete veces.** Sale de `numero` y del campo `lenguaje` de cada
módulo, que vive en `static/js/data/modules.js` **y en ningún otro sitio**. `grep "te tocará
programar"` devuelve una sola aparición en todo el repositorio, y es la plantilla. Siete frases a
mano serían siete oportunidades de que una quede diciendo el lenguaje de otro módulo.

**El aviso se dibuja en los siete módulos, tengan o no ejercicios de ejemplo.** Antes vivía dentro
del `if` de los ejercicios. Hoy no se nota porque los siete tienen, pero lo que el aviso afirma es
cierto por el testimonio, no porque nosotros tengamos un ejemplo a mano.

**La tarjeta respira:** la separación con lo que viene después pasó de **8 px** (`mb-2`) a **40 px**
(`mb-10`).

**El tamaño del ícono (decisión 11).** De `sm` hacia arriba mide lo mismo de alto que el bloque del
titular y el subtítulo —**60 px calculados**, sin ninguna medida escrita a mano: el envoltorio se
estira y la imagen lo llena—. Debajo de `sm` se congela en **32 × 32 px**, y esa es la parte que
importa: ahí el titular se parte en varias líneas, y un ícono que creciera con él se comería el
ancho del texto, que se partiría más, que agrandaría el ícono. El tamaño fijo corta esa
realimentación.

**El rótulo (decisión 12).** El rediseño dejó los bloques de código sin nada que dijera qué son, y
el rótulo vuelve con el mismo estilo que «Temas evaluados» — son los dos rótulos de las dos mitades
de la tarjeta abierta, y tienen que reconocerse como la misma clase de cosa. Dice «podrían salir» y
no «salen» porque estos ejercicios son fieles a los que cayeron en 2026, no una promesa de lo que
caerá.

**Y el generador de íconos dejó de tragarse el SVG del aviso.** `npm run icons` recorría todo
`static/resources/` y emitía `.i-alert-loop` como máscara CSS. Nadie la usaba, y era una trampa: una
máscara conserva solo el canal alfa, así que el ícono perdía **sus dos animaciones y su color**, y
quien algún día escribiera `<span class="icon i-alert-loop">` creyendo que era el ícono animado
habría obtenido un triángulo estático. Ahora se excluye por lista, con el porqué escrito y la regla
para futuros: si el SVG pierde algo al quedarse solo con su silueta, no es un ícono de este sistema.

### Las excepciones y los límites aceptados por el autor

**El ícono del aviso anima para siempre (decisión 10), y es la única excepción del sitio.** Sus
animaciones están escritas dentro del SVG, en SMIL, y la regla de `src/input.css` es CSS: no las
alcanza. De ahí tres consecuencias que el autor aceptó por escrito:

- **No respeta `prefers-reduced-motion`.** Un estudiante que pidió a su sistema menos movimiento
  sigue viendo el pulso. Es la única animación del sitio de la que esto es cierto: `animate-floaty`
  también es infinita, pero esa sí se detiene.
- **No cumple WCAG 2.2.2 (nivel A).** Un movimiento que empieza solo, dura más de cinco segundos y
  convive con otro contenido pide un mecanismo para pausarlo. Este no lo ofrece.
- **El dibujo inicial puede ocurrir sin que nadie lo vea**, si la imagen se carga con la tarjeta
  cerrada. El pulso sí se ve.

**El sitio publicado no atribuye visiblemente ninguna de las dos herramientas con licencia
(decisión 7).** Y las dos no están igual de mal:

- **animate.css: no llega ni un carácter.** El aviso vive en `tailwind.config.cjs`, que no se copia
  a `dist/`, y los comentarios no sobreviven a la compilación de Tailwind. El efecto ya está en
  producción sin atribución.
- **line-md: su aviso sí viaja dentro del SVG publicado**, porque es un comentario del propio
  archivo y `static/resources/` se copia entero. El crédito llega al sitio, aunque nadie lo vea a
  simple vista.

Las dos necesitan igualmente su línea en `acerca-de.html`, que no existe y no tiene iteración
asignada. **El incumplimiento corre desde este commit**, y está registrado.

### Dos tropiezos del proceso que vale la pena dejar escritos

**La barrera de ADR-015 cortó un comando mío, y funcionó.** Un `heredoc` que estaba escribiendo
contenía la cadena `--remote` **dentro de un comentario** que iba a quedar en el código, y la capa 2
de la barrera lo cortó antes de ejecutarlo. Es exactamente lo que tiene que hacer: la capa 2 solo ve
la línea de comando y no puede saber si la mención es documental. Rehice ese cambio con las
herramientas de edición, como el propio mensaje de la barrera indica. **Conviene saberlo**: la
barrera dispara por la cadena, no por la intención, y eso no es un defecto.

**`npm run datos:dev` dejó procesos huérfanos, dos veces.** Al vencer el tiempo del shell, el
proceso se fue a segundo plano y quedaron árboles vivos respawneando `workerd` sin nadie escuchando
en el 8788: la sonda daba `000` mientras el registro decía «Ready». Se resolvió matando por árbol
(`taskkill /F /T`) y relanzando. **Encaja con H-034**, varios procesos contra el mismo archivo D1
local, y es la misma familia del falso rojo intermitente de `probar-restricciones`. Quien vea una
sonda muerta con el servidor «listo» en el registro, que mire si hay más de un `datos:dev` vivo
antes de buscar en otra parte.

### Lo que hereda la iteración 34

- **La 34 es la siguiente**, por el orden 33 → 36 → 34 → 35 que el autor fijó al cerrar la 33.
- **Toca `cuestionario.js`, que esta iteración movió en dos sitios**: el estado vacío
  (`mostrarEstadoVacio()`, donde cambió el énfasis de «solo en este dispositivo») y el veredicto
  (`dibujarPregunta()`, donde vive el `<p class="quiz-feedback">` que la justificación va a llenar).
  Conviene releer los dos antes de empezar.
- **Cualquier texto nuevo que la 34 escriba usa el `mutedink` corregido**, que ya no es un gris
  tenue: está a 1,19:1 de `muted`. Si la justificación necesita dos niveles de gris, **hoy no los
  hay**, y el camino aprobado es peso de letra o color principal (decisión 5 bis), no un color nuevo.
- **La 34 dibuja dentro de las tarjetas de pregunta, no de las de módulo**, así que el aviso amarillo
  no la afecta. Sí la afecta la regla que dejó: el énfasis no se expresa solo con color.
- Los hallazgos abiertos de esta iteración están en `registro_log.md`, ninguno arreglado aquí.
