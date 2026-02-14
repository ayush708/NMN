/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b2ff',
          400: '#3399ff',
          500: '#0080ff',
          600: '#0066cc',
          700: '#004d99',
          800: '#003366',
          900: '#001a33',
        },
        secondary: {
          50: '#e6f7f0',
          100: '#ccefe1',
          200: '#99dfc3',
          300: '#66cfa5',
          400: '#33bf87',
          500: '#00af69',
          600: '#008c54',
          700: '#00693f',
          800: '#00462a',
          900: '#002315',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
