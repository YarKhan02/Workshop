from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
from ..serializers.user_serializer import UserSerializer
from rest_framework.permissions import AllowAny

class Login(APIView):
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            response = Response({
                'token': access_token,
                'user': UserSerializer(user).data,
                'role': user.role
            })
            # Set refresh token in HttpOnly Secure cookie
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=False,  # Only send over HTTPS
                samesite='Lax',
                max_age=7*24*60*60,  # 7 days, adjust as needed
                path='/auth/token/refresh/'
            )
            return response
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

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
        response.delete_cookie('refresh_token', path='/api/token/refresh/')
        # Optionally blacklist the refresh token here if using SimpleJWT blacklist
        return response