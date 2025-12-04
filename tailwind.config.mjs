/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Colors Cafè & Sinergies
        primary: {
          50: '#e8f4fe',
          100: '#d1eafd',
          200: '#a3d4fb',
          300: '#75bff9',
          400: '#47a9f7',
          500: '#2798F5', // Blau principal
          600: '#1f7ac4',
          700: '#175b93',
          800: '#0f3d62',
          900: '#081e31',
        },
        cafe: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc8',
          300: '#d4c4a8',
          400: '#b8a080',
          500: '#9a8060',
          600: '#7d6648',
          700: '#604c38',
          800: '#433428',
          900: '#261c18',
        },
      },
      fontFamily: {
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
