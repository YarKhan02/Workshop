import uuid
from django.db import models
from django.core.validators import MinValueValidator

from .product_variant import ProductVariant


class StockMovement(models.Model):
    """
    Track inventory movements for product variants
    Records all stock changes with reasons and amounts
    """
    
    REASON_CHOICES = [
        ('PURCHASE', 'Purchase/Restock'),
        ('SALE', 'Sale'),
        ('ADJUSTMENT', 'Inventory Adjustment'),
        ('DAMAGE', 'Damage/Loss'),
        ('RETURN', 'Customer Return'),
        ('TRANSFER', 'Transfer'),
        ('INITIAL', 'Initial Stock'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relationships
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='stock_movements')
    
    # Movement details
    change_amount = models.IntegerField(
        help_text="Positive for stock increase (restock), negative for stock decrease (sale)"
    )
    reason = models.CharField(
        max_length=20, 
        choices=REASON_CHOICES,
        help_text="Reason for stock movement"
    )
    
    # Stock levels at time of movement
    quantity_before = models.PositiveIntegerField(
        help_text="Stock quantity before this movement"
    )
    quantity_after = models.PositiveIntegerField(
        help_text="Stock quantity after this movement"
    )
    
    reference_id = models.CharField(
        max_length=100, 
        blank=True,
        null=True,
        help_text="Reference to related transaction (invoice, purchase order, etc.)"
    )
    
    # Audit fields
    created_by = models.CharField(
        max_length=100,
        blank=True,
        help_text="User who initiated this movement"
    )
    updated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'stock_movement'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['product_variant', '-updated_at']),
            models.Index(fields=['reason']),
            models.Index(fields=['updated_at']),
        ]
    
    def save(self, *args, **kwargs):
        """
        Override save to calculate quantity_after and update product variant stock
        """
        if not self.pk:  # Only for new records
            # Use select_for_update to prevent race conditions
            from django.db import transaction
            
            with transaction.atomic():
                # Lock the product variant row to prevent concurrent modifications
                variant = ProductVariant.objects.select_for_update().get(id=self.product_variant.id)
                
                # Get current quantity from locked product variant
                self.quantity_before = variant.quantity
                self.quantity_after = self.quantity_before + self.change_amount
                
                # Ensure quantity doesn't go negative
                if self.quantity_after < 0:
                    raise ValueError(
                        f"Stock movement would result in negative quantity: "
                        f"{self.quantity_before} + {self.change_amount} = {self.quantity_after}"
                    )
                
                # Save the movement record first
                super().save(*args, **kwargs)
                
                # Update the product variant quantity
                variant.quantity = self.quantity_after
                variant.save(update_fields=['quantity'])
        else:
            # For existing records, just save normally
            super().save(*args, **kwargs)
    
    def __str__(self):
        sign = "+" if self.change_amount >= 0 else ""
        return (
            f"{self.product_variant.sku} - "
            f"{sign}{self.change_amount} "
            f"({self.reason}) - "
            f"{self.updated_at.strftime('%Y-%m-%d %H:%M')}"
        )
    
    @classmethod
    def create_movement(cls, product_variant, change_amount, reason, notes="", reference_id="", created_by=""):
        """
        Convenient method to create stock movement
        
        Args:
            product_variant: ProductVariant instance
            change_amount: int (positive for increase, negative for decrease)
            reason: str (one of REASON_CHOICES)
            notes: str (optional notes)
            reference_id: str (optional reference)
            created_by: str (optional user identifier)
        
        Returns:
            StockMovement instance
        """
        return cls.objects.create(
            product_variant=product_variant,
            change_amount=change_amount,
            reason=reason,
            notes=notes,
            reference_id=reference_id,
            created_by=created_by
        )
    
    @classmethod
    def get_stock_history(cls, product_variant, limit=None):
        """
        Get stock movement history for a product variant
        
        Args:
            product_variant: ProductVariant instance
            limit: int (optional limit for number of records)
        
        Returns:
            QuerySet of StockMovement records
        """
        queryset = cls.objects.filter(product_variant=product_variant)
        if limit:
            queryset = queryset[:limit]
        return queryset
    
    @classmethod
    def get_movements_by_reason(cls, reason, start_date=None, end_date=None):
        """
        Get stock movements filtered by reason and optional date range
        
        Args:
            reason: str (one of REASON_CHOICES)
            start_date: datetime (optional)
            end_date: datetime (optional)
        
        Returns:
            QuerySet of StockMovement records
        """
        queryset = cls.objects.filter(reason=reason)
        
        if start_date:
            queryset = queryset.filter(updated_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(updated_at__lte=end_date)
            
        return queryset
    
    @property
    def is_increase(self):
        """Check if this movement increases stock"""
        return self.change_amount > 0
    
    @property
    def is_decrease(self):
        """Check if this movement decreases stock"""
        return self.change_amount < 0
    
    @property
    def movement_type(self):
        """Get human-readable movement type"""
        return "Stock Increase" if self.is_increase else "Stock Decrease"
