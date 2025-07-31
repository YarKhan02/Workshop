import json
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from workshop.services.invoice_service import InvoiceService


class InvoiceView(viewsets.ViewSet):
    """
    Invoice ViewSet handling HTTP requests and responses
    Business logic is delegated to InvoiceService
    """
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.invoice_service = InvoiceService()

    @action(detail=False, methods=['get'], url_path='list-invoices')
    def list_invoices(self, request):
        """List all invoices with pagination and filtering"""
        # Extract query parameters
        search = request.query_params.get('search')
        status_filter = request.query_params.get('status')
        
        # Handle pagination parameters with error handling
        try:
            page = int(request.query_params.get('page', 1))
            limit = int(request.query_params.get('limit', 10))
        except (ValueError, TypeError):
            page = 1
            limit = 10
        
        # Call service method
        result = self.invoice_service.get_invoices_paginated(
            search=search,
            status_filter=status_filter,
            page=page,
            limit=limit
        )
        
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Log for debugging
        print("Paginated response:", json.dumps(result['data'], indent=2, default=str))
        
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='add-invoice')
    def add_invoice(self, request):
        """Add a new invoice"""
        # Log request data for debugging
        print("Request data:", json.dumps(request.data, indent=2))
        
        result = self.invoice_service.create_invoice(request.data)
        
        if 'error' in result:
            if 'Invalid invoice data' in result['error']:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": result['message']}, 
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