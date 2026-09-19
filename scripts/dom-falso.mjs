/**
 * DOM falso para correr los componentes del sitio dentro de Node.
 *
 * POR QUE EXISTE, Y POR QUE ES UN ARCHIVO APARTE
 *
 * La unica forma honesta de comprobar lo que el sitio DIBUJA es dibujarlo: correr
 * el componente real contra la respuesta real del extremo y mirar el HTML que
 * deja. Sin navegador eso necesita un `document` que el componente pueda usar, y
 * con muy poco basta, porque los componentes escriben con innerHTML y no recorren
 * el arbol.
 *
 * Nacio dentro de scripts/probar-escapado.mjs. Salio de ahi en la iteracion 31, al
 * aparecer un segundo guion que necesitaba lo mismo: dos copias del mismo DOM
 * falso no fallan cuando divergen, se quedan calladas, y la que se quede atras
 * empieza a comprobar otra pagina que la que existe. Es el mismo motivo por el que
 * functions/api/preguntas.js importa el rango de modulos en vez de redefinirlo.
 *
 * LO QUE ES, Y LO QUE NO
 *
 * No es un navegador. No calcula estilos, no sabe de foco real, ni de teclado, ni
 * de apilado en telefono. Todo eso se comprueba en un navegador de verdad, y este
 * archivo no pretende sustituirlo.
 *
 * Lo que si hace, que es lo que importa: guardar lo que el componente escribio en
 * cada elemento, con identidad estable —el mismo selector devuelve siempre el
 * mismo nodo—, para poder leerlo despues y contarlo. Y, desde la iteracion 31,
 * recordar los oyentes que el componente registro, para poder dispararlos: sin
 * eso no hay forma de provocar desde Node una decision que el usuario toma
 * —cambiar de modulo, responder una pregunta— y las unicas pruebas posibles
 * serian sobre el dibujo, nunca sobre la conducta.
 *
 * Lo que un evento disparado aqui NO prueba: que el navegador lo entregue igual,
 * que el foco se vea, ni que nada de eso se pinte. Prueba la DECISION del
 * componente, que es la mitad que se puede comprobar sin navegador.
 *
 * EL FOCO, DESDE LA ITERACION 32
 *
 * `document.activeElement` se lleva de verdad: quien llama a `focus()` queda
 * apuntado ahi, y quien se va del arbol —porque alguien reescribio el innerHTML
 * de su padre— deja el foco en un `body` de mentira, igual que en el navegador.
 *
 * Sin esto no habia forma de comprobar desde Node que un camino deje el foco
 * perdido, que es el defecto que la auditoria de la iteracion 32 encontro en tres
 * sitios a la vez. Lo que se mide es a QUE elemento fue a parar el foco; que se
 * vea el anillo amarillo alrededor sigue siendo cosa del navegador.
 *
 * EL TIEMPO Y LAS DOS PESTANAS, DESDE LA ITERACION 42
 *
 * Aparecen dos piezas nuevas, las dos OPCIONALES: `relojDeMentira()`, que solo avanza
 * cuando la prueba se lo pide, y `dosPestanas()`, que son dos entornos completos
 * mirando un solo almacen y viendose por el evento `storage`.
 *
 * La regla que las gobierna a las dos, y que es lo primero que hay que mirar al
 * auditar este archivo: **nunca se toca el reloj del proceso**. No se asigna
 * `globalThis.Date`, ni `Date.now`, ni `performance`, y `window.setTimeout` y
 * `window.clearTimeout` siguen siendo los de Node, siempre y para todos. El reloj de
 * mentira no se instala en ningun sitio: se le pasa al sitio por `usarReloj()`, y el
 * sitio lo consulta en vez de consultar al proceso.
 *
 * El motivo esta medido y no es una precaucion abstracta. `scripts/probar-filtrado.mjs`
 * cronometra la transicion de carga con `Date.now()` real en `8f-2` (iteracion 35) y
 * en `10f` (iteracion 41), contra un piso de 400 ms con 700 de holgura. Un reloj de
 * mentira instalado en el proceso las dejaria a las dos midiendo un tiempo que otra
 * prueba controla, y pasarian en verde sin probar el parpadeo que existen para cazar.
 *
 * `prepararDomFalso()` sin las opciones nuevas se comporta exactamente como antes de
 * la iteracion 42.
 */

