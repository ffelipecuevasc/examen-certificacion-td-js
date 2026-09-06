-- Retira el contenido hostil de d1/prueba-escapado.sql.
--
-- Las alternativas caen solas por ON DELETE CASCADE, pero se borran igual: si
-- algun dia esa clausula se cae del esquema, este archivo no se entera y el
-- borrado tiene que seguir siendo completo.

DELETE FROM alternativa WHERE pregunta_id = 900;
DELETE FROM pregunta WHERE id = 900;

-- Devuelve el icono del modulo 2 al valor que le pone la migracion.
UPDATE modulo SET icono = 'devices' WHERE numero = 2;
