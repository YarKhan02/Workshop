# workshop/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoginView, ProfileView, CustomerView, CarView, ProductView, ProductVariantView, InvoiceView, DashboardView
from .views.booking_view import BookingView
from .views.service_view import ServiceView

router = DefaultRouter()
router.register(r'customers', CustomerView, basename='customer')
router.register(r'cars', CarView, basename='car')
router.register(r'products', ProductView, basename='product')
router.register(r'variants', ProductVariantView, basename='variant')
router.register(r'invoices', InvoiceView, basename='invoice')
router.register(r'bookings', BookingView, basename='booking')
router.register(r'services', ServiceView, basename='service')
router.register(r'dashboard', DashboardView, basename='dashboard')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name = 'login'),
    path('auth/profile/', ProfileView.as_view(), name = 'profile'),

    path('', include(router.urls)),
]