# Justificaciones del módulo 2 · para revisar

**Lote:** 52 preguntas · **Redactadas:** 2026-09-09 por Claude Code

Las justificaciones no existen en ninguno de los dos bancos de origen: hay que
escribirlas. Éstas son un **borrador para revisar**, no contenido aprobado.

## Cómo se revisa esto

1. **Empieza por la lista de dudas**, más abajo. Es corta y es donde está el valor.
2. Recorre los bloques. En cada uno tienes el enunciado, las cuatro alternativas
   con la correcta marcada `←`, y la justificación propuesta.
3. **Marca la casilla** de la que apruebes. Corrige el texto que no te sirva:
   escribe directamente entre las marcas `<!-- justificacion:inicio -->` y
   `<!-- justificacion:fin -->`, que es lo que se lee de vuelta.
4. Lo que quede **sin marcar se carga en `borrador`** y no lo ve ningún estudiante.
   No es un castigo: es el estado que existe para esto.

> **`**[DUDA]**` dentro de un texto marca lo que no doy por seguro.** Donde no
> aparece, estoy afirmando. Va dentro y no en una nota aparte para que no se
> pueda leer la justificación sin leer la duda: un borrador fluido es más fácil
> de aprobar sin leer que una página en blanco, y ése es el riesgo de que las
> redacte una máquina.

---

## Las 0 con duda, primero

Ninguna. **Eso debería darte más desconfianza que una lista larga**, no menos.

---

## Los bloques

### 01 · m02#1

<!-- pregunta: json_2026#1 | just:57313df373f9 -->

¿Qué limita estrictamente al Front-End en comparación con el Back-End en la arquitectura web?

- `(a)` No interactuar directo con el sistema de archivos del servidor.  **← correcta**
- `(b)` No puede renderizar estilos dinámicos del lado del usuario.
- `(c)` No admite la visualización directa de código ofuscado.
- `(d)` Requiere obligatoriamente un framework de interfaz de usuario.

<!-- justificacion:inicio -->
El Front-End corre dentro del navegador, y el navegador no le da acceso al sistema de archivos del servidor: esa es una frontera de seguridad, no una limitación de las herramientas. Las otras tres describen cosas que el Front-End sí hace (estilos dinámicos) o que simplemente no son ciertas (ningún framework es obligatorio).
<!-- justificacion:fin -->

- [x] Aprobada

### 02 · m02#2

<!-- pregunta: json_2026#2 | just:9b5efe9abe25 -->

¿Cuál es el rol fundamental del protocolo HTTP en la comunicación entre capas de desarrollo web?

- `(a)` Dar estilo visual avanzado a la página web renderizada en cliente.
- `(b)` Permitir comunicación sin estado entre el cliente y el servidor.  **← correcta**
- `(c)` Compilar el código JavaScript antes de su envío a producción.
- `(d)` Gestionar sesiones de usuario de forma nativa en la base de datos.

<!-- justificacion:inicio -->
HTTP es un protocolo sin estado: cada petición llega sin memoria de las anteriores, y por eso las sesiones hay que construirlas encima con cookies o tokens. Las otras tres atribuyen a HTTP trabajos que hacen CSS, el compilador o la base de datos.
<!-- justificacion:fin -->

- [x] Aprobada

### 03 · m02#3

<!-- pregunta: json_2026#3 | just:b96593430e12 -->

En una arquitectura Fullstack clásica, ¿qué componente intermedio separa la lógica Front y Back?

- `(a)` El motor de renderizado del navegador del cliente.
- `(b)` La Interfaz de Programación de Aplicaciones (API).  **← correcta**
- `(c)` El sistema de control de versiones centralizado.
- `(d)` El modelo de cajas jerárquico del CSS.

<!-- justificacion:inicio -->
La API es el contrato entre las dos capas: el Front-End pide y recibe datos sin saber cómo están guardados, y el Back-End los entrega sin saber cómo se van a dibujar. Esa separación es lo que permite cambiar un lado sin tocar el otro.
<!-- justificacion:fin -->

- [x] Aprobada

### 04 · m02#4

<!-- pregunta: json_2026#4 | just:e8635d97cc73 -->

¿Para qué usaría primariamente el inspector del navegador un desarrollador Front-End al depurar?

- `(a)` Para compilar código fuente directamente a WebAssembly en consola.
- `(b)` Para estructurar entidades y tablas en la base de datos remota.
- `(c)` Para modificar el DOM en vivo y auditar peticiones HTTP de red.  **← correcta**
- `(d)` Para reiniciar o purgar la caché del servidor web de backend.

<!-- justificacion:inicio -->
El inspector sirve para las dos cosas a la vez: editar el DOM en vivo para probar un cambio sin recompilar, y mirar la pestaña de red para ver qué peticiones salieron y qué respondieron. Las otras tres describen tareas de servidor o de compilación, que no ocurren en el navegador.
<!-- justificacion:fin -->

- [x] Aprobada

### 05 · m02#5

<!-- pregunta: json_2026#5 | just:f99ef915215e -->

Según la tríada de desarrollo web, ¿qué rol técnico fundamental asume JavaScript en cliente?

- `(a)` Definir la semántica y jerarquía de nodos en la vista web.
- `(b)` Especificar reglas de diseño, colorimetría y adaptabilidad.
- `(c)` Controlar el comportamiento lógico y mutación dinámica del DOM.  **← correcta**
- `(d)` Ejecutar consultas nativas SQL sobre los datos locales en disco.

