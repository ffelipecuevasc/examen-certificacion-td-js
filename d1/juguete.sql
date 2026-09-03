-- Tabla de juguete de la iteracion 12.
--
-- Sirve para una sola cosa: probar que la conexion entre las funciones y D1
-- funciona de verdad, antes de que exista un esquema que pueda estar mal
-- disenado. Se aplica igual en local y en produccion, y se borra cuando el banco
-- real ocupe su lugar.
--
-- El esquema del banco de preguntas NO se escribe aca: es la iteracion 21, y va
-- con migraciones versionadas.
--
-- Aplicar en local:      npm run datos:esquema
-- Aplicar en produccion: el comando completo esta en 90-manual/, y lo ejecuta el
--                        autor. No hay alias de npm para eso a proposito: este
--                        archivo empieza con un DROP TABLE.

DROP TABLE IF EXISTS prueba_tuberia;

CREATE TABLE prueba_tuberia (
  id             INTEGER PRIMARY KEY,
  clave          TEXT NOT NULL UNIQUE,
  valor          TEXT NOT NULL,
  actualizado_en TEXT NOT NULL
);

INSERT INTO prueba_tuberia (id, clave, valor, actualizado_en) VALUES
  (1, 'saludo',  'La tuberia hasta D1 funciona.',        '2026-09-03'),
  (2, 'entorno', 'Cambia este valor para comprobar que el dato no esta fijo en el codigo.', '2026-09-03');
