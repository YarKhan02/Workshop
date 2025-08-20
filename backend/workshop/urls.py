# workshop/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MyBookingsView

# Import separated auth views
from .auth.admin_login import AdminLoginView
from .auth.customer_login import CustomerLoginView
from .auth.token_management import TokenRefreshView, LogoutView
from .auth.auth_status import CustomerAuthStatusView, AdminAuthStatusView
from .auth.registration import CustomerRegisterView

from .views import ProfileView, CustomerView, CarView, ProductView, ProductVariantView, StockMovementView, InvoiceView, DashboardView, ContactView
from .views.booking_view import BookingView
from .views.service_view import ServiceView
from .views.notification_view import NotificationView
from .views.settings_view import SettingsView

router = DefaultRouter()

router.register(r'customers', CustomerView, basename='customer')
router.register(r'cars', CarView, basename='car')
router.register(r'products', ProductView, basename='product')
router.register(r'variants', ProductVariantView, basename='variant')
router.register(r'stock-movements', StockMovementView, basename='stock-movement')
router.register(r'invoices', InvoiceView, basename='invoice')
router.register(r'bookings', BookingView, basename='booking')
router.register(r'services', ServiceView, basename='service')
router.register(r'settings', SettingsView, basename='settings')
router.register(r'dashboard', DashboardView, basename='dashboard')
router.register(r'contact', ContactView, basename='contact')
# router.register(r'notifications', NotificationView, basename='notification')

router.register(r'customer', MyBookingsView, basename='customer-bookings')

urlpatterns = [
    # Authentication endpoints
    path('auth/admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('auth/customer/login/', CustomerLoginView.as_view(), name='customer_login'),
    path('auth/customer/register/', CustomerRegisterView.as_view(), name='customer_register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/customer/status/', CustomerAuthStatusView.as_view(), name='customer_auth_status'),
    path('auth/admin/status/', AdminAuthStatusView.as_view(), name='admin_auth_status'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),

    path('', include(router.urls)),
]