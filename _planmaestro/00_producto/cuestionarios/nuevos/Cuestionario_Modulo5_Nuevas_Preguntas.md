# Cuestionario de Evaluación - Módulo 5: Fundamentos de Bases de Datos Relacionales (Nuevas Preguntas)

1. ¿Qué componente interno de un RDBMS evita fallos de consistencia por accesos simultáneos?
a) El indexador jerárquico.
b) El gestor de concurrencia y bloqueos.
c) El recolector de basura de memoria.
d) El optimizador de consultas heurístico.
Respuesta: b) El gestor de concurrencia y bloqueos.

2. ¿Qué ventaja técnica confiere la propiedad de "independencia lógica" en una base relacional?
a) Cambiar el hardware físico sin afectar la velocidad.
b) Modificar esquemas lógicos sin reescribir aplicaciones.
c) Compilar datos SQL directamente en lenguaje máquina.
d) Eliminar la necesidad de usar respaldos diarios.
Respuesta: b) Modificar esquemas lógicos sin reescribir aplicaciones.

3. ¿Qué mecanismo vital de recuperación emplean los RDBMS para mitigar apagones repentinos?
a) Registro en el log de transacciones (Write-Ahead Logging).
b) Duplicación sincrónica en RAM de todo el esquema.
c) Cierre forzado del protocolo TCP/IP de red.
d) Bloqueo total preventivo de lecturas asíncronas.
Respuesta: a) Registro en el log de transacciones (Write-Ahead Logging).

4. ¿Qué modelo lógico utilizan internamente los RDBMS estándar para organizar sus registros?
a) Colecciones puras de documentos JSON anidados.
b) Grafos cíclicos con nodos y aristas directas.
c) Estructuras tabulares planas de filas y columnas.
d) Matrices vectoriales de múltiples dimensiones.
Respuesta: c) Estructuras tabulares planas de filas y columnas.

5. ¿Qué operador lógico SQL combina el resultado de dos consultas descartando filas repetidas?
a) MERGE SET
b) UNION
c) JOIN ALL
d) CONCAT ROWS
Respuesta: b) UNION

6. Al cruzar dos tablas de 10 y 5 registros con CROSS JOIN, ¿cuántas filas genera el set final?
a) 5 filas exactas.
b) 15 filas sumadas.
c) 50 filas (producto cartesiano).
d) 10 filas (límite del mayor).
Respuesta: c) 50 filas (producto cartesiano).

7. ¿Qué función de agregación SQL se emplea para obtener el promedio aritmético de una columna?
a) MEAN()
b) MEDIAN()
c) SUM()
d) AVG()
Respuesta: d) AVG()

8. ¿Qué operador condicional evalúa de forma estándar y correcta la ausencia de valor en SQL?
a) == NULL
b) IS NULL
c) EQUALS EMPTY
d) = ""
Respuesta: b) IS NULL

9. ¿Cómo se comporta internamente la función agregada `COUNT(columna)` ante valores nulos?
a) Lanza un error de evaluación aritmética en ejecución.
b) Asigna valor cero a los nulos y los suma al total.
c) Ignora los nulos y cuenta solo registros existentes.
d) Detiene el conteo en el primer nulo que encuentra.
Respuesta: c) Ignora los nulos y cuenta solo registros existentes.

10. ¿Qué tipo de combinación JOIN devuelve todas las filas de la tabla derecha aunque no haya cruce?
a) RIGHT OUTER JOIN
b) LEFT INNER JOIN
c) FULL OUTER JOIN
d) CROSS RIGHT JOIN
Respuesta: a) RIGHT OUTER JOIN

11. ¿Qué predicado lógico retorna verdadero solo si "todos" los valores de una subconsulta cumplen?
a) ANY
b) EXISTS
c) ALL
d) IN
Respuesta: c) ALL

12. En el operador LIKE, ¿qué comodín reemplaza dinámicamente a un único carácter en la búsqueda?
a) El asterisco (*)
b) El signo de porcentaje (%)
c) El símbolo de exclamación (!)
d) El guion bajo (_)
Respuesta: d) El guion bajo (_)

13. ¿Qué técnica SQL estándar sirve para concatenar columnas de texto en el resultado del SELECT?
a) Operador +
b) Operador || o función CONCAT
c) Operador &
d) Función JOIN_TEXT
Respuesta: b) Operador || o función CONCAT

14. ¿Qué cláusula procesa la paginación limitando la cantidad de registros devueltos por la BD?
a) MAXIMUM
b) ROW_LIMIT
c) TOP_ROWS
d) LIMIT junto con OFFSET
Respuesta: d) LIMIT junto con OFFSET

