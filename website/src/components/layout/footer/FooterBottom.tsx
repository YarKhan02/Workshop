import React from 'react';
import { Link } from 'react-router-dom';
import { themeClasses } from '../../../config/theme';

const footerLinks = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Cookie Policy', href: '#' },
];

const FooterBottom: React.FC = () => {
  return (
    <div className={themeClasses.layout.footerBottom}>
      <div className={themeClasses.layout.footerBottomContent}>
        <div className={themeClasses.layout.footerBottomFlex}>
          <div className={themeClasses.text.copyright}>
            © 2025 Detailing Hub. All rights reserved. Powered by Bike Doctors.
          </div>
          <div className={themeClasses.spacing.footerBottomLinks}>
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={themeClasses.text.footerLink}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
