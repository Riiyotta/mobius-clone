/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { bg: '#ffffff', ink: '#000000' },
    fontFamily: { display: ['"Inter Display"', 'Inter', 'sans-serif'] },
  } },
  plugins: [],
}
