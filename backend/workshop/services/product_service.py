# workshop/services/product_service.py
from workshop.models.product import Product
from workshop.serializers.product_serializer import ProductSerializer, ProductCreateSerializer

class ProductService:
    def get_products(self, params):
        queryset = Product.objects.all()
        search = params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

    def get_product_detail(self, pk):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)
            return serializer.data, None
        except Product.DoesNotExist:
            return None, {'error': 'Product not found'}

    def create_product(self, data):
        serializer = ProductCreateSerializer(data=data)
        if serializer.is_valid():
            product = serializer.save()
            # Return the created product with variants
            response_serializer = ProductSerializer(product)
            return {'message': 'Product created successfully', 'data': response_serializer.data}, None
        return None, serializer.errors

    def update_product(self, pk, data):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return {'message': 'Product updated successfully', 'data': serializer.data}, None
            return None, serializer.errors
        except Product.DoesNotExist:
            return None, {'error': 'Product not found'}

    def delete_product(self, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return {'message': 'Product deleted successfully'}, None
        except Product.DoesNotExist:
            return None, {'error': 'Product not found'}
