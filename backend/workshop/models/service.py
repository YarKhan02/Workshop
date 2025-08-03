import uuid
from django.db import models

class Service(models.Model):
    """
    Service types offered by the workshop
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)  # e.g., 'basic_wash', 'full_detail'
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=[
        ('washing', 'Car Washing'),
        ('detailing', 'Car Detailing'),
        ('maintenance', 'Maintenance'),
        ('repair', 'Repair'),
        ('inspection', 'Inspection'),
    ])
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_duration_minutes = models.PositiveIntegerField()  # Duration in minutes
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'service'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"