# workshop/views/notification_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, Case, When, IntegerField
from django.utils import timezone

from workshop.models import Notification
from workshop.serializers import (
    NotificationSerializer,
    NotificationStatsSerializer,
    MarkAsReadSerializer
)


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100


class NotificationView(viewsets.ViewSet):
    """
    ViewSet for notification-related operations
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='list')
    def get_notifications(self, request):
        """
        Get paginated list of notifications with optional filtering
        """
        try:
            # Get query parameters
            search = request.GET.get('search', '')
            notification_type = request.GET.get('type', '')
            priority = request.GET.get('priority', '')
            is_read = request.GET.get('is_read', '')
            
            # Base queryset - get all notifications (or user-specific if needed)
            queryset = Notification.objects.all()
            
            # Apply filters
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) | 
                    Q(message__icontains=search)
                )
            
            if notification_type:
                queryset = queryset.filter(notification_type=notification_type)
                
            if priority:
                queryset = queryset.filter(priority=priority)
                
            if is_read:
                is_read_bool = is_read.lower() == 'true'
                queryset = queryset.filter(is_read=is_read_bool)
            
            # Apply pagination
            paginator = NotificationPagination()
            page = paginator.paginate_queryset(queryset, request)
            
            if page is not None:
                serializer = NotificationSerializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)
            
            # If no pagination
            serializer = NotificationSerializer(queryset, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        """
        Get notification statistics
        """
        try:
            # Calculate stats
            stats = Notification.objects.aggregate(
                total=Count('id'),
                unread=Count(Case(When(is_read=False, then=1), output_field=IntegerField())),
                urgent=Count(Case(When(priority='urgent', then=1), output_field=IntegerField())),
                booking=Count(Case(When(notification_type='booking', then=1), output_field=IntegerField())),
                payment=Count(Case(When(notification_type='payment', then=1), output_field=IntegerField())),
                system=Count(Case(When(notification_type='system', then=1), output_field=IntegerField()))
            )
            
            serializer = NotificationStatsSerializer(stats)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='mark-read')
    def mark_as_read(self, request):
        """
        Mark notifications as read
        """
        try:
            serializer = MarkAsReadSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            notification_ids = serializer.validated_data.get('notification_ids', [])
            
            if notification_ids:
                # Mark specific notifications as read
                updated_count = Notification.objects.filter(
                    id__in=notification_ids,
                    is_read=False
                ).update(
                    is_read=True,
                    read_at=timezone.now()
                )
            else:
                # Mark all notifications as read
                updated_count = Notification.objects.filter(
                    is_read=False
                ).update(
                    is_read=True,
                    read_at=timezone.now()
                )
            
            return Response({
                'message': f'{updated_count} notifications marked as read',
                'updated_count': updated_count
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'], url_path='delete')
    def delete_notification(self, request, pk=None):
        """
        Delete a specific notification
        """
        try:
            notification = Notification.objects.get(id=pk)
            notification.delete()
            
            return Response({
                'message': 'Notification deleted successfully'
            })
            
        except Notification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='create')
    def create_notification(self, request):
        """
        Create a new notification (for admin/system use)
        """
        try:
            serializer = NotificationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Notification created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
