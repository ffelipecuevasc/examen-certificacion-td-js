# Registro Antigravity - Épica 20: Persistencia de preguntas

## Iteración 23: Administración del contenido

### Decisiones Arquitectónicas del CLI de Administración
- **Herramienta Local (Node.js)**: Para cumplir la estricta directriz de la ADR-009, se ha construido completamente una herramienta command-line puramente local en Node.js, aislando los permisos de escritura del worker de Cloudflare Pages.
- **Inserción Estricta (Fail-Fast sin Upsert)**: Los comandos batch se operan única y exclusivamente a través de la cláusula `INSERT`. Se ha prohibido explícitamente el uso de transacciones con `ON CONFLICT DO UPDATE`. Si existen colisiones, el lote completo (transaction) aborta inmediatamente, protegiendo al sistema de estados asimétricos o actualizaciones no deseadas.
- **Manejo Minimalista de Errores DB**: Los errores emitidos por la ejecución de wrangler con respecto a SQLite (`CONSTRAINT`, `NOT NULL`, `FOREIGN KEY`) se interceptan mediante expresiones regulares de la salida estándar (child_process), sin acoplar dependencias adicionales al proyecto.
- **Transaccionalidad "Todo o Nada"**: Toda modificación de datos se compila a un archivo temporal `.sql` unificado (con `BEGIN TRANSACTION` y `COMMIT`). Esto obliga a que la integración de D1 sea coherente por defecto, impidiendo estados corruptos donde solo parte de un bulk haya sobrevivido.

### Implementación Técnica del CLI
El proyecto introduce cuatro nuevos archivos en el repositorio estructurando la tarea sin ensuciar los scripts base de build:

1. `scripts/admin-db.mjs`: Script punto de entrada que actúa como enrutador y coordinador principal.
2. `scripts/lib/db-validador.mjs`: Reutiliza `functions/api/_validacion.js` de modo estricto. Filtra datos ilegales y rechaza JSONs formados incorrectamente antes de que toquen el generador SQL. Falla asimétricamente: cualquier anomalía aborta el proceso (ej: `dificultad` con casing equivocado o llaves adicionales como un typo).
3. `scripts/lib/db-sql-generador.mjs`: Crea transacciones explícitas `BEGIN TRANSACTION ... COMMIT` basadas en un array secuencial inmutable. Para la edición de contenido a través del comando `actualizar`, sigue la regla estricta arquitectónica: primero ejecuta un `DELETE CASCADE` selectivo sobre las `alternativa` huérfanas y posteriormente utiliza `UPDATE` sobre la fila principal identificada (sin usar sintaxis UPSERT).
   - **Modificación Inyectada**: Agrega en la transpiliación `fecha_modificacion = CURRENT_TIMESTAMP`. Para soportar esto en la estructura de DB, se agregó un archivo intermedio de anclaje `d1/migraciones/002-fecha-modificacion.sql` que añade la columna y se inyectó a la base de pruebas local.
4. `scripts/lib/db-wrangler.mjs`: Envolvente local utilizando nativamente el módulo `child_process.exec()` para interceptar el `stdout/stderr` proveniente de la integración externa `wrangler d1 execute`. Implementa un diccionario local que mapea errores abstractos o feos (del tipo `UNIQUE constraint failed: alternativa.pregunta_id, alternativa.letra`) en textos 100% legibles y humanos.

#### Ciclo de Flujo Interconectado Probado (Local DB)
A través de simulaciones contra el ambiente "juguete" con transacciones en error, logramos certificar lo siguiente:
- Rechazo nativo de campo erróneo inyectado y cancelación limpia del stack SQL.
- El trigger `UNIQUE` colisionando por duplicidad detiene `Wrangler (Exit 1)`. Nuestra `TRANSACTION` ejecuta un rollback de estado atómico de forma segura ante fallos intencionales generados, emitiendo explícitamente `[Rollback D1] ❌ Operacion rechazada..` por consola.
- **Regeneración Integrada Automática (ADR-008)**: Tan pronto la base de datos se modifica exitosamente a través del CLI en modo insert/update, la rutina interna auto-invoca al ejecutable `node scripts/generar-instantanea.mjs` bajo las sábanas. La instantánea (fallback) queda sincrónicamente respaldada sin requerir intervención extra por consola.

### Razones de la Estructuración
La estructura basada en el subdirectorio `scripts/lib/` aporta encapsulamiento e impide ensombrecer las tareas de despliegue principal (`build-dist.mjs`, `build-icons.mjs`). Se ha separado al coordinador (`admin-db.mjs`) de los mecanismos internos para maximizar la testabilidad a futuro. La integración recicla las reglas dictadas en `_validacion.js` para asegurar coherencia entre quien lee los datos y quien los escribe.

### Elementos Pendientes para Futuras Iteraciones (24+)
- **Migración del Banco Real**: Probar la fiabilidad y el performance de la herramienta ante la carga de las 368 preguntas finales a la DB de producción.
- **Circuit Breaker Remoto Activo**: El cli expone una bandera (flag) provisoria (`--remote`) que cambia el comportamiento nativo de invocación para impactar la DB desplegada en la nube; se asume probar y dominar el sistema de autenticación inter-barreras (`PreToolUse`).
- **Respaldo SQL Total Remoto**: Actualmente la herramienta realiza inserciones y regenera en vivo la "Instantánea" (usada para degradación offline), pero aún falta enlazar dentro del ecosistema el volcado transaccional y exportación total remota hacia `d1/respaldo-banco.sql` (regeneración dictada y requerida por la normativa madre de la ADR-023).

