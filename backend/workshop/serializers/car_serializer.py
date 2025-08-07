from rest_framework import serializers
from workshop.models.customer import Customer
from workshop.models.car import Car

class CarSerializer(serializers.ModelSerializer):
    customer_id = serializers.UUIDField(source='customer.id')

    class Meta:
        model = Car
        fields = [
            'id',
            'customer_id',
            'make',
            'model',
            'year',
            'license_plate',
            'color',
            'vin',
        ]

class CarCreateSerializer(serializers.ModelSerializer):

    customer_id = serializers.UUIDField(write_only=True)
    class Meta:
        model = Car
        fields = [
            'customer_id',
            'make',
            'model',
            'year',
            'license_plate',
            'color',
            'vin',
        ]

    def create(self, validated_data):
        customer_id = validated_data.pop('customer_id')

        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            raise serializers.ValidationError({'customer_id': 'Invalid customer ID'})

        return Car.objects.create(customer=customer, **validated_data)

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
    
class CarUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = [
            'make',
            'model',
            'year',
            'license_plate',
            'color',
            'vin',
        ]