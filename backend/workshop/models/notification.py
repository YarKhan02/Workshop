# workshop/models/notification.py
from django.db import models
from django.conf import settings
from django.utils import timezone


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('booking', 'Booking'),
        ('payment', 'Payment'),
        ('system', 'System'),
        ('reminder', 'Reminder'),
        ('alert', 'Alert'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20, 
        choices=NOTIFICATION_TYPES, 
        default='system'
    )
    priority = models.CharField(
        max_length=20, 
        choices=PRIORITY_CHOICES, 
        default='normal'
    )
    is_read = models.BooleanField(default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(default=timezone.now)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Optional: Link to related objects (using CharField to store UUID strings)
    booking_id = models.CharField(max_length=36, null=True, blank=True)
    invoice_id = models.CharField(max_length=36, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} - {self.notification_type}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()
