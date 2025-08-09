"""
Workshop Authentication Module

This module contains all authentication-related views and utilities:

- admin_login.py: Admin user authentication
- customer_login.py: Customer user authentication  
- customer_auth_backend.py: Django auth backend for customers
- token_management.py: JWT token refresh and logout
- auth_status.py: Authentication status checking
- registration.py: Customer registration
"""

# Import all authentication views for easy access
from .admin_login import AdminLoginView
from .customer_login import CustomerLoginView
from .token_management import TokenRefreshView, LogoutView
from .auth_status import CustomerAuthStatusView, AdminAuthStatusView
from .registration import CustomerRegisterView

__all__ = [
    'AdminLoginView',
    'CustomerLoginView', 
    'TokenRefreshView',
    'LogoutView',
    'CustomerAuthStatusView',
    'AdminAuthStatusView',
    'CustomerRegisterView',
]
