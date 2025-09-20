# workshop/serializers.py

import uuid

from rest_framework import serializers
from workshop.helper import is_valid_email_domain, is_valid_phone_number
from workshop.serializers.car_serializer import CarSerializer
from workshop.models import User

# Customer Creation Serializer
class CustomerCreateSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=11, required=True)
    password = serializers.CharField(write_only=True, min_length=6, required=False, allow_blank=True)
    name = serializers.CharField(max_length=255, required=True, write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email',
            'name',
            'phone_number',
            'password',
        ]

    def create(self, validated_data):
        # Extract password if provided
        password = validated_data.pop('password', None)
        
        # Handle email - use empty string if not provided (temporary fix for NOT NULL constraint)
        if 'email' not in validated_data or not validated_data.get('email'):
            validated_data['email'] = ''  # Use empty string instead of None
        
        try:
            # Create customer - role will default to 'customer' from model
            customer = User.objects.create(
                **validated_data
            )
            
            # Set password only if provided
            if password:
                customer.set_password(password)
                customer.save()
            
            return customer
        except Exception as e:
            print(f"Error creating customer: {str(e)}")
            raise
    
    def validate(self, attrs):
        # Check if user with this email already exists (only if email is provided)
        email = attrs.get('email')
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        return attrs

    def validate_email(self, value):
        # Skip validation if email is empty or None
        if not value:
            return value
        if not is_valid_email_domain(value):
            raise serializers.ValidationError("Please use a valid email provider like Gmail or Outlook.")
        return value
    
    def validate_phone_number(self, value):
        if not is_valid_phone_number(value):
            raise serializers.ValidationError("Phone number must start with 03 and be exactly 11 digits.")
        return value
    
    def validate_name(self, value):
        # Automatically convert name to title case (capitalize first letter of each word)
        return value.title() if value else value

# Customer Detail Serializer
class CustomerDetailSerializer(serializers.ModelSerializer):
    cars = CarSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'phone_number',
            'date_joined',
            'cars',
        ]

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# Customer Invoice Serializer
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

# Customer Update Serializer
class CustomerUpdateSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=11, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'email',
            'name',
            'phone_number',
        ]

    def validate_phone_number(self, value):
        if value and not is_valid_phone_number(value):
            raise serializers.ValidationError("Phone number must start with 03 and be exactly 11 digits.")
        return value

    def validate_email(self, value):
        # Skip validation if email is empty or None
        if not value:
            return value
        # Only check for duplicates if email is being changed
        if self.instance and self.instance.email != value:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        if not is_valid_email_domain(value):
            raise serializers.ValidationError("Please use a valid email provider like Gmail or Outlook.")
        return value
    
    def validate_name(self, value):
        # Automatically convert name to title case (capitalize first letter of each word)
        return value.title() if value else value

    def update(self, instance, validated_data):
        # Define allowed fields for update
        allowed_fields = ['email', 'name', 'phone_number', 'city', 'state', 'address']
        
        # Only update fields that are in both validated_data and allowed_fields
        for field in allowed_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        
        instance.save()
        return instance
