# Justificaciones del módulo 6 · para revisar

**Lote:** 52 preguntas · **Redactadas:** 2026-09-10 por Claude Code

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

### 01 · m06#1

<!-- pregunta: json_2026#1 | just:d37e36dc4281 -->

¿Qué característica arquitectónica fundamental distingue al motor de Node.js?

- `(a)` Se basa en múltiples hilos bloqueantes (multi-thread).
- `(b)` Utiliza un único hilo de ejecución (single-thread) no bloqueante.  **← correcta**
- `(c)` Delega todo el procesamiento al navegador del cliente.
- `(d)` Compila el código a lenguaje ensamblador en tiempo real.

<!-- justificacion:inicio -->
Node corre el código JavaScript en **un solo hilo**, y no se queda esperando a las operaciones lentas: las delega y sigue atendiendo. Ésa es la combinación —un hilo, sin bloquear— que le permite sostener muchas conexiones a la vez sin crear un hilo por cada una. Las otras tres describen arquitecturas ajenas: la de un servidor tradicional con hilos bloqueantes, la de un script de navegador, y una compilación a ensamblador que no ocurre.
<!-- justificacion:fin -->

- [x] Aprobada

### 02 · m06#2

<!-- pregunta: json_2026#2 | just:e251401ec5e0 -->

¿Qué motor interno utiliza Node.js para interpretar el código JavaScript?

- `(a)` SpiderMonkey de Mozilla
- `(b)` JavaScriptCore de Apple
- `(c)` V8 de Google  **← correcta**
- `(d)` Chakra de Microsoft

<!-- justificacion:inicio -->
Node usa V8, el mismo motor de Chrome, y por eso el JavaScript que se escribe en el servidor es el mismo lenguaje que en el navegador. Las otras tres son motores reales de otros navegadores: SpiderMonkey el de Firefox, JavaScriptCore el de Safari, y Chakra el del Edge antiguo. Lo que Node agrega por encima de V8 es todo lo que el navegador no da: archivos, red, procesos.
<!-- justificacion:fin -->

- [x] Aprobada

### 03 · m06#3

<!-- pregunta: json_2026#3 | just:f0a26ea057b1 -->

¿Cuál es el rol principal de Express dentro del ecosistema de Node.js?

- `(a)` Proveer una base de datos relacional nativa y segura.
- `(b)` Ser un motor de plantillas exclusivo para frontend.
- `(c)` Funcionar como un framework minimalista para infraestructura web.  **← correcta**
- `(d)` Ejecutar tareas en múltiples hilos paralelos independientes.

<!-- justificacion:inicio -->
Express es un framework minimalista para armar servidores web: rutas, middlewares y poco más. Lo que no trae es tan importante como lo que trae — no incluye base de datos, ni ORM, ni motor de plantillas obligatorio—, y esa es su idea: dar la estructura mínima y dejar que cada proyecto elija el resto. Tampoco ejecuta nada en paralelo: hereda el modelo de un solo hilo de Node.
<!-- justificacion:fin -->

- [x] Aprobada

### 04 · m06#4

<!-- pregunta: json_2026#4 | just:1b19d7730524 -->

En la arquitectura de Express, ¿qué es y qué hace un "middleware"?

- `(a)` Una función que intercepta peticiones HTTP y respuestas.  **← correcta**
- `(b)` Un motor de base de datos embebido en memoria.
- `(c)` Un paquete exclusivo para renderizar CSS dinámico.
- `(d)` Un módulo nativo de Node para comprimir archivos de texto.

<!-- justificacion:inicio -->
Un middleware es una función que se coloca en el camino de la petición y puede leerla, modificarla, responder o pasarla al siguiente con `next()`. Con eso se arman la autenticación, el registro de peticiones, el parseo del cuerpo y el manejo de errores. La clave está en ese `next()`: si un middleware no lo llama ni responde, la petición se queda colgada — y es uno de los errores más difíciles de encontrar.
<!-- justificacion:fin -->

- [x] Aprobada

### 05 · m06#5

<!-- pregunta: json_2026#5 | just:ac490c53d66b -->

A diferencia de un servidor clásico, ¿cómo maneja Node.js las peticiones concurrentes?

- `(a)` Bloquea el proceso principal hasta resolver cada petición.
- `(b)` Crea un nuevo hilo de sistema operativo por usuario.
- `(c)` Delega las tareas a procesos asíncronos mediante callbacks.  **← correcta**
- `(d)` Rechaza peticiones si sobrepasan el límite del hardware.

<!-- justificacion:inicio -->
Node no crea un hilo por petición: registra la operación lenta —leer un archivo, consultar la base— y sigue atendiendo, y cuando esa operación termina, su callback vuelve a la cola para ejecutarse. Por eso aguanta muchas conexiones con poca memoria. La (b) describe el modelo clásico de un hilo por usuario, que es justo lo que Node evita, y la (a) describe lo contrario de no bloquear.
<!-- justificacion:fin -->

- [x] Aprobada

### 06 · m06#6

<!-- pregunta: json_2026#6 | just:f26e04795fb4 -->

¿Qué tipo de arquitectura de ruteo promueve fuertemente el framework Express?

- `(a)` Ruteo imperativo anidado profundo.
- `(b)` Ruteo estático compilado en binarios.
- `(c)` Ruteo declarativo a través de métodos HTTP y URIs.  **← correcta**
- `(d)` Ruteo basado en variables de sesión globales de servidor.

<!-- justificacion:inicio -->
Express propone declarar rutas asociando un método HTTP y una ruta a una función: `app.get('/usuarios', ...)`. Se lee como una tabla de lo que la aplicación ofrece, y por eso escala bien: agregar una ruta es agregar una línea, no modificar una cadena de condicionales. Las otras tres describen enfoques que Express no promueve y que se vuelven inmanejables al crecer.
<!-- justificacion:fin -->

- [x] Aprobada

### 07 · m06#7

<!-- pregunta: json_2026#7 | just:c368268e71c7 -->

