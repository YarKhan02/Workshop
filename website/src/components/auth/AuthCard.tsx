import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="bg-black/90 rounded-2xl shadow-2xl border border-orange-900/30 p-8">
      {children}
    </div>
  );
};

export default AuthCard;
