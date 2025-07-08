# workshop/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, ProfileView, CustomerView

router = DefaultRouter()
router.register(r'customers', CustomerView, basename='customer')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name = 'login'),
    path('auth/profile/', ProfileView.as_view(), name = 'profile'),

    path('', include(router.urls)),
]