En el ciclo de vida de un proceso Node, ¿qué detiene la ejecución del programa de forma natural?

- `(a)` La finalización del hilo bloqueante principal tras 5 minutos.
- `(b)` El vaciado total de la pila de eventos (Event Loop).  **← correcta**
- `(c)` La ejecución constante del comando interno process.pause().
- `(d)` El renderizado de la primera vista en el cliente HTTP.

<!-- justificacion:inicio -->
Un proceso Node termina solo cuando no le queda nada pendiente: ni callbacks encolados, ni temporizadores activos, ni servidores escuchando. Por eso un programa que solo lee un archivo termina al acabar, y un servidor web no termina nunca — el socket abierto es trabajo pendiente permanente. Es también la explicación de un caso confuso: un `setInterval` olvidado mantiene el proceso vivo para siempre.
<!-- justificacion:fin -->

- [x] Aprobada

### 08 · m06#8

<!-- pregunta: json_2026#8 | just:9dc83012adef -->

Al instalar dependencias globales con Node, ¿dónde quedan disponibles los comandos binarios?

- `(a)` En el archivo package.json del proyecto local exclusivamente.
- `(b)` Solamente en la subcarpeta node_modules local del proyecto.
- `(c)` En las variables de entorno PATH del sistema operativo subyacente.  **← correcta**
- `(d)` En el registro interno del navegador del desarrollador.

<!-- justificacion:inicio -->
Instalar con `-g` deja los ejecutables del paquete en un directorio que está en el `PATH` del sistema, así que se pueden invocar por su nombre desde cualquier carpeta. Una instalación local, en cambio, los deja en `node_modules/.bin`, alcanzables desde los guiones de `package.json` o con `npx`. Hoy se prefiere lo local justamente para que cada proyecto fije su versión.
<!-- justificacion:fin -->

- [x] Aprobada

### 09 · m06#9

<!-- pregunta: json_2026#9 | just:46e679e5740c -->

¿Qué diferencia clave existe entre una instrucción "blocking" y "non-blocking" en Node?

- `(a)` Blocking pausa el hilo principal; non-blocking delega por callbacks.  **← correcta**
- `(b)` Non-blocking detiene la CPU; blocking usa excesiva memoria RAM.
- `(c)` Blocking solo afecta a peticiones de red; non-blocking al disco.
- `(d)` Node ignora las instrucciones blocking para evitar fallas crónicas.

<!-- justificacion:inicio -->
Una operación bloqueante detiene el único hilo hasta terminar, y mientras tanto **ninguna otra petición se atiende**; una no bloqueante entrega el trabajo y sigue, y avisa después por un callback. En un servidor la diferencia no es de estilo: una lectura síncrona de un archivo grande deja a todos los usuarios esperando. Por eso las funciones de Node vienen casi siempre en las dos formas.
<!-- justificacion:fin -->

- [x] Aprobada

### 10 · m06#10

<!-- pregunta: json_2026#10 | just:594e9a55c6d9 -->

¿Cuál es el propósito del paquete `nodemon` durante el desarrollo de una aplicación Node?

- `(a)` Minimizar el código fuente a su versión más ligera de byte.
- `(b)` Encriptar las peticiones HTTP mediante protocolos SSL/TLS.
- `(c)` Reiniciar automáticamente el servidor al detectar cambios.  **← correcta**
- `(d)` Generar datos falsos masivos para probar la base de datos.

<!-- justificacion:inicio -->
`nodemon` vigila los archivos del proyecto y reinicia el proceso cuando alguno cambia, para no tener que parar y arrancar a mano en cada edición. Es una herramienta de desarrollo y por eso va en `devDependencies`: en producción no se usa, donde el reinicio lo gestiona otra cosa. Las otras tres describen oficios de herramientas distintas.
<!-- justificacion:fin -->

- [x] Aprobada

### 11 · m06#11

<!-- pregunta: json_2026#11 | just:a37827412621 -->

¿Qué objeto global en Node.js provee información y control directo sobre la ejecución actual?

- `(a)` system
- `(b)` process  **← correcta**
- `(c)` globalApp
- `(d)` nodeEnv

<!-- justificacion:inicio -->
`process` es el objeto global que representa al proceso en curso: da los argumentos de la línea de comandos en `process.argv`, las variables de entorno en `process.env`, el código de salida, y eventos como `exit`. Los otros tres nombres no existen. Es de los primeros que hay que conocer, porque casi toda configuración de una aplicación Node entra por `process.env`.
<!-- justificacion:fin -->

- [x] Aprobada

### 12 · m06#12

<!-- pregunta: json_2026#12 | just:7cae8b2e472b -->

¿Qué ocurre si un error no capturado (uncaught exception) alcanza la cima del Event Loop?

- `(a)` Node ignora el error silenciosamente y continúa iterando eventos.
- `(b)` El proceso principal se interrumpe y la aplicación se cae por fallas.  **← correcta**
- `(c)` Se envía un reporte automático en XML al administrador del servidor.
- `(d)` Express reinicia dinámicamente el hilo afectado sin afectar a otros.

<!-- justificacion:inicio -->
Un error que nadie captura llega arriba del todo y **tumba el proceso**: Node imprime la traza y sale. No hay red de seguridad por omisión, y ésa es una diferencia grande con el navegador, donde un error en un manejador no cierra la página. Por eso en producción se pone un supervisor que reinicie, y por eso conviene capturar los errores donde ocurren en vez de confiar en `process.on('uncaughtException')`.
<!-- justificacion:fin -->

- [x] Aprobada

### 13 · m06#13

<!-- pregunta: json_2026#13 | just:c9b8641b3abf -->

¿Qué archivo es imprescindible para que una carpeta se reconozca como proyecto Node/NPM?

- `(a)` package.json  **← correcta**
- `(b)` index.js
- `(c)` node_modules
- `(d)` .env config

