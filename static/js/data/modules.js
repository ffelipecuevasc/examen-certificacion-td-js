/**
 * Contenido de los modulos 2 al 8 del plan formativo evaluados en el examen.
 * Cada entrada relaciona el modulo del bootcamp con la parte correspondiente del examen.
 */
export const modulesData = [
  {
    parte: 'Parte 1',
    modulo: 'Módulo 2',
    titulo: 'Fundamentos de Desarrollo Front-End',
    resumen: '6 preguntas de selección múltiple + 2 ejercicios de código',
    temas: [
      'Uso y configuración de media queries para diseño responsivo',
      'Comandos básicos de Git para el control de versiones',
      'Estilos en línea mediante el atributo style',
      'Imágenes circulares con dimensiones estrictas y enlaces envolventes',
    ],
    ejercicios: [
      {
        titulo: 'Estructura y estilos en línea',
        detalle: 'Crear un <div> que contenga un <h1> en su interior aplicando estilos con el atributo style.',
        lang: 'html',
        code: '<div style="background-color:#1B1910; padding:24px; border-radius:12px;">\n  <h1 style="color:#F7DF1E; font-family:sans-serif; margin:0;">\n    ¡Hola, Bootcamp!\n  </h1>\n</div>',
      },
      {
        titulo: 'Imagen circular con enlace',
        detalle: 'Imagen de 150px de diámetro exacto que redirige a Google.com al hacer clic.',
        lang: 'html',
        code: '<a href="https://www.google.com" target="_blank" rel="noopener">\n  <img src="avatar.jpg" alt="Foto de perfil"\n       style="width:150px; height:150px;\n              border-radius:50%; object-fit:cover;">\n</a>',
      },
    ],
  },
  {
    parte: 'Parte 2',
    modulo: 'Módulo 3',
    titulo: 'Fundamentos de Programación en JavaScript',
    resumen: 'Evaluación práctica de lógica pura en JavaScript',
    temas: [
      'Control de flujo con switch / case',
      'Manipulación de arreglos y objetos',
      'Funciones que procesan colecciones de datos',
    ],
    ejercicios: [
      {
        titulo: 'Disponibilidad de un auto (switch / case)',
        detalle: 'Evaluar el estado de un automóvil según sus variables y determinar si está disponible.',
        lang: 'javascript',
        code: "function estadoAuto(disponible, enMantencion) {\n  switch (true) {\n    case enMantencion:\n      return 'En mantención';\n    case disponible:\n      return 'Disponible';\n    default:\n      return 'No disponible';\n  }\n}",
      },
      {
        titulo: 'Promedio de notas por alumno',
        detalle: 'Recibir un arreglo de objetos con notas y devolver el promedio de cada alumno.',
        lang: 'javascript',
        code: 'function promedioPorAlumno(notas) {\n  const agrupado = {};\n  notas.forEach(({ nombre, nota }) => {\n    if (!agrupado[nombre]) agrupado[nombre] = [];\n    agrupado[nombre].push(nota);\n  });\n\n  return Object.entries(agrupado).map(([nombre, lista]) => ({\n    nombre,\n    promedio: lista.reduce((a, b) => a + b, 0) / lista.length,\n  }));\n}',
      },
    ],
  },
  {
    parte: 'Parte 3',
    modulo: 'Módulo 4',
    titulo: 'Programación Avanzada en JavaScript',
    resumen: 'Paradigmas y manejo de asincronía',
    temas: [
      'Conceptos de programación orientada a objetos (OOP)',
      'Diferencias entre Promise.all() y Promise.allSettled()',
      'Sintaxis correcta de funciones asíncronas con async / await',
    ],
    ejercicios: [
      {
        titulo: 'Promise.all() frente a Promise.allSettled()',
        detalle: 'La primera se detiene ante el primer rechazo; la segunda espera el resultado de todas.',
        lang: 'javascript',
        code: 'const tareas = [fetchUsuario(), fetchPedidos(), fetchPagos()];\n\n// Se detiene si UNA promesa falla\nPromise.all(tareas)\n  .then(console.log)\n  .catch(console.error);\n\n// Espera a todas, exitosas o no\nPromise.allSettled(tareas).then((resultados) => {\n  resultados.forEach((r) => console.log(r.status));\n});',
      },
    ],
  },
  {
    parte: 'Parte 4',
    modulo: 'Módulo 5',
    titulo: 'Fundamentos de Bases de Datos Relacionales',
    resumen: 'Preguntas conceptuales y escritura de consultas SQL',
    temas: [
      'Modificación de datos con UPDATE',
      'Estructura de tablas con ALTER TABLE: agregar columnas, cambiar tipos y ampliar tamaños',
      'Construcción y uso de subconsultas',
      'Modelo entidad-relación y relaciones de uno a muchos (1:N)',
      'Consultas combinando JOIN, SUM() y WHERE',
    ],
    ejercicios: [
      {
        titulo: 'Aumentar los precios en un 10%',
        detalle: 'Actualizar todos los registros de una tabla con UPDATE.',
        lang: 'sql',
        code: 'UPDATE productos\nSET precio = precio * 1.10;',
      },
      {
        titulo: 'Modificar una tabla existente',
        detalle: 'Agregar una columna y ampliar un VARCHAR(100) a VARCHAR(255) sin perder los datos.',
        lang: 'sql',
        code: 'ALTER TABLE usuarios\n  ADD COLUMN telefono VARCHAR(20);\n\nALTER TABLE usuarios\n  MODIFY COLUMN correo VARCHAR(255);',
      },
      {
        titulo: 'JOIN con SUM() y WHERE',
        detalle: 'Total gastado por cliente considerando solo los pedidos pagados.',
        lang: 'sql',
        code: "SELECT c.nombre, SUM(p.total) AS total_gastado\nFROM clientes c\nJOIN pedidos p ON p.cliente_id = c.id\nWHERE p.estado = 'pagado'\nGROUP BY c.nombre;",
      },
    ],
  },
  {
    parte: 'Parte 5',
    modulo: 'Módulo 6',
    titulo: 'Desarrollo de Aplicaciones Web Node Express',
    resumen: 'Arquitectura del servidor, enrutamiento y módulos',
    temas: [
      'Ejecución de un archivo Node desde la consola de comandos',
      'Error al omitir ./ al importar módulos locales',
      'Definición y propósito de un middleware',
      'app.use() global frente a middleware en una ruta específica',
      'La capa Modelo y la responsabilidad del Controlador en MVC',
      'Uso de un motor de plantillas',
      'Serialización de datos a JSON y desventajas de los archivos JSON planos',
    ],
    ejercicios: [
      {
        titulo: 'Middleware global y por ruta',
        detalle: 'app.use() se aplica a toda petición; el middleware de ruta solo al endpoint indicado.',
        lang: 'javascript',
        code: "app.use((req, res, next) => {\n  console.log(req.method + ' ' + req.url);\n  next();\n});\n\napp.get('/perfil', verificarSesion, (req, res) => {\n  res.render('perfil');\n});",
      },
    ],
  },
  {
    parte: 'Parte 6',
    modulo: 'Módulo 7',
    titulo: 'Acceso a Datos en Aplicaciones Node',
    resumen: 'Persistencia avanzada, transacciones y ORM',
    temas: [
      'Pool de conexiones frente a conexiones individuales',
      'Qué son los cursores y cómo funcionan',
      'Transacciones SQL, UPDATE transaccional y ROLLBACK',
      'Propósito principal de un ORM',
      'Crear y actualizar registros con Sequelize',
      'Relaciones N:M, método belongsTo y acceso a datos vinculados en 1:N',
    ],
    ejercicios: [
      {
        titulo: 'Transacción con Sequelize',
        detalle: 'Confirmar los cambios con commit() o revertirlos con rollback() ante un error.',
        lang: 'javascript',
        code: 'const t = await sequelize.transaction();\ntry {\n  await Cuenta.update(\n    { saldo: nuevoSaldo },\n    { where: { id }, transaction: t }\n  );\n  await t.commit();\n} catch (error) {\n  await t.rollback();\n}',
      },
      {
        titulo: 'Asociación belongsTo',
        detalle: 'Un pedido pertenece a un cliente; se accede al dato relacionado con include.',
        lang: 'javascript',
        code: "Pedido.belongsTo(Cliente, { foreignKey: 'clienteId' });\n\nconst pedido = await Pedido.findOne({ include: Cliente });",
      },
    ],
  },
  {
    parte: 'Parte 7',
    modulo: 'Módulo 8',
    titulo: 'Implementación de API Backend Node Express',
    resumen: 'Buenas prácticas REST y autenticación con JWT',
    temas: [
      'JSON como formato de intercambio en servicios REST',
      'Uso semántico del verbo HTTP PUT y el verbo más seguro según REST',
      'Definición de rutas en Express y modularización',
      'El middleware incorporado express.json()',
      'Respuesta JSON forzando el código de estado 201 (Created)',
      'Objetivo del JWT, su generación en Node.js y prevención de vulnerabilidades',
    ],
    ejercicios: [
      {
        titulo: 'Ruta con respuesta 201',
        detalle: 'Crear un recurso y responder con el código de estado correcto en formato JSON.',
        lang: 'javascript',
        code: "app.use(express.json());\n\napp.post('/usuarios', (req, res) => {\n  const nuevoUsuario = crearUsuario(req.body);\n  res.status(201).json(nuevoUsuario);\n});",
      },
      {
        titulo: 'Generar un JWT',
        detalle: 'Firmar un token con una clave secreta fuera del código y un tiempo de expiración.',
        lang: 'javascript',
        code: "const jwt = require('jsonwebtoken');\n\nconst token = jwt.sign(\n  { id: usuario.id },\n  process.env.JWT_SECRET,\n  { expiresIn: '1h' }\n);",
      },
    ],
  },
];
