# Cuestionario de Evaluación - Módulo 3: Fundamentos de Programación en JavaScript (Nuevas Preguntas)

1. ¿Qué acción de seguridad está estrictamente bloqueada para JavaScript del lado del cliente en un navegador?
a) Compilar variables complejas de tipo objeto y arreglos iterativos.
b) Acceder a documentos de otras pestañas de distinto origen CORS.
c) Generar múltiples hilos asíncronos (Web Workers) para procesos.
d) Manipular hojas de estilo en cascada cargadas desde la misma raíz.
Respuesta: b) Acceder a documentos de otras pestañas de distinto origen CORS.

2. ¿Qué comando interrumpe la ejecución del código en el navegador levantando el panel de depuración nativo?
a) console.halt()
b) system.pause()
c) debugger;
d) process.stop()
Respuesta: c) debugger;

3. ¿Qué limitación sufre el entorno del navegador al ejecutar un script iterativo extremadamente denso?
a) Convierte automáticamente el ciclo a una ejecución asíncrona.
b) Bloquea el hilo principal congelando la interfaz visual del usuario.
c) Ignora el código sobrante tras superar el umbral de 100 megabytes.
d) Separa la ejecución enviando el proceso sobrante a un Service Worker.
Respuesta: b) Bloquea el hilo principal congelando la interfaz visual del usuario.

4. En una sentencia condicional, ¿qué evalúa lógicamente la expresión `NaN === NaN` en JavaScript?
a) Resulta false, ya que NaN nunca es estrictamente igual a sí mismo.
b) Retorna true debido a la coerción implícita de tipos abstractos.
c) Lanza un TypeError inmanejable deteniendo la compilación del V8.
d) Genera un valor undefined al ser una primitiva numérica incompatible.
Respuesta: a) Resulta false, ya que NaN nunca es estrictamente igual a sí mismo.

5. ¿Cuál es el único método global 100% confiable para validar si un valor es estrictamente NaN en JS?
a) Number.isNaN(valor)
b) isNaN(valor)
c) valor === NaN
d) Object.isNotNumber(valor)
Respuesta: a) Number.isNaN(valor)

6. En evaluaciones lógicas de control, ¿cuál de los siguientes grupos representa únicamente valores "falsy"?
a) "0", [], {}, false, undefined
b) 0, "", null, undefined, NaN, false
c) -1, "false", null, 0, NaN
d) 0, null, " ", [], false
Respuesta: b) 0, "", null, undefined, NaN, false

7. ¿Qué tipo de dato primitivo o abstracto retorna textualmente la expresión `typeof function(){}`?
a) "object"
b) "function"
c) "undefined"
d) "closure"
Respuesta: b) "function"

8. Al operar en "use strict", ¿qué ocurre si asignas un valor a una variable sin declararla previamente?
a) Se inicializa forzosamente como var en el scope de la función activa.
b) Genera una advertencia pasiva en consola y continúa su ejecución.
c) El motor lanza un ReferenceError bloqueando la asignación insegura.
d) Se crea como propiedad global anclada al objeto raíz de ejecución.
Respuesta: c) El motor lanza un ReferenceError bloqueando la asignación insegura.

9. ¿Cuál es el resultado de procesar la concatenación híbrida `1 + 2 + "3"` en el motor de JavaScript?
a) "123"
b) 6
c) "33"
d) NaN
Respuesta: c) "33"

10. ¿Qué entrega como resultado lógico la expresión algorítmica `"3" + 2 + 1` en JavaScript?
a) "33"
b) "321"
c) 6
d) "3210"
Respuesta: b) "321"

11. ¿Qué método verifica si dos valores son exactamente el mismo, resolviendo anomalías matemáticas de NaN y -0?
a) Object.is(val1, val2)
b) val1 === val2
c) Object.compare(val1, val2)
d) val1.equals(val2)
Respuesta: a) Object.is(val1, val2)

12. Para evaluar múltiples posibles valores exactos de una sola variable, ¿qué control de flujo es más óptimo?
a) if / else iterativamente anidados mutuamente.
b) Estructura repetitiva condicional do/while.
c) Control de flujo declarativo switch / case.
d) Operadores lógicos ternarios secuenciales y encadenados.
Respuesta: c) Control de flujo declarativo switch / case.

