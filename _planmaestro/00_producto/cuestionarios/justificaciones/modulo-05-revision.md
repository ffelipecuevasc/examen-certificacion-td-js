# Justificaciones del módulo 5 · para revisar

**Lote:** 49 preguntas · **Redactadas:** 2026-09-10 por Claude Code

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

### 01 · m05#1

<!-- pregunta: json_2026#1 | just:a8000d87172f -->

¿Qué característica fundamental distingue a un RDBMS de un sistema NoSQL documental?

- `(a)` Estructura flexible de esquemas dinámicos.
- `(b)` Garantía estricta de propiedades ACID.  **← correcta**
- `(c)` Almacenamiento basado en grafos dirigidos.
- `(d)` Ausencia de lenguaje estructurado de consultas.

<!-- justificacion:inicio -->
Un motor relacional garantiza ACID —atomicidad, consistencia, aislamiento y durabilidad— como parte de su contrato, y eso es lo que lo distingue del enfoque documental clásico, que nació sacrificando esas garantías a cambio de flexibilidad y escala. Las otras tres describen rasgos del lado NoSQL: el esquema flexible, el almacenamiento en grafos y la ausencia de SQL. Conviene saber que la frontera se ha ido borrando —varios motores documentales ofrecen hoy transacciones ACID—, pero la distinción sigue siendo la que el examen evalúa.
<!-- justificacion:fin -->

- [x] Aprobada

### 02 · m05#2

<!-- pregunta: json_2026#2 | just:c49b0dec4a11 -->

¿Cuál es el rol principal del motor relacional en la arquitectura de un RDBMS?

- `(a)` Compilar el código SQL en binarios ejecutables nativos.
- `(b)` Gestionar la interfaz gráfica de usuario final.
- `(c)` Optimizar y ejecutar los planes de consulta sobre los datos.  **← correcta**
- `(d)` Exportar automáticamente backups en formato JSON.

<!-- justificacion:inicio -->
El motor relacional recibe una consulta declarativa —qué se quiere, no cómo obtenerlo—, decide el plan de ejecución y lo ejecuta: qué índice usar, en qué orden cruzar las tablas, cuándo filtrar. Ahí es donde se gana o se pierde el rendimiento. Las otras tres describen oficios de otras piezas: no compila a binarios, no dibuja interfaces, y los respaldos son una tarea aparte.
<!-- justificacion:fin -->

- [x] Aprobada

### 03 · m05#3

<!-- pregunta: json_2026#3 | just:3b06ae540b2b -->

¿Qué protocolo se utiliza comúnmente para establecer la conexión a un motor RDBMS?

- `(a)` HTTP/REST puro
- `(b)` TCP/IP o Sockets locales  **← correcta**
- `(c)` Protocolo SMTP/POP3
- `(d)` Transferencia FTP/SFTP

<!-- justificacion:inicio -->
La conexión a un motor relacional viaja por TCP/IP cuando el cliente está en otra máquina, o por un socket local cuando está en la misma. Encima de ese transporte va el protocolo propio del motor, que no es HTTP. Las otras tres son protocolos reales de otros oficios: SMTP y POP3 mueven correo, FTP y SFTP mueven archivos, y REST es un estilo para APIs web, no para hablar con una base.
<!-- justificacion:fin -->

- [x] Aprobada

### 04 · m05#4

<!-- pregunta: json_2026#4 | just:4463a3c94efe -->

En el contexto de un RDBMS, ¿qué es un "catálogo de sistema"?

- `(a)` Una vista materializada con los logs de transacciones.
- `(b)` Un conjunto de tablas que almacena metadatos de la base.  **← correcta**
- `(c)` El manual de usuario integrado en la consola SQL.
- `(d)` El índice primario de la tabla principal de la base de datos.

<!-- justificacion:inicio -->
El catálogo de sistema son tablas que describen la propia base: qué tablas hay, qué columnas, de qué tipo, qué restricciones e índices. Es la base hablando de sí misma, y por eso se puede consultar con SQL corriente. En PostgreSQL vive en `information_schema` y en `pg_catalog`. No es un manual, ni un índice, ni una vista de logs.
<!-- justificacion:fin -->

- [x] Aprobada

### 05 · m05#6

<!-- pregunta: json_2026#6 | just:83b6f7222491 -->

Si cruzas dos tablas con LEFT JOIN, ¿qué sucede con los registros huérfanos de la tabla izquierda?

- `(a)` Se omiten del resultado final.
- `(b)` Se incluyen y los campos derechos se rellenan con NULL.  **← correcta**
- `(c)` Generan un error crítico de integridad referencial.
- `(d)` Se rellenan con el valor por defecto de cada columna.

<!-- justificacion:inicio -->
`LEFT JOIN` conserva **todas** las filas de la tabla izquierda, tengan pareja o no; las que no la tienen aparecen igual y las columnas de la derecha se rellenan con `NULL`. Ésa es justamente la diferencia con `INNER JOIN`, que las descartaría. De ahí sale un uso muy común: `LEFT JOIN` más `WHERE derecha.id IS NULL` es la forma de encontrar los huérfanos.
<!-- justificacion:fin -->

- [x] Aprobada

### 06 · m05#7

<!-- pregunta: json_2026#7 | just:08f999fa1db1 -->

¿Cuál es el propósito principal de utilizar una subconsulta correlacionada?

- `(a)` Evaluar independientemente la subconsulta una sola vez.
- `(b)` Ejecutar la subconsulta por cada fila de la consulta principal.  **← correcta**
- `(c)` Bloquear la tabla principal hasta terminar la subconsulta.
- `(d)` Combinar resultados usando operadores de conjunto (UNION).

<!-- justificacion:inicio -->
Una subconsulta correlacionada menciona una columna de la consulta externa, así que no se puede resolver sola: se evalúa una vez por cada fila de la principal. Eso la hace potente y también cara. La (a) describe la subconsulta **no** correlacionada, que se calcula una sola vez y es el par con el que se contrasta. Cuando el costo pesa, muchas se pueden reescribir como un `JOIN`.
<!-- justificacion:fin -->

