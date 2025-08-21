from rest_framework import viewsets, status
from workshop.permissions import IsAdmin
from rest_framework.response import Response
from rest_framework.decorators import action

from workshop.models.product import Product
from workshop.serializers.product_serializer import ProductSerializer, ProductCreateSerializer
from workshop.services.product_service import ProductService

class ProductView(viewsets.ViewSet):
    
    permission_classes = [IsAdmin]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.product_service = ProductService()
    
    # List all products
    @action(detail = False, methods = ['get'], url_path = 'details')
    def get_details(self, request):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)
    
    # Get available product categories
    @action(detail = False, methods = ['get'], url_path = 'categories')
    def get_categories(self, request):
        categories = self.product_service.get_categories(request.query_params)
        return Response(categories)
    
    # Add a new product
    @action(detail = False, methods = ['post'], url_path = 'add-product')
    def add_product(self, request):
        result, errors = self.product_service.create_product(request.data, request=request)
        if result:
            return Response(result, status=status.HTTP_201_CREATED)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete a product by UUID
    @action(detail = True, methods = ['delete'], url_path = 'del-product')
    def delete_product(self, request, pk=None):
        result, errors = self.product_service.delete_product(pk)
        if result:
            return Response(result, status=status.HTTP_204_NO_CONTENT)
        if errors and errors.get('error') == 'Product not found':
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)