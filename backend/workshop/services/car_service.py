# services/car_service.py
from typing import Dict, Any, Optional
from workshop.models.car import Car
from workshop.serializers.car_serializer import CarSerializer, DetailSerializer
from .base_service import BaseService

class CarService(BaseService):
    """
    Car service containing all business logic for car operations
    """
    def get_all_cars(self) -> Dict[str, Any]:
        try:
            queryset = Car.objects.all()
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
            queryset = Car.objects.select_related('customer').all()
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

    def get_cars_by_customer(self, customer_id: Optional[str]) -> Dict[str, Any]:
        if not customer_id:
            return self.error_response(
                message="customer_id query parameter is required"
            )
        try:
            queryset = Car.objects.filter(customer_id=customer_id)
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
