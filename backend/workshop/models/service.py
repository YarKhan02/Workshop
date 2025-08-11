import uuid
from django.db import models

class Service(models.Model):
    class Category(models.TextChoices):
        WASHING = 'washing'
        DETAILING = 'detailing'
        MAINTENANCE = 'maintenance'
        REPAIR = 'repair'
        INSPECTION = 'inspection'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.MAINTENANCE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'service'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"