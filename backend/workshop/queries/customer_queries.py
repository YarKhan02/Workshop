from workshop.models import Customer

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