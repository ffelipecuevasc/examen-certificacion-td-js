# Cuestionario de Evaluación - Módulo 4: Programación Avanzada en JavaScript (Nuevas Preguntas)

1. ¿Qué comportamiento interno asume `Object.create(proto)` al generar un objeto?
a) Clona profundamente todas las propiedades del objeto original.
b) Crea un objeto vacío y enlaza su prototipo al objeto ingresado.
c) Instancia una clase base invocando su método constructor.
d) Retorna un string en formato JSON con la estructura del modelo.
Respuesta: b) Crea un objeto vacío y enlaza su prototipo al objeto ingresado.

2. Al emplear `JSON.parse()`, ¿para qué se utiliza su segundo parámetro opcional (reviver)?
a) Para encriptar las claves numéricas extraídas del JSON.
b) Para interceptar y transformar los valores antes de retornarlos.
c) Para limitar la profundidad máxima de anidación del objeto.
d) Para reemplazar las comillas dobles por simples en las llaves.
Respuesta: b) Para interceptar y transformar los valores antes de retornarlos.

3. En ES6+, ¿cómo defines nativamente un atributo de clase como estrictamente privado?
a) Precediendo el nombre de la variable con el símbolo `#`.
b) Usando el modificador de acceso estricto `private`.
c) Declarando la variable con la palabra clave `const` internamente.
d) Encapsulándolo dentro de un bloque `Symbol()` anónimo.
Respuesta: a) Precediendo el nombre de la variable con el símbolo `#`.

4. En una clase JS, ¿qué ventaja técnica otorga implementar descriptores `get` y `set`?
a) Evitan la necesidad de declarar constructores en las clases.
b) Permiten ejecutar lógica de validación al asignar o leer un valor.
c) Convierten métodos asíncronos en propiedades síncronas bloqueantes.
d) Minifican automáticamente las variables al compilar el proyecto.
Respuesta: b) Permiten ejecutar lógica de validación al asignar o leer un valor.

5. Si pasas un método de un objeto como callback (ej. `setTimeout(obj.metodo)`), ¿qué sucede?
a) El callback pierde el contexto `this`, apuntando al entorno global.
b) El método retiene su `this` original gracias a las funciones flecha.
c) El motor lanza un TypeError prohibiendo referencias a métodos.
d) Se clona el objeto completo en la pila de llamadas (Call Stack).
Respuesta: a) El callback pierde el contexto `this`, apuntando al entorno global.

6. ¿Cuál es un método nativo y síncrono para crear una copia profunda de un objeto JSON simple?
a) Usar Object.assign({}, obj) con modo estricto.
b) Emplear el operador Spread (...obj) en el nuevo contenedor.
c) Utilizar JSON.parse(JSON.stringify(obj)) sobre el original.
d) Iterar con un bucle for...in transfiriendo las llaves primitivas.
Respuesta: c) Utilizar JSON.parse(JSON.stringify(obj)) sobre el original.

7. ¿Qué evalúa exactamente el operador `instanceof` al aplicarse entre un objeto y una clase?
a) Verifica si la clase existe en la cadena de prototipos del objeto.
b) Compara las firmas de las propiedades enumerables de ambos.
c) Asegura que el objeto sea una copia profunda de la clase base.
d) Revisa si ambos comparten el mismo espacio en memoria estática.
Respuesta: a) Verifica si la clase existe en la cadena de prototipos del objeto.

8. En `JSON.stringify()`, ¿qué función cumple el parámetro "replacer" (segundo argumento)?
a) Formatea el texto con espacios de sangría para mejor legibilidad.
b) Permite filtrar o alterar qué propiedades se incluirán en el JSON.
c) Reemplaza caracteres especiales para evitar inyecciones XSS.
d) Sustituye el prototipo del objeto por un esquema vacío.
Respuesta: b) Permite filtrar o alterar qué propiedades se incluirán en el JSON.

