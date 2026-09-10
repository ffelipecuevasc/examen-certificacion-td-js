# Justificaciones del módulo 3 · para revisar

**Lote:** 61 preguntas · **Redactadas:** 2026-09-09 por Claude Code

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

### 01 · m03#1

<!-- pregunta: json_2026#1 | just:3ffe2796c5fc -->

¿Cuál es el motor principal que compila y ejecuta JavaScript dentro de Google Chrome?

- `(a)` SpiderMonkey
- `(b)` V8 Engine  **← correcta**
- `(c)` ChakraCore
- `(d)` JavaScriptCore

<!-- justificacion:inicio -->
V8 es el motor de JavaScript de Chrome, y también el que hace funcionar a Node.js. Las otras tres existen de verdad y por eso son buenos distractores: SpiderMonkey es el de Firefox, JavaScriptCore el de Safari, y ChakraCore el del Edge antiguo, el que había antes de que Edge pasara a construirse sobre Chromium y adoptara V8.
<!-- justificacion:fin -->

- [x] Aprobada

### 02 · m03#2

<!-- pregunta: json_2026#2 | just:baf79058f275 -->

¿Qué limitación de seguridad crítica tiene JavaScript al ejecutarse nativamente en el navegador?

- `(a)` No puede alterar el árbol DOM en tiempo de ejecución.
- `(b)` Tiene prohibido el acceso al sistema de archivos local.  **← correcta**
- `(c)` No admite realizar peticiones asíncronas externas (AJAX).
- `(d)` Bloquea automáticamente todas las animaciones complejas.

<!-- justificacion:inicio -->
El navegador ejecuta el código dentro de una caja de arena, y esa caja no le da acceso al sistema de archivos del equipo. Es una frontera de seguridad deliberada, no una carencia del lenguaje. Las otras tres describen cosas que JavaScript sí hace todos los días: modificar el DOM, pedir datos con `fetch` y animar. Ojo con un matiz que conviene entender: sí se pueden leer archivos que el usuario elige a mano en un `<input type="file">`, porque ahí el permiso lo da una persona. Lo prohibido es entrar solo.
<!-- justificacion:fin -->

- [x] Aprobada

### 03 · m03#3

<!-- pregunta: json_2026#3 | just:6bd5659174f8 -->

¿Para qué se utiliza principalmente la consola de comandos de JavaScript en el navegador?

- `(a)` Para compilar el código fuente a lenguaje ensamblador local.
- `(b)` Para diseñar de forma visual la interfaz gráfica de usuario.
- `(c)` Para depurar, evaluar expresiones y revisar errores lógicos.  **← correcta**
- `(d)` Para configurar la conexión con la base de datos SQL.

<!-- justificacion:inicio -->
La consola sirve para mirar por dentro un programa que ya está corriendo: escribir expresiones y ver qué devuelven, leer los errores, inspeccionar valores. Las otras tres describen herramientas distintas: JavaScript no se compila a ensamblador a mano, la interfaz se diseña con HTML y CSS, y la conexión a la base de datos vive en el servidor y no en el navegador.
<!-- justificacion:fin -->

- [x] Aprobada

### 04 · m03#4

<!-- pregunta: json_2026#4 | just:94d816578aba -->

En un entorno de navegador, ¿qué objeto global actúa como el contexto raíz de ejecución?

- `(a)` document
- `(b)` global
- `(c)` window  **← correcta**
- `(d)` navigator

<!-- justificacion:inicio -->
En el navegador, `window` es el objeto global: todo lo que se declara sin encerrar en un módulo o una función cuelga de ahí. `document` también es global, pero representa el documento y no el contexto raíz; `global` es el nombre que usa Node.js, no el navegador; y `navigator` describe el navegador y sus capacidades. Desde ES2020 existe además `globalThis`, que nombra el objeto global sea cual sea el entorno.
<!-- justificacion:fin -->

- [x] Aprobada

### 05 · m03#5

<!-- pregunta: json_2026#5 | just:2fc60b9160d1 -->

Al cargar un script en HTML, ¿qué atributo asegura que se ejecute tras parsear el documento?

- `(a)` async
- `(b)` defer  **← correcta**
- `(c)` load
- `(d)` wait

<!-- justificacion:inicio -->
`defer` le dice al navegador que descargue el script en paralelo pero que no lo ejecute hasta terminar de parsear el documento, y por eso el DOM ya está completo cuando el código corre. `async` también descarga en paralelo, pero ejecuta apenas termina la descarga, que puede ser en mitad del parseo; ese es justamente el par que hay que saber distinguir. `load` y `wait` no son atributos de `<script>`.
<!-- justificacion:fin -->

- [x] Aprobada

### 06 · m03#6

<!-- pregunta: json_2026#6 | just:a3dbd04712d5 -->

¿Qué ocurre si un script con errores sintácticos severos se ejecuta en el navegador?

- `(a)` El navegador corrige el error y continúa en silencio.
- `(b)` El hilo se detiene, lanzando un SyntaxError en la consola.  **← correcta**
- `(c)` Se recarga la página automáticamente para intentar resolverlo.
- `(d)` El código omite la línea defectuosa y sigue la ejecución.

<!-- justificacion:inicio -->
Un error de sintaxis se detecta al parsear, antes de ejecutar nada, así que ese script no llega a correr ni una sola línea y el motor informa un `SyntaxError` en la consola. Conviene precisar el alcance de esa detención: lo que no se ejecuta es **ese** script, mientras la página, los demás scripts y los manejadores de eventos siguen funcionando con normalidad. Ninguna de las otras tres ocurre: el navegador no corrige código, no recarga la página solo, y no puede saltarse la línea defectuosa porque no llegó a entender el archivo.
<!-- justificacion:fin -->

- [x] Aprobada

### 07 · m03#7

<!-- pregunta: json_2026#7 | just:f064501965bd -->

¿Cuál es el principal beneficio de aislar el código JavaScript en un archivo externo .js?

- `(a)` Aumenta la seguridad al encriptar el código fuente.
- `(b)` Obliga al servidor a procesar el código antes del envío.
- `(c)` Promueve la reutilización de código y el uso de caché web.  **← correcta**
- `(d)` Evita que los usuarios puedan descargar el código fuente.

<!-- justificacion:inicio -->
Un archivo `.js` aparte lo pueden compartir varias páginas y el navegador lo guarda en caché, así que se descarga una vez y se reutiliza. Las otras tres prometen algo que no ocurre: separar el archivo no encripta nada, no obliga al servidor a procesarlo, y desde luego no impide descargarlo — cualquiera puede abrir la URL del archivo y leerlo entero.
<!-- justificacion:fin -->

- [x] Aprobada

### 08 · m03#8

<!-- pregunta: json_2026#8 | just:ac409d1358ad -->

Según las herramientas del browser, ¿qué pestaña permite analizar el rendimiento del script?

- `(a)` Elements (Elementos)
- `(b)` Network (Red)
- `(c)` Performance (Rendimiento)  **← correcta**
- `(d)` Application (Aplicación)

