import React from 'react';
import { 
  AuthBackground,
  RegisterHeader,
  RegisterFormFields,
  RegisterFooter
} from '../components';
import Button from '../components/ui/Button';
import { useRegister } from '../hooks/useRegister';

const Register: React.FC = () => {
  const {
    formData,
    loading,
    showPassword,
    showConfirmPassword,
    handleSubmit,
    handleChange,
    togglePasswordVisibility,
  } = useRegister();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      {/* Background Elements */}
      <AuthBackground />

      <div className="relative max-w-md w-full">
        <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-orange-900/30 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <RegisterHeader
            title="Create Account"
            subtitle="Join Detailing Hub for premium car care"
          />

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <RegisterFormFields
              formData={formData}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword || false}
              isLoading={loading}
              onChange={handleChange}
              onTogglePassword={togglePasswordVisibility}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-4 text-lg font-bold shadow-lg hover:shadow-orange-500/25"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <RegisterFooter />
        </div>
      </div>
    </div>
  );
};

export default Register;