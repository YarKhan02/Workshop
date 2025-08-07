import React from 'react';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { themeClasses } from '../../../config/theme';
import type { PaymentMethod } from '../../../services/interfaces/payment';

interface PaymentMethodSelectorProps {
  selectedMethod: 'card' | 'upi' | 'wallet';
  onMethodChange: (method: 'card' | 'upi' | 'wallet') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet }
  ];

  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <h3 className="text-xl font-semibold text-white mb-4">Select Payment Method</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3
                ${selectedMethod === method.id
                  ? `${themeClasses.card.featured} border-orange-400`
                  : `${themeClasses.card.secondary} border-gray-700 hover:border-orange-400/50`
                }
              `}
            >
              <IconComponent className={`
                w-6 h-6 
                ${selectedMethod === method.id 
                  ? themeClasses.iconColors.orange 
                  : themeClasses.iconColors.gray
                }
              `} />
              <span className={`
                font-medium 
                ${selectedMethod === method.id 
                  ? 'text-white' 
                  : 'text-white/70'
                }
              `}>
                {method.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
