import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from datetime import datetime

from workshop.models.customer import Customer
from workshop.models.car import Car
from workshop.models.user import User
from workshop.models.service import Service

class BookingTimeSlot(models.Model):
    """
    Available time slots for booking scheduling
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_concurrent_bookings = models.PositiveIntegerField(default=1)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_time_slot'
        unique_together = ['date', 'start_time']
        ordering = ['date', 'start_time']

    def __str__(self):
        return f"{self.date} {self.start_time}-{self.end_time}"
    
    def get_available_slots(self):
        """Get number of available slots"""
        booked_count = self.bookings.filter(
            status__in=['confirmed', 'in_progress']
        ).count()
        return max(0, self.max_concurrent_bookings - booked_count)
    
    def is_slot_available(self):
        """Check if slot has availability"""
        return self.is_available and self.get_available_slots() > 0
    
    @classmethod
    def create_daily_slots(cls, date, start_hour=9, end_hour=17, slot_duration_minutes=60, max_concurrent=1):
        """
        Create time slots for a specific date
        
        Args:
            date: Date to create slots for
            start_hour: Starting hour (default 9 AM)
            end_hour: Ending hour (default 5 PM)
            slot_duration_minutes: Duration of each slot in minutes (default 60)
            max_concurrent: Maximum concurrent bookings per slot (default 1)
        """
        from datetime import time, timedelta
        
        slots_created = []
        current_time = time(start_hour, 0)
        end_time = time(end_hour, 0)
        
        while current_time < end_time:
            # Calculate end time for this slot
            current_datetime = datetime.combine(date, current_time)
            slot_end_datetime = current_datetime + timedelta(minutes=slot_duration_minutes)
            slot_end_time = slot_end_datetime.time()
            
            # Don't create slot if it goes beyond the end hour
            if slot_end_time > end_time:
                break
                
            # Create the slot if it doesn't exist
            slot, created = cls.objects.get_or_create(
                date=date,
                start_time=current_time,
                defaults={
                    'end_time': slot_end_time,
                    'max_concurrent_bookings': max_concurrent,
                    'is_available': True
                }
            )
            
            if created:
                slots_created.append(slot)
            
            # Move to next slot
            current_datetime += timedelta(minutes=slot_duration_minutes)
            current_time = current_datetime.time()
        
        return slots_created
    
    @classmethod
    def get_available_slots_for_date(cls, date, exclude_booking=None):
        """
        Get all available time slots for a specific date
        
        Args:
            date: Date to check for available slots
            exclude_booking: Booking to exclude from availability check (for rescheduling)
        """
        slots = cls.objects.filter(date=date, is_available=True)
        available_slots = []
        
        for slot in slots:
            booked_count = slot.bookings.filter(
                status__in=['confirmed', 'in_progress']
            )
            
            if exclude_booking:
                booked_count = booked_count.exclude(id=exclude_booking.id)
            
            booked_count = booked_count.count()
            available_count = max(0, slot.max_concurrent_bookings - booked_count)
            
            if available_count > 0:
                available_slots.append({
                    'slot': slot,
                    'available_count': available_count
                })
        
        return available_slots


class Booking(models.Model):
    """
    Main booking model for customer appointments
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relationships
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='bookings')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    assigned_staff = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_bookings')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_bookings')
    
    # Billing relationship
    invoice = models.OneToOneField('Invoice', on_delete=models.SET_NULL, null=True, blank=True, related_name='booking')
    
    # Scheduling - simplified to just a date
    booking_date = models.DateField()
    estimated_duration_minutes = models.PositiveIntegerField()  # Can be different from service default
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    
    # Status and Progress
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Pricing
    quoted_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'), 
                                            validators=[MinValueValidator(0), MaxValueValidator(100)])
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    
    # Additional Information
    customer_notes = models.TextField(blank=True, help_text="Notes from customer")
    staff_notes = models.TextField(blank=True, help_text="Internal notes from staff")
    special_instructions = models.TextField(blank=True)
    
    # Contact Information (snapshot at booking time)
    customer_phone = models.CharField(max_length=15)
    customer_email = models.EmailField()
    
    # Car Information (snapshot at booking time)
    car_make = models.CharField(max_length=50)
    car_model = models.CharField(max_length=50)
    car_year = models.CharField(max_length=4)
    car_license_plate = models.CharField(max_length=20)
    car_color = models.CharField(max_length=30)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True)
    
    # Rating and Feedback
    customer_rating = models.PositiveIntegerField(null=True, blank=True, 
                                                validators=[MinValueValidator(1), MaxValueValidator(5)])
    customer_feedback = models.TextField(blank=True)
    
    class Meta:
        db_table = 'booking'
        ordering = ['-booking_date', '-created_at']
        indexes = [
            models.Index(fields=['booking_date']),
            models.Index(fields=['status']),
            models.Index(fields=['customer']),
            models.Index(fields=['car']),
            models.Index(fields=['service']),
        ]

    def __str__(self):
        return f"Booking {self.id} - {self.customer.first_name} {self.customer.last_name} - {self.booking_date}"
    
    @property
    def scheduled_date(self):
        """Get scheduled date"""
        return self.booking_date
    
    def get_total_amount(self):
        """Calculate total amount after discount"""
        if self.final_price is not None:
            return self.final_price - self.discount_amount
        return self.quoted_price - self.discount_amount
    
    def get_actual_duration_minutes(self):
        """Calculate actual service duration if completed"""
        if self.actual_start_time and self.actual_end_time:
            duration = self.actual_end_time - self.actual_start_time
            return int(duration.total_seconds() / 60)
        return None
    
    def is_overdue(self):
        """Check if booking is overdue"""
        from django.utils import timezone
        if self.status in ['pending', 'confirmed']:
            # For simplified date-based system, consider a booking overdue if it's past the booking date
            return timezone.now().date() > self.booking_date
        return False
    
    def generate_invoice(self):
        """Generate an invoice when booking is completed"""
        if self.invoice:
            return self.invoice  # Invoice already exists
            
        from workshop.models.invoice import Invoice
        from workshop.models.invoice_items import InvoiceItems
        from decimal import Decimal
        
        # Calculate amounts
        subtotal = self.final_price if self.final_price else self.quoted_price
        tax_rate = Decimal('0.10')  # 10% tax rate, make this configurable
        tax_amount = subtotal * tax_rate
        total_amount = subtotal + tax_amount - self.discount_amount
        
        # Create invoice
        invoice = Invoice.objects.create(
            customer=self.customer,
            subtotal=subtotal,
            tax_amount=tax_amount,
            discount_amount=self.discount_amount,
            total_amount=total_amount,
            notes=f"Invoice for {self.service.name} service on {self.booking_date}",
            terms="Payment due within 30 days."
        )
        
        # Create invoice item for the service
        InvoiceItems.objects.create(
            invoice=invoice,
            description=f"{self.service.name} - {self.car_make} {self.car_model} ({self.car_license_plate})",
            quantity=1,
            unit_price=subtotal,
        )
        
        # Link invoice to booking
        self.invoice = invoice
        self.save(update_fields=['invoice'])
        
        return invoice
    
    @property
    def payment_status(self):
        """Get payment status from linked invoice"""
        if not self.invoice:
            return 'not_generated'
        return self.invoice.status
    
    @property
    def is_paid(self):
        """Check if booking has been paid"""
        return self.payment_status == 'paid'
    
    @property
    def can_edit(self):
        """Check if booking can be edited (not paid and not completed)"""
        if self.is_paid:
            return False
        return self.status not in ['completed', 'cancelled']