<!-- justificacion:inicio -->
`package.json` es lo que convierte una carpeta en un proyecto: declara nombre, versión, dependencias y guiones. Sin él, `npm` no sabe qué instalar ni qué ejecutar. Los otros tres son habituales pero no imprescindibles: `index.js` es una convención de nombre, `node_modules` lo genera la instalación, y un archivo de entorno es opcional y además **no se versiona**.
<!-- justificacion:fin -->

- [x] Aprobada

### 14 · m06#14

<!-- pregunta: json_2026#14 | just:4466ee5b75d8 -->

Al instalar un paquete mediante `npm install`, ¿qué carpeta almacena sus archivos físicos?

- `(a)` /bin modules
- `(b)` /lib packages
- `(c)` node_modules  **← correcta**
- `(d)` npm_packages_core

<!-- justificacion:inicio -->
`npm install` deja los archivos de cada paquete en `node_modules`, en la raíz del proyecto. Esa carpeta se puede borrar y reconstruir en cualquier momento con otro `npm install`, y por eso **no se versiona**: lo que se versiona es `package.json` con lo declarado y `package-lock.json` con las versiones exactas. Los otros tres nombres no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 15 · m06#15

<!-- pregunta: json_2026#15 | just:00ec5e1da1b4 -->

¿Qué comando NPM inicia el asistente interactivo para crear el archivo de configuración base?

- `(a)` npm start
- `(b)` npm init  **← correcta**
- `(c)` npm init -y
- `(d)` npm setup_project

<!-- justificacion:inicio -->
`npm init` abre el cuestionario que arma el `package.json` preguntando nombre, versión, punto de entrada y demás. La alternativa (c) es la que separa: `npm init -y` **crea el archivo igual, pero sin preguntar nada** — el `-y` acepta todos los valores por omisión, que es justo lo contrario del asistente interactivo que la pregunta pide. Es el atajo que se usa cuando el detalle da lo mismo. `npm start` ejecuta un guion ya declarado y `npm setup_project` no existe.
<!-- justificacion:fin -->

- [x] Aprobada

### 16 · m06#16

<!-- pregunta: json_2026#16 | just:95172fed2e78 -->

¿Cómo se exporta correctamente un módulo personalizado en Node (CommonJS) para su reutilización?

- `(a)` module.exports = { modulo }  **← correcta**
- `(b)` export default modulo
- `(c)` return modulo_global
- `(d)` expose_module(modulo)

<!-- justificacion:inicio -->
En CommonJS lo que se exporta es lo que se asigne a `module.exports`, y con un objeto se exponen varias cosas de una vez. La (b) es la sintaxis de los módulos ES, que es el otro sistema y no se mezcla con éste en el mismo archivo — esa distinción es justamente lo que la pregunta separa. `return` no funciona fuera de una función y `expose_module()` no existe.
<!-- justificacion:fin -->

- [x] Aprobada

### 17 · m06#17

<!-- pregunta: json_2026#17 | just:261527524400 -->

Al leer el archivo package.json, ¿qué indican los símbolos ^ o ~ en la versión de un paquete?

- `(a)` Definen estrictas políticas de actualizaciones automáticas permitidas.  **← correcta**
- `(b)` Indican que el paquete está obsoleto y será eliminado próximamente.
- `(c)` Obligan a instalar forzosamente una versión pre-lanzamiento beta.
- `(d)` Señalan que el paquete debe instalarse de forma global del sistema.

<!-- justificacion:inicio -->
`^` y `~` fijan hasta dónde puede subir sola una dependencia al reinstalar: `^1.2.3` acepta cualquier `1.x.x` posterior, o sea correcciones y funciones nuevas pero no cambios que rompan; `~1.2.3` es más estricto y solo acepta `1.2.x`. Sin ningún símbolo, la versión queda clavada. Ninguna de las otras tres describe algo que esos símbolos hagan.
<!-- justificacion:fin -->

- [x] Aprobada

### 18 · m06#18

<!-- pregunta: json_2026#18 | just:9918a011a5eb -->

¿Qué comando NPM debes ejecutar para ver qué paquetes tienen una nueva versión disponible?

- `(a)` npm update-check
- `(b)` npm outdated  **← correcta**
- `(c)` npm upgrade-list
- `(d)` npm list-old-versions

<!-- justificacion:inicio -->
`npm outdated` lista los paquetes cuya versión instalada se quedó atrás, mostrando la actual, la que permitiría el rango declarado y la última publicada. No cambia nada: solo informa, y por eso es el paso previo a `npm update`. Los otros tres nombres no existen. Conviene mirarlo antes de actualizar, porque la columna «latest» puede estar detrás de un cambio mayor.
<!-- justificacion:fin -->

- [x] Aprobada

### 19 · m06#19

<!-- pregunta: json_2026#19 | just:6e6fcc83d78a -->

Para invocar funcionalidades de un módulo nativo o de terceros en CommonJS, ¿qué sentencia usas?

- `(a)` import()
- `(b)` loadModule()
- `(c)` require()  **← correcta**
- `(d)` fetchDependency()

<!-- justificacion:inicio -->
`require()` es la forma de CommonJS, el sistema de módulos con el que Node nació y el que sigue usando cuando el archivo no se declara como módulo ES. La (a), `import()`, existe en Node pero pertenece al otro sistema —y en su forma dinámica devuelve una promesa—, así que no es equivalente. Los otros dos no existen. Cuál rige lo decide la extensión del archivo y el campo `type` del `package.json`.
<!-- justificacion:fin -->

- [x] Aprobada

### 20 · m06#20

<!-- pregunta: json_2026#20 | just:bc6aca24fe14 -->

¿Qué ventaja ofrece usar dependencias de desarrollo (devDependencies) en el package.json?

- `(a)` Aceleran el tiempo de compilación nativa directamente en el servidor.
- `(b)` No se instalan obligatoriamente al desplegar el proyecto en producción.  **← correcta**
- `(c)` Tienen mayor prioridad de carga en la memoria RAM del sistema base.
- `(d)` Permiten ejecutar código asíncrono evadiendo el uso de callbacks.

