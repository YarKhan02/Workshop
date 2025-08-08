import React from 'react';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: (isLogin: boolean) => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle }) => {
  return (
    <div className="flex mb-6">
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-3 px-4 text-center font-semibold rounded-lg transition-all duration-300 ${
          isLogin
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black'
            : 'text-white/60 hover:text-white hover:bg-orange-900/20'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-3 px-4 text-center font-semibold rounded-lg transition-all duration-300 ml-2 ${
          !isLogin
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black'
            : 'text-white/60 hover:text-white hover:bg-orange-900/20'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthToggle;