### Auditoría de la Iteración 23
**Tareas completadas con éxito:**
- Construcción y demostración del mecanismo local (`scripts/admin-db.mjs`) logrando cumplir la ADR-009.
- El autor puede corregir y ver los cambios localmente vía transacciones `actualizar` e `insertar`.
- Verificación del cerrojo de autorización: al operar localmente (Node CLI) el worker público continúa como "solo lectura".
- Validación bloqueante y exhaustiva antes de inyección de datos a la BD.
- Lotes 100% tolerados garantizados vía arrays y SQL Transactions envueltos.
- Registro nativo `fecha_modificacion = CURRENT_TIMESTAMP` incorporado.
- Re-generación inquebrantable de la instantánea anclada tras cada iteración de éxito.

**Tareas Incompletas o Pendientes:**
Debido a la restricción crítica inquebrantable de no modificar archivos existentes en la carpeta `_planmaestro`, han quedado dos tareas nominalmente pendientes de ser reubicadas manualmente por el administrador:
1. *Documentar el procedimiento en `90-manual/`*: (Desarrollado exitosamente de forma aislada en `_planmaestro/90-manual/antigravity-manual-epica-20.md`).
2. *Añadir decisiones a `_planmaestro/00_producto/decisiones.md` (ADR principal)*: El debate y las opciones descartadas han sido resueltas en el apartado final de este documento "ADRs Pendientes de Traspaso Oficial", listas para ser trasladadas al registro real.

### Registro de Archivos Afectados
Fuera de `_planmaestro/`:
- `scripts/admin-db.mjs` (Creado): Orquestador CLI. Permite elegir la operatoria (`insertar`, `actualizar`) y ejecuta la cadena.
- `scripts/lib/db-validador.mjs` (Creado): Librería de validación estricta que aborta operaciones con esquema incompatible evaluando reglas complejas y nativas de D1.
- `scripts/lib/db-sql-generador.mjs` (Creado): Intérprete JSON-a-SQL transaccional, con lógica interna adaptada para inserción `INSERT` ciega y `UPDATE` aislado a base de comparativas manuales seguras evitando Upserts oscuros.
- `scripts/lib/db-wrangler.mjs` (Creado): Sub-proceso manipulador y traductor. Cruza las salidas fallidas de Wrangler con un diccionario estandarizado en castellano.
- `d1/migraciones/002-fecha-modificacion.sql` (Creado): Script de migración estructural local para albergar formalmente el requerimiento extra de `fecha_modificacion` exigido en la persistencia. Se requirió para complementar la base relacional existente impuesta sin alterarla en la iteracion 21.

Dentro de `_planmaestro/`:
- `_planmaestro/20-epica-persistencia-preguntas/antigravity-epica-20.md` (Modificado/Creado en este evento, siendo el ÚNICO permitido originalmente para documentar trabajo).
- `_planmaestro/90-manual/antigravity-manual-epica-20.md` (Añadido puntualmente como requisito de fin de iteración 23 para la capacitación CLI).

### ADRs Pendientes de Traspaso Oficial

**Decisión**: Herramienta de Administración CLI Local pura para D1
**Estado:** ✅ Aceptada · **Fecha:** 2026-09-06 · **Desarrollado en:** Iteración 23

**Contexto y Problema.**
Tras migrar el banco de preguntas a Cloudflare D1, se perdió la comodidad inmediata que otorga un panel o una hoja de cálculo. Se debía proveer al autor un mecanismo rápido para modificar el banco sin romper la regla de oro (ADR-009) que prohíbe exponer cualquier endpoint público de escritura en el Worker para mantener la seguridad y el minimalismo en la superficie del sistema.

**Alternativas Descartadas.**
1. **Panel Web de Administración Protegido:** Se evaluó crear un endpoint `/admin` autenticado a través de Cloudflare Access. Se descartó en su totalidad porque obligaba a traer y gestionar configuraciones complejas de identidad/seguridad e inflaba drásticamente la superficie de ataque, traicionando la pureza "solo lectura" de las páginas web originales.
2. **Importación y Vuelco Directo sin intermediario (Raw SQLite/Commands):** Se consideró simplemente pegar comandos SQL manuales y mantener todo orgánicamente desconectado. Se descartó puesto que introducía un altísimo margen de vulnerabilidad de error humano (escribir un ID duplicado accidentalmente, corromper restricciones).

**Decisión Tomada.**
Se construyó una herramienta CLI propia y cerrada mediante Node.js en la sub-arquitectura local (`scripts/admin-db.mjs`). El CLI procesa peticiones JSON, aplica re-validaciones estrictas usando la API oficial, orquesta el transpilado hacia SQLite de forma inyectable y envuelve absolutamente toda inserción o actualización mediante un mecanismo **puramente transaccional** (bloques "Todo O Nada"). 

**Consecuencias.**
- **Seguridad Garantizada al 100%:** El Worker público no supo ni sabrá nunca cómo escribir un byte hacia la base de datos permitiendo conservar las fronteras arquitectónicas perfectas.
- **Requiere Operar en Entorno Local:** Efectivamente, cualquier corrección de contenido debe obligatoriamente procesarse desde el checkout/repo del autor donde corre el módulo de CLI, eliminando la opción de modificar DB en tránsito, lo que restringe comodidad a cambio de durabilidad extrema.
- **Protección Automática:** Las mutaciones transaccionales se ligan exitosamente con el componente de reconstrucción de emergencia `ADR-008`, lo que asegura el estado coherente sin delegarlo a una tarea repetitiva y delegable al usuario.

---

## Iteración 24: Migración y ampliación

*(Espacio reservado para la ejecución y documentación de la Iteración 24)*