# workshop/serializers/booking/update.py

from rest_framework import serializers
from decimal import Decimal
from workshop.models import Booking
from .base import BaseBookingSerializer, BaseBookingServiceMixin, BaseAvailabilityMixin
from .validators import BookingValidationMixin


class BookingUpdateSerializer(BaseBookingSerializer, BaseBookingServiceMixin, BaseAvailabilityMixin, BookingValidationMixin):
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

            # Fetch the Booking object using pk from context and get daily_availability
            booking_pk = self.context.get('pk')
            current_date = None
            booking_obj = None
            if booking_pk:
                from workshop.models import Booking
                try:
                    booking_obj = Booking.objects.get(pk=booking_pk)
                    if getattr(booking_obj, 'daily_availability', None):
                        current_date = booking_obj.daily_availability.date
                except Booking.DoesNotExist:
                    pass
            self._booking_obj = booking_obj  # Store for use in update
            self.validate_availability(new_daily_availability, current_date)

            data['new_daily_availability'] = new_daily_availability


        return data

    def update(self, _, validated_data):
        # Use booking_obj fetched in validate for all update logic
        booking_obj = getattr(self, '_booking_obj', None)
        if not booking_obj:
            raise serializers.ValidationError("Booking object not found for update.")

        # Handle date change and slot management
        new_daily_availability = validated_data.pop('new_daily_availability', None)
        if new_daily_availability:
            self.handle_date_change(booking_obj, new_daily_availability)

        # Handle service change
        resolved_service = validated_data.pop('resolved_service', None)
        price = validated_data.pop('price', None)
        status = validated_data.pop('status', None)

        # Update BookingService if any service-related changes
        if resolved_service or price is not None or status:
            self.update_booking_service(
                booking_obj,
                service=resolved_service,
                price=price,
                status=status
            )

            # Update invoice if price changed
            if price is not None and booking_obj.invoice:
                booking_obj.invoice.subtotal = Decimal(str(price))
                booking_obj.invoice.total_amount = booking_obj.invoice.subtotal - booking_obj.invoice.discount_amount
                booking_obj.invoice.save()

        # Update remaining booking fields (special_instructions, customer_rating, customer_feedback)
        updated_booking = super().update(booking_obj, validated_data)

        return updated_booking
