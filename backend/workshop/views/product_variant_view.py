
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from workshop.services.product_variant_service import ProductVariantService



class ProductVariantView(viewsets.ViewSet):
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.product_variant_service = ProductVariantService()

    @action(detail=True, methods=['post'], url_path='add-variant')
    def add_variant(self, request, pk=None):
        result, errors = self.product_variant_service.create_variant({**request.data, 'product_id': pk})
        if result:
            return Response(result, status=status.HTTP_201_CREATED)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='update-variant')
    def update_variant(self, request, pk=None):
        result, errors = self.product_variant_service.update_variant(pk, request.data)
        if result:
            return Response(result, status=status.HTTP_200_OK)
        if errors and errors.get('error') == 'Product variant not found':
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='del-variant')
    def delete_variant(self, request, pk=None):
        result, errors = self.product_variant_service.delete_variant(pk)
        if result:
            return Response(result, status=status.HTTP_204_NO_CONTENT)
        if errors and errors.get('error') == 'Product variant not found':
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
