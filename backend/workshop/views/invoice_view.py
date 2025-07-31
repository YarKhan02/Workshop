import json
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from workshop.queries.invoice_queries import get_optimized_invoices
from workshop.models.invoice import Invoice
from workshop.serializers.invoice_serializer import InvoiceCreateSerializer, InvoiceSerializer

class InvoiceView(viewsets.ViewSet):

    # List all invoices with pagination
    @action(detail=False, methods=['get'], url_path='list-invoices')
    def list_invoices(self, request):
        search = request.query_params.get('search')
        status_filter = request.query_params.get('status')
        page = request.query_params.get('page', 1)
        limit = request.query_params.get('limit', 10)

        # Convert to integers with error handling
        try:
            page = int(page)
            limit = int(limit)
        except (ValueError, TypeError):
            page = 1
            limit = 10

        # Ensure get_optimized_invoices does not reference 'product'
        invoices = get_optimized_invoices().prefetch_related('items__product_variant')

        if search:
            invoices = invoices.filter(
                Q(customer__first_name__icontains=search) |
                Q(customer__last_name__icontains=search) |
                Q(id__icontains=search)
            )

        if status_filter:
            invoices = invoices.filter(status=status_filter)
        
        # Order by created date (most recent first)
        invoices = invoices.order_by('-created_at')
        
        # Apply pagination
        paginator = Paginator(invoices, limit)
        total_count = paginator.count
        total_pages = paginator.num_pages
        
        try:
            paginated_invoices = paginator.page(page)
        except PageNotAnInteger:
            paginated_invoices = paginator.page(1)
        except EmptyPage:
            paginated_invoices = paginator.page(paginator.num_pages)
            
        serializer = InvoiceSerializer(paginated_invoices, many=True)
        
        response_data = {
            'data': serializer.data,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'total_count': total_count,
                'per_page': limit,
                'has_next': paginated_invoices.has_next(),
                'has_previous': paginated_invoices.has_previous(),
            }
        }
        
        print("Paginated response:", json.dumps(response_data, indent=2, default=str))  # Debugging line
        return Response(response_data, status=status.HTTP_200_OK)

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