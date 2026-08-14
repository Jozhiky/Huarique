/**
 * HUARIQUE DE CATACAOS - SYSTEM DESIGN TOKENS
 * Base de tokens de diseño para mantener consistencia visual en tablets y móviles.
 */

export const DESIGN_TOKENS = {
  // Paleta de Colores Curada (Light Mode Warm Earthenware)
  colors: {
    brand: {
      50: '#FDFBF7',
      100: '#F5ECE0',
      200: '#E9D6C0',
      300: '#DBBC9B',
      400: '#CF9D68',
      500: '#C89B3C', // Golden Tan / Cántaro Catacaos
      600: '#B2822B',
      700: '#8E621F',
      800: '#694617',
      900: '#261C14', // Rich Coffee / Negro Cálido
    },
    sage: {
      50: '#F2F7F2',
      100: '#DEECDF',
      500: '#4E8752', // Verde Estado Libre
      600: '#3D6D40',
      700: '#2D5230',
      800: '#1D3720',
    },
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#D97706', // Ámbar Estado Ocupado
      600: '#B45309',
      700: '#92400E',
    },
    terracotta: {
      50: '#FDF2F0',
      100: '#FCE4E0',
      500: '#C05621', // Terracota Estado Por Pagar
      600: '#9C3D12',
      700: '#7B2C0E',
    }
  },

  // Escala Tipográfica para Tablets (Alta Legibilidad)
  typography: {
    titleScreen: 'text-2xl sm:text-3xl font-black text-huarique-900 tracking-tight',
    titleSection: 'text-lg sm:text-xl font-black text-huarique-900 tracking-tight',
    titleCard: 'text-base sm:text-lg font-black text-huarique-900',
    subtitle: 'text-xs sm:text-sm font-extrabold text-huarique-600',
    bodyBold: 'text-xs sm:text-sm font-extrabold text-huarique-800',
    bodyRegular: 'text-xs sm:text-sm font-semibold text-huarique-600',
    caption: 'text-[11px] sm:text-xs font-bold text-huarique-500 uppercase tracking-wider',
    metricNumber: 'text-2xl sm:text-3xl font-black text-huarique-900',
  },

  // Esquinas Redondeadas Ergónomicas
  borderRadius: {
    modal: 'rounded-3xl sm:rounded-4xl',
    card: 'rounded-2xl sm:rounded-3xl',
    button: 'rounded-2xl',
    pill: 'rounded-full',
    badge: 'rounded-xl',
  },

  // Estándar Táctil Minímo (Touch Targets)
  touchTargets: {
    minHeight: 'min-h-[48px]',
    minWidth: 'min-w-[48px]',
    buttonPrimary: 'py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95 shadow-touch',
    buttonSecondary: 'py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95 border',
    iconButton: 'w-11 h-11 rounded-2xl flex items-center justify-center transition active:scale-95 border',
  },

  // Sombras Suaves (Glassmorphism & Depth)
  shadows: {
    soft: 'shadow-[0_4px_20px_-2px_rgba(38,28,20,0.06)]',
    cardHover: 'shadow-[0_8px_30px_-4px_rgba(38,28,20,0.12)]',
    touch: 'shadow-[0_4px_14px_0_rgba(200,155,60,0.35)]',
  }
};
