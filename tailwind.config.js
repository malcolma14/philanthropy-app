/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ig: {
          blue:  '#0072CE',  // IG Mid Blue — primary
          dark:  '#001E60',  // IG Dark Blue — headlines, key accents
          light: '#8DD0EF',  // IG Light Blue — accent
        },
        navy: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        gold: {
          400: '#f6c84b',
          500: '#e6a817',
          600: '#c8870d',
        }
      },
      fontFamily: {
        sans: ['Nunito Sans', 'Calibri', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
