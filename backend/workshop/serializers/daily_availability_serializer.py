# workshop/serializers/daily_availability_serializer.py

from rest_framework import serializers
from workshop.models.daily_availability import DailyAvailability


class DailyAvailabilitySerializer(serializers.ModelSerializer):
    """
    Serializer for DailyAvailability model
    """
    day_name = serializers.SerializerMethodField()
    display_date = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()
    utilization_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = DailyAvailability
        fields = [
            'id', 'date', 'day_name', 'display_date', 'total_slots', 
            'available_slots', 'is_available', 'utilization_percentage',
            'created_at', 'updated_at'
        ]
    
    def get_day_name(self, obj):
        return obj.date.strftime('%A')
    
    def get_display_date(self, obj):
        return obj.date.strftime('%B %d, %Y')
    
    def get_is_available(self, obj):
        return obj.has_availability()
    
    def get_utilization_percentage(self, obj):
        if obj.total_slots > 0:
            return ((obj.total_slots - obj.available_slots) / obj.total_slots) * 100
        return 0


class DailyAvailabilityListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for availability lists/dropdowns
    """
    display_date = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()
    
    class Meta:
        model = DailyAvailability
        fields = [
            'date', 'display_date', 'available_slots', 'is_available'
        ]
    
    def get_display_date(self, obj):
        return obj.date.strftime('%B %d, %Y')
    
    def get_is_available(self, obj):
        return obj.has_availability()
