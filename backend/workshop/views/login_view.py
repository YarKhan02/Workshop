from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers.user_serializer import UserSerializer

class LoginView(APIView):
    def post(self, request):
        print("=== LOGIN VIEW TRIGGERED ===")

        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)