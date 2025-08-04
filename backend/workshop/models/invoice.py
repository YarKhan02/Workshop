import uuid
from datetime import timedelta
from django.db import models
from django.utils import timezone
from workshop.models.customer import Customer

class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=20, unique=True, blank=True)
    
    # Amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Status and Payment
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
        ('partially_paid', 'Partially Paid'),
        ('refunded', 'Refunded'),
        ('overdue', 'Overdue'),
    ], default='pending')
    
    payment_method = models.CharField(max_length=20, choices=[
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('check', 'Check'),
    ], null=True, blank=True)
    
    # Dates
    due_date = models.DateField(null=True, blank=True)
    paid_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional info
    notes = models.TextField(blank=True)
    terms = models.TextField(blank=True)
    
    # Relationships
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')

    class Meta:
        db_table = 'invoice'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Generate invoice number
            count = Invoice.objects.count() + 1
            self.invoice_number = f"INV-{count:06d}"
        
        if not self.due_date:
            # Set due date to 30 days from creation
            self.due_date = timezone.now().date() + timedelta(days=30)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.customer.first_name} {self.customer.last_name} - {self.status}"
    
    @property
    def is_overdue(self):
        """Check if invoice is overdue"""
        if self.status in ['paid', 'cancelled', 'refunded']:
            return False
        return self.due_date and self.due_date < timezone.now().date()
    
    @property
    def amount_due(self):
        """Amount still due (for partial payments)"""
        if self.status == 'paid':
            return 0
        # For now, return full amount. Later we can add partial payment tracking
        return self.total_amount