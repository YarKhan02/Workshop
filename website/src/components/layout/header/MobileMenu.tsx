import React from 'react';
import Navigation from './Navigation';
import UserMenu from './UserMenu';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-orange-900/30 bg-black">
      <div className="px-4 py-4">
        <Navigation isMobile onItemClick={onClose} />
        <UserMenu isMobile onItemClick={onClose} />
      </div>
    </div>
  );
};

export default MobileMenu;
