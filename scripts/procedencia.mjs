/**
 * La huella de los origenes de un modulo, y su cotejo (ADR-028).
 *
 * PARA QUE EXISTE
 *
 * Una correccion aprobada obliga a reconvertir y recomprobar el modulo entero,
 * aparezca cuando aparezca. Esa es la decision de ADR-028, y su condicion es que
 * la reconversion sea AUTOMATICA Y COMPROBADA, no un gesto manual que se pueda
 * olvidar.
 *
 * Este archivo es esa condicion. `convertir-banco.mjs` sella en el encargo la
 * huella de los archivos de los que salio; los pasos siguientes la cotejan contra
 * los archivos de HOY y se niegan a seguir si algo se movio.
 *
 * UN ENCARGO QUE YA NO CORRESPONDE A SU ORIGEN ES EL MISMO PROBLEMA QUE UN
 * ARCHIVO QUE NO ES EL BANCO
 *
 * Es H-030 otra vez, un eslabon mas arriba. Alli el respaldo existia, tenia fecha
 * y pesaba algo, y no era el banco. Aqui el encargo existe, esta bien formado y
 * paso su comprobacion — pero la paso contra un origen que ya no es el que hay.
 * En los dos casos el archivo se parece lo suficiente a estar bien como para que
 * nadie lo abra.
 *
 * QUE SE MIRA, Y POR QUE POR MODULO Y NO POR ARCHIVO ENTERO
 *
 *   modulo-0N.json                 entero: es de ese modulo y de ninguno mas
 *   cuestionario.js                SOLO el grupo de ese modulo
 *   retiradas.json                 SOLO las entradas de ese modulo
 *   correcciones-de-enunciado.json SOLO las entradas de ese modulo
 *
 * Acotarlo por modulo no es una optimizacion: es lo que hace que la comprobacion
 * sirva. Una correccion aprobada para el modulo 5 no tiene por que invalidar el
 * encargo del 3, y si lo invalidara, la primera reaccion de cualquiera seria
 * aprender a ignorar el aviso.
 *
 * SIN NORMALIZAR NADA
 *
 * Igual que en los comprobadores: el JSON se serializa con las claves en el orden
 * en que estan y sin recortar espacios. Cada normalizacion es un sitio donde se
 * esconde un cambio silencioso, y esto existe justamente para no tener ninguno.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Version del formato. Si cambia lo que se mira, esto sube y las huellas viejas dejan de valer. */
export const VERSION_PROCEDENCIA = 1;

const huella = (texto) => createHash('sha256').update(texto, 'utf8').digest('hex').slice(0, 16);

/** El numero de modulo de una entrada, escriba `2` o `"Módulo 2"`. */
const moduloDe = (r) => Number(typeof r.modulo === 'string' ? r.modulo.replace(/\D/g, '') : r.modulo);

/**
 * Calcula la huella de los cuatro origenes de un modulo.
 *
 * @param {number} modulo
 * @param {string} RAIZ  raiz del repositorio
 * @returns {Promise<object>} el bloque que se sella en el encargo
 */
export async function huellaDeOrigenes(modulo, RAIZ) {
  const CUESTIONARIOS = join(RAIZ, '_planmaestro', '00_producto', 'cuestionarios');
  const BANCO_VIEJO = join(RAIZ, 'static', 'js', 'data', 'cuestionario.js');

  const fuentes = {};
  const problemas = [];

  // --- El banco nuevo, entero -----------------------------------------------

  const rutaNuevo = join(CUESTIONARIOS, `modulo-0${modulo}.json`);

  if (!existsSync(rutaNuevo)) {
    problemas.push(`No existe modulo-0${modulo}.json.`);
  } else {
    fuentes['modulo-0N.json'] = huella(readFileSync(rutaNuevo, 'utf8'));
  }

  // --- El banco viejo, solo el grupo de este modulo -------------------------

  if (!existsSync(BANCO_VIEJO)) {
    // Que el banco viejo ya no este NO es un fallo: la iteracion 25 lo retira al
    // final. Se registra como ausente, y ausente cotejado contra ausente calza.
    fuentes['cuestionario.js'] = '(retirado)';
  } else {
    try {
      const { cuestionario } = await import(`${pathToFileURL(BANCO_VIEJO).href}?t=${Date.now()}`);
      const grupo = cuestionario.find((g) => Number(g.modulo.replace(/\D/g, '')) === modulo);
      fuentes['cuestionario.js'] = grupo ? huella(JSON.stringify(grupo)) : '(sin grupo)';
    } catch (error) {
      problemas.push(`No pude leer el banco viejo: ${error.message}`);
    }
  }

  // --- Retiradas y correcciones, solo las de este modulo --------------------

  const porModulo = (ruta, clave) => {
    if (!existsSync(ruta)) return '(no existe)';
    const contenido = JSON.parse(readFileSync(ruta, 'utf8'));
    const lista = clave
      ? (contenido[clave] ?? [])
      : [...(contenido.banco_nuevo ?? []), ...(contenido.banco_viejo ?? [])];
    return huella(JSON.stringify(lista.filter((r) => moduloDe(r) === modulo)));
  };

  try {
    fuentes['retiradas.json'] = porModulo(join(CUESTIONARIOS, 'retiradas.json'), null);
    fuentes['correcciones-de-enunciado.json'] = porModulo(
      join(CUESTIONARIOS, 'correcciones-de-enunciado.json'),
      'correcciones'
    );
  } catch (error) {
    problemas.push(`No pude leer retiradas o correcciones: ${error.message}`);
  }

  return {
    version: VERSION_PROCEDENCIA,
    modulo,
    calculada_en: new Date().toISOString(),
    fuentes,
    ...(problemas.length ? { problemas } : {}),
  };
}

