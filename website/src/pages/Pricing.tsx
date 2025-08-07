import React from 'react';
import Layout from '../components/layout/Layout';
import PageHero from '../components/ui/PageHero';
import PricingTiers from '../components/sections/PricingTiers';
import AddOnPricing from '../components/sections/AddOnPricing';
import BenefitsSection from '../components/sections/BenefitsSection';
import CTASection from '../components/sections/CTASection';
import { pricingPageData } from '../data/pricingData';

const Pricing: React.FC = () => {
  return (
    <Layout>
      <PageHero 
        title={pricingPageData.hero.title}
        subtitle={pricingPageData.hero.subtitle}
        badge={pricingPageData.hero.badge}
        highlightedWord={pricingPageData.hero.highlightedWord}
      />
      
      <PricingTiers tiers={pricingPageData.pricingTiers} />
      
      <AddOnPricing addOns={pricingPageData.addOnPricing} />
      
      <BenefitsSection benefits={pricingPageData.benefits} />
      
      <CTASection {...pricingPageData.cta} />
    </Layout>
  );
};

export default Pricing; 