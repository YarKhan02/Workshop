import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA
}) => {
  return (
    <section className={themeClasses.section.cta}>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-black to-orange-500/10"></div>
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-radial from-orange-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-6xl lg:text-7xl font-bold mb-8">
            {title.split(' ').map((word, index) => (
              <span key={index}>
                {word === 'Transform' || word === 'Vehicle?' ? (
                  <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {word}
                  </span>
                ) : (
                  word
                )}{' '}
              </span>
            ))}
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to={primaryCTA.link}
              className={`group ${themeClasses.button.primary} px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-2`}
            >
              <span className="flex items-center justify-center">
                {primaryCTA.text}
                <Car className="w-6 h-6 ml-3 group-hover:animate-bounce" />
              </span>
            </Link>
            <Link
              to={secondaryCTA.link}
              className={`${themeClasses.button.secondary} px-12 py-6 rounded-2xl text-xl`}
            >
              {secondaryCTA.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
