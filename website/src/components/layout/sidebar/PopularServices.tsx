import React from 'react';
import { themeClasses } from '../../../config/theme';

interface ServiceItem {
  name: string;
  price: string;
}

const services: ServiceItem[] = [
  { name: 'Exterior Wash', price: '₹299' },
  { name: 'Interior Cleaning', price: '₹399' },
  { name: 'Full Detailing', price: '₹1,499' },
  { name: 'Premium Package', price: '₹2,999' },
];

const PopularServices: React.FC = () => {
  return (
    <div className={themeClasses.sidebar.section}>
      <h3 className={themeClasses.sidebar.heading}>Popular Services</h3>
      <div className={themeClasses.sidebar.sectionContent}>
        {services.map((service, index) => (
          <div 
            key={service.name} 
            className={index === services.length - 1 ? themeClasses.sidebar.serviceItemLast : themeClasses.sidebar.serviceItem}
          >
            <span className={themeClasses.sidebar.serviceName}>{service.name}</span>
            <span className={themeClasses.sidebar.servicePrice}>{service.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
