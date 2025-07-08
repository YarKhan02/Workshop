from rest_framework import serializers
from workshop.models.car import Car

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = [
            'id',
            'make',
            'model',
            'year',
            'license_plate',
            'color',
            'vin',
        ]
