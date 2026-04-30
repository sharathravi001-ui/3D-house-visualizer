/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4e7',
          100: '#fae3c3',
          200: '#f5c784',
          300: '#f0aa45',
          400: '#e8900f',
          500: '#c97608',
          600: '#a85e06',
          700: '#854905',
          800: '#623603',
          900: '#3f2202',
        }
      }
    }
  },
  plugins: [],
}
