-- Diez preguntas de ejemplo para la iteracion 21.
--
-- No es el banco: son diez filas reales, tomadas del banco, que sirven para
-- comprobar que el esquema aguanta todos los casos que va a recibir.
--
-- Que casos cubren:
--   ids 1-7   preguntas activas, una por cada uno de los siete modulos
--   id  5     una pregunta del banco viejo (origen js_2026), junto a las nuevas
--   id  8     ORDEN FIJO: la unica pregunta cuyas alternativas se refieren entre
--             si por su letra, y que por eso no se baraja
--   id  9     una pregunta RETIRADA, con motivo, fecha y apuntando a la que la
--             reemplazo (la 5)
--   id  10    una pregunta en BORRADOR, sin justificacion todavia
--
-- Repetible: todo va con INSERT OR IGNORE y con ids explicitos, asi que correrlo
-- dos veces no duplica nada. Ojo: OR IGNORE tambien se traga un error de verdad
-- en silencio, asi que despues de cargar hay que correr d1/verificar-banco.sql.
--
-- Cargar en local: npm run datos:ejemplo

-- ---------------------------------------------------------------------------
-- Preguntas
-- ---------------------------------------------------------------------------

INSERT OR IGNORE INTO pregunta
  (id, modulo, origen, numero_origen, enunciado, justificacion, dificultad, orden_fijo, estado)
VALUES
  (1, 2, 'json_2026', 1,
   'Que limita estrictamente al Front-End en comparacion con el Back-End en la arquitectura web?',
   'El codigo de Front-End se ejecuta en el navegador, dentro de un entorno aislado que no alcanza el sistema de archivos del servidor. Renderizar estilos dinamicos si puede, y ningun framework es obligatorio.',
   'media', 0, 'activa'),

  (2, 3, 'json_2026', 1,
   'Cual es el motor principal que compila y ejecuta JavaScript dentro de Google Chrome?',
   'V8 es el motor de Google, escrito en C++, que compila JavaScript a codigo maquina. SpiderMonkey es el de Firefox, JavaScriptCore el de Safari y ChakraCore fue el del Edge antiguo.',
   'baja', 0, 'activa'),

  (3, 4, 'json_2026', 1,
   'Que pilar de POO oculta el estado interno de un objeto y exige metodos para alterarlo?',
   'El encapsulamiento oculta el estado interno y obliga a pasar por metodos para modificarlo. La herencia reutiliza, el polimorfismo permite respuestas distintas al mismo metodo y la abstraccion expone solo lo esencial.',
   'media', 0, 'activa'),

  (4, 5, 'json_2026', 1,
   'Que caracteristica fundamental distingue a un RDBMS de un sistema NoSQL documental?',
   'Un RDBMS garantiza atomicidad, consistencia, aislamiento y durabilidad sobre un esquema fijo. Los sistemas documentales priorizan el esquema flexible y suelen relajar esas garantias.',
   'media', 0, 'activa'),

  (5, 6, 'js_2026', 9,
   'Que modulo nativo de Node.js es indispensable para leer y escribir objetos JSON en archivos del sistema?',
   'El modulo fs es el que expone las operaciones de lectura y escritura de archivos. path solo compone rutas, http sirve peticiones y os informa del sistema operativo.',
   'baja', 0, 'activa'),

  (6, 7, 'json_2026', 21,
   'Que comando SQL inicia explicitamente un bloque de control transaccional en PostgreSQL?',
   'BEGIN abre un bloque transaccional en PostgreSQL. SET TRANSACTION no abre nada: fija las caracteristicas de la transaccion en curso. INIT y OPEN no son comandos SQL.',
   'media', 0, 'activa'),

  (7, 8, 'json_2026', 1,
   'Que principio REST estipula que cada peticion contenga toda la info necesaria sin usar sesiones?',
   'El principio stateless obliga a que cada peticion sea autosuficiente: el servidor no guarda estado de sesion entre una peticion y la siguiente.',
   'media', 0, 'activa'),

  (8, 2, 'js_2026', 11,
   'Que comando de Git permite crear una nueva rama y cambiar a ella de manera simultanea?',
   'Tanto git checkout -b como git switch --create crean la rama y cambian a ella en un solo paso. git branch -n no hace eso. Por eso la correcta es la que agrupa las dos, y por eso esta pregunta no se puede barajar.',
   'alta', 1, 'activa'),

  (10, 3, 'json_2026', 41,
   'Que recorre cada ciclo al aplicar for...in frente a for...of sobre un arreglo?',
   NULL,
   NULL, 0, 'borrador');

