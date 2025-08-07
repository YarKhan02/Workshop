import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { themeClasses } from '../../../config/theme';

interface UserMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isMobile = false, onItemClick }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    onItemClick?.();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
    onItemClick?.();
  };

  if (isMobile) {
    return (
      <div className={themeClasses.spacing.userMenuMobile}>
        {isAuthenticated ? (
          <>
            <Link
              to="/my-bookings"
              onClick={onItemClick}
              className={themeClasses.text.navLinkInactive}
            >
              My Bookings
            </Link>
            <button
              onClick={handleLogout}
              className={`w-full text-left ${themeClasses.text.navLinkInactive} ${themeClasses.spacing.userMenuButton}`}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
            <div className={themeClasses.text.userWelcome}>
              Welcome, {user?.name}
            </div>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className={`block w-full text-center ${themeClasses.button.primary} ${themeClasses.spacing.loginButtonMobile}`}
          >
            Login / Sign Up
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={themeClasses.spacing.userMenuContainer}>
      {isAuthenticated ? (
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={themeClasses.text.navLinkInactive}
          >
            <div className={themeClasses.spacing.userMenuButton}>
              <User size={20} />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
          </button>
          
          {isUserMenuOpen && (
            <div className={themeClasses.spacing.userMenuDropdown}>
              <Link
                to="/my-bookings"
                onClick={() => setIsUserMenuOpen(false)}
                className={themeClasses.text.footerLink}
              >
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className={`w-full text-left ${themeClasses.text.footerLink} ${themeClasses.spacing.userMenuButton}`}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className={`${themeClasses.button.primary} ${themeClasses.spacing.loginButtonMobile}`}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default UserMenu;
