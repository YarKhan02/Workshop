import React, { useState } from 'react';
import ServiceCard from '../ui/ServiceCard';
import { useServices } from '../../hooks/useServices';

interface ServicesGridProps {
  ctaLink?: string;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ 
  ctaLink = '/book' 
}) => {
  const { services, categories, loading, error, refetch } = useServices();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter services based on selected category
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(service => service.category === selectedCategory);

  // Show loading state
  if (loading) {
    return (
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">Loading services...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="px-6 py-3 bg-orange-500 text-black rounded-lg font-medium hover:bg-orange-400 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (services.length === 0) {
    return (
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-white/70 text-lg">No services available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-lg'
                  : 'bg-orange-900/20 border border-orange-500/30 text-white hover:bg-orange-500/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              ctaLink={ctaLink}
              popular={index === 1} // You can adjust this logic as needed
            />
          ))}
        </div>

        {/* No services in selected category */}
        {filteredServices.length === 0 && selectedCategory !== 'All' && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No services found in the "{selectedCategory}" category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGrid;
