import React, { useState } from 'react';
import { Wallet, Smartphone, AlertCircle } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface WalletPaymentFormProps {
  onWalletSubmit: (walletType: string, phone?: string) => void;
  isProcessing: boolean;
}

const WalletPaymentForm: React.FC<WalletPaymentFormProps> = ({
  onWalletSubmit,
  isProcessing
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const walletOptions = [
    { 
      id: 'paytm', 
      name: 'Paytm', 
      logo: '🛒',
      requiresPhone: true 
    },
    { 
      id: 'phonepe', 
      name: 'PhonePe', 
      logo: '📱',
      requiresPhone: true 
    },
    { 
      id: 'googlepay', 
      name: 'Google Pay', 
      logo: '🎯',
      requiresPhone: true 
    },
    { 
      id: 'amazonpay', 
      name: 'Amazon Pay', 
      logo: '📦',
      requiresPhone: false 
    }
  ];

  const validatePhone = (value: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) {
      setError('Please select a wallet');
      return;
    }

    const wallet = walletOptions.find(w => w.id === selectedWallet);
    if (wallet?.requiresPhone && !validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    onWalletSubmit(selectedWallet, phone || undefined);
  };

  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <div className="flex items-center mb-6">
        <Wallet className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        <h3 className="text-xl font-semibold text-white">Digital Wallet</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wallet Selection */}
        <div>
          <label className="block text-white font-medium mb-3">
            Choose your wallet
          </label>
          <div className="grid grid-cols-2 gap-3">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                onClick={() => {
                  setSelectedWallet(wallet.id);
                  if (error) setError('');
                }}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2
                  ${selectedWallet === wallet.id
                    ? `${themeClasses.card.featured} border-orange-400`
                    : `${themeClasses.card.secondary} border-gray-700 hover:border-orange-400/50`
                  }
                `}
                disabled={isProcessing}
              >
                <div className="text-2xl">{wallet.logo}</div>
                <span className={`
                  text-sm font-medium 
                  ${selectedWallet === wallet.id 
                    ? 'text-white' 
                    : 'text-white/70'
                  }
                `}>
                  {wallet.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number Input */}
        {selectedWallet && walletOptions.find(w => w.id === selectedWallet)?.requiresPhone && (
          <div>
            <label className="block text-white font-medium mb-2">
              <Smartphone className="w-4 h-4 inline mr-1" />
              Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  setPhone(value);
                  if (error) setError('');
                }
              }}
              placeholder="Enter 10-digit mobile number"
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
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}

        {/* Wallet Info */}
        {selectedWallet && (
          <div className={`${themeClasses.card.secondary} p-4 rounded-lg`}>
            <div className="text-white/80 text-sm">
              <div className="font-medium mb-1">How it works:</div>
              <div className="text-white/60">
                You'll be redirected to {walletOptions.find(w => w.id === selectedWallet)?.name} 
                to complete the payment securely.
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedWallet || isProcessing}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
            ${selectedWallet && !isProcessing
              ? `${themeClasses.button.primary}`
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isProcessing 
            ? 'Processing...' 
            : selectedWallet 
              ? `Pay with ${walletOptions.find(w => w.id === selectedWallet)?.name}`
              : 'Select a wallet'
          }
        </button>
      </form>
    </div>
  );
};

export default WalletPaymentForm;
