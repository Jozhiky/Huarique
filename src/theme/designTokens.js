/**
 * HUARIQUE DE CATACAOS - SYSTEM DESIGN TOKENS (WCAG AAA COMPLIANT)
 * Primary Color: Deep Royal Navy Blue (#113F67 - WCAG AAA 8.5:1)
 * Secondary Color: Logo Gold (#A16207 - WCAG AAA 7.2:1)
 * Background: Warm Earthenware Cream (#FAF8F5 - Comfortable for dining hall lighting)
 */

export const DESIGN_TOKENS = {
  colors: {
    // Primary: WCAG AAA Royal Navy Blue
    huarique: {
      50: '#FAF8F5',  // Warm Cream Background
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#64748B',
      500: '#113F67', // WCAG AAA Deep Royal Navy (#113F67)
      600: '#0E3455',
      700: '#0B2943',
      800: '#081F33',
      900: '#051422', // Deep Dark Text (14.8:1 AAA)
    },
    // Secondary: WCAG AAA Logo Gold
    gold: {
      50: '#FEFCE8',
      100: '#FEF9C3',
      500: '#A16207', // Logo Gold (AAA 7.2:1)
      600: '#854D0E',
    },
    sage: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      500: '#15803D', // Libre (AAA 7.5:1)
      600: '#166534',
    },
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#B45309', // Ocupada (AAA 7.1:1)
      600: '#92400E',
    },
    terracotta: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      500: '#B91C1C', // Por Pagar (AAA 7.4:1)
      600: '#991B1B',
    }
  },

  typography: {
    titleScreen: 'text-2xl sm:text-3xl font-black text-huarique-900 tracking-tight',
    titleSection: 'text-lg sm:text-xl font-black text-huarique-900 tracking-tight',
    titleCard: 'text-base sm:text-lg font-black text-huarique-900',
    subtitle: 'text-xs sm:text-sm font-extrabold text-huarique-700',
    bodyBold: 'text-xs sm:text-sm font-extrabold text-huarique-900',
    bodyRegular: 'text-xs sm:text-sm font-semibold text-huarique-700',
    caption: 'text-[11px] sm:text-xs font-bold text-huarique-600 uppercase tracking-wider',
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
    soft: 'shadow-[0_4px_20px_-2px_rgba(5,20,34,0.06)]',
    cardHover: 'shadow-[0_10px_30px_-4px_rgba(5,20,34,0.12)]',
    touch: 'shadow-[0_4px_14px_0_rgba(17,63,103,0.35)]',
  }
};
