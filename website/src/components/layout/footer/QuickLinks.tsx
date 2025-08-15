import React from 'react';
import { Link } from 'react-router-dom';
import { themeClasses } from '../../../config/theme';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Book Now', href: '/book' },
  { name: 'Contact', href: '/contact' },
  { name: 'My Bookings', href: '/my-bookings' },
];

const QuickLinks: React.FC = () => {
  return (
    <div className={themeClasses.spacing.footerSection}>
      <h4 className={themeClasses.text.footerHeading}>Quick Links</h4>
      <ul className={themeClasses.spacing.footerLinksContainer}>
        {quickLinks.map((link) => (
          <li key={link.name}>
            <Link to={link.href} className={themeClasses.text.footerLink}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