<!-- justificacion:inicio -->
En la tríada, HTML pone la estructura, CSS la presentación y JavaScript el comportamiento: es el único de los tres que puede reaccionar a un evento y modificar el DOM después de que la página cargó. Las alternativas (a) y (b) describen justamente a HTML y a CSS.
<!-- justificacion:fin -->

- [x] Aprobada

### 06 · m02#6

<!-- pregunta: json_2026#6 | just:01aa97497fae -->

En un formulario HTML5, ¿qué atributo del form define la URI destino al procesar datos enviados?

- `(a)` enctype
- `(b)` action  **← correcta**
- `(c)` target
- `(d)` rel

<!-- justificacion:inicio -->
`action` es el atributo que dice a qué URI se envían los datos del formulario. `enctype` define cómo se codifican, `target` dónde se abre la respuesta, y `rel` ni siquiera pertenece a `<form>`.
<!-- justificacion:fin -->

- [x] Aprobada

### 07 · m02#7

<!-- pregunta: json_2026#7 | just:e0c0d5da5fae -->

¿Cuál es la función semántica estricta de la etiqueta `<aside>` según los estándares de HTML5?

- `(a)` Demarcar un contenido fundamental que debe leerse primero.
- `(b)` Contener información periférica conectada al flujo principal.  **← correcta**
- `(c)` Aislar scripts externos del cuerpo de la página en el header.
- `(d)` Declarar legalmente los datos de autoría en el pie de página.

<!-- justificacion:inicio -->
`<aside>` es para contenido relacionado con el principal pero que puede separarse de él sin que el texto pierda sentido: una barra lateral, una nota al margen, un bloque de enlaces relacionados. Si el contenido fuera indispensable para entender la página, no iría en un `<aside>`.
<!-- justificacion:fin -->

- [x] Aprobada

### 08 · m02#8

<!-- pregunta: json_2026#8 | just:df291cc220ed -->

¿Qué combinación de etiquetas HTML5 es correcta para instanciar un menú de opciones nativo?

- `(a)` `<select>` como contenedor lógico de múltiples opciones `<option>`.  **← correcta**
- `(b)` `<dropdown>` inicializando múltiples atributos `<item>` internos.
- `(c)` `<datalist>` anidando colecciones estáticas de nodos `<list>`.
- `(d)` `<menu>` controlando estructuralmente subetiquetas `<input>`.

<!-- justificacion:inicio -->
El menú desplegable nativo de HTML es un `<select>` que contiene elementos `<option>`. Las otras tres combinan etiquetas que no existen en el estándar: `<dropdown>`, `<item>` y `<list>` son inventadas, y `<datalist>` existe pero acompaña a un `<input>`, no reemplaza al `<select>`.
<!-- justificacion:fin -->

- [x] Aprobada

### 09 · m02#9

<!-- pregunta: json_2026#9 | just:4a5fc6a65416 -->

¿Dónde deben declararse semánticamente los links a hojas de estilos externas y metadatos vitales?

- `(a)` Como hijos directos dentro del contenedor `<head>`.  **← correcta**
- `(b)` Justo antes del cierre del `</body>` para acelerar el renderizado.
- `(c)` Anidados en el primer nodo `<header>` del documento.
- `(d)` Como metadatos configurados en atributos de la etiqueta `<html>`.

<!-- justificacion:inicio -->
El `<head>` es donde va todo lo que describe el documento sin dibujarse: hojas de estilo, metadatos, título. Poner ahí la hoja de estilos permite además que el navegador empiece a pedirla antes de encontrarse con el contenido. La alternativa (b) es el error clásico de confundirla con los scripts, que sí se ponen al final del `<body>` y por un motivo distinto: no bloquear el dibujado.
<!-- justificacion:fin -->

- [x] Aprobada

### 10 · m02#10

<!-- pregunta: json_2026#10 | just:502287012e8a -->

Para lograr accesibilidad, ¿qué etiqueta asocia lógicamente grupos de controles de formulario?

- `(a)` `<form-section>`
- `(b)` `<fieldset>`  **← correcta**
- `(c)` `<control-group>`
- `(d)` `<div role="form">`

<!-- justificacion:inicio -->
`<fieldset>` agrupa controles relacionados y, junto con `<legend>`, hace que un lector de pantalla anuncie a qué grupo pertenece cada campo. Las alternativas (a) y (c) son etiquetas inventadas, y (d) es un `<div>` con un rol ARIA: parcha la accesibilidad en vez de usar la etiqueta que ya existe para eso.
<!-- justificacion:fin -->

- [x] Aprobada

### 11 · m02#11

<!-- pregunta: json_2026#11 | just:c239e9a7bebd -->

¿Qué atributo HTML asegura vincular explícita y unívocamente una etiqueta `<label>` con un input?

- `(a)` href
- `(b)` name
- `(c)` for  **← correcta**
- `(d)` form

<!-- justificacion:inicio -->
El atributo `for` del `<label>` apunta al `id` del campo, y ese vínculo hace dos cosas: el lector de pantalla anuncia la etiqueta al enfocar el campo, y hacer clic en el texto pone el cursor dentro. `name` sirve para enviar el dato, no para vincular.
<!-- justificacion:fin -->

- [x] Aprobada

### 12 · m02#12