/** Un nodo de mentira, con lo justo para que los componentes lo usen. */
function crearNodo(selector, registrar, foco) {
  const clases = new Set();
  const oyentes = new Map();

  const nodo = {
    selector,
    dataset: {},
    style: {},
    value: '',
    disabled: false,
    oyentes,
    /**
     * De que nodo cuelga, cuando se obtuvo con querySelector sobre otro.
     *
     * Sirve para una sola cosa, y es la que importa: cuando alguien reescribe el
     * innerHTML de un nodo, todo lo que colgaba de el deja de existir, y el foco
     * que estuviera ahi dentro se pierde. Igual que en el navegador.
     */
    padre: null,
    classList: {
      add: (...nombres) => nombres.forEach((n) => clases.add(n)),
      remove: (...nombres) => nombres.forEach((n) => clases.delete(n)),
      contains: (nombre) => clases.has(nombre),
      /** Para poder afirmar cosas sobre lo oculto y lo visible. */
      lista: () => [...clases],
    },
    _html: '',
    _texto: '',
    /**
     * Cuantas veces se reescribio este elemento.
     *
     * Desde la iteracion 35. Sirve para una cosa que no se puede mirar de otra
     * manera: cuantas veces se reconstruye la zona de preguntas durante una sola
     * espera. Cada reescritura de `#cuestionario` destruye el nodo que tiene el
     * foco y obliga a reponerlo, y un lector de pantalla lo vuelve a anunciar. El
     * numero es la evidencia de que la carga se da a conocer UNA vez y no a cada
     * paso; sin contarlo, eso solo se puede prometer.
     */
    escrituras: 0,
    set innerHTML(valor) {
      // Reescribir el contenido tira lo que colgaba. Si el foco estaba ahi dentro,
      // se cae al body, que es exactamente lo que hace el navegador y lo que la
      // iteracion 32 tuvo que arreglar en tres caminos distintos.
      if (foco.dentroDe(nodo)) foco.soltar();
      nodo.escrituras += 1;
      this._html = valor;
    },
    get innerHTML() {
      return this._html;
    },
    set textContent(valor) {
      this._texto = String(valor);
    },
    get textContent() {
      return this._texto;
    },
    addEventListener(tipo, oyente) {
      if (!oyentes.has(tipo)) oyentes.set(tipo, []);
      oyentes.get(tipo).push(oyente);
    },
    /** Cuantas veces se le pidio el foco. */
    focos: 0,
    focus() {
      nodo.focos += 1;
      foco.tomar(nodo);
    },
    // Devolver un nodo y no null es lo que permite que responder() llegue hasta
    // el final: recorre hacia arriba y hacia los lados buscando la tarjeta de la
    // pregunta y sus alternativas. Con null se caia en la primera linea.
    closest: (s) => registrar(`${selector} closest ${s}`, nodo),
    querySelector: (s) => registrar(`${selector} > ${s}`, nodo),
    querySelectorAll: (s) => [registrar(`${selector} >> ${s}`, nodo)],
  };

  return nodo;
}

/**
 * Un `localStorage` de mentira, para los guiones que prueban la memoria.
 *
 * NO es el almacenamiento del navegador y no pretende serlo: prueba la DECISION del
 * componente —que guarde, que lea, que borre lo suyo y no lo ajeno— sobre un
 * almacen que se comporta como el. Que el navegador de verdad persista de una visita
 * a otra se comprueba en un navegador, y esta en la lista del autor.
 *
 * Vive fuera de `prepararDomFalso()` a proposito: el almacen tiene que **sobrevivir**
 * a que se rehaga el DOM, porque eso es exactamente lo que significa recargar la
 * pagina. Quien prueba lo crea una vez y lo va pasando a cada arranque.
 *
 * `escrituraProhibida` reproduce un almacen que se deja leer y lanza al ESCRIBIR:
 * el almacen lleno, o el que deniega el guardado a este origen sin desaparecer.
 * NO es la ventana privada: desde Safari 11 esa escribe sin problemas, en memoria
 * (WebKit 157010). `lecturaProhibida` reproduce un almacen que tampoco deja leer.
 */