<!-- justificacion:inicio -->
Las dependencias de desarrollo son las que solo hacen falta mientras se trabaja —pruebas, `nodemon`, herramientas de construcción— y se pueden dejar fuera al desplegar, con `npm install --omit=dev` o con `NODE_ENV=production`. Eso hace la instalación más liviana y reduce lo que llega al servidor. Por omisión, un `npm install` corriente sí las instala: la separación es una declaración de intención que el despliegue aprovecha.
<!-- justificacion:fin -->

- [x] Aprobada

### 21 · m06#21

<!-- pregunta: json_2026#21 | just:3b81ee43f613 -->

¿Qué directiva de Express se utiliza habitualmente para servir contenido estático (CSS, img)?

- `(a)` express.static()  **← correcta**
- `(b)` express.publicContent()
- `(c)` app.useStaticFolder()
- `(d)` express.serveAssets()

<!-- justificacion:inicio -->
`express.static()` es el middleware que sirve archivos tal cual están en una carpeta: hojas de estilo, imágenes, guiones del cliente. Se monta con `app.use(express.static('public'))` y desde ahí el contenido queda disponible por su ruta. Los otros tres nombres no existen. Conviene recordar que lo que entra en esa carpeta queda público: es exactamente la decisión que en este proyecto toma `LISTA_COPIA`.
<!-- justificacion:fin -->

- [x] Aprobada

### 22 · m06#22

<!-- pregunta: json_2026#22 | just:5c030a420201 -->

¿Cuál es la función principal de un motor de plantillas como Handlebars en un servidor Express?

- `(a)` Generar esquemas y tablas de base de datos a partir del código JS.
- `(b)` Renderizar HTML dinámico inyectando variables del backend al vuelo.  **← correcta**
- `(c)` Validar fuertemente los formularios HTTP antes de enviarlos a disco.
- `(d)` Comprimir imágenes estáticas de forma asíncrona para el cliente.

<!-- justificacion:inicio -->
Un motor de plantillas toma un archivo con marcadores y los datos que le pasa el servidor, y produce el HTML final que se envía al navegador. Con eso la vista deja de escribirse a mano por cada caso. Las otras tres describen oficios ajenos: ni genera tablas de base de datos, ni valida formularios, ni comprime imágenes. La lógica pesada no va en la plantilla: va antes, en el controlador.
<!-- justificacion:fin -->

- [x] Aprobada

### 23 · m06#24

<!-- pregunta: json_2026#24 | just:fe2014b0f8a9 -->

¿Qué concepto en Handlebars permite reutilizar bloques de código HTML, como un header o footer?

- `(a)` Middleware views component
- `(b)` Partials (Páginas parciales)  **← correcta**
- `(c)` Injections (Inyecciones de DOM)
- `(d)` Layout fragments template

<!-- justificacion:inicio -->
Los **partials** son fragmentos de plantilla que se escriben una vez y se incluyen donde hagan falta con `{{> nombre}}`: la cabecera, el pie, un menú. Evitan repetir el mismo HTML en cada vista y, sobre todo, evitan tener que corregirlo en diez sitios. Las otras tres opciones mezclan palabras de otros contextos y no son conceptos de Handlebars.
<!-- justificacion:fin -->

- [x] Aprobada

### 24 · m06#25

<!-- pregunta: json_2026#25 | just:0d62b6bf811f -->

¿Qué método del objeto `res` en Express procesa una plantilla y la envía como HTML al cliente?

- `(a)` res.sendTemplateObject()
- `(b)` res.render()  **← correcta**
- `(c)` res.htmlCompiler()
- `(d)` res.viewGenerator()

<!-- justificacion:inicio -->
`res.render('vista', datos)` busca la plantilla, la combina con los datos y manda el HTML resultante al cliente. Es el par de `res.send()`, que envía contenido ya listo, y de `res.json()`, que envía datos. Los otros tres nombres no existen. Para que funcione hace falta haber configurado antes el motor de vistas y el directorio donde están.
<!-- justificacion:fin -->

- [x] Aprobada

### 25 · m06#26

<!-- pregunta: json_2026#26 | just:b4c762dc9800 -->

Para que Express reconozca Handlebars como su motor base, ¿qué propiedad de `app.set` se define?

- `(a)` 'template engine base'
- `(b)` 'view engine'  **← correcta**
- `(c)` 'render compile mode'
- `(d)` 'html processor native'

<!-- justificacion:inicio -->
Se declara con `app.set('view engine', 'handlebars')`, y junto a él suele ir `app.set('views', ruta)` para decir dónde están las plantillas. Con eso, `res.render('inicio')` ya sabe qué archivo buscar y con qué motor procesarlo. Los otros tres nombres de propiedad no existen: Express solo reconoce las suyas.
<!-- justificacion:fin -->

- [x] Aprobada

### 26 · m06#27

<!-- pregunta: json_2026#27 | just:d4582c173966 -->

En Handlebars, ¿qué es un "Helper" y cuál es su utilidad principal?

- `(a)` Una directiva de Express para comprimir el HTML antes de su salida.
- `(b)` Un archivo CSS que aplica estilos responsivos por defecto en tablas.
- `(c)` Una función JS que ejecuta lógica de presentación incrustada en vista.  **← correcta**
- `(d)` Un componente asíncrono que previene inyección de código tipo SQL.

<!-- justificacion:inicio -->
Un helper es una función de JavaScript que se registra en Handlebars y se puede llamar desde la plantilla, para resolver ahí lo que el lenguaje de plantillas no hace solo: formatear una fecha, comparar dos valores, pluralizar. Es la válvula de escape para lógica **de presentación**, y conviene que se quede en eso: la lógica de negocio pertenece al controlador, no a la vista.
<!-- justificacion:fin -->

- [x] Aprobada

### 27 · m06#29

<!-- pregunta: json_2026#29 | just:b7a9f9fe26d4 -->

Para leer el contenido de un archivo de texto de forma síncrona en Node, ¿qué método usarías?

