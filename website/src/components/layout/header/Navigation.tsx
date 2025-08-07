import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { themeClasses } from '../../../config/theme';

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  isMobile = false, 
  onItemClick, 
  className = '' 
}) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const linkClass = (href: string) => {
    const baseClass = themeClasses.text.navLink;
    const activeClass = isActive(href) 
      ? themeClasses.text.navLinkActive 
      : themeClasses.text.navLinkInactive;
    
    return `${baseClass} ${activeClass}`;
  };

  if (isMobile) {
    return (
      <div className={`space-y-3 ${className}`}>
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
            className={`block font-medium ${linkClass(item.href)}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={linkClass(item.href)}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
