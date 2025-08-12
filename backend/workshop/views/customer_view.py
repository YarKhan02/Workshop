# views/customer_view.py
from rest_framework import viewsets, status
from workshop.permissions import IsAdmin
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.services.customer_service import CustomerService


class CustomerView(viewsets.ViewSet):
    
    permission_classes = [IsAdmin]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.customer_service = CustomerService()

    # Get customer details
    @action(detail=False, methods=['get'], url_path='details')
    def get_details(self, request):
        result = self.customer_service.get_all_customers()
        
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(result['data'], status=status.HTTP_200_OK)

    # Get customer statistics
    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        result = self.customer_service.get_customer_stats()

        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(result, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='customer-invoices')
    def customer_for_invoices(self, request):
        """Fetch customers for invoice selection with optional search"""
        search_term = request.query_params.get('search', None)
        result = self.customer_service.get_customers_for_invoices(search_term)
        
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(result['data'], status=status.HTTP_200_OK)

    # Add a new customer
    @action(detail=False, methods=['post'], url_path='add-customer')
    def add_customer(self, request):
        result = self.customer_service.create_customer(request.data)
        
        if 'error' in result:
            if 'Invalid customer data' in result['error']:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": result['message']}, 
            status=status.HTTP_201_CREATED
        )

    # Update an existing customer
    @action(detail=True, methods=['put'], url_path='update-customer')
    def update_customer(self, request, pk=None):
        result = self.customer_service.update_customer(pk, request.data)
        
        if 'error' in result:
            if 'not found' in result['error']:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            elif 'Invalid customer data' in result['error']:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(result['data'], status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'], url_path='delete-customer')
    def delete_customer(self, request, pk=None):
        """Delete a customer"""
        result = self.customer_service.delete_customer(pk)
        
        if 'error' in result:
            if 'not found' in result['error']:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": result['message']}, 
            status=status.HTTP_204_NO_CONTENT
        )