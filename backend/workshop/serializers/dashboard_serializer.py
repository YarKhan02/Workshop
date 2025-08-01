# workshop/serializers/dashboard_serializer.py

from rest_framework import serializers
from datetime import datetime, timedelta
from django.db.models import Sum, Count, Q
from django.utils import timezone

from workshop.models import Booking, Customer, Invoice

class RecentBookingSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    customer_name = serializers.SerializerMethodField()
    service_type = serializers.CharField(source='service__name')
    amount = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField()

    def get_customer_name(self, obj):
        return f"{obj['customer__first_name']} {obj['customer__last_name']}"

    def get_amount(self, obj):
        price = obj.get('final_price') or obj.get('quoted_price')
        return float(price) - float(obj.get('discount_amount', 0))
    
class DashboardStatsSerializer(serializers.Serializer):
    
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
