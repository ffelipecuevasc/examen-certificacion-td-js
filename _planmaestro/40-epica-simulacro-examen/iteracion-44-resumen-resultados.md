# Iteración 44 · Resumen de resultados

**Épica:** 40 · Simulacro de examen
**Estado:** ⚪ No iniciada
**Depende de:** iteración 43, y la enmienda de ADR-022 (decisión E1 de la épica).

## Objetivo

Cerrar el intento con un resumen que diga si se aprobó el simulacro con el criterio del
examen real, y sobre todo qué estudiar.

## Contexto

Es la pantalla que justifica todo el simulacro. Un porcentaje aislado no sirve de nada; lo
útil es «fallaste 7 de 17 preguntas del módulo 7, vuelve a transacciones y Sequelize».

## Historial de este archivo

- **2026-09-16 · reescrita.** El autor decidió mostrar si se aprobó o reprobó el simulacro
  con el 60 % del examen real, y que las omitidas cuenten como incorrectas. Eso choca con
  la restricción de vocabulario de ADR-022, que queda como condición previa (E1). Se agregó
  la reutilización de la justificación de la iteración 34.

## ⚠️ Condición previa: enmienda de ADR-022

ADR-022 prohíbe hoy «aprobado» y «reprobado» en toda la épica. **Esta iteración no se
construye hasta que ADR-022 tenga una actualización fechada** que diga qué palabras quedan
permitidas, con qué forma, y cuáles siguen prohibidas. Ver el README de la épica. Los
criterios de vocabulario de abajo se ajustan a esa enmienda al abrir la iteración.

## Decisiones tomadas

### 1 · El resumen dice si se aprobó el simulacro

Decidido por el autor el 2026-09-16, sujeto a E1:

- **Se aprueba con al menos el 60 % de respuestas correctas sobre el total del intento.**
  Con 120 preguntas, 72 correctas. Si un intento trae menos preguntas (decisión 3 de la
  41), el umbral es el 60 % de ese total, redondeado hacia arriba.
- **Las omitidas y las agotadas por tiempo cuentan como incorrectas** (decisión 1 de la 43).

### 2 · La justificación reutiliza la pieza de la iteración 34

La revisión dibuja la justificación con el mismo componente de la 34, que ya está escapado
y probado con contenido hostil a escala. No se escribe una segunda forma de dibujarla.

## Decisiones sin resolver

### 3 · Conservar o compartir el resumen (la decide el autor)

¿El resumen se pierde al salir, se guarda en el navegador o se puede compartir? Guardarlo
roza el historial de intentos, que está fuera de alcance. **Pendiente.**

### 4 · La revisión de 120 preguntas en el teléfono (la decide el autor)

120 preguntas con su justificación es una página muy larga. La iteración 34 resolvió algo
parecido con «Ver por qué». ¿Se muestra todo, solo las incorrectas por defecto, o se agrupa
por módulo? **Pendiente.**

## Tareas

- [ ] Resultado global: correctas, incorrectas (separando respondidas mal y omitidas),
  porcentaje y si se aprobó el simulacro.
- [ ] Desglose por módulo, ordenado de peor a mejor desempeño.
- [ ] Tiempo empleado, total y promedio por pregunta.
- [ ] Revisión pregunta a pregunta con la respuesta dada, la correcta y la justificación.
- [ ] Enlaces desde cada módulo débil hacia su sección en `index.html`.
- [ ] Botón para rendir otro intento.
- [ ] Resolver las decisiones 3 y 4.

## Criterios de aceptación

Cada uno se cierra con evidencia producida **provocando** el comportamiento, con intentos
simulados de resultado conocido.

### Los provoca Claude Code

- [ ] **Las cifras cuadran**: correctas + respondidas mal + omitidas = total del intento.
- [ ] **El porcentaje se calcula con las omitidas como incorrectas.**
- [ ] **El umbral de aprobación es exacto en el borde**: con 120 preguntas, 72 correctas
  aprueba y 71 no. Provocado con intentos simulados de esas cifras, y con un intento de
  total menor.
- [ ] **El desglose por módulo suma el total del intento** y está ordenado por desempeño,
  con un criterio de desempate documentado.
- [ ] **La revisión muestra, para cada pregunta, qué respondió el estudiante, cuál era la
  correcta y la justificación**, dibujada con la pieza de la 34.
- [ ] **Las omitidas y las agotadas se distinguen de las respondidas mal** en la revisión,
  aunque cuenten igual.
- [ ] **Cada módulo del desglose enlaza a una sección que existe** en `index.html`.
- [ ] **Rendir otro intento pide un intento nuevo al extremo** y no reutiliza el anterior.
- [ ] **Un intento que termina por tiempo llega a un resumen coherente** con las mismas
  reglas.
- [ ] **El vocabulario de la pantalla cumple ADR-022 enmendada**: se comprueba sobre el
  texto dibujado, buscando la lista de palabras prohibidas de la enmienda.
- [ ] **`probar:escapado` cubre la revisión.**
- [ ] **Los guiones del sitio siguen en verde** y `instantanea-banco.js` sin cambios.

### Los comprueba el autor en el navegador

- [ ] **El resultado se entiende a la primera**, incluido por qué se aprobó o no.
- [ ] **El desglose dice qué estudiar** sin tener que interpretar números.
- [ ] **La revisión se puede recorrer cómodamente en el teléfono.**
- [ ] **Ninguna frase sugiere una certificación**, leída en pantalla.
- [ ] **Sin errores de consola.**
- [ ] **`npm run verificar` termina en 0.**

## Lo que esta iteración no puede afirmar

- **Que aprobar el simulacro signifique aprobar el examen real.** Imita su criterio en la
  parte de alternativas, pero no incluye la programación ni puede garantizar que el
  estudiante no haya visto las respuestas (ADR-022).

## Notas de la iteración

_Pendiente._