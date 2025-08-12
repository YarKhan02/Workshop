# workshop/serializers/booking/update.py

from rest_framework import serializers
from decimal import Decimal
from workshop.models import Booking
from .base import BaseBookingSerializer, BaseBookingServiceMixin, BaseAvailabilityMixin
from .validators import BookingValidationMixin


class BookingUpdateSerializer(BaseBookingSerializer, BaseBookingServiceMixin, 
                            BaseAvailabilityMixin, BookingValidationMixin):
    """
    Serializer for updating existing bookings with proper slot management
    """
    service = serializers.CharField(write_only=True, required=False)
    booking_date = serializers.DateField(write_only=True, required=False)
    status = serializers.CharField(write_only=True, required=False)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    
    class Meta:
        model = BaseBookingSerializer.Meta.model
        fields = [
            'service', 'booking_date', 'status', 'price',
            'special_instructions', 'customer_rating', 'customer_feedback'
        ]

    def validate(self, data):
        """Validate update data and resolve relationships"""
        
        # Resolve service if provided
        service_id = data.pop('service', None)
        if service_id:
            service = self.resolve_service(service_id)
            data['resolved_service'] = service
        
        # Handle booking date change and slot management
        booking_date = data.pop('booking_date', None)
        if booking_date:
            # Get or create new daily availability
            new_daily_availability = self.get_or_create_availability(booking_date)
            
            # Check if new date has availability (only if it's different from current date)
            current_date = self.instance.daily_availability.date if self.instance.daily_availability else None
            self.validate_availability(new_daily_availability, current_date)
            
            data['new_daily_availability'] = new_daily_availability
        
        return data

    def update(self, instance, validated_data):
        """Update booking with proper slot management"""
        
        # Handle date change and slot management
        new_daily_availability = validated_data.pop('new_daily_availability', None)
        if new_daily_availability:
            self.handle_date_change(instance, new_daily_availability)
        
        # Handle service change
        resolved_service = validated_data.pop('resolved_service', None)
        price = validated_data.pop('price', None)
        status = validated_data.pop('status', None)
        
        # Update BookingService if any service-related changes
        if resolved_service or price is not None or status:
            self.update_booking_service(
                instance, 
                service=resolved_service, 
                price=price, 
                status=status
            )
            
            # Update invoice if price changed
            if price is not None and instance.invoice:
                instance.invoice.subtotal = Decimal(str(price))
                instance.invoice.total_amount = instance.invoice.subtotal - instance.invoice.discount_amount
                instance.invoice.save()
        
        # Update remaining booking fields (special_instructions, customer_rating, customer_feedback)
        updated_booking = super().update(instance, validated_data)
        
        return updated_booking
