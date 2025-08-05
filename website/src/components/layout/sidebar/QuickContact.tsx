import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface ContactItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
}

const contactItems: ContactItem[] = [
  {
    icon: Phone,
    title: 'Call Us',
    content: '+91 98765 43210',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    content: '123 Main Street, City',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: 'Mon-Sat: 8AM-8PM',
  },
];

const QuickContact: React.FC = () => {
  return (
    <div className={themeClasses.sidebar.section}>
      <h3 className={themeClasses.sidebar.heading}>Quick Contact</h3>
      <div className={themeClasses.sidebar.contactContainer}>
        {contactItems.map((item) => (
          <div key={item.title} className={themeClasses.sidebar.contactItem}>
            <item.icon className={`h-5 w-5 ${themeClasses.iconColors.orange}`} />
            <div>
              <p className={themeClasses.sidebar.contactTitle}>{item.title}</p>
              <p className={themeClasses.sidebar.contactContent}>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickContact;
