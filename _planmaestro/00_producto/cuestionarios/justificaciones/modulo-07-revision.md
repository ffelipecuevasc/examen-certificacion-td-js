# Justificaciones del módulo 7 · para revisar

**Lote:** 48 preguntas · **Redactadas:** 2026-09-10 por Claude Code

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

### 01 · m07#1

<!-- pregunta: json_2026#1 | just:c88d75f0e993 -->

¿Qué ventaja principal ofrece implementar un "pool" de conexiones en PostgreSQL con Node.js?

- `(a)` Encripta automáticamente todos los datos en tránsito hacia la DB.
- `(b)` Reutiliza conexiones activas evitando el costo de crear nuevas.  **← correcta**
- `(c)` Ejecuta consultas SQL en un solo hilo bloqueando las demás.
- `(d)` Duplica los datos en memoria RAM para lecturas más veloces.

<!-- justificacion:inicio -->
Abrir una conexión a PostgreSQL es caro: hay autenticación, negociación y reserva de recursos del lado del servidor. Un pool mantiene un puñado abiertas y las va prestando, así que cada consulta se ahorra ese costo. Las otras tres prometen cosas que el pool no hace: no cifra —de eso se encarga TLS—, no bloquea nada, y no duplica datos en memoria.
<!-- justificacion:fin -->

- [x] Aprobada

### 02 · m07#2

<!-- pregunta: json_2026#2 | just:4bdf0dc356be -->

Al usar el paquete `pg`, ¿qué clase gestiona múltiples clientes conectados concurrentemente?

- `(a)` ClientManager
- `(b)` PgConnection
- `(c)` Pool  **← correcta**
- `(d)` ConnectionCluster

<!-- justificacion:inicio -->
`Pool` es la clase de `pg` que administra el conjunto de conexiones y las reparte entre quienes las piden. Su hermana es `Client`, que representa **una** conexión y se usa cuando de verdad hace falta una sola, como en un guion suelto. Los otros tres nombres no existen. En un servidor web casi siempre se quiere `Pool`, y creado una vez al arrancar, no por petición.
<!-- justificacion:fin -->

- [x] Aprobada

### 03 · m07#3

<!-- pregunta: json_2026#3 | just:267995c5a7f0 -->

¿Qué sucede si el "pool" de PostgreSQL alcanza su límite máximo de conexiones concurrentes?

- `(a)` Detiene el servidor Node arrojando un error fatal.
- `(b)` Elimina las conexiones más antiguas sin previo aviso.
- `(c)` Pone en cola las nuevas peticiones hasta que una se libere.  **← correcta**
- `(d)` Escala dinámicamente agregando nuevos procesos en el servidor.

<!-- justificacion:inicio -->
Cuando todas las conexiones están ocupadas, las peticiones nuevas **esperan en cola** hasta que alguna se libere. No falla ni descarta: espera. Eso tiene una consecuencia práctica que conviene entender — si alguien no devuelve un cliente, la cola crece y la aplicación se va poniendo lenta antes de dar ningún error, que es el síntoma más difícil de diagnosticar.
<!-- justificacion:fin -->

- [x] Aprobada

### 04 · m07#4

<!-- pregunta: json_2026#4 | just:36d0714a4323 -->

En el paquete `pg`, ¿qué método libera explícitamente un cliente de vuelta al pool tras su uso?

- `(a)` client.disconnect()
- `(b)` client.release()  **← correcta**
- `(c)` client.close()
- `(d)` pool.return(client)

<!-- justificacion:inicio -->
`client.release()` devuelve el cliente al pool para que otro lo use. No cierra la conexión: la deja disponible, que es justamente el sentido del pool. La (c), `client.close()`, no existe en esa forma, y `disconnect()` tampoco. Lo habitual es llamarlo en un bloque `finally`, para que se ejecute tanto si la consulta salió bien como si lanzó.
<!-- justificacion:fin -->

- [x] Aprobada

### 05 · m07#5

<!-- pregunta: json_2026#5 | just:94f9e5c076eb -->

¿Cuál es el riesgo de no liberar un cliente devuelto por `pool.connect()` tras usarlo?

- `(a)` La base de datos elimina el registro recién insertado.
- `(b)` Agotamiento del pool, provocando bloqueo en nuevas peticiones.  **← correcta**
- `(c)` Se genera una brecha de seguridad exponiendo las credenciales.
- `(d)` El servidor Node se reinicia de manera automática e iterativa.

<!-- justificacion:inicio -->
El cliente no devuelto queda ocupado para siempre, y repetido unas cuantas veces agota el pool: las peticiones nuevas se quedan esperando en una cola que ya no avanza. La aplicación no se cae — **se cuelga**, que es peor de diagnosticar porque no hay error que leer. Por eso el `release()` va en un `finally` y no al final del camino feliz.
<!-- justificacion:fin -->

- [x] Aprobada

### 06 · m07#6

<!-- pregunta: json_2026#6 | just:6ed9642fa045 -->

Al configurar un Pool, ¿qué parámetro define el tiempo máximo de inactividad de una conexión?

- `(a)` maxIdleTime
- `(b)` idleTimeoutMillis  **← correcta**
- `(c)` connectionTimeout
- `(d)` keepAliveLimit

