// ==================== THEME SYSTEM ====================

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryHover: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Surface colors (cards, modals, etc.)
  surface: string;
  surfaceHover: string;
  surfaceSecondary: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderHover: string;
  
  // Status colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  
  // Focus/Active states
  focus: string;
  focusRing: string;
}

export interface ThemeComponents {
  // Input components
  input: {
    base: string;
    focus: string;
    error: string;
    disabled: string;
  };
  
  // Button components
  button: {
    primary: string;
    secondary: string;
    danger: string;
    ghost: string;
    disabled: string;
  };
  
  // Card components
  card: {
    base: string;
    hover: string;
    border: string;
  };
  
  // Modal components
  modal: {
    overlay: string;
    container: string;
    header: string;
    content: string;
    footer: string;
  };
  
  // Table components
  table: {
    container: string;
    header: string;
    row: string;
    rowHover: string;
    cell: string;
  };
  
  // Badge components
  badge: {
    default: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// ==================== DARK THEME (Premium Modern) ====================
export const darkTheme: ThemeColors & { components: ThemeComponents } = {
  // Colors - Rich indigo/violet with teal accents
  primary: 'bg-gradient-to-r from-indigo-600 to-violet-600',
  primaryHover: 'hover:from-indigo-500 hover:to-violet-500',
  primaryLight: 'bg-indigo-500/20',
  primaryDark: 'bg-indigo-700',
  
  secondary: 'bg-teal-600/80',
  secondaryHover: 'hover:bg-teal-500/80',
  
  background: 'bg-slate-950',
  backgroundSecondary: 'bg-slate-900',
  backgroundTertiary: 'bg-slate-800',
  
  surface: 'bg-slate-900/80',
  surfaceHover: 'hover:bg-slate-800/80',
  surfaceSecondary: 'bg-slate-800/60',
  
  textPrimary: 'text-slate-50',
  textSecondary: 'text-slate-300',
  textTertiary: 'text-slate-400',
  textMuted: 'text-slate-500',
  
  border: 'border-slate-700/60',
  borderLight: 'border-slate-600/40',
  borderHover: 'border-indigo-500/60',
  
  success: 'text-emerald-400 bg-emerald-500/15',
  successLight: 'bg-emerald-500/10 text-emerald-300',
  warning: 'text-amber-400 bg-amber-500/15',
  warningLight: 'bg-amber-500/10 text-amber-300',
  error: 'text-rose-400 bg-rose-500/15',
  errorLight: 'bg-rose-500/10 text-rose-300',
  info: 'text-sky-400 bg-sky-500/15',
  infoLight: 'bg-sky-500/10 text-sky-300',
  
  focus: 'focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500',
  focusRing: 'focus:ring-indigo-500/40',
  
  // Components
  components: {
    input: {
      base: 'w-full px-4 py-3 bg-slate-900 border border-slate-700/60 rounded-xl text-slate-50 placeholder-slate-400 transition-all duration-300 shadow-sm',
      focus: 'focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900',
      error: 'border-rose-500/60 focus:ring-rose-500/40 focus:border-rose-500',
      disabled: 'opacity-60 cursor-not-allowed bg-slate-800/50',
    },
    
    button: {
      primary: 'px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40',
      secondary: 'px-6 py-3 bg-teal-600/80 hover:bg-teal-500/80 text-white rounded-xl font-medium shadow-md transition-all duration-300',
      danger: 'px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 transition-all duration-300',
      ghost: 'px-4 py-2 hover:bg-slate-800/60 text-slate-300 rounded-lg transition-all duration-200',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    
    card: {
      base: 'bg-slate-900/80 rounded-xl shadow-xl border border-slate-700/60 backdrop-blur-sm',
      hover: 'hover:bg-slate-800/80 hover:shadow-2xl hover:border-slate-600/60 transition-all duration-300',
      border: 'border border-slate-700/60',
    },
    
    modal: {
      overlay: 'fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50',
      container: 'bg-slate-900/95 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-lg w-full max-w-4xl max-h-[90vh] overflow-hidden',
      header: 'bg-slate-800/60 flex items-center justify-between px-6 py-4 border-b border-slate-700/60',
      content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)]',
      footer: 'flex justify-end gap-4 p-6 border-t border-slate-700/60',
    },
    
    table: {
      container: 'bg-slate-900/80 rounded-xl shadow-xl border border-slate-700/60 backdrop-blur-sm overflow-hidden',
      header: 'bg-slate-800/60 px-6 py-4 border-b border-slate-700/60',
      row: 'border-b border-slate-700/40 hover:bg-slate-800/40 transition-colors duration-200',
      rowHover: 'hover:bg-slate-800/40',
      cell: 'px-6 py-4 text-slate-300',
    },
    
    badge: {
      default: 'px-3 py-1.5 rounded-full text-sm font-medium bg-slate-700/60 text-slate-300 shadow-sm',
      success: 'px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-300 shadow-sm',
      warning: 'px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 shadow-sm',
      error: 'px-3 py-1.5 rounded-full text-sm font-medium bg-rose-500/20 text-rose-300 shadow-sm',
      info: 'px-3 py-1.5 rounded-full text-sm font-medium bg-sky-500/20 text-sky-300 shadow-sm',
    },
  },
};

// ==================== LIGHT THEME (Premium Modern) ====================
export const lightTheme: ThemeColors & { components: ThemeComponents } = {
  // Colors - Sophisticated teal/emerald with warm grays
  primary: 'bg-gradient-to-r from-teal-600 to-emerald-600',
  primaryHover: 'hover:from-teal-500 hover:to-emerald-500',
  primaryLight: 'bg-teal-50',
  primaryDark: 'bg-teal-700',
  
  secondary: 'bg-slate-600',
  secondaryHover: 'hover:bg-slate-500',
  
  background: 'bg-slate-50',
  backgroundSecondary: 'bg-white',
  backgroundTertiary: 'bg-slate-100',
  
  surface: 'bg-white',
  surfaceHover: 'hover:bg-slate-50',
  surfaceSecondary: 'bg-slate-50/80',
  
  textPrimary: 'text-slate-900',
  textSecondary: 'text-slate-700',
  textTertiary: 'text-slate-600',
  textMuted: 'text-slate-500',
  
  border: 'border-slate-200',
  borderLight: 'border-slate-150',
  borderHover: 'border-teal-400',
  
  success: 'text-emerald-700 bg-emerald-50',
  successLight: 'bg-emerald-50 text-emerald-600',
  warning: 'text-amber-700 bg-amber-50',
  warningLight: 'bg-amber-50 text-amber-600',
  error: 'text-rose-700 bg-rose-50',
  errorLight: 'bg-rose-50 text-rose-600',
  info: 'text-sky-700 bg-sky-50',
  infoLight: 'bg-sky-50 text-sky-600',
  
  focus: 'focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500',
  focusRing: 'focus:ring-teal-500/30',
  
  // Components
  components: {
    input: {
      base: 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 transition-all duration-300 shadow-sm hover:border-slate-300',
      focus: 'focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:shadow-md',
      error: 'border-rose-400 focus:ring-rose-500/30 focus:border-rose-500',
      disabled: 'opacity-60 cursor-not-allowed bg-slate-50',
    },
    
    button: {
      primary: 'px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-teal-500/40',
      secondary: 'px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-medium shadow-md transition-all duration-300',
      danger: 'px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 transition-all duration-300',
      ghost: 'px-4 py-2 hover:bg-slate-100 text-slate-700 rounded-lg transition-all duration-200',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    
    card: {
      base: 'bg-white rounded-xl shadow-lg border border-slate-200 backdrop-blur-sm',
      hover: 'hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5',
      border: 'border border-slate-200',
    },
    
    modal: {
      overlay: 'fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50',
      container: 'bg-white/95 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-lg w-full max-w-4xl max-h-[90vh] overflow-hidden',
      header: 'bg-slate-50/80 flex items-center justify-between px-6 py-4 border-b border-slate-200',
      content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)]',
      footer: 'flex justify-end gap-4 p-6 border-t border-slate-200',
    },
    
    table: {
      container: 'bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden',
      header: 'bg-slate-50/80 px-6 py-4 border-b border-slate-200',
      row: 'border-b border-slate-100 hover:bg-slate-50/80 transition-colors duration-200',
      rowHover: 'hover:bg-slate-50/80',
      cell: 'px-6 py-4 text-slate-700',
    },
    
    badge: {
      default: 'px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 shadow-sm',
      success: 'px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 shadow-sm',
      warning: 'px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700 shadow-sm',
      error: 'px-3 py-1.5 rounded-full text-sm font-medium bg-rose-100 text-rose-700 shadow-sm',
      info: 'px-3 py-1.5 rounded-full text-sm font-medium bg-sky-100 text-sky-700 shadow-sm',
    },
  },
};

// ==================== THEME VARIANTS ====================
export const themes = {
  dark: darkTheme,
  light: lightTheme,
} as const;

export type ThemeName = keyof typeof themes;
export type Theme = typeof darkTheme;