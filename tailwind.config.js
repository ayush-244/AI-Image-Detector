/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-background',
    'bg-card',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        card: '#1e293b',
      },
    },
  },
  plugins: [],
};
