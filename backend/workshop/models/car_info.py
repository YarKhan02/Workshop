import uuid
from django.db import models

class CarInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #customer = add foreign key of customer
    make = models.CharField(max_length=50) # e.g., Toyota, Ford
    model = models.CharField(max_length=50) # e.g., Camry, Focus
    year = models.PositiveIntegerField() # e.g., 2020, 2021
    license_plate = models.CharField(max_length=10)
