/**
 * `npm run verificar`: corre los cuatro comprobadores del proyecto y da UN veredicto.
 *
 * POR QUE HACE FALTA UN COORDINADOR, Y NO BASTA CON `&&`
 *
 * Hasta el 2026-09-05 esto era `verificar-barrera && verificar`, y funcionaba
 * mientras los dos veredictos posibles fueran «bien» y «mal». Al entrar el
 * guardian del escapado deja de funcionar, por dos motivos:
 *
 * 1. `&&` corta en el primer codigo distinto de 0, asi que un aviso —«no se pudo
 *    probar»— impediria correr lo que venia despues, como si fuera un fallo.
 * 2. `&&` deja como codigo final el del ultimo que corrio. Con varios
 *    comprobadores y tres clases de resultado, ese numero deja de significar
 *    nada.
 *
 * LA DISTINCION QUE ORDENA TODO ESTE ARCHIVO
 *
 *   FALLO  algo esta mal y hay que arreglarlo.
 *   AVISO  la comprobacion no se pudo hacer. No se sabe si esta bien o mal.
 *   OK     se comprobo y esta bien.
 *
 * Confundir las dos primeras es el error catalogado en H-013, y tiene un efecto
 * concreto y peor que el error de una vez: si `verificar` grita «fallo» cada vez
 * que falta levantar el servidor local, se aprende a ignorarlo, y el dia que el
 * fallo sea de verdad va a estar mezclado con el ruido. Por eso el aviso se ve
 * distinto, se cuenta aparte y devuelve otro codigo.
 *
 * QUE CORRE, Y EN QUE ORDEN
 *
 *   1. verificar-barrera.mjs      ADR-015 sigue en pie (H-014)
 *   2. verificar.mjs              el CSS versionado corresponde a su fuente
 *   3. probar-escapado.mjs        el escapado del banco aguanta contenido hostil
 *   4. probar-restricciones.mjs   las nueve restricciones del esquema rechazan
 *
 * La barrera va primera y es la unica que corta: si esta caida, desde aqui se
 * puede llegar a la cuenta de Cloudflare, y ninguna de las otras merece correrse
 * antes de reponerla. Las demas corren siempre, aunque la anterior haya fallado:
 * son independientes entre si, y parar en la primera esconderia el estado de las
 * otras.
 *
 * Las dos ultimas necesitan la base D1 LOCAL con su esquema, y las dos saben
 * decir «no pude probar» en vez de fingir un veredicto. En un clon recien hecho
 * las dos van a avisar, y el resultado sera VERIFICACION INCOMPLETA: es correcto,
 * y es la diferencia entre una casilla en blanco y una marcada sin mirar.
 *
 * Codigos de salida:
 *   0  VERIFICADO             las cuatro comprobaciones hechas y en verde
 *   1  VERIFICACION FALLIDA   al menos una encontro algo mal
 *   2  VERIFICACION INCOMPLETA  ninguna fallo, pero alguna no se pudo hacer
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));

const VERIFICADO = 0;
const FALLIDA = 1;
const INCOMPLETA = 2;

const OK = 'OK';
const FALLO = 'FALLO';
const AVISO = 'AVISO';

const LINEA = '='.repeat(72);

/**
 * Los cuatro comprobadores, con la traduccion de sus codigos.
 *
 * Cada uno mantiene los suyos y aqui solo se traducen: este archivo no decide
 * que significa un 2 en el guardian del escapado, lo lee de esta tabla. Un
 * codigo que no este listado se trata como fallo y se dice que era inesperado,
 * porque un envoltorio que no entiende la respuesta no puede dar por bueno nada
 * (H-013).
 */
