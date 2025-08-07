# workshop/queries/booking_queries.py

from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, date
from workshop.models.booking import Booking
from workshop.models.customer import Customer
from workshop.models.car import Car


def get_optimized_bookings(filters=None, page=1, page_size=10):
    """
    Get optimized booking list with only required fields for frontend display
    """
    queryset = Booking.objects.select_related(
        'customer', 'car', 'service', 'assigned_staff'
    ).only(
        # Booking fields
        'id', 'status', 'customer_notes', 'final_price', 'created_at',
        'estimated_duration_minutes', 'booking_date',
        # Customer fields
        'customer__id', 'customer__first_name', 'customer__last_name',
        'customer__email', 'customer__phone_number',
        # Car fields
        'car__id', 'car__make', 'car__model', 'car__license_plate',
        # Service fields
        'service__code', 'service__name',
        # Staff fields (optional)
        'assigned_staff__first_name', 'assigned_staff__last_name'
    )
    
    if filters:
        # Apply filters
        if filters.get('status'):
            queryset = queryset.filter(status=filters['status'])
        
        if filters.get('customer'):
            queryset = queryset.filter(customer_id=filters['customer'])
        
        if filters.get('service'):
            queryset = queryset.filter(service_id=filters['service'])
        
        if filters.get('date_from'):
            try:
                date_from = datetime.strptime(filters['date_from'], '%Y-%m-%d').date()
                queryset = queryset.filter(booking_date__gte=date_from)
            except ValueError:
                pass
        
        if filters.get('date_to'):
            try:
                date_to = datetime.strptime(filters['date_to'], '%Y-%m-%d').date()
                queryset = queryset.filter(booking_date__lte=date_to)
            except ValueError:
                pass
        
        if filters.get('search'):
            search = filters['search']
            queryset = queryset.filter(
                Q(customer__first_name__icontains=search) |
                Q(customer__last_name__icontains=search) |
                Q(customer__email__icontains=search) |
                Q(customer__phone_number__icontains=search) |
                Q(car__make__icontains=search) |
                Q(car__model__icontains=search) |
                Q(car__license_plate__icontains=search) |
                Q(service__name__icontains=search) |
                Q(customer_notes__icontains=search)
            )
    
    # Order by upcoming dates first (ascending), then creation order
    queryset = queryset.order_by('booking_date', 'created_at')
    
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
            'customer', 'car', 'service', 'assigned_staff', 'created_by'
        ).only(
            # Booking fields
            'id', 'status', 'customer_notes', 'staff_notes', 'special_instructions',
            'quoted_price', 'final_price', 'discount_percentage', 'discount_amount',
            'estimated_duration_minutes', 'actual_start_time', 'actual_end_time',
            'booking_date', 'created_at', 'updated_at', 'confirmed_at', 'cancelled_at',
            'cancellation_reason', 'customer_rating', 'customer_feedback',
            # Snapshot fields
            'customer_phone', 'customer_email', 'car_make', 'car_model', 
            'car_year', 'car_license_plate', 'car_color',
            # Customer fields
            'customer__id', 'customer__first_name', 'customer__last_name',
            'customer__email', 'customer__phone_number', 'customer__nic',
            # Car fields
            'car__id', 'car__make', 'car__model', 'car__year', 'car__license_plate',
            'car__color', 'car__vin',
            # Service fields
            'service__id', 'service__code', 'service__name', 'service__description',
            'service__duration_minutes', 'service__price',
            # Staff fields
            'assigned_staff__id', 'assigned_staff__first_name', 'assigned_staff__last_name',
            'assigned_staff__email',
            # Created by fields
            'created_by__id', 'created_by__first_name', 'created_by__last_name'
        ).get(pk=booking_id)
    except Booking.DoesNotExist:
        return None


def get_booking_stats():
    """
    Get optimized booking statistics using the new date-based booking system
    """
    today = timezone.now().date()
    
    # Use aggregation for better performance
    stats = Booking.objects.aggregate(
        total_bookings=Count('id'),
        completed_bookings=Count('id', filter=Q(status='completed')),
        pending_bookings=Count('id', filter=Q(status__in=['pending', 'confirmed'])),
        today_bookings=Count('id', filter=Q(booking_date=today))
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
        customer = Customer.objects.only('id', 'first_name', 'last_name').get(pk=customer_id)
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
    except Customer.DoesNotExist:
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
        return Booking.objects.only(
            'id', 'status', 'booking_date', 'estimated_duration_minutes',
            'quoted_price', 'discount_amount', 'final_price'
        ).get(pk=booking_id)
    except Booking.DoesNotExist:
        return None
