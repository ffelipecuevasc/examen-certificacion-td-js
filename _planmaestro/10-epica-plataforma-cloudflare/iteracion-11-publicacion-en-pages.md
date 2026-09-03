# Iteración 11 · Publicación en Cloudflare Pages

**Épica:** 10 · Plataforma Cloudflare
**Estado:** 🔵 En curso · **Iniciada:** 2026-09-02
**Depende de:** nada. Es el punto de entrada de la épica.

## Objetivo

Servir el sitio desde Cloudflare Pages, en la dirección gratuita `.pages.dev`, sin
cambios funcionales respecto a lo que hay hoy en el repositorio, y decidiendo en el
camino si el despliegue compila o publica el repositorio tal cual.

## Antecedentes que ya están decididos

Estos puntos no se discuten en esta iteración. Se anotan porque condicionan lo que
sí se decide aquí.

- **La dirección será un subdominio `.pages.dev`.** No hay dominio propio por ahora.
- **La publicación anterior en GitHub Pages se retira por completo**, sin
  redirección. El autor avisará a los estudiantes de la nueva dirección. Queda
  margen porque falta bastante para la fecha de certificación.
- **La capa de datos vivirá dentro del propio proyecto de Pages**, como funciones
  del sitio, y no como un Worker desplegado aparte. Es la única forma de mantener el
  mismo origen sin dominio propio, y evita CORS. Aquí **no se implementa nada de
  eso**: solo se deja constancia, porque afecta a la decisión de abajo. La ADR que
  formaliza esta elección se escribe en la iteración 12, que es donde la capa de
  datos entra en alcance.

## Decisión a cerrar

**Si el despliegue compila o publica el repositorio tal cual.**

ADR-005 estableció versionar los archivos generados con un motivo concreto: *«el
despliegue elegido publica el repositorio tal cual, sin paso de compilación»*. Ese
motivo está a punto de dejar de ser cierto por dos vías distintas:

1. Cloudflare Pages puede ejecutar una orden de construcción al publicar.
2. Con la capa de datos como funciones del proyecto, el despliegue ejecutará una
   construcción de todos modos a partir de la iteración 12.

A favor de compilar en el despliegue: cierra el hallazgo H-005, que hoy sigue
abierto y cuyo síntoma es un sitio publicado sin estilos sin que nadie lo note.

En contra: añade una pieza que puede fallar, y un fallo de construcción deja el
sitio sin publicar. La construcción ocurre lejos del autor, en un entorno que él no
ve mientras corre.

La decisión se toma con argumentos y se escribe como ADR. Si se opta por compilar,
la ADR nueva debe **sustituir explícitamente a ADR-005** y decir qué pasa con los
archivos generados en el repositorio. Si se mantiene el estado actual, ADR-005 sigue
vigente y la ADR nueva debe dejar dicho por qué se descartó compilar, para que la
iteración 12 no reabra el asunto desde cero.

## Tareas

- [x] Capturar la línea base del sitio antes de publicar: ambas páginas servidas por
  HTTP desde el equipo, con la consola limpia y todos los recursos cargando.
  Sirve para comparar después. — *Recursos y huellas capturados; la consola queda
  pendiente de comprobación manual, ver notas.*
- [x] Buscar en todo el repositorio referencias escritas a mano al nombre del
  repositorio anterior o a rutas que empiecen por barra. Las rutas relativas
  funcionan igual en ambos destinos; las que llevan el nombre del repositorio
  incrustado se rompen al pasar a la raíz del dominio, y se rompen en silencio.
- [x] Redactar el procedimiento de publicación en Cloudflare Pages, paso a paso,
  para que lo ejecute el autor. Claude Code no tiene acceso al panel.
- [x] Preparar los archivos de configuración que correspondan al repositorio, según
  lo que exija la alternativa de despliegue elegida.
- [x] Decidir sobre la compilación en el despliegue y escribir la ADR
  correspondiente, sustituyendo a ADR-005 si procede. — *ADR-010, sustituye a
  ADR-005.*
- [ ] Verificar, ya publicado, que ambas páginas y todos sus recursos se sirven
  correctamente desde la nueva dirección. — *Requiere el sitio publicado.*
- [x] Dejar anotado en el archivo de la iteración 12 que la capa de datos irá como
  funciones del proyecto de Pages, para que esa decisión no se replantee.
- [x] Documentar el procedimiento en `90-manual/`.
- [x] No introducir ningún cambio funcional. Esta iteración cambia dónde se sirve el
  sitio, no qué se sirve. — *Comprobado por huellas: los 53 archivos del sitio son
  idénticos byte a byte antes y después.*

## Criterios de aceptación

