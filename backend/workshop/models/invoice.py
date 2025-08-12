import uuid
import random
from django.utils import timezone
from django.db import models

from workshop.models import User

class Invoice(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        CANCELLED = 'cancelled', 'Cancelled'
        REFUNDED = 'refunded', 'Refunded'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=20, unique=True, blank=False)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
        
    # Relationships
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')

    class Meta:
        db_table = 'invoice'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Generate invoice number
            timestamp_suffix = str(int(timezone.now().timestamp()))[-6:]
            random_num = random.randint(1000, 9999)
            self.invoice_number = f"DH{timestamp_suffix}-{random_num}"
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.user.name} - {self.status}"