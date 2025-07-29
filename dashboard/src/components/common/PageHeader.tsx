// Generic PageHeader Component - Reusable page header with title and actions

import React from 'react';

interface ActionButton {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  actionButton?: ActionButton;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  actionButton,
  className = "",
}) => {
  return (
    <div className={`bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 p-6 backdrop-blur-md ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-300 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {(actions || actionButton) && (
          <div className="flex items-center gap-4">
            {actions}
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  actionButton.variant === 'primary'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700'
                    : 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                {actionButton.icon && React.createElement(actionButton.icon, { className: "mr-2 h-5 w-5" })}
                {actionButton.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
