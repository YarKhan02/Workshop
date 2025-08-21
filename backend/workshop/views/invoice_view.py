import json
from rest_framework import viewsets, status
from workshop.permissions import IsAdmin
from rest_framework.response import Response
from rest_framework.decorators import action

from workshop.services.invoice_service import InvoiceService


class InvoiceView(viewsets.ViewSet):
    
    permission_classes = [IsAdmin]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.invoice_service = InvoiceService()


    # List Invoices
    @action(detail=False, methods=['get'], url_path='list-invoices')
    def list_invoices(self, request):
        # Extract query parameters
        customer_id = request.query_params.get('customer_id', None)
        invoice_type = request.query_params.get('invoice_type', None)
        date_from = request.query_params.get('date_from', None)
        date_to = request.query_params.get('date_to', None)
        
        # Handle pagination parameters with error handling
        try:
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('limit', 10))
        except (ValueError, TypeError):
            page = 1
            page_size = 10
        
        # Call service method
        result = self.invoice_service.get_invoices_paginated(
            customer_id=customer_id,
            invoice_type=invoice_type,
            page=page,
            page_size=page_size,
            date_from=date_from,
            date_to=date_to
        )
        
        # Return the result directly since service returns the expected format
        return Response(result, status=status.HTTP_200_OK)


    # Add Invoice
    @action(detail=False, methods=['post'], url_path='add-invoice')
    def add_invoice(self, request):
        result = self.invoice_service.create_invoice(request.data)
        
        if 'error' in result:
            if 'Invalid invoice data' in result.get('message', ''):
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": result['message'], "data": result.get('data')}, 
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['patch'], url_path='update-invoice')
    def update_invoice(self, request, pk=None):
        """Update an existing invoice"""
        result = self.invoice_service.update_invoice(pk, request.data)
        
        if 'error' in result:
            if 'not found' in result['error']:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            elif 'Invalid invoice data' in result['error']:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": result['message']}, 
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['delete'], url_path='delete-invoice')
    def delete_invoice(self, request, pk=None):
        """Delete an invoice"""
        result = self.invoice_service.delete_invoice(pk)
        
        if 'error' in result:
            if 'not found' in result['error']:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": result['message']}, 
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=['get'], url_path='stats')
    def billing_stats(self, request):
        """Get billing statistics"""
        result = self.invoice_service.get_billing_stats()
        
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_payment_status(self, request, pk=None):
        result = self.invoice_service.update_payment_status(pk, request.data)
        
        if 'error' in result:
            if 'not found' in result['error']:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            elif 'Invalid' in result['error']:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": result['message']}, 
            status=status.HTTP_200_OK
        )