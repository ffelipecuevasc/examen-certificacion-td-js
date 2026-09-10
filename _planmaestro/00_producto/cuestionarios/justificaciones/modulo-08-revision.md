# Justificaciones del módulo 8 · para revisar

**Lote:** 45 preguntas · **Redactadas:** 2026-09-10 por Claude Code

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

### 01 · m08#1

<!-- pregunta: json_2026#1 | just:531bd4293b34 -->

¿Qué principio REST estipula que cada petición contenga toda la info necesaria sin usar sesiones?

- `(a)` Interfaz uniforme estricta.
- `(b)` Sistema de capas enrutadas.
- `(c)` Comunicación sin estado (Stateless).  **← correcta**
- `(d)` Arquitectura cliente-servidor.

<!-- justificacion:inicio -->
«Sin estado» significa que el servidor no recuerda nada entre una petición y la siguiente: cada una llega con todo lo que hace falta para atenderla, incluida la credencial. Eso es lo que permite poner varios servidores detrás de un balanceador sin preocuparse de a cuál cae cada petición. Las otras tres son restricciones reales de REST con otro oficio, y por eso son buenos distractores.
<!-- justificacion:fin -->

- [x] Aprobada

### 02 · m08#2

<!-- pregunta: json_2026#2 | just:0f3707a8ba64 -->

¿Qué ventaja técnica aporta la regla "Cacheable" en la arquitectura REST?

- `(a)` Encripta automáticamente el payload JSON del body.
- `(b)` Elimina la necesidad de usar verbos HTTP.
- `(c)` Reduce el consumo de ancho de banda y latencia.  **← correcta**
- `(d)` Bloquea peticiones de dominios no autorizados por CORS.

<!-- justificacion:inicio -->
Que una respuesta se pueda guardar en caché evita volver a pedirla: menos viajes por la red, menos trabajo del servidor y respuestas más rápidas. Se declara con cabeceras como `Cache-Control` y `ETag`, que dicen qué se puede guardar y por cuánto. Las otras tres describen cosas de las que se ocupan TLS, los verbos HTTP y CORS, cada uno por su lado.
<!-- justificacion:fin -->

- [x] Aprobada

### 03 · m08#3

<!-- pregunta: json_2026#3 | just:5725ca0b816f -->

Según las buenas prácticas REST, ¿cómo debe nombrarse convencionalmente un endpoint de recursos?

- `(a)` Usando verbos de acción (ej. /getUsuarios).
- `(b)` Usando sustantivos en plural (ej. /usuarios).  **← correcta**
- `(c)` Usando el método HTTP en el path (ej. /usuarios/post).
- `(d)` Usando identificadores binarios en la raíz (ej. /0101).

<!-- justificacion:inicio -->
Un endpoint nombra **un recurso**, no una acción: `/usuarios`, y la acción la dice el verbo HTTP. Por eso `/getUsuarios` es redundante —el `GET` ya lo decía— y mezcla dos formas de expresar lo mismo. El plural es la convención porque la ruta representa la colección, y el elemento se identifica dentro de ella: `/usuarios/123`.
<!-- justificacion:fin -->

- [x] Aprobada

### 04 · m08#5

<!-- pregunta: json_2026#5 | just:e17484cf319b -->

En diseño REST, ¿cómo se versiona convencionalmente una API en su etapa inicial?

- `(a)` Pasando la versión en el body de cada POST.
- `(b)` Incluyendo el prefijo /v1/ en la URL base del endpoint.  **← correcta**
- `(c)` Encriptando el número de versión en el JWT.
- `(d)` Añadiendo la cabecera X-Version a cada petición.

<!-- justificacion:inicio -->
Lo habitual al empezar es poner la versión en la ruta: `/v1/usuarios`. Es visible, se prueba desde el navegador y no exige acordarse de ninguna cabecera. La (d) describe una alternativa real —versionar por cabecera— que algunos consideran más limpia porque deja la URL identificando solo el recurso; existe, pero no es lo convencional en una API que recién arranca.
<!-- justificacion:fin -->

- [x] Aprobada

### 05 · m08#6

<!-- pregunta: json_2026#6 | just:819439a9036d -->

¿Qué restricción aplica el "Sistema de Capas" en una arquitectura RESTful estándar?

- `(a)` El cliente desconoce si se conecta al servidor final o a un proxy.  **← correcta**
- `(b)` Los datos viajan forzosamente en formato XML.
- `(c)` Impide el uso de balanceadores de carga intermedios.
- `(d)` Exige una conexión directa punto a punto por TCP/IP.

<!-- justificacion:inicio -->
El sistema de capas dice que el cliente no puede saber si habla con el servidor final o con un intermediario. Gracias a eso se pueden meter proxys, cachés y balanceadores sin que el cliente cambie una línea. La (c) dice exactamente lo contrario: los balanceadores no solo se permiten, son la razón de ser de esta restricción.
<!-- justificacion:fin -->

