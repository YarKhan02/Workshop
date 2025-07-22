# workshop/views/service_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.models.booking import Service
from workshop.serializers.booking_serializer import (
    ServiceSerializer, ServiceListSerializer
)


class ServiceView(viewsets.ViewSet):
    """
    ViewSet for managing services
    """
    
    @action(detail=False, methods=['get'], url_path='list')
    def get_services(self, request):
        """
        Get list of all active services
        GET: /services/list/
        """
        queryset = Service.objects.filter(is_active=True).order_by('category', 'name')
        
        # Filter by category if provided
        category = request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        serializer = ServiceListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='details')
    def get_service_details(self, request):
        """
        Get detailed service information
        GET: /services/details/
        """
        queryset = Service.objects.filter(is_active=True)
        serializer = ServiceSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='detail')
    def get_service_detail(self, request, pk=None):
        """
        Get single service detail
        GET: /services/{id}/detail/
        """
        try:
            service = Service.objects.get(pk=pk, is_active=True)
            serializer = ServiceSerializer(service)
            return Response(serializer.data)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
