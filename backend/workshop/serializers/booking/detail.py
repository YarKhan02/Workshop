# workshop/serializers/booking/detail.py

from rest_framework import serializers
from .base import BaseBookingSerializer


class BookingDetailSerializer(BaseBookingSerializer):
    """
    Detailed serializer for single booking view
    """
    # Customer information (through car)
    customer_details = serializers.SerializerMethodField()
    
    # Car information
    car_details = serializers.SerializerMethodField()
    
    # Service information (through BookingService)
    service_details = serializers.SerializerMethodField()
    service_id = serializers.SerializerMethodField()  # Direct access to service ID
    
    # Availability information
    availability_details = serializers.SerializerMethodField()
    
    # Payment and invoice information
    payment_status = serializers.ReadOnlyField()
    invoice_details = serializers.SerializerMethodField()
    
    # For backward compatibility
    scheduled_date = serializers.ReadOnlyField()

    class Meta:
        model = BaseBookingSerializer.Meta.model
        fields = [
            'id', 'customer_details', 'car', 'car_details',
            'service_details', 'service_id', 'availability_details',
            'scheduled_date', 'special_instructions',
            'created_at', 'payment_status', 'invoice_details',
            'customer_rating', 'customer_feedback'
        ]

    def get_customer_details(self, obj):
        if obj.car and obj.car.customer:
            customer = obj.car.customer
            return {
                'id': customer.id,
                'name': customer.name,
                'email': customer.email,
                'phone_number': str(customer.phone_number) if customer.phone_number else None,
                'username': customer.username
            }
        return None

    def get_car_details(self, obj):
        return {
            'id': obj.car.id,
            'make': obj.car.make,
            'model': obj.car.model,
            'year': obj.car.year,
            'license_plate': obj.car.license_plate,
            'color': getattr(obj.car, 'color', '')
        }
    
    def get_service_details(self, obj):
        if hasattr(obj, 'service') and obj.service:
            booking_service = obj.service
            return {
                'booking_service_id': booking_service.id,
                'service_id': booking_service.service.id,
                'service_name': booking_service.service.name,
                'service_category': booking_service.service.category,
                'price': booking_service.price,
                'status': booking_service.status,
                'description': booking_service.service.description
            }
        return None
    
    def get_availability_details(self, obj):
        return {
            'date': obj.daily_availability.date,
            'total_slots': obj.daily_availability.total_slots,
            'available_slots': obj.daily_availability.available_slots,
            'is_available': obj.daily_availability.is_available
        }
    
    def get_invoice_details(self, obj):
        if obj.invoice:
            return {
                'id': obj.invoice.id,
                'total_amount': obj.invoice.total_amount,
                'status': obj.invoice.status,
                'created_at': obj.invoice.created_at
            }
        return None
