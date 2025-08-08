import React from 'react';

const AuthBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-orange-600/10 rounded-full blur-xl"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-orange-600/15 to-transparent rounded-full blur-3xl"></div>
    </div>
  );
};

export default AuthBackground;
