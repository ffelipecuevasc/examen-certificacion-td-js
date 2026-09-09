# Cuestionario de Evaluación - Módulo 6: Desarrollo de aplicaciones web Node Express (Nuevas Preguntas)

1. ¿Qué mecanismo utiliza Node.js para evitar que operaciones pesadas bloqueen el hilo principal?
a) Detiene temporalmente las tareas asíncronas de la pila.
b) Ejecuta un reinicio forzado del Event Loop.
c) Delega el proceso a subprocesos externos del sistema operativo.
d) Incrementa dinámicamente la memoria RAM asignada al hilo V8.
Respuesta: c) Delega el proceso a subprocesos externos del sistema operativo.

2. ¿Qué sucede conceptualmente si un middleware en Express no invoca la función `next()`?
a) La solicitud queda colgada indefinidamente hasta agotar el timeout.
b) Express retorna automáticamente un código HTTP 500 al cliente.
c) El servidor Node se reinicia para liberar el bloqueo de memoria.
d) La petición se redirige al inicio de la pila de enrutamiento.
Respuesta: a) La solicitud queda colgada indefinidamente hasta agotar el timeout.

3. ¿Cómo determina Express qué ruta procesar si múltiples endpoints coinciden con la petición?
a) Escoge siempre la ruta que contenga mayor cantidad de parámetros.
b) Evalúa las rutas secuencialmente según su orden de declaración.
c) Lanza un error fatal de colisión de endpoints en el servidor.
d) Fusiona las respuestas de ambas rutas en un arreglo JSON único.
Respuesta: b) Evalúa las rutas secuencialmente según su orden de declaración.

4. ¿Qué función específica cumple el módulo `morgan` mencionado en el ecosistema Node.js?
a) Generar firmas JWT para validar sesiones HTTP.
b) Actuar como un middleware para registrar logs de peticiones HTTP.
c) Encriptar contraseñas de usuarios usando algoritmos hash.
d) Comprimir respuestas JSON grandes reduciendo el peso de red.
Respuesta: b) Actuar como un middleware para registrar logs de peticiones HTTP.

5. ¿Qué utilidad principal ofrece declarar comandos en la sección `scripts` de `package.json`?
a) Crear alias abreviados para ejecutar comandos extensos en terminal.
b) Ejecutar macros de limpieza en la base de datos remotamente.
c) Cifrar el código fuente justo antes de enviarlo a producción.
d) Forzar la descarga de dependencias exclusivas para desarrollo.
Respuesta: a) Crear alias abreviados para ejecutar comandos extensos en terminal.

6. Al clonar un repositorio sin dependencias, ¿qué comando lee el `package.json` y las instala?
a) npm build
b) npm update
c) npm start
d) npm install
Respuesta: d) npm install

7. ¿Cuál es la función técnica estricta del archivo `package-lock.json` generado por NPM?
a) Congelar el árbol de dependencias con versiones criptográficas.
b) Ocultar las vulnerabilidades detectadas en los módulos instalados.
c) Restringir los permisos de escritura en la carpeta node_modules.
d) Bloquear la ejecución de scripts maliciosos de origen dudoso.
Respuesta: a) Congelar el árbol de dependencias con versiones criptográficas.

8. ¿Cómo se elimina por completo un paquete de disco y del archivo `package.json` mediante CLI?
a) npm delete <paquete>
b) npm remove-pkg <paquete>
c) npm uninstall <paquete>
d) npm drop <paquete>
Respuesta: c) npm uninstall <paquete>

9. ¿Qué bandera de NPM se utiliza para instalar un paquete como herramienta binaria de sistema?
a) --system (o -s)
b) --global (o -g)
c) --bin (o -b)
d) --core (o -c)
Respuesta: b) --global (o -g)

10. ¿Cómo se le indica a Express nativamente el directorio exacto donde buscar las plantillas?
a) app.use('templates', ruta)
b) app.config('views-folder', ruta)
c) app.set('views', ruta)
d) express.views(ruta)
Respuesta: c) app.set('views', ruta)

