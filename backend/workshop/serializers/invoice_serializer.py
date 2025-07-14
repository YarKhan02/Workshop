from rest_framework import serializers

from workshop.serializers.invoice_item_serializer import InvoiceItemSerializer
from workshop.models.invoice import Invoice
from workshop.serializers.customer_serializer import CustomerInvoiceSerializer

class InvoiceSerializer(serializers.ModelSerializer):
    customer = CustomerInvoiceSerializer(read_only=True)
    items = InvoiceItemSerializer(many=True, read_only=True)

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
        ]