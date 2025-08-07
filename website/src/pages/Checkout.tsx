import React from 'react';
import { useLocation } from 'react-router-dom';
import { themeClasses } from '../config/theme';
import Layout from '../components/layout/Layout';
import { LoadingSpinner } from '../components/common';
import {
  OrderSummary,
  PaymentMethodSelector,
  CardPaymentForm,
  UPIPaymentForm,
  WalletPaymentForm,
  PaymentProcessing
} from '../components/checkout';
import { useCheckout } from '../hooks/useCheckout';
import type { CheckoutBookingDetails } from '../services/interfaces/payment';

const Checkout: React.FC = () => {
  const location = useLocation();
  const bookingData = location.state?.bookingData as CheckoutBookingDetails;

  const {
    paymentMethod,
    setPaymentMethod,
    formData,
    handleInputChange,
    errors,
    processingState,
    processPayment,
    processUPIPayment,
    processWalletPayment,
    resetProcessingState
  } = useCheckout(bookingData);

  if (!bookingData) {
    return (
      <Layout>
        <LoadingSpinner message="Redirecting..." />
      </Layout>
    );
  }

  // Show processing states
  if (processingState.step === 'processing' || 
      processingState.step === 'success' || 
      processingState.step === 'error') {
    return (
      <Layout>
        <div className={themeClasses.section.primary}>
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <PaymentProcessing
                isProcessing={processingState.step === 'processing'}
                isSuccess={processingState.step === 'success'}
                isError={processingState.step === 'error'}
                error={processingState.error}
                paymentMethod={processingState.method}
              />
              {processingState.step === 'error' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={resetProcessingState}
                    className={`${themeClasses.button.secondary} px-6 py-3 rounded-lg`}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={themeClasses.section.primary}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className={`${themeClasses.heading.section} text-white mb-2`}>
                Checkout
              </h1>
              <p className="text-white/70">
                Complete your payment to confirm your booking
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Form Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Method Selector */}
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />

                {/* Payment Forms */}
                {paymentMethod === 'card' && (
                  <>
                    <CardPaymentForm
                      formData={formData}
                      onInputChange={handleInputChange}
                      errors={errors}
                    />
                    <div className="text-center">
                      <button
                        onClick={() => processPayment()}
                        disabled={processingState.isProcessing}
                        className={`
                          w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-lg
                          ${themeClasses.button.primary}
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {processingState.isProcessing ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <UPIPaymentForm
                    onUPISubmit={(vpa) => processUPIPayment(vpa)}
                    isProcessing={processingState.isProcessing}
                  />
                )}

                {paymentMethod === 'wallet' && (
                  <WalletPaymentForm
                    onWalletSubmit={(walletType, phone) => processWalletPayment(walletType, phone)}
                    isProcessing={processingState.isProcessing}
                  />
                )}
              </div>

              {/* Order Summary Section */}
              <div className="lg:col-span-1">
                <OrderSummary bookingDetails={bookingData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;