<!-- justificacion:inicio -->
`idleTimeoutMillis` dice cuánto puede estar una conexión sin usarse antes de que el pool la cierre, para no mantener abiertas conexiones que nadie ocupa. Los otros tres nombres no existen en `pg`. Se suele configurar junto a `max` —cuántas conexiones como mucho— y `connectionTimeoutMillis`, que es cuánto espera quien pide una antes de rendirse.
<!-- justificacion:fin -->

- [x] Aprobada

### 07 · m07#7

<!-- pregunta: json_2026#7 | just:6aeeef4344a5 -->

¿Qué técnica nativa en `pg` previene eficazmente ataques de inyección SQL (SQL Injection)?

- `(a)` Concatenación estricta de strings validada con Regex.
- `(b)` Configuración del firewall en el puerto 5432.
- `(c)` Uso de consultas parametrizadas (Prepared Statements).  **← correcta**
- `(d)` Bloqueo de direcciones IP maliciosas desde el cliente.

<!-- justificacion:inicio -->
Las consultas parametrizadas mandan la sentencia y los valores **por separado**, así que el motor nunca interpreta el dato como parte del SQL. Eso corta la inyección de raíz, y no por filtrar lo que llega sino porque el valor jamás llega a ser código. Las otras tres son medidas de otra capa o directamente falsas: validar con expresiones regulares es una carrera que se pierde.
<!-- justificacion:fin -->

- [x] Aprobada

### 08 · m07#8

<!-- pregunta: json_2026#8 | just:f6edc0abc03a -->

En una consulta parametrizada con `pg`, ¿cómo se referencian los valores dinámicos en el texto?

- `(a)` Usando signos de interrogación (?, ?, ?).
- `(b)` Empleando interpolación directa (${var}).
- `(c)` Mediante marcadores posicionales indexados ($1, $2, $3).  **← correcta**
- `(d)` Agregando el prefijo de dos puntos (:id, :name).

<!-- justificacion:inicio -->
PostgreSQL usa marcadores posicionales numerados: `SELECT * FROM alumno WHERE id = $1`. La (a) describe la convención de MySQL y SQLite, y la (d) la de Oracle y algunos ORM — son reales pero de otros motores, y por eso son buenos distractores. La (b) es justamente lo que **no** hay que hacer: interpolar es concatenar con otro nombre.
<!-- justificacion:fin -->

- [x] Aprobada

### 09 · m07#9

<!-- pregunta: json_2026#9 | just:ed79eafb6351 -->

¿Qué objeto JavaScript se debe pasar como argumento para ejecutar una consulta parametrizada?

- `(a)` Un arreglo conteniendo los valores en orden exacto.  **← correcta**
- `(b)` Un string codificado en formato base64 nativo.
- `(c)` Un buffer binario de memoria compartida estricta.
- `(d)` Un objeto de tipo Map mapeando cada índice con su llave.

<!-- justificacion:inicio -->
Los valores van en un arreglo, en el mismo orden que los marcadores: `client.query(texto, [id, nombre])`, donde `$1` toma el primer elemento y `$2` el segundo. Por eso importa el orden y no el nombre. Si la cantidad no coincide con los marcadores, PostgreSQL rechaza la consulta antes de ejecutarla, que es la pregunta del `DELETE` sin parámetro.
<!-- justificacion:fin -->

- [x] Aprobada

### 10 · m07#10

<!-- pregunta: json_2026#10 | just:31516b675841 -->

¿Cuál es el propósito principal de usar cursores al consultar la base de datos PostgreSQL?

- `(a)` Encriptar el flujo de datos entre el servidor y el cliente.
- `(b)` Procesar grandes volúmenes de datos por lotes sin saturar la RAM.  **← correcta**
- `(c)` Modificar registros múltiples en una única transacción atómica.
- `(d)` Transformar resultados a formato JSON nativo directamente.

<!-- justificacion:inicio -->
Un cursor permite ir trayendo el resultado **por lotes** en vez de cargarlo entero en memoria. Con una tabla de millones de filas, `client.query()` intentaría materializar todo y el proceso se quedaría sin memoria. Las otras tres describen cosas que el cursor no hace: no cifra, no agrupa en una transacción y no convierte a JSON.
<!-- justificacion:fin -->

- [x] Aprobada

### 11 · m07#11

<!-- pregunta: json_2026#11 | just:ae89a0430f8b -->

Usando el paquete `pg-cursor`, ¿qué método extrae un bloque específico de filas del cursor?

- `(a)` cursor.read(cantidad, callback)  **← correcta**
- `(b)` cursor.fetch(cantidad)
- `(c)` cursor.getNext(lote)
- `(d)` cursor.pull(cantidad, callback)

<!-- justificacion:inicio -->
`cursor.read(cantidad, callback)` pide el siguiente bloque de filas y las entrega al callback; cuando ya no quedan, devuelve un arreglo vacío, y ésa es la señal de que se terminó. Los otros tres nombres no existen. El patrón habitual es leer en bucle hasta ese arreglo vacío, procesando cada lote y soltándolo antes de pedir el siguiente.
<!-- justificacion:fin -->

- [x] Aprobada

### 12 · m07#12

<!-- pregunta: json_2026#12 | just:2bc2138eeaf6 -->

¿Qué propiedad del objeto resultado de `query()` contiene las filas retornadas por PostgreSQL?

- `(a)` result.data
- `(b)` result.records
- `(c)` result.rows  **← correcta**
- `(d)` result.dataset

