# workshop/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MyBookingsView

from .auth.login import TokenRefresh, Logout, Register, AdminLogin, CustomerLogin, CustomerAuthStatus
from .views import ProfileView, CustomerView, CarView, ProductView, ProductVariantView, InvoiceView, DashboardView
from .views.booking_view import BookingView
from .views.service_view import ServiceView
from .views.notification_view import NotificationView

router = DefaultRouter()

router.register(r'customers', CustomerView, basename='customer')
router.register(r'cars', CarView, basename='car')
router.register(r'products', ProductView, basename='product')
router.register(r'variants', ProductVariantView, basename='variant')
router.register(r'invoices', InvoiceView, basename='invoice')
router.register(r'bookings', BookingView, basename='booking')
router.register(r'services', ServiceView, basename='service')
router.register(r'dashboard', DashboardView, basename='dashboard')
router.register(r'notifications', NotificationView, basename='notification')

router.register(r'customer', MyBookingsView, basename='customer-bookings')

urlpatterns = [
    path('auth/login/admin/', AdminLogin.as_view(), name='admin_login'),
    path('auth/login/customer/', CustomerLogin.as_view(), name='customer_login'),
    path('auth/register/', Register.as_view(), name='register'),
    path('auth/token/refresh/', TokenRefresh.as_view(), name='token_refresh'),
    path('auth/logout/', Logout.as_view(), name='logout'),
    path('auth/status/', CustomerAuthStatus.as_view(), name='auth_status'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),

    path('', include(router.urls)),
]