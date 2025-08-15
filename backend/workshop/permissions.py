from rest_framework import permissions
from workshop.models.customer import Customer
from django.contrib.auth import get_user_model

User = get_user_model()


class IsAdmin(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if it's a User with admin role
        if isinstance(request.user, User) and request.user.role == 'admin':
            return True
        
        return False


class IsCustomer(permissions.BasePermission):
    """
    Allows access only to authenticated customers.
    Works with both Customer model instances and User model (role='customer').
    """
    def has_permission(self, request, view):
        print(f"DEBUG IsCustomer: Checking permission for user: {request.user}")
        print(f"DEBUG IsCustomer: User type: {type(request.user)}")
        print(f"DEBUG IsCustomer: User authenticated: {getattr(request.user, 'is_authenticated', False)}")
        
        if not request.user or not request.user.is_authenticated:
            print("DEBUG IsCustomer: User not authenticated")
            return False
        
        # Check if it's a Customer model instance
        if isinstance(request.user, User):
            print("DEBUG IsCustomer: User is Customer instance - ALLOWED")
            return True
        
        # Check if it's a User with customer role
        if isinstance(request.user, User) and request.user.role == 'customer':
            print("DEBUG IsCustomer: User is User model with customer role - ALLOWED")
            return True
        
        print(f"DEBUG IsCustomer: User failed all checks - DENIED")
        return False