15. ¿Qué cláusula define el ordenamiento explícito, ascendente o descendente, de los resultados?
a) SORT BY
b) ORDER BY
c) ARRANGE BY
d) GROUP BY
Respuesta: b) ORDER BY

16. ¿Qué instrucción devuelve inmediatamente los datos de una fila que acaba de ser insertada (DML)?
a) Cláusula RETURNING
b) Cláusula GET_NEW
c) Función LAST_INSERT_ID()
d) Comando ECHO_ROW
Respuesta: a) Cláusula RETURNING

17. Si una transacción en curso pierde la conexión de red súbitamente, ¿cómo reacciona el motor?
a) Congela la transacción indefinidamente.
b) Confirma (COMMIT) los datos parciales por seguridad.
c) Ejecuta un ROLLBACK automático limpiando fallos.
d) Genera un volcado de memoria (Dump) en el servidor.
Respuesta: c) Ejecuta un ROLLBACK automático limpiando fallos.

18. En concurrencia, ¿qué es un estado de "Deadlock" (abrazo mortal) entre dos transacciones?
a) Un bloqueo mutuo infinito que requiere abortar uno.
b) Una sobreescritura de datos sin previa confirmación.
c) Una caída repentina de latencia en la red local.
d) El agotamiento total del pool de conexiones activas.
Respuesta: a) Un bloqueo mutuo infinito que requiere abortar uno.

19. ¿Qué nivel de aislamiento transaccional es el más inseguro y permite "lecturas sucias"?
a) Serializable
b) Read Uncommitted
c) Read Committed
d) Repeatable Read
Respuesta: b) Read Uncommitted

20. En el comando UPDATE, ¿qué ocurre si omites accidentalmente el uso de la cláusula WHERE?
a) Falla la sintaxis y se detiene.
b) Actualiza únicamente el primer registro que encuentra.
c) El motor pide confirmación manual de seguridad.
d) Se actualizan incondicionalmente todos los registros.
Respuesta: d) Se actualizan incondicionalmente todos los registros.

21. ¿Qué comando genera una marca de retorno parcial segura dentro de una transacción en curso?
a) ROLLBACK_POINT
b) BREAKPOINT
c) SAVEPOINT
d) COMMIT_MARK
Respuesta: c) SAVEPOINT

22. ¿En qué escenario técnico es mandatorio encapsular consultas SQL en un bloque BEGIN/COMMIT?
a) Al realizar múltiples consultas SELECT en simultáneo.
b) Al alterar la configuración visual de la consola.
c) Al crear índices en tablas sin llaves foráneas.
d) Al aplicar múltiples DML interdependientes lógicamente.
Respuesta: d) Al aplicar múltiples DML interdependientes lógicamente.

23. En PostgreSQL, ¿qué cláusula de inserción resuelve conflictos actualizando si la clave existe?
a) ON DUPLICATE KEY UPDATE
b) MERGE INTO EXISTS
c) ON CONFLICT DO UPDATE
d) INSERT OR REPLACE SET
Respuesta: c) ON CONFLICT DO UPDATE

24. ¿Qué riesgo de rendimiento hay al hacer COMMIT dentro de un bucle por cada fila insertada?
a) Degrada el rendimiento drásticamente por excesos de I/O.
b) Agota el espacio de almacenamiento del disco duro local.
c) Elimina las restricciones de llave foránea accidentalmente.
d) Reinicia el contador de las llaves primarias seriales.
Respuesta: a) Degrada el rendimiento drásticamente por excesos de I/O.

25. ¿Qué atributo DDL se emplea para crear un índice manual que acelere las búsquedas por columna?
a) SET INDEX ON
b) ALTER TABLE INDEX
c) GENERATE SEARCH_KEY
d) CREATE INDEX
Respuesta: d) CREATE INDEX

26. ¿Qué regla paramétrica de FOREIGN KEY elimina en cascada las filas hijas al borrar el padre?
a) ON DELETE DESTROY
b) ON DELETE CASCADE
c) ON UPDATE REMOVE
d) CASCADE CHILD ROWS
Respuesta: b) ON DELETE CASCADE

27. ¿Qué comando DDL renombra estructuralmente una tabla sin alterar sus registros internos?
a) ALTER TABLE ... RENAME TO
b) UPDATE TABLE ... SET NAME
c) CHANGE TABLE ... AS
d) MODIFY TABLE ... NEW NAME
Respuesta: a) ALTER TABLE ... RENAME TO

