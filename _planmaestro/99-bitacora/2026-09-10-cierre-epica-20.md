# Cierre de la épica 20 · Persistencia de preguntas

**Fecha:** 2026-09-10 · **Iteración:** 25 · **Decide:** Felipe Cuevas

Las 368 preguntas quedaron en producción con sello `nube`. Lo que sigue es el cierre: dos
deudas que sí bloqueaban, dos decisiones del autor, dos filas que resultaron no ser deuda,
y una revisión de lo que quedaba suelto de las iteraciones 21 a 24.

---

## Las dos que bloqueaban, y por qué bloqueaban

El criterio para decidirlo no fue el tamaño del trabajo sino **de qué trata la épica**. Se
llama «persistencia de preguntas» y su entrega es el banco más su respaldo. Las dos deudas
abiertas eran, exactamente, que **el banco no estaba probado con el contenido real** y que
**el respaldo no se comparaba con nada**. Cerrar la épica dejándolas abiertas habría sido
declarar entregado lo que la épica define como su entrega.

### 1 · El escapado no estaba probado a escala (ADR-024)

ADR-024 aceptó que la iteración 22 lo verificara con **diez filas de juguete**, y lo
aceptó con una condición escrita: **hasta que hubiera banco real**. Ya lo hay.

Lo que había que probar no era el mecanismo —eso ya estaba— sino el material: el banco
trae **291 preguntas con comillas invertidas, 57 con comillas dobles y 16 con algo con
forma de `<etiqueta>`**. Esas 16 son el caso que ya rompió la página una vez, cuando un
ejemplo que contenía `<div>` se interpretó como etiqueta real.

`probar-escapado.mjs` ahora pide el banco entero, sin filtrar por módulo, y aplica a cada
texto las mismas dos afirmaciones que a la fila hostil: la forma cruda **no** puede
aparecer en el HTML, la forma escapada **sí**. Resultado: **2208 porciones de texto, 184
con algún carácter que escapar, ninguna cruda y ninguna perdida.**

Provocado rompiendo `esc()` —que dejara de escapar `<`—: salieron **22 etiquetas ajenas al
componente, entre ellas `script`**, y todas del propio material de estudio.

#### Lo que se corrigió dos veces por escribirlo de más

La primera versión exigía que **las justificaciones aparecieran en el HTML**. No aparecen:
mostrarlas al responder es trabajo de la épica 30, iteración 33, y no está implementado.
La comprobación habría marcado como defecto de escapado algo que es una función que no
existe. Se reemplazó por una afirmación que no caduca: **o se dibujan todas o ninguna**, y
un intermedio es texto perdido.

La segunda usaba el extremo filtrado por módulo. Revisaba 52 preguntas y **anunciaba «el
banco real»**. Es el mismo defecto que esta iteración documentó cuatro veces: una
comprobación que dice haber comprobado más de lo que comprobó.

#### El piso, que es lo que impide que vuelva a pasar

La sección revisa «lo que la base local tenga dentro». Con el banco real revisa 368; con
el de juguete revisaría 8 y **daría verde igual**, diciéndolo en una línea que nadie mira.

Ahora, con menos de 100 preguntas, el veredicto es **MECANISMO EN PIE, PERO NO A ESCALA**,
código 4, que `verificar-todo.mjs` traduce a `AVISO` y no a `OK`. Y nombra la salida:
`npm run datos:banco-local`, que vuelca el respaldo versionado en la base local sin nube y
sin credenciales.

> Se provocó bajando la base local al banco de juguete a propósito. Devolvió 4. No se
> dedujo mirando el código.

### 2 · Nadie comparaba la instantánea con el banco

Deuda abierta el 2026-09-08 tras el hallazgo de la `id 11`: la instantánea trajo una
pregunta que no era del banco y bloqueó la publicación un día. Se cazó **a mano**,
comparando dos números que nadie estaba obligado a mirar.

Ahora lo hace `scripts/comprobar-instantanea.mjs`, dentro de `npm run verificar`.

