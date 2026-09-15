# Iteración 36 · Orientación del estudiante en la portada

**Épica:** 30 · Cuestionario **Estado:** ⚪ No iniciada **Orden de trabajo:** se ejecuta **después de la 33 y antes de la
34** (decisión del autor, 2026-09-15). No depende del código de la 33, la 34 ni la 35.

## Objetivo

Que `index.html` y la barra de navegación orienten a un estudiante que **no da por supuestas las convenciones de la
web**, y que la portada deje de publicar una cifra falsa.

## Por qué existe esta iteración

Los arreglos que la componen parecen inconexos —un enlace, una animación, un número, un texto junto a un bloque de
código— pero comparten una raíz, y es lo que justifica agruparlos:

**El sitio asume conocimientos de navegación que su público no tiene.** `vision.md`
describe a estudiantes **principiantes**, para quienes esta puede ser su primera certificación técnica, que estudian
desde el teléfono tanto como desde el computador y que leen poco y en diagonal. Que un logotipo lleve al inicio, que una
flecha signifique «esto se despliega», o que un bloque de código sea algo más que decoración, son convenciones
aprendidas. Quien no las tiene, no las deduce: simplemente no ve la funcionalidad.

Nada de esto es un defecto de implementación. Es una brecha entre lo que el sitio sabe comunicar y lo que su lector sabe
leer.

**Y hay un defecto que sí es de implementación, y está publicado hoy:** la portada dice que hay **21** preguntas de
práctica. Son 368. Confirmado en `index.html`:
`data-count="21"`, escrito a mano.

## Historial de este archivo

- **2026-09-15 · incorporada al repositorio.** Se redactó en otra sesión como «iteración 34» y el archivo nunca llegó al
  repositorio: solo existía su fila en el README de la épica, ya renumerada como 36 al partir la antigua 33. Al
  incorporarla se corrigió lo siguiente:
    - **El perfil del público** decía «personas adultas en reconversión, que estudiaron otra profesión», atribuido a
      `vision.md`. `vision.md` no dice eso: dice principiantes, posible primera certificación, teléfono y lectura en
      diagonal. Se ajustó a lo que el documento fundacional sí dice.
    - **El contexto del examen** se movió a `_planmaestro/00_producto/contexto-del-examen.md`. Es información de
      producto que sirve más allá de esta iteración, y dentro de un archivo de iteración nadie la volvería a encontrar.
    - **Un criterio no comprobable se reformuló:** «un lector que no conoce la convención entiende que las tarjetas se
      despliegan» no se demuestra mostrando el estado cerrado. Quedó como algo verificable.
    - **Las referencias** a la transición de carga apuntan a la 35.
    - **Las cuatro decisiones de abajo** las tomó el autor el 2026-09-15.

## Alcance

**Dentro:** la barra de navegación de `index.html` y `cuestionario.html`, y la portada.

**Fuera:** todo lo demás de `cuestionario.html`. La transición al cargar un módulo es la iteración 35. La página
`acerca-de.html` no es de esta iteración (ver decisión 2).

## Decisiones tomadas

### 1 · Se adelanta a la 34

La cifra falsa está publicada y la corrección no depende de la memoria, la justificación ni el repaso. Se prefirió
ejecutarla antes a renumerar por segunda vez en un día.

### 2 · El efecto del logotipo se copia de animate.css, con su aviso de licencia

El efecto `tada` se escribe en `tailwind.config.cjs`, que ya tiene `keyframes` y
`animation` en su `extend`. **No se instala ninguna dependencia:** se copian las líneas del efecto, no el paquete
(decidido el 2026-09-10).

**La licencia no es MIT.** animate.css se publica bajo la **Hippocratic License 2.1**, y esa licencia pide atribución.
El autor decidió reunir las atribuciones de las herramientas con licencia en una página `acerca-de.html`, que **todavía
no existe ni tiene iteración asignada**. Por eso:

- **El aviso viaja con las líneas copiadas desde el primer commit:** un comentario junto al efecto en
  `tailwind.config.cjs` con el origen, el copyright y la licencia. Así el proyecto no queda un solo día con código ajeno
  sin atribuir mientras la página no exista.
- **`acerca-de.html` queda anotada en `registro_log.md`** como pendiente sin asignar, con la atribución de animate.css
  como uno de sus contenidos obligatorios.

### 3 · El efecto del logotipo es solo de escritorio, y se declara

El logotipo del hero lleva `hidden lg:block`: no se muestra bajo `lg`. El autor decidió aceptarlo. **El estudiante que
abre la portada desde el teléfono no ve ni el logotipo ni su efecto**, y esta iteración no lo cambia.

### 4 · La cifra de preguntas se inyecta al construir, leyendo la instantánea versionada

Tres motivos:

1. **Hereda una garantía que ya existe.** `npm run verificar` comprueba que la instantánea dice lo mismo que el respaldo
   versionado, pregunta a pregunta.
2. **Se actualiza en el flujo que ya existe.** Cada recarga del banco regenera la instantánea (regla 5 de ADR-025), y el
   siguiente despliegue corrige la cifra.
3. **No agrega consultas a D1.** Pedirla a `/api/estado` sumaría lecturas a la base en cada visita a la página más
   visitada del sitio, y desde el 2026-09-01 D1 corta las consultas de quien supera el límite diario del plan gratuito.

**Descartadas:**

- **Escribirla a mano otra vez, con 368.** Es exactamente el defecto que se arregla:
  dentro de tres meses vuelve a mentir. La iteración 24 dejó escrito ese error.
- **Pedirla al abrir la página.** Por el motivo 3, y porque obliga a decidir qué se muestra cuando no responde.

