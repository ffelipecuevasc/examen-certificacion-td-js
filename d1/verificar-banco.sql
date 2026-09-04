-- Comprobaciones que el esquema NO puede hacer cumplir por si solo.
--
-- La frontera importa y es facil de confundir, asi que queda escrita aca y en
-- _planmaestro/90-manual/esquema-del-banco.md:
--
--   Lo garantiza la BASE, siempre, sin que nadie corra nada:
--     - ninguna pregunta pasa de cuatro alternativas (CHECK letra + UNIQUE)
--     - ninguna pregunta tiene dos alternativas con la misma letra
--     - ninguna pregunta tiene dos alternativas correctas (indice unico parcial)
--     - ninguna alternativa apunta a una pregunta inexistente (llave foranea)
--     - ninguna pregunta apunta a un modulo inexistente (llave foranea)
--     - ninguna pregunta retirada carece de motivo (CHECK)
--     - ningun enunciado se repite, y ningun origen se carga dos veces (UNIQUE)
--
--   NO lo puede garantizar la base, y por eso existe este archivo:
--     - que las alternativas sean exactamente cuatro (la base solo impide pasarse)
--     - que exista al menos una correcta (el indice solo impide que haya dos)
--     - que ninguna pregunta activa este sin justificacion
--     - que ningun modulo se quede sin preguntas activas
--
-- Es una sola sentencia a proposito: devuelve cero filas cuando todo esta bien,
-- y una fila por problema cuando no. El envoltorio que la ejecuta convierte esas
-- filas en un fallo ruidoso.
--
-- Correr en local: npm run datos:verificar-banco

SELECT
    'alternativas distintas de cuatro' AS comprobacion,
    'pregunta ' || p.id || ' (modulo ' || p.modulo || ', ' || p.origen
      || ' #' || p.numero_origen || '): tiene ' || COUNT(a.id) AS detalle
  FROM pregunta p
  LEFT JOIN alternativa a ON a.pregunta_id = p.id
  GROUP BY p.id
  HAVING COUNT(a.id) <> 4

UNION ALL

SELECT
    'sin ninguna alternativa correcta',
    'pregunta ' || p.id || ' (modulo ' || p.modulo || ', ' || p.origen
      || ' #' || p.numero_origen || ')'
  FROM pregunta p
  WHERE NOT EXISTS (
    SELECT 1 FROM alternativa a WHERE a.pregunta_id = p.id AND a.es_correcta = 1
  )

UNION ALL

SELECT
    'activa sin justificacion',
    'pregunta ' || id || ' (modulo ' || modulo || ')'
  FROM pregunta
  WHERE estado = 'activa'
    AND (justificacion IS NULL OR trim(justificacion) = '')

UNION ALL

SELECT
    'modulo sin preguntas activas',
    'modulo ' || m.numero || ' - ' || m.titulo
  FROM modulo m
  WHERE NOT EXISTS (
    SELECT 1 FROM pregunta p WHERE p.modulo = m.numero AND p.estado = 'activa'
  )

ORDER BY 1, 2;
