import React from 'react';
import { CheckCircle } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface GuaranteeData {
  title: string;
  subtitle: string;
  features: string[];
}

interface GuaranteeSectionProps {
  guarantee: GuaranteeData;
}

const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ guarantee }) => {
  return (
    <section className="py-24 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`${themeClasses.heading.section} text-white mb-6`}>
            {guarantee.title}
          </h2>
          <p className="text-xl text-white/70 mb-12">
            {guarantee.subtitle}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guarantee.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center justify-center md:justify-start space-x-3 p-4 bg-black/20 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-colors duration-300"
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
