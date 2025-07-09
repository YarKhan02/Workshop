import uuid
from django.db import models
from django.utils import timezone

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #customer = add foreign key of customer
    booking_date = models.DateTimeField(default=timezone.now)
    booking_time = models.TimeField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ], default='pending')

    class Meta:
        db_table = 'booking'
        ordering = ['-booking_date']

    def __str__(self):
        return f"Booking {self.id} "