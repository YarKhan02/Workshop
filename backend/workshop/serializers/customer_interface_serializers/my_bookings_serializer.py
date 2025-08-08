from rest_framework import serializers

from workshop.models import Booking


class MyBookingsSerializer(serializers.ModelSerializer):
    # Car fields
    car_make = serializers.CharField(source='car.make', read_only=True)
    car_model = serializers.CharField(source='car.model', read_only=True)
    car_license_plate = serializers.CharField(source='car.license_plate', read_only=True)
    
    # Service fields
    service_name = serializers.CharField(source='service.name', read_only=True)
    service_base_price = serializers.DecimalField(source='service.base_price', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id',
            'booking_date',
            'status',
            'created_at',
            'quoted_price',
            'estimated_duration_minutes',
            # Car fields
            'car_make',
            'car_model', 
            'car_license_plate',
            # Service fields
            'service_name',
            'service_base_price'
        ]