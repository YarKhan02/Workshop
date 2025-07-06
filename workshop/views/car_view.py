from rest_framework import viewsets

from workshop.models.car import Car
from workshop.serializers.car_serializer import CarSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer