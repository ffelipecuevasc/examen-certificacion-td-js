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
  "entorno": "nube",
  "generada_en": "2026-09-10T12:46:23.730Z",
  "preguntas": 174,
  "descartadas": 0
};

/** El banco, con la misma forma que devuelve /api/preguntas. */
export const PREGUNTAS = [
  {
    "id": 1,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué limita estrictamente al Front-End en comparación con el Back-End en la arquitectura web?",
    "justificacion": "El Front-End corre dentro del navegador, y el navegador no le da acceso al sistema de archivos del servidor: esa es una frontera de seguridad, no una limitación de las herramientas. Las otras tres describen cosas que el Front-End sí hace (estilos dinámicos) o que simplemente no son ciertas (ningún framework es obligatorio).",
    "dificultad": null,
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
        "texto": "No puede renderizar estilos dinámicos del lado del usuario.",
        "es_correcta": 0
      },
      {
        "id": 3,
        "letra": "c",
        "orden": 3,
        "texto": "No admite la visualización directa de código ofuscado.",
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
    "id": 2,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuál es el rol fundamental del protocolo HTTP en la comunicación entre capas de desarrollo web?",
    "justificacion": "HTTP es un protocolo sin estado: cada petición llega sin memoria de las anteriores, y por eso las sesiones hay que construirlas encima con cookies o tokens. Las otras tres atribuyen a HTTP trabajos que hacen CSS, el compilador o la base de datos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 5,
        "letra": "a",
        "orden": 1,
        "texto": "Dar estilo visual avanzado a la página web renderizada en cliente.",
        "es_correcta": 0
      },
      {
        "id": 6,
        "letra": "b",
        "orden": 2,
        "texto": "Permitir comunicación sin estado entre el cliente y el servidor.",
        "es_correcta": 1
      },
      {
        "id": 7,
        "letra": "c",
        "orden": 3,
        "texto": "Compilar el código JavaScript antes de su envío a producción.",
        "es_correcta": 0
      },
      {
        "id": 8,
        "letra": "d",
        "orden": 4,
        "texto": "Gestionar sesiones de usuario de forma nativa en la base de datos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 3,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En una arquitectura Fullstack clásica, ¿qué componente intermedio separa la lógica Front y Back?",
    "justificacion": "La API es el contrato entre las dos capas: el Front-End pide y recibe datos sin saber cómo están guardados, y el Back-End los entrega sin saber cómo se van a dibujar. Esa separación es lo que permite cambiar un lado sin tocar el otro.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 9,
        "letra": "a",
        "orden": 1,
        "texto": "El motor de renderizado del navegador del cliente.",
        "es_correcta": 0
      },
      {
        "id": 10,
        "letra": "b",
        "orden": 2,
        "texto": "La Interfaz de Programación de Aplicaciones (API).",
        "es_correcta": 1
      },
      {
        "id": 11,
        "letra": "c",
        "orden": 3,
        "texto": "El sistema de control de versiones centralizado.",
        "es_correcta": 0
      },
      {
        "id": 12,
        "letra": "d",
        "orden": 4,
        "texto": "El modelo de cajas jerárquico del CSS.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 4,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Para qué usaría primariamente el inspector del navegador un desarrollador Front-End al depurar?",
    "justificacion": "El inspector sirve para las dos cosas a la vez: editar el DOM en vivo para probar un cambio sin recompilar, y mirar la pestaña de red para ver qué peticiones salieron y qué respondieron. Las otras tres describen tareas de servidor o de compilación, que no ocurren en el navegador.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 13,
        "letra": "a",
        "orden": 1,
        "texto": "Para compilar código fuente directamente a WebAssembly en consola.",
        "es_correcta": 0
      },
      {
        "id": 14,
        "letra": "b",
        "orden": 2,
        "texto": "Para estructurar entidades y tablas en la base de datos remota.",
        "es_correcta": 0
      },
      {
        "id": 15,
        "letra": "c",
        "orden": 3,
        "texto": "Para modificar el DOM en vivo y auditar peticiones HTTP de red.",
        "es_correcta": 1
      },
      {
        "id": 16,
        "letra": "d",
        "orden": 4,
        "texto": "Para reiniciar o purgar la caché del servidor web de backend.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 5,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Según la tríada de desarrollo web, ¿qué rol técnico fundamental asume JavaScript en cliente?",
    "justificacion": "En la tríada, HTML pone la estructura, CSS la presentación y JavaScript el comportamiento: es el único de los tres que puede reaccionar a un evento y modificar el DOM después de que la página cargó. Las alternativas (a) y (b) describen justamente a HTML y a CSS.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 17,
        "letra": "a",
        "orden": 1,
        "texto": "Definir la semántica y jerarquía de nodos en la vista web.",
        "es_correcta": 0
      },
      {
        "id": 18,
        "letra": "b",
        "orden": 2,
        "texto": "Especificar reglas de diseño, colorimetría y adaptabilidad.",
        "es_correcta": 0
      },
      {
        "id": 19,
        "letra": "c",
        "orden": 3,
        "texto": "Controlar el comportamiento lógico y mutación dinámica del DOM.",
        "es_correcta": 1
      },
      {
        "id": 20,
        "letra": "d",
        "orden": 4,
        "texto": "Ejecutar consultas nativas SQL sobre los datos locales en disco.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 6,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En un formulario HTML5, ¿qué atributo del form define la URI destino al procesar datos enviados?",
    "justificacion": "`action` es el atributo que dice a qué URI se envían los datos del formulario. `enctype` define cómo se codifican, `target` dónde se abre la respuesta, y `rel` ni siquiera pertenece a `<form>`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 21,
        "letra": "a",
        "orden": 1,
        "texto": "enctype",
        "es_correcta": 0
      },
      {
        "id": 22,
        "letra": "b",
        "orden": 2,
        "texto": "action",
        "es_correcta": 1
      },
      {
        "id": 23,
        "letra": "c",
        "orden": 3,
        "texto": "target",
        "es_correcta": 0
      },
      {
        "id": 24,
        "letra": "d",
        "orden": 4,
        "texto": "rel",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 7,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuál es la función semántica estricta de la etiqueta `<aside>` según los estándares de HTML5?",
    "justificacion": "`<aside>` es para contenido relacionado con el principal pero que puede separarse de él sin que el texto pierda sentido: una barra lateral, una nota al margen, un bloque de enlaces relacionados. Si el contenido fuera indispensable para entender la página, no iría en un `<aside>`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 25,
        "letra": "a",
        "orden": 1,
        "texto": "Demarcar un contenido fundamental que debe leerse primero.",
        "es_correcta": 0
      },
      {
        "id": 26,
        "letra": "b",
        "orden": 2,
        "texto": "Contener información periférica conectada al flujo principal.",
        "es_correcta": 1
      },
      {
        "id": 27,
        "letra": "c",
        "orden": 3,
        "texto": "Aislar scripts externos del cuerpo de la página en el header.",
        "es_correcta": 0
      },
      {
        "id": 28,
        "letra": "d",
        "orden": 4,
        "texto": "Declarar legalmente los datos de autoría en el pie de página.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 8,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué combinación de etiquetas HTML5 es correcta para instanciar un menú de opciones nativo?",
    "justificacion": "El menú desplegable nativo de HTML es un `<select>` que contiene elementos `<option>`. Las otras tres combinan etiquetas que no existen en el estándar: `<dropdown>`, `<item>` y `<list>` son inventadas, y `<datalist>` existe pero acompaña a un `<input>`, no reemplaza al `<select>`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 29,
        "letra": "a",
        "orden": 1,
        "texto": "`<select>` como contenedor lógico de múltiples opciones `<option>`.",
        "es_correcta": 1
      },
      {
        "id": 30,
        "letra": "b",
        "orden": 2,
        "texto": "`<dropdown>` inicializando múltiples atributos `<item>` internos.",
        "es_correcta": 0
      },
      {
        "id": 31,
        "letra": "c",
        "orden": 3,
        "texto": "`<datalist>` anidando colecciones estáticas de nodos `<list>`.",
        "es_correcta": 0
      },
      {
        "id": 32,
        "letra": "d",
        "orden": 4,
        "texto": "`<menu>` controlando estructuralmente subetiquetas `<input>`.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 9,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Dónde deben declararse semánticamente los links a hojas de estilos externas y metadatos vitales?",
    "justificacion": "El `<head>` es donde va todo lo que describe el documento sin dibujarse: hojas de estilo, metadatos, título. Poner ahí la hoja de estilos permite además que el navegador empiece a pedirla antes de encontrarse con el contenido. La alternativa (b) es el error clásico de confundirla con los scripts, que sí se ponen al final del `<body>` y por un motivo distinto: no bloquear el dibujado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 33,
        "letra": "a",
        "orden": 1,
        "texto": "Como hijos directos dentro del contenedor `<head>`.",
        "es_correcta": 1
      },
      {
        "id": 34,
        "letra": "b",
        "orden": 2,
        "texto": "Justo antes del cierre del `</body>` para acelerar el renderizado.",
        "es_correcta": 0
      },
      {
        "id": 35,
        "letra": "c",
        "orden": 3,
        "texto": "Anidados en el primer nodo `<header>` del documento.",
        "es_correcta": 0
      },
      {
        "id": 36,
        "letra": "d",
        "orden": 4,
        "texto": "Como metadatos configurados en atributos de la etiqueta `<html>`.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 10,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Para lograr accesibilidad, ¿qué etiqueta asocia lógicamente grupos de controles de formulario?",
    "justificacion": "`<fieldset>` agrupa controles relacionados y, junto con `<legend>`, hace que un lector de pantalla anuncie a qué grupo pertenece cada campo. Las alternativas (a) y (c) son etiquetas inventadas, y (d) es un `<div>` con un rol ARIA: parcha la accesibilidad en vez de usar la etiqueta que ya existe para eso.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 37,
        "letra": "a",
        "orden": 1,
        "texto": "`<form-section>`",
        "es_correcta": 0
      },
      {
        "id": 38,
        "letra": "b",
        "orden": 2,
        "texto": "`<fieldset>`",
        "es_correcta": 1
      },
      {
        "id": 39,
        "letra": "c",
        "orden": 3,
        "texto": "`<control-group>`",
        "es_correcta": 0
      },
      {
        "id": 40,
        "letra": "d",
        "orden": 4,
        "texto": "`<div role=\"form\">`",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 11,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué atributo HTML asegura vincular explícita y unívocamente una etiqueta `<label>` con un input?",
    "justificacion": "El atributo `for` del `<label>` apunta al `id` del campo, y ese vínculo hace dos cosas: el lector de pantalla anuncia la etiqueta al enfocar el campo, y hacer clic en el texto pone el cursor dentro. `name` sirve para enviar el dato, no para vincular.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 41,
        "letra": "a",
        "orden": 1,
        "texto": "href",
        "es_correcta": 0
      },
      {
        "id": 42,
        "letra": "b",
        "orden": 2,
        "texto": "name",
        "es_correcta": 0
      },
      {
        "id": 43,
        "letra": "c",
        "orden": 3,
        "texto": "for",
        "es_correcta": 1
      },
      {
        "id": 44,
        "letra": "d",
        "orden": 4,
        "texto": "form",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 12,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En el modelo de cajas CSS, ¿qué propiedad añade espacio transparente externo perimetral al borde?",
    "justificacion": "En el modelo de cajas, de adentro hacia afuera van contenido, `padding`, `border` y `margin`. El `margin` es el espacio exterior al borde, y es transparente: separa la caja de sus vecinas. El `padding` es el espacio interior, entre el contenido y el borde.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 45,
        "letra": "a",
        "orden": 1,
        "texto": "outline",
        "es_correcta": 0
      },
      {
        "id": 46,
        "letra": "b",
        "orden": 2,
        "texto": "margin",
        "es_correcta": 1
      },
      {
        "id": 47,
        "letra": "c",
        "orden": 3,
        "texto": "border-spacing",
        "es_correcta": 0
      },
      {
        "id": 48,
        "letra": "d",
        "orden": 4,
        "texto": "padding",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 13,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Según el cálculo de especificidad CSS, ¿cuál de los siguientes selectores prevalece en conflicto?",
    "justificacion": "La especificidad se cuenta por categorías, y un identificador pesa más que cualquier cantidad de clases o elementos. Sólo (c) tiene un `#id`, así que gana sin necesidad de contar el resto: (a) suma dos clases, (b) una clase y cuatro elementos, y (d) sólo elementos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 49,
        "letra": "a",
        "orden": 1,
        "texto": "form input.active:hover",
        "es_correcta": 0
      },
      {
        "id": 50,
        "letra": "b",
        "orden": 2,
        "texto": "header nav.main-menu ul li",
        "es_correcta": 0
      },
      {
        "id": 51,
        "letra": "c",
        "orden": 3,
        "texto": "#main-container .btn-primary",
        "es_correcta": 1
      },
      {
        "id": 52,
        "letra": "d",
        "orden": 4,
        "texto": "article > p::first-line",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 14,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué atajo media query CSS restringe la regla exclusivamente a Viewports de mínimo 1024px?",
    "justificacion": "`min-width` significa «desde este ancho hacia arriba», así que la regla se aplica a viewports de 1024px o más. La (a) hace justo lo contrario con `max-width`, y las otras dos usan sintaxis que no existe.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 53,
        "letra": "a",
        "orden": 1,
        "texto": "@media screen and (max-width: 1024px)",
        "es_correcta": 0
      },
      {
        "id": 54,
        "letra": "b",
        "orden": 2,
        "texto": "@media (min-width: 1024px)",
        "es_correcta": 1
      },
      {
        "id": 55,
        "letra": "c",
        "orden": 3,
        "texto": "@media only (width >= 1024px)",
        "es_correcta": 0
      },
      {
        "id": 56,
        "letra": "d",
        "orden": 4,
        "texto": "@media viewport (size > 1024px)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 15,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué declaración box-sizing engloba el padding y el border en el cálculo del width total asignado?",
    "justificacion": "Con `border-box`, el `width` que declaras es el ancho final de la caja: el `padding` y el `border` se descuentan hacia adentro en vez de sumarse. Con `content-box`, que es el valor por omisión, el `width` describe sólo el contenido y todo lo demás se suma encima.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 57,
        "letra": "a",
        "orden": 1,
        "texto": "margin-box",
        "es_correcta": 0
      },
      {
        "id": 58,
        "letra": "b",
        "orden": 2,
        "texto": "padding-box",
        "es_correcta": 0
      },
      {
        "id": 59,
        "letra": "c",
        "orden": 3,
        "texto": "border-box",
        "es_correcta": 1
      },
      {
        "id": 60,
        "letra": "d",
        "orden": 4,
        "texto": "content-box",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 16,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Ante la colisión de estilos de distintos orígenes, y sin usar `!important`, ¿qué estilo CSS impone mayor prioridad?",
    "justificacion": "En la cascada, un estilo puesto en el atributo `style` del elemento pesa más que cualquier regla de una hoja de estilos, venga de un archivo externo o de un `<style>` embebido. La alternativa (d) es el distractor que más enseña: el orden de los orígenes es navegador, luego usuario, luego autor, así que la hoja del usuario queda por debajo. Sólo se invierte con `!important`, y por eso el enunciado lo descarta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 61,
        "letra": "a",
        "orden": 1,
        "texto": "Selectores inyectados mediante archivos externos al final del head.",
        "es_correcta": 0
      },
      {
        "id": 62,
        "letra": "b",
        "orden": 2,
        "texto": "Bloques embebidos en una etiqueta style sin directiva important.",
        "es_correcta": 0
      },
      {
        "id": 63,
        "letra": "c",
        "orden": 3,
        "texto": "El estilo incrustado directamente utilizando el atributo en línea.",
        "es_correcta": 1
      },
      {
        "id": 64,
        "letra": "d",
        "orden": 4,
        "texto": "Directivas del navegador cliente definidas por el usuario.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 17,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué operador relacional CSS filtra afectando solo a los descendientes de primer grado (hijos)?",
    "justificacion": "El signo `>` es el combinador de hijo directo: `div > p` afecta a los párrafos que cuelgan inmediatamente del `div`, no a los que están más abajo. El espacio alcanza a todos los descendientes, `+` al hermano inmediato y `~` a los hermanos siguientes.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 65,
        "letra": "a",
        "orden": 1,
        "texto": "Espacio general ( )",
        "es_correcta": 0
      },
      {
        "id": 66,
        "letra": "b",
        "orden": 2,
        "texto": "Signo más (+)",
        "es_correcta": 0
      },
      {
        "id": 67,
        "letra": "c",
        "orden": 3,
        "texto": "Tilde general (~)",
        "es_correcta": 0
      },
      {
        "id": 68,
        "letra": "d",
        "orden": 4,
        "texto": "Signo mayor que (>)",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 18,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuántas fracciones equitativas articulan como límite la arquitectura del grid de Bootstrap?",
    "justificacion": "La grilla de Bootstrap divide cada fila en 12 columnas, y 12 se eligió porque se reparte en mitades, tercios, cuartos y sextos sin decimales. Por eso las clases van de `col-1` a `col-12` y la suma dentro de una fila debería dar 12.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 69,
        "letra": "a",
        "orden": 1,
        "texto": "8 bloques.",
        "es_correcta": 0
      },
      {
        "id": 70,
        "letra": "b",
        "orden": 2,
        "texto": "12 columnas.",
        "es_correcta": 1
      },
      {
        "id": 71,
        "letra": "c",
        "orden": 3,
        "texto": "16 sectores.",
        "es_correcta": 0
      },
      {
        "id": 72,
        "letra": "d",
        "orden": 4,
        "texto": "24 celdillas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 19,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué sufijo responsivo activa modificaciones de diseño en Bootstrap al superar el breakpoint grande?",
    "justificacion": "El sufijo `lg` corresponde al breakpoint «grande», que en Bootstrap arranca en 992px. Los sufijos van de menor a mayor —`sm`, `md`, `lg`, `xl`— y cada uno aplica desde su ancho hacia arriba, no sólo dentro de un tramo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 73,
        "letra": "a",
        "orden": 1,
        "texto": ".col-md-",
        "es_correcta": 0
      },
      {
        "id": 74,
        "letra": "b",
        "orden": 2,
        "texto": ".col-xl-",
        "es_correcta": 0
      },
      {
        "id": 75,
        "letra": "c",
        "orden": 3,
        "texto": ".col-lg-",
        "es_correcta": 1
      },
      {
        "id": 76,
        "letra": "d",
        "orden": 4,
        "texto": ".col-sm-",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 20,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué clase central de Bootstrap estabiliza el margen limitando y centrando el ancho del contenido?",
    "justificacion": "`.container` fija un ancho máximo por cada breakpoint y centra el bloque con márgenes automáticos. `.container-fluid` hace lo contrario: ocupa siempre el 100% del ancho disponible. Las otras dos clases no existen en Bootstrap.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 77,
        "letra": "a",
        "orden": 1,
        "texto": ".container-fluid",
        "es_correcta": 0
      },
      {
        "id": 78,
        "letra": "b",
        "orden": 2,
        "texto": ".container",
        "es_correcta": 1
      },
      {
        "id": 79,
        "letra": "c",
        "orden": 3,
        "texto": ".wrapper-box",
        "es_correcta": 0
      },
      {
        "id": 80,
        "letra": "d",
        "orden": 4,
        "texto": ".col-centered",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 21,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En el sistema de utilidades, ¿qué clase induce a un nodo tipo block a ocupar el 100% de su padre?",
    "justificacion": "`.w-100` es la utilidad de ancho que fija `width: 100%`, de modo que el elemento ocupa todo el ancho de su contenedor padre. Las otras tres no existen en Bootstrap.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 81,
        "letra": "a",
        "orden": 1,
        "texto": ".w-100",
        "es_correcta": 1
      },
      {
        "id": 82,
        "letra": "b",
        "orden": 2,
        "texto": ".full-width",
        "es_correcta": 0
      },
      {
        "id": 83,
        "letra": "c",
        "orden": 3,
        "texto": ".d-max",
        "es_correcta": 0
      },
      {
        "id": 84,
        "letra": "d",
        "orden": 4,
        "texto": ".btn-fill",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 22,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En Bootstrap 4, ¿qué propósito de interfaz cumple el componente jumbotron?",
    "justificacion": "El jumbotron es un bloque destacado, con fondo y espaciado generosos, para resaltar el mensaje principal al comienzo de una página. El enunciado dice «en Bootstrap 4» a propósito: en Bootstrap 5 el componente se eliminó y su efecto se reconstruye combinando utilidades de fondo, borde y espaciado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 85,
        "letra": "a",
        "orden": 1,
        "texto": "Controlar migraciones asíncronas de datos en formato modal.",
        "es_correcta": 0
      },
      {
        "id": 86,
        "letra": "b",
        "orden": 2,
        "texto": "Crear un cajón semántico envolvente resaltando contenido maestro.",
        "es_correcta": 1
      },
      {
        "id": 87,
        "letra": "c",
        "orden": 3,
        "texto": "Generar alertas automáticas colapsables en la esquina del viewport.",
        "es_correcta": 0
      },
      {
        "id": 88,
        "letra": "d",
        "orden": 4,
        "texto": "Formatear validaciones cruzadas en sub-formularios anidados.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 23,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Bajo qué doctrina base se estructura algorítmicamente el flujo responsivo en Bootstrap por defecto?",
    "justificacion": "Bootstrap está construido «mobile first»: los estilos base valen para pantallas chicas y las media queries usan `min-width` para ir agregando reglas hacia arriba. Por eso una clase sin sufijo, como `.col-6`, aplica desde el móvil en adelante.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 89,
        "letra": "a",
        "orden": 1,
        "texto": "Desktop First, degradando reglas complejas.",
        "es_correcta": 0
      },
      {
        "id": 90,
        "letra": "b",
        "orden": 2,
        "texto": "Mobile First, escalando media queries en aumento.",
        "es_correcta": 1
      },
      {
        "id": 91,
        "letra": "c",
        "orden": 3,
        "texto": "Fluid First, forzando dimensiones relativas al 100%.",
        "es_correcta": 0
      },
      {
        "id": 92,
        "letra": "d",
        "orden": 4,
        "texto": "Media First, aislando impresión y lectura interactiva.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 24,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En evaluación nativa de JavaScript, ¿qué método atrapa de forma veloz a un único nodo por su ID?",
    "justificacion": "`getElementById()` va directo al índice interno de identificadores del documento, así que devuelve el nodo sin recorrer el árbol. `querySelector(\"[id]\")` sí recorre y además devolvería el primer elemento que tenga cualquier `id`, no el que buscas; y `document.findAll()` no existe.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 93,
        "letra": "a",
        "orden": 1,
        "texto": "document.getElementById()",
        "es_correcta": 1
      },
      {
        "id": 94,
        "letra": "b",
        "orden": 2,
        "texto": "document.querySelector(\"[id]\")",
        "es_correcta": 0
      },
      {
        "id": 95,
        "letra": "c",
        "orden": 3,
        "texto": "document.getElementsByName()[0]",
        "es_correcta": 0
      },
      {
        "id": 96,
        "letra": "d",
        "orden": 4,
        "texto": "document.findAll()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 25,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "A nivel de memoria y asignación, ¿por qué es crítico utilizar \"let\" sobre \"var\" al iterar ciclos?",
    "justificacion": "`var` se declara a nivel de función, así que en un bucle todas las vueltas comparten la misma variable, y una función definida dentro del ciclo termina viendo el último valor. `let` crea una variable nueva por cada iteración del bloque, y cada cierre captura la suya.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 97,
        "letra": "a",
        "orden": 1,
        "texto": "let previene fugas de alcance limitando la variable al bloque léxico.",
        "es_correcta": 1
      },
      {
        "id": 98,
        "letra": "b",
        "orden": 2,
        "texto": "\"var\" causa desbordamiento de memoria por sobreescritura estricta.",
        "es_correcta": 0
      },
      {
        "id": 99,
        "letra": "c",
        "orden": 3,
        "texto": "\"let\" desactiva por completo el motor de recolección de basura.",
        "es_correcta": 0
      },
      {
        "id": 100,
        "letra": "d",
        "orden": 4,
        "texto": "\"var\" restringe mutaciones en tipos compuestos como arreglos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 26,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué detonante de evento del DOM percibe mutaciones confirmadas cuando el elemento pierde el foco?",
    "justificacion": "`change` se dispara cuando el campo pierde el foco **y además** su valor cambió respecto de cuando lo ganó: por eso el enunciado dice «mutaciones confirmadas». `input` se dispara con cada tecla, sin esperar a que el campo se abandone.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 101,
        "letra": "a",
        "orden": 1,
        "texto": "onkeyup",
        "es_correcta": 0
      },
      {
        "id": 102,
        "letra": "b",
        "orden": 2,
        "texto": "onsubmit",
        "es_correcta": 0
      },
      {
        "id": 103,
        "letra": "c",
        "orden": 3,
        "texto": "onchange",
        "es_correcta": 1
      },
      {
        "id": 104,
        "letra": "d",
        "orden": 4,
        "texto": "oninput",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 27,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Considerando la sintaxis funcional ES6, ¿qué sentencia declara una arrow function correctamente?",
    "justificacion": "La sintaxis de una arrow function es lista de parámetros, flecha y cuerpo: `() => {}`. La (a) mezcla `function` con la flecha, que no se combinan; las otras dos no son sintaxis válida.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 105,
        "letra": "a",
        "orden": 1,
        "texto": "const run = function() => {}",
        "es_correcta": 0
      },
      {
        "id": 106,
        "letra": "b",
        "orden": 2,
        "texto": "const run = () => {}",
        "es_correcta": 1
      },
      {
        "id": 107,
        "letra": "c",
        "orden": 3,
        "texto": "let run => function() {}",
        "es_correcta": 0
      },
      {
        "id": 108,
        "letra": "d",
        "orden": 4,
        "texto": "var run = arrow() {}",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 28,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Si intentas reasignar una variable declarada con `const`, ¿qué ocurre en tiempo de ejecución?",
    "justificacion": "Reasignar una variable declarada con `const` lanza un `TypeError` y corta la ejecución: el enlace entre el nombre y su valor es lo que `const` congela. Conviene no confundirlo con lo otro: si la constante apunta a un objeto o a un arreglo, **modificar su contenido está permitido** y no lanza nada. `const` protege la referencia, no lo referenciado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 109,
        "letra": "a",
        "orden": 1,
        "texto": "Una evasión pasiva, alterando solo la copia profunda local.",
        "es_correcta": 0
      },
      {
        "id": 110,
        "letra": "b",
        "orden": 2,
        "texto": "Una interrupción global por ReferenceError inalcanzable.",
        "es_correcta": 0
      },
      {
        "id": 111,
        "letra": "c",
        "orden": 3,
        "texto": "Un corte forzado de ejecución levantando un TypeError.",
        "es_correcta": 1
      },
      {
        "id": 112,
        "letra": "d",
        "orden": 4,
        "texto": "El sistema ignora y anula silenciosamente los cambios aplicados.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 29,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Durante la fase de coerción implícita, ¿qué entrega la ejecución de la sentencia binaria \"3\" + 3?",
    "justificacion": "Con el operador `+`, si uno de los operandos es una cadena, JavaScript convierte el otro a cadena y concatena: `\"3\" + 3` da `\"33\"`, del tipo String. Es el `+` el que se comporta así; con `-`, `*` o `/` la conversión va hacia número y `\"3\" - 3` daría `0`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 113,
        "letra": "a",
        "orden": 1,
        "texto": "El tipo Number 6, sumando el logaritmo binario subyacente.",
        "es_correcta": 0
      },
      {
        "id": 114,
        "letra": "b",
        "orden": 2,
        "texto": "Un fallo inminente evaluado como NaN irremediable.",
        "es_correcta": 0
      },
      {
        "id": 115,
        "letra": "c",
        "orden": 3,
        "texto": "Un SyntaxError al mezclar primitivas incompatibles por diseño.",
        "es_correcta": 0
      },
      {
        "id": 116,
        "letra": "d",
        "orden": 4,
        "texto": "El tipo String '33', priorizando concatenación sobre adición.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 30,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Al cargar jQuery, ¿qué símbolo queda definido como atajo de la función `jQuery`?",
    "justificacion": "jQuery define la variable global `$` como atajo de la función `jQuery`, y por eso todo el código de la librería empieza con ese símbolo. Son la misma función con dos nombres: `$(\"#x\")` y `jQuery(\"#x\")` hacen lo mismo. Y como `$` es una variable corriente, se puede soltar con `jQuery.noConflict()` cuando otra librería la reclama.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 117,
        "letra": "a",
        "orden": 1,
        "texto": "La doble directiva jQ().",
        "es_correcta": 0
      },
      {
        "id": 118,
        "letra": "b",
        "orden": 2,
        "texto": "El prefijo subrayado _.",
        "es_correcta": 0
      },
      {
        "id": 119,
        "letra": "c",
        "orden": 3,
        "texto": "El símbolo monetario $.",
        "es_correcta": 1
      },
      {
        "id": 120,
        "letra": "d",
        "orden": 4,
        "texto": "El apuntador simbólico &.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 31,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuál es el patrón estandarizado para adjuntar manejadores \"click\" en nodos asíncronos vía jQuery?",
    "justificacion": "`.on(\"click\", ...)` es la forma vigente de asociar manejadores en jQuery, y es la que además permite delegar en un ancestro para que funcione con nodos que todavía no existen al momento de registrarla. `.bindClick()` y `.eventListener()` no existen, y la (b) dispara el clic en vez de escucharlo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 121,
        "letra": "a",
        "orden": 1,
        "texto": "$(\"#nodo\").on(\"click\", function() {});",
        "es_correcta": 1
      },
      {
        "id": 122,
        "letra": "b",
        "orden": 2,
        "texto": "document.getElementById(\"nodo\").click();",
        "es_correcta": 0
      },
      {
        "id": 123,
        "letra": "c",
        "orden": 3,
        "texto": "$(\".nodo\").bindClick(function() {});",
        "es_correcta": 0
      },
      {
        "id": 124,
        "letra": "d",
        "orden": 4,
        "texto": "$(\"#nodo\").eventListener(\"click\");",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 32,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué directriz bloquea la ejecución de scripts en jQuery hasta asegurar que el árbol DOM está listo?",
    "justificacion": "`$(document).ready()` retrasa la ejecución hasta que el árbol DOM está construido, de modo que los selectores encuentren los elementos. Sin eso, un script en el `<head>` correría antes de que existieran los nodos que busca. Las otras tres no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 125,
        "letra": "a",
        "orden": 1,
        "texto": "$(window).loadHandler(function() {});",
        "es_correcta": 0
      },
      {
        "id": 126,
        "letra": "b",
        "orden": 2,
        "texto": "$(document).ready(function() {});",
        "es_correcta": 1
      },
      {
        "id": 127,
        "letra": "c",
        "orden": 3,
        "texto": "$.initDOM(function() {});",
        "es_correcta": 0
      },
      {
        "id": 128,
        "letra": "d",
        "orden": 4,
        "texto": "$(html).awaitComplete(function() {});",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 33,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Al parsear datos, ¿qué función encapsula jQuery para forzar la lectura del contenido de un `<input>`?",
    "justificacion": "`.val()` lee y escribe el valor de los controles de formulario, que es donde vive el contenido de un `<input>`. `.text()` y `.html()` trabajan sobre el contenido entre etiquetas de apertura y cierre, y un `<input>` no tiene: es un elemento vacío.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 129,
        "letra": "a",
        "orden": 1,
        "texto": ".contentNode()",
        "es_correcta": 0
      },
      {
        "id": 130,
        "letra": "b",
        "orden": 2,
        "texto": ".text()",
        "es_correcta": 0
      },
      {
        "id": 131,
        "letra": "c",
        "orden": 3,
        "texto": ".html()",
        "es_correcta": 0
      },
      {
        "id": 132,
        "letra": "d",
        "orden": 4,
        "texto": ".val()",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 34,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué técnica animada nativa de jQuery altera gradualmente la opacidad hasta colapsar el nodo visual?",
    "justificacion": "`.fadeOut()` baja la opacidad de forma gradual y, al terminar, oculta el elemento. `.hide()` lo esconde de golpe, `.slideUp()` lo colapsa por altura en vez de por opacidad, y `.collapse()` no es de jQuery sino de Bootstrap.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 133,
        "letra": "a",
        "orden": 1,
        "texto": ".hide()",
        "es_correcta": 0
      },
      {
        "id": 134,
        "letra": "b",
        "orden": 2,
        "texto": ".collapse()",
        "es_correcta": 0
      },
      {
        "id": 135,
        "letra": "c",
        "orden": 3,
        "texto": ".fadeOut()",
        "es_correcta": 1
      },
      {
        "id": 136,
        "letra": "d",
        "orden": 4,
        "texto": ".slideUp()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 35,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué mutación estructural consolida temporalmente 'git add' en la topología de un flujo versionado?",
    "justificacion": "`git add` mueve los cambios del directorio de trabajo al área de preparación, que es una zona intermedia donde se arma el próximo commit. No guarda nada en la historia todavía: eso lo hace `git commit`, que es la alternativa (b).",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 137,
        "letra": "a",
        "orden": 1,
        "texto": "Indexa cambios brutos del working directory hacia el Staging Area.",
        "es_correcta": 1
      },
      {
        "id": 138,
        "letra": "b",
        "orden": 2,
        "texto": "Persiste instantáneas en el repositorio local (HEAD).",
        "es_correcta": 0
      },
      {
        "id": 139,
        "letra": "c",
        "orden": 3,
        "texto": "Traslada ramas paralelas sobre la estructura del código matriz.",
        "es_correcta": 0
      },
      {
        "id": 140,
        "letra": "d",
        "orden": 4,
        "texto": "Proyecta deltas de código directamente al clúster remoto.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 36,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Al gatillar 'git commit' careciendo de archivos indexados previos, ¿qué respuesta retorna Git CLI?",
    "justificacion": "Sin nada en el área de preparación no hay cambios que registrar, así que Git aborta e informa que no hay nada que confirmar. No inventa un commit vacío ni guarda el directorio de trabajo por su cuenta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 141,
        "letra": "a",
        "orden": 1,
        "texto": "Consolida instantáneamente un bypass guardando el working copy.",
        "es_correcta": 0
      },
      {
        "id": 142,
        "letra": "b",
        "orden": 2,
        "texto": "Aborta bloqueando la firma al no existir cambios en staging.",
        "es_correcta": 1
      },
      {
        "id": 143,
        "letra": "c",
        "orden": 3,
        "texto": "Imprime un log de aviso mientras fusiona el repositorio origen.",
        "es_correcta": 0
      },
      {
        "id": 144,
        "letra": "d",
        "orden": 4,
        "texto": "Sobrescribe los metadatos forzando un historial completamente vacío.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 37,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "Frente a múltiples vectores de desarrollo, ¿qué previene tácticamente el aislamiento en ramas (branch)?",
    "justificacion": "Una rama aísla el trabajo en curso, de modo que el código a medio hacer no se mezcla con la línea principal hasta que alguien lo revise e integre. Las otras tres describen problemas de disco, de red o de criptografía, que no son lo que las ramas resuelven.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 145,
        "letra": "a",
        "orden": 1,
        "texto": "Saturar el disco local con instantáneas redundantes e inservibles.",
        "es_correcta": 0
      },
      {
        "id": 146,
        "letra": "b",
        "orden": 2,
        "texto": "Bloqueos de red al empujar datos corruptos hacia GitHub server.",
        "es_correcta": 0
      },
      {
        "id": 147,
        "letra": "c",
        "orden": 3,
        "texto": "Rupturas y colisiones críticas al inyectar código no verificado.",
        "es_correcta": 1
      },
      {
        "id": 148,
        "letra": "d",
        "orden": 4,
        "texto": "Extravío criptográfico de las claves SHA-1 vinculadas al commit.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 38,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En presencia de un Merge Conflict grave, ¿qué protocolo manual asume irrevocablemente el usuario?",
    "justificacion": "Ante un conflicto, Git marca las zonas en disputa dentro del archivo y se detiene: es la persona quien decide qué código queda y luego confirma la resolución con un commit. Las otras tres son maniobras para esquivar el conflicto, y todas pierden trabajo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 149,
        "letra": "a",
        "orden": 1,
        "texto": "Resetear remotamente borrando su clon local mediante flag --hard.",
        "es_correcta": 0
      },
      {
        "id": 150,
        "letra": "b",
        "orden": 2,
        "texto": "Intervenir los archivos conflictivos y sellar con un nuevo commit.",
        "es_correcta": 1
      },
      {
        "id": 151,
        "letra": "c",
        "orden": 3,
        "texto": "Evadir marcas de conflicto forzando subidas push --force locales.",
        "es_correcta": 0
      },
      {
        "id": 152,
        "letra": "d",
        "orden": 4,
        "texto": "Abortar la rama y delegar dependencias mediante directivas stash.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 39,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuál es la disparidad motriz exacta entre invocar \"git fetch\" frente a procesar un \"git pull\"?",
    "justificacion": "`git fetch` trae los commits del remoto y actualiza las ramas de seguimiento, sin tocar tu rama de trabajo: puedes mirar qué llegó antes de integrarlo. `git pull` hace ese mismo `fetch` y además lo fusiona en tu rama en el mismo acto.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 153,
        "letra": "a",
        "orden": 1,
        "texto": "'fetch' descarga al caché remoto; 'pull' integra eso a tu trabajo.",
        "es_correcta": 1
      },
      {
        "id": 154,
        "letra": "b",
        "orden": 2,
        "texto": "'fetch' sobrescribe tu historia local; 'pull' solo lee punteros.",
        "es_correcta": 0
      },
      {
        "id": 155,
        "letra": "c",
        "orden": 3,
        "texto": "'pull' revierte fallas de red; 'fetch' reconstruye commits rotos.",
        "es_correcta": 0
      },
      {
        "id": 156,
        "letra": "d",
        "orden": 4,
        "texto": "Son estrictamente sinónimos, ejecutando idéntica rutina binaria.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 40,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuál es la principal responsabilidad arquitectónica del rol Front-End en una aplicación web moderna?",
    "justificacion": "El rol Front-End se ocupa de lo que ocurre en el navegador: construir la interfaz y responder a lo que hace la persona. La lógica de negocio, la base de datos y la configuración del servidor pertenecen al Back-End o a operaciones.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 157,
        "letra": "a",
        "orden": 1,
        "texto": "Gestionar la lógica de negocio y la base de datos central.",
        "es_correcta": 0
      },
      {
        "id": 158,
        "letra": "b",
        "orden": 2,
        "texto": "Renderizar la interfaz y gestionar la interacción del usuario.",
        "es_correcta": 1
      },
      {
        "id": 159,
        "letra": "c",
        "orden": 3,
        "texto": "Configurar el servidor web y los protocolos de red TCP/IP.",
        "es_correcta": 0
      },
      {
        "id": 160,
        "letra": "d",
        "orden": 4,
        "texto": "Orquestar contenedores Docker para el despliegue continuo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 41,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuál selector CSS posee mayor especificidad entre un ID, una clase, un elemento y un pseudo-elemento?",
    "justificacion": "En el cálculo de especificidad, los identificadores forman una categoría que pesa más que las clases, y las clases más que los elementos y pseudo-elementos. Un solo `#id` le gana a cualquier cantidad de clases.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 161,
        "letra": "a",
        "orden": 1,
        "texto": "El selector de elementos básicos.",
        "es_correcta": 0
      },
      {
        "id": 162,
        "letra": "b",
        "orden": 2,
        "texto": "El selector de clases y atributos.",
        "es_correcta": 0
      },
      {
        "id": 163,
        "letra": "c",
        "orden": 3,
        "texto": "El selector de identificadores (ID).",
        "es_correcta": 1
      },
      {
        "id": 164,
        "letra": "d",
        "orden": 4,
        "texto": "El selector de pseudo-elementos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 42,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué regla CSS se utiliza para aplicar estilos condicionales basados en el ancho de la pantalla?",
    "justificacion": "`@media` es la regla que condiciona estilos a las características del dispositivo, y `max-width: 768px` los aplica desde ese ancho hacia abajo. Las otras tres son sintaxis inventada: no existen `@responsive`, `@viewport` con esa forma ni `@screen`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 165,
        "letra": "a",
        "orden": 1,
        "texto": "@media screen and (max-width: 768px)",
        "es_correcta": 1
      },
      {
        "id": 166,
        "letra": "b",
        "orden": 2,
        "texto": "@responsive query min-width 768px",
        "es_correcta": 0
      },
      {
        "id": 167,
        "letra": "c",
        "orden": 3,
        "texto": "@viewport device-width = 768px",
        "es_correcta": 0
      },
      {
        "id": 168,
        "letra": "d",
        "orden": 4,
        "texto": "@screen layout condition (768px)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 43,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En el sistema de grillas de Bootstrap, ¿en cuántas columnas iguales se divide por defecto una fila?",
    "justificacion": "Bootstrap divide cada fila en 12 columnas, número elegido por ser divisible en mitades, tercios, cuartos y sextos sin decimales.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 169,
        "letra": "a",
        "orden": 1,
        "texto": "En 8 columnas flexibles.",
        "es_correcta": 0
      },
      {
        "id": 170,
        "letra": "b",
        "orden": 2,
        "texto": "En 12 columnas flexibles.",
        "es_correcta": 1
      },
      {
        "id": 171,
        "letra": "c",
        "orden": 3,
        "texto": "En 10 columnas flexibles.",
        "es_correcta": 0
      },
      {
        "id": 172,
        "letra": "d",
        "orden": 4,
        "texto": "En 16 columnas flexibles.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 44,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué método nativo de JavaScript retorna el primer elemento que coincida con un selector CSS específico?",
    "justificacion": "`querySelector()` acepta cualquier selector CSS y devuelve el primer elemento que coincida, o `null` si no hay ninguno. `querySelectorAll()` devuelve todos, y los dos `getElement...` sólo buscan por id o por clase, sin admitir selectores compuestos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 173,
        "letra": "a",
        "orden": 1,
        "texto": "document.getElementById()",
        "es_correcta": 0
      },
      {
        "id": 174,
        "letra": "b",
        "orden": 2,
        "texto": "document.getElementsByClassName()",
        "es_correcta": 0
      },
      {
        "id": 175,
        "letra": "c",
        "orden": 3,
        "texto": "document.querySelector()",
        "es_correcta": 1
      },
      {
        "id": 176,
        "letra": "d",
        "orden": 4,
        "texto": "document.querySelectorAll()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 45,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué evento de JavaScript se dispara inmediatamente cuando un elemento HTML pierde el foco?",
    "justificacion": "`blur` se dispara en cuanto el elemento pierde el foco, haya cambiado su valor o no. Es lo que lo separa de `change`, que además exige que el valor sea distinto del que tenía al recibir el foco.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 177,
        "letra": "a",
        "orden": 1,
        "texto": "El evento blur",
        "es_correcta": 1
      },
      {
        "id": 178,
        "letra": "b",
        "orden": 2,
        "texto": "El evento focus",
        "es_correcta": 0
      },
      {
        "id": 179,
        "letra": "c",
        "orden": 3,
        "texto": "El evento change",
        "es_correcta": 0
      },
      {
        "id": 180,
        "letra": "d",
        "orden": 4,
        "texto": "El evento input",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 46,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cuál es el ámbito (scope) de una variable declarada con la palabra clave let dentro de un bloque?",
    "justificacion": "`let` tiene alcance de bloque: existe sólo entre las llaves donde se declaró, incluidas las de un `if` o un `for`. Es lo que la separa de `var`, que tiene alcance de función y se filtra fuera del bloque.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 181,
        "letra": "a",
        "orden": 1,
        "texto": "Ámbito global en todo el documento script.",
        "es_correcta": 0
      },
      {
        "id": 182,
        "letra": "b",
        "orden": 2,
        "texto": "Ámbito de función dentro de la función padre.",
        "es_correcta": 0
      },
      {
        "id": 183,
        "letra": "c",
        "orden": 3,
        "texto": "Ámbito de bloque delimitado por llaves {}.",
        "es_correcta": 1
      },
      {
        "id": 184,
        "letra": "d",
        "orden": 4,
        "texto": "Ámbito léxico accesible solo en el módulo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 47,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En jQuery, ¿qué método se utiliza para cambiar o extraer el contenido HTML interno de un elemento?",
    "justificacion": "`.html()` lee o reemplaza el contenido HTML interno del elemento, interpretando las etiquetas. `.text()` hace lo mismo pero tratando todo como texto plano, y `.val()` trabaja sobre el valor de los controles de formulario.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 185,
        "letra": "a",
        "orden": 1,
        "texto": "El método .text()",
        "es_correcta": 0
      },
      {
        "id": 186,
        "letra": "b",
        "orden": 2,
        "texto": "El método .html()",
        "es_correcta": 1
      },
      {
        "id": 187,
        "letra": "c",
        "orden": 3,
        "texto": "El método .val()",
        "es_correcta": 0
      },
      {
        "id": 188,
        "letra": "d",
        "orden": 4,
        "texto": "El método .attr()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 48,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Cómo se asocia un evento de clic a un botón utilizando la sintaxis estándar de la librería jQuery?",
    "justificacion": "`$(\"button\").click(function() { })` es el atajo de jQuery para registrar un manejador de clic. La (b) es JavaScript nativo y además está incompleta, y las otras dos usan métodos que jQuery no tiene.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 189,
        "letra": "a",
        "orden": 1,
        "texto": "$(\"button\").click(function() { })",
        "es_correcta": 1
      },
      {
        "id": 190,
        "letra": "b",
        "orden": 2,
        "texto": "document.addEventListener(\"click\")",
        "es_correcta": 0
      },
      {
        "id": 191,
        "letra": "c",
        "orden": 3,
        "texto": "$(\"button\").onEvent(\"click\")",
        "es_correcta": 0
      },
      {
        "id": 192,
        "letra": "d",
        "orden": 4,
        "texto": "jQuery.bindClick(\"button\")",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 49,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué comando de Git registra oficialmente los cambios preparados (staging) en el repositorio local?",
    "justificacion": "`git commit` toma lo que está en el área de preparación y lo registra en la historia del repositorio local. `git add` sólo prepara, `git push` envía al remoto lo ya confirmado, y `git status` no escribe nada.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 193,
        "letra": "a",
        "orden": 1,
        "texto": "git add .",
        "es_correcta": 0
      },
      {
        "id": 194,
        "letra": "b",
        "orden": 2,
        "texto": "git commit -m \"mensaje\"",
        "es_correcta": 1
      },
      {
        "id": 195,
        "letra": "c",
        "orden": 3,
        "texto": "git push origin main",
        "es_correcta": 0
      },
      {
        "id": 196,
        "letra": "d",
        "orden": 4,
        "texto": "git status",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 50,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué comando de Git permite crear una nueva rama y cambiar a ella de manera simultánea?",
    "justificacion": "Los dos comandos crean la rama y se cambian a ella en un solo paso: `git checkout -b` es la forma clásica y `git switch --create` la moderna, que Git introdujo justamente para separar el cambio de rama de la restauración de archivos. Por eso la respuesta correcta es la que las reconoce a ambas, y por eso esta pregunta no se puede barajar: su alternativa (d) nombra a las otras dos por su letra.",
    "dificultad": null,
    "orden_fijo": 1,
    "alternativas": [
      {
        "id": 197,
        "letra": "a",
        "orden": 1,
        "texto": "git branch -n <rama>",
        "es_correcta": 0
      },
      {
        "id": 198,
        "letra": "b",
        "orden": 2,
        "texto": "git checkout -b <rama>",
        "es_correcta": 0
      },
      {
        "id": 199,
        "letra": "c",
        "orden": 3,
        "texto": "git switch --create <rama>",
        "es_correcta": 0
      },
      {
        "id": 200,
        "letra": "d",
        "orden": 4,
        "texto": "Ambas B y C son correctas.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 51,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "En GitHub, ¿qué propósito principal cumple la creación de un Pull Request (PR)?",
    "justificacion": "Un Pull Request propone integrar una rama en otra y abre el espacio donde se revisa y comenta el cambio antes de fusionarlo. Es una función de la plataforma, no de Git: sirve para que la integración pase por una revisión.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 201,
        "letra": "a",
        "orden": 1,
        "texto": "Descargar código remoto al disco duro.",
        "es_correcta": 0
      },
      {
        "id": 202,
        "letra": "b",
        "orden": 2,
        "texto": "Solicitar la integración de ramas y revisión.",
        "es_correcta": 1
      },
      {
        "id": 203,
        "letra": "c",
        "orden": 3,
        "texto": "Forzar el borrado de una rama en conflicto.",
        "es_correcta": 0
      },
      {
        "id": 204,
        "letra": "d",
        "orden": 4,
        "texto": "Sincronizar tags de versiones estables.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 52,
    "modulo": 2,
    "modulo_titulo": "Fundamentos de Desarrollo Front-End",
    "modulo_icono": "devices",
    "enunciado": "¿Qué sucede cuando Git detecta modificaciones concurrentes en la misma línea durante una unión?",
    "justificacion": "Cuando dos ramas modifican la misma línea, Git no puede decidir cuál gana: marca el conflicto dentro del archivo y detiene la fusión hasta que alguien lo resuelva a mano. No sobrescribe ni descarta nada por su cuenta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 205,
        "letra": "a",
        "orden": 1,
        "texto": "Sobrescribe automáticamente el archivo nuevo.",
        "es_correcta": 0
      },
      {
        "id": 206,
        "letra": "b",
        "orden": 2,
        "texto": "Genera un conflicto que requiere edición manual.",
        "es_correcta": 1
      },
      {
        "id": 207,
        "letra": "c",
        "orden": 3,
        "texto": "Cancela la operación y elimina el repositorio.",
        "es_correcta": 0
      },
      {
        "id": 208,
        "letra": "d",
        "orden": 4,
        "texto": "Crea un branch temporal de respaldo oculto.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 53,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es el motor principal que compila y ejecuta JavaScript dentro de Google Chrome?",
    "justificacion": "V8 es el motor de JavaScript de Chrome, y también el que hace funcionar a Node.js. Las otras tres existen de verdad y por eso son buenos distractores: SpiderMonkey es el de Firefox, JavaScriptCore el de Safari, y ChakraCore el del Edge antiguo, el que había antes de que Edge pasara a construirse sobre Chromium y adoptara V8.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 209,
        "letra": "a",
        "orden": 1,
        "texto": "SpiderMonkey",
        "es_correcta": 0
      },
      {
        "id": 210,
        "letra": "b",
        "orden": 2,
        "texto": "V8 Engine",
        "es_correcta": 1
      },
      {
        "id": 211,
        "letra": "c",
        "orden": 3,
        "texto": "ChakraCore",
        "es_correcta": 0
      },
      {
        "id": 212,
        "letra": "d",
        "orden": 4,
        "texto": "JavaScriptCore",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 54,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué limitación de seguridad crítica tiene JavaScript al ejecutarse nativamente en el navegador?",
    "justificacion": "El navegador ejecuta el código dentro de una caja de arena, y esa caja no le da acceso al sistema de archivos del equipo. Es una frontera de seguridad deliberada, no una carencia del lenguaje. Las otras tres describen cosas que JavaScript sí hace todos los días: modificar el DOM, pedir datos con `fetch` y animar. Ojo con un matiz que conviene entender: sí se pueden leer archivos que el usuario elige a mano en un `<input type=\"file\">`, porque ahí el permiso lo da una persona. Lo prohibido es entrar solo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 213,
        "letra": "a",
        "orden": 1,
        "texto": "No puede alterar el árbol DOM en tiempo de ejecución.",
        "es_correcta": 0
      },
      {
        "id": 214,
        "letra": "b",
        "orden": 2,
        "texto": "Tiene prohibido el acceso al sistema de archivos local.",
        "es_correcta": 1
      },
      {
        "id": 215,
        "letra": "c",
        "orden": 3,
        "texto": "No admite realizar peticiones asíncronas externas (AJAX).",
        "es_correcta": 0
      },
      {
        "id": 216,
        "letra": "d",
        "orden": 4,
        "texto": "Bloquea automáticamente todas las animaciones complejas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 55,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Para qué se utiliza principalmente la consola de comandos de JavaScript en el navegador?",
    "justificacion": "La consola sirve para mirar por dentro un programa que ya está corriendo: escribir expresiones y ver qué devuelven, leer los errores, inspeccionar valores. Las otras tres describen herramientas distintas: JavaScript no se compila a ensamblador a mano, la interfaz se diseña con HTML y CSS, y la conexión a la base de datos vive en el servidor y no en el navegador.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 217,
        "letra": "a",
        "orden": 1,
        "texto": "Para compilar el código fuente a lenguaje ensamblador local.",
        "es_correcta": 0
      },
      {
        "id": 218,
        "letra": "b",
        "orden": 2,
        "texto": "Para diseñar de forma visual la interfaz gráfica de usuario.",
        "es_correcta": 0
      },
      {
        "id": 219,
        "letra": "c",
        "orden": 3,
        "texto": "Para depurar, evaluar expresiones y revisar errores lógicos.",
        "es_correcta": 1
      },
      {
        "id": 220,
        "letra": "d",
        "orden": 4,
        "texto": "Para configurar la conexión con la base de datos SQL.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 56,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "En un entorno de navegador, ¿qué objeto global actúa como el contexto raíz de ejecución?",
    "justificacion": "En el navegador, `window` es el objeto global: todo lo que se declara sin encerrar en un módulo o una función cuelga de ahí. `document` también es global, pero representa el documento y no el contexto raíz; `global` es el nombre que usa Node.js, no el navegador; y `navigator` describe el navegador y sus capacidades. Desde ES2020 existe además `globalThis`, que nombra el objeto global sea cual sea el entorno.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 221,
        "letra": "a",
        "orden": 1,
        "texto": "document",
        "es_correcta": 0
      },
      {
        "id": 222,
        "letra": "b",
        "orden": 2,
        "texto": "global",
        "es_correcta": 0
      },
      {
        "id": 223,
        "letra": "c",
        "orden": 3,
        "texto": "window",
        "es_correcta": 1
      },
      {
        "id": 224,
        "letra": "d",
        "orden": 4,
        "texto": "navigator",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 57,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Al cargar un script en HTML, ¿qué atributo asegura que se ejecute tras parsear el documento?",
    "justificacion": "`defer` le dice al navegador que descargue el script en paralelo pero que no lo ejecute hasta terminar de parsear el documento, y por eso el DOM ya está completo cuando el código corre. `async` también descarga en paralelo, pero ejecuta apenas termina la descarga, que puede ser en mitad del parseo; ese es justamente el par que hay que saber distinguir. `load` y `wait` no son atributos de `<script>`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 225,
        "letra": "a",
        "orden": 1,
        "texto": "async",
        "es_correcta": 0
      },
      {
        "id": 226,
        "letra": "b",
        "orden": 2,
        "texto": "defer",
        "es_correcta": 1
      },
      {
        "id": 227,
        "letra": "c",
        "orden": 3,
        "texto": "load",
        "es_correcta": 0
      },
      {
        "id": 228,
        "letra": "d",
        "orden": 4,
        "texto": "wait",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 58,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué ocurre si un script con errores sintácticos severos se ejecuta en el navegador?",
    "justificacion": "Un error de sintaxis se detecta al parsear, antes de ejecutar nada, así que ese script no llega a correr ni una sola línea y el motor informa un `SyntaxError` en la consola. Conviene precisar el alcance de esa detención: lo que no se ejecuta es **ese** script, mientras la página, los demás scripts y los manejadores de eventos siguen funcionando con normalidad. Ninguna de las otras tres ocurre: el navegador no corrige código, no recarga la página solo, y no puede saltarse la línea defectuosa porque no llegó a entender el archivo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 229,
        "letra": "a",
        "orden": 1,
        "texto": "El navegador corrige el error y continúa en silencio.",
        "es_correcta": 0
      },
      {
        "id": 230,
        "letra": "b",
        "orden": 2,
        "texto": "El hilo se detiene, lanzando un SyntaxError en la consola.",
        "es_correcta": 1
      },
      {
        "id": 231,
        "letra": "c",
        "orden": 3,
        "texto": "Se recarga la página automáticamente para intentar resolverlo.",
        "es_correcta": 0
      },
      {
        "id": 232,
        "letra": "d",
        "orden": 4,
        "texto": "El código omite la línea defectuosa y sigue la ejecución.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 59,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es el principal beneficio de aislar el código JavaScript en un archivo externo .js?",
    "justificacion": "Un archivo `.js` aparte lo pueden compartir varias páginas y el navegador lo guarda en caché, así que se descarga una vez y se reutiliza. Las otras tres prometen algo que no ocurre: separar el archivo no encripta nada, no obliga al servidor a procesarlo, y desde luego no impide descargarlo — cualquiera puede abrir la URL del archivo y leerlo entero.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 233,
        "letra": "a",
        "orden": 1,
        "texto": "Aumenta la seguridad al encriptar el código fuente.",
        "es_correcta": 0
      },
      {
        "id": 234,
        "letra": "b",
        "orden": 2,
        "texto": "Obliga al servidor a procesar el código antes del envío.",
        "es_correcta": 0
      },
      {
        "id": 235,
        "letra": "c",
        "orden": 3,
        "texto": "Promueve la reutilización de código y el uso de caché web.",
        "es_correcta": 1
      },
      {
        "id": 236,
        "letra": "d",
        "orden": 4,
        "texto": "Evita que los usuarios puedan descargar el código fuente.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 60,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Según las herramientas del browser, ¿qué pestaña permite analizar el rendimiento del script?",
    "justificacion": "La pestaña «Performance» graba una línea de tiempo de lo que hizo la página: cuánto tardó cada función, dónde se fue el tiempo, qué bloqueó el dibujado. Las otras tres son pestañas reales con otro oficio: «Elements» inspecciona el DOM y los estilos, «Network» mira las peticiones y sus tiempos de red, y «Application» muestra almacenamiento, cookies y service workers.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 237,
        "letra": "a",
        "orden": 1,
        "texto": "Elements (Elementos)",
        "es_correcta": 0
      },
      {
        "id": 238,
        "letra": "b",
        "orden": 2,
        "texto": "Network (Red)",
        "es_correcta": 0
      },
      {
        "id": 239,
        "letra": "c",
        "orden": 3,
        "texto": "Performance (Rendimiento)",
        "es_correcta": 1
      },
      {
        "id": 240,
        "letra": "d",
        "orden": 4,
        "texto": "Application (Aplicación)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 61,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué provoca declarar una variable sin usar let, const o var en modo no estricto?",
    "justificacion": "En modo no estricto, asignar a un nombre que nunca se declaró crea una propiedad en el objeto global en vez de fallar. Es una de las razones de ser de `'use strict'`, que convierte ese descuido en un `ReferenceError`. Por eso la (a) no es correcta aquí: sí hay error, pero solo en modo estricto, que es justo lo que el enunciado descarta. Y no es local ni queda en `undefined`: queda global y con el valor asignado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 241,
        "letra": "a",
        "orden": 1,
        "texto": "Genera un error de sintaxis que detiene el programa.",
        "es_correcta": 0
      },
      {
        "id": 242,
        "letra": "b",
        "orden": 2,
        "texto": "Crea una propiedad implícita dentro del objeto global.",
        "es_correcta": 1
      },
      {
        "id": 243,
        "letra": "c",
        "orden": 3,
        "texto": "Define una constante local inmutable en el bloque.",
        "es_correcta": 0
      },
      {
        "id": 244,
        "letra": "d",
        "orden": 4,
        "texto": "Inicializa la variable como \"undefined\" pero de alcance local.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 62,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Al evaluar la expresión `[] == false`, ¿qué resultado y por qué se produce en JavaScript?",
    "justificacion": "El resultado es `true`, y la cadena de conversiones es lo que hay que entender: `false` se convierte al número `0`, y el arreglo vacío se convierte primero a la cadena `\"\"` y de ahí al número `0`; `0 == 0` da verdadero. Lo que conviene fijar es que `==` compara convirtiendo a **número**, no a booleano. De ahí sale algo que parece contradictorio y no lo es: `[] == false` da `true` y al mismo tiempo `[] ? 'sí' : 'no'` da `'sí'`, porque como condición un arreglo vacío es verdadero. Son dos reglas distintas —la de `==` y la de los valores truthy— y aplicarlas cruzadas es el error más común con este operador.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 245,
        "letra": "a",
        "orden": 1,
        "texto": "false, porque no son del mismo tipo de dato estructural.",
        "es_correcta": 0
      },
      {
        "id": 246,
        "letra": "b",
        "orden": 2,
        "texto": "true, porque ambos valores son idénticos en memoria.",
        "es_correcta": 0
      },
      {
        "id": 247,
        "letra": "c",
        "orden": 3,
        "texto": "true, debido a la coerción implícita de tipos hacia números.",
        "es_correcta": 1
      },
      {
        "id": 248,
        "letra": "d",
        "orden": 4,
        "texto": "Error, ya que un arreglo no puede compararse con un booleano.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 63,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué valor asume una variable declarada con `let` pero que carece de inicialización explícita?",
    "justificacion": "Declarar sin asignar deja la variable en `undefined`, que es el valor que JavaScript usa para «existe pero todavía no tiene nada». `null` es distinto: significa «vacío a propósito» y hay que escribirlo. `NaN` aparece al fallar una operación numérica, y `0` habría que asignarlo. La distinción entre `undefined` y `null` es una de las que más se preguntan.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 249,
        "letra": "a",
        "orden": 1,
        "texto": "null",
        "es_correcta": 0
      },
      {
        "id": 250,
        "letra": "b",
        "orden": 2,
        "texto": "NaN",
        "es_correcta": 0
      },
      {
        "id": 251,
        "letra": "c",
        "orden": 3,
        "texto": "0",
        "es_correcta": 0
      },
      {
        "id": 252,
        "letra": "d",
        "orden": 4,
        "texto": "undefined",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 64,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué operador lógico retorna el primer operando falso o el último verdadero si todos lo son?",
    "justificacion": "`&&` va evaluando de izquierda a derecha y se detiene en el primer operando falso, devolviéndolo tal cual; si ninguno lo es, devuelve el último. Esa es la razón de que `&&` no devuelva siempre `true` o `false` sino uno de los operandos. `||` hace lo simétrico: primer verdadero o último. `!` niega y siempre da booleano, y `??` solo reacciona ante `null` y `undefined`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 253,
        "letra": "a",
        "orden": 1,
        "texto": "|| (OR lógico)",
        "es_correcta": 0
      },
      {
        "id": 254,
        "letra": "b",
        "orden": 2,
        "texto": "&& (AND lógico)",
        "es_correcta": 1
      },
      {
        "id": 255,
        "letra": "c",
        "orden": 3,
        "texto": "! (NOT lógico)",
        "es_correcta": 0
      },
      {
        "id": 256,
        "letra": "d",
        "orden": 4,
        "texto": "?? (Nullish coalescing)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 65,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es la precedencia correcta, de mayor a menor, en los operadores aritméticos básicos?",
    "justificacion": "Multiplicación y división se evalúan antes que suma y resta, igual que en aritmética, y los paréntesis siguen mandando sobre todo. Por eso `2 + 3 * 4` da 14 y no 20. La (a) y la (c) invierten el orden, y la (d) es lo que pasaría si no hubiera precedencia, que es exactamente lo que la precedencia existe para evitar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 257,
        "letra": "a",
        "orden": 1,
        "texto": "Suma, Resta, Multiplicación, División",
        "es_correcta": 0
      },
      {
        "id": 258,
        "letra": "b",
        "orden": 2,
        "texto": "Multiplicación/División, Suma/Resta",
        "es_correcta": 1
      },
      {
        "id": 259,
        "letra": "c",
        "orden": 3,
        "texto": "Suma/Resta, Multiplicación/División",
        "es_correcta": 0
      },
      {
        "id": 260,
        "letra": "d",
        "orden": 4,
        "texto": "Todas las operaciones tienen igual prioridad estricta.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 66,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Si `a = 5` y evaluamos `b = a++`, ¿cuál es el valor final de `b` y `a` respectivamente?",
    "justificacion": "El `++` puesto **después** de la variable devuelve el valor viejo y luego incrementa: `b` se queda con 5 y `a` pasa a 6. Si estuviera puesto antes, `b = ++a`, los dos valdrían 6, que es la alternativa (a). Esa diferencia entre postfijo y prefijo es todo lo que la pregunta evalúa, y es de las que se responden mal por leer rápido.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 261,
        "letra": "a",
        "orden": 1,
        "texto": "b = 6, a = 6",
        "es_correcta": 0
      },
      {
        "id": 262,
        "letra": "b",
        "orden": 2,
        "texto": "b = 5, a = 5",
        "es_correcta": 0
      },
      {
        "id": 263,
        "letra": "c",
        "orden": 3,
        "texto": "b = 6, a = 5",
        "es_correcta": 0
      },
      {
        "id": 264,
        "letra": "d",
        "orden": 4,
        "texto": "b = 5, a = 6",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 67,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "En un condicional `if (\"0\")`, ¿el bloque interno se ejecuta o se omite?",
    "justificacion": "El bloque se ejecuta. En un condicional el valor se convierte a booleano, y **toda cadena no vacía es verdadera**, incluida `\"0\"`: lo que decide es que tenga caracteres, no lo que digan. La única cadena falsa es la vacía, `\"\"`. Es una trampa clásica, porque el número `0` sí es falso y `\"0\"` se le parece a la vista.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 265,
        "letra": "a",
        "orden": 1,
        "texto": "Se omite, porque \"0\" se convierte algorítmicamente a false.",
        "es_correcta": 0
      },
      {
        "id": 266,
        "letra": "b",
        "orden": 2,
        "texto": "Se ejecuta, ya que un string no vacío evalúa como truthy.",
        "es_correcta": 1
      },
      {
        "id": 267,
        "letra": "c",
        "orden": 3,
        "texto": "Se omite, porque el motor detecta que carece de valor numérico.",
        "es_correcta": 0
      },
      {
        "id": 268,
        "letra": "d",
        "orden": 4,
        "texto": "Lanza un error al evaluar un string sin usar un comparador.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 68,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué diferencia clave existe entre los operadores relacionales == y === en JavaScript?",
    "justificacion": "`==` convierte tipos antes de comparar, así que `\"5\" == 5` es verdadero; `===` compara tipo y valor sin convertir nada, y por eso `\"5\" === 5` es falso. La (a) dice exactamente lo contrario y por eso es el distractor que separa al que sabe. La recomendación práctica es usar `===` siempre, salvo que se quiera la conversión a propósito y se sepa por qué.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 269,
        "letra": "a",
        "orden": 1,
        "texto": "== compara solo el tipo, === compara valor y referencia.",
        "es_correcta": 0
      },
      {
        "id": 270,
        "letra": "b",
        "orden": 2,
        "texto": "== realiza coerción de tipos, === evalúa tipo y valor estricto.",
        "es_correcta": 1
      },
      {
        "id": 271,
        "letra": "c",
        "orden": 3,
        "texto": "=== se usa solo para objetos, == para tipos primitivos.",
        "es_correcta": 0
      },
      {
        "id": 272,
        "letra": "d",
        "orden": 4,
        "texto": "No existe diferencia real, ambos efectúan conversión de tipos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 69,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Si intentas asignar un valor a un índice fuera del límite actual de un arreglo, ¿qué sucede?",
    "justificacion": "El arreglo se estira hasta ese índice y su `length` crece para incluirlo. No hay error: los arreglos de JavaScript no tienen un tamaño reservado que pueda desbordarse. Las posiciones intermedias que quedaron sin valor se leen como `undefined`. Las otras tres suponen comportamientos que no existen: ni se lanza un `RangeError`, ni se ignora la asignación, ni se desplazan los índices ya ocupados.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 273,
        "letra": "a",
        "orden": 1,
        "texto": "El motor lanza un RangeError crítico en tiempo de ejecución.",
        "es_correcta": 0
      },
      {
        "id": 274,
        "letra": "b",
        "orden": 2,
        "texto": "El arreglo ignora la asignación y no muta su estructura.",
        "es_correcta": 0
      },
      {
        "id": 275,
        "letra": "c",
        "orden": 3,
        "texto": "El arreglo se expande, rellenando los vacíos con \"undefined\".",
        "es_correcta": 1
      },
      {
        "id": 276,
        "letra": "d",
        "orden": 4,
        "texto": "El elemento se inserta al inicio desplazando los demás índices.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 70,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cómo afecta la modificación de un arreglo a sus referencias asignadas a otras variables?",
    "justificacion": "Un arreglo es un objeto y las variables guardan una referencia a él, no una copia. Si dos variables apuntan al mismo arreglo, el cambio hecho a través de una se ve por la otra, porque hay un solo arreglo. Para obtener una copia hay que pedirla: `[...arr]` o `arr.slice()`, y aun así es una copia superficial. Es la causa de una parte grande de los errores con datos compartidos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 277,
        "letra": "a",
        "orden": 1,
        "texto": "Solo la variable original muta, el resto mantiene un clon.",
        "es_correcta": 0
      },
      {
        "id": 278,
        "letra": "b",
        "orden": 2,
        "texto": "Todas las variables apuntando a esa referencia se actualizan.",
        "es_correcta": 1
      },
      {
        "id": 279,
        "letra": "c",
        "orden": 3,
        "texto": "Rompe la referencia y genera un objeto completamente nuevo.",
        "es_correcta": 0
      },
      {
        "id": 280,
        "letra": "d",
        "orden": 4,
        "texto": "Dispara una advertencia de mutabilidad en memoria dinámica.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 71,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es el propósito principal de la sentencia `continue` dentro de un ciclo `for`?",
    "justificacion": "`continue` abandona la iteración en curso y salta a la siguiente, sin salir del ciclo. El que termina el bucle entero es `break`, que es la alternativa (a) y el par con el que siempre se confunde. `return` devuelve desde la función, no desde el ciclo, y no existe ninguna instrucción que reinicie el contador desde su valor inicial.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 281,
        "letra": "a",
        "orden": 1,
        "texto": "Finalizar completamente la ejecución del bucle envolvente.",
        "es_correcta": 0
      },
      {
        "id": 282,
        "letra": "b",
        "orden": 2,
        "texto": "Retornar inmediatamente el valor iterado a la función padre.",
        "es_correcta": 0
      },
      {
        "id": 283,
        "letra": "c",
        "orden": 3,
        "texto": "Saltar el resto de la iteración actual y avanzar a la siguiente.",
        "es_correcta": 1
      },
      {
        "id": 284,
        "letra": "d",
        "orden": 4,
        "texto": "Reiniciar el contador del ciclo desde su valor inicial base.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 72,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué diferencia conceptual rige entre un ciclo `while` y un bucle `do/while`?",
    "justificacion": "`do/while` evalúa la condición **después** del bloque, así que el cuerpo corre al menos una vez aunque la condición sea falsa desde el principio; `while` la evalúa antes y puede no ejecutarse nunca. Esa es toda la diferencia, y es la que decide cuál usar: `do/while` sirve cuando hay que hacer algo primero y recién después preguntar si se repite.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 285,
        "letra": "a",
        "orden": 1,
        "texto": "while solo admite variables locales en su bloque de ejecución.",
        "es_correcta": 0
      },
      {
        "id": 286,
        "letra": "b",
        "orden": 2,
        "texto": "do/while asegura al menos una ejecución del bloque interno.",
        "es_correcta": 1
      },
      {
        "id": 287,
        "letra": "c",
        "orden": 3,
        "texto": "do/while no admite dependencias evaluadas como booleanas.",
        "es_correcta": 0
      },
      {
        "id": 288,
        "letra": "d",
        "orden": 4,
        "texto": "while itera exclusivamente sobre propiedades de objetos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 73,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "En el contexto de arreglos asociativos simulados, ¿qué tipo subyacente de estructura son?",
    "justificacion": "JavaScript no tiene arreglos asociativos de verdad: lo que se usa como tal son objetos, donde la clave de texto es el nombre de una propiedad. Por eso `obj[\"nombre\"]` y `obj.nombre` son lo mismo. Los arreglos con índices numéricos son otra cosa y tienen `length` y métodos propios; matrices bidimensionales y tuplas inmutables no son estructuras nativas del lenguaje.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 289,
        "letra": "a",
        "orden": 1,
        "texto": "Arreglos indexados secuencialmente con claves hash.",
        "es_correcta": 0
      },
      {
        "id": 290,
        "letra": "b",
        "orden": 2,
        "texto": "Objetos puros, donde el índice string es el nombre de propiedad.",
        "es_correcta": 1
      },
      {
        "id": 291,
        "letra": "c",
        "orden": 3,
        "texto": "Matrices bidimensionales almacenadas en el heap de memoria.",
        "es_correcta": 0
      },
      {
        "id": 292,
        "letra": "d",
        "orden": 4,
        "texto": "Tuplas inmutables de longitud estricta y predefinida.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 74,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Por qué es una mala práctica declarar funciones internamente dentro de un bucle extenso?",
    "justificacion": "Cada vuelta del ciclo crea una función nueva en memoria, aunque el código sea idéntico, y eso es trabajo y memoria sin motivo. La salida es declarar la función una vez fuera del bucle y llamarla dentro. No es un error de sintaxis ni rompe nada: el programa funciona, simplemente hace de más, y por eso es una mala práctica y no un fallo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 293,
        "letra": "a",
        "orden": 1,
        "texto": "Sobrescribe la declaración iterativa perdiendo el índice.",
        "es_correcta": 0
      },
      {
        "id": 294,
        "letra": "b",
        "orden": 2,
        "texto": "Genera un error de sintaxis bloqueando la compilación V8.",
        "es_correcta": 0
      },
      {
        "id": 295,
        "letra": "c",
        "orden": 3,
        "texto": "Instancia en memoria múltiples copias de la función sin necesidad.",
        "es_correcta": 1
      },
      {
        "id": 296,
        "letra": "d",
        "orden": 4,
        "texto": "Fuerza la conversión de variables locales a constantes globales.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 75,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué principio rige en las convenciones de \"código limpio\" (Clean Code) para nombrar variables?",
    "justificacion": "El nombre tiene que decir qué guarda la variable o qué hace la función, de modo que el código se pueda leer sin ir a buscar la definición. `contadorDeIntentos` gana a `c` aunque sea más largo. Las otras tres proponen prácticas abandonadas o falsas: el largo de un nombre no consume memoria en tiempo de ejecución, la notación húngara cayó en desuso, y las mayúsculas se reservan por convención para constantes.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 297,
        "letra": "a",
        "orden": 1,
        "texto": "Usar siglas breves para minimizar el uso de memoria RAM.",
        "es_correcta": 0
      },
      {
        "id": 298,
        "letra": "b",
        "orden": 2,
        "texto": "Emplear nombres descriptivos que revelen su real intención.",
        "es_correcta": 1
      },
      {
        "id": 299,
        "letra": "c",
        "orden": 3,
        "texto": "Usar notación húngara combinada con índices alfanuméricos.",
        "es_correcta": 0
      },
      {
        "id": 300,
        "letra": "d",
        "orden": 4,
        "texto": "Mantener nombres en mayúsculas ignorando su alcance base.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 76,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "En un ciclo iterativo, ¿qué sucede si la condición de salida jamás se evalúa como falsa?",
    "justificacion": "Si la condición nunca se vuelve falsa, el ciclo no termina: se queda girando y bloquea el hilo, que en el navegador significa una pestaña congelada. No hay ningún límite de iteraciones que lo detenga —la (a) inventa uno—, ni el compilador puede «optimizar» una condición que quizá sea correcta, ni el ciclo devuelve nada, porque nunca llega a salir.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 301,
        "letra": "a",
        "orden": 1,
        "texto": "El motor de JavaScript detiene el proceso tras mil iteraciones.",
        "es_correcta": 0
      },
      {
        "id": 302,
        "letra": "b",
        "orden": 2,
        "texto": "Se desencadena un bucle infinito colapsando el navegador.",
        "es_correcta": 1
      },
      {
        "id": 303,
        "letra": "c",
        "orden": 3,
        "texto": "El compilador optimiza el ciclo ignorando la condición estricta.",
        "es_correcta": 0
      },
      {
        "id": 304,
        "letra": "d",
        "orden": 4,
        "texto": "El ciclo termina retornando un valor \"undefined\" implícito.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 77,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué comportamiento describe la capacidad de alojar una función anónima dentro de una variable?",
    "justificacion": "Que una función se pueda guardar en una variable, pasar como argumento y devolver desde otra función es lo que significa que las funciones sean ciudadanos de primera clase: valen lo mismo que cualquier otro dato. De ahí salen los callbacks y buena parte del estilo del lenguaje. Las otras tres nombran conceptos reales de JavaScript, pero ninguno describe lo que la pregunta plantea.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 305,
        "letra": "a",
        "orden": 1,
        "texto": "Herencia prototípica de instancias base y constructores.",
        "es_correcta": 0
      },
      {
        "id": 306,
        "letra": "b",
        "orden": 2,
        "texto": "Conversión explícita de tipos abstractos dinámicos.",
        "es_correcta": 0
      },
      {
        "id": 307,
        "letra": "c",
        "orden": 3,
        "texto": "Manejo de funciones como ciudadanos de primera clase.",
        "es_correcta": 1
      },
      {
        "id": 308,
        "letra": "d",
        "orden": 4,
        "texto": "Resolución asíncrona mediante un bucle de eventos activo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 78,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Si una función ejecuta un bloque de código pero omite la instrucción `return`, ¿qué devuelve?",
    "justificacion": "Toda función devuelve algo, y si no se dice qué, devuelve `undefined`. No es un caso especial: es el valor por omisión del retorno. `null` habría que devolverlo a propósito, y `0` y `false` son valores concretos que nadie escribió. Conviene tenerlo claro porque `undefined` es lo que se recibe al usar el resultado de una función que en realidad no devolvía nada.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 309,
        "letra": "a",
        "orden": 1,
        "texto": "null",
        "es_correcta": 0
      },
      {
        "id": 310,
        "letra": "b",
        "orden": 2,
        "texto": "0",
        "es_correcta": 0
      },
      {
        "id": 311,
        "letra": "c",
        "orden": 3,
        "texto": "false",
        "es_correcta": 0
      },
      {
        "id": 312,
        "letra": "d",
        "orden": 4,
        "texto": "undefined",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 79,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué sucede si pasas menos argumentos a una función de los definidos en sus parámetros?",
    "justificacion": "Los parámetros que no reciben argumento quedan en `undefined`, y la función corre igual. JavaScript no comprueba la cantidad de argumentos: pasar de menos —o de más— no es un error. De ahí vienen los valores por omisión, `function f(x = 10)`, que existen justamente para no tener que comprobar a mano si llegó `undefined`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 313,
        "letra": "a",
        "orden": 1,
        "texto": "Los parámetros faltantes asumen automáticamente el valor undefined.",
        "es_correcta": 1
      },
      {
        "id": 314,
        "letra": "b",
        "orden": 2,
        "texto": "La ejecución falla lanzando un TypeError crítico en consola.",
        "es_correcta": 0
      },
      {
        "id": 315,
        "letra": "c",
        "orden": 3,
        "texto": "La función bloquea el hilo esperando que se provean datos.",
        "es_correcta": 0
      },
      {
        "id": 316,
        "letra": "d",
        "orden": 4,
        "texto": "Los argumentos no provistos toman el valor booleano false.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 80,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Por qué el uso excesivo de variables globales está catalogado como un antipatrón riesgoso?",
    "justificacion": "Cualquier parte del programa puede leer y escribir una variable global, así que dos trozos de código que no se conocen pueden pisarse el valor, y encontrar quién lo hizo es difícil porque el sospechoso es todo el archivo. Las otras tres dicen cosas falsas: las globales no ocupan menos, admiten cualquier tipo de dato, y son accesibles desde dentro de ciclos y condicionales.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 317,
        "letra": "a",
        "orden": 1,
        "texto": "Ocupan menos espacio pero fragmentan el heap del cliente.",
        "es_correcta": 0
      },
      {
        "id": 318,
        "letra": "b",
        "orden": 2,
        "texto": "Aumentan drásticamente el riesgo de colisiones y fallas.",
        "es_correcta": 1
      },
      {
        "id": 319,
        "letra": "c",
        "orden": 3,
        "texto": "Solo permiten almacenar datos primitivos temporalmente.",
        "es_correcta": 0
      },
      {
        "id": 320,
        "letra": "d",
        "orden": 4,
        "texto": "Son inaccesibles en bloques de ciclos o condicionales.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 81,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué regla determina el acceso a variables dentro de funciones anidadas (lexical scoping)?",
    "justificacion": "El alcance léxico se decide por dónde está escrita la función, no por dónde se la llama: una función interna ve sus propias variables, las de la función que la contiene, y las globales. Ese encadenamiento hacia afuera es lo que hace posibles los closures. Las otras tres niegan justamente esa cadena, que es lo que la pregunta evalúa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 321,
        "letra": "a",
        "orden": 1,
        "texto": "La función interna no puede acceder a variables de la externa.",
        "es_correcta": 0
      },
      {
        "id": 322,
        "letra": "b",
        "orden": 2,
        "texto": "Solo puede acceder a variables globales, ignorando a su padre.",
        "es_correcta": 0
      },
      {
        "id": 323,
        "letra": "c",
        "orden": 3,
        "texto": "Accede a su propio scope, al entorno superior y al alcance global.",
        "es_correcta": 1
      },
      {
        "id": 324,
        "letra": "d",
        "orden": 4,
        "texto": "Las variables del scope superior colapsan al ejecutar la interna.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 82,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué efecto tiene declarar un parámetro con el mismo nombre que una variable global del scope?",
    "justificacion": "Se llama shadowing: dentro de la función, el nombre se resuelve al parámetro y la variable global queda tapada mientras dure esa ejecución. No hay error ni conflicto —JavaScript permite repetir el nombre— y la global **no** se modifica: sigue intacta y vuelve a verse al salir de la función. Confundir «tapar» con «sobrescribir» es el error que la (c) recoge.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 325,
        "letra": "a",
        "orden": 1,
        "texto": "Shadowing: el parámetro prioriza su valor sobre la variable global.",
        "es_correcta": 1
      },
      {
        "id": 326,
        "letra": "b",
        "orden": 2,
        "texto": "Error de compilación por conflicto de nombres duplicados.",
        "es_correcta": 0
      },
      {
        "id": 327,
        "letra": "c",
        "orden": 3,
        "texto": "Se sobrescribe el valor de la variable global de forma permanente.",
        "es_correcta": 0
      },
      {
        "id": 328,
        "letra": "d",
        "orden": 4,
        "texto": "La función fusiona ambos valores en un dato compuesto iterativo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 83,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué palabra clave nativa y reservada da acceso dinámico a todos los parámetros en una función?",
    "justificacion": "`arguments` es un objeto que existe dentro de toda función tradicional y contiene todos los argumentos recibidos, se hayan declarado como parámetros o no. `args`, `params` e `inputs` no son palabras del lenguaje. Conviene saber que `arguments` **no existe en las funciones flecha**, y que hoy se prefiere el parámetro rest —`function f(...args)`—, que sí da un arreglo de verdad.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 329,
        "letra": "a",
        "orden": 1,
        "texto": "arguments",
        "es_correcta": 1
      },
      {
        "id": 330,
        "letra": "b",
        "orden": 2,
        "texto": "args",
        "es_correcta": 0
      },
      {
        "id": 331,
        "letra": "c",
        "orden": 3,
        "texto": "params",
        "es_correcta": 0
      },
      {
        "id": 332,
        "letra": "d",
        "orden": 4,
        "texto": "inputs",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 84,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué ocurre con la memoria de las variables locales al concluir la ejecución de su función?",
    "justificacion": "Al terminar la función, sus variables locales dejan de ser alcanzables y el recolector de basura libera esa memoria cuando le toca; no hay que liberarla a mano. Hay una excepción que vale la pena tener presente desde ya, porque aparece poco después en el propio curso: si una función interna capturó esas variables —un closure—, siguen vivas después de que la función externa terminó, porque todavía queda quien las alcance. Las otras tres describen cosas que no pasan: no se quedan hasta reiniciar el navegador, no se exportan al ámbito global, y no se guardan en `localStorage`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 333,
        "letra": "a",
        "orden": 1,
        "texto": "Permanecen en el heap hasta reiniciar el navegador por completo.",
        "es_correcta": 0
      },
      {
        "id": 334,
        "letra": "b",
        "orden": 2,
        "texto": "Se exportan al entorno global para asegurar retención de datos.",
        "es_correcta": 0
      },
      {
        "id": 335,
        "letra": "c",
        "orden": 3,
        "texto": "Son descartadas y liberadas por el recolector de basura nativo.",
        "es_correcta": 1
      },
      {
        "id": 336,
        "letra": "d",
        "orden": 4,
        "texto": "Se almacenan en LocalStorage como respaldo del proceso actual.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 85,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Al acceder a una propiedad dinámica cuyo nombre está en una variable, ¿qué notación es obligatoria?",
    "justificacion": "Cuando el nombre de la propiedad está guardado en una variable hay que usar corchetes, `objeto[variable]`, porque así se evalúa la variable y se usa su contenido como clave. Con punto, `objeto.variable`, se buscaría una propiedad llamada literalmente «variable». Las notaciones con flecha y con guion no existen en JavaScript; la de flecha es de PHP y C++.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 337,
        "letra": "a",
        "orden": 1,
        "texto": "Notación de flecha (objeto->propiedad)",
        "es_correcta": 0
      },
      {
        "id": 338,
        "letra": "b",
        "orden": 2,
        "texto": "Notación de punto (objeto.propiedad)",
        "es_correcta": 0
      },
      {
        "id": 339,
        "letra": "c",
        "orden": 3,
        "texto": "Notación de corchetes (objeto[variable])",
        "es_correcta": 1
      },
      {
        "id": 340,
        "letra": "d",
        "orden": 4,
        "texto": "Notación de guion (objeto-variable)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 86,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué define estrictamente a un \"método\" en el paradigma orientado a objetos de JavaScript?",
    "justificacion": "Un método no es una categoría aparte: es sencillamente una propiedad cuyo valor resulta ser una función. Por eso se puede agregar uno a un objeto ya creado con una asignación corriente, y por eso `typeof obj.metodo` responde `\"function\"`. Entender esto es lo que hace que después no sorprenda pasar métodos como argumentos o guardarlos en variables.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 341,
        "letra": "a",
        "orden": 1,
        "texto": "Una variable primitiva almacenada en el entorno global del DOM.",
        "es_correcta": 0
      },
      {
        "id": 342,
        "letra": "b",
        "orden": 2,
        "texto": "Una propiedad de un objeto cuyo valor alojado es una función.",
        "es_correcta": 1
      },
      {
        "id": 343,
        "letra": "c",
        "orden": 3,
        "texto": "Un ciclo iterativo configurado dentro del constructor padre.",
        "es_correcta": 0
      },
      {
        "id": 344,
        "letra": "d",
        "orden": 4,
        "texto": "Una constante matemática protegida contra sobreescritura local.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 87,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Si intentas consultar una propiedad que no existe dentro de un objeto literal, ¿qué evalúa JS?",
    "justificacion": "Consultar una propiedad que no existe devuelve `undefined`, sin error. Eso es cómodo y a la vez peligroso: el programa sigue con un `undefined` que puede reventar más adelante, lejos de donde estuvo la causa. El `ReferenceError` de la (d) es para variables que no existen, que es otra cosa: acceder a una propiedad inexistente de un objeto que sí existe nunca lanza.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 345,
        "letra": "a",
        "orden": 1,
        "texto": "undefined",
        "es_correcta": 1
      },
      {
        "id": 346,
        "letra": "b",
        "orden": 2,
        "texto": "null",
        "es_correcta": 0
      },
      {
        "id": 347,
        "letra": "c",
        "orden": 3,
        "texto": "false",
        "es_correcta": 0
      },
      {
        "id": 348,
        "letra": "d",
        "orden": 4,
        "texto": "Lanza un ReferenceError inmediato al compilar.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 88,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué función del objeto Math permite redondear un decimal hacia el entero superior más cercano?",
    "justificacion": "`Math.ceil()` redondea siempre hacia arriba: `Math.ceil(4.1)` da 5. Las otras tres son reales y hacen otra cosa: `Math.floor()` redondea siempre hacia abajo, `Math.round()` al entero más cercano según el decimal, y `Math.trunc()` corta la parte decimal sin mirar. Con negativos se separan de verdad: `Math.ceil(-4.7)` da -4 y `Math.trunc(-4.7)` da -4, pero `Math.floor(-4.7)` da -5.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 349,
        "letra": "a",
        "orden": 1,
        "texto": "Math.floor()",
        "es_correcta": 0
      },
      {
        "id": 350,
        "letra": "b",
        "orden": 2,
        "texto": "Math.round()",
        "es_correcta": 0
      },
      {
        "id": 351,
        "letra": "c",
        "orden": 3,
        "texto": "Math.ceil()",
        "es_correcta": 1
      },
      {
        "id": 352,
        "letra": "d",
        "orden": 4,
        "texto": "Math.trunc()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 89,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Para generar un número seudoaleatorio decimal entre 0 y casi 1, ¿qué invocación es la correcta?",
    "justificacion": "`Math.random()` devuelve un decimal entre 0 incluido y 1 excluido. Nunca llega a 1, y por eso la fórmula habitual para un entero en un rango es `Math.floor(Math.random() * n)`. `Math.rand()`, `Math.rnd()` y `Math.getSeed()` no existen; la última además insinúa algo que JavaScript no ofrece: no hay forma de fijar la semilla del generador.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 353,
        "letra": "a",
        "orden": 1,
        "texto": "Math.rand()",
        "es_correcta": 0
      },
      {
        "id": 354,
        "letra": "b",
        "orden": 2,
        "texto": "Math.random()",
        "es_correcta": 1
      },
      {
        "id": 355,
        "letra": "c",
        "orden": 3,
        "texto": "Math.getSeed()",
        "es_correcta": 0
      },
      {
        "id": 356,
        "letra": "d",
        "orden": 4,
        "texto": "Math.rnd()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 90,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué método de la instancia String extrae una porción de texto basada en índices de inicio y fin?",
    "justificacion": "`slice(inicio, fin)` devuelve el trozo entre esos índices, sin incluir el final, y no modifica la cadena original —las cadenas son inmutables—. `split()` existe pero parte la cadena en un arreglo usando un separador; `splice()` es de arreglos y además muta; `extract()` no existe. Que `slice` funcione igual en cadenas y en arreglos ayuda a recordarlo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 357,
        "letra": "a",
        "orden": 1,
        "texto": "splice()",
        "es_correcta": 0
      },
      {
        "id": 358,
        "letra": "b",
        "orden": 2,
        "texto": "extract()",
        "es_correcta": 0
      },
      {
        "id": 359,
        "letra": "c",
        "orden": 3,
        "texto": "slice()",
        "es_correcta": 1
      },
      {
        "id": 360,
        "letra": "d",
        "orden": 4,
        "texto": "split()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 91,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Al invocar el método `String.prototype.indexOf()`, ¿qué se retorna si la subcadena no existe?",
    "justificacion": "`indexOf()` devuelve la posición de la primera coincidencia y `-1` si no encuentra nada. Se eligió `-1` porque cualquier posición válida es cero o mayor, así que no se confunde con un resultado real. Justamente por eso hay que compararlo con `-1` y no usarlo como booleano: la posición `0` es un hallazgo válido y es falsy, que es el error clásico. Cuando solo interesa saber si está, `includes()` es más claro.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 361,
        "letra": "a",
        "orden": 1,
        "texto": "undefined",
        "es_correcta": 0
      },
      {
        "id": 362,
        "letra": "b",
        "orden": 2,
        "texto": "false",
        "es_correcta": 0
      },
      {
        "id": 363,
        "letra": "c",
        "orden": 3,
        "texto": "null",
        "es_correcta": 0
      },
      {
        "id": 364,
        "letra": "d",
        "orden": 4,
        "texto": "-1",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 92,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es la diferencia estructural entre crear un string primitivo y usar `new String()`?",
    "justificacion": "`new String(\"hola\")` construye un objeto envoltorio, mientras que `\"hola\"` es un valor primitivo. Se nota al comparar: `typeof` responde `\"object\"` en el primero y `\"string\"` en el segundo, y `new String(\"a\") === \"a\"` es falso. En la práctica no se usa `new String()`, porque el motor envuelve el primitivo solo cuando hace falta llamar a un método.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 365,
        "letra": "a",
        "orden": 1,
        "texto": "El primitivo muta; new String() bloquea cualquier modificación.",
        "es_correcta": 0
      },
      {
        "id": 366,
        "letra": "b",
        "orden": 2,
        "texto": "new String() instancia un objeto explícito, no un tipo primitivo.",
        "es_correcta": 1
      },
      {
        "id": 367,
        "letra": "c",
        "orden": 3,
        "texto": "No existe diferencia técnica, ambos compilan al mismo binario.",
        "es_correcta": 0
      },
      {
        "id": 368,
        "letra": "d",
        "orden": 4,
        "texto": "El constructor soporta cifrado UTF-16, pero el primitivo carece.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 93,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué recorre cada ciclo al aplicar `for...in` frente a `for...of` sobre un arreglo?",
    "justificacion": "`for...in` recorre las **claves** —en un arreglo, los índices, y además como texto— y `for...of` recorre los **valores**. Por eso sobre arreglos casi siempre se quiere `for...of`. Y hay una razón más para no usar `for...in` con arreglos: también recorre propiedades heredadas o agregadas al objeto, así que puede devolver más de lo que uno espera.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 369,
        "letra": "a",
        "orden": 1,
        "texto": "Ambos recorren los valores; solo cambia el orden de la iteración.",
        "es_correcta": 0
      },
      {
        "id": 370,
        "letra": "b",
        "orden": 2,
        "texto": "`for...in` recorre los valores y `for...of` recorre las posiciones.",
        "es_correcta": 0
      },
      {
        "id": 371,
        "letra": "c",
        "orden": 3,
        "texto": "Ambos recorren las claves; `for...of` además expone el arreglo completo.",
        "es_correcta": 0
      },
      {
        "id": 372,
        "letra": "d",
        "orden": 4,
        "texto": "`for...in` recorre las claves del objeto y `for...of` recorre los valores.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 94,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Al invocar `sort()` sin argumentos sobre el arreglo [10, 9, 100], ¿en qué orden queda y por qué?",
    "justificacion": "Queda `[10, 100, 9]`. Sin función comparadora, `sort()` convierte cada elemento a texto y ordena alfabéticamente, y como texto `\"10\"` va antes que `\"100\"` y este antes que `\"9\"`, porque compara carácter a carácter. Para ordenar números de verdad hay que dárselo escrito: `arr.sort((a, b) => a - b)`. Es uno de los comportamientos más sorprendentes del lenguaje y por eso se pregunta tanto.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 373,
        "letra": "a",
        "orden": 1,
        "texto": "[10, 100, 9], porque compara los elementos como texto y no como números.",
        "es_correcta": 1
      },
      {
        "id": 374,
        "letra": "b",
        "orden": 2,
        "texto": "[9, 10, 100], porque el método detecta el tipo numérico automáticamente.",
        "es_correcta": 0
      },
      {
        "id": 375,
        "letra": "c",
        "orden": 3,
        "texto": "[100, 10, 9], porque sin argumentos ordena de mayor a menor por omisión.",
        "es_correcta": 0
      },
      {
        "id": 376,
        "letra": "d",
        "orden": 4,
        "texto": "[10, 9, 100], porque sin función comparadora conserva el orden original.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 95,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "En una estructura `switch`, ¿qué consecuencia acarrea omitir la sentencia `break` en un caso?",
    "justificacion": "Sin `break`, la ejecución sigue cayendo hacia los casos siguientes y los ejecuta aunque no coincidan, hasta encontrar un `break` o terminar el `switch`. Se llama fall-through y a veces se usa a propósito, agrupando varios casos que comparten el mismo cuerpo. Lo que nunca hace es lanzar error, repetirse ni volver al principio.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 377,
        "letra": "a",
        "orden": 1,
        "texto": "El intérprete aborta la estructura completa lanzando SyntaxError.",
        "es_correcta": 0
      },
      {
        "id": 378,
        "letra": "b",
        "orden": 2,
        "texto": "El bloque se repite indefinidamente hasta cumplir la condición.",
        "es_correcta": 0
      },
      {
        "id": 379,
        "letra": "c",
        "orden": 3,
        "texto": "El control retorna al inicio del switch reevaluando la expresión.",
        "es_correcta": 0
      },
      {
        "id": 380,
        "letra": "d",
        "orden": 4,
        "texto": "La ejecución continúa en los casos siguientes hasta hallar un break.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 96,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es la sintaxis correcta del operador condicional ternario para asignar un valor?",
    "justificacion": "La forma es `condición ? valorSiVerdadero : valorSiFalso`, y devuelve un valor, por eso se puede asignar directo. La (a) mezcla `if` con el ternario, que no se combinan; la (b) usa `|`, que es un operador de bits; y la (d) usa la flecha de las funciones. Es el único operador de JavaScript que toma tres operandos, de ahí el nombre.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 381,
        "letra": "a",
        "orden": 1,
        "texto": "let x = if (cond) ? valorA : valorB;",
        "es_correcta": 0
      },
      {
        "id": 382,
        "letra": "b",
        "orden": 2,
        "texto": "let x = cond ? valorA | valorB;",
        "es_correcta": 0
      },
      {
        "id": 383,
        "letra": "c",
        "orden": 3,
        "texto": "let x = cond ? valorA : valorB;",
        "es_correcta": 1
      },
      {
        "id": 384,
        "letra": "d",
        "orden": 4,
        "texto": "let x = (cond) => valorA : valorB;",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 97,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué delimitador y qué marcador exige una plantilla literal para interpolar una expresión?",
    "justificacion": "Las plantillas literales van entre comillas invertidas y la expresión se interpola con `${...}`. Dentro se puede poner cualquier expresión, no solo una variable, y además el texto puede ocupar varias líneas sin escapar nada, que es la otra ventaja frente a las comillas normales. Los marcadores `#{}`, `%%` y `@{}` son de otros lenguajes: el primero es de Ruby.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 385,
        "letra": "a",
        "orden": 1,
        "texto": "Comillas invertidas como delimitador y `${expresion}` como marcador.",
        "es_correcta": 1
      },
      {
        "id": 386,
        "letra": "b",
        "orden": 2,
        "texto": "Comillas dobles como delimitador y `#{expresion}` como marcador.",
        "es_correcta": 0
      },
      {
        "id": 387,
        "letra": "c",
        "orden": 3,
        "texto": "Comillas simples como delimitador y `%expresion%` como marcador.",
        "es_correcta": 0
      },
      {
        "id": 388,
        "letra": "d",
        "orden": 4,
        "texto": "Paréntesis como delimitador y `@{expresion}` como marcador.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 98,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Si a un arreglo de diez elementos se le asigna `length = 4`, ¿qué le sucede a su contenido?",
    "justificacion": "`length` es de lectura y escritura, y bajarlo trunca el arreglo: los elementos desde el índice 4 en adelante se descartan y no vuelven. Es la forma más corta de vaciar un arreglo, `arr.length = 0`. Las otras tres suponen protecciones que no existen: no es de solo lectura, no reordena nada y no hay capacidad reservada que pueda desbordarse.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 389,
        "letra": "a",
        "orden": 1,
        "texto": "La asignación se ignora, pues length es una propiedad de solo lectura.",
        "es_correcta": 0
      },
      {
        "id": 390,
        "letra": "b",
        "orden": 2,
        "texto": "Los elementos sobrantes se desplazan al inicio conservando su valor.",
        "es_correcta": 0
      },
      {
        "id": 391,
        "letra": "c",
        "orden": 3,
        "texto": "Se lanza un RangeError por reducir la capacidad ya reservada.",
        "es_correcta": 0
      },
      {
        "id": 392,
        "letra": "d",
        "orden": 4,
        "texto": "El arreglo se trunca y los elementos posteriores al índice 3 se descartan.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 99,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Respecto al método `push()` sobre un arreglo, ¿dónde inserta y qué valor devuelve la llamada?",
    "justificacion": "`push()` agrega al final y devuelve la nueva longitud, no el elemento. Confundirlo importa cuando se encadena o se guarda el resultado. El que agrega al principio es `unshift()`, y también devuelve la longitud. Ninguno de los dos devuelve una copia: los dos modifican el arreglo original.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 393,
        "letra": "a",
        "orden": 1,
        "texto": "Inserta al inicio y devuelve el elemento recién incorporado.",
        "es_correcta": 0
      },
      {
        "id": 394,
        "letra": "b",
        "orden": 2,
        "texto": "Inserta al final y devuelve la nueva longitud del arreglo.",
        "es_correcta": 1
      },
      {
        "id": 395,
        "letra": "c",
        "orden": 3,
        "texto": "Inserta al final y devuelve una copia superficial del arreglo.",
        "es_correcta": 0
      },
      {
        "id": 396,
        "letra": "d",
        "orden": 4,
        "texto": "Inserta al inicio y devuelve el índice asignado al elemento.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 100,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es la distinción sustantiva entre invocar `slice()` y aplicar `splice()` sobre un arreglo?",
    "justificacion": "`slice()` devuelve un trozo nuevo y deja el original intacto; `splice()` modifica el arreglo en su sitio, quitando o insertando elementos, y devuelve los que sacó. Los nombres se parecen tanto que la confusión es habitual, y la consecuencia no es menor: uno destruye datos y el otro no. La (d) es falsa: `slice` existe en cadenas **y** en arreglos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 397,
        "letra": "a",
        "orden": 1,
        "texto": "slice devuelve una porción sin alterar el original; splice muta el arreglo.",
        "es_correcta": 1
      },
      {
        "id": 398,
        "letra": "b",
        "orden": 2,
        "texto": "slice muta el arreglo original; splice opera sobre una copia aislada.",
        "es_correcta": 0
      },
      {
        "id": 399,
        "letra": "c",
        "orden": 3,
        "texto": "Ambos mutan el original, diferenciándose solo en el orden de los índices.",
        "es_correcta": 0
      },
      {
        "id": 400,
        "letra": "d",
        "orden": 4,
        "texto": "slice actúa sobre cadenas exclusivamente y splice sobre arreglos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 101,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Al ejecutar `parseInt(\"08px\")`, ¿qué valor entrega el analizador y bajo qué criterio se detiene?",
    "justificacion": "Devuelve el número `8`. `parseInt` lee desde el principio mientras encuentre caracteres válidos y se detiene en el primero que no lo sea, aquí la `p`, devolviendo lo leído hasta ahí. El `0` inicial no lo vuelve octal: eso ocurría en motores antiguos y el estándar lo fijó en decimal salvo que se indique la base, `parseInt(\"08\", 10)`. Devolvería `NaN` solo si no hubiera ningún dígito al principio, como en `parseInt(\"px8\")`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 401,
        "letra": "a",
        "orden": 1,
        "texto": "Entrega NaN, porque la cadena mezcla dígitos con caracteres alfabéticos.",
        "es_correcta": 0
      },
      {
        "id": 402,
        "letra": "b",
        "orden": 2,
        "texto": "Entrega 0, deteniéndose ante el cero inicial interpretado como octal.",
        "es_correcta": 0
      },
      {
        "id": 403,
        "letra": "c",
        "orden": 3,
        "texto": "Entrega \"08\", conservando el tipo String de la cadena original.",
        "es_correcta": 0
      },
      {
        "id": 404,
        "letra": "d",
        "orden": 4,
        "texto": "Entrega 8, deteniéndose en el primer carácter no numérico hallado.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 102,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Si un objeto se declara con `const`, ¿qué operaciones permanecen permitidas sobre él?",
    "justificacion": "`const` protege la **asignación del identificador**, no el contenido del objeto. Se pueden modificar, agregar y borrar propiedades; lo que falla es `obj = otroObjeto`. Para impedir también los cambios internos existe `Object.freeze()`, que es otra cosa y hay que pedirla. Suponer que `const` congela el objeto es uno de los malentendidos más extendidos del lenguaje.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 405,
        "letra": "a",
        "orden": 1,
        "texto": "Ninguna: el objeto queda congelado y rechaza toda escritura posterior.",
        "es_correcta": 0
      },
      {
        "id": 406,
        "letra": "b",
        "orden": 2,
        "texto": "Solo la reasignación completa del identificador a otro objeto.",
        "es_correcta": 0
      },
      {
        "id": 407,
        "letra": "c",
        "orden": 3,
        "texto": "Modificar, agregar y eliminar propiedades, pero no reasignar el identificador.",
        "es_correcta": 1
      },
      {
        "id": 408,
        "letra": "d",
        "orden": 4,
        "texto": "Únicamente la lectura de propiedades ya existentes al momento de declararlo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 103,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "En condicionales, ¿qué sucede al evaluar una expresión con coerción de tipos estricta (===)?",
    "justificacion": "`===` compara valor y tipo sin convertir nada: si los tipos difieren, el resultado es falso y ahí termina. Por eso `\"5\" === 5` da falso mientras `\"5\" == 5` da verdadero. La (a) describe a `==`, que es el operador contrario; la (c) inventa un error que no ocurre —comparar tipos distintos es legal—; y la (d) describe a `||`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 409,
        "letra": "a",
        "orden": 1,
        "texto": "Convierte los tipos de datos antes de comparar sus valores.",
        "es_correcta": 0
      },
      {
        "id": 410,
        "letra": "b",
        "orden": 2,
        "texto": "Evalúa igualdad lógica y de tipo sin conversión implícita.",
        "es_correcta": 1
      },
      {
        "id": 411,
        "letra": "c",
        "orden": 3,
        "texto": "Arroja un error de sintaxis si los tipos no coinciden.",
        "es_correcta": 0
      },
      {
        "id": 412,
        "letra": "d",
        "orden": 4,
        "texto": "Iguala a verdadero si al menos un operando es verdadero (truthy).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 104,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué evalúa correctamente la expresión 'typeof null' en JavaScript por un error histórico del lenguaje?",
    "justificacion": "`typeof null` responde `\"object\"`, y es un error conocido que viene de la primera implementación de JavaScript en 1995: internamente los valores llevaban una etiqueta de tipo y la de `null` coincidía con la de los objetos. Nunca se arregló porque hacerlo rompería código existente. Para comprobar si algo es `null` hay que compararlo directo: `valor === null`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 413,
        "letra": "a",
        "orden": 1,
        "texto": "\"null\"",
        "es_correcta": 0
      },
      {
        "id": 414,
        "letra": "b",
        "orden": 2,
        "texto": "\"undefined\"",
        "es_correcta": 0
      },
      {
        "id": 415,
        "letra": "c",
        "orden": 3,
        "texto": "\"object\"",
        "es_correcta": 1
      },
      {
        "id": 416,
        "letra": "d",
        "orden": 4,
        "texto": "\"boolean\"",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 105,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es la precedencia al evaluar una expresión matemática compleja en código JavaScript?",
    "justificacion": "Multiplicación y división se evalúan antes que suma y resta, y los paréntesis mandan sobre todo. Los operadores lógicos tienen precedencia **menor** que los aritméticos, así que la (a) está al revés; la asignación es de las últimas en evaluarse, no de las primeras; y la (d) describe una evaluación sin precedencia, que no es la de JavaScript ni la de la aritmética.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 417,
        "letra": "a",
        "orden": 1,
        "texto": "Operadores lógicos antes que los aritméticos.",
        "es_correcta": 0
      },
      {
        "id": 418,
        "letra": "b",
        "orden": 2,
        "texto": "Multiplicación y división antes que sumas y restas.",
        "es_correcta": 1
      },
      {
        "id": 419,
        "letra": "c",
        "orden": 3,
        "texto": "Asignación ocurre antes de la evaluación matemática.",
        "es_correcta": 0
      },
      {
        "id": 420,
        "letra": "d",
        "orden": 4,
        "texto": "Ejecución lineal estricta de izquierda a derecha siempre.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 106,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué método de arreglos elimina el último elemento y retorna su valor simultáneamente?",
    "justificacion": "`pop()` quita el último elemento y devuelve ese elemento, así que sirve para sacar y usar en un solo paso. `shift()` hace lo mismo pero con el primero; `unshift()` agrega al principio; y `push()` agrega al final. Los cuatro modifican el arreglo original, y conviene aprenderlos por pares: `push`/`pop` al final, `unshift`/`shift` al principio.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 421,
        "letra": "a",
        "orden": 1,
        "texto": "shift()",
        "es_correcta": 0
      },
      {
        "id": 422,
        "letra": "b",
        "orden": 2,
        "texto": "unshift()",
        "es_correcta": 0
      },
      {
        "id": 423,
        "letra": "c",
        "orden": 3,
        "texto": "push()",
        "es_correcta": 0
      },
      {
        "id": 424,
        "letra": "d",
        "orden": 4,
        "texto": "pop()",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 107,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué problema crítico ocurre al declarar variables iteradoras globales en ciclos anidados (for)?",
    "justificacion": "Si los dos ciclos comparten la misma variable global como contador, el ciclo interior la deja en su valor final y el exterior continúa desde ahí, así que el exterior no completa sus vueltas. La salida es declarar el contador con `let` dentro de cada `for`, que le da a cada ciclo el suyo. No hay error de sintaxis ni desbordamiento: el programa corre y da un resultado equivocado, que es peor.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 425,
        "letra": "a",
        "orden": 1,
        "texto": "Provoca un desbordamiento de pila instantáneo (Stack Overflow).",
        "es_correcta": 0
      },
      {
        "id": 426,
        "letra": "b",
        "orden": 2,
        "texto": "El ciclo interior modificará el contador del ciclo exterior.",
        "es_correcta": 1
      },
      {
        "id": 427,
        "letra": "c",
        "orden": 3,
        "texto": "El navegador arroja un error de sintaxis bloqueante.",
        "es_correcta": 0
      },
      {
        "id": 428,
        "letra": "d",
        "orden": 4,
        "texto": "Convierte automáticamente el arreglo iterado en un objeto.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 108,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es el riesgo de modificar un arreglo mientras se itera linealmente sobre él (ej: borrando)?",
    "justificacion": "Al borrar un elemento, los que están detrás se corren una posición hacia atrás mientras el índice del ciclo sigue avanzando, así que el que ocupó el lugar del borrado se salta sin visitarse. Las salidas habituales son recorrer de atrás hacia adelante, o construir un arreglo nuevo con `filter()` en vez de modificar el que se está recorriendo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 429,
        "letra": "a",
        "orden": 1,
        "texto": "Puede saltar elementos y desfasar el índice del ciclo actual.",
        "es_correcta": 1
      },
      {
        "id": 430,
        "letra": "b",
        "orden": 2,
        "texto": "Borrará el arreglo completo al detectar un cambio de longitud.",
        "es_correcta": 0
      },
      {
        "id": 431,
        "letra": "c",
        "orden": 3,
        "texto": "El arreglo se congela automáticamente y arroja excepción.",
        "es_correcta": 0
      },
      {
        "id": 432,
        "letra": "d",
        "orden": 4,
        "texto": "Duplica la memoria asignada al proceso del ciclo (Memory Leak).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 109,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Qué ocurre con las variables declaradas dentro de una función regular utilizando 'var'?",
    "justificacion": "`var` tiene alcance de **función**: la variable existe en toda la función donde se declaró, y no fuera. Ese es su contraste con `let` y `const`, que tienen alcance de bloque y por eso desaparecen al cerrar un `if` o un `for`, lo que describe la (d). Y no se vuelve global: eso pasa al asignar sin declarar, que es otra cosa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 433,
        "letra": "a",
        "orden": 1,
        "texto": "Pasan a ser variables globales accesibles desde cualquier lugar.",
        "es_correcta": 0
      },
      {
        "id": 434,
        "letra": "b",
        "orden": 2,
        "texto": "Tienen alcance (scope) local restringido únicamente a esa función.",
        "es_correcta": 1
      },
      {
        "id": 435,
        "letra": "c",
        "orden": 3,
        "texto": "Se bloquean y causan conflicto si existe una global igual.",
        "es_correcta": 0
      },
      {
        "id": 436,
        "letra": "d",
        "orden": 4,
        "texto": "Son de alcance de bloque y desaparecen tras un if interno.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 110,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Si una función no tiene una sentencia return explícita, ¿qué valor retorna por defecto al invocarse?",
    "justificacion": "Sin `return`, la función devuelve `undefined`. Es el valor por omisión y no un caso especial. Los otros tres son valores concretos que alguien tendría que haber escrito: `null` significa vacío a propósito, `false` es un booleano y `0` un número. Reconocer un `undefined` inesperado suele ser la pista de que una función no devolvía lo que se creía.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 437,
        "letra": "a",
        "orden": 1,
        "texto": "false",
        "es_correcta": 0
      },
      {
        "id": 438,
        "letra": "b",
        "orden": 2,
        "texto": "null",
        "es_correcta": 0
      },
      {
        "id": 439,
        "letra": "c",
        "orden": 3,
        "texto": "undefined",
        "es_correcta": 1
      },
      {
        "id": 440,
        "letra": "d",
        "orden": 4,
        "texto": "0",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 111,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es el problema estructural causado por abusar de las variables globales en funciones?",
    "justificacion": "Cualquier función puede escribir una variable global, así que dos funciones que no se conocen pueden pisarse el valor; y como todas dependen del mismo estado compartido, quedan acopladas y no se pueden mover ni probar por separado. Las otras tres describen problemas inventados: las globales no tocan la memoria de video, no bloquean el DOM y no impiden anidar funciones.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 441,
        "letra": "a",
        "orden": 1,
        "texto": "Sobreescritura accidental y alta dependencia (acoplamiento).",
        "es_correcta": 1
      },
      {
        "id": 442,
        "letra": "b",
        "orden": 2,
        "texto": "Desbordan la memoria de las tarjetas de video del usuario.",
        "es_correcta": 0
      },
      {
        "id": 443,
        "letra": "c",
        "orden": 3,
        "texto": "Bloquean automáticamente el acceso directo al árbol del DOM.",
        "es_correcta": 0
      },
      {
        "id": 444,
        "letra": "d",
        "orden": 4,
        "texto": "Generan un error de compilación al definir funciones anidadas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 112,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "¿Cuál es la sintaxis correcta para acceder a un método interno de objeto mediante la notación de punto?",
    "justificacion": "La notación de punto es `objeto.metodo()`: el nombre del objeto, un punto, el nombre del método y los paréntesis que lo invocan. `->` es de PHP y C++, `::` es de C++ y de la sintaxis de clases de otros lenguajes, y `objeto[metodo()]` usa corchetes, que sí existen en JavaScript pero con otro sentido: ahí se evaluaría `metodo()` y su resultado se usaría como nombre de propiedad.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 445,
        "letra": "a",
        "orden": 1,
        "texto": "objeto->metodo()",
        "es_correcta": 0
      },
      {
        "id": 446,
        "letra": "b",
        "orden": 2,
        "texto": "objeto.metodo()",
        "es_correcta": 1
      },
      {
        "id": 447,
        "letra": "c",
        "orden": 3,
        "texto": "objeto::metodo()",
        "es_correcta": 0
      },
      {
        "id": 448,
        "letra": "d",
        "orden": 4,
        "texto": "objeto[metodo()]",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 113,
    "modulo": 3,
    "modulo_titulo": "Fundamentos de Programacion en JavaScript",
    "modulo_icono": "data-object",
    "enunciado": "Al llamar String.prototype.slice(1, -1) en la cadena \"Prueba\", ¿qué porción de texto se retorna?",
    "justificacion": "Devuelve `\"rueb\"`. `slice(1, -1)` empieza en el índice 1, que es la `r`, y el `-1` cuenta desde el final, así que corta antes del último carácter y deja fuera la `a` final. La `P` inicial se pierde por empezar en 1 y la `a` final por el índice negativo. Poder usar índices negativos para contar desde atrás es lo que la pregunta evalúa, y es propio de `slice`: `substring` no lo admite.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 449,
        "letra": "a",
        "orden": 1,
        "texto": "\"rueb\"",
        "es_correcta": 1
      },
      {
        "id": 450,
        "letra": "b",
        "orden": 2,
        "texto": "\"rueba\"",
        "es_correcta": 0
      },
      {
        "id": 451,
        "letra": "c",
        "orden": 3,
        "texto": "\"Prue\"",
        "es_correcta": 0
      },
      {
        "id": 452,
        "letra": "d",
        "orden": 4,
        "texto": "\"rue\"",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 114,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué pilar de POO oculta el estado interno de un objeto y exige métodos para alterarlo?",
    "justificacion": "El encapsulamiento es el pilar que esconde el estado interno y obliga a pasar por métodos para tocarlo, de modo que el objeto controla cómo se lo modifica. Los otros tres existen y hacen otra cosa: el polimorfismo permite que objetos distintos respondan al mismo método, la abstracción expone qué hace algo y esconde cómo, y la herencia múltiple ni siquiera es de JavaScript — un objeto hereda de un solo prototipo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 453,
        "letra": "a",
        "orden": 1,
        "texto": "Herencia múltiple.",
        "es_correcta": 0
      },
      {
        "id": 454,
        "letra": "b",
        "orden": 2,
        "texto": "Encapsulamiento.",
        "es_correcta": 1
      },
      {
        "id": 455,
        "letra": "c",
        "orden": 3,
        "texto": "Polimorfismo.",
        "es_correcta": 0
      },
      {
        "id": 456,
        "letra": "d",
        "orden": 4,
        "texto": "Abstracción estructural.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 115,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En JS pre-ES6, ¿qué mecanismo emula la herencia de clases tradicional?",
    "justificacion": "Antes de ES6 no había clases, y la herencia se armaba con la cadena de prototipos: cada objeto guarda un enlace a otro, y al pedir una propiedad que no tiene, el motor sube por esa cadena hasta encontrarla o llegar a `null`. Las clases de ES6 no cambiaron eso: son azúcar sintáctico sobre el mismo mecanismo. Las otras tres nombran cosas que JavaScript no tiene: clases abstractas puras, mixins estáticos globales, y desde luego no se manipula la memoria a mano.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 457,
        "letra": "a",
        "orden": 1,
        "texto": "La cadena de prototipos (prototype chain).",
        "es_correcta": 1
      },
      {
        "id": 458,
        "letra": "b",
        "orden": 2,
        "texto": "Clases abstractas puras.",
        "es_correcta": 0
      },
      {
        "id": 459,
        "letra": "c",
        "orden": 3,
        "texto": "Mixins estáticos globales.",
        "es_correcta": 0
      },
      {
        "id": 460,
        "letra": "d",
        "orden": 4,
        "texto": "Mutación directa de la memoria base.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 116,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué método convierte un objeto literal de JavaScript a una cadena de texto en formato JSON?",
    "justificacion": "`JSON.stringify()` convierte un valor de JavaScript a texto en formato JSON. El que va en la dirección contraria es `JSON.parse()`, que es la (a) y el par con el que siempre se confunde: uno serializa y el otro interpreta. `Object.toJSON()` y `String.fromJSON()` no existen. Conviene recordar que `stringify` **descarta** las funciones y las propiedades `undefined`, lo que enlaza con la pregunta sobre qué tipos admite JSON.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 461,
        "letra": "a",
        "orden": 1,
        "texto": "JSON.parse()",
        "es_correcta": 0
      },
      {
        "id": 462,
        "letra": "b",
        "orden": 2,
        "texto": "Object.toJSON()",
        "es_correcta": 0
      },
      {
        "id": 463,
        "letra": "c",
        "orden": 3,
        "texto": "JSON.stringify()",
        "es_correcta": 1
      },
      {
        "id": 464,
        "letra": "d",
        "orden": 4,
        "texto": "String.fromJSON()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 117,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué restricción estricta de sintaxis aplica al estándar JSON que difiere de objetos JS?",
    "justificacion": "En JSON las claves van **siempre** entre comillas dobles: `{\"nombre\": \"Ana\"}`. Los objetos de JavaScript son más laxos —admiten claves sin comillas y con comillas simples—, y esa diferencia es la fuente del error más común al escribir JSON a mano. Las otras tres describen permisos que JSON no da: no admite comentarios, no admite funciones como valores, y no perdona las claves sin comillas aunque sean alfanuméricas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 465,
        "letra": "a",
        "orden": 1,
        "texto": "Las claves deben estar obligatoriamente entre comillas dobles.",
        "es_correcta": 1
      },
      {
        "id": 466,
        "letra": "b",
        "orden": 2,
        "texto": "Permite comentarios multi-línea con la sintaxis /* */.",
        "es_correcta": 0
      },
      {
        "id": 467,
        "letra": "c",
        "orden": 3,
        "texto": "Admite funciones como valores de las propiedades.",
        "es_correcta": 0
      },
      {
        "id": 468,
        "letra": "d",
        "orden": 4,
        "texto": "Las claves no requieren comillas si son alfanuméricas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 118,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En POO, ¿qué término define a una entidad concreta creada a partir de una clase plantilla?",
    "justificacion": "Una instancia es el objeto concreto que se crea a partir de una clase: la clase es el plano y la instancia es la casa construida. Un prototipo es el objeto del que se hereda, no lo que se construye; una interfaz describe un contrato y JavaScript no las tiene como constructo del lenguaje; y un método estático pertenece a la clase y no a los objetos que salen de ella.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 469,
        "letra": "a",
        "orden": 1,
        "texto": "Prototipo.",
        "es_correcta": 0
      },
      {
        "id": 470,
        "letra": "b",
        "orden": 2,
        "texto": "Interfaz.",
        "es_correcta": 0
      },
      {
        "id": 471,
        "letra": "c",
        "orden": 3,
        "texto": "Método estático.",
        "es_correcta": 0
      },
      {
        "id": 472,
        "letra": "d",
        "orden": 4,
        "texto": "Instancia.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 119,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Al instanciar un objeto con `new`, ¿qué función especial de la clase se ejecuta primero?",
    "justificacion": "El `constructor()` es lo primero que corre al usar `new`: recibe los argumentos y prepara el objeto. `super()` también corre pronto, pero **dentro** del constructor y solo cuando hay herencia — y ahí hay una regla que conviene saber: si la clase extiende a otra, hay que llamar a `super()` antes de usar `this`. `render()` e `init()` no son nada del lenguaje; son convenciones de bibliotecas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 473,
        "letra": "a",
        "orden": 1,
        "texto": "render()",
        "es_correcta": 0
      },
      {
        "id": 474,
        "letra": "b",
        "orden": 2,
        "texto": "init()",
        "es_correcta": 0
      },
      {
        "id": 475,
        "letra": "c",
        "orden": 3,
        "texto": "constructor()",
        "es_correcta": 1
      },
      {
        "id": 476,
        "letra": "d",
        "orden": 4,
        "texto": "super()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 120,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En notación literal de objetos JS, ¿cómo defines un método interno correctamente?",
    "justificacion": "En notación literal, un método es una propiedad cuyo valor es una función: `metodo: function() {}`. La (b) es la sintaxis de una función suelta y no cabe dentro de un objeto literal; la (c) confunde la flecha con la asignación, y la (d) es de Python. Desde ES6 existe además la forma abreviada `metodo() {}`, que significa exactamente lo mismo y es la que se ve hoy en el código nuevo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 477,
        "letra": "a",
        "orden": 1,
        "texto": "method: function() {}",
        "es_correcta": 1
      },
      {
        "id": 478,
        "letra": "b",
        "orden": 2,
        "texto": "function method() {}",
        "es_correcta": 0
      },
      {
        "id": 479,
        "letra": "c",
        "orden": 3,
        "texto": "method => {}",
        "es_correcta": 0
      },
      {
        "id": 480,
        "letra": "d",
        "orden": 4,
        "texto": "def method() {}",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 121,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué tipo de dato nativo JS no es válido para ser almacenado en una estructura JSON?",
    "justificacion": "JSON no tiene tipo función, así que una función no se puede guardar en él. `JSON.stringify()` no falla al encontrarse una: **la omite en silencio**, que es peor que fallar, porque el objeto viaja incompleto sin que nadie avise. Los otros tres —booleanos, números y arreglos— son tipos que JSON admite sin problema, junto con cadenas, objetos y `null`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 481,
        "letra": "a",
        "orden": 1,
        "texto": "Booleano (true/false).",
        "es_correcta": 0
      },
      {
        "id": 482,
        "letra": "b",
        "orden": 2,
        "texto": "Número (enteros o flotantes).",
        "es_correcta": 0
      },
      {
        "id": 483,
        "letra": "c",
        "orden": 3,
        "texto": "Array (lista de elementos).",
        "es_correcta": 0
      },
      {
        "id": 484,
        "letra": "d",
        "orden": 4,
        "texto": "Función o método.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 122,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En el prototipo de JS, ¿qué propiedad apunta al objeto del cual hereda sus métodos base?",
    "justificacion": "`__proto__` es la propiedad que apunta al objeto del que se hereda, y recorrerla es recorrer la cadena de prototipos. Las otras tres no existen. Conviene saber que hoy `__proto__` está desaconsejada aunque siga funcionando: lo recomendado es `Object.getPrototypeOf(obj)` para leerla y `Object.setPrototypeOf()` para cambiarla, y que no se confunde con `prototype`, que es otra cosa y vive en las funciones constructoras.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 485,
        "letra": "a",
        "orden": 1,
        "texto": "__super__",
        "es_correcta": 0
      },
      {
        "id": 486,
        "letra": "b",
        "orden": 2,
        "texto": "__proto__",
        "es_correcta": 1
      },
      {
        "id": 487,
        "letra": "c",
        "orden": 3,
        "texto": "baseObject",
        "es_correcta": 0
      },
      {
        "id": 488,
        "letra": "d",
        "orden": 4,
        "texto": "parentClass",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 123,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué característica fundamental diferencia a `let` frente a `var` en su ámbito de alcance?",
    "justificacion": "`let` tiene alcance de **bloque**: existe dentro de las llaves donde se declaró y desaparece al salir, así que un `let` dentro de un `if` o un `for` no se ve fuera. `var` tiene alcance de función, que es más ancho y la causa de muchos errores con contadores de ciclos. Las otras tres son falsas: `let` no es global, sí permite cambiar el tipo del valor, y `var` no desaparece al salir de un bloque.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 489,
        "letra": "a",
        "orden": 1,
        "texto": "let tiene alcance global exclusivo.",
        "es_correcta": 0
      },
      {
        "id": 490,
        "letra": "b",
        "orden": 2,
        "texto": "let posee alcance limitado al bloque (block scope).",
        "es_correcta": 1
      },
      {
        "id": 491,
        "letra": "c",
        "orden": 3,
        "texto": "let no permite cambiar el tipo de dato asignado.",
        "es_correcta": 0
      },
      {
        "id": 492,
        "letra": "d",
        "orden": 4,
        "texto": "var se destruye automáticamente al salir de la función.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 124,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué ocurre si intentas reasignar un nuevo valor escalar a una variable definida con `const`?",
    "justificacion": "Reasignar una variable declarada con `const` lanza un `TypeError`. Es un error de verdad, no un aviso: la asignación no ocurre y, si nadie lo atrapa, corta la ejecución de ese script. Ojo con el alcance de la protección, que es lo que más se confunde: `const` protege **el identificador**, no el contenido. Sobre un objeto declarado con `const` se pueden agregar, cambiar y borrar propiedades; lo que falla es apuntarlo a otro objeto.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 493,
        "letra": "a",
        "orden": 1,
        "texto": "Cambia el valor silenciosamente.",
        "es_correcta": 0
      },
      {
        "id": 494,
        "letra": "b",
        "orden": 2,
        "texto": "Ignora el cambio manteniendo el primer valor.",
        "es_correcta": 0
      },
      {
        "id": 495,
        "letra": "c",
        "orden": 3,
        "texto": "Lanza un TypeError crítico deteniendo la ejecución.",
        "es_correcta": 1
      },
      {
        "id": 496,
        "letra": "d",
        "orden": 4,
        "texto": "Retorna false en la operación de asignación.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 125,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué comportamiento léxico particular tienen las Arrow Functions (`=>`) respecto a `this`?",
    "justificacion": "Las funciones flecha no tienen `this` propio: usan el del contexto donde fueron escritas. Por eso resuelven el problema clásico de perder `this` dentro de un callback, y por eso **no sirven como métodos de un objeto** cuando se espera que `this` apunte a ese objeto. Es un comportamiento léxico —lo decide dónde está escrita la función, no cómo se la llama— y es la diferencia práctica más importante frente a `function`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 497,
        "letra": "a",
        "orden": 1,
        "texto": "Heredan `this` del contexto de ejecución circundante.",
        "es_correcta": 1
      },
      {
        "id": 498,
        "letra": "b",
        "orden": 2,
        "texto": "Tienen su propio `this` inmutable.",
        "es_correcta": 0
      },
      {
        "id": 499,
        "letra": "c",
        "orden": 3,
        "texto": "Apuntan siempre al objeto global `window`.",
        "es_correcta": 0
      },
      {
        "id": 500,
        "letra": "d",
        "orden": 4,
        "texto": "Generan un error si se invoca `this` en su interior.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 126,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué operador ES6 permite desestructurar un arreglo y agrupar el resto de sus elementos?",
    "justificacion": "El operador rest agrupa lo que sobra en un arreglo nuevo: `const [primero, ...resto] = lista`. Comparte los tres puntos con el spread y por eso se confunden, pero hacen lo contrario: **rest recoge y spread reparte**. Lo que decide cuál es cuál es la posición — a la izquierda de una asignación o en los parámetros de una función, recoge; dentro de un arreglo, un objeto o una llamada, reparte.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 501,
        "letra": "a",
        "orden": 1,
        "texto": "Operador Spread (...).",
        "es_correcta": 0
      },
      {
        "id": 502,
        "letra": "b",
        "orden": 2,
        "texto": "Operador Rest (...).",
        "es_correcta": 1
      },
      {
        "id": 503,
        "letra": "c",
        "orden": 3,
        "texto": "Operador In (in).",
        "es_correcta": 0
      },
      {
        "id": 504,
        "letra": "d",
        "orden": 4,
        "texto": "Nullish Coalescing (??).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 127,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En clases ES6, ¿qué palabra clave invoca al constructor de la clase padre al usar herencia?",
    "justificacion": "`super()` llama al constructor de la clase padre, y hay que invocarlo antes de usar `this` en una clase que extiende a otra. `extends` existe pero es la palabra que declara la herencia en la cabecera de la clase, no una función que se invoque; `parent()` y `base()` no son nada de JavaScript. `super` también sirve para llamar métodos del padre desde un método propio: `super.metodo()`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 505,
        "letra": "a",
        "orden": 1,
        "texto": "parent()",
        "es_correcta": 0
      },
      {
        "id": 506,
        "letra": "b",
        "orden": 2,
        "texto": "extends()",
        "es_correcta": 0
      },
      {
        "id": 507,
        "letra": "c",
        "orden": 3,
        "texto": "super()",
        "es_correcta": 1
      },
      {
        "id": 508,
        "letra": "d",
        "orden": 4,
        "texto": "base()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 128,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué mecanismo en ES6 permite expandir elementos de un arreglo dentro de otro arreglo nuevo?",
    "justificacion": "El operador spread expande los elementos de un arreglo dentro de otro: `[...a, ...b]`. `Array.concat()` consigue un resultado parecido y por eso es un buen distractor, pero la pregunta es por el mecanismo de ES6. Ojo con un límite que importa: el spread hace una copia **superficial**, así que los objetos de dentro se siguen compartiendo entre el arreglo viejo y el nuevo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 509,
        "letra": "a",
        "orden": 1,
        "texto": "Array.concat()",
        "es_correcta": 0
      },
      {
        "id": 510,
        "letra": "b",
        "orden": 2,
        "texto": "Destructuring.",
        "es_correcta": 0
      },
      {
        "id": 511,
        "letra": "c",
        "orden": 3,
        "texto": "Operador Spread (...).",
        "es_correcta": 1
      },
      {
        "id": 512,
        "letra": "d",
        "orden": 4,
        "texto": "String Interpolation.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 129,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Cómo se define correctamente un método estático dentro de una clase en ES6?",
    "justificacion": "Un método estático se declara anteponiendo `static` al nombre, y pertenece a la clase y no a sus instancias: se invoca como `Clase.metodo()` y no desde un objeto creado con `new`. La (b) define una propiedad con una función flecha, que no es lo mismo; la (c) mezcla dos sintaxis que no se combinan; y la (d) usa un decorador, que no es JavaScript estándar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 513,
        "letra": "a",
        "orden": 1,
        "texto": "static nombreMetodo() {}",
        "es_correcta": 1
      },
      {
        "id": 514,
        "letra": "b",
        "orden": 2,
        "texto": "const nombreMetodo = () => {}",
        "es_correcta": 0
      },
      {
        "id": 515,
        "letra": "c",
        "orden": 3,
        "texto": "function static nombreMetodo() {}",
        "es_correcta": 0
      },
      {
        "id": 516,
        "letra": "d",
        "orden": 4,
        "texto": "@static nombreMetodo() {}",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 130,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué palabra clave se usa en un módulo ES6 para exponer una función y usarla en otro archivo?",
    "justificacion": "`export` es la palabra de los módulos ES6 para exponer algo a otro archivo. `module.exports` es la forma de CommonJS, la de Node antes de los módulos ES, y por eso es el distractor que separa los dos sistemas — que no se mezclan en el mismo archivo. `expose` e `include` no existen. En este proyecto se usa `export`, porque las páginas cargan sus scripts con `type=\"module\"`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 517,
        "letra": "a",
        "orden": 1,
        "texto": "expose",
        "es_correcta": 0
      },
      {
        "id": 518,
        "letra": "b",
        "orden": 2,
        "texto": "module.exports",
        "es_correcta": 0
      },
      {
        "id": 519,
        "letra": "c",
        "orden": 3,
        "texto": "export",
        "es_correcta": 1
      },
      {
        "id": 520,
        "letra": "d",
        "orden": 4,
        "texto": "include",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 131,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Cuál es la sintaxis correcta para importar un módulo exportado por defecto en ES6?",
    "justificacion": "Lo exportado por defecto se importa sin llaves y con el nombre que uno quiera: `import Modulo from './archivo.js'`. Con llaves, la (a), se importan las exportaciones **nombradas**, y ahí el nombre sí tiene que coincidir. `require()` es de CommonJS. Un archivo puede tener una sola exportación por defecto y todas las nombradas que quiera.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 521,
        "letra": "a",
        "orden": 1,
        "texto": "import { Modulo } from './archivo.js';",
        "es_correcta": 0
      },
      {
        "id": 522,
        "letra": "b",
        "orden": 2,
        "texto": "import Modulo from './archivo.js';",
        "es_correcta": 1
      },
      {
        "id": 523,
        "letra": "c",
        "orden": 3,
        "texto": "require('./archivo.js');",
        "es_correcta": 0
      },
      {
        "id": 524,
        "letra": "d",
        "orden": 4,
        "texto": "fetch('./archivo.js').import;",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 132,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué ventaja principal ofrece la interpolación de strings mediante template literals (` `)?",
    "justificacion": "Dentro de una plantilla literal, `${...}` evalúa cualquier expresión de JavaScript y pega su resultado en el texto: no solo variables, también llamadas a funciones y operaciones. La segunda ventaja, que la pregunta no menciona, es que el texto puede ocupar varias líneas sin escapar nada. Las otras tres prometen cosas que no ocurren: no cifra, no convierte a número y no compila a binario.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 525,
        "letra": "a",
        "orden": 1,
        "texto": "Cifra el texto automáticamente.",
        "es_correcta": 0
      },
      {
        "id": 526,
        "letra": "b",
        "orden": 2,
        "texto": "Ejecuta expresiones JS complejas incrustadas con ${}.",
        "es_correcta": 1
      },
      {
        "id": 527,
        "letra": "c",
        "orden": 3,
        "texto": "Convierte strings a números de forma nativa.",
        "es_correcta": 0
      },
      {
        "id": 528,
        "letra": "d",
        "orden": 4,
        "texto": "Compila el texto a binario para mayor velocidad.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 133,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué representa la estructura subyacente jerárquica del DOM (Document Object Model)?",
    "justificacion": "El DOM es un árbol de nodos: el documento es la raíz y cada etiqueta, atributo y trozo de texto es un nodo con sus hijos. Esa forma es lo que permite recorrerlo, buscar dentro y modificarlo desde JavaScript. No es una lista plana de cadenas de HTML —esa es la vista del código fuente, no la del documento cargado— ni es estático ni es una base de datos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 529,
        "letra": "a",
        "orden": 1,
        "texto": "Un arreglo lineal de cadenas HTML.",
        "es_correcta": 0
      },
      {
        "id": 530,
        "letra": "b",
        "orden": 2,
        "texto": "Un árbol de nodos de objetos accesibles mediante JS.",
        "es_correcta": 1
      },
      {
        "id": 531,
        "letra": "c",
        "orden": 3,
        "texto": "Un documento XML estático y no mutable.",
        "es_correcta": 0
      },
      {
        "id": 532,
        "letra": "d",
        "orden": 4,
        "texto": "Una base de datos relacional del lado del cliente.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 134,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué método estándar de JS añade un nuevo nodo hijo al final de un elemento padre en el DOM?",
    "justificacion": "`appendChild()` agrega un nodo como último hijo del elemento sobre el que se lo llama. Las otras tres no existen con esos nombres. Vale la pena conocer a sus vecinos reales: `insertBefore()` coloca antes de un nodo concreto, y los modernos `append()`, `prepend()`, `before()` y `after()` admiten además texto suelto y varios nodos a la vez.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 533,
        "letra": "a",
        "orden": 1,
        "texto": "appendChild()",
        "es_correcta": 1
      },
      {
        "id": 534,
        "letra": "b",
        "orden": 2,
        "texto": "insertAfter()",
        "es_correcta": 0
      },
      {
        "id": 535,
        "letra": "c",
        "orden": 3,
        "texto": "addChild()",
        "es_correcta": 0
      },
      {
        "id": 536,
        "letra": "d",
        "orden": 4,
        "texto": "pushNode()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 135,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En la fase de captura de eventos del DOM, ¿en qué dirección se propaga el evento?",
    "justificacion": "La captura va **desde la raíz hacia el elemento objetivo**: el evento baja por el árbol antes de llegar a su destino. Es la primera de las tres fases —captura, destino y burbujeo— y es la menos usada, porque `addEventListener` escucha en burbujeo salvo que se le pase `true` o `{ capture: true }`. La (a) describe el burbujeo, que es el camino de vuelta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 537,
        "letra": "a",
        "orden": 1,
        "texto": "Desde el elemento objetivo hacia la raíz del documento.",
        "es_correcta": 0
      },
      {
        "id": 538,
        "letra": "b",
        "orden": 2,
        "texto": "Desde la raíz del documento hacia el elemento objetivo.",
        "es_correcta": 1
      },
      {
        "id": 539,
        "letra": "c",
        "orden": 3,
        "texto": "Solo se ejecuta en los nodos hermanos adyacentes.",
        "es_correcta": 0
      },
      {
        "id": 540,
        "letra": "d",
        "orden": 4,
        "texto": "El evento no se propaga, permanece estático en el nodo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 136,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Si se asignan varios manejadores al mismo evento en un nodo con `addEventListener`, ¿qué pasa?",
    "justificacion": "Se ejecutan todos, en el orden en que se registraron. Ésa es una de las razones de ser de `addEventListener` frente a asignar `onclick`, que sí se sobrescribe: con `onclick` solo sobrevive el último manejador. No hay error de duplicidad, y ninguno bloquea a los siguientes — salvo que uno llame a `stopImmediatePropagation()`, que es lo único que corta la lista.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 541,
        "letra": "a",
        "orden": 1,
        "texto": "El último manejador sobreescribe a todos los anteriores.",
        "es_correcta": 0
      },
      {
        "id": 542,
        "letra": "b",
        "orden": 2,
        "texto": "Se ejecutan todos los manejadores en orden de registro.",
        "es_correcta": 1
      },
      {
        "id": 543,
        "letra": "c",
        "orden": 3,
        "texto": "Genera un error de duplicidad de eventos.",
        "es_correcta": 0
      },
      {
        "id": 544,
        "letra": "d",
        "orden": 4,
        "texto": "Solo se ejecuta el primero, bloqueando los subsiguientes.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 137,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué propiedad del objeto evento (Event) identifica el nodo exacto que originó dicho evento?",
    "justificacion": "`event.target` es el nodo donde el evento se originó de verdad. Se distingue de `event.currentTarget`, que es el elemento en el que está puesto el manejador y que es la (a): en un manejador delegado sobre un contenedor, `currentTarget` es el contenedor y `target` es el hijo que recibió el clic. Esa diferencia es exactamente lo que hace posible la delegación de eventos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 545,
        "letra": "a",
        "orden": 1,
        "texto": "event.currentTarget",
        "es_correcta": 0
      },
      {
        "id": 546,
        "letra": "b",
        "orden": 2,
        "texto": "event.source",
        "es_correcta": 0
      },
      {
        "id": 547,
        "letra": "c",
        "orden": 3,
        "texto": "event.target",
        "es_correcta": 1
      },
      {
        "id": 548,
        "letra": "d",
        "orden": 4,
        "texto": "event.nodeOrigin",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 138,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué método detiene la propagación (burbujeo) de un evento hacia sus nodos padres en el DOM?",
    "justificacion": "`stopPropagation()` corta el viaje del evento hacia los nodos padres. No se confunde con `preventDefault()`, que es la (a) y cancela la acción por omisión del navegador —enviar el formulario, seguir el enlace— sin detener la propagación: son dos cosas independientes y a veces se usan juntas. `cancelBubble` existe como propiedad heredada de Internet Explorer, pero no como método, y `stopBouncing()` no existe.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 549,
        "letra": "a",
        "orden": 1,
        "texto": "event.preventDefault()",
        "es_correcta": 0
      },
      {
        "id": 550,
        "letra": "b",
        "orden": 2,
        "texto": "event.stopPropagation()",
        "es_correcta": 1
      },
      {
        "id": 551,
        "letra": "c",
        "orden": 3,
        "texto": "event.cancelBubble()",
        "es_correcta": 0
      },
      {
        "id": 552,
        "letra": "d",
        "orden": 4,
        "texto": "event.stopBouncing()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 139,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Para modificar las clases CSS de un nodo de forma segura y dinámica, ¿qué propiedad usarías?",
    "justificacion": "`classList` da una interfaz pensada para esto —`add()`, `remove()`, `toggle()`, `contains()`— y toca una sola clase sin pisar las demás. `className` es la (a) y es la forma antigua: guarda todas las clases en una cadena, así que asignarle un valor **borra las que ya estaban**, y ése es el «de forma segura» que la pregunta pide. `style` cambia estilos en línea, no clases.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 553,
        "letra": "a",
        "orden": 1,
        "texto": "node.className",
        "es_correcta": 0
      },
      {
        "id": 554,
        "letra": "b",
        "orden": 2,
        "texto": "node.classList",
        "es_correcta": 1
      },
      {
        "id": 555,
        "letra": "c",
        "orden": 3,
        "texto": "node.style",
        "es_correcta": 0
      },
      {
        "id": 556,
        "letra": "d",
        "orden": 4,
        "texto": "node.cssProperties",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 140,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué evento ocurre cuando el DOM inicial HTML es cargado y parseado completamente?",
    "justificacion": "`DOMContentLoaded` se dispara cuando el HTML terminó de parsearse y el árbol está armado, sin esperar imágenes ni hojas de estilo. `window.onload`, la (a), espera además a que todos esos recursos carguen, así que llega bastante después: es el par que hay que saber distinguir. `document.onready` no existe en JavaScript nativo — es de jQuery, `$(document).ready()` —, y `HTMLParsedEvent` no existe en ninguna parte.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 557,
        "letra": "a",
        "orden": 1,
        "texto": "window.onload",
        "es_correcta": 0
      },
      {
        "id": 558,
        "letra": "b",
        "orden": 2,
        "texto": "document.onready",
        "es_correcta": 0
      },
      {
        "id": 559,
        "letra": "c",
        "orden": 3,
        "texto": "DOMContentLoaded",
        "es_correcta": 1
      },
      {
        "id": 560,
        "letra": "d",
        "orden": 4,
        "texto": "HTMLParsedEvent",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 141,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué método altera dinámicamente el contenido de texto de un nodo omitiendo etiquetas HTML?",
    "justificacion": "`textContent` trata lo que se le da como texto plano, así que las etiquetas se ven tal cual en vez de interpretarse. `innerHTML` sí las interpreta, y por eso es la (a) y es la puerta de entrada de los ataques XSS cuando el texto viene de fuera. En este proyecto esa distinción no es teórica: el banco de preguntas es contenido de origen externo y todo lo que se pinta con `innerHTML` pasa antes por una función de escapado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 561,
        "letra": "a",
        "orden": 1,
        "texto": "innerHTML",
        "es_correcta": 0
      },
      {
        "id": 562,
        "letra": "b",
        "orden": 2,
        "texto": "outerHTML",
        "es_correcta": 0
      },
      {
        "id": 563,
        "letra": "c",
        "orden": 3,
        "texto": "textContent",
        "es_correcta": 1
      },
      {
        "id": 564,
        "letra": "d",
        "orden": 4,
        "texto": "value",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 142,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Por qué JavaScript es considerado un lenguaje de un único hilo (single-threaded) por diseño?",
    "justificacion": "JavaScript tiene un solo call stack, así que ejecuta una instrucción a la vez y nada corre en paralelo dentro de él. Lo que da la impresión de simultaneidad es que las operaciones lentas —red, temporizadores— las atiende el entorno por fuera y devuelve sus callbacks a una cola, que es de lo que se ocupa el bucle de eventos. Las otras tres describen limitaciones inventadas: sí hay ciclos, sí hay varios archivos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 565,
        "letra": "a",
        "orden": 1,
        "texto": "Porque solo tiene un call stack para procesar instrucciones.",
        "es_correcta": 1
      },
      {
        "id": 566,
        "letra": "b",
        "orden": 2,
        "texto": "Porque no permite ejecutar ciclos repetitivos continuos.",
        "es_correcta": 0
      },
      {
        "id": 567,
        "letra": "c",
        "orden": 3,
        "texto": "Porque compila su código en una sola pasada.",
        "es_correcta": 0
      },
      {
        "id": 568,
        "letra": "d",
        "orden": 4,
        "texto": "Porque restringe la ejecución a un único archivo fuente.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 143,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En el contexto del Event Loop, ¿qué componente encola los callbacks de operaciones asíncronas?",
    "justificacion": "La cola de callbacks es donde esperan los callbacks de las operaciones asíncronas ya terminadas, hasta que el call stack se vacía y el bucle de eventos los pasa a ejecutar. Las otras dos piezas de la lista son reales y tienen otro oficio: el call stack ejecuta, y el montículo guarda los objetos. Conviene saber que las promesas usan una cola aparte y con prioridad, la de microtareas, que se vacía antes que ésta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 569,
        "letra": "a",
        "orden": 1,
        "texto": "El Call Stack (pila de llamadas).",
        "es_correcta": 0
      },
      {
        "id": 570,
        "letra": "b",
        "orden": 2,
        "texto": "El Memory Heap (montículo).",
        "es_correcta": 0
      },
      {
        "id": 571,
        "letra": "c",
        "orden": 3,
        "texto": "La Callback Queue (cola de tareas).",
        "es_correcta": 1
      },
      {
        "id": 572,
        "letra": "d",
        "orden": 4,
        "texto": "El motor de renderizado CSS.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 144,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué estados fundamentales posee una Promesa en JavaScript durante su ciclo de vida lógico?",
    "justificacion": "Una promesa está `pending` mientras la operación no termina, y de ahí pasa a `fulfilled` si salió bien o a `rejected` si falló. Ese paso ocurre **una sola vez** y es definitivo: una promesa resuelta no vuelve atrás ni cambia de valor. Se oye además la palabra `settled`, que no es un cuarto estado sino el nombre de «ya no está pendiente», o sea cumplida o rechazada.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 573,
        "letra": "a",
        "orden": 1,
        "texto": "Started, Processing, Finished.",
        "es_correcta": 0
      },
      {
        "id": 574,
        "letra": "b",
        "orden": 2,
        "texto": "Pending, Fulfilled, Rejected.",
        "es_correcta": 1
      },
      {
        "id": 575,
        "letra": "c",
        "orden": 3,
        "texto": "Awaiting, Resolved, Catching.",
        "es_correcta": 0
      },
      {
        "id": 576,
        "letra": "d",
        "orden": 4,
        "texto": "Null, Truthy, Falsy.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 145,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué método de una Promesa se ejecuta siempre, sin importar si fue resuelta o rechazada?",
    "justificacion": "`.finally()` corre pase lo que pase, y sirve para lo que hay que hacer en los dos casos: cerrar una conexión, quitar un indicador de carga. No recibe el valor ni el error, justamente porque no sabe cuál de los dos ocurrió. `.then()` atiende el éxito, `.catch()` el fallo, y `.all()` ni siquiera es un método de la instancia sino de `Promise`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 577,
        "letra": "a",
        "orden": 1,
        "texto": ".then()",
        "es_correcta": 0
      },
      {
        "id": 578,
        "letra": "b",
        "orden": 2,
        "texto": ".catch()",
        "es_correcta": 0
      },
      {
        "id": 579,
        "letra": "c",
        "orden": 3,
        "texto": ".finally()",
        "es_correcta": 1
      },
      {
        "id": 580,
        "letra": "d",
        "orden": 4,
        "texto": ".all()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 146,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Al encadenar bloques `.then()`, ¿qué debe retornar el bloque actual para pasarlo al siguiente?",
    "justificacion": "Lo que devuelve un `.then()` se convierte en el valor que recibe el siguiente. Si devuelve un valor corriente, se pasa tal cual; si devuelve una promesa, la cadena **espera** a que se resuelva y pasa su resultado. Esa segunda regla es la que permite encadenar operaciones asíncronas en vertical en vez de anidarlas. Y hay una trampa muy común: si el bloque no devuelve nada, el siguiente recibe `undefined`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 581,
        "letra": "a",
        "orden": 1,
        "texto": "Obligatoriamente una nueva Promesa.",
        "es_correcta": 0
      },
      {
        "id": 582,
        "letra": "b",
        "orden": 2,
        "texto": "Un valor procesado o una nueva Promesa.",
        "es_correcta": 1
      },
      {
        "id": 583,
        "letra": "c",
        "orden": 3,
        "texto": "El mismo evento capturado.",
        "es_correcta": 0
      },
      {
        "id": 584,
        "letra": "d",
        "orden": 4,
        "texto": "Una función callback anidada.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 147,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Si usas la palabra clave `await` dentro de una función, ¿qué requisito debe tener esa función?",
    "justificacion": "`await` solo se puede usar dentro de una función declarada `async`; fuera de ella es un error de sintaxis. La (c) suena razonable y es falsa: el `try/catch` es recomendable para atrapar el fallo, pero no es requisito para que `await` funcione. Conviene saber que desde ES2022 los módulos admiten `await` en el nivel superior, sin función que lo envuelva — pero solo en módulos, y la pregunta habla de una función.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 585,
        "letra": "a",
        "orden": 1,
        "texto": "Estar declarada como `async`.",
        "es_correcta": 1
      },
      {
        "id": 586,
        "letra": "b",
        "orden": 2,
        "texto": "Ser un método estático de una clase.",
        "es_correcta": 0
      },
      {
        "id": 587,
        "letra": "c",
        "orden": 3,
        "texto": "Estar dentro de un bloque try-catch estructural.",
        "es_correcta": 0
      },
      {
        "id": 588,
        "letra": "d",
        "orden": 4,
        "texto": "Retornar estrictamente un valor primitivo booleano.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 148,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué bloque atrapa correctamente una Promesa rechazada dentro de una función `async`?",
    "justificacion": "Dentro de una función `async`, un `await` sobre una promesa rechazada lanza como si fuera una excepción corriente, así que se atrapa con `try/catch`. Ésa es la forma idiomática y la razón de ser de la sintaxis: el manejo de errores del código asíncrono vuelve a ser el de siempre. Conviene saber que el `.catch()` encadenado tampoco es un error —`await promesa.catch(...)` recoge el rechazo igual—, pero mezcla los dos estilos en la misma línea y se lee peor. Las otras dos alternativas sí son falsas: un `if(error) throw` no atrapa nada, y `window.onerror` no ve los rechazos de promesas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 589,
        "letra": "a",
        "orden": 1,
        "texto": "Un bloque .catch() encadenado.",
        "es_correcta": 0
      },
      {
        "id": 590,
        "letra": "b",
        "orden": 2,
        "texto": "Una estructura try / catch estándar.",
        "es_correcta": 1
      },
      {
        "id": 591,
        "letra": "c",
        "orden": 3,
        "texto": "Una declaración if(error) throw.",
        "es_correcta": 0
      },
      {
        "id": 592,
        "letra": "d",
        "orden": 4,
        "texto": "El objeto global window.onerror.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 149,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué método procesa un array de Promesas y falla si al menos una de las Promesas es rechazada?",
    "justificacion": "`Promise.all()` espera a que todas se cumplan y falla en cuanto una se rechaza, descartando el resto de los resultados. Es lo que se quiere cuando todas las piezas son necesarias. Las otras tres existen y tienen otra política: `race()` devuelve la primera que se resuelva o rechace, `any()` la primera que se **cumpla** ignorando los rechazos, y `allSettled()` espera a todas y no falla nunca — informa qué pasó con cada una.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 593,
        "letra": "a",
        "orden": 1,
        "texto": "Promise.race()",
        "es_correcta": 0
      },
      {
        "id": 594,
        "letra": "b",
        "orden": 2,
        "texto": "Promise.allSettled()",
        "es_correcta": 0
      },
      {
        "id": 595,
        "letra": "c",
        "orden": 3,
        "texto": "Promise.any()",
        "es_correcta": 0
      },
      {
        "id": 596,
        "letra": "d",
        "orden": 4,
        "texto": "Promise.all()",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 150,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué retorna intrínsecamente cualquier función que ha sido declarada con el prefijo `async`?",
    "justificacion": "Una función `async` devuelve siempre una promesa, aunque su `return` sea un número. Si devuelve un valor corriente, la promesa se cumple con ese valor; si lanza, se rechaza con el error. De ahí se sigue algo que conviene tener claro: llamarla sin `await` no da el valor, da la promesa. Y no bloquea el hilo principal — eso es justo lo que `async/await` viene a evitar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 597,
        "letra": "a",
        "orden": 1,
        "texto": "El valor evaluado final, pero bloqueando el proceso principal.",
        "es_correcta": 0
      },
      {
        "id": 598,
        "letra": "b",
        "orden": 2,
        "texto": "Una nueva función generadora asíncrona.",
        "es_correcta": 0
      },
      {
        "id": 599,
        "letra": "c",
        "orden": 3,
        "texto": "Siempre retorna una Promesa implícita resolviendo su valor.",
        "es_correcta": 1
      },
      {
        "id": 600,
        "letra": "d",
        "orden": 4,
        "texto": "El tipo de dato devuelto por la sentencia return.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 151,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En la API XHR (XMLHttpRequest), ¿qué estado numérico del `readyState` indica éxito completo?",
    "justificacion": "`readyState` recorre los valores 0 a 4, y el 4 —`DONE`— es el único que indica que el intercambio terminó. Ahora bien, **terminar no es lo mismo que salir bien**, y ésa es la distinción que hay que llevarse: una respuesta 404 o 500 llega igual con `readyState` 4. Para saber si hubo éxito se mira aparte `xhr.status`, comprobando que esté entre 200 y 299. El patrón completo es comprobar las dos cosas: primero que `readyState` sea 4, y recién entonces qué dice `status`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 601,
        "letra": "a",
        "orden": 1,
        "texto": "1 (Opened)",
        "es_correcta": 0
      },
      {
        "id": 602,
        "letra": "b",
        "orden": 2,
        "texto": "2 (Headers_Received)",
        "es_correcta": 0
      },
      {
        "id": 603,
        "letra": "c",
        "orden": 3,
        "texto": "3 (Loading)",
        "es_correcta": 0
      },
      {
        "id": 604,
        "letra": "d",
        "orden": 4,
        "texto": "4 (Done)",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 152,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Al realizar una petición con XHR, ¿qué evento detecta cambios en el estado de la comunicación?",
    "justificacion": "`onreadystatechange` es el manejador que XHR llama cada vez que cambia su `readyState`, y dentro de él se comprueba si ya llegó al 4. `onstatechange` no existe. `onloadend` y `onprogress` sí existen en la API moderna de XHR y por eso son buenos distractores, pero la pregunta apunta al mecanismo clásico, que es el que se ve en el material del examen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 605,
        "letra": "a",
        "orden": 1,
        "texto": "onstatechange",
        "es_correcta": 0
      },
      {
        "id": 606,
        "letra": "b",
        "orden": 2,
        "texto": "onreadystatechange",
        "es_correcta": 1
      },
      {
        "id": 607,
        "letra": "c",
        "orden": 3,
        "texto": "onloadend",
        "es_correcta": 0
      },
      {
        "id": 608,
        "letra": "d",
        "orden": 4,
        "texto": "onprogress",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 153,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué código de estado HTTP 2xx devuelve habitualmente una API REST al responder con éxito?",
    "justificacion": "Los tres son códigos 2xx y una API REST usa cada uno según lo que hizo: `200 OK` para una lectura o una operación con cuerpo de respuesta, `201 Created` cuando se creó un recurso, y `204 No Content` cuando la operación salió bien y no hay nada que devolver — típico de un borrado. La respuesta es «todos», y lo que la pregunta evalúa es saber que el éxito no es un solo código.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 609,
        "letra": "a",
        "orden": 1,
        "texto": "200 OK",
        "es_correcta": 0
      },
      {
        "id": 610,
        "letra": "b",
        "orden": 2,
        "texto": "201 Created",
        "es_correcta": 0
      },
      {
        "id": 611,
        "letra": "c",
        "orden": 3,
        "texto": "204 No Content",
        "es_correcta": 0
      },
      {
        "id": 612,
        "letra": "d",
        "orden": 4,
        "texto": "Todos los anteriores según la acción.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 154,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En contraposición a XHR, ¿qué estructura retorna por defecto el método `fetch()` en JavaScript?",
    "justificacion": "`fetch()` devuelve una promesa, y ésa es su diferencia de fondo con XHR: se encadena con `.then()` o se espera con `await` en vez de registrar manejadores. Conviene recordar que hacen falta **dos** pasos asíncronos para llegar al dato: uno para la respuesta y otro para leer su cuerpo con `.json()`, que también devuelve una promesa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 613,
        "letra": "a",
        "orden": 1,
        "texto": "Un objeto XMLHttpRequest instanciado.",
        "es_correcta": 0
      },
      {
        "id": 614,
        "letra": "b",
        "orden": 2,
        "texto": "Una Promesa (Promise).",
        "es_correcta": 1
      },
      {
        "id": 615,
        "letra": "c",
        "orden": 3,
        "texto": "Un callback asíncrono puro.",
        "es_correcta": 0
      },
      {
        "id": 616,
        "letra": "d",
        "orden": 4,
        "texto": "Un stream de datos binarios bloqueantes.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 155,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Al usar `fetch()`, ¿qué método extrae el cuerpo de la respuesta asíncrona a un objeto JS?",
    "justificacion": "`response.json()` lee el cuerpo de la respuesta y lo convierte en un objeto de JavaScript. Devuelve una promesa, así que hay que esperarla: es el segundo `await` del patrón. Sus hermanos son `text()`, `blob()` y `formData()`, según lo que venga. Y el cuerpo se puede leer **una sola vez**: intentarlo dos veces sobre la misma respuesta falla.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 617,
        "letra": "a",
        "orden": 1,
        "texto": "response.toJSON()",
        "es_correcta": 0
      },
      {
        "id": 618,
        "letra": "b",
        "orden": 2,
        "texto": "response.parse()",
        "es_correcta": 0
      },
      {
        "id": 619,
        "letra": "c",
        "orden": 3,
        "texto": "response.json()",
        "es_correcta": 1
      },
      {
        "id": 620,
        "letra": "d",
        "orden": 4,
        "texto": "response.objectify()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 156,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué propiedad del objeto `Response` en `fetch()` indica si la solicitud HTTP fue un éxito (2xx)?",
    "justificacion": "`response.ok` es `true` cuando el código está entre 200 y 299. Es la comprobación que hay que hacer siempre, porque `fetch` **no rechaza la promesa ante un error HTTP**: un 404 llega como respuesta cumplida con `ok` en falso. Las otras tres no existen, salvo `statusText`, que es un texto descriptivo y no un booleano.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 621,
        "letra": "a",
        "orden": 1,
        "texto": "response.ok",
        "es_correcta": 1
      },
      {
        "id": 622,
        "letra": "b",
        "orden": 2,
        "texto": "response.success",
        "es_correcta": 0
      },
      {
        "id": 623,
        "letra": "c",
        "orden": 3,
        "texto": "response.valid",
        "es_correcta": 0
      },
      {
        "id": 624,
        "letra": "d",
        "orden": 4,
        "texto": "response.statusText",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 157,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Para enviar datos POST mediante `fetch()`, ¿en qué parámetro incluyes el payload JSON?",
    "justificacion": "El cuerpo de la petición va en `body`, y si son datos JSON hay que serializarlos antes con `JSON.stringify()`: `body` recibe texto, no un objeto. Junto a él van `method: 'POST'` y la cabecera `Content-Type`. `headers` lleva las cabeceras, `mode` controla el comportamiento respecto de CORS, y `params` no es una opción de `fetch`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 625,
        "letra": "a",
        "orden": 1,
        "texto": "headers",
        "es_correcta": 0
      },
      {
        "id": 626,
        "letra": "b",
        "orden": 2,
        "texto": "mode",
        "es_correcta": 0
      },
      {
        "id": 627,
        "letra": "c",
        "orden": 3,
        "texto": "body",
        "es_correcta": 1
      },
      {
        "id": 628,
        "letra": "d",
        "orden": 4,
        "texto": "params",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 158,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué cabecera HTTP (header) debes enviar para avisarle a la API que envías formato JSON?",
    "justificacion": "`Content-Type: application/json` describe **lo que se está enviando**, y es lo que permite al servidor interpretar el cuerpo. Se confunde con `Accept`, la (a), que dice lo que se espera **recibir**: son direcciones opuestas y a veces se mandan las dos. Enviar JSON sin esa cabecera es una de las causas más frecuentes de que una API responda con un error de formato.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 629,
        "letra": "a",
        "orden": 1,
        "texto": "Accept: application/json",
        "es_correcta": 0
      },
      {
        "id": 630,
        "letra": "b",
        "orden": 2,
        "texto": "Content-Type: application/json",
        "es_correcta": 1
      },
      {
        "id": 631,
        "letra": "c",
        "orden": 3,
        "texto": "Authorization: Bearer JSON",
        "es_correcta": 0
      },
      {
        "id": 632,
        "letra": "d",
        "orden": 4,
        "texto": "Data-Type: json",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 159,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué riesgo de seguridad ocurre al consumir APIs ajenas sin validación de origen permitida?",
    "justificacion": "Lo que ocurre es que el navegador **bloquea la respuesta** si el servidor ajeno no autoriza tu origen con sus cabeceras CORS. Conviene entender bien de qué lado está esto: CORS no es un ataque ni un agujero, es el navegador protegiendo al usuario, y por eso no se «desactiva» desde el código del cliente — se resuelve en el servidor que responde. Las otras tres nombran riesgos reales que no son éste.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 633,
        "letra": "a",
        "orden": 1,
        "texto": "Ataques de Inyección SQL locales.",
        "es_correcta": 0
      },
      {
        "id": 634,
        "letra": "b",
        "orden": 2,
        "texto": "Fallas de XSS mutando el DOM.",
        "es_correcta": 0
      },
      {
        "id": 635,
        "letra": "c",
        "orden": 3,
        "texto": "Bloqueo CORS por políticas del mismo origen.",
        "es_correcta": 1
      },
      {
        "id": 636,
        "letra": "d",
        "orden": 4,
        "texto": "Sobrecarga de memoria del Event Loop.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 160,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Cómo implementa internamente JavaScript la herencia entre objetos sin usar la sintaxis de clases de ES6?",
    "justificacion": "JavaScript hereda por prototipos: cada objeto guarda un enlace a otro, y las propiedades que no encuentra en sí mismo las busca subiendo por esa cadena. Las clases de ES6 no cambiaron el mecanismo, solo le dieron una sintaxis familiar. Las otras tres describen técnicas que no son la herencia del lenguaje: copiar propiedades es composición, clonar con JSON produce objetos sueltos sin cadena, y no hay clases abstractas nativas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 637,
        "letra": "a",
        "orden": 1,
        "texto": "Copiando propiedades estáticas al instanciar.",
        "es_correcta": 0
      },
      {
        "id": 638,
        "letra": "b",
        "orden": 2,
        "texto": "Mediante la cadena de prototipos (prototype chain).",
        "es_correcta": 1
      },
      {
        "id": 639,
        "letra": "c",
        "orden": 3,
        "texto": "A través de la clonación profunda de JSON.",
        "es_correcta": 0
      },
      {
        "id": 640,
        "letra": "d",
        "orden": 4,
        "texto": "Utilizando clases abstractas nativas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 161,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En formato JSON válido, ¿cuál es la regla estricta para escribir los nombres de las claves (keys)?",
    "justificacion": "Las claves de JSON van siempre entre comillas **dobles**. Las simples no valen —son legales en JavaScript pero no en JSON— y omitirlas tampoco, aunque la clave no tenga espacios. Es la regla que más se rompe al escribir JSON a mano, y el error que devuelve `JSON.parse()` suele señalar una posición y no la causa, así que conviene reconocerla de memoria.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 641,
        "letra": "a",
        "orden": 1,
        "texto": "Pueden ir sin comillas si no contienen espacios.",
        "es_correcta": 0
      },
      {
        "id": 642,
        "letra": "b",
        "orden": 2,
        "texto": "Deben usar comillas simples exclusivamente.",
        "es_correcta": 0
      },
      {
        "id": 643,
        "letra": "c",
        "orden": 3,
        "texto": "Deben escribirse obligatoriamente con comillas dobles.",
        "es_correcta": 1
      },
      {
        "id": 644,
        "letra": "d",
        "orden": 4,
        "texto": "Requieren notación de corchetes en cada atributo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 162,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué pilar de la POO permite que objetos de distintas clases respondan a una misma invocación de método?",
    "justificacion": "El polimorfismo es que objetos de clases distintas respondan al mismo mensaje, cada uno a su manera: llamar a `area()` sobre un círculo y sobre un cuadrado y que cada uno haga su cálculo. El encapsulamiento esconde el estado, la abstracción esconde el cómo, y la herencia múltiple no existe en JavaScript. En un lenguaje dinámico como éste el polimorfismo sale casi solo: basta con que el método exista.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 645,
        "letra": "a",
        "orden": 1,
        "texto": "Encapsulamiento",
        "es_correcta": 0
      },
      {
        "id": 646,
        "letra": "b",
        "orden": 2,
        "texto": "Herencia múltiple",
        "es_correcta": 0
      },
      {
        "id": 647,
        "letra": "c",
        "orden": 3,
        "texto": "Polimorfismo",
        "es_correcta": 1
      },
      {
        "id": 648,
        "letra": "d",
        "orden": 4,
        "texto": "Abstracción estructural",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 163,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué ocurre si declaramos una variable con let e intentamos acceder a ella antes de su inicialización?",
    "justificacion": "Lanza un `ReferenceError`. La variable **sí** se eleva, pero queda en la zona muerta temporal —la Temporal Dead Zone— desde el inicio del bloque hasta su declaración, y tocarla ahí es un error. Es la diferencia práctica con `var`, que en esa situación devuelve `undefined` y deja pasar el problema. La (d) describe justamente el comportamiento de `var`, y por eso es el distractor que separa al que entiende el hoisting del que lo recita.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 649,
        "letra": "a",
        "orden": 1,
        "texto": "Retorna undefined por defecto.",
        "es_correcta": 0
      },
      {
        "id": 650,
        "letra": "b",
        "orden": 2,
        "texto": "Lanza un ReferenceError por la Temporal Dead Zone.",
        "es_correcta": 1
      },
      {
        "id": 651,
        "letra": "c",
        "orden": 3,
        "texto": "Asigna valor nulo hasta su primer uso en código.",
        "es_correcta": 0
      },
      {
        "id": 652,
        "letra": "d",
        "orden": 4,
        "texto": "Se eleva (hoisting) permitiendo su lectura temprana.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 164,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué diferencia principal tiene una función flecha (arrow function) frente a una función tradicional?",
    "justificacion": "Una función flecha no tiene `this` propio: toma el del lugar donde está escrita. De ahí sale su uso más común —callbacks que necesitan el `this` de fuera— y también su límite: no sirven como métodos cuando se espera que `this` sea el objeto. Tampoco tienen `arguments` propio ni se pueden usar con `new`. Las otras tres son inventadas: no devuelven JSON, no obligan a `function` y no limitan los parámetros.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 653,
        "letra": "a",
        "orden": 1,
        "texto": "Las funciones flecha no tienen su propio contexto 'this'.",
        "es_correcta": 1
      },
      {
        "id": 654,
        "letra": "b",
        "orden": 2,
        "texto": "Retornan siempre un objeto JSON estructurado.",
        "es_correcta": 0
      },
      {
        "id": 655,
        "letra": "c",
        "orden": 3,
        "texto": "Obligan el uso de la palabra reservada 'function'.",
        "es_correcta": 0
      },
      {
        "id": 656,
        "letra": "d",
        "orden": 4,
        "texto": "Solo pueden recibir un máximo de tres parámetros.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 165,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "En módulos ES6, ¿qué sintaxis permite exportar múltiples funciones nombradas desde un mismo archivo?",
    "justificacion": "`export { func1, func2 };` exporta varias funciones nombradas, y quien las importe tiene que usar llaves y los mismos nombres. La (a) exporta un objeto por defecto, que es otra cosa y se importa distinto; la (b) es CommonJS; y la (d) confunde exportar con importar. También se puede poner `export` delante de cada declaración, que produce el mismo resultado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 657,
        "letra": "a",
        "orden": 1,
        "texto": "export default { func1, func2 };",
        "es_correcta": 0
      },
      {
        "id": 658,
        "letra": "b",
        "orden": 2,
        "texto": "module.exports = [func1, func2];",
        "es_correcta": 0
      },
      {
        "id": 659,
        "letra": "c",
        "orden": 3,
        "texto": "export { func1, func2 };",
        "es_correcta": 1
      },
      {
        "id": 660,
        "letra": "d",
        "orden": 4,
        "texto": "require(func1, func2);",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 166,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué fase del flujo de eventos del DOM ocurre propagándose desde el elemento objetivo hacia la raíz?",
    "justificacion": "El burbujeo es la vuelta: el evento sube desde el elemento objetivo hacia la raíz, y por eso un manejador puesto en un contenedor se entera de los clics de sus hijos. Es lo contrario de la captura, que baja, y es la fase en la que `addEventListener` escucha por omisión. La fase de destino es el instante en el elemento mismo, y «delegación» no es una fase sino una técnica que se apoya en el burbujeo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 661,
        "letra": "a",
        "orden": 1,
        "texto": "Fase de captura (Capturing phase).",
        "es_correcta": 0
      },
      {
        "id": 662,
        "letra": "b",
        "orden": 2,
        "texto": "Fase de destino (Target phase).",
        "es_correcta": 0
      },
      {
        "id": 663,
        "letra": "c",
        "orden": 3,
        "texto": "Fase de delegación (Delegation phase).",
        "es_correcta": 0
      },
      {
        "id": 664,
        "letra": "d",
        "orden": 4,
        "texto": "Fase de burbujeo (Bubbling phase).",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 167,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué método detiene el comportamiento por defecto de un evento, como el refresco al enviar un formulario?",
    "justificacion": "`preventDefault()` cancela lo que el navegador haría por su cuenta: enviar el formulario, seguir el enlace, marcar la casilla. No detiene la propagación — para eso está `stopPropagation()`, que es la (a) y el par con el que se confunde. `stopImmediatePropagation()` es más fuerte todavía: además de cortar la propagación, impide que corran los otros manejadores del mismo elemento.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 665,
        "letra": "a",
        "orden": 1,
        "texto": "event.stopPropagation()",
        "es_correcta": 0
      },
      {
        "id": 666,
        "letra": "b",
        "orden": 2,
        "texto": "event.preventDefault()",
        "es_correcta": 1
      },
      {
        "id": 667,
        "letra": "c",
        "orden": 3,
        "texto": "event.stopImmediatePropagation()",
        "es_correcta": 0
      },
      {
        "id": 668,
        "letra": "d",
        "orden": 4,
        "texto": "event.cancelEvent()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 168,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Cuál es la estrategia más óptima para añadir eventos a múltiples elementos hijos generados dinámicamente?",
    "justificacion": "La delegación de eventos: un solo manejador en el contenedor padre, que se entera de los clics de sus hijos gracias al burbujeo y decide con `event.target` cuál fue. Funciona con elementos creados **después** de registrar el manejador, que es justo lo que la pregunta plantea y lo que la (a) no resuelve — habría que registrar uno por cada elemento nuevo, y nadie se acuerda siempre.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 669,
        "letra": "a",
        "orden": 1,
        "texto": "Asignar un evento individual a cada elemento creado.",
        "es_correcta": 0
      },
      {
        "id": 670,
        "letra": "b",
        "orden": 2,
        "texto": "Utilizar delegación de eventos en un contenedor padre.",
        "es_correcta": 1
      },
      {
        "id": 671,
        "letra": "c",
        "orden": 3,
        "texto": "Reemplazar el DOM completo con innerHTML en cada clic.",
        "es_correcta": 0
      },
      {
        "id": 672,
        "letra": "d",
        "orden": 4,
        "texto": "Invocar addEventListener dentro de un ciclo infinito.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 169,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué problema estructural del código resuelve principalmente el uso de Promesas frente a Callbacks clásicos?",
    "justificacion": "Las promesas aplanan lo que los callbacks anidaban. Con callbacks, cada operación que depende de la anterior agrega un nivel de indentación hasta volver el código ilegible; con promesas, la cadena de `.then()` se lee en vertical, y con `async/await` se lee casi como código síncrono. No resuelven el consumo de memoria ni el bloqueo del hilo: el hilo no se bloqueaba tampoco con callbacks.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 673,
        "letra": "a",
        "orden": 1,
        "texto": "El consumo excesivo de memoria RAM del navegador.",
        "es_correcta": 0
      },
      {
        "id": 674,
        "letra": "b",
        "orden": 2,
        "texto": "El \"Callback Hell\" o anidamiento excesivo de código.",
        "es_correcta": 1
      },
      {
        "id": 675,
        "letra": "c",
        "orden": 3,
        "texto": "El bloqueo del hilo principal (Main Thread).",
        "es_correcta": 0
      },
      {
        "id": 676,
        "letra": "d",
        "orden": 4,
        "texto": "La imposibilidad de ejecutar instrucciones sincrónicas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 170,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿En qué estado interno queda una Promesa que ha completado su operación asíncrona con éxito?",
    "justificacion": "`Fulfilled` es el estado de una promesa que terminó bien. `Pending` es mientras espera y `Rejected` es cuando falló. `Settled` es el mejor distractor de los cuatro porque **sí es un término real**, pero no es un estado: es el nombre que agrupa a las dos formas de terminar, cumplida o rechazada. Saber que existe y que no es un estado es exactamente lo que la pregunta separa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 677,
        "letra": "a",
        "orden": 1,
        "texto": "Pending",
        "es_correcta": 0
      },
      {
        "id": 678,
        "letra": "b",
        "orden": 2,
        "texto": "Fulfilled",
        "es_correcta": 1
      },
      {
        "id": 679,
        "letra": "c",
        "orden": 3,
        "texto": "Rejected",
        "es_correcta": 0
      },
      {
        "id": 680,
        "letra": "d",
        "orden": 4,
        "texto": "Settled",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 171,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué estructura de control es necesaria para capturar errores de ejecución utilizando async/await?",
    "justificacion": "Con `async/await` los errores se atrapan con `try/catch`, igual que en código síncrono: un `await` sobre una promesa rechazada lanza, y el `catch` lo recoge. Ésa es la ventaja de la sintaxis — que el manejo de errores vuelve a ser el de siempre, sin encadenar nada. El `.catch()` encadenado también funcionaría, pero pertenece al estilo de las cadenas de promesas y mezclarlo con `await` en la misma línea hace el código más difícil de leer. Las otras dos no sirven: ni un `if/else` ni un `switch` ven una excepción que se está lanzando.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 681,
        "letra": "a",
        "orden": 1,
        "texto": "Bloques if/else anidados exhaustivos.",
        "es_correcta": 0
      },
      {
        "id": 682,
        "letra": "b",
        "orden": 2,
        "texto": "Condicionales switch/case por código de error.",
        "es_correcta": 0
      },
      {
        "id": 683,
        "letra": "c",
        "orden": 3,
        "texto": "El bloque try/catch en la función asíncrona.",
        "es_correcta": 1
      },
      {
        "id": 684,
        "letra": "d",
        "orden": 4,
        "texto": "El método callback .catch() encadenado.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 172,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "A diferencia de XHR, ¿qué tipo de objeto nativo retorna por defecto la API Fetch al ser ejecutada?",
    "justificacion": "`fetch()` devuelve una promesa, mientras que XHR devuelve un objeto sobre el que se registran manejadores. Ésa es la diferencia de forma que la pregunta busca. Ojo con la (b), que es el error más común de todos: `fetch` **no** devuelve el JSON ya interpretado — devuelve una respuesta, y sacar el objeto de dentro es un segundo paso asíncrono con `.json()`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 685,
        "letra": "a",
        "orden": 1,
        "texto": "Un objeto literal XMLHttpRequest.",
        "es_correcta": 0
      },
      {
        "id": 686,
        "letra": "b",
        "orden": 2,
        "texto": "Un objeto JSON parseado automáticamente.",
        "es_correcta": 0
      },
      {
        "id": 687,
        "letra": "c",
        "orden": 3,
        "texto": "Una Promesa (Promise).",
        "es_correcta": 1
      },
      {
        "id": 688,
        "letra": "d",
        "orden": 4,
        "texto": "Una función Callback de respuesta.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 173,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "Usando Fetch, ¿qué estado asume la promesa si el servidor responde con un error HTTP 404 (Not Found)?",
    "justificacion": "La promesa **se cumple**. `fetch` solo se rechaza si la petición no se pudo hacer —sin red, DNS caído, CORS—; un 404 o un 500 son respuestas válidas del servidor y llegan como promesa cumplida con `response.ok` en falso. Es la trampa más importante de la API, porque un `try/catch` alrededor de un `fetch` **no** atrapa un 404: hay que comprobar `ok` a mano y lanzar si hace falta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 689,
        "letra": "a",
        "orden": 1,
        "texto": "Se rechaza inmediatamente (Rejected).",
        "es_correcta": 0
      },
      {
        "id": 690,
        "letra": "b",
        "orden": 2,
        "texto": "Lanza una excepción de red nativa bloqueante.",
        "es_correcta": 0
      },
      {
        "id": 691,
        "letra": "c",
        "orden": 3,
        "texto": "Se resuelve (Fulfilled) pero su propiedad ok es falsa.",
        "es_correcta": 1
      },
      {
        "id": 692,
        "letra": "d",
        "orden": 4,
        "texto": "Queda en estado Pending hasta recibir un código 200.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 174,
    "modulo": 4,
    "modulo_titulo": "Programacion Avanzada en JavaScript",
    "modulo_icono": "bolt",
    "enunciado": "¿Qué objeto nativo del navegador permite cancelar explícitamente una petición Fetch que está en progreso?",
    "justificacion": "`AbortController` permite cancelar una petición en curso: se crea uno, se le pasa su `signal` a `fetch`, y al llamar a `abort()` la promesa se rechaza. Sirve para descartar una búsqueda que el usuario ya cambió, o para poner un tiempo límite. La (b) es el método equivalente de XHR y por eso es buen distractor, pero no funciona con `fetch`; `EventTarget` y `Promise.reject()` no cancelan nada.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 693,
        "letra": "a",
        "orden": 1,
        "texto": "AbortController",
        "es_correcta": 1
      },
      {
        "id": 694,
        "letra": "b",
        "orden": 2,
        "texto": "XMLHttpRequest.abort()",
        "es_correcta": 0
      },
      {
        "id": 695,
        "letra": "c",
        "orden": 3,
        "texto": "EventTarget",
        "es_correcta": 0
      },
      {
        "id": 696,
        "letra": "d",
        "orden": 4,
        "texto": "Promise.reject()",
        "es_correcta": 0
      }
    ]
  }
];
