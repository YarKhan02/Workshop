# workshop/models/settings.py

import uuid
from django.db import models
from django.core.validators import EmailValidator

from workshop.models import User


class BusinessSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, default='Detailing Hub')
    address = models.TextField(blank=True)
    city = models.CharField(max_length=25, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(validators=[EmailValidator()], blank=True)
    password = models.CharField(max_length=128, blank=True)  # For admin use
    website = models.URLField(blank=True)
    
    # Working hours stored as JSON
    working_hours = models.JSONField(default=dict, help_text="Working hours for each day")
    
    # Regional settings
    currency = models.CharField(
        max_length=3,
        choices=[('PKR', 'Pakistani Rupee'), ('USD', 'US Dollar')],
        default='PKR'
    )
    timezone = models.CharField(max_length=50, default='Asia/Karachi')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'business_settings'
        verbose_name = 'Business Settings'
        verbose_name_plural = 'Business Settings'

    def __str__(self):
        return f"Business Settings - {self.name}"

    @classmethod
    def get_settings(cls):
        """Get or create business settings (singleton pattern)"""
        settings, created = cls.objects.get_or_create(
            id=uuid.UUID('00000000-0000-0000-0000-000000000001'),
            defaults={
                'name': 'Detailing Hub',
                'address': '176-C Al-Murtaza Commercial Lane 3, DHA Phase 8',
                'city': 'Karachi, Pakistan 75500',
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
                'timezone': 'Asia/Karachi'
            }
        )
        return settings