- [x] Aprobada

### 06 · m08#7

<!-- pregunta: json_2026#7 | just:8d708e2ef84b -->

¿Qué formato de salida se considera el estándar predominante al diseñar una API REST moderna?

- `(a)` SOAP encapsulado.
- `(b)` XML nativo estructurado.
- `(c)` HTML renderizado.
- `(d)` JSON (Notación de Objetos JavaScript).  **← correcta**

<!-- justificacion:inicio -->
JSON es el formato predominante en las APIs REST modernas: es liviano, lo entiende cualquier lenguaje y en JavaScript se convierte a objeto con una llamada. Las otras tres existieron o existen — SOAP y XML dominaron antes y siguen vivos en sistemas heredados, y HTML es para páginas, no para datos. REST no obliga a JSON, pero es lo que se espera.
<!-- justificacion:fin -->

- [x] Aprobada

### 07 · m08#8

<!-- pregunta: json_2026#8 | just:22b7f040b60d -->

Según REST, ¿cuál es el mecanismo adecuado para realizar búsquedas y filtros en colecciones?

- `(a)` Parámetros de consulta (Query Parameters) en la URL.  **← correcta**
- `(b)` Enviar un archivo de texto con los filtros requeridos.
- `(c)` Modificar los encabezados HTTP para cada filtro.
- `(d)` Usar exclusivamente el verbo POST con un body detallado.

<!-- justificacion:inicio -->
Los filtros y búsquedas van en la cadena de consulta: `/usuarios?rol=admin&orden=nombre`. Así el endpoint sigue nombrando el recurso y los parámetros solo lo acotan. Además la URL completa se puede compartir y guardar en caché, cosa que la (d) perdería: usar `POST` para buscar rompe la semántica del verbo y deja la petición fuera de cualquier caché.
<!-- justificacion:fin -->

- [x] Aprobada

### 08 · m08#9

<!-- pregunta: json_2026#9 | just:a6f1e0a5dbd1 -->

¿Qué regla REST establece la separación estricta entre interfaz de usuario y almacenamiento?

- `(a)` Interfaz Uniforme (Uniform Interface).
- `(b)` Caché implícita.
- `(c)` Cliente-Servidor (Client-Server).  **← correcta**
- `(d)` Código bajo demanda (Code on demand).

<!-- justificacion:inicio -->
La restricción cliente-servidor separa dos responsabilidades: la interfaz vive en el cliente y los datos en el servidor, y ninguno necesita saber cómo trabaja el otro. Eso permite cambiar la aplicación web sin tocar la API, o agregar una aplicación móvil que consuma la misma. Las otras tres son restricciones reales de REST que se ocupan de otra cosa.
<!-- justificacion:fin -->

- [x] Aprobada

### 09 · m08#10

<!-- pregunta: json_2026#10 | just:493e5f4e5513 -->

En una API REST, ¿qué verbo HTTP se usa convencionalmente para actualizaciones parciales?

- `(a)` PUT
- `(b)` UPDATE
- `(c)` PATCH  **← correcta**
- `(d)` MODIFY

<!-- justificacion:inicio -->
`PATCH` envía solo los campos que cambian; `PUT` reemplaza el recurso entero, y por eso lo que no se mande en un `PUT` se pierde. Esa es la diferencia práctica que la pregunta busca. `UPDATE` y `MODIFY` no son verbos HTTP. Conviene saber que `PATCH` **no** es idempotente por definición, mientras que `PUT` sí lo es.
<!-- justificacion:fin -->

- [x] Aprobada

### 10 · m08#12

<!-- pregunta: json_2026#12 | just:93e35ce30cec -->

¿Qué verbo HTTP se utiliza idóneamente para la creación de un nuevo recurso en la base de datos?

- `(a)` GET
- `(b)` PUT
- `(c)` POST  **← correcta**
- `(d)` ADD

<!-- justificacion:inicio -->
`POST` sobre la colección —`POST /usuarios`— es la forma convencional de crear: el cliente manda los datos y el servidor decide el identificador. La (b) merece un matiz: `PUT` también puede crear, pero solo cuando el cliente ya sabe la URL exacta del recurso, y en una API con identificadores generados por la base eso rara vez ocurre. `GET` no debe modificar nada y `ADD` no existe.
<!-- justificacion:fin -->

- [x] Aprobada

### 11 · m08#13

<!-- pregunta: json_2026#13 | just:97352382b42e -->

Según el estándar HTTP, ¿qué familia de códigos de estado indica un error provocado por el cliente?

- `(a)` 2xx (Éxito)
- `(b)` 3xx (Redirección)
- `(c)` 4xx (Error del Cliente)  **← correcta**
- `(d)` 5xx (Error del Servidor)

