import React, { useState, useEffect } from 'react';
import { FormModal } from '../../shared';
import InputField from '../../form/InputField';
import ActionButton from '../../shared/buttons/ActionButton';
import { User, Mail, Phone, Briefcase, MapPin, CreditCard, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateEmployee } from '../../../api/employee';
import { useQueryClient } from '@tanstack/react-query';

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

export interface EditEmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  position: string;
  address: string;
  salary: string;
}

const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({ isOpen, onClose, employee }) => {
  const [form, setForm] = useState<EditEmployeeFormData>({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    position: '',
    address: '',
    salary: '',
  });
  const [errors, setErrors] = useState<Partial<EditEmployeeFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (employee) {
      setForm({
        fullName: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        nic: employee.nic || '',
        position: employee.position || '',
        address: employee.address || '',
        salary: employee.salary ? String(employee.salary) : '',
      });
    }
  }, [employee]);

  const validate = (): boolean => {
    const newErrors: Partial<EditEmployeeFormData> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone Number is required';
    if (!form.position.trim()) newErrors.position = 'Position is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.salary.trim() || isNaN(Number(form.salary))) newErrors.salary = 'Salary is required and must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof EditEmployeeFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      await updateEmployee(employee.id, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        nic: form.nic,
        position: form.position,
        address: form.address,
        salary: Number(form.salary),
      });
      
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      setSubmitting(false);
      toast.success('Employee updated successfully');
      onClose();
    } catch (error) {
      setSubmitting(false);
      toast.error('Failed to update employee');
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            id="edit-employee-fullName"
            label="Full Name"
            type="text"
            value={form.fullName ? form.fullName.charAt(0).toUpperCase() + form.fullName.slice(1) : ''}
            placeholder="Enter full name"
            Icon={User}
            onChange={handleChange('fullName')}
          />
          {errors.fullName && <div className="text-red-400 text-xs mb-2">{errors.fullName}</div>}
          
          <InputField
            id="edit-employee-email"
            label="Email"
            type="email"
            value={form.email}
            placeholder="Enter email address"
            Icon={Mail}
            onChange={handleChange('email')}
          />
          {errors.email && <div className="text-red-400 text-xs mb-2">{errors.email}</div>}
          
          <InputField
            id="edit-employee-phone"
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
            id="edit-employee-nic"
            label="NIC"
            type="text"
            value={form.nic}
            placeholder="Enter NIC number"
            Icon={CreditCard}
            onChange={handleChange('nic')}
          />
          {errors.nic && <div className="text-red-400 text-xs mb-2">{errors.nic}</div>}
          
          <InputField
            id="edit-employee-position"
            label="Position"
            type="text"
            value={form.position ? form.position.charAt(0).toUpperCase() + form.position.slice(1) : ''}
            placeholder="Enter position"
            Icon={Briefcase}
            onChange={handleChange('position')}
          />
          {errors.position && <div className="text-red-400 text-xs mb-2">{errors.position}</div>}

          <InputField
            id="edit-employee-address"
            label="Address"
            type="text"
            value={form.address ? form.address.charAt(0).toUpperCase() + form.address.slice(1) : ''}
            placeholder="Enter address"
            Icon={MapPin}
            onChange={handleChange('address')}
          />
          {errors.address && <div className="text-red-400 text-xs mb-2">{errors.address}</div>}
          
          <InputField
            id="edit-employee-salary"
            label="Salary"
            type="number"
            value={form.salary}
            placeholder="Enter salary amount"
            Icon={DollarSign}
            onChange={handleChange('salary')}
          />
          {errors.salary && <div className="text-red-400 text-xs mb-2">{errors.salary}</div>}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <ActionButton 
            onClick={onClose} 
            icon={null} 
            variant="secondary"
            type="button"
          >
            Cancel
          </ActionButton>
          <ActionButton 
            icon={null} 
            variant="primary" 
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Employee'}
          </ActionButton>
        </div>
      </form>
    </FormModal>
  );
};

export default EditEmployeeDialog;