- [x] Aprobada

### 07 · m05#8

<!-- pregunta: json_2026#8 | just:f7afbf736c53 -->

¿Qué tipo de JOIN retorna únicamente los registros que tienen coincidencias en ambas tablas?

- `(a)` FULL OUTER JOIN
- `(b)` CROSS JOIN NATURAL
- `(c)` INNER JOIN  **← correcta**
- `(d)` RIGHT OUTER JOIN

<!-- justificacion:inicio -->
`INNER JOIN` devuelve solo las filas con coincidencia en las dos tablas. Las otras tres existen y hacen otra cosa: `FULL OUTER JOIN` trae todo de ambos lados rellenando con `NULL`, `RIGHT OUTER JOIN` conserva todo el lado derecho, y `CROSS JOIN` combina cada fila con cada fila sin condición. Es el join por omisión: escribir solo `JOIN` significa `INNER JOIN`.
<!-- justificacion:fin -->

- [x] Aprobada

### 08 · m05#9

<!-- pregunta: json_2026#9 | just:5b706e99b522 -->

En una consulta SELECT, ¿cuál es el orden lógico interno de evaluación del motor SQL?

- `(a)` SELECT, FROM, WHERE, GROUP BY, HAVING
- `(b)` FROM, WHERE, GROUP BY, HAVING, SELECT  **← correcta**
- `(c)` WHERE, FROM, GROUP BY, SELECT, HAVING
- `(d)` SELECT, WHERE, HAVING, GROUP BY, FROM

<!-- justificacion:inicio -->
El orden lógico es `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT` —y `ORDER BY` al final—, que no es el orden en que se escribe. Entenderlo explica dos cosas que se preguntan siempre: por qué `WHERE` no puede filtrar por una función agregada, porque el agrupamiento todavía no ocurrió, y por qué en muchos motores no se puede usar en `WHERE` un alias definido en el `SELECT`, que se evalúa después.
<!-- justificacion:fin -->

- [x] Aprobada

### 09 · m05#10

<!-- pregunta: json_2026#10 | just:e4fbb55c6276 -->

¿Qué operador SQL permite evaluar si un valor específico está dentro del resultado de una subconsulta?

- `(a)` BETWEEN
- `(b)` EXISTS
- `(c)` IN  **← correcta**
- `(d)` LIKE

<!-- justificacion:inicio -->
`IN` comprueba si un valor está entre los que devuelve la subconsulta: `WHERE id IN (SELECT ...)`. `EXISTS` es el distractor fuerte porque también se usa con subconsultas, pero pregunta otra cosa —si la subconsulta devuelve **alguna** fila, sin mirar qué valor—. `BETWEEN` compara contra un rango y `LIKE` contra un patrón de texto; ninguno de los dos toma un conjunto de resultados.
<!-- justificacion:fin -->

- [x] Aprobada

### 10 · m05#11

<!-- pregunta: json_2026#11 | just:95b0c7c3a0d8 -->

Si usas GROUP BY, ¿qué restricción impone el estándar SQL sobre las columnas del SELECT?

- `(a)` Todas deben ser columnas de tipo numérico exclusivamente.
- `(b)` Deben estar en el GROUP BY o dentro de una función agregada.  **← correcta**
- `(c)` Solo puede haber un máximo de 3 columnas seleccionadas.
- `(d)` No se pueden utilizar alias lógicos en el resultado.

<!-- justificacion:inicio -->
Toda columna del `SELECT` tiene que estar en el `GROUP BY` o venir envuelta en una función agregada como `COUNT`, `SUM` o `MAX`. El motivo es que el resultado tiene una fila por grupo, y una columna que no cumple eso tendría varios valores posibles y ninguna regla para elegir. Las otras tres inventan límites que no existen: ni el tipo, ni la cantidad de columnas, ni los alias están restringidos.
<!-- justificacion:fin -->

- [x] Aprobada

### 11 · m05#12

<!-- pregunta: json_2026#12 | just:5bf1d075f111 -->

¿Qué operador lógico utilizarías para buscar patrones de texto específicos ignorando mayúsculas?

- `(a)` EQUALS IGNORE
- `(b)` ILIKE o combinaciones con UPPER/LOWER  **← correcta**
- `(c)` MATCH TEXT EXACT
- `(d)` REGEXP_ONLY

<!-- justificacion:inicio -->
En PostgreSQL, `ILIKE` compara patrones ignorando mayúsculas; el equivalente portátil es forzar los dos lados con `UPPER()` o `LOWER()`. `LIKE` a secas sí distingue mayúsculas de minúsculas, y ésa es la diferencia que la pregunta busca. Los otros tres nombres no existen en SQL. Ojo con una consecuencia práctica: envolver la columna en `UPPER()` suele impedir que el motor use el índice.
<!-- justificacion:fin -->

- [x] Aprobada

### 12 · m05#13

<!-- pregunta: json_2026#13 | just:1f11a336e7cc -->

¿Qué sentencia DML permite insertar filas directamente a partir de una consulta a otra tabla?

- `(a)` INSERT INTO ... SELECT  **← correcta**
- `(b)` CREATE TABLE ... AS
- `(c)` UPDATE ... FROM
- `(d)` MERGE INTO ... SELECT

<!-- justificacion:inicio -->
`INSERT INTO destino SELECT ... FROM origen` inserta en una tabla **que ya existe** las filas que devuelve la consulta. La (b), `CREATE TABLE ... AS`, también copia datos pero crea la tabla en el mismo acto, así que responde a otra necesidad. `MERGE` existe en varios motores y sirve para insertar o actualizar según haya coincidencia; `UPDATE ... FROM` actualiza, no inserta.
<!-- justificacion:fin -->

- [x] Aprobada

### 13 · m05#14

<!-- pregunta: json_2026#14 | just:a9be7dafb9a1 -->

Al ejecutar un DELETE sin cláusula WHERE, ¿qué impacto ocurre internamente en la base de datos?

