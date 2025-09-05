# queries/expense_queries.py
from django.db.models import QuerySet
from workshop.models.expenses import Expense


def get_all_expenses_query() -> QuerySet:
    """Get all expenses ordered by paid_on date (newest first)"""
    return Expense.objects.all().order_by('-paid_on')


def get_expense_by_id(expense_id: str):
    """Get a single expense by ID"""
    return Expense.objects.get(id=expense_id)


def get_expenses_by_category(category: str) -> QuerySet:
    """Get expenses filtered by category"""
    return Expense.objects.filter(category=category).order_by('-paid_on')


def get_expenses_by_date_range(start_date, end_date) -> QuerySet:
    """Get expenses within a date range"""
    return Expense.objects.filter(
        paid_on__gte=start_date,
        paid_on__lte=end_date
    ).order_by('-paid_on')


def get_expenses_by_user(user_id: str) -> QuerySet:
    """Get expenses created by a specific user"""
    return Expense.objects.filter(created_by=user_id).order_by('-paid_on')
