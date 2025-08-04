from datetime import timedelta
from django.utils import timezone

def get_start_of_week():
    """
    Returns the date (Monday) of the current week.
    """
    today = timezone.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    return start_of_week

def get_start_of_week_percentage(new_this_week, total_customers):
    """
    Returns the percentage of new customers this week.
    """
    if total_customers > 0:
        return (new_this_week / total_customers) * 100
    return 0.0