**Si la instantánea no se puede leer al construir, el build falla con un mensaje claro.**
Publicar un número de reserva sería inventarlo.

## Decisión sin resolver, a cerrar con el autor al arrancar

**¿Qué dispara el efecto del logotipo, y cuántas veces?** Al cargar la página, al pasar el ratón, cada cierto tiempo… Un
efecto que se repite sin parar mientras el estudiante lee compite con el texto; uno que ocurre una sola vez al cargar
puede pasar inadvertido. El logotipo ya tiene una animación continua (`animate-floaty`), y el nuevo efecto tiene que
convivir con ella.

## Contexto que condiciona la tarea de los bloques de código

Está en `_planmaestro/00_producto/contexto-del-examen.md`. Lo esencial para esta iteración: una parte del examen
consiste en **resolver enunciados programando** en un área de texto sin autocompletado, sin marcado de errores y sin
ejecutar. Los bloques de «Código de ejemplo» de la portada **tienen ese formato**, y hoy nada lo dice.

Ese contexto viene del **testimonio de estudiantes que rindieron el examen 2026**, no de Talento Digital. `vision.md`
exige declarar el origen no oficial del material: lo que la portada diga sobre el formato del examen tiene que dejarlo
claro.

## Tareas

- [ ] **Añadir «Inicio» a la barra de navegación** de `index.html` y
  `cuestionario.html`, apuntando a la portada. El logotipo y el título **conservan**
  su enlace: se suma una forma visible a la que ya existe, no se reemplaza.
- [ ] **Hacer más notorio el efecto del logotipo del hero**, copiando las líneas del efecto de animate.css con su aviso
  de licencia (decisión 2).
- [ ] **Inyectar la cifra de preguntas al construir** desde la instantánea versionada (decisión 4).
- [ ] **Hacer evidente que las tarjetas de «Qué entra en cada módulo» se despliegan.**
  Además de la flecha, algo que lo diga con palabras y que se mueva lo suficiente para atraer la vista.
- [ ] **Marcar los bloques de código como lo que son:** el formato real de una parte del examen, con color, ícono y un
  texto que lo diga sin rodeos y que declare el origen testimonial de esa información.
- [ ] **Revisar las otras tres métricas** —7 módulos, 2 formatos, JWT—, confirmar que siguen siendo ciertas y anotar de
  dónde sale cada una y si puede desfasarse.
- [ ] **Anotar `acerca-de.html` en `registro_log.md`** como pendiente sin asignar (decisión 2).

## Criterios de aceptación

### Los provoca Claude Code

- [ ] **«Inicio» está en la barra de las dos páginas y apunta a la portada**, comprobado sobre el HTML que se publica
  (`dist/`).
- [ ] **El logotipo y el título siguen apuntando al inicio** en las dos páginas.
- [ ] **No se instaló ninguna dependencia.** `package.json` y `package-lock.json` no tienen paquetes nuevos: se muestra
  el diff.
- [ ] **Las líneas copiadas llevan su aviso de licencia** en el mismo archivo: origen, copyright y Hippocratic License
  2.1.
- [ ] **La cifra de preguntas del HTML publicado sale de la instantánea.** Hoy dice 368.
- [ ] **La cifra acompaña a la instantánea, provocado.** Se construye con una instantánea de prueba con otra cantidad de
  preguntas y la cifra publicada cambia con ella. **La instantánea versionada no se modifica:** `git diff` sin cambios
  en
  `static/js/data/instantanea-banco.js` al terminar, como en la 33.
- [ ] **Sin instantánea legible, el build falla** con un mensaje que dice por qué, y no publica ninguna cifra.
  Provocado.
- [ ] **Las animaciones nuevas quedan bajo la regla de `prefers-reduced-motion`** que ya tiene `src/input.css`,
  comprobado en el CSS generado.
- [ ] **Las otras tres métricas tienen origen anotado**, y la iteración dice cuáles pueden desfasarse.
- [ ] **`npm run verificar` termina en 0**, con sus cinco comprobaciones en OK.

### Los comprueba el autor en el navegador

- [ ] **Desde `cuestionario.html`, «Inicio» lleva a la portada**, en escritorio y en teléfono.
- [ ] **El efecto del logotipo se nota en escritorio**, y lo que lo dispara es lo que se decidió al arrancar.
- [ ] **Una tarjeta cerrada dice con palabras que se despliega**, legible sin tocarla, también en teléfono.
- [ ] **Los bloques de código se leen como formato del examen**: el texto lo dice, y el mensaje no depende solo del
  color (comprobado en escala de grises).
- [ ] **El texto sobre el formato del examen declara que viene del testimonio de estudiantes**, no de Talento Digital.
- [ ] **La portada se ve bien en teléfono** con todo lo añadido.
- [ ] **El contraste de lo añadido es legible.**
- [ ] **Con `prefers-reduced-motion` emulado**, las animaciones nuevas no se mueven.
- [ ] **Sin errores de consola** en la portada.
- [ ] **Tras el push, la portada publicada dice 368.**

## Lo que esta iteración no puede afirmar

- **Que el estudiante entienda mejor el examen.** Se puede comprobar que la información está y se ve; que cumpla su
  función pedagógica lo dirá el uso.
- **Que el efecto del logotipo llegue al teléfono.** No llega, por decisión (decisión 3).
- **Que la cifra coincida con D1 en todo momento.** Dice lo que dice la instantánea, que entre una recarga del banco y
  el siguiente despliegue puede ir detrás.
- **Que el formato del examen descrito sea el oficial.** Es testimonio de estudiantes, y así se declara.
- Nada sobre el resto de `cuestionario.html`.

## Notas de la iteración

_Pendiente._