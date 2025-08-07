# workshop/models/daily_availability.py

import uuid
from django.db import models
from django.core.validators import MinValueValidator
from datetime import date, timedelta


class DailyAvailability(models.Model):
    """
    Daily booking availability - simple slot count per day
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField(unique=True)
    total_slots = models.PositiveIntegerField(default=7, validators=[MinValueValidator(1)])
    available_slots = models.PositiveIntegerField(default=7, validators=[MinValueValidator(0)])
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'daily_availability'
        ordering = ['date']

    def __str__(self):
        return f"{self.date} - {self.available_slots}/{self.total_slots} available"
    
    def has_availability(self):
        """Check if day has available slots"""
        return self.is_available and self.available_slots > 0
    
    def book_slot(self):
        """Reduce available slots by 1 when booking"""
        if self.available_slots > 0:
            self.available_slots -= 1
            self.save(update_fields=['available_slots', 'updated_at'])
            return True
        return False
    
    def cancel_slot(self):
        """Increase available slots by 1 when cancelling"""
        if self.available_slots < self.total_slots:
            self.available_slots += 1
            self.save(update_fields=['available_slots', 'updated_at'])
            return True
        return False
    
    @classmethod
    def create_daily_availability(cls, start_date, days=14, total_slots=7):
        """
        Create daily availability for the next X days
        
        Args:
            start_date: Starting date
            days: Number of days to create (default 14)
            total_slots: Number of slots per day (default 7)
        """
        created_dates = []
        current_date = start_date
        
        for _ in range(days):
            availability, created = cls.objects.get_or_create(
                date=current_date,
                defaults={
                    'total_slots': total_slots,
                    'available_slots': total_slots,
                    'is_available': True
                }
            )
            
            if created:
                created_dates.append(current_date)
            
            current_date += timedelta(days=1)
        
        return created_dates
    
    @classmethod
    def get_available_dates(cls, start_date=None, days=14):
        """
        Get available dates for booking within the next X days
        
        Args:
            start_date: Starting date (default today)
            days: Number of days to check (default 14)
        """
        if start_date is None:
            start_date = date.today()
        
        end_date = start_date + timedelta(days=days)
        
        # Create availability records if they don't exist
        cls.create_daily_availability(start_date, days)
        
        # Get available dates
        available_dates = cls.objects.filter(
            date__gte=start_date,
            date__lt=end_date,
            is_available=True,
            available_slots__gt=0
        ).order_by('date')
        
        return available_dates
    
    @classmethod
    def get_availability_for_period(cls, start_date=None, days=14):
        """
        Get all dates (available and unavailable) for the period
        
        Args:
            start_date: Starting date (default today)
            days: Number of days to check (default 14)
        """
        if start_date is None:
            start_date = date.today()
        
        end_date = start_date + timedelta(days=days)
        
        # Create availability records if they don't exist
        cls.create_daily_availability(start_date, days)
        
        # Get all dates in the period
        all_dates = cls.objects.filter(
            date__gte=start_date,
            date__lt=end_date
        ).order_by('date')
        
        return all_dates
