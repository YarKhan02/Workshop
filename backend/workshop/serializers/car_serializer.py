from rest_framework import serializers, fields
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

class CarDetailSerializer(serializers.ModelSerializer):
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
        first = obj.customer.first_name if obj.customer.first_name else ''
        last = obj.customer.last_name if obj.customer.last_name else ''
        return f"{first} {last}".strip() if first or last else 'No Customer'