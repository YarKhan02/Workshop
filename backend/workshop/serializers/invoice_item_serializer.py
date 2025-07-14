from rest_framework import serializers

from workshop.serializers.product_serializer import ProductInvoiceItemSerializer
from workshop.models.invoice_items import InvoiceItems

class InvoiceItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = InvoiceItems
        fields = [
            'id',
            'quantity',
            'unit_price',
            'total_price',
            'product_name'
        ]

    def get_total_price(self, obj):
        return obj.quantity * obj.unit_price