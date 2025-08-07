import React from 'react';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
import { themeClasses } from '../../../config/theme';
import type { PaymentFormData } from '../../../services/interfaces/payment';

interface CardPaymentFormProps {
  formData: PaymentFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  formData,
  onInputChange,
  errors = {}
}) => {
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      onInputChange({
        ...e,
        target: { ...e.target, value: formatted }
      });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) { // MM/YY
      onInputChange({
        ...e,
        target: { ...e.target, value: formatted }
      });
    }
  };

  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <CreditCard className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
          Card Details
        </h3>
        <div className="flex items-center text-green-400">
          <Shield className="w-4 h-4 mr-1" />
          <span className="text-sm">Secure</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-white font-medium mb-2">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className={`
              w-full px-4 py-3 rounded-lg border bg-gray-800 text-white placeholder-gray-400
              ${errors.cardNumber 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-orange-400'
              }
              focus:outline-none focus:ring-2 focus:ring-orange-400/20
            `}
          />
          {errors.cardNumber && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.cardNumber}
            </div>
          )}
        </div>

        {/* Card Holder Name */}
        <div>
          <label className="block text-white font-medium mb-2">Card Holder Name</label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={onInputChange}
            placeholder="John Doe"
            className={`
              w-full px-4 py-3 rounded-lg border bg-gray-800 text-white placeholder-gray-400
              ${errors.cardHolder 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-orange-400'
              }
              focus:outline-none focus:ring-2 focus:ring-orange-400/20
            `}
          />
          {errors.cardHolder && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.cardHolder}
            </div>
          )}
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              className={`
                w-full px-4 py-3 rounded-lg border bg-gray-800 text-white placeholder-gray-400
                ${errors.expiryDate 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-600 focus:border-orange-400'
                }
                focus:outline-none focus:ring-2 focus:ring-orange-400/20
              `}
            />
            {errors.expiryDate && (
              <div className="flex items-center mt-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.expiryDate}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={onInputChange}
              placeholder="123"
              maxLength={4}
              className={`
                w-full px-4 py-3 rounded-lg border bg-gray-800 text-white placeholder-gray-400
                ${errors.cvv 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-600 focus:border-orange-400'
                }
                focus:outline-none focus:ring-2 focus:ring-orange-400/20
              `}
            />
            {errors.cvv && (
              <div className="flex items-center mt-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.cvv}
              </div>
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="border-t border-white/10 pt-4 mt-6">
          <h4 className="text-lg font-medium text-white mb-4">Billing Address</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Street Address</label>
              <input
                type="text"
                name="billingAddress.street"
                value={formData.billingAddress.street}
                onChange={onInputChange}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">City</label>
                <input
                  type="text"
                  name="billingAddress.city"
                  value={formData.billingAddress.city}
                  onChange={onInputChange}
                  placeholder="Mumbai"
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">State</label>
                <input
                  type="text"
                  name="billingAddress.state"
                  value={formData.billingAddress.state}
                  onChange={onInputChange}
                  placeholder="Maharashtra"
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Pincode</label>
              <input
                type="text"
                name="billingAddress.pincode"
                value={formData.billingAddress.pincode}
                onChange={onInputChange}
                placeholder="400001"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
