# services/customer_service.py
from typing import Dict, Any, List, Optional
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from rest_framework import status

from workshop.models.customer import Customer
from workshop.queries import customer_queries as cq
from workshop.serializers.customer_serializer import (
    CustomerDetailSerializer, 
    CustomerCreateSerializer, 
    CustomerInvoiceSerializer, 
    CustomerUpdateSerializer,
    CustomerStatsSerializer
)
from ..helper.date_utils import get_start_of_week, get_start_of_week_percentage
from .base_service import BaseService


class CustomerService(BaseService):
    """
    Customer service containing all business logic for customer operations
    """
    
    def get_all_customers(self) -> Dict[str, Any]:
        """
        Retrieve all customers with their details
        """
        try:
            customers = Customer.objects.all()
            serializer = CustomerDetailSerializer(customers, many=True)
            return self.success_response(
                message="Customers retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customers",
                details=str(e)
            )
        
    def get_customer_stats(self) -> Dict[str, Any]:
        """
        Retrieve customer statistics
        """
        try:
            stats = cq.get_customer_stats_data()

            serializer = CustomerStatsSerializer(instance=stats)

            return serializer.data
            
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customer statistics",
                details=str(e)
            )
    
    def get_customers_for_invoices(self, search_term: Optional[str] = None) -> Dict[str, Any]:
        """
        Retrieve customers formatted for invoice selection with optional search
        """
        try:
            queryset = Customer.objects.all()
            
            if search_term:
                queryset = queryset.filter(
                    Q(first_name__icontains=search_term) |
                    Q(last_name__icontains=search_term) |
                    Q(email__icontains=search_term) |
                    Q(phone_number__icontains=search_term)
                )
            
            serializer = CustomerInvoiceSerializer(queryset, many=True)
            return self.success_response(
                message="Invoice customers retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customers for invoices",
                details=str(e)
            )
    
    def create_customer(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new customer
        """
        try:
            serializer = CustomerCreateSerializer(data=customer_data)
            
            if serializer.is_valid():
                customer = serializer.save()
                return self.success_response(
                    message="Customer created successfully",
                    data=CustomerDetailSerializer(customer).data
                )
            else:
                return self.error_response(
                    message="Invalid customer data",
                    details=serializer.errors
                )
        except Exception as e:
            return self.error_response(
                message="Failed to create customer",
                details=str(e)
            )
    
    def update_customer(self, customer_id: str, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing customer
        """
        try:
            customer = cq.get_customer_by_id(customer_id)
        except Customer.DoesNotExist:
            return self.error_response(
                message="Customer not found",
                details=f"Customer with ID {customer_id} does not exist"
            )
        
        try:
            serializer = CustomerUpdateSerializer(
                customer, 
                data=customer_data, 
                partial=True
            )
            
            if serializer.is_valid():
                updated_customer = serializer.save()
                return self.success_response(
                    message="Customer updated successfully",
                    data=CustomerDetailSerializer(updated_customer).data
                )
            else:
                return self.error_response(
                    message="Invalid customer data",
                    details=serializer.errors
                )
        except Exception as e:
            return self.error_response(
                message="Failed to update customer",
                details=str(e)
            )
    
    def delete_customer(self, customer_id: str) -> Dict[str, Any]:
        """
        Delete a customer
        """
        try:
            customer = Customer.objects.get(pk=customer_id)
            customer_name = f"{customer.first_name} {customer.last_name}"
            customer.delete()
            
            return self.success_response(
                message=f"Customer '{customer_name}' deleted successfully"
            )
        except Customer.DoesNotExist:
            return self.error_response(
                message="Customer not found",
                details=f"Customer with ID {customer_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to delete customer",
                details=str(e)
            )
    
    def get_customer_by_id(self, customer_id: str) -> Dict[str, Any]:
        """
        Retrieve a specific customer by ID
        """
        try:
            customer = Customer.objects.get(pk=customer_id)
            serializer = CustomerDetailSerializer(customer)
            return self.success_response(
                message="Customer retrieved successfully",
                data=serializer.data
            )
        except Customer.DoesNotExist:
            return self.error_response(
                message="Customer not found",
                details=f"Customer with ID {customer_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customer",
                details=str(e)
            )
