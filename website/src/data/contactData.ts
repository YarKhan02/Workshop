import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';

export const contactPageData = {
  hero: {
    title: 'Get In Touch',
    highlightedWord: 'Touch',
    subtitle: 'Ready to transform your vehicle? Contact us for a free quote or to schedule your detailing service. We\'re here to help!'
  },

  contactInfo: [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 98765 43210',
      subtext: 'Mon-Sun, 8:00 AM - 8:00 PM'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@detailinghub.com',
      subtext: 'We reply within 2 hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Auto Street, Car City',
      subtext: 'Mumbai, Maharashtra 400001'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon-Sun: 8:00 AM - 8:00 PM',
      subtext: 'Same day service available'
    }
  ],

  form: {
    title: 'Send Us a Message',
    submitText: 'Send Message',
    successMessage: {
      title: 'Message Sent!',
      text: 'Thank you for contacting us. We\'ll get back to you within 2 hours.'
    },
    fields: {
      name: {
        label: 'Your Name',
        placeholder: 'Enter your full name',
        required: true
      },
      email: {
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true
      },
      phone: {
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: false
      },
      service: {
        label: 'Service of Interest',
        options: [
          { value: '', label: 'Select a service' },
          { value: 'quick-wash', label: 'Quick Wash' },
          { value: 'premium-exterior', label: 'Premium Exterior' },
          { value: 'interior-clean', label: 'Interior Deep Clean' },
          { value: 'full-detailing', label: 'Full Detailing' },
          { value: 'paint-correction', label: 'Paint Correction' },
          { value: 'ceramic-coating', label: 'Ceramic Coating' }
        ]
      },
      message: {
        label: 'Message',
        placeholder: 'Tell us about your car and what you\'re looking for...',
        rows: 5
      }
    }
  },

  location: {
    title: 'Find Us Here',
    address: '123 Auto Street, Car City',
    city: 'Mumbai, Maharashtra 400001',
    mapPlaceholder: 'Interactive map coming soon'
  },

  whyChooseUs: {
    title: 'Why Choose Us?',
    features: [
      {
        icon: CheckCircle,
        title: 'Free Pickup & Delivery',
        description: 'Convenient service at your location'
      },
      {
        icon: CheckCircle,
        title: 'Same Day Service',
        description: 'Quick turnaround when you need it'
      },
      {
        icon: CheckCircle,
        title: '100% Satisfaction Guarantee',
        description: 'Your happiness is our priority'
      },
      {
        icon: CheckCircle,
        title: 'Premium Products',
        description: 'Only the best for your vehicle'
      }
    ]
  },

  cta: {
    title: 'Ready to Book?',
    subtitle: 'Don\'t wait any longer. Book your service online and experience the Detailing Hub difference today!',
    primaryCTA: {
      text: 'Book Service Now',
      link: '/book'
    },
    secondaryCTA: {
      text: 'Call Now',
      link: 'tel:+919876543210'
    }
  }
};
