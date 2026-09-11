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
 * que el foco se mueva, ni que nada de eso se vea. Prueba la DECISION del
 * componente, que es la mitad que se puede comprobar sin navegador.
 */

/** Un nodo de mentira, con lo justo para que los componentes lo usen. */
function crearNodo(selector, registrar) {
  const clases = new Set();
  const oyentes = new Map();

  const nodo = {
    selector,
    dataset: {},
    style: {},
    value: '',
    disabled: false,
    oyentes,
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
    /** Cuantas veces se le pidio el foco. Es lo unico del foco que se puede saber. */
    focos: 0,
    focus() {
      nodo.focos += 1;
    },
    // Devolver un nodo y no null es lo que permite que responder() llegue hasta
    // el final: recorre hacia arriba y hacia los lados buscando la tarjeta de la
    // pregunta y sus alternativas. Con null se caia en la primera linea.
    closest: (s) => registrar(`${selector} closest ${s}`),
    querySelector: (s) => registrar(`${selector} > ${s}`),
    querySelectorAll: (s) => [registrar(`${selector} >> ${s}`)],
  };

  return nodo;
}

/**
 * Instala el DOM falso en `globalThis` y devuelve con que leerlo.
 *
 * Se llama UNA vez por proceso, antes de importar los componentes: los modulos ES
 * se evaluan al importarse, y un componente que lea `document` durante su carga no
 * lo encontraria.
 */
export function prepararDomFalso() {
  const nodos = new Map();

  const registrar = (selector) => {
    if (!nodos.has(selector)) nodos.set(selector, crearNodo(selector, registrar));
    return nodos.get(selector);
  };

  globalThis.document = {
    querySelector: registrar,
    querySelectorAll: () => [],
  };

  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    scrollTo() {},
  };

  return {
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
