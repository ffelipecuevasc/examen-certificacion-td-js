# Cuestionario de Evaluación - Módulo 7: Acceso a datos en aplicaciones Node (Nuevas Preguntas)

1. En el paquete `pg`, si utilizas una conexión cliente en lugar de pool (`new Client()`), ¿qué desventaja arquitectónica asumes?
a) Debes gestionar el ciclo de vida de conexión/desconexión por tu cuenta para cada solicitud.
b) El motor prohíbe realizar consultas DML y permite solo consultas SELECT de solo lectura.
c) Las conexiones cliente rechazan consultas asíncronas y traban el hilo V8 obligatoriamente.
d) Es imposible utilizar el esquema Prepared Statements, volviendo la API vulnerable a inyecciones.
Respuesta: a) Debes gestionar el ciclo de vida de conexión/desconexión por tu cuenta para cada solicitud.

2. ¿Qué suceso provoca internamente el Driver Node (`pg`) al omitir ejecutar `client.release()` después de pedir un cliente del pool?
a) Ejecuta automáticamente un ROLLBACK de cualquier transacción pendiente en el motor de base de datos.
b) Genera un error crítico de compilación que fuerza a detener y purgar toda la memoria RAM asignada al hilo.
c) Provoca una fuga o agotamiento (Connection Leak), paralizando las peticiones si el pool alcanza su tope.
d) Desconecta de inmediato al cliente activo e interrumpe abruptamente la conexión de red TCP.
Respuesta: c) Provoca una fuga o agotamiento (Connection Leak), paralizando las peticiones si el pool alcanza su tope.

3. Al parametrizar un query en PostgreSQL usando `pg`, ¿qué mecanismo interno protege contra la inyección SQL?
a) El Driver escapa los caracteres peligrosos manualmente mediante expresiones regulares globales antes del envío.
b) El motor separa estrictamente el plan de ejecución lógico de los parámetros, sin evaluarlos como código.
c) Node convierte todo el payload a binario puro codificado en Base64Url antes del protocolo TCP.
d) Se utiliza una función hash MD5 embebida en el middleware del servidor antes de llegar al Driver.
Respuesta: b) El motor separa estrictamente el plan de ejecución lógico de los parámetros, sin evaluarlos como código.

4. En un escenario de lectura masiva (ej. 1 millón de filas), ¿por qué usar `pg-cursor` previene el colapso del servidor Node?
a) Porque fragmenta el bloque de datos y recupera un número finito de filas por cada solicitud secuencial (chunking).
b) Porque incrementa forzosamente la memoria Heap del motor V8 hasta lograr acomodar todo el bloque de manera síncrona.
c) Porque transfiere las tareas de procesamiento directamente a una API enrutada a un clúster remoto secundario.
d) Porque convierte nativamente los registros a variables globales, eludiendo al recolector de basura de JavaScript.
Respuesta: a) Porque fragmenta el bloque de datos y recupera un número finito de filas por cada solicitud secuencial (chunking).

5. Si en `pg-cursor` aplicas el comando `cursor.read(100, callback)`, ¿qué acción debes efectuar tras recibir las primeras 100 filas?
a) Ejecutar la sentencia COMMIT para confirmar la lectura de esa sección.
b) Desconectar y volver a conectar el cursor a la base de datos para refrescar la IP.
c) Invocar nuevamente `cursor.read(100, callback)` si precisas extraer el bloque siguiente.
d) Modificar obligatoriamente el límite de OFFSET en la cláusula SQL primaria.
Respuesta: c) Invocar nuevamente `cursor.read(100, callback)` si precisas extraer el bloque siguiente.

6. Al consultar usando la instrucción nativa `pool.query()`, ¿qué gestiona internamente esta función por detrás de escena?
a) Obliga a la consulta a correr bajo un esquema de bloqueo total de tablas.
b) Inicia y finaliza una transacción ACID automáticamente sin comandos manuales.
c) Cifra todos los resultados retornados usando la llave maestra del SO.
d) Pide un cliente al pool, ejecuta la consulta SQL y libera el cliente enseguida.
Respuesta: d) Pide un cliente al pool, ejecuta la consulta SQL y libera el cliente enseguida.

7. Si efectúas una sentencia DML de eliminación masiva y necesitas conocer los IDs eliminados, ¿qué cláusula usas con `pg`?
a) DELETE FROM tabla WHERE id > 10 CATCH ALL;
b) DELETE FROM tabla WHERE id > 10 GET ROW_ID;
c) DELETE FROM tabla WHERE id > 10 RETURNING id;
d) DELETE FROM tabla WHERE id > 10 EXPORT KEYS;
Respuesta: c) DELETE FROM tabla WHERE id > 10 RETURNING id;

