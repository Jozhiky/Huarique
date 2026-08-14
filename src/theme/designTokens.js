/**
 * HUARIQUE DE CATACAOS - SYSTEM DESIGN TOKENS
 * Primary Color: Royal Marine Blue (#1552A0 - Pattern Screenshot)
 * Secondary Color: Logo Golden Tan (#C89B3C - Earthenware Jug Logo)
 */

export const DESIGN_TOKENS = {
  colors: {
    // Primary: Royal Marine Blue
    huarique: {
      50: '#F0F5FD',
      100: '#E1ECFB',
      200: '#C3D9F7',
      300: '#91B7EF',
      400: '#558DE3',
      500: '#1552A0', // Royal Blue
      600: '#114389',
      700: '#0D336B',
      800: '#09234B',
      900: '#061630',
    },
    // Secondary: Logo Gold
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
    sage: {
      50: '#F2F7F2',
      100: '#DEECDF',
      500: '#4E8752', // Mesa Libre
      600: '#3D6D40',
      700: '#2D5230',
    },
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#D97706', // Mesa Ocupada
      600: '#B45309',
    },
    terracotta: {
      50: '#FDF2F0',
      100: '#FCE4E0',
      500: '#C05621', // Mesa Por Pagar
      600: '#9C3D12',
    }
  },

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

  borderRadius: {
    modal: 'rounded-3xl sm:rounded-4xl',
    card: 'rounded-2xl sm:rounded-3xl',
    button: 'rounded-2xl',
    pill: 'rounded-full',
    badge: 'rounded-xl',
  },

  touchTargets: {
    minHeight: 'min-h-[48px]',
    minWidth: 'min-w-[48px]',
    buttonPrimary: 'py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95 shadow-touch bg-huarique-500 hover:bg-huarique-600 text-white',
    buttonSecondary: 'py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95 border border-huarique-200 bg-white text-huarique-900',
    iconButton: 'w-11 h-11 rounded-2xl flex items-center justify-center transition active:scale-95 border',
  },

  shadows: {
    soft: 'shadow-[0_4px_20px_-2px_rgba(13,51,107,0.08)]',
    cardHover: 'shadow-[0_10px_30px_-4px_rgba(13,51,107,0.14)]',
    touch: 'shadow-[0_4px_14px_0_rgba(21,82,160,0.35)]',
  }
};
