import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from workshop.models import Car, User, Invoice, DailyAvailability

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relationships
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, null=True, blank=True, related_name='bookings')
    daily_availability = models.ForeignKey(DailyAvailability, on_delete=models.CASCADE, null=False, blank=False, related_name='bookings')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, related_name='created_bookings')
    
    # Additional Information
    special_instructions = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Rating and Feedback
    customer_rating = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    customer_feedback = models.TextField(blank=True)
    
    class Meta:
        db_table = 'booking'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['car']),
        ]

    def __str__(self):
        return f"Booking {self.id} - {self.daily_availability.date}"
    
    @property
    def scheduled_date(self):
        """Get scheduled date"""
        return self.daily_availability.date

    def get_total_amount(self):
        """Calculate total amount after discount"""
        if self.invoice.total_amount is not None:
            return self.invoice.total_amount
        return None
    
    @property
    def payment_status(self):
        """Get payment status from linked invoice"""
        if not self.invoice:
            return 'not_generated'
        return self.invoice.status