<!-- pregunta: json_2026#12 | just:8aa5009d9624 -->

En el modelo de cajas CSS, ¿qué propiedad añade espacio transparente externo perimetral al borde?

- `(a)` outline
- `(b)` margin  **← correcta**
- `(c)` border-spacing
- `(d)` padding

<!-- justificacion:inicio -->
En el modelo de cajas, de adentro hacia afuera van contenido, `padding`, `border` y `margin`. El `margin` es el espacio exterior al borde, y es transparente: separa la caja de sus vecinas. El `padding` es el espacio interior, entre el contenido y el borde.
<!-- justificacion:fin -->

- [x] Aprobada

### 13 · m02#13

<!-- pregunta: json_2026#13 | just:8b8afa65d388 -->

Según el cálculo de especificidad CSS, ¿cuál de los siguientes selectores prevalece en conflicto?

- `(a)` form input.active:hover
- `(b)` header nav.main-menu ul li
- `(c)` #main-container .btn-primary  **← correcta**
- `(d)` article &gt; p::first-line

<!-- justificacion:inicio -->
La especificidad se cuenta por categorías, y un identificador pesa más que cualquier cantidad de clases o elementos. Sólo (c) tiene un `#id`, así que gana sin necesidad de contar el resto: (a) suma dos clases, (b) una clase y cuatro elementos, y (d) sólo elementos.
<!-- justificacion:fin -->

- [x] Aprobada

### 14 · m02#14

<!-- pregunta: json_2026#14 | just:4b8816b4c922 -->

¿Qué atajo media query CSS restringe la regla exclusivamente a Viewports de mínimo 1024px?

- `(a)` @media screen and (max-width: 1024px)
- `(b)` @media (min-width: 1024px)  **← correcta**
- `(c)` @media only (width &gt;= 1024px)
- `(d)` @media viewport (size &gt; 1024px)

<!-- justificacion:inicio -->
`min-width` significa «desde este ancho hacia arriba», así que la regla se aplica a viewports de 1024px o más. La (a) hace justo lo contrario con `max-width`, y las otras dos usan sintaxis que no existe.
<!-- justificacion:fin -->

- [x] Aprobada

### 15 · m02#15

<!-- pregunta: json_2026#15 | just:3dd532d37cd1 -->

¿Qué declaración box-sizing engloba el padding y el border en el cálculo del width total asignado?

- `(a)` margin-box
- `(b)` padding-box
- `(c)` border-box  **← correcta**
- `(d)` content-box

<!-- justificacion:inicio -->
Con `border-box`, el `width` que declaras es el ancho final de la caja: el `padding` y el `border` se descuentan hacia adentro en vez de sumarse. Con `content-box`, que es el valor por omisión, el `width` describe sólo el contenido y todo lo demás se suma encima.
<!-- justificacion:fin -->

- [x] Aprobada

### 16 · m02#16

<!-- pregunta: json_2026#16 | just:fec52f566c31 -->

Ante la colisión de estilos de distintos orígenes, y sin usar `!important`, ¿qué estilo CSS impone mayor prioridad?

- `(a)` Selectores inyectados mediante archivos externos al final del head.
- `(b)` Bloques embebidos en una etiqueta style sin directiva important.
- `(c)` El estilo incrustado directamente utilizando el atributo en línea.  **← correcta**
- `(d)` Directivas del navegador cliente definidas por el usuario.

<!-- justificacion:inicio -->
En la cascada, un estilo puesto en el atributo `style` del elemento pesa más que cualquier regla de una hoja de estilos, venga de un archivo externo o de un `<style>` embebido. La alternativa (d) es el distractor que más enseña: el orden de los orígenes es navegador, luego usuario, luego autor, así que la hoja del usuario queda por debajo. Sólo se invierte con `!important`, y por eso el enunciado lo descarta.
<!-- justificacion:fin -->

- [x] Aprobada

### 17 · m02#17

<!-- pregunta: json_2026#17 | just:8e8a98e696b4 -->

¿Qué operador relacional CSS filtra afectando solo a los descendientes de primer grado (hijos)?

- `(a)` Espacio general ( )
- `(b)` Signo más (+)
- `(c)` Tilde general (~)
- `(d)` Signo mayor que (&gt;)  **← correcta**

<!-- justificacion:inicio -->
El signo `>` es el combinador de hijo directo: `div > p` afecta a los párrafos que cuelgan inmediatamente del `div`, no a los que están más abajo. El espacio alcanza a todos los descendientes, `+` al hermano inmediato y `~` a los hermanos siguientes.
<!-- justificacion:fin -->

- [x] Aprobada

### 18 · m02#18

<!-- pregunta: json_2026#18 | just:7be1ecc2836a -->

¿Cuántas fracciones equitativas articulan como límite la arquitectura del grid de Bootstrap?

- `(a)` 8 bloques.
- `(b)` 12 columnas.  **← correcta**
- `(c)` 16 sectores.
- `(d)` 24 celdillas.

<!-- justificacion:inicio -->
La grilla de Bootstrap divide cada fila en 12 columnas, y 12 se eligió porque se reparte en mitades, tercios, cuartos y sextos sin decimales. Por eso las clases van de `col-1` a `col-12` y la suma dentro de una fila debería dar 12.
<!-- justificacion:fin -->

- [x] Aprobada

### 19 · m02#19

