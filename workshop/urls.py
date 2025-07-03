# workshop/urls.py

from rest_framework.routers import DefaultRouter
from workshop.views.car_view import CarViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet, basename='car')

urlpatterns = router.urls