- `(a)` Se elimina la estructura completa y definitiva de la tabla.
- `(b)` Se truncan los datos reseteando los identificadores.
- `(c)` Se eliminan todos los registros fila a fila (logueado).  **← correcta**
- `(d)` El motor bloquea la operación masiva por seguridad.

<!-- justificacion:inicio -->
`DELETE` sin `WHERE` borra todas las filas, pero las borra **una a una y dejando registro de cada una** en el log de transacciones, de modo que la operación se puede deshacer con `ROLLBACK`. Por eso es lenta en tablas grandes y por eso existe `TRUNCATE`, que es el contraste directo. No borra la tabla —eso es `DROP`— ni reinicia los identificadores, y ningún motor la bloquea por seguridad.
<!-- justificacion:fin -->

- [x] Aprobada

### 14 · m05#15

<!-- pregunta: json_2026#15 | just:7aff761cd2f7 -->

¿Qué función principal asume una "secuencia" en el proceso de inserción de datos?

- `(a)` Ordenar los registros insertados cronológicamente al disco.
- `(b)` Generar valores únicos secuenciales para claves primarias.  **← correcta**
- `(c)` Encriptar contraseñas automáticamente antes de guardarlas.
- `(d)` Agrupar inserciones masivas en bloques asíncronos.

<!-- justificacion:inicio -->
Una secuencia es un generador de números que entrega valores distintos a cada llamada, pensado para alimentar claves primarias sin que dos sesiones simultáneas obtengan el mismo. En PostgreSQL es lo que hay detrás de `SERIAL` y de las columnas `GENERATED ... AS IDENTITY`. Conviene saber que sus valores no se devuelven al deshacer una transacción: un `ROLLBACK` deja huecos en la numeración, y eso es correcto.
<!-- justificacion:fin -->

- [x] Aprobada

### 15 · m05#16

<!-- pregunta: json_2026#16 | just:8cd20fe6d450 -->

¿Qué sucede si una sentencia UPDATE viola una restricción de llave foránea (integridad referencial)?

- `(a)` La fila infractora se actualiza forzosamente con NULL.
- `(b)` El motor suspende la ejecución y pide confirmación manual.
- `(c)` La sentencia DML falla y se rechazan las modificaciones.  **← correcta**
- `(d)` El sistema desactiva temporalmente la llave foránea impuesta.

<!-- justificacion:inicio -->
La sentencia falla entera y no se aplica ninguna de sus modificaciones: una restricción de integridad referencial no es una advertencia, es una condición. Las otras tres describen comportamientos que ningún motor tiene: no rellena con `NULL` por su cuenta, no pide confirmación, y desde luego no desactiva la restricción para poder seguir. Si la sentencia iba dentro de una transacción, ésta queda para deshacer.
<!-- justificacion:fin -->

- [x] Aprobada

### 16 · m05#17

<!-- pregunta: json_2026#17 | just:1d69987566f0 -->

¿Qué propiedad ACID garantiza que una transacción fallida no deje registros parciales guardados?

- `(a)` Aislamiento (Isolation).
- `(b)` Durabilidad (Durability).
- `(c)` Consistencia (Consistency).
- `(d)` Atomicidad (Atomicity).  **← correcta**

<!-- justificacion:inicio -->
La atomicidad es el todo o nada: una transacción se aplica entera o no deja rastro, así que un fallo a mitad no puede dejar registros parciales. Las otras tres son propiedades reales de ACID con otro oficio: la consistencia mantiene válidas las reglas de la base, el aislamiento evita que las transacciones simultáneas se estorben, y la durabilidad garantiza que lo confirmado sobreviva a una caída.
<!-- justificacion:fin -->

- [x] Aprobada

### 17 · m05#18

<!-- pregunta: json_2026#18 | just:bb050dd5ebf5 -->

¿Qué comando asegura la persistencia permanente de los datos tras un bloque de sentencias DML?

- `(a)` SAVEPOINT
- `(b)` COMMIT  **← correcta**
- `(c)` CHECKPOINT
- `(d)` FLUSH PRIVILEGES

<!-- justificacion:inicio -->
`COMMIT` cierra la transacción y hace permanentes sus cambios; hasta ese momento nada de lo hecho es definitivo y un `ROLLBACK` lo desharía. Las otras tres existen y ninguna confirma nada. `SAVEPOINT` marca un punto intermedio al que se puede volver **dentro** de la transacción, sin cerrarla. `CHECKPOINT` es el distractor que separa: fuerza la escritura a disco de los buffers pendientes, así que suena a «persistencia permanente», pero no tiene nada que ver con confirmar una transacción — la durabilidad de lo confirmado la garantiza el registro de transacciones desde el `COMMIT`, sin esperar a ningún volcado. `FLUSH PRIVILEGES` es de MySQL y recarga permisos.
<!-- justificacion:fin -->

- [x] Aprobada

### 18 · m05#19

<!-- pregunta: json_2026#19 | just:6f1b4a17c833 -->

¿Qué problema de concurrencia grave evita el máximo nivel de aislamiento (Serializable)?

- `(a)` Lecturas sucias, lecturas no repetibles y lecturas fantasma.  **← correcta**
- `(b)` Exclusivamente el problema de lecturas sucias aisladas.
- `(c)` Únicamente la sobreescritura de datos mediante deadlocks.
- `(d)` Ninguno, permite alta concurrencia asíncrona incondicional.

<!-- justificacion:inicio -->
El nivel `SERIALIZABLE` es el más alto y evita los tres fenómenos clásicos: lecturas sucias —ver cambios no confirmados—, lecturas no repetibles —leer dos veces y obtener distinto— y lecturas fantasma —que aparezcan filas nuevas entre dos lecturas—. El precio es menos concurrencia, porque el motor tiene que serializar el acceso. Los niveles más bajos van permitiendo uno u otro a cambio de velocidad.
<!-- justificacion:fin -->

- [x] Aprobada

### 19 · m05#20

<!-- pregunta: json_2026#20 | just:13025033b1f5 -->

¿Qué efecto tiene el modo AUTOCOMMIT si se encuentra activado por defecto en la consola SQL?

