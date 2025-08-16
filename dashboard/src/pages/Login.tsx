import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/form/InputField';
import SubmitButton from '../components/form/SubmitButton';

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

// ==================== MAIN COMPONENT ====================
const Login: React.FC = () => {
  // State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  // Event Handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
              {/* Email Field */}
              <InputField
                id="email"
                label="Email"
                type="email"
                value={email}
                placeholder="Enter your email"
                Icon={UserIcon}
                onChange={handleEmailChange}
                showPassword={false}
              />

              {/* Password Field */}
              <InputField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Enter your password"
                Icon={LockClosedIcon}
                onChange={handlePasswordChange}
                hasToggle={true}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />

              {/* Submit Button */}
              <SubmitButton isLoading={isLoading} />
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