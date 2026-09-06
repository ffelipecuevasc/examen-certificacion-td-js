/**
 * Transpilador de JSON a SQL para SQLite/D1.
 * Genera bloques puramente transaccionales. NO incluye ON CONFLICT DO UPDATE.
 */

// Escapa comillas simples en strings para SQL
function eqTxt(texto) {
  if (texto === null || texto === undefined) return "NULL";
  return `'${texto.replace(/'/g, "''")}'`;
}

/**
 * Genera un bloque SQL transaccional para procesar las preguntas.
 * @param {object[]} lote - Lista de preguntas validas
 * @param {string} operacion - 'insertar' | 'actualizar'
 * @returns {string} 
 */
export function generarSQLTransaccional(lote, operacion) {
  let sql = "BEGIN TRANSACTION;\n\n";

  lote.forEach((p, idx) => {
    if (operacion === "insertar") {
      // Insercion de la pregunta
      // ID es auto-generado por SQLite
      sql += `INSERT INTO pregunta (modulo, origen, numero_origen, enunciado, justificacion, dificultad, orden_fijo, estado, fecha_modificacion) VALUES (` +
        `${p.modulo}, ${eqTxt(p.origen)}, ${p.numero_origen}, ${eqTxt(p.enunciado)}, ` +
        `${eqTxt(p.justificacion)}, ${eqTxt(p.dificultad)}, ${p.orden_fijo}, ${eqTxt(p.estado)}, CURRENT_TIMESTAMP);\n`;

      // Como no sabemos el ID, pero sabemos que insertamos recien, extraemos el ultimo insertado?
      // SQLite/D1 en batch no admite last_insert_rowid() comodamente en secuencias multilineas sin variables.
      // Pero wait! Podemos delegarle al motor SQLite usar subqueries para las llaves foraneas.
      // INSERT INTO alternativa (pregunta_id, ...) VALUES ((SELECT id FROM pregunta WHERE origen = ... AND numero_origen = ...), ...)
      const fkSql = `(SELECT id FROM pregunta WHERE origen = ${eqTxt(p.origen)} AND modulo = ${p.modulo} AND numero_origen = ${p.numero_origen})`;

      p.alternativas.forEach((alt) => {
        sql += `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (` +
          `${fkSql}, ${eqTxt(alt.letra)}, ${alt.orden}, ${eqTxt(alt.texto)}, ${alt.es_correcta});\n`;
      });
    } else if (operacion === "actualizar") {
      // Si actualizamos, necesitamos identificarla inequivocamente. 
      // Por ADR, id es estable de por vida. PERO si no mandan id, podemos buscarla por origen y numero_origen y modulo.
      const matchCriteria = p.id ? `id = ${Number(p.id)}` : `origen = ${eqTxt(p.origen)} AND modulo = ${p.modulo} AND numero_origen = ${p.numero_origen}`;

      // Update basic fields. (Nota: No actualizamos estado con retiro o reemplazada_por aqui por simplicidad, aunque podria sumarse si el CLI evoluciona).
      sql += `UPDATE pregunta SET ` +
        `enunciado = ${eqTxt(p.enunciado)}, ` +
        `justificacion = ${eqTxt(p.justificacion)}, ` +
        `dificultad = ${eqTxt(p.dificultad)}, ` +
        `orden_fijo = ${p.orden_fijo}, ` + 
        `estado = ${eqTxt(p.estado)}, ` +
        `fecha_modificacion = CURRENT_TIMESTAMP ` +
        `WHERE ${matchCriteria};\n`;
      
      // Para las alternativas, lo mas limpio sin upsert es borrarlas y reinsertarlas.
      // D1/SQLite ejecutara esto secuencialmente. 
      // NOTA: Como 'alternativa' tiene ON DELETE CASCADE, borrar la pregunta borra alternativas pero un update no las borra.
      const fkSql = p.id ? `${Number(p.id)}` : `(SELECT id FROM pregunta WHERE ${matchCriteria})`;
      
      sql += `DELETE FROM alternativa WHERE pregunta_id = ${fkSql};\n`;

      p.alternativas.forEach((alt) => {
        sql += `INSERT INTO alternativa (pregunta_id, letra, orden, texto, es_correcta) VALUES (` +
          `${fkSql}, ${eqTxt(alt.letra)}, ${alt.orden}, ${eqTxt(alt.texto)}, ${alt.es_correcta});\n`;
      });
    } else {
      throw new Error("Operacion desconocida: " + operacion);
    }
    sql += "\n";
  });

  sql += "COMMIT;\n";
  return sql;
}
