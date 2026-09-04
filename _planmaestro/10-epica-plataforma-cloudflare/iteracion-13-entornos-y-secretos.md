# Iteración 13 · Entornos, secretos y procedimientos

**Épica:** 10 · Plataforma Cloudflare
**Estado:** 🟢 Completada · **Iniciada:** 2026-09-03 · **Cerrada:** 2026-09-04
**Depende de:** iteración 12, cerrada el 2026-09-03.

## Objetivo

Separar pruebas de producción y dejar establecido cómo se manejan las credenciales y
cómo se recupera la base, antes de que exista contenido real que perder.

## Contexto

El momento de resolver esto es ahora, con una tabla de juguete. Una vez que D1
contenga cerca de 300 preguntas escritas a mano, equivocarse de entorno deja de ser
un inconveniente y pasa a ser una pérdida de trabajo.

Hoy existe una sola base, `examen-td-js-produccion`, y los despliegues de vista
previa la leen a ella. Está anotado en el propio `wrangler.toml`.

## Antecedentes que ya están decididos

- **El `database_id` se versiona a propósito** (ADR-012), y `CLAUDE.md` ya distingue
  credencial de identificador. Esta iteración no reabre eso: lo verifica.
- **`.wrangler/` y `.dev.vars` ya están ignorados**, desde la iteración 12. Aquí se
  comprueba que efectivamente lo estén, no se vuelve a hacer.
- **Wrangler quedó autorizado en el equipo del autor** el 2026-09-03, con permisos
  amplios sobre la cuenta.

## Decisiones a cerrar

**1. Qué puede ejecutar Claude Code contra la cuenta de Cloudflare.**

Esta decisión no existía cuando se escribió la épica. Ahora que hay una sesión
iniciada, cualquier comando de Wrangler que Claude Code ejecute actúa sobre la cuenta
real. `CLAUDE.md` dice que no toca producción, pero no dice nada sobre crear bases,
exportar datos o escribir en una base de pruebas, porque nada de eso era posible
antes.

Hay que trazar la línea y escribirla como regla, no como acuerdo tácito de esta
conversación. Como mínimo debe quedar claro qué ocurre con `--remote`, que es la
diferencia entre tocar la copia local y tocar la nube.

**2. Qué cuenta como respaldo.**

Son dos mecanismos distintos y la iteración los trataba como uno:

- La recuperación a un punto en el tiempo que trae D1 protege de un borrado o una
  consulta equivocada, es inmediata y no requiere mantener nada. No protege de
  perder el acceso a la cuenta, y solo alcanza hasta cierta antigüedad.
- Una exportación a archivo sí sobrevive a la pérdida de la cuenta, pero solo existe
  si alguien la ejecuta, y envejece.

Decide cuál es el respaldo oficial del proyecto, o si son ambos con papeles
distintos, y escríbelo como ADR. El criterio de restauración probada se aplica a lo
que resuelva esa ADR.

**3. Dónde se restaura al probar.**

Restaurar sobre producción para comprobar que el respaldo sirve es la forma más
rápida de perder lo que se quería proteger. Con la base de pruebas ya creada, la
prueba se hace ahí. Esto condiciona el orden de las tareas: la separación de
entornos va antes que la prueba de restauración.

## Tareas

- [x] Crear la base D1 de pruebas. La crea el autor en el panel, salvo que la
  decisión 1 resuelva otra cosa.
- [x] Declarar el entorno de vista previa en `wrangler.toml` para que apunte a la
  base de pruebas.
- [x] Documentar cómo se sabe, sin ambigüedad, contra qué entorno se está
  trabajando: en el navegador, en la terminal y en el registro de despliegue.
- [x] Verificar que `.wrangler/` y `.dev.vars` siguen ignorados, con evidencia.
- [x] Establecer dónde viven las credenciales y confirmar que ninguna está en el
  repositorio.
- [x] Escribir la ADR de la decisión 1 y reflejarla como regla en `CLAUDE.md`.
- [x] Escribir la ADR de la decisión 2.
- [x] Definir el procedimiento de respaldo: cada cuánto, dónde queda, cuánto dura y
  cómo se restaura.
