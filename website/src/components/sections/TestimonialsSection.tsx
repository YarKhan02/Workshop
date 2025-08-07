import React from 'react';
import { Star } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  location: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title,
  subtitle,
  testimonials
}) => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className={`${themeClasses.heading.section} text-white mb-6`}>
            {title.split(' ').map((word, index) => (
              <span key={index}>
                {word === 'Say' ? (
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    {word}
                  </span>
                ) : (
                  word
                )}{' '}
              </span>
            ))}
          </h2>
          <p className="text-xl text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`${themeClasses.card.secondary} p-8 group`}
            >
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current group-hover:animate-pulse" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">
                "{testimonial.comment}"
              </p>
              <div className="border-t border-gray-700 pt-6">
                <div className="font-bold text-white text-lg">{testimonial.name}</div>
                <div className="text-orange-400 text-sm font-medium">{testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
