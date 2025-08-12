from django.core.management.base import BaseCommand
from workshop.models.user import User

class Command(BaseCommand):
    help = 'Seeds the database with 5 demo users'

    def handle(self, *args, **kwargs):
        users_data = [
            {
                'nic': '1234567890123',
                'username': 'adminuser',
                'email': 'admin@example.com',
                'name': 'Admin',
                'role': 'admin',
                'phone_number': '111-111-1111',
                'password': 'adminpass123'
            }
        ]

        for u in users_data:
            user, created = User.objects.get_or_create(
                username=u['username'],
                defaults={
                    'email': u['email'],
                    'name': u['name'],
                    'role': u['role'],
                    'phone_number': u['phone_number']
                }
            )

            if created:
                user.set_password(u['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user: {u['username']}"))
            else:
                self.stdout.write(self.style.WARNING(f"User already exists: {u['username']}"))
