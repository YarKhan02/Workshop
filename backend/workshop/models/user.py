import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        return self.create_user(
            email=email,
            username=username,
            password=password,
            role='admin',
            is_staff=True,
            is_superuser=True,
            **extra_fields
        )

class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        admin = 'admin', 'Admin'
        customer = 'customer', 'Customer'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nic = models.CharField(max_length=13, unique=True, editable=False, null=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=30)
    username = models.CharField(unique=True, max_length=20)
    password = models.CharField(max_length=128, null=True, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.customer)
    phone_number = PhoneNumberField(blank=True, null=True)
    city = models.CharField(max_length=30, blank=True, null=True)
    state = models.CharField(max_length=30, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
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
        db_table = 'user'

    def __str__(self):
        return f"{self.username} ({self.role})"