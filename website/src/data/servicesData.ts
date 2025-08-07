import { Car, Shield, Star, Sparkles, Droplets, Wrench, Zap, Award } from 'lucide-react';

export const servicesPageData = {
  hero: {
    title: 'Professional Car Detailing Services',
    subtitle: 'Choose from our comprehensive range of car care services designed to keep your vehicle looking its best',
  },
  
  services: [
    {
      name: 'Quick Wash',
      description: 'Perfect for regular maintenance and quick refreshment',
      price: '₹399',
      originalPrice: '₹499',
      duration: '30-45 mins',
      icon: Car,
      features: [
        'Exterior hand wash',
        'Tire cleaning',
        'Window cleaning',
        'Quick dry',
        'Tire shine'
      ],
      popular: false,
      category: 'Basic'
    },
    {
      name: 'Premium Exterior',
      description: 'Complete exterior detailing with protection',
      price: '₹1,299',
      originalPrice: '₹1,599',
      duration: '2-3 hours',
      icon: Sparkles,
      features: [
        'Hand wash with premium products',
        'Clay bar treatment',
        'Paint correction (minor)',
        'Ceramic coating application',
        'Tire and wheel detailing',
        'Window treatment'
      ],
      popular: true,
      category: 'Premium'
    },
    {
      name: 'Interior Deep Clean',
      description: 'Professional interior cleaning and protection',
      price: '₹899',
      originalPrice: '₹1,199',
      duration: '2-3 hours',
      icon: Shield,
      features: [
        'Complete vacuum cleaning',
        'Dashboard restoration',
        'Leather conditioning',
        'Fabric protection',
        'Odor elimination',
        'UV protection treatment'
      ],
      popular: false,
      category: 'Interior'
    },
    {
      name: 'Full Detailing',
      description: 'Complete transformation inside and out',
      price: '₹2,499',
      originalPrice: '₹2,999',
      duration: '4-6 hours',
      icon: Star,
      features: [
        'Everything from Premium Exterior',
        'Everything from Interior Deep Clean',
        'Engine bay cleaning',
        'Paint correction',
        'Ceramic coating',
        '6-month protection warranty'
      ],
      popular: true,
      category: 'Complete'
    },
    {
      name: 'Paint Correction',
      description: 'Professional paint restoration and correction',
      price: '₹3,999',
      originalPrice: '₹4,999',
      duration: '6-8 hours',
      icon: Award,
      features: [
        'Multi-stage paint correction',
        'Swirl mark removal',
        'Scratch removal',
        'Paint enhancement',
        'Premium ceramic coating',
        '1-year warranty'
      ],
      popular: false,
      category: 'Specialty'
    },
    {
      name: 'Ceramic Coating',
      description: 'Ultimate paint protection with ceramic technology',
      price: '₹5,999',
      originalPrice: '₹7,499',
      duration: '1-2 days',
      icon: Zap,
      features: [
        'Premium ceramic coating',
        'Paint preparation',
        'Multi-layer application',
        'Hydrophobic protection',
        'UV protection',
        '2-year warranty'
      ],
      popular: false,
      category: 'Protection'
    }
  ],

  addOns: [
    {
      name: 'Engine Bay Cleaning',
      price: '₹299',
      icon: Wrench,
      description: 'Deep cleaning of engine compartment'
    },
    {
      name: 'Headlight Restoration',
      price: '₹399',
      icon: Sparkles,
      description: 'Restore cloudy headlights to crystal clear'
    },
    {
      name: 'Odor Treatment',
      price: '₹199',
      icon: Droplets,
      description: 'Professional odor elimination treatment'
    },
    {
      name: 'Pet Hair Removal',
      price: '₹299',
      icon: Shield,
      description: 'Specialized pet hair removal service'
    }
  ],

  categories: ['All', 'Basic', 'Premium', 'Interior', 'Complete', 'Specialty', 'Protection'],

  processSteps: [
    {
      step: '1',
      title: 'Book Online',
      description: 'Choose your service and book a convenient time slot'
    },
    {
      step: '2',
      title: 'Pickup',
      description: 'We collect your vehicle from your location'
    },
    {
      step: '3',
      title: 'Service',
      description: 'Professional detailing at our facility'
    },
    {
      step: '4',
      title: 'Delivery',
      description: 'Your sparkling clean car delivered back to you'
    }
  ],

  guarantee: {
    title: 'Our Service Guarantee',
    subtitle: 'We stand behind our work with comprehensive guarantees',
    features: [
      '100% Satisfaction Guarantee',
      'Money-back Promise',
      'Premium Products Only',
      'Certified Technicians',
      'Fully Insured Service',
      'Eco-friendly Methods'
    ]
  }
};
