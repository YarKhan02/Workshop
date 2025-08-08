import uuid

from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nic = models.CharField(max_length=15, unique=True, editable=False, null=False)
    email = models.EmailField(unique=True, null=False)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15)
    city = models.CharField(max_length=30, blank=True)
    state = models.CharField(max_length=30, blank=True)
    address = models.TextField(max_length=30, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    @property
    def role(self):
        """Always return 'customer' for customer instances"""
        return 'customer'
    
    @property
    def is_authenticated(self):
        """Always return True for Customer instances"""
        return True
    
    @property
    def is_anonymous(self):
        """Always return False for Customer instances"""
        return False

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    class Meta:
        db_table = 'customer'

    def __str__(self):
        return self.username
