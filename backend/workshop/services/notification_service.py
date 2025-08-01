# workshop/services/notification_service.py
from workshop.models import Notification
from workshop.serializers import NotificationSerializer, NotificationStatsSerializer, MarkAsReadSerializer
from django.db.models import Q, Count, Case, When, IntegerField
from django.utils import timezone

class NotificationService:
    def get_notifications(self, params, request):
        search = params.get('search', '')
        notification_type = params.get('type', '')
        priority = params.get('priority', '')
        is_read = params.get('is_read', '')
        queryset = Notification.objects.all()
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(message__icontains=search))
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        if priority:
            queryset = queryset.filter(priority=priority)
        if is_read:
            is_read_bool = is_read.lower() == 'true'
            queryset = queryset.filter(is_read=is_read_bool)
        return queryset

    def get_stats(self):
        stats = Notification.objects.aggregate(
            total=Count('id'),
            unread=Count(Case(When(is_read=False, then=1), output_field=IntegerField())),
            urgent=Count(Case(When(priority='urgent', then=1), output_field=IntegerField())),
            booking=Count(Case(When(notification_type='booking', then=1), output_field=IntegerField())),
            payment=Count(Case(When(notification_type='payment', then=1), output_field=IntegerField())),
            system=Count(Case(When(notification_type='system', then=1), output_field=IntegerField()))
        )
        serializer = NotificationStatsSerializer(stats)
        return serializer.data

    def mark_as_read(self, data):
        serializer = MarkAsReadSerializer(data=data)
        if not serializer.is_valid():
            return None, serializer.errors
        notification_ids = serializer.validated_data.get('notification_ids', [])
        if notification_ids:
            updated_count = Notification.objects.filter(id__in=notification_ids, is_read=False).update(is_read=True, read_at=timezone.now())
        else:
            updated_count = Notification.objects.filter(is_read=False).update(is_read=True, read_at=timezone.now())
        return {'message': f'{updated_count} notifications marked as read', 'updated_count': updated_count}, None

    def delete_notification(self, pk):
        try:
            notification = Notification.objects.get(id=pk)
            notification.delete()
            return {'message': 'Notification deleted successfully'}, None
        except Notification.DoesNotExist:
            return None, {'error': 'Notification not found'}
        except Exception as e:
            return None, {'error': str(e)}

    def create_notification(self, data):
        serializer = NotificationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return {'message': 'Notification created successfully', 'data': serializer.data}, None
        return None, serializer.errors
