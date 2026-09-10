# Justificaciones del módulo 4 · para revisar

**Lote:** 61 preguntas · **Redactadas:** 2026-09-10 por Claude Code

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

### 01 · m04#1

<!-- pregunta: json_2026#1 | just:8983643b15a4 -->

¿Qué pilar de POO oculta el estado interno de un objeto y exige métodos para alterarlo?

- `(a)` Herencia múltiple.
- `(b)` Encapsulamiento.  **← correcta**
- `(c)` Polimorfismo.
- `(d)` Abstracción estructural.

<!-- justificacion:inicio -->
El encapsulamiento es el pilar que esconde el estado interno y obliga a pasar por métodos para tocarlo, de modo que el objeto controla cómo se lo modifica. Los otros tres existen y hacen otra cosa: el polimorfismo permite que objetos distintos respondan al mismo método, la abstracción expone qué hace algo y esconde cómo, y la herencia múltiple ni siquiera es de JavaScript — un objeto hereda de un solo prototipo.
<!-- justificacion:fin -->

- [x] Aprobada

### 02 · m04#2

<!-- pregunta: json_2026#2 | just:2cff3ea8b783 -->

En JS pre-ES6, ¿qué mecanismo emula la herencia de clases tradicional?

- `(a)` La cadena de prototipos (prototype chain).  **← correcta**
- `(b)` Clases abstractas puras.
- `(c)` Mixins estáticos globales.
- `(d)` Mutación directa de la memoria base.

<!-- justificacion:inicio -->
Antes de ES6 no había clases, y la herencia se armaba con la cadena de prototipos: cada objeto guarda un enlace a otro, y al pedir una propiedad que no tiene, el motor sube por esa cadena hasta encontrarla o llegar a `null`. Las clases de ES6 no cambiaron eso: son azúcar sintáctico sobre el mismo mecanismo. Las otras tres nombran cosas que JavaScript no tiene: clases abstractas puras, mixins estáticos globales, y desde luego no se manipula la memoria a mano.
<!-- justificacion:fin -->

- [x] Aprobada

### 03 · m04#3

<!-- pregunta: json_2026#3 | just:5202aaeedb60 -->

¿Qué método convierte un objeto literal de JavaScript a una cadena de texto en formato JSON?

- `(a)` JSON.parse()
- `(b)` Object.toJSON()
- `(c)` JSON.stringify()  **← correcta**
- `(d)` String.fromJSON()

<!-- justificacion:inicio -->
`JSON.stringify()` convierte un valor de JavaScript a texto en formato JSON. El que va en la dirección contraria es `JSON.parse()`, que es la (a) y el par con el que siempre se confunde: uno serializa y el otro interpreta. `Object.toJSON()` y `String.fromJSON()` no existen. Conviene recordar que `stringify` **descarta** las funciones y las propiedades `undefined`, lo que enlaza con la pregunta sobre qué tipos admite JSON.
<!-- justificacion:fin -->

- [x] Aprobada

### 04 · m04#4

<!-- pregunta: json_2026#4 | just:2f1c8ea1bc0a -->

¿Qué restricción estricta de sintaxis aplica al estándar JSON que difiere de objetos JS?

- `(a)` Las claves deben estar obligatoriamente entre comillas dobles.  **← correcta**
- `(b)` Permite comentarios multi-línea con la sintaxis /* */.
- `(c)` Admite funciones como valores de las propiedades.
- `(d)` Las claves no requieren comillas si son alfanuméricas.

<!-- justificacion:inicio -->
En JSON las claves van **siempre** entre comillas dobles: `{"nombre": "Ana"}`. Los objetos de JavaScript son más laxos —admiten claves sin comillas y con comillas simples—, y esa diferencia es la fuente del error más común al escribir JSON a mano. Las otras tres describen permisos que JSON no da: no admite comentarios, no admite funciones como valores, y no perdona las claves sin comillas aunque sean alfanuméricas.
<!-- justificacion:fin -->

- [x] Aprobada

### 05 · m04#5

<!-- pregunta: json_2026#5 | just:be9897d9caff -->

En POO, ¿qué término define a una entidad concreta creada a partir de una clase plantilla?

- `(a)` Prototipo.
- `(b)` Interfaz.
- `(c)` Método estático.
- `(d)` Instancia.  **← correcta**

<!-- justificacion:inicio -->
Una instancia es el objeto concreto que se crea a partir de una clase: la clase es el plano y la instancia es la casa construida. Un prototipo es el objeto del que se hereda, no lo que se construye; una interfaz describe un contrato y JavaScript no las tiene como constructo del lenguaje; y un método estático pertenece a la clase y no a los objetos que salen de ella.
<!-- justificacion:fin -->

- [x] Aprobada

### 06 · m04#7

<!-- pregunta: json_2026#7 | just:2679ce5ba8d0 -->

Al instanciar un objeto con `new`, ¿qué función especial de la clase se ejecuta primero?

- `(a)` render()
- `(b)` init()
- `(c)` constructor()  **← correcta**
- `(d)` super()

<!-- justificacion:inicio -->
El `constructor()` es lo primero que corre al usar `new`: recibe los argumentos y prepara el objeto. `super()` también corre pronto, pero **dentro** del constructor y solo cuando hay herencia — y ahí hay una regla que conviene saber: si la clase extiende a otra, hay que llamar a `super()` antes de usar `this`. `render()` e `init()` no son nada del lenguaje; son convenciones de bibliotecas.
<!-- justificacion:fin -->

- [x] Aprobada

### 07 · m04#8

<!-- pregunta: json_2026#8 | just:9ba80b38b6d3 -->

En notación literal de objetos JS, ¿cómo defines un método interno correctamente?

- `(a)` method: function() {}  **← correcta**
- `(b)` function method() {}
- `(c)` method =&gt; {}
- `(d)` def method() {}

<!-- justificacion:inicio -->
En notación literal, un método es una propiedad cuyo valor es una función: `metodo: function() {}`. La (b) es la sintaxis de una función suelta y no cabe dentro de un objeto literal; la (c) confunde la flecha con la asignación, y la (d) es de Python. Desde ES6 existe además la forma abreviada `metodo() {}`, que significa exactamente lo mismo y es la que se ve hoy en el código nuevo.
<!-- justificacion:fin -->

- [x] Aprobada

### 08 · m04#9

<!-- pregunta: json_2026#9 | just:c04702e98471 -->

¿Qué tipo de dato nativo JS no es válido para ser almacenado en una estructura JSON?

- `(a)` Booleano (true/false).
- `(b)` Número (enteros o flotantes).
- `(c)` Array (lista de elementos).
- `(d)` Función o método.  **← correcta**

