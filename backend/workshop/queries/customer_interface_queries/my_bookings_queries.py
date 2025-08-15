from datetime import datetime
from django.db.models import QuerySet, Q
from workshop.models import Booking


class MyBookingsQueries:
    """
    Optimized queries for customer booking interface
    """
    
    @staticmethod
    # Get optimized bookings list
    def get_customer_bookings_optimized(filters=None, page=1, page_size=10):
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

    
    
    @staticmethod
    def get_customer_bookings_by_status_optimized(customer, status: str) -> QuerySet:
        return Booking.objects.filter(
            customer=customer,
            status=status
        ).select_related(
            'car',
            'service'
        ).only(
            # Booking fields
            'id',
            'booking_date',
            'status', 
            'created_at',
            'quoted_price',
            'estimated_duration_minutes',
            
            # Car fields
            'car__make',
            'car__model',
            'car__license_plate',
            
            # Service fields
            'service__name',
            'service__base_price'
        ).order_by('-created_at')
    
    
    @staticmethod
    def get_customer_recent_bookings_optimized(customer, limit: int = 5) -> QuerySet:
        return Booking.objects.filter(
            customer=customer
        ).select_related(
            'car',
            'service'
        ).only(
            # Booking fields
            'id',
            'booking_date',
            'status',
            'created_at',
            'quoted_price',
            'estimated_duration_minutes',
            
            # Car fields
            'car__make',
            'car__model',
            'car__license_plate',
            
            # Service fields
            'service__name', 
            'service__base_price'
        ).order_by('-created_at')[:limit]
