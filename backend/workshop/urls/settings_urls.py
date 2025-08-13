# workshop/urls/settings_urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from workshop.views.settings_view import SettingsView

router = DefaultRouter()
router.register(r'', SettingsView, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]