<!-- justificacion:inicio -->
JSON no tiene tipo función, así que una función no se puede guardar en él. `JSON.stringify()` no falla al encontrarse una: **la omite en silencio**, que es peor que fallar, porque el objeto viaja incompleto sin que nadie avise. Los otros tres —booleanos, números y arreglos— son tipos que JSON admite sin problema, junto con cadenas, objetos y `null`.
<!-- justificacion:fin -->

- [x] Aprobada

### 09 · m04#10

<!-- pregunta: json_2026#10 | just:8b0adec9068d -->

En el prototipo de JS, ¿qué propiedad apunta al objeto del cual hereda sus métodos base?

- `(a)` __super__
- `(b)` __proto__  **← correcta**
- `(c)` baseObject
- `(d)` parentClass

<!-- justificacion:inicio -->
`__proto__` es la propiedad que apunta al objeto del que se hereda, y recorrerla es recorrer la cadena de prototipos. Las otras tres no existen. Conviene saber que hoy `__proto__` está desaconsejada aunque siga funcionando: lo recomendado es `Object.getPrototypeOf(obj)` para leerla y `Object.setPrototypeOf()` para cambiarla, y que no se confunde con `prototype`, que es otra cosa y vive en las funciones constructoras.
<!-- justificacion:fin -->

- [x] Aprobada

### 10 · m04#11

<!-- pregunta: json_2026#11 | just:f70283631a06 -->

¿Qué característica fundamental diferencia a `let` frente a `var` en su ámbito de alcance?

- `(a)` let tiene alcance global exclusivo.
- `(b)` let posee alcance limitado al bloque (block scope).  **← correcta**
- `(c)` let no permite cambiar el tipo de dato asignado.
- `(d)` var se destruye automáticamente al salir de la función.

<!-- justificacion:inicio -->
`let` tiene alcance de **bloque**: existe dentro de las llaves donde se declaró y desaparece al salir, así que un `let` dentro de un `if` o un `for` no se ve fuera. `var` tiene alcance de función, que es más ancho y la causa de muchos errores con contadores de ciclos. Las otras tres son falsas: `let` no es global, sí permite cambiar el tipo del valor, y `var` no desaparece al salir de un bloque.
<!-- justificacion:fin -->

- [x] Aprobada

### 11 · m04#12

<!-- pregunta: json_2026#12 | just:4a7849278087 -->

¿Qué ocurre si intentas reasignar un nuevo valor escalar a una variable definida con `const`?

- `(a)` Cambia el valor silenciosamente.
- `(b)` Ignora el cambio manteniendo el primer valor.
- `(c)` Lanza un TypeError crítico deteniendo la ejecución.  **← correcta**
- `(d)` Retorna false en la operación de asignación.

<!-- justificacion:inicio -->
Reasignar una variable declarada con `const` lanza un `TypeError`. Es un error de verdad, no un aviso: la asignación no ocurre y, si nadie lo atrapa, corta la ejecución de ese script. Ojo con el alcance de la protección, que es lo que más se confunde: `const` protege **el identificador**, no el contenido. Sobre un objeto declarado con `const` se pueden agregar, cambiar y borrar propiedades; lo que falla es apuntarlo a otro objeto.
<!-- justificacion:fin -->

- [x] Aprobada

### 12 · m04#13

<!-- pregunta: json_2026#13 | just:7bbf3c19b322 -->

¿Qué comportamiento léxico particular tienen las Arrow Functions (`=>`) respecto a `this`?

- `(a)` Heredan `this` del contexto de ejecución circundante.  **← correcta**
- `(b)` Tienen su propio `this` inmutable.
- `(c)` Apuntan siempre al objeto global `window`.
- `(d)` Generan un error si se invoca `this` en su interior.

<!-- justificacion:inicio -->
Las funciones flecha no tienen `this` propio: usan el del contexto donde fueron escritas. Por eso resuelven el problema clásico de perder `this` dentro de un callback, y por eso **no sirven como métodos de un objeto** cuando se espera que `this` apunte a ese objeto. Es un comportamiento léxico —lo decide dónde está escrita la función, no cómo se la llama— y es la diferencia práctica más importante frente a `function`.
<!-- justificacion:fin -->

- [x] Aprobada

### 13 · m04#14

<!-- pregunta: json_2026#14 | just:6994b4a3f50b -->

¿Qué operador ES6 permite desestructurar un arreglo y agrupar el resto de sus elementos?

- `(a)` Operador Spread (...).
- `(b)` Operador Rest (...).  **← correcta**
- `(c)` Operador In (in).
- `(d)` Nullish Coalescing (??).

<!-- justificacion:inicio -->
El operador rest agrupa lo que sobra en un arreglo nuevo: `const [primero, ...resto] = lista`. Comparte los tres puntos con el spread y por eso se confunden, pero hacen lo contrario: **rest recoge y spread reparte**. Lo que decide cuál es cuál es la posición — a la izquierda de una asignación o en los parámetros de una función, recoge; dentro de un arreglo, un objeto o una llamada, reparte.
<!-- justificacion:fin -->

- [x] Aprobada

### 14 · m04#15

<!-- pregunta: json_2026#15 | just:2359f1abe834 -->

En clases ES6, ¿qué palabra clave invoca al constructor de la clase padre al usar herencia?

- `(a)` parent()
- `(b)` extends()
- `(c)` super()  **← correcta**
- `(d)` base()

<!-- justificacion:inicio -->
`super()` llama al constructor de la clase padre, y hay que invocarlo antes de usar `this` en una clase que extiende a otra. `extends` existe pero es la palabra que declara la herencia en la cabecera de la clase, no una función que se invoque; `parent()` y `base()` no son nada de JavaScript. `super` también sirve para llamar métodos del padre desde un método propio: `super.metodo()`.
<!-- justificacion:fin -->

- [x] Aprobada

### 15 · m04#16

<!-- pregunta: json_2026#16 | just:df8d56eb60d7 -->

¿Qué mecanismo en ES6 permite expandir elementos de un arreglo dentro de otro arreglo nuevo?

- `(a)` Array.concat()
- `(b)` Destructuring.
- `(c)` Operador Spread (...).  **← correcta**
- `(d)` String Interpolation.

<!-- justificacion:inicio -->
El operador spread expande los elementos de un arreglo dentro de otro: `[...a, ...b]`. `Array.concat()` consigue un resultado parecido y por eso es un buen distractor, pero la pregunta es por el mecanismo de ES6. Ojo con un límite que importa: el spread hace una copia **superficial**, así que los objetos de dentro se siguen compartiendo entre el arreglo viejo y el nuevo.
<!-- justificacion:fin -->

- [x] Aprobada

### 16 · m04#17

<!-- pregunta: json_2026#17 | just:34d4e52e2a45 -->

¿Cómo se define correctamente un método estático dentro de una clase en ES6?

- `(a)` static nombreMetodo() {}  **← correcta**
- `(b)` const nombreMetodo = () =&gt; {}
- `(c)` function static nombreMetodo() {}
- `(d)` @static nombreMetodo() {}

