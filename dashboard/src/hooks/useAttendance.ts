import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployeeAttendance, addAttendance } from '../api/employee';

// Hook to fetch employee attendance
export const useEmployeeAttendance = (employeeId: string) => {
  return useQuery({
    queryKey: ['employee-attendance', employeeId],
    queryFn: () => getEmployeeAttendance(employeeId),
    enabled: !!employeeId,
  });
};

// Hook to add/update attendance
export const useAddAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeId, attendanceData }: { 
      employeeId: string; 
      attendanceData: { 
        date: string; 
        status: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
        check_in?: string;
        check_out?: string;
      } 
    }) => addAttendance(employeeId, attendanceData),
    onSuccess: (_, variables) => {
      // Invalidate attendance queries
      queryClient.invalidateQueries({ queryKey: ['employee-attendance', variables.employeeId] });
    },
  });
};
