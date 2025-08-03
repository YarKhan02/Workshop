from django.core.management.base import BaseCommand
from workshop.models.booking import Service
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with workshop services'

    def handle(self, *args, **kwargs):
        services_data = [
            {
                'name': 'Basic Wash',
                'code': 'basic_wash',
                'description': 'Exterior wash, vacuum interior, tire cleaning',
                'category': 'washing',
                'base_price': Decimal('2500.00'),
                'estimated_duration_minutes': 60,
            },
            {
                'name': 'Full Detail',
                'code': 'full_detail',
                'description': 'Complete interior and exterior detailing service',
                'category': 'detailing',
                'base_price': Decimal('8500.00'),
                'estimated_duration_minutes': 180,
            },
            {
                'name': 'Interior Detail',
                'code': 'interior_detail',
                'description': 'Deep interior cleaning, upholstery treatment, dashboard polish',
                'category': 'detailing',
                'base_price': Decimal('4500.00'),
                'estimated_duration_minutes': 120,
            },
            {
                'name': 'Exterior Detail',
                'code': 'exterior_detail',
                'description': 'Paint correction, waxing, tire shine, window cleaning',
                'category': 'detailing',
                'base_price': Decimal('6500.00'),
                'estimated_duration_minutes': 150,
            },
            {
                'name': 'Premium Detail',
                'code': 'premium_detail',
                'description': 'Ultimate detailing package with ceramic coating and paint protection',
                'category': 'detailing',
                'base_price': Decimal('15000.00'),
                'estimated_duration_minutes': 300,
            },
            {
                'name': 'Engine Bay Cleaning',
                'code': 'engine_bay_clean',
                'description': 'Deep cleaning of engine compartment',
                'category': 'detailing',
                'base_price': Decimal('3500.00'),
                'estimated_duration_minutes': 90,
            },
            {
                'name': 'Headlight Restoration',
                'code': 'headlight_restore',
                'description': 'Restore cloudy and yellowed headlights',
                'category': 'maintenance',
                'base_price': Decimal('2000.00'),
                'estimated_duration_minutes': 45,
            },
            {
                'name': 'Ceramic Coating',
                'code': 'ceramic_coating',
                'description': 'Professional ceramic coating application',
                'category': 'detailing',
                'base_price': Decimal('25000.00'),
                'estimated_duration_minutes': 480,
            },
        ]

        for data in services_data:
            service, created = Service.objects.get_or_create(
                code=data['code'],
                defaults={
                    'name': data['name'],
                    'description': data['description'],
                    'category': data['category'],
                    'base_price': data['base_price'],
                    'estimated_duration_minutes': data['estimated_duration_minutes'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created service: {service.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Service already exists: {service.name}"))