<!-- justificacion:inicio -->
`result.rows` es el arreglo con las filas devueltas, cada una como un objeto cuyas claves son los nombres de las columnas. Los otros tres nombres no existen en `pg`. Junto a él viajan `result.rowCount` —cuántas filas— y `result.fields`, con la descripción de las columnas. Con un `SELECT` que no encuentra nada, `rows` es un arreglo **vacío**, no `null`.
<!-- justificacion:fin -->

- [x] Aprobada

### 13 · m07#13

<!-- pregunta: json_2026#13 | just:9192e6452720 -->

Si usas `async/await` para una consulta SQL, ¿cómo manejas correctamente los fallos del motor?

- `(a)` Pasando un booleano `false` como tercer parámetro.
- `(b)` Envolviendo la llamada en un bloque try/catch.  **← correcta**
- `(c)` Usando el evento `.on('fail')` encadenado a la promesa.
- `(d)` Validando si el objeto de respuesta es nulo al final.

<!-- justificacion:inicio -->
Con `async/await`, una consulta que falla lanza como cualquier excepción, así que se atrapa con `try/catch`. Es lo mismo que se vio en el módulo anterior y aquí se vuelve crítico: sin capturar, el error se lleva por delante el `release()` del cliente y la transacción abierta, si la hay. Por eso el patrón completo lleva `try`, `catch` con `ROLLBACK` y `finally` con `release()`.
<!-- justificacion:fin -->

- [x] Aprobada

### 14 · m07#14

<!-- pregunta: json_2026#14 | just:19b492531a52 -->

En mitigación de inyección SQL, ¿por qué es inseguro armar sentencias concatenando variables?

- `(a)` Porque el motor PostgreSQL rechaza strings mayores a 255 bytes.
- `(b)` Porque bloquea los hilos del pool al evaluar sintaxis compleja.
- `(c)` Porque rompe la conexión al transformar datos a binario.
- `(d)` Porque permite introducir e inyectar código SQL malicioso.  **← correcta**

<!-- justificacion:inicio -->
Porque el valor que llega del usuario pasa a formar parte del texto de la sentencia, y si contiene SQL, ese SQL se ejecuta. Con eso se pueden leer tablas ajenas, borrar datos o saltarse una autenticación. Las otras tres inventan límites técnicos que no existen. La solución no es escapar comillas a mano: es no concatenar, y usar parámetros.
<!-- justificacion:fin -->

- [x] Aprobada

### 15 · m07#15

<!-- pregunta: json_2026#15 | just:7ebf975e1d99 -->

Al realizar un INSERT con `pg`, ¿qué cláusula SQL adicional devuelve el registro recién creado?

- `(a)` WITH NEW DATA
- `(b)` RETURNING *  **← correcta**
- `(c)` OUTPUT INSERTED
- `(d)` YIELD ALL

<!-- justificacion:inicio -->
`RETURNING *` hace que el `INSERT` devuelva la fila tal como quedó, incluidos los valores que puso la base —el `id` de la secuencia, las columnas con `DEFAULT`, la marca de tiempo—. Se puede pedir todo con `*` o solo algunas columnas: `RETURNING id`. Las otras tres son de otros motores o no existen: `OUTPUT INSERTED` es de SQL Server.
<!-- justificacion:fin -->

- [x] Aprobada

### 16 · m07#16

<!-- pregunta: json_2026#16 | just:f4fba53d75d7 -->

¿Qué propiedad del resultado de una consulta indica cuántos registros fueron alterados por DML?

- `(a)` result.affectedRows
- `(b)` result.rowCount  **← correcta**
- `(c)` result.modified
- `(d)` result.changes

<!-- justificacion:inicio -->
`result.rowCount` dice cuántas filas afectó la sentencia, y es la forma de saber si un `UPDATE` o un `DELETE` de verdad tocó algo: un `rowCount` de cero significa que la condición no encontró nada, que no es un error pero casi siempre es una sorpresa. Los otros tres nombres pertenecen a otras bibliotecas o no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 17 · m07#17

<!-- pregunta: json_2026#17 | just:6cd626bde1c7 -->

Al actualizar datos con UPDATE, ¿por qué es imperativo capturar y procesar errores en Node?

- `(a)` Para evitar bloqueos permanentes de tablas por fallos silenciados.  **← correcta**
- `(b)` Para compilar nuevamente la consulta en el motor de Chrome.
- `(c)` Para reiniciar el paquete pg en caso de sintaxis incorrecta.
- `(d)` Para impedir que las claves primarias cambien su valor nativo.

<!-- justificacion:inicio -->
Un error que nadie atiende deja las cosas a medio camino: si la sentencia iba dentro de una transacción, ésa queda abierta, y una transacción abierta **mantiene sus bloqueos** hasta que alguien la cierre. Sumado a un cliente que tampoco se devuelve al pool, el resultado es una tabla bloqueada para los demás sin ningún error a la vista. Las otras tres describen mecanismos que no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 18 · m07#18

<!-- pregunta: json_2026#18 | just:5176fc4f2154 -->

Si envías un DELETE parametrizado sin valor en el parámetro ($1), ¿qué ocurre?

- `(a)` Se eliminan todos los registros de la tabla inmediatamente.
- `(b)` Falla por parámetro faltante y rechaza la ejecución.  **← correcta**
- `(c)` La tabla se bloquea hasta reiniciar el pool de conexiones.
- `(d)` El motor asume el valor nulo e ignora la sentencia DELETE.

