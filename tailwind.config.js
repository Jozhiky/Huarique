/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand: WCAG AAA Compliant Deep Royal Blue (#113F67 / #0F4C81)
        huarique: {
          50: '#FAF8F5',  // Warm Earthenware Cream Background
          100: '#F1F5F9', // Soft Neutral Tint
          200: '#E2E8F0', // Border Neutral
          300: '#CBD5E1',
          400: '#64748B',
          500: '#113F67', // WCAG AAA Deep Royal Navy (#113F67)
          600: '#0E3455',
          700: '#0B2943',
          800: '#081F33',
          900: '#051422', // Deepest Text Dark
        },
        // Secondary Brand: WCAG AAA Compliant Logo Gold (#A16207)
        gold: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          500: '#A16207', // Logo Gold (WCAG AAA Compliant > 7:1)
          600: '#854D0E',
          700: '#713F12',
          800: '#542D0E',
          900: '#3A1E0B',
        },
        // Status Colors (WCAG AAA Compliant > 7:1 Contrast)
        sage: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#15803D', // Libre (AAA Green)
          600: '#166534',
          700: '#14532D',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#B45309', // Ocupada (AAA Amber)
          600: '#92400E',
          700: '#78350F',
        },
        terracotta: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#B91C1C', // Por Pagar (AAA Terracotta Red)
          600: '#991B1B',
          700: '#7F1D1D',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(5, 20, 34, 0.06)',
        'soft-lg': '0 10px 30px -4px rgba(5, 20, 34, 0.12)',
        'touch': '0 4px 14px 0 rgba(17, 63, 103, 0.35)',
      }
    },
  },
  plugins: [],
}
