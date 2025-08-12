# workshop/serializers.py

import uuid

from rest_framework import serializers
from workshop.helper import is_valid_email_domain, is_valid_nic, is_valid_phone_number
from workshop.serializers.car_serializer import CarSerializer
from workshop.models import User

# Customer Creation Serializer
class CustomerCreateSerializer(serializers.ModelSerializer):

    email = serializers.EmailField()
    nic = serializers.CharField(max_length=13, required=True)
    phone_number = serializers.CharField(max_length=11, required=True)
    password = serializers.CharField(write_only=True, min_length=6, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'nic',
            'email',
            'name',
            'phone_number',
            'password',
            'city',
            'state',
            'address',
        ]

    def create(self, validated_data):
        # Extract password if provided
        password = validated_data.pop('password', None)
        
        # Auto-generate a unique username
        base = f"{validated_data['name'].lower().replace(' ', '_')}"
        suffix = uuid.uuid4().hex[:6]
        username = f"{base}_{suffix}"
        
        # Create customer - role will default to 'customer' from model
        customer = User.objects.create(
            username=username,
            **validated_data
        )
        
        # Set password only if provided
        if password:
            customer.set_password(password)
            customer.save()
        
        return customer
    
    def validate(self, attrs):
        # Check if user with this email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        # Check if user with this NIC already exists
        if User.objects.filter(nic=attrs['nic']).exists():
            raise serializers.ValidationError({"nic": "A user with this NIC already exists."})
            
        return attrs

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

# Customer Detail Serializer
class CustomerDetailSerializer(serializers.ModelSerializer):
    cars = CarSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'id',
            'nic',
            'email',
            'username',
            'name',
            'phone_number',
            'city',
            'state',
            'address',
            'date_joined',
            'cars',
        ]

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CustomerInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'phone_number',
        ]

class CustomerStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    returning = serializers.IntegerField()
    new_this_week = serializers.IntegerField()
    new_this_week_percentage = serializers.FloatField()

# Customer Update Serializer
class CustomerUpdateSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=11, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'email',
            'name',
            'phone_number',
            'city',
            'state',
            'address',
        ]

    def validate_phone_number(self, value):
        if value and not is_valid_phone_number(value):
            raise serializers.ValidationError("Phone number must start with 03 and be exactly 11 digits.")
        return value

    def validate_email(self, value):
        # Only check for duplicates if email is being changed
        if self.instance and self.instance.email != value:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        if not is_valid_email_domain(value):
            raise serializers.ValidationError("Please use a valid email provider like Gmail or Outlook.")
        return value

    def update(self, instance, validated_data):
        """
        Update only the allowed fields, never touch NIC or other restricted fields
        """
        # Define allowed fields for update
        allowed_fields = ['email', 'name', 'phone_number', 'city', 'state', 'address']
        
        # Only update fields that are in both validated_data and allowed_fields
        for field in allowed_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        
        instance.save()
        return instance
