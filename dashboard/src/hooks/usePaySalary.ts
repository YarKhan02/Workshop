import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { paySalary, fetchEmployeePayslips } from '../api/salary';
import type { PaySalaryPayload, Payslip } from '../api/salary';

export function usePaySalary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaySalaryPayload) => paySalary(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useEmployeePayslips(employeeId: string | null) {
  return useQuery<Payslip[]>({
    queryKey: ['employee-payslips', employeeId],
    queryFn: () => {
      if (!employeeId) throw new Error('No employeeId');
      return fetchEmployeePayslips(employeeId).then(res => res.data);
    },
    enabled: !!employeeId,
  });
}
