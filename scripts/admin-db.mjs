import { readFileSync } from "fs";
import { assertLoteValido } from "./lib/db-validador.mjs";
import { generarSQLTransaccional } from "./lib/db-sql-generador.mjs";
import { ejecutarD1 } from "./lib/db-wrangler.mjs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function run() {
  const operacion = process.argv[2];
  const mPath = process.argv[3];
  
  // Opciones extra
  const flags = process.argv.slice(4);
  const esRemoto = flags.includes("--remote");

  if (!operacion || !["insertar", "actualizar"].includes(operacion) || !mPath) {
    console.error("Uso: node scripts/admin-db.mjs <insertar|actualizar> <ruta_archivo_json> [--remote]");
    process.exit(1);
  }

  console.log(`[Admin] Iniciando operacion: ${operacion}`);
  console.log(`[Admin] Origen: ${mPath}`);
  console.log(`[Admin] Entorno: ${esRemoto ? "Produccion (Remoto)" : "Local"}`);
  
  let jsonData;
  try {
    const raw = readFileSync(mPath, "utf8");
    jsonData = JSON.parse(raw);
  } catch (err) {
    console.error(`[Error] Fallo al leer o parsear el archivo JSON: ${err.message}`);
    process.exit(1);
  }

  // Si es un objeto suelto, lo convertimos a array para facilidad
  const lote = Array.isArray(jsonData) ? jsonData : [jsonData];
  
  try {
    console.log("[Admin] Validando estructura y negocio...");
    assertLoteValido(lote);
    console.log("[Admin] ✅ Validacion limpia.");
  } catch (err) {
    console.error("[Regla Abortada] ❌", err.message);
    process.exit(1);
  }

  try {
    console.log("[Admin] Generando transaccion SQL...");
    const bloqueSql = generarSQLTransaccional(lote, operacion);

    console.log(`[Admin] Inyectando datos a D1 (${operacion})...`);
    await ejecutarD1(bloqueSql, esRemoto);
    console.log("[Admin] ✅ Operacion en base de datos ejecutada y comiteada exitosamente.");
    
    // Regenerar la instantanea como dicta el mandato de Iteracion 23
    console.log("\n[Admin] Regenerando instantanea de respaldo (ADR-008)...");
    const cmdInstantanea = esRemoto ? "node scripts/generar-instantanea.mjs --remote" : "node scripts/generar-instantanea.mjs";
    const { stdout } = await execAsync(cmdInstantanea);
    console.log(stdout.trim());
    console.log("[Admin] ✅ Instantanea regenerada y sincronizada.");
    
  } catch(err) {
    console.error(`\n[Rollback D1] ❌ Operacion rechazada. Ningun dato fue modificado.\n> ${err.message}`);
    process.exit(1);
  }
}

run();