<!-- pregunta: json_2026#19 | just:4ab6f0d6895f -->

¿Qué sufijo responsivo activa modificaciones de diseño en Bootstrap al superar el breakpoint grande?

- `(a)` .col-md-
- `(b)` .col-xl-
- `(c)` .col-lg-  **← correcta**
- `(d)` .col-sm-

<!-- justificacion:inicio -->
El sufijo `lg` corresponde al breakpoint «grande», que en Bootstrap arranca en 992px. Los sufijos van de menor a mayor —`sm`, `md`, `lg`, `xl`— y cada uno aplica desde su ancho hacia arriba, no sólo dentro de un tramo.
<!-- justificacion:fin -->

- [x] Aprobada

### 20 · m02#20

<!-- pregunta: json_2026#20 | just:6c4ef1a82466 -->

¿Qué clase central de Bootstrap estabiliza el margen limitando y centrando el ancho del contenido?

- `(a)` .container-fluid
- `(b)` .container  **← correcta**
- `(c)` .wrapper-box
- `(d)` .col-centered

<!-- justificacion:inicio -->
`.container` fija un ancho máximo por cada breakpoint y centra el bloque con márgenes automáticos. `.container-fluid` hace lo contrario: ocupa siempre el 100% del ancho disponible. Las otras dos clases no existen en Bootstrap.
<!-- justificacion:fin -->

- [x] Aprobada

### 21 · m02#21

<!-- pregunta: json_2026#21 | just:3cdc815854a3 -->

En el sistema de utilidades, ¿qué clase induce a un nodo tipo block a ocupar el 100% de su padre?

- `(a)` .w-100  **← correcta**
- `(b)` .full-width
- `(c)` .d-max
- `(d)` .btn-fill

<!-- justificacion:inicio -->
`.w-100` es la utilidad de ancho que fija `width: 100%`, de modo que el elemento ocupa todo el ancho de su contenedor padre. Las otras tres no existen en Bootstrap.
<!-- justificacion:fin -->

- [x] Aprobada

### 22 · m02#22

<!-- pregunta: json_2026#22 | just:6dee6b05af8b -->

En Bootstrap 4, ¿qué propósito de interfaz cumple el componente jumbotron?

- `(a)` Controlar migraciones asíncronas de datos en formato modal.
- `(b)` Crear un cajón semántico envolvente resaltando contenido maestro.  **← correcta**
- `(c)` Generar alertas automáticas colapsables en la esquina del viewport.
- `(d)` Formatear validaciones cruzadas en sub-formularios anidados.

<!-- justificacion:inicio -->
El jumbotron es un bloque destacado, con fondo y espaciado generosos, para resaltar el mensaje principal al comienzo de una página. El enunciado dice «en Bootstrap 4» a propósito: en Bootstrap 5 el componente se eliminó y su efecto se reconstruye combinando utilidades de fondo, borde y espaciado.
<!-- justificacion:fin -->

- [x] Aprobada

### 23 · m02#23

<!-- pregunta: json_2026#23 | just:15ad02f11e03 -->

¿Bajo qué doctrina base se estructura algorítmicamente el flujo responsivo en Bootstrap por defecto?

- `(a)` Desktop First, degradando reglas complejas.
- `(b)` Mobile First, escalando media queries en aumento.  **← correcta**
- `(c)` Fluid First, forzando dimensiones relativas al 100%.
- `(d)` Media First, aislando impresión y lectura interactiva.

<!-- justificacion:inicio -->
Bootstrap está construido «mobile first»: los estilos base valen para pantallas chicas y las media queries usan `min-width` para ir agregando reglas hacia arriba. Por eso una clase sin sufijo, como `.col-6`, aplica desde el móvil en adelante.
<!-- justificacion:fin -->

- [x] Aprobada

### 24 · m02#24

<!-- pregunta: json_2026#24 | just:b1d2714ce5f6 -->

En evaluación nativa de JavaScript, ¿qué método atrapa de forma veloz a un único nodo por su ID?

- `(a)` document.getElementById()  **← correcta**
- `(b)` document.querySelector("[id]")
- `(c)` document.getElementsByName()[0]
- `(d)` document.findAll()

<!-- justificacion:inicio -->
`getElementById()` va directo al índice interno de identificadores del documento, así que devuelve el nodo sin recorrer el árbol. `querySelector("[id]")` sí recorre y además devolvería el primer elemento que tenga cualquier `id`, no el que buscas; y `document.findAll()` no existe.
<!-- justificacion:fin -->

- [x] Aprobada

### 25 · m02#25

<!-- pregunta: json_2026#25 | just:7a111cd97e87 -->

A nivel de memoria y asignación, ¿por qué es crítico utilizar "let" sobre "var" al iterar ciclos?

- `(a)` let previene fugas de alcance limitando la variable al bloque léxico.  **← correcta**
- `(b)` "var" causa desbordamiento de memoria por sobreescritura estricta.
- `(c)` "let" desactiva por completo el motor de recolección de basura.
- `(d)` "var" restringe mutaciones en tipos compuestos como arreglos.

<!-- justificacion:inicio -->
`var` se declara a nivel de función, así que en un bucle todas las vueltas comparten la misma variable, y una función definida dentro del ciclo termina viendo el último valor. `let` crea una variable nueva por cada iteración del bloque, y cada cierre captura la suya.
<!-- justificacion:fin -->