9. A diferencia del operador `in`, ¿qué restringe el método `hasOwnProperty()` al evaluar claves?
a) Solo retorna verdadero si la clave es de tipo numérico o símbolo.
b) Ignora las propiedades heredadas a lo largo de la cadena prototipo.
c) Lanza una excepción si la propiedad tiene valor nulo o indefinido.
d) Evalúa exclusivamente funciones, omitiendo variables primitivas.
Respuesta: b) Ignora las propiedades heredadas a lo largo de la cadena prototipo.

10. Si defines un método de clase usando una Arrow Function, ¿qué impacto directo tiene en su contexto?
a) El método se liga al contexto léxico de la instancia, fijando this.
b) El método pasa a residir en el prototipo y no en la instancia real.
c) Pierde acceso a las variables locales definidas en el constructor.
d) El motor compila la función como un método estático y protegido.
Respuesta: a) El método se liga al contexto léxico de la instancia, fijando this.

11. En asignación por desestructuración, ¿cómo aplicas un valor por defecto si la clave no existe?
a) const { clave || "defecto" } = objeto;
b) const { clave = "defecto" } = objeto;
c) const { clave : "defecto" } = objeto;
d) const { clave ?? "defecto" } = objeto;
Respuesta: b) const { clave = "defecto" } = objeto;

12. ¿Qué desencadena la "Zona Muerta Temporal" (TDZ) al trabajar con variables `let` y `const`?
a) Permite acceder a la variable retornando undefined momentáneamente.
b) Evita fugas de memoria purgando referencias huérfanas en ciclos.
c) Levanta un ReferenceError si se accede antes de su inicialización.
d) Desactiva temporalmente el modo estricto ("use strict") base.
Respuesta: c) Levanta un ReferenceError si se accede antes de su inicialización.

13. ¿Qué es el "Property Shorthand" (atajo de propiedad) introducido al crear objetos en ES6?
a) Permite omitir el valor si la variable tiene el mismo nombre clave.
b) Evalúa operaciones aritméticas directamente dentro de la clave.
c) Acorta los nombres de los atributos a un máximo de tres caracteres.
d) Fusiona atributos idénticos en un solo índice numérico dinámico.
Respuesta: a) Permite omitir el valor si la variable tiene el mismo nombre clave.

14. Al declarar una función, ¿qué limitación sintáctica estricta posee el operador `Rest` (...)?
a) Solo puede encapsular parámetros de tipo cadena de texto.
b) Debe ser obligatoriamente el último parámetro en la declaración.
c) No admite combinarse con funciones flecha de retorno implícito.
d) Limita a un máximo de tres argumentos capturados en el arreglo.
Respuesta: b) Debe ser obligatoriamente el último parámetro en la declaración.

15. A diferencia de una función tradicional, ¿qué carencia léxica poseen las Arrow Functions nativas?
a) No poseen el objeto implícito y enumerable `arguments`.
b) Carecen de soporte para cierres léxicos (closures) anidados.
c) No permiten la declaración de variables internas con `let`.
d) No pueden ejecutar métodos asíncronos en su cuerpo interno.
Respuesta: a) No poseen el objeto implícito y enumerable `arguments`.

16. Si necesitas importar una función bajo un nombre diferente al exportado, ¿qué sintaxis usas?
a) import { funcion as nuevoNombre } from './modulo.js';
b) import funcion : nuevoNombre from './modulo.js';
c) import { funcion -> nuevoNombre } from './modulo.js';
d) import [funcion = nuevoNombre] from './modulo.js';
Respuesta: a) import { funcion as nuevoNombre } from './modulo.js';

17. En las estructuras de datos ES6, ¿qué restricción fundamental impone `WeakMap` sobre sus llaves?
a) Las llaves solo pueden ser números enteros inmutables.
b) Las llaves deben ser estrictamente objetos, nunca tipos primitivos.
c) Se restringen a cadenas de texto codificadas en UTF-8 puro.
d) Solo admite un máximo de 10 llaves por cada estructura declarada.
Respuesta: b) Las llaves deben ser estrictamente objetos, nunca tipos primitivos.

