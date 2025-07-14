from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from workshop.models.product_variant import ProductVariant
from workshop.models.product import Product
from workshop.serializers.product_serializer import ProductVariantCreateSerializer, VariantStockUpdateSerializer

class ProductVariantView(viewsets.ViewSet):

    # Add a new product variant to an existing product
    @action(detail=True, methods=['post'], url_path='add-variant')
    def add_variant(self, request, pk = None):
        try:
            product = Product.objects.get(uuid=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariantCreateSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response({"message": "Product variant added successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Update an existing product variant
    @action(detail=True, methods=['patch'], url_path='update-variant')
    def update_variant(self, request, pk=None):
        try:
            variant = ProductVariant.objects.get(uuid=pk)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = VariantStockUpdateSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Product variant updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete a product variant
    @action(detail=True, methods=['delete'], url_path='del-variant')
    def delete_variant(self, request, pk=None):
        try:
            variant = ProductVariant.objects.get(uuid=pk)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant not found"}, status=status.HTTP_404_NOT_FOUND)

        variant.delete()
        return Response({"message": "Product variant deleted successfully"}, status=status.HTTP_204_NO_CONTENT) 