- [x] Aprobada

### 26 · m02#26

<!-- pregunta: json_2026#26 | just:b4238abb5446 -->

¿Qué detonante de evento del DOM percibe mutaciones confirmadas cuando el elemento pierde el foco?

- `(a)` onkeyup
- `(b)` onsubmit
- `(c)` onchange  **← correcta**
- `(d)` oninput

<!-- justificacion:inicio -->
`change` se dispara cuando el campo pierde el foco **y además** su valor cambió respecto de cuando lo ganó: por eso el enunciado dice «mutaciones confirmadas». `input` se dispara con cada tecla, sin esperar a que el campo se abandone.
<!-- justificacion:fin -->

- [x] Aprobada

### 27 · m02#27

<!-- pregunta: json_2026#27 | just:9b60a2dea5fe -->

Considerando la sintaxis funcional ES6, ¿qué sentencia declara una arrow function correctamente?

- `(a)` const run = function() =&gt; {}
- `(b)` const run = () =&gt; {}  **← correcta**
- `(c)` let run =&gt; function() {}
- `(d)` var run = arrow() {}

<!-- justificacion:inicio -->
La sintaxis de una arrow function es lista de parámetros, flecha y cuerpo: `() => {}`. La (a) mezcla `function` con la flecha, que no se combinan; las otras dos no son sintaxis válida.
<!-- justificacion:fin -->

- [x] Aprobada

### 28 · m02#28

<!-- pregunta: json_2026#28 | just:487890d12ab6 -->

Si intentas reasignar una variable declarada con `const`, ¿qué ocurre en tiempo de ejecución?

- `(a)` Una evasión pasiva, alterando solo la copia profunda local.
- `(b)` Una interrupción global por ReferenceError inalcanzable.
- `(c)` Un corte forzado de ejecución levantando un TypeError.  **← correcta**
- `(d)` El sistema ignora y anula silenciosamente los cambios aplicados.

<!-- justificacion:inicio -->
Reasignar una variable declarada con `const` lanza un `TypeError` y corta la ejecución: el enlace entre el nombre y su valor es lo que `const` congela. Conviene no confundirlo con lo otro: si la constante apunta a un objeto o a un arreglo, **modificar su contenido está permitido** y no lanza nada. `const` protege la referencia, no lo referenciado.
<!-- justificacion:fin -->

- [x] Aprobada

### 29 · m02#29

<!-- pregunta: json_2026#29 | just:28d903000cae -->

Durante la fase de coerción implícita, ¿qué entrega la ejecución de la sentencia binaria "3" + 3?

- `(a)` El tipo Number 6, sumando el logaritmo binario subyacente.
- `(b)` Un fallo inminente evaluado como NaN irremediable.
- `(c)` Un SyntaxError al mezclar primitivas incompatibles por diseño.
- `(d)` El tipo String '33', priorizando concatenación sobre adición.  **← correcta**

<!-- justificacion:inicio -->
Con el operador `+`, si uno de los operandos es una cadena, JavaScript convierte el otro a cadena y concatena: `"3" + 3` da `"33"`, del tipo String. Es el `+` el que se comporta así; con `-`, `*` o `/` la conversión va hacia número y `"3" - 3` daría `0`.
<!-- justificacion:fin -->

- [x] Aprobada

### 30 · m02#30

<!-- pregunta: json_2026#30 | just:a938cd45d855 -->

Al cargar jQuery, ¿qué símbolo queda definido como atajo de la función `jQuery`?

- `(a)` La doble directiva jQ().
- `(b)` El prefijo subrayado _.
- `(c)` El símbolo monetario $.  **← correcta**
- `(d)` El apuntador simbólico &.

<!-- justificacion:inicio -->
jQuery define la variable global `$` como atajo de la función `jQuery`, y por eso todo el código de la librería empieza con ese símbolo. Son la misma función con dos nombres: `$("#x")` y `jQuery("#x")` hacen lo mismo. Y como `$` es una variable corriente, se puede soltar con `jQuery.noConflict()` cuando otra librería la reclama.
<!-- justificacion:fin -->

- [x] Aprobada

### 31 · m02#31

<!-- pregunta: json_2026#31 | just:e51a581a0d46 -->

¿Cuál es el patrón estandarizado para adjuntar manejadores "click" en nodos asíncronos vía jQuery?

- `(a)` $("#nodo").on("click", function() {});  **← correcta**
- `(b)` document.getElementById("nodo").click();
- `(c)` $(".nodo").bindClick(function() {});
- `(d)` $("#nodo").eventListener("click");

<!-- justificacion:inicio -->
`.on("click", ...)` es la forma vigente de asociar manejadores en jQuery, y es la que además permite delegar en un ancestro para que funcione con nodos que todavía no existen al momento de registrarla. `.bindClick()` y `.eventListener()` no existen, y la (b) dispara el clic en vez de escucharlo.
<!-- justificacion:fin -->

- [x] Aprobada

### 32 · m02#32

<!-- pregunta: json_2026#32 | just:bba59fadc8d6 -->

¿Qué directriz bloquea la ejecución de scripts en jQuery hasta asegurar que el árbol DOM está listo?

- `(a)` $(window).loadHandler(function() {});
- `(b)` $(document).ready(function() {});  **← correcta**
- `(c)` $.initDOM(function() {});
- `(d)` $(html).awaitComplete(function() {});