- `(a)` Inicia un backup automático tras cada actualización masiva.
- `(b)` Agrupa automáticamente todas las consultas del mismo usuario.
- `(c)` Confirma inmediatamente cada sentencia DML que sea exitosa.  **← correcta**
- `(d)` Efectúa un rollback tras 30 segundos de inactividad de red.

<!-- justificacion:inicio -->
Con AUTOCOMMIT activo, cada sentencia que termina bien se confirma sola, como si llevara su propio `COMMIT` detrás. La consecuencia práctica es la que importa: **ya no hay nada que deshacer**, porque no queda transacción abierta. Por eso, para agrupar varias sentencias en una unidad, hay que abrir la transacción explícitamente con `BEGIN`.
<!-- justificacion:fin -->

- [x] Aprobada

### 20 · m05#21

<!-- pregunta: json_2026#21 | just:7880fcc0158a -->

Si ejecutas ROLLBACK tras haber modificado 1000 filas sin hacer COMMIT, ¿qué pasa?

- `(a)` Se revierten solo las últimas 500 modificaciones por límite.
- `(b)` Las 1000 modificaciones se deshacen, dejando datos previos.  **← correcta**
- `(c)` La base de datos queda bloqueada en modo recuperación.
- `(d)` Solo se deshacen inserciones, dejando las actualizaciones.

<!-- justificacion:inicio -->
Se deshacen las 1000. `ROLLBACK` devuelve la base al estado en que estaba al empezar la transacción, sin límite de filas y sin distinguir entre inserciones, actualizaciones y borrados. Eso es la atomicidad en acción. Las otras tres inventan límites que no existen: ni un tope de 500, ni un modo de recuperación, ni un trato distinto según el tipo de sentencia.
<!-- justificacion:fin -->

- [x] Aprobada

### 21 · m05#22

<!-- pregunta: json_2026#22 | just:ad24be00c7f9 -->

¿Qué comando DDL vacía los datos de una tabla sin registrar cada fila en el log de transacciones?

- `(a)` DELETE ALL ROWS
- `(b)` DROP DATA
- `(c)` FORMAT TABLE
- `(d)` TRUNCATE TABLE  **← correcta**

<!-- justificacion:inicio -->
`TRUNCATE TABLE` vacía la tabla de una vez, sin escribir una entrada por fila en el log, y por eso es mucho más rápido que `DELETE` en tablas grandes. Conserva la estructura: la tabla sigue existiendo, vacía. Los otros tres comandos no existen. Conviene saber que suele reiniciar las secuencias asociadas si se le pide `RESTART IDENTITY`, cosa que `DELETE` nunca hace.
<!-- justificacion:fin -->

- [x] Aprobada

### 22 · m05#23

<!-- pregunta: json_2026#23 | just:e2dc431cb4d0 -->

En la creación de tablas, ¿qué restricción impide tajantemente ingresar valores repetidos?

- `(a)` CONSTRAINT NOT NULL
- `(b)` PRIMARY KEY o UNIQUE  **← correcta**
- `(c)` CONSTRAINT CHECK
- `(d)` CONSTRAINT FOREIGN KEY

<!-- justificacion:inicio -->
`PRIMARY KEY` y `UNIQUE` son las que impiden valores repetidos; la diferencia entre ambas es que la primaria además no admite nulos y solo puede haber una por tabla. `NOT NULL` obliga a que haya un valor pero no a que sea distinto; `CHECK` valida una condición sobre el valor; y `FOREIGN KEY` exige que el valor exista en otra tabla, que es lo contrario de impedir repeticiones.
<!-- justificacion:fin -->

- [x] Aprobada

### 23 · m05#24

<!-- pregunta: json_2026#24 | just:f44eb47a0b9f -->

¿Qué instrucción DDL se utiliza convencionalmente para modificar el tipo de dato de una columna?

- `(a)` ALTER TABLE ... ALTER COLUMN  **← correcta**
- `(b)` UPDATE TABLE ... SET COLUMN
- `(c)` MODIFY STRUCTURE ... COLUMN
- `(d)` CHANGE DATA TYPE ... ON TABLE

<!-- justificacion:inicio -->
La forma estándar es `ALTER TABLE tabla ALTER COLUMN columna TYPE nuevo_tipo`, y es la que usa PostgreSQL. Las otras tres no existen: `UPDATE` cambia datos y no estructura, que es la confusión que la (b) busca provocar. Ojo con algo que se pregunta poco y duele mucho: cambiar el tipo de una columna con datos dentro puede fallar si alguno no se puede convertir.
<!-- justificacion:fin -->

- [x] Aprobada

### 24 · m05#26

<!-- pregunta: json_2026#26 | just:69ac72663111 -->

¿Qué diferencia técnica crítica existe entre el comando DROP TABLE y TRUNCATE TABLE?

- `(a)` Ninguna, ambos comandos realizan la misma acción destructiva.
- `(b)` DROP requiere un filtro WHERE, TRUNCATE borra sin condición.
- `(c)` DROP elimina estructura y metadatos, TRUNCATE solo datos.  **← correcta**
- `(d)` TRUNCATE es un comando DML, mientras que DROP es puro DDL.

<!-- justificacion:inicio -->
`DROP TABLE` borra la tabla entera —datos, estructura, índices y metadatos—, y después de ejecutarlo la tabla ya no existe. `TRUNCATE TABLE` borra solo las filas y deja la tabla vacía y lista para recibir datos. La (d) invierte la clasificación: los dos son DDL, no uno de cada tipo. Y ninguno admite `WHERE`: para borrar con condición está `DELETE`.
<!-- justificacion:fin -->

- [x] Aprobada

### 25 · m05#27

<!-- pregunta: json_2026#27 | just:ff5fc5d11428 -->

Al agregar una restricción NOT NULL a una columna ya existente, ¿qué precondición debe cumplirse?

- `(a)` La columna debe haber sido definida como llave foránea.
- `(b)` La tabla no debe contener registros nulos en dicha columna.  **← correcta**
- `(c)` Todos los registros de la tabla deben estar inactivos.
- `(d)` La columna debe estar indexada como llave primaria antes.

