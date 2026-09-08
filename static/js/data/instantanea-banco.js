/**
 * INSTANTANEA DEL BANCO DE PREGUNTAS · ARCHIVO GENERADO, NO SE EDITA A MANO.
 *
 * Lo escribe scripts/generar-instantanea.mjs. Para cambiarlo, se cambia el banco
 * en D1 y se vuelve a generar; editarlo aqui produce un respaldo que no
 * corresponde a ninguna base y nadie se entera.
 *
 * Es el respaldo de ADR-008: el navegador lo carga cuando la capa de datos no
 * responde, y el sitio avisa al estudiante de que puede no estar al dia. Ese
 * aviso sale del SELLO de abajo.
 *
 * Trae las respuestas correctas a proposito (ADR-022): un modo degradado que no
 * puede corregir no sirve de nada.
 */

/** Contra que base se genero, y cuando. La fuente del aviso al estudiante. */
export const SELLO = {
  "base": "examen-td-js-produccion",
  "entorno": "local",
  "generada_en": "2026-09-06T02:43:29.805Z",
  "preguntas": 9,
  "descartadas": 0
};

/** El banco, con la misma forma que devuelve /api/preguntas. */
export const PREGUNTAS = [
  {
    "id": 1,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Que limita estrictamente al Front-End en comparacion con el Back-End en la arquitectura web?",
    "justificacion": "El codigo de Front-End se ejecuta en el navegador, dentro de un entorno aislado que no alcanza el sistema de archivos del servidor. Renderizar estilos dinamicos si puede, y ningun framework es obligatorio.",
    "dificultad": "media",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1,
        "letra": "a",
        "orden": 1,
        "texto": "No interactuar directo con el sistema de archivos del servidor.",
        "es_correcta": 1
      },
      {
        "id": 2,
        "letra": "b",
        "orden": 2,
        "texto": "No puede renderizar estilos dinamicos del lado del usuario.",
        "es_correcta": 0
      },
      {
        "id": 3,
        "letra": "c",
        "orden": 3,
        "texto": "No admite la visualizacion directa de codigo ofuscado.",
        "es_correcta": 0
      },
      {
        "id": 4,
        "letra": "d",
        "orden": 4,
        "texto": "Requiere obligatoriamente un framework de interfaz de usuario.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 8,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Que comando de Git permite crear una nueva rama y cambiar a ella de manera simultanea?",
    "justificacion": "Tanto git checkout -b como git switch --create crean la rama y cambian a ella en un solo paso. git branch -n no hace eso. Por eso la correcta es la que agrupa las dos, y por eso esta pregunta no se puede barajar.",
    "dificultad": "alta",
    "orden_fijo": 1,
    "alternativas": [
      {
        "id": 29,
        "letra": "a",
        "orden": 1,
        "texto": "git branch -n <rama>",
        "es_correcta": 0
      },
      {
        "id": 30,
        "letra": "b",
        "orden": 2,
        "texto": "git checkout -b <rama>",
        "es_correcta": 0
      },
      {
        "id": 31,
        "letra": "c",
        "orden": 3,
        "texto": "git switch --create <rama>",
        "es_correcta": 0
      },
      {
        "id": 32,
        "letra": "d",
        "orden": 4,
        "texto": "Ambas B y C son correctas.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 11,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Prueba de carga transaccional CLI (Editado).",
    "justificacion": "No hace falta justificar prueba.",
    "dificultad": "media",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 41,
        "letra": "a",
        "orden": 1,
        "texto": "Incorrecto editado!!",
        "es_correcta": 0
      },
      {
        "id": 42,
        "letra": "b",
        "orden": 2,
        "texto": "Me parece que incorrecto",
        "es_correcta": 0
      },
      {
        "id": 43,
        "letra": "c",
        "orden": 3,
        "texto": "Totalmente falso",
        "es_correcta": 0
      },
      {
        "id": 44,
        "letra": "d",
        "orden": 4,
        "texto": "Absolutamente verdadero",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 2,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Cual es el motor principal que compila y ejecuta JavaScript dentro de Google Chrome?",
    "justificacion": "V8 es el motor de Google, escrito en C++, que compila JavaScript a codigo maquina. SpiderMonkey es el de Firefox, JavaScriptCore el de Safari y ChakraCore fue el del Edge antiguo.",
    "dificultad": "baja",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 5,
        "letra": "a",
        "orden": 1,
        "texto": "SpiderMonkey",
        "es_correcta": 0
      },
      {
        "id": 6,
        "letra": "b",
        "orden": 2,
        "texto": "V8 Engine",
        "es_correcta": 1
      },
      {
        "id": 7,
        "letra": "c",
        "orden": 3,
        "texto": "ChakraCore",
        "es_correcta": 0
      },
      {
        "id": 8,
        "letra": "d",
        "orden": 4,
        "texto": "JavaScriptCore",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 3,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Que pilar de POO oculta el estado interno de un objeto y exige metodos para alterarlo?",
    "justificacion": "El encapsulamiento oculta el estado interno y obliga a pasar por metodos para modificarlo. La herencia reutiliza, el polimorfismo permite respuestas distintas al mismo metodo y la abstraccion expone solo lo esencial.",
    "dificultad": "media",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 9,
        "letra": "a",
        "orden": 1,
        "texto": "Herencia multiple.",
        "es_correcta": 0
      },
      {
        "id": 10,
        "letra": "b",
        "orden": 2,
        "texto": "Encapsulamiento.",
        "es_correcta": 1
      },
      {
        "id": 11,
        "letra": "c",
        "orden": 3,
        "texto": "Polimorfismo.",
        "es_correcta": 0
      },
      {
        "id": 12,
        "letra": "d",
        "orden": 4,
        "texto": "Abstraccion estructural.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 4,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "Que caracteristica fundamental distingue a un RDBMS de un sistema NoSQL documental?",
    "justificacion": "Un RDBMS garantiza atomicidad, consistencia, aislamiento y durabilidad sobre un esquema fijo. Los sistemas documentales priorizan el esquema flexible y suelen relajar esas garantias.",
    "dificultad": "media",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 13,
        "letra": "a",
        "orden": 1,
        "texto": "Estructura flexible de esquemas dinamicos.",
        "es_correcta": 0
      },
      {
        "id": 14,
        "letra": "b",
        "orden": 2,
        "texto": "Garantia estricta de propiedades ACID.",
        "es_correcta": 1
      },
      {
        "id": 15,
        "letra": "c",
        "orden": 3,
        "texto": "Almacenamiento basado en grafos dirigidos.",
        "es_correcta": 0
      },
      {
        "id": 16,
        "letra": "d",
        "orden": 4,
        "texto": "Ausencia de lenguaje estructurado de consultas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 5,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Que modulo nativo de Node.js es indispensable para leer y escribir objetos JSON en archivos del sistema?",
    "justificacion": "El modulo fs es el que expone las operaciones de lectura y escritura de archivos. path solo compone rutas, http sirve peticiones y os informa del sistema operativo.",
    "dificultad": "baja",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 17,
        "letra": "a",
        "orden": 1,
        "texto": "path",
        "es_correcta": 0
      },
      {
        "id": 18,
        "letra": "b",
        "orden": 2,
        "texto": "http",
        "es_correcta": 0
      },
      {
        "id": 19,
        "letra": "c",
        "orden": 3,
        "texto": "fs (file system)",
        "es_correcta": 1
      },
      {
        "id": 20,
        "letra": "d",
        "orden": 4,
        "texto": "os",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 6,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Que comando SQL inicia explicitamente un bloque de control transaccional en PostgreSQL?",
    "justificacion": "BEGIN abre un bloque transaccional en PostgreSQL. SET TRANSACTION no abre nada: fija las caracteristicas de la transaccion en curso. INIT y OPEN no son comandos SQL.",
    "dificultad": "media",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 21,
        "letra": "a",
        "orden": 1,
        "texto": "SET TRANSACTION",
        "es_correcta": 0
      },
      {
        "id": 22,
        "letra": "b",
        "orden": 2,
        "texto": "BEGIN",
        "es_correcta": 1
      },
      {
        "id": 23,
        "letra": "c",
        "orden": 3,
        "texto": "INIT",
        "es_correcta": 0
      },
      {
        "id": 24,
        "letra": "d",
        "orden": 4,
        "texto": "OPEN",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 7,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Que principio REST estipula que cada peticion contenga toda la info necesaria sin usar sesiones?",
    "justificacion": "El principio stateless obliga a que cada peticion sea autosuficiente: el servidor no guarda estado de sesion entre una peticion y la siguiente.",
    "dificultad": "media",
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 25,
        "letra": "a",
        "orden": 1,
        "texto": "Interfaz uniforme estricta.",
        "es_correcta": 0
      },
      {
        "id": 26,
        "letra": "b",
        "orden": 2,
        "texto": "Sistema de capas enrutadas.",
        "es_correcta": 0
      },
      {
        "id": 27,
        "letra": "c",
        "orden": 3,
        "texto": "Comunicacion sin estado (Stateless).",
        "es_correcta": 1
      },
      {
        "id": 28,
        "letra": "d",
        "orden": 4,
        "texto": "Arquitectura cliente-servidor.",
        "es_correcta": 0
      }
    ]
  }
];
