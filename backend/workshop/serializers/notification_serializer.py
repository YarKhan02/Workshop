# workshop/serializers/notification_serializer.py
from rest_framework import serializers
from workshop.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'title',
            'message',
            'notification_type',
            'priority',
            'is_read',
            'created_at',
            'read_at',
            'booking_id',
            'invoice_id'
        ]
        read_only_fields = ['id', 'created_at', 'read_at']
    
    def to_representation(self, instance):
        """Custom representation to format dates"""
        data = super().to_representation(instance)
        
        # Format dates for frontend
        if data['created_at']:
            data['createdAt'] = data['created_at']
        if data['read_at']:
            data['readAt'] = data['read_at']
            
        # Convert snake_case to camelCase for frontend compatibility
        data['notificationType'] = data.pop('notification_type')
        data['isRead'] = data.pop('is_read')
        data['bookingId'] = data.pop('booking_id')
        data['invoiceId'] = data.pop('invoice_id')
        
        return data


class NotificationStatsSerializer(serializers.Serializer):
    """Serializer for notification statistics"""
    total = serializers.IntegerField()
    unread = serializers.IntegerField()
    urgent = serializers.IntegerField()
    booking = serializers.IntegerField()
    payment = serializers.IntegerField()
    system = serializers.IntegerField()


class MarkAsReadSerializer(serializers.Serializer):
    """Serializer for marking notifications as read"""
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="List of notification IDs to mark as read. If empty, marks all as read."
    )
