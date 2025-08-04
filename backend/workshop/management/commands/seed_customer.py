from django.core.management.base import BaseCommand
from workshop.models.customer import Customer
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds the database with 5 demo customers'

    def handle(self, *args, **kwargs):
        customers_data = [
            {
                'nic': '4210112345671',
                'email': 'ali.khan@example.com',
                'username': 'alikhan90',
                'password': 'securepass1',
                'first_name': 'Ali',
                'last_name': 'Khan',
                'phone_number': '03001234567',
                'city': 'Karachi',
                'state': 'Sindh',
                'address': '123 Clifton Block 5, Karachi',
            },
            {
                'nic': '4210212345672',
                'email': 'amna.emaan@example.com',
                'username': 'amnaemaan95',
                'password': 'securepass2',
                'first_name': 'Amna',
                'last_name': 'Emaan',
                'phone_number': '03111234567',
                'city': 'Karachi',
                'state': 'Sindh',
                'address': 'House 45, DHA Phase 6, Karachi',
            },
            {
                'nic': '4210312345673',
                'email': 'wali.yar@example.com',
                'username': 'waliyar92',
                'password': 'securepass3',
                'first_name': 'Wali',
                'last_name': 'Yar',
                'phone_number': '03221234567',
                'city': 'Karachi',
                'state': 'Sindh',
                'address': 'Flat 8, Gulshan Block 13D, Karachi',
            },
            {
                'nic': '4210412345674',
                'email': 'osaid.rehman@example.com',
                'username': 'osaidrehman88',
                'password': 'securepass4',
                'first_name': 'Osaid',
                'last_name': 'Rehman',
                'phone_number': '03451234567',
                'city': 'Karachi',
                'state': 'Sindh',
                'address': 'Villa 7, Bahria Town, Karachi',
            },
            {
                'nic': '4210512345675',
                'email': 'fatima.mirza@example.com',
                'username': 'fatimam88',
                'password': 'securepass5',
                'first_name': 'Fatima',
                'last_name': 'Mirza',
                'phone_number': '03331234567',
                'city': 'Lahore',
                'state': 'Punjab',
                'address': 'Model Town, Lahore',
            },
        ]

        for data in customers_data:
            customer, created = Customer.objects.get_or_create(
                username=data['username'],
                defaults={
                    'nic': data['nic'],
                    'email': data['email'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'phone_number': data['phone_number'],
                    'city': data['city'],
                    'state': data['state'],
                    'address': data['address'],
                    'date_joined': timezone.now(),
                }
            )
            if created:
                customer.set_password(data['password'])
                customer.save()
                self.stdout.write(self.style.SUCCESS(f"Created customer: {customer.username}"))
            else:
                self.stdout.write(self.style.WARNING(f"Customer already exists: {customer.username}"))