- [x] Probar la restauración contra la base de pruebas.
- [x] Consolidar el manual de publicación en `90-manual/`. Ya existe material de las
  iteraciones 11 y 12; el trabajo es unificarlo, no escribirlo de nuevo.
- [x] Revisar si los despliegues de vista previa quedan en direcciones públicas y,
  si es así, dejarlo anotado. El repositorio ya es público, así que no expone
  nada nuevo, pero conviene que esté dicho.

## Criterios de aceptación

- [x] Existen dos bases D1 separadas, y se demuestra que una escritura en pruebas no
  aparece en producción. La demostración es una consulta a ambas, no una
  afirmación.
- [x] Un despliegue de vista previa lee la base de pruebas, comprobado sobre una
  dirección de vista previa real.
- [x] Está documentado cómo distinguir el entorno activo, y la señal es visible sin
  abrir el panel de Cloudflare.
- [x] Ningún token, clave ni contraseña está en el repositorio. El `database_id` sí
  está y es correcto que lo esté, según ADR-012.
- [x] Se verifica que un archivo de credenciales de Wrangler queda efectivamente
  ignorado, mostrando la comprobación.
- [x] La ADR de la decisión 1 está publicada y su regla aparece en `CLAUDE.md`.
- [x] La ADR de la decisión 2 está publicada y dice cuál es el respaldo oficial.
- [x] El procedimiento de respaldo está documentado, incluyendo cuánto tiempo hacia
  atrás alcanza a cubrir.
- [x] Se restauró un respaldo con éxito contra la base de pruebas, con evidencia:
  qué dato se destruyó, qué se restauró y cómo se comprobó que volvió.
- [x] El manual de `90-manual/` permite a alguien sin contexto previo publicar una
  actualización desde un clon, sin preguntarle nada al autor. · *Recorrido en frío
  dos veces, ambas por el autor y desde un clon limpio: `git clone`, `npm install`
  (104 paquetes) y `npm run verificar`. El primero terminó en `DESFASADO` sobre
  `icons.css`, que resultó ser una falsa alarma por finales de línea (H-012). El
  segundo, **hecho después de poner el `.gitattributes`**, terminó en `VERIFICADO`
  con código 0 y ya sin la nota de finales de línea, porque el clon ahora sale en
  LF y no hay nada que normalizar. Mismo escenario, resultado limpio.*

## Fuera de alcance

- El esquema del banco de preguntas y el borrado de `prueba_tuberia`. Eso es la
  épica 20.
- El 308 de `/cuestionario.html`, anotado como asunto abierto.
- Cabeceras de seguridad y métricas. Eso es la épica 50.

## Notas de la iteración

_Pendiente._

## Avance · 2026-09-03

### Decisiones cerradas

- **ADR-015** · Claude Code no ejecuta wrangler contra la cuenta. Regla comprobable
  —todo lo que ejecute lleva `--local`, salvo `wrangler pages dev`— reflejada en
  `CLAUDE.md`. El motivo queda en la ADR: al iniciar sesión, la herramienta quedó
  autorizada con permisos amplios sobre la cuenta, y «no toca producción» pasó de
  ser una descripción de la realidad a ser una intención.
- **ADR-014** · Dos respaldos con papeles distintos. Time Travel para el error
  propio, con **7 días** en el plan gratuito; la exportación a
  `d1/respaldo-banco.sql`, versionada, como respaldo oficial; exportación atada a
  cada cambio de contenido; restauración ensayada siempre contra pruebas.

### Decisión nueva, tomada sobre la marcha

**La ruta oficial para crear una base es la línea de comandos, no el panel.** La
tarea decía «la crea el autor en el panel, salvo que la decisión 1 resuelva otra
cosa», y la práctica resolvió otra cosa: la base de pruebas se creó con
`wrangler d1 create`. Se adopta esa ruta porque se copia, se repite idéntica para
las dos bases y deja registro de qué se ejecutó y cuándo; el panel queda documentado
como alternativa equivalente, para mirar o para cuando la herramienta no esté. Si el
autor prefiere lo contrario, se cambia el paso 1 del manual y esta nota.

