from rest_framework import serializers

from workshop.models.product import Product
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
    customer_id = serializers.UUIDField(write_only=True)
    items = InvoiceItemCreateSerializer(many=True)

    class Meta:
        model = Invoice
        fields = [
            'customer_id',
            'total_amount',
            'tax',
            'discount',
            'grand_total',
            'status',
            'due_date',
            'items',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer_id = validated_data.pop('customer_id')

        # Resolve the customer UUID to a Customer object
        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            raise serializers.ValidationError({"customer_id": "Customer not found."})

        # Create the invoice
        invoice = Invoice.objects.create(customer=customer, **validated_data)

        # Create invoice items
        for item_data in items_data:
            item_serializer = InvoiceItemCreateSerializer(data=item_data, context={'invoice': invoice})
            item_serializer.is_valid(raise_exception=True)
            item_serializer.save()

        return invoice