<!-- justificacion:inicio -->
La pestaña «Performance» graba una línea de tiempo de lo que hizo la página: cuánto tardó cada función, dónde se fue el tiempo, qué bloqueó el dibujado. Las otras tres son pestañas reales con otro oficio: «Elements» inspecciona el DOM y los estilos, «Network» mira las peticiones y sus tiempos de red, y «Application» muestra almacenamiento, cookies y service workers.
<!-- justificacion:fin -->

- [x] Aprobada

### 09 · m03#9

<!-- pregunta: json_2026#9 | just:a1edf6014d87 -->

¿Qué provoca declarar una variable sin usar let, const o var en modo no estricto?

- `(a)` Genera un error de sintaxis que detiene el programa.
- `(b)` Crea una propiedad implícita dentro del objeto global.  **← correcta**
- `(c)` Define una constante local inmutable en el bloque.
- `(d)` Inicializa la variable como "undefined" pero de alcance local.

<!-- justificacion:inicio -->
En modo no estricto, asignar a un nombre que nunca se declaró crea una propiedad en el objeto global en vez de fallar. Es una de las razones de ser de `'use strict'`, que convierte ese descuido en un `ReferenceError`. Por eso la (a) no es correcta aquí: sí hay error, pero solo en modo estricto, que es justo lo que el enunciado descarta. Y no es local ni queda en `undefined`: queda global y con el valor asignado.
<!-- justificacion:fin -->

- [x] Aprobada

### 10 · m03#10

<!-- pregunta: json_2026#10 | just:2376c0156b49 -->

Al evaluar la expresión `[] == false`, ¿qué resultado y por qué se produce en JavaScript?

- `(a)` false, porque no son del mismo tipo de dato estructural.
- `(b)` true, porque ambos valores son idénticos en memoria.
- `(c)` true, debido a la coerción implícita de tipos hacia números.  **← correcta**
- `(d)` Error, ya que un arreglo no puede compararse con un booleano.

<!-- justificacion:inicio -->
El resultado es `true`, y la cadena de conversiones es lo que hay que entender: `false` se convierte al número `0`, y el arreglo vacío se convierte primero a la cadena `""` y de ahí al número `0`; `0 == 0` da verdadero. Lo que conviene fijar es que `==` compara convirtiendo a **número**, no a booleano. De ahí sale algo que parece contradictorio y no lo es: `[] == false` da `true` y al mismo tiempo `[] ? 'sí' : 'no'` da `'sí'`, porque como condición un arreglo vacío es verdadero. Son dos reglas distintas —la de `==` y la de los valores truthy— y aplicarlas cruzadas es el error más común con este operador.
<!-- justificacion:fin -->

- [x] Aprobada

### 11 · m03#11

<!-- pregunta: json_2026#11 | just:533a7fd92f38 -->

¿Qué valor asume una variable declarada con `let` pero que carece de inicialización explícita?

- `(a)` null
- `(b)` NaN
- `(c)` 0
- `(d)` undefined  **← correcta**

<!-- justificacion:inicio -->
Declarar sin asignar deja la variable en `undefined`, que es el valor que JavaScript usa para «existe pero todavía no tiene nada». `null` es distinto: significa «vacío a propósito» y hay que escribirlo. `NaN` aparece al fallar una operación numérica, y `0` habría que asignarlo. La distinción entre `undefined` y `null` es una de las que más se preguntan.
<!-- justificacion:fin -->

- [x] Aprobada

### 12 · m03#12

<!-- pregunta: json_2026#12 | just:84296e0fed41 -->

¿Qué operador lógico retorna el primer operando falso o el último verdadero si todos lo son?

- `(a)` || (OR lógico)
- `(b)` && (AND lógico)  **← correcta**
- `(c)` ! (NOT lógico)
- `(d)` ?? (Nullish coalescing)

<!-- justificacion:inicio -->
`&&` va evaluando de izquierda a derecha y se detiene en el primer operando falso, devolviéndolo tal cual; si ninguno lo es, devuelve el último. Esa es la razón de que `&&` no devuelva siempre `true` o `false` sino uno de los operandos. `||` hace lo simétrico: primer verdadero o último. `!` niega y siempre da booleano, y `??` solo reacciona ante `null` y `undefined`.
<!-- justificacion:fin -->

- [x] Aprobada

### 13 · m03#13

<!-- pregunta: json_2026#13 | just:f13d45bf9aae -->

¿Cuál es la precedencia correcta, de mayor a menor, en los operadores aritméticos básicos?

- `(a)` Suma, Resta, Multiplicación, División
- `(b)` Multiplicación/División, Suma/Resta  **← correcta**
- `(c)` Suma/Resta, Multiplicación/División
- `(d)` Todas las operaciones tienen igual prioridad estricta.

<!-- justificacion:inicio -->
Multiplicación y división se evalúan antes que suma y resta, igual que en aritmética, y los paréntesis siguen mandando sobre todo. Por eso `2 + 3 * 4` da 14 y no 20. La (a) y la (c) invierten el orden, y la (d) es lo que pasaría si no hubiera precedencia, que es exactamente lo que la precedencia existe para evitar.
<!-- justificacion:fin -->

- [x] Aprobada

### 14 · m03#14

<!-- pregunta: json_2026#14 | just:bedbf8151c50 -->

Si `a = 5` y evaluamos `b = a++`, ¿cuál es el valor final de `b` y `a` respectivamente?

- `(a)` b = 6, a = 6
- `(b)` b = 5, a = 5
- `(c)` b = 6, a = 5
- `(d)` b = 5, a = 6  **← correcta**

<!-- justificacion:inicio -->
El `++` puesto **después** de la variable devuelve el valor viejo y luego incrementa: `b` se queda con 5 y `a` pasa a 6. Si estuviera puesto antes, `b = ++a`, los dos valdrían 6, que es la alternativa (a). Esa diferencia entre postfijo y prefijo es todo lo que la pregunta evalúa, y es de las que se responden mal por leer rápido.
<!-- justificacion:fin -->

- [x] Aprobada

### 15 · m03#15

<!-- pregunta: json_2026#15 | just:72539f423a31 -->

En un condicional `if ("0")`, ¿el bloque interno se ejecuta o se omite?

- `(a)` Se omite, porque "0" se convierte algorítmicamente a false.
- `(b)` Se ejecuta, ya que un string no vacío evalúa como truthy.  **← correcta**
- `(c)` Se omite, porque el motor detecta que carece de valor numérico.
- `(d)` Lanza un error al evaluar un string sin usar un comparador.

<!-- justificacion:inicio -->
El bloque se ejecuta. En un condicional el valor se convierte a booleano, y **toda cadena no vacía es verdadera**, incluida `"0"`: lo que decide es que tenga caracteres, no lo que digan. La única cadena falsa es la vacía, `""`. Es una trampa clásica, porque el número `0` sí es falso y `"0"` se le parece a la vista.
<!-- justificacion:fin -->

- [x] Aprobada

### 16 · m03#16

<!-- pregunta: json_2026#16 | just:83085fa0d3dd -->

¿Qué diferencia clave existe entre los operadores relacionales == y === en JavaScript?

