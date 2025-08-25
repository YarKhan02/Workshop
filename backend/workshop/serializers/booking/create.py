# workshop/serializers/booking/create.py

from rest_framework import serializers
from decimal import Decimal
from workshop.models import Booking, BookingService, Invoice, User
from .base import BaseBookingSerializer
from .validators import BookingValidationMixin


class BookingCreateSerializer(BaseBookingSerializer, BookingValidationMixin):
    customer = serializers.CharField(write_only=True)
    car = serializers.CharField(write_only=True)
    service = serializers.CharField(write_only=True)
    booking_date = serializers.DateField(write_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    
    class Meta:
        model = BaseBookingSerializer.Meta.model
        fields = [
            'customer', 'car', 'service', 'booking_date', 'price',
            'special_instructions'
        ]

    def validate(self, data):
        
        # Resolve customer (which is actually a User)
        customer_id = data.pop('customer')
        customer = self.resolve_customer(customer_id)

        # Resolve car and verify it belongs to customer (User)
        car_id = data.pop('car')
        car = self.resolve_car(car_id, customer)
        data['car'] = car

        # Resolve service
        service_id = data.pop('service')
        service = self.resolve_service(service_id)
        data['resolved_service'] = service  # Store for use in create()
            
        # Get or create daily availability
        booking_date = data.pop('booking_date')
        daily_availability = self.get_or_create_availability(booking_date)

        # Check availability
        self.validate_availability(daily_availability)
        
        data['daily_availability'] = daily_availability
        
        # Set service price (from input or service default)
        service_price = data.pop('price', None) or service.price
        data['service_price'] = service_price

        return data

    def create(self, validated_data):
        
        # Extract service-related data
        service = validated_data.pop('resolved_service')
        service_price = validated_data.pop('service_price')
        daily_availability = validated_data['daily_availability']
        
        # Set created_by from request context
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        else:
            # Fallback to first admin user
            validated_data['created_by'] = User.objects.filter(is_staff=True).first()
        
        # Get the customer (user) for invoice creation
        customer = validated_data['car'].customer

        # Calculate invoice amounts
        subtotal = Decimal(str(service_price))
        tax_percentage = Decimal('0.00')  # No tax for now, can be configured later
        tax_amount = (subtotal * tax_percentage) / Decimal('100')
        discount_amount = Decimal('0.00')  # Can be added later if needed
        total_amount = subtotal + tax_amount - discount_amount
        
        # Create invoice first
        invoice = Invoice.objects.create(
            user=customer,
            subtotal=subtotal,
            tax_percentage=tax_percentage,
            discount_amount=discount_amount,
            total_amount=total_amount,
            status=Invoice.Status.PENDING
        )

        # Link invoice to booking
        validated_data['invoice'] = invoice
        
        # Create booking
        booking = Booking.objects.create(**validated_data)

        # Create BookingService relationship
        BookingService.objects.create(
            booking=booking,
            service=service,
            price=service_price,
            status='pending'
        )
        
        # Book the slot in daily availability
        daily_availability.book_slot()
        
        return booking
