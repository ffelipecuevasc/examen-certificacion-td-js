# Cuestionario de Evaluación - Módulo 2: Fundamentos de Desarrollo Front-End (Nuevas Preguntas)

1. ¿Qué ventaja principal ofrece el renderizado del lado del cliente (CSR) en el Front-End?
a) Traslada la carga de procesamiento al navegador del usuario final.
b) Elimina completamente la necesidad de consumir una base de datos.
c) Ejecuta el código JavaScript de forma segura oculto en el servidor.
d) Bloquea el renderizado visual hasta cargar todo el HTML sincrónico.
Respuesta: a) Traslada la carga de procesamiento al navegador del usuario final.

2. En una arquitectura clásica, ¿qué componente provee inicialmente el archivo index.html al cliente?
a) El motor de base de datos relacional.
b) El servidor web alojado en el Back-End.
c) El sistema de enrutamiento de JavaScript.
d) La API RESTful mediante un método POST.
Respuesta: b) El servidor web alojado en el Back-End.

3. ¿Qué característica de Node.js propició el crecimiento del perfil Fullstack JavaScript?
a) Compilar CSS nativo usando exclusivamente funciones JavaScript.
b) Emplear el mismo lenguaje tanto en el navegador como en el servidor.
c) Prescindir del uso del protocolo HTTP para transferir información.
d) Generar interfaces visuales complejas directamente en la terminal.
Respuesta: b) Emplear el mismo lenguaje tanto en el navegador como en el servidor.

4. ¿Cuál es el propósito técnico estricto de declarar `<!DOCTYPE html>` en un archivo HTML5?
a) Encriptar el código fuente para evitar copias indebidas.
b) Cargar automáticamente las hojas de estilos externas base.
c) Forzar al navegador a renderizar en modo estándar y no en modo quirk.
d) Importar la biblioteca jQuery por defecto en memoria.
Respuesta: c) Forzar al navegador a renderizar en modo estándar y no en modo quirk.

5. ¿Qué beneficio técnico directo otorga el uso de etiquetas HTML semánticas como `<nav>` y `<article>`?
a) Mejora el SEO y la accesibilidad para lectores de pantalla.
b) Reduce drásticamente el peso en bytes del documento HTML.
c) Aplica automáticamente estilos visuales responsivos modernos.
d) Incrementa la velocidad de ejecución de scripts de JavaScript.
Respuesta: a) Mejora el SEO y la accesibilidad para lectores de pantalla.

6. En un formulario HTML, ¿cómo se agrupan lógicamente inputs de tipo radio para elegir solo uno?
a) Asignando exactamente el mismo atributo "id" a todos.
b) Envolviéndolos dentro de una etiqueta `<fieldset>` exclusiva.
c) Compartiendo el mismo valor en el atributo "name" de cada uno.
d) Utilizando la propiedad CSS "display: inline-block" uniforme.
Respuesta: c) Compartiendo el mismo valor en el atributo "name" de cada uno.

7. ¿Qué metaetiqueta es vital incluir en el `<head>` para habilitar el diseño responsivo en móviles?
a) `<meta name="viewport" content="width=device-width">`
b) `<meta charset="UTF-8">`
c) `<meta name="responsive" content="true">`
d) `<meta http-equiv="X-UA-Compatible" content="IE=edge">`
Respuesta: a) `<meta name="viewport" content="width=device-width">`

8. Semánticamente en HTML5, ¿qué diferencia estructural tiene `<strong>` frente a la etiqueta `<b>`?
a) `<b>` aplica cursiva, mientras `<strong>` aplica negrita gruesa.
b) `<strong>` aporta fuerte importancia semántica, `<b>` solo visual.
c) Solo `<strong>` puede alojar hipervínculos internos o anclas.
d) `<b>` es una etiqueta de bloque y `<strong>` es una de línea.
Respuesta: b) `<strong>` aporta fuerte importancia semántica, `<b>` solo visual.

