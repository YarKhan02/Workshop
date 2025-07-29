# workshop/serializers/dashboard_serializer.py

from rest_framework import serializers
from datetime import datetime, timedelta
from django.db.models import Sum, Count, Q
from django.utils import timezone

from workshop.models import Booking, Customer, Invoice


class RecentBookingSerializer(serializers.ModelSerializer):
    """Serializer for recent bookings in dashboard"""
    customer_name = serializers.SerializerMethodField()
    service_type = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'id',
            'customer_name', 
            'service_type',
            'status',
            'amount',
            'created_at'
        ]
    
    def get_customer_name(self, obj):
        """Get full customer name"""
        return f"{obj.customer.first_name} {obj.customer.last_name}"
    
    def get_service_type(self, obj):
        """Get service name"""
        return obj.service.name
    
    def get_amount(self, obj):
        """Get booking amount (final price if available, otherwise quoted price)"""
        if obj.final_price:
            return float(obj.final_price - obj.discount_amount)
        return float(obj.quoted_price - obj.discount_amount)


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    today_bookings = serializers.IntegerField()
    today_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_customers = serializers.IntegerField()
    total_jobs = serializers.IntegerField()
    revenue_growth = serializers.DecimalField(max_digits=5, decimal_places=2)
    bookings_growth = serializers.DecimalField(max_digits=5, decimal_places=2)
    recent_jobs = RecentBookingSerializer(many=True)
    
    def to_representation(self, instance):
        """Convert data to proper format"""
        data = super().to_representation(instance)
        
        # Convert Decimal to float for JSON serialization
        if 'today_revenue' in data:
            data['today_revenue'] = float(data['today_revenue'])
        if 'revenue_growth' in data:
            data['revenue_growth'] = float(data['revenue_growth'])
        if 'bookings_growth' in data:
            data['bookings_growth'] = float(data['bookings_growth'])
            
        return data
