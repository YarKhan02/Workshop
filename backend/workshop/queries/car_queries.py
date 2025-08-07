from workshop.models.car import Car
from django.db.models import QuerySet

def get_all_cars_query() -> QuerySet:
    return Car.objects.all()

def get_car_by_id(car_id):
    return Car.objects.get(id=car_id)