<!-- justificacion:inicio -->
Un método estático se declara anteponiendo `static` al nombre, y pertenece a la clase y no a sus instancias: se invoca como `Clase.metodo()` y no desde un objeto creado con `new`. La (b) define una propiedad con una función flecha, que no es lo mismo; la (c) mezcla dos sintaxis que no se combinan; y la (d) usa un decorador, que no es JavaScript estándar.
<!-- justificacion:fin -->

- [x] Aprobada

### 17 · m04#18

<!-- pregunta: json_2026#18 | just:341024ea9ecf -->

¿Qué palabra clave se usa en un módulo ES6 para exponer una función y usarla en otro archivo?

- `(a)` expose
- `(b)` module.exports
- `(c)` export  **← correcta**
- `(d)` include

<!-- justificacion:inicio -->
`export` es la palabra de los módulos ES6 para exponer algo a otro archivo. `module.exports` es la forma de CommonJS, la de Node antes de los módulos ES, y por eso es el distractor que separa los dos sistemas — que no se mezclan en el mismo archivo. `expose` e `include` no existen. En este proyecto se usa `export`, porque las páginas cargan sus scripts con `type="module"`.
<!-- justificacion:fin -->

- [x] Aprobada

### 18 · m04#19

<!-- pregunta: json_2026#19 | just:244756ade5dd -->

¿Cuál es la sintaxis correcta para importar un módulo exportado por defecto en ES6?

- `(a)` import { Modulo } from './archivo.js';
- `(b)` import Modulo from './archivo.js';  **← correcta**
- `(c)` require('./archivo.js');
- `(d)` fetch('./archivo.js').import;

<!-- justificacion:inicio -->
Lo exportado por defecto se importa sin llaves y con el nombre que uno quiera: `import Modulo from './archivo.js'`. Con llaves, la (a), se importan las exportaciones **nombradas**, y ahí el nombre sí tiene que coincidir. `require()` es de CommonJS. Un archivo puede tener una sola exportación por defecto y todas las nombradas que quiera.
<!-- justificacion:fin -->

- [x] Aprobada

### 19 · m04#20

<!-- pregunta: json_2026#20 | just:d6aebea3a552 -->

¿Qué ventaja principal ofrece la interpolación de strings mediante template literals (` `)?

- `(a)` Cifra el texto automáticamente.
- `(b)` Ejecuta expresiones JS complejas incrustadas con ${}.  **← correcta**
- `(c)` Convierte strings a números de forma nativa.
- `(d)` Compila el texto a binario para mayor velocidad.

<!-- justificacion:inicio -->
Dentro de una plantilla literal, `${...}` evalúa cualquier expresión de JavaScript y pega su resultado en el texto: no solo variables, también llamadas a funciones y operaciones. La segunda ventaja, que la pregunta no menciona, es que el texto puede ocupar varias líneas sin escapar nada. Las otras tres prometen cosas que no ocurren: no cifra, no convierte a número y no compila a binario.
<!-- justificacion:fin -->

- [x] Aprobada

### 20 · m04#21

<!-- pregunta: json_2026#21 | just:5bfd8547e523 -->

¿Qué representa la estructura subyacente jerárquica del DOM (Document Object Model)?

- `(a)` Un arreglo lineal de cadenas HTML.
- `(b)` Un árbol de nodos de objetos accesibles mediante JS.  **← correcta**
- `(c)` Un documento XML estático y no mutable.
- `(d)` Una base de datos relacional del lado del cliente.

<!-- justificacion:inicio -->
El DOM es un árbol de nodos: el documento es la raíz y cada etiqueta, atributo y trozo de texto es un nodo con sus hijos. Esa forma es lo que permite recorrerlo, buscar dentro y modificarlo desde JavaScript. No es una lista plana de cadenas de HTML —esa es la vista del código fuente, no la del documento cargado— ni es estático ni es una base de datos.
<!-- justificacion:fin -->

- [x] Aprobada

### 21 · m04#22

<!-- pregunta: json_2026#22 | just:1c91b4a11e0e -->

¿Qué método estándar de JS añade un nuevo nodo hijo al final de un elemento padre en el DOM?

- `(a)` appendChild()  **← correcta**
- `(b)` insertAfter()
- `(c)` addChild()
- `(d)` pushNode()

<!-- justificacion:inicio -->
`appendChild()` agrega un nodo como último hijo del elemento sobre el que se lo llama. Las otras tres no existen con esos nombres. Vale la pena conocer a sus vecinos reales: `insertBefore()` coloca antes de un nodo concreto, y los modernos `append()`, `prepend()`, `before()` y `after()` admiten además texto suelto y varios nodos a la vez.
<!-- justificacion:fin -->

- [x] Aprobada

### 22 · m04#23

<!-- pregunta: json_2026#23 | just:fde5a3eb513e -->

En la fase de captura de eventos del DOM, ¿en qué dirección se propaga el evento?

- `(a)` Desde el elemento objetivo hacia la raíz del documento.
- `(b)` Desde la raíz del documento hacia el elemento objetivo.  **← correcta**
- `(c)` Solo se ejecuta en los nodos hermanos adyacentes.
- `(d)` El evento no se propaga, permanece estático en el nodo.

<!-- justificacion:inicio -->
La captura va **desde la raíz hacia el elemento objetivo**: el evento baja por el árbol antes de llegar a su destino. Es la primera de las tres fases —captura, destino y burbujeo— y es la menos usada, porque `addEventListener` escucha en burbujeo salvo que se le pase `true` o `{ capture: true }`. La (a) describe el burbujeo, que es el camino de vuelta.
<!-- justificacion:fin -->

- [x] Aprobada

### 23 · m04#25

<!-- pregunta: json_2026#25 | just:aaee5ade5232 -->

Si se asignan varios manejadores al mismo evento en un nodo con `addEventListener`, ¿qué pasa?

- `(a)` El último manejador sobreescribe a todos los anteriores.
- `(b)` Se ejecutan todos los manejadores en orden de registro.  **← correcta**
- `(c)` Genera un error de duplicidad de eventos.
- `(d)` Solo se ejecuta el primero, bloqueando los subsiguientes.

<!-- justificacion:inicio -->
Se ejecutan todos, en el orden en que se registraron. Ésa es una de las razones de ser de `addEventListener` frente a asignar `onclick`, que sí se sobrescribe: con `onclick` solo sobrevive el último manejador. No hay error de duplicidad, y ninguno bloquea a los siguientes — salvo que uno llame a `stopImmediatePropagation()`, que es lo único que corta la lista.
<!-- justificacion:fin -->

- [x] Aprobada

### 24 · m04#26

<!-- pregunta: json_2026#26 | just:1933d070a0b9 -->

¿Qué propiedad del objeto evento (Event) identifica el nodo exacto que originó dicho evento?

