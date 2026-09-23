# Vigilar el consumo y las protecciones del plan gratuito

**Quién lo ejecuta:** el autor. Claude Code no tiene acceso al panel de Cloudflare.
**Origen:** iteración 51, etapa C (H-008). Escrito el 2026-09-23.

Este documento responde tres preguntas: cuánto admite el plan gratuito, cuánto gasta el sitio y dónde se mira, y
qué protecciones de Cloudflare se pueden usar sin dominio propio.

Los límites y los comportamientos salen de la documentación oficial de Cloudflare, **leída el 2026-09-23**. Cada
sección nombra su página. Cloudflare los cambia de vez en cuando: si un número de aquí no coincide con lo que ves en
el panel, manda el panel, y este documento se corrige.

**Decisión 4 de la iteración 51:** la vigilancia se hace mirando el panel, no con un guion que lea la API de
Cloudflare. Un guion así necesitaría un token guardado en alguna parte, y CLAUDE.md no admite credenciales en el
repositorio.

---

## 1 · Lo que admite el plan gratuito

### Los límites

| Qué | Límite gratuito | Se reinicia | Fuente |
|---|---|---|---|
| Peticiones a Functions (todo lo que va a `/api/`) | **100 000 por día** | 00:00 UTC | Workers → Platform → Limits · Pages → Functions → Pricing |
| Peticiones a las páginas, el CSS, el JS y las imágenes | **sin límite y gratis** | — | Pages → Functions → Pricing |
| Filas leídas en D1 | **5 millones por día** | 00:00 UTC | D1 → Platform → Pricing |
| Filas escritas en D1 | 100 000 por día | 00:00 UTC | D1 → Platform → Pricing |
| Espacio en D1 | 5 GB en total, 500 MB por base, 10 bases | — | D1 → Platform → Limits |
| Consultas a D1 por petición | 50 | — | D1 → Platform → Limits |

**Las 00:00 UTC son las 21:00 en Chile continental con horario de verano (UTC−3), y las 20:00 con horario de
invierno (UTC−4).** El «día» de los límites empieza ahí, no a medianoche en Chile.

**Los límites son de la cuenta, no del proyecto.** Las 100 000 peticiones se reparten entre todos los Workers y todas
las Functions de la cuenta de Cloudflare. Las 5 millones de filas se reparten entre todas las bases D1 de la cuenta,
y eso incluye `examen-td-js-pruebas`, que usan las previsualizaciones. Si la cuenta tiene otros proyectos, gastan de
la misma bolsa.

Las filas escritas no preocupan: el sitio no escribe nunca (ADR-009). Solo escribe el autor cuando edita el banco.

### Qué pasa al llegar al límite

- **Peticiones.** Cloudflare deja de ejecutar las Functions y responde un error 1027. Las páginas siguen cargando,
  porque no pasan por Functions.
- **Filas de D1.** Desde el 1 de septiembre de 2026, las consultas fallan hasta el reinicio. Los datos guardados no
  se pierden. **Cloudflare manda un correo cuando se alcanza el límite, no antes**, así que ese correo avisa tarde
  (registro de cambios de D1).

**En los dos casos el estudiante sigue estudiando.** El sitio pasa a la instantánea versionada y lo avisa en
pantalla (ADR-008). Lo comprueba `npm run probar:respaldo` en local: un 429 de la plataforma, con cualquier cuerpo,
enciende el respaldo, y el error propio de la capa cuando D1 no responde (`FALLO_CONSULTA`) también. Lo que el
estudiante pierde es lo más nuevo del banco, que la instantánea puede no traer todavía.

---

## 2 · Lo que gasta el sitio

Medido el 2026-09-23 en Chrome, contra el servidor local con el banco completo (368 preguntas), contando cada
petición a `/api/` de una visita real y las filas que D1 informó en cada respuesta. La base local reproduce la de
producción: `?resumen=1` lee **1111 filas** en las dos, y en producción se midió el 2026-09-15.

