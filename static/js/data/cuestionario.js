/**
 * Banco de preguntas del cuestionario de práctica.
 * Generado desde los cuestionarios en markdown de cada módulo del plan formativo.
 * `correcta` es el índice de la alternativa correcta dentro de `opciones`.
 */
export const cuestionario = [
  {
    "modulo": "Módulo 2",
    "titulo": "Fundamentos de Desarrollo Front-End",
    "icono": "devices",
    "preguntas": [
      {
        "q": "¿Cuál es la principal responsabilidad arquitectónica del rol Front-End en una aplicación web moderna?",
        "opciones": [
          "Gestionar la lógica de negocio y la base de datos central.",
          "Renderizar la interfaz y gestionar la interacción del usuario.",
          "Configurar el servidor web y los protocolos de red TCP/IP.",
          "Orquestar contenedores Docker para el despliegue continuo."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué etiqueta HTML agrupa campos y etiquetas asociadas dentro de un formulario?",
        "opciones": [
          "<fieldset>",
          "<section>",
          "<hgroup>",
          "<article>"
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "En el modelo de cajas CSS, ¿qué propiedad incluye el padding y el border dentro del ancho total declarado?",
        "opciones": [
          "box-sizing: content-box;",
          "box-sizing: border-box;",
          "display: inline-block;",
          "overflow: inner-box;"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Cuál selector CSS posee mayor especificidad entre un ID, una clase, un elemento y un pseudo-elemento?",
        "opciones": [
          "El selector de elementos básicos.",
          "El selector de clases y atributos.",
          "El selector de identificadores (ID).",
          "El selector de pseudo-elementos."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué regla CSS se utiliza para aplicar estilos condicionales basados en el ancho de la pantalla?",
        "opciones": [
          "@media screen and (max-width: 768px)",
          "@responsive query min-width 768px",
          "@viewport device-width = 768px",
          "@screen layout condition (768px)"
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "En el sistema de grillas de Bootstrap, ¿en cuántas columnas iguales se divide por defecto una fila?",
        "opciones": [
          "En 8 columnas flexibles.",
          "En 12 columnas flexibles.",
          "En 10 columnas flexibles.",
          "En 16 columnas flexibles."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué método nativo de JavaScript retorna el primer elemento que coincida con un selector CSS específico?",
        "opciones": [
          "document.getElementById()",
          "document.getElementsByClassName()",
          "document.querySelector()",
          "document.querySelectorAll()"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué evento de JavaScript se dispara inmediatamente cuando un elemento HTML pierde el foco?",
        "opciones": [
          "El evento blur",
          "El evento focus",
          "El evento change",
          "El evento input"
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "¿Cuál es el ámbito (scope) de una variable declarada con la palabra clave let dentro de un bloque?",
        "opciones": [
          "Ámbito global en todo el documento script.",
          "Ámbito de función dentro de la función padre.",
          "Ámbito de bloque delimitado por llaves {}.",
          "Ámbito léxico accesible solo en el módulo."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "En jQuery, ¿qué método se utiliza para cambiar o extraer el contenido HTML interno de un elemento?",
        "opciones": [
          "El método .text()",
          "El método .html()",
          "El método .val()",
          "El método .attr()"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Cómo se asocia un evento de clic a un botón utilizando la sintaxis estándar de la librería jQuery?",
        "opciones": [
          "$(\"button\").click(function() { })",
          "document.addEventListener(\"click\")",
          "$(\"button\").onEvent(\"click\")",
          "jQuery.bindClick(\"button\")"
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "¿Qué comando de Git registra oficialmente los cambios preparados (staging) en el repositorio local?",
        "opciones": [
          "git add .",
          "git commit -m \"mensaje\"",
          "git push origin main",
          "git status"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué comando de Git permite crear una nueva rama y cambiar a ella de manera simultánea?",
        "opciones": [
          "git branch -n <rama>",
          "git checkout -b <rama>",
          "git switch --create <rama>",
          "Ambas B y C son correctas."
        ],
        "correcta": 3,
        "fijo": true
      },
      {
        "q": "En GitHub, ¿qué propósito principal cumple la creación de un Pull Request (PR)?",
        "opciones": [
          "Descargar código remoto al disco duro.",
          "Solicitar la integración de ramas y revisión.",
          "Forzar el borrado de una rama en conflicto.",
          "Sincronizar tags de versiones estables."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué sucede cuando Git detecta modificaciones concurrentes en la misma línea durante una unión?",
        "opciones": [
          "Sobrescribe automáticamente el archivo nuevo.",
          "Genera un conflicto que requiere edición manual.",
          "Cancela la operación y elimina el repositorio.",
          "Crea un branch temporal de respaldo oculto."
        ],
        "correcta": 1,
        "fijo": false
      }
    ]
  },
  {
    "modulo": "Módulo 3",
    "titulo": "Fundamentos de Programación en JavaScript",
    "icono": "data-object",
    "preguntas": [
      {
        "q": "¿Qué limitación estricta de seguridad tiene JavaScript al ejecutarse nativamente en el navegador web?",
        "opciones": [
          "No puede manipular el DOM asíncronamente.",
          "No tiene acceso directo al sistema de archivos local del usuario.",
          "Está bloqueado para realizar peticiones HTTP (AJAX).",
          "No puede ejecutarse en la consola para depurar variables."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Cuál es el motor de JavaScript que utiliza Google Chrome para su entorno de ejecución web?",
        "opciones": [
          "SpiderMonkey",
          "ChakraCore",
          "Motor V8",
          "JavaScriptCore"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "En condicionales, ¿qué sucede al evaluar una expresión con coerción de tipos estricta (===)?",
        "opciones": [
          "Convierte los tipos de datos antes de comparar sus valores.",
          "Evalúa igualdad lógica y de tipo sin conversión implícita.",
          "Arroja un error de sintaxis si los tipos no coinciden.",
          "Iguala a verdadero si al menos un operando es verdadero (truthy)."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué evalúa correctamente la expresión 'typeof null' en JavaScript por un error histórico del lenguaje?",
        "opciones": [
          "\"null\"",
          "\"undefined\"",
          "\"object\"",
          "\"boolean\""
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Cuál es la precedencia al evaluar una expresión matemática compleja en código JavaScript?",
        "opciones": [
          "Operadores lógicos antes que los aritméticos.",
          "Multiplicación y división antes que sumas y restas.",
          "Asignación ocurre antes de la evaluación matemática.",
          "Ejecución lineal estricta de izquierda a derecha siempre."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué método de arreglos elimina el último elemento y retorna su valor simultáneamente?",
        "opciones": [
          "shift()",
          "unshift()",
          "push()",
          "pop()"
        ],
        "correcta": 3,
        "fijo": false
      },
      {
        "q": "¿Qué problema crítico ocurre al declarar variables iteradoras globales en ciclos anidados (for)?",
        "opciones": [
          "Provoca un desbordamiento de pila instantáneo (Stack Overflow).",
          "El ciclo interior modificará el contador del ciclo exterior.",
          "El navegador arroja un error de sintaxis bloqueante.",
          "Convierte automáticamente el arreglo iterado en un objeto."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué característica define el comportamiento único del ciclo do/while respecto al ciclo while?",
        "opciones": [
          "Comprueba la condición antes de ejecutar el bloque interior.",
          "Ejecuta el bloque al menos una vez sin evaluar la condición.",
          "Solo permite iterar sobre objetos literales, no sobre arreglos.",
          "Se utiliza exclusivamente para iterar respuestas asíncronas lentas."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Cuál es el riesgo de modificar un arreglo mientras se itera linealmente sobre él (ej: borrando)?",
        "opciones": [
          "Puede saltar elementos y desfasar el índice del ciclo actual.",
          "Borrará el arreglo completo al detectar un cambio de longitud.",
          "El arreglo se congela automáticamente y arroja excepción.",
          "Duplica la memoria asignada al proceso del ciclo (Memory Leak)."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "¿Qué ocurre con las variables declaradas dentro de una función regular utilizando 'var'?",
        "opciones": [
          "Pasan a ser variables globales accesibles desde cualquier lugar.",
          "Tienen alcance (scope) local restringido únicamente a esa función.",
          "Se bloquean y causan conflicto si existe una global igual.",
          "Son de alcance de bloque y desaparecen tras un if interno."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "Si una función no tiene una sentencia return explícita, ¿qué valor retorna por defecto al invocarse?",
        "opciones": [
          "false",
          "null",
          "undefined",
          "0"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Cuál es el problema estructural causado por abusar de las variables globales en funciones?",
        "opciones": [
          "Sobreescritura accidental y alta dependencia (acoplamiento).",
          "Desbordan la memoria de las tarjetas de video del usuario.",
          "Bloquean automáticamente el acceso directo al árbol del DOM.",
          "Generan un error de compilación al definir funciones anidadas."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "¿Cuál es la sintaxis correcta para acceder a un método interno de objeto mediante la notación de punto?",
        "opciones": [
          "objeto->metodo()",
          "objeto.metodo()",
          "objeto::metodo()",
          "objeto[metodo()]"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué método del objeto Math retorna el valor de un número decimal redondeado al entero superior?",
        "opciones": [
          "Math.floor()",
          "Math.round()",
          "Math.ceil()",
          "Math.trunc()"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "Al llamar String.prototype.slice(1, -1) en la cadena \"Prueba\", ¿qué porción de texto se retorna?",
        "opciones": [
          "\"rueb\"",
          "\"rueba\"",
          "\"Prue\"",
          "\"rue\""
        ],
        "correcta": 0,
        "fijo": false
      }
    ]
  },
  {
    "modulo": "Módulo 4",
    "titulo": "Programación Avanzada en JavaScript",
    "icono": "bolt",
    "preguntas": [
      {
        "q": "¿Cómo implementa internamente JavaScript la herencia entre objetos sin usar la sintaxis de clases de ES6?",
        "opciones": [
          "Copiando propiedades estáticas al instanciar.",
          "Mediante la cadena de prototipos (prototype chain).",
          "A través de la clonación profunda de JSON.",
          "Utilizando clases abstractas nativas."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "En formato JSON válido, ¿cuál es la regla estricta para escribir los nombres de las claves (keys)?",
        "opciones": [
          "Pueden ir sin comillas si no contienen espacios.",
          "Deben usar comillas simples exclusivamente.",
          "Deben escribirse obligatoriamente con comillas dobles.",
          "Requieren notación de corchetes en cada atributo."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué pilar de la POO permite que objetos de distintas clases respondan a una misma invocación de método?",
        "opciones": [
          "Encapsulamiento",
          "Herencia múltiple",
          "Polimorfismo",
          "Abstracción estructural"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué ocurre si declaramos una variable con let e intentamos acceder a ella antes de su inicialización?",
        "opciones": [
          "Retorna undefined por defecto.",
          "Lanza un ReferenceError por la Temporal Dead Zone.",
          "Asigna valor nulo hasta su primer uso en código.",
          "Se eleva (hoisting) permitiendo su lectura temprana."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué diferencia principal tiene una función flecha (arrow function) frente a una función tradicional?",
        "opciones": [
          "Las funciones flecha no tienen su propio contexto 'this'.",
          "Retornan siempre un objeto JSON estructurado.",
          "Obligan el uso de la palabra reservada 'function'.",
          "Solo pueden recibir un máximo de tres parámetros."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "En módulos ES6, ¿qué sintaxis permite exportar múltiples funciones nombradas desde un mismo archivo?",
        "opciones": [
          "export default { func1, func2 };",
          "module.exports = [func1, func2];",
          "export { func1, func2 };",
          "require(func1, func2);"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué fase del flujo de eventos del DOM ocurre propagándose desde el elemento objetivo hacia la raíz?",
        "opciones": [
          "Fase de captura (Capturing phase).",
          "Fase de destino (Target phase).",
          "Fase de delegación (Delegation phase).",
          "Fase de burbujeo (Bubbling phase)."
        ],
        "correcta": 3,
        "fijo": false
      },
      {
        "q": "¿Qué método detiene el comportamiento por defecto de un evento, como el refresco al enviar un formulario?",
        "opciones": [
          "event.stopPropagation()",
          "event.preventDefault()",
          "event.stopImmediatePropagation()",
          "event.cancelEvent()"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Cuál es la estrategia más óptima para añadir eventos a múltiples elementos hijos generados dinámicamente?",
        "opciones": [
          "Asignar un evento individual a cada elemento creado.",
          "Utilizar delegación de eventos en un contenedor padre.",
          "Reemplazar el DOM completo con innerHTML en cada clic.",
          "Invocar addEventListener dentro de un ciclo infinito."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué problema estructural del código resuelve principalmente el uso de Promesas frente a Callbacks clásicos?",
        "opciones": [
          "El consumo excesivo de memoria RAM del navegador.",
          "El \"Callback Hell\" o anidamiento excesivo de código.",
          "El bloqueo del hilo principal (Main Thread).",
          "La imposibilidad de ejecutar instrucciones sincrónicas."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿En qué estado interno queda una Promesa que ha completado su operación asíncrona con éxito?",
        "opciones": [
          "Pending",
          "Fulfilled",
          "Rejected",
          "Settled"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué estructura de control es necesaria para capturar errores de ejecución utilizando async/await?",
        "opciones": [
          "Bloques if/else anidados exhaustivos.",
          "Condicionales switch/case por código de error.",
          "El bloque try/catch en la función asíncrona.",
          "El método callback .catch() encadenado."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "A diferencia de XHR, ¿qué tipo de objeto nativo retorna por defecto la API Fetch al ser ejecutada?",
        "opciones": [
          "Un objeto literal XMLHttpRequest.",
          "Un objeto JSON parseado automáticamente.",
          "Una Promesa (Promise).",
          "Una función Callback de respuesta."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "Usando Fetch, ¿qué estado asume la promesa si el servidor responde con un error HTTP 404 (Not Found)?",
        "opciones": [
          "Se rechaza inmediatamente (Rejected).",
          "Lanza una excepción de red nativa bloqueante.",
          "Se resuelve (Fulfilled) pero su propiedad ok es falsa.",
          "Queda en estado Pending hasta recibir un código 200."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué objeto nativo del navegador permite cancelar explícitamente una petición Fetch que está en progreso?",
        "opciones": [
          "AbortController",
          "XMLHttpRequest.abort()",
          "EventTarget",
          "Promise.reject()"
        ],
        "correcta": 0,
        "fijo": false
      }
    ]
  },
  {
    "modulo": "Módulo 5",
    "titulo": "Fundamentos de Bases de Datos Relacionales",
    "icono": "database",
    "preguntas": [
      {
        "q": "¿Qué propiedad de un RDBMS asegura que una transacción se complete totalmente o no se aplique en absoluto?",
        "opciones": [
          "Consistencia de datos.",
          "Aislamiento (Isolation).",
          "Atomicidad (Atomicity).",
          "Durabilidad (Durability)."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Cuál es el propósito principal del \"journaling\" o registro de transacciones en un RDBMS?",
        "opciones": [
          "Optimizar la velocidad de lectura de las tablas indexadas.",
          "Evitar la fragmentación del disco duro del servidor web.",
          "Garantizar la recuperación ante fallos y la durabilidad.",
          "Encriptar automáticamente las contraseñas de los usuarios."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué tipo de JOIN devuelve todas las filas de la tabla izquierda y las coincidencias de la derecha?",
        "opciones": [
          "INNER JOIN",
          "LEFT OUTER JOIN",
          "RIGHT OUTER JOIN",
          "FULL OUTER JOIN"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué cláusula SQL permite filtrar los resultados resultantes de una función de agrupación como SUM()?",
        "opciones": [
          "WHERE",
          "ORDER BY",
          "HAVING",
          "GROUP FILTER"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué ocurre si omites la condición de unión (ON o WHERE) al realizar una consulta a múltiples tablas?",
        "opciones": [
          "La consulta produce un producto cartesiano (Cross Join).",
          "El motor asume un INNER JOIN por la clave primaria.",
          "La base de datos arroja un error de sintaxis bloqueante.",
          "Solo se devuelven las filas de la primera tabla listada."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "En sentencias DML, ¿qué comando deshace los cambios no confirmados de la transacción actual en curso?",
        "opciones": [
          "UNDO TRANSACTION",
          "DROP COMMIT",
          "ROLLBACK",
          "REVERT STATE"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué problema de concurrencia evita la propiedad de \"aislamiento\" (isolation) en las transacciones?",
        "opciones": [
          "Lecturas sucias y modificaciones fantasma no confirmadas.",
          "Pérdida total de datos ante un corte de energía eléctrica.",
          "El desbordamiento de memoria caché por consultas pesadas.",
          "Duplicidad estricta de las llaves primarias de una tabla."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "Si ejecutas un DELETE sin cláusula WHERE, y logras hacer COMMIT, ¿qué efecto tiene en la tabla?",
        "opciones": [
          "La tabla es eliminada completamente de la base de datos.",
          "Todos los registros se borran, pero la estructura queda.",
          "El comando falla por violación estricta de seguridad.",
          "Solo se borra el último registro ingresado a la tabla."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué comando DDL se utiliza para eliminar completamente la estructura de una tabla y sus datos?",
        "opciones": [
          "TRUNCATE TABLE",
          "DELETE TABLE",
          "DROP TABLE",
          "REMOVE TABLE"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué restricción DDL asegura la integridad referencial obligando a que el valor exista en otra tabla?",
        "opciones": [
          "UNIQUE CONSTRAINT",
          "PRIMARY KEY",
          "FOREIGN KEY",
          "CHECK CONSTRAINT"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "A diferencia de DELETE, ¿por qué la sentencia TRUNCATE TABLE suele ser más rápida y eficiente?",
        "opciones": [
          "Porque elimina todo sin generar logs individuales por fila.",
          "Porque borra la estructura sin afectar a los datos reales.",
          "Porque se ejecuta en memoria caché y no en el disco físico.",
          "Porque solo borra temporalmente mediante un alias de vista."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "En el modelamiento conceptual, ¿cómo se denomina a una entidad cuya existencia depende de otra entidad?",
        "opciones": [
          "Entidad Abstracta",
          "Entidad Débil",
          "Entidad Polimórfica",
          "Entidad Recursiva"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Cuál es el objetivo principal de aplicar la Tercera Forma Normal (3FN) a una base de datos relacional?",
        "opciones": [
          "Permitir la creación ilimitada de llaves foráneas.",
          "Acelerar el procesamiento de los JOINs en consultas lentas.",
          "Eliminar redundancias y dependencias transitivas de datos.",
          "Cifrar automáticamente todas las contraseñas almacenadas."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "En un modelo relacional físico, ¿cómo se suele resolver una relación de \"muchos a muchos\"?",
        "opciones": [
          "Duplicando la llave primaria en ambas tablas directamente.",
          "Utilizando arreglos JSON dentro de una sola celda de tabla.",
          "Creando una tercera tabla intermedia que asocie ambas llaves.",
          "Creando restricciones CHECK cruzadas entre las dos tablas."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué elemento central documenta formalmente las tablas, atributos, tipos de datos y sus restricciones?",
        "opciones": [
          "El mapa conceptual físico.",
          "El diccionario de datos.",
          "El log de transacciones.",
          "El árbol de dependencias."
        ],
        "correcta": 1,
        "fijo": false
      }
    ]
  },
  {
    "modulo": "Módulo 6",
    "titulo": "Desarrollo de Aplicaciones Web Node Express",
    "icono": "dns",
    "preguntas": [
      {
        "q": "¿Cuál es el comportamiento nativo principal del Event Loop en la arquitectura de un proceso Node.js?",
        "opciones": [
          "Asigna un hilo del procesador por cada petición entrante.",
          "Ejecuta tareas síncronas en un único hilo bloqueante.",
          "Gestiona múltiples peticiones concurrentes en un único hilo.",
          "Delega el ruteo web directamente al motor V8 de Google."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué patrón estructural fundamental define a un middleware dentro del ciclo de vida de Express?",
        "opciones": [
          "Una base de datos en memoria para almacenar sesiones.",
          "Un motor de renderizado exclusivo para archivos HTML puros.",
          "Una función que intercepta peticiones antes del controlador.",
          "Un proceso independiente para balanceo de carga."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué diferencia principal existe entre instrucciones \"blocking\" y \"non-blocking\" en el ciclo de Node?",
        "opciones": [
          "Las non-blocking detienen el flujo principal de ejecución.",
          "Las blocking impiden que otras tareas se ejecuten en el hilo.",
          "Las non-blocking consumen toda la memoria RAM disponible.",
          "Las blocking delegan la tarea a un proceso Worker externo."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué herramienta detiene y reinicia automáticamente un proceso Node.js al detectar cambios en el código?",
        "opciones": [
          "morgan",
          "express-generator",
          "yargs",
          "nodemon"
        ],
        "correcta": 3,
        "fijo": false
      },
      {
        "q": "¿Qué comando NPM instala una dependencia asegurando que no se actualice su versión mayor accidentalmente?",
        "opciones": [
          "npm install <paquete> --no-update",
          "npm install <paquete> --save-exact",
          "npm add <paquete> --strict",
          "npm update <paquete> --freeze"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Dónde registra NPM por defecto la metainformación y versiones de los paquetes instalados localmente?",
        "opciones": [
          "En el archivo config.env de la raíz del proyecto.",
          "En el registro global de variables de entorno del sistema.",
          "En el archivo de configuración package.json del proyecto.",
          "Dentro de la carpeta estática bin/node_modules."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "En Handlebars, ¿qué sintaxis permite renderizar una variable escapando automáticamente el código HTML?",
        "opciones": [
          "{{{variable}}}",
          "<% variable %>",
          "{{variable}}",
          "${variable}"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué ventaja arquitectónica ofrece el uso de \"partials\" al construir vistas con motores de plantillas?",
        "opciones": [
          "Minifican automáticamente el código CSS y JS de la vista.",
          "Permiten reutilizar bloques de código en múltiples vistas.",
          "Ejecutan código SQL directamente desde la vista del cliente.",
          "Transforman la aplicación a un framework de Single Page App."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué elemento de Handlebars permite ejecutar lógica personalizada para procesar datos antes de renderizarlos?",
        "opciones": [
          "Los middlewares",
          "Los helpers",
          "Los routers",
          "Los partials abstractos"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué módulo nativo de Node.js es indispensable para leer y escribir objetos JSON en archivos del sistema?",
        "opciones": [
          "path",
          "http",
          "fs (file system)",
          "os"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué operación crítica debes realizar antes de guardar un objeto JavaScript en un archivo de texto plano?",
        "opciones": [
          "Cifrar el objeto usando el algoritmo bcrypt de forma segura.",
          "Transformarlo a cadena de texto usando JSON.stringify().",
          "Parsear el objeto a formato binario mediante Buffer.alloc().",
          "Inyectar la llave pública del servidor en el propio objeto."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "Al leer un archivo plano con JSON.parse(), ¿qué riesgo principal existe si el archivo está corrupto?",
        "opciones": [
          "Borra automáticamente el archivo del disco para protegerlo.",
          "Lanza una excepción síncrona que puede detener la app.",
          "Retorna un objeto nulo silenciosamente sin avisar al usuario.",
          "Inyecta código malicioso directo al motor de base de datos."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué utilidad tiene el paquete \"yargs\" al levantar una aplicación Node.js desde la consola de comandos?",
        "opciones": [
          "Facilita el paso y la validación de parámetros de entrada.",
          "Inicia un servidor FTP paralelo para recibir archivos.",
          "Limpia los mensajes de error ilegibles de console.log.",
          "Permite compilar el código de JavaScript a binario nativo."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "¿Qué técnica ayuda a diferenciar niveles de error en la salida de consola al depurar una app Node.js?",
        "opciones": [
          "Exportar todo el log como un archivo PDF firmado digitalmente.",
          "Utilizar colores y formateo con librerías externas.",
          "Escribir siempre los mensajes de error en formato XML nativo.",
          "Evitar console.log y usar alertas nativas del sistema."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "Al depurar código asíncrono, ¿por qué los errores en un callback pueden no detener la app principal?",
        "opciones": [
          "Porque Express auto-reinicia la aplicación inmediatamente.",
          "Porque Node ignora cualquier error fuera del archivo index.js.",
          "Porque el error ocurre en un contexto asíncrono independiente.",
          "Porque NPM oculta los errores de librerías de terceros."
        ],
        "correcta": 2,
        "fijo": false
      }
    ]
  },
  {
    "modulo": "Módulo 7",
    "titulo": "Acceso a Datos en Aplicaciones Node",
    "icono": "layers",
    "preguntas": [
      {
        "q": "¿Cuál es la principal ventaja técnica de usar un \"Pool\" de conexiones frente a conexiones simples?",
        "opciones": [
          "Cifra automáticamente el tráfico hacia la base de datos.",
          "Reutiliza conexiones activas evitando sobrecarga del servidor.",
          "Permite ejecutar consultas SQL sin validación previa.",
          "Elimina la necesidad de definir variables de entorno."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué sucede internamente al invocar client.release() tras usar una conexión de un Pool con 'pg'?",
        "opciones": [
          "Se destruye físicamente la conexión con el servidor.",
          "Devuelve la conexión al pool para que sea reutilizada.",
          "Obliga a cerrar todas las transacciones pendientes.",
          "Borra la caché de consultas precompiladas del cliente."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué técnica fundamental evita ataques de Inyección SQL en consultas utilizando el paquete 'pg'?",
        "opciones": [
          "Sanitizar variables usando expresiones regulares nativas.",
          "Usar consultas parametrizadas o Prepared Statements.",
          "Concatenar cadenas con el operador \"+\" estrictamente.",
          "Bloquear todas las peticiones con sentencias DROP o DELETE."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "En Node, ¿cuándo es imperativo utilizar cursores en lugar de consultas tradicionales (client.query)?",
        "opciones": [
          "Cuando se insertan múltiples filas en una sola query.",
          "Para procesar conjuntos de datos masivos sin saturar la RAM.",
          "Al ejecutar comandos DDL como CREATE TABLE o ALTER.",
          "Siempre que se utilicen transacciones asíncronas anidadas."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué ventaja ofrece usar async/await frente a callbacks al realizar múltiples consultas consecutivas?",
        "opciones": [
          "Incrementa exponencialmente el rendimiento del motor.",
          "Evita el Callback Hell manteniendo un flujo asíncrono legible.",
          "Cierra la conexión automáticamente tras cada bloque await.",
          "Compila las consultas a binario antes de enviarlas al server."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "Usando 'pg', ¿cómo se obtiene el ID generado automáticamente tras un INSERT en PostgreSQL?",
        "opciones": [
          "Consultando la vista global de variables de sesión.",
          "Agregando la cláusula RETURNING a la sentencia SQL.",
          "Invocando la función interna GET_LAST_ID() de PostgreSQL.",
          "Leyendo la propiedad nativa 'lastInsertId' del objeto Result."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "En el objeto Result devuelto por un UPDATE o DELETE, ¿qué propiedad indica las filas afectadas?",
        "opciones": [
          "Result.rowsAffected",
          "Result.rowCount",
          "Result.changedRows",
          "Result.length"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué comando SQL marca el inicio formal de un bloque transaccional en PostgreSQL?",
        "opciones": [
          "START TRANSACTION",
          "BEGIN",
          "INIT TRANSACTION",
          "OPEN SESSION"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "Si ocurre un error en la tercera consulta de una transacción, ¿qué instrucción debe ejecutarse?",
        "opciones": [
          "COMMIT PARCIAL",
          "ROLLBACK",
          "DROP TRANSACTION",
          "REVERT CACHE"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué propiedad de las transacciones (ACID) garantiza que los datos no se modifiquen a medias?",
        "opciones": [
          "Consistencia (Consistency)",
          "Atomicidad (Atomicity)",
          "Aislamiento (Isolation)",
          "Durabilidad (Durability)"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué representa principalmente un \"Modelo\" dentro del ecosistema del ORM Sequelize?",
        "opciones": [
          "Una conexión activa con la base de datos PostgreSQL.",
          "Una abstracción de una tabla que permite operar con objetos.",
          "Un middleware que filtra consultas maliciosas (Injection).",
          "Una función genérica para crear vistas relacionales SQL."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué método de Sequelize se utiliza típicamente para actualizar registros existentes en la BD?",
        "opciones": [
          "Model.saveChanges()",
          "Model.modify()",
          "Model.update()",
          "Model.set()"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "En Sequelize, ¿qué método define el lado \"1\" de una relación uno a muchos (1:N)?",
        "opciones": [
          "belongsToMany()",
          "hasMany()",
          "hasOne()",
          "belongsTo()"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "Para crear una relación N:M en Sequelize, ¿qué parámetro adicional es obligatorio en la asociación?",
        "opciones": [
          "La definición de una tabla intermedia con la opción \"through\".",
          "Un índice agrupado (clustered index) en ambas tablas.",
          "Una función recursiva definida como un hook global.",
          "Declarar llaves primarias compuestas en cada modelo base."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "Al realizar lecturas en Sequelize, ¿qué opción permite incluir objetos de modelos relacionados (Joins)?",
        "opciones": [
          "associations: true",
          "include",
          "fetchRelated",
          "join: 'all'"
        ],
        "correcta": 1,
        "fijo": false
      }
    ]
  },
  {
    "modulo": "Módulo 8",
    "titulo": "Implementación de API Backend Node Express",
    "icono": "shield-lock",
    "preguntas": [
      {
        "q": "¿Qué principio arquitectónico REST dicta que cada petición debe contener toda la información para procesarse?",
        "opciones": [
          "Separación cliente-servidor estricta.",
          "Interfaz uniforme con mensajes descriptivos.",
          "Arquitectura sin estado (Stateless).",
          "Sistema de capas jerárquicas en caché."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "Según las buenas prácticas REST, ¿cómo debe estructurarse el endpoint para obtener un recurso específico?",
        "opciones": [
          "GET /obtenerUsuario?id=123",
          "POST /usuarios/obtener/123",
          "GET /usuarios/123",
          "GET /usuarios/ver/123"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Qué concepto REST describe la inclusión de hipervínculos en la respuesta para navegar por la API?",
        "opciones": [
          "Stateless Payload",
          "HATEOAS",
          "JWT Navigation",
          "RESTful Routing"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué código HTTP es el estándar para indicar que un recurso fue creado exitosamente mediante POST?",
        "opciones": [
          "200 OK",
          "201 Created",
          "202 Accepted",
          "204 No Content"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué verbo HTTP debe utilizarse para reemplazar por completo la representación de un recurso existente?",
        "opciones": [
          "PATCH",
          "POST",
          "UPDATE",
          "PUT"
        ],
        "correcta": 3,
        "fijo": false
      },
      {
        "q": "¿Qué familia de códigos de estado HTTP indica que la petición del cliente tiene errores de sintaxis?",
        "opciones": [
          "2XX (Éxito)",
          "3XX (Redirección)",
          "4XX (Error del cliente)",
          "5XX (Error del servidor)"
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "En Express, ¿qué middleware estándar se usa comúnmente para parsear el cuerpo JSON de una petición POST?",
        "opciones": [
          "express.json()",
          "express.urlencoded()",
          "express.text()",
          "express.raw()"
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "Al manejar parámetros de ruta dinámicos en Express como /users/:id, ¿cómo se extrae el valor del id?",
        "opciones": [
          "req.query.id",
          "req.params.id",
          "req.body.id",
          "req.header.id"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Qué paquete en Node/Express se menciona comúnmente para manejar la subida de archivos (upload)?",
        "opciones": [
          "express-session",
          "express-fileupload",
          "express-validator",
          "multer-express"
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "Al procesar un archivo con express-fileupload, ¿cómo se mueve al directorio de destino del servidor?",
        "opciones": [
          "Editando la propiedad file.savePath local.",
          "Copiando la caché nativa al File System.",
          "Usando el método .mv() con la ruta destino.",
          "Invocando path.resolve() directo al JSON."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Por qué es crítico validar la extensión del archivo subido antes de guardarlo en el servidor Express?",
        "opciones": [
          "Para comprimir automáticamente las imágenes pesadas.",
          "Para evitar la ejecución de código malicioso remoto.",
          "Para convertir todos los archivos a formato PDF nativo.",
          "Para asignar dinámicamente un tamaño en la base de datos."
        ],
        "correcta": 1,
        "fijo": false
      },
      {
        "q": "¿Cuáles son las tres partes estructurales que componen un JSON Web Token (JWT) estándar?",
        "opciones": [
          "Header, Payload y Signature.",
          "Token, Secret y Expiration.",
          "User, Roles y Permissions.",
          "Header, Body y Footer."
        ],
        "correcta": 0,
        "fijo": false
      },
      {
        "q": "¿Qué elemento del JWT se utiliza para verificar que el token no ha sido alterado en el cliente?",
        "opciones": [
          "El campo estandarizado IAT del Payload.",
          "La codificación Base64 en todo el string.",
          "La firma criptográfica (Signature).",
          "El algoritmo de control del Header."
        ],
        "correcta": 2,
        "fijo": false
      },
      {
        "q": "¿Dónde es recomendable enviar el JWT validado en una petición HTTP hacia una API REST?",
        "opciones": [
          "En la URL como query string principal.",
          "En el body de la petición HTTP POST.",
          "En una Cookie temporal sin atributos de red.",
          "En el Header de autorización usando Bearer."
        ],
        "correcta": 3,
        "fijo": false
      },
      {
        "q": "En seguridad JWT, ¿qué ocurre cuando el tiempo de vida (exp) definido en el token caduca?",
        "opciones": [
          "El cliente renueva el token automáticamente sin avisar.",
          "La verificación falla y la API rechaza la petición HTTP.",
          "El servidor extiende el tiempo de expiración del token.",
          "El navegador borra la variable JWT del código fuente."
        ],
        "correcta": 1,
        "fijo": false
      }
    ]
  }
];
