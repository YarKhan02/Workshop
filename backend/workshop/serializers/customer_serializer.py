# workshop/serializers.py

import uuid

from rest_framework import serializers
from workshop.helper import is_valid_email_domain, is_valid_nic, is_valid_phone_number
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
            'nic',
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

class CustomerStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    returning = serializers.IntegerField()
    new_this_week = serializers.IntegerField()
    new_this_week_percentage = serializers.FloatField()

class CustomerCreateSerializer(serializers.ModelSerializer):

    email = serializers.EmailField()
    nic = serializers.CharField(max_length=13, required=True)
    phone_number = serializers.CharField(max_length=11, required=True)
    class Meta:
        model = Customer
        fields = [
            'nic',
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
    
    def validate_email(self, value):
        if not is_valid_email_domain(value):
            raise serializers.ValidationError("Please use a valid email provider like Gmail or Outlook.")
        return value
    
    def validate_nic(self, value):
        if not is_valid_nic(value):
            raise serializers.ValidationError("NIC must be exactly 13 numeric digits without dashes.")
        return value
    
    def validate_phone_number(self, value):
        if not is_valid_phone_number(value):
            raise serializers.ValidationError("Phone number must start with 03 and be exactly 11 digits.")
        return value

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
