from django.core.management.base import BaseCommand
from workshop.models.booking import Booking, Service
from workshop.models.customer import Customer
from workshop.models.car import Car
from workshop.models.user import User
from workshop.models.daily_availability import DailyAvailability
from django.utils import timezone
from decimal import Decimal
import random
from datetime import date, time, timedelta, datetime

class Command(BaseCommand):
    help = 'Seeds the database with demo bookings and daily availability'

    def handle(self, *args, **kwargs):
        # Check if required data exists
        if not Customer.objects.exists():
            self.stdout.write(self.style.ERROR("No customers found. Please run 'python manage.py seed_customer' first."))
            return
        
        if not Car.objects.exists():
            self.stdout.write(self.style.ERROR("No cars found. Please run 'python manage.py seed_car' first."))
            return
        
        if not Service.objects.exists():
            self.stdout.write(self.style.ERROR("No services found. Please run 'python manage.py seed_service' first."))
            return

        # Get some users for staff assignment
        staff_users = list(User.objects.filter(role__in=['staff', 'admin']))
        
        # Get all customers, cars, and services
        customers = list(Customer.objects.all())
        cars = list(Car.objects.all())
        services = list(Service.objects.all())

        # First, create daily availability for the next 30 days
        self.stdout.write("Creating daily availability...")
        self.create_daily_availability()

        # Sample booking data matching your frontend test data
        bookings_data = [
            {
                'customer_index': 0,
                'car_index': 0,
                'service_code': 'full_detail',
                'booking_date': date.today() + timedelta(days=1),
                'status': 'confirmed',
                'customer_notes': 'Customer requested extra attention to interior stains',
                'quoted_price': Decimal('8500.00'),
            },
            {
                'customer_index': 1,
                'car_index': 1,
                'service_code': 'basic_wash',
                'booking_date': date.today(),
                'status': 'in_progress',
                'customer_notes': 'Express service requested',
                'quoted_price': Decimal('2500.00'),
            },
            {
                'customer_index': 2,
                'car_index': 2,
                'service_code': 'interior_detail',
                'booking_date': date.today() + timedelta(days=2),
                'status': 'pending',
                'customer_notes': 'Pet hair removal needed',
                'quoted_price': Decimal('4500.00'),
            },
            {
                'customer_index': 3,
                'car_index': 3,
                'service_code': 'premium_detail',
                'booking_date': date.today() - timedelta(days=3),
                'status': 'completed',
                'customer_notes': 'Ceramic coating applied',
                'quoted_price': Decimal('15000.00'),
                'final_price': Decimal('15000.00'),
                'customer_rating': 5,
                'customer_feedback': 'Excellent service! Car looks brand new.',
            },
            {
                'customer_index': 4,
                'car_index': 4,
                'service_code': 'exterior_detail',
                'booking_date': date.today() + timedelta(days=3),
                'status': 'confirmed',
                'customer_notes': 'Paint correction requested',
                'quoted_price': Decimal('6500.00'),
            },
            {
                'customer_index': 0,
                'car_index': 1,
                'service_code': 'basic_wash',
                'booking_date': date.today() - timedelta(days=2),
                'status': 'cancelled',
                'customer_notes': 'Customer cancelled due to rain',
                'quoted_price': Decimal('2500.00'),
                'cancellation_reason': 'Weather conditions',
            },
            {
                'customer_index': 1,
                'car_index': 2,
                'service_code': 'full_detail',
                'booking_date': date.today(),
                'status': 'in_progress',
                'customer_notes': 'Leather conditioning included',
                'quoted_price': Decimal('8500.00'),
            },
            {
                'customer_index': 2,
                'car_index': 3,
                'service_code': 'interior_detail',
                'booking_date': date.today() + timedelta(days=4),
                'status': 'pending',
                'customer_notes': 'Deep vacuum and sanitization',
                'quoted_price': Decimal('4500.00'),
            },
        ]

        created_count = 0
        
        for data in bookings_data:
            try:
                # Get customer and car by index
                if data['customer_index'] >= len(customers):
                    continue
                if data['car_index'] >= len(cars):
                    continue
                    
                customer = customers[data['customer_index']]
                car = cars[data['car_index']]
                
                # Get service by code
                try:
                    service = Service.objects.get(code=data['service_code'])
                except Service.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Service not found: {data['service_code']}"))
                    continue
                
                # Ensure daily availability exists for the booking date
                booking_date = data['booking_date']
                availability, created = DailyAvailability.objects.get_or_create(
                    date=booking_date,
                    defaults={
                        'total_slots': 7,
                        'available_slots': 7,
                        'is_available': True
                    }
                )
                
                # Create booking with booking_date instead of time_slot
                booking_defaults = {
                    'customer': customer,
                    'car': car,
                    'service': service,
                    'booking_date': booking_date,
                    'estimated_duration_minutes': service.estimated_duration_minutes,
                    'status': data['status'],
                    'quoted_price': data['quoted_price'],
                    'customer_notes': data.get('customer_notes', ''),
                    'customer_phone': customer.phone_number,
                    'customer_email': customer.email,
                    'car_make': car.make,
                    'car_model': car.model,
                    'car_year': car.year,
                    'car_license_plate': car.license_plate,
                    'car_color': car.color,
                }
                
                # Add optional fields
                if 'final_price' in data:
                    booking_defaults['final_price'] = data['final_price']
                if 'customer_rating' in data:
                    booking_defaults['customer_rating'] = data['customer_rating']
                if 'customer_feedback' in data:
                    booking_defaults['customer_feedback'] = data['customer_feedback']
                if 'cancellation_reason' in data:
                    booking_defaults['cancellation_reason'] = data['cancellation_reason']
                
                # Assign staff randomly if available
                if staff_users:
                    booking_defaults['assigned_staff'] = random.choice(staff_users)
                    booking_defaults['created_by'] = random.choice(staff_users)
                
                # Set timestamps for different statuses
                now = timezone.now()
                if data['status'] == 'confirmed':
                    booking_defaults['confirmed_at'] = now - timedelta(hours=random.randint(1, 48))
                elif data['status'] == 'completed':
                    booking_defaults['confirmed_at'] = now - timedelta(hours=random.randint(24, 72))
                if data['status'] == 'cancelled':
                    booking_defaults['cancelled_at'] = now - timedelta(hours=random.randint(1, 24))
                
                booking, created = Booking.objects.get_or_create(
                    customer=customer,
                    car=car,
                    service=service,
                    booking_date=booking_date,
                    defaults=booking_defaults
                )
                
                if created:
                    created_count += 1
                    # Update daily availability based on booking status
                    if data['status'] in ['confirmed', 'in_progress']:
                        availability.book_slot()
                    
                    self.stdout.write(self.style.SUCCESS(
                        f"Created booking: {customer.first_name} {customer.last_name} - {service.name} - {booking_date}"
                    ))
                else:
                    self.stdout.write(self.style.WARNING(
                        f"Booking already exists: {customer.first_name} {customer.last_name} - {service.name} - {booking_date}"
                    ))
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error creating booking: {str(e)}"))
        
        self.stdout.write(self.style.SUCCESS(f"\nCreated {created_count} new bookings out of {len(bookings_data)} total bookings."))

    def create_daily_availability(self):
        """Create daily availability for the next 30 days"""
        today = date.today()
        availability_created = 0
        
        for days_ahead in range(-7, 31):  # 7 days in past, 30 days in future
            target_date = today + timedelta(days=days_ahead)
            
            # Create daily availability record
            availability, created = DailyAvailability.objects.get_or_create(
                date=target_date,
                defaults={
                    'total_slots': 7,  # 7 appointments per day
                    'available_slots': 7,
                    'is_available': True
                }
            )
            
            if created:
                availability_created += 1
                self.stdout.write(f"Created availability for {target_date}: {availability.available_slots}/{availability.total_slots} slots")
        
        self.stdout.write(self.style.SUCCESS(f"Total daily availability records created: {availability_created}"))
