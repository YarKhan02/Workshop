# views/car_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.services.car_service import CarService


class CarView(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.car_service = CarService()

    @action(detail=False, methods=['get'], url_path='details')
    def car_details(self, request):
        """
        Basic car details without customer info.
        """
        result = self.car_service.get_all_cars()
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='with-customer')
    def car_with_customer_name(self, request):
        """
        Car details including only the customer name.
        """
        result = self.car_service.get_cars_with_customer()
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='by-customer')
    def cars_by_customer(self, request):
        """
        Get cars filtered by customer ID.
        Requires customer_id query parameter.
        """
        customer_id = request.query_params.get('customer_id')
        result = self.car_service.get_cars_by_customer(customer_id)
        if 'error' in result:
            if result['error'] == 'customer_id query parameter is required':
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)