### Lo que quedó hecho

| | Dónde |
|---|---|
| Entorno de vista previa apuntando a la base de pruebas | `wrangler.toml`, bloque `[[env.preview.d1_databases]]` |
| Señal de entorno | Variable `ENTORNO` por entorno; `/api/estado` la devuelve; el pie del cuestionario la muestra cuando no es producción |
| Procedimiento de respaldo y restauración | `90-manual/respaldo-y-restauracion.md` |
| Manual consolidado, con las dos bases y la ruta de creación resuelta | `90-manual/capa-de-datos-y-base-d1.md` |
| Vistas previas públicas, anotado | Paso 5 del manual |

### Evidencia

**El entorno se distingue sin abrir el panel.** En local:

```
/api/estado → {"ok":true,"datos":{"servicio":"capa de datos","entorno":"local",
               "enlace_d1":"presente","consulta_d1":"correcta"}, ... }
```

**Las vistas previas leen la base de pruebas.** Comprobado por el autor sobre la
dirección de vista previa de la rama `prueba-i13`: `/api/prueba` devolvió el valor
original del `saludo`, mientras producción tenía el valor cambiado a mano. Dos
respuestas distintas para el mismo extremo, que es la demostración de que son dos
bases.

**Las credenciales no están en el repositorio.** Se puso un archivo de credenciales
de verdad en cada ruta y se comprobó que git no lo ve:

```
.wrangler/config/default.toml    IGNORADO
.dev.vars                        IGNORADO
.dev.vars.produccion             IGNORADO
.env                             IGNORADO
```

`git ls-files` no devuelve ningún archivo de credenciales versionado. La sesión de
wrangler vive fuera del proyecto, en
`%APPDATA%\xdg.config\.wrangler\config\default.toml`. Lo único de Cloudflare que se
versiona son los identificadores de las bases, que nombran pero no dan acceso
(ADR-012).

**Las direcciones de vista previa son públicas.** Cualquiera con la dirección puede
abrirlas. No expone nada nuevo —el repositorio ya es público y la base de pruebas
solo tiene material de juguete—, pero queda dicho en el manual. Restringirlas es
materia de la épica 50.

### Qué falta para cerrar

Todo lo que queda exige comandos contra la cuenta, que ejecuta el autor (ADR-015):

1. **El ensayo de restauración contra pruebas**, destruyendo un dato de verdad. El
   procedimiento paso a paso está en `90-manual/respaldo-y-restauracion.md`.
2. **La primera exportación de producción** a `d1/respaldo-banco.sql`.
3. **Comprobar que una escritura en pruebas no aparece en producción**, consultando
   ambas bases. Es el primer criterio de aceptación y se cumple de paso durante el
   ensayo.
4. **Ver la señal de entorno en la nube.** La variable `ENTORNO` se añadió después
   de la última verificación, así que todavía no se ha visto responder `produccion`
   ni `pruebas` en una dirección real.
5. **El ensayo completo del manual desde su paso 1**, que arrastra el criterio 7 de
   la iteración 12. Las dos bases ya existen, así que este ensayo necesita una base
   que todavía no exista: se hace la próxima vez que haya que crear una.

## Cierre · 2026-09-04

### La verificación que faltaba, hecha por el autor

**El ensayo de restauración, contra la base de pruebas.** Se destruyó un dato de
verdad y se recuperó desde el archivo exportado:

```
tras el DELETE          pruebas: 1 fila (entorno)
en el mismo momento     produccion: 2 filas, con saludo = "Verificado por Felipe el 3 de septiembre"
tras DROP + importar    pruebas: 2 filas, con saludo = "La tuberia hasta D1 funciona."
```

La consulta a producción en medio del ensayo es lo que demuestra el aislamiento: la
misma tabla, en el mismo instante, con contenidos distintos en cada base. No es una
afirmación, son dos respuestas.

**El respaldo oficial existe.** `d1/respaldo-banco.sql`, exportado desde producción
y versionado en `main`, con su `PRAGMA`, su `CREATE TABLE` y los dos `INSERT`. El
riesgo de formato ruidoso que ADR-014 dejaba anotado no se materializó en esta
primera exportación.

