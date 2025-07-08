from django.core.management.base import BaseCommand
from workshop.models.car import Car  # Adjust import based on your structure
from workshop.models.customer import Customer

from random import choice, randint
from faker import Faker

fake = Faker()

class Command(BaseCommand):
    help = 'Seeds the database with demo cars linked to existing customers'

    def handle(self, *args, **kwargs):
        # Get some existing customers
        customers = list(Customer.objects.all())

        if not customers:
            self.stdout.write(self.style.ERROR('No customers found. Please seed customers first.'))
            return

        makes_models = {
            'Toyota': ['Corolla', 'Camry', 'Yaris'],
            'Honda': ['Civic', 'Accord', 'Fit'],
            'Ford': ['Focus', 'Fiesta', 'Mustang'],
            'Tesla': ['Model 3', 'Model S', 'Model X'],
            'Chevrolet': ['Impala', 'Malibu', 'Cruze'],
            'BMW': ['3 Series', '5 Series', 'X5'],
            'Audi': ['A4', 'A6', 'Q5']
        }

        colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Green', 'Yellow']

        def generate_vin():
            return fake.unique.bothify(text='??####??####?????', letters='ABCDEFGHJKLMNPRSTUVWXYZ')

        for i in range(10):  # Create 30 cars
            make = choice(list(makes_models.keys()))
            model = choice(makes_models[make])
            year = str(randint(2015, 2024))
            license_plate = fake.unique.bothify(text='???-####')
            color = choice(colors)
            vin = generate_vin()
            customer = choice(customers)

            car, created = Car.objects.get_or_create(
                vin=vin,
                defaults={
                    'make': make,
                    'model': model,
                    'year': year,
                    'license_plate': license_plate,
                    'color': color,
                    'customer': customer
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created car: {make} {model} ({vin}) for {customer.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'Car already exists: {vin}'))
