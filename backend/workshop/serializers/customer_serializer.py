# workshop/serializers.py
from rest_framework import serializers
from workshop.models.customer import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class CustomerDetailSerializer(serializers.ModelSerializer):
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