<!-- justificacion:inicio -->
`$(document).ready()` retrasa la ejecución hasta que el árbol DOM está construido, de modo que los selectores encuentren los elementos. Sin eso, un script en el `<head>` correría antes de que existieran los nodos que busca. Las otras tres no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 33 · m02#33

<!-- pregunta: json_2026#33 | just:97419a332224 -->

Al parsear datos, ¿qué función encapsula jQuery para forzar la lectura del contenido de un `<input>`?

- `(a)` .contentNode()
- `(b)` .text()
- `(c)` .html()
- `(d)` .val()  **← correcta**

<!-- justificacion:inicio -->
`.val()` lee y escribe el valor de los controles de formulario, que es donde vive el contenido de un `<input>`. `.text()` y `.html()` trabajan sobre el contenido entre etiquetas de apertura y cierre, y un `<input>` no tiene: es un elemento vacío.
<!-- justificacion:fin -->

- [x] Aprobada

### 34 · m02#34

<!-- pregunta: json_2026#34 | just:b49670f42835 -->

¿Qué técnica animada nativa de jQuery altera gradualmente la opacidad hasta colapsar el nodo visual?

- `(a)` .hide()
- `(b)` .collapse()
- `(c)` .fadeOut()  **← correcta**
- `(d)` .slideUp()

<!-- justificacion:inicio -->
`.fadeOut()` baja la opacidad de forma gradual y, al terminar, oculta el elemento. `.hide()` lo esconde de golpe, `.slideUp()` lo colapsa por altura en vez de por opacidad, y `.collapse()` no es de jQuery sino de Bootstrap.
<!-- justificacion:fin -->

- [x] Aprobada

### 35 · m02#35

<!-- pregunta: json_2026#35 | just:46df5830418b -->

¿Qué mutación estructural consolida temporalmente 'git add' en la topología de un flujo versionado?

- `(a)` Indexa cambios brutos del working directory hacia el Staging Area.  **← correcta**
- `(b)` Persiste instantáneas en el repositorio local (HEAD).
- `(c)` Traslada ramas paralelas sobre la estructura del código matriz.
- `(d)` Proyecta deltas de código directamente al clúster remoto.

<!-- justificacion:inicio -->
`git add` mueve los cambios del directorio de trabajo al área de preparación, que es una zona intermedia donde se arma el próximo commit. No guarda nada en la historia todavía: eso lo hace `git commit`, que es la alternativa (b).
<!-- justificacion:fin -->

- [x] Aprobada

### 36 · m02#36

<!-- pregunta: json_2026#36 | just:31615ef8684b -->

Al gatillar 'git commit' careciendo de archivos indexados previos, ¿qué respuesta retorna Git CLI?

- `(a)` Consolida instantáneamente un bypass guardando el working copy.
- `(b)` Aborta bloqueando la firma al no existir cambios en staging.  **← correcta**
- `(c)` Imprime un log de aviso mientras fusiona el repositorio origen.
- `(d)` Sobrescribe los metadatos forzando un historial completamente vacío.

<!-- justificacion:inicio -->
Sin nada en el área de preparación no hay cambios que registrar, así que Git aborta e informa que no hay nada que confirmar. No inventa un commit vacío ni guarda el directorio de trabajo por su cuenta.
<!-- justificacion:fin -->

- [x] Aprobada

### 37 · m02#37

<!-- pregunta: json_2026#37 | just:737af22594fb -->

Frente a múltiples vectores de desarrollo, ¿qué previene tácticamente el aislamiento en ramas (branch)?

- `(a)` Saturar el disco local con instantáneas redundantes e inservibles.
- `(b)` Bloqueos de red al empujar datos corruptos hacia GitHub server.
- `(c)` Rupturas y colisiones críticas al inyectar código no verificado.  **← correcta**
- `(d)` Extravío criptográfico de las claves SHA-1 vinculadas al commit.

<!-- justificacion:inicio -->
Una rama aísla el trabajo en curso, de modo que el código a medio hacer no se mezcla con la línea principal hasta que alguien lo revise e integre. Las otras tres describen problemas de disco, de red o de criptografía, que no son lo que las ramas resuelven.
<!-- justificacion:fin -->

- [x] Aprobada

### 38 · m02#39

<!-- pregunta: json_2026#39 | just:3c25aea63e2a -->

En presencia de un Merge Conflict grave, ¿qué protocolo manual asume irrevocablemente el usuario?

- `(a)` Resetear remotamente borrando su clon local mediante flag --hard.
- `(b)` Intervenir los archivos conflictivos y sellar con un nuevo commit.  **← correcta**
- `(c)` Evadir marcas de conflicto forzando subidas push --force locales.
- `(d)` Abortar la rama y delegar dependencias mediante directivas stash.

<!-- justificacion:inicio -->
Ante un conflicto, Git marca las zonas en disputa dentro del archivo y se detiene: es la persona quien decide qué código queda y luego confirma la resolución con un commit. Las otras tres son maniobras para esquivar el conflicto, y todas pierden trabajo.
<!-- justificacion:fin -->

- [x] Aprobada

### 39 · m02#40

<!-- pregunta: json_2026#40 | just:afe723c3137e -->

¿Cuál es la disparidad motriz exacta entre invocar "git fetch" frente a procesar un "git pull"?