- `(a)` fs.readSyncFile()
- `(b)` fs.readFileSync()  **← correcta**
- `(c)` fs.openSyncStream()
- `(d)` fs.loadTextSync()

<!-- justificacion:inicio -->
`fs.readFileSync(ruta, 'utf8')` lee el archivo y devuelve su contenido de una vez, deteniendo el hilo hasta terminar. Los otros tres nombres no existen. El sufijo `Sync` es la convención de Node para las versiones bloqueantes, y por eso conviene reservarlas para guiones y arranque: dentro de un servidor que atiende peticiones, cada una de ellas deja a todos los demás esperando.
<!-- justificacion:fin -->

- [x] Aprobada

### 28 · m06#30

<!-- pregunta: json_2026#30 | just:b53356014d91 -->

Al leer un archivo JSON plano con `fs`, el resultado es texto crudo. ¿Cómo lo conviertes a objeto?

- `(a)` String.toObjectJS()
- `(b)` JSON.parse()  **← correcta**
- `(c)` JSON.stringify()
- `(d)` ParseData.evaluate()

<!-- justificacion:inicio -->
`JSON.parse()` convierte el texto leído en un objeto de JavaScript. Su par es `JSON.stringify()`, que es la (c) y hace el camino contrario — se confunden por parecido y por costumbre. Conviene envolverlo en `try/catch`: si el archivo está a medias o corrupto, `JSON.parse()` lanza, y sin capturar ese error el proceso se cae.
<!-- justificacion:fin -->

- [x] Aprobada

### 29 · m06#31

<!-- pregunta: json_2026#31 | just:0bce18c3b350 -->

¿Por qué el uso exclusivo de `fs.writeFileSync()` puede ser contraproducente en aplicaciones web?

- `(a)` Solo permite escribir archivos binarios, no strings de texto plano.
- `(b)` Requiere permisos de administrador (root) absolutos para funcionar.
- `(c)` Bloquea el hilo principal, paralizando la atención de otras peticiones.  **← correcta**
- `(d)` Borra automáticamente el archivo si falla la conexión HTTP entrante.

<!-- justificacion:inicio -->
Escribir de forma síncrona detiene el único hilo hasta que el disco responde, y mientras tanto **ninguna otra petición se atiende**. En un guion que corre y termina no importa; en un servidor con usuarios, sí. La salida es la versión con promesas, `fs.promises.writeFile()`, que delega la espera y deja el hilo libre. Las otras tres describen limitaciones que `fs` no tiene.
<!-- justificacion:fin -->

- [x] Aprobada

### 30 · m06#32

<!-- pregunta: json_2026#32 | just:2fd93496a689 -->

Si deseas actualizar un registro dentro de un archivo JSON plano, ¿cuál es el flujo lógico correcto?

- `(a)` Buscar línea exacta por regex y sobrescribir el binario en memoria.
- `(b)` Leer, parsear a objeto JS, modificar, pasarlo a string y reescribir.  **← correcta**
- `(c)` Usar fs.updateJSON() apuntando directo a la propiedad JS anidada.
- `(d)` Inyectar una query SQL parametrizada mediante el módulo file-system.

<!-- justificacion:inicio -->
El flujo es leer el archivo, convertirlo a objeto con `JSON.parse()`, modificar lo que corresponda, volverlo a texto con `JSON.stringify()` y reescribirlo entero. Un archivo JSON no se edita por partes: se reemplaza. De ahí sale su límite como forma de persistencia — dos escrituras a la vez pueden pisarse—, que es justamente el motivo por el que el módulo siguiente pasa a una base de datos.
<!-- justificacion:fin -->

- [x] Aprobada

### 31 · m06#33

<!-- pregunta: json_2026#33 | just:f31b9cc56c7f -->

Al modularizar la persistencia en archivos planos, ¿cuál es una buena práctica de diseño de código?

- `(a)` Dejar toda la lógica de `fs` escrita directamente en los ruteadores HTTP.
- `(b)` Crear funciones independientes orientadas y exportarlas como un módulo.  **← correcta**
- `(c)` Usar variables globales en el scope para compartir los datos en crudo.
- `(d)` Ignorar el manejo de errores de escritura para no interrumpir el flujo.

<!-- justificacion:inicio -->
Conviene reunir las funciones que tocan archivos en un módulo propio y exportarlas, de modo que las rutas solo las llamen. Así la ruta habla de HTTP y el módulo habla de persistencia, y el día que los datos se muden a una base solo cambia un archivo. Las otras tres describen prácticas que atan la aplicación a su forma actual o que dejan pasar los errores en silencio.
<!-- justificacion:fin -->

- [x] Aprobada

### 32 · m06#34

<!-- pregunta: json_2026#34 | just:0beb609d9f39 -->

¿Qué ocurre si intentas usar `fs.writeFileSync()` sobre un archivo físico que aún no existe?

- `(a)` El proceso se detiene forzosamente arrojando un FileNotFoundError.
- `(b)` Node crea el archivo automáticamente e inserta la data especificada.  **← correcta**
- `(c)` Node ignora el comando por seguridad y pasa a la siguiente instrucción.
- `(d)` Solicita permisos de acceso interactivo en la consola del servidor base.

<!-- justificacion:inicio -->
Lo crea. `fs.writeFileSync()` crea el archivo si no existe y lo **sobrescribe entero** si existe, que es la parte que conviene tener presente: no agrega al final. Para eso está `fs.appendFileSync()` o abrirlo con la bandera `'a'`. Las otras tres describen comportamientos que no ocurren: no lanza `FileNotFoundError`, no ignora la orden y no pide permisos por consola.
<!-- justificacion:fin -->

- [x] Aprobada

### 33 · m06#35

<!-- pregunta: json_2026#35 | just:a5f4db409c4e -->

¿Cómo pasas parámetros por línea de comandos al iniciar una aplicación mediante `node index.js`?