13. Al sumar un Number y un String con el operador "+", ¿qué comportamiento asume obligatoriamente el intérprete?
a) Suma matemáticamente forzando silenciosamente el String a entero.
b) Genera un error fatal de compilación por incompatibilidad de clases.
c) Aplica coerción implícita convirtiendo el número a texto y concatena.
d) Suprime el String y retorna exclusivamente la variable numérica nativa.
Respuesta: c) Aplica coerción implícita convirtiendo el número a texto y concatena.

14. ¿Qué ocurre si invocas el método nativo `shift()` sobre un arreglo que se encuentra totalmente vacío?
a) Lanza un RangeError crítico por desbordamiento de índice nativo.
b) Muta el arreglo agregando un elemento "empty" interno oculto.
c) Retorna undefined sin causar modificaciones ni errores estructurales.
d) Modifica la propiedad genérica length a un valor negativo negativo.
Respuesta: c) Retorna undefined sin causar modificaciones ni errores estructurales.

15. ¿Qué método integrado muta destructivamente un arreglo al invertir el orden de sus elementos in situ?
a) Array.prototype.reverse()
b) Array.prototype.invert()
c) Array.prototype.flip()
d) Array.prototype.sortDescending()
Respuesta: a) Array.prototype.reverse()

16. ¿Qué función nativa itera un array aplicando un acumulador para reducirlo a un solo valor final de salida?
a) map()
b) filter()
c) reduce()
d) accumulate()
Respuesta: c) reduce()

17. Dentro de ciclos `for` o `while`, ¿qué directriz cancela abruptamente toda la iteración actual y futura?
a) return
b) exit
c) break
d) continue
Respuesta: c) break

18. Si aplicas el bucle iterativo `for...in` sobre un arreglo estándar, ¿qué se itera exactamente en cada vuelta?
a) Las propiedades numéricas (índices) devueltas como cadenas de texto.
b) Los valores almacenados directamente en las posiciones del array.
c) Exclusivamente las funciones de prototipo anidadas dentro del array.
d) El tamaño total y atributos de metadatos ocultos del iterador base.
Respuesta: a) Las propiedades numéricas (índices) devueltas como cadenas de texto.

19. Para iterar directamente sobre los "valores" de un iterable (como un array), ¿qué bucle nativo es óptimo?
a) for...in
b) for...of
c) while...do
d) Object.values()
Respuesta: b) for...of

20. ¿Qué método itera un array y retorna uno nuevo solo con elementos que cumplan la condición del callback?
a) find()
b) filter()
c) grep()
d) every()
Respuesta: b) filter()

21. Al aplicar el método `.join("-")` sobre un arreglo poblado, ¿qué estructura de datos se obtiene?
a) Un objeto plano anidado utilizando guiones como identificadores.
b) Un array mutado que incluye guiones textuales entre sus posiciones.
c) Una única cadena de texto con todos los elementos unidos por guiones.
d) Un flujo binario (Stream) separado iterativamente por secuencias fijas.
Respuesta: c) Una única cadena de texto con todos los elementos unidos por guiones.

22. ¿Qué método de Array evalúa si "al menos un" elemento cumple con la condición estipulada en su callback?
a) some()
b) every()
c) includes()
d) contains()
Respuesta: a) some()

23. ¿Qué método añade dinámicamente uno o más elementos al "inicio" del arreglo y empuja a los demás hacia la derecha?
a) pop()
b) unshift()
c) push()
d) shift()
Respuesta: b) unshift()

24. ¿Cómo se llama la cualidad técnica que permite a una función recordar el entorno léxico en el que fue creada?
a) Herencia prototípica mutante (Prototypal Inheritance).
b) Encapsulamiento funcional estricto (Strict Encapsulation).
c) Clausura o cierre léxico (Closure estructural).
d) Elevación funcional retardada (Delayed Hoisting).
Respuesta: c) Clausura o cierre léxico (Closure estructural).

25. Si invocas a una función JS estándar precedida por el operador `new`, ¿qué valor devuelve implícitamente?
a) El tipo de objeto predeterminado "undefined" sin referencias.
b) Una instancia objeto recién creada anclada a ese constructor.
c) La misma función ejecutada dos veces para forzar su validación.
d) Un clon asíncrono y anónimo del entorno de ejecución global window.
Respuesta: b) Una instancia objeto recién creada anclada a ese constructor.

26. ¿Qué función global de JS sirve para decodificar una URI previamente codificada y devolver su texto legible?
a) decodeURIComponent()
b) unescapeStringURI()
c) parseURLEncoded()
d) atob()
Respuesta: a) decodeURIComponent()