11. En sintaxis Handlebars, ¿cómo se logra iterar dinámicamente un arreglo de objetos "items"?
a) {{#for items}} ... {{/for}}
b) {{#each items}} ... {{/each}}
c) {{map items}} ... {{/map}}
d) {{loop items}} ... {{/loop}}
Respuesta: b) {{#each items}} ... {{/each}}

12. ¿Qué diferencia conceptual existe entre un "Partial" y un "Layout" en diseño con Handlebars?
a) El layout procesa datos asíncronos; el partial solo texto plano.
b) El layout envuelve la vista central; el partial se inyecta en ella.
c) El partial requiere un servidor separado para renderizar su CSS.
d) El layout define estilos en línea y el partial define lógica JS.
Respuesta: b) El layout envuelve la vista central; el partial se inyecta en ella.

13. ¿Qué sintaxis de Handlebars inyecta código HTML omitiendo la limpieza de caracteres hostiles?
a) {{{ variable }}}
b) {& variable &}
c) {{! variable !}}
d) {HTML: variable }
Respuesta: a) {{{ variable }}}

14. En Handlebars, ¿qué ocurre si la condición de un bloque `{{#if variable}}` evalúa a false?
a) Genera una etiqueta HTML vacía con clase de error.
b) El bloque interno simplemente es omitido en el renderizado final.
c) Renderiza la cadena de texto literal "false" en el navegador.
d) Interrumpe el motor y arroja un error 500 al cliente web HTTP.
Respuesta: b) El bloque interno simplemente es omitido en el renderizado final.

15. ¿Qué comportamiento asume `fs.appendFileSync()` respecto al contenido previo de un archivo?
a) Sustituye el contenido anterior si el tamaño es menor al nuevo.
b) Lo borra inmediatamente y coloca exclusivamente el nuevo texto.
c) Añade los nuevos datos al final del archivo sin sobrescribirlo.
d) Inserta el texto al inicio, desplazando los datos a la derecha.
Respuesta: c) Añade los nuevos datos al final del archivo sin sobrescribirlo.

16. Al persistir JSON, ¿para qué se añaden los argumentos `null` y `2` en `JSON.stringify`?
a) Para codificar los strings en formato UTF-16 seguro.
b) Para eliminar claves nulas y limitar la profundidad máxima a 2.
c) Para ofuscar el código usando una semilla de 2 bytes rotados.
d) Para generar una cadena indentada con dos espacios legibles.
Respuesta: d) Para generar una cadena indentada con dos espacios legibles.

17. ¿Qué excepción lanza Node si `fs.readFileSync()` intenta leer un archivo protegido por el SO?
a) Un error de desbordamiento de pila (StackOverflow).
b) Un error asíncrono que Node pasa al archivo de logs.
c) Un error sincrónico de permisos denegados (EACCES).
d) Un bloqueo silencioso sin arrojar mensaje alguno.
Respuesta: c) Un error sincrónico de permisos denegados (EACCES).

18. ¿Qué ocurre internamente si intentas parsear texto plano malformado con `JSON.parse()`?
a) Retorna un objeto vacío para evitar bloqueos del servidor.
b) El motor lanza un SyntaxError inmediato interrumpiendo el flujo.
c) Corrige las comillas automáticamente para evitar colapsos.
d) Convierte el texto completo en una variable de tipo String.
Respuesta: b) El motor lanza un SyntaxError inmediato interrumpiendo el flujo.

19. ¿Qué método sincrónico del módulo `fs` permite evaluar previamente si una ruta física existe?
a) fs.existsSync(ruta)
b) fs.checkPathSync(ruta)
c) fs.verifyFile(ruta)
d) fs.isRealSync(ruta)
Respuesta: a) fs.existsSync(ruta)