/**
 * Coteja la huella sellada en un encargo contra los archivos de hoy.
 *
 * NO decide que hacer: devuelve el diagnostico. Cada guion tiene su vocabulario
 * de veredictos y su idea de que es grave, y meter aqui un `process.exit` seria
 * quitarles esa decision.
 *
 * @returns {Promise<{corresponde: boolean, motivo: string, movidas: string[], sellada: object|null, ahora: object}>}
 */
export async function cotejarProcedencia(encargo, modulo, RAIZ) {
  const ahora = await huellaDeOrigenes(modulo, RAIZ);
  const sellada = encargo?.procedencia ?? null;

  if (!sellada) {
    return {
      corresponde: false,
      sinSello: true,
      motivo: 'El encargo no trae sello de procedencia.',
      movidas: [],
      sellada: null,
      ahora,
    };
  }

  if (sellada.version !== VERSION_PROCEDENCIA) {
    return {
      corresponde: false,
      motivo: `El sello es de la version ${sellada.version} y esta es la ${VERSION_PROCEDENCIA}.`,
      movidas: [],
      sellada,
      ahora,
    };
  }

  if (Number(sellada.modulo) !== Number(modulo)) {
    return {
      corresponde: false,
      motivo: `El encargo esta sellado para el modulo ${sellada.modulo} y estas pidiendo el ${modulo}.`,
      movidas: [],
      sellada,
      ahora,
    };
  }

  const movidas = [];

  for (const [nombre, valor] of Object.entries(ahora.fuentes)) {
    if (sellada.fuentes?.[nombre] !== valor) movidas.push(nombre);
  }

  return {
    corresponde: movidas.length === 0,
    motivo: movidas.length ? `Se movieron ${movidas.length} de los origenes.` : 'Corresponde.',
    movidas,
    sellada,
    ahora,
  };
}

/**
 * Las lineas que un guion imprime cuando el cotejo dice que no.
 *
 * Se escriben una sola vez y aqui, para que los tres guiones que se niegan digan
 * exactamente lo mismo. Tres mensajes distintos para el mismo problema es como se
 * aprende a leer uno de ellos como si fuera menos grave.
 */
export function comoContarlo(cotejo, modulo) {
  if (cotejo.sinSello) {
    return [
      'El encargo no trae sello de procedencia, asi que no se puede saber de que',
      'version de los origenes salio.',
      '',
      'Los encargos anteriores a ADR-028 no lo traen. Vuelve a convertirlo:',
      '',
      `  node scripts/convertir-banco.mjs ${modulo}`,
    ];
  }

  const lineas = [
    'EL ENCARGO YA NO CORRESPONDE A SUS ORIGENES.',
    '',
    cotejo.motivo,
    '',
    `Sellado el ${cotejo.sellada?.calculada_en ?? '(sin fecha)'}:`,
    '',
  ];

  for (const nombre of Object.keys(cotejo.ahora.fuentes)) {
    const antes = cotejo.sellada?.fuentes?.[nombre] ?? '(no estaba)';
    const hoy = cotejo.ahora.fuentes[nombre];
    const marca = antes === hoy ? '   ' : ' ->';
    lineas.push(`  ${nombre.padEnd(34)} ${antes}${marca} ${antes === hoy ? '' : hoy}`);
  }

  lineas.push(
    '',
    'Alguien edito un origen despues de convertir. Lo normal es que sea una',
    'correccion de enunciado aprobada, y entonces esto es exactamente lo que tiene',
    'que pasar: ADR-028 dice que una correccion aprobada obliga a reconvertir y',
    'recomprobar el modulo ENTERO, aparezca cuando aparezca.',
    '',
    'El costo de reconvertir es que un guion vuelva a correr. El de publicar un',
    'enunciado con premisa falsa lo paga un estudiante leyendolo.',
    '',
    'Que hacer, en este orden:',
    '',
    `  node scripts/convertir-banco.mjs ${modulo}`,
    `  node scripts/comprobar-conversion.mjs ${modulo}`,
    `  node scripts/redactar-justificaciones.mjs ${modulo}`,
    '',
    'El documento de revision conserva las aprobaciones cuya pregunta y',
    'justificacion no cambiaron, y devuelve a cero las demas. No se re-aprueba todo:',
    'solo lo que de verdad cambio.'
  );

  return lineas;
}
