# workshop/queries/combined_invoice_queries.py
# Separate queries for inventory invoices vs booking invoices

from workshop.models.invoice import Invoice
from django.db.models import Q

def get_inventory_invoices():
    """Get invoices that were created for inventory/products purchases"""
    return Invoice.objects.select_related('customer').prefetch_related('items__product_variant').filter(
        # Inventory invoices have product variants in items
        items__product_variant__isnull=False
    ).distinct()

def get_booking_invoices():
    """Get invoices that were created for completed bookings/services"""
    try:
        # Check if booking relationship exists
        from workshop.models.booking import Booking
        return Invoice.objects.select_related('customer').prefetch_related('items').filter(
            # Booking invoices are linked to bookings
            id__in=Booking.objects.filter(invoice__isnull=False).values_list('invoice_id', flat=True)
        ).distinct()
    except:
        # If booking model doesn't have invoice relationship yet, return empty queryset
        return Invoice.objects.none()

def get_all_invoices_combined():
    """Get all invoices regardless of type"""
    return Invoice.objects.select_related('customer').prefetch_related('items__product_variant').all()

def get_optimized_inventory_invoices():
    """Optimized query for inventory/product invoices"""
    return Invoice.objects.select_related('customer').prefetch_related('items__product_variant').filter(
        items__product_variant__isnull=False
    ).distinct()

def get_optimized_booking_invoices():
    """Optimized query for booking/service invoices"""
    try:
        from workshop.models.booking import Booking
        booking_invoice_ids = Booking.objects.filter(invoice__isnull=False).values_list('invoice_id', flat=True)
        return Invoice.objects.select_related('customer').prefetch_related('items').filter(
            id__in=booking_invoice_ids
        ).distinct()
    except:
        return Invoice.objects.none()