8. Para asegurar que una sentencia INSERT afecte la base de datos, ¿qué propiedad del objeto respuesta (`res`) debes evaluar?
a) res.commandStatus
b) res.rowCount
c) res.insertedKeys
d) res.commitLog
Respuesta: b) res.rowCount

9. En una inserción con Prepared Statements de `pg`, si un campo es opcional y recibes `undefined` de tu API, ¿qué error ocurre y cómo se soluciona?
a) PostgreSQL rechaza `undefined`; debe transformarse o enviarse explícitamente como `null`.
b) Node ignora el campo automáticamente, no hay que aplicar cambios lógicos.
c) Lanza un error fatal porque el parámetro exige un arreglo de strings y nulos.
d) Se inserta silenciosamente la palabra textual "undefined" en la base de datos.
Respuesta: a) PostgreSQL rechaza `undefined`; debe transformarse o enviarse explícitamente como `null`.

10. Si ejecutas una sentencia UPDATE en Node que depende de un ID dinámico, ¿por qué es crítico validar ese ID antes de llamar al pool?
a) Porque de lo contrario Node reiniciará por completo su hilo base.
b) Para evitar actualizaciones huérfanas o errores de sintaxis que tumben el Driver.
c) Porque el motor de BD encriptará la columna ID invalidando futuras lecturas.
d) Porque Sequelize asume que es una inserción si el ID viene vacío.
Respuesta: b) Para evitar actualizaciones huérfanas o errores de sintaxis que tumben el Driver.

11. ¿Cuál es el error de seguridad más evidente de redactar una consulta en la forma: `query("SELECT * FROM users WHERE email = '" + req.body.email + "'")`?
a) Excede el tiempo límite de lectura al utilizar concatenación estática de strings.
b) Deja el sistema completamente vulnerable a manipulación mediante Inyección SQL.
c) Obliga a PostgreSQL a deshabilitar el cifrado del lado del servidor.
d) Retorna todas las contraseñas de la base de datos, independientemente de los filtros.
Respuesta: b) Deja el sistema completamente vulnerable a manipulación mediante Inyección SQL.

12. ¿Por qué es un antipatrón envolver cada consulta simple tipo SELECT en un bloque explícito BEGIN / COMMIT?
a) Porque genera escrituras innecesarias en el log transaccional penalizando el rendimiento I/O.
b) Porque los motores relacionales rechazan el comando COMMIT si no hay sentencias DML previas.
c) Porque fuerza al servidor a duplicar los resultados antes de entregarlos al Driver.
d) Porque bloquea automáticamente las tablas e impide a otros usuarios realizar cualquier lectura.
Respuesta: a) Porque genera escrituras innecesarias en el log transaccional penalizando el rendimiento I/O.

13. Durante una transacción manual con `pg`, ¿por qué se debe obtener un cliente dedicado (`pool.connect()`) en lugar de usar `pool.query()`?
a) Porque `pool.query()` cifra las credenciales y desactiva las operaciones DML.
b) Porque una transacción exige garantizar que múltiples comandos operen secuencialmente bajo una idéntica sesión TCP/IP.
c) Porque `pool.query()` carece de las promesas asíncronas introducidas en las especificaciones recientes de ECMAScript.
d) Porque un cliente dedicado bypasséa los controles de seguridad y eleva los privilegios en la consola.
Respuesta: b) Porque una transacción exige garantizar que múltiples comandos operen secuencialmente bajo una idéntica sesión TCP/IP.

14. En un script Node asíncrono, si lanzas un COMMIT y luego ejecutas `client.release()`, ¿qué sucede con la conexión física a la BD?
a) La conexión TCP se destruye y el Driver obliga a abrir una nueva en el siguiente query.
b) La conexión retorna a un estado latente en memoria (idle), lista para ser asignada a otra petición.
c) Node traslada la conexión a la base de datos secundaria para distribuir el balance de carga.
d) El pool la bloquea por seguridad hasta que finalice el Event Loop.
Respuesta: b) La conexión retorna a un estado latente en memoria (idle), lista para ser asignada a otra petición.

15. Si empleas `async/await` en un flujo transaccional con `pg`, ¿dónde debes posicionar estratégicamente la sentencia `ROLLBACK`?
a) Justo a continuación de iniciar el bloque Try, para limpiar la memoria caché.
b) Dentro del bloque Catch, para deshacer el trabajo si una promesa es rechazada.
c) En el bloque Finally de manera incondicional, asegurando que se libere la BD.
d) Inmediatamente tras el COMMIT, para revertir los resultados y comparar lecturas.
Respuesta: b) Dentro del bloque Catch, para deshacer el trabajo si una promesa es rechazada.