#### La decisión de diseño que importa: contra qué se compara

Contra `d1/respaldo-banco.sql`, no contra D1. Los dos archivos salen **del mismo acto** de
ADR-023, así que tienen que decir lo mismo. Pero la razón de fondo es otra:

**Ésta corre en local, sin credenciales y sin red.** Por eso cabe dentro de
`npm run verificar` y se ejecuta sola. Una comprobación que necesitara la nube sólo la
podría correr el autor, y una comprobación que hay que acordarse de correr es la que no se
corre. La deuda se cierra con algo que se ejecuta, no con una promesa de ejecutarlo.

Y por eso su veredicto dice en voz alta **lo que no prueba**: que el par corresponda a lo
que hay hoy en producción. Los dos pueden estar de acuerdo y los dos haberse quedado
atrás. Eso lo dice `comprobar-carga.mjs`, que sí consulta D1 y lo corre el autor.

#### Cinco sabotajes, y uno que hubo que mirar dos veces

Los cinco cazados. Pero `falta` lo caza **primero la comprobación del sello**, no la que se
quería ejercitar. Se miró la lista completa de problemas para confirmar que la de «falta
una pregunta» también disparaba. Dispara.

Es el mismo cuidado que esta iteración tuvo que aprender tres veces: **un sabotaje cazado
por la comprobación de al lado deja sin probar la que se estaba probando.**

---

## Un dato que cambió el criterio del peso

El criterio de nivel 2 pedía medir el peso de la instantánea y comprobar que el sitio la
aguanta. La instantánea pesa **487,8 kB**, que era el número que preocupaba.

**Pero el navegador no la baja.** `servicios/datos.js` la pide con `import()` dinámico, y
sólo cuando la capa de datos no responde:

```js
instantanea = await import('../data/instantanea-banco.js');
```

Medido sobre `dist/`:

| | |
|---|---|
| `cuestionario.html` | 13,9 kB |
| CSS + JS que sí se bajan | 86,9 kB |
| **Total al abrir la página, con el Worker en pie** | **~101 kB** |
| La instantánea, sólo si el Worker cae | 487,8 kB |
| `dist/` completo, 55 archivos | 634,9 kB |

Los 488 kB son el precio del **día malo**, no el de cada visita. Eso no vuelve el criterio
innecesario —hay que mirar la página con el banco real, y en teléfono— pero cambia qué se
está midiendo.

---

## Las decisiones del autor

### Ubicación del banco: se queda · **ADR-031**

Los siete `modulo-0N.json` siguen en `_planmaestro/00_producto/cuestionarios/`. La fila
llevaba cinco iteraciones abierta declarándolo «temporal».

Se cierra como **decidido**, no como pendiente, por tres razones: el riesgo que motivaba
el traslado —que las respuestas correctas terminaran en `dist/`— ya está cubierto donde
están, porque `LISTA_COPIA` no nombra `_planmaestro/`; mover rompería las **siete huellas
de procedencia** de ADR-028 sin comprar seguridad; y el banco fuente es material de
planificación, que es donde está.

La advertencia sobre `dist/` no se pierde: se traslada a la ADR, para el día que alguien
mueva el banco o agregue `_planmaestro/` a la lista blanca.

### El aplazamiento se anota sólo en la épica 20

Decisión del autor del 2026-09-10, y conviene entender por qué no es un detalle de
archivo. El ensayo aplazado cierra el **criterio 7 de la iteración 12**, que es de la
épica 10, ya cerrada. Lo natural habría sido anotarlo también allá.

**No se hace.** Motivo, en palabras del autor: el proyecto es para la tanda de bootcamps
que termina **entre septiembre y octubre de 2026**, y no hay certeza de que los bootcamps
de Talento Digital continúen el 2027. **Un aviso pensado para dentro de seis meses no le
sirve a nadie acá.**

La épica 10 queda intacta: su criterio 7 no se reabre, no se marca y no se le agrega nota.
El aplazamiento vive íntegro en la fila de la épica 20, con su fecha y su motivo.

