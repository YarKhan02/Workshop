# workshop/helper/booking_helpers.py

from django.utils import timezone
from django.db import transaction
from datetime import datetime, timedelta
from workshop.models.booking import Booking, BookingStatusHistory
from workshop.models.daily_availability import DailyAvailability
from decimal import Decimal


def handle_booking_status_change(booking, old_status, new_status, user, notes):
    """
    Handle booking status change with daily availability updates and invoice generation
    """
    with transaction.atomic():
        # Update booking status
        booking.status = new_status
        
        # Set timestamps based on status
        if new_status == 'confirmed' and old_status != 'confirmed':
            booking.confirmed_at = timezone.now()
        elif new_status == 'cancelled':
            booking.cancelled_at = timezone.now()
            booking.cancellation_reason = notes
        elif new_status == 'completed':
            # Auto-generate invoice when booking is completed
            try:
                invoice = booking.generate_invoice()
                if invoice:
                    notes += f"\nInvoice {invoice.invoice_number} generated automatically."
            except Exception as e:
                # Log the error but don't fail the status change
                print(f"Error generating invoice for booking {booking.id}: {str(e)}")
        
        booking.save()
        
        # Update daily availability based on status change
        update_daily_availability_for_booking(booking, old_status, new_status)
        
        # Create status history record
        BookingStatusHistory.objects.create(
            booking=booking,
            old_status=old_status,
            new_status=new_status,
            changed_by=user,
            change_reason=notes
        )
    
    return booking


def update_daily_availability_for_booking(booking, old_status, new_status):
    """
    Update daily availability based on booking status change
    """
    availability, created = DailyAvailability.objects.get_or_create(
        date=booking.booking_date,
        defaults={'total_slots': 7, 'available_slots': 7}
    )
    
    # Determine if old status booked a slot
    old_books_slot = old_status in ['pending', 'confirmed', 'in_progress']
    # Determine if new status books a slot  
    new_books_slot = new_status in ['pending', 'confirmed', 'in_progress']
    
    if old_books_slot and not new_books_slot:
        # Freeing up a slot (cancellation, completion, etc.)
        availability.cancel_slot()
    elif not old_books_slot and new_books_slot:
        # Booking a slot (from draft to pending/confirmed)
        availability.book_slot()
    # If both book slots or both don't book slots, no change needed


def handle_booking_creation(booking):
    """
    Handle booking creation by updating daily availability
    """
    if booking.status in ['pending', 'confirmed', 'in_progress']:
        availability, created = DailyAvailability.objects.get_or_create(
            date=booking.booking_date,
            defaults={'total_slots': 7, 'available_slots': 7}
        )
        availability.book_slot()


def handle_booking_deletion(booking):
    """
    Handle booking deletion by freeing up daily availability
    """
    if booking.status in ['pending', 'confirmed', 'in_progress']:
        try:
            availability = DailyAvailability.objects.get(date=booking.booking_date)
            availability.cancel_slot()
        except DailyAvailability.DoesNotExist:
            pass  # Nothing to update if availability doesn't exist


def is_booking_cancellable(booking):
    """
    Determine if a booking can be cancelled
    """
    if booking.status in ['cancelled', 'completed', 'no_show']:
        return False
    
    # Check if booking is in the past
    if booking.booking_date < timezone.now().date():
        return False
    
    return True


def is_date_available_for_booking(target_date, exclude_booking_id=None):
    """
    Check if a date has available slots for booking
    """
    try:
        availability = DailyAvailability.objects.get(date=target_date)
        return availability.available_slots > 0
    except DailyAvailability.DoesNotExist:
        # If no availability record exists, assume available
        return True


def get_available_slots_for_date(target_date):
    """
    Get the number of available slots for a specific date
    """
    try:
        availability = DailyAvailability.objects.get(date=target_date)
        return availability.available_slots
    except DailyAvailability.DoesNotExist:
        # If no availability record exists, return default
        return 7


def prepare_booking_snapshot_data(customer, car):
    """
    Prepare snapshot data for a booking to preserve customer and car details
    """
    return {
        'customer_snapshot': {
            'name': customer.name,
            'phone': customer.phone,
            'email': customer.email,
            'address': customer.address,
        },
        'car_snapshot': {
            'make': car.make,
            'model': car.model,
            'year': car.year,
            'license_plate': car.license_plate,
            'color': car.color,
            'vin': car.vin,
        }
    }


def calculate_booking_final_price(quoted_price, discount_amount=0):
    """
    Calculate final price after applying discount
    """
    quoted_price = Decimal(str(quoted_price))
    discount_amount = Decimal(str(discount_amount))
    
    final_price = quoted_price - discount_amount
    return max(final_price, Decimal('0.00'))  # Ensure non-negative


def sync_availability_with_actual_bookings():
    """
    Sync daily availability records with actual booking counts
    Useful for data integrity maintenance
    """
    from django.db.models import Count, Q
    
    # Get all dates that have bookings
    booking_dates = Booking.objects.values_list('booking_date', flat=True).distinct()
    
    for date in booking_dates:
        if date:  # Skip None dates
            # Count active bookings for this date
            active_count = Booking.objects.filter(
                booking_date=date,
                status__in=['pending', 'confirmed', 'in_progress']
            ).count()
            
            # Get or create availability record
            availability, created = DailyAvailability.objects.get_or_create(
                date=date,
                defaults={'total_slots': 7, 'available_slots': 7}
            )
            
            # Update available slots
            availability.available_slots = max(0, availability.total_slots - active_count)
            availability.save()


def get_booking_conflicts(booking_date, exclude_booking_id=None):
    """
    Get conflicting bookings for a specific date
    """
    conflicts = Booking.objects.filter(
        booking_date=booking_date,
        status__in=['pending', 'confirmed', 'in_progress']
    )
    
    if exclude_booking_id:
        conflicts = conflicts.exclude(id=exclude_booking_id)
    
    return conflicts


def is_booking_editable(booking):
    """
    Determine if a booking can be edited
    """
    # Can't edit cancelled, completed, or no-show bookings
    if booking.status in ['cancelled', 'completed', 'no_show']:
        return False
    
    # Can't edit bookings in the past
    if booking.booking_date < timezone.now().date():
        return False
    
    return True


def get_booking_status_display(status):
    """
    Get human-readable status display
    """
    status_map = {
        'pending': 'Pending',
        'confirmed': 'Confirmed', 
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'no_show': 'No Show',
        'draft': 'Draft'
    }
    return status_map.get(status, status.title())