28. ¿Qué restricción lógica DDL valida que los valores de una columna cumplan una regla booleana?
a) VERIFY
b) CONDITION
c) RULE
d) CHECK
Respuesta: d) CHECK

29. ¿Qué comando DDL destruye una tabla forzando además el borrado de vistas que dependan de ella?
a) DROP TABLE ... CASCADE
b) DELETE TABLE ... FORCE
c) TRUNCATE TABLE ... ALL
d) REMOVE TABLE ... DEPENDENTS
Respuesta: a) DROP TABLE ... CASCADE

30. ¿Qué tipo de dato SQL preserva precisión decimal exacta, siendo ideal para datos monetarios?
a) FLOAT4
b) DOUBLE PRECISION
c) NUMERIC o DECIMAL
d) REAL
Respuesta: c) NUMERIC o DECIMAL

31. ¿Qué regla teórica impone la "Integridad de Entidad" sobre las tablas relacionales?
a) La llave primaria no puede contener componentes nulos.
b) Todas las tablas deben vincularse por una llave foránea.
c) No puede haber más de tres índices por cada entidad.
d) Los nombres de columna deben ser únicos en la base.
Respuesta: a) La llave primaria no puede contener componentes nulos.

32. ¿Cómo se denomina a la restricción FK que pospone su validación hasta el COMMIT final?
a) Restricción Asíncrona.
b) Restricción Pospuesta (Postponed).
c) Restricción Diferida (Deferred).
d) Restricción Lenta (Lazy).
Respuesta: c) Restricción Diferida (Deferred).

33. En notación original de Peter Chen para el modelo ER, ¿qué símbolo representa una relación?
a) Un rectángulo.
b) Un óvalo.
c) Un rombo.
d) Un cilindro.
Respuesta: c) Un rombo.

34. En modelado de datos, ¿cómo se le llama a una llave candidata no elegida como clave principal?
a) Llave subyacente.
b) Llave foránea.
c) Llave alterna.
d) Llave compuesta.
Respuesta: c) Llave alterna.

35. ¿Qué tipo de dependencia asume una entidad débil que requiere otra dominante para existir?
a) Dependencia transitiva estricta.
b) Dependencia total de identificación (existencia).
c) Dependencia parcial de clave múltiple.
d) Dependencia funcional circular.
Respuesta: b) Dependencia total de identificación (existencia).

36. En normalización relacional, ¿qué prohíbe la Segunda Forma Normal (2FN) en sus tablas?
a) Las dependencias funcionales parciales hacia la llave.
b) La inserción masiva de valores booleanos puros.
c) Que la tabla carezca de un índice clúster nativo.
d) La herencia múltiple de atributos entre dos entidades.
Respuesta: a) Las dependencias funcionales parciales hacia la llave.

37. En modelamiento abstracto, ¿qué exige hacer un atributo "multivaluado" al normalizar la base?
a) Comprimirlo usando codificación Base64 en un texto.
b) Dividirlo en múltiples columnas consecutivas (val1, val2).
c) Ignorarlo temporalmente hasta alcanzar la cuarta normal.
d) Separarlo trasladándolo a una nueva tabla relacionada.
Respuesta: d) Separarlo trasladándolo a una nueva tabla relacionada.

38. En el diccionario de datos documental, ¿qué metadato es indispensable registrar de un atributo?
a) Su tipo de dato físico, longitud y restricciones fijas.
b) El nombre del administrador que creó dicha columna.
c) La cantidad exacta de memoria RAM que usará en servidor.
d) La contraseña de cifrado del motor relacional interno.
Respuesta: a) Su tipo de dato físico, longitud y restricciones fijas.

39. ¿Qué se persigue teóricamente al aplicar la Forma Normal de Boyce-Codd (FNBC) en un diseño?
a) Que todo determinante sea estrictamente una llave candidata.
b) Que cada tabla tenga al menos tres llaves foráneas.
c) Eliminar por completo el uso de índices de búsqueda.
d) Reducir la cardinalidad general a relaciones Uno a Uno.
Respuesta: a) Que todo determinante sea estrictamente una llave candidata.

40. ¿Qué propiedad estructural califica idealmente a un atributo para fungir como Primary Key (PK)?
a) Ser altamente descriptivo, como un nombre completo.
b) Ser un valor numérico flotante en constante alteración.
c) Ser único, atómico e invariante en el tiempo.
d) Ser una cadena de texto larga opcional (nullable).
Respuesta: c) Ser único, atómico e invariante en el tiempo.
