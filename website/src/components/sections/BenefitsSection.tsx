import React from 'react';
import { LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface BenefitsData {
  title: string;
  items: Benefit[];
}

interface BenefitsSectionProps {
  benefits: BenefitsData;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            {benefits.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.items.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-white/70">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
