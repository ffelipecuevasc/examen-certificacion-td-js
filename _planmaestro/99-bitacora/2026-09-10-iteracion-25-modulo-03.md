# Iteración 25 · Módulo 3 · el lote que probó el procedimiento

**Épica:** 20 · Persistencia de preguntas · **Cerrado:** 2026-09-10

*Primera entrada de lote y no de iteración. La 25 dura siete y su contexto no puede
esperar al séptimo; la regla está en `99-bitacora/README.md` y nace de ADR-030.*

## Qué se entregó

Las **61 preguntas del módulo 3** —50 del banco nuevo y 11 del viejo— cargadas en
producción, comprobadas contra los dos archivos de origen y publicadas. El banco pasó
de **52 a 113 preguntas**, y el sitio muestra dos módulos.

Con el lote se entregaron además las piezas que el módulo 2 dejó pendientes de
escribir: el **procedimiento de once pasos**, el **sello de procedencia** que hace
cumplir ADR-028 sin depender de que alguien recuerde, y el **ensayo local**
obligatorio antes de tocar la nube.

## Qué salió distinto de lo planeado

**Era la primera prueba del procedimiento, y ese era el punto.** El criterio se fijó
por escrito antes de saber el resultado: *si el módulo 3 sale sin sorpresas, el
procedimiento sirve.* Salió con dos, y **ninguna del tipo que obliga a rehacer nada**
— nada como H-027 o H-028 del módulo 2, donde una comprobación no comprobaba y una
herramienta no arrancaba.

**El procedimiento se escribió antes de convertir, a propósito.** Decisión del autor:
escrito después habría descrito el módulo 3 en vez de servir del 4 al 8. La rama más
cara —qué hacer cuando aparece una corrección— vivía hasta entonces en la memoria de
quien había hecho el módulo 2, y ese era el hallazgo de fondo que había que arreglar.

**Una corrección, y de otra clase que las del módulo 2.** `m03#10` explicaba
`[] == false` por «coerción hacia **booleanos**», y `==` convierte a **número**. El
resultado que afirmaba era correcto y el motivo, falso: quien memorizara esa regla la
aplicaría mal de inmediato, porque `[] == false` da `true` mientras `[] ? 1 : 2` da
`1`. En el módulo 2, **cuatro de cinco** correcciones fueron de enunciado; aquí la
única es de una **alternativa correcta**, que es el texto en que ancla el comprobador.

**ADR-028 se disparó sola, y no provocada.** Al corregir, `comprobar-conversion`
respondió `SIN VEREDICTO · el encargo no corresponde a sus orígenes` **nombrando los
dos orígenes que se habían movido** y dejando intactos los otros dos. Es la
diferencia entre una comprobación provocada en un ensayo y una que hace su trabajo.
Y al regenerar el documento de revisión se conservaron **57 aprobaciones** y se
devolvieron a cero **exactamente las 4** que cambiaron: eso es lo que hace tolerable
la regla de reconvertir el módulo entero.

**La sesión de wrangler se enfría.** La carga murió con un **7403** en la primera
llamada de una terminal recién abierta. Aquí se abre una terminal por carga y entre
carga y carga pasan días. El manual describía `login` como «una sola vez por equipo»,
frase escrita cuando la única pregunta era cómo autenticarse la primera vez. Se
agregó un **paso 0** con `whoami`, que despierta y pregunta a la vez.

**Y el texto del banco compila CSS.** `npm run verificar` dio `DESFASADO` sin que
nadie tocara estilos. La instantánea vive dentro del `content` de Tailwind, así que
una justificación del módulo 2 que menciona `.collapse()` —hablando de Bootstrap—
hizo que Tailwind emitiera esa clase: **80 bytes nuevos en `style.css`**. No es un
defecto; lo que estaba mal era el procedimiento, que listaba dos archivos generados
donde son tres.

## Decisiones tomadas

| ADR | Qué fija |
|---|---|
| **ADR-028** | Una corrección aprobada obliga a reconvertir y recomprobar el módulo entero, aparezca cuando aparezca. Con la condición de que la reconversión sea **automática y comprobada**: el encargo se sella con la huella de sus orígenes y tres pasos se niegan si se movió |
| **ADR-029** | Una alternativa **imprecisa pero fiel al examen se conserva** y el matiz va en la justificación; se corrige solo la que **enseña una regla falsa**. Extiende ADR-017, que se ocupaba de los distractores: ésta se ocupa de la correcta, que es la única que el alumno se lleva aprendida |
| **ADR-030** | Los mensajes de commit no pasan de **200 caracteres**; el porqué va íntegro a la bitácora y al registro. Si un commit corto deja algo sin explicar, es señal de que falta escribirlo allá |

## Hallazgos

| Código | Qué |
|---|---|
| **H-031** | El texto del banco compila CSS. La instantánea está dentro del `content` de Tailwind |
| **H-019** *(actualizado)* | Separados **el disparador** —sesión fría, resuelto con el paso 0— y **el defecto** —no sabe leer el sobre de error con `notes: [...]`—, que sigue abierto |
| **H-029** *(actualizado)* | Intento de provocación: **no se reprodujo**, 0 fallos de 8 por cada forma de restaurar. Sigue en amarillo, con una hipótesis alternativa descartada y escrito qué mirar si vuelve |

Se arregló además, por barato, el mensaje que pedía «mira la base antes de repetir»
sin decir cómo: ahora imprime el comando exacto, con el módulo sacado del sello del
encargo. En la carga del módulo 3 el autor no lo tenía a mano y repitió a ciegas;
salió bien por suerte y no por método.

## Queda pendiente

- **H-019, el defecto**, no el disparador. Anotado y no resuelto por decisión del
  autor: el 7403 fue amable porque falló **antes** de escribir, y otro fallo de la
  nube daría el mismo `SIN VEREDICTO` con la carga quizá ya dentro. Resolver el login
  **tapa el síntoma**, y con él tapa el aviso de que el defecto existe.
- **H-029**, en amarillo, con su intento de provocación anotado.
- **Las dos barreras leídas y no provocadas** —`administrar-banco` y
  `generar-instantanea`—, y el ensayo del manual de la iteración 23. Los hace el autor.
- **H-004**: segundo dato de la serie. La posición 2 concentró **40%** en el módulo 2
  y **39%** en el 3, con 25% como reparto parejo. Dos lotes independientes, bancos
  escritos por manos distintas. Todavía no se afirma —faltan cinco— pero la
  expectativa cambió: ahora lo razonable es suponer sesgo y esperar que lo desmientan.

> ### Lo que nadie ve todavía, y sube el precio de revisar mal
>
> **La justificación no aparece al responder.** No es un defecto de esta carga:
> **nunca se implementó**, es trabajo de la épica 30, iteración 33, y ahí se queda —
> no se adelanta.
>
> La consecuencia es la que importa: **hasta la épica 30 las justificaciones no las
> lee nadie más que el autor al revisarlas.** Un error de redacción no lo va a
> descubrir ningún estudiante ni ninguna comprobación automática; se descubriría
> **meses después**, el día que esa pantalla exista, con cinco módulos más ya
> cargados encima.
>
> Es el argumento más fuerte que hay para no aprobar el documento de revisión en
> diagonal, y por eso queda escrito aquí y no solo en el registro.
