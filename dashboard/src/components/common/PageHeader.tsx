import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionButton,
  breadcrumbs,
}) => {
  const getButtonStyles = (variant: string = 'primary') => {
    const baseStyles = 'flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105';
    const variants = {
      primary: 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700',
      secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800',
      success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
    };
    return `${baseStyles} ${variants[variant as keyof typeof variants]}`;
  };

  return (
    <div className="space-y-4">
      {breadcrumbs && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-500">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="text-orange-400 hover:text-orange-300 transition-colors duration-200">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-400">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{title}</h1>
          {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
        </div>
        
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className={getButtonStyles(actionButton.variant)}
          >
            <actionButton.icon size={20} />
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
