import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { themeClasses } from '../../config/theme';
import Logo from './header/Logo';
import Navigation from './header/Navigation';
import UserMenu from './header/UserMenu';
import MobileMenu from './header/MobileMenu';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={themeClasses.layout.header}>
      <div className={themeClasses.layout.container}>
        <div className={themeClasses.layout.headerContent}>
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <Navigation />

          {/* Desktop User Menu */}
          <UserMenu />

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className={themeClasses.button.mobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};

export default Header; 