<!-- justificacion:inicio -->
La familia 4xx dice que el problema está en la petición: mal formada, sin credenciales, a un recurso que no existe. La 5xx dice que la petición estaba bien y el que falló fue el servidor. Distinguirlas importa porque señalan a quién le toca arreglarlo — devolver un 500 ante un dato inválido del cliente manda a buscar el error donde no está.
<!-- justificacion:fin -->

- [x] Aprobada

### 12 · m08#14

<!-- pregunta: json_2026#14 | just:f888e76efea9 -->

¿Qué código HTTP es el más preciso para retornar cuando un recurso no existe en el servidor?

- `(a)` 400 Bad Request
- `(b)` 401 Unauthorized
- `(c)` 403 Forbidden
- `(d)` 404 Not Found  **← correcta**

<!-- justificacion:inicio -->
`404 Not Found` es la respuesta exacta cuando el recurso no existe. Las otras tres son 4xx reales con otro significado: `400` es que la petición está mal formada, `401` que falta autenticarse, y `403` que estás autenticado pero no tienes permiso. Confundir `401` con `403` es el error más común de los cuatro.
<!-- justificacion:fin -->

- [x] Aprobada

### 13 · m08#15

<!-- pregunta: json_2026#15 | just:7a1eb97db592 -->

¿Qué verbo HTTP es idempotente y se usa generalmente para reemplazar un recurso completo?

- `(a)` POST
- `(b)` PATCH
- `(c)` PUT  **← correcta**
- `(d)` REPLACE

<!-- justificacion:inicio -->
`PUT` reemplaza el recurso completo, y es idempotente: repetir la misma petición deja el mismo resultado que hacerla una vez. Eso lo vuelve seguro de reintentar cuando la red falla. `POST` no lo es —dos envíos crean dos recursos— y `PATCH` tampoco por definición. `REPLACE` no es un verbo HTTP.
<!-- justificacion:fin -->

- [x] Aprobada

### 14 · m08#16

<!-- pregunta: json_2026#16 | just:7506ccbe7797 -->

En Express, ¿cómo accedes a un parámetro dinámico incrustado en la ruta (ej. /users/:id)?

- `(a)` req.query.id
- `(b)` req.params.id  **← correcta**
- `(c)` req.body.id
- `(d)` req.headers.id

<!-- justificacion:inicio -->
Los segmentos declarados con dos puntos en la ruta llegan en `req.params`: con `/users/:id`, la petición a `/users/7` deja `req.params.id` valiendo `"7"`. Ojo con eso último, que sorprende: **llega como texto**, así que compararlo con un número exige convertirlo. `req.query` es lo que va tras el `?` y `req.body` el cuerpo.
<!-- justificacion:fin -->

- [x] Aprobada

### 15 · m08#17

<!-- pregunta: json_2026#17 | just:376c71a91912 -->

Si un endpoint Express responde exitosamente a un GET, ¿cómo defines el código 200 y envías JSON?

- `(a)` res.status(200).json({ data })  **← correcta**
- `(b)` res.send(200, { data })
- `(c)` res.json(200).send({ data })
- `(d)` res.code(200).return({ data })

<!-- justificacion:inicio -->
`res.status(200).json({...})` fija el código y envía el objeto ya serializado con la cabecera `Content-Type` correcta. La (b) es la firma antigua de Express 3, que se eliminó: hoy `res.send(200, ...)` no hace lo que parece. Y conviene saber que `res.json()` por sí solo ya responde 200, así que el `status(200)` explícito es más para dejarlo escrito que por necesidad.
<!-- justificacion:fin -->

- [x] Aprobada

### 16 · m08#18

<!-- pregunta: json_2026#18 | just:c8058469739b -->

¿Qué código HTTP indica que la solicitud fue exitosa y como resultado se creó un nuevo recurso?

- `(a)` 200 OK
- `(b)` 201 Created  **← correcta**
- `(c)` 202 Accepted
- `(d)` 204 No Content

<!-- justificacion:inicio -->
`201 Created` es la respuesta correcta cuando la petición creó algo, y lo habitual es acompañarla con la cabecera `Location` apuntando al recurso nuevo. `200` diría «salió bien» sin decir que se creó nada; `202` es «lo recibí y lo procesaré después», útil en trabajos asíncronos; y `204` es «salió bien y no hay nada que devolver», típico de un borrado.
<!-- justificacion:fin -->

- [x] Aprobada

### 17 · m08#19

<!-- pregunta: json_2026#19 | just:3fa69a440bc0 -->

Si el servidor falla internamente al procesar la ruta, ¿qué código HTTP se debe devolver?

- `(a)` 400 Bad Request
- `(b)` 409 Conflict
- `(c)` 500 Internal Server Error  **← correcta**
- `(d)` 503 Service Unavailable