const COMPROBADORES = [
  {
    nombre: 'barrera',
    guion: 'verificar-barrera.mjs',
    corta: true,
    codigos: {
      0: [OK, 'la barrera de ADR-015 esta en pie, o no aplica en este terminal'],
      1: [FALLO, 'BARRERA CAIDA: desde aqui se puede llegar a la cuenta de Cloudflare'],
      2: [AVISO, 'no se pudo comprobar si la barrera esta en pie'],
    },
  },
  {
    nombre: 'css',
    guion: 'verificar.mjs',
    codigos: {
      0: [OK, 'el CSS corresponde a su fuente y coincide con lo commiteado'],
      1: [FALLO, 'DESFASADO: el CSS versionado no estaba al dia. Revisa el diff y commitea'],
      2: [AVISO, 'VERIFICACION PARCIAL: el CSS corresponde a su fuente, pero no se pudo mirar git'],
      3: [FALLO, 'la construccion fallo, asi que no hubo nada que comparar'],
    },
  },
  {
    nombre: 'instantanea',
    guion: 'comprobar-instantanea.mjs',
    codigos: {
      0: [OK, 'la instantanea versionada dice lo mismo que el respaldo versionado'],
      1: [FALLO, 'DIVERGEN: la instantanea y el respaldo no cuentan el mismo banco'],
      2: [AVISO, 'no se pudo comparar: falta el respaldo o la instantanea no se deja leer'],
    },
  },
  {
    nombre: 'escapado',
    guion: 'probar-escapado.mjs',
    codigos: {
      0: [OK, 'el escapado aguanto el contenido hostil'],
      1: [FALLO, 'ESCAPADO ROTO: un texto de la base se interpreta como marcado'],
      2: [
        AVISO,
        'NO SE PUDO PROBAR. Para cerrarlo: `npm run datos:dev` en otra terminal y repetir',
      ],
      3: [FALLO, 'BASE SUCIA: el contenido hostil quedo dentro de la base local'],
      4: [
        AVISO,
        'MECANISMO EN PIE PERO NO A ESCALA: la base local trae el banco de juguete. ' +
          'Para cerrarlo: `npm run datos:banco-local`',
      ],
    },
  },
  {
    nombre: 'restricciones',
    guion: 'probar-restricciones.mjs',
    codigos: {
      0: [OK, 'las nueve restricciones del esquema rechazaron lo que debian'],
      1: [FALLO, 'RESTRICCION CAIDA: el esquema dejo pasar algo que tenia que rechazar'],
      2: [
        AVISO,
        'NO SE PUDO PROBAR. Para cerrarlo: `npm run datos:migrar`, `datos:migrar-002` y repetir',
      ],
    },
  },
];

/** Lanza un comprobador y devuelve su codigo de salida. */
function correr(guion) {
  const resultado = spawnSync(process.execPath, [join(AQUI, guion)], { stdio: 'inherit' });

  if (resultado.error) return null;
  if (resultado.signal) return null;

  return resultado.status;
}

const resultados = [];
let cortado = null;

for (const comprobador of COMPROBADORES) {
  console.log(`\n${LINEA}\n>> ${comprobador.nombre}  (scripts/${comprobador.guion})\n${LINEA}`);

  const codigo = correr(comprobador.guion);
  const [clase, texto] = comprobador.codigos[codigo] ?? [
    FALLO,
    `codigo de salida inesperado: ${codigo}. No se entendio la respuesta, asi que no se da por buena`,
  ];

  resultados.push({ ...comprobador, codigo, clase, texto });

  if (clase !== OK && comprobador.corta) {
    cortado = comprobador;
    break;
  }
}

// ---------------------------------------------------------------------------
// Veredicto unico
// ---------------------------------------------------------------------------

const hayFallo = resultados.some((r) => r.clase === FALLO);
const hayAviso = resultados.some((r) => r.clase === AVISO);

const codigoFinal = hayFallo ? FALLIDA : hayAviso ? INCOMPLETA : VERIFICADO;

const titulo = hayFallo
  ? `VERIFICACION FALLIDA  ***  ${resultados.filter((r) => r.clase === FALLO).length}  ***`
  : hayAviso
    ? 'VERIFICACION INCOMPLETA  ***  ESTO NO ES UN EXITO  ***'
    : 'VERIFICADO';

const sinCorrer = COMPROBADORES.filter((c) => !resultados.some((r) => r.nombre === c.nombre));

console.log(`\n${LINEA}\n${titulo}\n${LINEA}`);

for (const r of resultados) {
  console.log(`  ${r.nombre.padEnd(14)} ${r.clase.padEnd(6)} ${r.texto}`);
}

for (const c of sinCorrer) {
  console.log(`  ${c.nombre.padEnd(14)} ${'-'.padEnd(6)} no se ejecuto`);
}

if (cortado) {
  console.log(
    `\nSe corto en «${cortado.nombre}» a proposito: mientras la barrera no este en pie,`
  );
  console.log('nada de lo que venia despues merece correrse. Reponla y repite.');
}

if (hayAviso && !hayFallo) {
  // El plural cuesta nada y evita una duda tonta: un texto que dice «una» con dos
  // avisos a la vista hace pensar que el guion no esta contando bien.
  const avisos = resultados.filter((r) => r.clase === AVISO).length;
  console.log(
    avisos === 1
      ? '\nNinguna comprobacion encontro nada mal. Lo que hay es una que no se pudo'
      : `\nNinguna comprobacion encontro nada mal. Lo que hay son ${avisos} que no se pudieron`
  );
  console.log('hacer, y eso no es un aprobado: es una casilla en blanco.');
}

console.log(`\ncodigo de salida: ${codigoFinal}\n`);
process.exit(codigoFinal);
