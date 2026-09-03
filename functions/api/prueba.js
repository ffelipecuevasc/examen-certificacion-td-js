/**
 * GET /api/prueba — lectura de la tabla de juguete.
 *
 * Existe para demostrar que el dato viaja de verdad desde D1 hasta el navegador,
 * y desaparece cuando el banco real ocupe su lugar (epica 20). No es contenido:
 * es el pulso de la tuberia.
 *
 * La tabla se crea con d1/juguete.sql.
 */
import { respuestaError, respuestaOk, soloLectura } from './_comun.js';

export const onRequest = soloLectura(async ({ base }) => {
  const consulta = base.prepare(
    'SELECT clave, valor, actualizado_en FROM prueba_tuberia ORDER BY id'
  );

  const { results, meta } = await consulta.all();

  // Cero filas es una respuesta correcta con la lista vacia, no un error. La
  // diferencia esta explicada en functions/api/_comun.js y es la que decide si el
  // sitio cambia a la instantanea de respaldo.
  return respuestaOk(results ?? [], { filas_leidas: meta?.rows_read ?? null });
});
