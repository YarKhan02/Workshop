from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import AllowAny


class TokenRefreshView(APIView):
    """
    Token refresh endpoint - handles both admin and customer tokens
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # Check for admin refresh token first
        admin_refresh_token = request.COOKIES.get('admin_refresh_token')
        customer_refresh_token = request.COOKIES.get('customer_refresh_token')
        
        if admin_refresh_token:
            try:
                refresh = RefreshToken(admin_refresh_token)
                access_token = str(refresh.access_token)
                
                response = Response({'token': access_token, 'type': 'admin'})
                response.set_cookie(
                    key='admin_access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                    max_age=8*60*60,  # 8 hours
                    path='/'
                )
                return response
            except TokenError:
                return Response({'error': 'Invalid admin refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        elif customer_refresh_token:
            try:
                refresh = RefreshToken(customer_refresh_token)
                access_token = str(refresh.access_token)
                
                response = Response({'token': access_token, 'type': 'customer'})
                response.set_cookie(
                    key='customer_access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                    max_age=8*60*60,  # 8 hours
                    path='/'
                )
                return response
            except TokenError:
                return Response({'error': 'Invalid customer refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({'error': 'No refresh token provided.'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """
    Logout endpoint - clears both admin and customer tokens
    """
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({'message': 'Logged out successfully.'})
        
        # Clear admin tokens
        response.delete_cookie('admin_refresh_token', path='/auth/')
        response.delete_cookie('admin_access_token', path='/')
        
        # Clear customer tokens
        response.delete_cookie('customer_refresh_token', path='/auth/')
        response.delete_cookie('customer_access_token', path='/')
        
        return response
