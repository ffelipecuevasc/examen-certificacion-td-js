# Épica 20 · Persistencia de preguntas

**Estado:** 🔵 En curso
**Depende de:** épica 10

## Problema

Las 105 preguntas viven dentro de `static/js/data/cuestionario.js`, generado desde
markdown. Ampliar el banco a 300 por esa vía significa editar markdown, correr un
script y publicar el repositorio. Cada corrección de una tilde exige un ciclo
completo de desarrollador, y el autor no siempre está frente al repositorio cuando
detecta un error.

## Resultado esperado

El banco de preguntas vive en **Cloudflare D1** y el sitio lo consume a través del
Worker de datos. Corregir o agregar preguntas no requiere publicar el repositorio.
Si la capa de datos no responde, el estudiante igual puede estudiar con la
instantánea versionada.

## Alcance

- Modelo de datos del banco en D1.
- Extremos de lectura en el Worker, con validación.
- Instantánea local de respaldo y su generación (ADR-008).
- Herramienta de administración del contenido, sin escritura pública (ADR-009).
- Migración de las 105 preguntas actuales y ampliación hasta ~300.
- Justificación escrita para cada pregunta.

## Fuera de alcance

- Cambios visuales en `cuestionario.html`. Eso es la épica 30.
- El simulacro. Eso es la épica 40.
- Montar la infraestructura. Eso quedó cerrado en la épica 10.

## Iteraciones

| # | Iteración | Estado |
|---|---|---|
| 21 | Modelo de datos del banco | 🟢 Completada |
| 22 | Lectura, validación e instantánea | 🟢 Completada |
| 23 | Administración del contenido | 🟢 Completada |
| 24 | Preparar producción | 🟢 Completada |
| 25 | Llenar el banco | ⚪ No iniciada |

*La 24 se llamaba «Migración y ampliación» y se partió en dos el 2026-09-08 (commit
`1aa4f13`): juntaba dos trabajos de naturaleza distinta, uno de infraestructura
—corto y peligroso— y otro de contenido —largo y minucioso—. La 24 prepara
producción; la 25 la llena.*

## Lo que cambió respecto al plan anterior

La versión anterior de esta épica planteaba una hoja de cálculo de Google. ADR-007
la sustituye por D1. La ventaja que motivaba la hoja —editar sin tocar código— se
conserva, pero se traslada a la iteración 23: con una base de datos, esa comodidad
ya no viene incluida y hay que construirla deliberadamente. Es el principal costo
del cambio y conviene tenerlo presente.

## Estado de la épica, al cerrar la iteración 21

La **iteración 21** tiene sus siete criterios de aceptación cumplidos con evidencia,
la última de ella producida por el ensayo remoto contra la base de pruebas del
2026-09-05, que cerró los tres veredictos de `verificar-banco`. El cierre formal lo
hace el autor.

Lo que la iteración 21 deja hecho y que las siguientes dan por sentado:

- El esquema del banco existe, versionado en `d1/migraciones/001-banco-de-preguntas.sql`
  y documentado campo por campo en `90-manual/esquema-del-banco.md`.
- Los dos orígenes caben en él sin pérdida: la columna `origen` distingue `json_2026`
  de `js_2026`, y la correcta se identifica igual viniendo de una letra o de un
  índice (ADR-019).
- La vista `pregunta_activa` es lo único que leerá `functions/api/`. El filtro por
  estado vive ahí, así que ninguna consulta puede olvidarlo. **La iteración 22 lee de
  la vista, no de las tablas.**
- Hay un guardián con tres veredictos, `verificar-banco`, probado en local y en la
  nube.

Lo que **no** deja hecho, y que hay que tener presente al planificar:

- **El esquema no está aplicado en producción**, y `prueba_tuberia` sigue ahí. Va en
  la iteración 24, y la migración 001 **no** borra esa tabla: hace falta un `DROP`
  escrito a mano.
- **El banco real no está cargado.** Hay diez filas de ejemplo. Las 368 preguntas se
  cargan en la iteración 24, así que la iteración 22 trabajará contra un banco de
  juguete.