- `(a)` == compara solo el tipo, === compara valor y referencia.
- `(b)` == realiza coerción de tipos, === evalúa tipo y valor estricto.  **← correcta**
- `(c)` === se usa solo para objetos, == para tipos primitivos.
- `(d)` No existe diferencia real, ambos efectúan conversión de tipos.

<!-- justificacion:inicio -->
`==` convierte tipos antes de comparar, así que `"5" == 5` es verdadero; `===` compara tipo y valor sin convertir nada, y por eso `"5" === 5` es falso. La (a) dice exactamente lo contrario y por eso es el distractor que separa al que sabe. La recomendación práctica es usar `===` siempre, salvo que se quiera la conversión a propósito y se sepa por qué.
<!-- justificacion:fin -->

- [x] Aprobada

### 17 · m03#17

<!-- pregunta: json_2026#17 | just:bc54f06a5ced -->

Si intentas asignar un valor a un índice fuera del límite actual de un arreglo, ¿qué sucede?

- `(a)` El motor lanza un RangeError crítico en tiempo de ejecución.
- `(b)` El arreglo ignora la asignación y no muta su estructura.
- `(c)` El arreglo se expande, rellenando los vacíos con "undefined".  **← correcta**
- `(d)` El elemento se inserta al inicio desplazando los demás índices.

<!-- justificacion:inicio -->
El arreglo se estira hasta ese índice y su `length` crece para incluirlo. No hay error: los arreglos de JavaScript no tienen un tamaño reservado que pueda desbordarse. Las posiciones intermedias que quedaron sin valor se leen como `undefined`. Las otras tres suponen comportamientos que no existen: ni se lanza un `RangeError`, ni se ignora la asignación, ni se desplazan los índices ya ocupados.
<!-- justificacion:fin -->

- [x] Aprobada

### 18 · m03#18

<!-- pregunta: json_2026#18 | just:56f316ee0768 -->

¿Cómo afecta la modificación de un arreglo a sus referencias asignadas a otras variables?

- `(a)` Solo la variable original muta, el resto mantiene un clon.
- `(b)` Todas las variables apuntando a esa referencia se actualizan.  **← correcta**
- `(c)` Rompe la referencia y genera un objeto completamente nuevo.
- `(d)` Dispara una advertencia de mutabilidad en memoria dinámica.

<!-- justificacion:inicio -->
Un arreglo es un objeto y las variables guardan una referencia a él, no una copia. Si dos variables apuntan al mismo arreglo, el cambio hecho a través de una se ve por la otra, porque hay un solo arreglo. Para obtener una copia hay que pedirla: `[...arr]` o `arr.slice()`, y aun así es una copia superficial. Es la causa de una parte grande de los errores con datos compartidos.
<!-- justificacion:fin -->

- [x] Aprobada

### 19 · m03#19

<!-- pregunta: json_2026#19 | just:728a2722b58b -->

¿Cuál es el propósito principal de la sentencia `continue` dentro de un ciclo `for`?

- `(a)` Finalizar completamente la ejecución del bucle envolvente.
- `(b)` Retornar inmediatamente el valor iterado a la función padre.
- `(c)` Saltar el resto de la iteración actual y avanzar a la siguiente.  **← correcta**
- `(d)` Reiniciar el contador del ciclo desde su valor inicial base.

<!-- justificacion:inicio -->
`continue` abandona la iteración en curso y salta a la siguiente, sin salir del ciclo. El que termina el bucle entero es `break`, que es la alternativa (a) y el par con el que siempre se confunde. `return` devuelve desde la función, no desde el ciclo, y no existe ninguna instrucción que reinicie el contador desde su valor inicial.
<!-- justificacion:fin -->

- [x] Aprobada

### 20 · m03#20

<!-- pregunta: json_2026#20 | just:584310c6b6a0 -->

¿Qué diferencia conceptual rige entre un ciclo `while` y un bucle `do/while`?

- `(a)` while solo admite variables locales en su bloque de ejecución.
- `(b)` do/while asegura al menos una ejecución del bloque interno.  **← correcta**
- `(c)` do/while no admite dependencias evaluadas como booleanas.
- `(d)` while itera exclusivamente sobre propiedades de objetos.

<!-- justificacion:inicio -->
`do/while` evalúa la condición **después** del bloque, así que el cuerpo corre al menos una vez aunque la condición sea falsa desde el principio; `while` la evalúa antes y puede no ejecutarse nunca. Esa es toda la diferencia, y es la que decide cuál usar: `do/while` sirve cuando hay que hacer algo primero y recién después preguntar si se repite.
<!-- justificacion:fin -->

- [x] Aprobada

### 21 · m03#21

<!-- pregunta: json_2026#21 | just:d70a79727708 -->

En el contexto de arreglos asociativos simulados, ¿qué tipo subyacente de estructura son?

- `(a)` Arreglos indexados secuencialmente con claves hash.
- `(b)` Objetos puros, donde el índice string es el nombre de propiedad.  **← correcta**
- `(c)` Matrices bidimensionales almacenadas en el heap de memoria.
- `(d)` Tuplas inmutables de longitud estricta y predefinida.

<!-- justificacion:inicio -->
JavaScript no tiene arreglos asociativos de verdad: lo que se usa como tal son objetos, donde la clave de texto es el nombre de una propiedad. Por eso `obj["nombre"]` y `obj.nombre` son lo mismo. Los arreglos con índices numéricos son otra cosa y tienen `length` y métodos propios; matrices bidimensionales y tuplas inmutables no son estructuras nativas del lenguaje.
<!-- justificacion:fin -->

- [x] Aprobada

### 22 · m03#22

<!-- pregunta: json_2026#22 | just:3621b65747ec -->

¿Por qué es una mala práctica declarar funciones internamente dentro de un bucle extenso?

- `(a)` Sobrescribe la declaración iterativa perdiendo el índice.
- `(b)` Genera un error de sintaxis bloqueando la compilación V8.
- `(c)` Instancia en memoria múltiples copias de la función sin necesidad.  **← correcta**
- `(d)` Fuerza la conversión de variables locales a constantes globales.

<!-- justificacion:inicio -->
Cada vuelta del ciclo crea una función nueva en memoria, aunque el código sea idéntico, y eso es trabajo y memoria sin motivo. La salida es declarar la función una vez fuera del bucle y llamarla dentro. No es un error de sintaxis ni rompe nada: el programa funciona, simplemente hace de más, y por eso es una mala práctica y no un fallo.
<!-- justificacion:fin -->

- [x] Aprobada

### 23 · m03#23

<!-- pregunta: json_2026#23 | just:824fcb97ab8b -->

¿Qué principio rige en las convenciones de "código limpio" (Clean Code) para nombrar variables?

- `(a)` Usar siglas breves para minimizar el uso de memoria RAM.
- `(b)` Emplear nombres descriptivos que revelen su real intención.  **← correcta**
- `(c)` Usar notación húngara combinada con índices alfanuméricos.
- `(d)` Mantener nombres en mayúsculas ignorando su alcance base.

