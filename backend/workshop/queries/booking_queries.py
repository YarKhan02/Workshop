# workshop/queries/booking_queries.py

from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, date
from workshop.models import Booking, BookingService, Car, User


# Get optimized bookings list
def get_optimized_bookings(filters=None, page=1, page_size=10):
    queryset = Booking.objects.select_related(
        'car', 'car__customer', 'daily_availability', 'created_by', 'invoice'
    ).prefetch_related('service').only(
        # Booking fields
        'id', 'created_at', 'special_instructions', 'customer_rating', 'customer_feedback',
        # Car fields
        'car__id', 'car__make', 'car__model', 'car__license_plate', 'car__year', 'car__color',
        # Customer fields (through car)
        'car__customer__id', 'car__customer__name',
        'car__customer__email', 'car__customer__phone_number',
        # Daily availability
        'daily_availability__id', 'daily_availability__date',
        # Created by (User model has 'name', not first_name/last_name)
        'created_by__id', 'created_by__name', 'created_by__email',
        # Invoice
        'invoice__id', 'invoice__total_amount', 'invoice__status'
    )
    
    if filters:
        # Apply filters - Note: service filters need to go through BookingService
        if filters.get('status'):
            # Status is on BookingService, not Booking
            queryset = queryset.filter(service__status=filters['status'])
        
        if filters.get('customer'):
            queryset = queryset.filter(car__customer_id=filters['customer'])
        
        if filters.get('service'):
            queryset = queryset.filter(service__service_id=filters['service'])
        
        if filters.get('date_from'):
            try:
                date_from = datetime.strptime(filters['date_from'], '%Y-%m-%d').date()
                queryset = queryset.filter(daily_availability__date__gte=date_from)
            except ValueError:
                pass
        
        if filters.get('date_to'):
            try:
                date_to = datetime.strptime(filters['date_to'], '%Y-%m-%d').date()
                queryset = queryset.filter(daily_availability__date__lte=date_to)
            except ValueError:
                pass
        
        if filters.get('search'):
            search = filters['search']
            queryset = queryset.filter(
                Q(car__customer__name__icontains=search) |
                Q(car__customer__email__icontains=search) |
                Q(car__customer__phone_number__icontains=search) |
                Q(car__make__icontains=search) |
                Q(car__model__icontains=search) |
                Q(car__license_plate__icontains=search) |
                Q(service__service__name__icontains=search) |
                Q(special_instructions__icontains=search)
            )
    
    # Order by upcoming dates first (ascending), then creation order
    queryset = queryset.order_by('daily_availability__date', 'created_at')
    
    # Pagination
    start = (page - 1) * page_size
    end = start + page_size
    total_count = queryset.count()
    paginated_queryset = queryset[start:end]
    
    return {
        'queryset': paginated_queryset,
        'pagination': {
            'page': page,
            'page_size': page_size,
            'total_count': total_count,
            'total_pages': (total_count + page_size - 1) // page_size,
            'has_next': end < total_count,
            'has_previous': page > 1
        }
    }


def get_optimized_booking_detail(booking_id):
    """
    Get optimized booking detail with all necessary related data
    """
    try:
        return Booking.objects.select_related(
            'car', 'car__customer', 'daily_availability', 'created_by', 'invoice'
        ).only(
            # Booking fields
            'id', 'special_instructions', 'created_at', 'customer_rating', 'customer_feedback',
            # Daily availability fields
            'daily_availability__date', 'daily_availability__total_slots', 'daily_availability__available_slots',
            # Car fields
            'car__id', 'car__make', 'car__model', 'car__year', 'car__license_plate', 'car__color',
            # Customer fields (through car)
            'car__customer__id', 'car__customer__name', 
            'car__customer__email', 'car__customer__phone_number', 'car__customer__nic',
            # Created by fields (User model has 'name', not first_name/last_name)
            'created_by__id', 'created_by__name', 'created_by__email',
            # Invoice fields
            'invoice__id', 'invoice__total_amount', 'invoice__status'
        ).get(pk=booking_id)
    except Booking.DoesNotExist:
        return None


def get_booking_stats():
    today = timezone.now().date()
    
    stats = BookingService.objects.aggregate(
        total_bookings=Count('id'),
        completed_bookings=Count('id', filter=Q(status='completed')),
        pending_bookings=Count('id', filter=Q(status__in=['pending', 'confirmed'])),
        today_bookings=Count('id', filter=Q(booking__daily_availability__date=today))
    )
    
    return {
        'totalBookings': stats['total_bookings'],
        'completedBookings': stats['completed_bookings'], 
        'pendingBookings': stats['pending_bookings'],
        'todayBookings': stats['today_bookings']
    }


def get_customer_cars_optimized(customer_id):
    """
    Get optimized customer cars with only required fields
    """
    if not customer_id:
        return None
    
    try:
        customer = User.objects.only('id', 'name').get(pk=customer_id)
        cars = Car.objects.filter(customer=customer).only(
            'id', 'make', 'model', 'year', 'license_plate', 'color'
        )
        
        cars_data = []
        for car in cars:
            cars_data.append({
                'id': str(car.id),
                'make': car.make,
                'model': car.model,
                'year': car.year,
                'license_plate': car.license_plate,
                'color': car.color,
                'display_name': f"{car.year} {car.make} {car.model} ({car.license_plate})"
            })
        
        return {'cars': cars_data}
    except User.DoesNotExist:
        return None


def check_booking_exists(booking_id):
    """
    Check if a booking exists (optimized)
    """
    return Booking.objects.filter(pk=booking_id).only('id').exists()


def get_booking_for_update(booking_id):
    """
    Get booking for update operations with minimal fields
    """
    try:
        return Booking.objects.select_related('daily_availability').only(
            'id', 'special_instructions', 'daily_availability__date'
        ).get(pk=booking_id)
    except Booking.DoesNotExist:
        return None
