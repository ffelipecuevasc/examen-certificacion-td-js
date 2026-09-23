/**
 * `npm run verificar`: corre los trece comprobadores del proyecto y da UN veredicto.
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
 *   3. comprobar-instantanea.mjs  la instantanea dice lo mismo que el respaldo
 *   4. comprobar-cifra.mjs        la portada publica la cifra del banco
 *   5. comprobar-copias.mjs       las cuatro paginas dicen lo mismo en encabezado y pie, y «Acerca de» va solo en el pie
 *   6. probar-identidad-visual.mjs  el contraste, la paleta y los iconos del simulacro
 *   7. probar-cronometros.mjs     los dos relojes del simulacro y el arriendo de pestana
 *   8. probar-resumen.mjs         el resumen del simulacro cuenta, ordena y avisa bien
 *   9. probar-escapado.mjs        el escapado del banco aguanta contenido hostil
 *  10. probar-restricciones.mjs   las nueve restricciones del esquema rechazan
 *  11. comprobar-csp.mjs         la politica de contenido no bloquea nada del sitio
 *  12. probar-respaldo.mjs       toda respuesta ajena enciende el respaldo
 *  13. probar-cabeceras.mjs      las cabeceras llegan, nadie escribe, nada se filtra
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
 * La cuarta entro con la iteracion 36, y por un motivo que conviene no olvidar: la
 * portada publicaba «21 preguntas de practica» con 368 en el banco, y sobrevivio
 * al llenado entero porque ninguna comprobacion tenia el deber de mirarla.
 *
 * La septima entro con la iteracion 42, y es la que vigila el tiempo. Corre aqui —y no
 * junto a `probar:filtrado` y `probar:memoria`, que quedan fuera— por una diferencia
 * concreta: **no necesita servidor**. No prueba de donde salen las preguntas, sino que
 * pasa con el reloj una vez que el intento existe, y para eso le basta con escribir el
 * intento en un almacen de mentira y retomarlo. Sin esto, el reloj controlable seria
 * lo unico de la iteracion 42 que nadie mira salvo cuando alguien se acuerda.
 *
 * La sexta entro con la iteracion 45, y por el mismo motivo que la cuarta y la
 * quinta: hasta ese dia **ninguna comprobacion miraba el contraste**, ni que una clase
 * `i-*` existiera en `icons.css`. Las dos cosas se revisaban a mano, y una revision a
 * mano de veinte contrastes se hace entera la primera vez y por encima la cuarta: el
 * `text-ruby` a 14 px en negrita de `#valor-incorrectas` —3,98:1 sobre un umbral de
 * 4,5— llevaba meses publicado sin que nada se quejara. Corre aqui y no aparte porque
 * es barata, sobre archivos del repositorio, y no necesita servidor ni base D1.
 *
 * La quinta entro con la iteracion 41, y por el mismo motivo: al aparecer la tercera
 * pagina, el encabezado y el pie pasaron a estar escritos tres veces a mano, y nada
 * obligaba a que las tres dijeran lo mismo. Corre aqui —y no aparte— porque es una
 * comprobacion barata, sobre archivos del repositorio, que no necesita ni el
 * servidor local ni la base D1: exactamente el perfil de las tres que la preceden.
 * Una comprobacion que hay que acordarse de correr no vigila nada.
 *
 * Las tres ultimas entraron con la iteracion 51. Las dos primeras no necesitan
 * servidor —una lee archivos, la otra le pasa respuestas de mentira a datos.js— y
 * corren siempre. La tercera si lo necesita, y sabe decir «no pude probar» igual
 * que el escapado: sin servidor avisa, no falla.
 *
 * Codigos de salida:
 *   0  VERIFICADO             las trece comprobaciones hechas y en verde
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
 * Los trece comprobadores, con la traduccion de sus codigos.
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
    nombre: 'cifra',
    guion: 'comprobar-cifra.mjs',
    codigos: {
      0: [OK, 'la portada publica la cifra que trae la instantanea'],
      1: [FALLO, 'CIFRA FALSA: index.html anuncia un numero de preguntas que no es el del banco'],
      2: [AVISO, 'no se pudo comparar: la instantanea o la portada no se dejan leer'],
    },
  },
  {
    nombre: 'copias',
    guion: 'comprobar-copias.mjs',
    codigos: {
      0: [OK, 'las cuatro paginas dicen lo mismo en su encabezado, su pie y su favicon, y «Acerca de» va solo en el pie'],
      1: [FALLO, 'COPIAS DISTINTAS: una pagina se desfaso del encabezado o del pie de las otras'],
      2: [AVISO, 'no se pudo comparar: falta una pagina o no trae alguno de los tres bloques'],
    },
  },
  {
    nombre: 'identidad',
    guion: 'probar-identidad-visual.mjs',
    codigos: {
      0: [OK, 'el contraste, la paleta y los iconos del simulacro estan donde la guia visual dice'],
      1: [FALLO, 'IDENTIDAD ROTA: un contraste bajo umbral, un color de fuera de la paleta o un icono que no existe'],
      2: [AVISO, 'no se pudo comprobar: falta la paleta o no se dejaron cargar los componentes'],
    },
  },
  {
    // ENTRA EN `verificar` Y `probar:filtrado` NO, Y LA DIFERENCIA ES EL SERVIDOR.
    // Este guion no pide ni una vez a la red: arma el intento escribiendolo en el
    // almacen de mentira y lo retoma, que es el mismo camino de una recarga. Por eso
    // puede correr siempre, y por eso el reloj controlable de la iteracion 42 queda
    // vigilado en cada verificacion y no solo cuando alguien se acuerda.
    nombre: 'cronometros',
    guion: 'probar-cronometros.mjs',
    codigos: {
      0: [OK, 'los dos cronometros cuentan bien, una sola pestana escribe el intento y el recorrido se sostiene'],
      1: [FALLO, 'CRONOMETRO ROTO: una cifra, un agotamiento o el arriendo de la pestana no cuadra'],
      2: [AVISO, 'no se pudo comprobar: no se dejaron cargar los componentes del simulacro'],
    },
  },
  {
    // LA OCTAVA ENTRO CON LA ITERACION 44, y por lo mismo que la septima: no necesita
    // servidor. Siembra el intento terminado en el almacen de mentira, lo retoma, e
    // intercepta la unica peticion del resumen —las justificaciones—. Asi el resultado,
    // el desglose, la revision y el aviso de pregunta corregida quedan vigilados en cada
    // verificacion, y no solo cuando alguien se acuerda de correrlo.
    nombre: 'resumen',
    guion: 'probar-resumen.mjs',
    codigos: {
      0: [OK, 'el resumen cuenta, ordena, revisa y avisa como dicen las decisiones de la iteracion 44'],
      1: [FALLO, 'RESUMEN ROTO: una cifra, el orden del desglose, la revision o un aviso no cuadra'],
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
  {
    nombre: 'csp',
    guion: 'comprobar-csp.mjs',
    codigos: {
      0: [OK, 'la politica de contenido cumple lo decidido y no bloquea nada de lo que el sitio carga'],
      1: [FALLO, 'CSP INCOMPATIBLE: algo del sitio quedaria bloqueado, o la politica se aflojo'],
      2: [AVISO, 'no se pudo comprobar: falta una pagina o el JavaScript del sitio'],
    },
  },
  {
    nombre: 'respaldo',
    guion: 'probar-respaldo.mjs',
    codigos: {
      0: [OK, 'toda respuesta ajena a la capa de datos enciende el respaldo, y el sobre propio manda'],
      1: [FALLO, 'RESPALDO ROTO: una respuesta ajena dejaria al estudiante sin banco'],
      2: [AVISO, 'no se pudo comprobar: datos.js no se dejo cargar'],
    },
  },
  {
    nombre: 'cabeceras',
    guion: 'probar-cabeceras.mjs',
    codigos: {
      0: [OK, 'las cabeceras llegan a las paginas y a /api/, ningun extremo escribe y ningun error filtra'],
      1: [FALLO, 'CABECERAS: falta una, un extremo acepta escribir o un error cuenta como esta hecho por dentro'],
      2: [
        AVISO,
        'NO SE PUDO PROBAR. Para cerrarlo: `npm run datos:dev` en otra terminal y repetir',
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