export function almacenDeMentira({
  escrituraProhibida = false,
  lecturaProhibida = false,
  // Cuantos bytes caben en total. `Infinity` por defecto, que es lo que veian todos
  // los que ya llamaban a esta funcion. Con un numero, una escritura que no quepa
  // lanza como lanza el navegador de verdad —`QuotaExceededError`— y las que si
  // quepan siguen funcionando.
  //
  // POR QUE HACE FALTA UN CUPO Y NO BASTA CON `escrituraProhibida` (iteracion 41,
  // etapa C). Con la bandera, el almacen dice que no a TODO. El caso que el simulacro
  // tiene que aguantar es otro: un almacen con sitio para los 12,7 KiB de las
  // respuestas y sin sitio para los 76,8 KiB de la copia congelada. Ahi es donde se
  // puede quedar media copia guardada —respuestas sin preguntas—, que al recargar es
  // el peor dato posible. Sin cupo, ese caso no se puede provocar y la regla de
  // «nunca media copia» no la vigila nadie: se descubrio mutandola el 2026-09-18 y
  // no dio rojo.
  cupo = Infinity,
  // Los bytes. Por omision los suyos y de nadie mas, que es lo que veian todos los
  // que ya llamaban a esta funcion. `dosPestanas()` le pasa un Map compartido: dos
  // pestañas del mismo navegador miran UN solo almacen, y si cada una tuviera el
  // suyo no habria nada que coordinar y la prueba pasaria en verde sobre un mundo
  // que no existe.
  datos = new Map(),
  // Aviso de que algo cambio, para el evento `storage`. Recibe la clave y el valor
  // nuevo —`null` si se borro—. Por omision no avisa a nadie.
  alCambiar = null,
} = {}) {
  const ocupado = () => {
    let total = 0;
    for (const [clave, valor] of datos) total += clave.length + valor.length;
    return total;
  };

  // Se guarda en una variable y no se lee del parametro, para que `prohibirEscritura()`
  // pueda cambiarlo con el almacen ya instalado y ya lleno.
  let noDejaEscribir = escrituraProhibida;

  return {
    getItem(clave) {
      if (lecturaProhibida) throw new Error('lectura denegada por el navegador de mentira');
      return datos.has(clave) ? datos.get(clave) : null;
    },
    setItem(clave, valor) {
      if (noDejaEscribir) throw new Error('escritura denegada por el navegador de mentira');

      const texto = String(valor);
      const anterior = datos.get(clave) ?? '';
      const despues = ocupado() - (anterior === '' ? 0 : clave.length + anterior.length) + clave.length + texto.length;

      if (despues > cupo) {
        // El mismo nombre que lanza el navegador de verdad al llenarse.
        const error = new Error('no cabe en el navegador de mentira');
        error.name = 'QuotaExceededError';
        throw error;
      }

      datos.set(clave, texto);
      alCambiar?.(clave, texto);
    },
    removeItem(clave) {
      if (noDejaEscribir) throw new Error('escritura denegada por el navegador de mentira');

      // Solo se avisa si de verdad habia algo. Borrar lo que no existe no cambia el
      // almacen, y el navegador tampoco dispara `storage` por eso.
      const habia = datos.has(clave);
      datos.delete(clave);
      if (habia) alCambiar?.(clave, null);
    },
    /**
     * El almacen se llena A MITAD DE CAMINO (iteracion 41, etapa C).
     *
     * Hasta ahora `escrituraProhibida` se fijaba al crearlo, y con eso solo se podia
     * reproducir el navegador que **nunca** dejo guardar. El caso que la decision 7
     * del simulacro nombra es otro y es el mas realista de los dos: el estudiante
     * empieza con sitio, responde ochenta preguntas, y el almacen se llena. Eso no
     * se puede provocar con una bandera de constructor.
     *
     * Devuelve el propio almacen para poder encadenarlo.
     */
    prohibirEscritura() {
      noDejaEscribir = true;
      return this;
    },
    /** Lo guardado, para poder mirarlo desde la prueba. No es parte de la API real. */
    datos,
  };
}

