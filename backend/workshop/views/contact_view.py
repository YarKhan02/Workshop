
from rest_framework import viewsets
from rest_framework.decorators import action

from workshop.queries import contact_queries as ci

class ContactView(viewsets.ViewSet):
    
    permission_classes = []

    
    @action(detail=False, methods=['post'],  url_path='recieve')
    def recieve_email(self, request):
        print(request.data)

    
    @action(detail=False, methods=['post'], url_path='info')
    def contact_info(self, request):
        output = ci.get_contact_info()
        print(output)