- [ ] El sitio responde desde una dirección `.pages.dev` y ambas páginas cargan sin
  errores de consola.
- [ ] El sitio publicado se comporta igual que la línea base capturada localmente:
  se recorren ambas páginas y no aparece ninguna diferencia visual ni funcional.
- [ ] Ningún recurso queda roto en la dirección publicada: se comprueba cada hoja de
  estilos, cada módulo ES y cada recurso, y ninguno responde con error.
- [ ] Una búsqueda en el repositorio no encuentra referencias al nombre del
  repositorio anterior ni rutas absolutas que dependan de un subdirectorio.
- [ ] El certificado de seguridad es válido y el sitio se sirve cifrado.
- [ ] La decisión sobre la compilación está publicada como ADR en `decisiones.md`,
  con su relación con ADR-005 declarada de forma explícita: la sustituye o la
  mantiene, dicho con esas palabras.
- [ ] Si la ADR resuelve compilar, el hallazgo H-005 queda marcado como resuelto en
  `auditoria_tecnica.md`, indicando esta iteración. Si resuelve no compilar,
  H-005 sigue abierto y así queda registrado.
- [ ] El procedimiento en `90-manual/` permite a alguien sin contexto previo repetir
  la publicación desde cero, partiendo de un clon del repositorio.
- [ ] La publicación anterior en GitHub Pages está retirada, y esa retirada queda
  anotada en las notas de la iteración con su fecha.

## Fuera de alcance

- Cualquier código de la capa de datos. Eso es la iteración 12.
- Cabeceras de seguridad, caché y métricas. Eso es la épica 50.
- Dominio propio. Se evalúa cuando el autor lo decida, y entonces habrá que revisar
  si la dirección `.pages.dev` se redirige o se abandona.

## Notas de la iteración

### La decisión · 2026-09-02

Se optó por **compilar en el despliegue y publicar solo `dist/`**. Queda como
ADR-010, que sustituye a ADR-005.

Se barajaron tres alternativas, no dos. Además de «publicar tal cual» y «compilar»,
apareció la distinción entre compilar dejando de versionar los generados o
compilar manteniéndolos versionados. Se eligió mantenerlos.

Dos datos, comprobados contra la documentación de Cloudflare, decidieron el asunto:

- **Un fallo de construcción no baja el sitio.** Cada despliegue es inmutable y solo
  uno construido con éxito llega a servirse. Esto desmonta el argumento que esta
  misma iteración anotaba en contra de compilar.
- **Pages excluye `node_modules`, `.git` y `.DS_Store` por su cuenta.** No hacía
  falta preocuparse por el límite de 20.000 archivos del plan gratuito.

La salida a `dist/` en vez de a la raíz fue decisión del autor, y mejora la
propuesta inicial: con el plan maestro ahora versionado, copiar una lista de
admitidos es más sólido que mantener una lista de excluidos. Lo que no se copia, no
se publica.

### Estado del CSS al empezar

Se recompiló y se comparó con lo versionado: **idéntico**. H-005 estaba latente, no
activo. El sitio publicado en GitHub Pages no tenía el problema en ese momento.

### Un falso positivo que valió la pena

La comprobación de referencias de `scripts/build-dist.mjs` detuvo la primera
construcción por `static/js/data/avatar.jpg`. No era un recurso roto: es un ejemplo
de HTML dentro del contenido didáctico de `data/modules.js`, con un `src` a un
archivo imaginario.

Es el mismo malentendido de H-003 —contenido que contiene marcado tratado como
marcado— y merece recordarse, porque va a reaparecer cada vez que algo recorra
`data/` buscando estructura. La regla quedó escrita en el script: en un `.html`
cuentan los `src`/`href`; en un módulo ES, solo los `import`.

### Pendiente de comprobación manual

**Errores de consola.** No hay navegador disponible en el entorno de Claude Code, y
automatizarlo exigiría una dependencia nueva que ninguna ADR autoriza. Queda como
paso explícito del procedimiento en `90-manual/`, tanto para la línea base local
como para el sitio publicado.

Lo que sí se verificó de forma automática, sirviendo por HTTP con un servidor
desechable fuera del repositorio:

- Los 15 recursos enlazados desde ambas páginas responden 200, siguiendo el grafo
  completo de módulos ES. Sin imports rotos.
- Las 31 clases `i-*` usadas existen en `icons.css` (que define 40; el excedente es
  H-007, ya aceptado).
- Las etiquetas HTML de ambas páginas están balanceadas.
- Los 53 archivos del sitio son idénticos byte a byte entre el repositorio y `dist/`.

### Retiro de GitHub Pages

_Pendiente. Anotar aquí la fecha cuando se ejecute el paso 4 del procedimiento._