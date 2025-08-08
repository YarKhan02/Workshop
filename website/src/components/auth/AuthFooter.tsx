import React from 'react';

interface AuthFooterProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ isLogin, onToggle }) => {
  return (
    <>
      {/* Terms and Privacy - Only for Sign Up */}
      {!isLogin && (
        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors duration-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors duration-300">
              Privacy Policy
            </a>
          </p>
        </div>
      )}

      {/* Toggle Between Login/Sign Up */}
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={onToggle}
            className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-300"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </>
  );
};

export default AuthFooter;
