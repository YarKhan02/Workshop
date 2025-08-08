from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializers.user_serializer import UserSerializer
from ..serializers.customer_serializer import CustomerCreateSerializer, CustomerDetailSerializer
from ..models.customer import Customer
from ..middleware.jwt_cookie_middleware import CustomerJWTAuthentication

class AdminLogin(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)

        if user and user.role == 'admin':
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            response = Response({
                'user': UserSerializer(user).data,
                'role': user.role,
                'message': 'Login successful'
            })
            # Set refresh token in HttpOnly Secure cookie
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
                max_age=7*24*60*60,  # 7 days
                path='/auth/token/refresh/'
            )
            # Set access token in HttpOnly cookie as well
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
                max_age=8*60*60,  # 8 hours
                path='/'
            )
            return response
        elif user and user.role != 'admin':
            return Response({'error': 'Access denied. Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

class CustomerLogin(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
                
        # Authenticate directly against Customer model
        try:
            customer = Customer.objects.get(email=email, is_active=True)
            if customer.check_password(password): 
                # Update last login
                from django.utils import timezone
                customer.last_login = timezone.now()
                customer.save()
                
                # Generate JWT tokens with proper structure
                from rest_framework_simplejwt.tokens import AccessToken
                
                # Create access token with customer information
                access_token = AccessToken()
                access_token['user_id'] = str(customer.id)
                access_token['email'] = customer.email
                access_token['role'] = customer.role
                access_token['token_type'] = 'access'
                
                # Create refresh token
                refresh = RefreshToken()
                refresh['user_id'] = str(customer.id)
                refresh['email'] = customer.email
                refresh['role'] = customer.role
                
                response = Response({
                    'user': CustomerDetailSerializer(customer).data,
                    'role': customer.role,
                    'message': 'Login successful'
                })
                
                # Set refresh token in HttpOnly Secure cookie
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=False,  # Set to True in production with HTTPS
                    samesite='Lax',
                    max_age=7*24*60*60,  # 7 days
                    path='/auth/token/refresh/'
                )
                # Set access token in HttpOnly cookie as well
                response.set_cookie(
                    key='access_token',
                    value=str(access_token),
                    httponly=True,
                    secure=False,  # Set to True in production with HTTPS
                    samesite='Lax',
                    max_age=8*60*60,  # 8 hours
                    path='/'
                )
                return response
        except Customer.DoesNotExist:
            return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TokenRefresh(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'No refresh token provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({'token': access_token})
        except TokenError:
            return Response({'error': 'Invalid refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)

class Logout(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({'message': 'Logged out successfully.'})
        response.delete_cookie('refresh_token', path='/auth/token/refresh/')
        response.delete_cookie('access_token', path='/')
        return response

class Register(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerCreateSerializer(data=request.data)

        
        if serializer.is_valid():
            try:
                customer = serializer.save()
                return Response({
                    'message': 'Account created successfully',
                    'customer': CustomerDetailSerializer(customer).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                error_message = str(e)
                
                # Handle specific database errors
                if 'duplicate key value violates unique constraint' in error_message:
                    if 'customer_nic_key' in error_message:
                        return Response({
                            'error': 'Registration failed',
                            'details': 'A customer with this NIC already exists. Please use a different NIC or try logging in.'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    elif 'user_email_key' in error_message:
                        return Response({
                            'error': 'Registration failed',
                            'details': 'A user with this email already exists. Please use a different email or try logging in.'
                        }, status=status.HTTP_400_BAD_REQUEST)
                
                return Response({
                    'error': 'Failed to create account',
                    'details': error_message
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        print("Serializer validation errors:", serializer.errors)
        
        return Response({
            'error': 'Invalid data provided',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class CustomerAuthStatus(APIView):
    """
    Endpoint to verify customer authentication status
    """
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return customer authentication status and basic info
        """
        try:
            customer = request.user
            return Response({
                'authenticated': True,
                'user': {
                    'id': str(customer.id),
                    'email': customer.email,
                    'first_name': customer.first_name,
                    'last_name': customer.last_name,
                    'role': customer.role
                },
                'message': 'Authentication valid'
            })
        except Exception as e:
            return Response({
                'authenticated': False,
                'message': 'Authentication failed',
                'error': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)