<!-- justificacion:inicio -->
La columna no puede tener ningún `NULL` en las filas existentes: la restricción se valida contra los datos que ya están, y si alguno la incumple, la sentencia falla. La salida habitual es llenar esos huecos primero con un `UPDATE` y recién después agregar la restricción. Las otras tres inventan requisitos que no existen: ni ser llave foránea, ni estar indexada, ni el estado de los registros importan.
<!-- justificacion:fin -->

- [x] Aprobada

### 26 · m05#28

<!-- pregunta: json_2026#28 | just:d94219aad2af -->

¿Qué palabra reservada se emplea para asignar un valor fijo automático si este se omite al insertar?

- `(a)` AUTO_INSERT
- `(b)` FALLBACK_VAL
- `(c)` DEFAULT  **← correcta**
- `(d)` INITIAL_DATA

<!-- justificacion:inicio -->
`DEFAULT` fija el valor que toma la columna cuando la inserción no la menciona. Se declara al crear la tabla y evita tener que repetir el mismo valor en cada `INSERT`. Los otros tres nombres no existen. Conviene distinguirlo de `NOT NULL`: `DEFAULT` da un valor cuando falta, `NOT NULL` prohíbe que falte; juntos garantizan que la columna siempre tenga algo con sentido.
<!-- justificacion:fin -->

- [x] Aprobada

### 27 · m05#29

<!-- pregunta: json_2026#29 | just:472f005956c6 -->

En el modelo conceptual, ¿cómo se representa idealmente la capacidad de abstracción de un problema?

- `(a)` Mediante código encapsulado de clases y métodos de Java.
- `(b)` Mediante un diagrama Entidad-Relación y sus cardinalidades.  **← correcta**
- `(c)` Como un script de creación masiva de tablas DDL nativo.
- `(d)` A través de documentación en crudo en formato XML puro.

<!-- justificacion:inicio -->
El modelo conceptual se dibuja como un diagrama Entidad-Relación: entidades, sus atributos, las relaciones entre ellas y las cardinalidades. Es deliberadamente independiente del motor y hasta de si al final se usará una base relacional. Las otras tres saltan a la implementación —clases, DDL, XML—, que es justo lo que el modelo conceptual evita para poder discutirse con quien no programa.
<!-- justificacion:fin -->

- [x] Aprobada

### 28 · m05#30

<!-- pregunta: json_2026#30 | just:6912781cf92d -->

¿Qué característica define esencialmente a una "Entidad Fuerte" en el modelamiento conceptual?

- `(a)` Posee obligatoriamente atributos de tipo matriz anidada.
- `(b)` Su existencia es dependiente de otra entidad principal.
- `(c)` Tiene existencia propia e identificador único independiente.  **← correcta**
- `(d)` Se vincula de forma exclusiva mediante llaves foráneas.

<!-- justificacion:inicio -->
Una entidad fuerte existe por sí sola y se identifica con sus propios atributos, sin depender de otra. Su contraste es la entidad débil, que es la (b) y que necesita de una entidad dueña para existir e identificarse. Las otras dos describen cosas que no definen la fuerza de una entidad: ni los atributos compuestos ni las llaves foráneas tienen que ver con eso.
<!-- justificacion:fin -->

- [x] Aprobada

### 29 · m05#31

<!-- pregunta: json_2026#31 | just:a236475e32b9 -->

¿Cómo se resuelve una relación "Muchos a Muchos" (N:M) al transformar al modelo relacional?

- `(a)` Insertando una clave foránea en la tabla más pequeña del modelo.
- `(b)` Creando una entidad intermedia que contenga ambas llaves.  **← correcta**
- `(c)` Almacenando los datos múltiples en un formato de texto largo.
- `(d)` Fusionando ambas entidades fuertes en una sola gran tabla unida.

<!-- justificacion:inicio -->
Una relación N:M no se puede representar con una llave foránea en ninguno de los dos lados, porque cada fila admitiría un solo valor. Se resuelve creando una **tabla intermedia** cuyas filas son los pares, con las llaves foráneas de las dos entidades formando su clave. Además de resolver el problema, esa tabla es el sitio natural para los atributos que pertenecen a la relación y no a las entidades.
<!-- justificacion:fin -->

- [x] Aprobada

### 30 · m05#32

<!-- pregunta: json_2026#32 | just:b417224a6514 -->

¿Qué condición principal exige la Primera Forma Normal (1FN) al aplicarla en una tabla relacional?

- `(a)` La ausencia absoluta de claves foráneas hacia otras tablas.
- `(b)` La dependencia transitiva de todos los atributos descriptivos.
- `(c)` Que cada columna contenga valores atómicos (indivisibles).  **← correcta**
- `(d)` La existencia estricta de al menos dos llaves candidatas.

<!-- justificacion:inicio -->
La Primera Forma Normal pide que cada celda contenga un valor **atómico**: nada de listas, ni campos con varios datos separados por comas, ni grupos repetidos de columnas como `telefono1`, `telefono2`. Es la condición que hace posibles las demás: sin valores atómicos no se puede hablar de dependencias funcionales. La (b) describe justamente lo que la Tercera Forma Normal viene a eliminar.
<!-- justificacion:fin -->

- [x] Aprobada

### 31 · m05#33

<!-- pregunta: json_2026#33 | just:76e5c3de2a0a -->

¿Qué tipo de dependencia se busca erradicar para alcanzar la Tercera Forma Normal (3FN)?

- `(a)` La dependencia funcional parcial respecto a llaves compuestas.
- `(b)` Dependencias transitivas lógicas entre atributos no clave.  **← correcta**
- `(c)` Las asociaciones lógicas circulares entre entidades débiles.
- `(d)` Los atributos heredados a partir de funciones trigonométricas.

<!-- justificacion:inicio -->
La Tercera Forma Normal elimina las **dependencias transitivas**: un atributo no clave que depende de otro atributo no clave en vez de depender de la clave. El caso de manual es guardar `codigo_ciudad` y `nombre_ciudad` en la tabla de personas — el nombre depende del código, no de la persona, y por eso se repite y se puede contradecir. La (a) describe lo que resuelve la Segunda Forma Normal.
<!-- justificacion:fin -->