<!-- justificacion:inicio -->
PostgreSQL rechaza la consulta antes de ejecutarla: el número de valores tiene que coincidir con el de marcadores, y si falta uno responde que se le entregaron menos parámetros de los que la sentencia requiere. **No asume nada ni ejecuta a medias**, y eso es una protección real — la (a) describe la catástrofe que ocurriría si el motor decidiera ignorar el filtro.
<!-- justificacion:fin -->

- [x] Aprobada

### 19 · m07#19

<!-- pregunta: json_2026#19 | just:ad46066f10e7 -->

¿Cuál es el riesgo de ejecutar una instrucción UPDATE o DELETE sin una cláusula WHERE?

- `(a)` Crea duplicados exactos de cada registro de la tabla afectada.
- `(b)` Alteración o eliminación accidental de todos los registros.  **← correcta**
- `(c)` Falla de sintaxis inmediata que detiene la base de datos.
- `(d)` Generación de un error de memoria por límite de cursores.

<!-- justificacion:inicio -->
Sin `WHERE`, la sentencia se aplica a **todas** las filas de la tabla: un `UPDATE` las cambia todas y un `DELETE` las borra todas. No hay error ni aviso, porque es una sentencia perfectamente válida. La costumbre que salva es escribirla primero como `SELECT` con el mismo `WHERE`, mirar cuántas filas devuelve, y recién entonces cambiar el verbo.
<!-- justificacion:fin -->

- [x] Aprobada

### 20 · m07#20

<!-- pregunta: json_2026#20 | just:40c28bcb4a2d -->

Al usar transacciones, si un INSERT falla en medio del proceso, ¿qué se debe hacer en el catch?

- `(a)` Realizar un COMMIT parcial.
- `(b)` Ignorar el error y reintentar.
- `(c)` Ejecutar la sentencia ROLLBACK.  **← correcta**
- `(d)` Cerrar la base de datos completa.

<!-- justificacion:inicio -->
Ejecutar `ROLLBACK`, que deshace todo lo hecho desde el `BEGIN` y deja la base como estaba. Es la razón de ser de la transacción: que un fallo a mitad no deje la mitad aplicada. La (a) no existe como operación —no hay confirmaciones parciales— y las otras dos empeoran las cosas. Después del `ROLLBACK` viene el `release()` del cliente, en el `finally`.
<!-- justificacion:fin -->

- [x] Aprobada

### 21 · m07#21

<!-- pregunta: json_2026#21 | just:6714fde343db -->

¿Qué comando SQL inicia explícitamente un bloque de control transaccional en PostgreSQL?

- `(a)` SET TRANSACTION
- `(b)` BEGIN  **← correcta**
- `(c)` INIT
- `(d)` OPEN

<!-- justificacion:inicio -->
`BEGIN` abre el bloque transaccional en PostgreSQL, y desde ahí nada es definitivo hasta el `COMMIT`. La (a), `SET TRANSACTION`, existe de verdad y por eso es el distractor que separa: **no abre nada**, sino que fija las características —nivel de aislamiento, solo lectura— de la transacción en curso. `INIT` y `OPEN` no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 22 · m07#23

<!-- pregunta: json_2026#23 | just:bbde97dba145 -->

En Node, ¿por qué debes usar el mismo cliente del pool durante toda la transacción?

- `(a)` Para no reventar la pila de memoria del Event Loop.
- `(b)` Porque BEGIN, COMMIT y ROLLBACK dependen de la sesión activa.  **← correcta**
- `(c)` Porque los parámetros solo persisten en clientes asíncronos.
- `(d)` Para mantener el cursor de lectura en la primera fila.

<!-- justificacion:inicio -->
Porque una transacción vive en **la sesión** de una conexión concreta: el `BEGIN` la abre en ese cliente, y un `COMMIT` enviado por otro cliente del pool no tiene nada que confirmar. Por eso una transacción se hace con `pool.connect()` para tomar un cliente y usarlo de principio a fin, en vez de con `pool.query()`, que puede darte una conexión distinta cada vez.
<!-- justificacion:fin -->

- [x] Aprobada

### 23 · m07#24

<!-- pregunta: json_2026#24 | just:c9a148fd713f -->

¿Qué comando confirma y persiste de forma definitiva los cambios de una transacción activa?

- `(a)` SAVEPOINT
- `(b)` RELEASE SAVEPOINT
- `(c)` FLUSH
- `(d)` COMMIT  **← correcta**

<!-- justificacion:inicio -->
`COMMIT` cierra la transacción y hace permanentes sus cambios; hasta ese momento un `ROLLBACK` los desharía. Las otras tres existen y ninguna confirma nada, y la (b) es la que separa: `RELEASE SAVEPOINT` **elimina un punto de guardado y deja la transacción abierta**, así que quien crea que «liberar» un savepoint finaliza algo se lleva la pregunta mal. `SAVEPOINT` hace lo contrario —marca el punto— y `FLUSH` no es SQL. Conviene recordar que un `RELEASE SAVEPOINT` tampoco deshace lo hecho después del punto: eso sería `ROLLBACK TO SAVEPOINT`.
<!-- justificacion:fin -->

- [x] Aprobada

### 24 · m07#25

<!-- pregunta: json_2026#25 | just:ddb0207ac459 -->

¿Qué operación anula todos los cambios realizados desde el comando BEGIN al detectar un error?

- `(a)` TRUNCATE
- `(b)` ROLLBACK  **← correcta**
- `(c)` UNDO ALL
- `(d)` REVERT

