import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContactInfoItem {
  icon: LucideIcon;
  title: string;
  details: string;
  subtext: string;
}

interface ContactInfoProps {
  contactInfo: ContactInfoItem[];
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contactInfo }) => {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                <p className="text-orange-400 font-semibold mb-1">{info.details}</p>
                <p className="text-white/60 text-sm">{info.subtext}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