18. ¿Qué comportamiento asumen los módulos ES6 (`type="module"`) de forma nativa e irreversible?
a) Se ejecutan asíncronamente omitiendo el Event Loop de JS.
b) Bloquean el renderizado del DOM hasta descargar todo el árbol.
c) Operan siempre bajo modo estricto ("use strict") implícitamente.
d) Comparten todo su alcance con el entorno global del objeto window.
Respuesta: c) Operan siempre bajo modo estricto ("use strict") implícitamente.

19. ¿Qué particularidad estructural destaca al objeto `Set` frente a un arreglo tradicional en ES6?
a) Permite acceder directamente a sus posiciones mediante índices.
b) Almacena colecciones de valores garantizando que no haya duplicados.
c) Fuerza a que todos sus elementos sean del mismo tipo de dato.
d) Es inmutable desde el instante exacto de su declaración inicial.
Respuesta: b) Almacena colecciones de valores garantizando que no haya duplicados.

20. ¿Cómo desestructuras la propiedad "ciudad" dentro de un objeto "direccion" anidado en "usuario"?
a) const { usuario.direccion.ciudad } = data;
b) const { usuario: { direccion: { ciudad } } } = data;
c) const { ciudad } from usuario.direccion = data;
d) const { [usuario][direccion][ciudad] } = data;
Respuesta: b) const { usuario: { direccion: { ciudad } } } = data;

21. ¿Qué ventaja principal justifica aplicar la técnica de Delegación de Eventos en el DOM?
a) Duplica los eventos para asegurar su ejecución de manera síncrona.
b) Vincula un oyente en un nodo padre para gestionar hijos dinámicos.
c) Previene bloqueos asíncronos cuando se descargan fuentes pesadas.
d) Permite mutar la etiqueta HTML original sin usar código JavaScript.
Respuesta: b) Vincula un oyente en un nodo padre para gestionar hijos dinámicos.

22. Al capturar colecciones de nodos, ¿qué diferencia a un `HTMLCollection` de un `NodeList` estático?
a) El HTMLCollection se actualiza "en vivo" al mutar el DOM.
b) El NodeList solo puede contener nodos de texto y comentarios.
c) El HTMLCollection no permite ser iterado en ciclos clásicos.
d) El NodeList restringe el uso de identificadores y clases CSS.
Respuesta: a) El HTMLCollection se actualiza "en vivo" al mutar el DOM.

23. ¿Por qué usar `DocumentFragment` mejora el rendimiento al inyectar múltiples nodos al DOM?
a) Ejecuta el código C++ nativo del navegador sin pasar por el V8.
b) Previene múltiples "reflows", ya que compila nodos en memoria.
c) Destruye nodos obsoletos antes de la inyección visual automática.
d) Convierte etiquetas HTML en texto mitigando inyecciones XSS.
Respuesta: b) Previene múltiples "reflows", ya que compila nodos en memoria.

24. Durante un evento, ¿qué referencia estricta mantiene la propiedad `event.currentTarget`?
a) El elemento más profundo que disparó el evento originario.
b) El nodo específico al cual está adjunto el EventListener activo.
c) La ventana del navegador que registró el clic del usuario final.
d) El cuerpo principal del documento HTML global (`document.body`).
Respuesta: b) El nodo específico al cual está adjunto el EventListener activo.

25. Para remover exitosamente un oyente con `removeEventListener`, ¿qué precondición es obligatoria?
a) Ejecutar la orden de remoción dentro de un bloque Try-Catch global.
b) Pasar exactamente la misma referencia en memoria del callback.
c) Destruir físicamente el nodo del DOM antes de remover el evento.
d) Utilizar una función anónima en línea durante su declaración inicial.
Respuesta: b) Pasar exactamente la misma referencia en memoria del callback.

