from django.db.models import Count
from workshop.models.customer import Customer
from workshop.helper.date_utils import get_start_of_week, get_start_of_week_percentage

def get_customer_by_id(customer_id: str) -> Customer:
    try:
        return Customer.objects.only('id', 
                                    'email', 
                                    'first_name', 
                                    'last_name', 
                                    'phone_number', 
                                    'city', 
                                    'state', 
                                    'address'
                                ).get(id=customer_id)
    except Customer.DoesNotExist:
        return None
    
def get_total_customers():
    return Customer.objects.count()


def get_returning_customers():
    return Customer.objects.annotate(
        booking_count=Count('bookings')
    ).filter(booking_count__gt=1).count()


def get_new_customers_this_week():
    return Customer.objects.filter(date_joined__gte=get_start_of_week()).count()


def get_customer_stats_data():
    total = get_total_customers()
    returning = get_returning_customers()
    new_this_week = get_new_customers_this_week()
    percentage = get_start_of_week_percentage(new_this_week, total)

    return {
        "total": total,
        "returning": returning,
        "new_this_week": new_this_week,
        "new_this_week_percentage": percentage
    }