<!-- justificacion:inicio -->
`ROLLBACK` deshace todo lo hecho desde el `BEGIN` y devuelve la base al estado anterior, sin importar cuántas sentencias hubiera en medio. `TRUNCATE` es lo contrario de deshacer: vacía una tabla. `UNDO ALL` y `REVERT` no existen en SQL. Si hay `SAVEPOINT` declarados, se puede volver a uno de ellos en vez de deshacer la transacción entera.
<!-- justificacion:fin -->

- [x] Aprobada

### 25 · m07#26

<!-- pregunta: json_2026#26 | just:a980a33d6558 -->

Al culminar un COMMIT o ROLLBACK usando un cliente del pool, ¿qué acción final es obligatoria?

- `(a)` Destruir el proceso principal de Node con process.exit().
- `(b)` Liberar el cliente usando el método release() correspondiente.  **← correcta**
- `(c)` Reiniciar el servidor de PostgreSQL para liberar los bloqueos.
- `(d)` Limpiar manualmente la caché de DNS del servidor.

<!-- justificacion:inicio -->
Liberar el cliente con `release()`. Confirmar o deshacer cierra la **transacción**, pero el cliente sigue prestado hasta que se devuelva, y un cliente que no vuelve es una conexión menos para todos los demás. Por eso el `release()` va en el `finally`: se ejecuta tanto tras el `COMMIT` como tras el `ROLLBACK`, y también si algo lanzó por el camino.
<!-- justificacion:fin -->

- [x] Aprobada

### 26 · m07#27

<!-- pregunta: json_2026#27 | just:26cffcb03ab6 -->

¿Qué es el modo "autocommit" en los motores de base de datos relacionales?

- `(a)` Confirma cada sentencia SQL individual automáticamente si es exitosa.  **← correcta**
- `(b)` Revierte automáticamente si detecta cualquier uso intensivo de CPU.
- `(c)` Bloquea tablas enteras hasta que un administrador confirme.
- `(d)` Genera un volcado de memoria antes de cada inserción riesgosa.

<!-- justificacion:inicio -->
Con autocommit, cada sentencia que termina bien se confirma sola, como si llevara su propio `COMMIT` detrás. La consecuencia es la que importa: **no queda nada que deshacer**, porque no hay transacción abierta. Por eso, para agrupar varias sentencias en una unidad, hay que abrirla explícitamente con `BEGIN`. Las otras tres describen comportamientos que ningún motor tiene.
<!-- justificacion:fin -->

- [x] Aprobada

### 27 · m07#28

<!-- pregunta: json_2026#28 | just:87172d91e022 -->

¿Qué problema principal busca resolver un mapeador objeto-relacional (ORM) como Sequelize?

- `(a)` La traducción de interfaces gráficas a comandos binarios.
- `(b)` Eliminar la necesidad de usar bases de datos físicas.
- `(c)` Vincular estructuras lógicas de la DB con objetos en el código.  **← correcta**
- `(d)` Acelerar el ancho de banda del servidor consumiendo menos red.

<!-- justificacion:inicio -->
Un ORM traduce entre dos mundos que no encajan solos: las tablas y filas de la base, y los objetos y clases del código. Con él se consultan y guardan datos escribiendo JavaScript en vez de SQL. Lo que **no** hace es eliminar la base ni ahorrar red — y conviene saber que el SQL sigue existiendo debajo, así que entenderlo sigue siendo necesario cuando algo va lento.
<!-- justificacion:fin -->

- [x] Aprobada

### 28 · m07#29

<!-- pregunta: json_2026#29 | just:d3a9577c8e5f -->

En la arquitectura de Sequelize, ¿qué representa el concepto lógico de "Modelo"?

- `(a)` Un controlador de rutas API HTTP.
- `(b)` Una clase JavaScript que mapea y abstrae una tabla de la DB.  **← correcta**
- `(c)` Un middleware para procesar cuerpos JSON.
- `(d)` Una vista renderizada en el motor Handlebars.

<!-- justificacion:inicio -->
Un modelo es la clase que representa una tabla: define sus columnas y sus tipos, y ofrece los métodos para consultarla y modificarla. Es la pieza central de Sequelize — todo lo demás cuelga de ahí. Las otras tres pertenecen a otras capas de la aplicación: rutas, middlewares y vistas, que no tienen nada que ver con el mapeo.
<!-- justificacion:fin -->

- [x] Aprobada

### 29 · m07#30

<!-- pregunta: json_2026#30 | just:938f0c5f7c43 -->

En Sequelize, ¿qué método de modelo se utiliza convencionalmente para insertar un nuevo registro?

- `(a)` Model.insert()
- `(b)` Model.save()
- `(c)` Model.create()  **← correcta**
- `(d)` Model.buildRecord()

<!-- justificacion:inicio -->
`Model.create({...})` construye la instancia y la guarda en un solo paso, devolviendo el registro ya creado con el `id` que asignó la base. La (b), `Model.save()`, no existe como método de la clase — `save()` es de la **instancia**, y se usa junto a `build()` cuando se quiere crear en memoria primero y guardar después. Los otros dos no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 30 · m07#31

<!-- pregunta: json_2026#31 | just:60f253b82057 -->

Para recuperar múltiples registros desde la base de datos con Sequelize, ¿qué método se utiliza?