27. Si usas la directiva `return` dentro de un bucle `for` perteneciente a una función, ¿qué sucede en ejecución?
a) El ciclo omite esa vuelta temporal y continúa forzosamente el resto.
b) El ciclo y la función finalizan inmediatamente, retornando el valor.
c) La función devuelve error sintáctico por mezclar bucles con retornos.
d) Solo finaliza el bucle, continuando con el resto del código inferior.
Respuesta: b) El ciclo y la función finalizan inmediatamente, retornando el valor.

28. Si invocas una función no vinculada en un contexto global bajo la directiva "use strict", ¿qué asume `this`?
a) window
b) undefined
c) null
d) globalThis
Respuesta: b) undefined

29. ¿Qué método permite llamar a una función fijando manualmente su `this` y enviando argumentos en un arreglo?
a) call()
b) bind()
c) invoke()
d) apply()
Respuesta: d) apply()

30. En ES6, si un parámetro de función posee un valor por defecto, ¿qué argumento específico de entrada activa ese valor?
a) null o undefined indistintamente en la evaluación en tiempo real.
b) Exclusivamente la inserción del valor primitivo undefined.
c) false, 0, "", null o undefined (cualquiera que sea evaluado falsy).
d) Cualquier tipo de objeto vacío ({}) insertado desde el exterior.
Respuesta: b) Exclusivamente la inserción del valor primitivo undefined.

31. ¿Qué tipo de funciones sufren hoisting de tal modo que permiten invocarlas antes de su línea de definición?
a) Expresiones de función anonimizadas (Function Expressions).
b) Funciones flecha de resolución compacta (Arrow Functions).
c) Declaraciones de función formales (Function Declarations).
d) Métodos de objeto instanciados dinámicamente en memoria.
Respuesta: c) Declaraciones de función formales (Function Declarations).

32. ¿Qué operador lógico valida directamente si una clave o propiedad específica existe nativamente en un objeto JS?
a) exists
b) in
c) hasOwnProperty
d) instanceof
Respuesta: b) in

33. Al procesar un objeto complejo con `Object.keys()`, ¿qué información y estructura puntual extrae el compilador?
a) Un arreglo enumerando solamente los nombres (claves) de sus propiedades.
b) Una cadena de texto plana con las llaves y valores separados por coma.
c) Un nuevo objeto genérico plano carente de funciones iterativas anidadas.
d) Una matriz bidimensional compacta con el par identificador y referencia.
Respuesta: a) Un arreglo enumerando solamente los nombres (claves) de sus propiedades.

34. ¿Qué método nativo fusiona objetos volcando las propiedades iterables de varios orígenes en un solo destino?
a) Object.merge()
b) Object.assign()
c) Object.concat()
d) Object.combine()
Respuesta: b) Object.assign()

35. ¿Qué resultado matemático exacto produce la ejecución de la sentencia nativa estandarizada `Math.pow(2, 3)`?
a) 6
b) 9
c) 8
d) 16
Respuesta: c) 8

36. ¿Qué función de la clase preconstruida `Math` retorna siempre el equivalente absoluto (positivo) de un número?
a) Math.positive()
b) Math.abs()
c) Math.sign()
d) Math.absolute()
Respuesta: b) Math.abs()

37. Sin utilizar expresiones regulares globales (regex), ¿qué método de `String` reemplaza solo la primera coincidencia?
a) change()
b) replace()
c) replaceFirst()
d) modify()
Respuesta: b) replace()

38. Al procesar la instrucción en consola `"a,b,c".split(",")`, ¿qué estructura de datos genera el entorno de ejecución?
a) Un arreglo ordenado con tres strings individuales: ["a", "b", "c"].
b) Un objeto literal abstracto con claves indexadas numéricamente nativas.
c) Una tupla inmutable de tres caracteres continuos sin valor relacional.
d) Una única cadena de texto estática suprimida de todas sus comas.
Respuesta: a) Un arreglo ordenado con tres strings individuales: ["a", "b", "c"].

39. ¿Qué método nativo de String depura una cadena eliminando exclusivamente los espacios en blanco al inicio y al final?
a) stripSpaces()
b) clear()
c) sliceWhitespace()
d) trim()
Respuesta: d) trim()

40. Como curiosidad técnica del lenguaje, ¿qué devuelve implícitamente `Math.max()` si se invoca sin enviarle argumentos?
a) undefined
b) NaN
c) -Infinity
d) 0
Respuesta: c) -Infinity
