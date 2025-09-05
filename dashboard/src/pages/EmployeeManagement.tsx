import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import EmployeeTable from '../components/features/employees/EmployeeTable';
import { useEmployees } from '../hooks/useEmployees';
import { useAddAttendance } from '../hooks/useAttendance';

import AddEmployeeDialog from '../components/features/employees/AddEmployeeDialog';
import EditEmployeeDialog from '../components/features/employees/EditEmployeeDialog';
import AttendanceModal from '../components/features/employees/AttendanceModal';
import SalaryModal from '../components/features/employees/SalaryModal';
import { usePaySalary } from '../hooks/usePaySalary';
import toast from 'react-hot-toast';

const EmployeeManagement: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<'payments' | 'attendance' | null>(null);
  type Attendance = { date: string; status: 'Present' | 'Absent' | 'Leave' | 'Half-Day' };
  type Payment = { month: string; amount: number; date: string };
  type EmployeeModal = { id: string; name: string; email: string; phone: string; position: string; salary?: number; payments?: Payment[]; attendance?: Attendance[]; selectedAttendance?: Attendance };
  const [attendanceModal, setAttendanceModal] = useState<{ open: boolean; employee?: EmployeeModal; date?: string }>({ open: false });
  const [salaryModal, setSalaryModal] = useState<{ open: boolean; employee?: EmployeeModal }>({ open: false });
  const [editModal, setEditModal] = useState<{ open: boolean; employee?: EmployeeModal }>({ open: false });
  const [salaryBonus, setSalaryBonus] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'Absent' | 'Leave' | 'Half-Day'>('Present');
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');


  // Add Employee Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Backend data
  const { data: employees = [] } = useEmployees();

  // Add Attendance mutation
  const addAttendanceMutation = useAddAttendance();

  // Pay Salary mutation
  const paySalaryMutation = usePaySalary();

  // Table actions
  const handleEdit = (employee: any) => {
    setEditModal({ open: true, employee });
  };
  const handleAttendance = (employee: any) => {
    // If this is from editing an existing attendance record
    if (employee.selectedAttendance) {
      setAttendanceModal({ 
        open: true, 
        employee, 
        date: employee.selectedAttendance.date 
      });
      setAttendanceStatus(employee.selectedAttendance.status);
    } else {
      // Adding new attendance
      setAttendanceModal({ open: true, employee });
      setAttendanceStatus('Present');
    }
  };
  const handleViewAttendance = (_employee: any) => {
    // This function is called when View Attendance button is clicked
    // The expansion logic is handled in the button onClick
  };
  const handlePaySlip = (employee: any) => {
    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const defaultMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    setSalaryModal({ open: true, employee });
    setSalaryAmount(employee.salary ? String(employee.salary) : '');
    setSalaryBonus('');
    setSalaryMonth(defaultMonth);
  };

  return (
    <div className="space-y-8">

      <PageHeader
        title="Employee Management"
        icon={<Users className="h-6 w-6 text-white" />}
        actionButton={{
          label: 'Add Employee',
          icon: Plus,
          onClick: () => setAddDialogOpen(true),
          variant: 'primary',
        }}
      />
      <AddEmployeeDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
      
      {/* Edit Employee Dialog */}
      <EditEmployeeDialog
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false })}
        employee={editModal.employee}
      />
      
      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={attendanceModal.open}
        onClose={() => setAttendanceModal({ open: false })}
        date={attendanceModal.date || ''}
        status={attendanceStatus}
        onDateChange={date => setAttendanceModal(modal => ({ ...modal, date }))}
        onStatusChange={setAttendanceStatus}
        onSave={() => {
          if (!attendanceModal.employee) return;
          
          addAttendanceMutation.mutate({
            employeeId: attendanceModal.employee.id,
            attendanceData: {
              date: attendanceModal.date || '',
              status: attendanceStatus,
            }
          }, {
            onSuccess: () => {
              setAttendanceModal({ open: false });
              toast.success('Attendance saved successfully');
            },
            onError: () => {
              toast.error('Failed to save attendance');
            },
          });
        }}
      />
      
      {/* Salary Modal */}
      <SalaryModal
        isOpen={salaryModal.open}
        onClose={() => setSalaryModal({ open: false })}
        month={salaryMonth}
        amount={salaryAmount}
        bonus={salaryBonus}
        currentSalary={salaryModal.employee?.salary}
        onMonthChange={setSalaryMonth}
        onAmountChange={setSalaryAmount}
        onBonusChange={setSalaryBonus}
        onSave={async (selectedMonth, selectedYear) => {
          if (!salaryModal.employee) return;
          const monthString = selectedMonth && selectedYear ? `${selectedMonth} ${selectedYear}` : salaryMonth;
          paySalaryMutation.mutate({
            employeeId: salaryModal.employee.id,
            month: monthString,
            amount: salaryAmount,
            bonus: salaryBonus,
          }, {
            onSuccess: () => {
              setSalaryModal({ open: false });
              setSalaryAmount('');
              setSalaryBonus('');
              setSalaryMonth('');
            },
            onError: () => {
              toast.error('Failed to pay salary.');
            },
          });
        }}
      />
      
      {paySalaryMutation.isPending && (
        <div className="text-blue-400">Paying salary...</div>
      )}
      
      <EmployeeTable
        data={employees}
        onEdit={handleEdit}
        onAttendance={handleAttendance}
        onPaySlip={handlePaySlip}
        onViewAttendance={handleViewAttendance}
        expandedRow={expandedRow}
        setExpandedRow={setExpandedRow}
        expandedType={expandedType}
        setExpandedType={setExpandedType}
      />
    </div>
  );
};

export default EmployeeManagement;
