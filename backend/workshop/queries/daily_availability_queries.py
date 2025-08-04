# workshop/queries/daily_availability_queries.py

from django.db.models import Q, Count
from datetime import date, timedelta
from workshop.models.daily_availability import DailyAvailability
from workshop.models.booking import Booking


def get_available_dates_optimized(start_date=None, days=14):
    """
    Get optimized available dates for booking within the next X days
    """
    if start_date is None:
        start_date = date.today()
    
    end_date = start_date + timedelta(days=days)
    
    # Ensure availability records exist
    DailyAvailability.create_daily_availability(start_date, days)
    
    # Get all dates in the period with availability info
    available_dates = DailyAvailability.objects.filter(
        date__gte=start_date,
        date__lt=end_date
    ).only(
        'id', 'date', 'total_slots', 'available_slots', 'is_available'
    ).order_by('date')
    
    dates_data = []
    for availability in available_dates:
        dates_data.append({
            'date': availability.date.strftime('%Y-%m-%d'),
            'display_date': availability.date.strftime('%B %d, %Y'),
            'day_name': availability.date.strftime('%A'),
            'total_slots': availability.total_slots,
            'available_slots': availability.available_slots,
            'is_available': availability.is_available and availability.available_slots > 0,
            'is_fully_booked': availability.available_slots == 0,
        })
    
    return dates_data


def get_availability_for_date(target_date):
    """
    Get availability info for a specific date
    """
    try:
        if isinstance(target_date, str):
            target_date = date.fromisoformat(target_date)
        
        # Ensure availability record exists
        DailyAvailability.create_daily_availability(target_date, days=1)
        
        availability = DailyAvailability.objects.only(
            'id', 'date', 'total_slots', 'available_slots', 'is_available'
        ).get(date=target_date)
        
        return {
            'date': availability.date.strftime('%Y-%m-%d'),
            'total_slots': availability.total_slots,
            'available_slots': availability.available_slots,
            'is_available': availability.is_available and availability.available_slots > 0,
            'booked_slots': availability.total_slots - availability.available_slots,
        }
        
    except DailyAvailability.DoesNotExist:
        return None


def sync_availability_with_bookings():
    """
    Sync daily availability with actual booking counts (for data consistency)
    This should be run periodically to ensure availability counts are accurate
    """
    updated_count = 0
    
    # Get all availability records
    availabilities = DailyAvailability.objects.all()
    
    for availability in availabilities:
        # Count actual confirmed/in-progress bookings for this date
        actual_bookings = Booking.objects.filter(
            booking_date=availability.date,
            status__in=['confirmed', 'in_progress']
        ).count()
        
        # Calculate correct available slots
        correct_available = max(0, availability.total_slots - actual_bookings)
        
        # Update if different
        if availability.available_slots != correct_available:
            availability.available_slots = correct_available
            availability.save(update_fields=['available_slots', 'updated_at'])
            updated_count += 1
    
    return updated_count


def get_booking_summary_for_dates(start_date=None, days=14):
    """
    Get booking summary for a date range with availability info
    """
    if start_date is None:
        start_date = date.today()
    
    end_date = start_date + timedelta(days=days)
    
    # Ensure availability records exist
    DailyAvailability.create_daily_availability(start_date, days)
    
    # Get availability data with booking counts
    availabilities = DailyAvailability.objects.filter(
        date__gte=start_date,
        date__lt=end_date
    ).only(
        'id', 'date', 'total_slots', 'available_slots', 'is_available'
    ).order_by('date')
    
    summary_data = []
    for availability in availabilities:
        # Get actual booking count for verification
        booking_count = Booking.objects.filter(
            booking_date=availability.date,
            status__in=['confirmed', 'in_progress']
        ).count()
        
        summary_data.append({
            'date': availability.date.strftime('%Y-%m-%d'),
            'display_date': availability.date.strftime('%B %d, %Y'),
            'day_name': availability.date.strftime('%A'),
            'total_slots': availability.total_slots,
            'available_slots': availability.available_slots,
            'booked_slots': availability.total_slots - availability.available_slots,
            'actual_bookings': booking_count,  # For verification
            'is_available': availability.is_available and availability.available_slots > 0,
            'utilization_percentage': ((availability.total_slots - availability.available_slots) / availability.total_slots) * 100 if availability.total_slots > 0 else 0,
        })
    
    return summary_data