/**
 * Un reloj de mentira, que solo avanza cuando la prueba se lo pide (iteracion 42).
 *
 * POR QUE NO SE PARCHEA `Date.now()`
 *
 * Seria mas corto reemplazar `Date.now` en `globalThis` y no tocar el sitio. No se
 * hace, y la razon esta medida: `scripts/probar-filtrado.mjs` cronometra la
 * transicion de carga con `Date.now()` de verdad en dos sitios —`8f-2`, de la
 * iteracion 35, y `10f`, de la 41—, comparando contra un piso de 400 ms con una
 * holgura de 700. Con el reloj del proceso bajo el control de otra prueba, esas dos
 * dejarian de medir el parpadeo y pasarian en verde sin probar nada.
 *
 * Asi que este archivo **nunca** asigna `globalThis.Date`, `Date.now` ni
 * `performance`, y **nunca** reemplaza `window.setTimeout` ni `window.clearTimeout`.
 * Es una regla que se comprueba con un `grep`, igual que la barrera de ADR-015.
 *
 * LOS DOS VERBOS, Y POR QUE SON DOS Y NO UNO
 *
 *   avanzar(ms)  el tiempo pasa Y los temporizadores vencen a su hora.
 *   saltar(ms)   el tiempo pasa y NO vence nada.
 *
 * `saltar()` es el telefono bloqueado y la pestana en segundo plano: el navegador
 * estrangula los temporizadores, asi que el tiempo corre y los avisos no llegan.
 * Es el unico que prueba de verdad la decision 5 de la iteracion 42 —la cifra sale
 * de restar instantes, no de contar pulsos—, porque un cronometro que contara
 * pulsos sobrevive a `avanzar()` y se queda corto con `saltar()`. Despues de un
 * salto, `avanzar(0)` vence de golpe todo lo que quedo atrasado, en orden.
 */
