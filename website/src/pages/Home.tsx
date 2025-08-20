import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import StatsSection from '../components/sections/StatsSection';
// import TestimonialsSection from '../components/sections/TestimonialsSection';
import CTASection from '../components/sections/CTASection';
import {
  heroData,
  servicesData,
  featuresData,
  statsData,
  // testimonialsData,
  ctaData,
} from '../data/homeData';

const Home: React.FC = () => {
  return (
    <Layout>
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        primaryCTA={heroData.primaryCTA}
        secondaryCTA={heroData.secondaryCTA}
        stats={heroData.stats}
      />
      
      <ServicesSection
        title={servicesData.title}
        subtitle={servicesData.subtitle}
        ctaLink={servicesData.ctaLink}
      />

      <StatsSection
        stats={statsData}
      />
      
      <FeaturesSection
        title={featuresData.title}
        subtitle={featuresData.subtitle}
        features={featuresData.features}
      />
      
      {/* <TestimonialsSection
        title={testimonialsData.title}
        subtitle={testimonialsData.subtitle}
        testimonials={testimonialsData.testimonials}
      /> */}
      
      <CTASection
        title={ctaData.title}
        subtitle={ctaData.subtitle}
        primaryCTA={ctaData.primaryCTA}
        secondaryCTA={ctaData.secondaryCTA}
      />
    </Layout>
  );
};

export default Home;