# workshop/queries/invoice_queries.py

from typing import Optional, Dict, Any
from datetime import datetime
from django.db.models import Q, QuerySet, Sum
from django.core.paginator import Paginator
from django.utils import timezone
from workshop.models.invoice import Invoice
from workshop.models.booking import Booking


def get_optimized_invoices():
    return Invoice.objects.select_related('customer').only(
        'id',
        'total_amount',
        'created_at',
        'status',
        'customer__email',
        'customer__first_name',
        'customer__last_name',
        'customer__phone_number',
    )


def get_invoices_with_items_and_variants() -> QuerySet:
    """
    Get invoices with optimized queries for both items and booking data
    """
    return Invoice.objects.select_related('user').prefetch_related(
        'bookings__car',                    # For booking car info  
        'bookings__service__service',       # For booking service info
        'bookings__daily_availability'      # For booking date info
    )


def get_invoices_with_booking_data() -> QuerySet:
    return Invoice.objects.select_related('user').prefetch_related(
        'bookings__car__brand',
        'bookings__car__customer', 
        'bookings__daily_availability',
        'bookings__service__service'
    )


def get_invoice_booking_data(invoice_ids: list) -> QuerySet:
    print(f"=== DEBUG QUERY: Looking for bookings with invoice_ids: {invoice_ids} ===")
    
    try:
        # Fix the query - the relationship path should be correct
        queryset = Booking.objects.filter(
            invoice_id__in=invoice_ids
        ).select_related(
            'car__customer',    # Car -> Customer (User)
            'daily_availability',
            'service__service',  # BookingService -> Service
            'invoice'           # Include invoice relationship for financial data
        )
        
        print(f"=== DEBUG QUERY: Booking queryset SQL: {queryset.query} ===")
        print(f"=== DEBUG QUERY: Found {queryset.count()} bookings ===")
        
        # Let's also check all bookings to see what's in the database
        all_bookings = Booking.objects.all()
        print(f"=== DEBUG QUERY: Total bookings in database: {all_bookings.count()} ===")
        for booking in all_bookings:
            print(f"=== DEBUG QUERY: Booking {booking.id} -> Invoice {booking.invoice_id} ===")
            # Check if booking has service
            if hasattr(booking, 'service') and booking.service:
                print(f"=== DEBUG QUERY: Booking {booking.id} has service: {booking.service.service.name} ===")
            else:
                print(f"=== DEBUG QUERY: Booking {booking.id} has NO service ===")
        
        return queryset
        
    except Exception as e:
        print(f"=== DEBUG QUERY ERROR: {e} ===")
        import traceback
        print(f"=== DEBUG QUERY TRACEBACK: {traceback.format_exc()} ===")
        # Return empty queryset on error
        return Booking.objects.none()


def apply_invoice_search_filter(queryset: QuerySet, search: str) -> QuerySet:
    search_filter = Q(user__name__icontains=search) | \
                   Q(invoice_number__icontains=search) | \
                   Q(id__icontains=search)
    return queryset.filter(search_filter)


def apply_invoice_status_filter(queryset: QuerySet, status_filter: str) -> QuerySet:
    return queryset.filter(status=status_filter)


def get_filtered_invoices(customer_id=None, invoice_type=None, page=1, page_size=10, date_from=None, date_to=None):
    """
    Get filtered invoices with all related data in a single optimized query
    """
    queryset = get_invoices_with_items_and_variants()
    
    if customer_id:
        queryset = queryset.filter(user_id=customer_id)
        
    if invoice_type and invoice_type != 'all':
        if invoice_type == 'booking':
            queryset = queryset.filter(bookings__isnull=False)
        elif invoice_type == 'product':
            queryset = queryset.filter(bookings__isnull=True)
    
    if date_from:
        try:
            date_from_obj = datetime.strptime(date_from, '%Y-%m-%d').date()
            queryset = queryset.filter(created_at__date__gte=date_from_obj)
        except ValueError:
            pass
    
    if date_to:
        try:
            date_to_obj = datetime.strptime(date_to, '%Y-%m-%d').date()
            queryset = queryset.filter(created_at__date__lte=date_to_obj)
        except ValueError:
            pass
    
    total_count = queryset.count()
    
    paginator = Paginator(queryset.order_by('-created_at'), page_size)
    page_obj = paginator.get_page(page)
    
    return {
        'invoices': page_obj.object_list,
        'pagination': {
            'current_page': page_obj.number,
            'total_pages': paginator.num_pages,
            'total_items': total_count,
            'page_size': page_size,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous()
        }
    }


def get_total_revenue() -> float:
    result = Invoice.objects.filter(status='paid').aggregate(
        total=Sum('total_amount')
    )
    return float(result['total'] or 0)


def get_total_orders_count() -> int:
    return Invoice.objects.count()


def get_outstanding_amount() -> float:
    result = Invoice.objects.filter(status='pending').aggregate(
        total=Sum('total_amount')
    )
    return float(result['total'] or 0)


def get_monthly_revenue() -> float:
    current_month_start = timezone.now().replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )
    
    result = Invoice.objects.filter(
        status='paid',
        created_at__gte=current_month_start
    ).aggregate(
        total=Sum('total_amount')
    )
    return float(result['total'] or 0)


def get_billing_statistics() -> Dict[str, Any]:
    return {
        'total_revenue': get_total_revenue(),
        'total_orders': get_total_orders_count(),
        'outstanding_amount': get_outstanding_amount(),
        'monthly_revenue': get_monthly_revenue(),
    }