16. ¿Qué estado adquiere una transacción si ocurre un error lógico severo en PostgreSQL y no lanzas un ROLLBACK explícito en Node?
a) El motor ignora el error, salta la línea afectada y ejecuta un COMMIT automático parcial.
b) Node captura el error, congela el hilo y pide entrada por teclado en consola para reiniciar el pool.
c) La transacción entra en estado abortado/roto, bloqueando cualquier otra consulta en ese cliente hasta el ROLLBACK.
d) Se levanta automáticamente una nueva instancia de PostgreSQL como mecanismo failover de emergencia.
Respuesta: c) La transacción entra en estado abortado/roto, bloqueando cualquier otra consulta en ese cliente hasta el ROLLBACK.

17. ¿Qué función de diseño de software abstrae completamente la escritura manual de código SQL al interactuar con tablas?
a) Una herramienta visual de diagrama de entidad relación.
b) Un Motor de Plantillas (como Pug o Handlebars).
c) Un Mapeador Objeto-Relacional (como Sequelize).
d) Un Middleware de seguridad criptográfica o firewall lógico.
Respuesta: c) Un Mapeador Objeto-Relacional (como Sequelize).

18. En la terminología de Sequelize, ¿a qué corresponde un "Dialecto" (Dialect) al configurar la instancia inicial?
a) Es el idioma en que Sequelize imprime los logs de error en consola (ej. ES, EN).
b) Representa el motor de BD específico con el cual debe comunicarse (ej. 'postgres', 'mysql').
c) Es el protocolo de encriptación que protege la contraseña enviada al servidor.
d) Define la versión estricta de ECMAScript permitida para construir Modelos.
Respuesta: b) Representa el motor de BD específico con el cual debe comunicarse (ej. 'postgres', 'mysql').

19. Al definir una columna o atributo en un modelo Sequelize, ¿qué directiva previene que se ingresen valores nulos?
a) required: true
b) notEmpty: force
c) allowNull: false
d) skipNull: activate
Respuesta: c) allowNull: false

20. Si Sequelize sincroniza los modelos mediante `sequelize.sync({ force: true })`, ¿qué acción destructiva sucede internamente?
a) Fuerza a que el motor cambie su juego de caracteres nativo a UTF-8.
b) Trunca temporalmente los datos para evitar que superen el límite RAM asignado.
c) Ejecuta comandos DROP TABLE IF EXISTS y vuelve a recrear las tablas vacías desde cero.
d) Sobrescribe todas las claves primarias generando valores hash universales (UUID).
Respuesta: c) Ejecuta comandos DROP TABLE IF EXISTS y vuelve a recrear las tablas vacías desde cero.

21. Usando Sequelize, ¿qué método síncrono retorna el primer registro que cumpla una condición específica en el bloque `where`?
a) Model.firstOne()
b) Model.findOne()
c) Model.getTop()
d) Model.searchPrimary()
Respuesta: b) Model.findOne()

22. En Sequelize, ¿qué propiedad del objeto de opciones se usa para emular la cláusula SQL "ORDER BY"?
a) sequence
b) sort
c) order
d) align
Respuesta: c) order

23. ¿Qué método ofrece Sequelize para insertar múltiples objetos JSON masivamente en una tabla con un solo llamado?
a) Model.insertMany()
b) Model.bulkCreate()
c) Model.addMultiple()
d) Model.pushArray()
Respuesta: b) Model.bulkCreate()

24. Al configurar `Model.update()` en Sequelize, si se omite por error la cláusula `where`, ¿qué restricción impone el ORM por defecto?
a) Ejecuta la instrucción sobre toda la tabla, sobrescribiendo absolutamente todos los registros.
b) Arroja un error impidiendo la ejecución masiva como medida de seguridad (salvo que se fuerce).
c) Actualiza exclusivamente el registro más antiguo que encuentre en su escaneo.
d) Traslada los registros modificados a una tabla temporal (dump table) como protección.
Respuesta: a) Ejecuta la instrucción sobre toda la tabla, sobrescribiendo absolutamente todos los registros.

