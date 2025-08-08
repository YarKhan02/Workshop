from django.db.models import QuerySet
from workshop.models import Booking


class MyBookingsQueries:
    """
    Optimized queries for customer booking interface
    """
    
    @staticmethod
    def get_customer_bookings_optimized(customer) -> QuerySet:
        """
        Get customer bookings with optimized query that only fetches required fields
        from related models (Car and Service) to minimize database hits.
        
        Args:
            customer: Customer instance
            
        Returns:
            QuerySet with optimized select_related and only() for minimal data fetching
        """
        return Booking.objects.filter(
            customer=customer
        ).select_related(
            'car',  # Join with Car table
            'service'  # Join with Service table
        ).only(
            # Booking fields
            'id',
            'booking_date', 
            'status',
            'created_at',
            'quoted_price',
            'estimated_duration_minutes',
            
            # Car fields (via select_related)
            'car__make',
            'car__model', 
            'car__license_plate',
            
            # Service fields (via select_related)
            'service__name',
            'service__base_price'
        ).order_by('-created_at')  # Most recent first
    
    @staticmethod
    def get_customer_bookings_by_status_optimized(customer, status: str) -> QuerySet:
        """
        Get customer bookings filtered by status with optimized query
        
        Args:
            customer: Customer instance
            status: Booking status to filter by
            
        Returns:
            QuerySet with optimized select_related and only() for minimal data fetching
        """
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
        """
        Get customer's most recent bookings with optimized query
        
        Args:
            customer: Customer instance
            limit: Number of recent bookings to fetch
            
        Returns:
            QuerySet with optimized select_related and only() for minimal data fetching
        """
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
