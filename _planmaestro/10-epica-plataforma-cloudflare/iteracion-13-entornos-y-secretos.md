# Iteración 13 · Entornos, secretos y procedimientos

**Épica:** 10 · Plataforma Cloudflare
**Estado:** 🔵 En curso · **Iniciada:** 2026-09-03
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

- [ ] Crear la base D1 de pruebas. La crea el autor en el panel, salvo que la
  decisión 1 resuelva otra cosa.
- [ ] Declarar el entorno de vista previa en `wrangler.toml` para que apunte a la
  base de pruebas.
- [ ] Documentar cómo se sabe, sin ambigüedad, contra qué entorno se está
  trabajando: en el navegador, en la terminal y en el registro de despliegue.
- [ ] Verificar que `.wrangler/` y `.dev.vars` siguen ignorados, con evidencia.
- [ ] Establecer dónde viven las credenciales y confirmar que ninguna está en el
  repositorio.
- [ ] Escribir la ADR de la decisión 1 y reflejarla como regla en `CLAUDE.md`.
- [ ] Escribir la ADR de la decisión 2.
- [ ] Definir el procedimiento de respaldo: cada cuánto, dónde queda, cuánto dura y
  cómo se restaura.
- [ ] Probar la restauración contra la base de pruebas.
- [ ] Consolidar el manual de publicación en `90-manual/`. Ya existe material de las
  iteraciones 11 y 12; el trabajo es unificarlo, no escribirlo de nuevo.
- [ ] Revisar si los despliegues de vista previa quedan en direcciones públicas y,
  si es así, dejarlo anotado. El repositorio ya es público, así que no expone
  nada nuevo, pero conviene que esté dicho.

## Criterios de aceptación

- [ ] Existen dos bases D1 separadas, y se demuestra que una escritura en pruebas no
  aparece en producción. La demostración es una consulta a ambas, no una
  afirmación.
- [ ] Un despliegue de vista previa lee la base de pruebas, comprobado sobre una
  dirección de vista previa real.
- [ ] Está documentado cómo distinguir el entorno activo, y la señal es visible sin
  abrir el panel de Cloudflare.
- [ ] Ningún token, clave ni contraseña está en el repositorio. El `database_id` sí
  está y es correcto que lo esté, según ADR-012.
- [ ] Se verifica que un archivo de credenciales de Wrangler queda efectivamente
  ignorado, mostrando la comprobación.
- [ ] La ADR de la decisión 1 está publicada y su regla aparece en `CLAUDE.md`.
- [ ] La ADR de la decisión 2 está publicada y dice cuál es el respaldo oficial.
- [ ] El procedimiento de respaldo está documentado, incluyendo cuánto tiempo hacia
  atrás alcanza a cubrir.
- [ ] Se restauró un respaldo con éxito contra la base de pruebas, con evidencia:
  qué dato se destruyó, qué se restauró y cómo se comprobó que volvió.
- [ ] El manual de `90-manual/` permite a alguien sin contexto previo publicar una
  actualización desde un clon, sin preguntarle nada al autor.

## Fuera de alcance

- El esquema del banco de preguntas y el borrado de `prueba_tuberia`. Eso es la
  épica 20.
- El 308 de `/cuestionario.html`, anotado como asunto abierto.
- Cabeceras de seguridad y métricas. Eso es la épica 50.

## Notas de la iteración

_Pendiente._