26. Al configurar un oyente de eventos, ¿qué efecto causa incluir `{ passive: true }` en sus opciones?
a) Impide cancelar el evento nativo, mejorando rendimiento del scroll.
b) Detiene inmediatamente el burbujeo de la acción interactiva.
c) Obliga al evento a dispararse una sola vez y auto-destruirse.
d) Bloquea el hilo principal para capturar toques táctiles ultrarrápidos.
Respuesta: a) Impide cancelar el evento nativo, mejorando rendimiento del scroll.

27. ¿Qué vulnerabilidad de seguridad crítica se asocia al uso descuidado de la propiedad `innerHTML`?
a) Desbordamiento de la pila (Stack Overflow) por recursividad.
b) Fuga de memoria dinámica en componentes de renderizado gráfico.
c) Inyección de código malicioso mediante Cross-Site Scripting (XSS).
d) Secuestro de la conexión TCP por falsificación de origen (CSRF).
Respuesta: c) Inyección de código malicioso mediante Cross-Site Scripting (XSS).

28. ¿Qué indica la propiedad booleana de solo lectura `event.bubbles` al originarse una acción en el DOM?
a) Si el evento fue instanciado sintéticamente por código JavaScript.
b) Si el evento tiene la capacidad nativa de propagarse hacia arriba.
c) Si la acción interrumpe el ciclo de eventos del entorno global JS.
d) Si la interfaz del usuario colapsó debido a sobrecarga renderizada.
Respuesta: b) Si el evento tiene la capacidad nativa de propagarse hacia arriba.

29. Al inspeccionar la propiedad `nodeType` de un objeto en el árbol DOM, ¿qué indica el valor estricto 1?
a) Que el nodo es un comentario HTML oculto a los ojos del usuario.
b) Que el objeto evaluado corresponde estructuralmente a un texto.
c) Que el objeto es un elemento estándar de etiqueta (Element Node).
d) Que representa el documento raíz completo de la página web activa.
Respuesta: c) Que el objeto es un elemento estándar de etiqueta (Element Node).

30. ¿Qué función cumple `document.createElement()` antes de usar métodos como `appendChild()`?
a) Reemplaza instantáneamente el cuerpo del documento por una copia.
b) Crea un nuevo nodo en memoria sin insertarlo directamente en el DOM.
c) Selecciona atributos virtuales para aplicar estilos de cascada CSS.
d) Renderiza un elemento clonado suprimiendo sus eventos subyacentes.
Respuesta: b) Crea un nuevo nodo en memoria sin insertarlo directamente en el DOM.

31. En el Event Loop, ¿qué prioridad de ejecución asumen las Promesas resueltas frente a un `setTimeout`?
a) Van a la cola de microtareas, ejecutándose antes que el setTimeout.
b) Ambas van a la cola de macrotareas y se procesan por su llegada.
c) El setTimeout tiene prioridad absoluta por ser nativo del navegador.
d) Se bloquean mutuamente, debiendo procesarse en hilos separados.
Respuesta: a) Van a la cola de microtareas, ejecutándose antes que el setTimeout.

32. ¿En qué difiere el método `Promise.allSettled()` respecto a `Promise.all()` al evaluar arreglos?
a) Devuelve error general si alguna promesa demora más de lo pautado.
b) Retorna un arreglo con estados individuales, sin fallar globalmente.
c) Solo retorna el valor procesado de la primera promesa con éxito.
d) Exige obligatoriamente que el arreglo contenga funciones síncronas.
Respuesta: b) Retorna un arreglo con estados individuales, sin fallar globalmente.