- `(a)` Model.selectAll()
- `(b)` Model.findAll()  **← correcta**
- `(c)` Model.fetchMany()
- `(d)` Model.getRecords()

<!-- justificacion:inicio -->
`Model.findAll()` devuelve un arreglo con todos los registros que cumplan las condiciones que se le pasen, y sin condiciones devuelve la tabla entera. Los otros tres nombres no existen. Sus hermanos habituales son `findOne()`, que devuelve uno solo o `null`, y `findByPk()`, que busca por clave primaria — y conviene distinguirlos porque devuelven cosas distintas.
<!-- justificacion:fin -->

- [x] Aprobada

### 31 · m07#32

<!-- pregunta: json_2026#32 | just:ea02e7f169a0 -->

¿Qué método en Sequelize se emplea para realizar la actualización (UPDATE) de registros?

- `(a)` Model.modify()
- `(b)` Model.put()
- `(c)` Model.update()  **← correcta**
- `(d)` Model.change()

<!-- justificacion:inicio -->
`Model.update({campos}, {where})` actualiza los registros que cumplan la condición. Los otros tres nombres no existen. Ojo con el detalle que sorprende: lleva **dos** objetos, el de los valores nuevos y el de las condiciones, y olvidar el segundo actualiza toda la tabla — es el mismo peligro del `UPDATE` sin `WHERE`, con otra sintaxis.
<!-- justificacion:fin -->

- [x] Aprobada

### 32 · m07#33

<!-- pregunta: json_2026#33 | just:adaa9c690f4f -->

¿Qué instrucción en Sequelize elimina (DELETE) físicamente un registro basado en condiciones?

- `(a)` Model.destroy()  **← correcta**
- `(b)` Model.delete()
- `(c)` Model.remove()
- `(d)` Model.drop()

<!-- justificacion:inicio -->
`Model.destroy({where})` borra los registros que cumplan la condición. El nombre desconcierta al principio, porque no se parece a `DELETE` ni a `remove`, y por eso los otros tres distractores son tentadores; ninguno existe. `Model.drop()` tampoco es eso: `drop` en Sequelize elimina **la tabla**, que es otra cosa y bastante más grave.
<!-- justificacion:fin -->

- [x] Aprobada

### 33 · m07#34

<!-- pregunta: json_2026#34 | just:7abfbaab66cf -->

Al definir un modelo en Sequelize, ¿qué propiedad define el tipo de dato nativo de una columna?

- `(a)` fieldType
- `(b)` type usando DataTypes  **← correcta**
- `(c)` dbType
- `(d)` struct

<!-- justificacion:inicio -->
Cada columna se declara con un objeto que lleva `type`, y el tipo sale de `DataTypes`: `DataTypes.STRING`, `DataTypes.INTEGER`, `DataTypes.DATE`. Esa capa existe para que el mismo modelo sirva con motores distintos, que traducen cada tipo al suyo. Los otros tres nombres no existen. Junto a `type` suelen ir `allowNull`, `defaultValue` y `unique`.
<!-- justificacion:fin -->

- [x] Aprobada

### 34 · m07#35

<!-- pregunta: json_2026#35 | just:b6e866d26561 -->

En Sequelize, ¿qué función vincula un modelo "A" con un modelo "B" en relación Uno a Uno?

- `(a)` A.belongsToOne(B)
- `(b)` A.hasOne(B)  **← correcta**
- `(c)` A.relatesTo(B)
- `(d)` A.links(B)

<!-- justificacion:inicio -->
`A.hasOne(B)` declara que A tiene un B, y hace que la llave foránea quede en **B** — la tabla del lado que «pertenece». Esa es la parte que más se confunde: el método se escribe en el modelo dueño, pero la columna aparece en el otro. Los otros tres nombres no existen; `belongsToOne` suena razonable y no es de Sequelize.
<!-- justificacion:fin -->

- [x] Aprobada

### 35 · m07#36

<!-- pregunta: json_2026#36 | just:1744a3b6e00f -->

Para completar la asociación inversa "Uno a Uno" o "Uno a Muchos", ¿qué método aplica el hijo?

- `(a)` belongsTo()  **← correcta**
- `(b)` hasParent()
- `(c)` childOf()
- `(d)` ownsTo()

<!-- justificacion:inicio -->
`belongsTo()` es el lado inverso, el que declara el hijo: `B.belongsTo(A)` completa lo que `A.hasOne(B)` o `A.hasMany(B)` empezaron, y es el que pone la llave foránea en B. Declarar los dos lados es lo que permite navegar la relación en ambos sentidos al consultar. Los otros tres nombres no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 36 · m07#38

<!-- pregunta: json_2026#38 | just:7d03a3af9450 -->

¿Qué requiere estrictamente una relación "Muchos a Muchos" (N:M) en bases de datos relacionales?

- `(a)` Duplicar todos los campos en ambos modelos.
- `(b)` Declarar dos llaves primarias en una misma columna.
- `(c)` Una tabla o modelo intermedio para alojar ambas llaves foráneas.  **← correcta**
- `(d)` Modificar los índices para admitir valores nulos múltiples.

<!-- justificacion:inicio -->
Una relación N:M necesita una tabla intermedia cuyas filas son los pares, con las llaves foráneas de las dos tablas. No hay forma de representarla con una columna en cualquiera de los dos lados, porque cada fila admitiría un solo valor. Esa tabla es además el sitio natural de los atributos que pertenecen a la relación y no a las entidades.
<!-- justificacion:fin -->

