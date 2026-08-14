/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        huarique: {
          50: '#FAF7F2',
          100: '#F4EFE6',
          200: '#E8DEC9',
          300: '#DBCBA9',
          400: '#D2A752',
          500: '#C89B3C',
          600: '#A87E2C',
          700: '#876220',
          800: '#5C4315',
          900: '#2D261E',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E9F0EB',
          500: '#5A8D65',
          600: '#46704F',
          700: '#34533A',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#D97706',
          600: '#B45309',
        },
        terracotta: {
          50: '#FDF7F5',
          100: '#FDF0ED',
          500: '#E07A5F',
          600: '#C85A3F',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 38, 30, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(45, 38, 30, 0.08)',
        'touch': '0 2px 8px rgba(200, 155, 60, 0.15)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