- `(a)` node index.js --param=valor  **← correcta**
- `(b)` node index.js &lt;param&gt;valor&lt;/param&gt;
- `(c)` node index.js [param: valor]
- `(d)` node index.js && param=valor_node

<!-- justificacion:inicio -->
Los argumentos se escriben después del nombre del archivo, y la forma `--clave=valor` es la convención habitual porque las bibliotecas que los interpretan la reconocen sola. Las otras tres inventan sintaxis de otros contextos. Lo que llegue queda disponible en `process.argv`, que es la pregunta siguiente, y de ahí lo toman herramientas como `yargs`.
<!-- justificacion:fin -->

- [x] Aprobada

### 34 · m06#36

<!-- pregunta: json_2026#36 | just:5113d93a0e87 -->

¿Dentro de qué estructura array de Node se alojan los argumentos pasados por la línea de comandos?

- `(a)` global.arguments
- `(b)` process.argv  **← correcta**
- `(c)` console.params
- `(d)` node.cli_options

<!-- justificacion:inicio -->
`process.argv` es un arreglo donde los dos primeros elementos son fijos —la ruta de Node y la del archivo— y **a partir del tercero vienen los argumentos de verdad**. Por eso casi siempre se lo recorta con `process.argv.slice(2)`, que es el detalle que más se olvida. Los otros tres nombres no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 35 · m06#37

<!-- pregunta: json_2026#37 | just:c8bea39a6cc6 -->

¿Qué dependencia de terceros se usa comúnmente en Node para parsear fácilmente los argumentos CLI?

- `(a)` yargs  **← correcta**
- `(b)` nodemon
- `(c)` morgan
- `(d)` underscore

<!-- justificacion:inicio -->
`yargs` interpreta los argumentos de la línea de comandos y además permite declarar cuáles son obligatorios, de qué tipo, y generar la ayuda sola. Evita tener que recorrer `process.argv` a mano. Las otras tres son bibliotecas reales con otro oficio: `nodemon` reinicia, `morgan` registra las peticiones HTTP, y `underscore` trae utilidades para colecciones.
<!-- justificacion:fin -->

- [x] Aprobada

### 36 · m06#38

<!-- pregunta: json_2026#38 | just:e476f42abb1b -->

Si una aplicación Node lanza un error y arroja un "Stack Trace", ¿qué te indica esta lectura?

- `(a)` El uso de memoria y carga de CPU exactos al momento del fallo interno.
- `(b)` La traza y jerarquía de funciones llamadas que condujeron al fallo.  **← correcta**
- `(c)` Las variables de entorno de base de datos filtradas accidentalmente.
- `(d)` El historial encolado de peticiones HTTP de los últimos diez minutos.

<!-- justificacion:inicio -->
La traza muestra la cadena de llamadas que llevó al error, de la más reciente hacia atrás, con archivo y línea de cada una. Se lee **de arriba abajo**: la primera línea es donde reventó, y las de abajo cuentan cómo se llegó ahí. Es la información más útil de un fallo, y conviene mirar la primera línea que apunte a código propio y no a `node_modules`.
<!-- justificacion:fin -->

- [x] Aprobada

### 37 · m06#39

<!-- pregunta: json_2026#39 | just:6c020577e0a1 -->

¿Qué atajo de teclado detiene la ejecución activa de un servidor Node.js corriendo en la terminal?

- `(a)` Esc + :q
- `(b)` Ctrl + C (o Cmd + C)  **← correcta**
- `(c)` Alt + F4
- `(d)` process.kill command

<!-- justificacion:inicio -->
`Ctrl + C` envía la señal de interrupción al proceso en primer plano y lo detiene. Es la forma estándar en cualquier terminal. Node permite además atenderla con `process.on('SIGINT', ...)` para cerrar ordenadamente lo que esté abierto, que es lo que hace un servidor bien terminado antes de salir. Las otras tres no detienen un proceso de Node en la terminal.
<!-- justificacion:fin -->

- [x] Aprobada

### 38 · m06#40

<!-- pregunta: json_2026#40 | just:1993f63a8e9e -->

¿Cuál es el comando estándar para imprimir y evaluar el valor de variables en la consola de comandos?

- `(a)` print.value()
- `(b)` document.writeLog()
- `(c)` echo.terminal()
- `(d)` console.log()  **← correcta**

<!-- justificacion:inicio -->
`console.log()` imprime en la salida estándar y sirve tanto en Node como en el navegador. Los otros tres no existen — `document.write` sí existe pero pertenece al navegador y no a Node, donde no hay documento. Conviene conocer también `console.error()`, que escribe en la salida de errores y por eso se puede separar del resto al redirigir.
<!-- justificacion:fin -->

- [x] Aprobada

### 39 · M6-1

<!-- pregunta: js_2026#1 | just:37920385ee54 -->

¿Cuál es el comportamiento nativo principal del Event Loop en la arquitectura de un proceso Node.js?

- `(a)` Asigna un hilo del procesador por cada petición entrante.
- `(b)` Ejecuta tareas síncronas en un único hilo bloqueante.
- `(c)` Gestiona múltiples peticiones concurrentes en un único hilo.  **← correcta**
- `(d)` Delega el ruteo web directamente al motor V8 de Google.

<!-- justificacion:inicio -->
El bucle de eventos es lo que permite atender muchas peticiones concurrentes con **un solo hilo**: mientras una espera por el disco o la red, el hilo atiende otra, y los callbacks de lo que va terminando se van ejecutando por turno. La (a) describe el modelo de un hilo por petición, que es justo el que Node evita, y la (b) le quita lo que lo hace útil.
<!-- justificacion:fin -->

- [x] Aprobada

### 40 · M6-2

<!-- pregunta: js_2026#2 | just:98ac168f5ade -->

¿Qué patrón estructural fundamental define a un middleware dentro del ciclo de vida de Express?

- `(a)` Una base de datos en memoria para almacenar sesiones.
- `(b)` Un motor de renderizado exclusivo para archivos HTML puros.
- `(c)` Una función que intercepta peticiones antes del controlador.  **← correcta**
- `(d)` Un proceso independiente para balanceo de carga.

