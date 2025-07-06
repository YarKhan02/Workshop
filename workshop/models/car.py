from django.db import models

class Car(models.Model):
    name = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        db_table = 'car'

    def __str__(self):
        return f"{self.name} ({self.model})"