<!-- justificacion:inicio -->
El nombre tiene que decir qué guarda la variable o qué hace la función, de modo que el código se pueda leer sin ir a buscar la definición. `contadorDeIntentos` gana a `c` aunque sea más largo. Las otras tres proponen prácticas abandonadas o falsas: el largo de un nombre no consume memoria en tiempo de ejecución, la notación húngara cayó en desuso, y las mayúsculas se reservan por convención para constantes.
<!-- justificacion:fin -->

- [x] Aprobada

### 24 · m03#24

<!-- pregunta: json_2026#24 | just:3c322d18aef3 -->

En un ciclo iterativo, ¿qué sucede si la condición de salida jamás se evalúa como falsa?

- `(a)` El motor de JavaScript detiene el proceso tras mil iteraciones.
- `(b)` Se desencadena un bucle infinito colapsando el navegador.  **← correcta**
- `(c)` El compilador optimiza el ciclo ignorando la condición estricta.
- `(d)` El ciclo termina retornando un valor "undefined" implícito.

<!-- justificacion:inicio -->
Si la condición nunca se vuelve falsa, el ciclo no termina: se queda girando y bloquea el hilo, que en el navegador significa una pestaña congelada. No hay ningún límite de iteraciones que lo detenga —la (a) inventa uno—, ni el compilador puede «optimizar» una condición que quizá sea correcta, ni el ciclo devuelve nada, porque nunca llega a salir.
<!-- justificacion:fin -->

- [x] Aprobada

### 25 · m03#25

<!-- pregunta: json_2026#25 | just:144f7e82474e -->

¿Qué comportamiento describe la capacidad de alojar una función anónima dentro de una variable?

- `(a)` Herencia prototípica de instancias base y constructores.
- `(b)` Conversión explícita de tipos abstractos dinámicos.
- `(c)` Manejo de funciones como ciudadanos de primera clase.  **← correcta**
- `(d)` Resolución asíncrona mediante un bucle de eventos activo.

<!-- justificacion:inicio -->
Que una función se pueda guardar en una variable, pasar como argumento y devolver desde otra función es lo que significa que las funciones sean ciudadanos de primera clase: valen lo mismo que cualquier otro dato. De ahí salen los callbacks y buena parte del estilo del lenguaje. Las otras tres nombran conceptos reales de JavaScript, pero ninguno describe lo que la pregunta plantea.
<!-- justificacion:fin -->

- [x] Aprobada

### 26 · m03#26

<!-- pregunta: json_2026#26 | just:7013e68d1788 -->

Si una función ejecuta un bloque de código pero omite la instrucción `return`, ¿qué devuelve?

- `(a)` null
- `(b)` 0
- `(c)` false
- `(d)` undefined  **← correcta**

<!-- justificacion:inicio -->
Toda función devuelve algo, y si no se dice qué, devuelve `undefined`. No es un caso especial: es el valor por omisión del retorno. `null` habría que devolverlo a propósito, y `0` y `false` son valores concretos que nadie escribió. Conviene tenerlo claro porque `undefined` es lo que se recibe al usar el resultado de una función que en realidad no devolvía nada.
<!-- justificacion:fin -->

- [x] Aprobada

### 27 · m03#27

<!-- pregunta: json_2026#27 | just:3ff33e53f789 -->

¿Qué sucede si pasas menos argumentos a una función de los definidos en sus parámetros?

- `(a)` Los parámetros faltantes asumen automáticamente el valor undefined.  **← correcta**
- `(b)` La ejecución falla lanzando un TypeError crítico en consola.
- `(c)` La función bloquea el hilo esperando que se provean datos.
- `(d)` Los argumentos no provistos toman el valor booleano false.

<!-- justificacion:inicio -->
Los parámetros que no reciben argumento quedan en `undefined`, y la función corre igual. JavaScript no comprueba la cantidad de argumentos: pasar de menos —o de más— no es un error. De ahí vienen los valores por omisión, `function f(x = 10)`, que existen justamente para no tener que comprobar a mano si llegó `undefined`.
<!-- justificacion:fin -->

- [x] Aprobada

### 28 · m03#28

<!-- pregunta: json_2026#28 | just:0a3aca3106f3 -->

¿Por qué el uso excesivo de variables globales está catalogado como un antipatrón riesgoso?

- `(a)` Ocupan menos espacio pero fragmentan el heap del cliente.
- `(b)` Aumentan drásticamente el riesgo de colisiones y fallas.  **← correcta**
- `(c)` Solo permiten almacenar datos primitivos temporalmente.
- `(d)` Son inaccesibles en bloques de ciclos o condicionales.

<!-- justificacion:inicio -->
Cualquier parte del programa puede leer y escribir una variable global, así que dos trozos de código que no se conocen pueden pisarse el valor, y encontrar quién lo hizo es difícil porque el sospechoso es todo el archivo. Las otras tres dicen cosas falsas: las globales no ocupan menos, admiten cualquier tipo de dato, y son accesibles desde dentro de ciclos y condicionales.
<!-- justificacion:fin -->

- [x] Aprobada

### 29 · m03#29

<!-- pregunta: json_2026#29 | just:56c80a3ccf5c -->

¿Qué regla determina el acceso a variables dentro de funciones anidadas (lexical scoping)?

- `(a)` La función interna no puede acceder a variables de la externa.
- `(b)` Solo puede acceder a variables globales, ignorando a su padre.
- `(c)` Accede a su propio scope, al entorno superior y al alcance global.  **← correcta**
- `(d)` Las variables del scope superior colapsan al ejecutar la interna.

<!-- justificacion:inicio -->
El alcance léxico se decide por dónde está escrita la función, no por dónde se la llama: una función interna ve sus propias variables, las de la función que la contiene, y las globales. Ese encadenamiento hacia afuera es lo que hace posibles los closures. Las otras tres niegan justamente esa cadena, que es lo que la pregunta evalúa.
<!-- justificacion:fin -->

- [x] Aprobada

### 30 · m03#30

<!-- pregunta: json_2026#30 | just:8dae6653b270 -->

¿Qué efecto tiene declarar un parámetro con el mismo nombre que una variable global del scope?

- `(a)` Shadowing: el parámetro prioriza su valor sobre la variable global.  **← correcta**
- `(b)` Error de compilación por conflicto de nombres duplicados.
- `(c)` Se sobrescribe el valor de la variable global de forma permanente.
- `(d)` La función fusiona ambos valores en un dato compuesto iterativo.

<!-- justificacion:inicio -->
Se llama shadowing: dentro de la función, el nombre se resuelve al parámetro y la variable global queda tapada mientras dure esa ejecución. No hay error ni conflicto —JavaScript permite repetir el nombre— y la global **no** se modifica: sigue intacta y vuelve a verse al salir de la función. Confundir «tapar» con «sobrescribir» es el error que la (c) recoge.
<!-- justificacion:fin -->

- [x] Aprobada

### 31 · m03#31

<!-- pregunta: json_2026#31 | just:42e9280690f9 -->

¿Qué palabra clave nativa y reservada da acceso dinámico a todos los parámetros en una función?

- `(a)` arguments  **← correcta**
- `(b)` args
- `(c)` params
- `(d)` inputs