- [x] Aprobada

### 37 · m07#39

<!-- pregunta: json_2026#39 | just:bdc75d6fadc5 -->

En Sequelize, ¿qué método establece una relación Muchos a Muchos indicando la tabla intermedia?

- `(a)` belongsToMany() con la opción 'through'  **← correcta**
- `(b)` hasManyToMany() con la opción 'via'
- `(c)` associatesWith() con la opción 'middle'
- `(d)` linksToMany() con la opción 'joinTable'

<!-- justificacion:inicio -->
`A.belongsToMany(B, { through: 'AB' })`, y hay que declararlo en los dos modelos para poder navegar en ambos sentidos. La opción `through` es obligatoria y dice qué tabla intermedia usar — puede ser un nombre o un modelo propio, y conviene lo segundo cuando la relación tiene datos suyos. Los otros tres nombres no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 38 · m07#40

<!-- pregunta: json_2026#40 | just:37e97c103ea3 -->

Al consultar modelos asociados en Sequelize, ¿qué parámetro se usa para cargar relaciones (JOIN)?

- `(a)` fetch
- `(b)` relations
- `(c)` include  **← correcta**
- `(d)` populate

<!-- justificacion:inicio -->
`include` es la opción que trae de una vez los modelos asociados, traduciéndose a un `JOIN`: `Model.findAll({ include: Otro })`. Sin ella, cada relación exigiría una consulta aparte, que es el problema de las N+1 consultas. La (d), `populate`, es real pero de Mongoose, el ORM de MongoDB, y por eso es el mejor distractor de los tres.
<!-- justificacion:fin -->

- [x] Aprobada

### 39 · M7-1

<!-- pregunta: js_2026#1 | just:03328c525954 -->

¿Qué sucede internamente al invocar client.release() tras usar una conexión de un Pool con 'pg'?

- `(a)` Se destruye físicamente la conexión con el servidor.
- `(b)` Devuelve la conexión al pool para que sea reutilizada.  **← correcta**
- `(c)` Obliga a cerrar todas las transacciones pendientes.
- `(d)` Borra la caché de consultas precompiladas del cliente.

<!-- justificacion:inicio -->
`release()` devuelve la conexión al pool y la deja disponible para la siguiente petición; **no la cierra**. Ésa es la distinción que la pregunta busca: cerrar sería tirar a la basura justo lo que el pool existe para conservar. Las otras tres describen efectos que no ocurren — no cierra transacciones ni borra cachés, y por eso conviene terminarlas uno mismo antes de soltar el cliente.
<!-- justificacion:fin -->

- [x] Aprobada

### 40 · M7-2

<!-- pregunta: js_2026#2 | just:45b6160f4e2d -->

En Node, ¿cuándo es imperativo utilizar cursores en lugar de consultas tradicionales (client.query)?

- `(a)` Cuando se insertan múltiples filas en una sola query.
- `(b)` Para procesar conjuntos de datos masivos sin saturar la RAM.  **← correcta**
- `(c)` Al ejecutar comandos DDL como CREATE TABLE o ALTER.
- `(d)` Siempre que se utilicen transacciones asíncronas anidadas.

<!-- justificacion:inicio -->
Cuando el conjunto de resultados no cabe cómodamente en memoria. `client.query()` trae todo de una vez y construye el arreglo completo; con millones de filas, el proceso se queda sin memoria. El cursor los va entregando por lotes. Las otras tres describen situaciones donde el cursor no aporta nada: insertar, ejecutar DDL o usar transacciones.
<!-- justificacion:fin -->

- [x] Aprobada

### 41 · M7-3

<!-- pregunta: js_2026#3 | just:e6ba5f6cb788 -->

¿Qué ventaja ofrece usar async/await frente a callbacks al realizar múltiples consultas consecutivas?

- `(a)` Incrementa exponencialmente el rendimiento del motor.
- `(b)` Evita el Callback Hell manteniendo un flujo asíncrono legible.  **← correcta**
- `(c)` Cierra la conexión automáticamente tras cada bloque await.
- `(d)` Compila las consultas a binario antes de enviarlas al server.

<!-- justificacion:inicio -->
`async/await` deja el código asíncrono con la forma del síncrono: una consulta debajo de la otra, en vertical, en vez de anidadas dentro de callbacks. Eso importa especialmente aquí, donde una operación encadena varias consultas y el manejo de errores vuelve a ser un `try/catch` corriente. Lo que **no** hace es acelerar nada: la espera es la misma.
<!-- justificacion:fin -->

- [x] Aprobada

### 42 · M7-4

<!-- pregunta: js_2026#4 | just:5883b1c3ca94 -->

Usando 'pg', ¿cómo se obtiene el ID generado automáticamente tras un INSERT en PostgreSQL?

- `(a)` Consultando la vista global de variables de sesión.
- `(b)` Agregando la cláusula RETURNING a la sentencia SQL.  **← correcta**
- `(c)` Invocando la función interna GET_LAST_ID() de PostgreSQL.
- `(d)` Leyendo la propiedad nativa 'lastInsertId' del objeto Result.

<!-- justificacion:inicio -->
Agregando `RETURNING id` —o `RETURNING *`— al `INSERT`, y leyendo después `result.rows[0].id`. Es la forma de PostgreSQL, y tiene una ventaja sobre las de otros motores: viene en la misma consulta, así que no hay una segunda llamada donde otra sesión pueda colarse. La (d) describe una propiedad de MySQL, y las otras dos no existen.
<!-- justificacion:fin -->