export function relojDeMentira({ desde = 1767225600000 } = {}) {
  let ahora = desde;
  let siguientePase = 1;
  let oculta = false;

  /** pase -> { vence, quehacer }. Un Map porque hay que poder cancelar por pase. */
  const pendientes = new Map();
  const deVisibilidad = [];

  /**
   * El que vence antes, y a igualdad el que se programo antes.
   *
   * El desempate por pase no es cosmetico: dos preguntas agotadas en el mismo
   * instante simulado tienen que resolverse en el orden en que se programaron, que
   * es el orden del intento. Sin desempate, el orden lo decidiria el Map y la
   * decision 3 —«en orden»— no se podria afirmar.
   */
  const elPrimero = () => {
    let elegido = null;

    for (const [pase, tarea] of pendientes) {
      const antes =
        !elegido ||
        tarea.vence < elegido.tarea.vence ||
        (tarea.vence === elegido.tarea.vence && pase < elegido.pase);

      if (antes) elegido = { pase, tarea };
    }

    return elegido;
  };

  const avisarDeLaVisibilidad = () => {
    // Sobre una copia: un oyente que se registre mientras se reparte no debe recibir
    // el aviso que ya estaba en curso.
    for (const quehacer of [...deVisibilidad]) quehacer();
  };

  return {
    // --- La cara que ve el sitio. La misma forma que crearRelojDelNavegador() ---
    ahora: () => ahora,
    alCabo(ms, quehacer) {
      const pase = siguientePase++;
      pendientes.set(pase, { vence: ahora + Math.max(0, ms), quehacer });
      return pase;
    },
    cancelar(pase) {
      pendientes.delete(pase);
    },
    oculta: () => oculta,
    alCambiarLaVisibilidad(quehacer) {
      deVisibilidad.push(quehacer);
    },

    // --- La cara que solo ve la prueba -------------------------------------
    /**
     * El tiempo pasa y los temporizadores vencen A SU HORA.
     *
     * El reloj queda en el instante de CADA vencimiento mientras corre su tarea, y
     * no en el destino del salto. Importa, y mucho: una tarea que al vencer lea
     * `ahora()` para anotar cuando quedo resuelta la pregunta escribiria el instante
     * del final del salto, y el criterio de que las preguntas agotadas en segundo
     * plano quedan resueltas «en orden» se cerraria en verde sobre instantes falsos.
     *
     * Una tarea puede programar otra —el cronometro de la pregunta siguiente— y se
     * atiende igual, mientras caiga dentro del salto.
     */
    avanzar(ms) {
      const destino = ahora + Math.max(0, ms);

      for (;;) {
        const elegido = elPrimero();
        if (!elegido || elegido.tarea.vence > destino) break;

        pendientes.delete(elegido.pase);
        ahora = elegido.tarea.vence;
        elegido.tarea.quehacer();
      }

      ahora = destino;
    },
    /** El tiempo pasa y no vence nada: el telefono bloqueado. */
    saltar(ms) {
      ahora += Math.max(0, ms);
    },
    /** La pagina se va a segundo plano. Reparte `visibilitychange` por los dos caminos. */
    ocultar() {
      if (oculta) return;
      oculta = true;
      avisarDeLaVisibilidad();
    },
    /** La pagina vuelve. */
    mostrar() {
      if (!oculta) return;
      oculta = false;
      avisarDeLaVisibilidad();
    },
    /** Cuantos temporizadores hay puestos. Uno de mas es una fuga. */
    pendientes: () => pendientes.size,
  };
}

/**
 * Dos pestanas del mismo navegador, mirando un solo almacen (iteracion 42).
 *
 * LA REGLA QUE ES FACIL EQUIVOCAR, Y QUE ES LA MITAD DEL VALOR DE ESTO
 *
 * El evento `storage` **nunca llega a la pestana que escribio**. Solo a las otras.
 * Si el almacen de mentira se lo entregara a las dos, una pestana reaccionaria a la
 * renovacion de su propio arriendo —cada 5 segundos— y se bloquearia a si misma; y
 * una implementacion con ese defecto pasaria esta prueba en verde. El navegador no
 * lo hace, y este tampoco.
 *
 * COMO SE ENTREGA, SI `globalThis` SOLO ADMITE UN ENTORNO
 *
 * Cada pestana es un `prepararDomFalso()` entero. Entregar el evento es **activar la
 * que recibe, correr sus oyentes y devolver el sitio a quien lo tenia**. Es explicito
 * y se puede auditar; no pretende ser el navegador. Lo que reproduce es la DECISION
 * que la pestana toma al enterarse, que es la mitad que se puede comprobar sin
 * navegador, igual que el resto de este archivo.
 *
 * Y CADA PESTANA IMPORTA LOS MODULOS DEL SITIO CON SU PROPIO ESPECIFICADOR
 * —`?pestana=a` y `?pestana=b`—. Sin eso compartirian el `almacenRecordado` de
 * `servicios/memoria.js`, el asiento de `servicios/reloj.js` y el `elIntento` de
 * `components/simulacro.js`, que son variables de modulo: no habria dos pestanas,
 * habria una con dos nombres. Es el mismo recurso que `probar-filtrado.mjs` ya usa
 * con `?medicion=1`.
 */