<!-- justificacion:inicio -->
`arguments` es un objeto que existe dentro de toda función tradicional y contiene todos los argumentos recibidos, se hayan declarado como parámetros o no. `args`, `params` e `inputs` no son palabras del lenguaje. Conviene saber que `arguments` **no existe en las funciones flecha**, y que hoy se prefiere el parámetro rest —`function f(...args)`—, que sí da un arreglo de verdad.
<!-- justificacion:fin -->

- [x] Aprobada

### 32 · m03#32

<!-- pregunta: json_2026#32 | just:940d78eab787 -->

¿Qué ocurre con la memoria de las variables locales al concluir la ejecución de su función?

- `(a)` Permanecen en el heap hasta reiniciar el navegador por completo.
- `(b)` Se exportan al entorno global para asegurar retención de datos.
- `(c)` Son descartadas y liberadas por el recolector de basura nativo.  **← correcta**
- `(d)` Se almacenan en LocalStorage como respaldo del proceso actual.

<!-- justificacion:inicio -->
Al terminar la función, sus variables locales dejan de ser alcanzables y el recolector de basura libera esa memoria cuando le toca; no hay que liberarla a mano. Hay una excepción que vale la pena tener presente desde ya, porque aparece poco después en el propio curso: si una función interna capturó esas variables —un closure—, siguen vivas después de que la función externa terminó, porque todavía queda quien las alcance. Las otras tres describen cosas que no pasan: no se quedan hasta reiniciar el navegador, no se exportan al ámbito global, y no se guardan en `localStorage`.
<!-- justificacion:fin -->

- [x] Aprobada

### 33 · m03#33

<!-- pregunta: json_2026#33 | just:a73282899b40 -->

Al acceder a una propiedad dinámica cuyo nombre está en una variable, ¿qué notación es obligatoria?

- `(a)` Notación de flecha (objeto-&gt;propiedad)
- `(b)` Notación de punto (objeto.propiedad)
- `(c)` Notación de corchetes (objeto[variable])  **← correcta**
- `(d)` Notación de guion (objeto-variable)

<!-- justificacion:inicio -->
Cuando el nombre de la propiedad está guardado en una variable hay que usar corchetes, `objeto[variable]`, porque así se evalúa la variable y se usa su contenido como clave. Con punto, `objeto.variable`, se buscaría una propiedad llamada literalmente «variable». Las notaciones con flecha y con guion no existen en JavaScript; la de flecha es de PHP y C++.
<!-- justificacion:fin -->

- [x] Aprobada

### 34 · m03#34

<!-- pregunta: json_2026#34 | just:6fcc61cad82e -->

¿Qué define estrictamente a un "método" en el paradigma orientado a objetos de JavaScript?

- `(a)` Una variable primitiva almacenada en el entorno global del DOM.
- `(b)` Una propiedad de un objeto cuyo valor alojado es una función.  **← correcta**
- `(c)` Un ciclo iterativo configurado dentro del constructor padre.
- `(d)` Una constante matemática protegida contra sobreescritura local.

<!-- justificacion:inicio -->
Un método no es una categoría aparte: es sencillamente una propiedad cuyo valor resulta ser una función. Por eso se puede agregar uno a un objeto ya creado con una asignación corriente, y por eso `typeof obj.metodo` responde `"function"`. Entender esto es lo que hace que después no sorprenda pasar métodos como argumentos o guardarlos en variables.
<!-- justificacion:fin -->

- [x] Aprobada

### 35 · m03#35

<!-- pregunta: json_2026#35 | just:f2824102d069 -->

Si intentas consultar una propiedad que no existe dentro de un objeto literal, ¿qué evalúa JS?

- `(a)` undefined  **← correcta**
- `(b)` null
- `(c)` false
- `(d)` Lanza un ReferenceError inmediato al compilar.

<!-- justificacion:inicio -->
Consultar una propiedad que no existe devuelve `undefined`, sin error. Eso es cómodo y a la vez peligroso: el programa sigue con un `undefined` que puede reventar más adelante, lejos de donde estuvo la causa. El `ReferenceError` de la (d) es para variables que no existen, que es otra cosa: acceder a una propiedad inexistente de un objeto que sí existe nunca lanza.
<!-- justificacion:fin -->

- [x] Aprobada

### 36 · m03#36

<!-- pregunta: json_2026#36 | just:84a8316c7e07 -->

¿Qué función del objeto Math permite redondear un decimal hacia el entero superior más cercano?

- `(a)` Math.floor()
- `(b)` Math.round()
- `(c)` Math.ceil()  **← correcta**
- `(d)` Math.trunc()

<!-- justificacion:inicio -->
`Math.ceil()` redondea siempre hacia arriba: `Math.ceil(4.1)` da 5. Las otras tres son reales y hacen otra cosa: `Math.floor()` redondea siempre hacia abajo, `Math.round()` al entero más cercano según el decimal, y `Math.trunc()` corta la parte decimal sin mirar. Con negativos se separan de verdad: `Math.ceil(-4.7)` da -4 y `Math.trunc(-4.7)` da -4, pero `Math.floor(-4.7)` da -5.
<!-- justificacion:fin -->

- [x] Aprobada

### 37 · m03#37

<!-- pregunta: json_2026#37 | just:a3c3b6aa4427 -->

Para generar un número seudoaleatorio decimal entre 0 y casi 1, ¿qué invocación es la correcta?

- `(a)` Math.rand()
- `(b)` Math.random()  **← correcta**
- `(c)` Math.getSeed()
- `(d)` Math.rnd()

<!-- justificacion:inicio -->
`Math.random()` devuelve un decimal entre 0 incluido y 1 excluido. Nunca llega a 1, y por eso la fórmula habitual para un entero en un rango es `Math.floor(Math.random() * n)`. `Math.rand()`, `Math.rnd()` y `Math.getSeed()` no existen; la última además insinúa algo que JavaScript no ofrece: no hay forma de fijar la semilla del generador.
<!-- justificacion:fin -->

- [x] Aprobada

### 38 · m03#38

<!-- pregunta: json_2026#38 | just:8f836a4839d6 -->

¿Qué método de la instancia String extrae una porción de texto basada en índices de inicio y fin?

- `(a)` splice()
- `(b)` extract()
- `(c)` slice()  **← correcta**
- `(d)` split()

<!-- justificacion:inicio -->
`slice(inicio, fin)` devuelve el trozo entre esos índices, sin incluir el final, y no modifica la cadena original —las cadenas son inmutables—. `split()` existe pero parte la cadena en un arreglo usando un separador; `splice()` es de arreglos y además muta; `extract()` no existe. Que `slice` funcione igual en cadenas y en arreglos ayuda a recordarlo.
<!-- justificacion:fin -->

- [x] Aprobada

### 39 · m03#39

<!-- pregunta: json_2026#39 | just:2c4bebaa0420 -->

Al invocar el método `String.prototype.indexOf()`, ¿qué se retorna si la subcadena no existe?

- `(a)` undefined
- `(b)` false
- `(c)` null
- `(d)` -1  **← correcta**

