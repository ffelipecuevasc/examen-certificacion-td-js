# Auditoría técnica

Registro de hallazgos encontrados mientras se trabaja. Claude Code añade entradas
aquí; no las borra. Un hallazgo resuelto se marca como resuelto, con la iteración
que lo cerró.

**Gravedad:**
- 🔴 **Bloqueante** — impide que el sitio funcione o que se pueda publicar.
- 🟠 **Mayor** — el sitio funciona, pero hay riesgo real de romperlo o daño a la
  experiencia de una parte del público.
- 🟡 **Menor** — deuda técnica, inconsistencia o mejora de mantenibilidad.

**Estado:** ⚪ Abierto · 🔵 En curso · 🟢 Resuelto · ⏸️ Aceptado (se convive con él)

## Formato de una entrada

```
### H-NNN · Título breve
**Gravedad:** 🔴/🟠/🟡 · **Estado:** ⚪ · **Detectado en:** iteración NN · **Fecha:** AAAA-MM-DD
**Síntoma.** Qué se observa.
**Causa.** Por qué ocurre.
**Impacto.** A quién afecta y cuánto.
**Propuesta.** Qué haría falta para cerrarlo.
```

---

## Hallazgos bloqueantes

### H-001 · `src/input.css` estaba excluido del control de versiones
**Gravedad:** 🔴 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-02

**Síntoma.** Al clonar el repositorio, `npm run build` fallaba.
**Causa.** Una regla del `.gitignore` excluía la fuente de Tailwind, invirtiendo el
criterio: se ignoraba el código fuente y se versionaba el resultado.
**Impacto.** Nadie podía recompilar los estilos desde un clon limpio, ni siquiera el
propio autor desde otro equipo.
**Propuesta.** Eliminar la regla. Resuelto.

### H-002 · Los íconos no se mostraban en ningún contexto
**Gravedad:** 🔴 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-02

**Síntoma.** Todos los íconos invisibles salvo el logotipo de JavaScript.
**Causa.** Las máscaras CSS apuntaban a archivos SVG externos, que no se cargan bajo
`file://`. El fallo es silencioso: no hay error en consola.
**Impacto.** La interfaz completa perdía sus señales visuales.
**Propuesta.** Incrustar los SVG como data URI. Ver ADR-004. Resuelto.

## Hallazgos mayores

### H-003 · Texto sin escapar al insertarse con `innerHTML`
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-01

**Síntoma.** Un ejemplo de código que mencionaba `<div>` destruía el diseño de la
tarjeta que lo contenía.
**Causa.** El texto de los datos se insertaba con `innerHTML` sin escapar, y el
navegador interpretaba las etiquetas del ejemplo como marcado real.
**Impacto.** Cualquier contenido futuro que mencione una etiqueta HTML rompe la
página. Es además la puerta de entrada de una inyección si el banco de preguntas
pasa a alimentarse de una fuente externa.
**Propuesta.** Función `esc()` aplicada a todo texto proveniente de datos. Resuelto,
pero **debe reforzarse en la iteración 22**: con el banco en D1, el contenido pasa a
ser de origen externo y el escapado deja de ser una precaución para volverse un
requisito de seguridad. La regla es de doble filo: validar al escribir en la base y
escapar al insertar en el DOM.

### H-004 · Sesgo en la posición de la respuesta correcta
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Fecha:** 2026-09-02

**Síntoma.** En el banco de 105 preguntas, 50 respuestas correctas eran la
alternativa B.
**Causa.** Los cuestionarios de origen se redactaron sin controlar la distribución.
**Impacto.** Pedagógico: el estudiante aprende a responder por posición.
**Propuesta.** Barajar en cada carga. Ver ADR-006. Resuelto, aunque la distribución
del banco de origen sigue sesgada y conviene equilibrarla al ampliarlo.

### H-005 · Riesgo de publicar con el CSS compilado desactualizado
**Gravedad:** 🟠 · **Estado:** 🟢 Resuelto · **Cerrado en:** iteración 11 · **Fecha:** 2026-09-02

