import { Car, Shield, Star, Crown, Sparkles, Zap } from 'lucide-react';

export const pricingPageData = {
  hero: {
    badge: {
      icon: Sparkles,
      text: 'Transparent Pricing'
    },
    title: 'Simple, Honest Pricing',
    highlightedWord: 'Pricing',
    subtitle: 'No hidden fees, no surprises. Choose the perfect package for your vehicle and see exactly what you\'ll get for your investment.'
  },
  
  pricingTiers: [
    {
      name: 'Essential',
      price: '₹499',
      originalPrice: '₹699',
      description: 'Perfect for regular maintenance',
      icon: Car,
      features: [
        'Exterior hand wash',
        'Interior vacuum',
        'Window cleaning',
        'Tire cleaning',
        'Basic drying',
        'Air freshener'
      ],
      popular: false,
      buttonText: 'Choose Essential',
      savings: '₹200'
    },
    {
      name: 'Premium',
      price: '₹1,299',
      originalPrice: '₹1,699',
      description: 'Most popular choice for car enthusiasts',
      icon: Star,
      features: [
        'Everything in Essential',
        'Clay bar treatment',
        'Paint correction (minor)',
        'Interior deep clean',
        'Leather conditioning',
        'Ceramic coating prep',
        'Tire dressing',
        '30-day protection'
      ],
      popular: true,
      buttonText: 'Choose Premium',
      savings: '₹400'
    },
    {
      name: 'Ultimate',
      price: '₹2,999',
      originalPrice: '₹3,999',
      description: 'Complete transformation package',
      icon: Crown,
      features: [
        'Everything in Premium',
        'Multi-stage paint correction',
        'Premium ceramic coating',
        'Engine bay detailing',
        'Headlight restoration',
        'Interior protection',
        'Odor elimination',
        '6-month warranty',
        'Free pickup & delivery'
      ],
      popular: false,
      buttonText: 'Choose Ultimate',
      savings: '₹1,000'
    }
  ],

  addOnPricing: [
    {
      category: 'Protection Services',
      services: [
        { name: 'Ceramic Coating (Premium)', price: '₹3,999', duration: '6-8 hours' },
        { name: 'Paint Protection Film', price: '₹8,999', duration: '1-2 days' },
        { name: 'Interior Protection', price: '₹1,299', duration: '2-3 hours' },
        { name: 'Undercarriage Protection', price: '₹899', duration: '1-2 hours' }
      ]
    },
    {
      category: 'Restoration Services',
      services: [
        { name: 'Paint Correction (Single Stage)', price: '₹1,999', duration: '4-6 hours' },
        { name: 'Paint Correction (Multi Stage)', price: '₹3,999', duration: '8-12 hours' },
        { name: 'Headlight Restoration', price: '₹599', duration: '1-2 hours' },
        { name: 'Trim Restoration', price: '₹799', duration: '2-3 hours' }
      ]
    },
    {
      category: 'Specialty Services',
      services: [
        { name: 'Engine Bay Detailing', price: '₹599', duration: '2-3 hours' },
        { name: 'Pet Hair Removal', price: '₹399', duration: '1-2 hours' },
        { name: 'Odor Elimination', price: '₹299', duration: '1 hour' },
        { name: 'Convertible Top Cleaning', price: '₹899', duration: '2-3 hours' }
      ]
    }
  ],

  benefits: {
    title: 'Why Our Pricing Makes Sense',
    items: [
      {
        icon: Shield,
        title: '100% Satisfaction Guarantee',
        description: 'Not happy with the service? We\'ll make it right or refund your money.'
      },
      {
        icon: Zap,
        title: 'Premium Products',
        description: 'We use only the best products from trusted brands for long-lasting results.'
      },
      {
        icon: Star,
        title: 'Expert Technicians',
        description: 'Certified professionals with years of experience in automotive detailing.'
      }
    ]
  },

  cta: {
    title: 'Ready to Get Started?',
    subtitle: 'Book your service today and see why thousands of customers trust us with their vehicles.',
    primaryCTA: {
      text: 'Book Service Now',
      link: '/book'
    },
    secondaryCTA: {
      text: 'Get Custom Quote',
      link: '/contact'
    }
  }
};
