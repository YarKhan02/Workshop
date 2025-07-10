from django.core.management.base import BaseCommand
from workshop.models.product import Product

class Command(BaseCommand):
    help = 'Seeds the database with demo products'

    def handle(self, *args, **kwargs):
        products_data = [
            {
                'name': 'Engine Oil',
                'category': 'Fluids',
            },
            {
                'name': 'Air Filter',
                'category': 'Filters',
            },
            {
                'name': 'Brake Pads',
                'category': 'Brakes',
            },
            {
                'name': 'Car Shampoo',
                'category': 'Cleaning',
            },
            {
                'name': 'Microfiber Cloth',
                'category': 'Accessories',
            },
        ]

        for data in products_data:
            product, created = Product.objects.get_or_create(
                name=data['name'],
                defaults={
                    'category': data['category'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created product: {product.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Product already exists: {product.name}"))