25. En Sequelize, ¿qué efecto genera habilitar la opción paramétrica `{ paranoid: true }` en la declaración de un Modelo?
a) Encripta automáticamente todas las columnas sensibles evitando su lectura directa en SQL.
b) Bloquea peticiones de IP dudosas integrando un firewall al pool de conexiones del modelo.
c) Aplica borrado lógico o "soft delete", marcando la fecha de eliminación en lugar de destruir la fila.
d) Falla deliberadamente si un registro demora más de 10 milisegundos en ser procesado.
Respuesta: c) Aplica borrado lógico o "soft delete", marcando la fecha de eliminación en lugar de destruir la fila.

26. Para gestionar relaciones Uno a Muchos (1:N), además de `A.hasMany(B)`, ¿qué método se debe declarar en el modelo destino "B"?
a) B.dependsOn(A)
b) B.belongsTo(A)
c) B.hasOne(A)
d) B.referencesTo(A)
Respuesta: b) B.belongsTo(A)

27. ¿Por qué es crucial declarar ambos lados de una asociación (ej. `hasMany` y `belongsTo`) en Sequelize?
a) Para evitar que la base de datos multiplique el espacio físico consumido por los índices.
b) Porque Sequelize requiere referencias bidireccionales para ejecutar consultas anidadas (Eager Loading) en ambos sentidos.
c) Para habilitar el borrado total e incondicional (hard delete) sobre todas las tablas vinculadas.
d) Porque Node.js detiene el arranque de la aplicación si detecta claves foráneas huérfanas en memoria.
Respuesta: b) Porque Sequelize requiere referencias bidireccionales para ejecutar consultas anidadas (Eager Loading) en ambos sentidos.

28. En relaciones N:M configuradas en Sequelize mediante `belongsToMany`, ¿cómo puedes agregar columnas adicionales a la tabla intermedia?
a) Definiendo directamente una clase de Modelo adicional y pasándola como parámetro en la opción "through".
b) Es imposible; las tablas intermedias de Sequelize son estrictas y solo permiten las dos llaves foráneas.
c) Modificando la base de datos manualmente a través de la consola nativa del motor de PostgreSQL.
d) Anexando los nuevos atributos en la sección 'appendMetadata' del objeto de configuración global de Node.
Respuesta: a) Definiendo directamente una clase de Modelo adicional y pasándola como parámetro en la opción "through".

29. ¿Qué técnica permite a Sequelize consultar y traer simultáneamente datos del modelo base y sus modelos asociados?
a) Lazy Evaluation (Evaluación Perezosa).
b) Polling Secuencial Asíncrono.
c) Eager Loading (Carga Temprana) mediante la opción 'include'.
d) Cursor Batching (Procesamiento por Lotes).
Respuesta: c) Eager Loading (Carga Temprana) mediante la opción 'include'.

30. Si Sequelize genera un JOIN utilizando la opción `include`, ¿qué estructura de datos retorna por defecto para una relación 1:N?
a) Un arreglo de Strings combinados separados por espacios en blanco.
b) Un objeto literal que aloja internamente la sub-colección como un Array poblado de instancias vinculadas.
c) Una simple cadena JSON plana sin anidar, imitando el resultado nativo en bruto del SQL puro.
d) Un objeto buffer codificado en base64 para evitar el desbordamiento de la transferencia HTTP.
Respuesta: b) Un objeto literal que aloja internamente la sub-colección como un Array poblado de instancias vinculadas.

31. ¿Qué operador avanzado de Sequelize se emplea dentro de la opción `where` para filtrar resultados usando una lista o arreglo ("IN")?
a) [Op.list]
b) [Op.between]
c) [Op.in]
d) [Op.matchArray]
Respuesta: c) [Op.in]

32. Al requerir paginación en Sequelize, ¿qué método optimizado devuelve simultáneamente las filas pedidas y el recuento total absoluto?
a) Model.countAndFetch()
b) Model.findAndCountAll()
c) Model.paginateRecords()
d) Model.limitOffsetAll()
Respuesta: b) Model.findAndCountAll()

33. ¿Qué concepto de abstracción se aplica en Sequelize para ejecutar código automático justo antes o después de crear/actualizar un registro?
a) Procedimientos Almacenados (Stored Procedures).
b) Funciones Gatillo (Triggers) configuradas en PostgreSQL.
c) Ganchos o Interceptores de Ciclo de Vida (Hooks / Callbacks de modelo).
d) Middlewares globales anclados al Event Loop central de Node.js.
Respuesta: c) Ganchos o Interceptores de Ciclo de Vida (Hooks / Callbacks de modelo).

