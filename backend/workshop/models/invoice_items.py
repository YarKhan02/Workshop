import uuid
from django.db import models
from workshop.models.product_variant import ProductVariant
from workshop.models.booking_service import BookingService

class InvoiceItems(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  

    # Relationships
    booking_service = models.ForeignKey(BookingService, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=False, blank=False)

    class Meta:
        db_table = 'invoice_items'

    def save(self, *args, **kwargs):
        # Auto-calculate total amount
        self.total_amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"InvoiceItem - {self.product_variant.variant_name} - {self.quantity}"