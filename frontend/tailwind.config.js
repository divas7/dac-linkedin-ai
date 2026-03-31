/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dac: {
          50: '#f4f5f9',
          100: '#e5e7f1',
          200: '#d0d3e5',
          300: '#adb3d4',
          400: '#838ebf',
          500: '#6471ab',
          600: '#4e5891',
          700: '#414876',
          800: '#383e63',
          900: '#323653',
          950: '#212335',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
