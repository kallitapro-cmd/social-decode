/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a2e',
        card: '#16213e',
        primary: '#e8a838',
        'primary-hover': '#d4922a',
        secondary: '#7ec8e3',
        'text-main': '#e0e0e0',
        'text-muted': '#a0a0b0',
        'border-subtle': '#2a2a4a',
        'bubble-user': '#1e3a5f',
        'bubble-ai': '#1e2a40',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['16px', '1.6'],
      },
    },
  },
  plugins: [],
}
