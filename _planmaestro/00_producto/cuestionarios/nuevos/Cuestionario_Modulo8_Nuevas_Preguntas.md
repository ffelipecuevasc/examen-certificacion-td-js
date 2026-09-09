# Cuestionario de Evaluación - Módulo 8: Implementación de API Backend Node Express (Nuevas Preguntas)

1. En una arquitectura REST, ¿por qué los métodos HTTP se prefieren sobre las URLs con nombres de acciones?
a) Para que las URLs identifiquen recursos (ej. /usuarios) en vez de acciones (ej. /crearUsuario).
b) Porque los métodos HTTP evitan que el cliente descargue el payload completo.
c) Para asegurar que el servidor comprima automáticamente todos los datos en formato binario.
d) Porque las URLs con verbos no pueden ser procesadas por middlewares en Express.
Respuesta: a) Para que las URLs identifiquen recursos (ej. /usuarios) en vez de acciones (ej. /crearUsuario).

2. ¿Qué vulnerabilidad puede mitigarse al aplicar la regla "Cacheable" correctamente en REST?
a) Ejecución remota de código arbitrario (RCE).
b) Inyección de código malicioso XSS.
c) Ataques de denegación de servicio (DDoS) al reducir la carga del backend.
d) Escalamiento de privilegios mediante inyección SQL estricta.
Respuesta: c) Ataques de denegación de servicio (DDoS) al reducir la carga del backend.

3. Al modelar una relación 1:N en una API REST (ej. posts de un usuario), ¿cuál es el endpoint recomendado?
a) GET /posts/user=123
b) GET /usuarios/123/posts
c) GET /usuarios-posts/123
d) GET /api/v1/posts/get?usuario=123
Respuesta: b) GET /usuarios/123/posts

4. Según el modelo de madurez de Richardson, ¿qué nivel representa una API puramente HATEOAS?
a) Nivel 0 (Punto a punto).
b) Nivel 1 (Recursos).
c) Nivel 2 (Verbos HTTP).
d) Nivel 3 (Controles hipermedia).
Respuesta: d) Nivel 3 (Controles hipermedia).

5. ¿Qué problema arquitectónico específico soluciona el principio de "Separación Cliente-Servidor"?
a) Previene el envío de cabeceras HTTP redundantes.
b) Permite que el cliente y servidor evolucionen de forma completamente independiente.
c) Obliga al servidor a almacenar el estado de la sesión del usuario.
d) Garantiza que el código JS se compile a C++ para mayor rendimiento.
Respuesta: b) Permite que el cliente y servidor evolucionen de forma completamente independiente.

6. Al recibir una solicitud HTTP en Express, ¿cuál es la primera estructura en evaluar la petición antes del enrutador?
a) La base de datos.
b) Los Middlewares globales de aplicación.
c) El motor de plantillas (Handlebars).
d) El controlador final (Controller).
Respuesta: b) Los Middlewares globales de aplicación.

7. ¿Qué método Express es esencial invocar para que el servidor entienda y parsee datos enviados en formato JSON crudo?
a) app.use(express.urlencoded({ extended: true }))
b) app.use(express.json())
c) app.parseBody(JSON)
d) app.use(bodyParser.raw())
Respuesta: b) app.use(express.json())

8. Si necesitas actualizar completamente todos los campos de un recurso existente, ¿qué verbo HTTP es el canónico?
a) PUT
b) PATCH
c) POST
d) UPDATE
Respuesta: a) PUT

9. ¿Qué diferencia práctica sustancial existe entre los métodos HTTP PUT y PATCH?
a) PUT es solo para texto plano; PATCH soporta binarios y JSON.
b) PATCH crea un nuevo registro siempre; PUT solo elimina.
c) PUT reemplaza la entidad completa; PATCH aplica modificaciones parciales.
d) PATCH es un método idempotente; PUT no lo es.
Respuesta: c) PUT reemplaza la entidad completa; PATCH aplica modificaciones parciales.

10. Si un cliente envía una petición POST con un JSON malformado, ¿qué código de estado debe retornar la API?
a) 401 Unauthorized
b) 404 Not Found
c) 400 Bad Request
d) 415 Unsupported Media Type
Respuesta: c) 400 Bad Request

