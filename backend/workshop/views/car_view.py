# views/car_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models.car import Car
from ..serializers.car_serializer import CarSerializer, CarDetailSerializer

class CarView(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='details')
    def car_details(self, request):
        """
        Basic car details without customer info.
        """
        queryset = Car.objects.all()
        serializer = CarSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='with-customer')
    def car_with_customer_name(self, request):
        """
        Car details including only the customer name.
        """
        queryset = Car.objects.select_related('customer').all()
        serializer = CarDetailSerializer(queryset, many=True)
        return Response(serializer.data)