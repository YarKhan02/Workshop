import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { RegisterFormData, AuthState, ValidationErrors } from '../services/interfaces/auth';

export const useRegister = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [state, setState] = useState<AuthState>({
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
  });

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const success = await signup(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password
      );
      
      if (success) {
        toast.success('Registration successful!');
        navigate('/');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setState(prev => ({ ...prev, showPassword: !prev.showPassword }));
    } else {
      setState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }));
    }
  };

  return {
    formData,
    loading: state.loading,
    showPassword: state.showPassword,
    showConfirmPassword: state.showConfirmPassword,
    handleSubmit,
    handleChange,
    togglePasswordVisibility,
  };
};
