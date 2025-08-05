import React from 'react';
import Layout from '../components/layout/Layout';
import PageHero from '../components/ui/PageHero';
import ContactInfo from '../components/sections/ContactInfo';
import ContactForm from '../components/sections/ContactForm';
import LocationMap from '../components/sections/LocationMap';
import CTASection from '../components/sections/CTASection';
import { contactPageData } from '../data/contactData';

const Contact: React.FC = () => {
  return (
    <Layout>
      <PageHero 
        title={contactPageData.hero.title}
        subtitle={contactPageData.hero.subtitle}
        highlightedWord={contactPageData.hero.highlightedWord}
      />
      
      <ContactInfo contactInfo={contactPageData.contactInfo} />
      
      {/* Contact Form & Map */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm formData={contactPageData.form} />
            <LocationMap 
              location={contactPageData.location} 
              whyChooseUs={contactPageData.whyChooseUs} 
            />
          </div>
        </div>
      </section>
      
      <CTASection {...contactPageData.cta} />
    </Layout>
  );
};

export default Contact; 