from workshop.models.attendance import Attendance
from workshop.models.employee import Employee
from workshop.serializers.attendance_serializer import AttendanceSerializer
from django.db import IntegrityError

class AttendanceService:

    def add_attendance(self, attendance_data):
        """Add or update attendance for an employee"""
        employee_id = attendance_data.get('employee')
        date = attendance_data.get('date')
        status = attendance_data.get('status')
        
        # Check if employee exists
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return None, {'detail': 'Employee not found'}
        
        # Check if attendance already exists for this employee and date
        existing_attendance = Attendance.objects.filter(
            employee=employee, 
            date=date
        ).first()
        
        if existing_attendance:
            # Update existing attendance
            existing_attendance.status = status
            existing_attendance.check_in = attendance_data.get('check_in')
            existing_attendance.check_out = attendance_data.get('check_out')
            existing_attendance.save()
            return AttendanceSerializer(existing_attendance).data, None
        else:
            # Create new attendance
            try:
                attendance = Attendance.objects.create(
                    employee=employee,
                    date=date,
                    status=status,
                    check_in=attendance_data.get('check_in'),
                    check_out=attendance_data.get('check_out')
                )
                return AttendanceSerializer(attendance).data, None
            except IntegrityError as e:
                return None, {'detail': f'Database error: {str(e)}'}

    def get_employee_attendance(self, employee_id):
        """Get all attendance records for an employee"""
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return None, {'detail': 'Employee not found'}
        
        attendance_records = employee.attendance.all().order_by('-date')
        serializer = AttendanceSerializer(attendance_records, many=True)
        return serializer.data, None

    def update_attendance(self, attendance_id, attendance_data):
        """Update an existing attendance record"""
        try:
            attendance = Attendance.objects.get(id=attendance_id)
            attendance.status = attendance_data.get('status', attendance.status)
            attendance.check_in = attendance_data.get('check_in', attendance.check_in)
            attendance.check_out = attendance_data.get('check_out', attendance.check_out)
            attendance.save()
            return AttendanceSerializer(attendance).data, None
        except Attendance.DoesNotExist:
            return None, {'detail': 'Attendance record not found'}

    def delete_attendance(self, attendance_id):
        """Delete an attendance record"""
        try:
            attendance = Attendance.objects.get(id=attendance_id)
            attendance.delete()
            return True, None
        except Attendance.DoesNotExist:
            return None, {'detail': 'Attendance record not found'}