| Qué hace el estudiante | Peticiones a `/api/` | Filas leídas |
|---|---|---|
| Abrir la portada o «Acerca de» | 0 | 0 |
| Abrir el cuestionario | 2 (`?resumen=1` y `/api/estado`) | 1111, más lo que lea `/api/estado`\* |
| Cargar un módulo en el cuestionario | 1 | entre 496 (módulo 8) y 675 (módulos 3 y 4) |
| Cargar los siete módulos | 7 | 4073 |
| Un intento completo del simulacro | 3 (`?resumen=1` y dos `?ids=`) | 6693 |
| **Una sesión completa:** el cuestionario con sus siete módulos y un simulacro | **12** | **11 877**, más `/api/estado`\* |

\* `/api/estado` cuenta las preguntas activas, y su respuesta no informa filas. En local no se pudo medir: se ve en
el panel de D1.

**Cada recarga cuenta de nuevo.** Recargar el cuestionario vuelve a pedir `?resumen=1` y vuelve a gastar 1111
filas. Eso lo trata la iteración 53, con la caché.

### Qué se agota primero: las filas, y por mucho

| Límite | Una sesión completa gasta | Sesiones completas por día que caben |
|---|---|---|
| 100 000 peticiones | 12 | unas **8300** |
| 5 millones de filas leídas | 11 877 | unas **420** |

Las filas de D1 se agotan unas veinte veces antes que las peticiones. Si el sitio llega a tener problemas de cuota,
van a empezar por D1. Contado de otra forma: 5 millones de filas alcanzan para unas **4500 aperturas del
cuestionario** por día, aunque nadie cargue un solo módulo.

420 sesiones completas en un día no es una cifra lejana para un sitio de estudio en la semana previa a una fecha de
examen, que es justo cuando más importa (H-008).

---

## 3 · Dónde se mira

### Peticiones a Functions

1. Panel de Cloudflare → **Workers & Pages**.
2. Elige el proyecto **examen-certificacion-td-js**.
3. Abre **Functions Metrics**.

Ahí están las peticiones totales, las correctas y las fallidas, con hasta tres meses de historia. Dos cosas que
mirar:

- **Total** es el número que se compara con las 100 000. Cuenta solo este proyecto: si la cuenta tiene otros Workers
  o proyectos de Pages, súmalos, mirando cada uno igual.
- **Invocation Statuses**: si aparece **Exceeded Resources**, alguna petición chocó con un límite. Ese estado incluye
  el error 1027 del límite diario.

Las gráficas de menos de seis horas pueden mostrar una caída en los últimos minutos. No es una caída de tráfico:
es el retraso con que llegan los datos.

### Filas de D1

1. Panel de Cloudflare → **Storage & Databases** → **D1**.
2. Elige **examen-td-js-produccion**.
3. Abre la pestaña **Metrics**.

Mira **Rows read**. El panel muestra por defecto las últimas 24 horas y guarda 31 días. Repite con
**examen-td-js-pruebas**: gasta de la misma bolsa.

La documentación leída no describe un contador único con el total de la cuenta. Si el panel lo tiene, anótalo aquí
con su ruta.

### Cada cuánto

- **Una vez por semana**, en tiempo normal.
- **Todos los días**, en las dos semanas previas a una fecha de examen.

### Cuándo preocuparse

Propuesta de este documento, en filas leídas de D1 en un mismo día UTC, porque es el límite que se agota primero:

| Filas leídas en un día | Qué significa | Qué hacer |
|---|---|---|
| menos de 1 millón (20 %) | normal | nada |
| **2,5 millones (50 %)** | el margen se está gastando | anotarlo en `registro_log.md` con la fecha y adelantar la caché de la iteración 53 |
| **4 millones (80 %)** | un día más de crecimiento lo agota | decidir el mismo día: esperar el reinicio con el respaldo encendido, o pasar al plan pagado |

Para las peticiones, los mismos umbrales son 50 000 y 80 000 al día, pero según la sección 2 se llega antes al de
filas.

**El plan pagado de Workers** cuesta desde **5 USD al mes por cuenta** e incluye Workers, Pages Functions y D1 con
límites mucho más altos (Workers → Platform → Pricing). Según la documentación de D1, el cambio quita los límites
diarios en minutos. Es una decisión del autor y queda fuera de esta iteración.

---

## 4 · Las protecciones del plan gratuito