- `(a)` event.currentTarget
- `(b)` event.source
- `(c)` event.target  **← correcta**
- `(d)` event.nodeOrigin

<!-- justificacion:inicio -->
`event.target` es el nodo donde el evento se originó de verdad. Se distingue de `event.currentTarget`, que es el elemento en el que está puesto el manejador y que es la (a): en un manejador delegado sobre un contenedor, `currentTarget` es el contenedor y `target` es el hijo que recibió el clic. Esa diferencia es exactamente lo que hace posible la delegación de eventos.
<!-- justificacion:fin -->

- [x] Aprobada

### 25 · m04#27

<!-- pregunta: json_2026#27 | just:c88f4834634f -->

¿Qué método detiene la propagación (burbujeo) de un evento hacia sus nodos padres en el DOM?

- `(a)` event.preventDefault()
- `(b)` event.stopPropagation()  **← correcta**
- `(c)` event.cancelBubble()
- `(d)` event.stopBouncing()

<!-- justificacion:inicio -->
`stopPropagation()` corta el viaje del evento hacia los nodos padres. No se confunde con `preventDefault()`, que es la (a) y cancela la acción por omisión del navegador —enviar el formulario, seguir el enlace— sin detener la propagación: son dos cosas independientes y a veces se usan juntas. `cancelBubble` existe como propiedad heredada de Internet Explorer, pero no como método, y `stopBouncing()` no existe.
<!-- justificacion:fin -->

- [x] Aprobada

### 26 · m04#28

<!-- pregunta: json_2026#28 | just:fba45fac4275 -->

Para modificar las clases CSS de un nodo de forma segura y dinámica, ¿qué propiedad usarías?

- `(a)` node.className
- `(b)` node.classList  **← correcta**
- `(c)` node.style
- `(d)` node.cssProperties

<!-- justificacion:inicio -->
`classList` da una interfaz pensada para esto —`add()`, `remove()`, `toggle()`, `contains()`— y toca una sola clase sin pisar las demás. `className` es la (a) y es la forma antigua: guarda todas las clases en una cadena, así que asignarle un valor **borra las que ya estaban**, y ése es el «de forma segura» que la pregunta pide. `style` cambia estilos en línea, no clases.
<!-- justificacion:fin -->

- [x] Aprobada

### 27 · m04#29

<!-- pregunta: json_2026#29 | just:1b28d473e788 -->

¿Qué evento ocurre cuando el DOM inicial HTML es cargado y parseado completamente?

- `(a)` window.onload
- `(b)` document.onready
- `(c)` DOMContentLoaded  **← correcta**
- `(d)` HTMLParsedEvent

<!-- justificacion:inicio -->
`DOMContentLoaded` se dispara cuando el HTML terminó de parsearse y el árbol está armado, sin esperar imágenes ni hojas de estilo. `window.onload`, la (a), espera además a que todos esos recursos carguen, así que llega bastante después: es el par que hay que saber distinguir. `document.onready` no existe en JavaScript nativo — es de jQuery, `$(document).ready()` —, y `HTMLParsedEvent` no existe en ninguna parte.
<!-- justificacion:fin -->

- [x] Aprobada

### 28 · m04#30

<!-- pregunta: json_2026#30 | just:ab8f6d006229 -->

¿Qué método altera dinámicamente el contenido de texto de un nodo omitiendo etiquetas HTML?

- `(a)` innerHTML
- `(b)` outerHTML
- `(c)` textContent  **← correcta**
- `(d)` value

<!-- justificacion:inicio -->
`textContent` trata lo que se le da como texto plano, así que las etiquetas se ven tal cual en vez de interpretarse. `innerHTML` sí las interpreta, y por eso es la (a) y es la puerta de entrada de los ataques XSS cuando el texto viene de fuera. En este proyecto esa distinción no es teórica: el banco de preguntas es contenido de origen externo y todo lo que se pinta con `innerHTML` pasa antes por una función de escapado.
<!-- justificacion:fin -->

- [x] Aprobada

### 29 · m04#31

<!-- pregunta: json_2026#31 | just:0e974aa5de30 -->

¿Por qué JavaScript es considerado un lenguaje de un único hilo (single-threaded) por diseño?

- `(a)` Porque solo tiene un call stack para procesar instrucciones.  **← correcta**
- `(b)` Porque no permite ejecutar ciclos repetitivos continuos.
- `(c)` Porque compila su código en una sola pasada.
- `(d)` Porque restringe la ejecución a un único archivo fuente.

<!-- justificacion:inicio -->
JavaScript tiene un solo call stack, así que ejecuta una instrucción a la vez y nada corre en paralelo dentro de él. Lo que da la impresión de simultaneidad es que las operaciones lentas —red, temporizadores— las atiende el entorno por fuera y devuelve sus callbacks a una cola, que es de lo que se ocupa el bucle de eventos. Las otras tres describen limitaciones inventadas: sí hay ciclos, sí hay varios archivos.
<!-- justificacion:fin -->

- [x] Aprobada

### 30 · m04#32

<!-- pregunta: json_2026#32 | just:638553e19b7d -->

En el contexto del Event Loop, ¿qué componente encola los callbacks de operaciones asíncronas?

- `(a)` El Call Stack (pila de llamadas).
- `(b)` El Memory Heap (montículo).
- `(c)` La Callback Queue (cola de tareas).  **← correcta**
- `(d)` El motor de renderizado CSS.

<!-- justificacion:inicio -->
La cola de callbacks es donde esperan los callbacks de las operaciones asíncronas ya terminadas, hasta que el call stack se vacía y el bucle de eventos los pasa a ejecutar. Las otras dos piezas de la lista son reales y tienen otro oficio: el call stack ejecuta, y el montículo guarda los objetos. Conviene saber que las promesas usan una cola aparte y con prioridad, la de microtareas, que se vacía antes que ésta.
<!-- justificacion:fin -->

- [x] Aprobada

### 31 · m04#34

<!-- pregunta: json_2026#34 | just:4360e0f391d1 -->

¿Qué estados fundamentales posee una Promesa en JavaScript durante su ciclo de vida lógico?

- `(a)` Started, Processing, Finished.
- `(b)` Pending, Fulfilled, Rejected.  **← correcta**
- `(c)` Awaiting, Resolved, Catching.
- `(d)` Null, Truthy, Falsy.

<!-- justificacion:inicio -->
Una promesa está `pending` mientras la operación no termina, y de ahí pasa a `fulfilled` si salió bien o a `rejected` si falló. Ese paso ocurre **una sola vez** y es definitivo: una promesa resuelta no vuelve atrás ni cambia de valor. Se oye además la palabra `settled`, que no es un cuarto estado sino el nombre de «ya no está pendiente», o sea cumplida o rechazada.
<!-- justificacion:fin -->

- [x] Aprobada

### 32 · m04#35

<!-- pregunta: json_2026#35 | just:0c34102d0f61 -->

