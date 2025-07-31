# workshop/views/dashboard_view.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from workshop.models import Booking, Customer, Invoice
from workshop.serializers import DashboardStatsSerializer, RecentBookingSerializer


class DashboardView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        try:
            # Get current date and time
            today = timezone.now().date()
            yesterday = today - timedelta(days=1)
            
            # Calculate today's statistics
            today_bookings = Booking.objects.filter(
                time_slot__date=today
            ).count()
            
            # Today's revenue (from completed bookings)
            today_revenue = Booking.objects.filter(
                time_slot__date=today,
                status='completed'
            ).aggregate(
                total=Sum('final_price')
            )['total'] or Decimal('0.00')
            
            # If no final_price, use quoted_price
            if today_revenue == 0:
                today_revenue = Booking.objects.filter(
                    time_slot__date=today,
                    status='completed'
                ).aggregate(
                    total=Sum('quoted_price')
                )['total'] or Decimal('0.00')
            
            # Total customers
            total_customers = Customer.objects.count()
            
            # Total active jobs (confirmed and in_progress bookings)
            total_jobs = Booking.objects.filter(
                status__in=['confirmed', 'in_progress']
            ).count()
            
            # Calculate growth percentages
            yesterday_bookings = Booking.objects.filter(
                time_slot__date=yesterday
            ).count()
            
            yesterday_revenue = Booking.objects.filter(
                time_slot__date=yesterday,
                status='completed'
            ).aggregate(
                total=Sum('final_price')
            )['total'] or Decimal('0.00')
            
            if yesterday_revenue == 0:
                yesterday_revenue = Booking.objects.filter(
                    time_slot__date=yesterday,
                    status='completed'
                ).aggregate(
                    total=Sum('quoted_price')
                )['total'] or Decimal('0.00')
            
            # Calculate growth percentages
            bookings_growth = self.calculate_growth_percentage(today_bookings, yesterday_bookings)
            revenue_growth = self.calculate_growth_percentage(float(today_revenue), float(yesterday_revenue))
            
            # Get recent bookings (last 3)
            recent_bookings = Booking.objects.select_related(
                'customer', 'service', 'time_slot'
            ).order_by('-created_at')[:3]
            
            # Prepare data
            stats_data = {
                'today_bookings': today_bookings,
                'today_revenue': today_revenue,
                'total_customers': total_customers,
                'total_jobs': total_jobs,
                'revenue_growth': Decimal(str(revenue_growth)),
                'bookings_growth': Decimal(str(bookings_growth)),
                'recent_jobs': recent_bookings  # Note: keeping 'recent_jobs' name for frontend compatibility
            }
            
            # Serialize the data
            serializer = DashboardStatsSerializer(stats_data)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch dashboard statistics: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def calculate_growth_percentage(self, current, previous):
        """
        Calculate growth percentage between current and previous values
        
        Args:
            current: Current period value
            previous: Previous period value
            
        Returns:
            Growth percentage (positive for growth, negative for decline)
        """
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        
        growth = ((current - previous) / previous) * 100
        return round(growth, 2)
