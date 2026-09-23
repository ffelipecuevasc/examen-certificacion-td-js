/**
 * Comprueba que cualquier respuesta que no sea de la capa de datos enciende el
 * respaldo (ADR-008), sin servidor (iteracion 51).
 *
 * Por que existe este script:
 * La iteracion 51 decidio no construir nada que rechace peticiones: si el sitio se
 * pasa del plan gratuito, quien rechaza es Cloudflare. Y la documentacion de Pages
 * Functions NO dice que devuelve entonces —consultada el 2026-09-23—: ni el codigo,
 * ni si el cuerpo es HTML o JSON. Por eso esta prueba no apuesta por una forma. Le
 * pasa a `consultar()` todas las que una plataforma podria mandar —429 en HTML, 429
 * en un JSON ajeno, 503, la portada con 200, la red caida— y exige lo mismo de
 * todas: SIN_RESPUESTA, con `usar_respaldo` en true.
 *
 * Y para que eso no se cumpla por las malas —un cliente que mandara TODO al
 * respaldo pasaria igual—, tres controles con el sobre propio: uno que tiene que
 * encender el respaldo (FALLO_CONSULTA, que es lo que produce una consulta cortada
 * por la cuota de D1, segun `functions/api/_comun.js`), uno que NO
 * (METODO_NO_PERMITIDO), y una respuesta correcta.
 *
 * La prueba final es la del autor, contra el sitio publicado: el criterio del 429
 * de la iteracion 51. Esta es la mitad que se puede correr en cualquier terminal.
 *
 * Codigos de salida:
 *   0  EN PIE              los once casos dieron lo que tenian que dar
 *   1  FALLO               al menos uno no
 *   2  NO SE PUDO PROBAR   no se pudo cargar datos.js
 *
 * Uso: npm run probar:respaldo
 * DATOS_JS=<archivo> prueba otra copia de datos.js: es como se demuestra que la
 * prueba falla cuando el cliente se equivoca, sin tocar el real.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const DATOS_JS = process.env.DATOS_JS ?? join(AQUI, '..', 'static', 'js', 'servicios', 'datos.js');

const EN_PIE = 0;
const FALLO = 1;
const SIN_VEREDICTO = 2;

const LINEA = '='.repeat(72);

const html = (estado, cuerpo) => () =>
  new Response(cuerpo, { status: estado, headers: { 'content-type': 'text/html; charset=UTF-8' } });
const json = (estado, cuerpo) => () =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'content-type': 'application/json' } });

const RESPALDO = { ok: false, codigo: 'SIN_RESPUESTA', usar_respaldo: true };

/** [nombre, respuesta de mentira, lo que consultar() tiene que devolver] */
const CASOS = [
  ['429 en HTML: la pagina de error de la plataforma', html(429, '<!DOCTYPE html><title>Error 1027</title><h1>This website has been temporarily rate limited</h1>'), RESPALDO],
  ['429 en un JSON ajeno', json(429, { error: 'rate limited', code: 1027 }), RESPALDO],
  ['429 en un JSON que casi parece el nuestro', json(429, { ok: false, error: { code: 'too_many_requests' } }), RESPALDO],
  ['429 en un JSON con codigo pero sin usar_respaldo', json(429, { ok: false, error: { codigo: 'LIMITE' } }), RESPALDO],
  ['503 en HTML', html(503, '<h1>Service Unavailable</h1>'), RESPALDO],
  ['200 con la portada en HTML (la ruta cayo a los estaticos)', html(200, '<!DOCTYPE html><html>...</html>'), RESPALDO],
  ['la red cae: fetch rechaza', () => Promise.reject(new TypeError('fetch failed')), RESPALDO],
  ['JSON roto', () => new Response('{"ok":', { status: 502, headers: { 'content-type': 'application/json' } }), RESPALDO],
  // Los controles: el sobre propio manda.
  ['CONTROL: sobre propio, FALLO_CONSULTA (la cuota de D1 cae aqui)',
    json(503, { ok: false, error: { codigo: 'FALLO_CONSULTA', mensaje: 'x', usar_respaldo: true } }),
    { ok: false, codigo: 'FALLO_CONSULTA', usar_respaldo: true }],
  ['CONTROL: sobre propio, METODO_NO_PERMITIDO (no es motivo de respaldo)',
    json(405, { ok: false, error: { codigo: 'METODO_NO_PERMITIDO', mensaje: 'x', usar_respaldo: false } }),
    { ok: false, codigo: 'METODO_NO_PERMITIDO', usar_respaldo: false }],
  ['CONTROL: respuesta correcta', json(200, { ok: true, datos: [1], meta: { vacio: false } }), { ok: true }],
];

let consultar;
try {
  ({ consultar } = await import(pathToFileURL(DATOS_JS).href));
  if (typeof consultar !== 'function') throw new Error('datos.js no exporta consultar()');
} catch (error) {
  console.log(`${LINEA}\nNO SE PUDO PROBAR  ***  ESTO NO ES UN APROBADO  ***\n${LINEA}`);
  console.log(`No se pudo cargar ${DATOS_JS}: ${error.message}`);
  process.exit(SIN_VEREDICTO);
}

console.log(`${LINEA}\nEl respaldo se enciende ante cualquier respuesta ajena (iteracion 51)\n${LINEA}`);
console.log(`  cliente: ${DATOS_JS}\n`);

const fetchReal = globalThis.fetch;
const fallos = [];

for (const [nombre, respuesta, esperado] of CASOS) {
  globalThis.fetch = async () => respuesta();
  let obtenido;
  try {
    obtenido = await consultar('/api/preguntas?resumen=1');
  } catch (error) {
    obtenido = { excepcion: error.message };
  } finally {
    globalThis.fetch = fetchReal;
  }

  const distintos = Object.entries(esperado).filter(([campo, valor]) => obtenido?.[campo] !== valor);
  if (distintos.length) {
    fallos.push(nombre);
    console.log(`  FALLO  ${nombre}`);
    console.log(`         esperado ${JSON.stringify(esperado)}`);
    console.log(`         obtenido ${JSON.stringify(obtenido)}`);
  } else {
    console.log(`  ok     ${nombre}  ->  ${obtenido.ok ? 'ok' : `${obtenido.codigo}, usar_respaldo ${obtenido.usar_respaldo}`}`);
  }
}

console.log(`\n${LINEA}`);
if (fallos.length) {
  console.log(`FALLO  ***  ${fallos.length} de ${CASOS.length}  ***\n${LINEA}\n`);
  process.exit(FALLO);
}
console.log(`EN PIE  (${CASOS.length} de ${CASOS.length})\n${LINEA}\n`);
process.exit(EN_PIE);