<!-- justificacion:inicio -->
`indexOf()` devuelve la posición de la primera coincidencia y `-1` si no encuentra nada. Se eligió `-1` porque cualquier posición válida es cero o mayor, así que no se confunde con un resultado real. Justamente por eso hay que compararlo con `-1` y no usarlo como booleano: la posición `0` es un hallazgo válido y es falsy, que es el error clásico. Cuando solo interesa saber si está, `includes()` es más claro.
<!-- justificacion:fin -->

- [x] Aprobada

### 40 · m03#40

<!-- pregunta: json_2026#40 | just:e2f0348f88c4 -->

¿Cuál es la diferencia estructural entre crear un string primitivo y usar `new String()`?

- `(a)` El primitivo muta; new String() bloquea cualquier modificación.
- `(b)` new String() instancia un objeto explícito, no un tipo primitivo.  **← correcta**
- `(c)` No existe diferencia técnica, ambos compilan al mismo binario.
- `(d)` El constructor soporta cifrado UTF-16, pero el primitivo carece.

<!-- justificacion:inicio -->
`new String("hola")` construye un objeto envoltorio, mientras que `"hola"` es un valor primitivo. Se nota al comparar: `typeof` responde `"object"` en el primero y `"string"` en el segundo, y `new String("a") === "a"` es falso. En la práctica no se usa `new String()`, porque el motor envuelve el primitivo solo cuando hace falta llamar a un método.
<!-- justificacion:fin -->

- [x] Aprobada

### 41 · m03#41

<!-- pregunta: json_2026#41 | just:3b1745d16cec -->

¿Qué recorre cada ciclo al aplicar `for...in` frente a `for...of` sobre un arreglo?

- `(a)` Ambos recorren los valores; solo cambia el orden de la iteración.
- `(b)` `for...in` recorre los valores y `for...of` recorre las posiciones.
- `(c)` Ambos recorren las claves; `for...of` además expone el arreglo completo.
- `(d)` `for...in` recorre las claves del objeto y `for...of` recorre los valores.  **← correcta**

<!-- justificacion:inicio -->
`for...in` recorre las **claves** —en un arreglo, los índices, y además como texto— y `for...of` recorre los **valores**. Por eso sobre arreglos casi siempre se quiere `for...of`. Y hay una razón más para no usar `for...in` con arreglos: también recorre propiedades heredadas o agregadas al objeto, así que puede devolver más de lo que uno espera.
<!-- justificacion:fin -->

- [x] Aprobada

### 42 · m03#42

<!-- pregunta: json_2026#42 | just:576613e0e897 -->

Al invocar `sort()` sin argumentos sobre el arreglo [10, 9, 100], ¿en qué orden queda y por qué?

- `(a)` [10, 100, 9], porque compara los elementos como texto y no como números.  **← correcta**
- `(b)` [9, 10, 100], porque el método detecta el tipo numérico automáticamente.
- `(c)` [100, 10, 9], porque sin argumentos ordena de mayor a menor por omisión.
- `(d)` [10, 9, 100], porque sin función comparadora conserva el orden original.

<!-- justificacion:inicio -->
Queda `[10, 100, 9]`. Sin función comparadora, `sort()` convierte cada elemento a texto y ordena alfabéticamente, y como texto `"10"` va antes que `"100"` y este antes que `"9"`, porque compara carácter a carácter. Para ordenar números de verdad hay que dárselo escrito: `arr.sort((a, b) => a - b)`. Es uno de los comportamientos más sorprendentes del lenguaje y por eso se pregunta tanto.
<!-- justificacion:fin -->

- [x] Aprobada

### 43 · m03#43

<!-- pregunta: json_2026#43 | just:3cae3a37a8e7 -->

En una estructura `switch`, ¿qué consecuencia acarrea omitir la sentencia `break` en un caso?

- `(a)` El intérprete aborta la estructura completa lanzando SyntaxError.
- `(b)` El bloque se repite indefinidamente hasta cumplir la condición.
- `(c)` El control retorna al inicio del switch reevaluando la expresión.
- `(d)` La ejecución continúa en los casos siguientes hasta hallar un break.  **← correcta**

<!-- justificacion:inicio -->
Sin `break`, la ejecución sigue cayendo hacia los casos siguientes y los ejecuta aunque no coincidan, hasta encontrar un `break` o terminar el `switch`. Se llama fall-through y a veces se usa a propósito, agrupando varios casos que comparten el mismo cuerpo. Lo que nunca hace es lanzar error, repetirse ni volver al principio.
<!-- justificacion:fin -->

- [x] Aprobada

### 44 · m03#44

<!-- pregunta: json_2026#44 | just:d515a174ecde -->

¿Cuál es la sintaxis correcta del operador condicional ternario para asignar un valor?

- `(a)` let x = if (cond) ? valorA : valorB;
- `(b)` let x = cond ? valorA | valorB;
- `(c)` let x = cond ? valorA : valorB;  **← correcta**
- `(d)` let x = (cond) =&gt; valorA : valorB;

<!-- justificacion:inicio -->
La forma es `condición ? valorSiVerdadero : valorSiFalso`, y devuelve un valor, por eso se puede asignar directo. La (a) mezcla `if` con el ternario, que no se combinan; la (b) usa `|`, que es un operador de bits; y la (d) usa la flecha de las funciones. Es el único operador de JavaScript que toma tres operandos, de ahí el nombre.
<!-- justificacion:fin -->

- [x] Aprobada

### 45 · m03#45

<!-- pregunta: json_2026#45 | just:0b3910b15e6d -->

¿Qué delimitador y qué marcador exige una plantilla literal para interpolar una expresión?

- `(a)` Comillas invertidas como delimitador y `${expresion}` como marcador.  **← correcta**
- `(b)` Comillas dobles como delimitador y `#{expresion}` como marcador.
- `(c)` Comillas simples como delimitador y `%expresion%` como marcador.
- `(d)` Paréntesis como delimitador y `@{expresion}` como marcador.

<!-- justificacion:inicio -->
Las plantillas literales van entre comillas invertidas y la expresión se interpola con `${...}`. Dentro se puede poner cualquier expresión, no solo una variable, y además el texto puede ocupar varias líneas sin escapar nada, que es la otra ventaja frente a las comillas normales. Los marcadores `#{}`, `%%` y `@{}` son de otros lenguajes: el primero es de Ruby.
<!-- justificacion:fin -->

- [x] Aprobada

### 46 · m03#46

<!-- pregunta: json_2026#46 | just:45b12ded6e7d -->

Si a un arreglo de diez elementos se le asigna `length = 4`, ¿qué le sucede a su contenido?

- `(a)` La asignación se ignora, pues length es una propiedad de solo lectura.
- `(b)` Los elementos sobrantes se desplazan al inicio conservando su valor.
- `(c)` Se lanza un RangeError por reducir la capacidad ya reservada.
- `(d)` El arreglo se trunca y los elementos posteriores al índice 3 se descartan.  **← correcta**

<!-- justificacion:inicio -->
`length` es de lectura y escritura, y bajarlo trunca el arreglo: los elementos desde el índice 4 en adelante se descartan y no vuelven. Es la forma más corta de vaciar un arreglo, `arr.length = 0`. Las otras tres suponen protecciones que no existen: no es de solo lectura, no reordena nada y no hay capacidad reservada que pueda desbordarse.
<!-- justificacion:fin -->

