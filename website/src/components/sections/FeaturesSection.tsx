import React from 'react';
import { LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title,
  subtitle,
  features
}) => {
  return (
    <section className={`${themeClasses.section.primary} relative overflow-hidden`}>
      {/* Background Elements */}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`${themeClasses.heading.section} text-white mb-6`}>
            {title.split(' ').map((word, index) => (
              <span key={index}>
                {word === 'Detailing' || word === 'Hub?' ? (
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    {word}
                  </span>
                ) : (
                  word
                )}{' '}
              </span>
            ))}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.title} className="text-center group">
                <div className={themeClasses.iconContainer.large}>
                  <IconComponent className="w-12 h-12 text-black" />
                </div>
                <h3 className={`${themeClasses.heading.feature} mb-6 group-hover:text-orange-400 transition-colors duration-300`}>
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-lg">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
