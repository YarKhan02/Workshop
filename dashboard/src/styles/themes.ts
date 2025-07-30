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

// ==================== DARK THEME (Current) ====================
export const darkTheme: ThemeColors & { components: ThemeComponents } = {
  // Colors
  primary: 'bg-gradient-to-r from-orange-500 to-red-600',
  primaryHover: 'hover:from-orange-600 hover:to-red-700',
  primaryLight: 'bg-orange-500/20',
  primaryDark: 'bg-orange-700',
  
  secondary: 'bg-gray-700/50',
  secondaryHover: 'hover:bg-gray-600/50',
  
  background: 'bg-gray-900',
  backgroundSecondary: 'bg-gray-800',
  backgroundTertiary: 'bg-gray-700',
  
  surface: 'bg-gradient-to-br from-gray-800/50 to-slate-800/50',
  surfaceHover: 'hover:from-gray-700/50 hover:to-slate-700/50',
  surfaceSecondary: 'bg-gray-900/50',
  
  textPrimary: 'text-gray-100',
  textSecondary: 'text-gray-300',
  textTertiary: 'text-gray-400',
  textMuted: 'text-gray-500',
  
  border: 'border-gray-700/30',
  borderLight: 'border-gray-600/50',
  borderHover: 'border-orange-500',
  
  success: 'text-emerald-400 bg-emerald-500/20',
  successLight: 'bg-green-500/20 text-green-400',
  warning: 'text-amber-400 bg-amber-500/20',
  warningLight: 'bg-yellow-500/20 text-yellow-400',
  error: 'text-red-400 bg-red-500/20',
  errorLight: 'bg-red-500/20 text-red-400',
  info: 'text-blue-400 bg-blue-500/20',
  infoLight: 'bg-blue-500/20 text-blue-400',
  
  focus: 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
  focusRing: 'focus:ring-orange-500',
  
  // Components
  components: {
    input: {
      base: 'w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 transition-all duration-300',
      focus: 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
      error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
      disabled: 'opacity-50 cursor-not-allowed bg-gray-800/50',
    },
    
    button: {
      primary: 'px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300',
      secondary: 'px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-all duration-300',
      danger: 'px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300',
      ghost: 'px-4 py-2 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all duration-200',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    
    card: {
      base: 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md',
      hover: 'hover:from-gray-700/50 hover:to-slate-700/50 transition-all duration-300',
      border: 'border border-gray-700/30',
    },
    
    modal: {
      overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50',
      container: 'bg-gradient-to-br from-gray-800/95 to-slate-800/95 rounded-2xl shadow-2xl border border-gray-700/30 backdrop-blur-md w-full max-w-4xl max-h-[90vh] overflow-hidden',
      header: 'flex items-center justify-between p-6 border-b border-gray-700/30',
      content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)]',
      footer: 'flex justify-end gap-4 p-6 border-t border-gray-700/30',
    },
    
    table: {
      container: 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md overflow-hidden',
      header: 'bg-gradient-to-r from-gray-900/80 to-slate-900/80 px-6 py-4 border-b border-gray-700/50',
      row: 'border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors duration-200',
      rowHover: 'hover:bg-gray-700/30',
      cell: 'px-6 py-4 text-gray-300',
    },
    
    badge: {
      default: 'px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-gray-300',
      success: 'px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400',
      warning: 'px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400',
      error: 'px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400',
      info: 'px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400',
    },
  },
};

// ==================== LIGHT THEME ====================
export const lightTheme: ThemeColors & { components: ThemeComponents } = {
  // Colors
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600',
  primaryHover: 'hover:from-blue-700 hover:to-indigo-700',
  primaryLight: 'bg-blue-100',
  primaryDark: 'bg-blue-800',
  
  secondary: 'bg-gray-200',
  secondaryHover: 'hover:bg-gray-300',
  
  background: 'bg-gray-50',
  backgroundSecondary: 'bg-white',
  backgroundTertiary: 'bg-gray-100',
  
  surface: 'bg-white',
  surfaceHover: 'hover:bg-gray-50',
  surfaceSecondary: 'bg-gray-50',
  
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-700',
  textTertiary: 'text-gray-600',
  textMuted: 'text-gray-500',
  
  border: 'border-gray-200',
  borderLight: 'border-gray-300',
  borderHover: 'border-blue-500',
  
  success: 'text-green-700 bg-green-100',
  successLight: 'bg-green-50 text-green-600',
  warning: 'text-yellow-700 bg-yellow-100',
  warningLight: 'bg-yellow-50 text-yellow-600',
  error: 'text-red-700 bg-red-100',
  errorLight: 'bg-red-50 text-red-600',
  info: 'text-blue-700 bg-blue-100',
  infoLight: 'bg-blue-50 text-blue-600',
  
  focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  focusRing: 'focus:ring-blue-500',
  
  // Components
  components: {
    input: {
      base: 'w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-300',
      focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
      disabled: 'opacity-50 cursor-not-allowed bg-gray-100',
    },
    
    button: {
      primary: 'px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300',
      secondary: 'px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-300',
      danger: 'px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300',
      ghost: 'px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-all duration-200',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    
    card: {
      base: 'bg-white rounded-xl shadow-lg border border-gray-200',
      hover: 'hover:shadow-xl transition-all duration-300',
      border: 'border border-gray-200',
    },
    
    modal: {
      overlay: 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50',
      container: 'bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden',
      header: 'flex items-center justify-between p-6 border-b border-gray-200',
      content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)]',
      footer: 'flex justify-end gap-4 p-6 border-t border-gray-200',
    },
    
    table: {
      container: 'bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden',
      header: 'bg-gray-50 px-6 py-4 border-b border-gray-200',
      row: 'border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200',
      rowHover: 'hover:bg-gray-50',
      cell: 'px-6 py-4 text-gray-700',
    },
    
    badge: {
      default: 'px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700',
      success: 'px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700',
      warning: 'px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700',
      error: 'px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700',
      info: 'px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700',
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