- [x] Aprobada

### 32 · m05#34

<!-- pregunta: json_2026#34 | just:7938ee612771 -->

¿Qué concepto representa fundamentalmente la cardinalidad en un modelo Entidad-Relación (MER)?

- `(a)` El límite máximo de ocupación en bytes de cada registro guardado.
- `(b)` El número de ocurrencias lógicas de una entidad vinculada a otra.  **← correcta**
- `(c)` El tipo de dato primitivo asociado explícitamente a una llave foránea.
- `(d)` La suma total e inflexible de columnas que la tabla puede alojar.

<!-- justificacion:inicio -->
La cardinalidad dice cuántas ocurrencias de una entidad pueden vincularse con una de la otra: uno a uno, uno a muchos, muchos a muchos. Es lo que decide cómo se traduce la relación al modelo relacional — dónde va la llave foránea, o si hace falta una tabla intermedia. No tiene nada que ver con el tamaño en bytes, ni con tipos de dato, ni con el número de columnas.
<!-- justificacion:fin -->

- [x] Aprobada

### 33 · m05#35

<!-- pregunta: json_2026#35 | just:27097068d0ea -->

¿Por qué razón técnica de arquitectura podría llegar a justificarse una desnormalización de datos?

- `(a)` Para satisfacer los exigentes requisitos de la forma Boyce-Codd.
- `(b)` Para reducir el tamaño total de toda la base de datos en el disco.
- `(c)` Para optimizar el rendimiento y lectura de consultas muy repetitivas.  **← correcta**
- `(d)` Para prevenir la inserción maliciosa de valores nulos indeseados.

<!-- justificacion:inicio -->
Se desnormaliza para que ciertas consultas dejen de pagar el costo de muchos `JOIN`, duplicando a propósito datos que la normalización había separado. Es una decisión de rendimiento, tomada a sabiendas y con una contrapartida clara: vuelven las anomalías de actualización y hay que mantener la copia. Por eso se hace después de medir, no por adelantado, y nunca para ahorrar espacio — de hecho ocupa más.
<!-- justificacion:fin -->

- [x] Aprobada

### 34 · m05#36

<!-- pregunta: json_2026#36 | just:d00dd8e3eb84 -->

¿Qué herramienta o documento consolida los metadatos y definiciones del modelo de base de datos?

- `(a)` El plan de ejecución visual de consultas nativo del motor.
- `(b)` El Diccionario de Datos del sistema unificado de información.  **← correcta**
- `(c)` El log binario transaccional del servidor (archivos pg_xlog).
- `(d)` El archivo de volcado y compresión del esquema (database dump).

<!-- justificacion:inicio -->
El diccionario de datos reúne las definiciones formales del modelo: qué tablas hay, qué columnas, de qué tipo, con qué restricciones y qué significa cada una. Es la referencia que permite entender la base sin abrirla. Las otras tres son artefactos reales del motor con otro oficio: el plan de ejecución explica una consulta, el log registra transacciones, y un volcado es una copia.
<!-- justificacion:fin -->

- [x] Aprobada

### 35 · m05#37

<!-- pregunta: json_2026#37 | just:95b669c70ac1 -->

Al transformar una entidad débil al modelo relacional, ¿cómo se compone su llave primaria final?

- `(a)` Uniendo la llave de la entidad fuerte de la que depende con su propio ID.  **← correcta**
- `(b)` Creando y asignando un identificador global único e independiente.
- `(c)` Omitiendo usar llaves primarias por diseño de esquema relacional.
- `(d)` Replicando exactamente todos los atributos de la entidad dominante.

<!-- justificacion:inicio -->
La clave de una entidad débil se forma **uniendo la clave de la entidad fuerte de la que depende con su propio atributo discriminante**, porque por sí sola no distingue sus ocurrencias. Es lo que traduce al modelo relacional la dependencia de existencia: la fila no puede existir sin su dueña, y el motor lo hace cumplir con la llave foránea que forma parte de esa clave compuesta.
<!-- justificacion:fin -->

- [x] Aprobada

### 36 · m05#38

<!-- pregunta: json_2026#38 | just:aa998342633a -->

¿Cuál es el objetivo técnico primordial al aplicar el proceso de normalización en una base de datos?

- `(a)` Acelerar radicalmente las operaciones DML sacrificando consistencia.
- `(b)` Minimizar drásticamente la redundancia y erradicar anomalías de datos.  **← correcta**
- `(c)` Transformar arquitecturas SQL estrictas en modelos NoSQL de grafos.
- `(d)` Borrar lógicamente el uso de FOREIGN KEY para liberar CPU y memoria.

<!-- justificacion:inicio -->
La normalización busca guardar cada dato **una sola vez**, y con eso desaparecen las anomalías de inserción, actualización y borrado — los casos en que cambiar un dato en un sitio y no en otro deja la base contradiciéndose. El precio es más tablas y más `JOIN`, que es exactamente lo que la desnormalización revierte cuando el rendimiento lo justifica. La (a) describe el intercambio al revés.
<!-- justificacion:fin -->

- [x] Aprobada

### 37 · m05#39

<!-- pregunta: json_2026#39 | just:24ca5c650c74 -->

En el contexto de un modelo relacional estricto, ¿qué concepto matemático fundamenta a las tablas?

- `(a)` Topologías complejas derivadas de árboles binarios asimétricos.
- `(b)` Relaciones lógicas entre conjuntos estructurados y sus dominios.  **← correcta**
- `(c)` Algoritmos heurísticos de agrupamiento en estructuras difusas.
- `(d)` Tensores multidimensionales definidos por matrices ortogonales.

<!-- justificacion:inicio -->
El modelo relacional se apoya en la teoría de conjuntos: una tabla **es** una relación matemática, un subconjunto del producto cartesiano de los dominios de sus columnas, y cada fila es una tupla. De ahí viene que el orden de las filas no signifique nada y que las operaciones —unión, intersección, diferencia, producto— tengan definición formal. Es lo que separa a SQL de manipular archivos.
<!-- justificacion:fin -->