**El sitio no tiene dominio propio:** vive en `examen-certificacion-td-js.pages.dev`. La mayoría de las protecciones
de Cloudflare se configuran sobre una **zona**, y una zona exige un dominio propio apuntando a Cloudflare. En la
documentación, la dirección del panel de esas protecciones lleva `:zone`, y sin zona no hay dónde abrirlas.

| Protección | ¿Aplica sin dominio propio? | Por qué | Qué se hace |
|---|---|---|---|
| **Bot Fight Mode** | **No** | Se activa en *Security → Settings* de una zona. Además, su detección por JavaScript inyecta un script en línea que la política de contenido de la etapa A bloquea, y Cloudflare advierte que puede desafiar el tráfico de API: pondría pruebas entre el estudiante y `/api/` | nada |
| **Reglas de límite de tasa** (WAF) | **No** | Se crean en *Security rules* de una zona. En Workers existe una API de límites, pero no está entre lo que admite el archivo de Wrangler de Pages, y la capa de datos son Functions de Pages (ADR-011). Además, la decisión del 2026-09-22 es no construir nada que rechace peticiones | nada |
| **Reglas personalizadas** (WAF) | **No** | Se crean en *Security rules* de una zona | nada |
| **Protección DDoS de capa 7** | No se configura | Cloudflare la describe como siempre activa para las zonas incorporadas. El tráfico de `pages.dev` pasa por la red de Cloudflare, pero sin zona propia no hay nada que ajustar ni un panel de eventos que mirar | nada |
| **Access para las previsualizaciones** | **Sí** | Se activa en el propio proyecto de Pages. Ver abajo | **decisión del autor** |
| Desafíos al visitante (Turnstile o cualquier captcha) | No se considera | Contradice el principio de cero fricción: el estudiante entra y estudia sin verificaciones | nada |

**Ninguna protección de esta iteración rechaza ni desafía a un estudiante.** La única que aplica, la de abajo, no
toca la dirección que usan los estudiantes.

### Access para las previsualizaciones: la única que aplica

**Qué hay hoy.** Cada despliegue queda publicado para siempre en su propia dirección, `<hash>.examen-certificacion-td-js.pages.dev`,
y las ramas que no son `main` en `<rama>.examen-certificacion-td-js.pages.dev`. Por defecto son **públicas**
(Pages → Configuration → Preview deployments). Tres consecuencias:

- Una versión vieja del sitio, por ejemplo anterior a las cabeceras de seguridad, sigue a la vista de quien tenga la
  dirección.
- Las previsualizaciones leen `examen-td-js-pruebas`, que puede tener contenido a medio revisar.
- Todas gastan de la misma cuota de la cuenta.

**Qué hace Access.** Con la política activada, esas direcciones piden identificarse con la cuenta de Cloudflare
antes de mostrar nada. Según la documentación, la política cubre `*.examen-certificacion-td-js.pages.dev`, es decir,
todas las direcciones con hash o con nombre de rama, y **no** la dirección principal
`examen-certificacion-td-js.pages.dev`. Proteger también la principal exige pasos adicionales que esta iteración
**no** propone, porque dejaría afuera a los estudiantes.

**Para activarla, si lo decides:**

1. Panel de Cloudflare → **Workers & Pages** → **examen-certificacion-td-js**.
2. **Settings** → **General** → **Enable access policy**.
3. Si el panel pide algo más, como crear una organización de Zero Trust, anótalo aquí con lo que pidió.

**Para comprobarla, las dos mitades:**

1. Abre en una ventana privada la dirección con hash de un despliegue viejo (en **Deployments**, cualquiera que no
   sea el último). Tiene que pedir identificarse.
2. Abre en otra ventana privada `https://examen-certificacion-td-js.pages.dev/cuestionario` y carga un módulo. Tiene
   que funcionar como siempre, **sin pedir nada**. Si pide identificarse, desactiva la política de inmediato: le
   estaría cerrando el sitio a los estudiantes.

Anota el resultado y la fecha en la sección 5.

---

## 5 · Registro de lo configurado

| Fecha | Qué | Quién | Resultado |
|---|---|---|---|
| — | Access para las previsualizaciones | autor | pendiente de decisión |
