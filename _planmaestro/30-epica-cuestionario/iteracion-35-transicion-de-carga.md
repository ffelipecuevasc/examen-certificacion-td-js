# Iteración 35 · Transición de carga

**Épica:** 30 · Cuestionario **Estado:** ⚪ No iniciada **Depende de:** iteración 32 cerrada. No depende de la 33 ni de
la 34.

## Objetivo

Que elegir un módulo no se sienta como un salto brusco de una zona vacía a una llena, sin que el estudiante espere un
milisegundo más de lo que tarda de verdad la carga.

## Contexto

_Creada el 2026-09-15 al partir la antigua iteración 33, por decisión del autor._ La tarea venía escrita así: hoy la
zona de preguntas pasa de vacía a llena de golpe y se siente burdo; va una barra que refleje la **carga real**, con el
logotipo de JavaScript encima, y un mínimo visible de unos 400 ms para que no parpadee cuando la respuesta es
instantánea.

Desde la 32 hay dos piezas con las que esto tiene que convivir: el foco se aparca en el mensaje «Cargando…» mientras
llega la respuesta, y al terminar el sitio desplaza y lleva el foco a la cabecera del módulo.

## Por qué no es una espera fija

Una espera fija miente en los dos sentidos. Con buena conexión hace esperar al estudiante sin ningún motivo. Con mala
conexión termina antes de que el módulo llegue, y la página dice «listo» cuando no lo está. **El único tiempo honesto es
el que la carga tarda de verdad.**

El mínimo de unos 400 ms no contradice esto: no es una espera, es un piso. Solo actúa cuando la respuesta llegó antes,
para que la transición no se vea como un parpadeo, y nunca alarga una carga que ya tardó más que eso.

## La decisión sin resolver, que se resuelve con evidencia al arrancar

**¿Se puede medir el progreso de la descarga de un módulo?**

Para dibujar una barra de progreso real, el navegador necesita saber cuánto pesa la respuesta antes de terminar de
recibirla. Una respuesta comprimida o enviada por partes normalmente no lo informa, y en ese caso **no hay avance que
medir**. Dibujar una barra que avanza igual sería inventar un número, y este proyecto no muestra números que no salgan
de un dato desde la iteración 24.

Por eso **el primer criterio de esta iteración es una comprobación, no una construcción**:

- **Si la respuesta permite medir**, la barra acompaña la carga real.
- **Si no lo permite**, el criterio pasa a ser un indicador de «cargando» **sin porcentaje** y sin nada que sugiera
  cuánto falta.

Lo que se encuentre se anota aquí con su evidencia antes de construir nada.

## Tareas

- [ ] Comprobar, contra el extremo local y contra producción, si la respuesta de
  `/api/preguntas?modulo=N` permite medir el progreso de la descarga, y anotar la evidencia en este archivo.
- [ ] Construir la transición según lo que diga esa comprobación.
- [ ] Hacer que conviva con el foco aparcado en «Cargando…» y con el desplazamiento a la cabecera de la 32.
- [ ] Respetar `prefers-reduced-motion`.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, no razonando sobre el código.

### Los provoca Claude Code

- [ ] **La decisión de medir o no medir está tomada con evidencia**, local y en producción, y anotada en este archivo
  antes de construir.
- [ ] **La transición refleja la carga real, no un tiempo inventado.** Se demuestra con una respuesta lenta y con una
  instantánea: en la primera la transición acompaña hasta que el módulo llega; en la segunda hay un destello breve y no
  una espera.
- [ ] **Nadie espera de más.** El tiempo entre elegir un módulo y verlo no crece respecto de lo que tarda la consulta
  más el mínimo visible. Se mide y se informa.
- [ ] **El camino más lento funciona:** en modo degradado, con la instantánea de unos 500 KB, la transición acompaña la
  carga entera y el aviso de ADR-008 sigue visible.
- [ ] **Una carga fallida no deja la transición colgada**: termina y da paso al mensaje de error, con el foco donde la
  32 lo dejó.

### Los comprueba el autor en el navegador

- [ ] **Con buena conexión no se nota espera**, y con la red limitada en DevTools la transición acompaña hasta el final.
- [ ] **Con `prefers-reduced-motion` activado**, la transición no anima, y la página sigue diciendo que está cargando.
- [ ] **Un lector de pantalla da a conocer que está cargando** una sola vez, sin repetirlo a cada paso.
- [ ] **El aterrizaje en la cabecera sigue ocurriendo** después de la transición, en escritorio y en teléfono.
- [ ] **La identidad visual se mantiene:** no entran colores fuera de la paleta.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que la carga sea más rápida.** Esta iteración cambia cómo se ve la espera, no cuánto dura. Hacerla más corta es
  trabajo de la épica 50, iteración 53.

## Notas de la iteración

_Pendiente._