/**
 * HUARIQUE DE CATACAOS - ERGONOMIC DESIGN TOKENS
 * Canvas: Soothing Slate (#F8FAFC - Zero Eye Strain)
 * Primary Text: Dark Slate (#0F172A - 16:1 Contrast Ratio)
 * Primary Accent: Vibrant Ergonomic Royal Blue (#2563EB)
 * Brand Accent: Warm Gold (#D97706)
 */

export const DESIGN_TOKENS = {
  colors: {
    huarique: {
      50: '#F8FAFC',  // Canvas Background
      100: '#F1F5F9', // Card Soft Background
      200: '#E2E8F0', // Border Neutral
      300: '#CBD5E1',
      400: '#94A3B8', // Muted Subtitle Text
      500: '#2563EB', // Primary Blue Accent
      600: '#1D4ED8', // Primary Active Blue
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#0F172A', // Crisp Dark Slate Text
    },
    gold: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#D97706', // Catacaos Logo Gold
      600: '#B45309',
    },
    sage: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      500: '#16A34A', // Libre Green
      600: '#15803D',
    },
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#D97706', // Ocupada Amber
      600: '#B45309',
    },
    terracotta: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      500: '#E11D48', // Por Pagar Rose/Coral
      600: '#BE123C',
    }
  },

  typography: {
    titleScreen: 'text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight',
    titleSection: 'text-lg sm:text-xl font-bold text-slate-900 tracking-tight',
    titleCard: 'text-base sm:text-lg font-bold text-slate-900',
    subtitle: 'text-xs sm:text-sm font-semibold text-slate-500',
    bodyBold: 'text-xs sm:text-sm font-bold text-slate-800',
    bodyRegular: 'text-xs sm:text-sm font-medium text-slate-600',
    caption: 'text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider',
    metricNumber: 'text-2xl sm:text-3xl font-extrabold text-slate-900',
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
    buttonPrimary: 'py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95 shadow-touch bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: 'py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-95 border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
    iconButton: 'w-11 h-11 rounded-2xl flex items-center justify-center transition active:scale-95 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  },

  shadows: {
    soft: 'shadow-[0_2px_15px_-3px_rgba(15,23,42,0.05)]',
    cardHover: 'shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]',
    touch: 'shadow-[0_4px_14px_0_rgba(37,99,235,0.25)]',
  }
};
