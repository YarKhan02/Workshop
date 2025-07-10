from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from workshop.models.product import Product
from workshop.serializers.product_serializer import ProductSerializer, ProductCreateSerializer

class ProductView(viewsets.ViewSet):
    
    # List all products
    @action(detail = False, methods = ['get'], url_path = 'details')
    def get_details(self, request):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)
    
    # Add a new product
    @action(detail = False, methods = ['post'], url_path = 'add-product')
    def add_product(self, request):
        serializer = ProductCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Product and variant added successfully"}, status=201)
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    # Delete a product by UUID
    @action(detail = True, methods = ['delete'], url_path = 'del-product')
    def delete_product(self, request, pk=None):
        try:
            product = Product.objects.get(uuid=pk)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)   