- **Ninguna pregunta tiene justificación escrita.** La columna existe y admite nulo a
  propósito.

## Estado de la épica, al cerrar la iteración 22

Cerrada el 2026-09-05 con **nueve criterios con evidencia y uno aplazado**. El banco ya viaja desde D1 hasta
`cuestionario.html`, validado al salir de la base y escapado al entrar al DOM, y el sitio sobrevive a la caída de la
capa de datos cargando la instantánea y **diciéndoselo al estudiante**.

Lo que la iteración 22 deja hecho y que las siguientes dan por sentado:

- **Los extremos de lectura** `GET /api/preguntas` y `?modulo=N`, que leen de la vista `pregunta_activa` y nunca de las
  tablas. Sus dos consultas están **exportadas** y las importa el generador de la instantánea, para que el respaldo no
  pueda divergir del extremo.
- **La validación de `functions/api/_validacion.js`**, que descarta la pregunta rota sin tumbar la respuesta y deja el
  motivo en `meta.validacion`, siempre, también cuando está vacío.
- **El escapado convertido en barrera comprobable**: `npm run probar:escapado` carga contenido hostil real en la base
  local, corre el componente y comprueba el HTML. Corre además como tercer paso de `npm run verificar`, que ahora es un
  coordinador con un solo veredicto y con la distinción entre «falló» y «no se pudo comprobar».
- **La instantánea de ADR-008**, con su generador sellado (contra qué base y cuándo), el respaldo en el sitio y el aviso
  visible arriba del banco. El aviso saca su fecha del sello, que es lo que ADR-023 obliga a escribir dentro.

Lo que **no** deja hecho, y que hay que tener presente al planificar:

- **La instantánea versionada sale de la base local**, o sea del banco de juguete, y su sello lo dice. Regenerarla desde
  producción es de la iteración 24, y con eso se cierra el criterio aplazado.
- **`main` está retenido.** Empujar publica, y publicar hoy dejaría el sitio en modo degradado con ocho preguntas de
  ejemplo. Es la última tarea de la iteración 24.
- **El escapado no está probado a escala** (ADR-024): diez filas de juguete no son 368. Lo hereda la iteración 24.
- Sigue en pie todo lo que la iteración 21 dejó pendiente: esquema sin aplicar en producción, `prueba_tuberia` viva
  allá, banco real sin cargar y ninguna justificación escrita.

**Cuatro hallazgos**, todos encontrados provocando situaciones y no leyendo código: H-017 (la prueba del escapado
dejaba el veneno dentro de la base), H-018 (el respaldo no se activaba ante un error en JSON ajeno, defecto que venía
de la iteración 12), H-019 (el generador tapaba el error de wrangler con un fallo propio) y H-020 (`package.json` no
declara `"type": "module"`, menor y abierto).

## Estado de la épica, al cerrar la iteración 23

*No se escribió.* La iteración 23 se cerró el 2026-09-08 sin esta sección, y
reconstruirla después habría producido una síntesis escrita desde el resultado y no
desde el trabajo: suena bien, no aporta, y ocupa el lugar de la que faltaba sin decir
que falta. **Se prefiere el hueco declarado.** Lo que la 23 dejó está en su archivo de
iteración y en `99-bitacora/2026-09-08-iteracion-23.md`, que sí se escribieron a tiempo.

## Estado de la épica, al cerrar la iteración 24

Cerrada el 2026-09-09 con **sus trece criterios de aceptación cumplidos con evidencia**, ocho tareas hechas y una
aplazada con motivo escrito. Los criterios de la nube los ejecutó el autor por ADR-015. **Producción quedó vacía y
correcta**, que era el objetivo, y el sitio publicado lo refleja sin mentir en ningún número.

Lo que la iteración 24 deja hecho y que las siguientes dan por sentado:

- **El esquema está en las dos bases de la nube**, comprobado pidiendo también vistas e índices y no sólo tablas: ocho
  objetos —cuatro tablas, tres índices y la vista `pregunta_activa`—, exactamente los que declara
  `001-banco-de-preguntas.sql`. **La vista está**, que es la que importa: es de la que come el sitio entero y de la que
  cuenta `/api/estado` desde esta iteración.
- **Las dos migraciones registradas en las dos bases.** La `001` quedó comprobada como repetible: en pruebas, donde ya
  estaba desde el ensayo del 2026-09-05, volver a correrla escribió **cero filas** y no pisó su fecha.
- **`prueba_tuberia` borrada de producción**, deuda abierta desde la iteración 12. Su única copia hoy es
  `d1/respaldo-banco.sql`, exportado **antes** del `DROP`, que es lo que lo hacía seguro.
- **El contenido arranca en 0 · 0 · 0 con los 7 módulos de referencia** que crea la `001`. La 25 puede darlo por cierto
  sin volver a comprobarlo, salvo que alguien toque la base entremedio.
- **`/api/estado` sabe fallar y dice la verdad sobre el banco.** Distingue cuatro estados —incluido `SIN_ESQUEMA`, código
  nuevo— y cuenta `pregunta_activa`, la misma vista de la que come el sitio. Los tres estados provocados, con los dos
  extremos coincidiendo en los tres.
- **El contador de la portada sale del dato dibujado**, los dos números y no sólo uno, y con cero preguntas desaparece.
- **`"type": "module"` y `tailwind.config.cjs`**, con la construcción de Cloudflare Pages comprobada por el despliegue:
  la paleta correcta es la prueba de que encontró la configuración `.cjs`.

Lo que **no** deja hecho, y que hay que tener presente al planificar:

- **El banco no está cargado.** Producción tiene esquema y cero preguntas. Es toda la iteración 25.
- **ADR-023 sigue incumplida**, y a propósito: la instantánea versionada sale de la base local. La declaración de
  incumplimiento se trasladó a la 25 **con su fecha original intacta**, porque esta iteración no genera ninguna
  instantánea — no habría nada que copiar.
- **El respaldo de ADR-008 ya no se activa**, y es correcto: con esquema aplicado no hay caída que respaldar. Pero es una
  advertencia, no sólo un dato: **si durante la carga algo sale mal, el sitio no va a caer al respaldo**; va a mostrar lo
  que haya en la base, bien o mal. La red que tapaba los errores se retiró en esta iteración.
- **El escapado sigue sin probarse a escala** (ADR-024). Aguantó diez filas de juguete y contenido hostil fabricado, que
  no es lo mismo que 368 preguntas escritas por otros.
- **Nada comprueba que la instantánea y el banco no hayan divergido**, abierto desde el 2026-09-08 a raíz de la `id 11`.
- **No hay ejecutor de migraciones.** Se aplazó a propósito: estrenar una herramienta nueva en la única operación
  irreversible de la épica habría sido el peor momento disponible. Se decide cuando haya una tercera migración.

**Dos hallazgos, uno nuevo y uno cerrado.** **H-022**, que no estaba previsto: los dos extremos se contradijeron sobre el
mismo hecho —`/api/preguntas` decía `vacio: true` y `/api/estado` decía `false`, en el mismo minuto y sobre el sitio
publicado— y **el que mentía era el de diagnóstico**. La causa venía de la iteración 12 y llevaba desde entonces diciendo
`false`, sin que nadie lo mirara, porque hasta que hubo un banco vacío de verdad `false` era la respuesta correcta por
casualidad. Y **H-020**, cerrado, que era la razón del cambio en la construcción.

**La ventana que permitió encontrar H-022 se abrió sola.** Aplicar el esquema en producción cambió el sitio publicado sin
publicar nada, porque el Worker lee D1 en vivo. De ahí salió también algo que la iteración no se había propuesto: **el
modo degradado quedó comprobado en sus dos extremos contra producción** —sin esquema con el respaldo activo el
2026-09-08, y con esquema y tablas vacías el 2026-09-09—, cada uno sobre la base real y no sobre una de juguete.
