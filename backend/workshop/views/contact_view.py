from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from workshop.email.email import EmailHandler
from workshop.queries import contact_queries as ci

class ContactView(viewsets.ViewSet):
    
    permission_classes = []

    
    @action(detail=False, methods=['post'], url_path='recieve')
    def recieve_email(self, request):
        data = request.data
        try:
            EmailHandler.send_contact_email(data)
            return Response({'detail': 'Message sent successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': f'Failed to send message: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    @action(detail=False, methods=['post'], url_path='info')
    def contact_info(self, request):
        output = ci.get_contact_info()
        print(output)
