/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Identidad VZ Groups: azul y verde de la "VZ" del logo, sobre carbón y
        // grises fríos. El azul hace el trabajo (acciones, bandas de sección);
        // el verde queda para líneas de producto y estados de éxito.
        vz: {
          blue: '#2a4f9e',
          'blue-dark': '#1f3c7a',
          'blue-deep': '#152a57',
          'blue-tint': '#eaf0fa',
          green: '#3b8a4f',
          'green-dark': '#2c6b3c',
          'green-tint': '#e9f4ec',
          ink: '#1c2127',
          'ink-soft': '#3a424d',
          muted: '#5b6573',
          line: '#dfe4ea',
          mist: '#f3f5f7',
        },
      },
      fontFamily: {
        display: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
    },
  },
  plugins: [],
}
