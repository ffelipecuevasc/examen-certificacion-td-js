# Iteración 24 · Preparar producción

**Épica:** 20 · Persistencia de preguntas
**Estado:** ⚪ No iniciada
**Depende de:** iteración 23 (cerrada el 2026-09-08, commits `48c32c7` y `8deaab1`)
**Continúa en:** iteración 25, que llena el banco

## Objetivo

Dejar la base de producción **lista para recibir el banco**: esquema aplicado, las
dos migraciones registradas, `prueba_tuberia` fuera, y las deudas técnicas
acumuladas saldadas. Al terminar, producción está vacía pero correcta, y lo único
que le falta es contenido.

## La frontera con la iteración 25

Se decidió el 2026-09-08 partir en dos lo que antes era una sola iteración, porque
juntaba dos trabajos de naturaleza distinta: uno de infraestructura, corto y
peligroso, y otro de contenido, largo y minucioso.

| Iteración 24 · esta | Iteración 25 |
|---|---|
| Esquema en pruebas y en producción | Conversión de los dos bancos al formato de encargo |
| Las dos migraciones, en orden y registradas | Carga de las 368 preguntas |
| Borrado de `prueba_tuberia` | Redacción de las justificaciones |
| Deudas técnicas acumuladas | Rescate de la marca de orden fijo |
| Respaldo antes de tocar producción | Instantánea desde la nube y retirada del banco viejo |

**Lo que esto significa para ADR-023:** el incumplimiento consciente declarado el
2026-09-08 **se subsana en la 25, no aquí**. Esta iteración no genera ninguna
instantánea: no habría nada que copiar. La declaración de incumplimiento se traslada
tal cual, con su fecha original intacta, al paso correspondiente de la 25.

## Decisión de diseño sin resolver

Hay una que esta iteración destapa y que nadie ha decidido. **Se nombra aquí en vez
de asumir una respuesta.**

**¿Qué ve un estudiante entre la 24 y la 25?**

Hoy el sitio publicado sirve la instantánea de respaldo con su aviso amarillo,
porque producción no tiene esquema y `/api/preguntas` devuelve `FALLO_CONSULTA`.
**Al aplicar el esquema, eso se acaba**: el extremo pasa a responder `200` con
`datos: []` y `meta.vacio: true`, el respaldo deja de activarse, y el sitio dice
«todavía sin contenido».

Es decir: hoy el estudiante ve ocho preguntas de juguete con un aviso honesto;
después de esta iteración vería **un cuestionario vacío** hasta que la 25 cargue el
banco. Es peor para el estudiante, aunque sea más correcto por dentro.

Las salidas posibles no son equivalentes y hay que elegir una:

- **No publicar entre la 24 y la 25.** El esquema se aplica en producción pero
  `main` no se empuja hasta que la 25 termine. El sitio sigue sirviendo el respaldo
  mientras tanto. Requiere que la 24 no toque nada del sitio, sólo la base.
- **Publicar y aceptar el cuestionario vacío**, si la 25 va a ser corta.
- **Juntar 24 y 25 en el tiempo** aunque estén separadas en el plan: aplicar el
  esquema y cargar el banco en la misma sesión de trabajo.

Quien decida esto lo documenta aquí con su motivo. **No se resuelve aplicando el
esquema y viendo qué pasa.**

## Tareas

### Preparación de la nube

- [ ] **Exportar el respaldo de producción antes de tocarla.** ADR-014. Hoy está
  vacía y el respaldo va a ser trivial, y ese es justamente el momento de
  practicar el procedimiento: cuando no hay nada que perder.
- [ ] **Aplicar el esquema en `examen-td-js-pruebas` primero, y después en
  `examen-td-js-produccion`.** Las dos migraciones, `001` y luego `002`, en ese
  orden, en las dos bases. Lo ejecuta el autor por ADR-015.
- [ ] **Comprobar que las dos migraciones quedaron registradas**, con
  `SELECT * FROM migracion;` en cada base. Dos filas, no una.
- [ ] **Borrar `prueba_tuberia` de producción.** Deuda abierta desde la iteración
  12. Requiere un `DROP` escrito a mano.

> **Aviso heredado, escrito el 2026-09-05. Aplicar el esquema NO borra
> `prueba_tuberia`.** Comprobado: `001-banco-de-preguntas.sql` no la menciona en
> ninguna línea. Correr la migración y dar la tabla por retirada es el error que
> este aviso existe para evitar. Y **antes de escribir el `DROP` hay que confirmar
> contra qué base apunta**, comparando el uuid: pruebas es
> `c01df3c9-c2a1-4379-ab2e-249e933cece4`, producción es
> `cff1686b-3b24-4892-9a10-4306684e0127`. Por **H-015**, el nombre que se teclea es
> lo único que decide dónde cae el comando; `wrangler.toml` no acota nada en remoto,
> y el uuid es la única red que existe.
>
> **En la base de pruebas ya no está**: la retiró el vaciado del ensayo remoto del
> 2026-09-05. Lo pendiente es sólo producción.

