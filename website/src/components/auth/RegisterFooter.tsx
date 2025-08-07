import React from 'react';
import { Link } from 'react-router-dom';

const RegisterFooter: React.FC = () => {
  return (
    <>
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/70">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>

      {/* Terms */}
      <div className="mt-6 text-center">
        <p className="text-xs text-white/50">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-orange-400 hover:text-orange-300 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterFooter;
