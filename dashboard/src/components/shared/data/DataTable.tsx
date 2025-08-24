import React from 'react';
import { darkTheme } from '../../../styles/themes';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface Action<T> {
  label: string;
  icon: React.ComponentType<any>;
  onClick: (item: T) => void;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  onRowClick?: (item: T) => void;
}

const DataTable = <T,>({
  data,
  columns,
  actions,
  isLoading = false,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...',
  onRowClick,
}: DataTableProps<T>) => {
  if (isLoading) {
    return (
      <div className={darkTheme.components.table.container}>
        <div className={darkTheme.components.table.loadingState}>
          <div className={darkTheme.components.table.loadingSpinner}></div>
          <p className={`mt-2 ${darkTheme.textPrimary}`}>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={darkTheme.components.table.container}>
        <div className={darkTheme.components.table.emptyState}>
          <div className={darkTheme.textPrimary}>
            <p className={darkTheme.components.table.emptyStateTitle}>{emptyMessage}</p>
            <p className={darkTheme.components.table.emptyStateSubtitle}>No items match your current filters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkTheme.components.table.container}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={darkTheme.primary}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={darkTheme.components.table.headerCell}>
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className={darkTheme.components.table.headerCellActions}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600/30">
            {data.map((item, index) => (
              <tr 
                key={index} 
                className={`${darkTheme.home.sectionBg} ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={darkTheme.components.table.cell}>
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className={darkTheme.components.table.actionsCell}>
                    <div className={darkTheme.components.table.actionsContainer}>
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(item)}
                          className={action.className || darkTheme.components.table.actionButton}
                          title={action.label}
                        >
                          {React.createElement(action.icon, { size: 16 })}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
