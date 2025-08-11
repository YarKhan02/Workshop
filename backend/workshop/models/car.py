import uuid

from django.db import models

from . import User

class Car(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    make = models.CharField(max_length=20)
    model = models.CharField(max_length=20)
    year = models.CharField(max_length=4)
    license_plate = models.CharField(max_length=20, null=False, unique=True)
    color = models.CharField(max_length=20)
    vin = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    # Relationships
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cars')

    class Meta:
        db_table = 'car'