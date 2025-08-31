import { apiClient } from './client';

export interface PaySalaryPayload {
  employeeId: string;
  month: string;
  amount: string;
  bonus?: string;
}

export async function paySalary(payload: PaySalaryPayload) {
  return apiClient.post(`/employees/${payload.employeeId}/pay-salary/`, payload);
}

export interface Payslip {
  id: string;
  employee: string;
  employee_name: string;
  month: string;
  amount: string;
  bonus: string;
  total_salary: string;
  paid_on: string;
}

export async function fetchEmployeePayslips(employeeId: string) {
  return apiClient.get<Payslip[]>(`/employees/${employeeId}/payslips/`);
}