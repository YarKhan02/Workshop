import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Car,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface BookingDetails {
  service: string;
  price: number;
  originalPrice: number;
  car: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    color: string;
  };
  timeSlot: {
    date: string;
    time: string;
  };
  customerNotes?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData as BookingDetails;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  useEffect(() => {
    if (!bookingData) {
      toast.error('No booking data found');
      navigate('/book');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-400">Redirecting...</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'billingAddress') {
        setFormData(prev => ({
          ...prev,
          billingAddress: {
            ...prev.billingAddress,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create booking in backend
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...bookingData,
          paymentMethod,
          amount: bookingData.price
        })
      });

      if (bookingResponse.ok) {
        const booking = await bookingResponse.json();
        toast.success('Payment successful! Booking confirmed.');
        navigate('/booking-confirmation', { 
          state: { 
            bookingId: booking.id,
            bookingData 
          } 
        });
      } else {
        throw new Error('Booking creation failed');
      }

    } catch (error: any) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Shield },
    { id: 'wallet', name: 'Digital Wallet', icon: CheckCircle }
  ];

  const taxes = Math.round(bookingData.price * 0.18);
  const total = bookingData.price + taxes;
  const savings = bookingData.originalPrice - bookingData.price;

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Booking</h1>
            <p className="text-white/70">Secure payment powered by industry-leading encryption</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-black/90 to-black/70 border border-orange-900/30 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Choose Payment Method</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            paymentMethod === method.id
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-orange-900/30 hover:border-orange-500/50'
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                            paymentMethod === method.id ? 'text-orange-400' : 'text-white/70'
                          }`} />
                          <div className={`text-sm font-medium ${
                            paymentMethod === method.id ? 'text-white' : 'text-white/70'
                          }`}>
                            {method.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-6">
                  {paymentMethod === 'card' && (
                    <>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formatCardNumber(formData.cardNumber)}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                            placeholder="1234 5678 9012 3456"
                            required
                            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white font-medium mb-2">Expiry Date</label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formatExpiryDate(formData.expiryDate)}
                              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                              placeholder="MM/YY"
                              required
                              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-white font-medium mb-2">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength={3}
                              required
                              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-white font-medium mb-2">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 rounded-xl text-white placeholder-white/50 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="text-center py-8">
                      <div className="text-orange-400 mb-4">You'll be redirected to your wallet app</div>
                      <div className="text-white/70">Select your preferred wallet provider to continue</div>
                    </div>
                  )}

                  {/* Security Note */}
                  <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800/30 rounded-xl">
                    <Shield className="w-5 h-5 text-green-400" />
                    <div className="text-green-400 text-sm">
                      Your payment information is encrypted and secure
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black py-4 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay ₹${total.toLocaleString()}`
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-black/90 to-black/70 border border-orange-900/30 rounded-3xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>

                {/* Service Details */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <div className="font-semibold text-white mb-1">{bookingData.service}</div>
                    <div className="text-white/70 text-sm">Professional car detailing service</div>
                  </div>

                  <div className="flex items-center gap-3 text-white/70">
                    <Car className="w-4 h-4" />
                    <span className="text-sm">
                      {bookingData.car.year} {bookingData.car.make} {bookingData.car.model}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{bookingData.timeSlot.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-white/70">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{bookingData.timeSlot.time}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-orange-900/30 pt-6 space-y-3">
                  <div className="flex justify-between text-white/70">
                    <span>Service Price</span>
                    <span>₹{bookingData.originalPrice.toLocaleString()}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-₹{savings.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Service Charge</span>
                    <span>₹{bookingData.price.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-white/70">
                    <span>Taxes (18% GST)</span>
                    <span>₹{taxes.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-orange-900/30 pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Savings Badge */}
                {savings > 0 && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-800/30 rounded-xl text-center">
                    <div className="text-green-400 font-semibold">
                      You're saving ₹{savings.toLocaleString()}!
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="mt-6 text-xs text-white/50">
                  By proceeding with payment, you agree to our{' '}
                  <a href="#" className="text-orange-400 hover:text-orange-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-orange-400 hover:text-orange-300">
                    Cancellation Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
