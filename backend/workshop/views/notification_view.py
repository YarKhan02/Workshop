# workshop/views/notification_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, Case, When, IntegerField
from django.utils import timezone

from workshop.permissions.is_admin import IsAdmin
from workshop.services.notification_service import NotificationService


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100


class NotificationView(viewsets.ViewSet):

    permission_classes = [IsAdmin]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.notification_service = NotificationService()

    @action(detail=False, methods=['get'], url_path='list')
    def get_notifications(self, request):
        try:
            queryset = self.notification_service.get_notifications(request.query_params, request)
            paginator = NotificationPagination()
            page = paginator.paginate_queryset(queryset, request)
            if page is not None:
                from workshop.serializers import NotificationSerializer
                serializer = NotificationSerializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)
            from workshop.serializers import NotificationSerializer
            serializer = NotificationSerializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        try:
            result = self.notification_service.get_stats()
            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='mark-read')
    def mark_as_read(self, request):
        result, errors = self.notification_service.mark_as_read(request.data)
        if result:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='delete')
    def delete_notification(self, request, pk=None):
        result, errors = self.notification_service.delete_notification(pk)
        if result:
            return Response(result)
        if errors and errors.get('error') == 'Notification not found':
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='create')
    def create_notification(self, request):
        result, errors = self.notification_service.create_notification(request.data)
        if result:
            return Response(result, status=status.HTTP_201_CREATED)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
