
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { theme } = useTheme();
  return (
    <div className={`${theme.header.container} rounded-xl shadow-2xl ${theme.header.border} p-6 backdrop-blur-md ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={`p-3 ${theme.header.iconBg} rounded-xl shadow-lg`}>
              {icon}
            </div>
          )}
          <div>
            <h1 className={`${theme.header.title} ${theme.header.titleGradient}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`${theme.header.subtitle} mt-1`}>{subtitle}</p>
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
                    ? theme.header.actionButtonPrimary
                    : theme.header.actionButtonSecondary
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
