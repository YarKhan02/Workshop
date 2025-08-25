from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ..serializers.customer_serializer import CustomerCreateSerializer, CustomerDetailSerializer
from ..helper.email_validator import is_valid_email_domain
from ..helper.phone_number_valid import is_valid_phone_number


class CustomerRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Validate required fields
        required_fields = ['email', 'password', 'full_name', 'phone_number']
        for field in required_fields:
            if not request.data.get(field):
                return Response({
                    'error': f'{field.replace("_", " ").title()} is required'
                }, status=status.HTTP_400_BAD_REQUEST)

        # Custom validations
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')

        if not is_valid_email_domain(email):
            return Response({
                'error': 'Invalid email format'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not is_valid_phone_number(phone_number):
            return Response({
                'error': 'Invalid phone number format. Please enter a valid phone number starting with 03.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Use serializer for creation
        serializer = CustomerCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                print(serializer.errors)
                customer = serializer.save()
                return Response({
                    'message': 'Customer registered successfully',
                    'user': CustomerDetailSerializer(customer).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response({
                    'error': f'Registration failed: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
