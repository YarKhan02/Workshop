from rest_framework import serializers

from workshop.models.invoice_items import InvoiceItems
from workshop.models.product_variant import ProductVariant  # Import the ProductVariant model

class InvoiceItemSerializer(serializers.ModelSerializer):
    product_variant = serializers.CharField(source='product_variant.variant_name', read_only=True)
    product_name = serializers.CharField(source='product_variant.product.name', read_only=True)  # Include product name

    class Meta:
        model = InvoiceItems
        fields = [
            'id',
            'quantity',
            'unit_price',
            'total_price',
            'product_variant',
            'product_name'
        ]

class InvoiceItemCreateSerializer(serializers.ModelSerializer):
    product_variant = serializers.UUIDField(write_only=True)  # Accept ProductVariant UUID

    class Meta:
        model = InvoiceItems
        fields = [
            'quantity',
            'unit_price',
            'total_price',
            'product_variant'  # Use product_variant instead of product
        ]

    def create(self, validated_data):
        product_variant_id = validated_data.pop('product_variant')  # Extract ProductVariant UUID
        try:
            product_variant = ProductVariant.objects.get(id=product_variant_id)  # Resolve ProductVariant
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError({"product_variant": "Product variant not found."})

        invoice = self.context.get('invoice')  # Get the invoice from the context
        return InvoiceItems.objects.create(
            product_variant=product_variant,  # Explicitly link product_variant
            invoice=invoice,
            **validated_data
        )