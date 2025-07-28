# views/car_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models.car import Car
from ..serializers.car_serializer import CarSerializer, DetailSerializer

class CarView(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='details')
    def car_details(self, request):
        """
        Basic car details without customer info.
        """
        queryset = Car.objects.all()
        serializer = CarSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='with-customer')
    def car_with_customer_name(self, request):
        """
        Car details including only the customer name.
        """
        queryset = Car.objects.select_related('customer').all()
        serializer = DetailSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-customer')
    def cars_by_customer(self, request):
        """
        Get cars filtered by customer ID.
        Requires customer_id query parameter.
        """
        customer_id = request.query_params.get('customer_id')
        
        if not customer_id:
            return Response(
                {'error': 'customer_id query parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            queryset = Car.objects.filter(customer_id=customer_id)
            serializer = CarSerializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch cars for customer: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


