from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from decouple import config
from ..serializers.user_serializer import UserSerializer


class AdminLoginView(APIView):
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        if email != config('ADMIN_EMAIL'):
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Use Django's authenticate for User model
        user = authenticate(request, username=email, password=password)
        
        if user and user.is_authenticated:
            # Check if user has admin role
            if hasattr(user, 'role') and user.role == 'admin':
                # Generate JWT tokens for admin
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                
                response = Response({
                    'user': UserSerializer(user).data,
                    'role': user.role,
                    'message': 'Admin login successful'
                }, status=status.HTTP_200_OK)
                
                # Set admin tokens in HttpOnly cookies
                response.set_cookie(
                    key='admin_refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=False,  # Set to True in production with HTTPS
                    samesite='lax',
                    max_age=7*24*60*60,  # 7 days
                    path='/auth/'
                )
                response.set_cookie(
                    key='admin_access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,  # Set to True in production with HTTPS
                    samesite='lax',
                    max_age=8*60*60,  # 8 hours
                    path='/'
                )
                return response
            else:
                return Response({
                    'error': 'Access denied. Admin privileges required.'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