¿Qué método de una Promesa se ejecuta siempre, sin importar si fue resuelta o rechazada?

- `(a)` .then()
- `(b)` .catch()
- `(c)` .finally()  **← correcta**
- `(d)` .all()

<!-- justificacion:inicio -->
`.finally()` corre pase lo que pase, y sirve para lo que hay que hacer en los dos casos: cerrar una conexión, quitar un indicador de carga. No recibe el valor ni el error, justamente porque no sabe cuál de los dos ocurrió. `.then()` atiende el éxito, `.catch()` el fallo, y `.all()` ni siquiera es un método de la instancia sino de `Promise`.
<!-- justificacion:fin -->

- [x] Aprobada

### 33 · m04#36

<!-- pregunta: json_2026#36 | just:e35c9ff909a1 -->

Al encadenar bloques `.then()`, ¿qué debe retornar el bloque actual para pasarlo al siguiente?

- `(a)` Obligatoriamente una nueva Promesa.
- `(b)` Un valor procesado o una nueva Promesa.  **← correcta**
- `(c)` El mismo evento capturado.
- `(d)` Una función callback anidada.

<!-- justificacion:inicio -->
Lo que devuelve un `.then()` se convierte en el valor que recibe el siguiente. Si devuelve un valor corriente, se pasa tal cual; si devuelve una promesa, la cadena **espera** a que se resuelva y pasa su resultado. Esa segunda regla es la que permite encadenar operaciones asíncronas en vertical en vez de anidarlas. Y hay una trampa muy común: si el bloque no devuelve nada, el siguiente recibe `undefined`.
<!-- justificacion:fin -->

- [x] Aprobada

### 34 · m04#37

<!-- pregunta: json_2026#37 | just:ab237c32849e -->

Si usas la palabra clave `await` dentro de una función, ¿qué requisito debe tener esa función?

- `(a)` Estar declarada como `async`.  **← correcta**
- `(b)` Ser un método estático de una clase.
- `(c)` Estar dentro de un bloque try-catch estructural.
- `(d)` Retornar estrictamente un valor primitivo booleano.

<!-- justificacion:inicio -->
`await` solo se puede usar dentro de una función declarada `async`; fuera de ella es un error de sintaxis. La (c) suena razonable y es falsa: el `try/catch` es recomendable para atrapar el fallo, pero no es requisito para que `await` funcione. Conviene saber que desde ES2022 los módulos admiten `await` en el nivel superior, sin función que lo envuelva — pero solo en módulos, y la pregunta habla de una función.
<!-- justificacion:fin -->

- [x] Aprobada

### 35 · m04#38

<!-- pregunta: json_2026#38 | just:3526001fda4e -->

¿Qué bloque atrapa correctamente una Promesa rechazada dentro de una función `async`?

- `(a)` Un bloque .catch() encadenado.
- `(b)` Una estructura try / catch estándar.  **← correcta**
- `(c)` Una declaración if(error) throw.
- `(d)` El objeto global window.onerror.

<!-- justificacion:inicio -->
Dentro de una función `async`, un `await` sobre una promesa rechazada lanza como si fuera una excepción corriente, así que se atrapa con `try/catch`. Ésa es la forma idiomática y la razón de ser de la sintaxis: el manejo de errores del código asíncrono vuelve a ser el de siempre. Conviene saber que el `.catch()` encadenado tampoco es un error —`await promesa.catch(...)` recoge el rechazo igual—, pero mezcla los dos estilos en la misma línea y se lee peor. Las otras dos alternativas sí son falsas: un `if(error) throw` no atrapa nada, y `window.onerror` no ve los rechazos de promesas.
<!-- justificacion:fin -->

- [x] Aprobada

### 36 · m04#39

<!-- pregunta: json_2026#39 | just:55e1b578515a -->

¿Qué método procesa un array de Promesas y falla si al menos una de las Promesas es rechazada?

- `(a)` Promise.race()
- `(b)` Promise.allSettled()
- `(c)` Promise.any()
- `(d)` Promise.all()  **← correcta**

<!-- justificacion:inicio -->
`Promise.all()` espera a que todas se cumplan y falla en cuanto una se rechaza, descartando el resto de los resultados. Es lo que se quiere cuando todas las piezas son necesarias. Las otras tres existen y tienen otra política: `race()` devuelve la primera que se resuelva o rechace, `any()` la primera que se **cumpla** ignorando los rechazos, y `allSettled()` espera a todas y no falla nunca — informa qué pasó con cada una.
<!-- justificacion:fin -->

- [x] Aprobada

### 37 · m04#40

<!-- pregunta: json_2026#40 | just:19f8f054e2bc -->

¿Qué retorna intrínsecamente cualquier función que ha sido declarada con el prefijo `async`?

- `(a)` El valor evaluado final, pero bloqueando el proceso principal.
- `(b)` Una nueva función generadora asíncrona.
- `(c)` Siempre retorna una Promesa implícita resolviendo su valor.  **← correcta**
- `(d)` El tipo de dato devuelto por la sentencia return.

<!-- justificacion:inicio -->
Una función `async` devuelve siempre una promesa, aunque su `return` sea un número. Si devuelve un valor corriente, la promesa se cumple con ese valor; si lanza, se rechaza con el error. De ahí se sigue algo que conviene tener claro: llamarla sin `await` no da el valor, da la promesa. Y no bloquea el hilo principal — eso es justo lo que `async/await` viene a evitar.
<!-- justificacion:fin -->

- [x] Aprobada

### 38 · m04#41

<!-- pregunta: json_2026#41 | just:8bcfd238f6f8 -->

En la API XHR (XMLHttpRequest), ¿qué estado numérico del `readyState` indica éxito completo?

- `(a)` 1 (Opened)
- `(b)` 2 (Headers_Received)
- `(c)` 3 (Loading)
- `(d)` 4 (Done)  **← correcta**

<!-- justificacion:inicio -->
`readyState` recorre los valores 0 a 4, y el 4 —`DONE`— es el único que indica que el intercambio terminó. Ahora bien, **terminar no es lo mismo que salir bien**, y ésa es la distinción que hay que llevarse: una respuesta 404 o 500 llega igual con `readyState` 4. Para saber si hubo éxito se mira aparte `xhr.status`, comprobando que esté entre 200 y 299. El patrón completo es comprobar las dos cosas: primero que `readyState` sea 4, y recién entonces qué dice `status`.
<!-- justificacion:fin -->

- [x] Aprobada

### 39 · m04#42

<!-- pregunta: json_2026#42 | just:0b0d05236ef2 -->

Al realizar una petición con XHR, ¿qué evento detecta cambios en el estado de la comunicación?

- `(a)` onstatechange
- `(b)` onreadystatechange  **← correcta**
- `(c)` onloadend
- `(d)` onprogress

