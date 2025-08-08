from django.contrib.auth.backends import BaseBackend
from workshop.models.customer import Customer

class CustomerAuthBackend(BaseBackend):
    """
    Custom authentication backend for Customer model
    """
    
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            customer = Customer.objects.get(email=email)
            if customer.check_password(password):
                return customer
        except Customer.DoesNotExist:
            return None
        return None
    
    def get_user(self, user_id):
        try:
            return Customer.objects.get(pk=user_id)
        except Customer.DoesNotExist:
            return None
