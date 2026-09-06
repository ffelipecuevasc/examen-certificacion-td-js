-- Contenido hostil de prueba para el guardian del escapado.
--
-- Lo carga scripts/probar-escapado.mjs, que despues lo retira. No es contenido
-- del banco: es el ataque contra el que el escapado tiene que sostenerse, y vive
-- versionado para que la prueba se pueda repetir en vez de reescribirse a mano.
--
-- La pregunta usa el id 900, muy por encima de cualquier id real, para que no
-- choque con el banco y para que se reconozca de un vistazo si alguna vez queda
-- olvidada en una base.
--
-- POR QUE ESTOS CUATRO Y NO OTROS
--
--   A · <script> es el que todo el mundo prueba, y NO es el peligroso: insertado
--       con innerHTML no se ejecuta nunca, lo diga el escapado o no.
--   B · <img onerror> SI se ejecuta al insertarse con innerHTML. Es el que de
--       verdad importa, y es el que nadie escribe cuando piensa en «inyeccion».
--   C · <svg onload> igual que el anterior, por si algun dia se filtran
--       etiquetas por lista en vez de escapar.
--   D · rompe el atributo desde dentro: si el escapado no cubriera la comilla
--       doble, este convierte un atributo en otro.
--   E · el icono del modulo, que es el UNICO dato de la base que se dibuja
--       dentro de un atributo HTML y no como texto. Es el caso que el escapado
--       de texto no cubre por si solo, y el que se olvida al revisar.

DELETE FROM pregunta WHERE id = 900;

INSERT INTO pregunta (id, modulo, origen, numero_origen, enunciado, justificacion, dificultad, orden_fijo, estado)
VALUES (900, 2, 'json_2026', 900,
  'Payload A: <script>window.__ejecuto_script = true;</script> y una etiqueta <div> normal',
  'Fila de prueba del escapado. La carga y la retira scripts/probar-escapado.mjs.',
  'media', 0, 'activa');

INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES
  (900, 'a', 1, 'Payload B: <img src=x onerror="window.__ejecuto_onerror = true">', 1),
  (900, 'b', 2, 'Payload C: <svg onload="window.__ejecuto_svg = true"></svg>', 0),
  (900, 'c', 3, 'Payload D: " onmouseover="window.__ejecuto_atributo = true" x="', 0),
  (900, 'd', 4, 'Comillas invertidas `codigo`, dobles "citadas" y simple ''apostrofe''', 0);

-- Payload E: el icono viaja dentro de class="icon i-...", asi que aca la comilla
-- doble es el caracter peligroso, no el menor-que. La migracion lo deja en
-- 'devices' y el archivo de limpieza lo devuelve a ese valor.
UPDATE modulo SET icono = 'devices" onload="window.__ejecuto_icono = true' WHERE numero = 2;