<!-- justificacion:inicio -->
`onreadystatechange` es el manejador que XHR llama cada vez que cambia su `readyState`, y dentro de él se comprueba si ya llegó al 4. `onstatechange` no existe. `onloadend` y `onprogress` sí existen en la API moderna de XHR y por eso son buenos distractores, pero la pregunta apunta al mecanismo clásico, que es el que se ve en el material del examen.
<!-- justificacion:fin -->

- [x] Aprobada

### 40 · m04#43

<!-- pregunta: json_2026#43 | just:7f628a8a5a4b -->

¿Qué código de estado HTTP 2xx devuelve habitualmente una API REST al responder con éxito?

- `(a)` 200 OK
- `(b)` 201 Created
- `(c)` 204 No Content
- `(d)` Todos los anteriores según la acción.  **← correcta**

<!-- justificacion:inicio -->
Los tres son códigos 2xx y una API REST usa cada uno según lo que hizo: `200 OK` para una lectura o una operación con cuerpo de respuesta, `201 Created` cuando se creó un recurso, y `204 No Content` cuando la operación salió bien y no hay nada que devolver — típico de un borrado. La respuesta es «todos», y lo que la pregunta evalúa es saber que el éxito no es un solo código.
<!-- justificacion:fin -->

- [x] Aprobada

### 41 · m04#44

<!-- pregunta: json_2026#44 | just:e48eb60c0b56 -->

En contraposición a XHR, ¿qué estructura retorna por defecto el método `fetch()` en JavaScript?

- `(a)` Un objeto XMLHttpRequest instanciado.
- `(b)` Una Promesa (Promise).  **← correcta**
- `(c)` Un callback asíncrono puro.
- `(d)` Un stream de datos binarios bloqueantes.

<!-- justificacion:inicio -->
`fetch()` devuelve una promesa, y ésa es su diferencia de fondo con XHR: se encadena con `.then()` o se espera con `await` en vez de registrar manejadores. Conviene recordar que hacen falta **dos** pasos asíncronos para llegar al dato: uno para la respuesta y otro para leer su cuerpo con `.json()`, que también devuelve una promesa.
<!-- justificacion:fin -->

- [x] Aprobada

### 42 · m04#45

<!-- pregunta: json_2026#45 | just:498d4cc71415 -->

Al usar `fetch()`, ¿qué método extrae el cuerpo de la respuesta asíncrona a un objeto JS?

- `(a)` response.toJSON()
- `(b)` response.parse()
- `(c)` response.json()  **← correcta**
- `(d)` response.objectify()

<!-- justificacion:inicio -->
`response.json()` lee el cuerpo de la respuesta y lo convierte en un objeto de JavaScript. Devuelve una promesa, así que hay que esperarla: es el segundo `await` del patrón. Sus hermanos son `text()`, `blob()` y `formData()`, según lo que venga. Y el cuerpo se puede leer **una sola vez**: intentarlo dos veces sobre la misma respuesta falla.
<!-- justificacion:fin -->

- [x] Aprobada

### 43 · m04#47

<!-- pregunta: json_2026#47 | just:099756e0b74e -->

¿Qué propiedad del objeto `Response` en `fetch()` indica si la solicitud HTTP fue un éxito (2xx)?

- `(a)` response.ok  **← correcta**
- `(b)` response.success
- `(c)` response.valid
- `(d)` response.statusText

<!-- justificacion:inicio -->
`response.ok` es `true` cuando el código está entre 200 y 299. Es la comprobación que hay que hacer siempre, porque `fetch` **no rechaza la promesa ante un error HTTP**: un 404 llega como respuesta cumplida con `ok` en falso. Las otras tres no existen, salvo `statusText`, que es un texto descriptivo y no un booleano.
<!-- justificacion:fin -->

- [x] Aprobada

### 44 · m04#48

<!-- pregunta: json_2026#48 | just:efc0aab0a33b -->

Para enviar datos POST mediante `fetch()`, ¿en qué parámetro incluyes el payload JSON?

- `(a)` headers
- `(b)` mode
- `(c)` body  **← correcta**
- `(d)` params

<!-- justificacion:inicio -->
El cuerpo de la petición va en `body`, y si son datos JSON hay que serializarlos antes con `JSON.stringify()`: `body` recibe texto, no un objeto. Junto a él van `method: 'POST'` y la cabecera `Content-Type`. `headers` lleva las cabeceras, `mode` controla el comportamiento respecto de CORS, y `params` no es una opción de `fetch`.
<!-- justificacion:fin -->

- [x] Aprobada

### 45 · m04#49

<!-- pregunta: json_2026#49 | just:753019fcf217 -->

¿Qué cabecera HTTP (header) debes enviar para avisarle a la API que envías formato JSON?

- `(a)` Accept: application/json
- `(b)` Content-Type: application/json  **← correcta**
- `(c)` Authorization: Bearer JSON
- `(d)` Data-Type: json

<!-- justificacion:inicio -->
`Content-Type: application/json` describe **lo que se está enviando**, y es lo que permite al servidor interpretar el cuerpo. Se confunde con `Accept`, la (a), que dice lo que se espera **recibir**: son direcciones opuestas y a veces se mandan las dos. Enviar JSON sin esa cabecera es una de las causas más frecuentes de que una API responda con un error de formato.
<!-- justificacion:fin -->

- [x] Aprobada

### 46 · m04#50

<!-- pregunta: json_2026#50 | just:82f76dbefa8b -->

¿Qué riesgo de seguridad ocurre al consumir APIs ajenas sin validación de origen permitida?

- `(a)` Ataques de Inyección SQL locales.
- `(b)` Fallas de XSS mutando el DOM.
- `(c)` Bloqueo CORS por políticas del mismo origen.  **← correcta**
- `(d)` Sobrecarga de memoria del Event Loop.

<!-- justificacion:inicio -->
Lo que ocurre es que el navegador **bloquea la respuesta** si el servidor ajeno no autoriza tu origen con sus cabeceras CORS. Conviene entender bien de qué lado está esto: CORS no es un ataque ni un agujero, es el navegador protegiendo al usuario, y por eso no se «desactiva» desde el código del cliente — se resuelve en el servidor que responde. Las otras tres nombran riesgos reales que no son éste.
<!-- justificacion:fin -->

- [x] Aprobada

### 47 · M4-1

<!-- pregunta: js_2026#1 | just:2176c343f7bc -->

¿Cómo implementa internamente JavaScript la herencia entre objetos sin usar la sintaxis de clases de ES6?

- `(a)` Copiando propiedades estáticas al instanciar.
- `(b)` Mediante la cadena de prototipos (prototype chain).  **← correcta**
- `(c)` A través de la clonación profunda de JSON.
- `(d)` Utilizando clases abstractas nativas.

