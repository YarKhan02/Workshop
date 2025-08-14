# workshop/queries/dashboard_queries.py

from django.db.models import Sum, Count
from workshop.models import Booking, User, DailyAvailability, BookingService, Invoice
from decimal import Decimal
from datetime import date

def get_bookings(today: date) -> int:
    """Get today's bookings from DailyAvailability"""
    try:
        daily_availability = DailyAvailability.objects.get(date=today)
        # Calculate bookings as total_slots - available_slots
        return daily_availability.total_slots - daily_availability.available_slots
    except DailyAvailability.DoesNotExist:
        return 0

def get_revenue(target_date: date) -> Decimal:
    """Get revenue from BookingService for completed bookings on target date"""
    revenue = BookingService.objects.filter(
        booking__daily_availability__date=target_date,
        status='completed'
    ).aggregate(total=Sum('price'))['total'] or Decimal('0.00')
    
    return revenue

def get_total_customers() -> int:
    """Get total number of customers"""
    return User.objects.filter(role='customer').count()

def get_total_active_jobs() -> int:
    """Get total active jobs from BookingService"""
    return BookingService.objects.filter(
        status__in=['confirmed', 'in_progress']
    ).count()

def get_recent_bookings(limit: int = 3):
    """Get recent bookings from Invoice with user name, total_amount, discount_amount, and created_at"""
    return list(
        Invoice.objects
        .select_related('user')
        .filter(bookings__isnull=False)  # Only invoices that have bookings
        .order_by('-created_at')[:limit]
        .values(
            'id',
            'user__name',
            'total_amount',
            'discount_amount',
            'created_at',
        )
    )