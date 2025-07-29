import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// ==================== STYLES & CONSTANTS ====================
const STYLES = {
  container: {
    background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 70%, #020617 100%)',
    fontFamily: '"Inter", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  },
  button: {
    default: 'linear-gradient(180deg, #FF8A65 0%, #FF7043 100%)',
    hover: 'linear-gradient(180deg, #FF9E80 0%, #FF8A65 100%)'
  },
  input: {
    borderRadius: '4px',
    color: '#E0E0E0'
  },
  typography: {
    heading: { fontWeight: 500 },
    label: { fontWeight: 300, color: '#A0A0A0' },
    footer: { fontWeight: 300, color: '#64748B' }
  }
};

const ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  form: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" }
  },
  footer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, delay: 0.4 }
  },
  button: {
    hover: { scale: 1.01, y: -2 },
    tap: { scale: 0.98, y: 1 }
  }
};

// ==================== MAIN COMPONENT ====================
const Login: React.FC = () => {
  // State Management
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  // Event Handlers
  const handleInputChange = (field: 'username' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Input Focus Handlers
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = '0 0 0 1px #FF7043, 0 0 8px rgba(255, 112, 67, 0.15)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = 'none';
  };

  // Button Hover Handlers
  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.background = STYLES.button.hover;
    }
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.background = STYLES.button.default;
    }
  };

  // ==================== RENDER HELPERS ====================
  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-8"
    >
      <h1 
        className="text-4xl font-medium text-slate-50 mb-3 tracking-tight" 
        style={STYLES.typography.heading}
      >
        Welcome Back
      </h1>
      <p 
        className="text-slate-400 text-base" 
        style={STYLES.typography.label}
      >
        Access your <span className="text-orange-400/90 font-normal">Detailing Hub</span> command center
      </p>
    </motion.div>
  );

  const renderLeftSide = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-gray-800 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center w-full p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full text-center"
        >
          {/* Large Logo */}
          <div className="mb-8">
            <img 
              src="/assets/logo-512.png" 
              alt="Detailing Hub" 
              className="w-full max-w-sm mx-auto object-contain filter drop-shadow-2xl"
            />
          </div>
          
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Professional Car Detailing
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Powered by <span className="text-orange-400 font-semibold">BIKE DOCTORS</span>
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Excellence • Precision • Care
            </p>
          </motion.div>
        </motion.div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );

  const renderInputField = (
    id: string,
    label: string,
    type: string,
    value: string,
    placeholder: string,
    Icon: React.ComponentType<{ className?: string }>,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    hasToggle?: boolean
  ) => (
    <div>
      <label 
        htmlFor={id}
        className="block text-sm text-slate-400 mb-3 transition-all duration-200"
        style={STYLES.typography.label}
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400/80 transition-colors duration-200" />
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          value={value}
          onChange={onChange}
          className={`block w-full pl-12 ${hasToggle ? 'pr-12' : 'pr-4'} py-4 border border-slate-600/50 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400/80 focus:border-orange-400/80 bg-slate-800/50 text-slate-100 placeholder-slate-500 transition-all duration-200 hover:border-orange-400/60`}
          style={STYLES.input}
          placeholder={placeholder}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {hasToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-700/30 rounded-r-md transition-all duration-200"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-slate-500 hover:text-orange-400/80 transition-colors duration-200" />
            ) : (
              <EyeIcon className="h-5 w-5 text-slate-500 hover:text-orange-400/80 transition-colors duration-200" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  const renderSubmitButton = () => (
    <motion.button
      whileHover={ANIMATIONS.button.hover}
      whileTap={ANIMATIONS.button.tap}
      type="submit"
      disabled={isLoading}
      className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-medium rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
      style={{
        background: STYLES.button.default,
        borderRadius: '8px',
        fontWeight: 500
      }}
      onMouseEnter={handleButtonMouseEnter}
      onMouseLeave={handleButtonMouseLeave}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          <span style={{ fontWeight: 500 }}>Initializing...</span>
        </div>
      ) : (
        <span style={{ fontWeight: 500 }}>Access Command Center</span>
      )}
    </motion.button>
  );

  const renderFooter = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="text-center text-xs"
      style={STYLES.typography.footer}
    >
      <p style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
        Detailing Hub • Peak Performance Management
      </p>
      <p style={{ fontSize: '0.7rem', color: '#475569' }}>
        © 2024 All rights reserved
      </p>
    </motion.div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo/Branding */}
      {renderLeftSide()}
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8" style={STYLES.container}>
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/assets/logo-200x60.png" 
              alt="Detailing Hub" 
              className="h-16 w-auto mx-auto object-contain mb-4"
            />
          </div>

          {/* Header Section */}
          {renderHeader()}

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-slate-800/30 rounded-xl shadow-2xl p-8 lg:p-10 border border-slate-700/30 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              {renderInputField(
                'username',
                'Username or Email',
                'text',
                formData.username,
                'Enter your username or email',
                UserIcon,
                handleInputChange('username')
              )}

              {/* Password Field */}
              {renderInputField(
                'password',
                'Password',
                showPassword ? 'text' : 'password',
                formData.password,
                'Enter your password',
                LockClosedIcon,
                handleInputChange('password'),
                true
              )}

              {/* Submit Button */}
              {renderSubmitButton()}
            </form>
          </motion.div>

          {/* Footer Section */}
          {renderFooter()}
        </div>
      </div>
    </div>
  );
};

export default Login; 