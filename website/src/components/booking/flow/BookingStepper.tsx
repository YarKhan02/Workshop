import React from 'react';
import { Check } from 'lucide-react';
// import { themeClasses } from '../../config/theme';
import type { StepConfig } from '../../../services/interfaces/booking';

interface BookingStepperProps {
  steps: StepConfig[];
  currentStep: number;
}

const BookingStepper: React.FC<BookingStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <StepItem
              step={step}
              isActive={currentStep === step.number}
              isCompleted={currentStep > step.number}
              isLast={index === steps.length - 1}
            />
            {index < steps.length - 1 && (
              <StepConnector isCompleted={currentStep > step.number} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface StepItemProps {
  step: StepConfig;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ step, isActive, isCompleted }) => {
  const Icon = step.icon;
  
  const getStepClasses = () => {
    if (isCompleted) {
      return 'bg-orange-500 text-black border-orange-500';
    } else if (isActive) {
      return 'bg-orange-500/20 text-orange-400 border-orange-400';
    } else {
      return 'bg-gray-800 text-gray-400 border-gray-600';
    }
  };

  const getTitleClasses = () => {
    if (isCompleted || isActive) {
      return 'text-white';
    } else {
      return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-12 h-12 rounded-full border-2 flex items-center justify-center
          transition-all duration-300 ${getStepClasses()}
        `}
      >
        {isCompleted ? (
          <Check className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>
      <div className="mt-2 text-center">
        <div className={`text-sm font-medium ${getTitleClasses()}`}>
          {step.title}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Step {step.number}
        </div>
      </div>
    </div>
  );
};

interface StepConnectorProps {
  isCompleted: boolean;
}

const StepConnector: React.FC<StepConnectorProps> = ({ isCompleted }) => {
  return (
    <div className="flex-1 mx-4">
      <div
        className={`
          h-0.5 transition-all duration-300
          ${isCompleted ? 'bg-orange-500' : 'bg-gray-600'}
        `}
      />
    </div>
  );
};

export default BookingStepper;
