from django.core.management.base import BaseCommand
from decimal import Decimal
from workshop.models import Service

class Command(BaseCommand):
    help = 'Seeds the database with workshop services'

    def handle(self, *args, **kwargs):
        services_data = [
            {
                'name': 'Oil & Filter Change',
                'description': 'Replacement of engine oil and oil filter to ensure smooth engine performance.',
                'category': Service.Category.MAINTENANCE,
                'price': Decimal('3500.00'),
            },
            {
                'name': 'Wheel Alignment & Balancing',
                'description': 'Adjusting wheel angles and balancing tires for smooth driving.',
                'category': Service.Category.MAINTENANCE,
                'price': Decimal('2500.00'),
            },
            {
                'name': 'Brake Pad Replacement',
                'description': 'Installing new brake pads for improved braking safety.',
                'category': Service.Category.REPAIR,
                'price': Decimal('5000.00'),
            },
            {
                'name': 'Full Car Polish',
                'description': 'Exterior polish for shine and minor scratch removal.',
                'category': Service.Category.DETAILING,
                'price': Decimal('4000.00'),
            },
        ]

        for data in services_data:
            service, created = Service.objects.get_or_create(
                name=data['name'],
                defaults={
                    'description': data['description'],
                    'category': data['category'],
                    'price': data['price'],
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created service: {service.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Service already exists: {service.name}"))
