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

class DetailSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

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
            'customer_name',
        ]
        
    def get_customer_name(self, obj):
        first_name = obj.customer.first_name
        last_name = obj.customer.last_name
        return f"{first_name} {last_name}" if first_name and last_name else "No Customer"