# workshop/serializers/combined_invoice_serializer.py
# Separate serializers for inventory and booking invoices

from rest_framework import serializers
from workshop.models.invoice import Invoice
from workshop.serializers.customer_serializer import CustomerInvoiceSerializer
from workshop.serializers.invoice_item_serializer import InvoiceItemSerializer

class InventoryInvoiceSerializer(serializers.ModelSerializer):
    """Serializer for inventory/product purchase invoices"""
    customer = CustomerInvoiceSerializer(read_only=True)
    items = InvoiceItemSerializer(many=True, read_only=True)
    invoice_type = serializers.SerializerMethodField()
    # Map new fields to old field names for frontend compatibility
    discount = serializers.DecimalField(source='discount_amount', max_digits=10, decimal_places=2, read_only=True)
    tax = serializers.DecimalField(source='tax_amount', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id',
            'total_amount',
            'discount',
            'tax',
            'created_at',
            'status',
            'customer',
            'items',
            'invoice_type',
        ]

    def get_invoice_type(self, obj):
        return 'inventory'

class BookingInvoiceSerializer(serializers.ModelSerializer):
    """Serializer for booking/service invoices"""
    customer = CustomerInvoiceSerializer(read_only=True)
    items = InvoiceItemSerializer(many=True, read_only=True)
    amount_due = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    payment_status = serializers.CharField(source='status')  # Map status to payment_status
    invoice_type = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id',
            'invoice_number',
            'customer',
            'items',
            'subtotal',
            'tax_amount',
            'discount_amount',
            'total_amount',
            'amount_due',
            'payment_status',
            'due_date',
            'paid_date',
            'is_overdue',
            'notes',
            'created_at',
            'updated_at',
            'invoice_type',
        ]

    def get_invoice_type(self, obj):
        return 'booking'

class CombinedInvoiceSerializer(serializers.Serializer):
    """Combined serializer that handles both invoice types"""
    inventory_invoices = InventoryInvoiceSerializer(many=True, read_only=True)
    booking_invoices = BookingInvoiceSerializer(many=True, read_only=True)
    total_count = serializers.IntegerField(read_only=True)
    inventory_count = serializers.IntegerField(read_only=True)
    booking_count = serializers.IntegerField(read_only=True)