33. Si una función definida como `async` arroja un error con `throw` sin capturarlo internamente, ¿qué sucede?
a) Se detiene el Event Loop forzando una falla visual en el navegador.
b) Retorna implícitamente una Promesa en estado de rechazo (Rejected).
c) Transforma el error en un objeto global inaccesible al programador.
d) Ignora la falla en seco y retorna la constante undefined de salida.
Respuesta: b) Retorna implícitamente una Promesa en estado de rechazo (Rejected).

34. Si invocas rutinariamente una función `async` sin anteponer la instrucción `await`, ¿qué impacto genera?
a) La ejecución síncrona continúa inmediatamente, recibiendo una promesa.
b) El programa se paraliza estáticamente esperando que la tarea concluya.
c) Se genera un SyntaxError por violar la naturaleza secuencial de JS.
d) El motor V8 anula la función, omitiendo por completo su bloque de código.
Respuesta: a) La ejecución síncrona continúa inmediatamente, recibiendo una promesa.

35. Al inyectar una Promesa ya existente dentro del validador `Promise.resolve()`, ¿qué retorna el intérprete?
a) Un clon profundo de la promesa con un estado renovado a "Pending".
b) La promesa original es encapsulada dentro de otra promesa superpuesta.
c) Exactamente la misma instancia referencial de la Promesa proporcionada.
d) Un valor primitivo extraído estáticamente de su resolución asíncrona.
Respuesta: c) Exactamente la misma instancia referencial de la Promesa proporcionada.

36. Al utilizar `map` acoplando una función iterativa `async` sobre un arreglo, ¿qué estructura retorna?
a) Un único objeto JSON con los valores de red previamente consolidados.
b) Un arreglo estándar compuesto estrictamente por Promesas pendientes.
c) El arreglo original mutado silenciosamente por el hilo del servidor.
d) Un bloque de iteración síncrono que traba la interfaz del usuario web.
Respuesta: b) Un arreglo estándar compuesto estrictamente por Promesas pendientes.

37. ¿Qué riesgo arquitectónico principal conlleva la "Inversión de Control" que ocasionan los Callbacks puros?
a) Ceder a librerías ajenas la potestad total de cuándo invocar tu código.
b) Saturar masivamente el Stack provocando un colapso total (Stack Overflow).
c) Inhabilitar el motor asíncrono al mezclar respuestas rápidas de la red.
d) Corromper la recolección de memoria (GC) reteniendo variables huérfanas.
Respuesta: a) Ceder a librerías ajenas la potestad total de cuándo invocar tu código.

38. En una cadena de promesas `.then()`, ¿qué ocurre justo después de ejecutar un bloque `.catch()` intermedio?
a) La cadena se destruye, anulando los subsecuentes llamados y oyentes.
b) Se retorna una promesa caída que bloquea los procesos de red futuros.
c) La cadena recobra el flujo y ejecuta el siguiente `.then()` disponible.
d) El motor de JS levanta un error irrecuperable congelando el proceso activo.
Respuesta: c) La cadena recobra el flujo y ejecuta el siguiente `.then()` disponible.

39. Dentro del constructor de una Promesa (`new Promise(executor)`), ¿cómo y en qué fase se procesa el ejecutor?
a) Se procesa en una fase asíncrona retardada tras vaciar la pila activa.
b) Se ejecuta de forma plenamente síncrona y automática al instanciarla.
c) Se pospone deliberadamente hasta que se invoque el método respectivo .then().
d) Se destina como un MicroTask en un proceso paralelo externo al motor base.
Respuesta: b) Se ejecuta de forma plenamente síncrona y automática al instanciarla.

40. ¿Qué evento global residente en `window` reporta promesas rechazadas que carecen de un `.catch()` asociado?
a) onpromisefail
b) error
c) unhandledrejection
d) asyncabort
Respuesta: c) unhandledrejection

41. ¿Qué interfaz API estándar proporciona el navegador para cancelar de manera proactiva una petición `fetch()`?
a) HTTPInterceptor
b) RequestManager
c) AbortController
d) FetchCancelToken
Respuesta: c) AbortController