11. ¿Qué código de estado HTTP indica que la solicitud carece de credenciales válidas de autenticación?
a) 401 Unauthorized
b) 403 Forbidden
c) 405 Method Not Allowed
d) 409 Conflict
Respuesta: a) 401 Unauthorized

12. ¿Qué código HTTP 4xx envías si el usuario está autenticado, pero NO tiene permisos para esa ruta en particular?
a) 401 Unauthorized
b) 403 Forbidden
c) 406 Not Acceptable
d) 429 Too Many Requests
Respuesta: b) 403 Forbidden

13. Si procesas un DELETE y eliminas exitosamente un recurso sin necesitar devolver contenido, ¿qué código usas?
a) 200 OK
b) 201 Created
c) 202 Accepted
d) 204 No Content
Respuesta: d) 204 No Content

14. ¿Qué técnica permite a un router de Express delegar o segmentar subrutas a otros archivos (ej. `/api/users`)?
a) Usar `const router = express.Router()` y luego `app.use()`.
b) Emplear la directiva estricta `app.includeRouter()`.
c) Invocar un callback recursivo usando `express.nextRoute()`.
d) Crear múltiples puertos de escucha con `app.listen()`.
Respuesta: a) Usar `const router = express.Router()` y luego `app.use()`.

15. Al estructurar controladores en Express, ¿por qué se recomienda abstraer la lógica en una carpeta separada?
a) Para encriptar automáticamente el código fuente en producción.
b) Para separar la definición de rutas (endpoints) de la lógica de negocio (MVC).
c) Para evadir los bloqueos de seguridad del Event Loop de Node.js.
d) Para inhabilitar peticiones HTTP provenientes de IPs anónimas.
Respuesta: b) Para separar la definición de rutas (endpoints) de la lógica de negocio (MVC).

16. ¿Qué función debe invocar obligatoriamente el último middleware para transferir el control a la ruta final?
a) res.send()
b) return;
c) next()
d) emit('done')
Respuesta: c) next()

17. Al validar un upload, ¿qué método en Node (usando `fs`) verifica si el directorio destino existe antes de mover el archivo?
a) fs.existsSync(dirPath)
b) fs.validateFolder(dirPath)
c) fs.mkdirSync(dirPath)
d) fs.checkNode(dirPath)
Respuesta: a) fs.existsSync(dirPath)

18. En `express-fileupload`, ¿cómo evitas que múltiples archivos se sobreescriban si se envían bajo el mismo nombre clave?
a) El middleware bloquea peticiones múltiples automáticamente.
b) Comprobando si `req.files.archivo` es un Array antes de iterar.
c) Express asigna sufijos numéricos transparentemente.
d) Se rechaza el request con un error 500 fatal.
Respuesta: b) Comprobando si `req.files.archivo` es un Array antes de iterar.

19. ¿Por qué se prefiere renombrar archivos subidos empleando algoritmos generadores como UUID (Universally Unique Identifier)?
a) Para comprimir el archivo al vuelo reduciendo bytes.
b) Para garantizar que los nombres sean inmutables y sin colisiones en disco.
c) Porque PostgreSQL rechaza nombres de archivo convencionales.
d) Para encriptar el contenido físico del archivo contra ransomware.
Respuesta: b) Para garantizar que los nombres sean inmutables y sin colisiones en disco.

20. Si un usuario intenta subir un archivo `.exe` disfrazado de `.jpg`, ¿qué validación robusta lo detectaría?
a) Leer únicamente la extensión textual extraída del string `file.name`.
b) Validar si el string contiene la palabra "image".
c) Usar un paquete como `file-type` para leer la firma binaria real (Magic Numbers).
d) Dejar que el middleware Express compruebe si es ejecutable.
Respuesta: c) Usar un paquete como `file-type` para leer la firma binaria real (Magic Numbers).

21. Al procesar un archivo grande mediante `file.mv(path, callback)`, ¿qué naturaleza tiene esta operación?
a) Es estrictamente sincrónica, bloqueando a los demás usuarios web.
b) Es puramente asíncrona, liberando el hilo principal.
c) Es un volcado binario en memoria RAM exclusivamente.
d) Abre un WebWorker que reinicia el proceso del sistema.
Respuesta: b) Es puramente asíncrona, liberando el hilo principal.

