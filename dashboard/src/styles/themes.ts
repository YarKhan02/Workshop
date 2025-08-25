export interface ThemeSearchBar {
  container: string;
  input: string;
  inputCompact: string;
  icon: string;
  filterButton: string;
}
export interface ThemeHome {
  sectionBg: string;
  sectionHeaderBg: string;
  sectionHeaderTitle: string;
  quickAction: {
    booking: string;
    job: string;
    customer: string;
  };
  quickActionBorder: {
    booking: string;
    job: string;
    customer: string;
  };
}
export interface ThemeStats {
  cardIcon: {
    blue: string;
    green: string;
    red: string;
    purple: string;
    orange: string;
    yellow: string;
    gray: string;
  };
}
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

export interface ThemeHeader {
  container: string;
  border: string;
  iconBg: string;
  title: string;
  titleGradient: string;
  subtitle: string;
  actionButtonPrimary: string;
  actionButtonSecondary: string;
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
    headerCell: string;
    headerCellActions: string;
    actionsCell: string;
    actionsContainer: string;
    actionButton: string;
    actionButtonView: string;
    actionButtonEdit: string;
    actionButtonDelete: string;
    actionButtonAdd: string;
    emptyState: string;
    loadingState: string;
    loadingSpinner: string;
    emptyStateText: string;
    emptyStateTitle: string;
    emptyStateSubtitle: string;
  };
  
  // Badge components
  badge: {
    default: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Inventory components
  inventory: {
    container: string;
    searchResults: string;
    searchResultsBorder: string;
    searchResultsBg: string;
    searchResultsText: string;
    searchResultsClearButton: string;
    mainTable: string;
    tableHeader: string;
    tableRow: string;
    tableRowHover: string;
    tableCell: string;
    expandIcon: string;
    productIcon: string;
    productId: string;
    categoryBadge: string;
    categoryIcon: string;
    variantsCount: string;
    variantsCountIcon: string;
    statusBadge: string;
    expandedVariants: string;
    variantsContainer: string;
    variantsHeader: string;
    variantsHeaderBg: string;
    variantsHeaderBorder: string;
    variantsHeaderTitle: string;
    addVariantButton: string;
    variantsTable: string;
    variantsTableHeader: string;
    variantsTableRow: string;
    variantsTableRowHover: string;
    variantsTableCell: string;
    skuBadge: string;
    stockIndicator: string;
    stockIndicatorGreen: string;
    stockIndicatorYellow: string;
    stockIndicatorRed: string;
    stockText: string;
    actionButton: string;
    editButton: string;
    deleteButton: string;
    loadingContainer: string;
    loadingSpinner: string;
    loadingText: string;
    emptyContainer: string;
    emptyIcon: string;
    emptyTitle: string;
    emptySubtitle: string;
    noResultsContainer: string;
    noResultsIcon: string;
    noResultsTitle: string;
    noResultsSubtitle: string;
    clearSearchButton: string;
  };
}

