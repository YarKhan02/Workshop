# workshop/services/product_variant_service.py
from workshop.models.product_variant import ProductVariant
from workshop.models.product import Product
from workshop.serializers.product_serializer import ProductVariantSerializer, ProductVariantCreateSerializer

class ProductVariantService:
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

    def create_variant(self, data):
        # Extract product_id from data
        product_id = data.get('product_id')
        if not product_id:
            return None, {'error': 'Product ID is required'}
        
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return None, {'error': 'Product not found'}
        
        # Create variant data without product_id for serializer
        variant_data = {k: v for k, v in data.items() if k != 'product_id'}
        
        serializer = ProductVariantCreateSerializer(data=variant_data)
        if serializer.is_valid():
            variant = serializer.save(product=product)
            response_serializer = ProductVariantSerializer(variant)
            return {'message': 'Product variant created successfully', 'data': response_serializer.data}, None
        return None, serializer.errors

    def update_variant(self, pk, data):
        try:
            variant = ProductVariant.objects.get(pk=pk)
            serializer = ProductVariantCreateSerializer(variant, data=data, partial=True)
            if serializer.is_valid():
                variant = serializer.save()
                response_serializer = ProductVariantSerializer(variant)
                return {'message': 'Product variant updated successfully', 'data': response_serializer.data}, None
            return None, serializer.errors
        except ProductVariant.DoesNotExist:
            return None, {'error': 'Product variant not found'}

    def delete_variant(self, pk):
        try:
            variant = ProductVariant.objects.get(pk=pk)
            variant.delete()
            return {'message': 'Product variant deleted successfully'}, None
        except ProductVariant.DoesNotExist:
            return None, {'error': 'Product variant not found'}
