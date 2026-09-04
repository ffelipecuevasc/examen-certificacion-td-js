-- Migracion 001 - Esquema del banco de preguntas
--
-- Iteracion 21. Implementa ADR-018 (alternativas en tabla aparte), ADR-019
-- (es_correcta con indice unico parcial), ADR-020 (estado con vista) y ADR-021
-- (tabla modulo).
--
-- Es repetible: correrla dos veces no rompe nada ni duplica datos. Todo va con
-- IF NOT EXISTS, y las siete filas de referencia con INSERT OR IGNORE.
--
-- El detalle campo por campo esta en _planmaestro/90-manual/esquema-del-banco.md,
-- incluida la frontera entre lo que garantiza la base y lo que hay que comprobar
-- con d1/verificar-banco.sql. Esa frontera es lo que mas facil se confunde.
--
-- Aplicar en local:      npm run datos:migrar
-- Aplicar en la nube:    el comando esta en 90-manual/, y lo ejecuta el autor.

-- ---------------------------------------------------------------------------
-- Registro de migraciones aplicadas
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS migracion (
  nombre      TEXT PRIMARY KEY,
  aplicada_en TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- Modulos (ADR-021)
--
-- Datos de referencia, no contenido variable. El plan formativo empieza en el
-- modulo 2, y por eso el CHECK no admite el 1.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS modulo (
  numero INTEGER PRIMARY KEY CHECK (numero BETWEEN 2 AND 8),
  titulo TEXT NOT NULL,
  icono  TEXT NOT NULL
);

INSERT OR IGNORE INTO modulo (numero, titulo, icono) VALUES
  (2, 'Fundamentos de Desarrollo Front-End',         'devices'),
  (3, 'Fundamentos de Programacion en JavaScript',   'data-object'),
  (4, 'Programacion Avanzada en JavaScript',         'bolt'),
  (5, 'Fundamentos de Bases de Datos Relacionales',  'database'),
  (6, 'Desarrollo de Aplicaciones Web Node Express', 'dns'),
  (7, 'Acceso a Datos en Aplicaciones Node',         'layers'),
  (8, 'Implementacion de API Backend Node Express',  'shield-lock');

-- ---------------------------------------------------------------------------
-- Preguntas (ADR-020)
--
-- Ninguna fila se borra nunca: retirar es cambiar el estado. Por eso el id es
-- estable para siempre, y por eso reemplazada_por puede apuntar a otra pregunta
-- sin miedo a quedar colgada.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pregunta (
  id              INTEGER PRIMARY KEY,

  modulo          INTEGER NOT NULL REFERENCES modulo (numero),
  origen          TEXT    NOT NULL CHECK (origen IN ('json_2026', 'js_2026')),
  numero_origen   INTEGER NOT NULL,

  enunciado       TEXT    NOT NULL,
  justificacion   TEXT,
  dificultad      TEXT    CHECK (dificultad IS NULL OR dificultad IN ('baja', 'media', 'alta')),
  orden_fijo      INTEGER NOT NULL DEFAULT 0 CHECK (orden_fijo IN (0, 1)),

  estado          TEXT    NOT NULL DEFAULT 'borrador'
                          CHECK (estado IN ('borrador', 'activa', 'retirada')),
  motivo_retiro   TEXT,
  retirada_en     TEXT,
  reemplazada_por INTEGER REFERENCES pregunta (id),

  creada_en       TEXT    NOT NULL DEFAULT (date('now')),

  -- Una pregunta no puede cargarse dos veces desde el mismo origen. Es lo que
  -- impide que una carga repetida duplique el banco entero.
  UNIQUE (origen, modulo, numero_origen),

  -- El informe comprobo que ningun enunciado se repite entre los dos bancos.
  -- Esto lo convierte en regla: dos preguntas con el mismo enunciado son un
  -- error de carga, no contenido nuevo.
  UNIQUE (enunciado),

  -- Una pregunta retirada dice por que lo esta...
  CHECK (estado <> 'retirada' OR motivo_retiro IS NOT NULL),

  -- ...y una que no lo esta no arrastra metadatos de retiro.
  CHECK (estado = 'retirada'
         OR (motivo_retiro IS NULL AND retirada_en IS NULL AND reemplazada_por IS NULL))
);

-- ---------------------------------------------------------------------------
-- Alternativas (ADR-018 y ADR-019)
--
-- CHECK sobre letra + UNIQUE (pregunta_id, letra) garantizan que ninguna
-- pregunta pase de cuatro alternativas: solo hay cuatro letras y cada una se usa
-- una vez. El NOT NULL de letra sostiene esa garantia y no es decorativo: un
-- CHECK sobre NULL no da falso sino NULL, y UNIQUE considera cada NULL distinto.
-- Sin el, entran alternativas sin limite.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS alternativa (
  id          INTEGER PRIMARY KEY,
  pregunta_id INTEGER NOT NULL REFERENCES pregunta (id) ON DELETE CASCADE,

  letra       TEXT    NOT NULL CHECK (letra IN ('a', 'b', 'c', 'd')),
  orden       INTEGER NOT NULL CHECK (orden BETWEEN 1 AND 4),
  texto       TEXT    NOT NULL,
  es_correcta INTEGER NOT NULL DEFAULT 0 CHECK (es_correcta IN (0, 1)),

  UNIQUE (pregunta_id, letra),
  UNIQUE (pregunta_id, orden)
);

-- Como mucho una correcta por pregunta. El indice parcial es la restriccion, no
-- una optimizacion: sin el, nada impide dos correctas en la misma pregunta.
CREATE UNIQUE INDEX IF NOT EXISTS alternativa_una_correcta
  ON alternativa (pregunta_id) WHERE es_correcta = 1;

-- ---------------------------------------------------------------------------
-- Indices para las dos consultas previstas
--
-- 1. Banco completo por modulo    -> WHERE estado = 'activa' AND modulo = ?
-- 2. Seleccion para el simulacro  -> el mismo filtro, mas ORDER BY RANDOM()
--
-- Los dos filtran igual, asi que un solo indice sirve para ambos. El orden
-- aleatorio no se puede indexar: obliga a recorrer el conjunto ya filtrado, que
-- con 368 preguntas no es un problema.
--
-- No hay indice sobre alternativa (pregunta_id) a proposito: UNIQUE
-- (pregunta_id, letra) ya crea uno con pregunta_id a la izquierda, y el JOIN lo
-- aprovecha. Un indice mas seria peso muerto.
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS pregunta_por_estado_y_modulo
  ON pregunta (estado, modulo);

CREATE INDEX IF NOT EXISTS pregunta_reemplazos
  ON pregunta (reemplazada_por) WHERE reemplazada_por IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Vista de lectura (ADR-020)
--
-- Todo lo que lee el banco lee esta vista, nunca la tabla. El filtro por estado
-- vive aca una sola vez: una consulta futura no puede olvidarlo porque no lo
-- escribe. Las columnas se nombran una a una para que los metadatos de retiro no
-- salgan por accidente.
-- ---------------------------------------------------------------------------

CREATE VIEW IF NOT EXISTS pregunta_activa AS
  SELECT
    p.id            AS id,
    p.modulo        AS modulo,
    m.titulo        AS modulo_titulo,
    m.icono         AS modulo_icono,
    p.enunciado     AS enunciado,
    p.justificacion AS justificacion,
    p.dificultad    AS dificultad,
    p.orden_fijo    AS orden_fijo
  FROM pregunta p
  JOIN modulo m ON m.numero = p.modulo
  WHERE p.estado = 'activa';

-- ---------------------------------------------------------------------------

INSERT OR IGNORE INTO migracion (nombre, aplicada_en)
  VALUES ('001-banco-de-preguntas', date('now'));
