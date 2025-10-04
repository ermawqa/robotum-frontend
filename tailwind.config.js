/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        exo: ['Exo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['72px', { lineHeight: '1.05', fontWeight: '700' }],
        'h1': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['48px', { lineHeight: '1.15', fontWeight: '600' }],
        'text1': ['24px', { lineHeight: '1.3', fontWeight: '400' }],
        'text2': ['16px', { lineHeight: '1.45', fontWeight: '400' }],
      },
      letterSpacing: {
        tightish: '0.8px',
      },
    },
  },
  plugins: [],
}