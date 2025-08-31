import { apiClient } from './client';
import type { Employee, CreateEmployee, UpdateEmployee } from '../types/employee';

export async function getEmployees(): Promise<Employee[]> {
  const res = await apiClient.get<Employee[]>('/employees/list/');
  return res.data;
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const res = await apiClient.get<Employee>(`/employees/${id}/get_employee/`);
  return res.data;
}

export async function createEmployee(data: CreateEmployee): Promise<Employee> {
  const res = await apiClient.post<Employee>('/employees/add-employee/', data);
  return res.data;
}

export async function updateEmployee(id: string, data: UpdateEmployee): Promise<Employee> {
  const res = await apiClient.put<Employee>(`/employees/${id}`, data);
  return res.data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}