9. Al procesar un `<form>`, ¿qué distingue al método HTTP "POST" en contraste con "GET"?
a) GET soporta envío de archivos binarios asíncronos, POST no.
b) POST anexa los datos en la URL de destino, GET los encripta.
c) POST envía la información encapsulada en el cuerpo de la petición.
d) GET requiere confirmación de seguridad del navegador obligatoria.
Respuesta: c) POST envía la información encapsulada en el cuerpo de la petición.

10. ¿Cuál es la función principal de la etiqueta HTML5 `<canvas>` dentro del desarrollo web Front-End?
a) Incrustar videos y audios de red sin requerir plugins externos.
b) Proveer un área gráfica para dibujar por medio de JavaScript.
c) Crear un contenedor aislado para ejecutar iFrames muy seguros.
d) Cargar complejas animaciones hechas exclusivamente en CSS puro.
Respuesta: b) Proveer un área gráfica para dibujar por medio de JavaScript.

11. En el modelo de cajas CSS, ¿cómo se comporta el fondo (background) respecto al padding del nodo?
a) El fondo se recorta antes del padding dejándolo transparente puro.
b) El fondo se extiende cubriendo uniformemente el área de padding.
c) El padding superpone un fondo blanco estricto por defecto siempre.
d) El background ignora al padding empujándolo muy fuera del borde.
Respuesta: b) El fondo se extiende cubriendo uniformemente el área de padding.

12. ¿Qué pseudo-elemento CSS permite insertar contenido decorativo inicial en un nodo sin tocar el HTML?
a) :first-child
b) :hover
c) ::before
d) ::after-content
Respuesta: c) ::before

13. Ante un conflicto, ¿qué regla prevalece entre una clase con `!important` y un selector de ID?
a) El selector de ID por tener mucha mayor especificidad estructural.
b) La regla de la clase por poseer el modificador `!important`.
c) Se anulan mutuamente y el navegador web aplica el estilo defecto.
d) Depende exclusivamente de la etiqueta HTML donde estén aplicados.
Respuesta: b) La regla de la clase por poseer el modificador `!important`.

14. ¿Qué sintaxis de Media Query aplica estilos solo si el dispositivo está en posición horizontal?
a) `@media screen and (max-width: 100%)`
b) `@media only mobile and (horizontal)`
c) `@media (orientation: landscape)`
d) `@media (view: panorama)`
Respuesta: c) `@media (orientation: landscape)`

15. ¿Cuál es la sintaxis nativa válida para definir una variable CSS global dentro del pseudo `:root`?
a) `$color-primario: #333;`
b) `var color-primario = #333;`
c) `--color-primario: #333;`
d) `@color-primario: #333;`
Respuesta: c) `--color-primario: #333;`

16. Si un nodo usa `position: absolute;`, ¿en relación a qué calcula sus coordenadas top y left exactas?
a) Siempre respecto al viewport o ventana principal del navegador.
b) Respecto a su contenedor padre más cercano que esté posicionado.
c) En relación estricta al elemento hermano anterior en todo el DOM.
d) Respecto al margen base definido nativamente en el tag body.
Respuesta: b) Respecto a su contenedor padre más cercano que esté posicionado.

17. En la cuadrícula de Bootstrap, ¿qué ocurre si anidas un `.row` dentro de una columna existente?
a) Genera un error CSS y rompe la responsividad de la grilla principal.
b) Crea una nueva cuadrícula interna de 12 columnas relativa al padre.
c) Hereda automáticamente las fracciones del contenedor original base.
d) Extiende el ancho de la columna rompiendo el margen horizontal.
Respuesta: b) Crea una nueva cuadrícula interna de 12 columnas relativa al padre.

18. ¿A partir de qué ancho de pantalla se activa típicamente el sufijo `.col-md-*` en Bootstrap?
a) Desde 576px hacia arriba (dispositivos pequeños móviles).
b) Desde 768px hacia arriba (tabletas medianas).
c) Desde 992px hacia arriba (escritorios grandes).
d) Únicamente en monitores de 1200px o resoluciones superior.
Respuesta: b) Desde 768px hacia arriba (tabletas medianas).

