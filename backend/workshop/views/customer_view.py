# views/customer_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.models.customer import Customer
from workshop.serializers.customer_serializer import CustomerDetailSerializer, CustomerCreateSerializer, CustomerUpdateSerializer

class CustomerView(viewsets.ViewSet):

    # Fetch all customers details
    # GET: /customers/ 
    @action(detail=False, methods=['get'], url_path='details')
    def get_details(self, request):
        queryset = Customer.objects.all()
        serializer = CustomerDetailSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail = False, methods = ['post'], url_path = 'add-customer')
    def add_customer(self, request):
        serializer = CustomerCreateSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Data received successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    @action(detail = True, methods = ['put'], url_path = 'update-customer')
    def update_customer(self, request, pk = None):
        try:
            customer = Customer.objects.get(pk = pk)
        except:
            return Response({"error": "Customer not found"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = CustomerUpdateSerializer(customer, data = request.data, partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    @action(detail = True, methods = ['delete'], url_path = 'delete-customer')
    def delete_customer(self, request, pk = None):
        print(request.data)
        try:
            customer = Customer.objects.get(pk = pk)
            customer.delete()
            return Response({"message": "Customer deleted successfully"}, status = status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status = status.HTTP_404_NOT_FOUND)