### El ensayo del manual: **APLAZADO**, y escrito como aplazado

El autor leyó el manual entero y lo recorrió leyéndolo. Las etapas se entienden. **Pero no
lo aplicó**, y así queda escrito.

> **Motivo del aplazamiento:** la prioridad es cerrar las épicas, y el ensayo real se hará
> con las preguntas nuevas de `00_producto/cuestionarios/nuevos/` en una épica posterior.

**No se marca como ejecutado.** Este proyecto tiene cuatro hallazgos sobre comprobaciones
que decían haber comprobado sin hacerlo —H-018, H-023, H-027, H-030—, y marcar un ensayo
que no ocurrió sería agregar el quinto en el mismo registro que los documenta. Un
aplazamiento fechado cierra la casilla igual y no miente.

---

## Lo que resultó no ser deuda

Dos filas describían hechos, no tareas, y se cierran como informativas:

1. **La advertencia sobre los números de solapamiento.** «Retirar 37 preguntas no deja el
   banco sin duplicados» dejó de ser una limitación el 2026-09-09, cuando se decidió que
   un par que pregunta el mismo hecho con dos redacciones distintas es esperado y a veces
   deseable.

2. **«La 23 va antes que la 24».** Los dos criterios que dependían de la 24 se cumplieron
   durante la 25: la herramienta se probó contra el banco real en ocho cargas y el bloque
   de ADR-023 se recorrió entero siete veces. Describía una dependencia que **se resolvió
   sola** al llegar la iteración de la que dependía.

---

## La revisión de lo que quedaba suelto

Se recorrieron las **24 filas abiertas** con origen en las iteraciones 21 a 24.

**Diecisiete estaban hechas y su fila se había quedado atrás.**

> Eso no es un descuido menor. Un registro con filas abiertas que ya no lo están enseña a
> no leerlo, y entonces las que sí importan se pierden entre ellas. La mayoría se quedaron
> atrás por la misma causa: el trabajo lo cerró **otra** iteración, y quien lo cerró anotó
> su propia fila sin volver a la que lo había pedido.

De las siete que seguían abiertas de verdad: dos bloqueaban y se resolvieron, dos eran
decisiones del autor y se tomaron, dos eran informativas, y una —la consecuencia de
ADR-022 escrita donde el estudiante la vea— **es trabajo de la épica 40** y se trasladó
allá con su fila propia.

---

## La consecuencia de ADR-022, escrita · y fundida en vez de sumada

Aprobada por el autor y escrita el 2026-09-10, en dos lugares.

**En `cuestionario.html`**, como cuarta frase del párrafo bajo el título:

> Es material de estudio no oficial: practicar acá no acredita nada ante Talento Digital
> para Chile.

Va **antes** de responder y no en los resultados, porque una advertencia después del
puntaje llega tarde. Y dice «no acredita» en vez de «no es válido», que sonaría a que el
contenido es malo.

**En el pie de ambas páginas**, y acá el autor pidió una revisión que cambió el resultado:
comprobar que no quedaran dos frases diciendo lo mismo, y fundirlas si se solapaban.

Se solapaban. El pie ya decía:

> Material de apoyo no oficial, elaborado a partir del testimonio de alumnos que ya
> rindieron el examen 2026.

Contra la frase propuesta, el solape era doble —«no oficial» y el origen— y **lo único que
ADR-022 exigía y no estaba era la validez**. Sumarlas habría dejado un pie que repite dos
veces que el material no es oficial y nunca dice lo que importa. Quedó una sola:

> Material de apoyo no oficial, **sin validez de certificación**. Elaborado a partir de
> fuentes públicas, manuales oficiales y el testimonio de alumnos que ya rindieron el
> examen 2026.

De paso arregla algo que nadie había pedido: el origen ahora coincide con el que declara
`CLAUDE.md`, que nombra **tres** fuentes —fuentes públicas, manuales oficiales y
testimonios— mientras el pie nombraba una sola.