42. En la API Fetch, ¿bajo qué escenario estricto su Promesa retorna directamente un estado de rechazo (Rejected)?
a) Cuando el servidor contesta con un código de negación 404 (Not Found).
b) Si el back-end arroja el estatus crítico 500 (Error Interno del Servidor).
c) Única y exclusivamente cuando fracasa o se interrumpe la conectividad de red.
d) Si la estructura de la respuesta contraviene la regla de entregar puro JSON.
Respuesta: c) Única y exclusivamente cuando fracasa o se interrumpe la conectividad de red.

43. Al enviar múltiples archivos binarios combinados con datos de texto mediante `fetch()`, ¿qué API JS agrupa el body?
a) BinaryStreamArray
b) JSONPayloadEntity
c) BlobStorageBuffer
d) FormData
Respuesta: d) FormData

44. En el modelo clásico de XMLHttpRequest, al fijar la propiedad `responseType` como 'blob', ¿qué se solicita del servidor?
a) Un diccionario indexado de datos textuales lógicos.
b) Un fragmento en formato XML sin firmas de certificación.
c) Una declaración plana codificada inherentemente en UTF-8.
d) Datos binarios en crudo, útiles para tratar imágenes y archivos.
Respuesta: d) Datos binarios en crudo, útiles para tratar imágenes y archivos.

45. Luego de lograr un `fetch()` con éxito, ¿qué sintaxis permite extraer un encabezado particular desde la respuesta HTTP?
a) response.headers.get("Nombre-Cabecera")
b) response.getHeader("Nombre-Cabecera")
c) response.headers["Nombre-Cabecera"]
d) response.readHeader("Nombre-Cabecera")
Respuesta: a) response.headers.get("Nombre-Cabecera")

46. ¿Qué valor en la propiedad `credentials` de `fetch()` garantiza anexar y procesar cookies en un llamado al mismo dominio?
a) 'omit'
b) 'same-origin'
c) 'allow-cookies'
d) 'force'
Respuesta: b) 'same-origin'

47. ¿Qué interfaz nativa facilita ensamblar limpiamente la cadena de consultas (query string) para ser anexionada en un fetch?
a) URLQueryBuilder
b) HTTPStringMaker
c) QueryFormatter
d) URLSearchParams
Respuesta: d) URLSearchParams

48. En las especificaciones de la API XHR (XMLHttpRequest), ¿qué llamado paraliza en el acto una solicitud ya despachada en red?
a) xhr.cancel()
b) xhr.abort()
c) xhr.stop()
d) xhr.halt()
Respuesta: b) xhr.abort()

49. Al efectuar un `fetch()` incluyendo el atributo `mode: 'no-cors'`, ¿cómo califica y procesa el navegador la respuesta obtenida?
a) Como una respuesta "Opaque", la cual restringe el acceso a su contenido y headers.
b) Como un objeto liberado en permisos permitiendo auditar la seguridad subyacente.
c) Como un texto JSON estructurado pero que prescinde de la cabecera Content-Type nativa.
d) Como un stream asíncrono bloqueado para evitar conexiones de sitios en la misma red.
Respuesta: a) Como una respuesta "Opaque", la cual restringe el acceso a su contenido y headers.

50. A diferencia del anticuado `onreadystatechange`, ¿en qué fase de red se detona estrictamente el evento `onload` de XHR?
a) Ante cada salto acumulativo que incremente dinámicamente el tamaño del buffer en red.
b) Solamente en la fase terminal en la que la transacción HTTP entera se concluyó con éxito.
c) En el momento preciso en que el host certifica la apertura del túnel TCP bidireccional.
d) Si el analizador web colisiona arrojando fallas semánticas graves de formato RESTful.
Respuesta: b) Solamente en la fase terminal en la que la transacción HTTP entera se concluyó con éxito.
