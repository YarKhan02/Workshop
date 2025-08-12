# workshop/serializers/booking/list.py

from rest_framework import serializers
from .base import BaseBookingSerializer


class BookingListSerializer(BaseBookingSerializer):
    """
    Optimized serializer for booking list view
    """
    # Customer information (through car)
    customerId = serializers.SerializerMethodField()
    customerName = serializers.SerializerMethodField()
    customerPhone = serializers.SerializerMethodField()
    customerEmail = serializers.SerializerMethodField()
    
    # Car information
    carId = serializers.CharField(source='car.id', read_only=True)
    carMake = serializers.CharField(source='car.make', read_only=True)
    carModel = serializers.CharField(source='car.model', read_only=True)
    carLicensePlate = serializers.CharField(source='car.license_plate', read_only=True)
    
    # Service information (through BookingService)
    serviceType = serializers.SerializerMethodField()
    serviceName = serializers.SerializerMethodField()
    serviceStatus = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()  # For backward compatibility
    service_id = serializers.SerializerMethodField()  # Direct service ID access
    
    # Booking fields
    scheduledDate = serializers.DateField(source='daily_availability.date')
    totalAmount = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = BaseBookingSerializer.Meta.model
        fields = [
            'id', 'customerId', 'customerName', 'customerPhone', 'customerEmail',
            'carId', 'carMake', 'carModel', 'carLicensePlate',
            'serviceType', 'serviceName', 'serviceStatus', 'status', 'service_id',
            'scheduledDate', 'special_instructions', 'totalAmount', 'createdAt'
        ]

    def get_customerId(self, obj):
        return obj.car.customer.id if obj.car and obj.car.customer else None

    def get_customerName(self, obj):
        if obj.car and obj.car.customer:
            return obj.car.customer.name
        return "Unknown"

    def get_customerPhone(self, obj):
        if obj.car and obj.car.customer and obj.car.customer.phone_number:
            return str(obj.car.customer.phone_number)
        return None

    def get_customerEmail(self, obj):
        return obj.car.customer.email if obj.car and obj.car.customer else None
    
    def get_serviceType(self, obj):
        if hasattr(obj, 'service') and obj.service:
            return obj.service.service.category
        return None
    
    def get_serviceName(self, obj):
        if hasattr(obj, 'service') and obj.service:
            return obj.service.service.name
        return None

    def get_serviceStatus(self, obj):
        if hasattr(obj, 'service') and obj.service:
            return obj.service.status
        return None

    def get_status(self, obj):
        # For backward compatibility - same as serviceStatus
        return self.get_serviceStatus(obj) or 'pending'
    
    def get_service_id(self, obj):
        """Direct access to service ID for frontend convenience"""
        if hasattr(obj, 'service') and obj.service:
            return obj.service.service.id
        return None
    
    def get_totalAmount(self, obj):
        if obj.invoice:
            return obj.invoice.total_amount
        return self.get_service_price(obj)