<!-- justificacion:inicio -->
Un middleware es una función que se interpone entre la petición y el controlador, con acceso a la petición, la respuesta y a `next()`. Ese patrón de cadena es lo que permite componer autenticación, registro y parseo sin tocar cada ruta. Las otras tres describen piezas que no son middlewares. El orden en que se declaran importa: se ejecutan en el orden en que se registraron.
<!-- justificacion:fin -->

- [x] Aprobada

### 41 · M6-3

<!-- pregunta: js_2026#3 | just:df3e5a52bbf3 -->

¿Qué herramienta detiene y reinicia automáticamente un proceso Node.js al detectar cambios en el código?

- `(a)` morgan
- `(b)` express-generator
- `(c)` yargs
- `(d)` nodemon  **← correcta**

<!-- justificacion:inicio -->
`nodemon` vigila los archivos y reinicia el proceso al detectar un cambio, que es lo que evita parar y arrancar a mano en cada edición. Las otras tres son reales y hacen otra cosa: `morgan` registra las peticiones HTTP, `express-generator` crea el esqueleto de un proyecto una sola vez, y `yargs` interpreta argumentos de la consola.
<!-- justificacion:fin -->

- [x] Aprobada

### 42 · M6-4

<!-- pregunta: js_2026#4 | just:69d7f757610c -->

¿Qué comando NPM instala una dependencia asegurando que no se actualice su versión mayor accidentalmente?

- `(a)` npm install &lt;paquete&gt; --no-update
- `(b)` npm install &lt;paquete&gt; --save-exact  **← correcta**
- `(c)` npm add &lt;paquete&gt; --strict
- `(d)` npm update &lt;paquete&gt; --freeze

<!-- justificacion:inicio -->
`npm install <paquete> --save-exact` guarda la versión **sin** `^` ni `~`, de modo que quede clavada tal cual. Los otros tres no existen. Conviene precisar el alcance, porque es más de lo que el enunciado dice: `--save-exact` impide **cualquier** actualización automática, no solo la de versión mayor. La que permite correcciones y funciones nuevas pero bloquea los cambios que rompen es `^`, y es la que npm pone por omisión.
<!-- justificacion:fin -->

- [x] Aprobada

### 43 · M6-5

<!-- pregunta: js_2026#5 | just:44c3ee8768cb -->

¿Dónde registra NPM por defecto la metainformación y versiones de los paquetes instalados localmente?

- `(a)` En el archivo config.env de la raíz del proyecto.
- `(b)` En el registro global de variables de entorno del sistema.
- `(c)` En el archivo de configuración package.json del proyecto.  **← correcta**
- `(d)` Dentro de la carpeta estática bin/node_modules.

<!-- justificacion:inicio -->
`package.json` es donde npm declara las dependencias del proyecto con su rango de versiones. Los otros tres no cumplen ese papel. Conviene distinguirlo de `package-lock.json`, que es su compañero y guarda la versión **exacta** que se instaló de cada paquete y de sus dependencias: el primero dice qué se acepta, el segundo qué se puso, y los dos se versionan.
<!-- justificacion:fin -->

- [x] Aprobada

### 44 · M6-6

<!-- pregunta: js_2026#6 | just:2f3779cd4a3e -->

En Handlebars, ¿qué sintaxis permite renderizar una variable escapando automáticamente el código HTML?

- `(a)` {{{variable}}}
- `(b)` &lt;% variable %&gt;
- `(c)` {{variable}}  **← correcta**
- `(d)` ${variable}

<!-- justificacion:inicio -->
`{{variable}}` escapa el HTML: si el valor trae `<script>`, se muestra como texto en vez de ejecutarse. La (a), `{{{variable}}}` con tres llaves, lo inserta **sin escapar**, y por eso es la puerta de entrada de los ataques XSS cuando el dato viene de fuera. Las otras dos son de otros motores. Esa diferencia entre dos y tres llaves es de las que más se preguntan, y con razón.
<!-- justificacion:fin -->

- [x] Aprobada

### 45 · M6-7

<!-- pregunta: js_2026#7 | just:bb58fc7bc0a5 -->

¿Qué ventaja arquitectónica ofrece el uso de "partials" al construir vistas con motores de plantillas?

- `(a)` Minifican automáticamente el código CSS y JS de la vista.
- `(b)` Permiten reutilizar bloques de código en múltiples vistas.  **← correcta**
- `(c)` Ejecutan código SQL directamente desde la vista del cliente.
- `(d)` Transforman la aplicación a un framework de Single Page App.

<!-- justificacion:inicio -->
Un partial se escribe una vez y se incluye en todas las vistas que lo necesiten, así que la cabecera o el pie dejan de estar repetidos en diez archivos. La ventaja real no es escribir menos sino **corregir en un solo sitio**: un cambio en el menú se aplica en toda la aplicación. Las otras tres atribuyen a los partials cosas que no hacen.
<!-- justificacion:fin -->

- [x] Aprobada

### 46 · M6-8

<!-- pregunta: js_2026#8 | just:73a1d84474eb -->

¿Qué elemento de Handlebars permite ejecutar lógica personalizada para procesar datos antes de renderizarlos?

- `(a)` Los middlewares
- `(b)` Los helpers  **← correcta**
- `(c)` Los routers
- `(d)` Los partials abstractos

<!-- justificacion:inicio -->
Los helpers son funciones de JavaScript registradas en el motor de plantillas y llamadas desde la vista, para resolver ahí lo que la plantilla no puede sola: formatear, comparar, elegir. Los otros tres son conceptos reales de otras capas — los middlewares y los routers pertenecen a Express, y los partials reutilizan HTML pero no ejecutan lógica.
<!-- justificacion:fin -->

- [x] Aprobada

### 47 · M6-9

<!-- pregunta: js_2026#9 | just:cc480c85ca38 -->