**Síntoma.** Si se agregan clases de Tailwind y no se recompila antes de publicar,
el sitio queda sin esos estilos.
**Causa.** El despliegue publica el repositorio tal cual. Ver ADR-005.
**Impacto.** Un estudiante puede encontrarse el sitio roto sin que el autor lo note.
**Propuesta.** Comprobación que recompile y verifique que no hay diferencias.

**Resolución · iteración 11.** ADR-010 traslada la compilación al despliegue:
Cloudflare Pages ejecuta `npm run build` y publica `dist/`, de modo que el CSS
servido se genera siempre desde la fuente del mismo commit. La causa desaparece —el
despliegue ya no publica el repositorio tal cual— y con ella el síntoma.

Queda un residuo menor y de otra naturaleza: la copia versionada de `static/css/`
puede desfasarse respecto a la fuente. Ya no afecta a lo que ve un estudiante,
porque no es lo que se publica. Se detecta con `npm run verificar`. La tarea de
convertir esa comprobación en automática sigue anotada en `registro_log.md`.

## Hallazgos menores

### H-006 · Atribución de terceros ausente
**Gravedad:** 🟡 · **Estado:** ⚪ Abierto

**Síntoma.** El repositorio no declara la licencia de los íconos ni del logotipo.
**Impacto.** Material Symbols se distribuye bajo Apache 2.0, que exige atribución.
El proyecto es público y educativo: corresponde predicar con el ejemplo.
**Propuesta.** Archivo de créditos y licencia propia del contenido.

### H-007 · El archivo generado de íconos se sirve completo en ambas páginas
**Gravedad:** 🟡 · **Estado:** ⏸️ Aceptado

**Síntoma.** `icons.css` incluye los cuarenta íconos aunque cada página use menos.
**Impacto.** Bajo. Se acepta mientras el volumen sea este; se revisa si crece.


---

## Hallazgos abiertos por la adopción de Workers y D1

### H-008 · Límites de uso del plan gratuito
**Gravedad:** 🟠 · **Estado:** ⚪ Abierto · **Fecha:** 2026-09-02

**Síntoma.** No hay ninguna vigilancia sobre cuánto consumo admite el plan gratuito
de Workers y D1, ni qué ocurre al alcanzarlo.
**Causa.** ADR-007 introduce servicios con cuota; el plan anterior no tenía ninguna.
**Impacto.** Un pico de uso —muy probable la semana previa a una fecha de examen, que
es justo cuando el material más importa— podría dejar el sitio sin datos. El
respaldo de ADR-008 mitiga el efecto, pero no evita el problema.
**Propuesta.** Medir el consumo real en la iteración 53, cachear las respuestas del
Worker y definir por escrito qué hacer si la cuota se agota.

### H-009 · Nueva superficie de escritura
**Gravedad:** 🟠 · **Estado:** ⚪ Abierto · **Fecha:** 2026-09-02

**Síntoma.** El proyecto pasa a tener, por primera vez, un camino capaz de modificar
datos.
**Causa.** El banco de preguntas deja de ser un archivo del repositorio.
**Impacto.** Hasta ahora, lo peor que podía pasarle al sitio era verse mal. Ahora
existe la posibilidad de que su contenido sea alterado por un tercero.
**Propuesta.** ADR-009 prohíbe exponer escritura al público. La iteración 23 define
el mecanismo de administración y la 51 verifica que no quedó ningún extremo abierto.

### H-010 · La comodidad de edición dejó de venir incluida
**Gravedad:** 🟡 · **Estado:** ⚪ Abierto · **Fecha:** 2026-09-02

**Síntoma.** El motivo original para sacar las preguntas del código era poder
corregirlas sin ciclo de desarrollador. Una hoja de cálculo traía esa comodidad de
fábrica; una base de datos no.
**Causa.** Consecuencia directa de ADR-007.
**Impacto.** Si la iteración 23 se salta o se resuelve a medias, el proyecto termina
con un banco que solo puede editarse escribiendo consultas: peor que el punto de
partida.
**Propuesta.** Tratar la iteración 23 como parte indispensable de la épica 20, no
como un extra.
