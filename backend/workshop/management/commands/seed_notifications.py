# workshop/management/commands/seed_notifications.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from workshop.models import (
    Notification, Booking, Invoice, Customer, 
    Service, BookingStatusHistory, Product
)


class Command(BaseCommand):
    help = 'Seed the database with notifications based on real data from existing tables'

    def handle(self, *args, **options):
        # Clear existing notifications
        Notification.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing notifications'))
        
        notifications_created = 0
        
        # 1. Create notifications for recent bookings
        recent_bookings = Booking.objects.select_related('customer', 'service', 'car').order_by('-created_at')[:10]
        
        for booking in recent_bookings:
            customer_name = f"{booking.customer.first_name} {booking.customer.last_name}".strip()
            if not customer_name:
                customer_name = booking.customer.username
                
            # New booking notification
            if booking.status == 'pending':
                Notification.objects.create(
                    title='New Booking Request',
                    message=f'{customer_name} has requested {booking.service.name} service for their {booking.car.make} {booking.car.model}.',
                    notification_type='booking',
                    priority='normal',
                    is_read=False,
                    created_at=booking.created_at + timedelta(minutes=1),
                    booking_id=str(booking.id)  # Store full UUID as string
                )
                notifications_created += 1
            
            # Booking confirmation notification
            elif booking.status == 'confirmed':
                Notification.objects.create(
                    title='Booking Confirmed',
                    message=f'{customer_name} has confirmed their {booking.service.name} appointment scheduled for {booking.booking_date}.',
                    notification_type='booking',
                    priority='low',
                    is_read=True,
                    created_at=booking.updated_at + timedelta(minutes=5),
                    read_at=booking.updated_at + timedelta(hours=1),
                    booking_id=str(booking.id)
                )
                notifications_created += 1
            
            # Booking completion notification
            elif booking.status == 'completed':
                Notification.objects.create(
                    title='Service Completed',
                    message=f'{booking.service.name} service completed for {customer_name}\'s {booking.car.make} {booking.car.model}.',
                    notification_type='booking',
                    priority='low',
                    is_read=True,
                    created_at=booking.updated_at + timedelta(minutes=10),
                    read_at=booking.updated_at + timedelta(hours=2),
                    booking_id=str(booking.id)
                )
                notifications_created += 1

        # 2. Create notifications for recent invoices
        recent_invoices = Invoice.objects.select_related('customer').order_by('-created_at')[:10]
        
        for invoice in recent_invoices:
            customer_name = f"{invoice.customer.first_name} {invoice.customer.last_name}".strip()
            if not customer_name:
                customer_name = invoice.customer.username
                
            # Payment received notification
            if invoice.status == 'paid':
                Notification.objects.create(
                    title='Payment Received',
                    message=f'Payment of ${invoice.grand_total} received from {customer_name} via {invoice.get_payment_method_display()}.',
                    notification_type='payment',
                    priority='normal',
                    is_read=True,
                    created_at=invoice.updated_at + timedelta(minutes=2),
                    read_at=invoice.updated_at + timedelta(minutes=30),
                    invoice_id=str(invoice.id)
                )
                notifications_created += 1
            
            # Overdue invoice notification
            elif invoice.status == 'overdue':
                Notification.objects.create(
                    title='Overdue Payment Alert',
                    message=f'Invoice #{str(invoice.id)[:8]} for {customer_name} is overdue. Amount: ${invoice.grand_total}',
                    notification_type='alert',
                    priority='high',
                    is_read=False,
                    created_at=invoice.due_date + timedelta(days=1) if invoice.due_date else invoice.created_at + timedelta(days=7),
                    invoice_id=str(invoice.id)
                )
                notifications_created += 1
            
            # Pending payment notification
            elif invoice.status == 'pending':
                Notification.objects.create(
                    title='New Invoice Generated',
                    message=f'Invoice #{str(invoice.id)[:8]} created for {customer_name}. Amount: ${invoice.grand_total}',
                    notification_type='payment',
                    priority='low',
                    is_read=True,
                    created_at=invoice.created_at + timedelta(minutes=5),
                    read_at=invoice.created_at + timedelta(hours=1),
                    invoice_id=str(invoice.id)
                )
                notifications_created += 1

        # 3. Create system notifications based on data patterns
        
        # Low stock notifications (if products exist)
        if Product.objects.exists():
            low_stock_products = Product.objects.filter(variants__quantity__lt=5).distinct()[:3]
            for product in low_stock_products:
                Notification.objects.create(
                    title='Low Inventory Alert',
                    message=f'{product.name} inventory is running low. Please consider restocking.',
                    notification_type='alert',
                    priority='high',
                    is_read=False,
                    created_at=timezone.now() - timedelta(hours=4)
                )
                notifications_created += 1

        # Daily summary notification
        if Booking.objects.exists():
            today_bookings = Booking.objects.filter(
                booking_date=timezone.now().date()
            ).count()
            
            Notification.objects.create(
                title='Daily Operations Summary',
                message=f'You have {today_bookings} bookings scheduled for today. Dashboard updated with latest metrics.',
                notification_type='system',
                priority='low',
                is_read=True,
                created_at=timezone.now() - timedelta(hours=8),
                read_at=timezone.now() - timedelta(hours=7)
            )
            notifications_created += 1

        # Urgent system maintenance notification
        Notification.objects.create(
            title='System Maintenance Scheduled',
            message='Scheduled system maintenance tonight at 2:00 AM. All services will be temporarily unavailable.',
            notification_type='system',
            priority='urgent',
            is_read=False,
            created_at=timezone.now() - timedelta(hours=6)
        )
        notifications_created += 1

        # Welcome notification if this is a fresh installation
        if not Customer.objects.exists() and not Booking.objects.exists():
            Notification.objects.create(
                title='Welcome to CarWorkshop Management System',
                message='System setup complete! Start by adding customers and services to begin managing bookings.',
                notification_type='system',
                priority='low',
                is_read=False,
                created_at=timezone.now() - timedelta(minutes=10)
            )
            notifications_created += 1

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {notifications_created} notifications based on real data')
        )
        
        # Print summary
        if notifications_created == 0:
            self.stdout.write(
                self.style.WARNING('No notifications created. Make sure you have data in bookings and invoices tables.')
            )
        else:
            self.stdout.write(f'Notification breakdown:')
            for notification_type in ['booking', 'payment', 'system', 'alert']:
                count = Notification.objects.filter(notification_type=notification_type).count()
                if count > 0:
                    self.stdout.write(f'  - {notification_type.title()}: {count}')
            
            unread_count = Notification.objects.filter(is_read=False).count()
            self.stdout.write(f'  - Unread: {unread_count}')