19. Al utilizar las utilidades de espaciado de Bootstrap, ¿qué efecto exacto aplica la clase `mt-5`?
a) Añade un padding interior en la zona superior de tamaño nivel 5.
b) Modifica la tipografía general y el tamaño de fuente al nivel 5.
c) Asigna el margen exterior superior (margin-top) a un nivel 5.
d) Resta 5 pixeles exactos del margen inferior del contenedor actual.
Respuesta: c) Asigna el margen exterior superior (margin-top) a un nivel 5.

20. En Bootstrap, ¿qué clase utilitaria centra elementos a lo largo del eje principal en un flexbox?
a) `.align-items-center`
b) `.justify-content-center`
c) `.text-center-flex`
d) `.mx-auto-center`
Respuesta: b) `.justify-content-center`

21. ¿Qué nombre de clase Bootstrap crea un botón con texto y borde primario pero fondo transparente?
a) `.btn-primary`
b) `.btn-transparent-primary`
c) `.btn-outline-primary`
d) `.btn-ghost-primary`
Respuesta: c) `.btn-outline-primary`

22. En componentes de Bootstrap 5, ¿qué atributo HTML se usa típicamente para abrir o accionar un Modal?
a) `onclick="openModal()"`
b) `data-bs-toggle="modal"`
c) `href="#modal-window"`
d) `class="modal-trigger-btn"`
Respuesta: b) `data-bs-toggle="modal"`

23. En JavaScript nativo, ¿qué estructura de datos retorna la llamada a `document.querySelectorAll()`?
a) Un objeto JSON profundamente iterativo.
b) Una matriz HTMLCollection puramente dinámica.
c) Un NodeList estático con los elementos HTML encontrados.
d) Un Array nativo de puros strings con los IDs de los nodos.
Respuesta: c) Un NodeList estático con los elementos HTML encontrados.

24. En ES6, ¿por qué leer una variable `let` antes de declararla causa un error y con `var` no lo hace?
a) Porque `let` carece completamente del proceso de hoisting interno.
b) Debido a que `let` reside temporalmente en la Zona Muerta Temporal.
c) `let` exige inicializarse en un archivo externo de forma estricta.
d) Porque `var` inicializa sus variables en el prototipo del Window.
Respuesta: b) Debido a que `let` reside temporalmente en la Zona Muerta Temporal.

25. ¿Qué acrónimo describe a una función anónima en JS que se autoejecuta inmediatamente al definirse?
a) IIFE (Immediately Invoked Function Expression).
b) HOF (Higher-Order Function).
c) TCO (Tail Call Optimization).
d) AJAX (Asynchronous JS and XML).
Respuesta: a) IIFE (Immediately Invoked Function Expression).

26. ¿Qué técnica de JS asigna un único listener a un padre para capturar eventos de sus hijos dinámicos?
a) Propagación ascendente asíncrona de los listeners.
b) Delegación de eventos pura (Event Delegation).
c) Mutación nativa de observadores (MutationObserver).
d) Prevención absoluta de captura (preventDefault).
Respuesta: b) Delegación de eventos pura (Event Delegation).

27. Al iterar con arreglos en JS, ¿qué diferencia clave tiene el método `.map()` frente a `.forEach()`?
a) `.forEach()` retorna un nuevo arreglo y `.map()` altera el original.
b) `.map()` evalúa lógicas falsas, `.forEach()` suma puros enteros.
c) `.map()` retorna un arreglo nuevo, `.forEach()` devuelve undefined.
d) `.forEach()` acepta callbacks asíncronos y el método `.map()` no.
Respuesta: c) `.map()` retorna un arreglo nuevo, `.forEach()` devuelve undefined.

28. Debido a un fallo histórico en el diseño de JavaScript, ¿qué evalúa la expresión `typeof null`?
a) "null"
b) "undefined"
c) "object"
d) "boolean"
Respuesta: c) "object"

29. En JavaScript, ¿cuál es el operador válido para borrar permanentemente una propiedad de un objeto?
a) destroy
b) remove
c) delete
d) splice
Respuesta: c) delete

