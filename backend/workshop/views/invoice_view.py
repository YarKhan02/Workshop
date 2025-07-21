import json
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q

from workshop.queries.invoice_queries import get_optimized_invoices
from workshop.models.invoice import Invoice
from workshop.serializers.invoice_serializer import InvoiceCreateSerializer, InvoiceSerializer

class InvoiceView(viewsets.ViewSet):

    # List all invoices
    @action(detail=False, methods=['get'], url_path='list-invoices')
    def list_invoices(self, request):
        search = request.query_params.get('search')
        status_filter = request.query_params.get('status')

        # Ensure get_optimized_invoices does not reference 'product'
        invoices = get_optimized_invoices().prefetch_related('items__product_variant')

        if search:
            invoices = invoices.filter(
                Q(customer__first_name__icontains=search) |
                Q(customer__last_name__icontains=search)
            )

        if status_filter:
            invoices = invoices.filter(status=status_filter)
            
        serializer = InvoiceSerializer(invoices, many=True)
        print("Serialized data:", json.dumps(serializer.data, indent=2))  # Debugging line to check serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Add a new invoice
    @action(detail=False, methods=['post'], url_path='add-invoice')
    def add_invoice(self, request):
        print("Request data:", json.dumps(request.data, indent=2))  # Debugging line to check request data
        serializer = InvoiceCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Invoice created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update an existing invoice
    @action(detail=True, methods=['patch'], url_path='update-invoice')
    def update_invoice(self, request, pk=None):
        try:
            invoice = Invoice.objects.get(id=pk)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = InvoiceSerializer(invoice, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Invoice updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete an invoice
    @action(detail=True, methods=['delete'], url_path='delete-invoice')
    def delete_invoice(self, request, pk=None):
        try:
            invoice = Invoice.objects.get(id=pk)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

        invoice.delete()
        return Response({"message": "Invoice deleted successfully"}, status=status.HTTP_204_NO_CONTENT)