<!-- justificacion:inicio -->
JavaScript hereda por prototipos: cada objeto guarda un enlace a otro, y las propiedades que no encuentra en sí mismo las busca subiendo por esa cadena. Las clases de ES6 no cambiaron el mecanismo, solo le dieron una sintaxis familiar. Las otras tres describen técnicas que no son la herencia del lenguaje: copiar propiedades es composición, clonar con JSON produce objetos sueltos sin cadena, y no hay clases abstractas nativas.
<!-- justificacion:fin -->

- [x] Aprobada

### 48 · M4-2

<!-- pregunta: js_2026#2 | just:d74ca98adf37 -->

En formato JSON válido, ¿cuál es la regla estricta para escribir los nombres de las claves (keys)?

- `(a)` Pueden ir sin comillas si no contienen espacios.
- `(b)` Deben usar comillas simples exclusivamente.
- `(c)` Deben escribirse obligatoriamente con comillas dobles.  **← correcta**
- `(d)` Requieren notación de corchetes en cada atributo.

<!-- justificacion:inicio -->
Las claves de JSON van siempre entre comillas **dobles**. Las simples no valen —son legales en JavaScript pero no en JSON— y omitirlas tampoco, aunque la clave no tenga espacios. Es la regla que más se rompe al escribir JSON a mano, y el error que devuelve `JSON.parse()` suele señalar una posición y no la causa, así que conviene reconocerla de memoria.
<!-- justificacion:fin -->

- [x] Aprobada

### 49 · M4-3

<!-- pregunta: js_2026#3 | just:c206d5856b1b -->

¿Qué pilar de la POO permite que objetos de distintas clases respondan a una misma invocación de método?

- `(a)` Encapsulamiento
- `(b)` Herencia múltiple
- `(c)` Polimorfismo  **← correcta**
- `(d)` Abstracción estructural

<!-- justificacion:inicio -->
El polimorfismo es que objetos de clases distintas respondan al mismo mensaje, cada uno a su manera: llamar a `area()` sobre un círculo y sobre un cuadrado y que cada uno haga su cálculo. El encapsulamiento esconde el estado, la abstracción esconde el cómo, y la herencia múltiple no existe en JavaScript. En un lenguaje dinámico como éste el polimorfismo sale casi solo: basta con que el método exista.
<!-- justificacion:fin -->

- [x] Aprobada

### 50 · M4-4

<!-- pregunta: js_2026#4 | just:45c951647361 -->

¿Qué ocurre si declaramos una variable con let e intentamos acceder a ella antes de su inicialización?

- `(a)` Retorna undefined por defecto.
- `(b)` Lanza un ReferenceError por la Temporal Dead Zone.  **← correcta**
- `(c)` Asigna valor nulo hasta su primer uso en código.
- `(d)` Se eleva (hoisting) permitiendo su lectura temprana.

<!-- justificacion:inicio -->
Lanza un `ReferenceError`. La variable **sí** se eleva, pero queda en la zona muerta temporal —la Temporal Dead Zone— desde el inicio del bloque hasta su declaración, y tocarla ahí es un error. Es la diferencia práctica con `var`, que en esa situación devuelve `undefined` y deja pasar el problema. La (d) describe justamente el comportamiento de `var`, y por eso es el distractor que separa al que entiende el hoisting del que lo recita.
<!-- justificacion:fin -->

- [x] Aprobada

### 51 · M4-5

<!-- pregunta: js_2026#5 | just:24208a15c7e9 -->

¿Qué diferencia principal tiene una función flecha (arrow function) frente a una función tradicional?

- `(a)` Las funciones flecha no tienen su propio contexto 'this'.  **← correcta**
- `(b)` Retornan siempre un objeto JSON estructurado.
- `(c)` Obligan el uso de la palabra reservada 'function'.
- `(d)` Solo pueden recibir un máximo de tres parámetros.

<!-- justificacion:inicio -->
Una función flecha no tiene `this` propio: toma el del lugar donde está escrita. De ahí sale su uso más común —callbacks que necesitan el `this` de fuera— y también su límite: no sirven como métodos cuando se espera que `this` sea el objeto. Tampoco tienen `arguments` propio ni se pueden usar con `new`. Las otras tres son inventadas: no devuelven JSON, no obligan a `function` y no limitan los parámetros.
<!-- justificacion:fin -->

- [x] Aprobada

### 52 · M4-6

<!-- pregunta: js_2026#6 | just:0c1c3238603f -->

En módulos ES6, ¿qué sintaxis permite exportar múltiples funciones nombradas desde un mismo archivo?

- `(a)` export default { func1, func2 };
- `(b)` module.exports = [func1, func2];
- `(c)` export { func1, func2 };  **← correcta**
- `(d)` require(func1, func2);

<!-- justificacion:inicio -->
`export { func1, func2 };` exporta varias funciones nombradas, y quien las importe tiene que usar llaves y los mismos nombres. La (a) exporta un objeto por defecto, que es otra cosa y se importa distinto; la (b) es CommonJS; y la (d) confunde exportar con importar. También se puede poner `export` delante de cada declaración, que produce el mismo resultado.
<!-- justificacion:fin -->

- [x] Aprobada

### 53 · M4-7

<!-- pregunta: js_2026#7 | just:4912d031254f -->

¿Qué fase del flujo de eventos del DOM ocurre propagándose desde el elemento objetivo hacia la raíz?

- `(a)` Fase de captura (Capturing phase).
- `(b)` Fase de destino (Target phase).
- `(c)` Fase de delegación (Delegation phase).
- `(d)` Fase de burbujeo (Bubbling phase).  **← correcta**

<!-- justificacion:inicio -->
El burbujeo es la vuelta: el evento sube desde el elemento objetivo hacia la raíz, y por eso un manejador puesto en un contenedor se entera de los clics de sus hijos. Es lo contrario de la captura, que baja, y es la fase en la que `addEventListener` escucha por omisión. La fase de destino es el instante en el elemento mismo, y «delegación» no es una fase sino una técnica que se apoya en el burbujeo.
<!-- justificacion:fin -->

- [x] Aprobada

### 54 · M4-8

<!-- pregunta: js_2026#8 | just:e954b892f847 -->

¿Qué método detiene el comportamiento por defecto de un evento, como el refresco al enviar un formulario?

- `(a)` event.stopPropagation()
- `(b)` event.preventDefault()  **← correcta**
- `(c)` event.stopImmediatePropagation()
- `(d)` event.cancelEvent()

<!-- justificacion:inicio -->
`preventDefault()` cancela lo que el navegador haría por su cuenta: enviar el formulario, seguir el enlace, marcar la casilla. No detiene la propagación — para eso está `stopPropagation()`, que es la (a) y el par con el que se confunde. `stopImmediatePropagation()` es más fuerte todavía: además de cortar la propagación, impide que corran los otros manejadores del mismo elemento.
<!-- justificacion:fin -->

- [x] Aprobada

### 55 · M4-9

