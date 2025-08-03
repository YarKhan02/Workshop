from django.core.management.base import BaseCommand
from workshop.models.product import Product
from workshop.models.product_variant import ProductVariant

class Command(BaseCommand):
    help = 'Seeds the database with demo product variants'

    def handle(self, *args, **kwargs):
        products = list(Product.objects.all())
        if not products:
            self.stdout.write(self.style.ERROR('No products found. Please seed products first.'))
            return

        variants_data = [
            {
                'variant_name': '1L Bottle',
                'sku': 'ENG-OIL-001',
                'price': 1200.00,
                'quantity': 50,
                'product_name': 'Engine Oil',
            },
            {
                'variant_name': 'Standard',
                'sku': 'AIR-FLT-002',
                'price': 350.00,
                'quantity': 30,
                'product_name': 'Air Filter',
            },
            {
                'variant_name': 'Front Set',
                'sku': 'BRK-PAD-003',
                'price': 800.00,
                'quantity': 20,
                'product_name': 'Brake Pads',
            },
            {
                'variant_name': '500ml',
                'sku': 'CAR-SHP-004',
                'price': 250.00,
                'quantity': 100,
                'product_name': 'Car Shampoo',
            },
            {
                'variant_name': 'Pack of 5',
                'sku': 'MIC-CLT-005',
                'price': 100.00,
                'quantity': 200,
                'product_name': 'Microfiber Cloth',
            },
        ]

        for data in variants_data:
            try:
                product = Product.objects.get(name=data['product_name'])
            except Product.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Product not found: {data['product_name']}"))
                continue

            variant, created = ProductVariant.objects.get_or_create(
                sku=data['sku'],
                defaults={
                    'product': product,
                    'variant_name': data['variant_name'],
                    'price': data['price'],
                    'quantity': data['quantity'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created product variant: {variant.variant_name} for {product.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Product variant already exists: {variant.sku}"))
