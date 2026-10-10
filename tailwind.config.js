/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF7EE',
          100: '#F6EBDD',
          200: '#E7CEA0',
          400: '#D9A441',
          600: '#C58F32'
        },
        singaraja: {
          gold: '#D9A441',
          darkGold: '#C58F32',
          navy: '#0F172A',
          slate: '#1E293B',
          soft: '#F6EBDD'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
};
