from rest_framework import serializers
from workshop.models.attendance import Attendance
from workshop.models.employee import Employee

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = [
            'id', 'employee', 'employee_name', 'date', 'status', 
            'check_in', 'check_out', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class AttendanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = [
            'employee', 'date', 'status', 'check_in', 'check_out'
        ]
        
    def validate_employee(self, value):
        """Validate that the employee exists"""
        try:
            Employee.objects.get(id=value)
            return value
        except Employee.DoesNotExist:
            raise serializers.ValidationError("Employee does not exist")
