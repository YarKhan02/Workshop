from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from workshop.permissions import IsAdmin

from ..serializers.user_serializer import UserSerializer

class ProfileView(APIView):

    permission_classes = [IsAdmin]
    
    def get(self, request):
        user = request.user
        return Response({'user': UserSerializer(user).data})
