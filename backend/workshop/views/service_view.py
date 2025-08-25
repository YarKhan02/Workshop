# workshop/views/service_view.py
from rest_framework import viewsets, status
from workshop.permissions import IsAdmin
from rest_framework.decorators import action
from rest_framework.response import Response

import json

from workshop.models import Service, ServiceItem
from workshop.serializers.booking_serializer import (
    ServiceSerializer, ServiceCreateSerializer
)


class ServiceView(viewsets.ViewSet):

    # Define permissions for each action
    def get_permissions(self):
        if self.action in ['get_services', 'get_service_detail']:  
            permission_classes = []
        else:
            permission_classes = [IsAdmin]
        return [perm() for perm in permission_classes]

    
    # List all services (both active and inactive for admin)
    def list(self, request):
        queryset = Service.objects.all().order_by('category', 'name')
        
        # Filter by category if provided
        category = request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by status if provided
        is_active = request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        serializer = ServiceSerializer(queryset, many=True)
        return Response(serializer.data)

    
    # List all active services (for public/booking use)
    @action(detail=False, methods=['get'], url_path='list')
    def get_services(self, request):
        queryset = Service.objects.filter(is_active=True).order_by('category', 'name')
        
        # Filter by category if provided
        category = request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        serializer = ServiceSerializer(queryset, many=True)
        return Response(serializer.data)

    
    # Get single service detail
    @action(detail=True, methods=['get'], url_path='detail')
    def get_service_detail(self, request, pk=None):
        try:
            # For admin, allow viewing inactive services too
            service = Service.objects.get(pk=pk)
            serializer = ServiceSerializer(service)
            return Response(serializer.data)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    
    # Add a new service
    @action(detail=False, methods=['post'], url_path='add')
    def add_service(self, request):
        serializer = ServiceCreateSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            response_serializer = ServiceCreateSerializer(service)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    # Update service
    def update(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
            serializer = ServiceCreateSerializer(service, data=request.data, partial=True)
            if serializer.is_valid():
                # Handle items update separately
                items_data = request.data.get('items', [])
                
                # Update service basic info
                service.name = serializer.validated_data.get('name', service.name)
                service.description = serializer.validated_data.get('description', service.description)
                service.category = serializer.validated_data.get('category', service.category)
                service.price = serializer.validated_data.get('price', service.price)
                service.is_active = serializer.validated_data.get('is_active', service.is_active)
                service.save()
                
                # Update items if provided
                if items_data:
                    # Clear existing items
                    service.items.all().delete()
                    # Add new items
                    for item_data in items_data:
                        ServiceItem.objects.create(service=service, name=item_data['name'])
                
                response_serializer = ServiceSerializer(service)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    # Toggle service status
    @action(detail=True, methods=['patch'], url_path='toggle-status')
    def toggle_status(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
            service.is_active = not service.is_active
            service.save()
            serializer = ServiceSerializer(service)
            return Response(serializer.data)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    # Delete service
    def destroy(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
            service.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    # Get service statistics
    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        total = Service.objects.count()
        active = Service.objects.filter(is_active=True).count()
        inactive = total - active
        categories = Service.objects.values('category').distinct().count()
        
        return Response({
            'total': total,
            'active': active,
            'inactive': inactive,
            'categories': categories,
        })
