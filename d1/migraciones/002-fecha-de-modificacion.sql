-- Migracion 002 - Fecha de modificacion de las preguntas
--
-- Iteracion 23. Sostiene la regla de ADR-025 de que editar el banco deja rastro:
-- una pregunta corregida tiene que poder distinguirse de una que nunca se toco.
--
-- QUE GUARDA, Y POR QUE CON HORA
--
-- `datetime('now')` y no `date('now')` como `creada_en`. La fecha de creacion se
-- escribe una vez en la vida y basta con el dia; la de modificacion se reescribe
-- cada vez que se corrige algo, y dos correcciones del mismo dia con `date('now')`
-- son indistinguibles. La columna existe justamente para distinguirlas.
--
-- QUIEN LA ESCRIBE
--
-- La escribe `scripts/administrar-banco.mjs` en su UPDATE, no un disparador.
-- Un disparador sobre `pregunta` se dispararia tambien en la carga masiva de la
-- iteracion 24 y dejaria las 368 preguntas marcadas como «modificadas» el dia que
-- se cargaron, que es exactamente lo contrario de lo que esta columna significa.
--
-- NULL SIGNIFICA ALGO
--
-- `NULL` es «nunca se ha modificado desde que se cargo». No se rellena con la
-- fecha de creacion: eso borraria la distincion que la columna viene a crear.
--
-- ESTA MIGRACION NO ES REPETIBLE, Y CONVIENE SABERLO
--
-- La 001 se puede correr las veces que sea porque todo lo suyo lleva
-- IF NOT EXISTS. SQLite no admite eso en ALTER TABLE ADD COLUMN, asi que correr
-- esta dos veces responde `duplicate column name: fecha_modificacion`.
--
-- El fallo es seguro: wrangler aplica el archivo como un LOTE ATOMICO (ver la
-- correccion de la regla 1 de ADR-025), asi que la segunda corrida no aplica
-- nada, ni siquiera vuelve a tocar la tabla `migracion`. Falla ruidosamente y
-- deja la base como estaba. Antes de aplicarla, se mira si ya esta:
--
--   SELECT * FROM migracion;
--
-- Aplicar en local:   npm run datos:migrar-002
-- Aplicar en la nube: lo ejecuta el autor, por ADR-015. Iteracion 24.

ALTER TABLE pregunta ADD COLUMN fecha_modificacion TEXT;

-- ---------------------------------------------------------------------------
-- Queda registrada. Es la mitad que la migracion 002 de la rama `antigravity`
-- no hizo: alli la columna se creo y el libro de migraciones no se entero, de
-- modo que el esquema real y lo que el proyecto creia de si mismo divergieron en
-- silencio. Por eso esta se escribio desde cero.
-- ---------------------------------------------------------------------------

INSERT OR IGNORE INTO migracion (nombre, aplicada_en)
  VALUES ('002-fecha-de-modificacion', date('now'));
