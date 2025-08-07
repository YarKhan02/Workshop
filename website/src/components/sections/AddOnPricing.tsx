import React from 'react';
import { themeClasses } from '../../config/theme';

interface Service {
  name: string;
  price: string;
  duration: string;
}

interface AddOnCategory {
  category: string;
  services: Service[];
}

interface AddOnPricingProps {
  addOns: AddOnCategory[];
}

const AddOnPricing: React.FC<AddOnPricingProps> = ({ addOns }) => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            Add-on Services
          </h2>
          <p className="text-xl text-white/70">
            Enhance your package with specialized services
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {addOns.map((category, index) => (
            <div key={index} className="bg-black/50 border border-orange-900/30 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="flex justify-between items-center p-4 bg-orange-900/10 border border-orange-900/20 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{service.name}</div>
                      <div className="text-sm text-white/60">{service.duration}</div>
                    </div>
                    <div className="text-lg font-bold text-orange-400">{service.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddOnPricing;
