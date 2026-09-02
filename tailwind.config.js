/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
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
        mutedink: '#5C5A4A',
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
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
