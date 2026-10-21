/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Road & Brass Palette
        asphalt: {
          DEFAULT: '#171A1D',
          50: '#2A2F33',
          100: '#22272A',
          900: '#111315',
        },
        charcoal: {
          DEFAULT: '#22272A',
          light: '#2C3236',
          dark: '#1A1E20',
        },
        forest: {
          DEFAULT: '#20352F',
          50: '#F0F5F3',
          100: '#DCEDE5',
          200: '#B8D9CC',
          light: '#2C4941',
          dark: '#162521',
          900: '#0E1715',
        },
        brass: {
          DEFAULT: '#C79A45',
          hover: '#D9B56A',
          light: '#EADBB6',
          dark: '#9F752C',
          50: '#FAF6ED',
          100: '#F4ECD8',
          200: '#E7D3A6',
          300: '#D9B56A',
          400: '#C79A45',
          500: '#B88B38',
          600: '#9F752C',
        },
        warm: {
          white: '#F5F1E8',
          paper: '#FAF7F1',
          card: '#EEE8DC',
          muted: '#E4DDCF',
          border: '#DDD5C5',
        },
        stone: {
          muted: '#A9A59B',
          border: '#343A3C',
          light: '#C5C1B8',
          dark: '#262B2E',
        },
        success: {
          DEFAULT: '#5F8F72',
          light: '#7AA78C',
          dark: '#487158',
        },
        error: {
          DEFAULT: '#B85C4A',
          light: '#CC7360',
          dark: '#944435',
        },
        // Primary alias to Brass for backward compatibility
        primary: {
          50: '#FAF6ED',
          100: '#F4ECD8',
          200: '#E7D3A6',
          300: '#D9B56A',
          400: '#C79A45',
          500: '#C79A45',
          600: '#B88B38',
          700: '#9F752C',
          800: '#7B591D',
          900: '#5A3F12',
        },
        accent: {
          DEFAULT: '#C79A45',
          light: '#D9B56A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'card-warm': '0 4px 18px -2px rgba(32, 53, 47, 0.08)',
        'brass': '0 4px 14px 0 rgba(199, 154, 69, 0.25)',
        'brass-lg': '0 8px 24px -2px rgba(199, 154, 69, 0.35)',
      },
    },
  },
  plugins: [],
};
