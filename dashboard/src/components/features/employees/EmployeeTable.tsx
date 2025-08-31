import React from 'react';
import { useEmployeePayslips } from '../../../hooks/usePaySalary';
import { DataTable } from '../../shared';
import { Edit, CalendarCheck, FileText } from 'lucide-react';

interface EmployeeTableProps {
  data: any[];
  onEdit: (employee: any) => void;
  onAttendance: (employee: any) => void;
  onPaySlip: (employee: any) => void;
  expandedRow: string | null;
  setExpandedRow: (id: string | null) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, onEdit, onAttendance, onPaySlip, expandedRow, setExpandedRow }) => {

  const columns = [
    { key: 'name', header: 'Name' },
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
      onClick: onPaySlip,
      className: '',
    },
  ];

  const handleRowClick = (employee: any) => {
    setExpandedRow(expandedRow === employee.id ? null : employee.id);
  };

  // Render expanded row content with payment and attendance tables
  const renderExpanded = (employee: any) => {
    const { data: payslips, isLoading, isError } = useEmployeePayslips(employee.id);
    return (
      <div className="p-4 bg-slate-800 rounded-lg mt-2">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Payment History</h4>
          {isLoading && <div className="text-blue-400">Loading payslips...</div>}
          {isError && <div className="text-red-400">Failed to load payslips.</div>}
          {!isLoading && !isError && payslips && (
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
        {employee.attendance && (
          <div>
            <h4 className="font-semibold mb-2">Attendance</h4>
            <DataTable
              data={employee.attendance}
              columns={[
                { key: 'date', header: 'Date' },
                { key: 'status', header: 'Status' },
              ]}
              actions={[
                {
                  label: 'Edit',
                  icon: Edit,
                  onClick: (att: any) => onAttendance({ ...employee, attendance: [att] }),
                },
              ]}
            />
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
        onRowClick={handleRowClick}
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