**La señal de entorno, en la nube:**

```
produccion    {"entorno":"produccion","enlace_d1":"presente","consulta_d1":"correcta"}
vista previa  {"entorno":"pruebas","enlace_d1":"presente","consulta_d1":"correcta"}
```

**Time Travel.** `time-travel info` devuelve el marcador actual pero no menciona
plazo, y la ayuda del comando dice «within the last 30 days», que es texto genérico:
la herramienta no sabe en qué plan está la cuenta. Los 7 días del plan gratuito
quedan confirmados contra la documentación de límites de D1, y ADR-014 lleva ahora
un aviso explícito para que nadie la «corrija» con lo que dice el `--help`.

### El hallazgo que salió al final, y su arreglo

`npm run verificar` fallaba desde PowerShell, porque git no está en el PATH de ese
terminal, y fallaba **a mitad de camino**: la construcción ya había reescrito el CSS
cuando reventaba el `git diff`. Quedó como **H-011** en la auditoría técnica, y se
resolvió dentro de esta misma iteración porque bloqueaba el último criterio: el
manual manda ejecutar ese comando, y un procedimiento que falla según el terminal no
se puede seguir sin conocimiento previo.

`verificar` pasó a ser `scripts/verificar.mjs`. Guarda el CSS, construye, compara, y
**solo después** busca git. La comprobación central —¿el CSS corresponde a su
fuente?— ya no necesita git ni sabe en qué terminal está; git quedó como un extra
que añade el segundo dato, si además está commiteado.

Termina siempre con un veredicto en un recuadro:

```
VERIFICADO                                            codigo 0
DESFASADO                                             codigo 1
VERIFICACION PARCIAL  ***  ESTO NO ES UN EXITO  ***    codigo 2
```

Los tres se provocaron de verdad antes de darlos por buenos: el normal, uno con el
CSS editado a mano, y uno ejecutado en un entorno vaciado —sin git en el PATH y sin
las variables desde las que se derivan las rutas donde suele estar instalado—, o sea
la simulación de un equipo donde git no aparece por ninguna vía.

De paso apareció el mismo problema con otra herramienta: `npm run cuestionario`
invocaba `python3`, que en Windows es un alias de Microsoft Store de cero bytes.
Cambiado a `python`, con el intérprete esperado anotado en la cabecera del script.

### El recorrido en frío, hecho de verdad · 2026-09-04

El autor clonó el repositorio en una carpeta temporal, corrió `npm install` y
`npm run verificar` sin tocar nada más. El recorrido completó: la construcción
corrió entera —«3 entradas copiadas a dist/», «17 recursos enlazados, ninguno
roto»— y el script entregó su veredicto en vez de reventar. Eso es lo que el
criterio pedía comprobar.

El veredicto fue `DESFASADO` sobre `static/css/icons.css`, y **no correspondía a
un CSS desactualizado**: reproducido después en un clon local, el contenido es
idéntico y lo único que cambia son los finales de línea. Quedó como **H-012**, y
se resolvió dentro de esta misma iteración.

**El recorrido se repitió después del arreglo**, en un clon limpio recién bajado:
`VERIFICADO`, código 0, sin la nota de finales de línea. Es el mismo escenario
donde la vez anterior salió `DESFASADO`, así que sirve de prueba de las dos cosas
a la vez: que el criterio se cumple y que H-012 está cerrado de verdad.

### Deuda que esta iteración deja abierta

- **El ensayo completo del manual desde su paso 1**, que arrastra el criterio 7 de
  la iteración 12. Las dos bases ya existen; el ensayo necesita una que no exista,
  así que quedó **aplazado explícitamente a la iteración 21**, que crea la base del
  banco de preguntas y obliga a recorrer el manual desde el principio.
- **`prueba_tuberia` sigue en las dos bases de la nube.** La primera migración del
  esquema real tiene que retirarla de ambas, no solo de producción.
- **Las direcciones de vista previa son públicas.** Anotado; restringirlas es épica
  50.
