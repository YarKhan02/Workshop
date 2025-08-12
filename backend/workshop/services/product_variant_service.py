# workshop/services/product_variant_service.py
from django.db import transaction
from workshop.models.product_variant import ProductVariant
from workshop.models.product import Product
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