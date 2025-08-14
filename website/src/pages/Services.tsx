import React from 'react';
import Layout from '../components/layout/Layout';
import PageHero from '../components/ui/PageHero';
import ServicesGrid from '../components/sections/ServicesGrid';
import AddOnsSection from '../components/sections/AddOnsSection';
import ProcessSteps from '../components/sections/ProcessSteps';
import GuaranteeSection from '../components/sections/GuaranteeSection';
import CTASection from '../components/sections/CTASection';
import { servicesPageData } from '../data/servicesData';

const Services: React.FC = () => {
  const ctaData = {
    title: 'Ready to Book Your Service?',
    subtitle: 'Choose your perfect detailing package and let us transform your vehicle today!',
    primaryCTA: {
      text: 'Book Service Now',
      link: '/book',
    },
    secondaryCTA: {
      text: 'Get Quote',
      link: '/contact',
    },
  };

  return (
    <Layout>
      <PageHero 
        title={servicesPageData.hero.title}
        subtitle={servicesPageData.hero.subtitle}
      />
      
      <ServicesGrid 
        ctaLink="/book"
      />
      
      <AddOnsSection 
        addOns={servicesPageData.addOns}
      />
      
      <ProcessSteps 
        steps={servicesPageData.processSteps}
      />
      
      <GuaranteeSection 
        guarantee={servicesPageData.guarantee}
      />
      
      <CTASection {...ctaData} />
    </Layout>
  );
};

export default Services;
