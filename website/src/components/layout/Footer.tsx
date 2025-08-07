import React from 'react';
import { themeClasses } from '../../config/theme';
import CompanyInfo from './footer/CompanyInfo';
import QuickLinks from './footer/QuickLinks';
import ServicesSection from './footer/ServicesSection';
import ContactInfo from './footer/ContactInfo';
import FooterBottom from './footer/FooterBottom';

const Footer: React.FC = () => {
  return (
    <footer className={themeClasses.layout.footer}>
      {/* Main Footer Content */}
      <div className={themeClasses.layout.footerContainer}>
        <div className={themeClasses.layout.footerGrid}>
          <CompanyInfo />
          <QuickLinks />
          <ServicesSection />
          <ContactInfo />
        </div>
      </div>

      {/* Bottom Bar */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
