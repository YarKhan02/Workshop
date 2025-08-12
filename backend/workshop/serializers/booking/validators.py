# workshop/serializers/booking/validators.py

from rest_framework import serializers
from workshop.models import Service, DailyAvailability, User, Car


class BookingValidationMixin:
    """
    Mixin for common booking validation logic
    """
    
    def resolve_service(self, service_id):
        """Resolve and validate service"""
        try:
            return Service.objects.get(id=service_id, is_active=True)
        except Service.DoesNotExist:
            raise serializers.ValidationError({'service': 'Service not found or inactive'})
    
    def resolve_customer(self, customer_id):
        """Resolve and validate customer (User)"""
        try:
            return User.objects.get(id=customer_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({'customer': 'User not found'})
    
    def resolve_car(self, car_id, customer):
        """Resolve and validate car belongs to customer"""
        try:
            return Car.objects.get(id=car_id, customer=customer)
        except Car.DoesNotExist:
            raise serializers.ValidationError({'car': 'Car not found or does not belong to user'})
    
    def get_or_create_availability(self, booking_date):
        """Get or create daily availability for date"""
        daily_availability, created = DailyAvailability.objects.get_or_create(
            date=booking_date,
            defaults={
                'total_slots': 7,
                'available_slots': 7,
                'is_available': True
            }
        )
        return daily_availability
    
    def validate_availability(self, daily_availability, current_date=None):
        """Check if date has availability"""
        # Only check availability if it's a different date
        if current_date and daily_availability.date == current_date:
            return True
            
        if not daily_availability.has_availability():
            raise serializers.ValidationError({'booking_date': 'No slots available for this date'})
        
        return True
