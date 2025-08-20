import { Shield, Clock, Users } from 'lucide-react';

export const heroData = {
  title: {
    main: 'Your Car Deserves the',
    highlight: 'Best Care',
  },
  subtitle: 'Professional car detailing services with premium products, expert technicians, and guaranteed satisfaction. Transform your vehicle into a masterpiece.',
  primaryCTA: {
    text: 'Book Service Now',
    link: '/book',
  },
  secondaryCTA: {
    text: 'View Services',
    link: '/services',
  },
  stats: [
    { value: '500+', label: 'Happy Customers' },
    { value: '5★', label: 'Average Rating' },
    { value: '24/7', label: 'Service Available' },
    { value: '100%', label: 'Satisfaction' },
  ],
};

export const servicesData = {
  title: 'Choose Your Perfect Package',
  subtitle: 'From basic cleaning to premium protection, we have the perfect service for your vehicle',
  ctaLink: '/book',
};

export const featuresData = {
  title: 'Why Choose Detailing Hub?',
  subtitle: "We're not just another car wash. We're your vehicle's best friend.",
  features: [
    {
      icon: Shield,
      title: 'Expert Professionals',
      description: 'Certified technicians with years of experience in automotive detailing'
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Fast service with guaranteed completion time and doorstep pickup'
    },
    {
      icon: Users,
      title: '100% Satisfaction',
      description: 'Money-back guarantee on all services with premium quality assurance'
    }
  ],
};

export const statsData = [
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Expert Technicians' },
  { value: '5000+', label: 'Cars Detailed' },
  { value: '100%', label: 'Eco-Friendly' },
];

export const testimonialsData = {
  title: 'What Our Customers Say',
  subtitle: 'Real reviews from real customers who love our service',
  testimonials: [
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Amazing service! My car looks brand new. The team is professional and punctual.',
      location: 'Mumbai'
    },
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Best detailing service in the city. The ceramic coating is still perfect after 6 months.',
      location: 'Delhi'
    },
    {
      name: 'Amit Patel',
      rating: 5,
      comment: 'Incredible attention to detail. They transformed my 5-year-old car completely.',
      location: 'Bangalore'
    }
  ],
};

export const ctaData = {
  title: 'Ready to Transform Your Vehicle?',
  subtitle: 'Book your detailing service today and experience the difference professional care makes. Your car will thank you!',
  primaryCTA: {
    text: 'Book Service Now',
    link: '/book',
  },
  secondaryCTA: {
    text: 'Get Free Quote',
    link: '/contact',
  },
};
