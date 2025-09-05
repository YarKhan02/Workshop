# services/expense_service.py
import uuid
from typing import Dict, Any, Optional
from datetime import datetime, date
from django.db import transaction
from django.core.exceptions import ValidationError
from workshop.models.expenses import Expense, ExpenseCategory
from workshop.serializers.expense_serializer import (
    ExpenseSerializer, 
    ExpenseCreateSerializer, 
    ExpenseUpdateSerializer,
    ExpenseListSerializer,
    ExpenseCategorySerializer
)
from workshop.queries.expense_queries import (
    get_all_expenses_query,
    get_expense_by_id,
    get_expenses_by_category,
    get_expenses_by_date_range
)
from .base_service import BaseService


class ExpenseService(BaseService):

    def get_all_expenses(self) -> Dict[str, Any]:
        """Get all expenses"""
        try:
            queryset = get_all_expenses_query()
            serializer = ExpenseListSerializer(queryset, many=True)
            return self.success_response(
                message="Expenses retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve expenses",
                details=str(e)
            )

    def get_expense_by_id(self, expense_id: str) -> Dict[str, Any]:
        """Get a single expense by ID"""
        try:
            # Validate UUID format
            uuid.UUID(expense_id)
        except ValueError:
            return self.error_response(
                message="Invalid expense ID format"
            )

        try:
            expense = get_expense_by_id(expense_id)
            serializer = ExpenseSerializer(expense)
            return self.success_response(
                message="Expense retrieved successfully",
                data=serializer.data
            )
        except Expense.DoesNotExist:
            return self.error_response(
                message="Expense not found"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve expense",
                details=str(e)
            )

    def create_expense(self, data: Dict[str, Any], user=None) -> Dict[str, Any]:
        """Create a new expense"""
        try:
            # Create context with user for serializer
            context = {'request': type('Request', (), {'user': user})()}
            
            serializer = ExpenseCreateSerializer(data=data, context=context)
            if serializer.is_valid():
                with transaction.atomic():
                    expense = serializer.save()
                    # Return full expense data
                    response_serializer = ExpenseSerializer(expense)
                    return self.success_response(
                        message="Expense created successfully",
                        data=response_serializer.data
                    )
            else:
                return self.error_response(
                    message="Validation failed",
                    details=serializer.errors
                )
        except Exception as e:
            return self.error_response(
                message="Failed to create expense",
                details=str(e)
            )

    def update_expense(self, expense_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing expense"""
        try:
            # Validate UUID format
            uuid.UUID(expense_id)
        except ValueError:
            return self.error_response(
                message="Invalid expense ID format"
            )

        try:
            expense = get_expense_by_id(expense_id)
            serializer = ExpenseUpdateSerializer(expense, data=data, partial=True)
            
            if serializer.is_valid():
                with transaction.atomic():
                    updated_expense = serializer.save()
                    # Return full expense data
                    response_serializer = ExpenseSerializer(updated_expense)
                    return self.success_response(
                        message="Expense updated successfully",
                        data=response_serializer.data
                    )
            else:
                return self.error_response(
                    message="Validation failed",
                    details=serializer.errors
                )
        except Expense.DoesNotExist:
            return self.error_response(
                message="Expense not found"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to update expense",
                details=str(e)
            )

    def delete_expense(self, expense_id: str) -> Dict[str, Any]:
        """Delete an expense"""
        try:
            # Validate UUID format
            uuid.UUID(expense_id)
        except ValueError:
            return self.error_response(
                message="Invalid expense ID format"
            )

        try:
            expense = get_expense_by_id(expense_id)
            with transaction.atomic():
                expense.delete()
                return self.success_response(
                    message="Expense deleted successfully"
                )
        except Expense.DoesNotExist:
            return self.error_response(
                message="Expense not found"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to delete expense",
                details=str(e)
            )

    def get_expense_categories(self) -> Dict[str, Any]:
        """Get all available expense categories"""
        try:
            categories = ExpenseCategory.choices
            serializer = ExpenseCategorySerializer(categories, many=True)
            return self.success_response(
                message="Expense categories retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve expense categories",
                details=str(e)
            )

    def get_expenses_by_category(self, category: str) -> Dict[str, Any]:
        """Get expenses filtered by category"""
        # Validate category
        valid_categories = [choice[0] for choice in ExpenseCategory.choices]
        if category not in valid_categories:
            return self.error_response(
                message="Invalid category"
            )

        try:
            queryset = get_expenses_by_category(category)
            serializer = ExpenseListSerializer(queryset, many=True)
            return self.success_response(
                message=f"Expenses for category '{category}' retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve expenses by category",
                details=str(e)
            )

    def get_expenses_by_date_range(self, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get expenses within a date range"""
        try:
            # Parse dates
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
            
            if start > end:
                return self.error_response(
                    message="Start date cannot be after end date"
                )
            
            queryset = get_expenses_by_date_range(start, end)
            serializer = ExpenseListSerializer(queryset, many=True)
            return self.success_response(
                message="Expenses for date range retrieved successfully",
                data=serializer.data
            )
        except ValueError:
            return self.error_response(
                message="Invalid date format. Use YYYY-MM-DD"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve expenses by date range",
                details=str(e)
            )