- [x] Aprobada

### 43 · M7-5

<!-- pregunta: js_2026#5 | just:bddf227e9fba -->

En el objeto Result devuelto por un UPDATE o DELETE, ¿qué propiedad indica las filas afectadas?

- `(a)` Result.rowsAffected
- `(b)` Result.rowCount  **← correcta**
- `(c)` Result.changedRows
- `(d)` Result.length

<!-- justificacion:inicio -->
`Result.rowCount` dice cuántas filas afectó la sentencia. Los otros tres nombres pertenecen a otras bibliotecas o no existen. Conviene mirarlo siempre después de un `UPDATE` o un `DELETE`: si vale cero, la condición no encontró nada, y eso rara vez es lo que uno esperaba — es la diferencia entre «se hizo» y «no falló».
<!-- justificacion:fin -->

- [x] Aprobada

### 44 · M7-6

<!-- pregunta: js_2026#6 | just:99006ca3a1ff -->

Si ocurre un error en la tercera consulta de una transacción, ¿qué instrucción debe ejecutarse?

- `(a)` COMMIT PARCIAL
- `(b)` ROLLBACK  **← correcta**
- `(c)` DROP TRANSACTION
- `(d)` REVERT CACHE

<!-- justificacion:inicio -->
`ROLLBACK`, que deshace las tres consultas y no solo la que falló. En eso consiste la atomicidad: la transacción se aplica entera o no deja rastro. Las otras tres no existen como instrucciones. Y después del `ROLLBACK` queda una cosa más por hacer, que es devolver el cliente al pool con `release()`.
<!-- justificacion:fin -->

- [x] Aprobada

### 45 · M7-7

<!-- pregunta: js_2026#7 | just:4f6889c14dd0 -->

¿Qué representa principalmente un "Modelo" dentro del ecosistema del ORM Sequelize?

- `(a)` Una conexión activa con la base de datos PostgreSQL.
- `(b)` Una abstracción de una tabla que permite operar con objetos.  **← correcta**
- `(c)` Un middleware que filtra consultas maliciosas (Injection).
- `(d)` Una función genérica para crear vistas relacionales SQL.

<!-- justificacion:inicio -->
Un modelo es la abstracción de una tabla: define sus columnas y ofrece los métodos para operar con ella usando objetos en vez de SQL. Las otras tres describen piezas reales de una aplicación —la conexión, un middleware, una vista— que no son el modelo. La conexión, en particular, es lo que se le pasa a Sequelize al arrancar, no lo que el modelo representa.
<!-- justificacion:fin -->

- [x] Aprobada

### 46 · M7-8

<!-- pregunta: js_2026#8 | just:bc5e85849c07 -->

En Sequelize, ¿qué método define el lado "1" de una relación uno a muchos (1:N)?

- `(a)` belongsToMany()
- `(b)` hasMany()  **← correcta**
- `(c)` hasOne()
- `(d)` belongsTo()

<!-- justificacion:inicio -->
`hasMany()` se declara en el lado «uno»: `Autor.hasMany(Libro)` dice que un autor tiene muchos libros, y la llave foránea queda en la tabla de libros. Su par es `belongsTo()`, que se declara en el lado «muchos» y completa la relación. `hasOne()` es para uno a uno y `belongsToMany()` para muchos a muchos.
<!-- justificacion:fin -->

- [x] Aprobada

### 47 · M7-9

<!-- pregunta: js_2026#9 | just:ba2651b0f3bd -->

Para crear una relación N:M en Sequelize, ¿qué parámetro adicional es obligatorio en la asociación?

- `(a)` La definición de una tabla intermedia con la opción "through".  **← correcta**
- `(b)` Un índice agrupado (clustered index) en ambas tablas.
- `(c)` Una función recursiva definida como un hook global.
- `(d)` Declarar llaves primarias compuestas en cada modelo base.

<!-- justificacion:inicio -->
La opción `through`, que nombra la tabla intermedia donde viven las dos llaves foráneas. Es obligatoria porque sin ella Sequelize no sabría dónde guardar los pares. Las otras tres describen cosas que no hacen falta: ni índices agrupados, ni hooks, ni claves compuestas declaradas a mano — de la clave de la tabla intermedia se encarga Sequelize.
<!-- justificacion:fin -->

- [x] Aprobada

### 48 · M7-10

<!-- pregunta: js_2026#10 | just:5e8fa74a005b -->

Al realizar lecturas en Sequelize, ¿qué opción permite incluir objetos de modelos relacionados (Joins)?

- `(a)` associations: true
- `(b)` include  **← correcta**
- `(c)` fetchRelated
- `(d)` join: 'all'

<!-- justificacion:inicio -->
`include` trae los modelos asociados en la misma consulta, traduciéndose a un `JOIN`. Sin ella hay que consultar cada relación aparte, que es el problema clásico de las N+1 consultas: una para la lista y una más por cada elemento. La (a) y la (d) no existen, y `populate` —que no aparece aquí— sería la de Mongoose, no la de Sequelize.
<!-- justificacion:fin -->

- [x] Aprobada

---

## Lo que este documento no puede decidir

- **Si las justificaciones son ciertas.** Que existan se comprueba con un
  programa; que sean correctas no. Por eso las lees tú.
- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería
  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.
  Si la quieres, es una pasada editorial aparte.

