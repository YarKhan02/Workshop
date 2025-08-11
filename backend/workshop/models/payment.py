import uuid
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone

from . import Invoice

class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'credit_card', 'Credit Card'
        DEBIT_CARD = 'debit_card', 'Debit Card'
        BANK_TRANSFER = 'bank_transfer', 'Bank Transfer'
        CASH = 'cash', 'Cash'
        JAZZCASH = 'jazzcash', 'JazzCash'
        EASYPAISA = 'easypaisa', 'Easypaisa'
        NAYAPAY = 'nayapay', 'NayaPay'
        SADAPAY = 'sadapay', 'SadaPay'
        PAYONEER = 'payoneer', 'Payoneer'
        WISE = 'wise', 'Wise (formerly TransferWise)'
        UBL_OMNI = 'ubl_omni', 'UBL Omni'
        HBL_KONNECT = 'hbl_konnect', 'HBL Konnect'

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        SUCCESS = "success", "Success"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"
        PARTIALLY_REFUNDED = "partially_refunded", "Partially Refunded"
        CHARGEBACK = "chargeback", "Chargeback"
        EXPIRED = "expired", "Expired"

    class Currency(models.TextChoices):
        PKR = 'PKR', 'Pakistani Rupee'
        USD = 'USD', 'US Dollar'  # For international transactions

    # Core payment fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.PKR)
    payment_method = models.CharField(max_length=50, choices=PaymentMethod.choices)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    
    # Payment gateway specific fields
    gateway_transaction_id = models.CharField(max_length=255, null=True, blank=True, help_text="Payment gateway's transaction ID")
    gateway_reference = models.CharField(max_length=255, null=True, blank=True, help_text="Payment gateway reference number")
    gateway_name = models.CharField(max_length=50, null=True, blank=True, help_text="Name of payment gateway used")
    gateway_response = models.JSONField(null=True, blank=True, help_text="Full gateway response for debugging")
    
    # Pakistani payment gateway specific fields
    jazzcash_transaction_id = models.CharField(max_length=100, null=True, blank=True)
    easypaisa_transaction_id = models.CharField(max_length=100, null=True, blank=True)
    nayapay_transaction_id = models.CharField(max_length=100, null=True, blank=True)
    sadapay_transaction_id = models.CharField(max_length=100, null=True, blank=True)
    bank_transaction_id = models.CharField(max_length=100, null=True, blank=True, help_text="For bank transfers")
    
    # Mobile wallet details
    mobile_number = models.CharField(max_length=15, null=True, blank=True, help_text="Mobile number used for payment")
    cnic_number = models.CharField(max_length=15, null=True, blank=True, help_text="CNIC for verification")
    
    # Additional payment details
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Transaction fee charged by gateway")
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Amount after fees")
    
    # Card details (for card payments) - stored securely/tokenized
    card_last_four = models.CharField(max_length=4, null=True, blank=True)
    card_type = models.CharField(max_length=20, null=True, blank=True)  # Visa, Mastercard, etc.
    card_token = models.CharField(max_length=255, null=True, blank=True, help_text="Tokenized card reference")
    
    # Timestamps
    payment_date = models.DateTimeField(null=True, blank=True, help_text="When payment was actually processed")
    expires_at = models.DateTimeField(null=True, blank=True, help_text="When payment link/session expires")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional metadata
    description = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True, help_text="Internal notes about payment")
    ip_address = models.GenericIPAddressField(null=True, blank=True, help_text="Customer's IP address")
    user_agent = models.TextField(null=True, blank=True, help_text="Customer's browser user agent")
    
    # Refund tracking
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    refund_reason = models.TextField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)

    # Relationships
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')

    class Meta:
        db_table = 'payment'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['gateway_transaction_id']),
            models.Index(fields=['jazzcash_transaction_id']),
            models.Index(fields=['easypaisa_transaction_id']),
            models.Index(fields=['mobile_number']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['payment_method', 'status']),
        ]

    def save(self, *args, **kwargs):
        # Validate CNIC and mobile number format
        if not self.validate_cnic():
            raise ValueError("Invalid CNIC format. Use format: 12345-1234567-1")
        
        if not self.validate_mobile_number():
            raise ValueError("Invalid Pakistani mobile number format")
        
        # Generate transaction ID if not provided
        if not self.transaction_id:
            timestamp = int(timezone.now().timestamp())
            self.transaction_id = f"TXN-{timestamp}-{self.id.hex[:8].upper()}"
        
        # Calculate net amount after fees
        if self.fee_amount and not self.net_amount:
            self.net_amount = self.amount - self.fee_amount
            
        # Set payment_date when status changes to success/completed
        if self.status in [self.Status.SUCCESS, self.Status.COMPLETED] and not self.payment_date:
            self.payment_date = timezone.now()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount} {self.currency} ({self.status})"

    @property
    def is_successful(self):
        """Check if payment was successful"""
        return self.status in [self.Status.SUCCESS, self.Status.COMPLETED]

    @property
    def is_pending(self):
        """Check if payment is still pending"""
        return self.status in [self.Status.PENDING, self.Status.PROCESSING]

    @property
    def is_failed(self):
        """Check if payment failed"""
        return self.status in [self.Status.FAILED, self.Status.CANCELLED, self.Status.EXPIRED]

    @property
    def can_refund(self):
        """Check if payment can be refunded"""
        return (self.is_successful and 
                self.refund_amount < self.amount and 
                self.status != self.Status.REFUNDED)

    @property
    def remaining_refundable_amount(self):
        """Calculate remaining amount that can be refunded"""
        if not self.is_successful:
            return 0
        return self.amount - self.refund_amount

    def mark_as_paid(self, gateway_transaction_id=None, gateway_response=None):
        """Mark payment as successfully paid"""
        self.status = self.Status.SUCCESS
        self.payment_date = timezone.now()
        if gateway_transaction_id:
            self.gateway_transaction_id = gateway_transaction_id
        if gateway_response:
            self.gateway_response = gateway_response
        self.save()

    def mark_as_failed(self, reason=None, gateway_response=None):
        """Mark payment as failed"""
        self.status = self.Status.FAILED
        if reason:
            self.notes = reason
        if gateway_response:
            self.gateway_response = gateway_response
        self.save()

    def process_refund(self, refund_amount, reason=None):
        """Process a refund for this payment"""
        if not self.can_refund:
            raise ValueError("Payment cannot be refunded")
        
        if refund_amount > self.remaining_refundable_amount:
            raise ValueError("Refund amount exceeds remaining refundable amount")
        
        self.refund_amount += refund_amount
        self.refund_reason = reason
        self.refunded_at = timezone.now()
        
        # Update status based on refund amount
        if self.refund_amount >= self.amount:
            self.status = self.Status.REFUNDED
        else:
            self.status = self.Status.PARTIALLY_REFUNDED
            
        self.save()

    