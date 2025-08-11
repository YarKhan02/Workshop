import uuid
from django.db import models

from . import Product

class ProductVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    variant_name = models.CharField(max_length=30, null=False, blank=False)
    sku = models.CharField(max_length=50, unique=True, blank=False, null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    # Relationships
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')

    class Meta:
        db_table = 'product_variant'

    def save(self, *args, **kwargs):
        if not self.sku:
            prod = ''.join([w[:3].upper() for w in self.product.name.split()])
            var = ''.join([w[:3].upper() for w in self.variant_name.split()])
            count = ProductVariant.objects.filter(product=self.product).count() + 1
            self.sku = f"{prod}-{var}-{count:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.variant_name}"
