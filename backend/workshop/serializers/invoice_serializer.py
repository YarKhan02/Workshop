from rest_framework import serializers

from workshop.models.product import Product
from workshop.models import User
from workshop.models.invoice_items import InvoiceItems
from workshop.models.product_variant import ProductVariant
from workshop.serializers.invoice_item_serializer import InvoiceItemCreateSerializer, InvoiceItemSerializer
from workshop.models.invoice import Invoice
from workshop.serializers.customer_serializer import CustomerInvoiceSerializer

# Invoice serializer for listing invoices
class InvoiceSerializer(serializers.ModelSerializer):
    customer = CustomerInvoiceSerializer(source='user', read_only=True)
    items = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id',
            'invoice_number',
            'customer',
            'items',
            'subtotal',
            'discount_amount',
            'total_amount',
            'status',
            'created_at',
        ]
    
    def get_items(self, obj):
        """
        Fetch all product items for the booking service related to this invoice, with defensive checks.
        """
        items = []
        booking = getattr(obj, 'bookings', None)
        if not booking:
            return items
        booking_service = getattr(booking, 'service', None)
        if not booking_service:
            return items
        # Add service item (optional, as before)
        try:
            service_obj = getattr(booking_service, 'service', None)
            car_obj = getattr(booking, 'car', None)
            daily_availability = getattr(booking, 'daily_availability', None)
            items.append({
                'id': str(booking_service.id),
                'type': 'service',
                'description': f"{getattr(service_obj, 'name', '')} - {getattr(car_obj, 'license_plate', '')}",
                'service_name': getattr(service_obj, 'name', ''),
                'service_description': getattr(service_obj, 'description', ''),
                'car_info': f"{getattr(car_obj, 'make', '')} {getattr(car_obj, 'model', '')} ({getattr(car_obj, 'license_plate', '')})",
                'scheduled_date': daily_availability.date.isoformat() if daily_availability and hasattr(daily_availability, 'date') else None,
                'quantity': 1,
                'unit_price': str(getattr(booking_service, 'price', '')),
                'total_amount': str(getattr(booking_service, 'price', '')),
                'status': getattr(booking_service, 'status', ''),
            })
        except Exception:
            pass
        # Add all product items linked to this booking service
        try:
            for invoice_item in getattr(booking_service, 'items', []).all() if hasattr(booking_service, 'items') else []:
                pv = getattr(invoice_item, 'product_variant', None)
                items.append({
                    'id': str(getattr(invoice_item, 'id', '')),
                    'type': 'product',
                    'product_variant': str(getattr(pv, 'id', '')),
                    'variant_name': getattr(pv, 'variant_name', ''),
                    'sku': getattr(pv, 'sku', ''),
                    'quantity': float(getattr(invoice_item, 'quantity', 0)),
                    'unit_price': str(getattr(invoice_item, 'unit_price', '')),
                    'total_amount': str(getattr(invoice_item, 'total_amount', '')),
                })
        except Exception:
            pass
        return items

# This serializer is used for creating an invoice with items
class InvoiceCreateSerializer(serializers.ModelSerializer):
    customer_id = serializers.UUIDField(write_only=True)
    items = InvoiceItemCreateSerializer(many=True)
    
    # Accept frontend field names and map them to model fields
    discount = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    
    # Make model fields optional since they'll be populated from frontend fields
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = Invoice
        fields = [
            'customer_id',
            'subtotal',
            'discount_amount',
            'total_amount',
            'discount',   # Frontend field -> discount_amount  
            'grand_total', # Frontend field -> total_amount
            'status',
            'items',
        ]

    def validate(self, data):
        print("=== INVOICE VALIDATE METHOD ===")
        print("Input data:", data)
        print("Data keys:", list(data.keys()))
        
        # Map frontend fields to model fields
        if 'discount' in data:
            print("Mapping discount to discount_amount")
            data['discount_amount'] = data.pop('discount')
        if 'grand_total' in data:
            print("Mapping grand_total to total_amount")
            data['total_amount'] = data.pop('grand_total')
        
        print("Output data after mapping:", data)
        print("=== END VALIDATE ===")
        return data

    def create(self, validated_data):
        # Extract items data and customer_id
        items_data = validated_data.pop('items')
        customer_id = validated_data.pop('customer_id')

        # Get the customer
        try:
            customer = User.objects.get(id=customer_id, role=User.Role.customer)
        except User.DoesNotExist:
            raise serializers.ValidationError({"customer_id": "Customer not found."})

        # Step 1: Create the invoice first
        try:
            invoice = Invoice.objects.create(
                user=customer,
                subtotal=validated_data.get('subtotal', 0),
                discount_amount=validated_data.get('discount_amount', 0),
                total_amount=validated_data.get('total_amount', 0),
                status=validated_data.get('status', 'pending')
            )
            print(f"Created invoice: {invoice}")
        except Exception as e:
            print(f"Error creating invoice: {e}")
            raise serializers.ValidationError({"invoice": f"Error creating invoice: {str(e)}"})

        # Step 2: Create invoice items
        for item_data in items_data:
            try:
                # Map total_price to total_amount for each item
                if 'total_price' in item_data:
                    item_data['total_amount'] = item_data.pop('total_price')
                
                # Get the product variant
                product_variant = ProductVariant.objects.get(id=item_data['product_variant'])
                
                # Create the invoice item
                item = InvoiceItems.objects.create(
                    invoice=invoice,
                    product_variant=product_variant,
                    quantity=item_data['quantity'],
                    unit_price=item_data.get('unit_price', product_variant.price),
                    total_amount=item_data.get('total_amount', 0)
                )
                print(f"Created item: {item}")
            except Exception as e:
                print(f"Error creating item: {e}")
                raise serializers.ValidationError({"items": f"Error creating item: {str(e)}"})

        return invoice