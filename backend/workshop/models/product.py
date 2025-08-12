import uuid
from django.db import models

class Product(models.Model):
    # Category choices for automotive workshop products
    CATEGORY_CHOICES = [
        ('Engine', 'Engine'),
        ('Exterior', 'Exterior'),
        ('Interior', 'Interior'),
        ('Electronics', 'Electronics'),
        ('Tires', 'Tires'),
        ('Cleaning', 'Cleaning'),
        ('Brake', 'Brake'),
        ('Suspension', 'Suspension'),
        ('Transmission', 'Transmission'),
        ('Exhaust', 'Exhaust'),
        ('Fuel', 'Fuel'),
        ('Tools', 'Tools'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product'

    def __str__(self):
        return self.name

    @classmethod
    def get_category_choices(cls):
        """Return available category choices for API"""
        return cls.CATEGORY_CHOICES
