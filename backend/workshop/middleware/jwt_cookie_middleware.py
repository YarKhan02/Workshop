from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from django.contrib.auth.models import AnonymousUser
from workshop.models.customer import Customer
import jwt
from django.conf import settings


class CustomerJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that handles Customer model instead of User model
    """
    def get_raw_token(self, request):
        # First try to get token from cookie
        raw_token = request.COOKIES.get('access_token')
        if raw_token:
            return raw_token.encode('utf-8')
        
        # Fallback to Authorization header (for backward compatibility)
        return super().get_raw_token(request)
    
    def get_user(self, validated_token):
        """
        Get Customer instance from token instead of User
        """
        try:
            user_id = validated_token.get('user_id')
            if user_id:
                customer = Customer.objects.get(id=user_id)
                print(f"DEBUG: Found customer {customer.id} for token")
                return customer
        except Customer.DoesNotExist:
            print(f"DEBUG: Customer with id {user_id} not found in database")
            # Customer was deleted - this should invalidate the token
            from rest_framework_simplejwt.exceptions import InvalidToken
            raise InvalidToken("Customer no longer exists")
        except KeyError:
            print("DEBUG: No user_id in token")
            pass
        return None
    
    def authenticate(self, request):
        """
        Override to add debugging
        """
        
        raw_token = self.get_raw_token(request)
        if raw_token is None:
            print("DEBUG: No raw token found")
            return None

        validated_token = self.get_validated_token(raw_token)
        
        user = self.get_user(validated_token)
        
        if user is None:
            print("DEBUG: No user found")
            return None
            
        return user, validated_token
