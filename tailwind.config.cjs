/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './static/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        panel: '#121108',
        panel2: '#1B1910',
        panel3: '#25220F',
        jsyellow: '#F7DF1E',
        jsyellowdim: '#D8C420',
        paper: '#FBF7E8',
        muted: '#9C9A85',
        mutedink: '#8E8C7A',
        ruby: '#E0115F',
        rubydim: '#7A1236',
        esmeralda: '#10B981',
        esmeraldadim: '#0A5C43',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },

        /**
         * EFECTO «tada» · LINEAS COPIADAS DE animate.css
         *
         *   Origen     animate.css 4.1.1, archivo animate.css publicado en cdnjs
         *              https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.css
         *   Copyright  Animate.css Copyright 2021 Daniel Eden
         *   Licencia   Hippocratic License 2.1
         *              https://github.com/animate-css/animate.css/blob/main/LICENSE
         *
         * NO SE INSTALO EL PAQUETE (decision 2 de la iteracion 36): se copiaron
         * estas llaves y nada mas. Sin dependencia nueva.
         *
         * LAS DOS FUENTES NO COINCIDEN, Y SE CITA LA MAS EXIGENTE. El archivo
         * LICENSE vigente del repositorio de animate.css dice **Hippocratic
         * License 2.1**, que pide atribucion. El encabezado del propio archivo
         * CSS 4.1.1 que sirve cdnjs, en cambio, todavia declara **MIT**. Ante la
         * discrepancia se cita la Hippocratic 2.1, que es la que impone mas
         * condiciones: si resultara que manda la otra, se habra atribuido de mas,
         * que no rompe nada.
         *
         * ESTE AVISO NO LLEGA AL SITIO PUBLICADO, y se sabe (decision 7):
         * tailwind.config.cjs no se copia a dist/ y los comentarios no sobreviven
         * a la compilacion. La atribucion visible vive pendiente en acerca-de.html,
         * anotada en _planmaestro/00_producto/registro_log.md.
         *
         * Se copian solo las llaves sin prefijo: el original las repite con
         * -webkit-, que en 2026 ya no hace falta.
         */
        tada: {
          from: { transform: 'scale3d(1, 1, 1)' },
          '10%, 20%': { transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
          '40%, 60%, 80%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
          to: { transform: 'scale3d(1, 1, 1)' },
        },

        /**
         * El aviso de que una tarjeta de modulo se despliega.
         *
         * Empieza y termina en la posicion de reposo a proposito: con
         * `prefers-reduced-motion` la regla de src/input.css recorta la duracion a
         * 0,01 ms, y una animacion que terminara desplazada dejaria la pildora
         * corrida para siempre. Empezando y terminando igual, recortarla equivale
         * a no haberla corrido.
         */
        asomar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-5px)' },
          '55%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-2px)' },
        },

        /**
         * El indicador de que un modulo se esta cargando (iteracion 35).
         *
         * ES UN LATIDO Y NO UNA BARRA, Y ESO ES LA DECISION 1. La respuesta de
         * /api/preguntas llega por partes y sin cabecera de largo, asi que el
         * navegador no sabe cuanto pesa antes de terminar de recibirla: no hay
         * porcentaje que calcular. Y aunque lo hubiera, el cuerpo tarda unos 8 ms
         * en bajar dentro de una espera de ~400 ms, asi que una barra pasaria casi
         * todo el rato en 0 y saltaria a 100 al final. Este latido no promete
         * ningun avance: solo dice que la pagina sigue viva.
         *
         * EMPIEZA Y TERMINA EN REPOSO, que es la regla de la iteracion 36: en
         * reposo los puntos estan a opacidad 1, que es su estado en el CSS. Con
         * `prefers-reduced-motion` la regla de src/input.css recorta la duracion a
         * 0,01 ms y las iteraciones a 1, asi que recortarlo equivale a no haberlo
         * corrido y los puntos se quedan visibles, no a medio apagar.
         */
        latido: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',

        // El `1` final no es decorativo: es la decision 6 y la 8 escritas donde se
        // pueden leer. Las dos animaciones nuevas ocurren UNA VEZ. Un movimiento
        // que se repite compite con el texto que el estudiante intenta leer.
        tada: 'tada 1s ease-in-out 1',
        asomar: 'asomar 1.1s ease-in-out 1',

        // Este si se repite, y es la excepcion razonada: mientras dura, la carga
        // sigue ocurriendo, y un indicador que se detiene solo diria que la pagina
        // se colgo. Dura lo que dura la carga y ni un milisegundo mas, porque lo
        // que lo retira es el dibujo del modulo. No compite con ningun texto que
        // el estudiante este leyendo: en esa pantalla no hay nada mas que leer.
        latido: 'latido 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
