# workshop/serializers/booking/base.py

from rest_framework import serializers
from workshop.models import Booking, BookingService


class BaseBookingSerializer(serializers.ModelSerializer):
    """
    Base serializer with common booking functionality
    """
    
    class Meta:
        model = Booking
        abstract = True
    
    def get_service_id(self, obj):
        """Direct access to service ID for frontend convenience"""
        if hasattr(obj, 'service') and obj.service:
            return obj.service.service.id
        return None
    
    def get_service_status(self, obj):
        """Get service status from BookingService"""
        if hasattr(obj, 'service') and obj.service:
            return obj.service.status
        return None
    
    def get_service_price(self, obj):
        """Get service price from BookingService"""
        if hasattr(obj, 'service') and obj.service:
            return obj.service.price
        return None


class BaseBookingServiceMixin:
    """
    Mixin for handling BookingService operations
    """
    
    def update_booking_service(self, instance, service=None, price=None, status=None):
        """Update BookingService fields"""
        if not hasattr(instance, 'service'):
            return
            
        booking_service = instance.service
        updated = False
        
        if service:
            booking_service.service = service
            updated = True
            
        if price is not None:
            booking_service.price = price
            updated = True
            
        if status:
            booking_service.status = status
            updated = True
            
        if updated:
            booking_service.save()
            
        return booking_service


class BaseAvailabilityMixin:
    
    def handle_date_change(self, instance, new_daily_availability):
        """Handle booking date change with slot management"""
        old_daily_availability = instance.daily_availability
        
        if new_daily_availability and new_daily_availability != old_daily_availability:
            # Release slot from old date
            old_daily_availability.cancel_slot()
            
            # Book slot for new date
            new_daily_availability.book_slot()
            
            # Update booking's daily availability
            instance.daily_availability = new_daily_availability
            instance.save()
            
        return instance
