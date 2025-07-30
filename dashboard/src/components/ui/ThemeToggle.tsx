// ==================== THEME TOGGLE COMPONENT ====================

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme, ThemedButton } from '../ui';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();
  
  return (
    <ThemedButton
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2"
    >
      {currentTheme === 'dark' ? (
        <>
          <Sun className="w-4 h-4" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          Dark Mode
        </>
      )}
    </ThemedButton>
  );
};
