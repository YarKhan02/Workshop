import React from 'react';

const AuthBackground: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default AuthBackground;