20. ¿Cómo se captura programáticamente una variable de entorno definida al iniciar el proceso Node?
a) process.env.NOMBRE_VARIABLE
b) global.env.NOMBRE_VARIABLE
c) node.system.NOMBRE_VARIABLE
d) window.env.NOMBRE_VARIABLE
Respuesta: a) process.env.NOMBRE_VARIABLE

21. ¿Qué objetivo cumple añadir la bandera `--inspect` al ejecutar un script de Node en consola?
a) Habilitar un agente de depuración vinculado a un puerto de red.
b) Forzar la compilación del código fuente a TypeScript nativo.
c) Analizar vulnerabilidades de paquetes antes de la ejecución.
d) Mostrar el consumo de RAM en tiempo real durante diez minutos.
Respuesta: a) Habilitar un agente de depuración vinculado a un puerto de red.

22. ¿Qué riesgo arquitectónico presenta mantener llamadas a `console.log()` en ciclos de producción?
a) Borra los archivos log del sistema si superan 1 megabyte.
b) Degrada el rendimiento al ser una operación sincrónica pesada.
c) Altera irreversiblemente las respuestas HTTP enviadas.
d) Filtra las claves de encriptación al exterior por defecto.
Respuesta: b) Degrada el rendimiento al ser una operación sincrónica pesada.

23. Al utilizar el paquete `yargs`, ¿qué método encadenado fuerza que un parámetro sea obligatorio?
a) .forceParam('parametro')
b) .requireArg('parametro')
c) .demandOption('parametro')
d) .mandatory('parametro')
Respuesta: c) .demandOption('parametro')

24. ¿Qué diferencia nativa existe entre usar `console.error()` y `console.log()` en la terminal?
a) `error()` formatea la salida exclusivamente en formato JSON.
b) `error()` bloquea el hilo principal y detiene la aplicación.
c) `error()` direcciona el flujo a la salida de errores (stderr).
d) Ninguna, ambos comandos apuntan a la misma salida (stdout).
Respuesta: c) `error()` direcciona el flujo a la salida de errores (stderr).

25. ¿Cuál es el propósito del paquete de terceros `moment` citado en ecosistemas Node.js?
a) Ejecutar tareas programadas repetitivas tipo CRON.
b) Parsear, manipular, validar y formatear fechas complejas.
c) Reducir el tiempo de carga del servidor en cada reinicio.
d) Realizar operaciones matemáticas asíncronas complejas.
Respuesta: b) Parsear, manipular, validar y formatear fechas complejas.

26. En un entorno de desarrollo Node.js, ¿qué problemática principal resuelve el paquete `mocha`?
a) Minificar los archivos estáticos de forma desatendida.
b) Crear bases de datos falsas para tests de integración.
c) Proveer un marco estructurado para ejecutar pruebas unitarias.
d) Generar interfaces gráficas para controlar el servidor web.
Respuesta: c) Proveer un marco estructurado para ejecutar pruebas unitarias.

27. ¿Qué protocolo de red subyacente abstrae la librería `socket.io` en comunicación bidireccional?
a) HTTP/2 Multiplexado
b) WebSockets
c) MQTT
d) FTP Binario
Respuesta: b) WebSockets

28. ¿Qué funcionalidad principal provee el paquete de utilidades `underscore` en un proyecto Node?
a) Cifrar contraseñas con el algoritmo hash SHA-256 seguro.
b) Funciones funcionales auxiliares para arreglos y objetos.
c) Mapear objetos JSON directo a estructuras de base de datos.
d) Renderizar vistas HTML sin usar un motor de plantillas.
Respuesta: b) Funciones funcionales auxiliares para arreglos y objetos.

29. En Express, ¿cómo se inyecta un middleware para que procese absolutamente todas las rutas?
a) Usando app.use(middleware) sin ruta específica.
b) Definiendo app.all('/', middleware) al inicio.
c) Añadiendo la bandera 'global' al llamar a express().
d) Incluyéndolo en el arreglo arguments del servidor base.
Respuesta: a) Usando app.use(middleware) sin ruta específica.

