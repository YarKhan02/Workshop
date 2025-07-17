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
    
class InvoiceItemCreateSerializer(serializers.ModelSerializer):
    product = serializers.UUIDField(write_only=True)

    class Meta:
        model = InvoiceItems
        fields = [
            'quantity',
            'unit_price',
            'total_price',
            'product'
        ]

    def create(self, validated_data):
        product_uuid = validated_data.pop('product')
        invoice = self.context.get('invoice')
        return InvoiceItems.objects.create(
            product_id=product_uuid,
            invoice=invoice,
            **validated_data
        )