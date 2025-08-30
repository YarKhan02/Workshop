import uuid
from django.db import models

from .booking import Booking
from .service import Service

class BookingService(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELED = 'canceled', 'Canceled'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relationships
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='service', null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')

    price = models.DecimalField(max_digits=10, decimal_places=2)
    product_items_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)


    class Meta:
        db_table = 'booking_service'

    def __str__(self):
        return f"Booking Service - {self.id}"