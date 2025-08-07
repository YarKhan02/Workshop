// Theme configuration for consistent styling across the application

export const theme = {
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    orange: {
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
    },
    gray: {
      300: '#d1d5db',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    green: {
      400: '#34d399',
    },
    yellow: {
      400: '#fbbf24',
    },
    black: '#000000',
    white: '#ffffff',
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
    '4xl': '8rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  gradients: {
    primaryBrand: 'bg-gradient-to-r from-orange-500 to-orange-600',
    primaryBrandHover: 'from-orange-400 to-orange-500',
    backgroundPrimary: 'bg-gradient-to-br from-orange-600/10 via-black to-orange-500/5',
    backgroundSecondary: 'bg-gradient-to-r from-orange-500/10 to-orange-600/10',
    textPrimary: 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent',
    radialOrange: 'bg-gradient-radial from-orange-500/30 to-transparent',
  },
  
  animations: {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
    ping: 'animate-ping',
  },
  
  transitions: {
    default: 'transition-all duration-300',
    slow: 'transition-all duration-500',
    fast: 'transition-all duration-200',
  }
};

export const themeClasses = {
  // Button styles
  button: {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-black font-bold transition-all duration-300 hover:from-orange-400 hover:to-orange-500 transform hover:-translate-y-1',
    secondary: 'border border-white/30 text-white font-medium hover:bg-white/5 hover:border-white/50 transition-all duration-300',
    outline: 'bg-orange-500/10 border border-orange-500/30 text-white hover:bg-orange-500/20 transition-all duration-300',
    mobileMenu: 'md:hidden p-2 rounded-lg hover:bg-orange-900/20 transition-colors text-white',
  },
  
  // Card styles
  card: {
    primary: 'bg-black/50 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-orange-400/30 transition-all duration-300 hover:-translate-y-2',
    secondary: 'bg-gray-900/50 rounded-2xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1',
    featured: 'border-orange-400/50 bg-orange-500/5',
  },
  
  // Text styles
  heading: {
    hero: 'text-5xl lg:text-7xl font-bold leading-tight',
    section: 'text-4xl lg:text-5xl font-bold',
    card: 'text-2xl font-bold text-white',
    feature: 'text-3xl font-bold text-white',
  },

  // Text utilities
    text: {
      logoMain: 'text-white font-bold text-xl',
      logoSub: 'text-orange-400 text-xs font-medium tracking-wider',
      navLink: 'font-medium transition-colors duration-200',
      navLinkActive: 'text-orange-400',
      navLinkInactive: 'text-gray-300 hover:text-orange-400',
      footerHeading: 'text-white font-semibold text-lg mb-4',
      footerText: 'text-gray-300',
      footerLink: 'text-gray-300 hover:text-orange-400 transition-colors duration-200',
      copyright: 'text-center text-gray-400 text-sm',
      userWelcome: 'text-xs text-white/40 pt-2',
      contactTitle: 'text-white font-medium',
    },  // Spacing and layout utilities
  spacing: {
    logoContainer: 'flex items-center space-x-3',
    logoTextContainer: 'flex flex-col',
    navContainer: 'hidden md:flex items-center space-x-8',
    navMobileContainer: 'space-y-3',
    userMenuContainer: 'hidden md:flex items-center space-x-4',
      userMenuButton: 'flex items-center space-x-2',
      userMenuDropdown: 'absolute right-0 mt-2 w-48 bg-black/95 rounded-lg shadow-lg border border-orange-900/30 py-2 z-50',
      userMenuMobile: 'pt-4 space-y-3',
      socialContainer: 'flex items-center space-x-4',
    socialIcon: 'w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white transition-all duration-200 hover:bg-orange-500',
      socialText: 'text-sm text-gray-300',
      footerLinksContainer: 'space-y-2',
      loginButtonMobile: 'px-6 py-3 rounded-lg font-semibold',
      footerSection: 'space-y-6',
      contactInfoContainer: 'space-y-4',
      contactInfoItem: 'flex items-start space-x-3',
      footerBottomLinks: 'flex space-x-6 text-sm',
    },

  // Icon color variants
  iconColors: {
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    white: 'text-white',
    gray: 'text-gray-400',
  },
  
  // Icon containers
  iconContainer: {
    primary: 'w-16 h-16 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/30',
    featured: 'bg-gradient-to-br from-orange-500 to-orange-600',
    large: 'w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300',
  },
  
  // Layout styles
  section: {
    primary: 'py-20 bg-black',
    hero: 'relative bg-black text-white overflow-hidden min-h-screen flex items-center',
    cta: 'py-20 bg-black text-white relative overflow-hidden',
  },
  
  // Badge styles
  badge: {
    primary: 'inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-400/20 rounded-full text-orange-200 text-sm font-medium backdrop-blur-sm',
    popular: 'bg-gradient-to-r from-orange-500 to-orange-600 text-black px-4 py-2 rounded-full text-sm font-medium',
    discount: 'text-sm text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full inline-block',
    hero: 'bg-orange-500/15 backdrop-blur-sm border border-orange-400/20 rounded-full px-6 py-3 text-orange-200 text-sm font-medium',
  },

  // Hero specific styles
  hero: {
    background: 'absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 animate-slow-zoom',
    overlayPrimary: 'absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70',
    overlaySecondary: 'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40',
    overlayAccent: 'absolute inset-0 bg-gradient-to-br from-orange-900/10 via-transparent to-orange-800/5',
    decorativeElements: 'absolute inset-0 opacity-10 z-10',
    orbLeft: 'absolute top-0 left-0 w-80 h-80 bg-gradient-radial from-orange-500/10 to-transparent rounded-full blur-3xl',
    orbRight: 'absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-orange-600/8 to-transparent rounded-full blur-3xl',
    container: 'relative container mx-auto px-4 py-16 lg:py-24 z-20',
    content: 'max-w-5xl mx-auto text-center',
    title: 'text-white mb-6',
    titleHighlight: 'bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent',
    subtitle: 'text-lg lg:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed',
    ctaContainer: 'flex flex-col sm:flex-row gap-6 justify-center items-center mb-16',
    statsContainer: 'mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center',
    statCard: 'group cursor-pointer bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-orange-400/30 transition-all duration-300 hover:bg-black/30',
    statValue: 'text-3xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300',
    statLabel: 'text-white/60 group-hover:text-white/80 transition-colors duration-300 text-sm',
  },

  // Decorative elements
  decorative: {
    circleL: 'absolute top-20 left-10 w-16 h-16 border border-orange-500/50 rounded-full',
    circleM: 'absolute bottom-32 right-20 w-12 h-12 border border-orange-400/30 rounded-full',
    circleS: 'absolute top-1/2 right-1/4 w-8 h-8 bg-orange-500/30 rounded-full',
  },

  // Layout utilities
  layout: {
    header: 'bg-black shadow-lg sticky top-0 z-50',
    container: 'container mx-auto px-4',
    headerContent: 'flex items-center justify-between h-20',
    footer: 'bg-black text-white border-t border-orange-900/30',
    footerContainer: 'container mx-auto px-4 py-16',
    footerGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
    footerBottom: 'border-t border-orange-900/30 bg-black',
    footerBottomContent: 'container mx-auto px-4 py-6',
    footerBottomFlex: 'flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0',
    sidebar: 'hidden lg:block fixed right-0 top-24 w-80 h-[calc(100vh-6rem)] bg-gray-900 shadow-xl border-l border-gray-800 p-6 overflow-y-auto z-40',
    sidebarContent: 'space-y-6',
  },

  // Sidebar specific styles
  sidebar: {
    section: 'bg-gray-800 rounded-lg p-4 border border-gray-700',
    sectionTitle: 'text-lg font-semibold text-white mb-3',
    sectionContent: 'space-y-3',
    heading: 'text-lg font-semibold text-white mb-3',
    contactContainer: 'space-y-3',
    contactItem: 'flex items-center space-x-3',
    contactIcon: 'h-5 w-5 text-orange-400',
    contactTitle: 'text-sm font-medium text-white',
    contactText: 'text-sm text-gray-300',
    contactContent: 'text-sm text-gray-300',
    featureItem: 'flex items-start space-x-3',
    featureIcon: 'h-5 w-5 mt-0.5',
    featureTitle: 'text-sm font-medium text-white',
    featureDesc: 'text-xs text-gray-300',
    featureDescription: 'text-xs text-gray-300',
    serviceItem: 'flex justify-between items-center py-2 border-b border-gray-700',
    serviceItemLast: 'flex justify-between items-center py-2',
    serviceName: 'text-sm text-gray-300',
    servicePrice: 'text-sm font-medium text-orange-400',
    reviewCard: 'bg-gray-700 rounded p-3 border border-gray-600',
    reviewStars: 'flex text-yellow-400',
    reviewStar: 'h-4 w-4 fill-current',
    reviewRating: 'text-sm text-gray-300 ml-2',
    reviewText: 'text-sm text-gray-300',
    reviewAuthor: 'text-xs text-gray-400 mt-2',
  }
};

export default theme;
