import React from 'react';
import { LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface Badge {
  icon: LucideIcon;
  text: string;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  className?: string;
  backgroundVariant?: 'gradient' | 'simple';
  badge?: Badge;
  highlightedWord?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ 
  title, 
  subtitle, 
  className = '', 
  backgroundVariant = 'gradient',
  badge,
  highlightedWord
}) => {
  const renderTitle = () => {
    if (highlightedWord) {
      const parts = title.split(highlightedWord);
      return (
        <>
          {parts[0]}
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {highlightedWord}
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section className={`py-24 bg-black text-white relative overflow-hidden ${className}`}>
      {backgroundVariant === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-black to-orange-500/5"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-20 h-20 border-2 border-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 border-2 border-orange-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-orange-600 rounded-full animate-ping"></div>
          </div>

          {/* Gradient Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-orange-600/15 to-transparent rounded-full blur-3xl"></div>
        </>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <div className="inline-flex items-center px-4 py-2 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
              <badge.icon className="w-4 h-4 mr-2" />
              {badge.text}
            </div>
          )}
          
          <h1 className={`${themeClasses.heading.section} text-white mb-6`}>
            {renderTitle()}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