<!-- justificacion:inicio -->
`500 Internal Server Error` es la respuesta cuando el fallo es del servidor y no de la petición: una excepción no controlada, la base caída, un error de programación. La (d), `503`, es distinta y más precisa cuando corresponde: el servicio no está disponible **temporalmente**, por mantenimiento o sobrecarga. Un `500` nunca debe devolver la traza al cliente.
<!-- justificacion:fin -->

- [x] Aprobada

### 18 · m08#20

<!-- pregunta: json_2026#20 | just:ad103b1a23b5 -->

¿Qué objeto de Express contiene los parámetros enviados por la URL tras un "?" (ej. ?sort=asc)?

- `(a)` req.params
- `(b)` req.body
- `(c)` req.url
- `(d)` req.query  **← correcta**

<!-- justificacion:inicio -->
`req.query` trae lo que viene después del `?` ya convertido en objeto: con `?sort=asc` queda `req.query.sort` valiendo `"asc"`. Igual que los parámetros de ruta, **llegan como texto**. `req.params` es para los segmentos de la ruta, `req.body` para el cuerpo, y `req.url` es la URL cruda sin interpretar.
<!-- justificacion:fin -->

- [x] Aprobada

### 19 · m08#22

<!-- pregunta: json_2026#22 | just:3e547a867fc1 -->

Al subir un archivo usando express-fileupload, ¿en qué objeto de la petición (req) se inyecta?

- `(a)` req.body.files
- `(b)` req.files  **← correcta**
- `(c)` req.upload
- `(d)` req.attachments

<!-- justificacion:inicio -->
`express-fileupload` deja los archivos recibidos en `req.files`, indexados por el nombre del campo del formulario. No van en `req.body`, que trae los campos de texto: es una distinción que confunde al principio porque los dos llegan en la misma petición. Los otros dos nombres no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 20 · m08#23

<!-- pregunta: json_2026#23 | just:1c2d29869f7a -->

¿Qué validación inicial es crítica realizar en el servidor antes de procesar una subida?

- `(a)` Comprimir el archivo en formato ZIP.
- `(b)` Verificar si el objeto req.files está presente y no es nulo.  **← correcta**
- `(c)` Encriptar el nombre original del archivo con bcrypt.
- `(d)` Reiniciar el buffer de memoria del servidor Node.

<!-- justificacion:inicio -->
Comprobar que `req.files` exista y no sea nulo, porque si la petición no trajo ningún archivo esa propiedad **no está**, y acceder a `req.files.foto` sobre `undefined` lanza y tumba el manejador. Es la primera línea de cualquier endpoint de subida. Las otras tres describen cosas que no son validaciones de entrada.
<!-- justificacion:fin -->

- [x] Aprobada

### 21 · m08#24

<!-- pregunta: json_2026#24 | just:b0f604a16b95 -->

¿Por qué es vital validar la extensión del archivo subido en el backend de un servicio REST?

- `(a)` Para evitar la ejecución de scripts maliciosos en el servidor.  **← correcta**
- `(b)` Para acelerar la descarga del archivo en el frontend.
- `(c)` Porque express-fileupload rechaza archivos sin extensión.
- `(d)` Para mantener el orden alfabético en el disco.

<!-- justificacion:inicio -->
Porque un archivo subido con una extensión ejecutable puede terminar corriéndose en el servidor si queda en un directorio que se sirve o se interpreta. Ahora bien, conviene saber que **validar la extensión sola no basta**: la extensión la elige quien sube. Se combina con revisar el tipo de contenido, renombrar el archivo y guardarlo fuera del directorio público.
<!-- justificacion:fin -->

- [x] Aprobada

### 22 · m08#25

<!-- pregunta: json_2026#25 | just:f63ffe656b24 -->

¿Qué método provee express-fileupload sobre el archivo para trasladarlo a una carpeta destino?

- `(a)` file.move()
- `(b)` file.mv()  **← correcta**
- `(c)` file.save()
- `(d)` file.transfer()

<!-- justificacion:inicio -->
`file.mv(ruta)` mueve el archivo desde donde lo dejó el middleware hasta el destino, y avisa si falla — con callback o con promesa, según cómo se lo llame. El nombre abreviado es el que se olvida: los otros tres suenan más naturales y ninguno existe. Conviene crear el directorio destino antes, porque `mv()` no lo crea.
<!-- justificacion:fin -->

- [x] Aprobada

### 23 · m08#26

<!-- pregunta: json_2026#26 | just:acfaf82822c0 -->

¿Por qué se recomienda modificar o hashear el nombre del archivo al guardarlo en el servidor?

- `(a)` Para reducir el tamaño físico del archivo en el disco duro.
- `(b)` Para cumplir con el estándar XML de subidas binarias.
- `(c)` Para evitar sobreescrituras por archivos con el mismo nombre.  **← correcta**
- `(d)` Porque Node.js no soporta espacios en nombres de archivo.