class BookingStatusHistory(models.Model):
    """
    Track status changes for bookings
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='status_history')
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    change_reason = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_status_history'
        ordering = ['-changed_at']

    def __str__(self):
        return f"Booking {self.booking.id}: {self.old_status} → {self.new_status}"


class BookingAdditionalService(models.Model):
    """
    Additional services added to a booking (for upselling)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='additional_services')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'booking_additional_service'
        unique_together = ['booking', 'service']

    def __str__(self):
        return f"Additional: {self.service.name} for Booking {self.booking.id}"
    
    def save(self, *args, **kwargs):
        # Auto-calculate total price
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)


class BookingReminder(models.Model):
    """
    Reminders sent to customers about their bookings
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='reminders')
    
    REMINDER_TYPES = [
        ('confirmation', 'Booking Confirmation'),
        ('24h_reminder', '24 Hour Reminder'),
        ('2h_reminder', '2 Hour Reminder'),
        ('completion', 'Service Completion'),
        ('feedback', 'Feedback Request'),
    ]
    reminder_type = models.CharField(max_length=20, choices=REMINDER_TYPES)
    
    DELIVERY_METHODS = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
        ('whatsapp', 'WhatsApp'),
    ]
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHODS)
    
    scheduled_at = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)
    is_sent = models.BooleanField(default=False)
    message_content = models.TextField()
    error_message = models.TextField(blank=True)
    
    class Meta:
        db_table = 'booking_reminder'
        ordering = ['scheduled_at']

    def __str__(self):
        return f"Reminder for Booking {self.booking.id} - {self.reminder_type}"