<!-- pregunta: js_2026#9 | just:bbe3f61443f6 -->

¿Cuál es la estrategia más óptima para añadir eventos a múltiples elementos hijos generados dinámicamente?

- `(a)` Asignar un evento individual a cada elemento creado.
- `(b)` Utilizar delegación de eventos en un contenedor padre.  **← correcta**
- `(c)` Reemplazar el DOM completo con innerHTML en cada clic.
- `(d)` Invocar addEventListener dentro de un ciclo infinito.

<!-- justificacion:inicio -->
La delegación de eventos: un solo manejador en el contenedor padre, que se entera de los clics de sus hijos gracias al burbujeo y decide con `event.target` cuál fue. Funciona con elementos creados **después** de registrar el manejador, que es justo lo que la pregunta plantea y lo que la (a) no resuelve — habría que registrar uno por cada elemento nuevo, y nadie se acuerda siempre.
<!-- justificacion:fin -->

- [x] Aprobada

### 56 · M4-10

<!-- pregunta: js_2026#10 | just:521c83e83843 -->

¿Qué problema estructural del código resuelve principalmente el uso de Promesas frente a Callbacks clásicos?

- `(a)` El consumo excesivo de memoria RAM del navegador.
- `(b)` El "Callback Hell" o anidamiento excesivo de código.  **← correcta**
- `(c)` El bloqueo del hilo principal (Main Thread).
- `(d)` La imposibilidad de ejecutar instrucciones sincrónicas.

<!-- justificacion:inicio -->
Las promesas aplanan lo que los callbacks anidaban. Con callbacks, cada operación que depende de la anterior agrega un nivel de indentación hasta volver el código ilegible; con promesas, la cadena de `.then()` se lee en vertical, y con `async/await` se lee casi como código síncrono. No resuelven el consumo de memoria ni el bloqueo del hilo: el hilo no se bloqueaba tampoco con callbacks.
<!-- justificacion:fin -->

- [x] Aprobada

### 57 · M4-11

<!-- pregunta: js_2026#11 | just:03cd461aeeb5 -->

¿En qué estado interno queda una Promesa que ha completado su operación asíncrona con éxito?

- `(a)` Pending
- `(b)` Fulfilled  **← correcta**
- `(c)` Rejected
- `(d)` Settled

<!-- justificacion:inicio -->
`Fulfilled` es el estado de una promesa que terminó bien. `Pending` es mientras espera y `Rejected` es cuando falló. `Settled` es el mejor distractor de los cuatro porque **sí es un término real**, pero no es un estado: es el nombre que agrupa a las dos formas de terminar, cumplida o rechazada. Saber que existe y que no es un estado es exactamente lo que la pregunta separa.
<!-- justificacion:fin -->

- [x] Aprobada

### 58 · M4-12

<!-- pregunta: js_2026#12 | just:af3a68cd52d3 -->

¿Qué estructura de control es necesaria para capturar errores de ejecución utilizando async/await?

- `(a)` Bloques if/else anidados exhaustivos.
- `(b)` Condicionales switch/case por código de error.
- `(c)` El bloque try/catch en la función asíncrona.  **← correcta**
- `(d)` El método callback .catch() encadenado.

<!-- justificacion:inicio -->
Con `async/await` los errores se atrapan con `try/catch`, igual que en código síncrono: un `await` sobre una promesa rechazada lanza, y el `catch` lo recoge. Ésa es la ventaja de la sintaxis — que el manejo de errores vuelve a ser el de siempre, sin encadenar nada. El `.catch()` encadenado también funcionaría, pero pertenece al estilo de las cadenas de promesas y mezclarlo con `await` en la misma línea hace el código más difícil de leer. Las otras dos no sirven: ni un `if/else` ni un `switch` ven una excepción que se está lanzando.
<!-- justificacion:fin -->

- [x] Aprobada

### 59 · M4-13

<!-- pregunta: js_2026#13 | just:8379dce4924d -->

A diferencia de XHR, ¿qué tipo de objeto nativo retorna por defecto la API Fetch al ser ejecutada?

- `(a)` Un objeto literal XMLHttpRequest.
- `(b)` Un objeto JSON parseado automáticamente.
- `(c)` Una Promesa (Promise).  **← correcta**
- `(d)` Una función Callback de respuesta.

<!-- justificacion:inicio -->
`fetch()` devuelve una promesa, mientras que XHR devuelve un objeto sobre el que se registran manejadores. Ésa es la diferencia de forma que la pregunta busca. Ojo con la (b), que es el error más común de todos: `fetch` **no** devuelve el JSON ya interpretado — devuelve una respuesta, y sacar el objeto de dentro es un segundo paso asíncrono con `.json()`.
<!-- justificacion:fin -->

- [x] Aprobada

### 60 · M4-14

<!-- pregunta: js_2026#14 | just:00ead0615010 -->

Usando Fetch, ¿qué estado asume la promesa si el servidor responde con un error HTTP 404 (Not Found)?

- `(a)` Se rechaza inmediatamente (Rejected).
- `(b)` Lanza una excepción de red nativa bloqueante.
- `(c)` Se resuelve (Fulfilled) pero su propiedad ok es falsa.  **← correcta**
- `(d)` Queda en estado Pending hasta recibir un código 200.

<!-- justificacion:inicio -->
La promesa **se cumple**. `fetch` solo se rechaza si la petición no se pudo hacer —sin red, DNS caído, CORS—; un 404 o un 500 son respuestas válidas del servidor y llegan como promesa cumplida con `response.ok` en falso. Es la trampa más importante de la API, porque un `try/catch` alrededor de un `fetch` **no** atrapa un 404: hay que comprobar `ok` a mano y lanzar si hace falta.
<!-- justificacion:fin -->

- [x] Aprobada

### 61 · M4-15

<!-- pregunta: js_2026#15 | just:2eadf57b73e6 -->

¿Qué objeto nativo del navegador permite cancelar explícitamente una petición Fetch que está en progreso?

- `(a)` AbortController  **← correcta**
- `(b)` XMLHttpRequest.abort()
- `(c)` EventTarget
- `(d)` Promise.reject()

<!-- justificacion:inicio -->
`AbortController` permite cancelar una petición en curso: se crea uno, se le pasa su `signal` a `fetch`, y al llamar a `abort()` la promesa se rechaza. Sirve para descartar una búsqueda que el usuario ya cambió, o para poner un tiempo límite. La (b) es el método equivalente de XHR y por eso es buen distractor, pero no funciona con `fetch`; `EventTarget` y `Promise.reject()` no cancelan nada.
<!-- justificacion:fin -->

- [x] Aprobada

---

## Lo que este documento no puede decidir

- **Si las justificaciones son ciertas.** Que existan se comprueba con un
  programa; que sean correctas no. Por eso las lees tú.
- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería
  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.
  Si la quieres, es una pasada editorial aparte.

