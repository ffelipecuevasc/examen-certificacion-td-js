/**
 * Banco de preguntas del miniexamen: 3 por modulo evaluado.
 * `correcta` es el indice de la alternativa correcta dentro de `opciones`.
 */
export const quizData = [
  {
    modulo: 'Módulo 2',
    titulo: 'Fundamentos de Desarrollo Front-End',
    preguntas: [
      {
        q: '¿Qué media query aplica estilos únicamente entre 768px y 1024px de ancho?',
        opciones: [
          '@media (min-width: 768px) and (max-width: 1024px)',
          '@media (width: 768px, 1024px)',
          '@media (min-width: 768px) or (max-width: 1024px)',
          '@media screen (768px - 1024px)',
        ],
        correcta: 0,
        explica: 'Las condiciones se combinan con and; or no existe como operador en media queries.',
      },
      {
        q: '¿Qué propiedad convierte una imagen de 150x150px en un círculo perfecto?',
        opciones: ['border-radius: 50%', 'overflow: hidden', 'object-fit: cover', 'clip-path: inset(50%)'],
        correcta: 0,
        explica: 'El 50% del ancho y alto genera la curvatura completa; object-fit solo controla el recorte interno.',
      },
      {
        q: '¿Qué comando trae los cambios del remoto sin fusionarlos en tu rama actual?',
        opciones: ['git fetch', 'git pull', 'git clone', 'git merge'],
        correcta: 0,
        explica: 'git pull equivale a fetch más merge; fetch por sí solo no altera tu rama de trabajo.',
      },
    ],
  },
  {
    modulo: 'Módulo 3',
    titulo: 'Fundamentos de Programación en JavaScript',
    preguntas: [
      {
        q: 'En un switch, ¿qué ocurre si un case coincide y no incluye la sentencia break?',
        opciones: [
          'Se ejecutan también los case siguientes',
          'Lanza un SyntaxError en tiempo de ejecución',
          'Salta directamente al bloque default',
          'Sale del switch de igual forma',
        ],
        correcta: 0,
        explica: 'Es el comportamiento de caída o fall-through: la ejecución continúa hasta encontrar un break.',
      },
      {
        q: '¿Qué método recorre un arreglo y devuelve un único valor acumulado?',
        opciones: ['reduce()', 'map()', 'filter()', 'forEach()'],
        correcta: 0,
        explica: 'map y filter devuelven arreglos nuevos; forEach no devuelve nada.',
      },
      {
        q: '¿Qué devuelve [10, 20, 30].map(n => n * 2).filter(n => n > 40)?',
        opciones: ['[60]', '[40, 60]', '[20, 40, 60]', '[]'],
        correcta: 0,
        explica: 'map produce [20, 40, 60] y filter conserva solo los estrictamente mayores que 40.',
      },
    ],
  },
  {
    modulo: 'Módulo 4',
    titulo: 'Programación Avanzada en JavaScript',
    preguntas: [
      {
        q: 'Si una promesa del arreglo se rechaza, ¿qué hace Promise.all() con las demás?',
        opciones: [
          'Rechaza de inmediato y descarta los resultados',
          'Espera a todas y devuelve el estado de cada una',
          'Devuelve solo las que se cumplieron',
          'Reintenta automáticamente la promesa rechazada',
        ],
        correcta: 0,
        explica: 'Ese comportamiento de esperar a todas y reportar cada estado es propio de allSettled.',
      },
      {
        q: '¿Qué palabra clave invoca el constructor de la clase padre en JavaScript?',
        opciones: ['super', 'this', 'extends', 'prototype'],
        correcta: 0,
        explica: 'extends declara la herencia, pero es super() quien ejecuta el constructor heredado.',
      },
      {
        q: '¿Qué devuelve siempre una función async, sin importar el valor de su return?',
        opciones: ['Una promesa', 'El valor del return', 'undefined', 'Una función callback'],
        correcta: 0,
        explica: 'El valor retornado queda envuelto en una promesa resuelta de forma automática.',
      },
    ],
  },
  {
    modulo: 'Módulo 5',
    titulo: 'Fundamentos de Bases de Datos Relacionales',
    preguntas: [
      {
        q: '¿Qué consulta aumenta en 10% el precio de todos los productos de la tabla?',
        opciones: [
          'UPDATE productos SET precio = precio * 1.10;',
          'ALTER TABLE productos SET precio = precio + 10%;',
          'SELECT precio * 1.10 FROM productos;',
          'UPDATE productos SET precio = 10% WHERE precio > 0;',
        ],
        correcta: 0,
        explica: 'SELECT solo consulta sin modificar, y ALTER TABLE cambia la estructura, no los datos.',
      },
      {
        q: '¿Qué sentencia amplía un VARCHAR(100) a VARCHAR(255) sin perder los datos?',
        opciones: [
          'ALTER TABLE clientes MODIFY COLUMN correo VARCHAR(255);',
          'UPDATE clientes SET correo = VARCHAR(255);',
          'ALTER TABLE clientes DROP COLUMN correo;',
          'ALTER TABLE clientes RENAME COLUMN correo VARCHAR(255);',
        ],
        correcta: 0,
        explica: 'Ampliar el tamaño conserva el contenido; eliminar la columna lo destruiría.',
      },
      {
        q: 'En una relación de uno a muchos, ¿dónde se ubica la clave foránea?',
        opciones: [
          'En la tabla del lado "muchos"',
          'En la tabla del lado "uno"',
          'En ambas tablas por igual',
          'En una tabla intermedia obligatoria',
        ],
        correcta: 0,
        explica: 'La tabla intermedia corresponde a relaciones de muchos a muchos, no a 1:N.',
      },
    ],
  },
  {
    modulo: 'Módulo 6',
    titulo: 'Desarrollo de Aplicaciones Web Node Express',
    preguntas: [
      {
        q: '¿Qué error lanza Node al importar un módulo local si se omite el prefijo ./?',
        opciones: ['MODULE_NOT_FOUND', 'SyntaxError', 'TypeError', 'ReferenceError'],
        correcta: 0,
        explica: 'Sin ./ Node busca el módulo en node_modules en lugar del directorio del archivo.',
      },
      {
        q: 'En el patrón MVC, ¿cuál es la responsabilidad exacta del controlador?',
        opciones: [
          'Recibir la petición, coordinar el modelo y entregar la respuesta',
          'Definir la estructura y las reglas de los datos',
          'Renderizar el HTML que finalmente ve el usuario',
          'Abrir y administrar la conexión con la base de datos',
        ],
        correcta: 0,
        explica: 'Definir los datos corresponde al modelo y renderizar la salida corresponde a la vista.',
      },
      {
        q: '¿Qué distingue a app.use() de un middleware declarado en una ruta específica?',
        opciones: [
          'Se ejecuta en toda petición que coincida con la ruta base',
          'Solo funciona con peticiones de tipo GET',
          'Se ejecuta siempre después del middleware de ruta',
          'No puede invocar la función next()',
        ],
        correcta: 0,
        explica: 'El middleware de ruta se limita al endpoint declarado; app.use() es de alcance general.',
      },
    ],
  },
  {
    modulo: 'Módulo 7',
    titulo: 'Acceso a Datos en Aplicaciones Node',
    preguntas: [
      {
        q: '¿Cuál es la ventaja de un pool frente a abrir conexiones individuales?',
        opciones: [
          'Reutiliza conexiones abiertas y evita el costo de crearlas',
          'Cifra de forma automática todas las consultas SQL',
          'Elimina la necesidad de usar transacciones',
          'Permite consultar varias bases de datos a la vez',
        ],
        correcta: 0,
        explica: 'Abrir una conexión es costoso; el pool las mantiene disponibles y las recicla.',
      },
      {
        q: 'Si un UPDATE falla dentro de una transacción, ¿qué operación revierte los cambios?',
        opciones: ['ROLLBACK', 'COMMIT', 'DELETE', 'TRUNCATE'],
        correcta: 0,
        explica: 'COMMIT confirmaría los cambios; ROLLBACK devuelve la base al estado previo.',
      },
      {
        q: 'En Sequelize, ¿qué método se declara en el modelo que tiene la clave foránea?',
        opciones: ['belongsTo', 'hasMany', 'belongsToMany', 'hasOne'],
        correcta: 0,
        explica: 'hasMany y hasOne se declaran en el modelo padre; belongsToMany indica una relación N:M.',
      },
    ],
  },
  {
    modulo: 'Módulo 8',
    titulo: 'Implementación de API Backend Node Express',
    preguntas: [
      {
        q: 'Según REST, ¿cuál es el uso semántico correcto del verbo HTTP PUT?',
        opciones: [
          'Reemplazar por completo un recurso existente',
          'Crear un recurso nuevo sin conocer su identificador',
          'Modificar solo algunos campos del recurso',
          'Eliminar un recurso del servidor',
        ],
        correcta: 0,
        explica: 'La actualización parcial corresponde a PATCH y la creación sin id, a POST.',
      },
      {
        q: '¿Para qué sirve el middleware incorporado express.json() en una API?',
        opciones: [
          'Convierte el cuerpo JSON de la petición en un objeto en req.body',
          'Convierte la respuesta del servidor a formato JSON',
          'Valida el esquema del JSON que llega al servidor',
          'Habilita las peticiones provenientes de otros dominios',
        ],
        correcta: 0,
        explica: 'Sin este middleware, req.body llega vacío o indefinido al controlador.',
      },
      {
        q: '¿Qué buena práctica reduce el riesgo ante el robo de un JWT?',
        opciones: [
          'Definir expiración corta y guardar el secreto fuera del código',
          'Incluir la contraseña del usuario dentro del payload',
          'Firmar el token usando el algoritmo none',
          'Enviar el token como parámetro visible en la URL',
        ],
        correcta: 0,
        explica: 'El payload es legible por cualquiera y el algoritmo none anula por completo la firma.',
      },
    ],
  },
];
