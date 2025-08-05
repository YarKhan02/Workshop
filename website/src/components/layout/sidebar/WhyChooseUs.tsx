import React from 'react';
import { Star, Car, Clock } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

const features: FeatureItem[] = [
  {
    icon: Star,
    title: 'Professional Service',
    description: 'Expert technicians with years of experience',
    color: themeClasses.iconColors.yellow,
  },
  {
    icon: Car,
    title: 'Quality Products',
    description: 'Premium detailing products and equipment',
    color: themeClasses.iconColors.orange,
  },
  {
    icon: Clock,
    title: 'Quick Service',
    description: 'Fast turnaround time guaranteed',
    color: themeClasses.iconColors.green,
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <div className={themeClasses.sidebar.section}>
      <h3 className={themeClasses.sidebar.heading}>Why Choose Us</h3>
      <div className={themeClasses.sidebar.sectionContent}>
        {features.map((feature) => (
          <div key={feature.title} className={themeClasses.sidebar.featureItem}>
            <feature.icon className={`${themeClasses.sidebar.featureIcon} ${feature.color}`} />
            <div>
              <p className={themeClasses.sidebar.featureTitle}>{feature.title}</p>
              <p className={themeClasses.sidebar.featureDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
