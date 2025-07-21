import uuid

from django.db import models

from workshop.models.invoice import Invoice
from workshop.models.product_variant import ProductVariant  # Import ProductVariant

class InvoiceItems(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)  # Remove null=True

    class Meta:
        db_table = 'invoice_items'
        unique_together = ('invoice', 'product_variant')  # Ensure uniqueness for invoice and product_variant

    def __str__(self):
        return f"InvoiceItem {self.id} - {self.product_variant.variant_name} - {self.quantity}"