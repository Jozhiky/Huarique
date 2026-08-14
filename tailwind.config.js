/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soothing Royal Marine Blue & Crisp Slate Canvas
        huarique: {
          50: '#F8FAFC',  // Soothing Slate Canvas (Zero Eye Strain)
          100: '#F1F5F9', // Card Soft Background
          200: '#E2E8F0', // Crisp Border
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#2563EB', // Vibrant Ergonomic Royal Blue
          600: '#1D4ED8', // Primary Active Blue
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#0F172A', // Crisp Dark Slate Text (High Contrast 16:1)
        },
        // Warm Gold Brand Accent (Catacaos Logo Accent)
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#D97706', // Warm Gold Accent
          600: '#B45309',
          700: '#92400E',
        },
        // Soft Ergonomic Status Colors
        sage: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#16A34A', // Libre Green
          600: '#15803D',
          700: '#166534',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#D97706', // Ocupada Amber
          600: '#B45309',
          700: '#92400E',
        },
        terracotta: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          500: '#E11D48', // Por Pagar Rose/Coral
          600: '#BE123C',
          700: '#9F1239',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
        'touch': '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
