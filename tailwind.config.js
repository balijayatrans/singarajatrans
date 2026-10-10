/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        singaraja: {
          orange: '#F97316',
          darkOrange: '#EA580C',
          navy: '#0F172A',
          slate: '#1E293B',
          soft: '#FFF7ED'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
};