-- La retirada va aparte porque lleva columnas que las demas no pueden llevar:
-- el CHECK del esquema prohibe que una pregunta no retirada las traiga.
INSERT OR IGNORE INTO pregunta
  (id, modulo, origen, numero_origen, enunciado, justificacion, dificultad, orden_fijo,
   estado, motivo_retiro, retirada_en, reemplazada_por)
VALUES
  (9, 6, 'json_2026', 28,
   'Que modulo nativo de Node.js es indispensable para interactuar con archivos planos del sistema?',
   NULL, NULL, 0,
   'retirada',
   'Solapamiento con la pregunta 5: las dos preguntan por el modulo fs. Se conservo la del banco viejo, que compite contra modulos que existen.',
   '2026-09-04',
   5);

-- ---------------------------------------------------------------------------
-- Alternativas
--
-- orden es el orden original del banco; letra es la letra que traia el origen.
-- Ninguna de las dos decide cual es correcta: eso lo dice es_correcta (ADR-019).
-- ---------------------------------------------------------------------------

INSERT OR IGNORE INTO alternativa (id, pregunta_id, letra, orden, texto, es_correcta) VALUES
  ( 1, 1, 'a', 1, 'No interactuar directo con el sistema de archivos del servidor.', 1),
  ( 2, 1, 'b', 2, 'No puede renderizar estilos dinamicos del lado del usuario.',      0),
  ( 3, 1, 'c', 3, 'No admite la visualizacion directa de codigo ofuscado.',           0),
  ( 4, 1, 'd', 4, 'Requiere obligatoriamente un framework de interfaz de usuario.',   0),

  ( 5, 2, 'a', 1, 'SpiderMonkey',    0),
  ( 6, 2, 'b', 2, 'V8 Engine',       1),
  ( 7, 2, 'c', 3, 'ChakraCore',      0),
  ( 8, 2, 'd', 4, 'JavaScriptCore',  0),

  ( 9, 3, 'a', 1, 'Herencia multiple.',        0),
  (10, 3, 'b', 2, 'Encapsulamiento.',          1),
  (11, 3, 'c', 3, 'Polimorfismo.',             0),
  (12, 3, 'd', 4, 'Abstraccion estructural.',  0),

  (13, 4, 'a', 1, 'Estructura flexible de esquemas dinamicos.',       0),
  (14, 4, 'b', 2, 'Garantia estricta de propiedades ACID.',           1),
  (15, 4, 'c', 3, 'Almacenamiento basado en grafos dirigidos.',       0),
  (16, 4, 'd', 4, 'Ausencia de lenguaje estructurado de consultas.',  0),

  (17, 5, 'a', 1, 'path',              0),
  (18, 5, 'b', 2, 'http',              0),
  (19, 5, 'c', 3, 'fs (file system)',  1),
  (20, 5, 'd', 4, 'os',                0),

  (21, 6, 'a', 1, 'SET TRANSACTION',  0),
  (22, 6, 'b', 2, 'BEGIN',            1),
  (23, 6, 'c', 3, 'INIT',             0),
  (24, 6, 'd', 4, 'OPEN',             0),

  (25, 7, 'a', 1, 'Interfaz uniforme estricta.',            0),
  (26, 7, 'b', 2, 'Sistema de capas enrutadas.',            0),
  (27, 7, 'c', 3, 'Comunicacion sin estado (Stateless).',   1),
  (28, 7, 'd', 4, 'Arquitectura cliente-servidor.',         0),

  -- Pregunta 8: la de orden fijo. La alternativa d nombra a las otras dos, asi
  -- que aqui el orden es contenido y no se puede barajar.
  (29, 8, 'a', 1, 'git branch -n <rama>',        0),
  (30, 8, 'b', 2, 'git checkout -b <rama>',      0),
  (31, 8, 'c', 3, 'git switch --create <rama>',  0),
  (32, 8, 'd', 4, 'Ambas B y C son correctas.',  1),

  (33, 9, 'a', 1, 'file-system (fs)',    1),
  (34, 9, 'b', 2, 'path-directory (pd)', 0),
  (35, 9, 'c', 3, 'os-architecture',     0),
  (36, 9, 'd', 4, 'input-output (io)',   0),

  (37, 10, 'a', 1, 'Ambos recorren los valores; solo cambia el orden de la iteracion.',     0),
  (38, 10, 'b', 2, 'for...in recorre los valores y for...of recorre las posiciones.',       0),
  (39, 10, 'c', 3, 'Ambos recorren las claves; for...of ademas expone el arreglo completo.', 0),
  (40, 10, 'd', 4, 'for...in recorre las claves del objeto y for...of recorre los valores.', 1);