// ==================== DARK THEME (Current) ====================
export const darkTheme: ThemeColors & { components: ThemeComponents; header: ThemeHeader; stats: ThemeStats; home: ThemeHome; searchBar: ThemeSearchBar } = {
  
  // SearchBar section
  searchBar: {
    container: 'bg-gradient-to-br from-[#353535] to-[#9999A1] rounded-xl shadow-2xl border border-gray-700/30 p-6 backdrop-blur-md',
    input: 'w-full pl-10 pr-4 py-3 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-black-500 focus:border-transparent bg-gray-700/50 text-white placeholder-gray-400',
    inputCompact: 'w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black-500/50 focus:border-black-500/50',
    icon: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4',
    filterButton: 'flex items-center px-4 py-3 border border-gray-600/50 rounded-xl hover:bg-gray-700/50 transition-colors text-gray-200',
  },
  
  // Home/Dashboard section
  home: {
    sectionBg: 'bg-gradient-to-br from-[#37423d] to-[#37423d]',
    sectionHeaderBg: 'bg-gradient-to-r from-gray-900/80 to-slate-900/80',
    sectionHeaderTitle: 'text-xl font-semibold text-gray-100',
    quickAction: {
      booking: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
      job: 'bg-gradient-to-br from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30',
      customer: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30',
    },
    quickActionBorder: {
      booking: 'border-blue-400/30',
      job: 'border-orange-400/30',
      customer: 'border-purple-400/30',
    },
  },
  // Stats section
  stats: {
    cardIcon: {
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      red: 'bg-red-500/20 text-red-400',
      purple: 'bg-purple-500/20 text-purple-400',
      orange: 'bg-orange-500/20 text-orange-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      gray: 'bg-gray-700/20 text-gray-400',
    },
  },
  
  // Header section
  header: {
    container: 'bg-[#000000]',
    border: 'border-[#000000]/30',
    iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
    title: 'text-3xl font-bold',
    titleGradient: 'bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent',
    subtitle: '#ffffff',
    actionButtonPrimary: 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700',
    actionButtonSecondary: 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 border border-gray-600/50',
  },

  // Colors
  primary: 'bg-[#000000]',
  // primary: 'bg-gradient-to-r from-orange-500 to-red-600',
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
  
  textPrimary: '#ffffff',
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
      container: 'bg-gradient-to-br from-[#37423d] to-[#37423d] rounded-2xl shadow-2xl border border-transparent backdrop-blur-md w-full max-w-4xl max-h-[90vh] overflow-hidden',
      header: 'bg-gradient-to-r from-[#000000] to-[#000000] flex items-center justify-between px-6 py-4',
      content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)]',
      footer: 'flex justify-end gap-4 p-6',
    },
    
    table: {
      container: 'bg-gradient-to-br from-[#000000] to-[#000000] rounded-xl shadow-2xl backdrop-blur-md overflow-hidden border-transparent',
      header: 'bg-gradient-to-r from-gray-900/80 to-slate-900/80 px-6 py-4 border-b border-gray-600/30',
      row: 'border-b border-gray-600/30 hover:bg-gray-700/30 transition-colors duration-200',
      rowHover: 'hover:bg-gray-700/30',
      cell: 'px-6 py-4 whitespace-nowrap text-gray-300',
      headerCell: 'px-6 py-4 text-left text-xs font-medium #ffffff uppercase tracking-wider',
      headerCellActions: 'px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider',
      actionsCell: 'px-6 py-4 whitespace-nowrap text-sm font-medium',
      actionsContainer: 'flex items-center justify-end gap-3',
      actionButton: 'text-gray-400 hover:text-gray-200 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-600/50',
      actionButtonView: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 p-1.5 rounded-lg',
      actionButtonEdit: 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200 p-1.5 rounded-lg',
      actionButtonDelete: 'text-red-700 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200 p-1.5 rounded-lg',
      actionButtonAdd: 'text-purple-700 dark:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 p-1.5 rounded-lg',
      emptyState: 'p-8 text-center',
      loadingState: 'p-8 text-center',
      loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto',
      emptyStateText: 'text-gray-400',
      emptyStateTitle: 'text-lg font-medium',
      emptyStateSubtitle: 'mt-2',
    },
    
    badge: {
      default: 'px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-gray-300',
      success: 'px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400',
      warning: 'px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400',
      error: 'px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400',
      info: 'px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400',
    },
    
    inventory: {
      container: 'space-y-4',
      searchResults: 'border border-blue-700/50 px-6 py-3 rounded-lg',
      searchResultsBorder: 'border-blue-700/50',
      searchResultsBg: 'bg-blue-900/30',
      searchResultsText: 'text-sm text-blue-300',
      searchResultsClearButton: 'text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors',
      mainTable: 'bg-[#000000] rounded-xl shadow-2xl border-transparent overflow-hidden',
      tableHeader: 'bg-[#000000] border-b border-[#000000]',
      tableRow: 'border-b border-[#000000]',
      tableRowHover: 'hover:bg-[#111111] transition-colors duration-200 cursor-pointer',
      tableCell: 'px-6 py-4 whitespace-nowrap',
      expandIcon: 'h-5 w-5 transition-transform duration-200',
      productIcon: 'p-2 rounded-lg',
      productId: 'text-sm',
      categoryBadge: 'px-3 py-1 bg-gray-700/50 text-gray-200 rounded-full text-sm font-medium border border-gray-600/30',
      categoryIcon: 'h-4 w-4 text-gray-400',
      variantsCount: 'text-lg font-semibold text-gray-100',
      variantsCountIcon: 'h-4 w-4 text-gray-400',
      statusBadge: 'px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium',
      expandedVariants: 'px-0 py-0',
      variantsContainer: 'bg-[#000000] border-t border-[#000000]',
      variantsHeader: 'bg-[#000000] rounded-xl border border-[#000000] overflow-hidden',
      variantsHeaderBg: 'bg-[#a3a3a3] px-4 py-3 border-b border-[#000000]',
      variantsHeaderBorder: 'border-b border-[#000000]',
      variantsHeaderTitle: 'text-sm font-semibold text-gray-300 uppercase tracking-wider',
      addVariantButton: 'flex items-center space-x-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium',
      variantsTable: 'overflow-x-auto',
      variantsTableHeader: 'bg-gradient-to-r from-[#111d13] to-[#111d13] border-b border-gray-600/30',
      variantsTableRow: 'border-b border-transparent',
      variantsTableRowHover: 'hover:bg-[#111111] transition-colors duration-200',
      variantsTableCell: 'px-6 py-4 whitespace-nowrap',
      skuBadge: 'font-mono bg-gray-700/50 text-gray-200 px-2 py-1 rounded text-xs border border-gray-600/30',
      stockIndicator: 'w-2 h-2 rounded-full',
      stockIndicatorGreen: 'bg-green-400',
      stockIndicatorYellow: 'bg-yellow-400',
      stockIndicatorRed: 'bg-red-400',
      stockText: 'font-semibold text-gray-100',
      actionButton: 'p-2 rounded-lg transition-colors',
      editButton: 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20',
      deleteButton: 'text-red-400 hover:text-red-300 hover:bg-red-500/20',
      loadingContainer: 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 overflow-hidden',
      loadingSpinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4',
      loadingText: 'text-gray-300 text-lg',
      emptyContainer: 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 overflow-hidden',
      emptyIcon: 'h-16 w-16 text-gray-500 mx-auto mb-4',
      emptyTitle: 'text-xl font-semibold text-gray-100 mb-2',
      emptySubtitle: 'text-gray-400 mb-6',
      noResultsContainer: 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 overflow-hidden',
      noResultsIcon: 'h-16 w-16 text-gray-500 mx-auto mb-4',
      noResultsTitle: 'text-xl font-semibold text-gray-100 mb-2',
      noResultsSubtitle: 'text-gray-400 mb-6',
      clearSearchButton: 'px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors',
    },
  },
};


// ==================== THEME VARIANTS ====================
export const themes = {
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
export type Theme = typeof darkTheme;
