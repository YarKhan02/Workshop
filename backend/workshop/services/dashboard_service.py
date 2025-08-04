# workshop/services/dashboard_service.py

from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from workshop.models import Booking, Customer
from workshop.serializers import DashboardStatsSerializer
from workshop.queries import dashboard_queries as dq

class DashboardService:
    def get_stats(self):
        try:
            today = timezone.now().date()
            yesterday = today - timedelta(days=1)

            today_bookings = dq.get_bookings(today)
            today_revenue = dq.get_revenue(today)
            
            total_customers = dq.get_total_customers()
            total_jobs = dq.get_total_active_jobs()
            
            yesterday_bookings = dq.get_bookings(yesterday)
            yesterday_revenue = dq.get_revenue(yesterday)
            
            bookings_growth = self.calculate_growth_percentage(today_bookings, yesterday_bookings)
            revenue_growth = self.calculate_growth_percentage(float(today_revenue), float(yesterday_revenue))
            
            recent_bookings = dq.get_recent_bookings(limit=3)
            
            stats_data = {
                'today_bookings': today_bookings,
                'today_revenue': today_revenue,
                'total_customers': total_customers,
                'total_jobs': total_jobs,
                'revenue_growth': Decimal(str(revenue_growth)),
                'bookings_growth': Decimal(str(bookings_growth)),
                'recent_jobs': recent_bookings
            }

            print("Dashboard stats data:", stats_data)
            
            serializer = DashboardStatsSerializer(stats_data)
            
            return serializer.data, None
        
        except Exception as e:
            return None, {'error': f'Failed to fetch dashboard statistics: {str(e)}'}

    def calculate_growth_percentage(self, current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        growth = ((current - previous) / previous) * 100
        return round(growth, 2)
