import re

from rest_framework import serializers
from workshop.models.payslip import PaySlip


class PaySlipSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    total_salary = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = PaySlip
        fields = [
            'id', 'employee', 'employee_name', 'month', 'amount', 'bonus', 'total_salary', 'paid_on'
        ]
        read_only_fields = fields


class PaySlipCreateSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=PaySlip._meta.get_field('employee').related_model.objects.all())
    
    class Meta:
        model = PaySlip
        fields = [
            'id', 'employee', 'month', 'amount', 'bonus'
        ]
        read_only_fields = ['id', 'paid_on']

    def validate_month(self, value):
        # Ensure month is in YYYY-MM format
        if not re.match(r'^\d{4}-\d{2}$', value):
            raise serializers.ValidationError('Month must be in YYYY-MM format.')
        return value

    def validate(self, attrs):
        employee = attrs.get('employee')
        month = attrs.get('month')
        if employee and month:
            if PaySlip.objects.filter(employee=employee, month=month).exists():
                raise serializers.ValidationError('Payslip for this employee and month already exists.')
        return attrs

    def create(self, validated_data):
        payslip = super().create(validated_data)
        return payslip