<!-- justificacion:inicio -->
Porque dos usuarios que suban `foto.jpg` pisarían el mismo archivo, y el segundo borraría al primero sin avisar. Un nombre generado —una marca de tiempo, un identificador aleatorio— evita la colisión. Y hay una segunda razón que la pregunta no menciona y conviene saber: el nombre original viene del cliente y puede traer rutas o caracteres pensados para escapar del directorio.
<!-- justificacion:fin -->

- [x] Aprobada

### 24 · m08#27

<!-- pregunta: json_2026#27 | just:201114a92877 -->

Al procesar un upload exitoso, ¿qué debe retornar convencionalmente la API REST al cliente?

- `(a)` El archivo binario completo como stream de vuelta.
- `(b)` Un mensaje de éxito y la nueva URL/nombre del archivo.  **← correcta**
- `(c)` Un volcado de memoria con los metadatos del sistema.
- `(d)` El código fuente del middleware procesador.

<!-- justificacion:inicio -->
Se devuelve una confirmación con los datos que el cliente necesita después: el nombre final del archivo o la URL desde donde se podrá pedir. Devolver el binario de vuelta —la (a)— no tiene sentido: el cliente acaba de enviarlo. Y lo habitual es responder `201 Created`, que es la pregunta sobre códigos de estado de este mismo módulo.
<!-- justificacion:fin -->

- [x] Aprobada

### 25 · m08#28

<!-- pregunta: json_2026#28 | just:9ff9697a7d1d -->

¿Qué atributo interno del archivo provee express-fileupload para validar el peso del mismo?

- `(a)` file.size  **← correcta**
- `(b)` file.weight
- `(c)` file.bytes
- `(d)` file.length

<!-- justificacion:inicio -->
`file.size` da el tamaño en bytes, y con eso se rechaza lo que exceda el límite antes de moverlo a su sitio. Los otros tres nombres no existen. `express-fileupload` acepta además una opción `limits` para cortar la subida antes de recibirla entera, que es mejor todavía: comprobar el tamaño después ya gastó el ancho de banda.
<!-- justificacion:fin -->

- [x] Aprobada

### 26 · m08#29

<!-- pregunta: json_2026#29 | just:f866ce595524 -->

Si debes permitir solo imágenes, ¿qué propiedad del archivo revisas además de su extensión?

- `(a)` file.name
- `(b)` file.mimetype (ej. image/png)  **← correcta**
- `(c)` file.encoding
- `(d)` file.tempFilePath

<!-- justificacion:inicio -->
`file.mimetype` dice qué tipo de contenido declara el archivo —`image/png`, `image/jpeg`—, y filtrar por ahí es más fino que mirar la extensión. Con un matiz importante: **ese valor lo envía el cliente**, así que también se puede falsear. Para algo serio se comprueba además la firma real del archivo, sus primeros bytes.
<!-- justificacion:fin -->

- [x] Aprobada

### 27 · m08#30

<!-- pregunta: json_2026#30 | just:ddf41a3b40ac -->

Para borrar un archivo previamente subido al servidor, ¿qué módulo nativo de Node.js se emplea?

- `(a)` http
- `(b)` os
- `(c)` fs (fs.unlinkSync)  **← correcta**
- `(d)` path

<!-- justificacion:inicio -->
`fs.unlinkSync(ruta)` borra el archivo; su versión asíncrona es `fs.unlink()` o `fs.promises.unlink()`, preferible dentro de un servidor por lo mismo que se vio en el módulo 6 — la versión síncrona detiene el único hilo. Los otros tres módulos son nativos y hacen otra cosa: `path` arma rutas, `http` sirve y pide, y `os` informa de la máquina.
<!-- justificacion:fin -->

- [x] Aprobada

### 28 · m08#31

<!-- pregunta: json_2026#31 | just:1689f5be5a1d -->

¿Qué problema arquitectónico REST resuelve el uso de JSON Web Tokens (JWT)?

- `(a)` Reemplaza la base de datos por archivos planos seguros.
- `(b)` Mantiene la comunicación sin estado (stateless) segura.  **← correcta**
- `(c)` Evita inyecciones SQL en consultas asíncronas.
- `(d)` Permite subir archivos binarios sin límite de tamaño.

<!-- justificacion:inicio -->
El token viaja en cada petición y lleva dentro quién es el usuario, así que el servidor puede autenticarlo **sin guardar sesión**. Eso es lo que permite mantener la comunicación sin estado sin renunciar a saber quién llama, y por eso encaja con REST. Las otras tres describen problemas de los que JWT no se ocupa.
<!-- justificacion:fin -->

- [x] Aprobada

### 29 · m08#33

<!-- pregunta: json_2026#33 | just:1399cb90642f -->

