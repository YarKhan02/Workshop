import React, { useState } from 'react';
import ServiceCard from '../ui/ServiceCard';
import { LucideIcon } from 'lucide-react';

interface Service {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  duration: string;
  icon: LucideIcon;
  features: string[];
  popular: boolean;
  category: string;
}

interface ServicesGridProps {
  services: Service[];
  categories: string[];
  ctaLink?: string;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ 
  services, 
  categories, 
  ctaLink = '/book' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-lg'
                  : 'bg-orange-900/20 border border-orange-500/30 text-white hover:bg-orange-500/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <ServiceCard 
              key={`${service.name}-${index}`} 
              service={service} 
              ctaLink={ctaLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
