import React from 'react';
import { LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface AddOn {
  name: string;
  price: string;
  icon: LucideIcon;
  description: string;
}

interface AddOnsSectionProps {
  title?: string;
  subtitle?: string;
  addOns: AddOn[];
}

const AddOnsSection: React.FC<AddOnsSectionProps> = ({
  title = 'Add-On Services',
  subtitle = 'Enhance your detailing experience with these additional services',
  addOns
}) => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`${themeClasses.heading.section} text-white mb-6`}>
            {title}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addOns.map((addOn, index) => {
            const IconComponent = addOn.icon;
            
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:bg-orange-500/30 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-orange-400" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{addOn.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{addOn.description}</p>
                  
                  <div className="text-2xl font-bold text-orange-400 mb-4">
                    {addOn.price}
                  </div>
                  
                  <button className="w-full py-2 px-4 bg-orange-900/20 border border-orange-500/30 text-white rounded-lg hover:bg-orange-500/20 transition-all duration-300 text-sm font-medium">
                    Add to Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AddOnsSection;
