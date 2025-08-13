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
            'total_amount',  # Use model field name
            'product_variant',
            'product_name'
        ]

class InvoiceItemCreateSerializer(serializers.ModelSerializer):
    product_variant = serializers.UUIDField(write_only=True)  # Accept ProductVariant UUID
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)  # Frontend field

    class Meta:
        model = InvoiceItems
        fields = [
            'quantity',
            'unit_price',
            'total_amount',  # Model field
            'total_price',   # Frontend field -> total_amount
            'product_variant'
        ]

    def validate(self, data):
        # Map frontend total_price to model total_amount
        if 'total_price' in data:
            data['total_amount'] = data.pop('total_price')
        return data

    def create(self, validated_data):
        product_variant_id = validated_data.pop('product_variant')  # Extract ProductVariant UUID
        try:
            product_variant = ProductVariant.objects.get(id=product_variant_id)  # Resolve ProductVariant
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError({"product_variant": "Product variant not found."})

        # Get unit_price from ProductVariant
        unit_price = product_variant.price
        
        invoice = self.context.get('invoice')  # Get the invoice from the context
        return InvoiceItems.objects.create(
            product_variant=product_variant,  # Link to ProductVariant
            invoice=invoice,  # Link to Invoice
            unit_price=unit_price,  # Set from ProductVariant
            **validated_data  # quantity and total_amount
            # total_amount calculation is handled in validate() method
        )