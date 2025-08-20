import React from 'react';
import { Mail, MapPin, Clock } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

const contactData = [
  // {
  //   icon: Phone,
  //   title: 'Call Us',
  //   content: '034190655342',
  // },
  {
    icon: Mail,
    title: 'Email',
    content: 'admin@detailinghubpk.com',
  },
  {
    icon: MapPin,
    title: 'Address',
    content: '176-C Al-Murtaza Commercial Lane 3, DHA Phase 8\nKarachi, Pakistan 75500',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: 'Mon-Sun: 8:00 AM - 8:00 PM',
  },
];

const ContactInfo: React.FC = () => {
  return (
    <div className={themeClasses.spacing.footerSection}>
      <h4 className={themeClasses.text.footerHeading}>Contact Info</h4>
      <div className={themeClasses.spacing.contactInfoContainer}>
        {contactData.map((item) => (
          <div key={item.title} className={themeClasses.spacing.contactInfoItem}>
            <item.icon className={`w-5 h-5 ${themeClasses.iconColors.orange} mt-1`} />
            <div>
              <p className={themeClasses.text.contactTitle}>{item.title}</p>
              <p className={themeClasses.text.footerText} style={{ whiteSpace: 'pre-line' }}>
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
