// ==================== THEME CONTEXT ====================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, type ThemeName, type Theme } from '../styles/themes';

interface ThemeContextType {
  currentTheme: ThemeName;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    // Check localStorage for saved theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('workshop-theme') as ThemeName;
      return savedTheme && savedTheme in themes ? savedTheme : defaultTheme;
    }
    return defaultTheme;
  });

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workshop-theme', currentTheme);
      
      // Update document class for global styles
      document.documentElement.className = currentTheme;
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      theme,
      toggleTheme,
      setTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