- [x] Aprobada

### 47 · m03#47

<!-- pregunta: json_2026#47 | just:13870b3a6100 -->

Respecto al método `push()` sobre un arreglo, ¿dónde inserta y qué valor devuelve la llamada?

- `(a)` Inserta al inicio y devuelve el elemento recién incorporado.
- `(b)` Inserta al final y devuelve la nueva longitud del arreglo.  **← correcta**
- `(c)` Inserta al final y devuelve una copia superficial del arreglo.
- `(d)` Inserta al inicio y devuelve el índice asignado al elemento.

<!-- justificacion:inicio -->
`push()` agrega al final y devuelve la nueva longitud, no el elemento. Confundirlo importa cuando se encadena o se guarda el resultado. El que agrega al principio es `unshift()`, y también devuelve la longitud. Ninguno de los dos devuelve una copia: los dos modifican el arreglo original.
<!-- justificacion:fin -->

- [x] Aprobada

### 48 · m03#48

<!-- pregunta: json_2026#48 | just:dd84782f5b45 -->

¿Cuál es la distinción sustantiva entre invocar `slice()` y aplicar `splice()` sobre un arreglo?

- `(a)` slice devuelve una porción sin alterar el original; splice muta el arreglo.  **← correcta**
- `(b)` slice muta el arreglo original; splice opera sobre una copia aislada.
- `(c)` Ambos mutan el original, diferenciándose solo en el orden de los índices.
- `(d)` slice actúa sobre cadenas exclusivamente y splice sobre arreglos.

<!-- justificacion:inicio -->
`slice()` devuelve un trozo nuevo y deja el original intacto; `splice()` modifica el arreglo en su sitio, quitando o insertando elementos, y devuelve los que sacó. Los nombres se parecen tanto que la confusión es habitual, y la consecuencia no es menor: uno destruye datos y el otro no. La (d) es falsa: `slice` existe en cadenas **y** en arreglos.
<!-- justificacion:fin -->

- [x] Aprobada

### 49 · m03#49

<!-- pregunta: json_2026#49 | just:3ad593ffd4be -->

Al ejecutar `parseInt("08px")`, ¿qué valor entrega el analizador y bajo qué criterio se detiene?

- `(a)` Entrega NaN, porque la cadena mezcla dígitos con caracteres alfabéticos.
- `(b)` Entrega 0, deteniéndose ante el cero inicial interpretado como octal.
- `(c)` Entrega "08", conservando el tipo String de la cadena original.
- `(d)` Entrega 8, deteniéndose en el primer carácter no numérico hallado.  **← correcta**

<!-- justificacion:inicio -->
Devuelve el número `8`. `parseInt` lee desde el principio mientras encuentre caracteres válidos y se detiene en el primero que no lo sea, aquí la `p`, devolviendo lo leído hasta ahí. El `0` inicial no lo vuelve octal: eso ocurría en motores antiguos y el estándar lo fijó en decimal salvo que se indique la base, `parseInt("08", 10)`. Devolvería `NaN` solo si no hubiera ningún dígito al principio, como en `parseInt("px8")`.
<!-- justificacion:fin -->

- [x] Aprobada

### 50 · m03#50

<!-- pregunta: json_2026#50 | just:d5be1e74d2df -->

Si un objeto se declara con `const`, ¿qué operaciones permanecen permitidas sobre él?

- `(a)` Ninguna: el objeto queda congelado y rechaza toda escritura posterior.
- `(b)` Solo la reasignación completa del identificador a otro objeto.
- `(c)` Modificar, agregar y eliminar propiedades, pero no reasignar el identificador.  **← correcta**
- `(d)` Únicamente la lectura de propiedades ya existentes al momento de declararlo.

<!-- justificacion:inicio -->
`const` protege la **asignación del identificador**, no el contenido del objeto. Se pueden modificar, agregar y borrar propiedades; lo que falla es `obj = otroObjeto`. Para impedir también los cambios internos existe `Object.freeze()`, que es otra cosa y hay que pedirla. Suponer que `const` congela el objeto es uno de los malentendidos más extendidos del lenguaje.
<!-- justificacion:fin -->

- [x] Aprobada

### 51 · M3-1

<!-- pregunta: js_2026#1 | just:2ce749edcd29 -->

En condicionales, ¿qué sucede al evaluar una expresión con coerción de tipos estricta (===)?

- `(a)` Convierte los tipos de datos antes de comparar sus valores.
- `(b)` Evalúa igualdad lógica y de tipo sin conversión implícita.  **← correcta**
- `(c)` Arroja un error de sintaxis si los tipos no coinciden.
- `(d)` Iguala a verdadero si al menos un operando es verdadero (truthy).

<!-- justificacion:inicio -->
`===` compara valor y tipo sin convertir nada: si los tipos difieren, el resultado es falso y ahí termina. Por eso `"5" === 5` da falso mientras `"5" == 5` da verdadero. La (a) describe a `==`, que es el operador contrario; la (c) inventa un error que no ocurre —comparar tipos distintos es legal—; y la (d) describe a `||`.
<!-- justificacion:fin -->

- [x] Aprobada

### 52 · M3-2

<!-- pregunta: js_2026#2 | just:54d36d98d4d0 -->

¿Qué evalúa correctamente la expresión 'typeof null' en JavaScript por un error histórico del lenguaje?

- `(a)` "null"
- `(b)` "undefined"
- `(c)` "object"  **← correcta**
- `(d)` "boolean"

<!-- justificacion:inicio -->
`typeof null` responde `"object"`, y es un error conocido que viene de la primera implementación de JavaScript en 1995: internamente los valores llevaban una etiqueta de tipo y la de `null` coincidía con la de los objetos. Nunca se arregló porque hacerlo rompería código existente. Para comprobar si algo es `null` hay que compararlo directo: `valor === null`.
<!-- justificacion:fin -->

- [x] Aprobada

### 53 · M3-3

<!-- pregunta: js_2026#3 | just:3cfc431df431 -->

¿Cuál es la precedencia al evaluar una expresión matemática compleja en código JavaScript?

- `(a)` Operadores lógicos antes que los aritméticos.
- `(b)` Multiplicación y división antes que sumas y restas.  **← correcta**
- `(c)` Asignación ocurre antes de la evaluación matemática.
- `(d)` Ejecución lineal estricta de izquierda a derecha siempre.

<!-- justificacion:inicio -->
Multiplicación y división se evalúan antes que suma y resta, y los paréntesis mandan sobre todo. Los operadores lógicos tienen precedencia **menor** que los aritméticos, así que la (a) está al revés; la asignación es de las últimas en evaluarse, no de las primeras; y la (d) describe una evaluación sin precedencia, que no es la de JavaScript ni la de la aritmética.
<!-- justificacion:fin -->

- [x] Aprobada

### 54 · M3-4

<!-- pregunta: js_2026#4 | just:9b3e14d762a7 -->

¿Qué método de arreglos elimina el último elemento y retorna su valor simultáneamente?

