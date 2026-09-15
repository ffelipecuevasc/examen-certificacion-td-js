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
    set innerHTML(valor) {
      // Reescribir el contenido tira lo que colgaba. Si el foco estaba ahi dentro,
      // se cae al body, que es exactamente lo que hace el navegador y lo que la
      // iteracion 32 tuvo que arreglar en tres caminos distintos.
      if (foco.dentroDe(nodo)) foco.soltar();
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
export function almacenDeMentira({ escrituraProhibida = false, lecturaProhibida = false } = {}) {
  const datos = new Map();

  return {
    getItem(clave) {
      if (lecturaProhibida) throw new Error('lectura denegada por el navegador de mentira');
      return datos.has(clave) ? datos.get(clave) : null;
    },
    setItem(clave, valor) {
      if (escrituraProhibida) throw new Error('escritura denegada por el navegador de mentira');
      datos.set(clave, String(valor));
    },
    removeItem(clave) {
      if (escrituraProhibida) throw new Error('escritura denegada por el navegador de mentira');
      datos.delete(clave);
    },
    /** Lo guardado, para poder mirarlo desde la prueba. No es parte de la API real. */
    datos,
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
 */
export function prepararDomFalso({ almacen } = {}) {
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

  globalThis.document = {
    querySelector: registrar,
    querySelectorAll: () => [],
    get activeElement() {
      return foco.actual ?? body;
    },
  };

  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    scrollTo() {},
  };

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

  return {
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
    /** Lo ultimo que el componente escribio con textContent. */
    texto: (selector) => registrar(selector).textContent,
    /** Si un elemento quedo con la clase `hidden` puesta. */
    oculto: (selector) => registrar(selector).classList.contains('hidden'),
  };
}