34. ¿Qué ventaja ofrece emplear un archivo de configuración separado (config.json o .env) en aplicaciones con `pg` o Sequelize?
a) Ofusca totalmente la conexión volviéndola inmune a ataques XSS inyectados en HTML.
b) Desacopla las credenciales de base de datos del código fuente, facilitando la transición entre entornos y repositorios seguros.
c) Incrementa dramáticamente la velocidad del pool al compilar anticipadamente los certificados SSL de red.
d) Garantiza que Node.js no consuma memoria al inicializar los controladores asíncronos nativos.
Respuesta: b) Desacopla las credenciales de base de datos del código fuente, facilitando la transición entre entornos y repositorios seguros.

35. Cuando Sequelize instancía una transacción controlada localmente (Managed Transaction), ¿qué provecho estructural se obtiene?
a) La transacción se despliega en un clúster paralelo y no afecta a los demás recursos de la CPU.
b) Node.js suspende las consultas ajenas al hilo activo para priorizar el COMMIT.
c) Sequelize invoca internamente COMMIT o ROLLBACK en base a si el callback retorna con éxito o genera un throw, automatizando la decisión.
d) Ignora las restricciones de llaves foráneas para realizar escrituras ultrarrápidas y sin revisión previa en la red.
Respuesta: c) Sequelize invoca internamente COMMIT o ROLLBACK en base a si el callback retorna con éxito o genera un throw, automatizando la decisión.

36. En una transacción no manejada en Sequelize (Unmanaged Transaction), ¿qué debes transferir imperativamente a cada comando (ej. `Model.create()`) para que participe del bloque atómico?
a) La cadena de texto (string) que contiene la IP y el puerto activo.
b) El objeto de opciones conteniendo la referencia exacta de la transacción (`{ transaction: t }`).
c) Un identificador numérico de sesión local inyectado de forma global en Node.
d) El objeto res de Express para que Sequelize confirme la petición HTTP nativamente.
Respuesta: b) El objeto de opciones conteniendo la referencia exacta de la transacción (`{ transaction: t }`).

37. Al modelar tipos numéricos de coma flotante sensibles (ej. saldos monetarios) en Sequelize, ¿qué DataType se recomienda emplear en lugar de `DataTypes.FLOAT` para prevenir anomalías de precisión?
a) DataTypes.DECIMAL o DataTypes.NUMERIC.
b) DataTypes.BIGINT combinado con multiplicadores nativos.
c) DataTypes.REAL.
d) DataTypes.TEXT para delegar el control directo al frontend.
Respuesta: a) DataTypes.DECIMAL o DataTypes.NUMERIC.

38. ¿Qué comportamiento predeterminado aplica Sequelize sobre los atributos `createdAt` y `updatedAt` al generar los esquemas de Modelos?
a) Desactiva su existencia para mantener fiel compatibilidad con bases de datos legadas MySQL o SQLite.
b) Los incluye automáticamente y mantiene al día de forma autónoma (Timestamps) en cada inserción o modificación del registro.
c) Exige que el programador ingrese los datos explícitamente mediante funciones nativas Date() de JavaScript en los controladores.
d) Reemplaza su función por identificadores seriales únicos incrementales basados en el reloj de microsegundos de la CPU del SO.
Respuesta: b) Los incluye automáticamente y mantiene al día de forma autónoma (Timestamps) en cada inserción o modificación del registro.

39. Si precisas actualizar una llave foránea (`foreignKey`) customizada y distinta del estándar por defecto de Sequelize, ¿dónde la especificas?
a) Modificando directamente el código fuente nativo de Sequelize alojado en la carpeta node_modules local.
b) Inyectándola en el objeto de configuración u opciones cuando dictas la asociación (ej. `hasMany(B, { foreignKey: 'miId' })`).
c) Creando obligatoriamente una vista lógica materializada paralela dentro de PostgreSQL que resuelva la nomenclatura.
d) Cambiando el identificador global de conexión de Base de Datos para forzar una sincronización severa en consola.
Respuesta: b) Inyectándola en el objeto de configuración u opciones cuando dictas la asociación (ej. `hasMany(B, { foreignKey: 'miId' })`).

40. ¿A través de qué propiedad puedes auditar en la terminal el código SQL exacto que Sequelize emite hacia la base de datos PostgreSQL?
a) Activando la bandera de línea de comandos `--sql-trace` al correr Node.js.
b) Instanciando el cliente nativo con `{ sqlDebug: true }` dentro de la variable de ambiente local.
c) Habilitando y proporcionando una función emisora (ej. `console.log`) en la propiedad `logging` al instanciar el ORM en el proyecto.
d) Capturando el log de errores arrojado asincrónicamente por la instrucción Try-Catch en el bloque final.
Respuesta: c) Habilitando y proporcionando una función emisora (ej. `console.log`) en la propiedad `logging` al instanciar el ORM en el proyecto.
