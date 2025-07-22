"""
Seed data for Services table
Run this with: python manage.py shell < seed_services.py
"""

from workshop.models.booking import Service
from decimal import Decimal

# Clear existing services
Service.objects.all().delete()

# Create services that match your frontend test data
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
]

# Create services
for service_data in services_data:
    service, created = Service.objects.get_or_create(
        code=service_data['code'],
        defaults=service_data
    )
    if created:
        print(f"Created service: {service.name}")
    else:
        print(f"Service already exists: {service.name}")

print(f"\nTotal services in database: {Service.objects.count()}")