En un JWT, ¿qué contiene el elemento estandarizado "iat" (Issued At) dentro del Payload?

- `(a)` La dirección IP del servidor emisor.
- `(b)` El algoritmo de encriptación utilizado.
- `(c)` La fecha y hora exacta en que el token fue emitido.  **← correcta**
- `(d)` El tiempo máximo de vida antes de caducar.

<!-- justificacion:inicio -->
`iat` guarda el instante en que se emitió el token, como número de segundos desde 1970. Sirve para saber su antigüedad y para invalidar tokens emitidos antes de cierto momento. No hay que confundirlo con `exp`, que es la (d) y marca cuándo caduca: los dos son fechas y hacen cosas distintas. El algoritmo va en el header, no en el payload.
<!-- justificacion:fin -->

- [x] Aprobada

### 30 · m08#34

<!-- pregunta: json_2026#34 | just:666117c57d6a -->

¿Qué formato de codificación se utiliza universalmente para representar el Header y Payload del JWT?

- `(a)` UTF-8 crudo
- `(b)` Base64Url  **← correcta**
- `(c)` Hexadecimal
- `(d)` Binario puro

<!-- justificacion:inicio -->
Header y payload van en Base64Url, que es Base64 con los caracteres `+` y `/` cambiados para que la cadena viaje sin problemas dentro de una URL. **Es codificación, no cifrado:** cualquiera puede decodificarla y leer el contenido, que es exactamente el motivo por el que no se guardan datos sensibles ahí dentro.
<!-- justificacion:fin -->

- [x] Aprobada

### 31 · m08#35

<!-- pregunta: json_2026#35 | just:4c5d9c14d79f -->

¿Qué paquete de NPM se utiliza canónicamente para firmar y verificar tokens en Express?

- `(a)` jwt-creator
- `(b)` express-auth
- `(c)` jsonwebtoken  **← correcta**
- `(d)` node-tokens

<!-- justificacion:inicio -->
`jsonwebtoken` es el paquete estándar: `sign()` para emitir y `verify()` para comprobar. Los otros tres nombres no existen. Conviene saber que `verify()` comprueba la firma **y** la expiración, y que lanza si algo falla — así que se usa dentro de un `try/catch` o con el middleware que hace ese trabajo.
<!-- justificacion:fin -->

- [x] Aprobada

### 32 · m08#36

<!-- pregunta: json_2026#36 | just:70650f567550 -->

¿Por qué es fundamental la "clave secreta" (secret key) guardada en el servidor al usar JWT?

- `(a)` Para encriptar la conexión completa como lo hace TLS.
- `(b)` Para firmar el token y validar que no fue alterado.  **← correcta**
- `(c)` Para ofuscar el código fuente de la aplicación Express.
- `(d)` Para generar contraseñas automáticas a los usuarios.

<!-- justificacion:inicio -->
La clave secreta es lo que permite firmar el token y, después, comprobar que nadie lo tocó: si alguien cambia un solo carácter del payload, la firma deja de coincidir y el token se rechaza. **No cifra nada** — el contenido sigue siendo legible—, solo garantiza integridad y origen. Por eso vive en el servidor y nunca en el código versionado.
<!-- justificacion:fin -->

- [x] Aprobada

### 33 · m08#37

<!-- pregunta: json_2026#37 | just:cac15b24ddde -->

¿Dónde es vulnerable almacenar un JWT en el cliente si existe riesgo de ataques XSS?

- `(a)` En un disco duro externo.
- `(b)` En memoria volátil de solo lectura.
- `(c)` En LocalStorage o SessionStorage.  **← correcta**
- `(d)` En cookies configuradas como HttpOnly.

<!-- justificacion:inicio -->
En `localStorage` o `sessionStorage`, porque cualquier script que se ejecute en la página puede leerlos: eso es exactamente lo que consigue un ataque XSS. La (d) es la alternativa más segura y por eso es un buen distractor: una cookie con `HttpOnly` no es accesible desde JavaScript, así que un XSS no puede leerla —aunque entonces hay que ocuparse de CSRF, que es otro frente.
<!-- justificacion:fin -->

- [x] Aprobada

### 34 · m08#38

<!-- pregunta: json_2026#38 | just:35d52b3d2a7b -->

¿Qué paquete middleware de Express evalúa automáticamente si el request tiene un JWT válido?

- `(a)` jwt-validator
- `(b)` express-jwt  **← correcta**
- `(c)` auth-parser
- `(d)` token-checker

<!-- justificacion:inicio -->
`express-jwt` es el middleware que extrae el token de la petición, lo verifica y deja los datos del usuario disponibles para el manejador, rechazando por su cuenta lo que no sea válido. Los otros tres nombres no existen. Se combina con `jsonwebtoken`, que es quien firma: uno emite y el otro comprueba en cada petición protegida.
<!-- justificacion:fin -->

