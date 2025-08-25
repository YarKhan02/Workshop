from rest_framework import serializers
from workshop.models import User, Car

# Serializer for car details
class CarSerializer(serializers.ModelSerializer):
    customer = serializers.UUIDField(source='customer.id')

    class Meta:
        model = Car
        fields = [
            'id',
            'customer',
            'make',
            'model',
            'year',
            'license_plate',
            'color',
        ]

# Serializer for creating a new car
class CarCreateSerializer(serializers.ModelSerializer):

    customer = serializers.UUIDField(write_only=True)
    class Meta:
        model = Car
        fields = [
            'customer',
            'make',
            'model',
            'year',
            'license_plate',
            'color',
        ]

    def create(self, validated_data):
        customer = validated_data.pop('customer')

        try:
            customer = User.objects.get(id=customer)
        except User.DoesNotExist:
            raise serializers.ValidationError({'customer': 'Invalid customer ID'})
        
        if 'license_plate' in validated_data:
            validated_data['license_plate'] = validated_data['license_plate'].upper()
        if 'make' in validated_data:
            validated_data['make'] = validated_data['make'].capitalize()
        if 'model' in validated_data:
            validated_data['model'] = validated_data['model'].capitalize()
        if 'color' in validated_data:
            validated_data['color'] = validated_data['color'].capitalize()

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
            'customer_name',
        ]
        
    def get_customer_name(self, obj):
        first_name = obj.customer.first_name
        last_name = obj.customer.last_name
        return f"{first_name} {last_name}" if first_name and last_name else "No Customer"
    
# Serializer for updating an existing car
class CarUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = [
            'make',
            'model',
            'year',
            'license_plate',
            'color',
        ]