> `npm run build` reconstruido, etiquetas balanceadas en las dos páginas, y el CSS
> compilado **no cambió**: el texto nuevo no trae clases de Tailwind nuevas.

---

## H-033 · el manual de restauración mandaba borrar una tabla que ya no existe

`90-manual/respaldo-y-restauracion.md` decía `DROP TABLE IF EXISTS prueba_tuberia` antes de
volcar el respaldo. Era la única tabla cuando se escribió, en la iteración 13. Hoy el
respaldo crea **ocho objetos**, y seguirlo habría fallado con `table migracion already
exists` **en el momento exacto en que la base ya se perdió**.

Lo peor no es la lista vieja sino que **el párrafo de al lado explicaba la regla correcta**
—«el archivo contiene `CREATE TABLE` pero no `DROP TABLE`»— y seguía siendo cierto. Una
explicación correcta le da autoridad al comando obsoleto que tiene al lado.

**Su origen importa y queda escrito:** salió **volcando el respaldo**, no leyendo el
manual. Se cayó al cargarlo en la base local para probar el escapado a escala, y recién
buscando el porqué se miró el procedimiento. El manual llevaba desde la iteración 13 sin
que nadie lo recorriera, y el ensayo que lo habría recorrido está aplazado. **Lo encontró
un uso real, de paso, haciendo otra cosa** — la tercera vez en este proyecto que un defecto
de procedimiento aparece por usarlo y no por revisarlo.

Corregido: el procedimiento ya no lleva lista, manda mirar qué crea el respaldo. Queda
abierto que el lado remoto sigue siendo una lista escrita, aunque ahora venga con la
instrucción de comprobarla antes de usarla.

---

## Herramientas nuevas de este cierre

| Archivo | Qué hace |
|---|---|
| `scripts/comprobar-instantanea.mjs` | Compara la instantánea con el respaldo, pregunta a pregunta. Cinco sabotajes. |
| `scripts/banco-local.mjs` | Vuelca `d1/respaldo-banco.sql` en la base local, para que el escapado se pruebe a escala. |

`banco-local.mjs` deduce **del propio respaldo** qué objetos hay que borrar antes de
volcar, leyendo sus `CREATE`. No lleva lista escrita a mano: una lista a mano ya se quedó
corta mientras se escribía el guion —decía cuatro tablas, y el respaldo también creaba la
vista `pregunta_activa` y tres índices—. Es la misma lección de H-031, donde el arreglo
por lista de excepciones habría vuelto a romperse en el módulo siguiente.

Su barrera de ADR-015 (ADR-027) es de otra clase que la de los demás: no comprueba el
terminal, sino que **no hay forma de pedirle la nube**. La bandera de base local está
escrita dentro y el guion **se niega a correr si recibe cualquier argumento**.

### Tres cosas que se observaron al hacerlo

1. **Tras el retiro del banco viejo, los siete encargos ya no se cargan sin
   `--sin-cotejo`.** Es el funcionamiento correcto de ADR-028, pero deja la salida de
   emergencia convertida en el camino normal, y una salida de emergencia que se usa
   siempre deja de avisar.

2. **La capa 2 de la barrera se dispara con la palabra dentro de un comentario.** Escribir
   un guion cuyo comentario mencionaba la bandera remota fue rechazado, aunque el comando
   no la usaba. **Errar por ese lado está bien**, y su propio mensaje dice qué hacer.

3. **El respaldo no se puede volcar sobre una base que ya tiene tablas**: trae `CREATE
   TABLE` sin `IF NOT EXISTS`. El procedimiento de restauración de `90-manual/` describe
   el volcado sobre una base recién creada y no dice qué pasa si no lo está.

---

## Lo que este cierre no cubre

**No se revisaron las iteraciones 11, 12 y 13** —épica 10, ya cerrada— salvo donde alguna
fila suya seguía abierta y apareció en el recorrido. Si el cierre de la épica 20 quisiera
apoyarse en que la 10 está limpia, esa revisión es otra y no se ha hecho.
