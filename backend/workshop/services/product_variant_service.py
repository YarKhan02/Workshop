# workshop/services/product_variant_service.py
from workshop.models.product_variant import ProductVariant
from workshop.serializers.product_serializer import ProductSerializer

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
            serializer = ProductSerializer(variant)
            return serializer.data, None
        except ProductVariant.DoesNotExist:
            return None, {'error': 'Product variant not found'}

    def create_variant(self, data):
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return {'message': 'Product variant created successfully', 'data': serializer.data}, None
        return None, serializer.errors

    def update_variant(self, pk, data):
        try:
            variant = ProductVariant.objects.get(pk=pk)
            serializer = ProductSerializer(variant, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return {'message': 'Product variant updated successfully', 'data': serializer.data}, None
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