- [x] Aprobada

### 35 · m08#39

<!-- pregunta: json_2026#39 | just:d980728d0d03 -->

Al invocar un endpoint protegido, ¿dónde se envía convencionalmente el JWT en la petición HTTP?

- `(a)` En el body del JSON como "token_key".
- `(b)` Como query param obligatorio en la URL.
- `(c)` En el header "Authorization" usando el esquema Bearer.  **← correcta**
- `(d)` En una cookie abierta sin cifrar.

<!-- justificacion:inicio -->
En la cabecera `Authorization`, con el esquema `Bearer`: `Authorization: Bearer <token>`. Es lo que esperan los middlewares y lo que la especificación reserva para credenciales. La (b) es especialmente mala idea: las URL quedan en los registros del servidor, en el historial del navegador y en la cabecera `Referer`, así que el token se filtraría en tres sitios a la vez.
<!-- justificacion:fin -->

- [x] Aprobada

### 36 · m08#40

<!-- pregunta: json_2026#40 | just:396bcd2891f0 -->

¿Qué riesgo de seguridad ocurre si se colocan contraseñas legibles en el Payload de un JWT?

- `(a)` El token será rechazado por exceder el tamaño límite de HTTP.
- `(b)` El Payload se codifica en Base64, permitiendo que cualquiera lo lea.  **← correcta**
- `(c)` El servidor Node colapsará al intentar hashearlo doblemente.
- `(d)` El paquete jsonwebtoken lanza un error interno al firmar.

<!-- justificacion:inicio -->
Porque el payload va **codificado, no cifrado**: cualquiera que tenga el token puede decodificar esa parte y leerla, sin necesidad de la clave secreta. La firma protege contra que lo modifiquen, no contra que lo lean. Por eso en el payload van identificadores y roles, nunca contraseñas ni datos personales sensibles.
<!-- justificacion:fin -->

- [x] Aprobada

### 37 · M8-1

<!-- pregunta: js_2026#1 | just:6ff83abe3e77 -->

Según las buenas prácticas REST, ¿cómo debe estructurarse el endpoint para obtener un recurso específico?

- `(a)` GET /obtenerUsuario?id=123
- `(b)` POST /usuarios/obtener/123
- `(c)` GET /usuarios/123  **← correcta**
- `(d)` GET /usuarios/ver/123

<!-- justificacion:inicio -->
`GET /usuarios/123`: el verbo dice la acción y la ruta identifica el recurso dentro de su colección. La (a) mete la acción en el nombre y pasa el identificador como filtro, que es tratar un recurso concreto como si fuera una búsqueda; la (b) usa `POST` para leer, rompiendo la semántica del verbo; y la (d) repite el verbo en la ruta.
<!-- justificacion:fin -->

- [x] Aprobada

### 38 · M8-2

<!-- pregunta: js_2026#2 | just:a5e0d35ad55e -->

¿Qué concepto REST describe la inclusión de hipervínculos en la respuesta para navegar por la API?

- `(a)` Stateless Payload
- `(b)` HATEOAS  **← correcta**
- `(c)` JWT Navigation
- `(d)` RESTful Routing

<!-- justificacion:inicio -->
HATEOAS —«el hipertexto como motor del estado de la aplicación»— es la idea de que la respuesta incluya los enlaces a lo que se puede hacer a continuación, de modo que el cliente navegue la API sin tener las URL escritas dentro. Es la restricción de REST que menos se implementa en la práctica, y por eso se pregunta: se reconoce más por el nombre que por haberla usado.
<!-- justificacion:fin -->

- [x] Aprobada

### 39 · M8-3

<!-- pregunta: js_2026#3 | just:7e66da28f613 -->

En Express, ¿qué middleware estándar se usa comúnmente para parsear el cuerpo JSON de una petición POST?

- `(a)` express.json()  **← correcta**
- `(b)` express.urlencoded()
- `(c)` express.text()
- `(d)` express.raw()

<!-- justificacion:inicio -->
`express.json()` interpreta el cuerpo cuando llega como JSON y lo deja en `req.body`. Sin ese middleware, `req.body` queda `undefined`, y ése es el desconcierto clásico de quien empieza. Los otros tres son reales y atienden otros formatos: `urlencoded()` los formularios tradicionales, `text()` texto plano y `raw()` datos binarios.
<!-- justificacion:fin -->

- [x] Aprobada

### 40 · M8-4

<!-- pregunta: js_2026#4 | just:9d78e829239b -->

¿Qué paquete en Node/Express se menciona comúnmente para manejar la subida de archivos (upload)?

- `(a)` express-session
- `(b)` express-fileupload  **← correcta**
- `(c)` express-validator
- `(d)` multer-express

