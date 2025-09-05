from rest_framework import viewsets, status
from workshop.permissions import IsAdmin
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.services import EmployeeService
from workshop.serializers.employee_serializer import EmployeeSerializer

class EmployeeView(viewsets.ViewSet):

    permission_classes = [IsAdmin]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.employee_service = EmployeeService()

    
    # Add a new employee
    @action(detail=False, methods=['post'], url_path='add-employee')
    def add_employee(self, request):
        employee, errors = self.employee_service.add_employee(request.data)
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_201_CREATED)


    # List all employees
    @action(detail=False, methods=['get'], url_path='list')
    def list_employees(self, request):
        data = self.employee_service.get_all_employees()
        return Response(data, status=status.HTTP_200_OK)


    # Get a single employee
    @action(detail=True, methods=['get'], url_path='get-employee')
    def get_employee(self, request, pk=None):
        data, errors = self.employee_service.get_employee(pk)
        if errors:
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(data, status=status.HTTP_200_OK)
    

    # Pay Salary
    @action(detail=True, methods=['post'], url_path='pay-salary')
    def pay_salary(self, request, pk=None):
        employee, errors = self.employee_service.pay_salary(request.data)
        if errors:
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_200_OK)
    

    # List all payslips for an employee
    @action(detail=True, methods=['get'], url_path='payslips')
    def list_payslips(self, request, pk=None):
        service = EmployeeService()
        payslips, errors = service.get_employee_payslips(pk)
        if errors:
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(payslips, status=status.HTTP_200_OK)
    

    # List all attendance records for an employee
    @action(detail=True, methods=['get'], url_path='attendance')
    def list_attendance(self, request, pk=None):
        attendance_records, errors = self.employee_service.get_employee_attendance(pk)
        if errors:
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(attendance_records, status=status.HTTP_200_OK)

    
    # Add or update attendance for an employee
    @action(detail=True, methods=['post'], url_path='add-attendance')
    def add_attendance(self, request, pk=None):
        # Include employee ID in the data
        attendance_data = request.data.copy()
        attendance_data['employee'] = pk
        
        attendance, errors = self.employee_service.add_attendance(attendance_data)
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(attendance, status=status.HTTP_201_CREATED)
    

    @action(detail=True, methods=['put'], url_path='update')
    def update_employee(self, request, pk=None):
        employee, errors = self.employee_service.update_employee(pk, request.data)
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_200_OK)

    
    @action(detail=True, methods=['delete'])
    def delete_employee(self, request, pk=None):
        # Handle employee deletion
        return Response(status=status.HTTP_204_NO_CONTENT)