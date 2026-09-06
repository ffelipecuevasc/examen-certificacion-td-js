-- Migracion 002 - Modificacion de preguntas
-- Iteracion 23
-- Agrega columna fecha_modificacion. 

ALTER TABLE pregunta ADD COLUMN fecha_modificacion TEXT;
