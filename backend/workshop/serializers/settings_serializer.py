# workshop/serializers/settings_serializer.py

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from workshop.models.settings import BusinessSettings


class BusinessSettingsSerializer(serializers.ModelSerializer):
    """Serializer for business settings"""
    
    class Meta:
        model = BusinessSettings
        fields = [
            'id',
            'name',
            'address', 
            'phone',
            'email',
            'website',
            'working_hours',
            'currency',
            'timezone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_working_hours(self, value):
        """Validate working hours format"""
        required_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        
        if not isinstance(value, dict):
            raise serializers.ValidationError("Working hours must be a dictionary")
        
        for day in required_days:
            if day not in value:
                raise serializers.ValidationError(f"Missing working hours for {day}")
        
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        """Validate current password"""
        user = self.context['request'].user
        if not authenticate(username=user.email, password=value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate_new_password(self, value):
        """Validate new password strength"""
        user = self.context['request'].user
        validate_password(value, user)
        return value

    def validate(self, data):
        """Validate password confirmation"""
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords do not match")
        
        if data['current_password'] == data['new_password']:
            raise serializers.ValidationError("New password must be different from current password")
        
        return data
