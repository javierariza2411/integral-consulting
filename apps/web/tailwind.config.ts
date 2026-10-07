import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#04142E', 900: '#071B3D', 800: '#0B2447', 700: '#13305C', 600: '#1C4073' },
        gold: { 300: '#EBD08A', 400: '#E0BC6A', 500: '#C9A24B', 600: '#A8832F' },
        burgundy: { 600: '#9B2335', 700: '#7A1C2A' },
        silver: { 50: '#F6F8FB', 100: '#EEF1F5', 300: '#B8C2D1', 500: '#7F8DA3' },
        up: '#4ADE80',
        down: '#F87171',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: { gold: '0 0 0 1px rgba(201,162,75,.35), 0 12px 40px -12px rgba(201,162,75,.25)' },
    },
  },
  plugins: [],
};
export default config;
