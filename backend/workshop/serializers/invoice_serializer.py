from rest_framework import serializers

from workshop.models.customer import Customer
from workshop.models.invoice_items import InvoiceItems
from workshop.models.product_variant import ProductVariant
from workshop.serializers.invoice_item_serializer import InvoiceItemCreateSerializer, InvoiceItemSerializer
from workshop.models.invoice import Invoice
from workshop.serializers.customer_serializer import CustomerInvoiceSerializer

# Invoice serializer for listing invoices
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

# This serializer is used for creating an invoice with items
class InvoiceCreateSerializer(serializers.ModelSerializer):
    customer = serializers.UUIDField(write_only=True)
    items = InvoiceItemCreateSerializer(many=True)

    class Meta:
        model = Invoice
        fields = [
            'customer',
            'total_amount',
            'tax',
            'discount',
            'grand_total',
            'status',
            'invoice_number',
            'items',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer = validated_data.pop('customer')

        customer = Customer.objects.get(id=customer)
        invoice = Invoice.objects.create(customer=customer, **validated_data)

        for item_data in items_data:
            product_variant_id = item_data.pop('product_variant_uuid')
            product_variant = ProductVariant.objects.get(id=product_variant_id)

            InvoiceItems.objects.create(
                invoice=invoice,
                product_variant_uuid=product_variant,
                **item_data
            )

        return invoice