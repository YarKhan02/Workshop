from rest_framework import serializers
from workshop.models.employee import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'position',
            'salary',
            'address',
            'date_joined',
            'is_active',
        ]
