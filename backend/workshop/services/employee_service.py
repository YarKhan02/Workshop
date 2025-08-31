import re
import calendar        

from workshop.serializers.employee_serializer import EmployeeSerializer
from workshop.models.employee import Employee
from workshop.models.payslip import PaySlip
from workshop.serializers.payslip_serializer import PaySlipCreateSerializer, PaySlipSerializer

class EmployeeService:

    def add_employee(self, employee_data):
        mapped_data = {
            'name': employee_data.get('fullName'),
            'email': employee_data.get('email'),
            'phone': employee_data.get('phone'),
            'position': employee_data.get('position'),
            'address': employee_data.get('address'),
            'salary': employee_data.get('salary'),
            'date_joined': employee_data.get('joiningDate'),
        }
        serializer = EmployeeSerializer(data=mapped_data)
        if serializer.is_valid():
            employee = serializer.save()
            return employee, None
        else:
            return None, serializer.errors

    def update_employee(self, employee_id, employee_data):
        # Logic to update employee
        pass

    def delete_employee(self, employee_id):
        # Logic to delete employee
        pass

    
    def get_employee(self, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return None, {'detail': 'Employee not found'}
        serializer = EmployeeSerializer(employee)
        return serializer.data, None


    def get_all_employees(self):
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return serializer.data
    

    def pay_salary(self, data):
        # Find employee instance
        try:
            employee = Employee.objects.get(id=data.get('employeeId'))
        except Employee.DoesNotExist:
            return None, {'detail': 'Employee not found'}

        # Convert month to YYYY-MM if needed (e.g., 'August 2025' -> '2025-08')
        month_str = data.get('month', '')
        month_yyyy_mm = ''
        match = re.match(r'^(\w+)\s+(\d{4})$', month_str)
        if match:
            month_name, year = match.groups()
            try:
                month_num = list(calendar.month_name).index(month_name)
                month_yyyy_mm = f"{year}-{month_num:02d}"
            except ValueError:
                month_yyyy_mm = ''
        elif re.match(r'^\d{4}-\d{2}$', month_str):
            month_yyyy_mm = month_str
        else:
            month_yyyy_mm = ''

        payslip_data = {
            'employee': str(employee.id),
            'month': month_yyyy_mm,
            'amount': data.get('amount'),
            'bonus': data.get('bonus', ''),
        }

        serializer = PaySlipCreateSerializer(data=payslip_data)
        if serializer.is_valid():
            payslip = serializer.save()
            return serializer.data, None
        else:
            return None, serializer.errors
        

    def get_employee_payslips(self, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return None, {'detail': 'Employee not found'}
        payslips = employee.payslips.all().order_by('-month')
        serializer = PaySlipSerializer(payslips, many=True)
        return serializer.data, None