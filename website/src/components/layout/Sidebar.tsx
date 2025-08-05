import React from 'react';
import { themeClasses } from '../../config/theme';
import QuickContact from './sidebar/QuickContact';
import WhyChooseUs from './sidebar/WhyChooseUs';
import PopularServices from './sidebar/PopularServices';
import CustomerReviews from './sidebar/CustomerReviews';

const Sidebar: React.FC = () => {
  return (
    <aside className={themeClasses.layout.sidebar}>
      <div className={themeClasses.layout.sidebarContent}>
        <QuickContact />
        <WhyChooseUs />
        <PopularServices />
        <CustomerReviews />
      </div>
    </aside>
  );
};

export default Sidebar; 