30. En la propagación de eventos, ¿para qué sirve el parámetro booleano `useCapture: true` del listener?
a) Detiene automáticamente la propagación hacia todos los nodos hermanos.
b) Ejecuta la función durante la fase de captura, antes del burbujeo.
c) Almacena el evento de DOM en caché para ejecuciones asíncronas futuras.
d) Previene completamente el comportamiento por defecto del evento local.
Respuesta: b) Ejecuta la función durante la fase de captura, antes del burbujeo.

31. En jQuery, ¿cuál es la sintaxis sugerida para aplicar delegación de eventos a elementos dinámicos?
a) `$(document).on("click", ".dinamico", function() {})`
b) `$(".dinamico").bindClick(function() {})`
c) `$(document).delegate(".dinamico").click()`
d) `$(".dinamico").live("click", function() {})`
Respuesta: a) `$(document).on("click", ".dinamico", function() {})`

32. ¿Qué método de la librería jQuery inyecta HTML exactamente como el primer hijo del elemento destino?
a) `.append()`
b) `.insertAfter()`
c) `.prepend()`
d) `.before()`
Respuesta: c) `.prepend()`

33. En jQuery, ¿qué método agrega una clase al HTML si no la posee, y la remueve si ya está vinculada?
a) `.switchClass()`
b) `.toggleClass()`
c) `.flipClass()`
d) `.swapClass()`
Respuesta: b) `.toggleClass()`

34. ¿Cuál es el método núcleo subyacente en jQuery que permite ejecutar consultas AJAX muy personalizadas?
a) `$.fetch()`
b) `$.requestHTTP()`
c) `$.ajax()`
d) `$.getAsync()`
Respuesta: c) `$.ajax()`

35. ¿Qué mecanismo interno permite el "encadenamiento" fluido de múltiples métodos jQuery en un nodo?
a) El uso encadenado de promesas en el núcleo de jQuery nativo.
b) Cada método mutador jQuery retorna sistemáticamente la instancia `this`.
c) La inyección severa de callbacks recursivos en el árbol del DOM.
d) La sobrecarga asíncrona de complejas funciones flecha de JavaScript.
Respuesta: b) Cada método mutador jQuery retorna sistemáticamente la instancia `this`.

36. En Git local, ¿qué comando crea instantáneamente una nueva rama local y cambia inmediatamente a ella?
a) `git branch --create <nombre>`
b) `git checkout -b <nombre>`
c) `git clone --branch <nombre>`
d) `git new branch <nombre>`
Respuesta: b) `git checkout -b <nombre>`

37. ¿Cuál es la finalidad estricta del comando inicial `git remote add origin <url>` en un proyecto?
a) Sobrescribir toda la historia local con un repositorio remoto de red.
b) Vincular de manera persistente el repositorio local con uno remoto.
c) Descargar masivamente paquetes dependientes desde un origen remoto.
d) Autorizar permanentemente claves SSH locales contra el host web.
Respuesta: b) Vincular de manera persistente el repositorio local con uno remoto.

38. ¿Qué patrón exacto escribirías en `.gitignore` para excluir globalmente cualquier archivo log (`.log`)?
a) `exclude .log`
b) `[*.log]`
c) `/*.log/`
d) `*.log`
Respuesta: d) `*.log`

39. ¿Qué bandera del comando `git log` compacta toda la historia visualizando un solo commit por línea?
a) `--compact`
b) `--short`
c) `--oneline`
d) `--minify`
Respuesta: c) `--oneline`

40. En el flujo colaborativo de GitHub, ¿qué acción precisa realiza el botón "Fork" sobre un repositorio?
a) Abre un Pull Request inmediato a la rama master del proyecto dueño.
b) Crea una copia del repositorio de terceros en tu cuenta personal.
c) Clona físicamente todo el repositorio en tu disco de almacenamiento.
d) Reasigna total autoridad de escritura sobre el repositorio original.
Respuesta: b) Crea una copia del repositorio de terceros en tu cuenta personal.