22. ¿Qué ataque informático mitigas al sanitizar la ruta de destino de un archivo y remover caracteres como `../`?
a) Ataque de Inyección SQL.
b) Ataque de Directorio Transversal (Path Traversal).
c) Falsificación de Petición entre Sitios (CSRF).
d) Ejecución de Código Remoto vía buffer.
Respuesta: b) Ataque de Directorio Transversal (Path Traversal).

23. Al guardar imágenes subidas, ¿cuál es el patrón arquitectónico óptimo para bases de datos relacionales?
a) Guardar los bytes crudos (Buffer/Blob) de la imagen dentro de una columna de PostgreSQL.
b) Guardar el archivo en el disco duro o nube y almacenar solo su ruta o URL en la base de datos.
c) Codificar la imagen a Base64 y guardarla como String inmenso en la tabla.
d) Descartar la imagen tras 24 horas para ahorrar almacenamiento.
Respuesta: b) Guardar el archivo en el disco duro o nube y almacenar solo su ruta o URL en la base de datos.

24. ¿Qué significa que la firma de un JSON Web Token (JWT) garantice "Integridad"?
a) Que su contenido (payload) viaja encriptado y es ilegible.
b) Que cualquier modificación en el Header o Payload invalidará matemáticamente el Token.
c) Que el Token nunca caducará si el usuario no cierra su sesión.
d) Que el Token protege la base de datos contra peticiones concurrentes masivas.
Respuesta: b) Que cualquier modificación en el Header o Payload invalidará matemáticamente el Token.

25. En la estructura del JWT, ¿qué algoritmo de cifrado asimétrico es ampliamente usado para firmarlo de forma segura?
a) MD5
b) SHA-1
c) HMAC-SHA256 (HS256) o RSA (RS256)
d) AES-128
Respuesta: c) HMAC-SHA256 (HS256) o RSA (RS256)

26. En un sistema autenticado con JWT, si el servidor cae y se reinicia, ¿qué sucede con las sesiones activas?
a) Todos los usuarios pierden sus sesiones y deben reconectarse.
b) Los tokens en tránsito se destruyen y las IPs son bloqueadas.
c) Las sesiones siguen válidas, pues el token firmado contiene su propia validación.
d) El servidor solicita obligatoriamente el ingreso de 2FA al reiniciar.
Respuesta: c) Las sesiones siguen válidas, pues el token firmado contiene su propia validación.

27. ¿Qué claim (propiedad) estándar de JWT se usa para definir su fecha de caducidad o expiración?
a) iat (Issued At)
b) exp (Expiration Time)
c) sub (Subject)
d) iss (Issuer)
Respuesta: b) exp (Expiration Time)

28. Al invocar `jwt.sign(payload, secretKey)`, ¿qué tipo de dato debes evitar colocar dentro del payload?
a) Roles de usuario no sensibles (ej. 'admin').
b) Identificadores públicos del usuario (ej. ID numérico).
c) Información confidencial extrema como contraseñas, PIN o tarjetas.
d) Fechas de emisión del token.
Respuesta: c) Información confidencial extrema como contraseñas, PIN o tarjetas.

29. Si un atacante intercepta un JWT válido y no caducado, ¿qué puede hacer con él?
a) Descifrar la contraseña de la base de datos interna.
b) Sobrescribir la clave secreta alojada en el backend de Express.
c) Falsificar solicitudes a nombre del usuario suplantando su identidad (Token Hijacking).
d) Reiniciar el servidor saturando la RAM del entorno Node.
Respuesta: c) Falsificar solicitudes a nombre del usuario suplantando su identidad (Token Hijacking).

30. ¿Qué estrategia arquitectónica complementaria se emplea para revocar un JWT antes de que caduque su tiempo `exp`?
a) Editar dinámicamente el payload del token en el cliente web.
b) Utilizar una "Blacklist" (lista negra) alojada en una DB rápida como Redis.
c) Cambiar el algoritmo de firmado a RSA en tiempo de ejecución.
d) Enviar una petición DELETE para destruir el token en el disco duro del usuario.
Respuesta: b) Utilizar una "Blacklist" (lista negra) alojada en una DB rápida como Redis.

