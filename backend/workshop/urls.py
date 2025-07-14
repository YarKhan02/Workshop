# workshop/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoginView, ProfileView, CustomerView, CarView, ProductView, ProductVariantView, InvoiceView

router = DefaultRouter()
router.register(r'customers', CustomerView, basename='customer')
router.register(r'cars', CarView, basename='car')
router.register(r'products', ProductView, basename='product')
router.register(r'variants', ProductVariantView, basename='variant')
router.register(r'invoices', InvoiceView, basename='invoice')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name = 'login'),
    path('auth/profile/', ProfileView.as_view(), name = 'profile'),

    path('', include(router.urls)),
]