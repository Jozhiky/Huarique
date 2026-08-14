/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Color: Royal Marine Blue (from user pattern screenshot)
        huarique: {
          50: '#F0F5FD',
          100: '#E1ECFB',
          200: '#C3D9F7',
          300: '#91B7EF',
          400: '#558DE3',
          500: '#1552A0', // Primary Royal Blue
          600: '#114389',
          700: '#0D336B',
          800: '#09234B',
          900: '#061630',
        },
        // Secondary Brand Color: Golden Tan (Original logo earthenware tone)
        gold: {
          50: '#FDFBF7',
          100: '#F5ECE0',
          200: '#E9D6C0',
          300: '#DBBC9B',
          400: '#CF9D68',
          500: '#C89B3C', // Logo Golden Tan
          600: '#B2822B',
          700: '#8E621F',
          800: '#694617',
          900: '#261C14',
        },
        // Status Colors
        sage: {
          50: '#F2F7F2',
          100: '#DEECDF',
          200: '#BED9C0',
          300: '#97BF9A',
          500: '#4E8752', // Mesa Libre
          600: '#3D6D40',
          700: '#2D5230',
          800: '#1D3720',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          500: '#D97706', // Mesa Ocupada
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
        },
        terracotta: {
          50: '#FDF2F0',
          100: '#FCE4E0',
          200: '#F8C4BB',
          300: '#F29A8B',
          500: '#C05621', // Mesa Por Pagar
          600: '#9C3D12',
          700: '#7B2C0E',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(13, 51, 107, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(13, 51, 107, 0.12)',
        'touch': '0 4px 14px 0 rgba(21, 82, 160, 0.35)',
      }
    },
  },
  plugins: [],
}