- [x] Aprobada

### 38 · m05#40

<!-- pregunta: json_2026#40 | just:ba1fbd0f6e2c -->

En el diseño de un modelo conceptual, ¿qué es y qué implica un atributo denominado "derivado"?

- `(a)` Una llave alfanumérica de auditoría impuesta por el motor SQL central.
- `(b)` Un dato que no se almacena porque su valor se calcula a partir de otros.  **← correcta**
- `(c)` Una variable foránea que modifica su origen dependiendo de los accesos.
- `(d)` Un registro replicado a partir de una tabla maestra del sistema matriz.

<!-- justificacion:inicio -->
Un atributo derivado **no se guarda**: su valor se calcula cuando hace falta, a partir de otros que sí están. La edad a partir de la fecha de nacimiento es el ejemplo clásico, y muestra el motivo: guardarla obligaría a actualizarla, y quedaría mal el día que nadie lo hiciera. En el diagrama se dibuja con línea punteada, y al implementar se resuelve con una columna calculada o con una vista.
<!-- justificacion:fin -->

- [x] Aprobada

### 39 · M5-1

<!-- pregunta: js_2026#1 | just:8d7d55f55440 -->

¿Cuál es el propósito principal del "journaling" o registro de transacciones en un RDBMS?

- `(a)` Optimizar la velocidad de lectura de las tablas indexadas.
- `(b)` Evitar la fragmentación del disco duro del servidor web.
- `(c)` Garantizar la recuperación ante fallos y la durabilidad.  **← correcta**
- `(d)` Encriptar automáticamente las contraseñas de los usuarios.

<!-- justificacion:inicio -->
El registro de transacciones anota lo que se va a cambiar **antes** de cambiarlo, así que tras una caída el motor puede rehacer lo confirmado y deshacer lo que quedó a medias. Es lo que sostiene la **durabilidad** y la atomicidad de ACID, no una optimización de lectura. Las otras tres describen oficios ajenos: la velocidad de lectura la dan los índices, y el cifrado de contraseñas es cosa de la aplicación.
<!-- justificacion:fin -->

- [x] Aprobada

### 40 · M5-2

<!-- pregunta: js_2026#2 | just:d558a4074485 -->

¿Qué tipo de JOIN devuelve todas las filas de la tabla izquierda y las coincidencias de la derecha?

- `(a)` INNER JOIN
- `(b)` LEFT OUTER JOIN  **← correcta**
- `(c)` RIGHT OUTER JOIN
- `(d)` FULL OUTER JOIN

<!-- justificacion:inicio -->
`LEFT OUTER JOIN` —o `LEFT JOIN`, que es lo mismo— conserva todas las filas de la izquierda y agrega las coincidencias de la derecha, rellenando con `NULL` donde no las hay. `RIGHT` hace lo simétrico, `FULL` conserva los dos lados, e `INNER` se queda solo con lo que casa. La palabra `OUTER` es opcional en los tres y no cambia nada: lo que manda es el lado.
<!-- justificacion:fin -->

- [x] Aprobada

### 41 · M5-3

<!-- pregunta: js_2026#3 | just:cbe31902ca9f -->

¿Qué cláusula SQL permite filtrar los resultados resultantes de una función de agrupación como SUM()?

- `(a)` WHERE
- `(b)` ORDER BY
- `(c)` HAVING  **← correcta**
- `(d)` GROUP FILTER

<!-- justificacion:inicio -->
`HAVING` filtra **después** de agrupar, y por eso puede usar funciones agregadas: `HAVING SUM(total) > 1000`. `WHERE` filtra antes, cuando los grupos todavía no existen, así que ahí un `SUM()` no tiene sentido y el motor lo rechaza. Ésa es toda la diferencia y es de las que más se preguntan. `GROUP FILTER` no existe, y `ORDER BY` ordena, no filtra.
<!-- justificacion:fin -->

- [x] Aprobada

### 42 · M5-4

<!-- pregunta: js_2026#4 | just:dd99c0c16781 -->

¿Qué ocurre si omites la condición de unión (ON o WHERE) al realizar una consulta a múltiples tablas?

- `(a)` La consulta produce un producto cartesiano (Cross Join).  **← correcta**
- `(b)` El motor asume un INNER JOIN por la clave primaria.
- `(c)` La base de datos arroja un error de sintaxis bloqueante.
- `(d)` Solo se devuelven las filas de la primera tabla listada.

<!-- justificacion:inicio -->
Sin condición que las una, el motor combina **cada fila de una tabla con cada fila de la otra**: el producto cartesiano. Con dos tablas de mil filas salen un millón, y por eso el síntoma clásico es una consulta que devuelve muchísimo más de lo esperado **sin dar ningún error**, que es lo que la vuelve peligrosa. Conviene saber que esto ocurre con la sintaxis de coma —`FROM a, b`— y que escribir `FROM a JOIN b` sin su `ON` es distinto: ahí el motor sí protesta. Ésa es una razón práctica para preferir siempre la sintaxis explícita con `JOIN ... ON`: convierte un olvido silencioso en un error inmediato.
<!-- justificacion:fin -->

- [x] Aprobada

### 43 · M5-5

<!-- pregunta: js_2026#5 | just:927021168394 -->

En sentencias DML, ¿qué comando deshace los cambios no confirmados de la transacción actual en curso?

- `(a)` UNDO TRANSACTION
- `(b)` DROP COMMIT
- `(c)` ROLLBACK  **← correcta**
- `(d)` REVERT STATE

<!-- justificacion:inicio -->
`ROLLBACK` descarta todos los cambios de la transacción en curso y deja la base como estaba al empezarla. Es la contraparte de `COMMIT` y lo que hace útil una transacción: poder equivocarse sin consecuencias mientras no se confirme. Los otros tres nombres no existen en SQL. Si hay `SAVEPOINT` declarados, se puede volver a uno de ellos en vez de deshacerlo todo.
<!-- justificacion:fin -->