31. ¿Qué encabezado HTTP canónico debe evaluar tu middleware para capturar el token entrante del cliente?
a) Authentication-Bearer
b) X-Access-Token
c) Authorization
d) JWT-Header-Key
Respuesta: c) Authorization

32. Al procesar el Header `Authorization: Bearer <token>`, ¿qué método de string es ideal para extraer solo la cadena del token?
a) header.slice()
b) header.split(" ")[1]
c) header.replace("Bearer", "")
d) header.concat()
Respuesta: b) header.split(" ")[1]

33. Cuando `jwt.verify(token, secret)` falla por expiración, ¿qué excepción específica arroja la librería?
a) JsonWebTokenError
b) NotBeforeError
c) TokenExpiredError
d) SignatureFailedError
Respuesta: c) TokenExpiredError

34. ¿Por qué es un riesgo de seguridad crítico codificar un token en secreto o ("secretKey") con valores débiles o por defecto?
a) Permite a un atacante aplicar fuerza bruta para deducir el secreto y falsificar tokens propios.
b) Disminuye drásticamente el rendimiento del Event Loop al encriptar.
c) Provoca colisiones de nombres de usuario dentro del Payload.
d) Corrompe permanentemente la cabecera Base64Url del sistema base.
Respuesta: a) Permite a un atacante aplicar fuerza bruta para deducir el secreto y falsificar tokens propios.

35. En un middleware de protección Express, si el JWT es válido, ¿qué paso final se da antes de invocar `next()`?
a) Inyectar los datos decodificados del usuario (ej. `req.user = decoded`) para que la ruta los procese.
b) Redirigir la llamada HTTP al archivo `index.html` estático.
c) Firmar un token nuevo y añadirlo automáticamente en los Headers de salida.
d) Reiniciar el temporizador de sesión de la base de datos PostgreSQL.
Respuesta: a) Inyectar los datos decodificados del usuario (ej. `req.user = decoded`) para que la ruta los procese.

36. En el diseño de autenticación REST con JWT, ¿qué rol cumple un "Refresh Token"?
a) Forzar la descarga de metadatos estáticos desde la interfaz gráfica.
b) Permitir la emisión de nuevos "Access Tokens" sin solicitar nuevamente credenciales al usuario.
c) Reemplazar por completo el uso de contraseñas mediante cifrado asimétrico persistente.
d) Vaciar la caché DNS del navegador web al reiniciar la API.
Respuesta: b) Permitir la emisión de nuevos "Access Tokens" sin solicitar nuevamente credenciales al usuario.

37. ¿Qué método Express es adecuado para configurar encabezados CORS y permitir peticiones frontend desde dominios cruzados?
a) app.use(cors()) utilizando el paquete "cors".
b) express.setHeaders('Access-Control') nativamente.
c) app.allowOrigin('*') en cada ruta individual.
d) app.disable('strict-cors') global.
Respuesta: a) app.use(cors()) utilizando el paquete "cors".

38. ¿Qué código HTTP es correcto retornar si el middleware de verificación detecta un JWT corrupto, alterado o inválido?
a) 500 Internal Error
b) 404 Not Found
c) 401 Unauthorized
d) 406 Not Acceptable
Respuesta: c) 401 Unauthorized

39. Si implementas control de roles (RBAC) tras verificar el token, ¿dónde almacenas convencionalmente el rol del usuario en JWT?
a) En la clave secreta interna.
b) En el claim público del Payload (ej. `payload.role`).
c) En la cabecera Header (ej. `header.alg`).
d) Codificado en la firma digital (Signature).
Respuesta: b) En el claim público del Payload (ej. `payload.role`).

40. Al desplegar una API REST en producción, ¿dónde debes resguardar imperativamente la clave secreta `JWT_SECRET`?
a) En un archivo JS público importado en el repositorio GitHub.
b) En variables de entorno (`.env`) inaccesibles desde el exterior y no versionadas.
c) Codificada en Base64 al inicio del archivo principal `index.js`.
d) Dentro del mismo Payload para su fácil recuperación.
Respuesta: b) En variables de entorno (`.env`) inaccesibles desde el exterior y no versionadas.
