# workshop/views/settings_view.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from workshop.permissions import IsAdmin
from workshop.models.settings import BusinessSettings
from workshop.serializers.settings_serializer import (
    BusinessSettingsSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


class SettingsView(viewsets.ViewSet):
    # permission_classes = [IsAdmin]

    # Get business settings
    @action(detail=False, methods=['get'], url_path='data')
    def get_business_settings(self, request):
        """Get business settings"""
        try:
            settings = BusinessSettings.get_settings()
            serializer = BusinessSettingsSerializer(settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {'error': f'Failed to fetch business settings: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Update business settings
    @action(detail=False, methods=['patch'], url_path='update')
    def update_business_settings(self, request):
        """Update business settings"""
        try:
            settings = BusinessSettings.get_settings()
            serializer = BusinessSettingsSerializer(settings, data=request.data, partial=True)
            
            if serializer.is_valid():
                # Update the updated_by field
                serializer.validated_data['updated_by'] = request.user
                updated_settings = serializer.save()
                
                return Response(
                    {
                        'message': 'Business settings updated successfully',
                        'data': BusinessSettingsSerializer(updated_settings).data
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Invalid data', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': f'Failed to update business settings: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Change user password
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """Change user password"""
        try:
            print(f"Password change request data: {request.data}")
            print(f"Current user: {request.user}")
            print(f"User authenticated: {request.user.is_authenticated}")
            
            serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                user = request.user
                new_password = serializer.validated_data['new_password']
                
                # Set the new password
                user.set_password(new_password)
                user.save()
                
                return Response(
                    {'message': 'Password changed successfully'},
                    status=status.HTTP_200_OK
                )
            else:
                print(f"Serializer validation errors: {serializer.errors}")
                return Response(
                    {'error': 'Invalid data', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': f'Failed to change password: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], url_path='reset-business')
    def reset_business_settings(self, request):
        """Reset business settings to defaults"""
        try:
            settings = BusinessSettings.get_settings()
            
            # Reset to default values
            defaults = {
                'name': 'Detailing Hub',
                'address': '123 Main Street, City, State 12345',
                'phone': '+923001234567',
                'email': 'admin@detailinghubpk.com',
                'website': 'https://detailinghubpk.com',
                'working_hours': {
                    'monday': '8:00 AM - 8:00 PM',
                    'tuesday': '8:00 AM - 8:00 PM',
                    'wednesday': '8:00 AM - 8:00 PM',
                    'thursday': '8:00 AM - 8:00 PM',
                    'friday': '8:00 AM - 8:00 PM',
                    'saturday': '8:00 AM - 6:00 PM',
                    'sunday': 'Closed'
                },
                'currency': 'PKR',
                'timezone': 'Asia/Karachi',
                'updated_by': request.user
            }
            
            serializer = BusinessSettingsSerializer(settings, data=defaults, partial=True)
            if serializer.is_valid():
                updated_settings = serializer.save()
                return Response(
                    {
                        'message': 'Business settings reset to defaults successfully',
                        'data': BusinessSettingsSerializer(updated_settings).data
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Failed to reset settings', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': f'Failed to reset business settings: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
