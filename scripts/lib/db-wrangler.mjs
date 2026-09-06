import { exec } from "child_process";
import { promisify } from "util";
import { writeFileSync, unlinkSync } from "fs";

const execAsync = promisify(exec);

// Diccionario de traduccion de errores
const ERROR_MAP = {
  "UNIQUE constraint failed: pregunta.origen, pregunta.modulo, pregunta.numero_origen": "La pregunta ya esta registrada con ese origen, modulo y numero base.",
  "UNIQUE constraint failed: pregunta.enunciado": "Otra pregunta ya tiene exactamente el mismo enunciado. No se permiten enunciados duplicados.",
  "UNIQUE constraint failed: alternativa.pregunta_id, alternativa.letra": "Una de las preguntas tiene la misma letra asignada a multiples alternativas.",
  "UNIQUE constraint failed: alternativa.pregunta_id, alternativa.orden": "Una de las preguntas tiene el mismo orden asignado a multiples alternativas.",
  "CHECK constraint failed: es_correcta": "Validacion de alternativa correcta fallo (probablemente hay multiples correctas y viola el indice o valor no 1/0).",
  "FOREIGN KEY constraint failed": "Referencia de tabla foranea invalida. Verifica que el modulo indicado exista en la BD (entre 2 y 8).",
  "NOT NULL constraint failed": "Falta un campo obligatorio en la base de datos."
};

/**
 * Traduce un error de SQLite a humano.
 */
function traducirError(stderr) {
  for (const [clave, fraseHumana] of Object.entries(ERROR_MAP)) {
    if (stderr.includes(clave)) {
      return `Error de Base de Datos: ${fraseHumana}`;
    }
  }
  // Alternativa para indice parcial de multiplicidad de correctness.
  if(stderr.includes("alternativa_una_correcta")) {
     return "Error de Base de Datos: Existe mas de una alternativa correcta para la misma pregunta.";
  }
  
  return `Error en la DB: ${stderr}`;
}

export async function ejecutarD1(sqlContent, usarRemoto = false) {
  const tmpFile = ".temp_admin_lote.sql";
  writeFileSync(tmpFile, sqlContent, "utf8");

  try {
    let comando = `npx wrangler d1 execute examen-td-js-produccion --file ${tmpFile}`;
    if (!usarRemoto) {
      comando += " --local";
    } else {
      comando += " --remote";
    }

    const { stdout, stderr } = await execAsync(comando);
    
    // Wrangler sometimes logs non-fatal warnings to stderr. We should just return success if exec didn't throw.
    return { ok: true, output: stdout };
  } catch (error) {
    const errorOutput = error.stderr || error.stdout || error.message;
    throw new Error(traducirError(errorOutput));
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch(e) {}
  }
}
