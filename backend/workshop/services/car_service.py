# services/car_service.py
import uuid
from typing import Dict, Any, Optional
from workshop.models.car import Car
from workshop.serializers.car_serializer import CarSerializer, DetailSerializer, CarCreateSerializer, CarUpdateSerializer
from workshop.queries.car_queries import get_all_cars_query, get_car_by_id
from .base_service import BaseService

class CarService(BaseService):

    # Get all cars
    def get_all_cars(self) -> Dict[str, Any]:
        try:
            queryset = get_all_cars_query()
            serializer = CarSerializer(queryset, many=True)
            return self.success_response(
                message="Cars retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve cars",
                details=str(e)
            )

    def get_cars_with_customer(self) -> Dict[str, Any]:
        try:
            print('====================')
            queryset = Car.objects.select_related('customer').all()
            print(queryset.query)
            serializer = DetailSerializer(queryset, many=True)
            return self.success_response(
                message="Cars with customer name retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve cars with customer name",
                details=str(e)
            )

    def get_cars_by_customer(self, customer_id: str) -> Dict[str, Any]:
        if not customer_id:
            return self.error_response(
                message="customer_id query parameter is required"
            )
        try:
            queryset = Car.objects.filter(customer=customer_id)
            serializer = CarSerializer(queryset, many=True)
            return self.success_response(
                message="Cars for customer retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to fetch cars for customer",
                details=str(e)
            )

    # Add a new car
    def add_car(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            serializer = CarCreateSerializer(data=data)
            if serializer.is_valid():
                car = serializer.save()
                return self.success_response(
                    message="Car added successfully",
                    data=CarSerializer(car).data
                )
            return self.error_response(
                message="Invalid data",
                details=serializer.errors
            )
        except Exception as e:
            return self.error_response(
                message="Failed to add car",
                details=str(e)
            )

    # Update an existing car
    def update_car(self, car_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            car = get_car_by_id(car_id)
            serializer = CarUpdateSerializer(car, data=data, partial=True)
            if serializer.is_valid():
                updated_car = serializer.save()
                return self.success_response(
                    message="Car updated successfully",
                    data=CarSerializer(updated_car).data
                )
            return self.error_response(
                message="Invalid data",
                details=serializer.errors
            )
        except Car.DoesNotExist:
            return self.error_response(
                message="Car not found"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to update car",
                details=str(e)
            )