- [x] Aprobada

### 44 · M5-6

<!-- pregunta: js_2026#6 | just:8497ddd4e060 -->

¿Qué comando DDL se utiliza para eliminar completamente la estructura de una tabla y sus datos?

- `(a)` TRUNCATE TABLE
- `(b)` DELETE TABLE
- `(c)` DROP TABLE  **← correcta**
- `(d)` REMOVE TABLE

<!-- justificacion:inicio -->
`DROP TABLE` elimina la tabla completa: sus filas, su estructura, sus índices y sus restricciones. Después de ejecutarlo la tabla no existe y volver a usarla exige crearla de nuevo. `TRUNCATE` deja la tabla vacía pero viva, y `DELETE` borra filas con o sin condición; `DELETE TABLE` y `REMOVE TABLE` no existen. Conviene tener presente que `DROP` de una tabla referenciada por otras puede fallar por las llaves foráneas.
<!-- justificacion:fin -->

- [x] Aprobada

### 45 · M5-7

<!-- pregunta: js_2026#7 | just:f7e33f3a23ac -->

¿Qué restricción DDL asegura la integridad referencial obligando a que el valor exista en otra tabla?

- `(a)` UNIQUE CONSTRAINT
- `(b)` PRIMARY KEY
- `(c)` FOREIGN KEY  **← correcta**
- `(d)` CHECK CONSTRAINT

<!-- justificacion:inicio -->
`FOREIGN KEY` obliga a que el valor exista en la tabla referenciada, y es lo que sostiene la integridad referencial: impide dejar filas apuntando a algo que no está. Las otras tres restringen dentro de la propia tabla — `UNIQUE` prohíbe repetidos, `PRIMARY KEY` identifica, y `CHECK` valida una condición—. Además define qué pasa al borrar o actualizar el original, con `ON DELETE CASCADE` y sus variantes.
<!-- justificacion:fin -->

- [x] Aprobada

### 46 · M5-8

<!-- pregunta: js_2026#8 | just:ea6673dea671 -->

A diferencia de DELETE, ¿por qué la sentencia TRUNCATE TABLE suele ser más rápida y eficiente?

- `(a)` Porque elimina todo sin generar logs individuales por fila.  **← correcta**
- `(b)` Porque borra la estructura sin afectar a los datos reales.
- `(c)` Porque se ejecuta en memoria caché y no en el disco físico.
- `(d)` Porque solo borra temporalmente mediante un alias de vista.

<!-- justificacion:inicio -->
`TRUNCATE` no borra fila por fila: descarta el contenido de la tabla de una vez, sin escribir una entrada por registro en el log de transacciones. Ahí está toda la diferencia de velocidad con `DELETE`. El precio es la contrapartida que hay que conocer: al no quedar registro fila a fila, no se puede deshacer con la misma facilidad, y no dispara los disparadores de borrado.
<!-- justificacion:fin -->

- [x] Aprobada

### 47 · M5-9

<!-- pregunta: js_2026#9 | just:26954ca67963 -->

En el modelamiento conceptual, ¿cómo se denomina a una entidad cuya existencia depende de otra entidad?

- `(a)` Entidad Abstracta
- `(b)` Entidad Débil  **← correcta**
- `(c)` Entidad Polimórfica
- `(d)` Entidad Recursiva

<!-- justificacion:inicio -->
Una entidad débil no tiene existencia propia: depende de otra para existir y para identificarse, así que su clave incluye la de la entidad fuerte. El ejemplo típico es el detalle de una factura, que no significa nada sin su factura. Los otros tres nombres suenan plausibles y no son categorías del modelo Entidad-Relación; «recursiva» describe una relación de una entidad consigo misma, que es otra cosa.
<!-- justificacion:fin -->

- [x] Aprobada

### 48 · M5-10

<!-- pregunta: js_2026#10 | just:bf0c2c6f727f -->

¿Cuál es el objetivo principal de aplicar la Tercera Forma Normal (3FN) a una base de datos relacional?

- `(a)` Permitir la creación ilimitada de llaves foráneas.
- `(b)` Acelerar el procesamiento de los JOINs en consultas lentas.
- `(c)` Eliminar redundancias y dependencias transitivas de datos.  **← correcta**
- `(d)` Cifrar automáticamente todas las contraseñas almacenadas.

<!-- justificacion:inicio -->
La Tercera Forma Normal elimina las dependencias transitivas —atributos no clave que dependen de otros atributos no clave— y con ellas la redundancia que producen. El resultado es que cada dato vive en un solo sitio y no puede contradecirse. La (b) dice justo lo contrario de lo que ocurre: normalizar suele agregar `JOIN`, no quitarlos, y ése es el intercambio que la desnormalización revierte.
<!-- justificacion:fin -->

- [x] Aprobada

### 49 · M5-11

<!-- pregunta: js_2026#11 | just:5ececce2b3ed -->

¿Qué elemento central documenta formalmente las tablas, atributos, tipos de datos y sus restricciones?

- `(a)` El mapa conceptual físico.
- `(b)` El diccionario de datos.  **← correcta**
- `(c)` El log de transacciones.
- `(d)` El árbol de dependencias.

<!-- justificacion:inicio -->
El diccionario de datos es el documento que formaliza qué hay en la base: tablas, atributos, tipos y restricciones, con el significado de cada uno. Sirve para que alguien entienda el modelo sin tener que deducirlo del DDL. Las otras tres son piezas reales con otro oficio: el log registra transacciones, y ni un mapa físico ni un árbol de dependencias documentan tipos ni restricciones.
<!-- justificacion:fin -->

- [x] Aprobada

---

## Lo que este documento no puede decidir

- **Si las justificaciones son ciertas.** Que existan se comprueba con un
  programa; que sean correctas no. Por eso las lees tú.
- **La dificultad.** Va `NULL` en las 52, y así se cargan. Asignarla sería
  inventar el segundo campo, que es lo que costó descartar el trabajo anterior.
  Si la quieres, es una pasada editorial aparte.

