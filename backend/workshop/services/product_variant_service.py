# workshop/services/product_variant_service.py
from django.db import transaction
from workshop.models import ProductVariant, Product, BookingService, InvoiceItems
from workshop.serializers.product_serializer import ProductVariantSerializer, ProductVariantCreateSerializer
from workshop.services.stock_movement_service import StockMovementService

class ProductVariantService:

    # Get all product variants
    def get_variants(self, params):
        queryset = ProductVariant.objects.all()
        product_id = params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    
    def get_variant_detail(self, pk):
        try:
            variant = ProductVariant.objects.get(pk=pk)
            serializer = ProductVariantSerializer(variant)
            return serializer.data, None
        except ProductVariant.DoesNotExist:
            return None, {'error': 'Product variant not found'}

    
    # Create a new product variant
    def create_variant(self, data, created_by="System"):
        product_id = data.get('product_id')
        if not product_id:
            return None, {'error': 'Product ID is required'}
        
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return None, {'error': 'Product not found'}
        
        variant_data = {k: v for k, v in data.items() if k != 'product_id'}
        
        serializer = ProductVariantCreateSerializer(data=variant_data)
        if serializer.is_valid():
            with transaction.atomic():
                variant = serializer.save(product=product)
                
                # Create initial stock movement if quantity is provided
                initial_quantity = variant_data.get('quantity', 0)
                if initial_quantity > 0:
                    movement, error = StockMovementService.create_initial_stock(
                        product_variant=variant,
                        initial_quantity=initial_quantity,
                        created_by=created_by,
                        reference_id=f"Variant_Creation_{variant.id}"
                    )
                    if error:
                        print(f"Warning: {error}")
                
                response_serializer = ProductVariantSerializer(variant)
                return {'message': 'Product variant created successfully', 'data': response_serializer.data}, None
        return None, serializer.errors

    
    # Update an existing product variant
    def update_variant(self, pk, data, updated_by="System"):
        try:
            variant = ProductVariant.objects.get(pk=pk)
            
            # Store the original quantity before update
            original_quantity = variant.quantity
            
            serializer = ProductVariantCreateSerializer(variant, data=data, partial=True)
            if serializer.is_valid():
                with transaction.atomic():
                    # Save the updated variant
                    updated_variant = serializer.save()
                    
                    # Check if quantity was changed and track it
                    new_quantity = updated_variant.quantity
                    
                    if original_quantity != new_quantity:
                        movement, error = StockMovementService.track_quantity_change(
                            product_variant=updated_variant,
                            old_quantity=original_quantity,
                            new_quantity=new_quantity,
                            reason='ADJUSTMENT',
                            reference_id=f"Variant_Update_{pk}",
                            updated_by=updated_by
                        )
                        if error:
                            print(f"Warning: {error}")
                    
                    response_serializer = ProductVariantSerializer(updated_variant)
                    return {'message': 'Product variant updated successfully', 'data': response_serializer.data}, None
            
            return None, serializer.errors
        except ProductVariant.DoesNotExist:
            return None, {'error': 'Product variant not found'}
        except Exception as e:
            return None, {'error': f'Error updating variant: {str(e)}'}


    # Delete an existing product variant
    def delete_variant(self, pk):
        try:
            variant = ProductVariant.objects.get(pk=pk)
            variant.delete()
            return {'message': 'Product variant deleted successfully'}, None
        except ProductVariant.DoesNotExist:
            return None, {'error': 'Product variant not found'}
        

    # Add a product variant to a booking
    def add_variant_to_booking(self, data):
        from decimal import Decimal
        booking_id = data.get("booking_id")
        items = data.get("items", [])
        if not booking_id or not items:
            return None, {'error': 'Booking ID and at least one item are required'}

        # Search for the booking service by booking id
        booking_service_obj = BookingService.objects.filter(booking_id=booking_id).first()
        if not booking_service_obj:
            return None, {'error': 'Booking Service not found'}
        booking_service_id = booking_service_obj.id

        print(booking_service_id)

        created_invoice_item_ids = []
        stock_errors = []
        with transaction.atomic():
            for item in items:
                variant_id = item.get("product_variant")
                unit_price = item.get("unit_price")
                quantity = item.get("quantity")
                print(f"Processing item - Variant ID: {variant_id}, Unit Price: {unit_price}, Quantity: {quantity}")
                if not variant_id or unit_price is None or quantity is None:
                    continue  # skip invalid items
                try:
                    variant = ProductVariant.objects.get(pk=variant_id)
                except ProductVariant.DoesNotExist:
                    continue  # skip if variant not found

                # Decrease the product variant quantity and create a stock movement
                result, error = StockMovementService.create_sale_movement(
                    product_variant=variant,
                    sold_quantity=quantity,
                    reference_id=f"BookingService-{booking_service_id}",
                    sold_by="system"
                )

                print(f"Stock movement created: {result}")

                if error:
                    stock_errors.append({"variant_id": str(variant_id), "error": error})
                    continue
                invoice_item = InvoiceItems.objects.create(
                    booking_service=booking_service_obj,
                    product_variant=variant,
                    unit_price=unit_price,
                    quantity=quantity
                )
                created_invoice_item_ids.append(str(invoice_item.id))

            # After all items are created, recalculate product_items_price for the booking service
            all_items = booking_service_obj.items.all()
            product_items_price = sum((item.unit_price * item.quantity for item in all_items), Decimal(0))
            booking_service_obj.product_items_price = product_items_price
            booking_service_obj.save(update_fields=["product_items_price"])

            # Also update the invoice's subtotal and total_amount (subtotal - discount_amount)
            booking = getattr(booking_service_obj, 'booking', None)
            invoice = getattr(booking, 'invoice', None) if booking else None
            if invoice:
                subtotal = booking_service_obj.price + product_items_price
                invoice.subtotal = subtotal
                discount = invoice.discount_amount if invoice.discount_amount else 0
                invoice.total_amount = subtotal - discount
                invoice.save(update_fields=["subtotal", "total_amount"])

        if not created_invoice_item_ids:
            return None, {'error': 'No valid invoice items were created', 'stock_errors': stock_errors}

        return {
            'message': 'Product variants added to booking and invoice items created successfully',
            'booking_service_id': str(booking_service_id),
            'invoice_item_ids': created_invoice_item_ids,
            'stock_errors': stock_errors,
            'product_items_price': str(product_items_price) if 'product_items_price' in locals() else None
        }, None