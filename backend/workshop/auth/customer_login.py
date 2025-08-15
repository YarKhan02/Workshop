from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from ..serializers.customer_serializer import CustomerDetailSerializer
from ..models import User


class CustomerLoginView(APIView):
    """
    Customer login endpoint - handles Customer model authentication
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        print(f"DEBUG: Customer login attempt with email: {email}")
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
                
        # Authenticate directly against Customer model
        try:
            customer = User.objects.get(email=email, is_active=True)
            if customer.check_password(password): 
                print(f"DEBUG: Customer authenticated: {customer.email}")
                
                # Update last login
                customer.last_login = timezone.now()
                customer.save()
                
                # Generate JWT tokens for customer using the same method as admin
                refresh = RefreshToken()
                refresh['user_id'] = str(customer.id)
                refresh['email'] = customer.email
                refresh['role'] = customer.role
                
                # Create access token from refresh token
                access_token = str(refresh.access_token)
                
                print(f"DEBUG: Customer token created for {customer.email}")
                print(f"DEBUG: Token user_id: {refresh['user_id']}")
                print(f"DEBUG: Token role: {refresh['role']}")
                print(f"DEBUG: Access token length: {len(access_token)}")
                
                response = Response({
                    'user': CustomerDetailSerializer(customer).data,
                    'role': customer.role,
                    'message': 'Customer login successful'
                }, status=status.HTTP_200_OK)

                print(response.data)
                
                # Set customer tokens in HttpOnly cookies (separate from admin)
                response.set_cookie(
                    key='customer_refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=False,  # Set to True in production with HTTPS
                    samesite='Lax',
                    max_age=7*24*60*60,  # 7 days
                    path='/auth/'
                )
                response.set_cookie(
                    key='customer_access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,  # Set to True in production with HTTPS
                    samesite='Lax',
                    max_age=8*60*60,  # 8 hours
                    path='/'
                )
                return response
            else:
                print("DEBUG: Customer password check failed")
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            print("DEBUG: Customer not found")
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