- `(a)` 'fetch' descarga al caché remoto; 'pull' integra eso a tu trabajo.  **← correcta**
- `(b)` 'fetch' sobrescribe tu historia local; 'pull' solo lee punteros.
- `(c)` 'pull' revierte fallas de red; 'fetch' reconstruye commits rotos.
- `(d)` Son estrictamente sinónimos, ejecutando idéntica rutina binaria.

<!-- justificacion:inicio -->
`git fetch` trae los commits del remoto y actualiza las ramas de seguimiento, sin tocar tu rama de trabajo: puedes mirar qué llegó antes de integrarlo. `git pull` hace ese mismo `fetch` y además lo fusiona en tu rama en el mismo acto.
<!-- justificacion:fin -->

- [x] Aprobada

### 40 · M2-1

<!-- pregunta: js_2026#1 | just:f40c694126bd -->

¿Cuál es la principal responsabilidad arquitectónica del rol Front-End en una aplicación web moderna?

- `(a)` Gestionar la lógica de negocio y la base de datos central.
- `(b)` Renderizar la interfaz y gestionar la interacción del usuario.  **← correcta**
- `(c)` Configurar el servidor web y los protocolos de red TCP/IP.
- `(d)` Orquestar contenedores Docker para el despliegue continuo.

<!-- justificacion:inicio -->
El rol Front-End se ocupa de lo que ocurre en el navegador: construir la interfaz y responder a lo que hace la persona. La lógica de negocio, la base de datos y la configuración del servidor pertenecen al Back-End o a operaciones.
<!-- justificacion:fin -->

- [x] Aprobada

### 41 · M2-2

<!-- pregunta: js_2026#2 | just:7a73df2e053d -->

¿Cuál selector CSS posee mayor especificidad entre un ID, una clase, un elemento y un pseudo-elemento?

- `(a)` El selector de elementos básicos.
- `(b)` El selector de clases y atributos.
- `(c)` El selector de identificadores (ID).  **← correcta**
- `(d)` El selector de pseudo-elementos.

<!-- justificacion:inicio -->
En el cálculo de especificidad, los identificadores forman una categoría que pesa más que las clases, y las clases más que los elementos y pseudo-elementos. Un solo `#id` le gana a cualquier cantidad de clases.
<!-- justificacion:fin -->

- [x] Aprobada

### 42 · M2-3

<!-- pregunta: js_2026#3 | just:41a5dcba2482 -->

¿Qué regla CSS se utiliza para aplicar estilos condicionales basados en el ancho de la pantalla?

- `(a)` @media screen and (max-width: 768px)  **← correcta**
- `(b)` @responsive query min-width 768px
- `(c)` @viewport device-width = 768px
- `(d)` @screen layout condition (768px)

<!-- justificacion:inicio -->
`@media` es la regla que condiciona estilos a las características del dispositivo, y `max-width: 768px` los aplica desde ese ancho hacia abajo. Las otras tres son sintaxis inventada: no existen `@responsive`, `@viewport` con esa forma ni `@screen`.
<!-- justificacion:fin -->

- [x] Aprobada

### 43 · M2-4

<!-- pregunta: js_2026#4 | just:a0c7e5f3ff51 -->

En el sistema de grillas de Bootstrap, ¿en cuántas columnas iguales se divide por defecto una fila?

- `(a)` En 8 columnas flexibles.
- `(b)` En 12 columnas flexibles.  **← correcta**
- `(c)` En 10 columnas flexibles.
- `(d)` En 16 columnas flexibles.

<!-- justificacion:inicio -->
Bootstrap divide cada fila en 12 columnas, número elegido por ser divisible en mitades, tercios, cuartos y sextos sin decimales.
<!-- justificacion:fin -->

- [x] Aprobada

### 44 · M2-5

<!-- pregunta: js_2026#5 | just:7c17b5c75609 -->

¿Qué método nativo de JavaScript retorna el primer elemento que coincida con un selector CSS específico?

- `(a)` document.getElementById()
- `(b)` document.getElementsByClassName()
- `(c)` document.querySelector()  **← correcta**
- `(d)` document.querySelectorAll()

<!-- justificacion:inicio -->
`querySelector()` acepta cualquier selector CSS y devuelve el primer elemento que coincida, o `null` si no hay ninguno. `querySelectorAll()` devuelve todos, y los dos `getElement...` sólo buscan por id o por clase, sin admitir selectores compuestos.
<!-- justificacion:fin -->

- [x] Aprobada

### 45 · M2-6

<!-- pregunta: js_2026#6 | just:733e9ecdabe1 -->

¿Qué evento de JavaScript se dispara inmediatamente cuando un elemento HTML pierde el foco?

- `(a)` El evento blur  **← correcta**
- `(b)` El evento focus
- `(c)` El evento change
- `(d)` El evento input

<!-- justificacion:inicio -->
`blur` se dispara en cuanto el elemento pierde el foco, haya cambiado su valor o no. Es lo que lo separa de `change`, que además exige que el valor sea distinto del que tenía al recibir el foco.
<!-- justificacion:fin -->

- [x] Aprobada

### 46 · M2-7

<!-- pregunta: js_2026#7 | just:8afd1d88c58d -->

¿Cuál es el ámbito (scope) de una variable declarada con la palabra clave let dentro de un bloque?

- `(a)` Ámbito global en todo el documento script.
- `(b)` Ámbito de función dentro de la función padre.
- `(c)` Ámbito de bloque delimitado por llaves {}.  **← correcta**
- `(d)` Ámbito léxico accesible solo en el módulo.

