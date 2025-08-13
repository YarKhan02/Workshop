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
            'tax_percentage',
            'discount_amount',
            'total_amount',
            'status',
            'created_at',
        ]
    
    def get_items(self, obj):
        """
        Get combined items from both InvoiceItems and Booking services
        """
        combined_items = []
        
        # Get regular invoice items
        invoice_items = obj.items.all()
        for item in invoice_items:
            combined_items.append({
                'id': str(item.id),
                'type': 'product',
                'description': getattr(item.product_variant.product, 'name', 'Product') if hasattr(item, 'product_variant') and item.product_variant and item.product_variant.product else 'Product',
                'product_name': getattr(item.product_variant.product, 'name', 'Product') if hasattr(item, 'product_variant') and item.product_variant and item.product_variant.product else 'Product',
                'product_variant': item.product_variant.variant_name if hasattr(item, 'product_variant') and item.product_variant else 'Default',
                'quantity': item.quantity,
                'unit_price': str(item.unit_price),
                'total_amount': str(item.total_amount),
            })
        
        # Get booking service items
        try:
            booking = getattr(obj, 'bookings', None)
            if booking:
                booking_service = getattr(booking, 'service', None)
                if booking_service:
                    combined_items.append({
                        'id': str(booking_service.id),
                        'type': 'service',
                        'description': f"{booking_service.service.name} - {booking.car.license_plate}",
                        'service_name': booking_service.service.name,
                        'service_description': booking_service.service.description,
                        'car_info': f"{booking.car.make} {booking.car.model} ({booking.car.license_plate})",
                        'scheduled_date': booking.daily_availability.date.isoformat() if booking.daily_availability else None,
                        'quantity': 1,
                        'unit_price': str(booking_service.price),
                        'total_amount': str(booking_service.price),
                        'status': booking_service.status,
                    })
        except AttributeError:
            # No booking data available
            pass
        
        return combined_items

# This serializer is used for creating an invoice with items
class InvoiceCreateSerializer(serializers.ModelSerializer):
    customer_id = serializers.UUIDField(write_only=True)
    items = InvoiceItemCreateSerializer(many=True)
    
    # Accept frontend field names and map them to model fields
    tax = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    
    # Make model fields optional since they'll be populated from frontend fields
    tax_percentage = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = Invoice
        fields = [
            'customer_id',
            'subtotal',
            'tax_percentage', 
            'discount_amount',
            'total_amount',
            'tax',        # Frontend field -> tax_percentage
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
        if 'tax' in data:
            print("Mapping tax to tax_percentage")
            data['tax_percentage'] = data.pop('tax')
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
                tax_percentage=validated_data.get('tax_percentage', 0),
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