# services/invoice_service.py
from typing import Dict, Any, Optional
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from workshop.queries.invoice_queries import get_optimized_invoices
from workshop.models.invoice import Invoice
from workshop.serializers.invoice_serializer import InvoiceCreateSerializer, InvoiceSerializer
from .base_service import BaseService


class InvoiceService(BaseService):
    """
    Invoice service containing all business logic for invoice operations
    """
    
    def get_invoices_paginated(
        self, 
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Retrieve paginated invoices with optional search and status filtering
        """
        try:
            # Validate pagination parameters
            page = max(1, page)
            limit = max(1, min(100, limit))  # Limit max to 100 for performance
            
            # Get optimized invoices queryset
            invoices = get_optimized_invoices().prefetch_related('items__product_variant')
            
            # Apply search filter
            if search:
                invoices = invoices.filter(
                    Q(customer__first_name__icontains=search) |
                    Q(customer__last_name__icontains=search) |
                    Q(id__icontains=search)
                )
            
            # Apply status filter
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
                page = 1
            except EmptyPage:
                paginated_invoices = paginator.page(paginator.num_pages)
                page = paginator.num_pages
            
            # Serialize data
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
            
            return self.success_response(
                message="Invoices retrieved successfully",
                data=response_data
            )
            
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve invoices",
                details=str(e)
            )
    
    def create_invoice(self, invoice_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new invoice with validation
        """
        try:
            serializer = InvoiceCreateSerializer(data=invoice_data)
            
            if serializer.is_valid():
                invoice = serializer.save()
                return self.success_response(
                    message="Invoice created successfully",
                    data=InvoiceSerializer(invoice).data
                )
            else:
                return self.error_response(
                    message="Invalid invoice data",
                    details=serializer.errors
                )
                
        except Exception as e:
            return self.error_response(
                message="Failed to create invoice",
                details=str(e)
            )
    
    def update_invoice(self, invoice_id: str, invoice_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing invoice
        """
        try:
            invoice = Invoice.objects.get(id=invoice_id)
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        
        try:
            serializer = InvoiceSerializer(invoice, data=invoice_data, partial=True)
            
            if serializer.is_valid():
                updated_invoice = serializer.save()
                return self.success_response(
                    message="Invoice updated successfully",
                    data=InvoiceSerializer(updated_invoice).data
                )
            else:
                return self.error_response(
                    message="Invalid invoice data",
                    details=serializer.errors
                )
                
        except Exception as e:
            return self.error_response(
                message="Failed to update invoice",
                details=str(e)
            )
    
    def delete_invoice(self, invoice_id: str) -> Dict[str, Any]:
        """
        Delete an invoice
        """
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            invoice_number = invoice.id
            invoice.delete()
            
            return self.success_response(
                message=f"Invoice {invoice_number} deleted successfully"
            )
            
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to delete invoice",
                details=str(e)
            )
    
    def get_invoice_by_id(self, invoice_id: str) -> Dict[str, Any]:
        """
        Retrieve a specific invoice by ID
        """
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            serializer = InvoiceSerializer(invoice)
            return self.success_response(
                message="Invoice retrieved successfully",
                data=serializer.data
            )
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve invoice",
                details=str(e)
            )
