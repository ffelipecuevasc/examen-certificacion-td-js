# Registro Antigravity - Épica 20: Persistencia de preguntas

## Decisiones Arquitectónicas del CLI de Administración
- **Herramienta Local (Node.js)**: Para cumplir la estricta directriz de la ADR-009, se ha construido completamente una herramienta command-line puramente local en Node.js, aislando los permisos de escritura del worker de Cloudflare Pages.
- **Inserción Estricta (Fail-Fast sin Upsert)**: Los comandos batch se operan única y exclusivamente a través de la cláusula `INSERT`. Se ha prohibido explícitamente el uso de transacciones con `ON CONFLICT DO UPDATE`. Si existen colisiones, el lote completo (transaction) aborta inmediatamente, protegiendo al sistema de estados asimétricos o actualizaciones no deseadas.
- **Manejo Minimalista de Errores DB**: Los errores emitidos por la ejecución de wrangler con respecto a SQLite (`CONSTRAINT`, `NOT NULL`, `FOREIGN KEY`) se interceptan mediante expresiones regulares de la salida estándar (child_process), sin acoplar dependencias adicionales al proyecto.
- **Transaccionalidad "Todo o Nada"**: Toda modificación de datos se compila a un archivo temporal `.sql` unificado (con `BEGIN TRANSACTION` y `COMMIT`). Esto obliga a que la integración de D1 sea coherente por defecto, impidiendo estados corruptos donde solo parte de un bulk haya sobrevivido.

## Implementación Técnica del CLI
El proyecto introduce cuatro nuevos archivos en el repositorio estructurando la tarea sin ensuciar los scripts base de build:

1. `scripts/admin-db.mjs`: Script punto de entrada que actúa como enrutador y coordinador principal.
2. `scripts/lib/db-validador.mjs`: Reutiliza `functions/api/_validacion.js` de modo estricto. Filtra datos ilegales y rechaza JSONs formados incorrectamente antes de que toquen el generador SQL. Falla asimétricamente: cualquier anomalía aborta el proceso (ej: `dificultad` con casing equivocado o llaves adicionales como un typo).
3. `scripts/lib/db-sql-generador.mjs`: Crea transacciones explícitas `BEGIN TRANSACTION ... COMMIT` basadas en un array secuencial inmutable. Para la edición de contenido a través del comando `actualizar`, sigue la regla estricta arquitectónica: primero ejecuta un `DELETE CASCADE` selectivo sobre las `alternativa` huérfanas y posteriormente utiliza `UPDATE` sobre la fila principal identificada (sin usar sintaxis UPSERT).
   - **Modificación Inyectada**: Agrega en la transpiliación `fecha_modificacion = CURRENT_TIMESTAMP`. Para soportar esto en la estructura de DB, se agregó un archivo intermedio de anclaje `d1/migraciones/002-fecha-modificacion.sql` que añade la columna y se inyectó a la base de pruebas local.
4. `scripts/lib/db-wrangler.mjs`: Envolvente local utilizando nativamente el módulo `child_process.exec()` para interceptar el `stdout/stderr` proveniente de la integración externa `wrangler d1 execute`. Implementa un diccionario local que mapea errores abstractos o feos (del tipo `UNIQUE constraint failed: alternativa.pregunta_id, alternativa.letra`) en textos 100% legibles y humanos.

### Ciclo de Flujo Interconectado Probado (Local DB)
A través de simulaciones contra el ambiente "juguete" con transacciones en error, logramos certificar lo siguiente:
- Rechazo nativo de campo erróneo inyectado y cancelación limpia del stack SQL.
- El trigger `UNIQUE` colisionando por duplicidad detiene `Wrangler (Exit 1)`. Nuestra `TRANSACTION` ejecuta un rollback de estado atómico de forma segura ante fallos intencionales generados, emitiendo explícitamente `[Rollback D1] ❌ Operacion rechazada..` por consola.
- **Regeneración Integrada Automática (ADR-008)**: Tan pronto la base de datos se modifica exitosamente a través del CLI en modo insert/update, la rutina interna auto-invoca al ejecutable `node scripts/generar-instantanea.mjs` bajo las sábanas. La instantánea (fallback) queda sincrónicamente respaldada sin requerir intervención extra por consola.

## Razones de la Estructuración
La estructura basada en el subdirectorio `scripts/lib/` aporta encapsulamiento e impide ensombrecer las tareas de despliegue principal (`build-dist.mjs`, `build-icons.mjs`). Se ha separado al coordinador (`admin-db.mjs`) de los mecanismos internos para maximizar la testabilidad a futuro. La integración recicla las reglas dictadas en `_validacion.js` para asegurar coherencia entre quien lee los datos y quien los escribe.

## Elementos Pendientes para Futuras Iteraciones (24+)
- **Migración del Banco Real**: Probar la fiabilidad y el performance de la herramienta ante la carga de las 368 preguntas finales a la DB de producción.
- **Circuit Breaker Remoto Activo**: El cli expone una bandera (flag) provisoria (`--remote`) que cambia el comportamiento nativo de invocación para impactar la DB desplegada en la nube; se asume probar y dominar el sistema de autenticación inter-barreras (`PreToolUse`).
- **Respaldo SQL Total Remoto**: Actualmente la herramienta realiza inserciones y regenera en vivo la "Instantánea" (usada para degradación offline), pero aún falta enlazar dentro del ecosistema el volcado transaccional y exportación total remota hacia `d1/respaldo-banco.sql` (regeneración dictada y requerida por la normativa madre de la ADR-023).
