from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..middleware.jwt_cookie_middleware import CustomerJWTAuthentication, AdminJWTAuthentication
from ..serializers.customer_serializer import CustomerDetailSerializer
from ..serializers.user_serializer import UserSerializer


class CustomerAuthStatusView(APIView):
    
    authentication_classes = [CustomerJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user and hasattr(request.user, 'role') and request.user.role == 'customer':
            return Response({
                'authenticated': True,
                'user': CustomerDetailSerializer(request.user).data,
                'role': request.user.role
            })
        return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)


class AdminAuthStatusView(APIView):
    
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = []  # No permission required - we'll check manually

    def get(self, request):
        # Check if user is authenticated and is admin
        if (request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'role') and 
            request.user.role == 'admin'):
            return Response({
                'authenticated': True,
                'user': UserSerializer(request.user).data,
                'role': request.user.role
            })
        else:
            # Return false instead of 401 so frontend can handle gracefully
            return Response({
                'authenticated': False
            }, status=status.HTTP_200_OK)