<!-- justificacion:inicio -->
`let` tiene alcance de bloque: existe sólo entre las llaves donde se declaró, incluidas las de un `if` o un `for`. Es lo que la separa de `var`, que tiene alcance de función y se filtra fuera del bloque.
<!-- justificacion:fin -->

- [x] Aprobada

### 47 · M2-8

<!-- pregunta: js_2026#8 | just:9ae77e0ac7da -->

En jQuery, ¿qué método se utiliza para cambiar o extraer el contenido HTML interno de un elemento?

- `(a)` El método .text()
- `(b)` El método .html()  **← correcta**
- `(c)` El método .val()
- `(d)` El método .attr()

<!-- justificacion:inicio -->
`.html()` lee o reemplaza el contenido HTML interno del elemento, interpretando las etiquetas. `.text()` hace lo mismo pero tratando todo como texto plano, y `.val()` trabaja sobre el valor de los controles de formulario.
<!-- justificacion:fin -->

- [x] Aprobada

### 48 · M2-9

<!-- pregunta: js_2026#9 | just:e354befd2961 -->

¿Cómo se asocia un evento de clic a un botón utilizando la sintaxis estándar de la librería jQuery?

- `(a)` $("button").click(function() { })  **← correcta**
- `(b)` document.addEventListener("click")
- `(c)` $("button").onEvent("click")
- `(d)` jQuery.bindClick("button")

<!-- justificacion:inicio -->
`$("button").click(function() { })` es el atajo de jQuery para registrar un manejador de clic. La (b) es JavaScript nativo y además está incompleta, y las otras dos usan métodos que jQuery no tiene.
<!-- justificacion:fin -->

- [x] Aprobada

### 49 · M2-10

<!-- pregunta: js_2026#10 | just:41e4832ab106 -->

¿Qué comando de Git registra oficialmente los cambios preparados (staging) en el repositorio local?

- `(a)` git add .
- `(b)` git commit -m "mensaje"  **← correcta**
- `(c)` git push origin main
- `(d)` git status

<!-- justificacion:inicio -->
`git commit` toma lo que está en el área de preparación y lo registra en la historia del repositorio local. `git add` sólo prepara, `git push` envía al remoto lo ya confirmado, y `git status` no escribe nada.
<!-- justificacion:fin -->

- [x] Aprobada

### 50 · M2-11 · ⚠️ ORDEN FIJO

<!-- pregunta: js_2026#11 | just:3e142bab48ad -->

¿Qué comando de Git permite crear una nueva rama y cambiar a ella de manera simultánea?

- `(a)` git branch -n &lt;rama&gt;
- `(b)` git checkout -b &lt;rama&gt;
- `(c)` git switch --create &lt;rama&gt;
- `(d)` Ambas B y C son correctas.  **← correcta**

> **Esta pregunta no se baraja.** Su alternativa correcta nombra a las otras
> por su letra, así que mover las alternativas de sitio la deja sin sentido.
> Es la única del proyecto entero con esta marca.

<!-- justificacion:inicio -->
Los dos comandos crean la rama y se cambian a ella en un solo paso: `git checkout -b` es la forma clásica y `git switch --create` la moderna, que Git introdujo justamente para separar el cambio de rama de la restauración de archivos. Por eso la respuesta correcta es la que las reconoce a ambas, y por eso esta pregunta no se puede barajar: su alternativa (d) nombra a las otras dos por su letra.
<!-- justificacion:fin -->

- [x] Aprobada

### 51 · M2-12

<!-- pregunta: js_2026#12 | just:0fbcc887b680 -->

En GitHub, ¿qué propósito principal cumple la creación de un Pull Request (PR)?

- `(a)` Descargar código remoto al disco duro.
- `(b)` Solicitar la integración de ramas y revisión.  **← correcta**
- `(c)` Forzar el borrado de una rama en conflicto.
- `(d)` Sincronizar tags de versiones estables.

<!-- justificacion:inicio -->
Un Pull Request propone integrar una rama en otra y abre el espacio donde se revisa y comenta el cambio antes de fusionarlo. Es una función de la plataforma, no de Git: sirve para que la integración pase por una revisión.
<!-- justificacion:fin -->

- [x] Aprobada

### 52 · M2-13

<!-- pregunta: js_2026#13 | just:ab6fffad04c6 -->

¿Qué sucede cuando Git detecta modificaciones concurrentes en la misma línea durante una unión?

- `(a)` Sobrescribe automáticamente el archivo nuevo.
- `(b)` Genera un conflicto que requiere edición manual.  **← correcta**
- `(c)` Cancela la operación y elimina el repositorio.
- `(d)` Crea un branch temporal de respaldo oculto.

<!-- justificacion:inicio -->
Cuando dos ramas modifican la misma línea, Git no puede decidir cuál gana: marca el conflicto dentro del archivo y detiene la fusión hasta que alguien lo resuelva a mano. No sobrescribe ni descarta nada por su cuenta.
<!-- justificacion:fin -->

- [x] Aprobada

---

## Lo que este documento no puede decidir

- **Si las justificaciones son ciertas.** Que existan se comprueba con un
  programa; que sean correctas no. Por eso las lees tú.
- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería
  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.
  Si la quieres, es una pasada editorial aparte.

