from django.core.management.base import BaseCommand
from workshop.models.user import User

class Command(BaseCommand):
    help = 'Seeds the database with 5 demo users'

    def handle(self, *args, **kwargs):
        users_data = [
            {
                'username': 'adminuser',
                'email': 'admin@example.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'phone': '111-111-1111',
                'password': 'adminpass123'
            },
            {
                'username': 'accountant1',
                'email': 'accountant1@example.com',
                'first_name': 'Alice',
                'last_name': 'Finance',
                'role': 'accountant',
                'phone': '222-222-2222',
                'password': 'accpass123'
            },
            {
                'username': 'staff1',
                'email': 'staff1@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'staff',
                'phone': '333-333-3333',
                'password': 'staffpass123'
            },
            {
                'username': 'staff2',
                'email': 'staff2@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'staff',
                'phone': '444-444-4444',
                'password': 'staffpass456'
            },
            {
                'username': 'accountant2',
                'email': 'accountant2@example.com',
                'first_name': 'Bob',
                'last_name': 'Ledger',
                'role': 'accountant',
                'phone': '555-555-5555',
                'password': 'accpass456'
            },
        ]

        for u in users_data:
            user, created = User.objects.get_or_create(
                username=u['username'],
                defaults={
                    'email': u['email'],
                    'first_name': u['first_name'],
                    'last_name': u['last_name'],
                    'role': u['role'],
                    'phone': u['phone']
                }
            )

            if created:
                user.set_password(u['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user: {u['username']}"))
            else:
                self.stdout.write(self.style.WARNING(f"User already exists: {u['username']}"))