> **Corrección heredada, dejada escrita en vez de borrada.** Documentos anteriores
> decían que `--env preview` «es obligatorio» para `examen-td-js-pruebas`. **En
> remoto no lo es**, y creerlo produjo H-015: wrangler busca el nombre en la cuenta
> y encuentra la base igual. En local sí es obligatorio, porque allá resuelve sólo
> desde `wrangler.toml`. Se sigue escribiendo por higiene, pero **no protege de
> nada**: no lo trates como una barrera.

> **Aviso heredado, escrito el 2026-09-08. El orden con la comprobación del modo
> degradado ya se cumplió.** Esa comprobación era anterior a aplicar el esquema y
> **se ejecutó sobre el sitio publicado el 2026-09-08**, con el resultado esperado:
> `/api/estado` en `200`, `/api/preguntas` en `503` con `FALLO_CONSULTA` y
> `usar_respaldo: true`, el aviso de ADR-008 con su fecha y ocho preguntas dibujadas.
> La ventana se aprovechó antes de cerrarla. Esta iteración es la que la cierra.

### Deudas técnicas acumuladas

- [ ] **El contador de la portada del cuestionario.** Dice «105 preguntas · 7
  módulos» escrito a mano en `cuestionario.html` (línea 60) y en el
  `<meta description>` (línea 7). El 2026-09-08 la pantalla mostraba «105
  preguntas» arriba y «copia guardada en el sitio (8 preguntas)» en el pie, al
  mismo tiempo. **El número tiene que salir del dato que se muestra, o
  desaparecer.**
- [ ] **El punto ciego de `/api/estado`.** `functions/api/estado.js` hace
  `SELECT 1 AS vivo` y concluye `consulta_d1: "correcta"`. Esa consulta pasa
  igual con la base sin esquema: el 2026-09-08, `/api/estado` informaba que todo
  estaba bien mientras `/api/preguntas` devolvía `503`. **Una comprobación que no
  puede fallar no comprueba nada.**
- [ ] **`MODULE_TYPELESS_PACKAGE_JSON`.** Aparece ya en tres caminos distintos: el
  generador de la instantánea, el guardián del escapado y
  `scripts/administrar-banco.mjs`. Cada guion nuevo que importe código del sitio
  suma uno. Ver H-020.
- [ ] **Ejecutor de migraciones.** Deuda anotada en la iteración 23: la `002` no es
  repetible y hoy el orden lo pone una persona. Con dos migraciones es
  manejable; conviene decidir si se escribe ahora o cuando sean más.

### Cierre

- [ ] **Dejar constancia del estado en que queda producción**, para que la 25 empiece
  sabiendo qué encontró: tablas creadas, filas en `migracion`, tablas vacías,
  `prueba_tuberia` ausente.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no
razonando sobre él.

- [ ] **El esquema está en las dos bases de la nube.** Se muestra la lista de tablas
  de `examen-td-js-pruebas` y de `examen-td-js-produccion`, y coinciden con lo
  que declaran las migraciones.
- [ ] **Las dos migraciones están registradas en las dos bases.** `SELECT * FROM
      migracion;` devuelve `001-banco-de-preguntas` y `002-fecha-de-modificacion` en
  cada una. Se muestra la salida, no un resumen de ella.
- [ ] **La columna `fecha_modificacion` existe de verdad**, no sólo en el libro de
  migraciones. Se comprueba contra el esquema real de la tabla. Es la
  comprobación que faltó en la rama `antigravity` y por la que el esquema y el
  libro divergieron en silencio.
- [ ] **`prueba_tuberia` ya no está en producción.** Se muestra la lista de tablas
  antes y después del `DROP`, y el uuid de la base contra la que se ejecutó.
- [ ] **Se confirmó el uuid antes de cada comando contra producción.** Se muestra el
  cotejo, no la intención de haberlo hecho.
- [ ] **El respaldo de producción se exportó antes de tocarla**, y el archivo existe.
- [ ] **El contador de la portada ya no puede mentir.** Se demuestra cambiando el
  número de preguntas que se muestran y viendo que el contador lo acompaña, o
  mostrando que el contador desapareció.
- [ ] **`/api/estado` sabe fallar.** Se provoca un estado en el que el camino real
  está caído y se muestra que `/api/estado` ya **no** informa que todo está bien.
  Un diagnóstico que nunca ha dado un resultado negativo no está comprobado.
- [ ] **`MODULE_TYPELESS_PACKAGE_JSON` no aparece** en ninguno de los tres caminos.
  Se muestran las tres salidas limpias. Si la solución rompiera algo del sitio
  publicado, eso pesa más que el aviso: se anota y se deja.
- [ ] **`npm run verificar` termina en 0** con las cuatro comprobaciones en OK.
- [ ] **El estado de producción queda escrito** y coincide con lo que devuelve la
  base al consultarla.

## Lo que esta iteración no puede afirmar

- Que el banco esté cargado. No lo estará: es la iteración 25.
- Que ADR-023 esté cumplida. Se subsana en la 25, y hasta entonces la instantánea
  publicada sigue saliendo de la base local, como está declarado.
- Que el sitio sirva contenido real. Después de esta iteración, producción tiene
  esquema y cero preguntas.

## Notas de la iteración

_Pendiente._