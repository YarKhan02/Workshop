import uuid

from django.db import models

from .customer import Customer

class Car(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    make = models.CharField(max_length=20)
    model = models.CharField(max_length=20)
    year = models.CharField(max_length=4)
    license_plate = models.CharField(max_length=20)
    color = models.CharField(max_length=20)
    vin = models.CharField(max_length=20)

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='cars')

    class Meta:
        db_table = 'car'