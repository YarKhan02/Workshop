# workshop/queries/dashboard_queries.py

from django.db.models import Sum
from workshop.models import Booking, Customer
from decimal import Decimal
from datetime import date

def get_bookings(today: date) -> int:
    return Booking.objects.filter(time_slot__date=today).count()

def get_revenue(target_date: date) -> Decimal:
    revenue = Booking.objects.filter(
        time_slot__date=target_date,
        status='completed'
    ).aggregate(total=Sum('final_price'))['total'] or Decimal('0.00')

    if revenue == 0:
        revenue = Booking.objects.filter(
            time_slot__date=target_date,
            status='completed'
        ).aggregate(total=Sum('quoted_price'))['total'] or Decimal('0.00')

    return revenue

def get_total_customers() -> int:
    return Customer.objects.count()

def get_total_active_jobs() -> int:
    return Booking.objects.filter(status__in=['confirmed', 'in_progress']).count()

def get_recent_bookings(limit: int = 3):
    return (
        Booking.objects
        .select_related('customer', 'service')
        .order_by('-created_at')[:limit]
        .values(
            'id',
            'customer__first_name',
            'customer__last_name',
            'service__name',
            'final_price',
            'quoted_price',
            'discount_amount',
            'created_at',
        )
    )