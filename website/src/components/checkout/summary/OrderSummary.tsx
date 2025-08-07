import React from 'react';
import { Car, Calendar, Clock } from 'lucide-react';
import { themeClasses } from '../../../config/theme';
import { formatCurrency, formatDate } from '../../../utils/bookingUtils';
import type { CheckoutBookingDetails } from '../../../services/interfaces/payment';

interface OrderSummaryProps {
  bookingDetails: CheckoutBookingDetails;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ bookingDetails }) => {
  const discount = bookingDetails.originalPrice - bookingDetails.price;
  const discountPercentage = Math.round((discount / bookingDetails.originalPrice) * 100);

  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <h2 className={`text-2xl font-bold text-white mb-6`}>Order Summary</h2>
      
      {/* Service Details */}
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{bookingDetails.service}</h3>
          <div className="flex items-center space-x-4 text-sm text-white/70">
            <div className="flex items-center">
              <Calendar className={`w-4 h-4 mr-1 ${themeClasses.iconColors.orange}`} />
              {formatDate(bookingDetails.timeSlot.date)}
            </div>
            <div className="flex items-center">
              <Clock className={`w-4 h-4 mr-1 ${themeClasses.iconColors.orange}`} />
              {bookingDetails.timeSlot.time}
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className={`${themeClasses.card.secondary} p-4 rounded-lg`}>
          <div className="flex items-center mb-2">
            <Car className={`w-4 h-4 mr-2 ${themeClasses.iconColors.orange}`} />
            <span className="text-white font-medium">Vehicle Details</span>
          </div>
          <div className="text-sm text-white/80">
            <p>{bookingDetails.car.year} {bookingDetails.car.make} {bookingDetails.car.model}</p>
            <p>License: {bookingDetails.car.licensePlate}</p>
            {bookingDetails.car.color && <p>Color: {bookingDetails.car.color}</p>}
          </div>
        </div>

        {/* Special Instructions */}
        {bookingDetails.customerNotes && (
          <div className="text-sm text-white/70">
            <span className="font-medium">Notes: </span>
            {bookingDetails.customerNotes}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-white/10 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-white/70">
            <span>Service Amount</span>
            <span>{formatCurrency(bookingDetails.originalPrice)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Discount ({discountPercentage}%)</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-2 flex justify-between text-lg font-bold text-white">
            <span>Total Amount</span>
            <span className={themeClasses.iconColors.orange}>
              {formatCurrency(bookingDetails.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