<!-- justificacion:inicio -->
`express-fileupload` es el que aparece en el material del curso: se monta como middleware y deja lo recibido en `req.files`. La (d) mezcla dos nombres — `multer` existe y es la alternativa más usada en proyectos reales, pero se llama así a secas. `express-session` maneja sesiones y `express-validator` valida entradas.
<!-- justificacion:fin -->

- [x] Aprobada

### 41 · M8-5

<!-- pregunta: js_2026#5 | just:0059d009543d -->

Al procesar un archivo con express-fileupload, ¿cómo se mueve al directorio de destino del servidor?

- `(a)` Editando la propiedad file.savePath local.
- `(b)` Copiando la caché nativa al File System.
- `(c)` Usando el método .mv() con la ruta destino.  **← correcta**
- `(d)` Invocando path.resolve() directo al JSON.

<!-- justificacion:inicio -->
Con `.mv(rutaDestino)`, que mueve el archivo desde su ubicación temporal al destino y avisa si algo falla. Las otras tres describen mecanismos que no existen. Es el mismo método que pregunta `m08#25` con otras palabras, y conviene recordar que el directorio destino tiene que existir de antes.
<!-- justificacion:fin -->

- [x] Aprobada

### 42 · M8-6

<!-- pregunta: js_2026#6 | just:9a79c5ed5623 -->

¿Cuáles son las tres partes estructurales que componen un JSON Web Token (JWT) estándar?

- `(a)` Header, Payload y Signature.  **← correcta**
- `(b)` Token, Secret y Expiration.
- `(c)` User, Roles y Permissions.
- `(d)` Header, Body y Footer.

<!-- justificacion:inicio -->
Un JWT son tres partes separadas por puntos: **header**, con el algoritmo y el tipo; **payload**, con los datos; y **signature**, la firma que valida a las dos anteriores. La (d) suena razonable y es de otra cosa — «header, body y footer» describe un documento, no un token. Las tres partes se ven a simple vista: basta contar los dos puntos.
<!-- justificacion:fin -->

- [x] Aprobada

### 43 · M8-7

<!-- pregunta: js_2026#7 | just:9ab55948fe76 -->

¿Qué elemento del JWT se utiliza para verificar que el token no ha sido alterado en el cliente?

- `(a)` El campo estandarizado IAT del Payload.
- `(b)` La codificación Base64 en todo el string.
- `(c)` La firma criptográfica (Signature).  **← correcta**
- `(d)` El algoritmo de control del Header.

<!-- justificacion:inicio -->
La firma. Se calcula sobre el header y el payload usando la clave secreta, así que cambiar cualquier cosa del token invalida la comprobación. La (b) es el distractor que separa: la codificación Base64 **no protege nada**, es solo una forma de transportar el texto, y confundirla con seguridad es el malentendido más extendido sobre JWT.
<!-- justificacion:fin -->

- [x] Aprobada

### 44 · M8-8

<!-- pregunta: js_2026#8 | just:17d95b629c8e -->

¿Dónde es recomendable enviar el JWT validado en una petición HTTP hacia una API REST?

- `(a)` En la URL como query string principal.
- `(b)` En el body de la petición HTTP POST.
- `(c)` En una Cookie temporal sin atributos de red.
- `(d)` En el Header de autorización usando Bearer.  **← correcta**

<!-- justificacion:inicio -->
En la cabecera `Authorization`, con el esquema `Bearer`. Es donde lo buscan los middlewares y donde la especificación pone las credenciales. Las otras tres lo exponen: en la URL queda registrado en los logs y el historial, en el cuerpo obliga a que toda petición sea `POST`, y una cookie sin atributos de seguridad queda al alcance de un XSS.
<!-- justificacion:fin -->

- [x] Aprobada

### 45 · M8-9

<!-- pregunta: js_2026#9 | just:84594e230bd8 -->

En seguridad JWT, ¿qué ocurre cuando el tiempo de vida (exp) definido en el token caduca?

- `(a)` El cliente renueva el token automáticamente sin avisar.
- `(b)` La verificación falla y la API rechaza la petición HTTP.  **← correcta**
- `(c)` El servidor extiende el tiempo de expiración del token.
- `(d)` El navegador borra la variable JWT del código fuente.

<!-- justificacion:inicio -->
La verificación falla y la API rechaza la petición, normalmente con un `401`. Un token caducado no se renueva solo: el cliente tiene que pedir uno nuevo, autenticándose otra vez o usando un token de refresco si la API lo ofrece. Las otras tres describen comportamientos automáticos que no existen — y no podrían existir, porque el servidor no guarda estado del token.
<!-- justificacion:fin -->

- [x] Aprobada

---

## Lo que este documento no puede decidir

- **Si las justificaciones son ciertas.** Que existan se comprueba con un
  programa; que sean correctas no. Por eso las lees tú.
- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería
  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.
  Si la quieres, es una pasada editorial aparte.

