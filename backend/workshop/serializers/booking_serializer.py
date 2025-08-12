# workshop/serializers/booking_serializer.py

from rest_framework import serializers
from workshop.models import Service, DailyAvailability

# Import the modular booking serializers
from .booking import (
    BookingListSerializer,
    BookingDetailSerializer, 
    BookingCreateSerializer,
    BookingUpdateSerializer
)


class ServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for Service model
    """
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'description', 'category',
            'price', 'is_active', 'created_at'
        ]


class ServiceListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for service list views
    """
    class Meta:
        model = Service
        fields = ['id', 'name', 'category', 'price', 'is_active']


class AvailabilitySerializer(serializers.ModelSerializer):
    """
    Serializer for checking daily availability
    """
    has_availability = serializers.ReadOnlyField()
    
    class Meta:
        model = DailyAvailability
        fields = [
            'id', 'date', 'total_slots', 'available_slots', 
            'is_available', 'has_availability'
        ]


class BookingStatsSerializer(serializers.Serializer):
    """
    Serializer for booking statistics
    """
    totalBookings = serializers.IntegerField()
    pendingBookings = serializers.IntegerField()
    confirmedBookings = serializers.IntegerField()
    completedBookings = serializers.IntegerField()
    cancelledBookings = serializers.IntegerField()
    todayBookings = serializers.IntegerField()
    thisWeekBookings = serializers.IntegerField()
    thisMonthBookings = serializers.IntegerField()
    revenueToday = serializers.DecimalField(max_digits=10, decimal_places=2)
    revenueThisWeek = serializers.DecimalField(max_digits=10, decimal_places=2)
    revenueThisMonth = serializers.DecimalField(max_digits=10, decimal_places=2)