export function dosPestanas({ cupo = Infinity } = {}) {
  /** Los bytes, una sola vez. Es el «disco» del navegador. */
  const disco = new Map();

  /** nombre -> el lector de `prepararDomFalso()` de esa pestana. */
  const domsPorNombre = new Map();

  /** Lo entregado, para poder contarlo desde la prueba. */
  const entregas = [];

  const repartir = (quienEscribio, clave, valorNuevo) => {
    for (const [nombre, dom] of domsPorNombre) {
      if (nombre === quienEscribio) continue;

      entregas.push({ de: quienEscribio, a: nombre, clave });

      // Activar, correr, y devolver el sitio a quien lo tenia. El `finally` no es
      // decorativo: si un oyente lanza, dejar el `globalThis` de la otra pestana
      // puesto convertiria un fallo en una cascada imposible de leer.
      const quienEstaba = domsPorNombre.get(quienEscribio);

      try {
        dom.activar();
        dom.dispararEnLaVentana('storage', { key: clave, newValue: valorNuevo });
      } finally {
        quienEstaba?.activar();
      }
    }
  };

  const crear = (nombre) => {
    const almacen = almacenDeMentira({
      cupo,
      datos: disco,
      alCambiar: (clave, valorNuevo) => repartir(nombre, clave, valorNuevo),
    });

    almacen.nombre = nombre;
    return almacen;
  };

  return {
    a: crear('a'),
    b: crear('b'),
    /**
     * Ata el DOM de una pestana a su almacen, para poder entregarle el evento.
     *
     * Se llama despues de `prepararDomFalso({ almacen: pestanas.a })`, porque hasta
     * entonces la pestana no tiene DOM al que entregarle nada.
     */
    atar(almacen, dom) {
      domsPorNombre.set(almacen.nombre, dom);
    },
    /** Lo guardado, compartido. Para poder mirarlo desde la prueba. */
    disco,
    /** Que evento `storage` se entrego a quien. Cero entregas a uno mismo, siempre. */
    entregas,
  };
}

/**
 * Instala el DOM falso en `globalThis` y devuelve con que leerlo.
 *
 * Se llama antes de importar los componentes: los modulos ES se evaluan al
 * importarse, y un componente que lea `document` durante su carga no lo
 * encontraria. Llamarla otra vez deja un DOM nuevo y vacio, que es la forma de
 * simular que la pagina se volvio a abrir; para que eso sea una recarga de verdad
 * hay que reimportar los componentes con un especificador distinto, porque si no
 * conservan su estado del arranque anterior.
 *
 * `almacen` decide que encuentra el sitio en `globalThis.localStorage`:
 *
 *   - sin nada (por defecto): no existe. Es el navegador que no trae almacenamiento,
 *     y es lo que ven los guiones que no prueban la memoria.
 *   - un objeto: se instala tal cual. Ahi va `almacenDeMentira()`.
 *   - una funcion: se instala como getter, asi que **leer la propiedad lanza**. Es
 *     Chrome con las cookies bloqueadas, donde el acceso falla antes de llamar a
 *     nada, y es el caso que mas facil se olvida al escribir el codigo.
 *
 * `movimientoReducido` decide que contesta `window.matchMedia()`. Es la decision 8
 * de la iteracion 35, y viene por defecto en `false` para que quien ya llamaba a
 * esta funcion siga viendo exactamente lo de antes.
 *
 * LO QUE PRUEBA Y LO QUE NO. Prueba que el componente **no declare movimiento**
 * cuando el sistema pide menos: que no ponga la clase de la animacion, y que pida
 * los desplazamientos con `auto` en vez de `smooth`. **No prueba que no se vea
 * movimiento**, porque aqui no se pinta nada; eso sigue siendo del navegador y de
 * la regla de src/input.css, que es la otra mitad y la que de verdad apaga.
 *
 * `reloj` es de la iteracion 42 y es **opcional**. Con uno de `relojDeMentira()`,
 * `document.hidden` pasa a salir de el y `visibilitychange` se puede provocar. Sin
 * el —que es como lo llaman los ocho sitios anteriores a esta iteracion— no cambia
 * absolutamente nada: `hidden` contesta `false` y nadie dispara esa clase de evento.
 * Pasar el reloj **no** reemplaza `window.setTimeout`: los temporizadores de este
 * archivo siguen siendo los de Node, siempre.
 */
