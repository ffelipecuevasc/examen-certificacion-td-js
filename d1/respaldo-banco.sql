PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE migracion (
  nombre      TEXT PRIMARY KEY,
  aplicada_en TEXT NOT NULL
);
INSERT INTO "migracion" ("nombre","aplicada_en") VALUES('001-banco-de-preguntas','2026-09-09');
INSERT INTO "migracion" ("nombre","aplicada_en") VALUES('002-fecha-de-modificacion','2026-09-09');
CREATE TABLE modulo (
  numero INTEGER PRIMARY KEY CHECK (numero BETWEEN 2 AND 8),
  titulo TEXT NOT NULL,
  icono  TEXT NOT NULL
);
INSERT INTO "modulo" ("numero","titulo","icono") VALUES(2,'Fundamentos de Desarrollo Front-End','devices');
INSERT INTO "modulo" ("numero","titulo","icono") VALUES(3,'Fundamentos de Programacion en JavaScript','data-object');
INSERT INTO "modulo" ("numero","titulo","icono") VALUES(4,'Programacion Avanzada en JavaScript','bolt');
INSERT INTO "modulo" ("numero","titulo","icono") VALUES(5,'Fundamentos de Bases de Datos Relacionales','database');
INSERT INTO "modulo" ("numero","titulo","icono") VALUES(6,'Desarrollo de Aplicaciones Web Node Express','dns');
INSERT INTO "modulo" ("numero","titulo","icono") VALUES(7,'Acceso a Datos en Aplicaciones Node','layers');
INSERT INTO "modulo" ("numero","titulo","icono") VALUES(8,'Implementacion de API Backend Node Express','shield-lock');
CREATE TABLE pregunta (
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

  creada_en       TEXT    NOT NULL DEFAULT (date('now')), fecha_modificacion TEXT,

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
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(1,2,'json_2026',1,'¿Qué limita estrictamente al Front-End en comparación con el Back-End en la arquitectura web?','El Front-End corre dentro del navegador, y el navegador no le da acceso al sistema de archivos del servidor: esa es una frontera de seguridad, no una limitación de las herramientas. Las otras tres describen cosas que el Front-End sí hace (estilos dinámicos) o que simplemente no son ciertas (ningún framework es obligatorio).',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(2,2,'json_2026',2,'¿Cuál es el rol fundamental del protocolo HTTP en la comunicación entre capas de desarrollo web?','HTTP es un protocolo sin estado: cada petición llega sin memoria de las anteriores, y por eso las sesiones hay que construirlas encima con cookies o tokens. Las otras tres atribuyen a HTTP trabajos que hacen CSS, el compilador o la base de datos.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(3,2,'json_2026',3,'En una arquitectura Fullstack clásica, ¿qué componente intermedio separa la lógica Front y Back?','La API es el contrato entre las dos capas: el Front-End pide y recibe datos sin saber cómo están guardados, y el Back-End los entrega sin saber cómo se van a dibujar. Esa separación es lo que permite cambiar un lado sin tocar el otro.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(4,2,'json_2026',4,'¿Para qué usaría primariamente el inspector del navegador un desarrollador Front-End al depurar?','El inspector sirve para las dos cosas a la vez: editar el DOM en vivo para probar un cambio sin recompilar, y mirar la pestaña de red para ver qué peticiones salieron y qué respondieron. Las otras tres describen tareas de servidor o de compilación, que no ocurren en el navegador.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(5,2,'json_2026',5,'Según la tríada de desarrollo web, ¿qué rol técnico fundamental asume JavaScript en cliente?','En la tríada, HTML pone la estructura, CSS la presentación y JavaScript el comportamiento: es el único de los tres que puede reaccionar a un evento y modificar el DOM después de que la página cargó. Las alternativas (a) y (b) describen justamente a HTML y a CSS.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(6,2,'json_2026',6,'En un formulario HTML5, ¿qué atributo del form define la URI destino al procesar datos enviados?','`action` es el atributo que dice a qué URI se envían los datos del formulario. `enctype` define cómo se codifican, `target` dónde se abre la respuesta, y `rel` ni siquiera pertenece a `<form>`.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(7,2,'json_2026',7,'¿Cuál es la función semántica estricta de la etiqueta `<aside>` según los estándares de HTML5?','`<aside>` es para contenido relacionado con el principal pero que puede separarse de él sin que el texto pierda sentido: una barra lateral, una nota al margen, un bloque de enlaces relacionados. Si el contenido fuera indispensable para entender la página, no iría en un `<aside>`.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(8,2,'json_2026',8,'¿Qué combinación de etiquetas HTML5 es correcta para instanciar un menú de opciones nativo?','El menú desplegable nativo de HTML es un `<select>` que contiene elementos `<option>`. Las otras tres combinan etiquetas que no existen en el estándar: `<dropdown>`, `<item>` y `<list>` son inventadas, y `<datalist>` existe pero acompaña a un `<input>`, no reemplaza al `<select>`.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(9,2,'json_2026',9,'¿Dónde deben declararse semánticamente los links a hojas de estilos externas y metadatos vitales?','El `<head>` es donde va todo lo que describe el documento sin dibujarse: hojas de estilo, metadatos, título. Poner ahí la hoja de estilos permite además que el navegador empiece a pedirla antes de encontrarse con el contenido. La alternativa (b) es el error clásico de confundirla con los scripts, que sí se ponen al final del `<body>` y por un motivo distinto: no bloquear el dibujado.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(10,2,'json_2026',10,'Para lograr accesibilidad, ¿qué etiqueta asocia lógicamente grupos de controles de formulario?','`<fieldset>` agrupa controles relacionados y, junto con `<legend>`, hace que un lector de pantalla anuncie a qué grupo pertenece cada campo. Las alternativas (a) y (c) son etiquetas inventadas, y (d) es un `<div>` con un rol ARIA: parcha la accesibilidad en vez de usar la etiqueta que ya existe para eso.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(11,2,'json_2026',11,'¿Qué atributo HTML asegura vincular explícita y unívocamente una etiqueta `<label>` con un input?','El atributo `for` del `<label>` apunta al `id` del campo, y ese vínculo hace dos cosas: el lector de pantalla anuncia la etiqueta al enfocar el campo, y hacer clic en el texto pone el cursor dentro. `name` sirve para enviar el dato, no para vincular.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(12,2,'json_2026',12,'En el modelo de cajas CSS, ¿qué propiedad añade espacio transparente externo perimetral al borde?','En el modelo de cajas, de adentro hacia afuera van contenido, `padding`, `border` y `margin`. El `margin` es el espacio exterior al borde, y es transparente: separa la caja de sus vecinas. El `padding` es el espacio interior, entre el contenido y el borde.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(13,2,'json_2026',13,'Según el cálculo de especificidad CSS, ¿cuál de los siguientes selectores prevalece en conflicto?','La especificidad se cuenta por categorías, y un identificador pesa más que cualquier cantidad de clases o elementos. Sólo (c) tiene un `#id`, así que gana sin necesidad de contar el resto: (a) suma dos clases, (b) una clase y cuatro elementos, y (d) sólo elementos.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(14,2,'json_2026',14,'¿Qué atajo media query CSS restringe la regla exclusivamente a Viewports de mínimo 1024px?','`min-width` significa «desde este ancho hacia arriba», así que la regla se aplica a viewports de 1024px o más. La (a) hace justo lo contrario con `max-width`, y las otras dos usan sintaxis que no existe.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(15,2,'json_2026',15,'¿Qué declaración box-sizing engloba el padding y el border en el cálculo del width total asignado?','Con `border-box`, el `width` que declaras es el ancho final de la caja: el `padding` y el `border` se descuentan hacia adentro en vez de sumarse. Con `content-box`, que es el valor por omisión, el `width` describe sólo el contenido y todo lo demás se suma encima.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(16,2,'json_2026',16,'Ante la colisión de estilos de distintos orígenes, y sin usar `!important`, ¿qué estilo CSS impone mayor prioridad?','En la cascada, un estilo puesto en el atributo `style` del elemento pesa más que cualquier regla de una hoja de estilos, venga de un archivo externo o de un `<style>` embebido. La alternativa (d) es el distractor que más enseña: el orden de los orígenes es navegador, luego usuario, luego autor, así que la hoja del usuario queda por debajo. Sólo se invierte con `!important`, y por eso el enunciado lo descarta.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(17,2,'json_2026',17,'¿Qué operador relacional CSS filtra afectando solo a los descendientes de primer grado (hijos)?','El signo `>` es el combinador de hijo directo: `div > p` afecta a los párrafos que cuelgan inmediatamente del `div`, no a los que están más abajo. El espacio alcanza a todos los descendientes, `+` al hermano inmediato y `~` a los hermanos siguientes.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(18,2,'json_2026',18,'¿Cuántas fracciones equitativas articulan como límite la arquitectura del grid de Bootstrap?','La grilla de Bootstrap divide cada fila en 12 columnas, y 12 se eligió porque se reparte en mitades, tercios, cuartos y sextos sin decimales. Por eso las clases van de `col-1` a `col-12` y la suma dentro de una fila debería dar 12.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(19,2,'json_2026',19,'¿Qué sufijo responsivo activa modificaciones de diseño en Bootstrap al superar el breakpoint grande?','El sufijo `lg` corresponde al breakpoint «grande», que en Bootstrap arranca en 992px. Los sufijos van de menor a mayor —`sm`, `md`, `lg`, `xl`— y cada uno aplica desde su ancho hacia arriba, no sólo dentro de un tramo.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(20,2,'json_2026',20,'¿Qué clase central de Bootstrap estabiliza el margen limitando y centrando el ancho del contenido?','`.container` fija un ancho máximo por cada breakpoint y centra el bloque con márgenes automáticos. `.container-fluid` hace lo contrario: ocupa siempre el 100% del ancho disponible. Las otras dos clases no existen en Bootstrap.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(21,2,'json_2026',21,'En el sistema de utilidades, ¿qué clase induce a un nodo tipo block a ocupar el 100% de su padre?','`.w-100` es la utilidad de ancho que fija `width: 100%`, de modo que el elemento ocupa todo el ancho de su contenedor padre. Las otras tres no existen en Bootstrap.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(22,2,'json_2026',22,'En Bootstrap 4, ¿qué propósito de interfaz cumple el componente jumbotron?','El jumbotron es un bloque destacado, con fondo y espaciado generosos, para resaltar el mensaje principal al comienzo de una página. El enunciado dice «en Bootstrap 4» a propósito: en Bootstrap 5 el componente se eliminó y su efecto se reconstruye combinando utilidades de fondo, borde y espaciado.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(23,2,'json_2026',23,'¿Bajo qué doctrina base se estructura algorítmicamente el flujo responsivo en Bootstrap por defecto?','Bootstrap está construido «mobile first»: los estilos base valen para pantallas chicas y las media queries usan `min-width` para ir agregando reglas hacia arriba. Por eso una clase sin sufijo, como `.col-6`, aplica desde el móvil en adelante.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(24,2,'json_2026',24,'En evaluación nativa de JavaScript, ¿qué método atrapa de forma veloz a un único nodo por su ID?','`getElementById()` va directo al índice interno de identificadores del documento, así que devuelve el nodo sin recorrer el árbol. `querySelector("[id]")` sí recorre y además devolvería el primer elemento que tenga cualquier `id`, no el que buscas; y `document.findAll()` no existe.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(25,2,'json_2026',25,'A nivel de memoria y asignación, ¿por qué es crítico utilizar "let" sobre "var" al iterar ciclos?','`var` se declara a nivel de función, así que en un bucle todas las vueltas comparten la misma variable, y una función definida dentro del ciclo termina viendo el último valor. `let` crea una variable nueva por cada iteración del bloque, y cada cierre captura la suya.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(26,2,'json_2026',26,'¿Qué detonante de evento del DOM percibe mutaciones confirmadas cuando el elemento pierde el foco?','`change` se dispara cuando el campo pierde el foco **y además** su valor cambió respecto de cuando lo ganó: por eso el enunciado dice «mutaciones confirmadas». `input` se dispara con cada tecla, sin esperar a que el campo se abandone.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(27,2,'json_2026',27,'Considerando la sintaxis funcional ES6, ¿qué sentencia declara una arrow function correctamente?','La sintaxis de una arrow function es lista de parámetros, flecha y cuerpo: `() => {}`. La (a) mezcla `function` con la flecha, que no se combinan; las otras dos no son sintaxis válida.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(28,2,'json_2026',28,'Si intentas reasignar una variable declarada con `const`, ¿qué ocurre en tiempo de ejecución?','Reasignar una variable declarada con `const` lanza un `TypeError` y corta la ejecución: el enlace entre el nombre y su valor es lo que `const` congela. Conviene no confundirlo con lo otro: si la constante apunta a un objeto o a un arreglo, **modificar su contenido está permitido** y no lanza nada. `const` protege la referencia, no lo referenciado.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(29,2,'json_2026',29,'Durante la fase de coerción implícita, ¿qué entrega la ejecución de la sentencia binaria "3" + 3?','Con el operador `+`, si uno de los operandos es una cadena, JavaScript convierte el otro a cadena y concatena: `"3" + 3` da `"33"`, del tipo String. Es el `+` el que se comporta así; con `-`, `*` o `/` la conversión va hacia número y `"3" - 3` daría `0`.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(30,2,'json_2026',30,'Al cargar jQuery, ¿qué símbolo queda definido como atajo de la función `jQuery`?','jQuery define la variable global `$` como atajo de la función `jQuery`, y por eso todo el código de la librería empieza con ese símbolo. Son la misma función con dos nombres: `$("#x")` y `jQuery("#x")` hacen lo mismo. Y como `$` es una variable corriente, se puede soltar con `jQuery.noConflict()` cuando otra librería la reclama.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(31,2,'json_2026',31,'¿Cuál es el patrón estandarizado para adjuntar manejadores "click" en nodos asíncronos vía jQuery?','`.on("click", ...)` es la forma vigente de asociar manejadores en jQuery, y es la que además permite delegar en un ancestro para que funcione con nodos que todavía no existen al momento de registrarla. `.bindClick()` y `.eventListener()` no existen, y la (b) dispara el clic en vez de escucharlo.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(32,2,'json_2026',32,'¿Qué directriz bloquea la ejecución de scripts en jQuery hasta asegurar que el árbol DOM está listo?','`$(document).ready()` retrasa la ejecución hasta que el árbol DOM está construido, de modo que los selectores encuentren los elementos. Sin eso, un script en el `<head>` correría antes de que existieran los nodos que busca. Las otras tres no existen.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(33,2,'json_2026',33,'Al parsear datos, ¿qué función encapsula jQuery para forzar la lectura del contenido de un `<input>`?','`.val()` lee y escribe el valor de los controles de formulario, que es donde vive el contenido de un `<input>`. `.text()` y `.html()` trabajan sobre el contenido entre etiquetas de apertura y cierre, y un `<input>` no tiene: es un elemento vacío.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(34,2,'json_2026',34,'¿Qué técnica animada nativa de jQuery altera gradualmente la opacidad hasta colapsar el nodo visual?','`.fadeOut()` baja la opacidad de forma gradual y, al terminar, oculta el elemento. `.hide()` lo esconde de golpe, `.slideUp()` lo colapsa por altura en vez de por opacidad, y `.collapse()` no es de jQuery sino de Bootstrap.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(35,2,'json_2026',35,'¿Qué mutación estructural consolida temporalmente ''git add'' en la topología de un flujo versionado?','`git add` mueve los cambios del directorio de trabajo al área de preparación, que es una zona intermedia donde se arma el próximo commit. No guarda nada en la historia todavía: eso lo hace `git commit`, que es la alternativa (b).',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(36,2,'json_2026',36,'Al gatillar ''git commit'' careciendo de archivos indexados previos, ¿qué respuesta retorna Git CLI?','Sin nada en el área de preparación no hay cambios que registrar, así que Git aborta e informa que no hay nada que confirmar. No inventa un commit vacío ni guarda el directorio de trabajo por su cuenta.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(37,2,'json_2026',37,'Frente a múltiples vectores de desarrollo, ¿qué previene tácticamente el aislamiento en ramas (branch)?','Una rama aísla el trabajo en curso, de modo que el código a medio hacer no se mezcla con la línea principal hasta que alguien lo revise e integre. Las otras tres describen problemas de disco, de red o de criptografía, que no son lo que las ramas resuelven.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(38,2,'json_2026',39,'En presencia de un Merge Conflict grave, ¿qué protocolo manual asume irrevocablemente el usuario?','Ante un conflicto, Git marca las zonas en disputa dentro del archivo y se detiene: es la persona quien decide qué código queda y luego confirma la resolución con un commit. Las otras tres son maniobras para esquivar el conflicto, y todas pierden trabajo.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(39,2,'json_2026',40,'¿Cuál es la disparidad motriz exacta entre invocar "git fetch" frente a procesar un "git pull"?','`git fetch` trae los commits del remoto y actualiza las ramas de seguimiento, sin tocar tu rama de trabajo: puedes mirar qué llegó antes de integrarlo. `git pull` hace ese mismo `fetch` y además lo fusiona en tu rama en el mismo acto.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(40,2,'js_2026',1,'¿Cuál es la principal responsabilidad arquitectónica del rol Front-End en una aplicación web moderna?','El rol Front-End se ocupa de lo que ocurre en el navegador: construir la interfaz y responder a lo que hace la persona. La lógica de negocio, la base de datos y la configuración del servidor pertenecen al Back-End o a operaciones.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(41,2,'js_2026',2,'¿Cuál selector CSS posee mayor especificidad entre un ID, una clase, un elemento y un pseudo-elemento?','En el cálculo de especificidad, los identificadores forman una categoría que pesa más que las clases, y las clases más que los elementos y pseudo-elementos. Un solo `#id` le gana a cualquier cantidad de clases.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(42,2,'js_2026',3,'¿Qué regla CSS se utiliza para aplicar estilos condicionales basados en el ancho de la pantalla?','`@media` es la regla que condiciona estilos a las características del dispositivo, y `max-width: 768px` los aplica desde ese ancho hacia abajo. Las otras tres son sintaxis inventada: no existen `@responsive`, `@viewport` con esa forma ni `@screen`.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(43,2,'js_2026',4,'En el sistema de grillas de Bootstrap, ¿en cuántas columnas iguales se divide por defecto una fila?','Bootstrap divide cada fila en 12 columnas, número elegido por ser divisible en mitades, tercios, cuartos y sextos sin decimales.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(44,2,'js_2026',5,'¿Qué método nativo de JavaScript retorna el primer elemento que coincida con un selector CSS específico?','`querySelector()` acepta cualquier selector CSS y devuelve el primer elemento que coincida, o `null` si no hay ninguno. `querySelectorAll()` devuelve todos, y los dos `getElement...` sólo buscan por id o por clase, sin admitir selectores compuestos.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(45,2,'js_2026',6,'¿Qué evento de JavaScript se dispara inmediatamente cuando un elemento HTML pierde el foco?','`blur` se dispara en cuanto el elemento pierde el foco, haya cambiado su valor o no. Es lo que lo separa de `change`, que además exige que el valor sea distinto del que tenía al recibir el foco.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(46,2,'js_2026',7,'¿Cuál es el ámbito (scope) de una variable declarada con la palabra clave let dentro de un bloque?','`let` tiene alcance de bloque: existe sólo entre las llaves donde se declaró, incluidas las de un `if` o un `for`. Es lo que la separa de `var`, que tiene alcance de función y se filtra fuera del bloque.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(47,2,'js_2026',8,'En jQuery, ¿qué método se utiliza para cambiar o extraer el contenido HTML interno de un elemento?','`.html()` lee o reemplaza el contenido HTML interno del elemento, interpretando las etiquetas. `.text()` hace lo mismo pero tratando todo como texto plano, y `.val()` trabaja sobre el valor de los controles de formulario.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(48,2,'js_2026',9,'¿Cómo se asocia un evento de clic a un botón utilizando la sintaxis estándar de la librería jQuery?','`$("button").click(function() { })` es el atajo de jQuery para registrar un manejador de clic. La (b) es JavaScript nativo y además está incompleta, y las otras dos usan métodos que jQuery no tiene.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(49,2,'js_2026',10,'¿Qué comando de Git registra oficialmente los cambios preparados (staging) en el repositorio local?','`git commit` toma lo que está en el área de preparación y lo registra en la historia del repositorio local. `git add` sólo prepara, `git push` envía al remoto lo ya confirmado, y `git status` no escribe nada.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(50,2,'js_2026',11,'¿Qué comando de Git permite crear una nueva rama y cambiar a ella de manera simultánea?','Los dos comandos crean la rama y se cambian a ella en un solo paso: `git checkout -b` es la forma clásica y `git switch --create` la moderna, que Git introdujo justamente para separar el cambio de rama de la restauración de archivos. Por eso la respuesta correcta es la que las reconoce a ambas, y por eso esta pregunta no se puede barajar: su alternativa (d) nombra a las otras dos por su letra.',NULL,1,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(51,2,'js_2026',12,'En GitHub, ¿qué propósito principal cumple la creación de un Pull Request (PR)?','Un Pull Request propone integrar una rama en otra y abre el espacio donde se revisa y comenta el cambio antes de fusionarlo. Es una función de la plataforma, no de Git: sirve para que la integración pase por una revisión.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
INSERT INTO "pregunta" ("id","modulo","origen","numero_origen","enunciado","justificacion","dificultad","orden_fijo","estado","motivo_retiro","retirada_en","reemplazada_por","creada_en","fecha_modificacion") VALUES(52,2,'js_2026',13,'¿Qué sucede cuando Git detecta modificaciones concurrentes en la misma línea durante una unión?','Cuando dos ramas modifican la misma línea, Git no puede decidir cuál gana: marca el conflicto dentro del archivo y detiene la fusión hasta que alguien lo resuelva a mano. No sobrescribe ni descarta nada por su cuenta.',NULL,0,'activa',NULL,NULL,NULL,'2026-09-09',NULL);
CREATE TABLE alternativa (
  id          INTEGER PRIMARY KEY,
  pregunta_id INTEGER NOT NULL REFERENCES pregunta (id) ON DELETE CASCADE,

  letra       TEXT    NOT NULL CHECK (letra IN ('a', 'b', 'c', 'd')),
  orden       INTEGER NOT NULL CHECK (orden BETWEEN 1 AND 4),
  texto       TEXT    NOT NULL,
  es_correcta INTEGER NOT NULL DEFAULT 0 CHECK (es_correcta IN (0, 1)),

  UNIQUE (pregunta_id, letra),
  UNIQUE (pregunta_id, orden)
);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(1,1,'a',1,'No interactuar directo con el sistema de archivos del servidor.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(2,1,'b',2,'No puede renderizar estilos dinámicos del lado del usuario.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(3,1,'c',3,'No admite la visualización directa de código ofuscado.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(4,1,'d',4,'Requiere obligatoriamente un framework de interfaz de usuario.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(5,2,'a',1,'Dar estilo visual avanzado a la página web renderizada en cliente.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(6,2,'b',2,'Permitir comunicación sin estado entre el cliente y el servidor.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(7,2,'c',3,'Compilar el código JavaScript antes de su envío a producción.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(8,2,'d',4,'Gestionar sesiones de usuario de forma nativa en la base de datos.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(9,3,'a',1,'El motor de renderizado del navegador del cliente.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(10,3,'b',2,'La Interfaz de Programación de Aplicaciones (API).',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(11,3,'c',3,'El sistema de control de versiones centralizado.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(12,3,'d',4,'El modelo de cajas jerárquico del CSS.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(13,4,'a',1,'Para compilar código fuente directamente a WebAssembly en consola.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(14,4,'b',2,'Para estructurar entidades y tablas en la base de datos remota.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(15,4,'c',3,'Para modificar el DOM en vivo y auditar peticiones HTTP de red.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(16,4,'d',4,'Para reiniciar o purgar la caché del servidor web de backend.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(17,5,'a',1,'Definir la semántica y jerarquía de nodos en la vista web.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(18,5,'b',2,'Especificar reglas de diseño, colorimetría y adaptabilidad.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(19,5,'c',3,'Controlar el comportamiento lógico y mutación dinámica del DOM.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(20,5,'d',4,'Ejecutar consultas nativas SQL sobre los datos locales en disco.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(21,6,'a',1,'enctype',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(22,6,'b',2,'action',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(23,6,'c',3,'target',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(24,6,'d',4,'rel',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(25,7,'a',1,'Demarcar un contenido fundamental que debe leerse primero.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(26,7,'b',2,'Contener información periférica conectada al flujo principal.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(27,7,'c',3,'Aislar scripts externos del cuerpo de la página en el header.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(28,7,'d',4,'Declarar legalmente los datos de autoría en el pie de página.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(29,8,'a',1,'`<select>` como contenedor lógico de múltiples opciones `<option>`.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(30,8,'b',2,'`<dropdown>` inicializando múltiples atributos `<item>` internos.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(31,8,'c',3,'`<datalist>` anidando colecciones estáticas de nodos `<list>`.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(32,8,'d',4,'`<menu>` controlando estructuralmente subetiquetas `<input>`.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(33,9,'a',1,'Como hijos directos dentro del contenedor `<head>`.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(34,9,'b',2,'Justo antes del cierre del `</body>` para acelerar el renderizado.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(35,9,'c',3,'Anidados en el primer nodo `<header>` del documento.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(36,9,'d',4,'Como metadatos configurados en atributos de la etiqueta `<html>`.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(37,10,'a',1,'`<form-section>`',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(38,10,'b',2,'`<fieldset>`',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(39,10,'c',3,'`<control-group>`',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(40,10,'d',4,'`<div role="form">`',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(41,11,'a',1,'href',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(42,11,'b',2,'name',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(43,11,'c',3,'for',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(44,11,'d',4,'form',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(45,12,'a',1,'outline',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(46,12,'b',2,'margin',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(47,12,'c',3,'border-spacing',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(48,12,'d',4,'padding',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(49,13,'a',1,'form input.active:hover',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(50,13,'b',2,'header nav.main-menu ul li',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(51,13,'c',3,'#main-container .btn-primary',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(52,13,'d',4,'article > p::first-line',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(53,14,'a',1,'@media screen and (max-width: 1024px)',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(54,14,'b',2,'@media (min-width: 1024px)',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(55,14,'c',3,'@media only (width >= 1024px)',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(56,14,'d',4,'@media viewport (size > 1024px)',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(57,15,'a',1,'margin-box',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(58,15,'b',2,'padding-box',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(59,15,'c',3,'border-box',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(60,15,'d',4,'content-box',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(61,16,'a',1,'Selectores inyectados mediante archivos externos al final del head.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(62,16,'b',2,'Bloques embebidos en una etiqueta style sin directiva important.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(63,16,'c',3,'El estilo incrustado directamente utilizando el atributo en línea.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(64,16,'d',4,'Directivas del navegador cliente definidas por el usuario.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(65,17,'a',1,'Espacio general ( )',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(66,17,'b',2,'Signo más (+)',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(67,17,'c',3,'Tilde general (~)',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(68,17,'d',4,'Signo mayor que (>)',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(69,18,'a',1,'8 bloques.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(70,18,'b',2,'12 columnas.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(71,18,'c',3,'16 sectores.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(72,18,'d',4,'24 celdillas.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(73,19,'a',1,'.col-md-',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(74,19,'b',2,'.col-xl-',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(75,19,'c',3,'.col-lg-',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(76,19,'d',4,'.col-sm-',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(77,20,'a',1,'.container-fluid',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(78,20,'b',2,'.container',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(79,20,'c',3,'.wrapper-box',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(80,20,'d',4,'.col-centered',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(81,21,'a',1,'.w-100',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(82,21,'b',2,'.full-width',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(83,21,'c',3,'.d-max',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(84,21,'d',4,'.btn-fill',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(85,22,'a',1,'Controlar migraciones asíncronas de datos en formato modal.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(86,22,'b',2,'Crear un cajón semántico envolvente resaltando contenido maestro.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(87,22,'c',3,'Generar alertas automáticas colapsables en la esquina del viewport.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(88,22,'d',4,'Formatear validaciones cruzadas en sub-formularios anidados.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(89,23,'a',1,'Desktop First, degradando reglas complejas.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(90,23,'b',2,'Mobile First, escalando media queries en aumento.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(91,23,'c',3,'Fluid First, forzando dimensiones relativas al 100%.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(92,23,'d',4,'Media First, aislando impresión y lectura interactiva.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(93,24,'a',1,'document.getElementById()',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(94,24,'b',2,'document.querySelector("[id]")',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(95,24,'c',3,'document.getElementsByName()[0]',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(96,24,'d',4,'document.findAll()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(97,25,'a',1,'let previene fugas de alcance limitando la variable al bloque léxico.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(98,25,'b',2,'"var" causa desbordamiento de memoria por sobreescritura estricta.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(99,25,'c',3,'"let" desactiva por completo el motor de recolección de basura.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(100,25,'d',4,'"var" restringe mutaciones en tipos compuestos como arreglos.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(101,26,'a',1,'onkeyup',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(102,26,'b',2,'onsubmit',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(103,26,'c',3,'onchange',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(104,26,'d',4,'oninput',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(105,27,'a',1,'const run = function() => {}',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(106,27,'b',2,'const run = () => {}',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(107,27,'c',3,'let run => function() {}',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(108,27,'d',4,'var run = arrow() {}',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(109,28,'a',1,'Una evasión pasiva, alterando solo la copia profunda local.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(110,28,'b',2,'Una interrupción global por ReferenceError inalcanzable.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(111,28,'c',3,'Un corte forzado de ejecución levantando un TypeError.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(112,28,'d',4,'El sistema ignora y anula silenciosamente los cambios aplicados.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(113,29,'a',1,'El tipo Number 6, sumando el logaritmo binario subyacente.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(114,29,'b',2,'Un fallo inminente evaluado como NaN irremediable.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(115,29,'c',3,'Un SyntaxError al mezclar primitivas incompatibles por diseño.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(116,29,'d',4,'El tipo String ''33'', priorizando concatenación sobre adición.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(117,30,'a',1,'La doble directiva jQ().',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(118,30,'b',2,'El prefijo subrayado _.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(119,30,'c',3,'El símbolo monetario $.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(120,30,'d',4,'El apuntador simbólico &.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(121,31,'a',1,'$("#nodo").on("click", function() {});',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(122,31,'b',2,'document.getElementById("nodo").click();',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(123,31,'c',3,'$(".nodo").bindClick(function() {});',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(124,31,'d',4,'$("#nodo").eventListener("click");',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(125,32,'a',1,'$(window).loadHandler(function() {});',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(126,32,'b',2,'$(document).ready(function() {});',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(127,32,'c',3,'$.initDOM(function() {});',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(128,32,'d',4,'$(html).awaitComplete(function() {});',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(129,33,'a',1,'.contentNode()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(130,33,'b',2,'.text()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(131,33,'c',3,'.html()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(132,33,'d',4,'.val()',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(133,34,'a',1,'.hide()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(134,34,'b',2,'.collapse()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(135,34,'c',3,'.fadeOut()',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(136,34,'d',4,'.slideUp()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(137,35,'a',1,'Indexa cambios brutos del working directory hacia el Staging Area.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(138,35,'b',2,'Persiste instantáneas en el repositorio local (HEAD).',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(139,35,'c',3,'Traslada ramas paralelas sobre la estructura del código matriz.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(140,35,'d',4,'Proyecta deltas de código directamente al clúster remoto.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(141,36,'a',1,'Consolida instantáneamente un bypass guardando el working copy.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(142,36,'b',2,'Aborta bloqueando la firma al no existir cambios en staging.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(143,36,'c',3,'Imprime un log de aviso mientras fusiona el repositorio origen.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(144,36,'d',4,'Sobrescribe los metadatos forzando un historial completamente vacío.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(145,37,'a',1,'Saturar el disco local con instantáneas redundantes e inservibles.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(146,37,'b',2,'Bloqueos de red al empujar datos corruptos hacia GitHub server.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(147,37,'c',3,'Rupturas y colisiones críticas al inyectar código no verificado.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(148,37,'d',4,'Extravío criptográfico de las claves SHA-1 vinculadas al commit.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(149,38,'a',1,'Resetear remotamente borrando su clon local mediante flag --hard.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(150,38,'b',2,'Intervenir los archivos conflictivos y sellar con un nuevo commit.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(151,38,'c',3,'Evadir marcas de conflicto forzando subidas push --force locales.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(152,38,'d',4,'Abortar la rama y delegar dependencias mediante directivas stash.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(153,39,'a',1,'''fetch'' descarga al caché remoto; ''pull'' integra eso a tu trabajo.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(154,39,'b',2,'''fetch'' sobrescribe tu historia local; ''pull'' solo lee punteros.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(155,39,'c',3,'''pull'' revierte fallas de red; ''fetch'' reconstruye commits rotos.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(156,39,'d',4,'Son estrictamente sinónimos, ejecutando idéntica rutina binaria.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(157,40,'a',1,'Gestionar la lógica de negocio y la base de datos central.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(158,40,'b',2,'Renderizar la interfaz y gestionar la interacción del usuario.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(159,40,'c',3,'Configurar el servidor web y los protocolos de red TCP/IP.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(160,40,'d',4,'Orquestar contenedores Docker para el despliegue continuo.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(161,41,'a',1,'El selector de elementos básicos.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(162,41,'b',2,'El selector de clases y atributos.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(163,41,'c',3,'El selector de identificadores (ID).',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(164,41,'d',4,'El selector de pseudo-elementos.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(165,42,'a',1,'@media screen and (max-width: 768px)',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(166,42,'b',2,'@responsive query min-width 768px',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(167,42,'c',3,'@viewport device-width = 768px',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(168,42,'d',4,'@screen layout condition (768px)',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(169,43,'a',1,'En 8 columnas flexibles.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(170,43,'b',2,'En 12 columnas flexibles.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(171,43,'c',3,'En 10 columnas flexibles.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(172,43,'d',4,'En 16 columnas flexibles.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(173,44,'a',1,'document.getElementById()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(174,44,'b',2,'document.getElementsByClassName()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(175,44,'c',3,'document.querySelector()',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(176,44,'d',4,'document.querySelectorAll()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(177,45,'a',1,'El evento blur',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(178,45,'b',2,'El evento focus',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(179,45,'c',3,'El evento change',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(180,45,'d',4,'El evento input',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(181,46,'a',1,'Ámbito global en todo el documento script.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(182,46,'b',2,'Ámbito de función dentro de la función padre.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(183,46,'c',3,'Ámbito de bloque delimitado por llaves {}.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(184,46,'d',4,'Ámbito léxico accesible solo en el módulo.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(185,47,'a',1,'El método .text()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(186,47,'b',2,'El método .html()',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(187,47,'c',3,'El método .val()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(188,47,'d',4,'El método .attr()',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(189,48,'a',1,'$("button").click(function() { })',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(190,48,'b',2,'document.addEventListener("click")',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(191,48,'c',3,'$("button").onEvent("click")',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(192,48,'d',4,'jQuery.bindClick("button")',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(193,49,'a',1,'git add .',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(194,49,'b',2,'git commit -m "mensaje"',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(195,49,'c',3,'git push origin main',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(196,49,'d',4,'git status',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(197,50,'a',1,'git branch -n <rama>',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(198,50,'b',2,'git checkout -b <rama>',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(199,50,'c',3,'git switch --create <rama>',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(200,50,'d',4,'Ambas B y C son correctas.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(201,51,'a',1,'Descargar código remoto al disco duro.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(202,51,'b',2,'Solicitar la integración de ramas y revisión.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(203,51,'c',3,'Forzar el borrado de una rama en conflicto.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(204,51,'d',4,'Sincronizar tags de versiones estables.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(205,52,'a',1,'Sobrescribe automáticamente el archivo nuevo.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(206,52,'b',2,'Genera un conflicto que requiere edición manual.',1);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(207,52,'c',3,'Cancela la operación y elimina el repositorio.',0);
INSERT INTO "alternativa" ("id","pregunta_id","letra","orden","texto","es_correcta") VALUES(208,52,'d',4,'Crea un branch temporal de respaldo oculto.',0);
CREATE UNIQUE INDEX alternativa_una_correcta
  ON alternativa (pregunta_id) WHERE es_correcta = 1;
CREATE INDEX pregunta_por_estado_y_modulo
  ON pregunta (estado, modulo);
CREATE INDEX pregunta_reemplazos
  ON pregunta (reemplazada_por) WHERE reemplazada_por IS NOT NULL;
CREATE VIEW pregunta_activa AS
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
