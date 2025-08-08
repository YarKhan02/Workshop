import React from 'react';
import { Link } from 'react-router-dom';
import { themeClasses } from '../config/theme';
import { 
  AuthBackground,
  AuthHeader,
  AuthCard
} from '../components/auth';
import { LoginForm } from '../components/auth';
import { useLogin } from '../hooks/useLogin';

const Login: React.FC = () => {
  const {
    formData,
    error,
    loading,
    handleInputChange,
    handleSubmit
  } = useLogin();

  return (
    <div className={`${themeClasses.section.primary} min-h-screen flex items-center justify-center py-12 px-4`}>
      {/* Background Elements */}
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <AuthHeader isLogin={true} />

        {/* Form Card */}
        <AuthCard>
          <LoginForm
            isLogin={true}
            formData={formData}
            loading={loading}
            error={error}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </AuthCard>

        {/* Footer - Navigate to Register */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