export function prepararDomFalso({ almacen, movimientoReducido = false, reloj } = {}) {
  const nodos = new Map();

  /**
   * Donde esta el foco.
   *
   * `body` es el sitio al que cae cuando nadie lo tiene, y es el valor que delata
   * un camino roto: un estudiante con teclado que llega ahi perdio su lugar en la
   * pagina y tiene que volver a tabular desde el principio.
   */
  const foco = {
    actual: null,
    tomar(nodo) {
      foco.actual = nodo;
    },
    soltar() {
      foco.actual = null;
    },
    /** Si el foco esta en `nodo` o en algo que cuelgue de el. */
    dentroDe(nodo) {
      for (let n = foco.actual; n; n = n.padre) if (n === nodo) return true;
      return false;
    },
  };

  const registrar = (selector, padre = null) => {
    if (!nodos.has(selector)) nodos.set(selector, crearNodo(selector, registrar, foco));

    const nodo = nodos.get(selector);
    if (padre && !nodo.padre) nodo.padre = padre;

    return nodo;
  };

  const body = crearNodo('body', registrar, foco);

  /**
   * Los oyentes que alguien registro en `document` y en `window`.
   *
   * Desde la iteracion 42. Hasta ahora los oyentes vivian por nodo, y con eso bastaba
   * para los clics: se pulsa SOBRE algo. Los dos eventos que el simulacro necesita no
   * son de ningun elemento —`visibilitychange` es del documento y `storage` es de la
   * ventana—, y sin estos dos registros no habia forma de provocarlos desde Node.
   */
  const oyentesDelDocumento = new Map();
  const oyentesDeLaVentana = new Map();

  const anotar = (donde, tipo, oyente) => {
    if (!donde.has(tipo)) donde.set(tipo, []);
    donde.get(tipo).push(oyente);
  };

  const correr = (donde, tipo, evento) => {
    const lista = donde.get(tipo) ?? [];
    for (const oyente of lista) oyente(evento);
    return lista.length;
  };

  const elDocumento = {
    querySelector: registrar,
    querySelectorAll: () => [],
    get activeElement() {
      return foco.actual ?? body;
    },
    /**
     * Si la pagina esta en segundo plano.
     *
     * Sale del reloj de mentira cuando hay uno, y es un solo estado y no dos: con un
     * `hidden` propio aqui y otro alla, el dia que se desincronizaran el sitio leeria
     * una cosa y el guion afirmaria otra. Sin reloj de mentira contesta `false`, que
     * es lo que veian todos los que ya llamaban a esta funcion.
     */
    get hidden() {
      return reloj ? reloj.oculta() : false;
    },
    addEventListener: (tipo, oyente) => anotar(oyentesDelDocumento, tipo, oyente),
  };

  const laVentana = {
    // Se mira la consulta y no se contesta que si a todo: `prefersReducedMotion()`
    // pregunta por `(prefers-reduced-motion: reduce)`, y si algun dia el sitio
    // preguntara por otra cosa —el ancho, el modo oscuro— contestarle que si por
    // arrastre le haria creer al componente algo que nadie pidio simular.
    matchMedia: (consulta) => ({
      matches: movimientoReducido && String(consulta).includes('prefers-reduced-motion'),
    }),
    scrollTo() {},
    // LOS TEMPORIZADORES SIGUEN SIENDO LOS DE NODE, Y ESO NO CAMBIA NUNCA.
    //
    // El reloj de mentira no se instala aqui: se le pasa al sitio por
    // `usarReloj()`, y el sitio lo consulta en vez de consultar a la ventana. Si
    // estos dos se reemplazaran por temporizadores de mentira, el piso de la
    // transicion de carga —que los usa, y que `8f-2` y `10f` cronometran con
    // `Date.now()` real— dejaria de esperar de verdad y esas mediciones pasarian en
    // verde sin medir nada.
    setTimeout: (...argumentos) => setTimeout(...argumentos),
    clearTimeout: (...argumentos) => clearTimeout(...argumentos),
    addEventListener: (tipo, oyente) => anotar(oyentesDeLaVentana, tipo, oyente),
  };

  /**
   * Instala ESTE entorno en `globalThis`.
   *
   * Vive en una funcion y no suelto en el cuerpo porque desde la iteracion 42 hay que
   * poder volver a instalarlo: dos pestañas simuladas son dos entornos completos, y
   * `globalThis` solo admite uno a la vez. Entregar el evento `storage` a la otra
   * pestaña es activarla, correr sus oyentes y devolver el sitio a quien lo tenia.
   */
  const instalar = () => {
    globalThis.document = elDocumento;
    globalThis.window = laVentana;

    // El almacen se reinstala en cada arranque, incluso el mismo objeto: lo que se
    // rehace es el entorno, no lo guardado. Se borra primero para que un arranque sin
    // almacen no herede el del anterior, que es justo el caso que hay que poder
    // provocar.
    delete globalThis.localStorage;

    if (typeof almacen === 'function') {
      Object.defineProperty(globalThis, 'localStorage', { get: almacen, configurable: true });
    } else if (almacen) {
      Object.defineProperty(globalThis, 'localStorage', { value: almacen, configurable: true, writable: true });
    }
  };

  instalar();

  // El reloj de mentira reparte `visibilitychange` por dos caminos, igual que el
  // navegador: el sitio lo pide por `alCambiarLaVisibilidad()`, y quien escuchara en
  // `document` lo recibe por aqui. Un solo `ocultar()` alcanza a los dos.
  if (reloj?.alCambiarLaVisibilidad) {
    reloj.alCambiarLaVisibilidad(() => correr(oyentesDelDocumento, 'visibilitychange', {}));
  }

  return {
    /** Vuelve a poner este entorno en `globalThis`. Lo usa `dosPestanas()`. */
    activar: instalar,
    /**
     * Dispara un oyente de `window`. Es el hermano de `disparar()`, para los eventos
     * que no son de ningun elemento: hoy, `storage`.
     */
    dispararEnLaVentana(tipo, evento = {}) {
      return correr(oyentesDeLaVentana, tipo, evento);
    },
    /** Dispara un oyente de `document`, como `visibilitychange`. */
    dispararEnElDocumento(tipo, evento = {}) {
      return correr(oyentesDelDocumento, tipo, evento);
    },
    /**
     * El selector del elemento que tiene el foco, o 'body' si no lo tiene nadie.
     *
     * 'body' es el resultado que hay que vigilar: significa que el foco se cayo.
     */
    enfocado: () => (foco.actual ? foco.actual.selector : 'body'),
    /** El nodo de un selector, creandolo si nadie lo habia pedido. */
    nodo: registrar,
    /**
     * Dispara los oyentes que el componente registro en un elemento.
     *
     * Devuelve cuantos corrieron: cero significa que el componente nunca se ato a
     * ese elemento, y quien llama tiene que poder distinguirlo de «corrio y no
     * hizo nada».
     */
    disparar(selector, tipo, evento = {}) {
      const lista = registrar(selector).oyentes.get(tipo) ?? [];
      for (const oyente of lista) oyente(evento);
      return lista.length;
    },
    /** Lo ultimo que el componente escribio con innerHTML. */
    html: (selector) => registrar(selector).innerHTML,
    /**
     * Cuantas veces se reescribio un elemento desde que se preparo este DOM.
     *
     * Se lee dos veces y se resta, que es la unica forma de preguntar «cuantas
     * durante ESTA espera» sin depender de cuantas hubo antes.
     */
    escrituras: (selector) => registrar(selector).escrituras,
    /** Lo ultimo que el componente escribio con textContent. */
    texto: (selector) => registrar(selector).textContent,
    /** Si un elemento quedo con la clase `hidden` puesta. */
    oculto: (selector) => registrar(selector).classList.contains('hidden'),
  };
}
