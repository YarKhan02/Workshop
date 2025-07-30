// ==================== TABLE HEADER COMPONENT ====================

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/themeUtils';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
}) => {
  const { theme } = useTheme();

  return (
    <div className={cn(theme.components.table.header, className)}>
      {children}
    </div>
  );
};
