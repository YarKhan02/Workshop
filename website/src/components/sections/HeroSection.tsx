import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { themeClasses } from '../../config/theme';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import StaggerContainer from '../animations/StaggerContainer';

interface HeroSectionProps {
  title: {
    main: string;
    highlight: string;
  };
  subtitle: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
  stats: Array<{
    value: string;
    label: string;
  }>;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  stats
}) => {
  return (
    <section className={`${themeClasses.section.hero} relative overflow-hidden`}>
      {/* Car Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className={themeClasses.hero.background}
          style={{
            backgroundImage: 'url(/images/sedan-parked-deserted-area-cloudy-sky.png)',
            filter: 'brightness(0.4) contrast(1.0)',
          }}
        ></div>
        {/* Simplified overlay layers */}
        <div className={themeClasses.hero.overlayPrimary}></div>
        <div className={themeClasses.hero.overlaySecondary}></div>
        <div className={themeClasses.hero.overlayAccent}></div>
      </div>
      
      {/* Minimal Background Elements */}
      <div className={themeClasses.hero.decorativeElements}>
        <div className={themeClasses.decorative.circleL}></div>
        <div className={themeClasses.decorative.circleM}></div>
        <div className={themeClasses.decorative.circleS}></div>
      </div>

      {/* Subtle Gradient Orbs */}
      <div className={themeClasses.hero.orbLeft}></div>
      <div className={themeClasses.hero.orbRight}></div>

      <div className={themeClasses.hero.container}>
        <div className={themeClasses.hero.content}>
          <FadeIn duration={800} delay={200}>
            <div className="flex justify-center mb-8">
              <div className={themeClasses.badge.hero}>
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Premium Car Detailing Service
              </div>
            </div>
          </FadeIn>
          
          <SlideIn direction="up" duration={1000} delay={400}>
            <h1 className={`${themeClasses.heading.hero} ${themeClasses.hero.title}`}>
              {title.main}{' '}
              <span className={themeClasses.hero.titleHighlight}>
                {title.highlight}
              </span>
            </h1>
          </SlideIn>
          
          <FadeIn duration={800} delay={600}>
            <p className={themeClasses.hero.subtitle}>
              {subtitle}
            </p>
          </FadeIn>
          
          <SlideIn direction="up" duration={800} delay={800}>
            <div className={themeClasses.hero.ctaContainer}>
              <Link
                to={primaryCTA.link}
                className={`${themeClasses.button.primary} px-10 py-4 rounded-xl text-lg`}
              >
                <span className="flex items-center">
                  {primaryCTA.text}
                  <Sparkles className="w-5 h-5 ml-2" />
                </span>
              </Link>
              <Link
                to={secondaryCTA.link}
                className={`${themeClasses.button.secondary} px-10 py-4 rounded-xl text-lg`}
              >
                {secondaryCTA.text}
              </Link>
            </div>
          </SlideIn>

          <StaggerContainer staggerDelay={150} className={themeClasses.hero.statsContainer}>
            {stats.map((stat, index) => (
              <FadeIn key={index} duration={600} delay={1000 + (index * 150)}>
                <div className={themeClasses.hero.statCard}>
                  <div className={themeClasses.hero.statValue}>
                    {stat.value}
                  </div>
                  <div className={themeClasses.hero.statLabel}>
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
