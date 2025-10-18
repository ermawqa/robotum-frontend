/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Exo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['72px', { lineHeight: '1.05', fontWeight: '700' }],
        h1: ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        h2: ['48px', { lineHeight: '1.15', fontWeight: '600' }],
        h3: ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        base: ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        sm: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      colors: {
        primary: '#000C21',
        secondary: '#1E293B',
        accent: '#3B82F6',
        light: '#F1F5F9',
      },
      letterSpacing: {
        tightish: '0.8px',
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
      },
      boxShadow: {
        card: '0 10px 25px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}