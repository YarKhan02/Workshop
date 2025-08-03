# workshop/serializers.py

import uuid

from rest_framework import serializers
from workshop.serializers.car_serializer import CarSerializer
from workshop.models.customer import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class CustomerInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'phone_number',
        ]

class CustomerDetailSerializer(serializers.ModelSerializer):
    cars = CarSerializer(many=True, read_only=True)
    class Meta:
        model = Customer
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'phone_number',
            'city',
            'state',
            'address',
            'date_joined',
            'cars',
        ]

class CustomerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'city',
            'state',
            'address',
        ]

    def create(self, validated_data):
        # Auto-generate a unique username
        base = f"{validated_data['first_name'].lower()}{validated_data['last_name'].lower()}"
        suffix = uuid.uuid4().hex[:6]
        username = f"{base}_{suffix}"
        
        customer = Customer.objects.create(
            username=username,
            **validated_data
        )
        return customer

class CustomerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'city',
            'state',
            'address',
        ]
