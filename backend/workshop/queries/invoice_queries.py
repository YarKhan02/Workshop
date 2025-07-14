# workshop/queries/invoice_queries.py

from workshop.models.invoice import Invoice

def get_optimized_invoices():
    return Invoice.objects.select_related('customer').prefetch_related('items__product').only(
        'id',
        'total_amount',
        'discount',
        'tax',
        'created_at',
        'status',
        'customer__email',
        'customer__first_name',
        'customer__last_name',
        'customer__phone_number',
        'items__id',
        'items__quantity',
        'items__unit_price',
        'items__total_price',
        'items__product__name',
    )
