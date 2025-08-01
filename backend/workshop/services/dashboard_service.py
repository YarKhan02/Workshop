# workshop/services/dashboard_service.py
from workshop.models import Booking, Customer, Invoice
from workshop.serializers import DashboardStatsSerializer, RecentBookingSerializer
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

class DashboardService:
    def get_stats(self):
        try:
            today = timezone.now().date()
            yesterday = today - timedelta(days=1)
            today_bookings = Booking.objects.filter(time_slot__date=today).count()
            today_revenue = Booking.objects.filter(
                time_slot__date=today,
                status='completed'
            ).aggregate(total=Sum('final_price'))['total'] or Decimal('0.00')
            if today_revenue == 0:
                today_revenue = Booking.objects.filter(
                    time_slot__date=today,
                    status='completed'
                ).aggregate(total=Sum('quoted_price'))['total'] or Decimal('0.00')
            total_customers = Customer.objects.count()
            total_jobs = Booking.objects.filter(status__in=['confirmed', 'in_progress']).count()
            yesterday_bookings = Booking.objects.filter(time_slot__date=yesterday).count()
            yesterday_revenue = Booking.objects.filter(
                time_slot__date=yesterday,
                status='completed'
            ).aggregate(total=Sum('final_price'))['total'] or Decimal('0.00')
            if yesterday_revenue == 0:
                yesterday_revenue = Booking.objects.filter(
                    time_slot__date=yesterday,
                    status='completed'
                ).aggregate(total=Sum('quoted_price'))['total'] or Decimal('0.00')
            bookings_growth = self.calculate_growth_percentage(today_bookings, yesterday_bookings)
            revenue_growth = self.calculate_growth_percentage(float(today_revenue), float(yesterday_revenue))
            recent_bookings = Booking.objects.select_related(
                'customer', 'service', 'time_slot'
            ).order_by('-created_at')[:3]
            stats_data = {
                'today_bookings': today_bookings,
                'today_revenue': today_revenue,
                'total_customers': total_customers,
                'total_jobs': total_jobs,
                'revenue_growth': Decimal(str(revenue_growth)),
                'bookings_growth': Decimal(str(bookings_growth)),
                'recent_jobs': recent_bookings
            }
            serializer = DashboardStatsSerializer(stats_data)
            return serializer.data, None
        except Exception as e:
            return None, {'error': f'Failed to fetch dashboard statistics: {str(e)}'}

    def calculate_growth_percentage(self, current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        growth = ((current - previous) / previous) * 100
        return round(growth, 2)
