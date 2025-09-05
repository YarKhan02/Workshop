import React from 'react';
import { useEmployeePayslips } from '../../../hooks/usePaySalary';
import { useEmployeeAttendance } from '../../../hooks/useAttendance';
import { DataTable } from '../../shared';
import { Edit, CalendarCheck, FileText, Eye } from 'lucide-react';

interface EmployeeTableProps {
  data: any[];
  onEdit: (employee: any) => void;
  onAttendance: (employee: any) => void;
  onPaySlip: (employee: any) => void;
  onViewAttendance: (employee: any) => void;
  expandedRow: string | null;
  setExpandedRow: (id: string | null) => void;
  expandedType: 'payments' | 'attendance' | null;
  setExpandedType: (type: 'payments' | 'attendance' | null) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  data, 
  onEdit, 
  onAttendance, 
  onPaySlip, 
  onViewAttendance,
  expandedRow, 
  setExpandedRow,
  expandedType,
  setExpandedType
}) => {

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: any) => (
        <div>
          <div>{row.name}</div>
          {row.nic && (
            <div className="text-xs text-slate-400 mt-1">NIC: {row.nic}</div>
          )}
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'position', header: 'Position' },
    { key: 'address', header: 'Address' },
    { key: 'salary', header: 'Salary' },
  ];

  const actions = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: onEdit,
      className: '',
    },
    {
      label: 'Attendance',
      icon: CalendarCheck,
      onClick: onAttendance,
      className: '',
    },
    {
      label: 'Pay Slips',
      icon: FileText,
      onClick: (employee: any) => {
        setExpandedRow(expandedRow === employee.id ? null : employee.id);
        setExpandedType('payments');
        onPaySlip(employee);
      },
      className: '',
    },
    {
      label: 'View Attendance',
      icon: Eye,
      onClick: (employee: any) => {
        setExpandedRow(expandedRow === employee.id ? null : employee.id);
        setExpandedType('attendance');
        onViewAttendance(employee);
      },
      className: '',
    },
  ];

  // Render expanded row content with payment and attendance tables
  const renderExpanded = (employee: any) => {
    const { data: payslips, isLoading: payslipsLoading, isError: payslipsError } = useEmployeePayslips(employee.id);
    const { data: attendance, isLoading: attendanceLoading, isError: attendanceError } = useEmployeeAttendance(employee.id);
    
    return (
      <div className="p-4 bg-slate-800 rounded-lg mt-2">
        {expandedType === 'payments' && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Payment History</h4>
            {payslipsLoading && <div className="text-blue-400">Loading payslips...</div>}
            {payslipsError && <div className="text-red-400">Failed to load payslips.</div>}
            {!payslipsLoading && !payslipsError && payslips && (
              <DataTable
                data={payslips}
                columns={[
                  { key: 'month', header: 'Month' },
                  { key: 'amount', header: 'Amount' },
                  { key: 'bonus', header: 'Bonus' },
                  { key: 'total_salary', header: 'Total Salary' },
                  { key: 'paid_on', header: 'Paid On' },
                ]}
              />
            )}
          </div>
        )}
        
        {expandedType === 'attendance' && (
          <div>
            <h4 className="font-semibold mb-2">Attendance Records</h4>
            {attendanceLoading && <div className="text-blue-400">Loading attendance...</div>}
            {attendanceError && <div className="text-red-400">Failed to load attendance.</div>}
            {!attendanceLoading && !attendanceError && attendance && (
              <DataTable
                data={attendance}
                columns={[
                  { key: 'date', header: 'Date' },
                  { key: 'status', header: 'Status' },
                  // { key: 'check_in', header: 'Check In' },
                  // { key: 'check_out', header: 'Check Out' },
                ]}
                // actions={[
                //   {
                //     label: 'Edit',
                //     icon: Edit,
                //     onClick: (att: any) => onAttendance({ ...employee, selectedAttendance: att }),
                //   },
                // ]}
              />
            )}
          </div>
        )}
      </div>
    );
  };



  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
      />
      {expandedRow && (
        <div className="mt-2">
          {renderExpanded(data.find(e => e.id === expandedRow)!)}
        </div>
      )}
    </>
  );
}



export default EmployeeTable;
