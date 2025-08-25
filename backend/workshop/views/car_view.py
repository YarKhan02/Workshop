# views/car_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.permissions import IsAdmin, IsCustomer
from workshop.services.car_service import CarService
from workshop.models.car import Car
from workshop.serializers.car_serializer import CarSerializer


class CarView(viewsets.ViewSet):

    def get_permissions(self):
        if self.action in ['cars_by_customer', 'add_car']:
            permission_classes = [IsAdmin | IsCustomer]
        else:
            permission_classes = [IsAdmin]
        return [perm() for perm in permission_classes]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.car_service = CarService()

    
    # Get car details
    @action(detail=False, methods=['get'], url_path='details')
    def car_details(self, request):
        result = self.car_service.get_all_cars()
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    
    @action(detail=False, methods=['get'], url_path='with-customer')
    def car_with_customer_name(self, request):
        result = self.car_service.get_cars_with_customer()
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    
    @action(detail=False, methods=['get'], url_path='by-customer')
    def cars_by_customer(self, request):
        result = self.car_service.get_cars_by_customer(request.query_params.get('customer_id', ''))
        if 'error' in result:
            if result['error'] == 'customer_id query parameter is required':
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    
    # Add a new car
    @action(detail=False, methods=['post'], url_path='add-car')
    def add_car(self, request):
        result = self.car_service.add_car(request.data)
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_201_CREATED)

    
    # Update an existing car
    @action(detail=True, methods=['patch'], url_path='update')
    def update_car(self, request, pk=None):
        result = self.car_service.update_car(pk, request.data)
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)
        