- `(a)` shift()
- `(b)` unshift()
- `(c)` push()
- `(d)` pop()  **← correcta**

<!-- justificacion:inicio -->
`pop()` quita el último elemento y devuelve ese elemento, así que sirve para sacar y usar en un solo paso. `shift()` hace lo mismo pero con el primero; `unshift()` agrega al principio; y `push()` agrega al final. Los cuatro modifican el arreglo original, y conviene aprenderlos por pares: `push`/`pop` al final, `unshift`/`shift` al principio.
<!-- justificacion:fin -->

- [x] Aprobada

### 55 · M3-5

<!-- pregunta: js_2026#5 | just:7a82b9476263 -->

¿Qué problema crítico ocurre al declarar variables iteradoras globales en ciclos anidados (for)?

- `(a)` Provoca un desbordamiento de pila instantáneo (Stack Overflow).
- `(b)` El ciclo interior modificará el contador del ciclo exterior.  **← correcta**
- `(c)` El navegador arroja un error de sintaxis bloqueante.
- `(d)` Convierte automáticamente el arreglo iterado en un objeto.

<!-- justificacion:inicio -->
Si los dos ciclos comparten la misma variable global como contador, el ciclo interior la deja en su valor final y el exterior continúa desde ahí, así que el exterior no completa sus vueltas. La salida es declarar el contador con `let` dentro de cada `for`, que le da a cada ciclo el suyo. No hay error de sintaxis ni desbordamiento: el programa corre y da un resultado equivocado, que es peor.
<!-- justificacion:fin -->

- [x] Aprobada

### 56 · M3-6

<!-- pregunta: js_2026#6 | just:a0cb947fac9c -->

¿Cuál es el riesgo de modificar un arreglo mientras se itera linealmente sobre él (ej: borrando)?

- `(a)` Puede saltar elementos y desfasar el índice del ciclo actual.  **← correcta**
- `(b)` Borrará el arreglo completo al detectar un cambio de longitud.
- `(c)` El arreglo se congela automáticamente y arroja excepción.
- `(d)` Duplica la memoria asignada al proceso del ciclo (Memory Leak).

<!-- justificacion:inicio -->
Al borrar un elemento, los que están detrás se corren una posición hacia atrás mientras el índice del ciclo sigue avanzando, así que el que ocupó el lugar del borrado se salta sin visitarse. Las salidas habituales son recorrer de atrás hacia adelante, o construir un arreglo nuevo con `filter()` en vez de modificar el que se está recorriendo.
<!-- justificacion:fin -->

- [x] Aprobada

### 57 · M3-7

<!-- pregunta: js_2026#7 | just:1e874f618ca9 -->

¿Qué ocurre con las variables declaradas dentro de una función regular utilizando 'var'?

- `(a)` Pasan a ser variables globales accesibles desde cualquier lugar.
- `(b)` Tienen alcance (scope) local restringido únicamente a esa función.  **← correcta**
- `(c)` Se bloquean y causan conflicto si existe una global igual.
- `(d)` Son de alcance de bloque y desaparecen tras un if interno.

<!-- justificacion:inicio -->
`var` tiene alcance de **función**: la variable existe en toda la función donde se declaró, y no fuera. Ese es su contraste con `let` y `const`, que tienen alcance de bloque y por eso desaparecen al cerrar un `if` o un `for`, lo que describe la (d). Y no se vuelve global: eso pasa al asignar sin declarar, que es otra cosa.
<!-- justificacion:fin -->

- [x] Aprobada

### 58 · M3-8

<!-- pregunta: js_2026#8 | just:040d800e886c -->

Si una función no tiene una sentencia return explícita, ¿qué valor retorna por defecto al invocarse?

- `(a)` false
- `(b)` null
- `(c)` undefined  **← correcta**
- `(d)` 0

<!-- justificacion:inicio -->
Sin `return`, la función devuelve `undefined`. Es el valor por omisión y no un caso especial. Los otros tres son valores concretos que alguien tendría que haber escrito: `null` significa vacío a propósito, `false` es un booleano y `0` un número. Reconocer un `undefined` inesperado suele ser la pista de que una función no devolvía lo que se creía.
<!-- justificacion:fin -->

- [x] Aprobada

### 59 · M3-9

<!-- pregunta: js_2026#9 | just:9b3b6c555dc0 -->

¿Cuál es el problema estructural causado por abusar de las variables globales en funciones?

- `(a)` Sobreescritura accidental y alta dependencia (acoplamiento).  **← correcta**
- `(b)` Desbordan la memoria de las tarjetas de video del usuario.
- `(c)` Bloquean automáticamente el acceso directo al árbol del DOM.
- `(d)` Generan un error de compilación al definir funciones anidadas.

<!-- justificacion:inicio -->
Cualquier función puede escribir una variable global, así que dos funciones que no se conocen pueden pisarse el valor; y como todas dependen del mismo estado compartido, quedan acopladas y no se pueden mover ni probar por separado. Las otras tres describen problemas inventados: las globales no tocan la memoria de video, no bloquean el DOM y no impiden anidar funciones.
<!-- justificacion:fin -->

- [x] Aprobada

### 60 · M3-10

<!-- pregunta: js_2026#10 | just:85a91c70fd9c -->

¿Cuál es la sintaxis correcta para acceder a un método interno de objeto mediante la notación de punto?

- `(a)` objeto-&gt;metodo()
- `(b)` objeto.metodo()  **← correcta**
- `(c)` objeto::metodo()
- `(d)` objeto[metodo()]

<!-- justificacion:inicio -->
La notación de punto es `objeto.metodo()`: el nombre del objeto, un punto, el nombre del método y los paréntesis que lo invocan. `->` es de PHP y C++, `::` es de C++ y de la sintaxis de clases de otros lenguajes, y `objeto[metodo()]` usa corchetes, que sí existen en JavaScript pero con otro sentido: ahí se evaluaría `metodo()` y su resultado se usaría como nombre de propiedad.
<!-- justificacion:fin -->

- [x] Aprobada

### 61 · M3-11

<!-- pregunta: js_2026#11 | just:e96fe0fddc17 -->

Al llamar String.prototype.slice(1, -1) en la cadena "Prueba", ¿qué porción de texto se retorna?

- `(a)` "rueb"  **← correcta**
- `(b)` "rueba"
- `(c)` "Prue"
- `(d)` "rue"

<!-- justificacion:inicio -->
Devuelve `"rueb"`. `slice(1, -1)` empieza en el índice 1, que es la `r`, y el `-1` cuenta desde el final, así que corta antes del último carácter y deja fuera la `a` final. La `P` inicial se pierde por empezar en 1 y la `a` final por el índice negativo. Poder usar índices negativos para contar desde atrás es lo que la pregunta evalúa, y es propio de `slice`: `substring` no lo admite.
<!-- justificacion:fin -->

- [x] Aprobada

---

## Lo que este documento no puede decidir

- **Si las justificaciones son ciertas.** Que existan se comprueba con un
  programa; que sean correctas no. Por eso las lees tú.
- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería
  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.
  Si la quieres, es una pasada editorial aparte.