30. ¿Cómo se intercepta formalmente un error 404 para rutas inexistentes en un servidor Express?
a) Editando el archivo de configuración interno del motor V8.
b) Modificando la cabecera del cliente antes del envío local.
c) Ubicando un middleware capturador tras todas las rutas.
d) Ejecutando app.on('404', callback) en la inicialización.
Respuesta: c) Ubicando un middleware capturador tras todas las rutas.

31. En consola, ¿qué visualización genera el comando `npm list` sobre los paquetes instalados?
a) Una tabla comparativa con los precios de licencias comerciales.
b) Un árbol jerárquico de los paquetes y sus subdependencias.
c) Un resumen en formato CSV ordenado por peso en megabytes.
d) Un volcado binario con los ejecutables instalados globales.
Respuesta: b) Un árbol jerárquico de los paquetes y sus subdependencias.

32. Para que Handlebars compile correctamente variables, ¿qué estructura debe tener el contexto?
a) Un objeto plano JavaScript (POJO) con propiedades accesibles.
b) Un arreglo bidimensional de textos puramente alfanuméricos.
c) Un flujo binario extraído directamente de la base de datos.
d) Un objeto nativo Buffer encriptado en formato Base64Url.
Respuesta: a) Un objeto plano JavaScript (POJO) con propiedades accesibles.

33. ¿Cuál es el método oficial utilizado para registrar un nuevo "Helper" en Handlebars?
a) app.createHelper('nombre', callback)
b) Handlebars.registerHelper('nombre', callback)
c) hbs.addFunction('nombre', callback)
d) Handlebars.newInject('nombre', callback)
Respuesta: b) Handlebars.registerHelper('nombre', callback)

34. En el sistema CommonJS de Node, ¿qué ruta exacta almacena la variable global `__dirname`?
a) La raíz del disco duro donde está instalado el sistema.
b) El directorio temporal del sistema operativo host actual.
c) La ruta absoluta del directorio del archivo ejecutado.
d) La ruta de internet pública accesible por el cliente final.
Respuesta: c) La ruta absoluta del directorio del archivo ejecutado.

35. ¿Qué método nativo asegura la correcta concatenación de rutas ignorando el tipo de sistema?
a) os.mergePaths()
b) fs.concatDirs()
c) path.join()
d) route.build()
Respuesta: c) path.join()

36. Al ejecutar `npm update` en la terminal, ¿bajo qué criterio se actualizan las dependencias?
a) Descarga siempre la última versión Beta ignorando conflictos.
b) Respetando los rangos semánticos fijados en package.json.
c) Sobrescribe los módulos solo si el tamaño en bytes es menor.
d) Fuerza la reinstalación global de todo el entorno operativo.
Respuesta: b) Respetando los rangos semánticos fijados en package.json.

37. En la depuración CLI, ¿por qué es buena práctica emplear librerías que coloreen la consola?
a) Disminuye el peso de los registros almacenados en el disco.
b) Evita ataques de inyección de código desde la línea comandos.
c) Acelera la compilación del V8 al procesar strings simples.
d) Facilita discriminar visualmente errores críticos de alertas.
Respuesta: d) Facilita discriminar visualmente errores críticos de alertas.

38. En Express, ¿qué objeto de la petición (req) almacena los parámetros extraídos del body POST?
a) req.body
b) req.payload
c) req.data
d) req.postParams
Respuesta: a) req.body

39. Al programar el servidor, ¿qué indica la asignación de puerto con `process.env.PORT`?
a) Que el puerto siempre será forzado al valor 80 u 443 estricto.
b) Que Express buscará puertos libres escaneando aleatoriamente.
c) Que el puerto será inyectado dinámicamente por el entorno host.
d) Que el servicio se negará a funcionar fuera de red localhost.
Respuesta: c) Que el puerto será inyectado dinámicamente por el entorno host.

40. ¿Qué variable inyectada globalmente por CommonJS representa la ruta absoluta al archivo actual?
a) __filepath
b) __filename
c) process.file
d) global.sourceFile
Respuesta: b) __filename
