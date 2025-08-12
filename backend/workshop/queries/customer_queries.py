from django.db.models import Count
from workshop.models import User
from workshop.helper.date_utils import get_start_of_week, get_start_of_week_percentage

def get_customer_by_id(customer_id: str) -> User:
    try:
        return User.objects.only('id', 
                                    'nic',
                                    'email', 
                                    'name',
                                    'phone_number', 
                                    'city', 
                                    'state', 
                                    'address'
                                ).get(id=customer_id)
    except User.DoesNotExist:
        return None
    

def get_total_customers():
    return User.objects.filter(role=User.Role.customer).count()



def get_returning_customers():
    return (
        User.objects.filter(role=User.Role.customer)
        .annotate(invoice_count=Count('invoices'))
        .filter(invoice_count__gt=1)
        .count()
    )


def get_new_customers_this_week():
    return User.objects.filter(
        role=User.Role.customer,
        date_joined__gte=get_start_of_week()).count()


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
