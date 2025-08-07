import React, { useState } from 'react';
import { Smartphone, QrCode, AlertCircle } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface UPIPaymentFormProps {
  onUPISubmit: (vpa: string) => void;
  isProcessing: boolean;
}

const UPIPaymentForm: React.FC<UPIPaymentFormProps> = ({
  onUPISubmit,
  isProcessing
}) => {
  const [vpa, setVpa] = useState('');
  const [error, setError] = useState('');

  const validateVPA = (value: string) => {
    const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return vpaRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVPA(vpa)) {
      setError('Please enter a valid UPI ID');
      return;
    }
    setError('');
    onUPISubmit(vpa);
  };

  const popularUPIApps = [
    { name: 'Google Pay', suffix: '@oksbi' },
    { name: 'PhonePe', suffix: '@ybl' },
    { name: 'Paytm', suffix: '@paytm' },
    { name: 'BHIM', suffix: '@upi' }
  ];

  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <div className="flex items-center mb-6">
        <Smartphone className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        <h3 className="text-xl font-semibold text-white">UPI Payment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">
            Enter your UPI ID
          </label>
          <input
            type="text"
            value={vpa}
            onChange={(e) => {
              setVpa(e.target.value);
              if (error) setError('');
            }}
            placeholder="yourname@upi"
            className={`
              w-full px-4 py-3 rounded-lg border bg-gray-800 text-white placeholder-gray-400
              ${error 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-orange-400'
              }
              focus:outline-none focus:ring-2 focus:ring-orange-400/20
            `}
            disabled={isProcessing}
          />
          {error && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
        </div>

        {/* Popular UPI Apps */}
        <div>
          <h4 className="text-white font-medium mb-3">Popular UPI Apps</h4>
          <div className="grid grid-cols-2 gap-2">
            {popularUPIApps.map((app) => (
              <button
                key={app.name}
                type="button"
                onClick={() => setVpa(prev => {
                  const username = prev.split('@')[0];
                  return username ? `${username}${app.suffix}` : app.suffix;
                })}
                className={`
                  ${themeClasses.card.secondary} p-3 rounded-lg text-sm text-white/80 
                  hover:text-white hover:border-orange-400/50 transition-all duration-200
                  border border-gray-700
                `}
                disabled={isProcessing}
              >
                <div className="font-medium">{app.name}</div>
                <div className="text-xs text-white/60">{app.suffix}</div>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Option */}
        <div className={`${themeClasses.card.secondary} p-4 rounded-lg`}>
          <div className="flex items-center text-white/80">
            <QrCode className={`w-5 h-5 mr-2 ${themeClasses.iconColors.orange}`} />
            <div>
              <div className="font-medium">Scan QR Code</div>
              <div className="text-sm text-white/60">
                Open your UPI app and scan the QR code to pay
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!vpa || isProcessing}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
            ${vpa && !isProcessing
              ? `${themeClasses.button.primary}`
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isProcessing ? 'Processing...' : 'Pay with UPI'}
        </button>
      </form>
    </div>
  );
};

export default UPIPaymentForm;