¿Qué módulo nativo de Node.js es indispensable para leer y escribir objetos JSON en archivos del sistema?

- `(a)` path
- `(b)` http
- `(c)` fs (file system)  **← correcta**
- `(d)` os

<!-- justificacion:inicio -->
`fs` es el módulo nativo que da acceso al sistema de archivos: leer, escribir, comprobar si algo existe, recorrer directorios. Los otros tres también son nativos y tienen otro oficio: `path` arma y descompone rutas sin preocuparse del sistema operativo, `http` levanta servidores y hace peticiones, y `os` informa de la máquina.
<!-- justificacion:fin -->

- [x] Aprobada

### 48 · M6-10

<!-- pregunta: js_2026#10 | just:32e08fd2fdaf -->

¿Qué operación crítica debes realizar antes de guardar un objeto JavaScript en un archivo de texto plano?

- `(a)` Cifrar el objeto usando el algoritmo bcrypt de forma segura.
- `(b)` Transformarlo a cadena de texto usando JSON.stringify().  **← correcta**
- `(c)` Parsear el objeto a formato binario mediante Buffer.alloc().
- `(d)` Inyectar la llave pública del servidor en el propio objeto.

<!-- justificacion:inicio -->
Hay que convertirlo a texto con `JSON.stringify()`, porque un archivo de texto guarda caracteres y no objetos. Se le puede pasar un tercer argumento para que salga con sangría y se pueda leer a ojo: `JSON.stringify(obj, null, 2)`. Y conviene recordar lo que descarta por el camino: las funciones y las propiedades cuyo valor es `undefined` no viajan.
<!-- justificacion:fin -->

- [x] Aprobada

### 49 · M6-11

<!-- pregunta: js_2026#11 | just:8e22483e2200 -->

Al leer un archivo plano con JSON.parse(), ¿qué riesgo principal existe si el archivo está corrupto?

- `(a)` Borra automáticamente el archivo del disco para protegerlo.
- `(b)` Lanza una excepción síncrona que puede detener la app.  **← correcta**
- `(c)` Retorna un objeto nulo silenciosamente sin avisar al usuario.
- `(d)` Inyecta código malicioso directo al motor de base de datos.

<!-- justificacion:inicio -->
Lanza una excepción, y como es una operación **síncrona**, si nadie la captura el proceso se cae. Por eso `JSON.parse()` casi siempre va dentro de un `try/catch`, sobre todo cuando el archivo lo escribió otro programa o quedó a medias por una caída. Las otras tres describen comportamientos que no ocurren: no borra nada, no devuelve `null` en silencio y no inyecta nada.
<!-- justificacion:fin -->

- [x] Aprobada

### 50 · M6-12

<!-- pregunta: js_2026#12 | just:64a8a2c3f784 -->

¿Qué utilidad tiene el paquete "yargs" al levantar una aplicación Node.js desde la consola de comandos?

- `(a)` Facilita el paso y la validación de parámetros de entrada.  **← correcta**
- `(b)` Inicia un servidor FTP paralelo para recibir archivos.
- `(c)` Limpia los mensajes de error ilegibles de console.log.
- `(d)` Permite compilar el código de JavaScript a binario nativo.

<!-- justificacion:inicio -->
`yargs` toma los argumentos de la consola y los entrega ya interpretados, y permite declarar cuáles son obligatorios, de qué tipo son y qué valor toman por omisión, además de generar la ayuda. Es la diferencia entre leer `process.argv` a mano y tener una interfaz de línea de comandos que avisa cuando el usuario se equivoca. Las otras tres describen cosas que no hace.
<!-- justificacion:fin -->

- [x] Aprobada

### 51 · M6-13

<!-- pregunta: js_2026#13 | just:ae4dbf2a924a -->

¿Qué técnica ayuda a diferenciar niveles de error en la salida de consola al depurar una app Node.js?

- `(a)` Exportar todo el log como un archivo PDF firmado digitalmente.
- `(b)` Utilizar colores y formateo con librerías externas.  **← correcta**
- `(c)` Escribir siempre los mensajes de error en formato XML nativo.
- `(d)` Evitar console.log y usar alertas nativas del sistema.

<!-- justificacion:inicio -->
Dar color y formato a la salida permite distinguir de un vistazo un aviso de un error en medio de muchas líneas. Hay bibliotecas dedicadas a eso, y también registradores que ya traen niveles —`info`, `warn`, `error`— y que además permiten apagar los mensajes de depuración en producción sin borrarlos del código. Las otras tres opciones no ayudan a depurar.
<!-- justificacion:fin -->

- [x] Aprobada

### 52 · M6-14

<!-- pregunta: js_2026#14 | just:7108619e1ec3 -->

Al depurar código asíncrono, ¿por qué los errores en un callback pueden no detener la app principal?

- `(a)` Porque Express auto-reinicia la aplicación inmediatamente.
- `(b)` Porque Node ignora cualquier error fuera del archivo index.js.
- `(c)` Porque el error ocurre en un contexto asíncrono independiente.  **← correcta**
- `(d)` Porque NPM oculta los errores de librerías de terceros.

<!-- justificacion:inicio -->
Porque el callback se ejecuta **después**, en otro turno del bucle de eventos, cuando la función que lo registró ya terminó. Por eso un `try/catch` puesto alrededor de la llamada asíncrona no lo alcanza: cuando el error ocurre, ese bloque hace rato que se cerró. Conviene reconciliarlo con lo que dice la pregunta sobre errores no capturados: si el error se **lanza** y nadie lo atiende, el proceso igual se cae; lo que puede pasar inadvertido es el error que llega como primer argumento del callback —el `err` del patrón error-first— y que el código sencillamente no mira.
<!-- justificacion:fin -->

- [x] Aprobada

---

## Lo que este documento no puede decidir

- **Si las justificaciones son ciertas.** Que existan se comprueba con un
  programa; que sean correctas no. Por eso las lees tú.
- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería
  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.
  Si la quieres, es una pasada editorial aparte.

