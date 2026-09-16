# Contexto del examen de certificación

> **Origen de esta información.** Testimonio de estudiantes que rindieron el examen de
> certificación 2026 de Talento Digital para Chile, recogido por el autor. **No es
> información oficial** de Talento Digital. `vision.md` exige declarar ese origen de
> forma visible, y cualquier texto del sitio que se apoye en este documento tiene que
> hacerlo.
>
> **Registrado:** 2026-09-15. Estaba escrito solo dentro de un borrador de iteración, y
> no constaba en ninguna otra parte del proyecto.

## Para qué existe este documento

Varias decisiones de diseño dependen de cómo es el examen, no solo de qué temas evalúa. Si esta información vive dentro
de un archivo de iteración, desaparece de la vista cuando la iteración se cierra, y con ella el motivo de lo que se
construyó.

## Condiciones de la prueba

- **Proctorizada**, al modo de las certificaciones de Oracle o AWS.
- **Dos horas.**
- **En una plataforma web**, con **cámara, micrófono y audio encendidos** y el **navegador bloqueado**.
- **Empieza por el módulo 2.**

## Los dos formatos de pregunta

1. **Preguntas de alternativas.**
2. **Enunciados que hay que resolver programando.**

### Cómo es programar en el examen

Se habilita un editor incrustado que, en la práctica, es **un área de texto vacía**:

- **sin autocompletado,**
- **sin subrayado de errores,**
- **sin ejecutar el código.**

El estudiante escribe de memoria y sin poder comprobar nada. **Lo corrige una persona de Talento Digital, días
después.**

### Agregado el 2026-09-15 · programar entra en los siete módulos, y no siempre es escribir

Aportado por el autor a partir del testimonio de sus estudiantes. **Amplía lo de arriba; no lo corrige.**

1. **Los siete módulos evaluados piden programar.** No es una parte suelta del examen ni algo que aparezca solo en
   algunos módulos: del 2 al 8, todos.
2. **Programar toma dos formas**, y la segunda no estaba escrita acá: **escribir el código** en el área de texto
   vacía, tal como se describe arriba, **o revisar un código dado y señalar el error**. La segunda forma se responde
   igual de a ciegas —sin ejecutar, sin subrayado— pero lo que se pide no es producir, es diagnosticar.

### Agregado el 2026-09-15 · el lenguaje de cada módulo

Misma fuente y misma fecha. Qué se programa en cada módulo:

| Módulo | Lenguaje             |
|--------|----------------------|
| 2      | HTML5 y CSS3         |
| 3      | JavaScript           |
| 4      | JavaScript           |
| 5      | SQL                  |
| 6      | Node.js con Express  |
| 7      | Node.js con SQL      |
| 8      | Node.js con Express  |

**Dónde vive este dato en el código:** en `static/js/data/modules.js`, campo `lenguaje` de cada módulo, y en ningún
otro sitio. El aviso de programación de la portada arma su subtítulo con ese campo y el número del módulo, de modo
que corregir una fila de esta tabla es corregir una línea de código y nada más. Si esta tabla y ese archivo llegaran
a discrepar, manda el testimonio: se corrige el código.

### Agregado el 2026-09-15 · de dónde salieron los ejercicios de ejemplo

> **Corregido el 2026-09-15**, el mismo día en que se escribió. La primera redacción decía que los ejercicios se
> transcribieron **«al terminarlo, de memoria»**. **El autor no había dicho eso**: fue una forma de transcripción que
> quien escribió la sección dio por supuesta y atribuyó al testimonio. Lo que de verdad ocurrió está abajo, y cambia
> el peso de la fuente: no son un recuerdo posterior, son apuntes tomados **durante** el examen y con autorización
> explícita. Se corrige en vez de matizarse porque una fuente mal descrita se usa mal.

Aportado por el autor. Los bloques de «Código de ejercicios que podrían salir en tu examen» que muestra la portada
—`static/js/data/modules.js`, campo `ejercicios` de cada módulo— **no los inventó el autor ni salen de ningún manual**:

- **La mañana del examen oficial de 2026**, en una reunión por Zoom con el equipo de Talento Digital para Chile, **una
  encargada informó en vivo** que los estudiantes podían usar **cuaderno, teléfono o tablet** para tomar apuntes o
  desarrollar ejercicios. **En versiones anteriores estaba prohibido**, así que fue un cambio anunciado ese mismo día.
- **Con esa autorización, una estudiante anotó los ejercicios de código durante el examen**, para estudiar con ellos.
- **Otros estudiantes que también lo rindieron los corroboraron**, de modo que no dependen de una sola persona.

**Sin nombres, a propósito.** Quiénes fueron no se registra acá ni en ninguna parte del repositorio, que es público.

**Qué se puede afirmar y qué no.** Que son fieles a los ejercicios que cayeron en el examen de ese año: se anotaron
**durante** la prueba y con permiso, no se reconstruyeron después, y además están corroborados. **No** que vayan a
repetirse: por eso el rótulo del sitio dice «podrían salir en tu examen» y no «salen». Y **no** que sean el enunciado
textual del examen: son apuntes de una estudiante, no una copia oficial.

## Qué decisiones del proyecto se apoyan en esto

| Dónde                       | Qué se apoya en este documento                                                                          |
|-----------------------------|---------------------------------------------------------------------------------------------------------|
| Iteración 36                | Los bloques de «Código de ejemplo» de la portada se marcan como el formato real de una parte del examen |
| Iteración 36 · decisión 9   | El aviso de programación de cada módulo: que hay que programar, y en qué lenguaje                       |
| Iteración 36 · decisión 12  | El rótulo «Código de ejercicios que podrían salir en tu examen», y su verbo en condicional              |
| Portada, métrica «Formatos» | Los dos formatos de pregunta                                                                            |
| Épica 40 · Simulacro        | Duración y condiciones del simulacro cronometrado                                                       |

## Cómo se mantiene

- **Cuando un estudiante aporte un dato nuevo o contradiga uno de estos**, se anota aquí con la fecha y el año del
  examen al que se refiere. No se borra lo anterior: se marca como corregido y se dice por qué.
- **Si Talento Digital publica información oficial** que confirme o contradiga algo de aquí, esa fuente manda, y se
  cita.