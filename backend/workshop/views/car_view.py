# views/car_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models.car import Car
from ..serializers.car_serializer import CarSerializer 

class CarView(viewsets.ViewSet):

    @action(detail = False, methods = ['get'], url_path = 'details')
    def car_details(self, request):
        queryset = Car.objects.all()
        serializer = CarSerializer(queryset, many = True)
        return Response(serializer.data)
        