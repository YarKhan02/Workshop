import React from 'react';
import { themeClasses } from '../../config/theme';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  title?: string;
  subtitle?: string;
  steps: ProcessStep[];
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({
  title = 'How It Works',
  subtitle = 'Simple steps to get your car detailed',
  steps
}) => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`${themeClasses.heading.section} text-white mb-6`}>
            {title}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative flex flex-col items-center">
              {/* Connecting Line - always consistent, solid, and behind the circle */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 left-1/2 translate-x-1/2 w-[calc(100%+2rem)] h-0.5 bg-orange-500 z-0"
                  style={{ right: '-50%', left: '50%', transform: 'translateY(-50%)', width: 'calc(100% + 2rem)' }}
                ></div>
              )}
              <div className="relative mb-8 z-10">
                <div className="w-20 h-20 mx-auto bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">{step.step}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
