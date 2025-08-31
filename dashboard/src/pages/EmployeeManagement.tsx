import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import EmployeeTable from '../components/features/employees/EmployeeTable';
import { useEmployees } from '../hooks/useEmployees';

import AddEmployeeDialog from '../components/features/employees/AddEmployeeDialog';
import AttendanceModal from '../components/features/employees/AttendanceModal';
import SalaryModal from '../components/features/employees/SalaryModal';
import { usePaySalary } from '../hooks/usePaySalary';
import toast from 'react-hot-toast';

const EmployeeManagement: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  type Attendance = { date: string; status: 'Present' | 'Absent' | 'Leave' };
  type Payment = { month: string; amount: number; date: string };
  type EmployeeModal = { id: string; name: string; email: string; phone: string; position: string; salary?: number; payments?: Payment[]; attendance?: Attendance[] };
  const [attendanceModal, setAttendanceModal] = useState<{ open: boolean; employee?: EmployeeModal; date?: string }>({ open: false });
  const [salaryModal, setSalaryModal] = useState<{ open: boolean; employee?: EmployeeModal }>({ open: false });
  const [salaryBonus, setSalaryBonus] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'Absent' | 'Leave'>('Present');
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');


  // Add Employee Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);


  // Backend data
  const { data: employees = [] } = useEmployees();

  // Pay Salary mutation
  const paySalaryMutation = usePaySalary();

  // Table actions
  const handleEdit = (employee: any) => {};
  const handleAttendance = (employee: any) => setAttendanceModal({ open: true, employee });
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
      
      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={attendanceModal.open}
        onClose={() => setAttendanceModal({ open: false })}
        date={attendanceModal.date || ''}
        status={attendanceStatus}
        onDateChange={date => setAttendanceModal(modal => ({ ...modal, date }))}
        onStatusChange={setAttendanceStatus}
        onSave={() => setAttendanceModal({ open: false })}
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
        expandedRow={expandedRow}
        setExpandedRow={setExpandedRow}
      />
    </div>
  );
};

export default EmployeeManagement;
