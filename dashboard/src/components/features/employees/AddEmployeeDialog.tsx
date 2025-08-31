import React, { useState } from 'react';
import { useCreateEmployee } from '../../../hooks/useEmployees';
import { FormModal } from '../../shared';
import InputField from '../../form/InputField';
import ActionButton from '../../shared/buttons/ActionButton';
import { User, Mail, Phone, Briefcase, CalendarDays, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  address: string;
  joiningDate: string;
  salary: string;
}

const initialState: EmployeeFormData = {
  fullName: '',
  email: '',
  phone: '',
  position: '',
  address: '',
  joiningDate: '',
  salary: '',
};

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<EmployeeFormData>(initialState);
  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const createEmployee = useCreateEmployee();

  const validate = (): boolean => {
    const newErrors: Partial<EmployeeFormData> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone Number is required';
    if (!form.position.trim()) newErrors.position = 'Position is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.joiningDate) newErrors.joiningDate = 'Joining Date is required';
    if (!form.salary.trim() || isNaN(Number(form.salary))) newErrors.salary = 'Salary is required and must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof EmployeeFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    createEmployee.mutate(
      {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        position: form.position,
        address: form.address,
        joiningDate: form.joiningDate,
        salary: Number(form.salary),
      },
      {
        onSuccess: () => {
          setSubmitting(false);
          setForm(initialState);
          onClose();
        },
        onError: (error: any) => {
          setSubmitting(false);
          toast.error('Failed to add employee.');
        },
      }
    );
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Employee"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            id="employee-fullName"
            label="Full Name"
            type="text"
            value={form.fullName ? form.fullName.charAt(0).toUpperCase() + form.fullName.slice(1) : ''}
            placeholder="Enter full name"
            Icon={User}
            onChange={handleChange('fullName')}
          />
          {errors.fullName && <div className="text-red-400 text-xs mb-2">{errors.fullName}</div>}
          <InputField
            id="employee-email"
            label="Email"
            type="email"
            value={form.email}
            placeholder="Enter email address"
            Icon={Mail}
            onChange={handleChange('email')}
          />
          {errors.email && <div className="text-red-400 text-xs mb-2">{errors.email}</div>}
          <InputField
            id="employee-phone"
            label="Phone Number"
            type="text"
            value={form.phone}
            placeholder="Enter phone number"
            Icon={Phone}
            onChange={handleChange('phone')}
            maxLength={11}
          />
          {errors.phone && <div className="text-red-400 text-xs mb-2">{errors.phone}</div>}
          <InputField
            id="employee-position"
            label="Position"
            type="text"
            value={form.position ? form.position.charAt(0).toUpperCase() + form.position.slice(1) : ''}
            placeholder="Enter position"
            Icon={Briefcase}
            onChange={handleChange('position')}
          />
          {errors.position && <div className="text-red-400 text-xs mb-2">{errors.position}</div>}

          <InputField
            id="employee-address"
            label="Address"
            type="text"
            value={form.address ? form.address.charAt(0).toUpperCase() + form.address.slice(1) : ''}
            placeholder="Enter address"
            Icon={MapPin}
            onChange={handleChange('address')}
          />
          {errors.address && <div className="text-red-400 text-xs mb-2">{errors.address}</div>}
          <InputField
            id="employee-joiningDate"
            label="Joining Date"
            type="date"
            value={form.joiningDate}
            placeholder="Select joining date"
            Icon={CalendarDays}
            onChange={handleChange('joiningDate')}
          />
          {errors.joiningDate && <div className="text-red-400 text-xs mb-2">{errors.joiningDate}</div>}
          <InputField
            id="employee-salary"
            label="Salary"
            type="number"
            value={form.salary}
            placeholder="Enter salary"
            Icon={() => <span className="text-base font-semibold">PKR</span>}
            onChange={handleChange('salary')}
          />
          {errors.salary && <div className="text-red-400 text-xs mb-2">{errors.salary}</div>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <ActionButton onClick={onClose} icon={null} variant="secondary" disabled={submitting}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" icon={null} variant="primary" className="ml-2" disabled={submitting}>
            Save
          </ActionButton>
        </div>
      </form>
    </FormModal>
  );
};

export default AddEmployeeDialog;
