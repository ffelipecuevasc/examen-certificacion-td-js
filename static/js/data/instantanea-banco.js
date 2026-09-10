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
  "generada_en": "2026-09-10T18:41:22.766Z",
  "preguntas": 368,
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
  },
  {
    "id": 175,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué característica fundamental distingue a un RDBMS de un sistema NoSQL documental?",
    "justificacion": "Un motor relacional garantiza ACID —atomicidad, consistencia, aislamiento y durabilidad— como parte de su contrato, y eso es lo que lo distingue del enfoque documental clásico, que nació sacrificando esas garantías a cambio de flexibilidad y escala. Las otras tres describen rasgos del lado NoSQL: el esquema flexible, el almacenamiento en grafos y la ausencia de SQL. Conviene saber que la frontera se ha ido borrando —varios motores documentales ofrecen hoy transacciones ACID—, pero la distinción sigue siendo la que el examen evalúa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 697,
        "letra": "a",
        "orden": 1,
        "texto": "Estructura flexible de esquemas dinámicos.",
        "es_correcta": 0
      },
      {
        "id": 698,
        "letra": "b",
        "orden": 2,
        "texto": "Garantía estricta de propiedades ACID.",
        "es_correcta": 1
      },
      {
        "id": 699,
        "letra": "c",
        "orden": 3,
        "texto": "Almacenamiento basado en grafos dirigidos.",
        "es_correcta": 0
      },
      {
        "id": 700,
        "letra": "d",
        "orden": 4,
        "texto": "Ausencia de lenguaje estructurado de consultas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 176,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Cuál es el rol principal del motor relacional en la arquitectura de un RDBMS?",
    "justificacion": "El motor relacional recibe una consulta declarativa —qué se quiere, no cómo obtenerlo—, decide el plan de ejecución y lo ejecuta: qué índice usar, en qué orden cruzar las tablas, cuándo filtrar. Ahí es donde se gana o se pierde el rendimiento. Las otras tres describen oficios de otras piezas: no compila a binarios, no dibuja interfaces, y los respaldos son una tarea aparte.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 701,
        "letra": "a",
        "orden": 1,
        "texto": "Compilar el código SQL en binarios ejecutables nativos.",
        "es_correcta": 0
      },
      {
        "id": 702,
        "letra": "b",
        "orden": 2,
        "texto": "Gestionar la interfaz gráfica de usuario final.",
        "es_correcta": 0
      },
      {
        "id": 703,
        "letra": "c",
        "orden": 3,
        "texto": "Optimizar y ejecutar los planes de consulta sobre los datos.",
        "es_correcta": 1
      },
      {
        "id": 704,
        "letra": "d",
        "orden": 4,
        "texto": "Exportar automáticamente backups en formato JSON.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 177,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué protocolo se utiliza comúnmente para establecer la conexión a un motor RDBMS?",
    "justificacion": "La conexión a un motor relacional viaja por TCP/IP cuando el cliente está en otra máquina, o por un socket local cuando está en la misma. Encima de ese transporte va el protocolo propio del motor, que no es HTTP. Las otras tres son protocolos reales de otros oficios: SMTP y POP3 mueven correo, FTP y SFTP mueven archivos, y REST es un estilo para APIs web, no para hablar con una base.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 705,
        "letra": "a",
        "orden": 1,
        "texto": "HTTP/REST puro",
        "es_correcta": 0
      },
      {
        "id": 706,
        "letra": "b",
        "orden": 2,
        "texto": "TCP/IP o Sockets locales",
        "es_correcta": 1
      },
      {
        "id": 707,
        "letra": "c",
        "orden": 3,
        "texto": "Protocolo SMTP/POP3",
        "es_correcta": 0
      },
      {
        "id": 708,
        "letra": "d",
        "orden": 4,
        "texto": "Transferencia FTP/SFTP",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 178,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En el contexto de un RDBMS, ¿qué es un \"catálogo de sistema\"?",
    "justificacion": "El catálogo de sistema son tablas que describen la propia base: qué tablas hay, qué columnas, de qué tipo, qué restricciones e índices. Es la base hablando de sí misma, y por eso se puede consultar con SQL corriente. En PostgreSQL vive en `information_schema` y en `pg_catalog`. No es un manual, ni un índice, ni una vista de logs.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 709,
        "letra": "a",
        "orden": 1,
        "texto": "Una vista materializada con los logs de transacciones.",
        "es_correcta": 0
      },
      {
        "id": 710,
        "letra": "b",
        "orden": 2,
        "texto": "Un conjunto de tablas que almacena metadatos de la base.",
        "es_correcta": 1
      },
      {
        "id": 711,
        "letra": "c",
        "orden": 3,
        "texto": "El manual de usuario integrado en la consola SQL.",
        "es_correcta": 0
      },
      {
        "id": 712,
        "letra": "d",
        "orden": 4,
        "texto": "El índice primario de la tabla principal de la base de datos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 179,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "Si cruzas dos tablas con LEFT JOIN, ¿qué sucede con los registros huérfanos de la tabla izquierda?",
    "justificacion": "`LEFT JOIN` conserva **todas** las filas de la tabla izquierda, tengan pareja o no; las que no la tienen aparecen igual y las columnas de la derecha se rellenan con `NULL`. Ésa es justamente la diferencia con `INNER JOIN`, que las descartaría. De ahí sale un uso muy común: `LEFT JOIN` más `WHERE derecha.id IS NULL` es la forma de encontrar los huérfanos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 713,
        "letra": "a",
        "orden": 1,
        "texto": "Se omiten del resultado final.",
        "es_correcta": 0
      },
      {
        "id": 714,
        "letra": "b",
        "orden": 2,
        "texto": "Se incluyen y los campos derechos se rellenan con NULL.",
        "es_correcta": 1
      },
      {
        "id": 715,
        "letra": "c",
        "orden": 3,
        "texto": "Generan un error crítico de integridad referencial.",
        "es_correcta": 0
      },
      {
        "id": 716,
        "letra": "d",
        "orden": 4,
        "texto": "Se rellenan con el valor por defecto de cada columna.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 180,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Cuál es el propósito principal de utilizar una subconsulta correlacionada?",
    "justificacion": "Una subconsulta correlacionada menciona una columna de la consulta externa, así que no se puede resolver sola: se evalúa una vez por cada fila de la principal. Eso la hace potente y también cara. La (a) describe la subconsulta **no** correlacionada, que se calcula una sola vez y es el par con el que se contrasta. Cuando el costo pesa, muchas se pueden reescribir como un `JOIN`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 717,
        "letra": "a",
        "orden": 1,
        "texto": "Evaluar independientemente la subconsulta una sola vez.",
        "es_correcta": 0
      },
      {
        "id": 718,
        "letra": "b",
        "orden": 2,
        "texto": "Ejecutar la subconsulta por cada fila de la consulta principal.",
        "es_correcta": 1
      },
      {
        "id": 719,
        "letra": "c",
        "orden": 3,
        "texto": "Bloquear la tabla principal hasta terminar la subconsulta.",
        "es_correcta": 0
      },
      {
        "id": 720,
        "letra": "d",
        "orden": 4,
        "texto": "Combinar resultados usando operadores de conjunto (UNION).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 181,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué tipo de JOIN retorna únicamente los registros que tienen coincidencias en ambas tablas?",
    "justificacion": "`INNER JOIN` devuelve solo las filas con coincidencia en las dos tablas. Las otras tres existen y hacen otra cosa: `FULL OUTER JOIN` trae todo de ambos lados rellenando con `NULL`, `RIGHT OUTER JOIN` conserva todo el lado derecho, y `CROSS JOIN` combina cada fila con cada fila sin condición. Es el join por omisión: escribir solo `JOIN` significa `INNER JOIN`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 721,
        "letra": "a",
        "orden": 1,
        "texto": "FULL OUTER JOIN",
        "es_correcta": 0
      },
      {
        "id": 722,
        "letra": "b",
        "orden": 2,
        "texto": "CROSS JOIN NATURAL",
        "es_correcta": 0
      },
      {
        "id": 723,
        "letra": "c",
        "orden": 3,
        "texto": "INNER JOIN",
        "es_correcta": 1
      },
      {
        "id": 724,
        "letra": "d",
        "orden": 4,
        "texto": "RIGHT OUTER JOIN",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 182,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En una consulta SELECT, ¿cuál es el orden lógico interno de evaluación del motor SQL?",
    "justificacion": "El orden lógico es `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT` —y `ORDER BY` al final—, que no es el orden en que se escribe. Entenderlo explica dos cosas que se preguntan siempre: por qué `WHERE` no puede filtrar por una función agregada, porque el agrupamiento todavía no ocurrió, y por qué en muchos motores no se puede usar en `WHERE` un alias definido en el `SELECT`, que se evalúa después.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 725,
        "letra": "a",
        "orden": 1,
        "texto": "SELECT, FROM, WHERE, GROUP BY, HAVING",
        "es_correcta": 0
      },
      {
        "id": 726,
        "letra": "b",
        "orden": 2,
        "texto": "FROM, WHERE, GROUP BY, HAVING, SELECT",
        "es_correcta": 1
      },
      {
        "id": 727,
        "letra": "c",
        "orden": 3,
        "texto": "WHERE, FROM, GROUP BY, SELECT, HAVING",
        "es_correcta": 0
      },
      {
        "id": 728,
        "letra": "d",
        "orden": 4,
        "texto": "SELECT, WHERE, HAVING, GROUP BY, FROM",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 183,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué operador SQL permite evaluar si un valor específico está dentro del resultado de una subconsulta?",
    "justificacion": "`IN` comprueba si un valor está entre los que devuelve la subconsulta: `WHERE id IN (SELECT ...)`. `EXISTS` es el distractor fuerte porque también se usa con subconsultas, pero pregunta otra cosa —si la subconsulta devuelve **alguna** fila, sin mirar qué valor—. `BETWEEN` compara contra un rango y `LIKE` contra un patrón de texto; ninguno de los dos toma un conjunto de resultados.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 729,
        "letra": "a",
        "orden": 1,
        "texto": "BETWEEN",
        "es_correcta": 0
      },
      {
        "id": 730,
        "letra": "b",
        "orden": 2,
        "texto": "EXISTS",
        "es_correcta": 0
      },
      {
        "id": 731,
        "letra": "c",
        "orden": 3,
        "texto": "IN",
        "es_correcta": 1
      },
      {
        "id": 732,
        "letra": "d",
        "orden": 4,
        "texto": "LIKE",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 184,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "Si usas GROUP BY, ¿qué restricción impone el estándar SQL sobre las columnas del SELECT?",
    "justificacion": "Toda columna del `SELECT` tiene que estar en el `GROUP BY` o venir envuelta en una función agregada como `COUNT`, `SUM` o `MAX`. El motivo es que el resultado tiene una fila por grupo, y una columna que no cumple eso tendría varios valores posibles y ninguna regla para elegir. Las otras tres inventan límites que no existen: ni el tipo, ni la cantidad de columnas, ni los alias están restringidos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 733,
        "letra": "a",
        "orden": 1,
        "texto": "Todas deben ser columnas de tipo numérico exclusivamente.",
        "es_correcta": 0
      },
      {
        "id": 734,
        "letra": "b",
        "orden": 2,
        "texto": "Deben estar en el GROUP BY o dentro de una función agregada.",
        "es_correcta": 1
      },
      {
        "id": 735,
        "letra": "c",
        "orden": 3,
        "texto": "Solo puede haber un máximo de 3 columnas seleccionadas.",
        "es_correcta": 0
      },
      {
        "id": 736,
        "letra": "d",
        "orden": 4,
        "texto": "No se pueden utilizar alias lógicos en el resultado.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 185,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué operador lógico utilizarías para buscar patrones de texto específicos ignorando mayúsculas?",
    "justificacion": "En PostgreSQL, `ILIKE` compara patrones ignorando mayúsculas; el equivalente portátil es forzar los dos lados con `UPPER()` o `LOWER()`. `LIKE` a secas sí distingue mayúsculas de minúsculas, y ésa es la diferencia que la pregunta busca. Los otros tres nombres no existen en SQL. Ojo con una consecuencia práctica: envolver la columna en `UPPER()` suele impedir que el motor use el índice.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 737,
        "letra": "a",
        "orden": 1,
        "texto": "EQUALS IGNORE",
        "es_correcta": 0
      },
      {
        "id": 738,
        "letra": "b",
        "orden": 2,
        "texto": "ILIKE o combinaciones con UPPER/LOWER",
        "es_correcta": 1
      },
      {
        "id": 739,
        "letra": "c",
        "orden": 3,
        "texto": "MATCH TEXT EXACT",
        "es_correcta": 0
      },
      {
        "id": 740,
        "letra": "d",
        "orden": 4,
        "texto": "REGEXP_ONLY",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 186,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué sentencia DML permite insertar filas directamente a partir de una consulta a otra tabla?",
    "justificacion": "`INSERT INTO destino SELECT ... FROM origen` inserta en una tabla **que ya existe** las filas que devuelve la consulta. La (b), `CREATE TABLE ... AS`, también copia datos pero crea la tabla en el mismo acto, así que responde a otra necesidad. `MERGE` existe en varios motores y sirve para insertar o actualizar según haya coincidencia; `UPDATE ... FROM` actualiza, no inserta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 741,
        "letra": "a",
        "orden": 1,
        "texto": "INSERT INTO ... SELECT",
        "es_correcta": 1
      },
      {
        "id": 742,
        "letra": "b",
        "orden": 2,
        "texto": "CREATE TABLE ... AS",
        "es_correcta": 0
      },
      {
        "id": 743,
        "letra": "c",
        "orden": 3,
        "texto": "UPDATE ... FROM",
        "es_correcta": 0
      },
      {
        "id": 744,
        "letra": "d",
        "orden": 4,
        "texto": "MERGE INTO ... SELECT",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 187,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "Al ejecutar un DELETE sin cláusula WHERE, ¿qué impacto ocurre internamente en la base de datos?",
    "justificacion": "`DELETE` sin `WHERE` borra todas las filas, pero las borra **una a una y dejando registro de cada una** en el log de transacciones, de modo que la operación se puede deshacer con `ROLLBACK`. Por eso es lenta en tablas grandes y por eso existe `TRUNCATE`, que es el contraste directo. No borra la tabla —eso es `DROP`— ni reinicia los identificadores, y ningún motor la bloquea por seguridad.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 745,
        "letra": "a",
        "orden": 1,
        "texto": "Se elimina la estructura completa y definitiva de la tabla.",
        "es_correcta": 0
      },
      {
        "id": 746,
        "letra": "b",
        "orden": 2,
        "texto": "Se truncan los datos reseteando los identificadores.",
        "es_correcta": 0
      },
      {
        "id": 747,
        "letra": "c",
        "orden": 3,
        "texto": "Se eliminan todos los registros fila a fila (logueado).",
        "es_correcta": 1
      },
      {
        "id": 748,
        "letra": "d",
        "orden": 4,
        "texto": "El motor bloquea la operación masiva por seguridad.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 188,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué función principal asume una \"secuencia\" en el proceso de inserción de datos?",
    "justificacion": "Una secuencia es un generador de números que entrega valores distintos a cada llamada, pensado para alimentar claves primarias sin que dos sesiones simultáneas obtengan el mismo. En PostgreSQL es lo que hay detrás de `SERIAL` y de las columnas `GENERATED ... AS IDENTITY`. Conviene saber que sus valores no se devuelven al deshacer una transacción: un `ROLLBACK` deja huecos en la numeración, y eso es correcto.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 749,
        "letra": "a",
        "orden": 1,
        "texto": "Ordenar los registros insertados cronológicamente al disco.",
        "es_correcta": 0
      },
      {
        "id": 750,
        "letra": "b",
        "orden": 2,
        "texto": "Generar valores únicos secuenciales para claves primarias.",
        "es_correcta": 1
      },
      {
        "id": 751,
        "letra": "c",
        "orden": 3,
        "texto": "Encriptar contraseñas automáticamente antes de guardarlas.",
        "es_correcta": 0
      },
      {
        "id": 752,
        "letra": "d",
        "orden": 4,
        "texto": "Agrupar inserciones masivas en bloques asíncronos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 189,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué sucede si una sentencia UPDATE viola una restricción de llave foránea (integridad referencial)?",
    "justificacion": "La sentencia falla entera y no se aplica ninguna de sus modificaciones: una restricción de integridad referencial no es una advertencia, es una condición. Las otras tres describen comportamientos que ningún motor tiene: no rellena con `NULL` por su cuenta, no pide confirmación, y desde luego no desactiva la restricción para poder seguir. Si la sentencia iba dentro de una transacción, ésta queda para deshacer.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 753,
        "letra": "a",
        "orden": 1,
        "texto": "La fila infractora se actualiza forzosamente con NULL.",
        "es_correcta": 0
      },
      {
        "id": 754,
        "letra": "b",
        "orden": 2,
        "texto": "El motor suspende la ejecución y pide confirmación manual.",
        "es_correcta": 0
      },
      {
        "id": 755,
        "letra": "c",
        "orden": 3,
        "texto": "La sentencia DML falla y se rechazan las modificaciones.",
        "es_correcta": 1
      },
      {
        "id": 756,
        "letra": "d",
        "orden": 4,
        "texto": "El sistema desactiva temporalmente la llave foránea impuesta.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 190,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué propiedad ACID garantiza que una transacción fallida no deje registros parciales guardados?",
    "justificacion": "La atomicidad es el todo o nada: una transacción se aplica entera o no deja rastro, así que un fallo a mitad no puede dejar registros parciales. Las otras tres son propiedades reales de ACID con otro oficio: la consistencia mantiene válidas las reglas de la base, el aislamiento evita que las transacciones simultáneas se estorben, y la durabilidad garantiza que lo confirmado sobreviva a una caída.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 757,
        "letra": "a",
        "orden": 1,
        "texto": "Aislamiento (Isolation).",
        "es_correcta": 0
      },
      {
        "id": 758,
        "letra": "b",
        "orden": 2,
        "texto": "Durabilidad (Durability).",
        "es_correcta": 0
      },
      {
        "id": 759,
        "letra": "c",
        "orden": 3,
        "texto": "Consistencia (Consistency).",
        "es_correcta": 0
      },
      {
        "id": 760,
        "letra": "d",
        "orden": 4,
        "texto": "Atomicidad (Atomicity).",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 191,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué comando asegura la persistencia permanente de los datos tras un bloque de sentencias DML?",
    "justificacion": "`COMMIT` cierra la transacción y hace permanentes sus cambios; hasta ese momento nada de lo hecho es definitivo y un `ROLLBACK` lo desharía. Las otras tres existen y ninguna confirma nada. `SAVEPOINT` marca un punto intermedio al que se puede volver **dentro** de la transacción, sin cerrarla. `CHECKPOINT` es el distractor que separa: fuerza la escritura a disco de los buffers pendientes, así que suena a «persistencia permanente», pero no tiene nada que ver con confirmar una transacción — la durabilidad de lo confirmado la garantiza el registro de transacciones desde el `COMMIT`, sin esperar a ningún volcado. `FLUSH PRIVILEGES` es de MySQL y recarga permisos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 761,
        "letra": "a",
        "orden": 1,
        "texto": "SAVEPOINT",
        "es_correcta": 0
      },
      {
        "id": 762,
        "letra": "b",
        "orden": 2,
        "texto": "COMMIT",
        "es_correcta": 1
      },
      {
        "id": 763,
        "letra": "c",
        "orden": 3,
        "texto": "CHECKPOINT",
        "es_correcta": 0
      },
      {
        "id": 764,
        "letra": "d",
        "orden": 4,
        "texto": "FLUSH PRIVILEGES",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 192,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué problema de concurrencia grave evita el máximo nivel de aislamiento (Serializable)?",
    "justificacion": "El nivel `SERIALIZABLE` es el más alto y evita los tres fenómenos clásicos: lecturas sucias —ver cambios no confirmados—, lecturas no repetibles —leer dos veces y obtener distinto— y lecturas fantasma —que aparezcan filas nuevas entre dos lecturas—. El precio es menos concurrencia, porque el motor tiene que serializar el acceso. Los niveles más bajos van permitiendo uno u otro a cambio de velocidad.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 765,
        "letra": "a",
        "orden": 1,
        "texto": "Lecturas sucias, lecturas no repetibles y lecturas fantasma.",
        "es_correcta": 1
      },
      {
        "id": 766,
        "letra": "b",
        "orden": 2,
        "texto": "Exclusivamente el problema de lecturas sucias aisladas.",
        "es_correcta": 0
      },
      {
        "id": 767,
        "letra": "c",
        "orden": 3,
        "texto": "Únicamente la sobreescritura de datos mediante deadlocks.",
        "es_correcta": 0
      },
      {
        "id": 768,
        "letra": "d",
        "orden": 4,
        "texto": "Ninguno, permite alta concurrencia asíncrona incondicional.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 193,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué efecto tiene el modo AUTOCOMMIT si se encuentra activado por defecto en la consola SQL?",
    "justificacion": "Con AUTOCOMMIT activo, cada sentencia que termina bien se confirma sola, como si llevara su propio `COMMIT` detrás. La consecuencia práctica es la que importa: **ya no hay nada que deshacer**, porque no queda transacción abierta. Por eso, para agrupar varias sentencias en una unidad, hay que abrir la transacción explícitamente con `BEGIN`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 769,
        "letra": "a",
        "orden": 1,
        "texto": "Inicia un backup automático tras cada actualización masiva.",
        "es_correcta": 0
      },
      {
        "id": 770,
        "letra": "b",
        "orden": 2,
        "texto": "Agrupa automáticamente todas las consultas del mismo usuario.",
        "es_correcta": 0
      },
      {
        "id": 771,
        "letra": "c",
        "orden": 3,
        "texto": "Confirma inmediatamente cada sentencia DML que sea exitosa.",
        "es_correcta": 1
      },
      {
        "id": 772,
        "letra": "d",
        "orden": 4,
        "texto": "Efectúa un rollback tras 30 segundos de inactividad de red.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 194,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "Si ejecutas ROLLBACK tras haber modificado 1000 filas sin hacer COMMIT, ¿qué pasa?",
    "justificacion": "Se deshacen las 1000. `ROLLBACK` devuelve la base al estado en que estaba al empezar la transacción, sin límite de filas y sin distinguir entre inserciones, actualizaciones y borrados. Eso es la atomicidad en acción. Las otras tres inventan límites que no existen: ni un tope de 500, ni un modo de recuperación, ni un trato distinto según el tipo de sentencia.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 773,
        "letra": "a",
        "orden": 1,
        "texto": "Se revierten solo las últimas 500 modificaciones por límite.",
        "es_correcta": 0
      },
      {
        "id": 774,
        "letra": "b",
        "orden": 2,
        "texto": "Las 1000 modificaciones se deshacen, dejando datos previos.",
        "es_correcta": 1
      },
      {
        "id": 775,
        "letra": "c",
        "orden": 3,
        "texto": "La base de datos queda bloqueada en modo recuperación.",
        "es_correcta": 0
      },
      {
        "id": 776,
        "letra": "d",
        "orden": 4,
        "texto": "Solo se deshacen inserciones, dejando las actualizaciones.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 195,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué comando DDL vacía los datos de una tabla sin registrar cada fila en el log de transacciones?",
    "justificacion": "`TRUNCATE TABLE` vacía la tabla de una vez, sin escribir una entrada por fila en el log, y por eso es mucho más rápido que `DELETE` en tablas grandes. Conserva la estructura: la tabla sigue existiendo, vacía. Los otros tres comandos no existen. Conviene saber que suele reiniciar las secuencias asociadas si se le pide `RESTART IDENTITY`, cosa que `DELETE` nunca hace.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 777,
        "letra": "a",
        "orden": 1,
        "texto": "DELETE ALL ROWS",
        "es_correcta": 0
      },
      {
        "id": 778,
        "letra": "b",
        "orden": 2,
        "texto": "DROP DATA",
        "es_correcta": 0
      },
      {
        "id": 779,
        "letra": "c",
        "orden": 3,
        "texto": "FORMAT TABLE",
        "es_correcta": 0
      },
      {
        "id": 780,
        "letra": "d",
        "orden": 4,
        "texto": "TRUNCATE TABLE",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 196,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En la creación de tablas, ¿qué restricción impide tajantemente ingresar valores repetidos?",
    "justificacion": "`PRIMARY KEY` y `UNIQUE` son las que impiden valores repetidos; la diferencia entre ambas es que la primaria además no admite nulos y solo puede haber una por tabla. `NOT NULL` obliga a que haya un valor pero no a que sea distinto; `CHECK` valida una condición sobre el valor; y `FOREIGN KEY` exige que el valor exista en otra tabla, que es lo contrario de impedir repeticiones.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 781,
        "letra": "a",
        "orden": 1,
        "texto": "CONSTRAINT NOT NULL",
        "es_correcta": 0
      },
      {
        "id": 782,
        "letra": "b",
        "orden": 2,
        "texto": "PRIMARY KEY o UNIQUE",
        "es_correcta": 1
      },
      {
        "id": 783,
        "letra": "c",
        "orden": 3,
        "texto": "CONSTRAINT CHECK",
        "es_correcta": 0
      },
      {
        "id": 784,
        "letra": "d",
        "orden": 4,
        "texto": "CONSTRAINT FOREIGN KEY",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 197,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué instrucción DDL se utiliza convencionalmente para modificar el tipo de dato de una columna?",
    "justificacion": "La forma estándar es `ALTER TABLE tabla ALTER COLUMN columna TYPE nuevo_tipo`, y es la que usa PostgreSQL. Las otras tres no existen: `UPDATE` cambia datos y no estructura, que es la confusión que la (b) busca provocar. Ojo con algo que se pregunta poco y duele mucho: cambiar el tipo de una columna con datos dentro puede fallar si alguno no se puede convertir.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 785,
        "letra": "a",
        "orden": 1,
        "texto": "ALTER TABLE ... ALTER COLUMN",
        "es_correcta": 1
      },
      {
        "id": 786,
        "letra": "b",
        "orden": 2,
        "texto": "UPDATE TABLE ... SET COLUMN",
        "es_correcta": 0
      },
      {
        "id": 787,
        "letra": "c",
        "orden": 3,
        "texto": "MODIFY STRUCTURE ... COLUMN",
        "es_correcta": 0
      },
      {
        "id": 788,
        "letra": "d",
        "orden": 4,
        "texto": "CHANGE DATA TYPE ... ON TABLE",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 198,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué diferencia técnica crítica existe entre el comando DROP TABLE y TRUNCATE TABLE?",
    "justificacion": "`DROP TABLE` borra la tabla entera —datos, estructura, índices y metadatos—, y después de ejecutarlo la tabla ya no existe. `TRUNCATE TABLE` borra solo las filas y deja la tabla vacía y lista para recibir datos. La (d) invierte la clasificación: los dos son DDL, no uno de cada tipo. Y ninguno admite `WHERE`: para borrar con condición está `DELETE`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 789,
        "letra": "a",
        "orden": 1,
        "texto": "Ninguna, ambos comandos realizan la misma acción destructiva.",
        "es_correcta": 0
      },
      {
        "id": 790,
        "letra": "b",
        "orden": 2,
        "texto": "DROP requiere un filtro WHERE, TRUNCATE borra sin condición.",
        "es_correcta": 0
      },
      {
        "id": 791,
        "letra": "c",
        "orden": 3,
        "texto": "DROP elimina estructura y metadatos, TRUNCATE solo datos.",
        "es_correcta": 1
      },
      {
        "id": 792,
        "letra": "d",
        "orden": 4,
        "texto": "TRUNCATE es un comando DML, mientras que DROP es puro DDL.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 199,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "Al agregar una restricción NOT NULL a una columna ya existente, ¿qué precondición debe cumplirse?",
    "justificacion": "La columna no puede tener ningún `NULL` en las filas existentes: la restricción se valida contra los datos que ya están, y si alguno la incumple, la sentencia falla. La salida habitual es llenar esos huecos primero con un `UPDATE` y recién después agregar la restricción. Las otras tres inventan requisitos que no existen: ni ser llave foránea, ni estar indexada, ni el estado de los registros importan.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 793,
        "letra": "a",
        "orden": 1,
        "texto": "La columna debe haber sido definida como llave foránea.",
        "es_correcta": 0
      },
      {
        "id": 794,
        "letra": "b",
        "orden": 2,
        "texto": "La tabla no debe contener registros nulos en dicha columna.",
        "es_correcta": 1
      },
      {
        "id": 795,
        "letra": "c",
        "orden": 3,
        "texto": "Todos los registros de la tabla deben estar inactivos.",
        "es_correcta": 0
      },
      {
        "id": 796,
        "letra": "d",
        "orden": 4,
        "texto": "La columna debe estar indexada como llave primaria antes.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 200,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué palabra reservada se emplea para asignar un valor fijo automático si este se omite al insertar?",
    "justificacion": "`DEFAULT` fija el valor que toma la columna cuando la inserción no la menciona. Se declara al crear la tabla y evita tener que repetir el mismo valor en cada `INSERT`. Los otros tres nombres no existen. Conviene distinguirlo de `NOT NULL`: `DEFAULT` da un valor cuando falta, `NOT NULL` prohíbe que falte; juntos garantizan que la columna siempre tenga algo con sentido.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 797,
        "letra": "a",
        "orden": 1,
        "texto": "AUTO_INSERT",
        "es_correcta": 0
      },
      {
        "id": 798,
        "letra": "b",
        "orden": 2,
        "texto": "FALLBACK_VAL",
        "es_correcta": 0
      },
      {
        "id": 799,
        "letra": "c",
        "orden": 3,
        "texto": "DEFAULT",
        "es_correcta": 1
      },
      {
        "id": 800,
        "letra": "d",
        "orden": 4,
        "texto": "INITIAL_DATA",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 201,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En el modelo conceptual, ¿cómo se representa idealmente la capacidad de abstracción de un problema?",
    "justificacion": "El modelo conceptual se dibuja como un diagrama Entidad-Relación: entidades, sus atributos, las relaciones entre ellas y las cardinalidades. Es deliberadamente independiente del motor y hasta de si al final se usará una base relacional. Las otras tres saltan a la implementación —clases, DDL, XML—, que es justo lo que el modelo conceptual evita para poder discutirse con quien no programa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 801,
        "letra": "a",
        "orden": 1,
        "texto": "Mediante código encapsulado de clases y métodos de Java.",
        "es_correcta": 0
      },
      {
        "id": 802,
        "letra": "b",
        "orden": 2,
        "texto": "Mediante un diagrama Entidad-Relación y sus cardinalidades.",
        "es_correcta": 1
      },
      {
        "id": 803,
        "letra": "c",
        "orden": 3,
        "texto": "Como un script de creación masiva de tablas DDL nativo.",
        "es_correcta": 0
      },
      {
        "id": 804,
        "letra": "d",
        "orden": 4,
        "texto": "A través de documentación en crudo en formato XML puro.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 202,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué característica define esencialmente a una \"Entidad Fuerte\" en el modelamiento conceptual?",
    "justificacion": "Una entidad fuerte existe por sí sola y se identifica con sus propios atributos, sin depender de otra. Su contraste es la entidad débil, que es la (b) y que necesita de una entidad dueña para existir e identificarse. Las otras dos describen cosas que no definen la fuerza de una entidad: ni los atributos compuestos ni las llaves foráneas tienen que ver con eso.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 805,
        "letra": "a",
        "orden": 1,
        "texto": "Posee obligatoriamente atributos de tipo matriz anidada.",
        "es_correcta": 0
      },
      {
        "id": 806,
        "letra": "b",
        "orden": 2,
        "texto": "Su existencia es dependiente de otra entidad principal.",
        "es_correcta": 0
      },
      {
        "id": 807,
        "letra": "c",
        "orden": 3,
        "texto": "Tiene existencia propia e identificador único independiente.",
        "es_correcta": 1
      },
      {
        "id": 808,
        "letra": "d",
        "orden": 4,
        "texto": "Se vincula de forma exclusiva mediante llaves foráneas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 203,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Cómo se resuelve una relación \"Muchos a Muchos\" (N:M) al transformar al modelo relacional?",
    "justificacion": "Una relación N:M no se puede representar con una llave foránea en ninguno de los dos lados, porque cada fila admitiría un solo valor. Se resuelve creando una **tabla intermedia** cuyas filas son los pares, con las llaves foráneas de las dos entidades formando su clave. Además de resolver el problema, esa tabla es el sitio natural para los atributos que pertenecen a la relación y no a las entidades.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 809,
        "letra": "a",
        "orden": 1,
        "texto": "Insertando una clave foránea en la tabla más pequeña del modelo.",
        "es_correcta": 0
      },
      {
        "id": 810,
        "letra": "b",
        "orden": 2,
        "texto": "Creando una entidad intermedia que contenga ambas llaves.",
        "es_correcta": 1
      },
      {
        "id": 811,
        "letra": "c",
        "orden": 3,
        "texto": "Almacenando los datos múltiples en un formato de texto largo.",
        "es_correcta": 0
      },
      {
        "id": 812,
        "letra": "d",
        "orden": 4,
        "texto": "Fusionando ambas entidades fuertes en una sola gran tabla unida.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 204,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué condición principal exige la Primera Forma Normal (1FN) al aplicarla en una tabla relacional?",
    "justificacion": "La Primera Forma Normal pide que cada celda contenga un valor **atómico**: nada de listas, ni campos con varios datos separados por comas, ni grupos repetidos de columnas como `telefono1`, `telefono2`. Es la condición que hace posibles las demás: sin valores atómicos no se puede hablar de dependencias funcionales. La (b) describe justamente lo que la Tercera Forma Normal viene a eliminar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 813,
        "letra": "a",
        "orden": 1,
        "texto": "La ausencia absoluta de claves foráneas hacia otras tablas.",
        "es_correcta": 0
      },
      {
        "id": 814,
        "letra": "b",
        "orden": 2,
        "texto": "La dependencia transitiva de todos los atributos descriptivos.",
        "es_correcta": 0
      },
      {
        "id": 815,
        "letra": "c",
        "orden": 3,
        "texto": "Que cada columna contenga valores atómicos (indivisibles).",
        "es_correcta": 1
      },
      {
        "id": 816,
        "letra": "d",
        "orden": 4,
        "texto": "La existencia estricta de al menos dos llaves candidatas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 205,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué tipo de dependencia se busca erradicar para alcanzar la Tercera Forma Normal (3FN)?",
    "justificacion": "La Tercera Forma Normal elimina las **dependencias transitivas**: un atributo no clave que depende de otro atributo no clave en vez de depender de la clave. El caso de manual es guardar `codigo_ciudad` y `nombre_ciudad` en la tabla de personas — el nombre depende del código, no de la persona, y por eso se repite y se puede contradecir. La (a) describe lo que resuelve la Segunda Forma Normal.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 817,
        "letra": "a",
        "orden": 1,
        "texto": "La dependencia funcional parcial respecto a llaves compuestas.",
        "es_correcta": 0
      },
      {
        "id": 818,
        "letra": "b",
        "orden": 2,
        "texto": "Dependencias transitivas lógicas entre atributos no clave.",
        "es_correcta": 1
      },
      {
        "id": 819,
        "letra": "c",
        "orden": 3,
        "texto": "Las asociaciones lógicas circulares entre entidades débiles.",
        "es_correcta": 0
      },
      {
        "id": 820,
        "letra": "d",
        "orden": 4,
        "texto": "Los atributos heredados a partir de funciones trigonométricas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 206,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué concepto representa fundamentalmente la cardinalidad en un modelo Entidad-Relación (MER)?",
    "justificacion": "La cardinalidad dice cuántas ocurrencias de una entidad pueden vincularse con una de la otra: uno a uno, uno a muchos, muchos a muchos. Es lo que decide cómo se traduce la relación al modelo relacional — dónde va la llave foránea, o si hace falta una tabla intermedia. No tiene nada que ver con el tamaño en bytes, ni con tipos de dato, ni con el número de columnas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 821,
        "letra": "a",
        "orden": 1,
        "texto": "El límite máximo de ocupación en bytes de cada registro guardado.",
        "es_correcta": 0
      },
      {
        "id": 822,
        "letra": "b",
        "orden": 2,
        "texto": "El número de ocurrencias lógicas de una entidad vinculada a otra.",
        "es_correcta": 1
      },
      {
        "id": 823,
        "letra": "c",
        "orden": 3,
        "texto": "El tipo de dato primitivo asociado explícitamente a una llave foránea.",
        "es_correcta": 0
      },
      {
        "id": 824,
        "letra": "d",
        "orden": 4,
        "texto": "La suma total e inflexible de columnas que la tabla puede alojar.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 207,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Por qué razón técnica de arquitectura podría llegar a justificarse una desnormalización de datos?",
    "justificacion": "Se desnormaliza para que ciertas consultas dejen de pagar el costo de muchos `JOIN`, duplicando a propósito datos que la normalización había separado. Es una decisión de rendimiento, tomada a sabiendas y con una contrapartida clara: vuelven las anomalías de actualización y hay que mantener la copia. Por eso se hace después de medir, no por adelantado, y nunca para ahorrar espacio — de hecho ocupa más.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 825,
        "letra": "a",
        "orden": 1,
        "texto": "Para satisfacer los exigentes requisitos de la forma Boyce-Codd.",
        "es_correcta": 0
      },
      {
        "id": 826,
        "letra": "b",
        "orden": 2,
        "texto": "Para reducir el tamaño total de toda la base de datos en el disco.",
        "es_correcta": 0
      },
      {
        "id": 827,
        "letra": "c",
        "orden": 3,
        "texto": "Para optimizar el rendimiento y lectura de consultas muy repetitivas.",
        "es_correcta": 1
      },
      {
        "id": 828,
        "letra": "d",
        "orden": 4,
        "texto": "Para prevenir la inserción maliciosa de valores nulos indeseados.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 208,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué herramienta o documento consolida los metadatos y definiciones del modelo de base de datos?",
    "justificacion": "El diccionario de datos reúne las definiciones formales del modelo: qué tablas hay, qué columnas, de qué tipo, con qué restricciones y qué significa cada una. Es la referencia que permite entender la base sin abrirla. Las otras tres son artefactos reales del motor con otro oficio: el plan de ejecución explica una consulta, el log registra transacciones, y un volcado es una copia.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 829,
        "letra": "a",
        "orden": 1,
        "texto": "El plan de ejecución visual de consultas nativo del motor.",
        "es_correcta": 0
      },
      {
        "id": 830,
        "letra": "b",
        "orden": 2,
        "texto": "El Diccionario de Datos del sistema unificado de información.",
        "es_correcta": 1
      },
      {
        "id": 831,
        "letra": "c",
        "orden": 3,
        "texto": "El log binario transaccional del servidor (archivos pg_xlog).",
        "es_correcta": 0
      },
      {
        "id": 832,
        "letra": "d",
        "orden": 4,
        "texto": "El archivo de volcado y compresión del esquema (database dump).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 209,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "Al transformar una entidad débil al modelo relacional, ¿cómo se compone su llave primaria final?",
    "justificacion": "La clave de una entidad débil se forma **uniendo la clave de la entidad fuerte de la que depende con su propio atributo discriminante**, porque por sí sola no distingue sus ocurrencias. Es lo que traduce al modelo relacional la dependencia de existencia: la fila no puede existir sin su dueña, y el motor lo hace cumplir con la llave foránea que forma parte de esa clave compuesta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 833,
        "letra": "a",
        "orden": 1,
        "texto": "Uniendo la llave de la entidad fuerte de la que depende con su propio ID.",
        "es_correcta": 1
      },
      {
        "id": 834,
        "letra": "b",
        "orden": 2,
        "texto": "Creando y asignando un identificador global único e independiente.",
        "es_correcta": 0
      },
      {
        "id": 835,
        "letra": "c",
        "orden": 3,
        "texto": "Omitiendo usar llaves primarias por diseño de esquema relacional.",
        "es_correcta": 0
      },
      {
        "id": 836,
        "letra": "d",
        "orden": 4,
        "texto": "Replicando exactamente todos los atributos de la entidad dominante.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 210,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Cuál es el objetivo técnico primordial al aplicar el proceso de normalización en una base de datos?",
    "justificacion": "La normalización busca guardar cada dato **una sola vez**, y con eso desaparecen las anomalías de inserción, actualización y borrado — los casos en que cambiar un dato en un sitio y no en otro deja la base contradiciéndose. El precio es más tablas y más `JOIN`, que es exactamente lo que la desnormalización revierte cuando el rendimiento lo justifica. La (a) describe el intercambio al revés.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 837,
        "letra": "a",
        "orden": 1,
        "texto": "Acelerar radicalmente las operaciones DML sacrificando consistencia.",
        "es_correcta": 0
      },
      {
        "id": 838,
        "letra": "b",
        "orden": 2,
        "texto": "Minimizar drásticamente la redundancia y erradicar anomalías de datos.",
        "es_correcta": 1
      },
      {
        "id": 839,
        "letra": "c",
        "orden": 3,
        "texto": "Transformar arquitecturas SQL estrictas en modelos NoSQL de grafos.",
        "es_correcta": 0
      },
      {
        "id": 840,
        "letra": "d",
        "orden": 4,
        "texto": "Borrar lógicamente el uso de FOREIGN KEY para liberar CPU y memoria.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 211,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En el contexto de un modelo relacional estricto, ¿qué concepto matemático fundamenta a las tablas?",
    "justificacion": "El modelo relacional se apoya en la teoría de conjuntos: una tabla **es** una relación matemática, un subconjunto del producto cartesiano de los dominios de sus columnas, y cada fila es una tupla. De ahí viene que el orden de las filas no signifique nada y que las operaciones —unión, intersección, diferencia, producto— tengan definición formal. Es lo que separa a SQL de manipular archivos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 841,
        "letra": "a",
        "orden": 1,
        "texto": "Topologías complejas derivadas de árboles binarios asimétricos.",
        "es_correcta": 0
      },
      {
        "id": 842,
        "letra": "b",
        "orden": 2,
        "texto": "Relaciones lógicas entre conjuntos estructurados y sus dominios.",
        "es_correcta": 1
      },
      {
        "id": 843,
        "letra": "c",
        "orden": 3,
        "texto": "Algoritmos heurísticos de agrupamiento en estructuras difusas.",
        "es_correcta": 0
      },
      {
        "id": 844,
        "letra": "d",
        "orden": 4,
        "texto": "Tensores multidimensionales definidos por matrices ortogonales.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 212,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En el diseño de un modelo conceptual, ¿qué es y qué implica un atributo denominado \"derivado\"?",
    "justificacion": "Un atributo derivado **no se guarda**: su valor se calcula cuando hace falta, a partir de otros que sí están. La edad a partir de la fecha de nacimiento es el ejemplo clásico, y muestra el motivo: guardarla obligaría a actualizarla, y quedaría mal el día que nadie lo hiciera. En el diagrama se dibuja con línea punteada, y al implementar se resuelve con una columna calculada o con una vista.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 845,
        "letra": "a",
        "orden": 1,
        "texto": "Una llave alfanumérica de auditoría impuesta por el motor SQL central.",
        "es_correcta": 0
      },
      {
        "id": 846,
        "letra": "b",
        "orden": 2,
        "texto": "Un dato que no se almacena porque su valor se calcula a partir de otros.",
        "es_correcta": 1
      },
      {
        "id": 847,
        "letra": "c",
        "orden": 3,
        "texto": "Una variable foránea que modifica su origen dependiendo de los accesos.",
        "es_correcta": 0
      },
      {
        "id": 848,
        "letra": "d",
        "orden": 4,
        "texto": "Un registro replicado a partir de una tabla maestra del sistema matriz.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 213,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Cuál es el propósito principal del \"journaling\" o registro de transacciones en un RDBMS?",
    "justificacion": "El registro de transacciones anota lo que se va a cambiar **antes** de cambiarlo, así que tras una caída el motor puede rehacer lo confirmado y deshacer lo que quedó a medias. Es lo que sostiene la **durabilidad** y la atomicidad de ACID, no una optimización de lectura. Las otras tres describen oficios ajenos: la velocidad de lectura la dan los índices, y el cifrado de contraseñas es cosa de la aplicación.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 849,
        "letra": "a",
        "orden": 1,
        "texto": "Optimizar la velocidad de lectura de las tablas indexadas.",
        "es_correcta": 0
      },
      {
        "id": 850,
        "letra": "b",
        "orden": 2,
        "texto": "Evitar la fragmentación del disco duro del servidor web.",
        "es_correcta": 0
      },
      {
        "id": 851,
        "letra": "c",
        "orden": 3,
        "texto": "Garantizar la recuperación ante fallos y la durabilidad.",
        "es_correcta": 1
      },
      {
        "id": 852,
        "letra": "d",
        "orden": 4,
        "texto": "Encriptar automáticamente las contraseñas de los usuarios.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 214,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué tipo de JOIN devuelve todas las filas de la tabla izquierda y las coincidencias de la derecha?",
    "justificacion": "`LEFT OUTER JOIN` —o `LEFT JOIN`, que es lo mismo— conserva todas las filas de la izquierda y agrega las coincidencias de la derecha, rellenando con `NULL` donde no las hay. `RIGHT` hace lo simétrico, `FULL` conserva los dos lados, e `INNER` se queda solo con lo que casa. La palabra `OUTER` es opcional en los tres y no cambia nada: lo que manda es el lado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 853,
        "letra": "a",
        "orden": 1,
        "texto": "INNER JOIN",
        "es_correcta": 0
      },
      {
        "id": 854,
        "letra": "b",
        "orden": 2,
        "texto": "LEFT OUTER JOIN",
        "es_correcta": 1
      },
      {
        "id": 855,
        "letra": "c",
        "orden": 3,
        "texto": "RIGHT OUTER JOIN",
        "es_correcta": 0
      },
      {
        "id": 856,
        "letra": "d",
        "orden": 4,
        "texto": "FULL OUTER JOIN",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 215,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué cláusula SQL permite filtrar los resultados resultantes de una función de agrupación como SUM()?",
    "justificacion": "`HAVING` filtra **después** de agrupar, y por eso puede usar funciones agregadas: `HAVING SUM(total) > 1000`. `WHERE` filtra antes, cuando los grupos todavía no existen, así que ahí un `SUM()` no tiene sentido y el motor lo rechaza. Ésa es toda la diferencia y es de las que más se preguntan. `GROUP FILTER` no existe, y `ORDER BY` ordena, no filtra.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 857,
        "letra": "a",
        "orden": 1,
        "texto": "WHERE",
        "es_correcta": 0
      },
      {
        "id": 858,
        "letra": "b",
        "orden": 2,
        "texto": "ORDER BY",
        "es_correcta": 0
      },
      {
        "id": 859,
        "letra": "c",
        "orden": 3,
        "texto": "HAVING",
        "es_correcta": 1
      },
      {
        "id": 860,
        "letra": "d",
        "orden": 4,
        "texto": "GROUP FILTER",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 216,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué ocurre si omites la condición de unión (ON o WHERE) al realizar una consulta a múltiples tablas?",
    "justificacion": "Sin condición que las una, el motor combina **cada fila de una tabla con cada fila de la otra**: el producto cartesiano. Con dos tablas de mil filas salen un millón, y por eso el síntoma clásico es una consulta que devuelve muchísimo más de lo esperado **sin dar ningún error**, que es lo que la vuelve peligrosa. Conviene saber que esto ocurre con la sintaxis de coma —`FROM a, b`— y que escribir `FROM a JOIN b` sin su `ON` es distinto: ahí el motor sí protesta. Ésa es una razón práctica para preferir siempre la sintaxis explícita con `JOIN ... ON`: convierte un olvido silencioso en un error inmediato.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 861,
        "letra": "a",
        "orden": 1,
        "texto": "La consulta produce un producto cartesiano (Cross Join).",
        "es_correcta": 1
      },
      {
        "id": 862,
        "letra": "b",
        "orden": 2,
        "texto": "El motor asume un INNER JOIN por la clave primaria.",
        "es_correcta": 0
      },
      {
        "id": 863,
        "letra": "c",
        "orden": 3,
        "texto": "La base de datos arroja un error de sintaxis bloqueante.",
        "es_correcta": 0
      },
      {
        "id": 864,
        "letra": "d",
        "orden": 4,
        "texto": "Solo se devuelven las filas de la primera tabla listada.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 217,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En sentencias DML, ¿qué comando deshace los cambios no confirmados de la transacción actual en curso?",
    "justificacion": "`ROLLBACK` descarta todos los cambios de la transacción en curso y deja la base como estaba al empezarla. Es la contraparte de `COMMIT` y lo que hace útil una transacción: poder equivocarse sin consecuencias mientras no se confirme. Los otros tres nombres no existen en SQL. Si hay `SAVEPOINT` declarados, se puede volver a uno de ellos en vez de deshacerlo todo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 865,
        "letra": "a",
        "orden": 1,
        "texto": "UNDO TRANSACTION",
        "es_correcta": 0
      },
      {
        "id": 866,
        "letra": "b",
        "orden": 2,
        "texto": "DROP COMMIT",
        "es_correcta": 0
      },
      {
        "id": 867,
        "letra": "c",
        "orden": 3,
        "texto": "ROLLBACK",
        "es_correcta": 1
      },
      {
        "id": 868,
        "letra": "d",
        "orden": 4,
        "texto": "REVERT STATE",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 218,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué comando DDL se utiliza para eliminar completamente la estructura de una tabla y sus datos?",
    "justificacion": "`DROP TABLE` elimina la tabla completa: sus filas, su estructura, sus índices y sus restricciones. Después de ejecutarlo la tabla no existe y volver a usarla exige crearla de nuevo. `TRUNCATE` deja la tabla vacía pero viva, y `DELETE` borra filas con o sin condición; `DELETE TABLE` y `REMOVE TABLE` no existen. Conviene tener presente que `DROP` de una tabla referenciada por otras puede fallar por las llaves foráneas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 869,
        "letra": "a",
        "orden": 1,
        "texto": "TRUNCATE TABLE",
        "es_correcta": 0
      },
      {
        "id": 870,
        "letra": "b",
        "orden": 2,
        "texto": "DELETE TABLE",
        "es_correcta": 0
      },
      {
        "id": 871,
        "letra": "c",
        "orden": 3,
        "texto": "DROP TABLE",
        "es_correcta": 1
      },
      {
        "id": 872,
        "letra": "d",
        "orden": 4,
        "texto": "REMOVE TABLE",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 219,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué restricción DDL asegura la integridad referencial obligando a que el valor exista en otra tabla?",
    "justificacion": "`FOREIGN KEY` obliga a que el valor exista en la tabla referenciada, y es lo que sostiene la integridad referencial: impide dejar filas apuntando a algo que no está. Las otras tres restringen dentro de la propia tabla — `UNIQUE` prohíbe repetidos, `PRIMARY KEY` identifica, y `CHECK` valida una condición—. Además define qué pasa al borrar o actualizar el original, con `ON DELETE CASCADE` y sus variantes.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 873,
        "letra": "a",
        "orden": 1,
        "texto": "UNIQUE CONSTRAINT",
        "es_correcta": 0
      },
      {
        "id": 874,
        "letra": "b",
        "orden": 2,
        "texto": "PRIMARY KEY",
        "es_correcta": 0
      },
      {
        "id": 875,
        "letra": "c",
        "orden": 3,
        "texto": "FOREIGN KEY",
        "es_correcta": 1
      },
      {
        "id": 876,
        "letra": "d",
        "orden": 4,
        "texto": "CHECK CONSTRAINT",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 220,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "A diferencia de DELETE, ¿por qué la sentencia TRUNCATE TABLE suele ser más rápida y eficiente?",
    "justificacion": "`TRUNCATE` no borra fila por fila: descarta el contenido de la tabla de una vez, sin escribir una entrada por registro en el log de transacciones. Ahí está toda la diferencia de velocidad con `DELETE`. El precio es la contrapartida que hay que conocer: al no quedar registro fila a fila, no se puede deshacer con la misma facilidad, y no dispara los disparadores de borrado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 877,
        "letra": "a",
        "orden": 1,
        "texto": "Porque elimina todo sin generar logs individuales por fila.",
        "es_correcta": 1
      },
      {
        "id": 878,
        "letra": "b",
        "orden": 2,
        "texto": "Porque borra la estructura sin afectar a los datos reales.",
        "es_correcta": 0
      },
      {
        "id": 879,
        "letra": "c",
        "orden": 3,
        "texto": "Porque se ejecuta en memoria caché y no en el disco físico.",
        "es_correcta": 0
      },
      {
        "id": 880,
        "letra": "d",
        "orden": 4,
        "texto": "Porque solo borra temporalmente mediante un alias de vista.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 221,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "En el modelamiento conceptual, ¿cómo se denomina a una entidad cuya existencia depende de otra entidad?",
    "justificacion": "Una entidad débil no tiene existencia propia: depende de otra para existir y para identificarse, así que su clave incluye la de la entidad fuerte. El ejemplo típico es el detalle de una factura, que no significa nada sin su factura. Los otros tres nombres suenan plausibles y no son categorías del modelo Entidad-Relación; «recursiva» describe una relación de una entidad consigo misma, que es otra cosa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 881,
        "letra": "a",
        "orden": 1,
        "texto": "Entidad Abstracta",
        "es_correcta": 0
      },
      {
        "id": 882,
        "letra": "b",
        "orden": 2,
        "texto": "Entidad Débil",
        "es_correcta": 1
      },
      {
        "id": 883,
        "letra": "c",
        "orden": 3,
        "texto": "Entidad Polimórfica",
        "es_correcta": 0
      },
      {
        "id": 884,
        "letra": "d",
        "orden": 4,
        "texto": "Entidad Recursiva",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 222,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Cuál es el objetivo principal de aplicar la Tercera Forma Normal (3FN) a una base de datos relacional?",
    "justificacion": "La Tercera Forma Normal elimina las dependencias transitivas —atributos no clave que dependen de otros atributos no clave— y con ellas la redundancia que producen. El resultado es que cada dato vive en un solo sitio y no puede contradecirse. La (b) dice justo lo contrario de lo que ocurre: normalizar suele agregar `JOIN`, no quitarlos, y ése es el intercambio que la desnormalización revierte.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 885,
        "letra": "a",
        "orden": 1,
        "texto": "Permitir la creación ilimitada de llaves foráneas.",
        "es_correcta": 0
      },
      {
        "id": 886,
        "letra": "b",
        "orden": 2,
        "texto": "Acelerar el procesamiento de los JOINs en consultas lentas.",
        "es_correcta": 0
      },
      {
        "id": 887,
        "letra": "c",
        "orden": 3,
        "texto": "Eliminar redundancias y dependencias transitivas de datos.",
        "es_correcta": 1
      },
      {
        "id": 888,
        "letra": "d",
        "orden": 4,
        "texto": "Cifrar automáticamente todas las contraseñas almacenadas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 223,
    "modulo": 5,
    "modulo_titulo": "Fundamentos de Bases de Datos Relacionales",
    "modulo_icono": "database",
    "enunciado": "¿Qué elemento central documenta formalmente las tablas, atributos, tipos de datos y sus restricciones?",
    "justificacion": "El diccionario de datos es el documento que formaliza qué hay en la base: tablas, atributos, tipos y restricciones, con el significado de cada uno. Sirve para que alguien entienda el modelo sin tener que deducirlo del DDL. Las otras tres son piezas reales con otro oficio: el log registra transacciones, y ni un mapa físico ni un árbol de dependencias documentan tipos ni restricciones.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 889,
        "letra": "a",
        "orden": 1,
        "texto": "El mapa conceptual físico.",
        "es_correcta": 0
      },
      {
        "id": 890,
        "letra": "b",
        "orden": 2,
        "texto": "El diccionario de datos.",
        "es_correcta": 1
      },
      {
        "id": 891,
        "letra": "c",
        "orden": 3,
        "texto": "El log de transacciones.",
        "es_correcta": 0
      },
      {
        "id": 892,
        "letra": "d",
        "orden": 4,
        "texto": "El árbol de dependencias.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 224,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué característica arquitectónica fundamental distingue al motor de Node.js?",
    "justificacion": "Node corre el código JavaScript en **un solo hilo**, y no se queda esperando a las operaciones lentas: las delega y sigue atendiendo. Ésa es la combinación —un hilo, sin bloquear— que le permite sostener muchas conexiones a la vez sin crear un hilo por cada una. Las otras tres describen arquitecturas ajenas: la de un servidor tradicional con hilos bloqueantes, la de un script de navegador, y una compilación a ensamblador que no ocurre.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 893,
        "letra": "a",
        "orden": 1,
        "texto": "Se basa en múltiples hilos bloqueantes (multi-thread).",
        "es_correcta": 0
      },
      {
        "id": 894,
        "letra": "b",
        "orden": 2,
        "texto": "Utiliza un único hilo de ejecución (single-thread) no bloqueante.",
        "es_correcta": 1
      },
      {
        "id": 895,
        "letra": "c",
        "orden": 3,
        "texto": "Delega todo el procesamiento al navegador del cliente.",
        "es_correcta": 0
      },
      {
        "id": 896,
        "letra": "d",
        "orden": 4,
        "texto": "Compila el código a lenguaje ensamblador en tiempo real.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 225,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué motor interno utiliza Node.js para interpretar el código JavaScript?",
    "justificacion": "Node usa V8, el mismo motor de Chrome, y por eso el JavaScript que se escribe en el servidor es el mismo lenguaje que en el navegador. Las otras tres son motores reales de otros navegadores: SpiderMonkey el de Firefox, JavaScriptCore el de Safari, y Chakra el del Edge antiguo. Lo que Node agrega por encima de V8 es todo lo que el navegador no da: archivos, red, procesos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 897,
        "letra": "a",
        "orden": 1,
        "texto": "SpiderMonkey de Mozilla",
        "es_correcta": 0
      },
      {
        "id": 898,
        "letra": "b",
        "orden": 2,
        "texto": "JavaScriptCore de Apple",
        "es_correcta": 0
      },
      {
        "id": 899,
        "letra": "c",
        "orden": 3,
        "texto": "V8 de Google",
        "es_correcta": 1
      },
      {
        "id": 900,
        "letra": "d",
        "orden": 4,
        "texto": "Chakra de Microsoft",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 226,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Cuál es el rol principal de Express dentro del ecosistema de Node.js?",
    "justificacion": "Express es un framework minimalista para armar servidores web: rutas, middlewares y poco más. Lo que no trae es tan importante como lo que trae — no incluye base de datos, ni ORM, ni motor de plantillas obligatorio—, y esa es su idea: dar la estructura mínima y dejar que cada proyecto elija el resto. Tampoco ejecuta nada en paralelo: hereda el modelo de un solo hilo de Node.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 901,
        "letra": "a",
        "orden": 1,
        "texto": "Proveer una base de datos relacional nativa y segura.",
        "es_correcta": 0
      },
      {
        "id": 902,
        "letra": "b",
        "orden": 2,
        "texto": "Ser un motor de plantillas exclusivo para frontend.",
        "es_correcta": 0
      },
      {
        "id": 903,
        "letra": "c",
        "orden": 3,
        "texto": "Funcionar como un framework minimalista para infraestructura web.",
        "es_correcta": 1
      },
      {
        "id": 904,
        "letra": "d",
        "orden": 4,
        "texto": "Ejecutar tareas en múltiples hilos paralelos independientes.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 227,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "En la arquitectura de Express, ¿qué es y qué hace un \"middleware\"?",
    "justificacion": "Un middleware es una función que se coloca en el camino de la petición y puede leerla, modificarla, responder o pasarla al siguiente con `next()`. Con eso se arman la autenticación, el registro de peticiones, el parseo del cuerpo y el manejo de errores. La clave está en ese `next()`: si un middleware no lo llama ni responde, la petición se queda colgada — y es uno de los errores más difíciles de encontrar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 905,
        "letra": "a",
        "orden": 1,
        "texto": "Una función que intercepta peticiones HTTP y respuestas.",
        "es_correcta": 1
      },
      {
        "id": 906,
        "letra": "b",
        "orden": 2,
        "texto": "Un motor de base de datos embebido en memoria.",
        "es_correcta": 0
      },
      {
        "id": 907,
        "letra": "c",
        "orden": 3,
        "texto": "Un paquete exclusivo para renderizar CSS dinámico.",
        "es_correcta": 0
      },
      {
        "id": 908,
        "letra": "d",
        "orden": 4,
        "texto": "Un módulo nativo de Node para comprimir archivos de texto.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 228,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "A diferencia de un servidor clásico, ¿cómo maneja Node.js las peticiones concurrentes?",
    "justificacion": "Node no crea un hilo por petición: registra la operación lenta —leer un archivo, consultar la base— y sigue atendiendo, y cuando esa operación termina, su callback vuelve a la cola para ejecutarse. Por eso aguanta muchas conexiones con poca memoria. La (b) describe el modelo clásico de un hilo por usuario, que es justo lo que Node evita, y la (a) describe lo contrario de no bloquear.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 909,
        "letra": "a",
        "orden": 1,
        "texto": "Bloquea el proceso principal hasta resolver cada petición.",
        "es_correcta": 0
      },
      {
        "id": 910,
        "letra": "b",
        "orden": 2,
        "texto": "Crea un nuevo hilo de sistema operativo por usuario.",
        "es_correcta": 0
      },
      {
        "id": 911,
        "letra": "c",
        "orden": 3,
        "texto": "Delega las tareas a procesos asíncronos mediante callbacks.",
        "es_correcta": 1
      },
      {
        "id": 912,
        "letra": "d",
        "orden": 4,
        "texto": "Rechaza peticiones si sobrepasan el límite del hardware.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 229,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué tipo de arquitectura de ruteo promueve fuertemente el framework Express?",
    "justificacion": "Express propone declarar rutas asociando un método HTTP y una ruta a una función: `app.get('/usuarios', ...)`. Se lee como una tabla de lo que la aplicación ofrece, y por eso escala bien: agregar una ruta es agregar una línea, no modificar una cadena de condicionales. Las otras tres describen enfoques que Express no promueve y que se vuelven inmanejables al crecer.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 913,
        "letra": "a",
        "orden": 1,
        "texto": "Ruteo imperativo anidado profundo.",
        "es_correcta": 0
      },
      {
        "id": 914,
        "letra": "b",
        "orden": 2,
        "texto": "Ruteo estático compilado en binarios.",
        "es_correcta": 0
      },
      {
        "id": 915,
        "letra": "c",
        "orden": 3,
        "texto": "Ruteo declarativo a través de métodos HTTP y URIs.",
        "es_correcta": 1
      },
      {
        "id": 916,
        "letra": "d",
        "orden": 4,
        "texto": "Ruteo basado en variables de sesión globales de servidor.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 230,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "En el ciclo de vida de un proceso Node, ¿qué detiene la ejecución del programa de forma natural?",
    "justificacion": "Un proceso Node termina solo cuando no le queda nada pendiente: ni callbacks encolados, ni temporizadores activos, ni servidores escuchando. Por eso un programa que solo lee un archivo termina al acabar, y un servidor web no termina nunca — el socket abierto es trabajo pendiente permanente. Es también la explicación de un caso confuso: un `setInterval` olvidado mantiene el proceso vivo para siempre.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 917,
        "letra": "a",
        "orden": 1,
        "texto": "La finalización del hilo bloqueante principal tras 5 minutos.",
        "es_correcta": 0
      },
      {
        "id": 918,
        "letra": "b",
        "orden": 2,
        "texto": "El vaciado total de la pila de eventos (Event Loop).",
        "es_correcta": 1
      },
      {
        "id": 919,
        "letra": "c",
        "orden": 3,
        "texto": "La ejecución constante del comando interno process.pause().",
        "es_correcta": 0
      },
      {
        "id": 920,
        "letra": "d",
        "orden": 4,
        "texto": "El renderizado de la primera vista en el cliente HTTP.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 231,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Al instalar dependencias globales con Node, ¿dónde quedan disponibles los comandos binarios?",
    "justificacion": "Instalar con `-g` deja los ejecutables del paquete en un directorio que está en el `PATH` del sistema, así que se pueden invocar por su nombre desde cualquier carpeta. Una instalación local, en cambio, los deja en `node_modules/.bin`, alcanzables desde los guiones de `package.json` o con `npx`. Hoy se prefiere lo local justamente para que cada proyecto fije su versión.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 921,
        "letra": "a",
        "orden": 1,
        "texto": "En el archivo package.json del proyecto local exclusivamente.",
        "es_correcta": 0
      },
      {
        "id": 922,
        "letra": "b",
        "orden": 2,
        "texto": "Solamente en la subcarpeta node_modules local del proyecto.",
        "es_correcta": 0
      },
      {
        "id": 923,
        "letra": "c",
        "orden": 3,
        "texto": "En las variables de entorno PATH del sistema operativo subyacente.",
        "es_correcta": 1
      },
      {
        "id": 924,
        "letra": "d",
        "orden": 4,
        "texto": "En el registro interno del navegador del desarrollador.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 232,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué diferencia clave existe entre una instrucción \"blocking\" y \"non-blocking\" en Node?",
    "justificacion": "Una operación bloqueante detiene el único hilo hasta terminar, y mientras tanto **ninguna otra petición se atiende**; una no bloqueante entrega el trabajo y sigue, y avisa después por un callback. En un servidor la diferencia no es de estilo: una lectura síncrona de un archivo grande deja a todos los usuarios esperando. Por eso las funciones de Node vienen casi siempre en las dos formas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 925,
        "letra": "a",
        "orden": 1,
        "texto": "Blocking pausa el hilo principal; non-blocking delega por callbacks.",
        "es_correcta": 1
      },
      {
        "id": 926,
        "letra": "b",
        "orden": 2,
        "texto": "Non-blocking detiene la CPU; blocking usa excesiva memoria RAM.",
        "es_correcta": 0
      },
      {
        "id": 927,
        "letra": "c",
        "orden": 3,
        "texto": "Blocking solo afecta a peticiones de red; non-blocking al disco.",
        "es_correcta": 0
      },
      {
        "id": 928,
        "letra": "d",
        "orden": 4,
        "texto": "Node ignora las instrucciones blocking para evitar fallas crónicas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 233,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Cuál es el propósito del paquete `nodemon` durante el desarrollo de una aplicación Node?",
    "justificacion": "`nodemon` vigila los archivos del proyecto y reinicia el proceso cuando alguno cambia, para no tener que parar y arrancar a mano en cada edición. Es una herramienta de desarrollo y por eso va en `devDependencies`: en producción no se usa, donde el reinicio lo gestiona otra cosa. Las otras tres describen oficios de herramientas distintas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 929,
        "letra": "a",
        "orden": 1,
        "texto": "Minimizar el código fuente a su versión más ligera de byte.",
        "es_correcta": 0
      },
      {
        "id": 930,
        "letra": "b",
        "orden": 2,
        "texto": "Encriptar las peticiones HTTP mediante protocolos SSL/TLS.",
        "es_correcta": 0
      },
      {
        "id": 931,
        "letra": "c",
        "orden": 3,
        "texto": "Reiniciar automáticamente el servidor al detectar cambios.",
        "es_correcta": 1
      },
      {
        "id": 932,
        "letra": "d",
        "orden": 4,
        "texto": "Generar datos falsos masivos para probar la base de datos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 234,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué objeto global en Node.js provee información y control directo sobre la ejecución actual?",
    "justificacion": "`process` es el objeto global que representa al proceso en curso: da los argumentos de la línea de comandos en `process.argv`, las variables de entorno en `process.env`, el código de salida, y eventos como `exit`. Los otros tres nombres no existen. Es de los primeros que hay que conocer, porque casi toda configuración de una aplicación Node entra por `process.env`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 933,
        "letra": "a",
        "orden": 1,
        "texto": "system",
        "es_correcta": 0
      },
      {
        "id": 934,
        "letra": "b",
        "orden": 2,
        "texto": "process",
        "es_correcta": 1
      },
      {
        "id": 935,
        "letra": "c",
        "orden": 3,
        "texto": "globalApp",
        "es_correcta": 0
      },
      {
        "id": 936,
        "letra": "d",
        "orden": 4,
        "texto": "nodeEnv",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 235,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué ocurre si un error no capturado (uncaught exception) alcanza la cima del Event Loop?",
    "justificacion": "Un error que nadie captura llega arriba del todo y **tumba el proceso**: Node imprime la traza y sale. No hay red de seguridad por omisión, y ésa es una diferencia grande con el navegador, donde un error en un manejador no cierra la página. Por eso en producción se pone un supervisor que reinicie, y por eso conviene capturar los errores donde ocurren en vez de confiar en `process.on('uncaughtException')`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 937,
        "letra": "a",
        "orden": 1,
        "texto": "Node ignora el error silenciosamente y continúa iterando eventos.",
        "es_correcta": 0
      },
      {
        "id": 938,
        "letra": "b",
        "orden": 2,
        "texto": "El proceso principal se interrumpe y la aplicación se cae por fallas.",
        "es_correcta": 1
      },
      {
        "id": 939,
        "letra": "c",
        "orden": 3,
        "texto": "Se envía un reporte automático en XML al administrador del servidor.",
        "es_correcta": 0
      },
      {
        "id": 940,
        "letra": "d",
        "orden": 4,
        "texto": "Express reinicia dinámicamente el hilo afectado sin afectar a otros.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 236,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué archivo es imprescindible para que una carpeta se reconozca como proyecto Node/NPM?",
    "justificacion": "`package.json` es lo que convierte una carpeta en un proyecto: declara nombre, versión, dependencias y guiones. Sin él, `npm` no sabe qué instalar ni qué ejecutar. Los otros tres son habituales pero no imprescindibles: `index.js` es una convención de nombre, `node_modules` lo genera la instalación, y un archivo de entorno es opcional y además **no se versiona**.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 941,
        "letra": "a",
        "orden": 1,
        "texto": "package.json",
        "es_correcta": 1
      },
      {
        "id": 942,
        "letra": "b",
        "orden": 2,
        "texto": "index.js",
        "es_correcta": 0
      },
      {
        "id": 943,
        "letra": "c",
        "orden": 3,
        "texto": "node_modules",
        "es_correcta": 0
      },
      {
        "id": 944,
        "letra": "d",
        "orden": 4,
        "texto": ".env config",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 237,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Al instalar un paquete mediante `npm install`, ¿qué carpeta almacena sus archivos físicos?",
    "justificacion": "`npm install` deja los archivos de cada paquete en `node_modules`, en la raíz del proyecto. Esa carpeta se puede borrar y reconstruir en cualquier momento con otro `npm install`, y por eso **no se versiona**: lo que se versiona es `package.json` con lo declarado y `package-lock.json` con las versiones exactas. Los otros tres nombres no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 945,
        "letra": "a",
        "orden": 1,
        "texto": "/bin modules",
        "es_correcta": 0
      },
      {
        "id": 946,
        "letra": "b",
        "orden": 2,
        "texto": "/lib packages",
        "es_correcta": 0
      },
      {
        "id": 947,
        "letra": "c",
        "orden": 3,
        "texto": "node_modules",
        "es_correcta": 1
      },
      {
        "id": 948,
        "letra": "d",
        "orden": 4,
        "texto": "npm_packages_core",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 238,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué comando NPM inicia el asistente interactivo para crear el archivo de configuración base?",
    "justificacion": "`npm init` abre el cuestionario que arma el `package.json` preguntando nombre, versión, punto de entrada y demás. La alternativa (c) es la que separa: `npm init -y` **crea el archivo igual, pero sin preguntar nada** — el `-y` acepta todos los valores por omisión, que es justo lo contrario del asistente interactivo que la pregunta pide. Es el atajo que se usa cuando el detalle da lo mismo. `npm start` ejecuta un guion ya declarado y `npm setup_project` no existe.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 949,
        "letra": "a",
        "orden": 1,
        "texto": "npm start",
        "es_correcta": 0
      },
      {
        "id": 950,
        "letra": "b",
        "orden": 2,
        "texto": "npm init",
        "es_correcta": 1
      },
      {
        "id": 951,
        "letra": "c",
        "orden": 3,
        "texto": "npm init -y",
        "es_correcta": 0
      },
      {
        "id": 952,
        "letra": "d",
        "orden": 4,
        "texto": "npm setup_project",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 239,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Cómo se exporta correctamente un módulo personalizado en Node (CommonJS) para su reutilización?",
    "justificacion": "En CommonJS lo que se exporta es lo que se asigne a `module.exports`, y con un objeto se exponen varias cosas de una vez. La (b) es la sintaxis de los módulos ES, que es el otro sistema y no se mezcla con éste en el mismo archivo — esa distinción es justamente lo que la pregunta separa. `return` no funciona fuera de una función y `expose_module()` no existe.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 953,
        "letra": "a",
        "orden": 1,
        "texto": "module.exports = { modulo }",
        "es_correcta": 1
      },
      {
        "id": 954,
        "letra": "b",
        "orden": 2,
        "texto": "export default modulo",
        "es_correcta": 0
      },
      {
        "id": 955,
        "letra": "c",
        "orden": 3,
        "texto": "return modulo_global",
        "es_correcta": 0
      },
      {
        "id": 956,
        "letra": "d",
        "orden": 4,
        "texto": "expose_module(modulo)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 240,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Al leer el archivo package.json, ¿qué indican los símbolos ^ o ~ en la versión de un paquete?",
    "justificacion": "`^` y `~` fijan hasta dónde puede subir sola una dependencia al reinstalar: `^1.2.3` acepta cualquier `1.x.x` posterior, o sea correcciones y funciones nuevas pero no cambios que rompan; `~1.2.3` es más estricto y solo acepta `1.2.x`. Sin ningún símbolo, la versión queda clavada. Ninguna de las otras tres describe algo que esos símbolos hagan.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 957,
        "letra": "a",
        "orden": 1,
        "texto": "Definen estrictas políticas de actualizaciones automáticas permitidas.",
        "es_correcta": 1
      },
      {
        "id": 958,
        "letra": "b",
        "orden": 2,
        "texto": "Indican que el paquete está obsoleto y será eliminado próximamente.",
        "es_correcta": 0
      },
      {
        "id": 959,
        "letra": "c",
        "orden": 3,
        "texto": "Obligan a instalar forzosamente una versión pre-lanzamiento beta.",
        "es_correcta": 0
      },
      {
        "id": 960,
        "letra": "d",
        "orden": 4,
        "texto": "Señalan que el paquete debe instalarse de forma global del sistema.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 241,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué comando NPM debes ejecutar para ver qué paquetes tienen una nueva versión disponible?",
    "justificacion": "`npm outdated` lista los paquetes cuya versión instalada se quedó atrás, mostrando la actual, la que permitiría el rango declarado y la última publicada. No cambia nada: solo informa, y por eso es el paso previo a `npm update`. Los otros tres nombres no existen. Conviene mirarlo antes de actualizar, porque la columna «latest» puede estar detrás de un cambio mayor.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 961,
        "letra": "a",
        "orden": 1,
        "texto": "npm update-check",
        "es_correcta": 0
      },
      {
        "id": 962,
        "letra": "b",
        "orden": 2,
        "texto": "npm outdated",
        "es_correcta": 1
      },
      {
        "id": 963,
        "letra": "c",
        "orden": 3,
        "texto": "npm upgrade-list",
        "es_correcta": 0
      },
      {
        "id": 964,
        "letra": "d",
        "orden": 4,
        "texto": "npm list-old-versions",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 242,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Para invocar funcionalidades de un módulo nativo o de terceros en CommonJS, ¿qué sentencia usas?",
    "justificacion": "`require()` es la forma de CommonJS, el sistema de módulos con el que Node nació y el que sigue usando cuando el archivo no se declara como módulo ES. La (a), `import()`, existe en Node pero pertenece al otro sistema —y en su forma dinámica devuelve una promesa—, así que no es equivalente. Los otros dos no existen. Cuál rige lo decide la extensión del archivo y el campo `type` del `package.json`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 965,
        "letra": "a",
        "orden": 1,
        "texto": "import()",
        "es_correcta": 0
      },
      {
        "id": 966,
        "letra": "b",
        "orden": 2,
        "texto": "loadModule()",
        "es_correcta": 0
      },
      {
        "id": 967,
        "letra": "c",
        "orden": 3,
        "texto": "require()",
        "es_correcta": 1
      },
      {
        "id": 968,
        "letra": "d",
        "orden": 4,
        "texto": "fetchDependency()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 243,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué ventaja ofrece usar dependencias de desarrollo (devDependencies) en el package.json?",
    "justificacion": "Las dependencias de desarrollo son las que solo hacen falta mientras se trabaja —pruebas, `nodemon`, herramientas de construcción— y se pueden dejar fuera al desplegar, con `npm install --omit=dev` o con `NODE_ENV=production`. Eso hace la instalación más liviana y reduce lo que llega al servidor. Por omisión, un `npm install` corriente sí las instala: la separación es una declaración de intención que el despliegue aprovecha.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 969,
        "letra": "a",
        "orden": 1,
        "texto": "Aceleran el tiempo de compilación nativa directamente en el servidor.",
        "es_correcta": 0
      },
      {
        "id": 970,
        "letra": "b",
        "orden": 2,
        "texto": "No se instalan obligatoriamente al desplegar el proyecto en producción.",
        "es_correcta": 1
      },
      {
        "id": 971,
        "letra": "c",
        "orden": 3,
        "texto": "Tienen mayor prioridad de carga en la memoria RAM del sistema base.",
        "es_correcta": 0
      },
      {
        "id": 972,
        "letra": "d",
        "orden": 4,
        "texto": "Permiten ejecutar código asíncrono evadiendo el uso de callbacks.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 244,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué directiva de Express se utiliza habitualmente para servir contenido estático (CSS, img)?",
    "justificacion": "`express.static()` es el middleware que sirve archivos tal cual están en una carpeta: hojas de estilo, imágenes, guiones del cliente. Se monta con `app.use(express.static('public'))` y desde ahí el contenido queda disponible por su ruta. Los otros tres nombres no existen. Conviene recordar que lo que entra en esa carpeta queda público: es exactamente la decisión que en este proyecto toma `LISTA_COPIA`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 973,
        "letra": "a",
        "orden": 1,
        "texto": "express.static()",
        "es_correcta": 1
      },
      {
        "id": 974,
        "letra": "b",
        "orden": 2,
        "texto": "express.publicContent()",
        "es_correcta": 0
      },
      {
        "id": 975,
        "letra": "c",
        "orden": 3,
        "texto": "app.useStaticFolder()",
        "es_correcta": 0
      },
      {
        "id": 976,
        "letra": "d",
        "orden": 4,
        "texto": "express.serveAssets()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 245,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Cuál es la función principal de un motor de plantillas como Handlebars en un servidor Express?",
    "justificacion": "Un motor de plantillas toma un archivo con marcadores y los datos que le pasa el servidor, y produce el HTML final que se envía al navegador. Con eso la vista deja de escribirse a mano por cada caso. Las otras tres describen oficios ajenos: ni genera tablas de base de datos, ni valida formularios, ni comprime imágenes. La lógica pesada no va en la plantilla: va antes, en el controlador.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 977,
        "letra": "a",
        "orden": 1,
        "texto": "Generar esquemas y tablas de base de datos a partir del código JS.",
        "es_correcta": 0
      },
      {
        "id": 978,
        "letra": "b",
        "orden": 2,
        "texto": "Renderizar HTML dinámico inyectando variables del backend al vuelo.",
        "es_correcta": 1
      },
      {
        "id": 979,
        "letra": "c",
        "orden": 3,
        "texto": "Validar fuertemente los formularios HTTP antes de enviarlos a disco.",
        "es_correcta": 0
      },
      {
        "id": 980,
        "letra": "d",
        "orden": 4,
        "texto": "Comprimir imágenes estáticas de forma asíncrona para el cliente.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 246,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué concepto en Handlebars permite reutilizar bloques de código HTML, como un header o footer?",
    "justificacion": "Los **partials** son fragmentos de plantilla que se escriben una vez y se incluyen donde hagan falta con `{{> nombre}}`: la cabecera, el pie, un menú. Evitan repetir el mismo HTML en cada vista y, sobre todo, evitan tener que corregirlo en diez sitios. Las otras tres opciones mezclan palabras de otros contextos y no son conceptos de Handlebars.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 981,
        "letra": "a",
        "orden": 1,
        "texto": "Middleware views component",
        "es_correcta": 0
      },
      {
        "id": 982,
        "letra": "b",
        "orden": 2,
        "texto": "Partials (Páginas parciales)",
        "es_correcta": 1
      },
      {
        "id": 983,
        "letra": "c",
        "orden": 3,
        "texto": "Injections (Inyecciones de DOM)",
        "es_correcta": 0
      },
      {
        "id": 984,
        "letra": "d",
        "orden": 4,
        "texto": "Layout fragments template",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 247,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué método del objeto `res` en Express procesa una plantilla y la envía como HTML al cliente?",
    "justificacion": "`res.render('vista', datos)` busca la plantilla, la combina con los datos y manda el HTML resultante al cliente. Es el par de `res.send()`, que envía contenido ya listo, y de `res.json()`, que envía datos. Los otros tres nombres no existen. Para que funcione hace falta haber configurado antes el motor de vistas y el directorio donde están.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 985,
        "letra": "a",
        "orden": 1,
        "texto": "res.sendTemplateObject()",
        "es_correcta": 0
      },
      {
        "id": 986,
        "letra": "b",
        "orden": 2,
        "texto": "res.render()",
        "es_correcta": 1
      },
      {
        "id": 987,
        "letra": "c",
        "orden": 3,
        "texto": "res.htmlCompiler()",
        "es_correcta": 0
      },
      {
        "id": 988,
        "letra": "d",
        "orden": 4,
        "texto": "res.viewGenerator()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 248,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Para que Express reconozca Handlebars como su motor base, ¿qué propiedad de `app.set` se define?",
    "justificacion": "Se declara con `app.set('view engine', 'handlebars')`, y junto a él suele ir `app.set('views', ruta)` para decir dónde están las plantillas. Con eso, `res.render('inicio')` ya sabe qué archivo buscar y con qué motor procesarlo. Los otros tres nombres de propiedad no existen: Express solo reconoce las suyas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 989,
        "letra": "a",
        "orden": 1,
        "texto": "'template engine base'",
        "es_correcta": 0
      },
      {
        "id": 990,
        "letra": "b",
        "orden": 2,
        "texto": "'view engine'",
        "es_correcta": 1
      },
      {
        "id": 991,
        "letra": "c",
        "orden": 3,
        "texto": "'render compile mode'",
        "es_correcta": 0
      },
      {
        "id": 992,
        "letra": "d",
        "orden": 4,
        "texto": "'html processor native'",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 249,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "En Handlebars, ¿qué es un \"Helper\" y cuál es su utilidad principal?",
    "justificacion": "Un helper es una función de JavaScript que se registra en Handlebars y se puede llamar desde la plantilla, para resolver ahí lo que el lenguaje de plantillas no hace solo: formatear una fecha, comparar dos valores, pluralizar. Es la válvula de escape para lógica **de presentación**, y conviene que se quede en eso: la lógica de negocio pertenece al controlador, no a la vista.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 993,
        "letra": "a",
        "orden": 1,
        "texto": "Una directiva de Express para comprimir el HTML antes de su salida.",
        "es_correcta": 0
      },
      {
        "id": 994,
        "letra": "b",
        "orden": 2,
        "texto": "Un archivo CSS que aplica estilos responsivos por defecto en tablas.",
        "es_correcta": 0
      },
      {
        "id": 995,
        "letra": "c",
        "orden": 3,
        "texto": "Una función JS que ejecuta lógica de presentación incrustada en vista.",
        "es_correcta": 1
      },
      {
        "id": 996,
        "letra": "d",
        "orden": 4,
        "texto": "Un componente asíncrono que previene inyección de código tipo SQL.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 250,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Para leer el contenido de un archivo de texto de forma síncrona en Node, ¿qué método usarías?",
    "justificacion": "`fs.readFileSync(ruta, 'utf8')` lee el archivo y devuelve su contenido de una vez, deteniendo el hilo hasta terminar. Los otros tres nombres no existen. El sufijo `Sync` es la convención de Node para las versiones bloqueantes, y por eso conviene reservarlas para guiones y arranque: dentro de un servidor que atiende peticiones, cada una de ellas deja a todos los demás esperando.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 997,
        "letra": "a",
        "orden": 1,
        "texto": "fs.readSyncFile()",
        "es_correcta": 0
      },
      {
        "id": 998,
        "letra": "b",
        "orden": 2,
        "texto": "fs.readFileSync()",
        "es_correcta": 1
      },
      {
        "id": 999,
        "letra": "c",
        "orden": 3,
        "texto": "fs.openSyncStream()",
        "es_correcta": 0
      },
      {
        "id": 1000,
        "letra": "d",
        "orden": 4,
        "texto": "fs.loadTextSync()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 251,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Al leer un archivo JSON plano con `fs`, el resultado es texto crudo. ¿Cómo lo conviertes a objeto?",
    "justificacion": "`JSON.parse()` convierte el texto leído en un objeto de JavaScript. Su par es `JSON.stringify()`, que es la (c) y hace el camino contrario — se confunden por parecido y por costumbre. Conviene envolverlo en `try/catch`: si el archivo está a medias o corrupto, `JSON.parse()` lanza, y sin capturar ese error el proceso se cae.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1001,
        "letra": "a",
        "orden": 1,
        "texto": "String.toObjectJS()",
        "es_correcta": 0
      },
      {
        "id": 1002,
        "letra": "b",
        "orden": 2,
        "texto": "JSON.parse()",
        "es_correcta": 1
      },
      {
        "id": 1003,
        "letra": "c",
        "orden": 3,
        "texto": "JSON.stringify()",
        "es_correcta": 0
      },
      {
        "id": 1004,
        "letra": "d",
        "orden": 4,
        "texto": "ParseData.evaluate()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 252,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Por qué el uso exclusivo de `fs.writeFileSync()` puede ser contraproducente en aplicaciones web?",
    "justificacion": "Escribir de forma síncrona detiene el único hilo hasta que el disco responde, y mientras tanto **ninguna otra petición se atiende**. En un guion que corre y termina no importa; en un servidor con usuarios, sí. La salida es la versión con promesas, `fs.promises.writeFile()`, que delega la espera y deja el hilo libre. Las otras tres describen limitaciones que `fs` no tiene.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1005,
        "letra": "a",
        "orden": 1,
        "texto": "Solo permite escribir archivos binarios, no strings de texto plano.",
        "es_correcta": 0
      },
      {
        "id": 1006,
        "letra": "b",
        "orden": 2,
        "texto": "Requiere permisos de administrador (root) absolutos para funcionar.",
        "es_correcta": 0
      },
      {
        "id": 1007,
        "letra": "c",
        "orden": 3,
        "texto": "Bloquea el hilo principal, paralizando la atención de otras peticiones.",
        "es_correcta": 1
      },
      {
        "id": 1008,
        "letra": "d",
        "orden": 4,
        "texto": "Borra automáticamente el archivo si falla la conexión HTTP entrante.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 253,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Si deseas actualizar un registro dentro de un archivo JSON plano, ¿cuál es el flujo lógico correcto?",
    "justificacion": "El flujo es leer el archivo, convertirlo a objeto con `JSON.parse()`, modificar lo que corresponda, volverlo a texto con `JSON.stringify()` y reescribirlo entero. Un archivo JSON no se edita por partes: se reemplaza. De ahí sale su límite como forma de persistencia — dos escrituras a la vez pueden pisarse—, que es justamente el motivo por el que el módulo siguiente pasa a una base de datos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1009,
        "letra": "a",
        "orden": 1,
        "texto": "Buscar línea exacta por regex y sobrescribir el binario en memoria.",
        "es_correcta": 0
      },
      {
        "id": 1010,
        "letra": "b",
        "orden": 2,
        "texto": "Leer, parsear a objeto JS, modificar, pasarlo a string y reescribir.",
        "es_correcta": 1
      },
      {
        "id": 1011,
        "letra": "c",
        "orden": 3,
        "texto": "Usar fs.updateJSON() apuntando directo a la propiedad JS anidada.",
        "es_correcta": 0
      },
      {
        "id": 1012,
        "letra": "d",
        "orden": 4,
        "texto": "Inyectar una query SQL parametrizada mediante el módulo file-system.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 254,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Al modularizar la persistencia en archivos planos, ¿cuál es una buena práctica de diseño de código?",
    "justificacion": "Conviene reunir las funciones que tocan archivos en un módulo propio y exportarlas, de modo que las rutas solo las llamen. Así la ruta habla de HTTP y el módulo habla de persistencia, y el día que los datos se muden a una base solo cambia un archivo. Las otras tres describen prácticas que atan la aplicación a su forma actual o que dejan pasar los errores en silencio.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1013,
        "letra": "a",
        "orden": 1,
        "texto": "Dejar toda la lógica de `fs` escrita directamente en los ruteadores HTTP.",
        "es_correcta": 0
      },
      {
        "id": 1014,
        "letra": "b",
        "orden": 2,
        "texto": "Crear funciones independientes orientadas y exportarlas como un módulo.",
        "es_correcta": 1
      },
      {
        "id": 1015,
        "letra": "c",
        "orden": 3,
        "texto": "Usar variables globales en el scope para compartir los datos en crudo.",
        "es_correcta": 0
      },
      {
        "id": 1016,
        "letra": "d",
        "orden": 4,
        "texto": "Ignorar el manejo de errores de escritura para no interrumpir el flujo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 255,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué ocurre si intentas usar `fs.writeFileSync()` sobre un archivo físico que aún no existe?",
    "justificacion": "Lo crea. `fs.writeFileSync()` crea el archivo si no existe y lo **sobrescribe entero** si existe, que es la parte que conviene tener presente: no agrega al final. Para eso está `fs.appendFileSync()` o abrirlo con la bandera `'a'`. Las otras tres describen comportamientos que no ocurren: no lanza `FileNotFoundError`, no ignora la orden y no pide permisos por consola.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1017,
        "letra": "a",
        "orden": 1,
        "texto": "El proceso se detiene forzosamente arrojando un FileNotFoundError.",
        "es_correcta": 0
      },
      {
        "id": 1018,
        "letra": "b",
        "orden": 2,
        "texto": "Node crea el archivo automáticamente e inserta la data especificada.",
        "es_correcta": 1
      },
      {
        "id": 1019,
        "letra": "c",
        "orden": 3,
        "texto": "Node ignora el comando por seguridad y pasa a la siguiente instrucción.",
        "es_correcta": 0
      },
      {
        "id": 1020,
        "letra": "d",
        "orden": 4,
        "texto": "Solicita permisos de acceso interactivo en la consola del servidor base.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 256,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Cómo pasas parámetros por línea de comandos al iniciar una aplicación mediante `node index.js`?",
    "justificacion": "Los argumentos se escriben después del nombre del archivo, y la forma `--clave=valor` es la convención habitual porque las bibliotecas que los interpretan la reconocen sola. Las otras tres inventan sintaxis de otros contextos. Lo que llegue queda disponible en `process.argv`, que es la pregunta siguiente, y de ahí lo toman herramientas como `yargs`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1021,
        "letra": "a",
        "orden": 1,
        "texto": "node index.js --param=valor",
        "es_correcta": 1
      },
      {
        "id": 1022,
        "letra": "b",
        "orden": 2,
        "texto": "node index.js <param>valor</param>",
        "es_correcta": 0
      },
      {
        "id": 1023,
        "letra": "c",
        "orden": 3,
        "texto": "node index.js [param: valor]",
        "es_correcta": 0
      },
      {
        "id": 1024,
        "letra": "d",
        "orden": 4,
        "texto": "node index.js && param=valor_node",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 257,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Dentro de qué estructura array de Node se alojan los argumentos pasados por la línea de comandos?",
    "justificacion": "`process.argv` es un arreglo donde los dos primeros elementos son fijos —la ruta de Node y la del archivo— y **a partir del tercero vienen los argumentos de verdad**. Por eso casi siempre se lo recorta con `process.argv.slice(2)`, que es el detalle que más se olvida. Los otros tres nombres no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1025,
        "letra": "a",
        "orden": 1,
        "texto": "global.arguments",
        "es_correcta": 0
      },
      {
        "id": 1026,
        "letra": "b",
        "orden": 2,
        "texto": "process.argv",
        "es_correcta": 1
      },
      {
        "id": 1027,
        "letra": "c",
        "orden": 3,
        "texto": "console.params",
        "es_correcta": 0
      },
      {
        "id": 1028,
        "letra": "d",
        "orden": 4,
        "texto": "node.cli_options",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 258,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué dependencia de terceros se usa comúnmente en Node para parsear fácilmente los argumentos CLI?",
    "justificacion": "`yargs` interpreta los argumentos de la línea de comandos y además permite declarar cuáles son obligatorios, de qué tipo, y generar la ayuda sola. Evita tener que recorrer `process.argv` a mano. Las otras tres son bibliotecas reales con otro oficio: `nodemon` reinicia, `morgan` registra las peticiones HTTP, y `underscore` trae utilidades para colecciones.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1029,
        "letra": "a",
        "orden": 1,
        "texto": "yargs",
        "es_correcta": 1
      },
      {
        "id": 1030,
        "letra": "b",
        "orden": 2,
        "texto": "nodemon",
        "es_correcta": 0
      },
      {
        "id": 1031,
        "letra": "c",
        "orden": 3,
        "texto": "morgan",
        "es_correcta": 0
      },
      {
        "id": 1032,
        "letra": "d",
        "orden": 4,
        "texto": "underscore",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 259,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Si una aplicación Node lanza un error y arroja un \"Stack Trace\", ¿qué te indica esta lectura?",
    "justificacion": "La traza muestra la cadena de llamadas que llevó al error, de la más reciente hacia atrás, con archivo y línea de cada una. Se lee **de arriba abajo**: la primera línea es donde reventó, y las de abajo cuentan cómo se llegó ahí. Es la información más útil de un fallo, y conviene mirar la primera línea que apunte a código propio y no a `node_modules`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1033,
        "letra": "a",
        "orden": 1,
        "texto": "El uso de memoria y carga de CPU exactos al momento del fallo interno.",
        "es_correcta": 0
      },
      {
        "id": 1034,
        "letra": "b",
        "orden": 2,
        "texto": "La traza y jerarquía de funciones llamadas que condujeron al fallo.",
        "es_correcta": 1
      },
      {
        "id": 1035,
        "letra": "c",
        "orden": 3,
        "texto": "Las variables de entorno de base de datos filtradas accidentalmente.",
        "es_correcta": 0
      },
      {
        "id": 1036,
        "letra": "d",
        "orden": 4,
        "texto": "El historial encolado de peticiones HTTP de los últimos diez minutos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 260,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué atajo de teclado detiene la ejecución activa de un servidor Node.js corriendo en la terminal?",
    "justificacion": "`Ctrl + C` envía la señal de interrupción al proceso en primer plano y lo detiene. Es la forma estándar en cualquier terminal. Node permite además atenderla con `process.on('SIGINT', ...)` para cerrar ordenadamente lo que esté abierto, que es lo que hace un servidor bien terminado antes de salir. Las otras tres no detienen un proceso de Node en la terminal.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1037,
        "letra": "a",
        "orden": 1,
        "texto": "Esc + :q",
        "es_correcta": 0
      },
      {
        "id": 1038,
        "letra": "b",
        "orden": 2,
        "texto": "Ctrl + C (o Cmd + C)",
        "es_correcta": 1
      },
      {
        "id": 1039,
        "letra": "c",
        "orden": 3,
        "texto": "Alt + F4",
        "es_correcta": 0
      },
      {
        "id": 1040,
        "letra": "d",
        "orden": 4,
        "texto": "process.kill command",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 261,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Cuál es el comando estándar para imprimir y evaluar el valor de variables en la consola de comandos?",
    "justificacion": "`console.log()` imprime en la salida estándar y sirve tanto en Node como en el navegador. Los otros tres no existen — `document.write` sí existe pero pertenece al navegador y no a Node, donde no hay documento. Conviene conocer también `console.error()`, que escribe en la salida de errores y por eso se puede separar del resto al redirigir.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1041,
        "letra": "a",
        "orden": 1,
        "texto": "print.value()",
        "es_correcta": 0
      },
      {
        "id": 1042,
        "letra": "b",
        "orden": 2,
        "texto": "document.writeLog()",
        "es_correcta": 0
      },
      {
        "id": 1043,
        "letra": "c",
        "orden": 3,
        "texto": "echo.terminal()",
        "es_correcta": 0
      },
      {
        "id": 1044,
        "letra": "d",
        "orden": 4,
        "texto": "console.log()",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 262,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Cuál es el comportamiento nativo principal del Event Loop en la arquitectura de un proceso Node.js?",
    "justificacion": "El bucle de eventos es lo que permite atender muchas peticiones concurrentes con **un solo hilo**: mientras una espera por el disco o la red, el hilo atiende otra, y los callbacks de lo que va terminando se van ejecutando por turno. La (a) describe el modelo de un hilo por petición, que es justo el que Node evita, y la (b) le quita lo que lo hace útil.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1045,
        "letra": "a",
        "orden": 1,
        "texto": "Asigna un hilo del procesador por cada petición entrante.",
        "es_correcta": 0
      },
      {
        "id": 1046,
        "letra": "b",
        "orden": 2,
        "texto": "Ejecuta tareas síncronas en un único hilo bloqueante.",
        "es_correcta": 0
      },
      {
        "id": 1047,
        "letra": "c",
        "orden": 3,
        "texto": "Gestiona múltiples peticiones concurrentes en un único hilo.",
        "es_correcta": 1
      },
      {
        "id": 1048,
        "letra": "d",
        "orden": 4,
        "texto": "Delega el ruteo web directamente al motor V8 de Google.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 263,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué patrón estructural fundamental define a un middleware dentro del ciclo de vida de Express?",
    "justificacion": "Un middleware es una función que se interpone entre la petición y el controlador, con acceso a la petición, la respuesta y a `next()`. Ese patrón de cadena es lo que permite componer autenticación, registro y parseo sin tocar cada ruta. Las otras tres describen piezas que no son middlewares. El orden en que se declaran importa: se ejecutan en el orden en que se registraron.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1049,
        "letra": "a",
        "orden": 1,
        "texto": "Una base de datos en memoria para almacenar sesiones.",
        "es_correcta": 0
      },
      {
        "id": 1050,
        "letra": "b",
        "orden": 2,
        "texto": "Un motor de renderizado exclusivo para archivos HTML puros.",
        "es_correcta": 0
      },
      {
        "id": 1051,
        "letra": "c",
        "orden": 3,
        "texto": "Una función que intercepta peticiones antes del controlador.",
        "es_correcta": 1
      },
      {
        "id": 1052,
        "letra": "d",
        "orden": 4,
        "texto": "Un proceso independiente para balanceo de carga.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 264,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué herramienta detiene y reinicia automáticamente un proceso Node.js al detectar cambios en el código?",
    "justificacion": "`nodemon` vigila los archivos y reinicia el proceso al detectar un cambio, que es lo que evita parar y arrancar a mano en cada edición. Las otras tres son reales y hacen otra cosa: `morgan` registra las peticiones HTTP, `express-generator` crea el esqueleto de un proyecto una sola vez, y `yargs` interpreta argumentos de la consola.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1053,
        "letra": "a",
        "orden": 1,
        "texto": "morgan",
        "es_correcta": 0
      },
      {
        "id": 1054,
        "letra": "b",
        "orden": 2,
        "texto": "express-generator",
        "es_correcta": 0
      },
      {
        "id": 1055,
        "letra": "c",
        "orden": 3,
        "texto": "yargs",
        "es_correcta": 0
      },
      {
        "id": 1056,
        "letra": "d",
        "orden": 4,
        "texto": "nodemon",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 265,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué comando NPM instala una dependencia asegurando que no se actualice su versión mayor accidentalmente?",
    "justificacion": "`npm install <paquete> --save-exact` guarda la versión **sin** `^` ni `~`, de modo que quede clavada tal cual. Los otros tres no existen. Conviene precisar el alcance, porque es más de lo que el enunciado dice: `--save-exact` impide **cualquier** actualización automática, no solo la de versión mayor. La que permite correcciones y funciones nuevas pero bloquea los cambios que rompen es `^`, y es la que npm pone por omisión.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1057,
        "letra": "a",
        "orden": 1,
        "texto": "npm install <paquete> --no-update",
        "es_correcta": 0
      },
      {
        "id": 1058,
        "letra": "b",
        "orden": 2,
        "texto": "npm install <paquete> --save-exact",
        "es_correcta": 1
      },
      {
        "id": 1059,
        "letra": "c",
        "orden": 3,
        "texto": "npm add <paquete> --strict",
        "es_correcta": 0
      },
      {
        "id": 1060,
        "letra": "d",
        "orden": 4,
        "texto": "npm update <paquete> --freeze",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 266,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Dónde registra NPM por defecto la metainformación y versiones de los paquetes instalados localmente?",
    "justificacion": "`package.json` es donde npm declara las dependencias del proyecto con su rango de versiones. Los otros tres no cumplen ese papel. Conviene distinguirlo de `package-lock.json`, que es su compañero y guarda la versión **exacta** que se instaló de cada paquete y de sus dependencias: el primero dice qué se acepta, el segundo qué se puso, y los dos se versionan.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1061,
        "letra": "a",
        "orden": 1,
        "texto": "En el archivo config.env de la raíz del proyecto.",
        "es_correcta": 0
      },
      {
        "id": 1062,
        "letra": "b",
        "orden": 2,
        "texto": "En el registro global de variables de entorno del sistema.",
        "es_correcta": 0
      },
      {
        "id": 1063,
        "letra": "c",
        "orden": 3,
        "texto": "En el archivo de configuración package.json del proyecto.",
        "es_correcta": 1
      },
      {
        "id": 1064,
        "letra": "d",
        "orden": 4,
        "texto": "Dentro de la carpeta estática bin/node_modules.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 267,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "En Handlebars, ¿qué sintaxis permite renderizar una variable escapando automáticamente el código HTML?",
    "justificacion": "`{{variable}}` escapa el HTML: si el valor trae `<script>`, se muestra como texto en vez de ejecutarse. La (a), `{{{variable}}}` con tres llaves, lo inserta **sin escapar**, y por eso es la puerta de entrada de los ataques XSS cuando el dato viene de fuera. Las otras dos son de otros motores. Esa diferencia entre dos y tres llaves es de las que más se preguntan, y con razón.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1065,
        "letra": "a",
        "orden": 1,
        "texto": "{{{variable}}}",
        "es_correcta": 0
      },
      {
        "id": 1066,
        "letra": "b",
        "orden": 2,
        "texto": "<% variable %>",
        "es_correcta": 0
      },
      {
        "id": 1067,
        "letra": "c",
        "orden": 3,
        "texto": "{{variable}}",
        "es_correcta": 1
      },
      {
        "id": 1068,
        "letra": "d",
        "orden": 4,
        "texto": "${variable}",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 268,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué ventaja arquitectónica ofrece el uso de \"partials\" al construir vistas con motores de plantillas?",
    "justificacion": "Un partial se escribe una vez y se incluye en todas las vistas que lo necesiten, así que la cabecera o el pie dejan de estar repetidos en diez archivos. La ventaja real no es escribir menos sino **corregir en un solo sitio**: un cambio en el menú se aplica en toda la aplicación. Las otras tres atribuyen a los partials cosas que no hacen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1069,
        "letra": "a",
        "orden": 1,
        "texto": "Minifican automáticamente el código CSS y JS de la vista.",
        "es_correcta": 0
      },
      {
        "id": 1070,
        "letra": "b",
        "orden": 2,
        "texto": "Permiten reutilizar bloques de código en múltiples vistas.",
        "es_correcta": 1
      },
      {
        "id": 1071,
        "letra": "c",
        "orden": 3,
        "texto": "Ejecutan código SQL directamente desde la vista del cliente.",
        "es_correcta": 0
      },
      {
        "id": 1072,
        "letra": "d",
        "orden": 4,
        "texto": "Transforman la aplicación a un framework de Single Page App.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 269,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué elemento de Handlebars permite ejecutar lógica personalizada para procesar datos antes de renderizarlos?",
    "justificacion": "Los helpers son funciones de JavaScript registradas en el motor de plantillas y llamadas desde la vista, para resolver ahí lo que la plantilla no puede sola: formatear, comparar, elegir. Los otros tres son conceptos reales de otras capas — los middlewares y los routers pertenecen a Express, y los partials reutilizan HTML pero no ejecutan lógica.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1073,
        "letra": "a",
        "orden": 1,
        "texto": "Los middlewares",
        "es_correcta": 0
      },
      {
        "id": 1074,
        "letra": "b",
        "orden": 2,
        "texto": "Los helpers",
        "es_correcta": 1
      },
      {
        "id": 1075,
        "letra": "c",
        "orden": 3,
        "texto": "Los routers",
        "es_correcta": 0
      },
      {
        "id": 1076,
        "letra": "d",
        "orden": 4,
        "texto": "Los partials abstractos",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 270,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué módulo nativo de Node.js es indispensable para leer y escribir objetos JSON en archivos del sistema?",
    "justificacion": "`fs` es el módulo nativo que da acceso al sistema de archivos: leer, escribir, comprobar si algo existe, recorrer directorios. Los otros tres también son nativos y tienen otro oficio: `path` arma y descompone rutas sin preocuparse del sistema operativo, `http` levanta servidores y hace peticiones, y `os` informa de la máquina.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1077,
        "letra": "a",
        "orden": 1,
        "texto": "path",
        "es_correcta": 0
      },
      {
        "id": 1078,
        "letra": "b",
        "orden": 2,
        "texto": "http",
        "es_correcta": 0
      },
      {
        "id": 1079,
        "letra": "c",
        "orden": 3,
        "texto": "fs (file system)",
        "es_correcta": 1
      },
      {
        "id": 1080,
        "letra": "d",
        "orden": 4,
        "texto": "os",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 271,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué operación crítica debes realizar antes de guardar un objeto JavaScript en un archivo de texto plano?",
    "justificacion": "Hay que convertirlo a texto con `JSON.stringify()`, porque un archivo de texto guarda caracteres y no objetos. Se le puede pasar un tercer argumento para que salga con sangría y se pueda leer a ojo: `JSON.stringify(obj, null, 2)`. Y conviene recordar lo que descarta por el camino: las funciones y las propiedades cuyo valor es `undefined` no viajan.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1081,
        "letra": "a",
        "orden": 1,
        "texto": "Cifrar el objeto usando el algoritmo bcrypt de forma segura.",
        "es_correcta": 0
      },
      {
        "id": 1082,
        "letra": "b",
        "orden": 2,
        "texto": "Transformarlo a cadena de texto usando JSON.stringify().",
        "es_correcta": 1
      },
      {
        "id": 1083,
        "letra": "c",
        "orden": 3,
        "texto": "Parsear el objeto a formato binario mediante Buffer.alloc().",
        "es_correcta": 0
      },
      {
        "id": 1084,
        "letra": "d",
        "orden": 4,
        "texto": "Inyectar la llave pública del servidor en el propio objeto.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 272,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Al leer un archivo plano con JSON.parse(), ¿qué riesgo principal existe si el archivo está corrupto?",
    "justificacion": "Lanza una excepción, y como es una operación **síncrona**, si nadie la captura el proceso se cae. Por eso `JSON.parse()` casi siempre va dentro de un `try/catch`, sobre todo cuando el archivo lo escribió otro programa o quedó a medias por una caída. Las otras tres describen comportamientos que no ocurren: no borra nada, no devuelve `null` en silencio y no inyecta nada.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1085,
        "letra": "a",
        "orden": 1,
        "texto": "Borra automáticamente el archivo del disco para protegerlo.",
        "es_correcta": 0
      },
      {
        "id": 1086,
        "letra": "b",
        "orden": 2,
        "texto": "Lanza una excepción síncrona que puede detener la app.",
        "es_correcta": 1
      },
      {
        "id": 1087,
        "letra": "c",
        "orden": 3,
        "texto": "Retorna un objeto nulo silenciosamente sin avisar al usuario.",
        "es_correcta": 0
      },
      {
        "id": 1088,
        "letra": "d",
        "orden": 4,
        "texto": "Inyecta código malicioso directo al motor de base de datos.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 273,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué utilidad tiene el paquete \"yargs\" al levantar una aplicación Node.js desde la consola de comandos?",
    "justificacion": "`yargs` toma los argumentos de la consola y los entrega ya interpretados, y permite declarar cuáles son obligatorios, de qué tipo son y qué valor toman por omisión, además de generar la ayuda. Es la diferencia entre leer `process.argv` a mano y tener una interfaz de línea de comandos que avisa cuando el usuario se equivoca. Las otras tres describen cosas que no hace.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1089,
        "letra": "a",
        "orden": 1,
        "texto": "Facilita el paso y la validación de parámetros de entrada.",
        "es_correcta": 1
      },
      {
        "id": 1090,
        "letra": "b",
        "orden": 2,
        "texto": "Inicia un servidor FTP paralelo para recibir archivos.",
        "es_correcta": 0
      },
      {
        "id": 1091,
        "letra": "c",
        "orden": 3,
        "texto": "Limpia los mensajes de error ilegibles de console.log.",
        "es_correcta": 0
      },
      {
        "id": 1092,
        "letra": "d",
        "orden": 4,
        "texto": "Permite compilar el código de JavaScript a binario nativo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 274,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "¿Qué técnica ayuda a diferenciar niveles de error en la salida de consola al depurar una app Node.js?",
    "justificacion": "Dar color y formato a la salida permite distinguir de un vistazo un aviso de un error en medio de muchas líneas. Hay bibliotecas dedicadas a eso, y también registradores que ya traen niveles —`info`, `warn`, `error`— y que además permiten apagar los mensajes de depuración en producción sin borrarlos del código. Las otras tres opciones no ayudan a depurar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1093,
        "letra": "a",
        "orden": 1,
        "texto": "Exportar todo el log como un archivo PDF firmado digitalmente.",
        "es_correcta": 0
      },
      {
        "id": 1094,
        "letra": "b",
        "orden": 2,
        "texto": "Utilizar colores y formateo con librerías externas.",
        "es_correcta": 1
      },
      {
        "id": 1095,
        "letra": "c",
        "orden": 3,
        "texto": "Escribir siempre los mensajes de error en formato XML nativo.",
        "es_correcta": 0
      },
      {
        "id": 1096,
        "letra": "d",
        "orden": 4,
        "texto": "Evitar console.log y usar alertas nativas del sistema.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 275,
    "modulo": 6,
    "modulo_titulo": "Desarrollo de Aplicaciones Web Node Express",
    "modulo_icono": "dns",
    "enunciado": "Al depurar código asíncrono, ¿por qué los errores en un callback pueden no detener la app principal?",
    "justificacion": "Porque el callback se ejecuta **después**, en otro turno del bucle de eventos, cuando la función que lo registró ya terminó. Por eso un `try/catch` puesto alrededor de la llamada asíncrona no lo alcanza: cuando el error ocurre, ese bloque hace rato que se cerró. Conviene reconciliarlo con lo que dice la pregunta sobre errores no capturados: si el error se **lanza** y nadie lo atiende, el proceso igual se cae; lo que puede pasar inadvertido es el error que llega como primer argumento del callback —el `err` del patrón error-first— y que el código sencillamente no mira.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1097,
        "letra": "a",
        "orden": 1,
        "texto": "Porque Express auto-reinicia la aplicación inmediatamente.",
        "es_correcta": 0
      },
      {
        "id": 1098,
        "letra": "b",
        "orden": 2,
        "texto": "Porque Node ignora cualquier error fuera del archivo index.js.",
        "es_correcta": 0
      },
      {
        "id": 1099,
        "letra": "c",
        "orden": 3,
        "texto": "Porque el error ocurre en un contexto asíncrono independiente.",
        "es_correcta": 1
      },
      {
        "id": 1100,
        "letra": "d",
        "orden": 4,
        "texto": "Porque NPM oculta los errores de librerías de terceros.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 276,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué ventaja principal ofrece implementar un \"pool\" de conexiones en PostgreSQL con Node.js?",
    "justificacion": "Abrir una conexión a PostgreSQL es caro: hay autenticación, negociación y reserva de recursos del lado del servidor. Un pool mantiene un puñado abiertas y las va prestando, así que cada consulta se ahorra ese costo. Las otras tres prometen cosas que el pool no hace: no cifra —de eso se encarga TLS—, no bloquea nada, y no duplica datos en memoria.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1101,
        "letra": "a",
        "orden": 1,
        "texto": "Encripta automáticamente todos los datos en tránsito hacia la DB.",
        "es_correcta": 0
      },
      {
        "id": 1102,
        "letra": "b",
        "orden": 2,
        "texto": "Reutiliza conexiones activas evitando el costo de crear nuevas.",
        "es_correcta": 1
      },
      {
        "id": 1103,
        "letra": "c",
        "orden": 3,
        "texto": "Ejecuta consultas SQL en un solo hilo bloqueando las demás.",
        "es_correcta": 0
      },
      {
        "id": 1104,
        "letra": "d",
        "orden": 4,
        "texto": "Duplica los datos en memoria RAM para lecturas más veloces.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 277,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al usar el paquete `pg`, ¿qué clase gestiona múltiples clientes conectados concurrentemente?",
    "justificacion": "`Pool` es la clase de `pg` que administra el conjunto de conexiones y las reparte entre quienes las piden. Su hermana es `Client`, que representa **una** conexión y se usa cuando de verdad hace falta una sola, como en un guion suelto. Los otros tres nombres no existen. En un servidor web casi siempre se quiere `Pool`, y creado una vez al arrancar, no por petición.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1105,
        "letra": "a",
        "orden": 1,
        "texto": "ClientManager",
        "es_correcta": 0
      },
      {
        "id": 1106,
        "letra": "b",
        "orden": 2,
        "texto": "PgConnection",
        "es_correcta": 0
      },
      {
        "id": 1107,
        "letra": "c",
        "orden": 3,
        "texto": "Pool",
        "es_correcta": 1
      },
      {
        "id": 1108,
        "letra": "d",
        "orden": 4,
        "texto": "ConnectionCluster",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 278,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué sucede si el \"pool\" de PostgreSQL alcanza su límite máximo de conexiones concurrentes?",
    "justificacion": "Cuando todas las conexiones están ocupadas, las peticiones nuevas **esperan en cola** hasta que alguna se libere. No falla ni descarta: espera. Eso tiene una consecuencia práctica que conviene entender — si alguien no devuelve un cliente, la cola crece y la aplicación se va poniendo lenta antes de dar ningún error, que es el síntoma más difícil de diagnosticar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1109,
        "letra": "a",
        "orden": 1,
        "texto": "Detiene el servidor Node arrojando un error fatal.",
        "es_correcta": 0
      },
      {
        "id": 1110,
        "letra": "b",
        "orden": 2,
        "texto": "Elimina las conexiones más antiguas sin previo aviso.",
        "es_correcta": 0
      },
      {
        "id": 1111,
        "letra": "c",
        "orden": 3,
        "texto": "Pone en cola las nuevas peticiones hasta que una se libere.",
        "es_correcta": 1
      },
      {
        "id": 1112,
        "letra": "d",
        "orden": 4,
        "texto": "Escala dinámicamente agregando nuevos procesos en el servidor.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 279,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En el paquete `pg`, ¿qué método libera explícitamente un cliente de vuelta al pool tras su uso?",
    "justificacion": "`client.release()` devuelve el cliente al pool para que otro lo use. No cierra la conexión: la deja disponible, que es justamente el sentido del pool. La (c), `client.close()`, no existe en esa forma, y `disconnect()` tampoco. Lo habitual es llamarlo en un bloque `finally`, para que se ejecute tanto si la consulta salió bien como si lanzó.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1113,
        "letra": "a",
        "orden": 1,
        "texto": "client.disconnect()",
        "es_correcta": 0
      },
      {
        "id": 1114,
        "letra": "b",
        "orden": 2,
        "texto": "client.release()",
        "es_correcta": 1
      },
      {
        "id": 1115,
        "letra": "c",
        "orden": 3,
        "texto": "client.close()",
        "es_correcta": 0
      },
      {
        "id": 1116,
        "letra": "d",
        "orden": 4,
        "texto": "pool.return(client)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 280,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Cuál es el riesgo de no liberar un cliente devuelto por `pool.connect()` tras usarlo?",
    "justificacion": "El cliente no devuelto queda ocupado para siempre, y repetido unas cuantas veces agota el pool: las peticiones nuevas se quedan esperando en una cola que ya no avanza. La aplicación no se cae — **se cuelga**, que es peor de diagnosticar porque no hay error que leer. Por eso el `release()` va en un `finally` y no al final del camino feliz.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1117,
        "letra": "a",
        "orden": 1,
        "texto": "La base de datos elimina el registro recién insertado.",
        "es_correcta": 0
      },
      {
        "id": 1118,
        "letra": "b",
        "orden": 2,
        "texto": "Agotamiento del pool, provocando bloqueo en nuevas peticiones.",
        "es_correcta": 1
      },
      {
        "id": 1119,
        "letra": "c",
        "orden": 3,
        "texto": "Se genera una brecha de seguridad exponiendo las credenciales.",
        "es_correcta": 0
      },
      {
        "id": 1120,
        "letra": "d",
        "orden": 4,
        "texto": "El servidor Node se reinicia de manera automática e iterativa.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 281,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al configurar un Pool, ¿qué parámetro define el tiempo máximo de inactividad de una conexión?",
    "justificacion": "`idleTimeoutMillis` dice cuánto puede estar una conexión sin usarse antes de que el pool la cierre, para no mantener abiertas conexiones que nadie ocupa. Los otros tres nombres no existen en `pg`. Se suele configurar junto a `max` —cuántas conexiones como mucho— y `connectionTimeoutMillis`, que es cuánto espera quien pide una antes de rendirse.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1121,
        "letra": "a",
        "orden": 1,
        "texto": "maxIdleTime",
        "es_correcta": 0
      },
      {
        "id": 1122,
        "letra": "b",
        "orden": 2,
        "texto": "idleTimeoutMillis",
        "es_correcta": 1
      },
      {
        "id": 1123,
        "letra": "c",
        "orden": 3,
        "texto": "connectionTimeout",
        "es_correcta": 0
      },
      {
        "id": 1124,
        "letra": "d",
        "orden": 4,
        "texto": "keepAliveLimit",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 282,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué técnica nativa en `pg` previene eficazmente ataques de inyección SQL (SQL Injection)?",
    "justificacion": "Las consultas parametrizadas mandan la sentencia y los valores **por separado**, así que el motor nunca interpreta el dato como parte del SQL. Eso corta la inyección de raíz, y no por filtrar lo que llega sino porque el valor jamás llega a ser código. Las otras tres son medidas de otra capa o directamente falsas: validar con expresiones regulares es una carrera que se pierde.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1125,
        "letra": "a",
        "orden": 1,
        "texto": "Concatenación estricta de strings validada con Regex.",
        "es_correcta": 0
      },
      {
        "id": 1126,
        "letra": "b",
        "orden": 2,
        "texto": "Configuración del firewall en el puerto 5432.",
        "es_correcta": 0
      },
      {
        "id": 1127,
        "letra": "c",
        "orden": 3,
        "texto": "Uso de consultas parametrizadas (Prepared Statements).",
        "es_correcta": 1
      },
      {
        "id": 1128,
        "letra": "d",
        "orden": 4,
        "texto": "Bloqueo de direcciones IP maliciosas desde el cliente.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 283,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En una consulta parametrizada con `pg`, ¿cómo se referencian los valores dinámicos en el texto?",
    "justificacion": "PostgreSQL usa marcadores posicionales numerados: `SELECT * FROM alumno WHERE id = $1`. La (a) describe la convención de MySQL y SQLite, y la (d) la de Oracle y algunos ORM — son reales pero de otros motores, y por eso son buenos distractores. La (b) es justamente lo que **no** hay que hacer: interpolar es concatenar con otro nombre.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1129,
        "letra": "a",
        "orden": 1,
        "texto": "Usando signos de interrogación (?, ?, ?).",
        "es_correcta": 0
      },
      {
        "id": 1130,
        "letra": "b",
        "orden": 2,
        "texto": "Empleando interpolación directa (${var}).",
        "es_correcta": 0
      },
      {
        "id": 1131,
        "letra": "c",
        "orden": 3,
        "texto": "Mediante marcadores posicionales indexados ($1, $2, $3).",
        "es_correcta": 1
      },
      {
        "id": 1132,
        "letra": "d",
        "orden": 4,
        "texto": "Agregando el prefijo de dos puntos (:id, :name).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 284,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué objeto JavaScript se debe pasar como argumento para ejecutar una consulta parametrizada?",
    "justificacion": "Los valores van en un arreglo, en el mismo orden que los marcadores: `client.query(texto, [id, nombre])`, donde `$1` toma el primer elemento y `$2` el segundo. Por eso importa el orden y no el nombre. Si la cantidad no coincide con los marcadores, PostgreSQL rechaza la consulta antes de ejecutarla, que es la pregunta del `DELETE` sin parámetro.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1133,
        "letra": "a",
        "orden": 1,
        "texto": "Un arreglo conteniendo los valores en orden exacto.",
        "es_correcta": 1
      },
      {
        "id": 1134,
        "letra": "b",
        "orden": 2,
        "texto": "Un string codificado en formato base64 nativo.",
        "es_correcta": 0
      },
      {
        "id": 1135,
        "letra": "c",
        "orden": 3,
        "texto": "Un buffer binario de memoria compartida estricta.",
        "es_correcta": 0
      },
      {
        "id": 1136,
        "letra": "d",
        "orden": 4,
        "texto": "Un objeto de tipo Map mapeando cada índice con su llave.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 285,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Cuál es el propósito principal de usar cursores al consultar la base de datos PostgreSQL?",
    "justificacion": "Un cursor permite ir trayendo el resultado **por lotes** en vez de cargarlo entero en memoria. Con una tabla de millones de filas, `client.query()` intentaría materializar todo y el proceso se quedaría sin memoria. Las otras tres describen cosas que el cursor no hace: no cifra, no agrupa en una transacción y no convierte a JSON.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1137,
        "letra": "a",
        "orden": 1,
        "texto": "Encriptar el flujo de datos entre el servidor y el cliente.",
        "es_correcta": 0
      },
      {
        "id": 1138,
        "letra": "b",
        "orden": 2,
        "texto": "Procesar grandes volúmenes de datos por lotes sin saturar la RAM.",
        "es_correcta": 1
      },
      {
        "id": 1139,
        "letra": "c",
        "orden": 3,
        "texto": "Modificar registros múltiples en una única transacción atómica.",
        "es_correcta": 0
      },
      {
        "id": 1140,
        "letra": "d",
        "orden": 4,
        "texto": "Transformar resultados a formato JSON nativo directamente.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 286,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Usando el paquete `pg-cursor`, ¿qué método extrae un bloque específico de filas del cursor?",
    "justificacion": "`cursor.read(cantidad, callback)` pide el siguiente bloque de filas y las entrega al callback; cuando ya no quedan, devuelve un arreglo vacío, y ésa es la señal de que se terminó. Los otros tres nombres no existen. El patrón habitual es leer en bucle hasta ese arreglo vacío, procesando cada lote y soltándolo antes de pedir el siguiente.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1141,
        "letra": "a",
        "orden": 1,
        "texto": "cursor.read(cantidad, callback)",
        "es_correcta": 1
      },
      {
        "id": 1142,
        "letra": "b",
        "orden": 2,
        "texto": "cursor.fetch(cantidad)",
        "es_correcta": 0
      },
      {
        "id": 1143,
        "letra": "c",
        "orden": 3,
        "texto": "cursor.getNext(lote)",
        "es_correcta": 0
      },
      {
        "id": 1144,
        "letra": "d",
        "orden": 4,
        "texto": "cursor.pull(cantidad, callback)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 287,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué propiedad del objeto resultado de `query()` contiene las filas retornadas por PostgreSQL?",
    "justificacion": "`result.rows` es el arreglo con las filas devueltas, cada una como un objeto cuyas claves son los nombres de las columnas. Los otros tres nombres no existen en `pg`. Junto a él viajan `result.rowCount` —cuántas filas— y `result.fields`, con la descripción de las columnas. Con un `SELECT` que no encuentra nada, `rows` es un arreglo **vacío**, no `null`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1145,
        "letra": "a",
        "orden": 1,
        "texto": "result.data",
        "es_correcta": 0
      },
      {
        "id": 1146,
        "letra": "b",
        "orden": 2,
        "texto": "result.records",
        "es_correcta": 0
      },
      {
        "id": 1147,
        "letra": "c",
        "orden": 3,
        "texto": "result.rows",
        "es_correcta": 1
      },
      {
        "id": 1148,
        "letra": "d",
        "orden": 4,
        "texto": "result.dataset",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 288,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Si usas `async/await` para una consulta SQL, ¿cómo manejas correctamente los fallos del motor?",
    "justificacion": "Con `async/await`, una consulta que falla lanza como cualquier excepción, así que se atrapa con `try/catch`. Es lo mismo que se vio en el módulo anterior y aquí se vuelve crítico: sin capturar, el error se lleva por delante el `release()` del cliente y la transacción abierta, si la hay. Por eso el patrón completo lleva `try`, `catch` con `ROLLBACK` y `finally` con `release()`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1149,
        "letra": "a",
        "orden": 1,
        "texto": "Pasando un booleano `false` como tercer parámetro.",
        "es_correcta": 0
      },
      {
        "id": 1150,
        "letra": "b",
        "orden": 2,
        "texto": "Envolviendo la llamada en un bloque try/catch.",
        "es_correcta": 1
      },
      {
        "id": 1151,
        "letra": "c",
        "orden": 3,
        "texto": "Usando el evento `.on('fail')` encadenado a la promesa.",
        "es_correcta": 0
      },
      {
        "id": 1152,
        "letra": "d",
        "orden": 4,
        "texto": "Validando si el objeto de respuesta es nulo al final.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 289,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En mitigación de inyección SQL, ¿por qué es inseguro armar sentencias concatenando variables?",
    "justificacion": "Porque el valor que llega del usuario pasa a formar parte del texto de la sentencia, y si contiene SQL, ese SQL se ejecuta. Con eso se pueden leer tablas ajenas, borrar datos o saltarse una autenticación. Las otras tres inventan límites técnicos que no existen. La solución no es escapar comillas a mano: es no concatenar, y usar parámetros.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1153,
        "letra": "a",
        "orden": 1,
        "texto": "Porque el motor PostgreSQL rechaza strings mayores a 255 bytes.",
        "es_correcta": 0
      },
      {
        "id": 1154,
        "letra": "b",
        "orden": 2,
        "texto": "Porque bloquea los hilos del pool al evaluar sintaxis compleja.",
        "es_correcta": 0
      },
      {
        "id": 1155,
        "letra": "c",
        "orden": 3,
        "texto": "Porque rompe la conexión al transformar datos a binario.",
        "es_correcta": 0
      },
      {
        "id": 1156,
        "letra": "d",
        "orden": 4,
        "texto": "Porque permite introducir e inyectar código SQL malicioso.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 290,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al realizar un INSERT con `pg`, ¿qué cláusula SQL adicional devuelve el registro recién creado?",
    "justificacion": "`RETURNING *` hace que el `INSERT` devuelva la fila tal como quedó, incluidos los valores que puso la base —el `id` de la secuencia, las columnas con `DEFAULT`, la marca de tiempo—. Se puede pedir todo con `*` o solo algunas columnas: `RETURNING id`. Las otras tres son de otros motores o no existen: `OUTPUT INSERTED` es de SQL Server.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1157,
        "letra": "a",
        "orden": 1,
        "texto": "WITH NEW DATA",
        "es_correcta": 0
      },
      {
        "id": 1158,
        "letra": "b",
        "orden": 2,
        "texto": "RETURNING *",
        "es_correcta": 1
      },
      {
        "id": 1159,
        "letra": "c",
        "orden": 3,
        "texto": "OUTPUT INSERTED",
        "es_correcta": 0
      },
      {
        "id": 1160,
        "letra": "d",
        "orden": 4,
        "texto": "YIELD ALL",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 291,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué propiedad del resultado de una consulta indica cuántos registros fueron alterados por DML?",
    "justificacion": "`result.rowCount` dice cuántas filas afectó la sentencia, y es la forma de saber si un `UPDATE` o un `DELETE` de verdad tocó algo: un `rowCount` de cero significa que la condición no encontró nada, que no es un error pero casi siempre es una sorpresa. Los otros tres nombres pertenecen a otras bibliotecas o no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1161,
        "letra": "a",
        "orden": 1,
        "texto": "result.affectedRows",
        "es_correcta": 0
      },
      {
        "id": 1162,
        "letra": "b",
        "orden": 2,
        "texto": "result.rowCount",
        "es_correcta": 1
      },
      {
        "id": 1163,
        "letra": "c",
        "orden": 3,
        "texto": "result.modified",
        "es_correcta": 0
      },
      {
        "id": 1164,
        "letra": "d",
        "orden": 4,
        "texto": "result.changes",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 292,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al actualizar datos con UPDATE, ¿por qué es imperativo capturar y procesar errores en Node?",
    "justificacion": "Un error que nadie atiende deja las cosas a medio camino: si la sentencia iba dentro de una transacción, ésa queda abierta, y una transacción abierta **mantiene sus bloqueos** hasta que alguien la cierre. Sumado a un cliente que tampoco se devuelve al pool, el resultado es una tabla bloqueada para los demás sin ningún error a la vista. Las otras tres describen mecanismos que no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1165,
        "letra": "a",
        "orden": 1,
        "texto": "Para evitar bloqueos permanentes de tablas por fallos silenciados.",
        "es_correcta": 1
      },
      {
        "id": 1166,
        "letra": "b",
        "orden": 2,
        "texto": "Para compilar nuevamente la consulta en el motor de Chrome.",
        "es_correcta": 0
      },
      {
        "id": 1167,
        "letra": "c",
        "orden": 3,
        "texto": "Para reiniciar el paquete pg en caso de sintaxis incorrecta.",
        "es_correcta": 0
      },
      {
        "id": 1168,
        "letra": "d",
        "orden": 4,
        "texto": "Para impedir que las claves primarias cambien su valor nativo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 293,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Si envías un DELETE parametrizado sin valor en el parámetro ($1), ¿qué ocurre?",
    "justificacion": "PostgreSQL rechaza la consulta antes de ejecutarla: el número de valores tiene que coincidir con el de marcadores, y si falta uno responde que se le entregaron menos parámetros de los que la sentencia requiere. **No asume nada ni ejecuta a medias**, y eso es una protección real — la (a) describe la catástrofe que ocurriría si el motor decidiera ignorar el filtro.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1169,
        "letra": "a",
        "orden": 1,
        "texto": "Se eliminan todos los registros de la tabla inmediatamente.",
        "es_correcta": 0
      },
      {
        "id": 1170,
        "letra": "b",
        "orden": 2,
        "texto": "Falla por parámetro faltante y rechaza la ejecución.",
        "es_correcta": 1
      },
      {
        "id": 1171,
        "letra": "c",
        "orden": 3,
        "texto": "La tabla se bloquea hasta reiniciar el pool de conexiones.",
        "es_correcta": 0
      },
      {
        "id": 1172,
        "letra": "d",
        "orden": 4,
        "texto": "El motor asume el valor nulo e ignora la sentencia DELETE.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 294,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Cuál es el riesgo de ejecutar una instrucción UPDATE o DELETE sin una cláusula WHERE?",
    "justificacion": "Sin `WHERE`, la sentencia se aplica a **todas** las filas de la tabla: un `UPDATE` las cambia todas y un `DELETE` las borra todas. No hay error ni aviso, porque es una sentencia perfectamente válida. La costumbre que salva es escribirla primero como `SELECT` con el mismo `WHERE`, mirar cuántas filas devuelve, y recién entonces cambiar el verbo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1173,
        "letra": "a",
        "orden": 1,
        "texto": "Crea duplicados exactos de cada registro de la tabla afectada.",
        "es_correcta": 0
      },
      {
        "id": 1174,
        "letra": "b",
        "orden": 2,
        "texto": "Alteración o eliminación accidental de todos los registros.",
        "es_correcta": 1
      },
      {
        "id": 1175,
        "letra": "c",
        "orden": 3,
        "texto": "Falla de sintaxis inmediata que detiene la base de datos.",
        "es_correcta": 0
      },
      {
        "id": 1176,
        "letra": "d",
        "orden": 4,
        "texto": "Generación de un error de memoria por límite de cursores.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 295,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al usar transacciones, si un INSERT falla en medio del proceso, ¿qué se debe hacer en el catch?",
    "justificacion": "Ejecutar `ROLLBACK`, que deshace todo lo hecho desde el `BEGIN` y deja la base como estaba. Es la razón de ser de la transacción: que un fallo a mitad no deje la mitad aplicada. La (a) no existe como operación —no hay confirmaciones parciales— y las otras dos empeoran las cosas. Después del `ROLLBACK` viene el `release()` del cliente, en el `finally`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1177,
        "letra": "a",
        "orden": 1,
        "texto": "Realizar un COMMIT parcial.",
        "es_correcta": 0
      },
      {
        "id": 1178,
        "letra": "b",
        "orden": 2,
        "texto": "Ignorar el error y reintentar.",
        "es_correcta": 0
      },
      {
        "id": 1179,
        "letra": "c",
        "orden": 3,
        "texto": "Ejecutar la sentencia ROLLBACK.",
        "es_correcta": 1
      },
      {
        "id": 1180,
        "letra": "d",
        "orden": 4,
        "texto": "Cerrar la base de datos completa.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 296,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué comando SQL inicia explícitamente un bloque de control transaccional en PostgreSQL?",
    "justificacion": "`BEGIN` abre el bloque transaccional en PostgreSQL, y desde ahí nada es definitivo hasta el `COMMIT`. La (a), `SET TRANSACTION`, existe de verdad y por eso es el distractor que separa: **no abre nada**, sino que fija las características —nivel de aislamiento, solo lectura— de la transacción en curso. `INIT` y `OPEN` no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1181,
        "letra": "a",
        "orden": 1,
        "texto": "SET TRANSACTION",
        "es_correcta": 0
      },
      {
        "id": 1182,
        "letra": "b",
        "orden": 2,
        "texto": "BEGIN",
        "es_correcta": 1
      },
      {
        "id": 1183,
        "letra": "c",
        "orden": 3,
        "texto": "INIT",
        "es_correcta": 0
      },
      {
        "id": 1184,
        "letra": "d",
        "orden": 4,
        "texto": "OPEN",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 297,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En Node, ¿por qué debes usar el mismo cliente del pool durante toda la transacción?",
    "justificacion": "Porque una transacción vive en **la sesión** de una conexión concreta: el `BEGIN` la abre en ese cliente, y un `COMMIT` enviado por otro cliente del pool no tiene nada que confirmar. Por eso una transacción se hace con `pool.connect()` para tomar un cliente y usarlo de principio a fin, en vez de con `pool.query()`, que puede darte una conexión distinta cada vez.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1185,
        "letra": "a",
        "orden": 1,
        "texto": "Para no reventar la pila de memoria del Event Loop.",
        "es_correcta": 0
      },
      {
        "id": 1186,
        "letra": "b",
        "orden": 2,
        "texto": "Porque BEGIN, COMMIT y ROLLBACK dependen de la sesión activa.",
        "es_correcta": 1
      },
      {
        "id": 1187,
        "letra": "c",
        "orden": 3,
        "texto": "Porque los parámetros solo persisten en clientes asíncronos.",
        "es_correcta": 0
      },
      {
        "id": 1188,
        "letra": "d",
        "orden": 4,
        "texto": "Para mantener el cursor de lectura en la primera fila.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 298,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué comando confirma y persiste de forma definitiva los cambios de una transacción activa?",
    "justificacion": "`COMMIT` cierra la transacción y hace permanentes sus cambios; hasta ese momento un `ROLLBACK` los desharía. Las otras tres existen y ninguna confirma nada, y la (b) es la que separa: `RELEASE SAVEPOINT` **elimina un punto de guardado y deja la transacción abierta**, así que quien crea que «liberar» un savepoint finaliza algo se lleva la pregunta mal. `SAVEPOINT` hace lo contrario —marca el punto— y `FLUSH` no es SQL. Conviene recordar que un `RELEASE SAVEPOINT` tampoco deshace lo hecho después del punto: eso sería `ROLLBACK TO SAVEPOINT`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1189,
        "letra": "a",
        "orden": 1,
        "texto": "SAVEPOINT",
        "es_correcta": 0
      },
      {
        "id": 1190,
        "letra": "b",
        "orden": 2,
        "texto": "RELEASE SAVEPOINT",
        "es_correcta": 0
      },
      {
        "id": 1191,
        "letra": "c",
        "orden": 3,
        "texto": "FLUSH",
        "es_correcta": 0
      },
      {
        "id": 1192,
        "letra": "d",
        "orden": 4,
        "texto": "COMMIT",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 299,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué operación anula todos los cambios realizados desde el comando BEGIN al detectar un error?",
    "justificacion": "`ROLLBACK` deshace todo lo hecho desde el `BEGIN` y devuelve la base al estado anterior, sin importar cuántas sentencias hubiera en medio. `TRUNCATE` es lo contrario de deshacer: vacía una tabla. `UNDO ALL` y `REVERT` no existen en SQL. Si hay `SAVEPOINT` declarados, se puede volver a uno de ellos en vez de deshacer la transacción entera.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1193,
        "letra": "a",
        "orden": 1,
        "texto": "TRUNCATE",
        "es_correcta": 0
      },
      {
        "id": 1194,
        "letra": "b",
        "orden": 2,
        "texto": "ROLLBACK",
        "es_correcta": 1
      },
      {
        "id": 1195,
        "letra": "c",
        "orden": 3,
        "texto": "UNDO ALL",
        "es_correcta": 0
      },
      {
        "id": 1196,
        "letra": "d",
        "orden": 4,
        "texto": "REVERT",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 300,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al culminar un COMMIT o ROLLBACK usando un cliente del pool, ¿qué acción final es obligatoria?",
    "justificacion": "Liberar el cliente con `release()`. Confirmar o deshacer cierra la **transacción**, pero el cliente sigue prestado hasta que se devuelva, y un cliente que no vuelve es una conexión menos para todos los demás. Por eso el `release()` va en el `finally`: se ejecuta tanto tras el `COMMIT` como tras el `ROLLBACK`, y también si algo lanzó por el camino.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1197,
        "letra": "a",
        "orden": 1,
        "texto": "Destruir el proceso principal de Node con process.exit().",
        "es_correcta": 0
      },
      {
        "id": 1198,
        "letra": "b",
        "orden": 2,
        "texto": "Liberar el cliente usando el método release() correspondiente.",
        "es_correcta": 1
      },
      {
        "id": 1199,
        "letra": "c",
        "orden": 3,
        "texto": "Reiniciar el servidor de PostgreSQL para liberar los bloqueos.",
        "es_correcta": 0
      },
      {
        "id": 1200,
        "letra": "d",
        "orden": 4,
        "texto": "Limpiar manualmente la caché de DNS del servidor.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 301,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué es el modo \"autocommit\" en los motores de base de datos relacionales?",
    "justificacion": "Con autocommit, cada sentencia que termina bien se confirma sola, como si llevara su propio `COMMIT` detrás. La consecuencia es la que importa: **no queda nada que deshacer**, porque no hay transacción abierta. Por eso, para agrupar varias sentencias en una unidad, hay que abrirla explícitamente con `BEGIN`. Las otras tres describen comportamientos que ningún motor tiene.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1201,
        "letra": "a",
        "orden": 1,
        "texto": "Confirma cada sentencia SQL individual automáticamente si es exitosa.",
        "es_correcta": 1
      },
      {
        "id": 1202,
        "letra": "b",
        "orden": 2,
        "texto": "Revierte automáticamente si detecta cualquier uso intensivo de CPU.",
        "es_correcta": 0
      },
      {
        "id": 1203,
        "letra": "c",
        "orden": 3,
        "texto": "Bloquea tablas enteras hasta que un administrador confirme.",
        "es_correcta": 0
      },
      {
        "id": 1204,
        "letra": "d",
        "orden": 4,
        "texto": "Genera un volcado de memoria antes de cada inserción riesgosa.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 302,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué problema principal busca resolver un mapeador objeto-relacional (ORM) como Sequelize?",
    "justificacion": "Un ORM traduce entre dos mundos que no encajan solos: las tablas y filas de la base, y los objetos y clases del código. Con él se consultan y guardan datos escribiendo JavaScript en vez de SQL. Lo que **no** hace es eliminar la base ni ahorrar red — y conviene saber que el SQL sigue existiendo debajo, así que entenderlo sigue siendo necesario cuando algo va lento.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1205,
        "letra": "a",
        "orden": 1,
        "texto": "La traducción de interfaces gráficas a comandos binarios.",
        "es_correcta": 0
      },
      {
        "id": 1206,
        "letra": "b",
        "orden": 2,
        "texto": "Eliminar la necesidad de usar bases de datos físicas.",
        "es_correcta": 0
      },
      {
        "id": 1207,
        "letra": "c",
        "orden": 3,
        "texto": "Vincular estructuras lógicas de la DB con objetos en el código.",
        "es_correcta": 1
      },
      {
        "id": 1208,
        "letra": "d",
        "orden": 4,
        "texto": "Acelerar el ancho de banda del servidor consumiendo menos red.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 303,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En la arquitectura de Sequelize, ¿qué representa el concepto lógico de \"Modelo\"?",
    "justificacion": "Un modelo es la clase que representa una tabla: define sus columnas y sus tipos, y ofrece los métodos para consultarla y modificarla. Es la pieza central de Sequelize — todo lo demás cuelga de ahí. Las otras tres pertenecen a otras capas de la aplicación: rutas, middlewares y vistas, que no tienen nada que ver con el mapeo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1209,
        "letra": "a",
        "orden": 1,
        "texto": "Un controlador de rutas API HTTP.",
        "es_correcta": 0
      },
      {
        "id": 1210,
        "letra": "b",
        "orden": 2,
        "texto": "Una clase JavaScript que mapea y abstrae una tabla de la DB.",
        "es_correcta": 1
      },
      {
        "id": 1211,
        "letra": "c",
        "orden": 3,
        "texto": "Un middleware para procesar cuerpos JSON.",
        "es_correcta": 0
      },
      {
        "id": 1212,
        "letra": "d",
        "orden": 4,
        "texto": "Una vista renderizada en el motor Handlebars.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 304,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En Sequelize, ¿qué método de modelo se utiliza convencionalmente para insertar un nuevo registro?",
    "justificacion": "`Model.create({...})` construye la instancia y la guarda en un solo paso, devolviendo el registro ya creado con el `id` que asignó la base. La (b), `Model.save()`, no existe como método de la clase — `save()` es de la **instancia**, y se usa junto a `build()` cuando se quiere crear en memoria primero y guardar después. Los otros dos no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1213,
        "letra": "a",
        "orden": 1,
        "texto": "Model.insert()",
        "es_correcta": 0
      },
      {
        "id": 1214,
        "letra": "b",
        "orden": 2,
        "texto": "Model.save()",
        "es_correcta": 0
      },
      {
        "id": 1215,
        "letra": "c",
        "orden": 3,
        "texto": "Model.create()",
        "es_correcta": 1
      },
      {
        "id": 1216,
        "letra": "d",
        "orden": 4,
        "texto": "Model.buildRecord()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 305,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Para recuperar múltiples registros desde la base de datos con Sequelize, ¿qué método se utiliza?",
    "justificacion": "`Model.findAll()` devuelve un arreglo con todos los registros que cumplan las condiciones que se le pasen, y sin condiciones devuelve la tabla entera. Los otros tres nombres no existen. Sus hermanos habituales son `findOne()`, que devuelve uno solo o `null`, y `findByPk()`, que busca por clave primaria — y conviene distinguirlos porque devuelven cosas distintas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1217,
        "letra": "a",
        "orden": 1,
        "texto": "Model.selectAll()",
        "es_correcta": 0
      },
      {
        "id": 1218,
        "letra": "b",
        "orden": 2,
        "texto": "Model.findAll()",
        "es_correcta": 1
      },
      {
        "id": 1219,
        "letra": "c",
        "orden": 3,
        "texto": "Model.fetchMany()",
        "es_correcta": 0
      },
      {
        "id": 1220,
        "letra": "d",
        "orden": 4,
        "texto": "Model.getRecords()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 306,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué método en Sequelize se emplea para realizar la actualización (UPDATE) de registros?",
    "justificacion": "`Model.update({campos}, {where})` actualiza los registros que cumplan la condición. Los otros tres nombres no existen. Ojo con el detalle que sorprende: lleva **dos** objetos, el de los valores nuevos y el de las condiciones, y olvidar el segundo actualiza toda la tabla — es el mismo peligro del `UPDATE` sin `WHERE`, con otra sintaxis.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1221,
        "letra": "a",
        "orden": 1,
        "texto": "Model.modify()",
        "es_correcta": 0
      },
      {
        "id": 1222,
        "letra": "b",
        "orden": 2,
        "texto": "Model.put()",
        "es_correcta": 0
      },
      {
        "id": 1223,
        "letra": "c",
        "orden": 3,
        "texto": "Model.update()",
        "es_correcta": 1
      },
      {
        "id": 1224,
        "letra": "d",
        "orden": 4,
        "texto": "Model.change()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 307,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué instrucción en Sequelize elimina (DELETE) físicamente un registro basado en condiciones?",
    "justificacion": "`Model.destroy({where})` borra los registros que cumplan la condición. El nombre desconcierta al principio, porque no se parece a `DELETE` ni a `remove`, y por eso los otros tres distractores son tentadores; ninguno existe. `Model.drop()` tampoco es eso: `drop` en Sequelize elimina **la tabla**, que es otra cosa y bastante más grave.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1225,
        "letra": "a",
        "orden": 1,
        "texto": "Model.destroy()",
        "es_correcta": 1
      },
      {
        "id": 1226,
        "letra": "b",
        "orden": 2,
        "texto": "Model.delete()",
        "es_correcta": 0
      },
      {
        "id": 1227,
        "letra": "c",
        "orden": 3,
        "texto": "Model.remove()",
        "es_correcta": 0
      },
      {
        "id": 1228,
        "letra": "d",
        "orden": 4,
        "texto": "Model.drop()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 308,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al definir un modelo en Sequelize, ¿qué propiedad define el tipo de dato nativo de una columna?",
    "justificacion": "Cada columna se declara con un objeto que lleva `type`, y el tipo sale de `DataTypes`: `DataTypes.STRING`, `DataTypes.INTEGER`, `DataTypes.DATE`. Esa capa existe para que el mismo modelo sirva con motores distintos, que traducen cada tipo al suyo. Los otros tres nombres no existen. Junto a `type` suelen ir `allowNull`, `defaultValue` y `unique`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1229,
        "letra": "a",
        "orden": 1,
        "texto": "fieldType",
        "es_correcta": 0
      },
      {
        "id": 1230,
        "letra": "b",
        "orden": 2,
        "texto": "type usando DataTypes",
        "es_correcta": 1
      },
      {
        "id": 1231,
        "letra": "c",
        "orden": 3,
        "texto": "dbType",
        "es_correcta": 0
      },
      {
        "id": 1232,
        "letra": "d",
        "orden": 4,
        "texto": "struct",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 309,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En Sequelize, ¿qué función vincula un modelo \"A\" con un modelo \"B\" en relación Uno a Uno?",
    "justificacion": "`A.hasOne(B)` declara que A tiene un B, y hace que la llave foránea quede en **B** — la tabla del lado que «pertenece». Esa es la parte que más se confunde: el método se escribe en el modelo dueño, pero la columna aparece en el otro. Los otros tres nombres no existen; `belongsToOne` suena razonable y no es de Sequelize.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1233,
        "letra": "a",
        "orden": 1,
        "texto": "A.belongsToOne(B)",
        "es_correcta": 0
      },
      {
        "id": 1234,
        "letra": "b",
        "orden": 2,
        "texto": "A.hasOne(B)",
        "es_correcta": 1
      },
      {
        "id": 1235,
        "letra": "c",
        "orden": 3,
        "texto": "A.relatesTo(B)",
        "es_correcta": 0
      },
      {
        "id": 1236,
        "letra": "d",
        "orden": 4,
        "texto": "A.links(B)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 310,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Para completar la asociación inversa \"Uno a Uno\" o \"Uno a Muchos\", ¿qué método aplica el hijo?",
    "justificacion": "`belongsTo()` es el lado inverso, el que declara el hijo: `B.belongsTo(A)` completa lo que `A.hasOne(B)` o `A.hasMany(B)` empezaron, y es el que pone la llave foránea en B. Declarar los dos lados es lo que permite navegar la relación en ambos sentidos al consultar. Los otros tres nombres no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1237,
        "letra": "a",
        "orden": 1,
        "texto": "belongsTo()",
        "es_correcta": 1
      },
      {
        "id": 1238,
        "letra": "b",
        "orden": 2,
        "texto": "hasParent()",
        "es_correcta": 0
      },
      {
        "id": 1239,
        "letra": "c",
        "orden": 3,
        "texto": "childOf()",
        "es_correcta": 0
      },
      {
        "id": 1240,
        "letra": "d",
        "orden": 4,
        "texto": "ownsTo()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 311,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué requiere estrictamente una relación \"Muchos a Muchos\" (N:M) en bases de datos relacionales?",
    "justificacion": "Una relación N:M necesita una tabla intermedia cuyas filas son los pares, con las llaves foráneas de las dos tablas. No hay forma de representarla con una columna en cualquiera de los dos lados, porque cada fila admitiría un solo valor. Esa tabla es además el sitio natural de los atributos que pertenecen a la relación y no a las entidades.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1241,
        "letra": "a",
        "orden": 1,
        "texto": "Duplicar todos los campos en ambos modelos.",
        "es_correcta": 0
      },
      {
        "id": 1242,
        "letra": "b",
        "orden": 2,
        "texto": "Declarar dos llaves primarias en una misma columna.",
        "es_correcta": 0
      },
      {
        "id": 1243,
        "letra": "c",
        "orden": 3,
        "texto": "Una tabla o modelo intermedio para alojar ambas llaves foráneas.",
        "es_correcta": 1
      },
      {
        "id": 1244,
        "letra": "d",
        "orden": 4,
        "texto": "Modificar los índices para admitir valores nulos múltiples.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 312,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En Sequelize, ¿qué método establece una relación Muchos a Muchos indicando la tabla intermedia?",
    "justificacion": "`A.belongsToMany(B, { through: 'AB' })`, y hay que declararlo en los dos modelos para poder navegar en ambos sentidos. La opción `through` es obligatoria y dice qué tabla intermedia usar — puede ser un nombre o un modelo propio, y conviene lo segundo cuando la relación tiene datos suyos. Los otros tres nombres no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1245,
        "letra": "a",
        "orden": 1,
        "texto": "belongsToMany() con la opción 'through'",
        "es_correcta": 1
      },
      {
        "id": 1246,
        "letra": "b",
        "orden": 2,
        "texto": "hasManyToMany() con la opción 'via'",
        "es_correcta": 0
      },
      {
        "id": 1247,
        "letra": "c",
        "orden": 3,
        "texto": "associatesWith() con la opción 'middle'",
        "es_correcta": 0
      },
      {
        "id": 1248,
        "letra": "d",
        "orden": 4,
        "texto": "linksToMany() con la opción 'joinTable'",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 313,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al consultar modelos asociados en Sequelize, ¿qué parámetro se usa para cargar relaciones (JOIN)?",
    "justificacion": "`include` es la opción que trae de una vez los modelos asociados, traduciéndose a un `JOIN`: `Model.findAll({ include: Otro })`. Sin ella, cada relación exigiría una consulta aparte, que es el problema de las N+1 consultas. La (d), `populate`, es real pero de Mongoose, el ORM de MongoDB, y por eso es el mejor distractor de los tres.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1249,
        "letra": "a",
        "orden": 1,
        "texto": "fetch",
        "es_correcta": 0
      },
      {
        "id": 1250,
        "letra": "b",
        "orden": 2,
        "texto": "relations",
        "es_correcta": 0
      },
      {
        "id": 1251,
        "letra": "c",
        "orden": 3,
        "texto": "include",
        "es_correcta": 1
      },
      {
        "id": 1252,
        "letra": "d",
        "orden": 4,
        "texto": "populate",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 314,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué sucede internamente al invocar client.release() tras usar una conexión de un Pool con 'pg'?",
    "justificacion": "`release()` devuelve la conexión al pool y la deja disponible para la siguiente petición; **no la cierra**. Ésa es la distinción que la pregunta busca: cerrar sería tirar a la basura justo lo que el pool existe para conservar. Las otras tres describen efectos que no ocurren — no cierra transacciones ni borra cachés, y por eso conviene terminarlas uno mismo antes de soltar el cliente.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1253,
        "letra": "a",
        "orden": 1,
        "texto": "Se destruye físicamente la conexión con el servidor.",
        "es_correcta": 0
      },
      {
        "id": 1254,
        "letra": "b",
        "orden": 2,
        "texto": "Devuelve la conexión al pool para que sea reutilizada.",
        "es_correcta": 1
      },
      {
        "id": 1255,
        "letra": "c",
        "orden": 3,
        "texto": "Obliga a cerrar todas las transacciones pendientes.",
        "es_correcta": 0
      },
      {
        "id": 1256,
        "letra": "d",
        "orden": 4,
        "texto": "Borra la caché de consultas precompiladas del cliente.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 315,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En Node, ¿cuándo es imperativo utilizar cursores en lugar de consultas tradicionales (client.query)?",
    "justificacion": "Cuando el conjunto de resultados no cabe cómodamente en memoria. `client.query()` trae todo de una vez y construye el arreglo completo; con millones de filas, el proceso se queda sin memoria. El cursor los va entregando por lotes. Las otras tres describen situaciones donde el cursor no aporta nada: insertar, ejecutar DDL o usar transacciones.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1257,
        "letra": "a",
        "orden": 1,
        "texto": "Cuando se insertan múltiples filas en una sola query.",
        "es_correcta": 0
      },
      {
        "id": 1258,
        "letra": "b",
        "orden": 2,
        "texto": "Para procesar conjuntos de datos masivos sin saturar la RAM.",
        "es_correcta": 1
      },
      {
        "id": 1259,
        "letra": "c",
        "orden": 3,
        "texto": "Al ejecutar comandos DDL como CREATE TABLE o ALTER.",
        "es_correcta": 0
      },
      {
        "id": 1260,
        "letra": "d",
        "orden": 4,
        "texto": "Siempre que se utilicen transacciones asíncronas anidadas.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 316,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué ventaja ofrece usar async/await frente a callbacks al realizar múltiples consultas consecutivas?",
    "justificacion": "`async/await` deja el código asíncrono con la forma del síncrono: una consulta debajo de la otra, en vertical, en vez de anidadas dentro de callbacks. Eso importa especialmente aquí, donde una operación encadena varias consultas y el manejo de errores vuelve a ser un `try/catch` corriente. Lo que **no** hace es acelerar nada: la espera es la misma.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1261,
        "letra": "a",
        "orden": 1,
        "texto": "Incrementa exponencialmente el rendimiento del motor.",
        "es_correcta": 0
      },
      {
        "id": 1262,
        "letra": "b",
        "orden": 2,
        "texto": "Evita el Callback Hell manteniendo un flujo asíncrono legible.",
        "es_correcta": 1
      },
      {
        "id": 1263,
        "letra": "c",
        "orden": 3,
        "texto": "Cierra la conexión automáticamente tras cada bloque await.",
        "es_correcta": 0
      },
      {
        "id": 1264,
        "letra": "d",
        "orden": 4,
        "texto": "Compila las consultas a binario antes de enviarlas al server.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 317,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Usando 'pg', ¿cómo se obtiene el ID generado automáticamente tras un INSERT en PostgreSQL?",
    "justificacion": "Agregando `RETURNING id` —o `RETURNING *`— al `INSERT`, y leyendo después `result.rows[0].id`. Es la forma de PostgreSQL, y tiene una ventaja sobre las de otros motores: viene en la misma consulta, así que no hay una segunda llamada donde otra sesión pueda colarse. La (d) describe una propiedad de MySQL, y las otras dos no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1265,
        "letra": "a",
        "orden": 1,
        "texto": "Consultando la vista global de variables de sesión.",
        "es_correcta": 0
      },
      {
        "id": 1266,
        "letra": "b",
        "orden": 2,
        "texto": "Agregando la cláusula RETURNING a la sentencia SQL.",
        "es_correcta": 1
      },
      {
        "id": 1267,
        "letra": "c",
        "orden": 3,
        "texto": "Invocando la función interna GET_LAST_ID() de PostgreSQL.",
        "es_correcta": 0
      },
      {
        "id": 1268,
        "letra": "d",
        "orden": 4,
        "texto": "Leyendo la propiedad nativa 'lastInsertId' del objeto Result.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 318,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En el objeto Result devuelto por un UPDATE o DELETE, ¿qué propiedad indica las filas afectadas?",
    "justificacion": "`Result.rowCount` dice cuántas filas afectó la sentencia. Los otros tres nombres pertenecen a otras bibliotecas o no existen. Conviene mirarlo siempre después de un `UPDATE` o un `DELETE`: si vale cero, la condición no encontró nada, y eso rara vez es lo que uno esperaba — es la diferencia entre «se hizo» y «no falló».",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1269,
        "letra": "a",
        "orden": 1,
        "texto": "Result.rowsAffected",
        "es_correcta": 0
      },
      {
        "id": 1270,
        "letra": "b",
        "orden": 2,
        "texto": "Result.rowCount",
        "es_correcta": 1
      },
      {
        "id": 1271,
        "letra": "c",
        "orden": 3,
        "texto": "Result.changedRows",
        "es_correcta": 0
      },
      {
        "id": 1272,
        "letra": "d",
        "orden": 4,
        "texto": "Result.length",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 319,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Si ocurre un error en la tercera consulta de una transacción, ¿qué instrucción debe ejecutarse?",
    "justificacion": "`ROLLBACK`, que deshace las tres consultas y no solo la que falló. En eso consiste la atomicidad: la transacción se aplica entera o no deja rastro. Las otras tres no existen como instrucciones. Y después del `ROLLBACK` queda una cosa más por hacer, que es devolver el cliente al pool con `release()`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1273,
        "letra": "a",
        "orden": 1,
        "texto": "COMMIT PARCIAL",
        "es_correcta": 0
      },
      {
        "id": 1274,
        "letra": "b",
        "orden": 2,
        "texto": "ROLLBACK",
        "es_correcta": 1
      },
      {
        "id": 1275,
        "letra": "c",
        "orden": 3,
        "texto": "DROP TRANSACTION",
        "es_correcta": 0
      },
      {
        "id": 1276,
        "letra": "d",
        "orden": 4,
        "texto": "REVERT CACHE",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 320,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "¿Qué representa principalmente un \"Modelo\" dentro del ecosistema del ORM Sequelize?",
    "justificacion": "Un modelo es la abstracción de una tabla: define sus columnas y ofrece los métodos para operar con ella usando objetos en vez de SQL. Las otras tres describen piezas reales de una aplicación —la conexión, un middleware, una vista— que no son el modelo. La conexión, en particular, es lo que se le pasa a Sequelize al arrancar, no lo que el modelo representa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1277,
        "letra": "a",
        "orden": 1,
        "texto": "Una conexión activa con la base de datos PostgreSQL.",
        "es_correcta": 0
      },
      {
        "id": 1278,
        "letra": "b",
        "orden": 2,
        "texto": "Una abstracción de una tabla que permite operar con objetos.",
        "es_correcta": 1
      },
      {
        "id": 1279,
        "letra": "c",
        "orden": 3,
        "texto": "Un middleware que filtra consultas maliciosas (Injection).",
        "es_correcta": 0
      },
      {
        "id": 1280,
        "letra": "d",
        "orden": 4,
        "texto": "Una función genérica para crear vistas relacionales SQL.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 321,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "En Sequelize, ¿qué método define el lado \"1\" de una relación uno a muchos (1:N)?",
    "justificacion": "`hasMany()` se declara en el lado «uno»: `Autor.hasMany(Libro)` dice que un autor tiene muchos libros, y la llave foránea queda en la tabla de libros. Su par es `belongsTo()`, que se declara en el lado «muchos» y completa la relación. `hasOne()` es para uno a uno y `belongsToMany()` para muchos a muchos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1281,
        "letra": "a",
        "orden": 1,
        "texto": "belongsToMany()",
        "es_correcta": 0
      },
      {
        "id": 1282,
        "letra": "b",
        "orden": 2,
        "texto": "hasMany()",
        "es_correcta": 1
      },
      {
        "id": 1283,
        "letra": "c",
        "orden": 3,
        "texto": "hasOne()",
        "es_correcta": 0
      },
      {
        "id": 1284,
        "letra": "d",
        "orden": 4,
        "texto": "belongsTo()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 322,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Para crear una relación N:M en Sequelize, ¿qué parámetro adicional es obligatorio en la asociación?",
    "justificacion": "La opción `through`, que nombra la tabla intermedia donde viven las dos llaves foráneas. Es obligatoria porque sin ella Sequelize no sabría dónde guardar los pares. Las otras tres describen cosas que no hacen falta: ni índices agrupados, ni hooks, ni claves compuestas declaradas a mano — de la clave de la tabla intermedia se encarga Sequelize.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1285,
        "letra": "a",
        "orden": 1,
        "texto": "La definición de una tabla intermedia con la opción \"through\".",
        "es_correcta": 1
      },
      {
        "id": 1286,
        "letra": "b",
        "orden": 2,
        "texto": "Un índice agrupado (clustered index) en ambas tablas.",
        "es_correcta": 0
      },
      {
        "id": 1287,
        "letra": "c",
        "orden": 3,
        "texto": "Una función recursiva definida como un hook global.",
        "es_correcta": 0
      },
      {
        "id": 1288,
        "letra": "d",
        "orden": 4,
        "texto": "Declarar llaves primarias compuestas en cada modelo base.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 323,
    "modulo": 7,
    "modulo_titulo": "Acceso a Datos en Aplicaciones Node",
    "modulo_icono": "layers",
    "enunciado": "Al realizar lecturas en Sequelize, ¿qué opción permite incluir objetos de modelos relacionados (Joins)?",
    "justificacion": "`include` trae los modelos asociados en la misma consulta, traduciéndose a un `JOIN`. Sin ella hay que consultar cada relación aparte, que es el problema clásico de las N+1 consultas: una para la lista y una más por cada elemento. La (a) y la (d) no existen, y `populate` —que no aparece aquí— sería la de Mongoose, no la de Sequelize.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1289,
        "letra": "a",
        "orden": 1,
        "texto": "associations: true",
        "es_correcta": 0
      },
      {
        "id": 1290,
        "letra": "b",
        "orden": 2,
        "texto": "include",
        "es_correcta": 1
      },
      {
        "id": 1291,
        "letra": "c",
        "orden": 3,
        "texto": "fetchRelated",
        "es_correcta": 0
      },
      {
        "id": 1292,
        "letra": "d",
        "orden": 4,
        "texto": "join: 'all'",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 324,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué principio REST estipula que cada petición contenga toda la info necesaria sin usar sesiones?",
    "justificacion": "«Sin estado» significa que el servidor no recuerda nada entre una petición y la siguiente: cada una llega con todo lo que hace falta para atenderla, incluida la credencial. Eso es lo que permite poner varios servidores detrás de un balanceador sin preocuparse de a cuál cae cada petición. Las otras tres son restricciones reales de REST con otro oficio, y por eso son buenos distractores.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1293,
        "letra": "a",
        "orden": 1,
        "texto": "Interfaz uniforme estricta.",
        "es_correcta": 0
      },
      {
        "id": 1294,
        "letra": "b",
        "orden": 2,
        "texto": "Sistema de capas enrutadas.",
        "es_correcta": 0
      },
      {
        "id": 1295,
        "letra": "c",
        "orden": 3,
        "texto": "Comunicación sin estado (Stateless).",
        "es_correcta": 1
      },
      {
        "id": 1296,
        "letra": "d",
        "orden": 4,
        "texto": "Arquitectura cliente-servidor.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 325,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué ventaja técnica aporta la regla \"Cacheable\" en la arquitectura REST?",
    "justificacion": "Que una respuesta se pueda guardar en caché evita volver a pedirla: menos viajes por la red, menos trabajo del servidor y respuestas más rápidas. Se declara con cabeceras como `Cache-Control` y `ETag`, que dicen qué se puede guardar y por cuánto. Las otras tres describen cosas de las que se ocupan TLS, los verbos HTTP y CORS, cada uno por su lado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1297,
        "letra": "a",
        "orden": 1,
        "texto": "Encripta automáticamente el payload JSON del body.",
        "es_correcta": 0
      },
      {
        "id": 1298,
        "letra": "b",
        "orden": 2,
        "texto": "Elimina la necesidad de usar verbos HTTP.",
        "es_correcta": 0
      },
      {
        "id": 1299,
        "letra": "c",
        "orden": 3,
        "texto": "Reduce el consumo de ancho de banda y latencia.",
        "es_correcta": 1
      },
      {
        "id": 1300,
        "letra": "d",
        "orden": 4,
        "texto": "Bloquea peticiones de dominios no autorizados por CORS.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 326,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Según las buenas prácticas REST, ¿cómo debe nombrarse convencionalmente un endpoint de recursos?",
    "justificacion": "Un endpoint nombra **un recurso**, no una acción: `/usuarios`, y la acción la dice el verbo HTTP. Por eso `/getUsuarios` es redundante —el `GET` ya lo decía— y mezcla dos formas de expresar lo mismo. El plural es la convención porque la ruta representa la colección, y el elemento se identifica dentro de ella: `/usuarios/123`.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1301,
        "letra": "a",
        "orden": 1,
        "texto": "Usando verbos de acción (ej. /getUsuarios).",
        "es_correcta": 0
      },
      {
        "id": 1302,
        "letra": "b",
        "orden": 2,
        "texto": "Usando sustantivos en plural (ej. /usuarios).",
        "es_correcta": 1
      },
      {
        "id": 1303,
        "letra": "c",
        "orden": 3,
        "texto": "Usando el método HTTP en el path (ej. /usuarios/post).",
        "es_correcta": 0
      },
      {
        "id": 1304,
        "letra": "d",
        "orden": 4,
        "texto": "Usando identificadores binarios en la raíz (ej. /0101).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 327,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "En diseño REST, ¿cómo se versiona convencionalmente una API en su etapa inicial?",
    "justificacion": "Lo habitual al empezar es poner la versión en la ruta: `/v1/usuarios`. Es visible, se prueba desde el navegador y no exige acordarse de ninguna cabecera. La (d) describe una alternativa real —versionar por cabecera— que algunos consideran más limpia porque deja la URL identificando solo el recurso; existe, pero no es lo convencional en una API que recién arranca.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1305,
        "letra": "a",
        "orden": 1,
        "texto": "Pasando la versión en el body de cada POST.",
        "es_correcta": 0
      },
      {
        "id": 1306,
        "letra": "b",
        "orden": 2,
        "texto": "Incluyendo el prefijo /v1/ en la URL base del endpoint.",
        "es_correcta": 1
      },
      {
        "id": 1307,
        "letra": "c",
        "orden": 3,
        "texto": "Encriptando el número de versión en el JWT.",
        "es_correcta": 0
      },
      {
        "id": 1308,
        "letra": "d",
        "orden": 4,
        "texto": "Añadiendo la cabecera X-Version a cada petición.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 328,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué restricción aplica el \"Sistema de Capas\" en una arquitectura RESTful estándar?",
    "justificacion": "El sistema de capas dice que el cliente no puede saber si habla con el servidor final o con un intermediario. Gracias a eso se pueden meter proxys, cachés y balanceadores sin que el cliente cambie una línea. La (c) dice exactamente lo contrario: los balanceadores no solo se permiten, son la razón de ser de esta restricción.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1309,
        "letra": "a",
        "orden": 1,
        "texto": "El cliente desconoce si se conecta al servidor final o a un proxy.",
        "es_correcta": 1
      },
      {
        "id": 1310,
        "letra": "b",
        "orden": 2,
        "texto": "Los datos viajan forzosamente en formato XML.",
        "es_correcta": 0
      },
      {
        "id": 1311,
        "letra": "c",
        "orden": 3,
        "texto": "Impide el uso de balanceadores de carga intermedios.",
        "es_correcta": 0
      },
      {
        "id": 1312,
        "letra": "d",
        "orden": 4,
        "texto": "Exige una conexión directa punto a punto por TCP/IP.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 329,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué formato de salida se considera el estándar predominante al diseñar una API REST moderna?",
    "justificacion": "JSON es el formato predominante en las APIs REST modernas: es liviano, lo entiende cualquier lenguaje y en JavaScript se convierte a objeto con una llamada. Las otras tres existieron o existen — SOAP y XML dominaron antes y siguen vivos en sistemas heredados, y HTML es para páginas, no para datos. REST no obliga a JSON, pero es lo que se espera.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1313,
        "letra": "a",
        "orden": 1,
        "texto": "SOAP encapsulado.",
        "es_correcta": 0
      },
      {
        "id": 1314,
        "letra": "b",
        "orden": 2,
        "texto": "XML nativo estructurado.",
        "es_correcta": 0
      },
      {
        "id": 1315,
        "letra": "c",
        "orden": 3,
        "texto": "HTML renderizado.",
        "es_correcta": 0
      },
      {
        "id": 1316,
        "letra": "d",
        "orden": 4,
        "texto": "JSON (Notación de Objetos JavaScript).",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 330,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Según REST, ¿cuál es el mecanismo adecuado para realizar búsquedas y filtros en colecciones?",
    "justificacion": "Los filtros y búsquedas van en la cadena de consulta: `/usuarios?rol=admin&orden=nombre`. Así el endpoint sigue nombrando el recurso y los parámetros solo lo acotan. Además la URL completa se puede compartir y guardar en caché, cosa que la (d) perdería: usar `POST` para buscar rompe la semántica del verbo y deja la petición fuera de cualquier caché.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1317,
        "letra": "a",
        "orden": 1,
        "texto": "Parámetros de consulta (Query Parameters) en la URL.",
        "es_correcta": 1
      },
      {
        "id": 1318,
        "letra": "b",
        "orden": 2,
        "texto": "Enviar un archivo de texto con los filtros requeridos.",
        "es_correcta": 0
      },
      {
        "id": 1319,
        "letra": "c",
        "orden": 3,
        "texto": "Modificar los encabezados HTTP para cada filtro.",
        "es_correcta": 0
      },
      {
        "id": 1320,
        "letra": "d",
        "orden": 4,
        "texto": "Usar exclusivamente el verbo POST con un body detallado.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 331,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué regla REST establece la separación estricta entre interfaz de usuario y almacenamiento?",
    "justificacion": "La restricción cliente-servidor separa dos responsabilidades: la interfaz vive en el cliente y los datos en el servidor, y ninguno necesita saber cómo trabaja el otro. Eso permite cambiar la aplicación web sin tocar la API, o agregar una aplicación móvil que consuma la misma. Las otras tres son restricciones reales de REST que se ocupan de otra cosa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1321,
        "letra": "a",
        "orden": 1,
        "texto": "Interfaz Uniforme (Uniform Interface).",
        "es_correcta": 0
      },
      {
        "id": 1322,
        "letra": "b",
        "orden": 2,
        "texto": "Caché implícita.",
        "es_correcta": 0
      },
      {
        "id": 1323,
        "letra": "c",
        "orden": 3,
        "texto": "Cliente-Servidor (Client-Server).",
        "es_correcta": 1
      },
      {
        "id": 1324,
        "letra": "d",
        "orden": 4,
        "texto": "Código bajo demanda (Code on demand).",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 332,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "En una API REST, ¿qué verbo HTTP se usa convencionalmente para actualizaciones parciales?",
    "justificacion": "`PATCH` envía solo los campos que cambian; `PUT` reemplaza el recurso entero, y por eso lo que no se mande en un `PUT` se pierde. Esa es la diferencia práctica que la pregunta busca. `UPDATE` y `MODIFY` no son verbos HTTP. Conviene saber que `PATCH` **no** es idempotente por definición, mientras que `PUT` sí lo es.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1325,
        "letra": "a",
        "orden": 1,
        "texto": "PUT",
        "es_correcta": 0
      },
      {
        "id": 1326,
        "letra": "b",
        "orden": 2,
        "texto": "UPDATE",
        "es_correcta": 0
      },
      {
        "id": 1327,
        "letra": "c",
        "orden": 3,
        "texto": "PATCH",
        "es_correcta": 1
      },
      {
        "id": 1328,
        "letra": "d",
        "orden": 4,
        "texto": "MODIFY",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 333,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué verbo HTTP se utiliza idóneamente para la creación de un nuevo recurso en la base de datos?",
    "justificacion": "`POST` sobre la colección —`POST /usuarios`— es la forma convencional de crear: el cliente manda los datos y el servidor decide el identificador. La (b) merece un matiz: `PUT` también puede crear, pero solo cuando el cliente ya sabe la URL exacta del recurso, y en una API con identificadores generados por la base eso rara vez ocurre. `GET` no debe modificar nada y `ADD` no existe.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1329,
        "letra": "a",
        "orden": 1,
        "texto": "GET",
        "es_correcta": 0
      },
      {
        "id": 1330,
        "letra": "b",
        "orden": 2,
        "texto": "PUT",
        "es_correcta": 0
      },
      {
        "id": 1331,
        "letra": "c",
        "orden": 3,
        "texto": "POST",
        "es_correcta": 1
      },
      {
        "id": 1332,
        "letra": "d",
        "orden": 4,
        "texto": "ADD",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 334,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Según el estándar HTTP, ¿qué familia de códigos de estado indica un error provocado por el cliente?",
    "justificacion": "La familia 4xx dice que el problema está en la petición: mal formada, sin credenciales, a un recurso que no existe. La 5xx dice que la petición estaba bien y el que falló fue el servidor. Distinguirlas importa porque señalan a quién le toca arreglarlo — devolver un 500 ante un dato inválido del cliente manda a buscar el error donde no está.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1333,
        "letra": "a",
        "orden": 1,
        "texto": "2xx (Éxito)",
        "es_correcta": 0
      },
      {
        "id": 1334,
        "letra": "b",
        "orden": 2,
        "texto": "3xx (Redirección)",
        "es_correcta": 0
      },
      {
        "id": 1335,
        "letra": "c",
        "orden": 3,
        "texto": "4xx (Error del Cliente)",
        "es_correcta": 1
      },
      {
        "id": 1336,
        "letra": "d",
        "orden": 4,
        "texto": "5xx (Error del Servidor)",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 335,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué código HTTP es el más preciso para retornar cuando un recurso no existe en el servidor?",
    "justificacion": "`404 Not Found` es la respuesta exacta cuando el recurso no existe. Las otras tres son 4xx reales con otro significado: `400` es que la petición está mal formada, `401` que falta autenticarse, y `403` que estás autenticado pero no tienes permiso. Confundir `401` con `403` es el error más común de los cuatro.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1337,
        "letra": "a",
        "orden": 1,
        "texto": "400 Bad Request",
        "es_correcta": 0
      },
      {
        "id": 1338,
        "letra": "b",
        "orden": 2,
        "texto": "401 Unauthorized",
        "es_correcta": 0
      },
      {
        "id": 1339,
        "letra": "c",
        "orden": 3,
        "texto": "403 Forbidden",
        "es_correcta": 0
      },
      {
        "id": 1340,
        "letra": "d",
        "orden": 4,
        "texto": "404 Not Found",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 336,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué verbo HTTP es idempotente y se usa generalmente para reemplazar un recurso completo?",
    "justificacion": "`PUT` reemplaza el recurso completo, y es idempotente: repetir la misma petición deja el mismo resultado que hacerla una vez. Eso lo vuelve seguro de reintentar cuando la red falla. `POST` no lo es —dos envíos crean dos recursos— y `PATCH` tampoco por definición. `REPLACE` no es un verbo HTTP.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1341,
        "letra": "a",
        "orden": 1,
        "texto": "POST",
        "es_correcta": 0
      },
      {
        "id": 1342,
        "letra": "b",
        "orden": 2,
        "texto": "PATCH",
        "es_correcta": 0
      },
      {
        "id": 1343,
        "letra": "c",
        "orden": 3,
        "texto": "PUT",
        "es_correcta": 1
      },
      {
        "id": 1344,
        "letra": "d",
        "orden": 4,
        "texto": "REPLACE",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 337,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "En Express, ¿cómo accedes a un parámetro dinámico incrustado en la ruta (ej. /users/:id)?",
    "justificacion": "Los segmentos declarados con dos puntos en la ruta llegan en `req.params`: con `/users/:id`, la petición a `/users/7` deja `req.params.id` valiendo `\"7\"`. Ojo con eso último, que sorprende: **llega como texto**, así que compararlo con un número exige convertirlo. `req.query` es lo que va tras el `?` y `req.body` el cuerpo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1345,
        "letra": "a",
        "orden": 1,
        "texto": "req.query.id",
        "es_correcta": 0
      },
      {
        "id": 1346,
        "letra": "b",
        "orden": 2,
        "texto": "req.params.id",
        "es_correcta": 1
      },
      {
        "id": 1347,
        "letra": "c",
        "orden": 3,
        "texto": "req.body.id",
        "es_correcta": 0
      },
      {
        "id": 1348,
        "letra": "d",
        "orden": 4,
        "texto": "req.headers.id",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 338,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Si un endpoint Express responde exitosamente a un GET, ¿cómo defines el código 200 y envías JSON?",
    "justificacion": "`res.status(200).json({...})` fija el código y envía el objeto ya serializado con la cabecera `Content-Type` correcta. La (b) es la firma antigua de Express 3, que se eliminó: hoy `res.send(200, ...)` no hace lo que parece. Y conviene saber que `res.json()` por sí solo ya responde 200, así que el `status(200)` explícito es más para dejarlo escrito que por necesidad.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1349,
        "letra": "a",
        "orden": 1,
        "texto": "res.status(200).json({ data })",
        "es_correcta": 1
      },
      {
        "id": 1350,
        "letra": "b",
        "orden": 2,
        "texto": "res.send(200, { data })",
        "es_correcta": 0
      },
      {
        "id": 1351,
        "letra": "c",
        "orden": 3,
        "texto": "res.json(200).send({ data })",
        "es_correcta": 0
      },
      {
        "id": 1352,
        "letra": "d",
        "orden": 4,
        "texto": "res.code(200).return({ data })",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 339,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué código HTTP indica que la solicitud fue exitosa y como resultado se creó un nuevo recurso?",
    "justificacion": "`201 Created` es la respuesta correcta cuando la petición creó algo, y lo habitual es acompañarla con la cabecera `Location` apuntando al recurso nuevo. `200` diría «salió bien» sin decir que se creó nada; `202` es «lo recibí y lo procesaré después», útil en trabajos asíncronos; y `204` es «salió bien y no hay nada que devolver», típico de un borrado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1353,
        "letra": "a",
        "orden": 1,
        "texto": "200 OK",
        "es_correcta": 0
      },
      {
        "id": 1354,
        "letra": "b",
        "orden": 2,
        "texto": "201 Created",
        "es_correcta": 1
      },
      {
        "id": 1355,
        "letra": "c",
        "orden": 3,
        "texto": "202 Accepted",
        "es_correcta": 0
      },
      {
        "id": 1356,
        "letra": "d",
        "orden": 4,
        "texto": "204 No Content",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 340,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Si el servidor falla internamente al procesar la ruta, ¿qué código HTTP se debe devolver?",
    "justificacion": "`500 Internal Server Error` es la respuesta cuando el fallo es del servidor y no de la petición: una excepción no controlada, la base caída, un error de programación. La (d), `503`, es distinta y más precisa cuando corresponde: el servicio no está disponible **temporalmente**, por mantenimiento o sobrecarga. Un `500` nunca debe devolver la traza al cliente.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1357,
        "letra": "a",
        "orden": 1,
        "texto": "400 Bad Request",
        "es_correcta": 0
      },
      {
        "id": 1358,
        "letra": "b",
        "orden": 2,
        "texto": "409 Conflict",
        "es_correcta": 0
      },
      {
        "id": 1359,
        "letra": "c",
        "orden": 3,
        "texto": "500 Internal Server Error",
        "es_correcta": 1
      },
      {
        "id": 1360,
        "letra": "d",
        "orden": 4,
        "texto": "503 Service Unavailable",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 341,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué objeto de Express contiene los parámetros enviados por la URL tras un \"?\" (ej. ?sort=asc)?",
    "justificacion": "`req.query` trae lo que viene después del `?` ya convertido en objeto: con `?sort=asc` queda `req.query.sort` valiendo `\"asc\"`. Igual que los parámetros de ruta, **llegan como texto**. `req.params` es para los segmentos de la ruta, `req.body` para el cuerpo, y `req.url` es la URL cruda sin interpretar.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1361,
        "letra": "a",
        "orden": 1,
        "texto": "req.params",
        "es_correcta": 0
      },
      {
        "id": 1362,
        "letra": "b",
        "orden": 2,
        "texto": "req.body",
        "es_correcta": 0
      },
      {
        "id": 1363,
        "letra": "c",
        "orden": 3,
        "texto": "req.url",
        "es_correcta": 0
      },
      {
        "id": 1364,
        "letra": "d",
        "orden": 4,
        "texto": "req.query",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 342,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Al subir un archivo usando express-fileupload, ¿en qué objeto de la petición (req) se inyecta?",
    "justificacion": "`express-fileupload` deja los archivos recibidos en `req.files`, indexados por el nombre del campo del formulario. No van en `req.body`, que trae los campos de texto: es una distinción que confunde al principio porque los dos llegan en la misma petición. Los otros dos nombres no existen.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1365,
        "letra": "a",
        "orden": 1,
        "texto": "req.body.files",
        "es_correcta": 0
      },
      {
        "id": 1366,
        "letra": "b",
        "orden": 2,
        "texto": "req.files",
        "es_correcta": 1
      },
      {
        "id": 1367,
        "letra": "c",
        "orden": 3,
        "texto": "req.upload",
        "es_correcta": 0
      },
      {
        "id": 1368,
        "letra": "d",
        "orden": 4,
        "texto": "req.attachments",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 343,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué validación inicial es crítica realizar en el servidor antes de procesar una subida?",
    "justificacion": "Comprobar que `req.files` exista y no sea nulo, porque si la petición no trajo ningún archivo esa propiedad **no está**, y acceder a `req.files.foto` sobre `undefined` lanza y tumba el manejador. Es la primera línea de cualquier endpoint de subida. Las otras tres describen cosas que no son validaciones de entrada.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1369,
        "letra": "a",
        "orden": 1,
        "texto": "Comprimir el archivo en formato ZIP.",
        "es_correcta": 0
      },
      {
        "id": 1370,
        "letra": "b",
        "orden": 2,
        "texto": "Verificar si el objeto req.files está presente y no es nulo.",
        "es_correcta": 1
      },
      {
        "id": 1371,
        "letra": "c",
        "orden": 3,
        "texto": "Encriptar el nombre original del archivo con bcrypt.",
        "es_correcta": 0
      },
      {
        "id": 1372,
        "letra": "d",
        "orden": 4,
        "texto": "Reiniciar el buffer de memoria del servidor Node.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 344,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Por qué es vital validar la extensión del archivo subido en el backend de un servicio REST?",
    "justificacion": "Porque un archivo subido con una extensión ejecutable puede terminar corriéndose en el servidor si queda en un directorio que se sirve o se interpreta. Ahora bien, conviene saber que **validar la extensión sola no basta**: la extensión la elige quien sube. Se combina con revisar el tipo de contenido, renombrar el archivo y guardarlo fuera del directorio público.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1373,
        "letra": "a",
        "orden": 1,
        "texto": "Para evitar la ejecución de scripts maliciosos en el servidor.",
        "es_correcta": 1
      },
      {
        "id": 1374,
        "letra": "b",
        "orden": 2,
        "texto": "Para acelerar la descarga del archivo en el frontend.",
        "es_correcta": 0
      },
      {
        "id": 1375,
        "letra": "c",
        "orden": 3,
        "texto": "Porque express-fileupload rechaza archivos sin extensión.",
        "es_correcta": 0
      },
      {
        "id": 1376,
        "letra": "d",
        "orden": 4,
        "texto": "Para mantener el orden alfabético en el disco.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 345,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué método provee express-fileupload sobre el archivo para trasladarlo a una carpeta destino?",
    "justificacion": "`file.mv(ruta)` mueve el archivo desde donde lo dejó el middleware hasta el destino, y avisa si falla — con callback o con promesa, según cómo se lo llame. El nombre abreviado es el que se olvida: los otros tres suenan más naturales y ninguno existe. Conviene crear el directorio destino antes, porque `mv()` no lo crea.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1377,
        "letra": "a",
        "orden": 1,
        "texto": "file.move()",
        "es_correcta": 0
      },
      {
        "id": 1378,
        "letra": "b",
        "orden": 2,
        "texto": "file.mv()",
        "es_correcta": 1
      },
      {
        "id": 1379,
        "letra": "c",
        "orden": 3,
        "texto": "file.save()",
        "es_correcta": 0
      },
      {
        "id": 1380,
        "letra": "d",
        "orden": 4,
        "texto": "file.transfer()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 346,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Por qué se recomienda modificar o hashear el nombre del archivo al guardarlo en el servidor?",
    "justificacion": "Porque dos usuarios que suban `foto.jpg` pisarían el mismo archivo, y el segundo borraría al primero sin avisar. Un nombre generado —una marca de tiempo, un identificador aleatorio— evita la colisión. Y hay una segunda razón que la pregunta no menciona y conviene saber: el nombre original viene del cliente y puede traer rutas o caracteres pensados para escapar del directorio.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1381,
        "letra": "a",
        "orden": 1,
        "texto": "Para reducir el tamaño físico del archivo en el disco duro.",
        "es_correcta": 0
      },
      {
        "id": 1382,
        "letra": "b",
        "orden": 2,
        "texto": "Para cumplir con el estándar XML de subidas binarias.",
        "es_correcta": 0
      },
      {
        "id": 1383,
        "letra": "c",
        "orden": 3,
        "texto": "Para evitar sobreescrituras por archivos con el mismo nombre.",
        "es_correcta": 1
      },
      {
        "id": 1384,
        "letra": "d",
        "orden": 4,
        "texto": "Porque Node.js no soporta espacios en nombres de archivo.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 347,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Al procesar un upload exitoso, ¿qué debe retornar convencionalmente la API REST al cliente?",
    "justificacion": "Se devuelve una confirmación con los datos que el cliente necesita después: el nombre final del archivo o la URL desde donde se podrá pedir. Devolver el binario de vuelta —la (a)— no tiene sentido: el cliente acaba de enviarlo. Y lo habitual es responder `201 Created`, que es la pregunta sobre códigos de estado de este mismo módulo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1385,
        "letra": "a",
        "orden": 1,
        "texto": "El archivo binario completo como stream de vuelta.",
        "es_correcta": 0
      },
      {
        "id": 1386,
        "letra": "b",
        "orden": 2,
        "texto": "Un mensaje de éxito y la nueva URL/nombre del archivo.",
        "es_correcta": 1
      },
      {
        "id": 1387,
        "letra": "c",
        "orden": 3,
        "texto": "Un volcado de memoria con los metadatos del sistema.",
        "es_correcta": 0
      },
      {
        "id": 1388,
        "letra": "d",
        "orden": 4,
        "texto": "El código fuente del middleware procesador.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 348,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué atributo interno del archivo provee express-fileupload para validar el peso del mismo?",
    "justificacion": "`file.size` da el tamaño en bytes, y con eso se rechaza lo que exceda el límite antes de moverlo a su sitio. Los otros tres nombres no existen. `express-fileupload` acepta además una opción `limits` para cortar la subida antes de recibirla entera, que es mejor todavía: comprobar el tamaño después ya gastó el ancho de banda.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1389,
        "letra": "a",
        "orden": 1,
        "texto": "file.size",
        "es_correcta": 1
      },
      {
        "id": 1390,
        "letra": "b",
        "orden": 2,
        "texto": "file.weight",
        "es_correcta": 0
      },
      {
        "id": 1391,
        "letra": "c",
        "orden": 3,
        "texto": "file.bytes",
        "es_correcta": 0
      },
      {
        "id": 1392,
        "letra": "d",
        "orden": 4,
        "texto": "file.length",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 349,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Si debes permitir solo imágenes, ¿qué propiedad del archivo revisas además de su extensión?",
    "justificacion": "`file.mimetype` dice qué tipo de contenido declara el archivo —`image/png`, `image/jpeg`—, y filtrar por ahí es más fino que mirar la extensión. Con un matiz importante: **ese valor lo envía el cliente**, así que también se puede falsear. Para algo serio se comprueba además la firma real del archivo, sus primeros bytes.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1393,
        "letra": "a",
        "orden": 1,
        "texto": "file.name",
        "es_correcta": 0
      },
      {
        "id": 1394,
        "letra": "b",
        "orden": 2,
        "texto": "file.mimetype (ej. image/png)",
        "es_correcta": 1
      },
      {
        "id": 1395,
        "letra": "c",
        "orden": 3,
        "texto": "file.encoding",
        "es_correcta": 0
      },
      {
        "id": 1396,
        "letra": "d",
        "orden": 4,
        "texto": "file.tempFilePath",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 350,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Para borrar un archivo previamente subido al servidor, ¿qué módulo nativo de Node.js se emplea?",
    "justificacion": "`fs.unlinkSync(ruta)` borra el archivo; su versión asíncrona es `fs.unlink()` o `fs.promises.unlink()`, preferible dentro de un servidor por lo mismo que se vio en el módulo 6 — la versión síncrona detiene el único hilo. Los otros tres módulos son nativos y hacen otra cosa: `path` arma rutas, `http` sirve y pide, y `os` informa de la máquina.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1397,
        "letra": "a",
        "orden": 1,
        "texto": "http",
        "es_correcta": 0
      },
      {
        "id": 1398,
        "letra": "b",
        "orden": 2,
        "texto": "os",
        "es_correcta": 0
      },
      {
        "id": 1399,
        "letra": "c",
        "orden": 3,
        "texto": "fs (fs.unlinkSync)",
        "es_correcta": 1
      },
      {
        "id": 1400,
        "letra": "d",
        "orden": 4,
        "texto": "path",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 351,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué problema arquitectónico REST resuelve el uso de JSON Web Tokens (JWT)?",
    "justificacion": "El token viaja en cada petición y lleva dentro quién es el usuario, así que el servidor puede autenticarlo **sin guardar sesión**. Eso es lo que permite mantener la comunicación sin estado sin renunciar a saber quién llama, y por eso encaja con REST. Las otras tres describen problemas de los que JWT no se ocupa.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1401,
        "letra": "a",
        "orden": 1,
        "texto": "Reemplaza la base de datos por archivos planos seguros.",
        "es_correcta": 0
      },
      {
        "id": 1402,
        "letra": "b",
        "orden": 2,
        "texto": "Mantiene la comunicación sin estado (stateless) segura.",
        "es_correcta": 1
      },
      {
        "id": 1403,
        "letra": "c",
        "orden": 3,
        "texto": "Evita inyecciones SQL en consultas asíncronas.",
        "es_correcta": 0
      },
      {
        "id": 1404,
        "letra": "d",
        "orden": 4,
        "texto": "Permite subir archivos binarios sin límite de tamaño.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 352,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "En un JWT, ¿qué contiene el elemento estandarizado \"iat\" (Issued At) dentro del Payload?",
    "justificacion": "`iat` guarda el instante en que se emitió el token, como número de segundos desde 1970. Sirve para saber su antigüedad y para invalidar tokens emitidos antes de cierto momento. No hay que confundirlo con `exp`, que es la (d) y marca cuándo caduca: los dos son fechas y hacen cosas distintas. El algoritmo va en el header, no en el payload.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1405,
        "letra": "a",
        "orden": 1,
        "texto": "La dirección IP del servidor emisor.",
        "es_correcta": 0
      },
      {
        "id": 1406,
        "letra": "b",
        "orden": 2,
        "texto": "El algoritmo de encriptación utilizado.",
        "es_correcta": 0
      },
      {
        "id": 1407,
        "letra": "c",
        "orden": 3,
        "texto": "La fecha y hora exacta en que el token fue emitido.",
        "es_correcta": 1
      },
      {
        "id": 1408,
        "letra": "d",
        "orden": 4,
        "texto": "El tiempo máximo de vida antes de caducar.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 353,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué formato de codificación se utiliza universalmente para representar el Header y Payload del JWT?",
    "justificacion": "Header y payload van en Base64Url, que es Base64 con los caracteres `+` y `/` cambiados para que la cadena viaje sin problemas dentro de una URL. **Es codificación, no cifrado:** cualquiera puede decodificarla y leer el contenido, que es exactamente el motivo por el que no se guardan datos sensibles ahí dentro.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1409,
        "letra": "a",
        "orden": 1,
        "texto": "UTF-8 crudo",
        "es_correcta": 0
      },
      {
        "id": 1410,
        "letra": "b",
        "orden": 2,
        "texto": "Base64Url",
        "es_correcta": 1
      },
      {
        "id": 1411,
        "letra": "c",
        "orden": 3,
        "texto": "Hexadecimal",
        "es_correcta": 0
      },
      {
        "id": 1412,
        "letra": "d",
        "orden": 4,
        "texto": "Binario puro",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 354,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué paquete de NPM se utiliza canónicamente para firmar y verificar tokens en Express?",
    "justificacion": "`jsonwebtoken` es el paquete estándar: `sign()` para emitir y `verify()` para comprobar. Los otros tres nombres no existen. Conviene saber que `verify()` comprueba la firma **y** la expiración, y que lanza si algo falla — así que se usa dentro de un `try/catch` o con el middleware que hace ese trabajo.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1413,
        "letra": "a",
        "orden": 1,
        "texto": "jwt-creator",
        "es_correcta": 0
      },
      {
        "id": 1414,
        "letra": "b",
        "orden": 2,
        "texto": "express-auth",
        "es_correcta": 0
      },
      {
        "id": 1415,
        "letra": "c",
        "orden": 3,
        "texto": "jsonwebtoken",
        "es_correcta": 1
      },
      {
        "id": 1416,
        "letra": "d",
        "orden": 4,
        "texto": "node-tokens",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 355,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Por qué es fundamental la \"clave secreta\" (secret key) guardada en el servidor al usar JWT?",
    "justificacion": "La clave secreta es lo que permite firmar el token y, después, comprobar que nadie lo tocó: si alguien cambia un solo carácter del payload, la firma deja de coincidir y el token se rechaza. **No cifra nada** — el contenido sigue siendo legible—, solo garantiza integridad y origen. Por eso vive en el servidor y nunca en el código versionado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1417,
        "letra": "a",
        "orden": 1,
        "texto": "Para encriptar la conexión completa como lo hace TLS.",
        "es_correcta": 0
      },
      {
        "id": 1418,
        "letra": "b",
        "orden": 2,
        "texto": "Para firmar el token y validar que no fue alterado.",
        "es_correcta": 1
      },
      {
        "id": 1419,
        "letra": "c",
        "orden": 3,
        "texto": "Para ofuscar el código fuente de la aplicación Express.",
        "es_correcta": 0
      },
      {
        "id": 1420,
        "letra": "d",
        "orden": 4,
        "texto": "Para generar contraseñas automáticas a los usuarios.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 356,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Dónde es vulnerable almacenar un JWT en el cliente si existe riesgo de ataques XSS?",
    "justificacion": "En `localStorage` o `sessionStorage`, porque cualquier script que se ejecute en la página puede leerlos: eso es exactamente lo que consigue un ataque XSS. La (d) es la alternativa más segura y por eso es un buen distractor: una cookie con `HttpOnly` no es accesible desde JavaScript, así que un XSS no puede leerla —aunque entonces hay que ocuparse de CSRF, que es otro frente.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1421,
        "letra": "a",
        "orden": 1,
        "texto": "En un disco duro externo.",
        "es_correcta": 0
      },
      {
        "id": 1422,
        "letra": "b",
        "orden": 2,
        "texto": "En memoria volátil de solo lectura.",
        "es_correcta": 0
      },
      {
        "id": 1423,
        "letra": "c",
        "orden": 3,
        "texto": "En LocalStorage o SessionStorage.",
        "es_correcta": 1
      },
      {
        "id": 1424,
        "letra": "d",
        "orden": 4,
        "texto": "En cookies configuradas como HttpOnly.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 357,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué paquete middleware de Express evalúa automáticamente si el request tiene un JWT válido?",
    "justificacion": "`express-jwt` es el middleware que extrae el token de la petición, lo verifica y deja los datos del usuario disponibles para el manejador, rechazando por su cuenta lo que no sea válido. Los otros tres nombres no existen. Se combina con `jsonwebtoken`, que es quien firma: uno emite y el otro comprueba en cada petición protegida.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1425,
        "letra": "a",
        "orden": 1,
        "texto": "jwt-validator",
        "es_correcta": 0
      },
      {
        "id": 1426,
        "letra": "b",
        "orden": 2,
        "texto": "express-jwt",
        "es_correcta": 1
      },
      {
        "id": 1427,
        "letra": "c",
        "orden": 3,
        "texto": "auth-parser",
        "es_correcta": 0
      },
      {
        "id": 1428,
        "letra": "d",
        "orden": 4,
        "texto": "token-checker",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 358,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Al invocar un endpoint protegido, ¿dónde se envía convencionalmente el JWT en la petición HTTP?",
    "justificacion": "En la cabecera `Authorization`, con el esquema `Bearer`: `Authorization: Bearer <token>`. Es lo que esperan los middlewares y lo que la especificación reserva para credenciales. La (b) es especialmente mala idea: las URL quedan en los registros del servidor, en el historial del navegador y en la cabecera `Referer`, así que el token se filtraría en tres sitios a la vez.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1429,
        "letra": "a",
        "orden": 1,
        "texto": "En el body del JSON como \"token_key\".",
        "es_correcta": 0
      },
      {
        "id": 1430,
        "letra": "b",
        "orden": 2,
        "texto": "Como query param obligatorio en la URL.",
        "es_correcta": 0
      },
      {
        "id": 1431,
        "letra": "c",
        "orden": 3,
        "texto": "En el header \"Authorization\" usando el esquema Bearer.",
        "es_correcta": 1
      },
      {
        "id": 1432,
        "letra": "d",
        "orden": 4,
        "texto": "En una cookie abierta sin cifrar.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 359,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué riesgo de seguridad ocurre si se colocan contraseñas legibles en el Payload de un JWT?",
    "justificacion": "Porque el payload va **codificado, no cifrado**: cualquiera que tenga el token puede decodificar esa parte y leerla, sin necesidad de la clave secreta. La firma protege contra que lo modifiquen, no contra que lo lean. Por eso en el payload van identificadores y roles, nunca contraseñas ni datos personales sensibles.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1433,
        "letra": "a",
        "orden": 1,
        "texto": "El token será rechazado por exceder el tamaño límite de HTTP.",
        "es_correcta": 0
      },
      {
        "id": 1434,
        "letra": "b",
        "orden": 2,
        "texto": "El Payload se codifica en Base64, permitiendo que cualquiera lo lea.",
        "es_correcta": 1
      },
      {
        "id": 1435,
        "letra": "c",
        "orden": 3,
        "texto": "El servidor Node colapsará al intentar hashearlo doblemente.",
        "es_correcta": 0
      },
      {
        "id": 1436,
        "letra": "d",
        "orden": 4,
        "texto": "El paquete jsonwebtoken lanza un error interno al firmar.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 360,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Según las buenas prácticas REST, ¿cómo debe estructurarse el endpoint para obtener un recurso específico?",
    "justificacion": "`GET /usuarios/123`: el verbo dice la acción y la ruta identifica el recurso dentro de su colección. La (a) mete la acción en el nombre y pasa el identificador como filtro, que es tratar un recurso concreto como si fuera una búsqueda; la (b) usa `POST` para leer, rompiendo la semántica del verbo; y la (d) repite el verbo en la ruta.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1437,
        "letra": "a",
        "orden": 1,
        "texto": "GET /obtenerUsuario?id=123",
        "es_correcta": 0
      },
      {
        "id": 1438,
        "letra": "b",
        "orden": 2,
        "texto": "POST /usuarios/obtener/123",
        "es_correcta": 0
      },
      {
        "id": 1439,
        "letra": "c",
        "orden": 3,
        "texto": "GET /usuarios/123",
        "es_correcta": 1
      },
      {
        "id": 1440,
        "letra": "d",
        "orden": 4,
        "texto": "GET /usuarios/ver/123",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 361,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué concepto REST describe la inclusión de hipervínculos en la respuesta para navegar por la API?",
    "justificacion": "HATEOAS —«el hipertexto como motor del estado de la aplicación»— es la idea de que la respuesta incluya los enlaces a lo que se puede hacer a continuación, de modo que el cliente navegue la API sin tener las URL escritas dentro. Es la restricción de REST que menos se implementa en la práctica, y por eso se pregunta: se reconoce más por el nombre que por haberla usado.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1441,
        "letra": "a",
        "orden": 1,
        "texto": "Stateless Payload",
        "es_correcta": 0
      },
      {
        "id": 1442,
        "letra": "b",
        "orden": 2,
        "texto": "HATEOAS",
        "es_correcta": 1
      },
      {
        "id": 1443,
        "letra": "c",
        "orden": 3,
        "texto": "JWT Navigation",
        "es_correcta": 0
      },
      {
        "id": 1444,
        "letra": "d",
        "orden": 4,
        "texto": "RESTful Routing",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 362,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "En Express, ¿qué middleware estándar se usa comúnmente para parsear el cuerpo JSON de una petición POST?",
    "justificacion": "`express.json()` interpreta el cuerpo cuando llega como JSON y lo deja en `req.body`. Sin ese middleware, `req.body` queda `undefined`, y ése es el desconcierto clásico de quien empieza. Los otros tres son reales y atienden otros formatos: `urlencoded()` los formularios tradicionales, `text()` texto plano y `raw()` datos binarios.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1445,
        "letra": "a",
        "orden": 1,
        "texto": "express.json()",
        "es_correcta": 1
      },
      {
        "id": 1446,
        "letra": "b",
        "orden": 2,
        "texto": "express.urlencoded()",
        "es_correcta": 0
      },
      {
        "id": 1447,
        "letra": "c",
        "orden": 3,
        "texto": "express.text()",
        "es_correcta": 0
      },
      {
        "id": 1448,
        "letra": "d",
        "orden": 4,
        "texto": "express.raw()",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 363,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué paquete en Node/Express se menciona comúnmente para manejar la subida de archivos (upload)?",
    "justificacion": "`express-fileupload` es el que aparece en el material del curso: se monta como middleware y deja lo recibido en `req.files`. La (d) mezcla dos nombres — `multer` existe y es la alternativa más usada en proyectos reales, pero se llama así a secas. `express-session` maneja sesiones y `express-validator` valida entradas.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1449,
        "letra": "a",
        "orden": 1,
        "texto": "express-session",
        "es_correcta": 0
      },
      {
        "id": 1450,
        "letra": "b",
        "orden": 2,
        "texto": "express-fileupload",
        "es_correcta": 1
      },
      {
        "id": 1451,
        "letra": "c",
        "orden": 3,
        "texto": "express-validator",
        "es_correcta": 0
      },
      {
        "id": 1452,
        "letra": "d",
        "orden": 4,
        "texto": "multer-express",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 364,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "Al procesar un archivo con express-fileupload, ¿cómo se mueve al directorio de destino del servidor?",
    "justificacion": "Con `.mv(rutaDestino)`, que mueve el archivo desde su ubicación temporal al destino y avisa si algo falla. Las otras tres describen mecanismos que no existen. Es el mismo método que pregunta `m08#25` con otras palabras, y conviene recordar que el directorio destino tiene que existir de antes.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1453,
        "letra": "a",
        "orden": 1,
        "texto": "Editando la propiedad file.savePath local.",
        "es_correcta": 0
      },
      {
        "id": 1454,
        "letra": "b",
        "orden": 2,
        "texto": "Copiando la caché nativa al File System.",
        "es_correcta": 0
      },
      {
        "id": 1455,
        "letra": "c",
        "orden": 3,
        "texto": "Usando el método .mv() con la ruta destino.",
        "es_correcta": 1
      },
      {
        "id": 1456,
        "letra": "d",
        "orden": 4,
        "texto": "Invocando path.resolve() directo al JSON.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 365,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Cuáles son las tres partes estructurales que componen un JSON Web Token (JWT) estándar?",
    "justificacion": "Un JWT son tres partes separadas por puntos: **header**, con el algoritmo y el tipo; **payload**, con los datos; y **signature**, la firma que valida a las dos anteriores. La (d) suena razonable y es de otra cosa — «header, body y footer» describe un documento, no un token. Las tres partes se ven a simple vista: basta contar los dos puntos.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1457,
        "letra": "a",
        "orden": 1,
        "texto": "Header, Payload y Signature.",
        "es_correcta": 1
      },
      {
        "id": 1458,
        "letra": "b",
        "orden": 2,
        "texto": "Token, Secret y Expiration.",
        "es_correcta": 0
      },
      {
        "id": 1459,
        "letra": "c",
        "orden": 3,
        "texto": "User, Roles y Permissions.",
        "es_correcta": 0
      },
      {
        "id": 1460,
        "letra": "d",
        "orden": 4,
        "texto": "Header, Body y Footer.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 366,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Qué elemento del JWT se utiliza para verificar que el token no ha sido alterado en el cliente?",
    "justificacion": "La firma. Se calcula sobre el header y el payload usando la clave secreta, así que cambiar cualquier cosa del token invalida la comprobación. La (b) es el distractor que separa: la codificación Base64 **no protege nada**, es solo una forma de transportar el texto, y confundirla con seguridad es el malentendido más extendido sobre JWT.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1461,
        "letra": "a",
        "orden": 1,
        "texto": "El campo estandarizado IAT del Payload.",
        "es_correcta": 0
      },
      {
        "id": 1462,
        "letra": "b",
        "orden": 2,
        "texto": "La codificación Base64 en todo el string.",
        "es_correcta": 0
      },
      {
        "id": 1463,
        "letra": "c",
        "orden": 3,
        "texto": "La firma criptográfica (Signature).",
        "es_correcta": 1
      },
      {
        "id": 1464,
        "letra": "d",
        "orden": 4,
        "texto": "El algoritmo de control del Header.",
        "es_correcta": 0
      }
    ]
  },
  {
    "id": 367,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "¿Dónde es recomendable enviar el JWT validado en una petición HTTP hacia una API REST?",
    "justificacion": "En la cabecera `Authorization`, con el esquema `Bearer`. Es donde lo buscan los middlewares y donde la especificación pone las credenciales. Las otras tres lo exponen: en la URL queda registrado en los logs y el historial, en el cuerpo obliga a que toda petición sea `POST`, y una cookie sin atributos de seguridad queda al alcance de un XSS.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1465,
        "letra": "a",
        "orden": 1,
        "texto": "En la URL como query string principal.",
        "es_correcta": 0
      },
      {
        "id": 1466,
        "letra": "b",
        "orden": 2,
        "texto": "En el body de la petición HTTP POST.",
        "es_correcta": 0
      },
      {
        "id": 1467,
        "letra": "c",
        "orden": 3,
        "texto": "En una Cookie temporal sin atributos de red.",
        "es_correcta": 0
      },
      {
        "id": 1468,
        "letra": "d",
        "orden": 4,
        "texto": "En el Header de autorización usando Bearer.",
        "es_correcta": 1
      }
    ]
  },
  {
    "id": 368,
    "modulo": 8,
    "modulo_titulo": "Implementacion de API Backend Node Express",
    "modulo_icono": "shield-lock",
    "enunciado": "En seguridad JWT, ¿qué ocurre cuando el tiempo de vida (exp) definido en el token caduca?",
    "justificacion": "La verificación falla y la API rechaza la petición, normalmente con un `401`. Un token caducado no se renueva solo: el cliente tiene que pedir uno nuevo, autenticándose otra vez o usando un token de refresco si la API lo ofrece. Las otras tres describen comportamientos automáticos que no existen — y no podrían existir, porque el servidor no guarda estado del token.",
    "dificultad": null,
    "orden_fijo": 0,
    "alternativas": [
      {
        "id": 1469,
        "letra": "a",
        "orden": 1,
        "texto": "El cliente renueva el token automáticamente sin avisar.",
        "es_correcta": 0
      },
      {
        "id": 1470,
        "letra": "b",
        "orden": 2,
        "texto": "La verificación falla y la API rechaza la petición HTTP.",
        "es_correcta": 1
      },
      {
        "id": 1471,
        "letra": "c",
        "orden": 3,
        "texto": "El servidor extiende el tiempo de expiración del token.",
        "es_correcta": 0
      },
      {
        "id": 1472,
        "letra": "d",
        "orden": 4,
        "texto": "El navegador borra la variable JWT del código fuente.",
        "es_correcta": 0
      }
    ]
  }
];
