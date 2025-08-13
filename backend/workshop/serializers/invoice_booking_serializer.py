# workshop/serializers/invoice_booking_serializer.py

from rest_framework import serializers
from workshop.models.booking import Booking
from workshop.models.booking_service import BookingService
from workshop.models.service import Service
from workshop.models.car import Car
from workshop.models.daily_availability import DailyAvailability


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Serializer for service details in booking"""
    
    class Meta:
        model = Service
        fields = [
            'id',
            'name', 
            'description',
            'category',
            'price',
        ]


class BookingServiceDetailSerializer(serializers.ModelSerializer):
    """Serializer for booking service with service details"""
    service = ServiceDetailSerializer(read_only=True)
    
    class Meta:
        model = BookingService
        fields = [
            'id',
            'service',
            'price',
            'status',
        ]


class CarDetailSerializer(serializers.ModelSerializer):
    """Serializer for car details in booking"""
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = Car
        fields = [
            'id',
            'license_plate',
            'make',      # Changed from brand_name to make
            'model',
            'year',
            'color',
            'customer_name',
        ]


class DailyAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for daily availability details"""
    
    class Meta:
        model = DailyAvailability
        fields = [
            'id',
            'date',
            'total_slots',
            'available_slots',
        ]


class InvoiceBookingSerializer(serializers.ModelSerializer):
    """Comprehensive serializer for booking data in invoice context"""
    car = CarDetailSerializer(read_only=True)
    daily_availability = DailyAvailabilitySerializer(read_only=True)
    service = BookingServiceDetailSerializer(read_only=True)
    scheduled_date = serializers.ReadOnlyField()
    
    # Include invoice financial details
    invoice_subtotal = serializers.DecimalField(source='invoice.subtotal', max_digits=10, decimal_places=2, read_only=True)
    invoice_tax_percentage = serializers.DecimalField(source='invoice.tax_percentage', max_digits=10, decimal_places=2, read_only=True)
    invoice_discount_amount = serializers.DecimalField(source='invoice.discount_amount', max_digits=10, decimal_places=2, read_only=True)
    invoice_total_amount = serializers.DecimalField(source='invoice.total_amount', max_digits=10, decimal_places=2, read_only=True)
    invoice_status = serializers.CharField(source='invoice.status', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    invoice_created_at = serializers.DateTimeField(source='invoice.created_at', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id',
            'car',
            'daily_availability', 
            'service',
            'scheduled_date',
            'special_instructions',
            'customer_rating',
            'customer_feedback',
            'created_at',
            # Invoice fields
            'invoice_subtotal',
            'invoice_tax_percentage', 
            'invoice_discount_amount',
            'invoice_total_amount',
            'invoice_status',
            'invoice_number',
            'invoice_created_at',
        ]
