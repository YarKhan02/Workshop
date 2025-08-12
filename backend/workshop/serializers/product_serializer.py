# serializers/product_serializer.py
from rest_framework import serializers
from workshop.models.product import Product
from workshop.models.product_variant import ProductVariant
from workshop.services.stock_movement_service import StockMovementService
from django.db import transaction

# Serializer for product variants
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'variant_name', 'sku', 'price', 'quantity', 'created_at']
        read_only_fields = ['sku', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'created_at', 'variants']

class ProductVariantCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        exclude = ['product', 'sku']  # product will be linked manually

# Serializer for creating a new product
class ProductCreateSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(write_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'variant']
        read_only_fields = ['id']

    def create(self, validated_data):
        variant_data = validated_data.pop('variant')
        
        with transaction.atomic():
            # Create the product
            product = Product.objects.create(**validated_data)
            
            # Create the variant
            variant = ProductVariant.objects.create(product=product, **variant_data)
            
            # Create initial stock movement if quantity > 0
            initial_quantity = variant_data.get('quantity', 0)
            if initial_quantity > 0:
                # Get user from context if available
                request = self.context.get('request')
                created_by = 'System'
                if request and hasattr(request, 'user'):
                    created_by = getattr(request.user, 'email', 'Anonymous')
                
                # Use the centralized stock movement service
                result, error = StockMovementService.create_initial_stock(
                    product_variant=variant,
                    initial_quantity=initial_quantity,
                    created_by=created_by,
                    reference_id=f"Product_Creation_{product.id}"
                )
                
                if error:
                    # Log the error but don't fail the product creation
                    print(f"Warning: Failed to create initial stock movement: {error}")
            
            return product
    
class VariantStockUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['price', 'quantity']

class ProductInvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name']