from rest_framework_simplejwt.authentication import JWTAuthentication
from workshop.models.customer import Customer
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomerJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that handles Customer model
    """
    def authenticate(self, request):
        # Get the raw token using our custom method
        raw_token = self.get_raw_token(request)
        print(f"DEBUG CustomerJWT: Raw token found: {raw_token is not None}")
        
        if raw_token is None:
            return None

        try:
            # Validate the token
            validated_token = self.get_validated_token(raw_token)
            print(f"DEBUG CustomerJWT: Token validated: {validated_token}")
            # Get the user
            user = self.get_user(validated_token)
            print(f"DEBUG CustomerJWT: User found: {user}, type: {type(user)}")
            return (user, validated_token)
        except Exception as e:
            print(f"DEBUG CustomerJWT: Authentication failed: {e}")
            return None
    
    def get_raw_token(self, request):
        # Only try to get customer token from cookie - don't fallback
        raw_token = request.COOKIES.get('customer_access_token')
        if raw_token:
            return raw_token.encode('utf-8')
        
        # Return None instead of falling back
        return None
    
    def get_user(self, validated_token):
        """
        Get Customer instance from token
        """
        try:
            user_id = validated_token.get('user_id')
            if user_id:
                customer = Customer.objects.get(id=user_id)
                return customer
        except Customer.DoesNotExist:
            from rest_framework_simplejwt.exceptions import InvalidToken
            raise InvalidToken("Customer no longer exists")
        except KeyError:
            pass
        return None


class AdminJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that handles admin User model
    """
    def __init__(self):
        super().__init__()
    
    def authenticate(self, request):
        # Get the raw token using our custom method
        raw_token = self.get_raw_token(request)
        print(f"DEBUG AdminJWT: Raw admin token found: {raw_token is not None}")
        
        if raw_token is None:
            return None

        try:
            # Validate the token
            validated_token = self.get_validated_token(raw_token)
            print(f"DEBUG AdminJWT: Admin token validated")
            # Get the user
            user = self.get_user(validated_token)
            print(f"DEBUG AdminJWT: Admin user found: {user}, type: {type(user)}")
            return (user, validated_token)
        except Exception as e:
            print(f"DEBUG AdminJWT: Admin authentication failed: {e}")
            return None
        
    def get_raw_token(self, request):
        # Only try to get admin token from cookie - don't fallback to headers
        raw_token = request.COOKIES.get('admin_access_token')
        
        if raw_token:
            return raw_token.encode('utf-8')
        
        # Return None instead of falling back to Authorization header
        return None
    
    def get_user(self, validated_token):
        """
        Get User instance from token for admin authentication
        """
        try:
            user_id = validated_token.get('user_id')
            if user_id:
                user = User.objects.get(id=user_id)
                return user
        except User.DoesNotExist:
            from rest_framework_simplejwt.exceptions import InvalidToken
            raise InvalidToken("Admin user no longer exists")
        except KeyError:
            pass
        return None
